export default function Footer({ tabsCount = 0 }) {
  return (
    <footer className="flex items-center justify-between px-5 py-2 bg-surface-container-low/40 border-t border-outline-variant/8 shrink-0">
      <span className="text-on-surface-variant/25 font-sans text-xs tracking-wider">
        Web Terminal Manager
      </span>
      <span className="text-on-surface-variant/20 font-sans text-xs">
        {tabsCount} session{tabsCount !== 1 ? 's' : ''}
      </span>
    </footer>
  );
}
