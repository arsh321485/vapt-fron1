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

              <div v-if="platform === 'teams'" class="bot-card">
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

              <div v-else class="bot-card slack-card">
                <div class="bot-tabs slack-tabs">
                  <span>Home</span>
                  <span>Fix</span>
                  <span>Register</span>
                  <span>Automations</span>
                  <span class="on">Team</span>
                  <span>+ 3 more</span>
                </div>
                <div class="sub-tabs slack-actions">
                  <span :class="{ on: screen === 'performance' }">Team Performance</span>
                  <button ref="addUser" type="button" :class="{ on: screen === 'add' || screen === 'add-filled' || screen === 'added' }" @click="jump('add')">Add User</button>
                  <button ref="deleteUser" type="button" :class="{ on: screen === 'delete' }" @click="jump('delete')">Delete User</button>
                  <button ref="updateRole" type="button" :class="{ on: screen === 'role' || screen === 'role-filled' }" @click="jump('role')">Update User Role</button>
                  <button ref="externalUser" type="button" :class="{ on: screen === 'external' }" @click="jump('external')">External User</button>
                </div>

                <transition name="fade">
                  <div v-if="screen === 'performance'" key="performance" class="bot-screen">
                    <p class="bot-kicker">Team Performance Monitoring</p>
                    <p class="bot-note">Per-team closure rate, open/closed counts, and severity breakdown across all teams.</p>
                    <div class="perf-grid">
                      <div v-for="team in perfTeams" :key="team.name" class="perf-card">
                        <b>{{ team.name }}</b>
                        <small>{{ team.focus }}</small>
                        <div class="perf-stats">
                          <span><em>Closure</em><strong>{{ team.rate }}</strong></span>
                          <span><em>Closed</em><strong class="ok">{{ team.closed }}</strong></span>
                          <span><em>Open</em><strong class="bad">{{ team.open }}</strong></span>
                        </div>
                        <i class="perf-bar" :class="team.bar"></i>
                        <div class="sev-boxes">
                          <span>C {{ team.sev[0] }}</span>
                          <span>H {{ team.sev[1] }}</span>
                          <span>M {{ team.sev[2] }}</span>
                          <span>L {{ team.sev[3] }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'add' || screen === 'add-filled'" key="add" class="bot-screen">
                    <p class="bot-kicker">Add User</p>
                    <p class="field-label">User</p>
                    <button ref="addUserPick" type="button" class="fake-input" @click="jump('add-filled')">
                      {{ screen === 'add-filled' ? 'Ritika Bhikonde' : 'Select a user' }}
                    </button>
                    <p class="field-label">Type</p>
                    <p class="fake-input">{{ screen === 'add-filled' ? 'internal' : 'external' }}</p>
                    <p class="field-label">Team(s)</p>
                    <p class="check on">Patch Management</p>
                    <p class="check">Configuration Management</p>
                    <p class="check">Network Security</p>
                    <p class="check">Architectural Flaws</p>
                    <p class="bot-note">Assets — 0 selected of 1</p>
                    <p class="asset-line">161.126.58.98 [High]</p>
                    <button ref="addUserSubmit" type="button" class="green-btn" @click="jump('added')">Add User</button>
                  </div>

                  <div v-else-if="screen === 'added'" key="added" class="bot-screen">
                    <p class="bot-kicker ok-title">User Updated in VaptFix</p>
                    <p class="bot-note">Adds a Slack user to VaptFix with team access.</p>
                    <p class="meta-line"><span>Name</span> Ritika Bhikonde</p>
                    <p class="meta-line"><span>Email</span> ritubhikonde2000@gmail.com</p>
                    <p class="meta-line"><span>Type</span> internal</p>
                    <p class="meta-line"><span>Team(s)</span> Patch Management, Configuration Management</p>
                    <p class="bot-note">Their team access now includes: Patch Management, Configuration Management.</p>
                  </div>

                  <div v-else-if="screen === 'delete'" key="delete" class="bot-screen">
                    <p class="bot-kicker">Delete User</p>
                    <p class="bot-note">A user can be removed from the workspace as needed.</p>
                    <p class="field-label">User</p>
                    <p class="fake-input">Select a user</p>
                    <p class="field-label">Action</p>
                    <p class="fake-input">Deactivate (reversible)</p>
                    <button type="button" class="green-btn">Confirm</button>
                  </div>

                  <div v-else-if="screen === 'role' || screen === 'role-filled'" key="role" class="bot-screen">
                    <p class="bot-kicker">Update User Role</p>
                    <p class="bot-note">A user’s role can be changed as needed.</p>
                    <p class="field-label">Select User</p>
                    <button ref="rolePick" type="button" class="fake-input" @click="jump('role-filled')">
                      {{ screen === 'role-filled' ? 'Ritika Bhikonde' : 'Pick an option' }}
                    </button>
                    <template v-if="screen === 'role-filled'">
                      <p class="field-label">Update Team Role(s)</p>
                      <p class="check on">Patch Management</p>
                      <p class="check">Configuration Management</p>
                    </template>
                    <button type="button" class="green-btn">Update</button>
                  </div>

                  <div v-else key="external" class="bot-screen">
                    <p class="bot-kicker">External Users</p>
                    <p class="bot-note">All external users — name, email, assigned assets/vulns, access deadline, and status.</p>
                    <p class="meta-line"><span>Total</span> 0</p>
                    <p class="bot-note">No external users found.</p>
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
      screen: this.platform === 'slack' ? 'performance' : 'common',
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
      perfTeams: [
        { name: 'Network Security Team', focus: 'Infrastructure focus', rate: '0%', closed: 0, open: 7, sev: [0, 0, 7, 0], bar: 'bar-orange' },
        { name: 'Patch Management Team', focus: 'Lifecycle management', rate: '0%', closed: 0, open: 1, sev: [0, 1, 0, 0], bar: 'bar-red' },
        { name: 'Configuration Management Team', focus: 'System configuration', rate: '0%', closed: 0, open: 37, sev: [0, 7, 30, 0], bar: 'bar-orange' },
        { name: 'Architectural Flaws Team', focus: 'Design and architecture', rate: '0%', closed: 0, open: 0, sev: [0, 0, 0, 0], bar: 'bar-empty' },
      ],
    };
  },
  computed: {
    cursorStyle() {
      return { left: `${this.cursorX}%`, top: `${this.cursorY}%` };
    },
  },
  mounted() {
    this.screen = this.platform === 'slack' ? 'performance' : 'common';
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
      if (this.platform === 'slack') {
        this.screen = 'performance';
        await this.delay(1600);
        if (!(await this.clickRef('addUser', 'add', 1400))) return;
        if (!(await this.clickRef('addUserPick', 'add-filled', 1500))) return;
        if (!(await this.clickRef('addUserSubmit', 'added', 1700))) return;
        if (!(await this.clickRef('deleteUser', 'delete', 1500))) return;
        if (!(await this.clickRef('updateRole', 'role', 1200))) return;
        if (!(await this.clickRef('rolePick', 'role-filled', 1500))) return;
        if (!(await this.clickRef('externalUser', 'external', 1600))) return;
      } else {
        this.screen = 'common';
        await this.delay(1500);
        if (!(await this.clickRef('viewCommon', 'assets', 1700))) return;
        if (!(await this.clickRef('viewReis', 'manual', 1900))) return;
        if (!(await this.clickRef('autoTab', 'auto', 2000))) return;
      }
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
.chat-frame--slack .slack-tabs span.on,
.chat-frame--slack .slack-actions .on {
  background: #0f7a4b;
  border-color: #0f7a4b;
  color: #fff;
}
.slack-actions button {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #3c3c46;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  cursor: pointer;
}
.perf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px; }
.perf-card { border: 1px solid #e8edf3; border-radius: 8px; padding: 6px; }
.perf-card b { display: block; font-size: 10px; color: #1d4ed8; }
.perf-card small { display: block; font-size: 8px; color: #94a3b8; letter-spacing: 0.04em; text-transform: uppercase; }
.perf-stats { display: flex; gap: 8px; margin-top: 4px; }
.perf-stats span { display: flex; flex-direction: column; font-size: 8px; color: #94a3b8; }
.perf-stats strong { font-size: 12px; color: #0f172a; }
.perf-stats .ok { color: #16a34a; }
.perf-stats .bad { color: #dc2626; }
.perf-bar { display: block; height: 4px; border-radius: 99px; margin-top: 4px; background: #e5e7eb; }
.perf-bar.bar-orange { background: linear-gradient(90deg, #fb923c, #f97316); }
.perf-bar.bar-red { background: #ef4444; }
.sev-boxes { display: flex; gap: 3px; margin-top: 4px; }
.sev-boxes span { flex: 1; text-align: center; font-size: 8px; font-weight: 700; border-radius: 4px; padding: 2px 0; background: #f8fafc; color: #64748b; }
.field-label { margin: 6px 0 2px; font-size: 10px; font-weight: 700; color: #64748b; }
.fake-input {
  display: block;
  width: 100%;
  text-align: left;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #1e293b;
  font-size: 11px;
  padding: 5px 8px;
}
.check { margin: 2px 0 0; font-size: 11px; color: #334155; }
.check.on { font-weight: 700; }
.asset-line { margin: 2px 0 0; font-size: 11px; color: #334155; }
.green-btn {
  margin-top: 8px;
  border: 0;
  background: #0f7a4b;
  color: #fff;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  padding: 6px 10px;
  cursor: pointer;
}
.ok-title { color: #15803d; }
</style>
