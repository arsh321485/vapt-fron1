export const ASSET_TYPE_FILTERS = [
  { key: "assets", label: "Assets", assetType: "other" },
  { key: "webapp", label: "Web App", assetType: "web_app" },
  { key: "firewall", label: "Firewall", assetType: "firewall" },
  { key: "server", label: "Server", assetType: "server" },
];

export function normalizeAssetType(value) {
  const type = String(value || "other").toLowerCase().trim();
  if (type === "web_app" || type === "webapp" || type === "web-app") return "web_app";
  if (type === "firewall") return "firewall";
  if (type === "server") return "server";
  return "other";
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
  return (assets || []).filter((asset) => normalizeAssetType(asset?.asset_type) === wanted);
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
  if (getAssetOs(asset)) return "server";
  if (looksLikeFirewallHost(name)) return "firewall";
  if (looksLikeWebAppHost(name)) return "web_app";
  return "other";
}

export function resolveAssetType(asset) {
  const raw = asset?.asset_type;
  if (raw != null && String(raw).trim() !== "") {
    const normalized = normalizeAssetType(raw);
    if (normalized !== "other") return normalized;
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
