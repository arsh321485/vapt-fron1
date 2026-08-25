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
  return String(
    v?.vul_name || v?.plugin_name || v?.vulnerability_name || v?.vulnerability || '',
  ).trim();
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
  const fields = [
    row.asset,
    row.host_name,
    row.ip,
    row.hostname,
    row.host,
    row.resolved_ip,
  ];
  return fields.some(f => String(f || '').trim().toLowerCase() === ip);
}

export function filterDeletedVulnsForHost(vulns, hostName, deletedRows = []) {
  const host = String(hostName || '').trim();
  if (!host || !Array.isArray(vulns) || !vulns.length) return vulns || [];
  const deletedSet = buildDeletedVulnAssetSet(deletedRows);
  if (!deletedSet.size) return vulns;
  return vulns.filter((v) => {
    const plugin = v.vul_name || v.plugin_name || v.vulnerability_name;
    return !deletedSet.has(deletedVulnAssetKey(plugin, host));
  });
}

export function buildVulnsFromRegister(registerRows, assetIp, deletedRows = []) {
  const vulns = normalizeAssetVulnerabilityList(
    (registerRows || []).filter(r => assetMatchesRegisterRow(r, assetIp)),
  );
  return filterDeletedVulnsForHost(vulns, assetIp, deletedRows);
}

/** Extract fix session id from a register/vuln row (never use row.id / plugin id) */
export function extractFixVulnerabilityId(obj) {
  if (!obj || typeof obj !== 'object') return '';
  const candidates = [obj.fix_vulnerability_id, obj.fix_vuln_id, obj.fixVulnerabilityId];
  for (const value of candidates) {
    if (value != null && String(value).trim()) return String(value).trim();
  }
  return '';
}

/**
 * Extract fix session id from create/card API payloads.
 * Unlike register rows, create responses often expose Mongo `_id`.
 */
export function extractCreatedFixVulnerabilityId(obj) {
  if (!obj || typeof obj !== 'object') return '';
  const nested = obj.data && typeof obj.data === 'object' ? obj.data : null;
  return (
    extractFixVulnerabilityId(obj) ||
    extractFixVulnerabilityId(nested) ||
    (obj._id != null && String(obj._id).trim()) ||
    (nested?._id != null && String(nested._id).trim()) ||
    ''
  );
}

function recordHostKey(row) {
  return String(row?.host_name || row?.asset || row?.host || row?.hostname || '').trim().toLowerCase();
}

/** Match a vuln to its register row for the given asset IP */
export function lookupRegisterRow(registerRows, vuln, assetIp) {
  const key = vulnNameKey(vuln);
  const ip = String(assetIp || '').trim().toLowerCase();
  if (!key || !ip) return null;

  const rows = (registerRows || []).filter(r => assetMatchesRegisterRow(r, assetIp));
  const fixId = extractFixVulnerabilityId(vuln);
  if (fixId) {
    const byFixId = rows.find(r => extractFixVulnerabilityId(r) === fixId);
    if (byFixId) return byFixId;
  }
  return rows.find(r => vulnNameKey(r) === key) || null;
}

export function closedRecordsForHost(closedFixVulns = [], host = '') {
  const currentHost = String(host || '').trim().toLowerCase();
  return (closedFixVulns || []).filter((fix) => {
    if (!vulnNameKey(fix) && !extractFixVulnerabilityId(fix)) return false;
    const fixHost = recordHostKey(fix);
    if (currentHost && fixHost && fixHost !== currentHost) return false;
    return true;
  });
}

export function closedRecordMatchesVuln(fix, vuln) {
  if (!fix || !vuln) return false;
  const fixName = vulnNameKey(fix);
  const vulnName = vulnNameKey(vuln);
  if (fixName && vulnName) return fixName === vulnName;
  const fixId = extractFixVulnerabilityId(fix);
  const vulnId = extractFixVulnerabilityId(vuln);
  return Boolean(fixId && vulnId && String(fixId) === String(vulnId));
}

export function isVulnClosedOnHost(vuln, closedFixVulns = [], host = '') {
  const closedForHost = closedRecordsForHost(closedFixVulns, host);
  const matched = closedForHost.some((fix) => closedRecordMatchesVuln(fix, vuln));
  if (matched) return true;
  // If this host already has specific closed records, do not trust a blanket
  // "closed" status on a different plugin (same asset, different vuln).
  if (closedForHost.length) return false;
  return !isActiveVulnStatus(vuln?.status);
}

/** Resolve fix_vulnerability_id from register (never use row.id for step-complete API) */
export function lookupFixVulnerabilityId(registerRows, vuln, assetIp) {
  const fromVuln = extractFixVulnerabilityId(vuln);
  if (fromVuln) return fromVuln;

  const row = lookupRegisterRow(registerRows, vuln, assetIp);
  return extractFixVulnerabilityId(row);
}

/** Merge register-only fields onto asset vulnerability rows */
export function enrichVulnsFromRegister(vulns, registerRows, assetIp) {
  return (Array.isArray(vulns) ? vulns : []).map(v => {
    const row = lookupRegisterRow(registerRows, v, assetIp);
    if (!row) return v;
    const fixId = extractFixVulnerabilityId(row) || extractFixVulnerabilityId(v);
    return {
      ...v,
      fix_vulnerability_id: fixId || null,
      operating_system: row.operating_system || row.os || v.operating_system || '',
      // Enrich assigned_team from register (most reliable source)
      assigned_team: v.assigned_team || row.assigned_team || '',
    };
  });
}

export function matchesVulnStatusFilter(vuln, statusFilter) {
  if (!statusFilter?.length) return true;
  const isGrouped = vuln?.open_count != null && (vuln.total_assets != null || Array.isArray(vuln.assets));
  return statusFilter.some(f => {
    if (f === 'open') {
      if (isGrouped) return Number(vuln.open_count) > 0;
      return isActiveVulnStatus(vuln?.status);
    }
    if (f === 'closed') {
      if (isGrouped) return Number(vuln.open_count) === 0;
      return !isActiveVulnStatus(vuln?.status);
    }
    return false;
  });
}

/** Map GET /report/{id}/vulnerabilities/ rows for All Vulnerabilities tab */
export function normalizeReportVulnerability(v) {
  if (!v || typeof v !== 'object') return null;
  const name = String(v.plugin_name || v.vul_name || '').trim();
  if (!name) return null;
  const openCount = Number(v.open_count) || 0;
  const totalAssets = Number(v.total_assets) || 0;
  const severity = canonSeverity(v.severity || 'Medium');
  const status = openCount > 0 ? 'open' : 'closed';
  return {
    ...v,
    _key: name.toLowerCase(),
    vul_name: name,
    plugin_name: name,
    severity,
    status,
    cvss_score: v.cvss_score ?? null,
    vendor_fix_available: v.vendor_fix_available ?? '',
    assigned_team: v.assigned_team || '',
    total_assets: totalAssets,
    open_count: openCount,
    held_count: Number(v.held_count) || 0,
    deleted_count: Number(v.deleted_count) || 0,
    assets: [],
    rows: [],
    description: v.description || '',
    selected: false,
  };
}

export function normalizeReportVulnerabilityList(list) {
  return (Array.isArray(list) ? list : [])
    .map(normalizeReportVulnerability)
    .filter(Boolean);
}

function deletedVulnAssetKey(pluginName, hostName) {
  return `${String(pluginName || '').trim().toLowerCase()}::${String(hostName || '').trim()}`;
}

export function buildDeletedVulnAssetSet(deletedRows) {
  const set = new Set();
  (Array.isArray(deletedRows) ? deletedRows : []).forEach((row) => {
    const plugin = row?.plugin_name || row?.vul_name || '';
    const host = row?.host_name || row?.asset || row?.host || '';
    if (plugin && host) set.add(deletedVulnAssetKey(plugin, host));
  });
  return set;
}

export function enrichReportVulnerabilitiesFromRegister(grouped, registerRows, deletedRows = []) {
  const rows = Array.isArray(registerRows) ? registerRows : [];
  const deletedSet = buildDeletedVulnAssetSet(deletedRows);
  return grouped.map(g => {
    const key = g._key || vulnNameKey(g);
    const pluginName = g.vul_name || g.plugin_name || '';
    const matching = rows.filter(r => vulnNameKey(r) === key);
    if (!matching.length) return g;
    const assets = [...new Set(matching.map(r => r.asset || r.host_name).filter(Boolean))]
      .filter((host) => !deletedSet.has(deletedVulnAssetKey(pluginName, host)));
    const description = matching.find(r => r.description)?.description || g.description || '';
    return {
      ...g,
      assets: assets.length ? assets : g.assets,
      description,
      rows: matching,
    };
  });
}

export function reportVulnAssetCount(v) {
  const total = Number(v?.total_assets);
  const held = Number(v?.held_count) || 0;
  if (Number.isFinite(total) && total > 0) {
    return Math.max(0, total - held);
  }
  const open = Number(v?.open_count);
  if (Number.isFinite(open) && open >= 0) return open;
  return Array.isArray(v?.assets) ? v.assets.length : 0;
}

export function normalizeHeldVulnerabilityAsset(row, pluginName = '') {
  if (!row || typeof row !== 'object') return null;
  const name = String(row.plugin_name || row.vul_name || pluginName || '').trim();
  const host = String(row.host_name || row.asset || row.host || '').trim();
  if (!name || !host) return null;
  return {
    plugin_name: name,
    vul_name: name,
    host_name: host,
    severity: canonSeverity(row.severity || 'Medium'),
    status: row.status || 'held',
    _key: name.toLowerCase(),
    selected: false,
  };
}

export function normalizeHeldVulnerabilityAssetList(list, pluginName = '') {
  return (Array.isArray(list) ? list : [])
    .map(row => normalizeHeldVulnerabilityAsset(row, pluginName))
    .filter(Boolean);
}

/** Active vulns plus fixed-recently entries for Open/Closed status filters */
export function mergeAssetThreatVulnerabilities(activeVulns, closedFixVulns = [], host = '') {
  const closedForHost = closedRecordsForHost(closedFixVulns, host);
  const hostKey = String(host || '').toLowerCase();

  const list = normalizeAssetVulnerabilityList(activeVulns).map((v) => ({
    ...v,
    status: isVulnClosedOnHost(v, closedForHost, host) ? 'closed' : 'open',
  }));

  const seen = new Set(list.map((v) => `${recordHostKey(v) || hostKey}::${vulnNameKey(v)}`));
  closedForHost.forEach((fix) => {
    const name = vulnDisplayName(fix);
    const key = `${recordHostKey(fix) || hostKey}::${vulnNameKey(fix)}`;
    if (!vulnNameKey(fix) || seen.has(key)) return;
    seen.add(key);
    list.push(
      normalizeAssetVulnerability({
        ...fix,
        vul_name: name,
        plugin_name: fix.plugin_name || name,
        vulnerability_name: fix.vulnerability_name || name,
        severity: fix.severity || fix.risk_factor || 'Medium',
        status: 'closed',
        description: fix.description || '',
      }),
    );
  });
  return list;
}

export function filterOpenAssetVulnerabilities(vulns, closedFixVulns = [], host = '') {
  return normalizeAssetVulnerabilityList(vulns).filter((v) => !isVulnClosedOnHost(v, closedFixVulns, host));
}

function rowIdCandidates(row) {
  return [row?.id, row?.fix_vulnerability_id, row?.vulnerability_id]
    .map((v) => (v == null ? "" : String(v).trim()))
    .filter(Boolean);
}

function rowNameCandidates(row) {
  return [row?.vul_name, row?.vulnerability_name, row?.plugin_name]
    .map((v) => String(v || "").trim().toLowerCase())
    .filter(Boolean);
}

/** Match a Fixed Recently row to the on-page vulnerability accordion list. */
export function findVulnIndexInList(list, item) {
  const rows = Array.isArray(list) ? list : [];
  const itemIds = new Set(rowIdCandidates(item));
  if (itemIds.size) {
    const byId = rows.findIndex((v) => rowIdCandidates(v).some((id) => itemIds.has(id)));
    if (byId >= 0) return byId;
  }
  const itemNames = new Set(rowNameCandidates(item));
  if (!itemNames.size) return -1;
  return rows.findIndex((v) => rowNameCandidates(v).some((n) => itemNames.has(n)));
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
