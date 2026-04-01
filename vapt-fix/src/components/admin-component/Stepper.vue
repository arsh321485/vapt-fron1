<!-- <template>
  <div class="step-rail">
   
    <div
      class="step"
      :class="{ active: isActive('/communication') }"
      @click="go('/communication')"
    >
      <div class="step-circle">1</div>
      <div class="step-label">
        Add location<br />and users
      </div>
      <div
        class="step-line"
        :class="{ active: isLineActive(2) }"
      ></div>
    </div>


    <div
      class="step"
      :class="{ active: isActive('/riskcriteria') }"
      @click="go('/riskcriteria')"
    >
      <div class="step-circle">2</div>
      <div class="step-label">
        Risk<br />Criteria
      </div>
      <div
        class="step-line"
        :class="{ active: isLineActive(3) }"
      ></div>
    </div>

    <div
      class="step"
      :class="{ active: isActive('/uploadreport') }"
      @click="go('/uploadreport')"
    >
      <div class="step-circle">3</div>
      <div class="step-label">
        Vulnerability<br />Report
      </div>
    </div>
  </div>
</template> -->

<template>
  <div class="step-rail">

    <!-- STEP 1 -->
    <div
      class="step"
      :class="{
        active: isActive('/communication'),
        completed: isCompleted(1),
        disabled: !canNavigate(1)
      }"
      @click="handleStepClick('/communication', 1)"
    >
      <div class="step-circle">1</div>
      <div class="step-label">Add<br />users</div>
      <div class="step-line" :class="{ active: isLineActive(2), completed: isLineCompleted(1) }"></div>
    </div>

    <!-- STEP 2 -->
    <div
      class="step"
      :class="{
        active: isActive('/riskcriteria'),
        completed: isCompleted(2),
        disabled: !canNavigate(2)
      }"
      @click="handleStepClick('/riskcriteria', 2)"
    >
      <div class="step-circle">2</div>
      <div class="step-label">Risk<br />Criteria</div>
    </div>

  </div>
</template>


<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "Stepper",

  data() {
    return {
      authStore: null
    };
  },

  computed: {
    currentStep() {
      const map = {
        "/communication": 1,
        "/riskcriteria": 2,
      };
      return map[this.$route.path] || 1;
    }
  },

  mounted() {
    this.authStore = useAuthStore();
  },
  methods: {
     handleStepClick(path, step) {
      if (!this.canNavigate(step)) return;

      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },

    canNavigate(targetStep) {
      const current = this.currentStep;

      // SAME STEP → allow (no-op)
      if (targetStep === current) return true;

      // BACKWARD only by 1 step
      if (targetStep === current - 1) return true;

      // everything else blocked
      return false;
    },

    isActive(path) {
      return this.$route.path === path;
    },

    isLineActive(stepNumber) {
      if (stepNumber === 2) {
        return this.currentStep >= 2;
      }
      if (stepNumber === 3) {
        return this.currentStep >= 3;
      }
      return false;
    },

    isCompleted(step) {
      if (!this.authStore) return false;
      // A step is completed if it's in the completedSteps array
      // OR if it's the current active step (always show blue for current)
      return this.authStore.completedSteps.includes(step) || this.currentStep === step;
    },

    isLineCompleted(step) {
      if (!this.authStore) return false;
      // Line is completed if the current step is completed
      return this.authStore.completedSteps.includes(step);
    }

    // go(path) {
    //   if (this.$route.path !== path) {
    //     this.$router.push(path);
    //   }
    // },

    // isActive(path) {
    //   return this.$route.path === path;
    // },

    // isLineActive(stepNumber) {
    //   if (stepNumber === 2) {
    //     return (
    //       this.$route.path === "/riskcriteria" ||
    //       this.$route.path === "/uploadreport"
    //     );
    //   }

    //   if (stepNumber === 3) {
    //     return this.$route.path === "/uploadreport";
    //   }

    //   return false;
    // },
  },
};
</script>


<style scoped>
  .step.disabled {
  pointer-events: none;
  /* opacity: 0.45; */
  cursor: not-allowed;
}

  .step {
  cursor: pointer;
}

/* Optional hover polish */
.step:hover .step-circle {
  transform: scale(1.05);
}

  .step-rail {
  position: fixed;
  top: 64px;              
  left: 0;
  width: 260px;
  height: calc(100vh - 64px);
  background: #E9EDF5;
  border-right: 1px solid #e6e9f2;
  padding: 40px 24px;
  overflow-y: hidden;
  overflow: hidden;
}
.step-rail {
  scrollbar-width: none;        /* Firefox */
}

.step-rail::-webkit-scrollbar {
  display: none;               /* Chrome, Edge, Safari */
}

.step {
  text-align: center;
  margin-bottom: 42px;
}

.step-circle {
  width: 34px;
  height: 34px;
  margin: 0 auto;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: box-shadow 0.25s ease;
}

.step.active .step-circle,
.step.completed .step-circle {
  background: #5a44ff;
  color: #fff;
  box-shadow: 0 6px 14px rgba(90, 68, 255, 0.35);
}

.step-label {
  margin-top: 10px;
  font-size: 14px;
  color: #9ca3af;
  line-height: 1.4;
}

.step.active .step-label,
.step.completed .step-label {
  color: #0f172a;
  font-weight: 500;
}

.step-line {
  width: 2px;
  height: 36px;
  margin: 10px auto 0;
  border-left: 2px dashed #d1d5db;
}

.step-line.active,
.step-line.completed {
  border-left-color: #5a44ff;
}

@media (max-width: 992px) {
  .step-rail {
    display: flex;
    justify-content: center;
    gap: 150px;
    border-right: none;
    border-bottom: 1px solid #e6e9f2;
    width: 100%;
    height: auto;
  }
  .step-rail {
    top: 55px;              
    height: 150px;
  }
  .step-line {
    display: none;
  }
}

/* iPad Pro */
@media (max-width: 1200px) {
  .step-rail {
    display: flex;
    justify-content: center;
    gap: 150px;
    border-right: none;
    border-bottom: 1px solid #e6e9f2;
    width: 100%;
    height: auto;
  }
  .step-rail {
    top: 55px;              
    height: 150px;
  }
  .step-line {
    display: none;
  }
}
</style>