<template>
  <main>
    <section>
      <div class="container-fluid px-0">
        <div class="row gx-0 no-gutters">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1 ps-0 menubar-col1">
            <DashboardMenu />
          </div>

          <div class="col-11 assets-content">
            <div class="assets-split-panel">

              <!-- Left Panel: Asset List -->
              <div class="assets-left-panel">
                <!-- Header -->
                <div class="left-panel-header">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h2 class="assets-title">All Assets</h2>
                    <span class="assets-count-badge">{{ totalAssets }} Assets</span>
                  </div>
                  <div class="d-flex gap-3 mb-3">
                    <i class="bi bi-trash action-icon" data-bs-toggle="tooltip"
                      :class="{ 'text-muted': activeAction !== '' && activeAction !== 'delete' }"
                      @click.stop="handleDeleteClick" title="Remove an asset" role="button"></i>
                    <i class="bi bi-eye-slash action-icon" data-bs-toggle="tooltip"
                      :class="{ 'text-muted': activeAction !== '' && activeAction !== 'hold' }"
                      @click.stop="toggleHoldMode" title="Hold mitigation" role="button"></i>
                  </div>
                  <div class="position-relative search-wrap">
                    <i class="bi bi-search search-icon-left"></i>
                    <input v-model="searchQuery" class="assets-search" placeholder="Search assets, IPs..." />
                    <i v-if="searchQuery" class="bi bi-x-circle-fill clear-icon" @click="searchQuery = ''"></i>
                  </div>
                </div>

                <!-- Asset List -->
                <div class="asset-list-scroll">
                  <div v-if="loading" class="text-center py-4">
                    <span class="spinner-border spinner-border-sm text-primary"></span>
                  </div>
                  <template v-else>
                    <div v-for="(asset, i) in pagedAssets" :key="asset.id || asset.asset || i"
                      class="asset-item-new"
                      :class="{ 'asset-item-active': activeIndex === asset.asset }"
                      @click="setActive(asset)">
                      <div class="d-flex justify-content-between align-items-start mb-1">
                        <div class="d-flex align-items-center gap-2">
                          <input v-if="showCheckboxes" type="checkbox" v-model="asset.selected" class="form-check-input" />
                          <input v-if="showHoldCheckboxes" type="checkbox" v-model="asset.selected" class="form-check-input" />
                          <span class="asset-ip">{{ asset.asset }}</span>
                        </div>
                        <span v-if="getTopSeverity(asset.severity_counts)" class="sev-badge"
                          :class="'sev-' + getTopSeverity(asset.severity_counts).toLowerCase()">
                          {{ getTopSeverity(asset.severity_counts) }}
                        </span>
                      </div>
                      <p class="asset-sub mb-2">
                        <i class="bi bi-link-45deg me-1"></i>
                        {{ asset.isInternal ? 'Internal' : 'External' }}
                      </p>
                      <div class="d-flex gap-2 flex-wrap">
                        <span class="vuln-chip">
                          {{ (asset.severity_counts?.critical || 0) + (asset.severity_counts?.high || 0) + (asset.severity_counts?.medium || 0) + (asset.severity_counts?.low || 0) }} Vulns
                        </span>
                        <span class="sev-count-dot critical-dot">{{ asset.severity_counts?.critical || 0 }}</span>
                        <span class="sev-count-dot high-dot">{{ asset.severity_counts?.high || 0 }}</span>
                        <span class="sev-count-dot medium-dot">{{ asset.severity_counts?.medium || 0 }}</span>
                        <span class="sev-count-dot low-dot">{{ asset.severity_counts?.low || 0 }}</span>
                      </div>
                    </div>

                    <!-- Pagination -->
                    <nav v-if="totalPages > 1" class="pagination-bottom">
                      <ul class="pagination pagination-sm mb-0 custom-pagination">
                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                          <a class="page-link" href="#" @click.prevent="prevPage">Prev</a>
                        </li>
                        <li v-for="p in pageNumbers" :key="p" class="page-item" :class="{ active: currentPage === p }">
                          <a class="page-link" href="#" @click.prevent="goToPage(p)">{{ p }}</a>
                        </li>
                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                          <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
                        </li>
                      </ul>
                    </nav>
                  </template>
                </div>

                <!-- Mitigation on Hold -->
                <div v-if="showHeld && heldAssets.length" class="mitigation-hold-section">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <h3 class="hold-title">Mitigation on hold</h3>
                    <i class="bi bi-eye text-muted" style="cursor:pointer;font-size:0.95rem;" @click="toggleUnholdMode" title="Unhold"></i>
                  </div>
                  <div v-for="(held, i) in heldAssets" :key="i" class="hold-item">
                    <div>
                      <div class="d-flex align-items-center gap-2">
                        <input v-if="showUnholdCheckboxes" type="checkbox" v-model="held.selected" class="form-check-input" />
                        <p class="hold-ip">{{ held.asset }}</p>
                      </div>
                      <p class="hold-sub">{{ held.member_type || 'Awaiting resolution' }}</p>
                    </div>
                    <span v-if="getTopSeverity(held.severity_counts)" class="sev-badge"
                      :class="'sev-' + getTopSeverity(held.severity_counts).toLowerCase()">
                      {{ getTopSeverity(held.severity_counts) }}
                    </span>
                  </div>
                </div>

                <!-- Delete Modal -->
                <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">Are you sure you want to delete the selected assets?</div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelDelete">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete" data-bs-dismiss="modal">OK</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Hold Modal -->
                <div class="modal fade" id="holdConfirmModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-body"><p>Do you want to hold to mitigation?</p></div>
                      <div class="modal-footer">
                        <button class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelHold">No</button>
                        <button class="btn btn-primary" data-bs-dismiss="modal" @click="confirmHold">Yes</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Panel: Vulnerability Details -->
              <div class="assets-right-panel">
                <!-- Detail Header -->
                <div class="right-panel-header">
                  <div class="d-flex align-items-center gap-3 mb-3 flex-wrap pt-5">
                    <h1 class="asset-detail-title">{{ selectedAsset?.asset }}</h1>
                    <span v-if="selectedAsset && getTopSeverity(selectedAsset.severity_counts)" class="sev-badge"
                      :class="'sev-' + getTopSeverity(selectedAsset.severity_counts).toLowerCase()">
                      {{ getTopSeverity(selectedAsset.severity_counts) }} Severity
                    </span>
                    <span class="status-open-badge">
                      <span class="status-dot-open"></span>
                      Open
                    </span>
                  </div>
                  <div class="d-flex gap-5 mb-4 flex-wrap">
                    <div v-if="selectedAsset">
                      <p class="meta-label">Exposure</p>
                      <p class="meta-value" style="text-transform:capitalize;">{{ selectedAsset.isInternal ? 'Internal' : 'External' }}</p>
                    </div>
                    <div v-if="selectedAsset?.host_information?.['Netbios Name']">
                      <p class="meta-label">Hostname</p>
                      <p class="meta-value">{{ selectedAsset.host_information['Netbios Name'] }}</p>
                    </div>
                    <div v-if="selectedAsset?.host_information?.['DNS Name']">
                      <p class="meta-label">DNS Name</p>
                      <p class="meta-value">{{ selectedAsset.host_information['DNS Name'] }}</p>
                    </div>
                    <div v-if="selectedAsset?.assigned_teams?.length">
                      <p class="meta-label">Teams</p>
                      <p class="meta-value">{{ selectedAsset.assigned_teams.join(', ') }}</p>
                    </div>
                  </div>
                  <!-- Tabs -->
                  <div class="detail-tabs">
                    <button class="detail-tab" :class="{ 'detail-tab-active': activeTab === 'vulnerabilities' }" @click="activeTab = 'vulnerabilities'">
                      Vulnerabilities ({{ filteredVulnerabilities.length }})
                    </button>
                    <button class="detail-tab" :class="{ 'detail-tab-active': activeTab === 'exceptions' }" @click="activeTab = 'exceptions'">
                      Support Requests
                      <span v-if="assetSupportRequests.length > 0" class="badge rounded-circle bg-danger ms-1"
                        style="font-size:11px;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;">
                        {{ assetSupportRequests.length }}
                      </span>
                    </button>
                    <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">Related Assets</button>
                    <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">History</button>
                  </div>
                </div>

                <!-- Tab Content -->
                <div class="right-panel-scroll">

                  <!-- Vulnerabilities Tab -->
                  <div v-if="activeTab === 'vulnerabilities'">
                    <div class="d-flex gap-2 mb-4">
                      <button class="sev-pill" :class="{ 'sev-pill-active': activeSeverity === 'All' }" @click="setSeverity('All')">All</button>
                      <button class="sev-pill sev-pill-critical" :class="{ 'sev-pill-active': activeSeverity === 'Critical' }" @click="setSeverity('Critical')">Critical</button>
                      <button class="sev-pill sev-pill-high" :class="{ 'sev-pill-active': activeSeverity === 'High' }" @click="setSeverity('High')">High</button>
                      <button class="sev-pill sev-pill-medium" :class="{ 'sev-pill-active': activeSeverity === 'Medium' }" @click="setSeverity('Medium')">Medium</button>
                      <button class="sev-pill sev-pill-low" :class="{ 'sev-pill-active': activeSeverity === 'Low' }" @click="setSeverity('Low')">Low</button>
                    </div>

                    <h3 class="section-label mb-3">Active Threats</h3>

                    <div class="d-flex flex-column gap-3">
                      <div v-for="(vuln, idx) in filteredVulnerabilities" :key="idx" class="vuln-accordion-item">
                        <div class="vuln-accordion-header" data-bs-toggle="collapse" :data-bs-target="'#uvn' + idx" role="button">
                          <div class="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                            <i class="bi bi-exclamation-triangle-fill vuln-icon flex-shrink-0"
                              :class="{
                                'vuln-icon-critical': vuln.severity === 'Critical',
                                'vuln-icon-high': vuln.severity === 'High',
                                'vuln-icon-medium': vuln.severity === 'Medium',
                                'vuln-icon-low': vuln.severity === 'Low'
                              }"></i>
                            <span class="vuln-name">{{ vuln.vul_name }}</span>
                          </div>
                          <div class="d-flex align-items-center gap-3 flex-shrink-0">
                            <span class="sev-badge" :class="'sev-' + (vuln.severity?.toLowerCase() || '')">{{ vuln.severity }}</span>
                            <span class="status-open-badge">
                              <span class="status-dot-open"></span>{{ vuln.status || 'Open' }}
                            </span>
                            <span class="text-muted" style="font-size:0.78rem;">CVSS: {{ vuln.cvss_score || '-' }}</span>
                            <i class="bi bi-chevron-down text-muted"></i>
                          </div>
                        </div>
                        <div :id="'uvn' + idx" class="accordion-collapse collapse" :class="{ show: idx === 0 }">
                          <div class="vuln-accordion-body">
                            <div class="vuln-meta-grid">
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">Vendor Fix</p>
                                <p class="vuln-meta-value teal">{{ vuln.vendor_fix_available || '-' }}</p>
                              </div>
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">CVSS Score</p>
                                <p class="vuln-meta-value">{{ vuln.cvss_score || '-' }}</p>
                              </div>
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">Assigned Team</p>
                                <p class="vuln-meta-value">{{ vuln.assigned_team || '-' }}</p>
                              </div>
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">Status</p>
                                <p class="vuln-meta-value">{{ vuln.status || '-' }}</p>
                              </div>
                            </div>
                            <div class="mb-4">
                              <h5 class="vuln-desc-title">Description</h5>
                              <p class="vuln-desc-text">{{ vuln.description }}</p>
                            </div>
                            <div class="d-flex gap-3">
                              <router-link
                                v-if="authStore.userLatestReportId && activeIndex"
                                :to="{
                                  name: 'UserVulFix',
                                  params: { reportId: authStore.userLatestReportId, asset: activeIndex },
                                  query: { plugin_name: vuln.vul_name, risk_factor: vuln.severity }
                                }"
                                class="btn-fix-now text-decoration-none">
                                Fix Now
                              </router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Fixed Recently -->
                    <div v-if="closedFixVulnerabilities.length" class="mt-5">
                      <div class="d-flex align-items-center mb-3">
                        <h3 class="section-label">Fixed Recently</h3>
                        <div class="fixed-divider flex-grow-1 ms-3"></div>
                      </div>
                      <div class="d-flex flex-column gap-2">
                        <div v-for="(item, i) in closedFixVulnerabilities" :key="item.fix_vulnerability_id" class="fixed-item">
                          <div class="d-flex align-items-center gap-3">
                            <i class="bi bi-check-circle-fill fixed-check-icon"></i>
                            <div>
                              <p class="fixed-vuln-name">{{ item.plugin_name }}</p>
                              <p class="fixed-vuln-date">Status: {{ item.status }}</p>
                            </div>
                          </div>
                          <button class="btn-view-detail" @click="viewFixDetail(item)">View detail</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Support Requests Tab -->
                  <div v-if="activeTab === 'exceptions'">
                    <div v-if="loadingSupportRequests" class="text-center py-4">
                      <span class="spinner-border spinner-border-sm text-primary"></span>
                    </div>
                    <div v-else-if="assetSupportRequests.length === 0" class="sr-empty">
                      <i class="bi bi-inbox me-2"></i>No support requests raised for this asset.
                    </div>
                    <div v-else>
                      <div v-for="(req, i) in assetSupportRequests" :key="req._id" class="support-req-item">
                        <div class="d-flex align-items-center gap-3">
                          <div class="sr-index-circle">{{ i + 1 }}</div>
                          <p class="sr-vul-name mb-0">{{ req.vul_name }}</p>
                        </div>
                        <button class="btn-view-requests" data-bs-toggle="modal" data-bs-target="#userSupportRequestModal"
                          @click="selectedSupportRequest = req">
                          <i class="bi bi-eye me-1"></i>View raised requests
                        </button>
                      </div>
                    </div>

                    <!-- Support Request Detail Modal -->
                    <div class="modal fade" id="userSupportRequestModal" tabindex="-1" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content sr-modal-content">
                          <div class="modal-header sr-modal-header">
                            <div>
                              <h5 class="modal-title sr-modal-title">
                                <i class="bi bi-headset me-2"></i>Issues Raised for Support
                              </h5>
                              <p class="sr-modal-sub mb-0">{{ selectedSupportRequest?.vul_name }}</p>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body p-4" v-if="selectedSupportRequest">
                            <p class="sr-section-label mb-2">Vulnerability</p>
                            <p class="fw-semibold mb-3" style="font-size:15px;">{{ selectedSupportRequest.vul_name }}</p>

                            <p class="sr-section-label mb-2">Steps Requested</p>
                            <div class="d-flex flex-wrap gap-2 mb-4">
                              <template v-if="selectedSupportRequest.step_requested === 'all'">
                                <span class="sr-step-pill">All Steps</span>
                              </template>
                              <template v-else>
                                <span v-for="step in selectedSupportRequest.step_requested?.split(',')" :key="step" class="sr-step-pill">
                                  Step {{ step.trim() }}
                                </span>
                              </template>
                            </div>

                            <p class="sr-section-label mb-2">Description</p>
                            <textarea class="sr-textarea" rows="4" :value="selectedSupportRequest.description || ''" readonly></textarea>

                            <div class="d-flex gap-4 mt-3">
                              <div>
                                <p class="mb-0 text-muted" style="font-size:12px;">Requested by</p>
                                <p class="mb-0 fw-semibold" style="font-size:14px;">{{ selectedSupportRequest.requested_by }}</p>
                              </div>
                              <div>
                                <p class="mb-0 text-muted" style="font-size:12px;">Date</p>
                                <p class="mb-0 fw-semibold" style="font-size:14px;">{{ formatRequestDate(selectedSupportRequest.requested_at) }}</p>
                              </div>
                            </div>
                          </div>
                          <div class="modal-footer sr-modal-footer">
                            <button type="button" class="sr-btn-close" data-bs-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardMenu from "@/components/user-component/DashboardMenu.vue";
import DashboardHeader from "@/components/user-component/DashboardHeader.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "UserAssetsView",
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      authStore: useAuthStore(),
      selectedSeverity: "",
      activeSeverity: "All",
      searchQuery: "",
      activeTab: "vulnerabilities",
      showCheckboxes: false,
      assets: [],
      totalAssets: 0,
      loading: false,
      activeIndex: null,
      heldAssets: [],
      showHoldCheckboxes: false,
      activeAction: "",
      showHeld: true,
      showUnholdCheckboxes: false,
      currentPage: 1,
      pageSize: 5,
      closedFixVulnerabilities: [],
      loadingClosedFix: false,
      supportRequests: [],
      loadingSupportRequests: false,
      selectedSupportRequest: null,
    };
  },
  computed: {
    filteredVulnerabilities() {
      const closedNames = new Set(this.closedFixVulnerabilities.map(v => v.plugin_name));
      const vulns = this.authStore.selectedAssetVulnerabilities.filter(v =>
        v.status === 'open' && !closedNames.has(v.vul_name)
      );
      if (this.activeSeverity === 'All') return vulns;
      return vulns.filter(v => v.severity === this.activeSeverity);
    },
    filteredAssets() {
      if (!this.searchQuery) return this.assets;
      const q = this.searchQuery.toLowerCase();
      return this.assets.filter(a => a.asset?.toLowerCase().includes(q));
    },
    pagedAssets() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredAssets.slice(start, start + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredAssets.length / this.pageSize);
    },
    pageNumbers() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      return pages;
    },
    selectedAsset() {
      if (!this.activeIndex) return null;
      return this.assets.find(a => a.asset === this.activeIndex) || null;
    },
    assetSupportRequests() {
      if (!this.activeIndex) return [];
      return this.supportRequests.filter(r => r.host_name === this.activeIndex);
    },
  },
  methods: {
    setSeverity(sev) {
      this.activeSeverity = sev;
    },
    async loadSupportRequests() {
      let reportId = this.authStore.userLatestReportId;
      if (!reportId) {
        await this.authStore.fetchUserVulnerabilityRegister();
        reportId = this.authStore.userLatestReportId;
      }
      if (!reportId) return;
      this.loadingSupportRequests = true;
      const res = await this.authStore.fetchUserSupportRequestsByReport(reportId);
      this.loadingSupportRequests = false;
      if (res.status && Array.isArray(res.data)) {
        this.supportRequests = res.data;
      }
    },
    formatRequestDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    },
    async loadAssets() {
      this.loading = true;
      const result = await this.authStore.fetchUserAssets();
      if (result.status) {
        this.assets = result.data;
        this.totalAssets = result.total;
        if (this.assets.length > 0) {
          await this.setActive(this.assets[0]);
        }
      }
      this.loading = false;
    },
    async loadHeldAssets() {
      const res = await this.authStore.fetchUserHeldAssets();
      if (res.status && res.assets.length) {
        this.heldAssets = res.assets.map(a => ({
          asset: a.asset,
          ip: a.asset,
          member_type: a.member_type,
          severity_counts: a.severity_counts,
          host_information: a.host_information,
          held: true,
          selected: false,
          isInternal: a.member_type === 'internal',
        }));
        this.showHeld = true;
        // Remove held assets from main list to avoid duplicates
        this.assets = this.assets.filter(a => !this.heldAssets.some(h => h.asset === a.asset));
      } else {
        this.showHeld = false;
        this.heldAssets = [];
      }
    },
    async setActive(asset) {
      if (!asset?.asset) return;
      this.activeIndex = asset.asset;
      this.authStore.fetchUserSingleAssetVulnerabilities(asset.asset);
      this.loadingClosedFix = true;
      const res = await this.authStore.getUserClosedVulnerabilities(asset.asset);
      this.loadingClosedFix = false;
      if (res.status && res.data?.results) {
        this.closedFixVulnerabilities = res.data.results.filter(v => v.status?.toLowerCase() === 'closed');
      } else {
        this.closedFixVulnerabilities = [];
      }
    },
    viewFixDetail(item) {
      const reportId = this.authStore.userLatestReportId;
      if (!reportId) return;
      this.$router.push({
        name: 'UserVulFix',
        params: { reportId, asset: item.host_name || this.activeIndex },
        query: {
          id: item.fix_vulnerability_id,
          plugin_name: item.plugin_name,
          risk_factor: item.risk_factor,
        }
      });
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    getTopSeverity(sc) {
      if (!sc) return null;
      if (sc.critical > 0) return 'Critical';
      if (sc.high > 0) return 'High';
      if (sc.medium > 0) return 'Medium';
      if (sc.low > 0) return 'Low';
      return null;
    },
    getSeverityColor(sev) {
      switch (sev?.toLowerCase()) {
        case 'critical': return 'rgba(173, 0, 0, 1)';
        case 'high': return '#AD0000';
        case 'medium': return '#f6b100';
        case 'low': return '#4caf50';
        default: return '#888';
      }
    },
    handleDeleteClick() {
      if (this.activeAction === "hold") return;
      this.activeAction = "delete";
      if (!this.showCheckboxes) {
        this.showCheckboxes = true;
      } else {
        const selectedAssets = this.assets.filter((a) => a.selected);
        if (selectedAssets.length > 0) {
          const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
          modal.show();
        } else {
          this.showCheckboxes = false;
          this.activeAction = "";
        }
      }
    },
    async confirmDelete() {
      const selected = this.assets.filter(a => a.selected);
      for (const item of selected) {
        const res = await this.authStore.deleteUserAsset(item.asset);
        if (res.status) {
          this.assets = this.assets.filter(x => x.asset !== item.asset);
          if (this.activeIndex === item.asset) {
            this.activeIndex = this.assets.length ? this.assets[0].asset : null;
            if (this.activeIndex) this.authStore.fetchUserSingleAssetVulnerabilities(this.activeIndex);
          }
        }
      }
      this.totalAssets = this.assets.length + this.heldAssets.length;
      this.showCheckboxes = false;
      this.resetActions();
    },
    cancelDelete() {
      this.assets.forEach((a) => (a.selected = false));
      this.showCheckboxes = false;
      this.resetActions();
    },
    toggleHoldMode() {
      if (this.activeAction === "delete") return;
      this.activeAction = "hold";
      if (this.showHoldCheckboxes) {
        const selectedAssets = this.assets.filter(a => a.selected);
        if (selectedAssets.length > 0) {
          let modal = new bootstrap.Modal(document.getElementById("holdConfirmModal"));
          modal.show();
        } else {
          this.resetActions();
        }
      } else {
        this.showHoldCheckboxes = true;
      }
    },
    async toggleUnholdMode() {
      if (this.activeAction === "hold" || this.activeAction === "delete") return;
      this.activeAction = "unhold";
      if (!this.showUnholdCheckboxes) {
        this.showUnholdCheckboxes = true;
        return;
      }
      const selected = this.heldAssets.filter(a => a.selected);
      if (!selected.length) {
        this.resetActions();
        return;
      }
      for (const item of selected) {
        const res = await this.authStore.unholdUserAsset(item.asset);
        if (res.status && res.restoredAsset) {
          const a = res.restoredAsset;
          this.assets.unshift({
            asset: a.asset,
            member_type: a.member_type,
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            isInternal: a.member_type === 'internal',
            held: false,
            selected: false,
          });
          this.heldAssets = this.heldAssets.filter(h => h.asset !== item.asset);
        }
      }
      this.totalAssets = this.assets.length + this.heldAssets.length;
      this.showHeld = this.heldAssets.length > 0;
      this.resetActions();
    },
    resetActions() {
      this.showCheckboxes = false;
      this.showHoldCheckboxes = false;
      this.activeAction = "";
      this.assets.forEach(a => (a.selected = false));
      this.heldAssets.forEach(a => (a.selected = false));
    },
    cancelHold() {
      this.assets.forEach((a) => (a.selected = false));
      this.showHoldCheckboxes = false;
      this.resetActions();
    },
    async confirmHold() {
      const selected = this.assets.filter(a => a.selected);
      if (!selected.length) {
        this.showHoldCheckboxes = false;
        this.resetActions();
        return;
      }
      for (const item of selected) {
        const res = await this.authStore.holdUserAsset(item.asset);
        if (res.status && res.heldAsset) {
          const a = res.heldAsset;
          this.heldAssets.push({
            asset: a.asset,
            ip: a.asset,
            member_type: a.member_type,
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            isInternal: a.member_type === 'internal',
            held: true,
            selected: false,
          });
          this.assets = this.assets.filter(x => x.asset !== item.asset);
          if (this.activeIndex === item.asset) {
            this.activeIndex = this.assets.length ? this.assets[0].asset : null;
            if (this.activeIndex) this.authStore.fetchUserSingleAssetVulnerabilities(this.activeIndex);
          }
        }
      }
      this.totalAssets = this.assets.length + this.heldAssets.length;
      this.showHeld = this.heldAssets.length > 0;
      this.showHoldCheckboxes = false;
      this.resetActions();
    },
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
  },
  async mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    await this.loadAssets();
    await this.loadHeldAssets();
    await this.loadSupportRequests();
  },
};
</script>

<style scoped>
.assets-content {
  padding: 0;
}

.assets-split-panel {
  display: flex;
  height: calc(100vh - 72px);
  background: #f8f9fc;
}

/* ── Left Panel ── */
.assets-left-panel {
  width: 33%;
  min-width: 280px;
  border-right: 1px solid rgba(203, 196, 208, 0.3);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  padding-top: 70px;
}

.left-panel-header {
  padding: 18px 16px 14px;
  border-bottom: 1px solid rgba(203, 196, 208, 0.2);
  flex-shrink: 0;
}

.assets-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}

.assets-count-badge {
  font-size: 0.72rem;
  font-weight: 500;
  color: #49454f;
  background: #edeef1;
  padding: 2px 8px;
  border-radius: 4px;
}

.action-icon {
  font-size: 1.05rem;
  cursor: pointer;
  color: #49454f;
  transition: color 0.15s;
}
.action-icon:hover { color: #241447; }

.search-wrap { position: relative; }

.search-icon-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #49454f;
  font-size: 0.82rem;
  pointer-events: none;
}

.assets-search {
  width: 100%;
  padding: 8px 32px 8px 30px;
  border: none;
  border-radius: 8px;
  background: #f8f9fc;
  font-size: 0.84rem;
  outline: none;
  color: #191c1e;
}
.assets-search:focus {
  box-shadow: 0 0 0 2px rgba(15, 105, 110, 0.2);
}

.clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #49454f;
  font-size: 0.85rem;
}

/* Asset list */
.asset-list-scroll {
  flex: 1;
  overflow-y: auto;
}
.asset-list-scroll::-webkit-scrollbar { width: 4px; }
.asset-list-scroll::-webkit-scrollbar-track { background: transparent; }
.asset-list-scroll::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.asset-item-new {
  padding: 12px 16px;
  border-bottom: 1px solid rgba(203, 196, 208, 0.15);
  cursor: pointer;
  transition: background 0.15s;
  border-left: 4px solid transparent;
}
.asset-item-new:hover { background: #f2f3f6; }
.asset-item-active {
  background: #ffffff;
  border-left: 4px solid #0f696e !important;
}

.asset-ip {
  font-size: 0.88rem;
  font-weight: 700;
  color: #241447;
}

.asset-sub {
  font-size: 0.73rem;
  color: #49454f;
}

/* Severity badges */
.sev-badge {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 7px;
  border-radius: 3px;
  white-space: nowrap;
}
.sev-critical { background: #ffdad6; color: #93000a; }
.sev-high     { background: #ffedd5; color: #9a3412; }
.sev-medium   { background: #fef9c3; color: #854d0e; }
.sev-low      { background: #a1ecf2; color: #002022; }

.vuln-chip {
  font-size: 0.65rem;
  color: #176d72;
  background: #a1ecf2;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.sev-count-dot {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
}
.critical-dot { color: maroon;  background: #fdeaea; }
.high-dot     { color: red;     background: rgb(246,214,214); }
.medium-dot   { color: orange;  background: rgb(249,225,193); }
.low-dot      { color: green;   background: rgb(202,233,204); }

/* Mitigation on hold */
.mitigation-hold-section {
  flex-shrink: 0;
  background: #f2f3f6;
  padding: 14px 16px;
  border-top: 1px solid rgba(203, 196, 208, 0.2);
  max-height: 220px;
  overflow-y: auto;
}
.mitigation-hold-section::-webkit-scrollbar { width: 3px; }
.mitigation-hold-section::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.hold-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #49454f;
  margin: 0;
}

.hold-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 9px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border-left: 3px solid #7a7580;
}

.hold-ip {
  font-size: 0.8rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}
.hold-sub {
  font-size: 0.7rem;
  color: #49454f;
  margin: 0;
  text-transform: capitalize;
}

/* Pagination */
.pagination-bottom {
  padding: 10px 16px;
  display: flex;
  justify-content: center;
  background: white;
  border-top: 1px solid rgba(203, 196, 208, 0.15);
}
.custom-pagination .page-link {
  color: #0f696e;
  background: transparent;
  border: none;
  font-weight: 500;
  padding: 5px 9px;
  border-radius: 50%;
}
.custom-pagination .page-item.active .page-link {
  background: #0f696e;
  color: white;
}

/* ── Right Panel ── */
.assets-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  overflow: hidden;
  min-width: 0;
}

.right-panel-header {
  padding: 24px 28px 0;
  background: #f8f9fc;
  flex-shrink: 0;
}

.asset-detail-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: #241447;
  letter-spacing: -0.02em;
  margin: 0;
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
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}
.status-dot-open {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}

.meta-label {
  font-size: 0.73rem;
  color: #49454f;
  font-weight: 500;
  margin-bottom: 2px;
}
.meta-value {
  font-size: 0.92rem;
  color: #191c1e;
  font-weight: 500;
  margin: 0;
}

/* Detail tabs */
.detail-tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid rgba(203, 196, 208, 0.2);
}
.detail-tab {
  padding-bottom: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #49454f;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s;
}
.detail-tab:hover { color: #241447; }
.detail-tab-active {
  font-weight: 700;
  color: #0f696e;
  border-bottom: 2px solid #0f696e;
}

/* Right panel scrollable body */
.right-panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 18px 28px;
}
.right-panel-scroll::-webkit-scrollbar { width: 4px; }
.right-panel-scroll::-webkit-scrollbar-track { background: transparent; }
.right-panel-scroll::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #49454f;
  margin: 0;
}

/* Severity pills filter */
.sev-pill {
  border-radius: 50px;
  padding: 5px 14px;
  font-size: 0.8rem;
  font-weight: 500;
  background: white;
  border: 1px solid rgba(0,0,0,0.12);
  cursor: pointer;
  transition: all 0.15s;
}
.sev-pill:hover { background: #f2f3f6; }
.sev-pill-active {
  background: #e0f2f1 !important;
  color: #0f696e !important;
  border-color: #0f696e !important;
  font-weight: 700;
}
.sev-pill-critical { color: #93000a; }
.sev-pill-high     { color: #9a3412; }
.sev-pill-medium   { color: #854d0e; }
.sev-pill-low      { color: #0f696e; }

/* Vuln accordion */
.vuln-accordion-item {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(203, 196, 208, 0.25);
}

.vuln-accordion-header {
  padding: 14px 16px;
  background: #f2f3f6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 12px;
}
.vuln-accordion-header:hover { background: #edeef1; }

.vuln-icon { font-size: 1rem; }
.vuln-icon-critical { color: #ba1a1a; }
.vuln-icon-high     { color: #ea580c; }
.vuln-icon-medium   { color: #ca8a04; }
.vuln-icon-low      { color: #0f696e; }

.vuln-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #241447;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vuln-accordion-body {
  padding: 18px 20px;
}

.vuln-meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 18px;
}
.vuln-meta-cell {
  background: #f2f3f6;
  padding: 10px;
  border-radius: 8px;
}
.vuln-meta-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #49454f;
  margin-bottom: 3px;
}
.vuln-meta-value {
  font-size: 0.84rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}
.vuln-meta-value.teal { color: #0f696e; }

.vuln-desc-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #241447;
  margin-bottom: 5px;
}
.vuln-desc-text {
  font-size: 0.875rem;
  color: #49454f;
  line-height: 1.6;
}

.btn-fix-now {
  background: #241447;
  color: white !important;
  padding: 7px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: opacity 0.15s;
  display: inline-block;
}
.btn-fix-now:hover { opacity: 0.88; }

/* Fixed Recently */
.fixed-divider { height: 1px; background: rgba(203, 196, 208, 0.25); }

.fixed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f2f3f6;
  border-radius: 8px;
  padding: 12px 16px;
}
.fixed-check-icon { color: #16a34a; font-size: 1.1rem; }
.fixed-vuln-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}
.fixed-vuln-date {
  font-size: 0.7rem;
  color: #49454f;
  margin: 0;
}
.btn-view-detail {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0f696e;
  padding: 4px 14px;
  border-radius: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-view-detail:hover { background: #a1ecf2; }

/* Support Requests */
.support-req-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(203, 196, 208, 0.2);
}

.sr-index-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f0ecff;
  color: #241447;
  font-size: 0.78rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sr-vul-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #241447;
}

.sr-empty {
  color: #94a3b8;
  font-size: 0.875rem;
  padding: 16px 0;
  display: flex;
  align-items: center;
}

/* Modal */
.sr-modal-content {
  border-radius: 14px;
  overflow: hidden;
  border: none;
}

.sr-modal-header {
  background: #241447;
  border-bottom: none;
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sr-modal-title {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin: 0 0 3px;
  display: flex;
  align-items: center;
}

.sr-modal-sub {
  color: rgba(255,255,255,0.55);
  font-size: 0.78rem;
  padding-left: 26px;
}

.sr-section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #64748b;
}

.sr-step-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(15,105,110,0.1);
  color: #0f696e;
  border: 1.5px solid rgba(15,105,110,0.25);
  border-radius: 50px;
  padding: 4px 14px;
  font-size: 0.78rem;
  font-weight: 600;
}

.sr-textarea {
  width: 100%;
  background: #f8f9fc;
  border: 1.5px solid #e8ecf0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.875rem;
  color: #475569;
  resize: none;
  outline: none;
}

.sr-modal-footer {
  padding: 14px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
}

.sr-btn-close {
  background: #241447;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.sr-btn-close:hover { background: #1a0f35; }

.btn-view-requests {
  font-size: 0.8rem;
  font-weight: 500;
  color: #0f696e;
  padding: 6px 14px;
  border-radius: 8px;
  background: #e0f2f1;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-view-requests:hover { background: #a1ecf2; }
</style>