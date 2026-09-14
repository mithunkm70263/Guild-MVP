import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import { buildProfileFromUser } from '../../../lib/dashboardProfile.js';
import { buildExtendedProfile, saveProfileSettings } from '../../../lib/profileData.js';
import CoreIdentity from '../profile/CoreIdentity.jsx';
import CommitmentSection from '../profile/CommitmentSection.jsx';
import ActivityHistory from '../profile/ActivityHistory.jsx';
import PodContext from '../profile/PodContext.jsx';
import ProfileSettings from '../profile/ProfileSettings.jsx';
import { staggerContainer } from '../home/motionVariants.js';

export default function ProfileView() {
  const reduceMotion = useReducedMotion();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => buildProfileFromUser(null));
  const [extended, setExtended] = useState(() => buildExtendedProfile(null));

  const refreshExtended = useCallback((sessionUser) => {
    setExtended(buildExtendedProfile(sessionUser));
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setProfile(buildProfileFromUser(null));
      refreshExtended(null);
      return undefined;
    }

    let mounted = true;

    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        const sessionUser = data.session?.user ?? null;
        setUser(sessionUser);
        setProfile(buildProfileFromUser(sessionUser));
        refreshExtended(sessionUser);
      }
    };

    loadProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        const sessionUser = session?.user ?? null;
        setUser(sessionUser);
        setProfile(buildProfileFromUser(sessionUser));
        refreshExtended(sessionUser);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [refreshExtended]);

  const handleConfirmTimezone = () => {
    if (extended.timezone) {
      saveProfileSettings({ timezone: extended.timezone });
      refreshExtended(user);
    }
  };

  const handleSettingsChange = () => {
    refreshExtended(user);
  };

  return (
    <motion.section
      className="dashboard-profile"
      aria-labelledby="dashboard-profile-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={staggerContainer}
    >
      <CoreIdentity
        profile={profile}
        extended={extended}
        onConfirmTimezone={handleConfirmTimezone}
      />

      <CommitmentSection extended={extended} />

      <ActivityHistory extended={extended} />

      <PodContext extended={extended} />

      <ProfileSettings
        extended={extended}
        onSettingsChange={handleSettingsChange}
      />
    </motion.section>
  );
}
