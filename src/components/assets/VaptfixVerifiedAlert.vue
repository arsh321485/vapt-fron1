<template>
  <Transition name="panel-alert-fade">
    <div
      v-if="shown"
      class="panel-header-alert panel-header-alert--verified"
      role="status"
      aria-live="polite"
      aria-label="VAPTfix verification notice"
    >
      <div class="panel-alert-card panel-alert-card--verified">
        <button
          type="button"
          class="panel-alert-close"
          aria-label="Close"
          @click="$emit('close')"
        >
          <i class="bi bi-x"></i>
        </button>
        <img
          src="@/assets/images/vaptfix-verified.png"
          alt=""
          class="panel-alert-img"
        />
        <p class="panel-alert-text">All steps verified by vaptfix</p>
      </div>
    </div>
  </Transition>
</template>

<script>
const DEFAULT_DELAY_MS = 1500;

export default {
  name: 'VaptfixVerifiedAlert',
  props: {
    visible: { type: Boolean, default: false },
    delayMs: { type: Number, default: DEFAULT_DELAY_MS },
  },
  emits: ['close'],
  data() {
    return {
      shown: false,
      delayTimer: null,
    };
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.clearDelayTimer();
        if (!val) {
          this.shown = false;
          return;
        }
        this.shown = false;
        this.delayTimer = setTimeout(() => {
          this.shown = true;
          this.delayTimer = null;
        }, this.delayMs);
      },
    },
  },
  beforeUnmount() {
    this.clearDelayTimer();
  },
  methods: {
    clearDelayTimer() {
      if (this.delayTimer) {
        clearTimeout(this.delayTimer);
        this.delayTimer = null;
      }
    },
  },
};
</script>

<style scoped>
.panel-header-alert {
  flex-shrink: 0;
  width: 100%;
}

.panel-alert-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 300px;
  min-width: 220px;
  padding: 12px 38px 12px 14px;
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.95);
  border-radius: 12px;
  box-shadow:
    0 8px 24px rgba(15, 23, 42, 0.1),
    0 2px 8px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.panel-alert-card--verified::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10px;
  bottom: 10px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, #c9a227 0%, #0f696e 100%);
}

.panel-alert-close {
  position: absolute;
  top: 6px;
  right: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #94a3b8;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.panel-alert-close:hover {
  background: #f1f5f9;
  color: #475569;
}

.panel-alert-img {
  width: 52px;
  height: auto;
  flex-shrink: 0;
  display: block;
}

.panel-alert-text {
  margin: 0;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.4;
  color: #1e293b;
  letter-spacing: 0.01em;
}

.panel-alert-fade-enter-active {
  transition:
    opacity 0.55s ease-out,
    transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.panel-alert-fade-leave-active {
  transition:
    opacity 0.28s ease-in,
    transform 0.28s ease-in;
}

.panel-alert-fade-enter-from,
.panel-alert-fade-leave-to {
  opacity: 0;
  transform: translateX(14px);
}
</style>
