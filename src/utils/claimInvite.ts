/** Super-admin report-claim magic link: /home?invite=<token> */

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

export function storeClaimInviteToken(token: string) {
  const value = String(token || "").trim();
  if (!value) return;
  try {
    sessionStorage.setItem(CLAIM_INVITE_TOKEN_KEY, value);
  } catch {
    /* ignore */
  }
}

export function readClaimInviteToken(): string {
  try {
    return (sessionStorage.getItem(CLAIM_INVITE_TOKEN_KEY) || "").trim();
  } catch {
    return "";
  }
}

export function setClaimInviteValid(valid: boolean) {
  try {
    sessionStorage.setItem(CLAIM_INVITE_VALID_KEY, valid ? "true" : "false");
  } catch {
    /* ignore */
  }
}

export function isClaimInviteValid(): boolean {
  try {
    return sessionStorage.getItem(CLAIM_INVITE_VALID_KEY) === "true";
  } catch {
    return false;
  }
}

export function clearClaimInvite() {
  try {
    sessionStorage.removeItem(CLAIM_INVITE_TOKEN_KEY);
    sessionStorage.removeItem(CLAIM_INVITE_VALID_KEY);
  } catch {
    /* ignore */
  }
}

/** After magic-link signup, skip upload/onboarding — report is already assigned. */
export function getClaimInviteSignupRedirect(): string {
  if (isClaimInviteValid() && readClaimInviteToken()) return "/admindashboardonboarding";
  return "/admin-upload-report";
}
