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

          <div class="col-11 pt-5 mt-2 pb-3 pe-5">
            <div class="row">
                <div class="col-4 p-3 border-end px-0">
                  <div class="d-flex justify-content-between ms-3 pt-3">
                    <h5 class="mb-0 fw-semibold" style="font-weight: 500;font-size: 28px;">Assigned Assets ({{ totalAssets }})</h5>
                    <div class="d-flex flex-row gap-3 me-3 mt-1">
                      <i class="bi bi-trash fs-5" style="cursor: pointer;" data-bs-toggle="tooltip"  :class="{ 'text-muted': activeAction !== '' && activeAction !== 'delete' }" @click="handleDeleteClick" title="Remove an asset"></i>
                      <i class="bi bi-eye-slash fs-5" style="cursor: pointer;" data-bs-toggle="tooltip" :class="{ 'text-muted': activeAction !== '' && activeAction !== 'hold' }"  @click="toggleHoldMode" title="Hold mitigation"></i>
                    </div>
                  </div>

                <div class="mb-4 pe-3 ms-3 mt-3">
                  <form class="d-flex">
                    <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" v-model="searchQuery" style="padding-top: 6px;padding-bottom: 6px;">
                  </form>
                </div>

                <!-- Asset List -->
                <div v-if="loading" class="text-center py-4">
                  <span class="spinner-border text-primary"></span>
                </div>
                <div v-else class="d-flex flex-column gap-3 mt-3">
                  <div
                    v-for="asset in pagedAssets"
                    :key="asset.asset"
                    class="asset-item border-bottom"
                    :class="{ active: activeIndex === asset.asset }"
                    :style="activeIndex === asset.asset ? 'background: linear-gradient(90deg, #FFFFFF 0%, #F2F2F2 100%);' : ''"
                    @click="setActive(asset)"
                  >
                    <div class="d-flex justify-content-between">
                      <div class="d-flex justify-content-start gap-3">
                        <input v-if="showCheckboxes" type="checkbox" v-model="asset.selected" class="form-check-input me-2" />
                        <input v-if="showHoldCheckboxes" type="checkbox" v-model="asset.selected" class="form-check-input me-2" />

                        <div class="fw-semibold" style="color: rgba(0, 0, 0, 0.87); font-size: 22px;">
                          {{ asset.asset }}
                        </div>
                        <div v-if="getTopSeverity(asset.severity_counts)">
                          <span class="d-flex align-items-center badge-critical">
                            <span class="rounded-circle me-1" :style="{ width: '6px', height: '6px', backgroundColor: getSeverityColor(getTopSeverity(asset.severity_counts)) }"></span>
                            <span>{{ getTopSeverity(asset.severity_counts) }}</span>
                          </span>
                        </div>
                      </div>

                      <div class="align-items-end gap-2">
                        <div class="d-flex flex-row">
                          <i class="bi bi-link-45deg me-1" style="color: rgba(0, 0, 0, 0.6); font-size: 20px; vertical-align: -2px"></i>
                          <p class="mb-0">{{ asset.isInternal ? 'Internal' : 'External' }}</p>
                        </div>
                      </div>
                    </div>

                    <!-- Severity counts row -->
                    <div class="d-flex align-items-center gap-3 mt-3 mb-2 ms-3">
                      <span class="d-flex align-items-center">
                        <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                        <span class="text-danger fw-bold">{{ asset.severity_counts?.critical ?? 0 }}</span>
                      </span>
                      <span class="d-flex align-items-center">
                        <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #f44336"></span>
                        <span class="text-danger fw-bold">{{ asset.severity_counts?.high ?? 0 }}</span>
                      </span>
                      <span class="d-flex align-items-center">
                        <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #f6b100"></span>
                        <span class="text-warning fw-bold">{{ asset.severity_counts?.medium ?? 0 }}</span>
                      </span>
                      <span class="d-flex align-items-center">
                        <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #4caf50"></span>
                        <span class="text-success fw-bold">{{ asset.severity_counts?.low ?? 0 }}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <!-- delete Modal -->
                <div
                  class="modal fade"
                  id="deleteModal"
                  tabindex="-1"
                  aria-hidden="true"
                >
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        Are you sure you want to delete the selected assets?  
                        
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal" @click="cancelDelete"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          class="btn btn-danger"
                          @click="confirmDelete"
                          data-bs-dismiss="modal"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- hold mitigation -->
    <div
      class="modal fade"
      id="holdConfirmModal"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <p>Do you want to hold to mitigation?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelHold">
              No
            </button>
            <button class="btn btn-primary" data-bs-dismiss="modal" @click="confirmHold">
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>

                <!-- Pagination -->
                <nav v-if="totalPages > 1" class="mt-4 position-relative custom-pagination-wrapper">
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

                 <!-- Held Vulnerabilities List -->
<div v-if="showHeld && heldAssets.length" class=" py-1 px-2 mt-5">
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Mitigation on hold</h4>
    <i
      class="bi bi-eye fs-5"
      @click="toggleUnholdMode"
      title="Unhold"
      style="cursor: pointer;"
    ></i>
  </div>

  <div class="d-flex flex-column">
    <div
      v-for="(held, i) in heldAssets"
      :key="i"
      class="hold-asset border-bottom">
      <div class="d-flex justify-content-between">
        <div class="d-flex justify-content-start gap-1">
          <!-- Checkbox only in unhold mode -->
          <input
            v-if="showUnholdCheckboxes"
            type="checkbox"
            v-model="held.selected"
            class="form-check-input me-2"
          />

          <!-- Asset Name (grayed if held) -->
          <span :class="{ 'text-muted': held.held }">{{ held.name }}</span>

          <!-- Asset IP -->
          <div
            class="fw-semibold text-muted"
            style="color: rgba(0, 0, 0, 0.87); font-size: 18px;"
          >
            {{ held.asset }}
          </div>

          <!-- Badge -->
          <div>
            <span class="d-flex align-items-center badge-critical ms-2">
              <span
                class="rounded-circle me-1"
                style="width: 6px; height: 6px; background-color: rgba(173, 0, 0, 1)"
              ></span>
              <span>Critical</span>
            </span>
          </div>
        </div>

        <div class="align-items-end gap-2">
          <div class="d-flex flex-row">
            <div>
              <i
                class="bi bi-link-45deg me-1"
                style="color: rgba(0, 0, 0, 0.6); font-size: 20px; vertical-align: -2px"
              ></i>
            </div>
            <div>
              <p class="mb-0">
  {{ held.isInternal ? 'Internal' : 'External' }}
</p>

            </div>
          </div>
        </div>
      </div>

      <!-- Status Row (same as assets) -->
      <div class="d-flex align-items-center gap-3 mt-3 mb-2 ms-1">
        <span class="d-flex align-items-center">
          <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #b31c1c"></span>
          <span class="text-danger fw-bold">{{ held.severity_counts?.critical ?? 0 }}</span>
        </span>
        <span class="d-flex align-items-center">
          <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #f44336"></span>
          <span class="text-danger fw-bold">{{ held.severity_counts?.high ?? 0 }}</span>
        </span>
        <span class="d-flex align-items-center">
          <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #f6b100"></span>
          <span class="text-warning fw-bold">{{ held.severity_counts?.medium ?? 0 }}</span>
        </span>
        <span class="d-flex align-items-center">
          <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: #4caf50"></span>
          <span class="text-success fw-bold">{{ held.severity_counts?.low ?? 0 }}</span>
        </span>
      </div>
    </div>
  </div>
</div>

                </div>

                <div class="col-8">
                    <div class="row py-3 px-3">
                        <div class="d-flex justify-content-between">
                          <p class="mt-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Vulnerability card</p>
                          <div class="d-flex justify-content-between">
                          </div>
                        </div>
                        <div v-if="selectedAsset" class="d-flex justify-content-between">
                            <div class="d-flex justify-content-start gap-3">
                            <div class="fw-semibold" style="color: rgba(0, 0, 0, 0.87);font-size: 22px;">{{ selectedAsset.asset }}</div>
                            <span v-if="getTopSeverity(selectedAsset.severity_counts)" class="d-flex align-items-center badge-critical">
                                <span class="rounded-circle me-1" :style="{ width: '6px', height: '6px', backgroundColor: getSeverityColor(getTopSeverity(selectedAsset.severity_counts)) }"></span>
                                <span>{{ getTopSeverity(selectedAsset.severity_counts) }}</span>
                            </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedAsset" class="row px-3 pt-4">
                    <div class="d-flex justify-content-start gap-5 flex-wrap">
                        <div class="d-flex flex-column">
                            <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Exposure</p>
                            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ selectedAsset.isInternal ? 'Internal' : 'External' }}</p>
                        </div>
                        <div v-if="selectedAsset.host_information?.['Netbios Name']" class="d-flex flex-column">
                            <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Hostname</p>
                            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ selectedAsset.host_information['Netbios Name'] }}</p>
                        </div>
                        <div v-if="selectedAsset.host_information?.['DNS Name']" class="d-flex flex-column">
                            <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">DNS Name</p>
                            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ selectedAsset.host_information['DNS Name'] }}</p>
                        </div>
                        <div v-if="selectedAsset.host_information?.['OS']" class="d-flex flex-column">
                            <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">OS</p>
                            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ selectedAsset.host_information['OS'] }}</p>
                        </div>
                        <div v-if="selectedAsset.assigned_teams?.length" class="d-flex flex-column">
                            <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Teams</p>
                            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ selectedAsset.assigned_teams.join(', ') }}</p>
                        </div>
                    </div>
                    </div>

                    <div class="row ps-3">
                      <ul class="nav nav-tabs custom-tabs">
      <li class="nav-item">
        <button 
          class="nav-link" 
          :class="{ active: activeTab === 'vulnerabilities' }" 
          @click="activeTab = 'vulnerabilities'">
          Vulnerabilities
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: activeTab === 'exceptions' }"
          @click="activeTab = 'exceptions'">
          Support Requests
          <span
            v-if="assetSupportRequests.length > 0"
            class="badge rounded-circle bg-danger ms-1"
            style="font-size: 12px; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center;"
          >{{ assetSupportRequests.length }}</span>
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          disabled
          style="opacity: 0.5; cursor: not-allowed;">
          Related
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content mt-3">
      <!-- Vulnerabilities -->
      <div v-if="activeTab === 'vulnerabilities'">

        <!-- Severity filters -->
        <div class="d-flex gap-3 mb-3">
          <button class="btn btn-pill fw-semibold text-dark"
            :class="activeSeverity === 'All' ? 'btn-primary active-tab' : 'btn-outline-secondary'"
            @click="setSeverity('All')">All</button>
          <button class="btn btn-pill"
            :class="activeSeverity === 'Critical' ? 'btn-primary active-tab' : 'btn-outline-secondary'"
            style="color: maroon;" @click="setSeverity('Critical')">Critical</button>
          <button class="btn btn-pill"
            :class="activeSeverity === 'High' ? 'btn-primary active-tab' : 'btn-outline-secondary text-danger'"
            @click="setSeverity('High')">High</button>
          <button class="btn btn-pill"
            :class="activeSeverity === 'Medium' ? 'btn-primary active-tab' : 'btn-outline-secondary text-warning'"
            @click="setSeverity('Medium')">Medium</button>
          <button class="btn btn-pill"
            :class="activeSeverity === 'Low' ? 'btn-primary active-tab' : 'btn-outline-secondary text-success'"
            @click="setSeverity('Low')">Low</button>
        </div>

        <!-- Empty state -->
        <div v-if="filteredVulnerabilities.length === 0" class="text-center text-muted py-5">
          No vulnerabilities found for this asset.
        </div>

        <!-- Accordion list -->
        <div v-else class="accordion border-0" id="accordionExample">
          <div
            v-for="(vuln, idx) in filteredVulnerabilities"
            :key="idx"
            class="accordion-item border-0 border-bottom"
          >
            <h2 class="accordion-header" :id="'heading' + idx">
              <button
                class="accordion-button border-bottom-0 collapsed"
                type="button"
                data-bs-toggle="collapse"
                :data-bs-target="'#collapse' + idx"
                aria-expanded="false"
                :aria-controls="'collapse' + idx"
              >
                <div class="d-flex justify-content-start align-items-center gap-3">
                  <p class="mb-0" style="background-color: black;height: 30px;width: 30px;color: white;border-radius: 50%;display: grid;place-items: center;flex-shrink:0;">{{ idx + 1 }}</p>
                  <p class="mb-0" style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ vuln.vul_name }}</p>
                  <span class="d-flex align-items-center badge-critical" style="margin-top: 0;" :style="{ color: getSeverityColor(vuln.severity) }">
                    <span class="rounded-circle me-1" :style="{ width: '6px', height: '6px', backgroundColor: getSeverityColor(vuln.severity) }"></span>
                    <span>{{ vuln.severity }}</span>
                  </span>
                  <span
                    class="d-flex align-items-center"
                    :class="vuln.status === 'open' ? 'badge-open' : 'badge-close'"
                    style="margin-top: 0;"
                  >
                    <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: white;"></span>
                    <span>{{ vuln.status }}</span>
                  </span>
                </div>
              </button>
            </h2>
            <div
              :id="'collapse' + idx"
              class="accordion-collapse collapse border-top-0"
              :aria-labelledby="'heading' + idx"
              data-bs-parent="#accordionExample"
            >
              <div class="accordion-body border-top-0">
                <div class="d-flex justify-content-between gap-3">
                  <div class="d-flex justify-content-start gap-5 flex-wrap">
                    <div v-if="vuln.description" class="d-flex flex-column" style="max-width: 400px;">
                      <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">Description</p>
                      <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 15px;">{{ vuln.description }}</p>
                    </div>
                    <div v-if="vuln.cvss_score" class="d-flex flex-column">
                      <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">CVSS Score</p>
                      <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ vuln.cvss_score }}</p>
                    </div>
                    <div v-if="vuln.vendor_fix_available" class="d-flex flex-column">
                      <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">Vendor Fix</p>
                      <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ vuln.vendor_fix_available }}</p>
                    </div>
                    <div v-if="vuln.assigned_team" class="d-flex flex-column">
                      <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">Assigned Team</p>
                      <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ vuln.assigned_team }}</p>
                    </div>
                  </div>
                  <div class="d-flex flex-column">
                    <router-link
                      v-if="authStore.userLatestReportId && activeIndex"
                      :to="{
                        name: 'UserVulFix',
                        params: {
                          reportId: authStore.userLatestReportId,
                          asset: activeIndex,
                        },
                        query: {
                          plugin_name: vuln.vul_name,
                          risk_factor: vuln.severity,
                        }
                      }"
                      class="btn rounded-pill px-3 text-decoration-none"
                      style="background-color: rgba(49, 33, 177, 1);color: white;white-space:nowrap;"
                    >
                      <i class="bi bi-magic"></i> Fix Now
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Fixed / Closed vulnerabilities -->
        <div class="row mt-3 px-1">
          <div v-if="loadingClosedFix" class="text-center py-3">
            <span class="spinner-border spinner-border-sm text-secondary"></span>
          </div>
          <div v-else-if="closedFixVulnerabilities.length" class="card p-3 my-2">
            <h5 class="mb-3">Fixed</h5>
            <div
              v-for="(item, i) in closedFixVulnerabilities"
              :key="item.fix_vulnerability_id"
              class="d-flex justify-content-between align-items-center py-2 border-bottom"
            >
              <div class="d-flex align-items-center gap-3">
                <div class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center" style="width:30px;height:30px;font-size:14px;flex-shrink:0;">
                  {{ i + 1 }}
                </div>
                <p class="mb-0 fw-semibold" style="font-size:15px;">{{ item.plugin_name }}</p>
              </div>
              <div class="d-flex align-items-center gap-3">
                <span class="badge d-flex align-items-center gap-1" :style="{ background: getSeverityColor(item.risk_factor) + '22', color: getSeverityColor(item.risk_factor), fontSize: '12px' }">
                  <span class="rounded-circle" :style="{ width:'6px', height:'6px', backgroundColor: getSeverityColor(item.risk_factor) }"></span>
                  {{ item.risk_factor }}
                </span>
                <span class="badge d-flex align-items-center gap-1" style="background:#0a7d00;color:#fff;font-size:12px;">
                  <span class="rounded-circle" style="width:6px;height:6px;background:#fff;"></span>
                  Close
                </span>
                <button class="btn btn-sm rounded-pill text-light px-3" style="background-color: rgba(49,33,177,1);" @click="viewFixDetail(item)">
                  View detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Support Requests Tab -->
      <div v-if="activeTab === 'exceptions'">
        <div v-if="loadingSupportRequests" class="text-center py-4">
          <span class="spinner-border spinner-border-sm text-primary"></span>
        </div>
        <div v-else-if="assetSupportRequests.length === 0" class="text-center text-muted py-4">
          No support requests for this asset.
        </div>
        <div v-else>
          <div
            v-for="(req, idx) in assetSupportRequests"
            :key="req._id"
            class="d-flex justify-content-between align-items-center gap-3 py-2 border-bottom"
          >
            <p class="mb-0 flex-shrink-0" style="background-color: black; height: 30px; width: 30px; color: white; border-radius: 50%; display: grid; place-items: center;">{{ idx + 1 }}</p>
            <p class="mb-0 flex-grow-1 text-truncate" style="color: rgba(0,0,0,0.87); font-weight: 500; font-size: 15px;" :title="req.vul_name">{{ req.vul_name }}</p>
            <span
              class="badge rounded-pill px-3 py-2 flex-shrink-0"
              :class="req.status === 'open' ? 'bg-danger' : 'bg-success'"
              style="font-size: 12px; text-transform: capitalize;"
            >{{ req.status }}</span>
            <button
              class="btn btn-sm fixes-btn flex-shrink-0"
              data-bs-toggle="modal"
              data-bs-target="#userSupportRequestModal"
              @click="selectedSupportRequest = req"
            >View raised requests</button>
          </div>
        </div>

        <!-- Support Request Detail Modal -->
        <div class="modal fade" id="userSupportRequestModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Issues Raised for Support</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" v-if="selectedSupportRequest">
                <p class="mb-1 text-muted" style="font-size: 13px;">Vulnerability</p>
                <p class="fw-semibold mb-3" style="font-size: 15px;">{{ selectedSupportRequest.vul_name }}</p>

                <p class="mb-1 fw-semibold">Steps Requested</p>
                <div class="row g-2 mb-3">
                  <template v-if="selectedSupportRequest.step_requested === 'all'">
                    <div class="col-auto">
                      <span class="badge rounded-pill bg-primary py-2 px-3" style="font-size: 12px;">All Steps</span>
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-for="step in selectedSupportRequest.step_requested.split(',')"
                      :key="step"
                      class="col-auto"
                    >
                      <span class="badge rounded-pill bg-primary py-2 px-3" style="font-size: 12px;">Step {{ step.trim() }}</span>
                    </div>
                  </template>
                </div>

                <p class="mb-1 fw-semibold">Description</p>
                <textarea class="form-control rounded-0 mb-3" rows="4" readonly>{{ selectedSupportRequest.description }}</textarea>

                <div class="d-flex gap-4">
                  <div>
                    <p class="mb-0 text-muted" style="font-size: 12px;">Requested by</p>
                    <p class="mb-0 fw-semibold" style="font-size: 14px;">{{ selectedSupportRequest.requested_by }}</p>
                  </div>
                  <div>
                    <p class="mb-0 text-muted" style="font-size: 12px;">Date</p>
                    <p class="mb-0 fw-semibold" style="font-size: 14px;">{{ formatRequestDate(selectedSupportRequest.requested_at) }}</p>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related -->
      <div v-if="activeTab === 'related'">
        <div class="accordion border-0" id="accordionExample">
          <div class="accordion-item border-0 border-bottom">
            <h2 class="accordion-header" id="headingOne">
            <button class="accordion-button border-bottom-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            <div class="d-flex justify-content-start align-items-center gap-3">
            <p style="background-color: black;height: 30px;width: 30px;color: white;border-radius: 50%;display: grid;place-items: center;">1</p>
            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">VMware ESXi 7.0/8.0 Sandbox Escape (CVE - 2025-22225)</p>
            <span class="d-flex align-items-center badge-critical" style="margin-top: -17px;">
            <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: rgba(173, 0, 0, 1)"></span>
              <span>High</span>
            </span>
          </div> 
            </button>
            </h2>
            <div id="collapseOne" class="accordion-collapse collapse show border-top-0" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
            <div class="accordion-body border-top-0">
              <table class="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Resource ID</th>
                      <td>arn:aws:ecr:ap-southeast-1:058264139340:repository/...</td>
                    </tr>
                    <tr>
                      <th scope="row">Region</th>
                      <td>ap-southeast-1</td>
                    </tr>
                    <tr>
                      <th scope="row">Affected Packages</th>
                      <td>org.apache.tomcat.embed:tomcat-embed-core</td>
                    </tr>
                    <tr>
                      <th scope="row">Vendor Advisory</th>
                      <td><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-52316" target="_blank">CVE-2024-52316</a></td>
                    </tr>
                    <tr>
                      <th scope="row">Reference Link</th>
                      <td><a href="https://autohub-demo/link123" target="_blank">https://autohub-demo/link123</a></td>
                    </tr>
                  </tbody>
                </table>  
              </div>
            </div>
          </div>
          <div class="accordion-item border-0 border-bottom">
            <h2 class="accordion-header" id="headingTwo">
            <button class="accordion-button border-bottom-0" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
            <div class="d-flex justify-content-start align-items-center gap-3">
            <p style="background-color: black;height: 30px;width: 30px;color: white;border-radius: 50%;display: grid;place-items: center;">2</p>
            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">VMware ESXi 7.0/8.0 Sandbox Escape (CVE - 2025-22226)</p>
            <span class="d-flex align-items-center badge-critical" style="margin-top: -17px;">
            <span class="rounded-circle me-1" style="width: 6px; height: 6px; background-color: rgba(173, 0, 0, 1)"></span>
              <span>High</span>
            </span>
          </div> 
            </button>
            </h2>
            <div id="collapseTwo" class="accordion-collapse collapse show border-top-0" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
            <div class="accordion-body border-top-0">
              <table class="table table-bordered table-striped">
                  <tbody>
                    <tr>
                      <th scope="row">Resource ID</th>
                      <td>arn:aws:ecr:ap-southeast-1:058264139340:repository/...</td>
                    </tr>
                    <tr>
                      <th scope="row">Region</th>
                      <td>ap-southeast-1</td>
                    </tr>
                    <tr>
                      <th scope="row">Affected Packages</th>
                      <td>org.apache.tomcat.embed:tomcat-embed-core</td>
                    </tr>
                    <tr>
                      <th scope="row">Vendor Advisory</th>
                      <td><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-52316" target="_blank">CVE-2024-52316</a></td>
                    </tr>
                    <tr>
                      <th scope="row">Reference Link</th>
                      <td><a href="https://autohub-demo/link123" target="_blank">https://autohub-demo/link123</a></td>
                    </tr>
                  </tbody>
                </table>
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
      const vulns = this.authStore.selectedAssetVulnerabilities;
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
  .hold-asset {
    padding: 7px 10px;
    position: relative;
  }
  .asset-item {
    padding: 12px 16px;
    position: relative;
  }

  .asset-item.active::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0px;
    width: 3px;
    height: 100%;
    background-color: #3f37c9; 
  }

  .badge-critical {
    background-color: rgba(255, 225, 225, 1);
    color: rgba(173, 0, 0, 1);
    font-weight: 600;
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: 8px;
  }

  .badge-open {
    background-color: rgb(194, 60, 60);
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: 8px;
  }

  .badge-close {
    background-color:green;
    color: white;
    font-weight: 600;
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: 8px;
  }

  .view-link {
    font-size: 0.85rem;
    color: #3f37c9;
    font-weight: 500;
    text-decoration: none;
  }

  .view-link:hover {
    text-decoration: underline;
  }

  .custom-pagination .page-link {
  color: rgba(49, 33, 177, 1);
  background-color: transparent;
  border: none;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 50%;
  margin: 0 8px;
}

.custom-pagination .page-item.active .page-link {
  background-color: rgba(49, 33, 177, 1);
  color: white;
  height: 35px;
  width:35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}

.custom-pagination-wrapper {
  display: inline-block;
  position: relative;
  padding-right: 10px;
}

.tab-wrapper {
        position: relative;
        border-bottom: 1px solid #e0e0e0;
    }

    .tab-line {
        position: absolute;
        bottom: 0;
        height: 2px;
        background-color: rgba(49, 33, 177, 1); /* Active blue color */
        transition: all 0.3s ease;
    }

    .nav-item {
        text-align: center;
        cursor: pointer;
        padding: 8px 0;
        color: black;
        font-weight: 500;
        position: relative;
        z-index: 1;
    }

    .nav-item i {
        margin-right: 5px;
    }
.btn-pill {
    border-radius: 50px;
    padding: 6px 20px;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    height: 36px;
}

.active-tab {
    background-color: #E6E3FF;
    color: #3121B1;
    border: none;
    font-size: 13px;
}

.btn-outline-secondary:hover {
    background-color: transparent;
}
.accordion-button:not(.collapsed) {
    background-color: white;
}
.accordion-button:focus {
    box-shadow: none;
}
.accordion {
     --bs-accordion-border-color: none;
     --bs-accordion-body-padding-y: 0;
}

.dropdown {
    position: relative;
    display: inline-block;
    width: 200px;
}

.dropdown-btn {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 50px;
    padding: 8px 20px 8px 12px;
    cursor: pointer;
    position: relative;
}

.dropdown-btn::after {
    content: "▼"; /* arrow symbol */
    font-size: 12px;
    color: #333;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 100%;
    border-radius: 12px;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
    z-index: 1;
    margin-top: 4px;
}

.dropdown-content a {
    padding: 8px 12px;
    display: block;
    text-decoration: none;
    color: black;
    border-radius: 8px;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown.show .dropdown-content {
    display: block;
}
.custom-tabs {
  display: flex;
  justify-content: space-around; /* equal spacing */
  border-bottom: 1px solid #dee2e6; /* grey line */
}

.custom-tabs .nav-item {
  flex: 1; /* each tab takes equal width */
  text-align: center; /* center text */
}

.custom-tabs .nav-link {
  color: black;
  font-weight: 500;
  background: transparent !important;
  margin-bottom: -10px;
}

.custom-tabs .nav-link.active {
  color: rgba(49, 33, 177, 1);
  border: none;
  border-bottom: 2px solid rgba(49, 33, 177, 1); 
}
.fixes-btn {
    background-color:rgba(49, 33, 177, 1);
    border-radius: 15px;
    color: white;
}
</style>