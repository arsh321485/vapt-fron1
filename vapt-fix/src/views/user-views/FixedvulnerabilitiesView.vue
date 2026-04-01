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

          <div class="col-11 pt-5 mt-4 pb-3 px-4 pe-5">
            <div class="d-flex justify-content-between">
              <div>
                <router-link to="/userdashboard" style="color: rgba(49, 33, 177, 1);text-decoration: none;">
                  <i class="bi bi-arrow-left"></i> Back to home
                </router-link>
                <h2 class="ticket-head mt-3">Fixed vulnerabilities</h2>
              </div>
            </div>

            <!-- Severity filters -->
            <div class="row mt-4">
              <div class="d-flex gap-3 flex-wrap align-items-center">
                <button class="btn btn-pill fw-semibold text-dark"
                  :class="activeFilters.includes('All') ? 'active-tab' : 'btn-outline-secondary'"
                  @click="setFilter('All')">All</button>

                <button class="btn btn-pill fw-semibold"
                  :class="activeFilters.includes('Critical') ? 'active-tab-critical' : 'btn-outline-secondary'"
                  style="color: #730000;" @click="setFilter('Critical')">Critical</button>

                <button class="btn btn-pill fw-semibold"
                  :class="activeFilters.includes('High') ? 'active-tab-high' : 'btn-outline-secondary'"
                  style="color: #AD0000;" @click="setFilter('High')">High</button>

                <button class="btn btn-pill fw-semibold"
                  :class="activeFilters.includes('Medium') ? 'active-tab-medium' : 'btn-outline-secondary'"
                  style="color: #825B00;" @click="setFilter('Medium')">Medium</button>

                <button class="btn btn-pill fw-semibold"
                  :class="activeFilters.includes('Low') ? 'active-tab-low' : 'btn-outline-secondary'"
                  style="color: #006900;" @click="setFilter('Low')">Low</button>

                <!-- Active filter tags -->
                <div v-if="!activeFilters.includes('All')" class="d-flex gap-1 flex-wrap">
                  <span v-for="f in activeFilters" :key="f" class="filter-tag">
                    {{ f }} <i class="bi bi-x ms-1" style="cursor:pointer;" @click="setFilter(f)"></i>
                  </span>
                </div>
              </div>
            </div>

            <!-- Table -->
            <div class="row mt-5">
              <div class="table-responsive">
                <div v-if="loading" class="text-center py-5">
                  <span class="spinner-border text-primary"></span>
                </div>
                <table v-else class="table align-middle table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>S.NO.</th>
                      <th scope="col">Vul. name</th>
                      <th scope="col">Assets</th>
                      <th scope="col">OS</th>
                      <th scope="col">Severity</th>
                      <th scope="col">Assigned on</th>
                      <th scope="col">Fixed on</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody class="raised-tbody">
                    <tr v-if="filteredRows.length === 0">
                      <td colspan="8" class="text-center text-muted py-4">No fixed vulnerabilities found.</td>
                    </tr>
                    <tr v-for="(item, index) in filteredRows" :key="item.fix_vulnerability_id">
                      <td>{{ index + 1 }}</td>
                      <td class="text-truncate" style="max-width: 200px;" :title="item.plugin_name">{{ item.plugin_name }}</td>
                      <td>{{ item.host_name }}</td>
                      <td>{{ item.os || '-' }}</td>
                      <td :style="{ color: getSeverityColor(item.risk_factor) }">{{ item.risk_factor }}</td>
                      <td>{{ formatDate(item.created_at) }}</td>
                      <td>{{ formatDate(item.closed_at) }}</td>
                      <td>
                        <router-link
                          :to="{
                            name: 'UserVulFix',
                            params: { reportId: reportId, asset: item.host_name },
                            query: { plugin_name: item.plugin_name, risk_factor: item.risk_factor }
                          }"
                          class="btn fw-semibold border-0"
                          style="color: rgba(49, 33, 177, 1);"
                        >
                          View Now <i class="bi bi-arrow-right-circle-fill ms-2"></i>
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
  name: 'FixedvulnerabilitiesView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      loading: false,
      allRows: [],
      reportId: null,
      activeFilters: ['All'],
    };
  },
  computed: {
    filteredRows() {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      let rows = this.activeFilters.includes('All')
        ? [...this.allRows]
        : this.allRows.filter(item => this.activeFilters.includes(item.risk_factor));
      rows.sort((a, b) => {
        const ao = severityOrder[a.risk_factor?.toLowerCase()] ?? 99;
        const bo = severityOrder[b.risk_factor?.toLowerCase()] ?? 99;
        return ao - bo;
      });
      return rows;
    },
  },
  methods: {
    setFilter(type) {
      if (type === 'All') {
        this.activeFilters = ['All'];
        return;
      }
      const filters = this.activeFilters.filter(f => f !== 'All');
      const idx = filters.indexOf(type);
      if (idx === -1) {
        filters.push(type);
      } else {
        filters.splice(idx, 1);
      }
      this.activeFilters = filters.length === 0 ? ['All'] : filters;
    },
    getSeverityColor(sev) {
      switch (sev?.toLowerCase()) {
        case 'critical': return 'maroon';
        case 'high': return '#AD0000';
        case 'medium': return '#825B00';
        case 'low': return '#006900';
        default: return 'inherit';
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return isNaN(d) ? dateStr : d.toLocaleDateString('en-GB');
    },
    async loadData() {
      const store = useAuthStore();
      this.loading = true;
      const result = await store.fetchUserClosedVulns();
      if (result.status) {
        this.allRows = result.data.closed_vulnerabilities || [];
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

.btn-pill {
  border-radius: 50px;
  padding: 6px 20px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  height: 36px;
}

.active-tab {
  background-color: #E6E3FF;
  color: #3121B1;
  border: none;
  font-size: 13px;
}

.active-tab-critical {
  background-color: #ffe5e5;
  color: maroon;
  border: none;
}

.active-tab-high {
  background-color: #ffd6d6;
  color: #AD0000;
  border: none;
}

.active-tab-medium {
  background-color: #fff3cd;
  color: #825B00;
  border: none;
}

.active-tab-low {
  background-color: #d4edda;
  color: #006900;
  border: none;
}

.filter-tag {
  background-color: #EAE8FF;
  color: #3121B1;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
}

.btn-outline-secondary:hover {
  background-color: transparent;
}
</style>
