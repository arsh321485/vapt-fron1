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
            </div>

            <!-- Stepper -->
            <div class="rt-stepper-wrap">
              <div class="rt-stepper">
                <div
                  v-for="step in totalSteps"
                  :key="step"
                  class="rt-step-item"
                >
                  <!-- Connector line before each step (except first) -->
                  <div
                    v-if="step > 1"
                    class="rt-step-line"
                    :class="completedSteps.includes(step - 1) ? 'rt-line-done' : 'rt-line-pending'"
                  ></div>

                  <!-- Circle + active label -->
                  <div class="rt-step-circle-wrap">
                    <div
                      class="rt-step-circle"
                      :class="{
                        'rt-circle-done':    completedSteps.includes(step),
                        'rt-circle-active':  step === currentStep,
                        'rt-circle-pending': !completedSteps.includes(step) && step !== currentStep
                      }"
                    >
                      <span v-if="completedSteps.includes(step)">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="white" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                      </span>
                      <span v-else class="rt-step-num">{{ step }}</span>
                    </div>
                    <div v-if="step === currentStep" class="rt-active-label">UPDATE CONFIGURATION</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Body: 2-column grid -->
            <div class="rt-body">

              <!-- ── LEFT COLUMN ── -->
              <div class="rt-main-col">

                <!-- Technical Insight Card -->
                <div class="rt-tech-card">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="rt-tech-left">
                      <span class="rt-critical-badge">{{ currentVuln.risk }}</span>
                      <h3 class="rt-vuln-name">{{ currentVuln.name }}</h3>
                      <div class="d-flex align-items-center gap-2 mt-2 flex-wrap">
                        <span class="rt-label-text">Impacted Asset:</span>
                        <span class="rt-asset-chip">{{ currentVuln.asset }}</span>
                      </div>
                    </div>
                    <div class="rt-tech-right">
                      <span class="rt-progress-label">REMEDIATION PROGRESS</span>
                      <div class="rt-progress-num">
                        {{ currentVuln.progress }}<span class="rt-progress-pct">%</span>
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
                      @click="toggleTask(idx)"
                    >
                      <!-- Task summary row -->
                      <div class="rt-task-row">
                        <div class="rt-task-left">
                          <div class="rt-task-circle">{{ task.id }}</div>
                          <div class="rt-task-info">
                            <span class="rt-task-name">{{ task.name }}</span>
                            <span class="rt-task-assignee">{{ task.assignee }}</span>
                          </div>
                        </div>
                        <div class="rt-task-chevron" :class="{ 'rt-chevron-open': expandedTask === idx }">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 6L8 10L12 6" stroke="#94a3b8" stroke-width="1.5"
                                  stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                        </div>
                      </div>

                      <!-- Expanded detail panel -->
                      <div v-if="expandedTask === idx && task.action" class="rt-task-expanded">

                        <!-- ACTION -->
                        <div class="rt-expand-section">
                          <span class="rt-expand-label">ACTION</span>
                          <p class="rt-expand-text">{{ task.action }}</p>
                        </div>

                        <!-- FILE PATH -->
                        <div v-if="task.filePath" class="rt-expand-section">
                          <span class="rt-expand-label">FILE PATH</span>
                          <div class="rt-filepath-box">{{ task.filePath }}</div>
                        </div>

                        <!-- COMMAND TO RUN -->
                        <div v-if="task.command" class="rt-expand-section">
                          <span class="rt-expand-label">COMMAND TO RUN</span>
                          <div class="rt-code-block">
                            <span class="rt-code-prompt">$ </span>{{ task.command }}
                          </div>
                        </div>

                        <!-- ARTIFACTS / TOOLS USED -->
                        <div v-if="task.tools && task.tools.length" class="rt-expand-section">
                          <span class="rt-expand-label">ARTIFACTS / TOOLS USED</span>
                          <div class="d-flex flex-wrap gap-2 mt-1">
                            <span v-for="tool in task.tools" :key="tool" class="rt-tool-chip">
                              {{ tool }}
                            </span>
                          </div>
                        </div>

                        <!-- IMPORTANT CONSIDERATION -->
                        <div v-if="task.consideration" class="rt-expand-section">
                          <span class="rt-expand-label">IMPORTANT CONSIDERATION</span>
                          <div class="rt-consideration-box">
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                                 style="flex-shrink:0; margin-top:1px;">
                              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM8 5v3.5M8 10.5v.5"
                                    stroke="#f97316" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                            <span>{{ task.consideration }}</span>
                          </div>
                        </div>

                        <!-- SUB-TASKS -->
                        <div v-if="task.subTasks && task.subTasks.length" class="rt-expand-section">
                          <span class="rt-expand-label">SUB-TASKS</span>
                          <div class="rt-checklist">
                            <label
                              v-for="(sub, si) in task.subTasks"
                              :key="si"
                              class="rt-check-item"
                              @click.stop
                            >
                              <input type="checkbox" class="rt-checkbox" />
                              <span>{{ sub }}</span>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  <!-- Bottom action buttons -->
                  <div class="rt-action-btns">
                    <button class="btn-save">Save Progress</button>
                    <button class="btn-complete">Complete Step {{ currentStep }}</button>
                  </div>
                </div>

              </div>
              <!-- /rt-main-col -->

              <!-- ── RIGHT SIDEBAR ── -->
              <div class="rt-sidebar">

                <!-- Activity Timeline Card -->
                <div class="rt-timeline-card">
                  <span class="rt-card-heading">ACTIVITY TIMELINE</span>
                  <div class="rt-tl-list">
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
                        <span class="rt-tl-desc">{{ item.desc }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Asset Statistics Card -->
                <div class="rt-stats-card">
                  <span class="rt-card-heading">ASSET STATISTICS</span>

                  <div class="rt-stat-row">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="rt-stat-label">Uptime</span>
                      <span class="rt-stat-value rt-stat-value-green">{{ uptime }}%</span>
                    </div>
                    <div class="rt-stat-bar">
                      <div
                        class="rt-stat-fill rt-stat-fill-green"
                        :style="{ width: uptime + '%' }"
                      ></div>
                    </div>
                  </div>

                  <div class="rt-stat-row">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                      <span class="rt-stat-label">Risk Score</span>
                      <span class="rt-stat-value rt-stat-value-red">{{ riskScore }} / 10</span>
                    </div>
                    <div class="rt-stat-bar">
                      <div
                        class="rt-stat-fill rt-stat-fill-red"
                        :style="{ width: (riskScore / 10) * 100 + '%' }"
                      ></div>
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

export default {
  name: 'RemediationTimelineView',
  components: { DashboardMenu, DashboardHeader },

  data() {
    return {
      currentStep: 5,
      totalSteps: 8,
      completedSteps: [1, 2, 3, 4],
      expandedTask: 0,

      currentVuln: {
        name: 'CVE-2023-35078: Remote Unauthenticated API Access',
        risk: 'CRITICAL RISK',
        asset: '192.168.1.185 (Primary Gateway)',
        progress: 42,
      },

      subtasks: [
        {
          id: 1,
          name: 'Identify Vulnerable Endpoint',
          assignee: 'Rahul Sharma',
          action: 'Review logs to identify endpoints where user input is executed.',
          filePath: '/var/log/apache2/access.log, /var/log/nginx/access.log',
          command: 'grep -i "cmd|exec|system" /var/log/apache2/access.log',
          tools: ['grep', 'wss', 'terminal'],
          consideration: 'Ensure logs are intact and not rotated.',
          subTasks: ['Review apache logs', 'Review nginx logs'],
        },
        {
          id: 2,
          name: 'Backup Application Files',
          assignee: 'Rahul Sharma',
          action: '',
          filePath: '',
          command: '',
          tools: [],
          consideration: '',
          subTasks: [],
        },
        {
          id: 3,
          name: 'Locate Unsafe Functions',
          assignee: 'Rahul Sharma',
          action: '',
          filePath: '',
          command: '',
          tools: [],
          consideration: '',
          subTasks: [],
        },
      ],

      timeline: [
        {
          time: 'TODAY, 10:45 AM',
          event: 'Task Completed',
          desc: '"Revoke old SSH keys" by Alex Rivera.',
          color: '#0f696e',
        },
        {
          time: 'TODAY, 09:12 AM',
          event: 'Credential Reset',
          desc: 'System-wide admin password rotation successful.',
          color: '#0f696e',
        },
        {
          time: 'YESTERDAY, 4:30 PM',
          event: 'Workflow Initiated',
          desc: 'Remediation process for CVE-2023-35078 started by SecOps Automator.',
          color: '#241447',
        },
        {
          time: 'OCT 24, 11:20 AM',
          event: 'Vulnerability Detected',
          desc: 'Critical API access exploit identified during routine edge scan.',
          color: '#94a3b8',
        },
      ],

      uptime: 99.98,
      riskScore: 8.2,
    };
  },

  computed: {
    completedSubtasksCount() {
      return this.completedSteps.length;
    },
  },

  methods: {
    toggleTask(idx) {
      this.expandedTask = this.expandedTask === idx ? null : idx;
    },
  },

  mounted() {
    // Auth store available for future API integration
    const store = useAuthStore(); // eslint-disable-line no-unused-vars
  },
};
</script>

<style scoped>
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
  border-bottom: 1px solid #e2e8f0;
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
  padding: 20px 28px 28px;
  border-bottom: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.rt-stepper {
  display: flex;
  align-items: center;
}

.rt-step-item {
  display: flex;
  align-items: center;
  flex: 1;
}

.rt-step-item:last-child {
  flex: 0 0 auto;
}

.rt-step-line {
  flex: 1;
  height: 2px;
  min-width: 20px;
  margin: 0 2px;
}

.rt-line-done {
  background: #0f696e;
}

.rt-line-pending {
  background: #e2e8f0;
}

.rt-step-circle-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
}

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
  top: calc(100% + 8px);
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

/* ─── Technical Insight Card ────────────────────────────────────────── */
.rt-tech-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #f1f5f9;
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
  background: #fee2e2;
  color: #dc2626;
  padding: 4px 12px;
  border-radius: 50px;
  margin-bottom: 10px;
}

.rt-vuln-name {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.3;
}

.rt-label-text {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.rt-asset-chip {
  display: inline-block;
  font-size: 0.78rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #334155;
  padding: 3px 12px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
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
}

.rt-task-item:last-child {
  border-bottom: none;
}

.rt-task-item:hover {
  background: #f8fafc;
}

.rt-task-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
}

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
  transition: transform 0.2s;
  color: #94a3b8;
}

.rt-chevron-open {
  transform: rotate(180deg);
}

/* Expanded detail panel */
.rt-task-expanded {
  padding: 4px 0 20px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rt-expand-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rt-expand-label {
  font-size: 0.6rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #94a3b8;
}

.rt-expand-text {
  font-size: 0.84rem;
  color: #334155;
  margin: 0;
  line-height: 1.55;
}

.rt-filepath-box {
  background: #f8f9fc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.8rem;
  color: #475569;
  word-break: break-all;
  line-height: 1.6;
}

.rt-code-block {
  background: #1e293b;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.82rem;
  color: #4ade80;
  word-break: break-all;
  line-height: 1.6;
}

.rt-code-prompt {
  color: #94a3b8;
  user-select: none;
}

.rt-tool-chip {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #475569;
  padding: 3px 11px;
  border-radius: 50px;
  border: 1px solid #e2e8f0;
}

.rt-consideration-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 0.82rem;
  color: #c2410c;
  line-height: 1.55;
}

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

/* Action buttons */
.rt-action-btns {
  display: flex;
  align-items: center;
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
  color: #dc2626;
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
  background: #dc2626;
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
