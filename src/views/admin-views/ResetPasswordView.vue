<template>
  <main class="reset-password-main">
    <div class="container-fluid vh-100">
      <div class="row h-100">
        <!-- FORM SECTION -->
        <div class="col-12 form-section">
          <!-- LOGO -->
          <div class="logo-wrapper">
            <img src="@/assets/images/vaptfix_white.png" height="28" alt="VAPTFIX">
          </div>

          <div class="form-area text-white">
            <div class="form-wrapper">
              <div class="reset-header mb-4">
                <h2 class="reset-title">Reset Your Password</h2>
                <p class="reset-subtitle">Enter your new password below. Make sure it's strong and secure.</p>
              </div>

              <form @submit.prevent="handleResetPassword">
                <!-- NEW PASSWORD -->
                <div class="mb-3">
                  <label for="password" class="form-label">New Password</label>
                  <div class="position-relative">
                    <input
                      :type="showPassword ? 'text' : 'password'"
                      id="password"
                      v-model="form.password"
                      class="form-control custom-input"
                      placeholder="Enter new password"
                      @input="validatePassword"
                      required
                    />
                    <span class="password-toggle" @click="showPassword = !showPassword">
                      <i :class="showPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                  </div>
                  <ul v-if="showPasswordRules" class="password-rules mt-2 mb-0">
                    <li :class="{ valid: rules.minLength }">At least 8 characters</li>
                    <li :class="{ valid: rules.uppercase }">At least 1 uppercase letter</li>
                    <li :class="{ valid: rules.special }">At least 1 special character</li>
                  </ul>
                </div>

                <!-- CONFIRM PASSWORD -->
                <div class="mb-4">
                  <label for="confirmPassword" class="form-label">Confirm New Password</label>
                  <div class="position-relative">
                    <input
                      :type="showConfirmPassword ? 'text' : 'password'"
                      id="confirmPassword"
                      v-model="form.confirm_password"
                      class="form-control custom-input"
                      placeholder="Re-enter new password"
                      required
                    />
                    <span class="password-toggle" @click="showConfirmPassword = !showConfirmPassword">
                      <i :class="showConfirmPassword ? 'bi bi-eye-slash-fill' : 'bi bi-eye-fill'"></i>
                    </span>
                  </div>
                </div>

                <!-- SUBMIT BUTTON -->
                <button
                  type="submit"
                  class="btn reset-btn w-100"
                  :disabled="loading || !isPasswordValid"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? "Resetting..." : "Reset Password" }}
                </button>

                <!-- BACK TO LOGIN -->
                <div class="text-center mt-3">
                  <a href="#" @click.prevent="$router.push('/auth')" class="back-link">
                    <i class="bi bi-arrow-left me-1"></i> Back to Sign In
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

export default {
  name: "ResetPasswordView",
  data() {
    return {
      form: {
        password: "",
        confirm_password: ""
      },
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      showPasswordRules: false,
      rules: {
        minLength: false,
        uppercase: false,
        special: false
      },
      token: "",
      uidb64: ""
    };
  },

  computed: {
    isPasswordValid() {
      return this.rules.minLength && this.rules.uppercase && this.rules.special;
    }
  },

  mounted() {
    if (this.$route.params.uidb64 && this.$route.params.token) {
      this.uidb64 = this.$route.params.uidb64;
      this.token = this.$route.params.token;
    }
    if (!this.token || !this.uidb64) {
      Swal.fire({
        icon: "error",
        title: "Invalid Link",
        text: "This reset link is invalid or has expired. Please request a new one.",
        confirmButtonColor: '#5a44ff'
      }).then(() => {
        this.$router.push("/auth");
      });
    }
  },

  methods: {
    validatePassword() {
      const pwd = this.form.password;

      this.showPasswordRules = pwd.length > 0;

      this.rules.minLength = pwd.length >= 8;
      this.rules.uppercase = /[A-Z]/.test(pwd);
      this.rules.special = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    },
  
    async handleResetPassword() {
      if (this.form.password !== this.form.confirm_password) {
        Swal.fire({
          icon: "error",
          title: "Password Mismatch",
          text: "Passwords do not match. Please try again.",
          confirmButtonColor: '#5a44ff'
        });
        return;
      }
      if (!this.isPasswordValid) {
        Swal.fire({
          icon: "error",
          title: "Invalid Password",
          text: "Password must meet all requirements.",
          confirmButtonColor: '#5a44ff'
        });
        return;
      }

      this.loading = true;

      try {
        const authStore = useAuthStore();

        const payload = {
          uidb64: this.uidb64,
          token: this.token,
          password: this.form.password,
          confirm_password: this.form.confirm_password
        };

        const response = await authStore.resetPassword(payload);

        if (response.status) {
          await Swal.fire({
            icon: "success",
            title: "Password Reset Successful!",
            text: "Your password has been reset. You can now sign in with your new password.",
            timer: 2500,
            showConfirmButton: false
          });
          this.$router.push("/auth");
        } else {
          Swal.fire({
            icon: "error",
            title: "Reset Failed",
            text: response.message || "Something went wrong. Please try again.",
            confirmButtonColor: '#5a44ff'
          });
        }
      } catch (err) {
        console.error("Reset error:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to reset password. Please try again.",
          confirmButtonColor: '#5a44ff'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* ===== MAIN CONTAINER ===== */
.reset-password-main {
  background: linear-gradient(135deg, rgb(9, 9, 35) 0%, rgb(13, 13, 43) 100%);
  min-height: 100vh;
  overflow: hidden;
}

/* ===== FORM SECTION ===== */
.form-section {
  background-color: rgb(9, 9, 35);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
}

/* ===== LOGO ===== */
.logo-wrapper {
  position: absolute;
  top: 32px;
  left: 100px;
  /* transform: translateX(-50%); */
  z-index: 10;
}

/* ===== FORM AREA ===== */
.form-area {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
}

.form-wrapper {
  background: transparent;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 460px;
  padding: 0 20px;
}

/* ===== HEADER ===== */
.reset-header {
  text-align: center;
  margin-bottom: 32px;
}

.reset-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.reset-subtitle {
  font-size: 14px;
  color: #9ca3af;
  margin: 0;
}

/* ===== FORM LABELS ===== */
.form-label {
  color: #9ca3af;
  font-size: 13px;
  margin-bottom: 6px;
  font-weight: 500;
}

/* ===== INPUTS ===== */
.custom-input {
  background: #020617;
  border: 1px solid #1f2937;
  color: #fff;
  height: 48px;
  border-radius: 10px;
  padding: 0 42px 0 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.custom-input::placeholder {
  color: #6b7280;
}

.custom-input:focus {
  background: #020617;
  border-color: rgb(90, 68, 255);
  box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.15);
  color: #fff;
  outline: none;
}

/* ===== PASSWORD TOGGLE ===== */
.password-toggle {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s ease;
}

.password-toggle:hover {
  color: rgb(90, 68, 255);
}

/* ===== PASSWORD RULES ===== */
.password-rules {
  list-style: none;
  padding-left: 0;
  font-size: 12px;
  margin-top: 8px;
}

.password-rules li {
  color: #dc3545;
  padding: 2px 0;
  transition: color 0.2s ease;
}

.password-rules li.valid {
  color: #28a745;
}

.password-rules li::before {
  content: "✗ ";
  margin-right: 4px;
}

.password-rules li.valid::before {
  content: "✓ ";
}

/* ===== SUBMIT BUTTON ===== */
.reset-btn {
  height: 50px;
  border-radius: 12px;
  font-weight: 600;
  background: rgb(90, 68, 255);
  border: none;
  color: white;
  font-size: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.reset-btn:hover:not(:disabled) {
  background: rgb(80, 58, 245);
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(90, 68, 255, 0.3);
}

.reset-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ===== BACK LINK ===== */
.back-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: rgb(90, 68, 255);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
  .logo-wrapper {
    top: 20px;
  }

  .form-wrapper {
    max-width: 100%;
    padding: 0 12px;
  }

  .reset-title {
    font-size: 24px;
  }

  .reset-subtitle {
    font-size: 13px;
  }
}

@media (max-width: 576px) {
  .custom-input {
    height: 46px;
  }

  .reset-btn {
    height: 48px;
  }
}
</style>
