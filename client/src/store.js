import { create } from 'zustand';

const useStore = create((set) => ({
  tabs: [],
  activeTabId: null,

  setTabs: (tabs) => set({ tabs }),
  setActiveTab: (id) => set({ activeTabId: id }),

  addTab: (tab) => set(state => ({ tabs: [...state.tabs, tab] })),

  removeTab: (id) => set(state => {
    const remaining = state.tabs.filter(t => t.id !== id);
    return {
      tabs: remaining,
      activeTabId: state.activeTabId === id
        ? (remaining[0]?.id || null)
        : state.activeTabId
    };
  }),

  renameTab: (id, name) => set(state => ({
    tabs: state.tabs.map(t => t.id === id ? { ...t, name } : t)
  })),
}));

export default useStore;
