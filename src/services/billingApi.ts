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

export interface BillingAssetBreakdown {
  asset_count?: number;
  visible_asset_count?: number;
  locked_asset_count?: number;
  original_asset_count?: number;
  billable_asset_count?: number;
}

export interface EstimateResult extends BillingAssetBreakdown {
  plan?: BillingPlan;
  mode?: PremiumMode | null;
  billing_cycle?: BillingCycle | null;
  asset_limit?: number;
  asset_ceiling?: number;
  over_limit?: boolean;
  over_ceiling?: boolean;
  price_per_ip?: string | null;
  amount_due?: string;
  currency?: string;
  message?: string;
  needs_scope?: boolean;
  scope_submit_endpoint?: string;
  [key: string]: unknown;
}

export interface BillingSubscription extends BillingAssetBreakdown {
  plan: BillingPlan | string;
  mode: PremiumMode | string | null;
  billing_cycle: BillingCycle | string | null;
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

function stripeDetailText(detail: unknown): string | null {
  if (typeof detail === "string" && detail.trim()) return detail.trim();
  if (Array.isArray(detail)) {
    const parts = detail
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          const row = item as Record<string, unknown>;
          return String(row.msg || row.detail || row.message || "").trim();
        }
        return "";
      })
      .filter(Boolean);
    return parts.length ? parts.join(" ") : null;
  }
  if (detail && typeof detail === "object") {
    const row = detail as Record<string, unknown>;
    const nested = row.msg || row.detail || row.message;
    if (typeof nested === "string" && nested.trim()) return nested.trim();
  }
  return null;
}

function firstFieldError(data: Record<string, unknown> | null | undefined): string | null {
  if (!data || typeof data !== "object") return null;
  const detail = stripeDetailText(data.detail);
  if (detail) return detail;
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  for (const key of [
    "mode",
    "billing_cycle",
    "plan",
    "full_name",
    "work_email",
    "company",
    "estimated_assets",
    "targets",
    "file",
  ]) {
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

/** Review Plan — submit IPs/URLs so Management+Testing can be priced. */
export async function submitBillingScope(payload: { targets?: string; file?: File | null }) {
  const form = new FormData();
  const targets = String(payload.targets || "").trim();
  if (payload.file) form.append("file", payload.file);
  else if (targets) form.append("targets", targets);

  const res = await endpoint.post("/api/admin/scope/create/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as {
    message?: string;
    created_count?: number;
    skipped_count?: number;
  };
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
  const res = await endpoint.get<SubscriptionMeResponse & BillingAssetBreakdown>(
    `${BILLING_BASE}/subscription/me/`,
  );
  const data = res.data || {};
  const sub = data.subscription;
  if (sub && typeof sub === "object") {
    data.subscription = {
      ...sub,
      asset_count: sub.asset_count ?? data.asset_count,
      visible_asset_count: sub.visible_asset_count ?? data.visible_asset_count,
      locked_asset_count: sub.locked_asset_count ?? data.locked_asset_count,
      original_asset_count: sub.original_asset_count ?? data.original_asset_count,
      billable_asset_count: sub.billable_asset_count ?? data.billable_asset_count,
    };
  }
  return data;
}

export async function cancelSubscription() {
  const res = await endpoint.post(`${BILLING_BASE}/subscription/cancel/`);
  return res.data as { detail?: string };
}

export async function syncSubscriptionAssets() {
  const res = await endpoint.post(`${BILLING_BASE}/subscription/sync-assets/`);
  return res.data as BillingAssetBreakdown & { asset_count: number };
}

export function isBillingAuthError(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 401;
}
