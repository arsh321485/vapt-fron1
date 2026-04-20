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
              <router-link to="/userdashboard" class="msu-back-link">
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
                  <i class="bi bi-shield-check me-2"></i>No vulnerabilities found.
                </div>

                <!-- Grouped vulnerability tables -->
                <div v-for="group in groupedVulns" :key="group.name" class="msu-group mb-4">
                  <div class="msu-group-header">
                    <h6 class="msu-group-title">{{ group.name }}</h6>
                    <span class="msu-group-count">
                      {{ group.rows.length }} {{ group.rows.length === 1 ? 'asset' : 'assets' }}
                    </span>
                  </div>

                  <div class="msu-table-wrap">
                    <table class="msu-table">
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
                            <span class="msu-vuln-name" :title="vuln.plugin_name">{{ vuln.plugin_name }}</span>
                          </td>
                          <td>
                            <span class="msu-asset-chip">{{ vuln.host_name }}</span>
                          </td>
                          <td>
                            <span class="msu-os-text" :title="vuln.os">{{ vuln.os || '—' }}</span>
                          </td>
                          <td>
                            <span class="msu-sev-badge" :class="'msu-sev-' + (vuln.risk_factor || '').toLowerCase()">
                              <span class="msu-sev-dot"></span>
                              {{ vuln.risk_factor }}
                            </span>
                          </td>
                          <td>
                            <span class="msu-status-badge"
                              :class="(vuln.status?.toLowerCase() === 'open') ? 'msu-status-open' : 'msu-status-closed'">
                              <span class="msu-status-dot"></span>
                              <span class="text-capitalize">{{ vuln.status }}</span>
                            </span>
                          </td>
                          <td>
                            <router-link :to="{
                              name: 'user-remediation-timeline',
                              params: { reportId: reportId, asset: vuln.host_name },
                              query: { plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor }
                            }">
                              <button class="msu-view-btn">
                                View <i class="bi bi-arrow-right-circle-fill ms-1"></i>
                              </button>
                            </router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </template>
            </div>

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
  name: 'UserMissingSecurityUpdatesView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      loading: false,
      mitigationData: null,
      reportId: null,
    };
  },
  computed: {
    activeTeamKey() {
      return this.$route.query.team || '';
    },
    activeVulns() {
      if (!this.mitigationData?.teams) return [];
      const team = this.activeTeamKey;
      if (!team || team === 'both') {
        return Object.values(this.mitigationData.teams).flatMap(t => t.vulnerabilities || []);
      }
      return this.mitigationData.teams[team]?.vulnerabilities || [];
    },
    groupedVulns() {
      const map = new Map();
      for (const vuln of this.activeVulns) {
        const key = (vuln.plugin_name || '').trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(vuln);
      }
      return Array.from(map.entries()).map(([name, rows]) => ({ name, rows }));
    },
  },
  methods: {
    async loadData() {
      const store = useAuthStore();
      this.loading = true;
      const result = await store.fetchUserMitigationByTeam();
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
  background: #f8f9fc;
  min-height: 100vh;
}

/* Page Header */
.msu-page-header {
  padding: 70px 40px 20px;
  background: #f8f9fc;
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
.msu-back-link:hover { opacity: 0.75; color: #0f696e; }

.msu-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #241447;
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

/* Inner content */
.msu-inner {
  padding: 8px 40px 40px;
}

.msu-empty {
  background: white;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.9rem;
  border: 1px solid #f1f5f9;
}

/* Group */
.msu-group-header {
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

/* Table */
.msu-table-wrap {
  background: white;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
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
  padding: 12px 16px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border-bottom: 1px solid #f1f5f9;
  white-space: nowrap;
}

.msu-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f8f9fc;
  vertical-align: middle;
}

.msu-table tbody tr:last-child td {
  border-bottom: none;
}

.msu-table tbody tr:hover {
  background: #fafbfc;
}

/* Cell content */
.msu-vuln-name {
  font-weight: 600;
  color: #241447;
  display: block;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msu-asset-chip {
  background: #edeef1;
  color: #1e293b;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 6px;
}

.msu-os-text {
  color: #64748b;
  font-size: 0.82rem;
  display: block;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Severity badge */
.msu-sev-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.msu-sev-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.msu-sev-critical { background: #fef2f2; color: #9b1c1c; }
.msu-sev-critical .msu-sev-dot { background: #9b1c1c; }
.msu-sev-high { background: #fff7ed; color: #c2410c; }
.msu-sev-high .msu-sev-dot { background: #c2410c; }
.msu-sev-medium { background: #fefce8; color: #a16207; }
.msu-sev-medium .msu-sev-dot { background: #a16207; }
.msu-sev-low { background: #f0fdf4; color: #15803d; }
.msu-sev-low .msu-sev-dot { background: #15803d; }

/* Status badge */
.msu-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
}
.msu-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}
.msu-status-open { background: #fef2f2; color: #ba1a1a; }
.msu-status-open .msu-status-dot { background: #ba1a1a; }
.msu-status-closed { background: #f0fdf4; color: #15803d; }
.msu-status-closed .msu-status-dot { background: #15803d; }

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
  background: rgba(15, 105, 110, 0.07);
  border-color: #0f696e;
}
</style>
