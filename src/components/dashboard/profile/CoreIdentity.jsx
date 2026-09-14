import { motion, useReducedMotion } from 'framer-motion';
import ProfileIllustration from '../ProfileIllustration.jsx';
import { getInitials } from '../../../lib/dashboardProfile.js';
import { fadeUp } from '../home/motionVariants.js';

export default function CoreIdentity({ profile, extended, onConfirmTimezone }) {
  const reduceMotion = useReducedMotion();
  const initials = getInitials(profile.name);

  return (
    <motion.div
      className="profile-hero"
      variants={fadeUp}
    >
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
            <span className="profile-role-pill">{extended.track.shortLabel}</span>
            <span className="profile-track-pill">{extended.track.label}</span>
          </div>

          <div className="profile-timezone-row">
            <span className="profile-timezone-icon" aria-hidden="true">🌐</span>
            <span className="profile-timezone-value">
              {extended.timezoneLabel}
            </span>
            {extended.timezone && (
              <button
                type="button"
                className="profile-timezone-confirm"
                onClick={onConfirmTimezone}
              >
                Confirm
              </button>
            )}
          </div>

          {profile.memberSince && (
            <p className="profile-member-since">Member since {profile.memberSince}</p>
          )}
        </div>
      </div>

      {!reduceMotion && (
        <motion.div
          className="profile-hero-shimmer"
          aria-hidden="true"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.div>
  );
}
