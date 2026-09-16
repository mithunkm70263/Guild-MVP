import { getUpcomingMeeting } from './homeData.js';

export const KAIROS_TASKS_KEY = 'guild-kairos-tasks';
export const KAIROS_CHAT_KEY = 'guild-kairos-chat';
export const KAIROS_STATS_KEY = 'guild-kairos-stats';

/**
 * @typedef {Object} KairosTask
 * @property {string} id
 * @property {string} title
 * @property {number} focusMinutes
 * @property {boolean} completed
 * @property {string|null} completedAt
 * @property {string} tag
 * @property {boolean} [isNew]
 */

/**
 * @typedef {Object} LearningResource
 * @property {string} id
 * @property {string} title
 * @property {string} type
 * @property {string} duration
 * @property {string} source
 * @property {string} summary
 * @property {string} url
 */

/**
 * @typedef {Object} ChatMessage
 * @property {string} id
 * @property {'kairos'|'user'} sender
 * @property {string} text
 * @property {string} timestamp
 * @property {'default'|'task-assigned'|'resource'|'encouragement'} [cardType]
 * @property {any} [cardData]
 */

export const INITIAL_TASKS = [
  {
    id: 'kairos-task-1',
    title: 'Finalize OAuth session token handshake',
    focusMinutes: 45,
    completed: false,
    completedAt: null,
    tag: 'Core Feature',
    isNew: false,
  },
  {
    id: 'kairos-task-2',
    title: 'Draft pod demo walkthrough for Sunday sync',
    focusMinutes: 30,
    completed: true,
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    tag: 'Pod Ritual',
    isNew: false,
  },
  {
    id: 'kairos-task-3',
    title: 'Run lighthouse audit & trim unused JS chunks',
    focusMinutes: 25,
    completed: false,
    completedAt: null,
    tag: 'Performance',
    isNew: false,
  },
];

export const RECOMMENDED_LEARNING = [
  {
    id: 'learn-1',
    title: 'Designing High-Conversion Onboarding for AI Tools',
    type: 'Guide',
    duration: '4 min read',
    source: 'Guild Playbooks',
    summary: 'How 3 Guild builders turned 12% drop-off into 68% first-session activation.',
    url: '#',
  },
  {
    id: 'learn-2',
    title: 'Row-Level Security (RLS) Best Practices in Supabase',
    type: 'Cheatsheet',
    duration: '6 min read',
    source: 'Tech Deep-Dive',
    summary: 'Bulletproof your multi-tenant tables without crippling query velocity.',
    url: '#',
  },
  {
    id: 'learn-3',
    title: 'The Sunday Ship Ritual: Shipping Before You Feel Ready',
    type: 'Audio',
    duration: '8 min listen',
    source: 'Pod Dispatch',
    summary: 'Why perfectionism kills feedback loops and how tight pods stay accountable.',
    url: '#',
  },
];

export const QUICK_PROMPTS = [
  { label: "Assign me today's tasks", query: "Assign me today's tasks" },
  { label: "I'm stuck on auth", query: "I'm stuck on auth" },
  { label: 'Review my week', query: 'Review my week' },
  { label: 'Motivate me', query: 'Motivate me' },
];

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
    // Local storage unavailable
  }
}

export function getGreeting() {
  const hour = new Date().getHours();
  let timeOfDay = 'Morning';
  if (hour >= 12 && hour < 17) timeOfDay = 'Afternoon';
  if (hour >= 17) timeOfDay = 'Evening';

  return `Good ${timeOfDay}, Builder. You have 3 days until the Sunday ship. Let's make today count. What's your #1 blocker or goal before tonight's pod sync?`;
}

export function getInitialMessages() {
  const stored = readStorage(KAIROS_CHAT_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) {
    return stored;
  }

  const initial = [
    {
      id: 'msg-greeting',
      sender: 'kairos',
      text: getGreeting(),
      timestamp: 'Just now',
    },
  ];
  writeStorage(KAIROS_CHAT_KEY, initial);
  return initial;
}

export function getKairosTasks() {
  const stored = readStorage(KAIROS_TASKS_KEY, null);
  if (stored && Array.isArray(stored)) {
    return stored;
  }
  writeStorage(KAIROS_TASKS_KEY, INITIAL_TASKS);
  return INITIAL_TASKS;
}

export function saveKairosTasks(tasks) {
  writeStorage(KAIROS_TASKS_KEY, tasks);
}

export function toggleKairosTask(taskId) {
  const current = getKairosTasks();
  const next = current.map((task) => {
    if (task.id !== taskId) return task;
    const completed = !task.completed;
    return {
      ...task,
      completed,
      completedAt: completed ? new Date().toISOString() : null,
    };
  });
  saveKairosTasks(next);
  return next;
}

export function addKairosTask({ title, focusMinutes = 45, tag = 'Assigned' }) {
  const current = getKairosTasks();
  const newTask = {
    id: `kairos-task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title,
    focusMinutes,
    completed: false,
    completedAt: null,
    tag,
    isNew: true,
  };
  const next = [newTask, ...current];
  saveKairosTasks(next);
  return { nextTasks: next, createdTask: newTask };
}

export function resetKairosDemo() {
  writeStorage(KAIROS_TASKS_KEY, INITIAL_TASKS);
  const initialChat = [
    {
      id: 'msg-greeting',
      sender: 'kairos',
      text: getGreeting(),
      timestamp: 'Just now',
    },
  ];
  writeStorage(KAIROS_CHAT_KEY, initialChat);
  return {
    tasks: INITIAL_TASKS,
    messages: initialChat,
  };
}

export function getSprintContext() {
  const meeting = getUpcomingMeeting();
  const meetingTime = meeting?.date
    ? new Date(meeting.date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
    : '7:30 PM';

  return {
    weekLabel: 'Week 3 of 8',
    sprintGoal: 'Ship OAuth callback + Profile data sync',
    progressPercent: 42,
    podSyncNote: `Pod sync at ${meetingTime}`,
    daysUntilShip: 3,
  };
}

/**
 * Generate simulated intelligent coaching response
 * Returns { text, cardType?, cardData?, assignTask? }
 */
export function generateCoachResponse(userMessage, currentTasks = []) {
  const lower = userMessage.toLowerCase().trim();

  // Task assignment request
  if (lower.includes('assign') || lower.includes('tasks') || lower.includes('todo') || lower.includes('plan today')) {
    const suggestedTask = {
      title: 'Smoke-test OAuth redirect with clean browser profile',
      focusMinutes: 30,
      tag: 'Coach Assign',
    };
    return {
      text: `Here is your high-impact mission for today: **${suggestedTask.title}** (30 min focus session).\n\nI just slid this into your **Today's Focus** panel on the left. Knock this out before pod sync!`,
      cardType: 'task-assigned',
      cardData: suggestedTask,
      assignTask: suggestedTask,
    };
  }

  // Stuck / blocker request
  if (lower.includes('stuck') || lower.includes('block') || lower.includes('bug') || lower.includes('error') || lower.includes('auth')) {
    return {
      text: `When you're stuck, the worst trap is staring at the screen for 2 hours in isolation.\n\nHere is my 3-step unblocking protocol:\n1. **Reproduce in 1 curl or test**: Strip away the UI and isolate whether the token exchange endpoint responds with 200 or 401.\n2. **Check your Redirect URI**: 90% of auth bugs are protocol mismatch (\`http\` vs \`https\`) or a trailing slash in Google/GitHub OAuth settings.\n3. **Ping your pod**: Drop a 2-sentence snippet in your Pod Room. Someone has solved this exact bug.`,
      cardType: 'encouragement',
    };
  }

  // Review request
  if (lower.includes('review') || lower.includes('week') || lower.includes('progress') || lower.includes('status')) {
    const completedCount = currentTasks.filter((t) => t.completed).length;
    return {
      text: `### Sprint Velocity Check\n- **Week Status**: Week 3 of 8 (42% of sprint complete)\n- **Daily Missions**: ${completedCount} of ${currentTasks.length} tasks checked off today\n- **Streak**: 5 consecutive building days 🔥\n\nYou're in solid shape. If you wrap the OAuth callback handler today, you'll be well ahead of the Sunday ship deadline. Keep the rhythm!`,
    };
  }

  // Motivation request
  if (lower.includes('motivate') || lower.includes('tired') || lower.includes('hard') || lower.includes('imposter')) {
    return {
      text: `Remember: *Every seasoned founder was once terrified of their own git commit log.*\n\nYou don't need a groundbreaking masterpiece today. You only need one working commit that moves the needle forward by 1%. Put on your headphones, set a **25-minute Focus timer**, and write the next function. I'm right here with you.`,
      cardType: 'encouragement',
    };
  }

  // Default smart coaching reply
  return {
    text: `Got it. Let's break this down into an actionable step. What is the single smallest piece of this you can ship in a **25-minute focus session**?\n\nIf you want, type **"Assign me today's tasks"** or ask me to draft a step-by-step breakdown.`,
  };
}
