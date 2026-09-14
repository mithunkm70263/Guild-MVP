import { motion, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../home/motionVariants.js';

export default function FocusPreSession({ focusText, onFocusTextChange, onStart, disabled }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className="focus-pre-session"
      aria-labelledby="focus-pre-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
    >
      <div className="focus-pre-glow" aria-hidden="true" />

      <header className="focus-pre-header">
        <span className="focus-kicker">Deep work</span>
        <h1 id="focus-pre-title" className="focus-title">Focus Session</h1>
        <p className="focus-subtitle">
          One uninterrupted 90-minute block. Your pod sees when you&apos;re in focus — nothing else matters right now.
        </p>
      </header>

      <div className="focus-pre-form">
        <label className="focus-label" htmlFor="focus-intent-input">
          What are you focusing on?
        </label>
        <input
          id="focus-intent-input"
          type="text"
          className="focus-input"
          value={focusText}
          onChange={(event) => onFocusTextChange(event.target.value)}
          placeholder="e.g. Outline this week's video script"
          maxLength={120}
        />

        <motion.button
          type="button"
          className="focus-start-btn"
          onClick={onStart}
          disabled={disabled || !focusText.trim()}
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        >
          <span className="focus-start-btn-glow" aria-hidden="true" />
          Start Focus Session
        </motion.button>
      </div>
    </motion.section>
  );
}
