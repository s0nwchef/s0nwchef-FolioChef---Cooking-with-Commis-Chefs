const fs = require('fs');
const path = require('path');

function getDataDir() {
  if (process.env.FOLIOCHEF_DATA) {
    return process.env.FOLIOCHEF_DATA;
  }
  try {
    const { app } = require('electron');
    if (app && app.isPackaged) {
      return path.join(app.getPath('userData'), 'data');
    }
  } catch (e) { /* not in electron */ }
  return path.join(__dirname, '../data');
}

const DATA_DIR = getDataDir();
const HISTORY_DIR = path.join(DATA_DIR, 'history');
const TABS_FILE = path.join(DATA_DIR, 'tabs.json');

if (!fs.existsSync(HISTORY_DIR)) {
  fs.mkdirSync(HISTORY_DIR, { recursive: true });
}
const tabsDir = path.dirname(TABS_FILE);
if (!fs.existsSync(tabsDir)) {
  fs.mkdirSync(tabsDir, { recursive: true });
}

function saveHistory(tabId, buffer) {
  try {
    const filePath = path.join(HISTORY_DIR, `${tabId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(buffer || []));
  } catch (e) {
    console.error(`Error saving history for tab ${tabId}:`, e);
  }
}

function loadHistory(tabId) {
  try {
    const filePath = path.join(HISTORY_DIR, `${tabId}.json`);
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    console.error(`Error loading history for tab ${tabId}:`, e);
    return [];
  }
}

function deleteHistory(tabId) {
  try {
    const filePath = path.join(HISTORY_DIR, `${tabId}.json`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error(`Error deleting history for tab ${tabId}:`, e);
  }
}

function saveTabs(tabs) {
  try {
    fs.writeFileSync(TABS_FILE, JSON.stringify(tabs || [], null, 2));
  } catch (e) {
    console.error('Error saving tabs:', e);
  }
}

function loadTabs() {
  try {
    if (!fs.existsSync(TABS_FILE)) return [];
    return JSON.parse(fs.readFileSync(TABS_FILE, 'utf8'));
  } catch (e) {
    console.error('Error loading tabs:', e);
    return [];
  }
}

module.exports = { saveHistory, loadHistory, deleteHistory, saveTabs, loadTabs };
