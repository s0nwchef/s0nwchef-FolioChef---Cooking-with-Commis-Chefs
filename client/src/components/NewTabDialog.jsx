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
      style={{ background: 'rgba(10, 11, 20, 0.88)', backdropFilter: 'blur(6px)' }}
    >
      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{ animation: 'dialogIn 160ms ease' }}
        className="bg-surface-container-lowest border border-primary/40 rounded-[16px] p-6 w-[420px] flex flex-col gap-4 shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="text-primary font-sans text-lg tracking-wide font-semibold">
          New Session
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-on-surface-variant/60 font-sans text-xs uppercase tracking-wider">Name</label>
          <input
            ref={nameRef}
            value={name}
            onChange={e => setName(e.target.value)}
            className="bg-transparent border-b border-primary/40 text-on-surface font-sans text-sm outline-none px-0 py-1.5 transition-colors focus:border-primary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-on-surface-variant/60 font-sans text-xs uppercase tracking-wider">Command</label>
          <input
            value={command}
            onChange={e => setCommand(e.target.value)}
            className="bg-transparent border-b border-primary/40 text-on-surface font-sans text-sm outline-none px-0 py-1.5 transition-colors focus:border-primary"
            placeholder="leave empty for default shell"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-on-surface-variant/60 font-sans text-xs uppercase tracking-wider">Directory</label>
          <input
            value={cwd}
            onChange={e => setCwd(e.target.value)}
            className="bg-transparent border-b border-primary/40 text-on-surface font-sans text-sm outline-none px-0 py-1.5 transition-colors focus:border-primary"
            placeholder="leave empty for home folder"
          />
        </div>

        <div className="flex justify-end gap-3 mt-1">
          <button
            type="button"
            onClick={onCancel}
            className="bg-transparent border-none text-on-surface-variant/60 font-sans text-sm cursor-pointer px-4 py-1.5 rounded-[16px] transition-colors hover:text-on-surface-variant"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-primary border-none text-on-primary font-sans text-sm font-semibold cursor-pointer px-5 py-1.5 rounded-[16px] transition-all hover:brightness-110"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
