<template>
  <main>
    <section>
      <div class="container-fluid px-0">
        <div class="row gx-0 no-gutters">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1 ps-0 menubar-col1">
            <DashboardMenu />
          </div>

          <div class="col-11 cal-content">

            <!-- Top Bar -->
            <div class="cal-topbar">
              <div class="d-flex align-items-center gap-3 flex-wrap">
                <div class="cal-filter-select-wrap">
                  <select v-model="criticalityFilter" class="cal-filter-select">
                    <option value="All Types">All Types</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                  <i class="bi bi-chevron-down cal-filter-arrow"></i>
                </div>
                <div class="cal-filter-select-wrap">
                  <select v-model="teamsFilter" class="cal-filter-select">
                    <option value="All Units">All Units</option>
                    <option value="Network Security">Network Security</option>
                    <option value="Patch Management">Patch Management</option>
                    <option value="Configuration Management">Configuration Management</option>
                    <option value="Architectural Flaws">Architectural Flaws</option>
                  </select>
                  <i class="bi bi-chevron-down cal-filter-arrow"></i>
                </div>
                <div class="cal-filter-select-wrap">
                  <select v-model="extendedFilter" class="cal-filter-select">
                    <option value="All">Extended Deadlines</option>
                    <option value="Network Security">Network</option>
                    <option value="Patch Management">Patch</option>
                    <option value="Configuration Management">Configuration</option>
                    <option value="Architectural Flaws">Architectural</option>
                  </select>
                  <i class="bi bi-chevron-down cal-filter-arrow"></i>
                </div>
                <button class="cal-filter-icon-btn"><i class="bi bi-sliders"></i></button>
              </div>

              <div class="cal-view-tabs">
                <button v-for="view in views" :key="view" :class="['cal-tab', activeView === view ? 'cal-tab-active' : '']" @click="activeView = view">
                  {{ view }}
                </button>
              </div>


            </div>

            <!-- Page Header -->
            <div class="cal-page-header">
              <div class="d-flex align-items-center gap-3">
                <!-- Month nav -->
                <div v-if="activeView === 'Month' || activeView === 'List'" class="d-flex align-items-center gap-2">
                  <button class="cal-nav-btn" @click="prevMonth"><i class="bi bi-chevron-left"></i></button>
                  <div style="text-align:center;">
                    <h1 class="cal-month-title mb-0">{{ currentMonthName }}</h1>
                    <p class="cal-month-sub mb-0">
                      <span v-if="calendarLoading"><span class="spinner-border spinner-border-sm me-1"></span> Loading...</span>
                      <span v-else>{{ events.length }} event{{ events.length !== 1 ? 's' : '' }} this month</span>
                    </p>
                  </div>
                  <button class="cal-nav-btn" @click="nextMonth"><i class="bi bi-chevron-right"></i></button>
                </div>
                <!-- Week nav -->
                <div v-if="activeView === 'Week'" class="d-flex align-items-center gap-2">
                  <button class="cal-nav-btn" @click="prevWeek"><i class="bi bi-chevron-left"></i></button>
                  <div style="text-align:center;">
                    <h1 class="cal-month-title mb-0">Weekly View</h1>
                    <p class="cal-month-sub mb-0"><i class="bi bi-calendar3 me-1"></i>{{ weekRangeLabel }}</p>
                  </div>
                  <button class="cal-nav-btn" @click="nextWeek"><i class="bi bi-chevron-right"></i></button>
                </div>
                <!-- Day title -->
                <div v-if="activeView === 'Day'">
                  <h1 class="cal-month-title mb-0">Daily View</h1>
                </div>
              </div>
            </div>

            <!-- Day View Date Navigation Bar -->
            <div v-if="activeView === 'Day'" class="cal-day-nav-bar">
              <button class="cal-nav-btn" @click="prevDay"><i class="bi bi-chevron-left"></i></button>
              <span class="cal-day-nav-label">{{ currentDayLabel }}</span>
              <button class="cal-nav-btn" @click="nextDay"><i class="bi bi-chevron-right"></i></button>
            </div>

            <!-- MONTH Calendar Grid -->
            <div v-if="activeView === 'Month' || activeView === 'List'" class="cal-grid-wrap">
              <div class="cal-weekdays">
                <div class="cal-weekday" v-for="day in weekDays" :key="day">{{ day }}</div>
              </div>
              <div class="cal-days-grid">
                <div
                  v-for="(dayObj, idx) in calendarDays"
                  :key="idx"
                  :class="['cal-day-cell', dayObj.isToday ? 'cal-day-today' : '', dayObj.isGrey ? 'cal-day-grey' : '']"
                >
                  <span :class="['cal-day-num', !dayObj.currentMonth ? 'cal-day-num-grey' : '']">
                    {{ dayObj.day }}
                  </span>
                  <div v-for="evt in getEventsForDay(dayObj.day, dayObj.currentMonth)" :key="evt.id">
                    <span
                      :class="['cal-event-pill', 'cal-event-' + evt.color]"
                      @click.stop="openEventPopup(evt, dayObj, $event)"
                    >
                      {{ evt.isDeadlineEvent ? (
                        evt.color === 'maroon' ? 'Critical Deadline' :
                        evt.color === 'dl-blue' ? 'High Deadline' :
                        evt.color === 'dl-orange' ? 'Medium Deadline' :
                        evt.color === 'dl-green' ? 'Low Deadline' : evt.title
                      ) : (
                        (evt.isExtensionEvent && evt.team ? (
                          (evt.severityLabel || 'High') + ' Level Deadline - ' + evt.team
                        ) : (evt.team || evt.title))
                      ) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- WEEK View -->
            <div v-if="activeView === 'Week'" class="cal-week-wrap">
              <div v-if="weekLoading" class="text-center py-4 text-muted">
                <span class="spinner-border spinner-border-sm me-2"></span> Loading week...
              </div>
              <div v-else class="cal-week-grid">
                <div
                  v-for="(dayObj, idx) in currentWeekDays"
                  :key="idx"
                  :class="['cal-week-col', dayObj.isToday ? 'cal-week-col-today' : '']"
                >
                  <!-- Day header -->
                  <div class="cal-week-day-header">
                    <span class="cal-week-day-name">{{ weekDays[idx] }}</span>
                    <span :class="['cal-week-day-num', dayObj.isToday ? 'cal-week-day-num-active' : '']">{{ dayObj.day }}</span>
                  </div>
                  <!-- Events -->
                  <div class="cal-week-events">
                    <div
                      v-for="evt in getWeekApiEventsForDate(dayObj.fullDate)"
                      :key="evt.id"
                      :class="['cal-week-event-card', 'cal-week-card-' + evt.color]"
                      @click="openEventPopup(evt, dayObj, $event)"
                    >
                      <span :class="['cal-week-type-badge', 'cal-badge-' + evt.color]">
                        {{ evt.isDeadlineEvent ? (evt.severityLabel || '').toUpperCase() + ' DEADLINE' :
                           evt.isExtensionEvent ? (evt.severityLabel || '').toUpperCase() + ' - ' + (evt.team || '') : evt.type.toUpperCase() }}
                      </span>
                      <p class="cal-week-event-title">
                        {{ evt.isExtensionEvent ? (evt.vulnerabilityName || evt.title) : evt.title }}
                      </p>
                      <p v-if="evt.isExtensionEvent && evt.team" class="cal-week-event-team">
                        <i class="bi bi-people-fill me-1"></i>{{ evt.team }}
                      </p>
                      <p v-if="evt.isDeadlineEvent && evt.remainingLabel" class="cal-week-event-team">
                        <i class="bi bi-hourglass-split me-1"></i>{{ evt.remainingLabel }} remaining
                      </p>
                      <p v-if="evt.isExtensionEvent && evt.extended" class="cal-week-event-team">
                        <i class="bi bi-arrow-repeat me-1"></i>Extended: {{ evt.extended }}
                      </p>
                      <p v-if="evt.isExtensionEvent && evt.status" class="cal-week-event-team" style="text-transform:capitalize;">
                        <i class="bi bi-check-circle me-1"></i>{{ evt.status }}
                      </p>
                    </div>
                    <p v-if="getWeekApiEventsForDate(dayObj.fullDate).length === 0" class="cal-no-events">No events</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- DAY View -->
            <div v-if="activeView === 'Day'" class="cal-day-wrap">
              <div v-if="dayLoading" class="text-center py-4 text-muted">
                <span class="spinner-border spinner-border-sm me-2"></span> Loading day...
              </div>
              <div v-else class="cal-day-inner">
                <div v-for="hour in dayHourSlots" :key="hour" class="cal-day-slot">
                  <span class="cal-slot-time">{{ hour }}</span>
                  <div class="cal-slot-area">
                    <div class="cal-slot-line"></div>
                    <!-- Current time indicator -->
                    <div v-if="isCurrentHour(hour)" class="cal-current-time-row">
                      <span class="cal-current-dot"></span>
                      <span class="cal-current-line"></span>
                    </div>
                    <!-- Deadline events in this slot -->
                    <div
                      v-for="evt in getApiEventsForHour(hour, 'deadline')"
                      :key="evt.id"
                      :class="['cal-day-event-card', 'cal-day-card-' + evt.color]"
                      @click="openEventPopup(evt, {}, $event)"
                    >
                      <div class="cal-day-event-top">
                        <span :class="['cal-day-type-badge', 'cal-badge-' + evt.color]">
                          {{ evt.severityLabel ? evt.severityLabel.toUpperCase() : 'DEADLINE' }}
                        </span>
                        <span class="cal-day-time-range">Due: {{ evt.deadline }}</span>
                      </div>
                      <p class="cal-day-event-title">{{ evt.title }}</p>
                      <div class="d-flex justify-content-between align-items-center mt-1">
                        <div class="cal-day-event-team">
                          <i class="bi bi-hourglass-split me-1"></i>{{ evt.remainingLabel }} remaining
                        </div>
                        <span class="cal-day-event-status">{{ evt.status }}</span>
                      </div>
                    </div>
                    <!-- Extension events in this slot -->
                    <div
                      v-for="evt in getApiEventsForHour(hour, 'extension')"
                      :key="evt.id"
                      :class="['cal-day-event-card', 'cal-day-card-' + evt.color]"
                      @click="openEventPopup(evt, {}, $event)"
                    >
                      <div class="cal-day-event-top">
                        <span :class="['cal-day-type-badge', 'cal-badge-' + evt.color]">
                          {{ evt.severityLabel ? evt.severityLabel.toUpperCase() : 'EXT' }}
                        </span>
                        <span class="cal-day-time-range">Due: {{ evt.deadline }}</span>
                      </div>
                      <p class="cal-day-event-title">{{ evt.vulnerabilityName || evt.title }}</p>
                      <div class="d-flex justify-content-between align-items-center mt-1">
                        <div v-if="evt.team" class="cal-day-event-team">
                          <i class="bi bi-people-fill me-1"></i>{{ evt.team }}
                        </div>
                        <span
                          v-if="evt.status"
                          class="cal-day-event-status"
                          :style="{ color: evt.status === 'approved' ? '#16a34a' : evt.status === 'rejected' ? '#dc2626' : '#f97316' }"
                        >{{ evt.status }}</span>
                      </div>
                      <div v-if="evt.asset || evt.extended" class="cal-day-event-team mt-1">
                        <span v-if="evt.asset"><i class="bi bi-hdd-network me-1"></i>{{ evt.asset }}</span>
                        <span v-if="evt.extended" class="ms-2"><i class="bi bi-arrow-repeat me-1"></i>+{{ evt.extended }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- No events message -->
                <div v-if="dayEvents.length === 0 && dayExtensionEvents.length === 0" class="cal-day-no-events">
                  <i class="bi bi-calendar-check me-2"></i>No events for this day.
                </div>
              </div>
            </div>

            <!-- Detail Modal -->
            <div v-if="showDetailModal && selectedEvent" class="cal-detail-backdrop" @click.self="closeDetailModal">
              <div class="cal-detail-modal">
                <div class="cal-detail-header">
                  <div>
                    <span class="cal-popup-badge">{{ selectedEvent.type }}</span>
                    <h4 class="cal-detail-title mt-2">{{ selectedEvent.title }}</h4>
                  </div>
                  <button class="cal-popup-close" @click="closeDetailModal"><i class="bi bi-x-lg"></i></button>
                </div>

                <div class="cal-detail-body">

                  <!-- Assigned Team -->
                  <div class="cal-detail-section">
                    <p class="cal-detail-label">ASSIGNED TO TEAM</p>
                    <div class="cal-detail-team-row">
                      <div class="cal-detail-team-icon"><i class="bi bi-people-fill"></i></div>
                      <span class="cal-detail-val">{{ selectedEvent.team || 'Network Security' }}</span>
                    </div>
                  </div>

                  <!-- Historical Detail -->
                  <div class="cal-detail-section">
                    <p class="cal-detail-label">HISTORICAL DETAIL</p>
                    <div class="cal-detail-history">
                      <div class="cal-detail-history-item">
                        <span class="cal-detail-dot cal-dot-done"></span>
                        <div>
                          <p class="cal-detail-history-title">Vulnerability Identified</p>
                          <p class="cal-detail-history-sub">
                            {{ selectedEvent.historicalDetail?.vulnerability_identified
                              ? 'First detected on ' + new Date(selectedEvent.historicalDetail.vulnerability_identified).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                              : 'First detected during routine scan.' }}
                          </p>
                        </div>
                      </div>
                      <div class="cal-detail-history-item">
                        <span class="cal-detail-dot cal-dot-done"></span>
                        <div>
                          <p class="cal-detail-history-title">Assigned to Team</p>
                          <p class="cal-detail-history-sub">
                            Assigned to {{ selectedEvent.historicalDetail?.assigned_to_team || selectedEvent.team || 'Team' }}.
                          </p>
                        </div>
                      </div>
                      <div class="cal-detail-history-item">
                        <span class="cal-detail-dot cal-dot-active"></span>
                        <div>
                          <p class="cal-detail-history-title">Remediation In Progress</p>
                          <p class="cal-detail-history-sub">
                            Fix steps initiated. Deadline: {{ selectedEvent.historicalDetail?.remediation_in_progress_due || selectedEvent.deadline || '—' }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Extension Requested -->
                  <div v-if="selectedEvent.extensionRequested || selectedEvent.extended" class="cal-detail-section">
                    <p class="cal-detail-label">EXTENSION REQUESTED</p>
                    <div class="cal-detail-ext-row">
                      <i class="bi bi-arrow-repeat cal-detail-ext-icon"></i>
                      <div>
                        <p class="cal-detail-val">{{ selectedEvent.extensionRequested?.note || (selectedEvent.extended ? selectedEvent.extended + ' extension granted' : '') }}</p>
                        <p class="cal-detail-sub">{{ selectedEvent.extensionRequested?.reason || 'Original deadline extended due to team workload.' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Support Requests -->
                  <div class="cal-detail-section">
                    <p class="cal-detail-label">TOTAL SUPPORT REQUESTS</p>
                    <div v-if="supportLoading" class="text-muted small py-2">
                      <span class="spinner-border spinner-border-sm me-1"></span> Loading...
                    </div>
                    <div v-else class="cal-detail-sr-row">
                      <div class="cal-detail-sr-num">{{ supportTotal }}</div>
                      <div class="cal-detail-sr-info">
                        <p class="cal-detail-val">Support Tickets Raised</p>
                        <p class="cal-detail-sub">{{ supportPending }} Open &nbsp;•&nbsp; {{ supportClosed }} Resolved</p>
                      </div>
                      <button class="cal-detail-sr-view-btn" @click="goToSupportRequests">View</button>
                    </div>
                  </div>

                </div>

                <div class="cal-detail-footer">
                  <button class="cal-popup-dismiss" @click="closeDetailModal">Close</button>
                </div>
              </div>
            </div>

            <!-- Event Popup -->
            <div v-if="showPopup && selectedEvent" class="cal-popup-overlay" @click="closePopup">
              <div class="cal-popup" :style="{ top: popupPos.top + 'px', left: popupPos.left + 'px' }" @click.stop>
                <button class="cal-popup-close" @click="closePopup"><i class="bi bi-x-lg"></i></button>
                <span class="cal-popup-badge" :style="{
                  background: selectedEvent.isExtensionEvent ? (
                    selectedEvent.color === 'team-network' ? 'rgb(239, 246, 255)' :
                    selectedEvent.color === 'team-patch'   ? 'rgb(236, 253, 245)' :
                    selectedEvent.color === 'team-config'  ? 'rgb(255, 247, 237)' :
                    selectedEvent.color === 'team-arch'    ? 'rgb(254, 242, 242)' : '#f1f5f9'
                  ) : (
                    selectedEvent.color === 'maroon'    ? '#fee2e2' :
                    selectedEvent.color === 'dl-blue'   ? '#fff7ed' :
                    selectedEvent.color === 'dl-orange' ? '#fefce8' :
                    selectedEvent.color === 'dl-green'  ? '#f0fdf4' : '#f1f5f9'
                  ),
                  color: selectedEvent.isExtensionEvent ? (
                    selectedEvent.color === 'team-network' ? 'rgb(59, 130, 246)' :
                    selectedEvent.color === 'team-patch'   ? 'rgb(16, 185, 129)' :
                    selectedEvent.color === 'team-config'  ? 'rgb(249, 115, 22)' :
                    selectedEvent.color === 'team-arch'    ? 'rgb(220, 38, 38)' : '#475569'
                  ) : (
                    selectedEvent.color === 'maroon'    ? '#dc2626' :
                    selectedEvent.color === 'dl-blue'   ? '#f97316' :
                    selectedEvent.color === 'dl-orange' ? '#ca8a04' :
                    selectedEvent.color === 'dl-green'  ? '#16a34a' : '#475569'
                  )
                }">
                  {{ selectedEvent.isExtensionEvent ? (
                    selectedEvent.color === 'team-network' ? 'NETWORK SECURITY' :
                    selectedEvent.color === 'team-patch'   ? 'PATCH MANAGEMENT' :
                    selectedEvent.color === 'team-config'  ? 'CONFIGURATION MGMT' :
                    selectedEvent.color === 'team-arch'    ? 'ARCHITECTURAL FLAWS' : (selectedEvent.team || 'DEADLINE').toUpperCase()
                  ) : (
                    selectedEvent.color === 'maroon'    ? 'CRITICAL' :
                    selectedEvent.color === 'dl-blue'   ? 'HIGH' :
                    selectedEvent.color === 'dl-orange' ? 'MEDIUM' :
                    selectedEvent.color === 'dl-green'  ? 'LOW' : 'DEADLINE'
                  ) }}
                </span>
                <h5 class="cal-popup-title">{{ selectedEvent.vulnerabilityName || selectedEvent.title }}</h5>

                <!-- Deadline event info -->
                <div v-if="selectedEvent.isDeadlineEvent">
                  <div class="cal-popup-row">
                    <i class="bi bi-clock" style="color:#64748b;"></i>
                    <span>Due: {{ selectedEvent.deadline }}</span>
                  </div>
                  <div v-if="selectedEvent.remainingLabel" class="cal-popup-row">
                    <i class="bi bi-hourglass-split" style="color:#f97316;"></i>
                    <span>Remaining: {{ selectedEvent.remainingLabel }}</span>
                  </div>
                  <div v-if="selectedEvent.status" class="cal-popup-row">
                    <i class="bi bi-circle-fill" :style="{ color: selectedEvent.status === 'active' ? '#16a34a' : '#94a3b8', fontSize: '8px' }"></i>
                    <span style="text-transform:capitalize;">{{ selectedEvent.status }}</span>
                  </div>
                </div>

                <!-- Extension event info -->
                <div v-if="selectedEvent.isExtensionEvent">
                  <div v-if="selectedEvent.asset" class="cal-popup-row">
                    <i class="bi bi-hdd-network" style="color:#0f696e;"></i>
                    <span>Asset: {{ selectedEvent.asset }}</span>
                  </div>
                  <div v-if="selectedEvent.team" class="cal-popup-row">
                    <i class="bi bi-people-fill" style="color:#241447;"></i>
                    <span>{{ selectedEvent.team }}</span>
                  </div>
                  <div v-if="selectedEvent.deadline" class="cal-popup-row">
                    <i class="bi bi-clock" style="color:#64748b;"></i>
                    <span>Due: {{ selectedEvent.deadline }}</span>
                  </div>
                  <div v-if="selectedEvent.extended" class="cal-popup-row">
                    <i class="bi bi-arrow-repeat" style="color:#f97316;"></i>
                    <span>Extended by: {{ selectedEvent.extended }}</span>
                  </div>
                  <div v-if="selectedEvent.status" class="cal-popup-row">
                    <i class="bi bi-check-circle" :style="{ color: selectedEvent.status === 'approved' ? '#16a34a' : selectedEvent.status === 'rejected' ? '#dc2626' : '#f97316' }"></i>
                    <span style="text-transform:capitalize;">{{ selectedEvent.status }}</span>
                  </div>
                </div>

                <p v-if="selectedEvent.desc" class="cal-popup-desc">{{ selectedEvent.desc }}</p>
                <div class="cal-popup-btns">
                  <button v-if="selectedEvent.isExtensionEvent" class="cal-popup-manage" @click="openDetailModal">View</button>
                  <button class="cal-popup-dismiss" @click="closePopup">Dismiss</button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'UserCalendarView',
  components: { DashboardMenu, DashboardHeader },
  data() {
    return {
      activeView: 'Month',
      views: ['Month', 'Week', 'Day'],
      searchQuery: '',
      criticalityFilter: 'All Types',
      teamsFilter: 'All Units',
      extendedFilter: 'All',
      selectedEvent: null,
      showPopup: false,
      showDetailModal: false,
      popupPos: { top: 0, left: 0 },
      supportLoading: false,
      supportTotal: 0,
      supportPending: 0,
      supportClosed: 0,

      // ── Month view ──
      calendarLoading: false,
      apiCalendarData: null,
      events: [],
      calendarDays: [],
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth() + 1,

      // ── Week view ──
      weekLoading: false,
      weekApiData: null,
      weekEvents: [],
      currentWeekDate: new Date().toISOString().split('T')[0],
      currentWeekStart: new Date().getDate(),

      // ── Day view ──
      dayLoading: false,
      dayApiData: null,
      dayEvents: [],
      dayExtensionEvents: [],
      currentDayDate: new Date().toISOString().split('T')[0],
      currentDayLabel: new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      }),
      dayHourSlots: [
        '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
        '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
        '04:00 PM', '05:00 PM', '06:00 PM',
      ],

      weekDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    };
  },

  methods: {
    // ── Color helpers ──────────────────────────────────────────────────────────
    severityColor(sev) {
      const map = { critical: 'maroon', high: 'dl-blue', medium: 'dl-orange', low: 'dl-green' };
      return map[(sev || '').toLowerCase()] || 'dl-blue';
    },
    teamColor(team) {
      const t = (team || '').toLowerCase();
      if (t.includes('network'))       return 'team-network';
      if (t.includes('patch'))         return 'team-patch';
      if (t.includes('configuration')) return 'team-config';
      if (t.includes('architectural')) return 'team-arch';
      return 'dl-blue';
    },

    // ── Month view ─────────────────────────────────────────────────────────────
    async loadCalendarData() {
      this.calendarLoading = true;
      const store = useAuthStore();
      const team     = this.teamsFilter       !== 'All Units' ? this.teamsFilter                          : undefined;
      const severity = this.criticalityFilter !== 'All Types' ? this.criticalityFilter.toLowerCase() : undefined;
      const res = await store.fetchUserRiskCriteriaCalendarWithFilters(
        this.currentYear, this.currentMonth, team, severity,
      );
      this.calendarLoading = false;

      if (res.status && res.data) {
        this.apiCalendarData = res.data;
        const evts = [];

        // 1️⃣ Deadline events from deadlines object (critical / high / medium / low)
        const deadlines = res.data.deadlines || {};
        Object.keys(deadlines).forEach(sev => {
          const dl = deadlines[sev];
          if (!dl || !dl.deadline_date) return;
          const [yy, mm, dd] = dl.deadline_date.split('-').map(n => parseInt(n, 10));
          if (yy !== this.currentYear || mm !== this.currentMonth) return;
          const dateNum   = dd;
          const sevLabel  = sev.charAt(0).toUpperCase() + sev.slice(1);
          evts.push({
            id: `deadline-${sev}`,
            day: dateNum,
            title: `${sevLabel} Level Deadline`,
            type: 'deadline',
            color: this.severityColor(sev),
            team: null,
            deadline: dl.deadline_date,
            extended: null,
            asset: null,
            vulnerabilityName: null,
            status: dl.status || null,
            remainingDays: dl.remaining_days,
            remainingLabel: dl.remaining_label,
            isDeadlineEvent: true,
            fromApi: true,
          });
        });

        // 2️⃣ Extension events from calendar days
        const days = res.data.calendar?.days || [];
        days.forEach(dayObj => {
          const dateNum = parseInt(dayObj.date.split('-')[2]);
          dayObj.events.forEach((evt, i) => {
            evts.push({
              id: evt.request_id || `${dayObj.date}-evt-${i}`,
              day: dateNum,
              title: evt.title,
              type: 'deadline',
              color: this.teamColor(evt.assigned_to_team),
              team: evt.assigned_to_team,
              severityLabel: evt.severity ? evt.severity.charAt(0).toUpperCase() + evt.severity.slice(1) : '',
              deadline: evt.due,
              extended: evt.extended_by_days ? `${evt.extended_by_days} Days` : null,
              asset: evt.asset,
              vulnerabilityName: evt.vulnerability_name,
              status: evt.status,
              historicalDetail: evt.historical_detail,
              extensionRequested: evt.extension_requested,
              fromApi: true,
              isExtensionEvent: true,
            });
          });
        });

        this.events = evts;

        // Build calendarDays grid from API month/year
        const firstDay      = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
        const daysInMonth   = new Date(this.currentYear, this.currentMonth, 0).getDate();
        const prevMonthDays = new Date(this.currentYear, this.currentMonth - 1, 0).getDate();
        const calDays       = [];

        for (let i = firstDay - 1; i >= 0; i--) {
          calDays.push({ day: prevMonthDays - i, currentMonth: false });
        }
        const today = new Date();
        for (let d = 1; d <= daysInMonth; d++) {
          const isToday = today.getFullYear() === this.currentYear
            && today.getMonth() + 1 === this.currentMonth
            && today.getDate() === d;
          calDays.push({ day: d, currentMonth: true, isToday });
        }
        const remaining = 42 - calDays.length;
        for (let d = 1; d <= remaining; d++) {
          calDays.push({ day: d, currentMonth: false });
        }
        this.calendarDays = calDays;
      }
    },

    getEventsForDay(day, currentMonth) {
      if (!currentMonth) return [];
      let evts = this.events.filter(e => e.day === day);
      if (this.extendedFilter !== 'All') {
        evts = evts.filter(e => e.alwaysShow || e.team === this.extendedFilter);
      }
      if (this.criticalityFilter !== 'All Types') {
        evts = evts.filter(e =>
          (e.type  || '').toLowerCase().includes(this.criticalityFilter.toLowerCase()) ||
          (e.title || '').toLowerCase().includes(this.criticalityFilter.toLowerCase()) ||
          (e.color || '').includes(this.severityColor(this.criticalityFilter.toLowerCase())),
        );
      }
      return evts;
    },

    prevMonth() {
      if (this.currentMonth === 1) { this.currentMonth = 12; this.currentYear -= 1; }
      else { this.currentMonth -= 1; }
    },
    nextMonth() {
      if (this.currentMonth === 12) { this.currentMonth = 1; this.currentYear += 1; }
      else { this.currentMonth += 1; }
    },

    // ── Week view ──────────────────────────────────────────────────────────────
    async loadWeekData() {
      this.weekLoading = true;
      const store = useAuthStore();
      const res = await store.fetchUserRiskCriteriaCalendarWeek(this.currentWeekDate);
      this.weekLoading = false;

      if (res.status && res.data) {
        this.weekApiData = res.data;
        const evts = [];

        const weekDaysArr = res.data.week?.days || [];
        const weekDates   = weekDaysArr.map(d => d.date);

        // 1️⃣ Deadline events — show on their deadline_date if within this week
        const deadlines = res.data.deadlines || {};
        Object.keys(deadlines).forEach(sev => {
          const dl = deadlines[sev];
          if (!dl?.deadline_date) return;
          if (weekDates.includes(dl.deadline_date)) {
            const sevLabel = sev.charAt(0).toUpperCase() + sev.slice(1);
            evts.push({
              id: `week-deadline-${sev}`,
              fullDate: dl.deadline_date,
              title: `${sevLabel} Level Deadline`,
              type: 'deadline',
              color: this.severityColor(sev),
              severityLabel: sevLabel,
              deadline: dl.deadline_date,
              remainingDays: dl.remaining_days,
              remainingLabel: dl.remaining_days + ' day' + (dl.remaining_days !== 1 ? 's' : ''),
              status: dl.status,
              isDeadlineEvent: true,
              fromApi: true,
            });
          }
        });

        // 2️⃣ Extension events from extension_events array
        const extEvents = res.data.extension_events || [];
        extEvents.forEach((evt, i) => {
          const targetDate = weekDates.includes(evt.due) ? evt.due : (weekDates[0] || evt.due);
          evts.push({
            id: evt.request_id || `week-ext-${i}`,
            fullDate: targetDate,
            title: evt.title,
            type: 'deadline',
            color: this.teamColor(evt.assigned_to_team),
            severityLabel: evt.severity ? evt.severity.charAt(0).toUpperCase() + evt.severity.slice(1) : '',
            team: evt.assigned_to_team,
            deadline: evt.due,
            extended: evt.extended_by_days ? `${evt.extended_by_days} Days` : null,
            asset: evt.asset,
            vulnerabilityName: evt.vulnerability_name,
            status: evt.status,
            historicalDetail: evt.historical_detail,
            extensionRequested: evt.extension_requested,
            isExtensionEvent: true,
            fromApi: true,
          });
        });

        this.weekEvents = evts;
      }
    },

    getWeekApiEventsForDate(fullDate) {
      if (!fullDate) return [];
      return this.weekEvents.filter(e => e.fullDate === fullDate);
    },

    prevWeek() {
      this.currentWeekStart -= 7;
      const d = new Date(this.currentWeekDate);
      d.setDate(d.getDate() - 7);
      this.currentWeekDate = d.toISOString().split('T')[0];
      this.loadWeekData();
    },
    nextWeek() {
      this.currentWeekStart += 7;
      const d = new Date(this.currentWeekDate);
      d.setDate(d.getDate() + 7);
      this.currentWeekDate = d.toISOString().split('T')[0];
      this.loadWeekData();
    },

    // ── Day view ───────────────────────────────────────────────────────────────
    async loadDayData() {
      this.dayLoading = true;
      const store = useAuthStore();
      const res = await store.fetchUserRiskCriteriaCalendarDay(this.currentDayDate);
      this.dayLoading = false;

      // Always update label from currentDayDate
      const parts = this.currentDayDate.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      this.currentDayLabel = d.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
      });

      if (res.status && res.data) {
        this.dayApiData = res.data;
        const deadlineEvts  = [];
        const extensionEvts = [];

        const dayDate = res.data.day?.date || this.currentDayDate;

        // 1️⃣ Deadline events — only if deadline_date === this day
        const deadlines = res.data.deadlines || {};
        Object.keys(deadlines).forEach(sev => {
          const dl = deadlines[sev];
          if (!dl?.deadline_date) return;
          if (dl.deadline_date === dayDate) {
            const sevLabel = sev.charAt(0).toUpperCase() + sev.slice(1);
            deadlineEvts.push({
              id: `day-deadline-${sev}`,
              title: `${sevLabel} Level Deadline`,
              type: 'deadline',
              color: this.severityColor(sev),
              severityLabel: sevLabel,
              deadline: dl.deadline_date,
              remainingDays: dl.remaining_days,
              remainingLabel: dl.remaining_days + ' day' + (dl.remaining_days !== 1 ? 's' : ''),
              status: dl.status,
              isDeadlineEvent: true,
              fromApi: true,
            });
          }
        });

        // 2️⃣ Extension events — only from day.events (this specific day)
        const dayEvents = res.data.day?.events || [];
        dayEvents.forEach((evt, i) => {
          extensionEvts.push({
            id: evt.request_id || `day-ext-${i}`,
            title: evt.title,
            type: 'deadline',
            color: this.teamColor(evt.assigned_to_team),
            severityLabel: evt.severity ? evt.severity.charAt(0).toUpperCase() + evt.severity.slice(1) : '',
            team: evt.assigned_to_team,
            deadline: evt.due,
            extended: evt.extended_by_days ? `${evt.extended_by_days} Days` : null,
            asset: evt.asset,
            vulnerabilityName: evt.vulnerability_name,
            status: evt.status,
            historicalDetail: evt.historical_detail,
            extensionRequested: evt.extension_requested,
            isExtensionEvent: true,
            fromApi: true,
          });
        });

        this.dayEvents           = deadlineEvts;
        this.dayExtensionEvents  = extensionEvts;
      } else {
        this.dayEvents          = [];
        this.dayExtensionEvents = [];
      }
    },

    isCurrentHour(hour) {
      const now     = new Date();
      const nowHour = now.getHours();
      const slotHour = parseInt(hour);
      const isPM     = hour.includes('PM') && slotHour !== 12;
      const is12PM   = hour === '12:00 PM';
      const slotH    = isPM ? slotHour + 12 : (is12PM ? 12 : slotHour);
      return slotH === nowHour && this.currentDayDate === new Date().toISOString().split('T')[0];
    },

    getApiEventsForHour(hour, type) {
      if (type === 'deadline') {
        // Show all deadline events in the first slot
        return hour === this.dayHourSlots[0] ? this.dayEvents : [];
      }
      if (type === 'extension') {
        // Show all extension events in the second slot
        return hour === this.dayHourSlots[1] ? this.dayExtensionEvents : [];
      }
      return [];
    },

    prevDay() {
      const parts = this.currentDayDate.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      d.setDate(d.getDate() - 1);
      const y   = d.getFullYear();
      const m   = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      this.currentDayDate = `${y}-${m}-${day}`;
      this.loadDayData();
    },
    nextDay() {
      const parts = this.currentDayDate.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      d.setDate(d.getDate() + 1);
      const y   = d.getFullYear();
      const m   = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      this.currentDayDate = `${y}-${m}-${day}`;
      this.loadDayData();
    },

    // ── Shared navigation ──────────────────────────────────────────────────────
    goToToday() {
      const today = new Date();
      this.currentYear      = today.getFullYear();
      this.currentMonth     = today.getMonth() + 1;
      this.currentWeekStart = today.getDate();
      this.currentWeekDate  = today.toISOString().split('T')[0];
      this.currentDayDate   = today.toISOString().split('T')[0];
      if      (this.activeView === 'Week') this.loadWeekData();
      else if (this.activeView === 'Day')  this.loadDayData();
      else                                 this.loadCalendarData();
    },

    // ── Popup / Modal ──────────────────────────────────────────────────────────
    openEventPopup(evt, dayObj, $event) {
      this.selectedEvent = evt;
      this.showPopup     = true;
      const target = $event.currentTarget.closest('.cal-day-cell') || $event.currentTarget;
      const rect   = target.getBoundingClientRect();
      let left = rect.right + 8;
      let top  = rect.top;
      if (left + 290 > window.innerWidth - 20) left = rect.left - 298;
      if (top  + 300 > window.innerHeight)     top  = window.innerHeight - 310;
      if (top < 70) top = 70;
      this.popupPos = { top, left };
    },
    closePopup() {
      this.showPopup     = false;
      this.selectedEvent = null;
    },
    openDetailModal() {
      this.showDetailModal = true;
      this.supportTotal = 0;
      this.supportPending = 0;
      this.supportClosed = 0;
      this.fetchSupportRequests();
    },
    closeDetailModal() {
      this.showDetailModal = false;
    },
    async fetchSupportRequests() {
      if (!this.selectedEvent) return;
      this.supportLoading = true;
      const store = useAuthStore();
      const reportId = store.userLatestReportId || localStorage.getItem('reportId');
      if (reportId) {
        const res = await store.fetchUserSupportRequestsByReport(reportId, true);
        if (res.status) {
          const all = res.data || [];
          const team = this.selectedEvent.team || '';
          const filtered = team ? all.filter(r => (r.assigned_team || r.team || '').toLowerCase().includes(team.toLowerCase())) : all;
          this.supportTotal = filtered.length;
          this.supportPending = filtered.filter(r => (r.status || '').toLowerCase() === 'pending' || (r.status || '').toLowerCase() === 'open').length;
          this.supportClosed = filtered.filter(r => (r.status || '').toLowerCase() === 'closed' || (r.status || '').toLowerCase() === 'resolved').length;
        }
      }
      this.supportLoading = false;
    },
    goToSupportRequests() {
      this.showDetailModal = false;
      this.$router.push('/userexception');
    },
  },

  watch: {
    teamsFilter()       { this.loadCalendarData(); },
    criticalityFilter() { this.loadCalendarData(); },
    currentMonth()      { this.loadCalendarData(); },
    currentYear()       { this.loadCalendarData(); },
    activeView(val) {
      if      (val === 'Week')  this.loadWeekData();
      else if (val === 'Month') this.loadCalendarData();
      else if (val === 'Day')   this.loadDayData();
    },
  },

  async mounted() {
    await this.loadCalendarData();
  },

  computed: {
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth - 1, 1)
        .toLocaleString('default', { month: 'long' });
    },
    currentWeekDays() {
      const weekDaysArr = this.weekApiData?.week?.days || [];
      if (weekDaysArr.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        return weekDaysArr.map(d => ({
          day:          parseInt(d.date.split('-')[2]),
          fullDate:     d.date,
          currentMonth: true,
          isToday:      d.date === today,
        }));
      }
      // Fallback — build from currentWeekDate
      const base      = new Date(this.currentWeekDate);
      const dayOfWeek = base.getDay();
      const sunday    = new Date(base);
      sunday.setDate(base.getDate() - dayOfWeek);
      const today = new Date().toISOString().split('T')[0];
      return Array.from({ length: 7 }, (_, i) => {
        const d        = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        const fullDate = d.toISOString().split('T')[0];
        return { day: d.getDate(), fullDate, currentMonth: true, isToday: fullDate === today };
      });
    },
    weekRangeLabel() {
      if (this.weekApiData?.week) {
        return `${this.weekApiData.week.start_date} — ${this.weekApiData.week.end_date}`;
      }
      const base      = new Date(this.currentWeekDate);
      const dayOfWeek = base.getDay();
      const sunday    = new Date(base);
      sunday.setDate(base.getDate() - dayOfWeek);
      const saturday  = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);
      return `${sunday.toISOString().split('T')[0]} — ${saturday.toISOString().split('T')[0]}`;
    },
  },
};
</script>

<style scoped>
* { box-sizing: border-box; }

.cal-content {
  background: #f4f5f8;
  min-height: 100vh;
  padding: 0;
}

/* ── Top Bar ── */
.cal-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 72px 28px 16px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  gap: 20px;
  flex-wrap: wrap;
}

.cal-search-wrap { position: relative; }
.cal-search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.82rem;
  pointer-events: none;
}
.cal-search {
  background: #f1f5f9;
  border: none;
  border-radius: 999px;
  padding: 8px 16px 8px 34px;
  font-size: 0.875rem;
  color: #1e293b;
  width: 200px;
  outline: none;
}
.cal-search:focus { box-shadow: 0 0 0 2px rgba(15,105,110,0.15); }

.cal-filter-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.cal-filter-select {
  appearance: none;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 7px 32px 7px 12px;
  font-size: 0.82rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s;
}
.cal-filter-select:focus { border-color: #0f696e; }
.cal-filter-arrow {
  position: absolute;
  right: 10px;
  color: #94a3b8;
  font-size: 0.65rem;
  pointer-events: none;
}
.cal-filter-icon-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 1rem;
  transition: background 0.15s;
}
.cal-filter-icon-btn:hover { background: #f1f5f9; }

.cal-view-tabs { display: flex; gap: 4px; }
.cal-tab {
  border: none;
  background: transparent;
  padding: 8px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.cal-tab:hover { color: #1e293b; }
.cal-tab-active { color: #0f696e; border-bottom-color: #0f696e; }

.cal-icon-btn {
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  font-size: 1rem;
  transition: background 0.15s;
}
.cal-icon-btn:hover { background: #f1f5f9; }

/* ── Page Header ── */
.cal-page-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 28px 16px;
}
.cal-month-title { font-size: 1.1rem; font-weight: 800; color: #1e293b; margin: 0; }
.cal-month-sub   { font-size: 0.78rem; color: #64748b; margin: 2px 0 0; }

/* ── Nav buttons ── */
.cal-nav-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 0.85rem;
  transition: background 0.15s;
}
.cal-nav-btn:hover { background: #f1f5f9; }
.cal-today-btn {
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 7px 16px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
}
.cal-today-btn:hover { opacity: 0.88; }

/* ── Day nav bar ── */
.cal-day-nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 28px 16px;
}
.cal-day-nav-label {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

/* ── Month Calendar Grid ── */
.cal-grid-wrap {
  margin: 0 28px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fc;
  border-bottom: 1px solid #f1f5f9;
}
.cal-weekday {
  padding: 12px 8px;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
}
.cal-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.cal-day-cell {
  min-height: 110px;
  border-right: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.cal-day-cell:nth-child(7n) { border-right: none; }
.cal-day-today { border: 2px solid #1e293b !important; }
.cal-day-grey  { background: #f7f8fa; }
.cal-day-num {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 2px;
  display: block;
}
.cal-day-num-grey { color: #cbd5e1; }

/* Event pills */
.cal-event-pill {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.15s;
}
.cal-event-pill:hover { opacity: 0.8; }
.cal-event-red         { background: #fee2e2; color: #dc2626; }
.cal-event-teal        { background: #ccfbf1; color: #0f696e; }
.cal-event-purple      { background: #241447; color: #ffffff; }
.cal-event-blue        { background: #dbeafe; color: #1d4ed8; }
.cal-event-green       { background: #dcfce7; color: #15803d; }
.cal-event-orange      { background: #fff7ed; color: #ea580c; }
.cal-event-crimson     { background: #fee2e2; color: #b91c1c; }
.cal-event-maroon      { background: #f9e8ea; color: #800020; }
.cal-event-dl-blue     { background: #eff6ff; color: rgb(59, 130, 246); }
.cal-event-dl-green    { background: #ecfdf5; color: rgb(16, 185, 129); }
.cal-event-dl-orange   { background: #fff7ed; color: rgb(249, 115, 22); }
.cal-event-dl-red      { background: #fef2f2; color: rgb(220, 38, 38); }
.cal-event-team-network { background: rgb(239, 246, 255); color: rgb(59, 130, 246); }
.cal-event-team-patch   { background: rgb(236, 253, 245); color: rgb(16, 185, 129); }
.cal-event-team-config  { background: rgb(255, 247, 237); color: rgb(249, 115, 22); }
.cal-event-team-arch    { background: rgb(254, 242, 242); color: rgb(220, 38, 38); }

/* ── Event Popup ── */
.cal-popup-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: transparent;
}
.cal-popup {
  position: fixed;
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  width: 280px;
  z-index: 10000;
}
.cal-popup-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  font-size: 0.85rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 2px;
}
.cal-popup-close:hover { color: #1e293b; }
.cal-popup-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 3px 10px;
  border-radius: 4px;
  margin-bottom: 10px;
  letter-spacing: 0.06em;
}
.cal-popup-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px;
}
.cal-popup-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: #475569;
  margin-bottom: 6px;
}
.cal-popup-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.6;
  margin: 12px 0 0;
}
.cal-popup-btns {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.cal-popup-manage {
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 9px 20px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  flex: 1;
  transition: opacity 0.15s;
}
.cal-popup-manage:hover { opacity: 0.88; }
.cal-popup-dismiss {
  background: #ffffff;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 16px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.cal-popup-dismiss:hover { background: #f8f9fc; }

/* ── Detail Modal ── */
.cal-detail-backdrop {
  position: fixed; inset: 0; z-index: 10001;
  background: rgba(36,20,71,0.45);
  display: flex; align-items: center; justify-content: center;
}
.cal-detail-modal {
  background: #ffffff; border-radius: 18px;
  width: min(520px, 95vw); max-height: 85vh;
  display: flex; flex-direction: column;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  overflow: hidden;
}
.cal-detail-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 22px 24px 16px; border-bottom: 1px solid #f1f5f9;
  background: #f8f9fc;
}
.cal-detail-title { font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0; }
.cal-detail-body { flex: 1; overflow-y: auto; padding: 20px 24px; display: flex; flex-direction: column; gap: 20px; }
.cal-detail-footer { padding: 14px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }

.cal-detail-section { display: flex; flex-direction: column; gap: 8px; }
.cal-detail-label { font-size: 0.62rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin: 0; }
.cal-detail-val { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0; }
.cal-detail-sub { font-size: 0.75rem; color: #64748b; margin: 2px 0 0; }

.cal-detail-team-row { display: flex; align-items: center; gap: 10px; background: #f8f9fc; border-radius: 10px; padding: 12px 14px; }
.cal-detail-team-icon { width: 36px; height: 36px; border-radius: 50%; background: #e0f2f1; color: #0f696e; display: flex; align-items: center; justify-content: center; font-size: 1rem; }

.cal-detail-history { display: flex; flex-direction: column; gap: 12px; padding-left: 8px; }
.cal-detail-history-item { display: flex; align-items: flex-start; gap: 10px; }
.cal-detail-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
.cal-dot-done   { background: #0f696e; }
.cal-dot-active { background: #241447; }
.cal-detail-history-title { font-size: 0.82rem; font-weight: 700; color: #1e293b; margin: 0 0 2px; }
.cal-detail-history-sub   { font-size: 0.75rem; color: #64748b; margin: 0; }

.cal-detail-ext-row { display: flex; align-items: flex-start; gap: 10px; background: #fff7ed; border-radius: 10px; padding: 12px 14px; }
.cal-detail-ext-icon { color: #f97316; font-size: 1.1rem; margin-top: 2px; }

.cal-detail-sr-row { display: flex; align-items: center; gap: 14px; background: #f8f9fc; border-radius: 10px; padding: 12px 14px; }
.cal-detail-sr-num { width: 44px; height: 44px; border-radius: 50%; background: #241447; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; font-weight: 800; flex-shrink: 0; }
.cal-detail-sr-info { flex: 1; }
.cal-detail-sr-view-btn {
  background: #241447; color: #ffffff;
  border: none; border-radius: 8px;
  padding: 7px 16px; font-size: 0.82rem; font-weight: 600;
  cursor: pointer; flex-shrink: 0; transition: opacity 0.15s;
}
.cal-detail-sr-view-btn:hover { opacity: 0.85; }

/* ── Week View ── */
.cal-week-wrap {
  margin: 0 28px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.cal-week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  min-height: 500px;
  border-bottom: 1px solid #e2e8f0;
}
.cal-week-col {
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e2e8f0;
}
.cal-week-col:last-child { border-right: none; }
.cal-week-col-today { background: #fafbff; border-top: 3px solid #0f696e; }

.cal-week-day-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px 8px;
  border-bottom: 1px solid #f1f5f9;
  gap: 4px;
}
.cal-week-day-name {
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.08em;
}
.cal-week-day-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.cal-week-day-num-active {
  background: #0f696e;
  color: #ffffff;
}

.cal-week-events {
  flex: 1;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow-y: auto;
}
.cal-week-event-card {
  border-radius: 8px;
  padding: 8px 10px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.cal-week-event-card:hover { opacity: 0.85; }

/* Week card colors — severity deadlines */
.cal-week-card-maroon    { background: #f9e8ea; border-left: 3px solid #800020; }
.cal-week-card-dl-blue   { background: #eff6ff; border-left: 3px solid rgb(59, 130, 246); }
.cal-week-card-dl-orange { background: #fff7ed; border-left: 3px solid rgb(249, 115, 22); }
.cal-week-card-dl-green  { background: #ecfdf5; border-left: 3px solid rgb(16, 185, 129); }
/* Week card colors — team extension events */
.cal-week-card-team-network { background: rgb(239, 246, 255); border-left: 3px solid rgb(59, 130, 246); }
.cal-week-card-team-patch   { background: rgb(236, 253, 245); border-left: 3px solid rgb(16, 185, 129); }
.cal-week-card-team-config  { background: rgb(255, 247, 237); border-left: 3px solid rgb(249, 115, 22); }
.cal-week-card-team-arch    { background: rgb(254, 242, 242); border-left: 3px solid rgb(220, 38, 38); }
/* Fallback */
.cal-week-card-dl-blue { background: #eff6ff; border-left: 3px solid rgb(59, 130, 246); }

.cal-week-type-badge {
  display: inline-block;
  font-size: 0.58rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
}
/* Badge colors */
.cal-badge-maroon    { background: #800020; color: #fff; }
.cal-badge-dl-blue   { background: rgb(59, 130, 246); color: #fff; }
.cal-badge-dl-orange { background: rgb(249, 115, 22); color: #fff; }
.cal-badge-dl-green  { background: rgb(16, 185, 129); color: #fff; }
.cal-badge-team-network { background: rgb(59, 130, 246); color: #fff; }
.cal-badge-team-patch   { background: rgb(16, 185, 129); color: #fff; }
.cal-badge-team-config  { background: rgb(249, 115, 22); color: #fff; }
.cal-badge-team-arch    { background: rgb(220, 38, 38);  color: #fff; }

.cal-week-event-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px;
  line-height: 1.3;
}
.cal-week-event-team {
  font-size: 0.68rem;
  color: #64748b;
  margin: 0;
}
.cal-no-events {
  font-size: 0.72rem;
  color: #cbd5e1;
  text-align: center;
  margin-top: 16px;
}

/* ── Day View ── */
.cal-day-wrap {
  margin: 0 28px 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.cal-day-inner { display: flex; flex-direction: column; }
.cal-day-slot {
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #f1f5f9;
  min-height: 72px;
}
.cal-slot-time {
  width: 90px;
  flex-shrink: 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  padding: 12px 16px 0;
}
.cal-slot-area {
  flex: 1;
  position: relative;
  padding: 8px 16px 8px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cal-slot-line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: #f1f5f9;
}
.cal-current-time-row {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0; left: -4px; right: 0;
  z-index: 2;
}
.cal-current-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #0f696e;
  flex-shrink: 0;
}
.cal-current-line {
  flex: 1;
  height: 2px;
  background: #0f696e;
}

.cal-day-event-card {
  border-radius: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.cal-day-event-card:hover { opacity: 0.85; }

/* Day card colors — severity deadlines */
.cal-day-card-maroon    { background: #f9e8ea; border-left: 4px solid #800020; }
.cal-day-card-dl-blue   { background: #eff6ff; border-left: 4px solid rgb(59, 130, 246); }
.cal-day-card-dl-orange { background: #fff7ed; border-left: 4px solid rgb(249, 115, 22); }
.cal-day-card-dl-green  { background: #ecfdf5; border-left: 4px solid rgb(16, 185, 129); }
/* Day card colors — team extension events */
.cal-day-card-team-network { background: rgb(239, 246, 255); border-left: 4px solid rgb(59, 130, 246); }
.cal-day-card-team-patch   { background: rgb(236, 253, 245); border-left: 4px solid rgb(16, 185, 129); }
.cal-day-card-team-config  { background: rgb(255, 247, 237); border-left: 4px solid rgb(249, 115, 22); }
.cal-day-card-team-arch    { background: rgb(254, 242, 242); border-left: 4px solid rgb(220, 38, 38); }

.cal-day-event-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
.cal-day-type-badge {
  font-size: 0.58rem;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 0.05em;
}
.cal-day-time-range { font-size: 0.7rem; color: #64748b; }
.cal-day-event-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px;
}
.cal-day-event-team {
  font-size: 0.7rem;
  color: #64748b;
}
.cal-day-event-status {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: capitalize;
  color: #475569;
}
.cal-day-no-events {
  padding: 40px 28px;
  text-align: center;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
}

</style>
