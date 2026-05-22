<template>
  <div class="toolbox-page">
    <header class="toolbox-page-hero">
      <span class="toolbox-hero-kicker">Centralized Repository</span>
      <h1 class="toolbox-hero-title">Security Toolbox</h1>
      <p class="toolbox-hero-desc">
        A high-fidelity central library for vulnerability remediation and deployment scripts.
        Access audited fixes, dependency checks, and multi-OS installation protocols.
      </p>
    </header>

    <div class="toolbox-bento">
      <ToolboxFixCard
        v-for="fix in fixes"
        :key="fix.id"
        :fix="fix"
      />

      <div class="tb-promo-card">
        <div class="tb-promo-overlay" aria-hidden="true"></div>
        <div class="tb-promo-content">
          <h3 class="tb-promo-title">Automate Your Fleet</h3>
          <p class="tb-promo-desc">
            Deploy these fixes across thousands of nodes with VaptFix Enterprise Orchestration.
          </p>
          <button type="button" class="tb-promo-btn">Get Early Access</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ToolboxFixCard from '@/components/toolbox/ToolboxFixCard.vue';
import { TOOLBOX_FIXES } from '@/data/toolboxLibrary';

export default {
  name: 'ToolboxPageContent',
  components: { ToolboxFixCard },
  data() {
    return {
      fixes: TOOLBOX_FIXES,
    };
  },
};
</script>

<style scoped>
.toolbox-page {
  padding: 8px 0 48px;
}

.toolbox-page-hero {
  max-width: 52rem;
  margin-top: 28px;
  margin-bottom: 36px;
}

.toolbox-hero-kicker {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0f696e;
  margin-bottom: 8px;
}

.toolbox-hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  color: #241447;
  margin: 0 0 14px;
  line-height: 1.15;
}

.toolbox-hero-desc {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.65;
  color: #49454f;
  opacity: 0.85;
}

.toolbox-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
}

@media (min-width: 1200px) {
  .toolbox-bento {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tb-promo-card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: #241447;
  padding: 32px;
  min-height: 350px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.tb-promo-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(15, 105, 110, 0.45), transparent 55%),
    radial-gradient(circle at 80% 70%, rgba(209, 189, 251, 0.25), transparent 50%),
    linear-gradient(135deg, #241447 0%, #3a2a5e 100%);
  opacity: 0.95;
}

.tb-promo-content {
  position: relative;
  z-index: 1;
}

.tb-promo-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 10px;
}

.tb-promo-desc {
  margin: 0 0 22px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.72);
  max-width: 20rem;
  line-height: 1.5;
}

.tb-promo-btn {
  border: none;
  background: #0f696e;
  color: #fff;
  font-weight: 800;
  font-size: 0.88rem;
  padding: 12px 24px;
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.tb-promo-btn:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}
</style>
