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
export function pickVulnDescription(
  ...sources: Array<string | Record<string, unknown> | null | undefined>
): string;
export function mergeDescriptionsIntoVulns(
  vulns: unknown,
  ...extraLists: unknown[]
): NormalizedAssetVulnerability[];
export function isActiveVulnStatus(status: unknown): boolean;
export function rowStatusValue(row: unknown): string;
export function closedVulnHostKey(vulnName: unknown, host: unknown): string;
export function closedRecordVulnName(rec: unknown): string;
export function closedRecordHostName(rec: unknown): string;
export function buildClosedVulnHostSet(closedRecords?: unknown): Set<string>;
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
export function filterDeletedVulnsForHost(
  vulns: unknown,
  hostName: string,
  deletedRows?: unknown,
): NormalizedAssetVulnerability[];
export function buildVulnsFromRegister(
  registerRows: unknown,
  assetIp: string,
  deletedRows?: unknown,
): NormalizedAssetVulnerability[];
export function lookupRegisterRow(
  registerRows: unknown,
  vuln: Record<string, unknown> | null | undefined,
  assetIp: string,
): Record<string, unknown> | null;
export function extractFixVulnerabilityId(
  obj: Record<string, unknown> | null | undefined,
): string;
export function extractCreatedFixVulnerabilityId(
  obj: Record<string, unknown> | null | undefined,
): string;
export function lookupFixVulnerabilityId(
  registerRows: unknown,
  vuln: Record<string, unknown> | null | undefined,
  assetIp: string,
): string;
export function enrichVulnsFromRegister(
  vulns: unknown,
  registerRows: unknown,
  assetIp: string,
): NormalizedAssetVulnerability[];
export function matchesVulnStatusFilter(
  vuln: Record<string, unknown> | null | undefined,
  statusFilter: string[] | null | undefined,
): boolean;
export function normalizeReportVulnerability(
  v: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null;
export function normalizeReportVulnerabilityList(list: unknown): Record<string, unknown>[];
export function buildDeletedVulnAssetSet(
  deletedRows: unknown,
): Set<string>;
export function enrichReportVulnerabilitiesFromRegister(
  grouped: Record<string, unknown>[],
  registerRows: unknown,
  deletedRows?: unknown,
): Record<string, unknown>[];
export function reportVulnAssetCount(v: Record<string, unknown> | null | undefined): number;
export function normalizeHeldVulnerabilityAsset(
  row: Record<string, unknown> | null | undefined,
  pluginName?: string,
): Record<string, unknown> | null;
export function normalizeHeldVulnerabilityAssetList(
  list: unknown,
  pluginName?: string,
): Record<string, unknown>[];
export function mergeAssetThreatVulnerabilities(
  activeVulns: unknown,
  closedFixVulns?: unknown,
  host?: string,
): NormalizedAssetVulnerability[];
export function filterOpenAssetVulnerabilities(
  vulns: unknown,
  closedFixVulns?: unknown,
  host?: string,
): NormalizedAssetVulnerability[];
export function isActiveThreatVulnerability(
  vuln: unknown,
  closedFixVulns?: unknown,
  host?: string,
): boolean;
export function filterActiveThreatVulnerabilities(
  vulns: unknown,
  closedFixVulns?: unknown,
  host?: string,
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
