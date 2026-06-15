<template>
  <div class="settings-page">
    <aside class="settings-sidebar">
      <router-link :to="dashboardRoute" class="settings-back-btn">
        <i class="bi bi-arrow-left"></i>
        Back
      </router-link>

      <div class="settings-sidebar-header">
        <h2>Settings</h2>
        <p>Manage your workspace</p>
      </div>

      <nav class="settings-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          type="button"
          class="settings-nav-btn"
          :class="{ 'settings-nav-btn--active': activeSection === item.id }"
          @click="selectSection(item.id)"
        >
          <i :class="item.icon"></i>
          {{ item.label }}
        </button>
      </nav>

      <div class="settings-plan-card">
        <p class="settings-plan-title">Enterprise Plan</p>
        <div class="settings-plan-bar">
          <div class="settings-plan-fill"></div>
        </div>
        <p class="settings-plan-meta">80% nodes scanned</p>
      </div>
    </aside>

    <main class="settings-main">
      <header class="settings-page-header">
        <h1>{{ currentSectionMeta.title }}</h1>
        <p>{{ currentSectionMeta.desc }}</p>
      </header>

      <!-- Account: full Manage Account details -->
      <div v-show="activeSection === 'account'" class="settings-section-view">
        <ManageAccountPanel
          :mode="mode"
          embedded
          :allowed-tabs="['profile', 'password', 'workspace']"
        />
      </div>

      <!-- Billing -->
      <div v-show="activeSection === 'billing'" class="settings-section-view">
      <div class="settings-grid settings-grid--single">
        <section class="settings-card settings-card--billing settings-card--billing-only">
          <div class="settings-billing-accent"></div>
          <h3>Current Plan</h3>
          <div class="settings-plan-info">
            <span class="settings-plan-name">Enterprise</span>
            <p>Billed annually • Next renewal Jan 2025</p>
          </div>
          <div class="settings-usage">
            <div class="settings-usage-row">
              <span>Monthly Usage</span>
              <span>4.2 TB / 10 TB</span>
            </div>
            <div class="settings-usage-bar">
              <div class="settings-usage-fill"></div>
            </div>
          </div>
          <div class="settings-billing-actions">
            <router-link to="/pricingplan" class="settings-btn-white">Upgrade Plan</router-link>
            <button type="button" class="settings-btn-outline">Manage Billing</button>
          </div>
        </section>
      </div>
      </div>

      <!-- Security -->
      <div v-show="activeSection === 'security'" class="settings-section-view">
      <div class="settings-grid settings-grid--single">
        <section class="settings-card settings-card--full settings-card--muted">
          <div class="settings-section-head">
            <h3>Security &amp; Access</h3>
            <span class="settings-security-badge">
              <i class="bi bi-shield-check"></i>
              High Security Level
            </span>
          </div>

          <div class="settings-security-grid">
            <div class="settings-security-col">
              <h4><i class="bi bi-lock"></i> Password</h4>
              <p>Ensure your account is using a long, random password to stay secure.</p>
              <button type="button" class="settings-btn-secondary" @click="selectSection('account')">Change Password</button>
            </div>
            <div class="settings-security-col settings-security-col--border">
              <h4><i class="bi bi-phone"></i> Two-Factor Auth</h4>
              <div class="settings-toggle-row">
                <p>2FA is currently enabled via Google Authenticator.</p>
                <div class="settings-toggle settings-toggle--on"><span></span></div>
              </div>
              <button type="button" class="settings-btn-secondary">Regenerate Codes</button>
            </div>
            <div class="settings-security-col settings-security-col--border">
              <h4><i class="bi bi-link-45deg"></i> Single Sign-On</h4>
              <div class="settings-sso-list">
                <div class="settings-sso-item">
                  <div class="settings-sso-brand">
                    <span class="settings-sso-icon settings-sso-icon--google">G</span>
                    <span>Google Workspace</span>
                  </div>
                  <span class="settings-sso-status">Connected</span>
                </div>
                <div class="settings-sso-item">
                  <div class="settings-sso-brand">
                    <span class="settings-sso-icon settings-sso-icon--github">GH</span>
                    <span>GitHub SSO</span>
                  </div>
                  <button type="button" class="settings-sso-connect">Connect</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ManageAccountPanel
          :mode="mode"
          embedded
          :allowed-tabs="['security']"
        />
      </div>
      </div>

      <!-- Notifications -->
      <div v-show="activeSection === 'notifications'" class="settings-section-view">
      <div class="settings-grid settings-grid--single">
          <section class="settings-card">
            <h3>Notification Preferences</h3>
            <div class="settings-notif-list">
              <div class="settings-notif-item">
                <div>
                  <p>Security Alerts</p>
                  <span>Notify me of suspicious logins and policy violations.</span>
                </div>
                <div class="settings-toggle settings-toggle--on"><span></span></div>
              </div>
              <div class="settings-notif-item">
                <div>
                  <p>Product Updates</p>
                  <span>New feature releases and system improvements.</span>
                </div>
                <div class="settings-toggle settings-toggle--on"><span></span></div>
              </div>
              <div class="settings-notif-item settings-notif-item--off">
                <div>
                  <p>Marketing &amp; Promotions</p>
                  <span>Stay updated on our latest offers and events.</span>
                </div>
                <div class="settings-toggle"><span></span></div>
              </div>
            </div>
          </section>
      </div>
      </div>

      <!-- Team -->
      <div v-show="activeSection === 'team'" class="settings-section-view">
      <div class="settings-grid settings-grid--single">
          <section class="settings-card">
            <div class="settings-section-head">
              <h3>Workspace Team</h3>
              <button type="button" class="settings-btn-invite">Invite Member</button>
            </div>
            <div class="settings-team-list">
              <div v-for="member in teamMembers" :key="member.email" class="settings-team-item">
                <div class="settings-team-user">
                  <div class="settings-team-avatar">{{ member.initial }}</div>
                  <div>
                    <p>{{ member.name }}</p>
                    <span>{{ member.role }} • {{ member.status }}</span>
                  </div>
                </div>
                <i class="bi bi-three-dots-vertical"></i>
              </div>
            </div>
          </section>
      </div>
      </div>

      <!-- Risk Criteria -->
      <div v-show="activeSection === 'risk'" class="settings-section-view">
      <div class="settings-grid settings-grid--single">
        <section class="settings-card settings-card--narrow settings-stack settings-stack--full">
          <div class="settings-risk-card">
            <h3>Risk Criteria</h3>
            <p>Configure how vulnerabilities are classified and prioritized across your infrastructure.</p>

            <div class="settings-risk-levels">
              <div v-for="level in riskLevels" :key="level.key" class="settings-risk-item">
                <span class="settings-risk-bar" :class="`settings-risk-bar--${level.key}`"></span>
                <div class="settings-risk-info">
                  <p>{{ level.label }}</p>
                  <span>{{ level.value || 'Not set' }}</span>
                </div>
              </div>
            </div>

            <router-link
              v-if="mode === 'admin'"
              :to="{ path: '/riskcriteria', query: { returnTo: $route.fullPath } }"
              class="settings-btn-risk"
            >
              <i class="bi bi-sliders"></i>
              Configure Risk Criteria
            </router-link>
            <button v-else type="button" class="settings-btn-risk" @click="selectSection('risk')">
              <i class="bi bi-sliders"></i>
              View Risk Criteria
            </button>
          </div>

          <div class="settings-danger-card">
            <h3>Danger Zone</h3>
            <p>Deleting your account is permanent and cannot be undone.</p>
            <button type="button" class="settings-btn-danger">Delete Account</button>
          </div>
        </section>
      </div>
      </div>

      <footer class="settings-footer">
        <div class="settings-footer-links">
          <p>© 2024 VaptFix Pro v2.4.1</p>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
        <div class="settings-footer-status">
          <span class="settings-status-dot"></span>
          <p>All systems operational</p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';
import ManageAccountPanel from '@/components/account/ManageAccountPanel.vue';

const TIME_LABELS = {
  '1': '1 Day',
  '3': '3 Days',
  '7': '7 Days',
  '14': '14 Days',
  '30': '30 Days',
  '60': '60 Days',
  '90': '90 Days',
};

export default {
  name: 'SettingsPanel',
  components: { ManageAccountPanel },
  props: {
    mode: {
      type: String,
      default: 'admin',
      validator: (v) => ['admin', 'user'].includes(v),
    },
  },
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  data() {
    return {
      activeSection: 'account',
      riskCriteria: { critical: null, high: null, medium: null, low: null },
      sectionMeta: {
        account: {
          title: 'Account Settings',
          desc: 'Manage your personal profile, password, and workspace preferences.',
        },
        security: {
          title: 'Security & Access',
          desc: 'Protect your account with strong authentication and session controls.',
        },
        notifications: {
          title: 'Notification Preferences',
          desc: 'Choose how and when VaptFix Pro keeps you informed.',
        },
        billing: {
          title: 'Billing & Plan',
          desc: 'View your subscription, usage, and billing details.',
        },
        risk: {
          title: 'Risk Criteria',
          desc: 'Configure how vulnerabilities are classified across your infrastructure.',
        },
        team: {
          title: 'Workspace Team',
          desc: 'Manage team members and collaboration in your workspace.',
        },
      },
      navItems: [
        { id: 'account', label: 'Account', icon: 'bi bi-person-gear' },
        { id: 'security', label: 'Security', icon: 'bi bi-shield-lock' },
        { id: 'notifications', label: 'Notifications', icon: 'bi bi-bell' },
        { id: 'billing', label: 'Billing', icon: 'bi bi-credit-card' },
        { id: 'risk', label: 'Risk Criteria', icon: 'bi bi-sliders' },
        { id: 'team', label: 'Team', icon: 'bi bi-people' },
      ],
      teamMembers: [
        { name: 'Sarah Jenkins', role: 'Analyst', status: 'Last active 2h ago', initial: 'S', email: 'sarah@vaptfix.pro' },
        { name: 'Marcus Thorne', role: 'Engineer', status: 'Last active 10m ago', initial: 'M', email: 'marcus@vaptfix.pro' },
        { name: 'Elena Lutz', role: 'Manager', status: 'Offline', initial: 'EL', email: 'elena@vaptfix.pro' },
      ],
    };
  },
  computed: {
    currentSectionMeta() {
      return this.sectionMeta[this.activeSection] || this.sectionMeta.account;
    },
    dashboardRoute() {
      const returnTo = this.$route?.query?.returnTo;
      if (
        typeof returnTo === 'string'
        && returnTo.startsWith('/')
        && !returnTo.includes('settings')
      ) {
        return returnTo;
      }
      return this.mode === 'admin' ? '/admindashboardonboarding' : '/userdashboard';
    },
    riskLevels() {
      return [
        { key: 'critical', label: 'Critical', value: this.formatRiskValue(this.riskCriteria.critical) },
        { key: 'high', label: 'High', value: this.formatRiskValue(this.riskCriteria.high) },
        { key: 'medium', label: 'Medium', value: this.formatRiskValue(this.riskCriteria.medium) },
        { key: 'low', label: 'Low', value: this.formatRiskValue(this.riskCriteria.low) },
      ];
    },
  },
  mounted() {
    const section = this.$route?.query?.section;
    if (typeof section === 'string' && this.sectionMeta[section]) {
      this.activeSection = section;
    }
    this.loadRiskCriteria();
  },
  methods: {
    selectSection(id) {
      this.activeSection = id;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    formatRiskValue(val) {
      if (val == null || val === '') return null;
      const key = String(val);
      return TIME_LABELS[key] || `${key} Days`;
    },
    async loadRiskCriteria() {
      const res = this.mode === 'admin'
        ? await this.authStore.fetchAdminRiskCriteria()
        : await this.authStore.fetchUserRiskCriteria();

      if (!res.status) return;

      const list = res.data?.risk_criteria || (res.data?.critical !== undefined ? [res.data] : []);
      const latest = Array.isArray(list) ? list[list.length - 1] : list;
      if (latest) {
        this.riskCriteria = {
          critical: latest.critical ?? null,
          high: latest.high ?? null,
          medium: latest.medium ?? null,
          low: latest.low ?? null,
        };
      }
    },
  },
};
</script>

<style scoped>
.settings-page {
  display: flex;
  min-height: 100vh;
  margin-top: 0;
  background: #f8f9fc;
  font-family: 'Inter', sans-serif;
  color: #191c1e;
}

.settings-sidebar {
  width: 256px;
  flex-shrink: 0;
  background: #241447;
  display: flex;
  flex-direction: column;
  padding: 0 0 24px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  padding-top: 60px;
  box-sizing: border-box;
  border-right: 1px solid #3a2b5e;
  overflow-y: auto;
  z-index: 100;
}

.settings-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 16px 24px;
  padding: 8px 16px;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  transition: all 0.2s;
  width: fit-content;
}

.settings-back-btn:hover {
  color: #fff;
  background: #3a2a5e;
  border-color: transparent;
}

.settings-sidebar-header {
  padding: 0 32px 24px;
}

.settings-sidebar-header h2 {
  color: #fff;
  font-family: 'Manrope', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.settings-sidebar-header p {
  color: #cbd5e1;
  font-size: 0.75rem;
  margin: 4px 0 0;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.settings-nav-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 32px;
  border: none;
  background: transparent;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  transition: all 0.3s;
  cursor: pointer;
}

.settings-nav-btn:hover {
  color: #fff;
  background: #3a2a5e;
}

.settings-nav-btn--active {
  background: #0f696e;
  color: #fff;
  border-radius: 0;
  margin-left: 0;
  padding-left: 32px;
}

.settings-plan-card {
  flex-shrink: 0;
  margin-top: auto;
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 0;
  padding: 16px;
  background: #3a2a5e;
  border-radius: 12px;
}

.settings-plan-title {
  color: #a592ce;
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.settings-plan-bar {
  width: 100%;
  height: 6px;
  background: #475569;
  border-radius: 9999px;
}

.settings-plan-fill {
  width: 80%;
  height: 100%;
  background: #0f696e;
  border-radius: 9999px;
}

.settings-plan-meta {
  color: #94a3b8;
  font-size: 0.75rem;
  margin: 8px 0 0;
}

.settings-main {
  flex: 1;
  margin-left: 256px;
  padding: 32px 40px 48px;
  padding-top: 92px;
  max-width: none;
  width: calc(100% - 256px);
  overflow-y: auto;
  min-width: 0;
  box-sizing: border-box;
}

.settings-page-header {
  margin-bottom: 48px;
}

.settings-page-header h1 {
  font-family: 'Manrope', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 8px;
}

.settings-page-header p {
  color: #49454f;
  font-size: 1.125rem;
  margin: 0;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 32px;
}

.settings-grid--single {
  grid-template-columns: 1fr;
}

.settings-section-view {
  width: 100%;
}

.settings-card--billing-only {
  max-width: 480px;
}

.settings-card {
  background: #fff;
  border-radius: 1.5rem;
  padding: 32px;
  box-shadow: 0 40px 40px 0 rgba(25, 28, 30, 0.06);
}

.settings-card--wide { grid-column: span 12; }
@media (min-width: 992px) {
  .settings-card--wide { grid-column: span 8; }
  .settings-card--billing { grid-column: span 4; }
  .settings-card--narrow { grid-column: span 4; }
}
.settings-card--full { grid-column: span 12; }
.settings-card--muted { background: #f2f3f6; box-shadow: none; }
.settings-card--billing {
  background: #241447;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.settings-card-row {
  grid-column: span 12;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 768px) {
  .settings-card-row { grid-template-columns: 1fr 1fr; }
}
.settings-stack { display: flex; flex-direction: column; gap: 24px; padding: 0; background: transparent; box-shadow: none; }
.settings-stack--full { max-width: 520px; }

.settings-profile {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
}

.settings-avatar-wrap { position: relative; }

.settings-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #3a2a5e;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  border: 4px solid #f2f3f6;
}

.settings-avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.settings-profile h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}

.settings-profile p {
  color: #49454f;
  font-size: 0.875rem;
  margin: 4px 0 8px;
}

.settings-badges { display: flex; gap: 8px; flex-wrap: wrap; }

.settings-badge {
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 4px;
}

.settings-badge--admin { background: #a1ecf2; color: #176d72; }
.settings-badge--muted { background: #e7e8eb; color: #49454f; }

.settings-form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}
@media (min-width: 768px) {
  .settings-form-grid { grid-template-columns: 1fr 1fr; }
}

.settings-field label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #49454f;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
  padding-left: 4px;
}

.settings-field input,
.settings-field select {
  width: 100%;
  background: #f2f3f6;
  border: none;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 0.875rem;
  color: #191c1e;
}

.settings-field input:focus,
.settings-field select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #0f696e;
}

.settings-actions {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}

.settings-btn-primary {
  background: #241447;
  color: #fff;
  font-weight: 700;
  padding: 12px 32px;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s;
}

.settings-btn-primary:hover { background: #3a2a5e; }

.settings-billing-accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 128px;
  height: 128px;
  background: #0f696e;
  opacity: 0.2;
  border-bottom-left-radius: 100%;
  margin-right: -40px;
  margin-top: -40px;
}

.settings-card--billing h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.settings-plan-name {
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  display: block;
}

.settings-plan-info p {
  color: #94a3b8;
  font-size: 0.875rem;
  margin: 8px 0 0;
}

.settings-usage { margin-top: 32px; }

.settings-usage-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 16px;
}

.settings-usage-row span:first-child { color: #cbd5e1; }
.settings-usage-row span:last-child { font-weight: 700; }

.settings-usage-bar {
  width: 100%;
  height: 8px;
  background: #1e293b;
  border-radius: 9999px;
}

.settings-usage-fill {
  width: 40%;
  height: 100%;
  background: #0f696e;
  border-radius: 9999px;
}

.settings-billing-actions {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-btn-white,
.settings-btn-outline,
.settings-btn-risk {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.settings-btn-white {
  background: #fff;
  color: #241447;
  border: none;
}

.settings-btn-outline {
  background: transparent;
  color: #cbd5e1;
  border: 1px solid #334155;
}

.settings-btn-outline:hover { color: #fff; }

.settings-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.settings-section-head h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #241447;
  margin: 0;
}

.settings-security-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f696e;
  font-size: 0.875rem;
  font-weight: 700;
}

.settings-security-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
}
@media (min-width: 768px) {
  .settings-security-grid { grid-template-columns: repeat(3, 1fr); }
}

.settings-security-col h4 {
  font-weight: 700;
  color: #241447;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
}

.settings-security-col p {
  font-size: 0.75rem;
  color: #49454f;
  line-height: 1.6;
  margin-bottom: 24px;
}

.settings-security-col--border {
  border-left: 1px solid rgba(203, 196, 208, 0.2);
  padding-left: 40px;
}
@media (max-width: 767px) {
  .settings-security-col--border {
    border-left: none;
    padding-left: 0;
    border-top: 1px solid rgba(203, 196, 208, 0.2);
    padding-top: 40px;
  }
}

.settings-btn-secondary {
  color: #0f696e;
  font-size: 0.875rem;
  font-weight: 700;
  border: 1px solid rgba(15, 105, 110, 0.2);
  background: transparent;
  padding: 8px 24px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s;
}

.settings-btn-secondary:hover { background: #a1ecf2; }

.settings-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.settings-toggle {
  width: 40px;
  height: 20px;
  background: #e1e2e5;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  padding: 2px;
  flex-shrink: 0;
}

.settings-toggle span {
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
}

.settings-toggle--on {
  background: #0f696e;
}

.settings-toggle--on span {
  margin-left: auto;
}

.settings-sso-list { display: flex; flex-direction: column; gap: 12px; }

.settings-sso-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
}

.settings-sso-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}

.settings-sso-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

.settings-sso-icon--google { background: #f1f5f9; }
.settings-sso-icon--github { background: #0f172a; color: #fff; }

.settings-sso-status {
  font-size: 10px;
  font-weight: 700;
  color: #0f696e;
  text-transform: uppercase;
}

.settings-sso-connect {
  font-size: 10px;
  font-weight: 700;
  color: #49454f;
  text-transform: uppercase;
  border: none;
  background: none;
  cursor: pointer;
}

.settings-notif-list { display: flex; flex-direction: column; gap: 24px; }

.settings-notif-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.settings-notif-item p {
  font-weight: 700;
  font-size: 0.875rem;
  margin: 0 0 4px;
}

.settings-notif-item span {
  font-size: 0.75rem;
  color: #49454f;
}

.settings-notif-item--off { opacity: 0.5; }

.settings-btn-invite {
  background: #0f696e;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 8px 16px;
  border: none;
  border-radius: 9999px;
  cursor: pointer;
}

.settings-team-list { display: flex; flex-direction: column; }

.settings-team-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #edeef1;
}

.settings-team-item:last-child { border-bottom: none; }

.settings-team-user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.settings-team-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e7e8eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
}

.settings-team-user p {
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0;
}

.settings-team-user span {
  font-size: 10px;
  color: #49454f;
}

.settings-table-wrap { overflow-x: auto; }

.settings-table {
  width: 100%;
  text-align: left;
  font-size: 0.875rem;
}

.settings-table th {
  color: #49454f;
  font-weight: 700;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding-bottom: 16px;
  border-bottom: 1px solid #edeef1;
}

.settings-table td {
  padding: 16px 0;
  border-bottom: 1px solid #edeef1;
}

.settings-table-amount { font-weight: 700; }

.settings-status-paid {
  padding: 4px 8px;
  background: #a1ecf2;
  color: #176d72;
  font-size: 10px;
  font-weight: 700;
  border-radius: 4px;
}

.settings-download-btn {
  color: #0f696e;
  font-weight: 700;
  font-size: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
}

.settings-risk-card {
  background: #f2f3f6;
  border-radius: 1.5rem;
  padding: 32px;
}

.settings-risk-card h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 1.125rem;
  font-weight: 700;
  color: #241447;
  margin: 0 0 16px;
}

.settings-risk-card > p {
  font-size: 0.75rem;
  color: #49454f;
  line-height: 1.6;
  margin-bottom: 24px;
}

.settings-risk-levels { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }

.settings-risk-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border-radius: 12px;
}

.settings-risk-bar {
  width: 4px;
  height: 32px;
  border-radius: 4px;
  flex-shrink: 0;
}

.settings-risk-bar--critical { background: #ba1a1a; }
.settings-risk-bar--high { background: #e65100; }
.settings-risk-bar--medium { background: #f9a825; }
.settings-risk-bar--low { background: #0f696e; }

.settings-risk-info p {
  font-size: 0.75rem;
  font-weight: 700;
  margin: 0;
  color: #241447;
}

.settings-risk-info span {
  font-size: 10px;
  color: #49454f;
}

.settings-btn-risk {
  background: #241447;
  color: #fff;
  border: none;
}

.settings-btn-risk:hover {
  background: #3a2a5e;
  color: #fff;
}

.settings-danger-card {
  background: #ffdad6;
  border: 1px solid rgba(186, 26, 26, 0.1);
  border-radius: 1.5rem;
  padding: 24px;
}

.settings-danger-card h3 {
  color: #93000a;
  font-size: 0.875rem;
  font-weight: 700;
  margin: 0 0 8px;
}

.settings-danger-card p {
  font-size: 10px;
  color: rgba(147, 0, 10, 0.8);
  margin-bottom: 16px;
}

.settings-btn-danger {
  width: 100%;
  color: #ba1a1a;
  font-size: 0.75rem;
  font-weight: 700;
  border: 1px solid rgba(186, 26, 26, 0.2);
  background: transparent;
  padding: 8px 16px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background 0.2s;
}

.settings-btn-danger:hover { background: #fff; }

.settings-footer {
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid #edeef1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
}
@media (min-width: 768px) {
  .settings-footer {
    flex-direction: row;
    justify-content: space-between;
  }
}

.settings-footer-links {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.settings-footer-links p,
.settings-footer-status p {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #49454f;
  margin: 0;
}

.settings-footer-links a {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #0f696e;
  text-decoration: none;
}

.settings-footer-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.settings-status-dot {
  width: 8px;
  height: 8px;
  background: #0f696e;
  border-radius: 50%;
}
</style>
