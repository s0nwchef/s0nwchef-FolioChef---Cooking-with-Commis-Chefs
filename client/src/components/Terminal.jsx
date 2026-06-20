import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';

const WS_BASE = `ws://localhost:3001/ws`;

const THEMES = {
  'Expedition 33': {
    background: '#0A0B14', foreground: '#E8E0D0', cursor: '#C9A96E', cursorAccent: '#0A0B14',
    black: '#1A1820', red: '#C97B8A', green: '#8BAF7A', yellow: '#C9A96E', blue: '#7A9BBF',
    magenta: '#B07AAF', cyan: '#7ABFB0', white: '#E8E0D0',
    brightBlack: '#4A4858', brightRed: '#D4899A', brightGreen: '#9BBF8A', brightYellow: '#D4B97E',
    brightBlue: '#8AABCF', brightMagenta: '#C08ABF', brightCyan: '#8ACFBF', brightWhite: '#F2EAE0',
  },
  Dracula: {
    background: '#282a36', foreground: '#f8f8f2', cursor: '#ff79c6', cursorAccent: '#282a36',
    black: '#21222c', red: '#ff5555', green: '#50fa7b', yellow: '#f1fa8c', blue: '#bd93f9',
    magenta: '#ff79c6', cyan: '#8be9fd', white: '#f8f8f2',
    brightBlack: '#6272a4', brightRed: '#ff6e6e', brightGreen: '#69ff94', brightYellow: '#ffffa5',
    brightBlue: '#d6acff', brightMagenta: '#ff92df', brightCyan: '#a4ffff', brightWhite: '#ffffff',
  },
  Nord: {
    background: '#2e3440', foreground: '#d8dee9', cursor: '#88c0d0', cursorAccent: '#2e3440',
    black: '#3b4252', red: '#bf616a', green: '#a3be8c', yellow: '#ebcb8b', blue: '#81a1c1',
    magenta: '#b48ead', cyan: '#88c0d0', white: '#e5e9f0',
    brightBlack: '#4c566a', brightRed: '#bf616a', brightGreen: '#a3be8c', brightYellow: '#ebcb8b',
    brightBlue: '#81a1c1', brightMagenta: '#b48ead', brightCyan: '#8fbcbb', brightWhite: '#eceff4',
  },
  'Solarized Dark': {
    background: '#002b36', foreground: '#839496', cursor: '#268bd2', cursorAccent: '#002b36',
    black: '#073642', red: '#dc322f', green: '#859900', yellow: '#b58900', blue: '#268bd2',
    magenta: '#d33682', cyan: '#2aa198', white: '#eee8d5',
    brightBlack: '#002b36', brightRed: '#cb4b16', brightGreen: '#586e75', brightYellow: '#657b83',
    brightBlue: '#839496', brightMagenta: '#6c71c4', brightCyan: '#93a1a1', brightWhite: '#fdf6e3',
  },
};

function loadSettings() {
  try { const r = localStorage.getItem('terminal-settings'); return r ? JSON.parse(r) : null; } catch { return null; }
}

function getThemeBackground() {
  const saved = loadSettings();
  const themeName = saved?.theme && THEMES[saved.theme] ? saved.theme : 'Expedition 33';
  if (saved?.theme === 'Custom' && saved?.customBg) return saved.customBg;
  return THEMES[themeName].background;
}

function buildOptions() {
  const saved = loadSettings();
  const themeName = saved?.theme && THEMES[saved.theme] ? saved.theme : 'Expedition 33';
  return {
    cursorBlink: true,
    cursorStyle: 'underline',
    fontSize: saved?.fontSize ?? 14,
    fontFamily: saved?.fontFamily ?? 'Courier Prime, Courier New, monospace',
    letterSpacing: 0,
    lineHeight: 1.6,
    theme: { ...THEMES[themeName], background: getThemeBackground() },
    cols: 80,
    rows: 24,
  };
}

export default function TerminalPane({ tab, isActive, onReady }) {
  const containerRef = useRef(null);
  const wsRef = useRef(null);
  const termRef = useRef(null);
  const fitAddonRef = useRef(null);
  const readyCalled = useRef(false);

  useEffect(() => {
    if (!tab || !containerRef.current) return;
    readyCalled.current = false;

    const term = new Terminal(buildOptions());
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    if (onReady && !readyCalled.current) {
      readyCalled.current = true;
      onReady(tab.id, term, fitAddon);
    }

    fetch(`/api/history/${tab.id}`)
      .then(r => r.json())
      .then(history => {
        if (Array.isArray(history)) history.forEach(chunk => term.write(chunk));
      })
      .catch(() => {});

    const { cols, rows } = term;
    const url = `${WS_BASE}?tabId=${tab.id}&cols=${cols}&rows=${rows}&command=${encodeURIComponent(tab.command || '')}&cwd=${encodeURIComponent(tab.cwd || '')}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'output') term.write(msg.data);
        if (msg.type === 'exit') term.write('\r\n\x1b[33m[Process exited]\x1b[0m\r\n');
      } catch (err) {}
    };

    term.onData(data => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'input', data }));
      }
    });

    const resizeObserver = new ResizeObserver(() => {
      try {
        fitAddon.fit();
        const { cols, rows } = term;
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'resize', cols, rows }));
        }
      } catch (err) {}
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      ws.close();
      term.dispose();
      termRef.current = null;
      fitAddonRef.current = null;
    };
  }, [tab?.id]);

  return (
    <div
      ref={containerRef}
      style={{
        display: isActive ? 'block' : 'none',
        width: '100%',
        height: '100%',
      }}
    />
  );
}
