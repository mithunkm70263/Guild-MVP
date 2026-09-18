import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Returns true when the user has a Guild profile row in Supabase.
 * Falls back to local builder-track selection when Supabase is not configured.
 */
export async function hasUserProfile(user) {
  if (!user) return false;

  if (!isSupabaseConfigured()) {
    return Boolean(localStorage.getItem('guild-builder-craft'));
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    console.warn('Profile check failed:', error.message);
    return false;
  }

  return Boolean(data);
}

/**
 * Route authenticated users after login or OAuth session recovery.
 * No profile → /connect, profile exists → /dashboard.
 */
export async function handlePostAuthRouting(navigate, user) {
  if (!user) return;

  const hasProfile = await hasUserProfile(user);
  navigate(hasProfile ? '/dashboard' : '/connect', { replace: true });
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env');
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });

  if (error) throw error;
}

export async function signInWithEmail(email, password) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (!error) {
    return data;
  }

  if (error.message.toLowerCase().includes('invalid login credentials')) {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) throw signUpError;
    return signUpData;
  }

  throw error;
}
