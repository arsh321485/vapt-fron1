<template>
  <div v-if="show" class="modal-backdrop" @click="closeModal">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">

        <!-- Close Button -->
        <button type="button" class="btn-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button
            class="auth-tab"
            :class="{ active: activeTab === 'user' }"
            @click="switchTab('user')"
          >
            User Sign In
          </button>
          <button
            class="auth-tab"
            :class="{ active: activeTab === 'admin' }"
            @click="switchTab('admin')"
          >
            Admin Sign In
          </button>
        </div>

        <!-- User Sign In Form -->
        <div v-if="activeTab === 'user'" class="form-container">
          <form @submit.prevent="handleUserSignIn">

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
            <div class="text-end mb-3">
              <a href="#" @click.prevent="openForgotPassword('user')" class="forgot-link">
                FORGOT PASSWORD?
              </a>
            </div>

            <!-- Verification -->
            <div class="form-group verification-group">
              <label class="form-label">VERIFICATION</label>
              <div class="verification-box">
                <div class="captcha-equation">
                  {{ userCaptcha.num1 }} × {{ userCaptcha.num2 }} + {{ userCaptcha.num3 }}
                </div>
                <input
                  type="text"
                  class="form-control answer-input"
                  v-model="userForm.answer"
                  placeholder="Ans"
                  required
                />
                <button type="button" class="refresh-btn" @click="refreshUserCaptcha">
                  <i class="bi bi-arrow-clockwise"></i>
                </button>
              </div>
              <small class="solve-text">Solve to continue</small>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn submit-btn" :disabled="userLoading">
              <span v-if="userLoading" class="spinner-border spinner-border-sm me-2"></span>
              SIGN IN TO DASHBOARD
            </button>

            <!-- Don't have account -->
            <p class="text-center mt-3 signin-text">
              Don't have an account?
              <a href="#" @click.prevent="openSignUpModal('user')" class="signin-link">Request Access</a>
            </p>

          </form>
        </div>

        <!-- Admin Sign In Form -->
        <div v-if="activeTab === 'admin'" class="form-container">
          <form @submit.prevent="handleAdminSignIn">

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
              <a href="#" @click.prevent="openSignUpModal('admin')" class="signin-link">Sign Up</a>
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
  name: 'SignInModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    defaultTab: {
      type: String,
      default: 'user'
    }
  },
  data() {
    return {
      activeTab: this.defaultTab,
      userForm: {
        email: '',
        password: '',
        answer: ''
      },
      adminForm: {
        email: '',
        password: ''
      },
      showUserPassword: false,
      showAdminPassword: false,
      userLoading: false,
      adminLoading: false,
      userCaptcha: {
        num1: 0,
        num2: 0,
        num3: 0,
        answer: 0
      },
      recaptchaWidgetId: null,
      recaptchaKey: 0,
      recaptchaSiteKey: '6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny',
      showForgotModal: false,
      forgotEmail: '',
      forgotLoading: false,
      forgotType: 'user'
    };
  },
  computed: {
    recaptchaContainerId() {
      return `recaptcha-admin-signin-${this.recaptchaKey}`;
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.activeTab = this.defaultTab;
        this.$nextTick(() => {
          if (this.activeTab === 'admin') {
            this.renderRecaptcha();
          }
        });
      }
    },
    activeTab(newVal) {
      if (newVal === 'admin' && this.show) {
        this.$nextTick(() => {
          this.renderRecaptcha();
        });
      }
    }
  },
  mounted() {
    this.refreshUserCaptcha();
    this.loadRecaptchaScript();
  },
  methods: {
    closeModal() {
      this.resetForms();
      this.$emit('close');
    },
    switchTab(tab) {
      this.activeTab = tab;
      this.resetForms();
      if (tab === 'user') {
        this.refreshUserCaptcha();
      }
    },
    resetForms() {
      this.userForm = { email: '', password: '', answer: '' };
      this.adminForm = { email: '', password: '' };
      this.showUserPassword = false;
      this.showAdminPassword = false;
    },
    refreshUserCaptcha() {
      this.userCaptcha.num1 = Math.floor(Math.random() * 10) + 1;
      this.userCaptcha.num2 = Math.floor(Math.random() * 10) + 1;
      this.userCaptcha.num3 = Math.floor(Math.random() * 10) + 1;
      this.userCaptcha.answer = (this.userCaptcha.num1 * this.userCaptcha.num2) + this.userCaptcha.num3;
    },
    loadRecaptchaScript() {
      if (window.grecaptcha) return;
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    },
    renderRecaptcha() {
      if (!window.grecaptcha) {
        setTimeout(() => this.renderRecaptcha(), 500);
        return;
      }

      window.grecaptcha.ready(() => {
        const container = document.getElementById(this.recaptchaContainerId);
        if (!container) return;

        // Clear previous widget
        container.innerHTML = '';

        try {
          this.recaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey
          });
        } catch (e) {
          console.error('reCAPTCHA render error:', e);
        }
      });
    },
    async handleUserSignIn() {
      // Validate captcha
      if (parseInt(this.userForm.answer) !== this.userCaptcha.answer) {
        Swal.fire({
          icon: 'error',
          title: 'Wrong Answer',
          text: 'Please solve the verification correctly!',
          confirmButtonColor: '#241447'
        });
        this.refreshUserCaptcha();
        this.userForm.answer = '';
        return;
      }

      this.userLoading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.userLogin({
          email: this.userForm.email,
          password: this.userForm.password
        });

        if (result.status) {
          this.$emit('close');
          this.$router.push('/auth?mode=signin');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: result.message || 'Invalid credentials',
            confirmButtonColor: '#241447'
          });
          this.refreshUserCaptcha();
          this.userForm.answer = '';
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Login request failed. Please try again.',
          confirmButtonColor: '#241447'
        });
        this.refreshUserCaptcha();
        this.userForm.answer = '';
      } finally {
        this.userLoading = false;
      }
    },
    async handleAdminSignIn() {
      // Validate recaptcha
      const recaptchaResponse = window.grecaptcha?.getResponse(this.recaptchaWidgetId);
      if (!recaptchaResponse) {
        Swal.fire({
          icon: 'warning',
          title: 'Verification Required',
          text: 'Please verify you are not a robot',
          confirmButtonColor: '#241447'
        });
        return;
      }

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
          await this.checkAndRedirectAdmin();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: result.message || 'Invalid credentials',
            confirmButtonColor: '#241447'
          });
          this.adminForm.password = '';
          window.grecaptcha?.reset(this.recaptchaWidgetId);
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Login request failed. Please try again.',
          confirmButtonColor: '#241447'
        });
        this.adminForm.password = '';
        window.grecaptcha?.reset(this.recaptchaWidgetId);
      } finally {
        this.adminLoading = false;
      }
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
    openSignUpModal(type) {
      this.$emit('close');
      this.$emit('open-signup', type);
    }
  },
  beforeUnmount() {
    try {
      if (window.grecaptcha && this.recaptchaWidgetId !== null) {
        window.grecaptcha.reset(this.recaptchaWidgetId);
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

.forgot-backdrop {
  z-index: 10000;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Modal Dialog */
.modal-dialog {
  width: 90%;
  max-width: 540px;
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
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Close Button */
.btn-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #666;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

/* Auth Tabs */
.auth-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 24px;
  border-bottom: 2px solid #e0e0e0;
}

.auth-tab {
  flex: 1;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #666;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  bottom: -2px;
}

.auth-tab.active {
  color: #241447;
  border-bottom-color: #241447;
}

.auth-tab:hover:not(.active) {
  color: #444;
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

/* Form Group */
.form-group {
  margin-bottom: 20px;
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

/* Responsive */
@media (max-width: 576px) {
  .modal-content {
    padding: 24px;
  }

  .auth-tab {
    font-size: 13px;
    padding: 10px 12px;
  }

  .modal-input {
    padding: 12px 12px 12px 40px;
    font-size: 14px;
  }

  .input-icon {
    left: 12px;
    font-size: 16px;
  }

  .captcha-equation {
    font-size: 16px;
    min-width: 100px;
  }
}
</style>
