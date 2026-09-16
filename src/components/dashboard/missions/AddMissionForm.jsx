import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { COLUMN_LABELS } from '../../../lib/missionsData.js';

const COLUMN_OPTIONS = ['today', 'week', 'backlog'];

export default function AddMissionForm({ defaultColumn = 'today', onAdd, onClose }) {
  const reduceMotion = useReducedMotion();
  const inputRef = useRef(null);
  const [title, setTitle] = useState('');
  const [column, setColumn] = useState(defaultColumn);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setColumn(defaultColumn);
  }, [defaultColumn]);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, column });
    setTitle('');
    onClose?.();
  }, [column, onAdd, onClose, title]);

  return (
    <AnimatePresence>
      <motion.form
        className="missions-add-form"
        onSubmit={handleSubmit}
        initial={reduceMotion ? false : { opacity: 0, y: 8, height: 0 }}
        animate={{ opacity: 1, y: 0, height: 'auto' }}
        exit={reduceMotion ? undefined : { opacity: 0, y: -4, height: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <input
          ref={inputRef}
          type="text"
          className="missions-add-input"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What are you shipping?"
          maxLength={120}
          aria-label="Mission title"
        />

        <div className="missions-add-row">
          <div className="missions-add-columns" role="group" aria-label="Timeframe">
            {COLUMN_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                className={`missions-add-column-btn${column === option ? ' is-active' : ''}`}
                onClick={() => setColumn(option)}
                aria-pressed={column === option}
              >
                {COLUMN_LABELS[option]}
              </button>
            ))}
          </div>

          <div className="missions-add-actions">
            {onClose && (
              <button type="button" className="missions-add-cancel" onClick={onClose}>
                Cancel
              </button>
            )}
            <motion.button
              type="submit"
              className="missions-add-submit"
              disabled={!title.trim()}
              whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            >
              Add mission
            </motion.button>
          </div>
        </div>
      </motion.form>
    </AnimatePresence>
  );
}
