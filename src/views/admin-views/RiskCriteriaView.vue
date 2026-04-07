<template>
  <main class="rc-main">

    <!-- TOP BAR -->
    <div class="row gx-0 no-gutters">
      <DashboardHeader />
    </div>

    <div class="rc-page">

      <!-- STEPPER -->
      <div v-if="!isEditMode" class="rc-stepper-row">
        <div class="rc-step rc-step-done">
          <span class="rc-step-num"><i class="bi bi-check-lg"></i></span>
          <span class="rc-step-label">1. Add users</span>
        </div>
        <div class="rc-step-line rc-line-done"></div>
        <div class="rc-step rc-step-active">
          <span class="rc-step-num rc-step-num-active">2</span>
          <span class="rc-step-label rc-step-label-active">2. Risk Criteria</span>
        </div>
      </div>

      <!-- PAGE HEADER -->
      <div class="rc-page-header">
        <h1 class="rc-title">Configure Risk Severity</h1>
        <p class="rc-subtitle">Define how VaptFix Pro classifies vulnerabilities across your infrastructure. Choose criteria that align with your organizational security standards.</p>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="rc-layout">

        <!-- LEFT: 2x2 severity cards -->
        <div class="rc-cards-grid">

          <!-- Critical -->
          <div class="rc-sev-card">
            <div class="rc-sev-header">
              <span class="rc-sev-bar rc-bar-critical"></span>
              <span class="rc-sev-name">Critical</span>
            </div>
            <label class="rc-field-label">Existing Level</label>
            <select class="rc-select" v-model="form.critical" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt">{{ opt }}</option>
            </select>
            <label class="rc-field-label mt-3">New Level</label>
            <select class="rc-select" v-model="form.critical" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt">{{ opt }}</option>
            </select>
          </div>

          <!-- High -->
          <div class="rc-sev-card">
            <div class="rc-sev-header">
              <span class="rc-sev-bar rc-bar-high"></span>
              <span class="rc-sev-name">High</span>
            </div>
            <label class="rc-field-label">IMPACT LEVEL</label>
            <select class="rc-select" v-model="form.high" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.critical, opt)">{{ opt }}</option>
            </select>
            <label class="rc-field-label mt-3">RESPONSE TIME</label>
            <select class="rc-select" v-model="form.high" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.critical, opt)">{{ opt }}</option>
            </select>
          </div>

          <!-- Medium -->
          <div class="rc-sev-card">
            <div class="rc-sev-header">
              <span class="rc-sev-bar rc-bar-medium"></span>
              <span class="rc-sev-name">Medium</span>
            </div>
            <label class="rc-field-label">IMPACT LEVEL</label>
            <select class="rc-select" v-model="form.medium" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.high, opt)">{{ opt }}</option>
            </select>
            <label class="rc-field-label mt-3">RESPONSE TIME</label>
            <select class="rc-select" v-model="form.medium" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.high, opt)">{{ opt }}</option>
            </select>
          </div>

          <!-- Low -->
          <div class="rc-sev-card">
            <div class="rc-sev-header">
              <span class="rc-sev-bar rc-bar-low"></span>
              <span class="rc-sev-name">Low</span>
            </div>
            <label class="rc-field-label">IMPACT LEVEL</label>
            <select class="rc-select" v-model="form.low" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.medium, opt)">{{ opt }}</option>
            </select>
            <label class="rc-field-label mt-3">RESPONSE TIME</label>
            <select class="rc-select" v-model="form.low" :disabled="isLocked">
              <option value="" disabled>Select</option>
              <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.medium, opt)">{{ opt }}</option>
            </select>
          </div>

        </div>

        <!-- RIGHT: Security Level Guide -->
        <div class="rc-guide-card">
          <h5 class="rc-guide-title">Security Level Guide</h5>

          <div class="rc-guide-item">
            <div class="rc-guide-icon rc-icon-critical">
              <i class="bi bi-exclamation-triangle-fill"></i>
            </div>
            <div>
              <p class="rc-guide-name rc-name-critical">Critical Priority</p>
              <p class="rc-guide-desc">Vulnerabilities that present an immediate risk to core infrastructure. Exploitation is usually trivial and requires no user interaction.</p>
            </div>
          </div>

          <div class="rc-guide-item">
            <div class="rc-guide-icon rc-icon-high">
              <i class="bi bi-exclamation-circle-fill"></i>
            </div>
            <div>
              <p class="rc-guide-name rc-name-high">High Priority</p>
              <p class="rc-guide-desc">Significant security risks that could lead to unauthorized access or data loss. Often requires chaining multiple smaller vulnerabilities.</p>
            </div>
          </div>

          <div class="rc-guide-item">
            <div class="rc-guide-icon rc-icon-medium">
              <i class="bi bi-exclamation-triangle"></i>
            </div>
            <div>
              <p class="rc-guide-name rc-name-medium">Medium Priority</p>
              <p class="rc-guide-desc">Issues that are difficult to exploit or have limited impact on overall system integrity but should still be remediated.</p>
            </div>
          </div>

          <div class="rc-guide-item">
            <div class="rc-guide-icon rc-icon-low">
              <i class="bi bi-info-circle-fill"></i>
            </div>
            <div>
              <p class="rc-guide-name rc-name-low">Low Priority</p>
              <p class="rc-guide-desc">Minor issues or best-practice recommendations that don't directly compromise data but improve the overall security posture.</p>
            </div>
          </div>

          <div class="rc-guide-note">
            <p>These criteria will be applied to all automated scans and integrated into your real-time risk dashboard.</p>
          </div>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="rc-footer">
        <button class="rc-btn-back" @click="$router.back()">
          <i class="bi bi-arrow-left me-1"></i> Back to Previous Page
        </button>
        <button class="rc-btn-continue" :disabled="loading" @click="submitRiskCriteria">
          {{ loading ? "Saving..." : (isEditMode ? "Update" : "Continue to Dashboard") }}
          <i v-if="!loading" class="bi bi-arrow-right ms-1"></i>
        </button>
      </div>

    </div>
  </main>
</template>

<script>
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import { Tooltip } from 'bootstrap'

export default {
  name: "RiskCriteriaView",
  components: { DashboardHeader },

  data() {
    return {
      timeOptions: [
        "1 Day",
        "2 Days",
        "3 Days",
        "4 Days",
        "5 Days",
        "6 Days",
        "1 Week",
        "2 Weeks",
        "3 Weeks",
        "4 Weeks",
        "5 Weeks",
      ],
      form: {
        critical: "",
        high: "",
        medium: "",
        low: "",
      },
      loading: false,
      isLocked: false,
    };
  },
  computed: {
    isEditMode() {
      return !!this.$route.query.returnTo;
    }
  },
  methods: {
    convertToDays(value) {
      if (!value) return 0;
      const match = value.match(/^(\d+)/);
      if (!match) return 0;
      const num = parseInt(match[1]);
      return value.includes("Week") ? num * 7 : num;
    },
    isOptionDisabled(selectedValue, optionValue) {
      if (this.isEditMode) return false;
      if (!selectedValue) return false;
      return this.convertToDays(optionValue) < this.convertToDays(selectedValue);
    },
    validateRiskCriteria() {
      if (!this.form.critical || !this.form.high || !this.form.medium || !this.form.low) {
        Swal.fire("Missing Fields", "Please select all risk criteria values.", "warning");
        return false;
      }

      const c = this.convertToDays(this.form.critical);
      const h = this.convertToDays(this.form.high);
      const m = this.convertToDays(this.form.medium);
      const l = this.convertToDays(this.form.low);

      if (c > h || h > m || m > l) {
        Swal.fire(
          "Invalid Order",
          "Critical ≤ High ≤ Medium ≤ Low remediation time must be maintained.",
          "error"
        );
        return false;
      }
      return true;
    },
    async submitRiskCriteria() {
      const auth = useAuthStore();

      // normal locked flow
      if (this.isLocked && !this.isEditMode) {
        auth.markStepCompleted(2);
        this.$router.push("/admindashboardonboarding");
        return;
      }

      if (!this.validateRiskCriteria()) return;

      try {
        this.loading = true;

        // 🔥 EDIT MODE FLOW
        if (this.isEditMode) {

          const res = await auth.updateRiskCriteria(this.form); // PUT API

          if (res.status) {
            await Swal.fire({
              icon: "success",
              title: "Updated!",
              text: res.message,
              timer: 1500,
              showConfirmButton: false,
            });

            // redirect back
            this.$router.push(this.$route.query.returnTo || "/admindashboardonboarding");
          }

          return;
        }

        // 🔥 NORMAL CREATE FLOW
        const res = await auth.addRiskCriteria(this.form);

        if (res.status) {
          auth.markStepCompleted(2);

          await Swal.fire({
            icon: "success",
            title: "Saved!",
            text: res.message,
            timer: 1500,
            showConfirmButton: false,
          });

          this.$router.push("/admindashboardonboarding");
        }

      } catch (err) {
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        this.loading = false;
      }
    },
    async getRiskCriteria() {
      try {
        const auth = useAuthStore();
        let res = await auth.getRiskCriteriaById();

        // Fallback: if no stored ID or fetch failed, fetch by admin
        if (!res.status) {
          res = await auth.getRiskCriteriaByAdmin();
          if (res.status && res.data) {
            const d = res.data?.risk_criteria || res.data;
            if (d._id) {
              localStorage.setItem("riskId", d._id);
              localStorage.setItem("riskCriteriaId", d._id);
            }
            if (d.admin_id) localStorage.setItem("adminId", d.admin_id);
            this.form.critical = d.critical;
            this.form.high = d.high;
            this.form.medium = d.medium;
            this.form.low = d.low;
            this.isLocked = !this.isEditMode;
          }
          return;
        }

        if (res.status) {
          const d = res.data?.risk_criteria || res.data;

          if (!d || (!d.critical && !d.high && !d.medium && !d.low)) return;

          this.form.critical = d.critical;
          this.form.high = d.high;
          this.form.medium = d.medium;
          this.form.low = d.low;

          if (d._id) {
            localStorage.setItem("riskId", d._id);
            localStorage.setItem("riskCriteriaId", d._id);
          }
          if (d.admin_id) localStorage.setItem("adminId", d.admin_id);

          this.isLocked = !this.isEditMode;
        }
      } catch (err) {
        console.error("Risk criteria fetch error", err);
      }
    },
  },
  mounted() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(el => new Tooltip(el))
    this.getRiskCriteria();
  },
};
</script>


<style scoped>
/* ── Base ── */
* { box-sizing: border-box; }
.rc-main { background: #f4f5f8; min-height: 100vh; }

/* ── Page ── */
.rc-page { max-width: 960px; margin: 0 auto; padding: 84px 20px 60px; }

/* ── Stepper ── */
.rc-stepper-row { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 28px; }
.rc-step { display: flex; align-items: center; gap: 8px; }
.rc-step-num {
  width: 32px; height: 32px; border-radius: 50%;
  background: #0f696e; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
}
.rc-step-num-active { background: #241447; color: #fff; }
.rc-step-num-inactive { background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; }
.rc-step-label { font-size: 0.82rem; font-weight: 600; color: #0f696e; }
.rc-step-label-active { color: #241447; }
.rc-step-label-inactive { color: #94a3b8; }
.rc-step-line { flex: 1; height: 2px; background: #e2e8f0; margin: 0 12px; max-width: 120px; }
.rc-line-done { background: #0f696e; }

/* ── Page Header ── */
.rc-page-header { margin-bottom: 28px; }
.rc-title { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin: 0 0 6px; }
.rc-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5; max-width: 480px; }

/* ── Layout ── */
.rc-layout { display: grid; grid-template-columns: 1fr 420px; gap: 24px; align-items: stretch; margin-bottom: 32px; }

/* ── Severity Cards Grid ── */
.rc-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.rc-sev-card {
  background: #fff; border-radius: 14px; padding: 20px;
  border: 1px solid #f1f5f9; box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.rc-sev-header { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.rc-sev-bar { width: 5px; height: 22px; border-radius: 3px; flex-shrink: 0; }
.rc-bar-critical { background: #dc2626; }
.rc-bar-high     { background: #f97316; }
.rc-bar-medium   { background: #f59e0b; }
.rc-bar-low      { background: #0f696e; }
.rc-sev-name { font-size: 1rem; font-weight: 700; color: #1e293b; }

.rc-field-label {
  display: block; font-size: 0.65rem; font-weight: 700;
  color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 6px;
}
.mt-3 { margin-top: 12px; }

.rc-select {
  width: 100%; border: 1px solid #e2e8f0; border-radius: 8px;
  padding: 9px 12px; font-size: 0.875rem; color: #1e293b !important;
  background: #ffffff; outline: none; cursor: pointer;
  appearance: none; font-weight: 600;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
}
.rc-select:focus { border-color: #0f696e; box-shadow: 0 0 0 2px rgba(15,105,110,0.1); }
.rc-select:disabled { opacity: 0.7; cursor: not-allowed; color: #1e293b !important; }
.rc-select option { color: #1e293b; font-weight: 500; background: #ffffff; }

/* ── Guide Card ── */
.rc-guide-card {
  background: #241447; border-radius: 14px; padding: 22px;
  color: #fff; display: flex; flex-direction: column; gap: 16px;
  height: 100%;
}
.rc-guide-title { font-size: 1rem; font-weight: 800; color: #fff; margin: 0 0 4px; }

.rc-guide-item { display: flex; align-items: flex-start; gap: 12px; }
.rc-guide-icon {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center; font-size: 0.9rem;
}
.rc-icon-critical { background: rgba(220,38,38,0.2); color: #fca5a5; }
.rc-icon-high     { background: rgba(249,115,22,0.2); color: #fdba74; }
.rc-icon-medium   { background: rgba(245,158,11,0.2); color: #fcd34d; }
.rc-icon-low      { background: rgba(15,105,110,0.3); color: #a1ecf2; }

.rc-guide-name { font-size: 0.875rem; font-weight: 700; margin: 0 0 3px; }
.rc-name-critical { color: #fca5a5; }
.rc-name-high     { color: #fdba74; }
.rc-name-medium   { color: #fcd34d; }
.rc-name-low      { color: #a1ecf2; }

.rc-guide-desc { font-size: 0.78rem; color: rgba(255,255,255,0.7); margin: 0; line-height: 1.5; }

.rc-guide-note {
  background: rgba(255,255,255,0.08); border-radius: 8px;
  padding: 12px 14px; margin-top: 4px;
}
.rc-guide-note p { font-size: 0.75rem; color: rgba(255,255,255,0.55); margin: 0; font-style: italic; text-align: center; line-height: 1.5; }

/* ── Footer ── */
.rc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 8px; }
.rc-btn-back { background: none; border: none; color: #64748b; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.rc-btn-back:hover { color: #1e293b; }
.rc-btn-continue {
  background: #241447; color: #fff; border: none; border-radius: 8px;
  padding: 10px 28px; font-size: 0.875rem; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px; transition: opacity 0.15s;
}
.rc-btn-continue:hover:not(:disabled) { opacity: 0.88; }
.rc-btn-continue:disabled { opacity: 0.5; cursor: not-allowed; }

.low-text {
  color: #16a34a;
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #241447;
  border-bottom: 1px solid #3a2b5e;
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 1000;
}

.app {
  display: flex;
}

/* ===== CONTENT ===== */
.content {
  margin-left: 260px;
  margin-top: 64px;
  min-height: calc(100vh - 64px);
  padding: 48px 64px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}

.content.no-stepper {
  margin-left: 0;
}


.content h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.content p {
  color: #6b7280;
}

/* ===== RISK GRID ===== */
.risk-card {
  background: #FFFFFF;
  /* border: 1.5px solid #e6e9f2; */
  border-radius: 18px;
  padding: 24px;
  /* box-shadow: 8px 10px 28px rgba(117, 100, 248, 0.35); */
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  margin-bottom: 14px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.critical-bg {
  background: maroon;
}

.high-bg {
  background: red;
}

.medium-bg {
  background: orange;
}

.low-bg {
  background: #22c55e;
}

.risk-desc {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 12px;
}

select.form-select {
  border-radius: 12px;
  padding: 12px;
  /* font-size: 14px; */
}

select.form-select:disabled {
  background-color: white;
}


/* ===== INFO TOOLTIP ===== */
.info-tooltip {
  position: relative;
  display: inline-block;
}

.info-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #5a44ff;
  color: #5a44ff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.tooltip-text {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  bottom: 140%;
  left: 50%;
  transform: translateX(-50%);
  background: #111827;
  color: #ffffff;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  width: 260px;
  z-index: 20;
  transition: opacity 0.2s ease;
}

.tooltip-text::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: #111827 transparent transparent transparent;
}

.info-tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}

/* ===== CTA ===== */
.cta {
  margin-top: auto;
  padding-top: 40px;
  padding-bottom: 24px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


.btn-secondary {
  border-radius: 14px;
  padding: 14px 28px;
  font-weight: 600;
  background: #e5e7eb;
  border: none;
}

.btn-primary {
  background: #5a44ff;
  border: none;
  border-radius: 14px;
  padding: 16px 36px;
  font-weight: 600;
  font-size: 15px;
}

/* ===== Smooth transitions ===== */
.risk-card,
.btn-primary,
.btn-secondary {
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease,
    border-left-color 0.25s ease;
}

.risk-card-bg {
  /* background-color: rgba(117, 100, 248, 0.10); */
  background-color: rgb(236, 235, 235);
}

.security-card-bg {
  background-color: rgba(117, 100, 248, 0.10);
}

/* ===== Risk card hover ===== */
.risk-card:hover {
  transform: translateY(-3px);
}

/* ===== Security card specific hover ===== */
.security-card:hover {
  box-shadow: 0 8px 32px rgba(90, 68, 255, 0.28);
  transform: translateY(-3px);
  border-left-color: #7c3aed;
}

/* ===== Select hover focus polish ===== */
select.form-select {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

select.form-select:focus {
  border-color: #5a44ff;
  box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.15);
}

/* ===== CTA button hover ===== */
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(90, 68, 255, 0.28);
}

/* ===== Secondary button (if used later) ===== */
.btn-secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.12);
}

/* ===== Tooltip micro animation ===== */
.tooltip-text {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.info-tooltip:hover .tooltip-text {
  transform: translateX(-50%) translateY(-4px);
}

.security-card p {
  line-height: 1.3;
  color: #374151;
  font-size: 13px;
}

/* ===== SECURITY CARD HEADER ===== */
.security-header-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
}

.security-icon {
  font-size: 20px;
  color: #5a44ff;
}

.security-heading {
  font-weight: 700;
  font-size: 18px;
  color: #5a44ff;
  margin: 0;
  text-align: center;
}

/* Mobile - Small screens */
@media (max-width: 576px) {
  .content {
    margin-left: 0;
    margin-top: 180px;
    padding: 20px;
  }

  .risk-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .risk-left {
    grid-template-columns: 1fr;
  }

  .cta {
    justify-content: center;
    padding-top: 32px;
  }

  .btn-primary {
    width: 100%;
  }
}

/* Tablets - Portrait / iPad Mini */
@media (min-width: 577px) and (max-width: 768px) {
  .content {
    margin-left: 0;
    margin-top: 180px;
    padding: 24px 32px;
  }

  .risk-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .risk-left {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .cta {
    padding-top: 36px;
  }
}

/* Tablets - Landscape / iPad Air */
@media (min-width: 769px) and (max-width: 992px) {
  .content {
    margin-left: 0;
    margin-top: 180px;
    padding: 32px 48px;
  }

  .risk-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .risk-left {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta {
    padding-top: 40px;
  }
}

/* Small Laptops / iPad Pro */
@media (min-width: 993px) and (max-width: 1200px) {
  .content {
    margin-left: 0;
    margin-top: 180px;
    padding: 40px 56px;
  }

  .risk-layout {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .cta {
    padding-top: 44px;
  }
}

/* Standard Laptops */
@media (min-width: 1201px) and (max-width: 1366px) {
  .content {
    padding: 40px 56px;
  }

  .risk-layout {
    gap: 24px;
  }
}

/* Large Laptops / Desktops */
@media (min-width: 1367px) and (max-width: 1600px) {
  .content {
    padding: 48px 64px;
  }

  .risk-layout {
    gap: 28px;
  }
}

/* Full HD / Large Desktops (1920x1080) */
@media (min-width: 1601px) and (max-width: 1920px) {
  .content {
    padding: 56px 80px;
    max-width: 1600px;
    /* margin-left: auto; */
    margin-right: auto;
  }

  .risk-layout {
    gap: 32px;
  }

  .security-card p {
    font-size: 14px;
  }
}

/* Ultra-Wide / 4K */
@media (min-width: 1921px) {
  .content {
    padding: 64px 100px;
    max-width: 1800px;
    margin-left: auto;
    margin-right: auto;
  }

  .risk-layout {
    gap: 36px;
  }

  .security-card p {
    font-size: 15px;
    line-height: 1.5;
  }

  .security-heading {
    font-size: 20px;
  }
}
</style>
