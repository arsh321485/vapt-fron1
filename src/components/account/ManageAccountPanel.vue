<template>
  <div class="ma-page">
    <div class="ma-page-header">
      <div>
        <h2 class="ma-title">Manage Account</h2>
        <p class="ma-subtitle">Update your profile, security settings, and workspace preferences.</p>
      </div>
      <router-link :to="dashboardRoute" class="ma-back-link">
        <i class="bi bi-arrow-left"></i> Back to Dashboard
      </router-link>
    </div>

    <div class="ma-layout">
      <aside class="ma-sidebar card shadow-sm">
        <div class="ma-profile-block text-center">
          <div class="ma-avatar">{{ userInitial }}</div>
          <h5 class="ma-name mb-1">{{ displayName }}</h5>
          <p class="ma-email mb-0">{{ userEmail }}</p>
          <span v-if="isMember" class="ma-role-badge">Team Member</span>
          <span v-else class="ma-role-badge ma-role-badge--admin">Administrator</span>
        </div>

        <nav class="ma-nav">
          <button
            v-for="item in navItems"
            :key="item.id"
            type="button"
            class="ma-nav-btn"
            :class="{ 'ma-nav-btn--active': activeTab === item.id }"
            @click="activeTab = item.id"
          >
            <i :class="item.icon"></i>
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <div class="ma-quick-links">
          <p class="ma-quick-label">Quick Links</p>
          <router-link
            v-if="mode === 'admin'"
            :to="{ path: '/riskcriteria', query: { returnTo: $route.fullPath } }"
            class="ma-quick-link"
          >
            <i class="bi bi-sliders"></i> Update Risk Criteria
          </router-link>
          <router-link to="/pricingplan" class="ma-quick-link">
            <i class="bi bi-stars"></i> Upgrade Plan
          </router-link>
        </div>
      </aside>

      <section class="ma-content card shadow-sm">
        <!-- Profile -->
        <div v-if="activeTab === 'profile'" class="ma-section">
          <h3 class="ma-section-title">Profile Information</h3>
          <p class="ma-section-desc">Keep your account details up to date.</p>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="ma-label">First Name</label>
              <input v-model="firstName" type="text" class="form-control ma-input" placeholder="First name" />
            </div>
            <div class="col-md-6">
              <label class="ma-label">Last Name</label>
              <input v-model="lastName" type="text" class="form-control ma-input" placeholder="Last name" />
            </div>
            <div class="col-12">
              <label class="ma-label">Email</label>
              <input :value="userEmail" type="email" class="form-control ma-input" disabled />
            </div>
            <template v-if="mode === 'admin'">
              <div class="col-md-6">
                <label class="ma-label">Organization Name</label>
                <input v-model="orgName" type="text" class="form-control ma-input" placeholder="Organization" />
              </div>
              <div class="col-md-6">
                <label class="ma-label">Organization URL</label>
                <input v-model="orgUrl" type="url" class="form-control ma-input" placeholder="https://example.com" />
              </div>
            </template>
            <div v-if="isMember && memberRoles.length" class="col-12">
              <label class="ma-label">Assigned Roles</label>
              <div class="ma-role-chips">
                <span v-for="role in memberRoles" :key="role" class="ma-role-chip">{{ role }}</span>
              </div>
            </div>
          </div>

          <div class="ma-actions">
            <button type="button" class="btn ma-btn-primary" :disabled="profileSaving" @click="saveProfile">
              <span v-if="profileSaving" class="spinner-border spinner-border-sm me-1"></span>
              Save Profile
            </button>
          </div>
        </div>

        <!-- Password -->
        <div v-else-if="activeTab === 'password'" class="ma-section">
          <h3 class="ma-section-title">Change Password</h3>
          <p class="ma-section-desc">Use a strong password with at least 8 characters.</p>

          <div class="row g-3">
            <div class="col-12">
              <label class="ma-label">Current Password</label>
              <div class="ma-password-wrap">
                <input
                  v-model="oldPassword"
                  :type="showOldPassword ? 'text' : 'password'"
                  class="form-control ma-input"
                  placeholder="Enter current password"
                  autocomplete="current-password"
                />
                <button type="button" class="ma-eye-btn" @click="showOldPassword = !showOldPassword">
                  <i :class="showOldPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <label class="ma-label">New Password</label>
              <div class="ma-password-wrap">
                <input
                  v-model="newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="form-control ma-input"
                  placeholder="Enter new password"
                  autocomplete="new-password"
                  @input="validatePassword"
                />
                <button type="button" class="ma-eye-btn" @click="showNewPassword = !showNewPassword">
                  <i :class="showNewPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <label class="ma-label">Confirm New Password</label>
              <div class="ma-password-wrap">
                <input
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control ma-input"
                  placeholder="Re-enter new password"
                  autocomplete="new-password"
                />
                <button type="button" class="ma-eye-btn" @click="showConfirmPassword = !showConfirmPassword">
                  <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                </button>
              </div>
            </div>
          </div>

          <ul v-if="showPasswordRules && newPassword" class="ma-password-rules">
            <li :class="{ valid: passwordRules.minLength }">At least 8 characters</li>
            <li :class="{ valid: passwordRules.uppercase }">At least 1 uppercase letter</li>
            <li :class="{ valid: passwordRules.special }">At least 1 special character</li>
          </ul>

          <div class="ma-actions">
            <button type="button" class="btn ma-btn-primary" :disabled="passwordSaving" @click="savePassword">
              <span v-if="passwordSaving" class="spinner-border spinner-border-sm me-1"></span>
              Update Password
            </button>
          </div>
        </div>

        <!-- Projects / Team -->
        <div v-else-if="activeTab === 'workspace'" class="ma-section">
          <h3 class="ma-section-title">{{ mode === 'admin' ? 'Project Workspace' : 'Team Preference' }}</h3>
          <p class="ma-section-desc">
            {{ mode === 'admin'
              ? 'Create and switch between projects for your vulnerability program.'
              : 'Choose your default team view across the dashboard.' }}
          </p>

          <div v-if="mode === 'admin'" class="ma-project-block">
            <AdminProjectField @project-change="onAdminProjectChange" @project-saved="onAdminProjectSaved" />
            <p v-if="activeProjectName" class="ma-hint mt-3 mb-0">
              Active project: <strong>{{ activeProjectName }}</strong>
            </p>
            <p v-else class="ma-hint mt-3 mb-0">No project selected yet. Add one above.</p>
          </div>

          <div v-else class="ma-team-block">
            <label class="ma-label">Default Team</label>
            <select v-model="preferredTeam" class="form-select ma-input" @change="savePreferredTeam">
              <option value="both">All Teams</option>
              <option v-for="team in userTeams" :key="team" :value="team">{{ team }}</option>
            </select>
            <p class="ma-hint mt-2 mb-0">This preference is saved locally and applied when you open the dashboard.</p>
          </div>
        </div>

        <!-- Security / Session -->
        <div v-else-if="activeTab === 'security'" class="ma-section">
          <h3 class="ma-section-title">Security & Session</h3>
          <p class="ma-section-desc">Manage your active session and account access.</p>

          <div class="ma-security-card">
            <div>
              <h6 class="mb-1">Sign out</h6>
              <p class="ma-hint mb-0">End your current session on this device.</p>
            </div>
            <button type="button" class="btn btn-danger btn-sm" @click="handleLogout">Logout</button>
          </div>

          <div class="ma-security-card">
            <div>
              <h6 class="mb-1">Subscription</h6>
              <p class="ma-hint mb-0">View plans and upgrade your VaptFix subscription.</p>
            </div>
            <router-link to="/pricingplan" class="btn btn-outline-dark btn-sm">Upgrade Plan</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';
import router from '@/router';
import AdminProjectField from '@/components/admin-component/AdminProjectField.vue';

const USER_TEAM_KEY = 'vaptfix_user_preferred_team';

export default {
  name: 'ManageAccountPanel',
  components: { AdminProjectField },
  props: {
    mode: {
      type: String,
      required: true,
      validator: v => ['admin', 'user'].includes(v),
    },
  },
  data() {
    return {
      authStore: useAuthStore(),
      activeTab: 'profile',
      userEmail: '',
      userInitial: 'U',
      displayName: '',
      firstName: '',
      lastName: '',
      orgName: '',
      orgUrl: '',
      memberRoles: [],
      isMember: false,
      profileSaving: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      showPasswordRules: false,
      passwordRules: { minLength: false, uppercase: false, special: false },
      passwordSaving: false,
      activeProjectName: localStorage.getItem('activeProjectName') || '',
      preferredTeam: localStorage.getItem(USER_TEAM_KEY) || 'both',
      userTeams: [],
    };
  },
  computed: {
    dashboardRoute() {
      const returnTo = this.$route?.query?.returnTo;
      if (typeof returnTo === 'string' && returnTo.startsWith('/')) return returnTo;
      return this.mode === 'admin' ? '/admindashboardonboarding' : '/userdashboard';
    },
    navItems() {
      return [
        { id: 'profile', label: 'Profile', icon: 'bi bi-person' },
        { id: 'password', label: 'Password', icon: 'bi bi-key' },
        { id: 'workspace', label: this.mode === 'admin' ? 'Projects' : 'Team', icon: 'bi bi-folder2' },
        { id: 'security', label: 'Security', icon: 'bi bi-shield-lock' },
      ];
    },
  },
  async mounted() {
    await this.loadProfile();
    if (this.mode === 'user') {
      await this.loadUserTeams();
    }
  },
  methods: {
    async loadProfile() {
      if (this.mode === 'user') {
        const res = await this.authStore.getMemberProfile();
        if (res.status) {
          const user = res.data?.user || res.data?.data?.user || res.data;
          this.applyUser(user);
          return;
        }
      }

      const res = await this.authStore.getUserProfile();
      if (res.status) {
        this.applyUser(res.data.user);
      } else {
        const stored = JSON.parse(localStorage.getItem('user') || 'null');
        if (stored) this.applyUser(stored);
      }
    },
    applyUser(user) {
      if (!user) return;
      this.isMember = Array.isArray(user.Member_role);
      this.memberRoles = this.isMember
        ? user.Member_role.map(r => String(r))
        : [];
      this.userEmail = user.email || '';
      this.firstName = user.firstname || user.first_name || '';
      this.lastName = user.lastname || user.last_name || '';
      this.orgName = user.organisation_name || '';
      this.orgUrl = user.organisation_url || '';
      this.displayName = user.full_name
        || [this.firstName, this.lastName].filter(Boolean).join(' ')
        || this.userEmail;
      const initialSource = this.firstName || this.userEmail || 'U';
      this.userInitial = initialSource.trim().charAt(0).toUpperCase();
    },
    async loadUserTeams() {
      const res = await this.authStore.fetchUserMitigationByTeam();
      const teams = res.data?.member_teams;
      if (Array.isArray(teams) && teams.length) {
        this.userTeams = teams;
      }
    },
    async saveProfile() {
      this.profileSaving = true;
      try {
        let response;
        if (this.mode === 'user' && this.isMember) {
          response = await this.authStore.updateMemberProfile({
            first_name: this.firstName,
            last_name: this.lastName,
          });
        } else {
          response = await this.authStore.updateUserProfile({
            firstname: this.firstName,
            lastname: this.lastName,
            organisation_name: this.orgName,
            organisation_url: this.orgUrl,
          });
        }

        if (response.status) {
          await this.loadProfile();
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Your changes have been saved.',
            timer: 2500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: response.message || 'Unable to save profile.',
          });
        }
      } finally {
        this.profileSaving = false;
      }
    },
    validatePassword() {
      const pwd = this.newPassword;
      this.showPasswordRules = pwd.length > 0;
      this.passwordRules.minLength = pwd.length >= 8;
      this.passwordRules.uppercase = /[A-Z]/.test(pwd);
      this.passwordRules.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    },
    async savePassword() {
      if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
        Swal.fire({ icon: 'warning', title: 'All fields required', text: 'Please fill in all password fields.' });
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'New password and confirm password do not match.' });
        return;
      }
      this.validatePassword();
      if (!this.passwordRules.minLength || !this.passwordRules.uppercase || !this.passwordRules.special) {
        Swal.fire({
          icon: 'warning',
          title: 'Weak Password',
          text: 'Password must be at least 8 characters with one uppercase letter and one special character.',
        });
        return;
      }

      this.passwordSaving = true;
      try {
        const response = await this.authStore.changePassword({
          old_password: this.oldPassword,
          new_password: this.newPassword,
          confirm_password: this.confirmPassword,
        });

        if (response.status) {
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.showPasswordRules = false;
          Swal.fire({
            icon: 'success',
            title: 'Password Changed',
            text: 'Your password has been updated successfully.',
            timer: 2500,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: response.message || 'Unable to change password.',
          });
        }
      } finally {
        this.passwordSaving = false;
      }
    },
    onAdminProjectChange({ name }) {
      this.activeProjectName = name || '';
    },
    onAdminProjectSaved({ name }) {
      this.activeProjectName = name || '';
    },
    savePreferredTeam() {
      localStorage.setItem(USER_TEAM_KEY, this.preferredTeam);
      Swal.fire({
        icon: 'success',
        title: 'Preference Saved',
        text: 'Your default team has been updated.',
        timer: 2000,
        showConfirmButton: false,
      });
    },
    async handleLogout() {
      const result = await Swal.fire({
        title: 'Logout?',
        text: 'You will be signed out of your account.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#dc2626',
      });
      if (!result.isConfirmed) return;

      const response = await this.authStore.logout();
      sessionStorage.removeItem('authenticatedTabId');

      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        router.replace('/home');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: response.message || 'Something went wrong.',
        });
      }
    },
  },
};
</script>

<style scoped>
.ma-page {
  padding: 24px 28px 40px;
  min-height: calc(100vh - 60px);
  background: #f3f4f6;
}

.ma-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding-top: 8px;
}

.ma-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
}

.ma-subtitle {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.ma-back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  text-decoration: none;
  white-space: nowrap;
  padding: 8px 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e2e8f0;
}

.ma-back-link:hover {
  background: #f0fdfa;
  color: #0d5a5e;
}

.ma-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 20px;
  align-items: start;
}

.ma-sidebar,
.ma-content {
  border: none;
  border-radius: 16px;
  padding: 24px;
}

.ma-profile-block {
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
}

.ma-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f696e, #14b8a6);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.ma-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.ma-email {
  font-size: 12px;
  color: #64748b;
  word-break: break-all;
}

.ma-role-badge {
  display: inline-block;
  margin-top: 10px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 10px;
  border-radius: 50px;
  background: #e0f2f1;
  color: #0f696e;
}

.ma-role-badge--admin {
  background: #dbeafe;
  color: #1d4ed8;
}

.ma-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ma-nav-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.ma-nav-btn:hover {
  background: #f8fafc;
  color: #0f696e;
}

.ma-nav-btn--active {
  background: #e0f2f1;
  color: #0f696e;
}

.ma-quick-links {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.ma-quick-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 8px;
}

.ma-quick-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-decoration: none;
  padding: 8px 0;
}

.ma-quick-link:hover {
  color: #0f696e;
}

.ma-section-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 4px;
}

.ma-section-desc {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 24px;
}

.ma-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.ma-input {
  border-radius: 10px;
  border-color: #e2e8f0;
  font-size: 13px;
  min-height: 42px;
}

.ma-input:focus {
  border-color: #0f696e;
  box-shadow: 0 0 0 3px rgba(15, 105, 110, 0.12);
}

.ma-password-wrap {
  position: relative;
}

.ma-eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
}

.ma-password-rules {
  list-style: none;
  padding: 0;
  margin: 16px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.ma-password-rules li {
  margin-bottom: 4px;
}

.ma-password-rules li.valid {
  color: #16a34a;
}

.ma-actions {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.ma-btn-primary {
  background: #0f696e;
  border: none;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 10px;
}

.ma-btn-primary:hover {
  background: #0d5a5e;
  color: #fff;
}

.ma-btn-primary:disabled {
  opacity: 0.65;
}

.ma-hint {
  font-size: 12px;
  color: #94a3b8;
}

.ma-role-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ma-role-chip {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 50px;
  background: #f1f5f9;
  color: #475569;
}

.ma-project-block,
.ma-team-block {
  max-width: 520px;
}

.ma-security-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  margin-bottom: 12px;
  background: #fafafa;
}

.ma-security-card h6 {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

@media (max-width: 992px) {
  .ma-layout {
    grid-template-columns: 1fr;
  }

  .ma-page-header {
    flex-direction: column;
  }
}
</style>
