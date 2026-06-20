const ptyManager = require('./ptyManager');
const sessions = new Map();
const MAX_BUFFER_LINES = 5000;
const FLUSH_INTERVAL_MS = 5000;
const FLUSH_THRESHOLD = 100;

let historyStore;
try {
  historyStore = require('./historyStore');
} catch (e) {}

function getHistoryStore() {
  if (!historyStore) historyStore = require('./historyStore');
  return historyStore;
}

function createSession(tabId, tabName, command, cwd) {
  const store = getHistoryStore();
  const existingHistory = store.loadHistory(tabId);
  sessions.set(tabId, {
    ptyProcess: null,
    outputBuffer: existingHistory || [],
    tabName: tabName || 'Terminal',
    command: command || '',
    cwd: cwd || '',
    cols: 80,
    rows: 24,
    ws: null,
  });
}

function getSession(tabId) {
  return sessions.get(tabId);
}

function deleteSession(tabId) {
  const session = sessions.get(tabId);
  if (session && session.ptyProcess) {
    ptyManager.killPty(session.ptyProcess);
  }
  sessions.delete(tabId);
}

function setupPtyForSession(tabId, ws, cols, rows) {
  const session = sessions.get(tabId);
  if (!session) return null;

  if (session.ptyProcess) {
    ptyManager.killPty(session.ptyProcess);
  }

  session.ws = ws;
  session.cols = cols;
  session.rows = rows;

  const ptyProcess = ptyManager.spawnPty(session.command, cols, rows, session.cwd);
  session.ptyProcess = ptyProcess;

  ptyProcess.onData(data => {
    appendOutput(tabId, data);
    if (session.ws && session.ws.readyState === 1) {
      try {
        session.ws.send(JSON.stringify({ type: 'output', data }));
      } catch (e) {}
    }
  });

  ptyProcess.onExit(({ exitCode }) => {
    if (session.ws && session.ws.readyState === 1) {
      try {
        session.ws.send(JSON.stringify({ type: 'exit', exitCode }));
      } catch (e) {}
    }
  });

  return ptyProcess;
}

function appendOutput(tabId, data) {
  const session = sessions.get(tabId);
  if (!session) return;
  session.outputBuffer.push(data);
  if (session.outputBuffer.length > MAX_BUFFER_LINES) {
    session.outputBuffer = session.outputBuffer.slice(-MAX_BUFFER_LINES);
  }
  if (session.outputBuffer.length % FLUSH_THRESHOLD === 0) {
    getHistoryStore().saveHistory(tabId, session.outputBuffer);
  }
}

function getAllSessions() {
  return [...sessions.entries()];
}

setInterval(() => {
  const store = getHistoryStore();
  for (const [tabId, session] of sessions) {
    if (session.outputBuffer && session.outputBuffer.length > 0) {
      store.saveHistory(tabId, session.outputBuffer);
    }
  }
}, FLUSH_INTERVAL_MS);

process.on('SIGINT', () => {
  const store = getHistoryStore();
  for (const [tabId, session] of sessions) {
    if (session.outputBuffer && session.outputBuffer.length > 0) {
      store.saveHistory(tabId, session.outputBuffer);
    }
  }
  process.exit(0);
});

module.exports = {
  createSession,
  getSession,
  deleteSession,
  setupPtyForSession,
  appendOutput,
  getAllSessions,
  sessions,
};
