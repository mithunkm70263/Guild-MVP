import { motion, useReducedMotion } from 'framer-motion';

export default function KairosEmptyState({ onStartChat }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="kairos-empty-chat"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src="/kairos.png"
        alt="Kairos mascot"
        className="kairos-empty-duck"
        animate={reduceMotion ? {} : { y: [0, -6, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <h3 className="kairos-empty-title">Meet Kairos, your daily guide.</h3>
      <p className="kairos-empty-copy">
        “Hey, I’m Kairos. I’ll help you stay consistent and actually ship. Tell me what you’re working on this week.”
      </p>
      <button
        type="button"
        className="kairos-chip-btn"
        style={{ marginTop: 8, padding: '8px 16px', background: 'var(--dash-sage)', color: '#fff' }}
        onClick={() => onStartChat("Hey Kairos! Let's plan today's priorities.")}
      >
        Start conversation 👋
      </button>
    </motion.div>
  );
}
