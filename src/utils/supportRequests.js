export function extractSupportStepNumbers(item) {
  const nums = [];
  if (!item || typeof item !== "object") return nums;
  if (item.step_number != null && item.step_number !== "") {
    nums.push(Number(item.step_number));
  }
  const requested = String(item.step_requested || item.step || "").trim();
  if (requested && requested.toLowerCase() !== "all") {
    requested.split(",").forEach((part) => {
      const n = Number(String(part).trim());
      if (Number.isFinite(n)) nums.push(n);
    });
  }
  return [...new Set(nums.filter((n) => Number.isFinite(n) && n >= 1 && n <= 12))];
}

export function mapSupportRequestsByStep(requests = []) {
  const byStep = {};
  (Array.isArray(requests) ? requests : []).forEach((item) => {
    extractSupportStepNumbers(item).forEach((n) => {
      if (!byStep[n]) byStep[n] = item;
    });
  });
  return byStep;
}

export function raisedStepsFromRequests(requests = []) {
  return Object.keys(mapSupportRequestsByStep(requests)).map(Number);
}

export function filterSupportRequestsByVuln(requests = [], vulnName = "") {
  const target = String(vulnName || "").trim().toLowerCase();
  if (!target) return [];
  return (Array.isArray(requests) ? requests : []).filter((item) => {
    const name = String(item.vul_name || item.vulnerability_name || item.plugin_name || "").trim().toLowerCase();
    return name === target;
  });
}
