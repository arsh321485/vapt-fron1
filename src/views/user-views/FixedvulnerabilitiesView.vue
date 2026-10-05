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
                <p class="fv-subtitle">Show all the fixed vul for all the assest</p>
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
              </div>
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
                    <tr v-for="(item, index) in paginatedRows" :key="item.fix_vulnerability_id" class="fv-tr">
                      <td class="fv-td fv-td-num">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
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
                            name: 'userassets',
                            query: {
                              asset: item.host_name,
                              plugin_name: item.plugin_name,
                              id: item.fix_vulnerability_id,
                              status: 'closed',
                              fix_tab: 'manual',
                            }
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
              <div v-if="!loading" class="fv-table-footer">
                <p class="fv-pagination-info">{{ paginationLabel }}</p>
                <div class="fv-pagination-controls" v-if="filteredRows.length">
                  <button class="fv-page-btn" @click="goToPrevPage" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <button
                    v-for="page in visiblePageNumbers"
                    :key="page"
                    class="fv-page-btn"
                    :class="{ 'fv-page-btn-active': currentPage === page }"
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                  <button class="fv-page-btn" @click="goToNextPage" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-right"></i>
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
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';
import userTeamFilterWatch from '@/utils/userTeamFilterWatch';
import { getSeverityColor as severityHex } from '@/utils/severityColors';

export default {
  mixins: [userTeamFilterWatch],
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
      currentPage: 1,
      itemsPerPage: 6,
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
    pageSize() {
      const size = Number(this.itemsPerPage);
      return size > 0 ? size : 6;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
    },
    paginatedRows() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredRows.slice(start, start + this.pageSize);
    },
    paginationLabel() {
      const total = this.filteredRows.length;
      if (!total) return 'Showing 0 of 0 results';
      const start = (this.currentPage - 1) * this.pageSize + 1;
      const end = Math.min(this.currentPage * this.pageSize, total);
      return `Showing ${start}-${end} of ${total} results`;
    },
    visiblePageNumbers() {
      const total = this.totalPages;
      const maxVisible = 5;
      if (total <= maxVisible) return Array.from({ length: total }, (_, i) => i + 1);
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > total) {
        end = total;
        start = end - maxVisible + 1;
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },
  watch: {
    activeFilters: {
      deep: true,
      handler() {
        this.currentPage = 1;
      },
    },
    filteredRows() {
      if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    },
  },
  methods: {
    async onUserSelectedTeamChanged(team) {
      if (typeof this.loadData === "function") await this.loadData();
    },
    goToPage(page) {
      this.currentPage = page;
    },
    goToPrevPage() {
      if (this.currentPage > 1) this.currentPage -= 1;
    },
    goToNextPage() {
      if (this.currentPage < this.totalPages) this.currentPage += 1;
    },
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
      return severityHex(sev);
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
    async liveRefreshPage() {
      const store = useAuthStore();
      const result = await store.fetchUserClosedVulns(true, store.userSelectedTeam);
      if (result.status) {
        this.allRows = result.data.closed_vulnerabilities || [];
        this.reportId = result.data.report_id;
      }
    },
    async loadData() {
      const store = useAuthStore();
      this.loading = true;
      // Always force-refresh: this page's whole job is to say what's been
      // fixed, but authStore.cachedUserClosedVulns is a single shared value
      // that any other flow (completing steps elsewhere, another session)
      // can leave stale here — force=false previously served that leftover
      // snapshot (sometimes "nothing fixed yet") even after a vuln had
      // genuinely been closed, since nothing else reliably invalidates it
      // before this page mounts.
      const result = await store.fetchUserClosedVulns(true, store.userSelectedTeam);
      if (result.status) {
        this.allRows = result.data.closed_vulnerabilities || [];
        this.reportId = result.data.report_id;
      }
      this.loading = false;
    },
  },
  async mounted() {
    // Opt into the livePageSync background poll (see utils/livePageSync.js) so
    // a fix completed in a different session is picked up here too —
    // BroadcastChannel-based mutation sync only reaches other tabs of the
    // same browser profile.
    this._vaptLiveAllowPoll = true;
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
  font-weight: 600;
  border: none;
  background: #f2f3f6;
  color: #49454f;
  cursor: pointer;
}

.fv-tab-active {
  background: #241447;
  color: #fff;
}

.fv-tab-active-critical {
  background: #f8dede;
  color: #b42318;
}

.fv-tab-active-high {
  background: #fee2e2;
  color: #dc2626;
}

.fv-tab-active-medium {
  background: #fef3c7;
  color: #f59e0b;
}

.fv-tab-active-low {
  background: #d1fae5;
  color: #10b981;
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
.fv-table-footer {
  padding: 16px 24px;
  background: #ffffff;
  border-top: 1px solid rgba(203, 196, 208, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.fv-pagination-info {
  font-size: 12px;
  color: #49454f;
  margin: 0;
}
.fv-pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}
.fv-page-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #241447;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.fv-page-btn:hover:not(:disabled) { background: #e7e8eb; }
.fv-page-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.fv-page-btn-active { background: #0f696e; color: #fff; }

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
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.fv-sev-critical {
  background: #f8dede;
  color: #b42318;
}

.fv-sev-high {
  background: #fee2e2;
  color: #dc2626;
}

.fv-sev-medium {
  background: #fef3c7;
  color: #f59e0b;
}

.fv-sev-low {
  background: #d1fae5;
  color: #10b981;
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
