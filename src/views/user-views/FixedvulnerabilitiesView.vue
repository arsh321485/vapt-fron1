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

          <div class="col-11 fv-content">
            <div class="fv-page-header">
              <div>
                <router-link to="/userdashboard" class="fv-back-link">
                  <i class="bi bi-arrow-left"></i> Back to home
                </router-link>
                <h2 class="fv-title">Fixed Vulnerabilities</h2>
                <p class="fv-subtitle">Resolved issues with support-request style dashboard visual.</p>
              </div>
            </div>

            <div class="fv-filter-bar">
              <div class="d-flex gap-2 flex-wrap align-items-center">
                <button
                  class="fv-tab-btn"
                  :class="activeFilters.includes('All') ? 'fv-tab-active' : ''"
                  @click="setFilter('All')"
                >
                  All
                </button>
                <button
                  class="fv-tab-btn fv-tab-critical"
                  :class="activeFilters.includes('Critical') ? 'fv-tab-active-critical' : ''"
                  @click="setFilter('Critical')"
                >
                  Critical
                </button>
                <button
                  class="fv-tab-btn fv-tab-high"
                  :class="activeFilters.includes('High') ? 'fv-tab-active-high' : ''"
                  @click="setFilter('High')"
                >
                  High
                </button>
                <button
                  class="fv-tab-btn fv-tab-medium"
                  :class="activeFilters.includes('Medium') ? 'fv-tab-active-medium' : ''"
                  @click="setFilter('Medium')"
                >
                  Medium
                </button>
                <button
                  class="fv-tab-btn fv-tab-low"
                  :class="activeFilters.includes('Low') ? 'fv-tab-active-low' : ''"
                  @click="setFilter('Low')"
                >
                  Low
                </button>
                <div v-if="!activeFilters.includes('All')" class="d-flex gap-1 flex-wrap">
                  <span v-for="f in activeFilters" :key="f" class="fv-filter-tag">
                    {{ f }} <i class="bi bi-x ms-1 fv-tag-close" @click="setFilter(f)"></i>
                  </span>
                </div>
              </div>
              <span class="fv-count-badge">{{ filteredRows.length }} fixed</span>
            </div>

            <div class="fv-table-card">
              <div class="table-responsive">
                <div v-if="loading" class="text-center py-5">
                  <span class="spinner-border text-primary"></span>
                </div>
                <table v-else class="fv-table">
                  <thead>
                    <tr>
                      <th class="fv-th">S.No.</th>
                      <th class="fv-th">Vulnerability</th>
                      <th class="fv-th">Asset</th>
                      <th class="fv-th">OS</th>
                      <th class="fv-th">Severity</th>
                      <th class="fv-th">Assigned On</th>
                      <th class="fv-th">Fixed On</th>
                      <th class="fv-th"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="filteredRows.length === 0">
                      <td colspan="8" class="fv-empty-row">
                        <i class="bi bi-inbox fv-empty-icon"></i>
                        <p class="mb-0">No fixed vulnerabilities found.</p>
                      </td>
                    </tr>
                    <tr v-for="(item, index) in filteredRows" :key="item.fix_vulnerability_id" class="fv-tr">
                      <td class="fv-td fv-td-num">{{ index + 1 }}</td>
                      <td class="fv-td" :title="item.plugin_name">
                        <span class="fv-vuln-name text-truncate d-block">{{ item.plugin_name }}</span>
                      </td>
                      <td class="fv-td">
                        <span class="fv-asset-chip">{{ item.host_name }}</span>
                      </td>
                      <td class="fv-td">{{ item.os || '-' }}</td>
                      <td class="fv-td">
                        <span class="fv-sev-badge" :class="getSeverityClass(item.risk_factor)">
                          {{ item.risk_factor || '-' }}
                        </span>
                      </td>
                      <td class="fv-td fv-td-date">{{ formatDate(item.created_at) }}</td>
                      <td class="fv-td fv-td-date">{{ formatDate(item.closed_at) }}</td>
                      <td class="fv-td">
                        <router-link
                          :to="{
                            name: 'UserVulFix',
                            params: { reportId: reportId, asset: item.host_name },
                            query: { plugin_name: item.plugin_name, risk_factor: item.risk_factor }
                          }"
                          class="fv-view-link"
                        >
                          View now <i class="bi bi-arrow-right-circle-fill ms-1"></i>
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
    getSeverityClass(sev) {
      switch (sev?.toLowerCase()) {
        case 'critical': return 'fv-sev-critical';
        case 'high': return 'fv-sev-high';
        case 'medium': return 'fv-sev-medium';
        case 'low': return 'fv-sev-low';
        default: return 'fv-sev-default';
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
.fv-content {
  padding: 0;
  background: #f8f9fc;
  min-height: 100vh;
}

.fv-page-header {
  padding: 80px 32px 0;
}

.fv-back-link {
  color: #0f696e;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.fv-title {
  color: #241447;
  font-weight: 800;
  font-size: 2rem;
  margin: 14px 0 6px;
}

.fv-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 0.86rem;
}

.fv-filter-bar {
  margin: 20px 32px;
  background: #ffffff;
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 196, 208, 0.2);
}

.fv-tab-btn {
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 0.8rem;
  font-weight: 700;
  border: 1px solid rgba(203, 196, 208, 0.4);
  background: #f8f9fc;
  color: #49454f;
  cursor: pointer;
}

.fv-tab-active {
  background: #e0f2f1;
  color: #0f696e;
  border-color: #0f696e;
}

.fv-tab-critical,
.fv-tab-high,
.fv-tab-medium,
.fv-tab-low {
  background: #ffffff;
}

.fv-tab-active-critical {
  background: #fdeaea;
  color: #ba1a1a;
  border-color: #ba1a1a;
}

.fv-tab-active-high {
  background: #ffe8e8;
  color: #a02020;
  border-color: #a02020;
}

.fv-tab-active-medium {
  background: #fff5d8;
  color: #825b00;
  border-color: #825b00;
}

.fv-tab-active-low {
  background: #dcfce7;
  color: #166534;
  border-color: #16a34a;
}

.fv-filter-tag {
  background-color: #f0ecff;
  color: #4e3e73;
  border-radius: 20px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
}

.fv-tag-close {
  cursor: pointer;
}

.fv-count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #49454f;
  background: #edeef1;
  padding: 3px 10px;
  border-radius: 50px;
}

.fv-table-card {
  margin: 0 32px 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 196, 208, 0.2);
  overflow: hidden;
}

.fv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.fv-th {
  padding: 14px 16px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #49454f;
  background: #f8f9fc;
  border-bottom: 1px solid rgba(203, 196, 208, 0.25);
  white-space: nowrap;
}

.fv-tr {
  border-bottom: 1px solid rgba(203, 196, 208, 0.15);
}

.fv-tr:hover {
  background: #f8f9fc;
}

.fv-td {
  padding: 14px 16px;
  color: #191c1e;
  vertical-align: middle;
}

.fv-td-num {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  width: 54px;
}

.fv-vuln-name {
  max-width: 210px;
  font-weight: 600;
  color: #241447;
}

.fv-asset-chip {
  display: inline-block;
  background: #edeef1;
  color: #241447;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
}

.fv-sev-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
}

.fv-sev-critical {
  background: #ffdad6;
  color: #ba1a1a;
}

.fv-sev-high {
  background: #ffe3df;
  color: #a02020;
}

.fv-sev-medium {
  background: #fff4cc;
  color: #825b00;
}

.fv-sev-low {
  background: #dcfce7;
  color: #166534;
}

.fv-sev-default {
  background: #edeef1;
  color: #49454f;
}

.fv-td-date {
  color: #64748b;
  white-space: nowrap;
}

.fv-view-link {
  color: #0f696e;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.84rem;
}

.fv-view-link:hover {
  opacity: 0.85;
}

.fv-empty-row {
  padding: 48px 16px;
  text-align: center;
  color: #64748b;
}

.fv-empty-icon {
  font-size: 2rem;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}
</style>