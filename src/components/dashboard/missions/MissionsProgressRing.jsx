import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const RADIUS = 42;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function MissionsProgressRing({ percent }) {
  const reduceMotion = useReducedMotion();
  const [displayPercent, setDisplayPercent] = useState(reduceMotion ? percent : 0);
  const offset = CIRCUMFERENCE - (percent / 100) * CIRCUMFERENCE;

  useEffect(() => {
    if (reduceMotion) {
      setDisplayPercent(percent);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayPercent(Math.round(eased * percent));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [percent, reduceMotion]);

  return (
    <div className="missions-progress-ring" aria-label={`${percent}% of missions complete`}>
      <svg
        className="missions-progress-ring-svg"
        viewBox="0 0 100 100"
        role="img"
        aria-hidden="true"
      >
        <circle
          className="missions-progress-ring-track"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeWidth={STROKE}
        />
        <motion.circle
          className="missions-progress-ring-fill"
          cx="50"
          cy="50"
          r={RADIUS}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: offset }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.25 }
          }
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="missions-progress-ring-label">
        <motion.span
          className="missions-progress-ring-value"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.4 }}
        >
          {displayPercent}%
        </motion.span>
        <span className="missions-progress-ring-caption">Done</span>
      </div>
    </div>
  );
}
