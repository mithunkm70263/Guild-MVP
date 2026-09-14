import { getBuilderTrack, getInitials } from './dashboardProfile.js';
import { getPodMembers } from './homeData.js';

const APPLICATION_KEYS = {
  youtube: 'guild-yt-application',
  'ai-app': 'guild-ai-app-application',
  'ai-saas': 'guild-ai-saas-application',
  vibecoder: 'guild-vibecoder-application',
};

const TRACK_DISPLAY = {
  youtube: { id: 'youtube', label: 'YouTube Growth', shortLabel: 'Creator' },
  'ai-app': { id: 'ai-app', label: 'AI Agents', shortLabel: 'Builder' },
  'ai-saas': { id: 'ai-saas', label: 'No-Code Apps', shortLabel: 'Founder' },
  vibecoder: { id: 'vibecoder', label: 'Vibe Coding', shortLabel: 'Hacker' },
};

const TIMEZONE_LABELS = {
  IST: 'IST – India (UTC+5:30)',
  PST: 'PST – Pacific (UTC−8)',
  MST: 'MST – Mountain (UTC−7)',
  CST: 'CST – Central (UTC−6)',
  EST: 'EST – Eastern (UTC−5)',
  GMT: 'GMT – London (UTC+0)',
  CET: 'CET – Europe (UTC+1)',
  JST: 'JST – Japan (UTC+9)',
  KST: 'KST – Korea (UTC+9)',
  AEST: 'AEST – Australia (UTC+10)',
  Other: 'Other',
};

const SETTINGS_KEY = 'guild-profile-settings';
const AVATAR_KEY = 'guild-profile-avatar';
const PORTFOLIO_KEY = 'guild-profile-portfolio';

export const AVATAR_OPTIONS = [
  { id: 'char-top-left-boy', src: '/avatars/profile_character_top_left_boy.png', label: 'Builder boy' },
  { id: 'char-top-right-girl', src: '/avatars/profile_character_top_right_girl.png', label: 'Builder girl' },
  { id: 'char-center-sunglasses', src: '/avatars/profile_character_center_sunglasses_boy.png', label: 'Sunglasses' },
  { id: 'char-bottom-left-glasses', src: '/avatars/profile_character_bottom_left_glasses_girl.png', label: 'Glasses girl' },
  { id: 'char-bottom-right-cap', src: '/avatars/profile_character_bottom_right_cap_boy.png', label: 'Cap boy' },
  { id: 'char2-top-left-peace', src: '/avatars/profile_character2_top_left_peace_girl.png', label: 'Peace sign' },
  { id: 'char2-top-right-headphones', src: '/avatars/profile_character2_top_right_headphones_boy.png', label: 'Headphones' },
  { id: 'char2-center-thumbs', src: '/avatars/profile_character2_center_sunglasses_thumbs_up_boy.png', label: 'Thumbs up' },
  { id: 'char2-bottom-left-cap', src: '/avatars/profile_character2_bottom_left_cap_boy.png', label: 'Cap v2' },
  { id: 'char2-bottom-right-sign', src: '/avatars/profile_character2_bottom_right_glasses_girl_sign.png', label: 'Sign girl' },
  { id: 'char3-top-left-beanie', src: '/avatars/profile_character3_top_left_beanie_boy.png', label: 'Beanie' },
  { id: 'char3-top-right-glasses', src: '/avatars/profile_character3_top_right_glasses_sign_boy.png', label: 'Sign boy' },
  { id: 'char3-center-laptop', src: '/avatars/profile_character3_center_laptop_boy.png', label: 'Laptop' },
  { id: 'char3-left-mug', src: '/avatars/profile_character3_left_mug_girl.png', label: 'Coffee mug' },
  { id: 'char3-right-headphones', src: '/avatars/profile_character3_right_cap_headphones_girl.png', label: 'Headphones girl' },
];

const FEEDBACK_STYLES = ['Direct', 'Balanced', 'Encouraging'];

const DEFAULT_SETTINGS = {
  timezone: '',
  workingHours: '',
  feedbackStyle: 'Balanced',
  futurePodTypes: '',
  notifications: {
    podReminders: true,
    sessionAlerts: true,
    weeklyDigest: true,
    artifactNudges: false,
    emailDigest: true,
    pushUpdates: false,
  },
  connectedAccounts: {
    github: false,
    twitter: false,
  },
};

const DEFAULT_PORTFOLIO = [
  {
    id: 'proj-1',
    name: 'Guild Landing Page',
    description: 'Marketing site with waitlist and track selector',
    shippedDate: weeksAgo(3),
    links: { demo: 'https://guild.build', github: 'https://github.com/guild/landing' },
  },
  {
    id: 'proj-2',
    name: 'Auth Flow v0.1',
    description: 'Supabase auth with OAuth and profile sync',
    shippedDate: weeksAgo(2),
    links: { demo: 'https://app.guild.build', github: 'https://github.com/guild/auth' },
  },
  {
    id: 'proj-3',
    name: 'Pod Dashboard',
    description: 'Builder command room with sprint tracking',
    shippedDate: weeksAgo(1),
    links: { demo: 'https://app.guild.build/dashboard' },
  },
];

const DEFAULT_FEED_UPDATES = [
  {
    id: 'update-1',
    type: 'update',
    text: 'Week 3 ship log — auth flow merged, pod dashboard nav wired up. On track for Friday demo.',
    timestamp: daysAgo(3),
    linkPreview: null,
  },
  {
    id: 'update-2',
    type: 'update',
    text: 'Joined Sprint Pod Alpha for this cycle. Goal: ship OAuth + profile sync by end of week.',
    timestamp: daysAgo(10),
    linkPreview: null,
  },
  {
    id: 'update-3',
    type: 'update',
    text: 'Cycle kickoff — set weekly goals with the pod. 4 goals locked for the sprint.',
    timestamp: daysAgo(14),
    linkPreview: null,
  },
];

const CYCLE_TOTAL_WEEKS = 8;

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

function getTrackDisplay(track) {
  if (!track?.id) return TRACK_DISPLAY.vibecoder;
  return TRACK_DISPLAY[track.id] || {
    id: track.id,
    label: track.title || 'Builder',
    shortLabel: 'Builder',
  };
}

function loadApplicationForTrack(trackId) {
  const key = APPLICATION_KEYS[trackId];
  if (!key) return null;
  return readStorage(key);
}

function resolveBuildingFocus(trackId, application) {
  if (!application) return 'Define your cycle focus in your builder application';

  switch (trackId) {
    case 'youtube':
      return application.niche
        ? `${application.niche}${application.uploadCadence ? ` · ${application.uploadCadence}` : ''}`
        : 'Growing your YouTube channel this cycle';
    case 'ai-app':
      return application.appDescription || 'Shipping your AI app this cycle';
    case 'ai-saas':
      return application.productDescription || 'Building your AI SaaS product';
    case 'vibecoder':
      return application.currentProject || application.mainGoal || 'Shipping your current project';
    default:
      return 'Building in your Guild cycle';
  }
}

function getCycleProgress() {
  const cycleStart = readStorage('guild-cycle-start', null);
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

function getDefaultCycleStart() {
  const start = new Date();
  start.setDate(start.getDate() - 14);
  return start;
}

function getAttendanceData() {
  const stored = readStorage('guild-profile-attendance', null);
  if (stored) return stored;

  return {
    attended: 6,
    scheduled: 7,
    streak: 4,
    lastAttended: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

function weeksAgo(weeks) {
  const date = new Date();
  date.setDate(date.getDate() - weeks * 7);
  return date.toISOString();
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function extractDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function pickPrimaryLink(links) {
  if (!links) return null;
  const url = links.demo || links.github || Object.values(links)[0];
  if (!url) return null;
  return {
    url,
    title: links.demo ? 'Live demo' : 'View on GitHub',
    domain: extractDomain(url),
  };
}

function buildFeedItemFromProject(project) {
  const linkPreview = pickPrimaryLink(project.links);
  return {
    id: `feed-${project.id}`,
    type: 'project',
    text: `Shipped ${project.name} — ${project.description}`,
    timestamp: project.shippedDate,
    linkPreview: linkPreview
      ? { ...linkPreview, title: project.name }
      : null,
  };
}

function buildActivityFeed(portfolio) {
  const projectItems = portfolio.map(buildFeedItemFromProject);
  const updates = DEFAULT_FEED_UPDATES;
  return [...projectItems, ...updates].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export function formatRelativeTime(isoDate) {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (60 * 1000));
  const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const diffWeeks = Math.floor(diffDays / 7);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatJoinedDate(isoOrLabel) {
  if (!isoOrLabel) return 'Jan 2025';
  if (!isoOrLabel.includes('T') && !isoOrLabel.includes('-')) return isoOrLabel;
  const date = new Date(isoOrLabel);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function getBuilderStats(attendance, cycle) {
  const stored = readStorage('guild-profile-builder-stats', null);
  if (stored) return stored;

  return {
    currentStreak: attendance.streak,
    totalWeeksCompleted: cycle.currentWeek - 1,
    projectsShipped: 3,
    publicUpdatesPosted: 12,
    podsJoined: 2,
  };
}

function getPortfolio() {
  const stored = readStorage(PORTFOLIO_KEY, null);
  if (stored && Array.isArray(stored)) return stored;
  writeStorage(PORTFOLIO_KEY, DEFAULT_PORTFOLIO);
  return DEFAULT_PORTFOLIO;
}

function resolveUsername(user, application) {
  const meta = user?.user_metadata || {};
  if (meta.username) return `@${meta.username.replace(/^@/, '')}`;
  if (meta.user_name) return `@${meta.user_name.replace(/^@/, '')}`;
  if (user?.email) return `@${user.email.split('@')[0]}`;
  if (application?.fullName) {
    const handle = application.fullName.toLowerCase().replace(/\s+/g, '');
    return `@${handle}`;
  }
  return '@mithunkm';
}

function resolveBio(profile, application, track) {
  if (profile.bio) return profile.bio;
  if (application?.mainGoal) return application.mainGoal;
  return `Creator on the ${track.label} track — shipping weekly with my pod.`;
}

function resolveLocation(profile, application) {
  if (profile.location) return profile.location;
  if (application?.city) return application.city;
  if (application?.timezone === 'IST') return 'Bangalore, India';
  if (application?.timezone) return TIMEZONE_LABELS[application.timezone] || application.timezone;
  return 'Bangalore, India';
}

export function getSelectedAvatarId() {
  const stored = localStorage.getItem(AVATAR_KEY);
  if (stored && AVATAR_OPTIONS.some((a) => a.id === stored)) return stored;
  return AVATAR_OPTIONS[0].id;
}

export function getSelectedAvatar() {
  const id = getSelectedAvatarId();
  return AVATAR_OPTIONS.find((a) => a.id === id) || AVATAR_OPTIONS[0];
}

export function saveSelectedAvatar(avatarId) {
  if (!AVATAR_OPTIONS.some((a) => a.id === avatarId)) return getSelectedAvatar();
  localStorage.setItem(AVATAR_KEY, avatarId);
  return getSelectedAvatar();
}

export function getProfileSettings() {
  const stored = readStorage(SETTINGS_KEY, null);
  if (!stored) {
    writeStorage(SETTINGS_KEY, DEFAULT_SETTINGS);
    return { ...DEFAULT_SETTINGS };
  }
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...(stored.notifications || {}),
    },
    connectedAccounts: {
      ...DEFAULT_SETTINGS.connectedAccounts,
      ...(stored.connectedAccounts || {}),
    },
  };
}

export function saveProfileSettings(updates) {
  const current = getProfileSettings();
  const next = {
    ...current,
    ...updates,
    notifications: {
      ...current.notifications,
      ...(updates.notifications || {}),
    },
    connectedAccounts: {
      ...current.connectedAccounts,
      ...(updates.connectedAccounts || {}),
    },
  };
  writeStorage(SETTINGS_KEY, next);
  return next;
}

export function formatTimezone(value) {
  if (!value) return 'Not set';
  return TIMEZONE_LABELS[value] || value;
}

export function formatShipDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export { FEEDBACK_STYLES };

export function buildExtendedProfile(user, baseProfile) {
  const baseTrack = getBuilderTrack();
  const trackId = baseTrack?.id || 'youtube';
  const track = getTrackDisplay(baseTrack);
  const application = loadApplicationForTrack(trackId);
  const settings = getProfileSettings();
  const cycle = getCycleProgress();
  const attendance = getAttendanceData();
  const builderStats = getBuilderStats(attendance, cycle);
  const portfolio = getPortfolio();
  const feed = buildActivityFeed(portfolio);
  const avatar = getSelectedAvatar();

  const timezone = settings.timezone || application?.timezone || '';
  const buildingFocus = resolveBuildingFocus(trackId, application);

  if (!settings.timezone && application?.timezone) {
    saveProfileSettings({ timezone: application.timezone });
  }

  if (!settings.workingHours && application?.liveSessionWindows) {
    saveProfileSettings({ workingHours: application.liveSessionWindows });
  }

  const userName = baseProfile?.name
    || user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || application?.fullName
    || 'Guild Member';

  const podMembers = getPodMembers();
  const weeklyProgress = {
    completed: 2,
    total: 4,
    summary: '2 of 4 weekly goals complete — on track for Friday ship',
    percent: 50,
  };

  return {
    track,
    trackId,
    application,
    avatar,
    avatarOptions: AVATAR_OPTIONS,
    identity: {
      name: userName,
      username: resolveUsername(user, application),
      bio: resolveBio(baseProfile || {}, application, track),
      location: resolveLocation(baseProfile || {}, application),
      timezone,
      timezoneLabel: formatTimezone(timezone),
      memberSince: formatJoinedDate(baseProfile?.memberSince || user?.created_at || ''),
      joinedLabel: formatJoinedDate(baseProfile?.memberSince || user?.created_at || ''),
      initials: getInitials(userName),
      email: baseProfile?.email || user?.email || '',
    },
    builderStats,
    statLine: `${builderStats.currentStreak} day streak · ${builderStats.projectsShipped} projects shipped · ${builderStats.podsJoined} pods joined`,
    feed,
    currentStatus: {
      podName: 'Sprint Pod Alpha',
      podUrl: '/dashboard/pod',
      podMembers,
      sprintGoal: buildingFocus,
      weeklyProgress,
      cycle,
    },
    portfolio,
    pinnedStatus: {
      podName: 'Sprint Pod Alpha',
      cycleLabel: `Week ${cycle.currentWeek} of ${cycle.totalWeeks}`,
      goalsLabel: `${weeklyProgress.completed}/${weeklyProgress.total} goals complete`,
      progressPercent: weeklyProgress.percent,
    },
    preferences: {
      workingHours: settings.workingHours || application?.liveSessionWindows || '',
      feedbackStyle: settings.feedbackStyle,
      feedbackStyles: FEEDBACK_STYLES,
      notifications: settings.notifications,
      futurePodTypes: settings.futurePodTypes,
    },
    account: {
      email: baseProfile?.email || user?.email || '',
      hasPassword: Boolean(user?.email),
      connectedAccounts: settings.connectedAccounts,
      currentPod: 'Sprint Pod Alpha',
    },
    settings,
    liveSessionWindows: application?.liveSessionWindows || '',
  };
}
