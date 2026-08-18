import endpoint from "./apiServices";

const BILLING_BASE = "/api/admin/billing";

export type BillingPlan = "freemium" | "premium" | "custom";
export type PremiumMode = "management" | "management_testing";
export type BillingCycle = "monthly" | "semi_annual" | "annual";

export interface EstimatePayload {
  plan: BillingPlan;
  mode?: PremiumMode;
  billing_cycle?: BillingCycle;
  asset_count?: number;
}

export interface EstimateResult {
  plan?: BillingPlan;
  mode?: PremiumMode | null;
  billing_cycle?: BillingCycle | null;
  asset_count?: number;
  asset_limit?: number;
  asset_ceiling?: number;
  over_limit?: boolean;
  over_ceiling?: boolean;
  price_per_ip?: string | null;
  amount_due?: string;
  currency?: string;
  message?: string;
  [key: string]: unknown;
}

export interface BillingSubscription {
  plan: BillingPlan | string;
  mode: PremiumMode | string | null;
  billing_cycle: BillingCycle | string | null;
  asset_count: number | null;
  price_per_ip: string | null;
  amount_due: string;
  currency: string;
  status: "incomplete" | "trialing" | "active" | "past_due" | "canceled" | string;
  current_period_start: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface BillingInvoice {
  stripe_invoice_id?: string;
  amount: string;
  currency: string;
  asset_count?: number;
  status: "open" | "paid" | "failed" | "void" | string;
  hosted_invoice_url?: string | null;
  created_at?: string;
}

export interface SubscriptionMeResponse {
  subscription: BillingSubscription | null;
  invoices?: BillingInvoice[];
}

function firstFieldError(data: Record<string, unknown> | null | undefined): string | null {
  if (!data || typeof data !== "object") return null;
  if (typeof data.detail === "string" && data.detail.trim()) return data.detail;
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  for (const key of ["mode", "billing_cycle", "plan", "full_name", "work_email", "company", "estimated_assets"]) {
    const value = data[key];
    if (typeof value === "string" && value.trim()) return value;
    if (Array.isArray(value) && value[0]) return String(value[0]);
  }
  return null;
}

export function billingErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  const err = error as { response?: { data?: Record<string, unknown> }; message?: string };
  const data = err?.response?.data;
  return firstFieldError(data) || err?.message || fallback;
}

export function formatUsd(amount: string | number | null | undefined, currency = "usd"): string {
  const n = Number(amount);
  if (!Number.isFinite(n)) return currency.toLowerCase() === "usd" ? "$0.00" : "0.00";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
    }).format(n);
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export async function estimatePlan(payload: EstimatePayload) {
  const res = await endpoint.post<EstimateResult>(`${BILLING_BASE}/plans/estimate/`, payload);
  return res.data;
}

export async function checkoutFreemium(collectCard = true) {
  const res = await endpoint.post(`${BILLING_BASE}/checkout/freemium/`, {
    collect_card: collectCard,
  });
  return res.data as {
    subscription: BillingSubscription;
    setup_intent_client_secret?: string | null;
  };
}

export async function checkoutPremium(payload: {
  mode: PremiumMode;
  billing_cycle?: BillingCycle;
  asset_count?: number;
}) {
  const body: Record<string, string | number> = { mode: payload.mode };
  if (payload.mode === "management" && payload.billing_cycle) {
    body.billing_cycle = payload.billing_cycle;
  }
  if (payload.asset_count) {
    body.asset_count = payload.asset_count;
  }
  const res = await endpoint.post(`${BILLING_BASE}/checkout/premium/`, body);
  return res.data as {
    checkout_url: string;
    session_id: string;
    amount_due: string;
  };
}

export async function submitCustomLead(payload: {
  full_name: string;
  work_email: string;
  company?: string;
  estimated_assets?: string;
}) {
  const res = await endpoint.post(`${BILLING_BASE}/leads/custom/`, payload);
  return res.data as { detail?: string };
}

export async function getMySubscription() {
  const res = await endpoint.get<SubscriptionMeResponse>(`${BILLING_BASE}/subscription/me/`);
  return res.data;
}

export async function cancelSubscription() {
  const res = await endpoint.post(`${BILLING_BASE}/subscription/cancel/`);
  return res.data as { detail?: string };
}

export async function syncSubscriptionAssets() {
  const res = await endpoint.post(`${BILLING_BASE}/subscription/sync-assets/`);
  return res.data as { asset_count: number };
}

export function isBillingAuthError(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 401;
}
