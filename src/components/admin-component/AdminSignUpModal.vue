<template>
  <div v-if="show" class="modal-backdrop" @click="closeModal">
    <div class="modal-dialog" @click.stop>
      <div class="modal-content">

        <!-- Close Button -->
        <button type="button" class="btn-close" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Sign Up Form -->
        <div v-if="!otpSent" class="form-container">
          <div class="text-center mb-4 signup-header">
            <h3 class="form-title">Get Started</h3>
            <p class="form-subtitle">Create your VaptFix account to begin your security engagement</p>
          </div>

          <form @submit.prevent="handleSignup">

            <!-- Email -->
            <div class="form-group">
              <label class="form-label">EMAIL ADDRESS</label>
              <div class="input-wrapper">
                <i class="bi bi-at input-icon"></i>
                <input
                  type="email"
                  class="form-control modal-input"
                  v-model="form.email"
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
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control modal-input"
                  v-model="form.password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  @input="validatePassword"
                  required
                />
                <i
                  class="bi password-toggle"
                  :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="showPassword = !showPassword"
                ></i>
              </div>

              <!-- Password Rules -->
              <div v-if="form.password && form.password.length > 0" class="pwd-rules mt-2">
                <div class="pwd-rule" :class="pwdRules.minLength ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="pwdRules.minLength ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least 8 characters
                </div>
                <div class="pwd-rule" :class="pwdRules.uppercase ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="pwdRules.uppercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one uppercase letter (A-Z)
                </div>
                <div class="pwd-rule" :class="pwdRules.lowercase ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="pwdRules.lowercase ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one lowercase letter (a-z)
                </div>
                <div class="pwd-rule" :class="pwdRules.number ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="pwdRules.number ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one number (0-9)
                </div>
                <div class="pwd-rule" :class="pwdRules.special ? 'pwd-rule-pass' : 'pwd-rule-fail'">
                  <i class="bi" :class="pwdRules.special ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"></i>
                  At least one special character (!@#$%^&*)
                </div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label class="form-label">CONFIRM PASSWORD</label>
              <div class="input-wrapper">
                <i class="bi bi-lock input-icon"></i>
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control modal-input"
                  v-model="form.confirm_password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
                <i
                  class="bi password-toggle"
                  :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"
                  @click="showConfirmPassword = !showConfirmPassword"
                ></i>
              </div>
            </div>

            <!-- reCAPTCHA -->
            <div class="form-group mb-3">
              <div :id="recaptchaContainerId" :key="recaptchaKey" class="recaptcha-wrapper"></div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="btn submit-btn" :disabled="loading || !recaptchaToken || !allPwdRulesPass">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              SEND OTP
            </button>

            <!-- Already have account -->
            <p class="text-center mt-3 signin-text">
              Already have an account?
              <a href="#" @click.prevent="goToSignIn" class="signin-link">Sign In</a>
            </p>

          </form>
        </div>

        <!-- OTP Verification -->
        <div v-if="otpSent" class="form-container otp-container">
          <div class="text-center mb-4">
            <h3 class="form-title">OTP Verification</h3>
            <p class="otp-description">Your One-Time Password (OTP) for VAPTFIX Admin Signup has been sent to <strong>{{ form.email }}</strong></p>
          </div>

          <div class="otp-inputs d-flex justify-content-center gap-2 mb-4">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              type="text"
              inputmode="numeric"
              class="form-control otp-box text-center"
              maxlength="1"
              :value="otpDigits[index]"
              @input="handleOtpInput($event, index)"
              @keydown="handleOtpKeydown($event, index)"
              @paste="handleOtpPaste($event, index)"
              :ref="el => otpRefs[index] = el"
              autocomplete="one-time-code"
            />
          </div>

          <div class="otp-note mb-4">
            <i class="bi bi-info-circle-fill otp-note-icon"></i>
            <p class="otp-note-text">
              This OTP is valid for <strong>5 minutes</strong>. Please do not share this OTP with anyone for security reasons.
            </p>
          </div>

          <button
            class="btn submit-btn w-100 mb-3"
            @click="handleVerifyOtp"
            :disabled="loading || otp.length < 6"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            VERIFY & CONTINUE
          </button>

          <p class="text-center">
            <a href="#" class="back-link" @click.prevent="goBackToSignup">
              <i class="bi bi-arrow-left me-1"></i>Back to Sign Up
            </a>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

export default {
  name: 'AdminSignUpModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirm_password: ''
      },
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      otpSent: false,
      otpDigits: ['', '', '', '', '', ''],
      otpRefs: [],
      recaptchaToken: '',
      recaptchaWidgetId: null,
      recaptchaKey: 0,
      recaptchaSiteKey: '6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny'
    };
  },
  computed: {
    recaptchaContainerId() {
      return `recaptcha-signup-modal-${this.recaptchaKey}`;
    },
    pwdRules() {
      const pwd = this.form.password || '';
      return {
        minLength: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)
      };
    },
    allPwdRulesPass() {
      return Object.values(this.pwdRules).every(Boolean);
    },
    otp() {
      return this.otpDigits.join('');
    }
  },
  watch: {
    show(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.renderRecaptcha();
        });
      }
    }
  },
  mounted() {
    this.loadRecaptchaScript();
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit('close');
    },
    resetForm() {
      this.form = { email: '', password: '', confirm_password: '' };
      this.otpSent = false;
      this.otpDigits = ['', '', '', '', '', ''];
      this.recaptchaToken = '';
      this.showPassword = false;
      this.showConfirmPassword = false;
    },
    validatePassword() {
      // Computed property handles this
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

        container.innerHTML = '';

        try {
          this.recaptchaWidgetId = window.grecaptcha.render(container, {
            sitekey: this.recaptchaSiteKey,
            callback: (token) => {
              this.recaptchaToken = token;
            },
            'expired-callback': () => {
              this.recaptchaToken = '';
            }
          });
        } catch (e) {
          console.error('reCAPTCHA render error:', e);
        }
      });
    },
    async handleSignup() {
      if (!this.allPwdRulesPass) {
        Swal.fire({
          icon: 'warning',
          title: 'Weak Password',
          text: 'Password does not meet all requirements',
          confirmButtonColor: '#241447'
        });
        return;
      }

      if (this.form.password !== this.form.confirm_password) {
        Swal.fire({
          icon: 'error',
          title: 'Password Mismatch',
          text: 'Passwords do not match',
          confirmButtonColor: '#241447'
        });
        return;
      }

      if (!this.recaptchaToken) {
        Swal.fire({
          icon: 'warning',
          title: 'Verification Required',
          text: 'Please complete the reCAPTCHA',
          confirmButtonColor: '#241447'
        });
        return;
      }

      this.loading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.signupSendOtp({
          email: this.form.email,
          password: this.form.password,
          confirm_password: this.form.confirm_password,
          recaptcha: this.recaptchaToken
        });

        if (result.status) {
          this.otpSent = true;
          this.otpDigits = ['', '', '', '', '', ''];

          Swal.fire({
            icon: 'success',
            title: 'OTP Sent!',
            text: 'Please check your email for the verification code.',
            timer: 2500,
            showConfirmButton: false
          });

          this.$nextTick(() => {
            if (this.otpRefs[0]) this.otpRefs[0].focus();
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: result.message || 'Failed to send OTP',
            confirmButtonColor: '#241447'
          });
          this.resetRecaptcha();
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong',
          confirmButtonColor: '#241447'
        });
        this.resetRecaptcha();
      } finally {
        this.loading = false;
      }
    },
    async handleVerifyOtp() {
      if (this.otp.length < 6) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete OTP',
          text: 'Please enter the complete 6-digit OTP',
          confirmButtonColor: '#241447'
        });
        return;
      }

      this.loading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.signupVerifyOtp({
          email: this.form.email,
          otp: this.otp
        });

        if (result.status) {
          this.$emit('close');
          Swal.fire({
            icon: 'success',
            title: 'Signup Successful!',
            text: 'Your account has been created successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          this.$router.push('/scoping-form-2');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Invalid OTP',
            text: result.message || 'Invalid OTP. Please try again.',
            confirmButtonColor: '#241447'
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Something went wrong',
          confirmButtonColor: '#241447'
        });
      } finally {
        this.loading = false;
      }
    },
    handleOtpInput(event, index) {
      const value = event.target.value.replace(/\D/g, '');
      this.otpDigits.splice(index, 1, value ? value[0] : '');

      if (value && index < 5) {
        this.$nextTick(() => {
          if (this.otpRefs[index + 1]) this.otpRefs[index + 1].focus();
        });
      }
    },
    handleOtpKeydown(event, index) {
      if (event.key === 'Backspace') {
        if (!this.otpDigits[index] && index > 0) {
          this.otpDigits.splice(index - 1, 1, '');
          this.$nextTick(() => {
            if (this.otpRefs[index - 1]) this.otpRefs[index - 1].focus();
          });
        }
      }
    },
    handleOtpPaste(event, index) {
      event.preventDefault();
      const pasted = (event.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6);
      if (!pasted) return;

      const newDigits = [...this.otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newDigits[index + i] = pasted[i];
      }
      this.otpDigits.splice(0, 6, ...newDigits);

      const nextFocus = Math.min(index + pasted.length, 5);
      this.$nextTick(() => {
        if (this.otpRefs[nextFocus]) this.otpRefs[nextFocus].focus();
      });
    },
    goBackToSignup() {
      this.otpSent = false;
      this.otpDigits = ['', '', '', '', '', ''];
    },
    resetRecaptcha() {
      if (window.grecaptcha && this.recaptchaWidgetId !== null) {
        window.grecaptcha.reset(this.recaptchaWidgetId);
        this.recaptchaToken = '';
      }
    },
    goToSignIn() {
      this.$emit('close');
      this.$emit('open-signin');
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
/* Same styles as SignUpModal - reusing */
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
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-dialog {
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
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

.modal-content {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 32px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

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

.form-container {
  max-height: 80vh;
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

.signup-header {
  margin-bottom: 24px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.form-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

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

.recaptcha-wrapper {
  display: flex;
  justify-content: center;
}

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

.back-link {
  color: #241447;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.back-link:hover {
  text-decoration: underline;
}

/* OTP Styles */
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

@media (max-width: 576px) {
  .modal-content {
    padding: 24px;
  }

  .otp-box {
    width: 45px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
