import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function KairosTodaysFocus({ tasks = [], onToggleTask }) {
  const reduceMotion = useReducedMotion();
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="kairos-focus-card">
      <div className="kairos-focus-head">
        <div className="kairos-focus-title-wrap">
          <h2 className="kairos-focus-title">Today's Focus</h2>
          <span className="kairos-focus-count">
            {completedCount}/{tasks.length}
          </span>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p className="missions-column-empty">
          No tasks assigned yet. Tell Kairos what you want to achieve today!
        </p>
      ) : (
        <ul className="kairos-task-list">
          <AnimatePresence initial={false}>
            {tasks.map((task, index) => {
              const isDone = task.completed;
              return (
                <motion.li
                  key={task.id}
                  className={`kairos-task-item${isDone ? ' is-completed' : ''}${
                    task.isNew ? ' is-new-item' : ''
                  }`}
                  layout={!reduceMotion}
                  initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: isDone ? 0.68 : 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{
                    layout: { type: 'spring', stiffness: 440, damping: 30 },
                    duration: 0.35,
                    delay: reduceMotion ? 0 : index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <motion.button
                    type="button"
                    className={`kairos-task-check${isDone ? ' is-checked' : ''}`}
                    onClick={() => onToggleTask(task.id)}
                    aria-pressed={isDone}
                    aria-label={
                      isDone
                        ? `Mark "${task.title}" incomplete`
                        : `Mark "${task.title}" complete`
                    }
                    whileTap={reduceMotion ? undefined : { scale: 0.9 }}
                  >
                    <motion.span
                      className="kairos-task-check-fill"
                      initial={false}
                      animate={{
                        scale: isDone ? 1 : 0,
                        opacity: isDone ? 1 : 0,
                      }}
                      transition={
                        reduceMotion
                          ? { duration: 0 }
                          : { type: 'spring', stiffness: 500, damping: 28 }
                      }
                    />
                    {isDone && (
                      <motion.svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { type: 'spring', stiffness: 600, damping: 24, delay: 0.05 }
                        }
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </motion.svg>
                    )}
                  </motion.button>

                  <div className="kairos-task-body">
                    <span className="kairos-task-title-wrap">
                      <span className="kairos-task-title">{task.title}</span>
                      <motion.span
                        className="kairos-task-strike"
                        aria-hidden="true"
                        initial={false}
                        animate={{ scaleX: isDone ? 1 : 0 }}
                        transition={
                          reduceMotion
                            ? { duration: 0 }
                            : { duration: 0.36, ease: [0.16, 1, 0.3, 1] }
                        }
                      />
                    </span>

                    <div className="kairos-task-meta">
                      <span className="kairos-task-tag">{task.tag}</span>
                      <Link to="/dashboard/focus" className="kairos-task-focus-link">
                        {task.focusMinutes}M FOCUS
                      </Link>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}
