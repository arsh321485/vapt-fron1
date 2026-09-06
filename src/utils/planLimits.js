export const BILLING_RETURN_TO_KEY = "vaptfix_billing_return_to";
export const UPLOAD_RETURN_PATH = "/admin-upload-report";

export function isActiveSubscription(subscription) {
  if (!subscription) return false;
  const status = String(subscription.status || "").toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
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
