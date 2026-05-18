<template>
  <div class="mf-panel">
    <div class="mf-subtasks-bar">
      <span class="mf-subtasks-title">Remediation Sub-Tasks ({{ subtasks.length }})</span>
      <span class="mf-subtasks-done">{{ completedSubtasksCount }} tasks completed</span>
    </div>

    <div
      v-for="(task, idx) in subtasks"
      :key="task.id"
      class="mf-step-card"
    >
      <div
        class="mf-step-head"
        role="button"
        tabindex="0"
        :aria-expanded="isOpen(idx) ? 'true' : 'false'"
        @click="toggleTask(idx)"
        @keydown.enter.prevent="toggleTask(idx)"
        @keydown.space.prevent="toggleTask(idx)"
      >
        <div class="mf-step-head-left">
          <span class="mf-step-num">{{ task.id }}</span>
          <span class="mf-step-title">{{ task.name }}</span>
        </div>
        <div class="mf-step-head-right">
          <span v-if="task.category" class="mf-category-tag">{{ task.category }}</span>
          <i class="bi mf-chevron" :class="isOpen(idx) ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </div>
      </div>

      <div v-show="isOpen(idx)" class="mf-step-body" @click.stop>
        <div class="mf-grid mf-grid-2">
          <div class="mf-cell">
            <div class="mf-label">ACTION</div>
            <p class="mf-value mf-pretext">{{ cleanText(task.action) }}</p>
          </div>
          <div class="mf-cell mf-cell-divider">
            <div class="mf-label">ASSIGNED TO</div>
            <p v-if="task.assignedTeam" class="mf-value mf-team" :style="{ color: getTeamColor(task.assignedTeam) }">
              {{ task.assignedTeam }}
            </p>
            <div v-if="task.members && task.members.length" class="mf-member-row">
              <span v-for="m in task.members" :key="m.user_id" class="mf-member-chip">
                <i class="bi bi-person-fill"></i>{{ m.name }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="task.filePath && task.filePath !== 'N/A'" class="mf-section">
          <div class="mf-label">FILE PATH</div>
          <div class="mf-filepath-box">
            <span class="mf-filepath-text">{{ task.filePath }}</span>
            <button type="button" class="mf-icon-copy" title="Copy to clipboard" @click.stop.prevent="copyCommand(task.filePath)">
              <i class="bi bi-clipboard"></i>
            </button>
          </div>
        </div>

        <div
          v-if="(task.whereToRunLabel || task.whereToRun) && (task.whereToRunLabel || task.whereToRun) !== 'N/A'"
          class="mf-section"
        >
          <div class="mf-label">WHERE TO RUN</div>
          <p class="mf-value">{{ task.whereToRunLabel || task.whereToRun }}</p>
        </div>

        <div v-if="task.command && task.command !== 'N/A'" class="mf-section">
          <div class="mf-cmd-head">
            <span class="mf-label mf-label-inline">COMMAND TO RUN</span>
            <button
              type="button"
              class="mf-copy-btn"
              @click.stop.prevent="copyCommand(formatCommandToRun(task.command))"
            >
              <i class="bi bi-clipboard"></i> Copy
            </button>
          </div>
          <pre class="mf-cmd-block"><code>{{ formatCommandToRun(task.command) }}</code></pre>
        </div>

        <div
          v-if="(task.expectedOutput && task.expectedOutput !== 'N/A') || (task.verificationCheck && task.verificationCheck !== 'N/A')"
          class="mf-grid mf-grid-2"
        >
          <div v-if="task.expectedOutput && task.expectedOutput !== 'N/A'" class="mf-cell">
            <div class="mf-label">EXPECTED OUTPUT</div>
            <p class="mf-value mf-pretext">{{ cleanText(task.expectedOutput) }}</p>
          </div>
          <div v-if="task.verificationCheck && task.verificationCheck !== 'N/A'" class="mf-cell mf-cell-divider">
            <div class="mf-verify-head">
              <span class="mf-label mf-label-inline">VERIFICATION CHECK</span>
              <button type="button" class="mf-icon-copy mf-icon-copy-sm" title="Copy to clipboard" @click.stop.prevent="copyCommand(cleanText(task.verificationCheck))">
                <i class="bi bi-clipboard"></i>
              </button>
            </div>
            <div class="mf-verify-box">
              <span class="mf-verify-text">{{ cleanText(task.verificationCheck) }}</span>
            </div>
          </div>
        </div>

        <div v-if="task.tools && task.tools.length" class="mf-section">
          <div class="mf-label">ARTEFACTS &amp; TOOLS</div>
          <div class="mf-tool-row">
            <span v-for="tool in task.tools" :key="tool" class="mf-tool-chip">{{ tool }}</span>
          </div>
        </div>

        <div v-if="task.consideration" class="mf-consideration">
          <div class="mf-consideration-hd">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            IMPORTANT CONSIDERATIONS
          </div>
          <p class="mf-consideration-text">{{ cleanText(task.consideration) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MOCK_MANUAL_STEPS } from '@/constants/mockManualRemediationSteps';
import { getTeamColor } from '@/utils/teamColors';

export default {
  name: 'ManualRemediationStepsPanel',
  data() {
    return {
      subtasks: MOCK_MANUAL_STEPS,
      expandedTasks: [0],
    };
  },
  computed: {
    completedSubtasksCount() {
      return this.subtasks.filter(t => t.status === 'completed').length;
    },
  },
  methods: {
    getTeamColor,
    isOpen(idx) {
      return this.expandedTasks.includes(idx);
    },
    toggleTask(idx) {
      const i = this.expandedTasks.indexOf(idx);
      if (i === -1) this.expandedTasks.push(idx);
      else this.expandedTasks.splice(i, 1);
    },
    cleanText(text) {
      if (!text) return '';
      return String(text)
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .trim();
    },
    formatCommandToRun(commandValue) {
      let raw = Array.isArray(commandValue)
        ? commandValue.map(item => String(item || '').trim()).join('\n')
        : String(commandValue || '');
      raw = raw.replace(/^```[\w]*\s*/i, '').replace(/\s*```$/i, '');
      raw = raw.replace(/<br\s*\/?>/gi, '\n');
      raw = raw.replace(/<[^>]+>/g, '');
      return raw.trim();
    },
    async copyCommand(text) {
      const value = String(text ?? '').trim();
      if (!value) return;

      const fallbackCopy = () => {
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
        let ok = false;
        try {
          ok = document.execCommand('copy');
        } catch {
          ok = false;
        }
        document.body.removeChild(el);
        if (ok) this.showCopyToast();
      };

      try {
        if (window.isSecureContext && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
          this.showCopyToast();
          return;
        }
      } catch {
        /* use fallback */
      }
      fallbackCopy();
    },
    showCopyToast() {
      const existing = document.getElementById('mf-copy-toast');
      if (existing) existing.remove();
      const toast = document.createElement('div');
      toast.id = 'mf-copy-toast';
      toast.textContent = 'Copied to clipboard';
      toast.style.cssText =
        'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#0f172a;color:#4ade80;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.3);pointer-events:none;';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    },
  },
};
</script>

<style>
@import '@/components/assets/manual-fix-steps.css';
</style>
