const SEV_KEYS = ["critical", "high", "medium", "low"];

export function parseDurationToDays(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const str = String(value).trim().toLowerCase();
  if (!str || str === "--" || str === "null" || str === "undefined" || str === "n/a") return null;
  if (str === "overdue") return 0;
  const match = str.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  let n = Number(match[1]);
  if (!Number.isFinite(n)) return null;
  if (str.includes("week")) n *= 7;
  return n;
}

export function unwrapSummaryPayload(raw) {
  if (!raw || typeof raw !== "object") return {};
  const nested = raw.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    if (
      nested.mitigation_timeline != null ||
      nested.mitigationTimeline != null ||
      nested.total_assets != null ||
      nested.vulnerabilities != null ||
      nested.mean_time_remediate != null
    ) {
      return nested;
    }
  }
  return raw;
}

function fromArrayTimeline(rows) {
  const out = {};
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const sev = String(row.severity || row.risk || row.name || row.key || "").toLowerCase();
    if (SEV_KEYS.includes(sev)) out[sev] = row;
  }
  return Object.keys(out).length ? out : null;
}

export function extractMitigationTimeline(payload) {
  const p = unwrapSummaryPayload(payload);
  const raw =
    p.mitigation_timeline ??
    p.mitigationTimeline ??
    p.mitigation ??
    p.timeline ??
    p.by_severity ??
    null;
  if (!raw) return null;
  if (Array.isArray(raw)) return fromArrayTimeline(raw);
  if (typeof raw !== "object") return null;
  if (Array.isArray(raw.severities)) {
    const mapped = fromArrayTimeline(raw.severities);
    if (mapped) return mapped;
  }
  return raw;
}

export function timelineHasValues(timeline) {
  if (!timeline || typeof timeline !== "object") return false;
  return SEV_KEYS.some((sev) => {
    const v =
      timeline[sev] ??
      timeline[sev.charAt(0).toUpperCase() + sev.slice(1)];
    if (v == null) return false;
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v === "string") return Boolean(v.trim() && v.trim() !== "--");
    if (typeof v === "object") {
      return (
        parseDurationToDays(v.remaining_days) != null ||
        parseDurationToDays(v.days) != null ||
        parseDurationToDays(v.sla_days) != null ||
        parseDurationToDays(v.value) != null ||
        (String(v.remaining_label || "").trim() && String(v.remaining_label).trim() !== "--") ||
        String(v.status || "").toLowerCase() === "overdue"
      );
    }
    return false;
  });
}

export function resolveMitigationDays(sevData, criteriaValue) {
  if (typeof sevData === "number" || typeof sevData === "string") {
    const n = parseDurationToDays(sevData);
    if (n != null) return n;
  }
  if (sevData && typeof sevData === "object") {
    const n = parseDurationToDays(
      sevData.remaining_days ??
        sevData.days ??
        sevData.sla_days ??
        sevData.value ??
        sevData.remaining_label,
    );
    if (n != null) return n;
  }
  return parseDurationToDays(criteriaValue);
}

export function resolveMitigationLabel(sevData, days, formatTimeline) {
  if (sevData && typeof sevData === "object") {
    const label = String(sevData.remaining_label || "").trim();
    if (label && label !== "--") return label;
    if (String(sevData.status || "").toLowerCase() === "overdue") return "Overdue";
  }
  if (typeof sevData === "string") {
    const trimmed = sevData.trim();
    if (trimmed && trimmed !== "--" && Number.isNaN(Number(trimmed))) return trimmed;
  }
  return formatTimeline({ days });
}

export function extractRiskCriteriaRecord(payload) {
  if (!payload || typeof payload !== "object") return null;
  if (Array.isArray(payload) && payload.length) return payload[0];
  const nested = payload.data && typeof payload.data === "object" ? payload.data : null;
  const list =
    payload.risk_criteria ||
    payload.results ||
    nested?.risk_criteria ||
    nested?.results;
  if (Array.isArray(list) && list.length) return list[0];
  if (payload.critical !== undefined || payload.high !== undefined) return payload;
  if (nested && (nested.critical !== undefined || nested.high !== undefined)) return nested;
  return null;
}
