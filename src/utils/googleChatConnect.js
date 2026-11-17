export const GOOGLE_CHAT_INSTALL_MESSAGE =
  "Ab Google Chat kholo, 'VaptFix' search karo, aur apne space me Add karo.";

const ALLOWED_ORIGINS = [
  "https://vaptbackend.secureitlab.com",
  "https://testbackend.vaptfix.ai",
  "https://vaptfix.ai",
];

export function isGoogleChatConnected() {
  return (
    localStorage.getItem("google_chat_connected") === "true" ||
    sessionStorage.getItem("google_chat_connected") === "true"
  );
}

export function rememberGoogleChatConnection(email) {
  localStorage.setItem("google_chat_connected", "true");
  sessionStorage.setItem("google_chat_connected", "true");
  const value = String(email || "").trim();
  if (!value) return;
  localStorage.setItem("google_chat_email", value);
  sessionStorage.setItem("google_chat_email", value);
}

export function parseGoogleChatConnectedMessage(data) {
  if (!data || data.type !== "GOOGLE_CHAT_CONNECTED") return null;
  const payload = data.payload && typeof data.payload === "object" ? data.payload : data;
  const success = payload.success === true || payload.success === "true";
  return {
    success,
    email: String(payload.google_chat_email || "").trim(),
    error: String(payload.error || payload.message || "").trim(),
    payload,
  };
}

function originAllowed(origin) {
  if (!origin) return false;
  if (origin === window.location.origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

/** Opens the Google OAuth popup and resolves when it connects, fails, or is closed. */
export function openGoogleChatConnectPopup(authUrl) {
  const popup = window.open(authUrl, "GoogleChatConnect", "width=500,height=650");
  if (!popup) {
    return Promise.resolve({ blocked: true });
  }

  return new Promise((resolve) => {
    const started = Date.now();
    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearInterval(timer);
      window.removeEventListener("message", onMessage);
      resolve(result);
    };
    const onMessage = (event) => {
      if (!originAllowed(event.origin)) return;
      const parsed = parseGoogleChatConnectedMessage(event.data);
      if (!parsed) return;
      finish(parsed);
    };
    const timer = setInterval(() => {
      const timedOut = Date.now() - started >= 120000;
      if (popup.closed || timedOut) finish({ closed: true });
    }, 400);
    window.addEventListener("message", onMessage);
  });
}
