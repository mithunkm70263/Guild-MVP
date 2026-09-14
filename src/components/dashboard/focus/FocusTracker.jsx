import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  getMonthlyHeatmap,
  getStreaks,
  getWeeklyProgress,
} from '../../../lib/focusData.js';
import { fadeUp } from '../home/motionVariants.js';
import HomeCard from '../home/HomeCard.jsx';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function WeeklyProgress({ progress }) {
  const percent = progress.target > 0
    ? Math.min(100, Math.round((progress.completed / progress.target) * 100))
    : 0;

  return (
    <div className="focus-tracker-weekly">
      <div className="focus-tracker-weekly-head">
        <span className="focus-tracker-stat">
          {progress.completed}/{progress.target}
        </span>
        <span className="focus-tracker-stat-label">sessions this week</span>
      </div>
      <div className="focus-tracker-bar" aria-hidden="true">
        <motion.div
          className="focus-tracker-bar-fill"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: percent / 100 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <p className="focus-tracker-weekly-copy">
        {progress.completed >= progress.target
          ? 'Weekly target hit — keep the momentum.'
          : `${progress.target - progress.completed} more to hit your weekly target.`}
      </p>
    </div>
  );
}

function MonthHeatmap({ heatmap }) {
  const { days, leadingEmpty, monthLabel } = heatmap;
  const cells = useMemo(() => {
    const blanks = Array.from({ length: leadingEmpty }, (_, i) => ({ type: 'blank', key: `blank-${i}` }));
    const dayCells = days.map((day) => ({ type: 'day', key: `day-${day.day}`, ...day }));
    return [...blanks, ...dayCells];
  }, [days, leadingEmpty]);

  return (
    <div className="focus-tracker-heatmap">
      <div className="focus-tracker-heatmap-head">
        <h3 className="focus-tracker-section-title">This month</h3>
        <span className="focus-tracker-month-label">{monthLabel}</span>
      </div>

      <div className="focus-tracker-weekdays" aria-hidden="true">
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={`${label}-${index}`} className="focus-tracker-weekday">{label}</span>
        ))}
      </div>

      <div className="focus-tracker-grid" role="img" aria-label="Monthly focus session heatmap">
        {cells.map((cell) => {
          if (cell.type === 'blank') {
            return <span key={cell.key} className="focus-heatmap-cell focus-heatmap-cell--blank" />;
          }

          const level = cell.count >= 2 ? 2 : cell.count >= 1 ? 1 : 0;
          return (
            <motion.span
              key={cell.key}
              className={`focus-heatmap-cell focus-heatmap-cell--level-${level}`}
              title={cell.hasSession ? `${cell.count} session${cell.count > 1 ? 's' : ''} on day ${cell.day}` : `No sessions on day ${cell.day}`}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: cell.day * 0.01 }}
            />
          );
        })}
      </div>
    </div>
  );
}

function StreakDisplay({ streaks }) {
  return (
    <div className="focus-tracker-streaks">
      <div className="focus-tracker-streak">
        <span className="focus-tracker-streak-value">{streaks.dayStreak}</span>
        <span className="focus-tracker-streak-label">day streak</span>
      </div>
      <div className="focus-tracker-streak-divider" aria-hidden="true" />
      <div className="focus-tracker-streak">
        <span className="focus-tracker-streak-value">{streaks.weekStreak}</span>
        <span className="focus-tracker-streak-label">week streak</span>
      </div>
    </div>
  );
}

export default function FocusTracker() {
  const reduceMotion = useReducedMotion();
  const now = new Date();
  const weeklyProgress = getWeeklyProgress(now);
  const heatmap = getMonthlyHeatmap(now.getFullYear(), now.getMonth());
  const streaks = getStreaks(now);

  return (
    <motion.section
      className="focus-tracker"
      aria-labelledby="focus-tracker-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
    >
      <header className="focus-tracker-header">
        <h2 id="focus-tracker-title" className="focus-tracker-title">Your focus rhythm</h2>
        <p className="focus-tracker-subtitle">Only sessions at 80%+ count toward your streaks.</p>
      </header>

      <div className="focus-tracker-grid-layout">
        <HomeCard className="focus-tracker-card" hoverable={false}>
          <WeeklyProgress progress={weeklyProgress} />
        </HomeCard>

        <HomeCard className="focus-tracker-card" hoverable={false}>
          <StreakDisplay streaks={streaks} />
        </HomeCard>

        <HomeCard className="focus-tracker-card focus-tracker-card--wide" hoverable={false}>
          <MonthHeatmap heatmap={heatmap} />
        </HomeCard>
      </div>
    </motion.section>
  );
}
