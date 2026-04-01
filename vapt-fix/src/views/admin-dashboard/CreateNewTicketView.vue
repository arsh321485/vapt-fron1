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

                    <div class="col-11 pt-5 mt-2 pb-3 px-4">
                        <div class="row">
                            <div class="col-6 py-3">
                                <router-link to="/supportticket" class="text-decoration-none" tag="button"
                                    style="color: rgba(49, 33, 177, 1);"><i class="bi bi-arrow-left"></i>
                                    Back</router-link>
                                <h2 class="ticket-head mt-3">Create a new ticket</h2>
                                  <form>
                                    
                                    <label class="ps-1 mt-5 mb-2">Category</label>
                                    <select
                                      v-model="selectedCategory" :disabled="ticketData"
                                      class="form-select ps-3 py-2"
                                      
                                    >
                                      <option value="" disabled>Select a category...</option>
                                      <option value="bug">Report a bug</option>
                                      <option value="fix">Fix steps not working</option>
                                      <option value="other">Other</option>
                                    </select>
                                    <label class="ps-1 mt-4 mb-2">Asset</label>
                                    <input
                                      type="text"
                                      class="form-control py-2"
                                      v-model="selectedAsset"
                                      readonly
                                      style="background:#f6f6f6;border:none;border-radius:8px;"
                                    />
                                    <label class="ps-1 mt-4 mb-2">Subject</label>
                                    <input
                                      v-model="subject" :readonly="!!ticketData"
                                      type="text"
                                      class="form-control py-2"
                                      placeholder="Write a subject..."
                                      style="background:#f6f6f6;border:none;border-radius:8px;"
                                    />
                                    <label class="ps-1 mt-4 mb-2">Description</label>
                                    <textarea
                                      v-model="description" :readonly="!!ticketData"
                                      class="form-control py-2"
                                      rows="7"
                                      :placeholder="descriptionPlaceholder"
                                      style="background:#f6f6f6;border:none;border-radius:8px;"
                                    ></textarea>
                                  </form>
                                   
                                <button v-if="!ticketData" type="submit" class="btn btn-ticket py-2 px-5 mt-5" data-bs-toggle="modal" data-bs-target="#ticketModal"><i class="bi bi-plus-lg"></i> Create a new ticket</button>
                            </div>

                            <!-- Modal -->
                  <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content rounded-3">
                        <div class="modal-header">
                          <h5 class="modal-title fw-semibold" id="ticketModalLabel">Confirmation</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        
                        <div class="modal-body">
                          Please make sure you have followed all the recommendations on vulnerability card before submitting ticket.
                        </div>
                        
                        <div class="modal-footer">
                          <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                          <button type="button" class="btn btn-sm btn-primary" data-bs-dismiss="modal" @click="submitTicket">Submit</button>
                        </div>
                      </div>
                    </div>
                  </div>

                            <div class="col-4">
                                <!-- blank -->
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
.form-select {
  background-color: #f6f6f6 !important;
  border: none !important;
  border-radius: 8px !important;

  /* restore dropdown arrow */
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px 12px;
}
.ticket-head {
    color: rgba(0, 0, 0, 1);
    font-weight: 600;
    font-size: 36px;
}
.placeholder-style {
    color: rgba(0, 0, 0, 0.6);
  }

  .placeholder-style option:not([value=""]) {
    color: rgba(0, 0, 0, 1);
  }
  .btn-ticket {
      background-color: rgba(49, 33, 177, 1);
      color: #fff;
      border: none;
      border-radius: 50px;
    }
    .btn-ticket:hover{
      background-color: rgb(76, 57, 221);
      color: #fff;
    }
</style>