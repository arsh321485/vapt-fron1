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
                <div class="d-flex gap-3">
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
                  <button class="exc-btn-filter">
                    <i class="bi bi-funnel me-1"></i> Filter View
                  </button>
                  <button class="exc-btn-sort" @click="toggleSort">
                    <i class="bi bi-sort-down me-1"></i> Sort by Date
                  </button>
                  <select v-model="selectedTeam" class="exc-select">
                    <option value="all">All Teams</option>
                    <option value="Patch Management">Patch Management</option>
                    <option value="Configuration Management">Configuration Management</option>
                    <option value="Network Management">Network Management</option>
                    <option value="Architectural Management">Architectural Management</option>
                  </select>
                </div>
                <span class="exc-showing-badge">Showing {{ paginatedSupportRequests.length }} requests</span>
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
                    <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="loadingRequests">
                      <td colspan="7" class="text-center py-5 text-muted">Loading...</td>
                    </tr>
                    <tr v-else-if="!finalSupportRequests.length">
                      <td colspan="7" class="text-center py-5 text-muted">No support requests found</td>
                    </tr>
                    <tr v-else v-for="(req, index) in paginatedSupportRequests" :key="req._id">
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
                      <td>
                        <button type="button" class="exc-row-view-btn" @click.stop.prevent="openSlideOver(req, (currentPage - 1) * itemsPerPage + index)">View</button>
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

            <!-- Insight Cards -->
            <div class="exc-insights">
              <div class="exc-insight-card">
                <div class="exc-insight-bg"></div>
                <p class="exc-insight-label">Resolution Speed</p>
                <p class="exc-insight-num">4.2 Days</p>
                <p class="exc-insight-sub">Average time to close 'High' tickets. <span style="color:#0f696e;">↓ 12% from last month.</span></p>
              </div>
              <div class="exc-insight-card">
                <div class="exc-insight-bg exc-insight-bg-teal"></div>
                <p class="exc-insight-label">Coverage Gap</p>
                <p class="exc-insight-num">18 Assets</p>
                <p class="exc-insight-sub">Critical assets without active support tickets assigned.</p>
              </div>
              <div class="exc-insight-card exc-insight-dark">
                <p class="exc-insight-label" style="color:rgba(165,146,206,0.7);">System Health</p>
                <div class="d-flex align-items-end gap-2">
                  <p class="exc-insight-num" style="color:#fff;">94%</p>
                  <i class="bi bi-trending-up" style="color:#0f696e; margin-bottom:8px;"></i>
                </div>
                <div class="exc-health-bar">
                  <div class="exc-health-fill" style="width:94%;"></div>
                </div>
              </div>
            </div>

            <!-- Ticket Detail Slide-over -->
            <div v-if="showSlideOver" class="exc-slideover-backdrop" @click.self="closeSlideOver">
              <div class="exc-slideover">

                <!-- Header -->
                <div class="exc-so-header">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center gap-2">
                      <button class="exc-so-close-btn" @click="closeSlideOver"><i class="bi bi-x-lg"></i></button>
                      <span class="exc-so-label">SUPPORT REQUEST DETAILS</span>
                    </div>
                    <!-- <div class="d-flex gap-2">
                      <button class="exc-so-icon-btn"><i class="bi bi-share"></i></button>
                      <button class="exc-so-icon-btn"><i class="bi bi-three-dots-vertical"></i></button>
                    </div> -->
                  </div>
                  <h2 class="exc-so-title">{{ selectedSupportRequest?.vul_name || '-' }}</h2>
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <span class="exc-so-badge exc-so-badge-open"><span class="exc-so-dot bg-success"></span> STATUS: OPEN</span>
                    <span class="exc-so-badge" :class="getSeveritySlideBadgeClass(selectedSupportRequest)">
                      <span class="exc-so-dot" :class="getSeverityDotClass(selectedSupportRequest)"></span>
                      CRITICALITY: {{ getSeverityLabel(selectedSupportRequest) }}
                    </span>
                  </div>
                </div>

                <!-- Content -->
                <div class="exc-so-body">

                  <!-- Summary -->
                  <div class="exc-so-summary">
                    <div>
                      <p class="exc-so-meta-label">DATE RAISED</p>
                      <p class="exc-so-meta-val">{{ selectedSupportRequest?.requested_at ? new Date(selectedSupportRequest.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-' }}</p>
                    </div>
                    <div>
                      <p class="exc-so-meta-label">ASSET</p>
                      <p class="exc-so-meta-val">{{ selectedSupportRequest?.host_name }}</p>
                    </div>
                    <div>
                      <p class="exc-so-meta-label">ASSIGNED TO</p>
                      <div class="d-flex align-items-center gap-2">
                        <div class="exc-so-avatar">{{ (selectedSupportRequest?.requested_by || 'U').charAt(0).toUpperCase() }}</div>
                        <p class="exc-so-meta-val mb-0">{{ selectedSupportRequest?.requested_by }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Lifecycle Timeline -->
                  <div class="exc-so-section">
                    <h3 class="exc-so-section-title"><i class="bi bi-clock-history me-2"></i>Lifecycle Timeline</h3>
                    <div class="exc-so-timeline">
                      <div class="exc-so-tl-line"></div>

                      <div class="exc-so-tl-item">
                        <div class="exc-so-tl-dot exc-so-dot-done"><i class="bi bi-check-lg"></i></div>
                        <div class="exc-so-tl-content">
                          <div class="d-flex justify-content-between">
                            <p class="exc-so-tl-title">Ticket Raised</p>
                            <span class="exc-so-tl-time">{{ selectedSupportRequest?.requested_at ? new Date(selectedSupportRequest.requested_at).toLocaleString() : '-' }}</span>
                          </div>
                          <p class="exc-so-tl-desc">Support request submitted by {{ selectedSupportRequest?.requested_by }}.</p>
                        </div>
                      </div>

                      <div class="exc-so-tl-item">
                        <div class="exc-so-tl-dot exc-so-dot-done"><i class="bi bi-check-lg"></i></div>
                        <div class="exc-so-tl-content">
                          <div class="d-flex justify-content-between">
                            <p class="exc-so-tl-title">Acknowledged</p>
                            <span class="exc-so-tl-time">Pending review</span>
                          </div>
                          <p class="exc-so-tl-desc">Ticket assigned and under triage.</p>
                        </div>
                      </div>

                      <div class="exc-so-tl-item">
                        <div class="exc-so-tl-dot exc-so-dot-active">
                          <img src="@/assets/images/3-removebg-preview.png" class="exc-eye-icon" alt="investigation" />
                        </div>
                        <div class="exc-so-tl-content exc-so-tl-active-card">
                          <div class="d-flex justify-content-between">
                            <p class="exc-so-tl-title">Investigation Started</p>
                            <span class="exc-so-tl-time">In progress</span>
                          </div>
                          <p class="exc-so-tl-desc-italic">"{{ selectedSupportRequest?.description }}"</p>
                          <span class="exc-so-tl-author">— {{ (selectedSupportRequest?.requested_by || '').toUpperCase() }}</span>
                        </div>
                      </div>

                      <div class="exc-so-tl-item">
                        <div class="exc-so-tl-dot exc-so-dot-comment"><i class="bi bi-chat-left-text"></i></div>
                        <div class="exc-so-tl-content exc-so-tl-comment-card">
                          <div class="d-flex justify-content-between">
                            <p class="exc-so-tl-title">Steps Requested</p>
                            <span class="exc-so-tl-time">Awaiting</span>
                          </div>
                          <p class="exc-so-tl-desc">"Steps: {{ selectedSupportRequest?.step_requested }}. Verify patch availability and escalate if unresolved."</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                <!-- Footer -->
                <div class="exc-so-footer">
                  <div class="exc-so-textarea-wrap">
                    <textarea v-model="slideOverNote" class="exc-so-textarea" placeholder="Type your response or internal note..." rows="3"></textarea>
                    <div class="exc-so-textarea-actions">
                      <button class="exc-so-icon-btn"><i class="bi bi-paperclip"></i></button>
                      <button class="exc-so-icon-btn"><i class="bi bi-at"></i></button>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="d-flex gap-3">
                      <button class="exc-so-note-btn"><span class="exc-so-dot-sm bg-success me-1"></span>Internal Note</button>
                      <button class="exc-so-visible-btn"><i class="bi bi-globe2 me-1"></i>Customer Visible</button>
                    </div>
                    <button class="exc-so-send-btn">Send Update <i class="bi bi-send ms-1"></i></button>
                  </div>
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
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import { useAuthStore } from "@/stores/authStore";

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
      selectedSupportRequest: null,
      showSlideOver: false,
      slideOverIndex: 0,
      slideOverNote: '',
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
      activeTab: "all",
      currentPage: 1,
      itemsPerPage: 6,
    };
  },
  computed: {
  selectedStepsArray() {
    if (!this.selectedSupportRequest?.step_requested) return [];

    const steps = this.selectedSupportRequest.step_requested.toLowerCase();

    // handle "all"
    if (steps === "all") {
      return ["All Steps"];
    }

    return this.selectedSupportRequest.step_requested
      .split(",")
      .map(s => s.trim());
  },

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
      rows = rows.filter(req =>
        req.assigned_team?.toLowerCase() === this.selectedTeam.toLowerCase()
      );
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
    getSeveritySlideBadgeClass(req) {
      const sev = this.getSeverityRaw(req);
      if (sev === "high") return "exc-so-badge-high";
      if (sev === "medium") return "exc-so-badge-medium";
      if (sev === "low") return "exc-so-badge-low";
      return "exc-so-badge-critical";
    },
    getSeverityDotClass(req) {
      const sev = this.getSeverityRaw(req);
      if (sev === "high") return "exc-so-dot-high";
      if (sev === "medium") return "exc-so-dot-medium";
      if (sev === "low") return "exc-so-dot-low";
      return "exc-so-dot-critical";
    },
    toggleSort() {
  this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
},
    getShortDescription(desc) {
    if (!desc) return "";

    const words = desc.split(" ");
    return words.length > 4
      ? words.slice(0, 4).join(" ") + "..."
      : desc;
  },
  async fetchSupportRequests() {
    console.log("➡️ fetchSupportRequests called");

    const reportId = localStorage.getItem("reportId");

    if (!reportId) {
      console.error("❌ reportId missing");
      return;
    }

    try {
      if (!this.authStore.cachedSupportRequests[reportId]) this.loadingRequests = true;

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

  openViewRequestModal(req) {
    this.selectedSupportRequest = req;
  },
  openSlideOver(req, index) {
    this.selectedSupportRequest = req;
    this.slideOverIndex = index;
    this.showSlideOver = true;
    this.slideOverNote = '';
  },
  closeSlideOver() {
    this.showSlideOver = false;
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

  // If any extra store methods added later, safe call pattern
  if (typeof this.authStore.fetchSupportRequests === 'function') {
    // future store sync if needed
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
  background: #e0f2f1 !important;
  color: #0f696e !important;
  border-color: #0f696e !important;
}
.exc-tab-active .exc-tab-count {
  background: #0f696e;
  color: #ffffff;
}
.exc-tab-active-open {
  background: #fdeaea !important;
  color: #ba1a1a !important;
  border-color: #ba1a1a !important;
}
.exc-tab-active-open .exc-tab-count {
  background: #ba1a1a;
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
.exc-select {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 12px;
  font-size: 0.82rem; color: #1e293b; background: #f2f3f6; outline: none; cursor: pointer;
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
.exc-badge-critical { background: #ffdad6; color: #ba1a1a; }
.exc-badge-high { background: #ffe0c8; color: #f2994a; }
.exc-badge-medium { background: #fff4cc; color: #f2c94c; }
.exc-badge-low { background: #a1ecf2; color: #002022; }

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
.exc-status-open { color: #ba1a1a; } .exc-status-open .exc-status-dot { background: #ba1a1a; }
.exc-status-closed { color: #16a34a; } .exc-status-closed .exc-status-dot { background: #16a34a; }
.exc-status-progress { color: #f2994a; } .exc-status-progress .exc-status-dot { background: #f2994a; }
.exc-status-resolved { color: #0f696e; } .exc-status-resolved .exc-status-dot { background: #0f696e; }
.exc-row-view-btn {
  border: none;
  background: none;
  color: #0f696e;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}
.exc-row-view-btn:hover { opacity: 0.75; text-decoration: underline; }

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

/* ── Slide-over ── */
.exc-slideover-backdrop {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(36,20,71,0.4);
  backdrop-filter: blur(4px);
  display: flex; justify-content: flex-end;
}
.exc-slideover {
  width: min(680px, 100vw);
  height: 100vh;
  background: #ffffff;
  display: flex; flex-direction: column;
  box-shadow: -8px 0 40px rgba(0,0,0,0.18);
  overflow: hidden;
}
.exc-so-header {
  padding: 28px 32px 24px;
  background: #f2f3f6;
  border-bottom: 1px solid rgba(203,196,208,0.2);
  flex-shrink: 0;
}
.exc-so-label { font-size: 0.72rem; font-weight: 700; color: #49454f; letter-spacing: 0.1em; text-transform: uppercase; }
.exc-so-close-btn {
  background: none; border: none; cursor: pointer;
  color: #49454f; font-size: 1rem; padding: 4px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; transition: background 0.15s;
}
.exc-so-close-btn:hover { background: #e2e8f0; color: #241447; }
.exc-so-icon-btn {
  background: none; border: none; cursor: pointer;
  color: #49454f; font-size: 1rem; padding: 6px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%; width: 32px; height: 32px; transition: background 0.15s;
}
.exc-so-icon-btn:hover { background: #e2e8f0; }
.exc-so-title { font-size: 1.6rem; font-weight: 800; color: #241447; margin: 0; font-family: 'Manrope', sans-serif; line-height: 1.2; }
.exc-so-badge {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 999px;
  font-size: 0.65rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
}
.exc-so-badge-open { background: #a1ecf2; color: #002022; }
.exc-so-badge-critical { background: #ffdad6; color: #ba1a1a; }
.exc-so-badge-high { background: #ffe0c8; color: #9a3412; }
.exc-so-badge-medium { background: #fff4cc; color: #a16207; }
.exc-so-badge-low { background: #d1fae5; color: #166534; }
.exc-so-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.exc-so-dot-critical { background: #ba1a1a; }
.exc-so-dot-high { background: #f2994a; }
.exc-so-dot-medium { background: #f2c94c; }
.exc-so-dot-low { background: #0f696e; }

.exc-so-body { flex: 1; overflow-y: auto; padding: 28px 32px; }
.exc-so-summary {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 16px; background: #f2f3f6; border-radius: 12px;
  padding: 20px 24px; margin-bottom: 28px;
}
.exc-so-meta-label { font-size: 0.6rem; font-weight: 700; color: #49454f; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 4px; }
.exc-so-meta-val { font-size: 0.875rem; font-weight: 600; color: #241447; margin: 0; }
.exc-so-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  background: #3a2a5e; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.7rem; font-weight: 700; flex-shrink: 0;
}

.exc-so-section { margin-bottom: 24px; }
.exc-so-section-title { font-size: 1rem; font-weight: 700; color: #241447; margin: 0 0 20px; display: flex; align-items: center; }

.exc-so-timeline { position: relative; padding-left: 32px; display: flex; flex-direction: column; gap: 24px; }
.exc-so-tl-line {
  position: absolute; left: 11px; top: 8px; bottom: 8px;
  width: 2px; background: rgba(203,196,208,0.3);
}
.exc-so-tl-item { display: flex; align-items: flex-start; gap: 12px; position: relative; }
.exc-so-tl-dot {
  width: 24px; height: 24px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; flex-shrink: 0;
  position: absolute; left: -32px; z-index: 1;
}
.exc-so-dot-done { background: #0f696e; color: #fff; }
.exc-so-dot-active {
  background: #ffffff;
  border: 2px solid #241447;
  color: #241447;
  box-shadow: none;
  width: 24px;
  height: 24px;
  left: -32px;
  top: 0;
}
.exc-eye-icon { width: 56px; height: 180px; padding-top: 10px; display: block; object-fit: contain; }
.exc-so-dot-comment { background: #e2e8f0; color: #49454f; }

.exc-so-tl-content { flex: 1; min-width: 0; }
.exc-so-tl-title { font-size: 0.875rem; font-weight: 700; color: #241447; margin: 0 0 4px; }
.exc-so-tl-time { font-size: 0.65rem; font-weight: 700; color: #49454f; white-space: nowrap; }
.exc-so-tl-desc { font-size: 0.82rem; color: #49454f; margin: 0; line-height: 1.5; }
.exc-so-tl-desc-italic { font-size: 0.82rem; color: #191c1e; font-style: italic; margin: 0 0 6px; line-height: 1.5; }
.exc-so-tl-author { font-size: 0.68rem; font-weight: 700; color: #0f696e; text-transform: uppercase; }
.exc-so-tl-active-card {
  background: #f2f3f6; border-radius: 8px; padding: 14px 16px;
}
.exc-so-tl-comment-card {
  background: rgba(36,20,71,0.03); border-left: 4px solid #0f696e;
  border-radius: 0 8px 8px 0; padding: 14px 16px;
}

.exc-so-footer {
  padding: 20px 32px 24px;
  background: #ffffff;
  border-top: 1px solid rgba(203,196,208,0.15);
  flex-shrink: 0;
}
.exc-so-textarea-wrap { position: relative; }
.exc-so-textarea {
  width: 100%; background: #f2f3f6; border: none;
  border-radius: 12px; padding: 14px 50px 14px 16px;
  font-size: 0.875rem; color: #191c1e; resize: none; outline: none;
  transition: box-shadow 0.15s;
}
.exc-so-textarea:focus { box-shadow: 0 0 0 2px #0f696e; }
.exc-so-textarea-actions {
  position: absolute; bottom: 10px; right: 10px;
  display: flex; gap: 4px;
}
.exc-so-note-btn {
  background: none; border: none; cursor: pointer;
  font-size: 0.75rem; font-weight: 700; color: #49454f;
  display: inline-flex; align-items: center; padding: 6px 10px;
  border-radius: 8px; transition: background 0.15s;
}
.exc-so-note-btn:hover { background: #f2f3f6; }
.exc-so-visible-btn {
  background: none; border: none; cursor: pointer;
  font-size: 0.75rem; font-weight: 700; color: #0f696e;
  display: inline-flex; align-items: center; padding: 6px 10px;
  border-radius: 8px; transition: background 0.15s;
}
.exc-so-visible-btn:hover { background: rgba(15,105,110,0.08); }
.exc-so-dot-sm { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.exc-so-send-btn {
  background: #241447; color: #fff; border: none;
  border-radius: 999px; padding: 10px 24px;
  font-size: 0.875rem; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px;
  box-shadow: 0 4px 14px rgba(36,20,71,0.25);
  transition: opacity 0.15s;
}
.exc-so-send-btn:hover { opacity: 0.88; }
</style>
