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
      <div class="header-team-wrap position-relative" ref="teamMenu">
        <button
          type="button"
          class="header-team-badge"
          :title="'Filter by team — applies across all pages'"
          :aria-expanded="showTeamMenu ? 'true' : 'false'"
          @click.stop="toggleTeamMenu"
        >
          <i class="bi bi-people"></i>
          <span class="header-team-badge-label">{{ selectedTeamLabel }}</span>
          <i class="bi bi-chevron-down header-team-chevron"></i>
        </button>
        <div v-if="showTeamMenu" class="header-team-menu shadow-lg" @click.stop>
          <button
            type="button"
            class="header-team-option"
            :class="{ active: isTeamSelected('both') }"
            @click="selectTeam('both')"
          >
            All Teams
          </button>
          <button
            v-for="team in userTeams"
            :key="team"
            type="button"
            class="header-team-option"
            :class="{ active: isTeamSelected(team) }"
            @click="selectTeam(team)"
          >
            {{ team }}
          </button>
          <p v-if="!userTeams.length && !teamsLoading" class="header-team-empty">
            No teams assigned
          </p>
        </div>
      </div>
      <NotificationPanel recipient-type="user" />
    <div class="position-relative d-inline-block">
      <div
        class="circle-bottom d-flex align-items-center justify-content-center fw-bold"
        style="cursor:pointer;"
        @click="toggleDropdown"
      >
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

function normalizeTeamList(raw) {
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const out = [];
  for (const item of list) {
    const name = String(item || "").trim();
    if (!name || name.toLowerCase() === "both" || name.toLowerCase() === "all teams") continue;
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

export default {
  name: 'DashboardHeader',
  components: { NotificationPanel },
  data() {
    return {
      showDropdown: false,
      showTeamMenu: false,
      teamsLoading: false,
      userEmail: "",
      userInitial: "U",
      userTeams: [],
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
    isTeamSelected(team) {
      const current = this.authStore.userSelectedTeam || "both";
      if (team === "both") {
        return !current || current === "both" || current === "All Teams";
      }
      return String(current).toLowerCase() === String(team).toLowerCase();
    },
    toggleTeamMenu() {
      this.showDropdown = false;
      this.showTeamMenu = !this.showTeamMenu;
    },
    toggleDropdown() {
      this.showTeamMenu = false;
      this.showDropdown = !this.showDropdown;
    },
    selectTeam(team) {
      const value = team || "both";
      this.authStore.setUserSelectedTeam(value);
      this.showTeamMenu = false;
    },
    async fetchUserProfile() {
      const authStore = useAuthStore();
      this.teamsLoading = true;
      try {
        const response = await authStore.getMemberProfile();
        if (response.status && response.data?.user) {
          const user = response.data.user;
          this.userEmail = user.email || "";
          this.userInitial = user.email
            ? user.email.charAt(0).toUpperCase()
            : "U";
          this.userTeams = normalizeTeamList(user.Member_role);
          authStore.userMemberTeams = this.userTeams;
        } else if (Array.isArray(authStore.userMemberTeams) && authStore.userMemberTeams.length) {
          this.userTeams = [...authStore.userMemberTeams];
        }
      } finally {
        this.teamsLoading = false;
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
      if (!e.target.closest(".header-team-wrap")) {
        this.showTeamMenu = false;
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

.header-team-wrap {
  position: relative;
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
  max-width: 280px;
  cursor: pointer;
}
.header-team-badge:hover {
  background: rgba(255, 255, 255, 0.26);
  color: #ffffff;
}
.header-team-badge i {
  flex: none;
}
.header-team-chevron {
  font-size: 11px;
  opacity: 0.9;
}
.header-team-badge-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.header-team-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  max-width: 320px;
  max-height: 280px;
  overflow-y: auto;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 6px;
  z-index: 1100;
}
.header-team-option {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  color: #1e293b;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 12px;
  border-radius: 8px;
  cursor: pointer;
}
.header-team-option:hover {
  background: #f1f5f9;
}
.header-team-option.active {
  background: #e0f2f1;
  color: #0f696e;
}
.header-team-empty {
  margin: 0;
  padding: 10px 12px;
  font-size: 12px;
  color: #94a3b8;
}

.dashboard-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

</style>
