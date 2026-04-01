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

          <div class="col-11 ct-content">

            <!-- Page Header -->
            <div class="ct-page-header">
              <router-link to="/supportticket" class="ct-back-link">
                <i class="bi bi-arrow-left me-1"></i>Back
              </router-link>
              <h2 class="ct-title mt-2">Create a new ticket</h2>
              <p class="ct-subtitle">Submit a ticket for the selected vulnerability</p>
            </div>

            <!-- Form Card -->
            <div class="ct-card">
              <div v-if="loading" class="text-center text-muted py-5">Loading ticket...</div>
              <form v-else>

                <!-- Category -->
                <div class="ct-field-group">
                  <label class="ct-label">Category</label>
                  <select v-model="selectedCategory" :disabled="!!ticketData" class="ct-select">
                    <option value="" disabled>Select a category...</option>
                    <option value="bug">Report a bug</option>
                    <option value="fix">Fix steps not working</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <!-- Asset -->
                <div class="ct-field-group">
                  <label class="ct-label">Asset</label>
                  <input
                    type="text"
                    class="ct-input"
                    v-model="selectedAsset"
                    readonly
                  />
                </div>

                <!-- Subject -->
                <div class="ct-field-group">
                  <label class="ct-label">Subject</label>
                  <input
                    v-model="subject"
                    :readonly="!!ticketData"
                    type="text"
                    class="ct-input"
                    placeholder="Write a subject..."
                  />
                </div>

                <!-- Description -->
                <div class="ct-field-group">
                  <label class="ct-label">Description</label>
                  <textarea
                    v-model="description"
                    :readonly="!!ticketData"
                    class="ct-textarea"
                    rows="7"
                    :placeholder="descriptionPlaceholder"
                  ></textarea>
                </div>

                <!-- View-only badge -->
                <div v-if="ticketData" class="ct-readonly-notice">
                  <i class="bi bi-lock-fill me-2"></i>This ticket is in view-only mode
                </div>

                <!-- Submit button -->
                <div v-if="!ticketData" class="d-flex justify-content-end mt-4">
                  <button
                    type="button"
                    class="ct-btn-submit"
                    data-bs-toggle="modal"
                    data-bs-target="#ticketModal"
                  >
                    <i class="bi bi-plus-lg me-2"></i>Create a new ticket
                  </button>
                </div>

              </form>
            </div>

            <!-- Confirmation Modal -->
            <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content ct-modal-content">
                  <div class="modal-header ct-modal-header">
                    <h5 class="modal-title ct-modal-title" id="ticketModalLabel">
                      <i class="bi bi-ticket-perforated me-2"></i>Confirm Ticket
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body ct-modal-body">
                    <p class="ct-modal-text">
                      Please make sure you have followed all the recommendations on the vulnerability card before submitting this ticket.
                    </p>
                  </div>
                  <div class="modal-footer ct-modal-footer">
                    <button type="button" class="ct-btn-cancel" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="ct-btn-submit-sm" data-bs-dismiss="modal" @click="submitTicket">Submit</button>
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
import Swal from "sweetalert2";

export default {
    name: 'CreateNewTicketView',
    components: {
        DashboardMenu,
        DashboardHeader
    },
    data() {
    return {
      selectedCategory: "",
      selectedAsset: "",
      subject: "",
      description: "",
      adminId: "",
      reportId: "",
      fixVulnerabilityId: "",
      ticketId: "",
      ticketData: null,
      loading: false,
    };
  },
  watch: {
  '$route': {
    handler() {
      this.loadPage();
    }
  }
},

mounted() {
  console.log("CreateTicket component mounted");
  this.loadPage();
},
  computed: {
    descriptionPlaceholder() {
      if (this.selectedCategory === "fix") {
        return "Please make sure you have followed our steps. What issue are you facing?";
      }
      return "Write your description here";
    },
  },
  methods: {
    loadPage() {
      const route = this.$route;

      this.reportId = route.params.reportId || "";
      this.fixVulnerabilityId = route.params.fixVulId || "";
      this.ticketId = route.params.ticketId || "";
      this.selectedAsset = route.params.asset
        ? decodeURIComponent(route.params.asset)
        : "";

      console.log("loadPage called");
      console.log("reportId:", this.reportId);
      console.log("fixVulnerabilityId:", this.fixVulnerabilityId);
      console.log("ticketId:", this.ticketId);
      console.log("asset:", this.selectedAsset);

      if (this.ticketId && this.fixVulnerabilityId) {
        // ticketId in URL → fetch ticket via GET API
        this.fetchTicket();
      } else if (this.reportId && this.fixVulnerabilityId) {
        // No ticketId → check if ticket already exists via CREATE API
        this.ticketData = null;
        this.selectedCategory = "";
        this.subject = "";
        this.description = "";
        this.checkExistingTicket();
      } else {
        // No params — empty form
        this.ticketData = null;
        this.selectedCategory = "";
        this.subject = "";
        this.description = "";
      }
    },

    async checkExistingTicket() {
      const authStore = useAuthStore();

      console.log("=== checkExistingTicket ===");
      console.log("reportId:", this.reportId);
      console.log("fixVulnerabilityId:", this.fixVulnerabilityId);
      console.log("asset:", this.selectedAsset);

      const res = await authStore.getOpenTickets(this.reportId);

      if (res.status && res.data?.length) {
        // 1) Try exact match by fix_vulnerability_id
        let existingTicket = res.data.find(
          t => t.fix_vulnerability_id === this.fixVulnerabilityId
        );

        // 2) Fallback: match by host_name (same asset/IP)
        if (!existingTicket && this.selectedAsset) {
          existingTicket = res.data.find(
            t => t.host_name === this.selectedAsset
          );
          if (existingTicket) {
            console.log("Matched ticket by host_name fallback:", existingTicket._id);
          }
        }

        if (existingTicket) {
          console.log("Ticket found:", existingTicket._id);
          this.ticketId = existingTicket._id || existingTicket.id;
          // Use the ticket's own fix_vulnerability_id for GET API
          this.fixVulnerabilityId = existingTicket.fix_vulnerability_id;
          this.fetchTicket();
          return;
        }
      }

      console.log("No existing ticket, showing empty form");
      this.ticketData = null;
    },

   async fetchTicket() {

  if (!this.ticketId || !this.fixVulnerabilityId) {
    console.log("Missing ids", this.ticketId, this.fixVulnerabilityId);
    return;
  }

  console.log("GET ticket API calling...");
  console.log("Fix ID:", this.fixVulnerabilityId);
  console.log("Ticket ID:", this.ticketId);

  this.loading = true;

  const authStore = useAuthStore();

  const res = await authStore.getTicketById(
    this.fixVulnerabilityId,
    this.ticketId
  );

  this.loading = false;

  if (res.status && res.data) {
    console.log("Ticket loaded:", res.data);

    this.ticketData = res.data;
    // fill form
    this.selectedCategory = res.data.category;
    this.selectedAsset = res.data.host_name;
    this.subject = res.data.subject;
    this.description = res.data.description;

  } else {
    console.warn("Ticket fetch failed:", res);
    this.ticketData = null;
  }
},

    async submitTicket() {

  if (!this.selectedCategory || !this.subject || !this.description) {
    Swal.fire({
      icon: "warning",
      title: "Please fill all required fields",
      timer: 2500,
      showConfirmButton: false
    });
    return;
  }

  const authStore = useAuthStore();

  const payload = {
    category: this.selectedCategory,
    subject: this.subject,
    description: this.description
  };

  const res = await authStore.createTicket(
    this.reportId,
    this.fixVulnerabilityId,
    payload
  );

  if (res.status) {

    Swal.fire({
      icon: "success",
      title: "Ticket Created Successfully",
      timer: 2000,
      showConfirmButton: false
    });

    // redirect to same page with ticketId (view mode)
    const newTicketId = res.data?._id || res.data?.id;
    console.log("Redirecting after create:", newTicketId);

    if (newTicketId) {
      this.$router.replace({
        name: "CreateTicket",
        params: {
          reportId: this.reportId,
          fixVulId: this.fixVulnerabilityId,
          asset: encodeURIComponent(this.selectedAsset),
          ticketId: newTicketId
        },
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: res.message,
      timer: 3000,
      showConfirmButton: false
    });
  }
    },
  },
};
</script>

<style scoped>
.ct-content {
  padding: 0;
}

/* Page Header */
.ct-page-header {
  padding: 70px 40px 24px;
  background: #f8f9fc;
}

.ct-back-link {
  color: #0f696e;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: opacity 0.15s;
}
.ct-back-link:hover { opacity: 0.75; color: #0f696e; }

.ct-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 4px;
}

.ct-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* Form Card */
.ct-card {
  margin: 0 40px 40px;
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
  max-width: 680px;
}

/* Field group */
.ct-field-group {
  margin-bottom: 22px;
}

.ct-label {
  display: block;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 7px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ct-input,
.ct-select,
.ct-textarea {
  width: 100%;
  background: #f8f9fc;
  border: 1.5px solid #e8ecf0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.9rem;
  color: #1e293b;
  transition: border-color 0.15s, box-shadow 0.15s;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.ct-select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
  padding-right: 2.5rem;
}

.ct-input:focus,
.ct-select:focus,
.ct-textarea:focus {
  border-color: #0f696e;
  box-shadow: 0 0 0 3px rgba(15,105,110,0.1);
  background: white;
}

.ct-input[readonly],
.ct-select:disabled,
.ct-textarea[readonly] {
  background: #f1f5f9;
  color: #64748b;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

.ct-textarea {
  resize: vertical;
  min-height: 160px;
}

/* Readonly notice */
.ct-readonly-notice {
  display: flex;
  align-items: center;
  background: #f0ecff;
  color: #241447;
  font-size: 0.82rem;
  font-weight: 600;
  padding: 10px 14px;
  border-radius: 8px;
  margin-top: 8px;
}

/* Buttons */
.ct-btn-submit {
  background: #241447;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 28px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s, transform 0.1s;
}
.ct-btn-submit:hover { background: #1a0f35; }
.ct-btn-submit:active { transform: scale(0.97); }

/* Modal */
.ct-modal-content {
  border-radius: 14px;
  overflow: hidden;
  border: none;
}

.ct-modal-header {
  background: #241447;
  border-bottom: none;
  padding: 18px 24px;
}

.ct-modal-title {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
}

.ct-modal-body {
  padding: 24px;
}

.ct-modal-text {
  font-size: 0.9rem;
  color: #475569;
  margin: 0;
  line-height: 1.6;
}

.ct-modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.ct-btn-cancel {
  background: white;
  border: 1.5px solid #e2e8f0;
  color: #475569;
  border-radius: 8px;
  padding: 8px 20px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.ct-btn-cancel:hover { background: #f8fafc; }

.ct-btn-submit-sm {
  background: #241447;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 22px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;
}
.ct-btn-submit-sm:hover { background: #1a0f35; }
</style>
