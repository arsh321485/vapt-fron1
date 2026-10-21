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
                  <span :class="{ on: teamsSection === 'home' }">Home</span>
                  <button ref="fixTab" type="button" :class="{ on: teamsSection === 'fix' }" @click="jump('fix-assets')">Fix</button>
                  <button ref="registerTab" type="button" :class="{ on: teamsSection === 'register' }" @click="jump('register')">Register</button>
                  <button ref="automationsTab" type="button" :class="{ on: teamsSection === 'automations' }" @click="jump('auto-full')">Automations</button>
                  <button ref="teamTab" type="button" :class="{ on: teamsSection === 'team' }" @click="jump('team-perf')">Team</button>
                  <span>Timeline Ext.</span>
                  <span>Reminder</span>
                  <span>Download Report</span>
                </div>

                <div v-if="teamsSection === 'fix'" class="sub-tabs">
                  <span class="on">All Assets</span>
                  <span>All Vulnerabilities</span>
                  <span>✦ Common Vulnerabilities</span>
                </div>
                <div v-else-if="teamsSection === 'register'" class="sub-tabs">
                  <span :class="{ on: screen === 'register' }">Register</span>
                  <button ref="scriptTab" type="button" :class="{ on: screen === 'script' }" @click="jump('script')">Script</button>
                </div>
                <div v-else-if="teamsSection === 'automations'" class="sub-tabs">
                  <span :class="{ on: screen === 'auto-full' }">Full</span>
                  <button ref="partialTab" type="button" :class="{ on: screen === 'auto-partial' }" @click="jump('auto-partial')">Partial</button>
                </div>
                <div v-else-if="teamsSection === 'team'" class="sub-tabs">
                  <span :class="{ on: screen === 'team-perf' }">Team Performance</span>
                  <button ref="addUserTeams" type="button" :class="{ on: screen === 'team-add' }" @click="jump('team-add')">Add User</button>
                  <button ref="deleteUserTeams" type="button" :class="{ on: screen === 'team-delete' || screen === 'team-delete-detail' }" @click="jump('team-delete')">Delete User</button>
                  <span>Update User Role</span>
                  <span>External User</span>
                </div>

                <transition name="fade">
                  <div v-if="screen === 'home'" key="home" class="bot-screen dash">
                    <p class="bot-kicker dash-title"><i class="bi bi-bar-chart-fill"></i> VaptFix Admin Dashboard</p>
                    <p class="bot-note">Overall summary — assets, vuln severity, mitigation timeline, mean fix time, and support tickets.</p>
                    <div class="dash-3">
                      <div class="dash-card">
                        <span class="lbl"><i class="bi bi-building"></i> Total assets</span>
                        <b class="big">29</b>
                        <small>Monitored endpoints</small>
                      </div>
                      <div class="dash-card dash-risk">
                        <div class="ring ring-risk" aria-hidden="true"><b>2.67</b></div>
                        <div class="risk-copy">
                          <span class="lbl"><i class="bi bi-exclamation-triangle-fill warn"></i> Avg risk score</span>
                          <b class="score">2.67 <em>/ 10</em></b>
                          <small>Low risk level</small>
                        </div>
                      </div>
                      <div class="dash-card">
                        <span class="lbl"><i class="bi bi-lightning-charge-fill bolt"></i> Mean time to remediate</span>
                        <b class="big">3 days, 12<br>hours</b>
                        <small>Average resolution time</small>
                      </div>
                    </div>
                    <div class="dash-2">
                      <div class="dash-card">
                        <span class="title"><i class="dot crit"></i> Vulnerabilities by Severity</span>
                        <div class="vbars">
                          <div><strong>0</strong><i class="crit"></i><small>Critical</small></div>
                          <div><strong>0</strong><i class="high"></i><small>High</small></div>
                          <div><strong>4</strong><i class="med"></i><small>Medium</small></div>
                          <div><strong>14</strong><i class="low"></i><small>Low</small></div>
                        </div>
                      </div>
                      <div class="dash-card">
                        <span class="title"><i class="bi bi-wrench"></i> Vulns Fixed <em>0 / 18</em></span>
                        <div class="fixed-row">
                          <div class="ring ring-empty" aria-hidden="true"><span class="ring-mid"><b>0</b><small>fixed</small></span></div>
                          <ul>
                            <li><i class="dot crit"></i> Critical <b>0</b></li>
                            <li><i class="dot high"></i> High <b>0</b></li>
                            <li><i class="dot med"></i> Medium <b>0</b></li>
                            <li><i class="dot low"></i> Low <b>0</b></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="dash-card">
                      <span class="lbl"><i class="bi bi-clock"></i> Mitigation timeline</span>
                      <div class="time-pills">
                        <span><i class="dot crit"></i> Critical — 1 day</span>
                        <span><i class="dot high"></i> High — 2 days</span>
                        <span><i class="dot med"></i> Medium — 3 days</span>
                        <span><i class="dot low"></i> Low — 4 days</span>
                      </div>
                    </div>
                    <div class="dash-card">
                      <span class="lbl"><i class="dot pink"></i> Support requests</span>
                      <div class="support-row">
                        <div><b class="g">0</b><small>Total Requests</small></div>
                        <div><b class="m">—</b><small>Pending</small></div>
                        <div><b class="blu">0</b><small>Closed</small></div>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'fix-assets'" key="fix-assets" class="bot-screen">
                    <p class="bot-kicker">All Assets</p>
                    <p class="bot-note">Every asset in your latest report. Tap View to see its vulnerabilities.</p>
                    <div class="chip-row"><span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span></div>
                    <div class="chip-row"><span class="on">All 18</span><span>Open 18</span><span>Closed 0</span><span>In Progress 0</span></div>
                    <div class="chip-row"><span class="on">All 29</span><span>Assets 15</span><span>Web App 12</span><span>Firewall 0</span><span>Server 2</span></div>
                    <div v-for="host in fixAssets" :key="host" class="line">
                      <div><b>{{ host }}</b><small>1 Vulns · Open · Web App · Low: 1</small></div>
                      <button :ref="host === 'ss.sedco.com' ? 'viewSs' : null" type="button" class="ghost" @click="jump('fix-asset')">View ›</button>
                    </div>
                    <p class="foot">Showing 1-5 of 29</p>
                  </div>

                  <div v-else-if="screen === 'fix-asset'" key="fix-asset" class="bot-screen">
                    <button type="button" class="back" @click="jump('fix-assets')">← Back to All Assets</button>
                    <p class="bot-kicker">ss.sedco.com</p>
                    <p class="bot-note">1 vulnerabilities on this asset.</p>
                    <div class="line">
                      <div><b>Missing HTTP Security Headers</b><small class="closed"><i class="dot low"></i> Low · Closed</small></div>
                      <button ref="viewVuln" type="button" class="ghost" @click="jump('manual')">View ›</button>
                    </div>
                  </div>

                  <div v-else-if="screen === 'manual'" key="manual" class="bot-screen">
                    <button type="button" class="back" @click="jump('fix-asset')">← Back to ss.sedco.com</button>
                    <p class="bot-kicker">Missing HTTP Security Headers</p>
                    <p class="meta-line"><span>Asset</span> ss.sedco.com</p>
                    <p class="meta-line"><span>Severity</span> <i class="dot low"></i> Low</p>
                    <p class="meta-line"><span>Status</span> <i class="dot low"></i> Closed</p>
                    <div class="fix-tabs">
                      <span class="on">Manual</span>
                      <button ref="autoTab" type="button" class="ghost" @click="jump('auto')">Automation Fix</button>
                    </div>
                    <p class="step">Step 6 of 6 (view only) — 6/6 done · OS: Windows</p>
                    <p class="step-title">6. Step 6 — Done</p>
                    <p class="step-copy">LOCATE: Perform a final check of the HTTP security headers to ensure all changes are effective.</p>
                    <p class="warn">Important: follow the vendor’s guidelines for configuring HTTP security headers.</p>
                  </div>

                  <div v-else-if="screen === 'auto'" key="auto" class="bot-screen">
                    <button type="button" class="back" @click="jump('manual')">← Back to ss.sedco.com</button>
                    <p class="bot-kicker">Missing HTTP Security Headers</p>
                    <p class="meta-line"><span>Asset</span> ss.sedco.com</p>
                    <p class="meta-line"><span>Severity</span> <i class="dot low"></i> Low</p>
                    <p class="meta-line"><span>Status</span> <i class="dot low"></i> Closed</p>
                    <div class="fix-tabs"><span>Manual</span><span class="on">Automation Fix</span></div>
                    <div class="kv">
                      <p><span>Severity</span> Low</p>
                      <p><span>OS</span> windows</p>
                      <p><span>Language</span> python</p>
                      <p><span>Automation Possible</span> Yes</p>
                      <p><span>Downloaded</span> 0x</p>
                    </div>
                    <p class="step-title">Run command</p>
                    <p class="cmd">python http_security_headers_fix.py</p>
                    <p class="step-copy">Take a backup of the web.config file before making changes.</p>
                  </div>

                  <div v-else-if="screen === 'register'" key="register" class="bot-screen">
                    <p class="bot-kicker">Register</p>
                    <p class="bot-note">All vulnerabilities in your latest report with status and remediation actions.</p>
                    <div class="chip-row"><span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span></div>
                    <div class="chip-row"><span class="on">All 18</span><span>Open 18</span><span>Closed 0</span><span>In Progress 0</span></div>
                    <div v-for="row in registerRows" :key="row.host + row.name" class="line">
                      <div><b>{{ row.name }}</b><small>{{ row.host }} · Open</small></div>
                      <span class="ghost">View ›</span>
                    </div>
                    <p class="foot">Showing 1-5 of 18</p>
                  </div>

                  <div v-else-if="screen === 'script'" key="script" class="bot-screen">
                    <p class="bot-kicker">Script</p>
                    <p class="bot-note">AI-generated automation scripts across your latest report.</p>
                    <div v-for="row in scriptRows" :key="row.name" class="line">
                      <div><b>{{ row.name }}</b><small>{{ row.host }} · Full · Downloads: 0 · Team: {{ row.team }}</small></div>
                    </div>
                    <p class="foot">Showing 1-5 of 17</p>
                  </div>

                  <div v-else-if="screen === 'auto-full'" key="auto-full" class="bot-screen">
                    <p class="bot-kicker">Fully Automated</p>
                    <p class="bot-note">Automation coverage for your latest report — from the AI-generated automation analysis on each vulnerability.</p>
                    <div class="chip-row"><span class="on">All 17</span><span>Critical 0</span><span>High 0</span><span>Medium 4</span><span>Low 13</span></div>
                    <div v-for="row in scriptRows" :key="'full-' + row.name" class="line">
                      <div><b>{{ row.name }}</b><small>{{ row.host }} · Team: {{ row.team }} · Full</small></div>
                      <span class="ghost">View ›</span>
                    </div>
                    <p class="foot">Showing 1-5 of 17</p>
                  </div>

                  <div v-else-if="screen === 'auto-partial'" key="auto-partial" class="bot-screen">
                    <p class="bot-kicker">Partially Automated</p>
                    <p class="bot-note">Automation coverage for your latest report — from the AI-generated automation analysis on each vulnerability.</p>
                    <div class="chip-row"><span class="on">All 0</span><span>Critical 0</span><span>High 0</span><span>Medium 0</span><span>Low 0</span></div>
                    <p class="bot-note">No vulnerabilities found for this filter.</p>
                  </div>

                  <div v-else-if="screen === 'team-perf'" key="team-perf" class="bot-screen">
                    <p class="bot-kicker">Team Performance Monitoring</p>
                    <p class="bot-note">Per-team closure rate, open/closed counts, and severity breakdown across all teams.</p>
                    <div class="perf-grid">
                      <div v-for="team in teamsPerf" :key="team.name" class="perf-card">
                        <b>{{ team.name }}</b>
                        <small>{{ team.focus }}</small>
                        <div class="perf-stats">
                          <span><em>Closure</em><strong>0%</strong></span>
                          <span><em>Closed</em><strong class="ok">0</strong></span>
                          <span><em>Open</em><strong class="bad">{{ team.open }}</strong></span>
                        </div>
                        <i class="perf-bar" :class="team.bar"></i>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'team-add'" key="team-add" class="bot-screen">
                    <p class="bot-kicker">Add User</p>
                    <p class="bot-note">Add a new team member and grant them access to one team.</p>
                    <p class="field-label">Pick someone already in this Teams team</p>
                    <p class="fake-input">Search Teams members...</p>
                    <p class="field-label">User Type</p>
                    <p class="fake-input">External</p>
                    <p class="field-label">First Name</p>
                    <p class="fake-input">e.g. Ritu</p>
                    <p class="field-label">Email</p>
                    <p class="fake-input">name@example.com</p>
                    <p class="check">Patch Management</p>
                    <p class="check">Configuration Management</p>
                    <p class="check on">Show Assets &amp; Vulnerabilities for selected Team(s)</p>
                    <button type="button" class="green-btn">Add User</button>
                  </div>

                  <div v-else-if="screen === 'team-delete'" key="team-delete" class="bot-screen">
                    <p class="bot-kicker">Delete User</p>
                    <p class="bot-note">Deactivate (reversible) or permanently delete a team member.</p>
                    <div class="line">
                      <div>
                        <b>Asha Singh</b>
                        <small>asha@secureitlabservices.com · Patch Management, Configuration Management, Network Security, Architectural Flaws</small>
                      </div>
                      <button ref="viewAsha" type="button" class="ghost" @click="jump('team-delete-detail')">View ›</button>
                    </div>
                    <p class="foot">Showing 1-1 of 1</p>
                  </div>

                  <div v-else key="team-delete-detail" class="bot-screen">
                    <button type="button" class="back" @click="jump('team-delete')">← Back to Delete User</button>
                    <p class="bot-kicker">Asha Singh</p>
                    <p class="meta-line"><span>Email</span> asha@secureitlabservices.com</p>
                    <p class="meta-line"><span>Type</span> internal</p>
                    <p class="meta-line"><span>Team(s)</span> Patch Management, Configuration Management, Network Security, Architectural Flaws</p>
                    <div class="fix-tabs"><span>Deactivate</span><span class="on danger">Delete Permanently</span></div>
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
      screen: 'home',
      paused: false,
      cursorX: 18,
      cursorY: 18,
      clicking: false,
      timer: null,
      fixAssets: ['portal.sedco.com', 'ss.sedco.com', 'reis.sedco.com', 'taxapp.sedco.com', 'ss.methak.com'],
      registerRows: [
        { name: 'CORS Misconfiguration – Arbitrary Origin Reflection', host: 'portal.sedco.com' },
        { name: 'Missing HTTP Security Headers', host: 'ss.sedco.com' },
        { name: 'Missing HTTP Security Headers', host: 'reis.sedco.com' },
        { name: 'Missing HTTP Security Headers', host: 'taxapp.sedco.com' },
        { name: 'Missing HTTP Security Headers', host: 'ss.methak.com' },
      ],
      scriptRows: [
        { name: 'Use of AES-CBC Instead of Authenticated Encryption', host: 'MySedco.apk', team: 'Patch Management' },
        { name: 'Application Signed with Debug Certificate', host: 'MySedco.apk', team: 'Configuration Management' },
        { name: 'TLS Version 1.1 Deprecated Protocol', host: 'ss-test.sedco.com', team: 'Configuration Management' },
        { name: 'Outdated Microsoft Internet Information Services (IIS) 8.0', host: 'sedcosrv8', team: 'Patch Management' },
        { name: 'SMB Signing Not Required', host: '172.17.1.188', team: 'Configuration Management' },
      ],
      teamsPerf: [
        { name: 'Network Security Team', focus: 'Infrastructure focus', open: 0, bar: 'bar-empty' },
        { name: 'Patch Management Team', focus: 'Lifecycle management', open: 2, bar: 'bar-green' },
        { name: 'Configuration Management Team', focus: 'System configuration', open: 15, bar: 'bar-orange' },
        { name: 'Architectural Flaws Team', focus: 'Design and architecture', open: 0, bar: 'bar-empty' },
      ],
    };
  },
  computed: {
    cursorStyle() {
      return { left: `${this.cursorX}%`, top: `${this.cursorY}%` };
    },
    teamsSection() {
      if (this.screen === 'home') return 'home';
      if (['fix-assets', 'fix-asset', 'manual', 'auto'].includes(this.screen)) return 'fix';
      if (this.screen === 'register' || this.screen === 'script') return 'register';
      if (this.screen === 'auto-full' || this.screen === 'auto-partial') return 'automations';
      if (String(this.screen).startsWith('team')) return 'team';
      return 'home';
    },
  },
  mounted() {
    this.screen = 'home';
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
      this.screen = 'home';
      await this.delay(1500);
      if (!(await this.clickRef('fixTab', 'fix-assets', 1400))) return;
      if (!(await this.clickRef('viewSs', 'fix-asset', 1300))) return;
      if (!(await this.clickRef('viewVuln', 'manual', 1400))) return;
      if (!(await this.clickRef('autoTab', 'auto', 1400))) return;
      if (!(await this.clickRef('registerTab', 'register', 1400))) return;
      if (!(await this.clickRef('scriptTab', 'script', 1400))) return;
      if (!(await this.clickRef('automationsTab', 'auto-full', 1400))) return;
      if (!(await this.clickRef('partialTab', 'auto-partial', 1200))) return;
      if (!(await this.clickRef('teamTab', 'team-perf', 1400))) return;
      if (!(await this.clickRef('addUserTeams', 'team-add', 1400))) return;
      if (!(await this.clickRef('deleteUserTeams', 'team-delete', 1300))) return;
      if (!(await this.clickRef('viewAsha', 'team-delete-detail', 1500))) return;
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
  height: 640px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  display: flex;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  background: #f3f4f8;
}
.chat-frame--teams, .chat-frame--slack { height: 760px; }
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
.bot-tabs { flex-wrap: nowrap; gap: 3px; }
.bot-tabs button, .bot-tabs span { white-space: nowrap; }
.bot-tabs button, .sub-tabs button {
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #3c3c46;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 7px;
  line-height: 1.3;
  cursor: pointer;
}
.bot-tabs button.on, .sub-tabs button.on { background: #5b4ee6; border-color: #5b4ee6; color: #fff; }
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
.fix-tabs span.danger { background: #dc2626; border-color: #dc2626; color: #fff; }
.bot-tabs button, .bot-tabs span { font-size: 9px; padding: 3px 5px; }
.dash { display: flex; flex-direction: column; gap: 8px; }
.dash-title { display: flex; align-items: center; gap: 6px; }
.dash-title i { color: #6366f1; font-size: 14px; }
.dash-3, .dash-2, .support-row { display: grid; gap: 8px; }
.dash-3 { grid-template-columns: 1fr 1.15fr 1fr; }
.support-row { grid-template-columns: 1fr 1fr 1fr; }
.dash-2 { grid-template-columns: 1.25fr 1fr; }
.dash-card {
  border: 1px solid #e8edf5;
  border-radius: 12px;
  background: #fff;
  padding: 10px 12px;
  min-width: 0;
}
.lbl, .title {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 9px;
  font-weight: 800;
  color: #94a3b8;
}
.lbl { letter-spacing: 0.04em; text-transform: uppercase; }
.title { font-size: 11px; color: #1e293b; text-transform: none; letter-spacing: 0; }
.title em { font-style: normal; color: #94a3b8; font-weight: 700; margin-left: 4px; }
.lbl i, .title i { font-size: 11px; color: #94a3b8; }
.lbl i.warn, .bolt { color: #f59e0b; }
.big { display: block; margin-top: 4px; font-size: 22px; line-height: 1.05; color: #111827; font-weight: 800; }
.dash-card > small, .risk-copy small, .ring small { display: block; margin-top: 2px; font-size: 10px; color: #64748b; font-weight: 500; }
.dash-risk { display: flex; align-items: center; gap: 10px; }
.risk-copy { min-width: 0; }
.score { display: block; margin-top: 2px; font-size: 16px; line-height: 1.1; color: #111827; }
.score em { font-style: normal; font-size: 12px; color: #94a3b8; font-weight: 700; }
.ring {
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  position: relative;
  text-align: center;
}
.ring::before {
  content: "";
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: #fff;
}
.ring b, .ring small, .ring-mid { position: relative; z-index: 1; }
.ring-mid { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.ring b { display: block; font-weight: 800; color: #111827; line-height: 1; }
.ring-risk {
  width: 72px;
  height: 72px;
  background: conic-gradient(#f5a524 0 96deg, #e7e9ee 96deg 360deg);
}
.ring-risk b { font-size: 13px; }
.ring-empty {
  width: 92px;
  height: 92px;
  background: conic-gradient(#e5e7eb 0 360deg);
}
.ring-empty::before { inset: 11px; }
.ring-empty b { font-size: 22px; }
.ring-empty small { font-size: 10px; color: #94a3b8; }
.vbars { height: 118px; display: flex; align-items: flex-end; justify-content: space-around; margin-top: 8px; }
.vbars > div { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; height: 100%; width: 22%; }
.vbars i { width: 28px; border-radius: 5px 5px 2px 2px; display: block; }
.vbars i.crit, .vbars i.high { height: 7px; background: #ef4444; }
.vbars i.med { height: 42px; background: #f5b301; }
.vbars i.low { height: 86px; background: #22c55e; }
.vbars strong { font-size: 13px; font-weight: 800; color: #111827; }
.vbars small { font-size: 10px; color: #94a3b8; }
.fixed-row { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.fixed-row ul { list-style: none; margin: 0; padding: 0; flex: 1; }
.fixed-row li { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #64748b; line-height: 1.7; }
.fixed-row li b { margin-left: auto; color: #111827; font-weight: 700; }
.time-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.time-pills span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 10px;
  font-weight: 700;
  color: #334155;
  text-transform: none;
  letter-spacing: 0;
}
.support-row { margin-top: 8px; }
.support-row > div { background: #f8fafc; border-radius: 10px; padding: 8px 6px; text-align: center; }
.support-row b { display: block; font-size: 18px; line-height: 1.1; font-weight: 800; }
.support-row b.g { color: #16a34a; }
.support-row b.m { color: #94a3b8; }
.support-row b.blu { color: #2563eb; }
.support-row small { display: block; margin-top: 2px; font-size: 10px; color: #64748b; font-weight: 600; text-transform: none; letter-spacing: 0; }
.perf-bar.bar-green { background: #22c55e; }
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
.dot.pink { background: #f43f5e; }
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
.chat-frame--slack .bot-tabs button.on,
.chat-frame--slack .bot-tabs span.on,
.chat-frame--slack .sub-tabs button.on,
.chat-frame--slack .sub-tabs span.on,
.chat-frame--slack .chip-row span.on,
.chat-frame--slack .fix-tabs span.on {
  background: #0f7a4b;
  border-color: #0f7a4b;
  color: #fff;
}
.chat-frame--slack .fix-tabs span.danger {
  background: #dc2626;
  border-color: #dc2626;
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
