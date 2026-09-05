import Swal from "sweetalert2";
import {
  openTeamsAdminDashboard,
  pickTeamsTabUrl,
  readStoredTeamsDeepLink,
  redirectToTeamsTabUrl,
} from "./teamsDeepLink";

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

export function hasChatHandoffSource(): boolean {
  return !!readChatHandoffSource();
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

function openSlackWorkspace() {
  try {
    const raw = localStorage.getItem("slack_team");
    if (raw) {
      const team = JSON.parse(raw);
      const url =
        String(team?.url || team?.workspace_url || team?.team_url || "").trim() ||
        (team?.domain
          ? `https://${String(team.domain).replace(/\.slack\.com$/i, "")}.slack.com`
          : "");
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        return true;
      }
    }
  } catch {
    /* ignore */
  }
  const teamId = String(localStorage.getItem("slack_team_id") || "").trim();
  if (teamId) {
    window.open(
      `https://app.slack.com/client/${encodeURIComponent(teamId)}`,
      "_blank",
      "noopener,noreferrer",
    );
    return true;
  }
  window.open("https://app.slack.com", "_blank", "noopener,noreferrer");
  return true;
}

function openChatPlatform(source: ChatHandoffSource) {
  if (source === "slack") {
    openSlackWorkspace();
    return;
  }
  if (redirectToTeamsTabUrl()) return;
  const stored = pickTeamsTabUrl(readStoredTeamsDeepLink());
  if (stored && openTeamsAdminDashboard(stored, { newTab: true })) return;
  window.open("https://teams.microsoft.com", "_blank", "noopener,noreferrer");
}

/**
 * After Freemium or paid checkout completes for a Teams/Slack bot handoff.
 * Page-agnostic: any flow that captured source=teams|slack shows this once.
 */
export async function maybeShowReturnToChatPlatformPopup(): Promise<boolean> {
  const source = readChatHandoffSource();
  if (!source) return false;

  const platform = platformLabel(source);
  const result = await Swal.fire({
    icon: "success",
    title: "You're all set!",
    html: `Head back to <strong>${platform}</strong> to see your dashboard and start fixing vulnerabilities.`,
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: `Open ${platform}`,
    cancelButtonText: "Continue on the website instead",
    confirmButtonColor: "#241447",
    cancelButtonColor: "#94a3b8",
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
