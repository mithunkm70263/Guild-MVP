import { useCallback, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { getDailyTasks, saveDailyTasks } from '../../../lib/homeData.js';
import HomeCard from './HomeCard.jsx';
import { listItem, staggerContainer } from './motionVariants.js';

function TaskCheckbox({ checked, onChange, label }) {
  const reduceMotion = useReducedMotion();

  return (
    <button
      type="button"
      className={`home-task-check${checked ? ' is-checked' : ''}`}
      onClick={onChange}
      aria-label={checked ? `Mark "${label}" incomplete` : `Mark "${label}" complete`}
      aria-pressed={checked}
    >
      <motion.span
        className="home-task-check-inner"
        initial={false}
        animate={checked ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 28 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.span>
    </button>
  );
}

export default function TodaysFocus() {
  const [tasks, setTasks] = useState(() => getDailyTasks());
  const reduceMotion = useReducedMotion();
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const allDone = pendingCount === 0;

  const toggleTask = useCallback((taskId) => {
    setTasks((prev) => {
      const next = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      );
      saveDailyTasks(next);
      return next;
    });
  }, []);

  return (
    <HomeCard className="home-focus-card" variant="kairos">
      <header className="home-card-head">
        <div className="home-card-head-row">
          <div className="home-kairos-brand">
            <img src="/kairos-focus.png" alt="" className="home-kairos-avatar" width="32" height="32" />
            <div>
              <h2 className="home-card-title">Today&apos;s Focus</h2>
              <p className="home-card-subtitle">Kairos daily tasks</p>
            </div>
          </div>
          {!allDone && (
            <span className="home-card-badge">{pendingCount} left</span>
          )}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {allDone ? (
          <motion.div
            key="empty"
            className="home-empty-state home-empty-state--success"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="home-empty-icon" aria-hidden="true">✦</span>
            <p className="home-empty-title">All caught up</p>
            <p className="home-empty-copy">Kairos will assign more tomorrow. Rest or get ahead on your weekly goals.</p>
          </motion.div>
        ) : (
          <motion.ul
            key="tasks"
            className="home-task-list"
            variants={staggerContainer}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            {tasks.map((task) => (
              <motion.li
                key={task.id}
                className={`home-task-item${task.completed ? ' is-completed' : ''}`}
                variants={listItem}
                layout={!reduceMotion}
              >
                <TaskCheckbox
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  label={task.title}
                />
                <div className="home-task-copy">
                  <span className="home-task-title">{task.title}</span>
                  {task.description && (
                    <span className="home-task-desc">{task.description}</span>
                  )}
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </HomeCard>
  );
}
