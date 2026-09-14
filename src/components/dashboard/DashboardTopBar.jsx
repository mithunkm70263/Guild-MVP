import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';
import { getDisplayName, getInitials } from '../../lib/dashboardProfile.js';

export default function DashboardTopBar({ onMenuToggle, sidebarCollapsed }) {
  const reduceMotion = useReducedMotion();
  const location = useLocation();
  const [profileName, setProfileName] = useState('Guild Member');
  const pageContext = location.pathname.includes('/settings')
    ? 'Settings'
    : location.pathname.includes('/profile')
      ? 'Profile'
      : location.pathname.includes('/focus')
        ? 'Focus'
        : 'Dashboard';

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

      <div className="dashboard-topbar-actions">
        <Link
          to="/dashboard/settings"
          className="dashboard-topbar-settings"
          aria-label="Settings"
          title="Settings"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </Link>

        <div className="dashboard-topbar-profile">
        <div className="dashboard-topbar-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="dashboard-topbar-name-wrap">
          <span className="dashboard-topbar-greeting">Welcome back</span>
          <span className="dashboard-topbar-name">{profileName}</span>
        </div>
        </div>
      </div>
    </motion.header>
  );
}
