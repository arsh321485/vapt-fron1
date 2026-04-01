<template>
  <main>
    <div class="container-fluid min-vh-100">
      <div class="row min-vh-100">

        <!-- LEFT: FORM -->
        <div class="col-xl-5 col-lg-12 col-md-12 col-12 form-section">

          <div class="logo-wrapper">
            <img src="@/assets/images/vaptfix_white.png" height="28">
          </div>

          <div class="form-area text-white">
            <div class="form-wrapper w-75">

              <div class="mb-3">
                <h4 class="text-white fw-bold mb-1">Set Your Password</h4>
                <p class="text-muted-custom">Create a secure password to access your account.</p>
              </div>

              <!-- SUCCESS STATE -->
              <div v-if="success" class="success-box">
                <i class="bi bi-check-circle-fill success-icon"></i>
                <p class="mt-3 mb-1 fw-semibold">Password Set Successfully!</p>
                <p class="text-muted-custom mb-3">You can now sign in with your new password.</p>
                <button class="btn signup-btn w-100" @click="$router.push('/auth')">
                  Go to Sign In
                </button>
              </div>

              <!-- FORM -->
              <form v-else @submit.prevent="handleSubmit" autocomplete="off">
                <input type="text" style="display:none" aria-hidden="true">
                <input type="password" style="display:none" aria-hidden="true">

                <!-- NEW PASSWORD -->
                <div class="mb-2">
                  <label class="form-label">New Password</label>
                  <div class="position-relative">
                    <input :type="showPassword ? 'text' : 'password'" class="form-control custom-input"
                      placeholder="Enter new password" v-model="password" @input="validatePassword"
                      autocomplete="new-password" required />
                    <span class="password-toggle" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                  </div>
                </div>

                <!-- PASSWORD RULES -->
                <ul v-if="showPasswordRules && !allRulesValid" class="password-rules mt-1 mb-2">
                  <li :class="{ valid: rules.minLength }">At least 8 characters</li>
                  <li :class="{ valid: rules.uppercase }">At least 1 uppercase letter</li>
                  <li :class="{ valid: rules.special }">At least 1 special character</li>
                </ul>

                <!-- CONFIRM PASSWORD -->
                <div class="mb-3">
                  <label class="form-label">Confirm Password</label>
                  <div class="position-relative">
                    <input :type="showConfirmPassword ? 'text' : 'password'" class="form-control custom-input"
                      placeholder="Confirm new password" v-model="confirmPassword"
                      autocomplete="new-password" required />
                    <span class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                  </div>
                </div>

                <!-- INVALID LINK -->
                <div v-if="linkInvalid" class="alert-box mb-3">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  This link is invalid or has expired. Please contact your administrator.
                </div>

                <button type="submit" class="btn signup-btn w-100" :disabled="loading || linkInvalid">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Set Password
                </button>

                <p class="text-center mt-3 mb-0 back-link">
                  Already have an account?
                  <a href="#" @click.prevent="$router.push('/auth')">Sign In</a>
                </p>
              </form>

            </div>
          </div>
        </div>

        <!-- RIGHT: INFO PANEL -->
        <div class="col-xl-7 col-lg-12 col-md-12 col-12 d-flex flex-column justify-content-center align-items-center info-section p-5">
          <h2 class="testimonial-headline text-center mb-2">
            <span class="text-white">VAPTFIX — Scan Smart. Fix Fast. Stay Secure.</span>
          </h2>
          <div class="dashboard-slider">
            <img src="@/assets/images/slider1.png" class="dashboard-slide active" />
            <img src="@/assets/images/slider2.png" class="dashboard-slide" />
            <img src="@/assets/images/slider3.png" class="dashboard-slide" />
          </div>
          <p class="text-white fst-italic">VAPTFIX gives a clear and structured way to handle vulnerability assessments.
            Instead of juggling multiple tools and reports, everything now lives in one place.</p>
          <p class="text-light fw-semibold">From risk to resolution, VAPTFIX keeps everything Intune.</p>
        </div>

      </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

export default {
  name: 'UserSetPasswordView',
  data() {
    return {
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      success: false,
      linkInvalid: false,
      showPasswordRules: false,
      rules: { minLength: false, uppercase: false, special: false },
      currentSlide: 0,
      sliderInterval: null,
    };
  },
  computed: {
    allRulesValid() {
      return this.rules.minLength && this.rules.uppercase && this.rules.special;
    }
  },
  methods: {
    validatePassword() {
      const pwd = this.password;
      this.showPasswordRules = pwd.length > 0;
      this.rules.minLength = pwd.length >= 8;
      this.rules.uppercase = /[A-Z]/.test(pwd);
      this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    },
    async handleSubmit() {
      if (!this.allRulesValid) {
        Swal.fire('Error', 'Password must be at least 8 characters, include one uppercase letter and one special character.', 'error');
        return;
      }
      if (this.password !== this.confirmPassword) {
        Swal.fire('Error', 'Passwords do not match.', 'error');
        return;
      }

      const { uidb64, token } = this.$route.params;
      if (!uidb64 || !token) {
        this.linkInvalid = true;
        return;
      }

      this.loading = true;
      try {
        const authStore = useAuthStore();
        const result = await authStore.userSetPasswordWithToken({
          uidb64,
          token,
          password: this.password,
          confirm_password: this.confirmPassword,
        });

        if (result.status) {
          this.success = true;
        } else {
          if (result.message?.toLowerCase().includes('invalid') || result.message?.toLowerCase().includes('expired')) {
            this.linkInvalid = true;
          }
          Swal.fire('Error', result.message || 'Failed to set password.', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
      } finally {
        this.loading = false;
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
      if (this.sliderInterval) { clearInterval(this.sliderInterval); this.sliderInterval = null; }
    },
  },
  mounted() {
    this.$nextTick(() => { this.startSlider(); });
  },
  beforeUnmount() {
    this.stopSlider();
  }
};
</script>

<style scoped>
.form-section {
  background-color: rgb(9, 9, 35);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
}

.logo-wrapper {
  position: absolute;
  top: 28px;
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
  width: 100%;
  max-width: 420px;
  padding-top: 60px;
  padding-bottom: 40px;
}

.text-muted-custom {
  color: #9ca3af;
  font-size: 13px;
}

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

.custom-input::placeholder { color: #6b7280; }

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

.password-rules {
  list-style: none;
  padding-left: 0;
  font-size: 13px;
}

.password-rules li { color: #dc3545; }
.password-rules li.valid { color: #28a745; }

.signup-btn {
  height: 48px;
  border-radius: 12px;
  font-weight: 600;
  background: rgb(90, 68, 255);
  border: none;
  color: white;
}

.success-box {
  text-align: center;
  padding: 32px 0;
}

.success-icon {
  font-size: 56px;
  color: #28a745;
}

.alert-box {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 10px;
  color: #f87171;
  font-size: 13px;
  padding: 12px 16px;
}

.back-link {
  font-size: 13px;
  color: #9ca3af;
}

.back-link a {
  color: rgb(90, 68, 255);
  text-decoration: none;
  font-weight: 600;
}

.info-section {
  background-color: rgb(13, 13, 43);
  position: relative;
  overflow: hidden;
}

.testimonial-headline {
  color: #8b949e;
  font-size: 1.8rem;
  font-weight: 700;
}

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
  .dashboard-slider { height: 200px; }
}
</style>
