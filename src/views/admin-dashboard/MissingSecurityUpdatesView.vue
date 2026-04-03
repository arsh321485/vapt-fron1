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

          <div class="col-11 msu-content">

            <!-- Page Header -->
            <div class="msu-page-header">
              <router-link to="/admindashboardonboarding" class="msu-back-link">
                <i class="bi bi-arrow-left me-1"></i>Back
              </router-link>
              <div class="d-flex align-items-baseline gap-3 mt-2">
                <h2 class="msu-title">Missing Security Updates</h2>
                <span v-if="activeTeamKey" class="msu-team-badge">{{ activeTeamKey }}</span>
              </div>
              <p class="msu-subtitle">Vulnerability patch status by asset group</p>
            </div>

            <!-- Content -->
            <div class="msu-inner">
              <div v-if="loading" class="py-5 text-center text-muted">Loading...</div>
              <template v-else>
                <div v-if="groupedVulns.length === 0" class="msu-empty">
                  <i class="bi bi-shield-check me-2"></i>No vulnerabilities found for this team.
                </div>

                <!-- Accordion Groups -->
                <div v-for="(group, gIdx) in groupedVulns" :key="group.name" class="msu-accordion-card mb-3">

                  <!-- Accordion Header -->
                  <div class="msu-accordion-header" @click="toggleGroup(gIdx)">
                    <div class="d-flex align-items-center gap-3">
                      <span class="msu-severity-bar" :class="getSeverityBarClass(group)"></span>
                      <div>
                        <h6 class="msu-accordion-title mb-0">{{ group.name }}</h6>
                        <p class="msu-accordion-sub mb-0">Vulnerability ID: {{ group.vulnId || 'VAPT-' + (2024 + gIdx) + '-' + String(gIdx + 800).padStart(4,'0') }}</p>
                      </div>
                    </div>
                    <i class="bi" :class="openGroups.includes(gIdx) ? 'bi-chevron-up' : 'bi-chevron-down'" style="color:#64748b;"></i>
                  </div>

                  <!-- Accordion Body -->
                  <div v-if="openGroups.includes(gIdx)" class="msu-accordion-body">
                    <table class="msu-table">
                      <thead>
                        <tr>
                          <th>Asset (IP)</th>
                          <th>OS</th>
                          <th>Severity</th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="vuln in group.rows" :key="vuln.id">
                          <td class="msu-td-asset">{{ vuln.host_name }}</td>
                          <td class="msu-td-os">{{ vuln.os || '—' }}</td>
                          <td>
                            <span class="msu-sev-chip" :class="'msu-sev-' + (vuln.risk_factor || '').toLowerCase()">
                              {{ (vuln.risk_factor || '').toUpperCase() }}
                            </span>
                          </td>
                          <td>
                            <div class="d-flex align-items-center gap-2">
                              <span class="msu-status-dot-inline" :class="getStatusDotClass(vuln.status)"></span>
                              <span class="msu-status-text" :class="getStatusTextClass(vuln.status)">
                                {{ vuln.status }}
                              </span>
                            </div>
                          </td>
                          <td>
                            <router-link :to="{
                              name: 'VulFix',
                              params: { reportId: reportId, asset: vuln.host_name },
                              query: { id: vuln.id, plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor }
                            }" class="text-decoration-none">
                              <button class="msu-view-btn">View <i class="bi bi-arrow-right-circle-fill ms-1"></i></button>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              </template>
            </div>

            <!-- Footer Actions -->
            <div class="msu-footer">
              <button class="msu-export-btn" @click="exportPDF">
                <i class="bi bi-download me-2"></i>Export PDF
              </button>
              <button class="msu-apply-btn">
                Apply Fixes
              </button>
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
  name: "MissingSecurityUpdatesView",
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      loading: false,
      mitigationData: null,
      reportId: null,
      openGroups: [0], // first group open by default
    };
  },
  computed: {
    activeTeamKey() {
      return this.$route.query.team || "Patch Management";
    },
    activeVulns() {
      if (!this.mitigationData?.teams) return [];
      return this.mitigationData.teams[this.activeTeamKey]?.vulnerabilities || [];
    },
    groupedVulns() {
      const map = new Map();
      for (const vuln of this.activeVulns) {
        const key = (vuln.plugin_name || '').trim();
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key).push(vuln);
      }
      return Array.from(map.entries()).map(([name, rows]) => ({ name, rows }));
    },
  },
  methods: {
    toggleGroup(idx) {
      if (this.openGroups.includes(idx)) {
        this.openGroups = this.openGroups.filter(i => i !== idx);
      } else {
        this.openGroups.push(idx);
      }
    },
    getSeverityBarClass(group) {
      const sevs = group.rows.map(r => (r.risk_factor || '').toLowerCase());
      if (sevs.includes('critical')) return 'bar-critical';
      if (sevs.includes('high')) return 'bar-high';
      if (sevs.includes('medium')) return 'bar-medium';
      return 'bar-low';
    },

    getStatusDotClass(status) {
      const s = (status || '').toLowerCase();
      if (s === 'open') return 'dot-red';
      if (s === 'closed' || s === 'close') return 'dot-teal';
      return 'dot-grey';
    },
    getStatusTextClass(status) {
      const s = (status || '').toLowerCase();
      if (s === 'open') return 'text-unpatched';
      if (s === 'closed' || s === 'close') return 'text-patched';
      return 'text-inprogress';
    },
    exportPDF() {
      window.print();
    },
    async loadData() {
      const store = useAuthStore();
      this.loading = true;
      const result = await store.fetchMitigationByTeam(true);
      if (result.status) {
        this.mitigationData = result.data;
        this.reportId = result.data.report_id;
      }
      this.loading = false;
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>

<style scoped>
.msu-content {
  padding: 0;
  background: #f4f5f7;
  min-height: 100vh;
}

/* Page Header */
.msu-page-header {
  padding: 70px 40px 20px;
  background: #f4f5f7;
}

.msu-back-link {
  color: #0f696e;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.15s;
}
.msu-back-link:hover { opacity: 0.75; }

.msu-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.msu-team-badge {
  background: #f0ecff;
  color: #241447;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 50px;
}

.msu-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 4px 0 0;
}

/* Inner */
.msu-inner {
  padding: 8px 40px 100px;
}

.msu-empty {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
}

/* Accordion Card */
.msu-accordion-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
}

.msu-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.msu-accordion-header:hover {
  background: #fafbfc;
}

.msu-severity-bar {
  width: 4px;
  height: 40px;
  border-radius: 4px;
  flex-shrink: 0;
}
.bar-critical { background: #dc2626; }
.bar-high     { background: #f97316; }
.bar-medium   { background: #f59e0b; }
.bar-low      { background: #10b981; }

.msu-accordion-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.msu-accordion-sub {
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 2px;
}

/* Table */
.msu-accordion-body {
  border-top: 1px solid #f1f5f9;
  padding: 0;
}

.msu-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.855rem;
}

.msu-table thead {
  background: #f8f9fc;
}

.msu-table th {
  padding: 10px 24px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.msu-table td {
  padding: 14px 24px;
  border-bottom: 1px solid #f8f9fc;
  vertical-align: middle;
}

.msu-table tbody tr:last-child td {
  border-bottom: none;
}

.msu-table tbody tr:hover {
  background: #fafbfc;
}

.msu-td-asset {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.875rem;
}

.msu-td-os {
  color: #64748b;
  font-size: 0.82rem;
}

/* Severity chip */
.msu-sev-chip {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 6px;
  letter-spacing: 0.04em;
}
.msu-sev-critical { background: #fee2e2; color: #dc2626; }
.msu-sev-high     { background: #fff7ed; color: #f97316; }
.msu-sev-medium   { background: #fefce8; color: #ca8a04; }
.msu-sev-low      { background: #f0fdf4; color: #16a34a; }

/* Status */
.msu-status-dot-inline {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  display: inline-block;
}
.dot-red  { background: #dc2626; }
.dot-teal { background: #0f696e; }
.dot-grey { background: #64748b; }

.msu-status-text {
  font-size: 0.82rem;
  font-weight: 600;
}
.text-unpatched  { color: #dc2626; }
.text-patched    { color: #0f696e; }
.text-inprogress { color: #64748b; }

/* View button */
.msu-view-btn {
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
.msu-view-btn:hover {
  background: rgba(15,105,110,0.07);
  border-color: #0f696e;
}

/* Footer */
.msu-footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 8.333%; /* col-1 width */
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
  padding: 16px 40px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  z-index: 100;
  box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
}

.msu-export-btn {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 50px;
  padding: 10px 24px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1e293b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s;
}
.msu-export-btn:hover { background: #f8f9fc; }

.msu-apply-btn {
  background: #1e293b;
  border: none;
  border-radius: 50px;
  padding: 10px 28px;
  font-size: 0.875rem;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s;
}
.msu-apply-btn:hover { background: #0f172a; }
</style>
