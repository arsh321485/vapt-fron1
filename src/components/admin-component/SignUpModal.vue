<template>
  <div v-if="show" class="signin-overlay" @click="closeModal">
    <div class="signin-panel" @click.stop>
      <div class="modal-content">

        <!-- Close Button -->
        <button type="button" class="btn-close-x" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Header -->
        <div class="modal-header-text" v-if="!showForm">
          <h3 class="modal-title">Choose Sign In Type</h3>
          <p class="modal-subtitle">Select how you want to sign in</p>
        </div>
        <hr v-if="!showForm" class="form-divider" />

        <!-- Sign In Options -->
        <div class="signup-options" v-if="!showForm">
          <button class="signup-option-card" @click="selectUserSignIn">
            <div class="option-icon user-icon">
              <i class="bi bi-person-circle"></i>
            </div>
            <div class="option-content">
              <h4 class="option-title">User Sign In</h4>
              <p class="option-desc">Sign in to access vulnerability reports and collaborate with your team</p>
            </div>
            <i class="bi bi-arrow-right-circle-fill option-arrow"></i>
          </button>
          <button class="signup-option-card" @click="selectAdminSignIn">
            <div class="option-icon admin-icon">
              <i class="bi bi-shield-lock-fill"></i>
            </div>
            <div class="option-content">
              <h4 class="option-title">Admin Sign In</h4>
              <p class="option-desc">Sign in to manage vulnerability assessments and oversee security operations</p>
            </div>
            <i class="bi bi-arrow-right-circle-fill option-arrow"></i>
          </button>
        </div>

        <!-- User Sign In Form -->
        <div v-if="showForm && formType === 'user'" class="form-container">
          <div class="back-header">
            <button class="back-btn" @click="goBack">
              <i class="bi bi-arrow-left"></i> Back
            </button>
            <h3 class="form-title form-title--center">User Sign In</h3>
          </div>

          <!-- Tabs -->
          <div class="user-tabs">
            <button class="user-tab" :class="{ active: userActiveTab === 'setPassword' }" @click="userActiveTab = 'setPassword'" type="button">
              Set Password
            </button>
            <button class="user-tab" :class="{ active: userActiveTab === 'signIn' }" @click="userActiveTab = 'signIn'" type="button">
              Sign In
            </button>
          </div>

          <!-- Set Password Form -->
          <form v-if="userActiveTab === 'setPassword'" @submit.prevent="handleUserSetPassword">
            <div class="field-group">
              <label class="field-label">New Password</label>
              <div class="input-row">
                <i class="bi bi-lock field-icon"></i>
                <input :type="showUserNewPassword ? 'text' : 'password'" class="field-input" v-model="userSetPasswordForm.newPassword" placeholder="••••••••" autocomplete="new-password" required />
                <i class="bi password-toggle" :class="showUserNewPassword ? 'bi-eye-slash' : 'bi-eye'" @click="showUserNewPassword = !showUserNewPassword"></i>
              </div>
              <!-- Password Rules — hide once all pass -->
              <div v-if="userSetPasswordForm.newPassword.length > 0 && !allSetPasswordRulesPass" class="pwd-rules">
                <div class="pwd-rule" :class="setPasswordRules.minLength ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="setPasswordRules.minLength ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least 8 characters
                </div>
                <div class="pwd-rule" :class="setPasswordRules.uppercase ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="setPasswordRules.uppercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one uppercase letter (A-Z)
                </div>
                <div class="pwd-rule" :class="setPasswordRules.lowercase ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="setPasswordRules.lowercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one lowercase letter (a-z)
                </div>
                <div class="pwd-rule" :class="setPasswordRules.number ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="setPasswordRules.number ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one number (0-9)
                </div>
                <div class="pwd-rule" :class="setPasswordRules.special ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="setPasswordRules.special ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one special character (!@#$%^&*)
                </div>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">Confirm Password</label>
              <div class="input-row">
                <i class="bi bi-lock field-icon"></i>
                <input :type="showUserConfirmPassword ? 'text' : 'password'" class="field-input" v-model="userSetPasswordForm.confirmPassword" placeholder="••••••••" autocomplete="new-password" required />
                <i class="bi password-toggle" :class="showUserConfirmPassword ? 'bi-eye-slash' : 'bi-eye'" @click="showUserConfirmPassword = !showUserConfirmPassword"></i>
              </div>
            </div>
            <button type="submit" class="submit-btn" :disabled="userSetPasswordLoading">
              <span v-if="userSetPasswordLoading" class="spinner-border spinner-border-sm me-2"></span>
              Set Password
            </button>
          </form>

          <!-- Sign In Form -->
          <form v-if="userActiveTab === 'signIn'" @submit.prevent="handleUserSignIn">
            <div v-if="userErrorMessage" class="error-alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              <span>{{ userErrorMessage }}</span>
              <button type="button" class="alert-close-btn" @click="userErrorMessage = ''"><i class="bi bi-x"></i></button>
            </div>

            <div class="field-group">
              <label class="field-label">Email Address / Username</label>
              <div class="input-row">
                <i class="bi bi-at field-icon"></i>
                <input
                  type="text"
                  class="field-input"
                  v-model="userForm.email"
                  placeholder="name@vaptfix.com"
                  autocomplete="username"
                  required
                  @blur="onUserEmailBlur"
                />
              </div>
              <p v-if="platformLoading" class="platform-hint">
                <span class="spinner-border spinner-border-sm me-1"></span>
                Checking your account...
              </p>
            </div>

            <div class="field-group">
              <div class="label-row">
                <label class="field-label" style="margin-bottom:0;">Password</label>
                <a href="#" @click.prevent="openForgotPassword('user')" class="forgot-link">Forgot Password?</a>
              </div>
              <div class="input-row" style="margin-top:6px;">
                <i class="bi bi-lock field-icon"></i>
                <input :type="showUserPassword ? 'text' : 'password'" class="field-input" v-model="userForm.password" placeholder="••••••••" autocomplete="new-password" required />
                <i class="bi password-toggle" :class="showUserPassword ? 'bi-eye-slash' : 'bi-eye'" @click="showUserPassword = !showUserPassword"></i>
              </div>
            </div>

            <div class="recaptcha-field">
              <div :id="userRecaptchaContainerId" :key="userRecaptchaKey" class="recaptcha-wrap"></div>
            </div>

            <button type="submit" class="submit-btn" :disabled="userLoading">
              <span v-if="userLoading" class="spinner-border spinner-border-sm me-2"></span>
              Sign In to Dashboard
            </button>

            <div class="social-divider">
              <span class="social-divider-line"></span>
              <span class="social-divider-text">or</span>
              <span class="social-divider-line"></span>
            </div>

            <div class="social-signup-btns">
              <button
                v-if="!userSlackConnected"
                type="button"
                class="social-btn social-btn-slack"
                :disabled="slackLoginDisabled || userTeamsConnected"
                @click.prevent="startUserSlackLogin"
              >
                <span v-if="userOAuthLoading === 'slack'" class="spinner-border spinner-border-sm"></span>
                <template v-else>
                  <img :src="slackIcon" alt="" class="social-btn-icon" />
                  Sign in with Slack
                </template>
              </button>
              <button
                v-else
                type="button"
                class="social-connected-btn social-connected-slack"
                :disabled="userOAuthLoading === 'teams'"
                @click.prevent="startUserSlackLogin"
              >
                <img :src="slackIcon" alt="" class="social-btn-icon" />
                <i class="bi bi-check-circle-fill"></i>
                Slack connected
              </button>
              <button
                v-if="!userTeamsConnected"
                type="button"
                class="social-btn social-btn-teams"
                :disabled="teamsLoginDisabled || userSlackConnected"
                @click.prevent="startUserTeamsLogin"
              >
                <span v-if="userOAuthLoading === 'teams'" class="spinner-border spinner-border-sm"></span>
                <template v-else>
                  <img :src="teamsIcon" alt="" class="social-btn-icon" />
                  Sign in with Teams
                </template>
              </button>
              <button
                v-else
                type="button"
                class="social-connected-btn social-connected-teams"
                :disabled="userOAuthLoading === 'slack'"
                @click.prevent="startUserTeamsLogin"
              >
                <img :src="teamsIcon" alt="" class="social-btn-icon" />
                <i class="bi bi-check-circle-fill"></i>
                Teams connected
              </button>
            </div>

            <p v-if="platformChecked && userPlatform === 'slack'" class="platform-hint platform-hint--ok">
              <i class="bi bi-info-circle me-1"></i>
              This account was added via Slack. Use Slack or your password below.
            </p>
            <p v-else-if="platformChecked && userPlatform === 'microsoft_teams'" class="platform-hint platform-hint--ok">
              <i class="bi bi-info-circle me-1"></i>
              This account was added via Microsoft Teams. Use Teams or your password below.
            </p>
          </form>
        </div>

        <!-- Admin Sign In Form -->
        <div v-if="showForm && formType === 'admin'" class="form-container">
          <div class="back-header">
            <button class="back-btn" @click="goBack">
              <i class="bi bi-arrow-left"></i> Back
            </button>
            <h3 class="form-title form-title--center">Admin Sign In</h3>
          </div>
          <hr class="form-divider" />

          <form @submit.prevent="handleAdminSignIn">
            <div v-if="adminErrorMessage" class="error-alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              <span>{{ adminErrorMessage }}</span>
              <button type="button" class="alert-close-btn" @click="adminErrorMessage = ''"><i class="bi bi-x"></i></button>
            </div>

            <div class="field-group">
              <label class="field-label">Email Address</label>
              <div class="input-row">
                <i class="bi bi-at field-icon"></i>
                <input type="text" class="field-input" v-model="adminForm.email" placeholder="name@vaptfix.com" autocomplete="new-password" required />
              </div>
              <p class="auth-suggestion">Use the same email you used during admin sign up.</p>
            </div>

            <div class="field-group">
              <div class="label-row">
                <label class="field-label" style="margin-bottom:0;">Password</label>
                <a href="#" @click.prevent="openForgotPassword('admin')" class="forgot-link">Forgot Password?</a>
              </div>
              <div class="input-row" style="margin-top:6px;">
                <i class="bi bi-lock field-icon"></i>
                <input :type="showAdminPassword ? 'text' : 'password'" class="field-input" v-model="adminForm.password" placeholder="••••••••" autocomplete="new-password" required />
                <i class="bi password-toggle" :class="showAdminPassword ? 'bi-eye-slash' : 'bi-eye'" @click="showAdminPassword = !showAdminPassword"></i>
              </div>
              <p class="auth-suggestion">Enter your sign up password. If not registered, click Sign Up below.</p>
            </div>

            <div class="recaptcha-field">
              <div :id="recaptchaContainerId" :key="adminRecaptchaKey" class="recaptcha-wrap"></div>
            </div>

            <button type="submit" class="submit-btn" :disabled="adminLoading">
              <span v-if="adminLoading" class="spinner-border spinner-border-sm me-2"></span>
              Sign In to Dashboard
            </button>

            <div class="social-divider">
              <span class="social-divider-line"></span>
              <span class="social-divider-text">or</span>
              <span class="social-divider-line"></span>
            </div>

            <div class="social-signup-btns">
              <button
                v-if="!adminSlackConnected"
                type="button"
                class="social-btn social-btn-slack"
                :disabled="adminOAuthLoading === 'teams' || adminTeamsConnected"
                @click.prevent="startAdminSlackLogin"
              >
                <span v-if="adminOAuthLoading === 'slack'" class="spinner-border spinner-border-sm"></span>
                <template v-else>
                  <img :src="slackIcon" alt="" class="social-btn-icon" />
                  Sign in with Slack
                </template>
              </button>
              <button
                v-else
                type="button"
                class="social-connected-btn social-connected-slack"
                :disabled="adminOAuthLoading === 'teams'"
                @click.prevent="startAdminSlackLogin"
              >
                <img :src="slackIcon" alt="" class="social-btn-icon" />
                <i class="bi bi-check-circle-fill"></i>
                Slack connected
              </button>

              <button
                v-if="!adminTeamsConnected"
                type="button"
                class="social-btn social-btn-teams"
                :disabled="adminOAuthLoading === 'slack' || adminSlackConnected"
                @click.prevent="startAdminTeamsLogin"
              >
                <span v-if="adminOAuthLoading === 'teams'" class="spinner-border spinner-border-sm"></span>
                <template v-else>
                  <img :src="teamsIcon" alt="" class="social-btn-icon" />
                  Sign in with Teams
                </template>
              </button>
              <button
                v-else
                type="button"
                class="social-connected-btn social-connected-teams"
                :disabled="adminOAuthLoading === 'slack'"
                @click.prevent="startAdminTeamsLogin"
              >
                <img :src="teamsIcon" alt="" class="social-btn-icon" />
                <i class="bi bi-check-circle-fill"></i>
                Teams connected
              </button>
            </div>

            <p class="footer-text">
              Don't have an account?
              <a href="#" @click.prevent="openAdminSignup" class="footer-link">Sign Up</a>
            </p>
          </form>
        </div>

      </div>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div v-if="showForgotModal" class="signin-overlay forgot-backdrop" @click="closeForgotModal">
    <div class="forgot-modal" @click.stop>
      <div class="forgot-modal-header">
        <h4>Reset Password</h4>
        <button class="modal-close" @click="closeForgotModal">&times;</button>
      </div>
      <hr class="form-divider" style="margin: 0;" />
      <div class="forgot-modal-body">
        <p class="text-muted mb-3">Enter your registered email address and we'll send you a reset link.</p>
        <form @submit.prevent="handleForgotPassword">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" class="field-input" style="padding-left:16px;" placeholder="name@work.com" v-model="forgotEmail" autocomplete="off" required />
          </div>
          <button type="submit" class="submit-btn w-100" :disabled="forgotLoading">
            <span v-if="forgotLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ forgotLoading ? "Sending..." : "Send Reset Link" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import { markPostLoginSuccess } from '@/utils/postLoginSuccess';
import router from '@/router';
import Swal from 'sweetalert2';
import teamsIcon from '@/assets/images/teams.png';
import slackIcon from '@/assets/images/slack.png';
import { buildUserSetPasswordHomeQuery } from '@/utils/userSetPasswordDeepLink';

export default {
  name: 'SignUpModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    preSelectedType: {
      type: String,
      default: '',
      validator: (value) => ['', 'user', 'admin'].includes(value)
    },
    /** When preSelectedType is 'user', open this tab first (e.g. email deep-link). */
    userInitialTab: {
      type: String,
      default: '',
      validator: (value) => ['', 'signIn', 'setPassword'].includes(value)
    },
    /** From email link — with token, Set Password calls userSetPasswordWithToken. */
    setPasswordUidb64: {
      type: String,
      default: ''
    },
    setPasswordToken: {
      type: String,
      default: ''
    },
    setPasswordEmail: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      slackIcon,
      teamsIcon,
      userPlatform: null,
      platformChecked: false,
      platformLoading: false,
      userOAuthLoading: false,
      userSlackConnected: false,
      userTeamsConnected: false,
      adminOAuthLoading: false,
      adminSlackConnected: false,
      adminTeamsConnected: false,
      backendBase: 'https://vaptbackend.secureitlab.com',
      showForm: false,
      formType: '',
      userActiveTab: 'signIn',
      userForm: { email: '', password: '' },
      userSetPasswordForm: { newPassword: '', confirmPassword: '' },
      adminForm: { email: '', password: '' },
      showUserPassword: false,
      showUserNewPassword: false,
      showUserConfirmPassword: false,
      showAdminPassword: false,
      userLoading: false,
      userSetPasswordLoading: false,
      adminLoading: false,
      userErrorMessage: '',
      adminErrorMessage: '',
      userRecaptchaWidgetId: null,
      userSetPasswordRecaptchaWidgetId: null,
      adminRecaptchaWidgetId: null,
      userRecaptchaKey: 0,
      userSetPasswordRecaptchaKey: 0,
      adminRecaptchaKey: 0,
      recaptchaSiteKey: '6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny',
      showForgotModal: false,
      forgotEmail: '',
      forgotLoading: false,
      forgotType: 'user',
      _platformEmailTimer: null,
      _userRecaptchaTimer: null,
      _adminRecaptchaTimer: null,
    };
  },
  computed: {
    userRecaptchaContainerId() {
      return `recaptcha-signup-user-${this.userRecaptchaKey}`;
    },
    userSetPasswordRecaptchaContainerId() {
      return `recaptcha-setpassword-user-${this.userSetPasswordRecaptchaKey}`;
    },
    recaptchaContainerId() {
      return `recaptcha-signup-admin-${this.adminRecaptchaKey}`;
    },
    setPasswordRules() {
      const pwd = this.userSetPasswordForm.newPassword || '';
      return {
        minLength: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
      };
    },
    allSetPasswordRulesPass() {
      return Object.values(this.setPasswordRules).every(Boolean);
    },
    hasValidUserEmail() {
      const email = (this.userForm.email || '').trim();
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    slackLoginDisabled() {
      if (!this.hasValidUserEmail) return true;
      if (this.platformLoading || this.userOAuthLoading === 'teams') return true;
      if (!this.platformChecked) return false;
      return this.userPlatform !== 'slack';
    },
    teamsLoginDisabled() {
      if (!this.hasValidUserEmail) return true;
      if (this.platformLoading || this.userOAuthLoading === 'slack') return true;
      if (!this.platformChecked) return false;
      return this.userPlatform !== 'microsoft_teams';
    },
  },
  watch: {
    'userForm.email'() {
      clearTimeout(this._platformEmailTimer);
      if (this.formType !== 'user' || this.userActiveTab !== 'signIn' || !this.showForm) return;
      this._platformEmailTimer = setTimeout(() => {
        this.fetchUserLoginPlatform();
      }, 450);
    },
    userActiveTab(newVal) {
      if (newVal === 'signIn') {
        this.scheduleUserRecaptchaRender();
      } else if (newVal === 'setPassword') {
        this.$nextTick(() => this.renderUserSetPasswordRecaptcha());
      }
    },
    show(newVal) {
      if (newVal) {
        if (this.preSelectedType) {
          this.formType = this.preSelectedType;
          this.showForm = true;
          if (this.preSelectedType === 'user' && this.userInitialTab === 'setPassword') {
            this.userActiveTab = 'setPassword';
          } else {
            this.userActiveTab = 'signIn';
          }
          if (this.setPasswordEmail) {
            this.userForm.email = this.setPasswordEmail;
          }
          if (this.formType === 'user' && this.userForm.email) {
            this.$nextTick(() => this.fetchUserLoginPlatform());
          }
          if (this.formType === 'user' && this.userActiveTab === 'signIn') {
            this.scheduleUserRecaptchaRender();
          }
          if (this.formType === 'admin') {
            this.scheduleAdminRecaptchaRender();
          }
        } else {
          this.showForm = false;
          this.formType = '';
        }
      } else {
        this.resetPlatformState();
      }
    },
    setPasswordEmail(val) {
      if (val && this.show && this.formType === 'user') {
        this.userForm.email = val;
        this.fetchUserLoginPlatform();
      }
    },
    formType(newVal) {
      if (newVal === 'user' && this.showForm && this.userActiveTab === 'signIn') {
        this.scheduleUserRecaptchaRender();
      } else if (newVal === 'admin' && this.showForm) {
        this.scheduleAdminRecaptchaRender();
      }
    }
  },
  mounted() {
    this.loadRecaptchaScript();
    window.addEventListener('message', this.handleMemberOAuthMessage);
    window.addEventListener('message', this.handleAdminOAuthMessage);
    window.addEventListener('storage', this.onMemberStorageChange);
    window.addEventListener('storage', this.onAdminStorageChange);
    this.syncAdminConnectionState();
  },
  methods: {
    canRedirectConnectedUser(email, platform) {
      if (!email) return false;
      const authStore = useAuthStore();
      const authToken = sessionStorage.getItem('authorization');
      if (!authToken) return false;

      let sessionUser = authStore.user;
      if (!sessionUser) {
        try {
          sessionUser = JSON.parse(sessionStorage.getItem('user') || localStorage.getItem('user') || 'null');
        } catch {
          sessionUser = null;
        }
      }
      if (!sessionUser) return false;

      const sessionEmail = String(sessionUser.email || '').trim().toLowerCase();
      const enteredEmail = String(email).trim().toLowerCase();
      if (!sessionEmail || sessionEmail !== enteredEmail) return false;

      const provider = String(sessionUser.login_provider || '').trim().toLowerCase();
      return provider === platform;
    },
    async syncAdminConnectionState() {
      this.adminTeamsConnected = !!(
        localStorage.getItem('microsoft_graph_token') || localStorage.getItem('teams_connected') === 'true'
      );
      const botToken = localStorage.getItem('slack_bot_token');
      if (!botToken) {
        this.adminSlackConnected = false;
        return;
      }
      try {
        const authStore = useAuthStore();
        const validateRes = await authStore.validateSlackToken(botToken);
        this.adminSlackConnected = !!validateRes.success;
      } catch {
        this.adminSlackConnected = false;
      }
    },
    ensureAdminAuthSessionFromOAuth(payload = null) {
      try {
        const authStore = useAuthStore();
        return authStore.hydrateAuthSessionFromOAuth(payload);
      } catch (e) {
        console.error('Failed to set admin OAuth session:', e);
        return false;
      }
    },
    async finishAdminOAuthSignIn() {
      const hasSession = this.ensureAdminAuthSessionFromOAuth() ||
        !!sessionStorage.getItem('authorization') ||
        sessionStorage.getItem('authenticated') === 'true';
      if (!hasSession) return;
      this.$emit('close');
      await this.checkAndRedirectAdmin();
    },
    resetPlatformState() {
      this.userPlatform = null;
      this.platformChecked = false;
      this.platformLoading = false;
      this.userOAuthLoading = false;
      this.userSlackConnected = false;
      this.userTeamsConnected = false;
    },
    async onUserEmailBlur() {
      await this.fetchUserLoginPlatform();
    },
    async fetchUserLoginPlatform() {
      const email = (this.userForm.email || '').trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this.resetPlatformState();
        return;
      }
      this.platformLoading = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.getUserLoginPlatform(email);
        this.platformChecked = true;
        const platform = res.data?.platform;
        if (platform === 'slack' || platform === 'microsoft_teams') {
          this.userPlatform = platform;
          this.userSlackConnected = platform === 'slack';
          this.userTeamsConnected = platform === 'microsoft_teams';
        } else {
          this.userPlatform = 'email';
          this.userSlackConnected = false;
          this.userTeamsConnected = false;
        }
      } catch {
        this.platformChecked = true;
        this.userPlatform = 'email';
        this.userSlackConnected = false;
        this.userTeamsConnected = false;
      } finally {
        this.platformLoading = false;
      }
    },
    async redirectUserToDashboard(message) {
      this.$emit('close');
      if (message) markPostLoginSuccess(message);
      try {
        await router.replace({ path: '/userdashboard' });
      } catch {
        await router.push({ path: '/userdashboard' });
      }
    },
    handleMemberOAuthMessage(event) {
      const allowed = [window.location.origin, 'https://vaptbackend.secureitlab.com'];
      if (event.origin && !allowed.includes(event.origin)) return;

      if (event.data?.type === 'MEMBER_SET_PASSWORD_REQUIRED') {
        this.userOAuthLoading = false;
        const uidb64 = event.data.uidb64 || '';
        const token = event.data.token || '';
        const email = event.data.email || this.userForm.email || '';
        if (uidb64 && token) {
          router.replace({
            path: '/home',
            query: buildUserSetPasswordHomeQuery(uidb64, token, email),
          });
        }
        return;
      }

      if (event.data?.type === 'SLACK_MEMBER_LOGGED_IN' && event.data?.success) {
        this.userOAuthLoading = false;
        this.userSlackConnected = true;
        this.userTeamsConnected = false;
        this.redirectUserToDashboard('Signed in with Slack successfully.');
        return;
      }
      if (event.data?.type === 'TEAMS_MEMBER_LOGGED_IN' && event.data?.success) {
        this.userOAuthLoading = false;
        this.userTeamsConnected = true;
        this.userSlackConnected = false;
        this.redirectUserToDashboard('Signed in with Microsoft Teams successfully.');
      }
    },
    onMemberStorageChange(event) {
      if (event.key === 'microsoft_graph_token' && event.newValue && sessionStorage.getItem('pending_member_flow') === 'teams') {
        this.userTeamsConnected = true;
        this.userSlackConnected = false;
        const authStore = useAuthStore();
        if (authStore.authenticated) {
          this.redirectUserToDashboard();
        }
      }
    },
    async startAdminSlackLogin() {
      if (this.adminSlackConnected) {
        await this.finishAdminOAuthSignIn();
        return;
      }
      this.adminOAuthLoading = 'slack';
      try {
        const authStore = useAuthStore();
        const adminId = authStore.user?._id || authStore.user?.id || null;
        const res = await authStore.getSlackOAuthUrl(this.backendBase, adminId);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          const popup = window.open(
            res.data.auth_url,
            'SlackOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.');
          }
        } else {
          Swal.fire('Error', 'Unable to start Slack login', 'error');
        }
      } catch {
        Swal.fire('Error', 'Something went wrong while connecting Slack', 'error');
      } finally {
        this.adminOAuthLoading = false;
      }
    },
    async startAdminTeamsLogin() {
      if (this.adminTeamsConnected) {
        await this.finishAdminOAuthSignIn();
        return;
      }
      this.adminOAuthLoading = 'teams';
      try {
        const authStore = useAuthStore();
        const adminId = authStore.user?._id || authStore.user?.id || null;
        const redirectUri = `${window.location.origin}/microsoft/callback`;
        const res = await authStore.getMicrosoftOAuthUrl(redirectUri, adminId);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          const popup = window.open(
            res.data.auth_url,
            'TeamsOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.');
          }
        } else {
          Swal.fire('Error', 'Failed to start Microsoft Teams login', 'error');
        }
      } catch {
        Swal.fire('Error', 'Microsoft Teams login failed', 'error');
      } finally {
        this.adminOAuthLoading = false;
      }
    },
    async handleAdminOAuthMessage(event) {
      const allowed = [window.location.origin, 'https://vaptbackend.secureitlab.com'];
      if (event.origin && !allowed.includes(event.origin)) return;
      if (event.data?.type === 'SLACK_CONNECTED') {
        if (event.data.bot_token) localStorage.setItem('slack_bot_token', event.data.bot_token);
        if (event.data.slack_user_id) localStorage.setItem('slack_user_id', event.data.slack_user_id);
        if (event.data.django_access_token) localStorage.setItem('django_access_token', event.data.django_access_token);
        if (event.data.user) localStorage.setItem('local_user', JSON.stringify(event.data.user));
        this.adminSlackConnected = true;
        this.adminTeamsConnected = false;
        this.ensureAdminAuthSessionFromOAuth(event.data);
        await Swal.fire({
          icon: 'success',
          title: 'Slack connected successfully',
          timer: 1400,
          showConfirmButton: false
        });
        await this.finishAdminOAuthSignIn();
        return;
      }
      if (event.data?.type === 'TEAMS_CONNECTED' && event.data?.success) {
        const graphToken = event.data.tokens?.access_token;
        const tenantId = event.data.tokens?.tenant_id;
        if (graphToken) localStorage.setItem('microsoft_graph_token', graphToken);
        if (tenantId) localStorage.setItem('microsoft_tenant_id', tenantId);
        if (event.data.vaptfix_team) localStorage.setItem('vaptfix_team', JSON.stringify(event.data.vaptfix_team));
        if (event.data.django_access_token) localStorage.setItem('django_access_token', event.data.django_access_token);
        if (event.data.django_refresh_token) localStorage.setItem('django_refresh_token', event.data.django_refresh_token);
        if (event.data.user) localStorage.setItem('local_user', JSON.stringify(event.data.user));
        localStorage.setItem('teams_connected', 'true');
        this.adminTeamsConnected = true;
        this.adminSlackConnected = false;
        this.ensureAdminAuthSessionFromOAuth(event.data);
        await Swal.fire({
          icon: 'success',
          title: 'Microsoft Teams connected successfully',
          timer: 1400,
          showConfirmButton: false
        });
        await this.finishAdminOAuthSignIn();
      }
    },
    async onAdminStorageChange(event) {
      if (event.key === 'microsoft_graph_token' && event.newValue) {
        this.adminTeamsConnected = true;
        this.adminSlackConnected = false;
        this.ensureAdminAuthSessionFromOAuth();
        await this.finishAdminOAuthSignIn();
      }
    },
    async startUserSlackLogin() {
      const email = (this.userForm.email || '').trim();
      if (!email) {
        Swal.fire({ icon: 'warning', title: 'Email required', text: 'Enter your email first.', confirmButtonColor: '#241447' });
        return;
      }
      await this.fetchUserLoginPlatform();
      if (this.userSlackConnected && this.canRedirectConnectedUser(email, 'slack')) {
        await this.redirectUserToDashboard();
        return;
      }
      if (this.userPlatform === 'microsoft_teams') {
        Swal.fire({
          icon: 'info',
          title: 'Use Microsoft Teams',
          text: 'This account signs in with Microsoft Teams. Use the Teams button.',
          confirmButtonColor: '#241447',
        });
        return;
      }
      if (this.userPlatform === 'email') {
        Swal.fire({
          icon: 'info',
          title: 'Use email sign in',
          text: 'This account uses email and password. Sign in below.',
          confirmButtonColor: '#241447',
        });
        return;
      }

      this.userOAuthLoading = 'slack';
      sessionStorage.setItem('pending_member_email', email);
      sessionStorage.setItem('pending_member_flow', 'slack');
      try {
        const authStore = useAuthStore();
        const callbackBase = `${window.location.origin}/slack/callback?flow=member`;
        const res = await authStore.getSlackMemberOAuthUrl(callbackBase, email);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          const popup = window.open(
            res.data.auth_url,
            'SlackMemberOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.');
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Unable to start Slack login', confirmButtonColor: '#241447' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong while connecting Slack', confirmButtonColor: '#241447' });
      } finally {
        this.userOAuthLoading = false;
      }
    },
    async startUserTeamsLogin() {
      const email = (this.userForm.email || '').trim();
      if (!email) {
        Swal.fire({ icon: 'warning', title: 'Email required', text: 'Enter your email first.', confirmButtonColor: '#241447' });
        return;
      }
      await this.fetchUserLoginPlatform();
      if (this.userTeamsConnected && this.canRedirectConnectedUser(email, 'microsoft_teams')) {
        await this.redirectUserToDashboard();
        return;
      }
      if (this.userPlatform === 'slack') {
        Swal.fire({
          icon: 'info',
          title: 'Use Slack',
          text: 'This account signs in with Slack. Use the Slack button.',
          confirmButtonColor: '#241447',
        });
        return;
      }
      if (this.userPlatform === 'email') {
        Swal.fire({
          icon: 'info',
          title: 'Use email sign in',
          text: 'This account uses email and password. Sign in below.',
          confirmButtonColor: '#241447',
        });
        return;
      }

      this.userOAuthLoading = 'teams';
      sessionStorage.setItem('pending_member_email', email);
      sessionStorage.setItem('pending_member_flow', 'teams');
      try {
        const authStore = useAuthStore();
        const redirectUri = `${window.location.origin}/microsoft/callback?flow=member`;
        const res = await authStore.getMicrosoftMemberOAuthUrl(redirectUri, email);
        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;
          const popup = window.open(
            res.data.auth_url,
            'TeamsMemberOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          );
          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.');
          }
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Failed to start Microsoft Teams login', confirmButtonColor: '#241447' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Microsoft Teams login failed', confirmButtonColor: '#241447' });
      } finally {
        this.userOAuthLoading = false;
      }
    },
    closeModal() {
      this.showForm = false;
      this.formType = '';
      this.userActiveTab = 'signIn';
      this.userErrorMessage = '';
      this.adminErrorMessage = '';
      this.resetPlatformState();
      sessionStorage.removeItem('pending_member_email');
      sessionStorage.removeItem('pending_member_flow');
      this.$emit('close');
    },
    goBack() {
      this.showForm = false;
      this.formType = '';
      this.userActiveTab = 'signIn';
      this.resetForms();
    },
    selectUserSignIn() {
      this.formType = 'user';
      this.showForm = true;
      this.userActiveTab = 'signIn';
      this.scheduleUserRecaptchaRender();
    },
    selectAdminSignIn() {
      this.formType = 'admin';
      this.showForm = true;
      this.scheduleAdminRecaptchaRender();
    },
    resetForms() {
      this.userForm = { email: '', password: '' };
      this.adminForm = { email: '', password: '' };
      this.showUserPassword = false;
      this.showAdminPassword = false;
    },
    loadRecaptchaScript(onReady) {
      const done = () => {
        if (typeof onReady === 'function') onReady();
      };
      if (window.grecaptcha && typeof window.grecaptcha.render === 'function') {
        window.grecaptcha.ready(done);
        return;
      }
      if (document.getElementById('signup-modal-recaptcha-script')) {
        const poll = setInterval(() => {
          if (window.grecaptcha?.render) {
            clearInterval(poll);
            window.grecaptcha.ready(done);
          }
        }, 100);
        return;
      }
      window.__signupModalRecaptchaOnload = () => {
        window.grecaptcha?.ready(done);
      };
      const script = document.createElement('script');
      script.id = 'signup-modal-recaptcha-script';
      script.src = 'https://www.google.com/recaptcha/api.js?onload=__signupModalRecaptchaOnload&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    },
    scheduleUserRecaptchaRender() {
      clearTimeout(this._userRecaptchaTimer);
      this._userRecaptchaTimer = setTimeout(() => this.reinitializeUserRecaptcha(), 100);
    },
    scheduleAdminRecaptchaRender() {
      clearTimeout(this._adminRecaptchaTimer);
      this._adminRecaptchaTimer = setTimeout(() => this.reinitializeAdminRecaptcha(), 100);
    },
    reinitializeUserRecaptcha() {
      this.userRecaptchaWidgetId = null;
      this.userRecaptchaKey++;
      this.$nextTick(() => this.renderUserRecaptcha());
    },
    reinitializeAdminRecaptcha() {
      this.adminRecaptchaWidgetId = null;
      this.adminRecaptchaKey++;
      this.$nextTick(() => this.renderAdminRecaptcha());
    },
    renderUserRecaptcha() {
      this.loadRecaptchaScript(() => {
        const container = document.getElementById(this.userRecaptchaContainerId);
        if (!container) {
          setTimeout(() => this.renderUserRecaptcha(), 300);
          return;
        }
        if (this.userRecaptchaWidgetId !== null) return;
        container.innerHTML = '';
        try {
          this.userRecaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey
          });
        } catch (e) {
          console.error('User reCAPTCHA render error:', e);
          this.userRecaptchaWidgetId = null;
          this.userRecaptchaKey++;
          setTimeout(() => this.renderUserRecaptcha(), 300);
        }
      });
    },
    renderUserSetPasswordRecaptcha() {
      if (!window.grecaptcha) {
        setTimeout(() => this.renderUserSetPasswordRecaptcha(), 500);
        return;
      }
      window.grecaptcha.ready(() => {
        const container = document.getElementById(this.userSetPasswordRecaptchaContainerId);
        if (!container) return;
        container.innerHTML = '';
        try {
          this.userSetPasswordRecaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey
          });
        } catch (e) {
          console.error('User Set Password reCAPTCHA render error:', e);
        }
      });
    },
    renderAdminRecaptcha() {
      this.loadRecaptchaScript(() => {
        const container = document.getElementById(this.recaptchaContainerId);
        if (!container) {
          setTimeout(() => this.renderAdminRecaptcha(), 300);
          return;
        }
        if (this.adminRecaptchaWidgetId !== null) return;
        container.innerHTML = '';
        try {
          this.adminRecaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey
          });
        } catch (e) {
          console.error('Admin reCAPTCHA render error:', e);
          this.adminRecaptchaWidgetId = null;
          this.adminRecaptchaKey++;
          setTimeout(() => this.renderAdminRecaptcha(), 300);
        }
      });
    },
    async handleUserSignIn() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.userForm.email)) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address', confirmButtonColor: '#241447' });
        return;
      }
      if (!this.userForm.password || this.userForm.password.trim() === '') {
        Swal.fire({ icon: 'error', title: 'Password Required', text: 'Please enter your password', confirmButtonColor: '#241447' });
        return;
      }
      if (!window.grecaptcha || this.userRecaptchaWidgetId === null) {
        Swal.fire({ icon: 'error', title: 'Security Check', text: 'Security check not loaded. Please wait a moment and try again.', confirmButtonColor: '#241447' });
        return;
      }
      const recaptchaResponse = window.grecaptcha.getResponse(this.userRecaptchaWidgetId);
      if (!recaptchaResponse) {
        Swal.fire({ icon: 'warning', title: 'Verification Required', text: 'Please verify you are not a robot', confirmButtonColor: '#241447' });
        return;
      }
      this.userErrorMessage = '';
      this.userLoading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.userLogin({
          email: this.userForm.email,
          password: this.userForm.password,
          recaptcha: recaptchaResponse
        });
        if (result.status) {
          this.$emit('close');
          markPostLoginSuccess(result.message);
          try {
            await router.replace({ path: '/userdashboard' });
          } catch {
            await router.push({ path: '/userdashboard' });
          }
        } else {
          this.userErrorMessage = result.message || 'Invalid email or password. Please try again.';
          this.userForm.password = '';
          window.grecaptcha?.reset(this.userRecaptchaWidgetId);
        }
      } catch (err) {
        console.error('User login error:', err);
        this.userErrorMessage = 'Something went wrong. Please try again.';
        this.userForm.password = '';
        window.grecaptcha?.reset(this.userRecaptchaWidgetId);
      } finally {
        this.userLoading = false;
      }
    },
    async handleUserSetPassword() {
      if (this.userSetPasswordForm.newPassword.length < 8) {
        await Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Password must be at least 8 characters long', confirmButtonColor: '#241447', confirmButtonText: 'OK', allowOutsideClick: false });
        return;
      }
      if (this.userSetPasswordForm.newPassword !== this.userSetPasswordForm.confirmPassword) {
        await Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match. Please check and try again.', confirmButtonColor: '#241447', confirmButtonText: 'OK', allowOutsideClick: false });
        return;
      }
      const useToken = !!(this.setPasswordUidb64 && this.setPasswordToken);
      if (useToken && !this.allSetPasswordRulesPass) {
        await Swal.fire({ icon: 'error', title: 'Weak Password', text: 'Please meet all password requirements shown below.', confirmButtonColor: '#241447', confirmButtonText: 'OK', allowOutsideClick: false });
        return;
      }
      this.userSetPasswordLoading = true;
      try {
        const authStore = useAuthStore();
        const result = useToken
          ? await authStore.userSetPasswordWithToken({
              uidb64: this.setPasswordUidb64,
              token: this.setPasswordToken,
              password: this.userSetPasswordForm.newPassword,
              confirm_password: this.userSetPasswordForm.confirmPassword
            })
          : await authStore.userSetPassword({
              password: this.userSetPasswordForm.newPassword,
              confirm_password: this.userSetPasswordForm.confirmPassword
            });
        if (result.status) {
          this.userSetPasswordForm = { newPassword: '', confirmPassword: '' };
          if (result.loggedIn) {
            await Swal.fire({
              icon: 'success',
              title: 'Password Set Successfully!',
              timer: 2000,
              showConfirmButton: false,
              allowOutsideClick: false
            });
            await this.redirectUserToDashboard(result.message);
            return;
          }
          await Swal.fire({
            icon: 'success',
            title: 'Password Set Successfully!',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
              const container = document.querySelector('.swal2-container');
              if (container) container.style.zIndex = '10001';
            }
          });
          this.userActiveTab = 'signIn';
          if (this.setPasswordEmail || this.userForm.email) {
            await this.fetchUserLoginPlatform();
          }
        } else {
          await Swal.fire({ icon: 'error', title: 'Failed to Set Password', text: result.message || 'Unable to set password. Please try again.', confirmButtonColor: '#241447', confirmButtonText: 'Try Again', allowOutsideClick: false });
        }
      } catch (err) {
        console.error('Set password error:', err);
        await Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Please try again.', confirmButtonColor: '#241447', confirmButtonText: 'OK', allowOutsideClick: false });
      } finally {
        this.userSetPasswordLoading = false;
      }
    },
    async handleAdminSignIn() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.adminForm.email)) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address', confirmButtonColor: '#241447' });
        return;
      }
      if (!this.adminForm.password || this.adminForm.password.trim() === '') {
        Swal.fire({ icon: 'error', title: 'Password Required', text: 'Please enter your password', confirmButtonColor: '#241447' });
        return;
      }
      if (!window.grecaptcha || this.adminRecaptchaWidgetId === null) {
        Swal.fire({ icon: 'error', title: 'Security Check', text: 'Security check not loaded', confirmButtonColor: '#241447' });
        return;
      }
      const recaptchaResponse = window.grecaptcha.getResponse(this.adminRecaptchaWidgetId);
      if (!recaptchaResponse) {
        Swal.fire({ icon: 'warning', title: 'Verification Required', text: 'Please verify you are not a robot', confirmButtonColor: '#241447' });
        return;
      }
      this.adminErrorMessage = '';
      this.adminLoading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.login({
          email: this.adminForm.email,
          password: this.adminForm.password,
          recaptcha: recaptchaResponse
        });
        if (result.status) {
          this.$emit('close');
          markPostLoginSuccess(result.message);
          await this.checkAndRedirectAdmin();
        } else {
          this.adminErrorMessage = result.message || 'Invalid email or password. Please try again.';
          this.adminForm.password = '';
          window.grecaptcha?.reset(this.adminRecaptchaWidgetId);
        }
      } catch (err) {
        console.error('Admin login error:', err);
        this.adminErrorMessage = 'Something went wrong. Please try again.';
        this.adminForm.password = '';
        window.grecaptcha?.reset(this.adminRecaptchaWidgetId);
      } finally {
        this.adminLoading = false;
      }
    },
    openAdminSignup() {
      this.$emit('close');
      this.$emit('open-admin-signup');
    },
    async checkAndRedirectAdmin() {
      const authStore = useAuthStore();
      try {
        const [res, riskRes] = await Promise.all([
          authStore.getScopingUploadStatus(),
          authStore.fetchAdminRiskCriteria()
        ]);
        if (!res.file_uploaded) {
          this.$router.replace('/scoping-form-2');
          return;
        }
        const user = authStore.user || JSON.parse(localStorage.getItem('user') || '{}');
        const uid = user?.id || user?.email || '';
        const submittedKey = uid ? `scoping_submitted_${uid}` : 'scoping_submitted';
        localStorage.removeItem(submittedKey);
        localStorage.removeItem('scoping_completed');
        const riskCriteriaDone = riskRes.status === true;
        if (riskCriteriaDone) {
          authStore.markStepCompleted(1);
          authStore.markStepCompleted(2);
          this.$router.replace('/admindashboardonboarding');
          return;
        }
        const stepsKey = uid ? `completedSteps_${uid}` : 'completedSteps';
        const completedSteps = JSON.parse(localStorage.getItem(stepsKey) || '[]');
        const communicationDone = completedSteps.includes(1);
        if (communicationDone) {
          this.$router.replace('/riskcriteria');
        } else {
          this.$router.replace('/communication');
        }
      } catch {
        this.$router.replace('/scoping-form-2');
      }
    },
    openForgotPassword(type) {
      this.forgotType = type;
      this.showForgotModal = true;
    },
    closeForgotModal() {
      this.showForgotModal = false;
      this.forgotEmail = '';
      this.forgotLoading = false;
    },
    async handleForgotPassword() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.forgotEmail)) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.', confirmButtonColor: '#241447' });
        return;
      }
      this.forgotLoading = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.userForgotPassword({ email: this.forgotEmail });
        if (res.status) {
          this.closeForgotModal();
          Swal.fire({ icon: 'success', title: 'Reset Link Sent!', text: 'Please check your email for the password reset link.', timer: 3000, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Something went wrong.', confirmButtonColor: '#241447' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send reset link. Please try again.', confirmButtonColor: '#241447' });
      } finally {
        this.forgotLoading = false;
      }
    },
    goToUserSignUpPage() {
      this.$emit('close');
      this.$router.push('/usersignup');
    },
    goToAdminSignUpPage() {
      this.$emit('close');
      this.$router.push('/signup');
    }
  },
  beforeUnmount() {
    clearTimeout(this._platformEmailTimer);
    clearTimeout(this._userRecaptchaTimer);
    clearTimeout(this._adminRecaptchaTimer);
    window.removeEventListener('message', this.handleMemberOAuthMessage);
    window.removeEventListener('message', this.handleAdminOAuthMessage);
    window.removeEventListener('storage', this.onMemberStorageChange);
    window.removeEventListener('storage', this.onAdminStorageChange);
    try {
      if (window.grecaptcha) {
        if (this.userRecaptchaWidgetId !== null) window.grecaptcha.reset(this.userRecaptchaWidgetId);
        if (this.adminRecaptchaWidgetId !== null) window.grecaptcha.reset(this.adminRecaptchaWidgetId);
      }
    } catch (e) {}
  }
};
</script>

<style scoped>
/* Overlay */
.signin-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding-top: 68px;
  padding-right: 24px;
  z-index: 9999;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Panel */
.signin-panel {
  width: 100%;
  max-width: 440px;
  animation: slideDown 0.22s ease;
}

@keyframes slideDown {
  from { transform: translateY(-12px); opacity: 0; }
  to   { transform: translateY(0);     opacity: 1; }
}

/* Modal Content */
.modal-content {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  padding-top: 44px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  max-height: 88vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.modal-content::-webkit-scrollbar { width: 4px; }
.modal-content::-webkit-scrollbar-track { background: transparent; }
.modal-content::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 10px; }
.modal-content { scrollbar-width: thin; scrollbar-color: rgba(0,0,0,0.12) transparent; }

/* Close Button */
.btn-close-x {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 16px;
  color: #9ca3af;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 10;
}
.btn-close-x:hover { background: #f3f4f6; color: #374151; }

/* Modal Header */
.modal-header-text {
  text-align: center;
  margin-bottom: 28px;
}
.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}
.modal-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* Sign In Options */
.signup-options {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.signup-option-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  background: #f8f9fa;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s;
  text-align: left;
  width: 100%;
}
.signup-option-card:hover {
  background: #fff;
  border-color: #241447;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(36, 20, 71, 0.12);
}

.option-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  flex-shrink: 0;
}
.user-icon { background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); color: #0369a1; }
.admin-icon { background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); color: #7c3aed; }

.option-content { flex: 1; }
.option-title { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 4px 0; }
.option-desc { font-size: 12px; color: #6b7280; margin: 0; line-height: 1.4; }

.option-arrow {
  font-size: 22px;
  color: #241447;
  flex-shrink: 0;
  transition: transform 0.25s;
}
.signup-option-card:hover .option-arrow { transform: translateX(4px); }

/* Form Container */
.form-container {
  max-height: 72vh;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0,0,0,0.1) transparent;
}
.form-container::-webkit-scrollbar { width: 4px; }
.form-container::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }

/* Back Header */
.back-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.back-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #41454b;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.back-btn:hover { background: #f9fafb; border-color: #d1d5db; color: #374151; }

.form-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

.form-title--center {
  text-align: center;
  padding-right: 80px; /* offset for back button width to visually center */
}

.form-divider {
  border: none;
  border-top: 2px solid #241447;
  margin: 0 0 20px 0;
  opacity: 1;
}

/* User Tabs (Set Password | Sign In) */
.user-tabs {
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 20px;
}
.user-tab {
  flex: 1;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}
.user-tab:hover { color: #374151; }
.user-tab.active { color: #241447; border-bottom-color: #241447; }

/* Field Group */
.field-group { margin-bottom: 16px; }

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #41454b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

/* Input Row */
.input-row {
  position: relative;
  display: flex;
  align-items: center;
}
.field-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  font-size: 16px;
  z-index: 1;
  pointer-events: none;
}
.field-input {
  width: 100%;
  height: 48px;
  padding: 0 16px 0 42px;
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  transition: all 0.2s;
}
.field-input:focus {
  outline: none;
  background: #ededf8;
  box-shadow: 0 0 0 2px rgba(36, 20, 71, 0.15);
}
.field-input::placeholder { color: #9ca3af; }

.password-toggle {
  position: absolute;
  right: 14px;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}
.password-toggle:hover { color: #6b7280; }

/* Forgot Link */
.forgot-link {
  font-size: 11px;
  font-weight: 700;
  color: #0f696e;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-decoration: none;
}
.forgot-link:hover { text-decoration: underline; }

/* Password Rules */
.pwd-rules {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  margin-top: 8px;
}
.pwd-rule { display: flex; align-items: center; gap: 6px; }
.pwd-rule-fail { color: #dc3545; }
.pwd-rule-pass { color: #28a745; }
.pwd-rule i { font-size: 13px; }

/* reCAPTCHA */
.recaptcha-field { margin-bottom: 20px; }
.recaptcha-wrap {
  display: flex;
  justify-content: center;
  min-height: 78px;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  height: 52px;
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 14px;
  box-shadow: 0 4px 16px rgba(36, 20, 71, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-btn:hover:not(:disabled) { background: #1a0f38; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

/* Footer */
.footer-text {
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}
.footer-link {
  color: #0f696e;
  font-weight: 700;
  text-decoration: none;
}
.footer-link:hover { text-decoration: underline; }

.platform-hint {
  font-size: 11px;
  color: #64748b;
  margin: 6px 0 0;
  display: flex;
  align-items: center;
}
.platform-hint--ok {
  color: #0f696e;
  margin: 0 0 10px;
  line-height: 1.4;
}
.auth-suggestion {
  margin: 6px 2px 0;
  font-size: 11px;
  color: #6b7280;
  line-height: 1.35;
}
.social-signup-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 8px;
}
.social-signup-btns .social-btn {
  margin-bottom: 0;
  font-size: 11px;
  padding: 0 8px;
}
.social-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 10px;
}
.social-divider-line {
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}
.social-divider-text {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
}
.social-btn {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #111827;
  margin-bottom: 10px;
  transition: all 0.2s;
}
.social-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  filter: grayscale(0.45);
  background: #f1f5f9;
}
.social-btn-slack:hover:not(:disabled) {
  border-color: #611f69;
  background: #faf5fb;
}
.social-btn-teams:hover:not(:disabled) {
  border-color: #5059c9;
  background: #f5f6fd;
}
.social-btn-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.social-connected-btn {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #86efac;
  background: #dcfce7;
  color: #166534;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}
.social-connected-btn:hover:not(:disabled) {
  background: #bbf7d0;
  border-color: #4ade80;
}
.social-connected-btn .bi-check-circle-fill {
  color: #22c55e;
  font-size: 14px;
}

/* Error Alert */
.error-alert {
  padding: 12px 40px 12px 14px;
  border-radius: 10px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  position: relative;
}
.error-alert .bi-exclamation-circle-fill { font-size: 15px; color: #dc2626; }
.alert-close-btn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #991b1b;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 2px;
}

/* Forgot Password Modal */
.forgot-backdrop {
  z-index: 10000;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.forgot-modal {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideDown 0.22s ease;
}
.forgot-modal-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 24px;
}
.forgot-modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
}
.forgot-modal-header .modal-close {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
}
.modal-close { background: none; border: none; font-size: 28px; color: #6b7280; cursor: pointer; line-height: 1; transition: color 0.2s; }
.modal-close:hover { color: #111; }
.forgot-modal-body { padding: 24px; }

@media (max-width: 576px) {
  .signin-overlay { padding-right: 12px; padding-left: 12px; justify-content: center; }
  .signin-panel { max-width: 100%; }
  .modal-content { padding: 28px 20px; padding-top: 44px; }
}
</style>
