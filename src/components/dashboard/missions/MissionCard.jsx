import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatFocusTime } from '../../../lib/missionsData.js';

export default function MissionCard({ goal, onToggle, index = 0 }) {
  const reduceMotion = useReducedMotion();
  const { id, title, focusMinutes, completed } = goal;

  return (
    <motion.li
      className={`mission-card${completed ? ' is-completed' : ''}`}
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: completed ? 0.72 : 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{
        layout: { type: 'spring', stiffness: 420, damping: 32 },
        opacity: { duration: 0.28 },
        delay: reduceMotion ? 0 : index * 0.05,
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.button
        type="button"
        className={`mission-card-check${completed ? ' is-checked' : ''}`}
        onClick={() => onToggle(id)}
        aria-pressed={completed}
        aria-label={completed ? `Mark "${title}" incomplete` : `Mark "${title}" complete`}
        whileTap={reduceMotion ? undefined : { scale: 0.92 }}
      >
        <motion.span
          className="mission-card-check-fill"
          initial={false}
          animate={{
            scale: completed ? 1 : 0,
            opacity: completed ? 1 : 0,
          }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { type: 'spring', stiffness: 520, damping: 28 }
          }
        />
        {completed && (
          <motion.svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 600, damping: 24, delay: 0.05 }
            }
          >
            <polyline points="20 6 9 17 4 12" />
          </motion.svg>
        )}
      </motion.button>

      <div className="mission-card-body">
        <span className="mission-card-title-wrap">
          <span className="mission-card-title">{title}</span>
          <motion.span
            className="mission-card-strike"
            aria-hidden="true"
            initial={false}
            animate={{ scaleX: completed ? 1 : 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.38, ease: [0.16, 1, 0.3, 1] }
            }
          />
        </span>
        <Link to="/dashboard/focus" className="mission-card-focus-tag">
          {formatFocusTime(focusMinutes)}
        </Link>
      </div>
    </motion.li>
  );
}
