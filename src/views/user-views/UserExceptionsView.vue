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
                  <p class="st-stat-label">Active Tickets</p>
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
                      <th class="st-th">#</th>
                      <th class="st-th">Vulnerability</th>
                      <th class="st-th">Asset</th>
                      <th class="st-th">Requested by</th>
                      <th class="st-th">Description</th>
                      <th class="st-th">Date requested</th>
                      <th class="st-th">Status</th>
                      <th class="st-th">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(req, i) in paginatedRequests" :key="req._id" class="st-tr">
                      <td class="st-td st-td-num">{{ (currentPage - 1) * itemsPerPage + i + 1 }}</td>
                      <td class="st-td" data-bs-toggle="tooltip" data-bs-placement="top" :title="req.vul_name">
                        <span class="st-vuln-name text-truncate d-block">{{ req.vul_name || '-' }}</span>
                      </td>
                      <td class="st-td">
                        <span class="st-asset-chip">{{ req.host_name || '-' }}</span>
                      </td>
                      <td class="st-td">{{ req.requested_by || '-' }}</td>
                      <td
                        class="st-td"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        :title="req.description"
                        data-bs-target="#viewRequestsModal"
                        style="cursor: pointer;"
                        @click="viewRequest(req)"
                      >
                        <span class="st-desc-text text-truncate d-block">{{ req.description || '-' }}</span>
                        <i class="bi bi-box-arrow-up-right st-expand-icon ms-1"></i>
                      </td>
                      <td class="st-td st-td-date">{{ formatDate(req.requested_at) }}</td>
                      <td class="st-td">
                        <span
                          class="st-status-badge"
                          :class="req.status?.toLowerCase() === 'closed' ? 'st-status-closed' : 'st-status-open'"
                        >
                          <span class="st-status-dot"></span>
                          {{ req.status || 'Open' }}
                        </span>
                      </td>
                      <td class="st-td">
                        <button
                          class="st-view-btn"
                          @click="openSlideOver(req, (currentPage - 1) * itemsPerPage + i)"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                    <tr v-if="!filteredRequests.length">
                      <td colspan="8" class="st-empty-row">
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

            <div class="st-insights">
              <div class="st-insight-card">
                <div class="st-insight-bg"></div>
                <p class="st-insight-label">Resolution Speed</p>
                <p class="st-insight-num">4.2 Days</p>
                <p class="st-insight-sub">
                  Average time to close 'High' tickets.
                  <span class="st-insight-trend">↓ 12% from last month.</span>
                </p>
              </div>
              <div class="st-insight-card">
                <div class="st-insight-bg st-insight-bg-teal"></div>
                <p class="st-insight-label">Coverage Gap</p>
                <p class="st-insight-num">18 Assets</p>
                <p class="st-insight-sub">Critical assets without active support tickets assigned.</p>
              </div>
              <div class="st-insight-card st-insight-dark">
                <p class="st-insight-label st-insight-label-dark">System Health</p>
                <p class="st-insight-num st-insight-num-dark">94%</p>
                <div class="st-health-bar">
                  <div class="st-health-fill" style="width: 94%;"></div>
                </div>
              </div>
            </div>

            <div class="modal fade" id="viewRequestsModal" tabindex="-1" aria-labelledby="viewRequestsModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content st-modal-content">
                  <div class="modal-header st-modal-header">
                    <h5 class="modal-title st-modal-title" id="viewRequestsModalLabel">Issues Raised for Support</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body p-4" v-if="selectedRequest">
                    <div class="mb-3">
                      <p class="st-modal-section-label mb-1">Vulnerability</p>
                      <p class="fw-semibold mb-0">{{ selectedRequest.vul_name || '-' }}</p>
                    </div>
                    <div class="mb-3">
                      <p class="st-modal-section-label mb-1">Asset</p>
                      <p class="fw-semibold mb-0">{{ selectedRequest.host_name || '-' }}</p>
                    </div>
                    <div class="mb-3">
                      <p class="st-modal-section-label mb-1">Requested by</p>
                      <p class="fw-semibold mb-0">{{ selectedRequest.requested_by || '-' }}</p>
                    </div>
                    <div class="mb-3">
                      <p class="st-modal-section-label mb-2">Steps requested</p>
                      <div v-if="selectedRequest.step_requested?.toLowerCase() === 'all'" class="d-flex flex-wrap gap-2">
                        <span class="st-step-chip">All Steps</span>
                      </div>
                      <div v-else class="d-flex flex-wrap gap-2">
                        <span
                          v-for="step in selectedRequest.step_requested?.split(',') || []"
                          :key="step"
                          class="st-step-chip"
                        >
                          Step {{ step.trim() }}
                        </span>
                      </div>
                    </div>
                    <h6 class="st-modal-section-label mt-3">Description</h6>
                    <textarea class="st-desc-textarea" rows="4" readonly>{{ selectedRequest.description }}</textarea>
                  </div>
                  <div class="modal-footer st-modal-footer">
                    <button type="button" class="st-close-btn" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="showSlideOver" class="st-slideover-backdrop" @click.self="closeSlideOver">
              <div class="st-slideover">
                <div class="st-so-header">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center gap-2">
                      <button class="st-so-close-btn" @click="closeSlideOver"><i class="bi bi-x-lg"></i></button>
                      <span class="st-so-label">TICKET DETAIL</span>
                    </div>

                  </div>
                  <h2 class="st-so-title">
                    SR-{{ String(slideOverIndex + 90000).padStart(5, '0') }}: {{ selectedSupportRequest?.vul_name || '-' }}
                  </h2>
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <span class="st-so-badge st-so-badge-open">
                      <span class="st-so-dot bg-success"></span>
                      STATUS: {{ (selectedSupportRequest?.status || 'Open').toUpperCase() }}
                    </span>
                    <span class="st-so-badge st-so-badge-critical">
                      <span class="st-so-dot bg-danger"></span>
                      CRITICALITY: CRITICAL
                    </span>
                  </div>
                </div>

                <div class="st-so-body">
                  <div class="st-so-summary">
                    <div>
                      <p class="st-so-meta-label">DATE RAISED</p>
                      <p class="st-so-meta-val">{{ formatDate(selectedSupportRequest?.requested_at) || '-' }}</p>
                    </div>
                    <div>
                      <p class="st-so-meta-label">ASSET</p>
                      <p class="st-so-meta-val">{{ selectedSupportRequest?.host_name || '-' }}</p>
                    </div>
                    <div>
                      <p class="st-so-meta-label">REQUESTED BY</p>
                      <div class="d-flex align-items-center gap-2">
                        <div class="st-so-avatar">{{ (selectedSupportRequest?.requested_by || 'U').charAt(0).toUpperCase() }}</div>
                        <p class="st-so-meta-val mb-0">{{ selectedSupportRequest?.requested_by || '-' }}</p>
                      </div>
                    </div>
                  </div>

                  <div class="st-so-section">
                    <h3 class="st-so-section-title">
                      <i class="bi bi-clock-history me-2"></i>Lifecycle Timeline
                    </h3>
                    <div class="st-so-timeline">
                      <div class="st-so-tl-line"></div>

                      <div class="st-so-tl-item">
                        <div class="st-so-tl-dot st-so-dot-done"><i class="bi bi-check-lg"></i></div>
                        <div class="st-so-tl-content">
                          <div class="d-flex justify-content-between">
                            <p class="st-so-tl-title">Ticket Raised</p>
                            <span class="st-so-tl-time">{{ formatDate(selectedSupportRequest?.requested_at) || '-' }}</span>
                          </div>
                          <p class="st-so-tl-desc">Support request submitted by {{ selectedSupportRequest?.requested_by || 'user' }}.</p>
                        </div>
                      </div>

                      <div class="st-so-tl-item">
                        <div class="st-so-tl-dot st-so-dot-done"><i class="bi bi-check-lg"></i></div>
                        <div class="st-so-tl-content">
                          <div class="d-flex justify-content-between">
                            <p class="st-so-tl-title">Acknowledged</p>
                            <span class="st-so-tl-time">Pending review</span>
                          </div>
                          <p class="st-so-tl-desc">Ticket assigned and under triage.</p>
                        </div>
                      </div>

                      <div class="st-so-tl-item">
                        <div class="st-so-tl-dot st-so-dot-eye"><img src="@/assets/images/3-removebg-preview.png" class="st-eye-img" alt="investigation" /></div>
                        <div class="st-so-tl-content st-so-tl-active-card">
                          <div class="d-flex justify-content-between">
                            <p class="st-so-tl-title">Investigation Started</p>
                            <span class="st-so-tl-time">In progress</span>
                          </div>
                          <p class="st-so-tl-desc-italic">"{{ selectedSupportRequest?.description || '-' }}"</p>
                          <span class="st-so-tl-author">— {{ (selectedSupportRequest?.requested_by || '').toUpperCase() }}</span>
                        </div>
                      </div>

                      <div class="st-so-tl-item">
                        <div class="st-so-tl-dot st-so-dot-comment"><i class="bi bi-chat-left-text"></i></div>
                        <div class="st-so-tl-content st-so-tl-comment-card">
                          <div class="d-flex justify-content-between">
                            <p class="st-so-tl-title">Steps Requested</p>
                            <span class="st-so-tl-time">Awaiting</span>
                          </div>
                          <p class="st-so-tl-desc">Steps: {{ selectedSupportRequest?.step_requested || '-' }}.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="st-so-footer">
                  <div class="st-so-textarea-wrap">
                    <textarea
                      v-model="slideOverNote"
                      class="st-so-textarea"
                      placeholder="Type your response or internal note..."
                      rows="3"
                    ></textarea>
                    <div class="st-so-textarea-actions">
                      <button class="st-so-icon-btn"><i class="bi bi-paperclip"></i></button>
                      <button class="st-so-icon-btn"><i class="bi bi-at"></i></button>
                    </div>
                  </div>
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div class="d-flex gap-3">
                      <button class="st-so-note-btn"><span class="st-so-dot-sm bg-success me-1"></span>Internal Note</button>
                      <button class="st-so-visible-btn"><i class="bi bi-globe2 me-1"></i>Customer Visible</button>
                    </div>
                    <button class="st-so-send-btn">Send Update <i class="bi bi-send ms-1"></i></button>
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
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
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
            selectedRequest: null,
            selectedSupportRequest: null,
            sortOrder: 'desc',
            activeTab: 'all',
            currentPage: 1,
            itemsPerPage: 5,
            showSlideOver: false,
            slideOverIndex: 0,
            slideOverNote: '',
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
            if (this.activeTab === 'all') return this.sortedRequests;
            return this.sortedRequests.filter((req) => {
                return req.status?.toLowerCase() === this.activeTab;
            });
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
        filteredRequests() {
            if (this.currentPage > this.totalPages && this.totalPages > 0) {
                this.currentPage = this.totalPages;
            } else if (!this.totalPages) {
                this.currentPage = 1;
            }
        },
    },
    async mounted() {
        await this.loadSupportRequests();
        this.initTooltips();
    },
    methods: {
        initTooltips() {
            this.$nextTick(() => {
                const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                [...tooltipEls].forEach((el) => new bootstrap.Tooltip(el));
            });
        },
        async loadSupportRequests() {
            await this.authStore.fetchUserVulnerabilityRegister();
            const reportId = this.authStore.userLatestReportId;
            if (!reportId) return;
            this.loading = true;
            const res = await this.authStore.fetchUserSupportRequestsByReport(reportId);
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
        viewRequest(req) {
            this.selectedRequest = req;
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('viewRequestsModal'));
                modal.show();
            });
        },
        openSlideOver(req, index) {
            if (!req) return;
            this.selectedSupportRequest = req;
            this.slideOverIndex = index;
            this.showSlideOver = true;
            this.slideOverNote = '';
        },
        closeSlideOver() {
            this.showSlideOver = false;
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
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

.st-tab-count {
  font-size: 0.7rem;
  font-weight: 700;
  background: #edeef1;
  color: #49454f;
  padding: 1px 6px;
  border-radius: 50px;
}

.st-tab-active {
  background: #e0f2f1 !important;
  color: #0f696e !important;
  border-color: #0f696e !important;
}

.st-tab-active .st-tab-count {
  background: #0f696e;
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

.st-view-btn {
  border: none;
  background: transparent;
  color: #0f696e;
  font-size: 0.82rem;
  font-weight: 700;
  padding: 0;
  display: inline-flex;
  align-items: center;
}

.st-view-btn:hover {
  opacity: 0.8;
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

.st-modal-content {
  border-radius: 16px;
  overflow: hidden;
  border: none;
}

.st-modal-header {
  background: #241447;
  padding: 16px 20px;
}

.st-modal-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.st-modal-section-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #49454f;
}

.st-step-chip {
  display: inline-flex;
  align-items: center;
  background: #f0ecff;
  color: #4e3e73;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 5px 12px;
}

.st-desc-textarea {
  width: 100%;
  border: 1px solid rgba(203, 196, 208, 0.4);
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.875rem;
  color: #191c1e;
  resize: none;
  background: #f8f9fc;
  outline: none;
}

.st-modal-footer {
  background: #f8f9fc;
  border-top: 1px solid rgba(203, 196, 208, 0.2);
  padding: 12px 20px;
}

.st-close-btn {
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 7px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.st-close-btn:hover {
  opacity: 0.88;
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

.st-slideover-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(36, 20, 71, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: flex-end;
}

.st-slideover {
  width: min(680px, 100vw);
  height: 100vh;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.st-so-header {
  padding: 28px 32px 24px;
  background: #f2f3f6;
  border-bottom: 1px solid rgba(203, 196, 208, 0.2);
  flex-shrink: 0;
}

.st-so-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #49454f;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.st-so-close-btn,
.st-so-icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #49454f;
  font-size: 1rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.st-so-close-btn:hover,
.st-so-icon-btn:hover {
  background: #e2e8f0;
}

.st-so-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #241447;
  margin: 0;
  line-height: 1.2;
}

.st-so-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.st-so-badge-open {
  background: #a1ecf2;
  color: #002022;
}

.st-so-badge-critical {
  background: #ffdad6;
  color: #ba1a1a;
}

.st-so-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.st-so-body {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
}

.st-so-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background: #f2f3f6;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 28px;
}

.st-so-meta-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: #49454f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0 0 4px;
}

.st-so-meta-val {
  font-size: 0.875rem;
  font-weight: 600;
  color: #241447;
  margin: 0;
}

.st-so-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #3a2a5e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
}

.st-so-section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #241447;
  margin: 0 0 20px;
  display: flex;
  align-items: center;
}

.st-so-timeline {
  position: relative;
  padding-left: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.st-so-tl-line {
  position: absolute;
  left: 11px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: rgba(203, 196, 208, 0.3);
}

.st-so-tl-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  position: relative;
}

.st-so-tl-dot {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  position: absolute;
  left: -32px;
  z-index: 1;
}

.st-so-dot-done {
  background: #0f696e;
  color: #fff;
}

.st-so-dot-active {
  background: #241447;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #241447;
  width: 24px;
  height: 24px;
  left: -32px;
  color: #fff;
}

.st-so-dot-eye {
  width: 30px;
  height: 30px;
  left: -35px;
  background: #ffffff;
  border: 3px solid #241447;
  color: #241447;
  box-shadow: 0 0 0 2px #ffffff;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.st-eye-img {
  width: 56px;
  height: 180px;
  padding-top: 10px;
  display: block;
  object-fit: contain;
}

.st-so-dot-comment {
  background: #e2e8f0;
  color: #49454f;
}

.st-so-tl-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #241447;
  margin: 0 0 4px;
}

.st-so-tl-time {
  font-size: 0.65rem;
  font-weight: 700;
  color: #49454f;
  white-space: nowrap;
}

.st-so-tl-desc {
  font-size: 0.82rem;
  color: #49454f;
  margin: 0;
  line-height: 1.5;
}

.st-so-tl-desc-italic {
  font-size: 0.82rem;
  color: #191c1e;
  font-style: italic;
  margin: 0 0 6px;
  line-height: 1.5;
}

.st-so-tl-author {
  font-size: 0.68rem;
  font-weight: 700;
  color: #0f696e;
  text-transform: uppercase;
}

.st-so-tl-active-card {
  background: #f2f3f6;
  border-radius: 8px;
  padding: 14px 16px;
}

.st-so-tl-comment-card {
  background: rgba(36, 20, 71, 0.03);
  border-left: 4px solid #0f696e;
  border-radius: 0 8px 8px 0;
  padding: 14px 16px;
}

.st-so-footer {
  padding: 20px 32px 24px;
  background: #ffffff;
  border-top: 1px solid rgba(203, 196, 208, 0.15);
  flex-shrink: 0;
}

.st-so-textarea-wrap {
  position: relative;
}

.st-so-textarea {
  width: 100%;
  background: #f2f3f6;
  border: none;
  border-radius: 12px;
  padding: 14px 50px 14px 16px;
  font-size: 0.875rem;
  color: #191c1e;
  resize: none;
  outline: none;
}

.st-so-textarea-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
}

.st-so-note-btn,
.st-so-visible-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 8px;
}

.st-so-note-btn {
  color: #49454f;
}

.st-so-visible-btn {
  color: #0f696e;
}

.st-so-dot-sm {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.st-so-send-btn {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 24px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
