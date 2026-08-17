import { motion } from 'framer-motion';
import { useState } from 'react';
import { MISSION_BOARD } from '../data.js';

const columns = [
  { key: 'today', label: 'Today', accent: 'cyan' },
  { key: 'week', label: 'This week', accent: 'gold' },
  { key: 'backlog', label: 'Backlog', accent: 'purple' },
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] } },
};

export default function MissionsView() {
  const [board, setBoard] = useState(MISSION_BOARD);

  const toggleTask = (column, taskId) => {
    setBoard((current) => ({
      ...current,
      [column]: current[column].map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task,
      ),
    }));
  };

  const total = Object.values(board).flat().length;
  const done = Object.values(board).flat().filter((task) => task.done).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="dash-view dash-missions">
      <motion.header
        className="dash-missions-head"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <span className="dash-kicker">Mission board</span>
          <h2>What ships this sprint</h2>
        </div>
        <div className="dash-focus-ring" aria-label={`${pct}% complete`}>
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="34" className="dash-focus-track" />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              className="dash-focus-fill"
              strokeDasharray={213.6}
              initial={{ strokeDashoffset: 213.6 }}
              animate={{ strokeDashoffset: 213.6 - (213.6 * pct) / 100 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>
          <strong>{pct}%</strong>
          <span>done</span>
        </div>
      </motion.header>

      <motion.div className="dash-kanban" variants={stagger} initial="hidden" animate="show">
        {columns.map((column) => (
          <motion.section
            key={column.key}
            className={`dash-panel dash-kanban-col accent-${column.accent}`}
            variants={item}
          >
            <header>
              <span>{column.label}</span>
              <b>{board[column.key].length}</b>
            </header>

            <div className="dash-kanban-list">
              {board[column.key].map((task, index) => (
                <motion.button
                  type="button"
                  key={task.id}
                  className={`dash-task-card priority-${task.priority} ${task.done ? 'done' : ''}`}
                  onClick={() => toggleTask(column.key, task.id)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="dash-task-check" aria-hidden="true">
                    {task.done ? '✓' : ''}
                  </span>
                  <div>
                    <strong>{task.title}</strong>
                    <em>{task.time} focus</em>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.section>
        ))}
      </motion.div>
    </div>
  );
}
