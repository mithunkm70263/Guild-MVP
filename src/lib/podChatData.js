import { getPodMembers } from './homeData.js';

export const PINNED_MESSAGE = 'Weekly Goal: Ship the MVP by Friday';

export const CURRENT_USER = {
  id: 'current-user',
  name: 'You',
  initials: 'YO',
  avatarColor: '#3d6b5f',
};

const STORAGE_KEY = 'guild-pod-chat-messages';

function hoursAgo(hours, minutes = 0) {
  const date = new Date();
  date.setHours(date.getHours() - hours, date.getMinutes() - minutes);
  return date.toISOString();
}

const DEFAULT_MESSAGES = [
  {
    id: 'msg-1',
    authorId: 'member-1',
    text: 'Morning pod! Pushed the auth flow to staging last night — login + magic link both working.',
    timestamp: hoursAgo(3, 12),
    reactions: [{ emoji: '🔥', count: 2 }],
  },
  {
    id: 'msg-2',
    authorId: 'member-2',
    text: 'Nice ship Rahul! I\'m heads-down on onboarding screens today. Will share Figma link in an hour.',
    timestamp: hoursAgo(2, 45),
    reactions: [{ emoji: '👍', count: 1 }],
  },
  {
    id: 'msg-3',
    authorId: 'current-user',
    text: 'Love the momentum. I\'m wiring up the pod chat room UI — should have a demo by EOD.',
    timestamp: hoursAgo(2, 10),
    reactions: [],
  },
  {
    id: 'msg-4',
    authorId: 'member-3',
    text: 'Quick blocker: Stripe test keys expired. Anyone have a sandbox invite handy?',
    timestamp: hoursAgo(1, 55),
    reactions: [],
  },
  {
    id: 'msg-5',
    authorId: 'member-1',
    text: 'Sent you one in DM Alex — check your inbox.',
    timestamp: hoursAgo(1, 40),
    reactions: [{ emoji: '✅', count: 1 }],
  },
  {
    id: 'msg-6',
    authorId: 'member-2',
    text: 'Can someone review my onboarding copy before I ship? https://figma.com/file/pod-onboarding-v2',
    timestamp: hoursAgo(1, 15),
    reactions: [{ emoji: '👍', count: 2 }],
  },
  {
    id: 'msg-7',
    authorId: 'current-user',
    text: 'On it — giving feedback in 20 min. The CTA on step 2 could be punchier.',
    timestamp: hoursAgo(0, 52),
    reactions: [],
  },
  {
    id: 'msg-8',
    authorId: 'member-3',
    text: 'Stripe is connected again. Payment flow PR is up for review.',
    timestamp: hoursAgo(0, 35),
    reactions: [{ emoji: '🔥', count: 1 }, { emoji: '✅', count: 1 }],
  },
  {
    id: 'msg-9',
    authorId: 'member-1',
    text: 'Weekly goal check: landing page is 90% there. Who\'s owning the hero animation?',
    timestamp: hoursAgo(0, 18),
    reactions: [],
  },
  {
    id: 'msg-10',
    authorId: 'member-2',
    text: 'I can take hero animation tonight if someone covers the FAQ section.',
    timestamp: hoursAgo(0, 8),
    reactions: [{ emoji: '👍', count: 1 }],
  },
  {
    id: 'msg-11',
    authorId: 'current-user',
    text: 'I\'ll handle FAQ — aiming to merge before standup tomorrow. Keep pushing! 💪',
    timestamp: hoursAgo(0, 3),
    reactions: [{ emoji: '🔥', count: 2 }],
  },
];

function readStoredMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function writeStoredMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  } catch {
    // Storage unavailable
  }
}

export function getChatMessages() {
  const stored = readStoredMessages();
  if (stored) return stored;
  return DEFAULT_MESSAGES;
}

export function saveChatMessages(messages) {
  writeStoredMessages(messages);
}

export function appendChatMessage(text) {
  const messages = getChatMessages();
  const newMessage = {
    id: `msg-${Date.now()}`,
    authorId: CURRENT_USER.id,
    text: text.trim(),
    timestamp: new Date().toISOString(),
    reactions: [],
  };
  const updated = [...messages, newMessage];
  saveChatMessages(updated);
  return newMessage;
}

export function getAuthorById(authorId) {
  if (authorId === CURRENT_USER.id) return CURRENT_USER;
  const members = getPodMembers();
  return members.find((member) => member.id === authorId) ?? {
    id: authorId,
    name: 'Pod member',
    initials: 'PM',
    avatarColor: '#8a8371',
  };
}

export function getPodMembersWithStatus() {
  const members = getPodMembers();
  const panelStatuses = {
    'member-1': 'Shipped auth flow yesterday',
    'member-2': 'Working on landing page',
    'member-3': 'Reviewing payment PR',
  };

  return members.map((member) => ({
    ...member,
    panelStatus: panelStatuses[member.id] ?? member.status,
    isOnline: true,
  }));
}

export function formatMessageTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
