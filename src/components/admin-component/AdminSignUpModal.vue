<template>
  <div v-if="show" class="signup-overlay" @click="closeModal">
    <div class="signup-panel" @click.stop>
      <div class="modal-content">

        <!-- Close Button -->
        <button type="button" class="btn-close-x" @click="closeModal">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Sign Up Form -->
        <div v-if="!otpSent" class="form-container">
          <div class="signup-header">
            <h3 class="form-title">Get Started</h3>
            <p class="form-subtitle">Create your VaptFix account to begin your security engagement</p>
          </div>
          <hr class="form-divider" />

          <form @submit.prevent="handleSignup">

            <!-- Email -->
            <div class="field-group">
              <label class="field-label">Email Address</label>
              <div class="input-row">
                <i class="bi bi-at field-icon"></i>
                <input
                  type="text"
                  class="field-input"
                  v-model="form.email"
                  placeholder="name@vaptfix.com"
                  autocomplete="new-password"
                  required
                />
              </div>
            </div>

            <!-- Password -->
            <div class="field-group">
              <label class="field-label">Password</label>
              <div class="input-row">
                <i class="bi bi-lock field-icon"></i>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  v-model="form.password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  @input="validatePassword"
                  required
                />
                <i class="bi password-toggle" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'" @click="showPassword = !showPassword"></i>
              </div>

              <!-- Password Rules — hide once all pass -->
              <div v-if="form.password && form.password.length > 0 && !allPwdRulesPass" class="pwd-rules">
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
            <div class="field-group">
              <label class="field-label">Confirm Password</label>
              <div class="input-row">
                <i class="bi bi-lock field-icon"></i>
                <input
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="field-input"
                  v-model="form.confirm_password"
                  placeholder="••••••••"
                  autocomplete="new-password"
                  required
                />
                <i class="bi password-toggle" :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'" @click="showConfirmPassword = !showConfirmPassword"></i>
              </div>
            </div>

            <!-- reCAPTCHA -->
            <div class="recaptcha-field">
              <div :id="recaptchaContainerId" :key="recaptchaKey" class="recaptcha-wrap"></div>
            </div>

            <!-- Submit Button -->
            <button type="submit" class="submit-btn" :disabled="loading || !recaptchaToken || !allPwdRulesPass">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Send OTP
            </button>

            <!-- Already have account -->
            <p class="footer-text">
              Already have an account?
              <a href="#" @click.prevent="goToSignIn" class="footer-link">Sign In</a>
            </p>

          </form>
        </div>

        <!-- OTP Verification -->
        <div v-if="otpSent" class="form-container otp-container">
          <div class="signup-header">
            <h3 class="form-title">OTP Verification</h3>
            <p class="form-subtitle">Your One-Time Password has been sent to <strong>{{ form.email }}</strong></p>
          </div>
          <hr class="form-divider" />

          <div class="otp-inputs d-flex justify-content-center gap-2 mb-4">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              type="text"
              inputmode="numeric"
              class="otp-box text-center"
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

          <button class="submit-btn" @click="handleVerifyOtp" :disabled="loading || otp.length < 6">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Verify & Continue
          </button>

          <p class="footer-text" style="margin-top: 12px;">
            <a href="#" class="footer-link" @click.prevent="goBackToSignup">
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
      form: { email: '', password: '', confirm_password: '' },
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
        this.$nextTick(() => this.renderRecaptcha());
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
    validatePassword() {},
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
            callback: (token) => { this.recaptchaToken = token; },
            'expired-callback': () => { this.recaptchaToken = ''; }
          });
        } catch (e) {
          console.error('reCAPTCHA render error:', e);
        }
      });
    },
    async handleSignup() {
      if (!this.allPwdRulesPass) {
        Swal.fire({ icon: 'warning', title: 'Weak Password', text: 'Password does not meet all requirements', confirmButtonColor: '#241447' });
        return;
      }
      if (this.form.password !== this.form.confirm_password) {
        Swal.fire({ icon: 'error', title: 'Password Mismatch', text: 'Passwords do not match', confirmButtonColor: '#241447' });
        return;
      }
      if (!this.recaptchaToken) {
        Swal.fire({ icon: 'warning', title: 'Verification Required', text: 'Please complete the reCAPTCHA', confirmButtonColor: '#241447' });
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
          Swal.fire({ icon: 'success', title: 'OTP Sent!', text: 'Please check your email for the verification code.', timer: 2500, showConfirmButton: false });
          this.$nextTick(() => { if (this.otpRefs[0]) this.otpRefs[0].focus(); });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: result.message || 'Failed to send OTP', confirmButtonColor: '#241447' });
          this.resetRecaptcha();
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Something went wrong', confirmButtonColor: '#241447' });
        this.resetRecaptcha();
      } finally {
        this.loading = false;
      }
    },
    async handleVerifyOtp() {
      if (this.otp.length < 6) {
        Swal.fire({ icon: 'warning', title: 'Incomplete OTP', text: 'Please enter the complete 6-digit OTP', confirmButtonColor: '#241447' });
        return;
      }
      this.loading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.signupVerifyOtp({ email: this.form.email, otp: this.otp });
        if (result.status) {
          this.$emit('close');
          Swal.fire({ icon: 'success', title: 'Signup Successful!', text: 'Your account has been created successfully.', timer: 2000, showConfirmButton: false });
          this.$router.push('/scoping-form-2');
        } else {
          Swal.fire({ icon: 'error', title: 'Invalid OTP', text: result.message || 'Invalid OTP. Please try again.', confirmButtonColor: '#241447' });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Something went wrong', confirmButtonColor: '#241447' });
      } finally {
        this.loading = false;
      }
    },
    handleOtpInput(event, index) {
      const value = event.target.value.replace(/\D/g, '');
      this.otpDigits.splice(index, 1, value ? value[0] : '');
      if (value && index < 5) {
        this.$nextTick(() => { if (this.otpRefs[index + 1]) this.otpRefs[index + 1].focus(); });
      }
    },
    handleOtpKeydown(event, index) {
      if (event.key === 'Backspace') {
        if (!this.otpDigits[index] && index > 0) {
          this.otpDigits.splice(index - 1, 1, '');
          this.$nextTick(() => { if (this.otpRefs[index - 1]) this.otpRefs[index - 1].focus(); });
        }
      }
    },
    handleOtpPaste(event, index) {
      event.preventDefault();
      const pasted = (event.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
      if (!pasted) return;
      const newDigits = [...this.otpDigits];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newDigits[index + i] = pasted[i];
      }
      this.otpDigits.splice(0, 6, ...newDigits);
      const nextFocus = Math.min(index + pasted.length, 5);
      this.$nextTick(() => { if (this.otpRefs[nextFocus]) this.otpRefs[nextFocus].focus(); });
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
      if (window.grecaptcha && this.recaptchaWidgetId !== null) window.grecaptcha.reset(this.recaptchaWidgetId);
    } catch (e) {}
  }
};
</script>

<style scoped>
/* Overlay — top-right, same as SignIn */
.signup-overlay {
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
.signup-panel {
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
  padding: 20px 28px 24px;
  padding-top: 38px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  max-height: 92vh;
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

/* Header */
.signup-header {
  text-align: center;
  margin-bottom: 8px;
}
.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
}
.form-subtitle {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* Divider */
.form-divider {
  border: none;
  border-top: 2px solid #241447;
  margin: 0 0 14px 0;
  opacity: 1;
}

/* Form Container */
.form-container {
  overflow-y: visible;
  padding-right: 0;
}

/* Field Group */
.field-group { margin-bottom: 12px; }

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

/* Password Rules */
.pwd-rules {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 12px;
  margin-top: 8px;
}
.pwd-rule { display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
.pwd-rule-fail { color: #dc3545; }
.pwd-rule-pass { color: #28a745; }
.pwd-rule i { font-size: 13px; }

/* reCAPTCHA */
.recaptcha-field { margin-bottom: 14px; }
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
.submit-btn:disabled { background: #241447; opacity: 1; cursor: not-allowed; }

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

/* OTP */
.otp-container { text-align: center; }

.otp-box {
  width: 48px;
  height: 52px;
  font-size: 22px;
  font-weight: 700;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: #f3f4f6;
  transition: all 0.2s;
  color: #241447;
}
.otp-box:focus {
  outline: none;
  border-color: #241447;
  background: #ededf8;
  box-shadow: 0 0 0 2px rgba(36, 20, 71, 0.15);
}

.otp-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fef3c7;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #fde047;
  text-align: left;
}
.otp-note-icon { color: #f59e0b; font-size: 16px; flex-shrink: 0; margin-top: 2px; }
.otp-note-text { font-size: 12px; color: #92400e; margin: 0; line-height: 1.5; }
.otp-note-text strong { font-weight: 700; }

@media (max-width: 576px) {
  .signup-overlay { padding-right: 12px; padding-left: 12px; justify-content: center; }
  .signup-panel { max-width: 100%; }
  .modal-content { padding: 28px 20px; padding-top: 44px; }
  .otp-box { width: 42px; height: 46px; font-size: 18px; }
}
</style>
