import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

function CountUpValue({ value, reduceMotion }) {
  const isNumericPair = /^\d+\/\d+$/.test(value);
  const isDays = /^\d+\s*Days?$/i.test(value);
  const [display, setDisplay] = useState(reduceMotion ? value : isNumericPair || isDays ? '0' : value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return undefined;
    }

    if (isNumericPair) {
      const [targetDone, total] = value.split('/').map(Number);
      let frame = 0;
      const frames = 18;
      const id = requestAnimationFrame(function tick() {
        frame += 1;
        const progress = Math.min(1, frame / frames);
        const eased = 1 - (1 - progress) ** 3;
        setDisplay(`${Math.round(targetDone * eased)}/${total}`);
        if (progress < 1) requestAnimationFrame(tick);
      });
      return () => cancelAnimationFrame(id);
    }

    if (isDays) {
      const target = parseInt(value, 10);
      let frame = 0;
      const frames = 20;
      const id = requestAnimationFrame(function tick() {
        frame += 1;
        const progress = Math.min(1, frame / frames);
        const eased = 1 - (1 - progress) ** 3;
        setDisplay(`${Math.round(target * eased)} Days`);
        if (progress < 1) requestAnimationFrame(tick);
      });
      return () => cancelAnimationFrame(id);
    }

    setDisplay(value);
    return undefined;
  }, [value, reduceMotion, isNumericPair, isDays]);

  return display;
}

export default function KairosQuickStats({ completedCount = 0, totalCount = 0 }) {
  const reduceMotion = useReducedMotion();

  const stats = [
    {
      id: 'streak',
      icon: '🔥',
      value: '5 Days',
      label: 'Active Streak',
    },
    {
      id: 'tasks',
      icon: '⚡',
      value: `${completedCount}/${totalCount}`,
      label: 'Tasks Shipped',
    },
    {
      id: 'focus',
      icon: '⏱️',
      value: '1h 45m',
      label: 'Focus Logged',
    },
  ];

  return (
    <div className="kairos-stats-row">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.id}
          className="kairos-stat-pill"
          initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.38,
            delay: reduceMotion ? 0 : 0.1 + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="kairos-stat-icon" aria-hidden="true">
            {stat.icon}
          </span>
          <span className="kairos-stat-value">
            <CountUpValue value={stat.value} reduceMotion={reduceMotion} />
          </span>
          <span className="kairos-stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
