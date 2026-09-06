const PYTHON_KEY = "vaptvue_fix_alert_python_seen";
const VERIFIED_KEY = "vaptvue_fix_alert_verified_seen";

function readFlag(key) {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeFlag(key) {
  try {
    localStorage.setItem(key, "1");
  } catch {
    /* ignore */
  }
}

export function hasSeenPythonInstallAlert() {
  return readFlag(PYTHON_KEY);
}

export function markPythonInstallAlertSeen() {
  writeFlag(PYTHON_KEY);
}

export function hasSeenVaptfixVerifiedAlert() {
  return readFlag(VERIFIED_KEY);
}

export function markVaptfixVerifiedAlertSeen() {
  writeFlag(VERIFIED_KEY);
}
