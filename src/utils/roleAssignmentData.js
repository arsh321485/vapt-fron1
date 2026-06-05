export const ROLE_ASSIGNMENT_CATALOG = {
  PM: {
    assets: [
      { id: "pm-a1", name: "192.168.1.10", os: "Windows Server 2019", severity: "High" },
      { id: "pm-a2", name: "192.168.1.22", os: "Ubuntu 20.04 LTS", severity: "Critical" },
      { id: "pm-a3", name: "10.0.4.55", os: "RHEL 8.6", severity: "Medium" },
    ],
    vulnerabilities: [
      { id: "pm-v1", name: "Missing Security Update (KB5034441)", asset: "192.168.1.10", severity: "High" },
      { id: "pm-v2", name: "End-of-Life Operating System", asset: "192.168.1.22", severity: "Critical" },
      { id: "pm-v3", name: "Unsupported Apache Version", asset: "10.0.4.55", severity: "Medium" },
    ],
  },
  CM: {
    assets: [
      { id: "cm-a1", name: "172.16.0.12", os: "Windows Server 2022", severity: "High" },
      { id: "cm-a2", name: "172.16.0.18", os: "Debian 11", severity: "Medium" },
      { id: "cm-a3", name: "172.16.0.30", os: "CentOS 7", severity: "Low" },
    ],
    vulnerabilities: [
      { id: "cm-v1", name: "Default Credentials", asset: "172.16.0.12", severity: "Critical" },
      { id: "cm-v2", name: "Missing HSTS Header", asset: "172.16.0.18", severity: "Medium" },
      { id: "cm-v3", name: "Weak TLS Configuration", asset: "172.16.0.30", severity: "Low" },
    ],
  },
  NS: {
    assets: [
      { id: "ns-a1", name: "10.10.1.1", os: "Cisco IOS", severity: "High" },
      { id: "ns-a2", name: "10.10.1.5", os: "FortiGate", severity: "Critical" },
      { id: "ns-a3", name: "10.10.2.8", os: "pfSense", severity: "Medium" },
    ],
    vulnerabilities: [
      { id: "ns-v1", name: "Open SMTP Port (25)", asset: "10.10.1.1", severity: "High" },
      { id: "ns-v2", name: "SSL/TLS Weak Cipher Suites", asset: "10.10.1.5", severity: "Critical" },
      { id: "ns-v3", name: "Firewall Rule Misconfiguration", asset: "10.10.2.8", severity: "Medium" },
    ],
  },
  AF: {
    assets: [
      { id: "af-a1", name: "app.vaptfix.local", os: "Web Application", severity: "Critical" },
      { id: "af-a2", name: "api.vaptfix.local", os: "REST API", severity: "High" },
      { id: "af-a3", name: "portal.vaptfix.local", os: "Portal Service", severity: "Medium" },
    ],
    vulnerabilities: [
      { id: "af-v1", name: "SQL Injection", asset: "app.vaptfix.local", severity: "Critical" },
      { id: "af-v2", name: "Cross-Site Scripting (XSS)", asset: "portal.vaptfix.local", severity: "High" },
      { id: "af-v3", name: "Insecure Direct Object Reference", asset: "api.vaptfix.local", severity: "Medium" },
    ],
  },
};

export function createEmptyRoleAssignments() {
  return {
    PM: { assets: [], vulnerabilities: [] },
    CM: { assets: [], vulnerabilities: [] },
    NS: { assets: [], vulnerabilities: [] },
    AF: { assets: [], vulnerabilities: [] },
  };
}

export function getAssignmentSummaryText(selectedRoles, roleAssignments) {
  let assets = 0;
  let vulns = 0;
  selectedRoles.forEach((roleShort) => {
    assets += roleAssignments[roleShort]?.assets?.length || 0;
    vulns += roleAssignments[roleShort]?.vulnerabilities?.length || 0;
  });
  return `${assets} asset${assets === 1 ? "" : "s"}, ${vulns} vul${vulns === 1 ? "" : "s"} selected`;
}

export function clearRoleAssignments(roleAssignments, roleShort) {
  if (!roleAssignments[roleShort]) return;
  roleAssignments[roleShort].assets = [];
  roleAssignments[roleShort].vulnerabilities = [];
}

export function resetAllRoleAssignments(roleAssignments) {
  Object.keys(roleAssignments).forEach((roleShort) => {
    clearRoleAssignments(roleAssignments, roleShort);
  });
}
