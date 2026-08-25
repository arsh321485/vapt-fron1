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

