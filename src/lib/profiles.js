import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Map Supabase auth user fields to a profiles row payload.
 */
export function getProfileFieldsFromUser(user) {
  if (!user) return null;

  const meta = user.user_metadata || {};

  return {
    id: user.id,
    email: user.email || null,
    full_name:
      meta.full_name ||
      meta.name ||
      meta.display_name ||
      null,
    avatar_url: meta.avatar_url || meta.picture || null,
  };
}

function logProfileError(action, error) {
  if (import.meta.env.DEV) {
    console.warn(`[profiles] ${action} failed:`, error.message);
  }
}

/**
 * Create or refresh the user's profile row with auth metadata.
 * Called on sign-in as a fallback when the database trigger did not run.
 */
export async function ensureUserProfile(user) {
  if (!user || !isSupabaseConfigured()) return { ok: true, skipped: true };

  const payload = getProfileFieldsFromUser(user);
  if (!payload) return { ok: false, error: new Error('Missing user') };

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id', ignoreDuplicates: false });

  if (error) {
    logProfileError('ensureUserProfile', error);
    return { ok: false, error };
  }

  return { ok: true };
}

/**
 * Mark onboarding complete and persist builder track from local selection.
 */
export async function completeUserOnboarding(user) {
  if (!user || !isSupabaseConfigured()) return { ok: true, skipped: true };

  const base = getProfileFieldsFromUser(user);
  const builderTrack = localStorage.getItem('guild-builder-craft') || null;

  const { error } = await supabase.from('profiles').upsert(
    {
      ...base,
      builder_track: builderTrack,
      onboarding_complete: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  );

  if (error) {
    logProfileError('completeUserOnboarding', error);
    return { ok: false, error };
  }

  return { ok: true };
}

/**
 * Returns true when the user has finished the /connect onboarding step.
 */
export async function isOnboardingComplete(user) {
  if (!user) return false;

  if (!isSupabaseConfigured()) {
    return Boolean(localStorage.getItem('guild-builder-craft'));
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, onboarding_complete')
    .eq('id', user.id)
    .maybeSingle();

  if (error) {
    logProfileError('isOnboardingComplete', error);
    return false;
  }

  return Boolean(data?.onboarding_complete);
}
