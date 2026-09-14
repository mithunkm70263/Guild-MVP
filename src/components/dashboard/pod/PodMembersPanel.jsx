import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FOCUS_STATUS_KEY } from '../../../lib/focusData.js';
import { CURRENT_USER } from '../../../lib/podChatData.js';

function readFocusStatus() {
  try {
    return localStorage.getItem(FOCUS_STATUS_KEY);
  } catch {
    return null;
  }
}

function MemberRow({ member, index, reduceMotion }) {
  const isInFocus = member.panelStatus === 'In Focus';

  return (
    <motion.div
      className="pod-members-row"
      role="listitem"
      initial={reduceMotion ? false : { opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.06 * index, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <span
        className="pod-chat-avatar pod-chat-avatar--md"
        style={{ background: `linear-gradient(135deg, ${member.avatarColor}, ${member.avatarColor}cc)` }}
        aria-hidden="true"
      >
        {member.initials}
      </span>
      <div className="pod-members-row-copy">
        <span className="pod-members-name">
          {member.name}
          {member.isSelf && <span className="pod-members-you-tag">You</span>}
        </span>
        <span className={`pod-members-status${isInFocus ? ' is-focus' : ''}`}>
          {member.panelStatus}
        </span>
      </div>
      <span className={`pod-members-dot${member.isOnline ? ' is-online' : ''}`} aria-hidden="true" />
    </motion.div>
  );
}

export default function PodMembersPanel({ members, collapsed, onToggle }) {
  const reduceMotion = useReducedMotion();
  const [focusStatus, setFocusStatus] = useState(() => readFocusStatus());

  useEffect(() => {
    const sync = () => setFocusStatus(readFocusStatus());
    sync();
    window.addEventListener('storage', sync);
    window.addEventListener('focus', sync);
    const interval = window.setInterval(sync, 3000);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', sync);
      window.clearInterval(interval);
    };
  }, []);

  const youStatus = focusStatus === 'in-focus'
    ? 'In Focus'
    : 'Working on pod chat UI';

  const youMember = {
    ...CURRENT_USER,
    name: 'You',
    panelStatus: youStatus,
    isOnline: true,
    isSelf: true,
  };

  return (
    <aside className={`pod-members-panel${collapsed ? ' is-collapsed' : ''}`}>
      <button
        type="button"
        className="pod-members-toggle"
        onClick={onToggle}
        aria-expanded={!collapsed}
      >
        <span className="pod-members-toggle-title">Pod Members</span>
        <svg
          className="pod-members-toggle-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <motion.div
        className="pod-members-body"
        initial={false}
        animate={{
          height: collapsed ? 0 : 'auto',
          opacity: collapsed ? 0 : 1,
        }}
        transition={reduceMotion ? { duration: 0.15 } : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="pod-members-you-strip">
          <MemberRow member={youMember} index={0} reduceMotion={reduceMotion} />
        </div>
        <div className="pod-members-list" role="list">
          {members.map((member, index) => (
            <MemberRow
              key={member.id}
              member={{ ...member, isSelf: false }}
              index={index + 1}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
      </motion.div>
    </aside>
  );
}
