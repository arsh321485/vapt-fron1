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

          <div class="col-11 pt-5 pb-3 pe-5 mt-2">
            <div class="d-flex justify-content-between py-3">
              <div class="d-flex flex-row gap-2">
                <div>
                  <h2>Vulnerability Management Program</h2>
                  <p style="color: rgba(0, 0, 0, 0.6);font-size:16px;font-weight: 500;">{{ selectedTeam === 'both' ? 'All Teams' : selectedTeam }}</p>
                </div>
                <div>
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
              <div class="d-flex flex-row gap-3">
                <!-- <div><button class="btn fw-semibold px-3 py-2" style="border-radius: 20px;border: 1px solid rgba(0, 0, 0, 0.12);color: rgba(49, 33, 177, 1);" @click="showReport = true"><i class="bi bi-download me-2"></i> Download Report</button></div> -->

                <!-- Overlay Popup -->
                  <div v-if="showReport" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                  style="background-color: rgba(0, 0, 0, 0.6); z-index: 1050;">
                  <div class="bg-white p-4 rounded shadow" style="width: 600px; max-height: 90vh; overflow-y: auto; position: relative;">
                  <!-- Close Button -->
                  <button @click="showReport = false"
                  class="btn-close position-absolute top-0 end-0 m-3"
                  aria-label="Close"></button>
                  <h2 class="mb-2 text-center">Download Report</h2>
                    <p class="mb-2 text-center" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Download report</p>
                    <button type="button" class="btn patch-btn rounded-pill text-nowrap ms-3 mb-3"> June 1 - June 30 <i class="bi bi-calendar-minus"></i>
                    </button>

                    <!-- Accordion -->
                    <div class="accordion" id="globalReportAccordion">
                      <div class="accordion-item">
                        <h2 class="accordion-header" id="headingOne">
                        <button
                          class="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseOne"
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >Assets(11) <span class="text-primary ms-2">4 selected</span>
                        </button>
                        </h2>
                        <div id="collapseOne"
                        class="accordion-collapse collapse show"
                        aria-labelledby="headingOne"
                        data-bs-parent="#globalReportAccordion">
                        <div class="accordion-body">
                         Assets
                        </div>
                        </div>
                        </div>

                                    <div class="accordion-item">
                                      <h2 class="accordion-header" id="headingTwo">
                                        <button
                                          class="accordion-button collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#collapseTwo"
                                          aria-expanded="false"
                                          aria-controls="collapseTwo"
                                        >
                                          Vulnerabilities
                                        </button>
                                      </h2>
                                      <div
                                        id="collapseTwo"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="headingTwo"
                                        data-bs-parent="#globalReportAccordion"
                                      >
                                        <div class="accordion-body">
                                          Vulnerabilities
                                        </div>
                                      </div>
                                    </div>

                                    <div class="accordion-item">
                                      <h2 class="accordion-header" id="headingThree">
                                        <button
                                          class="accordion-button collapsed"
                                          type="button"
                                          data-bs-toggle="collapse"
                                          data-bs-target="#collapseThree"
                                          aria-expanded="false"
                                          aria-controls="collapseThree"
                                        >
                                          Team Role
                                        </button>
                                      </h2>
                                      <div
                                        id="collapseThree"
                                        class="accordion-collapse collapse"
                                        aria-labelledby="headingThree"
                                        data-bs-parent="#globalReportAccordion"
                                      >
                                        <div class="accordion-body">
                                          Team Roles
                                        </div>
                                      </div>
                                    </div>

                                    
                    </div>

                    <button class="btn download-btn btn-sm ms-3 mt-4"><i class="bi bi-download me-2"></i> Download report</button>

                    </div>
                    </div>

                <div class="dropdown" ref="teamDropdown">
                  <div class="dropdown-btn" @click="toggleTeamDropdown"> {{ selectedTeam === 'both' ? 'All Teams' : selectedTeam }}</div>
                  <div class="dropdown-content">
                    <a href="#" @click.prevent="selectTeam('both')">All Teams</a>
                    <a v-for="team in userTeams" :key="team" href="#" @click.prevent="selectTeam(team)">{{ team }}</a>
                  </div>
                </div>
              </div>
            </div>
            

            <div class="row">
              <div class="col-3">
                <div class="card pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Total assets assigned <span class="info-tooltip" data-tooltip="Total number of assets currently registered and monitored within the platform."><i class="bi bi-info-circle" style="color: rgba(13, 0, 119, 1);font-size: 14px;"></i></span></p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <h1 class="text-212">{{ assetsLoading ? '...' : (totalAssets ?? '—') }}</h1>
                    
                  </div>
                </div>
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
                        <div class="fs-5 fw-semibold">{{ vulns.critical ?? '—' }}</div>
                        <div class="bar maroon vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: maroon;">● Critical</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulns.high ?? '—' }}</div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● High</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulns.medium ?? '—' }}</div>
                        <div class="bar yellow vul-bar mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulns.low ?? '—' }}</div>
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
                        <div class="fs-4 fw-semibold">{{ mitigation.critical ?? '—' }}</div>
                        <div class="bar maroon w-100 mt-1"></div>
                        <small class="mt-1 d-block" style="color: maroon;">● Critical</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-4 fw-semibold">{{ mitigation.high ?? '—' }}</div>
                        <div class="bar red w-100 mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● High</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-4 fw-semibold">{{ mitigation.medium ?? '—' }}</div>
                        <div class="bar yellow w-100 mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-4 fw-semibold">{{ mitigation.low ?? '—' }}</div>
                        <div class="bar green w-100 mt-1"></div>
                        <small class="text-success mt-1 d-block">● Low</small>
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
                    <h1 class="text-78">{{ vulnsFixed.total ?? '—' }}</h1>
                    <div class="d-flex justify-content-center align-items-end mb-1">
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulnsFixed.critical ?? '—' }}</div>
                        <div class="bar maroon vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: maroon;">● Critical<br> fixed</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulnsFixed.high ?? '—' }}</div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● High <br> fixed</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulnsFixed.medium ?? '—' }}</div>
                        <div class="bar yellow vul-bar mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium<br> fixed</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ vulnsFixed.low ?? '—' }}</div>
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
                    <h1 class="text-78">{{ meanTimeRemediate ?? '—' }}</h1>
                  </div>
                </div>
              </div>
              <div class="col-4">
                  <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Support Requests<span class="info-tooltip" data-tooltip="Total number of support requests raised or tickets raised in the system, categorized by their current status such as Pending or Closed."><i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></span></p>
                  </div>
                  <div class="d-flex flex-row gap-5 py-3">
                    <h1 class="text-78">{{ supportReqs.total ?? '—' }}</h1>
                    <div class="d-flex justify-content-center align-items-end mb-1">
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ supportReqs.pending ?? '—' }}</div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: red;">● Pending</small>
                      </div>
                      <div class="text-center">
                        <div class="fs-5 fw-semibold">{{ supportReqs.closed ?? '—' }}</div>
                        <div class="bar light-green vul-bar mt-1"></div>
                        <small class="mt-1 d-block" style="color: rgb(71, 199, 71);">● Closed</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>

            <div class="row mt-4">
              <div class="d-flex justify-content-between">
                <h4>Mitigation Strategy</h4>
                <!-- <button type="button" class="btn pending-approval-btn rounded-pill">
                {{ supportReqs.pending ?? '—' }} Support requests ongoing
                <i class="bi bi-arrow-right ms-1 fs-5"></i> -->

                 <router-link to="/userexception" class="btn pending-approval-btn rounded-pill text-decoration-none">{{ supportReqs.pending ?? '—'  }} Support requests ongoing
                <i class="bi bi-arrow-right ms-1 fs-5"></i></router-link>
              <!-- </button> -->
              </div>
              <div class="row mt-3 mb-2">
                <div class="col-12">
                  <div class="d-flex gap-3 flex-wrap">
                    <button
                      v-for="team in userTeams"
                      :key="team"
                      class="btn btn-pill fw-semibold"
                      :class="selectedTeam === team ? 'btn-primary active-tab' : 'btn-outline-secondary other-btn'"
                      @click="selectTeam(team)"
                    >
                      {{ team }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="mt-2 d-flex align-items-center mb-2">
                <span style="color: rgba(0, 0, 0, 0.87);">
                  Assigned to {{ selectedTeam === 'both' ? 'All Teams' : selectedTeam }} team
                </span>
              </div>
              <div class="d-flex gap-4 my-3">
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100" style="color: maroon;">Critical</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.critical ?? '—' }} <i class="bi bi-plus-circle text-danger ms-2" style="cursor:pointer;" @click.stop="openModal('critical')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-danger">High</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.high ?? '—' }} <i class="bi bi-plus-circle text-danger ms-2" style="cursor:pointer;" @click.stop="openModal('high')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-warning">Medium</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.medium ?? '—' }} <i class="bi bi-plus-circle text-danger ms-2" style="cursor:pointer;" @click.stop="openModal('medium')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-success">Low</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.low ?? '—' }} <i class="bi bi-plus-circle text-danger ms-2" style="cursor:pointer;" @click.stop="openModal('low')"></i></button>
                      </div>
              </div>
              <div class="row mt-2">
                <div class="">
                    <div class="d-flex justify-content-between">
                      <p style="color: rgba(0, 0, 0, 0.6);font-weight: 600;font-size: 15px;">Vulnerabilities ({{ mitigationActiveTeamData.count }})</p>
                      <router-link :to="{ path: '/usermissingsecurityupdates', query: { team: selectedTeam } }">
                        <button class="btn border-0" style="color: rgba(49, 33, 177, 1); font-weight: 600;">More details <i class="bi bi-arrow-right"></i></button>
                      </router-link>
                    </div>
                    <div v-if="mitigationActiveTeamData.vulnerabilities.length === 0" class="py-3 text-muted">
                      No vulnerabilities assigned to this team.
                    </div>
                    <div v-else class="row">
                        <div class="col-3 d-flex" v-for="vuln in mitigationActiveTeamData.vulnerabilities.slice(0, 4)" :key="vuln.host_name + vuln.plugin_name">
                          <div class="card py-4 px-3 w-100" style="border-radius: 12px;">
                            <div class="d-flex justify-content-between">
                              <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">
                                <i class="bi bi-hdd-network me-1"></i>{{ vulnAssetCountMap[vuln.plugin_name] ?? 1 }} assets
                              </p>
                              <span :style="{ color: getSeverityColor(vuln.risk_factor), fontSize: '12px', fontWeight: '600' }">{{ vuln.risk_factor }}</span>
                            </div>
                            <h4 class="truncated-text" :title="vuln.plugin_name">{{ vuln.plugin_name }}</h4>
                            <div class="d-flex justify-content-start mt-2">
                              <i class="bi bi-hdd-network me-2"></i>
                              <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 14px;margin-top: 2px">
                                {{ vuln.assets.length }} affected asset{{ vuln.assets.length !== 1 ? 's' : '' }}
                              </h6>
                            </div>
                            <div class="text-end">
                              <!-- <router-link :to="{ path: '/usermissingsecurityupdates', query: { team: selectedTeam } }" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;text-decoration: none;">
                                Details <i class="bi bi-arrow-right"></i>
                              </router-link> -->
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                 
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
.bg-maroon {
  background-color: maroon !important;
}
.bg-red {
  background-color: red !important;
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

.active-tab {
  background-color: #EAE8FF;
  color: #3121B1;
  border: none;
  font-size: 13px;
}
.raised-table tr th {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
}

.raised-tbody tr td {
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
}
.fixes-btn {
    color: rgba(49, 33, 177, 1);
    font-weight: 600;
}

.dropdown {
    position: relative;
    display: inline-block;
    width: 250px;
}

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
    font-size: 15px;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown.show .dropdown-content {
    display: block;
}

.patch-btn {
  font-weight: 600;
  font-size: 14px;
  padding: 8px 18px;
  background-color: rgba(230, 227, 255, 1);
  color: rgba(49, 33, 177, 1);
  border: none;
}

.pending-approval-btn {
  font-weight: 600;
  font-size: 12px;
  padding: 8px 15px;
  background-color: rgba(230, 227, 255, 1);
  color: rgba(49, 33, 177, 1);
  border: none;
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
  width: 230px;
  text-align: left;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1050;
}
.info-tooltip:hover::after {
  opacity: 1;
}
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
</style>