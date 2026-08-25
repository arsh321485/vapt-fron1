/** Manual / CSV scope: after plan + payment, stay on /communication until a scan report is uploaded. */

const SCOPE_AWAITING_SCAN_KEY = "vaptfix_scope_awaiting_scan";

function writeFlag(value: string) {
  try {
    sessionStorage.setItem(SCOPE_AWAITING_SCAN_KEY, value);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(SCOPE_AWAITING_SCAN_KEY, value);
  } catch {
    /* ignore */
  }
}

function readFlag(): string {
  try {
    const sessionValue = (sessionStorage.getItem(SCOPE_AWAITING_SCAN_KEY) || "").trim();
    if (sessionValue) return sessionValue;
  } catch {
    /* ignore */
  }
  try {
    return (localStorage.getItem(SCOPE_AWAITING_SCAN_KEY) || "").trim();
  } catch {
    return "";
  }
}

function removeFlag() {
  try {
    sessionStorage.removeItem(SCOPE_AWAITING_SCAN_KEY);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(SCOPE_AWAITING_SCAN_KEY);
  } catch {
    /* ignore */
  }
}

export function markScopeAwaitingScan() {
  writeFlag("1");
}

export function clearScopeAwaitingScan() {
  removeFlag();
}

export function isScopeAwaitingScan(): boolean {
  return readFlag() === "1";
}

export const SCOPE_SCAN_REQUIRED_TITLE = "Upload a scan report first";
export const SCOPE_SCAN_REQUIRED_TEXT =
  "You are coming from the Management + Testing plan. The super admin needs to upload a file first before you can continue.";
