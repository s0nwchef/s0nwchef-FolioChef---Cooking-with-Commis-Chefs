const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

const isDev = !app.isPackaged;

let mainWindow = null;
let server = null;
let actualPort = 0;

function getAppRoot() {
  if (isDev) return path.join(__dirname, '..');
  return app.getAppPath();
}

function resolve(mod) {
  return require(path.join(getAppRoot(), mod));
}

function createServer() {
  const express = resolve('node_modules/express');
  const WebSocket = resolve('node_modules/ws');
  const sessionManager = resolve('server/sessionManager');
  const ptyManager = resolve('server/ptyManager');
  const restRouter = resolve('server/restRouter');

  return new Promise((resolveP, reject) => {
    const appExpress = express();
    appExpress.use(express.json());
    appExpress.use('/api', restRouter);

    const clientDist = path.join(getAppRoot(), 'client', 'dist');
    appExpress.use(express.static(clientDist));

    appExpress.use((req, res) => {
      res.sendFile(path.join(clientDist, 'index.html'), (err) => {
        if (err) res.status(200).send('FolioChef is running.');
      });
    });

    server = require('http').createServer(appExpress);
    const wss = new WebSocket.Server({ noServer: true });

    server.on('upgrade', (request, socket, head) => {
      const urlParts = request.url.split('?');
      if (urlParts[0] === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });

    wss.on('connection', (ws, req) => {
      const params = new URLSearchParams(req.url.split('?')[1] || '');
      const tabId = params.get('tabId');
      const cols = parseInt(params.get('cols')) || 80;
      const rows = parseInt(params.get('rows')) || 24;
      const command = params.get('command') || '';
      const cwd = params.get('cwd') || '';

      if (!tabId) { ws.close(1008, 'Missing tabId'); return; }

      const existing = sessionManager.getSession(tabId);
      if (!existing) {
        sessionManager.createSession(tabId, '', command, cwd);
      } else {
        if (command) existing.command = command;
        if (cwd) existing.cwd = cwd;
      }

      sessionManager.setupPtyForSession(tabId, ws, cols, rows);

      ws.on('message', (msg) => {
        try {
          const parsed = JSON.parse(msg);
          const session = sessionManager.getSession(tabId);
          if (!session || !session.ptyProcess) return;
          if (parsed.type === 'input') {
            session.ptyProcess.write(parsed.data);
          } else if (parsed.type === 'resize') {
            const c = parseInt(parsed.cols) || 80;
            const r = parseInt(parsed.rows) || 24;
            session.cols = c;
            session.rows = r;
            ptyManager.resizePty(session.ptyProcess, c, r);
          }
        } catch (e) { /* ignore */ }
      });

      ws.on('close', () => {
        const session = sessionManager.getSession(tabId);
        if (session) {
          if (session.ptyProcess) {
            ptyManager.killPty(session.ptyProcess);
            session.ptyProcess = null;
          }
          session.ws = null;
        }
      });
    });

    server.listen(0, '127.0.0.1', () => {
      actualPort = server.address().port;
      console.log(`FolioChef server on http://127.0.0.1:${actualPort}`);
      resolveP();
    });

    server.on('error', reject);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'FolioChef',
    backgroundColor: '#121212',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });

  mainWindow.loadURL(`http://127.0.0.1:${actualPort}`);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  try {
    await createServer();
    createWindow();
  } catch (err) {
    console.error('Failed to start FolioChef:', err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (server) server.close();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
