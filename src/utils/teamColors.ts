/** Team colors — same as Performance Monitoring card top borders */
export const TEAM_COLORS = {
  network: '#3b82f6',
  patch: '#5b21b6',
  configuration: '#06b6d4',
  architectural: '#c026d3',
} as const;

export type TeamKey = keyof typeof TEAM_COLORS;

export const PERFORMANCE_TEAM_CONFIGS = [
  { name: 'Network Security', focus: 'Infrastructure Focus', color: TEAM_COLORS.network, gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', icon: '🔗' },
  { name: 'Patch Management', focus: 'Lifecycle Management', color: TEAM_COLORS.patch, gradient: 'linear-gradient(135deg, #7c3aed, #5b21b6)', icon: '🔧' },
  { name: 'Configuration Management', focus: 'System Configuration', color: TEAM_COLORS.configuration, gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)', icon: '⚙️' },
  { name: 'Architectural Flaws', focus: 'Design & Architecture', color: TEAM_COLORS.architectural, gradient: 'linear-gradient(135deg, #e879f9, #c026d3)', icon: '🏗️' },
] as const;

export const SUPPORT_TEAM_OPTIONS = [
  { value: 'all', label: 'All Teams', color: '#64748b' },
  { value: 'Patch Management', label: 'Patch Management', color: TEAM_COLORS.patch },
  { value: 'Configuration Management', label: 'Configuration Management', color: TEAM_COLORS.configuration },
  { value: 'Network Security', label: 'Network Security', color: TEAM_COLORS.network },
  { value: 'Architectural Flaws', label: 'Architectural Flaws', color: TEAM_COLORS.architectural },
] as const;

export function resolveTeamKey(teamName?: string | null): TeamKey | null {
  const t = String(teamName || '').toLowerCase();
  if (!t || t === 'all') return null;
  if (t.includes('architect')) return 'architectural';
  if (t.includes('patch')) return 'patch';
  if (t.includes('config')) return 'configuration';
  if (t.includes('network') || t.includes('security')) return 'network';
  return null;
}

export function getTeamColor(teamName?: string | null): string {
  const key = resolveTeamKey(teamName);
  return key ? TEAM_COLORS[key] : '#64748b';
}

export function getTeamTextClass(teamName?: string | null): string {
  const key = resolveTeamKey(teamName);
  return key ? `team-txt-${key}` : '';
}

export function getTeamChipClass(teamName?: string | null): string {
  const key = resolveTeamKey(teamName);
  if (!key) return 'rt-team-default';
  return `rt-team-${key}`;
}

const TEAM_SLUG_TO_KEY: Record<string, TeamKey> = {
  network: 'network',
  patch: 'patch',
  configuration: 'configuration',
  config: 'configuration',
  architectural: 'architectural',
  arch: 'architectural',
  'team-network': 'network',
  'team-patch': 'patch',
  'team-config': 'configuration',
  'team-configuration': 'configuration',
  'team-arch': 'architectural',
  'team-architectural': 'architectural',
};

export function teamKeyFromSlug(slug?: string | null): TeamKey | null {
  if (!slug) return null;
  return TEAM_SLUG_TO_KEY[String(slug).toLowerCase()] ?? resolveTeamKey(slug);
}

export function teamPillStyle(
  team: { value: string; label?: string; color?: string },
  selectedTeam: string,
) {
  const active = selectedTeam === team.value;
  const c = team.color || getTeamColor(team.value === 'all' ? null : team.label || team.value);
  return {
    borderColor: c,
    borderWidth: active ? '2px' : '1px',
    color: active ? c : '#1e293b',
    boxShadow: active ? `0 0 0 1px ${c}40` : 'none',
  };
}
