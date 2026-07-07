<template>
  <div class="signin-page">
    <div class="signin-card">

      <!-- Logo Header -->
      <div class="text-center mb-4 signin-top-header">
        <img src="@/assets/images/vaptfix_white.png" alt="VaptFix" class="signin-logo" />
      </div>

      <h2 class="signin-title">Welcome back</h2>
      <p class="signin-sub mb-4">Sign in to your VaptFix account</p>

      <form @submit.prevent="handleLogin" autocomplete="off">
        <!-- Email -->
        <div class="mb-3">
          <label class="form-label">Email address</label>
          <input
            type="email"
            class="form-control signin-input"
            v-model="form.email"
            placeholder="Enter your email"
            required
          />
        </div>

        <!-- Password -->
        <div class="mb-2 position-relative">
          <label class="form-label">Password</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control signin-input"
            v-model="form.password"
            placeholder="Enter your password"
            required
          />
          <i
            class="bi password-eye"
            :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"
            @click="showPassword = !showPassword"
          ></i>
        </div>

        <div class="text-end mb-3">
          <a href="#" @click.prevent="showForgotModal = true" class="forgot-link">Forgot password?</a>
        </div>

        <!-- reCAPTCHA -->
        <div id="recaptcha-container" class="mb-4 d-flex justify-content-center"></div>

        <button
          type="submit"
          class="btn signin-btn w-100"
          :disabled="loading"
        >
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Sign In
        </button>

        <div class="social-divider">
          <span class="social-divider-line"></span>
          <span class="social-divider-text">or</span>
          <span class="social-divider-line"></span>
        </div>

        <div class="social-signin-btns">
          <button
            v-if="!slackConnected"
            type="button"
            class="social-btn social-btn-slack"
            :disabled="oauthLoading === 'teams'"
            @click.prevent="startSlackLogin"
          >
            <span v-if="oauthLoading === 'slack'" class="spinner-border spinner-border-sm"></span>
            <template v-else>
              <img :src="slackIcon" alt="" class="social-btn-icon" />
              Sign in with Slack
            </template>
          </button>
          <button
            v-else
            type="button"
            class="social-connected-btn social-connected-slack"
            :disabled="oauthLoading === 'teams'"
            @click.prevent="startSlackLogin"
          >
            <img :src="slackIcon" alt="" class="social-btn-icon" />
            <i class="bi bi-check-circle-fill"></i>
            Slack connected
          </button>

          <button
            v-if="!teamsConnected"
            type="button"
            class="social-btn social-btn-teams"
            :disabled="oauthLoading === 'slack'"
            @click.prevent="startTeamsLogin"
          >
            <span v-if="oauthLoading === 'teams'" class="spinner-border spinner-border-sm"></span>
            <template v-else>
              <img :src="teamsIcon" alt="" class="social-btn-icon" />
              Sign in with Teams
            </template>
          </button>
          <button
            v-else
            type="button"
            class="social-connected-btn social-connected-teams"
            :disabled="oauthLoading === 'slack'"
            @click.prevent="startTeamsLogin"
          >
            <img :src="teamsIcon" alt="" class="social-btn-icon" />
            <i class="bi bi-check-circle-fill"></i>
            Teams connected
          </button>
        </div>
      </form>

      <p class="text-center mt-3 small">
        Don't have an account?
        <router-link to="/signup" class="signup-link">Sign Up</router-link>
      </p>

    </div>
  </div>

  <!-- FORGOT PASSWORD MODAL -->
  <div v-if="showForgotModal" class="fp-backdrop" @click="closeForgotModal">
    <div class="fp-modal" @click.stop>
      <div class="fp-modal-header">
        <h5 class="fp-modal-title">Reset Password</h5>
        <button class="fp-close" @click="closeForgotModal">&times;</button>
      </div>
      <div class="fp-modal-body">
        <p class="fp-desc">Enter your registered email address and we'll send you a reset link.</p>
        <form @submit.prevent="handleForgotPassword">
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              class="form-control signin-input"
              placeholder="name@work.com"
              v-model="forgotEmail"
              autocomplete="off"
              required
            />
          </div>
          <button type="submit" class="btn signin-btn w-100" :disabled="forgotLoading">
            <span v-if="forgotLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ forgotLoading ? 'Sending...' : 'Send Reset Link' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore'
import { markPostLoginSuccess } from '@/utils/postLoginSuccess'
import Swal from 'sweetalert2'
import teamsIcon from '@/assets/images/teams.png'
import slackIcon from '@/assets/images/slack.png'

export default {
  name: 'SignInView',
  data() {
    return {
      form: { email: '', password: '' },
      showPassword: false,
      loading: false,
      oauthLoading: false,
      recaptchaWidgetId: null,
      showForgotModal: false,
      forgotEmail: '',
      forgotLoading: false,
      slackConnected: false,
      teamsConnected: false,
      teamsIcon,
      slackIcon,
      backendBase: 'https://vaptbackend.secureitlab.com'
    }
  },
  methods: {
    async syncConnectionState() {
      this.teamsConnected = !!(
        localStorage.getItem('microsoft_graph_token') || localStorage.getItem('teams_connected') === 'true'
      )
      const botToken = localStorage.getItem('slack_bot_token')
      if (!botToken) {
        this.slackConnected = false
        return
      }
      try {
        const authStore = useAuthStore()
        const validateRes = await authStore.validateSlackToken(botToken)
        this.slackConnected = !!validateRes.success
      } catch {
        this.slackConnected = false
      }
    },
    ensureOAuthSession(payload = null) {
      const djangoAccessToken =
        payload?.django_access_token || localStorage.getItem('django_access_token')
      const djangoRefreshToken =
        payload?.django_refresh_token || localStorage.getItem('django_refresh_token')
      const oauthUser = payload?.user || JSON.parse(localStorage.getItem('local_user') || 'null')
      if (!djangoAccessToken) return false
      try {
        const authStore = useAuthStore()
        if (typeof authStore.setAuth === 'function') {
          authStore.setAuth(djangoAccessToken, oauthUser || authStore.user || {})
        }
      } catch (e) {
        console.error('Failed to hydrate session from OAuth:', e)
      }
      sessionStorage.setItem('authorization', djangoAccessToken)
      if (djangoRefreshToken) sessionStorage.setItem('refreshToken', djangoRefreshToken)
      sessionStorage.setItem('authenticated', 'true')
      return true
    },
    async finishOAuthSignIn() {
      const hasSession = this.ensureOAuthSession() ||
        !!sessionStorage.getItem('authorization') ||
        sessionStorage.getItem('authenticated') === 'true'
      if (!hasSession) return
      await this.checkAndRedirect()
    },
    async startSlackLogin() {
      if (this.slackConnected) {
        await this.finishOAuthSignIn()
        return
      }
      this.oauthLoading = 'slack'
      try {
        const authStore = useAuthStore()
        const adminId = authStore.user?._id || authStore.user?.id || null
        const res = await authStore.getSlackOAuthUrl(this.backendBase, adminId)
        if (res.status && res.data?.auth_url) {
          const width = 1000
          const height = 700
          const left = window.screenX + (window.outerWidth - width) / 2
          const top = window.screenY + (window.outerHeight - height) / 2
          const popup = window.open(
            res.data.auth_url,
            'SlackOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          )
          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.')
          }
        } else {
          Swal.fire('Error', 'Unable to start Slack login', 'error')
        }
      } catch {
        Swal.fire('Error', 'Something went wrong while connecting Slack', 'error')
      } finally {
        this.oauthLoading = false
      }
    },
    async startTeamsLogin() {
      if (this.teamsConnected) {
        await this.finishOAuthSignIn()
        return
      }
      this.oauthLoading = 'teams'
      try {
        const authStore = useAuthStore()
        const adminId = authStore.user?._id || authStore.user?.id || null
        const redirectUri = `${window.location.origin}/microsoft/callback`
        const res = await authStore.getMicrosoftOAuthUrl(redirectUri, adminId)
        if (res.status && res.data?.auth_url) {
          const width = 1000
          const height = 700
          const left = window.screenX + (window.outerWidth - width) / 2
          const top = window.screenY + (window.outerHeight - height) / 2
          const popup = window.open(
            res.data.auth_url,
            'TeamsOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          )
          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.')
          }
        } else {
          Swal.fire('Error', 'Failed to start Microsoft Teams login', 'error')
        }
      } catch {
        Swal.fire('Error', 'Microsoft Teams login failed', 'error')
      } finally {
        this.oauthLoading = false
      }
    },
    async handleAdminOAuthMessage(event) {
      const allowed = [window.location.origin, 'https://vaptbackend.secureitlab.com']
      if (event.origin && !allowed.includes(event.origin)) return
      if (event.data?.type === 'SLACK_CONNECTED') {
        if (event.data.bot_token) localStorage.setItem('slack_bot_token', event.data.bot_token)
        if (event.data.slack_user_id) localStorage.setItem('slack_user_id', event.data.slack_user_id)
        if (event.data.django_access_token) localStorage.setItem('django_access_token', event.data.django_access_token)
        if (event.data.user) localStorage.setItem('local_user', JSON.stringify(event.data.user))
        this.slackConnected = true
        this.teamsConnected = false
        this.ensureOAuthSession(event.data)
        await this.finishOAuthSignIn()
        return
      }
      if (event.data?.type === 'TEAMS_CONNECTED' && event.data?.success) {
        const graphToken = event.data.tokens?.access_token
        const tenantId = event.data.tokens?.tenant_id
        if (graphToken) localStorage.setItem('microsoft_graph_token', graphToken)
        if (tenantId) localStorage.setItem('microsoft_tenant_id', tenantId)
        if (event.data.vaptfix_team) localStorage.setItem('vaptfix_team', JSON.stringify(event.data.vaptfix_team))
        if (event.data.django_access_token) localStorage.setItem('django_access_token', event.data.django_access_token)
        if (event.data.django_refresh_token) localStorage.setItem('django_refresh_token', event.data.django_refresh_token)
        if (event.data.user) localStorage.setItem('local_user', JSON.stringify(event.data.user))
        localStorage.setItem('teams_connected', 'true')
        this.teamsConnected = true
        this.slackConnected = false
        this.ensureOAuthSession(event.data)
        await this.finishOAuthSignIn()
      }
    },
    async onOAuthStorageChange(event) {
      if (event.key === 'microsoft_graph_token' && event.newValue) {
        this.teamsConnected = true
        this.slackConnected = false
        this.ensureOAuthSession()
        await this.finishOAuthSignIn()
      }
    },
    async handleLogin() {
      const recaptchaResponse = window.grecaptcha?.getResponse(this.recaptchaWidgetId)
      if (!recaptchaResponse) {
        Swal.fire('Error', 'Please verify you are not a robot', 'warning')
        return
      }

      this.loading = true
      try {
        const authStore = useAuthStore()
        const result = await authStore.login({
          email: this.form.email,
          password: this.form.password,
          recaptcha: recaptchaResponse,
        })

        if (result.status) {
          markPostLoginSuccess(result.message)
          await this.checkAndRedirect()
        } else {
          Swal.fire('Error', result.message || 'Login failed', 'error')
          this.form.password = ''
          window.grecaptcha?.reset(this.recaptchaWidgetId)
        }
      } catch (err) {
        Swal.fire('Error', 'Login request failed. Please try again.', 'error')
        this.form.password = ''
        window.grecaptcha?.reset(this.recaptchaWidgetId)
      } finally {
        this.loading = false
      }
    },

    async handleGoogleResponse(response) {
      try {
        const authStore = useAuthStore()
        const result = await authStore.googleLogin(response.credential)
        if (!result.status) {
          Swal.fire('Error', result.message || 'Google login failed', 'error')
          return
        }
        markPostLoginSuccess(result.message)
        await this.checkAndRedirect()
      } catch (error) {
        Swal.fire('Error', 'Something went wrong during Google login', 'error')
      }
    },

    closeForgotModal() {
      this.showForgotModal = false;
      this.forgotEmail = '';
      this.forgotLoading = false;
    },
    async handleForgotPassword() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.forgotEmail)) {
        Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Please enter a valid email address.', confirmButtonColor: '#4f46e5' });
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
          Swal.fire({ icon: 'error', title: 'Error', text: res.message || 'Something went wrong.', confirmButtonColor: '#4f46e5' });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to send reset link. Please try again.', confirmButtonColor: '#4f46e5' });
      } finally {
        this.forgotLoading = false;
      }
    },

    async checkAndRedirect() {
      const authStore = useAuthStore()

      // If logged-in user is a user (not admin) → redirect to user dashboard
      const loggedUser = authStore.user || JSON.parse(localStorage.getItem('user') || 'null') || {}
      const userType = String(loggedUser?.user_type || loggedUser?.type || loggedUser?.role || '').toLowerCase()
      if (userType === 'user' || userType === 'member' || userType === 'internal' || userType === 'external') {
        this.$router.replace('/userdashboard')
        return
      }

      try {
        // Run onboarding checks in parallel to reduce post-login wait.
        const [res, riskRes] = await Promise.all([
          authStore.getScopingUploadStatus(),
          authStore.fetchAdminRiskCriteria(),
        ])

        if (!res.file_uploaded) {
          this.$router.replace('/scoping-form-2')
          return
        }

        // File uploaded — clear scoping keys
        const user = authStore.user || JSON.parse(localStorage.getItem('user') || '{}')
        const uid = user?.id || user?.email || ''
        const submittedKey = uid ? `scoping_submitted_${uid}` : 'scoping_submitted'
        localStorage.removeItem(submittedKey)
        localStorage.removeItem('scoping_completed')

        // Check risk criteria from backend (source of truth for step 2)
        const riskCriteriaDone = riskRes.status === true

        if (riskCriteriaDone) {
          // Risk criteria already set → all onboarding done → sync store and go to dashboard
          authStore.markStepCompleted(1)
          authStore.markStepCompleted(2)
          this.$router.replace('/admindashboardonboarding')
          return
        }

        // Risk criteria not set — check communication step via user-scoped localStorage
        const stepsKey = uid ? `completedSteps_${uid}` : 'completedSteps'
        const completedSteps = JSON.parse(localStorage.getItem(stepsKey) || '[]')
        const communicationDone = completedSteps.includes(1)

        if (communicationDone) {
          this.$router.replace('/riskcriteria')
        } else {
          this.$router.replace('/communication')
        }
      } catch {
        this.$router.replace('/scoping-form-2')
      }
    }
  },

  mounted() {
    this.syncConnectionState()
    window.addEventListener('message', this.handleAdminOAuthMessage)
    window.addEventListener('storage', this.onOAuthStorageChange)

    const googleScript = document.createElement('script')
    googleScript.src = 'https://accounts.google.com/gsi/client'
    googleScript.async = true
    googleScript.defer = true
    googleScript.onload = () => {
      google.accounts.id.initialize({
        client_id: '727499952932-0v6984jl4eg37ak60d4851vkbkf0itb7.apps.googleusercontent.com',
        callback: this.handleGoogleResponse,
      })
    }
    googleScript.onerror = () => {
      console.error('Failed to load Google Sign-In script')
    }
    document.head.appendChild(googleScript)

    const recaptchaScript = document.createElement('script')
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    recaptchaScript.async = true
    recaptchaScript.defer = true
    recaptchaScript.onload = () => {
      window.grecaptcha.ready(() => {
        const el = document.getElementById('recaptcha-container')
        if (!el) return
        this.recaptchaWidgetId = window.grecaptcha.render(el, {
          sitekey: '6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny',
        })
      })
    }
    recaptchaScript.onerror = () => {
      console.error('Failed to load reCAPTCHA script')
    }
    document.head.appendChild(recaptchaScript)
  },

  beforeUnmount() {
    window.removeEventListener('message', this.handleAdminOAuthMessage)
    window.removeEventListener('storage', this.onOAuthStorageChange)
    try {
      if (window.grecaptcha && this.recaptchaWidgetId !== null) {
        window.grecaptcha.reset(this.recaptchaWidgetId)
      }
    } catch (e) {}
  }
}
</script>

<style scoped>
.signin-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1a1040 50%, #0f2d47 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.signin-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.signin-logo {
  height: 36px;
}
.signin-top-header {
  background: #241447;
  border-radius: 10px;
  padding: 14px 12px;
}

.signin-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.signin-sub {
  font-size: 13px;
  color: #7a7580;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}

.signin-input {
  border-radius: 8px;
  border: 1.5px solid #cbc4d0;
  font-size: 14px;
  padding: 10px 14px;
  transition: border-color 0.2s;
}

.signin-input:focus {
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

.forgot-link {
  font-size: 13px;
  color: #66558c;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.signin-btn {
  background: linear-gradient(135deg, #5b4b84, #6f5f99);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  padding: 11px;
  transition: opacity 0.2s, transform 0.1s;
}

.signin-btn:hover:not(:disabled) {
  opacity: 0.92;
  transform: translateY(-1px);
}

.signin-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.social-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
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
.social-signin-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
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
  transition: all 0.2s;
}
.social-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.social-btn-slack:hover:not(:disabled) {
  border-color: #611f69;
  background: #faf5fb;
}
.social-btn-teams:hover:not(:disabled) {
  border-color: #5059c9;
  background: #f5f6fd;
}
.social-connected-btn {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid #86efac;
  background: #dcfce7;
  color: #166534;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}
.social-connected-btn:hover {
  background: #bbf7d0;
  border-color: #4ade80;
}
.social-connected-btn .bi-check-circle-fill {
  color: #22c55e;
  font-size: 14px;
}
.social-btn-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.signup-link {
  color: #66558c;
  text-decoration: none;
  font-weight: 500;
}

.signup-link:hover {
  text-decoration: underline;
}

/* ===== FORGOT PASSWORD MODAL ===== */
.fp-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.fp-modal {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}
.fp-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid #e5e7eb;
}
.fp-modal-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}
.fp-close {
  background: none;
  border: none;
  font-size: 22px;
  color: #6b7280;
  cursor: pointer;
  line-height: 1;
}
.fp-close:hover { color: #111; }
.fp-modal-body {
  padding: 20px 24px 24px;
}
.fp-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 16px;
}
</style>
