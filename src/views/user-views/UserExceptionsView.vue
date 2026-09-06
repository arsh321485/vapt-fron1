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

          <div class="col-11 st-content">
            <div class="st-page-header">
              <div>
                <h2 class="st-title">Support Requests</h2>
                <p class="st-subtitle">Track and manage all raised support requests</p>
              </div>
              <div class="st-stat-card st-stat-card-static">
                <div class="text-end">
                  <p class="st-stat-label">Support Request Raised</p>
                  <p class="st-stat-value">{{ filteredRequests.length }}</p>
                </div>
                <div class="st-stat-icon">
                  <i class="bi bi-ticket-perforated-fill"></i>
                </div>
              </div>
            </div>

            <div class="st-filter-bar">
              <div class="d-flex gap-2 flex-wrap">
                <button
                  class="st-tab-btn"
                  :class="{ 'st-tab-active': activeTab === 'all' }"
                  @click="activeTab = 'all'"
                >
                  All
                  <span class="st-tab-count">{{ sortedRequests.length }}</span>
                </button>
                <button
                  class="st-tab-btn st-tab-open"
                  :class="{ 'st-tab-active-open': activeTab === 'open' }"
                  @click="activeTab = 'open'"
                >
                  Open
                  <span class="st-tab-count">{{ sortedRequests.filter((r) => r.status?.toLowerCase() === 'open').length }}</span>
                </button>
                <button
                  class="st-tab-btn st-tab-closed"
                  :class="{ 'st-tab-active-closed': activeTab === 'closed' }"
                  @click="activeTab = 'closed'"
                >
                  Closed
                  <span class="st-tab-count">{{ sortedRequests.filter((r) => r.status?.toLowerCase() === 'closed').length }}</span>
                </button>
                <button class="st-sort-btn" @click="toggleSort">
                  <i class="bi bi-arrow-down-up me-1"></i>
                  Sort by date
                  <span v-if="sortOrder === 'asc'">↑</span>
                  <span v-else>↓</span>
                </button>
                <select v-model="selectedTeam" class="st-select">
                  <option value="all">All Teams</option>
                  <option value="Patch Management">Patch Management</option>
                  <option value="Configuration Management">Configuration Management</option>
                  <option value="Network Security">Network Security</option>
                  <option value="Architectural Flaws">Architectural Flaws</option>
                </select>
              </div>
              <span class="st-count-badge">{{ filteredRequests.length }} requests</span>
            </div>

            <div class="st-table-card">
              <div v-if="loading" class="text-center py-5">
                <span class="spinner-border text-primary"></span>
              </div>
              <div v-else class="table-responsive">
                <table class="st-table">
                  <thead>
                    <tr>
                      <th class="st-th">Asset</th>
                      <th class="st-th">Vulnerability Name</th>
                      <th class="st-th text-center">Severity</th>
                      <th class="st-th">Requested by</th>
                      <th class="st-th">Support Raised</th>
                      <th class="st-th">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="req in paginatedRequests" :key="req._id" class="st-tr">
                      <td class="st-td">
                        <div class="st-asset-cell">
                          <span class="st-asset-ip">{{ req.host_name || '-' }}</span>
                          <span class="st-asset-sub">{{ req.requested_by || '-' }}</span>
                        </div>
                      </td>
                      <td class="st-td">
                        <span class="st-vuln-name text-truncate d-block" :title="req.vul_name">{{ req.vul_name || '-' }}</span>
                      </td>
                      <td class="st-td">
                        <span class="st-crit-badge" :class="getSeverityBadgeClass(req)">
                          {{ getSeverityLabel(req) }}
                        </span>
                      </td>
                      <td class="st-td">
                        <div class="d-flex align-items-center gap-2">
                          <div class="st-avatar">{{ (req.requested_by || 'U').charAt(0).toUpperCase() }}</div>
                          <span class="st-person-name">{{ req.requested_by || '-' }}</span>
                        </div>
                      </td>
                      <td class="st-td st-td-date">
                        {{ req.requested_at ? new Date(req.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-' }}
                      </td>
                      <td class="st-td">
                        <span
                          class="st-status-badge"
                          :class="req.status?.toLowerCase() === 'closed' ? 'st-status-closed' : 'st-status-open'"
                        >
                          <span class="st-status-dot"></span>
                          {{ formatStatusLabel(req.status || 'open') }}
                        </span>
                      </td>
                    </tr>
                    <tr v-if="!filteredRequests.length">
                      <td colspan="6" class="st-empty-row">
                        <i class="bi bi-inbox st-empty-icon"></i>
                        <p class="mb-0">No support requests found.</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="!loading && totalPages > 0" class="st-pagination">
                <button class="st-page-btn" :disabled="currentPage === 1" @click="goToPrevPage">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  class="st-page-btn"
                  :class="{ 'st-page-active': currentPage === page }"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button class="st-page-btn" :disabled="currentPage === totalPages" @click="goToNextPage">
                  <i class="bi bi-chevron-right"></i>
                </button>
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
import { formatStatusLabel } from '@/utils/statusLabel';

export default {
  mixins: [userTeamFilterWatch],
    name: 'UserExceptionsView',
    components: {
        DashboardMenu,
        DashboardHeader,
    },
    data() {
        return {
            authStore: useAuthStore(),
            supportRequests: [],
            loading: false,
            sortOrder: 'desc',
            activeTab: 'all',
            selectedTeam: 'all',
            currentPage: 1,
            itemsPerPage: 6,
        };
    },
    computed: {
        sortedRequests() {
            return [...this.supportRequests].sort((a, b) => {
                const da = new Date(a.requested_at);
                const db = new Date(b.requested_at);
                return this.sortOrder === 'asc' ? da - db : db - da;
            });
        },
        filteredRequests() {
            let rows = this.sortedRequests;
            if (this.selectedTeam !== 'all') {
                const sel = this.selectedTeam.toLowerCase().trim();
                rows = rows.filter(req => {
                    // Check all possible team field names from API
                    const teamVal = (
                        req.assigned_team ||
                        req.team_name ||
                        req.team ||
                        req.assigned_to_team ||
                        ''
                    ).toLowerCase().trim();
                    // Flexible match: exact or partial
                    return teamVal === sel || teamVal.includes(sel) || sel.includes(teamVal);
                });
            }
            if (this.activeTab === 'all') return rows;
            return rows.filter((req) => req.status?.toLowerCase() === this.activeTab);
        },
        totalPages() {
            return Math.ceil(this.filteredRequests.length / this.itemsPerPage);
        },
        paginatedRequests() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.filteredRequests.slice(start, end);
        },
        pageNumbers() {
            const total = this.totalPages;
            if (total <= 3) {
                return Array.from({ length: total }, (_, i) => i + 1);
            }

            if (this.currentPage <= 2) return [1, 2, 3];
            if (this.currentPage >= total - 1) return [total - 2, total - 1, total];
            return [this.currentPage - 1, this.currentPage, this.currentPage + 1];
        },
    },
    watch: {
        activeTab() {
            this.currentPage = 1;
        },
        sortOrder() {
            this.currentPage = 1;
        },
        selectedTeam() {
            this.currentPage = 1;
        },
        filteredRequests() {
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
                this.currentPage = this.totalPages;
            } else if (!this.totalPages) {
                this.currentPage = 1;
            }
        },
        '$route'() {
            this.loadSupportRequests();
        },
    },
    async mounted() {
        await this.loadSupportRequests();
        this.initTooltips();
    },
    methods: {
    formatStatusLabel,
    async onUserSelectedTeamChanged(team) {
      if (typeof this.loadSupportRequests === "function") await this.loadSupportRequests();
    },
        getSeverityRaw(req) {
            if (!req) return '';
            return String(req.risk_factor || req.severity || req.criticality || '').trim().toLowerCase();
        },
        getSeverityLabel(req) {
            const sev = this.getSeverityRaw(req);
            if (sev === 'high') return 'HIGH';
            if (sev === 'medium') return 'MEDIUM';
            if (sev === 'low') return 'LOW';
            return 'CRITICAL';
        },
        getSeverityBadgeClass(req) {
            const sev = this.getSeverityRaw(req);
            if (sev === 'high') return 'st-crit-high';
            if (sev === 'medium') return 'st-crit-medium';
            if (sev === 'low') return 'st-crit-low';
            return 'st-crit-critical';
        },
        initTooltips() {
            this.$nextTick(() => {
                const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                [...tooltipEls].forEach((el) => new bootstrap.Tooltip(el));
            });
        },
        async liveRefreshPage() {
            const reportId = this.authStore.userLatestReportId;
            if (!reportId) return;
            const res = await this.authStore.fetchUserSupportRequestsByReport(reportId, true, this.authStore.userSelectedTeam);
            if (res.status) this.supportRequests = res.data;
        },
        async loadSupportRequests() {
            await this.authStore.fetchUserVulnerabilityRegister();
            const reportId = this.authStore.userLatestReportId;
            if (!reportId) return;
            this.loading = true;
            const res = await this.authStore.fetchUserSupportRequestsByReport(reportId, false, this.authStore.userSelectedTeam);
            this.loading = false;
            if (res.status) {
                this.supportRequests = res.data;
            }
            this.initTooltips();
        },
        toggleSort() {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
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
    },
};
</script>

<style scoped>
.st-content {
  padding: 0;
}

.st-page-header {
  padding: 70px 32px 0;
  background: #f8f9fc;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
}

.st-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 4px;
}

.st-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.st-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f2f3f6;
  border-radius: 12px;
  padding: 16px 20px;
}

.st-stat-card-static {
  cursor: default;
}

.st-stat-card-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.st-stat-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #49454f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px;
}

.st-stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: #241447;
  margin: 0;
  line-height: 1;
}

.st-stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #a1ecf2;
  color: #176d72;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.st-filter-bar {
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

.st-tab-btn {
  border-radius: 50px;
  padding: 6px 18px;
  font-size: 0.84rem;
  font-weight: 600;
  border: 1px solid rgba(203, 196, 208, 0.4);
  background: #f8f9fc;
  color: #49454f;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.15s;
}

.st-tab-btn:hover {
  background: #edeef1;
}

.st-sort-btn {
  border-radius: 50px;
  padding: 6px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid rgba(203, 196, 208, 0.4);
  background: #ffffff;
  color: #49454f;
}

.st-btn-filter {
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 0.78rem;
  font-weight: 600;
  border: none;
  background: #f2e8ff;
  color: #241447;
}

.st-select {
  border-radius: 8px;
  border: 1px solid rgba(203, 196, 208, 0.4);
  background: #f8f9fc;
  color: #49454f;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 190px;
  height: 34px;
  padding: 0 10px;
}

.st-tab-count {
  font-size: 0.7rem;
  font-weight: 700;
  background: #edeef1;
  color: #49454f;
  padding: 1px 6px;
  border-radius: 50px;
}

.st-tab-active {
  background: #dbeafe !important;
  color: #1d4ed8 !important;
  border-color: #2563eb !important;
}

.st-tab-active .st-tab-count {
  background: #2563eb;
  color: #ffffff;
}

.st-tab-active-open {
  background: #fdeaea !important;
  color: #ba1a1a !important;
  border-color: #ba1a1a !important;
}

.st-tab-active-open .st-tab-count {
  background: #ba1a1a;
  color: #ffffff;
}

.st-tab-active-closed {
  background: #dcfce7 !important;
  color: #166534 !important;
  border-color: #16a34a !important;
}

.st-tab-active-closed .st-tab-count {
  background: #16a34a;
  color: #ffffff;
}

.st-count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #49454f;
  background: #edeef1;
  padding: 3px 10px;
  border-radius: 50px;
}

.st-table-card {
  margin: 0 32px 32px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(203, 196, 208, 0.2);
  overflow: hidden;
}

.st-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.st-th {
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

.st-tr {
  border-bottom: 1px solid rgba(203, 196, 208, 0.15);
  transition: background 0.12s;
}

.st-tr:hover {
  background: #f8f9fc;
}

.st-td {
  padding: 14px 16px;
  color: #191c1e;
  vertical-align: middle;
}

.st-td-num {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  width: 48px;
}

.st-vuln-name {
  font-weight: 600;
  color: #241447;
  max-width: 200px;
}

.st-asset-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.st-asset-ip {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}

.st-asset-sub {
  font-size: 0.72rem;
  color: #94a3b8;
}

.st-avatar {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #241447;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
}

.st-person-name {
  font-size: 0.82rem;
  color: #334155;
  font-weight: 600;
}

.st-asset-chip {
  display: inline-block;
  background: #edeef1;
  color: #241447;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
}

.st-desc-text {
  color: #49454f;
  font-size: 0.85rem;
  max-width: 220px;
}

.st-expand-icon {
  font-size: 0.7rem;
  color: #0f696e;
  opacity: 0.7;
}

.st-td-date {
  font-size: 0.82rem;
  color: #64748b;
  white-space: nowrap;
}

.st-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 50px;
  text-transform: capitalize;
}

.st-status-open {
  background: #fdeaea;
  color: #ba1a1a;
}

.st-status-open .st-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ba1a1a;
  flex-shrink: 0;
}

.st-status-closed {
  background: #dcfce7;
  color: #166534;
}

.st-status-closed .st-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}

.st-crit-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 84px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.st-crit-critical { background: #f8dede; color: #b42318; }
.st-crit-high { background: #fee2e2; color: #dc2626; }
.st-crit-medium { background: #fef3c7; color: #f59e0b; }
.st-crit-low { background: #d1fae5; color: #10b981; }

.st-empty-row {
  padding: 48px 16px;
  text-align: center;
  color: #64748b;
}

.st-empty-icon {
  font-size: 2rem;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}

.st-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  padding: 20px;
  border-top: 1px solid rgba(203, 196, 208, 0.1);
  background: #f2f3f6;
}

.st-page-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 700;
  color: #191c1e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.st-page-btn:hover:not(:disabled) {
  background: #e7e8eb;
}

.st-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.st-page-active {
  background: #0f696e !important;
  color: #ffffff !important;
}

.st-insights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 0 32px 40px;
}

.st-insight-card {
  background: #f2f3f6;
  border-radius: 12px;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.st-insight-dark {
  background: #241447;
}

.st-insight-bg {
  position: absolute;
  top: -32px;
  right: -32px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(36, 20, 71, 0.05);
}

.st-insight-bg-teal {
  background: rgba(15, 105, 110, 0.05);
}

.st-insight-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #191c1e;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 8px;
}

.st-insight-label-dark {
  color: rgba(165, 146, 206, 0.7);
}

.st-insight-num {
  font-size: 1.8rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 6px;
}

.st-insight-num-dark {
  color: #ffffff;
}

.st-insight-sub {
  font-size: 0.72rem;
  color: #49454f;
  margin: 0;
  line-height: 1.5;
}

.st-insight-trend {
  color: #0f696e;
}

.st-health-bar {
  width: 100%;
  height: 4px;
  background: #3a2a5e;
  border-radius: 999px;
  margin-top: 16px;
  overflow: hidden;
}

.st-health-fill {
  height: 100%;
  background: #0f696e;
  border-radius: 999px;
}
</style>
