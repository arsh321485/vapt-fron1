export interface TeamsDeepLinks {
  status: string;
  teams_tab_url: string;
  teams_tab_url_alt: string;
  teams_desktop_url: string;
  teams_url: string;
  [key: string]: unknown;
}

export function extractTeamsDeepLink(payload?: Record<string, unknown>): TeamsDeepLinks;
export function persistTeamsDeepLink(links: TeamsDeepLinks | null | undefined): void;
export function readStoredTeamsDeepLink(): TeamsDeepLinks;
export function unwrapTeamsLauncherUrl(url: unknown): string;
export function isBareTeamsHome(url: unknown): boolean;
export function isTeamsChatOrTeamHomeUrl(url: unknown): boolean;
export function isVaptfixTeamDirectoryUrl(url: unknown): boolean;
export function isChannelSpecificTeamsUrl(url: unknown): boolean;
export function isUsableBackendTeamsTabUrl(url: unknown): boolean;
export function toTeamsWebChannelUrl(url: unknown): string;
export function buildAdminDashboardChannelUrl(payload?: Record<string, unknown>): string;
export function pickTeamsTabUrl(links: Record<string, unknown> | null | undefined): string;
export function pickTeamsWebUrl(links: Record<string, unknown> | null | undefined): string;
export function pickTeamsRedirectUrl(
  links: Record<string, unknown> | null | undefined,
  options?: { preferDesktop?: boolean },
): string;
export function resolveTeamsAdminDashboardUrl(
  payload: Record<string, unknown>,
  fetchStatus?: () => Promise<Record<string, unknown>>,
): Promise<string>;
export const TEAMS_WINDOW_NAME: string;
export function openTeamsAdminDashboard(
  url: string,
  options?: { newTab?: boolean },
): boolean;
export function landOnTeamsAdminDashboardChannel(
  payload: Record<string, unknown>,
  options?: { newTab?: boolean },
): boolean;
export function redirectToTeamsTabUrl(payload?: Record<string, unknown>): boolean;
export function openTeamsOAuthPopup(authUrl: string): Window | null;
