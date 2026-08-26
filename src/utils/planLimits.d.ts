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

export function isActiveSubscription(subscription?: any): boolean;
export function isFreemiumPlan(planOrSubscription?: any): boolean;
export function isInvalidScanFileMessage(text?: any): boolean;
export function isNetworkOrTransportError(text?: any): boolean;
export function isPlanQuotaMessage(text?: any): boolean;
export function isExistingSubscriptionMessage(text?: any): boolean;
export function isRetestBlockedMessage(text?: any): boolean;
export function retestErrorMessage(apiMessage?: any, extras?: any): string;
export function planAssetLimit(planOrSubscription?: any): number;
export function suggestedPlanFromAssetCount(count?: any): string;
export function planDisplayName(planOrSubscription?: any): string;
export function otherPlans(suggested?: any): string[];
export function setBillingReturnTo(path?: any): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function markFreemiumActiveNotice(): void;
export function consumeFreemiumActiveNotice(): boolean;
export function extraIpCount(total?: any, limit?: any): number;
export function parsePlanHintFromMessage(text?: any): { count: number; suggested: string };
export function plansThatCoverCount(count?: any): string[];
export function localPremiumEstimate(assetCount?: any, mode?: any, billingCycle?: any): any;
