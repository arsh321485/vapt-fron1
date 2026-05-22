export const TOOLBOX_DISCLAIMER =
  'Disclaimer: Always test remediation scripts in a staging or development environment before production deployment.';

export const TOOLBOX_OS_TAB_LABELS = {
  linux: 'LINUX',
  windows: 'WINDOWS',
  macos: 'MACOS',
};

export const TOOLBOX_FIXES = [
  {
    id: 'log4shell',
    title: 'Log4Shell RCE Fix (CVE-2021-44228)',
    icon: 'bi-patch-check',
    tags: [
      { label: 'Critical Risk', tone: 'error' },
      { label: 'Verified Patch', tone: 'secondary' },
    ],
    libraries: ['Java 8+', 'Log4j 2.17.1', 'Maven 3.6'],
    snippetLang: 'SHELL',
    snippet: 'curl -sSL https://patch.vaptfix.pro/log4j-shield | bash -s -- --strict-mode',
    osTabs: ['linux', 'windows', 'macos'],
    osSteps: {
      linux: [
        'Update your repository metadata: apt-get update',
        'Execute the remediation binary with root privileges.',
        'Verify status using the --check flag.',
      ],
      windows: [
        'Launch PowerShell as Administrator.',
        'Run the provided .ps1 script from the root directory.',
        'Restart Windows Service "LogSentry".',
      ],
      macos: [
        'Ensure Homebrew is updated: brew update',
        'Link the new log4j-core bottle to your local path.',
      ],
    },
    considerationIcon: 'bi-lightbulb',
    consideration:
      'Applying this patch requires a hard restart of all Java-based microservices. High availability clusters should be patched rolling.',
  },
  {
    id: 'ssl-cert',
    title: 'SSL Cert Renew & Hardening',
    icon: 'bi-lock',
    tags: [
      { label: 'Medium Risk', tone: 'secondary' },
      { label: 'Automated', tone: 'neutral' },
    ],
    libraries: ['OpenSSL 1.1.1+', 'Python 3.9', 'Certbot v2.0'],
    snippetLang: 'PYTHON',
    snippet: 'python3 renew_certs.py --domain secure.vaptfix.pro --force',
    osTabs: ['linux', 'windows', 'macos'],
    osSteps: {
      linux: [
        'Place the .py script in /opt/scripts/.',
        'Run with sudo to access /etc/letsencrypt/ directories.',
        'The script will automatically reload Nginx.',
      ],
      windows: [
        'Use the Windows Cert Manager to import the generated PFX file.',
        'IIS Binding must be updated manually via script flags.',
        'Ensure Port 443 is open.',
      ],
      macos: [
        'Keychain Access should be updated via CLI.',
        'Use security add-trusted-cert to finalize the chain.',
      ],
    },
    considerationIcon: 'bi-exclamation-triangle',
    consideration:
      'Requires a restart of Apache/Nginx service. Ensure DNS propagation is complete for Let\'s Encrypt validation.',
  },
  {
    id: 'ssh-hardening',
    title: 'SSH Protocol Hardening',
    icon: 'bi-terminal',
    tags: [
      { label: 'Low Risk', tone: 'secondary' },
      { label: 'Infrastructure', tone: 'neutral' },
    ],
    libraries: ['SSHd v8.0+', 'PAM Modules'],
    snippetLang: 'BASH',
    snippet: 'wget -O- https://bin.vaptfix.pro/harden-ssh | sudo bash',
    osTabs: ['linux', 'macos'],
    osSteps: {
      linux: [
        'Disables PasswordAuthentication in /etc/ssh/sshd_config.',
        'Enables PubKeyAuthentication only.',
        'Sets PermitRootLogin to no.',
      ],
      macos: [
        'Modifies System Preferences for Remote Login.',
        'Applies hardening via the security CLI tool.',
      ],
    },
    considerationIcon: 'bi-info-circle',
    consideration:
      'Ensure you have an active SSH key installed on the remote server before applying hardening, or you will be locked out.',
  },
];
