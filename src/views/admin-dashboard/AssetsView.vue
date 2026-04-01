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
                    <span class="assets-count-badge">{{ authStore.assetCount }} Assets</span>
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
                    <input v-model="query" class="assets-search" placeholder="Search assets, IPs..." @input="onSearchInput" />
                    <i v-if="query" class="bi bi-x-circle-fill clear-icon" @click="clearSearch"></i>
                  </div>
                </div>

                <!-- Asset List -->
                <div class="asset-list-scroll">
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
                      <span v-if="getPrioritySeverity(asset)" class="sev-badge" :class="'sev-' + getPrioritySeverity(asset).toLowerCase()">
                        {{ getPrioritySeverity(asset) }}
                      </span>
                    </div>
                    <p class="asset-sub mb-2">
                      <i class="bi bi-link-45deg me-1"></i>
                      {{ authStore.memberType ? (authStore.memberType.charAt(0).toUpperCase() + authStore.memberType.slice(1)) : '' }}
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
                </div>

                <!-- Mitigation on Hold -->
                <div v-if="heldAssets.length" class="mitigation-hold-section">
                  <div class="d-flex align-items-center justify-content-between mb-3">
                    <h3 class="hold-title">Mitigation on hold</h3>
                    <i class="bi bi-eye text-muted" style="cursor:pointer;font-size:0.95rem;" @click="toggleUnholdMode" title="Unhold"></i>
                  </div>
                  <div v-for="(held, i) in pagedHeldAssets" :key="i" class="hold-item">
                    <div>
                      <div class="d-flex align-items-center gap-2">
                        <input v-if="showUnholdCheckboxes" type="checkbox" v-model="held.selected" class="form-check-input" />
                        <p class="hold-ip">{{ held.ip }}</p>
                      </div>
                      <p class="hold-sub">{{ held.member_type || 'Awaiting resolution' }}</p>
                    </div>
                    <span v-if="getHeldPrioritySeverity(held)" class="sev-badge" :class="'sev-' + getHeldPrioritySeverity(held).toLowerCase()">
                      {{ getHeldPrioritySeverity(held) }}
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
                    <h1 class="asset-detail-title">{{ authStore.selectedAssetDetail?.asset }}</h1>
                    <span v-if="authStore.selectedAssetDetail?.severity" class="sev-badge" :class="'sev-' + (authStore.selectedAssetDetail.severity?.toLowerCase() || '')">
                      {{ authStore.selectedAssetDetail.severity }} Severity
                    </span>
                    <span class="status-open-badge">
                      <span class="status-dot-open"></span>
                      Open
                    </span>
                  </div>
                  <div class="d-flex gap-5 mb-4">
                    <div v-if="authStore.selectedAssetDetail?.exposure">
                      <p class="meta-label">Exposure</p>
                      <p class="meta-value" style="text-transform:capitalize;">{{ authStore.selectedAssetDetail.exposure }}</p>
                    </div>
                    <div v-if="authStore.selectedAssetDetail?.owner">
                      <p class="meta-label">Owner</p>
                      <p class="meta-value">{{ authStore.selectedAssetDetail.owner }}</p>
                    </div>
                  </div>
                  <!-- Tabs -->
                  <div class="detail-tabs">
                    <button class="detail-tab" :class="{ 'detail-tab-active': activeTab === 'vulnerabilities' }" @click="activeTab = 'vulnerabilities'">
                      Vulnerabilities ({{ filteredVulnerabilities.length }})
                    </button>
                    <button class="detail-tab" :class="{ 'detail-tab-active': activeTab === 'exceptions' }" @click="activeTab = 'exceptions'">
                      Support Requests
                      <span v-if="supportRequestCount > 0" class="badge rounded-circle bg-danger ms-1"
                        style="font-size:11px;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;">
                        {{ supportRequestCount }}
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
                      <div v-for="(v, i) in filteredVulnerabilities" :key="i" class="vuln-accordion-item">
                        <div class="vuln-accordion-header" data-bs-toggle="collapse" :data-bs-target="'#vn' + i" role="button">
                          <div class="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                            <i class="bi bi-exclamation-triangle-fill vuln-icon flex-shrink-0"
                              :class="{
                                'vuln-icon-critical': v.severity === 'Critical',
                                'vuln-icon-high': v.severity === 'High',
                                'vuln-icon-medium': v.severity === 'Medium',
                                'vuln-icon-low': v.severity === 'Low'
                              }"></i>
                            <span class="vuln-name">{{ v.vul_name }}</span>
                          </div>
                          <div class="d-flex align-items-center gap-3 flex-shrink-0">
                            <span class="sev-badge" :class="'sev-' + (v.severity?.toLowerCase() || '')">{{ v.severity }}</span>
                            <span class="status-open-badge">
                              <span class="status-dot-open"></span>Open
                            </span>
                            <span class="text-muted" style="font-size:0.78rem;">CVSS: {{ v.cvss_score || '-' }}</span>
                            <i class="bi bi-chevron-down text-muted"></i>
                          </div>
                        </div>
                        <div :id="'vn' + i" class="accordion-collapse collapse" :class="{ show: i === 0 }">
                          <div class="vuln-accordion-body">
                            <div class="vuln-meta-grid">
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">Vendor Fix</p>
                                <p class="vuln-meta-value teal">{{ v.vendor_fix_available || '-' }}</p>
                              </div>
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">CVSS Score</p>
                                <p class="vuln-meta-value">{{ v.cvss_score || '-' }}</p>
                              </div>
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">Discovered</p>
                                <p class="vuln-meta-value">-</p>
                              </div>
                              <div class="vuln-meta-cell">
                                <p class="vuln-meta-label">CVE ID</p>
                                <p class="vuln-meta-value">-</p>
                              </div>
                            </div>
                            <div class="mb-4">
                              <h5 class="vuln-desc-title">Description</h5>
                              <p class="vuln-desc-text">{{ v.description }}</p>
                            </div>
                            <div class="d-flex gap-3">
                              <router-link
                                v-if="authStore.latestReportId"
                                :to="{
                                  name: 'VulFix',
                                  params: { reportId: authStore.latestReportId, asset: authStore.selectedAssetDetail?.asset },
                                  query: { id: getVulRegisterId(v), plugin_name: v.vul_name, risk_factor: v.severity }
                                }"
                                class="btn-fix-now text-decoration-none">
                                Fix Now
                              </router-link>
                              <button class="btn-ignore-once">Ignore Once</button>
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
                              <p class="fixed-vuln-name">{{ item.vulnerability_name }}</p>
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
                    <div v-if="supportRequestsByHost.length">
                      <div v-for="(req, i) in supportRequestsByHost" :key="req._id" class="support-req-item">
                        <div class="d-flex align-items-center gap-3">
                          <div class="sr-index-circle">{{ i + 1 }}</div>
                          <p class="sr-vul-name mb-0">{{ req.vul_name }}</p>
                        </div>
                        <button class="btn-view-requests" data-bs-toggle="modal" data-bs-target="#viewRequestsModal"
                          @click="openSupportRequestModal(req)">
                          <i class="bi bi-eye me-1"></i>View raised requests
                        </button>
                      </div>
                    </div>
                    <div v-else class="sr-empty">
                      <i class="bi bi-inbox me-2"></i>No support requests raised for this asset.
                    </div>

                    <!-- View Requests Modal -->
                    <div class="modal fade" id="viewRequestsModal" tabindex="-1" aria-labelledby="viewRequestsModalLabel" aria-hidden="true">
                      <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content sr-modal-content">
                          <div class="modal-header sr-modal-header">
                            <div>
                              <h5 class="modal-title sr-modal-title" id="viewRequestsModalLabel">
                                <i class="bi bi-headset me-2"></i>Issues Raised for Support
                              </h5>
                              <p class="sr-modal-sub mb-0">{{ selectedSupportRequest?.vul_name }}</p>
                            </div>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
                          <div class="modal-body p-4">
                            <p class="sr-section-label mb-3">Steps requested for support</p>
                            <div v-if="selectedSupportRequest && selectedSupportRequest.step_requested" class="d-flex flex-wrap gap-2 mb-4">
                              <span v-for="(step, i) in selectedSupportRequest.step_requested.split(',')" :key="i" class="sr-step-pill">
                                {{ step.trim() }}: review
                              </span>
                            </div>
                            <div v-else class="text-muted small mb-4">No steps specified.</div>
                            <p class="sr-section-label mb-2">Description</p>
                            <textarea class="sr-textarea" rows="4"
                              :value="selectedSupportRequest?.description || ''" readonly></textarea>
                          </div>
                          <div class="modal-footer sr-modal-footer">
                            <button type="button" class="sr-btn-close" data-bs-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Related Tab -->
                  <div v-if="activeTab === 'related'">
                    <p class="text-muted py-3">Related assets view coming soon.</p>
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
import DashboardMenu from "@/components/admin-component/DashboardMenu.vue";
import DashboardHeader from "@/components/admin-component/DashboardHeader.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "AssetsView",
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      authStore: useAuthStore(),
      supportRequestsByHost: [],
      supportRequestCount: 0,
      loadingSupportRequests: false,
      selectedSupportRequest: null,
      activeIndex: null,
      selectedSeverity: "all",
      ipAddress: "",
      activeTab: "vulnerabilities",
      showCheckboxes: false,
      heldAssets: [],
      showHoldCheckboxes: false,
      activeAction: "",
      showHeld: false,
      showUnholdCheckboxes: false,
      currentPage: 1,
      pageSize: 5,
      query: "",
      isSearching: false,
      selectedAsset: "",
      activeSeverity: 'All',
      closedFixVulnerabilities: [],
      closedFixCount: 0,
      loadingClosedFix: false
    };
  },
  computed: {
    pagedAssets() {
      const start = (this.currentPage - 1) * this.pageSize;

      // STEP 1: filter by search query
      let list = this.authStore.assetRows;

      if (this.query && this.query.trim()) {
        const q = this.query.trim().toLowerCase();
        list = list.filter(a =>
          a.asset.toLowerCase().includes(q)
        );
      }

      // STEP 1.5: filter by severity
      if (this.selectedSeverity && this.selectedSeverity !== "all") {
        list = list.filter(a => {
          const priority = this.getPrioritySeverity(a);
          return priority?.toLowerCase() === this.selectedSeverity;
        });
      }

      // STEP 2: sort by severity
      const sorted = [...list].sort((a, b) => {
        return (
          this.getSeverityRank(this.getPrioritySeverity(a)) -
          this.getSeverityRank(this.getPrioritySeverity(b))
        );
      });

      // STEP 3: paginate
      return sorted.slice(start, start + this.pageSize);
    },
    totalPages() {
      let list = this.authStore.assetRows;

      if (this.query && this.query.trim()) {
        const q = this.query.trim().toLowerCase();
        list = list.filter(a =>
          a.asset.toLowerCase().includes(q)
        );
      }

      if (this.selectedSeverity && this.selectedSeverity !== "all") {
        list = list.filter(a => {
          const priority = this.getPrioritySeverity(a);
          return priority?.toLowerCase() === this.selectedSeverity;
        });
      }
      return Math.ceil(list.length / this.pageSize);
    },
    pageNumbers() {
      const pages = [];
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
      return pages;
    },
    filteredVulnerabilities() {
      const list =
        this.activeSeverity === "All"
          ? this.authStore.selectedAssetVulnerabilities
          : this.authStore.selectedAssetVulnerabilities.filter(
            v => v.severity === this.activeSeverity
          );

      return [...list].sort((a, b) => {
        return (
          this.getSeverityRank(a.severity) -
          this.getSeverityRank(b.severity)
        );
      });
    },
    pagedHeldAssets() {
      return [...this.heldAssets].sort((a, b) => {
        const aSev = this.getHeldPrioritySeverity(a);
        const bSev = this.getHeldPrioritySeverity(b);
        return this.getSeverityRank(aSev) - this.getSeverityRank(bSev);
      });
    },
  },
  watch: {
    pagedAssets: {
      handler(list) {
        if (list.length && !this.activeIndex) {
          this.setActive(list[0]);
        }
      },
      immediate: true
    },
    heldAssets: {
      handler(val) {
        this.showHeld = val.length > 0;
        console.log("📦 Current HELD assets list:", val);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getVulRegisterId(v) {
      const asset = this.authStore.selectedAssetDetail?.asset;

      const match = this.authStore.vulnerabilityRows.find(
        row =>
          (row.vul_name === v.vul_name || row.vulnerability_name === v.vul_name) &&
          row.asset === asset
      );

      return match?.id || v.id || "";
    },
    getSeverityRank(sev) {
      if (sev === "Critical") return 1;
      if (sev === "High") return 2;
      if (sev === "Medium") return 3;
      if (sev === "Low") return 4;
      return 99;
    },
    getSeverityColor(sev) {
      if (sev === "Critical") return "maroon";
      if (sev === "High") return "red";
      if (sev === "Medium") return "orange";
      return "green";
    },
    getSeverityBg(sev) {
      if (sev === "Critical") return "#fdeaea";
      if (sev === "High") return "rgb(246 214 214)";
      if (sev === "Medium") return "rgb(249 225 193)";
      return "rgb(202 233 204)";
    },
    getHeldPrioritySeverity(held) {
      if (!held?.severity_counts) return "";
      if (held.severity_counts.critical > 0) return "Critical";
      if (held.severity_counts.high > 0) return "High";
      if (held.severity_counts.medium > 0) return "Medium";
      if (held.severity_counts.low > 0) return "Low";
      return "";
    },
    validateIPInput(event) {
      const char = String.fromCharCode(event.which);
      if (!/[0-9.]/.test(char)) {
        event.preventDefault();
        alert("Only numbers and dots are allowed!");
      }
    },
    formatIP() {
      let digits = this.ipAddress.replace(/\D/g, "");
      let formatted = digits.match(/.{1,3}/g)?.join(".") || "";
      let parts = formatted.split(".").slice(0, 4);
      this.ipAddress = parts.join(".");
    },
    handleDeleteClick() {
      if (this.activeAction === "hold") {
        return;
      }
      this.activeAction = "delete";
      const rows = this.authStore.assetRows || [];
      if (!this.showCheckboxes) {
        this.showCheckboxes = true;
        return;
      }
      const selectedAssets = rows.filter(a => a.selected);
      if (selectedAssets.length > 0) {
        const modalEl = document.getElementById("deleteModal");
        if (modalEl) {
          const modal = new bootstrap.Modal(modalEl);
          modal.show();
        } else {
          console.warn("Delete modal element not found (#deleteModal).");
        }
      } else {
        this.showCheckboxes = false;
        this.activeAction = "";
      }
    },
    cancelDelete() {
      this.showCheckboxes = false;
      this.activeAction = "";
      (this.authStore.assetRows || []).forEach(a => { a.selected = false; });
    },
    async confirmDelete() {
      const selected = this.authStore.assetRows.filter(a => a.selected);
      for (const asset of selected) {
        await this.authStore.deleteAsset(asset.asset);
      }
      this.showCheckboxes = false;
      this.activeAction = "";
    },
    async setActive(asset) {
      if (!asset?.asset) return;
      this.activeIndex = asset.asset;
      await this.authStore.fetchSingleAssetVulnerabilities(asset.asset);

      this.loadingSupportRequests = true;
      const res = await this.authStore.getSupportRequestsByHost(asset.asset);
      this.loadingSupportRequests = false;

      if (res.status) {
        this.supportRequestsByHost = res.data;
        this.supportRequestCount = res.count;
      } else {
        this.supportRequestsByHost = [];
        this.supportRequestCount = 0;
      }

      this.loadingClosedFix = true;
      const reportId = this.authStore.latestReportId;
      if (reportId) {
        const fixRes = await this.authStore.getClosedVulnerabilities(reportId, asset.asset);
        this.loadingClosedFix = false;
        if (fixRes.status && fixRes.data?.results) {
          const closedOnly = fixRes.data.results.filter(
            v => v.status?.toLowerCase() === "closed"
          );
          this.closedFixVulnerabilities = closedOnly;
          this.closedFixCount = closedOnly.length;
        } else {
          this.closedFixVulnerabilities = [];
          this.closedFixCount = 0;
        }
      } else {
        this.loadingClosedFix = false;
        this.closedFixVulnerabilities = [];
        this.closedFixCount = 0;
      }
    },
    toggleHoldMode() {
      if (this.activeAction === "delete") return;

      const source = this.authStore.assetRows;

      source.forEach(a => {
        if (typeof a.selected === "undefined") a.selected = false;
        if (typeof a.held === "undefined") a.held = false;
        if (typeof a.isInternal === "undefined") a.isInternal = true;
      });

      this.activeAction = "hold";

      if (this.showHoldCheckboxes) {
        const selectedAssets = source.filter(a => a.selected);
        console.log("[Hold] second click - selected count:", selectedAssets.length);

        if (selectedAssets.length > 0) {
          const modalEl = document.getElementById("holdConfirmModal");
          if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
            console.log("[Hold] showing holdConfirmModal");
          } else {
            console.warn("[Hold] holdConfirmModal element not found");
          }
        } else {
          this.showHoldCheckboxes = false;
          this.resetActions();
          console.log("[Hold] no items selected -> closing hold mode");
        }
        return;
      }

      this.showHoldCheckboxes = true;
      console.log("[Hold] first click -> showing hold checkboxes");
    },
    async confirmHold() {
      const source = this.authStore.assetRows;
      const selected = source.filter(a => a.selected);

      if (!selected.length) {
        this.showHoldCheckboxes = false;
        this.resetActions();
        return;
      }

      for (const item of selected) {
        const res = await this.authStore.holdAsset(item.asset);

        if (res.status && res.heldAsset) {
          const a = res.heldAsset;

          this.heldAssets.push({
            asset: a.asset,
            ip: a.asset,
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            isInternal: true,
            held: true,
            selected: false,
          });

          console.log("🟡 Asset put on HOLD:", {
            asset: a.asset,
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            total_vulnerabilities: a.total_vulnerabilities,
          });

          const idx = this.authStore.assetRows.findIndex(
            x => x.asset === item.asset
          );
          if (idx !== -1) {
            this.authStore.assetRows.splice(idx, 1);
          }
        }
      }
      this.showHoldCheckboxes = false;
      this.resetActions();
    },
    cancelHold() {
      this.showHoldCheckboxes = false;
      (this.authStore.assetRows || []).forEach(a => (a.selected = false));
      this.resetActions();
      console.log("[Hold.cancel] hold cancelled, selections cleared");
    },
    resetActions() {
      this.showCheckboxes = false;
      this.showHoldCheckboxes = false;
      this.showUnholdCheckboxes = false;
      this.activeAction = "";

      (this.authStore.assetRows || []).forEach(a => (a.selected = false));
      (this.heldAssets || []).forEach(a => (a.selected = false));
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
        const res = await this.authStore.unholdAsset(item.ip);

        if (res.status && res.restoredAsset) {
          const a = res.restoredAsset;

          this.authStore.assetRows.unshift({
            asset: a.asset,
            name: a.host_information?.["DNS Name"] || "",
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            isInternal: true,
            held: false,
            selected: false,
          });

          this.heldAssets = this.heldAssets.filter(
            h => h.ip !== item.ip
          );
        }
      }

      this.resetActions();
    },
    async loadHeldAssets() {
      const res = await this.authStore.fetchHeldAssets();
      if (res.status && res.assets.length) {
        this.heldAssets = res.assets.map(a => ({
          asset: a.asset,
          ip: a.asset,
          member_type: a.member_type,
          name: a.host_information?.["DNS Name"] || "",
          severity_counts: a.severity_counts,
          host_information: a.host_information,
          held: true,
          selected: false,
        }));

        this.showHeld = true;
        this.authStore.assetRows = this.authStore.assetRows.filter(
          a => !this.heldAssets.some(h => h.asset === a.asset)
        );
      } else {
        this.showHeld = false;
        this.heldAssets = [];
      }
    },
    getPrioritySeverity(asset) {
      const s = asset.severity_counts || {};
      if ((s.critical ?? 0) > 0) return "Critical";
      if ((s.high ?? 0) > 0) return "High";
      if ((s.medium ?? 0) > 0) return "Medium";
      if ((s.low ?? 0) > 0) return "Low";
      return "";
    },
    onSearchInput() {
      if (!this.query) {
        this.clearSearch();
        return;
      }
      this.authStore.searchAssets(this.query.trim());
    },
    clearSearch() {
      this.query = "";
      this.authStore.assetSearchResults = [];
      this.authStore.assetSearchCount = 0;
      this.currentPage = 1;
      this.activeIndex = null;

      this.$nextTick(() => {
        if (this.pagedAssets.length) {
          this.setActive(this.pagedAssets[0]);
        }
      });
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    resetPaginationIfNeeded() {
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages || 1;
      }
    },
    setSeverity(sev) {
      this.activeSeverity = sev;
    },
    openSupportRequestModal(req) {
      this.selectedSupportRequest = req;
    },
    viewFixDetail(item) {
      const reportId = this.authStore.latestReportId;
      if (!reportId) {
        console.error("No report ID available");
        return;
      }

      this.$router.push({
        name: 'VulFix',
        params: {
          reportId: reportId,
          asset: item.asset,
        },
        query: {
          id: item.id,
          plugin_name: item.vulnerability_name,
          risk_factor: item.severity,
          status: item.status
        }
      });
    },
  },
  async mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
      const btn = dropdown.querySelector('.dropdown-btn');
      const options = dropdown.querySelectorAll('.dropdown-content a');

      if (btn) {
        btn.addEventListener('click', () => {
          dropdown.classList.toggle('show');
        });
      }

      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          if (btn) btn.textContent = option.textContent;
          dropdown.classList.remove('show');
        });
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });
    }

    console.log("🔥 AssetsView mounted");

    if (!localStorage.getItem("reportId")) {
      await this.authStore.getReportStatus();
    }

    this.authStore.fetchAssets();

    if (!this.authStore.latestReportId || !this.authStore.vulnerabilityRows.length) {
      this.authStore.fetchVulnerabilityRegister();
    }

    if (typeof this.authStore.fetchHeldAssets === 'function') {
      this.loadHeldAssets();
    }
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

.btn-ignore-once {
  color: #0f696e;
  padding: 7px 22px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.875rem;
  border: 1px solid rgba(203, 196, 208, 0.5);
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-ignore-once:hover { background: #f2f3f6; }

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
