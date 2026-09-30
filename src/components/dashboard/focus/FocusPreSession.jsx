import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { fadeUp } from '../home/motionVariants.js';
import {
  DURATION_OPTIONS,
  getSessionDurationMinutes,
  setSessionDurationMinutes,
} from '../../../lib/focusData.js';
import { useState, useCallback } from 'react';

const DURATION_DESCRIPTIONS = {
  30: 'A quick sprint — sharp focus, one task.',
  60: 'A solid block — enough time to build momentum.',
  90: 'The deep-work block — your pod sees when you\'re in focus.',
};

function formatDurationDisplay(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0 && mins > 0) return `${hrs}:${String(mins).padStart(2, '0')}:00`;
  if (hrs > 0) return `${hrs}:00:00`;
  return `${mins}:00`;
}

export default function FocusPreSession({ focusText, onFocusTextChange, onStart, disabled }) {
  const reduceMotion = useReducedMotion();
  const [selectedMinutes, setSelectedMinutes] = useState(getSessionDurationMinutes);
  const canStart = !disabled && Boolean(focusText.trim());

  const handleDurationChange = useCallback((minutes) => {
    setSelectedMinutes(minutes);
    setSessionDurationMinutes(minutes);
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canStart) return;
    onStart(selectedMinutes);
  };

  return (
    <motion.form
      className="focus-pre-session"
      aria-labelledby="focus-pre-title"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={fadeUp}
      onSubmit={handleSubmit}
    >
      <div className="focus-pre-glow" aria-hidden="true" />

      <div className="focus-pre-scroll">
        <header className="focus-pre-header">
          <span className="focus-kicker">Deep work</span>
          <h1 id="focus-pre-title" className="focus-title">Focus Session</h1>
          <p className="focus-subtitle">
            {DURATION_DESCRIPTIONS[selectedMinutes] || DURATION_DESCRIPTIONS[90]}
          </p>
        </header>

        <div className="focus-pre-form">
          <label className="focus-label" htmlFor="focus-intent-input">
            What are you focusing on?
          </label>
          <input
            id="focus-intent-input"
            type="text"
            className="focus-input"
            value={focusText}
            onChange={(event) => onFocusTextChange(event.target.value)}
            placeholder="e.g. Outline this week's video script"
            maxLength={120}
            autoComplete="off"
          />
        </div>

        <aside className="focus-pre-aside">
          {/* Duration selector */}
          <div className="focus-duration-picker" role="radiogroup" aria-label="Session duration">
            <span className="focus-duration-picker-label">Duration</span>
            <div className="focus-duration-options">
              {DURATION_OPTIONS.map((opt) => {
                const isActive = opt.minutes === selectedMinutes;
                return (
                  <motion.button
                    key={opt.minutes}
                    type="button"
                    className={`focus-duration-option${isActive ? ' is-active' : ''}`}
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => handleDurationChange(opt.minutes)}
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  >
                    {isActive && (
                      <motion.span
                        className="focus-duration-pill"
                        layoutId="focus-duration-pill"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 30,
                          mass: 0.8,
                        }}
                      />
                    )}
                    <span className="focus-duration-option-text">{opt.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Animated timer display */}
          <div className="focus-pre-duration-wrap">
            <AnimatePresence mode="wait">
              <motion.p
                key={selectedMinutes}
                className="focus-pre-duration"
                initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.92, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -14, scale: 0.92, filter: 'blur(6px)' }}
                transition={{
                  duration: reduceMotion ? 0 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {formatDurationDisplay(selectedMinutes)}
              </motion.p>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={selectedMinutes}
              className="focus-pre-aside-copy"
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: reduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {selectedMinutes === 30 && 'Quick burst. Stay locked in until the timer ends.'}
              {selectedMinutes === 60 && 'One hour. Build momentum and ship something real.'}
              {selectedMinutes === 90 && 'One block. Stay with a single intention until the timer ends.'}
            </motion.p>
          </AnimatePresence>
        </aside>
      </div>

      <div className="focus-pre-actions">
        <motion.button
          type="submit"
          className="focus-start-btn"
          disabled={!canStart}
          whileHover={reduceMotion || !canStart ? undefined : { scale: 1.01 }}
          whileTap={reduceMotion || !canStart ? undefined : { scale: 0.99 }}
        >
          <span className="focus-start-btn-glow" aria-hidden="true" />
          <span className="focus-start-btn-label">Start Focus Session</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
