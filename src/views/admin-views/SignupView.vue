<template>
  <div class="signup-page">
    <div class="signup-card" :class="{ 'signup-card-otp': otpSent }">

      <!-- Logo Header -->
      <div class="text-center mb-4" :class="{ 'signup-top-header': !otpSent }">
        <img
          src="@/assets/images/vaptfix_white.png"
          alt="VaptFix"
          class="signup-logo"
        />
      </div>

      <!-- OTP Step -->
      <div v-if="otpSent" class="otp-verify-wrap">
        <header class="otp-verify-header">
          <div class="otp-brand">
            <img src="@/assets/images/vaptfix_white.png" alt="VaptFix" class="otp-brand-logo" />
          </div>
        </header>

        <div class="otp-verify-content">
          <h2 class="otp-verify-title">Admin Signup - OTP Verification</h2>
          <p class="otp-verify-sub">
            Your One-Time Password (OTP) for VAPTFIX Admin Signup is:
          </p>

          <div class="otp-inputs d-flex justify-content-center gap-2 mb-4">
            <input
              v-for="(digit, index) in 6"
              :key="index"
              type="text"
              inputmode="numeric"
              class="form-control otp-box otp-box-modern text-center"
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
            class="btn signup-btn otp-verify-btn w-100 mb-3"
            @click="handleVerifyOtp"
            :disabled="loading || otp.length < 6"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Verify & Continue
          </button>

          <p class="text-center small mt-2">
            <a href="#" class="back-link otp-back-link" @click.prevent="otpSent = false">
              <i class="bi bi-arrow-left me-1"></i>Back
            </a>
          </p>

          <footer class="otp-verify-footer">
            <p>© 2026 VAPTFIX. All rights reserved.</p>
          </footer>
        </div>
      </div>

      <!-- Signup Step -->
      <div v-else>
        <h2 class="signup-title">Get started</h2>
        <p class="signup-sub mb-4">Create your VaptFix account to begin your security engagement</p>

        <form @submit.prevent="handleSignup" autocomplete="off">
          <!-- Email -->
          <div class="mb-3">
            <label class="form-label">Email address</label>
            <input
              type="text"
              inputmode="email"
              name="new-signup-email-x7k"
              class="form-control signup-input"
              v-model="form.email"
              placeholder="Enter your email"
              autocomplete="new-password"
              readonly
              @focus="$event.target.removeAttribute('readonly')"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-3 position-relative">
            <label class="form-label">Password</label>
            <input
              :type="showPwd ? 'text' : 'password'"
              class="form-control signup-input"
              v-model="form.password"
              placeholder="Create a password"
              autocomplete="new-password"
              required
            />
            <i
              class="bi password-eye"
              :class="showPwd ? 'bi-eye-slash' : 'bi-eye'"
              @click="showPwd = !showPwd"
            ></i>
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
          <div class="mb-3 position-relative">
            <label class="form-label">Confirm password</label>
            <input
              :type="showCPwd ? 'text' : 'password'"
              class="form-control signup-input"
              v-model="form.confirm_password"
              placeholder="Re-enter your password"
              autocomplete="new-password"
              readonly
              @focus="$event.target.removeAttribute('readonly')"
              required
            />
            <i
              class="bi password-eye"
              :class="showCPwd ? 'bi-eye-slash' : 'bi-eye'"
              @click="showCPwd = !showCPwd"
            ></i>
          </div>

          <!-- reCAPTCHA (I'm not a robot) -->
          <div id="recaptcha-container" class="mb-4 d-flex justify-content-center"></div>

          <button
            type="submit"
            class="btn signup-btn w-100"
            :disabled="loading || !recaptchaToken || !allPwdRulesPass"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Send OTP
          </button>
        </form>

        <p class="text-center mt-3 small">
          Already have an account?
          <router-link to="/signin" class="signin-link">Sign In</router-link>
        </p>

      </div>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import Swal from 'sweetalert2'

export default {
  name: 'SignupView',
  data() {
    return {
      form: {
        email: '',
        password: '',
        confirm_password: ''
      },
      showPwd: false,
      showCPwd: false,
      loading: false,
      otpSent: false,
      otpDigits: ['', '', '', '', '', ''],
      otpRefs: [],
      recaptchaToken: '',
      recaptchaWidgetId: null
    }
  },
  computed: {
    pwdRules() {
      const pwd = this.form.password || '';
      return {
        minLength: pwd.length >= 8,
        uppercase: /[A-Z]/.test(pwd),
        lowercase: /[a-z]/.test(pwd),
        number:    /[0-9]/.test(pwd),
        special:   /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      };
    },
    allPwdRulesPass() {
      return Object.values(this.pwdRules).every(Boolean);
    },
    otp() {
      return this.otpDigits.join('')
    }
  },
  methods: {
    async handleSignup() {
      if (!this.allPwdRulesPass) {
        Swal.fire('Error', 'Password does not meet all requirements', 'warning')
        return
      }
      if (this.form.password !== this.form.confirm_password) {
        Swal.fire('Error', 'Passwords do not match', 'error')
        return
      }
      if (!this.recaptchaToken) {
        Swal.fire('Error', 'Please complete the reCAPTCHA', 'warning')
        return
      }

      this.loading = true
      try {
        const authStore = useAuthStore()
        const result = await authStore.signupSendOtp({
          email: this.form.email,
          password: this.form.password,
          confirm_password: this.form.confirm_password,
          recaptcha: this.recaptchaToken
        })

        if (result.status) {
          this.otpSent = true
          this.otpDigits = ['', '', '', '', '', '']
          this.$nextTick(() => {
            if (this.otpRefs[0]) this.otpRefs[0].focus()
          })
        } else {
          Swal.fire('Error', result.message || 'Failed to send OTP', 'error')
          this.resetRecaptcha()
        }
      } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong', 'error')
        this.resetRecaptcha()
      } finally {
        this.loading = false
      }
    },

    async handleVerifyOtp() {
      if (this.otp.length < 6) {
        Swal.fire('Error', 'Please enter the complete 6-digit OTP', 'warning')
        return
      }

      this.loading = true
      try {
        const authStore = useAuthStore()
        const result = await authStore.signupVerifyOtp({
          email: this.form.email,
          otp: this.otp
        })

        if (result.status) {
          this.form = { email: '', password: '', confirm_password: '' }
          this.$router.push('/scoping-form-2')
        } else {
          Swal.fire('Error', result.message || 'Invalid OTP. Please try again.', 'error')
          this.resetRecaptcha()
        }
      } catch (error) {
        Swal.fire('Error', error.message || 'Something went wrong', 'error')
        this.resetRecaptcha()
      } finally {
        this.loading = false
      }
    },

    handleOtpInput(event, index) {
      const value = event.target.value.replace(/\D/g, '')
      this.otpDigits.splice(index, 1, value ? value[0] : '')

      if (value && index < 5) {
        this.$nextTick(() => {
          if (this.otpRefs[index + 1]) this.otpRefs[index + 1].focus()
        })
      }
    },

    handleOtpKeydown(event, index) {
      if (event.key === 'Backspace') {
        if (!this.otpDigits[index] && index > 0) {
          this.otpDigits.splice(index - 1, 1, '')
          this.$nextTick(() => {
            if (this.otpRefs[index - 1]) this.otpRefs[index - 1].focus()
          })
        }
      }
    },

    handleOtpPaste(event, index) {
      event.preventDefault()
      const pasted = (event.clipboardData || window.clipboardData)
        .getData('text')
        .replace(/\D/g, '')
        .slice(0, 6)
      if (!pasted) return

      const newDigits = [...this.otpDigits]
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newDigits[index + i] = pasted[i]
      }
      this.otpDigits.splice(0, 6, ...newDigits)

      const nextFocus = Math.min(index + pasted.length, 5)
      this.$nextTick(() => {
        if (this.otpRefs[nextFocus]) this.otpRefs[nextFocus].focus()
      })
    },

    resetRecaptcha() {
      if (window.grecaptcha && this.recaptchaWidgetId !== null) {
        window.grecaptcha.reset(this.recaptchaWidgetId)
        this.recaptchaToken = ''
      }
    }
  },

  mounted() {
    // Clear any stale auth token so it doesn't get sent with signup/OTP requests
    // A leftover expired token would cause the interceptor to catch a 401 and redirect to /signin
    localStorage.removeItem('authorization')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('authenticated')
    localStorage.removeItem('user')
    localStorage.removeItem('projectDetails')
    localStorage.removeItem('scopingMethodology')

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.onload = () => {
      window.grecaptcha.ready(() => {
        const el = document.getElementById('recaptcha-container')
        if (!el) return
        this.recaptchaWidgetId = window.grecaptcha.render(el, {
          sitekey: '6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny',
          callback: (token) => {
            this.recaptchaToken = token
          },
          'expired-callback': () => {
            this.recaptchaToken = ''
          }
        })
      })
    }
    script.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
    }
    document.head.appendChild(script)
  },

  beforeUnmount() {
    try {
      if (window.grecaptcha && this.recaptchaWidgetId !== null) {
        window.grecaptcha.reset(this.recaptchaWidgetId)
      }
    } catch (e) {}
  }
}
</script>

<style scoped>
.signup-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f2d47 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.signup-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.signup-card-otp {
  max-width: 560px;
  padding: 0;
  overflow: hidden;
}

.signup-logo {
  height: 36px;
}
.signup-top-header {
  background: #241447;
  border-radius: 10px;
  padding: 14px 12px;
}

.signup-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.signup-sub {
  font-size: 13px;
  color: #7a7580;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.signup-input {
  border-radius: 8px;
  border: 1.5px solid #cbc4d0;
  font-size: 14px;
  padding: 10px 14px;
  transition: border-color 0.2s;
}

.signup-input:focus {
  border-color: #66558c;
  box-shadow: 0 0 0 3px rgba(102, 85, 140, 0.14);
}

.password-eye {
  position: absolute;
  right: 14px;
  top: 38px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.35);
  font-size: 16px;
  transition: color 0.2s;
}

.password-eye:hover {
  color: #66558c;
}

.signup-btn {
  background: linear-gradient(135deg, #5b4b84, #6f5f99);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 11px;
  transition: opacity 0.2s, transform 0.1s;
}

.signup-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.signup-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* Password Rules */
.pwd-rules {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
  padding: 10px 12px;
  background: #f8f9fc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.pwd-rule { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 500; }
.pwd-rule-pass { color: #16a34a; }
.pwd-rule-fail { color: #dc2626; }
.pwd-rule .bi { font-size: 13px; flex-shrink: 0; }

.signin-link {
  color: #66558c;
  text-decoration: none;
  font-weight: 500;
}

.signin-link:hover {
  text-decoration: underline;
}

.back-link {
  color: #66558c;
  text-decoration: none;
}

.otp-verify-header {
  background: #241447;
  padding: 24px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.otp-brand {
  display: flex;
  align-items: center;
  justify-content: center;
}

.otp-brand-logo {
  height: 26px;
}

.otp-brand-text {
  color: #ffffff;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.2px;
}

.otp-verify-content {
  padding: 36px 40px 30px;
  text-align: center;
}

.otp-verify-title {
  font-size: 32px;
  line-height: 1.2;
  font-weight: 800;
  color: #241447;
  margin-bottom: 14px;
}

.otp-verify-sub {
  color: #49454f;
  font-size: 14px;
  margin-bottom: 28px;
}

.otp-box-modern {
  width: 54px !important;
  height: 58px;
  border-color: #cbc4d0;
  border-radius: 10px;
}

.otp-note {
  max-width: 420px;
  margin: 0 auto;
  background: rgba(161, 236, 242, 0.26);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  text-align: left;
}

.otp-note-icon {
  color: #0f696e;
  font-size: 18px;
  margin-top: 1px;
  flex-shrink: 0;
}

.otp-note-text {
  margin: 0;
  font-size: 13px;
  color: #49454f;
  line-height: 1.45;
}

.otp-verify-btn {
  border-radius: 10px;
  background: #66558c;
}

.otp-verify-btn:hover:not(:disabled) {
  opacity: 0.95;
}

.otp-back-link {
  color: #66558c;
  font-weight: 500;
}

.otp-verify-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(122, 117, 128, 0.2);
}

.otp-verify-footer p {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #7a7580;
  font-weight: 600;
}

/* OTP boxes */
.otp-box {
  width: 48px !important;
  height: 52px;
  font-size: 20px;
  font-weight: 600;
  border: 2px solid #cbc4d0;
  border-radius: 10px;
  color: #0f172a;
  transition: border-color 0.2s, box-shadow 0.2s;
  padding: 0;
}

.otp-box:focus {
  border-color: #66558c;
  box-shadow: 0 0 0 3px rgba(102, 85, 140, 0.16);
}

/* Hide number input spinners */
.otp-box::-webkit-outer-spin-button,
.otp-box::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
