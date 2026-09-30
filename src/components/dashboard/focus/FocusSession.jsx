import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  calculateActiveElapsedMs,
  formatTimerDisplay,
  saveActiveSession,
  setFocusStatus,
} from '../../../lib/focusData.js';

const RING_RADIUS = 88;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const EASE = [0.16, 1, 0.3, 1];

function remainingFromSession(session, durationMs) {
  const elapsed = calculateActiveElapsedMs({
    sessionStartTime: session.sessionStartTime,
    totalPausedMs: session.totalPausedMs,
    isPaused: session.isPaused,
    pauseStartTime: session.pauseStartTime,
  });
  return Math.max(0, durationMs - elapsed);
}

export default function FocusSession({
  focusText,
  initialSession,
  onEnd,
  durationMs,
}) {
  const reduceMotion = useReducedMotion();
  const [sessionStartTime] = useState(() => initialSession.sessionStartTime);
  const [isPaused, setIsPaused] = useState(() => initialSession.isPaused);
  const [pauseUsed, setPauseUsed] = useState(() => initialSession.pauseUsed);
  const [pauseStartTime, setPauseStartTime] = useState(() => initialSession.pauseStartTime);
  const [totalPausedMs, setTotalPausedMs] = useState(() => initialSession.totalPausedMs);
  const [remainingMs, setRemainingMs] = useState(() => remainingFromSession(initialSession, durationMs));
  const tickRef = useRef(null);
  const endedRef = useRef(false);
  const onEndRef = useRef(onEnd);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    setFocusStatus('in-focus');
  }, []);

  useEffect(() => {
    if (endedRef.current) return;
    saveActiveSession({
      focusText,
      sessionStartTime,
      totalPausedMs,
      isPaused,
      pauseStartTime,
      pauseUsed,
      ended: false,
      elapsedMs: 0,
      endedAt: null,
    });
  }, [focusText, sessionStartTime, totalPausedMs, isPaused, pauseStartTime, pauseUsed]);

  const finish = useCallback((pausedMs, paused, pauseStarted) => {
    if (endedRef.current) return;
    endedRef.current = true;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }

    const activeElapsed = calculateActiveElapsedMs({
      sessionStartTime,
      totalPausedMs: pausedMs,
      isPaused: paused,
      pauseStartTime: pauseStarted,
    });

    onEndRef.current({
      sessionStartTime,
      totalPausedMs: paused && pauseStarted
        ? pausedMs + Date.now() - pauseStarted
        : pausedMs,
      elapsedMs: Math.min(durationMs, activeElapsed),
    });
  }, [sessionStartTime, durationMs]);

  const tick = useCallback(() => {
    if (endedRef.current) return;
    const activeElapsed = calculateActiveElapsedMs({
      sessionStartTime,
      totalPausedMs,
      isPaused,
      pauseStartTime,
    });
    const nextRemaining = Math.max(0, durationMs - activeElapsed);
    setRemainingMs(nextRemaining);
    if (nextRemaining === 0) {
      finish(totalPausedMs, isPaused, pauseStartTime);
    }
  }, [sessionStartTime, totalPausedMs, isPaused, pauseStartTime, finish]);

  useEffect(() => {
    tick();
    tickRef.current = window.setInterval(tick, 250);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [tick]);

  const handlePause = () => {
    if (pauseUsed || isPaused || endedRef.current) return;
    setPauseUsed(true);
    setIsPaused(true);
    setPauseStartTime(Date.now());
  };

  const handleResume = () => {
    if (!isPaused || !pauseStartTime || endedRef.current) return;
    setTotalPausedMs((prev) => prev + Date.now() - pauseStartTime);
    setPauseStartTime(null);
    setIsPaused(false);
  };

  const handleEnd = () => {
    finish(totalPausedMs, isPaused, pauseStartTime);
  };

  const progress = 1 - remainingMs / durationMs;
  const statusLabel = isPaused ? 'Paused' : 'remaining';

  return createPortal(
    <motion.div
      className={`focus-session-overlay${isPaused ? ' is-paused' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Focus session in progress"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
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

      <motion.div
        className="focus-session-body"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.7, ease: EASE, delay: reduceMotion ? 0 : 0.08 }}
      >
        <p className="focus-session-kicker">In focus</p>
        <p className="focus-session-intent">{focusText}</p>

        <div className="focus-session-timer-wrap">
          <motion.div
            className="focus-session-timer-glow"
            aria-hidden="true"
            animate={reduceMotion ? undefined : {
              scale: [1, 1.05, 1],
              opacity: [0.45, 0.75, 0.45],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          <div className="focus-session-ring-wrap">
            <svg className="focus-session-ring-svg" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <linearGradient id="focus-ring-gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7eaea0" />
                  <stop offset="100%" stopColor="#c47d2a" />
                </linearGradient>
              </defs>
              <circle className="focus-session-ring-halo" cx="100" cy="100" r="94" />
              <circle className="focus-session-ring-track" cx="100" cy="100" r={RING_RADIUS} />
              <circle
                className="focus-session-ring-value"
                cx="100"
                cy="100"
                r={RING_RADIUS}
                transform="rotate(-90 100 100)"
                style={{
                  strokeDasharray: RING_CIRCUMFERENCE,
                  strokeDashoffset: progress * RING_CIRCUMFERENCE,
                  transition: reduceMotion ? 'none' : 'stroke-dashoffset 1s linear',
                }}
              />
            </svg>

            <div className="focus-session-timer-stack">
              <p className="focus-session-timer">{formatTimerDisplay(remainingMs)}</p>
              <p className="focus-session-remaining-label">{statusLabel}</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={isPaused ? 'paused' : 'running'}
            className="focus-session-hint"
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
          >
            {isPaused ? 'Paused — take a breath, then resume' : 'Stay with it. One block at a time.'}
          </motion.p>
        </AnimatePresence>

        <div className="focus-session-actions">
          <AnimatePresence mode="wait">
            {isPaused ? (
              <motion.button
                key="resume"
                type="button"
                className="focus-session-pause-btn"
                onClick={handleResume}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
              >
                Resume
              </motion.button>
            ) : (
              !pauseUsed && (
                <motion.button
                  key="pause"
                  type="button"
                  className="focus-session-pause-btn"
                  onClick={handlePause}
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.3, ease: EASE }}
                >
                  Pause once
                </motion.button>
              )
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  );
}
