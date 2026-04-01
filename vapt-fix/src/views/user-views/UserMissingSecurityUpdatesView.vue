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

          <div class="col-11 pt-5 mt-3 pb-3 pe-5">
            <div class="row">
              <div class="d-flex justify-content-between">
                <router-link to="/userdashboard">
                  <button class="my-4" style="color: rgba(49, 33, 177, 1);background-color: white;border: 0;">
                    <i class="bi bi-arrow-left"></i> Back
                  </button>
                </router-link>
              </div>
            </div>

            <div class="row">
              <h2 class="ticket-head">Missing security updates</h2>
              <div class="row mt-5">
                <div v-if="loading" class="py-4 text-center text-muted">Loading...</div>
                <template v-else>
                  <div v-if="groupedVulns.length === 0" class="py-4 text-center text-muted">
                    No vulnerabilities found.
                  </div>
                  <div v-for="group in groupedVulns" :key="group.name" class="mb-5">
                    <h6 class="fw-semibold mb-3">
                      {{ group.name }}
                      <span class="text-muted fw-normal ms-2" style="font-size:13px;">
                        ({{ group.rows.length }} {{ group.rows.length === 1 ? 'asset' : 'assets' }})
                      </span>
                    </h6>
                    <div class="table-responsive">
                      <table class="table table-hover align-middle">
                        <thead class="table-light">
                          <tr>
                            <th scope="col">Vul. name</th>
                            <th scope="col">Asset</th>
                            <th scope="col">OS</th>
                            <th scope="col">Severity</th>
                            <th scope="col">Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody class="raised-tbody">
                          <tr v-for="(vuln, index) in group.rows" :key="index">
                            <td class="text-truncate" style="max-width: 200px;" :title="vuln.plugin_name">
                              {{ vuln.plugin_name }}
                            </td>
                            <td>{{ vuln.host_name }}</td>
                            <td :title="vuln.os" class="text-truncate" style="max-width: 150px;">{{ vuln.os || '-' }}</td>
                            <td :style="{ color: getSeverityColor(vuln.risk_factor), fontWeight: 600 }">{{ vuln.risk_factor }}</td>
                            <td>
                              <span :style="getStatusStyle(vuln.status)" class="badge rounded-pill px-3 py-2 fw-semibold text-white">
                                {{ vuln.status }}
                              </span>
                            </td>
                            <td>
                              <router-link :to="{
                                name: 'UserVulFix',
                                params: { reportId: reportId, asset: vuln.host_name },
                                query: { plugin_name: vuln.plugin_name, risk_factor: vuln.risk_factor }
                              }">
                                <button class="btn fixes-btn border-0">
                                  View <i class="bi bi-arrow-right-circle-fill"></i>
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
    getSeverityColor(sev) {
      if (sev === 'Critical') return 'maroon';
      if (sev === 'High') return 'red';
      if (sev === 'Medium') return 'orange';
      return 'green';
    },
    getStatusStyle(status) {
      const s = status?.toLowerCase();
      if (s === 'closed' || s === 'close') return { backgroundColor: '#28a745' };
      if (s === 'open') return { backgroundColor: 'rgb(194, 60, 60)' };
      return {};
    },
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
.ticket-head {
  color: rgba(0, 0, 0, 1);
  font-weight: 500;
  font-size: 36px;
}
.raised-tbody tr td {
  color: rgba(0, 0, 0, 1);
  font-weight: 500;
}
.fixes-btn {
  color: rgba(49, 33, 177, 1);
  font-weight: 600;
}
</style>
