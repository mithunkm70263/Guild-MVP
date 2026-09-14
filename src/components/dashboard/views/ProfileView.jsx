import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase.js';
import { buildProfileFromUser, getInitials } from '../../../lib/dashboardProfile.js';
import ProfileIllustration from '../ProfileIllustration.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const STAT_CARDS = [
  { id: 'pod', label: 'Pod status', key: 'podStatus', fallback: 'Matching' },
  { id: 'track', label: 'Builder track', key: 'trackTitle', fallback: 'Not set' },
  { id: 'member', label: 'Member since', key: 'memberSince', fallback: '—' },
];

function ProfileField({ label, value, placeholder, href }) {
  const display = value || placeholder;
  const isLink = Boolean(href && value);

  return (
    <div className="profile-field">
      <span className="profile-field-label">{label}</span>
      {isLink ? (
        <a className="profile-field-value profile-field-link" href={href} target="_blank" rel="noreferrer">
          {display}
        </a>
      ) : (
        <span className={`profile-field-value${!value ? ' is-placeholder' : ''}`}>{display}</span>
      )}
    </div>
  );
}

export default function ProfileView() {
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

  const initials = getInitials(profile.name);
  const trackTitle = profile.track?.title || '';
  const stats = {
    podStatus: 'In queue',
    trackTitle: trackTitle || 'Not set',
    memberSince: profile.memberSince || '—',
  };

  return (
    <motion.section
      className="dashboard-profile"
      aria-labelledby="dashboard-profile-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.06 } },
      }}
    >
      <motion.div className="profile-hero" variants={fadeUp}>
        <div className="profile-hero-glow" aria-hidden="true" />
        <div className="profile-hero-grid">
          <div className="profile-hero-visual">
            <ProfileIllustration />
            <div className="profile-avatar-ring">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="" className="profile-avatar-image" />
              ) : (
                <span className="profile-avatar-initials">{initials}</span>
              )}
            </div>
          </div>

          <div className="profile-hero-copy">
            <span className="profile-kicker">Your builder identity</span>
            <h1 id="dashboard-profile-title" className="profile-title">{profile.name}</h1>
            <p className="profile-subtitle">
              {profile.email || 'Sign in to sync your Guild profile'}
            </p>
            <div className="profile-role-row">
              <span className="profile-role-pill">{profile.role}</span>
              {profile.track && (
                <span className="profile-track-pill">{profile.track.label}</span>
              )}
            </div>
            <button type="button" className="profile-edit-btn" disabled aria-label="Edit profile (coming soon)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit profile
              <span className="profile-edit-soon">Soon</span>
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div className="profile-stats" variants={fadeUp}>
        {STAT_CARDS.map((card) => (
          <article key={card.id} className="profile-stat-card">
            <span className="profile-stat-label">{card.label}</span>
            <span className="profile-stat-value">{stats[card.key] || card.fallback}</span>
          </article>
        ))}
      </motion.div>

      <motion.div className="profile-details" variants={fadeUp}>
        <header className="profile-details-head">
          <h2>Profile details</h2>
          <p>Essential info for your pod match and builder room.</p>
        </header>

        <div className="profile-details-grid">
          <ProfileField
            label="Bio"
            value={profile.bio}
            placeholder="Add a short bio when editing is live"
          />
          <ProfileField
            label="Location"
            value={profile.location}
            placeholder="City, timezone"
          />
          <ProfileField
            label="Website"
            value={profile.website}
            placeholder="your-site.com"
            href={profile.website?.startsWith('http') ? profile.website : profile.website ? `https://${profile.website}` : undefined}
          />
          <ProfileField
            label="Builder track"
            value={profile.track ? `${profile.track.title} — ${profile.track.subtitle}` : ''}
            placeholder="Choose a track from Builder Tracks"
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
