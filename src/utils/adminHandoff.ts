import Swal from "sweetalert2";
import {
  openTeamsAdminDashboard,
  pickTeamsTabUrl,
  readStoredTeamsDeepLink,
} from "@/utils/teamsDeepLink";

const HANDOFF_ERROR_KEY = "vaptfix_handoff_error";
const HANDOFF_NAV_KEY = "vaptfix_handoff_nav";
const HANDOFF_SOURCE_KEY = "vaptfix_chat_handoff_source";

export type ChatHandoffSource = "teams" | "slack";

function pickQueryValue(query: Record<string, unknown> | undefined, key: string): string {
  if (!query) return "";
  const raw = query[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return String(value || "").trim();
}

export function readQueryAdminToken(query: Record<string, unknown> | undefined): string {
  return pickQueryValue(query, "admin_token");
}

/** Capture source=teams|slack from handoff links (survives Stripe + multi-step wizard). */
export function captureChatHandoffSource(query?: Record<string, unknown>): ChatHandoffSource | "" {
  const raw = pickQueryValue(query, "source").toLowerCase();
  const source: ChatHandoffSource | "" =
    raw === "teams" || raw === "microsoft_teams" || raw === "ms_teams"
      ? "teams"
      : raw === "slack"
        ? "slack"
        : "";
  if (!source) return readChatHandoffSource();
  try {
    sessionStorage.setItem(HANDOFF_SOURCE_KEY, source);
  } catch {
    /* ignore */
  }
  return source;
}

export function readChatHandoffSource(): ChatHandoffSource | "" {
  try {
    const raw = String(sessionStorage.getItem(HANDOFF_SOURCE_KEY) || "")
      .trim()
      .toLowerCase();
    if (raw === "teams" || raw === "microsoft_teams" || raw === "ms_teams") return "teams";
    if (raw === "slack") return "slack";
  } catch {
    /* ignore */
  }
  return "";
}

export function clearChatHandoffSource() {
  try {
    sessionStorage.removeItem(HANDOFF_SOURCE_KEY);
  } catch {
    /* ignore */
  }
}

function platformLabel(source: ChatHandoffSource): string {
  return source === "slack" ? "Slack" : "Microsoft Teams";
}

function resolveSlackOpenUrl(): string {
  try {
    const raw = localStorage.getItem("slack_team");
    if (raw) {
      const team = JSON.parse(raw);
      if (team?.url) return String(team.url);
      if (team?.domain) return `https://${team.domain}.slack.com`;
    }
  } catch {
    /* ignore */
  }
  const teamId = String(localStorage.getItem("slack_team_id") || "").trim();
  if (teamId) return `https://app.slack.com/client/${teamId}`;
  return "https://app.slack.com/client";
}

function openChatPlatform(source: ChatHandoffSource) {
  if (source === "slack") {
    window.open(resolveSlackOpenUrl(), "_blank", "noopener,noreferrer");
    return;
  }
  const stored = pickTeamsTabUrl(readStoredTeamsDeepLink());
  if (stored && openTeamsAdminDashboard(stored, { newTab: true })) return;
  // Never open bare teams.cloud.microsoft — that restores Chat tab.
  void Swal.fire({
    icon: "info",
    title: "Open Microsoft Teams",
    text: "Your VaptFix channel link is not ready yet. Open Microsoft Teams manually and go to VaptFix → vaptfix admin dashboard.",
    confirmButtonText: "OK",
    confirmButtonColor: "#241447",
  });
}

/**
 * After Freemium or paid checkout completes for a Teams/Slack bot handoff.
 * Returns true if the user chose to open Teams/Slack.
 */
export async function maybeShowReturnToChatPlatformPopup(): Promise<boolean> {
  const source = readChatHandoffSource();
  if (!source) return false;

  const platform = platformLabel(source);
  const result = await Swal.fire({
    icon: "success",
    title: "You're all set!",
    html: `Head back to <strong>${platform}</strong> to see your dashboard and start fixing vulnerabilities.`,
    confirmButtonText: `Open ${platform}`,
    showCancelButton: true,
    cancelButtonText: "Continue on the website instead",
    confirmButtonColor: "#241447",
    cancelButtonColor: "#64748b",
    allowOutsideClick: false,
    allowEscapeKey: true,
    reverseButtons: true,
  });

  clearChatHandoffSource();

  if (result.isConfirmed) {
    openChatPlatform(source);
    return true;
  }
  return false;
}

export function storeHandoffError(message: string) {
  try {
    sessionStorage.setItem(HANDOFF_ERROR_KEY, String(message || "").trim());
  } catch {
    /* ignore */
  }
}

export function consumeHandoffError(): string {
  try {
    const message = String(sessionStorage.getItem(HANDOFF_ERROR_KEY) || "").trim();
    sessionStorage.removeItem(HANDOFF_ERROR_KEY);
    return message;
  } catch {
    return "";
  }
}

export function markHandoffNavigation(path: string) {
  try {
    sessionStorage.setItem(HANDOFF_NAV_KEY, String(path || "").trim());
  } catch {
    /* ignore */
  }
}

export function isHandoffNavigation(path: string): boolean {
  try {
    return sessionStorage.getItem(HANDOFF_NAV_KEY) === String(path || "").trim();
  } catch {
    return false;
  }
}

export function hasHandoffError(): boolean {
  try {
    return !!String(sessionStorage.getItem(HANDOFF_ERROR_KEY) || "").trim();
  } catch {
    return false;
  }
}

export function clearHandoffNavigation() {
  try {
    sessionStorage.removeItem(HANDOFF_NAV_KEY);
  } catch {
    /* ignore */
  }
}
