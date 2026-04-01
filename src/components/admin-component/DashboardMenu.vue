<template>
  <main>

    <div class="d-flex">
    <div class="sidebar d-flex flex-column align-items-center my-5 py-2">
      <!-- Navigation Icons -->
      <div class="flex-grow-1 d-flex flex-column align-items-center  text-center">
         <!-- HOME - Always allowed -->
         <div>
          <router-link to="/admindashboardonboarding">
          <button class="btn border-0" :class="{ activeBtn: isActive('/admindashboardonboarding') }"><i class="bi bi-house-door nav-menu"></i>
          <p class="menu-heading">Home</p></button>
          </router-link>
         </div>

         <!-- SCOPE - Always allowed -->
         <!-- <div>
          <router-link to="/scope">
          <button class="btn border-0" :class="{ activeBtn: isActive('/scope') }"><i class="bi bi-bullseye nav-menu"></i>
          <p class="menu-heading">Scope</p></button>
          </router-link>
         </div> -->

         <!-- TEAMS - Always allowed -->
         <div>
          <router-link to="/yourteam">
          <button class="btn border-0" :class="{ activeBtn: isActive('/yourteam') }">
          <i class="bi bi-people nav-menu"></i>
          <p class="menu-heading">Teams</p></button>
          </router-link>
        </div>

         <!-- REGISTER - Restricted during testing -->
         <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/vulnerabilityregister') }" @click="navigateTo('/vulnerabilityregister')">
          <i class="bi bi-list-ul nav-menu"></i>
          <p class="menu-heading">Register</p></button>
         </div>

         <!-- REPORT - Restricted during testing -->
         <!-- <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/report') }" @click="navigateTo('/report')">
          <i class="bi bi-file-earmark-text nav-menu"></i>
          <p class="menu-heading">Report</p></button>
         </div> -->

        <!-- ASSETS - Restricted during testing -->
        <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/assets') }" @click="navigateTo('/assets')">
          <i class="bi bi-laptop nav-menu"></i>
          <p class="menu-heading">Assets</p></button>
        </div>

        <!-- Performance Monitoring - Restricted during testing -->
        <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/performance-monitoring') }" @click="navigateTo('/performance-monitoring')">
          <i class="bi bi-graph-up-arrow nav-menu"></i>
          <p class="menu-heading">Performance Monitoring</p></button>
        </div>

        <!-- PENDING - Restricted during testing -->
        <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/pending') }" @click="navigateTo('/pending')">
          <i class="bi bi-dash-circle-dotted nav-menu"></i>
          <p class="menu-heading">Pending</p></button>
        </div>

         <!-- MITIGATION STRATEGY - Restricted during testing -->
         <!-- <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/mitigationstrategy') }" @click="navigateTo('/mitigationstrategy')">
           <i class="bi bi-diagram-3 nav-menu"></i>
          <p class="menu-heading">Mitigation Strategy</p>
          </button>
        </div> -->

         <!-- SUPPORT REQUESTS - Restricted during testing -->
         <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/supportrequests') }" @click="navigateTo('/supportrequests')">
          <i class="bi bi-exclamation-circle nav-menu"></i>
          <p class="menu-heading">Support Requests</p></button>
        </div>

        <!-- TICKETS - Restricted during testing -->
        <div>
          <button class="btn border-0" :class="{ activeBtn: isActive('/supportticket') }" @click="navigateToTickets()">
            <i class="bi bi-question-circle nav-menu"></i>
            <p class="menu-heading">Tickets</p>
          </button>
        </div>



      </div>

    </div>
    </div>

  </main>
</template>

<script>
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

export default {
  name: 'DashboardMenu',

  setup() {
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const isActive = (path) => route.path === path;

    return { route, router, authStore, isActive };
  },
  data() {
    return {
      activeReportId: localStorage.getItem("reportId") || ""
    };
  },
  computed: {
    // ✅ Reactive check using store state
    hasReport() {
      return this.authStore.reportStatus.hasReport;
    }
  },
  methods: {
    // ✅ Check if dashboard is blocked (no report uploaded)
    // Uses BOTH store state (reactive) AND localStorage (fallback)
    isDashboardBlocked() {
      // Primary check: use reactive store state
      if (this.authStore.reportStatus.checked) {
        return !this.authStore.reportStatus.hasReport;
      }
      // Fallback: check localStorage (for cases where store hasn't been checked yet)
      const reportId = localStorage.getItem("reportId");
      return !reportId;
    },

    // ✅ OLD: Check if testing is in progress (kept for backward compatibility)
    isTestingInProgress() {
      const isTesting = localStorage.getItem("testingInProgress") === "true";
      if (!isTesting) return false;

      // Check if 20 seconds have passed
      const startTime = Number(localStorage.getItem("testingStartTime"));
      const elapsed = Date.now() - startTime;

      if (elapsed >= 20000) {
        // Time elapsed, clear flags and allow navigation
        localStorage.removeItem("testingInProgress");
        localStorage.removeItem("testingStartTime");
        localStorage.removeItem("dashboardTestingInProgress");
        return false;
      }

      return true;
    },

    // ✅ Alert when no report uploaded
    showNoReportAlert() {
      // Get message from store if available
      const message = this.authStore.reportStatus.message ||
        "No report uploaded yet. Please wait for Super Admin to upload a report.";

      Swal.fire({
        title: "Please Wait",
        text: message,
        icon: "info",
        toast: true,
        position: "top-end",
        timer: 4000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: (toast) => {
          toast.style.marginTop = '70px';
          toast.style.zIndex = '999999';
          if (toast.parentElement) {
            toast.parentElement.style.zIndex = '999999';
          }
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style.zIndex = '999999';
          }
        }
      });
    },

    // ✅ OLD: Alert when testing in progress (kept for backward compatibility)
    showTestingAlert() {
      Swal.fire({
        title: "Testing in progress",
        text: "Please wait until testing completes",
        icon: "info",
        toast: true,
        position: "top-end",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: (toast) => {
          toast.style.marginTop = '70px';
          toast.style.zIndex = '999999';
          if (toast.parentElement) {
            toast.parentElement.style.zIndex = '999999';
          }
          const swalContainer = document.querySelector('.swal2-container');
          if (swalContainer) {
            swalContainer.style.zIndex = '999999';
          }
        }
      });
    },

    navigateTo(path) {
      // ✅ Check for no report first (uses reactive store state)
      if (this.isDashboardBlocked()) {
        this.showNoReportAlert();
        return;
      }
      // ✅ Then check for testing in progress (backward compatibility)
      if (this.isTestingInProgress()) {
        this.showTestingAlert();
        return;
      }
      this.router.push(path);
    },

    navigateToTickets() {
      // ✅ Check for no report first (uses reactive store state)
      if (this.isDashboardBlocked()) {
        this.showNoReportAlert();
        return;
      }
      // ✅ Then check for testing in progress (backward compatibility)
      if (this.isTestingInProgress()) {
        this.showTestingAlert();
        return;
      }
      // Get reportId from store or localStorage
      this.activeReportId = this.authStore.reportStatus.reportId || localStorage.getItem("reportId") || "";
      this.router.push({
        name: 'supportticket',
        params: { reportId: this.activeReportId }
      });
    }
  }

};
</script>
