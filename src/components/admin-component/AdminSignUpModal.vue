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

            <div class="social-divider">
              <span class="social-divider-line"></span>
              <span class="social-divider-text">or</span>
              <span class="social-divider-line"></span>
            </div>

            <div class="social-signup-btns">
              <button
                v-if="!slackConnected"
                type="button"
                class="social-btn social-btn-slack"
                :disabled="isSlackDisabled"
                @click.prevent="startSlackLogin"
              >
                <img :src="slackIcon" alt="" class="social-btn-icon" />
                Sign up with Slack
              </button>
              <button
                v-else
                type="button"
                class="social-connected-btn social-connected-slack"
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
                :disabled="isTeamsDisabled"
                @click.prevent="startMicrosoftLogin"
              >
                <img :src="teamsIcon" alt="" class="social-btn-icon" />
                Sign up with Microsoft Teams
              </button>
              <button
                v-else
                type="button"
                class="social-connected-btn social-connected-teams"
                @click.prevent="startMicrosoftLogin"
              >
                <img :src="teamsIcon" alt="" class="social-btn-icon" />
                <i class="bi bi-check-circle-fill"></i>
                Microsoft Teams connected
              </button>
            </div>

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
import teamsIcon from '@/assets/images/teams.png';
import slackIcon from '@/assets/images/slack.png';

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
      authStore: useAuthStore(),
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
      recaptchaSiteKey: '6LevYjAsAAAAAH5H0o33_0IvZAbvvOiZ82ZwA8ny',
      slackIcon,
      teamsIcon,
      slackConnected: false,
      teamsConnected: false,
      backendBase: 'https://vaptbackend.secureitlab.com'
    };
  },
  computed: {
    isSlackDisabled() {
      return this.teamsConnected && !this.slackConnected;
    },
    isTeamsDisabled() {
      return this.slackConnected && !this.teamsConnected;
    },
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
          this.syncPlatformConnectionState();
        });
      }
    }
  },
  mounted() {
    this.loadRecaptchaScript();
    window.addEventListener('message', this.onTeamsConnected);
    window.addEventListener('message', this.handleSlackMessage);
    window.addEventListener('storage', this.onStorageChange);
    if (this.show) {
      this.$nextTick(() => this.renderRecaptcha());
    }
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
    },
    getAdminId() {
      return this.authStore.resolveAdminId();
    },
    ensureAuthSessionFromOAuth(payload = null) {
      try {
        return this.authStore.hydrateAuthSessionFromOAuth(payload);
      } catch (e) {
        console.error('Failed to hydrate auth session from OAuth:', e);
        return false;
      }
    },
    ensureAuthSessionFromOAuth(payload = null) {
      const djangoAccessToken =
        payload?.django_access_token || localStorage.getItem('django_access_token');
      const djangoRefreshToken =
        payload?.django_refresh_token || localStorage.getItem('django_refresh_token');
      const oauthUser = payload?.user || JSON.parse(localStorage.getItem('local_user') || 'null');
      if (!djangoAccessToken) return false;

      try {
        if (typeof this.authStore.setAuth === 'function') {
          this.authStore.setAuth(djangoAccessToken, oauthUser || this.authStore.user || {});
        }
      } catch (e) {
        console.error('Failed to hydrate auth session from OAuth:', e);
      }

      sessionStorage.setItem('authorization', djangoAccessToken);
      if (djangoRefreshToken) {
        sessionStorage.setItem('refreshToken', djangoRefreshToken);
      }
      sessionStorage.setItem('authenticated', 'true');
      return true;
    },
    checkTeamsConnection() {
      const graphToken = localStorage.getItem('microsoft_graph_token');
      const teamsFlag = localStorage.getItem('teams_connected') === 'true';
      this.teamsConnected = !!(graphToken || teamsFlag);
    },
    async syncPlatformConnectionState() {
      const slackToken = localStorage.getItem('slack_bot_token');
      if (slackToken) {
        await this.checkSlackConnection();
      } else {
        this.slackConnected = false;
      }
      this.checkTeamsConnection();
      if (this.slackConnected && this.teamsConnected) {
        this.teamsConnected = false;
      }
    },
  // —— Slack / Teams: same as LocationView (/communication) ——
    async startMicrosoftLogin() {
      if (this.teamsConnected) {
        window.open('https://teams.microsoft.com/', '_blank');
        return;
      }
      if (this.isTeamsDisabled && !this.teamsConnected) return;
      try {
        const redirectUri = `${window.location.origin}/microsoft/callback`;
        const adminId = this.getAdminId();
        const res = await this.authStore.getMicrosoftOAuthUrl(redirectUri, adminId);
        if (res.status && res.data.auth_url) {
          window.open(res.data.auth_url, '_blank');
        } else {
          Swal.fire('Error', 'Failed to start Microsoft login', 'error');
        }
      } catch (err) {
        console.error('Microsoft login error:', err);
        Swal.fire('Error', 'Microsoft login failed', 'error');
      }
    },
    async onTeamsConnected(event) {
      const allowedOrigins = [
        window.location.origin,
        'https://vaptbackend.secureitlab.com'
      ];
      if (!allowedOrigins.includes(event.origin)) return;
      if (event.data?.type !== 'TEAMS_CONNECTED') return;

      const graphToken = event.data.tokens?.access_token;
      const teamObj = event.data.vaptfix_team || null;
      const tenantId = event.data.tokens?.tenant_id;

      if (graphToken) localStorage.setItem('microsoft_graph_token', graphToken);
      if (teamObj) localStorage.setItem('vaptfix_team', JSON.stringify(teamObj));
      if (event.data.django_access_token) {
        localStorage.setItem('django_access_token', event.data.django_access_token);
      }
      if (event.data.django_refresh_token) {
        localStorage.setItem('django_refresh_token', event.data.django_refresh_token);
      }
      if (event.data.user) {
        localStorage.setItem('local_user', JSON.stringify(event.data.user));
      }
      if (tenantId) localStorage.setItem('microsoft_tenant_id', tenantId);

      if (teamObj) {
        const channels = teamObj.channels || [];
        localStorage.setItem('vaptfix_channels', JSON.stringify(channels));
      }

      localStorage.setItem('teams_connected', 'true');
      this.teamsConnected = true;
      this.slackConnected = false;

      Swal.fire({
        icon: 'success',
        title: 'Microsoft Teams connected successfully',
        timer: 2000,
        showConfirmButton: false
      });

      const teamId = teamObj?.team_id || teamObj?.id;
      if (teamId && typeof this.authStore.subscribeTeamsWebhook === 'function') {
        await this.authStore.subscribeTeamsWebhook(teamId);
      }
      if (teamId && typeof this.authStore.ensureTeamsChannelsCached === 'function') {
        await this.authStore.ensureTeamsChannelsCached();
      }

      this.ensureAuthSessionFromOAuth(event.data);
      this.maybeFinishSignupAfterOAuth();
    },
    onStorageChange(event) {
      if (event.key === 'microsoft_graph_token' && event.newValue) {
        this.teamsConnected = true;
        this.slackConnected = false;
        Swal.fire({
          icon: 'success',
          title: 'Microsoft Teams Connected',
          timer: 2000,
          showConfirmButton: false
        });
        this.ensureAuthSessionFromOAuth();
        this.maybeFinishSignupAfterOAuth();
      }
    },
    async startSlackLogin() {
      if (this.slackConnected) {
        const slackTeamRaw = localStorage.getItem('slack_team');
        let targetUrl = 'https://app.slack.com/client';
        if (slackTeamRaw) {
          try {
            const slackTeam = JSON.parse(slackTeamRaw);
            if (slackTeam?.url) {
              targetUrl = slackTeam.url;
            } else if (slackTeam?.domain) {
              targetUrl = `https://${slackTeam.domain}.slack.com`;
            }
          } catch (e) {}
        }
        window.open(targetUrl, '_blank');
        return;
      }
      if (this.isSlackDisabled && !this.slackConnected) return;
      try {
        const adminId = this.getAdminId();
        const res = await this.authStore.getSlackOAuthUrl(this.backendBase, adminId);

        if (res.status && res.data?.auth_url) {
          const width = 1000;
          const height = 700;
          const left = window.screenX + (window.outerWidth - width) / 2;
          const top = window.screenY + (window.outerHeight - height) / 2;

          const popup = window.open(
            res.data.auth_url,
            'SlackOAuth',
            `width=${width},height=${height},left=${left},top=${top}`
          );

          if (!popup) {
            alert('Popup blocked! Please allow popups for this site.');
          }
        } else {
          Swal.fire('Error', 'Unable to start Slack login', 'error');
        }
      } catch (error) {
        Swal.fire('Error', 'Something went wrong while connecting Slack', 'error');
      }
    },
    handleSlackMessage(event) {
      const allowedOrigins = [
        window.location.origin,
        'https://vaptbackend.secureitlab.com'
      ];

      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      if (event.data?.type === 'SLACK_CONNECTED') {
        if (event.data.bot_token) {
          localStorage.setItem('slack_bot_token', event.data.bot_token);
        }
        if (event.data.slack_user_id) {
          localStorage.setItem('slack_user_id', event.data.slack_user_id);
        }
        if (event.data.django_access_token) {
          localStorage.setItem('django_access_token', event.data.django_access_token);
        }
        if (event.data.django_refresh_token) {
          localStorage.setItem('django_refresh_token', event.data.django_refresh_token);
        }
        const appUser = event.data.local_user || event.data.user;
        if (appUser && typeof appUser === 'object') {
          localStorage.setItem('local_user', JSON.stringify(appUser));
        }

        this.onSlackConnected();
      }
    },
    async onSlackConnected() {
      await this.checkSlackConnection();
      await this.fetchSlackChannels();
      await this.fetchSlackUsers();

      if (this.slackConnected) {
        this.teamsConnected = false;
        Swal.fire({
          icon: 'success',
          title: 'Slack connected successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }

      this.maybeFinishSignupAfterOAuth();
    },
    async checkSlackConnection() {
      try {
        const botToken = localStorage.getItem('slack_bot_token');
        if (!botToken) return;

        const res = await this.authStore.validateSlackToken(botToken);
        this.slackConnected = !!res.success;
      } catch (err) {
        console.error('Slack validation error:', err);
        this.slackConnected = false;
      }
    },
    async fetchSlackChannels() {
      try {
        const res = await this.authStore.listSlackChannels();
        if (res.status) {
          localStorage.setItem('slack_channels', JSON.stringify(res.channels || []));
        }
      } catch (err) {
        console.error('Slack channels fetch error:', err);
      }
    },
    async fetchSlackUsers() {
      try {
        const botToken = localStorage.getItem('slack_bot_token');
        if (!botToken) return;

        const res = await this.authStore.listSlackUsers(botToken);
        if (res.status) {
          localStorage.setItem('slack_users', JSON.stringify(res.users || []));
        }
      } catch (err) {
        console.error('Slack users error:', err);
      }
    },
    maybeFinishSignupAfterOAuth() {
      const hasSession = this.ensureAuthSessionFromOAuth() ||
        this.authStore.authenticated ||
        !!sessionStorage.getItem('authorization') ||
        sessionStorage.getItem('authenticated') === 'true';

      const loggedIn =
        this.authStore.authenticated ||
        sessionStorage.getItem('authorization');

      if (!loggedIn) return;

      sessionStorage.setItem('isNewUser', 'true');
      this.resetForm();
      this.$emit('close');
      this.$router.push('/scoping-form-2');
    }
  },
  beforeUnmount() {
    window.removeEventListener('message', this.onTeamsConnected);
    window.removeEventListener('message', this.handleSlackMessage);
    window.removeEventListener('storage', this.onStorageChange);
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
  max-width: 620px;
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
  padding: 16px 32px 20px;
  padding-top: 34px;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  overflow: visible;
}

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
  margin-bottom: 4px;
}
.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.form-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Divider */
.form-divider {
  border: none;
  border-top: 2px solid #241447;
  margin: 0 0 10px 0;
  opacity: 1;
}

/* Form Container */
.form-container {
  overflow-y: visible;
  padding-right: 0;
}

/* Field Group */
.field-group { margin-bottom: 8px; }

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
  height: 42px;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 12px;
  font-size: 11px;
  margin-top: 6px;
}
.pwd-rule { display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
.pwd-rule-fail { color: #dc3545; }
.pwd-rule-pass { color: #28a745; }
.pwd-rule i { font-size: 13px; }

/* reCAPTCHA */
.recaptcha-field { margin-bottom: 8px; }
.recaptcha-wrap {
  display: flex;
  justify-content: center;
  transform: scale(0.92);
  transform-origin: center top;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  height: 46px;
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
  margin-bottom: 10px;
  box-shadow: 0 4px 16px rgba(36, 20, 71, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}
.submit-btn:hover:not(:disabled) { background: #1a0f38; }
.submit-btn:disabled { background: #241447; opacity: 1; cursor: not-allowed; }

/* Social signup */
.social-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 2px 0 10px;
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
  letter-spacing: 0.06em;
}
.social-signup-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
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
  opacity: 0.45;
  cursor: not-allowed;
  filter: grayscale(0.4);
  background: #f1f5f9;
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
  flex-shrink: 0;
}

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

@media (max-width: 640px) {
  .signup-overlay { padding-right: 12px; padding-left: 12px; justify-content: center; }
  .signup-panel { max-width: 100%; }
  .modal-content { padding: 20px 18px; padding-top: 40px; }
  .social-signup-btns { grid-template-columns: 1fr; }
  .pwd-rules { grid-template-columns: 1fr; }
  .otp-box { width: 42px; height: 46px; font-size: 18px; }
}
</style>
