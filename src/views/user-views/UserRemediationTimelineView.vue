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
                <h2 class="rt-title">Remediation Timeline</h2>
                <p class="rt-subtitle">Track and manage vulnerability remediation progress</p>
              </div>
              <div class="d-flex gap-2">
                <button class="rt-btn-support" @click="openSupportModal">
                  Support Request
                </button>
              </div>
            </div>

            <!-- Support Modal -->
            <div class="modal fade" id="rtUserSupportModal" tabindex="-1" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content vc-modal-content">
                  <div class="modal-header vc-modal-header">
                    <h5 class="modal-title vc-modal-title">Raise Support Request</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body p-4">
                    <h6 class="vc-modal-section-label mb-3">Choose the step for which you want support</h6>
                    <div class="row g-2 mt-1">
                      <div class="col-4">
                        <span
                          class="vc-step-pill"
                          :class="isAllSelected ? 'vc-step-pill-active' : ''"
                          style="cursor:pointer;"
                          @click="!isSupportAlreadyRaised && toggleAllSteps()"
                        >All Steps</span>
                      </div>
                      <div class="col-4" v-for="n in totalSteps" :key="n">
                        <span
                          class="vc-step-pill"
                          :class="selectedSteps.includes(n) ? 'vc-step-pill-active' : ''"
                          style="cursor:pointer;"
                          @click="!isSupportAlreadyRaised && toggleStep(n)"
                        >Step {{ n }}</span>
                      </div>
                    </div>
                    <p class="vc-modal-section-label mt-4 mb-2">Description <span class="text-danger">*</span></p>
                    <textarea
                      v-model="supportDescription"
                      class="vc-textarea"
                      rows="4"
                      placeholder="Write your issue here..."
                      :disabled="isSupportAlreadyRaised"
                    ></textarea>
                    <div v-if="isSupportAlreadyRaised" class="rt-support-raised-note mt-3">
                      <i class="bi bi-check-circle-fill me-2" style="color:#0f696e;"></i>
                      Support request has been raised successfully.
                    </div>
                  </div>
                  <div class="modal-footer vc-modal-footer">
                    <button
                      v-if="!isSupportAlreadyRaised"
                      class="vc-btn-primary"
                      :disabled="!supportDescription.trim() || submittingSupport"
                      @click="submitSupport"
                    >
                      <span v-if="submittingSupport">
                        <span class="spinner-border spinner-border-sm me-1"></span>Submitting...
                      </span>
                      <span v-else>Submit</span>
                    </button>
                    <button v-else class="vc-btn-secondary" data-bs-dismiss="modal">Close</button>
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
              <div class="rt-stepper">
                <template v-for="step in totalSteps" :key="step">
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

              <!-- LEFT COLUMN -->
              <div class="rt-main-col">

                <!-- Technical Insight Card -->
                <div class="rt-tech-card">
                  <div class="rt-tech-label-wrap">
                    <i class="bi bi-display rt-tech-label-icon"></i>
                    <span class="rt-tech-label-text">Technical Insight</span>
                  </div>
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="rt-tech-left">
                      <div class="d-flex align-items-center gap-2 mb-2 flex-wrap">
                        <span class="rt-label-text">Impacted Asset:</span>
                        <span class="rt-asset-chip">{{ currentVuln.asset }}</span>
                      </div>
                      <span class="rt-critical-badge mb-2 d-inline-block">{{ currentVuln.risk }}</span>
                      <h3 class="rt-vuln-name">{{ currentVuln.name }}</h3>
                    </div>
                    <div class="rt-tech-right">
                      <span class="rt-progress-label">REMEDIATION PROGRESS</span>
                      <div class="rt-progress-num">
                        {{ progressPercent }}<span class="rt-progress-pct">%</span>
                      </div>
                    </div>
                  </div>
                  <!-- Meta row -->
                  <div class="rt-tech-meta-row mt-3">
                    <div v-if="currentVuln.assignedTeam" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">ASSIGNED TEAM</span>
                      <span class="rt-tech-meta-val">{{ currentVuln.assignedTeam }}</span>
                    </div>
                    <div v-if="currentVuln.deadline" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">DEADLINE</span>
                      <span class="rt-tech-meta-val">{{ currentVuln.deadline }}</span>
                    </div>
                    <div v-if="currentVuln.operatingSystem" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">OS</span>
                      <span class="rt-tech-meta-val">{{ currentVuln.operatingSystem }}</span>
                    </div>
                    <div v-if="currentVuln.artifactsTools" class="rt-tech-meta-item">
                      <span class="rt-tech-meta-label">ARTIFACTS / TOOLS</span>
                      <span class="rt-tech-meta-val">{{ currentVuln.artifactsTools }}</span>
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
                      @click="toggleTask(idx)"
                    >
                      <!-- Task summary row -->
                      <div class="rt-task-row">
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
                            <span class="rt-task-assignee">{{ task.assignedTeam }}</span>
                          </div>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                          <span v-if="task.status === 'completed'" class="rt-step-status-badge rt-status-done">Completed</span>
                          <span v-else class="rt-step-status-badge rt-status-pending-red">Pending</span>
                          <div class="rt-task-chevron" :class="{ 'rt-chevron-open': expandedTask === idx }">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M4 6L8 10L12 6" stroke="#94a3b8" stroke-width="1.5"
                                    stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>

                      <!-- Expanded detail panel -->
                      <div v-if="expandedTask === idx" class="rt-task-expanded">

                        <!-- Meta: Deadline + Criticality + Effort -->
                        <div class="rt-expand-meta-row">
                          <div v-if="task.deadline" class="rt-expand-meta-item">
                            <i class="bi bi-calendar3 me-1"></i>
                            <span class="rt-expand-label">Deadline:</span>
                            <span class="rt-expand-meta-val">{{ task.deadline }}</span>
                          </div>
                          <div v-if="task.criticality" class="rt-expand-meta-item">
                            <i class="bi bi-exclamation-circle me-1"></i>
                            <span class="rt-expand-label">Criticality:</span>
                            <span class="rt-expand-meta-val" :class="{
                              'text-danger': task.criticality === 'Critical',
                              'text-warning': task.criticality === 'High',
                            }">{{ task.criticality }}</span>
                          </div>
                          <div v-if="task.effortEstimate" class="rt-expand-meta-item">
                            <i class="bi bi-clock me-1"></i>
                            <span class="rt-expand-label">Effort:</span>
                            <span class="rt-expand-meta-val">{{ task.effortEstimate }}</span>
                          </div>
                        </div>

                        <!-- ACTION + FILE PATH -->
                        <div class="rt-expand-row-2">
                          <div class="rt-expand-section">
                            <span class="rt-expand-label">ACTION</span>
                            <p class="rt-expand-text">{{ task.action }}</p>
                            <div v-if="task.subTasks && task.subTasks.length" class="mt-3">
                              <span class="rt-expand-label">SUB-TASKS</span>
                              <div class="rt-subtask-list mt-1">
                                <div
                                  v-for="(sub, si) in task.subTasks"
                                  :key="si"
                                  class="rt-subtask-entry"
                                  @click.stop
                                >
                                  <span class="rt-subtask-desc">{{ sub.description }}</span>
                                  <div v-if="!sub.items || sub.items.length === 0" class="rt-subtask-dash"> - </div>
                                  <div v-else class="rt-checklist mt-1">
                                    <label
                                      v-for="(item, ii) in sub.items"
                                      :key="ii"
                                      class="rt-check-item"
                                    >
                                      <input type="checkbox" class="rt-checkbox" />
                                      <span>{{ item }}</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div v-if="task.filePath && task.filePath !== 'N/A'" class="rt-expand-section">
                            <span class="rt-expand-label">FILE PATH</span>
                            <div class="rt-filepath-box">{{ task.filePath }}</div>
                          </div>
                        </div>

                        <!-- COMMAND TO RUN -->
                        <div v-if="task.command && task.command !== 'N/A'" class="rt-expand-section">
                          <span class="rt-expand-label">COMMAND TO RUN</span>
                          <div class="rt-code-block">{{ task.command }}</div>
                        </div>

                        <!-- TOOLS + CONSIDERATION -->
                        <div class="rt-expand-row-2">
                          <div v-if="task.tools && task.tools.length" class="rt-expand-section">
                            <span class="rt-expand-label">ARTIFACTS / TOOLS USED</span>
                            <div class="d-flex flex-wrap gap-2 mt-1">
                              <span v-for="tool in task.tools" :key="tool" class="rt-tool-chip">{{ tool }}</span>
                            </div>
                          </div>
                          <div v-if="task.consideration" class="rt-expand-section">
                            <span class="rt-expand-label">IMPORTANT CONSIDERATION</span>
                            <div class="rt-consideration-box">
                              <i class="bi bi-exclamation-triangle-fill" style="color:#f97316; flex-shrink:0;"></i>
                              <span>{{ task.consideration }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- ASSIGNED MEMBERS -->
                        <div v-if="task.members && task.members.length" class="rt-expand-section">
                          <span class="rt-expand-label">ASSIGNED MEMBERS</span>
                          <div class="d-flex flex-wrap gap-2 mt-1">
                            <span v-for="m in task.members" :key="m.user_id" class="rt-member-chip">
                              <i class="bi bi-person-fill me-1"></i>{{ m.name }}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <!-- Comment + Complete Step -->
                  <div class="rt-step-complete-section" v-if="!showFeedback">
                    <p class="rt-step-complete-label">
                      Step {{ currentStep }} — Add a comment before marking complete
                    </p>
                    <textarea
                      v-model="currentStepComment"
                      class="rt-step-comment-textarea"
                      rows="2"
                      placeholder="Write a comment for this step..."
                      :disabled="savingStep"
                    ></textarea>
                    <div class="rt-action-btns">
                      <button
                        class="btn-complete"
                        :disabled="savingStep"
                        @click="completeCurrentStep"
                      >
                        <span v-if="savingStep">
                          <span class="spinner-border spinner-border-sm me-1"></span>Saving...
                        </span>
                        <span v-else>Complete Step {{ currentStep }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Final Feedback Card -->
                <div v-if="showFeedback" class="rt-feedback-card">
                  <div class="rt-feedback-header">
                    <span class="rt-feedback-emoji">🎉</span>
                    <h5 class="rt-feedback-title mb-0">Vulnerability Closed</h5>
                  </div>

                  <div v-if="loadingFeedback" class="text-muted small py-2">
                    <span class="spinner-border spinner-border-sm me-2"></span>Loading feedback...
                  </div>

                  <!-- Feedback already submitted → read-only view -->
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

                  <!-- No feedback yet → submit form -->
                  <div v-else class="rt-fb-form">
                    <p class="rt-fb-form-desc">All steps completed. Please submit your final feedback for this remediation.</p>
                    <div class="rt-fb-form-row">
                      <div class="rt-fb-form-field">
                        <label class="rt-fb-label">FIX RESULT</label>
                        <select v-model="feedbackForm.fix_result" class="rt-fb-select" :disabled="submittingFeedback">
                          <option value="">— Select result —</option>
                          <option value="resolved">Resolved</option>
                          <option value="partially_resolved">Partially Resolved</option>
                          <option value="unresolved">Unresolved</option>
                        </select>
                      </div>
                    </div>
                    <div class="rt-fb-form-field mt-3">
                      <label class="rt-fb-label">FEEDBACK COMMENT</label>
                      <textarea
                        v-model="feedbackForm.feedback_comment"
                        class="rt-step-comment-textarea"
                        rows="3"
                        placeholder="Describe the outcome of this remediation..."
                        :disabled="submittingFeedback"
                      ></textarea>
                    </div>
                    <div class="rt-fb-submit-row">
                      <button
                        class="btn-complete"
                        :disabled="submittingFeedback || !feedbackForm.fix_result"
                        @click="submitFinalFeedback"
                      >
                        <span v-if="submittingFeedback">
                          <span class="spinner-border spinner-border-sm me-1"></span>Submitting...
                        </span>
                        <span v-else>Submit Feedback</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
              <!-- /rt-main-col -->

              <!-- RIGHT SIDEBAR -->
              <div class="rt-sidebar">
                <div class="rt-timeline-card">
                  <span class="rt-card-heading">ACTIVITY TIMELINE</span>

                  <div v-if="timelineLoading" class="text-muted small py-3 text-center">
                    <span class="spinner-border spinner-border-sm me-1"></span> Loading...
                  </div>

                  <div v-else-if="!timeline.length" class="text-muted small py-3 text-center">
                    No timeline events yet.
                  </div>

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
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';

export default {
  name: 'UserRemediationTimelineView',
  components: { DashboardMenu, DashboardHeader },

  props: {
    reportId: { type: String, required: true },
    asset: { type: String, required: true },
  },

  data() {
    return {
      authStore: useAuthStore(),
      currentStep: 1,
      totalSteps: 0,
      completedSteps: [],
      expandedTask: null,
      isLoading: false,
      savingStep: false,
      currentStepComment: '',
      finalFeedbackData: null,
      loadingFeedback: false,
      submittingFeedback: false,
      feedbackForm: {
        fix_result: '',
        feedback_comment: '',
      },
      isSupportAlreadyRaised: false,
      selectedSteps: [],
      isAllSelected: false,
      supportDescription: '',
      supportDetail: null,
      submittingSupport: false,
      timelineLoading: false,
      currentVuln: {
        id: null,
        name: '',
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
    };
  },

  computed: {
    progressPercent() {
      return this.totalSteps > 0
        ? Math.round((this.completedSteps.length / this.totalSteps) * 100)
        : 0;
    },
    completedSubtasksCount() {
      return this.completedSteps.length;
    },
    showFeedback() {
      return this.totalSteps > 0 && this.completedSteps.length >= this.totalSteps;
    },
  },

  methods: {
    toggleTask(idx) {
      this.expandedTask = this.expandedTask === idx ? null : idx;
    },
    toggleStep(step) {
      if (this.isAllSelected) return;
      if (this.selectedSteps.includes(step)) {
        this.selectedSteps = this.selectedSteps.filter(s => s !== step);
      } else {
        this.selectedSteps.push(step);
      }
    },
    toggleAllSteps() {
      if (this.isAllSelected) {
        this.isAllSelected = false;
        this.selectedSteps = [];
      } else {
        this.isAllSelected = true;
        this.selectedSteps = Array.from({ length: this.totalSteps }, (_, i) => i + 1);
      }
    },
    async openSupportModal() {
      this.isSupportAlreadyRaised = false;
      this.selectedSteps = [];
      this.isAllSelected = false;
      this.supportDescription = '';
      this.supportDetail = null;
      await this.$nextTick();
      const modal = new bootstrap.Modal(document.getElementById('rtUserSupportModal'));
      modal.show();
    },
    async submitSupport() {
      if (!this.supportDescription.trim()) return;
      const vulnerabilityId = this.currentVuln?.id;
      if (!vulnerabilityId) {
        Swal.fire('Error', 'Vulnerability ID not found', 'error');
        return;
      }
      let stepValue = 'all';
      if (!this.isAllSelected && this.selectedSteps.length > 0) {
        stepValue = this.selectedSteps.join(',');
      }
      this.submittingSupport = true;
      const res = await this.authStore.raiseUserSupportRequest(vulnerabilityId, {
        step: stepValue,
        description: this.supportDescription,
      });
      this.submittingSupport = false;
      if (res.status) {
        this.isSupportAlreadyRaised = true;
        this.supportDetail = res.data;
        Swal.fire({ icon: 'success', title: 'Support Request Raised', timer: 2000, showConfirmButton: false });
      } else {
        Swal.fire('Error', res.message || 'Failed to raise support request', 'error');
      }
    },
    async completeCurrentStep() {
      if (!this.currentVuln.id) return;

      this.savingStep = true;

      const res = await this.authStore.completeUserFixVulnerabilityStep(
        this.currentVuln.id,
        {
          status: 'completed',
          comment: this.currentStepComment || `Step ${this.currentStep} completed`,
        }
      );

      this.savingStep = false;

      if (!res.status) {
        Swal.fire('Error', res.message || 'Failed to complete step', 'error');
        return;
      }

      // Success feedback
      Swal.fire({
        icon: 'success',
        title: res.message || `Step ${this.currentStep} saved`,
        timer: 1800,
        showConfirmButton: false,
      });

      this.currentStepComment = '';

      // Refresh steps from API
      const stepsRes = await this.authStore.getUserFixVulnerabilitySteps(this.currentVuln.id);
      if (stepsRes.status) {
        const s = stepsRes.data;
        this.totalSteps    = s.total_steps || 0;
        this.currentStep   = s.next_step || 1;
        this.completedSteps = Array.from({ length: s.completed_steps || 0 }, (_, i) => i + 1);

        const os = (s.operating_system || 'windows').toLowerCase();
        this.subtasks = (s.steps || []).map(step => {
          const detail = step[os] || step['windows'] || {};
          return {
            id: step.step_number,
            name: step.step_name,
            assignedTeam: step.assigned_team || s.assigned_team || 'Unassigned',
            members: step.assigned_team_members || [],
            status: step.status,
            deadline: step.deadline || s.deadline || '',
            criticality: step.criticality || '',
            effortEstimate: step.effort_estimate || '',
            action: detail.action || '',
            filePath: detail.system_file_path || '',
            command: detail.commands_for_action || '',
            tools: detail.artifacts_tools_used || [],
            consideration: detail.precautions || '',
            subTasks: (detail.sub_tasks || []).map(st => ({
              description: st.description || '',
              items: st.items || [],
            })),
          };
        });

        this.currentVuln.progress = this.totalSteps > 0
          ? Math.round((s.completed_steps / s.total_steps) * 100)
          : 0;
      }

      // Refresh timeline silently (no loading spinner)
      await this.fetchTimeline(this.currentVuln.id, true);

      // All steps done → fetch final feedback
      if (res.data?.status === 'closed' || this.showFeedback) {
        await this.fetchFinalFeedback(this.currentVuln.id);
      }
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
    async fetchTimeline(fixVulId, silent = false) {
      if (!silent) this.timelineLoading = true;
      const res = await this.authStore.fetchUserVulnerabilityTimeline(fixVulId);
      if (!silent) this.timelineLoading = false;
      if (res.status && res.data?.timeline) {
        this.timeline = res.data.timeline.map(item => ({
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
      const res = await this.authStore.getUserFixFinalFeedback(fixVulId);
      this.loadingFeedback = false;
      if (res.status && res.data?.final_feedback) {
        this.finalFeedbackData = res.data.final_feedback;
        if (res.data.status) {
          this.currentVuln.status = res.data.status;
          this.currentVuln.closed_at = res.data.closed_at || null;
        }
      }
    },
    async submitFinalFeedback() {
      if (!this.currentVuln.id || !this.feedbackForm.fix_result) return;

      this.submittingFeedback = true;
      const res = await this.authStore.submitUserFixFinalFeedback(
        this.currentVuln.id,
        {
          feedback_comment: this.feedbackForm.feedback_comment,
          fix_result: this.feedbackForm.fix_result,
        }
      );
      this.submittingFeedback = false;

      if (!res.status) {
        Swal.fire('Error', res.message || 'Failed to submit feedback', 'error');
        return;
      }

      Swal.fire({
        icon: 'success',
        title: 'Feedback submitted!',
        text: res.message || 'Your feedback has been recorded.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Populate feedback data from response
      this.finalFeedbackData = res.data || {
        fix_result: this.feedbackForm.fix_result,
        feedback_comment: this.feedbackForm.feedback_comment,
        submitted_at: new Date().toISOString(),
      };

      // Reset form
      this.feedbackForm = { fix_result: '', feedback_comment: '' };
    },
  },

  async mounted() {
    const id = this.$route.query.id;
    const plugin_name = this.$route.query.plugin_name;
    const risk_factor = this.$route.query.risk_factor;

    if (!this.reportId || !this.asset || !id || !plugin_name || !risk_factor) {
      Swal.fire('Error', 'Missing vulnerability data. Please go back and try again.', 'error');
      return;
    }

    this.isLoading = true;

    // Step 1: Create fix vulnerability (user API)
    const createRes = await this.authStore.createUserFixVulnerability(
      this.reportId,
      this.asset,
      {
        id: String(id),
        plugin_name: String(plugin_name),
        risk_factor: String(risk_factor),
      }
    );

    if (!createRes.status) {
      this.isLoading = false;
      Swal.fire('Error', createRes.message || 'Failed to create fix vulnerability', 'error');
      return;
    }

    const created = createRes.data;
    this.currentVuln = {
      id: created._id,
      name: created.vulnerability_name,
      risk: `${(created.severity || '').toUpperCase()} RISK`,
      asset: created.asset,
      report_id: created.report_id,
      progress: 0,
      assignedTeam: created.assigned_team || '',
      deadline: '',
      artifactsTools: '',
      operatingSystem: '',
      status: created.status || '',
      closed_at: null,
    };

    // Step 2: Fetch steps (user API)
    const stepsRes = await this.authStore.getUserFixVulnerabilitySteps(created._id);

    this.isLoading = false;

    if (stepsRes.status) {
      const s = stepsRes.data;

      this.totalSteps = s.total_steps || 0;
      this.currentStep = s.next_step || 1;
      this.completedSteps = Array.from({ length: s.completed_steps || 0 }, (_, i) => i + 1);

      // Enrich currentVuln
      this.currentVuln.assignedTeam    = s.assigned_team || this.currentVuln.assignedTeam;
      this.currentVuln.deadline        = s.deadline || '';
      this.currentVuln.artifactsTools  = s.artifacts_tools || '';
      this.currentVuln.operatingSystem = s.operating_system || '';
      this.currentVuln.status          = s.vulnerability_status || this.currentVuln.status;

      // Map steps to subtasks
      const os = (s.operating_system || 'windows').toLowerCase();
      this.subtasks = (s.steps || []).map(step => {
        const detail = step[os] || step['windows'] || {};
        return {
          id: step.step_number,
          name: step.step_name,
          assignedTeam: step.assigned_team || s.assigned_team || 'Unassigned',
          members: step.assigned_team_members || [],
          status: step.status,
          deadline: step.deadline || s.deadline || '',
          criticality: step.criticality || '',
          effortEstimate: step.effort_estimate || '',
          action: detail.action || '',
          filePath: detail.system_file_path || '',
          command: detail.commands_for_action || '',
          tools: detail.artifacts_tools_used || [],
          consideration: detail.precautions || '',
          subTasks: (detail.sub_tasks || []).map(st => st.description || ''),
        };
      });

      this.currentVuln.progress = this.totalSteps > 0
        ? Math.round((s.completed_steps / s.total_steps) * 100)
        : 0;

      // Fetch activity timeline
      await this.fetchTimeline(created._id);

      // If all steps completed, fetch final feedback
      if (s.completed_steps > 0 && s.completed_steps >= s.total_steps) {
        await this.fetchFinalFeedback(created._id);
      }
    } else {
      Swal.fire('Warning', 'Fix vulnerability created but could not load steps.', 'warning');
    }
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
.rt-feedback-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.rt-feedback-emoji  { font-size: 1.4rem; line-height: 1; }
.rt-feedback-title  { font-size: 1rem; font-weight: 800; color: #1e293b; flex: 1; }
.rt-feedback-row    { display: flex; gap: 24px; flex-wrap: wrap; }
.rt-feedback-field  { display: flex; flex-direction: column; gap: 4px; }
.rt-fb-label { font-size: 0.62rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; margin: 0; }
.rt-fb-value { font-size: 0.875rem; font-weight: 600; color: #1e293b; margin: 0; }
.rt-fb-result-badge { display: inline-block; background: #dcfce7; color: #166534; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; padding: 4px 14px; border-radius: 50px; }
.rt-feedback-empty  { font-size: 0.84rem; color: #64748b; display: flex; align-items: center; padding: 8px 0; }
.rt-fb-form { display: flex; flex-direction: column; gap: 0; }
.rt-fb-form-desc { font-size: 0.84rem; color: #475569; margin: 0 0 16px; line-height: 1.5; }
.rt-fb-form-row { display: flex; gap: 16px; flex-wrap: wrap; }
.rt-fb-form-field { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
.rt-fb-select {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 14px;
  font-size: 0.85rem;
  color: #334155;
  background: #f8f9fc;
  outline: none;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.2s;
}
.rt-fb-select:focus { border-color: #0f696e; background: #ffffff; }
.rt-fb-select:disabled { opacity: 0.6; cursor: not-allowed; }
.rt-fb-submit-row { display: flex; justify-content: flex-end; margin-top: 16px; padding-top: 14px; border-top: 1px solid #bbf7d0; }

/* ─── Support button ────────────────────────────────────────────────── */
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

/* ─── Modal styles ──────────────────────────────────────────────────── */
.vc-modal-content  { border-radius: 16px; overflow: hidden; border: none; }
.vc-modal-header   { background: #241447; color: #fff; border-bottom: none; padding: 18px 24px; }
.vc-modal-title    { font-size: 1rem; font-weight: 700; color: #fff; margin: 0; }
.vc-modal-section-label { font-size: 0.82rem; font-weight: 700; color: #241447; }
.vc-modal-footer   { border-top: 1px solid #f1f5f9; padding: 14px 24px; display: flex; justify-content: flex-end; gap: 10px; }
.vc-step-pill {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 6px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 600;
  color: #475569; background: #f1f5f9; border: 1.5px solid #e2e8f0;
  cursor: pointer; transition: all 0.15s; width: 100%; text-align: center;
}
.vc-step-pill-active { background: #e0f2f1; color: #0f696e; border-color: #0f696e; }
.vc-textarea {
  width: 100%; border: 1px solid #e2e8f0; border-radius: 10px;
  padding: 10px 14px; font-size: 0.875rem; color: #1e293b;
  background: #f8f9fc; outline: none; resize: vertical; font-family: inherit;
}
.vc-textarea:focus { box-shadow: 0 0 0 2px rgba(15,105,110,0.2); border-color: #0f696e; }
.vc-btn-primary {
  background: #241447; color: white; border: none; border-radius: 8px;
  padding: 8px 18px; font-size: 0.875rem; font-weight: 600; cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px;
}
.vc-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.vc-btn-secondary {
  background: white; color: #241447; border: 1px solid #e2e8f0;
  border-radius: 8px; padding: 8px 18px; font-size: 0.875rem; font-weight: 600; cursor: pointer;
}
.rt-support-raised-note {
  font-size: 0.84rem; color: #0f696e; display: flex; align-items: center;
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px;
}

/* ─── Loading Overlay ───────────────────────────────────────────────── */
.rt-loading-overlay { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; }

/* ─── Shell ─────────────────────────────────────────────────────────── */
.rt-content { background: #f4f5f8; min-height: 100vh; padding: 0; }

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
.rt-title    { font-size: 1.4rem; font-weight: 800; color: #1e293b; margin: 0 0 4px; }
.rt-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; }

/* ─── Stepper ───────────────────────────────────────────────────────── */
.rt-stepper-wrap { background: #ffffff; padding: 24px 28px 40px; border-bottom: 1px solid #f1f5f9; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04); }
.rt-stepper { display: flex; align-items: center; justify-content: center; width: 100%; }
.rt-step-circle-wrap { display: flex; flex-direction: column; align-items: center; position: relative; flex-shrink: 0; }
.rt-step-line { flex: 1; height: 2px; min-width: 24px; max-width: 60px; margin: 0 4px; flex-shrink: 1; }
.rt-line-done    { background: #0f696e; }
.rt-line-pending { background: #e2e8f0; }
.rt-step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, box-shadow 0.2s; }
.rt-circle-done    { background: #0f696e; color: #ffffff; }
.rt-circle-active  { background: #241447; color: #ffffff; box-shadow: 0 0 0 4px rgba(36, 20, 71, 0.14); }
.rt-circle-pending { background: #e2e8f0; color: #94a3b8; }
.rt-step-num { font-size: 0.75rem; font-weight: 700; }
.rt-active-label { position: absolute; top: calc(100% + 6px); left: 50%; transform: translateX(-50%); font-size: 0.58rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; color: #ffffff; background: #241447; padding: 3px 10px; border-radius: 50px; white-space: nowrap; pointer-events: none; z-index: 1; }

/* ─── Body Grid ─────────────────────────────────────────────────────── */
.rt-body { display: grid; grid-template-columns: 1fr 300px; gap: 20px; padding: 28px 28px 48px; }
.rt-main-col { display: flex; flex-direction: column; gap: 18px; min-width: 0; }

/* ─── Tech Card ─────────────────────────────────────────────────────── */
.rt-tech-card { background: #ffffff; border-radius: 14px; padding: 22px 24px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); border: 1px solid #f1f5f9; border-left: 4px solid #dc2626; }
.rt-tech-label-wrap { display: inline-flex; align-items: center; gap: 6px; background: #f1f5f9; border-radius: 6px; padding: 4px 10px; margin-bottom: 14px; }
.rt-tech-label-icon { font-size: 0.78rem; color: #475569; }
.rt-tech-label-text { font-size: 0.78rem; font-weight: 600; color: #475569; }
.rt-tech-left   { flex: 1; min-width: 0; }
.rt-critical-badge { display: inline-block; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.07em; text-transform: uppercase; background: #fee2e2; color: #dc2626; padding: 4px 12px; border-radius: 50px; margin-bottom: 10px; }
.rt-vuln-name   { font-size: 1.05rem; font-weight: 800; color: #1e293b; margin: 0 0 6px; line-height: 1.3; }
.rt-label-text  { font-size: 0.8rem; color: #64748b; font-weight: 500; }
.rt-asset-chip  { display: inline-block; font-size: 0.78rem; font-weight: 600; background: #f1f5f9; color: #334155; padding: 3px 12px; border-radius: 50px; border: 1px solid #e2e8f0; }
.rt-tech-right  { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex-shrink: 0; margin-left: 24px; }
.rt-progress-label { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; }
.rt-progress-num { font-size: 2.5rem; font-weight: 800; color: #241447; line-height: 1.1; }
.rt-progress-pct { font-size: 1.2rem; font-weight: 700; color: #64748b; }
.rt-tech-meta-row { display: flex; flex-wrap: wrap; gap: 16px; padding-top: 14px; border-top: 1px solid #f1f5f9; }
.rt-tech-meta-item { display: flex; flex-direction: column; gap: 2px; min-width: 120px; }
.rt-tech-meta-label { font-size: 0.58rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; }
.rt-tech-meta-val   { font-size: 0.82rem; font-weight: 600; color: #1e293b; }

/* ─── Subtasks Card ─────────────────────────────────────────────────── */
.rt-subtasks-card { background: #ffffff; border-radius: 14px; padding: 22px 24px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); border: 1px solid #f1f5f9; }
.rt-subtasks-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.rt-subtasks-title  { font-size: 0.95rem; font-weight: 700; color: #1e293b; }
.rt-tasks-completed { font-size: 0.78rem; color: #0f696e; font-weight: 600; }
.rt-task-list { display: flex; flex-direction: column; }
.rt-task-item { border-bottom: 1px solid #f1f5f9; cursor: pointer; transition: background 0.15s; border-radius: 8px; padding: 0 8px; background: #ffffff; }
.rt-task-item:last-child { border-bottom: none; }
.rt-task-item:hover { background: #f8f9fc; }
.rt-task-completed { background: #f0fdf4; }
.rt-task-row { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; }
.rt-task-left { display: flex; align-items: center; gap: 12px; }
.rt-task-circle { width: 28px; height: 28px; border-radius: 50%; background: #0f696e; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; flex-shrink: 0; }
.rt-circle-task-done { background: #0f696e !important; }
.rt-task-info { display: flex; flex-direction: column; gap: 2px; }
.rt-task-name     { font-size: 0.875rem; font-weight: 600; color: #1e293b; }
.rt-task-assignee { font-size: 0.75rem; color: #94a3b8; }
.rt-task-chevron  { display: flex; align-items: center; transition: transform 0.2s; color: #94a3b8; }
.rt-chevron-open  { transform: rotate(180deg); }

/* Step status badges */
.rt-step-status-badge { font-size: 0.68rem; font-weight: 700; padding: 3px 10px; border-radius: 50px; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
.rt-status-done        { background: #d1fae5; color: #065f46; }
.rt-status-pending-red { background: #fee2e2; color: #dc2626; }

/* Expanded panel */
.rt-task-expanded { padding: 4px 0 20px 40px; display: flex; flex-direction: column; gap: 16px; }
.rt-expand-meta-row { display: flex; flex-wrap: wrap; gap: 16px; background: #f8f9fc; border-radius: 8px; padding: 10px 14px; }
.rt-expand-meta-item { display: flex; align-items: center; gap: 4px; font-size: 0.78rem; color: #475569; }
.rt-expand-meta-val  { font-weight: 600; color: #1e293b; }
.rt-expand-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rt-expand-section { display: flex; flex-direction: column; gap: 6px; }
.rt-expand-label { font-size: 0.6rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #94a3b8; }
.rt-expand-text  { font-size: 0.84rem; color: #334155; margin: 0; line-height: 1.55; }
.rt-filepath-box { background: #f8f9fc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 14px; font-family: 'Courier New', Courier, monospace; font-size: 0.8rem; color: #475569; word-break: break-all; line-height: 1.6; }
.rt-code-block { background: #1e293b; border-radius: 8px; padding: 12px 16px; font-family: 'Courier New', Courier, monospace; font-size: 0.82rem; color: #4ade80; word-break: break-all; line-height: 1.6; }
.rt-tool-chip { display: inline-block; font-size: 0.72rem; font-weight: 600; background: #f1f5f9; color: #475569; padding: 3px 11px; border-radius: 50px; border: 1px solid #e2e8f0; }
.rt-consideration-box { display: flex; align-items: flex-start; gap: 6px; font-size: 0.82rem; color: #c2410c; line-height: 1.55; margin-top: 2px; }
.rt-checklist { display: flex; flex-direction: column; gap: 8px; margin-top: 2px; }
.rt-check-item { display: flex; align-items: center; gap: 10px; font-size: 0.84rem; color: #334155; cursor: pointer; user-select: none; }
.rt-checkbox { width: 16px; height: 16px; border-radius: 4px; accent-color: #0f696e; cursor: pointer; flex-shrink: 0; }
.rt-subtask-list { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.rt-subtask-entry { display: flex; flex-direction: column; gap: 4px; }
.rt-subtask-desc { font-size: 0.84rem; font-weight: 600; color: #334155; }
.rt-subtask-dash { font-size: 0.84rem; color: #94a3b8; padding-left: 4px; }
.rt-member-chip { display: inline-flex; align-items: center; font-size: 0.72rem; font-weight: 600; background: #e0f2f1; color: #0f696e; padding: 3px 10px; border-radius: 50px; border: 1px solid rgba(15,105,110,0.2); }

/* Complete step section */
.rt-step-complete-section { margin-top: 20px; padding-top: 18px; border-top: 1px solid #f1f5f9; }
.rt-step-complete-label { font-size: 0.82rem; font-weight: 600; color: #334155; margin: 0 0 10px; }
.rt-step-comment-textarea {
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.85rem;
  color: #334155;
  background: #f8f9fc;
  resize: vertical;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s;
}
.rt-step-comment-textarea:focus { border-color: #0f696e; background: #ffffff; }
.rt-step-comment-textarea:disabled { opacity: 0.6; cursor: not-allowed; }

/* Action buttons bar */
.rt-action-btns { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 14px; }
.rt-admin-note  { font-size: 0.78rem; color: #64748b; display: flex; align-items: center; flex: 1; }
.btn-complete {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #0f696e;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
  white-space: nowrap;
}
.btn-complete:hover:not(:disabled) { background: #0d5a5f; }
.btn-complete:disabled { opacity: 0.55; cursor: not-allowed; }

/* ─── Right Sidebar ─────────────────────────────────────────────────── */
.rt-sidebar { display: flex; flex-direction: column; gap: 18px; }
.rt-timeline-card { background: #ffffff; border-radius: 14px; padding: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); border: 1px solid #f1f5f9; }
.rt-card-heading { display: block; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.09em; text-transform: uppercase; color: #94a3b8; margin-bottom: 16px; }
.rt-tl-list { display: flex; flex-direction: column; }
.rt-tl-item { display: flex; gap: 10px; padding-bottom: 16px; }
.rt-tl-item-last { padding-bottom: 0; }
.rt-tl-dot-col { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; padding-top: 3px; }
.rt-tl-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.rt-tl-connector { flex: 1; width: 1px; background: #e2e8f0; margin-top: 5px; min-height: 18px; }
.rt-tl-content { display: flex; flex-direction: column; gap: 2px; padding-bottom: 2px; }
.rt-tl-time  { font-size: 0.62rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #94a3b8; }
.rt-tl-event { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
.rt-tl-desc  { font-size: 0.78rem; color: #64748b; line-height: 1.45; }

@media (max-width: 1200px) {
  .rt-body { grid-template-columns: 1fr; }
  .rt-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
}
@media (max-width: 768px) {
  .rt-body { padding: 16px; }
  .rt-sidebar { grid-template-columns: 1fr; }
  .rt-page-header { padding: 72px 16px 16px; }
  .rt-stepper-wrap { overflow-x: auto; padding-bottom: 36px; }
  .rt-stepper { min-width: 560px; }
}
</style>
