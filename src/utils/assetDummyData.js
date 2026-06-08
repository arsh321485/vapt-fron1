const makeVulns = (items) =>
  items.map((v, i) => ({
    id: `dummy-vuln-${i + 1}`,
    vul_name: v.name,
    vulnerability_name: v.name,
    severity: v.severity,
    status: v.status || 'open',
    description: v.description,
  }));

export const DUMMY_WEB_APP_ASSETS = [
  {
    id: 'web-1',
    asset: 'https://app.vaptfix-demo.com',
    member_type: 'webapp',
    resolved_ip: '203.0.113.45',
    description:
      'Primary customer-facing web application used for account login, dashboard access, and API integrations. Hosted on cloud infrastructure with public HTTPS endpoints. Regular scans cover authentication flows, session handling, and input validation across all exposed routes.',
    _isDummy: true,
    severity_counts: { critical: 1, high: 2, medium: 1, low: 0 },
    dummyVulns: makeVulns([
      {
        name: 'SQL Injection in Login Form',
        severity: 'Critical',
        description: 'User input is not sanitized on the authentication endpoint.',
      },
      {
        name: 'Cross-Site Scripting (Reflected)',
        severity: 'High',
        description: 'Reflected XSS found in search query parameter.',
      },
      {
        name: 'Missing Content-Security-Policy Header',
        severity: 'Medium',
        description: 'CSP header is not configured on public pages.',
      },
    ]),
  },
  {
    id: 'web-2',
    asset: 'https://portal.acmecorp.io/dashboard',
    member_type: 'webapp',
    resolved_ip: '198.51.100.12',
    description:
      'Internal employee portal providing access to company tools, reports, and admin dashboards. Runs behind corporate SSO with multiple third-party JavaScript dependencies. Monitored for outdated libraries, insecure cookies, and misconfigured security headers.',
    _isDummy: true,
    severity_counts: { critical: 0, high: 1, medium: 2, low: 1 },
    dummyVulns: makeVulns([
      {
        name: 'Outdated jQuery Library (3.4.1)',
        severity: 'High',
        description: 'Frontend dependency has known CVEs.',
      },
      {
        name: 'Insecure Cookie Flags',
        severity: 'Medium',
        description: 'Session cookie missing Secure and HttpOnly attributes.',
      },
    ]),
  },
  {
    id: 'web-3',
    asset: 'https://admin.internal-tools.net',
    member_type: 'webapp',
    resolved_ip: '192.0.2.88',
    description:
      'Administrative web console for internal IT operations and configuration management. Restricted to VPN users but still internet-reachable through a reverse proxy. Assessment focuses on access controls, directory exposure, and transport security hardening.',
    _isDummy: true,
    severity_counts: { critical: 0, high: 0, medium: 1, low: 2 },
    dummyVulns: makeVulns([
      {
        name: 'Directory Listing Enabled',
        severity: 'Medium',
        description: 'Static assets directory allows directory browsing.',
      },
      {
        name: 'Missing HSTS Header',
        severity: 'Low',
        description: 'Strict-Transport-Security header is not set.',
      },
    ]),
  },
];

export const DUMMY_FIREWALL_ASSETS = [
  {
    id: 'fw-1',
    asset: 'FW-CORE-01 (192.168.1.1)',
    member_type: 'firewall',
    resolved_ip: '192.168.1.1',
    description:
      'Core perimeter firewall protecting the primary data center network segment. Enforces inbound and outbound traffic policies for production workloads. Review covers overly permissive rules, legacy rule sets, and management interface exposure.',
    _isDummy: true,
    severity_counts: { critical: 0, high: 2, medium: 1, low: 0 },
    dummyVulns: makeVulns([
      {
        name: 'Overly Permissive Inbound Rule',
        severity: 'High',
        description: 'Rule allows ANY source to reach management port 443.',
      },
      {
        name: 'Unused Legacy Rule Set',
        severity: 'Medium',
        description: 'Deprecated rules from 2022 are still active.',
      },
    ]),
  },
  {
    id: 'fw-2',
    asset: 'Palo-Alto-Edge-GW',
    member_type: 'firewall',
    resolved_ip: '10.10.0.1',
    description:
      'Edge gateway firewall handling remote VPN access and north-south traffic filtering. Terminates SSL for remote users and routes traffic to internal applications. Checks include weak TLS versions, logging gaps, and remote access policy compliance.',
    _isDummy: true,
    severity_counts: { critical: 1, high: 1, medium: 0, low: 1 },
    dummyVulns: makeVulns([
      {
        name: 'TLS 1.0 Enabled on VPN Portal',
        severity: 'Critical',
        description: 'Weak protocol still accepted on remote access gateway.',
      },
      {
        name: 'Logging Not Enabled for Deny Rules',
        severity: 'Low',
        description: 'Denied traffic is not being logged for audit.',
      },
    ]),
  },
  {
    id: 'fw-3',
    asset: 'FortiGate-DC-02',
    member_type: 'firewall',
    resolved_ip: '172.16.0.254',
    description:
      'Data center firewall appliance managing east-west segmentation between application tiers. Controls traffic between web, app, and database zones. Configuration review targets default accounts, geo-blocking settings, and high-risk allow rules.',
    _isDummy: true,
    severity_counts: { critical: 0, high: 1, medium: 2, low: 0 },
    dummyVulns: makeVulns([
      {
        name: 'Default Admin Account Active',
        severity: 'High',
        description: 'Built-in administrator account has not been renamed.',
      },
      {
        name: 'Geo-Blocking Not Configured',
        severity: 'Medium',
        description: 'Traffic from high-risk regions is not restricted.',
      },
    ]),
  },
];

export const DUMMY_SERVER_ASSETS = [
  {
    id: 'srv-1',
    asset: 'prod-db-01.internal (10.0.4.12)',
    member_type: 'server',
    resolved_ip: '10.0.4.12',
    description:
      'Production database server hosting customer transactional data and reporting schemas. Runs on hardened Linux with restricted SSH access from jump hosts only. Vulnerability scope includes patch level, OpenSSL version, and weak cryptographic settings.',
    _isDummy: true,
    severity_counts: { critical: 1, high: 1, medium: 0, low: 0 },
    dummyVulns: makeVulns([
      {
        name: 'Unpatched OpenSSL (CVE-2024-XXXX)',
        severity: 'Critical',
        description: 'Server is running an outdated OpenSSL build.',
      },
      {
        name: 'SSH Weak Key Exchange',
        severity: 'High',
        description: 'SSH server allows weak KEX algorithms.',
      },
    ]),
  },
  {
    id: 'srv-2',
    asset: 'web-srv-192.168.10.45',
    member_type: 'server',
    resolved_ip: '192.168.10.45',
    description:
      'Public-facing web server serving marketing pages and lightweight application APIs. Apache-based stack with multiple virtual hosts and debug endpoints in staging paths. Scanning covers web server version, exposed admin paths, and missing security patches.',
    _isDummy: true,
    severity_counts: { critical: 0, high: 2, medium: 1, low: 0 },
    dummyVulns: makeVulns([
      {
        name: 'Apache HTTP Server 2.4.49',
        severity: 'High',
        description: 'Web server version is vulnerable to path traversal.',
      },
      {
        name: 'Exposed Debug Endpoint',
        severity: 'Medium',
        description: '/debug/status is reachable without authentication.',
      },
    ]),
  },
  {
    id: 'srv-3',
    asset: 'mail-server-01.corp.local',
    member_type: 'server',
    resolved_ip: '10.20.30.41',
    description:
      'Corporate mail relay server handling internal and external SMTP traffic for the organization. Integrated with Active Directory for authentication and relay policies. Assessment includes TLS enforcement, OS patch cadence, and open relay misconfigurations.',
    _isDummy: true,
    severity_counts: { critical: 0, high: 0, medium: 2, low: 1 },
    dummyVulns: makeVulns([
      {
        name: 'SMTP STARTTLS Not Enforced',
        severity: 'Medium',
        description: 'Mail relay accepts plaintext connections.',
      },
      {
        name: 'Missing OS Security Updates',
        severity: 'Low',
        description: 'Last patch cycle was 45 days ago.',
      },
    ]),
  },
];

export const ASSET_TYPE_FILTERS = [
  { key: 'assets', label: 'Assets' },
  { key: 'webapp', label: 'Web App' },
  { key: 'firewall', label: 'Firewall' },
  { key: 'server', label: 'Server' },
];

export function getDummyAssetsByType(type) {
  if (type === 'webapp') return DUMMY_WEB_APP_ASSETS;
  if (type === 'firewall') return DUMMY_FIREWALL_ASSETS;
  if (type === 'server') return DUMMY_SERVER_ASSETS;
  return [];
}
