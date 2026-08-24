export interface TeamsDeepLink {
  status: string;
  teams_tab_url: string;
  teams_tab_url_alt: string;
  teams_desktop_url: string;
  teams_url: string;
}

export interface TeamsRedirectOptions {
  preferDesktop?: boolean;
}

export function extractTeamsDeepLink(payload?: unknown): TeamsDeepLink;
export function persistTeamsDeepLink(links: unknown): void;
export function readStoredTeamsDeepLink(): TeamsDeepLink;
export function isBareTeamsHome(url: unknown): boolean;
export function isChannelSpecificTeamsUrl(url: unknown): boolean;
export function pickTeamsWebUrl(
  links: Partial<TeamsDeepLink> | null | undefined,
): string;
export function pickTeamsRedirectUrl(
  links: Partial<TeamsDeepLink> | null | undefined,
  options?: TeamsRedirectOptions,
): string;
export function resolveTeamsAdminDashboardUrl(
  payload: Record<string, unknown> | null | undefined,
  fetchStatus?: () => Promise<Record<string, unknown> | null | undefined>,
): Promise<string>;
export function openTeamsAdminDashboard(url: unknown): boolean;
