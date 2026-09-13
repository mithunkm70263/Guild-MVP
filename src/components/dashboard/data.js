/** @typedef {'focus' | 'away' | 'checked-in'} MemberStatus */
/** @typedef {{ id: string, name: string, initials: string, color: string, status: MemberStatus, detail: string }} PodMember */
/** @typedef {{ id: string, author: string, initials: string, text: string, time: string, mine?: boolean }} ChatMessage */
export const NAV_ITEMS = [
  { id: 'command', label: 'Command', icon: 'command', hint: 'Today' },
  { id: 'kairos', label: 'Kairos', icon: 'kairos', hint: 'Live', signal: true },
  { id: 'chat', label: 'Pod chat', icon: 'chat', hint: '2 new', count: '2' },
  { id: 'pod', label: 'Pod room', icon: 'pod', hint: '3 people' },
  { id: 'missions', label: 'Missions', icon: 'missions', hint: '4 open' },
  { id: 'profile', label: 'Profile', icon: 'profile', hint: 'Week 3' },
];
/** @type {PodMember[]} */
export const POD_MEMBERS = [{ id: 'mithun', name: 'Mithun', initials: 'M', color: 'clay', status: 'focus', detail: 'Designing the core flow' }, { id: 'anika', name: 'Anika Rao', initials: 'A', color: 'olive', status: 'checked-in', detail: 'Shared research notes' }, { id: 'dev', name: 'Dev Mehta', initials: 'D', color: 'ink', status: 'away', detail: 'Back in 18 min' }];
export const USER = { name: 'Mithun Kumar', initials: 'M', track: 'Founder track', commitment: 'Build Guild’s core ritual', week: 3, totalWeeks: 8, sessions: 9, streak: 4, focusMinutes: 126 };
export const KAIROS_MESSAGES = [{ id: 'k1', text: 'You have a clean 48-minute window. Start with the check-in flow, then share it before lunch.', time: '9:12 AM' }, { id: 'k2', text: 'Anika is ready to look at the first pass. Small handoffs keep this moving.', time: '9:18 AM' }];
export const KAIROS_REPLIES = ['That is a good place to begin. I would make the first moment feel like an invitation, not an instruction.', 'Let’s make it smaller: what is the one decision this screen needs to help someone make?', 'Noted. I’ve held that as your next move. Share the rough version before you try to perfect it.'];
/** @type {ChatMessage[]} */
export const POD_MESSAGES = [{ id: 'p1', author: 'Anika', initials: 'A', text: 'I left three notes on the new check-in prompt. The first one is the important bit.', time: '9:18 AM' }, { id: 'p2', author: 'Dev', initials: 'D', text: 'I am stepping away for a coffee, then I can take a look at the mobile states.', time: '9:24 AM' }, { id: 'p3', author: 'Mithun', initials: 'M', text: 'Perfect. I’m keeping the next pass intentionally small.', time: '9:26 AM', mine: true }];
export const MISSION_BOARD = {
  today: [
    { id: 't1', title: 'Design the weekly check-in flow', duration: '48 min', note: 'Focused work', done: false },
    { id: 't2', title: 'Share a first pass with Anika', duration: '10 min', note: 'Small handoff', done: false },
  ],
  week: [
    { id: 'w1', title: 'Make the Pod Room feel alive', duration: '2 hr', note: 'Product pass', done: false },
    { id: 'w2', title: 'Write the week-three reflection', duration: '20 min', note: 'Close the loop', done: true },
  ],
  later: [
    { id: 'l1', title: 'Tighten the onboarding handoff', duration: '45 min', note: 'Keep warm', done: false },
    { id: 'l2', title: 'Review the pod welcome copy', duration: '15 min', note: 'Language pass', done: false },
  ],
};

export const WEEKLY_RHYTHM = [
  { day: 'Mon', state: 'done', label: 'Held' },
  { day: 'Tue', state: 'done', label: 'Held' },
  { day: 'Wed', state: 'today', label: 'Today' },
  { day: 'Thu', state: 'future', label: 'Open' },
  { day: 'Fri', state: 'future', label: 'Open' },
];
