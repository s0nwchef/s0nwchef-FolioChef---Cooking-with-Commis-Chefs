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
    <aside className="hidden md:flex flex-col w-56 bg-surface-container-lowest border-r border-outline-variant/10 shrink-0 relative z-10">
      <div className="px-4 pt-4 pb-3 border-b border-outline-variant/8">
        <h1 className="text-primary font-sans text-base tracking-wide font-semibold">Sessions</h1>
        <p className="text-on-surface-variant/35 font-sans text-xs mt-0.5">
          {tabs.length} active
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {tabs.map(tab => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`
                group flex items-center gap-2 px-3 py-2 rounded-[16px] cursor-pointer select-none
                transition-all duration-150 text-sidebar
                ${isActive
                  ? 'bg-primary/8 text-primary border-l-2 border-primary'
                  : 'text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-surface-container border-l-2 border-transparent'
                }
              `}
            >
              <span className="material-symbols-outlined text-[16px] shrink-0 opacity-60">
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
                  className="bg-transparent border-b border-primary/50 text-primary font-sans text-sidebar outline-none w-full p-0"
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

      <div className="px-3 py-3 border-t border-outline-variant/8">
        <button
          onClick={onNewTab}
          className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-primary/30 text-primary/70 hover:text-primary hover:border-primary/60 rounded-[16px] transition-all duration-150 text-sidebar"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          New Session
        </button>
      </div>
    </aside>
  );
}
