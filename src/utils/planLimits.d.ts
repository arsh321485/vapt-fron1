export const BILLING_RETURN_TO_KEY: string;
export const UPLOAD_RETURN_PATH: string;
export const FREEMIUM_RETEST_MESSAGE: string;
export const FREEMIUM_VISIBLE_ASSET_LIMIT: number;
export const FREEMIUM_TEAM_MEMBER_LIMIT: number;

export interface BillingAssetBreakdown {
  asset_count: number;
  visible_asset_count: number;
  locked_asset_count: number;
  original_asset_count: number;
  billable_asset_count: number;
}

export interface FreemiumUpgradeBanner {
  eligible: true;
  locked_assets: number;
  visible_assets: number;
  total_assets: number;
  message: string;
  upgrade_url: string;
}

export interface RetestErrorExtras {
  fallback?: string;
  isFreemium?: boolean;
  automationPremiumRequired?: boolean;
  httpStatus?: number;
}

export interface PlanHint {
  count: number;
  suggested: string;
}

export function setPremiumEntrySource(source: unknown): void;
export function peekPremiumEntrySource(): string;
export function reportLooksLikeUploadedScan(data: unknown): boolean;
export function isActiveSubscription(subscription: unknown): boolean;
export function isFreemiumPlan(planOrSubscription: unknown): boolean;
export function freemiumLocksUploadScope(subscription: unknown): boolean;
export function isInvalidScanFileMessage(text: unknown): boolean;
export function isNetworkOrTransportError(text: unknown): boolean;
export function isPlanQuotaMessage(text: unknown): boolean;
export function isExistingSubscriptionMessage(text: unknown): boolean;
export function isRetestBlockedMessage(text: unknown): boolean;
export function retestErrorMessage(apiMessage: unknown, extras?: RetestErrorExtras): string;
export function planAssetLimit(planOrSubscription: unknown): number;
export function planBlocksOversizedUpload(planOrSubscription: unknown): boolean;
export function isFreemiumTeamLimitMessage(text: unknown): boolean;
export function parseFreemiumUpgrade(data: unknown): FreemiumUpgradeBanner | null;
export function freemiumUpgradeAssetCount(banner: unknown): number;
export function wasFreemiumCompletePopupShown(): boolean;
export function markFreemiumCompletePopupShown(): void;
export function collectFreemiumTrimmedResults(data: unknown): Record<string, unknown>[];
export function formatFreemiumTrimmedMessage(row?: unknown): string;
export function billingAssetBreakdown(source: unknown): BillingAssetBreakdown;
export function billableAssetCount(source: unknown, fallback?: unknown): number;
export function uniqueIpCountFields(source: unknown): number;
export function uniqueHostCountFromPayload(source: unknown): number;
export function fullFileIpCount(source: unknown): number;
export function detectedFileAssetCount(source: unknown, fallback?: unknown): number;
export function recommendPlanAssetCount(...sources: unknown[]): number;
export function fullReportAssetCount(source: unknown, fallback?: unknown): number;
export function formatLockedUpgradeNotice(source: unknown): string;
export function storeBillableAssetCount(count: unknown): void;
export function peekBillableAssetCount(): number;
export function rememberFullAssetCount(source: unknown, fallback?: unknown): number;
export function suggestedPlanFromAssetCount(count: unknown): string;
export function planDisplayName(planOrSubscription: unknown): string;
export function otherPlans(suggested: unknown): string[];
export function setBillingReturnTo(path: unknown): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function clearBillingReturnTo(): void;
export function markFreemiumActiveNotice(): void;
export function consumeFreemiumActiveNotice(): boolean;
export function extraIpCount(total: unknown, limit: unknown): number;
export function parsePlanHintFromMessage(text: unknown): PlanHint;
export function plansThatCoverCount(count: unknown): string[];
export function localPremiumEstimate(
  assetCount: unknown,
  mode?: unknown,
  billingCycle?: unknown,
): Record<string, unknown> | null;
