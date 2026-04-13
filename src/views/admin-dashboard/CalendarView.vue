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
              <div class="position-relative cal-search-wrap">
                <i class="bi bi-search cal-search-icon"></i>
                <input v-model="searchQuery" type="text" class="cal-search" placeholder="Search events..." />
              </div>

              <div class="cal-view-tabs">
                <button v-for="view in views" :key="view" :class="['cal-tab', activeView === view ? 'cal-tab-active' : '']" @click="activeView = view">
                  {{ view }}
                </button>
              </div>

              <div class="d-flex align-items-center gap-3">
                <button class="cal-icon-btn"><i class="bi bi-bell"></i></button>
                <button class="cal-icon-btn"><i class="bi bi-clock-history"></i></button>
                <button class="cal-export-btn"><i class="bi bi-download me-1"></i>Export</button>
                <div class="cal-avatar">D</div>
              </div>
            </div>

            <!-- Page Header -->
            <div class="cal-page-header">
              <div>
                <h1 class="cal-month-title">April 2026</h1>
                <p class="cal-month-sub">12 Critical Deadlines Remaining</p>
              </div>
              <div class="cal-legend">
                <div class="cal-legend-item">
                  <span class="cal-legend-dot" style="background:#241447;"></span> Scheduled Scan
                </div>
                <div class="cal-legend-item">
                  <span class="cal-legend-dot" style="background:#dc2626;"></span> Deadline
                </div>
                <div class="cal-legend-item">
                  <span class="cal-legend-dot" style="background:#0f696e;"></span> Discovery
                </div>
              </div>
            </div>

            <!-- Calendar Grid -->
            <div class="cal-grid-wrap">
              <!-- Weekday headers -->
              <div class="cal-weekdays">
                <div class="cal-weekday" v-for="day in weekDays" :key="day">{{ day }}</div>
              </div>

              <!-- Days grid -->
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
      views: ['Month', 'Week', 'Day', 'List'],
      searchQuery: '',
      selectedEvent: null,
      showPopup: false,
      popupPos: { top: 0, left: 0 },
      weekDays: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
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
    openEventPopup(evt, dayObj, $event) {
      this.selectedEvent = evt;
      this.showPopup = true;
      const rect = $event.currentTarget.closest('.cal-day-cell').getBoundingClientRect();
      let left = rect.right + 8;
      let top  = rect.top + window.scrollY - 20;
      if (left + 310 > window.innerWidth - 20) {
        left = rect.left - 318;
      }
      if (top + 320 > window.scrollY + window.innerHeight) {
        top = window.scrollY + window.innerHeight - 340;
      }
      this.popupPos = { top, left };
    },
    closePopup() {
      this.showPopup = false;
      this.selectedEvent = null;
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
  position: absolute;
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
