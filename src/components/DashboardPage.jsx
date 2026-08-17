import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import DashboardAmbient from './dashboard/DashboardAmbient.jsx';
import DashboardSidebar from './dashboard/DashboardSidebar.jsx';
import { NAV_ITEMS, PANEL_EASE, VIEW_TRANSITION } from './dashboard/data.js';
import CommandView from './dashboard/views/CommandView.jsx';
import ChatView from './dashboard/views/ChatView.jsx';
import MissionsView from './dashboard/views/MissionsView.jsx';
import PodRoomView from './dashboard/views/PodRoomView.jsx';
import ProfileView from './dashboard/views/ProfileView.jsx';
import SignalsView from './dashboard/views/SignalsView.jsx';
import '../styles/dashboard.css';

const VIEW_MAP = {
  command: CommandView,
  chat: ChatView,
  pod: PodRoomView,
  missions: MissionsView,
  signals: SignalsView,
  profile: ProfileView,
};

const VIEW_TITLES = {
  command: 'Your momentum is live.',
  chat: 'Stay connected with your pod.',
  pod: 'Your pod is in sync.',
  missions: 'Ship what matters.',
  signals: 'Signals from your orbit.',
  profile: 'Your builder identity.',
};

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState('command');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const timeLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(now),
    [now],
  );

  const dayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(now),
    [now],
  );

  const ActiveView = VIEW_MAP[activeNav] ?? CommandView;
  const activeLabel = NAV_ITEMS.find((item) => item.id === activeNav)?.label ?? 'Command';

  return (
    <main className="dash-shell">
      <DashboardAmbient />
      <DashboardSidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <section className="dash-main" aria-labelledby="dash-title">
        <motion.header
          className="dash-topbar"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: PANEL_EASE }}
        >
          <div>
            <span className="dash-kicker">{activeLabel}</span>
            <h1 id="dash-title">{VIEW_TITLES[activeNav]}</h1>
          </div>
          <div className="dash-clock" aria-label="Current local time">
            <span>{timeLabel}</span>
            <p>{dayLabel}</p>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            className="dash-viewport"
            {...VIEW_TRANSITION}
          >
            <ActiveView />
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
