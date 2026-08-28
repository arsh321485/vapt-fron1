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

function collectLinkSources(payload = {}) {
  const nested = payload?.data && typeof payload.data === "object" ? payload.data : {};
  const result = payload?.result && typeof payload.result === "object" ? payload.result : {};
  const nestedResult = nested?.result && typeof nested.result === "object" ? nested.result : {};
  const team = payload?.vaptfix_team || nested?.vaptfix_team || payload?.team || nested?.team || {};
  const links = payload?.links || nested?.links || result?.links || {};
  return [payload, nested, result, nestedResult, team, nested?.vaptfix_team, links];
}

export function extractTeamsDeepLink(payload = {}) {
  const sources = collectLinkSources(payload);
  const nested = payload?.data && typeof payload.data === "object" ? payload.data : {};
  const team = payload?.vaptfix_team || nested?.vaptfix_team || payload?.team || {};
  return {
    status: String(
      payload.status || nested.status || team.status || "",
    ).toLowerCase(),
    teams_tab_url: pickFromObjects(sources, ["teams_tab_url", "teamsTabUrl"]),
    teams_tab_url_alt: pickFromObjects(sources, ["teams_tab_url_alt", "teamsTabUrlAlt"]),
    teams_desktop_url: pickFromObjects(sources, ["teams_desktop_url", "teamsDesktopUrl"]),
    teams_url: pickFromObjects(sources, ["teams_url", "teamsUrl"]),
  };
}

export function persistTeamsDeepLink(links) {
  if (!links || typeof links !== "object") return;
  try {
    const current = readStoredTeamsDeepLink();
    const next = { ...current };
    ["status", "teams_tab_url", "teams_tab_url_alt", "teams_desktop_url", "teams_url"].forEach(
      (key) => {
        const value = String(links[key] || "").trim();
        if (value) next[key] = value;
      },
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    if (next.teams_tab_url) localStorage.setItem("teams_tab_url", next.teams_tab_url);
    if (next.teams_tab_url_alt) {
      localStorage.setItem("teams_tab_url_alt", next.teams_tab_url_alt);
    }
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
    teams_tab_url_alt: localStorage.getItem("teams_tab_url_alt"),
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

export function isTeamsChatOrTeamHomeUrl(url) {
  const value = String(url || "");
  if (!value) return false;
  return (
    /\/l\/chat\//i.test(value) ||
    /\/l\/team\//i.test(value) ||
    /\/conversations/i.test(value)
  );
}

export function isChannelSpecificTeamsUrl(url) {
  const value = String(url || "");
  if (!value || isBareTeamsHome(value) || isTeamsChatOrTeamHomeUrl(value)) return false;
  return /\/l\/channel\//i.test(value) || /\/l\/entity\//i.test(value);
}

/** Exact "vaptfix admin dashboard" channel link from the login API. Never a Chat-tab URL. */
export function pickTeamsTabUrl(links) {
  const tab = firstNonEmpty([links?.teams_tab_url, links?.teams_tab_url_alt]);
  if (tab && !isBareTeamsHome(tab) && !isTeamsChatOrTeamHomeUrl(tab)) return tab;
  const altChannel = firstNonEmpty([links?.teams_url, links?.teams_desktop_url]);
  if (isChannelSpecificTeamsUrl(altChannel)) return altChannel;
  return "";
}

export function pickTeamsWebUrl(links) {
  return pickTeamsTabUrl(links);
}

export function pickTeamsRedirectUrl(links, { preferDesktop = false } = {}) {
  const tab = pickTeamsTabUrl(links);
  if (tab) return tab;
  if (preferDesktop) {
    const desktop = String(links?.teams_desktop_url || "").trim();
    if (desktop && isChannelSpecificTeamsUrl(desktop)) return desktop;
  }
  return "";
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Login response teams_tab_url is the dashboard channel.
 * Poll only if that field is still missing (provisioning).
 */
export async function resolveTeamsAdminDashboardUrl(payload, fetchStatus) {
  const first = extractTeamsDeepLink(payload);
  persistTeamsDeepLink(first);
  const immediate = pickTeamsTabUrl(first);
  if (immediate) return immediate;

  if (typeof fetchStatus === "function") {
    for (let i = 0; i < 10; i += 1) {
      await sleep(3000);
      const nextPayload = await fetchStatus();
      const next = extractTeamsDeepLink(nextPayload || {});
      persistTeamsDeepLink(next);
      const url = pickTeamsTabUrl(next);
      if (url) return url;
    }
  }

  return pickTeamsTabUrl(readStoredTeamsDeepLink()) || immediate || "";
}

export function openTeamsAdminDashboard(url) {
  const target = String(url || "").trim();
  if (!target || isBareTeamsHome(target) || isTeamsChatOrTeamHomeUrl(target)) return false;
  window.location.href = target;
  return true;
}

/** Login/status payload → vaptfix admin dashboard channel. */
export function redirectToTeamsTabUrl(payload) {
  const links = extractTeamsDeepLink(payload || {});
  persistTeamsDeepLink(links);
  const url = pickTeamsTabUrl(links) || pickTeamsTabUrl(readStoredTeamsDeepLink());
  return openTeamsAdminDashboard(url);
}
