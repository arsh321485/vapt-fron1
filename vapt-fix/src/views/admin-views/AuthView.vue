<template>
  <main>
    <div class="container-fluid min-vh-100">
      <div class="row min-vh-100">
        <div class="col-xl-5 col-lg-12 col-md-12 col-12 form-section">

          <!-- LOGO -->
          <div class="logo-wrapper">
            <img src="@/assets/images/vaptfix_white.png" height="38">
          </div>

          <div class="form-area text-white">
            <div class="form-wrapper w-75">

              <!-- SUB TABS -->
              <div class="sub-tabs">
                <div class="sub-tab" :class="{ active: currentMode === 'set-password' }" @click="switchMode('set-password')">
                  Set Password
                </div>
                <div class="sub-tab" :class="{ active: currentMode === 'signin' }" @click="switchMode('signin')">
                  Sign In
                </div>
              </div>

              <!-- FORM -->
              <form :key="formKey" id="authForm" @submit.prevent="handleSubmit" autocomplete="off">
                <!-- Hidden fields to trick browser autofill -->
                <input type="text" style="display:none" aria-hidden="true">
                <input type="password" style="display:none" aria-hidden="true">

                <!-- EMAIL (Sign In only) -->
                <div class="mb-2" v-if="currentMode === 'signin'">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control custom-input" placeholder="name@work.com"
                    v-model="formData.email" autocomplete="off" autocorrect="off" autocapitalize="off"
                    spellcheck="false" :name="'email_' + formKey" readonly onfocus="this.removeAttribute('readonly');"
                    required />
                </div>

                <!-- PASSWORD -->
                <div class="mb-2 password-field">
                  <label class="form-label">{{ currentMode === 'set-password' ? 'New Password' : 'Password' }}</label>
                  <div class="position-relative">
                    <input :type="showPassword ? 'text' : 'password'" class="form-control custom-input"
                      placeholder="Password" v-model="formData.password" @input="validatePassword" autocomplete="off"
                      autocorrect="off" autocapitalize="off" spellcheck="false" :name="'password_' + formKey" readonly
                      onfocus="this.removeAttribute('readonly');" required />
                    <span class="password-toggle" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                  </div>
                </div>

                <!-- PASSWORD RULES (Set Password only) -->
                <ul v-if="showPasswordRules && currentMode === 'set-password' && !allRulesValid"
                  class="password-rules mt-2 mb-1">
                  <li :class="{ valid: rules.minLength }">At least 8 characters</li>
                  <li :class="{ valid: rules.uppercase }">At least 1 uppercase letter</li>
                  <li :class="{ valid: rules.special }">At least 1 special character</li>
                </ul>

                <!-- CONFIRM PASSWORD (Set Password only) -->
                <div class="mb-2 password-confirm" v-if="currentMode === 'set-password'">
                  <label class="form-label">Confirm Password</label>
                  <div class="position-relative">
                    <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control custom-input"
                      placeholder="Confirm Password" v-model="formData.confirm_password" autocomplete="off"
                      :name="'confirm-password-' + formKey" readonly onfocus="this.removeAttribute('readonly');"
                      required />
                    <span class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                  </div>
                </div>

                <!-- FORGOT PASSWORD (Sign In only) -->
                <div class="text-end mb-2" v-if="currentMode === 'signin'">
                  <a href="#" @click.prevent="openForgotPasswordModal" class="forgot-link">Forgot Password?</a>
                </div>

                <!-- reCAPTCHA (Sign In only) -->
                <div class="mb-2 d-flex justify-content-center" v-if="currentMode === 'signin'">
                  <div :id="recaptchaContainerId" :key="recaptchaKey"></div>
                </div>

                <!-- SUBMIT -->
                <button type="submit" class="btn signup-btn w-100 mb-2" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ currentMode === 'set-password' ? 'Set Password' : 'Sign In' }}
                </button>

              </form>

            </div>
          </div>

        </div>

        <!-- RIGHT SECTION -->
        <div
          class="col-xl-7 col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-center info-section p-5">

          <h2 class="testimonial-headline text-center mb-2">
            <span class="text-white">VAPTFIX — Scan Smart. Fix Fast. Stay Secure.</span>
          </h2>
          <!-- DASHBOARD ROTATOR -->
          <div class="dashboard-slider">
            <img src="@/assets/images/slider1.png" class="dashboard-slide active" />
            <img src="@/assets/images/slider2.png" class="dashboard-slide" />
            <img src="@/assets/images/slider3.png" class="dashboard-slide" />
          </div>

          <p class="text-white fst-italic">VAPTFIX gives a clear and structured way to handle vulnerability assessments.
            Instead of juggling multiple tools and reports, everything now lives in one place.
            It's helped a team stay organised, focused, and confident in a security workflow.</p>

          <p class="text-light fw-semibold">From risk to resolution, VAPTFIX keeps everything Intune.</p>

        </div>

      </div>
    </div>

    <!-- FORGOT PASSWORD MODAL -->
    <div v-if="showForgotPasswordModal" class="modal-backdrop" @click="closeForgotPasswordModal">
      <div class="forgot-modal" @click.stop>
        <div class="forgot-modal-header">
          <h4>Reset Password</h4>
          <button class="modal-close" @click="closeForgotPasswordModal">&times;</button>
        </div>
        <div class="forgot-modal-body">
          <p class="text-light mb-3">Enter your registered email address and we'll send you a reset link.</p>
          <form @submit.prevent="handleForgotPassword">
            <div class="mb-3">
              <label class="form-label text-light">Email</label>
              <input type="email" class="form-control custom-input" placeholder="name@work.com" v-model="forgotEmail"
                autocomplete="off" readonly onfocus="this.removeAttribute('readonly');" required />
            </div>
            <button type="submit" class="btn signup-btn w-100" :disabled="forgotLoading">
              <span v-if="forgotLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ forgotLoading ? "Sending..." : "Send Reset Link" }}
            </button>
          </form>
        </div>
      </div>
    </div>

  </main>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import Swal from 'sweetalert2';

export default {
  name: "AuthView",
  data() {
    return {
      currentMode: "set-password",
      formData: {
        email: "",
        password: "",
        confirm_password: ""
      },
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      recaptchaWidgetId: null,
      recaptchaKey: 0,
      recaptchaSiteKey: "6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny",
      authStore: null,
      formKey: Date.now(),
      currentSlide: 0,
      sliderInterval: null,
      showPasswordRules: false,
      rules: {
        minLength: false,
        uppercase: false,
        special: false
      },
      showForgotPasswordModal: false,
      forgotEmail: "",
      forgotLoading: false,
      uidb64: "",
      token: "",
      linkInvalid: false,
    };
  },
  computed: {
    recaptchaContainerId() {
      return `recaptcha-user-${this.currentMode}`;
    },
    allRulesValid() {
      return this.rules.minLength && this.rules.uppercase && this.rules.special;
    },
    isSetPasswordLink() {
      return !!(this.uidb64 && this.token);
    }
  },
  methods: {
    switchMode(mode) {
      this.currentMode = mode;
      this.resetForm();
      this.formKey = Date.now();
      this.$router.replace({ path: '/auth', query: { mode } });
      this.$nextTick(() => {
        this.clearAutofill();
        this.reinitializeRecaptcha();
      });
    },
    resetForm() {
      this.formData = { email: "", password: "", confirm_password: "" };
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.showPasswordRules = false;
      this.rules = { minLength: false, uppercase: false, special: false };
    },
    clearAutofill() {
      requestAnimationFrame(() => {
        this.formData.email = "";
        this.formData.password = "";
        this.formData.confirm_password = "";
      });
    },
    validatePassword() {
      const pwd = this.formData.password;
      this.showPasswordRules = pwd.length > 0;
      this.rules.minLength = pwd.length >= 8;
      this.rules.uppercase = /[A-Z]/.test(pwd);
      this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    },
    validateForm() {
      if (this.currentMode === 'signin') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.formData.email)) {
          Swal.fire('Error', 'Please enter a valid email', 'error');
          return false;
        }
      }

      if (!this.formData.password || this.formData.password.trim() === '') {
        Swal.fire('Error', 'Please enter a password', 'error');
        return false;
      }

      if (this.currentMode === 'set-password') {
        if (!this.allRulesValid) {
          Swal.fire('Error', 'Password must be at least 8 characters, include one uppercase letter and one special character.', 'error');
          return false;
        }
      }

      if (this.currentMode === 'set-password' && this.formData.password !== this.formData.confirm_password) {
        Swal.fire('Error', 'Passwords do not match', 'error');
        return false;
      }

      if (this.currentMode === 'signin') {
        if (!window.grecaptcha || this.recaptchaWidgetId === null) {
          Swal.fire('Error', 'Security check not loaded. Please wait a moment and try again.', 'error');
          return false;
        }
        const recaptchaResponse = window.grecaptcha.getResponse(this.recaptchaWidgetId);
        if (!recaptchaResponse) {
          Swal.fire('Error', 'Please verify you are not a robot', 'error');
          return false;
        }
      }

      return true;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      if (this.currentMode === 'set-password') {
        await this.handleSetPassword();
      } else {
        const recaptchaResponse = window.grecaptcha.getResponse(this.recaptchaWidgetId);
        await this.handleSignin(recaptchaResponse);
      }
    },
    async handleSetPassword() {
      if (!this.uidb64 || !this.token) {
        Swal.fire('Error', 'Invalid or missing reset link. Please use the link sent to your email.', 'error');
        return;
      }

      this.loading = true;
      try {
        const result = await this.authStore.userSetPasswordWithToken({
          uidb64: this.uidb64,
          token: this.token,
          password: this.formData.password,
          confirm_password: this.formData.confirm_password,
        });

        if (result.status) {
          const emailFromResponse = result.data?.email || result.data?.user?.email || "";
          await Swal.fire({
            icon: 'success',
            title: 'Password Set!',
            text: result.message || 'Your password has been set successfully. Please sign in.',
            timer: 2000,
            showConfirmButton: false
          });
          this.switchMode('signin');
          if (emailFromResponse) {
            this.$nextTick(() => {
              this.formData.email = emailFromResponse;
            });
          }
        } else {
          Swal.fire('Error', result.message || 'Failed to set password.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },
    async handleSignin(recaptchaResponse) {
      this.loading = true;
      try {
        const result = await this.authStore.userLogin({
          email: this.formData.email,
          password: this.formData.password,
          recaptcha: recaptchaResponse,
        });

        if (result.status) {
          await Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: result.message || 'Welcome!',
            timer: 1500,
            showConfirmButton: false
          });
          this.$router.push('/userdashboard');
        } else {
          Swal.fire('Login Failed', result.message || 'Invalid credentials', 'error');
          this.resetRecaptcha();
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        this.resetRecaptcha();
      } finally {
        this.loading = false;
      }
    },
    openForgotPasswordModal() {
      this.showForgotPasswordModal = true;
      this.forgotEmail = "";
    },
    closeForgotPasswordModal() {
      this.showForgotPasswordModal = false;
      this.forgotEmail = "";
      this.forgotLoading = false;
    },
    async handleForgotPassword() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.forgotEmail)) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address', confirmButtonColor: '#5a44ff' });
        return;
      }
      this.forgotLoading = true;
      try {
        const response = await this.authStore.userForgotPassword({ email: this.forgotEmail });
        if (response.status) {
          this.closeForgotPasswordModal();
          await Swal.fire({ icon: 'success', title: 'Reset Link Sent!', text: 'Check your email for the password reset link.', timer: 3000, showConfirmButton: false });
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: response.message || 'Something went wrong!', confirmButtonColor: '#5a44ff' });
        }
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send reset link. Please try again.', confirmButtonColor: '#5a44ff' });
      } finally {
        this.forgotLoading = false;
      }
    },
    loadRecaptchaScript() {
      if (window.grecaptcha && window.grecaptcha.render) {
        this.initializeRecaptcha();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit";
      script.async = true;
      script.defer = true;
      window.onRecaptchaLoad = () => { this.initializeRecaptcha(); };
      document.head.appendChild(script);
    },
    initializeRecaptcha() {
      if (!window.grecaptcha) return;
      window.grecaptcha.ready(() => {
        this.$nextTick(() => {
          const container = document.getElementById(this.recaptchaContainerId);
          if (!container) return;
          container.innerHTML = '';
          try {
            this.recaptchaWidgetId = window.grecaptcha.render(container, {
              sitekey: this.recaptchaSiteKey,
              theme: "dark"
            });
          } catch (error) {
            console.error('reCAPTCHA render error:', error);
          }
        });
      });
    },
    reinitializeRecaptcha() {
      this.recaptchaKey++;
      this.recaptchaWidgetId = null;
      this.$nextTick(() => { this.initializeRecaptcha(); });
    },
    resetRecaptcha() {
      if (window.grecaptcha && this.recaptchaWidgetId !== null) {
        try { window.grecaptcha.reset(this.recaptchaWidgetId); } catch (e) {}
      }
    },
    startSlider() {
      this.sliderInterval = setInterval(() => { this.nextSlide(); }, 4000);
    },
    nextSlide() {
      const slides = document.querySelectorAll('.dashboard-slide');
      if (!slides || slides.length === 0) return;
      slides[this.currentSlide].classList.remove('active');
      slides[this.currentSlide].classList.add('prev');
      this.currentSlide = (this.currentSlide + 1) % slides.length;
      slides[this.currentSlide].classList.add('active');
      slides[this.currentSlide].classList.remove('prev');
      setTimeout(() => {
        slides.forEach((slide, index) => {
          if (index !== this.currentSlide && index !== (this.currentSlide - 1 + slides.length) % slides.length) {
            slide.classList.remove('prev');
          }
        });
      }, 1000);
    },
    stopSlider() {
      if (this.sliderInterval) {
        clearInterval(this.sliderInterval);
        this.sliderInterval = null;
      }
    },
  },
  mounted() {
    this.authStore = useAuthStore();

    // Set tab from ?mode= query param; default to set-password
    const mode = this.$route.query.mode;
    if (mode === 'signin' || mode === 'set-password') {
      this.currentMode = mode;
    }

    // Extract uid/token for set-password flow (user-side email link)
    this.uidb64 = this.$route.query.uid || this.$route.query.uidb64 || "";
    this.token = this.$route.query.token || "";

    this.loadRecaptchaScript();
    this.$nextTick(() => { this.startSlider(); });

    // Ensure URL reflects the active tab on initial load
    if (!this.$route.query.mode) {
      this.$router.replace({ path: '/auth', query: { mode: this.currentMode } });
    }
  },
  beforeUnmount() {
    this.stopSlider();
    if (window.grecaptcha && this.recaptchaWidgetId !== null) {
      try { window.grecaptcha.reset(this.recaptchaWidgetId); } catch (e) {}
    }
    if (window.onRecaptchaLoad) { delete window.onRecaptchaLoad; }
  }
};
</script>

<style scoped>

.alert-box {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 10px;
  color: #f87171;
  font-size: 13px;
  padding: 12px 16px;
}

.password-rules {
  list-style: none;
  padding-left: 0;
  font-size: 13px;
}

.password-rules li {
  color: #dc3545;
}

.password-rules li.valid {
  color: #28a745;
}

.logo-wrapper {
  position: absolute;
  top: 44px;
  left: 20%;
  transform: translateX(-50%);
  z-index: 10;
}

.form-area {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.form-wrapper {
  background: transparent;
  max-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ===== SUB TABS ===== */
.sub-tabs {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 14px;
  border-bottom: 1px solid #1f2937;
  min-height: 46px;
  height: 46px;
  flex-shrink: 0;
}

#authForm {
  flex-grow: 1;
}

.password-confirm {
  min-height: 78px;
}

.sub-tab {
  padding: 10px 0;
  cursor: pointer;
  font-weight: 500;
  opacity: 0.6;
  position: relative;
  min-width: 80px;
  text-align: center;
}

.sub-tab.active {
  opacity: 1;
  color: rgb(90, 68, 255);
}

.sub-tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgb(90, 68, 255);
}

/* ===== INPUTS ===== */
.form-label {
  color: #9ca3af;
  font-size: 13px;
  margin-bottom: 5px;
}

.custom-input {
  background: #020617;
  border: 1px solid #1f2937;
  color: #fff;
  height: 46px;
  border-radius: 10px;
}

.custom-input::placeholder {
  color: #6b7280;
}

.custom-input:focus {
  background: #020617;
  border-color: rgb(90, 68, 255);
  box-shadow: none;
  color: #fff;
}

.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  opacity: 0.7;
  color: #fff;
}

.custom-input:-webkit-autofill~.password-toggle,
.custom-input:-webkit-autofill~.password-toggle i {
  color: #020617 !important;
  opacity: 1;
}

/* ===== BUTTON ===== */
.signup-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  background: rgb(90, 68, 255);
  border: none;
  color: white;
}

.info-section {
  background-color: rgb(13, 13, 43);
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.testimonial-headline {
  color: #8b949e;
  font-size: 1.8rem;
  font-weight: 700;
}

/* ===== DASHBOARD SLIDER ===== */
.dashboard-slider {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 300px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard-slide {
  position: absolute;
  width: 100%;
  max-height: 100%;
  border-radius: 16px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  opacity: 0;
  transform: scale(0.92) translateY(30px);
  transition: opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1);
}

.dashboard-slide.active {
  opacity: 1;
  transform: scale(1) translateY(0);
  z-index: 3;
}

.dashboard-slide.prev {
  opacity: 0;
  transform: scale(0.9) translateY(-40px);
  z-index: 1;
}

@media (max-width: 768px) {
  .dashboard-slider {
    height: 260px;
  }
}

/* Left form column */
.form-section {
  background-color: rgb(9, 9, 35);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
}

.form-wrapper {
  width: 100%;
  max-width: 420px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 60px;
}

/* ===== FORGOT PASSWORD LINK ===== */
.forgot-link {
  font-size: 13px;
  color: rgb(90, 68, 255);
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

/* ===== FORGOT PASSWORD MODAL ===== */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.forgot-modal {
  background: #0d0d2b;
  border: 1px solid #1f2937;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 0;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.forgot-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid #1f2937;
  color: #fff;
}

.forgot-modal-header h4 {
  margin: 0;
  font-size: 17px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
}

.modal-close:hover {
  color: #fff;
}

.forgot-modal-body {
  padding: 20px 24px 24px;
}
</style>
