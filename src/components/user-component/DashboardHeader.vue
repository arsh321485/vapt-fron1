<template>
  <main>
  <div class="row fixed-browser-bar pe-0 me-0 gx-0">
     <div class="col-12 pe-0">
  <div class="d-flex align-items-center justify-content-between gap-4 py-2 px-4">

      <div class="browser-bar">
        <router-link to="/userdashboard">
          <img src="@/assets/images/vaptfix_white.png" alt="VaptFix">
        </router-link>
      </div>

    <!-- Right Section -->
    <div class="d-flex align-items-center gap-2">
      <router-link
        to="/userdashboard"
        class="header-team-badge"
        :title="selectedTeamLabel + ' — change team on Home'"
      >
        <i class="bi bi-people"></i>
        <span class="header-team-badge-label">{{ selectedTeamLabel }}</span>
      </router-link>
      <NotificationPanel recipient-type="user" />
    <div class="position-relative d-inline-block">
      <div
        class="circle-bottom d-flex align-items-center justify-content-center fw-bold"
        style="cursor:pointer;"
        @click="toggleDropdown"
      >
        <!-- A -->
         {{ userInitial }}
      </div>

      <!-- Dropdown -->
      <div
        v-if="showDropdown"
        class="dropdown-box shadow-lg p-3 rounded"
      >
        <!-- Email -->
        <div class="mb-2 text-muted text-center">
          {{ userEmail }}
        </div>

        <router-link
          :to="{ path: '/user-manage-account', query: { returnTo: $route.fullPath } }"
          class="btn btn-sm btn-outline-secondary w-100 mb-2"
          @click="showDropdown = false"
        >
          Manage Account
        </router-link>

        <!-- Upgrade -->
        <router-link
          :to="{ path: '/pricingplan', query: { returnTo: $route.fullPath } }"
          class="btn btn-sm btn-outline-dark w-100 mb-2"
          @click="showDropdown = false"
        >
          Upgrade Plan
        </router-link>

        <!-- Logout -->
        <button class="btn btn-sm btn-danger w-100" @click="handleLogout">
          Logout
        </button>
      </div>
    </div>
    </div>

    </div>
    <hr class="m-0">
      </div>
    </div>

  </main>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import router from "@/router";
import NotificationPanel from "@/components/admin-component/NotificationPanel.vue";

export default {
  name: 'DashboardHeader',
  components: { NotificationPanel },
  data() {
    return {
      showDropdown: false,
      userEmail: "",
      userInitial: "U",
      authStore: useAuthStore(),
    };
  },
  computed: {
    selectedTeamLabel() {
      const team = this.authStore.userSelectedTeam;
      return !team || team === "both" || team === "All Teams" ? "All Teams" : team;
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    async fetchUserProfile() {
      const authStore = useAuthStore();
      const response = await authStore.getMemberProfile();

      if (response.status && response.data?.user) {
        const user = response.data.user;
        this.userEmail = user.email || "";
        this.userInitial = user.email
          ? user.email.charAt(0).toUpperCase()
          : "U";
      }
    },
    async handleLogout() {
      const authStore = useAuthStore();

      const response = await authStore.logout();

      // Clear authenticated tab ID
      sessionStorage.removeItem('authenticatedTabId');

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        router.replace("/home");
      } else {
        Swal.fire({
          icon: "error",
          title: "Logout Failed",
          text: response.message || "Something went wrong!",
          timer: 3000,
          showConfirmButton: false,
        });
      }
    },
    handleClickOutside(e) {
      if (
        !e.target.closest(".circle-bottom") &&
        !e.target.closest(".dropdown-box")
      ) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
    this.fetchUserProfile();
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
.dropdown-box {
  position: absolute;
  right: 40px;
  top: 10px;
  background: #fff;
  min-width: 220px;
  z-index: 1000;
}
.browser-header {
  position: fixed; /* Fix at top */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1050; /* Keep it above other content */
  background-color: #f8f9fa; /* Ensure background stays visible */
}

body {
  padding-top: 100px; /* Add space so content doesn't go under header */
}

.browser-bar img {
  height: 36px;
  width: auto;
  max-width: 148px;
  object-fit: contain;
  object-position: left center;
}

.header-team-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.16);
  border: 1px solid rgba(255, 255, 255, 0.28);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  line-height: 1.3;
  max-width: 260px;
}
.header-team-badge:hover {
  background: rgba(255, 255, 255, 0.26);
  color: #ffffff;
}
.header-team-badge i {
  flex: none;
}
.header-team-badge-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dashboard-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

</style>
