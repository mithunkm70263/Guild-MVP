import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../home/motionVariants.js';

export default function KairosHeader({ onResetDemo }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="kairos-header"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
    >
      <div className="kairos-header-copy">
        <div className="kairos-kicker-row">
          <span className="kairos-kicker">KAIROS</span>
          <div className="kairos-status-pill" aria-label="Kairos is online and ready">
            <span className="kairos-status-dot" aria-hidden="true" />
            <span>Online & ready</span>
          </div>
        </div>
        <h1 className="kairos-title">Talk to Kairos.</h1>
        <p className="kairos-subtitle">
          Your AI accountability coach & daily guide. Ask anything, unblock your build, and stay on track for the Sunday ship.
        </p>
      </div>

      <div className="kairos-header-actions">
        <button
          type="button"
          className="kairos-reset-btn"
          onClick={onResetDemo}
          title="Reset sample chat and daily tasks"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Reset demo</span>
        </button>
      </div>
    </motion.header>
  );
}
