export interface TeamsDeepLink {
  status: string;
  teams_tab_url: string;
  teams_tab_url_alt: string;
  teams_desktop_url: string;
  teams_url: string;
  [key: string]: unknown;
}

export const TEAMS_WINDOW_NAME: string;

export function extractTeamsDeepLink(payload?: unknown): TeamsDeepLink;
export function persistTeamsDeepLink(links: unknown): void;
export function readStoredTeamsDeepLink(): TeamsDeepLink;
export function unwrapTeamsLauncherUrl(url: unknown): string;
export function isBareTeamsHome(url: unknown): boolean;
export function isTeamsChatOrTeamHomeUrl(url: unknown): boolean;
export function isVaptfixTeamDirectoryUrl(url: unknown): boolean;
export function isChannelSpecificTeamsUrl(url: unknown): boolean;
export function toTeamsWebChannelUrl(url: unknown): string;
export function buildAdminDashboardChannelUrl(payload?: unknown): string;
export function pickTeamsTabUrl(links: unknown): string;
export function pickTeamsWebUrl(links: unknown): string;
export function pickTeamsRedirectUrl(
  links: unknown,
  opts?: { preferDesktop?: boolean },
): string;
export function resolveTeamsAdminDashboardUrl(
  payload: unknown,
  fetchStatus?: () => Promise<unknown> | unknown,
): Promise<string>;
export function openTeamsAdminDashboard(
  url: unknown,
  opts?: { newTab?: boolean },
): boolean;
export function landOnTeamsAdminDashboardChannel(
  payload: unknown,
  opts?: { newTab?: boolean },
): boolean;
export function redirectToTeamsTabUrl(payload: unknown): boolean;
export function openTeamsOAuthPopup(authUrl: unknown): Window | null;
