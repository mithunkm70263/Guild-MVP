import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import { buildProfileFromUser } from '../../../lib/dashboardProfile.js';
import { buildExtendedProfile, saveProfileSettings } from '../../../lib/profileData.js';
import SettingsHeader from '../settings/SettingsHeader.jsx';
import PreferencesSettings from '../settings/PreferencesSettings.jsx';
import NotificationSettings from '../settings/NotificationSettings.jsx';
import ConnectedAccounts from '../settings/ConnectedAccounts.jsx';
import SecuritySettings from '../settings/SecuritySettings.jsx';
import DangerZone from '../settings/DangerZone.jsx';
import LogoutSection from '../settings/LogoutSection.jsx';
import { pageFade } from '../home/motionVariants.js';

export default function SettingsView() {
  const reduceMotion = useReducedMotion();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => buildProfileFromUser(null));
  const [extended, setExtended] = useState(() => buildExtendedProfile(null, buildProfileFromUser(null)));
  const [settings, setSettings] = useState(() => extended.settings);
  const [saved, setSaved] = useState(false);

  const refreshExtended = useCallback((sessionUser, baseProfile) => {
    const next = buildExtendedProfile(sessionUser, baseProfile);
    setExtended(next);
    setSettings(next.settings);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      const base = buildProfileFromUser(null);
      setUser(null);
      setProfile(base);
      refreshExtended(null, base);
      return undefined;
    }

    let mounted = true;

    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        const sessionUser = data.session?.user ?? null;
        const base = buildProfileFromUser(sessionUser);
        setUser(sessionUser);
        setProfile(base);
        refreshExtended(sessionUser, base);
      }
    };

    loadProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        const sessionUser = session?.user ?? null;
        const base = buildProfileFromUser(sessionUser);
        setUser(sessionUser);
        setProfile(base);
        refreshExtended(sessionUser, base);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshExtended]);

  const handlePersist = (updates) => {
    const next = saveProfileSettings(updates);
    setSettings(next);
    refreshExtended(user, profile);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const { preferences, account } = extended;

  return (
    <motion.section
      className="dashboard-settings"
      aria-label="Settings"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      <SettingsHeader />

      <div className="dashboard-settings-stack">
        <PreferencesSettings
          settings={settings}
          preferences={preferences}
          onPersist={handlePersist}
        />
        <NotificationSettings
          settings={settings}
          onPersist={handlePersist}
        />
        <ConnectedAccounts
          settings={settings}
          onPersist={handlePersist}
        />
        <SecuritySettings account={account} />
        <DangerZone account={account} />
        <LogoutSection />
      </div>

      {saved && (
        <p className="settings-saved-toast" role="status">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Settings saved
        </p>
      )}
    </motion.section>
  );
}
