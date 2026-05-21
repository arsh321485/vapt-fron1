export interface AutomationTierProfile {
  label: string;
  pct: number;
  tier: string;
}

export interface AutomationDisplayResult {
  tier: string;
  label: string;
  pct: number;
  barWidth: number;
  displayPct: string;
}

export interface NormalizedAssetVulnerability {
  vul_name: string;
  plugin_name: string;
  vulnerability_name: string;
  severity: string;
  risk_factor: string;
  status: string;
  description: string;
  cvss_score: string | number | null;
  cve: string;
  exposure: string;
  [key: string]: unknown;
}

export function canonSeverity(sev: unknown): string;
export function vulnDisplayName(v: Record<string, unknown> | null | undefined): string;
export function vulnNameKey(v: Record<string, unknown> | null | undefined): string;
export function isActiveVulnStatus(status: unknown): boolean;
export function normalizeAssetVulnerability(
  v: Record<string, unknown> | null | undefined,
): NormalizedAssetVulnerability | null;
export function normalizeAssetVulnerabilityList(
  list: unknown,
): NormalizedAssetVulnerability[];
export function assetMatchesRegisterRow(
  row: Record<string, unknown>,
  assetIp: string,
): boolean;
export function buildVulnsFromRegister(
  registerRows: unknown,
  assetIp: string,
): NormalizedAssetVulnerability[];
export function matchesVulnStatusFilter(
  vuln: Record<string, unknown> | null | undefined,
  statusFilter: string[] | null | undefined,
): boolean;
export function mergeAssetThreatVulnerabilities(
  activeVulns: unknown,
  closedFixVulns?: unknown,
): NormalizedAssetVulnerability[];
export function filterOpenAssetVulnerabilities(
  vulns: unknown,
  closedFixVulns?: unknown,
): NormalizedAssetVulnerability[];
export function severityMatchesFilter(
  severity: unknown,
  activeFilters: string[] | null | undefined,
): boolean;

export const AUTOMATION_DEMO_BY_SEVERITY: Record<string, AutomationTierProfile>;
export const AUTOMATION_DEMO_BY_ASSET: Record<string, AutomationTierProfile>;
export const AUTOMATION_DEMO_BY_INDEX: AutomationTierProfile[];

export function getAutomationProfileForAsset(
  assetIp: string | null | undefined,
  assetIndex?: number | null,
): AutomationTierProfile | null;
export function getAutomationProfileForSeverity(
  severity: unknown,
  overrides?: Partial<AutomationTierProfile>,
): AutomationTierProfile;
export function resolveAutomationDisplay(
  automationLevel: unknown,
  automationPct: unknown,
  severity: unknown,
  assetIp?: string | null,
  assetIndex?: number | null,
): AutomationDisplayResult;
export function isAutomationNotAvailable(
  assetIp?: string | null,
  assetIndex?: number | null,
  severity?: string,
): boolean;
