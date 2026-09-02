/** Canonical severity palette — matches Mitigation Criteria Timeline gauges. */
export const SEV = {
  critical: "#b42318",
  high: "#dc2626",
  medium: "#f59e0b",
  low: "#10b981",
};

export const SEV_BG = {
  critical: "#f8dede",
  high: "#fee2e2",
  medium: "#fef3c7",
  low: "#d1fae5",
};

export const SEV_CHART = [SEV.critical, SEV.high, SEV.medium, SEV.low];

export function canonSev(sev) {
  const key = String(sev || "").trim().toLowerCase();
  if (key.includes("critical")) return "critical";
  if (key.includes("high")) return "high";
  if (key.includes("medium")) return "medium";
  if (key.includes("low")) return "low";
  return "";
}

export function getSeverityColor(sev) {
  return SEV[canonSev(sev)] || "#64748b";
}

export function getSeverityBg(sev) {
  return SEV_BG[canonSev(sev)] || "#f1f5f9";
}
