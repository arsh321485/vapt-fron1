/** Super-admin report-claim magic link: /home?invite=<token> or /signup?invite=<token> */

const CLAIM_INVITE_TOKEN_KEY = "vaptfix_claim_invite_token";
const CLAIM_INVITE_VALID_KEY = "vaptfix_claim_invite_valid";
const CLAIM_INVITE_REPORT_COUNT_KEY = "vaptfix_claim_invite_report_count";
const CLAIM_INVITE_SIGNED_UP_KEY = "vaptfix_claim_invite_signed_up";

function pickQueryValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) {
    const first = value[0];
    if (first === null || first === undefined) return "";
    return String(first).trim();
  }
  return String(value).trim();
}

export function extractClaimInviteToken(query: Record<string, unknown> = {}): string {
  return pickQueryValue(query.invite) || pickQueryValue(query.token);
}

function truthyFlag(value: unknown): boolean {
  if (value === true || value === 1) return true;
  const raw = String(value || "").trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes" || raw === "valid";
}

function unwrapInvitePayload(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== "object" || Array.isArray(data)) return {};
  const root = data as Record<string, unknown>;
  const nested = root.data || root.invite || root.result || root.payload;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return { ...root, ...(nested as Record<string, unknown>) };
  }
  return root;
}

function falsyFlag(value: unknown): boolean {
  if (value === false || value === 0) return true;
  const raw = String(value || "").trim().toLowerCase();
  return raw === "false" || raw === "0" || raw === "no" || raw === "invalid" || raw === "expired";
}

function readRawValidFlag(payload: Record<string, unknown>): boolean | null {
  const raw = payload.valid ?? payload.is_valid ?? payload.isValid;
  if (raw === false || raw === 0) return false;
  if (typeof raw === "string" && raw.trim().toLowerCase() === "false") return false;
  if (raw === true || raw === 1) return true;
  if (typeof raw === "string" && ["true", "1", "yes", "valid"].includes(raw.trim().toLowerCase())) {
    return true;
  }
  return null;
}

/** Backend: { valid: true, report_count: N } | { valid: false }. Nested `data` is also accepted. */
export function parseClaimInviteValidate(data: unknown): {
  valid: boolean;
  expired: boolean;
  report_count: number;
} {
  const payload = unwrapInvitePayload(data);
  const flag = readRawValidFlag(payload);
  const report_count = Number(payload.report_count ?? payload.reports_count ?? payload.count) || 0;

  // Only an explicit valid:false is expired. Missing `valid` must not show the banner.
  if (flag === false) {
    return { valid: false, expired: true, report_count: 0 };
  }
  return { valid: true, expired: false, report_count: report_count || 1 };
}

/** Backend said this token is expired/invalid — not a network/404 miss. */
export function isExplicitInviteExpired(data: unknown, httpStatus?: number): boolean {
  const payload = unwrapInvitePayload(data);
  if (payload.expired === false || payload.is_expired === false) return false;
  if (String(payload.expired || "").toLowerCase() === "false") return false;
  if (String(payload.is_expired || "").toLowerCase() === "false") return false;
  if (httpStatus === 410) return true;
  if (truthyFlag(payload.expired) || truthyFlag(payload.is_expired)) return true;
  if (falsyFlag(payload.valid) || falsyFlag(payload.is_valid)) return true;
  const msg = String(payload.message || payload.detail || payload.error || "").toLowerCase();
  return /invite.{0,24}expir|link.{0,24}expir|token.{0,24}expir|expired invite/.test(msg);
}

export function isInvitePayloadValid(data: unknown, httpStatus?: number): boolean {
  const payload = unwrapInvitePayload(data);
  if (isExplicitInviteExpired(payload, httpStatus)) return false;
  if (truthyFlag(payload.valid) || truthyFlag(payload.is_valid)) return true;
  if (payload.success === true || payload.status === true) return true;
  if (Number(payload.report_count ?? payload.reports_count ?? payload.count) > 0) return true;
  // HTTP 200 without an explicit expiry means the magic link is still usable.
  return httpStatus == null || (httpStatus >= 200 && httpStatus < 300);
}

export function readInviteReportCount(data: unknown): number {
  const payload = unwrapInvitePayload(data);
  return Number(payload.report_count ?? payload.reports_count ?? payload.count) || 0;
}

function writeStorage(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function readStorage(key: string): string {
  try {
    const sessionValue = (sessionStorage.getItem(key) || "").trim();
    if (sessionValue) return sessionValue;
  } catch {
    /* ignore */
  }
  try {
    return (localStorage.getItem(key) || "").trim();
  } catch {
    return "";
  }
}

function removeStorage(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Invite is active only when the address bar actually has ?invite= or ?token=. */
export function readLiveMagicInvite(query: Record<string, unknown> = {}): string {
  let fromWindow = "";
  if (typeof window !== "undefined") {
    try {
      const search = new URLSearchParams(window.location.search);
      fromWindow = (search.get("invite") || search.get("token") || "").trim();
    } catch {
      fromWindow = "";
    }
  }
  if (fromWindow) return fromWindow;
  return extractClaimInviteToken(query);
}

/** Live URL first, then the token stored after validate (needed if the query is stripped). */
export function resolveClaimInviteToken(query: Record<string, unknown> = {}): string {
  return readLiveMagicInvite(query) || readClaimInviteToken();
}

export function storeClaimInviteToken(token: string) {
  const value = String(token || "").trim();
  if (!value) return;
  writeStorage(CLAIM_INVITE_TOKEN_KEY, value);
}

export function readClaimInviteToken(): string {
  return readStorage(CLAIM_INVITE_TOKEN_KEY);
}

export function setClaimInviteValid(valid: boolean) {
  writeStorage(CLAIM_INVITE_VALID_KEY, valid ? "true" : "false");
}

export function setClaimInviteReportCount(count: number) {
  const n = Number(count) || 0;
  writeStorage(CLAIM_INVITE_REPORT_COUNT_KEY, n > 0 ? String(n) : "0");
}

export function getClaimInviteReportCount(): number {
  return Number(readStorage(CLAIM_INVITE_REPORT_COUNT_KEY)) || 0;
}

/** Super admin already attached a scan file on this magic link. */
export function hasClaimInviteReport(): boolean {
  return isClaimInviteFlow() && getClaimInviteReportCount() > 0;
}

export function isClaimInviteValid(): boolean {
  return readStorage(CLAIM_INVITE_VALID_KEY) === "true";
}

export function hasClaimInviteToken(): boolean {
  return !!readClaimInviteToken();
}

/** Set only after a successful signup that used a live magic-link invite_token. */
export function markClaimInviteSignup() {
  writeStorage(CLAIM_INVITE_SIGNED_UP_KEY, "1");
}

export function didClaimInviteSignup(): boolean {
  return readStorage(CLAIM_INVITE_SIGNED_UP_KEY) === "1";
}

/**
 * Skip file upload only for a live magic link or after signup with that invite.
 * Leftover tokens from an earlier visit must not skip Provide Scope.
 */
export function isClaimInviteFlow(): boolean {
  if (didClaimInviteSignup()) return true;
  if (readLiveMagicInvite()) return true;
  if (!hasClaimInviteToken()) return false;
  return readStorage(CLAIM_INVITE_VALID_KEY) !== "false";
}

export function clearClaimInvite() {
  removeStorage(CLAIM_INVITE_TOKEN_KEY);
  removeStorage(CLAIM_INVITE_VALID_KEY);
  removeStorage(CLAIM_INVITE_REPORT_COUNT_KEY);
  removeStorage(CLAIM_INVITE_SIGNED_UP_KEY);
}

/**
 * Super-admin already uploaded the file on the magic link → Add Users.
 */
export function getClaimInviteSignupRedirect(_isSlackOrTeams = false): string {
  return "/communication";
}
