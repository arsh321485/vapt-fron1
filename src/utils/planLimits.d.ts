export const BILLING_RETURN_TO_KEY: string;
export const UPLOAD_RETURN_PATH: string;
export const FREEMIUM_RETEST_MESSAGE: string;

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
export function suggestedPlanFromAssetCount(count: unknown): string;
export function planDisplayName(planOrSubscription: unknown): string;
export function otherPlans(suggested: unknown): string[];
export function setBillingReturnTo(path: unknown): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function extraIpCount(total: unknown, limit: unknown): number;
export function parsePlanHintFromMessage(text: unknown): { count: number; suggested: string };
export function plansThatCoverCount(count: unknown): string[];
export function localPremiumEstimate(
  assetCount: unknown,
  mode?: unknown,
  billingCycle?: unknown,
): Record<string, unknown> | null;
