import { useEffect, useState, useRef } from 'react';
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
  const termsRef = useRef({});

  useEffect(() => {
    try { localStorage.removeItem('terminal-bg'); } catch {}
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

  const handleTermReady = (id, term, fitAddon) => {
    termsRef.current[id] = { term, fitAddon };
  };

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
    delete termsRef.current[id];
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
  const activeTermData = termsRef.current[activeTabId] || {};

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
          <div className="flex items-center gap-4 px-5 py-2 bg-surface-container/40 border-b border-outline-variant/10 shrink-0">
            <button
              onClick={handleRestartProcess}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-primary/25 text-primary/80 hover:text-primary hover:bg-primary/8 rounded-[16px] text-toolbar uppercase tracking-wider transition-all duration-150"
            >
              <span className="material-symbols-outlined text-sm">restart_alt</span>
              Restart
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-outline-variant/30 text-on-surface-variant/60 hover:text-primary hover:border-primary/25 hover:bg-primary/5 rounded-[16px] text-toolbar uppercase tracking-wider transition-all duration-150"
            >
              <span className="material-symbols-outlined text-sm">delete_sweep</span>
              Clear
            </button>
            <button
              onClick={() => setShowSettings(v => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-[16px] text-toolbar uppercase tracking-wider transition-all duration-150 ${
                showSettings
                  ? 'bg-primary/12 border-primary/40 text-primary'
                  : 'border-outline-variant/30 text-on-surface-variant/60 hover:text-primary hover:border-primary/25 hover:bg-primary/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              Settings
            </button>
            <div className="ml-auto flex items-center gap-2 text-on-surface-variant/40 text-toolbar uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {activeTab.name}
            </div>
          </div>
        )}

        <div className="flex-1 p-4 overflow-hidden relative">
          <div className="w-full h-full rounded-[16px] border border-primary-container/15 overflow-hidden bg-surface-container-lowest shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
            <div className="h-7 bg-surface-container-low border-b border-primary-container/8 flex items-center px-3 gap-1.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full border border-outline-variant/40 bg-background/40" />
              <div className="w-2.5 h-2.5 rounded-full border border-outline-variant/40 bg-background/40" />
              <div className="w-2.5 h-2.5 rounded-full border border-outline-variant/40 bg-background/40" />
              <span className="ml-3 text-[10px] text-on-surface-variant/30 tracking-widest uppercase font-mono">
                {activeTab ? `${activeTab.name} — tty` : '—  no session'}
              </span>
            </div>
            <div className="flex-1 terminal-scroll overflow-y-auto relative h-[calc(100%-28px)]">
              {tabs.map(tab => (
                <TerminalPane key={tab.id} tab={tab} isActive={tab.id === activeTabId} onReady={handleTermReady} />
              ))}
              {tabs.length === 0 && (
                <div className="flex items-center justify-center h-full text-on-surface-variant/25 font-sans text-base italic">
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
