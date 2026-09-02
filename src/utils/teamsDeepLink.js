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
  const dashboard =
    buildAdminDashboardChannelUrl(payload) ||
    fromChannels.find((url) => isAdminDashboardChannelUrl(url)) ||
    (isAdminDashboardChannelUrl(links.teams_tab_url) ? links.teams_tab_url : "");
  if (dashboard) {
    links.teams_tab_url = toTeamsWebChannelUrl(dashboard) || dashboard;
  } else {
    links.teams_tab_url = "";
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

/** Official deep links must use this host. teams.cloud.microsoft address-bar URLs open the team channel list, not Posts. */
const TEAMS_DEEP_LINK_ORIGIN = "https://teams.microsoft.com";
const TEAMS_WEB_HOST = "teams.cloud.microsoft";

function decodedUrl(url) {
  try {
    return decodeURIComponent(String(url || ""));
  } catch {
    return String(url || "");
  }
}

/** Unwrap Microsoft desktop launcher so we can open the channel in the web client. */
export function unwrapTeamsLauncherUrl(url) {
  try {
    const parsed = new URL(String(url || ""));
    if (!/\/dl\/launcher/i.test(parsed.pathname)) return String(url || "").trim();
    const inner = parsed.searchParams.get("url") || "";
    if (!inner) return String(url || "").trim();
    let decoded = decodeURIComponent(inner).replace(/^\/_#/, "").replace(/^#/, "");
    if (/^https?:\/\//i.test(decoded)) return decoded;
    if (!decoded.startsWith("/")) decoded = `/${decoded}`;
    return `https://${TEAMS_WEB_HOST}${decoded}`;
  } catch {
    return String(url || "").trim();
  }
}

export function isBareTeamsHome(url) {
  try {
    const parsed = new URL(unwrapTeamsLauncherUrl(url) || url);
    const host = parsed.hostname.replace(/^www\./i, "").toLowerCase();
    if (host !== "teams.microsoft.com" && host !== TEAMS_WEB_HOST) return false;
    const path = parsed.pathname.replace(/\/+$/, "") || "/";
    if (/\/l\/channel\//i.test(parsed.pathname + parsed.hash)) return false;
    if (path === "/" || path === "/v2" || /^\/v2(\/|$)/i.test(path)) return true;
    if (/^\/(welcome|campaigns|calendar|calls|files)(\/|$)/i.test(path)) return true;
    return false;
  } catch {
    return false;
  }
}

export function isTeamsChatOrTeamHomeUrl(url) {
  const value = decodedUrl(unwrapTeamsLauncherUrl(url) || url);
  if (!value) return false;
  if (/\/l\/channel\//i.test(value) && !isVaptfixTeamDirectoryUrl(value)) return false;
  return /\/l\/chat\//i.test(value) || /\/l\/team\//i.test(value) || /\/l\/message\//i.test(value);
}

function channelNameFromDeepLink(url) {
  const value = decodedUrl(unwrapTeamsLauncherUrl(url) || url);
  const match = value.match(/\/l\/channel\/[^/]+\/([^/?#]+)/i);
  if (!match) return "";
  try {
    return decodeURIComponent(match[1]).replace(/\+/g, " ").trim();
  } catch {
    return String(match[1] || "").trim();
  }
}

/**
 * Team channel-directory page ("Vaptfix channels" + Show/Hide) — not a Posts view.
 * Backend sometimes sends /l/team/ or /l/channel/.../Vaptfix (team name, not a channel).
 */
export function isVaptfixTeamDirectoryUrl(url) {
  const value = decodedUrl(unwrapTeamsLauncherUrl(url) || url);
  if (!value) return false;
  if (/\/l\/team\//i.test(value)) return true;
  if (/[?&]ctx=team\b/i.test(value)) return true;
  const name = channelNameFromDeepLink(value);
  if (!name) return false;
  if (/admin\s*dashboard/i.test(name)) return false;
  if (/^vaptfix(\s+channels)?$/i.test(name)) return true;
  return false;
}

export function isChannelSpecificTeamsUrl(url) {
  const value = unwrapTeamsLauncherUrl(url) || String(url || "");
  if (!value || isBareTeamsHome(value) || isTeamsChatOrTeamHomeUrl(value)) return false;
  if (isVaptfixTeamDirectoryUrl(value)) return false;
  return /\/l\/channel\//i.test(decodedUrl(value));
}

function isAdminDashboardChannelUrl(url) {
  if (!isChannelSpecificTeamsUrl(url)) return false;
  return /admin\s*dashboard/i.test(decodedUrl(url)) || /admin\s*dashboard/i.test(channelNameFromDeepLink(url));
}

function parseChannelDeepLink(url) {
  const raw = unwrapTeamsLauncherUrl(url);
  if (!raw) return null;
  try {
    const parsed = new URL(raw, TEAMS_DEEP_LINK_ORIGIN);
    const decoded = decodedUrl(parsed.href);
    const match = decoded.match(/\/l\/channel\/([^/]+)\/([^/?#]+)/i);
    if (!match) return null;
    let channelId = match[1];
    let channelName = match[2];
    try {
      channelId = decodeURIComponent(channelId);
    } catch {
      /* keep */
    }
    try {
      channelName = decodeURIComponent(channelName.replace(/\+/g, " ")).trim();
    } catch {
      channelName = String(channelName || "").trim();
    }
    if (!normalizeChannelThreadId(channelId)) return null;
    return {
      channelId: normalizeChannelThreadId(channelId),
      channelName,
      groupId: parsed.searchParams.get("groupId") || "",
      tenantId: parsed.searchParams.get("tenantId") || "",
    };
  } catch {
    return null;
  }
}

/**
 * Official channel deep link (Microsoft docs).
 * Must be teams.microsoft.com/l/channel/{id}/{name}?groupId=&tenantId=
 * Rewriting to teams.cloud.microsoft lands on the "Vaptfix channels" list instead of Posts.
 */
function buildOfficialChannelDeepLink(channelId, channelName, groupId, tenantId) {
  const threadId = normalizeChannelThreadId(channelId);
  if (!threadId) return "";
  const name = /admin\s*dashboard/i.test(channelName || "")
    ? "vaptfix admin dashboard"
    : String(channelName || "vaptfix admin dashboard").trim() || "vaptfix admin dashboard";
  const params = new URLSearchParams();
  if (groupId) params.set("groupId", groupId);
  if (tenantId) params.set("tenantId", tenantId);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return `${TEAMS_DEEP_LINK_ORIGIN}/l/channel/${encodeURIComponent(threadId)}/${encodeURIComponent(name)}${qs}`;
}

/** Turn any Teams URL into the official admin-dashboard (or given channel) deep link. */
export function toTeamsWebChannelUrl(url) {
  const raw = unwrapTeamsLauncherUrl(url);
  if (!raw || isBareTeamsHome(raw) || isTeamsChatOrTeamHomeUrl(raw) || isVaptfixTeamDirectoryUrl(raw)) {
    return "";
  }
  const parsed = parseChannelDeepLink(raw);
  if (!parsed) return "";
  if (!/admin\s*dashboard/i.test(parsed.channelName) && !/admin\s*dashboard/i.test(decodedUrl(raw))) {
    return "";
  }
  return buildOfficialChannelDeepLink(
    parsed.channelId,
    "vaptfix admin dashboard",
    parsed.groupId,
    parsed.tenantId || tenantIdFrom({}),
  );
}

function channelNameOf(ch) {
  return String(ch?.displayName || ch?.name || ch?.channel_name || ch?.display_name || "").trim();
}

function channelIdOf(ch) {
  return String(ch?.id || ch?.channel_id || "").trim();
}

function isTeamsChannelThreadId(id) {
  let value = String(id || "").trim();
  if (!value) return false;
  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep */
  }
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return false;
  }
  return /^19:/i.test(value) || /@thread\./i.test(value);
}

function normalizeChannelThreadId(id) {
  let value = String(id || "").trim();
  if (!value) return "";
  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep */
  }
  return isTeamsChannelThreadId(value) ? value : "";
}

function teamGroupIdFrom(payload = {}) {
  const nested = payload?.data && typeof payload.data === "object" ? payload.data : {};
  const team = payload?.vaptfix_team || nested?.vaptfix_team || payload?.team || {};
  const candidate = String(
    team.groupId ||
      team.group_id ||
      team.aad_group_id ||
      payload.groupId ||
      nested.groupId ||
      team.team_id ||
      team.id ||
      "",
  ).trim();
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(candidate)) {
    return candidate;
  }
  return candidate && !isTeamsChannelThreadId(candidate) ? candidate : "";
}

function tenantIdFrom(payload = {}) {
  const nested = payload?.data && typeof payload.data === "object" ? payload.data : {};
  const tokens = payload?.tokens || nested?.tokens || {};
  try {
    return String(
      tokens.tenant_id ||
        payload.tenant_id ||
        nested.tenant_id ||
        localStorage.getItem("microsoft_tenant_id") ||
        "",
    ).trim();
  } catch {
    return String(tokens.tenant_id || payload.tenant_id || nested.tenant_id || "").trim();
  }
}

function buildChannelDeepLink(channelId, channelName, groupId, tenantId) {
  return buildOfficialChannelDeepLink(channelId, channelName, groupId, tenantId);
}

function collectChannelObjects(payload = {}) {
  const list = [];
  const walk = (channels) => {
    if (!Array.isArray(channels)) return;
    channels.forEach((ch) => {
      if (ch && typeof ch === "object") list.push(ch);
    });
  };
  collectLinkSources(payload).forEach((obj) => {
    walk(obj?.channels);
    walk(obj?.vaptfix_team?.channels);
  });
  try {
    walk(JSON.parse(localStorage.getItem("vaptfix_channels") || "[]"));
  } catch {
    /* ignore */
  }
  try {
    const team = JSON.parse(localStorage.getItem("vaptfix_team") || "null");
    walk(team?.channels);
    const teamId = team?.groupId || team?.group_id || team?.team_id || team?.id;
    if (teamId) {
      walk(JSON.parse(localStorage.getItem(`teams_channels_${teamId}`) || "[]"));
    }
  } catch {
    /* ignore */
  }
  return list;
}

export function buildAdminDashboardChannelUrl(payload = {}) {
  const channels = collectChannelObjects(payload);
  const dashboard = channels.find((ch) => /admin\s*dashboard/i.test(channelNameOf(ch)));
  const graphWeb = dashboard
    ? String(dashboard.webUrl || dashboard.web_url || "").trim()
    : "";
  const parsed = parseChannelDeepLink(graphWeb);
  const channelId =
    (dashboard && normalizeChannelThreadId(channelIdOf(dashboard))) || parsed?.channelId || "";
  if (!channelId) {
    const fromFields = [
      payload.teams_tab_url,
      payload.teams_tab_url_alt,
      payload.teams_url,
      payload.teams_desktop_url,
    ]
      .map((url) => parseChannelDeepLink(url))
      .find((item) => item && /admin\s*dashboard/i.test(item.channelName));
    if (!fromFields) return "";
    return buildOfficialChannelDeepLink(
      fromFields.channelId,
      "vaptfix admin dashboard",
      fromFields.groupId || teamGroupIdFrom(payload),
      fromFields.tenantId || tenantIdFrom(payload),
    );
  }
  return buildOfficialChannelDeepLink(
    channelId,
    "vaptfix admin dashboard",
    teamGroupIdFrom(payload) || parsed?.groupId || "",
    tenantIdFrom(payload) || parsed?.tenantId || "",
  );
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

/** Exact "vaptfix admin dashboard" Posts link. Never Chat, General, or the team channel-list page. */
export function pickTeamsTabUrl(links) {
  const payload = links && typeof links === "object" ? links : {};
  const built = buildAdminDashboardChannelUrl(payload);
  if (built) return built;
  const fieldCandidates = [
    payload.teams_tab_url,
    payload.teams_tab_url_alt,
    payload.teams_url,
    payload.teams_desktop_url,
  ];
  const all = [...fieldCandidates, ...collectChannelUrls(payload)].filter(Boolean);
  for (const url of all) {
    const parsed = parseChannelDeepLink(url);
    if (parsed && /admin\s*dashboard/i.test(parsed.channelName)) {
      return buildOfficialChannelDeepLink(
        parsed.channelId,
        "vaptfix admin dashboard",
        parsed.groupId || teamGroupIdFrom(payload),
        parsed.tenantId || tenantIdFrom(payload),
      );
    }
  }
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

/** Same window name for OAuth and the Teams channel so the side tab is reused, never discarded. */
export const TEAMS_WINDOW_NAME = "VaptFixTeams";

export function openTeamsAdminDashboard(url, { newTab = true } = {}) {
  const official = toTeamsWebChannelUrl(url);
  const fallback = String(url || "").trim();
  const target =
    official ||
    (/^https:\/\/teams\.microsoft\.com\/l\/channel\//i.test(fallback) &&
    /admin\s*dashboard/i.test(decodedUrl(fallback))
      ? fallback
      : "");
  if (!target) return false;
  if (newTab) {
    const opened = window.open(target, TEAMS_WINDOW_NAME);
    if (!opened) {
      window.open(target, "_blank");
    } else {
      try {
        opened.focus();
      } catch {
        /* ignore */
      }
    }
    return true;
  }
  window.location.assign(target);
  return true;
}

/** OAuth callback tab → vaptfix admin dashboard channel (same tab). */
export function landOnTeamsAdminDashboardChannel(payload, { newTab = false } = {}) {
  const links = extractTeamsDeepLink(payload || {});
  persistTeamsDeepLink(links);
  const url =
    pickTeamsTabUrl(links) ||
    pickTeamsTabUrl(readStoredTeamsDeepLink()) ||
    toTeamsWebChannelUrl(buildAdminDashboardChannelUrl(payload || {}));
  return openTeamsAdminDashboard(url, { newTab });
}

/** Connected-button / stored link → vaptfix admin dashboard channel in a side tab. */
export function redirectToTeamsTabUrl(payload) {
  const links = extractTeamsDeepLink(payload || {});
  persistTeamsDeepLink(links);
  const url = pickTeamsTabUrl(links) || pickTeamsTabUrl(readStoredTeamsDeepLink());
  return openTeamsAdminDashboard(url, { newTab: true });
}

/**
 * Open Microsoft OAuth as a real browser tab (no popup chrome).
 * After login that same tab becomes the vaptfix admin dashboard channel.
 */
export function openTeamsOAuthPopup(authUrl) {
  const target = String(authUrl || "").trim();
  if (!target) return null;
  const popup = window.open(target, TEAMS_WINDOW_NAME);
  if (!popup) {
    alert("Popup blocked! Please allow popups for this site.");
    return null;
  }
  try {
    popup.focus();
  } catch {
    /* ignore */
  }
  return popup;
}
