export interface TeamsDeepLink {
  status: string;
  teams_tab_url: string;
  teams_tab_url_alt: string;
  teams_desktop_url: string;
  teams_url: string;
}

export function extractTeamsDeepLink(payload?: Record<string, unknown>): TeamsDeepLink;
export function persistTeamsDeepLink(links: TeamsDeepLink | Record<string, unknown> | null | undefined): void;
export function readStoredTeamsDeepLink(): TeamsDeepLink;
export function unwrapTeamsLauncherUrl(url: unknown): string;
export function isBareTeamsHome(url: unknown): boolean;
export function isTeamsChatOrTeamHomeUrl(url: unknown): boolean;
export function isVaptfixTeamDirectoryUrl(url: unknown): boolean;
export function isChannelSpecificTeamsUrl(url: unknown): boolean;
export function toTeamsWebChannelUrl(url: unknown): string;
export function buildAdminDashboardChannelUrl(payload?: Record<string, unknown>): string;
export function pickTeamsTabUrl(links: TeamsDeepLink | Record<string, unknown> | null | undefined): string;
export function pickTeamsWebUrl(links: TeamsDeepLink | Record<string, unknown> | null | undefined): string;
export function pickTeamsRedirectUrl(
  links: TeamsDeepLink | Record<string, unknown> | null | undefined,
  opts?: { preferDesktop?: boolean },
): string;
export function resolveTeamsAdminDashboardUrl(
  payload: Record<string, unknown>,
  fetchStatus?: () => Promise<Record<string, unknown> | null | undefined>,
): Promise<string>;
export const TEAMS_WINDOW_NAME: string;
export function openTeamsAdminDashboard(url: unknown, opts?: { newTab?: boolean }): boolean;
export function landOnTeamsAdminDashboardChannel(
  payload: Record<string, unknown>,
  opts?: { newTab?: boolean },
): boolean;
export function redirectToTeamsTabUrl(payload: Record<string, unknown>): boolean;
export function openTeamsOAuthPopup(authUrl: unknown): Window | null;
