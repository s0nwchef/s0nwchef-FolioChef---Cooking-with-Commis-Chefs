import { useState, useEffect, useRef } from 'react';

const THEMES = {
  'Spotify Dark': {
    background: '#121212', foreground: '#FFFFFF', cursor: '#1ED760', cursorAccent: '#121212',
    black: '#121212', red: '#E61E32', green: '#1ED760', yellow: '#BD5839', blue: '#1078C0',
    magenta: '#B85860', cyan: '#687A80', white: '#FFFFFF',
    brightBlack: '#1F1F1F', brightRed: '#E61E32', brightGreen: '#1ED760', brightYellow: '#BD5839',
    brightBlue: '#1078C0', brightMagenta: '#B85860', brightCyan: '#687A80', brightWhite: '#FFFFFF',
  },
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

const FONT_OPTIONS = [
  'Courier Prime, Courier New, monospace',
  'JetBrains Mono, monospace',
  'Fira Code, monospace',
  'Courier New, monospace',
  'Consolas, monospace',
  'monospace',
];

const STORAGE_KEY = 'terminal-settings';

function loadFromLS(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null; } catch { return null; }
}

function saveToLS(key, val) {
  if (val == null) localStorage.removeItem(key);
  else localStorage.setItem(key, JSON.stringify(val));
}

const slider = [
  'flex-1 h-1.5 appearance-none bg-neutral-dark-3 rounded-full outline-none cursor-pointer',
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5',
  '[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-spotify-green [&::-webkit-slider-thumb]:cursor-pointer',
].join(' ');

const selectCls = [
  'w-full bg-surface-container border border-spotify-green/30 text-neutral-white text-body rounded-card px-3 py-2',
  'outline-none cursor-pointer focus:border-spotify-green/70',
].join(' ');

function getInitialSettings() {
  const saved = loadFromLS(STORAGE_KEY);
  return {
    fontSize: saved?.fontSize ?? 14,
    fontFamily: saved?.fontFamily ?? FONT_OPTIONS[0],
    theme: saved?.theme ?? 'Spotify Dark',
    customBg: saved?.customBg ?? '#121212',
  };
}

export default function SettingsPanel({ term, fitAddon, onClose }) {
  const [fontSize, setFontSize] = useState(() => getInitialSettings().fontSize);
  const [fontFamily, setFontFamily] = useState(() => getInitialSettings().fontFamily);
  const [selectedTheme, setSelectedTheme] = useState(() => getInitialSettings().theme);
  const [customBg, setCustomBg] = useState(() => getInitialSettings().customBg);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current && term) {
      const saved = loadFromLS(STORAGE_KEY);
      if (saved) applyTermSettings(saved, term, fitAddon);
      isInitialMount.current = false;
    }
  }, [term, fitAddon]);

  function applyTermSettings(settings, t, fit) {
    t.options.fontSize = settings.fontSize ?? 14;
    t.options.fontFamily = settings.fontFamily ?? FONT_OPTIONS[0];
    if (settings.theme && THEMES[settings.theme]) {
      t.options.theme = { ...THEMES[settings.theme] };
    } else if (settings.customBg) {
      t.options.theme = { ...(t.options.theme || {}), background: settings.customBg };
    }
    if (fit) setTimeout(() => fit.fit(), 0);
  }

  function persistTermSettings(overrides) {
    const s = { fontSize, fontFamily, theme: selectedTheme, customBg: selectedTheme === 'Custom' ? customBg : undefined, ...overrides };
    saveToLS(STORAGE_KEY, s);
    return s;
  }

  function updateTerm(overrides) {
    const s = persistTermSettings(overrides);
    if (term) applyTermSettings(s, term, fitAddon);
  }

  function handleThemeSelect(v) {
    setSelectedTheme(v);
    if (THEMES[v]) {
      setCustomBg(THEMES[v].background);
    }
    updateTerm({ theme: v });
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-end" onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        className="relative z-50 w-80 mt-14 mr-4 bg-surface-container border border-spotify-green/40 rounded-card shadow-overlay overflow-hidden"
        style={{ animation: 'panelIn 150ms ease', maxHeight: 'calc(100vh - 100px)' }}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-spotify-green/20 shrink-0">
          <span className="text-neutral-white font-sans text-body font-semibold tracking-wide">Terminal Settings</span>
          <button onClick={onClose} className="text-interactive-light hover:text-neutral-white text-lg leading-none transition-colors">&times;</button>
        </div>

        <div className="p-4 space-y-4 font-sans overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
          <div>
            <label className="text-interactive-light text-body-sm uppercase tracking-wider block mb-2">Font Size</label>
            <div className="flex items-center gap-3">
              <input type="range" min="10" max="24" step="1" value={fontSize}
                onChange={e => { const v = Number(e.target.value); setFontSize(v); updateTerm({ fontSize: v }); }}
                className={slider} />
              <span className="text-neutral-white font-mono text-caption w-6 text-right">{fontSize}</span>
            </div>
          </div>

          <div>
            <label className="text-interactive-light text-body-sm uppercase tracking-wider block mb-2">Font Family</label>
            <select value={fontFamily}
              onChange={e => { const v = e.target.value; setFontFamily(v); updateTerm({ fontFamily: v }); }}
              className={selectCls}>
              {FONT_OPTIONS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
            </select>
          </div>

          <div>
            <label className="text-interactive-light text-body-sm uppercase tracking-wider block mb-2">Theme Preset</label>
            <select value={selectedTheme}
              onChange={e => handleThemeSelect(e.target.value)}
              className={selectCls}>
              {Object.keys(THEMES).map(t => <option key={t} value={t}>{t}</option>)}
              <option value="Custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="text-interactive-light text-body-sm uppercase tracking-wider block mb-2">Background Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={customBg}
                onChange={e => { const v = e.target.value; setCustomBg(v); setSelectedTheme('Custom'); updateTerm({ theme: 'Custom', customBg: v }); }}
                className="w-9 h-9 rounded-card cursor-pointer border border-spotify-green/30 bg-transparent p-0.5" />
              <span className="text-interactive-light font-mono text-caption">{customBg}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
