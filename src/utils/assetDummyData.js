export const ASSET_TYPE_FILTERS = [
  { key: "assets", label: "Assets", assetType: "other" },
  { key: "webapp", label: "Web App", assetType: "web_app" },
  { key: "firewall", label: "Firewall", assetType: "firewall" },
  { key: "server", label: "Server", assetType: "server" },
];

/** Exact values from GET .../assets/ and .../vulnerabilities/ (`asset_type`). */
export const API_ASSET_TYPES = ["firewall", "web_app", "server", "other"];

function slugAssetType(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
}

export function normalizeAssetType(value) {
  const type = slugAssetType(value);
  if (type === "firewall" || type === "fw" || type === "waf") return "firewall";
  if (type === "web_app" || type === "webapp") return "web_app";
  if (type === "server") return "server";
  if (type === "other" || type === "assets") return "other";
  return "";
}

function readApiAssetType(asset) {
  const raw = asset?.asset_type ?? asset?.assetType;
  if (raw == null) return "";
  if (Array.isArray(raw)) {
    return raw.map((item) => String(item || "").trim()).find(Boolean) || "";
  }
  return String(raw).trim();
}

export function assetTypeFromFilterKey(filterKey) {
  const match = ASSET_TYPE_FILTERS.find((item) => item.key === filterKey);
  return match?.assetType || "other";
}

export function uiTypeFromAssetType(assetType) {
  const type = normalizeAssetType(assetType) || "other";
  if (type === "web_app") return "webapp";
  if (type === "firewall") return "firewall";
  if (type === "server") return "server";
  return "assets";
}

export function filterAssetsByType(assets, filterKey) {
  const wanted = assetTypeFromFilterKey(filterKey);
  return (assets || []).filter((asset) => resolveAssetType(asset) === wanted);
}

export function extractAssetRows(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.assets)) return payload.assets;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.assets)) return payload.data.assets;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

export function getAssetHostName(asset) {
  return String(
    asset?.asset ||
      asset?.host ||
      asset?.host_name ||
      asset?.hostname ||
      asset?.ip ||
      "",
  ).trim();
}

/** Unique IPv4/IPv6 only — hostnames/URLs are not billed as extra IPs. */
export function extractIpAddress(name) {
  const raw = String(name || "").trim();
  if (!raw) return "";
  let host = raw.replace(/^https?:\/\//i, "").split("/")[0].trim();
  if (!host) return "";
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    const parts = host.split(".").map(Number);
    if (parts.length === 4 && parts.every((n) => n >= 0 && n <= 255)) return host;
    return "";
  }
  const ipv4WithPort = host.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (ipv4WithPort) return extractIpAddress(ipv4WithPort[1]);
  const noZone = host.replace(/%.*$/, "");
  if (noZone.includes(":") && /^[0-9a-f:]+$/i.test(noZone)) return noZone.toLowerCase();
  return "";
}

export function countUniqueIpHosts(rows) {
  const ips = new Set();
  (rows || []).forEach((row) => {
    const ip = extractIpAddress(getAssetHostName(row));
    if (ip) ips.add(ip);
  });
  return ips.size;
}

export function getRowScanHost(row) {
  return String(
    row?.asset ||
      row?.host_name ||
      row?.host ||
      row?.hostname ||
      row?.ip ||
      "",
  ).trim();
}

/**
 * True when extraction treated an OS / product / CIS-benchmark title as a host
 * (e.g. "Cisco IOS", "Windows"). Real hosts (IPs, FQDNs, hyphenated machine names)
 * return false.
 */
export function isPlatformLabelHost(name) {
  const raw = String(name || "").trim();
  if (!raw) return true;
  const host = raw.toLowerCase().replace(/\s+/g, " ");

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  if (host.includes(":") && /^[0-9a-f:.]+$/i.test(raw.replace(/%.*$/, ""))) return false;
  if (/^https?:\/\//i.test(raw)) return false;
  if (!/\s/.test(host) && host.includes("-") && host.length >= 5) return false;
  if (!/\s/.test(host) && host.includes(".") && /[a-z]/.test(host)) return false;
  if (!/\s/.test(host) && /\d/.test(host) && /[a-z]/.test(host)) return false;

  if (/^cis\b/.test(host) || /\bbenchmark\b/.test(host)) return true;
  if (/\b(warning|critical|error|info)\s+message\b/.test(host)) return true;
  if (/^cisco\s+(ios|asa|nx-os|ios-xe|ios xe)\b/.test(host)) return true;
  if (/^(microsoft\s+)?windows(\s+(\d+|server|11|10))?$/.test(host)) return true;
  if (
    /^(linux|ubuntu|debian|centos|redhat|red hat|rhel|macos|mac os x|mac os|solaris|aix|freebsd|android|unix)$/.test(
      host,
    )
  ) {
    return true;
  }
  return false;
}

export function isRealScanHost(name) {
  const raw = String(name || "").trim();
  if (!raw) return false;
  return !isPlatformLabelHost(raw);
}

export function collectScanHosts(row) {
  const hosts = [];
  const single = getRowScanHost(row);
  if (single) hosts.push(single);
  if (Array.isArray(row?.assets)) {
    row.assets.forEach((item) => {
      if (typeof item === "string") hosts.push(item);
      else hosts.push(getRowScanHost(item));
    });
  }
  if (Array.isArray(row?.hosts)) {
    row.hosts.forEach((item) => {
      if (typeof item === "string") hosts.push(item);
      else hosts.push(getRowScanHost(item));
    });
  }
  return [...new Set(hosts.map((h) => String(h || "").trim()).filter(Boolean))];
}

export function filterPlatformLabelAssetRows(rows) {
  return (rows || []).filter((row) => isRealScanHost(getAssetHostName(row) || getRowScanHost(row)));
}

export function filterPlatformLabelVulnRows(rows) {
  return (rows || [])
    .map((row) => {
      const real = collectScanHosts(row).filter(isRealScanHost);
      if (!real.length) return null;
      const next = { ...row };
      if (Array.isArray(row.assets)) {
        next.assets = row.assets.filter((item) =>
          isRealScanHost(typeof item === "string" ? item : getRowScanHost(item)),
        );
      }
      const single = getRowScanHost(row);
      if (single && !isRealScanHost(single)) {
        next.asset = real[0];
        next.host_name = real[0];
      }
      return next;
    })
    .filter(Boolean);
}

/** Drop fabricated hosts from team-performance / mitigation payloads. */
export function sanitizeTeamHostPayload(data) {
  if (!data || typeof data !== "object") return data;
  const source = data.teams && typeof data.teams === "object" ? data.teams : data;
  if (!source || typeof source !== "object" || Array.isArray(source)) return data;

  const nextTeams = {};
  for (const [key, team] of Object.entries(source)) {
    if (!team || typeof team !== "object" || !Array.isArray(team.vulnerabilities)) {
      nextTeams[key] = team;
      continue;
    }
    const vulnerabilities = team.vulnerabilities.filter((vuln) =>
      collectScanHosts(vuln).some(isRealScanHost),
    );
    const by_risk = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    let open = 0;
    let closed = 0;
    vulnerabilities.forEach((vuln) => {
      const sev = String(vuln.risk_factor || vuln.severity || "").toLowerCase();
      const label = sev.charAt(0).toUpperCase() + sev.slice(1);
      if (by_risk[label] != null) by_risk[label] += 1;
      const status = String(vuln.status || "").toLowerCase();
      if (["closed", "close", "fixed"].includes(status)) closed += 1;
      else open += 1;
    });
    nextTeams[key] = {
      ...team,
      vulnerabilities,
      count: vulnerabilities.length,
      total: team.total != null ? vulnerabilities.length : team.total,
      open: team.open != null ? open : team.open,
      closed: team.closed != null ? closed : team.closed,
      by_risk: team.by_risk ? by_risk : team.by_risk,
    };
  }

  if (data.teams && typeof data.teams === "object") {
    return { ...data, teams: nextTeams };
  }
  return nextTeams;
}

function collectClassificationText(asset) {
  const info = asset?.host_information && typeof asset.host_information === "object"
    ? asset.host_information
    : {};
  const infoText = Object.values(info)
    .filter((value) => typeof value === "string" || typeof value === "number")
    .join(" ");
  const findings = Array.isArray(asset?.findings) ? asset.findings : [];
  const findingText = findings
    .map((finding) =>
      [finding?.plugin_name, finding?.name, finding?.vul_name, finding?.description]
        .filter(Boolean)
        .join(" "),
    )
    .join(" ");
  return [
    getAssetHostName(asset),
    infoText,
    getAssetOs(asset),
    asset?.plugin_name,
    asset?.description,
    asset?.top_vulnerability,
    findingText,
  ]
    .join(" ")
    .toLowerCase();
}

/** Last-resort only. Backend already classifies; keep the same 1→4 order if `asset_type` is missing. */
export function inferAssetType(asset) {
  const name = getAssetHostName(asset).toLowerCase();
  const text = collectClassificationText(asset);

  // 1. Firewall first — vendor/product beats web/crypto wording on the same host.
  if (
    /\b(firewall|palo\s*alto|fortigate|fortinet|cisco\s+asa|firepower|\bftd\b|meraki\s+mx|check\s*point|sonicwall|juniper\s+srx|pfsense|opnsense|watchguard|barracuda|cyberoam|sophos\s+(xg|utm)|zyxel\s+usg|web application firewall|\bwaf\b|vpn concentrator|ngfw)\b/.test(
      text,
    )
  ) {
    return "firewall";
  }

  // 2. Web App — URL-shaped host OR application-layer finding, not IIS/Apache/Nginx alone.
  if (name.startsWith("http://") || name.startsWith("https://")) return "web_app";
  if (
    /\b(xss|sql injection|sqli|csrf|ssrf|xxe|path traversal|directory traversal|open redirect|insecure deserialization|template injection|html injection|session fixation|hsts|content.security.policy|\bcsp\b|clickjacking|cors|\bcookie\b|wordpress|drupal|joomla|graphql|rest api)\b/.test(
      text,
    )
  ) {
    return "web_app";
  }

  // 3. Server — real OS, or server software with no web-app signal.
  if (getAssetOs(asset)) return "server";
  if (
    /\b(windows|linux|macos|mac os|ubuntu|centos|debian|red\s*hat|rhel|solaris|freebsd|aix|amazon linux|esxi|vmware|iis|apache|nginx|tomcat|mysql|postgres|postgresql|docker|kubernetes|ssh)\b/.test(
      text,
    )
  ) {
    return "server";
  }

  // 4. Assets — bare IP / hostname with no signal.
  return "other";
}

export function resolveAssetType(asset) {
  const raw = readApiAssetType(asset);
  if (raw) {
    return normalizeAssetType(raw) || "other";
  }
  return inferAssetType(asset);
}

export function getAssetOs(asset) {
  const info = asset?.host_information || {};
  return (
    info["operating-system"] ||
    info.operating_system ||
    info.os ||
    info["Operating System"] ||
    ""
  );
}

export function getAssetResolvedIp(asset) {
  const info = asset?.host_information || {};
  return (
    asset?.resolved_ip ||
    info["IP Address"] ||
    info.ip_address ||
    info.ip ||
    info["Host IP"] ||
    ""
  );
}

export function assetMatchesQueryHost(asset, host) {
  const target = String(host || "").trim().toLowerCase();
  if (!target) return false;
  return [getAssetHostName(asset), getAssetResolvedIp(asset), asset?.asset, asset?.ip, asset?.host]
    .some((value) => String(value || "").trim().toLowerCase() === target);
}

export function findAssetByQueryHost(assets, host) {
  return (assets || []).find((asset) => assetMatchesQueryHost(asset, host)) || null;
}

export function tabKeyForAsset(asset) {
  return uiTypeFromAssetType(resolveAssetType(asset));
}

export const ASSET_TYPE_DISPLAY = [
  { type: "server", ui: "server", code: "SR", label: "Server", emoji: "🖥️" },
  { type: "web_app", ui: "webapp", code: "WA", label: "Web App", emoji: "🌐" },
  { type: "firewall", ui: "firewall", code: "FR", label: "Firewall", emoji: "🧱" },
  { type: "other", ui: "assets", code: "AS", label: "Assets", emoji: "💻" },
];

export function normalizeAssetTypeCounts(raw) {
  const src = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  const read = (...keys) => {
    for (const key of keys) {
      if (src[key] == null || src[key] === "") continue;
      const n = Number(src[key]);
      if (Number.isFinite(n) && n > 0) return n;
      if (n === 0) return 0;
    }
    return 0;
  };
  return {
    server: read("server"),
    web_app: read("web_app", "webapp", "web"),
    firewall: read("firewall", "fw"),
    other: read("other", "assets"),
  };
}

export function hasAssetTypeCounts(raw) {
  const counts = normalizeAssetTypeCounts(raw);
  return Object.values(counts).some((n) => n > 0);
}

/** Non-zero type chips for a finding row. Skip generic "other" (All Assets has no badge for it). */
export function assetTypeCountChips(raw) {
  const counts = normalizeAssetTypeCounts(raw);
  return ASSET_TYPE_DISPLAY.filter((item) => item.type !== "other" && counts[item.type] > 0).map(
    (item) => ({ ...item, count: counts[item.type] }),
  );
}

export function assetTypeCountForFilter(raw, filterKey) {
  const counts = normalizeAssetTypeCounts(raw);
  return counts[assetTypeFromFilterKey(filterKey)] || 0;
}

export function assetTypeBadgeMeta(assetType) {
  const type = normalizeAssetType(assetType) || "other";
  if (type === "other") return null;
  return ASSET_TYPE_DISPLAY.find((item) => item.type === type) || null;
}

/** Classify a host using the assets API row first, then register/vuln extras, then hostname inference. */
export function resolveHostAssetType(hostName, catalog = [], extra = null) {
  const ip = String(hostName || "").trim().toLowerCase();
  if (!ip) return "other";
  const extraType = normalizeAssetType(extra?.asset_type ?? extra?.assetType);
  if (extraType) return extraType;
  const match = (catalog || []).find((asset) =>
    [getAssetHostName(asset), asset?.asset, asset?.ip, asset?.host_name, getAssetResolvedIp(asset)].some(
      (value) => String(value || "").trim().toLowerCase() === ip,
    ),
  );
  if (match) return resolveAssetType(match);
  if (extra && typeof extra === "object") {
    return resolveAssetType({ ...extra, asset: hostName || extra.asset });
  }
  return resolveAssetType({ asset: hostName });
}

/** Persist which tab the user held from so reload/OS inference cannot move the card. */
export function heldVulnTypeKey(pluginName, hostName) {
  const plugin = normalizePluginKey(pluginName);
  const host = String(hostName || "").trim().toLowerCase();
  if (!plugin || !host) return "";
  return `${plugin}::${host}`;
}

function normalizePluginKey(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

const HELD_TYPE_STORAGE_KEY = "vaptfix:held-item-asset-types";

export function loadHeldItemTypeMap() {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(HELD_TYPE_STORAGE_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function isHoldStampKey(key) {
  return (
    String(key || "").startsWith("hold:") ||
    String(key || "").startsWith("hold-vuln:") ||
    String(key || "").startsWith("hold-asset:")
  );
}

export function persistHeldItemTypeMap(map) {
  const holdOnly = {};
  Object.entries(map || {}).forEach(([key, value]) => {
    if (isHoldStampKey(key) && value) holdOnly[key] = value;
  });
  try {
    sessionStorage.setItem(HELD_TYPE_STORAGE_KEY, JSON.stringify(holdOnly));
  } catch {
    /* ignore quota / private mode */
  }
}

function lookupPluginHoldStamp(map, pluginName, hostName) {
  const host = String(hostName || "").trim().toLowerCase();
  const pluginKey = heldVulnTypeKey(pluginName, hostName);
  const wantedPlugin = normalizePluginKey(pluginName);
  if (pluginKey && map?.[`hold-vuln:${pluginKey}`]) return map[`hold-vuln:${pluginKey}`];
  if (pluginKey && map?.[`hold:${pluginKey}`]) return map[`hold:${pluginKey}`];
  if (!host || !wantedPlugin) return "";
  const suffix = `::${host}`;
  for (const [key, value] of Object.entries(map || {})) {
    if (!value || !key.endsWith(suffix)) continue;
    let stampedPlugin = "";
    if (key.startsWith("hold-vuln:")) stampedPlugin = key.slice("hold-vuln:".length, key.length - suffix.length);
    else if (key.startsWith("hold:")) stampedPlugin = key.slice("hold:".length, key.length - suffix.length);
    else continue;
    if (normalizePluginKey(stampedPlugin) === wantedPlugin) return value;
  }
  return "";
}

function lookupHoldStamp(map, pluginName, hostName) {
  const host = String(hostName || "").trim().toLowerCase();
  const plugin = String(pluginName || "").trim();
  if (plugin) return lookupPluginHoldStamp(map, plugin, host);
  if (host && map?.[`hold-asset:${host}`]) return map[`hold-asset:${host}`];
  if (host && map?.[`hold:${host}`]) return map[`hold:${host}`];
  return "";
}

export function stampHeldItemAssetType(map, pluginName, hostName, assetType, options = {}) {
  const next = { ...(map || {}) };
  const typed = normalizeAssetType(assetType);
  if (!typed) return next;
  const overwrite = options.overwrite !== false;
  const host = String(hostName || "").trim().toLowerCase();
  const pluginKey = heldVulnTypeKey(pluginName, hostName);
  if (pluginKey) {
    const vulnKey = `hold-vuln:${pluginKey}`;
    const legacyKey = `hold:${pluginKey}`;
    if (overwrite || !next[vulnKey]) next[vulnKey] = typed;
    if (overwrite || !next[legacyKey]) next[legacyKey] = typed;
  } else if (host) {
    const assetKey = `hold-asset:${host}`;
    const legacyHost = `hold:${host}`;
    if (overwrite || !next[assetKey]) next[assetKey] = typed;
    if (overwrite || !next[legacyHost]) next[legacyHost] = typed;
  }
  persistHeldItemTypeMap(next);
  return next;
}

export function clearHeldItemAssetType(map, pluginName, hostName) {
  const next = { ...(map || {}) };
  const host = String(hostName || "").trim().toLowerCase();
  const pluginKey = heldVulnTypeKey(pluginName, hostName);
  if (pluginKey) {
    delete next[`hold-vuln:${pluginKey}`];
    delete next[`hold:${pluginKey}`];
  } else if (host) {
    delete next[`hold-asset:${host}`];
    delete next[`hold:${host}`];
  }
  persistHeldItemTypeMap(next);
  return next;
}

export function mergeHostAssetTypeMap(map, rows) {
  const next = { ...(map || {}) };
  (rows || []).forEach((row) => {
    const host = String(
      getAssetHostName(row) || row?.host_name || row?.ip || "",
    )
      .trim()
      .toLowerCase();
    const typed = normalizeAssetType(row?.asset_type ?? row?.assetType);
    if (!host || !typed) return;
    const pluginKey = heldVulnTypeKey(row?.plugin_name || row?.vul_name, host);
    if (pluginKey && typed !== "other") next[pluginKey] = typed;
    if (typed === "other") return;
    next[host] = typed;
  });
  return next;
}

export function heldItemAssetType(held, hostTypeMap = {}, _catalog = []) {
  const host = String(held?.host_name || held?.asset || held?.ip || "").trim().toLowerCase();
  const plugin = String(held?.plugin_name || held?.vul_name || "").trim();
  const holdStamp = lookupHoldStamp(hostTypeMap, plugin, host);
  if (holdStamp) return holdStamp;
  // Never infer and never use catalog/API host type (SSH → server).
  return "other";
}


