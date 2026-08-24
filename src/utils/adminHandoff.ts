const HANDOFF_ERROR_KEY = "vaptfix_handoff_error";
const HANDOFF_NAV_KEY = "vaptfix_handoff_nav";

export function readQueryAdminToken(query: Record<string, unknown> | undefined): string {
  if (!query) return "";
  const raw = query.admin_token;
  const value = Array.isArray(raw) ? raw[0] : raw;
  return String(value || "").trim();
}

export function storeHandoffError(message: string) {
  try {
    sessionStorage.setItem(HANDOFF_ERROR_KEY, String(message || "").trim());
  } catch {
    /* ignore */
  }
}

export function consumeHandoffError(): string {
  try {
    const message = String(sessionStorage.getItem(HANDOFF_ERROR_KEY) || "").trim();
    sessionStorage.removeItem(HANDOFF_ERROR_KEY);
    return message;
  } catch {
    return "";
  }
}

export function markHandoffNavigation(path: string) {
  try {
    sessionStorage.setItem(HANDOFF_NAV_KEY, String(path || "").trim());
  } catch {
    /* ignore */
  }
}

export function isHandoffNavigation(path: string): boolean {
  try {
    return sessionStorage.getItem(HANDOFF_NAV_KEY) === String(path || "").trim();
  } catch {
    return false;
  }
}

export function hasHandoffError(): boolean {
  try {
    return !!String(sessionStorage.getItem(HANDOFF_ERROR_KEY) || "").trim();
  } catch {
    return false;
  }
}

export function clearHandoffNavigation() {
  try {
    sessionStorage.removeItem(HANDOFF_NAV_KEY);
  } catch {
    /* ignore */
  }
}
