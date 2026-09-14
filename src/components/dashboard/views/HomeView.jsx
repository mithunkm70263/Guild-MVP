import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import { buildProfileFromUser } from '../../../lib/dashboardProfile.js';
import WelcomeSection from '../home/WelcomeSection.jsx';
import TodaysFocus from '../home/TodaysFocus.jsx';
import UpcomingMeeting from '../home/UpcomingMeeting.jsx';
import PodSnapshot from '../home/PodSnapshot.jsx';
import WeeklyGoals from '../home/WeeklyGoals.jsx';
import RecentActivity from '../home/RecentActivity.jsx';
import { fadeUp } from '../home/motionVariants.js';

export default function HomeView() {
  const reduceMotion = useReducedMotion();
  const [profile, setProfile] = useState(() => buildProfileFromUser(null));

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setProfile(buildProfileFromUser(null));
      return undefined;
    }

    let mounted = true;

    const loadProfile = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setProfile(buildProfileFromUser(data.session?.user));
      }
    };

    loadProfile();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setProfile(buildProfileFromUser(session?.user));
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <motion.section
      className="dashboard-home-layout"
      aria-labelledby="dashboard-home-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
      }}
    >
      <WelcomeSection name={profile.name} />

      <div className="dashboard-home-row dashboard-home-row--primary">
        <TodaysFocus />
        <UpcomingMeeting />
      </div>

      <div className="dashboard-home-row dashboard-home-row--secondary">
        <PodSnapshot />
        <WeeklyGoals />
      </div>

      <motion.div variants={fadeUp}>
        <RecentActivity />
      </motion.div>
    </motion.section>
  );
}
