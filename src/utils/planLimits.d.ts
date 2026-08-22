export const BILLING_RETURN_TO_KEY: string;
export const UPLOAD_RETURN_PATH: string;

export function isActiveSubscription(
  subscription: { status?: string } | null | undefined,
): boolean;
export function planAssetLimit(
  planOrSubscription: string | { plan?: string } | null | undefined,
): number;
export function suggestedPlanFromAssetCount(count: unknown): string;
export function planDisplayName(
  planOrSubscription: string | { plan?: string } | null | undefined,
): string;
export function otherPlans(suggested: string): string[];
export function setBillingReturnTo(path: unknown): void;
export function consumeBillingReturnTo(fallback?: string): string;
export function peekBillingReturnTo(): string;
export function extraIpCount(total: unknown, limit: number): number;
export function parsePlanHintFromMessage(text: unknown): {
  count: number;
  suggested: string;
};
export function plansThatCoverCount(count: unknown): string[];
export function localPremiumEstimate(
  assetCount: unknown,
  mode?: string,
  billingCycle?: string,
): Record<string, unknown> | null;
