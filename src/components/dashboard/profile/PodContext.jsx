import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import ProfileSection from './ProfileSection.jsx';
import { formatTogetherDuration } from '../../../lib/profileData.js';
import { listItem, staggerContainer } from '../home/motionVariants.js';

export default function PodContext({ extended }) {
  const reduceMotion = useReducedMotion();
  const { trio } = extended;
  const togetherLabel = formatTogetherDuration(trio.togetherSince);

  return (
    <ProfileSection
      id="profile-pod"
      kicker="Your trio"
      title="Pod context"
      subtitle="The builders in your accountability room."
      className="profile-pod"
    >
      <div className="profile-pod-avatar-row" aria-label="Pod members">
        {trio.members.map((member, index) => (
          <motion.div
            key={member.id}
            className={`profile-pod-avatar-chip${member.isSelf ? ' is-self' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            title={member.name}
          >
            <span
              className="profile-pod-avatar"
              style={{ background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}cc)` }}
            >
              {member.initials}
            </span>
            <span className="profile-pod-avatar-name">{member.isSelf ? 'You' : member.name.split(' ')[0]}</span>
          </motion.div>
        ))}
      </div>

      <div className="profile-pod-meta">
        <span className="profile-pod-duration">{togetherLabel}</span>
        <Link to={trio.podRoomUrl} className="profile-pod-link">
          Go to Pod Room
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      </div>

      <motion.ul
        className="profile-pod-member-list"
        variants={staggerContainer}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
      >
        {trio.members.filter((m) => !m.isSelf).map((member) => (
          <motion.li key={member.id} className="profile-pod-member-row" variants={listItem}>
            <span
              className="profile-pod-member-avatar"
              style={{ background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}cc)` }}
            >
              {member.initials}
            </span>
            <span className="profile-pod-member-name">{member.name}</span>
          </motion.li>
        ))}
      </motion.ul>
    </ProfileSection>
  );
}
