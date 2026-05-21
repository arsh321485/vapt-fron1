/** Normalize API vulnerability rows for asset detail / accordion UI */

export function canonSeverity(sev) {
  const s = String(sev || '').trim().toLowerCase();
  if (s === 'critical') return 'Critical';
  if (s === 'high') return 'High';
  if (s === 'medium') return 'Medium';
  if (s === 'low') return 'Low';
  const raw = String(sev || '').trim();
  if (!raw) return 'Medium';
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
}

export function vulnDisplayName(v) {
  return String(v?.vul_name || v?.plugin_name || v?.vulnerability_name || '').trim();
}

export function vulnNameKey(v) {
  return vulnDisplayName(v).toLowerCase();
}

export function isActiveVulnStatus(status) {
  const s = String(status || '').trim().toLowerCase();
  if (!s) return true;
  return !['closed', 'resolved', 'fixed', 'remediated', 'complete', 'completed'].includes(s);
}

export function normalizeAssetVulnerability(v) {
  if (!v || typeof v !== 'object') return null;
  const name = vulnDisplayName(v) || 'Unnamed vulnerability';
  const severity = canonSeverity(v.severity || v.risk_factor || v.risk || 'Medium');
  const statusRaw = v.status || v.vuln_status || v.state || 'open';
  return {
    ...v,
    vul_name: name,
    plugin_name: v.plugin_name || name,
    vulnerability_name: v.vulnerability_name || name,
    severity,
    risk_factor: v.risk_factor || severity,
    status: statusRaw,
    description: v.description || v.synopsis || v.summary || '',
    cvss_score: v.cvss_score ?? v.cvss ?? v.cvss_base_score ?? null,
    cve: v.cve || v.cve_id || '',
    exposure: v.exposure || '',
  };
}

export function normalizeAssetVulnerabilityList(list) {
  return (Array.isArray(list) ? list : [])
    .map(normalizeAssetVulnerability)
    .filter(Boolean);
}

export function assetMatchesRegisterRow(row, assetIp) {
  const ip = String(assetIp || '').trim().toLowerCase();
  if (!ip) return false;
  const fields = [row.asset, row.host_name, row.ip, row.hostname, row.host];
  return fields.some(f => String(f || '').trim().toLowerCase() === ip);
}

export function buildVulnsFromRegister(registerRows, assetIp) {
  return normalizeAssetVulnerabilityList(
    (registerRows || []).filter(r => assetMatchesRegisterRow(r, assetIp)),
  );
}

export function matchesVulnStatusFilter(vuln, statusFilter) {
  if (!statusFilter?.length) return true;
  return statusFilter.some(f => {
    if (f === 'open') return isActiveVulnStatus(vuln?.status);
    if (f === 'closed') return !isActiveVulnStatus(vuln?.status);
    return false;
  });
}

/** Active vulns plus fixed-recently entries for Open/Closed status filters */
export function mergeAssetThreatVulnerabilities(activeVulns, closedFixVulns = []) {
  const list = normalizeAssetVulnerabilityList(activeVulns);
  const seen = new Set(list.map(vulnNameKey));
  (closedFixVulns || []).forEach(fix => {
    const name = vulnDisplayName(fix);
    const key = vulnNameKey(fix);
    if (!key || seen.has(key)) return;
    seen.add(key);
    list.push(
      normalizeAssetVulnerability({
        ...fix,
        vul_name: name,
        plugin_name: fix.plugin_name || name,
        vulnerability_name: fix.vulnerability_name || name,
        severity: fix.severity || fix.risk_factor || 'Medium',
        status: fix.status || 'closed',
        description: fix.description || '',
      }),
    );
  });
  return list;
}

export function filterOpenAssetVulnerabilities(vulns, closedFixVulns = []) {
  const closedNames = new Set();
  (closedFixVulns || []).forEach(v => {
    [v.plugin_name, v.vulnerability_name, v.vul_name].forEach(n => {
      const key = String(n || '').trim().toLowerCase();
      if (key) closedNames.add(key);
    });
  });

  return normalizeAssetVulnerabilityList(vulns).filter(v => {
    const key = vulnNameKey(v);
    return isActiveVulnStatus(v.status) && (!key || !closedNames.has(key));
  });
}

export function severityMatchesFilter(severity, activeFilters) {
  if (!activeFilters || activeFilters.includes('All')) return true;
  const sev = canonSeverity(severity);
  return activeFilters.some(f => canonSeverity(f) === sev);
}

/**
 * Manual review examples until API wires automation_level + automation_pct.
 * Critical → No 0% | High/Medium → Partial 50% | Low → Yes 100%
 */
export const AUTOMATION_DEMO_BY_SEVERITY = {
  Critical: { label: 'No', pct: 0, tier: 'no' },
  High: { label: 'Partial', pct: 50, tier: 'partial' },
  Medium: { label: 'Partial', pct: 50, tier: 'partial' },
  Low: { label: 'Yes', pct: 100, tier: 'yes' },
};

/** Senior UI demo: map known asset IPs → Yes / No / Partial */
export const AUTOMATION_DEMO_BY_ASSET = {
  '120.28.23.165': { label: 'Yes', pct: 100, tier: 'yes' },
  '210.14.23.65': { label: 'No', pct: 0, tier: 'no' },
  '210.14.23.73': { label: 'Partial', pct: 50, tier: 'partial' },
};

/** Fallback when IP not in map: 1st asset Yes, 2nd No, 3rd Partial */
export const AUTOMATION_DEMO_BY_INDEX = [
  { label: 'Yes', pct: 100, tier: 'yes' },
  { label: 'No', pct: 0, tier: 'no' },
  { label: 'Partial', pct: 50, tier: 'partial' },
];

export function getAutomationProfileForAsset(assetIp, assetIndex = null) {
  const ip = String(assetIp || '').trim().toLowerCase();
  if (ip && AUTOMATION_DEMO_BY_ASSET[ip]) {
    return { ...AUTOMATION_DEMO_BY_ASSET[ip] };
  }
  if (assetIndex != null && assetIndex >= 0 && assetIndex < AUTOMATION_DEMO_BY_INDEX.length) {
    return { ...AUTOMATION_DEMO_BY_INDEX[assetIndex] };
  }
  return null;
}

/** Automation profile per vul severity (demo until API provides automation_pct) */
export function getAutomationProfileForSeverity(severity, overrides = {}) {
  const canon = canonSeverity(severity);
  const fromMap = AUTOMATION_DEMO_BY_SEVERITY[canon];
  const presets = {
    critical: { label: 'No', pct: 0, tier: 'no' },
    high: { label: 'Partial', pct: 50, tier: 'partial' },
    medium: { label: 'Partial', pct: 50, tier: 'partial' },
    low: { label: 'Yes', pct: 100, tier: 'yes' },
  };
  const key = String(severity || 'medium').trim().toLowerCase();
  const base = fromMap || presets[key] || presets.medium;
  return { ...base, ...overrides };
}

function parseAutomationPct(automationPct) {
  if (automationPct === '' || automationPct == null) return null;
  const n = parseInt(String(automationPct).replace('%', '').trim(), 10);
  return Number.isFinite(n) ? n : null;
}

function buildAutomationResult(tier, label, pct) {
  const safePct = Math.min(Math.max(Number(pct) || 0, 0), 100);
  let barWidth = safePct;
  if (tier === 'yes' || tier === 'no') {
    barWidth = 100;
  }
  return {
    tier,
    label,
    pct: tier === 'yes' ? 100 : tier === 'no' ? 0 : safePct,
    barWidth,
    displayPct: tier === 'yes' ? '100%' : tier === 'no' ? '0%' : `${safePct}%`,
  };
}

function mapApiAutomationLevel(levelRaw, pctProp) {
  const L = String(levelRaw || '').trim().toLowerCase();
  if (L === 'yes' || pctProp >= 100) return buildAutomationResult('yes', 'Yes', 100);
  if (L === 'no' || pctProp <= 0) return buildAutomationResult('no', 'No', 0);
  if (L === 'partial' || L.includes('part')) {
    return buildAutomationResult('partial', 'Partial', pctProp > 0 && pctProp < 100 ? pctProp : 50);
  }
  if (pctProp >= 85) return buildAutomationResult('yes', 'Yes', 100);
  if (pctProp <= 0) return buildAutomationResult('no', 'No', 0);
  return buildAutomationResult('partial', 'Partial', pctProp);
}

/** API fields when present; else per-asset demo, else severity demo map */
export function resolveAutomationDisplay(automationLevel, automationPct, severity, assetIp = null, assetIndex = null) {
  const assetPreset = getAutomationProfileForAsset(assetIp, assetIndex);
  const preset = assetPreset || getAutomationProfileForSeverity(severity);
  const pctProp = parseAutomationPct(automationPct);
  const levelRaw = String(automationLevel || '').trim().toLowerCase();

  if (levelRaw && pctProp != null) {
    return mapApiAutomationLevel(levelRaw, pctProp);
  }

  if (levelRaw === 'yes') return buildAutomationResult('yes', 'Yes', 100);
  if (levelRaw === 'no') return buildAutomationResult('no', 'No', 0);
  if (levelRaw === 'partial' || levelRaw.includes('part')) {
    return buildAutomationResult('partial', 'Partial', pctProp ?? 50);
  }

  if (pctProp != null) {
    return mapApiAutomationLevel('', pctProp);
  }

  return buildAutomationResult(preset.tier, preset.label, preset.pct);
}

/** True when automated fix must be hidden (manual-only for this asset/demo). */
export function isAutomationNotAvailable(assetIp = null, assetIndex = null, severity = 'Medium') {
  const display = resolveAutomationDisplay('', '', severity, assetIp, assetIndex);
  return display.tier === 'no';
}
