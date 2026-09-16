import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../home/motionVariants.js';
import MissionsProgressRing from './MissionsProgressRing.jsx';

export default function MissionsHeader({ progressPercent }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="missions-header"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
    >
      <div className="missions-header-copy">
        <span className="missions-kicker">Missions</span>
        <h1 className="missions-title">Ship what matters.</h1>
        <p className="missions-subtitle">
          Three horizons — today, this week, and backlog. Check off what ships.
        </p>
      </div>
      <MissionsProgressRing percent={progressPercent} />
    </motion.header>
  );
}
