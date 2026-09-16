import { useCallback, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  addGoal,
  COLUMN_ORDER,
  getGoals,
  getSprintContext,
  resetGoalsToDefault,
  toggleGoalCompletion,
} from '../../../lib/missionsData.js';
import { pageFade, staggerFeed } from '../home/motionVariants.js';
import MissionsHeader from '../missions/MissionsHeader.jsx';
import SprintContextCard from '../missions/SprintContextCard.jsx';
import MissionColumn from '../missions/MissionColumn.jsx';
import AddMissionForm from '../missions/AddMissionForm.jsx';

export default function MissionsView() {
  const reduceMotion = useReducedMotion();
  const [goals, setGoals] = useState(() => getGoals());
  const [showGlobalAdd, setShowGlobalAdd] = useState(false);
  const sprintContext = useMemo(() => getSprintContext(), []);
  const progress = useMemo(() => {
    const completed = goals.filter((goal) => goal.completed).length;
    const total = goals.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percent };
  }, [goals]);

  const goalsByColumn = useMemo(() => ({
    today: goals.filter((goal) => goal.column === 'today'),
    week: goals.filter((goal) => goal.column === 'week'),
    backlog: goals.filter((goal) => goal.column === 'backlog'),
  }), [goals]);

  const isFullyEmpty = goals.length === 0;

  const handleToggle = useCallback((goalId) => {
    setGoals(toggleGoalCompletion(goalId));
  }, []);

  const handleAdd = useCallback((payload) => {
    setGoals(addGoal(payload));
    setShowGlobalAdd(false);
  }, []);

  const handleSeedDemo = useCallback(() => {
    setGoals(resetGoalsToDefault());
    setShowGlobalAdd(false);
  }, []);

  return (
    <motion.div
      className="missions-view"
      aria-label="Missions"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      <div className="missions-top-row">
        <MissionsHeader progressPercent={progress.percent} />
        <SprintContextCard
          cycleLabel={sprintContext.cycleLabel}
          sprintGoal={sprintContext.sprintGoal}
          podSyncNote={sprintContext.podSyncNote}
        />
      </div>

      {isFullyEmpty ? (
        <motion.section
          className="missions-empty-all"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <div className="missions-empty-all-glow" aria-hidden="true" />
          <span className="missions-empty-all-kicker">Your mission board</span>
          <h2 className="missions-empty-all-title">Nothing here yet</h2>
          <p className="missions-empty-all-copy">
            Add your first mission to plan today, this week, or the backlog. Small steps compound into shipped work.
          </p>
          {showGlobalAdd ? (
            <AddMissionForm
              onAdd={handleAdd}
              onClose={() => setShowGlobalAdd(false)}
            />
          ) : (
            <div className="missions-empty-all-actions">
              <button
                type="button"
                className="missions-empty-all-btn"
                onClick={() => setShowGlobalAdd(true)}
              >
                Add your first mission
              </button>
              <button
                type="button"
                className="missions-empty-all-secondary"
                onClick={handleSeedDemo}
              >
                Load sample missions
              </button>
            </div>
          )}
        </motion.section>
      ) : (
        <>
          {showGlobalAdd && (
            <div className="missions-global-add">
              <AddMissionForm
                onAdd={handleAdd}
                onClose={() => setShowGlobalAdd(false)}
              />
            </div>
          )}

          {!showGlobalAdd && (
            <button
              type="button"
              className="missions-global-add-trigger"
              onClick={() => setShowGlobalAdd(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add mission
            </button>
          )}

          <motion.div
            className="missions-columns"
            variants={staggerFeed}
            initial={reduceMotion ? false : 'hidden'}
            animate="visible"
          >
            {COLUMN_ORDER.map((column) => (
              <MissionColumn
                key={column}
                column={column}
                goals={goalsByColumn[column]}
                onToggle={handleToggle}
                onAdd={handleAdd}
                showGlobalEmpty={false}
              />
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
