import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import { buildProfileFromUser } from '../../../lib/dashboardProfile.js';
import { buildExtendedProfile } from '../../../lib/profileData.js';
import ProfileHeader from '../profile/ProfileHeader.jsx';
import BuilderStats from '../profile/BuilderStats.jsx';
import CurrentStatus from '../profile/CurrentStatus.jsx';
import PortfolioSection from '../profile/PortfolioSection.jsx';
import { pageFade } from '../home/motionVariants.js';

export default function ProfileView() {
  const reduceMotion = useReducedMotion();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(() => buildProfileFromUser(null));
  const [extended, setExtended] = useState(() => buildExtendedProfile(null, buildProfileFromUser(null)));

  const refreshExtended = useCallback((sessionUser, baseProfile) => {
    setExtended(buildExtendedProfile(sessionUser, baseProfile));
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

  const handleAvatarChange = () => {
    refreshExtended(user, profile);
  };

  return (
    <motion.section
      className="dashboard-profile"
      aria-label="Profile"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      <ProfileHeader
        profile={profile}
        extended={extended}
        onAvatarChange={handleAvatarChange}
      />
      <BuilderStats extended={extended} />
      <div className="dashboard-profile-split">
        <CurrentStatus extended={extended} />
        <PortfolioSection extended={extended} />
      </div>
    </motion.section>
  );
}
