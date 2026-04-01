<template>
  <main>

    <div class="row fixed-browser-bar pe-0 me-0 gx-0"> 
     <div class="col-12 pe-0">
  <div class="d-flex align-items-center justify-content-between gap-4 py-2 px-4">
    
      <div class="browser-bar">
        <img src="@/assets/images/logo-capital.png" alt="">
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
<!-- <router-link
  :to="{ path: '/location', query: { returnTo: $route.fullPath } }"
  class="btn btn-sm btn-outline-primary w-100 mb-2"
>
  Add User
</router-link> -->
<router-link
  :to="{ path: '/riskcriteria', query: { returnTo: $route.fullPath } }"
  class="btn btn-sm btn-outline-primary w-100 mb-2"
>
 Update Risk Criteria
</router-link>

        <!-- Upgrade -->
        <router-link to="/pricingplan" class="btn btn-sm btn-outline-dark w-100 mb-2">
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
      userInitial: "",
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
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
        Swal.fire({
          icon: "success",
          title: "Logged out",
          text: "You have been logged out successfully.",
          timer: 3000,
          showConfirmButton: false,
        });
        router.push("/signin");
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
  height: 40px; 
}

.dashboard-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

</style>
