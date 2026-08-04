<template>
  <div class="hvw-root">
    <Header />

    <main class="hvw-main">

      <!-- ── Hero ── -->
      <section class="hvw-hero">
        <div class="hvw-hero-tag">
          <span class="hvw-tag-dot"></span>
          Platform Overview
        </div>
        <h1 class="hvw-hero-title">
          How <span class="hvw-accent">VaptFix</span> Works
        </h1>
        <p class="hvw-hero-sub">
          From vulnerability discovery to remediation — one continuous, automated workflow.
          Connect your team with Email, Slack, or Microsoft Teams.
        </p>
      </section>

      <!-- ── Login Methods ── -->
      <section class="hvw-login-section">
        <div class="hvw-section-label">Access &amp; Login</div>
        <h2 class="hvw-section-title">Sign in your way</h2>
        <p class="hvw-section-sub">VaptFix supports three authentication methods — use whichever fits your team's workflow.</p>

        <div class="hvw-login-cards">

          <!-- Email -->
          <div class="hvw-login-card">
            <div class="hvw-login-icon email-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#EEF2FF"/>
                <path d="M6 9.5C6 8.67 6.67 8 7.5 8h13C21.33 8 22 8.67 22 9.5v9c0 .83-.67 1.5-1.5 1.5h-13C6.67 20 6 19.33 6 18.5v-9z" stroke="#4F46E5" stroke-width="1.5" fill="none"/>
                <path d="M6 10l8 5.5L22 10" stroke="#4F46E5" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div class="hvw-login-card-body">
              <div class="hvw-login-card-title">Email &amp; Password</div>
              <div class="hvw-login-card-desc">Sign in with your registered email address and password. Ideal for direct platform access.</div>
            </div>
            <div class="hvw-login-steps">
              <div class="hvw-ls">① Enter email &amp; password</div>
              <div class="hvw-ls">② Verify your identity (OTP)</div>
              <div class="hvw-ls">③ Access your dashboard</div>
            </div>
            <button class="hvw-login-btn email-btn" @click="openEmailLogin">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M1.5 4l6.5 4.5L14.5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
              Get Started with Email
            </button>
          </div>

          <!-- Slack -->
          <div class="hvw-login-card">
            <div class="hvw-login-icon slack-icon">
              <svg width="28" height="28" viewBox="0 0 124 124" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.3 78.8a13.15 13.15 0 0 1-13.15 13.15A13.15 13.15 0 0 1 0 78.8a13.15 13.15 0 0 1 13.15-13.15h13.15v13.15z" fill="#E01E5A"/>
                <path d="M32.9 78.8a13.15 13.15 0 0 1 13.15-13.15 13.15 13.15 0 0 1 13.15 13.15v32.9A13.15 13.15 0 0 1 46.05 124a13.15 13.15 0 0 1-13.15-13.15V78.8z" fill="#E01E5A"/>
                <path d="M46.05 26.3a13.15 13.15 0 0 1-13.15-13.15A13.15 13.15 0 0 1 46.05 0a13.15 13.15 0 0 1 13.15 13.15v13.15H46.05z" fill="#36C5F0"/>
                <path d="M46.05 32.9a13.15 13.15 0 0 1 13.15 13.15 13.15 13.15 0 0 1-13.15 13.15H13.15A13.15 13.15 0 0 1 0 46.05a13.15 13.15 0 0 1 13.15-13.15h32.9z" fill="#36C5F0"/>
                <path d="M97.7 46.05a13.15 13.15 0 0 1 13.15-13.15A13.15 13.15 0 0 1 124 46.05a13.15 13.15 0 0 1-13.15 13.15H97.7V46.05z" fill="#2EB67D"/>
                <path d="M91.1 46.05a13.15 13.15 0 0 1-13.15 13.15 13.15 13.15 0 0 1-13.15-13.15V13.15A13.15 13.15 0 0 1 77.95 0a13.15 13.15 0 0 1 13.15 13.15v32.9z" fill="#2EB67D"/>
                <path d="M77.95 97.7a13.15 13.15 0 0 1 13.15 13.15A13.15 13.15 0 0 1 77.95 124a13.15 13.15 0 0 1-13.15-13.15V97.7h13.15z" fill="#ECB22E"/>
                <path d="M77.95 91.1a13.15 13.15 0 0 1-13.15-13.15 13.15 13.15 0 0 1 13.15-13.15h32.9A13.15 13.15 0 0 1 124 77.95a13.15 13.15 0 0 1-13.15 13.15H77.95z" fill="#ECB22E"/>
              </svg>
            </div>
            <div class="hvw-login-card-body">
              <div class="hvw-login-card-title">Slack</div>
              <div class="hvw-login-card-desc">Connect your Slack workspace and manage vulnerabilities directly from Slack channels.</div>
            </div>
            <div class="hvw-login-steps">
              <div class="hvw-ls">① Click "Sign in with Slack"</div>
              <div class="hvw-ls">② Authorize VaptFix app</div>
              <div class="hvw-ls">③ Use slash commands in Slack</div>
            </div>
            <button class="hvw-login-btn slack-btn" :disabled="oauthLoading === 'slack'" @click="openSlackLogin">
              <svg width="16" height="16" viewBox="0 0 124 124" fill="none">
                <path d="M26.3 78.8a13.15 13.15 0 0 1-13.15 13.15A13.15 13.15 0 0 1 0 78.8a13.15 13.15 0 0 1 13.15-13.15h13.15v13.15z" fill="#E01E5A"/>
                <path d="M32.9 78.8a13.15 13.15 0 0 1 13.15-13.15 13.15 13.15 0 0 1 13.15 13.15v32.9A13.15 13.15 0 0 1 46.05 124a13.15 13.15 0 0 1-13.15-13.15V78.8z" fill="#E01E5A"/>
                <path d="M46.05 26.3a13.15 13.15 0 0 1-13.15-13.15A13.15 13.15 0 0 1 46.05 0a13.15 13.15 0 0 1 13.15 13.15v13.15H46.05z" fill="#36C5F0"/>
                <path d="M46.05 32.9a13.15 13.15 0 0 1 13.15 13.15 13.15 13.15 0 0 1-13.15 13.15H13.15A13.15 13.15 0 0 1 0 46.05a13.15 13.15 0 0 1 13.15-13.15h32.9z" fill="#36C5F0"/>
                <path d="M97.7 46.05a13.15 13.15 0 0 1 13.15-13.15A13.15 13.15 0 0 1 124 46.05a13.15 13.15 0 0 1-13.15 13.15H97.7V46.05z" fill="#2EB67D"/>
                <path d="M91.1 46.05a13.15 13.15 0 0 1-13.15 13.15 13.15 13.15 0 0 1-13.15-13.15V13.15A13.15 13.15 0 0 1 77.95 0a13.15 13.15 0 0 1 13.15 13.15v32.9z" fill="#2EB67D"/>
                <path d="M77.95 97.7a13.15 13.15 0 0 1 13.15 13.15A13.15 13.15 0 0 1 77.95 124a13.15 13.15 0 0 1-13.15-13.15V97.7h13.15z" fill="#ECB22E"/>
                <path d="M77.95 91.1a13.15 13.15 0 0 1-13.15-13.15 13.15 13.15 0 0 1 13.15-13.15h32.9A13.15 13.15 0 0 1 124 77.95a13.15 13.15 0 0 1-13.15 13.15H77.95z" fill="#ECB22E"/>
              </svg>
              {{ oauthLoading === 'slack' ? 'Connecting...' : 'Sign in with Slack' }}
            </button>
          </div>

          <!-- Microsoft Teams -->
          <div class="hvw-login-card">
            <div class="hvw-login-icon teams-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#EEF6FF"/>
                <path d="M16 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#5059C9"/>
                <path d="M17.5 12H13a2.5 2.5 0 0 0-2.5 2.5v4c0 .28.22.5.5.5h7c.28 0 .5-.22.5-.5v-4C18.5 13.12 18.11 12 17.5 12z" fill="#5059C9"/>
                <path d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" fill="#7B83EB"/>
                <path d="M15 13H8c-.55 0-1 .45-1 1v4.5c0 .83.67 1.5 1.5 1.5h6c.83 0 1.5-.67 1.5-1.5V14c0-.55-.45-1-1-1z" fill="#7B83EB"/>
              </svg>
            </div>
            <div class="hvw-login-card-body">
              <div class="hvw-login-card-title">Microsoft Teams</div>
              <div class="hvw-login-card-desc">Integrate with Microsoft Teams to receive alerts and manage remediation from your Teams workspace.</div>
            </div>
            <div class="hvw-login-steps">
              <div class="hvw-ls">① Click "Sign in with Microsoft"</div>
              <div class="hvw-ls">② Approve OAuth permissions</div>
              <div class="hvw-ls">③ Receive alerts in Teams</div>
            </div>
            <button class="hvw-login-btn microsoft-btn" :disabled="oauthLoading === 'microsoft'" @click="openMicrosoftLogin">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6.5" height="6.5" fill="#F25022"/><rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00"/><rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF"/><rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900"/></svg>
              {{ oauthLoading === 'microsoft' ? 'Connecting...' : 'Sign in with Microsoft' }}
            </button>
          </div>

        </div>
      </section>

      <!-- ── Workflow Steps ── -->
      <section class="hvw-steps-section">
        <div class="hvw-section-label">Platform Workflow</div>
        <div class="hvw-steps">
          <div v-for="(step, i) in steps" :key="i" class="hvw-step">
            <div class="hvw-step-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="hvw-step-icon">{{ step.icon }}</div>
            <div class="hvw-step-body">
              <div class="hvw-step-title">{{ step.title }}</div>
              <div class="hvw-step-desc">{{ step.desc }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── Key Features ── -->
      <section class="hvw-features-section">
        <div class="hvw-section-label">Key Capabilities</div>
        <h2 class="hvw-section-title">Everything your security team needs</h2>
        <div class="hvw-features-grid">
          <div v-for="feat in features" :key="feat.title" class="hvw-feat-card">
            <div class="hvw-feat-icon">{{ feat.icon }}</div>
            <div class="hvw-feat-title">{{ feat.title }}</div>
            <div class="hvw-feat-desc">{{ feat.desc }}</div>
          </div>
        </div>
      </section>

      <!-- ── CTA ── -->
      <section class="hvw-cta-section">
        <h2 class="hvw-cta-title">Ready to secure your infrastructure?</h2>
        <p class="hvw-cta-sub">Start your free trial — no credit card required.</p>
        <div class="hvw-cta-btns">
          <router-link to="/signup" class="hvw-btn-primary">Get Started Free →</router-link>
          <router-link to="/knowledge-base" class="hvw-btn-outline">Read the Docs</router-link>
        </div>
      </section>

    </main>

    <!-- Sign In Modal -->
    <SignUpModal
      :show="showSignInModal"
      @close="closeModal"
    />
    <!-- Get Started / Admin Sign Up Modal -->
    <AdminSignUpModal
      :show="showAdminSignUpModal"
      @close="closeAdminSignUpModal"
      @open-signin="handleOpenSignInFromAdminSignUp"
    />
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import SignUpModal from '@/components/admin-component/SignUpModal.vue';
import AdminSignUpModal from '@/components/admin-component/AdminSignUpModal.vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

export default {
  name: 'HowVaptfixWorksView',
  components: { Header, SignUpModal, AdminSignUpModal },
  data() {
    return {
      showSignInModal: false,
      showAdminSignUpModal: false,
      oauthLoading: '',
      backendBase: 'https://vaptbackend.secureitlab.com',
      authStore: null,
      steps: [
        { icon: '📤', title: 'Upload Assessment', desc: 'Submit a vulnerability assessment file through the VaptFix interface.' },
        { icon: '✅', title: 'Validate & Ingest', desc: 'Backend authenticates the request and streams data into encrypted cloud storage.' },
        { icon: '🗺️', title: 'Asset Mapping', desc: 'Each vulnerability is mapped to its corresponding organizational asset.' },
        { icon: '🎯', title: 'Classify & Prioritize', desc: 'Findings are classified by severity and remediation timeline automatically.' },
        { icon: '👥', title: 'Team Assignment', desc: 'Auto-routed to Network Security, Patch Management, Config Mgmt, or Architectural Flaw team.' },
        { icon: '🔧', title: 'Guided Remediation', desc: 'Assigned team receives step-by-step fix guides, scripts, and escalation support.' },
        { icon: '📊', title: 'Real-Time Tracking', desc: 'Progress is tracked live as findings move toward resolution across dashboards.' },
      ],
      features: [ // eslint-disable-line
        { icon: '🛡️', title: 'Asset-Based Mapping', desc: 'Every vulnerability is tied to the exact asset it affects.' },
        { icon: '⚡', title: 'Automated Scripts', desc: 'Download and run verified auto-remediation scripts for supported vulnerabilities.' },
        { icon: '📅', title: 'Remediation Timeline', desc: 'SLA-based timelines ensure every finding has a clear resolution deadline.' },
        { icon: '🔔', title: 'Slack & Teams Alerts', desc: 'Get instant notifications in your team\'s preferred messaging platform.' },
        { icon: '📈', title: 'Performance Reports', desc: 'Per-team closure rates, open/closed counts, and severity breakdowns.' },
        { icon: '🔒', title: 'Enterprise Security', desc: 'GDPR, CCPA, SOC 2 compliant with end-to-end encryption.' },
      ],
    };
  },
  mounted() {
    this.authStore = useAuthStore();
  },
  methods: {
    openEmailLogin() {
      this.showAdminSignUpModal = true;
    },
    closeAdminSignUpModal() {
      this.showAdminSignUpModal = false;
    },
    handleOpenSignInFromAdminSignUp() {
      this.showAdminSignUpModal = false;
      this.showSignInModal = true;
    },
    closeModal() {
      this.showSignInModal = false;
    },
    async openSlackLogin() {
      this.oauthLoading = 'slack';
      try {
        const adminId = this.authStore?.user?._id || this.authStore?.user?.id || null;
        const res = await this.authStore.getSlackOAuthUrl(this.backendBase, adminId);
        if (res.status && res.data?.auth_url) {
          const w = 1000, h = 700;
          const left = window.screenX + (window.outerWidth - w) / 2;
          const top  = window.screenY + (window.outerHeight - h) / 2;
          const popup = window.open(res.data.auth_url, 'SlackOAuth', `width=${w},height=${h},left=${left},top=${top}`);
          if (!popup) Swal.fire('Popup Blocked', 'Please allow popups for this site.', 'warning');
        } else {
          Swal.fire('Error', 'Unable to start Slack login', 'error');
        }
      } catch {
        Swal.fire('Error', 'Something went wrong with Slack login', 'error');
      } finally {
        this.oauthLoading = '';
      }
    },
    async openMicrosoftLogin() {
      this.oauthLoading = 'microsoft';
      try {
        const adminId = this.authStore?.user?._id || this.authStore?.user?.id || null;
        const redirectUri = `${window.location.origin}/microsoft/callback`;
        const res = await this.authStore.getMicrosoftOAuthUrl(redirectUri, adminId);
        if (res.status && res.data?.auth_url) {
          const w = 1000, h = 700;
          const left = window.screenX + (window.outerWidth - w) / 2;
          const top  = window.screenY + (window.outerHeight - h) / 2;
          const popup = window.open(res.data.auth_url, 'TeamsOAuth', `width=${w},height=${h},left=${left},top=${top}`);
          if (!popup) Swal.fire('Popup Blocked', 'Please allow popups for this site.', 'warning');
        } else {
          Swal.fire('Error', 'Failed to start Microsoft login', 'error');
        }
      } catch {
        Swal.fire('Error', 'Microsoft login failed', 'error');
      } finally {
        this.oauthLoading = '';
      }
    },
  },
};
</script>

<style scoped>
.hvw-root {
  min-height: 100vh;
  background: #f8f9fc;
  font-family: 'Inter', sans-serif;
}

.hvw-main {
  max-width: 1080px;
  margin: 0 auto;
  padding: 96px 24px 60px;
}

/* ── Hero ── */
.hvw-hero {
  text-align: center;
  padding: 56px 0 48px;
}

.hvw-hero-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.08);
  border: 1px solid rgba(15, 105, 110, 0.2);
  border-radius: 99px;
  padding: 5px 14px;
  margin-bottom: 20px;
}

.hvw-tag-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #0f696e;
}

.hvw-hero-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.15;
  margin-bottom: 16px;
  letter-spacing: -0.01em;
}

.hvw-accent { color: #0f696e; }

.hvw-hero-sub {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ── Section common ── */
.hvw-section-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #0f696e;
  margin-bottom: 10px;
}

.hvw-section-title {
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #241447;
  margin-bottom: 10px;
}

.hvw-section-sub {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  margin-bottom: 32px;
  line-height: 1.6;
}

/* ── Steps ── */
.hvw-steps-section {
  padding: 24px 0 48px;
}

.hvw-steps {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.hvw-step {
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  box-shadow: 0 1px 6px rgba(36,20,71,0.05);
  transition: box-shadow 0.2s, transform 0.2s;
}

.hvw-step:hover {
  box-shadow: 0 4px 18px rgba(36,20,71,0.1);
  transform: translateY(-2px);
}

.hvw-step-num {
  font-size: 11px;
  font-weight: 800;
  color: #0f696e;
  background: rgba(15,105,110,0.08);
  border-radius: 6px;
  padding: 3px 7px;
  flex-shrink: 0;
  letter-spacing: 0.04em;
}

.hvw-step-icon { font-size: 22px; flex-shrink: 0; margin-top: 1px; }

.hvw-step-title {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 4px;
}

.hvw-step-desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #64748b;
  line-height: 1.6;
}

/* ── Login cards ── */
.hvw-login-section {
  padding: 0 0 52px;
}

.hvw-login-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.hvw-login-card {
  background: #fff;
  border: 1.5px solid #e8edf4;
  border-radius: 18px;
  padding: 28px 26px 24px;
  box-shadow: 0 2px 12px rgba(36,20,71,0.06);
  transition: box-shadow 0.22s, transform 0.22s, border-color 0.22s;
  display: flex;
  flex-direction: column;
}

.hvw-login-card:hover {
  box-shadow: 0 8px 32px rgba(36,20,71,0.12);
  transform: translateY(-4px);
  border-color: #c7d2fe;
}

.hvw-login-card:nth-child(2):hover { border-color: #fecdd3; }
.hvw-login-card:nth-child(3):hover { border-color: #bfdbfe; }

.hvw-login-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.email-icon  { background: linear-gradient(135deg,#eef2ff,#e0e7ff); }
.slack-icon  { background: linear-gradient(135deg,#fff0f5,#ffe4e6); }
.teams-icon  { background: linear-gradient(135deg,#eef6ff,#dbeafe); }

.hvw-login-card-title {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 8px;
}

.hvw-login-card-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 18px;
  flex: 1;
}

.hvw-login-steps {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
}

.hvw-ls {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e8edf4;
  border-radius: 8px;
  padding: 7px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ── Features ── */
.hvw-features-section {
  padding: 0 0 52px;
}

.hvw-features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.hvw-feat-card {
  background: #fff;
  border: 1px solid #e8edf4;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 1px 6px rgba(36,20,71,0.05);
  transition: box-shadow 0.2s, transform 0.2s;
}

.hvw-feat-card:hover {
  box-shadow: 0 4px 18px rgba(36,20,71,0.1);
  transform: translateY(-2px);
}

.hvw-feat-icon { font-size: 26px; margin-bottom: 10px; }

.hvw-feat-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 6px;
}

.hvw-feat-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  line-height: 1.6;
}

/* ── CTA ── */
.hvw-cta-section {
  text-align: center;
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  border-radius: 20px;
  padding: 56px 32px;
  color: #fff;
}

.hvw-cta-title {
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 10px;
}

.hvw-cta-sub {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: rgba(255,255,255,0.75);
  margin-bottom: 28px;
}

.hvw-cta-btns {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

.hvw-btn-primary {
  background: #fff;
  color: #241447;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 15px;
  padding: 12px 28px;
  border-radius: 99px;
  text-decoration: none;
  transition: opacity 0.2s;
}

.hvw-btn-primary:hover { opacity: 0.9; }

.hvw-btn-outline {
  background: transparent;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 28px;
  border-radius: 99px;
  border: 1px solid rgba(255,255,255,0.4);
  text-decoration: none;
  transition: background 0.2s;
}

.hvw-btn-outline:hover { background: rgba(255,255,255,0.1); }

/* ── Login buttons ── */
.hvw-login-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  justify-content: center;
  padding: 12px 20px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: all 0.18s;
  margin-top: auto;
  min-height: 48px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
}

.email-btn {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
}
.email-btn:hover { background: linear-gradient(135deg,#4338ca,#4f46e5); box-shadow: 0 4px 14px rgba(79,70,229,0.35); }

.slack-btn {
  background: linear-gradient(135deg, #4a154b, #611f69);
  color: #fff;
}
.slack-btn:hover { background: linear-gradient(135deg,#3a1039,#4a154b); box-shadow: 0 4px 14px rgba(74,21,75,0.4); }

.microsoft-btn {
  background: linear-gradient(135deg, #6264a7, #7b83eb);
  color: #fff;
}
.microsoft-btn:hover { background: linear-gradient(135deg,#464775,#6264a7); box-shadow: 0 4px 14px rgba(98,100,167,0.4); }

.hvw-login-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}
</style>
