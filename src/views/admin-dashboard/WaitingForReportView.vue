<template>
  <main class="wait-main">
    <div class="wait-topbar">
      <router-link :to="logoPath">
        <img src="@/assets/images/vaptfix_white.png" alt="VaptFix" class="wait-logo" />
      </router-link>
    </div>

    <div class="wait-page">
      <div class="wait-card">
        <div class="wait-icon-wrap">
          <i
            class="bi"
            :class="cardsGenerating ? 'bi-gear-fill wait-icon wait-icon-spin' : 'bi-hourglass-split wait-icon'"
          ></i>
        </div>

        <h1 class="wait-title">
          {{
            awaitingScopeAnalysis
              ? "Our Super admin will analyse your file"
              : cardsGenerating
                ? "Preparing your dashboard"
                : "Almost there"
          }}
        </h1>

        <p class="wait-message">
          {{
            awaitingScopeAnalysis
              ? "Hang tight on this screen. After Super Admin uploads the processed file for your account, we will take you to add users, then risk criteria, then the dashboard with your full data."
              : cardsGenerating
                ? "Your report is uploaded. Agents are being created — hang tight while we finish setup."
                : "Your Super Admin needs to upload your first vulnerability scan report before you can get started. We'll let you know the moment it's ready."
          }}
        </p>

        <p v-if="statusMessage && !cardsGenerating" class="wait-status">{{ statusMessage }}</p>

        <!-- Progress bar (same pattern as previous scoping flow) -->
        <div v-if="cardsGenerating" class="polling-progress">
          <div class="polling-bar-wrap">
            <div class="polling-bar">
              <div
                v-if="pollingData.cards_total > 0"
                class="polling-bar-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
              <div v-else class="polling-bar-fill polling-bar-indeterminate"></div>
            </div>
            <span v-if="pollingData.cards_total > 0" class="polling-pct">{{ progressPercent }}%</span>
          </div>
          <div v-if="hasProgressStats" class="polling-stats">
            <span v-if="pollingData.cards_total" class="polling-stat">
              <span class="polling-label">Agents:</span>
              <span class="polling-val">{{ pollingData.cards_generated }}/{{ pollingData.cards_total }}</span>
            </span>
            <span v-if="pollingData.elapsed_time_text" class="polling-stat">
              <span class="polling-label">Elapsed:</span>
              <span class="polling-val">{{ pollingData.elapsed_time_text }}</span>
            </span>
            <span v-if="pollingData.remaining_time_text" class="polling-stat">
              <span class="polling-label">Remaining:</span>
              <span class="polling-val">{{ pollingData.remaining_time_text }}</span>
            </span>
          </div>
        </div>

        <div v-else class="wait-spinner" role="status" aria-label="Waiting for report">
          <div class="spinner-border text-primary"></div>
        </div>

        <p class="wait-hint">
          {{ cardsGenerating ? "Progress updates automatically" : "Checking automatically — no refresh needed" }}
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import { fetchScopeAnalysisStatus, isScopeAnalysisReady } from "@/services/scopeFileApi";
import {
  clearScopeFileAwaitingSuperadmin,
  isScopeFileAwaitingSuperadmin,
  readStoredAdminEmail,
} from "@/utils/scopeScanGate";
import { getAuthenticatedAppHome } from "@/utils/authenticatedHome";

const REPORT_POLL_MS = 30000;
const PROGRESS_POLL_MS = 2500;

export default {
  name: "WaitingForReportView",
  data() {
    return {
      statusMessage: "",
      reportPollTimer: null,
      progressPollTimer: null,
      checking: false,
      cardsGenerating: false,
      sawGenerating: false,
      pollingData: {
        elapsed_time_text: "",
        remaining_time_text: "",
        estimated_total_text: "",
        cards_total: 0,
        cards_generated: 0,
        reports_total: 0,
        reports_ready: 0,
      },
    };
  },
  computed: {
    logoPath() {
      return getAuthenticatedAppHome();
    },
    progressPercent() {
      const total = this.pollingData.cards_total || 0;
      if (!total) return 0;
      const pct = Math.round((this.pollingData.cards_generated / total) * 100);
      return Math.min(100, Math.max(0, pct));
    },
    hasProgressStats() {
      return !!(
        this.pollingData.cards_total ||
        this.pollingData.elapsed_time_text ||
        this.pollingData.remaining_time_text
      );
    },
    awaitingScopeAnalysis() {
      return isScopeFileAwaitingSuperadmin(readStoredAdminEmail());
    },
  },
  methods: {
    async redirectFromOnboardingState() {
      const authStore = useAuthStore();
      const route = await authStore.getAdminOnboardingRoute();
      if (route !== "/waiting-for-report") {
        this.stopAllPolling();
        this.$router.replace(route);
        return true;
      }
      return false;
    },

    async checkReportStatus() {
      if (this.checking) return;
      this.checking = true;
      try {
        if (this.awaitingScopeAnalysis) {
          const analysis = await fetchScopeAnalysisStatus();
          if (isScopeAnalysisReady(analysis)) {
            clearScopeFileAwaitingSuperadmin();
          }
        }
        const authStore = useAuthStore();
        const res = await authStore.getReportStatus();
        this.statusMessage = res.message || "";

        if (res.state === "ready" || res.state === "needs_risk_criteria" || res.hasReport) {
          if (res.hasReport) clearScopeFileAwaitingSuperadmin();
          await this.redirectFromOnboardingState();
        }
      } catch {
        // stay on waiting screen
      } finally {
        this.checking = false;
      }
    },

    async checkUploadProgress() {
      try {
        const authStore = useAuthStore();
        const res = await authStore.getScopingUploadStatus();

        if (res.cards_generating === true) {
          this.cardsGenerating = true;
          this.sawGenerating = true;
          this.pollingData = {
            elapsed_time_text: res.elapsed_time_text || "",
            remaining_time_text: res.remaining_time_text || "",
            estimated_total_text: res.estimated_total_text || "",
            cards_total: res.cards_total || 0,
            cards_generated: res.cards_generated || 0,
            reports_total: res.reports_total || 0,
            reports_ready: res.reports_ready || 0,
          };
          return;
        }

        // Generation finished (or file ready) after we saw progress → re-check onboarding gate
        if (this.sawGenerating || res.file_uploaded === true) {
          this.cardsGenerating = false;
          if (this.pollingData.cards_total > 0) {
            this.pollingData.cards_generated = this.pollingData.cards_total;
          }
          await this.redirectFromOnboardingState();
        }
      } catch {
        // silently retry
      }
    },

    startReportPolling() {
      this.stopReportPolling();
      this.reportPollTimer = setInterval(() => {
        if (!document.hidden) this.checkReportStatus();
      }, REPORT_POLL_MS);
    },

    startProgressPolling() {
      this.stopProgressPolling();
      this.progressPollTimer = setInterval(() => {
        if (!document.hidden) this.checkUploadProgress();
      }, PROGRESS_POLL_MS);
    },

    stopReportPolling() {
      if (this.reportPollTimer) {
        clearInterval(this.reportPollTimer);
        this.reportPollTimer = null;
      }
    },

    stopProgressPolling() {
      if (this.progressPollTimer) {
        clearInterval(this.progressPollTimer);
        this.progressPollTimer = null;
      }
    },

    stopAllPolling() {
      this.stopReportPolling();
      this.stopProgressPolling();
    },
  },
  async mounted() {
    await this.checkReportStatus();
    if (this.$route.path !== "/waiting-for-report") return;

    await this.checkUploadProgress();
    if (this.$route.path !== "/waiting-for-report") return;

    this.startReportPolling();
    this.startProgressPolling();
  },
  beforeUnmount() {
    this.stopAllPolling();
  },
};
</script>

<style scoped>
.wait-main {
  min-height: 100vh;
  background: linear-gradient(160deg, #f4f2fb 0%, #ffffff 45%, #ebe7f8 100%);
}

.wait-topbar {
  background: #241447;
  padding: 12px 28px;
  display: flex;
  align-items: center;
}

.wait-logo {
  height: 36px;
  width: auto;
}

.wait-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  min-height: calc(100vh - 60px);
}

.wait-card {
  max-width: 520px;
  width: 100%;
  text-align: center;
  background: #fff;
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 12px 40px rgba(36, 20, 71, 0.12);
  border: 1px solid rgba(36, 20, 71, 0.08);
}

.wait-icon-wrap {
  width: 72px;
  height: 72px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background: rgba(49, 33, 177, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.wait-icon {
  font-size: 32px;
  color: #3121b1;
}

.wait-icon-spin {
  animation: wait-spin 2.2s linear infinite;
}

.wait-title {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.wait-message {
  font-size: 16px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 16px;
}

.wait-status {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.wait-spinner {
  margin: 8px 0 16px;
}

.wait-hint {
  font-size: 13px;
  color: #9ca3af;
  margin: 16px 0 0;
}

.polling-progress {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-top: 8px;
  text-align: left;
}

.polling-bar-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.polling-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.polling-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f696e, #10b981);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.polling-bar-indeterminate {
  width: 35%;
  animation: polling-indeterminate 1.2s ease-in-out infinite;
}

.polling-pct {
  font-size: 12px;
  font-weight: 700;
  color: #0f696e;
  min-width: 36px;
  text-align: right;
}

.polling-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  margin-top: 12px;
}

.polling-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #475569;
}

.polling-label {
  font-weight: 600;
}

.polling-val {
  color: #0f696e;
  font-weight: 700;
}

@keyframes wait-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes polling-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(320%); }
}

@media (max-width: 576px) {
  .wait-card {
    padding: 36px 24px;
  }
  .wait-title {
    font-size: 22px;
  }
}
</style>
