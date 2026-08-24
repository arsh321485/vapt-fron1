/** Super-admin report-claim magic link: /home?invite=<token> or /signup?invite=<token> */

const CLAIM_INVITE_TOKEN_KEY = "vaptfix_claim_invite_token";
const CLAIM_INVITE_VALID_KEY = "vaptfix_claim_invite_valid";

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

export function isClaimInviteValid(): boolean {
  return readStorage(CLAIM_INVITE_VALID_KEY) === "true";
}

export function hasClaimInviteToken(): boolean {
  return !!readClaimInviteToken();
}

/** True while a super-admin magic link is in progress (report already uploaded). */
export function isClaimInviteFlow(): boolean {
  return isClaimInviteValid() && hasClaimInviteToken();
}

export function clearClaimInvite() {
  removeStorage(CLAIM_INVITE_TOKEN_KEY);
  removeStorage(CLAIM_INVITE_VALID_KEY);
}

/**
 * Magic-link signup: report is already assigned — skip upload and payment.
 * Always land on Add Users first.
 */
export function getClaimInviteSignupRedirect(_isSlackOrTeams = false): string {
  if (!hasClaimInviteToken()) return "/admin-upload-report";
  return "/communication";
}
