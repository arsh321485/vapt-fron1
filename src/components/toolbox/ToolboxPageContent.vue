<template>
  <div class="toolbox-page">
    <div class="vr-page-header toolbox-page-header">
      <div class="toolbox-header-text">
        <h2 class="vr-title">Security Toolbox</h2>
        <p class="vr-subtitle">
          A high-fidelity central library for vulnerability remediation and deployment scripts.
          Access audited fixes, dependency checks, and multi-OS installation protocols.
        </p>
      </div>
    </div>

    <!-- Table Format with Accordion -->
    <div class="vr-table-card">
      <div class="toolbox-table-wrapper">
        <table class="vr-table toolbox-table">
          <thead>
            <tr>
              <th class="col-expand"></th>
              <th class="col-title">Vulnerability Name</th>
              <th class="col-severity">Severity</th>

              <th class="col-automation">Automation</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(fix, index) in fixes" :key="fix.id">
              <!-- Main Row -->
              <tr
                class="toolbox-row vr-accordion-row"
                :class="{ 'row-expanded': expandedIndex === index }"
                @click="toggleRow(index)"
              >
                <td class="col-expand">
                  <button class="expand-btn" type="button">
                    <i class="bi" :class="expandedIndex === index ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                  </button>
                </td>
                <td class="col-title">
                  <p class="vr-vuln-name mb-0">{{ fix.title }}</p>
                </td>
                <td class="col-severity">
                  <span
                    :class="['vr-sev-badge', getSeverityClass(fix.tags)]"
                  >
                    {{ getSeverityLabel(fix.tags) }}
                  </span>
                </td>

                <td class="col-automation">
                  <span
                    v-if="hasAutomationTag(fix.tags)"
                    class="vr-status-pill vr-status-automated"
                  >
                    {{ getAutomationLabel(fix.tags) }}
                  </span>
                  <span v-else class="vr-status-pill vr-status-manual">
                    Manual
                  </span>
                </td>
              </tr>

              <!-- Expanded Content Row -->
              <tr v-if="expandedIndex === index" class="expanded-row">
                <td colspan="4" class="expanded-cell">
                  <div class="expanded-content">

                    <!-- Dependencies -->
                    <div class="content-section">
                      <div class="section-header">
                        <span class="section-title">
                          <i class="bi bi-box-seam"></i>
                          Required Dependencies
                        </span>
                      </div>
                      <div class="dependencies-grid">
                        <span v-for="lib in fix.libraries" :key="lib" class="dep-chip">
                          {{ lib }}
                        </span>
                      </div>
                    </div>

                    <!-- Code Snippet Section -->
                    <div class="content-section">
                      <div class="section-header">
                        <span class="section-title">
                          <i class="bi bi-code-square"></i>
                          Quick Deploy Command
                        </span>
                        <span class="snippet-lang-badge">{{ fix.snippetLang }}</span>
                      </div>
                      <div class="code-block-wrapper">
                        <pre class="code-block"><code>{{ fix.snippet }}</code></pre>
                        <button class="copy-code-btn" type="button" @click="copySnippet(fix.snippet)">
                          <i class="bi bi-clipboard"></i>
                        </button>
                      </div>
                    </div>

                    <!-- OS Tabs -->
                    <div class="content-section">
                      <div class="section-header">
                        <span class="section-title">
                          <i class="bi bi-gear"></i>
                          Installation Steps
                        </span>
                      </div>

                      <div class="os-tabs">
                        <button
                          v-for="os in fix.osTabs"
                          :key="os"
                          type="button"
                          class="os-tab"
                          :class="{ 'os-tab-active': selectedOS[index] === os }"
                          @click="selectOS(index, os)"
                        >
                          <i class="bi" :class="getOSIcon(os)"></i>
                          {{ getOSLabel(os) }}
                        </button>
                      </div>

                      <div class="os-steps-list">
                        <div
                          v-for="(step, stepIdx) in fix.osSteps[selectedOS[index] || fix.osTabs[0]]"
                          :key="stepIdx"
                          class="step-item"
                        >
                          <span class="step-num">{{ stepIdx + 1 }}</span>
                          <span class="step-text">{{ step }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Consideration -->
                    <div class="content-section consideration-section">
                      <div class="consideration-box">
                        <i class="bi consideration-icon" :class="fix.considerationIcon"></i>
                        <div class="consideration-content">
                          <span class="consideration-label">Important Consideration</span>
                          <p class="consideration-text">{{ fix.consideration }}</p>
                        </div>
                      </div>
                    </div>

                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="toolbox-disclaimer">
      <i class="bi bi-info-circle-fill"></i>
      <span>{{ disclaimer }}</span>
    </div>
  </div>
</template>

<script>
import { TOOLBOX_FIXES, TOOLBOX_DISCLAIMER, TOOLBOX_OS_TAB_LABELS } from '@/data/toolboxLibrary';

export default {
  name: 'ToolboxPageContent',
  data() {
    return {
      fixes: TOOLBOX_FIXES,
      disclaimer: TOOLBOX_DISCLAIMER,
      expandedIndex: null,
      selectedOS: {},
    };
  },
  methods: {
    toggleRow(index) {
      this.expandedIndex = this.expandedIndex === index ? null : index;

      // Initialize selectedOS for this fix if not exists
      if (!this.selectedOS[index] && this.fixes[index].osTabs.length) {
        this.selectedOS[index] = this.fixes[index].osTabs[0];
      }
    },
    selectOS(fixIndex, os) {
      this.selectedOS[fixIndex] = os;
    },
    getOSIcon(os) {
      const icons = {
        linux: 'bi-ubuntu',
        windows: 'bi-windows',
        macos: 'bi-apple',
      };
      return icons[os] || 'bi-laptop';
    },
    getOSLabel(os) {
      return TOOLBOX_OS_TAB_LABELS[os] || os.toUpperCase();
    },
    getSeverityLabel(tags) {
      const severityTag = tags.find(t => t.label.toLowerCase().includes('risk'));
      if (!severityTag) return 'Medium';
      // Remove 'Risk' word from label
      return severityTag.label.replace(/\s*Risk\s*/i, '').trim();
    },
    getSeverityClass(tags) {
      const severityTag = tags.find(t => t.label.toLowerCase().includes('risk'));
      if (!severityTag) return 'vr-sev-medium';

      if (severityTag.label.toLowerCase().includes('critical')) return 'vr-sev-critical';
      if (severityTag.label.toLowerCase().includes('high')) return 'vr-sev-high';
      if (severityTag.label.toLowerCase().includes('medium')) return 'vr-sev-medium';
      if (severityTag.label.toLowerCase().includes('low')) return 'vr-sev-low';
      return 'vr-sev-medium';
    },
    hasVerifiedTag(tags) {
      return tags.some(t => t.label.toLowerCase().includes('verified'));
    },
    hasAutomationTag(tags) {
      return tags.some(t =>
        t.label.toLowerCase().includes('automated') ||
        t.label.toLowerCase().includes('automation')
      );
    },
    getAutomationLabel(tags) {
      const autoTag = tags.find(t =>
        t.label.toLowerCase().includes('automated') ||
        t.label.toLowerCase().includes('automation') ||
        t.label.toLowerCase().includes('infrastructure')
      );
      return autoTag ? autoTag.label : 'Automated';
    },
    async copySnippet(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.$swal({
          icon: 'success',
          title: 'Copied!',
          text: 'Command copied to clipboard',
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },
  },
};
</script>

<style scoped>
.toolbox-page {
  padding: 0;
  margin: 0;
}

/* ===== PAGE HEADER (matches /vulnerabilityregister) ===== */
.toolbox-page-header {
  display: block;
  margin-bottom: 28px;
}

.toolbox-header-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  max-width: 100%;
}

.toolbox-page-header .vr-title {
  display: block;
  font-size: 1.6rem;
  font-weight: 700;
  color: #241447;
  margin: 0 0 4px;
  line-height: 1.2;
}

.toolbox-page-header .vr-subtitle {
  display: block;
  font-size: 13px;
  color: #49454f;
  margin: 0;
  max-width: 720px;
  line-height: 1.5;
  text-align: left;
}

/* ===== TABLE (matches /vulnerabilityregister) ===== */
.vr-table-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.toolbox-table-wrapper {
  overflow-x: auto;
}

.vr-table {
  width: 100%;
  border-collapse: collapse;
}

.vr-table thead tr {
  background: #f2f3f6;
}

.vr-table thead th {
  padding: 10px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #241447;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: none;
  white-space: nowrap;
}

.col-expand {
  width: 50px;
}

.col-severity {
  width: 150px;
}



.col-automation {
  width: 160px;
}

/* Table Rows */
.toolbox-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.vr-accordion-row:hover {
  background: #f8f9fc;
}

.toolbox-row.row-expanded {
  background: #f2f3f6;
}

.vr-table tbody tr {
  border-top: 1px solid rgba(203, 196, 208, 0.15);
}

.vr-table tbody td {
  padding: 10px 20px;
  font-size: 13px;
  color: #191c1e;
  vertical-align: middle;
  border: none;
}

.vr-vuln-name {
  font-weight: 700;
  color: #241447;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vr-sev-badge {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.vr-sev-critical { background: #f8dede !important; color: #b42318 !important; }
.vr-sev-high     { background: #fee2e2 !important; color: #dc2626 !important; }
.vr-sev-medium   { background: #fef3c7; color: #b45309; }
.vr-sev-low      { background: #ccfbf1; color: #0f766e; }

.vr-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}
.vr-status-closed {
  color: #0f696e;
  background: #cfead8;
}
.vr-status-unverified {
  color: #49454f;
  background: #f2f3f6;
}
.vr-status-automated {
  color: #0f696e;
  background: #e0f2f1;
}
.vr-status-manual {
  color: #92400e;
  background: #fef3c7;
}

/* Expand Button */
.expand-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.82rem;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

.expand-btn:hover {
  background: #f2f3f6;
  color: #1e293b;
}

/* Expanded Row */
.expanded-row {
  background: #f8f9fc;
}

.expanded-cell {
  padding: 0 !important;
  border-bottom: 2px solid #e2e8f0;
}

.expanded-content {
  padding: 28px;
}

/* Content Sections */
.content-section {
  margin-bottom: 28px;
}

.content-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  color: #241447;
}

.section-title i {
  color: #0f696e;
  font-size: 1rem;
}

.snippet-lang-badge {
  padding: 3px 10px;
  background: #e0f2f1;
  color: #0f696e;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
}

/* Code Block */
.code-block-wrapper {
  position: relative;
  background: #1e293b;
  border-radius: 10px;
  padding: 18px;
  overflow-x: auto;
}

.code-block {
  margin: 0;
  font-family: 'JetBrains Mono', 'Courier New', monospace;
  font-size: 0.85rem;
  color: #e2e8f0;
  line-height: 1.6;
}

.copy-code-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-code-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* OS Tabs */
.os-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.os-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: #f8f9fc;
  border: 1px solid rgba(203, 196, 208, 0.4);
  border-radius: 50px;
  font-size: 0.84rem;
  font-weight: 600;
  color: #49454f;
  cursor: pointer;
  transition: all 0.2s;
}

.os-tab:hover {
  border-color: #cbd5e1;
  color: #475569;
}

.os-tab-active {
  background: #e0f2f1 !important;
  border-color: #0f696e !important;
  color: #0f696e !important;
}

.os-tab i {
  font-size: 16px;
}

/* Steps List */
.os-steps-list {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
}

.step-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.step-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.step-num {
  width: 28px;
  height: 28px;
  background: #0f696e;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

.step-text {
  flex: 1;
  font-size: 13px;
  color: #49454f;
  line-height: 1.5;
}

/* Dependencies Grid */
.dependencies-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dep-chip {
  padding: 6px 12px;
  background: #f2f3f6;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #241447;
}

/* Consideration Section */
.consideration-section {
  margin-top: 24px;
}

.consideration-box {
  display: flex;
  gap: 14px;
  padding: 18px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-left: 4px solid #f59e0b;
  border-radius: 10px;
}

.consideration-icon {
  font-size: 24px;
  color: #f59e0b;
  flex-shrink: 0;
}

.consideration-content {
  flex: 1;
}

.consideration-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.consideration-text {
  margin: 0;
  font-size: 13px;
  color: #49454f;
  line-height: 1.5;
}

/* Disclaimer */
.toolbox-disclaimer {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f2f3f6;
  border: 1px solid rgba(203, 196, 208, 0.4);
  border-radius: 12px;
  font-size: 13px;
  color: #49454f;
  line-height: 1.5;
}

.toolbox-disclaimer i {
  font-size: 1rem;
  color: #0f696e;
  flex-shrink: 0;
}

@media (max-width: 1400px) {
  .col-automation {
    display: none;
  }
}


</style>
