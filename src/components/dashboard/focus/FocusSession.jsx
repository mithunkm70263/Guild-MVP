import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  SESSION_DURATION_MS,
  calculateActiveElapsedMs,
  formatTimerDisplay,
  setFocusStatus,
} from '../../../lib/focusData.js';

export default function FocusSession({
  focusText,
  onEnd,
}) {
  const reduceMotion = useReducedMotion();
  const [sessionStartTime] = useState(() => Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [pauseUsed, setPauseUsed] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(null);
  const [totalPausedMs, setTotalPausedMs] = useState(0);
  const [remainingMs, setRemainingMs] = useState(SESSION_DURATION_MS);
  const tickRef = useRef(null);

  useEffect(() => {
    setFocusStatus('in-focus');
    return () => {
      // Status cleared by parent on session end
    };
  }, []);

  const tick = useCallback(() => {
    const activeElapsed = calculateActiveElapsedMs({
      sessionStartTime,
      totalPausedMs,
      isPaused,
      pauseStartTime,
    });
    setRemainingMs(Math.max(0, SESSION_DURATION_MS - activeElapsed));
  }, [sessionStartTime, totalPausedMs, isPaused, pauseStartTime]);

  useEffect(() => {
    tick();
    tickRef.current = window.setInterval(tick, 250);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [tick]);

  const handlePause = () => {
    if (pauseUsed || isPaused) return;
    setPauseUsed(true);
    setIsPaused(true);
    setPauseStartTime(Date.now());
  };

  const handleResume = () => {
    if (!isPaused || !pauseStartTime) return;
    setTotalPausedMs((prev) => prev + Date.now() - pauseStartTime);
    setPauseStartTime(null);
    setIsPaused(false);
  };

  const handleEnd = () => {
    const activeElapsed = calculateActiveElapsedMs({
      sessionStartTime,
      totalPausedMs,
      isPaused,
      pauseStartTime,
    });

    onEnd({
      sessionStartTime,
      totalPausedMs: isPaused && pauseStartTime
        ? totalPausedMs + Date.now() - pauseStartTime
        : totalPausedMs,
      elapsedMs: activeElapsed,
    });
  };

  const progress = 1 - remainingMs / SESSION_DURATION_MS;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="focus-session-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Focus session in progress"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="focus-session-ambient" aria-hidden="true" />
        <div className="focus-session-ambient focus-session-ambient--gold" aria-hidden="true" />

        <button
          type="button"
          className="focus-session-exit"
          onClick={handleEnd}
          aria-label="End focus session"
        >
          End session
        </button>

        <div className="focus-session-body">
          <p className="focus-session-intent">{focusText}</p>

          <div className="focus-session-timer-wrap">
            <motion.div
              className="focus-session-timer-glow"
              aria-hidden="true"
              animate={reduceMotion ? undefined : {
                scale: [1, 1.06, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.p
              className="focus-session-timer"
              key={Math.floor(remainingMs / 1000)}
              initial={reduceMotion ? false : { opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {formatTimerDisplay(remainingMs)}
            </motion.p>
            <div className="focus-session-progress" aria-hidden="true">
              <motion.div
                className="focus-session-progress-fill"
                initial={false}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>

          <p className="focus-session-hint">
            {isPaused ? 'Paused — take a breath, then resume' : 'Stay with it. One block at a time.'}
          </p>

          <div className="focus-session-actions">
            {isPaused ? (
              <button
                type="button"
                className="focus-session-pause-btn"
                onClick={handleResume}
              >
                Resume
              </button>
            ) : (
              !pauseUsed && (
                <button
                  type="button"
                  className="focus-session-pause-btn"
                  onClick={handlePause}
                >
                  Pause once
                </button>
              )
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
