export const BILLING_RETURN_TO_KEY: string;
export const UPLOAD_RETURN_PATH: string;

export interface PlanHint {
  count: number;
  suggested: string;
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

export function isActiveSubscription(subscription: unknown): boolean;
export function isFreemiumPlan(planOrSubscription: unknown): boolean;
export function isInvalidScanFileMessage(text: unknown): boolean;
export function isPlanQuotaMessage(text: unknown): boolean;
export function isExistingSubscriptionMessage(text: unknown): boolean;
export function planAssetLimit(planOrSubscription: unknown): number;
export function suggestedPlanFromAssetCount(count: unknown): string;
export function planDisplayName(planOrSubscription: unknown): string;
export function otherPlans(suggested: unknown): string[];
export function setBillingReturnTo(path: unknown): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function extraIpCount(total: unknown, limit: unknown): number;
export function parsePlanHintFromMessage(text: unknown): PlanHint;
export function plansThatCoverCount(count: unknown): string[];
export function localPremiumEstimate(
  assetCount: unknown,
  mode?: unknown,
  billingCycle?: unknown,
): PremiumEstimate | null;
