import { supabase, isSupabaseConfigured } from './supabase.js';
import { getPodMembers } from './homeData.js';

const COLORS = ['#4a7c6e', '#c47d2a', '#5b6eae', '#8a5a7a', '#3d6b8a'];

export async function loadLivePod() {
  if (!isSupabaseConfigured()) return { source: 'sample' };

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData.session?.user?.email) return { source: 'sample' };

  const { data, error } = await supabase
    .from('pod_members')
    .select('email, full_name, timezone, level, pod_id, pods(name, status, pool, applicant_type)');

  if (error) return { source: 'sample' };
  if (!data?.length) return { source: 'waiting' };

  const podRow = data.find((row) => row.pods)?.pods;
  if (!podRow) return { source: 'waiting' };

  return {
    source: 'live',
    name: podRow.name,
    status: podRow.status,
    pool: podRow.pool,
    applicantType: podRow.applicant_type,
    members: data.map((row, index) => toMember(row, index)),
  };
}

export function samplePod() {
  return {
    source: 'sample',
    name: 'Sprint Pod Alpha',
    status: 'open',
    pool: '',
    applicantType: 'builder',
    members: getPodMembers(),
  };
}

function toMember(row, index) {
  const name = row.full_name || row.email;
  const details = [row.level, row.timezone].filter(Boolean).join(' · ');
  return {
    id: row.email,
    email: row.email,
    name,
    initials: initials(name),
    status: details || 'In this pod',
    panelStatus: details || 'In this pod',
    avatarColor: COLORS[index % COLORS.length],
    isOnline: true,
  };
}

function initials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '•';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
