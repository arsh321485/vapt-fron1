import { canonSeverity } from '@/utils/assetVulnerabilities';

export const TOOLBOX_OS_TABS = [
  { id: 'linux', label: 'LINUX', icon: 'bi-ubuntu' },
  { id: 'windows', label: 'WINDOWS', icon: 'bi-windows' },
  { id: 'macos', label: 'MACOS', icon: 'bi-apple' },
];

const DEFAULT_LIBRARIES = ['Python 3.8+', 'paramiko', 'requests'];

const OS_STEPS = {
  linux: [
    'Open a terminal with sudo privileges on the target host.',
    'Copy the remediation script to the server and mark it executable: chmod +x remediate.sh',
    'Run the script in strict mode, then verify services with systemctl status.',
    'Re-run the VAPT scanner against the asset to confirm the finding is resolved.',
  ],
  windows: [
    'Launch PowerShell as Administrator.',
    'Run the provided .ps1 script from the root directory.',
    'Restart the Windows service that hosts the affected component (e.g. IIS or the app pool).',
    'Validate the fix with Test-NetConnection or your vendor health check.',
  ],
  macos: [
    'Open Terminal and navigate to the folder containing the remediation package.',
    'Run the shell script with bash and review the dry-run output first.',
    'Apply the configuration change and restart the affected daemon.',
    'Confirm remediation using curl or openssl s_client against the endpoint.',
  ],
};

const CONSIDERATIONS = {
  default:
    'Applying this fix may require a brief service restart. Patch staging environments first, then roll changes to production during an approved maintenance window.',
  tls: 'Disabling legacy TLS versions can break older clients. Validate application compatibility in staging before enforcing TLS 1.2+ in production.',
  log4j: 'Applying this patch requires a hard restart of all Java-based microservices. High-availability clusters should be patched in a rolling manner.',
  hsts: 'Enabling HSTS affects all HTTPS clients. Ensure certificate validity and redirect rules are correct before sending the Strict-Transport-Security header.',
};

function pickConsideration(vulnName) {
  const n = String(vulnName || '').toLowerCase();
  if (n.includes('log4j') || n.includes('log4shell')) return CONSIDERATIONS.log4j;
  if (n.includes('tls') || n.includes('ssl')) return CONSIDERATIONS.tls;
  if (n.includes('hsts')) return CONSIDERATIONS.hsts;
  return CONSIDERATIONS.default;
}

function pickLibraries(vulnName) {
  const n = String(vulnName || '').toLowerCase();
  if (n.includes('log4j')) return ['Java 8+', 'Log4j 2.17.1', 'Maven 3.6'];
  if (n.includes('tls') || n.includes('hsts') || n.includes('ssl')) return ['OpenSSL 1.1.1+', 'Python 3.8+', 'paramiko'];
  return [...DEFAULT_LIBRARIES];
}

function pickShellSnippet(vulnName) {
  const slug = String(vulnName || 'remediation')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 48) || 'remediation';
  return `curl -sSL https://patch.vaptfix.pro/${slug} | bash -s -- --strict-mode`;
}

function pickCve(vulnName, cve) {
  if (cve) return String(cve).trim();
  const n = String(vulnName || '').toLowerCase();
  if (n.includes('log4j') || n.includes('log4shell')) return 'CVE-2021-44228';
  return '';
}

export function buildToolboxPayload({ vulnName = 'Remediation guide', severity = 'Medium', cve = '' } = {}) {
  const sev = canonSeverity(severity);
  const cveId = pickCve(vulnName, cve);
  const titleSuffix = cveId ? ` (${cveId})` : '';

  return {
    title: `${vulnName}${titleSuffix}`,
    severity: sev,
    severityRiskLabel: `${sev.toUpperCase()} RISK`,
    verifiedLabel: 'VERIFIED PATCH',
    libraries: pickLibraries(vulnName),
    shellSnippet: pickShellSnippet(vulnName),
    osSteps: OS_STEPS,
    consideration: pickConsideration(vulnName),
    disclaimer:
      'Disclaimer: Always test remediation scripts in a staging or development environment before production deployment.',
  };
}

export function getOsStepsForTab(osSteps, osId) {
  return osSteps?.[osId] || osSteps?.windows || [];
}
