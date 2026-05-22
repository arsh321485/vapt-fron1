<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="python-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="python-setup-title"
      @click.self="close"
    >
      <div class="python-modal-box">
        <div class="python-modal-header">
          <div class="python-modal-title-wrap">
            <i class="bi bi-filetype-py python-modal-icon" aria-hidden="true"></i>
            <h3 id="python-setup-title" class="python-modal-title">Python installation steps</h3>
          </div>
          <button type="button" class="python-modal-close" aria-label="Close" @click="close">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="python-os-tabs">
          <button
            v-for="tab in osTabs"
            :key="tab.id"
            type="button"
            class="python-os-tab"
            :class="{ active: activeOs === tab.id }"
            @click="activeOs = tab.id"
          >
            <i :class="['bi', tab.icon, 'python-os-tab-icon']" aria-hidden="true"></i>
            {{ tab.label }}
          </button>
        </div>

        <div class="python-modal-body">
          <p class="python-modal-intro">
            Install Python on the machine where you will run remediation scripts
            (<strong>{{ activeOsLabel }}</strong>). Follow these steps before using
            <strong>Command to download libraries</strong> or <strong>Command to run script</strong>.
          </p>
          <ol class="python-steps-list">
            <li v-for="(step, i) in pythonStepsForModal" :key="activeOs + '-' + i" class="python-step">
              <span class="python-step-num">{{ i + 1 }}</span>
              <div class="python-step-content">
                <div class="python-step-title">{{ step.title }}</div>
                <p v-if="step.text" class="python-step-text">{{ step.text }}</p>
                <div v-if="step.command" class="python-step-cmd">
                  <code>{{ step.command }}</code>
                  <button
                    type="button"
                    class="python-step-copy"
                    :title="copiedKey === copyKey(i) ? 'Copied!' : 'Copy'"
                    @click.stop="copyText(step.command, copyKey(i))"
                  >
                    {{ copiedKey === copyKey(i) ? '✓' : '⎘' }}
                  </button>
                </div>
              </div>
            </li>
          </ol>
        </div>
        <div class="python-modal-footer">
          <button type="button" class="python-modal-done" @click="close">Got it</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import { canonSeverity } from '@/utils/assetVulnerabilities';
import {
  PYTHON_OS_TABS,
  PYTHON_DEFAULTS_BY_SEVERITY,
  buildPythonStepsForOs,
} from '@/utils/pythonInstallGuide';

export default {
  name: 'PythonInstallGuideModal',
  props: {
    modelValue: { type: Boolean, default: false },
    severity: { type: String, default: '' },
    pipCommand: { type: String, default: '' },
    runCommand: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      activeOs: 'windows',
      copiedKey: null,
      _copyTimer: null,
      _escHandler: null,
    };
  },
  computed: {
    osTabs() {
      return PYTHON_OS_TABS;
    },
    activeOsLabel() {
      return this.osTabs.find(t => t.id === this.activeOs)?.label || 'Windows';
    },
    sevKey() {
      return String(canonSeverity(this.severity) || 'Medium').trim().toLowerCase();
    },
    sevDefaults() {
      return PYTHON_DEFAULTS_BY_SEVERITY[this.sevKey] || PYTHON_DEFAULTS_BY_SEVERITY.medium;
    },
    resolvedPip() {
      return this.pipCommand || this.sevDefaults.pipCommand;
    },
    resolvedRun() {
      return this.runCommand || this.sevDefaults.runCommand;
    },
    pythonStepsForModal() {
      return buildPythonStepsForOs(this.activeOs, this.resolvedPip, this.resolvedRun);
    },
  },
  watch: {
    modelValue(open) {
      if (open) {
        this.activeOs = 'windows';
        this.copiedKey = null;
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
    copyKey(i) {
      return `${this.activeOs}-step-${i}`;
    },
    close() {
      this.$emit('update:modelValue', false);
    },
    async copyText(text, key = 'cmd') {
      const value = String(text ?? '').trim();
      if (!value) return;

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
        el.style.top = '0';
        el.style.left = '0';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.focus();
        el.select();
        el.setSelectionRange(0, value.length);
        ok = document.execCommand('copy');
        document.body.removeChild(el);
      }

      if (ok) {
        this.copiedKey = key;
        if (this._copyTimer) clearTimeout(this._copyTimer);
        this._copyTimer = setTimeout(() => {
          this.copiedKey = null;
        }, 2000);
      }
    },
  },
};
</script>

<style scoped>
.python-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(2px);
}

.python-modal-box {
  width: 100%;
  max-width: 580px;
  max-height: 88vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.28);
  overflow: hidden;
}

.python-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
}

.python-os-tabs {
  display: flex;
  gap: 6px;
  padding: 10px 20px 0;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.python-os-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  margin-bottom: -1px;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
  transition: color 0.15s, background 0.15s, border-color 0.15s;
}

.python-os-tab:hover {
  color: #0f172a;
  background: #f1f5f9;
}

.python-os-tab.active {
  color: #0284c7;
  background: #fff;
  border-bottom-color: #0284c7;
}

.python-os-tab-icon {
  font-size: 14px;
  line-height: 1;
}

.python-modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.python-modal-icon {
  font-size: 1.35rem;
  line-height: 1;
  color: #3776ab;
}

.python-modal-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f172a;
}

.python-modal-close {
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
  transition: background 0.15s, color 0.15s;
}

.python-modal-close:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.python-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 8px;
  background: #fff;
}

.python-modal-intro {
  margin: 0 0 14px;
  font-size: 13px;
  color: #475569;
  line-height: 1.55;
}

.python-steps-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.python-step {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}

.python-step:last-child {
  border-bottom: none;
}

.python-step-num {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #0284c7;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.python-step-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.python-step-text {
  margin: 0 0 8px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.5;
}

.python-step-cmd {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0f172a;
  border-radius: 6px;
  padding: 8px 10px;
}

.python-step-cmd code {
  flex: 1;
  font-size: 11px;
  color: #e2e8f0;
  word-break: break-all;
}

.python-step-copy {
  flex-shrink: 0;
  border: none;
  background: #334155;
  color: #94a3b8;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 12px;
  cursor: pointer;
}

.python-step-copy:hover {
  color: #f8fafc;
}

.python-modal-footer {
  padding: 14px 20px 18px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  background: #f8fafc;
}

.python-modal-done {
  padding: 8px 20px;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background: #0284c7;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}

.python-modal-done:hover {
  background: #0369a1;
}
</style>
