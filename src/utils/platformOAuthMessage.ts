/** Admin Slack/Teams popup postMessage — one account cannot use both platforms. */

const SLACK_TYPES = new Set(["slack-auth-success", "SLACK_AUTH_SUCCESS", "SLACK_CONNECTED"]);
const TEAMS_TYPES = new Set(["TEAMS_CONNECTED"]);

let lastErrorAt = 0;
let lastErrorText = "";

function payloadType(data: unknown): string {
  if (!data || typeof data !== "object") return "";
  return String((data as { type?: unknown }).type || "");
}

export function isAdminPlatformOAuthEvent(data: unknown): boolean {
  const type = payloadType(data);
  return SLACK_TYPES.has(type) || TEAMS_TYPES.has(type);
}

/** Backend conflict/error text, or empty when the popup completed successfully. */
export function readAdminPlatformOAuthError(data: unknown): string {
  if (!isAdminPlatformOAuthEvent(data)) return "";
  const payload = data as Record<string, unknown>;
  if (payload.success === true || payload.success === "true") return "";

  const conflict = payload.platform_conflict === true || payload.platform_conflict === "true";
  const failed = payload.success === false || payload.success === "false";
  if (!failed && !conflict) return "";

  const text = String(
    payload.error || payload.message || payload.detail || payload.error_description || "",
  ).trim();
  if (text) return text;
  return "This account is already connected to another platform. Use the connected platform to sign in.";
}

/** First listener wins so Header + modal do not stack two toasts. */
export function consumeAdminPlatformOAuthError(data: unknown): string {
  const error = readAdminPlatformOAuthError(data);
  if (!error) return "";
  const now = Date.now();
  if (error === lastErrorText && now - lastErrorAt < 1500) return "";
  lastErrorAt = now;
  lastErrorText = error;
  return error;
}
