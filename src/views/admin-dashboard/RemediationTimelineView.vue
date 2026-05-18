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
          <div class="col-11 rt-content">

            <!-- Page Header -->
            <div class="rt-page-header">
              <div>
                <div class="rt-header-chips">
                  <span class="rt-chip rt-chip-risk" :class="riskChipClass">{{ (currentVuln.risk || 'Risk').toUpperCase() }}</span>
                  <span class="rt-chip rt-chip-status" :class="statusChipClass">{{ remediationStatusLabel }}</span>
                  <span class="rt-chip rt-chip-asset">
                    <i class="bi bi-hdd-network me-1"></i>{{ currentVuln.asset || asset }}
                  </span>
                </div>
                <h2 class="rt-title">Vulnerability Remediation</h2>
                <p class="rt-subtitle">Execute the defined steps to mitigate the identified vulnerability on the target endpoint.</p>
              </div>
              <div class="d-flex gap-2">
                <button class="rt-btn-support" @click="openSupportModal">
                  Support Request
                  <span class="rt-support-count-badge">{{ supportRequestCount }}</span>
                </button>
              </div>
            </div>

            <!-- Support Modal -->
            <div class="modal fade" id="rtSupportModal" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content vc-modal-content">
                  <div class="modal-header vc-modal-header">
                    <h5 class="modal-title vc-modal-title">Support Requests (Read-Only)</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body p-4">
                    <h6 class="vc-modal-section-label mb-3">Raised support requests by step</h6>
                    <div class="row g-2 mt-1">
                      <div class="col-4" v-for="n in totalSteps" :key="n">
                        <span class="vc-step-pill"
                          :class="[
                            selectedSteps.includes(n) ? 'vc-step-pill-active' : '',
                            raisedSupportSteps.includes(n) ? 'vc-step-pill-raised' : ''
                          ]"
                          style="cursor:pointer;"
                          @click="toggleStep(n)">
                          Step {{ n }}
                        </span>
                      </div>
                    </div>
                    <p class="vc-modal-section-label mt-4 mb-2">Description</p>
                    <textarea v-model="supportDescription" class="vc-textarea" rows="4"
                      placeholder="Select a highlighted step to view description" readonly></textarea>
                  </div>
                  <div class="modal-footer vc-modal-footer">
                    <button class="vc-btn-secondary" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading overlay -->
            <div v-if="isLoading" class="rt-loading-overlay">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-3 text-muted">Creating fix vulnerability...</p>
            </div>

            <!-- Stepper -->
            <div v-if="!isLoading" class="rt-stepper-wrap">
              <div class="rt-stepper-head">
                <h3 class="rt-stepper-title">Remediation Path</h3>
                <span class="rt-stepper-count">Step {{ currentStep }} of {{ totalSteps }}</span>
              </div>
              <div class="rt-stepper">
                <template v-for="step in totalSteps" :key="step">
                  <!-- Circle -->
                  <div class="rt-step-circle-wrap">
                    <div
                      class="rt-step-circle"
                      :class="{
                        'rt-circle-done':    completedSteps.includes(step),
                        'rt-circle-active':  step === currentStep,
                        'rt-circle-pending': !completedSteps.includes(step) && step !== currentStep
                      }"
                    >
                      <span class="rt-step-num">{{ step }}</span>
                    </div>
                    <div v-if="step === currentStep" class="rt-active-label">UPDATE CONFIGURATION</div>
                  </div>
                  <!-- Connector line after each step (except last) -->
                  <div
                    v-if="step < totalSteps"
                    class="rt-step-line"
                    :class="completedSteps.includes(step) ? 'rt-line-done' : 'rt-line-pending'"
                  ></div>
                </template>
              </div>
            </div>

            <!-- Body: 2-column grid -->
            <div v-if="!isLoading" class="rt-body">

              <!-- ── LEFT COLUMN ── -->
              <div class="rt-main-col">

                <!-- Technical Insight Card -->
                <div class="rt-tech-card">
                  <!-- Label inside card -->
                  <div class="rt-tech-label-wrap">
                    <i class="bi bi-display rt-tech-label-icon"></i>
                    <span class="rt-tech-label-text">Technical Insight</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-start">
                    <!-- Left: Impacted Asset → Severity → Vuln Name -->
                    <div class="rt-tech-left">
                      <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span class="rt-label-text">Impacted Asset:</span>
                        <span class="rt-asset-chip">{{ currentVuln.asset }}</span>
                      </div>
                      <h3 class="rt-vuln-name">{{ currentVuln.name }}</h3>
                      <div v-if="currentVuln.description" class="rt-vuln-desc-wrap">
                        <h5 class="rt-vuln-desc-title">Description</h5>
                        <p class="rt-vuln-desc-text">{{ getVulnDisplayDescription() }}</p>
                        <button
                          v-if="showVulnReadMore()"
                          type="button"
                          class="rt-btn-read-more"
                          @click="toggleVulnDescription"
                        >
                          {{ vulnDescriptionExpanded ? 'Read less' : 'Read more' }}
                        </button>
                      </div>
                    </div>
                    <!-- Right: REMEDIATION PROGRESS -->
                    <div class="rt-tech-right">
                      <span class="rt-progress-label">REMEDIATION PROGRESS</span>
                      <div class="rt-progress-num">
                        {{ progressPercent }}<span class="rt-progress-pct">%</span>
                      </div>
                    </div>
                  </div>
                  <!-- Meta row: Team / Deadline / OS / Tools -->
                  <div class="rt-tech-meta-row mt-3">
                    <div v-if="currentVuln.assignedTeam" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">ASSIGNED TEAM</span>
                      <span class="rt-team-chip" :class="getTeamChipClass(currentVuln.assignedTeam)">
                        <i class="bi bi-people-fill me-1"></i>{{ currentVuln.assignedTeam }}
                      </span>
                    </div>
                    <!-- <div v-if="currentVuln.deadline" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">DEADLINE</span>
                      <span class="rt-tech-meta-val">{{ currentVuln.deadline }}</span>
                    </div> -->
                    <div v-if="currentVuln.operatingSystem" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">OS</span>
                      <div class="d-inline-block mt-1">
                        <span class="rt-tool-chip">{{ currentVuln.operatingSystem }}</span>
                      </div>
                    </div>
                    <div v-if="currentVuln.artifactsTools" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">ARTIFACTS / TOOLS</span>
                      <div class="d-flex flex-wrap gap-2 mt-1">
                        <span v-for="(tool, idx) in parseTools(currentVuln.artifactsTools)" :key="idx" class="rt-tool-chip">
                          {{ tool }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Remediation Sub-Tasks Card -->
                <div class="rt-subtasks-card">
                  <div class="rt-subtasks-header">
                    <span class="rt-subtasks-title">
                      Remediation Sub-Tasks ({{ subtasks.length }})
                    </span>
                    <span class="rt-tasks-completed">{{ completedSubtasksCount }} tasks completed</span>
                  </div>

                  <div class="rt-task-list">
                    <div
                      v-for="(task, idx) in subtasks"
                      :key="task.id"
                      class="rt-task-item"
                      :class="{ 'rt-task-completed': task.status === 'completed' }"
                    >
                      <!-- Task summary row: whole header toggles; expanded body is separate (clicks inside do not close) -->
                      <div
                        class="rt-task-row"
                        role="button"
                        tabindex="0"
                        :aria-expanded="expandedTasks.includes(idx) ? 'true' : 'false'"
                        :aria-label="'Toggle details for ' + (task.name || 'step')"
                        @click="toggleTask(idx)"
                        @keydown.enter.prevent="toggleTask(idx)"
                        @keydown.space.prevent="toggleTask(idx)"
                      >
                        <div class="rt-task-left">
                          <div
                            class="rt-task-circle"
                            :class="{ 'rt-circle-task-done': task.status === 'completed' }"
                          >
                            <i v-if="task.status === 'completed'" class="bi bi-check-lg"></i>
                            <span v-else>{{ task.id }}</span>
                          </div>
                          <div class="rt-task-info">
                            <span class="rt-task-name">{{ task.name }}</span>
                            <!-- <span class="rt-task-assignee">{{ task.assignedTeam }}</span> -->
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2 rt-task-right">
                          <span v-if="task.status === 'completed'" class="rt-step-status-badge rt-status-done">Completed</span>
                          <span v-else class="rt-step-status-badge rt-status-pending-red">Pending</span>
                          <div class="rt-task-chevron" :class="{ 'rt-chevron-open': expandedTasks.includes(idx) }">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                              <path d="M4 6L8 10L12 6" stroke="#94a3b8" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <!-- Expanded detail panel -->
                      <div v-if="expandedTasks.includes(idx)" class="rt-task-expanded" @click.stop>

                        <div class="rt-exp-primary-stack">
                          <!-- ROW 1: ACTION | ASSIGNED TO -->
                          <div class="rt-exp-row2">
                            <div class="rt-exp-cell">
                              <span class="rt-exp-label">ACTION</span>
                              <p class="rt-exp-text rt-exp-pretext">{{ cleanText(task.action) }}</p>
                              <!-- SUB-TASKS under ACTION -->
                              <div v-if="task.subTasks && task.subTasks.length" class="mt-3">
                                <span class="rt-exp-label">SUB-TASKS</span>
                                <div class="rt-subtask-list mt-1">
                                  <div v-for="(sub, si) in task.subTasks" :key="si" class="rt-subtask-entry" @click.stop>
                                    <div v-if="!sub.items || sub.items.length === 0" class="rt-subtask-dash">-</div>
                                    <div v-else class="d-flex align-items-center gap-2">
                                      <input type="checkbox" class="rt-checkbox" />
                                      <span class="rt-subtask-desc">{{ sub.description }}</span>
                                    </div>
                                    <div v-if="sub.items && sub.items.length > 0" class="rt-checklist mt-1 ps-4">
                                      <label v-for="(item, ii) in sub.items" :key="ii" class="rt-check-item">
                                        <input type="checkbox" class="rt-checkbox" /><span>{{ item }}</span>
                                      </label>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="rt-exp-cell rt-exp-cell-divider" v-if="task.assignedTeam || (task.members && task.members.length)">
                              <span class="rt-exp-label">ASSIGNED TO</span>
                              <p class="rt-exp-text" :class="getTeamTextClass(task.assignedTeam)" v-if="task.assignedTeam">{{ task.assignedTeam }}</p>
                              <div v-if="task.members && task.members.length" class="d-flex flex-wrap gap-2 mt-2">
                                <span v-for="m in task.members" :key="m.user_id" class="rt-member-chip">
                                  <i class="bi bi-person-fill me-1"></i>{{ m.name }}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>

                        <!-- FILE PATH (outside grey stack; same column + padding as ACTION) -->
                        <div v-if="task.filePath && task.filePath !== 'N/A'" class="rt-exp-filepath-row">
                          <div class="rt-exp-filepath-col">
                            <span class="rt-exp-label">FILE PATH</span>
                            <div class="rt-filepath-wrapper">
                              <div class="rt-exp-filepath">{{ task.filePath }}</div>
                              <button class="rt-copy-btn-sm" @click.stop="copyCommand(task.filePath)" title="Copy to clipboard">
                                <i class="bi bi-clipboard"></i>
                              </button>
                            </div>
                          </div>
                          <div class="rt-exp-filepath-spacer" aria-hidden="true"></div>
                        </div>

                        <!-- WHERE TO RUN -->
                        <div v-if="(task.whereToRunLabel || task.whereToRun) && (task.whereToRunLabel || task.whereToRun) !== 'N/A'" class="rt-exp-section">
                          <span class="rt-exp-label">WHERE TO RUN</span>
                          <p class="rt-exp-text">{{ task.whereToRunLabel || task.whereToRun }}</p>
                        </div>

                        <!-- COMMAND TO RUN -->
                        <div v-if="task.command && task.command !== 'N/A'" class="rt-exp-section">
                          <span class="rt-exp-label">COMMAND TO RUN</span>
                          <div class="rt-exp-code-block rt-exp-code-copy">
                            <span v-text="formatCommandToRun(task.command)"></span>
                            <button class="rt-exp-copy-btn" @click.stop="copyCommand(formatCommandToRun(task.command))" title="Copy">
                              <i class="bi bi-clipboard"></i>
                            </button>
                          </div>
                        </div>

                        <!-- ROW 2: EXPECTED OUTPUT | VERIFICATION CHECK -->
                        <div class="rt-exp-row2" v-if="(task.expectedOutput && task.expectedOutput !== 'N/A') || (task.verificationCheck && task.verificationCheck !== 'N/A')">
                          <div class="rt-exp-cell" v-if="task.expectedOutput && task.expectedOutput !== 'N/A'">
                            <span class="rt-exp-label">EXPECTED OUTPUT</span>
                            <p class="rt-exp-text rt-exp-pretext">{{ cleanText(task.expectedOutput) }}</p>
                          </div>
                          <div class="rt-exp-cell rt-exp-cell-divider" v-if="task.verificationCheck && task.verificationCheck !== 'N/A'">
                            <div class="rt-exp-verify-head">
                              <span class="rt-exp-label">VERIFICATION CHECK</span>
                              <button type="button" class="rt-exp-verify-copy" @click.stop="copyCommand(cleanText(task.verificationCheck))" title="Copy to clipboard">
                                <i class="bi bi-clipboard"></i>
                              </button>
                            </div>
                            <div class="rt-exp-verify-wrap">
                              <span class="rt-exp-verify-body">{{ cleanText(task.verificationCheck) }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- ARTEFACTS & TOOLS -->
                        <div v-if="task.tools && task.tools.length" class="rt-exp-section">
                          <span class="rt-exp-label">ARTEFACTS &amp; TOOLS USED</span>
                          <div class="d-flex flex-wrap gap-2 mt-1">
                            <span v-for="tool in task.tools" :key="tool" class="rt-tool-chip">{{ tool }}</span>
                          </div>
                        </div>

                        <!-- IMPORTANT CONSIDERATIONS -->
                        <div v-if="task.consideration" class="rt-exp-consideration">
                          <div class="rt-exp-consideration-hd">
                            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            IMPORTANT CONSIDERATIONS
                          </div>
                          <p class="rt-exp-consideration-text rt-exp-pretext">{{ cleanText(task.consideration) }}</p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <!-- Final Feedback Card (shown when all steps completed) -->
                <div v-if="showFeedback" class="rt-feedback-card">
                  <div class="rt-feedback-header">
                    <span class="rt-feedback-emoji">🎉</span>
                    <h5 class="rt-feedback-title mb-0">Vulnerability Closed</h5>
                    <span class="rt-admin-readonly-badge">
                      <i class="bi bi-lock-fill me-1"></i>Read-Only
                    </span>
                  </div>

                  <!-- Loading -->
                  <div v-if="loadingFeedback" class="text-muted small py-2">
                    <span class="spinner-border spinner-border-sm me-2"></span>Loading feedback...
                  </div>

                  <!-- Feedback available -->
                  <div v-else-if="finalFeedbackData">
                    <div class="rt-feedback-row">
                      <div class="rt-feedback-field">
                        <p class="rt-fb-label">RESULT</p>
                        <span class="rt-fb-result-badge">{{ finalFeedbackData.fix_result }}</span>
                      </div>
                      <div class="rt-feedback-field" v-if="finalFeedbackData.submitted_at">
                        <p class="rt-fb-label">SUBMITTED AT</p>
                        <p class="rt-fb-value">{{ new Date(finalFeedbackData.submitted_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</p>
                      </div>
                      <div class="rt-feedback-field" v-if="currentVuln.closed_at">
                        <p class="rt-fb-label">CLOSED AT</p>
                        <p class="rt-fb-value">{{ new Date(currentVuln.closed_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</p>
                      </div>
                    </div>
                    <div v-if="finalFeedbackData.feedback_comment" class="mt-3">
                      <p class="rt-fb-label">FEEDBACK COMMENT</p>
                      <p class="rt-fb-value">{{ finalFeedbackData.feedback_comment }}</p>
                    </div>
                  </div>

                  <!-- No feedback yet -->
                  <div v-else class="rt-feedback-empty">
                    <i class="bi bi-hourglass-split me-2"></i>
                    Awaiting user feedback submission.
                  </div>
                </div>

              </div>
              <!-- /rt-main-col -->

              <!-- ── RIGHT SIDEBAR ── -->
              <div class="rt-sidebar">

                <!-- Activity Timeline Card -->
                <div class="rt-timeline-card">
                  <span class="rt-card-heading">ACTIVITY TIMELINE</span>

                  <!-- Loading -->
                  <div v-if="timelineLoading" class="text-muted small py-3 text-center">
                    <span class="spinner-border spinner-border-sm me-1"></span> Loading...
                  </div>

                  <!-- Empty -->
                  <div v-else-if="!timeline.length" class="text-muted small py-3 text-center">
                    No timeline events yet.
                  </div>

                  <!-- Timeline list -->
                  <div v-else class="rt-tl-list">
                    <div
                      v-for="(item, idx) in timeline"
                      :key="idx"
                      class="rt-tl-item"
                      :class="{ 'rt-tl-item-last': idx === timeline.length - 1 }"
                    >
                      <div class="rt-tl-dot-col">
                        <div class="rt-tl-dot" :style="{ backgroundColor: item.color }"></div>
                        <div v-if="idx < timeline.length - 1" class="rt-tl-connector"></div>
                      </div>
                      <div class="rt-tl-content">
                        <span class="rt-tl-time">{{ item.time }}</span>
                        <span class="rt-tl-event">{{ item.event }}</span>
                        <span v-if="item.desc" class="rt-tl-desc">{{ item.desc }}</span>
                      </div>
                    </div>
                  </div>
                </div>



              </div>
              <!-- /rt-sidebar -->

            </div>
            <!-- /rt-body -->

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';
import { getTeamChipClass, getTeamTextClass } from '@/utils/teamColors';
import Swal from 'sweetalert2';

export default {
  name: 'RemediationTimelineView',
  components: { DashboardMenu, DashboardHeader },

  props: {
    reportId: { type: String, required: true },
    asset: { type: String, required: true },
  },

  data() {
    return {
      authStore: useAuthStore(),
      currentStep: 1,
      totalSteps: 8,
      completedSteps: [],
      expandedTasks: [],
      selectedSteps: [],
      raisedSupportSteps: [],
      supportRequestsByStep: {},
      supportRequestCount: 0,
      supportDescription: "",
      supportDetail: null,
      isLoading: false,
      createError: null,
      finalFeedbackData: null,
      loadingFeedback: false,
      timelineLoading: false,
      vulnDescriptionExpanded: false,
      descriptionPreviewLimit: 280,
      currentVuln: {
        id: null,
        name: '',
        description: '',
        risk: '',
        asset: '',
        report_id: null,
        progress: 0,
        assignedTeam: '',
        deadline: '',
        artifactsTools: '',
        operatingSystem: '',
        status: '',
        closed_at: null,
      },
      subtasks: [],
      timeline: [],
      uptime: 99.98,
      riskScore: 8.2,
    };
  },

  methods: {
    parseTools(toolsString) {
      if (!toolsString) return [];
      return String(toolsString)
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);
    },
    getTeamChipClass,
    getTeamTextClass,
    resolveRouteDescription() {
      const fromQuery = this.$route.query.description;
      if (fromQuery) return this.cleanText(String(fromQuery));

      const name = String(this.$route.query.plugin_name || '').toLowerCase();
      if (name.includes('tls') && name.includes('1.0')) {
        return (
          'The remote service accepts connections encrypted with TLS version 1.0. TLS 1.0 has ' +
          'known cryptographic weaknesses. An attacker may be able to exploit these flaws to ' +
          'conduct man-in-the-middle attacks or decrypt communications between affected clients ' +
          'and the service. Organizations should disable TLS 1.0 and enforce TLS 1.2 or higher.'
        );
      }
      return '';
    },
    toggleVulnDescription() {
      this.vulnDescriptionExpanded = !this.vulnDescriptionExpanded;
    },
    getVulnDisplayDescription() {
      const fullText = this.cleanText(this.currentVuln.description) || '-';
      if (this.vulnDescriptionExpanded || fullText.length <= this.descriptionPreviewLimit) {
        return fullText;
      }
      return `${fullText.slice(0, this.descriptionPreviewLimit).trimEnd()}...`;
    },
    showVulnReadMore() {
      const text = this.cleanText(this.currentVuln.description) || '';
      return text.length > this.descriptionPreviewLimit;
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

      // Strip markdown code fences (```python, ```bash, ``` etc.)
      raw = raw.replace(/^```[\w]*\s*/i, '').replace(/\s*```$/i, '');
      // Replace <br> tags with newlines
      raw = raw.replace(/<br\s*\/?>/gi, '\n');
      // Strip any remaining HTML tags
      raw = raw.replace(/<[^>]+>/g, '');

      return raw.trim();
    },
    toggleStep(step) {
      if (this.selectedSteps.includes(step)) {
        this.selectedSteps = [];
        this.supportDetail = null;
        this.supportDescription = "";
      } else {
        this.selectedSteps = [step];
        const existingRequest = this.supportRequestsByStep[step];
        if (existingRequest) {
          this.supportDetail = existingRequest;
          this.supportDescription = existingRequest.description || "";
        } else {
          this.supportDetail = null;
          this.supportDescription = "";
        }
      }
    },
    async submitSupport() {
      if (!this.supportDescription.trim()) return;

      const vulnerabilityId = this.currentVuln?.id;
      if (!vulnerabilityId) {
        Swal.fire('Error', 'Vulnerability ID not found', 'error');
        return;
      }

      if (!this.selectedSteps.length) {
        Swal.fire('Error', 'Please select a step number', 'error');
        return;
      }

      const reportId = this.currentVuln?.report_id;
      if (!reportId) {
        Swal.fire('Error', 'Report ID not found', 'error');
        return;
      }

      const payload = {
        step_number: this.selectedSteps[0],
        description: this.supportDescription,
      };
      const res = await this.authStore.raiseSupportRequest(reportId, vulnerabilityId, payload);

      if (res.status) {
        this.supportDetail = res.data || null;
        await this.fetchSupportRequestMeta(vulnerabilityId, this.currentVuln?.asset);
        Swal.fire({ icon: 'success', title: 'Support Request Raised', timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire('Error', res.message || 'Failed to raise support request', 'error');
      }
    },
    async fetchSupportRequestMeta(vulnerabilityId, host) {
      const hostRes = host
        ? await this.authStore.getSupportRequestsByHost(host)
        : null;
      const vulRes = vulnerabilityId
        ? await this.authStore.getRaiseSupportRequestByVulnerability(vulnerabilityId)
        : null;

      if (hostRes?.status) {
        this.supportRequestCount = hostRes.count || 0;
      } else if (vulRes?.status) {
        this.supportRequestCount = vulRes.count || 0;
      } else {
        this.supportRequestCount = 0;
      }

      if (!vulRes?.status) {
        this.raisedSupportSteps = [];
        this.supportRequestsByStep = {};
        return;
      }

      this.supportRequestsByStep = {};
      (vulRes.results || []).forEach((item) => {
        const stepNumber = Number(item.step_number);
        if (Number.isFinite(stepNumber)) {
          this.supportRequestsByStep[stepNumber] = item;
        }
      });

      const raisedSteps = (vulRes.results || [])
        .map(item => Number(item.step_number))
        .filter(n => Number.isFinite(n));
      this.raisedSupportSteps = [...new Set(raisedSteps)];
    },
    async openSupportModal() {
      this.selectedSteps = [];
      this.supportDescription = "";
      this.supportDetail = null;

      const vulnerabilityId = this.currentVuln?.id;
      const host = this.currentVuln?.asset;
      await this.fetchSupportRequestMeta(vulnerabilityId, host);
      if (this.raisedSupportSteps.length) {
        const defaultStep = this.raisedSupportSteps[0];
        this.selectedSteps = [defaultStep];
        const existingRequest = this.supportRequestsByStep[defaultStep];
        this.supportDetail = existingRequest || null;
        this.supportDescription = existingRequest?.description || "";
      }

      await this.$nextTick();
      const modal = new bootstrap.Modal(document.getElementById('rtSupportModal'));
      modal.show();
    },
    async goToCreateTicket() {
      if (!this.currentVuln?.id || !this.currentVuln?.asset || !this.currentVuln?.report_id) {
        Swal.fire('Error', 'Vulnerability data not available', 'error');
        return;
      }
      this.$router.push({
        name: 'CreateTicket',
        params: {
          reportId: this.currentVuln.report_id,
          fixVulId: this.currentVuln.id,
          asset: encodeURIComponent(this.currentVuln.asset),
        },
      });
    },
    toggleTask(idx) {
      const i = this.expandedTasks.indexOf(idx);
      if (i === -1) {
        this.expandedTasks.push(idx);
      } else {
        this.expandedTasks.splice(i, 1);
      }
    },
    copyCommand(text) {
      const doFallback = () => {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        this.showCopyToast();
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.showCopyToast();
        }).catch(doFallback);
      } else {
        doFallback();
      }
    },
    showCopyToast() {
      const toast = document.createElement('div');
      toast.textContent = '✓ Copied to clipboard';
      toast.style.cssText = 'position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:#1e293b;color:#4ade80;padding:8px 20px;border-radius:8px;font-size:13px;font-weight:600;z-index:99999;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);
    },
    formatTimelineDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
    timelineIconColor(icon) {
      if (icon === 'check') return '#16a34a';
      if (icon === 'arrow') return '#0f696e';
      return '#94a3b8';
    },
    async fetchTimeline(fixVulId) {
      this.timelineLoading = true;
      const res = await this.authStore.fetchVulnerabilityTimeline(fixVulId);
      this.timelineLoading = false;
      if (res.status && res.data?.timeline) {
        const sorted = [...res.data.timeline].sort((a, b) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        this.timeline = sorted.map(item => ({
          time: this.formatTimelineDate(item.date),
          event: item.event,
          desc: item.assigned_team || (item.type === 'deadline' ? 'Scheduled deadline' : ''),
          color: this.timelineIconColor(item.icon),
          icon: item.icon,
          status: item.status,
        }));
      }
    },
    async fetchFinalFeedback(fixVulId) {
      this.loadingFeedback = true;
      const res = await this.authStore.getFixFinalFeedback(fixVulId);
      this.loadingFeedback = false;
      if (res.status && res.data?.final_feedback) {
        this.finalFeedbackData = res.data.final_feedback;
        // Also update currentVuln status/closed_at from response
        if (res.data.status) {
          this.currentVuln.status = res.data.status;
          this.currentVuln.closed_at = res.data.closed_at || null;
        }
      }
    },
  },

  computed: {
    remediationStatusLabel() {
      const status = String(this.currentVuln?.status || 'open').toLowerCase();
      if (status === 'closed') return 'CLOSED';
      if (status === 'in_progress' || status === 'in progress') return 'IN PROGRESS';
      return 'OPEN';
    },
    riskChipClass() {
      const risk = String(this.currentVuln?.risk || '').toLowerCase();
      if (risk.includes('critical')) return 'rt-chip-risk-critical';
      if (risk.includes('high')) return 'rt-chip-risk-high';
      if (risk.includes('medium')) return 'rt-chip-risk-medium';
      return 'rt-chip-risk-low';
    },
    statusChipClass() {
      const status = this.remediationStatusLabel;
      if (status === 'CLOSED') return 'rt-chip-status-closed';
      if (status === 'IN PROGRESS') return 'rt-chip-status-progress';
      return 'rt-chip-status-open';
    },
    progressPercent() {
      return Math.round((this.completedSteps.length / this.totalSteps) * 100);
    },
    completedSubtasksCount() {
      return this.completedSteps.length;
    },
    showFeedback() {
      return this.totalSteps > 0 && this.completedSteps.length >= this.totalSteps;
    },
  },

  async mounted() {
    const fixVulId = this.$route.query.fix_vul_id;
    const id = this.$route.query.id;
    const plugin_name = this.$route.query.plugin_name;
    const risk_factor = this.$route.query.risk_factor;

    if (fixVulId) {
      // HARDCODED DATA - Replacing API call
      this.isLoading = true;

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));

      this.isLoading = false;

      // Hardcoded vulnerability data
      this.currentVuln = {
        id: String(fixVulId),
        name: String(plugin_name || 'Apache Struts 2 CVE-2017-5638 Remote Code Execution'),
        description: this.resolveRouteDescription(),
        risk: `${String((risk_factor || 'CRITICAL').toString()).toUpperCase()} RISK`,
        asset: String(this.asset || '192.168.1.53'),
        report_id: String(this.reportId || 'RPT-2024-001'),
        progress: 0,
        assignedTeam: 'Network Security Team',
        deadline: '2024-12-31',
        artifactsTools: 'iptables, nmap, curl',
        operatingSystem: 'Linux',
        status: 'in_progress',
      };

      this.totalSteps = 3;
      this.currentStep = 1;
      this.completedSteps = [];

      // Hardcoded steps data
      this.subtasks = [
        {
          id: 1,
          name: 'Emergency network isolation',
          assignedTeam: 'Network Security Team',
          members: [
            { user_id: 1, name: 'John Doe' },
            { user_id: 2, name: 'Jane Smith' }
          ],
          status: 'pending',
          deadline: '2024-12-31',
          criticality: 'critical',
          effortEstimate: '2 hours',
          action: 'Block all inbound TCP traffic to port 5985 immediately',
          filePath: '/etc/iptables/rules.v4 (or network firewall ACL)',
          command: `# On 192.168.1.53
iptables -I INPUT 1 -p tcp --dport 5985 -j DROP
iptables -I OUTPUT 1 -p tcp --sport 5985 -m state --state ESTABLISHED -j ACCEPT
iptables-save | tee /etc/iptables/rules.v4

# On network firewall (Cisco IOS example)
ip access-list extended BLOCK_STRUTS
  deny tcp any host 192.168.1.53 eq 5985
  permit ip any any`,
          expectedOutput: "Port 5985 shows as 'filtered' from all external sources",
          verificationCheck: "nmap -Pn -p 5985 192.168.1.53 # Expected: 5985/tcp filtered wsman\ncurl --connect-timeout 3 http://192.168.1.53:5985/ && echo STILL_OPEN || echo BLOCKED",
          whereToRunLabel: '192.168.1.53 (SSH as root) AND network firewall console',
          whereToRun: '192.168.1.53 (SSH as root) AND network firewall console',
          tools: ['iptables', 'nmap', 'curl', 'netfilter-persistent'],
          consideration: 'Port 5985 is the Windows Remote Management (WinRM) default port — confirm what service is actually running here. Apache Struts normally runs on 8080 or 443. The Nessus finding on port 5985 may indicate a non-standard deployment.',
          subTasks: [],
        },
        {
          id: 2,
          name: 'Configuration Management',
          assignedTeam: 'DevOps Team',
          members: [
            { user_id: 3, name: 'Mike Johnson' }
          ],
          status: 'pending',
          deadline: '2024-12-31',
          criticality: 'high',
          effortEstimate: '1 hour',
          action: 'Update system configuration to disable vulnerable service',
          filePath: 'C:\\temp\\cipher_before.txt',
          command: 'nmap -sV -p 5985 192.168.1.53',
          expectedOutput: 'The command completes without error messages. Confirm the change is applied as described in this step.',
          verificationCheck: 'Check that the change is in place and there are no error messages or warnings.',
          whereToRunLabel: 'Terminal / Command Prompt (open the terminal on your system)',
          whereToRun: 'Terminal / Command Prompt',
          tools: ['nmap'],
          consideration: 'Ensure output path is writable',
          subTasks: [
            {
              description: 'Backup current configuration',
              items: [
                'Create backup of existing configuration',
                'Verify backup integrity',
                'Store backup in secure location'
              ]
            }
          ],
        },
        {
          id: 3,
          name: 'Patch Apache Struts to latest version',
          assignedTeam: 'Application Team',
          members: [
            { user_id: 4, name: 'Sarah Williams' },
            { user_id: 5, name: 'Tom Brown' }
          ],
          status: 'pending',
          deadline: '2024-12-31',
          criticality: 'critical',
          effortEstimate: '3 hours',
          action: 'Upgrade Apache Struts framework to version 2.5.33 or later to patch CVE-2017-5638',
          filePath: '/opt/application/pom.xml',
          command: `# Backup current application
cp -r /opt/application /opt/application.backup

# Update pom.xml with latest Struts version
sed -i 's/<struts2.version>.*<\\/struts2.version>/<struts2.version>2.5.33<\\/struts2.version>/g' /opt/application/pom.xml

# Rebuild application
cd /opt/application
mvn clean package

# Deploy updated WAR file
cp target/application.war /opt/tomcat/webapps/`,
          expectedOutput: 'Application successfully rebuilt with Struts 2.5.33. WAR file deployed to Tomcat.',
          verificationCheck: 'curl http://192.168.1.53:8080/application/ | grep "Struts 2.5.33"\nnmap --script http-vuln-cve2017-5638 192.168.1.53 -p 8080',
          whereToRunLabel: '192.168.1.53 (SSH as application user)',
          whereToRun: '192.168.1.53 (SSH as application user)',
          tools: ['maven', 'nmap', 'curl', 'tomcat'],
          consideration: 'This will require application downtime. Schedule during maintenance window. Ensure all dependencies are compatible with Struts 2.5.33 before upgrading.',
          subTasks: [
            {
              description: 'Pre-deployment checks',
              items: [
                'Review application dependencies',
                'Run compatibility tests',
                'Notify stakeholders of maintenance window'
              ]
            },
            {
              description: 'Post-deployment verification',
              items: [
                'Run security scan to confirm vulnerability is patched',
                'Verify application functionality',
                'Monitor application logs for errors'
              ]
            }
          ],
        },
      ];

      this.currentVuln.progress = this.totalSteps > 0
        ? Math.round((this.completedSteps.length / this.totalSteps) * 100)
        : 0;

      await this.fetchTimeline(String(fixVulId));
      await this.fetchSupportRequestMeta(String(fixVulId), this.currentVuln.asset);

      return;
    }

    // HARDCODED DATA - Second path (when no fix_vul_id)
    this.isLoading = true;

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    this.isLoading = false;

    // Use hardcoded data
    this.currentVuln = {
      id: 'HARDCODED_FIX_001',
      name: String(plugin_name || 'Apache Struts 2 CVE-2017-5638 Remote Code Execution'),
      description: this.resolveRouteDescription(),
      risk: `${String((risk_factor || 'CRITICAL').toString()).toUpperCase()} RISK`,
      asset: String(this.asset || '192.168.1.53'),
      report_id: String(this.reportId || 'RPT-2024-001'),
      progress: 0,
      assignedTeam: 'Network Security Team',
      deadline: '2024-12-31',
      artifactsTools: 'iptables, nmap, curl',
      operatingSystem: 'Linux',
      status: 'in_progress',
    };

    // Build initial timeline
    const createdAt = 'DEC 15, 02:30 PM';
    this.timeline = [
      {
        time: createdAt,
        event: 'Fix Vulnerability Created',
        desc: `"${this.currentVuln.name}" assigned to ${this.currentVuln.assignedTeam}.`,
        color: '#0f696e',
      },
      {
        time: createdAt,
        event: 'Vulnerability Detected',
        desc: `Asset: ${this.currentVuln.asset} — Critical Security Issue.`,
        color: '#94a3b8',
      },
    ];

    // Use same hardcoded steps as above
    this.totalSteps = 3;
    this.currentStep = 1;
    this.completedSteps = [];

    this.subtasks = [
      {
        id: 1,
        name: 'Emergency network isolation',
        assignedTeam: 'Network Security Team',
        members: [
          { user_id: 1, name: 'John Doe' },
          { user_id: 2, name: 'Jane Smith' }
        ],
        status: 'pending',
        deadline: '2024-12-31',
        criticality: 'critical',
        effortEstimate: '2 hours',
        action: 'Block all inbound TCP traffic to port 5985 immediately',
        filePath: '/etc/iptables/rules.v4 (or network firewall ACL)',
        command: `# On 192.168.1.53
iptables -I INPUT 1 -p tcp --dport 5985 -j DROP
iptables -I OUTPUT 1 -p tcp --sport 5985 -m state --state ESTABLISHED -j ACCEPT
iptables-save | tee /etc/iptables/rules.v4

# On network firewall (Cisco IOS example)
ip access-list extended BLOCK_STRUTS
  deny tcp any host 192.168.1.53 eq 5985
  permit ip any any`,
        expectedOutput: "Port 5985 shows as 'filtered' from all external sources",
        verificationCheck: "nmap -Pn -p 5985 192.168.1.53 # Expected: 5985/tcp filtered wsman\ncurl --connect-timeout 3 http://192.168.1.53:5985/ && echo STILL_OPEN || echo BLOCKED",
        whereToRunLabel: '192.168.1.53 (SSH as root) AND network firewall console',
        whereToRun: '192.168.1.53 (SSH as root) AND network firewall console',
        tools: ['iptables', 'nmap', 'curl', 'netfilter-persistent'],
        consideration: 'Port 5985 is the Windows Remote Management (WinRM) default port — confirm what service is actually running here. Apache Struts normally runs on 8080 or 443. The Nessus finding on port 5985 may indicate a non-standard deployment.',
        subTasks: [],
      },
      {
        id: 2,
        name: 'Configuration Management',
        assignedTeam: 'DevOps Team',
        members: [
          { user_id: 3, name: 'Mike Johnson' }
        ],
        status: 'pending',
        deadline: '2024-12-31',
        criticality: 'high',
        effortEstimate: '1 hour',
        action: 'Update system configuration to disable vulnerable service',
        filePath: 'C:\\temp\\cipher_before.txt',
        command: 'nmap -sV -p 5985 192.168.1.53',
        expectedOutput: 'The command completes without error messages. Confirm the change is applied as described in this step.',
        verificationCheck: 'Check that the change is in place and there are no error messages or warnings.',
        whereToRunLabel: 'Terminal / Command Prompt (open the terminal on your system)',
        whereToRun: 'Terminal / Command Prompt',
        tools: ['nmap'],
        consideration: 'Ensure output path is writable',
        subTasks: [
          {
            description: 'Backup current configuration',
            items: [
              'Create backup of existing configuration',
              'Verify backup integrity',
              'Store backup in secure location'
            ]
          }
        ],
      },
      {
        id: 3,
        name: 'Patch Apache Struts to latest version',
        assignedTeam: 'Application Team',
        members: [
          { user_id: 4, name: 'Sarah Williams' },
          { user_id: 5, name: 'Tom Brown' }
        ],
        status: 'pending',
        deadline: '2024-12-31',
        criticality: 'critical',
        effortEstimate: '3 hours',
        action: 'Upgrade Apache Struts framework to version 2.5.33 or later to patch CVE-2017-5638',
        filePath: '/opt/application/pom.xml',
        command: `# Backup current application
cp -r /opt/application /opt/application.backup

# Update pom.xml with latest Struts version
sed -i 's/<struts2.version>.*<\\/struts2.version>/<struts2.version>2.5.33<\\/struts2.version>/g' /opt/application/pom.xml

# Rebuild application
cd /opt/application
mvn clean package

# Deploy updated WAR file
cp target/application.war /opt/tomcat/webapps/`,
        expectedOutput: 'Application successfully rebuilt with Struts 2.5.33. WAR file deployed to Tomcat.',
        verificationCheck: 'curl http://192.168.1.53:8080/application/ | grep "Struts 2.5.33"\nnmap --script http-vuln-cve2017-5638 192.168.1.53 -p 8080',
        whereToRunLabel: '192.168.1.53 (SSH as application user)',
        whereToRun: '192.168.1.53 (SSH as application user)',
        tools: ['maven', 'nmap', 'curl', 'tomcat'],
        consideration: 'This will require application downtime. Schedule during maintenance window. Ensure all dependencies are compatible with Struts 2.5.33 before upgrading.',
        subTasks: [
          {
            description: 'Pre-deployment checks',
            items: [
              'Review application dependencies',
              'Run compatibility tests',
              'Notify stakeholders of maintenance window'
            ]
          },
          {
            description: 'Post-deployment verification',
            items: [
              'Run security scan to confirm vulnerability is patched',
              'Verify application functionality',
              'Monitor application logs for errors'
            ]
          }
        ],
      },
    ];

    this.currentVuln.progress = this.totalSteps > 0
      ? Math.round((this.completedSteps.length / this.totalSteps) * 100)
      : 0;

    await this.fetchSupportRequestMeta(this.currentVuln.id, this.currentVuln.asset);
  },
};
</script>

<style scoped>
/* ─── Final Feedback Card ───────────────────────────────────────────── */
.rt-feedback-card {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #16a34a;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.rt-feedback-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.rt-feedback-emoji {
  font-size: 1.4rem;
  line-height: 1;
}

.rt-feedback-title {
  font-size: 1rem;
  font-weight: 800;
  color: #1e293b;
  flex: 1;
}

.rt-admin-readonly-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 50px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.rt-feedback-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.rt-feedback-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.rt-fb-label {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
  margin: 0;
}

.rt-fb-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.rt-fb-result-badge {
  display: inline-block;
  background: #dcfce7;
  color: #166534;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 4px 14px;
  border-radius: 50px;
}

.rt-feedback-empty {
  font-size: 0.84rem;
  color: #64748b;
  display: flex;
  align-items: center;
  padding: 8px 0;
}

/* ─── Loading Overlay ───────────────────────────────────────────────── */
.rt-loading-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

/* ─── Shell ─────────────────────────────────────────────────────────── */
.rt-content {
  background: #f4f5f8;
  min-height: 100vh;
  padding: 0;
}

/* ─── Page Header ───────────────────────────────────────────────────── */
.rt-page-header {
  padding: 72px 28px 20px;
  background: #ffffff;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.rt-header-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.rt-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}
.rt-chip-risk { color: #b42318; background: #f8dede; }
.rt-chip-risk-critical { color: #b42318; background: #f8dede; }
.rt-chip-risk-high { color: #dc2626; background: #fee2e2; }
.rt-chip-risk-medium { color: #b45309; background: #fef3c7; }
.rt-chip-risk-low { color: #0f766e; background: #ccfbf1; }
.rt-chip-status {
  color: #334155;
  background: #e2e8f0;
}
.rt-chip-status-open { color: #7f1d1d; background: #fee2e2; }
.rt-chip-status-progress { color: #0f696e; background: #ccfbf1; }
.rt-chip-status-closed { color: #166534; background: #dcfce7; }
.rt-chip-asset {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color: #475569;
  background: #f1f5f9;
}

.rt-btn-support {
  background: #e0f2f1;
  color: #0f696e;
  border: 1px solid rgba(15,105,110,0.2);
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
}
.rt-btn-support:hover { background: #a1ecf2; }
.rt-btn-neutral {
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.84rem;
  font-weight: 600;
  border: 1px solid transparent;
  background: #f1f5f9;
  color: #334155;
  border-color: #e2e8f0;
}
.rt-support-count-badge {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  background: #241447;
  color: #ffffff;
  font-size: 0.72rem;
  font-weight: 700;
}

.rt-btn-ticket {
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  display: inline-flex;
  align-items: center;
}
.rt-btn-ticket:hover { opacity: 0.88; }

/* ── Modal styles (from VulnerabilityCardView) ── */
.vc-modal-content {
  border-radius: 16px;
  overflow: hidden;
  border: none;
}
.vc-modal-header {
  background: #241447;
  color: #fff;
  border-bottom: none;
  padding: 18px 24px;
}
.vc-modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}
.vc-modal-section-label {
  font-size: 0.82rem;
  font-weight: 700;
  color: #241447;
}
.vc-modal-footer {
  border-top: 1px solid #f1f5f9;
  padding: 14px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.vc-step-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  border: 1.5px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.15s;
  width: 100%;
  text-align: center;
}
.vc-step-pill-active {
  background: #e0f2f1;
  color: #0f696e;
  border-color: #0f696e;
}
.vc-step-pill-raised {
  background: #fff7ed;
  color: #c2410c;
  border-color: #fdba74;
}
.vc-textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 0.875rem;
  color: #1e293b;
  background: #f8f9fc;
  outline: none;
  resize: vertical;
}
.vc-textarea:focus { box-shadow: 0 0 0 2px rgba(15,105,110,0.2); border-color: #0f696e; }
.vc-btn-primary {
  background: #241447;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}
.vc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.vc-btn-secondary {
  background: white;
  color: #241447;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 18px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.rt-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 4px;
}

.rt-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

/* ─── Stepper ───────────────────────────────────────────────────────── */
.rt-stepper-wrap {
  background: #ffffff;
  padding: 24px 28px 40px;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}
.rt-stepper-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.rt-stepper-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}
.rt-stepper-count {
  font-size: 0.84rem;
  color: #0f696e;
  font-weight: 600;
}

.rt-stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.rt-step-circle-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex-shrink: 0;
}

.rt-step-line {
  flex: 1;
  height: 2px;
  min-width: 24px;
  max-width: 60px;
  margin: 0 4px;
  flex-shrink: 1;
}

.rt-line-done    { background: #0f696e; }
.rt-line-pending { background: #e2e8f0; }

.rt-step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.2s, box-shadow 0.2s;
}

.rt-circle-done {
  background: #0f696e;
  color: #ffffff;
}

.rt-circle-active {
  background: #241447;
  color: #ffffff;
  box-shadow: 0 0 0 4px rgba(36, 20, 71, 0.14);
}

.rt-circle-pending {
  background: #e2e8f0;
  color: #94a3b8;
}

.rt-step-num {
  font-size: 0.75rem;
  font-weight: 700;
}

.rt-active-label {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #ffffff;
  background: #241447;
  padding: 3px 10px;
  border-radius: 50px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

/* ─── Body Grid ─────────────────────────────────────────────────────── */
.rt-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
  padding: 28px 28px 48px;
}

/* ─── Left column ───────────────────────────────────────────────────── */
.rt-main-col {
  display: flex;
  flex-direction: column;
  gap: 18px;
  min-width: 0;
}

/* ─── Technical Insight Label ───────────────────────────────────────── */
.rt-tech-label-wrap {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f1f5f9;
  border-radius: 6px;
  padding: 4px 10px;
  margin-bottom: 14px;
}
.rt-tech-label-icon { font-size: 0.78rem; color: #475569; }
.rt-tech-label-text { font-size: 0.78rem; font-weight: 600; color: #475569; }

/* ─── Technical Insight Card ────────────────────────────────────────── */
.rt-tech-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
  border-left: 4px solid #b42318;
}

.rt-tech-left {
  flex: 1;
  min-width: 0;
}

.rt-critical-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  background: #f8dede;
  color: #b42318;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 10px;
}

.rt-vuln-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.3;
}

.rt-vuln-desc-wrap {
  margin-top: 10px;
  max-width: 640px;
}

.rt-vuln-desc-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #241447;
  margin: 0 0 5px;
}

.rt-vuln-desc-text {
  font-size: 0.875rem;
  color: #49454f;
  line-height: 1.6;
  margin: 0 0 4px;
}

.rt-btn-read-more {
  background: transparent;
  border: none;
  padding: 0;
  color: #0f696e;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
}

.rt-label-text {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 500;
}

.rt-asset-chip {
  display: inline-block;
  font-size: 0.92rem;
  font-weight: 700;
  background: #e0f2fe;
  color: #0369a1;
  padding: 4px 14px;
  border-radius: 50px;
  border: 1.5px solid #bae6fd;
  letter-spacing: 0.01em;
}

.rt-tech-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  flex-shrink: 0;
  margin-left: 24px;
}

.rt-progress-label {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.rt-progress-num {
  font-size: 2.5rem;
  font-weight: 800;
  color: #241447;
  line-height: 1.1;
}

.rt-progress-pct {
  font-size: 1.2rem;
  font-weight: 700;
  color: #64748b;
}

/* Tech card meta row */
.rt-tech-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}
.rt-tech-meta-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 120px;
  align-items: center;
  text-align: center;
}
.rt-tech-meta-item:nth-child(2) {
  margin-left: 20px;
}
.rt-tech-meta-item:nth-child(3) {
  margin-left: 30px;
}
.rt-tech-meta-label {
  font-size: 0.58rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}
.rt-tech-meta-val {
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
}

/* ─── Subtasks Card ─────────────────────────────────────────────────── */
.rt-subtasks-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.rt-subtasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.rt-subtasks-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.rt-tasks-completed {
  font-size: 0.78rem;
  color: #0f696e;
  font-weight: 600;
}

/* Task list */
.rt-task-list {
  display: flex;
  flex-direction: column;
}

.rt-task-item {
  border-bottom: 1px solid #f1f5f9;
  cursor: pointer;
  transition: background 0.15s;
  border-radius: 8px;
  padding: 0 8px;
  background: #ffffff;
}

.rt-task-item:last-child {
  border-bottom: none;
}

.rt-task-item:hover {
  background: #f8f9fc;
}

.rt-task-item:not(:first-child) {
  background: #ffffff;
}

.rt-task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 8px;
  margin: 0 -4px;
  cursor: pointer;
  user-select: none;
  border-radius: 8px;
}
.rt-task-row:hover {
  background: rgba(15, 105, 110, 0.06);
}
.rt-task-row:focus-visible {
  outline: 2px solid #0f696e;
  outline-offset: 2px;
}
.rt-task-right { position: relative; }
.rt-task-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rt-task-circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #0f696e;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.rt-task-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rt-task-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
}

.rt-task-assignee {
  font-size: 0.75rem;
  color: #94a3b8;
}

.rt-task-chevron {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  color: #94a3b8;
  pointer-events: none;
}

.rt-chevron-open {
  transform: rotate(180deg);
}

/* ─── Expanded detail panel (new rt-exp-* design) ───────────────────── */
.rt-task-expanded {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
  border-top: 1px solid #f1f5f9;
}

/* Grey stack: ACTION | ASSIGNED TO only */
.rt-exp-primary-stack {
  background-color: #f1f3f5;
  border-bottom: 1px solid #f1f5f9;
  border-radius: 14px 14px 0 0;
  overflow: hidden;
}

.rt-exp-primary-stack > .rt-exp-row2 {
  background-color: transparent;
  border-bottom: none;
}

/* FILE PATH: white row, same 2-col grid + cell padding as ACTION */
.rt-exp-filepath-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #f1f5f9;
  background: #ffffff;
}

.rt-exp-filepath-col {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.rt-exp-filepath-spacer {
  border-left: 2px solid #cbced1;
}

/* 2-column row (ACTION/ASSIGNED TO, EXPECTED OUTPUT/VERIFICATION) */
.rt-exp-row2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid #f1f5f9;
  background-color: #f1f3f5;
  margin: 0;
  padding: 0;
}

/* Expected output / verification grey row (not inside primary stack) — match command/action radius */
.rt-task-expanded > .rt-exp-row2 {
  border-radius: 8px;
  overflow: hidden;
}

.rt-exp-cell {
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.rt-exp-cell-divider {
  border-left: 2px solid #cbced1;
}

/* Full-width section block */
.rt-exp-section {
  padding: 14px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
}

/* Wider section for file path */
.rt-exp-section-wide {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.rt-filepath-wrapper {
  position: relative;
  width: 100%;
}

.rt-copy-btn-sm {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  color: #7c3aed;
  border: none;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}

/* Section header label (tiny uppercase) */
.rt-exp-label {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 2px;
}

/* Body text inside sections */
.rt-exp-text {
  font-size: 0.84rem;
  color: #334155;
  margin: 0;
  line-height: 1.55;
}
.rt-exp-pretext { white-space: pre-line; }

/* Purple monospace filepath — comfortable inset; reserve space for copy */
.rt-exp-filepath {
  background: #f5f3ff;
  border: 1px solid #e9d5ff;
  border-radius: 8px;
  padding: 12px 48px 12px 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.82rem;
  color: #7c3aed;
  word-break: break-all;
  position: relative;
  line-height: 1.65;
}

/* Dark terminal code block */
.rt-exp-code-block {
  background: #1e293b;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.82rem;
  color: #4ade80;
  word-break: break-all;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* Flex wrapper for code block + copy button (both classes on same element) */
.rt-exp-code-copy {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.rt-exp-code-copy span {
  flex: 1;
  word-break: break-all;
  white-space: pre-wrap;
}

/* Clipboard copy button inside code block */
.rt-exp-copy-btn {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #4ade80;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0 2px;
  opacity: 0.6;
  transition: opacity 0.2s;
  line-height: 1;
  margin-top: 1px;
}

.rt-exp-copy-btn:hover {
  opacity: 1;
}

/* Verification — copy on same row as label */
.rt-exp-verify-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.rt-exp-verify-head .rt-exp-label {
  margin-bottom: 0;
}

.rt-exp-verify-wrap {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
}

.rt-exp-verify-body {
  display: block;
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.82rem;
  color: #1e293b;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

.rt-exp-verify-copy {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 4px 10px;
  line-height: 1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
}

.rt-exp-verify-copy:hover {
  color: #64748b;
  background: #f1f5f9;
}

/* Amber IMPORTANT CONSIDERATIONS box */
.rt-exp-consideration {
  margin: 14px 20px 18px;
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  padding: 12px 16px;
}

.rt-exp-consideration-hd {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b45309;
  margin-bottom: 6px;
}

.rt-exp-consideration-text {
  font-size: 0.82rem;
  color: #c2410c;
  line-height: 1.55;
  margin: 0;
}


.rt-tool-chip {
  display: inline-block;
  font-size: 0.68rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  padding: 2px 9px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
}

/* rt-team-chip colors: global main.css */

.rt-consideration-box {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 0.82rem;
  color: #c2410c;
  line-height: 1.55;
  margin-top: 2px;
}

.rt-subtask-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.rt-subtask-entry { display: flex; flex-direction: column; gap: 4px; }
.rt-subtask-desc { font-size: 0.84rem; font-weight: 600; color: #334155; }
.rt-subtask-dash { font-size: 0.84rem; color: #94a3b8; padding-left: 4px; }

.rt-checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 2px;
}

.rt-check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.84rem;
  color: #334155;
  cursor: pointer;
  user-select: none;
}

.rt-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  accent-color: #0f696e;
  cursor: pointer;
  flex-shrink: 0;
}

/* Step status badges */
.rt-step-status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}
.rt-status-done        { background: #d1fae5; color: #065f46; }
.rt-status-pending-red { background: #f8dede; color: #b42318; }

/* Completed task row */
.rt-task-completed {
  background: #f0fdf4;
}

/* Task circle variants */
.rt-circle-task-done { background: #0f696e !important; }

/* Meta row in expanded panel */
.rt-expand-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  background: #f8f9fc;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 4px;
}
.rt-expand-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  color: #475569;
}
.rt-expand-meta-val {
  font-weight: 600;
  color: #1e293b;
}

/* Member chip */
.rt-member-chip {
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;
  font-weight: 600;
  background: #e0f2f1;
  color: #0f696e;
  padding: 3px 10px;
  border-radius: 50px;
  border: 1px solid rgba(15,105,110,0.2);
}
.rt-assigned-highlight {
  background: #ecfeff;
  border: 1px solid #99f6e4;
  border-radius: 10px;
  padding: 10px 12px;
}
.rt-assigned-highlight .rt-expand-label {
  color: #0f766e;
}
.rt-assigned-highlight .rt-member-chip {
  background: #ccfbf1;
  color: #0f766e;
  border-color: #5eead4;
}

/* Admin note */
.rt-admin-note {
  font-size: 0.78rem;
  color: #64748b;
  display: flex;
  align-items: center;
  flex: 1;
}

/* Action buttons */
.rt-action-btns {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid #f1f5f9;
}

.btn-save {
  background: #ffffff;
  color: #334155;
  border: 1.5px solid #cbd5e1;
  border-radius: 999px;
  padding: 9px 22px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}

.btn-save:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

.btn-complete {
  background: #241447;
  color: #ffffff;
  border: none;
  border-radius: 999px;
  padding: 9px 24px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.btn-complete:hover {
  background: #1a0f33;
}

.btn-complete:active {
  transform: scale(0.97);
}

.btn-complete:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

/* ─── Right Sidebar ─────────────────────────────────────────────────── */
.rt-sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ─── Shared card base ──────────────────────────────────────────────── */
.rt-timeline-card,
.rt-stats-card {
  background: #ffffff;
  border-radius: 14px;
  overflow: hidden;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
}

.rt-card-heading {
  display: block;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: #94a3b8;
  margin-bottom: 16px;
}

/* ─── Activity Timeline ─────────────────────────────────────────────── */
.rt-tl-list {
  display: flex;
  flex-direction: column;
}

.rt-tl-item {
  display: flex;
  gap: 10px;
  padding-bottom: 16px;
}

.rt-tl-item-last {
  padding-bottom: 0;
}

.rt-tl-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-top: 3px;
}

.rt-tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.rt-tl-connector {
  flex: 1;
  width: 1px;
  background: #e2e8f0;
  margin-top: 5px;
  min-height: 18px;
}

.rt-tl-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 2px;
}

.rt-tl-time {
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #94a3b8;
}

.rt-tl-event {
  font-size: 0.85rem;
  font-weight: 700;
  color: #1e293b;
}

.rt-tl-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.45;
}

/* ─── Asset Statistics ──────────────────────────────────────────────── */
.rt-stat-row {
  margin-bottom: 16px;
}

.rt-stat-row:last-child {
  margin-bottom: 0;
}

.rt-stat-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
}

.rt-stat-value {
  font-size: 0.88rem;
  font-weight: 800;
}

.rt-stat-value-green {
  color: #0f696e;
}

.rt-stat-value-red {
  color: #b42318;
}

.rt-stat-bar {
  height: 6px;
  border-radius: 3px;
  background: #f1f5f9;
  overflow: hidden;
}

.rt-stat-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.rt-stat-fill-green {
  background: #0f696e;
}

.rt-stat-fill-red {
  background: #b42318;
}

/* ─── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1200px) {
  .rt-body {
    grid-template-columns: 1fr;
  }

  .rt-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
}

@media (max-width: 768px) {
  .rt-body {
    padding: 16px;
  }

  .rt-sidebar {
    grid-template-columns: 1fr;
  }

  .rt-page-header {
    padding: 72px 16px 16px;
  }

  .rt-stepper-wrap {
    overflow-x: auto;
    padding-bottom: 36px;
  }

  .rt-stepper {
    min-width: 560px;
  }
}
</style>
