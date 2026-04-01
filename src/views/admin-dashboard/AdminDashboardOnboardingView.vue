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
            <div class="row g-4 mb-4">

              <!-- Card 1: Total Assets -->
              <div class="col-4">
                <router-link to="/assets" class="text-decoration-none">
                  <div class="dash-card h-100">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="d-flex align-items-center gap-2">
                        <div class="dash-icon-wrap">
                          <i class="bi bi-laptop dash-icon-teal" style="font-size: 14px;"></i>
                        </div>
                        <span class="dash-card-label">Total Assets</span>
                      </div>
                      <div class="dash-bs-badge">Bs</div>
                    </div>
                    <div class="d-flex align-items-baseline gap-3 mb-3">
                      <span class="dash-big-num">{{ authStore.totalAssets }}</span>
                      <span class="dash-sub-text">Avg. score: <strong class="text-dark">{{ Number(authStore.avgScore).toFixed(2) }}</strong></span>
                    </div>
                    <!-- Sparkline chart -->
                    <div style="height: 64px; width: 100%;">
                      <svg style="width:100%; height:100%;" viewBox="0 0 100 30" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="grad-teal" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stop-color="#0f696e" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#0f696e" stop-opacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d="M0 25 L15 20 L30 23 L45 15 L60 18 L75 12 L90 8 L100 10 V30 H0 Z" fill="url(#grad-teal)" fill-opacity="0.12"/>
                        <path d="M0 25 L15 20 L30 23 L45 15 L60 18 L75 12 L90 8 L100 10" fill="none" stroke="#0f696e" stroke-linecap="round" stroke-width="1.5"/>
                      </svg>
                    </div>
                  </div>
                </router-link>
              </div>

              <!-- Card 2: Vulnerabilities Gauge -->
              <div class="col-4">
                <div class="dash-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-shield-fill-exclamation dash-icon-teal" style="font-size: 14px;"></i>
                    </div>
                    <span class="dash-card-label">Vulnerabilities</span>
                    <span class="info-tooltip" data-tooltip="Total number of identified vulnerabilities across all assets, categorized by severity levels."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>

                  <!-- Semi-circle gauge -->
                  <div class="d-flex flex-column align-items-center">
                    <div style="width: 192px; height: 96px; position: relative; overflow: hidden;">
                      <svg width="100%" height="100%" viewBox="0 0 100 50">
                        <!-- Background arc -->
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f3f4f6" stroke-width="12"/>
                        <!-- Dynamic severity segments -->
                        <path v-if="vulnGaugePaths.critical" :d="vulnGaugePaths.critical" fill="none" stroke="#b91c1c" stroke-width="12" stroke-linecap="butt"/>
                        <path v-if="vulnGaugePaths.high" :d="vulnGaugePaths.high" fill="none" stroke="#ef4444" stroke-width="12" stroke-linecap="butt"/>
                        <path v-if="vulnGaugePaths.medium" :d="vulnGaugePaths.medium" fill="none" stroke="#f59e0b" stroke-width="12" stroke-linecap="butt"/>
                        <path v-if="vulnGaugePaths.low" :d="vulnGaugePaths.low" fill="none" stroke="#10b981" stroke-width="12" stroke-linecap="butt"/>
                      </svg>
                      <!-- Center info overlay -->
                      <div style="position:absolute; bottom:0; left:50%; transform:translateX(-50%); text-align:center; white-space:nowrap;">
                        <span class="dash-sev-badge" style="background:#f59e0b;">{{ authStore.vulnerabilities.medium }}</span>
                        <div style="font-size:1.5rem; font-weight:800; color:#1f2937; line-height:1.1;">{{ totalVulnerabilities }}</div>
                        <div style="font-size:9px; color:#9ca3af; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;">Total</div>
                      </div>
                    </div>
                  </div>

                  <!-- Legend -->
                  <div class="d-flex justify-content-center gap-3 mt-3 flex-wrap">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#b91c1c;"></span>Critical</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#ef4444;"></span>High</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#f59e0b;"></span>Medium</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#10b981;"></span>Low</div>
                  </div>
                </div>
              </div>

              <!-- Card 3: Mitigation Timeline -->
              <div class="col-4">
                <div class="dash-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-4">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-clock-history dash-icon-teal" style="font-size: 14px;"></i>
                    </div>
                    <span class="dash-card-label">Mitigation Timeline</span>
                    <span class="info-tooltip" data-tooltip="Displays the remaining remediation time for vulnerabilities based on the defined risk criteria."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>

                  <div class="d-flex flex-column gap-3">
                    <!-- Critical -->
                    <div class="d-flex align-items-center gap-3">
                      <span class="dash-sev-label">Critical</span>
                      <div class="dash-progress-track flex-fill">
                        <div class="dash-progress-fill" :style="{ width: mitigationPct('critical').compliancePct + '%', background: '#0f696e' }"></div>
                      </div>
                      <span class="dash-sev-pct">{{ formatTimeline(authStore.mitigationTimeline?.critical) }}</span>
                    </div>
                    <!-- High -->
                    <div class="d-flex align-items-center gap-3">
                      <span class="dash-sev-label">High</span>
                      <div class="dash-progress-track flex-fill">
                        <div class="dash-progress-fill" :style="{ width: mitigationPct('high').compliancePct + '%', background: '#0f696e' }"></div>
                      </div>
                      <span class="dash-sev-pct">{{ formatTimeline(authStore.mitigationTimeline?.high) }}</span>
                    </div>
                    <!-- Medium -->
                    <div class="d-flex align-items-center gap-3">
                      <span class="dash-sev-label">Medium</span>
                      <div class="dash-progress-track flex-fill">
                        <div class="dash-progress-fill" :style="{ width: mitigationPct('medium').compliancePct + '%', background: '#0f696e' }"></div>
                      </div>
                      <span class="dash-sev-pct">{{ formatTimeline(authStore.mitigationTimeline?.medium) }}</span>
                    </div>
                    <!-- Low -->
                    <div class="d-flex align-items-center gap-3">
                      <span class="dash-sev-label">Low</span>
                      <div class="dash-progress-track flex-fill">
                        <div class="dash-progress-fill" :style="{ width: mitigationPct('low').compliancePct + '%', background: '#0f696e' }"></div>
                      </div>
                      <span class="dash-sev-pct">{{ formatTimeline(authStore.mitigationTimeline?.low) }}</span>
                    </div>
                  </div>

                  <div class="d-flex justify-content-center gap-4 mt-4">
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#0f696e;"></span>SLA compliance</div>
                    <div class="dash-legend-item"><span class="dash-dot" style="background:#ef4444;"></span>Non-compliance</div>
                  </div>
                </div>
              </div>

              <!-- Card 4: Total Vulnerabilities Fixed -->
              <div class="col-4">
                <div class="dash-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-3">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-patch-check-fill dash-icon-teal" style="font-size: 14px;"></i>
                    </div>
                    <span class="dash-card-label">Total Vulnerabilities Fixed</span>
                    <span class="info-tooltip" data-tooltip="Total count of vulnerabilities that have been successfully remediated and verified as resolved within the system."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <span class="dash-big-num">{{ String(vulFixedTotal).padStart(2, '0') }}</span>
                    <div class="dash-mom-badge">
                      <i class="bi bi-arrow-up-short"></i>+5% MoM
                    </div>
                  </div>
                  <!-- Decorative bar chart -->
                  <div class="d-flex align-items-end gap-1" style="height: 64px;">
                    <div v-for="(bar, idx) in fixedBars" :key="idx" class="flex-fill d-flex flex-column align-items-center gap-1">
                      <div class="dash-mini-bar" :style="{ height: bar.h + '%', opacity: bar.op }"></div>
                      <span class="dash-bar-lbl">{{ idx + 1 }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card 5: MTTR -->
              <div class="col-4">
                <div class="dash-card h-100">
                  <div class="d-flex align-items-center gap-2 mb-4">
                    <div class="dash-icon-wrap">
                      <i class="bi bi-hourglass-split dash-icon-teal" style="font-size: 14px;"></i>
                    </div>
                    <span class="dash-card-label">Mean Time to Remediate (MTTR)</span>
                    <span class="info-tooltip" data-tooltip="Represents the average remediation time calculated based on the risk criteria defined for different vulnerability severity levels."><i class="bi bi-info-circle dash-info-icon"></i></span>
                  </div>
                  <div class="d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-2">
                      <span style="font-size:1.4rem; font-weight:800; color:#1f2937;">{{ meanRemediateHuman }}</span>
                      <i class="bi bi-arrow-down-circle-fill" style="color:#16a34a; font-size:1.1rem;"></i>
                    </div>
                    <!-- Circular gradient gauge -->
                    <div style="width:80px; height:80px; flex-shrink:0;">
                      <svg width="100%" height="100%" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="grad-gauge" x1="0%" x2="100%" y1="0%" y2="0%">
                            <stop offset="0%" stop-color="#ef4444"/>
                            <stop offset="50%" stop-color="#f59e0b"/>
                            <stop offset="100%" stop-color="#10b981"/>
                          </linearGradient>
                        </defs>
                        <path d="M 20 80 A 40 40 0 1 1 80 80" fill="none" stroke="#f3f4f6" stroke-linecap="round" stroke-width="12"/>
                        <path d="M 20 80 A 40 40 0 0 1 80 40" fill="none" stroke="url(#grad-gauge)" stroke-linecap="round" stroke-width="12"/>
                        <line stroke="#475569" stroke-linecap="round" stroke-width="3" x1="50" x2="70" y1="50" y2="30"/>
                        <circle cx="50" cy="50" fill="#475569" r="4"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Card 6: Support Requests -->
              <div class="col-4">
                <router-link to="/supportrequests" class="text-decoration-none">
                  <div class="dash-card h-100">
                    <div class="d-flex align-items-center gap-2 mb-4">
                      <div class="dash-icon-wrap">
                        <i class="bi bi-headset dash-icon-teal" style="font-size: 14px;"></i>
                      </div>
                      <span class="dash-card-label">Support Requests</span>
                      <span class="info-tooltip" data-tooltip="Total number of support requests raised in the system, categorized by their current status such as Pending or Closed."><i class="bi bi-info-circle dash-info-icon"></i></span>
                    </div>
                    <div class="d-flex align-items-center gap-4 pt-2">
                      <span class="dash-big-num">{{ String(supportTotal).padStart(2, '0') }}</span>
                      <div class="d-flex gap-4">
                        <div class="d-flex flex-column align-items-center">
                          <span style="font-size:1.25rem; font-weight:700; color:#1f2937;">{{ supportPending }}</span>
                          <div style="width:48px; height:4px; background:#f8d7da; border-radius:2px; margin:4px 0;"></div>
                          <div class="dash-legend-item"><span class="dash-dot" style="background:#ef4444;"></span>Pending</div>
                        </div>
                        <div class="d-flex flex-column align-items-center">
                          <span style="font-size:1.25rem; font-weight:700; color:#1f2937;">{{ supportClosed }}</span>
                          <div style="width:48px; height:4px; background:#d1e7dd; border-radius:2px; margin:4px 0;"></div>
                          <div class="dash-legend-item"><span class="dash-dot" style="background:#0f696e;"></span>Closed</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>

            </div>
            <!-- end 6-card analytics grid -->

            <!-- ===== MITIGATION STRATEGY SECTION ===== -->
            <section>
              <h5 class="fw-bold mb-4" style="color:#1e293b; font-size:1.15rem;">Mitigation Strategy</h5>
              <div class="dash-card p-0 overflow-hidden">

                <!-- Tab Navigation -->
                <div class="d-flex" style="border-bottom: 1px solid #f1f5f9; overflow-x:auto;">
                  <button
                    v-for="tab in mitigationTabs"
                    :key="tab.key"
                    class="dash-tab-btn"
                    :class="{ 'dash-tab-active': mitigationActiveTab === tab.key }"
                    @click="setMitigationTab(tab.key)"
                  >{{ tab.label }}</button>
                </div>

                <div class="p-4">
                  <!-- Team label -->
                  <p class="ms-team-label mb-3">Assigned to <strong>{{ mitigationActiveTab }}</strong> team</p>

                  <!-- Risk Criteria — stacked vertically -->
                  <div class="ms-risk-stack mb-4">

                    <div class="ms-risk-row ms-risk-critical">
                      <div class="ms-risk-left">
                        <span class="ms-risk-dot" style="background:#9b1c1c;"></span>
                        <span class="ms-risk-name" style="color:#9b1c1c;">Critical</span>
                      </div>
                      <div class="ms-risk-right">
                        <span class="ms-risk-value">{{ riskCriteria.critical ?? '—' }}</span>
                        <button class="ms-risk-add" @click.stop="openModal('critical')" title="Update">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </div>
                    </div>

                    <div class="ms-risk-row ms-risk-high">
                      <div class="ms-risk-left">
                        <span class="ms-risk-dot" style="background:#c2410c;"></span>
                        <span class="ms-risk-name" style="color:#c2410c;">High</span>
                      </div>
                      <div class="ms-risk-right">
                        <span class="ms-risk-value">{{ riskCriteria.high ?? '—' }}</span>
                        <button class="ms-risk-add" @click.stop="openModal('high')" title="Update">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </div>
                    </div>

                    <div class="ms-risk-row ms-risk-medium">
                      <div class="ms-risk-left">
                        <span class="ms-risk-dot" style="background:#a16207;"></span>
                        <span class="ms-risk-name" style="color:#a16207;">Medium</span>
                      </div>
                      <div class="ms-risk-right">
                        <span class="ms-risk-value">{{ riskCriteria.medium ?? '—' }}</span>
                        <button class="ms-risk-add" @click.stop="openModal('medium')" title="Update">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </div>
                    </div>

                    <div class="ms-risk-row ms-risk-low">
                      <div class="ms-risk-left">
                        <span class="ms-risk-dot" style="background:#15803d;"></span>
                        <span class="ms-risk-name" style="color:#15803d;">Low</span>
                      </div>
                      <div class="ms-risk-right">
                        <span class="ms-risk-value">{{ riskCriteria.low ?? '—' }}</span>
                        <button class="ms-risk-add" @click.stop="openModal('low')" title="Update">
                          <i class="bi bi-pencil-square"></i>
                        </button>
                      </div>
                    </div>

                  </div>

                  <!-- Vulnerabilities header -->
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <p class="mb-0 fw-semibold" style="font-size:14px;">Vulnerabilities ({{ uniqueMitigationVulns.length }})</p>
                    <router-link :to="{ path: '/missingsecurityupdates', query: { team: mitigationActiveTab } }">
                      <button class="btn border-0" style="color:#0f696e; font-weight:600; font-size:14px;">More details <i class="bi bi-arrow-right"></i></button>
                    </router-link>
                  </div>

                  <!-- Vulnerability cards grid -->
                  <div v-if="mitigationLoading" class="py-3 text-center text-muted">Loading...</div>
                  <div v-else-if="uniqueMitigationVulns.length === 0" class="py-3 text-muted small">No vulnerabilities assigned to this team.</div>
                  <div v-else class="row g-3">
                    <div
                      v-for="vuln in uniqueMitigationVulns.slice(0, 4)"
                      :key="vuln.plugin_name"
                      class="col-3"
                    >
                      <div class="dash-vuln-card">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                          <div class="dash-icon-wrap">
                            <i class="bi bi-hdd-network dash-icon-teal" style="font-size:14px;"></i>
                          </div>
                          <span :style="{ color: getMitigationRiskColor(vuln.risk_factor), fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }">{{ vuln.risk_factor }}</span>
                        </div>
                        <h6 class="truncated-text fw-bold mb-2" style="font-size:13px; color:#1f2937; line-height:1.4;" :title="vuln.plugin_name">{{ vuln.plugin_name }}</h6>
                        <div class="d-flex align-items-center gap-1 mb-4">
                          <i class="bi bi-hdd-network" style="font-size:12px; color:#94a3b8;"></i>
                          <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">{{ vulnAssetCountMap[vuln.plugin_name] ?? 1 }} assets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

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
      supportPending: 0,
      supportClosed: 0,
      vulFixedTotal: 0,
      vulFixedCritical: 0,
      vulFixedHigh: 0,
      vulFixedMedium: 0,
      vulFixedLow: 0,
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
    fixedBars() {
      return [
        { h: 20, op: 0.3 },
        { h: 30, op: 0.4 },
        { h: 70, op: 0.8 },
        { h: 25, op: 0.3 },
        { h: 45, op: 0.5 },
        { h: 75, op: 0.8 },
        { h: 25, op: 0.3 },
      ];
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
    mitigationPct(sev) {
      const remaining = this.authStore.mitigationTimeline?.[sev]?.days;
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
    async loadMitigationTimeline() {
      const res = await this.authStore.fetchMitigationTimeline(this.reportId);
      if (res.status) {
        this.mitigationTimeline = res.data;
      }
    },

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
        return;
      }

      const cachedReportId = localStorage.getItem("reportId");
      if (cachedReportId) {
        console.log("✅ Report already confirmed from localStorage:", cachedReportId);
        this.hasReport = true;
        this.currentReportId = cachedReportId;
        this.reportStatusChecking = false;
        this.removeReportStatusOverlay();
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
  },
};
</script>

<style scoped>
/* ===== DASHBOARD REDESIGN ===== */
.dash-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  padding: 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s;
}
.dash-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.dash-icon-wrap {
  width: 32px;
  height: 32px;
  background: #e0f2f1;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.dash-icon-teal { color: #0f696e; }
.dash-info-icon { color: #cbd5e1; font-size: 12px; }
.dash-card-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}
.dash-big-num {
  font-size: 3rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
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
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
</style>
