import { motion, useReducedMotion } from 'framer-motion';
import { QUICK_PROMPTS } from '../../../lib/kairosData.js';

const STARTER_PROMPTS = [
  ...QUICK_PROMPTS,
].slice(0, 4);

export default function KairosEmptyState({ onStartChat }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="kairos-empty-chat"
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.img
        src="/kairos-noted.png"
        alt="Kairos mascot"
        className="kairos-empty-duck"
        animate={
          reduceMotion
            ? {}
            : {
                y: [0, -8, 0],
                rotate: [-1.5, 1.5, -1.5],
              }
        }
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 5.6, repeat: Infinity, ease: 'easeInOut' },
        }}
      />
      <h3 className="kairos-empty-title">Hey — I&apos;m Kairos.</h3>
      <p className="kairos-empty-copy">
        Your daily accountability coach. Tell me what you&apos;re shipping, where you&apos;re stuck,
        or pick a starter below. I&apos;m ready when you are.
      </p>

      <div className="kairos-empty-starters" role="group" aria-label="Conversation starters">
        {STARTER_PROMPTS.map((prompt, index) => (
          <motion.button
            key={prompt.label}
            type="button"
            className="kairos-starter-btn"
            onClick={() => onStartChat(prompt.query)}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.35,
              delay: reduceMotion ? 0 : 0.15 + index * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={reduceMotion ? undefined : { scale: 1.03, y: -2 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          >
            {prompt.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
