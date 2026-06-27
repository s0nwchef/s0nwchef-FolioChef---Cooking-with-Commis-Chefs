import { useEffect, useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TerminalPane from './components/Terminal';
import NewTabDialog from './components/NewTabDialog';
import SettingsPanel from './components/SettingsPanel';
import Footer from './components/Footer';
import useStore from './store';

export default function App() {
  const { tabs, activeTabId, setTabs, setActiveTab, addTab, removeTab } = useStore();
  const [showNewTabDialog, setShowNewTabDialog] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [termData, setTermData] = useState({});

  useEffect(() => {
    try { localStorage.removeItem('terminal-bg'); } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetch('/api/tabs')
      .then(r => r.json())
      .then(data => {
        setTabs(data);
        if (data.length > 0) setActiveTab(data[0].id);
      })
      .catch(() => {});
  }, []);

  const handleTermReady = useCallback((id, term, fitAddon) => {
    setTermData(prev => ({ ...prev, [id]: { term, fitAddon } }));
  }, []);

  const handleNewTab = (name, command, cwd) => {
    setShowNewTabDialog(false);
    fetch('/api/tabs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, command, cwd }),
    })
      .then(r => r.json())
      .then(tab => {
        addTab(tab);
        setActiveTab(tab.id);
      })
      .catch(() => {});
  };

  const handleCloseTab = async (id) => {
    await fetch(`/api/tabs/${id}`, { method: 'DELETE' });
    removeTab(id);
    setTermData(prev => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
  };

  const handleRestartProcess = async () => {
    if (!activeTabId) return;
    await fetch(`/api/tabs/${activeTabId}/restart`, { method: 'POST' });
  };

  const handleClearHistory = async () => {
    if (!activeTabId) return;
    await fetch(`/api/history/${activeTabId}`, { method: 'DELETE' });
  };

  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeTermData = termData[activeTabId] || { term: null, fitAddon: null };

  return (
    <>
      <Sidebar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={setActiveTab}
        onCloseTab={handleCloseTab}
        onNewTab={() => setShowNewTabDialog(true)}
      />

      <main className="flex flex-col flex-1 h-full bg-surface overflow-hidden">
        {activeTab && (
          <div className="flex items-center gap-4 px-8 py-2 bg-surface-container/40 border-b border-white/5 shrink-0">
            <button
              onClick={handleRestartProcess}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-spotify-green/25 text-spotify-green/80 hover:text-spotify-green hover:bg-spotify-green/8 rounded-pill text-body-sm uppercase tracking-wider transition-all duration-150"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Restart
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/10 text-interactive-light/60 hover:text-spotify-green hover:border-spotify-green/25 hover:bg-spotify-green/5 rounded-pill text-body-sm uppercase tracking-wider transition-all duration-150"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Clear
            </button>
            <button
              onClick={() => setShowSettings(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-pill text-body-sm uppercase tracking-wider transition-all duration-150 ${
                showSettings
                  ? 'bg-spotify-green/12 border-spotify-green/40 text-spotify-green'
                  : 'border-white/10 text-interactive-light/60 hover:text-spotify-green hover:border-spotify-green/25 hover:bg-spotify-green/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              Settings
            </button>
            <div className="ml-auto flex items-center gap-2 text-interactive-light/40 text-body-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-spotify-green/60" />
              {activeTab.name}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-hidden relative">
          <div className="w-full h-full rounded-card border border-spotify-green/15 overflow-hidden bg-surface shadow-overlay">
            <div className="h-7 bg-surface-container-low border-b border-white/8 flex items-center px-3 gap-1.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full border border-white/40 bg-surface/40" />
              <div className="w-2.5 h-2.5 rounded-full border border-white/40 bg-surface/40" />
              <div className="w-2.5 h-2.5 rounded-full border border-white/40 bg-surface/40" />
              <span className="ml-3 text-[10px] text-interactive-light/30 tracking-widest uppercase font-mono">
                {activeTab ? `${activeTab.name} — tty` : '—  no session'}
              </span>
            </div>
            <div className="flex-1 terminal-scroll overflow-y-auto relative h-[calc(100%-28px)]">
              {tabs.map(tab => (
                <TerminalPane key={tab.id} tab={tab} isActive={tab.id === activeTabId} onReady={handleTermReady} />
              ))}
              {tabs.length === 0 && (
                <div className="flex items-center justify-center h-full text-interactive-light/25 font-sans text-body-lg italic">
                  No sessions. Click + to create one.
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer tabsCount={tabs.length} />

        {showNewTabDialog && (
          <NewTabDialog onConfirm={handleNewTab} onCancel={() => setShowNewTabDialog(false)} />
        )}

        {showSettings && (
          <SettingsPanel
            term={activeTermData.term}
            fitAddon={activeTermData.fitAddon}
            onClose={() => setShowSettings(false)}
          />
        )}
      </main>
    </>
  );
}
