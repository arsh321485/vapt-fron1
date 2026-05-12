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
                <input type="text" class="field-input" v-model="userForm.email" placeholder="name@vaptfix.com" autocomplete="new-password" required />
              </div>
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
            </div>

            <div class="recaptcha-field">
              <div :id="recaptchaContainerId" :key="adminRecaptchaKey" class="recaptcha-wrap"></div>
            </div>

            <button type="submit" class="submit-btn" :disabled="adminLoading">
              <span v-if="adminLoading" class="spinner-border spinner-border-sm me-2"></span>
              Sign In to Dashboard
            </button>

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
    }
  },
  data() {
    return {
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
      forgotType: 'user'
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
  },
  watch: {
    userActiveTab(newVal) {
      if (newVal === 'signIn') {
        this.$nextTick(() => this.renderUserRecaptcha());
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
        } else {
          this.showForm = false;
          this.formType = '';
        }
      }
    },
    formType(newVal) {
      if (newVal === 'user' && this.showForm) {
        this.$nextTick(() => this.renderUserRecaptcha());
      } else if (newVal === 'admin' && this.showForm) {
        this.$nextTick(() => this.renderAdminRecaptcha());
      }
    }
  },
  mounted() {
    this.loadRecaptchaScript();
  },
  methods: {
    closeModal() {
      this.showForm = false;
      this.formType = '';
      this.userActiveTab = 'signIn';
      this.userErrorMessage = '';
      this.adminErrorMessage = '';
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
    },
    selectAdminSignIn() {
      this.formType = 'admin';
      this.showForm = true;
    },
    resetForms() {
      this.userForm = { email: '', password: '' };
      this.adminForm = { email: '', password: '' };
      this.showUserPassword = false;
      this.showAdminPassword = false;
    },
    loadRecaptchaScript() {
      if (window.grecaptcha) return;
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    },
    renderUserRecaptcha() {
      if (!window.grecaptcha) {
        setTimeout(() => this.renderUserRecaptcha(), 500);
        return;
      }
      window.grecaptcha.ready(() => {
        const container = document.getElementById(this.userRecaptchaContainerId);
        if (!container) return;
        container.innerHTML = '';
        try {
          this.userRecaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey
          });
        } catch (e) {
          console.error('User reCAPTCHA render error:', e);
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
      if (!window.grecaptcha) {
        setTimeout(() => this.renderAdminRecaptcha(), 500);
        return;
      }
      window.grecaptcha.ready(() => {
        const container = document.getElementById(this.recaptchaContainerId);
        if (!container) return;
        container.innerHTML = '';
        try {
          this.adminRecaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey,
            callback: (token) => { this.adminRecaptchaToken = token; },
            'expired-callback': () => { this.adminRecaptchaToken = ''; }
          });
        } catch (e) {
          console.error('Admin reCAPTCHA render error:', e);
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
.recaptcha-wrap { display: flex; justify-content: center; }

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