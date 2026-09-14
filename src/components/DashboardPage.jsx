import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Route, Routes } from 'react-router-dom';
import DashboardSidebar from './dashboard/DashboardSidebar.jsx';
import DashboardTopBar from './dashboard/DashboardTopBar.jsx';
import HomeView from './dashboard/views/HomeView.jsx';
import ProfileView from './dashboard/views/ProfileView.jsx';
import SettingsView from './dashboard/views/SettingsView.jsx';
import PodRoomView from './dashboard/views/PodRoomView.jsx';
import FocusView from './dashboard/views/FocusView.jsx';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const reduceMotion = useReducedMotion();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const sync = () => {
      if (mq.matches) {
        setSidebarCollapsed(true);
      }
    };
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileNavOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileNavOpen]);

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleMenuToggle = () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      setMobileNavOpen((prev) => !prev);
      return;
    }
    handleSidebarToggle();
  };

  return (
    <div className={`dashboard-shell${mobileNavOpen ? ' is-mobile-nav-open' : ''}`}>
      <div className="dashboard-ambient dashboard-ambient-one" aria-hidden="true" />
      <div className="dashboard-ambient dashboard-ambient-two" aria-hidden="true" />
      <div className="dashboard-grid-overlay" aria-hidden="true" />

      <DashboardSidebar
        collapsed={sidebarCollapsed && !mobileNavOpen}
        onToggle={handleSidebarToggle}
      />

      {mobileNavOpen && (
        <button
          type="button"
          className="dashboard-mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <div className={`dashboard-main${sidebarCollapsed ? ' is-sidebar-collapsed' : ''}`}>
        <div className="dashboard-main-inner">
          <DashboardTopBar
            onMenuToggle={handleMenuToggle}
            sidebarCollapsed={sidebarCollapsed}
          />

          <motion.main
            className="dashboard-content"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <Routes>
              <Route index element={<HomeView />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="settings" element={<SettingsView />} />
              <Route path="pod" element={<PodRoomView />} />
              <Route path="focus" element={<FocusView />} />
            </Routes>
          </motion.main>
        </div>
      </div>
    </div>
  );
}
