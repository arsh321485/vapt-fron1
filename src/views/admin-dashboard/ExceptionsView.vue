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
          <div class="col-11 exc-content">

            <!-- Page Header -->
            <div class="exc-page-header">
              <div>
                <h2 class="exc-title">Support Requests</h2>
                <p class="exc-subtitle">Streamlining the resolution of critical infrastructure vulnerabilities.</p>
              </div>
              <div class="exc-stat-card">
                <div class="text-end">
                  <p class="exc-stat-label">Support Request Raised</p>
                  <p class="exc-stat-value">{{ finalSupportRequests.length }}</p>
                </div>
                <div class="exc-stat-icon">
                  <i class="bi bi-ticket-perforated-fill"></i>
                </div>
              </div>
            </div>

            <!-- Table Card -->
            <div class="exc-table-card">
              <!-- Controls -->
              <div class="exc-table-controls">
                <div class="d-flex gap-3 flex-wrap align-items-center">
                  <button
                    class="exc-tab-btn"
                    :class="{ 'exc-tab-active': activeTab === 'all' }"
                    @click="activeTab = 'all'"
                  >
                    All
                    <span class="exc-tab-count">{{ sortedSupportRequests.length }}</span>
                  </button>
                  <button
                    class="exc-tab-btn exc-tab-open"
                    :class="{ 'exc-tab-active-open': activeTab === 'open' }"
                    @click="activeTab = 'open'"
                  >
                    Open
                    <span class="exc-tab-count">{{ sortedSupportRequests.filter((r) => (r.status || '').toLowerCase() === 'open').length }}</span>
                  </button>
                  <button
                    class="exc-tab-btn exc-tab-closed"
                    :class="{ 'exc-tab-active-closed': activeTab === 'closed' }"
                    @click="activeTab = 'closed'"
                  >
                    Closed
                    <span class="exc-tab-count">{{ sortedSupportRequests.filter((r) => (r.status || '').toLowerCase() === 'closed').length }}</span>
                  </button>
                  <!-- <button class="exc-btn-filter">
                    <i class="bi bi-funnel me-1"></i> Filter View
                  </button>
                  <button class="exc-btn-sort" @click="toggleSort">
                    <i class="bi bi-sort-down me-1"></i> Sort by Date
                  </button> -->
                  <button
                    v-for="team in teamOptions"
                    :key="team.value"
                    type="button"
                    class="exc-team-pill"
                    :class="{ 'exc-team-pill-active': selectedTeam === team.value }"
                    :style="pillStyle(team)"
                    @click="setTeam(team.value)"
                  >
                    {{ team.label }}
                  </button>
                </div>
                <!-- <span class="exc-showing-badge">Showing {{ paginatedSupportRequests.length }} requests</span> -->
              </div>

              <!-- Table -->
              <div class="table-responsive">
                <table class="exc-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Vulnerability Name</th>
                      <th class="text-center">Criticality</th>
                      <th>Requested By</th>
                      <th>Support Raised</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingRequests">
                      <td colspan="6" class="text-center py-5 text-muted">Loading...</td>
                    </tr>
                    <tr v-else-if="!finalSupportRequests.length">
                      <td colspan="6" class="text-center py-5 text-muted">No support requests found</td>
                    </tr>
                    <tr v-else v-for="req in paginatedSupportRequests" :key="req._id">
                      <td>
                        <div class="exc-asset-cell">
                          <span class="exc-asset-ip">{{ req.host_name }}</span>
                          <span class="exc-asset-sub">{{ req.requested_by }}</span>
                        </div>
                      </td>
                      <td class="exc-vuln-name" :title="req.vul_name">{{ req.vul_name }}</td>
                      <td class="text-center">
                        <span class="exc-badge" :class="getSeverityBadgeClass(req)">
                          {{ getSeverityLabel(req) }}
                        </span>
                      </td>
                      <td>
                        <div class="d-flex align-items-center gap-2">
                          <div class="exc-avatar">{{ (req.requested_by || 'U').charAt(0).toUpperCase() }}</div>
                          <span class="exc-person-name">{{ req.requested_by }}</span>
                        </div>
                      </td>
                      <td class="exc-date">{{ req.requested_at ? new Date(req.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-' }}</td>
                      <td>
                        <span class="exc-status" :class="(req.status || '').toLowerCase() === 'closed' ? 'exc-status-closed' : 'exc-status-open'">
                          <span class="exc-status-dot"></span> {{ req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : 'Open' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 0" class="exc-pagination">
                <button class="exc-page-btn" :disabled="currentPage === 1" @click="goToPrevPage"><i class="bi bi-chevron-left"></i></button>
                <button
                  v-for="page in pageNumbers"
                  :key="page"
                  class="exc-page-btn"
                  :class="{ 'exc-page-active': currentPage === page }"
                  @click="goToPage(page)"
                >
                  {{ page }}
                </button>
                <button class="exc-page-btn" :disabled="currentPage === totalPages" @click="goToNextPage"><i class="bi bi-chevron-right"></i></button>
              </div>
            </div>


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
import { SUPPORT_TEAM_OPTIONS, teamPillStyle } from '@/utils/teamColors';

export default {
  name: 'ExceptionsView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      authStore: useAuthStore(),
      supportRequests: [],
      loadingRequests: false,
      pollTimer: null,
      showChat: false,
      minimized: false,
      messages: [
        { text: "Hi, can you explain the vulnerability?", sender: "bot", deletable: false, time: "10:30 AM" },
        { text: "Sure, this is related to Spring framework.", sender: "user", deletable: true, time: "10:35 AM" },
      ],
      showBox: false,
      selectedLocation: "greece",
      sortOrder: 'asc' ,
      selectedTeam: "all",
      teamOptions: [...SUPPORT_TEAM_OPTIONS],
      activeTab: "all",
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
  sortedSupportRequests() {
    const sorted = [...this.supportRequests];

    sorted.sort((a, b) => {
      const dateA = new Date(a.requested_at);
      const dateB = new Date(b.requested_at);

      return this.sortOrder === 'asc'
        ? dateA - dateB
        : dateB - dateA;
    });

    return sorted;
  },
   finalSupportRequests() {
    let rows = this.sortedSupportRequests;
    if (this.selectedTeam !== "all") {
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
    if (this.activeTab === "all") return rows;
    return rows.filter((req) => (req.status || "").toLowerCase() === this.activeTab);
  },
  totalPages() {
    return Math.ceil(this.finalSupportRequests.length / this.itemsPerPage);
  },
  paginatedSupportRequests() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.finalSupportRequests.slice(start, end);
  },
  pageNumbers() {
    const total = this.totalPages;
    if (total <= 3) return Array.from({ length: total }, (_, i) => i + 1);
    if (this.currentPage <= 2) return [1, 2, 3];
    if (this.currentPage >= total - 1) return [total - 2, total - 1, total];
    return [this.currentPage - 1, this.currentPage, this.currentPage + 1];
  }

  },
  watch: {
    sortOrder() {
      this.currentPage = 1;
    },
    selectedTeam() {
      this.currentPage = 1;
    },
    activeTab() {
      this.currentPage = 1;
    },
    finalSupportRequests() {
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      } else if (!this.totalPages) {
        this.currentPage = 1;
      }
    },
  },
  methods: {
    getSeverityRaw(req) {
      if (!req) return "";
      return String(req.risk_factor || req.severity || req.criticality || "").trim().toLowerCase();
    },
    getSeverityLabel(req) {
      const sev = this.getSeverityRaw(req);
      if (!sev) return "CRITICAL";
      if (sev === "high") return "HIGH";
      if (sev === "medium") return "MEDIUM";
      if (sev === "low") return "LOW";
      return "CRITICAL";
    },
    getSeverityBadgeClass(req) {
      const sev = this.getSeverityRaw(req);
      if (sev === "high") return "exc-badge-high";
      if (sev === "medium") return "exc-badge-medium";
      if (sev === "low") return "exc-badge-low";
      return "exc-badge-critical";
    },
    toggleSort() {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    },
    setTeam(value) {
      this.selectedTeam = value;
    },
    pillStyle(team) {
      return teamPillStyle(team, this.selectedTeam);
    },
    getShortDescription(desc) {
    if (!desc) return "";

    const words = desc.split(" ");
    return words.length > 4
      ? words.slice(0, 4).join(" ") + "..."
      : desc;
  },
  async fetchSupportRequests(silent = false) {
    const reportId = await this.authStore.resolveReportId();
    if (!reportId) {
      console.error('❌ reportId missing for support requests');
      return;
    }

    try {
      if (!silent && !this.authStore.cachedSupportRequests[reportId]) this.loadingRequests = true;

      // Always force=true to get fresh data (no stale cache)
      const res = await this.authStore.getSupportRequestsByReport(reportId, true);

      console.log("⬅️ API response:", res);

      if (res.status) {
        this.supportRequests = res.data;
      } else {
        this.supportRequests = [];
      }
      this.$nextTick(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
      });

    } catch (err) {
      console.error("❌ Fetch support requests failed:", err);
      this.supportRequests = [];
    } finally {
      this.loadingRequests = false;
    }
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
  mounted() {
  // Bootstrap tooltip init
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));

  // Dropdown code - only run if dropdown exists
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    const btn = dropdown.querySelector('.dropdown-btn');
    const options = dropdown.querySelectorAll('.dropdown-content a');

    if (btn) {
      btn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
      });
    }

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        if (btn) btn.textContent = option.textContent;
        dropdown.classList.remove('show');
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });
  }

  console.log("🔥 Support Requests View mounted");

  // Fetch support requests
  this.fetchSupportRequests();

  // Poll every 30s — new user support requests appear without manual refresh
  this.pollTimer = setInterval(() => {
    this.fetchSupportRequests(true);
  }, 30000);
  },

  beforeUnmount() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }
  },
};
</script>

<style scoped>
.exc-content { padding: 0; background: #f8f9fc; min-height: 100vh; }

.exc-page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  padding: 80px 32px 28px;
}
.exc-title { font-size: 2rem; font-weight: 800; color: #241447; margin: 0 0 6px; font-family: 'Manrope', sans-serif; }
.exc-subtitle { font-size: 0.875rem; color: #49454f; margin: 0; }

.exc-stat-card {
  display: flex; align-items: center; gap: 16px;
  background: #f2f3f6; border-radius: 12px; padding: 16px 20px;
}
.exc-stat-label { font-size: 0.6rem; font-weight: 700; color: #49454f; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px; }
.exc-stat-value { font-size: 1.6rem; font-weight: 800; color: #241447; margin: 0; line-height: 1; }
.exc-stat-icon {
  width: 40px; height: 40px; border-radius: 50%;
  background: #a1ecf2; color: #176d72;
  display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
}

.exc-table-card {
  margin: 0 32px 24px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(25,28,30,0.06);
  overflow: hidden;
  border: 1px solid rgba(203,196,208,0.15);
}

.exc-table-controls {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 24px;
  background: rgba(255,255,255,0.5);
  border-bottom: 1px solid rgba(203,196,208,0.15);
}
.exc-btn-filter {
  background: #eaddff; color: #241447; border: none; border-radius: 8px;
  padding: 8px 14px; font-size: 0.75rem; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center;
}
.exc-btn-sort {
  background: transparent; color: #49454f; border: none; border-radius: 8px;
  padding: 8px 14px; font-size: 0.75rem; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; transition: background 0.15s;
}
.exc-btn-sort:hover { background: #f2f3f6; }
.exc-tab-btn {
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 0.84rem;
  font-weight: 600;
  border: 1px solid rgba(203, 196, 208, 0.4);
  background: #f8f9fc;
  color: #49454f;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.exc-tab-count {
  font-size: 0.7rem;
  font-weight: 700;
  background: #edeef1;
  color: #49454f;
  padding: 1px 6px;
  border-radius: 50px;
}
.exc-tab-active {
  background: #dbeafe !important;
  color: #1d4ed8 !important;
  border-color: #2563eb !important;
}
.exc-tab-active .exc-tab-count {
  background: #2563eb;
  color: #ffffff;
}
.exc-tab-active-open {
  background: #f8dede !important;
  color: #b42318 !important;
  border-color: #b42318 !important;
}
.exc-tab-active-open .exc-tab-count {
  background: #b42318;
  color: #ffffff;
}
.exc-tab-active-closed {
  background: #dcfce7 !important;
  color: #166534 !important;
  border-color: #16a34a !important;
}
.exc-tab-active-closed .exc-tab-count {
  background: #16a34a;
  color: #ffffff;
}
/* Team pills — border colors match Performance Monitoring team cards */
.exc-team-pill {
  border-radius: 50px;
  padding: 7px 16px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f8fafc;
  border-style: solid;
  color: #1e293b;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  transition: background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s;
}
.exc-team-pill:hover {
  background: #f1f5f9;
}
.exc-team-pill-active {
  background: #f8fafc;
  font-weight: 700;
}
.exc-showing-badge {
  font-size: 0.72rem; font-weight: 600; color: #49454f;
  background: #edeef1; border-radius: 999px; padding: 5px 14px;
}

.exc-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.exc-table thead { background: #f2f3f6; }
.exc-table th {
  padding: 14px 24px; font-size: 0.68rem; font-weight: 700;
  color: #49454f; text-transform: uppercase; letter-spacing: 0.07em; border: none;
}
.exc-table tbody tr { border-top: 1px solid rgba(203,196,208,0.1); transition: background 0.15s; }
.exc-table tbody tr:hover { background: #f2f3f6; }
.exc-table td { padding: 20px 24px; border: none; vertical-align: middle; }

.exc-asset-cell { display: flex; flex-direction: column; gap: 2px; }
.exc-asset-ip { font-size: 0.875rem; font-weight: 700; color: #241447; }
.exc-asset-sub { font-size: 0.68rem; color: #49454f; }
.exc-vuln-name { font-size: 0.875rem; color: #1e1f1f; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.exc-badge { display: inline-flex; padding: 4px 10px; border-radius: 4px; font-size: 0.68rem; font-weight: 700; }
.exc-badge-critical { background: #f8dede; color: #b42318; }
.exc-badge-high { background: #fee2e2; color: #dc2626; }
.exc-badge-medium { background: #fff4cc; color: #f2c94c; }
.exc-badge-low { background: #d1fae5; color: #10b981; }

.exc-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: #a1ecf2; color: #002022;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700; flex-shrink: 0;
}
.exc-person-name { font-size: 0.875rem; font-weight: 500; color: #191c1e; }
.exc-date { font-size: 0.875rem; color: #49454f; font-weight: 500; }
.exc-ticket { font-size: 0.875rem; font-weight: 700; color: #0f696e; font-family: monospace; }

.exc-status { display: inline-flex; align-items: center; gap: 5px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; }
.exc-status-dot { width: 6px; height: 6px; border-radius: 50%; }
.exc-status-open { color: #b42318; } .exc-status-open .exc-status-dot { background: #b42318; }
.exc-status-closed { color: #16a34a; } .exc-status-closed .exc-status-dot { background: #16a34a; }
.exc-status-progress { color: #f2994a; } .exc-status-progress .exc-status-dot { background: #f2994a; }
.exc-status-resolved { color: #0f696e; } .exc-status-resolved .exc-status-dot { background: #0f696e; }

.exc-pagination {
  display: flex; justify-content: center; align-items: center; gap: 6px;
  padding: 20px; border-top: 1px solid rgba(203,196,208,0.1);
  background: #f2f3f6;
}
.exc-page-btn {
  width: 38px; height: 38px; border-radius: 50%; border: none;
  background: transparent; font-size: 0.875rem; font-weight: 700;
  color: #191c1e; cursor: pointer; display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.exc-page-btn:hover { background: #e7e8eb; }
.exc-page-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
.exc-page-active { background: #0f696e !important; color: #ffffff !important; }

.exc-insights {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 24px; margin: 0 32px 40px;
}
.exc-insight-card {
  background: #f2f3f6; border-radius: 12px; padding: 24px;
  position: relative; overflow: hidden;
}
.exc-insight-dark { background: #241447; }
.exc-insight-bg {
  position: absolute; top: -32px; right: -32px;
  width: 100px; height: 100px; border-radius: 50%;
  background: rgba(36,20,71,0.05);
}
.exc-insight-bg-teal { background: rgba(15,105,110,0.05); }
.exc-insight-label { font-size: 0.65rem; font-weight: 700; color: #191c1e; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 8px; }
.exc-insight-num { font-size: 1.8rem; font-weight: 800; color: #241447; margin: 0 0 6px; font-family: 'Manrope', sans-serif; }
.exc-insight-sub { font-size: 0.72rem; color: #49454f; margin: 0; line-height: 1.5; }
.exc-health-bar { width: 100%; height: 4px; background: #3a2a5e; border-radius: 999px; margin-top: 16px; overflow: hidden; }
.exc-health-fill { height: 100%; background: #0f696e; border-radius: 999px; }
</style>

