import { useCallback, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import FocusPreSession from '../focus/FocusPreSession.jsx';
import FocusSession from '../focus/FocusSession.jsx';
import FocusEndSession from '../focus/FocusEndSession.jsx';
import FocusTracker from '../focus/FocusTracker.jsx';
import {
  clearFocusStatus,
  createSessionId,
  getFocusSuggestion,
  isSessionCompleted,
  saveSessionRecord,
} from '../../../lib/focusData.js';
import { pageFade } from '../home/motionVariants.js';

const PHASE = {
  PRE: 'pre',
  ACTIVE: 'active',
  END: 'end',
};

export default function FocusView() {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState(PHASE.PRE);
  const [focusText, setFocusText] = useState(() => getFocusSuggestion());
  const [sessionMeta, setSessionMeta] = useState(null);
  const [trackerKey, setTrackerKey] = useState(0);

  const handleSessionEnd = useCallback((meta) => {
    setSessionMeta(meta);
    clearFocusStatus();
    setPhase(PHASE.END);
  }, []);

  const finalizeSession = useCallback((notes) => {
    if (!sessionMeta) return;

    const completed = isSessionCompleted(sessionMeta.elapsedMs);
    saveSessionRecord({
      id: createSessionId(),
      focusText,
      startedAt: new Date(sessionMeta.sessionStartTime).toISOString(),
      endedAt: new Date().toISOString(),
      elapsedMs: sessionMeta.elapsedMs,
      completed,
      notes: notes || '',
    });

    setSessionMeta(null);
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
            onStart={() => setPhase(PHASE.ACTIVE)}
            disabled={phase !== PHASE.PRE}
          />
          <FocusTracker key={trackerKey} />
        </>
      )}

      {phase === PHASE.ACTIVE && (
        <FocusSession
          focusText={focusText}
          onEnd={handleSessionEnd}
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
