const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const sessionManager = require('./sessionManager');
const ptyManager = require('./ptyManager');
const historyStore = require('./historyStore');
const restRouter = require('./restRouter');

const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());
app.use('/api', restRouter);

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/ws')) return next();
  res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
    if (err) res.status(200).send('Web Terminal Manager backend running. React client is not built yet.');
  });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const urlParts = request.url.split('?');
  const pathname = urlParts[0];

  if (pathname === '/ws') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

wss.on('connection', (ws, req) => {
  const urlParts = req.url.split('?');
  const queryStr = urlParts[1] || '';
  const params = new URLSearchParams(queryStr);

  const tabId = params.get('tabId');
  const cols = parseInt(params.get('cols')) || 80;
  const rows = parseInt(params.get('rows')) || 24;
  const command = params.get('command') || '';
  const cwd = params.get('cwd') || '';

  if (!tabId) {
    ws.close(1008, 'Missing tabId parameter');
    return;
  }

  const existingSession = sessionManager.getSession(tabId);
  if (!existingSession) {
    sessionManager.createSession(tabId, '', command, cwd);
  } else {
    if (command !== undefined) existingSession.command = command;
    if (cwd !== undefined) existingSession.cwd = cwd;
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
    } catch (e) {}
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

server.listen(PORT, () => {
  console.log(`WebTerm server running at http://localhost:${PORT}`);
});
