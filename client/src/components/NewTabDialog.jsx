import { useState, useEffect, useRef } from 'react';

export default function NewTabDialog({ onConfirm, onCancel }) {
  const [name, setName] = useState('Terminal');
  const [command, setCommand] = useState('');
  const [cwd, setCwd] = useState('');
  const nameRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (nameRef.current) nameRef.current.focus();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(name, command, cwd);
  };

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(4px)' }}
    >
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{ animation: 'dialogIn 160ms ease' }}
        className="bg-surface-container border border-white/10 rounded-card p-8 w-[420px] flex flex-col gap-4 shadow-overlay"
      >
        <div className="text-neutral-white font-display text-heading-2 tracking-wide">
          New Session
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-interactive-light text-body-sm uppercase tracking-wider">Name</label>
          <input
            ref={nameRef}
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-transparent border-b border-white/20 text-neutral-white font-sans text-body outline-none px-0 py-2 transition-colors focus:border-spotify-green"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-interactive-light text-body-sm uppercase tracking-wider">Command</label>
          <input
            value={command}
            onChange={e => setCommand(e.target.value)}
            className="bg-transparent border-b border-white/20 text-neutral-white font-sans text-body outline-none px-0 py-2 transition-colors focus:border-spotify-green"
            placeholder="leave empty for default shell"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-interactive-light text-body-sm uppercase tracking-wider">Directory</label>
          <input
            value={cwd}
            onChange={e => setCwd(e.target.value)}
            className="bg-transparent border-b border-white/20 text-neutral-white font-sans text-body outline-none px-0 py-2 transition-colors focus:border-spotify-green"
            placeholder="leave empty for home folder"
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border-none text-interactive-light font-sans text-body cursor-pointer px-4 py-2 rounded-pill transition-colors hover:text-neutral-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-spotify-green border-none text-neutral-black font-sans text-body font-bold cursor-pointer px-6 py-2 rounded-pill transition-all hover:bg-spotify-green-dark active:bg-spotify-green-active"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
