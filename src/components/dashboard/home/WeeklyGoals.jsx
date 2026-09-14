import { useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { getWeeklyGoals, saveWeeklyGoals } from '../../../lib/homeData.js';
import HomeCard from './HomeCard.jsx';

export default function WeeklyGoals() {
  const [goals, setGoals] = useState(() => getWeeklyGoals());
  const reduceMotion = useReducedMotion();
  const completedCount = goals.filter((g) => g.completed).length;
  const totalCount = goals.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleGoal = useCallback((goalId) => {
    setGoals((prev) => {
      const next = prev.map((goal) =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal,
      );
      saveWeeklyGoals(next);
      return next;
    });
  }, []);

  return (
    <HomeCard className="home-goals-card">
      <header className="home-card-head">
        <div className="home-card-head-row">
          <div>
            <h2 className="home-card-title">Weekly Goals</h2>
            <p className="home-card-subtitle">{completedCount}/{totalCount} completed</p>
          </div>
          <a href="#" className="home-link-btn">View all goals</a>
        </div>
      </header>

      <div className="home-goals-progress-wrap">
        <div className="home-goals-progress-track" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={totalCount} aria-label="Weekly goals progress">
          <motion.div
            className="home-goals-progress-fill"
            initial={reduceMotion ? { width: `${progress}%` } : { width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          />
        </div>
        <span className="home-goals-progress-label">{Math.round(progress)}%</span>
      </div>

      <ul className="home-goals-list">
        {goals.map((goal, index) => (
          <motion.li
            key={goal.id}
            className={`home-goal-item${goal.completed ? ' is-completed' : ''}`}
            initial={reduceMotion ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              className={`home-goal-check${goal.completed ? ' is-checked' : ''}`}
              onClick={() => toggleGoal(goal.id)}
              aria-pressed={goal.completed}
              aria-label={goal.completed ? `Mark "${goal.title}" incomplete` : `Mark "${goal.title}" complete`}
            >
              {goal.completed && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <span className="home-goal-title">{goal.title}</span>
          </motion.li>
        ))}
      </ul>
    </HomeCard>
  );
}
