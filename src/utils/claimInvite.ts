/** Super-admin report-claim magic link: /home?invite=<token> or /signup?invite=<token> */

const CLAIM_INVITE_TOKEN_KEY = "vaptfix_claim_invite_token";
const CLAIM_INVITE_VALID_KEY = "vaptfix_claim_invite_valid";
const CLAIM_INVITE_REPORT_COUNT_KEY = "vaptfix_claim_invite_report_count";

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
  return pickQueryValue(query.invite);
}

function truthyFlag(value: unknown): boolean {
  if (value === true || value === 1) return true;
  const raw = String(value || "").trim().toLowerCase();
  return raw === "true" || raw === "1" || raw === "yes" || raw === "valid";
}

function falsyFlag(value: unknown): boolean {
  if (value === false || value === 0) return true;
  const raw = String(value || "").trim().toLowerCase();
  return raw === "false" || raw === "0" || raw === "no" || raw === "invalid" || raw === "expired";
}

/** Backend said this token is expired/invalid — not a network/404 miss. */
export function isExplicitInviteExpired(data: Record<string, unknown> | null | undefined, httpStatus?: number): boolean {
  const payload = data && typeof data === "object" ? data : {};
  if (httpStatus === 410) return true;
  if (payload.expired === true || payload.is_expired === true) return true;
  if (falsyFlag(payload.valid) || falsyFlag(payload.is_valid)) return true;
  const msg = String(payload.message || payload.detail || payload.error || "").toLowerCase();
  return /invite.{0,24}expir|link.{0,24}expir|token.{0,24}expir|expired invite/.test(msg);
}

export function isInvitePayloadValid(data: Record<string, unknown> | null | undefined): boolean {
  const payload = data && typeof data === "object" ? data : {};
  if (isExplicitInviteExpired(payload)) return false;
  if (truthyFlag(payload.valid) || truthyFlag(payload.is_valid)) return true;
  if (payload.success === true || payload.status === true) return true;
  if (Number(payload.report_count ?? payload.reports_count ?? payload.count) > 0) return true;
  // HTTP 200 without an explicit expiry means the magic link is still usable.
  return true;
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

/** True while a super-admin magic link is in progress (report already uploaded). */
export function isClaimInviteFlow(): boolean {
  if (!hasClaimInviteToken()) return false;
  return readStorage(CLAIM_INVITE_VALID_KEY) !== "false";
}

export function clearClaimInvite() {
  removeStorage(CLAIM_INVITE_TOKEN_KEY);
  removeStorage(CLAIM_INVITE_VALID_KEY);
  removeStorage(CLAIM_INVITE_REPORT_COUNT_KEY);
}

/**
 * Super-admin already uploaded the file on the magic link → Add Users.
 */
export function getClaimInviteSignupRedirect(_isSlackOrTeams = false): string {
  return "/communication";
}
