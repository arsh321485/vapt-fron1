<template>
  <div class="animated-dashboard">
    <div class="dashboard-mockup">
      <!-- Sidebar — product nav: Home … Support Requests + VAPTFIX logo mark -->
      <aside class="dashboard-sidebar" aria-label="Demo navigation">
        <div class="sidebar-logo" aria-label="VAPTFIX">
          <img src="@/assets/images/vaptfix_white.png" alt="VAPTFIX" class="sidebar-logo-img" />
        </div>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'dashboard' }"
          aria-label="Home"
          @click="goToPage('dashboard')"
        >
          <i class="bi bi-house"></i>
          <span class="sidebar-item-label">Home</span>
        </button>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'calendar' }"
          aria-label="Calendar"
          @click="goToPage('calendar')"
        >
          <i class="bi bi-calendar3"></i>
          <span class="sidebar-item-label">Calendar</span>
        </button>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'team' }"
          aria-label="Teams"
          @click="goToPage('team')"
        >
          <i class="bi bi-people"></i>
          <span class="sidebar-item-label">Teams</span>
        </button>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'register' }"
          aria-label="Register"
          @click="goToPage('register')"
        >
          <i class="bi bi-list-ul"></i>
          <span class="sidebar-item-label">Register</span>
        </button>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'assets' }"
          aria-label="Assets"
          @click="goToPage('assets')"
        >
          <i class="bi bi-laptop"></i>
          <span class="sidebar-item-label">Assets</span>
        </button>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'performance' }"
          aria-label="Team Performance"
          @click="goToPage('performance')"
        >
          <i class="bi bi-graph-up-arrow"></i>
          <span class="sidebar-item-label">Team Performance</span>
        </button>
        <button
          type="button"
          class="sidebar-item"
          :class="{ active: currentPage === 'support' }"
          aria-label="Support Requests"
          @click="goToPage('support')"
        >
          <i class="bi bi-exclamation-circle"></i>
          <span class="sidebar-item-label">Support Requests</span>
        </button>
      </aside>

      <div class="dashboard-main">
        <header
          :class="[
            'mock-header',
            { 'mock-header--calendar': currentPage === 'calendar' || currentPage === 'team', 'mock-header--register': currentPage === 'register' }
          ]"
        >
          <div v-if="currentPage === 'calendar'" class="mock-header-row mock-header-row-top mock-cal-dark-row">
            <div class="mock-header-notify-profile">
              <span class="mock-bell-wrap">
                <i class="bi bi-bell"></i>
                <span class="mock-bell-badge">19</span>
              </span>
              <div class="mock-user-avatar" aria-hidden="true">D</div>
            </div>
          </div>
          <div v-else-if="currentPage === 'register'" class="mock-header-row mock-header-row-top mock-header-register-row">
            <div class="mock-title-group mock-title-group-register">
              <div class="mock-register-title-block">
                <h1 class="mock-page-title">Vulnerability Management Program</h1>
              </div>
              <i class="bi bi-info-circle mock-info-ico" aria-hidden="true"></i>
            </div>
            <div class="mock-register-header-actions">
              <button type="button" class="mock-btn-report" aria-label="View Report">
                <i class="bi bi-eye" aria-hidden="true"></i>
                <span class="mock-btn-report-label">View Report</span>
              </button>
              <div class="mock-header-notify-profile">
                <span class="mock-bell-wrap">
                  <i class="bi bi-bell"></i>
                  <span class="mock-bell-badge">{{ mockBellCount }}</span>
                </span>
                <div class="mock-user-avatar" aria-hidden="true">D</div>
              </div>
            </div>
          </div>
          <div v-else-if="currentPage === 'team'" class="mock-header-row mock-header-row-top mock-cal-dark-row" style="justify-content: flex-end;">
            <div class="mock-header-notify-profile">
              <span class="mock-bell-wrap">
                <i class="bi bi-bell"></i>
                <span class="mock-bell-badge">{{ mockBellCount }}</span>
              </span>
              <div class="mock-user-avatar" aria-hidden="true">D</div>
            </div>
          </div>
          <template v-else>
            <div class="mock-header-row mock-header-row-top mock-header-default-top">
              <div class="mock-title-group">
                <h1 class="mock-page-title">Vulnerability Management Program</h1>
                <i class="bi bi-info-circle mock-info-ico" aria-hidden="true"></i>
              </div>
              <div class="mock-register-header-actions">
                <button type="button" class="mock-btn-report" aria-label="View Report">
                  <i class="bi bi-eye" aria-hidden="true"></i>
                  <span class="mock-btn-report-label">View Report</span>
                </button>
                <div class="mock-header-notify-profile">
                  <span class="mock-bell-wrap">
                    <i class="bi bi-bell"></i>
                    <span class="mock-bell-badge">{{ mockBellCount }}</span>
                  </span>
                  <div class="mock-user-avatar" aria-hidden="true">D</div>
                </div>
              </div>
            </div>
          </template>
        </header>

        <div class="dashboard-main-body">
          <transition name="fade">
            <div v-if="currentPage === 'dashboard'" class="dashboard-home-content">
              <div class="mock-stats">
                <!-- Card 1: Total Assets -->
                <div
                  class="vmp-card vmp-card-compact"
                  :class="{ 'vmp-card-active': activeDashCard === 'assets' }"
                >
                  <div class="vmp-card-head">
                    <div class="stat-icon-dash">
                      <i class="bi bi-laptop"></i>
                    </div>
                    <span class="vmp-card-label">Total Assets</span>
                  </div>
                  <div class="vmp-card-num-wrap">
                    <span class="vmp-card-num">15</span>
                  </div>
                </div>

                <!-- Card 2: Mean time to remediate (same pattern as product dashboard) -->
                <div class="vmp-card vmp-card-mttr">
                  <div class="vmp-card-head">
                    <div class="stat-icon-dash">
                      <i class="bi bi-hourglass-split"></i>
                    </div>
                    <span class="vmp-card-label">Mean time to remediate</span>
                  </div>
                  <div class="mttr-body">
                    <div class="mttr-donut">
                      <svg class="mttr-svg" viewBox="0 0 132 132" aria-hidden="true">
                        <defs>
                          <linearGradient id="home-mttr-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#10b981" />
                            <stop offset="33%" stop-color="#f59e0b" />
                            <stop offset="66%" stop-color="#b42318" />
                            <stop offset="100%" stop-color="#dc2626" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="66"
                          cy="66"
                          r="48"
                          fill="none"
                          stroke="#f1f5f9"
                          stroke-width="10"
                          stroke-dasharray="226.2 75.4"
                          transform="rotate(135 66 66)"
                        />
                        <circle
                          cx="66"
                          cy="66"
                          r="48"
                          fill="none"
                          stroke="url(#home-mttr-grad)"
                          stroke-width="10"
                          stroke-linecap="round"
                          stroke-dasharray="226.2 75.4"
                          stroke-dashoffset="52"
                          transform="rotate(135 66 66)"
                        />
                      </svg>
                      <div class="mttr-center">
                        <div class="mttr-time">1w 1d 18hrs</div>
                        <div class="mttr-sub">MTTR</div>
                      </div>
                    </div>
                  </div>
                  <div class="mttr-footer">
                    <span class="mttr-foot-lbl">Avg. remediation</span>
                    <span class="mttr-foot-pill">2</span>
                  </div>
                </div>

                <!-- Card 3: Vulnerabilities -->
                <div class="vmp-card">
                  <div class="vmp-card-head">
                    <div class="stat-icon-dash">
                      <i class="bi bi-shield-fill-exclamation"></i>
                    </div>
                    <span class="vmp-card-label">Vulnerabilities</span>
                  </div>
                  <div class="vuln-bars">
                    <div class="vuln-col">
                      <span class="vuln-n v-crit">0</span>
                      <div class="vuln-bar b-crit"></div>
                      <span class="vuln-sev">Critical</span>
                    </div>
                    <div class="vuln-col">
                      <span class="vuln-n v-high">1</span>
                      <div class="vuln-bar b-high"></div>
                      <span class="vuln-sev">High</span>
                    </div>
                    <div class="vuln-col">
                      <span class="vuln-n v-med">47</span>
                      <div class="vuln-bar b-med"></div>
                      <span class="vuln-sev">Medium</span>
                    </div>
                    <div class="vuln-col">
                      <span class="vuln-n v-low">16</span>
                      <div class="vuln-bar b-low"></div>
                      <span class="vuln-sev">Low</span>
                    </div>
                  </div>
                </div>

                <!-- Card 4: Mitigation criteria timeline (simplified) -->
                <div class="vmp-card vmp-card-timeline">
                  <div class="vmp-card-head">
                    <div class="stat-icon-dash">
                      <i class="bi bi-clock-history"></i>
                    </div>
                    <span class="vmp-card-label">Mitigation Criteria Timeline</span>
                  </div>
                  <div class="gauge-row">
                    <div class="gauge-cell">
                      <div class="gauge-arc g-crit"></div>
                      <span class="gauge-lbl">Critical</span>
                      <span class="gauge-val">3D</span>
                    </div>
                    <div class="gauge-cell">
                      <div class="gauge-arc g-high"></div>
                      <span class="gauge-lbl">High</span>
                      <span class="gauge-val">4D</span>
                    </div>
                    <div class="gauge-cell">
                      <div class="gauge-arc g-med"></div>
                      <span class="gauge-lbl">Medium</span>
                      <span class="gauge-val">2W</span>
                    </div>
                    <div class="gauge-cell">
                      <div class="gauge-arc g-low"></div>
                      <span class="gauge-lbl">Low</span>
                      <span class="gauge-val">2W</span>
                    </div>
                  </div>
                  <div class="gauge-legend">
                    <span><i class="dot dot-sla"></i> SLA compliance</span>
                    <span><i class="dot dot-non"></i> Non-compliance</span>
                  </div>
                </div>
              </div>

              <div class="mock-content vmp-panel">
                <div class="vmp-panel-head">
                  <div class="content-header">Mitigation Timeline Extension</div>
                  <p class="mock-sub">Pending requests by team and severity</p>
                </div>
                <div class="mock-table">
                  <div class="mock-tr mock-tr-head">
                    <span>Team</span><span class="t-c">Critical</span><span class="t-h">High</span><span class="t-m">Medium</span><span class="t-l">Low</span>
                  </div>
                  <div v-for="(row, idx) in tableRows" :key="idx" class="mock-tr">
                    <span class="mock-td-team">{{ row }}</span>
                    <span><span class="pill p-c">0D</span></span>
                    <span><span class="pill p-h">0D</span></span>
                    <span><span class="pill p-m">0D</span></span>
                    <span><span class="pill p-l">0D</span></span>
                  </div>
                </div>
                <button type="button" class="mock-link-report">View full report <i class="bi bi-chevron-right"></i></button>
              </div>
            </div>
          </transition>

          <transition name="slide-left">
            <div v-if="currentPage === 'assets'" class="page-view page-view-assets">
              <div class="assets-split">
                <aside class="assets-col-left">
                  <div class="assets-list-head">
                    <h3 class="assets-list-title">All Assets</h3>
                    <span class="assets-count-pill">15 Assets</span>
                    <div class="assets-list-tools">
                      <i class="bi bi-trash"></i>
                      <i class="bi bi-eye-slash"></i>
                    </div>
                  </div>
                  <input
                    type="search"
                    class="assets-search"
                    placeholder="Search assets, IPs..."
                    readonly
                    aria-label="Search assets"
                  />
                  <div class="assets-scroll-list">
                    <button
                      v-for="asset in assetsDemoList"
                      :key="asset.ip"
                      type="button"
                      class="asset-list-card"
                      :class="{ 'is-selected': selectedAssetIp === asset.ip }"
                      @click="selectAssetDemo(asset)"
                    >
                      <div class="alc-top">
                        <span class="alc-ip">{{ asset.ip }}</span>
                        <span class="alc-sev" :class="'sev-' + asset.severity.toLowerCase()">{{ asset.severity }}</span>
                      </div>
                      <div class="alc-exp">Exposure: {{ asset.exposure }}</div>
                      <div class="alc-pills">
                        <span class="vp vp-all">{{ asset.vulns }} Vulns</span>
                        <span class="vp vp-c">{{ asset.c }}</span>
                        <span class="vp vp-h">{{ asset.h }}</span>
                        <span class="vp vp-m">{{ asset.m }}</span>
                        <span class="vp vp-l">{{ asset.l }}</span>
                      </div>
                    </button>
                  </div>
                </aside>
                <main class="assets-col-right" v-if="selectedAsset">
                  <div class="ad-head">
                    <div class="ad-head-row">
                      <h2 class="ad-ip">{{ selectedAsset.ip }}</h2>
                      <span class="ad-badge" :class="'ad-badge-' + selectedAsset.severity.toLowerCase()">{{ selectedAsset.severity }} severity</span>
                      <span class="ad-badge ad-badge-open"><i class="bi bi-circle-fill"></i> Open</span>
                    </div>
                    <p class="ad-exp">Exposure: {{ selectedAsset.exposure }}</p>
                  </div>
                  <div class="ad-tabs">
                    <button type="button" class="ad-tab is-on">Vulnerabilities ({{ selectedAsset.vulns }})</button>
                    <button type="button" class="ad-tab">Support Requests <span class="ad-tab-badge">4</span></button>
                    <button type="button" class="ad-tab">Related Assets</button>
                    <button type="button" class="ad-tab">History</button>
                  </div>
                  <div class="ad-filters">
                    <button
                      v-for="f in severityFilters"
                      :key="f"
                      type="button"
                      class="ad-filter"
                      :class="{ on: activeVulnFilter === f, 'f-all': f === 'All', 'f-crit': f === 'Critical', 'f-high': f === 'High', 'f-med': f === 'Medium', 'f-low': f === 'Low' }"
                      @click="activeVulnFilter = f"
                    >
                      {{ f }}
                    </button>
                  </div>
                  <div class="ad-threats">
                    <div v-for="(t, idx) in demoThreats" :key="idx" class="ad-threat-row">
                      <i class="bi bi-exclamation-triangle-fill ad-threat-ico" :class="'ico-' + t.sev.toLowerCase()"></i>
                      <div class="ad-threat-mid">
                        <div class="ad-threat-title">{{ t.title }}</div>
                        <div class="ad-threat-meta">
                          <span class="ad-mini-sev" :class="'sev-' + t.sev.toLowerCase()">{{ t.sev }}</span>
                          <span class="ad-mini-open"><i class="bi bi-circle-fill"></i> {{ t.status }}</span>
                        </div>
                      </div>
                      <i class="bi bi-chevron-down ad-threat-chev"></i>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </transition>

          <transition name="slide-left">
            <div v-if="currentPage === 'support'" class="page-view page-view-support">
              <div class="support-mock-inner">
                <div class="support-mock-top">
                  <div class="support-mock-titles">
                    <h2 class="support-mock-h2">Support Requests</h2>
                  </div>
                  <div class="support-raised-card">
                    <span class="src-label">Support request raised</span>
                    <div class="src-row">
                      <span class="src-num">12</span>
                      <span class="src-ico-wrap"><i class="bi bi-headset"></i></span>
                    </div>
                  </div>
                </div>

                <div class="support-toolbar-line">
                  <div class="support-status-tabs">
                    <button
                      type="button"
                      class="sst-btn"
                      :class="{ on: supportStatusTab === 'all' }"
                      @click="supportStatusTab = 'all'"
                    >
                      All 12
                    </button>
                    <button
                      type="button"
                      class="sst-btn"
                      :class="{ on: supportStatusTab === 'open' }"
                      @click="supportStatusTab = 'open'"
                    >
                      Open 12
                    </button>
                    <button
                      type="button"
                      class="sst-btn"
                      :class="{ on: supportStatusTab === 'closed' }"
                      @click="supportStatusTab = 'closed'"
                    >
                      Closed 0
                    </button>
                  </div>
                  <span class="support-showing">Showing {{ filteredSupportDemo.length }} requests</span>
                </div>

                <div class="support-actions-row">
                  <button type="button" class="sr-purple-btn">
                    <i class="bi bi-funnel"></i>
                    Filter View
                  </button>
                  <select class="sr-dd" aria-label="Sort">
                    <option>Sort by Date</option>
                  </select>
                  <select class="sr-dd" aria-label="Teams">
                    <option>All Teams</option>
                  </select>
                </div>

                <div class="support-table-scroll">
                  <table class="support-data-table">
                    <thead>
                      <tr>
                        <th>Asset</th>
                        <th>Vulnerability name</th>
                        <th>Criticality</th>
                        <th>Requested by</th>
                        <th>Support raised</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody v-if="!filteredSupportDemo.length">
                      <tr>
                        <td colspan="7" class="support-empty">No requests in this view.</td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr v-for="row in filteredSupportDemo" :key="row.id">
                        <td>
                          <div class="td-asset-ip">{{ row.asset }}</div>
                          <div class="td-asset-mail">{{ row.assetEmail }}</div>
                        </td>
                        <td class="td-vuln">{{ row.vuln }}</td>
                        <td>
                          <span class="crit-pill" :class="'crit-' + row.criticality.toLowerCase()">{{ row.criticality }}</span>
                        </td>
                        <td>
                          <div class="td-by">
                            <span class="td-ava">D</span>
                            <span class="td-by-mail">{{ row.requestedBy }}</span>
                          </div>
                        </td>
                        <td class="td-date">{{ row.raised }}</td>
                        <td>
                          <span class="td-status"><i class="bi bi-circle-fill"></i> {{ row.status }}</span>
                        </td>
                        <td><button type="button" class="td-view">View</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </transition>

          <transition name="slide-left">
            <div v-if="currentPage === 'calendar'" class="page-view page-view-cal-pro">
              <div class="cal-pro-toolbar">
                <div class="cal-pro-toolbar-left">
                  <select class="cal-pro-dd" aria-label="All Types">
                    <option>All Types</option>
                  </select>
                  <select class="cal-pro-dd" aria-label="All Units">
                    <option>All Units</option>
                  </select>
                  <select class="cal-pro-dd" aria-label="Extended Deadlines">
                    <option>Extended Deadlines</option>
                  </select>
                  <button type="button" class="cal-pro-filter-ico" aria-label="Filter">
                    <i class="bi bi-funnel"></i>
                  </button>
                </div>
                <div class="cal-pro-view-tabs">
                  <button
                    type="button"
                    class="cal-pro-view-tab"
                    :class="{ on: calViewTab === 'month' }"
                    @click="calViewTab = 'month'"
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    class="cal-pro-view-tab"
                    :class="{ on: calViewTab === 'week' }"
                    @click="calViewTab = 'week'"
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    class="cal-pro-view-tab"
                    :class="{ on: calViewTab === 'day' }"
                    @click="calViewTab = 'day'"
                  >
                    Day
                  </button>
                </div>
              </div>

              <div class="cal-pro-scroll">
                <div class="cal-pro-month-head">
                  <button type="button" class="cal-pro-nav-btn" aria-label="Previous month">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                  <div class="cal-pro-month-center">
                    <div class="cal-pro-month-title">{{ calendarDemoMeta.monthName }}</div>
                    <div class="cal-pro-month-sub">{{ calendarDemoMeta.eventsThisMonth }} events this month</div>
                  </div>
                  <button type="button" class="cal-pro-nav-btn" aria-label="Next month">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </div>

                <div class="cal-pro-grid-wrap">
                  <div
                    v-for="dow in ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']"
                    :key="dow"
                    class="cal-pro-dow"
                  >
                    {{ dow }}
                  </div>
                  <div
                    v-for="cell in calendarDemoCells"
                    :key="cell.id"
                    class="cal-pro-cell"
                    :class="{ 'is-muted': cell.muted, 'is-selected': cell.isSelected }"
                  >
                    <span class="cal-pro-day-num">{{ cell.displayNum }}</span>
                    <div class="cal-pro-pills">
                      <div
                        v-for="(ev, evi) in cell.events"
                        :key="evi"
                        class="cal-pro-pill"
                        :class="'cal-pill-' + ev.tier"
                      >
                        {{ ev.text }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <transition name="slide-left">
            <div v-if="currentPage === 'team'" class="page-view page-view-teams-pro">
              <div class="teams-pro-scroll">
                <div class="teams-pro-top">
                  <h2 class="teams-pro-h2">Your Teams</h2>
                  <button type="button" class="teams-pro-add">
                    <i class="bi bi-person-plus"></i>
                    Add a team member
                  </button>
                </div>
                <div class="teams-pro-card">
                  <div class="teams-pro-tabs">
                    <button
                      type="button"
                      class="teams-pro-tab"
                      :class="{ on: teamTab === 'patch' }"
                      @click="teamTab = 'patch'"
                    >
                      Patch Management
                    </button>
                    <button
                      type="button"
                      class="teams-pro-tab"
                      :class="{ on: teamTab === 'config' }"
                      @click="teamTab = 'config'"
                    >
                      Configuration Management
                    </button>
                    <button
                      type="button"
                      class="teams-pro-tab"
                      :class="{ on: teamTab === 'network' }"
                      @click="teamTab = 'network'"
                    >
                      Network Security
                    </button>
                    <button
                      type="button"
                      class="teams-pro-tab"
                      :class="{ on: teamTab === 'arch' }"
                      @click="teamTab = 'arch'"
                    >
                      Architectural Flaws
                    </button>
                  </div>
                  <section class="teams-pro-block">
                    <h3 class="teams-pro-block-title">Internal Team Members(1)</h3>
                    <div class="teams-pro-table-wrap">
                      <table class="teams-pro-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th class="teams-th-actions"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div class="teams-name-cell">
                                <span class="teams-ava">UV</span>
                                <span class="teams-name-txt">User vapt</span>
                              </div>
                            </td>
                            <td class="teams-td-mail">user@company.com</td>
                            <td>
                              <select class="teams-role-dd" aria-label="Role">
                                <option>AF</option>
                              </select>
                            </td>
                            <td class="teams-td-actions">
                              <button type="button" class="teams-info-btn" aria-label="Info">
                                <i class="bi bi-info-circle"></i>
                              </button>
                              <button type="button" class="teams-remove-btn">
                                <i class="bi bi-trash"></i>
                                Remove
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <section class="teams-pro-block teams-pro-block-ext">
                    <h3 class="teams-pro-block-title">External Team Members(0)</h3>
                    <div class="teams-pro-table-wrap teams-pro-table-empty">
                      <table class="teams-pro-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th class="teams-th-actions"></th>
                          </tr>
                        </thead>
                      </table>
                      <p class="teams-ext-empty">No external users found</p>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </transition>

          <transition name="slide-left">
            <div v-if="currentPage === 'register'" class="page-view page-view-register-pro">
              <div class="register-pro-scroll">
                <div class="register-pro-card">
                  <div class="register-pro-toolbar">
                    <div class="reg-sev-pills">
                      <button
                        v-for="s in registerSeverityOptions"
                        :key="s"
                        type="button"
                        class="reg-sev-pill"
                        :class="{ on: registerSeverityFilter === s }"
                        @click="registerSeverityFilter = s"
                      >
                        {{ s }}
                      </button>
                    </div>
                    <div class="register-pro-filters-right">
                      <span class="reg-lbl">Show rows:</span>
                      <select class="reg-mini-dd" aria-label="Rows per page">
                        <option>6</option>
                      </select>
                      <span class="reg-lbl">Status:</span>
                      <select class="reg-mini-dd" aria-label="Status">
                        <option>All</option>
                      </select>
                    </div>
                  </div>
                  <div class="register-pro-table-scroll">
                    <table class="register-data-table">
                      <thead>
                        <tr>
                          <th>S.No.</th>
                          <th>Vulnerability name</th>
                          <th>Asset</th>
                          <th>Severity</th>
                          <th>First observation</th>
                          <th>Second observation</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in registerDemoRows" :key="row.no">
                          <td class="reg-td-no">{{ row.no }}</td>
                          <td class="reg-td-vuln">{{ row.vuln }}</td>
                          <td class="reg-td-ip">{{ row.asset }}</td>
                          <td>
                            <span class="reg-sev-pill-td" :class="'sev-' + row.sevKey">{{ row.sev }}</span>
                          </td>
                          <td class="reg-td-date">{{ row.firstObs }}</td>
                          <td class="reg-td-dash">{{ row.secondObs }}</td>
                          <td>
                            <span class="reg-st-pill" :class="row.status === 'closed' ? 'st-closed' : 'st-open'">{{
                              row.status
                            }}</span>
                          </td>
                          <td><button type="button" class="reg-view-link">View</button></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="register-pro-foot">
                    <span class="register-pro-showing">Showing 1-6 of 65 results</span>
                    <div class="register-pro-pages">
                      <button type="button" class="reg-page-nav" aria-label="Previous">
                        <i class="bi bi-chevron-left"></i>
                      </button>
                      <button type="button" class="reg-page-num on">1</button>
                      <button type="button" class="reg-page-num">2</button>
                      <button type="button" class="reg-page-num">3</button>
                      <button type="button" class="reg-page-num">4</button>
                      <button type="button" class="reg-page-num">5</button>
                      <button type="button" class="reg-page-nav" aria-label="Next">
                        <i class="bi bi-chevron-right"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <transition name="slide-left">
            <div v-if="currentPage === 'performance'" class="page-view page-view-perf-pro">
              <div class="perf-pro-scroll">
                <h2 class="perf-pro-h2">Team Performance Monitoring</h2>
                <div class="perf-pro-grid">
                  <article
                    v-for="card in performanceDemoCards"
                    :key="card.id"
                    class="perf-card"
                    :class="'perf-accent-' + card.accent"
                  >
                    <div class="perf-card-head">
                      <div class="perf-card-title">{{ card.title }}</div>
                      <div class="perf-card-sub">{{ card.subtitle }}</div>
                    </div>
                    <div class="perf-stats-row">
                      <div class="perf-stat">
                        <div class="perf-stat-lbl">Closure rate</div>
                        <div class="perf-stat-val perf-val-closure">
                          {{ card.closure }}%
                          <i class="bi bi-graph-down-arrow"></i>
                        </div>
                      </div>
                      <div class="perf-stat">
                        <div class="perf-stat-lbl">Closed</div>
                        <div class="perf-stat-val perf-val-closed">{{ card.closed }}</div>
                      </div>
                      <div class="perf-stat">
                        <div class="perf-stat-lbl">Open</div>
                        <div class="perf-stat-val perf-val-open">{{ card.open }}</div>
                      </div>
                    </div>
                    <div class="perf-sev-label">Severity breakdown</div>
                    <div class="perf-sev-bar" aria-hidden="true">
                      <span
                        v-for="(seg, si) in perfBarSegments(card)"
                        :key="si"
                        class="perf-seg"
                        :class="'seg-' + seg.key"
                        :style="{ width: seg.w + '%' }"
                      ></span>
                    </div>
                    <div class="perf-sev-boxes">
                      <div class="perf-box crit"><span class="perf-box-l">Critical</span>{{ card.crit }}</div>
                      <div class="perf-box high"><span class="perf-box-l">High</span>{{ card.high }}</div>
                      <div class="perf-box med"><span class="perf-box-l">Medium</span>{{ card.med }}</div>
                      <div class="perf-box low"><span class="perf-box-l">Low</span>{{ card.low }}</div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <!-- Demo pointer (hidden while user drives sidebar) -->
      <div
        v-show="!demoPaused"
        class="mock-cursor"
        :style="cursorStyle"
        :class="{ clicking: isCursorClicking }"
        aria-hidden="true"
      >
        <div class="cursor-dot"></div>
        <div class="cursor-ring"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedDashboard',
  data() {
    return {
      currentPage: 'dashboard',
      demoPaused: false,
      cursorX: 50,
      cursorY: 50,
      isCursorClicking: false,
      activeDashCard: '',
      animationTimer: null,
      tableRows: [
        'Patch Management',
        'Configuration Management',
        'Network Security',
        'Application Security'
      ],
      selectedAssetIp: '192.168.0.26',
      assetsDemoList: [
        { ip: '192.168.0.26', exposure: 'External', severity: 'HIGH', vulns: 12, c: 0, h: 1, m: 8, l: 3 },
        { ip: '192.168.0.2', exposure: 'Internal', severity: 'MEDIUM', vulns: 6, c: 0, h: 0, m: 4, l: 2 },
        { ip: '192.168.0.5', exposure: 'Internal', severity: 'MEDIUM', vulns: 4, c: 0, h: 0, m: 2, l: 2 },
        { ip: '10.0.0.12', exposure: 'DMZ', severity: 'LOW', vulns: 2, c: 0, h: 0, m: 0, l: 2 }
      ],
      demoThreats: [
        { title: 'Redis Server Unprotected Instance', sev: 'HIGH', status: 'OPEN' },
        { title: 'SSL Medium Strength Cipher Suites (SWEET32)', sev: 'MEDIUM', status: 'OPEN' },
        { title: 'TLS 1.0 / 1.1 Deprecated Protocol Enabled', sev: 'MEDIUM', status: 'OPEN' }
      ],
      severityFilters: ['All', 'Critical', 'High', 'Medium', 'Low'],
      activeVulnFilter: 'All',
      supportStatusTab: 'all',
      calViewTab: 'month',
      teamTab: 'patch',
      registerSeverityOptions: ['All', 'Critical', 'High', 'Medium', 'Low'],
      registerSeverityFilter: 'All',
      registerDemoRows: [
        {
          no: '01',
          vuln: 'Redis Server Unprotected by Password or Authentication',
          asset: '192.168.0.26',
          sev: 'HIGH',
          sevKey: 'high',
          firstObs: '08/05/2026',
          secondObs: '—',
          status: 'open'
        },
        {
          no: '02',
          vuln: 'SSL Certificate Cannot Be Trusted',
          asset: '192.168.0.2',
          sev: 'MEDIUM',
          sevKey: 'medium',
          firstObs: '08/05/2026',
          secondObs: '—',
          status: 'open'
        },
        {
          no: '03',
          vuln: 'SSL Certificate Cannot Be Trusted',
          asset: '192.168.0.5',
          sev: 'MEDIUM',
          sevKey: 'medium',
          firstObs: '08/05/2026',
          secondObs: '—',
          status: 'open'
        },
        {
          no: '04',
          vuln: 'SSL Certificate Cannot Be Trusted',
          asset: '192.168.0.6',
          sev: 'MEDIUM',
          sevKey: 'medium',
          firstObs: '08/05/2026',
          secondObs: '—',
          status: 'open'
        },
        {
          no: '05',
          vuln: 'SSL Self-Signed Certificate',
          asset: '192.168.0.6',
          sev: 'MEDIUM',
          sevKey: 'medium',
          firstObs: '08/05/2026',
          secondObs: '—',
          status: 'closed'
        },
        {
          no: '06',
          vuln: 'SSL Certificate Cannot Be Trusted',
          asset: '192.168.0.9',
          sev: 'MEDIUM',
          sevKey: 'medium',
          firstObs: '08/05/2026',
          secondObs: '—',
          status: 'open'
        }
      ],
      performanceDemoCards: [
        {
          id: 'ns',
          title: 'Network Security Team',
          subtitle: 'INFRASTRUCTURE FOCUS',
          accent: 'blue',
          closure: 2,
          closed: 1,
          open: 45,
          crit: 0,
          high: 0,
          med: 42,
          low: 4
        },
        {
          id: 'pm',
          title: 'Patch Management Team',
          subtitle: 'LIFECYCLE MANAGEMENT',
          accent: 'green',
          closure: 0,
          closed: 0,
          open: 4,
          crit: 0,
          high: 0,
          med: 3,
          low: 1
        },
        {
          id: 'cm',
          title: 'Configuration Management Team',
          subtitle: 'SYSTEM CONFIGURATION',
          accent: 'orange',
          closure: 0,
          closed: 0,
          open: 15,
          crit: 0,
          high: 0,
          med: 4,
          low: 11
        },
        {
          id: 'af',
          title: 'Architectural Flaws Team',
          subtitle: 'DESIGN & ARCHITECTURE',
          accent: 'red',
          closure: 0,
          closed: 0,
          open: 0,
          crit: 0,
          high: 0,
          med: 0,
          low: 0
        }
      ],
      supportRequestsDemo: [
        {
          id: 1,
          asset: '192.168.0.26',
          assetEmail: 'abc@company.com',
          vuln: 'Redis Server Unprotected b...',
          criticality: 'HIGH',
          requestedBy: 'abc@company.com',
          raised: 'May 8, 2026',
          status: 'OPEN'
        },
        {
          id: 2,
          asset: '192.168.0.26',
          assetEmail: 'abc@company.com',
          vuln: 'SSL Certificate Cannot Be T...',
          criticality: 'MEDIUM',
          requestedBy: 'abc@company.com',
          raised: 'May 8, 2026',
          status: 'OPEN'
        },
        {
          id: 3,
          asset: '192.168.0.2',
          assetEmail: 'ops@vaptfix.demo',
          vuln: 'Weak SSH Algorithms Enabled',
          criticality: 'MEDIUM',
          requestedBy: 'ops@vaptfix.demo',
          raised: 'May 8, 2026',
          status: 'OPEN'
        },
        {
          id: 4,
          asset: '10.0.0.12',
          assetEmail: 'security@example.com',
          vuln: 'Outdated TLS 1.0 Protocol',
          criticality: 'HIGH',
          requestedBy: 'security@example.com',
          raised: 'May 8, 2026',
          status: 'OPEN'
        },
        {
          id: 5,
          asset: '192.168.0.5',
          assetEmail: 'admin@example.com',
          vuln: 'Missing Security Patches (C...',
          criticality: 'MEDIUM',
          requestedBy: 'admin@example.com',
          raised: 'May 8, 2026',
          status: 'OPEN'
        },
        {
          id: 6,
          asset: '192.168.0.26',
          assetEmail: 'abc@company.com',
          vuln: 'Default Credentials on Admin...',
          criticality: 'HIGH',
          requestedBy: 'abc@company.com',
          raised: 'May 8, 2026',
          status: 'OPEN'
        }
      ]
    };
  },
  computed: {
    cursorStyle() {
      return {
        left: `${this.cursorX}%`,
        top: `${this.cursorY}%`
      };
    },
    mockBellCount() {
      return this.currentPage === 'register' ? 18 : 19;
    },
    selectedAsset() {
      return this.assetsDemoList.find(a => a.ip === this.selectedAssetIp) || this.assetsDemoList[0];
    },
    filteredSupportDemo() {
      if (this.supportStatusTab === 'closed') {
        return [];
      }
      return this.supportRequestsDemo;
    },
    calendarDemoMeta() {
      return { monthName: 'May', year: 2026, eventsThisMonth: 4 };
    },
    calendarDemoCells() {
      const year = 2026;
      const month = 4;
      const first = new Date(year, month, 1);
      const pad = first.getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevLast = new Date(year, month, 0).getDate();
      const eventsByDay = {
        9: [{ tier: 'critical', text: 'Critical deadline' }],
        10: [{ tier: 'high', text: 'High deadline' }],
        20: [
          { tier: 'medium', text: 'Medium deadline' },
          { tier: 'low', text: 'Low deadline' }
        ]
      };
      const cells = [];
      let id = 0;
      for (let i = 0; i < pad; i++) {
        const displayNum = prevLast - pad + i + 1;
        cells.push({
          id: `pre-${id++}`,
          muted: true,
          displayNum,
          isSelected: false,
          events: []
        });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        cells.push({
          id: `may-${id++}`,
          muted: false,
          displayNum: d,
          isSelected: d === 11,
          events: eventsByDay[d] || []
        });
      }
      let tail = 1;
      while (cells.length < 42) {
        cells.push({
          id: `post-${id++}`,
          muted: true,
          displayNum: tail++,
          isSelected: false,
          events: []
        });
      }
      return cells.slice(0, 42);
    }
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    this.clearTimers();
  },
  methods: {
    clearTimers() {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }
    },
    goToPage(page) {
      this.demoPaused = true;
      this.clearTimers();
      this.currentPage = page;
      this.activeDashCard = '';
      if (page === 'assets') {
        this.selectedAssetIp = '192.168.0.26';
        this.activeVulnFilter = 'All';
      }
      if (page === 'support') {
        this.supportStatusTab = 'all';
      }
      if (page === 'calendar') {
        this.calViewTab = 'month';
      }
      if (page === 'team') {
        this.teamTab = 'patch';
      }
      if (page === 'register') {
        this.registerSeverityFilter = 'All';
      }
    },
    startAnimation() {
      if (!this.demoPaused) {
        this.runAnimationSequence();
      }
    },
    async runAnimationSequence() {
      if (this.demoPaused) return;

      this.currentPage = 'dashboard';
      this.activeDashCard = '';

      await this.delay(1200);
      this.activeDashCard = 'assets';
      await this.delay(450);
      this.activeDashCard = '';

      const goNav = async (x, y, page) => {
        this.moveCursor(x, y);
        await this.delay(650);
        this.clickCursor();
        await this.delay(380);
        if (this.demoPaused) return false;
        this.currentPage = page;
        return true;
      };

      if (!(await goNav(5.5, 23, 'calendar'))) return;

      await this.delay(2000);
      if (this.demoPaused) return;

      if (!(await goNav(5.5, 33, 'team'))) return;
      await this.delay(2000);
      if (this.demoPaused) return;

      if (!(await goNav(5.5, 43, 'register'))) return;
      await this.delay(2000);
      if (this.demoPaused) return;

      if (!(await goNav(5.5, 53, 'assets'))) return;
      this.selectedAssetIp = '192.168.0.26';
      await this.delay(2000);
      if (this.demoPaused) return;

      if (!(await goNav(5.5, 63, 'performance'))) return;
      await this.delay(2000);
      if (this.demoPaused) return;

      if (!(await goNav(5.5, 73, 'support'))) return;
      this.supportStatusTab = 'all';
      await this.delay(2200);
      if (this.demoPaused) return;

      this.currentPage = 'dashboard';
      await this.delay(1000);
      if (!this.demoPaused) {
        this.runAnimationSequence();
      }
    },
    moveCursor(x, y) {
      this.cursorX = x;
      this.cursorY = y;
    },
    clickCursor() {
      this.isCursorClicking = true;
      setTimeout(() => {
        this.isCursorClicking = false;
      }, 280);
    },
    delay(ms) {
      return new Promise(resolve => {
        this.animationTimer = setTimeout(resolve, ms);
      });
    },
    selectAssetDemo(asset) {
      this.selectedAssetIp = asset.ip;
    },
    perfBarSegments(card) {
      const { crit, high, med, low } = card;
      const t = crit + high + med + low;
      if (!t) {
        return [{ key: 'empty', w: 100 }];
      }
      const segs = [
        { key: 'c', w: (crit / t) * 100 },
        { key: 'h', w: (high / t) * 100 },
        { key: 'm', w: (med / t) * 100 },
        { key: 'l', w: (low / t) * 100 }
      ];
      return segs.filter(s => s.w > 0.05);
    },
  }
};
</script>

<style scoped>
.animated-dashboard {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.dashboard-mockup {
  width: 100%;
  max-width: 920px;
  height: 500px;
  background: #12102a;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
  display: flex;
  contain: layout;
}

/* ----- Sidebar — product-style: #1a1041, lavender labels, white + teal underline active ----- */
.dashboard-sidebar {
  width: 88px;
  background: #1a1041;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 14px 8px 12px;
  gap: 2px;
  flex-shrink: 0;
  box-sizing: border-box;
}

.sidebar-logo {
  text-align: center;
  padding: 0 2px 12px;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(184, 181, 222, 0.18);
}

.sidebar-logo-img {
  height: 18px;
  width: auto;
  max-width: 100%;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.sidebar-item {
  width: 100%;
  min-height: 56px;
  padding: 6px 4px 8px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 4px;
  color: #c4c0e8;
  cursor: pointer;
  transition: color 0.2s ease;
  position: relative;
  border-radius: 8px;
  box-sizing: border-box;
}

.sidebar-item i {
  font-size: 17px;
  line-height: 1;
  flex-shrink: 0;
}

.sidebar-item-label {
  font-size: 8.5px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
  hyphens: auto;
  word-break: break-word;
}

.sidebar-item:hover {
  color: #eceaf7;
}

.sidebar-item.active {
  color: #ffffff;
}

.sidebar-item.active i {
  color: #ffffff;
}

.sidebar-item.active .sidebar-item-label {
  color: #ffffff;
}

.sidebar-item.active .sidebar-item-label::after {
  content: '';
  display: block;
  width: 22px;
  height: 2px;
  margin: 5px auto 0;
  border-radius: 2px;
  background: linear-gradient(90deg, #2dd4bf, #319795);
}

/* ----- Main ----- */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  min-width: 0;
  background: #f8f9fb;
}

.dashboard-main-body {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

/* Top bar — navy blue across all pages */
.mock-header {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 12px 18px 14px;
  background: #2d1b4d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.mock-header--calendar {
  gap: 0;
  padding: 0;
  background: #2d1b4d;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.mock-header--calendar .mock-header-row-top {
  justify-content: flex-end;
}

.mock-cal-dark-row {
  padding: 10px 14px 12px;
}

.mock-header--calendar .mock-bell-wrap {
  color: rgba(255, 255, 255, 0.9);
}

.mock-header--register {
  gap: 0;
  padding: 12px 16px 14px;
}

.mock-header-register-row {
  align-items: flex-start;
}

.mock-title-group-register {
  align-items: flex-start;
}

.mock-register-title-block {
  min-width: 0;
}

.mock-register-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.mock-header-row {
  display: flex;
  align-items: center;
  min-width: 0;
}

.mock-header-row-top {
  justify-content: space-between;
  gap: 12px;
}

.mock-title-group {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.mock-header-notify-profile {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
}

.mock-header-row-actions {
  justify-content: flex-end;
}

.mock-page-title {
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.25;
  min-width: 0;
}

.mock-info-ico {
  color: rgba(255, 255, 255, 0.5);
  font-size: 16px;
  flex-shrink: 0;
}

.mock-btn-report {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  cursor: default;
}

.mock-btn-report-label {
  display: inline;
}

.mock-bell-wrap {
  position: relative;
  color: rgba(255, 255, 255, 0.9);
  font-size: 18px;
}

.mock-bell-badge {
  position: absolute;
  top: -6px;
  right: -8px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: #e53e3e;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ----- Dashboard home ----- */
.dashboard-home-content {
  padding: 10px 12px 12px;
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mock-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  align-items: stretch;
  width: 100%;
  min-width: 0;
  flex: 0 0 auto;
}

.vmp-card {
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e8edf3;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  padding: 6px 6px 8px;
  display: flex;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.vmp-card-active {
  box-shadow: 0 0 0 2px rgba(49, 151, 149, 0.45), 0 4px 14px rgba(15, 23, 42, 0.08);
  border-color: rgba(49, 151, 149, 0.5);
}

.vmp-card-compact .vmp-card-num-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px 0 4px;
  min-height: 36px;
}

.vmp-card-head {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  margin-bottom: 4px;
  min-width: 0;
}

.stat-icon-dash {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: linear-gradient(135deg, #e0f2f1, #ccfbf1);
  color: #0f696e;
  font-size: 11px;
  box-shadow: 0 1px 2px rgba(15, 105, 110, 0.12);
}

.vmp-card-label {
  font-size: 8px;
  font-weight: 700;
  color: #374151;
  line-height: 1.15;
  min-width: 0;
  flex: 1;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.vmp-card-num {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

/* MTTR card */
.vmp-card-mttr .mttr-body {
  display: flex;
  justify-content: center;
  padding: 2px 0 4px;
}

.mttr-donut {
  position: relative;
  width: 100%;
  max-width: 58px;
  height: 58px;
  margin: 0 auto;
}

.mttr-svg {
  width: 100%;
  height: 100%;
  max-width: 58px;
  max-height: 58px;
  display: block;
}

.mttr-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  pointer-events: none;
}

.mttr-time {
  font-size: 7px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.1;
  max-width: 100%;
  padding: 0 1px;
}

.mttr-sub {
  font-size: 6px;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.04em;
  margin-top: 1px;
}

.mttr-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 4px;
  margin-top: 2px;
  border-top: 1px solid #f1f5f9;
}

.mttr-foot-lbl {
  font-size: 7px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.mttr-foot-pill {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e0f2f1;
  color: #0f696e;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Vulnerabilities bars */
.vuln-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2px;
  height: 50px;
  padding: 0;
  min-width: 0;
}

.vuln-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  min-width: 0;
  max-width: 100%;
}

.vuln-n {
  font-size: 8px;
  font-weight: 800;
  margin-bottom: 2px;
}

.v-crit { color: #b42318; }
.v-high { color: #dc2626; }
.v-med { color: #b45309; }
.v-low { color: #0f766e; }

.vuln-bar {
  width: 100%;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
}

.b-crit { height: 8%; background: #b42318; }
.b-high { height: 18%; background: #dc2626; }
.b-med { height: 85%; background: #f59e0b; }
.b-low { height: 40%; background: #10b981; }

.vuln-sev {
  font-size: 6px;
  font-weight: 700;
  color: #64748b;
  margin-top: 2px;
  text-transform: capitalize;
}

/* Mitigation mini gauges */
.vmp-card-timeline .gauge-row {
  display: flex;
  justify-content: space-between;
  gap: 2px;
  padding: 4px 0 2px;
  min-width: 0;
}

.gauge-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 0;
}

.gauge-arc {
  width: 100%;
  max-width: 26px;
  height: 13px;
  border-radius: 26px 26px 0 0;
  opacity: 0.95;
}

.g-crit { background: linear-gradient(90deg, #fecaca, #b42318); }
.g-high { background: linear-gradient(90deg, #fecaca, #dc2626); }
.g-med { background: linear-gradient(90deg, #fde68a, #f59e0b); }
.g-low { background: linear-gradient(90deg, #bbf7d0, #10b981); }

.gauge-lbl {
  font-size: 6px;
  color: #64748b;
  font-weight: 600;
}

.gauge-val {
  font-size: 8px;
  font-weight: 800;
  color: #1e293b;
}

.gauge-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 6px;
  color: #64748b;
  margin-top: 4px;
}

.gauge-legend .dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}

.dot-sla { background: #1e1b4b; }
.dot-non { background: #cbd5e1; }

/* Bottom panel — table scrolls; title never clipped */
.vmp-panel {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
  padding: 10px 10px 10px;
  flex: 1 1 auto;
  min-height: 148px;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.vmp-panel-head {
  flex-shrink: 0;
  min-width: 0;
}

.mock-content .content-header {
  font-size: 12px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px;
  line-height: 1.35;
  overflow: visible;
  word-break: break-word;
}

.mock-sub {
  font-size: 9px;
  color: #64748b;
  margin: 0 0 8px;
  line-height: 1.35;
}

.mock-table {
  font-size: 8px;
  overflow: auto;
  flex: 1 1 auto;
  min-height: 72px;
  min-width: 0;
  -webkit-overflow-scrolling: touch;
}

.mock-tr {
  display: grid;
  grid-template-columns: 1.15fr repeat(4, 1fr);
  gap: 3px;
  align-items: center;
  padding: 4px 2px;
  border-bottom: 1px solid #f1f5f9;
}

.mock-tr-head {
  font-weight: 700;
  color: #fff;
  padding: 4px 2px;
  border-radius: 6px 6px 0 0;
  border-bottom: none;
}

.mock-tr-head span:first-child {
  color: #fff;
  background: transparent;
}

.mock-tr-head .t-c { background: #b42318; text-align: center; border-radius: 4px; padding: 4px 2px; }
.mock-tr-head .t-h { background: #f87171; color: #7f1d1d; text-align: center; border-radius: 4px; padding: 4px 2px; }
.mock-tr-head .t-m { background: #fbbf24; color: #78350f; text-align: center; border-radius: 4px; padding: 4px 2px; }
.mock-tr-head .t-l { background: #86efac; color: #14532d; text-align: center; border-radius: 4px; padding: 4px 2px; }

.mock-tr-head {
  background: #1e293b;
}

.mock-td-team {
  font-weight: 600;
  color: #334155;
}

.pill {
  display: inline-block;
  min-width: 22px;
  padding: 2px 4px;
  border-radius: 999px;
  text-align: center;
  font-weight: 700;
  font-size: 8px;
}

.p-c { background: #fecaca; color: #7f1d1d; }
.p-h { background: #fecaca; color: #991b1b; }
.p-m { background: #fef3c7; color: #92400e; }
.p-l { background: #d1fae5; color: #14532d; }

.mock-link-report {
  margin-top: 8px;
  flex-shrink: 0;
  align-self: flex-end;
  border: none;
  background: none;
  color: #319795;
  font-size: 10px;
  font-weight: 700;
  cursor: default;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

/* ----- Assets page (demo data — mirrors product layout) ----- */
.page-view-assets {
  padding: 0;
}

.assets-split {
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  min-width: 0;
}

.assets-col-left {
  width: 38%;
  max-width: 220px;
  min-width: 0;
  border-right: 1px solid #e8edf3;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.assets-list-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  padding: 10px 10px 8px;
  border-bottom: 1px solid #f1f5f9;
}

.assets-list-title {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #111827;
}

.assets-count-pill {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 999px;
}

.assets-list-tools {
  margin-left: auto;
  display: flex;
  gap: 10px;
  color: #94a3b8;
  font-size: 14px;
}

.assets-search {
  margin: 8px 10px;
  padding: 8px 10px;
  font-size: 11px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafafa;
  width: calc(100% - 20px);
  box-sizing: border-box;
}

.assets-scroll-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.asset-list-card {
  text-align: left;
  border: 1px solid #e8edf3;
  border-radius: 10px;
  padding: 8px 10px;
  background: #fff;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.asset-list-card:hover {
  background: #f8fafc;
}

.asset-list-card.is-selected {
  background: #eff6ff;
  border-color: #93c5fd;
}

.alc-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 4px;
}

.alc-ip {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}

.alc-sev {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 6px;
}

.alc-sev.sev-high {
  background: #fee2e2;
  color: #b91c1c;
}

.alc-sev.sev-medium {
  background: #fef9c3;
  color: #a16207;
}

.alc-sev.sev-low {
  background: #d1fae5;
  color: #047857;
}

.alc-exp {
  font-size: 10px;
  color: #64748b;
  margin-bottom: 6px;
}

.alc-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.vp {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 6px;
}

.vp-all {
  background: #ccfbf1;
  color: #0f766e;
}

.vp-c {
  background: #fee2e2;
  color: #991b1b;
}

.vp-h {
  background: #ffedd5;
  color: #c2410c;
}

.vp-m {
  background: #fef9c3;
  color: #a16207;
}

.vp-l {
  background: #d1fae5;
  color: #047857;
}

.assets-col-right {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow-y: auto;
  padding: 12px 14px 14px;
  background: #f8f9fb;
}

.ad-head {
  margin-bottom: 10px;
}

.ad-head-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.ad-ip {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
}

.ad-badge {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
}

.ad-badge-high {
  background: #fee2e2;
  color: #b91c1c;
}

.ad-badge-medium {
  background: #fef9c3;
  color: #a16207;
}

.ad-badge-low {
  background: #d1fae5;
  color: #047857;
}

.ad-badge-open {
  background: #fef2f2;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ad-badge-open i {
  font-size: 6px;
}

.ad-exp {
  margin: 0;
  font-size: 11px;
  color: #64748b;
}

.ad-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 10px;
}

.ad-tab {
  border: none;
  background: none;
  padding: 6px 2px 8px;
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
  cursor: default;
  position: relative;
}

.ad-tab.is-on {
  color: #0f766e;
}

.ad-tab.is-on::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: #319795;
  border-radius: 2px 2px 0 0;
}

.ad-tab-badge {
  display: inline-block;
  margin-left: 4px;
  min-width: 16px;
  padding: 0 4px;
  font-size: 9px;
  font-weight: 800;
  color: #fff;
  background: #e53e3e;
  border-radius: 999px;
}

.ad-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.ad-filter {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 10px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.ad-filter.on {
  border-color: #319795;
  color: #0f766e;
  background: #f0fdfa;
}

.ad-filter.f-crit.on {
  background: #fef2f2;
  border-color: #fecaca;
  color: #991b1b;
}

.ad-filter.f-high.on {
  background: #fff7ed;
  border-color: #fed7aa;
  color: #c2410c;
}

.ad-filter.f-med.on {
  background: #fefce8;
  border-color: #fde047;
  color: #a16207;
}

.ad-filter.f-low.on {
  background: #ecfdf5;
  border-color: #a7f3d0;
  color: #047857;
}

.ad-threats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ad-threat-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 10px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
}

.ad-threat-ico {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
}

.ad-threat-ico.ico-high {
  color: #dc2626;
}

.ad-threat-ico.ico-medium {
  color: #d97706;
}

.ad-threat-mid {
  flex: 1;
  min-width: 0;
}

.ad-threat-title {
  font-size: 11px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.35;
  margin-bottom: 6px;
}

.ad-threat-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.ad-mini-sev {
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 2px 6px;
  border-radius: 4px;
}

.ad-mini-sev.sev-high {
  background: #fee2e2;
  color: #b91c1c;
}

.ad-mini-sev.sev-medium {
  background: #fef9c3;
  color: #a16207;
}

.ad-mini-open {
  font-size: 9px;
  font-weight: 700;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ad-mini-open i {
  font-size: 5px;
}

.ad-threat-chev {
  color: #94a3b8;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 4px;
}

/* ----- Support Requests page (demo — matches product table) ----- */
.page-view-support {
  padding: 0;
  overflow: hidden;
}

.support-mock-inner {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 14px 16px 16px;
  box-sizing: border-box;
}

.support-mock-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.support-mock-titles {
  flex: 1 1 0;
  min-width: 0;
}

.support-mock-h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
}

.support-raised-card {
  flex: 0 0 auto;
  margin-left: auto;
  align-self: flex-start;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 10px 14px;
  min-width: 140px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
}

.src-label {
  display: block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  margin-bottom: 4px;
}

.src-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.src-num {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1;
}

.src-ico-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #e0f2f1, #ccfbf1);
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.support-toolbar-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.support-status-tabs {
  display: flex;
  gap: 6px;
}

.sst-btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
  cursor: pointer;
}

.sst-btn.on {
  background: #ccfbf1;
  border-color: #99f6e4;
  color: #0f766e;
}

.support-showing {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
}

.support-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.sr-purple-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: #4c1d95;
  border: none;
  border-radius: 8px;
  cursor: default;
}

.sr-dd {
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 500;
  color: #334155;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
}

.support-table-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.support-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.support-data-table thead {
  background: #f8fafc;
}

.support-data-table th {
  text-align: left;
  padding: 10px 12px;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  border-bottom: 1px solid #e8edf3;
  white-space: nowrap;
}

.support-data-table td {
  padding: 10px 12px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.support-data-table tbody tr:hover {
  background: #fafafa;
}

.td-asset-ip {
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2px;
}

.td-asset-mail {
  font-size: 10px;
  color: #64748b;
}

.td-vuln {
  font-weight: 500;
  color: #1e293b;
  max-width: 200px;
}

.crit-pill {
  display: inline-block;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
}

.crit-high {
  background: #fee2e2;
  color: #b91c1c;
}

.crit-medium {
  background: #fef9c3;
  color: #a16207;
}

.td-by {
  display: flex;
  align-items: center;
  gap: 8px;
}

.td-ava {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #2563eb;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.td-by-mail {
  font-size: 10px;
  color: #475569;
  word-break: break-all;
}

.td-date {
  white-space: nowrap;
  color: #475569;
}

.td-status {
  font-size: 10px;
  font-weight: 700;
  color: #b91c1c;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
}

.td-status i {
  font-size: 6px;
}

.td-view {
  border: none;
  background: none;
  color: #319795;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.td-view:hover {
  text-decoration: underline;
}

.support-empty {
  text-align: center;
  padding: 28px 16px !important;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 500;
}

/* ----- Inner pages (light) ----- */
.page-view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f8f9fb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  padding: 14px 18px;
  background: #fff;
  border-bottom: 1px solid #e8edf3;
  display: flex;
  align-items: center;
  color: #111827;
  font-size: 15px;
  flex-shrink: 0;
}

.page-header h3 {
  font-size: 16px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}

.badge-count {
  background: #e0f2f1;
  color: #0f696e;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.page-placeholder {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 16px;
}

.asset-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 10px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.asset-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #319795, #2c7a7b);
  flex-shrink: 0;
}

.asset-name {
  height: 12px;
  width: 58%;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 6px;
}

.asset-meta {
  height: 8px;
  width: 38%;
  background: #f1f5f9;
  border-radius: 4px;
}

.asset-status {
  width: 56px;
  height: 22px;
  background: #d1fae5;
  border-radius: 999px;
  flex-shrink: 0;
}

.support-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 10px;
  margin-bottom: 8px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
}

.support-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #319795, #2c7a7b);
  flex-shrink: 0;
}

.support-title {
  height: 12px;
  width: 68%;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 6px;
}

.support-meta {
  height: 8px;
  width: 48%;
  background: #f1f5f9;
  border-radius: 4px;
}

.support-priority {
  width: 48px;
  height: 22px;
  background: #fee2e2;
  border-radius: 999px;
  flex-shrink: 0;
}

/* ----- Teams (Your Teams — product-style) ----- */
.page-view-teams-pro {
  background: #f4f6f8;
}

.teams-pro-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  padding: 12px 14px 16px;
}

.teams-pro-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.teams-pro-h2 {
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  color: #0f172a;
}

.teams-pro-add {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: #319795;
  border: none;
  border-radius: 8px;
  cursor: default;
  white-space: nowrap;
}

.teams-pro-add i {
  font-size: 13px;
}

.teams-pro-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
  overflow: hidden;
}

.teams-pro-tabs {
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  border-bottom: 1px solid #eef0f3;
  padding: 0 8px;
  overflow: hidden;
}

.teams-pro-tab {
  border: none;
  background: none;
  padding: 10px 10px 11px;
  font-size: 10px;
  font-weight: 600;
  color: #94a3b8;
  cursor: pointer;
  position: relative;
}

.teams-pro-tab.on {
  color: #319795;
  font-weight: 700;
}

.teams-pro-tab.on::after {
  content: '';
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 0;
  height: 2px;
  border-radius: 2px 2px 0 0;
  background: linear-gradient(90deg, #2dd4bf, #319795);
}

.teams-pro-block {
  padding: 12px 14px 14px;
}

.teams-pro-block-ext {
  border-top: 1px solid #eef0f3;
}

.teams-pro-block-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #334155;
}

.teams-pro-table-wrap {
  border: 1px solid #e8edf3;
  border-radius: 8px;
  overflow: hidden;
}

.teams-pro-table-empty {
  position: relative;
  min-height: 88px;
}

.teams-pro-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 10px;
}

.teams-pro-table thead th {
  text-align: left;
  padding: 8px 10px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
  background: #fafbfc;
  border-bottom: 1px solid #e8edf3;
}

.teams-th-actions {
  width: 120px;
}

.teams-pro-table tbody td {
  padding: 10px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #334155;
}

.teams-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.teams-ava {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #bbf7d0;
  color: #166534;
  font-size: 9px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.teams-name-txt {
  font-weight: 600;
  text-transform: lowercase;
}

.teams-td-mail {
  color: #475569;
}

.teams-role-dd {
  font-size: 10px;
  font-weight: 600;
  padding: 5px 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  color: #334155;
}

.teams-td-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.teams-info-btn {
  border: none;
  background: none;
  color: #94a3b8;
  padding: 4px;
  cursor: default;
  font-size: 14px;
}

.teams-remove-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: 9px;
  font-weight: 700;
  color: #dc2626;
  background: #fff;
  border: 1px solid #fecaca;
  border-radius: 6px;
  cursor: default;
}

.teams-remove-btn i {
  font-size: 11px;
}

.teams-ext-empty {
  margin: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-40%);
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
}

/* ----- Register (vulnerability register table) ----- */
.page-view-register-pro {
  background: #f4f6f8;
}

.register-pro-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  padding: 10px 12px 14px;
}

.register-pro-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.register-pro-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid #eef0f3;
}

.reg-sev-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.reg-sev-pill {
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 999px;
  cursor: pointer;
}

.reg-sev-pill.on {
  background: #231f40;
  border-color: #231f40;
  color: #fff;
}

.register-pro-filters-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.reg-lbl {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
}

.reg-mini-dd {
  font-size: 10px;
  font-weight: 600;
  padding: 4px 22px 4px 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  color: #334155;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 16 16'%3E%3Cpath fill='%2364748b' d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 6px center;
}

.register-pro-table-scroll {
  overflow-x: auto;
  flex-shrink: 0;
}

.register-data-table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 9px;
}

.register-data-table th {
  text-align: left;
  padding: 8px 8px;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #64748b;
  background: #fafbfc;
  border-bottom: 1px solid #e8edf3;
  white-space: nowrap;
}

.register-data-table td {
  padding: 7px 8px;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  color: #334155;
}

.reg-td-no {
  font-weight: 700;
  color: #0f172a;
}

.reg-td-vuln {
  font-weight: 600;
  color: #1e293b;
  white-space: normal;
  word-break: break-word;
  line-height: 1.35;
  max-width: 220px;
}

.reg-td-ip {
  font-weight: 600;
}

.reg-td-date,
.reg-td-dash {
  color: #64748b;
}

.reg-sev-pill-td {
  display: inline-block;
  font-size: 8px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: uppercase;
}

.reg-sev-pill-td.sev-high {
  background: #fee2e2;
  color: #991b1b;
}

.reg-sev-pill-td.sev-medium {
  background: #fef9c3;
  color: #b45309;
}

.reg-st-pill {
  display: inline-block;
  font-size: 8px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  text-transform: lowercase;
}

.reg-st-pill.st-open {
  background: #fee2e2;
  color: #b91c1c;
}

.reg-st-pill.st-closed {
  background: #d1fae5;
  color: #047857;
}

.reg-view-link {
  border: none;
  background: none;
  color: #319795;
  font-size: 9px;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
}

.register-pro-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px 10px;
  border-top: 1px solid #eef0f3;
  background: #fafbfc;
  flex-shrink: 0;
}

.register-pro-showing {
  font-size: 10px;
  font-weight: 600;
  color: #64748b;
}

.register-pro-pages {
  display: flex;
  align-items: center;
  gap: 4px;
}

.reg-page-nav {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.reg-page-num {
  min-width: 28px;
  height: 28px;
  border: none;
  border-radius: 999px;
  background: none;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  cursor: default;
}

.reg-page-num.on {
  background: #319795;
  color: #fff;
}

/* ----- Team performance (2×2 cards) ----- */
.page-view-perf-pro {
  background: #f4f6f8;
}

.perf-pro-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  padding: 12px 14px 16px;
}

.perf-pro-h2 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}

.perf-pro-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.perf-card {
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 12px;
  padding: 12px 12px 10px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.06);
  border-top: 4px solid #cbd5e1;
}

.perf-accent-blue {
  border-top-color: #3b82f6;
}

.perf-accent-green {
  border-top-color: #22c55e;
}

.perf-accent-orange {
  border-top-color: #f97316;
}

.perf-accent-red {
  border-top-color: #ef4444;
}

.perf-card-title {
  font-size: 12px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.25;
}

.perf-card-sub {
  margin-top: 2px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.perf-stats-row {
  display: flex;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #f1f5f9;
  gap: 8px;
}

.perf-stat {
  flex: 1;
  min-width: 0;
  text-align: center;
}

.perf-stat-lbl {
  display: block;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 4px;
}

.perf-stat-val {
  font-size: 16px;
  font-weight: 800;
  line-height: 1.1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.perf-val-closure {
  color: #c2410c;
}

.perf-val-closure i {
  font-size: 12px;
}

.perf-val-closed {
  color: #15803d;
}

.perf-val-open {
  color: #b91c1c;
}

.perf-sev-label {
  margin-top: 12px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #94a3b8;
}

.perf-sev-bar {
  display: flex;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-top: 6px;
  background: #f1f5f9;
}

.perf-seg {
  height: 100%;
  min-width: 2px;
}

.perf-seg.seg-c {
  background: #fecaca;
}

.perf-seg.seg-h {
  background: #fed7aa;
}

.perf-seg.seg-m {
  background: #fef08a;
}

.perf-seg.seg-l {
  background: #86efac;
}

.perf-seg.seg-empty {
  background: #e2e8f0;
}

.perf-sev-boxes {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.perf-box {
  flex: 1;
  min-width: 0;
  text-align: center;
  font-size: 12px;
  font-weight: 800;
  padding: 6px 2px;
  border-radius: 8px;
}

.perf-box-l {
  display: block;
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
  text-transform: uppercase;
}

.perf-box.crit {
  background: #fef2f2;
  color: #b91c1c;
}

.perf-box.crit .perf-box-l {
  color: #b91c1c;
}

.perf-box.high {
  background: #fff7ed;
  color: #c2410c;
}

.perf-box.high .perf-box-l {
  color: #c2410c;
}

.perf-box.med {
  background: #fefce8;
  color: #a16207;
}

.perf-box.med .perf-box-l {
  color: #a16207;
}

.perf-box.low {
  background: #ecfdf5;
  color: #047857;
}

.perf-box.low .perf-box-l {
  color: #047857;
}

/* ----- Calendar (product-style month view, May 2026 demo) ----- */
.page-view-cal-pro {
  background: #f4f6f8;
}

.cal-pro-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  background: #eef1f5;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.cal-pro-toolbar-left {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.cal-pro-dd {
  font-size: 11px;
  font-weight: 600;
  color: #334155;
  padding: 6px 28px 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  cursor: default;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 16 16'%3E%3Cpath fill='%2364748b' d='M8 11L3 6h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.cal-pro-filter-ico {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #64748b;
  cursor: default;
  font-size: 14px;
}

.cal-pro-view-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.cal-pro-view-tab {
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  padding: 6px 10px 8px;
  cursor: pointer;
  position: relative;
}

.cal-pro-view-tab.on {
  color: #0f172a;
}

.cal-pro-view-tab.on::after {
  content: '';
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 2px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, #2dd4bf, #319795);
}

.cal-pro-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  padding: 12px 14px 16px;
}

.cal-pro-month-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.cal-pro-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #fff;
  color: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  font-size: 16px;
}

.cal-pro-month-center {
  text-align: center;
  flex: 1;
  min-width: 0;
}

.cal-pro-month-title {
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.cal-pro-month-sub {
  margin-top: 2px;
  font-size: 11px;
  font-weight: 500;
  color: #94a3b8;
}

.cal-pro-grid-wrap {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.cal-pro-dow {
  padding: 8px 4px;
  text-align: center;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: #94a3b8;
  background: #fafbfc;
  border-bottom: 1px solid #e5e7eb;
}

.cal-pro-cell {
  min-height: 76px;
  padding: 4px 5px 6px;
  border-right: 1px solid #eef0f3;
  border-bottom: 1px solid #eef0f3;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 3px;
  background: #fff;
  box-sizing: border-box;
}

.cal-pro-cell:nth-child(7n) {
  border-right: none;
}

.cal-pro-cell.is-selected {
  box-shadow: inset 0 0 0 2px #0f172a;
  background: #fafafa;
  z-index: 1;
}

.cal-pro-day-num {
  font-size: 11px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.cal-pro-cell.is-muted .cal-pro-day-num {
  color: #cbd5e1;
  font-weight: 600;
}

.cal-pro-pills {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin-top: 1px;
}

.cal-pro-pill {
  font-size: 8px;
  font-weight: 700;
  line-height: 1.2;
  padding: 3px 5px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cal-pill-critical,
.cal-pill-high {
  background: #fee2e2;
  color: #991b1b;
}

.cal-pill-medium {
  background: #fef9c3;
  color: #b45309;
}

.cal-pill-low {
  background: #ccfbf1;
  color: #0f766e;
}

/* Demo cursor */
.mock-cursor {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  transition:
    left 0.75s cubic-bezier(0.4, 0, 0.2, 1),
    top 0.75s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 50;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: #319795;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cursor-ring {
  width: 20px;
  height: 20px;
  border: 2px solid #319795;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.45;
}

.mock-cursor.clicking .cursor-dot {
  background: #e53e3e;
  animation: homeClickPulse 0.28s ease;
}

.mock-cursor.clicking .cursor-ring {
  border-color: #e53e3e;
  animation: homeClickRing 0.28s ease;
}

@keyframes homeClickPulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.25);
  }
}

@keyframes homeClickRing {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.45;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.75);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.22s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.32s ease;
}

.slide-left-enter-from {
  transform: translateX(12px);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-12px);
  opacity: 0;
}

.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .dashboard-mockup {
    height: 520px;
    max-width: 100%;
  }

  .dashboard-sidebar {
    width: 82px;
  }

  .mock-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .mock-page-title {
    font-size: 13px;
  }

  /* Register + default dashboard header: title and actions stack so nothing overlaps */
  .mock-header-register-row,
  .mock-header-default-top {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .mock-header--register .mock-title-group-register,
  .mock-header-default-top .mock-title-group {
    width: 100%;
    max-width: 100%;
  }

  .mock-header--register .mock-register-header-actions,
  .mock-header-default-top .mock-register-header-actions {
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 8px;
  }

  .mock-header-register-row .mock-page-title,
  .mock-header-default-top .mock-page-title {
    font-size: 12px;
    line-height: 1.35;
  }

  .assets-split {
    flex-direction: column;
  }

  .assets-col-left {
    width: 100%;
    max-width: none;
    max-height: 38%;
    border-right: none;
    border-bottom: 1px solid #e8edf3;
  }

  .perf-pro-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .dashboard-mockup {
    height: 460px;
    border-radius: 14px;
  }

  .animated-dashboard {
    padding: 12px;
  }

  /* Very narrow: icon-only report button so bell/avatar stay clear */
  .mock-header-register-row .mock-btn-report-label,
  .mock-header-default-top .mock-btn-report-label {
    display: none;
  }

  .mock-header-register-row .mock-btn-report,
  .mock-header-default-top .mock-btn-report {
    padding: 8px 10px;
  }
}
</style>
