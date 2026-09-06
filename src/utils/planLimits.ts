// @ts-nocheck
import { isClaimInviteFlow } from "./claimInvite";

export const BILLING_RETURN_TO_KEY = "vaptfix_billing_return_to";
export const UPLOAD_RETURN_PATH = "/admin-upload-report";
const PREMIUM_ENTRY_SOURCE_KEY = "vaptfix_premium_entry_source";
const MAGIC_LINK_UNLIMITED_KEY = "vaptfix_magic_link_unlimited";

/** Remember whether Premium was entered from a file upload vs scope (survives logout on this origin). */
export function setPremiumEntrySource(source) {
  const value = String(source || "").toLowerCase();
  try {
    if (value === "upload" || value === "scope") {
      localStorage.setItem(PREMIUM_ENTRY_SOURCE_KEY, value);
    }
  } catch {
    /* ignore */
  }
}

export function peekPremiumEntrySource() {
  try {
    return String(localStorage.getItem(PREMIUM_ENTRY_SOURCE_KEY) || "").toLowerCase();
  } catch {
    return "";
  }
}

function readMagicLinkUnlimitedStored() {
  try {
    if (sessionStorage.getItem(MAGIC_LINK_UNLIMITED_KEY) === "1") return true;
    if (localStorage.getItem(MAGIC_LINK_UNLIMITED_KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** From GET /subscription/me/ → magic_link_unlimited */
export function setMagicLinkUnlimited(flag) {
  const on = flag === true || flag === 1 || flag === "true" || flag === "1";
  try {
    if (on) {
      sessionStorage.setItem(MAGIC_LINK_UNLIMITED_KEY, "1");
      localStorage.setItem(MAGIC_LINK_UNLIMITED_KEY, "1");
    } else {
      sessionStorage.removeItem(MAGIC_LINK_UNLIMITED_KEY);
      localStorage.removeItem(MAGIC_LINK_UNLIMITED_KEY);
    }
  } catch {
    /* ignore */
  }
}

export function clearMagicLinkUnlimited() {
  setMagicLinkUnlimited(false);
}

/** Magic-link unlimited admin: no Freemium UI / automation locks. */
export function isMagicLinkUnlimited() {
  if (readMagicLinkUnlimitedStored()) return true;
  try {
    if (isClaimInviteFlow()) return true;
  } catch {
    /* ignore */
  }
  return false;
}

/** True when Freemium plan UI restrictions should apply (NOT for magic-link unlimited). */
export function hasFreemiumRestrictions(subscription) {
  if (isMagicLinkUnlimited()) return false;
  return isActiveSubscription(subscription) && isFreemiumPlan(subscription);
}

/** True when latest-report/upload payload is a scan file, not Enter Scope. */
export function reportLooksLikeUploadedScan(data) {
  if (!data || typeof data !== "object") return false;
  const names = []
    .concat(data.uploaded_file_names || [])
    .concat(data.file_names || [])
    .map((n) => String(n || "").trim())
    .filter(Boolean);
  const file = String(
    data.resolved_file_name ||
      data.file_name ||
      data.filename ||
      data.original_filename ||
      data.uploaded_file_name ||
      "",
  ).trim();
  const id = String(data.report_id || data.id || data._id || "").trim();
  return !!(names.length || file || id);
}

export function isActiveSubscription(subscription) {
  if (!subscription) return false;
  const status = String(subscription.status || "").toLowerCase();
  return status === "active" || status === "trialing" || status === "past_due";
}

export function isFreemiumPlan(planOrSubscription) {
  // Magic-link unlimited admins must not hit Freemium UI limits.
  if (isMagicLinkUnlimited()) return false;
  const plan = String(
    typeof planOrSubscription === "string"
      ? planOrSubscription
      : planOrSubscription?.plan ||
          planOrSubscription?.plan_name ||
          planOrSubscription?.plan_id ||
          "",
  ).toLowerCase();
  return plan === "freemium" || plan.includes("freemium");
}

/** Freemium can keep the first uploaded file; a new Upload Scope is Premium-only. */
export function freemiumLocksUploadScope(subscription) {
  return hasFreemiumRestrictions(subscription);
}

export function isInvalidScanFileMessage(text) {
  return /invalid|unsupported|wrong file|could not parse|cannot parse|failed to parse|unrecognized|not a valid|not a (nessus|scan|xml|csv|report)|no host|no asset|empty file|corrupt|malformed|does not contain|unable to (read|parse|process)|unreadable|unknown format/i.test(
    String(text || ""),
  );
}

export function isNetworkOrTransportError(text) {
  return /network error|failed to fetch|err_network|err_connection|econnaborted|econnrefused|enotfound|timeout|timed out|502|503|504|cloudflare|could not reach|server temporarily unavailable|upload timed out/i.test(
    String(text || ""),
  );
}

/** Freemium already used its single report slot — replace should be allowed, not a hard dead-end. */
export function isFreemiumReportUploadLimitMessage(text) {
  return /freemium.{0,60}(only|allows?).{0,30}1.{0,30}report|only 1 report upload|one report upload total|upgrade to premium to upload more reports|already (have|has|uploaded).{0,40}report/i.test(
    String(text || ""),
  );
}

/** Max files Freemium may upload in one attempt (Premium can merge more). */
export const FREEMIUM_MAX_UPLOAD_FILES = 1;

/**
 * True when Freemium is being chosen / active and the user selected more than 1 file.
 * Premium / custom must never hit this gate.
 */
export function freemiumBlocksMultiFileUpload({
  planId = "",
  isFreemiumActive = false,
  fileCount = 0,
} = {}) {
  const plan = String(planId || "").trim().toLowerCase();
  const freemiumPath = plan === "freemium" || !!isFreemiumActive;
  const n = Number(fileCount) || 0;
  return freemiumPath && n > FREEMIUM_MAX_UPLOAD_FILES;
}

/** Backend `freemium_single_file_required` or equivalent copy about file count (not replace-slot). */
export function isFreemiumSingleFileRequiredMessage(textOrPayload) {
  if (textOrPayload && typeof textOrPayload === "object") {
    const code = String(textOrPayload.code || textOrPayload.error_code || "").toLowerCase();
    if (code === "freemium_single_file_required") return true;
    const blob = [
      textOrPayload.error,
      textOrPayload.message,
      textOrPayload.detail,
      JSON.stringify(textOrPayload),
    ]
      .filter(Boolean)
      .join(" ");
    return isFreemiumSingleFileRequiredMessage(blob);
  }
  const text = String(textOrPayload || "");
  if (/freemium_single_file_required/i.test(text)) return true;
  // File-count wording (avoid matching "1 report upload total" alone — that is the replace-slot error).
  if (/only 1 file|allows? only 1 file|single file required|keep one file|1 file\.|max_files.:?\s*1/i.test(text)) {
    return true;
  }
  if (/freemium.{0,40}1.{0,20}file/i.test(text) && !/report upload total/i.test(text)) {
    return true;
  }
  return false;
}

export function freemiumMultiFileUserMessage(fileCount = 0) {
  const n = Number(fileCount) || 0;
  const countBit = n > 1 ? ` You selected ${n} files.` : "";
  return `Freemium plan allows only 1 file upload.${countBit} Go back to Upload Report, keep one file, then choose Freemium again.`;
}

/**
 * Decide Freemium upload error UX:
 * - multi_file → back to upload to drop extras
 * - replace_slot → replace / upgrade (already has a report)
 * - none
 *
 * IMPORTANT: multi_file / replace_slot only when Freemium is chosen or already active.
 * Before plan selection, multi-file upload must proceed to the plan picker.
 */
export function classifyFreemiumUploadBlock({
  planId = "",
  isFreemiumActive = false,
  fileCount = 0,
  message = "",
  details = null,
} = {}) {
  const n = Number(fileCount) || 0;
  const plan = String(planId || "").trim().toLowerCase();
  const freemiumContext = plan === "freemium" || !!isFreemiumActive;
  // No Freemium context yet → never show the 1-file Freemium alert.
  if (!freemiumContext) return "none";

  const blob = [message, details ? JSON.stringify(details) : ""].filter(Boolean).join(" ");
  if (
    freemiumBlocksMultiFileUpload({ planId: plan || "freemium", isFreemiumActive, fileCount: n }) ||
    isFreemiumSingleFileRequiredMessage(details) ||
    isFreemiumSingleFileRequiredMessage(blob)
  ) {
    return "multi_file";
  }
  if (isFreemiumReportUploadLimitMessage(blob)) {
    return "replace_slot";
  }
  return "none";
}

export function uploadTransportErrorMessage(text) {
  const raw = String(text || "");
  if (/upload timed out|timeout|timed out|econnaborted/i.test(raw)) {
    return "Upload timed out. Large scan files can take several minutes — please try again. If this keeps happening, the server may be busy.";
  }
  if (/502|503|504|server temporarily unavailable|cloudflare/i.test(raw)) {
    return "The upload server is temporarily unavailable. Please wait a moment and try again.";
  }
  return "Could not finish the upload. Your internet may be fine — the connection to the server dropped or timed out. Please try again.";
}

export function isPlanQuotaMessage(text) {
  return /upgrade|asset.?limit|over.?limit|extra.?ip|plan.?limit|exceeds.{0,24}(ip|asset)|too many (ip|asset|host)/i.test(
    String(text || ""),
  );
}

export function isExistingSubscriptionMessage(text) {
  return /already exists|already (have|has) an? active|active subscription already/i.test(
    String(text || ""),
  );
}

export const FREEMIUM_RETEST_MESSAGE = "Freemium plan does not allow retesting.";

export function isRetestBlockedMessage(text) {
  return /freemium|retest.{0,40}(not allowed|not available|not supported|disabled)|not allowed.{0,20}retest|no testing\/?retesting|upgrade.{0,40}(premium|plan)|plan.{0,40}(not allow|does not allow|retest)/i.test(
    String(text || ""),
  );
}

export function retestErrorMessage(apiMessage, extras = {}) {
  const text = String(apiMessage || "").trim();
  const fallback = String(extras.fallback || "").trim();
  const combined = `${text} ${fallback}`;
  const genericFail = /fail(ed)? to send (verification|retest)/i.test(combined);
  if (
    extras.isFreemium ||
    extras.automationPremiumRequired ||
    isRetestBlockedMessage(combined) ||
    genericFail ||
    extras.httpStatus === 403 ||
    extras.httpStatus === 402
  ) {
    return FREEMIUM_RETEST_MESSAGE;
  }
  return text || fallback || "Failed to send for retest.";
}

export const FREEMIUM_VISIBLE_ASSET_LIMIT = 5;
export const FREEMIUM_TEAM_MEMBER_LIMIT = 3;

export function planAssetLimit(planOrSubscription) {
  const plan = String(
    typeof planOrSubscription === "string"
      ? planOrSubscription
      : planOrSubscription?.plan || "",
  ).toLowerCase();
  if (plan === "freemium") return FREEMIUM_VISIBLE_ASSET_LIMIT;
  if (plan === "premium") return 250;
  if (plan === "custom") return Number.POSITIVE_INFINITY;
  return FREEMIUM_VISIBLE_ASSET_LIMIT;
}

/** Freemium never blocks an oversized file — extras stay locked until upgrade. */
export function planBlocksOversizedUpload(planOrSubscription) {
  return !isFreemiumPlan(planOrSubscription);
}

export function isFreemiumTeamLimitMessage(text) {
  return /freemium plan allows up to\s+\d+\s+team members|upgrade to premium to add more/i.test(
    String(text || ""),
  );
}

export function parseFreemiumUpgrade(data) {
  const raw = data?.freemium_upgrade ?? data?.data?.freemium_upgrade;
  if (!raw || typeof raw !== "object") return null;
  const eligible = raw.eligible === true || raw.eligible === "true" || raw.eligible === 1;
  if (!eligible) return null;
  const breakdown = billingAssetBreakdown(raw);
  const locked = breakdown.locked_asset_count;
  const visible = breakdown.visible_asset_count || FREEMIUM_VISIBLE_ASSET_LIMIT;
  const total = breakdown.billable_asset_count || (locked > 0 ? locked + visible : 0);
  const message = String(raw.message || "").trim()
    || `You've closed every visible finding — upgrade to Premium to unlock ${locked || "more"} asset(s) from this file, no re-upload needed.`;
  const upgradeUrl = String(raw.upgrade_url || "/pricingplan").trim() || "/pricingplan";
  if (total > FREEMIUM_VISIBLE_ASSET_LIMIT) storeBillableAssetCount(total);
  return {
    eligible: true,
    locked_assets: locked,
    visible_assets: visible,
    total_assets: total,
    message,
    upgrade_url: upgradeUrl,
  };
}

export function freemiumUpgradeAssetCount(banner) {
  if (!banner || typeof banner !== "object") return 0;
  const total = Number(banner.total_assets) || 0;
  if (total > 0) return total;
  const locked = Number(banner.locked_assets) || 0;
  const visible = Number(banner.visible_assets) || FREEMIUM_VISIBLE_ASSET_LIMIT;
  if (locked > 0) return locked + visible;
  return 0;
}

const FREEMIUM_COMPLETE_POPUP_KEY = "vaptfix_freemium_complete_popup";

export function wasFreemiumCompletePopupShown() {
  try {
    return sessionStorage.getItem(FREEMIUM_COMPLETE_POPUP_KEY) === "1";
  } catch {
    return false;
  }
}

export function markFreemiumCompletePopupShown() {
  try {
    sessionStorage.setItem(FREEMIUM_COMPLETE_POPUP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function collectFreemiumTrimmedResults(data) {
  if (!data || typeof data !== "object") return [];
  const rows = [];
  if (Array.isArray(data.results)) rows.push(...data.results);
  else rows.push(data);
  return rows.filter((row) => {
    if (!row || typeof row !== "object") return false;
    return row.freemium_trimmed === true || row.freemium_trimmed === "true" || row.freemium_trimmed === 1;
  });
}

export function formatFreemiumTrimmedMessage(row = {}) {
  const locked = Number(row.locked_asset_count ?? row.locked_assets) || 0;
  const shown = Number(row.visible_asset_count ?? row.visible_count) || FREEMIUM_VISIBLE_ASSET_LIMIT;
  return `Your file had more assets than your Freemium plan covers — showing ${shown}, ${locked} more are saved and will unlock automatically the moment you upgrade (no re-upload needed).`;
}

const BILLABLE_ASSET_COUNT_KEY = "vaptfix_billable_asset_count";
const LAST_UPLOAD_FILE_NAMES_KEY = "vaptfix_last_upload_file_names";
const LAST_UPLOAD_FILE_COUNT_KEY = "vaptfix_last_upload_file_count";

/** Remember how many scan files were in the last upload (survives Premium → Freemium on pricing). */
export function rememberUploadedScanFiles(namesOrCount) {
  try {
    if (Array.isArray(namesOrCount)) {
      const names = namesOrCount.map((n) => String(n || "").trim()).filter(Boolean);
      sessionStorage.setItem(LAST_UPLOAD_FILE_NAMES_KEY, JSON.stringify(names));
      sessionStorage.setItem(LAST_UPLOAD_FILE_COUNT_KEY, String(names.length));
      return names.length;
    }
    const n = Number(namesOrCount) || 0;
    if (n > 0) sessionStorage.setItem(LAST_UPLOAD_FILE_COUNT_KEY, String(n));
    return n;
  } catch {
    return 0;
  }
}

export function peekUploadedScanFileCount() {
  try {
    const rawNames = sessionStorage.getItem(LAST_UPLOAD_FILE_NAMES_KEY);
    if (rawNames) {
      const names = JSON.parse(rawNames);
      if (Array.isArray(names) && names.length) return names.length;
    }
    return Number(sessionStorage.getItem(LAST_UPLOAD_FILE_COUNT_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function peekUploadedScanFileNames() {
  try {
    const raw = sessionStorage.getItem(LAST_UPLOAD_FILE_NAMES_KEY);
    if (!raw) return [];
    const names = JSON.parse(raw);
    return Array.isArray(names) ? names.map((n) => String(n || "").trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function clearUploadedScanFileMemory() {
  try {
    sessionStorage.removeItem(LAST_UPLOAD_FILE_NAMES_KEY);
    sessionStorage.removeItem(LAST_UPLOAD_FILE_COUNT_KEY);
  } catch {
    /* ignore */
  }
}

const FREEMIUM_SINGLE_PICK_KEY = "vaptfix_freemium_single_pick";

/** User came from Freemium 1-file alert — trim UI; keep file-name memory for the list. */
export function markFreemiumSinglePickIntent() {
  try {
    sessionStorage.setItem(FREEMIUM_SINGLE_PICK_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function clearFreemiumSinglePickIntent() {
  try {
    sessionStorage.removeItem(FREEMIUM_SINGLE_PICK_KEY);
  } catch {
    /* ignore */
  }
}

export function isFreemiumSinglePickIntent() {
  try {
    return sessionStorage.getItem(FREEMIUM_SINGLE_PICK_KEY) === "1";
  } catch {
    return false;
  }
}

/** Backend 4-field breakdown. Do not invent a price count — prefer billable/original. */
export function billingAssetBreakdown(source) {
  const empty = {
    asset_count: 0,
    visible_asset_count: 0,
    locked_asset_count: 0,
    original_asset_count: 0,
    billable_asset_count: 0,
  };
  if (!source || typeof source !== "object") return empty;
  const visible =
    Number(source.visible_asset_count ?? source.visible_count ?? source.visible_assets) || 0;
  const locked = Number(source.locked_asset_count ?? source.locked_assets) || 0;
  const original = Number(source.original_asset_count) || 0;
  const billable = Number(source.billable_asset_count) || 0;
  const asset = Number(source.asset_count) || 0;
  const billed =
    billable || original || (locked > 0 ? locked + visible : 0) || asset;
  return {
    asset_count: asset || billed,
    visible_asset_count: visible,
    locked_asset_count: locked,
    original_asset_count: original || billed,
    billable_asset_count: billed,
  };
}

export function billableAssetCount(source, fallback = 0) {
  return billingAssetBreakdown(source).billable_asset_count || Number(fallback) || 0;
}

/** Distinct IPv4/IPv6 count from backend — never host_count / Nessus row count / file count. */
export function uniqueIpCountFields(source) {
  if (source == null || typeof source !== "object") return 0;
  const direct = Number(
    source.unique_ip_count ??
      source.merged_unique_ip_count ??
      source.total_unique_ips ??
      source.unique_ips,
  );
  const directOk = Number.isFinite(direct) && direct > 0;

  // Multi-file upload: per-file unique counts (never use results.length as IPs).
  const buckets = [];
  if (Array.isArray(source.results)) buckets.push(...source.results);
  if (Array.isArray(source.files)) buckets.push(...source.files);
  let partSum = 0;
  let partSaw = false;
  buckets.forEach((row) => {
    if (row == null || typeof row === "string") return;
    const n = Number(
      row.unique_ip_count ?? row.merged_unique_ip_count ?? row.unique_ips ?? 0,
    );
    if (Number.isFinite(n) && n > 0) {
      partSum += n;
      partSaw = true;
    }
  });

  if (directOk) {
    // If top-level equals file count but per-file IPs are larger, top-level was file-count leak.
    if (partSaw && buckets.length > 1 && direct === buckets.length && partSum > direct) {
      return partSum;
    }
    return direct;
  }
  if (partSaw) return partSum;

  if (source.data && typeof source.data === "object" && source.data !== source) {
    return uniqueIpCountFields(source.data);
  }
  return 0;
}

/** Unique hosts parsed from the file — unique IPs first, never inflated original. */
export function uniqueHostCountFromPayload(source) {
  return uniqueIpCountFields(source);
}

/** Full file IP total when Freemium has trimmed the visible list to 5. */
export function fullFileIpCount(source) {
  if (!source || typeof source !== "object") return 0;
  const unique = uniqueIpCountFields(source);
  if (unique) return unique;
  const b = billingAssetBreakdown(source);
  if (b.locked_asset_count > 0) {
    const visible = b.visible_asset_count || FREEMIUM_VISIBLE_ASSET_LIMIT;
    return visible + b.locked_asset_count;
  }
  const total =
    Number(source.total_unique_ips) ||
    0;
  return total > FREEMIUM_VISIBLE_ASSET_LIMIT ? total : 0;
}

export function detectedFileAssetCount(source, fallback = 0) {
  if (!source || typeof source !== "object") return Number(fallback) || 0;
  return fullFileIpCount(source) || Number(fallback) || 0;
}

/**
 * File IP count for the recommended-plan screen.
 * Unique IPs first. If the visible list is Freemium-capped at 5, use locked+visible / original.
 * Never use Nessus host_count (inflates 9 unique IPs to 11 hosts).
 */
export function recommendPlanAssetCount(...sources) {
  let uniqueBest = 0;
  let fullBest = 0;
  const visit = (source) => {
    if (source == null || source === "") return;
    if (typeof source === "number") {
      return;
    }
    if (typeof source === "string") {
      return;
    }
    if (Array.isArray(source)) {
      source.forEach(visit);
      return;
    }
    if (typeof source !== "object") return;
    const unique = uniqueIpCountFields(source);
    if (unique) uniqueBest = Math.max(uniqueBest, unique);
    const full = fullFileIpCount(source);
    if (full) fullBest = Math.max(fullBest, full);
    if (source.results) visit(source.results);
    if (source.data && source.data !== source) visit(source.data);
    if (source.freemiumUpgrade) visit(source.freemiumUpgrade);
    if (source.freemium_upgrade) visit(source.freemium_upgrade);
  };
  sources.forEach(visit);
  return uniqueBest || fullBest;
}

/** Original file size for Premium checkout (visible + locked), not the Freemium 5. */
export function fullReportAssetCount(source, fallback = 0) {
  return billableAssetCount(source, Number(fallback) || 0);
}

export function formatLockedUpgradeNotice(source) {
  const b = billingAssetBreakdown(source);
  if (b.locked_asset_count <= 0) return "";
  const all =
    detectedFileAssetCount(source) ||
    b.original_asset_count ||
    b.billable_asset_count;
  const visible = b.visible_asset_count || FREEMIUM_VISIBLE_ASSET_LIMIT;
  const locked = Math.max(0, all - visible);
  if (!all) return "";
  return `Pricing for all ${all} IPs from your uploaded report — ${visible} are currently visible, ${locked} more unlock automatically once you upgrade.`;
}

export function storeBillableAssetCount(count) {
  const n = Number(count) || 0;
  if (n <= 0) return;
  try {
    sessionStorage.setItem(BILLABLE_ASSET_COUNT_KEY, String(n));
  } catch {
    /* ignore */
  }
}

export function peekBillableAssetCount() {
  try {
    return Number(sessionStorage.getItem(BILLABLE_ASSET_COUNT_KEY)) || 0;
  } catch {
    return 0;
  }
}

export function rememberFullAssetCount(source, fallback = 0) {
  const n = uniqueIpCountFields(source) || fullReportAssetCount(source, fallback);
  if (n > FREEMIUM_VISIBLE_ASSET_LIMIT) storeBillableAssetCount(n);
  else if (n > 0) storeBillableAssetCount(Math.max(n, peekBillableAssetCount()));
  return n;
}

export function suggestedPlanFromAssetCount(count) {
  const n = Number(count) || 0;
  if (n > 250) return "custom";
  if (n > FREEMIUM_VISIBLE_ASSET_LIMIT) return "premium";
  return "freemium";
}

export function planDisplayName(planOrSubscription) {
  const plan = String(
    typeof planOrSubscription === "string"
      ? planOrSubscription
      : planOrSubscription?.plan || "plan",
  );
  if (!plan) return "Plan";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function otherPlans(suggested) {
  return ["freemium", "premium", "custom"].filter((id) => id !== suggested);
}

export function setBillingReturnTo(path) {
  if (typeof path === "string" && path.startsWith("/")) {
    sessionStorage.setItem(BILLING_RETURN_TO_KEY, path);
  }
}

export function consumeBillingReturnTo(fallback = "/admindashboardonboarding") {
  const path = sessionStorage.getItem(BILLING_RETURN_TO_KEY);
  sessionStorage.removeItem(BILLING_RETURN_TO_KEY);
  if (typeof path === "string" && path.startsWith("/")) return path;
  return fallback;
}

export function peekBillingReturnTo() {
  const path = sessionStorage.getItem(BILLING_RETURN_TO_KEY);
  if (typeof path === "string" && path.startsWith("/")) return path;
  return "";
}

export function clearBillingReturnTo() {
  try {
    sessionStorage.removeItem(BILLING_RETURN_TO_KEY);
  } catch {
    /* ignore */
  }
}

const FREEMIUM_ACTIVE_NOTICE_KEY = "vaptfix_freemium_active_notice";

export function markFreemiumActiveNotice() {
  try {
    sessionStorage.setItem(FREEMIUM_ACTIVE_NOTICE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function consumeFreemiumActiveNotice() {
  try {
    const show = sessionStorage.getItem(FREEMIUM_ACTIVE_NOTICE_KEY) === "1";
    sessionStorage.removeItem(FREEMIUM_ACTIVE_NOTICE_KEY);
    return show;
  } catch {
    return false;
  }
}

export function extraIpCount(total, limit) {
  const count = Number(total) || 0;
  if (!Number.isFinite(limit)) return 0;
  return Math.max(0, count - limit);
}

export function parsePlanHintFromMessage(text) {
  const s = String(text || "");
  const countMatch =
    s.match(/this report has\s+(\d+)/i) ||
    s.match(/has\s+(\d+)\s+(?:internal\s+)?ips/i) ||
    s.match(/(\d+)\s+assets/i);
  const count = countMatch ? Number(countMatch[1]) : 0;
  const suggested = count ? suggestedPlanFromAssetCount(count) : "";
  return { count, suggested };
}

export function plansThatCoverCount(count) {
  const n = Number(count) || 0;
  return ["freemium", "premium", "custom"].filter((id) => {
    if (id === "freemium") return true;
    const limit = planAssetLimit(id);
    return !Number.isFinite(limit) || n <= limit;
  });
}

export function localPremiumEstimate(assetCount, mode, billingCycle) {
  const n = Number(assetCount) || 0;
  if (n <= 0) return null;
  if (n > 250) {
    return {
      plan: "premium",
      asset_count: n,
      over_ceiling: true,
      message: "250+ assets — this account must use the Custom plan.",
      currency: "usd",
      amount_due: "0.00",
    };
  }
  const testing = mode === "testing" || mode === "management_testing";
  if (testing) {
    return {
      plan: "premium",
      mode: "management_testing",
      billing_cycle: "annual",
      asset_count: n,
      price_per_ip: "20.00",
      amount_due: (n * 20).toFixed(2),
      currency: "usd",
    };
  }
  const cycle =
    billingCycle === "semi" || billingCycle === "semi_annual"
      ? "semi_annual"
      : billingCycle === "monthly"
        ? "monthly"
        : "annual";
  const rate = cycle === "monthly" ? 2 : cycle === "semi_annual" ? 1.5 : 1.25;
  const months = cycle === "monthly" ? 1 : cycle === "semi_annual" ? 6 : 12;
  return {
    plan: "premium",
    mode: "management",
    billing_cycle: cycle,
    asset_count: n,
    price_per_ip: rate.toFixed(2),
    amount_due: (n * rate * months).toFixed(2),
    currency: "usd",
  };
}
