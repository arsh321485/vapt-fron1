<template>
  <div class="animated-dashboard">
    <!-- Dashboard Container -->
    <div class="dashboard-mockup">

      <!-- Header Bar -->
      <div class="mock-header">
        <div class="mock-logo">VAPTFIX</div>
        <div class="mock-user">
          <div class="user-avatar"></div>
        </div>
      </div>

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

      <!-- Main Content Area -->
      <div class="mock-content">
        <div class="content-header">Recent Activity</div>
        <div class="activity-list">
          <div class="activity-item" v-for="i in 4" :key="i"></div>
        </div>
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

      <!-- Preview Panels -->
      <transition name="slide-left">
        <div v-if="showPreview === 'assets'" class="preview-panel assets-preview">
          <div class="preview-header">
            <i class="bi bi-shield-check me-2"></i>
            Assets Management
          </div>
          <div class="preview-content">
            <div class="preview-item" v-for="i in 5" :key="i">
              <div class="item-icon"></div>
              <div class="item-details">
                <div class="item-name"></div>
                <div class="item-meta"></div>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <transition name="slide-left">
        <div v-if="showPreview === 'support'" class="preview-panel support-preview">
          <div class="preview-header">
            <i class="bi bi-headset me-2"></i>
            Support Requests
          </div>
          <div class="preview-content">
            <div class="preview-item" v-for="i in 5" :key="i">
              <div class="item-icon support-icon"></div>
              <div class="item-details">
                <div class="item-name"></div>
                <div class="item-meta"></div>
              </div>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
export default {
  name: 'AnimatedDashboard',
  data() {
    return {
      activeCard: '',
      clickedCard: '',
      showPreview: '',
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
      // Step 1: Move cursor to Assets card
      await this.delay(1000);
      this.moveCursor(25, 35);

      await this.delay(800);
      this.activeCard = 'assets';

      // Step 2: Click Assets card
      await this.delay(600);
      this.clickCursor();
      this.clickedCard = 'assets';

      // Step 3: Show Assets preview
      await this.delay(400);
      this.showPreview = 'assets';

      // Step 4: Hold preview
      await this.delay(2500);

      // Step 5: Hide preview
      this.showPreview = '';
      this.clickedCard = '';
      this.activeCard = '';

      await this.delay(600);

      // Step 6: Move cursor to Support card
      this.moveCursor(75, 35);

      await this.delay(800);
      this.activeCard = 'support';

      // Step 7: Click Support card
      await this.delay(600);
      this.clickCursor();
      this.clickedCard = 'support';

      // Step 8: Show Support preview
      await this.delay(400);
      this.showPreview = 'support';

      // Step 9: Hold preview
      await this.delay(2500);

      // Step 10: Reset and loop
      this.showPreview = '';
      this.clickedCard = '';
      this.activeCard = '';

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
  max-width: 800px;
  height: 500px;
  background: linear-gradient(135deg, #1a1f35 0%, #0f1419 100%);
  border-radius: 20px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

/* Header */
.mock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mock-logo {
  font-size: 20px;
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

/* Stats Cards */
.mock-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
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
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
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
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Main Content */
.mock-content {
  margin-top: 20px;
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

/* Preview Panels */
.preview-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background: rgba(15, 20, 35, 0.98);
  backdrop-filter: blur(10px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  z-index: 50;
}

.preview-header {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.preview-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.support-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.item-details {
  flex: 1;
}

.item-name {
  height: 12px;
  width: 70%;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  margin-bottom: 6px;
}

.item-meta {
  height: 8px;
  width: 50%;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

/* Slide Transition */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-mockup {
    height: 400px;
  }

  .mock-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .preview-panel {
    width: 100%;
  }
}
</style>
