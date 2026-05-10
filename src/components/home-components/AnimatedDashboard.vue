<template>
  <div class="animated-dashboard">
    <!-- Dashboard Container -->
    <div class="dashboard-mockup">

      <!-- Sidebar (Left Navigation) -->
      <div class="dashboard-sidebar">
        <div class="sidebar-item" :class="{ active: currentPage === 'dashboard' }">
          <i class="bi bi-grid-fill"></i>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'calendar' }">
          <i class="bi bi-calendar3"></i>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'assets' }">
          <i class="bi bi-shield-check"></i>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'support' }">
          <i class="bi bi-headset"></i>
        </div>
        <div class="sidebar-item" :class="{ active: currentPage === 'team' }">
          <i class="bi bi-people"></i>
        </div>
        <div class="sidebar-item">
          <i class="bi bi-gear"></i>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="dashboard-main">
        <!-- Header Bar -->
        <div class="mock-header">
          <div class="mock-logo">VAPTFIX</div>
          <div class="mock-user">
            <div class="user-avatar"></div>
          </div>
        </div>

        <!-- Dashboard Home View -->
        <transition name="fade">
          <div v-if="currentPage === 'dashboard'" class="dashboard-home-content">
            <!-- Stats Cards -->
            <div class="mock-stats">
              <div
                class="stat-card assets-card"
                :class="{ active: activeCard === 'assets', clicked: clickedCard === 'assets' }"
              >
                <div class="stat-icon">
                  <i class="bi bi-shield-check"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">156</div>
                  <div class="stat-label">Assets</div>
                </div>
              </div>

              <div
                class="stat-card users-card"
                :class="{ active: activeCard === 'users' }"
              >
                <div class="stat-icon">
                  <i class="bi bi-people"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">45</div>
                  <div class="stat-label">Users</div>
                </div>
              </div>

              <div
                class="stat-card support-card"
                :class="{ active: activeCard === 'support', clicked: clickedCard === 'support' }"
              >
                <div class="stat-icon">
                  <i class="bi bi-headset"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">12</div>
                  <div class="stat-label">Support Requests</div>
                </div>
              </div>

              <div
                class="stat-card vulns-card"
                :class="{ active: activeCard === 'vulnerabilities' }"
              >
                <div class="stat-icon">
                  <i class="bi bi-exclamation-triangle"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">23</div>
                  <div class="stat-label">Vulnerabilities</div>
                </div>
              </div>
            </div>

            <!-- Main Content -->
            <div class="mock-content">
              <div class="content-header">Recent Activity</div>
              <div class="activity-list">
                <div class="activity-item" v-for="i in 4" :key="i"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Assets Page View -->
        <transition name="slide-left">
          <div v-if="currentPage === 'assets'" class="page-view assets-page">
            <div class="page-header">
              <i class="bi bi-shield-check me-2"></i>
              <h3>Assets Management</h3>
              <span class="ms-auto badge-count">156 Assets</span>
            </div>
            <div class="page-content">
              <div class="asset-item" v-for="i in 8" :key="i">
                <div class="asset-icon"></div>
                <div class="asset-details">
                  <div class="asset-name"></div>
                  <div class="asset-meta"></div>
                </div>
                <div class="asset-status"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Support Requests Page View -->
        <transition name="slide-left">
          <div v-if="currentPage === 'support'" class="page-view support-page">
            <div class="page-header">
              <i class="bi bi-headset me-2"></i>
              <h3>Support Requests</h3>
              <span class="ms-auto badge-count">12 Tickets</span>
            </div>
            <div class="page-content">
              <div class="support-item" v-for="i in 6" :key="i">
                <div class="support-icon"></div>
                <div class="support-details">
                  <div class="support-title"></div>
                  <div class="support-meta"></div>
                </div>
                <div class="support-priority"></div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Calendar Page View -->
        <transition name="slide-left">
          <div v-if="currentPage === 'calendar'" class="page-view calendar-page">
            <div class="page-header">
              <i class="bi bi-calendar3 me-2"></i>
              <h3>Remediation Calendar</h3>
              <span class="ms-auto badge-count">June 2024</span>
            </div>
            <div class="page-content">
              <div class="calendar-grid">
                <div class="calendar-day-header" v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day">
                  {{ day }}
                </div>
                <div class="calendar-day" v-for="i in 30" :key="i"
                  :class="{ 'has-event': [5, 12, 18, 23, 27].includes(i), 'today': i === 15 }">
                  <div class="day-number">{{ i }}</div>
                  <div v-if="[5, 12, 18, 23, 27].includes(i)" class="day-event"></div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Animated Cursor -->
      <div
        class="mock-cursor"
        :style="cursorStyle"
        :class="{ clicking: isCursorClicking }"
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
      activeCard: '',
      clickedCard: '',
      cursorX: 50,
      cursorY: 50,
      isCursorClicking: false,
      animationStep: 0
    };
  },
  computed: {
    cursorStyle() {
      return {
        left: `${this.cursorX}%`,
        top: `${this.cursorY}%`
      };
    }
  },
  mounted() {
    this.startAnimation();
  },
  beforeUnmount() {
    if (this.animationTimer) {
      clearTimeout(this.animationTimer);
    }
  },
  methods: {
    startAnimation() {
      this.runAnimationSequence();
    },

    async runAnimationSequence() {
      // Reset to dashboard
      this.currentPage = 'dashboard';

      // Step 1: Move cursor to Assets card
      await this.delay(1000);
      this.moveCursor(30, 35);

      await this.delay(800);
      this.activeCard = 'assets';

      // Step 2: Click Assets card
      await this.delay(600);
      this.clickCursor();
      this.clickedCard = 'assets';

      // Step 3: Navigate to Assets page
      await this.delay(400);
      this.currentPage = 'assets';

      // Step 4: Hold on Assets page
      await this.delay(2500);

      // Step 5: Go back to dashboard
      this.currentPage = 'dashboard';
      this.clickedCard = '';
      this.activeCard = '';

      await this.delay(800);

      // Step 6: Move cursor to Support card
      this.moveCursor(70, 35);

      await this.delay(800);
      this.activeCard = 'support';

      // Step 7: Click Support card
      await this.delay(600);
      this.clickCursor();
      this.clickedCard = 'support';

      // Step 8: Navigate to Support page
      await this.delay(400);
      this.currentPage = 'support';

      // Step 9: Hold on Support page
      await this.delay(2500);

      // Step 10: Go back to dashboard
      this.currentPage = 'dashboard';
      this.clickedCard = '';
      this.activeCard = '';

      await this.delay(800);

      // Step 11: Move cursor to Calendar sidebar icon
      this.moveCursor(8, 25);

      await this.delay(800);

      // Step 12: Click Calendar
      this.clickCursor();

      // Step 13: Navigate to Calendar page
      await this.delay(400);
      this.currentPage = 'calendar';

      // Step 14: Hold on Calendar page
      await this.delay(2500);

      // Step 15: Reset and loop
      this.currentPage = 'dashboard';

      await this.delay(1000);

      // Loop animation
      this.runAnimationSequence();
    },

    moveCursor(x, y) {
      this.cursorX = x;
      this.cursorY = y;
    },

    clickCursor() {
      this.isCursorClicking = true;
      setTimeout(() => {
        this.isCursorClicking = false;
      }, 300);
    },

    delay(ms) {
      return new Promise(resolve => {
        this.animationTimer = setTimeout(resolve, ms);
      });
    }
  }
};
</script>

<style scoped>
.animated-dashboard {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.dashboard-mockup {
  width: 100%;
  max-width: 920px;
  height: 600px;
  background: linear-gradient(135deg, #1a1f35 0%, #0f1419 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  display: flex;
}

/* Sidebar */
.dashboard-sidebar {
  width: 60px;
  background: rgba(0, 0, 0, 0.3);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  gap: 8px;
  flex-shrink: 0;
}

.sidebar-item {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar-item:hover {
  color: rgba(255, 255, 255, 0.9);
}

.sidebar-item.active {
  color: #667eea;
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  width: 3px;
  height: 100%;
  background: #667eea;
  border-radius: 0 3px 3px 0;
}

/* Main Content Area */
.dashboard-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* Header */
.mock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.mock-logo {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Dashboard Home Content */
.dashboard-home-content {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

/* Stats Cards */
.mock-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.stat-card.active {
  background: rgba(102, 126, 234, 0.15);
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.stat-card.clicked {
  transform: scale(0.98) translateY(-4px);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.assets-card .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.users-card .stat-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.support-card .stat-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: #fff;
}

.vulns-card .stat-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Main Content */
.mock-content {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
}

.content-header {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-item {
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

/* Page Views */
.page-view {
  position: absolute;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #1a1f35 0%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}

.page-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.badge-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.page-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* Assets Page */
.asset-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
}

.asset-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.asset-details {
  flex: 1;
}

.asset-name {
  height: 14px;
  width: 60%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 6px;
}

.asset-meta {
  height: 10px;
  width: 40%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.asset-status {
  width: 60px;
  height: 24px;
  background: rgba(102, 234, 147, 0.2);
  border-radius: 12px;
}

/* Support Page */
.support-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin-bottom: 10px;
}

.support-icon {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.support-details {
  flex: 1;
}

.support-title {
  height: 14px;
  width: 70%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 6px;
}

.support-meta {
  height: 10px;
  width: 50%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.support-priority {
  width: 50px;
  height: 24px;
  background: rgba(234, 102, 102, 0.2);
  border-radius: 12px;
}

/* Calendar Page */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
}

.calendar-day-header {
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  padding: 8px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-day {
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 6px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.2s ease;
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.calendar-day.today {
  background: rgba(102, 126, 234, 0.2);
  border-color: #667eea;
}

.calendar-day.has-event {
  background: rgba(102, 234, 147, 0.1);
  border-color: rgba(102, 234, 147, 0.3);
}

.day-number {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 4px;
}

.calendar-day.today .day-number {
  color: #667eea;
}

.day-event {
  width: 6px;
  height: 6px;
  background: #66ea93;
  border-radius: 50%;
  margin-top: auto;
}

/* Animated Cursor */
.mock-cursor {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cursor-ring {
  width: 20px;
  height: 20px;
  border: 2px solid #667eea;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

.mock-cursor.clicking .cursor-dot {
  background: #ff6b6b;
  animation: clickPulse 0.3s ease;
}

.mock-cursor.clicking .cursor-ring {
  border-color: #ff6b6b;
  animation: clickRing 0.3s ease;
}

@keyframes clickPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.3); }
}

@keyframes clickRing {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Scrollbar */
.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.page-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-mockup {
    height: 500px;
  }

  .dashboard-sidebar {
    width: 50px;
  }

  .mock-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
