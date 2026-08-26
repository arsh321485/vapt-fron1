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

export function extractTeamsDeepLink(payload?: any): any;
export function persistTeamsDeepLink(links?: any): void;
export function readStoredTeamsDeepLink(): any;
export function isBareTeamsHome(url?: any): boolean;
export function isTeamsChatOrTeamHomeUrl(url?: any): boolean;
export function isChannelSpecificTeamsUrl(url?: any): boolean;
export function pickTeamsTabUrl(links?: any): string;
export function pickTeamsWebUrl(links?: any): string;
export function pickTeamsRedirectUrl(links?: any, options?: { preferDesktop?: boolean }): string;
export function resolveTeamsAdminDashboardUrl(payload?: any, fetchStatus?: any): Promise<string>;
export function openTeamsAdminDashboard(url?: any): boolean;
export function redirectToTeamsTabUrl(payload?: any): boolean;
