const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const historyStore = require('./historyStore');
const sessionManager = require('./sessionManager');

router.get('/tabs', (req, res) => {
  try {
    const tabs = historyStore.loadTabs();
    res.json(tabs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/tabs', (req, res) => {
  try {
    const { name, command, cwd } = req.body;
    const tab = { id: uuidv4(), name: name || 'Terminal', command: command || '', cwd: cwd || '' };
    const tabs = historyStore.loadTabs();
    tabs.push(tab);
    historyStore.saveTabs(tabs);
    sessionManager.createSession(tab.id, tab.name, tab.command, tab.cwd);
    res.json(tab);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/tabs/:id', (req, res) => {
  try {
    const { id } = req.params;
    let tabs = historyStore.loadTabs();
    tabs = tabs.filter(t => t.id !== id);
    historyStore.saveTabs(tabs);
    historyStore.deleteHistory(id);
    sessionManager.deleteSession(id);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.patch('/tabs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, command, cwd } = req.body;
    let tabs = historyStore.loadTabs();
    tabs = tabs.map(t => {
      if (t.id === id) {
        const updated = { ...t };
        if (name !== undefined) updated.name = name;
        if (command !== undefined) updated.command = command;
        if (cwd !== undefined) updated.cwd = cwd;
        return updated;
      }
      return t;
    });
    historyStore.saveTabs(tabs);
    const session = sessionManager.getSession(id);
    if (session) {
      if (name !== undefined) session.tabName = name;
      if (command !== undefined) session.command = command;
      if (cwd !== undefined) session.cwd = cwd;
    }
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/history/:id', (req, res) => {
  try {
    const history = historyStore.loadHistory(req.params.id);
    res.json(history);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/history/:id', (req, res) => {
  try {
    const { id } = req.params;
    historyStore.deleteHistory(id);
    const session = sessionManager.getSession(id);
    if (session) session.outputBuffer = [];
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/tabs/:id/restart', (req, res) => {
  try {
    const { id } = req.params;
    const session = sessionManager.getSession(id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const cols = session.cols || 80;
    const rows = session.rows || 24;
    if (session.ws) {
      sessionManager.setupPtyForSession(id, session.ws, cols, rows);
      res.json({ ok: true });
    } else {
      if (session.ptyProcess) {
        const ptyManager = require('./ptyManager');
        ptyManager.killPty(session.ptyProcess);
        session.ptyProcess = null;
      }
      res.json({ ok: true, message: 'Process cleared. It will spawn on next WebSocket connection.' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
