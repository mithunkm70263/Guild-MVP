import { motion, useReducedMotion } from 'framer-motion';
import { getPodMembers } from '../../../lib/homeData.js';

function MemberChip({ member, index, reduceMotion }) {
  return (
    <motion.div
      className="pod-chat-member-chip"
      initial={reduceMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className="pod-chat-avatar pod-chat-avatar--sm"
        style={{ background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}cc)` }}
        aria-hidden="true"
      >
        {member.initials}
      </span>
      <span className="pod-chat-member-chip-name">{member.name.split(' ')[0]}</span>
      <span className="pod-chat-online-dot" aria-hidden="true" />
    </motion.div>
  );
}

export default function PodChatHeader() {
  const reduceMotion = useReducedMotion();
  const members = getPodMembers();

  return (
    <header className="pod-chat-header">
      <div className="pod-chat-header-main">
        <h1 className="pod-chat-title">My Pod</h1>
        <div className="pod-chat-online-badge">
          <span className="pod-chat-online-pulse" aria-hidden="true" />
          <span>Online</span>
        </div>
      </div>

      <div className="pod-chat-header-members" aria-label="Pod members">
        {members.map((member, index) => (
          <MemberChip key={member.id} member={member} index={index} reduceMotion={reduceMotion} />
        ))}
      </div>
    </header>
  );
}
