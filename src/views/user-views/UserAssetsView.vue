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
                    <h2 class="assets-title">All Assets </h2>
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
                    <input v-model="searchQuery" class="assets-search" placeholder="Search assets" />
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
                      <div class="d-flex justify-content-between align-items-start asset-item-top">
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
                      <p class="asset-sub">
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
                <FixPanelHeaderAlerts
                  :python-visible="showPythonInstallAlert"
                  :verified-visible="showVaptfixVerifiedAlert"
                  @close-python="showPythonInstallAlert = false"
                  @close-verified="showVaptfixVerifiedAlert = false"
                  @open-python-guide="openPythonGuideFromAlert"
                />
                <!-- Detail Header -->
                <div class="right-panel-header">
                  <div class="d-flex align-items-center justify-content-between">
                    <h1 class="asset-detail-title mb-0">{{ selectedAsset?.asset }}</h1>
                    <button class="rt-btn-support" @click="openAssetSupportModal">
                      Support Request
                    </button>
                  </div>
                  <div
                    v-if="selectedAsset?.host_information?.['Netbios Name'] || selectedAsset?.host_information?.['DNS Name'] || selectedAsset?.assigned_teams?.length"
                    class="right-panel-meta"
                  >
                    <div v-if="selectedAsset?.host_information?.['Netbios Name']">
                      <p class="meta-label">Hostname</p>
                      <p class="meta-value">{{ selectedAsset.host_information['Netbios Name'] }}</p>
                    </div>

                  </div>
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
                    <button class="detail-tab ext-tab-btn" @click="openExtPopup">
                      Extend Timeline
                    </button>
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
                        v-for="(vuln, idx) in filteredVulnerabilities"
                        :key="vuln.vul_name + '-' + idx"
                        class="vuln-accordion-item"
                        :class="{ 'vuln-accordion-item--expanded': expandedVulnIndex === idx }"
                        :ref="'vuln-' + idx"
                      >
                        <div class="vuln-accordion-header" role="button" @click="toggleAccordion(idx)">
                          <div class="d-flex align-items-center gap-3 flex-grow-1 min-w-0">
                            <i class="bi bi-exclamation-triangle-fill vuln-icon flex-shrink-0"
                              :class="{
                                'vuln-icon-critical': vuln.severity === 'Critical',
                                'vuln-icon-high': vuln.severity === 'High',
                                'vuln-icon-medium': vuln.severity === 'Medium',
                                'vuln-icon-low': vuln.severity === 'Low'
                              }"></i>
                            <div class="vuln-name-row">
                              <span class="vuln-name" :title="vuln.vul_name">{{ vuln.vul_name }}</span>
                              <span class="sev-badge" :class="'sev-' + (vuln.severity?.toLowerCase() || '')">{{ vuln.severity }}</span>
                              <span :class="getStatusBadgeClass(vuln.status)">
                                <span :class="getStatusDotClass(vuln.status)"></span>{{ getStatusLabel(vuln.status) }}
                              </span>
                              <span :class="getVulnTeamChipClass(vuln)" style="font-size:0.68rem; padding:2px 8px;">
                                {{ getVulnTeamLabel(vuln) }}
                              </span>
                            </div>
                          </div>
                          <div class="d-flex align-items-center gap-3 flex-shrink-0 vuln-accordion-actions">
                            <FixAvailableIndicator
                              :severity="vuln.severity"
                              :asset-ip="selectedAssetIp"
                              :asset-index="selectedAssetDemoIndex"
                            />
                            <button
                              type="button"
                              class="vuln-download-icon-btn"
                              :class="{ 'vuln-download-icon-btn--disabled': isVulnDownloadDisabled(vuln) }"
                              :disabled="isVulnDownloadDisabled(vuln)"
                              :title="isVulnDownloadDisabled(vuln) ? 'Script not available — automation not possible' : 'Download fix'"
                              :aria-label="isVulnDownloadDisabled(vuln) ? 'Script download not available' : 'Download fix'"
                              @click.stop="!isVulnDownloadDisabled(vuln) && downloadAutomationScript()"
                            >
                              <i class="bi bi-download"></i>
                            </button>
                            <i class="bi text-muted" :class="expandedVulnIndex === idx ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                          </div>
                        </div>
                        <div v-show="expandedVulnIndex === idx" class="vuln-accordion-expand">
                          <div class="vuln-accordion-body">
                            <!-- Description -->
                            <div class="av-description-block">
                              <div class="av-db-label">DESCRIPTION</div>
                              <p class="av-db-text">
                                {{ getDisplayDescription(vuln.description, idx) }}
                              </p>
                              <button
                                v-if="(vuln.description || '').length > descriptionPreviewLimit"
                                type="button"
                                class="av-read-more"
                                @click="toggleDescription(idx)"
                              >
                                {{ isDescriptionExpanded(idx) ? 'Read less' : 'Read more' }}
                              </button>
                            </div>

                            <!-- Affected Assets Chips -->
                            <div class="av-affected-block" style="display: none;">
                              <div class="av-aab-label">AFFECTED ASSETS ({{ getVulnAssets(vuln).length }})</div>
                              <div class="av-aab-chips">
                                <span v-for="ip in getVulnAssets(vuln)" :key="ip" class="av-asset-chip">{{ ip }}</span>
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
                            <div
                              class="av-detail-tab-content"
                              :class="{ 'av-detail-tab-content--manual': currentVulnTab === 'manual' }"
                            >
                              <div v-if="currentVulnTab === 'auto'" class="av-auto-tab">
                                <AutomationNotSafeBanner v-if="isSelectedAssetAutomationNo" />
                                <AutomatedFixPanel
                                  v-else
                                  :key="vuln.vul_name + '-' + idx"
                                  :severity="vuln.severity"
                                  :vuln-name="vuln.vul_name"
                                  :asset-ip="selectedAssetIp"
                                  :asset-index="selectedAssetDemoIndex"
                                  :is-user="true"
                                  @view-code="showCodeModal = true"
                                />
                              </div>

                              <div v-else-if="currentVulnTab === 'manual'" class="av-manual-tab">
                                <div class="av-asset-section">
                                  <div class="av-asset-label">
                                    <span class="av-asset-os-lbl">Linux</span>
                                  </div>
                                  <ManualRemediationStepsPanel :is-user="true" />
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
                              <p class="fixed-vuln-name">{{ item.plugin_name }}</p>
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
                              <template v-if="selectedSupportRequest.step_number">
                                <span class="sr-step-pill">Step {{ selectedSupportRequest.step_number }}</span>
                              </template>
                              <template v-else-if="selectedSupportRequest.step_requested === 'all'">
                                <span class="sr-step-pill">All Steps</span>
                              </template>
                              <template v-else-if="selectedSupportRequest.step_requested">
                                <span v-for="step in selectedSupportRequest.step_requested?.split(',')" :key="step" class="sr-step-pill">Step {{ step.trim() }}</span>
                              </template>
                              <template v-else>
                                <span class="text-muted small">No step specified</span>
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

              <!-- Extended Timeline Drawer -->
              <transition name="ext-drawer">
                <div v-if="showExtPopup" class="ext-popup-backdrop" @click.self="closeExtPopup">
                  <div class="ext-popup-box" @click.stop>
                    <div class="ext-drawer-accent" :class="'ext-accent-' + extPopupSeverity"></div>
                    <div class="ext-popup-header">
                      <div class="ext-header-left">
                        <div class="ext-header-icon" :class="'ext-icon-' + extPopupSeverity">
                          <i class="bi" :class="{
                            'bi-exclamation-circle-fill': extPopupSeverity === 'critical',
                            'bi-exclamation-triangle-fill': extPopupSeverity === 'high',
                            'bi-exclamation-circle': extPopupSeverity === 'medium',
                            'bi-gear-fill': extPopupSeverity === 'low'
                          }"></i>
                        </div>
                        <div>
                          <h4 class="ext-popup-title">Extend Timeline</h4>
                          <span class="ext-popup-subtitle">
                            <span class="ext-sev-pill" :class="'ext-sev-' + extPopupSeverity">{{ extPopupSeverity }}</span>
                            Severity Request
                          </span>
                        </div>
                      </div>
                      <button type="button" class="ext-header-close" @click="closeExtPopup"><i class="bi bi-x-lg"></i></button>
                    </div>
                    <div class="ext-popup-body">
                      <div class="ext-info-banner">
                        <i class="bi bi-info-circle-fill"></i>
                        <span>Submit a request to extend the remediation deadline for a specific vulnerability on an asset.</span>
                      </div>
                      <div class="ext-section-title"><i class="bi bi-hdd-network"></i> Asset & Vulnerability</div>
                      <div class="ext-popup-field">
                        <label class="ext-popup-label">Asset (IP)</label>
                        <div class="ext-select-wrap">
                          <i class="bi bi-hdd-fill ext-select-icon ext-icon-asset"></i>
                          <select class="ext-popup-select ext-has-icon" v-model="extPopupAsset" disabled>
                            <option value="">{{ extPopupOptionsLoading ? 'Loading...' : 'Select Asset' }}</option>
                            <option v-for="ip in extPopupAssetList" :key="ip" :value="ip">{{ ip }}</option>
                          </select>
                        </div>
                      </div>
                      <div class="ext-popup-field">
                        <label class="ext-popup-label">Vulnerability Name</label>
                        <div class="ext-select-wrap">
                          <i class="bi bi-shield-exclamation ext-select-icon ext-icon-vuln"></i>
                          <select class="ext-popup-select ext-has-icon" v-model="extPopupVulName" :disabled="!extPopupAsset || extPopupOptionsLoading">
                            <option value="">{{ extPopupOptionsLoading ? 'Loading...' : 'Select Vulnerability' }}</option>
                            <option v-for="vn in extPopupVulList" :key="vn" :value="vn">{{ vn }}</option>
                          </select>
                        </div>
                      </div>
                      <div class="ext-drawer-divider" style="margin: 4px 0 12px;"></div>
                      <div class="ext-section-title"><i class="bi bi-calendar3"></i> Timeline Details</div>
                      <div class="ext-popup-row">
                        <div class="ext-popup-field">
                          <label class="ext-popup-label">Original Deadline</label>
                          <div class="ext-deadline-chip ext-deadline-original">
                            <i class="bi bi-clock-history"></i>
                            <span>{{ extOriginalDeadlineDisplay }}</span>
                          </div>
                        </div>
                        <div class="ext-popup-field">
                          <label class="ext-popup-label">Extended Deadline</label>
                          <div class="ext-select-wrap">
                            <i class="bi bi-clock-fill ext-select-icon"></i>
                            <select class="ext-popup-select ext-has-icon" v-model="extPopupExtension">
                              <option value="">— Select Extension —</option>
                              <optgroup label="Days">
                                <option value="1 Day">1 Day</option>
                                <option value="2 Days">2 Days</option>
                                <option value="3 Days">3 Days</option>
                                <option value="4 Days">4 Days</option>
                                <option value="5 Days">5 Days</option>
                                <option value="6 Days">6 Days</option>
                              </optgroup>
                              <optgroup label="Weeks">
                                <option value="1 Week">1 Week</option>
                                <option value="2 Weeks">2 Weeks</option>
                                <option value="3 Weeks">3 Weeks</option>
                                <option value="4 Weeks">4 Weeks</option>
                                <option value="5 Weeks">5 Weeks</option>
                                <option value="6 Weeks">6 Weeks</option>
                              </optgroup>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="ext-drawer-divider" style="margin: 4px 0 12px;"></div>
                      <div class="ext-section-title"><i class="bi bi-chat-left-text"></i> Justification</div>
                      <div class="ext-popup-field">
                        <label class="ext-popup-label">Reason</label>
                        <textarea class="ext-popup-textarea" v-model="extPopupReason" rows="4" placeholder="Describe why an extension is needed — include any dependencies, blockers, or risk context..."></textarea>
                        <span class="ext-char-hint">{{ extPopupReason.trim().length > 0 ? extPopupReason.trim().length + ' chars' : 'Required' }}</span>
                      </div>
                    </div>
                    <div class="ext-popup-footer">
                      <button type="button" class="mte-btn-secondary" @click="closeExtPopup">Cancel</button>
                      <button type="button" class="mte-btn-primary ext-submit-btn" @click="submitExtPopup" :disabled="!extPopupAsset || !extPopupVulName || !extPopupExtension || !extPopupReason.trim()">
                        <i class="bi bi-send-fill"></i> <span style="color:#fff;">Submit Request</span>
                      </button>
                    </div>
                  </div>
                </div>
              </transition>

            </div>

            <div v-else class="assets-vuln-mode-wrap">
              <AssetsVulnerabilitiesMode
                :is-user="true"
                :show-python-alert="showPythonInstallAlert"
                :show-verified-alert="showVaptfixVerifiedAlert"
                @close-python-alert="showPythonInstallAlert = false"
                @close-verified-alert="showVaptfixVerifiedAlert = false"
              />
            </div>

            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Code Modal -->
    <PythonInstallGuideModal
      v-model="showPythonModal"
      :severity="pythonGuideSeverity"
    />

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

  <!-- Asset Support Request Modal -->
  <div class="modal fade" id="assetSrModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content vc-modal-content">
        <div class="modal-header vc-modal-header">
          <h5 class="modal-title vc-modal-title"><i class="bi bi-headset me-2"></i>Raise Support Request</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4">
          <p class="vc-modal-section-label mb-2">Select Vulnerability <span class="text-danger">*</span></p>
          <select v-model="assetSrVulnName" class="vc-textarea mb-3" style="resize:none;padding:8px 12px;cursor:pointer;">
            <option value="">-- Select Vulnerability --</option>
            <option v-for="v in filteredVulnerabilities" :key="v.vul_name" :value="v.vul_name">{{ v.vul_name }}</option>
          </select>
          <h6 class="vc-modal-section-label mb-3">Choose the step for which you want support</h6>
          <div class="row g-2 mt-1">
            <div class="col-4" v-for="n in 6" :key="n">
              <span
                class="vc-step-pill"
                :class="[
                  assetSrRaisedSteps.includes(n) ? 'vc-step-pill-raised' : '',
                  assetSrStep === n && !assetSrRaisedSteps.includes(n) ? 'vc-step-pill-active' : ''
                ]"
                :style="assetSrRaisedSteps.includes(n) ? 'cursor:not-allowed;opacity:0.6;' : 'cursor:pointer;'"
                :title="assetSrRaisedSteps.includes(n) ? 'Support already raised for this step' : ''"
                @click="!assetSrRaisedSteps.includes(n) && (assetSrStep = n)"
              >Step {{ n }}</span>
            </div>
          </div>
          <p class="vc-modal-section-label mt-4 mb-2">Description <span class="text-danger">*</span></p>
          <textarea v-model="assetSrDescription" class="vc-textarea" rows="4" placeholder="Write your issue here..."></textarea>
          <div v-if="assetSrRaised" class="rt-support-raised-note mt-3">
            <i class="bi bi-check-circle-fill me-2" style="color:#0f696e;"></i>
            Support request has been raised successfully.
          </div>
        </div>
        <div class="modal-footer vc-modal-footer">
          <button
            v-if="!assetSrRaised"
            class="vc-btn-primary"
            :disabled="!assetSrVulnName || !assetSrDescription.trim() || !assetSrStep || assetSrSubmitting"
            @click="submitAssetSr"
          >
            <span v-if="assetSrSubmitting"><span class="spinner-border spinner-border-sm me-1"></span>Submitting...</span>
            <span v-else>Submit</span>
          </button>
          <button
            v-else
            class="vc-btn-primary"
            :disabled="!hasNextAssetSrStep"
            @click="prepareAnotherAssetSr"
          >
            Raise Support Request for other Steps
          </button>
          <button class="vc-btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>

</main>
</template>

<script>
import DashboardMenu from "@/components/user-component/DashboardMenu.vue";
import DashboardHeader from "@/components/user-component/DashboardHeader.vue";
import AssetsVulnerabilitiesMode from "@/components/assets/AssetsVulnerabilitiesMode.vue";
import ManualRemediationStepsPanel from "@/components/assets/ManualRemediationStepsPanel.vue";
import AutomatedFixPanel from "@/components/assets/AutomatedFixPanel.vue";
import PythonInstallGuideModal from "@/components/assets/PythonInstallGuideModal.vue";
import FixAvailableIndicator from "@/components/assets/FixAvailableIndicator.vue";
import AutomationNotSafeBanner from "@/components/assets/AutomationNotSafeBanner.vue";
import FixPanelHeaderAlerts from "@/components/assets/FixPanelHeaderAlerts.vue";
import {
  filterOpenAssetVulnerabilities,
  mergeAssetThreatVulnerabilities,
  matchesVulnStatusFilter,
  severityMatchesFilter,
  isAutomationNotAvailable,
} from "@/utils/assetVulnerabilities";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "UserAssetsView",
  components: {
    DashboardMenu,
    DashboardHeader,
    AssetsVulnerabilitiesMode,
    ManualRemediationStepsPanel,
    AutomatedFixPanel,
    PythonInstallGuideModal,
    FixAvailableIndicator,
    AutomationNotSafeBanner,
    FixPanelHeaderAlerts,
  },
  data() {
    return {
      showPythonInstallAlert: false,
      showVaptfixVerifiedAlert: false,
      leftPanelTab: "assets",
      authStore: useAuthStore(),
      selectedSeverity: "",
      activeFilters: ['All'],
      statusFilter: [],
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
      supportRequestCount: 0,
      selectedSupportRequest: null,
      expandedDescriptions: {},
      descriptionPreviewLimit: 280,
      expandedVulnIndex: null,
      currentVulnTab: 'auto',
      loadingAssetVulns: false,
      showExtPopup: false,
      extPopupSeverity: "critical",
      extPopupAsset: "",
      extPopupVulName: "",
      extPopupExtension: "",
      extPopupReason: "",
      extPopupAssetListApi: [],
      extPopupVulListApi: [],
      extPopupOriginalDeadlineDays: null,
      extPopupOptionsLoading: false,
      showCodeModal: false,
      showPythonModal: false,
      assetSrStep: null,
      assetSrVulnName: '',
      assetSrDescription: '',
      assetSrSubmitting: false,
      assetSrRaised: false,
      assetSrRaisedSteps: [],
      assetSrFixVulnId: null,

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
    filteredVulnerabilities() {
      let vulns = [...this.allAssetThreatVulns];
      if (!this.activeFilters.includes('All')) {
        vulns = vulns.filter(v => severityMatchesFilter(v.severity, this.activeFilters));
      }
      vulns = vulns.filter(v => matchesVulnStatusFilter(v, this.statusFilter));
      return vulns;
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
    selectedAsset() {
      if (!this.activeIndex) return null;
      return this.assets.find(a => a.asset === this.activeIndex) || null;
    },
    selectedAssetIp() {
      return this.selectedAsset?.asset || this.activeIndex || '';
    },
    selectedAssetDemoIndex() {
      const ip = this.selectedAssetIp;
      const idx = this.assets.findIndex(a => String(a.asset || '').trim() === String(ip).trim());
      return idx >= 0 ? idx : null;
    },
    isSelectedAssetAutomationNo() {
      const topSev = this.selectedAsset
        ? this.getTopSeverity(this.selectedAsset.severity_counts)
        : 'Medium';
      return isAutomationNotAvailable(this.selectedAssetIp, this.selectedAssetDemoIndex, topSev);
    },
    selectedAssetStatusLabel() {
      return this.openAssetVulnerabilities.length > 0 ? "Open" : "Closed";
    },
    assetSupportRequests() {
      return this.supportRequests;
    },
    nextAssetSrStep() {
      for (let s = 1; s <= 6; s++) {
        if (!this.assetSrRaisedSteps.includes(s)) return s;
      }
      return null;
    },
    hasNextAssetSrStep() {
      return this.nextAssetSrStep !== null;
    },
    extPopupAssetList() {
      if (this.extPopupAssetListApi.length > 0) return this.extPopupAssetListApi;
      return this.assets.map(a => a.asset).filter(Boolean);
    },
    extPopupVulList() {
      if (this.extPopupVulListApi.length > 0) return this.extPopupVulListApi;
      if (!this.extPopupAsset) return [];
      return this.authStore.selectedAssetVulnerabilities
        .filter(v => (v.status || '').toLowerCase() === 'open')
        .map(v => v.vul_name)
        .filter(Boolean);
    },
    extOriginalDeadlineDisplay() {
      if (this.extPopupOriginalDeadlineDays !== null && this.extPopupOriginalDeadlineDays !== undefined) {
        return `${this.extPopupOriginalDeadlineDays} Days`;
      }
      return "—";
    },
  },
  methods: {
    openPythonGuide(vuln) {
      this.pythonGuideSeverity = vuln?.severity || '';
      this.showPythonModal = true;
    },
    openPythonGuideFromAlert() {
      const vuln = this.filteredVulnerabilities?.[0];
      const topSev = this.selectedAsset
        ? this.getTopSeverity(this.selectedAsset.severity_counts)
        : 'Medium';
      const severity = vuln?.severity || topSev || 'Medium';
      this.openPythonGuide(vuln || { severity });
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
    openAssetSupportModal() {
      this.assetSrStep = null;
      this.assetSrVulnName = '';
      this.assetSrDescription = '';
      this.assetSrRaised = false;
      this.assetSrRaisedSteps = [];
      this.assetSrFixVulnId = null;
      const modal = new bootstrap.Modal(document.getElementById('assetSrModal'));
      modal.show();
    },
    prepareAnotherAssetSr() {
      const step = this.nextAssetSrStep;
      if (!step) return;
      this.assetSrStep = step;
      this.assetSrRaised = false;
      this.assetSrDescription = '';
    },
    async submitAssetSr() {
      if (!this.assetSrVulnName || !this.assetSrDescription.trim() || !this.assetSrStep) return;
      this.assetSrSubmitting = true;
      const reportId = this.authStore.userLatestReportId;
      const asset = this.activeIndex;
      if (!reportId || !asset) {
        this.assetSrSubmitting = false;
        Swal.fire('Error', 'Asset info not found', 'error');
        return;
      }
      // Fix vuln ID pehle se hai toh dobara create mat karo
      let fixVulnId = this.assetSrFixVulnId;
      if (!fixVulnId) {
        const selectedVuln = this.filteredVulnerabilities.find(v => v.vul_name === this.assetSrVulnName);
        const createRes = await this.authStore.createUserFixVulnerability(reportId, asset, {
          plugin_name: this.assetSrVulnName,
          risk_factor: selectedVuln?.severity || 'Medium',
        });
        fixVulnId =
          createRes.data?.fix_vulnerability_id ||
          createRes.data?._id ||
          createRes.details?.fix_vulnerability_id ||
          createRes.details?._id;
        if (!fixVulnId) {
          this.assetSrSubmitting = false;
          Swal.fire('Error', createRes.message || 'Failed to create fix vulnerability', 'error');
          return;
        }
        this.assetSrFixVulnId = fixVulnId;
      }
      const res = await this.authStore.raiseUserSupportRequest(fixVulnId, {
        step_number: this.assetSrStep,
        description: this.assetSrDescription,
      });
      this.assetSrSubmitting = false;
      if (res.status) {
        this.assetSrRaisedSteps.push(this.assetSrStep);
        this.assetSrRaised = true;
        Swal.fire({ icon: 'success', title: 'Support Request Raised', timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire('Error', res.message || 'Failed to raise support request', 'error');
      }
    },
    getVulnTeamLabel(vuln) {
      // ✅ Actual assigned team pehle check karo — multiple field names
      const t = String(
        vuln?.assigned_team || vuln?.team || vuln?.Member_role?.[0] || ''
      ).trim();
      if (t) return t;
      // Fallback: vuln name se guess karo
      const n = String(vuln?.vul_name || '').toLowerCase();
      if (/architect|injection|xss|sqli|rce|csrf|overflow|traversal/.test(n)) return 'Architectural Flaws';
      if (/tls|ssl|protocol|cipher|encrypt|certif|port|network|firewall|vpn|smtp|ftp/.test(n)) return 'Network Security';
      if (/deprecat|outdated|end.of.life|eol|obsolete|unsupported|patch/.test(n)) return 'Patch Management';
      if (/missing|hsts|header|cors|cookie|misconfigur|default.password|weak.password|policy/.test(n)) return 'Configuration Management';
      return 'Patch Management';
    },
    getVulnTeamChipClass(vuln) {
      const team = this.getVulnTeamLabel(vuln);
      if (team === 'Architectural Flaws')      return 'rt-team-chip rt-team-architectural';
      if (team === 'Network Security')         return 'rt-team-chip rt-team-network';
      if (team === 'Configuration Management') return 'rt-team-chip rt-team-configuration';
      if (team === 'Patch Management')         return 'rt-team-chip rt-team-patch';
      return 'rt-team-chip rt-team-default';
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
    syncTotalAssets() {
      // Keep header count aligned with dashboard: only active (non-held) assets.
      this.totalAssets = this.assets.length;
    },
    async onSupportRequestsTabClick() {
      this.activeTab = "exceptions";
      await this.loadSupportRequestsByHost(this.activeIndex);
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
    async loadSupportRequestsByHost(host) {
      if (!host) {
        this.supportRequests = [];
        this.supportRequestCount = 0;
        return;
      }
      this.loadingSupportRequests = true;
      const res = await this.authStore.getUserSupportRequestsByHost(host);
      this.loadingSupportRequests = false;
      if (res.status && Array.isArray(res.data)) {
        this.supportRequests = res.data;
        this.supportRequestCount = res.count || 0;
      } else {
        this.supportRequests = [];
        this.supportRequestCount = 0;
      }
    },
    formatRequestDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
    },
    async loadAssets(force = false) {
      this.loading = true;
      const result = await this.authStore.fetchUserAssets(force);
      await this.authStore.fetchUserVulnerabilityRegister(force);
      if (result.status) {
        this.assets = result.data;
        if (this.assets.length > 0) {
          if (this.$route.query?.asset || this.$route.query?.plugin_name) {
            await this.applyRouteQueryContext();
          } else {
            await this.setActive(this.assets[0]);
          }
        } else {
          this.activeIndex = null;
        }
      }
      this.loading = false;
    },
    async reloadAssetsAndHeld() {
      this.loading = true;
      const result = await this.authStore.fetchUserAssets(true);
      if (result.status) {
        this.assets = result.data;
        if (this.assets.length > 0) {
          if (this.$route.query?.asset || this.$route.query?.plugin_name) {
            await this.applyRouteQueryContext();
          } else {
            await this.setActive(this.assets[0]);
          }
        } else {
          this.activeIndex = null;
        }
      }
      await this.loadHeldAssets();
      this.syncTotalAssets();
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
      this.syncTotalAssets();
    },
    async setActive(asset) {
      if (!asset?.asset) return;
      this.activeIndex = asset.asset;
      this.loadingAssetVulns = true;
      this.expandedVulnIndex = null;
      await this.authStore.fetchUserSingleAssetVulnerabilities(asset.asset);
      this.loadingAssetVulns = false;
      await this.loadSupportRequestsByHost(asset.asset);
      this.loadingClosedFix = true;
      const res = await this.authStore.getUserClosedVulnerabilities(asset.asset);
      this.loadingClosedFix = false;
      if (res.status && res.data?.results) {
        this.closedFixVulnerabilities = res.data.results.filter(v => v.status?.toLowerCase() === 'closed');
      } else {
        this.closedFixVulnerabilities = [];
      }
    },
    openFixPanelAlerts() {
      this.showPythonInstallAlert = true;
      this.showVaptfixVerifiedAlert = true;
    },
    isVulnDownloadDisabled(vuln) {
      return isAutomationNotAvailable(this.selectedAssetIp, this.selectedAssetDemoIndex, vuln?.severity);
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
    viewFixDetail(item) {
      const reportId = this.authStore.userLatestReportId;
      if (!reportId) return;
      this.$router.push({
        name: 'user-remediation-timeline',
        params: { reportId, asset: item.host_name || this.activeIndex },
        query: {
          id: item.fix_vulnerability_id,
          plugin_name: item.plugin_name,
          risk_factor: item.risk_factor,
          description: item.description || '',
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
        case 'medium': return '#f59e0b';
        case 'low': return '#0f696e';
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
      const reportId = this.authStore.userLatestReportId;
      if (!reportId) {
        Swal.fire('Error', 'Report ID not found', 'error');
        return;
      }
      for (const item of selected) {
        await this.authStore.deleteUserAsset(item.asset, reportId);
      }
      await this.reloadAssetsAndHeld();
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
        if (!res.status) continue;
      }
      await this.reloadAssetsAndHeld();
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
    inferExtSeverity() {
      const s = this.selectedAsset?.severity_counts || {};
      if ((s.critical || 0) > 0) return "critical";
      if ((s.high || 0) > 0) return "high";
      if ((s.medium || 0) > 0) return "medium";
      return "low";
    },
    parseExtensionDays(label) {
      const m = String(label || "").trim().toLowerCase().match(/^(\d+)\s*(day|days|week|weeks)$/);
      if (!m) return NaN;
      const n = Number(m[1]);
      const unit = m[2];
      return unit.startsWith("week") ? n * 7 : n;
    },
    async fetchExtPopupOptions(severity, asset) {
      this.extPopupOptionsLoading = true;
      const team = (this.selectedAsset?.assigned_teams && this.selectedAsset.assigned_teams[0]) || undefined;
      const res = await this.authStore.fetchUserMitigationTimelineExtensionOptions(severity, asset || undefined, team);
      this.extPopupOptionsLoading = false;
      if (res.status && res.data) {
        this.extPopupAssetListApi = res.data.assets || [];
        this.extPopupVulListApi = res.data.vulnerabilities || [];
        this.extPopupOriginalDeadlineDays = res.data.original_deadline_days ?? null;
      } else {
        this.extPopupAssetListApi = [];
        this.extPopupVulListApi = [];
        this.extPopupOriginalDeadlineDays = null;
      }
    },
    async openExtPopup() {
      this.extPopupSeverity = this.inferExtSeverity();
      this.extPopupAsset = this.activeIndex || "";
      this.extPopupVulName = "";
      this.extPopupExtension = "";
      this.extPopupReason = "";
      this.extPopupAssetListApi = [];
      this.extPopupVulListApi = [];
      this.extPopupOriginalDeadlineDays = null;
      this.showExtPopup = true;
      await this.fetchExtPopupOptions(this.extPopupSeverity, this.extPopupAsset || null);
    },
    async onExtPopupAssetChange() {
      this.extPopupVulName = "";
      this.extPopupVulListApi = [];
      this.extPopupOriginalDeadlineDays = null;
      if (this.extPopupAsset && this.extPopupSeverity) {
        await this.fetchExtPopupOptions(this.extPopupSeverity, this.extPopupAsset);
      }
    },
    closeExtPopup() {
      this.showExtPopup = false;
      this.extPopupSeverity = "critical";
      this.extPopupAsset = "";
      this.extPopupVulName = "";
      this.extPopupExtension = "";
      this.extPopupReason = "";
      this.extPopupAssetListApi = [];
      this.extPopupVulListApi = [];
      this.extPopupOriginalDeadlineDays = null;
      this.extPopupOptionsLoading = false;
    },
    getVulnAssets(vuln) {
      if (!this.activeIndex) return [];
      return [this.activeIndex];
    },
    setVulnDetailTab(tab) {
      this.currentVulnTab = tab;
    },
    findAssetPage(assetIp) {
      const idx = this.filteredAssets.findIndex(
        a => String(a.asset || '').trim() === String(assetIp || '').trim(),
      );
      if (idx < 0) return null;
      return Math.floor(idx / this.pageSize) + 1;
    },
    expandVulnFromQuery(pluginName, vulnId) {
      const targetName = String(pluginName || '').trim().toLowerCase();
      const targetId = vulnId != null && vulnId !== '' ? String(vulnId) : '';

      const idx = this.filteredVulnerabilities.findIndex(v => {
        if (targetId && (v.id != null || v.vulnerability_id != null)) {
          return String(v.id ?? v.vulnerability_id) === targetId;
        }
        const name = String(v.vul_name || v.vulnerability_name || '').trim().toLowerCase();
        return targetName && name === targetName;
      });

      if (idx < 0) return;

      this.expandedVulnIndex = idx;
      this.$nextTick(() => {
        const refKey = 'vuln-' + idx;
        const element = this.$refs[refKey];
        if (element && element[0]) {
          element[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    },
    async applyRouteQueryContext() {
      const q = this.$route.query || {};
      const assetIp = q.asset || q.assetIp;
      const pluginName = q.plugin_name || q.vul_name;
      const vulnId = q.id;

      if (!assetIp && !pluginName) return;

      this.leftPanelTab = 'assets';
      this.activeTab = q.tab === 'exceptions' ? 'exceptions' : 'vulnerabilities';

      if (assetIp) {
        const page = this.findAssetPage(assetIp);
        if (page) this.currentPage = page;

        const assetRow = this.assets.find(
          a => String(a.asset || '').trim() === String(assetIp).trim(),
        );

        if (assetRow) {
          await this.setActive(assetRow);
          await this.$nextTick();
          if (pluginName || vulnId) {
            this.expandVulnFromQuery(pluginName, vulnId);
          }
        }
      }
    },
    async submitExtPopup() {
      if (!this.extPopupAsset || !this.extPopupVulName || !this.extPopupExtension || !this.extPopupReason.trim()) return;
      const requestedDays = this.parseExtensionDays(this.extPopupExtension);
      if (!Number.isFinite(requestedDays) || requestedDays <= 0) return;

      const payload = {
        severity: this.extPopupSeverity,
        asset: this.extPopupAsset,
        vulnerability_name: this.extPopupVulName,
        requested_extension_days: requestedDays,
        reason: this.extPopupReason.trim(),
        team: (this.selectedAsset?.assigned_teams && this.selectedAsset.assigned_teams[0]) || undefined,
      };
      const res = await this.authStore.submitUserMitigationTimelineExtensionRequest(payload);
      if (res.status) {
        this.closeExtPopup();
        Swal.fire({
          icon: 'success',
          title: 'Request Submitted!',
          text: 'Your timeline extension request has been submitted successfully.',
          timer: 2500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: res.message || 'Failed to submit extension request',
        });
      }
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
        if (!res.status) continue;
      }
      await this.reloadAssetsAndHeld();
      this.showHoldCheckboxes = false;
      this.resetActions();
    },
  },
  watch: {
    leftPanelTab(val, oldVal) {
      if (val === 'vulnerabilities' && oldVal !== 'vulnerabilities') {
        this.openFixPanelAlerts();
      }
    },
    searchQuery() {
      this.currentPage = 1;
    },
    '$route.query': {
      deep: true,
      handler(newQuery, oldQuery) {
        if (this.$route.name !== 'userassets') return;
        const asset = newQuery?.asset;
        const plugin = newQuery?.plugin_name || newQuery?.vul_name;
        if (!asset && !plugin) return;
        if (JSON.stringify(newQuery) === JSON.stringify(oldQuery)) return;
        this.applyRouteQueryContext();
      },
    },
  },
  async mounted() {
    this.openFixPanelAlerts();

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    // Keep behavior consistent with navigation: always fetch fresh on entry.
    await this.loadAssets(true);
    await this.loadHeldAssets();
    this.syncTotalAssets();
  },
  async activated() {
    this.openFixPanelAlerts();
    await this.reloadAssetsAndHeld();
    await this.applyRouteQueryContext();
  },
  beforeUnmount() {
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

/* right-panel-header / scroll — shared rules in main.css (.assets-right-panel) */

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
.ext-tab-btn {
  color: #15803d;
  font-weight: 700;
}

/* Right panel scrollable body */
.right-panel-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 28px 12px;
  background: #f8fafc;
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
.sev-pill-medium   { color: #f59e0b !important; background: #fef3c7 !important; }
.sev-pill-low { color: #10b981; }
.sev-pill-critical.sev-pill-active {
  background: #f8dede !important;
  color: #b42318 !important;
  border-color: #b42318 !important;
}
.sev-pill-high.sev-pill-active {
  background: #fee2e2 !important;
  color: #dc2626 !important;
  border-color: #dc2626 !important;
}
.sev-pill-medium.sev-pill-active {
  background: #fef3c7 !important;
  color: #f59e0b !important;
  border-color: #f59e0b !important;
}
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
.vuln-icon-critical { color: #ba1a1a; }
.vuln-icon-high     { color: #ea580c; }
.vuln-icon-medium   { color: #f59e0b; }
.vuln-icon-low      { color: #10b981; }

.vuln-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
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
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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
  font-weight: 600;
  font-size: 0.8rem;
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

/* Extended Timeline Drawer */
.ext-popup-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 25, 50, 0.38);
  z-index: 2100;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}
.ext-popup-box {
  background: #fff;
  width: 560px;
  max-width: 100vw;
  height: 100%;
  box-shadow: -8px 0 40px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.ext-drawer-accent { height: 5px; width: 100%; flex-shrink: 0; }
.ext-accent-critical { background: linear-gradient(90deg, #c71616, #ef4444); }
.ext-accent-high     { background: linear-gradient(90deg, #d97706, #f59e0b); }
.ext-accent-medium   { background: linear-gradient(90deg, #b45309, #fbbf24); }
.ext-accent-low      { background: linear-gradient(90deg, #0f696e, #14b8a6); }
.ext-popup-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 16px 22px;
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  flex-shrink: 0;
  margin-top: 52px;
}
.ext-header-left { display: flex; align-items: center; gap: 12px; }
.ext-header-icon {
  width: 42px; height: 42px; border-radius: 10px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0; color: #fff;
}
.ext-icon-critical { background: rgba(239,68,68,0.25); border-color: rgba(239,68,68,0.4); color: #fca5a5; }
.ext-icon-high     { background: rgba(245,158,11,0.25); border-color: rgba(245,158,11,0.4); color: #fcd34d; }
.ext-icon-medium   { background: rgba(251,191,36,0.2);  border-color: rgba(251,191,36,0.35); color: #fde68a; }
.ext-icon-low      { background: rgba(20,184,166,0.25); border-color: rgba(20,184,166,0.4); color: #5eead4; }
.ext-popup-title { font-size: 0.85rem; font-weight: 600; color: #fff; margin: 0 0 3px; line-height: 1.2; }
.ext-popup-subtitle { font-size: 0.68rem; color: rgba(255,255,255,0.65); display: flex; align-items: center; gap: 6px; }
.ext-header-close {
  background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2);
  color: #fff; width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer; flex-shrink: 0;
}
.ext-sev-pill {
  display: inline-block; border-radius: 20px; font-size: 0.62rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px;
}
.ext-sev-critical { background: #f8dede; color: #b42318; border: 1px solid #efb7b1; }
.ext-sev-high     { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
.ext-sev-medium   { background: #fef3c7; color: #f59e0b; border: 1px solid #fcd34d; }
.ext-sev-low      { background: #ccfbf1; color: #0f766e; border: 1px solid #5eead4; }
.ext-drawer-divider { height: 1px; background: #e2e8f0; margin: 0; flex-shrink: 0; }
.ext-section-title {
  font-size: 0.62rem; font-weight: 700; color: #94a3b8;
  text-transform: uppercase; letter-spacing: 0.05em;
  display: flex; align-items: center; gap: 6px; margin-bottom: 2px;
}
.ext-info-banner {
  background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 10px 14px; font-size: 0.68rem; color: #64748b;
  display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
}
.ext-select-wrap { position: relative; display: flex; align-items: center; }
.ext-select-icon { position: absolute; left: 11px; color: #94a3b8; font-size: 13px; pointer-events: none; z-index: 1; }
.ext-icon-asset { color: #0f696e; }
.ext-icon-vuln  { color: #7c3aed; }
.ext-popup-select.ext-has-icon { padding-left: 32px; }
.ext-deadline-chip {
  display: flex; align-items: center; gap: 7px; border-radius: 8px;
  padding: 9px 14px; font-size: 0.75rem; font-weight: 600; border: 1px solid #e2e8f0;
}
.ext-deadline-original { background: #f1f5f9; color: #475569; }
.ext-char-hint { font-size: 0.62rem; color: #94a3b8; text-align: right; margin-top: 2px; }
.ext-popup-body { padding: 14px 22px; display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto; background: #f8fafc; }
.ext-popup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ext-popup-field { display: flex; flex-direction: column; gap: 5px; }
.ext-popup-label { font-size: 0.62rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }
.ext-popup-select,
.ext-popup-textarea {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;
  font-size: 0.75rem; color: #1e293b; background: #f8fafc; outline: none; width: 100%;
}
.ext-popup-select:disabled {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: default;
}
.ext-popup-textarea { resize: vertical; min-height: 90px; }
.ext-popup-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 12px 22px 16px; border-top: 1px solid #e2e8f0;
  flex-shrink: 0; background: #fff;
}
.mte-btn-secondary {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #334155;
  border-radius: 999px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}
.mte-btn-primary {
  border: 1px solid #241447;
  background: #241447;
  color: #fff;
  border-radius: 999px;
  padding: 10px 22px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
}
.ext-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* All Vulnerabilities Tab Styles - Imported from AssetsVulnerabilitiesMode */
.av-description-block {
  background: #fff;
  padding: 18px 22px;
  border-bottom: 1px solid #e2e8f0;
}

.vuln-accordion-body .av-description-block {
  padding: 0 0 14px;
  border-bottom: 1px solid #e2e8f0;
  background: transparent;
}

.av-db-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 6px;
}

.av-db-text {
  font-size: 13px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #374151;
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
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
  margin-bottom: 6px;
}

.av-aab-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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

.av-asset-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.av-asset-os-lbl {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #94a3b8;
}

.av-detail-tabs {
  display: flex;
  border-bottom: 2px solid #e2e8f0;
  background: #fff;
  padding: 0 22px;
}

.av-dtab {
  padding: 12px 16px;
  border: none;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 400;
  color: #64748b;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  margin-bottom: -2px;
}

.av-dtab.active {
  color: #000000;
  border-bottom-color: #000000;
}

.av-dtab:hover:not(.active) {
  color: #000000;
  background: #f8fafc;
}

.av-detail-tab-content {
  background: #f8fafc;
  min-height: 0;
  height: auto;
  flex: 0 0 auto;
  padding: 14px 20px 28px;
  box-sizing: border-box;
}

.av-detail-tab-content:has(.av-auto-tab) {
  padding: 14px 20px 28px;
}

.av-detail-tab-content:has(.av-auto-tab) .av-auto-tab,
.av-detail-tab-content:has(.av-manual-tab) .av-manual-tab {
  padding: 0;
  min-height: 0;
  height: auto;
}

.av-detail-tab-content:has(.av-manual-tab),
.av-detail-tab-content:has(.av-affected-tab) {
  padding: 14px 20px 28px;
}

.av-detail-tab-content--manual {
  min-height: 0;
  padding: 14px 20px 28px;
  background: #f8fafc;
  box-sizing: border-box;
}

.av-detail-tab-content--manual .av-manual-tab {
  padding: 0;
  min-height: 0;
  height: auto;
}

.av-detail-tab-content--manual .av-asset-section {
  padding: 0;
  margin-bottom: 0;
}

.av-detail-tab-content--manual .av-asset-section:last-child {
  padding-bottom: 0;
}

.vuln-accordion-body .av-detail-tab-content {
  padding-bottom: 28px !important;
}

.vuln-accordion-body .av-auto-tab {
  padding-bottom: 20px;
}

.av-auto-tab,
.av-manual-tab {
  padding: 0;
  height: auto;
  min-height: 0;
  box-sizing: border-box;
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

/* Code Modal */
.code-modal-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.code-modal-box { background: #fff; border-radius: 12px; width: 90%; max-width: 900px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
.code-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e5e7eb; }
.code-modal-title { font-size: 1rem; font-weight: 600; color: #1f2937; margin: 0; }
.code-modal-close { background: none; border: none; font-size: 1.2rem; color: #6b7280; cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: all 0.2s; }
.code-modal-close:hover { background: #f3f4f6; color: #1f2937; }
.code-modal-body { flex: 1; overflow: auto; padding: 0; position: relative; }
.code-header-badge { position: absolute; top: 12px; right: 12px; background: #1e293b; color: #94a3b8; padding: 4px 10px; border-radius: 4px; font-size: 0.7rem; font-weight: 600; z-index: 1; }
.code-block { background: #1e293b; color: #e2e8f0; padding: 20px; margin: 0; font-family: 'Courier New', Courier, monospace; font-size: 0.85rem; line-height: 1.6; overflow-x: auto; white-space: pre; }
.code-block::-webkit-scrollbar { height: 8px; }
.code-block::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
.code-modal-footer { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
.code-copy-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #0ea5e9; color: #fff; border: none; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.code-copy-btn:hover { background: #0284c7; }
.code-close-btn { padding: 8px 16px; background: #fff; color: #6b7280; border: 1px solid #d1d5db; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.code-close-btn:hover { background: #f9fafb; color: #1f2937; }

/* ─── Support Request Button ─────────────────────────────────────── */
.rt-btn-support { background: #e0f2f1; color: #0f696e; border: 1px solid rgba(15,105,110,0.2); border-radius: 999px; padding: 8px 18px; font-size: 0.84rem; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.rt-btn-support:hover { background: #a1ecf2; }

/* ─── Modal styles ───────────────────────────────────────────────── */
.vc-modal-content  { border-radius: 16px; overflow: hidden; border: none; }
.vc-modal-header   { background: #241447; color: #fff; border-bottom: none; padding: 18px 24px; }
.vc-modal-title    { font-size: 1rem; font-weight: 700; color: #fff; margin: 0; }
.vc-modal-section-label { font-size: 0.82rem; font-weight: 700; color: #241447; text-transform: uppercase; letter-spacing: 0.05em; }
.vc-modal-footer   { border-top: 1px solid #f1f5f9; padding: 14px 24px; display: flex; justify-content: flex-end; gap: 10px; }
.vc-step-pill { display: inline-flex; align-items: center; justify-content: center; padding: 6px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 600; color: #475569; background: #f1f5f9; border: 1.5px solid #e2e8f0; cursor: pointer; transition: all 0.15s; width: 100%; text-align: center; }
.vc-step-pill-active { background: #e0f2f1; color: #0f696e; border-color: #0f696e; }
.vc-textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; font-size: 0.875rem; color: #1e293b; background: #f8f9fc; outline: none; resize: vertical; font-family: inherit; }
.vc-textarea:focus { box-shadow: 0 0 0 2px rgba(15,105,110,0.2); border-color: #0f696e; }
.vc-btn-primary { background: #241447; color: white; border: none; border-radius: 8px; padding: 8px 18px; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
.vc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.vc-btn-secondary { background: white; color: #241447; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 18px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.rt-support-raised-note { font-size: 0.84rem; color: #0f696e; display: flex; align-items: center; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; }
</style>
