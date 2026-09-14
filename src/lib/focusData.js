import { getBuilderTrack } from './dashboardProfile.js';

const APPLICATION_KEYS = {
  youtube: 'guild-yt-application',
  'ai-app': 'guild-ai-app-application',
  'ai-saas': 'guild-ai-saas-application',
  vibecoder: 'guild-vibecoder-application',
};

export const SESSIONS_KEY = 'guild-focus-sessions';
export const FOCUS_STATUS_KEY = 'guild-focus-status';

export const SESSION_DURATION_MS = 90 * 60 * 1000;
export const COMPLETION_THRESHOLD_MS = 72 * 60 * 1000;

const DEFAULT_WEEKLY_HOURS = 5;

const FOCUS_SUGGESTIONS = {
  youtube: "Outline this week's video script",
  'ai-app': 'Build the next feature for your AI app',
  'ai-saas': 'Ship one improvement to your product',
  vibecoder: 'Push your current project forward',
};

function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable
  }
}

function loadApplicationForTrack(trackId) {
  const key = APPLICATION_KEYS[trackId];
  if (!key) return null;
  return readStorage(key);
}

function parseWeeklyHours(value) {
  if (!value || typeof value !== 'string') return DEFAULT_WEEKLY_HOURS;

  const rangeMatch = value.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (rangeMatch) {
    const low = Number(rangeMatch[1]);
    const high = Number(rangeMatch[2]);
    return (low + high) / 2;
  }

  const singleMatch = value.match(/(\d+)/);
  if (singleMatch) return Number(singleMatch[1]);

  return DEFAULT_WEEKLY_HOURS;
}

export function getWeeklyHourCommitment() {
  const track = getBuilderTrack();
  const trackId = track?.id || 'youtube';
  const application = loadApplicationForTrack(trackId);
  return parseWeeklyHours(application?.weeklyHours);
}

export function getWeeklySessionTarget() {
  const hours = getWeeklyHourCommitment();
  return Math.max(1, Math.round(hours / 1.5));
}

export function getFocusSuggestion() {
  const track = getBuilderTrack();
  const trackId = track?.id || 'youtube';
  return FOCUS_SUGGESTIONS[trackId] || 'Deep work on your builder goal';
}

export function getSessions() {
  const stored = readStorage(SESSIONS_KEY, null);
  if (stored && Array.isArray(stored)) return stored;
  return [];
}

function saveSessions(sessions) {
  writeStorage(SESSIONS_KEY, sessions);
}

export function isSessionCompleted(elapsedMs) {
  return elapsedMs >= COMPLETION_THRESHOLD_MS;
}

export function createSessionId() {
  return `focus-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function saveSessionRecord(record) {
  const sessions = getSessions();
  sessions.unshift(record);
  saveSessions(sessions);
  return record;
}

export function setFocusStatus(status) {
  try {
    localStorage.setItem(FOCUS_STATUS_KEY, status);
  } catch {
    // Storage unavailable
  }
}

export function clearFocusStatus() {
  try {
    localStorage.removeItem(FOCUS_STATUS_KEY);
  } catch {
    // Storage unavailable
  }
}

export function getFocusStatus() {
  try {
    return localStorage.getItem(FOCUS_STATUS_KEY);
  } catch {
    return null;
  }
}

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function isSameDay(a, b) {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

function isSameWeek(a, b) {
  return startOfWeek(a).getTime() === startOfWeek(b).getTime();
}

export function getCompletedSessions() {
  return getSessions().filter((session) => session.completed);
}

export function getWeeklyProgress(referenceDate = new Date()) {
  const target = getWeeklySessionTarget();
  const completed = getCompletedSessions().filter((session) =>
    isSameWeek(new Date(session.endedAt), referenceDate),
  ).length;

  return { completed, target };
}

export function getMonthlyHeatmap(year, month) {
  const sessions = getCompletedSessions();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day);
    const count = sessions.filter((session) =>
      isSameDay(new Date(session.endedAt), date),
    ).length;

    days.push({
      date,
      day,
      count,
      hasSession: count >= 1,
    });
  }

  return {
    year,
    month,
    monthLabel: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    days,
    leadingEmpty: firstDay.getDay(),
  };
}

export function getStreaks(referenceDate = new Date()) {
  const completed = getCompletedSessions();
  const sessionDays = new Set(
    completed.map((session) => startOfDay(new Date(session.endedAt)).getTime()),
  );

  let dayStreak = 0;
  const cursor = startOfDay(referenceDate);
  while (sessionDays.has(cursor.getTime())) {
    dayStreak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const sessionWeeks = new Set(
    completed.map((session) => startOfWeek(new Date(session.endedAt)).getTime()),
  );

  let weekStreak = 0;
  const weekCursor = startOfWeek(referenceDate);
  while (sessionWeeks.has(weekCursor.getTime())) {
    weekStreak += 1;
    weekCursor.setDate(weekCursor.getDate() - 7);
  }

  return { dayStreak, weekStreak };
}

export function formatTimerDisplay(remainingMs) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function calculateActiveElapsedMs({
  sessionStartTime,
  totalPausedMs,
  isPaused,
  pauseStartTime,
  now = Date.now(),
}) {
  let paused = totalPausedMs;
  if (isPaused && pauseStartTime) {
    paused += now - pauseStartTime;
  }
  return Math.max(0, now - sessionStartTime - paused);
}
