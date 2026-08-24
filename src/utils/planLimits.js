export const BILLING_RETURN_TO_KEY = "vaptfix_billing_return_to";
export const UPLOAD_RETURN_PATH = "/admin-upload-report";

export function isActiveSubscription(subscription) {
  if (!subscription) return false;
  const status = String(subscription.status || "").toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
}

export function isFreemiumPlan(planOrSubscription) {
  const plan = String(
    typeof planOrSubscription === "string"
      ? planOrSubscription
      : planOrSubscription?.plan ||
          planOrSubscription?.plan_name ||
          planOrSubscription?.plan_id ||
          "",
  ).toLowerCase();
  return plan === "freemium" || plan.includes("freemium");
}

export function isInvalidScanFileMessage(text) {
  return /invalid|unsupported|wrong file|could not parse|cannot parse|failed to parse|unrecognized|not a valid|not a (nessus|scan|xml|csv|report)|no host|no asset|empty file|corrupt|malformed|does not contain|unable to (read|parse|process)|unreadable|unknown format/i.test(
    String(text || ""),
  );
}

export function isPlanQuotaMessage(text) {
  return /upgrade|asset.?limit|over.?limit|extra.?ip|plan.?limit|exceeds.{0,24}(ip|asset)|too many (ip|asset|host)/i.test(
    String(text || ""),
  );
}

export function isExistingSubscriptionMessage(text) {
  return /already exists|already (have|has) an? active|active subscription already/i.test(
    String(text || ""),
  );
}

export function planAssetLimit(planOrSubscription) {
  const plan = String(
    typeof planOrSubscription === "string"
      ? planOrSubscription
      : planOrSubscription?.plan || "",
  ).toLowerCase();
  if (plan === "freemium") return 5;
  if (plan === "premium") return 250;
  if (plan === "custom") return Number.POSITIVE_INFINITY;
  return 5;
}

export function suggestedPlanFromAssetCount(count) {
  const n = Number(count) || 0;
  if (n > 250) return "custom";
  if (n > 5) return "premium";
  return "freemium";
}

export function planDisplayName(planOrSubscription) {
  const plan = String(
    typeof planOrSubscription === "string"
      ? planOrSubscription
      : planOrSubscription?.plan || "plan",
  );
  if (!plan) return "Plan";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function otherPlans(suggested) {
  return ["freemium", "premium", "custom"].filter((id) => id !== suggested);
}

export function setBillingReturnTo(path) {
  if (typeof path === "string" && path.startsWith("/")) {
    sessionStorage.setItem(BILLING_RETURN_TO_KEY, path);
  }
}

export function consumeBillingReturnTo(fallback = "/admindashboardonboarding") {
  const path = sessionStorage.getItem(BILLING_RETURN_TO_KEY);
  sessionStorage.removeItem(BILLING_RETURN_TO_KEY);
  if (typeof path === "string" && path.startsWith("/")) return path;
  return fallback;
}

export function peekBillingReturnTo() {
  const path = sessionStorage.getItem(BILLING_RETURN_TO_KEY);
  if (typeof path === "string" && path.startsWith("/")) return path;
  return "";
}

export function extraIpCount(total, limit) {
  const count = Number(total) || 0;
  if (!Number.isFinite(limit)) return 0;
  return Math.max(0, count - limit);
}

export function parsePlanHintFromMessage(text) {
  const s = String(text || "");
  const countMatch =
    s.match(/this report has\s+(\d+)/i) ||
    s.match(/has\s+(\d+)\s+(?:internal\s+)?ips/i) ||
    s.match(/(\d+)\s+assets/i);
  const count = countMatch ? Number(countMatch[1]) : 0;
  const suggested = count ? suggestedPlanFromAssetCount(count) : "";
  return { count, suggested };
}

export function plansThatCoverCount(count) {
  const n = Number(count) || 0;
  return ["freemium", "premium", "custom"].filter((id) => {
    const limit = planAssetLimit(id);
    return !Number.isFinite(limit) || n <= limit;
  });
}

export function localPremiumEstimate(assetCount, mode, billingCycle) {
  const n = Number(assetCount) || 0;
  if (n <= 0) return null;
  if (n > 250) {
    return {
      plan: "premium",
      asset_count: n,
      over_ceiling: true,
      message: "250+ assets — this account must use the Custom plan.",
      currency: "usd",
      amount_due: "0.00",
    };
  }
  const testing = mode === "testing" || mode === "management_testing";
  if (testing) {
    return {
      plan: "premium",
      mode: "management_testing",
      billing_cycle: "annual",
      asset_count: n,
      price_per_ip: "20.00",
      amount_due: (n * 20).toFixed(2),
      currency: "usd",
    };
  }
  const cycle =
    billingCycle === "semi" || billingCycle === "semi_annual"
      ? "semi_annual"
      : billingCycle === "monthly"
        ? "monthly"
        : "annual";
  const rate = cycle === "monthly" ? 2 : cycle === "semi_annual" ? 1.5 : 1.25;
  const months = cycle === "monthly" ? 1 : cycle === "semi_annual" ? 6 : 12;
  return {
    plan: "premium",
    mode: "management",
    billing_cycle: cycle,
    asset_count: n,
    price_per_ip: rate.toFixed(2),
    amount_due: (n * rate * months).toFixed(2),
    currency: "usd",
  };
}
