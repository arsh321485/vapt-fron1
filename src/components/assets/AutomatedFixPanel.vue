<template>
  <div class="auto-tab-content">
    <!-- Row 1: Capability banner -->
    <div class="capability-banner" :style="theme.banner">
      <div class="cap-banner-top">
        <div class="cap-left">
          <div class="cap-label">Automation Possible</div>
          <div class="cap-value" :style="{ color: theme.accent }">
            {{ autoDisplay.label }} <span class="cap-pct">[{{ autoDisplay.displayPct }}]</span>
          </div>
        </div>
        <div class="cap-mid">
          <div class="cap-label">Script Name</div>
          <div class="cap-script">{{ resolvedScriptName }}</div>
        </div>
        <div v-if="showActions" class="cap-actions">
          <button
            type="button"
            class="cap-view-code-btn"
            title="View script code"
            aria-label="View script code"
            :style="{ color: theme.accent, borderColor: theme.banner.borderColor }"
            @click="$emit('view-code')"
          >
            <i class="bi bi-eye"></i>
          </button>
        </div>
      </div>
      <div class="cap-bar-col">
        <div class="cap-bar-track" :class="{ 'cap-bar-track--no': autoDisplay.tier === 'no', 'cap-bar-track--yes': autoDisplay.tier === 'yes' }">
          <div
            class="cap-bar-fill"
            :style="{ width: autoDisplay.barWidth + '%', background: theme.accent }"
          ></div>
        </div>
      </div>
    </div>

    <!-- Row 2: Script description -->
    <div class="detail-section">
      <div class="ds-label">Script Description</div>
      <p class="ds-text">{{ displayDescription }}</p>
      <button
        v-if="showDescriptionToggle"
        type="button"
        class="ds-read-more"
        @click="descriptionExpanded = !descriptionExpanded"
      >
        {{ descriptionExpanded ? 'Read less' : 'Read more' }}
      </button>
    </div>

    <!-- Row 3: Before / After execution -->
    <div class="two-col-grid">
      <div class="exec-check-card before-card">
        <div class="ecc-header">⏱ Considerations before execution</div>
        <ul class="chk-list">
          <li v-for="(line, i) in resolvedBefore" :key="'b' + i" class="chk-item">
            <span class="chk-dot">▸</span>{{ line }}
          </li>
        </ul>
      </div>
      <div class="exec-check-card after-card">
        <div class="ecc-header">✅ Considerations after execution</div>
        <ul class="chk-list">
          <li v-for="(line, i) in resolvedAfter" :key="'a' + i" class="chk-item chk-after">
            <span class="chk-dot">▸</span>{{ line }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Row 4: Libraries + download command -->
    <div class="libs-row-card">
      <div class="libs-left">
        <div class="ds-label">Libraries</div>
        <div class="libs-tags">
          <span v-for="lib in resolvedLibraries" :key="lib" class="lib-tag">{{ lib }}</span>
        </div>
      </div>
      <div class="libs-right">
        <div class="ds-label">Command to download libraries</div>
        <div class="cmd-inline">
          <code>{{ resolvedPip }}</code>
          <button
            type="button"
            class="copy-btn-sm"
            :title="copiedKey === 'pip' ? 'Copied!' : 'Copy command'"
            @click.stop="copyText(resolvedPip, 'pip')"
          >
            {{ copiedKey === 'pip' ? '✓' : '⎘' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Row 5: Can / Cannot -->
    <div class="two-col-grid">
      <div class="assess-col-card green-card">
        <div class="col-head green-head">✓ What can be automated</div>
        <ul class="can-list">
          <li v-for="(line, i) in resolvedCan" :key="'c' + i" class="can-item">
            <span class="can-dot">✓</span>{{ line }}
          </li>
        </ul>
      </div>
      <div class="assess-col-card red-card">
        <div class="col-head red-head">✗ What must remain manual</div>
        <ul class="can-list">
          <li v-for="(line, i) in resolvedManual" :key="'m' + i" class="cant-item">
            <span class="cant-dot">✗</span>{{ line }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Recommended approach -->
    <div class="recommended-box">
      <div class="rec-label">Recommended approach</div>
      <div class="rec-text">{{ resolvedRecommended }}</div>
    </div>

    <!-- Row 8: Command to run script -->
    <div class="run-cmd-card" :style="theme.runCard">
      <div class="run-cmd-header" :style="{ color: theme.runHeader }">
        <span class="run-cmd-title"><i class="bi bi-terminal" aria-hidden="true"></i> Command to run script</span>
      </div>
      <div class="run-cmd-block">
        <button
          type="button"
          class="copy-btn"
          :title="copiedKey === 'run' ? 'Copied!' : 'Copy command'"
          @click.stop="copyText(resolvedRun, 'run')"
        >
          {{ copiedKey === 'run' ? '✓ Copied' : '⎘ Copy' }}
        </button>
        <pre><code>{{ resolvedRun }}</code></pre>
      </div>
    </div>

  </div>
</template>

<script>
import { canonSeverity, resolveAutomationDisplay } from '@/utils/assetVulnerabilities';

const DESC_PREVIEW_LIMIT = 200;

const THEMES = {
  yes: {
    accent: '#16a34a',
    banner: { borderColor: '#86efac', background: '#f0fdf4' },
    runCard: { borderColor: '#86efac', background: '#f0fdf4' },
    runHeader: '#166534',
  },
  partial: {
    accent: '#d97706',
    banner: { borderColor: '#fde68a', background: '#fffbeb' },
    runCard: { borderColor: '#fde68a', background: '#fffbeb' },
    runHeader: '#92400e',
  },
  no: {
    accent: '#dc2626',
    banner: { borderColor: '#fca5a5', background: '#fef2f2' },
    runCard: { borderColor: '#fca5a5', background: '#fef2f2' },
    runHeader: '#991b1b',
  },
};

const DEFAULTS_BY_SEVERITY = {
  critical: {
    scriptName: 'nfh_c3_ripple20_isolate.py (VLAN isolation only)',
    scriptDescription:
      'Detection-only script. Connects to affected hosts, gathers version and configuration evidence, and outputs a verdict without making changes. Use results to decide whether to proceed with manual remediation. Full automation is not feasible until device identity and dependencies are confirmed.',
    pipCommand: 'pip install paramiko',
    libraries: ['paramiko', 're', 'subprocess'],
    runCommand: 'python nfh_auto_detect.py --host <HOST> --dry-run',
  },
  high: {
    scriptName: 'nfh_h1_struts_detect_multi.py',
    scriptDescription:
      'Two-phase script. Phase 1 runs pre-flight checks (connectivity, backups, version). Phase 2 applies remediation only after human approval. Phase 3 verifies the fix. Application-specific steps remain manual after staging validation.',
    pipCommand: 'pip install paramiko',
    libraries: ['paramiko', 'subprocess'],
    runCommand: 'python nfh_auto_remediate.py --host <HOST> --dry-run',
  },
  medium: {
    scriptName: 'nfh_auto_remediate.py',
    scriptDescription:
      'Partial automation script. Automates detection, backup, and verification steps; configuration changes and service reload require manual approval. Run with --dry-run first, then apply approved steps in a maintenance window.',
    pipCommand: 'pip install paramiko requests',
    libraries: ['paramiko', 'requests', 'ssl'],
    runCommand: 'python nfh_auto_remediate.py --hosts-file hosts.txt --dry-run',
  },
  low: {
    scriptName: 'nfh_auto_remediate.py',
    scriptDescription:
      'Full end-to-end remediation script. Detects vulnerable state, applies firewall or config rules via SSH, persists changes across reboots, and generates a JSON audit report. Low-risk finding with high automation confidence.',
    pipCommand: 'pip install paramiko',
    libraries: ['paramiko', 'subprocess'],
    runCommand: 'python nfh_auto_remediate.py --remediate --dry-run',
  },
};

const DEFAULT_BEFORE = [
  'Confirm SSH or WinRM access to the target host',
  'Raise a change request before any remediation in production',
  'Verify backups exist where the script modifies configuration or packages',
];
const DEFAULT_AFTER = [
  'Verify application connectivity after any service reload or reboot',
  'Save script output as pre/post remediation audit evidence',
  'Re-run Nessus targeted scan to confirm the finding is closed',
];
const DEFAULT_CAN = [
  'Detect affected services and versions across listed assets',
  'Apply network-level controls where appropriate (firewall rules)',
  'Run post-remediation verification scans from the scanner',
];
const DEFAULT_MANUAL = [
  'Validate business impact before applying patches in production',
  'Coordinate maintenance window and application owner sign-off',
  'Review remediation steps for environment-specific configuration',
];
const DEFAULT_REC =
  'Use automation for detection and verification where possible. Perform configuration changes and patching manually per the remediation timeline, with staging validation first.';

export default {
  name: 'AutomatedFixPanel',
  emits: ['view-code'],
  props: {
    showActions: { type: Boolean, default: true },
    severity: { type: String, default: '' },
    assetIp: { type: String, default: '' },
    assetIndex: { type: Number, default: null },
    automationLevel: { type: String, default: '' },
    automationPct: { type: [String, Number], default: '' },
    scriptName: { type: String, default: '' },
    scriptDescription: { type: String, default: '' },
    beforeItems: { type: Array, default: () => [] },
    afterItems: { type: Array, default: () => [] },
    libraries: { type: Array, default: () => [] },
    pipCommand: { type: String, default: '' },
    canAutomate: { type: Array, default: () => [] },
    mustManual: { type: Array, default: () => [] },
    recommendedText: { type: String, default: '' },
    runCommand: { type: String, default: '' },
  },
  data() {
    return {
      descriptionExpanded: false,
      copiedKey: null,
      _copyTimer: null,
    };
  },
  watch: {
    severity() {
      this.descriptionExpanded = false;
    },
    scriptDescription() {
      this.descriptionExpanded = false;
    },
  },
  computed: {
    autoDisplay() {
      return resolveAutomationDisplay(
        this.automationLevel,
        this.automationPct,
        canonSeverity(this.severity),
        this.assetIp,
        this.assetIndex,
      );
    },
    sevKey() {
      return String(canonSeverity(this.severity) || 'Medium').trim().toLowerCase();
    },
    sevDefaults() {
      return DEFAULTS_BY_SEVERITY[this.sevKey] || DEFAULTS_BY_SEVERITY.medium;
    },
    theme() {
      return THEMES[this.autoDisplay.tier] || THEMES.partial;
    },
    resolvedScriptName() {
      return this.scriptName || this.sevDefaults.scriptName;
    },
    fullDescription() {
      return this.scriptDescription || this.sevDefaults.scriptDescription || '';
    },
    displayDescription() {
      if (this.descriptionExpanded || this.fullDescription.length <= DESC_PREVIEW_LIMIT) {
        return this.fullDescription;
      }
      return `${this.fullDescription.slice(0, DESC_PREVIEW_LIMIT).trimEnd()}...`;
    },
    showDescriptionToggle() {
      return this.fullDescription.length > DESC_PREVIEW_LIMIT;
    },
    resolvedPip() {
      return this.pipCommand || this.sevDefaults.pipCommand;
    },
    resolvedRun() {
      return this.runCommand || this.sevDefaults.runCommand;
    },
    resolvedBefore() {
      return this.beforeItems?.length ? this.beforeItems : DEFAULT_BEFORE;
    },
    resolvedAfter() {
      return this.afterItems?.length ? this.afterItems : DEFAULT_AFTER;
    },
    resolvedLibraries() {
      return this.libraries?.length ? this.libraries : this.sevDefaults.libraries;
    },
    resolvedCan() {
      return this.canAutomate?.length ? this.canAutomate : DEFAULT_CAN;
    },
    resolvedManual() {
      return this.mustManual?.length ? this.mustManual : DEFAULT_MANUAL;
    },
    resolvedRecommended() {
      return this.recommendedText || DEFAULT_REC;
    },
  },
  beforeUnmount() {
    if (this._copyTimer) clearTimeout(this._copyTimer);
  },
  methods: {
    async copyText(text, key = 'cmd') {
      const value = String(text ?? '').trim();
      if (!value) return;

      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          ok = true;
        }
      } catch {
        /* fallback below */
      }

      if (!ok) {
        const el = document.createElement('textarea');
        el.value = value;
        el.setAttribute('readonly', '');
        el.style.position = 'fixed';
        el.style.top = '0';
        el.style.left = '0';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        el.setSelectionRange(0, value.length);
        ok = document.execCommand('copy');
        document.body.removeChild(el);
      }

      if (ok) {
        this.copiedKey = key;
        if (this._copyTimer) clearTimeout(this._copyTimer);
        this._copyTimer = setTimeout(() => {
          this.copiedKey = null;
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.auto-tab-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  min-height: 0;
  flex: 0 0 auto;
}

.auto-tab-content > :last-child {
  margin-bottom: 4px;
}

.capability-banner {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #fff;
  border: 1px solid;
  border-radius: 10px;
  padding: 14px 16px 10px;
  margin-bottom: 12px;
}

.cap-banner-top {
  display: grid;
  grid-template-columns: 140px minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
}

.cap-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}

.cap-view-code-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #86efac;
  background: #fff;
  border-radius: 8px;
  font-size: 1.05rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.cap-view-code-btn:hover {
  background: rgba(255, 255, 255, 0.85);
  filter: brightness(0.97);
}

.cap-bar-col {
  width: 100%;
}

.cap-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 3px;
}

.cap-value {
  font-size: 18px;
  font-weight: 700;
  line-height: 1;
}

.cap-pct {
  font-size: 13px;
  font-weight: 500;
}

.cap-script {
  font-family: monospace;
  font-size: 12px;
  color: #4c1d95;
  background: #f5f3ff;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-block;
  word-break: break-all;
}

.ds-read-more {
  margin-top: 6px;
  padding: 0;
  border: none;
  background: none;
  color: #0284c7;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
}

.ds-read-more:hover {
  color: #0369a1;
  text-decoration: underline;
}

.cap-bar-track--no {
  background: #fee2e2;
  border: 1px solid #dc2626;
}

.cap-bar-track--yes {
  background: #f0fdf4;
  border: 1px solid #86efac;
}

.cap-bar-track {
  height: 6px;
  background: #f1f5f9;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.cap-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s;
}

.detail-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.ds-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}

.ds-text {
  font-size: 13px;
  color: #374151;
  line-height: 1.65;
}

.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 12px;
}

.exec-check-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 12px 14px;
}

.before-card { border-top: 3px solid #d97706; }
.after-card { border-top: 3px solid #16a34a; }

.ecc-header {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.chk-list { list-style: none; margin: 0; padding: 0; }

.chk-item {
  display: flex;
  gap: 7px;
  font-size: 12px;
  color: #374151;
  padding: 4px 0;
  line-height: 1.45;
  border-bottom: 1px solid #f8fafc;
}

.chk-item:last-child { border-bottom: none; }
.chk-dot { color: #94a3b8; flex-shrink: 0; font-size: 10px; margin-top: 3px; }
.chk-after .chk-dot { color: #16a34a; }

.libs-row-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 12px 14px;
  margin-bottom: 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: start;
}

.libs-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.lib-tag {
  font-size: 11px;
  font-family: monospace;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f5f3ff;
  color: #4c1d95;
  border: 1px solid #e9d5ff;
}

.cmd-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  background: #0f172a;
  border-radius: 6px;
  padding: 6px 10px;
}

.cmd-inline code {
  font-family: monospace;
  font-size: 12px;
  color: #e2e8f0;
  flex: 1;
  white-space: pre-wrap;
  word-break: break-all;
}

.copy-btn-sm {
  background: #1e293b;
  border: none;
  border-radius: 3px;
  color: #94a3b8;
  font-size: 13px;
  padding: 1px 6px;
  cursor: pointer;
  flex-shrink: 0;
}

.copy-btn-sm:hover { color: #e2e8f0; }

.assess-col-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  padding: 12px 14px;
}

.green-card { border-top: 3px solid #16a34a; }
.red-card { border-top: 3px solid #dc2626; }

.col-head {
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.green-head { color: #166534; }
.red-head { color: #991b1b; }

.can-list { list-style: none; margin: 0; padding: 0; }

.can-item,
.cant-item {
  display: flex;
  gap: 7px;
  font-size: 12px;
  color: #374151;
  padding: 4px 0;
  line-height: 1.45;
  border-bottom: 1px solid #f8fafc;
}

.can-item:last-child,
.cant-item:last-child { border-bottom: none; }

.can-dot {
  color: #16a34a;
  font-weight: 700;
  flex-shrink: 0;
  width: 14px;
}

.cant-dot {
  color: #dc2626;
  font-weight: 700;
  flex-shrink: 0;
  width: 14px;
}

.recommended-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 11px 14px;
  margin-bottom: 12px;
}

.rec-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #1e40af;
  margin-bottom: 5px;
}

.rec-text {
  font-size: 12px;
  color: #1e3a8a;
  line-height: 1.6;
}

.run-cmd-card {
  border: 1px solid;
  border-radius: 9px;
  padding: 12px 14px;
  margin-bottom: 12px;
}

.run-cmd-header {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
}

.run-cmd-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.run-cmd-title .bi {
  font-size: 13px;
}

.run-cmd-block {
  position: relative;
  background: #0f172a;
  border-radius: 7px;
  padding: 10px 14px;
}

.run-cmd-block pre {
  font-family: 'Cascadia Code', 'Consolas', monospace;
  font-size: 11px;
  color: #e2e8f0;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.copy-btn {
  position: absolute;
  top: 6px;
  right: 8px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 4px;
  color: #94a3b8;
  font-size: 12px;
  padding: 2px 8px;
  cursor: pointer;
}

.copy-btn:hover { color: #e2e8f0; }

@media (max-width: 700px) {
  .two-col-grid { grid-template-columns: 1fr; }
  .capability-banner { grid-template-columns: 1fr 1fr; }
  .libs-row-card { grid-template-columns: 1fr; }
}
</style>
