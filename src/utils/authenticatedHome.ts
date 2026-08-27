/** In-app home for a logged-in session. Public /home is only for logged-out / unpaid users. */

const PAID_PLAN_CACHE_KEY = "vaptfix_has_paid_plan";

function readToken(): string {
  return (
    sessionStorage.getItem("authorization") ||
    localStorage.getItem("authorization") ||
    sessionStorage.getItem("authorization") ||
    localStorage.getItem("authorization") ||
    ""
  ).trim();
}

function readStoredUser(): Record<string, unknown> | null {
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    return user && typeof user === "object" ? user : null;
  } catch {
    return null;
  }
}

function normalizePath(path: string): string {
  return String(path || "").split("?")[0].replace(/\/+$/, "") || "/";
}

export function setCachedPaidPlan(paid: boolean) {
  try {
    sessionStorage.setItem(PAID_PLAN_CACHE_KEY, paid ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function hasCachedPaidPlan(): boolean {
  try {
    return sessionStorage.getItem(PAID_PLAN_CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearCachedPaidPlan() {
  try {
    sessionStorage.removeItem(PAID_PLAN_CACHE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasAuthSession(): boolean {
  const token = readToken();
  return !!(token && token !== "null" && token !== "undefined");
}

export function isStoredTeamMember(): boolean {
  const user = readStoredUser();
  if (!user) return false;
  if (Array.isArray(user.Member_role)) return true;
  const type = String(user.user_type || user.type || user.role || "").toLowerCase();
  return type === "user" || type === "member" || type === "internal" || type === "external";
}

export function markPendingMemberFlow(flow: "teams" | "slack", email = "") {
  try {
    sessionStorage.setItem("pending_member_flow", flow);
    localStorage.setItem("pending_member_flow", flow);
    if (email) {
      sessionStorage.setItem("pending_member_email", email);
      localStorage.setItem("pending_member_email", email);
    }
  } catch {
    /* ignore */
  }
}

export function clearPendingMemberFlow() {
  try {
    sessionStorage.removeItem("pending_member_flow");
    localStorage.removeItem("pending_member_flow");
    sessionStorage.removeItem("pending_member_email");
    localStorage.removeItem("pending_member_email");
  } catch {
    /* ignore */
  }
}

export function readPendingMemberFlow(): string {
  try {
    return (
      sessionStorage.getItem("pending_member_flow") ||
      localStorage.getItem("pending_member_flow") ||
      ""
    );
  } catch {
    return "";
  }
}

export function readPendingMemberEmail(): string {
  try {
    return (
      sessionStorage.getItem("pending_member_email") ||
      localStorage.getItem("pending_member_email") ||
      ""
    );
  } catch {
    return "";
  }
}

/**
 * VAPTFIX logo destination.
 * - User app → /userdashboard
 * - Before payment (Provide Scope, unpaid /home) → /home
 * - /communication or /riskcriteria → stay on that step
 * - Paid admin inner pages → /admindashboardonboarding
 */
export function getAuthenticatedAppHome(currentPath = ""): string {
  const path = normalizePath(currentPath);

  if (isStoredTeamMember()) return "/userdashboard";

  if (path === "/communication") return "/communication";
  if (path === "/riskcriteria") return "/riskcriteria";

  if (path === "/admin-upload-report" || path === "/onboarding1") {
    return "/home";
  }

  if (path === "/waiting-for-report") {
    return hasCachedPaidPlan() ? "/waiting-for-report" : "/home";
  }

  if (!hasAuthSession()) return "/home";

  const publicPage =
    path === "/" ||
    path === "/home" ||
    path === "/pricingplan" ||
    path === "/how-vaptfix-works" ||
    path === "/knowledge-base" ||
    path === "/signin" ||
    path === "/signup";

  if (publicPage) {
    return hasCachedPaidPlan() ? "/admindashboardonboarding" : "/home";
  }

  return "/admindashboardonboarding";
}
