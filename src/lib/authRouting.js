import { supabase, isSupabaseConfigured } from './supabase.js';
import { FOCUS_STATUS_KEY } from './focusData.js';
import { ensureUserProfile, isOnboardingComplete } from './profiles.js';

const LOCAL_SESSION_KEYS = [FOCUS_STATUS_KEY];

/**
 * Returns true when the user has completed /connect onboarding.
 * Falls back to local builder-track selection when Supabase is not configured.
 */
export async function hasUserProfile(user) {
  return isOnboardingComplete(user);
}

/**
 * Route authenticated users after login or OAuth session recovery.
 * No profile → /connect, profile exists → /dashboard.
 */
export async function handlePostAuthRouting(navigate, user) {
  if (!user) return;

  await ensureUserProfile(user);

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

function clearLocalSessionData() {
  for (const key of LOCAL_SESSION_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage access errors during sign-out.
    }
  }
}

/**
 * End the current session. Uses Supabase when configured; always clears local session data.
 */
export async function signOut() {
  if (isSupabaseConfigured()) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  clearLocalSessionData();
}
