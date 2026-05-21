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
            <div class="assets-page-shell">
              <div class="assets-list-mode-tabs">
                <button
                  type="button"
                  class="assets-mode-tab"
                  :class="{ 'assets-mode-tab-active': leftPanelTab === 'assets' }"
                  @click="leftPanelTab = 'assets'"
                >
                  All Assets
                </button>
                <button
                  type="button"
                  class="assets-mode-tab"
                  :class="{ 'assets-mode-tab-active': leftPanelTab === 'vulnerabilities' }"
                  @click="leftPanelTab = 'vulnerabilities'"
                >
                  All Vulnerabilities
                </button>
              </div>

            <div v-if="leftPanelTab === 'assets'" class="assets-split-panel">

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
                    <input v-model="query" class="assets-search" placeholder="Search assets" @input="onSearchInput" />
                    <i v-if="query" class="bi bi-x-circle-fill clear-icon" @click="clearSearch"></i>
                  </div>
                </div>

                <!-- Asset List -->
                <div class="asset-list-scroll">
                  <div v-for="(asset, i) in pagedAssets" :key="asset.id || asset.asset || i"
                    class="asset-item-new"
                    :class="{ 'asset-item-active': activeIndex === asset.asset }"
                    @click="setActive(asset)">
                    <div class="d-flex justify-content-between align-items-start asset-item-top">
                      <div class="d-flex align-items-center gap-2">
                        <input v-if="showCheckboxes" type="checkbox" v-model="asset.selected" class="form-check-input" />
                        <input v-if="showHoldCheckboxes" type="checkbox" v-model="asset.selected" class="form-check-input" />
                        <span class="asset-ip">{{ asset.asset }}</span>
                      </div>
                      <span v-if="getPrioritySeverity(asset)" class="sev-badge" :class="'sev-' + getPrioritySeverity(asset).toLowerCase()">
                        {{ getPrioritySeverity(asset) }}
                      </span>
                    </div>
                    <p class="asset-sub">
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
                  <div class="right-panel-header-row">
                    <div class="right-panel-header-main">
                      <h1 class="asset-detail-title mb-2">{{ authStore.selectedAssetDetail?.asset }}</h1>
                      <div class="d-flex align-items-center gap-3 flex-wrap">
                        <span v-if="authStore.selectedAssetDetail?.severity" class="sev-badge" :class="'sev-' + (authStore.selectedAssetDetail.severity?.toLowerCase() || '')">
                          {{ authStore.selectedAssetDetail.severity }}
                        </span>
                        <span :class="getStatusBadgeClass(selectedAssetStatusLabel)">
                          <span :class="getStatusDotClass(selectedAssetStatusLabel)"></span>
                          {{ selectedAssetStatusLabel }}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      class="vuln-toolbox-btn"
                      title="Open remediation toolbox"
                      aria-label="Open remediation toolbox"
                      @click="showToolboxModal = true"
                    >
                      <i class="bi bi-tools" aria-hidden="true"></i>
                      Toolbox
                    </button>
                  </div>
                </div>
                <div class="right-panel-body">
                  <div class="d-flex gap-5 mb-4">
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
                    <button class="detail-tab" :class="{ 'detail-tab-active': activeTab === 'exceptions' }" @click="onSupportRequestsTabClick">
                      Support Requests
                      <span v-if="supportRequestCount > 0" class="badge rounded-circle bg-danger ms-1"
                        style="font-size:11px;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;">
                        {{ supportRequestCount }}
                      </span>
                    </button>
                    <!-- <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">Related Assets</button>
                    <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">History</button> -->
                  </div>
                </div>

                <!-- Tab Content -->
                <div class="right-panel-scroll">

                  <!-- Vulnerabilities Tab -->
                  <div v-if="activeTab === 'vulnerabilities'">
                    <div class="d-flex align-items-center justify-content-between mb-4 flex-wrap vuln-filter-bar">
                      <div class="d-flex gap-2 flex-wrap align-items-center">
                        <button class="sev-pill" :class="{ 'sev-pill-active': activeFilters.includes('All') }" @click="setSeverityFilter('All')">All</button>
                        <button class="sev-pill sev-pill-critical" :class="{ 'sev-pill-active': activeFilters.includes('Critical') }" @click="setSeverityFilter('Critical')">Critical</button>
                        <button class="sev-pill sev-pill-high" :class="{ 'sev-pill-active': activeFilters.includes('High') }" @click="setSeverityFilter('High')">High</button>
                        <button class="sev-pill sev-pill-medium" :class="{ 'sev-pill-active': activeFilters.includes('Medium') }" @click="setSeverityFilter('Medium')">Medium</button>
                        <button class="sev-pill sev-pill-low" :class="{ 'sev-pill-active': activeFilters.includes('Low') }" @click="setSeverityFilter('Low')">Low</button>
                      </div>
                      <div class="d-flex align-items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          class="vr-tab-btn"
                          :class="{ 'vr-tab-active': statusFilter.length === 0 }"
                          @click="toggleStatusTab('all')"
                        >
                          All
                          <span class="vr-tab-count">{{ statusCountAll }}</span>
                        </button>
                        <button
                          type="button"
                          class="vr-tab-btn"
                          :class="{ 'vr-tab-active-open': statusFilter.includes('open') }"
                          @click="toggleStatusTab('open')"
                        >
                          Open
                          <span class="vr-tab-count">{{ statusCountOpen }}</span>
                        </button>
                        <button
                          type="button"
                          class="vr-tab-btn"
                          :class="{ 'vr-tab-active-closed': statusFilter.includes('closed') }"
                          @click="toggleStatusTab('closed')"
                        >
                          Closed
                          <span class="vr-tab-count">{{ statusCountClosed }}</span>
                        </button>
                      </div>
                    </div>

                    <h3 class="section-label mb-3">Active Threats</h3>

                    <div v-if="loadingAssetVulns" class="text-center py-4">
                      <span class="spinner-border spinner-border-sm text-primary"></span>
                    </div>
                    <p v-else-if="!filteredVulnerabilities.length" class="av-empty-threats">
                      No active threats for this asset. Try clearing severity filters or select another asset.
                    </p>

                    <div v-else class="d-flex flex-column gap-3">
                      <div
                        v-for="(v, i) in filteredVulnerabilities"
                        :key="v.vul_name + '-' + i"
                        class="vuln-accordion-item"
                        :class="{ 'vuln-accordion-item--expanded': expandedVulnIndex === i }"
                        :ref="'vuln-' + i"
                      >
                        <div class="vuln-accordion-header" role="button" @click="toggleAccordion(i)">
                          <div class="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                            <i class="bi bi-exclamation-triangle-fill vuln-icon flex-shrink-0"
                              :class="{
                                'vuln-icon-critical': v.severity === 'Critical',
                                'vuln-icon-high': v.severity === 'High',
                                'vuln-icon-medium': v.severity === 'Medium',
                                'vuln-icon-low': v.severity === 'Low'
                              }"></i>
                            <span class="vuln-name" :title="v.vul_name">{{ v.vul_name }}</span>
                          </div>
                          <div class="d-flex align-items-center gap-3 flex-shrink-0">
                            <img
                              src="@/assets/images/vaptfix-verified.png"
                              alt=""
                              class="vuln-verified-badge"
                              aria-hidden="true"
                            />
                            <FixAvailableIndicator
                              :severity="v.severity"
                              :asset-ip="selectedAssetIp"
                              :asset-index="selectedAssetDemoIndex"
                            />
                            <button
                              type="button"
                              class="vuln-download-icon-btn"
                              title="Download fix"
                              aria-label="Download fix"
                              @click.stop="downloadAutomationScript"
                            >
                              <i class="bi bi-download"></i>
                            </button>
                            <button
                              type="button"
                              class="vuln-python-info-btn"
                              title="Python installation guide"
                              aria-label="Python installation guide"
                              @click.stop="openPythonGuide(v)"
                            >
                              <i class="bi bi-info-circle"></i>
                            </button>
                            <span class="sev-badge" :class="'sev-' + (v.severity?.toLowerCase() || '')">{{ v.severity }}</span>
                            <span :class="getStatusBadgeClass(v.status)">
                              <span :class="getStatusDotClass(v.status)"></span>{{ getStatusLabel(v.status) }}
                            </span>
                            <i class="bi text-muted" :class="expandedVulnIndex === i ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                          </div>
                        </div>
                        <div v-show="expandedVulnIndex === i" class="vuln-accordion-expand">
                          <div class="vuln-accordion-body">
                            <!-- Description -->
                            <div class="av-description-block">
                              <div class="av-db-label">DESCRIPTION</div>
                              <p class="av-db-text">
                                {{ getDisplayDescription(v.description, i) }}
                              </p>
                              <button
                                v-if="(v.description || '').length > descriptionPreviewLimit"
                                type="button"
                                class="av-read-more"
                                @click="toggleDescription(i)"
                              >
                                {{ isDescriptionExpanded(i) ? 'Read less' : 'Read more' }}
                              </button>
                            </div>

                            <!-- Affected Assets Chips -->
                            <div class="av-affected-block" style="display: none;">
                              <div class="av-aab-label">AFFECTED ASSETS ({{ getVulnAssets(v).length }})</div>
                              <div class="av-aab-chips">
                                <span v-for="ip in getVulnAssets(v)" :key="ip" class="av-asset-chip">{{ ip }}</span>
                              </div>
                            </div>

                            <!-- Tabs -->
                            <div class="av-detail-tabs">
                              <button
                                type="button"
                                class="av-dtab"
                                :class="{ active: currentVulnTab === 'auto' }"
                                @click="setVulnDetailTab('auto')"
                              >
                                <span class="av-dtab-emoji" aria-hidden="true">🤖</span>
                                Automated Fix
                              </button>
                              <button
                                type="button"
                                class="av-dtab"
                                :class="{ active: currentVulnTab === 'manual' }"
                                @click="setVulnDetailTab('manual')"
                              >
                                <span class="av-dtab-emoji" aria-hidden="true">📋</span>
                                Manual Fix
                              </button>
                            </div>

                            <!-- Tab Content -->
                            <div class="av-detail-tab-content">
                              <div v-if="currentVulnTab === 'auto'" class="av-auto-tab">
                                <AutomationNotSafeBanner v-if="isSelectedAssetAutomationNo" />
                                <AutomatedFixPanel
                                  v-else
                                  :key="v.vul_name + '-' + i"
                                  :severity="v.severity"
                                  :asset-ip="selectedAssetIp"
                                  :asset-index="selectedAssetDemoIndex"
                                  @view-code="showCodeModal = true"
                                />
                              </div>

                              <div v-else-if="currentVulnTab === 'manual'" class="av-manual-tab">
                                <div class="av-asset-section">
                                  <div class="av-asset-label">
                                    <span class="av-asset-os-lbl">Linux</span>
                                  </div>
                                  <ManualRemediationStepsPanel />
                                </div>
                              </div>
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
                              <span style="display:inline-flex;align-items:center;gap:4px;background:#dcfce7;color:#16a34a;font-size:11px;font-weight:700;padding:2px 10px;border-radius:20px;text-transform:capitalize;">
                                <span style="width:6px;height:6px;border-radius:50%;background:#16a34a;display:inline-block;"></span>
                                {{ item.status }}
                              </span>
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

            <div v-else class="assets-vuln-mode-wrap">
              <AssetsVulnerabilitiesMode :is-user="false" />
            </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <VulnRemediationToolboxModal
      v-model="showToolboxModal"
      :vuln-name="toolboxVulnName"
      :severity="toolboxSeverity"
      :cve="toolboxCve"
    />

    <PythonInstallGuideModal
      v-model="showPythonModal"
      :severity="pythonGuideSeverity"
    />

    <!-- Code Modal -->
    <div v-if="showCodeModal" class="code-modal-backdrop" @click.self="showCodeModal = false">
      <div class="code-modal-box">
        <div class="code-modal-header">
          <div class="d-flex align-items-center gap-2">
            <i class="bi bi-file-earmark-code" style="font-size: 1.2rem; color: #6366f1;"></i>
            <h3 class="code-modal-title">tls_config_auto_fixer.py</h3>
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
  </main>
</template>

<script>
import DashboardMenu from "@/components/admin-component/DashboardMenu.vue";
import DashboardHeader from "@/components/admin-component/DashboardHeader.vue";
import AssetsVulnerabilitiesMode from "@/components/assets/AssetsVulnerabilitiesMode.vue";
import ManualRemediationStepsPanel from "@/components/assets/ManualRemediationStepsPanel.vue";
import AutomatedFixPanel from "@/components/assets/AutomatedFixPanel.vue";
import PythonInstallGuideModal from "@/components/assets/PythonInstallGuideModal.vue";
import VulnRemediationToolboxModal from "@/components/assets/VulnRemediationToolboxModal.vue";
import FixAvailableIndicator from "@/components/assets/FixAvailableIndicator.vue";
import AutomationNotSafeBanner from "@/components/assets/AutomationNotSafeBanner.vue";
import {
  filterOpenAssetVulnerabilities,
  mergeAssetThreatVulnerabilities,
  matchesVulnStatusFilter,
  severityMatchesFilter,
  isAutomationNotAvailable,
} from "@/utils/assetVulnerabilities";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "AssetsView",
  components: {
    DashboardMenu,
    DashboardHeader,
    AssetsVulnerabilitiesMode,
    ManualRemediationStepsPanel,
    AutomatedFixPanel,
    PythonInstallGuideModal,
    VulnRemediationToolboxModal,
    FixAvailableIndicator,
    AutomationNotSafeBanner,
  },
  data() {
    return {
      leftPanelTab: "assets",
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
      activeFilters: ['All'],
      statusFilter: [],
      expandedDescriptions: {},
      expandedVulnIndex: null,
      descriptionPreviewLimit: 280,
      currentVulnTab: 'auto',
      loadingAssetVulns: false,
      closedFixVulnerabilities: [],
      closedFixCount: 0,
      loadingClosedFix: false,
      assetFetchSeq: 0,
      showCodeModal: false,
      showToolboxModal: false,
      showPythonModal: false,
      pythonGuideSeverity: '',
      codeCopied: false,
      automationCode: `import paramiko
import requests
import subprocess
import re
from datetime import import datetime

class TLSConfigurator:
    def __init__(self, host, username, password):
        self.host = host
        self.username = username
        self.password = password
        self.ssh_client = paramiko.SSHClient()
        self.log = []

    def connect(self):
        """Establish SSH connection to target host"""
        self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        try:
            self.ssh_client.connect(self.host, username=self.username, password=self.password)
            self.log_action("SSH connection established")
            return True
        except Exception as e:
            self.log_action(f"Connection failed: {str(e)}")
            return False

    def detect_tls_version(self):
        """Detect current TLS configuration"""
        stdin, stdout, stderr = self.ssh_client.exec_command("openssl version")
        version = stdout.read().decode()
        self.log_action(f"Detected OpenSSL version: {version}")
        return version`,
    };
  },
  computed: {
    allAssetThreatVulns() {
      return mergeAssetThreatVulnerabilities(
        this.authStore.selectedAssetVulnerabilities,
        this.closedFixVulnerabilities,
      );
    },
    vulnsForStatusCounts() {
      let list = this.allAssetThreatVulns;
      if (!this.activeFilters.includes('All')) {
        list = list.filter(v => severityMatchesFilter(v.severity, this.activeFilters));
      }
      return list;
    },
    statusCountAll() {
      return this.vulnsForStatusCounts.length;
    },
    statusCountOpen() {
      return this.vulnsForStatusCounts.filter(v => matchesVulnStatusFilter(v, ['open'])).length;
    },
    statusCountClosed() {
      return this.vulnsForStatusCounts.filter(v => matchesVulnStatusFilter(v, ['closed'])).length;
    },
    openAssetVulnerabilities() {
      return filterOpenAssetVulnerabilities(
        this.authStore.selectedAssetVulnerabilities,
        this.closedFixVulnerabilities,
      );
    },
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
      const total = this.totalPages;
      const maxVisible = 5;
      if (total <= maxVisible) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > total) {
        end = total;
        start = end - maxVisible + 1;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
    filteredVulnerabilities() {
      let list = [...this.allAssetThreatVulns];
      if (!this.activeFilters.includes('All')) {
        list = list.filter(v => severityMatchesFilter(v.severity, this.activeFilters));
      }
      list = list.filter(v => matchesVulnStatusFilter(v, this.statusFilter));

      return [...list].sort((a, b) => {
        return (
          this.getSeverityRank(a.severity) -
          this.getSeverityRank(b.severity)
        );
      });
    },
    selectedAssetStatusLabel() {
      return this.openAssetVulnerabilities.length > 0 ? "Open" : "Closed";
    },
    selectedAssetIp() {
      return this.authStore.selectedAssetDetail?.asset || this.activeIndex || '';
    },
    selectedAssetDemoIndex() {
      const ip = this.selectedAssetIp;
      const rows = this.authStore.assetRows || [];
      const idx = rows.findIndex(a => String(a.asset || '').trim() === String(ip).trim());
      return idx >= 0 ? idx : null;
    },
    isSelectedAssetAutomationNo() {
      return isAutomationNotAvailable(
        this.selectedAssetIp,
        this.selectedAssetDemoIndex,
        this.authStore.selectedAssetDetail?.severity || 'Medium',
      );
    },
    toolboxVulnName() {
      const v = this.filteredVulnerabilities[0];
      if (v?.vul_name) return v.vul_name;
      const ip = this.authStore.selectedAssetDetail?.asset;
      return ip ? `Remediation for ${ip}` : 'Remediation toolbox';
    },
    toolboxSeverity() {
      const v = this.filteredVulnerabilities[0];
      return v?.severity || this.authStore.selectedAssetDetail?.severity || 'Medium';
    },
    toolboxCve() {
      return this.filteredVulnerabilities[0]?.cve || '';
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
    activeIndex() {
      this.expandedVulnIndex = null;
    },
    activeFilters() {
      this.expandedVulnIndex = null;
    },
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
    openPythonGuide(vuln) {
      this.pythonGuideSeverity = vuln?.severity || '';
      this.showPythonModal = true;
    },
    getStatusLabel(status) {
      const normalized = (status || "").toLowerCase();
      if (normalized === "closed" || normalized === "resolved") return "Closed";
      return "Open";
    },
    getStatusBadgeClass(status) {
      return this.getStatusLabel(status) === "Closed" ? "status-closed-badge" : "status-open-badge";
    },
    getStatusDotClass(status) {
      return this.getStatusLabel(status) === "Closed" ? "status-dot-closed" : "status-dot-open";
    },
    copyCodeToClipboard() {
      navigator.clipboard.writeText(this.automationCode).then(() => {
        this.codeCopied = true;
        setTimeout(() => {
          this.codeCopied = false;
        }, 2000);
      });
    },
    toggleAccordion(index) {
      const isOpening = this.expandedVulnIndex !== index;
      this.expandedVulnIndex = this.expandedVulnIndex === index ? null : index;

      if (isOpening) {
        this.$nextTick(() => {
          const refKey = 'vuln-' + index;
          const element = this.$refs[refKey];
          if (element && element[0]) {
            element[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
      }
    },
    async reloadAssetsAndHeld() {
      await this.authStore.fetchAssets(true);
      await this.loadHeldAssets();
      this.resetPaginationIfNeeded();
      if (!this.activeIndex || !this.authStore.assetRows.some(a => a.asset === this.activeIndex)) {
        this.activeIndex = null;
        if (this.pagedAssets.length) {
          await this.setActive(this.pagedAssets[0]);
        }
      }
    },
    async refreshSupportRequestsForHost(host, requestSeq = this.assetFetchSeq) {
      if (!host) {
        this.supportRequestsByHost = [];
        this.supportRequestCount = 0;
        return;
      }

      this.loadingSupportRequests = true;
      const res = await this.authStore.getSupportRequestsByHost(host);
      if (requestSeq !== this.assetFetchSeq) return;
      this.loadingSupportRequests = false;

      if (res.status) {
        this.supportRequestsByHost = res.data || [];
        this.supportRequestCount = res.count || 0;
      } else {
        this.supportRequestsByHost = [];
        this.supportRequestCount = 0;
      }
    },
    async onSupportRequestsTabClick() {
      this.activeTab = "exceptions";
      await this.refreshSupportRequestsForHost(this.activeIndex, this.assetFetchSeq);
    },
    async loadClosedFixForAsset(asset, requestSeq = this.assetFetchSeq) {
      this.loadingClosedFix = true;
      const reportId = this.authStore.latestReportId;
      if (!reportId) {
        if (requestSeq === this.assetFetchSeq) {
          this.loadingClosedFix = false;
          this.closedFixVulnerabilities = [];
          this.closedFixCount = 0;
        }
        return;
      }

      const fixRes = await this.authStore.getClosedVulnerabilities(reportId, asset);
      if (requestSeq !== this.assetFetchSeq) return;

      this.loadingClosedFix = false;
      if (fixRes.status && fixRes.data?.results) {
        const closedOnly = fixRes.data.results.filter(
          (v) => v.status?.toLowerCase() === "closed"
        );
        this.closedFixVulnerabilities = closedOnly;
        this.closedFixCount = closedOnly.length;
      } else {
        this.closedFixVulnerabilities = [];
        this.closedFixCount = 0;
      }
    },
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
      if (sev === "Critical") return "#f8dede";
      if (sev === "High") return "#fee2e2";
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
      await this.reloadAssetsAndHeld();
      this.showCheckboxes = false;
      this.activeAction = "";
    },
    async setActive(asset) {
      if (!asset?.asset) return;
      const requestSeq = ++this.assetFetchSeq;
      this.activeIndex = asset.asset;
      this.loadingAssetVulns = true;
      this.expandedVulnIndex = null;

      // Primary details first, so UI updates quickly for selected asset.
      await this.authStore.fetchSingleAssetVulnerabilities(asset.asset);
      if (requestSeq !== this.assetFetchSeq) return;
      this.loadingAssetVulns = false;

      // Secondary data in parallel (do not block main asset details render).
      this.refreshSupportRequestsForHost(asset.asset, requestSeq);
      this.loadClosedFixForAsset(asset.asset, requestSeq);
    },
    downloadAutomationScript() {
      const blob = new Blob([this.automationCode], { type: 'text/x-python' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'automation_script.py';
      a.click();
      URL.revokeObjectURL(url);
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
      await this.reloadAssetsAndHeld();
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
      await this.reloadAssetsAndHeld();
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
    setSeverityFilter(type) {
      this.expandedVulnIndex = null;
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
    toggleStatusTab(status) {
      this.expandedVulnIndex = null;
      if (status === 'all') {
        this.statusFilter = [];
        return;
      }
      const idx = this.statusFilter.indexOf(status);
      if (idx === -1) {
        this.statusFilter.push(status);
      } else {
        this.statusFilter.splice(idx, 1);
      }
    },
    openSupportRequestModal(req) {
      this.selectedSupportRequest = req;
    },
    isDescriptionExpanded(index) {
      return !!this.expandedDescriptions[index];
    },
    toggleDescription(index) {
      this.expandedDescriptions = {
        ...this.expandedDescriptions,
        [index]: !this.expandedDescriptions[index],
      };
    },
    getDisplayDescription(description, index) {
      const fullText = description || "-";
      if (this.isDescriptionExpanded(index) || fullText.length <= this.descriptionPreviewLimit) {
        return fullText;
      }
      return `${fullText.slice(0, this.descriptionPreviewLimit).trimEnd()}...`;
    },
    viewFixDetail(item) {
      const reportId = this.authStore.latestReportId;
      if (!reportId) {
        console.error("No report ID available");
        return;
      }

      this.$router.push({
        name: 'remediation-timeline',
        params: {
          reportId: reportId,
          asset: item.asset,
        },
        query: {
          id: item.id,
          plugin_name: item.vulnerability_name,
          risk_factor: item.severity,
          status: item.status,
          description: item.description || '',
        }
      });
    },
    getVulnAssets(vuln) {
      if (!this.authStore.selectedAssetDetail?.asset) return [];
      return [this.authStore.selectedAssetDetail.asset];
    },
    setVulnDetailTab(tab) {
      this.currentVulnTab = tab;
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

    // Always refresh on page entry so navigation also triggers APIs.
    await Promise.all([
      this.reloadAssetsAndHeld(),
      this.authStore.fetchVulnerabilityRegister(true),
    ]);
  },
  async activated() {
    await Promise.all([
      this.reloadAssetsAndHeld(),
      this.authStore.fetchVulnerabilityRegister(true),
    ]);
  },
};
</script>

<style scoped>
.assets-content {
  padding: 0;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 72px);
  height: calc(100vh - 72px);
}

.assets-page-shell {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
  min-height: 0;
}

.assets-list-mode-tabs {
  display: flex;
  gap: 0;
  flex-shrink: 0;
  padding: 62px 16px 0;
  background: #fff;
  border-bottom: 1px solid rgba(203, 196, 208, 0.25);
}

.assets-mode-tab {
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  padding: 10px 16px;
  margin-bottom: -1px;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.assets-mode-tab:hover {
  color: #000000;
}

.assets-mode-tab-active {
  color: #000000;
  border-bottom-color: #000000;
}

.assets-vuln-mode-wrap {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  overflow: hidden;
}

.assets-vuln-mode-wrap :deep(.av-mode-root) {
  flex: 1;
  min-height: 0;
  height: 100%;
  align-items: stretch;
}

.assets-split-panel {
  display: flex;
  flex: 1;
  min-height: 0;
  background: #f8f9fc;
  align-items: stretch;
  overflow: hidden;
}

/* ── Left Panel ── */
.assets-left-panel {
  width: 33%;
  min-width: 280px;
  max-width: 380px;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  align-self: stretch;
  flex-shrink: 0;
}

.left-panel-header {
  padding: 12px 14px 10px;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}

.assets-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.assets-count-badge {
  font-size: 0.68rem;
  font-weight: 700;
  background: #f1f5f9;
  border-radius: 20px;
  padding: 3px 12px;
  color: #64748b;
}

.action-icon {
  font-size: 0.95rem;
  cursor: pointer;
  color: #64748b;
  transition: color 0.15s;
}
.action-icon:hover { color: #241447; }

.search-wrap { position: relative; }

.search-icon-left {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #94a3b8;
  pointer-events: none;
}

.assets-search {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 7px 10px 7px 30px;
  font-size: 0.75rem;
  color: #1e293b;
  background: #f8fafc;
  outline: none;
}
.assets-search:focus {
  box-shadow: 0 0 0 2px rgba(15, 105, 110, 0.2);
}

.clear-icon {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.8rem;
}

/* Asset list */
.asset-list-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 4px 0;
}
.asset-list-scroll::-webkit-scrollbar { width: 4px; }
.asset-list-scroll::-webkit-scrollbar-track { background: transparent; }
.asset-list-scroll::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.asset-item-new {
  padding: 10px 14px;
  border-bottom: 1px solid #f8fafc;
  border-left: 3px solid transparent;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.asset-item-new:hover {
  background: #f8fafc;
  border-left-color: #cbd5e1;
}
.asset-item-active {
  background: #f0fdf4;
  border-left-color: #10b981 !important;
}
.asset-item-active:hover {
  background: #f0fdf4;
}

.asset-item-top {
  margin-bottom: 3px;
}

.asset-ip {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
}

.asset-sub {
  font-size: 0.62rem;
  color: #64748b;
  margin: 0 0 5px;
}

/* Severity badges */
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
.sev-high     { background: #fee2e2 !important; color: #dc2626 !important; }
.sev-medium   { background: #fef3c7 !important; color: #f59e0b !important; }
.sev-low      { background: #ccfbf1 !important; color: #0f766e !important; }

.vendor-fix-pill {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 8px;
  background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
  color: #fff;
  border: 1px solid #5eead4;
  box-shadow: 0 1px 3px rgba(20, 184, 166, 0.2);
  white-space: nowrap;
  text-transform: capitalize;
}

.vuln-chip {
  font-size: 0.62rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.sev-count-dot {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 4px;
}
.critical-dot { color: #b42318 !important; background: #f8dede !important; }
.high-dot     { color: #dc2626 !important; background: #fee2e2 !important; }
.medium-dot   { color: #f59e0b; background: #fef3c7; }
.low-dot      { color: #0f766e; background: #ccfbf1; }

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
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
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
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}
.hold-sub {
  font-size: 0.62rem;
  color: #64748b;
  margin: 0;
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

/* ── Right Panel ── */
.assets-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  min-width: 0;
  min-height: 0;
  align-self: stretch;
  overflow: hidden;
}

.right-panel-header {
  padding: 18px 22px 14px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.right-panel-body {
  flex-shrink: 0;
  background: #f8f9fc;
  padding: 16px 28px 0;
}

.asset-detail-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  line-height: 1.3;
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

.meta-label {
  font-size: 0.62rem;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.meta-value {
  font-size: 0.8rem;
  color: #475569;
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
  font-size: 0.8rem;
  font-weight: 500;
  color: #64748b;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s;
}
.detail-tab:hover { color: #1e293b; }
.detail-tab-active {
  font-weight: 500;
  color: #0f172a;
  border-bottom: 2px solid #0f172a;
}

/* Right panel scrollable body */
.right-panel-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 28px 12px;
  background: #f8f9fc;
}
.right-panel-scroll::-webkit-scrollbar { width: 4px; }
.right-panel-scroll::-webkit-scrollbar-track { background: transparent; }
.right-panel-scroll::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.section-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin: 0;
}

/* Severity pills filter */
.sev-pill {
  border-radius: 50px;
  padding: 5px 14px;
  font-size: 0.68rem;
  font-weight: 600;
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
.sev-pill-critical { color: #b42318 !important; background: #f8dede !important; }
.sev-pill-high     { color: #dc2626 !important; background: #fee2e2 !important; }
.sev-pill-medium   { color: #f59e0b; }
/* Same white / gray border as other severity pills; green text only */
.sev-pill-low { color: #10b981; }
.sev-pill-low.sev-pill-active {
  background: #e0f2f1 !important;
  color: #10b981 !important;
  border-color: #10b981 !important;
}

/* Vuln accordion */
.vuln-accordion-item {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(203, 196, 208, 0.25);
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  isolation: isolate;
}

.vuln-accordion-item--expanded {
  height: min(calc(100vh - 260px), 520px);
  max-height: min(calc(100vh - 260px), 520px);
  min-height: 280px;
}

.right-panel-scroll .d-flex.flex-column {
  flex: 0 0 auto;
}

.vuln-accordion-header {
  position: relative;
  z-index: 3;
  flex-shrink: 0;
  padding: 14px 16px;
  background-color: #f2f3f6 !important;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  gap: 12px;
}
.vuln-accordion-header:hover { background-color: #edeef1 !important; }

.vuln-icon { font-size: 1rem; }
.vuln-icon-critical { color: #b42318; }
.vuln-icon-high     { color: #dc2626; }
.vuln-icon-medium   { color: #f59e0b; }
.vuln-icon-low      { color: #10b981; }

.vuln-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  max-width: 100%;
  flex: 1;
  cursor: default;
}

.vuln-accordion-expand {
  position: relative;
  z-index: 1;
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  background: #fff;
  box-sizing: border-box;
  padding-bottom: 28px;
  scroll-padding-bottom: 28px;
}

.vuln-accordion-expand::-webkit-scrollbar {
  width: 6px;
}

.vuln-accordion-expand::-webkit-scrollbar-thumb {
  background: #cbc4d0;
  border-radius: 10px;
}

.vuln-accordion-body {
  padding: 14px 16px 20px;
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
  color: #94a3b8;
  letter-spacing: 0.05em;
  margin-bottom: 3px;
}
.vuln-meta-value {
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}
.vuln-meta-value.teal { color: #0f696e; }

.vuln-desc-title {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 5px;
}
.vuln-desc-text {
  font-size: 0.8rem;
  color: #475569;
  line-height: 1.65;
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

.btn-read-more {
  background: transparent;
  border: none;
  padding: 0;
  color: #0f696e;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

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
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
}
.fixed-vuln-date {
  font-size: 0.62rem;
  color: #64748b;
  margin: 0;
}
.btn-view-detail {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  padding: 4px 14px;
  border-radius: 8px;
  background: #f1f5f9;
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
  background: #f1f5f9;
  color: #64748b;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sr-vul-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
}

.sr-empty {
  color: #94a3b8;
  font-size: 0.8rem;
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
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 3px;
  display: flex;
  align-items: center;
}

.sr-modal-sub {
  color: rgba(255,255,255,0.55);
  font-size: 0.68rem;
  padding-left: 26px;
}

.sr-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.sr-step-pill {
  display: inline-flex;
  align-items: center;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 50px;
  padding: 4px 12px;
  font-size: 0.68rem;
  font-weight: 600;
}

.sr-textarea {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.8rem;
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
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.sr-btn-close:hover { background: #1a0f35; }

.btn-view-requests {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  padding: 6px 14px;
  border-radius: 8px;
  background: #f1f5f9;
  border: none;
  cursor: pointer;
  transition: background 0.15s;
}
.btn-view-requests:hover { background: #a1ecf2; }

/* All Vulnerabilities Tab Styles - Imported from AssetsVulnerabilitiesMode */
.av-description-block {
  background: #fff;
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
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
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
}

.av-aab-label {
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 10px;
}

.av-aab-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.av-asset-chip {
  font-family: monospace;
  font-size: 0.78rem;
  font-weight: 600;
  color: #065f46;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 4px;
}

.av-asset-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.av-asset-os-lbl {
  font-size: 0.75rem;
  color: #64748b;
}

.av-detail-tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  background: #fff;
  padding: 0 22px;
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
  height: auto;
  min-height: 0;
  box-sizing: border-box;
}

.av-manual-tab {
  padding: 22px;
}

.vuln-accordion-body .av-detail-tabs {
  margin-bottom: 0;
}

.av-assess-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.av-assess-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
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
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 8px 14px;
  border-radius: 8px;
  flex-shrink: 0;
}

.av-feas-level {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.av-feas-pct {
  font-size: 0.68rem;
  font-weight: 600;
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

.av-assess-col {
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px 14px;
  border: 1px solid #f1f5f9;
}

.col-head {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
}

.green-head {
  background: #d1fae5;
  color: #065f46;
}

.red-head {
  background: #fee2e2;
  color: #991b1b;
}

.av-can-list {
  list-style: none;
  padding: 0;
  margin: 0;
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

.av-can-dot {
  color: #16a34a;
  font-weight: 700;
  flex-shrink: 0;
}

.av-cant-dot {
  color: #dc2626;
  font-weight: 700;
  flex-shrink: 0;
}

.av-empty-threats {
  font-size: 13px;
  color: #64748b;
  padding: 16px;
  background: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  margin-bottom: 12px;
}

.av-action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 14px;
  justify-content: flex-end;
}

.av-btn-outline {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: 2px solid #0284c7;
  background: #fff;
  color: #0284c7;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.av-btn-outline:hover {
  background: #f0f9ff;
  border-color: #0369a1;
  color: #0369a1;
}

.av-btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border: none;
  background: #0c4a6e;
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.av-btn-primary:hover {
  background: #075985;
}

.av-recommended-box {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 14px 16px;
}

.av-rec-label {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #1e40af;
  margin-bottom: 6px;
}

.av-rec-text {
  font-size: 0.82rem;
  color: #1e3a8a;
  line-height: 1.6;
}

.av-asset-section {
  background: #fff;
  border-radius: 10px;
  padding: 0;
}

@media (max-width: 768px) {
  .av-assess-grid {
    grid-template-columns: 1fr;
  }
}

/* Code Modal */
.code-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.code-modal-box {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.code-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.code-modal-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.code-modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.code-modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.code-modal-body {
  flex: 1;
  overflow: auto;
  padding: 0;
  position: relative;
}

.code-header-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #1e293b;
  color: #94a3b8;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  z-index: 1;
}

.code-block {
  background: #1e293b;
  color: #e2e8f0;
  padding: 20px;
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  overflow-x: auto;
  white-space: pre;
}

.code-block::-webkit-scrollbar {
  height: 8px;
}

.code-block::-webkit-scrollbar-thumb {
  background: #475569;
  border-radius: 4px;
}

.code-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.code-copy-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #0ea5e9;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.code-copy-btn:hover {
  background: #0284c7;
}

.code-close-btn {
  padding: 8px 16px;
  background: #fff;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.code-close-btn:hover {
  background: #f9fafb;
  color: #1f2937;
}
</style>
