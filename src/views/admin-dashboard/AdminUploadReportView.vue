<template>
  <main class="aur-root">
    <!-- Top bar -->
    <div class="aur-topbar">
      <img src="@/assets/images/vaptfix_white.png" alt="VaptFix" class="aur-logo" />
    </div>

    <div class="aur-page">
      <div class="aur-card" :class="{ 'aur-card--wide': viewMode === 'choose' || viewMode === 'scope-method' }">

        <!-- Step indicator -->
        <div class="aur-steps">
          <div class="aur-step done"><span>1</span> Sign Up</div>
          <div class="aur-step-line"></div>
          <div class="aur-step" :class="{ active: !generating, done: generating }">
            <span>2</span> Provide Scope
          </div>
          <div class="aur-step-line"></div>
          <div class="aur-step" :class="{ active: generating }"><span>3</span> Get Started</div>
        </div>

        <!-- GENERATING AGENTS STATE -->
        <div v-if="generating" class="aur-generating">
          <div class="aur-icon-wrap">
            <i class="bi bi-gear-fill aur-upload-icon aur-spin"></i>
          </div>
          <h1 class="aur-title">Creating agents</h1>
          <p class="aur-subtitle">
            Your report is uploaded. We’re generating agents from your scan findings — hang tight.
          </p>

          <div class="aur-progress-wrap">
            <div class="aur-progress-header">
              <span class="aur-progress-label">
                {{
                  pollSummary.cards_total > 0
                    ? `Creating agents (${pollSummary.cards_generated}/${pollSummary.cards_total})...`
                    : 'Creating agents...'
                }}
              </span>
              <span class="aur-progress-pct">{{ progressPercent }}%</span>
            </div>
            <div class="aur-progress-bar">
              <div
                v-if="pollSummary.cards_total > 0"
                class="aur-progress-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
              <div v-else class="aur-progress-fill aur-progress-indeterminate"></div>
            </div>
          </div>

          <p class="aur-progress-hint">Please wait — do not close this window until all agents are ready</p>
        </div>

        <template v-else>
          <!-- CHOOSER: Upload report vs Enter scope -->
          <div v-if="viewMode === 'choose'">
            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-bullseye aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Provide Your Scope</h1>
              <p class="aur-subtitle">
                Choose how you want to start — upload an existing scan report, or enter the assets VAPTFix should test.
              </p>
            </div>

            <div class="aur-choice-grid">
              <button type="button" class="aur-choice-card" @click="openUploadReport">
                <div class="aur-choice-icon">
                  <i class="bi bi-cloud-arrow-up"></i>
                </div>
                <h3 class="aur-choice-title">Upload Report</h3>
                <p class="aur-choice-copy">
                  Already have a scan report? Upload it and we’ll generate agents from your findings.
                </p>
                <span class="aur-choice-cta">
                  Continue <i class="bi bi-arrow-right"></i>
                </span>
              </button>

              <button type="button" class="aur-choice-card" @click="openEnterScope">
                <div class="aur-choice-icon aur-choice-icon--alt">
                  <i class="bi bi-list-check"></i>
                </div>
                <h3 class="aur-choice-title">Enter Your Scope</h3>
                <p class="aur-choice-copy">
                  No report yet? Share targets via CSV or enter them manually for testing.
                </p>
                <span class="aur-choice-cta">
                  Continue <i class="bi bi-arrow-right"></i>
                </span>
              </button>
            </div>

          </div>

          <!-- UPLOAD REPORT (existing flow) -->
          <div v-else-if="viewMode === 'upload'" class="aur-panel">
            <button type="button" class="aur-back" @click="backToChoose">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-cloud-arrow-up aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Upload Your Scan Report</h1>
              <p class="aur-subtitle">
                Upload your vulnerability assessment file (.nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc — including AWS Inspector) to begin.
              </p>
            </div>

            <div v-if="loadingExistingReport" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current report...
            </div>

            <div v-else-if="hasExistingReport" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-file-earmark-check"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Current report</p>
                    <h2 class="aur-scope-board-title">{{ existingReportFileName }}</h2>
                  </div>
                </div>
                <span v-if="existingReportStatusLabel" class="aur-scope-count">
                  {{ existingReportStatusLabel }}
                </span>
              </div>

              <div v-if="existingReportCreatedAt" class="aur-scope-meta">
                <span class="aur-scope-chip">
                  <i class="bi bi-calendar3"></i>
                  {{ existingReportCreatedAt }}
                </span>
              </div>

              <div v-if="existingReportStats.length" class="aur-report-stats">
                <div
                  v-for="stat in existingReportStats"
                  :key="stat.label"
                  class="aur-report-stat"
                >
                  <span class="aur-report-stat-value">{{ stat.value }}</span>
                  <span class="aur-report-stat-label">{{ stat.label }}</span>
                </div>
              </div>

              <p class="aur-scope-replace-hint">Upload a new report below to replace the current one.</p>
            </div>

            <div
              class="aur-dropzone"
              :class="{ 'aur-dropzone-active': isDragging, 'aur-dropzone-has-file': selectedFile }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                name="file"
                accept=".nessus,.xml,.html,.htm,.csv,.xlsx,.xls,.pdf,.docx,.doc"
                class="aur-file-input"
                @change="onFileChange"
              />

              <div v-if="!selectedFile" class="aur-drop-content">
                <i class="bi bi-file-earmark-arrow-up aur-drop-icon"></i>
                <p class="aur-drop-text">Drag &amp; drop your report here</p>
                <p class="aur-drop-sub">or <span class="aur-browse">browse files</span></p>
                <p class="aur-drop-types">.nessus · .xml · .html · .htm · .csv · .xlsx · .xls · .pdf · .docx · .doc</p>
              </div>

              <div v-else class="aur-file-info">
                <i class="bi bi-file-earmark-check aur-file-icon"></i>
                <div>
                  <p class="aur-file-name">{{ selectedFile.name }}</p>
                  <p class="aur-file-size">{{ fileSize }}</p>
                </div>
                <button class="aur-remove-btn" @click.stop="removeFile">
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>

            <div v-if="uploading" class="aur-progress-wrap">
              <div class="aur-progress-header">
                <span class="aur-progress-label">{{ uploadPct >= 95 ? 'Processing report...' : 'Uploading...' }}</span>
                <span class="aur-progress-pct">{{ uploadPct }}%</span>
              </div>
              <div class="aur-progress-bar">
                <div class="aur-progress-fill" :style="{ width: uploadPct + '%' }"></div>
              </div>
              <p class="aur-progress-hint">Please wait, do not close this window</p>
            </div>

            <p v-if="uploadError" class="aur-error">{{ uploadError }}</p>

            <div class="aur-actions">
              <button
                class="aur-btn-primary"
                :disabled="!selectedFile || uploading"
                @click="startUpload"
              >
                <span v-if="uploading">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Uploading...
                </span>
                <span v-else>
                  <i class="bi bi-cloud-upload me-1"></i>
                  Upload Report
                </span>
              </button>
            </div>

            <div class="aur-info-row">
              <i class="bi bi-shield-lock aur-info-icon"></i>
              <span>Your file is encrypted and stored securely. Only your Super Admin and team can access it.</span>
            </div>
          </div>

          <!-- ENTER SCOPE: CSV vs Manual -->
          <div v-else-if="viewMode === 'scope-method'">
            <button type="button" class="aur-back" @click="backToChoose">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-list-check aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Enter Your Scope</h1>
              <p class="aur-subtitle">
                Add targets with a CSV file, or enter IPs / hosts manually.
              </p>
            </div>

            <div class="aur-choice-grid">
              <button type="button" class="aur-choice-card" @click="openScopeCsv">
                <div class="aur-choice-icon">
                  <i class="bi bi-filetype-csv"></i>
                </div>
                <h3 class="aur-choice-title">CSV File</h3>
                <p class="aur-choice-copy">
                  Upload a CSV of assets / IPs. One row per target works best.
                </p>
                <span class="aur-choice-cta">
                  Upload CSV <i class="bi bi-arrow-right"></i>
                </span>
              </button>

              <button type="button" class="aur-choice-card" @click="openScopeManual">
                <div class="aur-choice-icon aur-choice-icon--alt">
                  <i class="bi bi-keyboard"></i>
                </div>
                <h3 class="aur-choice-title">Manual Entry</h3>
                <p class="aur-choice-copy">
                  Type IP addresses, hostnames, or CIDR ranges one per line.
                </p>
                <span class="aur-choice-cta">
                  Enter manually <i class="bi bi-arrow-right"></i>
                </span>
              </button>
            </div>
          </div>

          <!-- SCOPE CSV -->
          <div v-else-if="viewMode === 'scope-csv'" class="aur-panel">
            <button type="button" class="aur-back" @click="openEnterScope">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-filetype-csv aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Upload Scope CSV</h1>
              <p class="aur-subtitle">
                Upload a .csv file listing the assets you want VAPTFix to include in scope.
              </p>
            </div>

            <div v-if="loadingExistingScope" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current scope...
            </div>

            <div v-else-if="hasExistingScope" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Current scope</p>
                    <h2 class="aur-scope-board-title">{{ existingScopeDisplayName }}</h2>
                  </div>
                </div>
                <span class="aur-scope-count">
                  {{ existingEntryCount }} target{{ existingEntryCount === 1 ? '' : 's' }}
                </span>
              </div>

              <div class="aur-scope-meta">
                <span v-if="existingScopeLabel" class="aur-scope-chip">
                  <i class="bi bi-filetype-csv"></i>
                  {{ existingScopeLabel }}
                </span>
              </div>

              <div v-if="existingScopeEntries.length" class="aur-scope-table-wrap">
                <table class="aur-scope-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Target</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(entry, idx) in existingScopeEntries"
                      :key="entry.id || entry.value + '-' + idx"
                    >
                      <td>{{ idx + 1 }}</td>
                      <td>
                        <span class="aur-scope-target">{{ entry.value }}</span>
                        <span v-if="entry.subnet_mask" class="aur-scope-subnet">
                          /{{ entry.subnet_mask }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="aur-scope-type-pill"
                          :class="entry.is_internal ? 'is-internal' : 'is-external'"
                        >
                          {{ formatEntryType(entry.entry_type) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="aur-scope-replace-hint">Upload a new CSV below to update scope.</p>
            </div>

            <div
              class="aur-dropzone"
              :class="{ 'aur-dropzone-active': isDragging, 'aur-dropzone-has-file': selectedFile }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onScopeCsvDrop"
              @click="$refs.csvInput.click()"
            >
              <input
                ref="csvInput"
                type="file"
                accept=".csv,text/csv"
                class="aur-file-input"
                @change="onScopeCsvChange"
              />

              <div v-if="!selectedFile" class="aur-drop-content">
                <i class="bi bi-file-earmark-spreadsheet aur-drop-icon"></i>
                <p class="aur-drop-text">Drag &amp; drop your CSV here</p>
                <p class="aur-drop-sub">or <span class="aur-browse">browse files</span></p>
                <p class="aur-drop-types">.csv only</p>
              </div>

              <div v-else class="aur-file-info">
                <i class="bi bi-file-earmark-check aur-file-icon"></i>
                <div>
                  <p class="aur-file-name">{{ selectedFile.name }}</p>
                  <p class="aur-file-size">{{ fileSize }}</p>
                </div>
                <button class="aur-remove-btn" @click.stop="removeFile">
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>

            <p v-if="uploadError" class="aur-error">{{ uploadError }}</p>

            <div class="aur-actions">
              <button
                class="aur-btn-primary"
                :disabled="!selectedFile || scopeSubmitting"
                @click="submitScopeCsv"
              >
                <span v-if="scopeSubmitting">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Submitting...
                </span>
                <span v-else>
                  <i class="bi bi-check2-circle me-1"></i>
                  Submit Scope CSV
                </span>
              </button>
            </div>
          </div>

          <!-- SCOPE MANUAL -->
          <div v-else-if="viewMode === 'scope-manual'" class="aur-panel">
            <button type="button" class="aur-back" @click="openEnterScope">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-keyboard aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Enter Scope Manually</h1>
              <p class="aur-subtitle">
                Add one IP, hostname, or CIDR range per line. You can paste a list at once.
              </p>
            </div>

            <div v-if="loadingExistingScope" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current scope...
            </div>

            <div v-else-if="hasExistingScope" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Current scope</p>
                    <h2 class="aur-scope-board-title">{{ existingScopeDisplayName }}</h2>
                  </div>
                </div>
                <span class="aur-scope-count">
                  {{ existingEntryCount }} target{{ existingEntryCount === 1 ? '' : 's' }}
                </span>
              </div>

              <div class="aur-scope-meta">
                <span v-if="existingScopeLabel" class="aur-scope-chip">
                  <i class="bi bi-filetype-csv"></i>
                  {{ existingScopeLabel }}
                </span>
              </div>

              <div v-if="existingScopeEntries.length" class="aur-scope-table-wrap">
                <table class="aur-scope-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Target</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(entry, idx) in existingScopeEntries"
                      :key="entry.id || entry.value + '-' + idx"
                    >
                      <td>{{ idx + 1 }}</td>
                      <td>
                        <span class="aur-scope-target">{{ entry.value }}</span>
                        <span v-if="entry.subnet_mask" class="aur-scope-subnet">
                          /{{ entry.subnet_mask }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="aur-scope-type-pill"
                          :class="entry.is_internal ? 'is-internal' : 'is-external'"
                        >
                          {{ formatEntryType(entry.entry_type) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <label class="aur-field-label" for="scope-manual-input">Targets</label>
            <textarea
              id="scope-manual-input"
              v-model="manualScopeText"
              class="aur-textarea"
              rows="8"
              placeholder="192.168.1.10&#10;192.168.1.0/24&#10;app.example.com"
            ></textarea>

            <div class="aur-manual-meta">
              <span>{{ manualTargetCount }} target{{ manualTargetCount === 1 ? '' : 's' }} detected</span>
            </div>

            <p v-if="uploadError" class="aur-error">{{ uploadError }}</p>

            <div class="aur-actions">
              <button
                class="aur-btn-primary"
                :disabled="manualTargetCount === 0 || scopeSubmitting"
                @click="submitScopeManual"
              >
                <span v-if="scopeSubmitting">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Submitting...
                </span>
                <span v-else>
                  <i class="bi bi-check2-circle me-1"></i>
                  Submit Scope
                </span>
              </button>
            </div>
          </div>
        </template>

      </div>
    </div>
  </main>
</template>

<script>
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';

const ALLOWED_EXTENSIONS = [
  '.nessus',
  '.xml',
  '.html',
  '.htm',
  '.csv',
  '.xlsx',
  '.xls',
  '.pdf',
  '.docx',
  '.doc',
];

const STATUS_POLL_MS = 3500;

export default {
  name: 'AdminUploadReportView',
  data() {
    return {
      viewMode: 'choose', // choose | upload | scope-method | scope-csv | scope-manual
      selectedFile: null,
      isDragging: false,
      uploading: false,
      uploadPct: 0,
      uploadError: '',
      uploadResult: null,
      generating: false,
      reportIds: [],
      statusByReportId: {},
      pollTimer: null,
      polling: false,
      redirecting: false,
      manualScopeText: '',
      scopeSubmitting: false,
      existingScope: null,
      loadingExistingScope: false,
      existingReport: null,
      loadingExistingReport: false,
    };
  },
  computed: {
    fileSize() {
      if (!this.selectedFile) return '';
      const bytes = this.selectedFile.size;
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    manualTargets() {
      return String(this.manualScopeText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    },
    manualTargetCount() {
      return this.manualTargets.length;
    },
    pollSummary() {
      const statuses = this.reportIds
        .map((id) => this.statusByReportId[id])
        .filter(Boolean);

      let cards_total = 0;
      let cards_generated = 0;
      for (const s of statuses) {
        cards_total += Number(s.cards_total) || 0;
        cards_generated += Number(s.cards_generated) || 0;
      }
      return { cards_total, cards_generated };
    },
    progressPercent() {
      if (this.allAgentsReady) return 100;

      const total = this.pollSummary.cards_total || 0;
      if (!total) return 0;
      const pct = Math.round((this.pollSummary.cards_generated / total) * 100);
      return Math.min(99, Math.max(0, pct));
    },
    allAgentsReady() {
      if (!this.reportIds.length) return false;

      return this.reportIds.every((id) => {
        const s = this.statusByReportId[id];
        if (!s) return false;
        const total = Number(s.cards_total) || 0;
        const generated = Number(s.cards_generated) || 0;
        return total > 0 && generated >= total;
      });
    },
    hasExistingScope() {
      return !!(this.existingScope?.id || this.existingScopeEntries.length);
    },
    existingScopeEntries() {
      const entries = this.existingScope?.entries;
      return Array.isArray(entries) ? entries : [];
    },
    existingScopeLabel() {
      return this.existingScope?.source_file_name || '';
    },
    existingScopeDisplayName() {
      return (
        this.existingScope?.name ||
        this.existingScope?.source_file_name ||
        'Current scope'
      );
    },
    existingEntryCount() {
      return (
        Number(this.existingScope?.entry_count) ||
        this.existingScopeEntries.length ||
        0
      );
    },
    hasExistingReport() {
      return !!(
        this.existingReport?.id ||
        this.existingReport?.report_id ||
        this.existingReport?.resolved_file_name ||
        this.existingReport?.file_name
      );
    },
    existingReportId() {
      return (
        this.existingReport?.report_id ||
        this.existingReport?.id ||
        this.existingReport?._id ||
        ''
      );
    },
    existingReportFileName() {
      return (
        this.existingReport?.resolved_file_name ||
        this.existingReport?.file_name ||
        this.existingReport?.filename ||
        this.existingReport?.original_filename ||
        this.existingReport?.name ||
        'Uploaded report'
      );
    },
    existingReportStatusLabel() {
      const raw =
        this.existingReport?.status ||
        this.existingReport?.upload_status ||
        this.existingReport?.state ||
        '';
      if (!raw) {
        const total = Number(this.existingReport?.cards_total) || 0;
        const generated = Number(this.existingReport?.cards_generated) || 0;
        if (total > 0 && generated >= total) return 'Ready';
        if (total > 0) return 'Processing';
        return '';
      }
      return String(raw).replace(/_/g, ' ');
    },
    existingReportCreatedAt() {
      const raw =
        this.existingReport?.created_at ||
        this.existingReport?.uploaded_at ||
        this.existingReport?.updated_at ||
        '';
      if (!raw) return '';
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return String(raw);
      return d.toLocaleString();
    },
    existingReportCardsLabel() {
      const total = Number(this.existingReport?.cards_total) || 0;
      const generated = Number(this.existingReport?.cards_generated) || 0;
      if (!total && !generated) return '';
      return `Agents ${generated}/${total || '?'}`;
    },
    existingReportStats() {
      const r = this.existingReport || {};
      const candidates = [
        { label: 'Hosts', value: r.host_count ?? r.hosts_count ?? r.total_hosts },
        { label: 'Vulnerabilities', value: r.vulnerability_count ?? r.vuln_count ?? r.total_vulnerabilities },
        { label: 'Critical', value: r.critical_count ?? r.critical },
        { label: 'High', value: r.high_count ?? r.high },
        { label: 'Medium', value: r.medium_count ?? r.medium },
        { label: 'Low', value: r.low_count ?? r.low },
      ];
      return candidates
        .filter((item) => item.value != null && item.value !== '')
        .map((item) => ({ label: item.label, value: String(item.value) }));
    },
  },
  methods: {
    clearFileState() {
      this.selectedFile = null;
      this.uploadError = '';
      this.isDragging = false;
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
      if (this.$refs.csvInput) this.$refs.csvInput.value = '';
    },
    backToChoose() {
      this.viewMode = 'choose';
      this.clearFileState();
      this.manualScopeText = '';
    },
    openUploadReport() {
      this.clearFileState();
      this.viewMode = 'upload';
      if (!this.existingReport && !this.loadingExistingReport) {
        this.loadExistingReport();
      }
    },
    shortReportId(id) {
      const value = String(id || '');
      if (value.length <= 12) return value;
      return `${value.slice(0, 6)}…${value.slice(-4)}`;
    },
    async loadExistingReport() {
      this.loadingExistingReport = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.fetchActiveUploadReport();
        if (res.status && res.data) {
          this.existingReport = res.data;
        }
      } catch (err) {
        console.error('Existing report GET failed:', err);
      } finally {
        this.loadingExistingReport = false;
      }
    },
    openEnterScope() {
      this.clearFileState();
      this.viewMode = 'scope-method';
    },
    openScopeCsv() {
      this.clearFileState();
      this.viewMode = 'scope-csv';
      if (!this.existingScope && !this.loadingExistingScope) {
        this.loadExistingScope();
      }
    },
    openScopeManual() {
      this.clearFileState();
      this.uploadError = '';
      this.viewMode = 'scope-manual';
      if (!this.existingScope && !this.loadingExistingScope) {
        this.loadExistingScope();
      }
    },
    formatEntryType(type) {
      const raw = String(type || '').trim();
      if (!raw) return 'target';
      return raw.replace(/_/g, ' ');
    },
    applyRouteMode() {
      const mode = String(this.$route?.query?.mode || '').toLowerCase();
      // Default / profile Upload Scope → "Provide Your Scope" chooser
      if (!mode || mode === 'choose' || mode === 'scope') {
        this.viewMode = 'choose';
      } else if (mode === 'scope-csv') {
        this.viewMode = 'scope-csv';
      } else if (mode === 'scope-manual') {
        this.viewMode = 'scope-manual';
      } else if (mode === 'scope-method') {
        this.viewMode = 'scope-method';
      } else if (mode === 'upload') {
        this.viewMode = 'upload';
      }
    },
    async loadExistingScope() {
      this.loadingExistingScope = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.fetchActiveScope();
        if (res.status && res.data) {
          this.existingScope = res.data;
          if (res.data.id) {
            try {
              localStorage.setItem('activeScopeId', String(res.data.id));
            } catch (_) {
              /* ignore */
            }
          }
        }
      } catch (err) {
        console.error('Existing scope GET failed:', err);
      } finally {
        this.loadingExistingScope = false;
      }
    },
    async ensureScopeGetAfterCreate(res, preferredName) {
      if (res?.scope?.id) return res;

      const authStore = useAuthStore();
      const getRes = await authStore.fetchActiveScope({ preferredName });
      if (!getRes.status || !getRes.data) return res;

      return {
        ...res,
        scope: getRes.data,
        data: {
          ...(res.data || {}),
          ...getRes.data,
          created_count: res.data?.created_count,
          skipped_count: res.data?.skipped_count,
          skipped: res.data?.skipped,
        },
      };
    },
    async handleScopeCreateSuccess(res) {
      const scope = res.scope || res.data || {};
      const created =
        Number(res.data?.created_count) ||
        Number(scope?.entry_count) ||
        (Array.isArray(scope?.entries) ? scope.entries.length : 0) ||
        0;
      const skipped = Number(res.data?.skipped_count) || 0;

      if (scope?.id) {
        try {
          localStorage.setItem('activeScopeId', String(scope.id));
        } catch (_) {
          /* ignore */
        }
      }

      if (skipped > 0 && created === 0) {
        await Swal.fire({
          icon: 'warning',
          title: 'Already exists',
          text: `${skipped} target(s) skipped`,
          confirmButtonColor: '#241447',
        });
      } else {
        await Swal.fire({
          icon: 'success',
          title: 'Scope created',
          text:
            created > 0
              ? `${created} target(s) created${skipped ? ` · ${skipped} skipped` : ''}`
              : res.message || 'Scope submitted successfully',
          confirmButtonColor: '#241447',
          timer: 2200,
          showConfirmButton: true,
        });
      }

      localStorage.removeItem('isNewProject');
      const authStore = useAuthStore();
      const route = authStore.isSlackOrTeamsLogin() ? '/riskcriteria' : '/communication';
      this.$router.replace(route);
    },
    async submitScopeCsv() {
      if (!this.selectedFile || this.scopeSubmitting) return;
      if (!this.isCsvFile(this.selectedFile)) {
        this.uploadError = 'Please upload a .csv file for scope.';
        return;
      }

      this.scopeSubmitting = true;
      this.uploadError = '';
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('expand_subnets', 'false');

        const authStore = useAuthStore();
        let res = await authStore.createScope(formData);

        if (!res.status) {
          this.uploadError = res.message || 'Failed to create scope';
          Swal.fire({
            icon: 'error',
            title: this.uploadError,
            confirmButtonColor: '#241447',
          });
          return;
        }

        const preferredName = String(this.selectedFile?.name || '')
          .replace(/\.csv$/i, '')
          .trim();
        res = await this.ensureScopeGetAfterCreate(res, preferredName);
        await this.handleScopeCreateSuccess(res);
      } catch (err) {
        console.error('Scope CSV error:', err);
        this.uploadError = 'Something went wrong while submitting scope CSV';
        Swal.fire('Scope failed', this.uploadError, 'error');
      } finally {
        this.scopeSubmitting = false;
      }
    },
    async submitScopeManual() {
      if (!this.manualTargetCount || this.scopeSubmitting) return;

      this.scopeSubmitting = true;
      this.uploadError = '';
      try {
        const formData = new FormData();
        formData.append('targets', this.manualTargets.join('\n'));

        const authStore = useAuthStore();
        let res = await authStore.createScope(formData);

        if (!res.status) {
          this.uploadError = res.message || 'Failed to create scope';
          Swal.fire({
            icon: 'error',
            title: this.uploadError,
            confirmButtonColor: '#241447',
          });
          return;
        }

        res = await this.ensureScopeGetAfterCreate(res);
        await this.handleScopeCreateSuccess(res);
      } catch (err) {
        console.error('Scope manual error:', err);
        this.uploadError = 'Something went wrong while submitting scope';
        Swal.fire('Scope failed', this.uploadError, 'error');
      } finally {
        this.scopeSubmitting = false;
      }
    },
    getExtension(fileName) {
      const name = String(fileName || '').toLowerCase();
      const idx = name.lastIndexOf('.');
      if (idx < 0) return '';
      return name.slice(idx);
    },
    isAllowedFile(file) {
      if (!file) return false;
      return ALLOWED_EXTENSIONS.includes(this.getExtension(file.name));
    },
    isCsvFile(file) {
      if (!file) return false;
      return this.getExtension(file.name) === '.csv';
    },
    setSelectedFile(file) {
      this.uploadError = '';
      if (!file) return;
      if (!this.isAllowedFile(file)) {
        this.selectedFile = null;
        this.uploadError =
          'Unsupported file type. Allowed: .nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc';
        Swal.fire('Unsupported file', this.uploadError, 'warning');
        return;
      }
      this.selectedFile = file;
    },
    setScopeCsvFile(file) {
      this.uploadError = '';
      if (!file) return;
      if (!this.isCsvFile(file)) {
        this.selectedFile = null;
        this.uploadError = 'Please upload a .csv file for scope.';
        Swal.fire('Unsupported file', this.uploadError, 'warning');
        return;
      }
      this.selectedFile = file;
    },
    onFileChange(e) {
      const file = e.target.files?.[0];
      this.setSelectedFile(file);
      e.target.value = '';
    },
    onDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files?.[0];
      this.setSelectedFile(file);
    },
    onScopeCsvChange(e) {
      const file = e.target.files?.[0];
      this.setScopeCsvFile(file);
      e.target.value = '';
    },
    onScopeCsvDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files?.[0];
      this.setScopeCsvFile(file);
    },
    removeFile() {
      this.clearFileState();
    },
    extractReportIds(data) {
      const results = Array.isArray(data?.results) ? data.results : [];
      const ids = results
        .map((r) => r?.report_id)
        .filter((id) => typeof id === 'string' && id.trim());
      return [...new Set(ids)];
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    async pollOnce() {
      if (this.polling || this.redirecting || !this.reportIds.length) return;
      this.polling = true;
      const authStore = useAuthStore();

      try {
        const responses = await Promise.all(
          this.reportIds.map((id) => authStore.fetchUploadReportStatus(id)),
        );

        const nextStatus = { ...this.statusByReportId };
        responses.forEach((res, idx) => {
          const id = this.reportIds[idx];
          if (res.status && res.data) {
            nextStatus[id] = res.data;
          }
        });
        this.statusByReportId = nextStatus;

        if (this.allAgentsReady) {
          this.stopPolling();
          await this.redirectAfterAgentsReady();
        }
      } finally {
        this.polling = false;
      }
    },
    startPolling(reportIds) {
      this.reportIds = reportIds;
      this.statusByReportId = {};
      this.generating = true;
      this.redirecting = false;
      this.stopPolling();
      this.pollOnce();
      this.pollTimer = setInterval(() => {
        if (!document.hidden && !this.redirecting) this.pollOnce();
      }, STATUS_POLL_MS);
    },
    async redirectAfterAgentsReady() {
      if (this.redirecting) return;
      if (!this.allAgentsReady) return;

      this.redirecting = true;
      this.stopPolling();

      const authStore = useAuthStore();
      const primaryReportId = this.reportIds[0];
      if (primaryReportId) {
        authStore.setActiveReportId(primaryReportId);
      }
      const route = authStore.isSlackOrTeamsLogin() ? '/riskcriteria' : '/communication';
      this.$router.replace(route);
    },
    async startUpload() {
      if (!this.selectedFile || this.uploading || this.generating) return;
      if (!this.isAllowedFile(this.selectedFile)) {
        this.uploadError =
          'Unsupported file type. Allowed: .nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc';
        return;
      }

      this.uploading = true;
      this.uploadPct = 0;
      this.uploadError = '';
      this.uploadResult = null;

      try {
        const authStore = useAuthStore();
        const res = await authStore.uploadAdminReport(this.selectedFile, (pct) => {
          this.uploadPct = pct;
        });

        if (!res.status) {
          this.uploadError = res.message || 'Failed to upload report';
          Swal.fire({
            icon: 'error',
            title: this.uploadError,
            confirmButtonText: 'OK',
            confirmButtonColor: '#241447',
          });
          return;
        }

        this.uploadPct = 100;
        this.uploadResult = res.data;

        const reportIds = this.extractReportIds(res.data);
        if (!reportIds.length) {
          this.uploadError = 'Upload succeeded but no report_id was returned.';
          Swal.fire('Upload incomplete', this.uploadError, 'warning');
          return;
        }

        // Persist + GET report detail for UI
        authStore.setActiveReportId(reportIds[0]);
        try {
          const getRes = await authStore.getUploadReportById(reportIds[0]);
          if (getRes.status && getRes.data) {
            this.existingReport = {
              ...getRes.data,
              report_id: getRes.data.report_id || getRes.data.id || getRes.data._id || reportIds[0],
              resolved_file_name:
                authStore.extractUploadedFileName(getRes.data) ||
                getRes.data.file_name ||
                getRes.data.filename ||
                this.selectedFile?.name ||
                null,
            };
          }
        } catch (getErr) {
          console.error('Report GET after upload failed:', getErr);
        }

        this.uploading = false;
        this.startPolling(reportIds);
      } catch (err) {
        console.error('Upload error:', err);
        this.uploadError = 'Something went wrong while uploading the report';
        Swal.fire('Upload failed', this.uploadError, 'error');
      } finally {
        this.uploading = false;
      }
    },
  },
  async mounted() {
    this.applyRouteMode();
    // Prefetch previously uploaded scope + report for Current boards
    await Promise.all([this.loadExistingScope(), this.loadExistingReport()]);
  },
  watch: {
    '$route.query.mode'() {
      this.applyRouteMode();
    },
  },
  beforeUnmount() {
    this.stopPolling();
  },
};
</script>

<style scoped>
.aur-root {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #f4f2fb 0%, #ffffff 45%, #ebe7f8 100%);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.aur-topbar {
  background: #241447;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.aur-logo { height: 32px; width: auto; }

.aur-page {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 28px;
  overflow: hidden;
}

.aur-card {
  width: min(780px, 94vw);
  height: min(82vh, 720px);
  max-height: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 28px 36px 24px;
  box-shadow: 0 12px 40px rgba(36, 20, 71, 0.12);
  border: 1px solid rgba(36, 20, 71, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.aur-card--wide {
  width: min(920px, 94vw);
  height: min(84vh, 740px);
}

.aur-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 22px;
  flex-shrink: 0;
}

.aur-step {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
}

.aur-step span {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}

.aur-step.active { color: #0f696e; }
.aur-step.active span { background: #0f696e; color: #fff; }
.aur-step.done { color: #64748b; }
.aur-step.done span { background: #241447; color: #fff; }

.aur-step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 10px;
  min-width: 32px;
}

.aur-back {
  border: none;
  background: transparent;
  color: #241447;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin-bottom: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
}

.aur-back:hover { color: #0f696e; }

.aur-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 2px;
}

.aur-scope-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 10px 12px;
  margin-bottom: 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.aur-scope-board {
  background: linear-gradient(180deg, #f7fcfc 0%, #ffffff 100%);
  border: 1px solid rgba(15, 105, 110, 0.16);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.aur-scope-board-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.aur-scope-board-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.aur-scope-board-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(15, 105, 110, 0.1);
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.aur-scope-board-kicker {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #0f696e;
}

.aur-scope-board-title {
  margin: 2px 0 0;
  font-size: 1rem;
  font-weight: 750;
  color: #241447;
  line-height: 1.25;
  word-break: break-word;
}

.aur-scope-count {
  flex-shrink: 0;
  background: #0f696e;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.aur-scope-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.aur-scope-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.1);
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 8px;
  max-width: 100%;
  word-break: break-all;
}

.aur-scope-chip i {
  color: #0f696e;
  font-size: 0.85rem;
}

.aur-scope-table-wrap {
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  max-height: 180px;
  overflow-y: auto;
}

.aur-scope-table {
  width: 100%;
  border-collapse: collapse;
}

.aur-scope-table th,
.aur-scope-table td {
  padding: 9px 12px;
  text-align: left;
  border-bottom: 1px solid #eef2f7;
  font-size: 0.82rem;
}

.aur-scope-table th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  z-index: 1;
}

.aur-scope-table tbody tr:last-child td {
  border-bottom: none;
}

.aur-scope-table td:first-child,
.aur-scope-table th:first-child {
  width: 42px;
  color: #94a3b8;
  font-weight: 600;
}

.aur-scope-target {
  font-weight: 700;
  color: #1e293b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.84rem;
}

.aur-scope-subnet {
  margin-left: 4px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
}

.aur-scope-type-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.aur-scope-type-pill.is-external {
  background: #ecfeff;
  color: #0f696e;
}

.aur-scope-type-pill.is-internal {
  background: #eef2ff;
  color: #4338ca;
}

.aur-scope-replace-hint {
  margin: 10px 0 0;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

.aur-report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
  margin-top: 2px;
}

.aur-report-stat {
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;
}

.aur-report-stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 750;
  color: #241447;
  line-height: 1.1;
}

.aur-report-stat-label {
  display: block;
  margin-top: 3px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.aur-header { text-align: center; margin-bottom: 20px; flex-shrink: 0; }

.aur-icon-wrap {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(15, 105, 110, 0.08);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
}

.aur-upload-icon { font-size: 26px; color: #0f696e; }
.aur-spin { animation: aur-spin 2.2s linear infinite; }

.aur-title {
  font-size: 24px;
  font-weight: 800;
  color: #241447;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.aur-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  max-width: 520px;
  margin: 0 auto;
}

.aur-choice-grid {
  display: grid;
  gap: 16px;
  flex: 1;
  min-height: 0;
  align-content: stretch;
}

@media (min-width: 700px) {
  .aur-choice-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.aur-choice-card {
  text-align: left;
  border: 1px solid rgba(36, 20, 71, 0.1);
  border-radius: 16px;
  background: #faf9fc;
  padding: 1.5rem 1.4rem 1.35rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
}

.aur-choice-card:hover {
  border-color: #241447;
  background: #fff;
  box-shadow: 0 8px 24px rgba(36, 20, 71, 0.08);
  transform: translateY(-1px);
}

.aur-choice-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(15, 105, 110, 0.1);
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 0.9rem;
}

.aur-choice-icon--alt {
  background: rgba(36, 20, 71, 0.08);
  color: #241447;
}

.aur-choice-title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: #241447;
}

.aur-choice-copy {
  margin: 0;
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.5;
  flex: 1;
}

.aur-choice-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f696e;
  margin-top: 1.1rem;
}

.aur-dropzone {
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  padding: 28px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  margin-bottom: 14px;
  flex: 1;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aur-dropzone:hover,
.aur-dropzone-active {
  border-color: #0f696e;
  background: rgba(15, 105, 110, 0.04);
}

.aur-dropzone-has-file {
  border-color: #0f696e;
  border-style: solid;
  background: rgba(15, 105, 110, 0.03);
}

.aur-file-input { display: none; }

.aur-drop-icon { font-size: 34px; color: #94a3b8; margin-bottom: 8px; }
.aur-drop-text { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 4px; }
.aur-drop-sub { font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.aur-browse { color: #0f696e; font-weight: 600; text-decoration: underline; }
.aur-drop-types { font-size: 11px; color: #9ca3af; letter-spacing: 0.04em; margin: 0; }

.aur-file-info {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}

.aur-file-icon { font-size: 32px; color: #0f696e; flex-shrink: 0; }
.aur-file-name { font-size: 14px; font-weight: 700; color: #241447; margin: 0; }
.aur-file-size { font-size: 12px; color: #6b7280; margin: 2px 0 0; }

.aur-remove-btn {
  margin-left: auto;
  background: none; border: none;
  color: #ef4444; font-size: 20px;
  cursor: pointer; flex-shrink: 0;
}

.aur-field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #241447;
  margin-bottom: 0.45rem;
}

.aur-textarea {
  width: 100%;
  border: 1px solid rgba(36, 20, 71, 0.15);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #241447;
  resize: none;
  flex: 1;
  min-height: 180px;
  background: #faf9fc;
  margin-bottom: 0.55rem;
}

.aur-textarea:focus {
  outline: none;
  border-color: #241447;
  box-shadow: 0 0 0 0.2rem rgba(36, 20, 71, 0.1);
  background: #fff;
}

.aur-manual-meta {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f696e;
  margin-bottom: 0.65rem;
}

.aur-progress-wrap {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.aur-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.aur-progress-label { font-size: 13px; font-weight: 600; color: #374151; }
.aur-progress-pct { font-size: 14px; font-weight: 800; color: #0f696e; }

.aur-progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.aur-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f696e, #10b981);
  border-radius: 99px;
  transition: width 0.3s ease;
}

.aur-progress-indeterminate {
  width: 35%;
  animation: aur-indeterminate 1.2s ease-in-out infinite;
}

.aur-progress-hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 10px 0 0;
  text-align: center;
}

.aur-generating { text-align: center; }

.aur-error {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  text-align: center;
  line-height: 1.4;
  white-space: pre-line;
  flex-shrink: 0;
}

.aur-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.aur-btn-primary {
  width: 100%;
  padding: 13px;
  background: #0f696e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.aur-btn-primary:hover:not(:disabled) { background: #0a4e52; }
.aur-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.aur-info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  text-align: left;
  flex-shrink: 0;
  margin: 0;
}

.aur-info-icon { color: #0f696e; flex-shrink: 0; margin-top: 1px; }

@keyframes aur-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes aur-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(320%); }
}

/* Keep each step panel inside the card height */
.aur-card > div:not(.aur-steps) {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 576px) {
  .aur-page { padding: 10px 12px; }
  .aur-card,
  .aur-card--wide {
    width: 100%;
    height: min(88vh, 100%);
    padding: 18px 16px 14px;
  }
  .aur-title { font-size: 20px; }
  .aur-steps { gap: 0; margin-bottom: 14px; }
  .aur-step-line { min-width: 16px; }
  .aur-dropzone { padding: 18px 12px; min-height: 120px; }
  .aur-choice-card { padding: 1.15rem 1rem; }
}
</style>
