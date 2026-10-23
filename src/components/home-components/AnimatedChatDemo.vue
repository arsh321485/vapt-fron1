<template>
  <div class="chat-demo">
    <div ref="frame" class="chat-frame" :class="'chat-frame--' + platform">
      <aside v-if="platform === 'slack'" class="slack-rail" aria-hidden="true">
        <span class="slack-mark">S</span>
        <i class="bi bi-chat-dots-fill slack-rail-on"></i>
        <i class="bi bi-bell"></i>
      </aside>

      <div class="chat-main">
        <header class="chat-top" :class="'chat-top--' + platform">
          <template v-if="platform === 'teams'">
            <svg class="teams-logo" viewBox="0 0 16 16" aria-hidden="true">
              <circle cx="12.15" cy="4.15" r="1.25" fill="currentColor" />
              <path fill="currentColor" d="M10.4 6.15h2.15c.45 0 .8.35.8.8v1.7c0 1.45-1.15 2.45-2.55 2.45-.25 0-.5-.02-.72-.07A3.2 3.2 0 0 0 11.2 9V7.55c0-.55-.12-1.05-.35-1.5.15-.02.3 0 .45.1z" />
              <circle cx="7.15" cy="5.05" r="1.7" fill="currentColor" />
              <path fill="currentColor" d="M9.55 7.35H4.75c-.7 0-1.25.55-1.25 1.25v2.85c0 1.45 1.65 2.6 3.65 2.6s3.65-1.15 3.65-2.6V8.6c0-.7-.55-1.25-1.25-1.25z" />
            </svg>
            <strong>Microsoft Teams</strong>
          </template>
          <template v-else>
            <strong># vaptfix</strong>
            <span class="chat-top-sub">APP</span>
          </template>
        </header>

        <div class="chat-scroll">
          <div class="msg">
            <div class="msg-av" aria-hidden="true">V</div>
            <div class="msg-body">
              <div class="msg-meta">
                <b>VaptFix</b>
                <span v-if="platform !== 'teams'">APP  Yesterday at 13:00</span>
              </div>

              <div class="bot-card">
                <template v-if="platform === 'slack'">
                  <div class="bot-tabs">
                    <span :class="{ on: section === 'home' }"><i class="bi bi-house"></i> Home</span>
                    <button ref="sFix" type="button" :class="{ on: section === 'fix' }" @click="jump('assets')"><i class="bi bi-wrench"></i> Fix</button>
                    <button ref="sRegister" type="button" :class="{ on: section === 'register' }" @click="jump('register')"><i class="bi bi-card-list"></i> Register</button>
                    <span><i class="bi bi-robot"></i> Automations</span>
                    <button ref="sTeam" type="button" :class="{ on: section === 'team' }" @click="jump('team')"><i class="bi bi-people"></i> Team</button>
                    <template v-if="slackMore">
                      <button ref="sTimeline" type="button" :class="{ on: section === 'timeline' }" @click="jump('timeline')">Timeline Ext.</button>
                      <button ref="sReminder" type="button" :class="{ on: section === 'reminder' }" @click="jump('reminder')">Reminder</button>
                      <button ref="sDownload" type="button" :class="{ on: section === 'download' }" @click="jump('download')">Download Report</button>
                    </template>
                    <button v-else ref="sMore" type="button" @click="jump('timeline')">+ 3 more</button>
                  </div>
                  <div v-if="section === 'fix'" class="sub-tabs">
                    <span class="on"><i class="bi bi-laptop"></i> All Assets</span>
                    <span><i class="bi bi-list-ul"></i> All Vulnerabilities</span>
                    <span><i class="bi bi-share"></i> Common Vulnerabilities</span>
                  </div>
                  <div v-else-if="section === 'register'" class="sub-tabs">
                    <span class="on"><i class="bi bi-card-list"></i> Register</span>
                    <span><i class="bi bi-file-code"></i> Script</span>
                  </div>
                  <div v-else-if="section === 'timeline'" class="sub-tabs">
                    <span :class="{ on: screen === 'timeline' }"><i class="bi bi-calendar2-plus"></i> Extension Requests</span>
                    <button ref="sHist" type="button" :class="{ on: screen === 'timeline-history' }" @click="jump('timeline-history')"><i class="bi bi-clock-history"></i> History</button>
                  </div>
                  <div v-else-if="section === 'team'" class="sub-tabs">
                    <span :class="{ on: screen === 'team' }"><i class="bi bi-graph-up"></i> Team Performance</span>
                    <button ref="sAdd" type="button" :class="{ on: screen === 'add' || screen === 'add-picked' || screen === 'user-updated' }" @click="jump('add')"><i class="bi bi-person-plus"></i> Add User</button>
                    <button ref="sDelete" type="button" :class="{ on: screen === 'delete' }" @click="jump('delete')"><i class="bi bi-trash"></i> Delete User</button>
                    <button ref="sRole" type="button" :class="{ on: screen === 'role' || screen === 'role-picked' }" @click="jump('role')">Update User Role</button>
                    <button ref="sExternal" type="button" :class="{ on: screen === 'external' }" @click="jump('external')">External User</button>
                  </div>
                  <div class="screen-slot">
                    <div v-if="screen === 'home'" class="bot-screen dash">
                      <p class="bot-kicker"><i class="bi bi-bar-chart-fill"></i> VaptFix Admin Dashboard</p>
                      <p class="bot-note">XYZ internal pentest · 10 January 2025 · overall rating Concerning.</p>
                      <div class="dash-3">
                        <div class="dash-card">
                          <span class="lbl">Total assets</span>
                          <b class="big">200</b>
                          <small>Internal hosts</small>
                        </div>
                        <div class="dash-card risk">
                          <span class="ring">High</span>
                          <div>
                            <span class="lbl">Vulnerability level</span>
                            <b class="big">High</b>
                            <small>Concerning</small>
                          </div>
                        </div>
                        <div class="dash-card">
                          <span class="lbl">Distinct findings</span>
                          <b class="big">48</b>
                          <small>XYZ Dec 2025 report</small>
                        </div>
                      </div>
                      <div class="dash-2">
                        <div class="dash-card">
                          <span class="title">Vulnerabilities by severity</span>
                          <div class="vbars">
                            <div><strong>18</strong><i class="crit"></i><small>Critical</small></div>
                            <div><strong>11</strong><i class="high"></i><small>High</small></div>
                            <div><strong>18</strong><i class="med"></i><small>Medium</small></div>
                            <div><strong>4</strong><i class="low"></i><small>Low</small></div>
                          </div>
                        </div>
                        <div class="dash-card">
                          <span class="title">Findings still open <em>48 / 48</em></span>
                          <ul class="fix-list">
                            <li><i class="dot crit"></i> Critical <b>18</b></li>
                            <li><i class="dot high"></i> High <b>11</b></li>
                            <li><i class="dot med"></i> Medium <b>18</b></li>
                            <li><i class="dot low"></i> Low <b>4</b></li>
                          </ul>
                        </div>
                      </div>
                      <div class="dash-card">
                        <span class="lbl"><i class="bi bi-clock"></i> Mitigation timeline</span>
                        <div class="time-pills">
                          <span><i class="dot crit"></i> Critical — 2 days</span>
                          <span><i class="dot high"></i> High — 3 days</span>
                          <span><i class="dot med"></i> Medium — 4 days</span>
                          <span><i class="dot low"></i> Low — 5 days</span>
                        </div>
                      </div>
                      <div class="support-row">
                        <div><b>48</b><small>Open findings</small></div>
                        <div><b>18</b><small>Critical</small></div>
                        <div><b>0</b><small>Closed</small></div>
                      </div>
                    </div>

                    <div v-else-if="screen === 'assets'" class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-laptop"></i> All Assets</p>
                      <p class="bot-note">Hosts from the XYZ internal scope. 200 assets — showing 1–3.</p>
                      <div class="chip-row">
                        <span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span>
                      </div>
                      <div class="chip-row">
                        <span class="on">All 200</span><span>Open 48</span><span>Closed 0</span><span>Critical hosts 12</span>
                      </div>
                      <div v-for="row in assetRows" :key="'s-' + row.host" class="line">
                        <div>
                          <b><i class="bi bi-laptop"></i> {{ row.host }}</b>
                          <small>{{ row.detail }}</small>
                        </div>
                        <div class="line-actions">
                          <button v-if="row.host === assetRows[0].host" ref="sView" type="button" class="view" @click="jump('asset')">View</button>
                          <span v-else class="view">View</span>
                          <span class="mini hold">Hold</span>
                          <span class="mini delete">Delete</span>
                        </div>
                      </div>
                      <button ref="sPager" type="button" class="view next" @click="jump('assets-hold')">Next page</button>
                    </div>

                    <div v-else-if="screen === 'assets-hold'" class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-laptop"></i> All Assets</p>
                      <p class="bot-note">Showing a later slice of the 200 XYZ hosts.</p>
                      <div class="line">
                        <div>
                          <b><i class="bi bi-laptop"></i> 172.28.1.121</b>
                          <small>8 findings · 2 critical · 1 high · 2 medium · 3 low</small>
                        </div>
                        <button ref="sViewHold" type="button" class="view" @click="jump('asset')">View</button>
                      </div>
                      <div class="line">
                        <div>
                          <b><i class="bi bi-laptop"></i> 172.28.1.1</b>
                          <small>1 finding · low</small>
                        </div>
                        <span class="view">View</span>
                      </div>
                      <p class="bot-kicker hold-title"><i class="bi bi-lock"></i> Assets on hold</p>
                      <div class="line">
                        <div>
                          <b><i class="bi bi-laptop"></i> 172.28.1.250</b>
                          <small>12 findings · 3 medium · 9 low</small>
                        </div>
                        <span class="mini hold">Unhold</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'asset'" class="bot-screen">
                      <p class="back">← Back to All Assets</p>
                      <p class="bot-kicker"><i class="bi bi-laptop"></i> 172.28.1.84</p>
                      <p class="bot-note">9 findings on this host · 3 critical, 1 high, 1 medium, 4 low.</p>
                      <div class="line">
                        <div>
                          <b><i class="dot crit"></i> VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)</b>
                          <small>Critical · Open</small>
                        </div>
                        <button ref="sFinding" type="button" class="view" @click="jump('manual')">View</button>
                      </div>
                      <div class="line">
                        <div>
                          <b><i class="dot high"></i> SNMP Agent Default Community Name (public)</b>
                          <small>High · Open</small>
                        </div>
                        <span class="view">View</span>
                      </div>
                      <div class="line">
                        <div>
                          <b><i class="dot med"></i> SMB Signing Not Required</b>
                          <small>Medium · Open</small>
                        </div>
                        <span class="view">View</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'manual'" class="bot-screen">
                      <div class="fix-tabs">
                        <span class="on">Manual Fix</span>
                        <button ref="sAuto" type="button" @click="jump('auto')">Automation Fix</button>
                      </div>
                      <p class="bot-kicker">VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)</p>
                      <p class="meta-line"><span>Severity</span><b>Critical</b></p>
                      <p class="meta-line"><span>Status</span><b>Open</b></p>
                      <p class="meta-line"><span>Host</span><b>172.28.1.84</b></p>
                      <p class="step-title">Mitigation</p>
                      <p class="step-copy">Apply the fixed ESXi builds in VMSA-2025-0004, such as 7.0 U3s and 8.0 U2d or U3d, or later.</p>
                      <p class="step-copy">Until patched, limit admin access inside guest VMs and restrict untrusted workloads.</p>
                    </div>

                    <div v-else-if="screen === 'auto'" class="bot-screen">
                      <div class="fix-tabs">
                        <span>Manual Fix</span>
                        <span class="on">Automation Fix</span>
                      </div>
                      <p class="bot-kicker">Automated fix: VMware ESXi (VMSA-2025-0004)</p>
                      <p class="bot-note">Read-only — script preview only.</p>
                      <p class="meta-line"><span>Asset</span><b>172.28.1.84</b></p>
                      <p class="meta-line"><span>Severity</span><b>Critical</b></p>
                      <p class="meta-line"><span>OS</span><b>ESXi</b></p>
                      <p class="step-title">What this does</p>
                      <p class="step-copy">Checks that the host is still on a build affected by VMSA-2025-0004 and records the XYZ finding.</p>
                      <p class="step-title">Remediation</p>
                      <p class="cmd">Apply ESXi 7.0 U3s or 8.0 U2d / U3d, or a later fixed build.</p>
                    </div>

                    <div v-else-if="screen === 'register'" class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-card-list"></i> Register</p>
                      <div class="chip-row">
                        <span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span>
                      </div>
                      <div class="chip-row"><span class="on">All 48</span><span>Open 48</span><span>Closed 0</span></div>
                      <div v-for="(row, i) in registerRows" :key="'sr-' + row.host" class="line">
                        <div>
                          <b>{{ i + 1 }}. {{ row.name }}</b>
                          <small>{{ row.host }} · {{ row.status }} · 31/12/2024</small>
                        </div>
                        <span class="view">View</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'team'" class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-graph-up-arrow"></i> Team Performance Monitoring</p>
                      <p class="bot-note">Open counts across the 48 distinct XYZ findings.</p>
                      <div class="team-grid">
                        <div v-for="team in teamCards" :key="'st-' + team.key" class="team-card" :class="'team-card--' + team.key">
                          <b>{{ team.name }}</b>
                          <div class="perf-stats">
                            <span><em>Closure</em><strong>0%</strong></span>
                            <span><em>Closed</em><strong class="ok">0</strong></span>
                            <span><em>Open</em><strong class="bad">{{ team.open }}</strong></span>
                          </div>
                          <small>C {{ team.crit }} · H {{ team.high }} · M {{ team.med }} · L {{ team.low }}</small>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="screen === 'add'" class="bot-screen">
                      <p class="bot-kicker">Add User</p>
                      <p class="field-label">User</p>
                      <p class="fake-input">Select a user</p>
                      <p class="field-label">Type</p>
                      <p class="fake-input">external</p>
                      <p class="check on">Patch Management</p>
                      <p class="check">Configuration Management</p>
                      <p class="check">Network Security</p>
                      <p class="check">Architectural Flaws</p>
                      <p class="bot-note">Assets — 0 selected of 200</p>
                      <p class="check">172.28.1.84 [Critical]</p>
                      <button ref="sPick" type="button" class="btn primary next" @click="jump('add-picked')">Add User</button>
                    </div>

                    <div v-else-if="screen === 'add-picked'" class="bot-screen">
                      <p class="bot-kicker">Add User</p>
                      <p class="field-label">User</p>
                      <p class="fake-input">Abc Demo</p>
                      <p class="field-label">Type</p>
                      <p class="fake-input">internal</p>
                      <p class="mail-line">abc.demo@example.com</p>
                      <p class="check on">Patch Management</p>
                      <p class="check">Configuration Management</p>
                      <p class="check">Network Security</p>
                      <p class="check">Architectural Flaws</p>
                      <p class="bot-note">Assets — 0 selected of 200</p>
                      <p class="check">172.28.1.84 [Critical]</p>
                      <button ref="sAdded" type="button" class="btn primary next" @click="jump('user-updated')">Add User</button>
                    </div>

                    <div v-else-if="screen === 'user-updated'" class="bot-screen">
                      <p class="good-title"><i class="bi bi-check-circle-fill"></i> User updated in VaptFix</p>
                      <p class="bot-note">Demo member added with team access.</p>
                      <p class="meta-line"><span>Name</span><b>Abc Demo</b></p>
                      <p class="meta-line"><span>Email</span><b class="mail">abc.demo@example.com</b></p>
                      <p class="meta-line"><span>Type</span><b>internal</b></p>
                      <p class="meta-line"><span>Team(s)</span><b>Patch Management, Configuration Management</b></p>
                      <span class="view next">Done</span>
                    </div>

                    <div v-else-if="screen === 'delete'" class="bot-screen">
                      <p class="bot-kicker">Delete User</p>
                      <p class="field-label">User</p>
                      <p class="fake-input">Select a user</p>
                      <p class="field-label">Action</p>
                      <p class="fake-input">Deactivate (reversible)</p>
                      <div class="line-actions">
                        <span class="view">Cancel</span>
                        <span class="btn ok">Confirm</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'role'" class="bot-screen">
                      <p class="bot-kicker">Update User Role</p>
                      <p class="field-label">Select user</p>
                      <button ref="sRoleUser" type="button" class="fake-input pick" @click="jump('role-picked')">Pick an option</button>
                      <div class="line-actions">
                        <span class="view">Cancel</span>
                        <span class="btn ok">Update</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'role-picked'" class="bot-screen">
                      <p class="bot-kicker">Update User Role</p>
                      <p class="field-label">Select user</p>
                      <p class="fake-input">Abc Demo</p>
                      <p class="field-label">Update team role(s)</p>
                      <p class="check on">Patch Management</p>
                      <p class="check">Configuration Management</p>
                      <div class="line-actions">
                        <span class="view">Cancel</span>
                        <span class="btn ok">Update</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'external'" class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-globe2"></i> External Users</p>
                      <p class="bot-note">All external users — name, email, assigned assets, and status.</p>
                      <p class="bot-note">Total external users: 0</p>
                      <p class="empty">No external users found.</p>
                    </div>

                    <div v-else-if="screen === 'timeline'" class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-hourglass-split"></i> Timeline Extension Requests</p>
                      <p class="bot-note">Pending team requests to extend mitigation deadlines.</p>
                      <p class="bot-note">Pending requests: 1</p>
                      <div class="line">
                        <div>
                          <b>SMB Signing Not Required</b>
                          <small>Medium · Configuration Management · +2 days · Signing still not required</small>
                        </div>
                      </div>
                      <div class="line-actions">
                        <span class="btn ok"><i class="bi bi-check-lg"></i> Approve</span>
                        <span class="btn danger"><i class="bi bi-x-lg"></i> Reject</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'timeline-history'" class="bot-screen">
                      <p class="good-title"><i class="bi bi-check-circle-fill"></i> Approve timeline extension</p>
                      <p class="bot-note">Total requests: 1</p>
                      <div class="line">
                        <div>
                          <b>SMB Signing Not Required</b>
                          <small>+2 days</small>
                          <small class="good"><i class="bi bi-check-circle-fill"></i> Approved</small>
                        </div>
                        <span class="view">View</span>
                      </div>
                    </div>

                    <div v-else-if="screen === 'reminder'" class="bot-screen">
                      <div class="chip-row filters">
                        <span class="on"><i class="dot high"></i> Overdue</span>
                        <span><i class="dot med"></i> Due Today</span>
                        <span><i class="dot week"></i> This Week</span>
                        <span><i class="dot low"></i> Next Week</span>
                        <button ref="sSupport" type="button" @click="jump('reminder-support')">Support</button>
                      </div>
                      <p class="bot-kicker">Overdue</p>
                      <p class="bot-note">Deadline urgency from the mitigation timeline.</p>
                      <p class="empty">Nothing in this bucket right now.</p>
                      <p class="foot">Showing 0–0 of 0 results</p>
                    </div>

                    <div v-else-if="screen === 'reminder-support'" class="bot-screen">
                      <div class="chip-row filters">
                        <span><i class="dot high"></i> Overdue</span>
                        <span><i class="dot med"></i> Due Today</span>
                        <span><i class="dot week"></i> This Week</span>
                        <span><i class="dot low"></i> Next Week</span>
                        <span class="on">Support</span>
                      </div>
                      <p class="bot-kicker"><i class="bi bi-life-preserver"></i> Support Requests</p>
                      <div class="chip-row"><span class="on">All 1</span><span>Open 1</span><span>Closed 0</span></div>
                      <div class="chip-row"><span class="on">All Teams</span><span>Patch Management</span><span>Configuration Management</span></div>
                      <div class="line">
                        <div>
                          <b>SNMP Agent Default Community Name (public)</b>
                          <small>161.126.61.101 · High · Open · Configuration Management</small>
                          <small>By abc.demo@example.com · 10 January 2025</small>
                        </div>
                        <button ref="sSupView" type="button" class="view" @click="jump('reminder-detail')">View</button>
                      </div>
                      <p class="foot">Showing 1–1 of 1 results</p>
                    </div>

                    <div v-else-if="screen === 'reminder-detail'" class="bot-screen">
                      <p class="bot-kicker">Support request detail</p>
                      <p class="meta-line"><span>Status</span><b>Open</b></p>
                      <p class="meta-line"><span>Vulnerability</span><b>SNMP Agent Default Community Name (public)</b></p>
                      <p class="meta-line"><span>Asset</span><b>161.126.61.101</b></p>
                      <p class="meta-line"><span>Criticality</span><b>High</b></p>
                      <p class="meta-line"><span>Team</span><b>Configuration Management</b></p>
                      <p class="meta-line"><span>Requested by</span><b class="mail">abc.demo@example.com</b></p>
                      <p class="meta-line"><span>Raised</span><b>10 January 2025</b></p>
                      <p class="meta-line"><span>Description</span><b>Demo support note.</b></p>
                      <button ref="sReply" type="button" class="btn ok next" @click="jump('reply')">Reply</button>
                    </div>

                    <div v-else-if="screen === 'reply'" class="bot-screen">
                      <p class="bot-kicker">Send update</p>
                      <p class="bot-note">Replying to SNMP Agent Default Community Name (public).</p>
                      <p class="field-label">Your response</p>
                      <p class="fake-input">Demo note</p>
                      <p class="check on">Customer visible</p>
                      <p class="check">Internal note</p>
                      <span class="btn ok next">Send update</span>
                    </div>

                    <div v-else class="bot-screen">
                      <p class="bot-kicker"><i class="bi bi-file-earmark-text"></i> Download Report</p>
                      <p class="meta-line"><span>Report</span><b>XYZ Internal VAPT Report Dec 2025</b></p>
                      <p class="meta-line"><span>Generated on</span><b>10 January 2025</b></p>
                      <p class="meta-line"><span>Total assets</span><b>200</b></p>
                      <p class="meta-line"><span>Risk</span><b>High · Concerning</b></p>
                      <p class="findings">
                        Findings: 48 distinct —
                        <i class="dot crit"></i> 18 Critical
                        <i class="dot high"></i> 11 High
                        <i class="dot med"></i> 18 Medium
                        <i class="dot low"></i> 4 Low
                      </p>
                      <p class="cmd">xyz-internal-vapt-dec-2025.html</p>
                      <span class="btn primary next"><i class="bi bi-download"></i> Download</span>
                    </div>
                  </div>
                </template>
                <template v-else>
                <div class="bot-tabs">
                  <span :class="{ on: section === 'home' }">Home</span>
                  <button ref="fixTabBtn" type="button" :class="{ on: section === 'fix' }" @click="jump('assets')">Fix</button>
                  <button ref="registerTab" type="button" :class="{ on: section === 'register' }" @click="jump('register')">Register</button>
                  <button ref="automationsTab" type="button" :class="{ on: section === 'automations' }" @click="jump('automations')">Automations</button>
                  <button ref="teamTab" type="button" :class="{ on: section === 'team' }" @click="jump('team')">Team</button>
                  <button ref="timelineTab" type="button" :class="{ on: section === 'timeline' }" @click="jump('timeline')">Timeline Ext.</button>
                  <button ref="reminderTab" type="button" :class="{ on: section === 'reminder' }" @click="jump('reminder')">Reminder</button>
                  <button ref="downloadTab" type="button" :class="{ on: section === 'download' }" @click="jump('download')">Download Report</button>
                </div>

                <div v-if="section === 'fix'" class="sub-tabs">
                  <span class="on"><i class="bi bi-laptop"></i> All Assets</span>
                  <span>All Vulnerabilities</span>
                  <span>Common Vulnerabilities</span>
                </div>
                <div v-else-if="section === 'register'" class="sub-tabs">
                  <span :class="{ on: screen === 'register' }">Register</span>
                  <button ref="scriptTab" type="button" :class="{ on: screen === 'script' }" @click="jump('script')">Script</button>
                </div>
                <div v-else-if="section === 'automations'" class="sub-tabs">
                  <span class="on">Full</span>
                  <span>Partial</span>
                </div>
                <div v-else-if="section === 'team'" class="sub-tabs">
                  <span :class="{ on: screen === 'team' }">Team Performance</span>
                  <button ref="addUserTab" type="button" :class="{ on: screen === 'add' }" @click="jump('add')">Add User</button>
                  <button ref="deleteUserTab" type="button" :class="{ on: screen === 'delete' || screen === 'delete-detail' }" @click="jump('delete')">Delete User</button>
                  <button ref="roleTab" type="button" :class="{ on: screen === 'role' || screen === 'role-detail' }" @click="jump('role')">Update User Role</button>
                  <button ref="externalTab" type="button" :class="{ on: screen === 'external' }" @click="jump('external')">External User</button>
                </div>

                <div class="screen-slot">
                  <div v-if="screen === 'home'" class="bot-screen dash">
                    <p class="bot-kicker"><i class="bi bi-bar-chart-fill"></i> VaptFix Admin Dashboard</p>
                    <p class="bot-note">XYZ internal pentest · 10 January 2025 · overall rating Concerning.</p>
                    <div class="dash-3">
                      <div class="dash-card">
                        <span class="lbl"><i class="bi bi-building"></i> Total assets</span>
                        <b class="big">200</b>
                        <small>Internal hosts</small>
                      </div>
                      <div class="dash-card risk">
                        <span class="ring">High</span>
                        <div>
                          <span class="lbl"><i class="bi bi-exclamation-triangle-fill warn"></i> Vulnerability level</span>
                          <b class="big">High</b>
                          <small>Overall rating · Concerning</small>
                        </div>
                      </div>
                      <div class="dash-card">
                        <span class="lbl"><i class="bi bi-file-earmark-text"></i> Distinct findings</span>
                        <b class="big">48</b>
                        <small>XYZ Dec 2025 report</small>
                      </div>
                    </div>
                    <div class="dash-2">
                      <div class="dash-card">
                        <span class="title">Vulnerabilities by severity</span>
                        <div class="vbars">
                          <div><strong>18</strong><i class="crit"></i><small>Critical</small></div>
                          <div><strong>11</strong><i class="high"></i><small>High</small></div>
                          <div><strong>18</strong><i class="med"></i><small>Medium</small></div>
                          <div><strong>4</strong><i class="low"></i><small>Low</small></div>
                        </div>
                      </div>
                      <div class="dash-card">
                        <span class="title">Finding instances <em>952</em></span>
                        <ul class="fix-list">
                          <li><i class="dot crit"></i> Critical <b>24</b></li>
                          <li><i class="dot high"></i> High <b>32</b></li>
                          <li><i class="dot med"></i> Medium <b>338</b></li>
                          <li><i class="dot low"></i> Low <b>558</b></li>
                        </ul>
                      </div>
                    </div>
                    <div class="dash-card">
                      <span class="lbl"><i class="bi bi-clock"></i> Mitigation timeline</span>
                      <div class="time-pills">
                        <span><i class="dot crit"></i> Critical — 2 days</span>
                        <span><i class="dot high"></i> High — 3 days</span>
                        <span><i class="dot med"></i> Medium — 4 days</span>
                        <span><i class="dot low"></i> Low — 5 days</span>
                      </div>
                    </div>
                    <div class="support-row">
                      <div><b>48</b><small>Open findings</small></div>
                      <div><b>18</b><small>Critical</small></div>
                      <div><b>0</b><small>Closed</small></div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'assets'" class="bot-screen">
                    <p class="bot-kicker">All Assets</p>
                    <p class="bot-note">Hosts from the XYZ internal scope. Tap View to see a finding.</p>
                    <div class="chip-row">
                      <span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span>
                    </div>
                    <div class="chip-row">
                      <span class="on">All 200</span><span>Critical hosts 12</span>
                    </div>
                    <div v-for="row in assetRows" :key="row.host" class="line">
                      <div>
                        <b><i class="bi bi-laptop"></i> {{ row.host }}</b>
                        <small>{{ row.detail }}</small>
                      </div>
                      <div class="line-actions">
                        <button v-if="row.host === assetRows[0].host" ref="viewAsset" type="button" class="view" @click="jump('asset')">View ›</button>
                        <span v-else class="view">View ›</span>
                        <span class="mini hold">Hold</span>
                        <span class="mini delete">Delete</span>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'asset'" class="bot-screen">
                    <p class="back">← Back to All Assets</p>
                    <p class="bot-kicker"><i class="bi bi-laptop"></i> 172.28.1.84</p>
                    <p class="bot-note">9 findings · 3 critical, 1 high, 1 medium, 4 low.</p>
                    <div class="line">
                      <div>
                        <b>VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)</b>
                        <small><i class="dot crit"></i> Critical · Open</small>
                      </div>
                      <button ref="viewFinding" type="button" class="view" @click="jump('manual')">View ›</button>
                    </div>
                  </div>

                  <div v-else-if="screen === 'manual'" class="bot-screen">
                    <p class="back">← Back to 172.28.1.84</p>
                    <p class="bot-kicker">VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)</p>
                    <p class="meta-line"><span>Asset</span> 172.28.1.84</p>
                    <p class="meta-line"><span>Severity</span> <i class="dot crit"></i> Critical</p>
                    <p class="meta-line"><span>Status</span> Open</p>
                    <div class="fix-tabs">
                      <span class="on">Manual</span>
                      <button ref="autoTab" type="button" @click="jump('auto')">Automation Fix</button>
                    </div>
                    <p class="step">XYZ internal report · ESXi host</p>
                    <p class="step-title">Mitigation</p>
                    <p class="step-copy">Apply the fixed ESXi builds in VMSA-2025-0004, such as 7.0 U3s and 8.0 U2d or U3d, or later.</p>
                    <p class="step-copy">Until patched, limit admin access inside guest VMs and restrict untrusted workloads.</p>
                  </div>

                  <div v-else-if="screen === 'auto'" class="bot-screen">
                    <p class="back">← Back to 172.28.1.84</p>
                    <p class="bot-kicker">VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)</p>
                    <p class="meta-line"><span>Asset</span> 172.28.1.84</p>
                    <p class="meta-line"><span>Severity</span> Critical</p>
                    <p class="meta-line"><span>Status</span> Open</p>
                    <div class="fix-tabs">
                      <span>Manual</span>
                      <span class="on">Automation Fix</span>
                    </div>
                    <div class="kv">
                      <p><span>OS</span> windows</p>
                      <p><span>Language</span> python</p>
                      <p><span>Automation</span> Yes</p>
                    </div>
                    <p class="step-title">What this does</p>
                    <p class="step-copy">Records that the ESXi host is still on a build affected by VMSA-2025-0004.</p>
                    <p class="step-title">Remediation</p>
                    <p class="cmd">Apply ESXi 7.0 U3s or 8.0 U2d / U3d, or a later fixed build.</p>
                  </div>

                  <div v-else-if="screen === 'register'" class="bot-screen">
                    <p class="bot-kicker">Register</p>
                    <p class="bot-note">48 distinct findings in the XYZ internal report.</p>
                    <div class="chip-row">
                      <span class="on">All</span><span>Critical</span><span>High</span><span>Medium</span><span>Low</span>
                    </div>
                    <div class="chip-row"><span class="on">All 48</span><span>Critical 18</span><span>High 11</span><span>Medium 18</span><span>Low 4</span></div>
                    <div v-for="row in registerRows" :key="row.name + row.host" class="line">
                      <div>
                        <b>{{ row.name }}</b>
                        <small>{{ row.host }} · {{ row.status }}</small>
                      </div>
                      <span class="view">View ›</span>
                    </div>
                  </div>

                  <div v-else-if="screen === 'script'" class="bot-screen">
                    <p class="bot-kicker">Script</p>
                    <p class="bot-note">Findings from the XYZ internal report that have a fix path.</p>
                    <div v-for="row in scriptRows" :key="row.name" class="line">
                      <div>
                        <b>{{ row.name }}</b>
                        <small>{{ row.host }} · {{ row.coverage }} · {{ row.team }}</small>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'automations'" class="bot-screen">
                    <p class="bot-kicker">Fully automated</p>
                    <p class="bot-note">Patch and configuration fixes called out in the XYZ report.</p>
                    <div class="chip-row"><span class="on">All 48</span><span>Critical 18</span><span>High 11</span></div>
                    <div v-for="row in scriptRows" :key="'auto-' + row.name" class="line">
                      <div>
                        <b>{{ row.name }}</b>
                        <small>{{ row.host }} · {{ row.team }} · {{ row.coverage }}</small>
                      </div>
                      <span class="view">View ›</span>
                    </div>
                  </div>

                  <div v-else-if="screen === 'team'" class="bot-screen">
                    <p class="bot-kicker"><i class="bi bi-graph-up-arrow"></i> Team Performance Monitoring</p>
                    <p class="bot-note">Open counts across the 48 distinct XYZ findings.</p>
                    <div class="team-grid">
                      <div v-for="team in teamCards" :key="team.name" class="team-card" :class="'team-card--' + team.key">
                        <b>{{ team.name }}</b>
                        <small>{{ team.focus }}</small>
                        <div class="perf-stats">
                          <span><em>Closure</em><strong>0%</strong></span>
                          <span><em>Closed</em><strong class="ok">{{ team.closed }}</strong></span>
                          <span><em>Open</em><strong class="bad">{{ team.open }}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-else-if="screen === 'add'" class="bot-screen">
                    <p class="bot-kicker">Add User</p>
                    <p class="bot-note">Add a demo member and grant access to one team.</p>
                    <p class="field-label">User type</p>
                    <p class="fake-input">External</p>
                    <p class="field-label">Name</p>
                    <p class="fake-input">Abc Demo</p>
                    <p class="field-label">Email</p>
                    <p class="fake-input">abc.demo@example.com</p>
                    <p class="check on">Patch Management</p>
                    <p class="check">Configuration Management</p>
                    <span class="btn primary next"><i class="bi bi-person-plus"></i> Add User</span>
                  </div>

                  <div v-else-if="screen === 'delete'" class="bot-screen">
                    <p class="bot-kicker">Delete User</p>
                    <p class="bot-note">Deactivate or remove a member from the XYZ engagement.</p>
                    <div class="line">
                      <div>
                        <b>Abc Demo</b>
                        <small>abc.demo@example.com · Patch Management</small>
                      </div>
                      <button ref="viewUser" type="button" class="view" @click="jump('delete-detail')">View ›</button>
                    </div>
                  </div>

                  <div v-else-if="screen === 'delete-detail'" class="bot-screen">
                    <p class="back">← Back to Delete User</p>
                    <p class="bot-kicker">Abc Demo</p>
                    <p class="meta-line"><span>Email</span><b class="mail">abc.demo@example.com</b></p>
                    <p class="meta-line"><span>Type</span><b>external</b></p>
                    <p class="meta-line"><span>Team(s)</span><b>Patch Management</b></p>
                    <div class="line-actions">
                      <span class="btn ghost"><i class="bi bi-slash-circle"></i> Deactivate</span>
                      <span class="btn danger"><i class="bi bi-trash"></i> Delete Permanently</span>
                    </div>
                  </div>

                  <div v-else-if="screen === 'role'" class="bot-screen">
                    <p class="bot-kicker"><i class="bi bi-person-gear"></i> Update User Role</p>
                    <p class="bot-note">Remove a member's access to one of their assigned teams.</p>
                    <div class="line">
                      <div>
                        <b>Abc Demo</b>
                        <small><b class="mail">abc.demo@example.com</b> · Patch Management, Configuration Management</small>
                      </div>
                      <button ref="viewRole" type="button" class="view" @click="jump('role-detail')">View ›</button>
                    </div>
                    <p class="foot">Showing 1–1 of 1</p>
                  </div>

                  <div v-else-if="screen === 'role-detail'" class="bot-screen">
                    <p class="back">← Back to Update User Role</p>
                    <p class="bot-kicker">Abc Demo</p>
                    <p class="mail-line">abc.demo@example.com</p>
                    <p class="step-copy">Tap a team to remove this member from it.</p>
                    <div class="remove-grid">
                      <span class="btn danger"><i class="bi bi-x-lg"></i> Remove from Patch Management</span>
                      <span class="btn danger"><i class="bi bi-x-lg"></i> Remove from Configuration Management</span>
                      <span class="btn danger"><i class="bi bi-x-lg"></i> Remove from Network Security</span>
                      <span class="btn danger"><i class="bi bi-x-lg"></i> Remove from Architectural Flaws</span>
                    </div>
                  </div>

                  <div v-else-if="screen === 'external'" class="bot-screen">
                    <p class="bot-kicker"><i class="bi bi-globe2"></i> External Users</p>
                    <p class="bot-note">Total external users: 0</p>
                    <p class="empty">No external users found.</p>
                  </div>

                  <div v-else-if="screen === 'timeline'" class="bot-screen">
                    <div class="sub-tabs">
                      <span class="on"><i class="bi bi-calendar2-plus"></i> Extension Requests</span>
                      <button ref="historyTab" type="button" @click="jump('timeline-history')"><i class="bi bi-clock-history"></i> History</button>
                    </div>
                    <p class="bot-kicker"><i class="bi bi-hourglass-split"></i> Timeline Extension Requests</p>
                    <p class="bot-note">Pending team requests to extend mitigation deadlines: 1</p>
                    <div class="line">
                      <div>
                        <b>SMB Signing Not Required</b>
                        <small>Team: Configuration Management · +2 days · Reason: Signing still not required</small>
                      </div>
                      <div class="line-actions">
                        <span class="btn ok"><i class="bi bi-check-lg"></i> Approve</span>
                        <span class="btn danger"><i class="bi bi-x-lg"></i> Reject</span>
                      </div>
                    </div>
                    <p class="foot">Showing 1–1 of 1</p>
                  </div>

                  <div v-else-if="screen === 'timeline-history'" class="bot-screen">
                    <div class="sub-tabs">
                      <span><i class="bi bi-calendar2-plus"></i> Extension Requests</span>
                      <span class="on"><i class="bi bi-clock-history"></i> History</span>
                    </div>
                    <p class="good-title"><i class="bi bi-check-circle-fill"></i> Approve Timeline Extension</p>
                    <div class="line-actions">
                      <span class="btn ok"><i class="bi bi-check-lg"></i> Approve</span>
                      <span class="btn danger"><i class="bi bi-x-lg"></i> Reject</span>
                    </div>
                    <p class="bot-note">Total requests: 1</p>
                    <div class="line">
                      <div>
                        <b>SMB Signing Not Required</b>
                        <small>+2 days</small>
                        <small class="good"><i class="bi bi-check-circle-fill"></i> Approved</small>
                      </div>
                      <button ref="viewHistory" type="button" class="view" @click="jump('timeline-detail')">View</button>
                    </div>
                    <p class="foot">Showing 1–1 of 1</p>
                  </div>

                  <div v-else-if="screen === 'timeline-detail'" class="bot-screen">
                    <p class="back">← Back to History</p>
                    <p class="bot-kicker">SMB Signing Not Required</p>
                    <p class="meta-line"><span>Status</span><b class="good"><i class="bi bi-check-circle-fill"></i> Approved</b></p>
                    <p class="meta-line"><span>Team</span><b>Configuration Management</b></p>
                    <p class="meta-line"><span>Requested By</span><b class="mail">abc.demo@example.com</b></p>
                    <p class="meta-line"><span>Asset</span><b>172.28.1.121</b></p>
                    <p class="meta-line"><span>Severity</span><b>medium</b></p>
                    <p class="meta-line"><span>Extension</span><b>+2 days</b></p>
                    <p class="meta-line"><span>Requested At</span><b>10 January 2025</b></p>
                    <p class="meta-line"><span>Reason</span><b>Signing still not required</b></p>
                  </div>

                  <div v-else-if="screen === 'reminder'" class="bot-screen">
                    <div class="chip-row filters">
                      <span><i class="dot high"></i> Overdue</span>
                      <span><i class="dot med"></i> Due Today</span>
                      <span><i class="dot week"></i> This Week</span>
                      <span><i class="dot low"></i> Next Week</span>
                      <span class="on">Support</span>
                    </div>
                    <p class="bot-kicker"><i class="bi bi-life-preserver"></i> Support Requests</p>
                    <p class="bot-note">Sample queue for open and closed support notes.</p>
                    <div class="chip-row"><span class="on">All 1</span><span>Open 1</span><span>Closed 0</span></div>
                    <div class="chip-row soft">
                      <span class="on">All Teams</span><span>Patch Mgmt</span><span>Config Mgmt</span><span>Network Sec.</span><span>Arch. Flaws</span>
                    </div>
                    <div class="line">
                      <div>
                        <b>TLS Version 1.0 Protocol Detection</b>
                        <small>172.28.1.250 · Team: Configuration Management</small>
                        <small>By: <b class="mail">xyz.demo@example.com</b> · <i class="dot med"></i> Open</small>
                      </div>
                      <button ref="viewReminder" type="button" class="view" @click="jump('reminder-detail')">View ›</button>
                    </div>
                    <p class="foot">Showing 1–1 of 1</p>
                  </div>

                  <div v-else-if="screen === 'reminder-detail'" class="bot-screen">
                    <p class="back">← Back to Support Requests</p>
                    <p class="bot-kicker">TLS Version 1.0 Protocol Detection</p>
                    <p class="meta-line"><span>Status</span><b>Open</b></p>
                    <p class="meta-line"><span>Asset</span><b>172.28.1.250</b></p>
                    <p class="meta-line"><span>Team</span><b>Configuration Management</b></p>
                    <p class="meta-line"><span>Requested By</span><b class="mail">xyz.demo@example.com</b></p>
                    <p class="meta-line"><span>Requested At</span><b>10 January 2025</b></p>
                    <p class="meta-line"><span>Message</span><b>TLS 1.0 is still enabled on this host.</b></p>
                  </div>

                  <div v-else class="bot-screen">
                    <p class="bot-kicker"><i class="bi bi-file-earmark-text"></i> Download Report</p>
                    <p class="meta-line"><span>Report</span><b>XYZ Internal VAPT Report Dec 2025</b></p>
                    <p class="meta-line"><span>Generated On</span><b>10 January 2025</b></p>
                    <p class="meta-line"><span>Total Assets</span><b>200</b></p>
                    <p class="meta-line"><span>Risk Score</span><b>High · Concerning</b></p>
                    <p class="findings">
                      Findings: 48 distinct —
                      <i class="dot crit"></i> 18 Critical
                      <i class="dot high"></i> 11 High
                      <i class="dot med"></i> 18 Medium
                      <i class="dot low"></i> 4 Low
                    </p>
                    <span class="btn primary next"><i class="bi bi-download"></i> Download HTML Report</span>
                  </div>
                </div>
                </template>
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
      cursorY: 22,
      clicking: false,
      timer: null,
      assetRows: [
        { host: '172.28.1.84', detail: '9 findings · 3 critical · 1 high' },
        { host: '161.126.61.102', detail: '14 findings · 3 critical · 5 medium' },
        { host: '161.126.61.101', detail: '16 findings · 2 critical · 6 medium' },
      ],
      registerRows: [
        { name: 'VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)', host: '172.28.1.84', status: 'Open' },
        { name: 'PaperCut MF Path Traversal (CVE-2023-39143)', host: '161.126.61.102', status: 'Open' },
        { name: 'SNMP Agent Default Community Name (public)', host: '161.126.61.101', status: 'Open' },
      ],
      scriptRows: [
        { name: 'VMware ESXi Multiple Vulnerabilities (VMSA-2025-0004)', host: '172.28.1.84', coverage: 'Full', team: 'Patch' },
        { name: 'SMB Signing Not Required', host: '172.28.1.121', coverage: 'Full', team: 'Configuration' },
        { name: 'TLS Version 1.0 Protocol Detection', host: '172.28.1.250', coverage: 'Full', team: 'Network' },
      ],
      teamCards: [
        { key: 'network', name: 'Network Security Team', focus: 'Infrastructure focus', closed: 0, open: 15, crit: 4, high: 2, med: 6, low: 3 },
        { key: 'patch', name: 'Patch Management Team', focus: 'Lifecycle management', closed: 0, open: 20, crit: 10, high: 6, med: 4, low: 0 },
        { key: 'config', name: 'Configuration Management Team', focus: 'System configuration', closed: 0, open: 16, crit: 4, high: 3, med: 8, low: 1 },
        { key: 'arch', name: 'Architectural Flaws Team', focus: 'Design and architecture', closed: 0, open: 0, crit: 0, high: 0, med: 0, low: 0 },
      ],
    };
  },
  computed: {
    cursorStyle() {
      return { left: `${this.cursorX}%`, top: `${this.cursorY}%` };
    },
    slackMore() {
      return ['timeline', 'reminder', 'download'].includes(this.section);
    },
    section() {
      if (this.screen === 'home') return 'home';
      if (this.screen === 'register' || this.screen === 'script') return 'register';
      if (this.screen === 'automations') return 'automations';
      if (['team', 'add', 'add-picked', 'user-updated', 'delete', 'delete-detail', 'role', 'role-picked', 'role-detail', 'external'].includes(this.screen)) return 'team';
      if (this.screen === 'reply') return 'reminder';
      if (String(this.screen).startsWith('timeline')) return 'timeline';
      if (String(this.screen).startsWith('reminder')) return 'reminder';
      if (this.screen === 'download') return 'download';
      return 'fix';
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
      await this.delay(480);
      if (this.paused) return false;
      this.clicking = true;
      setTimeout(() => { this.clicking = false; }, 200);
      await this.delay(240);
      if (this.paused) return false;
      this.screen = next;
      await this.delay(dwell);
      return !this.paused;
    },
    async play() {
      this.screen = 'home';
      await this.delay(1500);
      if (this.platform === 'slack') return this.playSlack();
      if (!(await this.clickRef('fixTabBtn', 'assets', 1300))) return;
      if (!(await this.clickRef('viewAsset', 'asset', 1200))) return;
      if (!(await this.clickRef('viewFinding', 'manual', 1300))) return;
      if (!(await this.clickRef('autoTab', 'auto', 1300))) return;
      if (!(await this.clickRef('registerTab', 'register', 1300))) return;
      if (!(await this.clickRef('scriptTab', 'script', 1300))) return;
      if (!(await this.clickRef('automationsTab', 'automations', 1300))) return;
      if (!(await this.clickRef('teamTab', 'team', 1300))) return;
      if (!(await this.clickRef('addUserTab', 'add', 1300))) return;
      if (!(await this.clickRef('deleteUserTab', 'delete', 1200))) return;
      if (!(await this.clickRef('viewUser', 'delete-detail', 1100))) return;
      if (!(await this.clickRef('roleTab', 'role', 1100))) return;
      if (!(await this.clickRef('viewRole', 'role-detail', 1100))) return;
      if (!(await this.clickRef('externalTab', 'external', 1100))) return;
      if (!(await this.clickRef('timelineTab', 'timeline', 1200))) return;
      if (!(await this.clickRef('historyTab', 'timeline-history', 1100))) return;
      if (!(await this.clickRef('viewHistory', 'timeline-detail', 1100))) return;
      if (!(await this.clickRef('reminderTab', 'reminder', 1200))) return;
      if (!(await this.clickRef('viewReminder', 'reminder-detail', 1100))) return;
      if (!(await this.clickRef('downloadTab', 'download', 1400))) return;
      if (!this.paused) this.$emit('finished');
    },
    async playSlack() {
      if (!(await this.clickRef('sFix', 'assets', 1200))) return;
      if (!(await this.clickRef('sPager', 'assets-hold', 1200))) return;
      if (!(await this.clickRef('sViewHold', 'asset', 1200))) return;
      if (!(await this.clickRef('sFinding', 'manual', 1300))) return;
      if (!(await this.clickRef('sAuto', 'auto', 1200))) return;
      if (!(await this.clickRef('sRegister', 'register', 1200))) return;
      if (!(await this.clickRef('sTeam', 'team', 1200))) return;
      if (!(await this.clickRef('sAdd', 'add', 1100))) return;
      if (!(await this.clickRef('sPick', 'add-picked', 1000))) return;
      if (!(await this.clickRef('sAdded', 'user-updated', 1100))) return;
      if (!(await this.clickRef('sDelete', 'delete', 1100))) return;
      if (!(await this.clickRef('sRole', 'role', 1000))) return;
      if (!(await this.clickRef('sRoleUser', 'role-picked', 1100))) return;
      if (!(await this.clickRef('sExternal', 'external', 1000))) return;
      if (!(await this.clickRef('sMore', 'timeline', 1200))) return;
      if (!(await this.clickRef('sHist', 'timeline-history', 1100))) return;
      if (!(await this.clickRef('sReminder', 'reminder', 1100))) return;
      if (!(await this.clickRef('sSupport', 'reminder-support', 1100))) return;
      if (!(await this.clickRef('sSupView', 'reminder-detail', 1100))) return;
      if (!(await this.clickRef('sReply', 'reply', 1000))) return;
      if (!(await this.clickRef('sDownload', 'download', 1400))) return;
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
  width: 42px;
  background: #4a154b;
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding-top: 12px;
  flex-shrink: 0;
}
.slack-mark {
  width: 24px; height: 24px; border-radius: 7px; background: #fff; color: #4a154b;
  font-weight: 800; display: grid; place-items: center; font-size: 13px;
}
.chat-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.chat-top {
  height: 34px; display: flex; align-items: center; gap: 8px; padding: 0 12px;
  color: #fff; flex-shrink: 0; font-size: 13px;
}
.chat-top--teams { background: #5b5fc7; }
.chat-top--slack { background: #fff; color: #1d1c1d; border-bottom: 1px solid #e8e8e8; }
.chat-top-sub { opacity: 0.8; font-size: 11px; }
.teams-logo { width: 16px; height: 16px; display: block; flex-shrink: 0; }
.chat-scroll { flex: 1; min-height: 0; overflow: hidden; padding: 8px 10px 10px; }
.msg { display: flex; gap: 8px; height: 100%; }
.msg-av {
  width: 24px; height: 24px; border-radius: 5px; background: #5b5fc7; color: #fff;
  font-weight: 800; display: grid; place-items: center; flex-shrink: 0; font-size: 12px;
}
.chat-frame--slack .msg-av { background: #4a154b; }
.msg-body { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.msg-meta { font-size: 11px; color: #5b5b66; display: flex; gap: 8px; margin-bottom: 4px; }
.msg-meta b { color: #1a1a1a; }
.bot-card {
  background: #fff; border: 1px solid #e6e8f0; border-radius: 12px; padding: 6px 8px;
  flex: 1; min-height: 0; overflow: hidden; display: flex; flex-direction: column;
}
.bot-tabs, .sub-tabs, .chip-row, .fix-tabs, .time-pills, .line-actions {
  display: flex; gap: 4px; flex-wrap: wrap; align-items: center;
}
.bot-tabs { flex-wrap: nowrap; gap: 3px; }
.bot-tabs span, .bot-tabs button, .sub-tabs span, .sub-tabs button, .fix-tabs span, .fix-tabs button, .chip-row span, .chip-row button {
  border: 1px solid #e5e7eb; background: #fff; color: #3c3c46; border-radius: 8px;
  font-size: 11px; font-weight: 650; padding: 4px 8px; line-height: 1.2; white-space: nowrap;
}
.bot-tabs span, .bot-tabs button { font-size: 9px; padding: 3px 5px; letter-spacing: -0.01em; }
.bot-tabs .on, .sub-tabs .on, .fix-tabs .on, .chip-row .on {
  background: #5b5fc7; border-color: #5b5fc7; color: #fff;
}
.chat-frame--slack .bot-tabs .on,
.chat-frame--slack .sub-tabs .on,
.chat-frame--slack .fix-tabs .on,
.chat-frame--slack .chip-row .on {
  background: #1a8f3c; border-color: #1a8f3c;
}
.sub-tabs, .chip-row { margin-top: 4px; }
.screen-slot { flex: 1; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }
.bot-screen { flex: 1; min-height: 0; overflow: hidden; margin-top: 6px; }
.bot-kicker { margin: 0; font-size: 13px; font-weight: 800; color: #1a1a1a; display: flex; align-items: center; gap: 6px; }
.bot-note { margin: 3px 0 8px; font-size: 11px; color: #64748b; }
.back {
  display: inline-flex; align-items: center; margin: 0 0 8px; padding: 4px 8px;
  border: 1px solid #e5e7eb; border-radius: 8px; background: #fff; color: #374151;
  font-size: 11px; font-weight: 650;
}
.dash-3, .dash-2, .team-grid { display: grid; gap: 6px; margin-bottom: 6px; }
.dash-3 { grid-template-columns: 1fr 1.15fr 1fr; }
.dash-2, .team-grid { grid-template-columns: 1fr 1fr; }
.dash-card, .team-card {
  border: 1px solid #e8edf3; border-radius: 8px; padding: 6px 8px; background: #fafbfc;
}
.risk { display: flex; gap: 8px; align-items: center; }
.ring {
  width: 36px; height: 36px; border-radius: 50%; border: 4px solid #f59e0b;
  display: grid; place-items: center; font-size: 8px; font-weight: 800; flex-shrink: 0;
}
.lbl, .title, .field-label { display: block; font-size: 9px; font-weight: 700; color: #64748b; }
.big { display: block; font-size: 16px; color: #111827; line-height: 1.15; }
.big em { font-style: normal; font-size: 11px; color: #94a3b8; font-weight: 600; }
.dash-card small, .support-row small, .line small, .team-card small { display: block; color: #94a3b8; font-size: 9px; }
.warn { color: #d97706; }
.bolt { color: #5b5fc7; }
.vbars { display: flex; align-items: flex-end; gap: 10px; height: 36px; margin-top: 2px; }
.vbars div { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 1px; font-size: 9px; height: 100%; }
.vbars strong { line-height: 1; }
.vbars i { display: block; width: 10px; border-radius: 3px 3px 0 0; }
.vbars .crit { height: 18px; background: #b42318; }
.vbars .high { height: 12px; background: #dc2626; }
.vbars .med { height: 18px; background: #f59e0b; }
.vbars .low { height: 6px; background: #10b981; }
.fix-list { list-style: none; margin: 4px 0 0; padding: 0; font-size: 10px; color: #334155; }
.fix-list li, .perf-stats { display: flex; gap: 4px; align-items: center; }
.dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; }
.dot.crit { background: #b42318; }
.dot.high { background: #dc2626; }
.dot.med { background: #f59e0b; }
.dot.low { background: #10b981; }
.dot.week { background: #eab308; }
.time-pills { margin-top: 4px; }
.time-pills span {
  font-size: 9px; color: #334155; background: #fff; border: 1px solid #e5e7eb;
  border-radius: 99px; padding: 2px 6px;
}
.support-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-top: 6px; }
.support-row div { background: #f8fafc; border-radius: 8px; padding: 4px 6px; }
.support-row b { font-size: 14px; color: #5b5fc7; }
.line {
  display: flex; justify-content: space-between; align-items: center; gap: 10px;
  border-top: 1px solid #eef2f6; padding: 8px 0;
}
.line b { display: block; font-size: 12px; color: #111827; }
.line small { margin-top: 2px; }
.mini, .view, .fix-tabs button, .sub-tabs button {
  border-radius: 8px; font-size: 11px; font-weight: 700; padding: 4px 8px;
}
.view {
  background: #fff; color: #374151; border: 1px solid #d1d5db; white-space: nowrap; flex-shrink: 0;
}
.fix-tabs .on, .sub-tabs .on, .sub-tabs button.on { background: #5b5fc7; border-color: #5b5fc7; color: #fff; }
.chat-frame--slack .fix-tabs .on,
.chat-frame--slack .sub-tabs .on,
.chat-frame--slack .sub-tabs button.on { background: #1a8f3c; border-color: #1a8f3c; }
.chat-frame--slack .view { background: #1a8f3c; color: #fff; border-color: #1a8f3c; }
.chat-frame--slack .mini.hold { background: #fff7ed; color: #c2410c; border-color: #fdba74; }
.mini.hold { background: #fff; color: #1d4ed8; border: 1px solid #bfdbfe; }
.mini.delete { background: #dc2626; color: #fff; border: 1px solid #dc2626; }
.btn {
  display: inline-flex; align-items: center; gap: 4px; border-radius: 8px;
  font-size: 11px; font-weight: 700; padding: 5px 8px; border: 1px solid transparent; line-height: 1.2;
}
.btn.danger { background: #dc2626; color: #fff; }
.btn.ok { background: #16a34a; color: #fff; }
.btn.ghost { background: #fff; color: #b42318; border-color: #f1b4b4; }
.btn.primary { background: #5b5fc7; color: #fff; }
.chat-frame--slack .btn.primary { background: #1a8f3c; }
.hold-title { margin-top: 8px; }
.btn.next, .view.next { margin-top: 8px; }
.remove-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.meta-line {
  display: grid; grid-template-columns: 108px 1fr; gap: 8px; align-items: baseline;
  margin: 0; padding: 3px 0; font-size: 12px; color: #111827;
}
.meta-line span { color: #6b7280; font-weight: 650; }
.meta-line b { font-weight: 650; }
.mail, .mail-line { color: #4f52c8; font-weight: 650; }
.mail-line { margin: 2px 0 8px; font-size: 12px; }
.good, .good-title { color: #15803d; }
.good-title { margin: 8px 0; font-size: 13px; font-weight: 800; display: flex; align-items: center; gap: 6px; }
.foot { margin: 6px 0 0; font-size: 10px; color: #94a3b8; }
.empty { margin: 8px 0; font-size: 12px; color: #64748b; }
.findings { margin: 8px 0; font-size: 11px; color: #334155; display: flex; flex-wrap: wrap; gap: 4px; align-items: center; }
.step, .step-copy, .step-title, .cmd, .warn, .kv p { margin: 2px 0; font-size: 11px; color: #334155; }
.kv span { color: #94a3b8; margin-right: 6px; }
.step, .step-title { font-weight: 700; }
.cmd { font-family: ui-monospace, monospace; background: #f8fafc; border-radius: 6px; padding: 4px 6px; }
.warn { color: #b45309; }
.team-card b { font-size: 11px; }
.team-card--network { border-top: 3px solid #3b82f6; }
.team-card--network b { color: #3b82f6; }
.team-card--patch { border-top: 3px solid #5b21b6; }
.team-card--patch b { color: #5b21b6; }
.team-card--config { border-top: 3px solid #06b6d4; }
.team-card--config b { color: #06b6d4; }
.team-card--arch { border-top: 3px solid #c026d3; }
.team-card--arch b { color: #c026d3; }
.perf-stats { justify-content: space-between; margin-top: 4px; font-size: 9px; color: #64748b; }
.perf-stats em { display: block; font-style: normal; }
.perf-stats .ok { color: #059669; }
.perf-stats .bad { color: #dc2626; }
.fake-input.pick { width: 100%; text-align: left; background: #fff; cursor: pointer; }
.fake-input, .check {
  border: 1px solid #e5e7eb; border-radius: 6px; padding: 3px 6px; font-size: 10px; margin: 2px 0 4px;
}
.check.on { border-color: #5b5fc7; color: #312e81; }
.mock-cursor {
  position: absolute; width: 16px; height: 16px; margin-left: -8px; margin-top: -8px;
  pointer-events: none; z-index: 5; transition: left 0.4s ease, top 0.4s ease;
}
.cursor-dot {
  width: 10px; height: 10px; border-radius: 50%; background: #111; border: 2px solid #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
}
.cursor-ring { position: absolute; inset: -4px; border-radius: 50%; border: 2px solid transparent; }
.mock-cursor.clicking .cursor-ring { border-color: rgba(91, 95, 199, 0.7); }
</style>
