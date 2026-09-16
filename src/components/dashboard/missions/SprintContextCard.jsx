import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../home/motionVariants.js';

export default function SprintContextCard({ cycleLabel, sprintGoal, podSyncNote }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      className="missions-sprint-card"
      aria-label="Sprint context"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
      transition={{ delay: reduceMotion ? 0 : 0.08 }}
    >
      <div className="missions-sprint-card-glow" aria-hidden="true" />
      <span className="missions-sprint-cycle">{cycleLabel}</span>
      <p className="missions-sprint-goal">{sprintGoal}</p>
      {podSyncNote && (
        <p className="missions-sprint-ritual">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {podSyncNote}
        </p>
      )}
    </motion.aside>
  );
}
