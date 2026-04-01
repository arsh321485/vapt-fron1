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

          <div class="col-11 ud-content">

            <!-- Page Header -->
            <div class="ud-page-header">
              <div>
                <h2 class="ud-title">
                  Vulnerability Management Program
                  <span class="ud-cal-wrap">
                    <button class="ud-cal-btn" @click="toggleCalendar">
                      <i class="bi bi-calendar3"></i>
                    </button>
                    <!-- Outside-click backdrop -->
                    <div
                      v-if="showCalendar"
                      style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999;"
                      @click="showCalendar = false; showMonthPicker = false; showYearPicker = false;"
                    ></div>
                    <div v-if="showCalendar" class="ud-calendar" @click.stop>
                      <div class="ud-cal-header">
                        <button class="ud-cal-nav" @click="prevMonth">&lt;</button>
                        <h6 class="mb-0 d-flex gap-2">
                          <span class="ud-cal-pick" @click="showMonthPicker = !showMonthPicker; showYearPicker = false;">{{ currentMonthName }}</span>
                          <span class="ud-cal-pick" @click="showYearPicker = !showYearPicker; showMonthPicker = false;">{{ currentYear }}</span>
                        </h6>
                        <button class="ud-cal-nav" @click="nextMonth">&gt;</button>
                        <div v-if="showMonthPicker" class="ud-picker-dropdown">
                          <div class="ud-picker-grid">
                            <button v-for="(mName, mIdx) in monthNames" :key="mIdx" class="ud-picker-btn" :class="{ active: mIdx === currentDate.getMonth() }" @click="selectMonth(mIdx)">{{ mName.slice(0,3) }}</button>
                          </div>
                        </div>
                        <div v-if="showYearPicker" class="ud-picker-dropdown">
                          <div class="ud-picker-grid">
                            <button v-for="y in yearRange" :key="y" class="ud-picker-btn" :class="{ active: y === currentYear }" @click="selectYear(y)">{{ y }}</button>
                          </div>
                        </div>
                      </div>
                      <div class="ud-cal-weekdays">
                        <div v-for="day in weekDays" :key="day">{{ day }}</div>
                      </div>
                      <div v-if="calendarLoading" class="text-center py-3 text-muted small">Loading...</div>
                      <div v-else-if="calendarError" class="text-center py-3 text-danger small">{{ calendarErrorMessage || 'Failed to load calendar data.' }}</div>
                      <div v-else class="ud-cal-days">
                        <div v-for="n in firstDayOfMonth" :key="'empty-' + n"></div>
                        <div v-for="date in daysInMonth" :key="date" class="ud-cal-day" :class="getSeverityClass(date)" @click="handleDateClick(date)">{{ date }}</div>
                      </div>
                    </div>
                  </span>
                </h2>
                <p class="ud-subtitle">{{ selectedTeam === 'both' ? 'All Teams' : selectedTeam }}</p>
              </div>
              <div class="d-flex align-items-center gap-3">
                <!-- Report overlay -->
                <div v-if="showReport" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style="background-color: rgba(0,0,0,0.6);z-index:1050;">
                  <div class="bg-white p-4 rounded shadow" style="width:600px;max-height:90vh;overflow-y:auto;position:relative;">
                    <button @click="showReport = false" class="btn-close position-absolute top-0 end-0 m-3" aria-label="Close"></button>
                    <h2 class="mb-2 text-center">Download Report</h2>
                    <p class="mb-2 text-center" style="color:rgba(0,0,0,0.6);font-weight:500;font-size:13px;">Download report</p>
                    <button type="button" class="btn patch-btn rounded-pill text-nowrap ms-3 mb-3">June 1 - June 30 <i class="bi bi-calendar-minus"></i></button>
                    <div class="accordion" id="globalReportAccordion">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                          <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Assets(11) <span class="text-primary ms-2">4 selected</span></button>
                        </h2>
                        <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#globalReportAccordion">
                          <div class="accordion-body">Assets</div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="headingTwo">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">Vulnerabilities</button>
                        </h2>
                        <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#globalReportAccordion">
                          <div class="accordion-body">Vulnerabilities</div>
                        </div>
                      </div>
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="headingThree">
                          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">Team Role</button>
                        </h2>
                        <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#globalReportAccordion">
                          <div class="accordion-body">Team Roles</div>
                        </div>
                      </div>
                    </div>
                    <button class="btn download-btn btn-sm ms-3 mt-4"><i class="bi bi-download me-2"></i> Download report</button>
                  </div>
                </div>
                <!-- Team dropdown -->
                <div class="ud-team-dropdown" ref="teamDropdown">
                  <div class="ud-team-btn" @click="toggleTeamDropdown">
                    {{ selectedTeam === 'both' ? 'All Teams' : selectedTeam }}
                    <i class="bi bi-chevron-down ms-2" style="font-size:11px;"></i>
                  </div>
                  <div class="dropdown-content">
                    <a href="#" @click.prevent="selectTeam('both')">All Teams</a>
                    <a v-for="team in userTeams" :key="team" href="#" @click.prevent="selectTeam(team)">{{ team }}</a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Row 1 -->
            <div class="row g-3 mb-3">
              <!-- Total Assets -->
              <div class="col-md-3">
                <div class="ud-stat-card">
                  <div class="ud-stat-icon-wrap ud-icon-purple">
                    <i class="bi bi-laptop"></i>
                  </div>
                  <p class="ud-stat-label">
                    Total Assets Assigned
                    <span class="ud-tooltip" data-tooltip="Total number of assets currently registered and monitored within the platform."><i class="bi bi-info-circle"></i></span>
                  </p>
                  <h2 class="ud-stat-num">{{ assetsLoading ? '...' : (totalAssets ?? '—') }}</h2>
                </div>
              </div>

              <!-- Vulnerabilities -->
              <div class="col-md-5">
                <div class="ud-stat-card">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="ud-stat-icon-wrap ud-icon-teal"><i class="bi bi-shield-exclamation"></i></div>
                    <p class="ud-stat-label mb-0">
                      Vulnerabilities
                      <span class="ud-tooltip" data-tooltip="Total identified vulnerabilities across all assets categorized by severity."><i class="bi bi-info-circle"></i></span>
                    </p>
                  </div>
                  <div class="ud-sev-row">
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ vulns.critical ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-critical"></span>
                      <span class="ud-sev-label ud-label-critical">Critical</span>
                    </div>
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ vulns.high ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-high"></span>
                      <span class="ud-sev-label ud-label-high">High</span>
                    </div>
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ vulns.medium ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-medium"></span>
                      <span class="ud-sev-label ud-label-medium">Medium</span>
                    </div>
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ vulns.low ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-low"></span>
                      <span class="ud-sev-label ud-label-low">Low</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mitigation Timeline -->
              <div class="col-md-4">
                <div class="ud-stat-card">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="ud-stat-icon-wrap ud-icon-navy"><i class="bi bi-clock-history"></i></div>
                    <p class="ud-stat-label mb-0">
                      Mitigation Timeline
                      <span class="ud-tooltip" data-tooltip="Remaining remediation time based on defined risk criteria."><i class="bi bi-info-circle"></i></span>
                    </p>
                  </div>
                  <div class="ud-sev-row">
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ mitigation.critical ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-critical"></span>
                      <span class="ud-sev-label ud-label-critical">Critical</span>
                    </div>
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ mitigation.high ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-high"></span>
                      <span class="ud-sev-label ud-label-high">High</span>
                    </div>
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ mitigation.medium ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-medium"></span>
                      <span class="ud-sev-label ud-label-medium">Medium</span>
                    </div>
                    <div class="ud-sev-item">
                      <span class="ud-sev-num">{{ mitigation.low ?? '—' }}</span>
                      <span class="ud-sev-bar ud-bar-low"></span>
                      <span class="ud-sev-label ud-label-low">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Stats Row 2 -->
            <div class="row g-3 mb-4">
              <!-- Vulns Fixed -->
              <div class="col-md-5">
                <div class="ud-stat-card">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="ud-stat-icon-wrap ud-icon-teal"><i class="bi bi-check-circle"></i></div>
                    <p class="ud-stat-label mb-0">
                      Total Vulnerabilities Fixed
                      <span class="ud-tooltip" data-tooltip="Vulnerabilities successfully remediated and verified as resolved."><i class="bi bi-info-circle"></i></span>
                    </p>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <h2 class="ud-big-num mb-0">{{ vulnsFixed.total ?? '—' }}</h2>
                    <div class="ud-sev-row flex-grow-1">
                      <div class="ud-sev-item">
                        <span class="ud-sev-num">{{ vulnsFixed.critical ?? '—' }}</span>
                        <span class="ud-sev-bar ud-bar-critical"></span>
                        <span class="ud-sev-label ud-label-critical">Critical</span>
                      </div>
                      <div class="ud-sev-item">
                        <span class="ud-sev-num">{{ vulnsFixed.high ?? '—' }}</span>
                        <span class="ud-sev-bar ud-bar-high"></span>
                        <span class="ud-sev-label ud-label-high">High</span>
                      </div>
                      <div class="ud-sev-item">
                        <span class="ud-sev-num">{{ vulnsFixed.medium ?? '—' }}</span>
                        <span class="ud-sev-bar ud-bar-medium"></span>
                        <span class="ud-sev-label ud-label-medium">Medium</span>
                      </div>
                      <div class="ud-sev-item">
                        <span class="ud-sev-num">{{ vulnsFixed.low ?? '—' }}</span>
                        <span class="ud-sev-bar ud-bar-low"></span>
                        <span class="ud-sev-label ud-label-low">Low</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mean Time -->
              <div class="col-md-3">
                <div class="ud-stat-card ud-stat-card-navy h-100">
                  <div class="ud-stat-icon-wrap ud-icon-navy mb-3"><i class="bi bi-stopwatch"></i></div>
                  <p class="ud-stat-label">
                    Mean Time to Remediate
                    <span class="ud-tooltip" data-tooltip="Average remediation time based on risk criteria for different severity levels."><i class="bi bi-info-circle"></i></span>
                  </p>
                  <h2 class="ud-big-num">{{ meanTimeRemediate ?? '—' }}</h2>
                </div>
              </div>

              <!-- Support Requests -->
              <div class="col-md-4">
                <div class="ud-stat-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="ud-stat-icon-wrap ud-icon-purple"><i class="bi bi-headset"></i></div>
                    <p class="ud-stat-label mb-0">
                      Support Requests
                      <span class="ud-tooltip" data-tooltip="Total support/tickets raised, categorized by status (Pending or Closed)."><i class="bi bi-info-circle"></i></span>
                    </p>
                  </div>
                  <div class="d-flex align-items-center gap-4">
                    <h2 class="ud-big-num mb-0">{{ supportReqs.total ?? '—' }}</h2>
                    <div class="ud-sev-row">
                      <div class="ud-sev-item">
                        <span class="ud-sev-num">{{ supportReqs.pending ?? '—' }}</span>
                        <span class="ud-sev-bar ud-bar-high"></span>
                        <span class="ud-sev-label ud-label-high">Pending</span>
                      </div>
                      <div class="ud-sev-item">
                        <span class="ud-sev-num">{{ supportReqs.closed ?? '—' }}</span>
                        <span class="ud-sev-bar ud-bar-low"></span>
                        <span class="ud-sev-label ud-label-low">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Mitigation Strategy Section -->
            <div class="ud-section-card mb-5">
              <!-- Section Header -->
              <div class="ud-section-header">
                <h4 class="ud-section-title">Mitigation Strategy</h4>
                <router-link to="/userexception" class="ud-pending-badge text-decoration-none">
                  {{ supportReqs.pending ?? '—' }} Support requests ongoing
                  <i class="bi bi-arrow-right ms-1"></i>
                </router-link>
              </div>

              <!-- Team Tabs -->
              <div class="d-flex gap-2 flex-wrap mb-4">
                <button
                  v-for="team in userTeams"
                  :key="team"
                  class="ud-team-tab"
                  :class="selectedTeam === team ? 'ud-team-tab-active' : ''"
                  @click="selectTeam(team)"
                >{{ team }}</button>
              </div>

              <p class="ud-assigned-label">Assigned to {{ selectedTeam === 'both' ? 'All Teams' : selectedTeam }} team</p>

              <!-- Risk Criteria -->
              <div class="ud-risk-row">
                <div class="ud-risk-item">
                  <span class="ud-risk-label ud-risk-critical">Critical</span>
                  <button type="button" class="ud-risk-val">
                    {{ riskCriteria.critical ?? '—' }}
                    <i class="bi bi-plus-circle ms-2" style="cursor:pointer;" @click.stop="openModal('critical')"></i>
                  </button>
                </div>
                <div class="ud-risk-item">
                  <span class="ud-risk-label ud-risk-high">High</span>
                  <button type="button" class="ud-risk-val">
                    {{ riskCriteria.high ?? '—' }}
                    <i class="bi bi-plus-circle ms-2" style="cursor:pointer;" @click.stop="openModal('high')"></i>
                  </button>
                </div>
                <div class="ud-risk-item">
                  <span class="ud-risk-label ud-risk-medium">Medium</span>
                  <button type="button" class="ud-risk-val">
                    {{ riskCriteria.medium ?? '—' }}
                    <i class="bi bi-plus-circle ms-2" style="cursor:pointer;" @click.stop="openModal('medium')"></i>
                  </button>
                </div>
                <div class="ud-risk-item">
                  <span class="ud-risk-label ud-risk-low">Low</span>
                  <button type="button" class="ud-risk-val">
                    {{ riskCriteria.low ?? '—' }}
                    <i class="bi bi-plus-circle ms-2" style="cursor:pointer;" @click.stop="openModal('low')"></i>
                  </button>
                </div>
              </div>

              <!-- Vulnerabilities Sub-section -->
              <div class="mt-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <p class="ud-vuln-count-label mb-0">Vulnerabilities ({{ mitigationActiveTeamData.count }})</p>
                  <router-link :to="{ path: '/usermissingsecurityupdates', query: { team: selectedTeam } }" class="ud-more-link text-decoration-none">
                    More details <i class="bi bi-arrow-right"></i>
                  </router-link>
                </div>
                <div v-if="mitigationActiveTeamData.vulnerabilities.length === 0" class="py-4 text-center text-muted">
                  No vulnerabilities assigned to this team.
                </div>
                <div v-else class="row g-3">
                  <div class="col-md-3" v-for="vuln in mitigationActiveTeamData.vulnerabilities.slice(0, 4)" :key="vuln.host_name + vuln.plugin_name">
                    <div class="ud-vuln-card">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="ud-vuln-assets"><i class="bi bi-hdd-network me-1"></i>{{ vulnAssetCountMap[vuln.plugin_name] ?? 1 }} assets</span>
                        <span class="ud-sev-badge" :class="'ud-badge-' + (vuln.risk_factor || '').toLowerCase()">{{ vuln.risk_factor }}</span>
                      </div>
                      <h6 class="ud-vuln-name" :title="vuln.plugin_name">{{ vuln.plugin_name }}</h6>
                      <div class="d-flex align-items-center mt-auto">
                        <i class="bi bi-hdd-network me-2 text-muted"></i>
                        <span class="ud-affected-label">{{ vuln.assets.length }} affected asset{{ vuln.assets.length !== 1 ? 's' : '' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Risk Criteria Modal -->
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
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'UserDashboard1View',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      showCalendar: false,
      showReport: false,
      currentDate: new Date(),
      weekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendarDayData: {},
      calendarLoading: false,
      calendarError: false,
      calendarErrorMessage: '',
      showMonthPicker: false,
      showYearPicker: false,
      monthNames: ["January","February","March","April","May","June","July","August","September","October","November","December"],
      userTeams: [],
      selectedTeam: '',
      totalAssets: null,
      assetsLoading: false,
      vulns: { critical: null, high: null, medium: null, low: null },
      vulnsFixed: { total: null, critical: null, high: null, medium: null, low: null },
      supportReqs: { total: null, pending: null, closed: null },
      mitigation: { critical: null, high: null, medium: null, low: null },
      meanTimeRemediate: null,
      mitigationByTeamData: null,
      vulnAssetCountData: null,
      riskCriteria: { critical: null, high: null, medium: null, low: null },
      showModal: false,
      modalSeverity: null,
      modalDays: null,
      modalReason: '',
      riskUpdating: false,
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
      if (teams[this.selectedTeam]) return teams[this.selectedTeam];
      const normalize = (s) => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
      const matchedKey = Object.keys(teams).find(k => normalize(k) === normalize(this.selectedTeam));
      return matchedKey ? teams[matchedKey] : { count: 0, vulnerabilities: [] };
    },
    modalSeverityLabel() {
      const map = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
      return this.modalSeverity ? map[this.modalSeverity] : '';
    },
    vulnAssetCountMap() {
      if (!this.vulnAssetCountData?.vulnerabilities) return {};
      const map = {};
      for (const v of this.vulnAssetCountData.vulnerabilities) {
        map[v.plugin_name] = v.asset_count;
      }
      return map;
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
    monthYear() {
      return this.currentDate.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
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
  },
  methods: {
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
    async loadCalendarData() {
      this.calendarLoading = true;
      this.calendarError = false;
      this.calendarErrorMessage = '';
      this.calendarDayData = {};
      if (!localStorage.getItem('riskCriteriaId') && !localStorage.getItem('riskId')) {
        await this.loadRiskCriteria();
      }
      const riskId = localStorage.getItem('riskCriteriaId') || localStorage.getItem('riskId');
      if (!riskId) {
        this.calendarError = true;
        this.calendarErrorMessage = 'Risk criteria not configured. Please set up your risk criteria first.';
        this.calendarLoading = false;
        return;
      }
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      const result = await this.authStore.fetchUserRiskCriteriaCalendar(year, month);
      if (result.status && result.data?.calendar?.days) {
        const map = {};
        result.data.calendar.days.forEach(day => {
          if (day.severities && day.severities.length > 0) {
            map[day.date] = day.severities[0];
          }
        });
        this.calendarDayData = map;
      } else {
        this.calendarError = true;
        this.calendarErrorMessage = result.message || 'Failed to load calendar data.';
      }
      this.calendarLoading = false;
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
    getSeverityColor(sev) {
      if (sev === 'Critical') return 'maroon';
      if (sev === 'High') return 'red';
      if (sev === 'Medium') return 'orange';
      return 'green';
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
        this.$router.push("/userassets");
      }
    },
    toggleTeamDropdown() {
      this.$refs.teamDropdown.classList.toggle('show');
    },
    async fetchAssets(team) {
      const store = useAuthStore();
      this.assetsLoading = true;
      const result = await store.fetchUserTotalAssets(team === 'both' ? undefined : team);
      if (result.status) {
        this.totalAssets = result.data?.total_assets ?? null;
      } else {
        this.totalAssets = null;
      }
      this.assetsLoading = false;
    },
    async fetchMeanTimeRemediate(team) {
      const store = useAuthStore();
      const result = await store.fetchUserMeanTimeRemediate(team);
      if (result.status) {
        const m = result.data.mean_time_to_remediate;
        if (m) {
          const w = m.weeks ?? 0;
          const d = m.days ?? 0;
          const h = m.hours_remaining ?? 0;
          this.meanTimeRemediate = `${w}w ${d}d ${h}hrs`;
        } else {
          this.meanTimeRemediate = null;
        }
      } else {
        this.meanTimeRemediate = null;
      }
    },
    formatMitigationDays(entry) {
      if (!entry) return null;
      const days = entry.days ?? 0;
      if (days < 7) return `${days}d`;
      const w = Math.floor(days / 7);
      const d = days % 7;
      return d > 0 ? `${w}w ${d}d` : `${w}w`;
    },
    async fetchMitigation(team) {
      const store = useAuthStore();
      const result = await store.fetchUserMitigationTimeline(team);
      if (result.status) {
        this.mitigation = {
          critical: this.formatMitigationDays(result.data.critical),
          high: this.formatMitigationDays(result.data.high),
          medium: this.formatMitigationDays(result.data.medium),
          low: this.formatMitigationDays(result.data.low),
        };
      } else {
        this.mitigation = { critical: null, high: null, medium: null, low: null };
      }
    },
    async fetchSupportReqs(team) {
      const store = useAuthStore();
      const result = await store.fetchUserSupportRequests(team);
      if (result.status) {
        this.supportReqs = {
          total: result.data.total ?? null,
          pending: result.data.pending ?? null,
          closed: result.data.closed ?? null,
        };
      } else {
        this.supportReqs = { total: null, pending: null, closed: null };
      }
    },
    async fetchVulnsFixed(team) {
      const store = useAuthStore();
      const result = await store.fetchUserVulnerabilitiesFixed(team);
      if (result.status) {
        this.vulnsFixed = {
          total: result.data.total_fixed ?? null,
          critical: result.data.critical_fixed ?? null,
          high: result.data.high_fixed ?? null,
          medium: result.data.medium_fixed ?? null,
          low: result.data.low_fixed ?? null,
        };
      } else {
        this.vulnsFixed = { total: null, critical: null, high: null, medium: null, low: null };
      }
    },
    async fetchVulns(team) {
      const store = useAuthStore();
      const result = await store.fetchUserVulnerabilities(team);
      if (result.status) {
        this.vulns = {
          critical: result.data.critical ?? null,
          high: result.data.high ?? null,
          medium: result.data.medium ?? null,
          low: result.data.low ?? null,
        };
      } else {
        this.vulns = { critical: null, high: null, medium: null, low: null };
      }
    },
    async fetchMitigationByTeam() {
      const store = useAuthStore();
      const result = await store.fetchUserMitigationByTeam();
      if (result.status) {
        this.mitigationByTeamData = result.data;
        if (Array.isArray(result.data.member_teams) && result.data.member_teams.length) {
          this.userTeams = result.data.member_teams;
        }
      }
    },
    async fetchVulnAssetCount() {
      const store = useAuthStore();
      const result = await store.fetchUserMitigationVulnAssetCount();
      if (result.status) {
        this.vulnAssetCountData = result.data;
      }
    },
    async openModal(severity) {
      await this.loadRiskCriteria();
      this.modalSeverity = severity;
      this.modalDays = this.riskCriteria[severity] ?? null;
      this.modalReason = '';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.modalSeverity = null;
      this.modalDays = null;
      this.modalReason = '';
    },
    async submitRiskCriteria() {
      if (!this.modalDays) { alert('Please enter a value'); return; }
      const updated = {
        critical: String(this.riskCriteria.critical ?? ''),
        high: String(this.riskCriteria.high ?? ''),
        medium: String(this.riskCriteria.medium ?? ''),
        low: String(this.riskCriteria.low ?? ''),
        [this.modalSeverity]: String(this.modalDays),
      };
      this.riskUpdating = true;
      const store = useAuthStore();
      const hasExisting = !!(localStorage.getItem('riskCriteriaId') || localStorage.getItem('riskId'));
      let result;
      if (hasExisting) {
        result = await store.updateUserRiskCriteria(updated);
        if (result.status && result.data?.risk_criteria?._id) {
          localStorage.setItem('riskCriteriaId', result.data.risk_criteria._id);
          localStorage.setItem('riskId', result.data.risk_criteria._id);
        }
      } else {
        result = await store.addRiskCriteria(updated);
        if (result.status && result.data?._id) {
          localStorage.setItem('riskCriteriaId', result.data._id);
          localStorage.setItem('riskId', result.data._id);
        }
      }
      this.riskUpdating = false;
      if (result.status) {
        this.riskCriteria = { ...updated };
        this.closeModal();
        // Re-fetch mitigation timeline immediately with fresh data
        await this.fetchMitigation(this.selectedTeam || undefined);
      } else {
        alert(result.message || 'Failed to save risk criteria');
      }
    },
    async loadRiskCriteria() {
      // Try user-side list API first
      const userResult = await this.authStore.fetchUserRiskCriteria();
      if (userResult.status && userResult.data) {
        const d = userResult.data;
        if (d._id) { localStorage.setItem('riskId', d._id); localStorage.setItem('riskCriteriaId', d._id); }
        this.riskCriteria = { critical: d.critical ?? null, high: d.high ?? null, medium: d.medium ?? null, low: d.low ?? null };
        return;
      }
      // Try user-side get-by-id API
      const userByIdResult = await this.authStore.getUserRiskCriteriaById();
      if (userByIdResult.status && userByIdResult.data) {
        const d = userByIdResult.data?.risk_criteria || userByIdResult.data;
        if (d._id) { localStorage.setItem('riskId', d._id); localStorage.setItem('riskCriteriaId', d._id); }
        this.riskCriteria = { critical: d.critical ?? null, high: d.high ?? null, medium: d.medium ?? null, low: d.low ?? null };
        return;
      }
      // Fallback: admin endpoints
      let result = await this.authStore.getRiskCriteriaById();
      if (!result.status) {
        result = await this.authStore.getRiskCriteriaByAdmin();
        if (result.status && result.data) {
          const d = result.data?.risk_criteria || result.data;
          if (d._id) { localStorage.setItem('riskId', d._id); localStorage.setItem('riskCriteriaId', d._id); }
          this.riskCriteria = { critical: d.critical ?? null, high: d.high ?? null, medium: d.medium ?? null, low: d.low ?? null };
        }
        return;
      }
      if (result.data?.risk_criteria) {
        const d = result.data.risk_criteria;
        if (d._id) { localStorage.setItem('riskId', d._id); localStorage.setItem('riskCriteriaId', d._id); }
        this.riskCriteria = { critical: d.critical ?? null, high: d.high ?? null, medium: d.medium ?? null, low: d.low ?? null };
      }
    },
    async selectTeam(team) {
      this.selectedTeam = team;
      const t = team === 'both' ? undefined : team;
      await Promise.all([
        this.fetchAssets(team),
        this.fetchVulns(t),
        this.fetchVulnsFixed(t),
        this.fetchSupportReqs(t),
        this.fetchMitigation(t),
        this.fetchMeanTimeRemediate(t),
      ]);
    },
  },
  async mounted() {
    // Load user's assigned teams from localStorage
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userTeams = Array.isArray(user.Member_role) ? user.Member_role : [];
    } catch {
      this.userTeams = [];
    }

    // Default to first team on load
    this.selectedTeam = this.userTeams[0] || '';
    await Promise.all([
      this.fetchAssets(this.selectedTeam),
      this.fetchVulns(this.selectedTeam || undefined),
      this.fetchVulnsFixed(this.selectedTeam || undefined),
      this.fetchSupportReqs(this.selectedTeam || undefined),
      this.fetchMitigation(this.selectedTeam || undefined),
      this.fetchMeanTimeRemediate(undefined),
      this.fetchMitigationByTeam(),
      this.fetchVulnAssetCount(),
      this.loadRiskCriteria(),
    ]);

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  },
};
</script>

<style scoped>
/* ===== LAYOUT ===== */
.ud-content {
  background: #f8f9fc;
  min-height: 100vh;
  padding: 40px 40px 20px 32px;
  margin-top: 60px;
}

/* ===== PAGE HEADER ===== */
.ud-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 28px;
}
.ud-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #241447;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.ud-subtitle {
  font-size: 13px;
  color: #49454f;
  margin: 0;
}

/* Calendar button & popup */
.ud-cal-wrap { position: relative; display: inline-flex; }
.ud-cal-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #7a7580;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.ud-cal-btn:hover { background: #e7e8eb; }
.ud-calendar {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 320px;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  padding: 16px;
  z-index: 1000;
}
.ud-cal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  position: relative;
}
.ud-cal-nav {
  background: #f2f3f6;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  cursor: pointer;
}
.ud-cal-pick {
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #241447;
  text-decoration: underline dotted;
}
.ud-picker-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #cbc4d0;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  z-index: 1100;
  padding: 8px;
  width: 200px;
}
.ud-picker-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; }
.ud-picker-btn {
  background: #f2f3f6;
  border: none;
  border-radius: 6px;
  padding: 5px 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.ud-picker-btn.active { background: #241447; color: #fff; }
.ud-picker-btn:hover:not(.active) { background: #e7e8eb; }
.ud-cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: #49454f;
  margin-bottom: 6px;
}
.ud-cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
  text-align: center;
}
.ud-cal-day {
  padding: 6px 4px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
}
.ud-cal-day:hover { background: #f2f3f6; }
.bg-maroon { background-color: maroon !important; }
.bg-red { background-color: red !important; }

/* Team Dropdown */
.ud-team-dropdown {
  position: relative;
  display: inline-block;
  min-width: 180px;
}
.ud-team-btn {
  background: #fff;
  border: 1px solid #cbc4d0;
  border-radius: 50px;
  padding: 8px 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #241447;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.15s;
}
.ud-team-btn:hover { background: #f2f3f6; }
.dropdown-content {
  display: none;
  position: absolute;
  background: #fff;
  min-width: 100%;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.14);
  z-index: 1000;
  margin-top: 4px;
  overflow: hidden;
}
.dropdown-content a {
  padding: 10px 16px;
  display: block;
  text-decoration: none;
  color: #241447;
  font-size: 13px;
  transition: background 0.15s;
}
.dropdown-content a:hover { background: #f2f3f6; }
.ud-team-dropdown.show .dropdown-content { display: block; }

/* ===== STAT CARDS ===== */
.ud-stat-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 22px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  height: 100%;
}
.ud-stat-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}
.ud-icon-purple { background: #eaddff; color: #241447; }
.ud-icon-teal   { background: #d4f4f5; color: #0f696e; }
.ud-icon-navy   { background: #dde1f9; color: #241447; }

.ud-stat-label {
  font-size: 12px;
  font-weight: 600;
  color: #49454f;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 8px;
}
.ud-stat-num {
  font-size: 2rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}
.ud-big-num {
  font-size: 1.8rem;
  font-weight: 700;
  color: #241447;
  white-space: nowrap;
}

/* Severity bars row */
.ud-sev-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}
.ud-sev-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.ud-sev-num {
  font-size: 14px;
  font-weight: 700;
  color: #191c1e;
}
.ud-sev-bar {
  width: 32px;
  height: 4px;
  border-radius: 2px;
}
.ud-bar-critical { background: #ba1a1a; }
.ud-bar-high     { background: #c05000; }
.ud-bar-medium   { background: #8a6000; }
.ud-bar-low      { background: #0f696e; }
.ud-sev-label {
  font-size: 10px;
  font-weight: 600;
}
.ud-label-critical { color: #ba1a1a; }
.ud-label-high     { color: #c05000; }
.ud-label-medium   { color: #8a6000; }
.ud-label-low      { color: #0f696e; }

/* ===== SECTION CARD ===== */
.ud-section-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 28px 32px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.ud-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.ud-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}
.ud-pending-badge {
  background: #eaddff;
  color: #241447;
  font-size: 12px;
  font-weight: 700;
  border-radius: 50px;
  padding: 6px 16px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.ud-pending-badge:hover { background: #d9cfff; }

/* Team Tabs */
.ud-team-tab {
  border: 1px solid #cbc4d0;
  background: #fff;
  border-radius: 50px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #49454f;
  cursor: pointer;
  transition: all 0.15s;
}
.ud-team-tab:hover { background: #f2f3f6; }
.ud-team-tab-active { background: #241447; color: #fff; border-color: #241447; }

.ud-assigned-label {
  font-size: 13px;
  color: #49454f;
  margin-bottom: 16px;
}

/* Risk Criteria Row */
.ud-risk-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}
.ud-risk-item { display: flex; flex-direction: column; gap: 6px; }
.ud-risk-label {
  display: inline-block;
  border-radius: 50px;
  padding: 4px 18px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  border: 1px solid currentColor;
}
.ud-risk-critical { color: #ba1a1a; border-color: #ba1a1a; background: #fff9f9; }
.ud-risk-high     { color: #c05000; border-color: #c05000; background: #fff6f2; }
.ud-risk-medium   { color: #8a6000; border-color: #8a6000; background: #fffdf0; }
.ud-risk-low      { color: #0f696e; border-color: #0f696e; background: #f0fbfb; }
.ud-risk-val {
  background: #eaddff;
  color: #241447;
  border: none;
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: default;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

/* Vuln count label */
.ud-vuln-count-label {
  font-size: 14px;
  font-weight: 700;
  color: #241447;
}
.ud-more-link {
  font-size: 13px;
  font-weight: 700;
  color: #0f696e;
}
.ud-more-link:hover { opacity: 0.7; }

/* Vuln cards */
.ud-vuln-card {
  background: #f8f9fc;
  border: 1px solid #e8e8ee;
  border-radius: 14px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 0.15s;
}
.ud-vuln-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.ud-vuln-assets { font-size: 12px; color: #49454f; font-weight: 500; }
.ud-vuln-name {
  font-size: 13px;
  font-weight: 700;
  color: #241447;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 8px 0;
}
.ud-affected-label { font-size: 12px; color: #49454f; font-weight: 500; }

/* Severity badges on vuln cards */
.ud-sev-badge {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 8px;
  border-radius: 4px;
}
.ud-badge-critical { background: #ffdad6; color: #ba1a1a; }
.ud-badge-high     { background: #ffe0cc; color: #c05000; }
.ud-badge-medium   { background: #fff3cc; color: #8a6000; }
.ud-badge-low      { background: #a1ecf2; color: #004f53; }

/* Tooltip */
.ud-tooltip {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-left: 4px;
  color: #7a7580;
}
.ud-tooltip::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: #1e1e2d;
  color: #fff;
  padding: 7px 11px;
  border-radius: 8px;
  font-size: 11px;
  width: 220px;
  text-align: left;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1050;
  font-weight: 400;
  text-transform: none;
  letter-spacing: 0;
}
.ud-tooltip:hover::after { opacity: 1; }

/* Modal */
.custom-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-modal-box {
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
  min-width: 360px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}

/* Legacy patch-btn / download-btn used in report popup */
.patch-btn {
  font-weight: 600;
  font-size: 14px;
  padding: 8px 18px;
  background-color: #eaddff;
  color: #241447;
  border: none;
}
.download-btn {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 8px 22px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}
.download-btn:hover { background: #3a2a5e; }

/* Preserve old dropdown for the dropdown-btn class used inside report popup */
.dropdown-btn {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 50px;
    padding: 8px 40px 8px 16px;
    cursor: pointer;
    position: relative;
    font-size: 14px;
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

</style>