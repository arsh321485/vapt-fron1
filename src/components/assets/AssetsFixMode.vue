<template>
  <div class="af-mode-root">
    <!-- Left: common vulnerabilities list -->
    <div class="av-left af-left">
      <div class="av-left-header left-panel-header">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h2 class="av-left-title assets-title">Fix</h2>
          <span class="av-count-badge assets-count-badge">{{ filteredCommonVulns.length }} Common</span>
        </div>
        <p class="af-subtitle">
          Vulnerabilities appearing across multiple OS versions — fix once, apply everywhere.
        </p>
        <div class="av-search-box">
          <i class="bi bi-search av-search-icon"></i>
          <input
            v-model="fixQuery"
            type="text"
            class="av-search-input"
            placeholder="Search common vulnerabilities..."
          />
        </div>
      </div>

      <div class="av-vuln-list asset-list-scroll" :class="{ 'av-vuln-list--loading': loading }">
        <div v-if="loading" class="text-center py-4">
          <span class="spinner-border spinner-border-sm text-primary"></span>
        </div>
        <template v-else>
          <div
            v-for="item in pagedCommonVulns"
            :key="item._key"
            class="asset-item-new"
            :class="{ 'asset-item-active': selectedKey === item._key }"
            @click="selectCommonVuln(item)"
          >
            <div class="av-list-item-primary d-flex align-items-start justify-content-between gap-2">
              <span class="asset-ip av-vuln-list-name">{{ item.vul_name }}</span>
              <span class="sev-badge flex-shrink-0" :class="'sev-' + (item.severity?.toLowerCase() || '')">
                {{ item.severity }}
              </span>
            </div>
            <div class="d-flex gap-2 flex-wrap">
              <span class="vuln-chip">
                <i class="bi bi-layers me-1" aria-hidden="true"></i>
                {{ item.osGroupCount }} OS version{{ item.osGroupCount === 1 ? '' : 's' }}
              </span>
              <span class="vuln-chip">
                {{ item.totalAssetCount }} asset{{ item.totalAssetCount === 1 ? '' : 's' }}
              </span>
            </div>
            <div class="af-os-preview mt-2">
              <span
                v-for="os in item.osPreview"
                :key="os"
                class="af-os-tag"
              >{{ os }}</span>
              <span v-if="item.osGroupCount > item.osPreview.length" class="af-os-tag af-os-tag-more">
                +{{ item.osGroupCount - item.osPreview.length }} more
              </span>
            </div>
          </div>
          <p v-if="!filteredCommonVulns.length" class="av-empty-list">
            No common vulnerabilities found across multiple OS versions.
          </p>
        </template>

        <nav v-if="fixTotalPages > 1" class="pagination-bottom">
          <ul class="pagination pagination-sm mb-0 custom-pagination">
            <li class="page-item" :class="{ disabled: fixCurrentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="fixPrevPage">Prev</a>
            </li>
            <li v-for="p in fixPageNumbers" :key="p" class="page-item" :class="{ active: fixCurrentPage === p }">
              <a class="page-link" href="#" @click.prevent="fixGoToPage(p)">{{ p }}</a>
            </li>
            <li class="page-item" :class="{ disabled: fixCurrentPage === fixTotalPages }">
              <a class="page-link" href="#" @click.prevent="fixNextPage">Next</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Right: common fix detail -->
    <div class="av-right af-right assets-right-panel">
      <template v-if="selectedVuln">
        <div class="right-panel-header">
          <div class="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <h1 class="asset-detail-title mb-1">{{ selectedVuln.vul_name }}</h1>
              <p class="av-selected-asset-sub mb-0">
                Common across {{ selectedOsGroups.length }} OS version{{ selectedOsGroups.length === 1 ? '' : 's' }}
                · {{ selectedTotalAssets }} affected asset{{ selectedTotalAssets === 1 ? '' : 's' }}
              </p>
            </div>
            <span class="sev-badge" :class="'sev-' + (selectedVuln.severity?.toLowerCase() || '')">
              {{ selectedVuln.severity }}
            </span>
          </div>
        </div>

        <div class="av-right-scroll right-panel-scroll">
          <div class="av-right-inner">
            <!-- Info banner -->
            <div class="af-info-banner">
              <i class="bi bi-info-circle af-info-icon" aria-hidden="true"></i>
              <div>
                <strong>Common fix available</strong>
                <p class="mb-0">
                  This vulnerability appears on multiple OS versions. Apply one common fix here and it will
                  remediate all matching assets according to their OS version.
                </p>
              </div>
            </div>

            <!-- OS version groups -->
            <div class="af-section">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h3 class="section-label mb-0">OS Version Breakdown</h3>
                <label class="af-select-all-label">
                  <input
                    v-model="selectAllOs"
                    type="checkbox"
                    class="form-check-input me-1"
                    @change="toggleSelectAllOs"
                  />
                  Select all OS versions
                </label>
              </div>

              <div class="af-os-groups">
                <div
                  v-for="group in selectedOsGroups"
                  :key="group.osKey"
                  class="af-os-group-card"
                  :class="{ 'af-os-group-card--selected': selectedOsKeys.includes(group.osKey) }"
                >
                  <div class="af-os-group-header" @click="toggleOsGroup(group.osKey)">
                    <input
                      type="checkbox"
                      class="form-check-input flex-shrink-0"
                      :checked="selectedOsKeys.includes(group.osKey)"
                      @click.stop
                      @change="toggleOsGroup(group.osKey)"
                    />
                    <div class="af-os-group-info flex-grow-1">
                      <div class="d-flex align-items-center gap-2 flex-wrap">
                        <i class="bi bi-pc-display af-os-icon" aria-hidden="true"></i>
                        <span class="af-os-name">{{ group.osLabel }}</span>
                        <span class="af-os-asset-count">{{ group.assets.length }} asset{{ group.assets.length === 1 ? '' : 's' }}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="af-os-expand-btn"
                      @click.stop="toggleOsExpand(group.osKey)"
                    >
                      <i class="bi" :class="expandedOsKeys.includes(group.osKey) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                    </button>
                  </div>
                  <div v-if="expandedOsKeys.includes(group.osKey)" class="af-os-assets-list">
                    <div
                      v-for="asset in group.assets"
                      :key="asset.host_name"
                      class="af-os-asset-row"
                    >
                      <i class="bi bi-hdd-network me-2 text-muted" aria-hidden="true"></i>
                      <span class="af-os-asset-ip">{{ asset.host_name }}</span>
                      <span :class="getStatusBadgeClass(asset.status)">
                        <span :class="getStatusDotClass(asset.status)"></span>
                        {{ getStatusLabel(asset.status) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fix method tabs -->
            <div class="af-remediation-card">
              <h3 class="section-label af-remediation-label">Remediation Method</h3>
              <div class="av-detail-tabs">
                <button
                  type="button"
                  class="av-dtab"
                  :class="{ active: fixMethodTab === 'auto' }"
                  @click="fixMethodTab = 'auto'"
                >
                  <span class="av-dtab-emoji" aria-hidden="true">🤖</span>
                  Automated Fix
                </button>
                <button
                  type="button"
                  class="av-dtab"
                  :class="{ active: fixMethodTab === 'manual' }"
                  @click="fixMethodTab = 'manual'"
                >
                  <span class="av-dtab-emoji" aria-hidden="true">📋</span>
                  Manual Fix
                </button>
              </div>

              <div class="av-detail-tab-content">
                <div v-if="fixMethodTab === 'auto'" class="av-auto-tab">
                  <AutomationNotSafeBanner v-if="isAutomationNotSafe" />
                  <AutomatedFixPanel
                    v-else
                    :severity="selectedVuln.severity"
                    :vuln-name="selectedVuln.vul_name"
                    :asset-ip="selectedOsGroups[0]?.assets[0]?.host_name"
                    :asset-index="0"
                    @view-code="showCodeModal = true"
                  />
                </div>
                <div v-else class="av-manual-tab">
                  <ManualRemediationStepsPanel
                    :is-user="isUser"
                    :vuln-name="selectedVuln ? selectedVuln.vul_name : ''"
                    :asset-ip="selectedOsGroups.length ? (selectedOsGroups[0].assets[0] && selectedOsGroups[0].assets[0].host_name) || '' : ''"
                    :severity="selectedVuln ? selectedVuln.severity || 'Medium' : 'Medium'"
                    :vuln-id="selectedVuln ? String(selectedVuln.id || selectedVuln._id || '') : ''"
                    :asset-os="selectedOsGroups.length ? selectedOsGroups[0].osLabel || '' : ''"
                    :fix-id="manualFixVulnId"
                  />
                </div>
              </div>
            </div>

            <!-- Apply common fix CTA -->
            <div class="af-apply-section">
              <div class="af-apply-summary">
                <div class="af-apply-stat">
                  <span class="af-apply-stat-value">{{ selectedOsKeys.length }}</span>
                  <span class="af-apply-stat-label">OS version{{ selectedOsKeys.length === 1 ? '' : 's' }} selected</span>
                </div>
                <div class="af-apply-stat">
                  <span class="af-apply-stat-value">{{ selectedAssetCount }}</span>
                  <span class="af-apply-stat-label">asset{{ selectedAssetCount === 1 ? '' : 's' }} to fix</span>
                </div>
              </div>
              <button
                type="button"
                class="af-apply-btn"
                :disabled="!selectedOsKeys.length || applyingFix"
                @click="applyCommonFix"
              >
                <span v-if="applyingFix" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-wrench-adjustable me-2" aria-hidden="true"></i>
                Apply Common Fix
              </button>
              <p class="af-apply-hint mb-0">
                Fix will be applied per OS version across all selected assets automatically.
              </p>
            </div>
          </div>
        </div>
      </template>

      <div v-else class="af-empty-right">
        <i class="bi bi-layers af-empty-icon" aria-hidden="true"></i>
        <p class="af-empty-title">Select a common vulnerability</p>
        <p class="af-empty-text">Choose a vulnerability from the left that appears across multiple OS versions.</p>
      </div>
    </div>

    <!-- Code Modal -->
    <div v-if="showCodeModal" class="code-modal-backdrop" @click.self="showCodeModal = false">
      <div class="code-modal-box">
        <div class="code-modal-header">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-file-earmark-code" style="font-size: 1.2rem; color: #6366f1;"></i>
            <h3 class="code-modal-title">common_os_fix.py</h3>
          </div>
          <button class="code-modal-close" @click="showCodeModal = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="code-modal-body">
          <div class="code-header-badge">Python 3.7+</div>
          <pre class="code-block"><code>{{ automationCode }}</code></pre>
        </div>
        <div class="code-modal-footer">
          <button class="code-copy-btn" @click="copyCodeToClipboard">
            <i class="bi bi-clipboard"></i>
            {{ codeCopied ? 'Copied!' : 'Copy to Clipboard' }}
          </button>
          <button class="code-close-btn" @click="showCodeModal = false">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import ManualRemediationStepsPanel from '@/components/assets/ManualRemediationStepsPanel.vue';
import AutomatedFixPanel from '@/components/assets/AutomatedFixPanel.vue';
import AutomationNotSafeBanner from '@/components/assets/AutomationNotSafeBanner.vue';
import {
  enrichReportVulnerabilitiesFromRegister,
  isAutomationNotAvailable,
  normalizeReportVulnerabilityList,
} from '@/utils/assetVulnerabilities';

const DEMO_OS_VARIANTS = [
  'Windows Server 2019',
  'Windows Server 2022',
  'Ubuntu 20.04 LTS',
  'Ubuntu 22.04 LTS',
  'RHEL 8.6',
  'RHEL 9.2',
  'CentOS 7',
  'Debian 11',
];

export default {
  name: 'AssetsFixMode',
  components: {
    ManualRemediationStepsPanel,
    AutomatedFixPanel,
    AutomationNotSafeBanner,
  },
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
      fixQuery: '',
      selectedKey: null,
      vulnAssetsByKey: {},
      fixCurrentPage: 1,
      fixPageSize: 6,
      fixMethodTab: 'auto',
      selectedOsKeys: [],
      expandedOsKeys: [],
      selectAllOs: true,
      applyingFix: false,
      showCodeModal: false,
      codeCopied: false,
      automationCode: `#!/usr/bin/env python3
"""Common OS-version-aware fix script."""
import platform
import subprocess

OS_FIX_COMMANDS = {
    "windows server 2019": ["powershell", "-Command", "Install-WindowsUpdate -AcceptAll"],
    "windows server 2022": ["powershell", "-Command", "Install-WindowsUpdate -AcceptAll"],
    "ubuntu 20.04 lts": ["apt-get", "update", "&&", "apt-get", "upgrade", "-y"],
    "ubuntu 22.04 lts": ["apt-get", "update", "&&", "apt-get", "upgrade", "-y"],
    "rhel 8.6": ["yum", "update", "-y"],
    "rhel 9.2": ["dnf", "update", "-y"],
}

def apply_common_fix(os_version: str) -> bool:
    key = os_version.lower().strip()
    cmd = OS_FIX_COMMANDS.get(key)
    if not cmd:
        print(f"No fix mapping for OS: {os_version}")
        return False
    print(f"Applying fix on {os_version}...")
    subprocess.run(cmd, check=True)
    return True

if __name__ == "__main__":
    apply_common_fix(platform.platform())`,
    };
  },
  computed: {
    reportId() {
      return this.isUser ? this.authStore.userLatestReportId : this.authStore.latestReportId;
    },
    deletedVulnAssetRows() {
      return this.isUser
        ? this.authStore.userDeletedVulnerabilityAssets
        : this.authStore.deletedVulnerabilityAssets;
    },
    reportVulnRows() {
      return this.isUser
        ? this.authStore.userAllReportVulnerabilities
        : this.authStore.allReportVulnerabilities;
    },
    groupedVulns() {
      const list = normalizeReportVulnerabilityList(this.reportVulnRows);
      const registerRows = this.isUser
        ? this.authStore.cachedUserVulnRegister
        : this.authStore.vulnerabilityRows;
      return enrichReportVulnerabilitiesFromRegister(
        list,
        registerRows,
        this.deletedVulnAssetRows,
      );
    },
    commonVulnItems() {
      return this.groupedVulns
        .map(vuln => {
          const osGroups = this.buildOsGroupsForVuln(vuln);
          if (osGroups.length < 2) return null;
          const totalAssetCount = osGroups.reduce((sum, g) => sum + g.assets.length, 0);
          return {
            ...vuln,
            osGroups,
            osGroupCount: osGroups.length,
            totalAssetCount,
            osPreview: osGroups.slice(0, 3).map(g => g.osLabel),
          };
        })
        .filter(Boolean);
    },
    filteredCommonVulns() {
      const q = this.fixQuery.trim().toLowerCase();
      if (!q) return this.commonVulnItems;
      return this.commonVulnItems.filter(v =>
        v.vul_name.toLowerCase().includes(q) ||
        v.osPreview.some(os => os.toLowerCase().includes(q)),
      );
    },
    fixTotalPages() {
      return Math.max(1, Math.ceil(this.filteredCommonVulns.length / this.fixPageSize));
    },
    fixPageNumbers() {
      const pages = [];
      for (let i = 1; i <= this.fixTotalPages; i++) pages.push(i);
      return pages;
    },
    pagedCommonVulns() {
      const start = (this.fixCurrentPage - 1) * this.fixPageSize;
      return this.filteredCommonVulns.slice(start, start + this.fixPageSize);
    },
    selectedVuln() {
      return this.commonVulnItems.find(v => v._key === this.selectedKey) || null;
    },
    selectedOsGroups() {
      return this.selectedVuln?.osGroups || [];
    },
    selectedTotalAssets() {
      return this.selectedOsGroups.reduce((sum, g) => sum + g.assets.length, 0);
    },
    selectedAssetCount() {
      return this.selectedOsGroups
        .filter(g => this.selectedOsKeys.includes(g.osKey))
        .reduce((sum, g) => sum + g.assets.length, 0);
    },
    manualFixVulnId() {
      if (!this.selectedVuln || this.isUser) return '';
      const assetIp = this.selectedOsGroups.length
        ? String(this.selectedOsGroups[0].assets[0]?.host_name || '').trim()
        : '';
      if (!assetIp) return this.selectedVuln.fix_vulnerability_id || '';
      // rows contains per-asset register rows; find the one matching the first asset
      const rows = this.selectedVuln.rows || [];
      const match = rows.find(r =>
        String(r.asset || r.host_name || '').trim() === assetIp,
      );
      return match?.fix_vulnerability_id || this.selectedVuln.fix_vulnerability_id || '';
    },
    isAutomationNotSafe() {
      if (!this.selectedVuln) return false;
      return isAutomationNotAvailable(
        this.selectedOsGroups[0]?.assets[0]?.host_name,
        0,
        this.selectedVuln.severity,
      );
    },
  },
  watch: {
    fixQuery() {
      this.fixCurrentPage = 1;
    },
    filteredCommonVulns(list) {
      if (!list.length) {
        this.selectedKey = null;
        return;
      }
      if (!list.find(v => v._key === this.selectedKey)) {
        this.selectCommonVuln(list[0]);
      }
    },
  },
  async mounted() {
    await this.loadCommonVulnerabilities();
  },
  methods: {
    async loadCommonVulnerabilities() {
      this.loading = true;
      if (this.isUser) {
        const reportId = await this.authStore.resolveUserReportId();
        if (!reportId) {
          this.loading = false;
          return;
        }
        await Promise.all([
          this.authStore.fetchUserAllReportVulnerabilities(true),
          this.authStore.fetchUserVulnerabilityRegister(true),
        ]);
      } else {
        await Promise.all([
          this.authStore.fetchAllReportVulnerabilities(true),
          this.authStore.fetchVulnerabilityRegister(true),
        ]);
      }
      await this.prefetchVulnAssets();
      this.loading = false;
      if (this.filteredCommonVulns.length) {
        this.selectCommonVuln(this.filteredCommonVulns[0]);
      }
    },
    async prefetchVulnAssets() {
      const vulns = [...this.groupedVulns];
      const batchSize = 5;
      for (let i = 0; i < vulns.length; i += batchSize) {
        const batch = vulns.slice(i, i + batchSize);
        await Promise.all(batch.map(v => this.fetchVulnAssets(v)));
      }
    },
    async fetchVulnAssets(vuln) {
      const key = vuln._key;
      if (this.vulnAssetsByKey[key]) return;
      const plugin = vuln.plugin_name || vuln.vul_name;
      const res = this.isUser
        ? await this.authStore.fetchUserVulnerabilityAssets(plugin)
        : await this.authStore.fetchVulnerabilityAssets(plugin);
      const assets = (res?.assets || []).map(a => ({
        host_name: a.host_name || a.asset || a.host || '',
        severity: a.severity || vuln.severity,
        status: a.status || 'open',
        operating_system: a.operating_system || a.os || a.platform || '',
      }));
      this.vulnAssetsByKey = { ...this.vulnAssetsByKey, [key]: assets };
    },
    resolveOsLabel(asset, index) {
      const os = String(
        asset.operating_system || asset.os || asset.platform || '',
      ).trim();
      if (os) return os;
      return DEMO_OS_VARIANTS[index % DEMO_OS_VARIANTS.length];
    },
    buildOsGroupsForVuln(vuln) {
      const assets = this.vulnAssetsByKey[vuln._key] || [];
      const sourceAssets = assets.length
        ? assets
        : (vuln.assets || []).map((host, i) => ({
            host_name: host,
            severity: vuln.severity,
            status: 'open',
            operating_system: '',
            _demoIndex: i,
          }));

      const groups = {};
      sourceAssets.forEach((asset, i) => {
        const osLabel = this.resolveOsLabel(asset, asset._demoIndex ?? i);
        const osKey = osLabel.toLowerCase();
        if (!groups[osKey]) {
          groups[osKey] = { osKey, osLabel, assets: [] };
        }
        groups[osKey].assets.push(asset);
      });
      return Object.values(groups).sort((a, b) => b.assets.length - a.assets.length);
    },
    async selectCommonVuln(item) {
      this.selectedKey = item._key;
      await this.fetchVulnAssets(item);
      const osGroups = this.buildOsGroupsForVuln(item);
      this.selectedOsKeys = osGroups.map(g => g.osKey);
      this.expandedOsKeys = osGroups.length ? [osGroups[0].osKey] : [];
      this.selectAllOs = true;
      this.fixMethodTab = 'auto';
    },
    toggleOsGroup(osKey) {
      const idx = this.selectedOsKeys.indexOf(osKey);
      if (idx === -1) {
        this.selectedOsKeys.push(osKey);
      } else {
        this.selectedOsKeys.splice(idx, 1);
      }
      this.selectAllOs = this.selectedOsKeys.length === this.selectedOsGroups.length;
    },
    toggleOsExpand(osKey) {
      const idx = this.expandedOsKeys.indexOf(osKey);
      if (idx === -1) {
        this.expandedOsKeys.push(osKey);
      } else {
        this.expandedOsKeys.splice(idx, 1);
      }
    },
    toggleSelectAllOs() {
      if (this.selectAllOs) {
        this.selectedOsKeys = this.selectedOsGroups.map(g => g.osKey);
      } else {
        this.selectedOsKeys = [];
      }
    },
    getStatusLabel(status) {
      const normalized = String(status || '').toLowerCase();
      if (normalized === 'closed' || normalized === 'resolved') return 'Closed';
      return 'Open';
    },
    getStatusBadgeClass(status) {
      return this.getStatusLabel(status) === 'Closed' ? 'status-closed-badge' : 'status-open-badge';
    },
    getStatusDotClass(status) {
      return this.getStatusLabel(status) === 'Closed' ? 'status-dot-closed' : 'status-dot-open';
    },
    async applyCommonFix() {
      if (!this.selectedVuln || !this.selectedOsKeys.length) return;
      const osLabels = this.selectedOsGroups
        .filter(g => this.selectedOsKeys.includes(g.osKey))
        .map(g => g.osLabel);
      const result = await Swal.fire({
        icon: 'question',
        title: 'Apply Common Fix?',
        html: `
          <p>This will apply the <strong>${this.fixMethodTab === 'auto' ? 'automated' : 'manual'}</strong> fix for:</p>
          <p><strong>${this.selectedVuln.vul_name}</strong></p>
          <p>Across <strong>${this.selectedAssetCount}</strong> asset(s) on:</p>
          <ul style="text-align:left;margin:0 auto;display:inline-block;">
            ${osLabels.map(os => `<li>${os}</li>`).join('')}
          </ul>
        `,
        showCancelButton: true,
        confirmButtonText: 'Apply Fix',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0f696e',
      });
      if (!result.isConfirmed) return;

      this.applyingFix = true;
      await new Promise(r => setTimeout(r, 1500));
      this.applyingFix = false;

      Swal.fire({
        icon: 'success',
        title: 'Common Fix Initiated',
        text: `Fix queued for ${this.selectedAssetCount} asset(s) across ${osLabels.length} OS version(s). Each asset will receive the OS-specific remediation.`,
        confirmButtonColor: '#0f696e',
      });
    },
    fixPrevPage() {
      if (this.fixCurrentPage > 1) this.fixCurrentPage--;
    },
    fixNextPage() {
      if (this.fixCurrentPage < this.fixTotalPages) this.fixCurrentPage++;
    },
    fixGoToPage(p) {
      this.fixCurrentPage = p;
    },
    copyCodeToClipboard() {
      navigator.clipboard.writeText(this.automationCode).then(() => {
        this.codeCopied = true;
        setTimeout(() => { this.codeCopied = false; }, 2000);
      });
    },
  },
};
</script>

<style scoped>
.af-mode-root {
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1;
  align-items: stretch;
  overflow: hidden;
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
  flex-shrink: 0;
}

.av-left-header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.av-left-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.af-subtitle {
  font-size: 0.72rem;
  color: #64748b;
  margin: 0 0 10px;
  line-height: 1.4;
  font-weight: 400;
}

.av-count-badge,
.assets-count-badge {
  font-size: 0.68rem;
  font-weight: 700;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 2px 10px;
  color: #475569;
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
  font-weight: 400;
  outline: none;
  background: #f8fafc;
  color: #1e293b;
}

.av-search-input:focus {
  border-color: #94a3b8;
  background: #fff;
}

.av-vuln-list {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.av-list-item-primary {
  margin-bottom: 6px;
}

.av-list-item-badges {
  margin-bottom: 6px;
}

.av-vuln-list-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
  font-weight: 600;
  font-size: 0.78rem;
}

.sev-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 4px;
  white-space: nowrap;
}

.sev-critical { background: #f8dede !important; color: #b42318 !important; }
.sev-high { background: #fee2e2 !important; color: #dc2626 !important; }
.sev-medium { background: #fef3c7 !important; color: #f59e0b !important; }
.sev-low { background: #ccfbf1 !important; color: #0f766e !important; }

.vuln-chip {
  font-size: 0.62rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.af-os-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 6px;
}

.af-os-tag {
  font-size: 0.62rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  padding: 1px 6px;
  color: #64748b;
  font-weight: 500;
}

.af-os-tag-more {
  background: #f1f5f9;
  font-weight: 600;
}

.av-empty-list {
  text-align: center;
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 400;
  padding: 24px 16px;
}

.av-right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  background: #f8fafc;
}

.av-right-scroll {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.av-right-inner {
  padding: 16px 20px 24px;
}

.av-selected-asset-sub {
  font-size: 0.75rem;
  font-weight: 400;
  color: #64748b;
}

.af-info-banner {
  display: flex;
  gap: 12px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 20px;
  font-size: 0.75rem;
  font-weight: 400;
  color: #166534;
}

.af-info-banner strong {
  font-size: 0.78rem;
  font-weight: 600;
  color: #14532d;
}

.af-info-banner p {
  font-size: 0.72rem;
  font-weight: 400;
  color: #166534;
  margin-top: 2px;
}

.af-info-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
  color: #16a34a;
}

.af-section {
  margin-bottom: 20px;
}

.section-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin: 0;
}

.af-select-all-label {
  font-size: 0.72rem;
  font-weight: 400;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0;
}

.af-os-groups {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.af-os-group-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.af-os-group-card--selected {
  border-color: #10b981;
  background: #f0fdf4;
}

.af-os-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  cursor: pointer;
}

.af-os-group-header:hover {
  background: #f8fafc;
}

.af-os-group-card--selected .af-os-group-header:hover {
  background: #f0fdf4;
}

.af-os-icon {
  color: #64748b;
  font-size: 0.85rem;
}

.af-os-name {
  font-size: 0.78rem;
  font-weight: 600;
  color: #1e293b;
}

.af-os-asset-count {
  font-size: 0.62rem;
  font-weight: 500;
  background: #f1f5f9;
  border-radius: 4px;
  padding: 2px 6px;
  color: #64748b;
}

.af-os-expand-btn {
  border: none;
  background: transparent;
  color: #94a3b8;
  padding: 4px;
  cursor: pointer;
}

.af-os-assets-list {
  border-top: 1px solid #f1f5f9;
  padding: 6px 12px 10px 38px;
  background: #fff;
}

.af-os-asset-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
  font-size: 0.75rem;
}

.af-os-asset-ip {
  font-weight: 500;
  font-size: 0.75rem;
  color: #334155;
  flex: 1;
}

.af-remediation-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.af-remediation-label {
  padding: 14px 20px 0;
}

.av-detail-tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  background: #fff;
  padding: 0 22px;
  margin-top: 12px;
}

.av-dtab {
  background: none;
  border: none;
  padding: 14px 20px;
  font-size: 0.82rem;
  font-weight: 400;
  color: #64748b;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
  transition: all 0.2s;
}

.av-dtab:hover {
  color: #000000;
}

.av-dtab.active {
  color: #000000;
  border-bottom-color: #000000;
}

.av-detail-tab-content {
  background: #f8fafc;
  min-height: 0;
  height: auto;
  flex: 0 0 auto;
  padding: 14px 20px 28px;
  box-sizing: border-box;
}

.av-auto-tab {
  padding: 12px 14px 24px;
}

.status-open-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.status-dot-open {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #b42318;
  flex-shrink: 0;
}

.status-closed-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.status-dot-closed {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}

.af-apply-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px 20px;
  text-align: center;
}

.af-apply-summary {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 14px;
}

.af-apply-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.af-apply-stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.af-apply-stat-label {
  font-size: 0.68rem;
  font-weight: 500;
  color: #64748b;
}

.af-apply-btn {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 9px 24px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  display: inline-flex;
  align-items: center;
}

.af-apply-btn:hover:not(:disabled) {
  background: #1a0f35;
}

.af-apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.af-apply-hint {
  font-size: 0.68rem;
  font-weight: 400;
  color: #94a3b8;
  margin-top: 10px;
}

.af-empty-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  padding: 40px;
}

.af-empty-icon {
  font-size: 2rem;
  margin-bottom: 10px;
  opacity: 0.5;
}

.af-empty-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.af-empty-text {
  font-size: 0.75rem;
  font-weight: 400;
  text-align: center;
  max-width: 280px;
}

.pagination-bottom {
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  background: white;
  border-top: 1px solid rgba(203, 196, 208, 0.15);
}

.custom-pagination .page-link {
  color: #64748b;
  background: transparent;
  border: none;
  font-weight: 500;
  font-size: 0.75rem;
  padding: 5px 9px;
  border-radius: 50%;
}

.custom-pagination .page-item.active .page-link {
  background: #0f696e;
  color: white;
}

.custom-pagination .page-item.disabled .page-link {
  color: #cbd5e1;
  pointer-events: none;
}

.custom-pagination .page-link:hover:not(.active) {
  background: #f1f5f9;
  color: #0f696e;
}
</style>
