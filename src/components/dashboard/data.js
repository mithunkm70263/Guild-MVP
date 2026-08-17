export const NAV_ITEMS = [
  { id: 'command', label: 'Command', icon: 'command' },
  { id: 'chat', label: 'Chat', icon: 'chat' },
  { id: 'pod', label: 'Pod Room', icon: 'pod' },
  { id: 'missions', label: 'Missions', icon: 'missions' },
  { id: 'signals', label: 'Signals', icon: 'signals' },
  { id: 'profile', label: 'Profile', icon: 'profile' },
];

export const USER = {
  name: 'Mithun',
  track: 'Founder track',
  rank: 'Kairos Builder',
  level: 8,
  progress: 86,
  status: 'Live with pod',
  skills: ['AI', 'Frontend', 'Shipping', 'Product'],
  stats: { sprints: 12, tasks: 38, allies: 4, streak: 3 },
  bio: 'Building Guild in public. Obsessed with pods, momentum, and shipping what matters.',
  joined: 'Aug 2025',
  location: 'Bangalore, IN',
};

export const POD_MEMBERS = [
  { name: 'Anika', skill: 'Product', status: 'Reviewing', online: true },
  { name: 'Dev', skill: 'Frontend', status: 'Coding', online: true },
  { name: 'Mira', skill: 'AI', status: 'In focus', online: true },
  { name: 'Rohan', skill: 'Systems', status: 'Away 12m', online: false },
];

export const STARTER_MESSAGES = [
  {
    id: 'k1',
    role: 'kairos',
    text: 'Welcome back, Mithun. Your pod is active, your next sprint is staged, and I found two clean openings for momentum today.',
    time: '6:02 PM',
  },
  {
    id: 'u1',
    role: 'user',
    text: 'Show me the highest leverage move first.',
    time: '6:03 PM',
  },
  {
    id: 'k2',
    role: 'kairos',
    text: 'Ship the auth polish task before standup. It unlocks review from Anika and keeps the Friday demo clear.',
    time: '6:03 PM',
  },
];

export const KAIROS_REPLIES = [
  'Locked. I will fold that into your next focus block and keep the pod context sharp.',
  'Good signal. I have updated your mission board — auth polish is now priority one.',
  'Your pod is synced. Anika is reviewing notes and Dev is in a focus block until 7 PM.',
  'Momentum check: you are at 86% signal this week. One more ship keeps the streak alive.',
  'I will surface that in tonight\'s pod sync. Rohan should be back online in ~10 minutes.',
  'Clear move. Block 42 minutes for deep work — low distraction window until 6:30 PM.',
];

export const POD_CHAT_MESSAGES = [
  {
    id: 'p1',
    role: 'member',
    author: 'Anika',
    text: 'Auth flow notes are in the shared doc — 3 actionable items for the polish pass.',
    time: '5:48 PM',
    online: true,
  },
  {
    id: 'p2',
    role: 'member',
    author: 'Dev',
    text: 'Just pushed the sidebar refactor. Ready for review when you are.',
    time: '5:52 PM',
    online: true,
  },
  {
    id: 'p3',
    role: 'user',
    author: 'Mithun',
    text: 'Perfect timing. I will tackle auth polish in the next focus block.',
    time: '5:55 PM',
  },
  {
    id: 'p4',
    role: 'member',
    author: 'Mira',
    text: 'Focus block starting now. Ping me after standup if you need AI pipeline help.',
    time: '6:01 PM',
    online: true,
  },
  {
    id: 'p5',
    role: 'member',
    author: 'Rohan',
    text: 'Back online. Caught up on the thread — systems review done on my end.',
    time: '6:08 PM',
    online: false,
  },
];

export const PRIVATE_CHATS = [
  {
    id: 'anika',
    member: { name: 'Anika', skill: 'Product', online: true, unread: 1 },
    messages: [
      {
        id: 'a1',
        role: 'member',
        author: 'Anika',
        text: 'Hey — left detailed notes on the auth flow. The redirect loop fix is the critical one.',
        time: '4:30 PM',
        online: true,
      },
      {
        id: 'a2',
        role: 'user',
        author: 'Mithun',
        text: 'Got it, will prioritize that first. Thanks for the fast turnaround.',
        time: '4:45 PM',
      },
      {
        id: 'a3',
        role: 'member',
        author: 'Anika',
        text: 'Also — Friday demo looks solid if we ship auth by Thursday.',
        time: '5:10 PM',
        online: true,
      },
    ],
  },
  {
    id: 'dev',
    member: { name: 'Dev', skill: 'Frontend', online: true, unread: 0 },
    messages: [
      {
        id: 'd1',
        role: 'member',
        author: 'Dev',
        text: 'Sidebar animation feels smooth now. Want me to wire the chat panel next?',
        time: '3:20 PM',
        online: true,
      },
      {
        id: 'd2',
        role: 'user',
        author: 'Mithun',
        text: 'Yes please — group chat + DMs in the Pod Room view.',
        time: '3:35 PM',
      },
    ],
  },
  {
    id: 'mira',
    member: { name: 'Mira', skill: 'AI', online: true, unread: 0 },
    messages: [
      {
        id: 'm1',
        role: 'member',
        author: 'Mira',
        text: 'Kairos context window is ready for integration when backend lands.',
        time: 'Yesterday',
        online: true,
      },
    ],
  },
  {
    id: 'rohan',
    member: { name: 'Rohan', skill: 'Systems', online: false, unread: 0 },
    messages: [
      {
        id: 'r1',
        role: 'member',
        author: 'Rohan',
        text: 'Infra is stable. Let me know when you need the staging deploy.',
        time: 'Yesterday',
        online: false,
      },
    ],
  },
];

export const POD_CHAT_REPLIES = {
  Anika: ['Noted — I will update the doc.', 'Good call. Let\'s sync on that at standup.', 'On it. Will share by EOD.'],
  Dev: ['Pushed a fix, check the branch.', 'LGTM — merging now.', 'Can pair on that after sync.'],
  Mira: ['Focus mode on — back in 45.', 'AI pipeline is green.', 'Will run benchmarks tonight.'],
  Rohan: ['Staging is ready when you are.', 'Systems look clean.', 'Back in 10 — saw the thread.'],
};

export const MISSIONS = [
  { id: 1, tone: 'cyan', label: 'Today', value: 'Ship auth polish', detail: '42 min focus block', progress: 72 },
  { id: 2, tone: 'gold', label: 'Pod pulse', value: '4/5 checked in', detail: 'Aarav is reviewing your notes', progress: 80 },
  { id: 3, tone: 'green', label: 'Momentum', value: '86% signal', detail: 'Three-day streak protected', progress: 86 },
];

export const MISSION_BOARD = {
  today: [
    { id: 't1', title: 'Auth polish pass', time: '42m', priority: 'high', done: false },
    { id: 't2', title: 'Review Anika notes', time: '20m', priority: 'med', done: false },
    { id: 't3', title: 'Standup prep', time: '10m', priority: 'low', done: true },
  ],
  week: [
    { id: 'w1', title: 'Dashboard redesign', time: '3h', priority: 'high', done: false },
    { id: 'w2', title: 'Pod matching flow', time: '2h', priority: 'med', done: false },
    { id: 'w3', title: 'Landing page copy', time: '1h', priority: 'low', done: true },
  ],
  backlog: [
    { id: 'b1', title: 'Onboarding emails', time: '4h', priority: 'med', done: false },
    { id: 'b2', title: 'Analytics hooks', time: '2h', priority: 'low', done: false },
  ],
};

export const SIGNALS = [
  { id: 1, type: 'momentum', title: 'Streak protected', body: 'Three days of focused shipping. Keep the rhythm.', time: '2m ago', accent: 'green' },
  { id: 2, type: 'pod', title: 'Anika left feedback', body: 'Auth flow notes are in — 3 actionable items.', time: '18m ago', accent: 'cyan' },
  { id: 3, type: 'kairos', title: 'Focus window open', body: 'Low distraction window until 6:30 PM. Ideal for deep work.', time: '1h ago', accent: 'gold' },
  { id: 4, type: 'system', title: 'Pod sync reminder', body: 'Daily ritual at 7:30 PM — 5 min check-in.', time: '3h ago', accent: 'purple' },
  { id: 5, type: 'win', title: 'Shipped yesterday', body: 'Login flow v2 merged. +120 XP toward next rank.', time: 'Yesterday', accent: 'green' },
];

export const ACHIEVEMENTS = [
  { id: 'a1', label: 'First Sprint', icon: '⚡', unlocked: true },
  { id: 'a2', label: 'Pod Pioneer', icon: '🛡', unlocked: true },
  { id: 'a3', label: 'Ship Captain', icon: '🚀', unlocked: true },
  { id: 'a4', label: 'Streak Keeper', icon: '🔥', unlocked: true },
  { id: 'a5', label: 'Guild Legend', icon: '👑', unlocked: false },
  { id: 'a6', label: 'Mentor Mode', icon: '✦', unlocked: false },
];

export const ACTIVITY = [
  { id: 'act1', action: 'Completed standup prep', time: 'Today, 4:12 PM' },
  { id: 'act2', action: 'Joined pod sync ritual', time: 'Yesterday, 7:30 PM' },
  { id: 'act3', action: 'Shipped login flow v2', time: 'Yesterday, 2:04 PM' },
  { id: 'act4', action: 'Reached Kairos Builder rank', time: 'Aug 10, 2025' },
];

export const PANEL_EASE = [0.16, 1, 0.3, 1];

export const VIEW_TRANSITION = {
  initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(6px)' },
  transition: { duration: 0.55, ease: PANEL_EASE },
};
