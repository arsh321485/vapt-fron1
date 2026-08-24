/**
 * Lightweight client-side shape checks for manual scope lines.
 * Mirrors POST /api/admin/scope/create/ rules: real IP / CIDR / URL
 * (scheme or realistic domain). Bare filenames like test.apk are not targets.
 */

const IPV4 =
  /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;

const FILE_EXTS = new Set([
  "apk",
  "ipa",
  "exe",
  "msi",
  "dmg",
  "pkg",
  "deb",
  "rpm",
  "bin",
  "dll",
  "so",
  "jar",
  "war",
  "zip",
  "rar",
  "7z",
  "tar",
  "gz",
  "tgz",
  "bz2",
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "csv",
  "txt",
  "rtf",
  "ppt",
  "pptx",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "svg",
  "webp",
  "bmp",
  "ico",
  "mp3",
  "mp4",
  "wav",
  "avi",
  "mov",
  "mkv",
  "html",
  "htm",
  "xml",
  "json",
  "yaml",
  "yml",
  "js",
  "ts",
  "css",
  "py",
  "sh",
  "bat",
  "ps1",
  "iso",
  "img",
  "dat",
  "log",
  "md",
  "map",
]);

export function splitScopeLines(text) {
  return String(text || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function isValidIPv4(value) {
  return IPV4.test(value);
}

function isValidIPv4Cidr(value) {
  const match = String(value || "").match(/^(.*)\/(\d|[12]\d|3[0-2])$/);
  if (!match) return false;
  return isValidIPv4(match[1]);
}

function looksLikeFilename(value) {
  const base = String(value || "").split(/[\\/]/).pop() || "";
  const match = base.match(/^[^.\\/]+\.([a-z0-9]{1,8})$/i);
  if (!match) return false;
  return FILE_EXTS.has(match[1].toLowerCase());
}

function isValidHostname(value) {
  const host = String(value || "").trim().replace(/\.$/, "");
  if (!host || /[\s<>'"{}@$%^&*()=+,;\\]/.test(host)) return false;
  if (looksLikeFilename(host)) return false;
  const labels = host.split(".");
  if (labels.length < 2) return false;
  const tld = labels[labels.length - 1];
  const tldOk =
    /^[a-zA-Z]{2,63}$/.test(tld) || /^xn--[a-z0-9-]{2,59}$/i.test(tld);
  if (!tldOk) return false;
  if (FILE_EXTS.has(tld.toLowerCase())) return false;
  return labels.every(
    (label) =>
      label.length > 0 &&
      label.length <= 63 &&
      !label.startsWith("-") &&
      !label.endsWith("-") &&
      /^[a-zA-Z0-9-]+$/.test(label),
  );
}

function isValidUrl(value) {
  if (!/^https?:\/\//i.test(value)) return false;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname.replace(/^\[|\]$/g, "");
    return isValidIPv4(host) || isValidHostname(host);
  } catch {
    return false;
  }
}

export function isValidScopeTarget(raw) {
  const value = String(raw || "").trim();
  if (!value) return false;
  if (isValidIPv4(value) || isValidIPv4Cidr(value)) return true;
  if (isValidUrl(value)) return true;
  const hostPart = value.split(/[/?#]/)[0];
  if (value.includes("/") && isValidHostname(hostPart)) return true;
  return isValidHostname(value);
}

export function countValidScopeTargets(text) {
  return splitScopeLines(text).filter(isValidScopeTarget).length;
}

function normalizeLineError(item) {
  if (item == null) return null;
  if (typeof item === "string") {
    return { value: "", error: item };
  }
  const value = String(item.value ?? item.target ?? item.line ?? "").trim();
  const error = String(item.error ?? item.message ?? item.detail ?? "").trim();
  if (!value && !error) return null;
  return { value, error: error || "Invalid target" };
}

export function extractScopeProcessing(payload) {
  const data = payload?.data && typeof payload.data === "object" ? payload.data : payload || {};
  const details =
    payload?.details && typeof payload.details === "object" ? payload.details : {};
  const processing = data.processing || details.processing || {};
  const rawErrors = Array.isArray(processing.errors)
    ? processing.errors
    : Array.isArray(data.errors)
      ? data.errors
      : Array.isArray(details.errors)
        ? details.errors
        : [];
  const errors = rawErrors.map(normalizeLineError).filter(Boolean);
  const created =
    Number(processing.created_count ?? data.created_count ?? details.created_count) || 0;
  const errorCount = Number(processing.error_count) || errors.length || 0;
  const parsed =
    Number(processing.total_parsed) ||
    (created + errorCount) ||
    0;
  return {
    total_parsed: parsed,
    created_count: created,
    error_count: errorCount,
    errors,
  };
}

export function extractPlanRecommendation(payload) {
  const data = payload?.data && typeof payload.data === "object" ? payload.data : payload || {};
  const details =
    payload?.details && typeof payload.details === "object" ? payload.details : {};
  const rec = data.plan_recommendation || details.plan_recommendation;
  if (!rec || typeof rec !== "object") return null;
  const plan = String(rec.recommended_plan || "").toLowerCase();
  if (plan !== "freemium" && plan !== "premium") return null;
  const internal = Number(rec.internal_count) || 0;
  const external = Number(rec.external_count) || 0;
  const total =
    Number(rec.total_scope_assets) ||
    (internal + external) ||
    0;
  return {
    recommended_plan: plan,
    total_scope_assets: total,
    internal_count: internal,
    external_count: external,
    freemium_limit: Number(rec.freemium_limit) || 5,
    message: String(rec.message || "").trim(),
  };
}

export function planRecommendationBreakdown(rec) {
  if (!rec) return "";
  const internal = Number(rec.internal_count);
  const external = Number(rec.external_count);
  if (!Number.isFinite(internal) && !Number.isFinite(external)) return "";
  const parts = [];
  if (Number.isFinite(internal)) {
    parts.push(`${internal} internal`);
  }
  if (Number.isFinite(external)) {
    parts.push(`${external} external`);
  }
  if (!parts.length) return "";
  if (external > 0) {
    return `${parts.join(", ")} — Premium required for external targets`;
  }
  return parts.join(", ");
}

export function planRecommendationMessage(rec) {
  if (rec?.message) return rec.message;
  const breakdown = planRecommendationBreakdown(rec);
  if (breakdown && Number(rec?.external_count) > 0) return breakdown;
  const count = Number(rec?.total_scope_assets) || 0;
  const limit = rec?.freemium_limit || 5;
  return `Your scope has ${count} target(s), which is over the Freemium limit of ${limit}. Please continue with the Premium plan.`;
}
