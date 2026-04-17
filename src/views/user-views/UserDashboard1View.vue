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

            <!-- ===== 6-CARD ANALYTICS GRID ===== -->
            <!-- ROW 1: Assets + MTTR | Vulnerabilities | Mitigation Timeline -->
            <div class="row g-2 mb-3 align-items-stretch">

              <!-- Col 1: Total Assets (mini) + MTTR (mini) side by side -->
              <div class="col-4">
                <div class="row g-2 h-100 row1-equal-height">

                  <!-- Total Assets mini card -->
                  <div class="col-5 d-flex flex-column">
                    <router-link to="/userassets" class="text-decoration-none d-flex flex-column h-100">
                      <div class="dash-card row1-equal-card h-100 d-flex flex-column" style="padding:12px 10px; background:linear-gradient(145deg,#ffffff 60%,#f0fdf4 100%);">
                        <div class="d-flex align-items-center gap-1 mb-2">
                          <div class="dash-icon-wrap" style="width:28px;height:28px;">
                            <i class="bi bi-laptop dash-icon-teal" style="font-size:13px;"></i>
                          </div>
                          <span class="dash-card-label" style="font-size:11px;">Total Assets</span>
                        </div>
                        <div class="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                          <div class="dash-big-num text-center total-assets-highlight" style="font-size:2.2rem; line-height:1;">{{ assetsLoading ? '...' : (totalAssets ?? '—') }}</div>
                        </div>
                      </div>
                    </router-link>
                  </div>

                  <!-- MTTR mini card -->
                  <div class="col-7 d-flex flex-column">
                    <div class="dash-card dash-card-tight row1-equal-card h-100 d-flex flex-column" style="padding:12px 10px;">
                      <div class="d-flex align-items-center gap-1 mb-2">
                        <div class="dash-icon-wrap" style="width:34px;height:34px;">
                          <i class="bi bi-hourglass-split dash-icon-teal" style="font-size:16px;"></i>
                        </div>
                        <span class="dash-card-label" style="font-size:11px;">MTTR</span>
                        <span class="info-tooltip" data-tooltip="Average remediation time based on risk criteria."><i class="bi bi-info-circle dash-info-icon"></i></span>
                      </div>

                      <!-- Donut gauge -->
                      <div class="d-flex justify-content-center align-items-center flex-grow-1">
                        <div style="position:relative; width:122px; height:122px;">
                          <svg width="122" height="122" viewBox="0 0 132 132">
                            <defs>
                              <linearGradient id="mttr-grad-user" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#10b981"/>
                                <stop offset="50%" stop-color="#f59e0b"/>
                                <stop offset="100%" stop-color="#ef4444"/>
                              </linearGradient>
                            </defs>
                            <circle cx="66" cy="66" r="48" fill="none" stroke="#f1f5f9" stroke-width="12"/>
                            <circle cx="66" cy="66" r="48" fill="none"
                              stroke="url(#mttr-grad-user)" stroke-width="12"
                              stroke-linecap="round"
                              stroke-dasharray="301.6"
                              :stroke-dashoffset="301.6 - (Math.min(meanTimeRemediateWeeks, 4) / 4 * 301.6)"
                              transform="rotate(-90 66 66)"/>
                          </svg>
                          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;white-space:nowrap;">
                            <div style="font-size:13px;font-weight:900;color:#1f2937;line-height:1.1;">{{ meanRemediateHuman }}</div>
                            <div style="font-size:9px;color:#94a3b8;font-weight:700;letter-spacing:0.04em;margin-top:2px;">MTTR</div>
                          </div>
                        </div>
                      </div>

                      <div class="d-flex justify-content-between align-items-center pt-2" style="border-top:1px solid #f1f5f9; margin-top:8px;">
                        <span style="font-size:9px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;">Avg. remediation</span>
                        <span style="font-size:10px;font-weight:700;color:#0f696e;">In progress</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Card 2: Vulnerabilities Bar Chart -->
              <div class="col-4">
                <div class="dash-card dash-card-tight dash-card-analytics row1-equal-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-shield-fill-exclamation dash-icon-teal" style="font-size: 14px;"></i>
                    </div>
                    <span class="dash-card-label">Vulnerabilities</span>
                    <span class="info-tooltip" data-tooltip="Total number of identified vulnerabilities across all assets, categorized by severity levels."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>

                  <!-- Bar Chart -->
                  <div class="d-flex align-items-end justify-content-around gap-2 px-2" style="height: 82px; margin-top: 35px;">
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulns.critical || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#dc2626,#b91c1c); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((vulns.critical || 0) / totalVulnerabilities * 66) + 'px' : '4px' }"></div>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulns.high || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#f97316,#ef4444); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((vulns.high || 0) / totalVulnerabilities * 66) + 'px' : '4px' }"></div>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulns.medium || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#fbbf24,#f59e0b); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((vulns.medium || 0) / totalVulnerabilities * 66) + 'px' : '4px' }"></div>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulns.low || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#34d399,#10b981); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((vulns.low || 0) / totalVulnerabilities * 66) + 'px' : '4px' }"></div>
                    </div>
                  </div>
                  <div style="border-top: 2px solid #e5e7eb; margin: 0 8px;"></div>
                  <div class="d-flex justify-content-around mt-1 flex-wrap px-1">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#dc2626;"></span>Critical</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f97316;"></span>High</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f59e0b;"></span>Medium</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#10b981;"></span>Low</div>
                  </div>
                </div>
              </div>

              <!-- Card 3: Mitigation Criteria Timeline -->
              <div class="col-4">
                <div class="dash-card dash-card-tight dash-card-analytics row1-equal-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-clock-history dash-icon-teal" style="font-size:14px;"></i>
                    </div>
                    <span class="dash-card-label">Mitigation Criteria Timeline</span>
                    <span class="info-tooltip" data-tooltip="Displays the remaining remediation time for vulnerabilities based on the defined risk criteria."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>

                  <div v-if="!mitigation.critical && !mitigation.high && !mitigation.medium && !mitigation.low" class="d-flex flex-column align-items-center justify-content-center py-2" style="opacity:0.55;">
                    <i class="bi bi-clock-history" style="font-size:2rem;color:#cbd5e1;margin-bottom:8px;"></i>
                    <span style="font-size:11px;color:#94a3b8;font-weight:600;">Awaiting timeline data</span>
                  </div>

                  <!-- Half-circle gauges -->
                  <div class="d-flex justify-content-around align-items-end" style="gap:2px; margin-top:54px;">
                    <div class="d-flex flex-column align-items-center gap-1">
                      <div style="position:relative; width:66px; height:38px; overflow:hidden;">
                        <svg width="66" height="38" viewBox="0 0 72 42">
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none"
                            :stroke="mitigationPct('critical').compliancePct <= 0 ? '#d1d5db' : '#e53e3e'"
                            stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="94"
                            :stroke-dashoffset="94 - (mitigationPct('critical').compliancePct / 100 * 94)"/>
                        </svg>
                        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;">
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ mitigation.critical || '--' }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#e53e3e;">Critical</span>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1">
                      <div style="position:relative; width:66px; height:38px; overflow:hidden;">
                        <svg width="66" height="38" viewBox="0 0 72 42">
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none"
                            :stroke="mitigationPct('high').compliancePct <= 0 ? '#d1d5db' : '#fc6b57'"
                            stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="94"
                            :stroke-dashoffset="94 - (mitigationPct('high').compliancePct / 100 * 94)"/>
                        </svg>
                        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;">
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ mitigation.high || '--' }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#fc6b57;">High</span>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1">
                      <div style="position:relative; width:66px; height:38px; overflow:hidden;">
                        <svg width="66" height="38" viewBox="0 0 72 42">
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none"
                            :stroke="mitigationPct('medium').compliancePct <= 0 ? '#d1d5db' : '#f59e0b'"
                            stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="94"
                            :stroke-dashoffset="94 - (mitigationPct('medium').compliancePct / 100 * 94)"/>
                        </svg>
                        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;">
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ mitigation.medium || '--' }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#f59e0b;">Medium</span>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1">
                      <div style="position:relative; width:66px; height:38px; overflow:hidden;">
                        <svg width="66" height="38" viewBox="0 0 72 42">
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none" stroke="#f1f5f9" stroke-width="8" stroke-linecap="round"/>
                          <path d="M6 38 A30 30 0 0 1 66 38" fill="none"
                            :stroke="mitigationPct('low').compliancePct <= 0 ? '#d1d5db' : '#10b981'"
                            stroke-width="8" stroke-linecap="round"
                            stroke-dasharray="94"
                            :stroke-dashoffset="94 - (mitigationPct('low').compliancePct / 100 * 94)"/>
                        </svg>
                        <div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);text-align:center;white-space:nowrap;">
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ mitigation.low || '--' }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#10b981;">Low</span>
                    </div>
                  </div>

                  <div class="d-flex justify-content-center gap-3 mt-2" style="border-top:1px solid #f1f5f9; padding-top:10px;">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#0f696e;"></span>SLA Compliance</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#d1d5db;"></span>Non-Compliance</div>
                  </div>
                </div>
              </div>
            </div>
            <!-- end row 1 -->

            <!-- ROW 2: Support Requests | Total Vulns Fixed | Mitigation Timeline Extension -->
            <div class="row g-2 mb-3 align-items-stretch">

              <!-- Support Requests -->
              <div class="col-4">
                <div class="dash-card dash-card-compact dash-card-tight h-100 d-flex flex-column" style="min-height:142px;">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-headset dash-icon-teal" style="font-size:14px;"></i>
                    </div>
                    <span class="dash-card-label">Support Requests</span>
                    <span class="info-tooltip" data-tooltip="Total number of support requests raised."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>

                  <div class="d-flex align-items-center gap-2 flex-grow-1">
                    <!-- Donut ring -->
                    <div style="position:relative; width:80px; height:80px; flex-shrink:0;">
                      <svg width="80" height="80" viewBox="0 0 90 90">
                        <circle cx="45" cy="45" r="30" fill="none" stroke="#f1f5f9" stroke-width="9"/>
                        <circle cx="45" cy="45" r="30" fill="none" stroke="#ef4444" stroke-width="9"
                          stroke-linecap="butt"
                          stroke-dasharray="188.5"
                          :stroke-dashoffset="188.5 - (supportTotal ? supportPending / supportTotal * 188.5 : 0)"
                          transform="rotate(-90 45 45)"/>
                        <circle cx="45" cy="45" r="30" fill="none" stroke="#0f696e" stroke-width="9"
                          stroke-linecap="butt"
                          stroke-dasharray="188.5"
                          :stroke-dashoffset="188.5 - (supportTotal ? supportClosed / supportTotal * 188.5 : 0)"
                          :transform="`rotate(${(supportTotal ? supportPending / supportTotal * 360 : 0) - 90} 45 45)`"/>
                      </svg>
                      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                        <div style="font-size:1.2rem;font-weight:900;color:#1e293b;line-height:1;">{{ String(supportTotal).padStart(2,'0') }}</div>
                        <div style="font-size:8px;color:#94a3b8;font-weight:600;letter-spacing:0.04em;">TOTAL</div>
                      </div>
                    </div>

                    <!-- Stats -->
                    <div class="d-flex flex-column gap-2 flex-grow-1">
                      <div>
                        <div class="d-flex align-items-center mb-1">
                          <span class="dash-dot me-1" style="background:#ef4444;"></span>
                          <span style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Pending</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <div style="height:5px;width:78%;background:#fee2e2;border-radius:4px;overflow:hidden;">
                            <div :style="{width:supportTotal?(supportPending/supportTotal*100)+'%':'0%',background:'#ef4444',height:'100%',borderRadius:'4px',transition:'width 0.6s ease'}"></div>
                          </div>
                          <span style="font-size:13px;font-weight:800;color:#1f2937;">{{ supportPending }}</span>
                        </div>
                      </div>
                      <div>
                        <div class="d-flex align-items-center mb-1">
                          <span class="dash-dot me-1" style="background:#0f696e;"></span>
                          <span style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Closed</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <div style="height:5px;width:78%;background:#d1e7dd;border-radius:4px;overflow:hidden;">
                            <div :style="{width:supportTotal?(supportClosed/supportTotal*100)+'%':'0%',background:'#0f696e',height:'100%',borderRadius:'4px',transition:'width 0.6s ease'}"></div>
                          </div>
                          <span style="font-size:13px;font-weight:800;color:#1f2937;">{{ supportClosed }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Total Vulnerabilities Fixed -->
              <div class="col-4">
                <div class="dash-card dash-card-tight h-100">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-patch-check-fill dash-icon-teal" style="font-size:14px;"></i>
                    </div>
                    <span class="dash-card-label">Total Vulnerabilities Fixed</span>
                    <span class="info-tooltip" data-tooltip="Total count of vulnerabilities successfully remediated."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="dash-big-num" style="font-size:2.6rem;">{{ String(vulFixedTotal).padStart(2, '0') }}</span>
                    <span style="font-size:10px; font-weight:700; color:#10b981; background:#f0fdf4; padding:3px 9px; border-radius:20px; letter-spacing:0.03em;">Remediated</span>
                  </div>
                  <div class="d-flex align-items-end justify-content-around gap-2 px-3" style="height:80px;">
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulFixedCritical }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#dc2626,#b91c1c); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: vulFixedTotal ? (vulFixedCritical / vulFixedTotal * 64) + 'px' : '4px' }"></div>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulFixedHigh }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#f97316,#ef4444); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: vulFixedTotal ? (vulFixedHigh / vulFixedTotal * 64) + 'px' : '4px' }"></div>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulFixedMedium }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#fbbf24,#f59e0b); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: vulFixedTotal ? (vulFixedMedium / vulFixedTotal * 64) + 'px' : '4px' }"></div>
                    </div>
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ vulFixedLow }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#34d399,#10b981); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: vulFixedTotal ? (vulFixedLow / vulFixedTotal * 64) + 'px' : '4px' }"></div>
                    </div>
                  </div>
                  <div style="border-top:2px solid #e5e7eb; margin:0 8px;"></div>
                  <div class="d-flex justify-content-around mt-2 flex-wrap px-1">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#dc2626;"></span>Critical</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f97316;"></span>High</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f59e0b;"></span>Medium</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#10b981;"></span>Low</div>
                  </div>
                </div>
              </div>

              <!-- Mitigation Timeline Extension -->
              <div class="col-4">
                <div class="dash-card dash-card-tight h-100">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div class="dash-card-label" style="font-size:13px; font-weight:700; color:#1e293b; letter-spacing:0.02em;">Mitigation Timeline Extension</div>
                      <div class="dash-mte-subtitle">Pending requests by team and severity</div>
                    </div>
                    <button type="button" class="dash-mte-link-btn" @click="openMitigationExtensionModal">
                      View Full Report <i class="bi bi-chevron-right"></i>
                    </button>
                  </div>
                  <div class="dash-mte-table-wrap">
                    <table class="dash-mte-table">
                      <thead>
                        <tr>
                          <th>Team</th>
                          <th class="sev-critical">Critical</th>
                          <th class="sev-high">High</th>
                          <th class="sev-medium">Medium</th>
                          <th class="sev-low">Low</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="mteCardRows.length === 0">
                          <td colspan="5" style="text-align:center;color:#94a3b8;font-size:12px;padding:10px 0;">No teams assigned.</td>
                        </tr>
                        <tr v-for="row in mteCardRows" :key="row.key">
                          <td>{{ row.short }}</td>
                          <td><span class="dash-mte-pill critical">{{ String(row.critical).padStart(2,'0') }}</span></td>
                          <td><span class="dash-mte-pill high">{{ String(row.high).padStart(2,'0') }}</span></td>
                          <td><span class="dash-mte-pill medium">{{ String(row.medium).padStart(2,'0') }}</span></td>
                          <td><span class="dash-mte-pill low">{{ String(row.low).padStart(2,'0') }}</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
            <!-- end 6-card analytics grid -->

            <!-- Common Vulnerabilities Section -->
            <div class="mb-4">
              <!-- Section Header -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="cv-section-title">Common Vulnerabilities</h5>
              </div>

              <!-- Team Cards -->
              <div class="row g-3 mb-4">
                <div class="col-md-3" v-for="team in allTeamsData" :key="team.key">
                  <div class="cv-team-card" :class="selectedTeam === team.key ? 'cv-team-card-active' : ''" @click="selectTeam(team.key)">
                    <div class="d-flex justify-content-between align-items-start mb-1">
                      <div class="cv-team-icon-wrap">
                        <i :class="team.icon"></i>
                      </div>
                      <span class="cv-team-id">{{ team.id }}</span>
                    </div>
                    <p class="cv-team-name">{{ team.key }}</p>
                    <h2 class="cv-team-count">{{ team.total }}</h2>
                    <p class="cv-team-assigned">{{ team.assigned }}</p>
                    <div class="d-flex gap-1 flex-wrap mb-2">
                      <span v-for="tag in team.tags" :key="tag.label" class="cv-tag" :class="tag.cls">{{ tag.label }}</span>
                    </div>
                    <div class="cv-team-stats">
                      <div v-if="team.critical != null" class="cv-stat-row">
                        <span class="cv-stat-dot cv-dot-critical"></span>
                        <span class="cv-stat-label">Critical</span>
                        <span class="cv-stat-val">{{ team.critical }}</span>
                      </div>
                      <div v-if="team.high != null" class="cv-stat-row">
                        <span class="cv-stat-dot cv-dot-high"></span>
                        <span class="cv-stat-label">High</span>
                        <span class="cv-stat-val">{{ team.high }}</span>
                      </div>
                    </div>
                    <div class="cv-affected-row">
                      <span class="cv-affected-label">Affected Assets</span>
                      <span class="cv-affected-num">{{ team.affectedAssets }}</span>
                      <span class="cv-affected-type">{{ team.assetType }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vulnerabilities for selected team -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="cv-vuln-heading mb-0">Vulnerabilities ({{ selectedTeam }})</h6>
                <button class="cv-view-link" @click="openMsuModal">
                  More details <i class="bi bi-arrow-right"></i>
                </button>
              </div>

              <div v-if="uniqueVulns.length === 0" class="py-4 text-center text-muted">
                No vulnerabilities assigned to this team.
              </div>
              <div v-else class="row g-3 mb-5">
                <div class="col-md-3" v-for="vuln in uniqueVulns.slice(0, 8)" :key="vuln.plugin_name">
                  <div class="cv-vuln-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <span class="cv-vuln-assets"><i class="bi bi-hdd-network me-1"></i>{{ vulnAssetCountMap[vuln.plugin_name] ?? vuln.assets?.length ?? 1 }} assets</span>
                      <span class="cv-sev-badge" :class="'cv-badge-' + (vuln.risk_factor || '').toLowerCase()">{{ (vuln.risk_factor || '').toUpperCase() }}</span>
                    </div>
                    <h6 class="cv-vuln-name" :title="vuln.plugin_name">{{ vuln.plugin_name }}</h6>
                    <div class="d-flex align-items-center mt-auto pt-2">
                      <i class="bi bi-person me-1" style="color:#94a3b8;font-size:0.78rem;"></i>
                      <span class="cv-affected-label">{{ vuln.assets?.length ?? 1 }} affected asset{{ (vuln.assets?.length ?? 1) !== 1 ? 's' : '' }}</span>
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

      <!-- Mitigation Timeline Extension Modal -->
      <div v-if="showMitigationExtensionModal" class="mte-modal-backdrop" @click.self="closeMitigationExtensionModal">
        <div class="mte-modal-box" @click.stop>
          <div class="mte-modal-header">
            <div>
              <h3 class="mte-modal-title">Mitigation timeline extension</h3>
              <p class="mte-modal-subtitle">Review and manage pending extension requests for vulnerability fixes.</p>
            </div>
            <div class="mte-header-actions">
              <select class="mte-team-dropdown" v-model="mteSelectedTeam">
                <option value="All">All Teams</option>
                <option v-for="team in assignedTeamKeys" :key="team" :value="team">{{ team }}</option>
              </select>
              <button type="button" class="mte-close-btn" @click="closeMitigationExtensionModal">
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          <div class="mte-severity-card mte-critical">
            <div class="mte-severity-head" @click="toggleMteSection('critical')">
              <div class="mte-severity-left">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>Critical Severity Requests</span>
                <span class="mte-badge critical">{{ mteFilteredData.critical.length }} Items</span>
              </div>
              <div class="mte-head-right">
                <button type="button" class="mte-ext-btn" @click.stop="openExtPopup('critical')">Extended Timeline</button>
                <i class="bi" :class="mteOpenSection === 'critical' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div v-if="mteOpenSection === 'critical'" class="mte-table-wrap">
              <div v-if="mteFilteredData.critical.length === 0" class="mte-no-data">No requests for selected team.</div>
              <table v-else class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Vul Name</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in mteFilteredData.critical" :key="row.ip">
                    <td>{{ row.ip }}</td>
                    <td class="mte-vulname" :title="row.vulName">{{ row.vulName }}</td>
                    <td><span class="mte-pill" :class="getMteStatusClass(row.status)">{{ row.status }}</span></td>
                    <td>{{ row.by }}</td>
                    <td>{{ row.date }}</td>
                    <td class="mte-extension">{{ row.ext }}</td>
                    <td class="mte-reason">{{ row.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mte-severity-card">
            <div class="mte-severity-head" @click="toggleMteSection('high')">
              <div class="mte-severity-left">
                <i class="bi bi-exclamation-triangle-fill mte-high-icon"></i>
                <span>High Severity Requests</span>
                <span class="mte-badge high">{{ mteFilteredData.high.length }} Items</span>
              </div>
              <div class="mte-head-right">
                <button type="button" class="mte-ext-btn" @click.stop="openExtPopup('high')">Extended Timeline</button>
                <i class="bi" :class="mteOpenSection === 'high' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div v-if="mteOpenSection === 'high'" class="mte-table-wrap">
              <div v-if="mteFilteredData.high.length === 0" class="mte-no-data">No requests for selected team.</div>
              <table v-else class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Vul Name</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in mteFilteredData.high" :key="row.ip">
                    <td>{{ row.ip }}</td>
                    <td class="mte-vulname" :title="row.vulName">{{ row.vulName }}</td>
                    <td><span class="mte-pill" :class="getMteStatusClass(row.status)">{{ row.status }}</span></td>
                    <td>{{ row.by }}</td>
                    <td>{{ row.date }}</td>
                    <td class="mte-extension">{{ row.ext }}</td>
                    <td class="mte-reason">{{ row.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mte-severity-card">
            <div class="mte-severity-head" @click="toggleMteSection('medium')">
              <div class="mte-severity-left">
                <i class="bi bi-exclamation-circle-fill mte-medium-icon"></i>
                <span>Medium Severity Requests</span>
                <span class="mte-badge medium">{{ mteFilteredData.medium.length }} Items</span>
              </div>
              <div class="mte-head-right">
                <button type="button" class="mte-ext-btn" @click.stop="openExtPopup('medium')">Extended Timeline</button>
                <i class="bi" :class="mteOpenSection === 'medium' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div v-if="mteOpenSection === 'medium'" class="mte-table-wrap">
              <div v-if="mteFilteredData.medium.length === 0" class="mte-no-data">No requests for selected team.</div>
              <table v-else class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Vul Name</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in mteFilteredData.medium" :key="row.ip">
                    <td>{{ row.ip }}</td>
                    <td class="mte-vulname" :title="row.vulName">{{ row.vulName }}</td>
                    <td><span class="mte-pill" :class="getMteStatusClass(row.status)">{{ row.status }}</span></td>
                    <td>{{ row.by }}</td>
                    <td>{{ row.date }}</td>
                    <td class="mte-extension">{{ row.ext }}</td>
                    <td class="mte-reason">{{ row.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mte-severity-card">
            <div class="mte-severity-head" @click="toggleMteSection('low')">
              <div class="mte-severity-left">
                <i class="bi bi-gear-fill mte-low-icon"></i>
                <span>Low Severity Requests</span>
                <span class="mte-badge low">{{ mteFilteredData.low.length }} Items</span>
              </div>
              <div class="mte-head-right">
                <button type="button" class="mte-ext-btn" @click.stop="openExtPopup('low')">Extended Timeline</button>
                <i class="bi" :class="mteOpenSection === 'low' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
            </div>
            <div v-if="mteOpenSection === 'low'" class="mte-table-wrap">
              <div v-if="mteFilteredData.low.length === 0" class="mte-no-data">No requests for selected team.</div>
              <table v-else class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Vul Name</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in mteFilteredData.low" :key="row.ip">
                    <td>{{ row.ip }}</td>
                    <td class="mte-vulname" :title="row.vulName">{{ row.vulName }}</td>
                    <td><span class="mte-pill" :class="getMteStatusClass(row.status)">{{ row.status }}</span></td>
                    <td>{{ row.by }}</td>
                    <td>{{ row.date }}</td>
                    <td class="mte-extension">{{ row.ext }}</td>
                    <td class="mte-reason">{{ row.reason }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Extended Timeline Drawer -->
          <transition name="ext-drawer">
            <div v-if="showExtPopup" class="ext-popup-backdrop" @click.self="closeExtPopup">
              <div class="ext-popup-box" @click.stop>
                <!-- Severity accent bar -->
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
                  <!-- Info banner -->
                  <div class="ext-info-banner">
                    <i class="bi bi-info-circle-fill"></i>
                    <span>Submit a request to extend the remediation deadline for a specific vulnerability on an asset.</span>
                  </div>

                  <div class="ext-section-title"><i class="bi bi-hdd-network"></i> Asset & Vulnerability</div>

                  <div class="ext-popup-field">
                    <label class="ext-popup-label">Asset (IP)</label>
                    <div class="ext-select-wrap">
                      <i class="bi bi-hdd-fill ext-select-icon ext-icon-asset"></i>
                      <select class="ext-popup-select ext-has-icon" v-model="extPopupAsset" @change="extPopupVulName = ''">
                        <option value="">Select Asset</option>
                        <option v-for="ip in extPopupAssetList" :key="ip" :value="ip">{{ ip }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="ext-popup-field">
                    <label class="ext-popup-label">Vulnerability Name</label>
                    <div class="ext-select-wrap">
                      <i class="bi bi-shield-exclamation ext-select-icon ext-icon-vuln"></i>
                      <select class="ext-popup-select ext-has-icon" v-model="extPopupVulName" :disabled="!extPopupAsset">
                        <option value="">Select Vulnerability</option>
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
                        <span>{{ extOriginalDeadlines[extPopupSeverity] }}</span>
                      </div>
                    </div>
                    <div class="ext-popup-field">
                      <label class="ext-popup-label">Extended Deadline</label>
                      <div class="ext-select-wrap">
                        <i class="bi bi-clock-fill ext-select-icon"></i>
                        <select class="ext-popup-select ext-has-icon" v-model="extPopupExtension">
                          <option value="">— Select Extension —</option>
                          <optgroup label="Days">
                            <option value="7 Days">7 Days</option>
                            <option value="14 Days">14 Days</option>
                            <option value="21 Days">21 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="60 Days">60 Days</option>
                            <option value="90 Days">90 Days</option>
                          </optgroup>
                          <optgroup label="Weeks">
                            <option value="1 Week">1 Week</option>
                            <option value="2 Weeks">2 Weeks</option>
                            <option value="4 Weeks">4 Weeks</option>
                            <option value="8 Weeks">8 Weeks</option>
                            <option value="12 Weeks">12 Weeks</option>
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
                  <button type="button" class="mte-btn-secondary" @click="closeExtPopup">
                    Cancel
                  </button>
                  <button type="button" class="mte-btn-primary ext-submit-btn" @click="submitExtPopup" :disabled="!extPopupAsset || !extPopupVulName || !extPopupExtension || !extPopupReason.trim()">
                    <i class="bi bi-send-fill"></i> <span style="color:#fff;">Submit Request</span>
                  </button>
                </div>
              </div>
            </div>
          </transition>

          <div class="mte-modal-footer">
            <button type="button" class="mte-btn-secondary" @click="closeMitigationExtensionModal">Close</button>
          </div>
        </div>
      </div>
      <!-- Missing Security Updates Modal -->
      <div v-if="showMsuModal" class="mte-modal-backdrop" @click.self="closeMsuModal">
        <div class="mte-modal-box" @click.stop>
          <div class="mte-modal-header">
            <div class="d-flex align-items-baseline gap-3">
              <h3 class="mte-modal-title">Missing Security Updates</h3>
              <span v-if="selectedTeam" class="msu-team-badge">{{ selectedTeam }}</span>
            </div>
            <button type="button" class="mte-close-btn" @click="closeMsuModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="msu-modal-body">
            <p class="msu-modal-subtitle">Vulnerability patch status by asset group</p>

            <div v-if="msuGroupedVulns.length === 0" class="msu-modal-empty">
              <i class="bi bi-shield-check me-2"></i>No vulnerabilities found for this team.
            </div>

            <div v-for="group in msuGroupedVulns" :key="group.name" class="msu-modal-group mb-4">
              <div class="msu-modal-group-header">
                <h6 class="msu-group-title">{{ group.name }}</h6>
                <span class="msu-group-count">
                  {{ group.rows.length }} {{ group.rows.length === 1 ? 'asset' : 'assets' }}
                </span>
              </div>

              <div class="msu-modal-table-wrap">
                <table class="msu-modal-table">
                  <thead>
                    <tr>
                      <th>Vulnerability Name</th>
                      <th>Asset</th>
                      <th>OS</th>
                      <th>Severity</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(vuln, index) in group.rows" :key="index">
                      <td>
                        <span class="msu-modal-vuln-name" :title="vuln.plugin_name">{{ vuln.plugin_name }}</span>
                      </td>
                      <td>
                        <span class="msu-modal-asset-chip">{{ vuln.host_name }}</span>
                      </td>
                      <td>
                        <span class="msu-modal-os-text" :title="vuln.os">{{ vuln.os || '—' }}</span>
                      </td>
                      <td>
                        <span class="msu-modal-sev-badge" :class="'msu-modal-sev-' + (vuln.risk_factor || '').toLowerCase()">
                          <span class="msu-modal-sev-dot"></span>
                          {{ vuln.risk_factor }}
                        </span>
                      </td>
                      <td>
                        <span class="msu-modal-status-badge"
                          :class="(vuln.status?.toLowerCase() === 'open') ? 'msu-modal-status-open' : 'msu-modal-status-closed'">
                          <span class="msu-modal-status-dot"></span>
                          <span class="text-capitalize">{{ vuln.status }}</span>
                        </span>
                      </td>
                      <td>
                        <router-link :to="{
                          name: 'UserVulFix',
                          params: { reportId: msuReportId, asset: vuln.host_name },
                          query: { plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor }
                        }">
                          <button class="msu-modal-view-btn">
                            View <i class="bi bi-arrow-right-circle-fill ms-1"></i>
                          </button>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="mte-modal-footer">
            <button type="button" class="mte-btn-secondary" @click="closeMsuModal">Close</button>
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
      showMitigationExtensionModal: false,
      mteOpenSection: null,
      mteSelectedTeam: "All",
      mteTeamMap: {
        "Patch Management":        { short: "Patch Mgmt",   critical: 14, high: 38, medium: 22, low: 12 },
        "Configuration Management":{ short: "Config Mgmt",  critical:  6, high: 24, medium: 84, low: 61 },
        "Network Security":        { short: "Network Sec",  critical: 22, high: 15, medium:  9, low:  4 },
        "Architectural Flaws":     { short: "Arch Flaws",   critical:  3, high:  8, medium: 14, low: 27 },
      },
      mteStaticData: {
        critical: [
          { ip: "192.168.1.104", vulName: "MS17-010 EternalBlue",       status: "Review",   by: "dev-team", date: "2026-03-20", ext: "15 Days", reason: "Patch window approval pending from infra team",    team: "Patch Management" },
          { ip: "10.0.4.52",     vulName: "CVE-2021-44228 Log4Shell",   status: "Approved", by: "S. Miller",date: "2026-03-21", ext: "7 Days",  reason: "Emergency freeze due to release cutover",          team: "Configuration Management" },
          { ip: "172.16.0.12",   vulName: "CVE-2023-23397 Outlook RCE", status: "Rejected", by: "dev-team", date: "2026-03-18", ext: "30 Days", reason: "Change advisory board approval not completed",      team: "Network Security" },
        ],
        high: [
          { ip: "10.10.2.11",    vulName: "CVE-2022-30190 Follina",       status: "Review",   by: "N. Joshi", date: "2026-03-23", ext: "10 Days", reason: "Vendor patch waiting for validation in staging",    team: "Patch Management" },
          { ip: "10.10.2.14",    vulName: "CVE-2021-34527 PrintNightmare", status: "Approved", by: "A. Shah",  date: "2026-03-24", ext: "5 Days",  reason: "Dependency conflict with auth service update",      team: "Architectural Flaws" },
        ],
        medium: [
          { ip: "192.168.20.44", vulName: "CVE-2020-1472 Zerologon",    status: "Review",   by: "R. Kale",  date: "2026-03-22", ext: "14 Days", reason: "Maintenance window moved to next sprint cycle",     team: "Configuration Management" },
        ],
        low: [
          { ip: "172.31.11.09",  vulName: "CVE-2019-0708 BlueKeep",     status: "Rejected", by: "Ops Team", date: "2026-03-25", ext: "6 Days",  reason: "Low-priority fix batched with monthly cycle",       team: "Network Security" },
        ],
      },
      showExtPopup: false,
      extPopupSeverity: null,
      extPopupAsset: "",
      extPopupVulName: "",
      extPopupExtension: "",
      extPopupReason: "",
      extOriginalDeadlines: { critical: "30 Days", high: "60 Days", medium: "90 Days", low: "180 Days" },
      showMsuModal: false,
      msuReportId: null,
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    // Teams assigned to this user that also exist in our team map
    assignedTeamKeys() {
      return this.userTeams.filter(t => this.mteTeamMap[t]);
    },
    // Card table rows — only show assigned teams
    mteCardRows() {
      return this.assignedTeamKeys.map(t => ({ key: t, ...this.mteTeamMap[t] }));
    },
    // Modal data filtered by selected team (within assigned teams only)
    mteFilteredData() {
      const allowed = new Set(this.assignedTeamKeys);
      const filter = (rows) => {
        const byTeam = rows.filter(r => allowed.has(r.team));
        return this.mteSelectedTeam === "All" ? byTeam : byTeam.filter(r => r.team === this.mteSelectedTeam);
      };
      return {
        critical: filter(this.mteStaticData.critical),
        high:     filter(this.mteStaticData.high),
        medium:   filter(this.mteStaticData.medium),
        low:      filter(this.mteStaticData.low),
      };
    },
    extPopupAssetList() {
      if (!this.extPopupSeverity) return [];
      return [...new Set(this.mteStaticData[this.extPopupSeverity].map(r => r.ip))];
    },
    extPopupVulList() {
      if (!this.extPopupSeverity || !this.extPopupAsset) return [];
      return this.mteStaticData[this.extPopupSeverity]
        .filter(r => r.ip === this.extPopupAsset)
        .map(r => r.vulName);
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
    allTeamsData() {
      const teamConfigs = [
        { key: 'Patch Management',        id: 'ID: PV-01', icon: 'bi bi-grid-1x2',         assigned: 'ASSIGNED TO CORE INFRASTRUCTURE', assetType: 'Hosts',    tags: [{ label: '+2.4k', cls: 'cv-tag-red' }, { label: '+30', cls: 'cv-tag-orange' }, { label: '+70', cls: 'cv-tag-grey' }] },
        { key: 'Configuration Management',id: 'ID: CM-04', icon: 'bi bi-gear',              assigned: 'ASSIGNED TO DEVOPS TEAM',          assetType: 'Hosts',    tags: [{ label: '+124', cls: 'cv-tag-red' }, { label: '+20', cls: 'cv-tag-orange' }] },
        { key: 'Network Security',        id: 'ID: NS-02', icon: 'bi bi-shield-exclamation',assigned: 'ASSIGNED TO NETWORK OPS',          assetType: 'Nodes',    tags: [{ label: '+80', cls: 'cv-tag-red' }, { label: '+24k', cls: 'cv-tag-orange' }, { label: '+56', cls: 'cv-tag-grey' }] },
        { key: 'Architectural Flaws',     id: 'ID: AF-09', icon: 'bi bi-diagram-3',         assigned: 'ASSIGNED TO ARCHITECTURE',         assetType: 'Entities', tags: [{ label: '+30', cls: 'cv-tag-red' }, { label: '+56', cls: 'cv-tag-orange' }] },
      ];
      const teams = this.mitigationByTeamData?.teams || this.mitigationByTeamData || {};
      return teamConfigs.map(cfg => {
        const normalize = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
        const matchKey = Object.keys(teams).find(k => normalize(k) === normalize(cfg.key));
        const teamData = matchKey ? teams[matchKey] : null;
        const vulns = teamData?.vulnerabilities || [];
        const total = vulns.length;
        const critical = vulns.filter(v => (v.risk_factor || '').toLowerCase() === 'critical').length;
        const high = vulns.filter(v => (v.risk_factor || '').toLowerCase() === 'high').length;
        const assetsSet = new Set();
        vulns.forEach(v => { if (Array.isArray(v.assets)) v.assets.forEach(a => assetsSet.add(a)); else if (v.host_name) assetsSet.add(v.host_name); });
        return { ...cfg, total, critical, high, affectedAssets: assetsSet.size || 0 };
      });
    },
    uniqueVulns() {
      const vulns = this.mitigationActiveTeamData.vulnerabilities || [];
      const seen = new Map();
      for (const v of vulns) {
        const key = (v.plugin_name || '').trim().toLowerCase();
        if (!seen.has(key)) seen.set(key, v);
      }
      return Array.from(seen.values());
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
    totalVulnerabilities() {
      return (this.vulns.critical || 0) + (this.vulns.high || 0) + (this.vulns.medium || 0) + (this.vulns.low || 0);
    },
    supportTotal() { return this.supportReqs.total ?? 0; },
    supportPending() { return this.supportReqs.pending ?? 0; },
    supportClosed() { return this.supportReqs.closed ?? 0; },
    vulFixedTotal() { return this.vulnsFixed.total ?? 0; },
    vulFixedCritical() { return this.vulnsFixed.critical ?? 0; },
    vulFixedHigh() { return this.vulnsFixed.high ?? 0; },
    vulFixedMedium() { return this.vulnsFixed.medium ?? 0; },
    vulFixedLow() { return this.vulnsFixed.low ?? 0; },
    msuGroupedVulns() {
      const vulns = this.mitigationActiveTeamData.vulnerabilities || [];
      const map = new Map();
      for (const vuln of vulns) {
        const key = (vuln.plugin_name || '').trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(vuln);
      }
      return Array.from(map.entries()).map(([name, rows]) => ({ name, rows }));
    },
    meanRemediateHuman() { return this.meanTimeRemediate ?? '0w 0d 0hrs'; },
    meanTimeRemediateWeeks() {
      const s = this.meanTimeRemediate;
      if (!s) return 0;
      const m = s.match(/(\d+)w/);
      return m ? parseInt(m[1]) : 0;
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
        this.msuReportId = result.data.report_id || null;
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
    getMitigationDaysFromStr(sev) {
      const val = this.mitigation[sev];
      if (!val) return null;
      const s = String(val).toLowerCase();
      let total = 0;
      const wMatch = s.match(/(\d+)w/);
      const dMatch = s.match(/(\d+)d/);
      if (wMatch) total += parseInt(wMatch[1]) * 7;
      if (dMatch) total += parseInt(dMatch[1]);
      return total || null;
    },
    mitigationPct(sev) {
      const remaining = this.getMitigationDaysFromStr(sev);
      if (remaining === null || remaining === undefined) return { compliancePct: 0 };
      const criteriaStr = this.riskCriteria?.[sev];
      if (!criteriaStr) return { compliancePct: 50 };
      const str = String(criteriaStr).toLowerCase();
      const match = str.match(/(\d+)/);
      if (!match) return { compliancePct: 50 };
      let allowed = parseInt(match[1]);
      if (str.includes('week')) allowed *= 7;
      if (!allowed) return { compliancePct: 50 };
      return { compliancePct: Math.min(Math.max((remaining / allowed) * 100, 0), 100) };
    },
    getMteStatusClass(status) {
      if (status === 'Approved') return 'mte-status-approved';
      if (status === 'Rejected') return 'mte-status-rejected';
      return 'mte-status-review';
    },
    openExtPopup(severity) {
      this.extPopupSeverity = severity;
      this.extPopupAsset = "";
      this.extPopupVulName = "";
      this.extPopupExtension = "";
      this.extPopupReason = "";
      this.showExtPopup = true;
    },
    closeExtPopup() {
      this.showExtPopup = false;
      this.extPopupSeverity = null;
    },
    submitExtPopup() {
      if (!this.extPopupAsset || !this.extPopupVulName || !this.extPopupExtension || !this.extPopupReason.trim()) return;
      const rows = this.mteStaticData[this.extPopupSeverity];
      const row = rows.find(r => r.ip === this.extPopupAsset && r.vulName === this.extPopupVulName);
      if (row) {
        row.ext = this.extPopupExtension;
        row.reason = this.extPopupReason.trim();
      }
      this.closeExtPopup();
    },
    openMitigationExtensionModal() {
      this.showMitigationExtensionModal = true;
      this.mteOpenSection = 'critical';
      this.mteSelectedTeam = 'All';
    },
    closeMitigationExtensionModal() { this.showMitigationExtensionModal = false; this.mteOpenSection = null; },
    toggleMteSection(sec) { this.mteOpenSection = this.mteOpenSection === sec ? null : sec; },
    openMsuModal() { this.showMsuModal = true; },
    closeMsuModal() { this.showMsuModal = false; },
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

/* ===== COMMON VULNERABILITIES ===== */
.cv-section-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}
.cv-view-link {
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
}
.cv-view-link:hover { opacity: 0.75; }

/* Team Cards */
.cv-team-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px 16px;
  cursor: pointer;
  transition: box-shadow 0.15s, border-color 0.15s;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.cv-team-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.cv-team-card-active {
  border-color: #0f696e;
  box-shadow: 0 0 0 2px rgba(15,105,110,0.15);
}
.cv-team-icon-wrap {
  width: 32px;
  height: 32px;
  background: #e0f2f1;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f696e;
  font-size: 15px;
}
.cv-team-id {
  font-size: 10px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.cv-team-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: #475569;
  margin: 10px 0 2px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.cv-team-count {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
  line-height: 1;
}
.cv-team-assigned {
  font-size: 9px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}
.cv-tag {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}
.cv-tag-red    { background: #fee2e2; color: #dc2626; }
.cv-tag-orange { background: #fff7ed; color: #f97316; }
.cv-tag-grey   { background: #f1f5f9; color: #64748b; }

.cv-team-stats { margin: 8px 0 10px; display: flex; flex-direction: column; gap: 4px; }
.cv-stat-row { display: flex; align-items: center; gap: 6px; }
.cv-stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.cv-dot-critical { background: #dc2626; }
.cv-dot-high     { background: #f97316; }
.cv-stat-label { font-size: 11px; color: #64748b; flex: 1; }
.cv-stat-val   { font-size: 12px; font-weight: 700; color: #1e293b; }

.cv-affected-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
}
.cv-affected-label { font-size: 11px; color: #94a3b8; font-weight: 500; flex: 1; }
.cv-affected-num   { font-size: 13px; font-weight: 800; color: #1e293b; }
.cv-affected-type  { font-size: 11px; font-weight: 700; color: #0f696e; }

/* Vuln heading */
.cv-vuln-heading {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

/* Vuln cards */
.cv-vuln-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 0.15s;
}
.cv-vuln-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.cv-vuln-assets { font-size: 11px; color: #64748b; font-weight: 500; }
.cv-vuln-name {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  white-space: normal;
  margin: 6px 0 4px;
  line-height: 1.4;
}
.cv-affected-label { font-size: 11px; color: #64748b; font-weight: 500; }

.cv-sev-badge {
  font-size: 9px;
  font-weight: 800;
  padding: 2px 7px;
  border-radius: 4px;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.cv-badge-critical { background: #fee2e2; color: #dc2626; }
.cv-badge-high     { background: #fff7ed; color: #f97316; }
.cv-badge-medium   { background: #fefce8; color: #ca8a04; }
.cv-badge-low      { background: #f0fdf4; color: #16a34a; }

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

/* ===== ADMIN DASHBOARD DESIGN CLASSES ===== */
.dash-card {
  background: linear-gradient(180deg, #ffffff 0%, #fcfdff 100%);
  border-radius: 14px;
  border: 1px solid #e8edf3;
  padding: 14px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.05);
  transition: box-shadow 0.2s, transform 0.2s;
}
.dash-card:hover {
  box-shadow: 0 5px 16px rgba(15, 23, 42, 0.1);
  transform: translateY(-1px);
}
.dash-card-compact { padding: 12px; }
.dash-card-tight { padding: 12px; }
.dash-card-analytics { min-height: 160px; }
.row1-equal-height { min-height: 238px; }
.row1-equal-card { height: 238px; min-height: 238px; max-height: 238px; }

.total-assets-highlight {
  min-width: 72px;
  padding: 8px 18px;
  border-radius: 16px;
  color: #0f172a;
  background: linear-gradient(180deg, #f8fafc 0%, #ecfdf5 100%);
  border: 1px solid #d1fae5;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.9), 0 6px 14px rgba(16,185,129,0.16);
}
.mitigation-sev-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.dash-icon-wrap {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #e0f2f1, #ccfbf1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(15,105,110,0.15);
}
.dash-icon-teal { color: #0f696e; }
.dash-info-icon { color: #cbd5e1; font-size: 12px; }
.dash-card-label {
  font-size: 13px;
  font-weight: 700;
  color: #374151;
}
.dash-big-num {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  letter-spacing: -0.02em;
}
.dash-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
.dash-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 9px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.02em;
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
}
.info-tooltip:hover::after { opacity: 1; }

/* Mitigation Timeline Extension table card */
.dash-mte-subtitle { margin-top: 2px; font-size: 11px; color: #64748b; }
.dash-mte-link-btn {
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  color: #0f696e;
  text-transform: uppercase;
  white-space: nowrap;
  cursor: pointer;
}
.dash-mte-link-btn:hover { opacity: 0.85; }
.dash-mte-table-wrap {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.dash-mte-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}
.dash-mte-table th,
.dash-mte-table td {
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 9px 8px;
  text-align: center;
}
.dash-mte-table th:last-child,
.dash-mte-table td:last-child { border-right: none; }
.dash-mte-table tbody tr:last-child td { border-bottom: none; }
.dash-mte-table tbody tr:hover td { background: #f8fafc; }
.dash-mte-table th {
  background: linear-gradient(180deg, #f8fafc, #f1f5f9);
  text-transform: uppercase;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.04em;
}
.dash-mte-table th:first-child,
.dash-mte-table td:first-child {
  text-align: left;
  width: 36%;
  font-weight: 700;
  color: #334155;
  padding-left: 12px;
}
.dash-mte-table th.sev-critical { color: #dc2626; }
.dash-mte-table th.sev-high { color: #f97316; }
.dash-mte-table th.sev-medium { color: #d97706; }
.dash-mte-table th.sev-low { color: #0f766e; }
.dash-mte-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 22px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.01em;
  padding: 0 6px;
}
.dash-mte-pill.critical { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
.dash-mte-pill.high     { background: #ffedd5; color: #ea580c; border: 1px solid #fdba74; }
.dash-mte-pill.medium   { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
.dash-mte-pill.low      { background: #ccfbf1; color: #0f766e; border: 1px solid #5eead4; }

/* MTE Modal */
.mte-modal-backdrop {
  position: fixed;
  top: 64px;
  left: 100px;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.45);
  z-index: 1200;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
}
.mte-modal-box {
  width: min(940px, calc(100vw - 72px));
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  background: #f8fafc;
  border-radius: 16px 0 0 0;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.28);
  display: flex;
  flex-direction: column;
}
.mte-modal-header {
  padding: 24px 28px 14px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  flex-shrink: 0;
}
.mte-modal-title { margin: 0; color: #241447; font-size: 22px; font-weight: 700; line-height: 1.2; text-transform: capitalize; }
.mte-modal-subtitle { margin: 4px 0 0; color: #64748b; font-size: 13px; font-weight: 500; }
.mte-header-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
.mte-team-dropdown {
  appearance: none;
  -webkit-appearance: none;
  background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23475569' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat right 10px center;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 32px 7px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  outline: none;
  min-width: 190px;
  transition: border-color 0.15s;
}
.mte-team-dropdown:focus { border-color: #0f696e; }
.mte-close-btn { border: none; background: transparent; font-size: 20px; color: #241447; cursor: pointer; }
.mte-status-review   { background: #e0f2fe; color: #0369a1; }
.mte-status-approved { background: #dcfce7; color: #15803d; }
.mte-status-rejected { background: #fee2e2; color: #dc2626; }
.mte-no-data { padding: 18px 20px; font-size: 13px; color: #94a3b8; text-align: center; }
.mte-head-right { display: flex; align-items: center; gap: 10px; }
.mte-ext-btn {
  background: #f0fdf4;
  border: 1.5px solid #86efac;
  color: #15803d;
  font-size: 12px;
  font-weight: 700;
  border-radius: 7px;
  padding: 5px 12px;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.mte-ext-btn:hover { background: #dcfce7; border-color: #4ade80; }
.mte-vulname { max-width: 160px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #334155; font-weight: 600; }
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
  width: 460px;
  max-width: 100vw;
  height: 100%;
  box-shadow: -8px 0 40px rgba(0,0,0,0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
/* Severity accent bar at top */
.ext-drawer-accent { height: 5px; width: 100%; flex-shrink: 0; }
.ext-accent-critical { background: linear-gradient(90deg, #c71616, #ef4444); }
.ext-accent-high     { background: linear-gradient(90deg, #d97706, #f59e0b); }
.ext-accent-medium   { background: linear-gradient(90deg, #b45309, #fbbf24); }
.ext-accent-low      { background: linear-gradient(90deg, #0f696e, #14b8a6); }
/* Drawer slide animation */
.ext-drawer-enter-active .ext-popup-box { animation: extDrawerIn 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.ext-drawer-leave-active .ext-popup-box { animation: extDrawerOut 0.22s cubic-bezier(0.55, 0, 1, 0.45); }
.ext-drawer-enter-active { animation: extFadeIn 0.28s ease; }
.ext-drawer-leave-active { animation: extFadeOut 0.22s ease; }
@keyframes extDrawerIn  { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes extDrawerOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes extFadeIn    { from { opacity: 0; } to { opacity: 1; } }
@keyframes extFadeOut   { from { opacity: 1; } to { opacity: 0; } }
.ext-popup-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 22px;
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  flex-shrink: 0;
  margin-top: 54px;
}
.ext-header-left { display: flex; align-items: center; gap: 12px; }
.ext-header-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0; color: #fff;
}
.ext-icon-critical { background: rgba(239,68,68,0.25); border: 1.5px solid rgba(239,68,68,0.4); color: #fca5a5; }
.ext-icon-high     { background: rgba(245,158,11,0.25); border: 1.5px solid rgba(245,158,11,0.4); color: #fcd34d; }
.ext-icon-medium   { background: rgba(251,191,36,0.2);  border: 1.5px solid rgba(251,191,36,0.35); color: #fde68a; }
.ext-icon-low      { background: rgba(20,184,166,0.25); border: 1.5px solid rgba(20,184,166,0.4); color: #5eead4; }
.ext-popup-title { font-size: 17px; font-weight: 700; color: #fff; margin: 0 0 3px; line-height: 1.2; }
.ext-popup-subtitle { font-size: 12px; color: rgba(255,255,255,0.65); display: flex; align-items: center; gap: 6px; }
.ext-header-close {
  background: rgba(255,255,255,0.12);
  border: 1.5px solid rgba(255,255,255,0.2);
  color: #fff;
  width: 34px; height: 34px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; cursor: pointer;
  transition: background 0.15s, border-color 0.15s; flex-shrink: 0;
}
.ext-header-close:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.35); }
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
.ext-info-banner i { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
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
.ext-popup-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; flex: 1; overflow-y: auto; background: #f8fafc; }
.ext-popup-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.ext-popup-field { display: flex; flex-direction: column; gap: 5px; }
.ext-popup-label { font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
.ext-popup-select,
.ext-popup-textarea {
  border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;
  font-size: 13px; color: #1e293b; background: #f8fafc; outline: none;
  transition: border-color 0.15s, box-shadow 0.15s; width: 100%;
}
.ext-popup-select:focus,
.ext-popup-textarea:focus { border-color: #0f696e; box-shadow: 0 0 0 3px rgba(15,105,110,0.1); }
.ext-popup-textarea { resize: vertical; min-height: 90px; }
.ext-popup-footer {
  display: flex; justify-content: flex-end; gap: 10px;
  padding: 14px 20px 18px; border-top: 1px solid #e2e8f0;
  flex-shrink: 0; background: #fff;
}
.ext-submit-btn {
  background: #241447 !important;
  border-color: #241447 !important;
  border-radius: 999px !important;
  padding-left: 22px !important;
  padding-right: 22px !important;
  display: flex;
  align-items: center;
  gap: 6px;
}
.mte-severity-card {
  margin: 10px 24px 0;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  background: #fff;
  flex-shrink: 0;
}
.mte-critical { border-color: #f2d3d3; background: #fff8f8; }
.mte-severity-head {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}
.mte-severity-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
}
.mte-critical .mte-severity-left { color: #c71616; }
.mte-badge {
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 7px;
}
.mte-badge.critical { background: #c71616; color: #fff; }
.mte-table-wrap { overflow-x: auto; border-top: 1px solid #e2e8f0; }
.mte-table { width: 100%; border-collapse: collapse; min-width: 520px; }
.mte-table th, .mte-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #334155;
  vertical-align: middle;
}
.mte-table th { background: #eef2f7; text-transform: uppercase; font-size: 13px; font-weight: 700; color: #475569; }
.mte-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}
.mte-pill.status { background: #e5e7eb; color: #374151; }
.mte-extension { font-weight: 800; color: #1e293b !important; }
.mte-reason { max-width: 170px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; color: #475569; font-weight: 600; }
.mte-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 14px;
  padding: 14px 24px 18px;
  background: #fff;
  border-top: 1px solid #e5e7eb;
  margin-top: auto;
  flex-shrink: 0;
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

/* ===== MSU MODAL CONTENT ===== */
.msu-team-badge {
  background: #f0ecff;
  color: #241447;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 50px;
}
.msu-modal-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 16px;
}
.msu-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 16px;
}
.msu-modal-empty {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  border: 1px solid #f1f5f9;
}
.msu-modal-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-left: 4px;
}
.msu-group-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}
.msu-group-count {
  font-size: 0.72rem;
  font-weight: 700;
  background: #f0ecff;
  color: #241447;
  padding: 2px 10px;
  border-radius: 50px;
}
.msu-modal-table-wrap {
  background: white;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  overflow: hidden;
}
.msu-modal-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.855rem;
}
.msu-modal-table thead { background: #f8f9fc; }
.msu-modal-table th {
  padding: 12px 16px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}
.msu-modal-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f8f9fc;
  vertical-align: middle;
}
.msu-modal-table tbody tr:last-child td { border-bottom: none; }
.msu-modal-table tbody tr:hover { background: #fafbfc; }
.msu-modal-vuln-name {
  font-weight: 600;
  color: #241447;
  display: block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msu-modal-asset-chip {
  background: #edeef1;
  color: #1e293b;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}
.msu-modal-os-text {
  color: #64748b;
  font-size: 0.82rem;
  display: block;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msu-modal-sev-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.msu-modal-sev-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.msu-modal-sev-critical { background: #fef2f2; color: #9b1c1c; }
.msu-modal-sev-critical .msu-modal-sev-dot { background: #9b1c1c; }
.msu-modal-sev-high { background: #fff7ed; color: #c2410c; }
.msu-modal-sev-high .msu-modal-sev-dot { background: #c2410c; }
.msu-modal-sev-medium { background: #fefce8; color: #a16207; }
.msu-modal-sev-medium .msu-modal-sev-dot { background: #a16207; }
.msu-modal-sev-low { background: #f0fdf4; color: #15803d; }
.msu-modal-sev-low .msu-modal-sev-dot { background: #15803d; }
.msu-modal-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.msu-modal-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.msu-modal-status-open { background: #fef2f2; color: #ba1a1a; }
.msu-modal-status-open .msu-modal-status-dot { background: #ba1a1a; }
.msu-modal-status-closed { background: #f0fdf4; color: #15803d; }
.msu-modal-status-closed .msu-modal-status-dot { background: #15803d; }
.msu-modal-view-btn {
  background: none;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 5px 14px;
  font-size: 0.78rem;
  font-weight: 700;
  color: #0f696e;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
}
.msu-modal-view-btn:hover {
  background: rgba(15, 105, 110, 0.07);
  border-color: #0f696e;
}

</style>
