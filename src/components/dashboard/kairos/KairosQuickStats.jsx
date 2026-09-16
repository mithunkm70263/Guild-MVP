import { motion, useReducedMotion } from 'framer-motion';

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
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.35,
            delay: reduceMotion ? 0 : 0.08 + i * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className="kairos-stat-icon" aria-hidden="true">
            {stat.icon}
          </span>
          <span className="kairos-stat-value">{stat.value}</span>
          <span className="kairos-stat-label">{stat.label}</span>
        </motion.div>
      ))}
    </div>
  );
}
