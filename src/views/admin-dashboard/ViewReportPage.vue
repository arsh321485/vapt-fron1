<template>
  <main>
    <section>
      <div class="container-fluid">
        <div class="row">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1">
            <DashboardMenu />
          </div>

          <div class="col-11 vr-content">

            <!-- Sticky Top Header — Dark Banner -->
            <div class="report-sticky-header">
              <!-- Back button -->
              <button class="btn-back" @click="$router.back()">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="vertical-align:-2px;margin-right:5px;"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
                Back
              </button>

              <!-- Centre: badge + title + subtitle -->
              <div class="rsh-main">
                <div class="rsh-info">
                  <div class="rsh-risk-badge" v-if="hasOverdueFindings">
                    <svg width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="vertical-align:-1px;"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                    High Risk — Action Required
                  </div>
                  <div class="rsh-title">NFH Vulnerability Mitigation Portal</div>
                  <div class="rsh-subtitle">
                    Internal Network
                    <span class="rsh-dot">·</span>
                    January 2026 Nessus Assessment
                    <span class="rsh-dot">·</span>
                    {{ uniqueHostsCount }} hosts
                    <span class="rsh-dot">·</span>
                    {{ totalVulnerabilities }} actionable findings
                  </div>
                </div>

                <!-- Right: severity counts -->
                <div class="rsh-counts">
                  <div class="rsh-count-item">
                    <div class="rsh-count-num rsh-critical">{{ vulnStats.critical }}</div>
                    <div class="rsh-count-lbl">Critical</div>
                  </div>
                  <div class="rsh-count-item">
                    <div class="rsh-count-num rsh-high">{{ vulnStats.high }}</div>
                    <div class="rsh-count-lbl">High</div>
                  </div>
                  <div class="rsh-count-item">
                    <div class="rsh-count-num rsh-medium">{{ vulnStats.medium }}</div>
                    <div class="rsh-count-lbl">Medium</div>
                  </div>
                  <div class="rsh-count-item">
                    <div class="rsh-count-num rsh-low">{{ vulnStats.low }}</div>
                    <div class="rsh-count-lbl">Low</div>
                  </div>
                </div>
              </div>

              <!-- Export button -->
              <button class="btn-export" @click="downloadReport">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="vertical-align:-2px;margin-right:7px;"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"/></svg>
                Export PDF
              </button>
            </div>

            <!-- Report Body -->
            <div class="report-body" ref="reportWrap">

              <!-- ═══ TABS NAVIGATION ═══ -->
              <div class="tabs-nav-wrap">
                <div class="tabs-nav">
                  <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    :class="['tab-btn', { 'tab-btn-active': isTabActive(tab.id) }]"
                    @click="toggleTab(tab.id)"
                  >
                    <span class="tab-icon-wrap">{{ tab.icon }}</span>
                    <span class="tab-label-text">{{ tab.label }}</span>
                    <span v-if="isTabActive(tab.id)" class="tab-active-dot"></span>
                  </button>
                </div>
                <div class="tabs-multi-hint" v-if="activeTabs.length > 1">
                  <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="vertical-align:-1px;margin-right:4px;"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
                  {{ activeTabs.length }} sections active
                </div>
              </div>

              <!-- ═══════════════════════════════════════════════════════
                   TAB 1 — Executive Summary
              ═══════════════════════════════════════════════════════ -->
              <div v-show="isTabActive('executive-summary')" class="tab-section-wrap">

                <!-- Alert Banner -->
                <div class="alert-overdue-banner" v-if="hasOverdueFindings">
                  <div class="alert-banner-icon-wrap">
                    <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div class="alert-banner-body">
                    <div class="alert-banner-title">All critical, high, and medium findings are past their remediation deadline</div>
                    <div class="alert-banner-desc">The January 2026 scan identified findings that required immediate action. Critical items were due within 48 hours of discovery. Escalation and resource prioritisation is required immediately.</div>
                  </div>
                </div>

                <!-- SLA Stats Row -->
                <div class="sla-stats-row mb-section">
                  <div class="sla-stat-card">
                    <div class="sla-stat-number sla-num-critical">{{ vulnStats.critical }}</div>
                    <div class="sla-stat-label">Critical</div>
                    <div class="sla-stat-badge sla-badge-overdue">
                      <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                      Overdue
                    </div>
                  </div>
                  <div class="sla-stat-card">
                    <div class="sla-stat-number sla-num-high">{{ vulnStats.high }}</div>
                    <div class="sla-stat-label">High</div>
                    <div class="sla-stat-badge sla-badge-overdue">
                      <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                      Overdue
                    </div>
                  </div>
                  <div class="sla-stat-card">
                    <div class="sla-stat-number sla-num-medium">{{ vulnStats.medium }}</div>
                    <div class="sla-stat-label">Medium</div>
                    <div class="sla-stat-badge sla-badge-overdue">
                      <svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/></svg>
                      Overdue
                    </div>
                  </div>
                  <div class="sla-stat-card">
                    <div class="sla-stat-number sla-num-low">{{ vulnStats.low }}</div>
                    <div class="sla-stat-label">Low</div>
                    <div class="sla-stat-badge sla-badge-inwindow">Due Apr 2026</div>
                  </div>
                  <div class="sla-stat-card">
                    <div class="sla-stat-number sla-num-hosts">{{ uniqueHostsCount }}</div>
                    <div class="sla-stat-label">Hosts scanned</div>
                    <div class="sla-stat-badge sla-badge-neutral">Internal only</div>
                  </div>
                </div>

                <!-- Section Label -->
                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Executive Summary
                </div>
                <div class="bento-grid-12 mb-section">

                  <!-- Left: Total Vulns -->
                  <div class="bento-card bento-col-4 bento-total-card">
                    <div class="bento-total-eyebrow">Total Vulnerabilities Discovered</div>
                    <div class="bento-total-number">{{ totalVulnerabilities }}</div>
                    <div class="bento-total-trend">
                      <span class="trend-icon trend-up">
                        <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7"/></svg>
                      </span>
                      <span class="trend-text">vs last month</span>
                    </div>
                    <div class="bento-total-chart-area">
                      <canvas id="rTotalVulnsChart" style="max-height:130px;"></canvas>
                    </div>
                  </div>

                  <!-- Right: Severity Breakdown -->
                  <div class="bento-card bento-col-8 bento-severity-card">
                    <div class="bento-severity-header">
                      <div class="bento-severity-title">Severity Breakdown</div>
                      <div class="sev-legend">
                        <span class="sev-legend-dot" style="background:#7f1d1d;"></span><span>Critical</span>
                        <span class="sev-legend-dot" style="background:#dc2626;"></span><span>High</span>
                        <span class="sev-legend-dot" style="background:#d97706;"></span><span>Medium</span>
                        <span class="sev-legend-dot" style="background:#16a34a;"></span><span>Low</span>
                      </div>
                    </div>
                    <div class="severity-sub-grid">
                      <div class="severity-sub-card sev-sub-critical">
                        <div class="sev-sub-dot" style="background:#7f1d1d;"></div>
                        <div class="sev-sub-label">Critical</div>
                        <div class="sev-sub-number">{{ vulnStats.critical }}</div>
                        <div class="sev-sub-caption">Immediate action</div>
                      </div>
                      <div class="severity-sub-card sev-sub-high">
                        <div class="sev-sub-dot" style="background:#dc2626;"></div>
                        <div class="sev-sub-label">High</div>
                        <div class="sev-sub-number">{{ vulnStats.high }}</div>
                        <div class="sev-sub-caption">Urgent remediation</div>
                      </div>
                      <div class="severity-sub-card sev-sub-medium">
                        <div class="sev-sub-dot" style="background:#d97706;"></div>
                        <div class="sev-sub-label">Medium</div>
                        <div class="sev-sub-number">{{ vulnStats.medium }}</div>
                        <div class="sev-sub-caption">Scheduled patching</div>
                      </div>
                      <div class="severity-sub-card sev-sub-low">
                        <div class="sev-sub-dot" style="background:#16a34a;"></div>
                        <div class="sev-sub-label">Low</div>
                        <div class="sev-sub-number">{{ vulnStats.low }}</div>
                        <div class="sev-sub-caption">Monitor &amp; log</div>
                      </div>
                    </div>
                    <canvas id="rCriticalityStatusChart" style="display:none;"></canvas>
                  </div>

                </div>

              </div><!-- /executive-summary -->

              <!-- ═══════════════════════════════════════════════════════
                   TAB 2 — Business Risk
              ═══════════════════════════════════════════════════════ -->
              <div v-show="isTabActive('business-risk')" class="tab-section-wrap">
                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Business Risk — If We Do Not Act
                </div>
                <div class="business-risk-grid mb-section">
                  <div class="risk-card risk-critical">
                    <div class="risk-card-top">
                      <span class="risk-icon-wrap risk-icon-critical">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                      </span>
                      <span class="risk-card-title">Full server takeover — 3 servers at risk</span>
                    </div>
                    <p class="risk-card-desc">Three servers have vulnerabilities that allow any attacker on the network to take complete control with a single automated tool. No password required. An attacker could deploy ransomware, exfiltrate all data, or use the servers to attack other internal systems.</p>
                  </div>
                  <div class="risk-card risk-high">
                    <div class="risk-card-top">
                      <span class="risk-icon-wrap risk-icon-high">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      </span>
                      <span class="risk-card-title">Database and application data exposure</span>
                    </div>
                    <p class="risk-card-desc">The MongoDB database server is leaking memory fragments to anyone who can reach it on the network. Application servers with outdated frameworks are vulnerable to code injection. Business and customer data may be at risk of unauthorised access.</p>
                  </div>
                  <div class="risk-card risk-medium">
                    <div class="risk-card-top">
                      <span class="risk-icon-wrap risk-icon-medium">
                        <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                      </span>
                      <span class="risk-card-title">Encrypted connections cannot be trusted</span>
                    </div>
                    <p class="risk-card-desc">60 SSL/TLS certificate issues across 30 servers mean encrypted traffic cannot be verified. Deprecated TLS 1.0/1.1 allows protocol downgrade attacks. Missing security headers expose users to clickjacking and session theft.</p>
                  </div>
                </div>
              </div><!-- /business-risk -->

              <!-- ═══════════════════════════════════════════════════════
                   TAB 3 — Remediation Schedule & SLA
              ═══════════════════════════════════════════════════════ -->
              <div v-show="isTabActive('remediation-schedule')" class="tab-section-wrap">
                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Remediation Schedule &amp; SLA Status
                </div>
                <div class="remediation-table-card mb-section">
                  <div class="remediation-table-scroll">
                    <table class="remediation-table">
                      <thead>
                        <tr>
                          <th>Severity</th>
                          <th>Findings</th>
                          <th>What Needs to Happen</th>
                          <th>Original Deadline</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in remediationSchedule" :key="row.severity">
                          <td>
                            <span :class="['rem-sev-badge', 'rem-sev-' + row.severity.toLowerCase()]">{{ row.severity }}</span>
                          </td>
                          <td class="rem-findings-cell">{{ vulnStats[row.sevKey] }} {{ row.findingsSuffix }}</td>
                          <td class="rem-action-cell">{{ row.action }}</td>
                          <td :class="['rem-deadline-cell', row.status === 'Overdue' ? 'rem-deadline-overdue' : '']">{{ row.deadline }}</td>
                          <td>
                            <span :class="['rem-status-badge', row.status === 'Overdue' ? 'rem-status-overdue' : 'rem-status-inwindow']">{{ row.status }}</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Resource and Approval Asks
                </div>
                <div class="resource-asks-grid mb-section">
                  <div class="resource-ask-card">
                    <div class="resource-ask-header">
                      <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24" style="margin-right:7px;flex-shrink:0;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      This week
                    </div>
                    <ul class="resource-ask-list">
                      <li>Approve emergency firewall changes for 3 critical hosts</li>
                      <li>Assign App Server Admin to Struts 6.4.0 upgrade</li>
                      <li>Network team to VLAN-isolate 192.168.254.13</li>
                    </ul>
                  </div>
                  <div class="resource-ask-card">
                    <div class="resource-ask-header">
                      <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24" style="margin-right:7px;flex-shrink:0;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      30 days
                    </div>
                    <ul class="resource-ask-list">
                      <li>Budget for enterprise certificate management tool</li>
                      <li>Dedicate resource for ~30-host certificate replacement</li>
                      <li>CAB approval for all production service patches</li>
                    </ul>
                  </div>
                  <div class="resource-ask-card">
                    <div class="resource-ask-header">
                      <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24" style="margin-right:7px;flex-shrink:0;"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      Ongoing
                    </div>
                    <ul class="resource-ask-list">
                      <li>Weekly progress review against finding IDs</li>
                      <li>Schedule post-remediation re-scan</li>
                      <li>Establish bi-weekly continuous scanning schedule</li>
                    </ul>
                  </div>
                </div>
              </div><!-- /remediation-schedule -->

              <!-- ═══════════════════════════════════════════════════════
                   TAB 4 — Distribution & Velocity
              ═══════════════════════════════════════════════════════ -->
              <div v-show="isTabActive('distribution-velocity')" class="tab-section-wrap">
                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Distribution &amp; Velocity
                </div>
                <div class="bento-grid-12 mb-section">

                  <!-- Left: Team Distribution Donut -->
                  <div class="bento-card bento-col-6 bento-chart-card">
                    <div class="bento-chart-title">Distribution by Team</div>
                    <div class="chart-donut-wrap">
                      <canvas id="rTeamDistributionChart" style="max-height:200px;max-width:200px;"></canvas>
                      <div class="team-dist-legend">
                        <div v-for="cfg in teamCardConfigs" :key="cfg.name" class="dist-legend-row">
                          <span class="dist-legend-dot" :style="{ background: cfg.color }"></span>
                          <span class="dist-legend-name">{{ cfg.name }}</span>
                          <span class="dist-legend-count">{{ (teamDetail[cfg.name] || {}).total ?? '—' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right: Remediation Velocity -->
                  <div class="bento-card bento-col-6 bento-velocity-card">
                    <div class="bento-chart-title">Remediation Velocity</div>
                    <p class="velocity-sub">Closure rate by severity tier across all teams</p>

                    <div class="velocity-item">
                      <div class="velocity-row-top">
                        <span class="velocity-label"><span class="velocity-dot" style="background:#7f1d1d;"></span>Critical</span>
                        <span class="velocity-pct velocity-pct-critical">{{ teamClosureRate('Architectural Flaws') }}%</span>
                      </div>
                      <div class="velocity-bar-track">
                        <div class="velocity-bar-fill velocity-fill-critical" :style="{ width: teamClosureRate('Architectural Flaws') + '%' }"></div>
                      </div>
                    </div>

                    <div class="velocity-item">
                      <div class="velocity-row-top">
                        <span class="velocity-label"><span class="velocity-dot" style="background:#dc2626;"></span>High</span>
                        <span class="velocity-pct velocity-pct-high">{{ teamClosureRate('Network Security') }}%</span>
                      </div>
                      <div class="velocity-bar-track">
                        <div class="velocity-bar-fill velocity-fill-high" :style="{ width: teamClosureRate('Network Security') + '%' }"></div>
                      </div>
                    </div>

                    <div class="velocity-item">
                      <div class="velocity-row-top">
                        <span class="velocity-label"><span class="velocity-dot" style="background:#241447;"></span>Overall</span>
                        <span class="velocity-pct velocity-pct-overall">
                          {{
                            totalVulnerabilities
                              ? Math.round(
                                  (teamCardConfigs.reduce((s, c) => { const t = teamDetail[c.name]; return s + (t ? t.closed : 0); }, 0) /
                                    teamCardConfigs.reduce((s, c) => { const t = teamDetail[c.name]; return s + (t ? t.total : 0); }, 0)) * 100
                                )
                              : 0
                          }}%
                        </span>
                      </div>
                      <div class="velocity-bar-track">
                        <div
                          class="velocity-bar-fill velocity-fill-overall"
                          :style="{
                            width: (totalVulnerabilities
                              ? Math.round(
                                  (teamCardConfigs.reduce((s, c) => { const t = teamDetail[c.name]; return s + (t ? t.closed : 0); }, 0) /
                                    teamCardConfigs.reduce((s, c) => { const t = teamDetail[c.name]; return s + (t ? t.total : 0); }, 0)) * 100
                                )
                              : 0) + '%'
                          }"
                        ></div>
                      </div>
                    </div>

                    <div class="velocity-note">
                      <svg width="13" height="13" fill="none" stroke="#7c6fa0" stroke-width="2" viewBox="0 0 24 24" style="margin-right:5px;vertical-align:-2px;"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" d="M12 8v4m0 4h.01"/></svg>
                      Based on current audit cycle data
                    </div>
                  </div>

                </div>
              </div><!-- /distribution-velocity -->

              <!-- ═══════════════════════════════════════════════════════
                   TAB 3 — Team Performance
              ═══════════════════════════════════════════════════════ -->
              <div v-show="isTabActive('team-performance')" class="tab-section-wrap">
                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Team Performance
                </div>
                <div class="team-perf-grid mb-section">
                  <div v-for="cfg in teamCardConfigs" :key="cfg.name" class="team-perf-card">
                    <div class="tpc-top-row">
                      <div class="tpc-icon" :style="{ background: cfg.gradient }">{{ cfg.icon }}</div>
                      <span class="closure-badge" :class="teamClosureRate(cfg.name) >= 60 ? 'closure-good' : 'closure-warn'">
                        {{ teamClosureRate(cfg.name) }}% closed
                      </span>
                    </div>
                    <div class="tpc-team-name">{{ cfg.name }}</div>
                    <div class="tpc-counts-row">
                      <div class="tpc-count-block">
                        <div class="tpc-count-num tpc-open">{{ (teamDetail[cfg.name] || {}).open ?? '—' }}</div>
                        <div class="tpc-count-lbl">Open</div>
                      </div>
                      <div class="tpc-count-divider"></div>
                      <div class="tpc-count-block">
                        <div class="tpc-count-num tpc-closed">{{ (teamDetail[cfg.name] || {}).closed ?? '—' }}</div>
                        <div class="tpc-count-lbl">Closed</div>
                      </div>
                      <div class="tpc-count-divider"></div>
                      <div class="tpc-count-block">
                        <div class="tpc-count-num" :style="{ color: cfg.color }">{{ (teamDetail[cfg.name] || {}).total ?? '—' }}</div>
                        <div class="tpc-count-lbl">Total</div>
                      </div>
                    </div>
                    <div class="tpc-progress-track">
                      <div class="tpc-progress-fill" :style="{ width: teamClosureRate(cfg.name) + '%', background: cfg.color }"></div>
                    </div>
                    <div class="tpc-sev-row">
                      <span class="tpc-sev-chip tpc-sev-critical">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Critical ?? 0 }} Crit</span>
                      <span class="tpc-sev-chip tpc-sev-high">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).High ?? 0 }} High</span>
                      <span class="tpc-sev-chip tpc-sev-medium">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Medium ?? 0 }} Med</span>
                      <span class="tpc-sev-chip tpc-sev-low">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Low ?? 0 }} Low</span>
                    </div>
                  </div>
                </div>
              </div><!-- /team-performance -->

              <!-- ═══════════════════════════════════════════════════════
                   TAB 4 — Detailed Vulnerability Log
              ═══════════════════════════════════════════════════════ -->
              <div v-show="isTabActive('vulnerability-log')" class="tab-section-wrap">
                <div class="section-label">
                  <span class="section-label-pip"></span>
                  Detailed Vulnerability Log
                </div>

                <!-- Filters Row -->
                <div class="filter-card mb-filter">
                  <div class="filter-left">
                    <svg width="15" height="15" fill="none" stroke="#7c6fa0" stroke-width="2" viewBox="0 0 24 24" style="margin-right:6px;vertical-align:-2px;flex-shrink:0;"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4h18M7 10h10M11 16h2"/></svg>
                    <span class="filter-label-text">Filters</span>
                  </div>
                  <div class="filter-controls">
                    <div class="filter-group">
                      <label class="filter-group-label">Team</label>
                      <select v-model="teamFilter" class="filter-select">
                        <option value="all">All Teams</option>
                        <option value="network">Network Security</option>
                        <option value="patch">Patch Management</option>
                        <option value="configuration">Configuration Management</option>
                        <option value="architectural">Architectural Flaws</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label class="filter-group-label">Severity</label>
                      <select v-model="severityFilter" class="filter-select">
                        <option value="all">All</option>
                        <option value="critical">Critical</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label class="filter-group-label">Status</label>
                      <select v-model="statusFilter" class="filter-select">
                        <option value="all">All</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Table Card -->
                <div class="vuln-table-card">
                  <div class="vuln-table-scroll">
                    <table class="vuln-table">
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th>Vulnerability Name</th>
                          <th>Asset</th>
                          <th>Team</th>
                          <th>Severity</th>
                          <th>Found Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-if="tableLoading">
                          <td colspan="7" class="table-empty-cell">
                            <span class="table-loading-spinner"></span>
                            Loading vulnerabilities…
                          </td>
                        </tr>
                        <tr v-else-if="filteredData.length === 0">
                          <td colspan="7" class="table-empty-cell">No vulnerabilities match the selected filters.</td>
                        </tr>
                        <tr v-for="row in filteredData" :key="row.id" v-else class="vuln-table-row">
                          <td><span class="cell-id">#{{ row.id }}</span></td>
                          <td><span class="cell-vuln-name">{{ row.name }}</span></td>
                          <td><span class="cell-asset">{{ row.asset }}</span></td>
                          <td><span :class="['team-badge', 'team-' + row.team]">{{ row.teamLabel }}</span></td>
                          <td>
                            <span :class="['sev-badge-pill', 'sev-badge-' + row.severity]">
                              {{ row.severity.charAt(0).toUpperCase() + row.severity.slice(1) }}
                            </span>
                          </td>
                          <td class="cell-date">{{ row.found }}</td>
                          <td>
                            <span v-if="row.status === 'open'" class="status-open">
                              <span class="status-dot status-dot-open"></span>Open
                            </span>
                            <span v-else class="status-closed">
                              <span class="status-dot status-dot-closed"></span>Closed
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination footer -->
                  <div class="table-footer">
                    <span class="table-footer-text">
                      Showing <strong>{{ filteredData.length }}</strong> of <strong>{{ tableData.length }}</strong> vulnerabilities
                    </span>
                    <div class="table-footer-badges">
                      <span class="footer-sev-pill footer-critical">{{ vulnStats.critical }} Critical</span>
                      <span class="footer-sev-pill footer-high">{{ vulnStats.high }} High</span>
                      <span class="footer-sev-pill footer-medium">{{ vulnStats.medium }} Medium</span>
                      <span class="footer-sev-pill footer-low">{{ vulnStats.low }} Low</span>
                    </div>
                  </div>
                </div>

              </div><!-- /vulnerability-log -->

            </div><!-- /report-body -->
          </div><!-- /col-11 -->
        </div><!-- /row -->
      </div><!-- /container-fluid -->
    </section>
  </main>
</template>

<script>
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import Chart from 'chart.js/auto';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'ViewReportPage',
  components: { DashboardMenu, DashboardHeader },

  data() {
    return {
      teamFilter: 'all',
      severityFilter: 'all',
      statusFilter: 'all',
      charts: [],
      statsLoading: false,
      vulnStats: { critical: 0, high: 0, medium: 0, low: 0 },
      teamDistribution: [],
      teamDetail: {},
      tableLoading: false,
      tableData: [],
      activeTabs: ['executive-summary'],
      tabs: [
        { id: 'executive-summary',    label: 'Executive Summary',          icon: '📊' },
        { id: 'business-risk',        label: 'Business Risk',              icon: '⚠️' },
        { id: 'remediation-schedule', label: 'Remediation Schedule & SLA', icon: '📅' },
        { id: 'distribution-velocity',label: 'Distribution & Velocity',    icon: '📈' },
        { id: 'team-performance',     label: 'Team Performance',           icon: '👥' },
        { id: 'vulnerability-log',    label: 'Detailed Vulnerability Log', icon: '🔍' },
      ],
      remediationSchedule: [
        {
          severity: 'Critical',
          findingsSuffix: 'findings / 3 hosts',
          action: 'Firewall, patch, or isolate 3 hosts. Exploit log audit before patching.',
          deadline: '18 Jan 2026',
          status: 'Overdue',
          sevKey: 'critical',
        },
        {
          severity: 'High',
          findingsSuffix: 'findings / 4 hosts',
          action: 'Upgrade Apache Struts 6.4.0 on 4 servers. Upgrade MongoDB on 1 server.',
          deadline: '23 Jan 2026',
          status: 'Overdue',
          sevKey: 'high',
        },
        {
          severity: 'Medium',
          findingsSuffix: 'findings / ~30 hosts',
          action: 'SSL certificate replacement project. Disable TLS 1.0/1.1. Security headers. SMB signing.',
          deadline: '16 Feb 2026',
          status: 'Overdue',
          sevKey: 'medium',
        },
        {
          severity: 'Low',
          findingsSuffix: 'findings / 22+ hosts',
          action: 'Firewall rule for ICMP (automated). Weak crypto fix alongside M1.',
          deadline: '16 Apr 2026',
          status: 'In window',
          sevKey: 'low',
        },
      ],
    };
  },

  computed: {
    filteredData() {
      return this.tableData.filter(row =>
        (this.teamFilter === 'all' || row.team === this.teamFilter) &&
        (this.severityFilter === 'all' || row.severity === this.severityFilter) &&
        (this.statusFilter === 'all' || row.status === this.statusFilter)
      );
    },
    totalVulnerabilities() {
      const { critical, high, medium, low } = this.vulnStats;
      return critical + high + medium + low;
    },
    uniqueHostsCount() {
      const assets = new Set(this.tableData.map(row => row.asset).filter(Boolean));
      return assets.size || 0;
    },
    hasOverdueFindings() {
      return this.vulnStats.critical > 0 || this.vulnStats.high > 0 || this.vulnStats.medium > 0;
    },
    teamCardConfigs() {
      return [
        { name: 'Network Security',         color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', icon: '🔗' },
        { name: 'Patch Management',         color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', icon: '🔧' },
        { name: 'Configuration Management', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⚙️' },
        { name: 'Architectural Flaws',      color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)', icon: '🏗️' },
      ];
    },
  },

  async mounted() {
    await Promise.all([this.fetchVulnerabilities(), this.fetchTeamDistribution(), this.fetchTeamDetail(), this.fetchDetailedVulnerabilities()]);
    this.$nextTick(() => {
      this.initCharts();
    });
  },

  beforeUnmount() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  },

  methods: {
    toggleTab(tabId) {
      const idx = this.activeTabs.indexOf(tabId);
      if (idx === -1) {
        this.activeTabs.push(tabId);
      } else {
        if (this.activeTabs.length > 1) {
          this.activeTabs.splice(idx, 1);
        }
      }
    },

    isTabActive(tabId) {
      return this.activeTabs.includes(tabId);
    },

    async fetchDetailedVulnerabilities() {
      this.tableLoading = true;
      const store = useAuthStore();
      const result = await store.fetchDetailedVulnerabilities();
      if (result.status && Array.isArray(result.data?.vulnerabilities)) {
        const teamKeyMap = {
          'Network Security': 'network',
          'Patch Management': 'patch',
          'Configuration Management': 'configuration',
          'Architectural Flaws': 'architectural',
        };
        this.tableData = result.data.vulnerabilities.map((v, i) => ({
          id: i + 1,
          name: v.vulnerability_name,
          asset: v.assets,
          team: teamKeyMap[v.assigned_team] || 'unassigned',
          teamLabel: v.assigned_team || 'Unassigned',
          severity: (v.risk_factor || '').toLowerCase(),
          found: v.found_date ? v.found_date.split('T')[0] : '—',
          status: v.status,
        }));
      }
      this.tableLoading = false;
    },

    teamClosureRate(teamName) {
      const t = this.teamDetail[teamName];
      if (!t || !t.total) return 0;
      return Math.round((t.closed / t.total) * 100);
    },

    async fetchTeamDetail() {
      const store = useAuthStore();
      const result = await store.fetchDistributionByTeamDetail();
      if (result.status && result.data?.teams) {
        this.teamDetail = result.data.teams;
      }
    },

    async fetchTeamDistribution() {
      const store = useAuthStore();
      const result = await store.fetchDistributionByTeam();
      if (result.status && Array.isArray(result.data?.distribution)) {
        this.teamDistribution = result.data.distribution;
      }
    },

    async fetchVulnerabilities() {
      this.statsLoading = true;
      const store = useAuthStore();
      const result = await store.fetchDashboardSummary();
      if (result.status) {
        const v = result.data?.vulnerabilities || {};
        this.vulnStats = {
          critical: v.critical ?? store.vulnerabilities.critical ?? 0,
          high: v.high ?? store.vulnerabilities.high ?? 0,
          medium: v.medium ?? store.vulnerabilities.medium ?? 0,
          low: v.low ?? store.vulnerabilities.low ?? 0,
        };
      }
      this.statsLoading = false;
    },

    initCharts() {
      const { critical, high, medium, low } = this.vulnStats;
      const configs = [
        {
          id: 'rTotalVulnsChart',
          type: 'bar',
          data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{ label: 'Total Discovered', data: [critical, high, medium, low], backgroundColor: ['maroon', 'red', 'goldenrod', '#16a34a'], borderRadius: 6 }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { display: false } }
            }
          }
        },
        {
          id: 'rCriticalityStatusChart',
          type: 'doughnut',
          data: {
            labels: ['Critical Pending', 'High Pending', 'Medium Pending', 'Low Pending'],
            datasets: [{ data: [critical, high, medium, low], backgroundColor: ['maroon', 'red', 'goldenrod', '#16a34a'] }]
          },
          options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 10, font: { size: 11 } } } } }
        },
        {
          id: 'rTeamDistributionChart',
          type: 'doughnut',
          data: (() => {
            const colorMap = {
              'Network Security': '#3b82f6',
              'Patch Management': '#10b981',
              'Configuration Management': '#f97316',
              'Architectural Flaws': '#dc2626',
            };
            const dist = this.teamDistribution.length
              ? this.teamDistribution.filter(d => d.team !== 'Unassigned')
              : [
                  { team: 'Network Security', count: 0 },
                  { team: 'Patch Management', count: 0 },
                  { team: 'Configuration Management', count: 0 },
                  { team: 'Architectural Flaws', count: 0 },
                ];
            return {
              labels: dist.map(d => d.team),
              datasets: [{
                data: dist.map(d => d.count),
                backgroundColor: dist.map(d => colorMap[d.team] || '#6b7280'),
                borderWidth: 0,
              }],
            };
          })(),
          options: { responsive: true, plugins: { legend: { display: false } } }
        },
      ];
      configs.forEach(cfg => {
        const canvas = document.getElementById(cfg.id);
        if (canvas) {
          const chart = new Chart(canvas.getContext('2d'), { type: cfg.type, data: cfg.data, options: cfg.options });
          this.charts.push(chart);
        }
      });
    },

    downloadReport() {
      const reportContent = this.$refs.reportWrap;
      if (!reportContent) return;

      const clone = reportContent.cloneNode(true);
      clone.style.padding = '0';

      const clonedHeader = clone.querySelector('.report-sticky-header');
      if (clonedHeader) clonedHeader.remove();

      const clonedTabsNav = clone.querySelector('.tabs-nav-wrap');
      if (clonedTabsNav) clonedTabsNav.remove();

      // Show all tab sections in export regardless of active state
      clone.querySelectorAll('.tab-section-wrap').forEach(el => {
        el.style.display = 'block';
      });

      const liveCanvases = reportContent.querySelectorAll('canvas');
      const clonedCanvases = clone.querySelectorAll('canvas');
      liveCanvases.forEach((canvas, i) => {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.width = '100%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = '240px';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        if (clonedCanvases[i]) {
          clonedCanvases[i].parentNode.replaceChild(img, clonedCanvases[i]);
        }
      });

      const clonedRows = clone.querySelectorAll('.vuln-table tbody tr');
      clonedRows.forEach(tr => {
        const teamSpan = tr.querySelector('[class*="team-"]');
        if (teamSpan) {
          const teamClass = Array.from(teamSpan.classList).find(c => c.startsWith('team-') && c !== 'team-badge');
          if (teamClass) tr.setAttribute('data-team', teamClass.replace('team-', ''));
        }
        const sevSpan = tr.querySelector('[class*="sev-badge"]');
        if (sevSpan) {
          const sevClass = Array.from(sevSpan.classList).find(c => c.startsWith('sev-') && c !== 'sev-badge');
          if (sevClass) tr.setAttribute('data-severity', sevClass.replace('sev-', ''));
        }
        const statusSpan = tr.querySelector('.status-open, .status-closed');
        if (statusSpan) {
          tr.setAttribute('data-status', statusSpan.classList.contains('status-open') ? 'open' : 'closed');
        }
      });

      const clonedSelects = clone.querySelectorAll('.filter-group select');
      if (clonedSelects[0]) clonedSelects[0].setAttribute('id', 'dl-team-filter');
      if (clonedSelects[1]) clonedSelects[1].setAttribute('id', 'dl-sev-filter');
      if (clonedSelects[2]) clonedSelects[2].setAttribute('id', 'dl-status-filter');

      let cssText = '';
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (rule.type === CSSRule.MEDIA_RULE) return;
            cssText += rule.cssText.replace(/\[data-v-[a-zA-Z0-9]+\]/g, '') + '\n';
          });
        } catch (e) { /* cross-origin sheet, skip */ }
      });

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vulnerability Management Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fc; padding: 0; margin: 0; }
    .report-download-wrapper { width: 100%; max-width: 1400px; margin: 0 auto; padding: 48px 56px; }
    ${cssText}
    .report-sticky-header { display: none !important; }
    .tabs-nav-wrap { display: none !important; }
    .tab-section-wrap { display: block !important; }
    .report-body { padding: 0 !important; margin-top: 0 !important; }
    .vuln-table-scroll { max-height: none !important; overflow-y: visible !important; }
    .table-footer { position: static !important; }
    .page-title-block { padding-top: 0 !important; }
    img { max-height: 240px !important; width: 100% !important; height: auto !important; object-fit: contain !important; }
    .bento-card { overflow: visible !important; }
    .section-label { margin-top: 24px !important; }
    .bento-grid-12 { display: grid !important; grid-template-columns: repeat(12, 1fr) !important; gap: 20px !important; }
    .bento-col-4 { grid-column: span 4 !important; }
    .bento-col-6 { grid-column: span 6 !important; }
    .bento-col-8 { grid-column: span 8 !important; }
    .team-perf-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 16px !important; }
    .severity-sub-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 12px !important; }
    .business-risk-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 16px !important; }
    .resource-asks-grid { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 16px !important; }
    .sla-stats-row { display: grid !important; grid-template-columns: repeat(5, 1fr) !important; gap: 14px !important; }
    .bento-card, .team-perf-card, .vuln-table-card { break-inside: avoid; page-break-inside: avoid; }
  </style>
</head>
<body>
<div class="report-download-wrapper">${clone.outerHTML}</div>
<script>
  (function () {
    function applyFilters() {
      var team = document.getElementById('dl-team-filter')?.value || 'all';
      var sev  = document.getElementById('dl-sev-filter')?.value  || 'all';
      var stat = document.getElementById('dl-status-filter')?.value || 'all';
      var rows = document.querySelectorAll('.vuln-table tbody tr');
      var visible = 0;
      rows.forEach(function (tr) {
        var matchTeam = team === 'all' || tr.getAttribute('data-team') === team;
        var matchSev  = sev  === 'all' || tr.getAttribute('data-severity') === sev;
        var matchStat = stat === 'all' || tr.getAttribute('data-status') === stat;
        if (matchTeam && matchSev && matchStat) { tr.style.display = ''; visible++; }
        else { tr.style.display = 'none'; }
      });
    }
    window.addEventListener('DOMContentLoaded', function () {
      ['dl-team-filter', 'dl-sev-filter', 'dl-status-filter'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
      });
    });
  })();
<\/script>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vulnerability-management-report.html';
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
/* ─────────────────────────────────────────────
   Base
───────────────────────────────────────────── */
* { box-sizing: border-box; }

.vr-content {
  background: #f8f9fc;
  min-height: 100vh;
  padding: 0;
}

/* ─────────────────────────────────────────────
   Sticky Header — Dark Banner
───────────────────────────────────────────── */
.report-sticky-header {
  position: fixed;
  top: 52px;
  left: 8.333%;
  right: 0;
  z-index: 200;
  background: #111827;
  padding: 12px 28px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

/* Fills the gap between DashboardHeader bottom and this header */
.report-sticky-header::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: #111827;
}

/* Back button — ghost on dark */
.btn-back {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  background: transparent;
  border: 1.5px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.80rem;
  font-weight: 700;
  color: rgba(255,255,255,0.75);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
  letter-spacing: 0.01em;
  white-space: nowrap;
}
.btn-back:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.38);
  color: #ffffff;
}

/* Export button — white pill on dark */
.btn-export {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  background: #ffffff;
  color: #241447;
  border: none;
  border-radius: 999px;
  padding: 9px 22px;
  font-size: 0.80rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
  white-space: nowrap;
}
.btn-export:hover {
  background: #f0ecff;
  box-shadow: 0 4px 18px rgba(0,0,0,0.35);
}

/* Centre section */
.rsh-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
}

.rsh-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
}

.rsh-risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #dc2626;
  color: #ffffff;
  font-size: 0.58rem;
  font-weight: 800;
  padding: 3px 9px;
  border-radius: 5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  width: fit-content;
  margin-bottom: 1px;
}

.rsh-title {
  font-size: 0.97rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rsh-subtitle {
  font-size: 0.70rem;
  color: rgba(255,255,255,0.42);
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rsh-dot {
  margin: 0 5px;
  opacity: 0.5;
}

/* Severity count chips */
.rsh-counts {
  display: flex;
  align-items: center;
  gap: 22px;
  flex-shrink: 0;
}
.rsh-count-item {
  text-align: center;
}
.rsh-count-num {
  font-size: 1.55rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1px;
}
.rsh-critical { color: #ef4444; }
.rsh-high     { color: #f97316; }
.rsh-medium   { color: #fbbf24; }
.rsh-low      { color: #22c55e; }

.rsh-count-lbl {
  font-size: 0.58rem;
  color: rgba(255,255,255,0.40);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-top: 2px;
}

/* ─────────────────────────────────────────────
   Report Body
───────────────────────────────────────────── */
.report-body {
  padding: 158px 32px 56px;
}

/* ─────────────────────────────────────────────
   Tabs Navigation
───────────────────────────────────────────── */
.tabs-nav-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.tabs-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  border: 1.5px solid #e8e2f5;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 6px 28px rgba(36,20,71,0.13), 0 1px 4px rgba(36,20,71,0.06);
  flex-wrap: wrap;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: transparent;
  border: none;
  border-radius: 11px;
  padding: 9px 18px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  white-space: nowrap;
  position: relative;
}
.tab-btn:hover {
  background: #f4f0ff;
  color: #241447;
}
.tab-btn-active {
  background: #241447;
  color: #ffffff;
  box-shadow: 0 3px 12px rgba(36,20,71,0.25);
}
.tab-btn-active:hover {
  background: #3b1f7a;
  color: #ffffff;
}

.tab-icon-wrap {
  font-size: 0.95rem;
  line-height: 1;
}
.tab-label-text {
  line-height: 1;
}
.tab-active-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.65);
  flex-shrink: 0;
}

.tabs-multi-hint {
  font-size: 0.72rem;
  font-weight: 600;
  color: #7c6fa0;
  background: #f4f0ff;
  border: 1px solid #e9e5f3;
  border-radius: 999px;
  padding: 5px 13px;
  white-space: nowrap;
  display: flex;
  align-items: center;
}

.tab-section-wrap {
  animation: fadeTabIn 0.22s ease;
}
@keyframes fadeTabIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─────────────────────────────────────────────
   Alert Banner
───────────────────────────────────────────── */
.alert-overdue-banner {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  background: #fff5f5;
  border: 1.5px solid #fca5a5;
  border-left: 4px solid #dc2626;
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 20px;
}
.alert-banner-icon-wrap {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fee2e2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  margin-top: 1px;
}
.alert-banner-body {
  flex: 1;
}
.alert-banner-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #991b1b;
  margin-bottom: 4px;
  line-height: 1.35;
}
.alert-banner-desc {
  font-size: 0.78rem;
  color: #b91c1c;
  font-weight: 500;
  line-height: 1.5;
  margin: 0;
}

/* ─────────────────────────────────────────────
   SLA Stats Row
───────────────────────────────────────────── */
.sla-stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 14px;
}

.sla-stat-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 18px 16px;
  border: 1.5px solid #ede9f6;
  box-shadow: 0 2px 10px rgba(36,20,71,0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}

.sla-stat-number {
  font-size: 2.8rem;
  font-weight: 900;
  line-height: 1;
  letter-spacing: -1.5px;
}
.sla-num-critical { color: #7f1d1d; }
.sla-num-high     { color: #dc2626; }
.sla-num-medium   { color: #d97706; }
.sla-num-low      { color: #16a34a; }
.sla-num-hosts    { color: #241447; }

.sla-stat-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.sla-stat-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.02em;
  margin-top: 2px;
}
.sla-badge-overdue  { background: #fee2e2; color: #dc2626; }
.sla-badge-inwindow { background: #dcfce7; color: #15803d; }
.sla-badge-neutral  { background: #f1f5f9; color: #64748b; }

/* ─────────────────────────────────────────────
   Section Labels
───────────────────────────────────────────── */
.section-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.72rem;
  font-weight: 800;
  color: #7c6fa0;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 14px;
}
.section-label-pip {
  display: inline-block;
  width: 18px;
  height: 3px;
  border-radius: 2px;
  background: linear-gradient(90deg, #0f696e, #241447);
  flex-shrink: 0;
}

/* ─────────────────────────────────────────────
   Spacing helpers
───────────────────────────────────────────── */
.mb-section { margin-bottom: 36px; }
.mb-filter  { margin-bottom: 14px; }

/* ─────────────────────────────────────────────
   Business Risk Grid
───────────────────────────────────────────── */
.business-risk-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.risk-card {
  border-radius: 18px;
  padding: 20px 20px 18px;
  border: 1.5px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.risk-critical {
  background: #fff5f5;
  border-color: #fca5a5;
}
.risk-high {
  background: #fffbeb;
  border-color: #fcd34d;
}
.risk-medium {
  background: #fefce8;
  border-color: #fde68a;
}

.risk-card-top {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}
.risk-icon-wrap {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;
}
.risk-icon-critical { background: #fee2e2; color: #dc2626; }
.risk-icon-high     { background: #fef3c7; color: #b45309; }
.risk-icon-medium   { background: #fef9c3; color: #a16207; }

.risk-card-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.35;
  flex: 1;
}
.risk-card-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

/* ─────────────────────────────────────────────
   Remediation Table
───────────────────────────────────────────── */
.remediation-table-card {
  background: #ffffff;
  border-radius: 20px;
  border: 1.5px solid #ede9f6;
  box-shadow: 0 2px 10px rgba(36,20,71,0.05);
  overflow: hidden;
}
.remediation-table-scroll {
  overflow-x: auto;
}
.remediation-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.remediation-table thead {
  background: #f2f3f6;
}
.remediation-table th {
  padding: 13px 20px;
  text-align: left;
  font-size: 0.62rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-bottom: 1.5px solid #ede9f6;
  white-space: nowrap;
}
.remediation-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f4f2f9;
  vertical-align: middle;
  color: #475569;
}
.remediation-table tbody tr:last-child td {
  border-bottom: none;
}
.remediation-table tbody tr:hover td {
  background: #faf9ff;
}

.rem-sev-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}
.rem-sev-critical { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
.rem-sev-high     { background: #f8dede; color: #b42318; border: 1px solid #efb7b1; }
.rem-sev-medium   { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
.rem-sev-low      { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }

.rem-findings-cell { font-weight: 600; color: #1e293b; white-space: nowrap; }
.rem-action-cell   { color: #475569; line-height: 1.5; max-width: 380px; }
.rem-deadline-cell { font-weight: 700; white-space: nowrap; }
.rem-deadline-overdue { color: #dc2626; }

.rem-status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  white-space: nowrap;
}
.rem-status-overdue  { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
.rem-status-inwindow { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }

/* ─────────────────────────────────────────────
   Resource Asks Grid
───────────────────────────────────────────── */
.resource-asks-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.resource-ask-card {
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 20px 18px;
  border: 1.5px solid #ede9f6;
  box-shadow: 0 2px 8px rgba(36,20,71,0.05);
}

.resource-ask-header {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 800;
  color: #241447;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #f1f5f9;
}

.resource-ask-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.resource-ask-list li {
  font-size: 0.78rem;
  color: #1d4ed8;
  font-weight: 500;
  line-height: 1.45;
  padding-left: 14px;
  position: relative;
}
.resource-ask-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #7c6fa0;
  font-weight: 900;
}

/* ─────────────────────────────────────────────
   Bento Grid — 12 columns
───────────────────────────────────────────── */
.bento-grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
}
.bento-col-4 { grid-column: span 4; }
.bento-col-6 { grid-column: span 6; }
.bento-col-8 { grid-column: span 8; }

/* ─────────────────────────────────────────────
   Bento Card base
───────────────────────────────────────────── */
.bento-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px 28px 24px;
  box-shadow: 0 2px 12px rgba(36,20,71,0.06);
  border: 1.5px solid #ede9f6;
}

/* ─────────────────────────────────────────────
   Total Vulnerabilities Card (col-4)
───────────────────────────────────────────── */
.bento-total-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(145deg, #241447 0%, #0f696e 100%);
  border: none;
}
.bento-total-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(255,255,255,0.65);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 8px;
}
.bento-total-number {
  font-size: 4.5rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -2px;
  margin-bottom: 10px;
}
.bento-total-trend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 18px;
}
.trend-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.trend-up {
  background: rgba(255,255,255,0.18);
  color: #ffffff;
}
.trend-text {
  font-size: 0.78rem;
  font-weight: 600;
  color: rgba(255,255,255,0.70);
}
.bento-total-chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  min-height: 100px;
}
.bento-total-chart-area canvas {
  width: 100% !important;
  max-height: 120px;
  filter: brightness(1.4) contrast(0.85);
  opacity: 0.9;
}

/* ─────────────────────────────────────────────
   Severity Breakdown Card (col-8)
───────────────────────────────────────────── */
.bento-severity-card {
  display: flex;
  flex-direction: column;
}
.bento-severity-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.bento-severity-title {
  font-size: 1rem;
  font-weight: 800;
  color: #241447;
  letter-spacing: -0.2px;
}
.sev-legend {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
}
.sev-legend-dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.severity-sub-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  flex: 1;
}

.severity-sub-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #f1f5f9;
  transition: box-shadow 0.18s, transform 0.18s;
  cursor: default;
}
.severity-sub-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.08);
  transform: translateY(-2px);
}

.sev-sub-critical { border-top: 3px solid #7f1d1d; background: #fff9f9; }
.sev-sub-high     { border-top: 3px solid #dc2626; background: #fff8f8; }
.sev-sub-medium   { border-top: 3px solid #d97706; background: #fffdf0; }
.sev-sub-low      { border-top: 3px solid #16a34a; background: #f6fff8; }

.sev-sub-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-bottom: 10px;
}
.sev-sub-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.sev-sub-number {
  font-size: 2.6rem;
  font-weight: 900;
  color: #1e293b;
  line-height: 1;
  letter-spacing: -1px;
  margin-bottom: 4px;
}
.sev-sub-caption {
  font-size: 0.66rem;
  color: #94a3b8;
  font-weight: 500;
}

/* ─────────────────────────────────────────────
   Chart Cards (Section 2)
───────────────────────────────────────────── */
.bento-chart-card {
  display: flex;
  flex-direction: column;
}
.bento-chart-title {
  font-size: 1rem;
  font-weight: 800;
  color: #241447;
  letter-spacing: -0.2px;
  margin-bottom: 6px;
}

.chart-donut-wrap {
  display: flex;
  align-items: center;
  gap: 24px;
  flex: 1;
  margin-top: 12px;
  flex-wrap: wrap;
}
.chart-donut-wrap canvas {
  flex-shrink: 0;
}
.team-dist-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 140px;
}
.dist-legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #475569;
}
.dist-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dist-legend-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dist-legend-count {
  font-weight: 800;
  color: #241447;
  font-size: 0.82rem;
}

/* ── Velocity Card ── */
.bento-velocity-card {
  display: flex;
  flex-direction: column;
}
.velocity-sub {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
  margin: 0 0 20px;
}
.velocity-item {
  margin-bottom: 20px;
}
.velocity-row-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.velocity-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
}
.velocity-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  flex-shrink: 0;
}
.velocity-pct {
  font-size: 0.875rem;
  font-weight: 800;
  border-radius: 8px;
  padding: 2px 10px;
}
.velocity-pct-critical { color: #dc2626; background: #fef2f2; }
.velocity-pct-high     { color: #b42318; background: #fff1f1; }
.velocity-pct-overall  { color: #241447; background: #f4f0ff; }

.velocity-bar-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
}
.velocity-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
.velocity-fill-critical { background: #dc2626; }
.velocity-fill-high     { background: linear-gradient(90deg, #dc2626, #f87171); }
.velocity-fill-overall  { background: linear-gradient(90deg, #241447, #0f696e); }

.velocity-note {
  margin-top: auto;
  padding-top: 16px;
  font-size: 0.72rem;
  color: #94a3b8;
  font-weight: 500;
  display: flex;
  align-items: center;
}

/* ─────────────────────────────────────────────
   Team Performance Grid
───────────────────────────────────────────── */
.team-perf-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.team-perf-card {
  background: #f7f6fb;
  border-radius: 20px;
  padding: 22px 20px 18px;
  border: 1.5px solid #ede9f6;
  transition: box-shadow 0.2s, transform 0.2s;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.team-perf-card:hover {
  box-shadow: 0 8px 28px rgba(36,20,71,0.1);
  transform: translateY(-3px);
}

.tpc-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tpc-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 3px 10px rgba(0,0,0,0.15);
}

.closure-badge {
  font-size: 0.68rem;
  font-weight: 800;
  padding: 4px 11px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
.closure-good { background: #dcfce7; color: #15803d; }
.closure-warn { background: #fee2e2; color: #b91c1c; }

.tpc-team-name {
  font-size: 0.875rem;
  font-weight: 800;
  color: #241447;
  line-height: 1.3;
}

.tpc-counts-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: #ffffff;
  border-radius: 12px;
  padding: 12px 8px;
  border: 1px solid #ede9f6;
}
.tpc-count-block {
  text-align: center;
  flex: 1;
}
.tpc-count-divider {
  width: 1px;
  height: 28px;
  background: #ede9f6;
  flex-shrink: 0;
}
.tpc-count-num {
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1;
  margin-bottom: 3px;
  letter-spacing: -0.5px;
}
.tpc-count-lbl {
  font-size: 0.62rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.tpc-open   { color: #dc2626; }
.tpc-closed { color: #16a34a; }

.tpc-progress-track {
  height: 6px;
  background: #e9e5f3;
  border-radius: 999px;
  overflow: hidden;
}
.tpc-progress-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.tpc-sev-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.tpc-sev-chip {
  font-size: 0.62rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  letter-spacing: 0.02em;
}
.tpc-sev-critical { background: #fee2e2; color: #dc2626; }
.tpc-sev-high     { background: #f8dede; color: #b42318; }
.tpc-sev-medium   { background: #fef3c7; color: #b45309; }
.tpc-sev-low      { background: #ccfbf1; color: #0f766e; }

/* ─────────────────────────────────────────────
   Filter Card
───────────────────────────────────────────── */
.filter-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 14px 20px;
  border: 1.5px solid #ede9f6;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  box-shadow: 0 1px 6px rgba(36,20,71,0.05);
}
.filter-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
.filter-label-text {
  font-size: 0.72rem;
  font-weight: 800;
  color: #7c6fa0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.filter-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  flex: 1;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 7px;
}
.filter-group-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  white-space: nowrap;
  margin: 0;
}
.filter-select {
  border: 1.5px solid #e8ecf0;
  border-radius: 10px;
  padding: 7px 14px;
  font-size: 0.82rem;
  color: #1e293b;
  background: #f8f9fc;
  cursor: pointer;
  outline: none;
  font-weight: 600;
  appearance: auto;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.filter-select:focus {
  border-color: #0f696e;
  box-shadow: 0 0 0 3px rgba(15,105,110,0.12);
}

/* ─────────────────────────────────────────────
   Vulnerability Table Card
───────────────────────────────────────────── */
.vuln-table-card {
  background: #ffffff;
  border-radius: 24px;
  border: 1.5px solid #ede9f6;
  box-shadow: 0 2px 12px rgba(36,20,71,0.06);
  overflow: hidden;
}

.vuln-table-scroll {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 500px;
}
.vuln-table-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
.vuln-table-scroll::-webkit-scrollbar-track { background: #f8f9fc; }
.vuln-table-scroll::-webkit-scrollbar-thumb { background: rgba(36,20,71,0.18); border-radius: 20px; }
.vuln-table-scroll::-webkit-scrollbar-thumb:hover { background: rgba(36,20,71,0.32); }

.vuln-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.82rem;
}
.vuln-table thead {
  position: sticky;
  top: 0;
  z-index: 2;
}
.vuln-table th {
  background: #f2f3f6;
  padding: 14px 24px;
  text-align: left;
  font-size: 0.62rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  border-bottom: 1.5px solid #ede9f6;
  white-space: nowrap;
}
.vuln-table td {
  padding: 18px 24px;
  border-bottom: 1px solid #f4f2f9;
  color: #475569;
  vertical-align: middle;
}
.vuln-table-row:hover td { background: #faf9ff; }
.vuln-table tbody tr:last-child td { border-bottom: none; }

.table-empty-cell {
  text-align: center;
  padding: 40px 24px !important;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

.table-loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #ede9f6;
  border-top-color: #241447;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 8px;
  vertical-align: -2px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.cell-id { font-size: 0.72rem; font-weight: 700; color: #b8b0cc; font-variant-numeric: tabular-nums; }
.cell-vuln-name { font-weight: 700; color: #241447; }
.cell-asset { display: inline-block; background: #f0ecff; color: #241447; font-size: 0.72rem; font-weight: 700; padding: 3px 10px; border-radius: 8px; }
.cell-date { font-size: 0.78rem; color: #64748b; font-variant-numeric: tabular-nums; white-space: nowrap; }

.team-badge { display: inline-block; padding: 3px 10px; border-radius: 8px; font-size: 0.72rem; font-weight: 700; }
.team-network       { background: #dbeafe; color: #1d4ed8; }
.team-patch         { background: #d1fae5; color: #059669; }
.team-configuration { background: #ffedd5; color: #c2410c; }
.team-architectural { background: #fee2e2; color: #b91c1c; }
.team-unassigned    { background: #f3f4f6; color: #6b7280; }

.sev-badge-pill { display: inline-block; padding: 4px 12px; border-radius: 999px; font-size: 0.68rem; font-weight: 800; letter-spacing: 0.03em; }
.sev-badge-critical { background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; }
.sev-badge-high     { background: #f8dede; color: #b42318; border: 1px solid #efb7b1; }
.sev-badge-medium   { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
.sev-badge-low      { background: #ccfbf1; color: #0f766e; border: 1px solid #5eead4; }

.status-open, .status-closed {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}
.status-open   { background: #fee2e2; color: #dc2626; }
.status-closed { background: #dcfce7; color: #15803d; }

.status-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.status-dot-open   { background: #dc2626; }
.status-dot-closed { background: #15803d; }

/* ─────────────────────────────────────────────
   Table Footer
───────────────────────────────────────────── */
.table-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-top: 1.5px solid #ede9f6;
  background: #faf9ff;
  flex-wrap: wrap;
  gap: 12px;
}
.table-footer-text { font-size: 0.78rem; color: #64748b; font-weight: 500; }
.table-footer-text strong { color: #241447; font-weight: 800; }
.table-footer-badges { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.footer-sev-pill { font-size: 0.65rem; font-weight: 800; padding: 3px 11px; border-radius: 999px; }
.footer-critical { color: #dc2626; }
.footer-high     { color: #b42318; }
.footer-medium   { color: #b45309; }
.footer-low      { color: #0f766e; }

/* ─────────────────────────────────────────────
   Responsive
───────────────────────────────────────────── */
@media (max-width: 1280px) {
  .bento-col-4 { grid-column: span 6; }
  .bento-col-8 { grid-column: span 6; }
  .team-perf-grid { grid-template-columns: repeat(2, 1fr); }
  .severity-sub-grid { grid-template-columns: repeat(2, 1fr); }
  .business-risk-grid { grid-template-columns: repeat(2, 1fr); }
  .sla-stats-row { grid-template-columns: repeat(3, 1fr); }
  .resource-asks-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 900px) {
  .bento-col-4, .bento-col-6, .bento-col-8 { grid-column: span 12; }
  .team-perf-grid { grid-template-columns: 1fr; }
  .severity-sub-grid { grid-template-columns: repeat(2, 1fr); }
  .business-risk-grid { grid-template-columns: 1fr; }
  .sla-stats-row { grid-template-columns: repeat(2, 1fr); }
  .resource-asks-grid { grid-template-columns: 1fr; }
  .report-body { padding: 158px 16px 40px; }
  .report-sticky-header { padding: 10px 16px; gap: 10px; }
  .rsh-counts { gap: 14px; }
  .rsh-count-num { font-size: 1.2rem; }
  .tabs-nav { gap: 4px; }
  .tab-btn { padding: 8px 12px; font-size: 0.75rem; }
}
@media (max-width: 600px) {
  .severity-sub-grid { grid-template-columns: 1fr 1fr; }
  .sla-stats-row { grid-template-columns: 1fr 1fr; }
  .filter-controls { flex-direction: column; align-items: flex-start; }
  .bento-total-number { font-size: 3rem; }
  .tab-label-text { display: none; }
  .tab-icon-wrap { font-size: 1.2rem; }
}
</style>
