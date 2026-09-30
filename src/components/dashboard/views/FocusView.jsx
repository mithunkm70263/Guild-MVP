import { useCallback, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FocusPreSession from '../focus/FocusPreSession.jsx';
import FocusSession from '../focus/FocusSession.jsx';
import FocusEndSession from '../focus/FocusEndSession.jsx';
import FocusTracker from '../focus/FocusTracker.jsx';
import {
  calculateActiveElapsedMs,
  clearActiveSession,
  clearFocusStatus,
  createSessionId,
  getActiveSession,
  getCompletionThresholdMs,
  getFocusSuggestion,
  getSessionDurationMs,
  isSessionCompleted,
  saveActiveSession,
  saveSessionRecord,
  setSessionDurationMinutes,
} from '../../../lib/focusData.js';
import { pageFade } from '../home/motionVariants.js';

const PHASE = {
  PRE: 'pre',
  ACTIVE: 'active',
  END: 'end',
};

function readInitialFocusState() {
  const active = getActiveSession();
  const durationMs = getSessionDurationMs();

  if (!active) {
    return {
      phase: PHASE.PRE,
      focusText: getFocusSuggestion(),
      session: null,
      endMeta: null,
      durationMs,
    };
  }

  if (active.ended) {
    return {
      phase: PHASE.END,
      focusText: active.focusText,
      session: null,
      endMeta: {
        sessionStartTime: active.sessionStartTime,
        totalPausedMs: active.totalPausedMs,
        elapsedMs: Math.min(active.elapsedMs, durationMs),
        endedAt: active.endedAt || Date.now(),
      },
      durationMs,
    };
  }

  const elapsedMs = Math.min(durationMs, calculateActiveElapsedMs(active));
  if (elapsedMs >= durationMs) {
    return {
      phase: PHASE.END,
      focusText: active.focusText,
      session: null,
      endMeta: {
        sessionStartTime: active.sessionStartTime,
        totalPausedMs: active.totalPausedMs,
        elapsedMs,
        endedAt: Date.now(),
      },
      durationMs,
    };
  }

  return {
    phase: PHASE.ACTIVE,
    focusText: active.focusText,
    session: active,
    endMeta: null,
    durationMs,
  };
}

export default function FocusView() {
  const reduceMotion = useReducedMotion();
  const [snapshot] = useState(readInitialFocusState);
  const [phase, setPhase] = useState(snapshot.phase);
  const [focusText, setFocusText] = useState(snapshot.focusText);
  const [sessionMeta, setSessionMeta] = useState(snapshot.endMeta);
  const [activeSession, setActiveSession] = useState(snapshot.session);
  const [durationMs, setDurationMs] = useState(snapshot.durationMs);
  const [trackerKey, setTrackerKey] = useState(0);

  useEffect(() => {
    if (phase === PHASE.ACTIVE) return;
    clearFocusStatus();
  }, [phase]);

  const beginSession = useCallback((selectedMinutes) => {
    const trimmed = focusText.trim();
    if (!trimmed) return;

    // Persist the selected duration
    setSessionDurationMinutes(selectedMinutes);
    const newDurationMs = selectedMinutes * 60 * 1000;
    setDurationMs(newDurationMs);

    const session = {
      focusText: trimmed,
      sessionStartTime: Date.now(),
      totalPausedMs: 0,
      isPaused: false,
      pauseStartTime: null,
      pauseUsed: false,
      ended: false,
      elapsedMs: 0,
      endedAt: null,
    };
    saveActiveSession(session);
    setFocusText(trimmed);
    setActiveSession(session);
    setSessionMeta(null);
    setPhase(PHASE.ACTIVE);
  }, [focusText]);

  const handleSessionEnd = useCallback((meta) => {
    const elapsedMs = Math.min(meta.elapsedMs, durationMs);
    const endedAt = Date.now();
    const nextMeta = {
      sessionStartTime: meta.sessionStartTime,
      totalPausedMs: meta.totalPausedMs,
      elapsedMs,
      endedAt,
    };
    setSessionMeta(nextMeta);
    clearFocusStatus();
    const active = getActiveSession();
    saveActiveSession({
      focusText: active?.focusText || focusText,
      sessionStartTime: meta.sessionStartTime,
      totalPausedMs: meta.totalPausedMs,
      isPaused: false,
      pauseStartTime: null,
      pauseUsed: Boolean(active?.pauseUsed),
      ended: true,
      elapsedMs,
      endedAt,
    });
    setPhase(PHASE.END);
  }, [focusText, durationMs]);

  const finalizeSession = useCallback((notes) => {
    if (!sessionMeta) return;

    const completed = isSessionCompleted(sessionMeta.elapsedMs);
    saveSessionRecord({
      id: createSessionId(),
      focusText,
      startedAt: new Date(sessionMeta.sessionStartTime).toISOString(),
      endedAt: new Date(sessionMeta.endedAt || Date.now()).toISOString(),
      elapsedMs: sessionMeta.elapsedMs,
      completed,
      notes: notes || '',
    });

    clearActiveSession();
    clearFocusStatus();
    setSessionMeta(null);
    setActiveSession(null);
    setPhase(PHASE.PRE);
    setTrackerKey((key) => key + 1);
  }, [focusText, sessionMeta]);

  const handleSkip = useCallback(() => {
    finalizeSession('');
  }, [finalizeSession]);

  const handleSubmit = useCallback((notes) => {
    finalizeSession(notes);
  }, [finalizeSession]);

  return (
    <motion.div
      className="focus-view"
      aria-label="Focus"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={pageFade}
    >
      {phase === PHASE.PRE && (
        <>
          <FocusPreSession
            focusText={focusText}
            onFocusTextChange={setFocusText}
            onStart={beginSession}
            disabled={phase !== PHASE.PRE}
          />
          <FocusTracker key={trackerKey} />
        </>
      )}

      {phase === PHASE.ACTIVE && activeSession && (
        <FocusSession
          key={activeSession.sessionStartTime}
          focusText={activeSession.focusText}
          initialSession={activeSession}
          onEnd={handleSessionEnd}
          durationMs={durationMs}
        />
      )}

      {phase === PHASE.END && sessionMeta && (
        <FocusEndSession
          elapsedMs={sessionMeta.elapsedMs}
          completed={isSessionCompleted(sessionMeta.elapsedMs)}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
        />
      )}
    </motion.div>
  );
}
