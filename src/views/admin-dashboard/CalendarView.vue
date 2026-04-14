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
                <div class="position-relative cal-search-wrap">
                  <i class="bi bi-search cal-search-icon"></i>
                  <input v-model="searchQuery" type="text" class="cal-search" placeholder="Search events..." />
                </div>
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
                <button class="cal-filter-icon-btn"><i class="bi bi-sliders"></i></button>
              </div>

              <div class="cal-view-tabs">
                <button v-for="view in views" :key="view" :class="['cal-tab', activeView === view ? 'cal-tab-active' : '']" @click="activeView = view">
                  {{ view }}
                </button>
              </div>

              <div class="d-flex align-items-center gap-3">
                <button class="cal-icon-btn"><i class="bi bi-bell"></i></button>
                <button class="cal-icon-btn"><i class="bi bi-clock-history"></i></button>
              </div>
            </div>

            <!-- Page Header -->
            <div class="cal-page-header">
              <div v-if="activeView === 'Week'">
                <h1 class="cal-month-title">Weekly View</h1>
                <p class="cal-month-sub"><i class="bi bi-calendar3 me-1"></i>{{ weekRangeLabel }}</p>
              </div>
              <div v-else-if="activeView === 'Day'">
                <h1 class="cal-month-title">Daily View</h1>
              </div>
              <div v-else>
                <h1 class="cal-month-title">April 2026</h1>
                <p class="cal-month-sub">12 Critical Deadlines Remaining</p>
              </div>
              <div class="d-flex align-items-center gap-3">
                <!-- Week nav -->
                <div v-if="activeView === 'Week'" class="d-flex align-items-center gap-2">
                  <button class="cal-nav-btn" @click="prevWeek"><i class="bi bi-chevron-left"></i></button>
                  <button class="cal-today-btn" @click="goToToday">Today</button>
                  <button class="cal-nav-btn" @click="nextWeek"><i class="bi bi-chevron-right"></i></button>
                </div>
                <!-- Legend (month view) -->
                <div v-else-if="activeView !== 'Day'" class="cal-legend">
                  <div class="cal-legend-item"><span class="cal-legend-dot" style="background:#241447;"></span> Scheduled Scan</div>
                  <div class="cal-legend-item"><span class="cal-legend-dot" style="background:#dc2626;"></span> Deadline</div>
                  <div class="cal-legend-item"><span class="cal-legend-dot" style="background:#0f696e;"></span> Discovery</div>
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
                  :class="['cal-day-cell', dayObj.isToday ? 'cal-day-today' : '']"
                >
                  <span :class="['cal-day-num', !dayObj.currentMonth ? 'cal-day-num-grey' : '']">
                    {{ dayObj.day }}
                  </span>
                  <div v-for="evt in getEventsForDay(dayObj.day, dayObj.currentMonth)" :key="evt.id">
                    <span
                      :class="['cal-event-pill', 'cal-event-' + evt.color]"
                      @click.stop="openEventPopup(evt, dayObj, $event)"
                    >
                      {{ evt.title }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- WEEK View -->
            <div v-if="activeView === 'Week'" class="cal-week-wrap">
              <div class="cal-week-grid">
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
                      v-for="evt in getWeekEventsForDay(dayObj.day)"
                      :key="evt.id"
                      :class="['cal-week-event-card', 'cal-week-card-' + evt.color]"
                      @click="openEventPopup(evt, dayObj, $event)"
                    >
                      <span :class="['cal-week-type-badge', 'cal-badge-' + evt.color]">{{ evt.type.toUpperCase() }}</span>
                      <p class="cal-week-event-title">{{ evt.title }}</p>
                      <p v-if="evt.team" class="cal-week-event-team">Team: {{ evt.team }}</p>
                    </div>
                    <p v-if="getWeekEventsForDay(dayObj.day).length === 0" class="cal-no-events">No events</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- DAY View -->
            <div v-if="activeView === 'Day'" class="cal-day-wrap">

              <div class="cal-day-inner">
                <div v-for="hour in dayHours" :key="hour" class="cal-day-slot">
                  <span class="cal-slot-time">{{ hour }}</span>
                  <div class="cal-slot-area">
                    <div class="cal-slot-line"></div>
                    <div v-if="hour === '11:00 AM'" class="cal-current-time-row">
                      <span class="cal-current-dot"></span>
                      <span class="cal-current-line"></span>
                    </div>
                    <div v-for="evt in getDayEventsForHour(hour)" :key="evt.id" :class="['cal-day-event-card', 'cal-day-card-' + evt.color]">
                      <div class="cal-day-event-top">
                        <span :class="['cal-day-type-badge', 'cal-badge-' + evt.color]">{{ evt.type }}</span>
                        <span class="cal-day-time-range">{{ evt.timeRange }}</span>
                      </div>
                      <p class="cal-day-event-title">{{ evt.title }}</p>
                      <div v-if="evt.team" class="cal-day-event-team">
                        <i class="bi bi-people-fill me-1"></i>Team: {{ evt.team }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Event Popup -->
            <div v-if="showPopup && selectedEvent" class="cal-popup-overlay" @click="closePopup">
              <div class="cal-popup" :style="{ top: popupPos.top + 'px', left: popupPos.left + 'px' }" @click.stop>
                <button class="cal-popup-close" @click="closePopup"><i class="bi bi-x-lg"></i></button>
                <span class="cal-popup-badge">CRITICAL</span>
                <h5 class="cal-popup-title">Critical Patch Deadline</h5>
                <div class="cal-popup-row">
                  <i class="bi bi-hdd-network" style="color:#0f696e;"></i>
                  <span>Asset: 192.168.1.104</span>
                </div>
                <div class="cal-popup-row">
                  <i class="bi bi-clock" style="color:#64748b;"></i>
                  <span>Due: April 12, 5:00 PM</span>
                </div>
                <p class="cal-popup-desc">
                  Unpatched Buffer Overflow vulnerability in core firmware. Exploitation confirmed in external environments.
                </p>
                <div class="cal-popup-btns">
                  <button class="cal-popup-manage">Manage</button>
                  <button class="cal-popup-dismiss" @click="closePopup">Dismiss</button>
                </div>
              </div>
            </div>

            <!-- Bottom Stats -->
            <div class="cal-stats-row">
              <div v-for="(stat, i) in stats" :key="i" class="cal-stat-card" :style="{ borderLeftColor: stat.border }">
                <div class="cal-stat-icon" :style="{ background: stat.iconBg }">
                  <i :class="'bi ' + stat.icon" :style="{ color: stat.iconColor }"></i>
                </div>
                <div>
                  <div class="cal-stat-value">{{ stat.value }}</div>
                  <div class="cal-stat-label">{{ stat.label }}</div>
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
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';

export default {
  name: 'CalendarView',
  components: { DashboardMenu, DashboardHeader },
  data() {
    return {
      activeView: 'Week',
      views: ['Month', 'Week', 'Day'],
      searchQuery: '',
      criticalityFilter: 'All Types',
      teamsFilter: 'All Units',
      selectedEvent: null,
      showPopup: false,
      popupPos: { top: 0, left: 0 },
      weekDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      currentWeekStart: 12,
      currentDayLabel: 'Wednesday, April 15, 2026',
      dayHours: [
        '08:00 AM','09:00 AM','10:00 AM','11:00 AM',
        '12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM',
      ],
      dayEvents: [
        { id: 1, type: 'CRITICAL',   color: 'red',  title: 'Critical Patch: OpenSSL Vulnerability',   timeRange: '10:00 AM - 12:00 PM', team: 'Network Security',  startHour: '10:00 AM', topPx: 140, heightPx: 130 },
        { id: 2, type: 'DISCOVERY',  color: 'teal', title: 'Asset Discovery: New Cloud Instance Scan', timeRange: '2:00 PM - 3:30 PM',   team: 'Patch Management',  startHour: '02:00 PM', topPx: 410, heightPx: 110 },
      ],
      weekEventsData: [
        { id: 1,  day: 12, title: 'Routine Asset Scan',       type: 'DISCOVERY', color: 'teal',   team: null },
        { id: 2,  day: 13, title: 'Log4j Remediation',        type: 'CRITICAL',  color: 'red',    team: null },
        { id: 3,  day: 14, title: 'Internal Compliance',      type: 'AUDIT',     color: 'purple', team: null },
        { id: 4,  day: 15, title: 'OpenSSL Vulnerability',    type: 'CRITICAL PATCH', color: 'red',  team: 'Network Security' },
        { id: 5,  day: 15, title: 'New Cloud Instance Scan',  type: 'ASSET DISCOVERY', color: 'teal', team: 'Patch Management' },
        { id: 6,  day: 16, title: 'Quarterly Review',         type: 'PENDING',   color: 'grey',   team: null },
        { id: 7,  day: 17, title: 'Firewall Rule Audit',      type: 'NETWORK',   color: 'teal',   team: null },
      ],
      events: [
        { id: 1,  day: 1,  title: 'CVE-2026-1029',   type: 'discovery', color: 'teal'   },
        { id: 2,  day: 3,  title: 'Weekly Audit',     type: 'scan',      color: 'purple' },
        { id: 3,  day: 8,  title: 'Critical Patch',   type: 'deadline',  color: 'red'    },
        { id: 4,  day: 10, title: 'External Scan',    type: 'scan',      color: 'purple' },
        { id: 5,  day: 12, title: 'Critical Patch',   type: 'deadline',  color: 'red'    },
        { id: 6,  day: 12, title: '3 New Vulns',      type: 'discovery', color: 'teal'   },
        { id: 7,  day: 15, title: 'Asset Discovery',  type: 'discovery', color: 'teal'   },
        { id: 8,  day: 17, title: 'Monthly Report',   type: 'scan',      color: 'purple' },
        { id: 9,  day: 22, title: 'CVE Discovery',    type: 'discovery', color: 'teal'   },
        { id: 10, day: 24, title: 'Internal Audit',   type: 'scan',      color: 'purple' },
        { id: 11, day: 29, title: 'Deadline: HQ-X2',  type: 'deadline',  color: 'red'    },
      ],
      calendarDays: [
        { day: 29, currentMonth: false },
        { day: 30, currentMonth: false },
        { day: 31, currentMonth: false },
        { day: 1,  currentMonth: true  },
        { day: 2,  currentMonth: true  },
        { day: 3,  currentMonth: true  },
        { day: 4,  currentMonth: true  },
        { day: 5,  currentMonth: true  },
        { day: 6,  currentMonth: true  },
        { day: 7,  currentMonth: true  },
        { day: 8,  currentMonth: true  },
        { day: 9,  currentMonth: true  },
        { day: 10, currentMonth: true  },
        { day: 11, currentMonth: true  },
        { day: 12, currentMonth: true, isToday: true },
        { day: 13, currentMonth: true  },
        { day: 14, currentMonth: true  },
        { day: 15, currentMonth: true  },
        { day: 16, currentMonth: true  },
        { day: 17, currentMonth: true  },
        { day: 18, currentMonth: true  },
        { day: 19, currentMonth: true  },
        { day: 20, currentMonth: true  },
        { day: 21, currentMonth: true  },
        { day: 22, currentMonth: true  },
        { day: 23, currentMonth: true  },
        { day: 24, currentMonth: true  },
        { day: 25, currentMonth: true  },
        { day: 26, currentMonth: true  },
        { day: 27, currentMonth: true  },
        { day: 28, currentMonth: true  },
        { day: 29, currentMonth: true  },
        { day: 30, currentMonth: true  },
        { day: 1,  currentMonth: false },
        { day: 2,  currentMonth: false },
      ],
      stats: [
        { value: '08',    label: 'CRITICAL DEADLINES THIS WEEK', icon: 'bi-exclamation-triangle-fill', iconBg: '#fee2e2', iconColor: '#dc2626', border: '#dc2626' },
        { value: '24',    label: 'NEW VULNERABILITIES TODAY',    icon: 'bi-patch-check-fill',          iconBg: '#e0f2f1', iconColor: '#0f696e', border: '#0f696e' },
        { value: '98.2%', label: 'ASSET COVERAGE SCAN',         icon: 'bi-cpu-fill',                  iconBg: '#241447', iconColor: '#ffffff', border: '#7c3aed' },
      ],
    };
  },
  methods: {
    getEventsForDay(day, currentMonth) {
      if (!currentMonth) return [];
      return this.events.filter(e => e.day === day);
    },
    getDayEventsForHour(hour) {
      return this.dayEvents.filter(e => e.startHour === hour);
    },
    prevDay() { this.currentDayLabel = 'Tuesday, April 14, 2026'; },
    nextDay() { this.currentDayLabel = 'Thursday, April 16, 2026'; },
    getWeekEventsForDay(day) {
      return this.weekEventsData.filter(e => e.day === day);
    },
    prevWeek() {
      this.currentWeekStart -= 7;
    },
    nextWeek() {
      this.currentWeekStart += 7;
    },
    goToToday() {
      this.currentWeekStart = 12;
    },
    openEventPopup(evt, dayObj, $event) {
      this.selectedEvent = evt;
      this.showPopup = true;
      const rect = $event.currentTarget.closest('.cal-day-cell').getBoundingClientRect();
      let left = rect.right + 8;
      let top  = rect.top;
      if (left + 290 > window.innerWidth - 20) {
        left = rect.left - 298;
      }
      if (top + 300 > window.innerHeight) {
        top = window.innerHeight - 310;
      }
      if (top < 70) top = 70;
      this.popupPos = { top, left };
    },
    closePopup() {
      this.showPopup = false;
      this.selectedEvent = null;
    },
  },
  computed: {
    dayViewTitle() {
      return this.currentDayLabel;
    },
    currentWeekDays() {
      return Array.from({ length: 7 }, (_, i) => {
        const day = this.currentWeekStart + i;
        return { day, currentMonth: true, isToday: day === 12 };
      });
    },
    weekRangeLabel() {
      const start = this.currentWeekStart;
      const end = start + 6;
      return `April ${start} - ${end}, 2026`;
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

/* Filter selects */
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

.cal-export-btn {
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 8px 20px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: opacity 0.15s;
}
.cal-export-btn:hover { opacity: 0.88; }

.cal-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #241447;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 700;
}

/* ── Page Header ── */
.cal-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 28px 16px;
}
.cal-month-title { font-size: 2rem; font-weight: 800; color: #1e293b; margin: 0; }
.cal-month-sub   { font-size: 0.875rem; color: #64748b; margin: 4px 0 0; }

.cal-legend { display: flex; gap: 16px; align-items: center; }
.cal-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #475569;
}
.cal-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* ── Calendar Grid ── */
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

.cal-day-today {
  border: 2px solid #1e293b !important;
}

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
.cal-event-red    { background: #fee2e2; color: #dc2626; }
.cal-event-teal   { background: #ccfbf1; color: #0f696e; }
.cal-event-purple { background: #241447; color: #ffffff; }

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
  background: #dc2626;
  color: #ffffff;
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
  padding: 14px 10px 10px;
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: #f8f9fc;
}
.cal-week-day-name {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.cal-week-day-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}
.cal-week-day-num-active {
  background: #241447;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.cal-week-events {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.cal-week-event-card {
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: opacity 0.15s;
}
.cal-week-event-card:hover { opacity: 0.85; }
.cal-week-card-red    { background: #fff0f0; border-left: 3px solid #dc2626; }
.cal-week-card-teal   { background: #f0fdf9; border-left: 3px solid #0f696e; }
.cal-week-card-purple { background: #f3f0ff; border-left: 3px solid #241447; }
.cal-week-card-grey   { background: #f8f9fc; border-left: 3px solid #94a3b8; }

.cal-week-type-badge {
  display: inline-block;
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 5px;
  text-transform: uppercase;
}
.cal-badge-red    { background: #fee2e2; color: #dc2626; }
.cal-badge-teal   { background: #ccfbf1; color: #0f696e; }
.cal-badge-purple { background: #ede9fe; color: #241447; }
.cal-badge-grey   { background: #f1f5f9; color: #64748b; }

.cal-week-event-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px;
  line-height: 1.3;
}
.cal-week-event-team {
  font-size: 0.68rem;
  color: #94a3b8;
  margin: 0;
}
.cal-no-events {
  font-size: 0.75rem;
  color: #cbd5e1;
  text-align: center;
  margin-top: 20px;
}

/* Nav buttons */
.cal-nav-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #475569;
  font-size: 0.82rem;
  transition: background 0.15s;
}
.cal-nav-btn:hover { background: #f1f5f9; }
.cal-today-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  transition: background 0.15s;
}
.cal-today-btn:hover { background: #f1f5f9; }

/* Day nav bar */
.cal-day-nav-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 10px 28px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  margin: 0 28px 0;
  border-radius: 12px 12px 0 0;
  border: 1px solid #e2e8f0;
  border-bottom: none;
}
.cal-day-nav-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  min-width: 220px;
  text-align: center;
}

/* ── Day View ── */
.cal-day-wrap {
  margin: 0 28px 24px;
  background: #ffffff;
  border-radius: 0 0 16px 16px;
  border: 1px solid #e2e8f0;
  border-top: none;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.cal-day-subheader {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8f9fc;
}
.cal-day-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}
.cal-day-inner {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #ffffff;
}
.cal-day-slot {
  display: flex;
  align-items: flex-start;
  min-height: 70px;
  border-bottom: 1px solid #e2e8f0;
}
.cal-slot-time {
  width: 100px;
  flex-shrink: 0;
  padding: 10px 16px 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
  text-align: right;
  background: #ffffff;
}
.cal-slot-area {
  flex: 1;
  position: relative;
  padding: 8px 16px 8px 20px;
  border-left: 1px solid #cbd5e1;
  min-height: 70px;
  background: #ffffff;
}
.cal-slot-line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 1px;
  background: #e2e8f0;
}
.cal-current-time-row {
  display: flex;
  align-items: center;
  position: absolute;
  top: 35px;
  left: 0;
  right: 0;
  z-index: 2;
}
.cal-current-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #dc2626;
  flex-shrink: 0;
  margin-left: -5px;
}
.cal-current-line {
  flex: 1;
  height: 2px;
  background: #dc2626;
}
.cal-day-event-card {
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: opacity 0.15s;
  width: 100%;
}
.cal-day-event-card:hover { opacity: 0.85; }
.cal-day-card-red  { background: #fef2f2; border-left: 4px solid #dc2626; }
.cal-day-card-teal { background: #f0fdf9; border-left: 4px solid #0f696e; }
.cal-day-event-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}
.cal-day-type-badge {
  display: inline-block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
}
.cal-day-time-range {
  font-size: 0.72rem;
  font-weight: 600;
  color: #94a3b8;
}
.cal-day-event-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
}
.cal-day-event-team {
  font-size: 0.78rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ── Bottom Stats ── */
.cal-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 0 28px 40px;
}
.cal-stat-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  border-left: 4px solid;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.cal-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.cal-stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}
.cal-stat-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
</style>
