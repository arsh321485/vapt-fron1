<template>
  <div class="chat-demo">
    <div ref="frame" class="chat-frame" :class="'chat-frame--' + platform">
      <aside v-if="platform === 'slack'" class="slack-rail" aria-hidden="true">
        <span class="slack-mark">S</span>
        <i class="bi bi-house"></i>
        <i class="bi bi-chat-dots-fill slack-rail-on"></i>
        <i class="bi bi-bell"></i>
      </aside>

      <div class="chat-main">
        <header class="chat-top" :class="'chat-top--' + platform">
          <template v-if="platform === 'teams'">
            <span class="teams-logo" aria-hidden="true"></span>
            <strong>Microsoft Teams</strong>
            <span class="chat-top-title">VaptFix</span>
          </template>
          <template v-else>
            <strong># vaptfix</strong>
            <span class="chat-top-sub">VaptFix app</span>
          </template>
        </header>

        <div class="chat-scroll">
          <div class="msg">
            <div class="msg-av" aria-hidden="true">V</div>
            <div class="msg-body">
              <div class="msg-meta">
                <b>VaptFix</b>
                <span>{{ platform === 'teams' ? 'Yesterday 13:00' : 'APP  Yesterday at 13:00' }}</span>
              </div>

              <div class="bot-card">
                <div class="bot-tabs">
                  <span>Home</span>
                  <span class="on">Fix</span>
                  <span>Register</span>
                  <span>Automations</span>
                  <span>Team</span>
                  <span>Timeline Ext.</span>
                  <span>Reminder</span>
                  <span>Download Report</span>
                </div>

                <div class="sub-tabs">
                  <span>All Assets</span>
                  <span>All Vulnerabilities</span>
                  <span class="on">✦ Common Vulnerabilities</span>
                </div>

                <transition name="fade">
                  <div v-if="screen === 'common'" key="common" class="bot-screen">
                    <div class="team-row">
                      <span class="on">All Teams</span>
                      <span>Patch Mgmt</span>
                      <span>Config Mgmt</span>
                      <span>Network Sec.</span>
                      <span>Arch. Flaws</span>
                    </div>
                    <p class="bot-kicker">✦ Common Vulnerabilities</p>
                    <p class="bot-note">Vulnerabilities appearing on 4+ assets, by team.</p>
                    <p class="totals">All Teams · Total Vulns: 1</p>
                    <p class="sev-line">
                      <i class="dot crit"></i> Critical: 0
                      <i class="dot high"></i> High: 0
                      <i class="dot med"></i> Medium: 0
                      <i class="dot low"></i> Low: 1
                    </p>
                    <div class="chip-row">
                      <span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span>
                    </div>
                    <div class="chip-row">
                      <span class="on">All 1</span><span>Open 1</span><span>Closed 0</span><span>In Progress 0</span>
                    </div>
                    <div class="line">
                      <div>
                        <b>Missing HTTP Security Headers</b>
                        <small><i class="dot low"></i> 11 assets · Low · Team: Configuration Management</small>
                      </div>
                      <button ref="viewCommon" type="button" class="ghost" @click="jump('assets')">View ›</button>
                    </div>
                    <p class="foot">Showing 1-1 of 1</p>
                  </div>

                  <div v-else-if="screen === 'assets'" key="assets" class="bot-screen">
                    <button type="button" class="back" @click="jump('common')">← Back to Common Vulns</button>
                    <p class="bot-kicker">Missing HTTP Security Headers</p>
                    <p class="bot-note"><i class="dot low"></i> Low · Affects 11 asset(s) · Team: Configuration Management</p>
                    <div v-for="row in hosts" :key="row.host" class="line">
                      <div>
                        <b>{{ row.host }}</b>
                        <small :class="row.open ? 'open' : 'closed'"><i class="dot" :class="row.open ? 'crit' : 'low'"></i> {{ row.open ? 'Open' : 'Closed' }}</small>
                      </div>
                      <button
                        :ref="row.host === 'reis.sedco.com' ? 'viewReis' : null"
                        type="button"
                        class="ghost"
                        @click="jump('manual')"
                      >View ›</button>
                    </div>
                    <p class="foot">Showing 1-5 of 11</p>
                    <button type="button" class="ghost next">Next ›</button>
                  </div>

                  <div v-else-if="screen === 'manual'" key="manual" class="bot-screen">
                    <button type="button" class="back" @click="jump('assets')">← Back to Missing HTTP Security Headers</button>
                    <p class="bot-kicker">Missing HTTP Security Headers</p>
                    <p class="meta-line"><span>Asset</span> reis.sedco.com</p>
                    <p class="meta-line"><span>Severity</span> <i class="dot low"></i> Low</p>
                    <p class="meta-line"><span>Status</span> <i class="dot crit"></i> Open</p>
                    <div class="fix-tabs">
                      <span class="on">Manual</span>
                      <button ref="autoTab" type="button" class="ghost" @click="jump('auto')">Automation Fix</button>
                    </div>
                    <p class="step">Step 1 of 6 (view only) — 0/6 done · OS: Windows</p>
                    <p class="step-title">1. Step 1 — Pending</p>
                    <p class="step-copy">LOCATE: Identify the current HTTP security headers on the affected application.</p>
                    <p class="step-copy">WHERE: Use PowerShell to check the HTTP headers returned by the web application.</p>
                    <p class="warn">Important: follow the vendor’s guidelines for configuring HTTP security headers.</p>
                    <button type="button" class="ghost next">Next Step</button>
                  </div>

                  <div v-else key="auto" class="bot-screen">
                    <button type="button" class="back" @click="jump('manual')">← Back to Missing HTTP Security Headers</button>
                    <p class="bot-kicker">Missing HTTP Security Headers</p>
                    <p class="meta-line"><span>Asset</span> reis.sedco.com</p>
                    <p class="meta-line"><span>Severity</span> <i class="dot low"></i> Low</p>
                    <p class="meta-line"><span>Status</span> <i class="dot crit"></i> Open</p>
                    <div class="fix-tabs">
                      <button type="button" class="ghost" @click="jump('manual')">Manual</button>
                      <span class="on">Automation Fix</span>
                    </div>
                    <div class="kv">
                      <p><span>Severity</span> Low</p>
                      <p><span>OS</span> windows</p>
                      <p><span>Language</span> python</p>
                      <p><span>Automation Possible</span> Yes</p>
                      <p><span>Downloaded</span> 0x</p>
                    </div>
                    <p class="step-title">What this does</p>
                    <p class="step-copy">This script checks and updates the HTTP security headers for the web application.</p>
                    <p class="step-title">Run command</p>
                    <p class="cmd">python http_security_headers_fix.py</p>
                    <p class="step-title">Before running</p>
                    <p class="step-copy">Take a backup of the web.config file before making changes.</p>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-show="!paused" class="mock-cursor" :class="{ clicking: clicking }" :style="cursorStyle" aria-hidden="true">
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedChatDemo',
  props: {
    platform: { type: String, default: 'teams' },
  },
  emits: ['finished'],
  data() {
    return {
      screen: 'common',
      paused: false,
      cursorX: 62,
      cursorY: 22,
      clicking: false,
      timer: null,
      hosts: [
        { host: 'ss.sedco.com', open: false },
        { host: 'reis.sedco.com', open: true },
        { host: 'taxapp.sedco.com', open: true },
        { host: 'ss.methak.com', open: true },
        { host: 'ss.sedal.com.sa', open: true },
      ],
    };
  },
  computed: {
    cursorStyle() {
      return { left: `${this.cursorX}%`, top: `${this.cursorY}%` };
    },
  },
  mounted() {
    this.play();
  },
  beforeUnmount() {
    this.clearTimer();
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    },
    delay(ms) {
      return new Promise((resolve) => {
        this.timer = setTimeout(resolve, ms);
      });
    },
    jump(screen) {
      this.paused = true;
      this.clearTimer();
      this.screen = screen;
    },
    aim(refName) {
      const frame = this.$refs.frame;
      const target = this.$refs[refName];
      const node = Array.isArray(target) ? target[0] : target;
      if (!frame || !node || !node.getBoundingClientRect) return;
      const fr = frame.getBoundingClientRect();
      const r = node.getBoundingClientRect();
      this.cursorX = ((r.left + r.width / 2 - fr.left) / fr.width) * 100;
      this.cursorY = ((r.top + r.height / 2 - fr.top) / fr.height) * 100;
    },
    async clickRef(refName, next, dwell) {
      if (this.paused) return false;
      await this.$nextTick();
      this.aim(refName);
      await this.delay(700);
      if (this.paused) return false;
      this.clicking = true;
      setTimeout(() => { this.clicking = false; }, 280);
      await this.delay(340);
      if (this.paused) return false;
      this.screen = next;
      await this.delay(dwell);
      return !this.paused;
    },
    async play() {
      if (this.paused) return;
      this.screen = 'common';
      await this.delay(1500);
      if (!(await this.clickRef('viewCommon', 'assets', 1700))) return;
      if (!(await this.clickRef('viewReis', 'manual', 1900))) return;
      if (!(await this.clickRef('autoTab', 'auto', 2000))) return;
      if (!this.paused) this.$emit('finished');
    },
  },
};
</script>

<style scoped>
.chat-demo { width: 100%; display: flex; justify-content: center; padding: 20px; }
.chat-frame {
  width: 100%;
  max-width: 920px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  background: #f3f4f8;
}
.slack-rail {
  width: 52px;
  background: #4a154b;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 12px;
  flex-shrink: 0;
}
.slack-mark { width: 28px; height: 28px; border-radius: 8px; background: #fff; color: #4a154b; font-weight: 800; display: grid; place-items: center; font-size: 14px; }
.chat-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.chat-top { height: 42px; display: flex; align-items: center; gap: 10px; padding: 0 14px; color: #fff; flex-shrink: 0; }
.chat-top--teams { background: #5b5fc7; }
.chat-top--slack { background: #fff; color: #1d1c1d; border-bottom: 1px solid #e8e8e8; }
.chat-top-title, .chat-top-sub { opacity: 0.85; font-size: 12px; }
.teams-logo { width: 16px; height: 16px; background: conic-gradient(#fff 0 25%, transparent 0 50%, #fff 0 75%, transparent 0); border-radius: 2px; }
.chat-scroll { flex: 1; overflow: hidden; padding: 10px 12px 12px; }
.msg { display: flex; gap: 8px; height: 100%; }
.msg-av { width: 28px; height: 28px; border-radius: 6px; background: #5b5fc7; color: #fff; font-weight: 800; display: grid; place-items: center; flex-shrink: 0; }
.chat-frame--slack .msg-av { background: #4a154b; }
.msg-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.msg-meta { font-size: 12px; color: #5b5b66; display: flex; gap: 8px; margin-bottom: 6px; }
.msg-meta b { color: #1a1a1a; }
.bot-card {
  background: #fff;
  border: 1px solid #e6e8f0;
  border-radius: 12px;
  padding: 8px 10px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.bot-tabs, .sub-tabs, .team-row, .chip-row, .fix-tabs { display: flex; gap: 4px; flex-wrap: wrap; }
.bot-tabs span, .sub-tabs span, .team-row span, .chip-row span, .fix-tabs span, .ghost, .back {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #3c3c46;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  line-height: 1.3;
}
.bot-tabs span.on, .sub-tabs span.on, .team-row span.on, .chip-row span.on, .fix-tabs span.on {
  background: #5b4ee6;
  border-color: #5b4ee6;
  color: #fff;
}
.sub-tabs, .team-row { margin-top: 6px; }
.bot-screen { margin-top: 8px; }
.bot-kicker { margin: 6px 0 0; font-size: 13px; font-weight: 800; color: #1e1b4b; }
.bot-note, .totals, .sev-line, .foot, .step, .step-copy, .meta-line, .line small, .kv p {
  margin: 2px 0 0;
  font-size: 10px;
  color: #64748b;
}
.sev-line, .bot-note, .line small { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
.chip-row { margin-top: 6px; }
.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.dot.crit { background: #ef4444; }
.dot.high { background: #f97316; }
.dot.med { background: #eab308; }
.dot.low { background: #22c55e; }
.line { display: flex; justify-content: space-between; gap: 8px; align-items: center; padding: 4px 0; border-bottom: 1px solid #f1f5f9; }
.line b { display: block; font-size: 11px; color: #1e293b; }
.line small.open { color: #dc2626; }
.line small.closed { color: #16a34a; }
.ghost, .back { cursor: pointer; }
.back { margin-bottom: 2px; }
.next { margin-top: 6px; }
.meta-line span, .kv p span { display: inline-block; min-width: 118px; color: #94a3b8; font-weight: 700; }
.fix-tabs { margin-top: 6px; }
.step { margin-top: 6px; }
.step-title { margin: 6px 0 0; font-size: 11px; font-weight: 800; color: #1e293b; }
.warn { margin: 4px 0 0; font-size: 10px; color: #dc2626; }
.kv { margin-top: 6px; }
.cmd { margin: 2px 0 0; font-size: 10px; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; color: #1e293b; }
.mock-cursor { position: absolute; width: 20px; height: 20px; pointer-events: none; z-index: 5; transition: left 0.7s cubic-bezier(0.4, 0, 0.2, 1), top 0.7s cubic-bezier(0.4, 0, 0.2, 1); }
.cursor-dot, .cursor-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); border-radius: 50%; }
.cursor-dot { width: 8px; height: 8px; background: #319795; }
.cursor-ring { width: 20px; height: 20px; border: 2px solid #319795; opacity: 0.45; }
.mock-cursor.clicking .cursor-dot { background: #e53e3e; }
.mock-cursor.clicking .cursor-ring { border-color: #e53e3e; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.22s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
