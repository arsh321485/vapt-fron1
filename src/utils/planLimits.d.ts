export const BILLING_RETURN_TO_KEY: string;
export const UPLOAD_RETURN_PATH: string;

export function isActiveSubscription(subscription: unknown): boolean;
export function isFreemiumPlan(planOrSubscription: unknown): boolean;
export function planAssetLimit(planOrSubscription: unknown): number;
export function suggestedPlanFromAssetCount(count: unknown): string;
export function planDisplayName(planOrSubscription: unknown): string;
export function otherPlans(suggested: unknown): string[];
export function setBillingReturnTo(path: unknown): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function extraIpCount(total: unknown, limit: unknown): number;
export function parsePlanHintFromMessage(text: unknown): {
  count: number;
  suggested: string;
};
export function plansThatCoverCount(count: unknown): string[];

export interface LocalPremiumEstimate {
  plan: string;
  asset_count: number;
  over_ceiling?: boolean;
  message?: string;
  currency: string;
  amount_due: string;
  mode?: string;
  billing_cycle?: string;
  price_per_ip?: string;
}

export function localPremiumEstimate(
  assetCount: unknown,
  mode?: unknown,
  billingCycle?: unknown,
): LocalPremiumEstimate | null;
