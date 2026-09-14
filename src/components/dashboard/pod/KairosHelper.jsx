import { motion, useReducedMotion } from 'framer-motion';

const KAIROS_SRC = '/kairos-noted.png';

export default function KairosHelper() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="pod-kairos-helper"
      aria-label="Kairos helper"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
    >
      <motion.div
        className="pod-kairos-float"
        animate={
          reduceMotion
            ? undefined
            : { y: [0, -6, 0], rotate: [-1, 1, -1] }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4.4, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        <img
          src={KAIROS_SRC}
          alt="Kairos, your Guild helper duck"
          className="pod-kairos-img"
          draggable={false}
        />
      </motion.div>
      <div className="pod-kairos-tooltip">
        <p>Need a nudge? Kairos has your back.</p>
      </div>
    </motion.div>
  );
}
