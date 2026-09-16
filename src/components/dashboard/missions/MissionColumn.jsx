import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { COLUMN_LABELS } from '../../../lib/missionsData.js';
import MissionCard from './MissionCard.jsx';
import AddMissionForm from './AddMissionForm.jsx';

function CountBadge({ count, label }) {
  const reduceMotion = useReducedMotion();
  const [displayCount, setDisplayCount] = useState(reduceMotion ? count : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplayCount(count);
      return undefined;
    }

    let frame;
    const start = performance.now();
    const duration = 700;

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayCount(Math.round(eased * count));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count, reduceMotion]);

  return (
    <span className="missions-column-badge">
      <span className="missions-column-badge-label">{label}</span>
      <motion.span
        className="missions-column-badge-count"
        key={count}
        initial={reduceMotion ? false : { opacity: 0.6, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {displayCount}
      </motion.span>
    </span>
  );
}

export default function MissionColumn({
  column,
  goals,
  onToggle,
  onAdd,
  showGlobalEmpty,
}) {
  const reduceMotion = useReducedMotion();
  const [showForm, setShowForm] = useState(false);
  const label = COLUMN_LABELS[column];
  const badgeLabel = column === 'today' ? 'TODAY' : column === 'week' ? 'THIS WEEK' : 'BACKLOG';
  const isEmpty = goals.length === 0;

  if (showGlobalEmpty) {
    return null;
  }

  return (
    <motion.section
      className="missions-column"
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
        delay: column === 'today' ? 0.1 : column === 'week' ? 0.18 : 0.26,
      }}
    >
      <header className="missions-column-head">
        <CountBadge count={goals.length} label={badgeLabel} />
        <h2 className="missions-column-title">{label}</h2>
      </header>

      <ul className="missions-column-list">
        <AnimatePresence initial={false}>
          {goals.map((goal, index) => (
            <MissionCard
              key={goal.id}
              goal={goal}
              onToggle={onToggle}
              index={index}
            />
          ))}
        </AnimatePresence>
      </ul>

      {isEmpty && !showForm && (
        <p className="missions-column-empty">
          Nothing here yet — add your first mission
        </p>
      )}

      {showForm ? (
        <AddMissionForm
          defaultColumn={column}
          onAdd={(payload) => {
            onAdd(payload);
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      ) : (
        <button
          type="button"
          className="missions-add-trigger"
          onClick={() => setShowForm(true)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add mission
        </button>
      )}
    </motion.section>
  );
}
