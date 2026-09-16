import { motion, useReducedMotion } from 'framer-motion';
import { getSprintContext } from '../../../lib/kairosData.js';

export default function KairosSprintCard() {
  const reduceMotion = useReducedMotion();
  const sprint = getSprintContext();

  return (
    <motion.aside
      className="kairos-sprint-card"
      aria-label="Current sprint context"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="kairos-sprint-top">
        <span className="kairos-sprint-week">{sprint.weekLabel}</span>
        <span className="kairos-sprint-days">{sprint.daysUntilShip} days to Sunday ship</span>
      </div>

      <p className="kairos-sprint-goal">{sprint.sprintGoal}</p>

      <div className="kairos-sprint-bar" aria-label={`Sprint ${sprint.progressPercent}% complete`}>
        <motion.div
          className="kairos-sprint-bar-fill"
          initial={reduceMotion ? false : { width: 0 }}
          animate={{ width: `${sprint.progressPercent}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      </div>

      <p className="kairos-sprint-ritual">
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span>{sprint.podSyncNote}</span>
      </p>
    </motion.aside>
  );
}
