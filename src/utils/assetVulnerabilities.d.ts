export type AssetVulnInput = Record<string, unknown> | null | undefined;

export interface AutomationProfile {
  label: string;
  pct: number;
  tier: "yes" | "no" | "partial";
}

export interface AutomationDisplay extends AutomationProfile {
  barWidth: number;
  displayPct: string;
}

export function canonSeverity(sev: unknown): string;
export function vulnDisplayName(v: AssetVulnInput): string;
export function vulnNameKey(v: AssetVulnInput): string;
export function isActiveVulnStatus(status: unknown): boolean;
export function normalizeAssetVulnerability(
  v: AssetVulnInput,
): Record<string, unknown> | null;
export function normalizeAssetVulnerabilityList(
  list: unknown,
): Record<string, unknown>[];
export function assetMatchesRegisterRow(
  row: Record<string, unknown>,
  assetIp: unknown,
): boolean;
export function buildVulnsFromRegister(
  registerRows: unknown,
  assetIp: unknown,
): Record<string, unknown>[];
export function matchesVulnStatusFilter(
  vuln: AssetVulnInput,
  statusFilter: string[] | null | undefined,
): boolean;
export function mergeAssetThreatVulnerabilities(
  activeVulns: unknown,
  closedFixVulns?: unknown,
): Record<string, unknown>[];
export function filterOpenAssetVulnerabilities(
  vulns: unknown,
  closedFixVulns?: unknown,
): Record<string, unknown>[];
export function severityMatchesFilter(
  severity: unknown,
  activeFilters: string[] | null | undefined,
): boolean;

export const AUTOMATION_DEMO_BY_SEVERITY: Record<string, AutomationProfile>;
export const AUTOMATION_DEMO_BY_ASSET: Record<string, AutomationProfile>;
export const AUTOMATION_DEMO_BY_INDEX: AutomationProfile[];

export function getAutomationProfileForAsset(
  assetIp: unknown,
  assetIndex?: number | null,
): AutomationProfile | null;
export function getAutomationProfileForSeverity(
  severity: unknown,
  overrides?: Partial<AutomationProfile>,
): AutomationProfile;
export function resolveAutomationDisplay(
  automationLevel: unknown,
  automationPct: unknown,
  severity: unknown,
  assetIp?: unknown,
  assetIndex?: number | null,
): AutomationDisplay;
export function isAutomationNotAvailable(
  assetIp?: unknown,
  assetIndex?: number | null,
  severity?: string,
): boolean;
