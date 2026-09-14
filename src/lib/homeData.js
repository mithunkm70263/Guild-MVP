const STORAGE_KEYS = {
  dailyTasks: 'guild-home-daily-tasks',
  weeklyGoals: 'guild-home-weekly-goals',
  streak: 'guild-home-streak',
};

const DEFAULT_DAILY_TASKS = [
  {
    id: 'task-1',
    title: 'Ship your daily artifact',
    description: 'Post a build update or demo link in your pod channel',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Review pod feedback',
    description: 'Read and respond to yesterday\'s async comments',
    completed: false,
  },
  {
    id: 'task-3',
    title: '15-min focus block',
    description: 'Work on your weekly goal without distractions',
    completed: false,
  },
];

const DEFAULT_WEEKLY_GOALS = [
  { id: 'goal-1', title: 'Launch landing page v1', completed: true },
  { id: 'goal-2', title: 'Record 2-min product demo', completed: true },
  { id: 'goal-3', title: 'Get 3 user interviews booked', completed: false },
  { id: 'goal-4', title: 'Ship onboarding flow', completed: false },
];

const DEFAULT_MEETING = {
  id: 'meeting-1',
  title: 'Pod Sync — Build Review',
  date: getNextMeetingDate(),
  durationMinutes: 45,
  joinUrl: 'https://meet.guild.build/pod-sync',
};

const DEFAULT_POD_MEMBERS = [
  {
    id: 'member-1',
    name: 'Rahul Sharma',
    initials: 'RS',
    status: 'Shipped auth flow yesterday',
    avatarColor: '#4a7c6e',
  },
  {
    id: 'member-2',
    name: 'Priya Nair',
    initials: 'PN',
    status: 'Working on onboarding screens',
    avatarColor: '#c47d2a',
  },
  {
    id: 'member-3',
    name: 'Alex Chen',
    initials: 'AC',
    status: 'Blocked on API keys — asked pod',
    avatarColor: '#5b6eae',
  },
];

const DEFAULT_ACTIVITY = [
  {
    id: 'activity-1',
    actorName: 'Rahul Sharma',
    actorInitials: 'RS',
    action: 'shipped a new login flow to staging',
    timestamp: hoursAgo(2),
    type: 'artifact',
    avatarColor: '#4a7c6e',
  },
  {
    id: 'activity-2',
    actorName: 'You',
    actorInitials: 'YO',
    action: 'completed "Record 2-min product demo"',
    timestamp: hoursAgo(5),
    type: 'milestone',
    avatarColor: '#3d6b5f',
  },
  {
    id: 'activity-3',
    actorName: 'Priya Nair',
    actorInitials: 'PN',
    action: 'shared wireframes for onboarding v2',
    timestamp: hoursAgo(18),
    type: 'update',
    avatarColor: '#c47d2a',
  },
  {
    id: 'activity-4',
    actorName: 'Alex Chen',
    actorInitials: 'AC',
    action: 'posted a question about Stripe integration',
    timestamp: hoursAgo(26),
    type: 'update',
    avatarColor: '#5b6eae',
  },
];

function hoursAgo(hours) {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date.toISOString();
}

function getNextMeetingDate() {
  const now = new Date();
  const meeting = new Date(now);
  const day = now.getDay();
  const daysUntilThursday = (4 - day + 7) % 7 || 7;
  meeting.setDate(now.getDate() + (day <= 4 && day > 0 ? daysUntilThursday : daysUntilThursday));
  meeting.setHours(17, 0, 0, 0);
  if (meeting <= now) {
    meeting.setDate(meeting.getDate() + 7);
  }
  return meeting.toISOString();
}

function readStorage(key, fallback) {
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
    // Storage unavailable — ignore
  }
}

export function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getSprintStatus() {
  const now = new Date();
  const sprintStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const weekOfMonth = Math.ceil((now.getDate() + sprintStart.getDay()) / 7);
  const sprintWeek = Math.min(weekOfMonth, 4);

  const dayOfWeek = now.getDay();
  const daysLeft = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  if (daysLeft <= 1) {
    return {
      line: `${daysLeft === 0 ? 'Last day' : '1 day left'} this week`,
      sprintWeek,
    };
  }

  return {
    line: `You're on Week ${sprintWeek} of your sprint`,
    sprintWeek,
    daysLeft,
  };
}

export function getStreak() {
  const stored = readStorage(STORAGE_KEYS.streak, { count: 5, lastActive: new Date().toISOString() });
  return stored.count ?? 5;
}

export function getDailyTasks() {
  const stored = readStorage(STORAGE_KEYS.dailyTasks, null);
  if (stored && Array.isArray(stored)) return stored;
  writeStorage(STORAGE_KEYS.dailyTasks, DEFAULT_DAILY_TASKS);
  return DEFAULT_DAILY_TASKS;
}

export function saveDailyTasks(tasks) {
  writeStorage(STORAGE_KEYS.dailyTasks, tasks);
}

export function getWeeklyGoals() {
  const stored = readStorage(STORAGE_KEYS.weeklyGoals, null);
  if (stored && Array.isArray(stored)) return stored;
  writeStorage(STORAGE_KEYS.weeklyGoals, DEFAULT_WEEKLY_GOALS);
  return DEFAULT_WEEKLY_GOALS;
}

export function saveWeeklyGoals(goals) {
  writeStorage(STORAGE_KEYS.weeklyGoals, goals);
}

export function getUpcomingMeeting() {
  return DEFAULT_MEETING;
}

export function getPodMembers() {
  return DEFAULT_POD_MEMBERS;
}

export function getRecentActivity() {
  return DEFAULT_ACTIVITY;
}

export function formatMeetingDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function formatMeetingTime(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatRelativeTime(isoDate) {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  return `${diffDays}d ago`;
}
