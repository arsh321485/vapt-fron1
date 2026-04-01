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

          <div class="col-11 pv-content">
            <!-- Page Header -->
            <div class="pv-page-header">
              <div>
                <h2 class="pv-title">Pending</h2>
                <p class="pv-subtitle">Open support tickets awaiting resolution</p>
              </div>
            </div>

            <!-- Filter Bar -->
            <div class="pv-filter-bar">
              <div class="d-flex align-items-center gap-3">
                <i class="bi bi-funnel pv-filter-icon"></i>
                <span class="pv-filter-label">Filter by team:</span>
                <select v-model="selectedRole" class="pv-role-select">
                  <option value="all">All Roles</option>
                  <option value="Patch Management">Patch Management</option>
                  <option value="Configuration Management">Configuration Management</option>
                  <option value="Network Security">Network Security</option>
                  <option value="Architectural Flaws">Architectural Flaws</option>
                </select>
              </div>
              <span class="pv-count-badge">{{ filteredTickets.length }} tickets</span>
            </div>

            <!-- Table Card -->
            <div class="pv-table-card">
              <div class="table-responsive">
                <table class="pv-table">
                  <thead>
                    <tr>
                      <th class="pv-th">#</th>
                      <th class="pv-th">Vulnerability</th>
                      <th class="pv-th">Asset</th>
                      <th class="pv-th">Description</th>
                      <th class="pv-th">Category</th>
                      <th class="pv-th">Status</th>
                      <th class="pv-th">Date Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ticket, index) in filteredTickets" :key="ticket._id" class="pv-tr">
                      <td class="pv-td pv-td-num">{{ index + 1 }}</td>
                      <td class="pv-td"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        :title="ticket.plugin_name"
                        style="cursor:pointer;">
                        <span class="pv-vuln-name">{{ getShortText(ticket.plugin_name, 4) }}</span>
                      </td>
                      <td class="pv-td">
                        <span class="pv-asset-chip">{{ ticket.host_name }}</span>
                      </td>
                      <td class="pv-td"
                        style="cursor:pointer;"
                        data-bs-toggle="modal"
                        data-bs-target="#viewRequestsModal"
                        @click="openDescriptionModal(ticket.description)">
                        <span class="pv-desc-text">{{ getShortDesc(ticket.description) }}</span>
                        <i class="bi bi-box-arrow-up-right pv-expand-icon ms-1"></i>
                      </td>
                      <td class="pv-td">
                        <span class="pv-category-tag">{{ ticket.category }}</span>
                      </td>
                      <td class="pv-td">
                        <span class="pv-status-badge" :class="ticket.status === 'open' ? 'pv-status-open' : 'pv-status-closed'">
                          <span class="pv-status-dot"></span>
                          {{ ticket.status }}
                        </span>
                      </td>
                      <td class="pv-td pv-td-date">{{ new Date(ticket.created_at).toLocaleDateString() }}</td>
                    </tr>
                    <tr v-if="!filteredTickets.length">
                      <td colspan="7" class="pv-empty-row">
                        <i class="bi bi-inbox pv-empty-icon"></i>
                        <p class="mb-0">No tickets found for <strong>{{ selectedRole === 'all' ? 'any role' : selectedRole }}</strong></p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Description Modal -->
            <div class="modal fade" id="viewRequestsModal" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content pv-modal-content">
                  <div class="modal-header pv-modal-header">
                    <h5 class="modal-title pv-modal-title">Ticket Description</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body p-4">
                    <h6 class="pv-modal-section-label">Description</h6>
                    <textarea v-model="selectedDescription" class="pv-desc-textarea" rows="5" readonly></textarea>
                  </div>
                  <div class="modal-footer pv-modal-footer">
                    <button type="button" class="pv-close-btn" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Box (preserved as-is) -->
            <div v-if="showChat" class="chat-box">
              <div class="chat-middle">
                <div class="chat-header d-flex justify-content-between align-items-center px-4 py-3">
                  <div class="d-flex flex-row">
                    <h6 class="mb-0 fw-semibold">VMware ESXi 7.0/8.0 Sandbox Escape (CVE - 2025-22225)</h6>
                    <div class="position-relative d-inline-block">
                      <i class="bi bi-question-circle" @mouseenter="showBox = true" @mouseleave="showBox = false" style="cursor: pointer; font-size: 18px;"></i>
                      <div v-if="showBox" class="hover-box p-3">
                        <h6 class="text-center fw-semibold mb-3" style="color: #241447;">VMware ESXi 7.0/8.0 Sandbox Escape (CVE - 2025-22225)</h6>
                        <div class="d-flex justify-content-between mb-3">
                          <div class="text-center flex-fill pe-2">
                            <p class="mb-1 fw-semibold text-secondary" style="font-size: 14px;">Asset:</p>
                            <p class="mb-0" style="font-size: 14px;">192.68.1.42</p>
                          </div>
                          <div class="text-center flex-fill ps-2">
                            <p class="mb-1 fw-semibold text-secondary" style="font-size: 14px;">CVSS Score:</p>
                            <p class="mb-0" style="font-size: 14px;">8.1</p>
                          </div>
                        </div>
                        <div class="asset-card p-2 mb-3">
                          <p class="mb-1" style="font-size: 14px;"><strong><i class="bi bi-check-circle-fill text-success me-1"></i> Vendor Fix Available: </strong>Yes</p>
                        </div>
                        <div class="asset-card p-2 mb-3">
                          <p class="mb-1" style="font-size: 14px;"><i class="bi bi-check-circle-fill text-success me-1"></i> <strong>Hostname: </strong>fra-sto-shr-uat-lda9-evt-mgr-dbmigration</p>
                        </div>
                        <div class="card border rounded p-2" style="background: #e0f7f4; border-color: #97dfd5;">
                          <h6 class="fw-semibold text-center mb-2">Description</h6>
                          <p class="small text-muted mb-0 text-center">Applications that use UriComponentsBuilder in Spring Framework to parse an externally provided URL (e.g. through a query parameter) AND perform validation checks on the host of the parsed URL may be vulnerable.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-end gap-2" style="margin-top: -10px;">
                    <button class="btn btn-sm text-dark border-0" @click="closeChat"><i class="bi bi-x-lg fs-5"></i></button>
                  </div>
                </div>
                <div class="chat-messages flex-grow-1">
                  <p class="text-center"><small class="text-muted">Today 10:30 AM</small></p>
                  <div v-for="(msg, index) in messages" :key="index" :class="['chat-bubble', msg.sender === 'user' ? 'user-bubble ms-auto' : 'bot-bubble']">
                    <span>{{ msg.text }}</span>
                    <div class="chat-time">{{ msg.time }}</div>
                  </div>
                </div>
                <div class="chat-input d-flex align-items-center gap-2 p-3">
                  <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
                  <button class="btn btn-light rounded-circle" @click="$refs.fileInput.click()"><i class="bi bi-paperclip"></i></button>
                  <input v-model="newMessage" type="text" class="form-control rounded-pill" placeholder="Type a message" @keydown.enter.exact.prevent="sendMessage" />
                </div>
                <div class="text-end me-3 mb-3">
                  <button class="btn text-light" @click="sendMessage" style="background-color:#241447;">
                    <i class="bi bi-send-fill"></i> Send Message
                  </button>
                </div>
              </div>
              <div class="chat-right">
                <div class="text-center mb-4">
                  <img src="@/assets/images/smaller-logo.png" alt="" class="mt-2" />
                  <div class="d-flex justify-content-end me-4">
                    <div class="avatar-container">
                      <div class="avatar ava-green" ref="germany">PM</div>
                    </div>
                  </div>
                </div>
                <div class="text-center mt-4">
                  <div class="d-flex justify-content-between small text-dark">
                    <span><strong class="text-secondary">Asset:</strong> 192.68.1.42</span>
                    <span><strong class="text-secondary">Date requested:</strong> 23/06/25</span>
                  </div>
                </div>
                <div class="issue text-center mt-5 mb-4">
                  <i class="bi bi-exclamation-circle text-success me-2"></i>
                  <span class="text-success fw-semibold">Issues Raised for Support</span>
                  <button class="btn btn-primary btn-sm rounded-pill my-2">Step 2:Code review</button>
                  <button class="btn btn-primary btn-sm rounded-pill">Step 2:Code review</button>
                </div>
                <div class="right-section-item text-center">
                  <h6 class="fw-semibold mb-2">Issue Description</h6>
                  <p class="small text-muted mb-1">The issue has been reviewed, but the current explanation is not sufficient. Please provide additional justification to proceed further.</p>
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
  name: 'PendingView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      authStore: useAuthStore(),
      tickets: [],
      selectedDescription: "",
      reportId: "",
      selectedRole: "all"
    };
  },
  computed: {
    filteredTickets() {
      if (this.selectedRole === "all") {
        return this.tickets;
      }
      return this.tickets.filter(ticket =>
        ticket.assigned_team?.toLowerCase() === this.selectedRole.toLowerCase()
      );
    }
  },
  watch: {
    'authStore.latestReportId': {
      immediate: true,
      handler(val) {
        if (val) {
          this.reportId = val;
          this.loadOpenTickets();
        }
      }
    }
  },
  methods: {
    getShortText(text, limit = 4) {
      if (!text) return "";
      const words = text.split(" ");
      if (words.length <= limit) return text;
      return words.slice(0, limit).join(" ") + " ...";
    },
    getShortDesc(text) {
      if (!text) return "";
      const words = text.split(" ");
      if (words.length <= 4) return text;
      return words.slice(0, 4).join(" ") + " ...";
    },
    openDescriptionModal(desc) {
      this.selectedDescription = desc;
    },
    async loadOpenTickets() {
      if (!this.reportId) {
        console.warn("No reportId found");
        return;
      }
      const res = await this.authStore.getOpenTickets(this.reportId, true);
      if (res.status) {
        this.tickets = res.data;
        console.log("✅ Open tickets loaded:", this.tickets);
      } else {
        console.error("❌ Failed:", res.message);
      }
    }
  },
  async mounted() {
    this.$nextTick(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    });

    await this.authStore.fetchVulnerabilityRegister();
    this.reportId = this.authStore.latestReportId;

    if (this.reportId) {
      await this.loadOpenTickets();
    } else {
      console.warn("❌ reportId still missing. Tickets not loaded.");
    }

    this.$nextTick(() => {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    });
  },
};
</script>

<style scoped>
.pv-content {
  padding: 0;
}

/* Page Header */
.pv-page-header {
  padding: 28px 32px 0;
  background: #f8f9fc;
  padding-top: 70px;
}

.pv-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 4px;
}

.pv-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Filter Bar */
.pv-filter-bar {
  margin: 20px 32px;
  background: white;
  border-radius: 12px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  border: 1px solid rgba(203, 196, 208, 0.2);
}

.pv-filter-icon {
  color: #0f696e;
  font-size: 1rem;
}

.pv-filter-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #49454f;
}

.pv-role-select {
  border: 1px solid rgba(203, 196, 208, 0.5);
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 0.85rem;
  color: #241447;
  font-weight: 500;
  background: #f8f9fc;
  outline: none;
  cursor: pointer;
}
.pv-role-select:focus {
  box-shadow: 0 0 0 2px rgba(15, 105, 110, 0.2);
  border-color: #0f696e;
}

.pv-count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #49454f;
  background: #edeef1;
  padding: 3px 10px;
  border-radius: 50px;
}

/* Table Card */
.pv-table-card {
  margin: 0 32px 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid rgba(203, 196, 208, 0.2);
  overflow: hidden;
}

.pv-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.pv-th {
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

.pv-tr {
  border-bottom: 1px solid rgba(203, 196, 208, 0.15);
  transition: background 0.12s;
}
.pv-tr:last-child { border-bottom: none; }
.pv-tr:hover { background: #f8f9fc; }

.pv-td {
  padding: 14px 16px;
  color: #191c1e;
  vertical-align: middle;
}

.pv-td-num {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 600;
  width: 48px;
}

.pv-td-date {
  font-size: 0.82rem;
  color: #64748b;
  white-space: nowrap;
}

.pv-vuln-name {
  font-weight: 600;
  color: #241447;
}

.pv-asset-chip {
  display: inline-block;
  background: #edeef1;
  color: #241447;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
}

.pv-desc-text {
  color: #49454f;
  font-size: 0.85rem;
}

.pv-expand-icon {
  font-size: 0.7rem;
  color: #0f696e;
  opacity: 0.7;
}

.pv-category-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4e3e73;
  background: #f0ecff;
  padding: 3px 10px;
  border-radius: 50px;
}

/* Status badges */
.pv-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 50px;
  text-transform: capitalize;
}

.pv-status-open {
  background: #fdeaea;
  color: #ba1a1a;
}
.pv-status-open .pv-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ba1a1a;
  flex-shrink: 0;
}

.pv-status-closed {
  background: #dcfce7;
  color: #166534;
}
.pv-status-closed .pv-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}

/* Empty state */
.pv-empty-row {
  padding: 48px 16px;
  text-align: center;
  color: #64748b;
}

.pv-empty-icon {
  font-size: 2rem;
  color: #cbd5e1;
  display: block;
  margin-bottom: 8px;
}

/* Modal */
.pv-modal-content {
  border-radius: 16px;
  overflow: hidden;
  border: none;
}

.pv-modal-header {
  background: #241447;
  padding: 16px 20px;
}

.pv-modal-title {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
}

.pv-modal-section-label {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #49454f;
  margin-bottom: 8px;
}

.pv-desc-textarea {
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

.pv-modal-footer {
  background: #f8f9fc;
  border-top: 1px solid rgba(203, 196, 208, 0.2);
  padding: 12px 20px;
}

.pv-close-btn {
  background: #241447;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.pv-close-btn:hover { opacity: 0.88; }
</style>
