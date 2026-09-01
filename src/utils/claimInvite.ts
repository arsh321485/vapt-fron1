/** Super-admin report-claim magic link: /home?invite=<token> or /signup?invite=<token> */

const CLAIM_INVITE_TOKEN_KEY = "vaptfix_claim_invite_token";
const CLAIM_INVITE_VALID_KEY = "vaptfix_claim_invite_valid";
const CLAIM_INVITE_REPORT_COUNT_KEY = "vaptfix_claim_invite_report_count";
const CLAIM_INVITE_SIGNED_UP_KEY = "vaptfix_claim_invite_signed_up";
const CLAIMED_ADMIN_EMAIL_KEY = "vaptfix_claimed_admin_email";

function pickQueryValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) {
    const first = value[0];
    if (first === null || first === undefined) return "";
    return String(first).trim();
  }
  return String(value).trim();
}

/** Magic-link only. Never read ?token= — that belongs to User/Admin set-password emails. */
export function extractClaimInviteToken(query: Record<string, unknown> = {}): string {
  return pickQueryValue(query.invite);
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

function inviteExpiryText(payload: Record<string, unknown>): string {
  return [
    payload.message,
    payload.detail,
    payload.error,
    payload.reason,
    payload.code,
  ]
    .map((value) => String(value || "").trim().toLowerCase())
    .filter(Boolean)
    .join(" ");
}

function inviteExpiresAtPassed(payload: Record<string, unknown>): boolean {
  const raw = payload.expires_at || payload.expired_at || payload.expiry || payload.valid_until;
  if (!raw) return false;
  const ms = Date.parse(String(raw));
  return Number.isFinite(ms) && ms <= Date.now();
}

/**
 * Only a real 15-minute (or backend) expiry: HTTP 410, expired/is_expired,
 * expires_at in the past, or an expiry error code/message.
 * Do not treat valid:false, 404, or generic errors as expired.
 */
export function isExplicitInviteExpired(data: unknown, httpStatus?: number): boolean {
  const payload = unwrapInvitePayload(data);
  if (payload.expired === false || payload.is_expired === false) return false;
  if (String(payload.expired || "").toLowerCase() === "false") return false;
  if (String(payload.is_expired || "").toLowerCase() === "false") return false;
  if (httpStatus === 410) return true;
  if (truthyFlag(payload.expired) || truthyFlag(payload.is_expired)) return true;
  if (Number(payload.ttl_seconds) === 0 || Number(payload.seconds_left) === 0) return true;
  if (inviteExpiresAtPassed(payload)) return true;
  const text = inviteExpiryText(payload);
  if (!text) return false;
  return (
    text.includes("expired") ||
    text.includes("invite_expired") ||
    text.includes("token_expired") ||
    text.includes("no longer valid")
  );
}

/** Nested `data` is accepted. Expired banner only for real expiry, not every valid:false. */
export function parseClaimInviteValidate(
  data: unknown,
  httpStatus?: number,
): {
  valid: boolean;
  expired: boolean;
  report_count: number;
} {
  const payload = unwrapInvitePayload(data);
  const report_count = Number(payload.report_count ?? payload.reports_count ?? payload.count) || 0;
  const expired = isExplicitInviteExpired(payload, httpStatus);
  if (expired) {
    return { valid: false, expired: true, report_count: 0 };
  }
  const flag = readRawValidFlag(payload);
  if (flag === false) {
    return { valid: false, expired: false, report_count: report_count || 1 };
  }
  if (flag === true) {
    return { valid: true, expired: false, report_count: report_count || 1 };
  }
  return { valid: true, expired: false, report_count: report_count || 1 };
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
}

function readStorage(key: string): string {
  try {
    return (sessionStorage.getItem(key) || "").trim();
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

/** Invite is active only when the address bar has ?invite=. Set-password ?token= is a different flow. */
export function readLiveMagicInvite(query: Record<string, unknown> = {}): string {
  if (typeof window !== "undefined") {
    try {
      const search = new URLSearchParams(window.location.search);
      const live: Record<string, unknown> = {};
      search.forEach((value, key) => {
        live[key] = value;
      });
      const fromWindow = extractClaimInviteToken(live);
      if (fromWindow) return fromWindow;
    } catch {
      /* ignore */
    }
  }
  return extractClaimInviteToken(query);
}

/** Live URL first, then the token stored after the link was opened. */
export function resolveSignupInviteToken(query: Record<string, unknown> = {}): string {
  return (readLiveMagicInvite(query) || readClaimInviteToken()).trim();
}

try {
  localStorage.removeItem(CLAIM_INVITE_TOKEN_KEY);
  localStorage.removeItem(CLAIM_INVITE_VALID_KEY);
  localStorage.removeItem(CLAIM_INVITE_REPORT_COUNT_KEY);
  localStorage.removeItem(CLAIM_INVITE_SIGNED_UP_KEY);
} catch {
  /* ignore */
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

export function rememberClaimedAdminEmail(email: string) {
  const value = String(email || "").trim().toLowerCase();
  if (!value) return;
  const emails = readClaimedAdminEmails();
  if (!emails.includes(value)) emails.push(value);
  try {
    localStorage.setItem(CLAIMED_ADMIN_EMAIL_KEY, JSON.stringify(emails));
  } catch {
    /* ignore */
  }
}

function readClaimedAdminEmails(): string[] {
  try {
    const raw = localStorage.getItem(CLAIMED_ADMIN_EMAIL_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item || "").trim().toLowerCase()).filter(Boolean);
    }
    if (typeof parsed === "string" && parsed.trim()) return [parsed.trim().toLowerCase()];
  } catch {
    /* ignore */
  }
  return [];
}

/** True after logout when this email originally signed up via a magic-link claim. */
export function isReturningClaimedAdmin(email: string): boolean {
  const now = String(email || "").trim().toLowerCase();
  if (!now) return false;
  return readClaimedAdminEmails().includes(now);
}

/** Set only after a successful signup that used a live magic-link invite_token. */
export function markClaimInviteSignup(email?: string) {
  writeStorage(CLAIM_INVITE_SIGNED_UP_KEY, "1");
  rememberClaimedAdminEmail(email || "");
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
  return false;
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
