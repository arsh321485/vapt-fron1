<template>
  <main>
    <!-- TOP BAR -->
    <div class="topbar">
      <img src="@/assets/images/logo-capital.png" alt="" class="h-50">
    </div>

    <div class="app">
      <!-- STEPPER -->
      <Stepper v-if="!isEditMode" />

      <!-- CONTENT -->
      <div :class="['content', { 'no-stepper': isEditMode }]">
        <h1>Risk Criteria</h1>
        <p>Define the governance framework for timely vulnerability mitigation and risk reduction.</p>

        <div class="risk-layout">
          <div class="risk-left">
            <div class="risk-card area-critical risk-card-bg">
              <div class="risk-header">
                <span class="dot critical-bg"></span>
                Critical
                <!-- <span class="text-danger">*</span> -->

                <span class="text-danger ms-1" data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Recommended timeline: Critical – 2 days">
                  *
                </span>

              </div>

              <select class="form-select" v-model="form.critical" :disabled="isLocked">
                <option value="" disabled>Select</option>
                <option v-for="opt in timeOptions" :key="opt">{{ opt }}</option>
              </select>

            </div>
            <div class="risk-card area-high risk-card-bg">
              <div class="risk-header">
                <span class="dot high-bg"></span>

                <!-- High<span class="text-danger">*</span> -->
                High
                <span class="text-danger ms-1" data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Recommended timeline: High – 4 days">
                  *
                </span>

              </div>



              <select class="form-select" v-model="form.high" :disabled="isLocked">
                <option value="" disabled>Select</option>

                <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.critical, opt)">
                  {{ opt }}
                </option>
              </select>

            </div>
            <div class="risk-card area-medium risk-card-bg">
              <div class="risk-header">
                <span class="dot medium-bg"></span>
                <!-- Medium<span class="text-danger">*</span> -->
                Medium
                <span class="text-danger ms-1" data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Recommended timeline: Medium – 2 weeks">
                  *
                </span>

              </div>


              <select class="form-select" v-model="form.medium" :disabled="isLocked">
                <option value="" disabled>Select</option>

                <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.high, opt)">
                  {{ opt }}
                </option>
              </select>

            </div>
            <div class="risk-card area-low risk-card-bg">
              <div class="risk-header">
                <span class="dot low-bg"></span>
                <!-- Low<span class="text-danger">*</span> -->
                Low
                <span class="text-danger ms-1" data-bs-toggle="tooltip" data-bs-placement="top"
                  title="Recommended timeline: Low – 4 weeks">
                  *
                </span>

              </div>

              <select class="form-select" v-model="form.low" :disabled="isLocked">
                <option value="" disabled>Select</option>
                <option v-for="opt in timeOptions" :key="opt" :disabled="isOptionDisabled(form.medium, opt)">
                  {{ opt }}
                </option>
              </select>

            </div>
          </div>

          <!-- security level -->
          <div class="risk-card security-card area-security security-card-bg">
            <div class="security-header-wrapper">
              <i class="bi bi-shield-check security-icon"></i>
              <h5 class="security-heading">Security Level</h5>
            </div>

            <div class="security-grid">

              <div class="security-item">
                <div class="security-title critical">
                  <span class="dot"></span>
                  <strong class="critical-text">Critical</strong>
                </div>
                <p>
                  Assets essential for the organisation to operate; their loss can cause
                  severe operational, legal, or financial damage.
                </p>
              </div>

              <div class="security-item">
                <div class="security-title high">
                  <span class="dot"></span>
                  <strong class="high-text">High</strong>
                </div>
                <p>
                  Important assets whose compromise would significantly disrupt operations
                  or result in financial loss.
                </p>
              </div>

              <div class="security-item">
                <div class="security-title medium">
                  <span class="dot"></span>
                  <strong class="medium-text">Medium</strong>
                </div>
                <p>
                  Assets with moderate importance that may cause inconvenience or delays if
                  lost or exposed.
                </p>
              </div>

              <div class="security-item">
                <div class="security-title low">
                  <span class="dot"></span>
                  <strong class="low-text">Low</strong>
                </div>
                <p>
                  Assets whose loss or exposure has little to no impact on business
                  operations.
                </p>
              </div>

            </div>
          </div>
        </div>

        <div class="cta">
          <button class="btn btn-primary" :disabled="loading" @click="submitRiskCriteria">
            {{ loading ? "Saving..." : (isEditMode ? "Back to Previous Page →" : "Continue to Dashboard →") }}
          </button>
        </div>

      </div>

    </div>
  </main>
</template>

<script>
import Stepper from '@/components/admin-component/Stepper.vue';
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import { Tooltip } from 'bootstrap'

export default {
  name: "RiskCriteriaView",
  components: { Stepper },

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
.security-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.security-title .dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

/* COLORS – SAME AS LEFT */
.security-title.critical .dot {
  background: maroon;
  /* maroon */
}

.security-title.high .dot {
  background: red;
  /* red/orange */
}

.security-title.medium .dot {
  background: orange;
  /* yellow */
}

.security-title.low .dot {
  background: #22c55e;
  /* green */
}

.security-item p {
  margin-bottom: 0;
  font-size: 13px;
  line-height: 1.45;
  color: #374151;
}

/* MAIN LAYOUT */
.risk-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
}


/* LEFT SIDE: keeps your old grid */
.risk-left {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

/* RIGHT SIDE */
.risk-right {
  display: flex;
}

/* Security card fills empty vertical space */
.security-card {
  width: 100%;
  box-shadow: 0 4px 20px rgba(90, 68, 255, 0.18);
  border-left: 4px solid #5a44ff;
  background: linear-gradient(135deg, rgba(117, 100, 248, 0.12) 0%, rgba(117, 100, 248, 0.08) 100%);
  position: relative;
  overflow: hidden;
}

.security-card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(90, 68, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(30%, -30%);
  pointer-events: none;
}

.security-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px 18px;
}

/* Each block aligns like left risk cards */
.security-item {
  font-size: 13px;
  line-height: 1.5;
  color: #374151;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.security-item:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateX(4px);
}

/* .security-item p {
  margin-bottom: 0;
  font-size: 15px;
} */


.security-item strong {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  font-weight: 600;
}

/* Text colors */
.critical-text {
  /* color: #dc2626; */
  color: maroon;
}

.high-text {
  color: red;
}

.medium-text {
  color: orange;
}

.low-text {
  color: #16a34a;
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #F3F5FA;
  border-bottom: 1px solid #e6e9f2;
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