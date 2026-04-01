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

          <div class="col-11 pt-5 pb-3 pe-5 mt-4">
            <div class="row">
              <div class="col-4 p-3 border-end px-0">
                <div class="d-flex justify-content-between">
                  <h5 class="mb-0 fw-semibold ms-3" style="font-weight: 500;font-size: 32px;">Assets ({{
                    authStore.assetCount }})</h5>
                  <div class="d-flex flex-row gap-3 me-3 mt-2">
                    <i class="bi bi-trash fs-5" style="cursor: pointer;" data-bs-toggle="tooltip"
                      :class="{ 'text-muted': activeAction !== '' && activeAction !== 'delete' }"
                      @click.stop="handleDeleteClick" title="Remove an asset" role="button"></i>
                    <i class="bi bi-eye-slash fs-5" style="cursor: pointer;" data-bs-toggle="tooltip"
                      :class="{ 'text-muted': activeAction !== '' && activeAction !== 'hold' }"
                      @click.stop="toggleHoldMode" title="Hold mitigation" role="button"></i>
                  </div>

                </div>
                <div class="d-flex justify-content-between align-items-center ms-3">
                  <div class="d-flex gap-2 my-3">
                    <!-- <form>
                      <select class="form-select" style="width: auto; border-radius: 20px; display: inline-block;"  v-model="selectedSeverity" @change="currentPage = 1">
                     
                        <option value="all">All</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </form> -->
                    <!-- <div class="filter-dropdown d-inline">
                     
                      <button class="btn btn-sm py-2 px-3 filter-btn dropdown-toggle"
                        style="border-radius: 20px; border-color: rgba(0, 0, 0, 0.12);" data-bs-toggle="dropdown">
                        <i class="bi bi-funnel me-1"></i>
                        {{ filterLabel }}
                      </button>

                      <div class="dropdown-menu p-3 filter-content" style="min-width: 250px;">
                       
                        <div class="mb-3">
                          <label class="form-label fw-bold">Severity</label>
                          <select class="form-select" v-model="selectedSeverity">
                            <option value="all">All</option>
                            <option value="critical">Critical</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                      
                        <div class="mb-3">
                          <label class="form-label fw-bold">IP Address</label>
                          <input type="text" class="form-control" placeholder="Enter IP address" v-model="ipAddress"
                            @input="formatIP" @keypress="validateIPInput" />
                        </div>
                       
                        <button class="btn btn-primary w-100 btn-sm" @click="applyFilters">
                          Apply Filters
                        </button>
                      </div>
                    </div> -->

                  </div>
                </div>

                <div class="position-relative">
                  <input v-model="query" class="form-control pe-5"  placeholder="Search asset"
                     @input="onSearchInput" />
                  <i v-if="query" class="bi bi-x-circle-fill position-absolute"
                    style="right:12px; top:50%; transform:translateY(-50%); cursor:pointer;" @click="clearSearch"></i>
                </div>

                <!-- Asset List -->
                <div class="asset-list-wrapper">
                  <div class="d-flex flex-column mt-3">
                    <div v-for="(asset, i) in pagedAssets" :key="asset.id || asset.asset || i"
                      class="asset-item border-bottom" :class="{ active: activeIndex === asset.asset }" :style="activeIndex === asset.asset
                        ? 'background: linear-gradient(90deg, #FFFFFF 0%, #F2F2F2 100%);'
                        : ''" @click="setActive(asset)">

                      <div class="d-flex justify-content-between">
                        <div class="d-flex justify-content-start gap-3">

                          <input v-if="showCheckboxes" type="checkbox" v-model="asset.selected"
                            class="form-check-input me-2" />
                          <input v-if="showHoldCheckboxes" type="checkbox" v-model="asset.selected"
                            class="form-check-input me-2" />
                          <div class="fw-semibold" style="color: rgba(0, 0, 0, 0.87); font-size: 22px;">
                            {{ asset.asset }}
                          </div>

                          <div>
                            <span class="d-flex align-items-center badge-critical" v-if="getPrioritySeverity(asset)"
                              :style="{
                                color: getSeverityColor(getPrioritySeverity(asset)),
                                backgroundColor: getSeverityBg(getPrioritySeverity(asset)),
                                padding: '2px 8px',
                                borderRadius: '12px'
                              }">
                              <span class="rounded-circle me-1" :style="{
                                width: '6px',
                                height: '6px',
                                backgroundColor: getSeverityColor(getPrioritySeverity(asset))
                              }"></span>

                              <span>{{ getPrioritySeverity(asset) }}</span>
                            </span>
                          </div>


                        </div>

                        <div class="align-items-end gap-2">
                          <div class="d-flex flex-row">
                            <div>
                              <i class="bi bi-link-45deg me-1"
                                style="color: rgba(0, 0, 0, 0.6); font-size: 20px; vertical-align: -2px"></i>
                            </div>
                            <div>
                              <p v-if="authStore.memberType">
                                {{ authStore.memberType.charAt(0).toUpperCase() + authStore.memberType.slice(1) }}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex align-items-center gap-3 mt-3 mb-2 ms-3">
                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1"
                            style="width:6px;height:6px;background-color:#b31c1c"></span>
                          <span class="text-danger fw-bold">{{ asset.severity_counts.critical }}</span>
                        </span>

                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1"
                            style="width:6px;height:6px;background-color:#f44336"></span>
                          <span class="text-danger fw-bold">{{ asset.severity_counts.high }}</span>
                        </span>

                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1"
                            style="width:6px;height:6px;background-color:#f6b100"></span>
                          <span class="text-warning fw-bold">{{ asset.severity_counts.medium }}</span>
                        </span>

                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1"
                            style="width:6px;height:6px;background-color:#4caf50"></span>
                          <span class="text-success fw-bold">{{ asset.severity_counts.low }}</span>
                        </span>
                      </div>
                    </div>
                  </div>

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

                <!-- delete Modal -->
                <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                        Are you sure you want to delete the selected assets?

                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="cancelDelete">
                          Cancel
                        </button>
                        <button type="button" class="btn btn-danger" @click="confirmDelete" data-bs-dismiss="modal">
                          OK
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- hold mitigation modal -->
                <div class="modal fade" id="holdConfirmModal" tabindex="-1" aria-hidden="true">
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

                <!-- Hold Vulnerabilities List -->
                <div v-if=" heldAssets.length" class=" py-1 px-2 mt-5">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">Mitigation on hold</h4>
                    <i class="bi bi-eye fs-5" @click="toggleUnholdMode" title="Unhold" style="cursor: pointer;"></i>
                  </div>

                  <div class="d-flex flex-column">
                    <div v-for="(held, i) in pagedHeldAssets" :key="(currentPage - 1) * pageSize + i"
                      class="hold-asset border-bottom">
                      <div class="d-flex justify-content-between">
                        <div class="d-flex justify-content-start gap-1">
                          <!-- Checkbox only in unhold mode -->
                          <input v-if="showUnholdCheckboxes" type="checkbox" v-model="held.selected"
                            class="form-check-input me-2" />
                          <div class="fw-semibold text-muted" style="color: rgba(0, 0, 0, 0.87); font-size: 18px;">
                            {{ held.ip }}
                          </div>
                          <!-- <div>
                            <span class="d-flex align-items-center badge-critical ms-2"
                              :style="{ color: getSeverityColor('Critical') }">
                              <span class="rounded-circle me-1" :style="{
                                width: '6px',
                                height: '6px',
                                backgroundColor: getSeverityColor('Critical')
                              }"></span>

                              <span>Critical</span>
                            </span>

                          </div> -->

                          <div v-if="getHeldPrioritySeverity(held)">
                            <span class="d-flex align-items-center badge-critical ms-2" :style="{
                              color: getSeverityColor(getHeldPrioritySeverity(held)),
                              backgroundColor: getSeverityBg(getHeldPrioritySeverity(held)),
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }">
                              <span class="rounded-circle me-1" :style="{
                                width: '6px',
                                height: '6px',
                                backgroundColor: getSeverityColor(getHeldPrioritySeverity(held))
                              }"></span>

                              <span>{{ getHeldPrioritySeverity(held) }}</span>
                            </span>
                          </div>

                        </div>

                        <div class="align-items-end gap-2">
                          <div class="d-flex flex-row">
                            <div>
                              <i class="bi bi-link-45deg me-1"
                                style="color: rgba(0, 0, 0, 0.6); font-size: 20px; vertical-align: -2px"></i>
                            </div>
                            <div>
                              <p class="mb-0" style="text-transform: capitalize;">
                                {{ held.member_type }}
                              </p>

                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Status Row (same as assets) -->

                      <div class="d-flex align-items-center gap-3 mt-3 mb-2 ms-1">
                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1" style="width:6px;height:6px;background:#b31c1c"></span>
                          <span class="text-danger fw-bold">{{ held.severity_counts.critical }}</span>
                        </span>

                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1" style="width:6px;height:6px;background:#f44336"></span>
                          <span class="text-danger fw-bold">{{ held.severity_counts.high }}</span>
                        </span>

                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1" style="width:6px;height:6px;background:#f6b100"></span>
                          <span class="text-warning fw-bold">{{ held.severity_counts.medium }}</span>
                        </span>

                        <span class="d-flex align-items-center">
                          <span class="rounded-circle me-1" style="width:6px;height:6px;background:#4caf50"></span>
                          <span class="text-success fw-bold">{{ held.severity_counts.low }}</span>
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <div class="col-8">
                <div class="row py-3 px-3">
                  <div class="d-flex justify-content-between">
                    <p class="mt-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Vulnerability
                      card</p>
                    <div class="d-flex justify-content-between">
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-start gap-3">
                      <p class="fw-semibold mt-2" style="font-size:18px">
                        {{ authStore.selectedAssetDetail?.asset }}
                      </p>
                      <div>
                        <div class="d-flex flex-row my-2 gap-2">
                          <span class="d-flex align-items-center badge-critical"
                            v-if="authStore.selectedAssetDetail?.severity" :style="{
                              color: getSeverityColor(authStore.selectedAssetDetail.severity),
                              backgroundColor: getSeverityBg(authStore.selectedAssetDetail.severity),
                              padding: '2px 8px',
                              borderRadius: '12px'
                            }">
                            <span class="rounded-circle me-1" :style="{
                              width: '6px',
                              height: '6px',
                              backgroundColor: getSeverityColor(authStore.selectedAssetDetail.severity)
                            }"></span>

                            <span>{{ authStore.selectedAssetDetail.severity }}</span>
                          </span>
                          <span class="d-flex align-items-center badge-open">
                            <span class="rounded-circle me-1"
                              style="width: 6px; height: 6px; background-color: white;"></span>
                            <span>Open</span>
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div class="row px-3 pt-4">
                  <div class="d-flex justify-content-start gap-5">
                    <div class="d-flex flex-column">
                      <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Exposure</p>
                      <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;text-transform: capitalize;">{{
                        authStore.selectedAssetDetail?.exposure }}</p>
                    </div>
                    <!-- <div class="d-flex flex-column">
                            <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Hostname</p>
                            <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">fra-sto-shr-uat-lda-evt-mgr-dbmigration</p>
                        </div> -->
                    <div class="d-flex flex-column">
                      <p class="mb-0" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Owner</p>
                      <!-- <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">
                        tech(Greece)</p> -->
                      <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{
                        authStore.selectedAssetDetail?.owner }}</p>
                    </div>
                  </div>
                </div>

                <div class="row ps-3">
                  <ul class="nav nav-tabs custom-tabs">
                    <li class="nav-item">
                      <button class="nav-link" :class="{ active: activeTab === 'vulnerabilities' }"
                        @click="activeTab = 'vulnerabilities'">
                        Vulnerabilities
                      </button>
                    </li>
                    <li class="nav-item">
                      <button
  class="nav-link"
  :class="{ active: activeTab === 'exceptions' }"
  @click="activeTab = 'exceptions'"
>
  Support Requests
  <span
    v-if="supportRequestCount > 0"
    class="badge rounded-circle bg-danger ms-1"
    style="font-size: 12px; width: 20px; height: 20px;
           display: inline-flex; align-items: center; justify-content: center;"
  >
    {{ supportRequestCount }}
  </span>
</button>

                    </li>
                    <li class="nav-item">
                      <button class="nav-link" disabled
                        style="opacity: 0.5; cursor: not-allowed;">
                        Related
                      </button>
                    </li>
                  </ul>
                  <!-- Tab Content -->
                  <div class="tab-content mt-3">
                    <div v-if="activeTab === 'vulnerabilities'">

                      <div class="d-flex gap-3">
                        <button class="btn btn-pill fw-semibold text-dark"
                          :class="activeSeverity === 'All' ? 'btn-primary active-tab' : 'btn-outline-secondary'"
                          @click="setSeverity('All')">
                          All
                        </button>

                        <button class="btn btn-pill"
                          :class="activeSeverity === 'Critical' ? 'btn-primary active-tab' : 'btn-outline-secondary'"
                          style="color: maroon;" @click="setSeverity('Critical')">
                          Critical
                        </button>

                        <button class="btn btn-pill"
                          :class="activeSeverity === 'High' ? 'btn-primary active-tab' : 'btn-outline-secondary text-danger'"
                          @click="setSeverity('High')">
                          High
                        </button>

                        <button class="btn btn-pill"
                          :class="activeSeverity === 'Medium' ? 'btn-primary active-tab' : 'btn-outline-secondary text-warning'"
                          @click="setSeverity('Medium')">
                          Medium
                        </button>

                        <button class="btn btn-pill"
                          :class="activeSeverity === 'Low' ? 'btn-primary active-tab' : 'btn-outline-secondary text-success'"
                          @click="setSeverity('Low')">
                          Low
                        </button>
                      </div>

                      <div class="accordion border-0" id="accordionExample">
                        <div v-for="(v, i) in filteredVulnerabilities" :key="i"
                          class="accordion-item border-0 border-bottom">
                          <h2 class="accordion-header">
                            <button class="accordion-button border-bottom-0" type="button" data-bs-toggle="collapse"
                              :data-bs-target="'#v' + i" :aria-expanded="i === 0 ? 'true' : 'false'"
                              :class="{ collapsed: i !== 0 }">
                              <div class="d-flex align-items-center w-100">
                                <!-- Number -->
                                <div style="width:40px">
                                  <p
                                    style="background:black;height:30px;width:30px;color:white;border-radius:50%;display:grid;place-items:center;margin:0">
                                    {{ i + 1 }}
                                  </p>
                                </div>

                                <!-- Vulnerability name -->
                                <div class="flex-grow-1 pe-3">
                                  <p style="margin:0;color:rgba(0,0,0,0.87);font-weight:500;font-size:16px;">
                                    {{ v.vul_name }}
                                  </p>
                                </div>

                                <!-- Severity + Status (fixed position) -->
                                <div class="d-flex align-items-center gap-2 me-4">
                                  <span class="d-flex align-items-center justify-content-center badge-critical" :style="{
                                    color: getSeverityColor(v.severity),
                                    backgroundColor: getSeverityBg(v.severity),
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    minWidth: '80px'
                                  }">
                                    <span class="rounded-circle me-1" :style="{
                                      width: '6px',
                                      height: '6px',
                                      backgroundColor: getSeverityColor(v.severity)
                                    }"></span>

                                    <span>{{ v.severity }}</span>
                                  </span>

                                  <span class="d-flex align-items-center justify-content-center badge-open" style="min-width: 70px;">
                                    <span class="rounded-circle me-1"
                                      style="width:6px;height:6px;background-color:white"></span>
                                    <span>Open</span>
                                  </span>
                                </div>
                              </div>
                            </button>
                          </h2>

                          <div :id="'v' + i" class="accordion-collapse collapse" :class="{ show: i === 0 }">
                            <div class="accordion-body border-top-0">
                              <div class="d-flex justify-content-between gap-3">
                                <div class="d-flex justify-content-start gap-2">
                                  <div class="d-flex flex-column" style="width: 400px;">
                                    <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">
                                      Vendor fix available</p>
                                    <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{
                                      v.vendor_fix_available }}</p>
                                  </div>
                                  <div class="d-flex flex-column">
                                    <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">
                                      CVSS Score</p>
                                    <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{
                                      v.cvss_score || '-' }}</p>
                                  </div>
                                </div>
                                <div class="d-flex flex-column">
                                  <!-- <router-link
                                    v-if="authStore.latestReportId"
                                    :to="{
                                      name: 'VulFix',
                                      params: {
                                        reportId: authStore.latestReportId,
                                        asset: authStore.selectedAssetDetail?.asset,
                                      },
                                      query: {
                                        id: getVulRegisterId(v),
                                        plugin_name: v.vul_name,
                                        risk_factor: v.severity
                                      }
                                    }"
                                    class="btn rounded-pill px-3 text-decoration-none"
                                    style="background-color: rgba(49, 33, 177, 1);color: white;"><i
                                      class="bi bi-magic"></i> Fix Now</router-link> -->
                                <router-link
  v-if="authStore.latestReportId"
  :to="{
    name: 'VulFix',
    params: {
      reportId: authStore.latestReportId,
      asset: authStore.selectedAssetDetail?.asset,
    },
    query: {
      id: getVulRegisterId(v),   // 🔥 FIXED HERE
      plugin_name: v.vul_name,
      risk_factor: v.severity
    }
  }"
  class="btn rounded-pill px-3 text-decoration-none"
  style="background-color: rgba(49, 33, 177, 1);color: white;"
>
  <i class="bi bi-magic"></i> Fix Now
</router-link>

                                    </div>

                              </div>
                              <div class="d-flex flex-column">
                                <p class="mb-1" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 12px;">
                                  Description</p>
                                <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">{{ v.description
                                }}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="row mt-3 pt-3 px-3">
                        <div v-if="closedFixVulnerabilities.length" class="card p-2 my-3">
  <h4>Fixed</h4>

  <div
    v-for="(item, i) in closedFixVulnerabilities"
    :key="item.fix_vulnerability_id"
    class="d-flex justify-content-between align-items-center py-2"
  >
    <!-- LEFT -->
    <div class="d-flex align-items-center gap-3">
      <!-- index -->
      <div
        class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
        style="width:30px;height:30px;font-size:14px;"
      >
        {{ i + 1 }}
      </div>

      <!-- name -->
       <p
  class="mb-0 fw-semibold vul-name"
  :title="item.vulnerability_name"
>
  {{ item.vulnerability_name }}
</p>
      <!-- <p class="mb-0 fw-semibold" style="font-size:15px;">
        {{ item.vulnerability_name }}
      </p> -->
    </div>

    <!-- RIGHT -->
    <div class="d-flex align-items-center gap-3">
      <!-- severity -->
<span
  class="badge d-flex align-items-center gap-1"
  :style="{
    background: getSeverityBg(item.severity),
    color: getSeverityColor(item.severity),
    fontSize: '12px'
  }"
>
  <span
    class="rounded-circle"
    :style="{
      width: '6px',
      height: '6px',
      backgroundColor: getSeverityColor(item.severity)
    }"
  ></span>
  {{ item.severity }}
</span>


      <!-- close -->
      <span
        class="badge d-flex align-items-center gap-1"
        style="background:#0a7d00;color:#fff;font-size:12px;"
      >
        <span
          class="rounded-circle"
          style="width:6px;height:6px;background:#fff;"
        ></span>
        Close
      </span>

      <!-- view -->
      <button
        class="btn btn-sm rounded-pill text-light px-3"
        style="background-color: rgba(49, 33, 177, 1);"
        @click="viewFixDetail(item)"
      >
        View detail
      </button>
    </div>
  </div>
                        </div>
                      </div>
                    </div>

                    <!-- Support Requests -->
                    <div v-if="activeTab === 'exceptions'">
                      <div v-if="supportRequestsByHost.length">
    <div v-for="(req, i) in supportRequestsByHost"  :key="req._id" class="d-flex justify-content-between align-items-center py-2 border-bottom">
  <!-- LEFT -->
  <div class="d-flex align-items-center gap-3">

    <!-- index -->
    <div
      class="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
      style="width:30px;height:30px;font-size:14px;"
    >
      {{ i + 1 }}
    </div>

    <!-- name -->
    <div>
      <p class="mb-0 fw-semibold" style="font-size:15px;">
        {{ req.vul_name }}
      </p>
    </div>

    

  </div>

  <!-- RIGHT -->
  <div class="d-flex align-items-center gap-3">
    <!-- severity -->
    <span
      class="badge d-flex align-items-center gap-1"
      style="background:#fdeaea;color:#8b0000;font-size:12px;"
    >
      <span
        class="rounded-circle"
        style="width:6px;height:6px;background:#8b0000;"
      ></span>
      High
    </span>

    <!-- button -->
    <button
      class="btn btn-sm fixes-btn"
      data-bs-toggle="modal"
      data-bs-target="#viewRequestsModal"
      @click="openSupportRequestModal(req)"
    >
      View raised requests
    </button>
  </div>
</div>
</div>
<div v-else class="text-muted py-3">
  No support requests raised for this asset.
</div>
                      <!-- view Requests Modal -->
                      <div class="modal fade" id="viewRequestsModal" tabindex="-1"
                        aria-labelledby="viewRequestsModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">

                            <!-- Modal Header -->
                            <div class="modal-header">
                              <h5 class="modal-title" id="viewRequestsModalLabel">Issues Raised for Support</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                            </div>

                            <!-- Modal Body -->
                            <div class="modal-body">
                              <div v-if="selectedSupportRequest && selectedSupportRequest.step_requested" class="row g-2">
                                <div
    class="col-4"
    v-for="(step, i) in selectedSupportRequest.step_requested.split(',')"
    :key="i"
  >
    <span class="badge rounded-pill w-100 py-2 text-center bg-primary"
      style="font-size:12px;">
      {{ step.trim() }}: Code review
    </span>
  </div>
                              </div>

                              <h6 class="mt-3 fw-semibold">Description</h6>
                              <textarea
  class="form-control rounded-0"
  rows="4"
  :value="selectedSupportRequest?.description || ''"
  readonly
></textarea>
                            </div>

                            <!-- Modal Footer -->
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
                            <button class="accordion-button border-bottom-0" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                              <div class="d-flex justify-content-start align-items-center gap-3">
                                <p
                                  style="background-color: black;height: 30px;width: 30px;color: white;border-radius: 50%;display: grid;place-items: center;">
                                  1</p>
                                <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">CVE-2024-22259 -
                                  org.springframework:spring-web</p>
                                <span class="d-flex align-items-center badge-critical" style="margin-top: -17px;">
                                  <span class="rounded-circle me-1"
                                    style="width: 6px; height: 6px; background-color: rgba(173, 0, 0, 1)"></span>
                                  <span>High</span>
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div id="collapseOne" class="accordion-collapse collapse show border-top-0"
                            aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                            <div class="accordion-body border-top-0">
                              <table class="table table-bordered table-striped">
                                <tbody>
                                  <tr>
                                    <th scope="row">Resource ID</th>
                                    <td>
                                      arn:aws:lambda:eu-central-1:211125372003:function:fra-sto-shr-uat-lda-evt-mgr-dbmigration:$LATEST
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Region</th>
                                    <td>eu-central-1</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Affected Packages</th>
                                    <td>org.springframework:spring-web</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Vendor Advisory</th>
                                    <td><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-22259"
                                        target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2024-22259</a></td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Reference Url</th>
                                    <td>
                                      <ul class="list-unstyled lh-base">
                                        <li><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-22259"
                                            target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2024-22259</a></li>
                                        <li><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-22259"
                                            target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2024-22259</a></li>
                                      </ul>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div class="accordion-item border-0 border-bottom">
                          <h2 class="accordion-header" id="headingTwo">
                            <button class="accordion-button border-bottom-0" type="button" data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                              <div class="d-flex justify-content-start align-items-center gap-3">
                                <p
                                  style="background-color: black;height: 30px;width: 30px;color: white;border-radius: 50%;display: grid;place-items: center;">
                                  2</p>
                                <p style="color: rgba(0, 0, 0, 0.87);font-weight: 500;font-size: 16px;">VMware ESXi
                                  7.0/8.0 Sandbox Escape (CVE - 2025-22226)</p>
                                <span class="d-flex align-items-center badge-critical" style="margin-top: -17px;">
                                  <span class="rounded-circle me-1"
                                    style="width: 6px; height: 6px; background-color: rgba(173, 0, 0, 1)"></span>
                                  <span>High</span>
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div id="collapseTwo" class="accordion-collapse collapse show border-top-0"
                            aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                            <div class="accordion-body border-top-0">
                              <table class="table table-bordered table-striped">
                                <tbody>
                                  <tr>
                                    <th scope="row">Resource ID</th>
                                    <td>
                                      arn:aws:lambda:eu-central-1:211125372003:function:fra-sto-shr-uat-lda-evt-mgr-dbmigration:$LATEST
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Region</th>
                                    <td>eu-central-1</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Affected Packages</th>
                                    <td>org.springframework:spring-web</td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Vendor Advisory</th>
                                    <td><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-22259"
                                        target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2024-22259</a></td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Reference Url</th>
                                    <td>
                                      <ul class="list-unstyled lh-base">
                                        <li><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-22259"
                                            target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2024-22259</a></li>
                                        <li><a href="https://nvd.nist.gov/vuln/detail/CVE-2024-22259"
                                            target="_blank">https://nvd.nist.gov/vuln/detail/CVE-2024-22259</a></li>
                                      </ul>
                                    </td>
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
      // isInternal: true,
      showUnholdCheckboxes: false,
      currentPage: 1,
      pageSize: 5,
      query: "",
      isSearching: false,
      // reportId: localStorage.getItem("reportId"),
      selectedAsset: "",
      activeSeverity: 'All',
      closedFixVulnerabilities: [],   // 👈 ADD
      closedFixCount: 0,
      loadingClosedFix: false
    };
  },
  computed: {
    // filterLabel() {
    //   if (this.selectedSeverity && this.ipAddress) {
    //     return `Filter: ${this.selectedSeverity}, ${this.ipAddress}`;
    //   } else if (this.selectedSeverity) {
    //     return `Filter: ${this.selectedSeverity}`;
    //   } else if (this.ipAddress) {
    //     return `Filter: ${this.ipAddress}`;
    //   }
    //   return "Filter";
    // },
    pagedAssets() {
      const start = (this.currentPage - 1) * this.pageSize;

      // 🔍 STEP 1: filter by search query
      let list = this.authStore.assetRows;

      if (this.query && this.query.trim()) {
        const q = this.query.trim().toLowerCase();

        list = list.filter(a =>
          a.asset.toLowerCase().includes(q)
        );
      }

      // 🔥 STEP 1.5: filter by severity (FIXED)
if (this.selectedSeverity && this.selectedSeverity !== "all") {
  list = list.filter(a => {
    const priority = this.getPrioritySeverity(a);
    return priority?.toLowerCase() === this.selectedSeverity;
  });
}


      // 🔥 STEP 2: sort by severity
      const sorted = [...list].sort((a, b) => {
        return (
          this.getSeverityRank(this.getPrioritySeverity(a)) -
          this.getSeverityRank(this.getPrioritySeverity(b))
        );
      });

      // 📄 STEP 3: paginate
      return sorted.slice(start, start + this.pageSize);
    },
    totalPages() {
  let list = this.authStore.assetRows;

  // 🔍 search filter (existing logic kept)
  if (this.query && this.query.trim()) {
    const q = this.query.trim().toLowerCase();
    list = list.filter(a =>
      a.asset.toLowerCase().includes(q)
    );
  }

  // 🔥 severity filter (ADDED)
  if (this.selectedSeverity && this.selectedSeverity !== "all") {
    list = list.filter(a => {
      // const count = a.severity_counts?.[this.selectedSeverity] || 0;
      // return count > 0;
      const priority = this.getPrioritySeverity(a);
      return priority?.toLowerCase() === this.selectedSeverity;
    });
  }
   return Math.ceil(list.length / this.pageSize);
  // return Math.max(1, Math.ceil(list.length / this.pageSize));
},
    // totalPages() {
    //   const list = this.query
    //     ? this.authStore.assetRows.filter(a =>
    //       a.asset.toLowerCase().includes(this.query.toLowerCase())
    //     )
    //     : this.authStore.assetRows;

    //   return Math.max(1, Math.ceil(list.length / this.pageSize));
    // },
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

      // 🔥 sort by severity priority
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
    // pagedHeldAssets() {
    //   const start = (this.currentPage - 1) * this.pageSize;

    //   const sorted = [...this.heldAssets].sort((a, b) => {
    //     const aSev = this.getHeldPrioritySeverity(a);
    //     const bSev = this.getHeldPrioritySeverity(b);

    //     return this.getSeverityRank(aSev) - this.getSeverityRank(bSev);
    //   });

    //   return sorted.slice(start, start + this.pageSize);
    // },
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

  // return UUID from vulnerability register
  return match?.id || v.id || "";
},
    // getVulRegisterId(v) {
    //   const asset = this.authStore.selectedAssetDetail?.asset;
    //   const match = this.authStore.vulnerabilityRows.find(
    //     row => row.vul_name === v.vul_name && row.asset === asset
    //   );
    //   return match?.id || v.id || '';
    // },
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
      if (sev === "Critical") return "#fdeaea"; // light maroon
      if (sev === "High") return "rgb(246 214 214)";     // light red
      if (sev === "Medium") return "rgb(249 225 193)";   // light orange
      return "rgb(202 233 204)";                         // light green (Low)
    },
    getHeldPrioritySeverity(held) {
      if (!held?.severity_counts) return "";

      if (held.severity_counts.critical > 0) return "Critical";
      if (held.severity_counts.high > 0) return "High";
      if (held.severity_counts.medium > 0) return "Medium";
      if (held.severity_counts.low > 0) return "Low";

      return "";
    },
    // applyFilters() {
    //   console.log("Filters applied:", {
    //     severity: this.selectedSeverity,
    //     ip: this.ipAddress,
    //   });
    // },
    validateIPInput(event) {
      const char = String.fromCharCode(event.which);
      // Allow only digits and dots
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
      // 🔥 NEW: fetch support requests for this asset
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
  // 🔥 NEW: closed fix vulnerabilities
  this.loadingClosedFix = true;

  const reportId = this.authStore.latestReportId;
  if (reportId) {
    const fixRes = await this.authStore.getClosedVulnerabilities(reportId, asset.asset);
    this.loadingClosedFix = false;
    if (fixRes.status && fixRes.data?.results) {

  // 🔥 only keep CLOSED ones
  const closedOnly = fixRes.data.results.filter(
    v => v.status?.toLowerCase() === "closed"
  );

  this.closedFixVulnerabilities = closedOnly;
  this.closedFixCount = closedOnly.length;

} else {
  this.closedFixVulnerabilities = [];
  this.closedFixCount = 0;
}


    // this.closedFixVulnerabilities = fixRes.status && fixRes.data?.results ? fixRes.data.results : [];
    // this.closedFixCount = fixRes.status ? fixRes.data?.count || 0 : 0;
  } else {
    this.loadingClosedFix = false;
    this.closedFixVulnerabilities = [];
    this.closedFixCount = 0;
  }
    },
    toggleHoldMode() {
      // Prevent if delete is already active
      if (this.activeAction === "delete") return;

      // Use store array (matches your template)
      const source = this.authStore.assetRows;

      // Ensure flags exist on each asset
      source.forEach(a => {
        if (typeof a.selected === "undefined") a.selected = false;
        if (typeof a.held === "undefined") a.held = false;
        if (typeof a.isInternal === "undefined") a.isInternal = true; // preserve existing behaviour
      });

      // Mark hold as active
      this.activeAction = "hold";

      // If checkboxes are already shown -> either open confirm modal or reset
      if (this.showHoldCheckboxes) {
        const selectedAssets = source.filter(a => a.selected);
        console.log("[Hold] second click - selected count:", selectedAssets.length);

        if (selectedAssets.length > 0) {
          // Show confirmation modal
          const modalEl = document.getElementById("holdConfirmModal");
          if (modalEl) {
            const modal = new bootstrap.Modal(modalEl);
            modal.show();
            console.log("[Hold] showing holdConfirmModal");
          } else {
            console.warn("[Hold] holdConfirmModal element not found");
          }
        } else {
          // nothing selected -> close checkboxes & reset action
          this.showHoldCheckboxes = false;
          this.resetActions();
          console.log("[Hold] no items selected -> closing hold mode");
        }
        return;
      }

      // First click -> show checkboxes
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
        const res = await this.authStore.holdAsset(
         
          item.asset
        );

        if (res.status && res.heldAsset) {
          const a = res.heldAsset;

          this.heldAssets.push({
            asset: a.asset,
            ip: a.asset,
            // name: a.host_information?.["DNS Name"] || "",
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

      // first click → show checkboxes
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
        const res = await this.authStore.unholdAsset(
          
          item.ip
        );

        if (res.status && res.restoredAsset) {
          const a = res.restoredAsset;

          // ✅ add back to main assets list
          this.authStore.assetRows.unshift({
            asset: a.asset,
            name: a.host_information?.["DNS Name"] || "",
            severity_counts: a.severity_counts,
            host_information: a.host_information,
            isInternal: true,
            held: false,
            selected: false,
          });

          // ✅ remove from held list
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
    // toggleText() {
    //   this.isInternal = !this.isInternal;
    // },
    // toggleExposure(asset) {
    //   asset.isInternal = !asset.isInternal;
    // },
    getPrioritySeverity(asset) {
      const s = asset.severity_counts || {};
      if ((s.critical ?? 0) > 0) return "Critical";
      if ((s.high ?? 0) > 0) return "High";
      if ((s.medium ?? 0) > 0) return "Medium";
      if ((s.low ?? 0) > 0) return "Low";
      return "";
    },

    onSearchInput() {
    // user cleared using native ×
    if (!this.query) {
      this.clearSearch();
      return;
    }

    // optional: live search (WhatsApp style)
    this.authStore.searchAssets(
      
      this.query.trim()
    );
    },
    clearSearch() {
      this.query = "";
      this.authStore.assetSearchResults = [];
      this.authStore.assetSearchCount = 0;

      this.currentPage = 1;
      this.activeIndex = null;

      // open first asset again
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
      status: item.status   // 🔥 ADD THIS
    }
  });
},
  },
  async mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

    // Dropdown code - only run if dropdown element exists in DOM
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

    // Ensure reportId is in localStorage before assets load and trigger setActive.
    // Without this, navigating directly to /assets skips getReportStatus() (normally
    // called from AdminDashboardOnboardingView) and fetchSingleAssetVulnerabilities
    // returns early with { status: false } because reportId is missing.
    if (!localStorage.getItem("reportId")) {
      await this.authStore.getReportStatus();
    }

    this.authStore.fetchAssets();

    // Ensure latestReportId and vulnerabilityRows are available
    if (!this.authStore.latestReportId || !this.authStore.vulnerabilityRows.length) {
      this.authStore.fetchVulnerabilityRegister();
    }

    // Only call loadHeldAssets if fetchHeldAssets method exists in store
    if (typeof this.authStore.fetchHeldAssets === 'function') {
      this.loadHeldAssets();
    }
  },
};
</script>

<style scoped>
.vul-name {
  font-size: 15px;
  max-width: 260px;     /* adjust based on layout */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.asset-list-wrapper {
  display: flex;
  flex-direction: column;
  /* height: 100%; */
  position: relative;
}

.pagination-bottom {
  margin-top: auto;
  padding: 12px 0;
  text-align: center;
  position: sticky;
  bottom: 0;
  background: #fff;
  display: flex;
  justify-content: center;
}

.asset-item {
  padding: 12px 16px;
  position: relative;
  cursor: pointer;
}

.hold-asset {
  padding: 7px 10px;
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
  /* background-color: rgba(255, 225, 225, 1); */
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
  background-color: green;
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
  width: 35px;
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
  /* extra right padding for the arrow */
  cursor: pointer;
  position: relative;
}

.dropdown-btn::after {
  content: "▼";
  /* arrow symbol */
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
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
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
  justify-content: space-around;
  /* equal spacing */
  border-bottom: 1px solid #dee2e6;
  /* grey line */
}

.custom-tabs .nav-item {
  flex: 1;
  /* each tab takes equal width */
  text-align: center;
  /* center text */
}

.custom-tabs .nav-link {
  color: black;
  font-weight: 500;
  /* background: transparent !important; */
  margin-bottom: -10px;
}

.custom-tabs .nav-link.active {
  /* color: rgba(49, 33, 177, 1); */
  /* border: none; */
  /* border-bottom: 2px solid rgba(49, 33, 177, 1);  */
  background-color: rgba(49, 33, 177, 1);
  color: white;
}

.fixes-btn {
  background-color: rgba(49, 33, 177, 1);
  border-radius: 15px;
  color: white;
}

.fixes-red-btn {
  background-color: rgba(170, 0, 0, 1);
  border-radius: 15px;
  color: white;
}
</style>