import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { getDisplayName, getInitials } from '../../lib/dashboardProfile.js';

export default function DashboardTopBar({ onMenuToggle, sidebarCollapsed }) {
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const [profileName, setProfileName] = useState('Guild Member');
  const pageContext = location.pathname.includes('/profile') ? 'Profile' : 'Dashboard';

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;

    let mounted = true;

    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setProfileName(getDisplayName(data.session?.user));
      }
    };

    loadProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setProfileName(getDisplayName(session?.user));
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const initials = getInitials(profileName);

  return (
    <motion.header
      className="dashboard-topbar"
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
    >
      <div className="dashboard-topbar-left">
        <button
          type="button"
          className="dashboard-topbar-menu"
          onClick={onMenuToggle}
          aria-label={sidebarCollapsed ? 'Open navigation' : 'Close navigation'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <span className="dashboard-topbar-context">{pageContext}</span>
      </div>

      <div className="dashboard-topbar-profile">
        <div className="dashboard-topbar-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="dashboard-topbar-name-wrap">
          <span className="dashboard-topbar-greeting">Welcome back</span>
          <span className="dashboard-topbar-name">{profileName}</span>
        </div>
      </div>
    </motion.header>
  );
}
