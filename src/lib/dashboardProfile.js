const BUILDER_TRACKS = {
  youtube: { title: 'YouTube', label: 'Content & Media', subtitle: 'Creator / Filmmaker' },
  'ai-app': { title: 'AI app', label: 'Intelligence & Tooling', subtitle: 'Full-Stack AI Engineer' },
  'ai-saas': { title: 'AI SaaS', label: 'Revenue & Products', subtitle: 'Micro-SaaS Founder' },
  vibecoder: { title: 'vibecoder', label: 'Speed & Intuition', subtitle: 'Vibe Coder / Hacker' },
};

export function getDisplayName(user) {
  if (!user) return 'Guild Member';

  const meta = user.user_metadata || {};
  const name =
    meta.full_name ||
    meta.name ||
    meta.display_name ||
    user.email?.split('@')[0];

  if (!name) return 'Guild Member';
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function getInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function getBuilderTrack() {
  const stored = localStorage.getItem('guild-builder-craft');
  if (!stored) return null;

  const byId = BUILDER_TRACKS[stored];
  if (byId) return { id: stored, ...byId };

  const byTitle = Object.entries(BUILDER_TRACKS).find(
    ([, track]) => track.title === stored || track.title.toLowerCase() === stored.toLowerCase(),
  );
  if (byTitle) return { id: byTitle[0], ...byTitle[1] };

  return { id: stored, title: stored, label: 'Builder Track', subtitle: 'Guild Builder' };
}

export function buildProfileFromUser(user) {
  if (!user) {
    return {
      name: 'Guild Member',
      email: '',
      role: 'Builder',
      bio: '',
      location: '',
      website: '',
      avatarUrl: '',
      memberSince: '',
      track: getBuilderTrack(),
    };
  }

  const meta = user.user_metadata || {};
  const name = getDisplayName(user);

  return {
    name,
    email: user.email || '',
    role: meta.role || 'Builder',
    bio: meta.bio || meta.description || '',
    location: meta.location || meta.city || '',
    website: meta.website || meta.url || '',
    avatarUrl: meta.avatar_url || meta.picture || '',
    memberSince: user.created_at
      ? new Date(user.created_at).toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        })
      : '',
    track: getBuilderTrack(),
  };
}
