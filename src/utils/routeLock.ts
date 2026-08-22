const LOCK_KEY = "vaptfix_locked_route";

function pathOf(route: { path?: string } | string): string {
  return typeof route === "string" ? route : String(route?.path || "");
}

function normalizeFullPath(fullPath: string): string {
  if (!fullPath) return "";
  try {
    const url = new URL(fullPath, "http://local.invalid");
    const path = (url.pathname.replace(/\/+$/, "") || "/").toLowerCase();
    const search = url.search || "";
    return `${path}${search}`;
  } catch {
    return String(fullPath).replace(/\/+$/, "").toLowerCase();
  }
}

/** OAuth / email / payment returns must still work from a typed or new-tab URL. */
export function isRouteLockExempt(to: { path?: string; query?: Record<string, unknown> }): boolean {
  const path = pathOf(to);
  if (
    path.startsWith("/microsoft/callback") ||
    path.startsWith("/slack/callback") ||
    path.startsWith("/jira/callback") ||
    path.startsWith("/reset-password/") ||
    path.startsWith("/set-password/") ||
    path.startsWith("/user-set-password/") ||
    path.startsWith("/billing/")
  ) {
    return true;
  }

  const query = to.query || {};
  const pick = (value: unknown) => {
    if (value == null) return "";
    return String(Array.isArray(value) ? value[0] : value).trim();
  };
  if (pick(query.invite) || pick(query.uidb64) || pick(query.token)) return true;
  if (pick(query.signin) === "user" || pick(query.signin) === "admin") return true;
  return false;
}

export function readLockedRoute(): string {
  try {
    return (sessionStorage.getItem(LOCK_KEY) || "").trim();
  } catch {
    return "";
  }
}

export function writeLockedRoute(fullPath: string) {
  const value = String(fullPath || "").trim();
  if (!value) return;
  try {
    sessionStorage.setItem(LOCK_KEY, value);
  } catch {
    /* ignore */
  }
}

export function clearLockedRoute() {
  try {
    sessionStorage.removeItem(LOCK_KEY);
  } catch {
    /* ignore */
  }
}

export function lockedLocation(fullPath: string): {
  path: string;
  query: Record<string, string>;
  hash: string;
  replace: true;
} {
  const url = new URL(fullPath, window.location.origin);
  return {
    path: url.pathname || "/home",
    query: Object.fromEntries(url.searchParams.entries()),
    hash: url.hash || "",
    replace: true,
  };
}

export function sameLockedRoute(locked: string, fullPath: string): boolean {
  return normalizeFullPath(locked) === normalizeFullPath(fullPath);
}

/** Remember /home even if afterEach has not run yet (HMR / first paint). */
export function seedLockFromWindow() {
  try {
    const path = window.location.pathname.replace(/\/+$/, "") || "/";
    if (path === "/" || path === "/home") {
      writeLockedRoute(`${path === "/" ? "/home" : path}${window.location.search || ""}`);
    }
  } catch {
    /* ignore */
  }
}
