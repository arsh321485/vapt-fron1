export const ASSET_TYPE_FILTERS = [
  { key: "assets", label: "Assets", assetType: "other" },
  { key: "webapp", label: "Web App", assetType: "web_app" },
  { key: "firewall", label: "Firewall", assetType: "firewall" },
  { key: "server", label: "Server", assetType: "server" },
];

function slugAssetType(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, "_");
}

export function normalizeAssetType(value) {
  const type = slugAssetType(value) || "other";
  if (
    [
      "web_app",
      "webapp",
      "web",
      "website",
      "web_server",
      "webserver",
      "web_application",
      "webapplication",
      "url",
      "http",
      "https",
      "application",
    ].includes(type)
  ) {
    return "web_app";
  }
  if (["firewall", "fw", "waf"].includes(type)) return "firewall";
  if (["server", "os", "host", "machine"].includes(type)) return "server";
  return "other";
}

function readRawApiAssetType(asset) {
  const nested = asset?.host_information || {};
  const candidates = [
    asset?.asset_type,
    asset?.assetType,
    asset?.type,
    asset?.target_type,
    asset?.targetType,
    asset?.category,
    asset?.asset_category,
    asset?.host_type,
    asset?.hostType,
    asset?.scan_target_type,
    asset?.kind,
    nested.asset_type,
    nested.type,
    nested.target_type,
    nested.category,
  ];
  for (const value of candidates) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      const first = value.map((item) => String(item || "").trim()).find(Boolean);
      if (!first) continue;
      const slug = slugAssetType(first);
      if (["host", "ip", "ipv4", "ipv6", "open", "closed", "asset", "node"].includes(slug)) continue;
      return first;
    }
    const text = String(value).trim();
    if (!text) continue;
    const slug = slugAssetType(text);
    if (["host", "ip", "ipv4", "ipv6", "open", "closed", "asset", "node"].includes(slug)) continue;
    return text;
  }
  return "";
}

export function assetTypeFromFilterKey(filterKey) {
  const match = ASSET_TYPE_FILTERS.find((item) => item.key === filterKey);
  return match?.assetType || "other";
}

export function uiTypeFromAssetType(assetType) {
  const type = normalizeAssetType(assetType);
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

function looksLikeWebAppHost(name) {
  const host = String(name || "").trim().toLowerCase();
  if (!host) return false;
  if (host.startsWith("http://") || host.startsWith("https://")) return true;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  return /[a-z0-9-]+\.(com|net|org|io|co|app|gov|edu|in|uk|us|info|biz|dev)(\b|\/|:|$)/i.test(host);
}

function looksLikeFirewallHost(name) {
  const host = String(name || "").toLowerCase();
  return [
    "palo",
    "fortinet",
    "fortigate",
    "cisco asa",
    "sonicwall",
    "juniper",
    "check point",
    "checkpoint",
    "pfsense",
    "firewall",
    "gateway",
    "vpn",
  ].some((hint) => host.includes(hint));
}

export function inferAssetType(asset) {
  const name = getAssetHostName(asset);
  const info = asset?.host_information || {};
  const hints = [
    getAssetOs(asset),
    info.product,
    info.service,
    info["system-type"],
    info.system_type,
    asset?.plugin_name,
    asset?.top_vulnerability,
  ]
    .join(" ")
    .toLowerCase();
  if (looksLikeWebAppHost(name) || /iis|apache|nginx|tomcat|http server|web server/.test(hints)) {
    return "web_app";
  }
  if (looksLikeFirewallHost(name) || /firewall|fortigate|palo alto/.test(hints)) return "firewall";
  if (getAssetOs(asset)) return "server";
  return "other";
}

export function resolveAssetType(asset) {
  const raw = readRawApiAssetType(asset);
  if (raw) {
    const normalized = normalizeAssetType(raw);
    if (normalized !== "other") return normalized;
    const slug = slugAssetType(raw);
    if (["internal", "external"].includes(slug)) return inferAssetType(asset);
    return "other";
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

function inferAssetTypeFromVulnText(text) {
  const value = String(text || "").toLowerCase();
  if (
    /iis|internet information services|apache|nginx|tomcat|http server|web server|wordpress|drupal|jquery/.test(
      value,
    )
  ) {
    return "web_app";
  }
  if (/firewall|fortigate|palo alto|cisco asa|checkpoint|pfsense/.test(value)) return "firewall";
  return "";
}

/** When user assets API omits asset_type, use register vuln names (same report as admin). */
export function enrichAssetsWithVulnTypes(assets, registerRows) {
  const namesByHost = {};
  (registerRows || []).forEach((row) => {
    const host = String(row.asset || row.host_name || row.host || "")
      .trim()
      .toLowerCase();
    const name = row.vul_name || row.plugin_name || row.vulnerability_name || "";
    if (!host || !name) return;
    (namesByHost[host] ||= []).push(name);
  });
  return (assets || []).map((asset) => {
    const current = resolveAssetType(asset);
    if (current !== "other") return { ...asset, asset_type: current };
    const host = String(getAssetHostName(asset) || "")
      .trim()
      .toLowerCase();
    const inferred = inferAssetTypeFromVulnText((namesByHost[host] || []).join(" "));
    return { ...asset, asset_type: inferred || current };
  });
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
  const type = normalizeAssetType(assetType);
  if (type === "other") return null;
  return ASSET_TYPE_DISPLAY.find((item) => item.type === type) || null;
}

/** Classify a host using the assets API row first, then register/vuln extras, then hostname inference. */
export function resolveHostAssetType(hostName, catalog = [], extra = null) {
  const ip = String(hostName || "").trim().toLowerCase();
  if (!ip) return "other";
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

