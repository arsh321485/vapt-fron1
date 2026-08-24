const STORAGE_KEY = "vaptfix_teams_deep_link";

function firstNonEmpty(values) {
  for (const value of values) {
    const text = String(value || "").trim();
    if (text) return text;
  }
  return "";
}

function pickFromObjects(objects, keys) {
  for (const obj of objects) {
    if (!obj || typeof obj !== "object") continue;
    for (const key of keys) {
      const text = String(obj[key] || "").trim();
      if (text) return text;
    }
  }
  return "";
}

export function extractTeamsDeepLink(payload = {}) {
  const nested = payload?.data && typeof payload.data === "object" ? payload.data : {};
  const team = payload?.vaptfix_team || nested?.vaptfix_team || payload?.team || {};
  const sources = [payload, nested, team, nested?.vaptfix_team];
  return {
    status: String(
      payload.status || nested.status || team.status || "",
    ).toLowerCase(),
    teams_tab_url: pickFromObjects(sources, ["teams_tab_url"]),
    teams_tab_url_alt: pickFromObjects(sources, ["teams_tab_url_alt"]),
    teams_desktop_url: pickFromObjects(sources, ["teams_desktop_url"]),
    teams_url: pickFromObjects(sources, ["teams_url"]),
  };
}

export function persistTeamsDeepLink(links) {
  if (!links || typeof links !== "object") return;
  try {
    const current = readStoredTeamsDeepLink();
    const next = {
      ...current,
      ...links,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (next.teams_tab_url) localStorage.setItem("teams_tab_url", next.teams_tab_url);
    if (next.teams_desktop_url) {
      localStorage.setItem("teams_desktop_url", next.teams_desktop_url);
    }
  } catch {
    /* ignore */
  }
}

export function readStoredTeamsDeepLink() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return extractTeamsDeepLink(parsed);
    }
  } catch {
    /* ignore */
  }
  return extractTeamsDeepLink({
    teams_tab_url: localStorage.getItem("teams_tab_url"),
    teams_desktop_url: localStorage.getItem("teams_desktop_url"),
  });
}

export function isBareTeamsHome(url) {
  try {
    const parsed = new URL(String(url || ""));
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "teams.microsoft.com" && host !== "teams.cloud.microsoft") return false;
    const path = parsed.pathname.replace(/\/+$/, "") || "/";
    return path === "/";
  } catch {
    return false;
  }
}

export function isChannelSpecificTeamsUrl(url) {
  const value = String(url || "");
  if (!value || isBareTeamsHome(value)) return false;
  return /\/l\/channel\//i.test(value) || /\/l\/entity\//i.test(value);
}

export function pickTeamsWebUrl(links) {
  return firstNonEmpty([
    links?.teams_tab_url,
    links?.teams_tab_url_alt,
    links?.teams_url,
  ]);
}

export function pickTeamsRedirectUrl(links, { preferDesktop = false } = {}) {
  if (preferDesktop) {
    const desktop = String(links?.teams_desktop_url || "").trim();
    if (desktop) return desktop;
  }
  return firstNonEmpty([
    pickTeamsWebUrl(links),
    links?.teams_desktop_url,
  ]);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * already_exists → channel URL immediately.
 * provisioning → poll until /l/channel/ URL appears, then generic team URL as last resort.
 */
export async function resolveTeamsAdminDashboardUrl(payload, fetchStatus) {
  const first = extractTeamsDeepLink(payload);
  persistTeamsDeepLink(first);
  const immediate = pickTeamsRedirectUrl(first);
  if (first.status !== "provisioning" && immediate && !isBareTeamsHome(immediate)) {
    return immediate;
  }

  if (typeof fetchStatus === "function") {
    for (let i = 0; i < 10; i += 1) {
      await sleep(3000);
      const nextPayload = await fetchStatus();
      const next = extractTeamsDeepLink(nextPayload || {});
      persistTeamsDeepLink(next);
      const url = pickTeamsRedirectUrl(next);
      if (isChannelSpecificTeamsUrl(url)) return url;
      if (next.status && next.status !== "provisioning" && url && !isBareTeamsHome(url)) {
        return url;
      }
    }
  }

  const fallback = pickTeamsRedirectUrl(readStoredTeamsDeepLink()) || immediate;
  if (fallback && !isBareTeamsHome(fallback)) return fallback;
  return "";
}

export function openTeamsAdminDashboard(url) {
  const target = String(url || "").trim();
  if (!target || isBareTeamsHome(target)) return false;
  window.open(target, "_blank", "noopener");
  return true;
}
