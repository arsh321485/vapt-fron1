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

          <div class="col-11 pt-4 pb-4 pe-4 mitigation-shell">
            <div class="top-strip d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <h2 class="mb-1 fw-bold">Mitigation Strategy</h2>
                <p class="subtext mb-0">Operational overview for remediation workflow and team ownership.</p>
              </div>
              <button class="btn view-report-btn fw-semibold px-3 py-2" @click="$router.push('/viewreport')">
                <i class="bi bi-eye me-2"></i>View Report
              </button>
            </div>

            <div class="hero-grid mb-4">
              <div class="hero-focus-card">
                <p class="hero-label mb-2">Active Exposure</p>
                <div class="d-flex align-items-end gap-3">
                  <h3 class="hero-count mb-0">{{ uniqueVulns.length }}</h3>
                  <span class="hero-trend"><i class="bi bi-arrow-up-short"></i> Mitigation Queue</span>
                </div>
                <p class="hero-note mb-0">Unique vulnerabilities currently mapped to mitigation teams.</p>
              </div>
              <div class="hero-mini-card">
                <p class="mini-label mb-2">Assigned Team</p>
                <h4 class="mini-value mb-1">{{ activeTab }}</h4>
                <p class="mini-note mb-0">Current response owner</p>
              </div>
              <div class="hero-mini-card hero-mini-card-dark">
                <p class="mini-label mb-2">Primary Action</p>
                <h4 class="mini-value mb-1">Patch & Prioritize</h4>
                <p class="mini-note mb-0">Focus on critical and high first</p>
              </div>
            </div>

            <div class="team-tabs mb-4">
              <button
                v-for="(tab, idx) in tabs"
                :key="tab.key"
                class="team-tab-pill"
                :class="{ active: activeTab === tab.key }"
                @click="setActiveTab(tab.key, idx)"
              >
                <i :class="tab.icon"></i> {{ tab.label }}
              </button>
            </div>

            <div class="criteria-panel mb-4">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                <h5 class="mb-0">Risk Criteria Timelines</h5>
                <span class="criteria-team">Assigned to {{ activeTab }} team</span>
              </div>

              <div class="criteria-grid">
                <div class="criteria-card critical">
                  <span class="severity">Critical</span>
                  <button type="button" class="btn timeline-btn">
                    {{ riskCriteria.critical ?? "—" }}
                    <i class="bi bi-plus-circle text-danger ms-2" @click="openRiskModal('critical')"></i>
                  </button>
                </div>
                <div class="criteria-card high">
                  <span class="severity">High</span>
                  <button type="button" class="btn timeline-btn">
                    {{ riskCriteria.high ?? "—" }}
                    <i class="bi bi-plus-circle text-danger ms-2" @click="openRiskModal('high')"></i>
                  </button>
                </div>
                <div class="criteria-card medium">
                  <span class="severity">Medium</span>
                  <button type="button" class="btn timeline-btn">
                    {{ riskCriteria.medium ?? "—" }}
                    <i class="bi bi-plus-circle text-danger ms-2" @click="openRiskModal('medium')"></i>
                  </button>
                </div>
                <div class="criteria-card low">
                  <span class="severity">Low</span>
                  <button type="button" class="btn timeline-btn">
                    {{ riskCriteria.low ?? "—" }}
                    <i class="bi bi-plus-circle text-danger ms-2" @click="openRiskModal('low')"></i>
                  </button>
                </div>
              </div>
            </div>

            <div class="findings-panel">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">Vulnerabilities ({{ uniqueVulns.length }})</h5>
                <router-link :to="{ path: '/missingsecurityupdates', query: { team: activeTab } }" class="details-link">
                  View Details <i class="bi bi-arrow-right"></i>
                </router-link>
              </div>

              <div v-if="loading" class="py-4 text-center text-muted">Loading...</div>
              <div v-else-if="uniqueVulns.length === 0" class="py-4 text-muted">No vulnerabilities assigned to this team.</div>

              <div v-else class="table-responsive">
                <table class="table findings-table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Vulnerability</th>
                      <th>Assets</th>
                      <th>Severity</th>
                      <th class="text-end">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="vuln in uniqueVulns.slice(0, 8)" :key="vuln.plugin_name">
                      <td>
                        <p class="mb-0 vuln-name" :title="vuln.plugin_name">{{ vuln.plugin_name }}</p>
                      </td>
                      <td>
                        <span class="asset-chip">
                          <i class="bi bi-hdd-network me-1"></i>
                          {{ vuln.assets.length }} asset{{ vuln.assets.length !== 1 ? "s" : "" }}
                        </span>
                      </td>
                      <td>
                        <span class="severity-chip" :style="{ color: riskColor(vuln.risk_factor) }">
                          {{ vuln.risk_factor }}
                        </span>
                      </td>
                      <td class="text-end">
                        <router-link :to="{ path: '/missingsecurityupdates', query: { team: activeTab } }" class="row-action">
                          Open
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="showPopup" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center report-backdrop">
              <div class="bg-white p-4 rounded shadow report-box">
                <button @click="showPopup = false" class="btn-close position-absolute top-0 end-0 m-3" aria-label="Close"></button>
                <h2 class="mb-2 text-center">Report</h2>
                <p class="mb-2 text-center report-sub">Create a report</p>
                <div class="d-flex justify-content-between">
                  <div class="dropdown">
                    <div class="dropdown-btn">Select location</div>
                    <div class="dropdown-content">
                      <a href="#">Greece</a>
                      <a href="#">Germany</a>
                      <a href="#">Bahrain</a>
                    </div>
                  </div>
                  <button type="button" class="btn timeline-btn rounded-pill text-nowrap ms-3 mb-3">
                    June 1 - June 30 <i class="bi bi-calendar-minus ms-2"></i>
                  </button>
                </div>
                <div class="accordion" id="globalReportAccordion">
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="headingOne">
                      <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        Software vulnerabilities(11) <span class="text-primary ms-2">4 selected</span>
                      </button>
                    </h2>
                    <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#globalReportAccordion">
                      <div class="accordion-body">Software vulnerabilities</div>
                    </div>
                  </div>
                </div>
                <button class="btn download-btn btn-sm ms-3 mt-4"><i class="bi bi-download me-2"></i>Download report</button>
              </div>
            </div>

            <div v-if="showRiskModal" class="risk-modal-backdrop">
              <div class="risk-modal-box" @click.stop>
                <h5 class="mb-3">Update Days - {{ riskModalSeverityLabel }}</h5>
                <div class="mb-3">
                  <label class="form-label">Days</label>
                  <select class="form-select" style="border-radius: 10px;" v-model="riskModalDays">
                    <option value="" disabled>Select timeline</option>
                    <option v-for="opt in timeOptions" :key="opt" :value="opt">{{ opt }}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Reason</label>
                  <textarea class="form-control" style="border-radius: 10px;" rows="2" v-model="riskModalReason"></textarea>
                </div>
                <div class="d-flex justify-content-end gap-2">
                  <button class="btn btn-secondary" @click="closeRiskModal">Cancel</button>
                  <button class="btn btn-primary" :disabled="riskUpdating" @click="submitRiskCriteria">
                    {{ riskUpdating ? "Saving..." : "Submit" }}
                  </button>
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
  name: "MitigationStrategyView",
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      showPopup: false,
      loading: false,
      mitigationData: null,
      teamsData: null,
      activeTab: "Patch Management",
      activeTabIndex: 0,
      riskCriteria: { critical: null, high: null, medium: null, low: null },
      showRiskModal: false,
      riskUpdating: false,
      riskModalSeverity: null,
      riskModalDays: null,
      riskModalReason: "",
      timeOptions: [
        "1 Day", "2 Days", "3 Days", "4 Days", "5 Days",
        "6 Days", "1 Week", "2 Weeks", "3 Weeks", "4 Weeks", "5 Weeks",
      ],
      tabs: [
        { key: "Patch Management", label: "Patch management", icon: "bi bi-shield-lock" },
        { key: "Configuration Management", label: "Configuration management", icon: "bi bi-wrench" },
        { key: "Network Security", label: "Network security", icon: "bi bi-reception-4" },
        { key: "Architectural Flaws", label: "Architectural flaws", icon: "bi bi-compass" },
      ],
    };
  },

  computed: {
    riskModalSeverityLabel() {
      const map = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
      return this.riskModalSeverity ? map[this.riskModalSeverity] : '';
    },
    activeTeamData() {
      if (!this.teamsData) return { vulnerabilities: [] };
      const teamObj = this.teamsData[this.activeTab];
      if (teamObj && Array.isArray(teamObj.vulnerabilities)) return teamObj;
      return { vulnerabilities: [] };
    },
    uniqueVulns() {
      const seen = new Map();
      for (const vuln of this.activeTeamData.vulnerabilities) {
        const key = (vuln.plugin_name || '').trim().toLowerCase();
        if (!seen.has(key)) {
          // vuln-asset-count returns assets array; by-team returns host_name per row
          const assets = Array.isArray(vuln.assets) ? vuln.assets
            : vuln.host_name ? [vuln.host_name] : [];
          seen.set(key, { ...vuln, assets });
        } else {
          if (vuln.host_name) seen.get(key).assets.push(vuln.host_name);
        }
      }
      return Array.from(seen.values());
    },
  },

  methods: {
    setActiveTab(key, index) {
      this.activeTab = key;
      this.activeTabIndex = index;
    },

    riskColor(risk) {
      const map = {
        Critical: "#b31c1c",
        High: "#f44336",
        Medium: "#f6b100",
        Low: "#4caf50",
      };
      return map[risk] || "#666";
    },


    async openRiskModal(severity) {
      await this.loadRiskCriteria();
      this.riskModalSeverity = severity;
      this.riskModalDays = this.riskCriteria[severity] ?? null;
      this.riskModalReason = "";
      this.showRiskModal = true;
    },

    closeRiskModal() {
      this.showRiskModal = false;
      this.riskModalSeverity = null;
      this.riskModalDays = null;
      this.riskModalReason = "";
    },

    async submitRiskCriteria() {
      if (!this.riskModalDays) {
        alert("Please enter a value");
        return;
      }
      const store = useAuthStore();
      const updated = {
        critical: String(this.riskCriteria.critical ?? ''),
        high: String(this.riskCriteria.high ?? ''),
        medium: String(this.riskCriteria.medium ?? ''),
        low: String(this.riskCriteria.low ?? ''),
        [this.riskModalSeverity]: String(this.riskModalDays),
      };
      this.riskUpdating = true;
      const hasExisting = !!(localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId"));
      let result;
      if (hasExisting) {
        result = await store.updateRiskCriteria(updated);
        if (result.status && result.data?.risk_criteria?._id) {
          localStorage.setItem("riskCriteriaId", result.data.risk_criteria._id);
          localStorage.setItem("riskId", result.data.risk_criteria._id);
        }
      } else {
        result = await store.addRiskCriteria(updated);
        if (result.status && result.data?._id) {
          localStorage.setItem("riskCriteriaId", result.data._id);
          localStorage.setItem("riskId", result.data._id);
        }
      }
      this.riskUpdating = false;
      if (result.status) {
        this.riskCriteria = { ...updated };
        this.closeRiskModal();
      } else {
        alert(result.message || "Failed to save risk criteria");
      }
    },

    async loadRiskCriteria() {
      const store = useAuthStore();
      // Try list API first (GET /api/admin/risk_criteria/risks/)
      const listResult = await store.fetchAdminRiskCriteria();
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
      let result = await store.getRiskCriteriaById();
      // Fallback: if no stored ID, fetch by admin (also stores the ID)
      if (!result.status) {
        result = await store.getRiskCriteriaByAdmin();
        if (result.status && result.data) {
          const d = result.data;
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
      if (result.data?.risk_criteria) {
        const d = result.data.risk_criteria;
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

    async loadMitigationData() {
      const store = useAuthStore();
      this.loading = true;

      // Try vuln-asset-count API first (returns { report_id, teams: {...} })
      let result = await store.fetchAdminMitigationVulnAssetCount();
      if (result.status && result.data) {
        const data = result.data;
        // vuln-asset-count wraps teams under a "teams" key
        this.teamsData = data.teams || data;
        this.mitigationData = data;
        this.loading = false;
        return;
      }

      // Fallback: by-team API (returns { "Team Name": {...} } directly)
      result = await store.fetchMitigationByTeam();
      if (result.status && result.data) {
        const data = result.data;
        this.teamsData = data.teams || data;
        this.mitigationData = data;
      }
      this.loading = false;
    },
  },

  async mounted() {
    await Promise.all([this.loadMitigationData(), this.loadRiskCriteria()]);

    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
      const btn = dropdown.querySelector('.dropdown-btn');
      const options = dropdown.querySelectorAll('.dropdown-content a');

      btn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
      });

      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          btn.textContent = option.textContent;
          dropdown.classList.remove('show');
        });
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });
    }
  },

  watch: {
    showPopup(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          const dropdown = this.$el.querySelector('.dropdown');
          const btn = dropdown.querySelector('.dropdown-btn');
          const options = dropdown.querySelectorAll('.dropdown-content a');

          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
          });

          options.forEach(option => {
            option.addEventListener('click', (e) => {
              e.preventDefault();
              btn.textContent = option.textContent;
              dropdown.classList.remove('show');
            });
          });

          document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
              dropdown.classList.remove('show');
            }
          }, { once: true });
        });
      }
    },
  },
};
</script>


<style scoped>
.mitigation-shell {
  background: #f8f9fc;
  min-height: calc(100vh - 64px);
}

.top-strip h2 {
  color: #241447;
}

.subtext {
  color: rgba(0, 0, 0, 0.6);
  font-size: 13px;
}

.view-report-btn {
  border-radius: 999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  color: #241447;
  background: #fff;
}

.hero-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
}

.hero-focus-card,
.hero-mini-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.hero-focus-card {
  background: linear-gradient(145deg, #f2f3f6, #ffffff);
}

.hero-mini-card-dark {
  background: #241447;
  color: #fff;
}

.hero-label,
.mini-label {
  color: rgba(0, 0, 0, 0.55);
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.hero-count {
  font-size: 52px;
  color: #241447;
  line-height: 1;
}

.hero-trend {
  color: #ba1a1a;
  font-size: 12px;
  font-weight: 700;
}

.hero-note,
.mini-note {
  color: rgba(0, 0, 0, 0.62);
  font-size: 13px;
}

.mini-value {
  color: inherit;
  font-size: 22px;
  font-weight: 700;
}

.team-tabs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  border-bottom: 1px solid #e1e2e5;
  padding-bottom: 12px;
}

.team-tab-pill {
  border: 1px solid #e1e2e5;
  background: #fff;
  color: #333;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
}

.team-tab-pill.active {
  background: #241447;
  color: #fff;
  border-color: #241447;
}

.criteria-panel,
.findings-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.criteria-team {
  color: rgba(0, 0, 0, 0.65);
  font-size: 13px;
}

.criteria-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.criteria-card {
  border: 1px solid #ececf0;
  border-radius: 12px;
  padding: 12px;
}

.severity {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 12px;
  font-weight: 700;
}

.critical .severity { color: #b31c1c; }
.high .severity { color: #f44336; }
.medium .severity { color: #d28a00; }
.low .severity { color: #2f9e44; }

.timeline-btn {
  border: 1px solid rgba(0, 0, 0, 0.12);
  width: 100%;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

.details-link,
.row-action {
  color: #241447;
  font-weight: 700;
  text-decoration: none;
}

.findings-table thead th {
  color: rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.08em;
  border-bottom: 1px solid #ececf0;
}

.findings-table tbody td {
  border-color: #f1f1f4;
}

.vuln-name {
  font-weight: 600;
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.asset-chip {
  background: #f2f3f6;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
}

.severity-chip {
  font-size: 12px;
  font-weight: 700;
}

.report-backdrop {
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1050;
}

.report-box {
  width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.report-sub {
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  font-size: 13px;
}

.download-btn {
  font-weight: 600;
  font-size: 12px;
  padding: 8px 15px;
  color: #fff;
  background-color: rgba(49, 33, 177, 1);
  border-radius: 30px;
  border: 1px solid rgba(0, 0, 0, 0.12);
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
  padding: 8px 40px 8px 16px;
  cursor: pointer;
  position: relative;
}

.dropdown-btn::after {
  content: "▼";
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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

.risk-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.risk-modal-box {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 350px;
}

@media (max-width: 1200px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .criteria-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
