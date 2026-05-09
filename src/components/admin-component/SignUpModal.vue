<template>
  <div v-if="show" class="modal-backdrop" @click="closeModal">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">

        <!-- Close Button -->
        <button type="button" class="btn-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Header -->
        <div class="modal-header-text" v-if="!showForm">
          <h3 class="modal-title">Choose Sign In Type</h3>
          <p class="modal-subtitle">Select how you want to sign in</p>
        </div>

        <!-- Sign In Options -->
        <div class="signup-options" v-if="!showForm">

          <!-- User Sign In -->
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

          <!-- Admin Sign In -->
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
            <h3 class="form-title">User Sign In</h3>
          </div>

          <!-- Tabs -->
          <div class="user-tabs">
            <button
              class="user-tab"
              :class="{ active: userActiveTab === 'setPassword' }"
              @click="userActiveTab = 'setPassword'"
              type="button"
            >
              Set Password
            </button>
            <button
              class="user-tab"
              :class="{ active: userActiveTab === 'signIn' }"
              @click="userActiveTab = 'signIn'"
              type="button"
            >
              Sign In
            </button>
          </div>

          <!-- Set Password Form -->
          <form v-if="userActiveTab === 'setPassword'" @submit.prevent="handleUserSetPassword">

            <!-- New Password -->
            <div class="form-group">
              <label class="form-label">New Password</label>
              <div class="input-wrapper">
                <i class="bi bi-lock input-icon"></i>
                <input
                  :type="showUserNewPassword ? 'text' : 'password'"
                  class="form-control modal-input"
                  v-model="userSetPasswordForm.newPassword"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
                <i
                  class="bi password-toggle"
                  :class="showUserNewPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="showUserNewPassword = !showUserNewPassword"
                ></i>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <div class="input-wrapper">
                <i class="bi bi-lock input-icon"></i>
                <input
                  :type="showUserConfirmPassword ? 'text' : 'password'"
                  class="form-control modal-input"
                  v-model="userSetPasswordForm.confirmPassword"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
                <i
                  class="bi password-toggle"
                  :class="showUserConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="showUserConfirmPassword = !showUserConfirmPassword"
                ></i>
              </div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn submit-btn" :disabled="userSetPasswordLoading">
              <span v-if="userSetPasswordLoading" class="spinner-border spinner-border-sm me-2"></span>
              Set Password
            </button>

          </form>

          <!-- Sign In Form -->
          <form v-if="userActiveTab === 'signIn'" @submit.prevent="handleUserSignIn">

            <!-- Error Alert -->
            <div v-if="userErrorMessage" class="inline-alert error-alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              <span>{{ userErrorMessage }}</span>
              <button type="button" class="alert-close" @click="userErrorMessage = ''">
                <i class="bi bi-x"></i>
              </button>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS / USERNAME</label>
              <div class="input-wrapper">
                <i class="bi bi-at input-icon"></i>
                <input
                  type="email"
                  class="form-control modal-input"
                  v-model="userForm.email"
                  placeholder="name@vaptfix.com"
                  autocomplete="off"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="form-label">PASSWORD</label>
              <div class="input-wrapper">
                <i class="bi bi-lock input-icon"></i>
                <input
                  :type="showUserPassword ? 'text' : 'password'"
                  class="form-control modal-input"
                  v-model="userForm.password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <i
                  class="bi password-toggle"
                  :class="showUserPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="showUserPassword = !showUserPassword"
                ></i>
              </div>
            </div>

            <!-- Forgot Password -->
            <div class="text-end" style="margin-bottom: 16px;">
              <a href="#" @click.prevent="openForgotPassword('user')" class="forgot-link">
                FORGOT PASSWORD?
              </a>
            </div>

            <!-- reCAPTCHA -->
            <div class="form-group" style="margin-bottom: 20px;">
              <div :id="userRecaptchaContainerId" :key="userRecaptchaKey" class="recaptcha-wrapper"></div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn submit-btn" :disabled="userLoading">
              <span v-if="userLoading" class="spinner-border spinner-border-sm me-2"></span>
              SIGN IN TO DASHBOARD
            </button>

          </form>
        </div>

        <!-- Admin Sign In Form -->
        <div v-if="showForm && formType === 'admin'" class="form-container">
          <div class="back-header">
            <button class="back-btn" @click="goBack">
              <i class="bi bi-arrow-left"></i> Back
            </button>
            <h3 class="form-title">Admin Sign In</h3>
          </div>

          <form @submit.prevent="handleAdminSignIn">

            <!-- Error Alert -->
            <div v-if="adminErrorMessage" class="inline-alert error-alert">
              <i class="bi bi-exclamation-circle-fill me-2"></i>
              <span>{{ adminErrorMessage }}</span>
              <button type="button" class="alert-close" @click="adminErrorMessage = ''">
                <i class="bi bi-x"></i>
              </button>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <div class="input-wrapper">
                <i class="bi bi-at input-icon"></i>
                <input
                  type="email"
                  class="form-control modal-input"
                  v-model="adminForm.email"
                  placeholder="name@vaptfix.com"
                  autocomplete="off"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="form-label">PASSWORD</label>
              <div class="input-wrapper">
                <i class="bi bi-lock input-icon"></i>
                <input
                  :type="showAdminPassword ? 'text' : 'password'"
                  class="form-control modal-input"
                  v-model="adminForm.password"
                  placeholder="••••••••"
                  autocomplete="current-password"
                  required
                />
                <i
                  class="bi password-toggle"
                  :class="showAdminPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="showAdminPassword = !showAdminPassword"
                ></i>
              </div>
            </div>

            <!-- Forgot Password -->
            <div class="text-end mb-3">
              <a href="#" @click.prevent="openForgotPassword('admin')" class="forgot-link">
                FORGOT PASSWORD?
              </a>
            </div>

            <!-- reCAPTCHA -->
            <div class="form-group mb-3">
              <div :id="recaptchaContainerId" :key="recaptchaKey" class="recaptcha-wrapper"></div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn submit-btn" :disabled="adminLoading">
              <span v-if="adminLoading" class="spinner-border spinner-border-sm me-2"></span>
              SIGN IN TO DASHBOARD
            </button>

            <!-- Don't have account -->
            <p class="text-center mt-3 signin-text">
              Don't have an account?
              <a href="#" @click.prevent="openAdminSignup" class="signin-link">Sign Up</a>
            </p>

          </form>
        </div>

      </div>
    </div>
  </div>

  <!-- Forgot Password Modal -->
  <div v-if="showForgotModal" class="modal-backdrop forgot-backdrop" @click="closeForgotModal">
    <div class="forgot-modal" @click.stop>
      <div class="forgot-modal-header">
        <h4>Reset Password</h4>
        <button class="modal-close" @click="closeForgotModal">&times;</button>
      </div>
      <div class="forgot-modal-body">
        <p class="text-muted mb-3">Enter your registered email address and we'll send you a reset link.</p>
        <form @submit.prevent="handleForgotPassword">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input
              type="email"
              class="form-control modal-input"
              placeholder="name@work.com"
              v-model="forgotEmail"
              autocomplete="off"
              required
            />
          </div>
          <button type="submit" class="btn submit-btn w-100" :disabled="forgotLoading">
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
    }
  },
  data() {
    return {
      showForm: false,
      formType: '',
      userActiveTab: 'signIn',
      userForm: {
        email: '',
        password: ''
      },
      userSetPasswordForm: {
        newPassword: '',
        confirmPassword: ''
      },
      adminForm: {
        email: '',
        password: ''
      },
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

  },
  watch: {
    userActiveTab(newVal) {
      if (newVal === 'signIn') {
        this.$nextTick(() => {
          this.renderUserRecaptcha();
        });
      } else if (newVal === 'setPassword') {
        this.$nextTick(() => {
          this.renderUserSetPasswordRecaptcha();
        });
      }
    },
    show(newVal) {
      if (newVal) {
        // If preSelectedType is provided, skip selection screen
        if (this.preSelectedType) {
          this.formType = this.preSelectedType;
          this.showForm = true;
        } else {
          this.showForm = false;
          this.formType = '';
        }
      }
    },
    formType(newVal) {
      if (newVal === 'user' && this.showForm) {
        this.$nextTick(() => {
          this.renderUserRecaptcha();
        });
      } else if (newVal === 'admin' && this.showForm) {
        this.$nextTick(() => {
          this.renderAdminRecaptcha();
        });
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
      this.userErrorMessage = '';
      this.adminErrorMessage = '';
      this.$emit('close');
    },
    goBack() {
      this.showForm = false;
      this.formType = '';
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
      this.showAdminConfirmPassword = false;
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
            callback: (token) => {
              this.adminRecaptchaToken = token;
            },
            'expired-callback': () => {
              this.adminRecaptchaToken = '';
            }
          });
        } catch (e) {
          console.error('Admin reCAPTCHA render error:', e);
        }
      });
    },
    async handleUserSignIn() {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.userForm.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address',
          confirmButtonColor: '#241447'
        });
        return;
      }

      // Validate password is not empty
      if (!this.userForm.password || this.userForm.password.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Password Required',
          text: 'Please enter your password',
          confirmButtonColor: '#241447'
        });
        return;
      }

      // Validate reCAPTCHA
      if (!window.grecaptcha || this.userRecaptchaWidgetId === null) {
        Swal.fire({
          icon: 'error',
          title: 'Security Check',
          text: 'Security check not loaded. Please wait a moment and try again.',
          confirmButtonColor: '#241447'
        });
        return;
      }

      const recaptchaResponse = window.grecaptcha.getResponse(this.userRecaptchaWidgetId);
      if (!recaptchaResponse) {
        Swal.fire({
          icon: 'warning',
          title: 'Verification Required',
          text: 'Please verify you are not a robot',
          confirmButtonColor: '#241447'
        });
        return;
      }

      // Clear previous error
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
          // Close modal first
          this.$emit('close');

          // Redirect to user dashboard
          await this.$router.replace('/userdashboard');

          // Show success message on dashboard
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Login Successful!',
              text: result.message || 'Welcome back to your dashboard!',
              timer: 2000,
              showConfirmButton: false,
              position: 'top-end',
              toast: true,
              timerProgressBar: true
            });
          }, 300);
        } else {
          // Show inline error message
          this.userErrorMessage = result.message || 'Invalid email or password. Please try again.';
          this.userForm.password = '';
          window.grecaptcha?.reset(this.userRecaptchaWidgetId);
        }
      } catch (err) {
        console.error('User login error:', err);

        // Show inline error message
        this.userErrorMessage = 'Something went wrong. Please try again.';
        this.userForm.password = '';
        window.grecaptcha?.reset(this.userRecaptchaWidgetId);
      } finally {
        this.userLoading = false;
      }
    },
    async handleUserSetPassword() {
      // Validate password strength
      if (this.userSetPasswordForm.newPassword.length < 8) {
        await Swal.fire({
          icon: 'error',
          title: 'Weak Password',
          text: 'Password must be at least 8 characters long',
          confirmButtonColor: '#241447',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
        return;
      }

      // Validate password match
      if (this.userSetPasswordForm.newPassword !== this.userSetPasswordForm.confirmPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Password Mismatch',
          text: 'Passwords do not match. Please check and try again.',
          confirmButtonColor: '#241447',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
        return;
      }

      this.userSetPasswordLoading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.userSetPassword({
          password: this.userSetPasswordForm.newPassword,
          confirm_password: this.userSetPasswordForm.confirmPassword
        });

        if (result.status) {
          await Swal.fire({
            icon: 'success',
            title: 'Password Set Successfully!',
            text: result.message || 'You can now sign in with your new password',
            confirmButtonColor: '#241447',
            confirmButtonText: 'Continue to Sign In'
          });

          // Clear form and switch to Sign In tab
          this.userSetPasswordForm = {
            newPassword: '',
            confirmPassword: ''
          };
          this.userActiveTab = 'signIn';
        } else {
          await Swal.fire({
            icon: 'error',
            title: 'Failed to Set Password',
            text: result.message || 'Unable to set password. Please try again.',
            confirmButtonColor: '#241447',
            confirmButtonText: 'Try Again',
            allowOutsideClick: false
          });
        }
      } catch (err) {
        console.error('Set password error:', err);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#241447',
          confirmButtonText: 'OK',
          allowOutsideClick: false
        });
      } finally {
        this.userSetPasswordLoading = false;
      }
    },
    async handleAdminSignIn() {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.adminForm.email)) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address',
          confirmButtonColor: '#241447'
        });
        return;
      }

      // Validate password
      if (!this.adminForm.password || this.adminForm.password.trim() === '') {
        Swal.fire({
          icon: 'error',
          title: 'Password Required',
          text: 'Please enter your password',
          confirmButtonColor: '#241447'
        });
        return;
      }

      // Validate reCAPTCHA
      if (!window.grecaptcha || this.adminRecaptchaWidgetId === null) {
        Swal.fire({
          icon: 'error',
          title: 'Security Check',
          text: 'Security check not loaded',
          confirmButtonColor: '#241447'
        });
        return;
      }

      const recaptchaResponse = window.grecaptcha.getResponse(this.adminRecaptchaWidgetId);
      if (!recaptchaResponse) {
        Swal.fire({
          icon: 'warning',
          title: 'Verification Required',
          text: 'Please verify you are not a robot',
          confirmButtonColor: '#241447'
        });
        return;
      }

      // Clear previous error
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
          // Close modal first
          this.$emit('close');

          // Redirect and then show success
          await this.checkAndRedirectAdmin();

          // Show success toast after redirect
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Admin Login Successful!',
              text: 'Welcome to your dashboard!',
              timer: 2000,
              showConfirmButton: false,
              position: 'top-end',
              toast: true,
              timerProgressBar: true
            });
          }, 300);
        } else {
          // Show inline error message
          this.adminErrorMessage = result.message || 'Invalid email or password. Please try again.';
          this.adminForm.password = '';
          window.grecaptcha?.reset(this.adminRecaptchaWidgetId);
        }
      } catch (err) {
        console.error('Admin login error:', err);

        // Show inline error message
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
        Swal.fire({
          icon: 'error',
          title: 'Invalid Email',
          text: 'Please enter a valid email address.',
          confirmButtonColor: '#241447'
        });
        return;
      }

      this.forgotLoading = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.userForgotPassword({ email: this.forgotEmail });

        if (res.status) {
          this.closeForgotModal();
          Swal.fire({
            icon: 'success',
            title: 'Reset Link Sent!',
            text: 'Please check your email for the password reset link.',
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.message || 'Something went wrong.',
            confirmButtonColor: '#241447'
          });
        }
      } catch {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send reset link. Please try again.',
          confirmButtonColor: '#241447'
        });
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
        if (this.userRecaptchaWidgetId !== null) {
          window.grecaptcha.reset(this.userRecaptchaWidgetId);
        }
        if (this.adminRecaptchaWidgetId !== null) {
          window.grecaptcha.reset(this.adminRecaptchaWidgetId);
        }
      }
    } catch (e) {}
  }
};
</script>

<style scoped>
/* Modal Backdrop */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal Dialog */
.modal-dialog {
  width: 90%;
  max-width: 600px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Content */
.modal-content {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 32px;
  padding-top: 60px;
  padding-right: 32px;
  padding-bottom: 32px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
}

/* Slim Custom Scrollbar */
.modal-content::-webkit-scrollbar {
  width: 4px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
  margin: 10px 0;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.12);
  border-radius: 10px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

/* Firefox */
.modal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.12) transparent;
}

/* Close Button */
.btn-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #FFFFFF;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  z-index: 1000;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

/* Modal Header Text */
.modal-header-text {
  text-align: center;
  margin-bottom: 32px;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.modal-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Sign Up Options */
.signup-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Sign Up Option Card */
.signup-option-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f8f9fa;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  width: 100%;
}

.signup-option-card:hover {
  background: #fff;
  border-color: #241447;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(36, 20, 71, 0.15);
}

.option-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.user-icon {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  color: #0369a1;
}

.admin-icon {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #7c3aed;
}

.option-content {
  flex: 1;
}

.option-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 6px 0;
}

.option-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.option-arrow {
  font-size: 24px;
  color: #241447;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.signup-option-card:hover .option-arrow {
  transform: translateX(4px);
}

/* Form Container */
.form-container {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 8px;
}

.form-container::-webkit-scrollbar {
  width: 6px;
}

.form-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.form-container::-webkit-scrollbar-thumb {
  background: #241447;
  border-radius: 10px;
}

/* Back Header */
.back-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.back-btn {
  background: transparent;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.back-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  flex: 1;
}

/* User Tabs */
.user-tabs {
  display: flex;
  gap: 0;
  margin-top: 24px;
  margin-bottom: 24px;
  border-bottom: 2px solid #e5e7eb;
  position: relative;
}

.user-tab {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.user-tab:hover {
  color: #241447;
  background: rgba(36, 20, 71, 0.03);
}

.user-tab.active {
  color: #6366f1;
  border-bottom-color: #6366f1;
  font-weight: 700;
}

.user-tab.active:hover {
  background: transparent;
}

/* Inline Alert */
.inline-alert {
  padding: 12px 16px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-alert {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
}

.error-alert i.bi-exclamation-circle-fill {
  font-size: 18px;
  color: #dc2626;
}

.alert-close {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #991b1b;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.alert-close:hover {
  background: rgba(0, 0, 0, 0.1);
}

.alert-close i {
  font-size: 18px;
}

/* Form Group */
.form-group {
  margin-bottom: 18px;
}

.form-group:last-of-type {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #666;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* Input Wrapper */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #999;
  font-size: 18px;
  z-index: 1;
}

.modal-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 1px solid #ddd;
  border-radius: 12px;
  font-size: 15px;
  background: #f8f9fa;
  transition: all 0.3s;
}

.modal-input:focus {
  outline: none;
  border-color: #241447;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(36, 20, 71, 0.1);
}

.password-toggle {
  position: absolute;
  right: 16px;
  color: #999;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.2s;
  z-index: 1;
}

.password-toggle:hover {
  color: #666;
}

/* Password Rules */
.pwd-rules {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
}

.pwd-rule {
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.pwd-rule-fail {
  color: #dc3545;
}

.pwd-rule-pass {
  color: #28a745;
}

.pwd-rule i {
  font-size: 14px;
}

/* Forgot Link */
.forgot-link {
  font-size: 12px;
  color: #241447;
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.forgot-link:hover {
  text-decoration: underline;
  color: #0f696e;
}

/* Verification Group */
.verification-group {
  margin-bottom: 24px;
}

.verification-box {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.captcha-equation {
  font-size: 18px;
  font-weight: 600;
  color: #241447;
  min-width: 120px;
}

.answer-input {
  width: 80px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  text-align: center;
  background: #fff;
}

.answer-input:focus {
  outline: none;
  border-color: #241447;
  box-shadow: 0 0 0 2px rgba(36, 20, 71, 0.1);
}

.refresh-btn {
  background: #241447;
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #1a0f38;
  transform: rotate(90deg);
}

.solve-text {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
  font-style: italic;
}

/* reCAPTCHA Wrapper */
.recaptcha-wrapper {
  display: flex;
  justify-content: center;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #241447;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  margin-top: 8px;
  margin-bottom: 0;
}

.submit-btn:hover:not(:disabled) {
  background: #1a0f38;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(36, 20, 71, 0.3);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sign In Text */
.signin-text {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.signin-link {
  color: #241447;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.signin-link:hover {
  color: #0f696e;
  text-decoration: underline;
}

/* Forgot Password Modal */
.forgot-backdrop {
  z-index: 10000;
}

.forgot-modal {
  background: #fff;
  border-radius: 16px;
  width: 90%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

.forgot-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.forgot-modal-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #111;
}

.forgot-modal-body {
  padding: 24px;
}

/* OTP Container */
.otp-container {
  text-align: center;
}

.otp-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.6;
}

.otp-description strong {
  color: #241447;
  font-weight: 600;
}

.otp-inputs {
  margin: 24px 0;
}

.otp-box {
  width: 50px;
  height: 56px;
  font-size: 24px;
  font-weight: 700;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: #f8f9fa;
  transition: all 0.3s;
  color: #241447;
}

.otp-box:focus {
  outline: none;
  border-color: #241447;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(36, 20, 71, 0.1);
}

.otp-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: #fef3c7;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #fde047;
}

.otp-note-icon {
  color: #f59e0b;
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 2px;
}

.otp-note-text {
  font-size: 13px;
  color: #92400e;
  margin: 0;
  line-height: 1.5;
  text-align: left;
}

.otp-note-text strong {
  font-weight: 700;
}

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    padding: 24px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-subtitle {
    font-size: 13px;
  }

  .signup-option-card {
    padding: 16px;
  }

  .option-icon {
    width: 48px;
    height: 48px;
    font-size: 24px;
  }

  .option-title {
    font-size: 16px;
  }

  .option-desc {
    font-size: 12px;
  }
}
</style>
