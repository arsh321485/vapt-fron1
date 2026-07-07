<template>
  <div class="auto-tab-content" :class="{ 'auto-tab-content--greyed': !scriptAvailable }">

    <!-- OS Selector -->
    <div v-if="availableOs.length > 1" class="os-selector-row">
      <span class="os-selector-label">OS:</span>
      <button
        v-for="os in availableOs"
        :key="os"
        type="button"
        class="os-btn"
        :class="{ 'os-btn--active': selectedOs === os }"
        :disabled="osLoading"
        @click="selectOs(os)"
      >
        <span v-if="osLoading && selectedOs === os" class="spinner-border spinner-border-sm me-1"></span>
        {{ os }}
      </button>
    </div>

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
          <button
            type="button"
            class="cap-feedback-btn cap-feedback-btn--up"
            :class="thumbsUpClass"
            :title="thumbsUpTitle"
            :aria-label="thumbsUpTitle"
            :disabled="!canVote || feedbackSubmitting"
            @click="handleFeedback('up')"
          >
            <span v-if="feedbackSubmitting && userFeedback !== 'down'" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-hand-thumbs-up-fill"></i>
          </button>
          <button
            type="button"
            class="cap-feedback-btn cap-feedback-btn--down"
            :class="thumbsDownClass"
            :title="thumbsDownTitle"
            :aria-label="thumbsDownTitle"
            :disabled="!canVote || feedbackSubmitting"
            @click="handleFeedback('down')"
          >
            <span v-if="feedbackSubmitting && userFeedback !== 'up'" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-hand-thumbs-down-fill"></i>
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

    <!-- Script not available notice -->
    <div v-if="!scriptAvailable" class="script-unavailable-notice">
      <i class="bi bi-exclamation-circle-fill me-2"></i>
      Script file not available for download — review steps manually
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

    <!-- Action buttons: user side only (/userassets automation fix) -->
    <div v-if="isUser" class="run-action-row">
      <button
        type="button"
        class="run-action-btn run-action-btn--complete"
        @click="$emit('complete-steps')"
      >
        <i class="bi bi-check2-all" aria-hidden="true"></i> Complete all steps
      </button>
      <button
        type="button"
        class="run-action-btn run-action-btn--verify"
        @click="$emit('send-verification')"
      >
        <i class="bi bi-send" aria-hidden="true"></i> Send verification
      </button>
    </div>

  </div>
</template>

<script>
import { canonSeverity, resolveAutomationDisplay } from '@/utils/assetVulnerabilities';
import { useAuthStore } from '@/stores/authStore';
import {
  buildScriptFeedbackKey,
  getScriptFeedbackAggregate,
  getUserScriptFeedback,
  setUserScriptFeedback,
} from '@/utils/scriptFeedback';

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
  emits: ['view-code', 'feedback-change', 'complete-steps', 'send-verification', 'os-data-change'],
  props: {
    showActions: { type: Boolean, default: true },
    isUser: { type: Boolean, default: false },
    vulnName: { type: String, default: '' },
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
    // Real API data from automation-scripts/match endpoint
    automationData: { type: Object, default: null },
  },
  data() {
    return {
      descriptionExpanded: false,
      authStore: useAuthStore(),
      copiedKey: null,
      _copyTimer: null,
      userFeedback: null,
      feedbackSubmitting: false,
      feedbackAggregate: { up: 0, down: 0, total: 0 },
      selectedOs: null,
      localData: null,
      osLoading: false,

    };
  },
  watch: {
    severity() {
      this.descriptionExpanded = false;
      this.refreshFeedbackState();
    },
    scriptDescription() {
      this.descriptionExpanded = false;
    },
    vulnName() {
      this.refreshFeedbackState();
    },
    assetIp() {
      this.refreshFeedbackState();
    },
    resolvedScriptName() {
      this.refreshFeedbackState();
    },
    automationData(newVal) {
      this.localData = null;
      this.selectedOs = newVal && newVal.os || null;
    },
  },
  async mounted() {
    this.refreshFeedbackState();
    this.selectedOs = this.automationData && this.automationData.os || null;
    await this.loadApiFeedback(); // load real counts + my_feedback from API
  },
  computed: {
    effectiveData() {
      return this.localData || this.automationData;
    },
    availableOs() {
      const d = this.effectiveData;
      if (!d || !Array.isArray(d.available_os) || d.available_os.length <= 1) return [];
      return d.available_os;
    },
    // Helper: parse numbered string list "1. A. 2. B." into ["A.", "B."]
    _apiParsed() {
      const d = this.effectiveData;
      if (!d) return null;
      const split = str => !str ? [] : str.split(/\d+\.\s+/).map(s => s.trim()).filter(Boolean);
      const splitComma = str => !str ? [] : str.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
      const autoLevel = (() => {
        const a = String(d.automation_possible || '').toLowerCase();
        if (a.startsWith('yes') && !a.includes('partial')) return 'yes';
        if (a.includes('partial') || a.includes('/')) return 'partial';
        if (a.startsWith('no')) return 'no';
        return '';
      })();
      return {
        automationLevel: autoLevel,
        scriptName: d.fix_script_name || d.script_name || '',
        scriptDescription: d.script_description || d.description || '',
        beforeItems: split(d.considerations_before),
        afterItems: split(d.considerations_after),
        libraries: splitComma(d.libraries),
        pipCommand: d.command_download_libraries || '',
        runCommand: d.command_run_script || '',
        canAutomate: d.what_can_be_automated ? split(d.what_can_be_automated) : [],
        mustManual: d.what_must_remain_manual ? split(d.what_must_remain_manual) : [],
        recommendedText: d.recommended_approach || '',
        scriptAvailable: !!(d.fix_script_path),
        fixScriptPath: d.fix_script_path || '',
      };
    },
    scriptAvailable() {
      if (this._apiParsed) return this._apiParsed.scriptAvailable;
      return true;
    },
    autoDisplay() {
      const level = this._apiParsed?.automationLevel || this.automationLevel;
      return resolveAutomationDisplay(
        level,
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
      return this._apiParsed?.scriptName || this.scriptName || this.sevDefaults.scriptName;
    },
    fullDescription() {
      return this._apiParsed?.scriptDescription || this.scriptDescription || this.sevDefaults.scriptDescription || '';
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
      return this._apiParsed?.pipCommand || this.pipCommand || this.sevDefaults.pipCommand;
    },
    resolvedRun() {
      return this._apiParsed?.runCommand || this.runCommand || this.sevDefaults.runCommand;
    },
    resolvedBefore() {
      const api = this._apiParsed?.beforeItems;
      if (api?.length) return api;
      return this.beforeItems?.length ? this.beforeItems : DEFAULT_BEFORE;
    },
    resolvedAfter() {
      const api = this._apiParsed?.afterItems;
      if (api?.length) return api;
      return this.afterItems?.length ? this.afterItems : DEFAULT_AFTER;
    },
    resolvedLibraries() {
      const api = this._apiParsed?.libraries;
      if (api?.length) return api;
      return this.libraries?.length ? this.libraries : this.sevDefaults.libraries;
    },
    resolvedCan() {
      const api = this._apiParsed?.canAutomate;
      if (api?.length) return api;
      return this.canAutomate?.length ? this.canAutomate : DEFAULT_CAN;
    },
    resolvedManual() {
      const api = this._apiParsed?.mustManual;
      if (api?.length) return api;
      return this.mustManual?.length ? this.mustManual : DEFAULT_MANUAL;
    },
    resolvedRecommended() {
      return this._apiParsed?.recommendedText || this.recommendedText || DEFAULT_REC;
    },
    feedbackKey() {
      return buildScriptFeedbackKey({
        scriptName: this.resolvedScriptName,
        vulnName: this.vulnName,
        assetIp: this.assetIp,
        severity: this.severity,
      });
    },
    canVote() {
      return this.isUser;
    },
    thumbsUpClass() {
      if (this.isUser) {
        return {
          'is-active': this.userFeedback === 'up',
          'is-muted': this.userFeedback === 'down',
        };
      }
      const { up, down } = this.feedbackAggregate;
      return {
        'is-active': up > 0 && up >= down,
        'is-muted': down > up,
      };
    },
    thumbsDownClass() {
      if (this.isUser) {
        return {
          'is-active': this.userFeedback === 'down',
          'is-muted': this.userFeedback === 'up',
        };
      }
      const { up, down } = this.feedbackAggregate;
      return {
        'is-active': down > 0 && down > up,
        'is-muted': up >= down && up > 0,
      };
    },
    thumbsUpTitle() {
      if (this.isUser) {
        return this.userFeedback === 'up'
          ? 'Script is working properly'
          : 'Mark script as working properly';
      }
      const count = this.feedbackAggregate.up;
      return count ? `${count} user${count === 1 ? '' : 's'} marked script as working` : 'No thumbs up yet';
    },
    thumbsDownTitle() {
      if (this.isUser) {
        return this.userFeedback === 'down'
          ? 'Script is not working properly'
          : 'Mark script as not working properly';
      }
      const count = this.feedbackAggregate.down;
      return count ? `${count} user${count === 1 ? '' : 's'} marked script as not working` : 'No thumbs down yet';
    },
  },
  beforeUnmount() {
    if (this._copyTimer) clearTimeout(this._copyTimer);
  },
  methods: {
    refreshFeedbackState() {
      if (!this.feedbackKey) {
        this.userFeedback = null;
        this.feedbackAggregate = { up: 0, down: 0, total: 0 };
        return;
      }
      this.userFeedback = getUserScriptFeedback(this.feedbackKey);
      this.feedbackAggregate = getScriptFeedbackAggregate(this.feedbackKey, {
        useDemoFallback: !this.isUser,
      });
    },
    async selectOs(os) {
      if (this.selectedOs === os || this.osLoading) return;
      this.selectedOs = os;
      const pluginId = Number(this.automationData && this.automationData.plugin_id || 0);
      if (!(pluginId > 0)) return;
      this.osLoading = true;
      const res = this.isUser
        ? await this.authStore.fetchAutomationScriptSingle(pluginId, os)
        : await this.authStore.fetchAutomationScriptSingleAdmin(pluginId, os);
      this.osLoading = false;
      if (res.status && res.data) {
        this.localData = res.data;
        this.$emit('os-data-change', res.data);
      }
    },
    async loadApiFeedback() {
      const pluginId = Number(this.automationData && this.automationData.plugin_id || 0);
      if (!(pluginId > 0)) return;
      // User: GET /api/user/automation-scripts/feedback/{id}/ (has my_feedback)
      // Admin: GET /api/admin/automation-scripts/feedback/{id}/ (counts only)
      const res = this.isUser
        ? await this.authStore.getAutomationScriptFeedback(pluginId)
        : await this.authStore.getAutomationScriptFeedbackAdmin(pluginId);
      if (!res.status || !res.data) return;
      const d = res.data;
      // my_feedback only in user response
      if (this.isUser) {
        if (d.my_feedback && d.my_feedback.working !== undefined) {
          this.userFeedback = d.my_feedback.working ? 'up' : 'down';
          if (this.feedbackKey) setUserScriptFeedback(this.feedbackKey, this.userFeedback);
        } else {
          this.userFeedback = null;
        }
      }
      // counts in both user and admin response
      this.feedbackAggregate = {
        up: d.thumb_up_count || 0,
        down: d.thumb_down_count || 0,
        total: (d.thumb_up_count || 0) + (d.thumb_down_count || 0),
      };
    },
    async handleFeedback(vote) {
      if (!this.canVote || !this.feedbackKey || this.feedbackSubmitting) return;
      const nextVote = this.userFeedback === vote ? null : vote;
      const pluginId = Number(this.automationData && this.automationData.plugin_id || 0);
      if (this.isUser && pluginId > 0 && nextVote !== null) {
        this.feedbackSubmitting = true;
        await this.authStore.submitAutomationScriptFeedback(pluginId, nextVote === 'up');
        this.feedbackSubmitting = false;
        // Refresh counts from API after submit
        await this.loadApiFeedback();
        return;
      }
      setUserScriptFeedback(this.feedbackKey, nextVote);
      this.refreshFeedbackState();
      this.$emit('feedback-change', {
        feedbackKey: this.feedbackKey,
        vote: this.userFeedback,
        aggregate: { ...this.feedbackAggregate },
      });
    },
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
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  gap: 8px;
  flex-shrink: 0;
}

.cap-feedback-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #e2e8f0;
  background: #fff;
  border-radius: 8px;
  font-size: 1rem;
  line-height: 1;
  color: #94a3b8;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
}

.cap-feedback-btn:disabled {
  cursor: default;
}

.cap-feedback-btn--up.is-active {
  color: #2563eb;
  border-color: #93c5fd;
  background: #eff6ff;
}

.cap-feedback-btn--down.is-active {
  color: #dc2626;
  border-color: #fca5a5;
  background: #fef2f2;
}

.cap-feedback-btn.is-muted {
  opacity: 0.38;
}

.cap-feedback-btn:not(:disabled):hover {
  filter: brightness(0.97);
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
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #374151;
  line-height: 1.65;
  margin: 0;
  white-space: pre-line;
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

.os-selector-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.os-selector-label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.os-btn {
  padding: 5px 14px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}
.os-btn:hover { background: #f1f5f9; border-color: #0f696e; color: #0f696e; }
.os-btn--active { background: #0f696e; border-color: #0f696e; color: #fff; }
.os-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.auto-tab-content--greyed {
  opacity: 0.45;
  pointer-events: none;
  position: relative;
}
.auto-tab-content--greyed::after {
  content: 'Script file not available';
  position: sticky;
  bottom: 8px;
  display: block;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  background: #fef9ec;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 6px 12px;
  margin-top: 8px;
}
.script-unavailable-notice {
  opacity: 1 !important;
  background: #fef9ec;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 12px;
  pointer-events: auto;
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

.run-action-row {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.run-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.run-action-btn--complete {
  background: #1b3a5c;
  color: #fff;
  border-color: #1b3a5c;
}

.run-action-btn--complete:hover {
  background: #163251;
  border-color: #163251;
}

.run-action-btn--verify {
  background: #fff;
  color: #1b3a5c;
  border-color: #1b3a5c;
}

.run-action-btn--verify:hover {
  background: #f0f5fb;
}

@media (max-width: 700px) {
  .two-col-grid { grid-template-columns: 1fr; }
  .capability-banner { grid-template-columns: 1fr 1fr; }
  .libs-row-card { grid-template-columns: 1fr; }
  .run-action-row {
    flex-direction: column;
    align-items: flex-end;
  }
}
</style>
