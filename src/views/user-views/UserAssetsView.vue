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
                  <div class="d-flex align-items-center gap-3 mb-3 flex-wrap">
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
                    <button class="detail-tab" :class="{ 'detail-tab-active': activeTab === 'exceptions' }" @click="onSupportRequestsTabClick">
                      Support Requests
                      <span v-if="supportRequestCount > 0" class="badge rounded-circle bg-danger ms-1"
                        style="font-size:11px;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;">
                        {{ supportRequestCount }}
                      </span>
                    </button>
                    <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">Related Assets</button>
                    <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">History</button>
                    <button class="detail-tab ext-tab-btn" @click="openExtPopup">
                      Extended Timeline
                    </button>
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
                            <span class="vuln-name" :title="vuln.vul_name">{{ vuln.vul_name }}</span>
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
                              <p class="vuln-desc-text">
                                {{ getDisplayDescription(vuln.description, idx) }}
                              </p>
                              <button
                                v-if="(vuln.description || '').length > descriptionPreviewLimit"
                                type="button"
                                class="btn-read-more"
                                @click="toggleDescription(idx)"
                              >
                                {{ isDescriptionExpanded(idx) ? 'Read less' : 'Read more' }}
                              </button>
                            </div>
                            <div class="d-flex gap-3">
                              <router-link
                                v-if="authStore.userLatestReportId && activeIndex"
                                :to="{
                                  name: 'user-remediation-timeline',
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
                          <h4 class="ext-popup-title">Extended Timeline</h4>
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
                          <select class="ext-popup-select ext-has-icon" v-model="extPopupAsset" @change="onExtPopupAssetChange">
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
      supportRequestCount: 0,
      selectedSupportRequest: null,
      expandedDescriptions: {},
      descriptionPreviewLimit: 280,
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
      return this.supportRequests;
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
    syncTotalAssets() {
      this.totalAssets = this.assets.length + this.heldAssets.length;
    },
    async onSupportRequestsTabClick() {
      this.activeTab = "exceptions";
      await this.loadSupportRequestsByHost(this.activeIndex);
    },
    setSeverity(sev) {
      this.activeSeverity = sev;
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
    async loadAssets() {
      this.loading = true;
      const result = await this.authStore.fetchUserAssets();
      if (result.status) {
        this.assets = result.data;
        if (this.assets.length > 0) {
          await this.setActive(this.assets[0]);
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
          await this.setActive(this.assets[0]);
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
      this.authStore.fetchUserSingleAssetVulnerabilities(asset.asset);
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
      } else {
        alert(res.message || "Failed to submit extension request");
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
    searchQuery() {
      this.currentPage = 1;
    },
  },
  async mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    await this.loadAssets();
    await this.loadHeldAssets();
    this.syncTotalAssets();
  },
  beforeUnmount() {
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
  padding: 80px 28px 16px;
  background: #f8f9fc;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(203, 196, 208, 0.2);
}

.asset-detail-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: #241447;
  letter-spacing: -0.02em;
  margin: 0 0 28px 0;
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
.ext-tab-btn {
  color: #15803d;
  font-weight: 700;
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
  max-width: 220px;
  cursor: default;
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

.btn-read-more {
  background: transparent;
  border: none;
  padding: 0;
  color: #0f696e;
  font-size: 0.8rem;
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
.ext-popup-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 3px; line-height: 1.2; }
.ext-popup-subtitle { font-size: 12px; color: rgba(255,255,255,0.65); display: flex; align-items: center; gap: 6px; }
.ext-header-close {
  background: rgba(255,255,255,0.12); border: 1.5px solid rgba(255,255,255,0.2);
  color: #fff; width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer; flex-shrink: 0;
}
.ext-sev-pill {
  display: inline-block; border-radius: 20px; font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em; padding: 2px 8px;
}
.ext-sev-critical { background: #fee2e2; color: #b91c1c; }
.ext-sev-high     { background: #fef3c7; color: #b45309; }
.ext-sev-medium   { background: #fefce8; color: #92400e; }
.ext-sev-low      { background: #ccfbf1; color: #0f766e; }
.ext-drawer-divider { height: 1px; background: #e2e8f0; margin: 0; flex-shrink: 0; }
.ext-section-title {
  font-size: 11px; font-weight: 700; color: #0f696e;
  text-transform: uppercase; letter-spacing: 0.06em;
  display: flex; align-items: center; gap: 6px; margin-bottom: 2px;
}
.ext-info-banner {
  background: #f0fdf9; border: 1px solid #99f6e4; border-radius: 8px;
  padding: 10px 14px; font-size: 12px; color: #0f696e;
  display: flex; align-items: flex-start; gap: 8px; line-height: 1.5;
}
.ext-select-wrap { position: relative; display: flex; align-items: center; }
.ext-select-icon { position: absolute; left: 11px; color: #94a3b8; font-size: 13px; pointer-events: none; z-index: 1; }
.ext-icon-asset { color: #0f696e; }
.ext-icon-vuln  { color: #7c3aed; }
.ext-popup-select.ext-has-icon { padding-left: 32px; }
.ext-deadline-chip {
  display: flex; align-items: center; gap: 7px; border-radius: 8px;
  padding: 9px 14px; font-size: 13px; font-weight: 600; border: 1.5px solid #e2e8f0;
}
.ext-deadline-original { background: #f1f5f9; color: #475569; }
.ext-char-hint { font-size: 11px; color: #94a3b8; text-align: right; margin-top: 2px; }
.ext-popup-body { padding: 14px 22px; display: flex; flex-direction: column; gap: 12px; flex: 1; overflow-y: auto; background: #f8fafc; }
.ext-popup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ext-popup-field { display: flex; flex-direction: column; gap: 5px; }
.ext-popup-label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
.ext-popup-select,
.ext-popup-textarea {
  border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;
  font-size: 13px; color: #1e293b; background: #f8fafc; outline: none; width: 100%;
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
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.mte-btn-primary {
  border: 1px solid #241447;
  background: #241447;
  color: #fff;
  border-radius: 999px;
  padding: 10px 22px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.ext-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
