export default function Footer({ tabsCount = 0 }) {
  return (
    <footer className="flex items-center justify-between px-8 py-2 bg-surface-container-low/40 border-t border-white/5 shrink-0">
      <span className="text-interactive-light/25 text-body-sm tracking-wider">
        Web Terminal Manager
      </span>
      <span className="text-interactive-light/20 text-body-sm">
        {tabsCount} session{tabsCount !== 1 ? 's' : ''}
      </span>
    </footer>
  );
}
