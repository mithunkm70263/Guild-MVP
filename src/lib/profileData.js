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

const DEFAULT_SETTINGS = {
  timezone: '',
  availability: '',
  notifications: {
    podReminders: true,
    sessionAlerts: true,
    weeklyDigest: true,
    artifactNudges: false,
  },
  trackChangeRequested: false,
};

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

function resolveSubGoal(trackId, application) {
  if (!application) return '';

  switch (trackId) {
    case 'youtube':
      return application.timeline || application.uploadCadence || '';
    case 'ai-app':
      return application.threeMonthReady || application.appStatus || '';
    case 'ai-saas':
      return Array.isArray(application.goals) ? application.goals.join(' · ') : application.stage || '';
    case 'vibecoder':
      return application.mainGoal || application.codingStyle || '';
    default:
      return '';
  }
}

function resolveQuitConcern(application, weeklyHours) {
  if (application?.motivationAndSacrifice) {
    const raw = application.motivationAndSacrifice.trim();
    const sentence = raw.split(/[.!?]/).find((s) => s.trim().length > 12);
    if (sentence) return sentence.trim();
    if (raw.length <= 140) return raw;
    return `${raw.slice(0, 137)}…`;
  }

  if (weeklyHours) {
    return `You committed to ${weeklyHours} — missing a week would break your momentum`;
  }

  return 'Staying consistent week over week is your biggest risk';
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

function getShipTimeline() {
  const stored = readStorage('guild-profile-timeline', null);
  if (stored) return stored;

  return [
    {
      week: 1,
      label: 'Week 1',
      artifact: 'Landing page v0.1 live',
      type: 'shipped',
      date: weeksAgo(3),
    },
    {
      week: 2,
      label: 'Week 2',
      artifact: 'Auth flow demo posted',
      type: 'shipped',
      date: weeksAgo(2),
    },
    {
      week: 3,
      label: 'Week 3',
      artifact: 'Onboarding screens in Figma',
      type: 'in-progress',
      date: weeksAgo(1),
    },
    {
      week: 4,
      label: 'Week 4',
      artifact: '—',
      type: 'upcoming',
      date: null,
    },
  ];
}

function weeksAgo(weeks) {
  const date = new Date();
  date.setDate(date.getDate() - weeks * 7);
  return date.toISOString();
}

function getTrioContext(userName) {
  const stored = readStorage('guild-profile-trio', null);
  const podMembers = getPodMembers();
  const selfInitials = getInitials(userName || 'You');

  const members = stored?.members || [
    {
      id: 'self',
      name: userName || 'You',
      initials: selfInitials,
      isSelf: true,
      avatarColor: '#3d6b5f',
    },
    ...podMembers.map((m) => ({
      id: m.id,
      name: m.name,
      initials: m.initials,
      isSelf: false,
      avatarColor: m.avatarColor,
    })),
  ];

  return {
    members,
    togetherSince: stored?.togetherSince || weeksAgo(3),
    podRoomUrl: '/dashboard/pod',
  };
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
  };
  writeStorage(SETTINGS_KEY, next);
  return next;
}

export function formatTimezone(value) {
  if (!value) return 'Not set';
  return TIMEZONE_LABELS[value] || value;
}

export function formatTogetherDuration(isoDate) {
  const start = new Date(isoDate);
  const diffWeeks = Math.max(1, Math.floor((Date.now() - start.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  if (diffWeeks === 1) return '1 week together';
  if (diffWeeks < 4) return `${diffWeeks} weeks together`;
  const months = Math.floor(diffWeeks / 4);
  return months === 1 ? '1 month together' : `${months} months together`;
}

export function buildExtendedProfile(user) {
  const baseTrack = getBuilderTrack();
  const trackId = baseTrack?.id || 'vibecoder';
  const track = getTrackDisplay(baseTrack);
  const application = loadApplicationForTrack(trackId);
  const settings = getProfileSettings();
  const cycle = getCycleProgress();
  const attendance = getAttendanceData();
  const timeline = getShipTimeline();

  const timezone = settings.timezone || application?.timezone || '';
  const weeklyHours = application?.weeklyHours || '';
  const buildingFocus = resolveBuildingFocus(trackId, application);
  const subGoal = resolveSubGoal(trackId, application);
  const quitConcern = resolveQuitConcern(application, weeklyHours);

  if (!settings.timezone && application?.timezone) {
    saveProfileSettings({ timezone: application.timezone });
  }

  const userName = user?.user_metadata?.full_name
    || user?.user_metadata?.name
    || application?.fullName
    || 'Guild Member';

  const trio = getTrioContext(userName);

  return {
    track,
    trackId,
    application,
    timezone,
    timezoneLabel: formatTimezone(timezone),
    weeklyHours,
    buildingFocus,
    subGoal,
    quitConcern,
    cycle,
    attendance: {
      ...attendance,
      ratioLabel: `${attendance.attended}/${attendance.scheduled} sessions attended`,
      ratioPercent: Math.round((attendance.attended / attendance.scheduled) * 100),
    },
    timeline,
    trio,
    settings,
    liveSessionWindows: application?.liveSessionWindows || '',
  };
}
