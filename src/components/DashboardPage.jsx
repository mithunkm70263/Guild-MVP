import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/dashboard.css';
import DashboardSidebar from './dashboard/DashboardSidebar.jsx';
import ChatView from './dashboard/views/ChatView.jsx';
import CommandView from './dashboard/views/CommandView.jsx';
import KairosView from './dashboard/views/KairosView.jsx';
import MissionsView from './dashboard/views/MissionsView.jsx';
import PodRoomView from './dashboard/views/PodRoomView.jsx';
import ProfileView from './dashboard/views/ProfileView.jsx';

const pageTitles = {
  command: ['Command', 'A quieter way to make progress.'],
  kairos: ['Kairos', 'Your thoughtful co-pilot for the work ahead.'],
  chat: ['Pod chat', 'Three people, one honest thread.'],
  pod: ['Pod room', 'Your small circle is here.'],
  missions: ['Missions', 'Keep the work visible and light.'],
  profile: ['Profile', 'The commitment you are keeping.'],
};

const navigationItems = Object.entries(pageTitles).map(([id, [title, subtitle]]) => ({ id, title, subtitle }));

function CommandPalette({ onClose, onNavigate, onStartFocus }) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const visibleItems = navigationItems.filter((item) => `${item.title} ${item.subtitle}`.toLowerCase().includes(query.toLowerCase()));
  const quickActionOffset = query ? 0 : 1;
  const optionCount = visibleItems.length + quickActionOffset;
  useEffect(() => { setActiveIndex(0); }, [query]);
  const choose = (callback) => {
    callback();
    onClose();
  };
  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!optionCount) return;
      setActiveIndex((current) => (event.key === 'ArrowDown' ? (current + 1) % optionCount : (current - 1 + optionCount) % optionCount));
    }
    if (event.key === 'Enter' && optionCount) {
      event.preventDefault();
      if (!query && activeIndex === 0) choose(onStartFocus);
      else {
        const item = visibleItems[activeIndex - quickActionOffset];
        if (item) choose(() => onNavigate(item.id));
      }
    }
  };

  return (
    <motion.div className="dash-palette-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={onClose}>
      <motion.section
        className="dash-palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        initial={{ opacity: 0, y: -14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="dash-palette-input-wrap">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={handleKeyDown} placeholder="Find a place or start an action…" aria-label="Search dashboard" />
          <kbd>esc</kbd>
        </div>
        {!query && <div className="dash-palette-label">Quick actions</div>}
        {!query && <button className={`dash-palette-action dash-palette-action--focus ${activeIndex === 0 ? 'is-selected' : ''}`} type="button" onMouseEnter={() => setActiveIndex(0)} onClick={() => choose(onStartFocus)}><span>◌</span><div><strong>Begin a focus block</strong><small>Open Command and start your 48-minute session</small></div><kbd>↵</kbd></button>}
        <div className="dash-palette-label">Go to</div>
        <div className="dash-palette-list">
          {visibleItems.map((item, index) => <button key={item.id} className={activeIndex === index + quickActionOffset ? 'is-selected' : ''} type="button" onMouseEnter={() => setActiveIndex(index + quickActionOffset)} onClick={() => choose(() => onNavigate(item.id))}><span>{item.title.slice(0, 1)}</span><div><strong>{item.title}</strong><small>{item.subtitle}</small></div><em>↵</em></button>)}
          {!visibleItems.length && <p>Nothing matches that yet.</p>}
        </div>
        <footer><span><kbd>↑↓</kbd> to move</span><span><kbd>↵</kbd> to open</span></footer>
      </motion.section>
    </motion.div>
  );
}

function ThemeButton({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <motion.button className="dash-theme-toggle" type="button" onClick={onToggle} whileTap={{ scale: 0.92 }} aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}>
      <motion.svg viewBox="0 0 24 24" aria-hidden="true" animate={{ rotate: isDark ? 180 : 0 }} transition={{ duration: 0.38 }}>
        {isDark ? <path d="M20.6 15.8A8.2 8.2 0 0 1 8.2 3.4 8.25 8.25 0 1 0 20.6 15.8Z" /> : <><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2.2M12 19.8V22M2 12h2.2M19.8 12H22M4.9 4.9l1.55 1.55M17.55 17.55l1.55 1.55M19.1 4.9l-1.55 1.55M6.45 17.55 4.9 19.1" /></>}
      </motion.svg>
    </motion.button>
  );
}

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('command');
  const [theme, setTheme] = useState(() => localStorage.getItem('guild-theme') || 'light');
  const [now, setNow] = useState(new Date());
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [focusRequest, setFocusRequest] = useState(0);
  const meta = pageTitles[activeNav];
  useEffect(() => { localStorage.setItem('guild-theme', theme); }, [theme]);
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30_000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === 'Escape') setPaletteOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const timeLabel = useMemo(() => new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(now), [now]);
  const beginFocus = () => {
    setActiveNav('command');
    setFocusRequest((current) => current + 1);
  };
  const pages = { command: <CommandView onNavigate={setActiveNav} focusTrigger={focusRequest} />, kairos: <KairosView />, chat: <ChatView />, pod: <PodRoomView onNavigate={setActiveNav} />, missions: <MissionsView />, profile: <ProfileView /> };
  return (
    <div className="dash-app" data-theme={theme} data-view={activeNav}>
      <div className="dash-shell-grain" aria-hidden="true" />
      <DashboardSidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <main className="dash-main">
        <header className="dash-topbar"><div><p className="dash-breadcrumb">Guild / {meta[0]}</p><h1>{meta[0]}</h1><span>{meta[1]}</span></div><div className="dash-topbar-actions"><button className="dash-command-trigger" type="button" onClick={() => setPaletteOpen(true)} aria-label="Open command menu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg><span>Jump to</span><kbd>⌘ K</kbd></button><div className="dash-topbar-sync"><i /><span>Pod sync in <strong>3h 18m</strong></span></div><time className="dash-now">{timeLabel}</time><ThemeButton theme={theme} onToggle={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} /><Link className="dash-exit" to="/" aria-label="Return to Guild home">↗</Link></div></header>
        <AnimatePresence mode="wait"><motion.div className="dash-page" key={activeNav} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}>{pages[activeNav]}</motion.div></AnimatePresence>
      </main>
      <AnimatePresence>{paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onNavigate={setActiveNav} onStartFocus={beginFocus} />}</AnimatePresence>
    </div>
  );
}
