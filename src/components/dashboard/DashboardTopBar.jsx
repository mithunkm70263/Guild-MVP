import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

function getDisplayName(user) {
  if (!user) return 'Guild Member';

  const meta = user.user_metadata || {};
  const name =
    meta.full_name ||
    meta.name ||
    meta.display_name ||
    user.email?.split('@')[0];

  if (!name) return 'Guild Member';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function DashboardTopBar({ onMenuToggle, sidebarCollapsed }) {
  const reduceMotion = useReducedMotion();
  const [profileName, setProfileName] = useState('Guild Member');

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
        <span className="dashboard-topbar-context">Dashboard</span>
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
