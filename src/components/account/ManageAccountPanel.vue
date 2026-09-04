<template>
  <div :class="embedded ? 'ma-embedded' : 'ma-page'">
    <div v-if="!embedded" class="ma-page-header">
      <div>
        <h2 class="ma-title">Manage Account</h2>
      </div>
      <router-link :to="dashboardRoute" class="ma-back-link">
        <i class="bi bi-arrow-left"></i> Back to Dashboard
      </router-link>
    </div>

    <div :class="embedded ? 'ma-embedded-layout' : 'ma-layout'">
      <aside v-if="!embedded" class="ma-sidebar card shadow-sm">
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


      </aside>

      <section :class="embedded ? 'ma-embedded-content' : 'ma-content card shadow-sm'">
        <nav v-if="embedded && visibleNavItems.length > 1" class="ma-embedded-tabs">
          <button
            v-for="item in visibleNavItems"
            :key="item.id"
            type="button"
            class="ma-embedded-tab"
            :class="{ 'ma-embedded-tab--active': activeTab === item.id }"
            @click="activeTab = item.id"
          >
            <i :class="item.icon"></i>
            {{ item.label }}
          </button>
        </nav>

        <!-- Profile (read-only GET) -->
        <div v-if="activeTab === 'profile'" class="ma-section">
          <h3 class="ma-section-title">Profile Information</h3>
          <p class="ma-section-desc">Your account details from the logged-in profile.</p>

          <div class="row g-3">
            <div class="col-md-6">
              <label class="ma-label">First Name</label>
              <input :value="firstName" type="text" class="form-control ma-input" placeholder="-" disabled readonly />
            </div>
            <div class="col-md-6">
              <label class="ma-label">Last Name</label>
              <input :value="lastName" type="text" class="form-control ma-input" placeholder="-" disabled readonly />
            </div>
            <div class="col-12">
              <label class="ma-label">Email</label>
              <input :value="userEmail" type="email" class="form-control ma-input" disabled readonly />
            </div>
            <div v-if="memberRoles.length" class="col-12">
              <label class="ma-label">Assigned teams</label>
              <div class="ma-role-chips">
                <span v-for="role in memberRoles" :key="role" class="ma-role-chip">{{ role }}</span>
              </div>
            </div>
            <div v-else-if="mode === 'user'" class="col-12">
              <label class="ma-label">Assigned teams</label>
              <p class="ma-hint mb-0">No teams assigned.</p>
            </div>
          </div>

          <div v-if="mode === 'admin'" class="ma-connect-block">
            <h4 class="ma-connect-title">Connect Slack / Teams</h4>
            <p class="ma-section-desc mb-3">Email-signup admins can also connect Slack or Microsoft Teams to this account.</p>
            <div class="ma-connect-actions">
              <button type="button" class="btn ma-btn-outline" :disabled="oauthLoading === 'slack'" @click="connectSlack">
                <span v-if="oauthLoading === 'slack'" class="spinner-border spinner-border-sm me-1"></span>
                {{ slackConnected ? 'Slack connected' : 'Connect Slack' }}
              </button>
              <button type="button" class="btn ma-btn-outline" :disabled="oauthLoading === 'teams'" @click="connectTeams">
                <span v-if="oauthLoading === 'teams'" class="spinner-border spinner-border-sm me-1"></span>
                {{ teamsConnected ? 'Teams connected' : 'Connect Teams' }}
              </button>
            </div>
          </div>

          <div v-if="mode === 'admin'" class="ma-connect-block">
            <h4 class="ma-connect-title">Connect Slack / Teams</h4>
            <p class="ma-section-desc mb-3">Email-signup admins can also connect Slack or Microsoft Teams to this account.</p>
            <div class="ma-connect-actions">
              <button type="button" class="btn ma-btn-outline" :disabled="oauthLoading === 'slack'" @click="connectSlack">
                <span v-if="oauthLoading === 'slack'" class="spinner-border spinner-border-sm me-1"></span>
                {{ slackConnected ? 'Slack connected' : 'Connect Slack' }}
              </button>
              <button type="button" class="btn ma-btn-outline" :disabled="oauthLoading === 'teams'" @click="connectTeams">
                <span v-if="oauthLoading === 'teams'" class="spinner-border spinner-border-sm me-1"></span>
                {{ teamsConnected ? 'Teams connected' : 'Connect Teams' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Password -->
        <div v-else-if="activeTab === 'password'" class="ma-section">
          <h3 class="ma-section-title">{{ needsSetPassword ? 'Password' : 'Change Password' }}</h3>
          <p class="ma-section-desc">
            {{ needsSetPassword
              ? 'You signed up with Slack or Teams. Set a password to also sign in with email.'
              : 'Use a strong password with at least 8 characters.' }}
          </p>

          <div v-if="needsSetPassword" class="ma-set-password-card">
            <p class="ma-hint mb-3">We’ll email a set-password link to <strong>{{ userEmail }}</strong>.</p>
            <button type="button" class="btn ma-btn-primary" :disabled="setPasswordSending" @click="sendSetPasswordLink">
              <span v-if="setPasswordSending" class="spinner-border spinner-border-sm me-1"></span>
              Set Password
            </button>
          </div>

          <template v-else>
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
          </template>
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

        <!-- Billing -->
        <div v-else-if="activeTab === 'billing'" class="ma-section">
          <h3 class="ma-section-title">Billing & Subscription</h3>
          <p class="ma-section-desc">Current plan, invoices, and cancellation.</p>

          <div v-if="billingLoading" class="text-center py-4">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Loading subscription…
          </div>

          <template v-else>
            <div v-if="billingError" class="alert alert-danger py-2">{{ billingError }}</div>

            <div class="ma-security-card">
              <div>
                <h6 class="mb-1">{{ billingPlanLabel }}</h6>
                <p class="ma-hint mb-0">
                  <template v-if="subscription">
                    Status: <strong class="text-capitalize">{{ subscription.status }}</strong>
                    <span v-if="subscription.mode"> · {{ billingModeLabel }}</span>
                    <span v-if="subscription.billing_cycle"> · {{ billingCycleLabel }}</span>
                    <span v-if="subscription.asset_count != null"> · {{ subscription.asset_count }} assets</span>
                  </template>
                  <template v-else>No subscription yet.</template>
                </p>
              </div>
              <router-link to="/pricingplan" class="btn btn-outline-dark btn-sm">
                {{ subscription ? 'Change plan' : 'Choose a plan' }}
              </router-link>
            </div>

            <div v-if="subscription && ['active', 'trialing', 'past_due'].includes(subscription.status)" class="ma-security-card">
              <div>
                <h6 class="mb-1">Cancel subscription</h6>
                <p class="ma-hint mb-0">Cancels at the end of the current billing period. You keep access until then.</p>
              </div>
              <button type="button" class="btn btn-outline-danger btn-sm" :disabled="canceling" @click="cancelPlan">
                <span v-if="canceling" class="spinner-border spinner-border-sm me-1"></span>
                Cancel
              </button>
            </div>

            <div v-if="invoices.length" class="mt-4">
              <h6 class="ma-section-title" style="font-size: 16px;">Invoices</h6>
              <div v-for="invoice in invoices" :key="invoice.stripe_invoice_id || invoice.created_at" class="ma-invoice-row">
                <div>
                  <strong>{{ formatUsd(invoice.amount, invoice.currency) }}</strong>
                  <span class="ma-hint d-block text-capitalize">{{ invoice.status }} · {{ formatInvoiceDate(invoice.created_at) }}</span>
                </div>
                <a
                  v-if="invoice.hosted_invoice_url"
                  :href="invoice.hosted_invoice_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline-dark btn-sm"
                >View invoice</a>
              </div>
            </div>
          </template>
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

          <div v-if="mode === 'admin'" class="ma-security-card">
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
import { billingErrorMessage, cancelSubscription, formatUsd, getMySubscription } from '@/services/billingApi';
import { consumeAdminPlatformOAuthError } from '@/utils/platformOAuthMessage';
import { openTeamsOAuthPopup } from '@/utils/teamsDeepLink';

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
    embedded: {
      type: Boolean,
      default: false,
    },
    allowedTabs: {
      type: Array,
      default: null,
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
      setPasswordSending: false,
      adminHasPassword: false,
      oauthLoading: false,
      slackConnected: false,
      teamsConnected: false,
      activeProjectName: localStorage.getItem('activeProjectName') || '',
      preferredTeam: localStorage.getItem(USER_TEAM_KEY) || 'both',
      userTeams: [],
      subscription: null,
      invoices: [],
      billingLoading: false,
      billingError: '',
      canceling: false,
    };
  },
  computed: {
    dashboardRoute() {
      const returnTo = this.$route?.query?.returnTo;
      if (typeof returnTo === 'string' && returnTo.startsWith('/')) return returnTo;
      return this.mode === 'admin' ? '/admindashboardonboarding' : '/userdashboard';
    },
    navItems() {
      const items = [
        { id: 'profile', label: 'Profile', icon: 'bi bi-person' },
        { id: 'password', label: 'Password', icon: 'bi bi-key' },
        { id: 'workspace', label: this.mode === 'admin' ? 'Projects' : 'Team', icon: 'bi bi-folder2' },
      ];
      if (this.mode === 'admin') {
        items.push({ id: 'billing', label: 'Billing', icon: 'bi bi-credit-card' });
      }
      items.push({ id: 'security', label: 'Security', icon: 'bi bi-shield-lock' });
      return items;
    },
    visibleNavItems() {
      if (!this.allowedTabs?.length) return this.navItems;
      return this.navItems.filter(item => this.allowedTabs.includes(item.id));
    },
    billingPlanLabel() {
      if (!this.subscription?.plan) return 'No plan';
      const plan = String(this.subscription.plan);
      return plan.charAt(0).toUpperCase() + plan.slice(1);
    },
    billingModeLabel() {
      if (this.subscription?.mode === 'management_testing') return 'Management + Testing';
      if (this.subscription?.mode === 'management') return 'Management';
      return this.subscription?.mode || '';
    },
    billingCycleLabel() {
      const cycle = this.subscription?.billing_cycle;
      if (cycle === 'semi_annual') return 'Semi-annual';
      if (!cycle) return '';
      return String(cycle).charAt(0).toUpperCase() + String(cycle).slice(1);
    },
    isSlackOrTeamsAdmin() {
      return this.mode === 'admin' && this.authStore.isSlackOrTeamsLogin();
    },
    needsSetPassword() {
      return this.isSlackOrTeamsAdmin && this.adminHasPassword !== true;
    },
  },
  watch: {
    visibleNavItems: {
      immediate: true,
      handler(items) {
        if (items.length && !items.find(i => i.id === this.activeTab)) {
          this.activeTab = items[0].id;
        }
      },
    },
    activeTab(tab) {
      if (tab === 'billing' && this.mode === 'admin') this.loadBilling();
    },
  },
  async mounted() {
    await this.loadProfile();
    if (this.mode === 'user') {
      await this.loadUserTeams();
    }
    if (this.mode === 'admin') {
      await this.refreshAdminPasswordState();
      await this.loadBilling();
      this.syncConnectionState();
      window.addEventListener('message', this.onOAuthMessage);
    }
  },
  beforeUnmount() {
    window.removeEventListener('message', this.onOAuthMessage);
  },
  methods: {
    formatUsd,
    formatInvoiceDate(value) {
      if (!value) return '';
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    },
    async loadBilling() {
      this.billingLoading = true;
      this.billingError = '';
      try {
        const data = await getMySubscription();
        this.subscription = data?.subscription || null;
        this.invoices = Array.isArray(data?.invoices) ? data.invoices : [];
      } catch (error) {
        this.subscription = null;
        this.invoices = [];
        this.billingError = billingErrorMessage(error, 'Unable to load billing details.');
      } finally {
        this.billingLoading = false;
      }
    },
    async cancelPlan() {
      const confirm = await Swal.fire({
        icon: 'warning',
        title: 'Cancel subscription?',
        text: 'Access continues until the end of the current billing period.',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel',
        cancelButtonText: 'Keep plan',
        confirmButtonColor: '#dc3545',
      });
      if (!confirm.isConfirmed) return;
      this.canceling = true;
      try {
        const data = await cancelSubscription();
        await Swal.fire({
          icon: 'success',
          title: 'Cancellation scheduled',
          text: data?.detail || 'Subscription will cancel at the end of the current period.',
          confirmButtonColor: '#241447',
        });
        await this.loadBilling();
      } catch (error) {
        await Swal.fire({
          icon: 'error',
          title: 'Could not cancel',
          text: billingErrorMessage(error),
          confirmButtonColor: '#241447',
        });
      } finally {
        this.canceling = false;
      }
    },
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
        const user =
          res.data?.user ||
          res.data?.data?.user ||
          res.data?.data ||
          res.data;
        this.applyUser(user);
        // If API returned email-only, merge any richer local profile fields.
        if (!this.firstName && !this.lastName) {
          this.mergeStoredNameFallback();
        }
      } else {
        this.mergeStoredNameFallback(true);
      }
    },
    mergeStoredNameFallback(force = false) {
      const sources = [];
      try {
        sources.push(JSON.parse(localStorage.getItem('user') || 'null'));
      } catch { /* ignore */ }
      try {
        sources.push(JSON.parse(sessionStorage.getItem('user') || 'null'));
      } catch { /* ignore */ }
      try {
        sources.push(JSON.parse(localStorage.getItem('local_user') || 'null'));
      } catch { /* ignore */ }
      try {
        sources.push(this.authStore?.user || null);
      } catch { /* ignore */ }

      for (const stored of sources) {
        if (!stored || typeof stored !== 'object') continue;
        if (force) {
          this.applyUser(stored);
          if (this.firstName || this.lastName || this.userEmail) return;
          continue;
        }
        const first = String(
          stored.firstname || stored.first_name || stored.firstName || stored.given_name || '',
        ).trim();
        const last = String(
          stored.lastname || stored.last_name || stored.lastName || stored.family_name || '',
        ).trim();
        const full = String(stored.full_name || stored.name || stored.display_name || '').trim();
        if (first || last) {
          this.firstName = this.firstName || first;
          this.lastName = this.lastName || last;
        } else if (full && !this.firstName && !this.lastName) {
          const parts = full.split(/\s+/).filter(Boolean);
          this.firstName = parts[0] || '';
          this.lastName = parts.slice(1).join(' ');
        }
        if (!this.userEmail) {
          this.userEmail = stored.email || stored.work_email || '';
        }
        if (this.firstName || this.lastName) {
          this.displayName =
            [this.firstName, this.lastName].filter(Boolean).join(' ') || this.userEmail;
          const initialSource = this.firstName || this.userEmail || 'U';
          this.userInitial = initialSource.trim().charAt(0).toUpperCase();
          return;
        }
      }
    },
    applyUser(user) {
      if (!user) return;
      const rolesRaw =
        user.Member_role ??
        user.member_role ??
        user.member_teams ??
        user.assigned_teams ??
        user.teams ??
        [];
      const rolesList = Array.isArray(rolesRaw) ? rolesRaw : rolesRaw ? [rolesRaw] : [];
      this.memberRoles = rolesList.map((r) => String(r || '').trim()).filter(Boolean);
      this.isMember = this.mode === 'user' || this.memberRoles.length > 0;
      this.userEmail = user.email || user.work_email || user.user_email || '';

      let first = String(
        user.firstname || user.first_name || user.firstName || user.given_name || '',
      ).trim();
      let last = String(
        user.lastname || user.last_name || user.lastName || user.family_name || '',
      ).trim();

      // Some profiles only return full_name / name — split for First / Last fields.
      if (!first && !last) {
        const full = String(user.full_name || user.name || user.display_name || '').trim();
        if (full) {
          const parts = full.split(/\s+/).filter(Boolean);
          first = parts[0] || '';
          last = parts.slice(1).join(' ');
        }
      }

      this.firstName = first;
      this.lastName = last;
      this.orgName = user.organisation_name || user.organization_name || user.company_name || '';
      this.orgUrl = user.organisation_url || user.organization_url || '';
      this.displayName = String(user.full_name || user.name || '').trim()
        || [this.firstName, this.lastName].filter(Boolean).join(' ')
        || this.userEmail;
      const initialSource = this.firstName || this.userEmail || 'U';
      this.userInitial = initialSource.trim().charAt(0).toUpperCase();
    },
    async refreshAdminPasswordState() {
      if (this.mode !== 'admin') return;
      const email = (this.userEmail || '').trim();
      if (!email) {
        this.adminHasPassword = !this.isSlackOrTeamsAdmin;
        return;
      }
      try {
        const res = await this.authStore.getUserLoginPlatform(email);
        if (res.data && typeof res.data.has_password === 'boolean') {
          this.adminHasPassword = res.data.has_password === true;
        } else {
          this.adminHasPassword = !this.isSlackOrTeamsAdmin;
        }
      } catch {
        this.adminHasPassword = !this.isSlackOrTeamsAdmin;
      }
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
    syncConnectionState() {
      this.slackConnected = !!(
        localStorage.getItem('slack_bot_token') ||
        sessionStorage.getItem('admin_slack_connected') === 'true'
      );
      this.teamsConnected = !!(
        localStorage.getItem('teams_connected') === 'true' ||
        localStorage.getItem('microsoft_graph_token') ||
        sessionStorage.getItem('admin_teams_connected') === 'true'
      );
    },
    async sendSetPasswordLink() {
      this.setPasswordSending = true;
      try {
        const res = await this.authStore.sendSetPasswordEmail();
        if (res.status) {
          Swal.fire({
            icon: 'success',
            title: 'Set-password link sent',
            text: res.message || 'Please check your email.',
            confirmButtonColor: '#241447',
          });
        } else if (res.alreadySet) {
          this.adminHasPassword = true;
          Swal.fire({
            icon: 'info',
            title: 'Password already set',
            text: res.message || 'A password is already set for this account.',
            confirmButtonColor: '#241447',
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Unable to send set-password link.', confirmButtonColor: '#241447' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send set-password link.', confirmButtonColor: '#241447' });
      } finally {
        this.setPasswordSending = false;
      }
    },
    async connectSlack() {
      this.oauthLoading = 'slack';
      try {
        const adminId = this.authStore.user?._id || this.authStore.user?.id || null;
        const res = await this.authStore.getSlackOAuthUrl('https://vaptbackend.secureitlab.com', adminId);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          const popup = window.open(res.data.auth_url, 'SlackOAuth', `width=${width},height=${height},left=${left},top=${top}`);
          if (!popup) {
            Swal.fire({ icon: 'warning', title: 'Popup blocked', text: 'Please allow popups for this site.', confirmButtonColor: '#241447' });
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to start Slack connection.', confirmButtonColor: '#241447' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong while connecting Slack.', confirmButtonColor: '#241447' });
      } finally {
        this.oauthLoading = false;
      }
    },
    async connectTeams() {
      this.oauthLoading = 'teams';
      try {
        const adminId = this.authStore.user?._id || this.authStore.user?.id || null;
        const redirectUri = `${window.location.origin}/microsoft/callback`;
        const res = await this.authStore.getMicrosoftOAuthUrl(redirectUri, adminId);
        if (res.status && res.data?.auth_url) {
          if (!openTeamsOAuthPopup(res.data.auth_url)) {
            Swal.fire({ icon: 'warning', title: 'Popup blocked', text: 'Please allow popups for this site.', confirmButtonColor: '#241447' });
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Unable to start Teams connection.', confirmButtonColor: '#241447' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong while connecting Teams.', confirmButtonColor: '#241447' });
      } finally {
        this.oauthLoading = false;
      }
    },
    onOAuthMessage(event) {
      const allowed = [window.location.origin, 'https://vaptbackend.secureitlab.com'];
      if (event.origin && !allowed.includes(event.origin)) return;
      const platformError = consumeAdminPlatformOAuthError(event.data);
      if (platformError) {
        this.oauthLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Cannot connect',
          text: platformError,
          confirmButtonColor: '#241447',
        });
        return;
      }
      if (event.data?.success === false) return;
      if (event.data?.type === 'SLACK_CONNECTED' || event.data?.slack_bot_token || event.data?.bot_access_token) {
        this.slackConnected = true;
        sessionStorage.setItem('admin_slack_connected', 'true');
      }
      if (event.data?.type === 'TEAMS_CONNECTED' || event.data?.vaptfix_team || event.data?.django_access_token) {
        this.teamsConnected = true;
        localStorage.setItem('teams_connected', 'true');
        sessionStorage.setItem('admin_teams_connected', 'true');
      }
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

.ma-connect-block {
  margin-top: 28px;
  padding-top: 22px;
  border-top: 1px solid #f1f5f9;
}

.ma-connect-title {
  font-size: 15px;
  font-weight: 700;
  color: #241447;
  margin: 0 0 4px;
}

.ma-connect-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ma-btn-outline {
  border: 1px solid rgba(15, 105, 110, 0.35);
  background: #fff;
  color: #0f696e;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 14px;
}

.ma-set-password-card {
  background: #f8fafc;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 10px;
  padding: 16px 18px;
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

.ma-embedded {
  width: 100%;
}

.ma-embedded-layout {
  width: 100%;
}

.ma-embedded-content {
  background: #fff;
  border-radius: 1.5rem;
  padding: 32px;
  box-shadow: 0 40px 40px 0 rgba(25, 28, 30, 0.06);
}

.ma-embedded-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.ma-embedded-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 16px;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.15s;
}

.ma-embedded-tab:hover {
  border-color: #0f696e;
  color: #0f696e;
}

.ma-embedded-tab--active {
  background: #0f696e;
  border-color: #0f696e;
  color: #fff;
}

.ma-invoice-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}
</style>
