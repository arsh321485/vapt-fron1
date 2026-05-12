<template>
  <div class="hsc-root" aria-live="polite">
    <!-- Launcher -->
    <button
      v-if="!open"
      type="button"
      class="hsc-launcher"
      aria-label="Open chat with VaptFix"
      @click="open = true"
    >
      <span class="hsc-launcher-wave" aria-hidden="true">👋</span>
      <span class="hsc-launcher-ring">
        <span class="hsc-launcher-inner">
          <svg class="hsc-launcher-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </span>
      </span>
      <span class="hsc-launcher-label" aria-hidden="true">We're here!</span>
    </button>

    <!-- Panel -->
    <div v-else class="hsc-panel" role="dialog" aria-label="Support chat">
      <button type="button" class="hsc-close" aria-label="Close" @click="closePanel">×</button>

      <!-- Welcome -->
      <template v-if="panel === 'welcome'">
        <div class="hsc-panel-head">
          <p class="hsc-panel-intro">
            We are live and ready to chat with you now. Say something to start a live chat.
          </p>
        </div>
        <div class="hsc-panel-body hsc-panel-body--welcome">
          <button type="button" class="hsc-conv-card" @click="goForm('welcome')">
            <div class="hsc-conv-card-text">
              <strong>New Conversation</strong>
              <span>We typically reply in a few minutes</span>
            </div>
            <span class="hsc-conv-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
          </button>
        </div>
      </template>

      <!-- Messages -->
      <template v-else-if="panel === 'messages'">
        <div class="hsc-subhead">
          <button type="button" class="hsc-back" aria-label="Back" @click="panel = 'welcome'">‹</button>
          <span class="hsc-subhead-title">Messages</span>
        </div>
        <div class="hsc-panel-body hsc-panel-body--scroll">
          <p class="hsc-section-title">Start a new chat</p>
          <button type="button" class="hsc-conv-card hsc-conv-card--border" @click="goForm('messages')">
            <div class="hsc-conv-card-text">
              <strong>New Conversation</strong>
              <span>We typically reply in a few minutes</span>
            </div>
            <span class="hsc-conv-card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
          </button>
          <p class="hsc-section-title hsc-mt">Recent</p>
          <div class="hsc-empty">No recent conversations</div>
        </div>
      </template>

      <!-- Form -->
      <template v-else>
        <div class="hsc-subhead hsc-subhead--form">
          <button type="button" class="hsc-back" aria-label="Back" @click="panel = formBack">‹</button>
          <p class="hsc-form-intro">
            Please fill out the form below to start chatting with the next available agent.
          </p>
        </div>
        <div class="hsc-panel-body hsc-panel-body--scroll">
          <div class="hsc-form-card">
            <label class="hsc-field">
              <span>Name</span>
              <input v-model="form.name" type="text" autocomplete="name" placeholder="Your name" />
            </label>
            <label class="hsc-field">
              <span>Company Email</span>
              <input v-model="form.email" type="email" autocomplete="email" placeholder="you@company.com" />
            </label>
            <p class="hsc-domain-q"><strong>Which domains you wish to discuss?</strong></p>
            <label v-for="opt in domainOptions" :key="opt" class="hsc-check">
              <input v-model="form.domains" type="checkbox" :value="opt" />
              <span>{{ opt }}</span>
            </label>
            <label class="hsc-field">
              <span>Your query</span>
              <textarea v-model="form.query" rows="4" placeholder="How can we help?" />
            </label>
            <button type="button" class="hsc-submit" @click="submitForm">Start chat</button>
          </div>
        </div>
      </template>

      <nav class="hsc-dock" aria-label="Chat widget navigation">
        <button
          type="button"
          class="hsc-dock-btn"
          :class="{ 'is-active': panel === 'welcome' || (panel === 'form' && formBack === 'welcome') }"
          aria-label="Home"
          @click="panel = 'welcome'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
        <button
          type="button"
          class="hsc-dock-btn"
          :class="{ 'is-active': panel === 'messages' || (panel === 'form' && formBack === 'messages') }"
          aria-label="Messages"
          @click="panel = 'messages'"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" width="22" height="22" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeSupportChatWidget',
  data() {
    return {
      open: false,
      panel: 'welcome',
      formBack: 'welcome',
      form: {
        name: '',
        email: '',
        domains: [],
        query: '',
      },
      domainOptions: [
        'Security Testing',
        'Security Compliance',
        'Solutions',
        'Managed Security Services',
      ],
    };
  },
  methods: {
    closePanel() {
      this.open = false;
      this.panel = 'welcome';
      this.formBack = 'welcome';
    },
    goForm(from) {
      this.formBack = from;
      this.panel = 'form';
    },
    submitForm() {
      const lines = [
        `Name: ${this.form.name}`,
        `Email: ${this.form.email}`,
        `Topics: ${this.form.domains.length ? this.form.domains.join(', ') : '(none selected)'}`,
        '',
        this.form.query || '(no message)',
      ];
      const body = encodeURIComponent(lines.join('\n'));
      window.location.href = `mailto:support@vaptfix.ai?subject=${encodeURIComponent('VaptFix — Chat request from homepage')}&body=${body}`;
    },
  },
};
</script>

<style scoped>
.hsc-root {
  position: fixed;
  /* Tuck into the bottom-right corner so footer legal links stay visible */
  right: max(12px, env(safe-area-inset-right, 0px));
  /* Clearance above footer link row */
  bottom: max(52px, calc(env(safe-area-inset-bottom, 0px) + 28px));
  z-index: 1080;
  font-family: 'Inter', system-ui, sans-serif;
}

/* Launcher */
.hsc-launcher {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  filter: drop-shadow(0 12px 24px rgba(36, 20, 71, 0.35));
}

.hsc-launcher-wave {
  position: absolute;
  left: -6px;
  top: 8px;
  font-size: 28px;
  line-height: 1;
  transform: rotate(-12deg);
  z-index: 1;
}

.hsc-launcher-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(145deg, #0f696e, #0a4e52);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hsc-launcher-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #241447;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hsc-launcher-icon {
  width: 34px;
  height: 34px;
  color: #0f696e;
}

.hsc-launcher-label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #241447;
  letter-spacing: 0.02em;
  background: rgba(255, 255, 255, 0.96);
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(15, 105, 110, 0.35);
  box-shadow: 0 2px 10px rgba(36, 20, 71, 0.12);
}

/* Panel */
.hsc-panel {
  width: min(360px, calc(100vw - 32px));
  max-height: min(520px, calc(100vh - 100px));
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: 0 20px 50px rgba(36, 20, 71, 0.22);
  border: 1px solid rgba(36, 20, 71, 0.08);
  position: relative;
}

.hsc-close {
  position: absolute;
  top: 10px;
  right: 12px;
  z-index: 2;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hsc-close:hover {
  background: rgba(255, 255, 255, 0.28);
}

.hsc-panel-head {
  flex-shrink: 0;
  padding: 44px 20px 20px;
  background: linear-gradient(155deg, #241447 0%, #2d1a55 45%, #0f696e 100%);
}

.hsc-panel-intro {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.95);
  text-align: center;
}

.hsc-subhead {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 44px 14px 12px;
  background: linear-gradient(155deg, #241447 0%, #1a0f32 55%, #0f696e 100%);
  color: #fff;
}

.hsc-subhead--form {
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding-top: 40px;
}

.hsc-back {
  align-self: flex-start;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
}

.hsc-back:hover {
  background: rgba(255, 255, 255, 0.22);
}

.hsc-subhead-title {
  font-weight: 700;
  font-size: 17px;
  color: #fff;
}

.hsc-form-intro {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.92);
}

.hsc-panel-body {
  flex: 1;
  min-height: 0;
  padding: 16px;
  background: #faf9fc;
  background-image: radial-gradient(#ebe6f3 1px, #faf9fc 1px);
  background-size: 18px 18px;
}

.hsc-panel-body--welcome {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.hsc-panel-body--scroll {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.hsc-conv-card {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  text-align: left;
  box-shadow: 0 4px 14px rgba(36, 20, 71, 0.06);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.hsc-conv-card:hover {
  border-color: rgba(15, 105, 110, 0.35);
  box-shadow: 0 6px 18px rgba(15, 105, 110, 0.12);
}

.hsc-conv-card--border {
  border-color: rgba(15, 105, 110, 0.35);
}

.hsc-conv-card-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hsc-conv-card-text strong {
  font-size: 15px;
  color: #241447;
}

.hsc-conv-card-text span {
  font-size: 12px;
  color: #64748b;
}

.hsc-conv-card-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(15, 105, 110, 0.12);
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hsc-conv-card-icon svg {
  width: 22px;
  height: 22px;
}

.hsc-section-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: #241447;
}

.hsc-mt {
  margin-top: 20px;
}

.hsc-empty {
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
  padding: 28px 12px;
  background: #fff;
  border-radius: 12px;
  border: 1px dashed rgba(36, 20, 71, 0.1);
}

.hsc-form-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(36, 20, 71, 0.08);
  box-shadow: 0 4px 14px rgba(36, 20, 71, 0.05);
}

.hsc-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #475569;
  font-weight: 500;
}

.hsc-field input,
.hsc-field textarea {
  font: inherit;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(36, 20, 71, 0.12);
  color: #241447;
  background: #fff;
}

.hsc-field input:focus,
.hsc-field textarea:focus {
  outline: none;
  border-color: #0f696e;
  box-shadow: 0 0 0 3px rgba(15, 105, 110, 0.15);
}

.hsc-domain-q {
  margin: 4px 0 10px;
  font-size: 13px;
  color: #241447;
}

.hsc-check {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #49454f;
  cursor: pointer;
}

.hsc-check input {
  width: 16px;
  height: 16px;
  accent-color: #0f696e;
}

.hsc-submit {
  width: 100%;
  margin-top: 16px;
  padding: 12px 16px;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #0f696e, #0a4e52);
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(15, 105, 110, 0.35);
}

.hsc-submit:hover {
  filter: brightness(1.05);
}

.hsc-dock {
  flex-shrink: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 16px 12px;
  background: #fff;
  border-top: 1px solid rgba(36, 20, 71, 0.08);
}

.hsc-dock-btn {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background 0.2s;
}

.hsc-dock-btn:hover {
  color: #241447;
  background: rgba(36, 20, 71, 0.06);
}

.hsc-dock-btn.is-active {
  color: #0f696e;
  background: rgba(15, 105, 110, 0.12);
}
</style>
