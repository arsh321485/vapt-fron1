<template>
  <main>

    <div class="row fixed-browser-bar pe-0 me-0 gx-0">
     <div class="col-12 pe-0">
  <div class="d-flex align-items-center justify-content-between gap-4 py-2 px-4">

   <div class="browser-bar">
    <router-link :to="logoPath">
        <img src="@/assets/images/vaptfix_white.png" alt="VaptFix">
        </router-link>
      </div>
    <!-- Right Section -->
    <div class="d-flex align-items-center gap-2">
      <NotificationPanel />
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
<button
  v-if="uploadScopeLocked"
  type="button"
  class="btn btn-sm w-100 mb-2 header-upload-scope--disabled"
  disabled
  title="Upgrade to Premium to upload a new scope"
>
  Upload Scope
</button>
<router-link
  v-else
  :to="{ path: '/admin-upload-report', query: { returnTo: $route.fullPath } }"
  class="btn btn-sm btn-outline-primary w-100 mb-2"
  @click="showDropdown = false"
>
  Upload Scope
</router-link>

<router-link
  :to="{ path: '/riskcriteria', query: { returnTo: $route.fullPath } }"
  class="btn btn-sm btn-outline-primary w-100 mb-2"
  @click="showDropdown = false"
>
 Update Risk Criteria
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
import { getAuthenticatedAppHome } from "@/utils/authenticatedHome";
import { getMySubscription } from "@/services/billingApi";
import { freemiumLocksUploadScope } from "@/utils/planLimits";

export default {
  name: 'DashboardHeader',
  components: { NotificationPanel },
  data() {
    return {
      showDropdown: false,
      userEmail: "",
      userInitial: "",
      billingSubscription: null,
    };
  },
  computed: {
    logoPath() {
      return getAuthenticatedAppHome(this.$route?.path || '/admindashboardonboarding');
    },
    uploadScopeLocked() {
      if (freemiumLocksUploadScope(this.billingSubscription)) return true;
      return !!useAuthStore().automationPremiumRequired && !this.billingSubscription;
    },
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
      if (this.showDropdown) this.refreshBillingPlan();
    },
    async refreshBillingPlan() {
      try {
        const billing = await getMySubscription();
        this.billingSubscription = billing?.subscription || null;
      } catch {
        /* keep last known plan */
      }
    },
    setUserData(user) {
      if (!user) return;

      this.userEmail = user.email || "";

      const nameSource =
        user.first_name ||
        user.firstname ||
        user.full_name ||
        user.name ||
        user.email || "";

      this.userInitial = nameSource.trim().charAt(0).toUpperCase();
    },
    async loadUserData() {
      const authStore = useAuthStore();

      // 1️⃣ Try from store/localStorage first (fast UI)
      const storedUser =
        authStore.user ||
        JSON.parse(localStorage.getItem("user") || "null");

      if (storedUser) {
        this.setUserData(storedUser);
      }

      // 2️⃣ Then refresh from API and override
      const response = await authStore.getUserProfile();

      if (response.status && response.data && response.data.user) {
        const freshUser = response.data.user;
        this.setUserData(freshUser);
      }

      try {
        const billing = await getMySubscription();
        this.billingSubscription = billing?.subscription || null;
      } catch {
        this.billingSubscription = null;
      }
    },
    async fetchUserProfile() {
  const authStore = useAuthStore();
  const response = await authStore.getUserProfile();

  console.log("PROFILE RESPONSE:", response);

  const user = response.data?.data?.user || response.data?.user;

  if (user) {
    this.userEmail = user.email;
    this.userInitial = (user.firstname || user.name || "")
      .trim()
      .charAt(0)
      .toUpperCase();
  }
    },
    async handleLogout() {
      const authStore = useAuthStore();

      const response = await authStore.logout();

      if (response.status) {
        // Clear authenticated tab ID
        sessionStorage.removeItem('authenticatedTabId');

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
  this.loadUserData();
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
.header-upload-scope--disabled {
  background: #e2e8f0 !important;
  border: 1px solid #cbd5e1 !important;
  color: #94a3b8 !important;
  cursor: not-allowed;
  pointer-events: none;
  box-shadow: none;
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

.vaptfix-logo {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  cursor: pointer;
}
.logo-v { color: #ffffff; }
.logo-a { color: #ef4444; }
.logo-p { color: #ffffff; }
.logo-t { color: #ffffff; }
.logo-f { color: #4ade80; }
.logo-i { color: #facc15; }
.logo-x { color: #ffffff; }

.dashboard-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

</style>
