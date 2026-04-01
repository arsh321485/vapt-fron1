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

            <!-- Page Header -->
            <div class="st-page-header">
              <div>
                <h2 class="st-title">Support Tickets</h2>
                <p class="st-subtitle">Track and manage all raised support requests</p>
              </div>
            </div>

            <!-- Filter Bar -->
            <div class="st-filter-bar">
              <div class="d-flex gap-2">
                <button class="st-tab-btn" :class="{ 'st-tab-active': activeTab === 'all' }" @click="activeTab = 'all'">
                  All
                  <span class="st-tab-count">{{ sortedTickets.length }}</span>
                </button>
                <button class="st-tab-btn st-tab-open" :class="{ 'st-tab-active-open': activeTab === 'open' }" @click="activeTab = 'open'">
                  Open
                  <span class="st-tab-count">{{ sortedTickets.filter(t => t.status?.toLowerCase() === 'open').length }}</span>
                </button>
                <button class="st-tab-btn st-tab-closed" :class="{ 'st-tab-active-closed': activeTab === 'closed' }" @click="activeTab = 'closed'">
                  Closed
                  <span class="st-tab-count">{{ sortedTickets.filter(t => t.status?.toLowerCase() === 'closed').length }}</span>
                </button>
              </div>
              <span class="st-count-badge">{{ filteredTickets.length }} tickets</span>
            </div>

            <!-- Table Card -->
            <div class="st-table-card">
              <div class="table-responsive">
                <table class="st-table">
                  <thead>
                    <tr>
                      <th class="st-th">#</th>
                      <th class="st-th">Vulnerability</th>
                      <th class="st-th">Asset</th>
                      <th class="st-th">Description</th>
                      <th class="st-th">Category</th>
                      <th class="st-th">Status</th>
                      <th class="st-th">Date Requested</th>
                      <th class="st-th"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ticket, i) in filteredTickets" :key="ticket._id" class="st-tr">
                      <td class="st-td st-td-num">{{ i + 1 }}</td>
                      <td class="st-td"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        :title="ticket.plugin_name"
                        style="cursor:pointer; max-width:200px;">
                        <span class="st-vuln-name text-truncate d-block">{{ ticket.plugin_name }}</span>
                      </td>
                      <td class="st-td">
                        <span class="st-asset-chip">{{ ticket.host_name }}</span>
                      </td>
                      <td class="st-td"
                        style="cursor:pointer; max-width:220px;"
                        :title="ticket.description"
                        data-bs-toggle="modal"
                        data-bs-target="#viewRequestsModal"
                        @click="openTicketModal(ticket)">
                        <span class="st-desc-text text-truncate d-block">{{ ticket.description }}</span>
                        <i class="bi bi-box-arrow-up-right st-expand-icon ms-1"></i>
                      </td>
                      <td class="st-td">
                        <span class="st-category-tag">{{ ticket.category }}</span>
                      </td>
                      <td class="st-td">
                        <span class="st-status-badge" :class="ticket.status?.toLowerCase() === 'open' ? 'st-status-open' : 'st-status-closed'">
                          <span class="st-status-dot"></span>
                          {{ ticket.status }}
                        </span>
                      </td>
                      <td class="st-td st-td-date">{{ new Date(ticket.created_at).toLocaleDateString() }}</td>
                      <td class="st-td"></td>
                    </tr>
                    <tr v-if="!filteredTickets.length">
                      <td colspan="8" class="st-empty-row">
                        <i class="bi bi-inbox st-empty-icon"></i>
                        <p class="mb-0">No tickets found</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Description Modal -->
            <div class="modal fade" id="viewRequestsModal" tabindex="-1">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content st-modal-content">
                  <div class="modal-header st-modal-header">
                    <h5 class="modal-title st-modal-title">Issues Raised for Support Ticket</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body p-4">
                    <h6 class="st-modal-section-label">Description</h6>
                    <textarea class="st-desc-textarea" rows="5" readonly>{{ selectedDescription }}</textarea>
                  </div>
                  <div class="modal-footer st-modal-footer">
                    <button type="button" class="st-close-btn" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Chat Box (preserved) -->
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
  name: 'SupportTicketView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      authStore: useAuthStore(),
      tickets: [],
      activeTab: "all",
      selectedDescription: "",
      showChat: false,
      minimized: false,
      newMessage: "",
      messages: [
        { text: "Hi, can you explain the vulnerability?", sender: "bot", deletable: false, time: "10:30 AM" },
        { text: "Sure, this is related to Spring framework.", sender: "user", deletable: true, time: "10:35 AM" },
      ],
      showBox: false,
    };
  },
  computed: {
    sortedTickets() {
      const sorted = [...this.tickets];
      sorted.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
      });
      return sorted;
    },
    filteredTickets() {
      if (this.activeTab === "all") return this.sortedTickets;
      return this.sortedTickets.filter(
        t => t.status?.toLowerCase() === this.activeTab.toLowerCase()
      );
    }
  },
  methods: {
    getShortDescription(desc) {
      if (!desc) return "";
      const words = desc.split(" ");
      return words.length > 4 ? words.slice(0, 4).join(" ") + "..." : desc;
    },
    async loadAllTickets() {
      if (!this.authStore.latestReportId) {
        await this.authStore.fetchVulnerabilityRegister();
      }
      const reportId = this.authStore.latestReportId || localStorage.getItem("reportId");
      if (!reportId) {
        console.warn("⚠️ No reportId found");
        return;
      }
      const res = await this.authStore.getTicketsByReport(reportId);
      if (res.status) {
        this.tickets = res.data;
      } else {
        this.tickets = [];
      }
      this.$nextTick(() => {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => new bootstrap.Tooltip(el));
      });
    },
    openTicketModal(ticket) {
      this.selectedDescription = ticket.description || "";
    },
    toggleChat() {
      console.log("🔥 toggleChat clicked");
      this.showChat = !this.showChat;
      this.$nextTick(() => {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        [...popoverTriggerList].map(el => {
          new bootstrap.Popover(el, {
            container: 'body',
            html: true,
            placement: 'right'
          });
        });
      });
    },
    closeChat() {
      this.showChat = false;
    },
    minimizeChat() {
      this.minimized = !this.minimized;
    },
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          text: this.newMessage,
          sender: "user",
          deletable: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        this.newMessage = "";
      }
    },
    deleteMessage(index) {
      this.messages.splice(index, 1);
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.messages.push({
          text: `${file.name}`,
          sender: "user",
          deletable: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    },
  },
  mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map(el => new bootstrap.Tooltip(el));
    console.log("🎫 SupportTicketView mounted");
    this.loadAllTickets();
  }
};
</script>

<style scoped>
.st-content {
  padding: 0;
}

/* Page Header */
.st-page-header {
  padding: 70px 32px 0;
  background: #f8f9fc;
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

/* Filter / Tab Bar */
.st-filter-bar {
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
.st-tab-btn:hover { background: #edeef1; }

.st-tab-count {
  font-size: 0.7rem;
  font-weight: 700;
  background: #edeef1;
  color: #49454f;
  padding: 1px 6px;
  border-radius: 50px;
}

/* Active states */
.st-tab-active {
  background: #e0f2f1 !important;
  color: #0f696e !important;
  border-color: #0f696e !important;
}
.st-tab-active .st-tab-count { background: #0f696e; color: white; }

.st-tab-active-open {
  background: #fdeaea !important;
  color: #ba1a1a !important;
  border-color: #ba1a1a !important;
}
.st-tab-active-open .st-tab-count { background: #ba1a1a; color: white; }

.st-tab-active-closed {
  background: #dcfce7 !important;
  color: #166534 !important;
  border-color: #16a34a !important;
}
.st-tab-active-closed .st-tab-count { background: #16a34a; color: white; }

.st-count-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: #49454f;
  background: #edeef1;
  padding: 3px 10px;
  border-radius: 50px;
}

/* Table Card */
.st-table-card {
  margin: 0 32px 32px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
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
.st-tr:last-child { border-bottom: none; }
.st-tr:hover { background: #f8f9fc; }

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

.st-td-date {
  font-size: 0.82rem;
  color: #64748b;
  white-space: nowrap;
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

.st-category-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4e3e73;
  background: #f0ecff;
  padding: 3px 10px;
  border-radius: 50px;
}

/* Status badges */
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
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #ba1a1a;
  flex-shrink: 0;
}
.st-status-closed {
  background: #dcfce7;
  color: #166534;
}
.st-status-closed .st-status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #16a34a;
  flex-shrink: 0;
}

/* Empty state */
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

/* Modal */
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
  color: white;
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
  margin-bottom: 8px;
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
  color: white;
  border: none;
  border-radius: 8px;
  padding: 7px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.st-close-btn:hover { opacity: 0.88; }

/* Chat Box (preserved styles) */
.hover-box {
  position: absolute;
  top: 40px;
  right: -50px;
  width: 400px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}
.asset-card {
  background: #ccebe7;
  border: 1px solid #97dfd5;
  border-radius: 8px;
}
.chat-box {
  border-radius: 12px;
  display: flex;
  height: 90vh;
  max-width: 900px;
  top: 54%;
  left: 68%;
  transform: translate(-50%, -50%);
  position: fixed;
  overflow: visible !important;
}
.chat-middle {
  flex: 3;
  display: flex;
  flex-direction: column;
  background: #f7f7f7;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
}
.chat-right {
  flex: 1.5;
  background: #f7f7f7;
  border-left: 1px solid #e0e0e0;
  border-top-right-radius: 12px;
  border-bottom-right-radius: 12px;
  padding: 1.5rem;
}
.chat-header {
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top-left-radius: 12px;
}
.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  background: #f7f7f7;
}
.chat-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.4;
  word-wrap: break-word;
}
.user-bubble {
  background: #e9e9f9;
  color: #333;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}
.bot-bubble {
  background: #fff;
  border: 1px solid #e0e0e0;
  margin-right: auto;
  border-bottom-left-radius: 4px;
}
.chat-time {
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.25rem;
  text-align: right;
}
.chat-input {
  background: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 1rem 1.5rem;
  border-bottom-left-radius: 12px;
}
.chat-input .form-control {
  background: #f7f7f7;
  border-radius: 25px;
  border: 1px solid #e0e0e0;
  padding: 0.75rem 1.5rem;
}
.issue {
  background: #ccebe7;
  border: 1px solid #97dfd5;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
.right-section-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
}
</style>
