<template>
  <main>
    <section>
    
      <div class="container-fluid">
        <div class="row">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1">
            <DashboardMenu />
          </div>

          <div class="col-11 pt-5 pb-3 pe-4 flex-grow-1 position-relative">
            <!-- Testing overlay is now created via DOM manipulation in initTestingOverlay() -->

            <div class="d-flex flex-row align-items-center justify-content-between py-3">
              <div class="d-flex flex-row gap-2">
                <h2>Vulnerability Management Program</h2>
                  <div>
                    <!-- Calendar Button -->
                    <button class="btn border-0" @click="toggleCalendar">
                      <i class="bi bi-calendar3 fs-4"></i>
                    </button>

                    <!-- Outside-click backdrop -->
                    <div
                      v-if="showCalendar"
                      style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999;"
                      @click="showCalendar = false; showMonthPicker = false; showYearPicker = false;"
                    ></div>

                    <div
                      v-if="showCalendar"
                      class="calendar border rounded p-3 shadow"
                      style="width: 320px; position: absolute; background: #fff; z-index: 1000;"
                      @click.stop
                    >
                      <!-- Header: prev | month year | next -->
                      <div class="d-flex justify-content-between align-items-center mb-2 position-relative">
                        <button class="btn btn-sm btn-light" @click="prevMonth">&lt;</button>
                        <h6 class="mb-0 d-flex gap-2">
                          <span
                            style="cursor:pointer; text-decoration:underline dotted;"
                            @click="showMonthPicker = !showMonthPicker; showYearPicker = false;"
                          >{{ currentMonthName }}</span>
                          <span
                            style="cursor:pointer; text-decoration:underline dotted;"
                            @click="showYearPicker = !showYearPicker; showMonthPicker = false;"
                          >{{ currentYear }}</span>
                        </h6>
                        <button class="btn btn-sm btn-light" @click="nextMonth">&gt;</button>

                        <!-- Month Picker -->
                        <div
                          v-if="showMonthPicker"
                          class="position-absolute bg-white border rounded shadow p-2"
                          style="top:100%; left:50%; transform:translateX(-50%); z-index:1100; width:200px;"
                        >
                          <div class="d-grid" style="grid-template-columns: repeat(3, 1fr); gap: 4px;">
                            <button
                              v-for="(mName, mIdx) in monthNames"
                              :key="mIdx"
                              class="btn btn-sm"
                              :class="mIdx === currentDate.getMonth() ? 'btn-primary' : 'btn-light'"
                              @click="selectMonth(mIdx)"
                            >{{ mName.slice(0,3) }}</button>
                          </div>
                        </div>

                        <!-- Year Picker -->
                        <div
                          v-if="showYearPicker"
                          class="position-absolute bg-white border rounded shadow p-2"
                          style="top:100%; left:50%; transform:translateX(-50%); z-index:1100; width:200px;"
                        >
                          <div class="d-grid" style="grid-template-columns: repeat(3, 1fr); gap: 4px;">
                            <button
                              v-for="y in yearRange"
                              :key="y"
                              class="btn btn-sm"
                              :class="y === currentYear ? 'btn-primary' : 'btn-light'"
                              @click="selectYear(y)"
                            >{{ y }}</button>
                          </div>
                        </div>
                      </div>

                      <!-- Weekday headers -->
                      <div class="d-grid text-center fw-bold" style="grid-template-columns: repeat(7, 1fr);">
                        <div v-for="day in weekDays" :key="day">{{ day }}</div>
                      </div>

                      <!-- Calendar days -->
                      <div v-if="calendarLoading" class="text-center py-3 text-muted small">Loading...</div>
                      <div v-else-if="calendarError" class="text-center py-3 text-danger small">{{ calendarErrorMessage || 'Failed to load calendar data.' }}</div>
                      <div
                        v-else
                        class="d-grid text-center"
                        style="grid-template-columns: repeat(7, 1fr); gap: 3px;"
                      >
                        <div v-for="n in firstDayOfMonth" :key="'empty-' + n"></div>
                        <div
                          v-for="date in daysInMonth"
                          :key="date"
                          class="p-2 border rounded"
                          :class="getSeverityClass(date)"
                          style="cursor: pointer;"
                          @click="handleDateClick(date)"
                        >
                          {{ date }}
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              
              <div class="d-flex flex-row gap-3 mt-3">
                <div>
                <button class="btn fw-semibold px-3 py-2" style="border-radius: 20px;border: 1px solid rgba(0, 0, 0, 0.12);color: rgba(49, 33, 177, 1);" @click="$router.push('/viewreport')"><i class="bi bi-eye me-2"></i> View Report</button>
                </div>

                </div>
            </div>

            <div class="row">
              <div class="col-3">
                <router-link to="/assets" class="text-decoration-none">
                  <div class="card pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Total assets<span class="info-tooltip" data-tooltip="Total number of assets currently registered and monitored within the platform."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <!-- <h1 class="text-212">212</h1> -->
                      <h1 class="text-212">
                        {{ authStore.totalAssets }}
                      </h1>
                    <!-- <p style="margin-top: 37px;">Avg. score: <span class="fw-bold">7.8</span></p> -->
                    <!-- <p style="margin-top: 37px;">
                      Avg. score:<span class="fw-bold">
                        {{ authStore.avgScore }}</span>
                    </p> -->
                    <p style="margin-top: 37px;">
                      Avg. score:<span class="fw-bold">
                        {{ Number(authStore.avgScore).toFixed(2) }}</span>
                    </p>
                  </div>
                  </div>
                </router-link>
              </div>
              <div class="col-9 gx-5">
                <!-- Vulnerabilities -->
                <div class="row px-3 pb-3"
                  style="border: 1px solid rgba(217, 217, 217, 1);border-radius: 5px;padding-top: 15px;">
                  <div class="col-md-5">
                    <div class="d-flex flex-row justify-content-start gap-2">
                      <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                      </div>
                      <p class="assets-para">Vulnerabilities<span class="info-tooltip" data-tooltip="Total number of identified vulnerabilities across all assets, categorized by severity levels: Critical, High, Medium, and Low."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                    </div>
                    <div class="d-flex justify-content-center align-items-end mb-1">
                      <div class="text-center">
                        <!-- <div id="highAge" class="fs-5 fw-semibold">87</div> -->
                      <div id="highAge" class="fs-5 fw-semibold">
                        {{ authStore.vulnerabilities.critical }}
                      </div>
                        <div class="bar maroon vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: maroon;">● Critical</small>
                      </div>
                      <div class="text-center">
                        <!-- <div id="highAge" class="fs-5 fw-semibold">56</div> -->
                        <div id="highAge" class="fs-5 fw-semibold">
                          {{ authStore.vulnerabilities.high }}
                        </div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● High</small>
                      </div>
                      <div class="text-center">
                        <!-- <div id="mediumAge" class="fs-5 fw-semibold">127</div> -->
                        <div id="mediumAge" class="fs-5 fw-semibold">
                          {{ authStore.vulnerabilities.medium }}
                        </div>
                        <div class="bar yellow vul-bar mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium</small>
                      </div>
                      <div class="text-center">
                        <!-- <div id="lowAge" class="fs-5 fw-semibold">42</div> -->
                        <div id="lowAge" class="fs-5 fw-semibold">
                          {{ authStore.vulnerabilities.low }}
                        </div>
                        <div class="bar green vul-bar mt-1"></div>
                        <small class="text-success mt-1 d-block">● Low</small>
                      </div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="col-md-1 d-flex justify-content-center">
                    <div class="divider-vertical"></div>
                  </div>

                  <!-- Vulnerability aging -->
                  <div class="col-md-6">
                    <div class="mb-2">
                      <p class="assets-para">Mitigation Timeline<span class="info-tooltip" data-tooltip="Displays the remaining remediation time for vulnerabilities based on the defined risk criteria."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                    </div>
                    
                  
                    <div class="d-flex justify-content-between align-items-end mb-1">
  <div class="text-center">
    <div class="fs-5 fw-semibold">
      {{ formatTimeline(authStore.mitigationTimeline?.critical) }}
    </div>
    <div class="bar maroon w-100 mt-1"></div>
    <small style="color: maroon;">● Critical</small>
  </div>

  <div class="text-center">
    <div class="fs-5 fw-semibold">
      {{ formatTimeline(authStore.mitigationTimeline?.high) }}
    </div>
    <div class="bar red w-100 mt-1"></div>
    <small style="color: red;">● High</small>
  </div>

  <div class="text-center">
    <div class="fs-5 fw-semibold">
      {{ formatTimeline(authStore.mitigationTimeline?.medium) }}
    </div>
    <div class="bar yellow w-100 mt-1"></div>
    <small class="text-warning">● Medium</small>
  </div>

  <div class="text-center">
    <div class="fs-5 fw-semibold">
      {{ formatTimeline(authStore.mitigationTimeline?.low) }}
    </div>
    <div class="bar green w-100 mt-1"></div>
    <small class="text-success">● Low</small>
  </div>
</div>

                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-5">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Total Vulnerabilities Fixed<span class="info-tooltip" data-tooltip="Total count of vulnerabilities that have been successfully remediated and verified as resolved within the system."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-5 ps-3">
                    <h1 class="text-78">{{ String(vulFixedTotal).padStart(2, '0') }}</h1>
                    <div class="d-flex justify-content-center align-items-end mb-1">
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulFixedCritical }}</div>
                        <div class="bar maroon vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: maroon;">● Critical<br> fixed</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulFixedHigh }}</div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● High <br> fixed</small>
                      </div>

                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulFixedMedium }}</div>
                        <div class="bar yellow vul-bar mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium<br> fixed</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulFixedLow }}</div>
                        <div class="bar green vul-bar mt-1"></div>
                        <small class="text-success mt-1 d-block">● Low<br> fixed</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Mean time to remediate<span class="info-tooltip" data-tooltip="Represents the average remediation time calculated based on the risk criteria defined for different vulnerability severity levels."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                  </div>
                  <div class="d-flex flex-row justify-content-center gap-2 py-3">  
                <h1 class="">{{ meanRemediateHuman }}</h1>
                  </div>
                </div>
              </div>
              <div class="col-4">
                <router-link to="/supportrequests" class="text-decoration-none">
                  <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Support Requests<span class="info-tooltip" data-tooltip="Total number of support requests raised or tickets raised in the system, categorized by their current status such as Pending or Closed."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                  </div>
                  <div class="d-flex flex-row gap-5 py-3">
                    <h1 class="text-78">{{ String(supportTotal).padStart(2, '0') }}</h1>
                    <div class="d-flex justify-content-center align-items-end mb-1">
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ supportPending }}</div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● Pending</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ supportClosed }}</div>
                        <div class="bar light-green vul-bar mt-1" style="color: blue;"></div>
                        <small class="mt-1 d-block" style="color: rgb(71, 199, 71);">● Closed</small>
                      </div>
                    </div>
                  </div>
                </div>
                </router-link>
              </div>
              
            </div>

            <div class="row mt-3">
                <div class="col-12">
                <div class="card pb-2 pt-3 px-3">
                  <div class="d-flex flex-row align-items-center justify-content-between py-3">
                    <h4 class="fw-semibold">Mitigation Strategy</h4>
              <router-link to="/supportrequests" class="btn pending-approval-btn rounded-pill text-decoration-none">{{ supportPending }} Support requests ongoing
                <i class="bi bi-arrow-right ms-1 fs-5"></i></router-link>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12">
                      <div class="d-flex gap-3">
                        <button
                          v-for="tab in mitigationTabs"
                          :key="tab.key"
                          class="btn btn-pill fw-semibold"
                          :class="mitigationActiveTab === tab.key ? 'btn-primary active-tab' : 'btn-outline-secondary other-btn'"
                          @click="setMitigationTab(tab.key)"
                        >
                          {{ tab.label }}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="row  my-4">
                    <div class="d-flex justify-content-between">
                        <div class="mt-2 d-flex align-items-center">
                          <span style="color: rgba(0, 0, 0, 0.87);">
                            Assigned to {{ mitigationActiveTab }} team
                          </span>
                        </div>
                    </div>

                    <div class="d-flex gap-4 my-3">
                      
                      <div class="d-flex flex-column gap-2">
                        <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100" style="color: maroon;">Critical</button>
                        <button class="btn patch-btn rounded-pill text-nowrap d-flex align-items-center justify-content-center w-100">
                          {{ riskCriteria.critical ?? '—' }} 
                          <i class="bi bi-plus-circle text-danger ms-2" style="cursor:pointer;" @click.stop="openModal('critical')"></i>
                        </button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-danger">High</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.high ?? '—' }}  <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click.stop="openModal('high')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-warning">Medium</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.medium ?? '—' }} <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click.stop="openModal('medium')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-success">Low</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.low ?? '—' }}  <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click.stop="openModal('low')"></i></button>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-5">
                    <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                      <p style="font-weight: 600;" class="mb-0">
                        Vulnerabilities ({{ uniqueMitigationVulns.length }})
                      </p>
                      <router-link :to="{ path: '/missingsecurityupdates', query: { team: mitigationActiveTab } }">
                        <button class="btn border-0" style="color: rgba(49, 33, 177, 1); font-weight: 600;">More details <i class="bi bi-arrow-right"></i></button>
                      </router-link>
                    </div>

                    <div v-if="mitigationLoading" class="py-3 text-center text-muted">Loading...</div>
                    <div v-else-if="uniqueMitigationVulns.length === 0" class="py-3 text-muted">
                      No vulnerabilities assigned to this team.
                    </div>
                    <div v-else class="row align-items-stretch">
                        <div
                          v-for="vuln in uniqueMitigationVulns.slice(0, 4)"
                          :key="vuln.plugin_name"
                          class="col-3 d-flex"
                        >
                          <div class="card py-4 px-3 w-100 d-flex flex-column" style="border-radius: 12px;">
                            <div class="d-flex justify-content-between">
                              <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">
                                <i class="bi bi-hdd-network me-1"></i>{{ vulnAssetCountMap[vuln.plugin_name] ?? 1 }} assets
                              </p>
                              <span :style="{ color: getMitigationRiskColor(vuln.risk_factor), fontSize: '12px', fontWeight: '600' }">
                                {{ vuln.risk_factor }}
                              </span>
                            </div>
                            <h4 class="truncated-text" :title="vuln.plugin_name">
                              {{ vuln.plugin_name }}
                            </h4>
                            <div class="d-flex justify-content-start mt-2">
                              <i class="bi bi-hdd-network me-2"></i>
                              <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 14px;margin-top: 2px">
                                {{ vulnAssetCountMap[vuln.plugin_name] ?? 1 }} affected asset{{ (vulnAssetCountMap[vuln.plugin_name] ?? 1) !== 1 ? 's' : '' }}
                              </h6>
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

      <!-- Update Risk Criteria Modal -->
      <div v-if="showModal" class="custom-modal-backdrop">
        <div class="custom-modal-box" @click.stop>
          <h5 class="mb-3">Update Days — {{ modalSeverityLabel }}</h5>
          <div class="mb-3">
            <label class="form-label">Days</label>
            <input type="text" class="form-control" style="border-radius: 10px;" v-model="modalDays" placeholder="e.g. day 1, 3 days, 1 week">
          </div>
          <div class="mb-3">
            <label class="form-label">Reason</label>
            <textarea class="form-control" style="border-radius: 10px;" rows="2" v-model="modalReason"></textarea>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button class="btn btn-primary" :disabled="riskUpdating" @click="submitRiskCriteria">
              {{ riskUpdating ? 'Saving...' : 'Submit' }}
            </button>
          </div>
        </div>
      </div>

    </section>
  </main>
</template>

<script>
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import Chart from 'chart.js/auto';

export default {
  name: 'AdminDashboardOnboardingView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      testingActive: false,
      remainingSeconds: 20,
      progressPercent: 100,
      testingTimer: null,
      showCalendar: false,
      currentDate: new Date(),
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarDayData: {},
      calendarLoading: false,
      calendarError: false,
      calendarErrorMessage: '',
      showMonthPicker: false,
      showYearPicker: false,
      monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      showModal: false,
      riskCriteria: { critical: null, high: null, medium: null, low: null },
      modalSeverity: null,
      modalDays: null,
      modalReason: "",
      riskUpdating: false,
      mitigationTimeline: null,
      selectedLocation: "",
      locationName: "",
      showDropdown: false,
      filteredCountries: [],
      // NEW DROPDOWN DATA
      showLocationDropdown: false,
      activeSubDropdown: null,
      selectedLocationData: null,
      selectedLocationType: null,
      // Temporary hardcoded locations (will be replaced with API later)
      tempLocations: [
        { id: 1, name: "India", types: ["Internal", "External"] },
        { id: 2, name: "China", types: ["Internal"] },
        { id: 3, name: "USA", types: ["External"] },
        { id: 4, name: "Germany", types: ["Internal", "External"] },
      ],
      // REPORT STATUS CHECK DATA
      reportStatusChecking: true,
      hasReport: false,
      reportStatusMessage: "",
      reportStatusInterval: null,
      currentReportId: null,
      supportTotal: 0,
      supportPending: 0,
      supportClosed: 0,
      vulFixedTotal: 0,
      vulFixedCritical: 0,
      vulFixedHigh: 0,
      vulFixedMedium: 0,
      vulFixedLow: 0,
      // Mitigation by team
      mitigationLoading: false,
      mitigationByTeamData: null,
      vulnAssetCountData: null,
      mitigationActiveTab: "Patch Management",
      mitigationTabs: [
        { key: "Patch Management", label: "Patch Management" },
        { key: "Configuration Management", label: "Configuration Management" },
        { key: "Network Security", label: "Network Security" },
        { key: "Architectural Flaws", label: "Architectural Flaws" },
      ],
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    mitigationActiveTeamData() {
      if (!this.mitigationByTeamData) return { count: 0, vulnerabilities: [] };
      const teams = this.mitigationByTeamData.teams || this.mitigationByTeamData;
      if (!teams || typeof teams !== 'object') return { count: 0, vulnerabilities: [] };
      if (teams[this.mitigationActiveTab]) return teams[this.mitigationActiveTab];
      const normalize = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
      const matchedKey = Object.keys(teams).find(k => normalize(k) === normalize(this.mitigationActiveTab));
      return matchedKey ? teams[matchedKey] : { count: 0, vulnerabilities: [] };
    },
    vulnAssetCountMap() {
      if (!this.vulnAssetCountData?.teams) return {};
      const map = {};
      for (const teamData of Object.values(this.vulnAssetCountData.teams)) {
        for (const v of (teamData.vulnerabilities || [])) {
          map[v.plugin_name] = v.asset_count;
        }
      }
      return map;
    },
    uniqueMitigationVulns() {
      const seen = new Map();
      for (const vuln of this.mitigationActiveTeamData.vulnerabilities) {
        const key = (vuln.plugin_name || '').trim().toLowerCase();
        if (!seen.has(key)) seen.set(key, vuln);
      }
      return Array.from(seen.values());
    },
    modalSeverityLabel() {
      const map = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
      return this.modalSeverity ? map[this.modalSeverity] : '';
    },
    daysInMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      return new Date(year, month + 1, 0).getDate();
    },
    firstDayOfMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      return new Date(year, month, 1).getDay();
    },
    currentMonthName() {
      return this.monthNames[this.currentDate.getMonth()];
    },
    currentYear() {
      return this.currentDate.getFullYear();
    },
    yearRange() {
      const y = this.currentDate.getFullYear();
      return Array.from({ length: 12 }, (_, i) => y - 5 + i);
    },
    monthYear() {
      return this.currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

    },
    // authStore() {
    //   return useAuthStore();
    // },
    //   meanRemediateHuman() {
    //   const mttr =
    //     this.authStore.meanTimeToRemediate?.mean_time_to_remediate;

    //   if (!mttr) return "0d 0 hrs";

    //   const days = mttr.days ?? 0;
    //   const hours = mttr.hours_remaining ?? 0;

    //   return `${days}d ${hours} hrs`;
    // },
    meanRemediateHuman() {
      const mttr =
        this.authStore.meanTimeToRemediate?.mean_time_to_remediate;

      if (!mttr) return "0w 0d 0hrs";

      const weeks = mttr.weeks ?? 0;
      const days = mttr.days ?? 0;
      const hours = mttr.hours_remaining ?? 0;

      return `${weeks}w ${days}d ${hours}hrs`;
    },
    // Display text for selected location
    selectedLocationDisplay() {
      if (!this.selectedLocationData) return "";
      if (this.selectedLocationType) {
        return `${this.selectedLocationData.name} - ${this.selectedLocationType}`;
      }
      return this.selectedLocationData.name;
    },
  },
  watch: {},
  methods: {
    setMitigationTab(key) {
      this.mitigationActiveTab = key;
    },
    getMitigationRiskColor(risk) {
      const map = { Critical: "#b31c1c", High: "#f44336", Medium: "#f6b100", Low: "#4caf50" };
      return map[risk] || "#666";
    },
    async loadMitigationByTeam() {
      this.mitigationLoading = true;
      const result = await this.authStore.fetchMitigationByTeam();
      if (result.status) {
        this.mitigationByTeamData = result.data;
      }
      this.mitigationLoading = false;
    },
    async loadVulnAssetCount() {
      const result = await this.authStore.fetchAdminMitigationVulnAssetCount();
      if (result.status) {
        this.vulnAssetCountData = result.data;
      }
    },
    initTestingOverlay() {
      // ✅ Skip if report status overlay is already showing (report status takes priority)
      if (this.reportStatusChecking || !this.authStore.reportStatus.hasReport) {
        console.log("⏭️ Skipping testing overlay - report status check in progress or no report");
        return;
      }

      // Clear any existing timer and overlay
      if (this.testingTimer) {
        clearInterval(this.testingTimer);
        this.testingTimer = null;
      }
      this.removeOverlayFromDOM();

      const isTesting = localStorage.getItem("testingInProgress") === "true";
      const startTimeNum = Number(localStorage.getItem("testingStartTime") || 0);
      const elapsed = Date.now() - startTimeNum;
      const remainingMs = Math.max(20000 - elapsed, 0);

      console.log("initTestingOverlay - isTesting:", isTesting, "remainingMs:", remainingMs);

      if (isTesting && remainingMs > 0) {
        // Create overlay using DOM manipulation
        this.createOverlayInDOM();
        this.updateOverlayTimer(Math.ceil(remainingMs / 1000), (remainingMs / 20000) * 100);

        // Start countdown timer
        const self = this;
        this.testingTimer = setInterval(function () {
          const now = Date.now();
          const elapsedNow = now - startTimeNum;
          const remainingNow = Math.max(20000 - elapsedNow, 0);

          const seconds = Math.ceil(remainingNow / 1000);
          const percent = (remainingNow / 20000) * 100;
          self.updateOverlayTimer(seconds, percent);

          if (remainingNow <= 0) {
            self.clearTestingState();
          }
        }, 500);
      } else if (isTesting) {
        this.clearTestingState();
      }
    },

    createOverlayInDOM() {
      // Remove existing if any
      this.removeOverlayFromDOM();

      const overlay = document.createElement('div');
      overlay.id = 'testing-overlay-dom';
      overlay.innerHTML = `
        <div style="position: fixed; top: 60px; left: 90px; right: 0; bottom: 0; background: rgba(255,255,255,0.80); display: flex; align-items: center; justify-content: center; z-index: 900;">
          <div style="background: #fff; padding: 40px 60px; border-radius: 16px; box-shadow: 0 10px 40px rgba(49,33,177,0.25); text-align: center; border: 2px solid rgba(49,33,177,0.15);">
            <div style="font-size: 48px; color: rgba(49,33,177,1); margin-bottom: 16px;">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <h4 style="font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 8px;">Please wait</h4>
            <p style="font-size: 16px; color: #6b7280; margin-bottom: 20px;">Testing in progress...</p>
            <div style="width: 200px; height: 8px; background: #e5e7eb; border-radius: 4px; margin: 0 auto 12px; overflow: hidden;">
              <div id="testing-progress-bar" style="width: 100%; height: 100%; background: linear-gradient(90deg, rgba(49,33,177,1), rgba(90,68,255,1)); border-radius: 4px; transition: width 0.3s linear;"></div>
            </div>
            <small id="testing-timer-text" style="color: #9ca3af; font-size: 14px;">20s remaining</small>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      console.log("Overlay created in DOM");
    },

    updateOverlayTimer(seconds, percent) {
      const timerText = document.getElementById('testing-timer-text');
      const progressBar = document.getElementById('testing-progress-bar');
      if (timerText) timerText.textContent = seconds + 's remaining';
      if (progressBar) progressBar.style.width = percent + '%';
    },

    removeOverlayFromDOM() {
      const existing = document.getElementById('testing-overlay-dom');
      if (existing) {
        existing.remove();
        console.log("Overlay removed from DOM");
      }
    },

    clearTestingState() {
      console.log("clearTestingState called!");
      this.testingActive = false;
      this.removeOverlayFromDOM();

      if (this.testingTimer) {
        clearInterval(this.testingTimer);
        this.testingTimer = null;
      }
      localStorage.removeItem("testingInProgress");
      localStorage.removeItem("testingStartTime");
      localStorage.removeItem("dashboardTestingInProgress");
    },

    // NEW DROPDOWN METHODS
    toggleLocationDropdown() {
      this.showLocationDropdown = !this.showLocationDropdown;
      if (!this.showLocationDropdown) {
        this.activeSubDropdown = null;
      }
    },
    toggleSubDropdown(locId) {
      this.activeSubDropdown = this.activeSubDropdown === locId ? null : locId;
    },
    selectLocationWithType(loc, type) {
      this.selectedLocationData = loc;
      this.selectedLocationType = loc.types.length > 1 ? type : null;
      this.showLocationDropdown = false;
      this.activeSubDropdown = null;
      // For now just log - later integrate with API
      console.log("Selected:", loc.name, type);
    },
    closeLocationDropdown(e) {
      const dropdown = this.$el.querySelector('.location-dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        this.showLocationDropdown = false;
        this.activeSubDropdown = null;
      }
    },

    // OLD METHODS (kept for reference)
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },

    selectLocation(loc) {
      this.selectedLocation = loc.id;
      this.locationName = loc.name;
      this.showDropdown = false;
    },
    formatTimeline(value) {
      if (!value || !value.raw) return "--";

      const raw = value.raw.toLowerCase();

      if (raw.includes("week")) {
        return `${value.days / 7}W`;
      }

      if (raw.includes("day")) {
        return `${value.days}D`;
      }

      return `${value.days}D`;
    },
    onLocationInput() {
      this.showDropdown = true;
      this.filterCountries();
    },
    filterCountries() {
      const input = this.locationName.toLowerCase().trim();

      if (!input) {
        this.filteredCountries = [];
        return;
      }

      const allCountries = this.authStore.countries || [];

      this.filteredCountries = allCountries.filter((country) =>
        country.toLowerCase().includes(input)
      );
    },
    selectCountry(country) {
      this.locationName = country;
      this.showDropdown = false;
    },
    async loadCalendarData() {
      this.calendarLoading = true;
      this.calendarError = false;
      this.calendarErrorMessage = '';
      this.calendarDayData = {};
      // Ensure riskCriteriaId is in localStorage before calling calendar API
      if (!localStorage.getItem("riskCriteriaId") && !localStorage.getItem("riskId")) {
        await this.loadRiskCriteria();
      }
      const riskId = localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
      if (!riskId) {
        this.calendarError = true;
        this.calendarErrorMessage = 'Risk criteria not configured. Please set up your risk criteria first.';
        this.calendarLoading = false;
        return;
      }
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      const result = await this.authStore.fetchRiskCriteriaCalendar(year, month);
      console.log("[Calendar] API result:", result);
      if (result.status && result.data?.calendar?.days) {
        const map = {};
        result.data.calendar.days.forEach(day => {
          if (day.severities && day.severities.length > 0) {
            map[day.date] = day.severities[0];
          }
        });
        console.log("[Calendar] Severity map:", map);
        this.calendarDayData = map;
      } else {
        this.calendarError = true;
        this.calendarErrorMessage = result.message || 'Failed to load calendar data.';
        console.warn("[Calendar] Failed to load data:", result.message);
      }
      this.calendarLoading = false;
    },
    toggleCalendar() {
      this.showCalendar = !this.showCalendar;
      if (this.showCalendar) this.loadCalendarData();
    },
    prevMonth() {
      const d = new Date(this.currentDate);
      d.setMonth(d.getMonth() - 1);
      this.currentDate = d;
      this.loadCalendarData();
    },
    nextMonth() {
      const d = new Date(this.currentDate);
      d.setMonth(d.getMonth() + 1);
      this.currentDate = d;
      this.loadCalendarData();
    },
    selectMonth(monthIndex) {
      const d = new Date(this.currentDate);
      d.setMonth(monthIndex);
      this.currentDate = d;
      this.showMonthPicker = false;
      this.loadCalendarData();
    },
    selectYear(year) {
      const d = new Date(this.currentDate);
      d.setFullYear(year);
      this.currentDate = d;
      this.showYearPicker = false;
      this.loadCalendarData();
    },
    getSeverityClass(date) {
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(date).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const severity = this.calendarDayData[dateStr];
      switch (severity) {
        case "critical":
          return "bg-maroon text-white";
        case "high":
          return "bg-red text-white";
        case "medium":
          return "bg-warning text-dark";
        case "low":
          return "bg-success text-white";
        default:
          return "";
      }
    },
    handleDateClick(date) {
      const year = this.currentDate.getFullYear();
      const month = String(this.currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(date).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      if (this.calendarDayData[dateStr]) {
        this.$router.push("/assets");
      }
    },
    async openModal(severity) {
      // Fetch fresh risk criteria data so the current value is pre-filled in the modal
      await this.loadRiskCriteria();
      this.modalSeverity = severity;
      this.modalDays = this.riskCriteria[severity] ?? null;
      this.modalReason = "";
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalSeverity = null;
      this.modalDays = null;
      this.modalReason = "";
    },
    async submitRiskCriteria() {
      if (!this.modalDays) {
        alert("Please enter a value");
        return;
      }
      const updated = {
        critical: String(this.riskCriteria.critical ?? ''),
        high: String(this.riskCriteria.high ?? ''),
        medium: String(this.riskCriteria.medium ?? ''),
        low: String(this.riskCriteria.low ?? ''),
        [this.modalSeverity]: String(this.modalDays),
      };
      this.riskUpdating = true;
      const hasExisting = !!(localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId"));
      let result;
      if (hasExisting) {
        result = await this.authStore.updateRiskCriteria(updated);
        if (result.status && result.data?.risk_criteria?._id) {
          localStorage.setItem("riskCriteriaId", result.data.risk_criteria._id);
          localStorage.setItem("riskId", result.data.risk_criteria._id);
        }
      } else {
        result = await this.authStore.addRiskCriteria(updated);
        if (result.status && result.data?._id) {
          localStorage.setItem("riskCriteriaId", result.data._id);
          localStorage.setItem("riskId", result.data._id);
        }
      }
      this.riskUpdating = false;
      if (result.status) {
        this.riskCriteria = { ...updated };
        this.closeModal();
      } else {
        alert(result.message || "Failed to save risk criteria");
      }
    },
    async loadRiskCriteria() {
      // Try list API first (GET /api/admin/risk_criteria/risks/)
      const listResult = await this.authStore.fetchAdminRiskCriteria();
      if (listResult.status && listResult.data) {
        const d = listResult.data;
        this.riskCriteria = {
          critical: d.critical ?? null,
          high: d.high ?? null,
          medium: d.medium ?? null,
          low: d.low ?? null,
        };
        return;
      }
      let result = await this.authStore.getRiskCriteriaById();
      // Fallback: if no stored ID or fetch failed, fetch by admin
      if (!result.status) {
        result = await this.authStore.getRiskCriteriaByAdmin();
        if (result.status && result.data) {
          const d = result.data?.risk_criteria || result.data;
          if (d._id) {
            localStorage.setItem("riskId", d._id);
            localStorage.setItem("riskCriteriaId", d._id);
          }
          this.riskCriteria = {
            critical: d.critical ?? null,
            high: d.high ?? null,
            medium: d.medium ?? null,
            low: d.low ?? null,
          };
        }
        return;
      }
      // Handle both { risk_criteria: {...} } and direct object response shapes
      const d = result.data?.risk_criteria || result.data;
      if (d) {
        if (d._id) {
          localStorage.setItem("riskId", d._id);
          localStorage.setItem("riskCriteriaId", d._id);
        }
        this.riskCriteria = {
          critical: d.critical ?? null,
          high: d.high ?? null,
          medium: d.medium ?? null,
          low: d.low ?? null,
        };
      }
    },
    async loadMitigationTimeline() {
      const res = await this.authStore.fetchMitigationTimeline(this.reportId);
      if (res.status) {
        this.mitigationTimeline = res.data;
      }
    },

    // ==========================================
    // REPORT STATUS CHECK METHODS
    // ==========================================

    loadDashboardData() {
      this.loadMitigationByTeam();
      this.loadVulnAssetCount();
      this.loadRiskCriteria();
      Promise.all([
        this.authStore.fetchDashboardTotalAssets(),
        this.authStore.fetchDashboardAvgScore(),
        this.authStore.fetchDashboardVulnerabilities(),
        this.authStore.fetchDashboardMitigationTimeline(),
        this.authStore.fetchDashboardMeanTimeToRemediate(),
        this.authStore.getDashboardVulnerabilitiesFixed().then(res => {
          if (res.status) {
            this.vulFixedTotal = res.data.total_fixed || 0;
            this.vulFixedCritical = res.data.critical_fixed || 0;
            this.vulFixedHigh = res.data.high_fixed || 0;
            this.vulFixedMedium = res.data.medium_fixed || 0;
            this.vulFixedLow = res.data.low_fixed || 0;
          }
        }),
        this.authStore.getDashboardSupportRequests().then(res => {
          if (res.status) {
            this.supportTotal = res.data.total || 0;
            this.supportPending = res.data.pending || 0;
            this.supportClosed = res.data.closed || 0;
          }
        }),
      ])
        .then(() => {
          console.log("✅ All dashboard APIs loaded");
        })
        .catch(err => {
          console.error("❌ Dashboard API error", err);
        });
    },

    async checkReportStatus() {
      console.log("🔍 Checking report status...");
      const res = await this.authStore.getReportStatus();

      if (res.status) {
        this.hasReport = res.hasReport;
        this.reportStatusMessage = res.message;

        if (res.hasReport) {
          // Report is available
          console.log("✅ Report available:", res.reportId);
          this.currentReportId = res.reportId;
          localStorage.setItem("reportId", res.reportId);

          // Stop polling
          this.stopReportStatusPolling();

          // Remove overlay and show success
          this.removeReportStatusOverlay();
          this.showReportAvailableAlert();
          this.reportStatusChecking = false;

          // Load all dashboard data without requiring a page refresh
          this.loadDashboardData();

        } else {
          // Report not uploaded yet - keep showing overlay
          console.log("⏳ No report yet:", res.message);
          this.reportStatusChecking = true;
          this.updateReportStatusMessage(res.message);
        }
      } else {
        console.error("❌ Report status check failed:", res.message);
      }
    },

    startReportStatusPolling() {
      console.log("🔄 Starting report status polling...");

      // Poll every 5 seconds until report is available
      this.reportStatusInterval = setInterval(() => {
        // Check both local and store state
        if (!this.hasReport && !this.authStore.reportStatus.hasReport) {
          this.checkReportStatus();
        } else {
          this.stopReportStatusPolling();
          this.removeReportStatusOverlay();
        }
      }, 5000); // 5 seconds
    },

    stopReportStatusPolling() {
      if (this.reportStatusInterval) {
        clearInterval(this.reportStatusInterval);
        this.reportStatusInterval = null;
        console.log("⏹️ Stopped report status polling");
      }
    },

    createReportStatusOverlay() {
      // Remove existing if any
      this.removeReportStatusOverlay();

      const overlay = document.createElement('div');
      overlay.id = 'report-status-overlay';
      overlay.innerHTML = `
        <div style="position: fixed; top: 60px; left: 90px; right: 0; bottom: 0; background: rgba(255,255,255,0.95); display: flex; align-items: center; justify-content: center; z-index: 900;">
          <div style="background: #fff; padding: 40px 60px; border-radius: 16px; box-shadow: 0 10px 40px rgba(49,33,177,0.25); text-align: center; border: 2px solid rgba(49,33,177,0.15); max-width: 500px;">
            <div style="font-size: 48px; color: rgba(49,33,177,1); margin-bottom: 16px;">
              <i class="bi bi-hourglass-split" style="display: inline-block; animation: spin 2s linear infinite;"></i>
            </div>
            <h4 style="font-size: 24px; font-weight: 600; color: #111827; margin-bottom: 8px;">Please Wait</h4>
            <p id="report-status-message" style="font-size: 16px; color: #6b7280; margin-bottom: 20px; line-height: 1.5;">
              ${this.reportStatusMessage || 'Checking report status...'}
            </p>
            <div class="d-flex justify-content-center">
              <div class="spinner-border text-primary" role="status" style="width: 2rem; height: 2rem;">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            
          </div>
        </div>
        <style>
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(overlay);
      console.log("📋 Report status overlay created");
    },

    updateReportStatusMessage(message) {
      const messageEl = document.getElementById('report-status-message');
      if (messageEl) {
        messageEl.textContent = message;
      }
    },

    removeReportStatusOverlay() {
      const overlay = document.getElementById('report-status-overlay');
      if (overlay) {
        overlay.remove();
        console.log("📋 Report status overlay removed");
      }
    },

    showReportAvailableAlert() {
      Swal.fire({
        icon: 'success',
        title: 'Report Available',
        text: 'The report has been uploaded. Dashboard is now accessible.',
        toast: true,
        position: 'top-end',
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: (toast) => {
          toast.style.marginTop = '70px';
        }
      });
    },

    async initReportStatusCheck() {
      console.log("🚀 Initializing report status check...");

      // ✅ STEP 1: Check if we already know report exists (from store state)
      if (this.authStore.reportStatus.checked && this.authStore.reportStatus.hasReport) {
        console.log("✅ Report already confirmed from store");
        this.hasReport = true;
        this.currentReportId = this.authStore.reportStatus.reportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
        return;
      }

      // ✅ STEP 1b: Check localStorage as fallback (reportId persisted from upload flow)
      const cachedReportId = localStorage.getItem("reportId");
      if (cachedReportId) {
        console.log("✅ Report already confirmed from localStorage:", cachedReportId);
        this.hasReport = true;
        this.currentReportId = cachedReportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
        return;
      }

      // ✅ STEP 2: Show overlay IMMEDIATELY while checking
      this.reportStatusChecking = true;
      this.reportStatusMessage = "Checking report status...";
      this.createReportStatusOverlay();

      // ✅ STEP 3: Now call API to check
      const res = await this.authStore.getReportStatus();

      if (res.status && res.hasReport) {
        // Report already exists - remove overlay (no toast, report was already there)
        console.log("✅ Report already exists:", res.reportId);
        this.hasReport = true;
        this.currentReportId = res.reportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
        // Don't show toast here - report was already available, not a new upload
      } else {
        // API returned no report - remove overlay and load dashboard directly
        console.log("⚠️ Report status API returned no report, proceeding to load dashboard.");
        this.hasReport = false;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
        this.loadDashboardData();
      }
    },
  },

mounted() {
  console.log("=== DASHBOARD MOUNTED ===");

  // ✅ STEP 1: Check report status first
  this.initReportStatusCheck();

  setTimeout(() => {
    this.initTestingOverlay();
  }, 100);

  // document.addEventListener("click", this.closeLocationDropdown);

  // this.authStore.fetchCountries();

  const user =
    this.authStore.user ||
    JSON.parse(localStorage.getItem("user") || "null");

  // if (user) {
  //   this.authStore.user = user;
  //   const adminId = user.admin_id || user.id || user._id;
  //   if (adminId) {
  //     this.authStore.fetchLocationsByAdminId(adminId);
  //   }
  // }

  // ✅ DASHBOARD APIs
  this.loadDashboardData();
},



  beforeUnmount() {
   
    // document.removeEventListener('click', this.closeLocationDropdown);
   
    if (this.testingTimer) {
      clearInterval(this.testingTimer);
    }
    this.removeOverlayFromDOM();

    // ✅ Clean up report status polling
    this.stopReportStatusPolling();
    this.removeReportStatusOverlay();
  },
  // Handle component reactivation (if using keep-alive)
  activated() {
    console.log("=== ACTIVATED hook called ===");
    this.initTestingOverlay();
    // Re-check report status on reactivation
    this.initReportStatusCheck();
  },
};
</script>

<style scoped>
.truncated-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;
  display: block;
  cursor: pointer;
}

.browser-bar img {
  height: 35px;
}
/* Testing Overlay - Only covers col-11 (right side of screen) */
.testing-overlay {
  position: fixed;
  top: 64px; 
  left: 100px; 
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.testing-alert-box {
  top: 64px;
  background: #fff;
  padding: 40px 60px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(49, 33, 177, 0.2);
  text-align: center;
  border: 2px solid rgba(49, 33, 177, 0.1);
}

.testing-icon {
  font-size: 48px;
  color: rgba(49, 33, 177, 1);
  margin-bottom: 16px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

.testing-alert-box h4 {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.testing-alert-box p {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 20px;
}

.progress-bar-container {
  width: 200px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  margin: 0 auto 12px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, rgba(49, 33, 177, 1), rgba(90, 68, 255, 1));
  border-radius: 3px;
  transition: width 0.1s linear;
}

.testing-alert-box small {
  color: #9ca3af;
  font-size: 13px;
}

.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.custom-modal-box {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
}


.bg-maroon {
  background-color: maroon !important;
}
.bg-red {
  background-color: red !important;
}
.info-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.info-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background-color: #1e1e2d;
  color: #fff;
  padding: 7px 11px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  white-space: normal;
  width: 230px;
  text-align: left;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1050;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.info-tooltip::before {
  content: '';
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #1e1e2d;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1050;
}
.info-tooltip:hover::after,
.info-tooltip:hover::before {
  opacity: 1;
}

.notification-panel {
  position: fixed;
  top: 0;
  right: -520px;
  width: 500px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #ddd;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease-in-out;
  z-index: 1050;
}

.notification-panel.open {
  right: 0;
}

.notification-panel.fullscreen {
  width: 100% !important;
  height: 100% !important;
  right: 0;
  top: 0;
}
.dropdown-menu .dropdown-item {
  cursor: pointer;
}
.calender-para {
  color: #3121B1;
  font-size: 14px;
}

.vuln-heading {
  font-size: 18px;
}

.btn-pill {
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  height: 36px;
}

.btn-pill:hover {
  background-color: transparent;
}

.active-tab {
  background-color: #EAE8FF;
  color: #3121B1;
  border: none;
  font-size: 13px;
}

.other-btn {
  color: #000000DE;
  border: 1px solid #00000029;
}

.raised-table tr th {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
}

.raised-tbody tr td {
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
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
    padding: 8px 40px 8px 16px; /* extra right padding for the arrow */
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

.tooltip-text {
    visibility: hidden;
    width: max-content;
    max-width: 200px;
    background-color: #333;
    color: #fff;
    text-align: left;
    border-radius: 4px;
    padding: 6px 8px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position above the icon */
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    line-height: 1.3;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%; /* Arrow position */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  .info-icon:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }
  .download-btn {
    font-weight: 600;
    font-size: 12px;
    padding: 8px 15px;
    color: white;
    background-color: rgba(49, 33, 177, 1);
    border-radius: 30px;
    border: 1px solid rgba(0, 0, 0, 0.12);
}

/* ===== NEW LOCATION DROPDOWN WITH SUB-DROPDOWN ===== */
.location-dropdown {
  position: relative;
  display: inline-block;
  width: 200px;
}

.location-dropdown-btn {
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.16);
  border-radius: 50px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.location-dropdown-btn:hover {
  border-color: rgba(49, 33, 177, 0.5);
}

.location-dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  min-width: 100%;
  border-radius: 12px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  margin-top: 4px;
  padding: 8px 0;
  overflow: visible;
}

.location-item {
  position: relative;
}

.location-name {
  padding: 10px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  transition: background-color 0.2s;
}

.location-name:hover {
  background-color: #f5f5f5;
}

.location-item.has-submenu .location-name {
  padding-right: 12px;
}

/* Inline sub-options - appears below location name */
.sub-options {
  background-color: #f9f9f9;
  padding: 4px 0;
}

.sub-options a {
  display: block;
  padding: 8px 16px 8px 32px;
  text-decoration: none;
  color: #555;
  font-size: 13px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sub-options a:hover {
  background-color: #eef0ff;
  color: rgba(49, 33, 177, 1);
}

/* ===== DOWNLOAD REPORT MODAL ===== */
.report-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  /* background: linear-gradient(135deg, #aab3df 0%, #764ba2 100%); */
  z-index: 2000;
  overflow-y: auto;
  padding: 40px 20px;
}
.report-page-wrap {
  max-width: 1600px;
  margin: 0 auto 60px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}
.report-header {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
}
.report-header::before {
  content: '';
  position: absolute;
  top: -50%; left: -50%;
  width: 200%; height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: reportFloat 20s ease-in-out infinite;
}
@keyframes reportFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}
.report-header-left { display: flex; flex-direction: column; gap: 5px; z-index: 2; }
.report-header-center { flex: 1; text-align: center; position: relative; z-index: 2; }
.report-header-right {
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.report-close-icon-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.3rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.9;
}
.report-close-icon-btn:hover { opacity: 1; }
.report-download-btn {
  background: none;
  border: none;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 0;
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  font-style: normal;
}
.report-download-btn:hover { opacity: 0.85; }
.report-download-btn i { font-size: 1.2rem; font-style: normal; }
.report-download-btn span { font-style: normal; }
.report-content { padding: 40px; }
.report-h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}
.report-exec-summary {
  position: relative;
  margin-bottom: 40px;
  padding: 40px;
  background: linear-gradient(90deg, #3b82f6 0%, #10b981 33%, #f59e0b 66%, #ef4444 100%);
  background-size: 400% 400%;
  animation: reportGradientShift 15s ease infinite;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(59, 130, 246, 0.3);
}
@keyframes reportGradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
.report-exec-summary::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 24px;
  z-index: 1;
}
.report-exec-summary > * { position: relative; z-index: 2; }
.report-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}
.report-summary-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}
.report-summary-card:hover { transform: translateY(-8px); box-shadow: 0 25px 60px rgba(0,0,0,0.2); }
.report-summary-title { font-size: 1.25rem; font-weight: 600; color: #1e293b; margin-bottom: 20px; }
.report-total-number { font-size: 3rem; font-weight: 800; color: #1e293b; text-align: center; margin-bottom: 15px; }
.report-chart-small { height: 260px; margin-bottom: 15px; }
.report-charts-section { margin-bottom: 40px; }
.report-chart-wrapper { position: relative; height: 700px; }
.report-chart-card {
  background: white;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
}
.report-chart-title { font-size: 1.4rem; font-weight: 600; color: #1e293b; margin-bottom: 25px; text-align: center; }
.report-teams-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 40px;
}
.report-team-card {
  background: white;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  border-left: 8px solid;
}
.report-team-header { display: flex; align-items: center; gap: 20px; margin-bottom: 30px; }
.report-team-icon {
  font-size: 2rem;
  width: 60px; height: 60px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
}
.report-team-name { font-size: 1.4rem; font-weight: 700; color: #1e293b; }
.report-team-total { font-size: 1.1rem; font-weight: 600; }
.report-team-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.report-metric-item {
  text-align: center;
  padding: 12px 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 14px;
}
.report-metric-value { font-size: 1.4rem; font-weight: 700; margin-bottom: 5px; }
.report-metric-label { font-size: 0.85rem; color: #64748b; }
.report-team-footer { font-size: 0.95rem; color: #64748b; font-weight: 500; }
/* Severity badges */
.rsev-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
}
.rsev-maroon, .rsev-critical { background: maroon; color: white; }
.rsev-red, .rsev-high { background: red; color: white; }
.rsev-orange, .rsev-medium { background: goldenrod; color: white; }
.rsev-darkgreen, .rsev-low { background: green; color: white; }
/* Filters */
.report-filters-section {
  background: white;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}
.report-filter-group { display: flex; gap: 25px; flex-wrap: wrap; align-items: center; }
.report-filter-group label { font-weight: 600; color: #374151; white-space: nowrap; font-size: 0.95rem; }
.report-filter-group select {
  padding: 14px 24px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  font-weight: 500;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
}
.report-filter-group select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
/* Table with scroller */
.report-table-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  overflow: hidden;
  max-height: 480px;
  overflow-y: auto;
}
.report-table { width: 100%; border-collapse: collapse; }
.report-table thead th {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  padding: 22px;
  font-weight: 600;
  text-align: left;
  font-size: 1rem;
  letter-spacing: 0.5px;
  position: sticky;
  top: 0;
  z-index: 1;
}
.report-table tbody td { padding: 22px; border-bottom: 1px solid #f1f5f9; transition: background 0.2s; }
.report-table tbody tr:hover td { background: #f8fafc; }
.rteam-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.rteam-network { background: #3b82f6; color: white; }
.rteam-patch { background: #10b981; color: white; }
.rteam-configuration { background: #f97316; color: white; }
.rteam-architectural { background: #dc2626; color: white; }
.rstatus-open { padding: 6px 12px; border-radius: 20px; background: #fee2e2; color: #dc2626; font-size: 0.85rem; font-weight: 600; display: inline-block; }
.rstatus-closed { padding: 6px 12px; border-radius: 20px; background: #d1fae5; color: #059669; font-size: 0.85rem; font-weight: 600; display: inline-block; }
</style>