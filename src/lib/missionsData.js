import { getUpcomingMeeting } from './homeData.js';

const CYCLE_TOTAL_WEEKS = 8;

function readCycleStart() {
  try {
    const raw = localStorage.getItem('guild-cycle-start');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getDefaultCycleStart() {
  const start = new Date();
  start.setDate(start.getDate() - 14);
  return start;
}

function getCycleProgress() {
  const cycleStart = readCycleStart();
  const start = cycleStart ? new Date(cycleStart) : getDefaultCycleStart();
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const currentWeek = Math.min(
    CYCLE_TOTAL_WEEKS,
    Math.max(1, Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000)) + 1),
  );

  return {
    currentWeek,
    totalWeeks: CYCLE_TOTAL_WEEKS,
    label: `Week ${currentWeek} of ${CYCLE_TOTAL_WEEKS}`,
    progressPercent: Math.round((currentWeek / CYCLE_TOTAL_WEEKS) * 100),
  };
}

export const GOALS_KEY = 'guild-missions-goals';

/** @typedef {'today'|'week'|'backlog'} MissionColumn */

/**
 * @typedef {Object} MissionGoal
 * @property {string} id
 * @property {string} title
 * @property {MissionColumn} column
 * @property {number} focusMinutes
 * @property {boolean} completed
 * @property {string|null} completedAt
 */

/** @type {MissionGoal[]} */
const DEFAULT_GOALS = [
  {
    id: 'mission-1',
    title: 'Ship OAuth callback handler',
    column: 'today',
    focusMinutes: 42,
    completed: false,
    completedAt: null,
  },
  {
    id: 'mission-2',
    title: 'Write pod sync notes',
    column: 'today',
    focusMinutes: 25,
    completed: true,
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mission-3',
    title: 'Review PR feedback from pod',
    column: 'today',
    focusMinutes: 30,
    completed: false,
    completedAt: null,
  },
  {
    id: 'mission-4',
    title: 'Record 2-min product demo',
    column: 'week',
    focusMinutes: 90,
    completed: false,
    completedAt: null,
  },
  {
    id: 'mission-5',
    title: 'Update landing page hero copy',
    column: 'week',
    focusMinutes: 60,
    completed: false,
    completedAt: null,
  },
  {
    id: 'mission-6',
    title: 'Research competitor onboarding flows',
    column: 'backlog',
    focusMinutes: 45,
    completed: false,
    completedAt: null,
  },
  {
    id: 'mission-7',
    title: 'Set up analytics event tracking',
    column: 'backlog',
    focusMinutes: 120,
    completed: false,
    completedAt: null,
  },
];

export const COLUMN_LABELS = {
  today: 'Today',
  week: 'This week',
  backlog: 'Backlog',
};

export const COLUMN_ORDER = ['today', 'week', 'backlog'];

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

export function createMissionId() {
  return `mission-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/** @returns {MissionGoal[]} */
export function getGoals() {
  const stored = readStorage(GOALS_KEY, null);
  if (stored && Array.isArray(stored)) return stored;
  writeStorage(GOALS_KEY, DEFAULT_GOALS);
  return DEFAULT_GOALS;
}

/** @returns {MissionGoal[]} */
export function resetGoalsToDefault() {
  writeStorage(GOALS_KEY, DEFAULT_GOALS);
  return DEFAULT_GOALS;
}

/** @param {MissionGoal[]} goals */
export function saveGoals(goals) {
  writeStorage(GOALS_KEY, goals);
}

/** @param {MissionColumn} column */
export function getGoalsByColumn(column) {
  return getGoals().filter((goal) => goal.column === column);
}

/** @returns {{ completed: number, total: number }} */
export function getWeeklyGoalsProgress() {
  const weeklyGoals = getGoals().filter((goal) => goal.column === 'today' || goal.column === 'week');
  const completed = weeklyGoals.filter((goal) => goal.completed).length;
  return { completed, total: weeklyGoals.length };
}

/** @returns {{ completed: number, total: number, percent: number }} */
export function getMissionsProgress() {
  const goals = getGoals();
  const completed = goals.filter((goal) => goal.completed).length;
  const total = goals.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { completed, total, percent };
}

/**
 * @param {string} goalId
 * @returns {MissionGoal[]}
 */
export function toggleGoalCompletion(goalId) {
  const next = getGoals().map((goal) => {
    if (goal.id !== goalId) return goal;
    const completed = !goal.completed;
    return {
      ...goal,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    };
  });
  saveGoals(next);
  return next;
}

/**
 * @param {{ title: string, column: MissionColumn, focusMinutes?: number }} input
 * @returns {MissionGoal[]}
 */
export function addGoal({ title, column, focusMinutes = 45 }) {
  const trimmed = title.trim();
  if (!trimmed) return getGoals();

  const goal = {
    id: createMissionId(),
    title: trimmed,
    column,
    focusMinutes: Math.max(5, focusMinutes),
    completed: false,
    completedAt: null,
  };

  const next = [...getGoals(), goal];
  saveGoals(next);
  return next;
}

export function formatFocusTime(minutes) {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (remainder === 0) return `${hours}H FOCUS`;
    return `${hours}H ${remainder}M FOCUS`;
  }
  return `${minutes}M FOCUS`;
}

export function getSprintContext() {
  const cycle = getCycleProgress();
  const meeting = getUpcomingMeeting();
  const meetingTime = meeting?.date
    ? new Date(meeting.date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
    : '7:30 PM';

  return {
    cycleLabel: cycle.label,
    sprintGoal: 'Ship OAuth + profile sync by end of week',
    podSyncNote: `Pod sync at ${meetingTime}`,
    podName: 'Sprint Pod Alpha',
  };
}
