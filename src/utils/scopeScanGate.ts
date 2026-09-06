/** Manual / CSV scope: after plan + payment, stay on /communication until a scan report is uploaded. */

const SCOPE_AWAITING_SCAN_KEY = "vaptfix_scope_awaiting_scan";
const SCOPE_FILE_AWAITING_KEY = "vaptfix_scope_file_awaiting_superadmin";

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

export function readStoredAdminEmail(): string {
  try {
    const raw = sessionStorage.getItem("user") || localStorage.getItem("user") || "";
    const user = raw ? JSON.parse(raw) : null;
    return String(user?.email || user?.work_email || user?.Email || "")
      .trim()
      .toLowerCase();
  } catch {
    return "";
  }
}

type ScopeFileAwaitingPayload = {
  awaiting: boolean;
  email: string;
  at: number;
};

function readScopeFilePayload(): ScopeFileAwaitingPayload | null {
  try {
    const raw =
      sessionStorage.getItem(SCOPE_FILE_AWAITING_KEY) ||
      localStorage.getItem(SCOPE_FILE_AWAITING_KEY) ||
      "";
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    return {
      awaiting: data.awaiting === true || data.awaiting === "1",
      email: String(data.email || "").trim().toLowerCase(),
      at: Number(data.at) || 0,
    };
  } catch {
    return null;
  }
}

function writeScopeFilePayload(payload: ScopeFileAwaitingPayload) {
  const raw = JSON.stringify(payload);
  try {
    sessionStorage.setItem(SCOPE_FILE_AWAITING_KEY, raw);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(SCOPE_FILE_AWAITING_KEY, raw);
  } catch {
    /* ignore */
  }
}

/** Persist until Super Admin uploads the processed scan for this email. */
export function markScopeFileAwaitingSuperadmin(email = "") {
  writeScopeFilePayload({
    awaiting: true,
    email: String(email || readStoredAdminEmail()).trim().toLowerCase(),
    at: Date.now(),
  });
}

export function clearScopeFileAwaitingSuperadmin() {
  try {
    sessionStorage.removeItem(SCOPE_FILE_AWAITING_KEY);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(SCOPE_FILE_AWAITING_KEY);
  } catch {
    /* ignore */
  }
}

export function isScopeFileAwaitingSuperadmin(email = ""): boolean {
  const payload = readScopeFilePayload();
  if (!payload?.awaiting) return false;
  const now = String(email || readStoredAdminEmail()).trim().toLowerCase();
  if (payload.email && now && payload.email !== now) return false;
  return true;
}
