<template>
    <section>
      <div class="container-fluid">
        <div class="row">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1">
            <DashboardMenu />
          </div>

          <div class="col-11 pt-4 pb-5 pe-4 ps-4 flex-grow-1 position-relative" style="background: #f3f4f6; min-height: 100vh;">

            <!-- Dashboard Header Row -->
            <div class="d-flex align-items-center justify-content-between mb-4 pt-2">
              <div class="d-flex align-items-center gap-2 position-relative">
                <h2 class="mb-0 fw-bold pt-5" style="font-size: 1.4rem; color: #1e293b;">Vulnerability Management Program</h2>

                <!-- Calendar Button -->
                <button class="btn border-0 p-1 pt-5" @click="toggleCalendar">
                  <i class="bi bi-calendar3" style="color: #64748b; font-size: 1rem;"></i>
                </button>

                <!-- Outside-click backdrop -->
                <div
                  v-if="showCalendar"
                  style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999;"
                  @click="showCalendar = false; showMonthPicker = false; showYearPicker = false;"
                ></div>

                <!-- Calendar Dropdown -->
                <div
                  v-if="showCalendar"
                  class="border rounded p-3 shadow bg-white"
                  style="width: 320px; position: absolute; top: 110%; left: 0; z-index: 1000;"
                  @click.stop
                >
                  <div class="d-flex justify-content-between align-items-center mb-2 position-relative">
                    <button class="btn btn-sm btn-light" @click="prevMonth">&lt;</button>
                    <h6 class="mb-0 d-flex gap-2">
                      <span style="cursor:pointer; text-decoration:underline dotted;" @click="showMonthPicker = !showMonthPicker; showYearPicker = false;">{{ currentMonthName }}</span>
                      <span style="cursor:pointer; text-decoration:underline dotted;" @click="showYearPicker = !showYearPicker; showMonthPicker = false;">{{ currentYear }}</span>
                    </h6>
                    <button class="btn btn-sm btn-light" @click="nextMonth">&gt;</button>

                    <div v-if="showMonthPicker" class="position-absolute bg-white border rounded shadow p-2" style="top:100%; left:50%; transform:translateX(-50%); z-index:1100; width:200px;">
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

                    <div v-if="showYearPicker" class="position-absolute bg-white border rounded shadow p-2" style="top:100%; left:50%; transform:translateX(-50%); z-index:1100; width:200px;">
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

                  <div class="d-grid text-center fw-bold" style="grid-template-columns: repeat(7, 1fr);">
                    <div v-for="day in weekDays" :key="day">{{ day }}</div>
                  </div>

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
                    >{{ date }}</div>
                  </div>
                </div>
              </div>

              <!-- View Report Button -->
              <button
                class="btn fw-semibold px-3 py-2 bg-white mt-5"
                style="border: 1px solid #e2e8f0; border-radius: 8px; font-size: 13px; color: #374151; display:flex; align-items:center; gap:6px; box-shadow: 0 1px 3px rgba(0,0,0,0.06);"
                @click="$router.push('/viewreport')"
              >
                <i class="bi bi-eye"></i>View Report
              </button>
            </div>

            <!-- ===== 6-CARD ANALYTICS GRID ===== -->
            <!-- ROW 1: Assets + MTTR | Vulnerabilities | Mitigation Timeline -->
            <div class="row g-2 mb-3 align-items-stretch">

              <!-- Col 1: Total Assets (mini) + MTTR (mini) side by side -->
              <div class="col-4">
                <div class="row g-2 h-100 row1-equal-height">

                  <!-- Total Assets mini card -->
                  <div class="col-5 d-flex flex-column">
                    <router-link to="/assets" class="text-decoration-none d-flex flex-column h-100">
                      <div class="dash-card row1-equal-card h-100 d-flex flex-column" style="padding:12px 10px; background:linear-gradient(145deg,#ffffff 60%,#f0fdf4 100%);">
                        <div class="d-flex align-items-center gap-1 mb-2">
                          <div class="dash-icon-wrap" style="width:28px;height:28px;">
                            <i class="bi bi-laptop dash-icon-teal" style="font-size:13px;"></i>
                          </div>
                          <span class="dash-card-label" style="font-size:11px;">Total Assets</span>
                        </div>
                        <div class="d-flex flex-column align-items-center justify-content-center flex-grow-1">
                          <div class="dash-big-num text-center total-assets-highlight" style="font-size:2.2rem; line-height:1;">{{ authStore.totalAssets }}</div>
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

                      <!-- Donut gauge: r=30, circumference=188.5 -->
                      <div class="d-flex justify-content-center align-items-center flex-grow-1">
                        <div style="position:relative; width:122px; height:122px;">
                          <svg width="122" height="122" viewBox="0 0 132 132">
                            <defs>
                              <linearGradient id="mttr-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#10b981"/>
                                <stop offset="50%" stop-color="#f59e0b"/>
                                <stop offset="100%" stop-color="#ef4444"/>
                              </linearGradient>
                            </defs>
                            <!-- Track -->
                            <circle cx="66" cy="66" r="48" fill="none" stroke="#f1f5f9" stroke-width="12"/>
                            <!-- Progress: circumference = 2π×32 ≈ 201.1 -->
                            <circle cx="66" cy="66" r="48" fill="none"
                              stroke="url(#mttr-grad2)" stroke-width="12"
                              stroke-linecap="round"
                              stroke-dasharray="301.6"
                              :stroke-dashoffset="301.6 - (Math.min((authStore.meanTimeToRemediate?.mean_time_to_remediate?.weeks ?? 0), 4) / 4 * 301.6)"
                              transform="rotate(-90 66 66)"/>
                          </svg>
                          <!-- Center label -->
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

              <!-- Card 2: Vulnerabilities Gauge -->
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
                    <!-- Critical -->
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ authStore.vulnerabilities.critical || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#dc2626,#b91c1c); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((authStore.vulnerabilities.critical || 0) / totalVulnerabilities * 66) + 'px' : '4px' }">
                      </div>
                    </div>
                    <!-- High -->
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ authStore.vulnerabilities.high || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#f97316,#ef4444); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((authStore.vulnerabilities.high || 0) / totalVulnerabilities * 66) + 'px' : '4px' }">
                      </div>
                    </div>
                    <!-- Medium -->
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ authStore.vulnerabilities.medium || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#fbbf24,#f59e0b); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((authStore.vulnerabilities.medium || 0) / totalVulnerabilities * 66) + 'px' : '4px' }">
                      </div>
                    </div>
                    <!-- Low -->
                    <div class="d-flex flex-column align-items-center gap-1" style="flex:1; max-width:52px;">
                      <span style="font-size:12px; font-weight:800; color:#1f2937;">{{ authStore.vulnerabilities.low || 0 }}</span>
                      <div style="width:100%; border-radius:6px 6px 0 0; background:linear-gradient(180deg,#34d399,#10b981); min-height:4px; transition:height 0.5s ease;"
                        :style="{ height: totalVulnerabilities ? ((authStore.vulnerabilities.low || 0) / totalVulnerabilities * 66) + 'px' : '4px' }">
                      </div>
                    </div>
                  </div>
                  <!-- X-axis line -->
                  <div style="border-top: 2px solid #e5e7eb; margin: 0 8px;"></div>

                  <!-- Legend -->
                  <div class="d-flex justify-content-around mt-1 flex-wrap px-1">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#dc2626;"></span>Critical</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f97316;"></span>High</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f59e0b;"></span>Medium</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#10b981;"></span>Low</div>
                  </div>
                </div>
              </div>

              <!-- Card 3: Mitigation Timeline -->
              <div class="col-4">
                <div class="dash-card dash-card-tight dash-card-analytics row1-equal-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-clock-history dash-icon-teal" style="font-size:14px;"></i>
                    </div>
                    <span class="dash-card-label">Mitigation Criteria Timeline</span>
                    <span class="info-tooltip" data-tooltip="Displays the remaining remediation time for vulnerabilities based on the defined risk criteria."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>

                  <!-- No-data state -->
                  <div v-if="!authStore.mitigationTimeline" class="d-flex flex-column align-items-center justify-content-center py-2" style="opacity:0.55;">
                    <i class="bi bi-clock-history" style="font-size:2rem;color:#cbd5e1;margin-bottom:8px;"></i>
                    <span style="font-size:11px;color:#94a3b8;font-weight:600;">Awaiting timeline data</span>
                  </div>

                  <!-- Half-circle gauges — same logic, improved layout -->
                  <div class="d-flex justify-content-around align-items-end" style="gap:2px; margin-top:54px;">

                    <!-- Critical -->
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
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ formatTimeline(getMitigationValue('critical')) }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#e53e3e;">Critical</span>
                    </div>

                    <!-- High -->
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
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ formatTimeline(getMitigationValue('high')) }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#fc6b57;">High</span>
                    </div>

                    <!-- Medium -->
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
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ formatTimeline(getMitigationValue('medium')) }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#f59e0b;">Medium</span>
                    </div>

                    <!-- Low -->
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
                          <div style="font-size:11px;font-weight:800;color:#1f2937;line-height:1;">{{ formatTimeline(getMitigationValue('low')) }}</div>
                        </div>
                      </div>
                      <span class="mitigation-sev-label" style="color:#10b981;">Low</span>
                    </div>

                  </div>

                  <div class="d-flex justify-content-center gap-3 mt-2" style="border-top:3px solid #f1f5f9; padding-top:10px;">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#0f696e;"></span>SLA Compliance</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#d1d5db;"></span>Non-Compliance</div>
                  </div>
                </div>
              </div>



            </div>
            <!-- end row 1 -->

            <!-- ROW 2: Support Requests | Total Vulns Fixed | Mitigation Timeline Extension -->
            <div class="row g-2 mb-3 align-items-stretch">

              <!-- Support Requests (col-4) -->
              <div class="col-4">
                <router-link to="/supportrequests" class="text-decoration-none d-block h-100">
                  <div class="dash-card dash-card-compact dash-card-tight h-100 d-flex flex-column" style="min-height:142px;">
                    <div class="d-flex align-items-center gap-2 mb-3">
                      <div class="dash-icon-wrap">
                        <i class="bi bi-headset dash-icon-teal" style="font-size:14px;"></i>
                      </div>
                      <span class="dash-card-label">Support Requests</span>
                      <span class="info-tooltip" data-tooltip="Total number of support requests raised."><i class="bi bi-info-circle dash-info-icon"></i></span>
                    </div>

                    <!-- Donut ring + stats row -->
                    <div class="d-flex align-items-center gap-2 flex-grow-1">

                      <!-- Donut ring: r=30, circ=188.5 -->
                      <div style="position:relative; width:80px; height:80px; flex-shrink:0;">
                        <svg width="80" height="80" viewBox="0 0 90 90">
                          <!-- Track -->
                          <circle cx="45" cy="45" r="30" fill="none" stroke="#f1f5f9" stroke-width="9"/>
                          <!-- Pending arc (red) starting at top -->
                          <circle cx="45" cy="45" r="30" fill="none" stroke="#ef4444" stroke-width="9"
                            stroke-linecap="butt"
                            stroke-dasharray="188.5"
                            :stroke-dashoffset="188.5 - (supportTotal ? supportPending / supportTotal * 188.5 : 0)"
                            transform="rotate(-90 45 45)"/>
                          <!-- Closed arc (teal) starting after pending -->
                          <circle cx="45" cy="45" r="30" fill="none" stroke="#0f696e" stroke-width="9"
                            stroke-linecap="butt"
                            stroke-dasharray="188.5"
                            :stroke-dashoffset="188.5 - (supportTotal ? supportClosed / supportTotal * 188.5 : 0)"
                            :transform="`rotate(${(supportTotal ? supportPending / supportTotal * 360 : 0) - 90} 45 45)`"/>
                        </svg>
                        <!-- Center text -->
                        <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;">
                          <div style="font-size:1.2rem;font-weight:900;color:#1e293b;line-height:1;">{{ String(supportTotal).padStart(2,'0') }}</div>
                          <div style="font-size:8px;color:#94a3b8;font-weight:600;letter-spacing:0.04em;">TOTAL</div>
                        </div>
                      </div>

                      <!-- Stats -->
                      <div class="d-flex flex-column gap-2 flex-grow-1">
                        <!-- Pending -->
                        <div>
                          <div class="d-flex align-items-center mb-1">
                            <div class="d-flex align-items-center gap-1">
                              <span class="dash-dot" style="background:#ef4444;"></span>
                              <span style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Pending</span>
                            </div>
                          </div>
                          <div class="d-flex align-items-center gap-2">
                            <div style="height:5px;width:78%;background:#fee2e2;border-radius:4px;overflow:hidden;">
                              <div :style="{width:supportTotal?(supportPending/supportTotal*100)+'%':'0%',background:'#ef4444',height:'100%',borderRadius:'4px',transition:'width 0.6s ease'}"></div>
                            </div>
                            <span style="font-size:13px;font-weight:800;color:#1f2937;line-height:1;">{{ supportPending }}</span>
                          </div>
                        </div>
                        <!-- Closed -->
                        <div>
                          <div class="d-flex align-items-center mb-1">
                            <div class="d-flex align-items-center gap-1">
                              <span class="dash-dot" style="background:#0f696e;"></span>
                              <span style="font-size:10px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;">Closed</span>
                            </div>
                          </div>
                          <div class="d-flex align-items-center gap-2">
                            <div style="height:5px;width:78%;background:#d1e7dd;border-radius:4px;overflow:hidden;">
                              <div :style="{width:supportTotal?(supportClosed/supportTotal*100)+'%':'0%',background:'#0f696e',height:'100%',borderRadius:'4px',transition:'width 0.6s ease'}"></div>
                            </div>
                            <span style="font-size:13px;font-weight:800;color:#1f2937;line-height:1;">{{ supportClosed }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>

              <!-- Total Vulnerabilities Fixed (col-4) -->
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

              <!-- Mitigation Timeline Extension (col-4) -->
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
                        <tr>
                          <td>Patch Mgmt</td>
                          <td><span class="dash-mte-pill critical">14</span></td>
                          <td><span class="dash-mte-pill high">38</span></td>
                          <td><span class="dash-mte-pill medium">22</span></td>
                          <td><span class="dash-mte-pill low">12</span></td>
                        </tr>
                        <tr>
                          <td>Config Mgmt</td>
                          <td><span class="dash-mte-pill critical">06</span></td>
                          <td><span class="dash-mte-pill high">24</span></td>
                          <td><span class="dash-mte-pill medium">84</span></td>
                          <td><span class="dash-mte-pill low">61</span></td>
                        </tr>
                        <tr>
                          <td>Network Sec</td>
                          <td><span class="dash-mte-pill critical">22</span></td>
                          <td><span class="dash-mte-pill high">15</span></td>
                          <td><span class="dash-mte-pill medium">09</span></td>
                          <td><span class="dash-mte-pill low">04</span></td>
                        </tr>
                        <tr>
                          <td>Arch Flaws</td>
                          <td><span class="dash-mte-pill critical">03</span></td>
                          <td><span class="dash-mte-pill high">08</span></td>
                          <td><span class="dash-mte-pill medium">14</span></td>
                          <td><span class="dash-mte-pill low">27</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
            <!-- end 6-card analytics grid -->

            <!-- ===== MITIGATION STRATEGY SECTION ===== -->
            <section class="mb-5">

              <!-- Section Header -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="fw-bold mb-0" style="color:#1e293b; font-size:1.15rem;">Common Vulnerabilities</h5>
              </div>

              <!-- Team Cards -->
              <div class="row g-3 mb-4">
                <div class="col-md-3" v-for="tab in mitigationTabs" :key="tab.key">
                  <div class="cv-team-card" :class="mitigationActiveTab === tab.key ? 'cv-team-card-active' : ''" @click="setMitigationTab(tab.key)">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div class="cv-team-icon-wrap">
                        <i :class="tab.icon || 'bi bi-grid-1x2'"></i>
                      </div>
                      <span class="cv-team-id">{{ tab.id || 'ID: --' }}</span>
                    </div>
                    <p class="cv-team-name">{{ tab.key }}</p>
                    <h2 class="cv-team-count">{{ getTeamVulnCount(tab.key) }}</h2>
                    <p class="cv-team-assigned">{{ tab.assigned || 'ASSIGNED TO TEAM' }}</p>
                    <div class="cv-team-stats">
                      <div class="cv-stat-row">
                        <span class="cv-stat-dot cv-dot-critical"></span>
                        <span class="cv-stat-label">Critical</span>
                        <span class="cv-stat-val">{{ getTeamSevCount(tab.key, 'critical') }}</span>
                      </div>
                      <div class="cv-stat-row">
                        <span class="cv-stat-dot cv-dot-high"></span>
                        <span class="cv-stat-label">High</span>
                        <span class="cv-stat-val">{{ getTeamSevCount(tab.key, 'high') }}</span>
                      </div>
                    </div>
                    <div class="cv-affected-row">
                      <span class="cv-affected-label">Affected Assets</span>
                      <span class="cv-affected-num">{{ getTeamAssetCount(tab.key) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Vulnerabilities for selected team -->
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="cv-vuln-heading mb-0">Vulnerabilities ({{ mitigationActiveTab }}) — {{ uniqueMitigationVulns.length }}</h6>
                <button type="button" @click="openCommonVulnModal" style="background:none; border:none; padding:0; color:#0f696e; font-size:13px; font-weight:600; cursor:pointer;">
                  More details <i class="bi bi-arrow-right ms-1"></i>
                </button>
              </div>

              <div v-if="mitigationLoading" class="py-3 text-center text-muted">Loading...</div>
              <div v-else-if="uniqueMitigationVulns.length === 0" class="py-3 text-muted small">No vulnerabilities assigned to this team.</div>
              <div v-else class="row g-3">
                <div class="col-md-3" v-for="(vuln, i) in uniqueMitigationVulns.slice(0, 8)" :key="(vuln.plugin_name || 'vuln') + i">
                  <div class="cv-vuln-card">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="cv-vuln-assets"><i class="bi bi-hdd-network me-1"></i>{{ getVulnAssetCount(vuln) ?? 1 }} assets</span>
                      <span class="cv-sev-badge" :class="'cv-badge-' + (vuln.risk_factor || '').toLowerCase()">{{ (vuln.risk_factor || '').toUpperCase() }}</span>
                    </div>
                    <h6 class="cv-vuln-name" :title="vuln.plugin_name">{{ vuln.plugin_name }}</h6>
                    <div class="d-flex align-items-center mt-auto pt-2">
                      <i class="bi bi-person me-1" style="color:#94a3b8; font-size:0.78rem;"></i>
                        <span class="cv-affected-label">{{ getVulnAssetCount(vuln) ?? 1 }} affected assets</span>
                    </div>
                  </div>
                </div>
              </div>

            </section>

            <!-- ===== ASSETS SLIDE-IN OVERLAY ===== -->
            <div v-if="showAssetsOverlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.35); z-index:1050;" @click.self="showAssetsOverlay = false">
              <div style="position:fixed; top:0; right:0; width:82vw; height:100vh; background:#f3f4f6; display:flex; flex-direction:column; box-shadow:-4px 0 24px rgba(0,0,0,0.15); z-index:1051; overflow:hidden;">

                <!-- Close button -->
                <button class="btn border-0 p-0" style="position:absolute; top:16px; right:16px; z-index:10; font-size:1.3rem; color:#64748b;" @click="showAssetsOverlay = false">
                  <i class="bi bi-x-lg"></i>
                </button>

                <!-- Split Panel -->
                <div class="assets-split-panel" style="height:100%; overflow:hidden;">

                  <!-- Left Panel -->
                  <div class="assets-left-panel">
                    <div class="left-panel-header">
                      <div class="d-flex justify-content-between align-items-center mb-2 assets-header-row">
                        <h2 class="assets-title">All Assets</h2>
                        <span class="assets-count-badge">{{ authStore.assetCount }} Assets</span>
                      </div>
                      <div class="position-relative search-wrap">
                        <i class="bi bi-search search-icon-left"></i>
                        <input v-model="overlayQuery" class="assets-search" placeholder="Search assets, IPs..." />
                        <i v-if="overlayQuery" class="bi bi-x-circle-fill clear-icon" @click="overlayQuery = ''"></i>
                      </div>
                    </div>

                    <div class="asset-list-scroll">
                      <div
                        v-for="(asset, i) in overlayPagedAssets"
                        :key="asset.id || asset.asset || i"
                        class="asset-item-new"
                        :class="{ 'asset-item-active': overlayActiveIndex === asset.asset }"
                        @click="overlaySetActive(asset)"
                      >
                        <div class="d-flex justify-content-between align-items-start mb-1">
                          <span class="asset-ip">{{ asset.asset }}</span>
                          <span v-if="getPrioritySeverity(asset)" class="sev-badge" :class="'sev-' + getPrioritySeverity(asset).toLowerCase()">
                            {{ getPrioritySeverity(asset) }}
                          </span>
                        </div>
                        <div class="d-flex gap-2 flex-wrap mt-1">
                          <span class="sev-count-dot critical-dot">{{ asset.severity_counts?.critical || 0 }}</span>
                          <span class="sev-count-dot high-dot">{{ asset.severity_counts?.high || 0 }}</span>
                          <span class="sev-count-dot medium-dot">{{ asset.severity_counts?.medium || 0 }}</span>
                          <span class="sev-count-dot low-dot">{{ asset.severity_counts?.low || 0 }}</span>
                        </div>
                      </div>
                      <div v-if="overlayPagedAssets.length === 0" class="text-muted small py-3 text-center">No assets found.</div>
                    </div>
                  </div>

                  <!-- Right Panel -->
                  <div class="assets-right-panel">
                    <div v-if="!overlaySelectedAsset" class="d-flex align-items-center justify-content-center h-100 text-muted">
                      <div class="text-center">
                        <i class="bi bi-hdd-network" style="font-size:3rem; color:#cbd5e1;"></i>
                        <p class="mt-3">Select an asset to view details</p>
                      </div>
                    </div>
                    <div v-else>
                      <div class="right-panel-header">
                        <div class="d-flex align-items-center gap-3 mb-3 flex-wrap pt-3 asset-top-meta-row">
                          <h1 class="asset-detail-title">{{ authStore.selectedAssetDetail?.asset }}</h1>
                          <span v-if="authStore.selectedAssetDetail?.severity" class="sev-badge" :class="'sev-' + (authStore.selectedAssetDetail.severity?.toLowerCase() || '')">
                            {{ authStore.selectedAssetDetail.severity }}
                          </span>
                          <span class="status-open-badge"><span class="status-dot-open"></span>Open</span>
                          <span class="asset-last-scanned" style="color:#64748b; font-size:12px;">Last scanned: 2 hours ago</span>
                        </div>
                        <div class="detail-tabs">
                          <button class="detail-tab" :class="{ 'detail-tab-active': overlayActiveTab === 'vulnerabilities' }" @click="overlayActiveTab = 'vulnerabilities'">
                            Vulnerabilities ({{ overlayFilteredVulns.length }})
                          </button>
                          <button class="detail-tab" :class="{ 'detail-tab-active': overlayActiveTab === 'exceptions' }" @click="overlayActiveTab = 'exceptions'">
                            Support Requests
                            <span v-if="overlaySupportRequests.length > 0" class="badge rounded-circle bg-danger ms-1" style="font-size:11px;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;">
                              {{ overlaySupportRequests.length }}
                            </span>
                          </button>
                          <button class="detail-tab" disabled style="opacity:0.4;cursor:not-allowed;">Related Assets</button>
                        </div>
                      </div>

                      <div class="right-panel-scroll">
                        <!-- Vulnerabilities Tab -->
                        <div v-if="overlayActiveTab === 'vulnerabilities'">
                          <div class="d-flex gap-2 mb-4">
                            <button class="sev-pill" :class="{ 'sev-pill-active': overlayActiveSeverity === 'All' }" @click="overlayActiveSeverity = 'All'">All</button>
                            <button class="sev-pill sev-pill-critical" :class="{ 'sev-pill-active': overlayActiveSeverity === 'Critical' }" @click="overlayActiveSeverity = 'Critical'">Critical</button>
                            <button class="sev-pill sev-pill-high" :class="{ 'sev-pill-active': overlayActiveSeverity === 'High' }" @click="overlayActiveSeverity = 'High'">High</button>
                            <button class="sev-pill sev-pill-medium" :class="{ 'sev-pill-active': overlayActiveSeverity === 'Medium' }" @click="overlayActiveSeverity = 'Medium'">Medium</button>
                            <button class="sev-pill sev-pill-low" :class="{ 'sev-pill-active': overlayActiveSeverity === 'Low' }" @click="overlayActiveSeverity = 'Low'">Low</button>
                          </div>
                          <h3 class="section-label mb-3">Active Threats</h3>
                          <div v-if="overlayVulnsLoading" class="text-center py-4 text-muted">Loading...</div>
                          <div v-else-if="overlayFilteredVulns.length === 0" class="text-muted small py-3">No vulnerabilities found.</div>
                          <div v-else class="d-flex flex-column gap-3">
                            <div v-for="(v, i) in overlayFilteredVulns" :key="i" class="vuln-accordion-item">
                              <div class="vuln-accordion-header" data-bs-toggle="collapse" :data-bs-target="'#ov' + i" role="button">
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
                                <div class="d-flex align-items-center gap-3 flex-shrink-0 vuln-top-meta-row">
                                  <span class="sev-badge" :class="'sev-' + (v.severity?.toLowerCase() || '')">{{ v.severity }}</span>
                                  <span class="status-open-badge"><span class="status-dot-open"></span>Open</span>
                                  <span class="text-muted" style="font-size:0.78rem;">CVSS: {{ v.cvss_score || '-' }}</span>
                                  <i class="bi bi-chevron-down text-muted"></i>
                                </div>
                              </div>
                              <div :id="'ov' + i" class="accordion-collapse collapse" :class="{ show: i === 0 }">
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
                                  </div>
                                  <div class="mb-4">
                                    <h5 class="vuln-desc-title">Description</h5>
                                    <p class="vuln-desc-text">{{ v.description }}</p>
                                  </div>
                                  <div class="d-flex gap-3">
                                    <router-link
                                      v-if="authStore.latestReportId"
                                      :to="{ name: 'VulFix', params: { reportId: authStore.latestReportId, asset: authStore.selectedAssetDetail?.asset }, query: { id: getOverlayVulRegisterId(v), plugin_name: v.vul_name, risk_factor: v.severity } }"
                                      class="btn-fix-now text-decoration-none"
                                      @click="showAssetsOverlay = false">
                                      Fix Now
                                    </router-link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Fixed Recently -->
                          <div v-if="overlayClosedVulns.length" class="mt-5">
                            <div class="d-flex align-items-center mb-3">
                              <h3 class="section-label">Fixed Recently</h3>
                              <div class="fixed-divider flex-grow-1 ms-3"></div>
                            </div>
                            <div class="d-flex flex-column gap-2">
                              <div v-for="(item, i) in overlayClosedVulns" :key="i" class="fixed-item">
                                <div class="d-flex align-items-center gap-3">
                                  <i class="bi bi-check-circle-fill fixed-check-icon"></i>
                                  <div>
                                    <p class="fixed-vuln-name">{{ item.vulnerability_name }}</p>
                                    <p class="fixed-vuln-date">Status: {{ item.status }}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Support Requests Tab -->
                        <div v-if="overlayActiveTab === 'exceptions'">
                          <div v-if="overlaySupportRequests.length">
                            <div v-for="(req, i) in overlaySupportRequests" :key="req._id" class="support-req-item">
                              <div class="d-flex align-items-center gap-3">
                                <div class="sr-index-circle">{{ i + 1 }}</div>
                                <p class="sr-vul-name mb-0">{{ req.vul_name }}</p>
                              </div>
                            </div>
                          </div>
                          <div v-else class="sr-empty">
                            <i class="bi bi-inbox me-2"></i>No support requests raised for this asset.
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

      <!-- Mitigation Timeline Extension Modal -->
      <div v-if="showMitigationExtensionModal" class="mte-modal-backdrop" @click.self="closeMitigationExtensionModal">
        <div class="mte-modal-box" @click.stop>
          <div class="mte-modal-header">
            <div>
              <h3 class="mte-modal-title">Mitigation Timeline Extension</h3>
              <p class="mte-modal-subtitle">Review and manage pending extension requests for vulnerability fixes.</p>
            </div>
            <button type="button" class="mte-close-btn" @click="closeMitigationExtensionModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div class="mte-severity-card mte-critical">
            <div class="mte-severity-head" @click="toggleMteSection('critical')">
              <div class="mte-severity-left">
                <i class="bi bi-exclamation-circle-fill"></i>
                <span>Critical Severity Requests</span>
                <span class="mte-badge critical">4 Pending</span>
              </div>
              <i class="bi" :class="mteOpenSection === 'critical' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>

            <div v-if="mteOpenSection === 'critical'" class="mte-table-wrap">
              <table class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>192.168.1.104</td>
                    <td><span class="mte-pill status">Pending</span></td>
                    <td>Admin</td>
                    <td>2026-03-20</td>
                    <td class="mte-extension">15 Days</td>
                    <td class="mte-reason" :title="'Patch window approval pending from infra team'">{{ truncateReason('Patch window approval pending from infra team') }}</td>
                  </tr>
                  <tr>
                    <td>10.0.4.52</td>
                    <td><span class="mte-pill status">Review</span></td>
                    <td>S. Miller</td>
                    <td>2026-03-21</td>
                    <td class="mte-extension">7 Days</td>
                    <td class="mte-reason" :title="'Emergency freeze due to release cutover'">{{ truncateReason('Emergency freeze due to release cutover') }}</td>
                  </tr>
                  <tr>
                    <td>172.16.0.12</td>
                    <td><span class="mte-pill status">Pending</span></td>
                    <td>Admin</td>
                    <td>2026-03-18</td>
                    <td class="mte-extension">30 Days</td>
                    <td class="mte-reason" :title="'Change advisory board approval not completed'">{{ truncateReason('Change advisory board approval not completed') }}</td>
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
                <span class="mte-badge high">12 Items</span>
              </div>
              <i class="bi" :class="mteOpenSection === 'high' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="mteOpenSection === 'high'" class="mte-table-wrap">
              <table class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>10.10.2.11</td>
                    <td><span class="mte-pill status">Pending</span></td>
                    <td>N. Joshi</td>
                    <td>2026-03-23</td>
                    <td class="mte-extension">10 Days</td>
                    <td class="mte-reason" :title="'Vendor patch waiting for validation in staging'">{{ truncateReason('Vendor patch waiting for validation in staging') }}</td>
                  </tr>
                  <tr>
                    <td>10.10.2.14</td>
                    <td><span class="mte-pill status">Review</span></td>
                    <td>A. Shah</td>
                    <td>2026-03-24</td>
                    <td class="mte-extension">5 Days</td>
                    <td class="mte-reason" :title="'Dependency conflict with auth service update'">{{ truncateReason('Dependency conflict with auth service update') }}</td>
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
                <span class="mte-badge medium">28 Items</span>
              </div>
              <i class="bi" :class="mteOpenSection === 'medium' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="mteOpenSection === 'medium'" class="mte-table-wrap">
              <table class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>192.168.20.44</td>
                    <td><span class="mte-pill status">Pending</span></td>
                    <td>R. Kale</td>
                    <td>2026-03-22</td>
                    <td class="mte-extension">14 Days</td>
                    <td class="mte-reason" :title="'Maintenance window moved to next sprint cycle'">{{ truncateReason('Maintenance window moved to next sprint cycle') }}</td>
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
                <span class="mte-badge low">8 Items</span>
              </div>
              <i class="bi" :class="mteOpenSection === 'low' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
            </div>
            <div v-if="mteOpenSection === 'low'" class="mte-table-wrap">
              <table class="mte-table">
                <thead>
                  <tr>
                    <th>Asset (IP)</th>
                    <th>Status</th>
                    <th>Requested By</th>
                    <th>Request Date</th>
                    <th>Extension</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>172.31.11.09</td>
                    <td><span class="mte-pill status">Pending</span></td>
                    <td>Ops Team</td>
                    <td>2026-03-25</td>
                    <td class="mte-extension">6 Days</td>
                    <td class="mte-reason" :title="'Low-priority fix batched with monthly cycle'">{{ truncateReason('Low-priority fix batched with monthly cycle') }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mte-modal-footer">
            <button type="button" class="mte-btn-secondary">Reject</button>
            <button type="button" class="mte-btn-primary">Approve Selected</button>
          </div>
        </div>
      </div>

      <!-- Common Vulnerabilities Modal -->
      <div v-if="showCommonVulnModal" class="mte-modal-backdrop" @click.self="closeCommonVulnModal">
        <div class="mte-modal-box" @click.stop style="overflow:hidden; display:flex; flex-direction:column;">

          <!-- Header -->
          <div class="mte-modal-header" style="border-bottom:1px solid #e2e8f0; flex-shrink:0;">
            <div>
              <h3 class="mte-modal-title">Common Vulnerabilities</h3>
              <p class="mte-modal-subtitle">
                Showing vulnerabilities for team —
                <span style="color:#0f696e; font-weight:700;">{{ mitigationActiveTab }}</span>
              </p>
            </div>
            <button type="button" class="mte-close-btn" @click="closeCommonVulnModal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Scrollable body -->
          <div style="flex:1; overflow-y:auto; padding:12px 0 8px;">

            <div v-if="cvModalGroupedVulns.critical.length === 0 && cvModalGroupedVulns.high.length === 0 && cvModalGroupedVulns.medium.length === 0 && cvModalGroupedVulns.low.length === 0" style="padding:40px; text-align:center; color:#94a3b8; font-size:14px;">
              <i class="bi bi-shield-check" style="font-size:28px; display:block; margin-bottom:10px;"></i>
              No vulnerabilities found for this team.
            </div>

            <!-- Critical -->
            <div v-if="cvModalGroupedVulns.critical.length > 0" class="mte-severity-card mte-critical">
              <div class="mte-severity-head" @click="toggleCvModalGroup('critical')">
                <div class="mte-severity-left">
                  <i class="bi bi-exclamation-circle-fill"></i>
                  <span>Critical Vulnerabilities</span>
                  <span class="mte-badge critical">{{ cvModalGroupedVulns.critical.length }} Items</span>
                </div>
                <i class="bi" :class="cvModalOpenSev === 'critical' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
              <div v-if="cvModalOpenSev === 'critical'" class="mte-table-wrap">
                <table class="mte-table">
                  <thead>
                    <tr>
                      <th>Asset (IP)</th>
                      <th>OS</th>
                      <th>Vulnerability</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="vuln in cvModalGroupedVulns.critical" :key="vuln.id || vuln.host_name + vuln.plugin_name">
                      <td style="font-weight:600; color:#1e293b;">{{ vuln.host_name || '—' }}</td>
                      <td style="color:#64748b; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="vuln.os || '—'">{{ vuln.os || '—' }}</td>
                      <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#334155;" :title="vuln.plugin_name">{{ vuln.plugin_name }}</td>
                      <td><span class="mte-pill" :class="getCvStatusPillClass(vuln.status)">{{ vuln.status || '—' }}</span></td>
                      <td>
                        <router-link :to="{ name:'VulFix', params:{ reportId: currentReportId, asset: vuln.host_name }, query:{ id: vuln.id, plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor } }" class="text-decoration-none" @click="closeCommonVulnModal">
                          <button class="cv-view-btn">View <i class="bi bi-arrow-right-circle-fill ms-1"></i></button>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- High -->
            <div v-if="cvModalGroupedVulns.high.length > 0" class="mte-severity-card cv-high-card">
              <div class="mte-severity-head" @click="toggleCvModalGroup('high')">
                <div class="mte-severity-left" style="color:#c2410c;">
                  <i class="bi bi-exclamation-triangle-fill mte-high-icon"></i>
                  <span>High Vulnerabilities</span>
                  <span class="mte-badge high">{{ cvModalGroupedVulns.high.length }} Items</span>
                </div>
                <i class="bi" :class="cvModalOpenSev === 'high' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
              <div v-if="cvModalOpenSev === 'high'" class="mte-table-wrap">
                <table class="mte-table">
                  <thead><tr><th>Asset (IP)</th><th>OS</th><th>Vulnerability</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    <tr v-for="vuln in cvModalGroupedVulns.high" :key="vuln.id || vuln.host_name + vuln.plugin_name">
                      <td style="font-weight:600; color:#1e293b;">{{ vuln.host_name || '—' }}</td>
                      <td style="color:#64748b; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="vuln.os || '—'">{{ vuln.os || '—' }}</td>
                      <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#334155;" :title="vuln.plugin_name">{{ vuln.plugin_name }}</td>
                      <td><span class="mte-pill" :class="getCvStatusPillClass(vuln.status)">{{ vuln.status || '—' }}</span></td>
                      <td>
                        <router-link :to="{ name:'VulFix', params:{ reportId: currentReportId, asset: vuln.host_name }, query:{ id: vuln.id, plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor } }" class="text-decoration-none" @click="closeCommonVulnModal">
                          <button class="cv-view-btn">View <i class="bi bi-arrow-right-circle-fill ms-1"></i></button>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Medium -->
            <div v-if="cvModalGroupedVulns.medium.length > 0" class="mte-severity-card cv-medium-card">
              <div class="mte-severity-head" @click="toggleCvModalGroup('medium')">
                <div class="mte-severity-left" style="color:#b45309;">
                  <i class="bi bi-exclamation-circle-fill mte-medium-icon"></i>
                  <span>Medium Vulnerabilities</span>
                  <span class="mte-badge medium">{{ cvModalGroupedVulns.medium.length }} Items</span>
                </div>
                <i class="bi" :class="cvModalOpenSev === 'medium' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
              <div v-if="cvModalOpenSev === 'medium'" class="mte-table-wrap">
                <table class="mte-table">
                  <thead><tr><th>Asset (IP)</th><th>OS</th><th>Vulnerability</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    <tr v-for="vuln in cvModalGroupedVulns.medium" :key="vuln.id || vuln.host_name + vuln.plugin_name">
                      <td style="font-weight:600; color:#1e293b;">{{ vuln.host_name || '—' }}</td>
                      <td style="color:#64748b; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="vuln.os || '—'">{{ vuln.os || '—' }}</td>
                      <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#334155;" :title="vuln.plugin_name">{{ vuln.plugin_name }}</td>
                      <td><span class="mte-pill" :class="getCvStatusPillClass(vuln.status)">{{ vuln.status || '—' }}</span></td>
                      <td>
                        <router-link :to="{ name:'VulFix', params:{ reportId: currentReportId, asset: vuln.host_name }, query:{ id: vuln.id, plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor } }" class="text-decoration-none" @click="closeCommonVulnModal">
                          <button class="cv-view-btn">View <i class="bi bi-arrow-right-circle-fill ms-1"></i></button>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Low -->
            <div v-if="cvModalGroupedVulns.low.length > 0" class="mte-severity-card cv-low-card">
              <div class="mte-severity-head" @click="toggleCvModalGroup('low')">
                <div class="mte-severity-left" style="color:#0f766e;">
                  <i class="bi bi-gear-fill mte-low-icon"></i>
                  <span>Low Vulnerabilities</span>
                  <span class="mte-badge low">{{ cvModalGroupedVulns.low.length }} Items</span>
                </div>
                <i class="bi" :class="cvModalOpenSev === 'low' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
              </div>
              <div v-if="cvModalOpenSev === 'low'" class="mte-table-wrap">
                <table class="mte-table">
                  <thead><tr><th>Asset (IP)</th><th>OS</th><th>Vulnerability</th><th>Status</th><th></th></tr></thead>
                  <tbody>
                    <tr v-for="vuln in cvModalGroupedVulns.low" :key="vuln.id || vuln.host_name + vuln.plugin_name">
                      <td style="font-weight:600; color:#1e293b;">{{ vuln.host_name || '—' }}</td>
                      <td style="color:#64748b; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" :title="vuln.os || '—'">{{ vuln.os || '—' }}</td>
                      <td style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:#334155;" :title="vuln.plugin_name">{{ vuln.plugin_name }}</td>
                      <td><span class="mte-pill" :class="getCvStatusPillClass(vuln.status)">{{ vuln.status || '—' }}</span></td>
                      <td>
                        <router-link :to="{ name:'VulFix', params:{ reportId: currentReportId, asset: vuln.host_name }, query:{ id: vuln.id, plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor } }" class="text-decoration-none" @click="closeCommonVulnModal">
                          <button class="cv-view-btn">View <i class="bi bi-arrow-right-circle-fill ms-1"></i></button>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="mte-modal-footer">
            <button type="button" class="mte-btn-secondary" @click="closeCommonVulnModal">Close</button>
            <button type="button" class="mte-btn-primary" @click="$router.push({ path: '/missingsecurityupdates', query: { team: mitigationActiveTab } }); closeCommonVulnModal();">
              Full Report <i class="bi bi-arrow-right ms-1"></i>
            </button>
          </div>

        </div>
      </div>

    </section>
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
      showMitigationExtensionModal: false,
      mteOpenSection: "critical",
      showCommonVulnModal: false,
      cvModalOpenSev: 'critical',
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
      showLocationDropdown: false,
      activeSubDropdown: null,
      selectedLocationData: null,
      selectedLocationType: null,
      tempLocations: [
        { id: 1, name: "India", types: ["Internal", "External"] },
        { id: 2, name: "China", types: ["Internal"] },
        { id: 3, name: "USA", types: ["External"] },
        { id: 4, name: "Germany", types: ["Internal", "External"] },
      ],
      reportStatusChecking: true,
      hasReport: false,
      reportStatusMessage: "",
      reportStatusInterval: null,
      currentReportId: null,
      supportTotal: 0,
      showAssetsOverlay: false,
      overlayQuery: '',
      overlaySelectedAsset: null,
      overlayActiveTab: 'vulnerabilities',
      overlayActiveSeverity: 'All',
      overlayVulnsLoading: false,
      overlaySupportRequests: [],
      overlayClosedVulns: [],
      overlayActiveIndex: null,
      supportPending: 0,
      supportClosed: 0,
      vulFixedTotal: 0,
      vulFixedCritical: 0,
      vulFixedHigh: 0,
      vulFixedMedium: 0,
      vulFixedLow: 0,
      dashboardLoadToken: 0,
      mitigationLoading: false,
      mitigationByTeamData: null,
      vulnAssetCountData: null,
      allAssets: [],
      mitigationActiveTab: "Patch Management",
      mitigationTabs: [
        { key: "Patch Management",        label: "Patch Management",        icon: "bi bi-grid-1x2",          id: "ID: PV-01", assigned: "ASSIGNED TO CORE INFRASTRUCTURE" },
        { key: "Configuration Management",label: "Configuration Management",icon: "bi bi-gear",               id: "ID: CM-04", assigned: "ASSIGNED TO DEVOPS TEAM" },
        { key: "Network Security",        label: "Network Security",        icon: "bi bi-shield-exclamation", id: "ID: NS-02", assigned: "ASSIGNED TO NETWORK OPS" },
        { key: "Architectural Flaws",     label: "Architectural Flaws",     icon: "bi bi-diagram-3",          id: "ID: AF-09", assigned: "ASSIGNED TO ARCHITECTURE" },
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
    cvModalGroupedVulns() {
      const vulns = this.mitigationActiveTeamData?.vulnerabilities || [];
      const groups = { critical: [], high: [], medium: [], low: [] };
      for (const vuln of vulns) {
        const sev = (vuln.risk_factor || '').toLowerCase();
        if (groups[sev] !== undefined) groups[sev].push(vuln);
        else groups.low.push(vuln);
      }
      return groups;
    },
    vulnAssetCountMap() {
      if (!this.vulnAssetCountData?.teams) return {};
      const map = {};
      const norm = (s) => String(s || '').trim().toLowerCase();
      for (const teamData of Object.values(this.vulnAssetCountData.teams)) {
        for (const v of (teamData.vulnerabilities || [])) {
          map[norm(v.plugin_name)] = v.asset_count;
        }
      }
      return map;
    },
    teamAssets() {
      if (!this.mitigationActiveTab || !this.allAssets.length) return [];
      const norm = (s) => String(s).toLowerCase().trim();
      const byTeam = this.allAssets.filter(a =>
        Array.isArray(a.assigned_teams) &&
        a.assigned_teams.some(t => norm(t) === norm(this.mitigationActiveTab))
      );
      if (byTeam.length > 0) return byTeam;
      const teamVulns = this.mitigationActiveTeamData.vulnerabilities || [];
      const teamHostnames = new Set();
      for (const vuln of teamVulns) {
        if (Array.isArray(vuln.assets)) vuln.assets.forEach(h => teamHostnames.add(norm(h)));
        else if (vuln.host_name) teamHostnames.add(norm(vuln.host_name));
      }
      if (teamHostnames.size === 0) return [];
      return this.allAssets.filter(a => teamHostnames.has(norm(a.asset)));
    },
    filteredOverlayAssets() {
      const q = (this.overlayQuery || '').toLowerCase();
      const assets = this.authStore.assetRows || [];
      if (!q) return assets;
      return assets.filter(a => (a.asset || '').toLowerCase().includes(q));
    },
    overlayPagedAssets() {
      return this.filteredOverlayAssets;
    },
    overlayFilteredVulns() {
      const list = this.authStore.selectedAssetVulnerabilities || [];
      const filtered = this.overlayActiveSeverity === 'All' ? list : list.filter(v => v.severity === this.overlayActiveSeverity);
      return [...filtered].sort((a, b) => {
        const rank = { Critical: 1, High: 2, Medium: 3, Low: 4 };
        return (rank[a.severity] || 99) - (rank[b.severity] || 99);
      });
    },
    uniqueMitigationVulns() {
      const seen = new Map();
      for (const vuln of this.mitigationActiveTeamData.vulnerabilities) {
        const key = (vuln.plugin_name || '').trim().toLowerCase();
        if (!seen.has(key)) {
          const assets = new Set();
          if (Array.isArray(vuln.assets)) vuln.assets.forEach(a => assets.add(String(a)));
          if (vuln.host_name) assets.add(String(vuln.host_name));
          if (vuln.asset) assets.add(String(vuln.asset));
          if (vuln.ip) assets.add(String(vuln.ip));
          if (vuln.hostname) assets.add(String(vuln.hostname));

          seen.set(key, {
            ...vuln,
            _assetSet: assets,
            assetCount: assets.size,
          });
        } else {
          const existing = seen.get(key);
          if (Array.isArray(vuln.assets)) vuln.assets.forEach(a => existing._assetSet.add(String(a)));
          if (vuln.host_name) existing._assetSet.add(String(vuln.host_name));
          if (vuln.asset) existing._assetSet.add(String(vuln.asset));
          if (vuln.ip) existing._assetSet.add(String(vuln.ip));
          if (vuln.hostname) existing._assetSet.add(String(vuln.hostname));
          existing.assetCount = existing._assetSet.size;
        }
      }
      return Array.from(seen.values()).map(({ _assetSet, ...rest }) => rest);
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
    meanRemediateHuman() {
      const mttr = this.authStore.meanTimeToRemediate?.mean_time_to_remediate;
      if (!mttr) return "0w 0d 0hrs";
      const weeks = mttr.weeks ?? 0;
      const days = mttr.days ?? 0;
      const hours = mttr.hours_remaining ?? 0;
      return `${weeks}w ${days}d ${hours}hrs`;
    },
    selectedLocationDisplay() {
      if (!this.selectedLocationData) return "";
      if (this.selectedLocationType) {
        return `${this.selectedLocationData.name} - ${this.selectedLocationType}`;
      }
      return this.selectedLocationData.name;
    },
    totalVulnerabilities() {
      const v = this.authStore.vulnerabilities;
      return (v.critical || 0) + (v.high || 0) + (v.medium || 0) + (v.low || 0);
    },
    vulnGaugePaths() {
      const v = this.authStore.vulnerabilities;
      const total = (v.critical || 0) + (v.high || 0) + (v.medium || 0) + (v.low || 0);
      if (total === 0) return { critical: '', high: '', medium: 'M 10 50 A 40 40 0 0 1 90 50', low: '' };

      const pt = (deg) => {
        const r = (deg * Math.PI) / 180;
        return [(50 + 40 * Math.cos(r)).toFixed(2), (50 - 40 * Math.sin(r)).toFixed(2)];
      };

      const cf = (v.critical || 0) / total;
      const hf = (v.high || 0) / total;
      const mf = (v.medium || 0) / total;
      const lf = (v.low || 0) / total;

      const a0 = 180;
      const a1 = a0 - cf * 180;
      const a2 = a1 - hf * 180;
      const a3 = a2 - mf * 180;

      const p0 = pt(a0), p1 = pt(a1), p2 = pt(a2), p3 = pt(a3), p4 = pt(0);

      const seg = (from, to, f) =>
        f > 0.001 ? `M ${from[0]} ${from[1]} A 40 40 0 0 1 ${to[0]} ${to[1]}` : '';

      return {
        critical: seg(p0, p1, cf),
        high: seg(p1, p2, hf),
        medium: seg(p2, p3, mf),
        low: seg(p3, p4, lf),
      };
    },

  },
  watch: {},
  methods: {
    async refreshVulnerabilitiesFixed() {
      const token = this.dashboardLoadToken;
      const res = await this.authStore.getDashboardVulnerabilitiesFixed(true);
      if (this.dashboardLoadToken !== token) return;
      if (res.status) {
        this.vulFixedTotal = res.data.total_fixed || 0;
        this.vulFixedCritical = res.data.critical_fixed || 0;
        this.vulFixedHigh = res.data.high_fixed || 0;
        this.vulFixedMedium = res.data.medium_fixed || 0;
        this.vulFixedLow = res.data.low_fixed || 0;
      }
    },
    openMitigationExtensionModal() {
      this.showMitigationExtensionModal = true;
      this.mteOpenSection = "critical";
    },
    closeMitigationExtensionModal() {
      this.showMitigationExtensionModal = false;
    },
    toggleMteSection(section) {
      this.mteOpenSection = this.mteOpenSection === section ? "" : section;
    },
    truncateReason(reason) {
      const text = String(reason || "");
      if (text.length <= 22) return text;
      return `${text.slice(0, 22)}...`;
    },
    openCommonVulnModal() {
      this.showCommonVulnModal = true;
      this.cvModalOpenSev = 'critical';
    },
    closeCommonVulnModal() {
      this.showCommonVulnModal = false;
    },
    toggleCvModalGroup(sev) {
      this.cvModalOpenSev = this.cvModalOpenSev === sev ? '' : sev;
    },
    getCvStatusPillClass(status) {
      const s = (status || '').toLowerCase();
      if (s === 'open') return 'cv-pill-open';
      if (s === 'closed' || s === 'close') return 'cv-pill-closed';
      return 'cv-pill-inprogress';
    },
    setMitigationTab(key) {
      this.mitigationActiveTab = key;
    },
    getTeamVulnCount(teamKey) {
      const teams = this.mitigationByTeamData?.teams || this.mitigationByTeamData || {};
      const normalize = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
      const matchKey = Object.keys(teams).find(k => normalize(k) === normalize(teamKey));
      return matchKey ? (teams[matchKey]?.vulnerabilities?.length || 0) : 0;
    },
    getTeamSevCount(teamKey, sev) {
      const teams = this.mitigationByTeamData?.teams || this.mitigationByTeamData || {};
      const normalize = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
      const matchKey = Object.keys(teams).find(k => normalize(k) === normalize(teamKey));
      if (!matchKey) return 0;
      return (teams[matchKey]?.vulnerabilities || []).filter(v => (v.risk_factor || '').toLowerCase() === sev).length;
    },
    getTeamAssetCount(teamKey) {
      const teams = this.mitigationByTeamData?.teams || this.mitigationByTeamData || {};
      const normalize = s => String(s).toLowerCase().replace(/\s+/g, ' ').trim();
      const matchKey = Object.keys(teams).find(k => normalize(k) === normalize(teamKey));
      if (!matchKey) return 0;
      const vulns = teams[matchKey]?.vulnerabilities || [];
      const assetsSet = new Set();
      vulns.forEach(v => {
        if (Array.isArray(v.assets)) v.assets.forEach(a => assetsSet.add(a));
        else if (v.host_name) assetsSet.add(v.host_name);
      });
      return assetsSet.size;
    },
    getMitigationRiskColor(risk) {
      const map = { Critical: "#b31c1c", High: "#f44336", Medium: "#f6b100", Low: "#4caf50" };
      return map[risk] || "#666";
    },
    getMitigationDays(sev) {
      const timeline = this.authStore.mitigationTimeline || {};
      const sevData = timeline?.[sev];

      if (typeof sevData === "number") return sevData;
      if (typeof sevData === "string") {
        const parsed = Number(sevData);
        return Number.isFinite(parsed) ? parsed : null;
      }
      if (sevData && typeof sevData === "object") {
        if (typeof sevData.days === "number") return sevData.days;
        if (typeof sevData.remaining_days === "number") return sevData.remaining_days;
        if (typeof sevData.value === "number") return sevData.value;
      }

      const flatKey =
        timeline?.[`${sev}_days`] ??
        timeline?.[`${sev}Days`] ??
        timeline?.remaining?.[sev] ??
        timeline?.timeline?.[sev]?.days;

      if (typeof flatKey === "number") return flatKey;
      if (typeof flatKey === "string") {
        const parsed = Number(flatKey);
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    },
    getMitigationValue(sev) {
      const timeline = this.authStore.mitigationTimeline || {};
      const sevData = timeline?.[sev];
      const days = this.getMitigationDays(sev);
      if (sevData && typeof sevData === "object") {
        return {
          raw: sevData.raw || sevData.label || `${days ?? ""} days`,
          days,
        };
      }
      return { raw: days !== null ? `${days} days` : null, days };
    },
    mitigationPct(sev) {
      const remaining = this.getMitigationDays(sev);
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
    async loadAllAssets() {
      const result = await this.authStore.fetchAssets();
      if (result.status) {
        this.allAssets = this.authStore.assetRows || [];
      }
    },

    getPrioritySeverity(asset) {
      const s = asset?.severity_counts || {};
      if ((s.critical ?? 0) > 0) return 'Critical';
      if ((s.high ?? 0) > 0) return 'High';
      if ((s.medium ?? 0) > 0) return 'Medium';
      if ((s.low ?? 0) > 0) return 'Low';
      return '';
    },

    // Normalized lookup so API plugin_name capitalization/spacing differences don't break mapping
    getVulnAssetCount(vuln) {
      const key = String(vuln?.plugin_name || '').trim().toLowerCase();
      if (!key) return vuln?.assetCount ?? 0;
      return this.vulnAssetCountMap[key] ?? vuln?.assetCount ?? 0;
    },
    async overlaySetActive(asset) {
      if (!asset?.asset) return;
      this.overlaySelectedAsset = asset;
      this.overlayActiveIndex = asset.asset;
      this.overlayActiveTab = 'vulnerabilities';
      this.overlayActiveSeverity = 'All';
      this.overlayVulnsLoading = true;
      this.overlaySupportRequests = [];
      this.overlayClosedVulns = [];

      await this.authStore.fetchSingleAssetVulnerabilities(asset.asset);
      this.overlayVulnsLoading = false;

      const supRes = await this.authStore.getSupportRequestsByHost(asset.asset);
      if (supRes.status) this.overlaySupportRequests = supRes.data || [];

      const reportId = this.authStore.latestReportId;
      if (reportId) {
        const fixRes = await this.authStore.getClosedVulnerabilities(reportId, asset.asset);
        if (fixRes.status && fixRes.data?.results) {
          this.overlayClosedVulns = fixRes.data.results.filter(v => v.status?.toLowerCase() === 'closed');
        }
      }
    },
    getOverlayVulRegisterId(v) {
      const asset = this.authStore.selectedAssetDetail?.asset;
      const match = this.authStore.vulnerabilityRows?.find(
        row => (row.vul_name === v.vul_name || row.vulnerability_name === v.vul_name) && row.asset === asset
      );
      return match?.id || v.id || '';
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
      if (this.reportStatusChecking || !this.authStore.reportStatus.hasReport) {
        console.log("⏭️ Skipping testing overlay - report status check in progress or no report");
        return;
      }

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
        this.createOverlayInDOM();
        this.updateOverlayTimer(Math.ceil(remainingMs / 1000), (remainingMs / 20000) * 100);

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
      console.log("Selected:", loc.name, type);
    },
    closeLocationDropdown(e) {
      const dropdown = this.$el.querySelector('.location-dropdown');
      if (dropdown && !dropdown.contains(e.target)) {
        this.showLocationDropdown = false;
        this.activeSubDropdown = null;
      }
    },
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
    async loadMitigationTimeline(force = false) {
      const res = await this.authStore.fetchDashboardMitigationTimeline(force);
      if (res.status) {
        this.mitigationTimeline = res.data;
      }
    },

    loadDashboardData() {
      const token = Date.now();
      this.dashboardLoadToken = token;
      this.loadMitigationByTeam();
      this.loadVulnAssetCount();
      this.loadRiskCriteria();
      this.loadAllAssets();
      // Keep this independent so vulnerabilities fixed API always hits.
      this.refreshVulnerabilitiesFixed();
      Promise.all([
        this.authStore.fetchDashboardTotalAssets(),
        this.authStore.fetchDashboardAvgScore(),
        this.authStore.fetchDashboardVulnerabilities(),
        this.authStore.fetchDashboardMitigationTimeline(true),
        this.authStore.fetchDashboardMeanTimeToRemediate(),
        this.authStore.getDashboardSupportRequests().then(res => {
          if (this.dashboardLoadToken !== token) return;
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
          console.log("✅ Report available:", res.reportId);
          this.currentReportId = res.reportId;
          localStorage.setItem("reportId", res.reportId);

          this.stopReportStatusPolling();
          this.removeReportStatusOverlay();
          this.showReportAvailableAlert();
          this.reportStatusChecking = false;

          this.loadDashboardData();
        } else {
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

      this.reportStatusInterval = setInterval(() => {
        if (!this.hasReport && !this.authStore.reportStatus.hasReport) {
          this.checkReportStatus();
        } else {
          this.stopReportStatusPolling();
          this.removeReportStatusOverlay();
        }
      }, 5000);
    },

    stopReportStatusPolling() {
      if (this.reportStatusInterval) {
        clearInterval(this.reportStatusInterval);
        this.reportStatusInterval = null;
        console.log("⏹️ Stopped report status polling");
      }
    },

    createReportStatusOverlay() {
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

      if (this.authStore.reportStatus.checked && this.authStore.reportStatus.hasReport) {
        console.log("✅ Report already confirmed from store");
        this.hasReport = true;
        this.currentReportId = this.authStore.reportStatus.reportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
        this.loadDashboardData();
        return;
      }

      const cachedReportId = localStorage.getItem("reportId");
      if (cachedReportId) {
        console.log("✅ Report already confirmed from localStorage:", cachedReportId);
        this.hasReport = true;
        this.currentReportId = cachedReportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
        this.loadDashboardData();
        return;
      }

      this.reportStatusChecking = true;
      this.reportStatusMessage = "Checking report status...";
      this.createReportStatusOverlay();

      const res = await this.authStore.getReportStatus();

      if (res.status && res.hasReport) {
        console.log("✅ Report already exists:", res.reportId);
        this.hasReport = true;
        this.currentReportId = res.reportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
      } else {
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

  this.initReportStatusCheck();

  setTimeout(() => {
    this.initTestingOverlay();
  }, 100);

  const user =
    this.authStore.user ||
    JSON.parse(localStorage.getItem("user") || "null");

  this.loadDashboardData();
},

  beforeUnmount() {
    if (this.testingTimer) {
      clearInterval(this.testingTimer);
    }
    this.removeOverlayFromDOM();

    this.stopReportStatusPolling();
    this.removeReportStatusOverlay();
  },
  activated() {
    console.log("=== ACTIVATED hook called ===");
    this.initTestingOverlay();
    this.initReportStatusCheck();
    this.loadDashboardData();
    this.refreshVulnerabilitiesFixed();
  },
};
</script>

<style scoped>
/* ===== COMMON VULNERABILITIES ===== */
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
.cv-team-card-active { border-color: #0f696e; box-shadow: 0 0 0 2px rgba(15,105,110,0.15); }
.cv-team-icon-wrap {
  width: 32px; height: 32px;
  background: #e0f2f1;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #0f696e; font-size: 15px;
}
.cv-team-id { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.cv-team-name { font-size: 0.78rem; font-weight: 700; color: #475569; margin: 10px 0 2px; text-transform: uppercase; letter-spacing: 0.04em; }
.cv-team-count { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0 0 4px; line-height: 1; }
.cv-team-assigned { font-size: 9px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
.cv-team-stats { margin: 8px 0 10px; display: flex; flex-direction: column; gap: 4px; }
.cv-stat-row { display: flex; align-items: center; gap: 6px; }
.cv-stat-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.cv-dot-critical { background: #dc2626; }
.cv-dot-high { background: #f97316; }
.cv-stat-label { font-size: 11px; color: #64748b; flex: 1; }
.cv-stat-val { font-size: 12px; font-weight: 700; color: #1e293b; }
.cv-affected-row { display: flex; align-items: center; gap: 6px; margin-top: auto; padding-top: 10px; border-top: 1px solid #f1f5f9; }
.cv-affected-label { font-size: 11px; color: #94a3b8; font-weight: 500; flex: 1; }
.cv-affected-num { font-size: 13px; font-weight: 800; color: #1e293b; }
.cv-vuln-heading { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
.cv-vuln-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex; flex-direction: column; height: 100%;
  transition: box-shadow 0.15s;
}
.cv-vuln-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.cv-vuln-assets { font-size: 11px; color: #64748b; font-weight: 500; }
.cv-vuln-name {
  font-size: 13px; font-weight: 700; color: #1e293b;
  overflow: hidden; text-overflow: ellipsis;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  line-clamp: 2;
  white-space: normal; margin: 6px 0 4px; line-height: 1.4;
}
.cv-affected-label { font-size: 11px; color: #64748b; font-weight: 500; }
.cv-sev-badge { font-size: 9px; font-weight: 800; padding: 2px 7px; border-radius: 4px; letter-spacing: 0.04em; white-space: nowrap; }
.cv-badge-critical { background: #fee2e2; color: #dc2626; }
.cv-badge-high     { background: #fff7ed; color: #f97316; }
.cv-badge-medium   { background: #fefce8; color: #ca8a04; }
.cv-badge-low      { background: #f0fdf4; color: #16a34a; }

/* ===== DASHBOARD REDESIGN ===== */
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
.dash-card-compact {
  padding: 12px;
}
.dash-card-tight {
  padding: 12px;
}
.dash-card-analytics {
  min-height: 160px;
}
.row1-equal-height {
  min-height: 238px;
}
.row1-equal-card {
  height: 238px;
  min-height: 238px;
  max-height: 238px;
}
.dash-monitored-badge {
  display: inline-flex;
  align-items: center;
  background: #e0f2f1;
  color: #0f696e;
  font-size: 9px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
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
.dash-mte-title {
  font-size: 13px;
  font-weight: 800;
  color: #1e293b;
  text-transform: uppercase;
}
.dash-mte-subtitle {
  margin-top: 2px;
  font-size: 11px;
  color: #64748b;
}
.dash-mte-link {
  font-size: 11px;
  font-weight: 700;
  color: #0f696e;
  text-transform: uppercase;
  white-space: nowrap;
}
.dash-mte-link-btn {
  border: none;
  background: transparent;
  font-size: 11px;
  font-weight: 700;
  color: #0f696e;
  text-transform: uppercase;
  white-space: nowrap;
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
.dash-mte-table td:last-child {
  border-right: none;
}
.dash-mte-table tbody tr:last-child td {
  border-bottom: none;
}
.dash-mte-table tbody tr:hover td {
  background: #f8fafc;
}
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
.dash-mte-pill.high { background: #ffedd5; color: #ea580c; border: 1px solid #fdba74; }
.dash-mte-pill.medium { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
.dash-mte-pill.low { background: #ccfbf1; color: #0f766e; border: 1px solid #5eead4; }

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
  padding: 0;
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
.mte-modal-title {
  margin: 0;
  color: #241447;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: 0.01em;
  text-transform: capitalize;
}
.mte-modal-subtitle {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.45;
}
.mte-close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  color: #241447;
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
  color: #1f2340;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
}
.mte-critical .mte-severity-left { color: #c71616; }
.mte-badge {
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  padding: 3px 7px;
}
.mte-badge.critical { background: #c71616; color: #fff; }
.mte-badge.high { background: #ffedd5; color: #ea580c; }
.mte-badge.medium { background: #fef3c7; color: #d97706; }
.mte-badge.low { background: #ccfbf1; color: #0f766e; }
.mte-table-wrap { overflow-x: auto; border-top: 1px solid #e2e8f0; }
.mte-table { width: 100%; border-collapse: collapse; min-width: 760px; }
.mte-table th,
.mte-table td {
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  line-height: 1.35;
  color: #334155;
  vertical-align: middle;
}
.mte-table th {
  background: #eef2f7;
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: #475569;
}
.mte-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}
.mte-pill.sev { background: #fee2e2; color: #dc2626; }
.mte-pill.status { background: #e5e7eb; color: #374151; }
.mte-extension { font-weight: 800; color: #1e293b !important; }
.mte-reason {
  max-width: 170px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  color: #475569;
  font-weight: 600;
}
.mte-high-icon { color: #f59e0b; }
.mte-medium-icon { color: #fbbf24; }
.mte-low-icon { color: #0f766e; }
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
}
.mte-btn-primary {
  border: none;
  background: #241447;
  color: #fff;
  border-radius: 999px;
  padding: 10px 22px;
  font-weight: 700;
  font-size: 14px;
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
.dash-sub-text { font-size: 13px; color: #64748b; }
.dash-bs-badge {
  background: #e0f2f1;
  color: #0f696e;
  font-size: 10px;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
}
.dash-sev-badge {
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 50px;
  display: inline-block;
  margin-bottom: 2px;
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
.dash-sev-label {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  width: 52px;
  flex-shrink: 0;
}
.dash-progress-track {
  height: 12px;
  background: #f1f5f9;
  border-radius: 50px;
  overflow: hidden;
}
.dash-progress-fill {
  height: 100%;
  border-radius: 50px;
  transition: width 0.6s ease;
  min-width: 0;
}
.dash-sev-pct {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  width: 36px;
  text-align: right;
  flex-shrink: 0;
}
.dash-mom-badge {
  background: #e0f2f1;
  color: #0f696e;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.dash-mini-bar {
  background: #0f696e;
  border-radius: 3px 3px 0 0;
  width: 100%;
  min-height: 3px;
}
.dash-bar-lbl {
  font-size: 9px;
  font-weight: 700;
  color: #94a3b8;
}
.dash-tab-btn {
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 700;
  color: #94a3b8;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.dash-tab-btn:hover { color: #475569; }
.dash-tab-btn.dash-tab-active {
  color: #1e293b;
  border-bottom-color: #1e293b;
}
.dash-vuln-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: box-shadow 0.2s;
}
.dash-vuln-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* ===== EXISTING STYLES (preserved) ===== */
.truncated-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  width: 100%;
  display: block;
  cursor: pointer;
}
.bg-maroon { background-color: maroon !important; }
.bg-red { background-color: red !important; }

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
.info-tooltip:hover::before { opacity: 1; }

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

/* Testing overlay styles */
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
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

/* Report styles (preserved for ViewReport functionality) */
.report-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
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
.rsev-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: inline-block; }
.rsev-maroon, .rsev-critical { background: maroon; color: white; }
.rsev-red, .rsev-high { background: red; color: white; }
.rsev-orange, .rsev-medium { background: goldenrod; color: white; }
.rsev-darkgreen, .rsev-low { background: green; color: white; }
.rteam-badge { padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; }
.rteam-network { background: #3b82f6; color: white; }
.rteam-patch { background: #10b981; color: white; }
.rteam-configuration { background: #f97316; color: white; }
.rteam-architectural { background: #dc2626; color: white; }
.rstatus-open { padding: 6px 12px; border-radius: 20px; background: #fee2e2; color: #dc2626; font-size: 0.85rem; font-weight: 600; display: inline-block; }
.rstatus-closed { padding: 6px 12px; border-radius: 20px; background: #d1fae5; color: #059669; font-size: 0.85rem; font-weight: 600; display: inline-block; }

/* ── Mitigation Strategy — Risk Criteria stacked layout ── */
.ms-team-label {
  font-size: 0.875rem;
  color: #475569;
  font-weight: 500;
}
.ms-team-label strong {
  color: #241447;
  font-weight: 700;
}

.ms-risk-stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ms-risk-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-radius: 10px;
  border-left: 4px solid transparent;
}
.ms-risk-critical { background: #fef2f2; border-left-color: #9b1c1c; }
.ms-risk-high     { background: #fff7ed; border-left-color: #c2410c; }
.ms-risk-medium   { background: #fefce8; border-left-color: #a16207; }
.ms-risk-low      { background: #f0fdf4; border-left-color: #15803d; }

.ms-risk-left {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ms-risk-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.ms-risk-name {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ms-risk-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ms-risk-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  min-width: 40px;
  text-align: right;
}
.ms-risk-add {
  background: none;
  border: none;
  padding: 2px 4px;
  cursor: pointer;
  color: #94a3b8;
  font-size: 0.8rem;
  border-radius: 4px;
  transition: color 0.15s, background 0.15s;
}
.ms-risk-add:hover {
  color: #241447;
  background: rgba(36,20,71,0.08);
}

/* ===== ASSETS OVERLAY CSS ===== */
.assets-split-panel {
  display: flex;
  height: 100%;
  width: 100%;
  background: #f8f9fc;
  overflow: hidden;
}

.assets-left-panel {
  width: 340px;
  min-width: 300px;
  max-width: 340px;
  flex-shrink: 0;
  border-right: 1px solid rgba(203,196,208,0.3);
  display: flex;
  flex-direction: column;
  background: #ffffff;
  overflow: hidden;
  padding-top: 72px;
}

.left-panel-header {
  padding: 22px 20px 14px;
  border-bottom: 1px solid rgba(203,196,208,0.2);
  flex-shrink: 0;
}

.assets-header-row {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  min-height: 28px;
  margin-bottom: 10px !important;
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

.search-wrap {
  position: relative;
  margin-top: 20px;
  padding-top: 0;
}
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
.assets-search:focus { box-shadow: 0 0 0 2px rgba(15,105,110,0.2); }

.clear-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #49454f;
  font-size: 0.85rem;
}

.asset-list-scroll {
  flex: 1;
  overflow-y: auto;
}
.asset-list-scroll::-webkit-scrollbar { width: 4px; }
.asset-list-scroll::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.asset-item-new {
  padding: 14px 20px;
  border-bottom: 1px solid rgba(203,196,208,0.15);
  cursor: pointer;
  transition: background 0.15s;
  border-left: 4px solid transparent;
}
.asset-item-new:hover { background: #f2f3f6; }
.asset-item-active {
  background: #ffffff;
  border-left: 4px solid #0f696e !important;
}
.asset-item-new .sev-badge {
  margin-top: 8px;
}

.asset-ip {
  font-size: 0.88rem;
  font-weight: 700;
  color: #241447;
}

.sev-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 12px;
  border-radius: 50px;
  white-space: nowrap;
  border: none;
}
.sev-critical { background: #ffdad6; color: #93000a; }
.sev-high     { background: #ffedd5; color: #c2410c; }
.sev-medium   { background: #fef9c3; color: #854d0e; }
.sev-low      { background: #ccfbf1; color: #0f696e; }

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

.assets-right-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8f9fc;
  overflow: hidden;
  min-width: 0;
  max-width: 100%;
}

.right-panel-header {
  padding: 56px 36px 0;
  background: #f8f9fc;
  flex-shrink: 0;
  overflow: hidden;
}

.asset-detail-title {
  font-size: 1.7rem;
  font-weight: 800;
  color: #241447;
  letter-spacing: -0.02em;
  margin: 0;
  padding-top: 0;
}

.asset-top-meta-row {
  margin-top: 0;
  flex-wrap: nowrap !important;
  align-items: center !important;
  gap: 12px !important;
}

.asset-top-meta-row .sev-badge,
.asset-top-meta-row .status-open-badge {
  margin-top: 0;
}

.asset-top-meta-row .asset-last-scanned {
  margin-top: 0;
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

.vuln-top-meta-row {
  margin-top: 4px;
}

.detail-tabs {
  display: flex;
  gap: 24px;
  border-bottom: 1px solid rgba(203,196,208,0.2);
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

.right-panel-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 24px 36px;
}
.right-panel-scroll::-webkit-scrollbar { width: 4px; }
.right-panel-scroll::-webkit-scrollbar-thumb { background: #cbc4d0; border-radius: 10px; }

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #49454f;
  margin: 0;
}

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

.vuln-accordion-item {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid rgba(203,196,208,0.25);
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

.vuln-accordion-body { padding: 18px 20px; }

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

.fixed-divider { height: 1px; background: rgba(203,196,208,0.25); }
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

.support-req-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(203,196,208,0.2);
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

.mitigation-hold-section {
  flex-shrink: 0;
  background: #f2f3f6;
  padding: 14px 16px;
  border-top: 1px solid rgba(203,196,208,0.2);
  max-height: 220px;
  overflow-y: auto;
}
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

.mitigation-vuln-card {
  background: #ffffff;
  border: 1px solid rgba(203, 196, 208, 0.45);
  border-radius: 14px;
  padding: 18px;
  min-height: 190px;
  max-width: 100%;
}

.mitigation-vuln-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.mitigation-vuln-col {
  width: 280px;
  max-width: 280px;
  flex: 0 0 280px;
}

.mitigation-vuln-meta {
  color: #4b5563;
  font-size: 14px;
  font-weight: 600;
}

.mitigation-vuln-severity {
  color: #a16207;
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
  text-transform: capitalize;
}

.mitigation-vuln-title {
  color: #111827;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== COMMON VULNERABILITIES MODAL EXTRAS ===== */
.cv-high-card   { border-color: #fed7aa; background: #fffbf5; }
.cv-medium-card { border-color: #fde68a; background: #fffdf0; }
.cv-low-card    { border-color: #99f6e4; background: #f0fffe; }

.cv-pill-open       { background: #fee2e2; color: #dc2626; }
.cv-pill-closed     { background: #ccfbf1; color: #0f766e; }
.cv-pill-inprogress { background: #e5e7eb; color: #374151; }

.cv-view-btn {
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
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s;
}
.cv-view-btn:hover {
  background: rgba(15,105,110,0.07);
  border-color: #0f696e;
}
</style>
