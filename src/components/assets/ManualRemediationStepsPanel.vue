<template>
  <div class="mf-panel">

    <!-- Loading state while fetching fix details -->
    <div v-if="loadingFixVuln" class="mf-fix-loading">
      <span class="spinner-border spinner-border-sm text-primary me-2"></span>
      <span>Loading fix details…</span>
    </div>

    <!-- Admin: fix not started — only show in All Assets tab, not All Vulns tab -->
    <div v-if="!isUser && fixNotStarted && !loadingFixVuln && assetIp" class="mf-not-started">
      <i class="bi bi-hourglass-split mf-not-started-icon" aria-hidden="true"></i>
      <div class="mf-not-started-text">
        <span class="mf-not-started-title">Fix Not Started</span>
        <span class="mf-not-started-sub">No remediation has been initiated for this vulnerability yet.</span>
      </div>
    </div>

    <!-- Fix info from API: solution + assigned team -->
    <div v-if="fixVulnData && !loadingFixVuln" class="mf-fix-info-card">
      <div v-if="fixVulnData.solution" class="mf-fix-info-row">
        <div class="mf-label">SOLUTION</div>
        <p class="mf-value mf-pretext">{{ fixVulnData.solution }}</p>
      </div>
      <div v-if="fixVulnData.assigned_team || (fixVulnData.assigned_team_members && fixVulnData.assigned_team_members.length)" class="mf-fix-info-row">
        <div class="mf-label">ASSIGNED TEAM</div>
        <p v-if="fixVulnData.assigned_team" class="mf-value mf-team" :style="{ color: getTeamColor(fixVulnData.assigned_team) }">
          {{ fixVulnData.assigned_team }}
        </p>
        <div v-if="fixVulnData.assigned_team_members && fixVulnData.assigned_team_members.length" class="mf-member-row">
          <span v-for="m in fixVulnData.assigned_team_members" :key="m.user_id" class="mf-member-chip">
            <i class="bi bi-person-fill"></i>{{ m.name }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="!loadingFixVuln" class="mf-subtasks-bar">
      <span class="mf-subtasks-title">Remediation Sub-Tasks ({{ displaySubtasks.length }})</span>
      <span class="mf-subtasks-done">{{ completedSubtasksCount }} tasks completed</span>
    </div>

    <div
      v-for="task in displaySubtasks"
      :key="task.id"
      class="mf-step-card"
      :class="{ 'mf-step-card--current': task.isCurrent }"
    >
      <div
        class="mf-step-head"
        role="button"
        :tabindex="0"
        :aria-expanded="task.isExpanded ? 'true' : 'false'"
        @click="toggleTask(task.id)"
        @keydown.enter.prevent="toggleTask(task.id)"
        @keydown.space.prevent="toggleTask(task.id)"
      >
        <div class="mf-step-head-left">
          <span class="mf-step-num">{{ task.id }}</span>
          <span class="mf-step-title">{{ task.name }}</span>
          <span v-if="task.isCurrent && task.status !== 'completed'" class="mf-step-current-badge">Current</span>
          <span v-if="task.status === 'completed'" class="mf-step-done-badge">Done</span>
        </div>
        <div class="mf-step-head-right">
          <span v-if="task.category" class="mf-category-tag">{{ task.category }}</span>
          <i class="bi mf-chevron" :class="task.isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
        </div>
      </div>

      <div v-show="task.isExpanded" class="mf-step-body" @click.stop>
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

        <div v-if="task.howToRun" class="mf-section">
          <div class="mf-label">HOW TO RUN</div>
          <p class="mf-value">{{ task.howToRun }}</p>
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

        <!-- Read-only completed indicator (Admin Only) -->
        <div v-if="!isUser && task.status === 'completed'" class="mf-complete-btn-wrap">
          <button type="button" class="mf-complete-btn mf-complete-btn--done" disabled>
            <i class="bi bi-check-circle-fill me-1"></i>
            Step {{ task.id }} Completed
          </button>
        </div>

        <!-- Complete Step + Support Request (User Only) -->
        <div v-if="isUser" class="mf-complete-btn-wrap">
          <button
            v-if="isUser"
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
            :class="{
              'mf-complete-btn--done': task.status === 'completed',
            }"
            :disabled="task.status === 'completed' || task.submitting || isVulnerabilityClosed"
            @click="toggleStepComplete(task)"
          >
            <span v-if="task.submitting" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else-if="task.status === 'completed'" class="bi bi-check-circle-fill me-1"></i>
            {{ task.status === 'completed' ? 'Step ' + task.id + ' Completed' : 'Complete Step ' + task.id }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="isUser" class="mf-footer-actions">
      <button
        type="button"
        class="mf-action-btn mf-action-btn--primary"
        :disabled="allStepsCompleted || loadingFixVuln || isVulnerabilityClosed"
        @click="completeAllSteps"
      >
        <i class="bi bi-check2-all" aria-hidden="true"></i>
        <span>Complete all steps</span>
      </button>
      <!-- After steps complete (auto-closed): offer Send for retest → open/review -->
      <button
        v-if="showSendForRetest"
        type="button"
        class="mf-action-btn mf-action-btn--outline"
        :disabled="loadingFixVuln || requestingRetest"
        @click="requestRetestForSteps"
      >
        <span v-if="requestingRetest" class="spinner-border spinner-border-sm me-1"></span>
        <i v-else class="bi bi-send" aria-hidden="true"></i>
        <span>Send for retest</span>
      </button>
    </div>

  </div>
</template>

<script>
import Swal from 'sweetalert2';
import { MOCK_MANUAL_STEPS } from '@/constants/mockManualRemediationSteps';
import { getTeamColor } from '@/utils/teamColors';
import { useAuthStore } from '@/stores/authStore';
import { FREEMIUM_RETEST_MESSAGE } from '@/utils/planLimits';
import { pickVulnDescription } from '@/utils/assetVulnerabilities';

export default {
  name: 'ManualRemediationStepsPanel',
  emits: ['support-request-raised', 'open-support-modal', 'team-resolved', 'vulnerability-status-changed', 'description-resolved'],
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
    vulnId: {
      type: String,
      default: '',
    },
    assetOs: {
      type: String,
      default: '',
    },
    fixId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      authStore: useAuthStore(),
      // Admin is read-only and fetches real data; start empty to avoid
      // mock steps flashing when the component remounts.
      subtasks: [],
      raisedSupportSteps: [],
      fixVulnerabilityId: null,
      fixVulnData: null,
      fixNotStarted: false,
      loadingFixVuln: false,
      selectedOs: 'windows',
      apiCompletedSteps: 0,
      vulnerabilityStatus: '',
      allStepsCompletedFlag: false,
      requestingRetest: false,
      _fixInitSeq: 0,
    };
  },
  computed: {
    displaySubtasks() {
      if (!this.fixVulnData) return this.subtasks;
      const team = this.fixVulnData.assigned_team || null;
      const members = this.fixVulnData.assigned_team_members?.length
        ? this.fixVulnData.assigned_team_members
        : null;
      // User side: keep original team/member merge (unchanged behavior).
      if (this.isUser) {
        return this.subtasks.map(step => ({
          ...step,
          ...(team && { assignedTeam: team }),
          ...(members && { members }),
        }));
      }
      // Admin side: prefer per-step assignees from API when present.
      return this.subtasks.map(step => ({
        ...step,
        assignedTeam: step.assignedTeam || team || '',
        members: (step.members && step.members.length) ? step.members : (members || []),
      }));
    },
    completedSubtasksCount() {
      // Always derive from actual rendered step statuses so admin and user
      // both show the correct count after merging completion data.
      return this.subtasks.filter(t => t.status === 'completed').length;
    },
    allStepsCompleted() {
      if (this.allStepsCompletedFlag) return true;
      if (!this.subtasks.length) return false;
      if (this.fixVulnerabilityId && this.apiCompletedSteps >= this.subtasks.length) {
        return true;
      }
      return this.subtasks.every(t => t.status === 'completed');
    },
    isVulnerabilityClosed() {
      return String(this.vulnerabilityStatus || '').toLowerCase() === 'closed';
    },
    isInReview() {
      const s = String(this.vulnerabilityStatus || '').toLowerCase();
      return s === 'open/review' || s === 'open_review' || s === 'review' || s === 'in_review';
    },
    // After all steps complete → closed → show Send for retest (until sent → open/review)
    showSendForRetest() {
      return this.isUser && (this.isVulnerabilityClosed || this.allStepsCompleted) && !this.isInReview;
    },
    canRaiseSupport() {
      return !this.isVulnerabilityClosed && !this.isInReview;
    },
  },
  watch: {
    vulnName() {
      if (this.isUser) {
        this.initFixVuln();
        this.loadRaisedSupportSteps();
      } else {
        this.initAdminFixVuln();
      }
    },
    assetIp() {
      if (this.isUser) {
        this.initFixVuln();
        this.loadRaisedSupportSteps();
      } else {
        this.initAdminFixVuln();
      }
    },
    assetOs() {
      if (this.isUser) {
        this.initFixVuln();
      } else {
        this.initAdminFixVuln();
      }
    },
    fixId() {
      if (!this.isUser) {
        this.initAdminFixVuln();
      }
    },
  },
  mounted() {
    if (this.isUser) {
      this.initFixVuln();
      this.loadRaisedSupportSteps();
    } else {
      this.initAdminFixVuln();
    }
  },
  methods: {
    getTeamColor,
    resolveOsKey(value) {
      const normalized = String(value || 'windows').toLowerCase();
      return normalized.includes('linux') ? 'linux' : 'windows';
    },
    normalizeStepStatus(status) {
      const normalized = String(status || '').toLowerCase().trim();
      if (normalized === 'completed' || normalized === 'step done' || normalized === 'done') {
        return 'completed';
      }
      return 'pending';
    },
    isStepCompleted(stepNumber, nextStep, rawStatus) {
      if (nextStep != null) {
        return stepNumber < nextStep;
      }
      return this.normalizeStepStatus(rawStatus) === 'completed';
    },
    resolveEffectiveNextStep(apiSteps, nextStep) {
      if (nextStep == null) return null;

      const total = apiSteps.length;
      let effective = Number(nextStep);
      if (!Number.isFinite(effective) || effective < 1) return 1;

      const sorted = [...apiSteps].sort((a, b) => a.step_number - b.step_number);
      while (effective <= total) {
        const step = sorted.find(s => s.step_number === effective);
        if (!step) break;
        if (this.normalizeStepStatus(step.status) !== 'completed') break;
        effective += 1;
      }

      return effective > total ? null : effective;
    },
    syncVulnerabilityStatusFromPayload(payload) {
      if (!payload) return;
      const status =
        payload.vulnerability_status ||
        payload.status ||
        payload.data?.vulnerability_status ||
        payload.data?.status ||
        '';
      const allDone =
        payload.all_steps_completed === true ||
        payload.data?.all_steps_completed === true;

      if (allDone) {
        this.allStepsCompletedFlag = true;
        if (!status) this.vulnerabilityStatus = 'closed';
      }
      if (status) {
        const next = String(status).toLowerCase();
        this.vulnerabilityStatus = next;
        this.$emit('vulnerability-status-changed', {
          vulnName: this.vulnName,
          assetIp: this.assetIp,
          status: next,
          all_steps_completed: allDone || next === 'closed',
        });
      } else if (allDone) {
        this.$emit('vulnerability-status-changed', {
          vulnName: this.vulnName,
          assetIp: this.assetIp,
          status: 'closed',
          all_steps_completed: true,
        });
      }
    },
    applyStepProgressFromPost(res) {
      const nextStep = res.next_step ?? null;
      this.syncVulnerabilityStatusFromPayload(res);

      if (res.completed_steps != null) {
        this.apiCompletedSteps = res.completed_steps;
      } else if (nextStep != null) {
        this.apiCompletedSteps = Math.max(0, nextStep - 1);
      }

      if (res.all_steps_completed || (nextStep == null && res.completed_steps != null
          && this.subtasks.length > 0
          && res.completed_steps >= this.subtasks.length)) {
        this.allStepsCompletedFlag = true;
        this.subtasks.forEach(task => {
          task.status = 'completed';
          task.isCurrent = false;
          task.isLocked = false;
          task.isExpanded = false;
        });
        if (!this.isInReview && String(this.vulnerabilityStatus || '').toLowerCase() !== 'closed') {
          this.vulnerabilityStatus = 'closed';
        }
        return;
      }

      if (nextStep == null) {
        if (
          res.completed_steps != null
          && this.subtasks.length > 0
          && res.completed_steps >= this.subtasks.length
        ) {
          this.subtasks.forEach(task => {
            task.status = 'completed';
            task.isCurrent = false;
            task.isLocked = false;
            task.isExpanded = false;
          });
        }
        return;
      }

      this.subtasks.forEach(task => {
        const completed = task.id < nextStep;
        task.status = completed ? 'completed' : 'pending';
        task.isCurrent = task.id === nextStep;
        task.isExpanded = task.id === nextStep;
        task.isLocked = task.id > nextStep;
      });
    },
    applyStepsFromApi(data, postOverride = null) {
      const osKey = this.resolveOsKey(data.operating_system || this.assetOs || this.selectedOs);
      this.selectedOs = osKey;
      // Emit resolved team to parent so outer badge matches
      const resolvedTeam = data.assigned_team ||
        (data.steps && data.steps[0]?.assigned_team) || '';
      if (resolvedTeam) {
        this.$emit('team-resolved', { vulnName: this.vulnName, team: resolvedTeam });
      }
      this.emitDescriptionIfPresent(data);

      // Prefer post-complete payload for status (may already be "closed" / "open/review")
      this.syncVulnerabilityStatusFromPayload(data);
      if (postOverride) this.syncVulnerabilityStatusFromPayload(postOverride);

      const apiSteps = data.steps || [];
      const reportedNext = postOverride?.next_step ?? data.next_step ?? null;
      let completedCount = postOverride?.completed_steps ?? data.completed_steps ?? 0;

      // Legacy rows may store "Step done" while backend count only tracks "completed"
      const legacyCompletedCount = apiSteps.filter(
        s => this.normalizeStepStatus(s.status) === 'completed',
      ).length;
      if (legacyCompletedCount > completedCount) {
        completedCount = legacyCompletedCount;
      }

      const effectiveNext = this.resolveEffectiveNextStep(
        apiSteps,
        reportedNext ?? (completedCount < apiSteps.length ? completedCount + 1 : null),
      );

      let nextStep = reportedNext;
      if (effectiveNext != null && (reportedNext == null || effectiveNext > reportedNext)) {
        nextStep = effectiveNext;
        completedCount = Math.max(completedCount, effectiveNext - 1);
      }

      // When all steps are done, backend sends next_step: null and completed_steps: N.
      // resolveEffectiveNextStep returns null for a null seed, so nextStep stays null.
      // Force nextStep past the total so every step passes the stepNumber < nextStep check.
      if (nextStep == null && completedCount > 0 && apiSteps.length > 0 && completedCount >= apiSteps.length) {
        nextStep = apiSteps.length + 1;
      }

      this.apiCompletedSteps = completedCount;

      this.subtasks = apiSteps.map(s => {
        const task = this.mapApiStepToPanel(s, osKey);
        const completed = this.isStepCompleted(s.step_number, nextStep, s.status);
        task.status = completed ? 'completed' : 'pending';
        task.isLocked = false; // Allow all steps to be interactable

        if (nextStep != null) {
          task.isCurrent = s.step_number === nextStep && !completed;
          task.isExpanded = task.isCurrent;
        } else {
          task.isCurrent = !!s.is_current;
          task.isExpanded = !!s.is_current;
        }

        return task;
      });

      if (nextStep == null && this.subtasks.some(t => t.status !== 'completed')) {
        const firstPending = this.subtasks.find(t => t.status !== 'completed');
        if (firstPending) {
          firstPending.isCurrent = true;
          firstPending.isExpanded = true;
        }
      }
    },
    emitDescriptionIfPresent(...payloads) {
      const description = pickVulnDescription(...payloads);
      if (!description) return;
      this.$emit('description-resolved', description);
    },
    async refreshStepsFromApi(postOverride = null) {
      if (!this.fixVulnerabilityId) return;
      let stepsRes;
      if (this.isUser) {
        stepsRes = await this.authStore.getUserFixVulnerabilitySteps(
          this.fixVulnerabilityId,
          this.selectedOs,
        );
      } else {
        stepsRes = await this.authStore.getFixVulnerabilitySteps(this.fixVulnerabilityId);
      }
      if (stepsRes.status && Array.isArray(stepsRes.data?.steps) && stepsRes.data.steps.length) {
        this.applyStepsFromApi(stepsRes.data, postOverride);
      } else if (postOverride) {
        this.applyStepProgressFromPost(postOverride);
      }
    },
    async initFixVuln() {
      if (!this.isUser || !this.vulnName || !this.assetIp) return;
      this.loadingFixVuln = true;
      this.fixVulnerabilityId = null;
      this.fixVulnData = null;
      this.vulnerabilityStatus = '';
      this.allStepsCompletedFlag = false;
      this.requestingRetest = false;
      try {
        const reportId = await this.authStore.resolveUserReportId();
        if (!reportId) return;
        const payload = {
          plugin_name: this.vulnName,
          risk_factor: this.severity || 'Medium',
        };
        if (this.vulnId) payload.id = this.vulnId;
        const createRes = await this.authStore.createUserFixVulnerability(reportId, this.assetIp, payload);

        // Robust fixId extraction from multiple possible response shapes
        console.log('[ManualFix] createRes:', JSON.stringify(createRes));
        let fixId = null;
        if (createRes.status && createRes.data) {
          const d = createRes.data;
          fixId = d._id || d.fix_vulnerability_id || d.id || d.data?._id || d.data?.fix_vulnerability_id || null;
          if (!fixId && typeof d === 'string') fixId = d;
          this.fixVulnData = d;
          this.emitDescriptionIfPresent(d);
          // Check if create response itself has steps
          if (d.steps?.length) {
            console.log('[ManualFix] Steps found in createRes:', d.steps.length);
            this.applyStepsFromApi(d);
          }
        }
        if (!fixId && createRes.details) {
          const det = createRes.details;
          fixId = det.fix_vulnerability_id || det._id || det.id || null;
        }
        if (!fixId) {
          console.warn('[ManualFix] Could not resolve fixId. Full createRes:', createRes);
          return;
        }
        console.log('[ManualFix] fixId resolved:', fixId);
        this.fixVulnerabilityId = fixId;

        // Try both OS keys — use whichever returns steps
        const primaryOs = this.resolveOsKey(this.assetOs);
        const fallbackOs = primaryOs === 'linux' ? 'windows' : 'linux';
        this.selectedOs = primaryOs;

        let stepsRes = await this.authStore.getUserFixVulnerabilitySteps(fixId, primaryOs);
        console.log('[ManualFix] stepsRes primaryOs:', primaryOs, JSON.stringify(stepsRes?.data?.steps?.length));
        if (!stepsRes.status || !stepsRes.data?.steps?.length) {
          // Try fallback OS
          const fallbackRes = await this.authStore.getUserFixVulnerabilitySteps(fixId, fallbackOs);
          console.log('[ManualFix] stepsRes fallbackOs:', fallbackOs, JSON.stringify(fallbackRes?.data?.steps?.length));
          if (fallbackRes.status && fallbackRes.data?.steps?.length) {
            stepsRes = fallbackRes;
            this.selectedOs = fallbackOs;
          }
        }

        if (stepsRes.status) this.emitDescriptionIfPresent(stepsRes.data);
        if (stepsRes.status && Array.isArray(stepsRes.data?.steps) && stepsRes.data.steps.length) {
          this.fixVulnData = {
            ...this.fixVulnData,
            assigned_team: stepsRes.data.assigned_team || this.fixVulnData?.assigned_team || '',
            assigned_team_members:
              stepsRes.data.steps[0]?.assigned_team_members
              || this.fixVulnData?.assigned_team_members
              || [],
            solution: this.fixVulnData?.solution || '',
          };
          this.applyStepsFromApi(stepsRes.data);
        } else {
          console.warn('[ManualFix] No steps returned for fixId:', fixId, 'os:', primaryOs);
        }
      } finally {
        this.loadingFixVuln = false;
      }
    },
    async initAdminFixVuln() {
      if (this.isUser || !this.vulnName || !this.assetIp) return;

      const seq = ++this._fixInitSeq;
      const knownFixId = this.fixId || this.fixVulnerabilityId;
      this.loadingFixVuln = true;
      this.fixNotStarted = false;
      if (!knownFixId) {
        this.fixVulnerabilityId = null;
        this.fixVulnData = null;
        this.subtasks = [];
      }

      try {
        // Ensure we create/lookup against the latest uploaded report (not a stale localStorage id).
        await this.authStore.resolveReportId();
        if (seq !== this._fixInitSeq) return;

        let preloadedId = this.fixId || '';
        if (!preloadedId) {
          preloadedId = await this.authStore.resolveAdminFixVulnerabilityId(
            this.assetIp,
            this.vulnName,
            {
              severity: this.severity,
              vulnId: this.vulnId || undefined,
              allowCreate: false,
            },
          );
        }
        if (!preloadedId) {
          preloadedId = await this.authStore.resolveAdminFixVulnerabilityId(
            this.assetIp,
            this.vulnName,
            {
              severity: this.severity,
              vulnId: this.vulnId || undefined,
              allowCreate: true,
            },
          );
        }
        if (seq !== this._fixInitSeq) return;

        if (!preloadedId) {
          this.fixNotStarted = true;
          return;
        }

        if (this.fixVulnerabilityId === preloadedId && this.subtasks.length) {
          return;
        }

        this.fixVulnerabilityId = preloadedId;

        const stepsRes = await this.authStore.getFixVulnerabilitySteps(preloadedId);
        if (seq !== this._fixInitSeq) return;
        if (stepsRes.status) this.emitDescriptionIfPresent(stepsRes.data);
        if (stepsRes.status && Array.isArray(stepsRes.data?.steps) && stepsRes.data.steps.length) {
          this.fixNotStarted = false;
          this.fixVulnData = {
            assigned_team: stepsRes.data.assigned_team || '',
            assigned_team_members: stepsRes.data.steps[0]?.assigned_team_members || [],
          };
          this.applyStepsFromApi(stepsRes.data);
          return;
        }

        // Fallback: card endpoint often has agent-generated remediation when step-complete is empty/404.
        const cardRes = await this.authStore.fetchFixVulnerabilityCardDetails(preloadedId);
        if (seq !== this._fixInitSeq) return;
        const cardData = cardRes.status ? cardRes.data : null;
        this.emitDescriptionIfPresent(cardData);
        const cardSteps = Array.isArray(cardData?.steps) ? cardData.steps : [];
        if (cardSteps.length) {
          this.fixNotStarted = false;
          this.fixVulnData = {
            solution: cardData?.solution || '',
            assigned_team: cardData?.assigned_team || '',
            assigned_team_members: cardSteps[0]?.assigned_team_members || [],
          };
          this.applyStepsFromApi({
            steps: cardSteps,
            next_step: cardData?.next_step,
            assigned_team: cardData?.assigned_team,
          });
          return;
        }

        if (stepsRes.notFound && !cardData) {
          this.fixNotStarted = true;
          this.subtasks = [];
        } else {
          // Fix session exists (agent created it) but steps not populated yet.
          this.fixNotStarted = false;
          this.subtasks = [];
          if (cardData) {
            this.fixVulnData = {
              solution: cardData.solution || '',
              assigned_team: cardData.assigned_team || '',
              assigned_team_members: cardData.assigned_team_members || [],
            };
          }
        }
      } finally {
        if (seq === this._fixInitSeq) this.loadingFixVuln = false;
      }
    },
    mapApiStepToPanel(step, osKey = this.selectedOs) {
      const os = step[osKey] || step.linux || step.windows || {};
      const commands = (os.commands_for_action || [])
        .map(g => {
          const cmds = (g.commands || []).join('\n');
          return g.label ? `# ${g.label}\n${cmds}` : cmds;
        })
        .join('\n\n');
      let filePath = '';
      if (this.isUser) {
        filePath = (os.system_file_path
          && os.system_file_path !== 'N/A — checking registry'
          && os.system_file_path !== 'N/A — checking network connections'
          && os.system_file_path !== 'N/A — checking services'
          && os.system_file_path !== 'N/A — updating services')
          ? os.system_file_path
          : '';
      } else {
        const rawFilePath = os.system_file_path || '';
        const skippedFilePaths = new Set([
          'N/A — checking registry',
          'N/A — checking network connections',
          'N/A — checking services',
          'N/A — updating services',
        ]);
        if (rawFilePath === 'N/A') {
          filePath = 'N/A — command line action';
        } else if (rawFilePath && !skippedFilePaths.has(rawFilePath)) {
          filePath = rawFilePath;
        }
      }
      return {
        id: step.step_number,
        name: os.task_name || step.step_name || `Step ${step.step_number}`,
        category: (os.artifacts_tools_used || [])[0] || '',
        assignedTeam: this.isUser
          ? (step.assigned_team || '')
          : (step.assigned_team || os.assigned_to || ''),
        members: step.assigned_team_members || [],
        status: this.normalizeStepStatus(step.status),
        action: os.action || '',
        filePath,
        command: commands,
        expectedOutput: os.expected_output || '',
        verificationCheck: os.verification_check || os.verification_steps || '',
        whereToRun: os.where_to_run || '',
        whereToRunLabel: os.where_to_run_label || '',
        tools: os.artifacts_tools_used || [],
        consideration: os.important_consideration || '',
        howToRun: os.how_to_run || '',
        subTasks: os.sub_tasks || step.sub_tasks || [],
        isLocked: false,
        isCurrent: !!step.is_current,
        deadline: step.deadline || '',
        submitting: false,
        isExpanded: false,
      };
    },
    toggleTask(stepId) {
      const step = this.subtasks.find(s => s.id === stepId);
      if (step) step.isExpanded = !step.isExpanded;
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
    async toggleStepComplete(task) {
      if (task.status === 'completed' || !this.fixVulnerabilityId) {
        if (!this.fixVulnerabilityId) {
          Swal.fire({ icon: 'warning', title: 'Loading...', text: 'Fix session is loading. Please wait a moment and try again.', timer: 2000, showConfirmButton: false });
        }
        return;
      }

      const taskIdx = this.subtasks.findIndex(s => s.id === task.id);
      if (taskIdx < 0) return;

      const step = this.subtasks[taskIdx];
      step.submitting = true;

      try {
        let res;
        if (this.isUser) {
          res = await this.authStore.completeUserFixVulnerabilityStep(
            this.fixVulnerabilityId,
            { status: 'completed', comment: '' },
            this.selectedOs,
          );
        } else {
          res = await this.authStore.completeFixVulnerabilityStep(
            this.fixVulnerabilityId,
            { status: 'completed', comment: '' },
          );
        }

        if (res.status) {
          step.submitting = false;
          if (this.isUser) {
            this.applyStepProgressFromPost(res);
          }
          await this.refreshStepsFromApi(this.isUser ? res : null);
          if (
            this.isUser
            && (res.all_steps_completed
              || String(res.vulnerability_status || '').toLowerCase() === 'closed')
          ) {
            Swal.fire({
              icon: 'success',
              title: 'Vulnerability closed',
              text: res.message || 'All steps done. Case closed — you can Send for retest if needed.',
              timer: 2800,
              showConfirmButton: false,
            });
          }
        } else {
          step.submitting = false;
          // Race / already-done / generic miss — data still loads, don't flash this popup.
          const msg = String(res.message || '');
          const skipPopup =
            !msg ||
            /^failed to complete step$/i.test(msg) ||
            /already (completed|done|saved|marked)|step already|already closed|not found/i.test(msg);
          if (!skipPopup) {
            Swal.fire({ icon: 'error', title: 'Failed', text: msg, timer: 2000, showConfirmButton: false });
          }
        }
      } catch {
        step.submitting = false;
      }
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
      if (!this.fixVulnerabilityId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Fix vulnerability session not loaded. Please refresh and try again.', timer: 2500, showConfirmButton: false });
        return;
      }
      try {
        const res = await this.authStore.completeUserFixVulnerabilityStep(
          this.fixVulnerabilityId,
          { complete_all: true, comment: 'All done at once' },
          this.selectedOs,
        );
        if (res.status) {
          this.applyStepProgressFromPost(res);
          await this.refreshStepsFromApi(res);
          const closed =
            res.all_steps_completed
            || String(res.vulnerability_status || '').toLowerCase() === 'closed';
          Swal.fire({
            icon: 'success',
            title: closed ? 'Vulnerability closed' : 'All steps completed',
            text: closed
              ? (res.message || 'All steps done. Case closed — you can Send for retest if needed.')
              : (res.message || 'All steps completed.'),
            timer: 2800,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Failed', text: res.message || 'Failed to complete all steps', timer: 2000, showConfirmButton: false });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Network error — please try again.', timer: 2000, showConfirmButton: false });
      }
    },
    async requestRetestForSteps() {
      if (!this.fixVulnerabilityId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Fix vulnerability session not loaded. Please refresh and try again.', timer: 2500, showConfirmButton: false });
        return;
      }
      if (!this.showSendForRetest) return;
      if (this.authStore.automationPremiumRequired) {
        Swal.fire({
          icon: 'info',
          title: 'Retest not allowed',
          text: FREEMIUM_RETEST_MESSAGE,
          confirmButtonColor: '#241447',
        });
        return;
      }
      this.requestingRetest = true;
      try {
        const res = await this.authStore.sendUserFixVerification(this.fixVulnerabilityId);
        if (res.status) {
          const nextStatus = String(
            res.vulnerability_status || 'open/review',
          ).toLowerCase();
          this.vulnerabilityStatus = nextStatus;
          this.$emit('vulnerability-status-changed', {
            vulnName: this.vulnName,
            assetIp: this.assetIp,
            status: nextStatus,
            all_steps_completed: true,
          });
          Swal.fire({
            icon: 'success',
            title: 'Sent for retest',
            text: res.message || 'Retest request sent. Status is now open/review.',
            timer: 3000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Retest not allowed',
            text: res.message || FREEMIUM_RETEST_MESSAGE,
            confirmButtonColor: '#241447',
          });
        }
      } catch {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Network error — please try again.', timer: 2000, showConfirmButton: false });
      } finally {
        this.requestingRetest = false;
      }
    },
    isStepSupportRaised(stepId) {
      return this.raisedSupportSteps.includes(Number(stepId));
    },
    async loadRaisedSupportSteps() {
      if (!this.isUser || !this.assetIp || !this.vulnName) {
        this.raisedSupportSteps = [];
        return;
      }
      const res = await this.authStore.getUserSupportRequestsByHost(this.assetIp, this.authStore.userSelectedTeam);
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
      const completedSteps = this.subtasks
        .filter(t => t.status === 'completed')
        .map(t => Number(t.id))
        .filter(n => Number.isFinite(n));
      this.$emit('open-support-modal', {
        vulnName: this.vulnName,
        step: task.id,
        completedSteps,
        raisedSupportSteps: this.raisedSupportSteps,
      });
    },
  },
};
</script>

<style>
@import '@/components/assets/manual-fix-steps.css';

.mf-fix-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 13px;
  color: #49454f;
}

.mf-not-started {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 20px;
  margin-bottom: 8px;
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
  border-radius: 10px;
  color: #64748b;
}
.mf-not-started-icon {
  font-size: 28px;
  color: #94a3b8;
  flex-shrink: 0;
}
.mf-not-started-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.mf-not-started-title {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
}
.mf-not-started-sub {
  font-size: 12.5px;
  color: #94a3b8;
}

.mf-fix-info-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mf-fix-info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mf-step-card--current .mf-step-head {
  border-left: 3px solid #0f696e;
}

.mf-step-done-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #166534;
  background: #dcfce7;
  border-radius: 4px;
  padding: 2px 8px;
  letter-spacing: 0.02em;
}

.mf-step-current-badge {
  font-size: 10px;
  font-weight: 700;
  background: #0f696e;
  color: #fff;
  padding: 1px 7px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.mf-complete-btn--done {
  background: #dcfce7 !important;
  color: #16a34a !important;
  border-color: #16a34a !important;
  cursor: default !important;
}

.mf-complete-btn--locked {
  opacity: 0.45;
  cursor: not-allowed !important;
}
</style>
