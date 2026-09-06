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

function isExplicitInviteExpired(data: unknown, httpStatus?: number): boolean {
  const payload = unwrapInvitePayload(data);
  if (payload.expired === false || payload.is_expired === false) return false;
  if (String(payload.expired || "").toLowerCase() === "false") return false;
  if (String(payload.is_expired || "").toLowerCase() === "false") return false;
  if (httpStatus === 410) return true;
  if (truthyFlag(payload.expired) || truthyFlag(payload.is_expired)) return true;
  const msg = String(payload.message || payload.detail || payload.error || "").toLowerCase();
  return /invite.{0,24}expir|link.{0,24}expir|token.{0,24}expir|expired invite/.test(msg);
}

function isInvitePayloadValid(data: unknown, httpStatus?: number): boolean {
  const payload = unwrapInvitePayload(data);
  if (isExplicitInviteExpired(payload, httpStatus)) return false;
  if (truthyFlag(payload.valid) || truthyFlag(payload.is_valid)) return true;
  if (payload.success === true || payload.status === true) return true;
  if (Number(payload.report_count ?? payload.reports_count ?? payload.count) > 0) return true;
  return httpStatus == null || (httpStatus >= 200 && httpStatus < 300);
}

/** Backend: { valid: true, report_count: N } | { valid: false, expired?: true }. Nested `data` is also accepted. */
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
  if (isExplicitInviteExpired(data, httpStatus)) {
    return { valid: false, expired: true, report_count: 0 };
  }
  const flag = readRawValidFlag(payload);
  const successHttp = httpStatus == null || (httpStatus >= 200 && httpStatus < 300);
  // HTTP 200 + { valid: false } = invite TTL ended. 4xx/5xx must not flash expired.
  if (successHttp && flag === false) {
    return { valid: false, expired: true, report_count: 0 };
  }
  const valid = isInvitePayloadValid(data, httpStatus);
  return { valid, expired: false, report_count: valid ? report_count || 1 : report_count };
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

export function isClaimInviteValid(): boolean {
  return readStorage(CLAIM_INVITE_VALID_KEY) === "true";
}

/** True while a super-admin magic link is in progress (report already uploaded). */
export function isClaimInviteFlow(): boolean {
  return isClaimInviteValid() && !!readClaimInviteToken();
}

export function clearClaimInvite() {
  removeStorage(CLAIM_INVITE_TOKEN_KEY);
  removeStorage(CLAIM_INVITE_VALID_KEY);
  removeStorage(CLAIM_INVITE_REPORT_COUNT_KEY);
}

/**
 * After magic-link signup the report is already assigned — skip upload/payment.
 * Email: add users, then risk criteria. Slack/Teams: skip add-users.
 */
export function getClaimInviteSignupRedirect(isSlackOrTeams = false): string {
  if (!isClaimInviteFlow()) return "/admin-upload-report";
  return isSlackOrTeams ? "/riskcriteria" : "/communication";
}
