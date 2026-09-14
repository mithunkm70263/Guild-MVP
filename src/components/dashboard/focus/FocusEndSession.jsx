import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { COMPLETION_THRESHOLD_MS } from '../../../lib/focusData.js';

function formatElapsed(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export default function FocusEndSession({
  elapsedMs,
  completed,
  onSubmit,
  onSkip,
}) {
  const reduceMotion = useReducedMotion();
  const [notes, setNotes] = useState('');
  const elapsedMinutes = Math.floor(elapsedMs / 60000);
  const thresholdMinutes = Math.floor(COMPLETION_THRESHOLD_MS / 60000);

  return createPortal(
    <motion.div
      className="focus-end-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="End of focus session"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        className="focus-end-card"
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
      >
        <span className={`focus-end-badge${completed ? ' is-complete' : ''}`}>
          {completed ? 'Session complete' : 'Session ended early'}
        </span>

        <h2 className="focus-end-title">
          {completed ? 'Well done — you showed up.' : 'Good effort. Come back when you can go deeper.'}
        </h2>

        <p className="focus-end-meta">
          Active focus time: <strong>{formatElapsed(elapsedMinutes)}</strong>
          {!completed && (
            <> — need {formatElapsed(thresholdMinutes)} for a completed session</>
          )}
        </p>

        <label className="focus-label" htmlFor="focus-notes-input">
          What did you get done? <span className="focus-label-optional">(optional)</span>
        </label>
        <textarea
          id="focus-notes-input"
          className="focus-textarea"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Shipped the outline, recorded B-roll notes..."
          rows={3}
          maxLength={280}
        />

        <div className="focus-end-actions">
          <button
            type="button"
            className="focus-end-btn focus-end-btn--primary"
            onClick={() => onSubmit(notes.trim())}
          >
            Save &amp; return
          </button>
          <button
            type="button"
            className="focus-end-btn focus-end-btn--ghost"
            onClick={() => onSkip()}
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
