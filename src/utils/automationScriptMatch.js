/** Nessus findings have a numeric plugin_id. AWS/custom often have none. */

export function isNessusPluginId(value) {
  if (value == null || value === '') return false;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 && String(value).trim() === String(n);
}

export function vulnMatchName(vuln) {
  return String(
    vuln?.plugin_name ||
      vuln?.vul_name ||
      vuln?.vulnerability_name ||
      vuln?.vulnerability ||
      '',
  ).trim();
}

export function vulnMatchNameKey(vuln) {
  return vulnMatchName(vuln).toLowerCase();
}

export function splitFindingsForMatch(vulns) {
  const pluginIds = [];
  const names = [];
  const seenIds = new Set();
  const seenNames = new Set();

  (Array.isArray(vulns) ? vulns : []).forEach((v) => {
    const id = v?.plugin_id || v?.nessus_plugin_id || v?.pluginId;
    if (isNessusPluginId(id)) {
      const n = Number(id);
      if (!seenIds.has(n)) {
        seenIds.add(n);
        pluginIds.push(n);
      }
      return;
    }
    const name = vulnMatchName(v);
    const key = name.toLowerCase();
    if (name && !seenNames.has(key)) {
      seenNames.add(key);
      names.push(name);
    }
  });

  return { pluginIds, names };
}

export function unmatchedAutomationResult(name = '') {
  return {
    matched: false,
    vulnerability_name: name || '',
    message: 'No automated fix available for this vulnerability.',
  };
}

export function isPositiveAutomationMatch(data) {
  if (!data || typeof data !== 'object') return false;
  if (data.matched === false) return false;
  if (data.matched === true) return true;
  return !!(
    data.plugin_id ||
    data.fix_script_name ||
    data.script_name ||
    data.fix_script_path
  );
}

export function mergeMatchResultsIntoMap(map, results) {
  const next = { ...(map || {}) };
  (Array.isArray(results) ? results : []).forEach((row) => {
    if (!row || typeof row !== 'object') return;
    const pid = Number(row.plugin_id || 0);
    if (pid > 0) next[pid] = row;
    const name = String(
      row.vulnerability || row.vul_name || row.vulnerability_name || row.plugin_name || '',
    )
      .toLowerCase()
      .trim();
    if (name) next[`name:${name}`] = row;
  });
  return next;
}

export function getMatchedAutomation(vuln, automationScriptMap) {
  if (!vuln || !automationScriptMap) return null;
  const nameKey = vulnMatchNameKey(vuln);
  const byName = nameKey ? automationScriptMap[`name:${nameKey}`] : null;
  if (isPositiveAutomationMatch(byName)) return byName;

  const id = Number(vuln.plugin_id || vuln.nessus_plugin_id || vuln.automation_plugin_id || 0);
  const byId = id > 0 ? automationScriptMap[id] : null;
  if (isPositiveAutomationMatch(byId)) return byId;

  return byName || byId || null;
}

export async function matchAutomationScriptsForVulns({
  authStore,
  isUser,
  vulns,
  os,
}) {
  const { pluginIds, names } = splitFindingsForMatch(vulns);
  const collected = [];

  if (pluginIds.length) {
    const res = isUser
      ? await authStore.fetchAutomationScriptsBulk(pluginIds)
      : await authStore.fetchAutomationScriptsBulkAdmin(pluginIds);
    if (res.status && Array.isArray(res.results)) collected.push(...res.results);
  }

  if (names.length) {
    const res = isUser
      ? await authStore.fetchAutomationScriptsByName(names, os)
      : await authStore.fetchAutomationScriptsByNameAdmin(names, os);
    if (res.status && Array.isArray(res.results)) collected.push(...res.results);
  }

  return mergeMatchResultsIntoMap({}, collected);
}
