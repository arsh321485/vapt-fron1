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

const CUSTOM_TEAM_PALETTE = ['#f97316', '#16a34a', '#e11d48', '#ca8a04', '#4f46e5', '#0f766e'];

/** Fixed teams keep their colors. Any other team name gets a stable palette color. */
export function colorForTeamName(teamName?: string | null): string {
  const raw = String(teamName || '').trim().toLowerCase();
  const canonical = CANONICAL_TEAM_NAMES.find((name) => name.toLowerCase() === raw);
  if (canonical) return getTeamColor(canonical);
  if (!raw) return '#64748b';
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) hash = (hash + raw.charCodeAt(i) * (i + 1)) % CUSTOM_TEAM_PALETTE.length;
  return CUSTOM_TEAM_PALETTE[hash];
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

export type SupportTeamOption = { value: string; label: string; color: string };

function teamLabel(item: unknown): string {
  if (item && typeof item === "object") {
    const row = item as Record<string, unknown>;
    return String(row.name || row.team_name || row.team || "").trim();
  }
  return String(item || "").trim();
}

/** Team names stored on a support-request row, including a custom team. */
export function supportRequestTeamNames(req: unknown): string[] {
  if (!req || typeof req !== "object") return [];
  const row = req as Record<string, unknown>;
  const raw: unknown[] = [
    row.assigned_team,
    row.team_name,
    row.team,
    row.assigned_to_team,
  ];
  ["all_assigned_teams", "additional_teams", "assigned_teams"].forEach((key) => {
    if (Array.isArray(row[key])) raw.push(...row[key]);
  });
  const seen = new Set<string>();
  const names: string[] = [];
  raw.forEach((item) => {
    const name = teamLabel(item);
    const key = name.toLowerCase();
    if (!name || key === "all" || key === "all teams" || seen.has(key)) return;
    seen.add(key);
    names.push(name);
  });
  return names;
}

export function requestMatchesSupportTeam(req: unknown, selected: string): boolean {
  const sel = String(selected || "").toLowerCase().trim();
  if (!sel || sel === "all") return true;
  if (!req || typeof req !== "object") return false;
  const teams = (req as Record<string, unknown>).all_assigned_teams;
  if (!Array.isArray(teams)) return false;
  return teams.some((item) => teamLabel(item).toLowerCase() === sel);
}

/** Built-in support pills, then custom_teams from the support-request list. */
export function buildSupportTeamOptions(extraNames: Array<string | null | undefined> = []): SupportTeamOption[] {
  const options: SupportTeamOption[] = SUPPORT_TEAM_OPTIONS.map((team) => ({
    value: team.value,
    label: team.label,
    color: team.color,
  }));
  const known = new Set(options.map((team) => team.value.toLowerCase()));
  extraNames.forEach((raw) => {
    const label = String(raw || "").trim();
    const key = label.toLowerCase();
    if (!label || known.has(key)) return;
    known.add(key);
    options.push({ value: label, label, color: colorForTeamName(label) });
  });
  return options;
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

/** Tab nav label (Your Team, Mitigation Strategy, etc.) */
export function getTeamTabNavStyle(teamName?: string | null, isActive = false) {
  const c = getTeamColor(teamName);
  return {
    color: isActive ? c : '#64748b',
    fontWeight: isActive ? '600' : '500',
  };
}

export function getTeamTabUnderlineStyle(teamName?: string | null) {
  return { backgroundColor: getTeamColor(teamName) };
}

export const CANONICAL_TEAM_NAMES = [
  'Network Security',
  'Patch Management',
  'Configuration Management',
  'Architectural Flaws',
] as const;

const CANONICAL_CHIP_STYLE: Record<string, { color: string; backgroundColor: string; borderColor: string }> = {
  'Network Security': { color: '#3b82f6', backgroundColor: '#eff6ff', borderColor: '#3b82f6' },
  'Patch Management': { color: '#5b21b6', backgroundColor: '#f5f3ff', borderColor: '#5b21b6' },
  'Configuration Management': { color: '#06b6d4', backgroundColor: '#ecfeff', borderColor: '#06b6d4' },
  'Architectural Flaws': { color: '#c026d3', backgroundColor: '#fdf4ff', borderColor: '#c026d3' },
};

const OWN_TEAM_CHIP_STYLE = {
  color: '#f97316',
  backgroundColor: '#fff7ed',
  borderColor: '#f97316',
};

/** Prefer all_assigned_teams. Fall back to the primary team plus additional_teams. */
export function listAssignedTeams(source: unknown): string[] {
  if (!source || typeof source !== "object") return [];
  const row = source as Record<string, unknown>;
  const all = Array.isArray(row.all_assigned_teams) ? row.all_assigned_teams : [];
  const raw = all.length
    ? all
    : [
        ...(row.assigned_to_team ? [row.assigned_to_team] : []),
        ...(Array.isArray(row.additional_teams) ? row.additional_teams : []),
      ];
  const seen = new Set<string>();
  const names: string[] = [];
  raw.forEach((item) => {
    const name = teamLabel(item);
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return;
    seen.add(key);
    names.push(name);
  });
  return names;
}

/** One pill per team. Built-in teams keep their colors. A custom team is orange. */
export function teamChipStyle(name?: string | null) {
  const label = String(name || '').trim();
  const canonical = CANONICAL_TEAM_NAMES.find((team) => team.toLowerCase() === label.toLowerCase());
  if (canonical && CANONICAL_CHIP_STYLE[canonical]) return { ...CANONICAL_CHIP_STYLE[canonical] };
  return { ...OWN_TEAM_CHIP_STYLE };
}
