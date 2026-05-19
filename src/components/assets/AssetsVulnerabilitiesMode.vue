<template>
  <div class="av-mode-root">
    <!-- Left: vulnerability list -->
    <div class="av-left">
      <div class="av-left-header">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h2 class="av-left-title">All Vulnerabilities</h2>
          <span class="av-count-badge">{{ filteredVulns.length }}</span>
        </div>
        <div class="av-filter-pills">
          <button
            type="button"
            :class="['av-pill', activeFilters.includes('All') ? 'av-pill-all' : 'av-pill-inactive']"
            @click="setFilter('All')"
          >
            All
          </button>
          <button
            type="button"
            :class="['av-pill', activeFilters.includes('Critical') ? 'av-pill-critical' : 'av-pill-inactive']"
            @click="setFilter('Critical')"
          >
            Critical
          </button>
          <button
            type="button"
            :class="['av-pill', activeFilters.includes('High') ? 'av-pill-high' : 'av-pill-inactive']"
            @click="setFilter('High')"
          >
            High
          </button>
          <button
            type="button"
            :class="['av-pill', activeFilters.includes('Medium') ? 'av-pill-medium' : 'av-pill-inactive']"
            @click="setFilter('Medium')"
          >
            Medium
          </button>
          <button
            type="button"
            :class="['av-pill', activeFilters.includes('Low') ? 'av-pill-low' : 'av-pill-inactive']"
            @click="setFilter('Low')"
          >
            Low
          </button>
        </div>
        <div class="av-search-box">
          <i class="bi bi-search av-search-icon"></i>
          <input
            v-model="vulnQuery"
            type="text"
            class="av-search-input"
            placeholder="Search vulnerabilities..."
          />
        </div>
      </div>

      <div v-if="loading" class="av-loading">
        <span class="spinner-border spinner-border-sm text-primary"></span>
      </div>
      <div v-else class="av-vuln-list">
        <div
          v-for="item in filteredVulns"
          :key="item._key"
          class="av-vuln-item"
          :class="{ active: selectedKey === item._key }"
          @click="selectVuln(item)"
        >
          <div class="av-vi-top">
            <span class="av-vi-id">{{ item.displayId }}</span>
            <span class="av-vi-sev" :class="sevClass(item.severity)">{{ item.severity }}</span>
            <span class="av-vi-status" :class="statusClass(item.status)">{{ statusLabel(item.status) }}</span>
          </div>
          <div class="av-vi-title">{{ item.vul_name }}</div>
          <div class="av-vi-meta">
            <span v-if="item.cve" class="av-vi-cve">{{ item.cve }}</span>
            <span v-if="item.cvss_score != null && item.cvss_score !== ''" class="av-vi-cvss">CVSS {{ item.cvss_score }}</span>
            <span class="av-vi-hosts">• {{ item.assets.length }} asset{{ item.assets.length === 1 ? '' : 's' }}</span>
          </div>
        </div>
        <p v-if="!filteredVulns.length" class="av-empty-list">No vulnerabilities found.</p>
      </div>
    </div>

    <!-- Right: detail -->
    <div class="av-right">
      <div v-if="!selectedVuln" class="av-empty-state">
        <div class="av-empty-icon">🛡️</div>
        <p class="av-empty-text">Select a vulnerability</p>
        <p class="av-empty-sub">Choose from the list on the left to view details, automated fix assessment, and manual remediation steps.</p>
      </div>

      <div v-else class="av-detail">
        <div class="av-detail-header">
          <div class="av-dh-top">
            <span class="av-dh-id">{{ selectedVuln.displayId }}</span>
            <span class="av-detail-sev" :class="sevClass(selectedVuln.severity)">{{ selectedVuln.severity }}</span>
            <span class="av-detail-status" :class="statusDetailClass(selectedVuln.status)">
              ● {{ statusLabel(selectedVuln.status).toUpperCase() }}
            </span>
          </div>
          <div class="av-title-row">
            <h1 class="av-dh-title">{{ selectedVuln.vul_name }}</h1>
            <span class="av-cvss-pill">CVSS {{ selectedVuln.cvss_score || '—' }}</span>
          </div>
        </div>

        <div class="av-description-block">
          <div class="av-db-label">Description</div>
          <p class="av-db-text">{{ displayDescription }}</p>
          <button
            v-if="showReadMore"
            type="button"
            class="av-read-more"
            @click="descriptionExpanded = !descriptionExpanded"
          >
            {{ descriptionExpanded ? 'Read less' : 'Read more' }}
          </button>
        </div>

        <div class="av-affected-block">
          <div class="av-aab-label">Affected Assets ({{ selectedVuln.assets.length }})</div>
          <div class="av-aab-chips">
            <span v-for="ip in selectedVuln.assets" :key="ip" class="av-asset-chip">{{ ip }}</span>
          </div>
        </div>

        <div class="av-detail-tabs">
          <button
            type="button"
            class="av-dtab"
            :class="{ active: detailTab === 'affected' }"
            @click="setDetailTab('affected')"
          >
            🎯 Affected Assets
          </button>
          <button
            type="button"
            class="av-dtab"
            :class="{ active: detailTab === 'auto' }"
            @click="setDetailTab('auto')"
          >
            🐍 Automated Fix
          </button>
          <button
            type="button"
            class="av-dtab"
            :class="{ active: detailTab === 'manual' }"
            @click="setDetailTab('manual')"
          >
            📋 Manual Fix
          </button>
        </div>

        <div class="av-detail-tab-content">
          <div v-if="detailTab === 'auto'" class="av-auto-tab">
            <div class="av-assess-card">
              <div class="av-assess-header">
                <div>
                  <div class="av-assess-title">Automation Capability Assessment</div>
                  <div class="av-assess-sub">Based on vulnerability profile and remediation data</div>
                </div>
                <div class="av-feas-badge" :style="feasBadgeStyle">
                  <span class="av-feas-level">{{ automationLevel }}</span>
                  <span class="av-feas-pct">{{ automationPct }} automatable</span>
                </div>
              </div>
              <div class="av-progress-track">
                <div class="av-progress-fill" :style="{ width: automationPct, background: feasColor }"></div>
              </div>
              <div class="av-assess-grid">
                <div class="av-assess-col">
                  <div class="col-head green-head">✓ What can be automated</div>
                  <ul class="av-can-list">
                    <li v-for="(line, i) in canAutomate" :key="'c' + i" class="av-can-item">
                      <span class="av-can-dot">✓</span>{{ line }}
                    </li>
                  </ul>
                </div>
                <div class="av-assess-col">
                  <div class="col-head red-head">✗ What must remain manual</div>
                  <ul class="av-can-list">
                    <li v-for="(line, i) in mustManual" :key="'m' + i" class="av-cant-item">
                      <span class="av-cant-dot">✗</span>{{ line }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="av-recommended-box">
              <div class="av-rec-label">Recommended approach</div>
              <div class="av-rec-text">{{ recommendedText }}</div>
            </div>
          </div>

          <div v-else-if="detailTab === 'manual'" class="av-manual-tab">
            <div v-for="asset in selectedVuln.assets" :key="asset" class="av-asset-section">
              <div class="av-asset-label">
                <span class="av-asset-ip-badge">{{ asset }}</span>
                <span v-if="assetMeta(asset).port" class="av-asset-port">:{{ assetMeta(asset).port }}</span>
                <span class="av-asset-os-lbl">{{ assetMeta(asset).os }}</span>
              </div>
              <ManualRemediationStepsPanel :is-user="isUser" />
            </div>
          </div>

          <div v-else-if="detailTab === 'affected'" class="av-affected-tab">
            <div class="av-assets-table-card">
              <table class="av-assets-table">
                <thead>
                  <tr>
                    <th>IP</th>
                    <th>Steps complete</th>
                    <th>Send for verification</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="!affectedAssetsTableRows.length">
                    <td colspan="3" class="av-assets-empty">No affected assets for this vulnerability.</td>
                  </tr>
                  <tr v-for="asset in affectedAssetsTableRows" :key="asset.ip">
                    <td class="av-assets-ip">{{ asset.ip }}</td>
                    <td>
                      <div class="av-assets-steps-cell">
                        <div class="av-assets-progress-track">
                          <div class="av-assets-progress-fill" :style="{ width: (asset.progress || 0) + '%' }"></div>
                        </div>
                        <span class="av-assets-steps-text">{{ asset.stepsCompleted }}/{{ asset.totalSteps }}</span>
                      </div>
                    </td>
                    <td>
                      <button type="button" class="av-assets-verify-btn" :disabled="asset.stepsCompleted < asset.totalSteps" @click="sendForVerification(asset)">
                        <i class="bi bi-send" aria-hidden="true"></i> Send for verification
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="affectedAssetsTableRows.length" class="av-assets-table-footer">
                Showing {{ affectedAssetsTableRows.length }} asset{{ affectedAssetsTableRows.length === 1 ? '' : 's' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import ManualRemediationStepsPanel from '@/components/assets/ManualRemediationStepsPanel.vue';

const DESC_LIMIT = 280;

export default {
  name: 'AssetsVulnerabilitiesMode',
  components: { ManualRemediationStepsPanel },
  props: {
    isUser: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      authStore: useAuthStore(),
      loading: false,
      vulnQuery: '',
      activeFilters: ['All'],
      selectedKey: null,
      detailTab: 'affected',
      descriptionExpanded: false,
      affectedAssetsData: [
        {
          ip: '210.14.23.65',
          status: 'In Progress',
          statusClass: 'status-progress',
          stepsCompleted: 2,
          totalSteps: 4,
          progress: 50,
          steps: [
            { name: 'Identify vulnerability location', completed: true },
            { name: 'Backup current configuration', completed: true },
            { name: 'Apply security patch', completed: false },
            { name: 'Verify fix implementation', completed: false },
          ],
        },
        {
          ip: '192.168.1.100',
          status: 'Pending',
          statusClass: 'status-pending',
          stepsCompleted: 0,
          totalSteps: 4,
          progress: 0,
          steps: [
            { name: 'Identify vulnerability location', completed: false },
            { name: 'Backup current configuration', completed: false },
            { name: 'Apply security patch', completed: false },
            { name: 'Verify fix implementation', completed: false },
          ],
        },
        {
          ip: '172.16.0.50',
          status: 'Completed',
          statusClass: 'status-completed',
          stepsCompleted: 4,
          totalSteps: 4,
          progress: 100,
          steps: [
            { name: 'Identify vulnerability location', completed: true },
            { name: 'Backup current configuration', completed: true },
            { name: 'Apply security patch', completed: true },
            { name: 'Verify fix implementation', completed: true },
          ],
        },
      ],
    };
  },
  computed: {
    rawRows() {
      if (this.isUser) {
        return this.authStore.cachedUserVulnRegister || [];
      }
      return this.authStore.vulnerabilityRows || [];
    },
    reportId() {
      return this.isUser ? this.authStore.userLatestReportId : this.authStore.latestReportId;
    },
    groupedVulns() {
      const map = new Map();
      const sevCounters = { critical: 0, high: 0, medium: 0, low: 0 };
      const sevPrefix = { critical: 'C', high: 'H', medium: 'M', low: 'L' };
      this.rawRows.forEach((row, index) => {
        const name = String(row.vul_name || row.plugin_name || row.vulnerability_name || '').trim();
        const key = name.toLowerCase() || `row-${row.id || index}`;
        const asset = row.asset || row.host_name || '';
        const sevKey = String(row.severity || row.risk_factor || 'medium').toLowerCase();
        const bucket = sevKey === 'critical' || sevKey === 'high' || sevKey === 'medium' || sevKey === 'low' ? sevKey : 'medium';
        if (!map.has(key)) {
          sevCounters[bucket] = (sevCounters[bucket] || 0) + 1;
          const prefix = sevPrefix[bucket] || 'V';
          map.set(key, {
            _key: key,
            displayId: `${prefix}${sevCounters[bucket]}`,
            id: row.id,
            vul_name: name || 'Unnamed vulnerability',
            severity: row.severity || row.risk_factor || 'Medium',
            status: row.status || 'open',
            description: row.description || '',
            cvss_score: row.cvss_score ?? row.cvss ?? null,
            cve: row.cve || row.cve_id || '',
            exposure: row.exposure || '',
            first_observation: row.first_observation,
            assets: asset ? [asset] : [],
            rows: [row],
          });
        } else {
          const g = map.get(key);
          if (asset && !g.assets.includes(asset)) g.assets.push(asset);
          g.rows.push(row);
          if (!g.description && row.description) g.description = row.description;
          if (!g.cve && (row.cve || row.cve_id)) g.cve = row.cve || row.cve_id;
          if ((g.cvss_score == null || g.cvss_score === '') && (row.cvss_score ?? row.cvss)) {
            g.cvss_score = row.cvss_score ?? row.cvss;
          }
        }
      });
      return Array.from(map.values());
    },
    filteredVulns() {
      let list = [...this.groupedVulns];
      if (!this.activeFilters.includes('All')) {
        list = list.filter(v => this.activeFilters.includes(this.canonSeverity(v.severity)));
      }
      const q = this.vulnQuery.trim().toLowerCase();
      if (q) {
        list = list.filter(v =>
          v.vul_name.toLowerCase().includes(q) ||
          v.assets.some(a => a.toLowerCase().includes(q)) ||
          String(v.cve || '').toLowerCase().includes(q)
        );
      }
      const rank = { critical: 0, high: 1, medium: 2, low: 3 };
      list.sort((a, b) => {
        const ar = rank[String(a.severity).toLowerCase()] ?? 9;
        const br = rank[String(b.severity).toLowerCase()] ?? 9;
        return ar - br || a.vul_name.localeCompare(b.vul_name);
      });
      return list;
    },
    selectedVuln() {
      if (!this.selectedKey) return null;
      return this.groupedVulns.find(v => v._key === this.selectedKey) || null;
    },
    affectedAssetsTableRows() {
      const vuln = this.selectedVuln;
      if (!vuln) return [];
      const ips = [...new Set((vuln.assets || []).filter(Boolean))];
      if (!ips.length) return [];
      const mockByIp = Object.fromEntries(this.affectedAssetsData.map(a => [a.ip, a]));
      return ips.map(ip => {
        if (mockByIp[ip]) return mockByIp[ip];
        return {
          ip,
          status: 'Pending',
          statusClass: 'status-pending',
          stepsCompleted: 0,
          totalSteps: 4,
          progress: 0,
        };
      });
    },
    fullDescription() {
      const text = this.cleanText(this.selectedVuln?.description);
      return text || 'No description available for this vulnerability.';
    },
    displayDescription() {
      if (this.descriptionExpanded || this.fullDescription.length <= DESC_LIMIT) {
        return this.fullDescription;
      }
      return `${this.fullDescription.slice(0, DESC_LIMIT).trimEnd()}...`;
    },
    showReadMore() {
      return this.fullDescription.length > DESC_LIMIT;
    },
    automationLevel() {
      const s = String(this.selectedVuln?.severity || '').toLowerCase();
      if (s === 'critical' || s === 'high') return 'Partial';
      if (s === 'medium') return 'High';
      return 'High';
    },
    automationPct() {
      const s = String(this.selectedVuln?.severity || '').toLowerCase();
      if (s === 'critical') return '40%';
      if (s === 'high') return '55%';
      if (s === 'medium') return '75%';
      return '85%';
    },
    feasColor() {
      const s = String(this.selectedVuln?.severity || '').toLowerCase();
      if (s === 'critical' || s === 'high') return '#d97706';
      return '#16a34a';
    },
    feasBadgeStyle() {
      const s = String(this.selectedVuln?.severity || '').toLowerCase();
      if (s === 'critical' || s === 'high') {
        return { background: '#fffbeb', borderColor: '#fde68a', color: '#92400e' };
      }
      return { background: '#f0fdf4', borderColor: '#86efac', color: '#166534' };
    },
    canAutomate() {
      return [
        'Detect affected services and versions across listed assets',
        'Apply network-level controls where appropriate (firewall rules)',
        'Run post-remediation verification scans from the scanner',
      ];
    },
    mustManual() {
      return [
        'Validate business impact before applying patches in production',
        'Coordinate maintenance window and application owner sign-off',
        'Review remediation steps for environment-specific configuration',
      ];
    },
    recommendedText() {
      return 'Use automation for detection and verification where possible. Perform configuration changes and patching manually per the remediation timeline, with staging validation first.';
    },
  },
  watch: {
    filteredVulns(list) {
      if (!list.length) {
        this.selectedKey = null;
        return;
      }
      if (!this.selectedKey || !list.some(v => v._key === this.selectedKey)) {
        this.selectVuln(list[0]);
      }
    },
    selectedKey() {
      this.descriptionExpanded = false;
      this.detailTab = 'auto';
    },
  },
  async mounted() {
    await this.loadVulnerabilities();
  },
  methods: {
    async loadVulnerabilities() {
      this.loading = true;
      if (this.isUser) {
        await this.authStore.fetchUserVulnerabilityRegister(true);
      } else {
        await this.authStore.fetchVulnerabilityRegister(true);
      }
      this.loading = false;
      if (this.filteredVulns.length) {
        this.selectVuln(this.filteredVulns[0]);
      }
    },
    canonSeverity(sev) {
      const s = String(sev || '').trim().toLowerCase();
      if (s === 'critical') return 'Critical';
      if (s === 'high') return 'High';
      if (s === 'medium') return 'Medium';
      if (s === 'low') return 'Low';
      const raw = String(sev || '').trim();
      return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
    },
    setFilter(type) {
      if (type === 'All') {
        this.activeFilters = ['All'];
        return;
      }
      const filters = this.activeFilters.filter(f => f !== 'All');
      const idx = filters.indexOf(type);
      if (idx === -1) {
        filters.push(type);
      } else {
        filters.splice(idx, 1);
      }
      this.activeFilters = filters.length === 0 ? ['All'] : filters;
    },
    selectVuln(item) {
      this.selectedKey = item._key;
    },
    cleanText(text) {
      if (!text) return '';
      return String(text)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
    },
    sevClass(sev) {
      const s = String(sev || '').toLowerCase();
      if (s === 'critical') return 'sev-c';
      if (s === 'high') return 'sev-h';
      if (s === 'medium') return 'sev-m';
      return 'sev-l';
    },
    statusLabel(status) {
      const n = String(status || 'open').toLowerCase();
      if (n === 'closed' || n === 'resolved') return 'Closed';
      if (n === 'overdue') return 'Overdue';
      return 'Open';
    },
    statusClass(status) {
      const n = String(status || 'open').toLowerCase();
      if (n === 'closed' || n === 'resolved') return 'status-open';
      if (n === 'overdue') return 'status-overdue';
      return 'status-open';
    },
    statusDetailClass(status) {
      const n = String(status || 'open').toLowerCase();
      if (n === 'closed' || n === 'resolved') return 'ds-open';
      return 'ds-overdue';
    },
    setDetailTab(tab) {
      this.detailTab = tab;
    },
    assetMeta(asset) {
      const row = this.selectedVuln?.rows?.find(r => (r.asset || r.host_name) === asset) || {};
      const port = row.port || row.service_port || row.protocol_port || '';
      const os = row.operating_system || row.os || row.platform || 'Linux';
      return { port, os };
    },
    sendForVerification(asset) {
      if (asset.stepsCompleted < asset.totalSteps) return;
      Swal.fire({
        icon: 'info',
        title: 'Verification request',
        text: `Remediation for ${asset.ip} will be sent for verification. You will be notified once it is reviewed.`,
        confirmButtonText: 'OK',
      });
      asset.status = 'Under Verification';
      asset.statusClass = 'status-verification';
    },
  },
};
</script>

<style scoped>
.av-mode-root {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  align-items: flex-start;
}

.av-left {
  width: 33%;
  min-width: 300px;
  max-width: 380px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  align-self: stretch;
  max-height: 100%;
}

.av-left-header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.av-left-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.av-count-badge {
  font-size: 0.68rem;
  font-weight: 700;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 2px 10px;
  color: #475569;
}

.av-filter-pills {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.av-pill {
  border: none;
  border-radius: 50px;
  padding: 5px 14px;
  font-size: 0.68rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.av-pill-inactive {
  background: #f2f3f6;
  color: #49454f;
}

.av-pill-inactive:hover {
  background: #e7e8eb;
}

.av-pill-all {
  background: #241447;
  color: #fff;
}

.av-pill-critical {
  background: #f8dede !important;
  color: #b42318 !important;
}

.av-pill-high {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}

.av-pill-medium {
  background: #f7e4bf;
  color: #d48806;
}

.av-pill-low {
  background: #cfead8;
  color: #1f7a57;
}

.av-search-box { position: relative; }

.av-search-icon {
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #94a3b8;
}

.av-search-input {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 7px 10px 7px 30px;
  font-size: 0.75rem;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
}

.av-search-input:focus {
  border-color: #94a3b8;
  background: #fff;
}

.av-vuln-list {
  flex: 1;
  overflow-y: auto;
  padding: 6px 0;
}

.av-vuln-item {
  padding: 11px 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  border-bottom: 1px solid #f8fafc;
  transition: all 0.15s;
}

.av-vuln-item:hover {
  background: #f8fafc;
  border-left-color: #cbd5e1;
}

.av-vuln-item.active {
  background: #f0fdf4;
  border-left-color: #10b981;
}

.av-vi-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.av-vi-id {
  font-size: 0.62rem;
  font-weight: 700;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 1px 6px;
  color: #475569;
  font-family: monospace;
}

.av-vi-sev {
  font-size: 0.56rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
}

.sev-c { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
.sev-h { background: #fff7ed; color: #9a3412; border: 1px solid #fdba74; }
.sev-m { background: #fffbeb; color: #92400e; border: 1px solid #fde68a; }
.sev-l { background: #f0fdf4; color: #166534; border: 1px solid #86efac; }

.av-vi-status {
  font-size: 0.56rem;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 3px;
  margin-left: auto;
}

.status-overdue { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }
.status-open { background: #f0fdf4; color: #166534; border: 1px solid #86efac; }

.av-vi-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.av-vi-meta {
  display: flex;
  align-items: center;
  gap: 7px;
  flex-wrap: wrap;
}

.av-vi-cve {
  font-size: 0.62rem;
  font-family: monospace;
  color: #6366f1;
  background: #f5f3ff;
  padding: 1px 5px;
  border-radius: 3px;
}

.av-vi-cvss {
  font-size: 0.62rem;
  color: #dc2626;
  font-weight: 700;
}

.av-vi-hosts {
  font-size: 0.62rem;
  color: #64748b;
}

.av-loading,
.av-empty-list {
  padding: 24px 16px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
}

.av-right {
  flex: 1;
  min-width: 0;
  align-self: flex-start;
  max-height: 100%;
  overflow-y: auto;
  background: #f8fafc;
}

.av-empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 24px;
  text-align: center;
}

.av-empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.4;
}

.av-empty-text {
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0 0 4px;
}

.av-empty-sub {
  font-size: 0.75rem;
  margin: 0;
  max-width: 320px;
}

.av-detail {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: auto;
}

.av-detail-header {
  background: #fff;
  padding: 18px 22px 14px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.av-dh-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 7px;
  flex-wrap: wrap;
}

.av-dh-id {
  font-size: 0.75rem;
  font-weight: 700;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  color: #475569;
  font-family: monospace;
}

.av-detail-sev {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 4px;
}

.av-cvss-pill {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #fff;
  border: 1px solid #818cf8;
  box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
}

.av-detail-status {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 4px;
}

.ds-overdue { background: #fef2f2; color: #dc2626; border: 1px solid #fca5a5; }
.ds-open { background: #f0fdf4; color: #16a34a; border: 1px solid #86efac; }

.av-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.av-dh-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
  margin: 0;
  flex: 1;
  min-width: 200px;
}

.av-description-block {
  background: #fff;
  padding: 14px 22px;
  border-bottom: 1px solid #f1f5f9;
}

.av-db-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 5px;
}

.av-db-text {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.65;
  margin: 0;
  white-space: pre-line;
}

.av-read-more {
  background: transparent;
  border: none;
  padding: 0;
  margin-top: 4px;
  color: #0f696e;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.av-affected-block {
  background: #fff;
  padding: 10px 22px 14px;
  border-bottom: 1px solid #e2e8f0;
}

.av-aab-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 6px;
}

.av-aab-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.av-asset-chip {
  font-size: 0.75rem;
  font-family: monospace;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
  border-radius: 5px;
  padding: 3px 10px;
  font-weight: 500;
}

.av-detail-tabs {
  display: flex;
  background: #fff;
  padding: 0 22px;
  border-bottom: 2px solid #e2e8f0;
  flex-shrink: 0;
}

.av-dtab {
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  margin-bottom: -2px;
}

.av-dtab.active {
  color: #0f172a;
  border-bottom-color: #0f172a;
}

.av-dtab:hover:not(.active) {
  color: #1e293b;
  background: #f8fafc;
}

.av-detail-tab-content {
  padding: 20px 22px;
  flex: 0 0 auto;
  min-height: 0;
  background: #f8fafc;
}

.av-detail-tab-content:has(.av-manual-tab),
.av-detail-tab-content:has(.av-affected-tab) {
  padding: 16px 22px 12px;
}

.av-detail-tab-content:has(.av-manual-tab) .av-manual-tab,
.av-detail-tab-content:has(.av-affected-tab) .av-affected-tab {
  padding: 0;
}

.av-detail-tab-content:has(.av-manual-tab) .av-asset-section:last-child {
  margin-bottom: 0;
}

.av-assess-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 18px;
  margin-bottom: 14px;
}

.av-assess-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.av-assess-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
}

.av-assess-sub {
  font-size: 0.68rem;
  color: #94a3b8;
}

.av-feas-badge {
  border: 1px solid;
  border-radius: 8px;
  padding: 7px 12px;
  text-align: center;
  flex-shrink: 0;
}

.av-feas-level {
  font-size: 0.8rem;
  font-weight: 700;
  display: block;
  line-height: 1;
}

.av-feas-pct {
  font-size: 0.68rem;
  display: block;
  margin-top: 2px;
}

.av-progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.av-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.4s;
}

.av-assess-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

@media (max-width: 900px) {
  .av-assess-grid {
    grid-template-columns: 1fr;
  }
}

.av-assess-col {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid #f1f5f9;
}

.col-head {
  font-size: 0.68rem;
  font-weight: 700;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.green-head { color: #166534; }
.red-head { color: #991b1b; }

.av-can-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.av-can-item,
.av-cant-item {
  display: flex;
  gap: 7px;
  font-size: 0.75rem;
  color: #374151;
  padding: 4px 0;
  line-height: 1.45;
  border-bottom: 1px solid #f8fafc;
}

.av-can-dot { color: #16a34a; font-weight: 700; flex-shrink: 0; width: 14px; }
.av-cant-dot { color: #dc2626; font-weight: 700; flex-shrink: 0; width: 14px; }

.av-recommended-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 12px 14px;
}

.av-rec-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1e40af;
  margin-bottom: 5px;
}

.av-rec-text {
  font-size: 0.75rem;
  color: #1e3a8a;
  line-height: 1.6;
}

.av-manual-tab {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.av-manual-global-error,
.av-asset-error {
  font-size: 0.78rem;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  padding: 8px 12px;
  margin-bottom: 10px;
}

.av-no-steps {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0 0 8px;
}

.av-asset-section {
  margin-bottom: 20px;
}

.av-asset-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.av-asset-ip-badge {
  font-family: monospace;
  font-size: 0.82rem;
  font-weight: 700;
  background: #0f172a;
  color: #fff;
  padding: 3px 10px;
  border-radius: 5px;
}

.av-asset-port {
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
}

.av-asset-os-lbl {
  font-size: 0.75rem;
  color: #64748b;
}

.av-step-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 9px;
  margin-bottom: 10px;
  overflow: hidden;
}

.av-step-head {
  background: #f8fafc;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.av-step-head:hover {
  background: #f1f5f9;
}

.av-step-card-open .av-step-head {
  border-bottom-color: #f1f5f9;
}

.av-step-chevron {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: #64748b;
  margin-left: auto;
}

.av-step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.av-step-title {
  font-size: 0.82rem;
  font-weight: 600;
  flex: 1;
  color: #1e293b;
}

.av-step-content {
  padding: 12px 14px;
}

.av-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 10px;
}

.av-field-grid-bottom {
  margin-top: 10px;
  margin-bottom: 0;
}

@media (max-width: 700px) {
  .av-field-grid {
    grid-template-columns: 1fr;
  }
}

.av-field {
  background: #f8fafc;
  border-radius: 6px;
  padding: 7px 10px;
  border: 1px solid #f1f5f9;
}

.av-field-full {
  grid-column: 1 / -1;
}

.av-fl {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.av-fv {
  font-size: 0.75rem;
  color: #1e293b;
  line-height: 1.5;
}

.av-fv-mono {
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.68rem;
  color: #4c1d95;
}

.av-fv-pretext {
  white-space: pre-line;
}

.av-cmd-wrap {
  margin-bottom: 10px;
}

.av-cmd-lbl {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.av-cmd-block {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #0f172a;
  border-radius: 7px;
  padding: 10px 14px;
}

.av-cmd-pre {
  flex: 1;
  background: transparent;
  color: #e2e8f0;
  padding: 0;
  overflow-x: auto;
  font-family: 'Cascadia Code', Consolas, monospace;
  font-size: 0.68rem;
  line-height: 1.8;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
}

.av-cmd-pre code {
  font-family: inherit;
  color: inherit;
}

.av-filepath-wrap {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.av-filepath-text {
  flex: 1;
  padding-right: 4px;
  word-break: break-all;
}

.av-field-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 2px;
}

.av-copy-icon-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  line-height: 1;
  transition: opacity 0.15s, color 0.15s;
}

.av-copy-icon-path {
  color: #7c3aed;
  font-size: 0.9rem;
}

.av-copy-icon-path:hover {
  color: #5b21b6;
}

.av-copy-icon-cmd {
  color: #94a3b8;
  font-size: 0.95rem;
  margin-top: 2px;
}

.av-copy-icon-cmd:hover {
  color: #e2e8f0;
}

.av-copy-icon-verify {
  color: #64748b;
  font-size: 0.85rem;
}

.av-copy-icon-verify:hover {
  color: #334155;
}

.av-tools-row {
  margin-top: 10px;
  margin-bottom: 10px;
}

.av-tools-fl {
  margin-bottom: 4px;
}

.av-tool-pill {
  display: inline-block;
  font-size: 0.68rem;
  font-family: monospace;
  padding: 2px 7px;
  border-radius: 4px;
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  margin: 2px 3px 2px 0;
}

.av-consideration {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 6px;
  padding: 9px 12px;
}

.av-consideration-text {
  margin-top: 4px;
  font-size: 0.75rem;
  color: #92400e;
  line-height: 1.55;
  white-space: pre-line;
}

/* Affected Assets tab — table rows (register-style) */
.av-affected-tab {
  padding: 0;
}

.av-assets-table-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 196, 208, 0.25);
}

.av-assets-table {
  width: 100%;
  border-collapse: collapse;
}

.av-assets-table thead tr {
  background: #f2f3f6;
}

.av-assets-table thead th {
  padding: 14px 20px;
  font-size: 11px;
  font-weight: 700;
  color: #241447;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
  border: none;
  white-space: nowrap;
}

.av-assets-table tbody tr {
  border-top: 1px solid rgba(203, 196, 208, 0.15);
  transition: background 0.15s;
}

.av-assets-table tbody tr:hover {
  background: #f8f9fc;
}

.av-assets-table tbody td {
  padding: 14px 20px;
  font-size: 13px;
  color: #191c1e;
  vertical-align: middle;
  border: none;
}

.av-assets-ip {
  font-weight: 600;
  font-family: ui-monospace, 'Courier New', monospace;
  color: #241447;
}

.av-assets-steps-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.av-assets-progress-track {
  flex: 1;
  min-width: 100px;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.av-assets-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 100%);
  border-radius: 999px;
  transition: width 0.25s ease;
}

.av-assets-steps-text {
  font-size: 12px;
  font-weight: 700;
  color: #0f696e;
  white-space: nowrap;
}

.av-assets-verify-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 999px;
  border: 1px solid #0f696e;
  background: #ffffff;
  color: #0f696e;
  cursor: pointer;
  white-space: nowrap;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}

.av-assets-verify-btn:hover:not(:disabled) {
  background: #f0fdfa;
  color: #0d5a5e;
}

.av-assets-verify-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: #cbd5e1;
  color: #94a3b8;
}

.av-assets-empty {
  text-align: center;
  color: #64748b;
  padding: 28px 20px !important;
}

.av-assets-table-footer {
  padding: 12px 20px;
  font-size: 12px;
  color: #64748b;
  border-top: 1px solid rgba(203, 196, 208, 0.15);
  background: #ffffff;
}

/* legacy affected-asset card styles (unused) */
.av-affected-tab-legacy {
  padding: 20px;
}

.affected-asset-card {
  background: #020617;
  border: 1px solid #1f2937;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.affected-asset-card:hover {
  box-shadow: 0 6px 20px rgba(90, 68, 255, 0.15);
  border-color: rgba(90, 68, 255, 0.3);
}

.affected-asset-header {
  background: linear-gradient(135deg, rgb(90, 68, 255) 0%, #764ba2 100%);
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.affected-asset-ip {
  font-size: 1.15rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.affected-asset-status {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.status-progress {
  background: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid #fbbf24;
}

.status-pending {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.status-completed {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
  border: 1px solid #22c55e;
}

.status-verification {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.affected-asset-body {
  padding: 28px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  color: #9ca3af;
  font-size: 13px;
  margin-bottom: 6px;
  display: block;
  font-weight: 500;
}

.form-control {
  background: #020617;
  border: 1px solid #1f2937;
  color: #fff;
  height: 46px;
  border-radius: 10px;
  font-size: 0.9rem;
  padding: 0 14px;
  width: 100%;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.form-control::placeholder {
  color: #6b7280;
}

.form-control:focus {
  background: #020617;
  border-color: rgb(90, 68, 255);
  box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.1);
  outline: none;
  color: #fff;
}

.steps-progress {
  background: #0f172a;
  padding: 18px;
  border-radius: 10px;
  border: 1px solid #1f2937;
}

.progress {
  height: 28px;
  background-color: #1f2937;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
  transition: width 0.4s ease;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.steps-list li {
  padding: 12px 0;
  font-size: 0.85rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #1f2937;
  transition: all 0.2s;
}

.steps-list li:last-child {
  border-bottom: none;
}

.steps-list li.step-completed {
  color: #e5e7eb;
  font-weight: 500;
}

.steps-list li i {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.btn-primary {
  background: linear-gradient(135deg, rgb(90, 68, 255) 0%, #764ba2 100%);
  border: none;
  padding: 14px 24px;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  color: #fff;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 46px;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #6d54ff 0%, #8a5ab8 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(90, 68, 255, 0.4);
}

.btn-primary:disabled {
  background: #374151;
  cursor: not-allowed;
  opacity: 0.5;
  transform: none;
  box-shadow: none;
}
</style>
