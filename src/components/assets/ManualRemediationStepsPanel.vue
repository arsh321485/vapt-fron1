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

        <!-- Complete Step + Support Request (User Only) -->
        <div v-if="isUser" class="mf-complete-btn-wrap">
          <button
            type="button"
            class="mf-support-btn"
            :class="{ 'mf-support-btn--raised': isStepSupportRaised(task.id) }"
            :disabled="isStepSupportRaised(task.id) || !canRaiseSupport"
            :title="isStepSupportRaised(task.id) ? 'Support already raised for this step' : 'Raise support request for this step'"
            @click="openStepSupportModal(task)"
          >
            <i class="bi bi-headset" aria-hidden="true"></i>
            {{ isStepSupportRaised(task.id) ? 'Support Raised' : 'Support Request' }}
          </button>
          <button
            type="button"
            class="mf-complete-btn"
            :class="{ 'completed': task.status === 'completed' }"
            @click="toggleStepComplete(task)"
          >
            {{ task.status === 'completed' ? 'Completed Step ' + task.id : 'Complete Step ' + task.id }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isUser" class="mf-footer-actions">
      <button
        type="button"
        class="mf-action-btn mf-action-btn--primary"
        :disabled="allStepsCompleted"
        @click="completeAllSteps"
      >
        <i class="bi bi-check2-all" aria-hidden="true"></i>
        <span>Complete all steps</span>
      </button>
      <button
        type="button"
        class="mf-action-btn mf-action-btn--outline"
        @click="sendVerificationForSteps"
      >
        <i class="bi bi-send" aria-hidden="true"></i>
        <span>Send verification</span>
      </button>
    </div>

  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { MOCK_MANUAL_STEPS } from '@/constants/mockManualRemediationSteps';
import { getTeamColor } from '@/utils/teamColors';
import { useAuthStore } from '@/stores/authStore';

export default {
  name: 'ManualRemediationStepsPanel',
  emits: ['support-request-raised', 'open-support-modal'],
  props: {
    isUser: {
      type: Boolean,
      default: false,
    },
    vulnName: {
      type: String,
      default: '',
    },
    assetIp: {
      type: String,
      default: '',
    },
    severity: {
      type: String,
      default: 'Medium',
    },
  },
  data() {
    return {
      authStore: useAuthStore(),
      subtasks: MOCK_MANUAL_STEPS,
      expandedTasks: [0],
      raisedSupportSteps: [],
    };
  },
  computed: {
    completedSubtasksCount() {
      return this.subtasks.filter(t => t.status === 'completed').length;
    },
    allStepsCompleted() {
      return this.subtasks.length > 0 && this.subtasks.every(t => t.status === 'completed');
    },
    canRaiseSupport() {
      return Boolean(this.vulnName && this.assetIp);
    },
  },
  watch: {
    vulnName() {
      this.loadRaisedSupportSteps();
    },
    assetIp() {
      this.loadRaisedSupportSteps();
    },
  },
  mounted() {
    if (this.isUser) {
      this.loadRaisedSupportSteps();
    }
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
    toggleStepComplete(task) {
      if (task.status === 'completed') {
        task.status = 'pending';
      } else {
        task.status = 'completed';
      }
      this.$forceUpdate();
    },
    async completeAllSteps() {
      if (this.allStepsCompleted) {
        Swal.fire({ icon: 'info', title: 'All steps are already completed' });
        return;
      }
      const { isConfirmed } = await Swal.fire({
        title: 'Complete all steps?',
        text: 'All manual fix steps will be marked completed.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#0f696e',
        confirmButtonText: 'Yes, complete all',
        cancelButtonText: 'Cancel',
      });
      if (!isConfirmed) return;
      this.subtasks.forEach(t => {
        t.status = 'completed';
      });
      this.$forceUpdate();
      Swal.fire({
        icon: 'success',
        title: 'All steps completed',
        timer: 2200,
        showConfirmButton: false,
      });
    },
    sendVerificationForSteps() {
      Swal.fire({
        icon: 'info',
        title: 'Verification request',
        text: 'Your remediation steps fix will be sent for verification. You will be notified once it is reviewed.',
        confirmButtonText: 'OK',
      });
    },
    isStepSupportRaised(stepId) {
      return this.raisedSupportSteps.includes(Number(stepId));
    },
    async loadRaisedSupportSteps() {
      if (!this.isUser || !this.assetIp || !this.vulnName) {
        this.raisedSupportSteps = [];
        return;
      }
      const res = await this.authStore.getUserSupportRequestsByHost(this.assetIp);
      if (!res.status || !Array.isArray(res.data)) {
        this.raisedSupportSteps = [];
        return;
      }
      const vulnLower = String(this.vulnName).trim().toLowerCase();
      const matching = res.data.filter(
        (item) => String(item.vul_name || '').trim().toLowerCase() === vulnLower,
      );
      this.raisedSupportSteps = matching
        .map((item) => Number(item.step_number))
        .filter((n) => Number.isFinite(n));
    },
    openStepSupportModal(task) {
      if (this.isStepSupportRaised(task.id)) return;
      // Emit to parent so the parent's modal opens with vuln + step pre-filled
      const completedSteps = this.subtasks
        .filter(t => t.status === 'completed')
        .map(t => Number(t.id))
        .filter(n => Number.isFinite(n));
      this.$emit('open-support-modal', { vulnName: this.vulnName, step: task.id, completedSteps });
    },
  },
};
</script>

<style>
@import '@/components/assets/manual-fix-steps.css';
</style>
