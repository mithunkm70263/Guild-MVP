import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { handlePostAuthRouting } from '../lib/authRouting.js';

const AUTH_ENTRY_PATHS = ['/login'];

/**
 * Runs profile-check routing on app load and after OAuth redirect.
 * Email login calls handlePostAuthRouting directly; Google users rely on this listener.
 */
export default function AuthSessionHandler({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isSupabaseConfigured()) return undefined;

    let active = true;

    const routeFromAuthEntry = async (session) => {
      if (!active) return;
      if (!session?.user) return;
      if (!AUTH_ENTRY_PATHS.includes(location.pathname)) return;

      await handlePostAuthRouting(navigate, session.user);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      routeFromAuthEntry(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        routeFromAuthEntry(session);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  return children;
}
