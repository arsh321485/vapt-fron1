export const PYTHON_OS_TABS = [
  { id: 'windows', label: 'Windows', icon: 'bi-windows' },
  { id: 'linux', label: 'Linux', icon: 'bi-ubuntu' },
  { id: 'macos', label: 'macOS', icon: 'bi-apple' },
];

const SHARED_TAIL = {
  libraries: {
    title: 'Install script libraries',
    text: 'Use the same libraries shown in the Automated Fix panel for this vulnerability.',
    command: 'pip install paramiko requests',
  },
  run: {
    title: 'Run remediation script',
    text: 'Change to the folder containing the downloaded .py file, then run the command from “Command to run script” (start with --dry-run when shown).',
    command: 'python nfh_auto_remediate.py --hosts-file hosts.txt --dry-run',
  },
};

export const PYTHON_INSTALL_STEPS_BY_OS = {
  windows: [
    {
      title: 'Download Python 3.10 or newer',
      text: 'Get the Windows installer from python.org. Choose the 64-bit installer unless your environment requires 32-bit.',
    },
    {
      title: 'Enable Add Python to PATH during setup',
      text: 'On the first installer screen, check “Add python.exe to PATH” (or use “Customize installation” and enable it). This lets you run python and pip from any terminal.',
    },
    {
      title: 'Verify installation',
      text: 'Open Command Prompt or PowerShell and confirm Python and pip are available.',
      command: 'python --version && pip --version',
    },
    {
      title: 'Upgrade pip (recommended)',
      command: 'python -m pip install --upgrade pip',
    },
    { ...SHARED_TAIL.libraries },
    { ...SHARED_TAIL.run },
  ],
  linux: [
    {
      title: 'Install Python 3.10+ (Debian / Ubuntu)',
      text: 'Open a terminal and install Python 3 and pip using your package manager.',
      command: 'sudo apt update && sudo apt install -y python3 python3-pip python3-venv',
    },
    {
      title: 'Install Python 3.10+ (RHEL / CentOS / Fedora)',
      text: 'On RHEL-based systems, use dnf or yum to install Python 3 and pip.',
      command: 'sudo dnf install -y python3 python3-pip',
    },
    {
      title: 'Verify installation',
      text: 'Confirm python3 and pip3 are available. On many Linux systems, use python3 instead of python.',
      command: 'python3 --version && pip3 --version',
    },
    {
      title: 'Upgrade pip (recommended)',
      command: 'python3 -m pip install --upgrade pip',
    },
    {
      title: 'Install script libraries',
      text: 'Use the same libraries shown in the Automated Fix panel for this vulnerability.',
      command: 'pip3 install paramiko requests',
    },
    {
      title: 'Run remediation script',
      text: 'Change to the script folder, then run the command from “Command to run script” (start with --dry-run when shown).',
      command: 'python3 nfh_auto_remediate.py --hosts-file hosts.txt --dry-run',
    },
  ],
  macos: [
    {
      title: 'Install Python 3.10+ (Homebrew — recommended)',
      text: 'Install Homebrew if needed, then install the latest Python 3.',
      command: 'brew install python@3.12',
    },
    {
      title: 'Alternative: Official macOS installer',
      text: 'Download the macOS installer from python.org and run the package. Enable “Add Python to PATH” if the installer offers it.',
    },
    {
      title: 'Verify installation',
      text: 'Open Terminal and confirm Python 3 and pip are available.',
      command: 'python3 --version && pip3 --version',
    },
    {
      title: 'Upgrade pip (recommended)',
      command: 'python3 -m pip install --upgrade pip',
    },
    {
      title: 'Install script libraries',
      text: 'Use the same libraries shown in the Automated Fix panel for this vulnerability.',
      command: 'pip3 install paramiko requests',
    },
    {
      title: 'Run remediation script',
      text: 'Change to the script folder, then run the command from “Command to run script” (start with --dry-run when shown).',
      command: 'python3 nfh_auto_remediate.py --hosts-file hosts.txt --dry-run',
    },
  ],
};

/** @deprecated Use PYTHON_INSTALL_STEPS_BY_OS.windows */
export const PYTHON_INSTALL_STEPS = PYTHON_INSTALL_STEPS_BY_OS.windows;

export const PYTHON_DEFAULTS_BY_SEVERITY = {
  critical: { pipCommand: 'pip install paramiko', runCommand: 'python nfh_auto_detect.py --host <HOST> --dry-run' },
  high: { pipCommand: 'pip install paramiko', runCommand: 'python nfh_auto_remediate.py --host <HOST> --dry-run' },
  medium: { pipCommand: 'pip install paramiko requests', runCommand: 'python nfh_auto_remediate.py --hosts-file hosts.txt --dry-run' },
  low: { pipCommand: 'pip install paramiko', runCommand: 'python nfh_auto_remediate.py --remediate --dry-run' },
};

function pipCommandForOs(os, pipCommand) {
  if (!pipCommand) return null;
  if (os === 'windows') return pipCommand;
  return pipCommand.replace(/\bpip\b/g, 'pip3').replace(/^python\b/, 'python3');
}

function runCommandForOs(os, runCommand) {
  if (!runCommand) return null;
  if (os === 'windows') return runCommand;
  return runCommand.replace(/\bpython\b/g, 'python3');
}

export function buildPythonStepsForOs(os, pipCommand = '', runCommand = '') {
  const key = PYTHON_INSTALL_STEPS_BY_OS[os] ? os : 'windows';
  const steps = PYTHON_INSTALL_STEPS_BY_OS[key];
  const libIdx = steps.findIndex(s => s.title === SHARED_TAIL.libraries.title);
  const runIdx = steps.findIndex(s => s.title === SHARED_TAIL.run.title);
  const resolvedPip = pipCommandForOs(key, pipCommand) || steps[libIdx]?.command;
  const resolvedRun = runCommandForOs(key, runCommand) || steps[runIdx]?.command;

  return steps.map((step, i) => {
    const copy = { ...step };
    if (i === libIdx && copy.command) copy.command = resolvedPip;
    if (i === runIdx && copy.command) copy.command = resolvedRun;
    return copy;
  });
}
