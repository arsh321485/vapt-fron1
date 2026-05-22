<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="toolbox-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="toolbox-modal-title"
      @click.self="close"
    >
      <div class="toolbox-modal-box">
        <div class="toolbox-modal-top">
          <div class="toolbox-modal-title-block">
            <h2 id="toolbox-modal-title" class="toolbox-modal-title">{{ payload.title }}</h2>
            <div class="d-flex align-items-center gap-2 flex-wrap toolbox-modal-badges">
              <span class="toolbox-risk-badge" :class="'toolbox-risk-' + (payload.severity || 'medium').toLowerCase()">
                {{ payload.severityRiskLabel }}
              </span>
              <span class="toolbox-verified-pill">{{ payload.verifiedLabel }}</span>
            </div>
          </div>
          <img
            src="@/assets/images/vaptfix-verified.png"
            alt=""
            class="toolbox-modal-verified-img"
            aria-hidden="true"
          />
          <button type="button" class="toolbox-modal-close" aria-label="Close" @click="close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="toolbox-modal-body">
          <div class="toolbox-two-col">
            <div class="toolbox-libs-card">
              <div class="toolbox-section-label">LIBRARIES REQUIRED</div>
              <ul class="toolbox-libs-list">
                <li v-for="lib in payload.libraries" :key="lib">{{ lib }}</li>
              </ul>
            </div>
            <div class="toolbox-snippet-card">
              <div class="toolbox-snippet-head">
                <span class="toolbox-section-label toolbox-section-label--dark">SHELL</span>
              </div>
              <pre class="toolbox-snippet-code"><code>{{ payload.shellSnippet }}</code></pre>
              <button type="button" class="toolbox-copy-snippet" @click="copySnippet">
                <i class="bi bi-copy" aria-hidden="true"></i>
                {{ copiedSnippet ? 'Copied!' : 'Copy Snippet' }}
              </button>
            </div>
          </div>

          <div class="toolbox-os-tabs">
            <button
              v-for="tab in osTabs"
              :key="tab.id"
              type="button"
              class="toolbox-os-tab"
              :class="{ active: activeOs === tab.id }"
              @click="activeOs = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="toolbox-os-steps-card">
            <ol class="toolbox-os-steps">
              <li v-for="(step, i) in activeOsSteps" :key="activeOs + '-' + i">{{ step }}</li>
            </ol>
          </div>

          <div class="toolbox-considerations">
            <i class="bi bi-lightbulb toolbox-consider-icon" aria-hidden="true"></i>
            <div>
              <div class="toolbox-consider-title">IMPORTANT CONSIDERATIONS</div>
              <p class="toolbox-consider-text">{{ payload.consideration }}</p>
            </div>
          </div>

          <p class="toolbox-disclaimer">{{ payload.disclaimer }}</p>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import {
  TOOLBOX_OS_TABS,
  buildToolboxPayload,
  getOsStepsForTab,
} from '@/utils/vulnRemediationToolbox';

export default {
  name: 'VulnRemediationToolboxModal',
  props: {
    modelValue: { type: Boolean, default: false },
    vulnName: { type: String, default: '' },
    severity: { type: String, default: 'Medium' },
    cve: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      activeOs: 'windows',
      copiedSnippet: false,
      _copyTimer: null,
      _escHandler: null,
    };
  },
  computed: {
    osTabs() {
      return TOOLBOX_OS_TABS;
    },
    payload() {
      return buildToolboxPayload({
        vulnName: this.vulnName,
        severity: this.severity,
        cve: this.cve,
      });
    },
    activeOsSteps() {
      return getOsStepsForTab(this.payload.osSteps, this.activeOs);
    },
  },
  watch: {
    modelValue(open) {
      if (open) {
        this.activeOs = 'windows';
        this.copiedSnippet = false;
        document.body.style.overflow = 'hidden';
        this._escHandler = (e) => {
          if (e.key === 'Escape') this.close();
        };
        document.addEventListener('keydown', this._escHandler);
      } else {
        document.body.style.overflow = '';
        if (this._escHandler) {
          document.removeEventListener('keydown', this._escHandler);
          this._escHandler = null;
        }
      }
    },
  },
  beforeUnmount() {
    if (this._copyTimer) clearTimeout(this._copyTimer);
    document.body.style.overflow = '';
    if (this._escHandler) document.removeEventListener('keydown', this._escHandler);
  },
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    },
    async copySnippet() {
      const value = this.payload.shellSnippet;
      let ok = false;
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          ok = true;
        }
      } catch {
        /* fallback */
      }
      if (!ok) {
        const el = document.createElement('textarea');
        el.value = value;
        el.setAttribute('readonly', '');
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        ok = document.execCommand('copy');
        document.body.removeChild(el);
      }
      if (ok) {
        this.copiedSnippet = true;
        if (this._copyTimer) clearTimeout(this._copyTimer);
        this._copyTimer = setTimeout(() => {
          this.copiedSnippet = false;
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.toolbox-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10060;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
}

.toolbox-modal-box {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: #f4f6f8;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.toolbox-modal-top {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 22px 52px 16px 24px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.toolbox-modal-title-block {
  flex: 1;
  min-width: 0;
}

.toolbox-modal-title {
  margin: 0 0 10px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f696e;
  line-height: 1.35;
}

.toolbox-risk-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 4px;
}

.toolbox-risk-critical { background: #f8dede; color: #b42318; }
.toolbox-risk-high { background: #fee2e2; color: #dc2626; }
.toolbox-risk-medium { background: #fef3c7; color: #f59e0b; }
.toolbox-risk-low { background: #ccfbf1; color: #0f766e; }

.toolbox-verified-pill {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 10px;
  border-radius: 4px;
  background: #e0f2f1;
  color: #0f696e;
}

.toolbox-modal-verified-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 2px;
}

.toolbox-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
}

.toolbox-modal-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.toolbox-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px 24px;
}

.toolbox-two-col {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 14px;
  margin-bottom: 18px;
}

@media (max-width: 640px) {
  .toolbox-two-col {
    grid-template-columns: 1fr;
  }
}

.toolbox-libs-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px 18px;
  border: 1px solid rgba(203, 196, 208, 0.35);
}

.toolbox-section-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 12px;
}

.toolbox-section-label--dark {
  color: #64748b;
}

.toolbox-libs-list {
  margin: 0;
  padding: 0 0 0 18px;
  list-style: none;
}

.toolbox-libs-list li {
  position: relative;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.5;
  margin-bottom: 6px;
}

.toolbox-libs-list li::before {
  content: '';
  position: absolute;
  left: -14px;
  top: 0.45em;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0f696e;
}

.toolbox-snippet-card {
  background: #1e293b;
  border-radius: 12px;
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  min-height: 140px;
}

.toolbox-snippet-head {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.toolbox-snippet-code {
  flex: 1;
  margin: 0 0 12px;
  padding: 0;
  background: transparent;
  border: none;
  overflow-x: auto;
}

.toolbox-snippet-code code {
  font-size: 0.72rem;
  font-weight: 500;
  color: #e2e8f0;
  line-height: 1.55;
  word-break: break-all;
  white-space: pre-wrap;
}

.toolbox-copy-snippet {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  background: transparent;
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.toolbox-copy-snippet:hover {
  color: #f8fafc;
}

.toolbox-os-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.toolbox-os-tab {
  flex: 1;
  padding: 10px 12px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #49454f;
  background: #fff;
  border: 1px solid rgba(203, 196, 208, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.toolbox-os-tab:hover {
  background: #f2f3f6;
}

.toolbox-os-tab.active {
  background: #241447;
  color: #fff;
  border-color: #241447;
}

.toolbox-os-steps-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid rgba(203, 196, 208, 0.35);
  padding: 18px 20px;
  margin-bottom: 16px;
}

.toolbox-os-steps {
  margin: 0;
  padding-left: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #1e293b;
  line-height: 1.65;
}

.toolbox-os-steps li {
  margin-bottom: 8px;
}

.toolbox-os-steps li:last-child {
  margin-bottom: 0;
}

.toolbox-considerations {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  background: #eef6f7;
  border-left: 4px solid #0f696e;
  border-radius: 0 10px 10px 0;
  padding: 16px 18px;
  margin-bottom: 14px;
}

.toolbox-consider-icon {
  font-size: 1.25rem;
  color: #0f696e;
  flex-shrink: 0;
}

.toolbox-consider-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #241447;
  margin-bottom: 6px;
}

.toolbox-consider-text {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 500;
  color: #475569;
  line-height: 1.6;
}

.toolbox-disclaimer {
  margin: 0;
  font-size: 0.72rem;
  font-style: italic;
  color: #94a3b8;
  line-height: 1.5;
}
</style>
