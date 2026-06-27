import { useState } from 'react';
import useStore from '../store';

export default function Sidebar({ tabs, activeTabId, onSelectTab, onCloseTab, onNewTab }) {
  const { renameTab } = useStore();
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const startEdit = (tab) => {
    setEditingId(tab.id);
    setEditName(tab.name);
  };

  const commitEdit = async (id) => {
    await fetch(`/api/tabs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
    });
    renameTab(id, editName);
    setEditingId(null);
  };

  return (
    <aside className="hidden md:flex flex-col w-[331px] bg-surface border-r border-white/10 shrink-0 relative z-10">
      <div className="px-6 pt-6 pb-4 border-b border-white/10">
        <h1 className="text-neutral-white font-display text-heading-2 tracking-wide">Sessions</h1>
        <p className="text-interactive-light text-body-sm mt-1">
          {tabs.length} active
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`
                group flex items-center gap-3 px-3 py-2 rounded-subtle cursor-pointer select-none
                transition-all duration-150 text-body
                ${isActive
                  ? 'bg-white/10 text-neutral-white'
                  : 'text-interactive-light hover:text-neutral-white hover:bg-white/5'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg shrink-0 opacity-60">
                {isActive ? 'terminal' : 'radio_button_unchecked'}
              </span>

              {editingId === tab.id ? (
                <input
                  autoFocus
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  onBlur={() => commitEdit(tab.id)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') commitEdit(tab.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={e => e.stopPropagation()}
                  className="bg-transparent border-b border-spotify-green/50 text-spotify-green font-sans text-body outline-none w-full p-0"
                />
              ) : (
                <span
                  onDoubleClick={() => startEdit(tab)}
                  className="truncate flex-1 font-sans"
                >
                  {tab.name}
                </span>
              )}

              <span
                onClick={e => { e.stopPropagation(); onCloseTab(tab.id); }}
                className="opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity text-xs cursor-pointer shrink-0"
              >✕</span>
            </div>
          );
        })}
      </div>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={onNewTab}
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-spotify-green/30 text-spotify-green/70 hover:text-spotify-green hover:border-spotify-green/60 rounded-pill transition-all duration-150 text-body"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Session
        </button>
      </div>
    </aside>
  );
}
