<template>
  <main>
    <div class="container pt-3 pb-5">
        <div class="row mt-5 mb-2">
    <!-- Sidebar -->
    <div class="col-lg-5">

      <div class="card shadow-lg p-5" style="border-radius: 20px;">
        <div class="text-center mb-4">
          <img 
            :src="user.profileImage || 'https://cdn-icons-png.flaticon.com/512/147/147144.png'" 
            alt="Profile" 
            class="rounded-circle" 
            width="80" 
            height="80"
          />
          <h4 class="mt-2">{{ user.full_name }}</h4>
          <p class="text-muted">{{ user.email }}</p>
        </div>

        <!-- Profile Actions -->
        <div class="d-grid gap-3">
          <button
            class="btn btn-outline-primary"
            @click="activeTab = 'updateProfile'"
          >
            <i class="bi bi-pencil-square me-2"></i> Update Profile
          </button>

          <button
            class="btn btn-outline-warning"
            @click="activeTab = 'changePassword'"
          >
            <i class="bi bi-key-fill me-2"></i> Change Password
          </button>

          <button
            class="btn btn-outline-danger"
            @click="activeTab = 'logout'"
          >
            <i class="bi bi-box-arrow-right me-2"></i> Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="col-lg-7 mt-5 mt-lg-0">
      <!-- Update Profile -->
      <div
        v-if="activeTab === 'updateProfile'"
        class="card shadow-lg p-4"
        style="border-radius: 20px;"
      >
        <h3 class="text-center mb-4">Update Profile</h3>

        <div class="mb-3">
          <label class="form-label">First Name</label>
          <input type="text" v-model="firstName" class="form-control"/>
        </div>

        <div class="mb-3">
          <label class="form-label">Last Name</label>
          <input type="text" v-model="lastName" class="form-control"/>
        </div>

        <div class="mb-3">
          <label class="form-label text-muted">Organization Name</label>
          <input type="text" v-model="orgName" class="form-control" disabled/>
        </div>

        <div class="mb-3">
          <label class="form-label">Organization URL</label>
          <input type="url" v-model="orgUrl" class="form-control" />
        </div>

        <div class="text-center">
          <button class="btn btn-primary" @click="handleUpdate">Save Changes</button>
        </div>
      </div>

      <!-- Change Password -->
      <div
        v-if="activeTab === 'changePassword'"
        class="card shadow-lg p-4"
        style="border-radius: 20px;"
      >
        <h3 class="text-center mb-4">Change Password</h3>

        <!-- Old Password -->
        <div class="mb-3 position-relative">
          <label class="form-label">Old Password</label>
          <input
            :type="showOldPassword ? 'text' : 'password'"
            v-model="oldPassword"
            class="form-control"
            placeholder="Enter old password"
          />
          <i
            class="bi"
            :class="showOldPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
            @click="showOldPassword = !showOldPassword"
            style="position: absolute; top: 42px; right: 20px; cursor: pointer;"
          ></i>
        </div>

        <!-- New Password -->
        <div class="mb-3 position-relative">
          <label class="form-label">New Password</label>
          <input
            :type="showNewPassword ? 'text' : 'password'"
            v-model="newPassword"
            class="form-control"
            placeholder="Enter new password"
          />
          <i
            class="bi"
            :class="showNewPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
            @click="showNewPassword = !showNewPassword"
            style="position: absolute; top: 42px; right: 20px; cursor: pointer;"
          ></i>
        </div>

        <!-- Confirm New Password -->
        <div class="mb-3 position-relative">
          <label class="form-label">Confirm New Password</label>
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            class="form-control"
            placeholder="Re-enter new password"
          />
          <i
            class="bi"
            :class="showConfirmPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'"
            @click="showConfirmPassword = !showConfirmPassword"
            style="position: absolute; top: 42px; right: 20px; cursor: pointer;"
          ></i>
        </div>

        <div class="text-center">
          <button class="btn btn-warning" @click="handleChangePassword">Update</button>
        </div>
      </div>

      <!-- Logout (Static) -->
    <div class="d-flex justify-content-center align-items-center" style="margin-top: 130px;">
        <div
            v-if="activeTab === 'logout'"
            class="card shadow-lg p-5 text-center"
            style="border-radius: 20px;">
            <h3 class="mb-4">Are you sure you want to logout?</h3>
            <div class="d-flex justify-content-center">
              <button class="btn btn-danger px-4" @click="handleLogout">Logout</button>
            </div>
        </div>
    </div>

    </div>
    </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import router from "../../router"; 

export default {
    name: 'Profile',
    data() {
    return {
      activeTab: "updateProfile",
      firstName: "",
      lastName: "",
      orgName: "",
      orgUrl: "",
      user: {
        full_name: "",
        email: "",
        profileImage: "", 
      },
      firstName: "",
      lastName: "",
      orgName: "",
      orgUrl: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },
  
  async created() {
  const authStore = useAuthStore();

  // First try restore normal tokens
  const restored = authStore.restoreFromStorage();

  if (restored) {
    // we have accessToken + user in store/localStorage
    // fill UI quickly from localStorage
    const raw = localStorage.getItem("user");
    if (raw) {
      const u = JSON.parse(raw);
      this.user.full_name = u.full_name || "";
      this.user.email = u.email || "";
      this.firstName = u.firstname || "";
      this.lastName = u.lastname || "";
      this.orgName = u.organisation_name || "";
      this.orgUrl = u.organisation_url || "";
    }

    // then refresh from backend
    const response = await authStore.getUserProfile();
    if (response.status) {
      const u = response.data.user;
      this.user.full_name = u.full_name;
      this.user.email = u.email;
      this.firstName = u.firstname;
      this.lastName = u.lastname;
      this.orgName = u.organisation_name;
      this.orgUrl = u.organisation_url;
    } else {
      // If refresh fails, maybe tokens expired — optionally try refresh token flow
      console.warn("Profile refresh failed:", response.message);
    }

    return;
  }

  // No normal tokens restored. Check for google_id_token and attempt exchange
  const googleIdToken = localStorage.getItem("google_id_token");
  if (googleIdToken) {
    // exchange google token for app tokens + user
    const exchange = await authStore.googleLogin(googleIdToken);

    if (exchange.status) {
      const user = authStore.user;
      if (user) {
        this.user.full_name = user.full_name || "";
        this.user.email = user.email || "";
        this.firstName = user.firstname || "";
        this.lastName = user.lastname || "";
        this.orgName = user.organisation_name || "";
        this.orgUrl = user.organisation_url || "";
      }

      // optionally fetch latest profile
      const response = await authStore.getUserProfile();
      if (response.status) {
        const u = response.data.user;
        this.user.full_name = u.full_name;
        this.user.email = u.email;
        this.firstName = u.firstname;
        this.lastName = u.lastname;
        this.orgName = u.organisation_name;
        this.orgUrl = u.organisation_url;
      }
      return;
    } else {
      // exchange failed -> force login
      console.warn("Google token exchange failed:", exchange.message);
      this.$router.push("/signin");
      return;
    }
  }

  // No tokens at all -> redirect to login
  this.$router.push("/signin");
},
  methods: {
    async handleUpdate() {
      const authStore = useAuthStore();

      const payload = {
        firstname: this.firstName,
        lastname: this.lastName,
        organisation_name: this.orgName, 
        organisation_url: this.orgUrl,
      };

      const response = await authStore.updateUserProfile(payload);

      if (response.status) {
      Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your changes have been saved successfully.",
        timer: 3000,
        showConfirmButton: false,
      });

      // 🔄 Re-fetch profile from backend to confirm
  const refreshed = await authStore.getUserProfile();
  if (refreshed.status) {
    this.firstName = refreshed.data.user.firstname;
    this.lastName = refreshed.data.user.lastname;
    this.orgUrl = refreshed.data.user.organisation_url;
    this.user.full_name = refreshed.data.user.full_name;
  }
    } else {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: response.message || "Something went wrong!",
        timer: 3000,
        showConfirmButton: false,
      });
    }
    },
    async handleChangePassword() {
      // ✅ Client-side validation
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        Swal.fire({
          icon: "warning",
          title: "All fields required",
          text: "Please fill in all password fields.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "New password and confirm password do not match.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      const authStore = useAuthStore();
      const payload = {
        old_password: this.oldPassword,
        new_password: this.newPassword,
        confirm_password: this.confirmPassword,
      };

      const response = await authStore.changePassword(payload);

      if (response.status) {
        // ✅ Show response data to confirm password updated
        Swal.fire({
          icon: "success",
          title: "Password Changed",
          html: `<p>Your password has been updated successfully.</p>`,
          timer: 3000,
          showConfirmButton: false,
        });

        // Clear input fields
        this.oldPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.showOldPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: response.message || "Unable to change password.",
          timer: 3000,
          showConfirmButton: false,
        });
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

        // redirect to login page
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
  }
}
</script>

<style scoped>
.card {
  border: none;
}
</style>