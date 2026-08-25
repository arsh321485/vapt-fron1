export const BILLING_RETURN_TO_KEY: string;
export const UPLOAD_RETURN_PATH: string;
export const FREEMIUM_RETEST_MESSAGE: string;

export type PlanId = "freemium" | "premium" | "custom";

export interface PlanHint {
  count: number;
  suggested: PlanId | "";
}

export interface PlanHintFromMessage {
  count: number;
  suggested: PlanId | "";
}

export interface PremiumEstimate {
  plan: string;
  asset_count: number;
  currency: string;
  amount_due: string;
  over_ceiling?: boolean;
  message?: string;
  mode?: string;
  billing_cycle?: string;
  price_per_ip?: string;
}

export interface RetestErrorExtras {
  fallback?: unknown;
  isFreemium?: unknown;
  automationPremiumRequired?: unknown;
  httpStatus?: unknown;
}

export function isActiveSubscription(subscription: unknown): boolean;
export function isFreemiumPlan(planOrSubscription: unknown): boolean;
export function isInvalidScanFileMessage(text: unknown): boolean;
export function isNetworkOrTransportError(text: unknown): boolean;
export function isPlanQuotaMessage(text: unknown): boolean;
export function isExistingSubscriptionMessage(text: unknown): boolean;
export function isRetestBlockedMessage(text: unknown): boolean;
export function retestErrorMessage(apiMessage: unknown, extras?: RetestErrorExtras): string;
export function planAssetLimit(planOrSubscription: unknown): number;
export function suggestedPlanFromAssetCount(count: unknown): PlanId;
export function planDisplayName(planOrSubscription: unknown): string;
export function otherPlans(suggested: unknown): PlanId[];
export function setBillingReturnTo(path: unknown): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function extraIpCount(total: unknown, limit: number): number;
export function parsePlanHintFromMessage(text: unknown): PlanHintFromMessage;
export function plansThatCoverCount(count: unknown): PlanId[];
export function localPremiumEstimate(
  assetCount: unknown,
  mode?: string,
  billingCycle?: string,
): PremiumEstimate | null;
