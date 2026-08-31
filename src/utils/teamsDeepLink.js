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
  const links = {
    status: String(
      payload.status || nested.status || team.status || "",
    ).toLowerCase(),
    teams_tab_url: pickFromObjects(sources, ["teams_tab_url", "teamsTabUrl"]),
    teams_tab_url_alt: pickFromObjects(sources, ["teams_tab_url_alt", "teamsTabUrlAlt"]),
    teams_desktop_url: pickFromObjects(sources, ["teams_desktop_url", "teamsDesktopUrl"]),
    teams_url: pickFromObjects(sources, ["teams_url", "teamsUrl"]),
  };
  const fromChannels = collectChannelUrls(payload);
  const dashboard = fromChannels.find((url) => isAdminDashboardChannelUrl(url));
  if (dashboard) {
    links.teams_tab_url = dashboard;
  } else if (!isChannelSpecificTeamsUrl(links.teams_tab_url)) {
    const channel = fromChannels.find((url) => isChannelSpecificTeamsUrl(url));
    if (channel) links.teams_tab_url = channel;
  }
  return links;
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
    if (path === "/" || path === "/v2" || /^\/v2(\/|$)/i.test(path)) return true;
    if (/^\/(welcome|campaigns|calendar|calls|files)(\/|$)/i.test(path)) return true;
    return false;
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
    /\/conversations/i.test(value) ||
    /\/l\/message\//i.test(value)
  );
}

export function isChannelSpecificTeamsUrl(url) {
  const value = String(url || "");
  if (!value || isBareTeamsHome(value) || isTeamsChatOrTeamHomeUrl(value)) return false;
  return /\/l\/channel\//i.test(value);
}

function decodedUrl(url) {
  try {
    return decodeURIComponent(String(url || ""));
  } catch {
    return String(url || "");
  }
}

function isAdminDashboardChannelUrl(url) {
  if (!isChannelSpecificTeamsUrl(url)) return false;
  return /admin\s*dashboard/i.test(decodedUrl(url));
}

function collectChannelUrls(payload = {}) {
  const urls = [];
  const push = (value) => {
    const text = String(value || "").trim();
    if (text) urls.push(text);
  };
  const walkChannels = (channels) => {
    if (!Array.isArray(channels)) return;
    for (const ch of channels) {
      if (!ch || typeof ch !== "object") continue;
      push(ch.webUrl || ch.web_url || ch.teams_tab_url || ch.teams_url || ch.url);
    }
  };
  const sources = collectLinkSources(payload);
  for (const obj of sources) {
    walkChannels(obj?.channels);
    walkChannels(obj?.vaptfix_team?.channels);
  }
  try {
    walkChannels(JSON.parse(localStorage.getItem("vaptfix_channels") || "[]"));
  } catch {
    /* ignore */
  }
  return urls;
}

/** Exact "vaptfix admin dashboard" channel link from the login API. Never a Chat-tab URL. */
export function pickTeamsTabUrl(links) {
  const payload = links && typeof links === "object" ? links : {};
  const fieldCandidates = [
    payload.teams_tab_url,
    payload.teams_tab_url_alt,
    payload.teams_url,
    payload.teams_desktop_url,
  ];
  const all = [...fieldCandidates, ...collectChannelUrls(payload)];
  const dashboard = all.find((url) => isAdminDashboardChannelUrl(url));
  if (dashboard) return dashboard;
  const channel = all.find((url) => isChannelSpecificTeamsUrl(url));
  if (channel) return channel;
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
    for (let i = 0; i < 15; i += 1) {
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

export function openTeamsOAuthPopup(authUrl) {
  const target = String(authUrl || "").trim();
  if (!target) return null;
  const width = 1000;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const popup = window.open(
    target,
    "TeamsOAuth",
    `width=${width},height=${height},left=${left},top=${top}`,
  );
  if (!popup) {
    alert("Popup blocked! Please allow popups for this site.");
    return null;
  }
  return popup;
}
