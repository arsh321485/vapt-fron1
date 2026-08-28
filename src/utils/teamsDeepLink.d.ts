export interface TeamsDeepLink {
  status: string;
  teams_tab_url: string;
  teams_tab_url_alt: string;
  teams_desktop_url: string;
  teams_url: string;
}

export function extractTeamsDeepLink(payload?: unknown): TeamsDeepLink;
export function persistTeamsDeepLink(links: unknown): void;
export function readStoredTeamsDeepLink(): TeamsDeepLink;
export function isBareTeamsHome(url: unknown): boolean;
export function isTeamsChatOrTeamHomeUrl(url: unknown): boolean;
export function isChannelSpecificTeamsUrl(url: unknown): boolean;
export function pickTeamsTabUrl(links: TeamsDeepLink | Record<string, unknown> | null | undefined): string;
export function pickTeamsWebUrl(links: TeamsDeepLink | Record<string, unknown> | null | undefined): string;
export function pickTeamsRedirectUrl(
  links: TeamsDeepLink | Record<string, unknown> | null | undefined,
  options?: { preferDesktop?: boolean },
): string;
export function resolveTeamsAdminDashboardUrl(
  payload: unknown,
  fetchStatus?: () => unknown,
): Promise<string>;
export function openTeamsAdminDashboard(url: unknown): boolean;
export function redirectToTeamsTabUrl(payload: unknown): boolean;
