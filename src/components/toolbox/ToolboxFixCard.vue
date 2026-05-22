<template>
  <article class="tb-fix-card">
    <div class="tb-fix-card-top">
      <div class="tb-fix-card-titles">
        <h3 class="tb-fix-card-title">{{ fix.title }}</h3>
        <div class="tb-fix-tags">
          <span
            v-for="tag in fix.tags"
            :key="tag.label"
            class="tb-fix-tag"
            :class="'tb-fix-tag--' + tag.tone"
          >
            {{ tag.label }}
          </span>
        </div>
      </div>
      <i class="bi tb-fix-card-icon" :class="fix.icon" aria-hidden="true"></i>
    </div>

    <div class="tb-fix-grid">
      <div class="tb-libs-panel">
        <div class="tb-panel-label">Libraries Required</div>
        <ul class="tb-libs-list">
          <li v-for="lib in fix.libraries" :key="lib">{{ lib }}</li>
        </ul>
      </div>
      <div class="tb-snippet-wrap">
        <div class="tb-snippet-panel">
          <span class="tb-snippet-lang">{{ fix.snippetLang }}</span>
          <code class="tb-snippet-code">{{ fix.snippet }}</code>
          <button type="button" class="tb-copy-btn" @click="copySnippet">
            <i class="bi bi-copy" aria-hidden="true"></i>
            {{ copied ? 'Copied!' : 'Copy Snippet' }}
          </button>
        </div>
      </div>
    </div>

    <div class="tb-os-block">
      <div class="tb-os-tabs">
        <button
          v-for="osId in fix.osTabs"
          :key="osId"
          type="button"
          class="tb-os-tab"
          :class="{ active: activeOs === osId }"
          @click="activeOs = osId"
        >
          {{ osLabels[osId] || osId.toUpperCase() }}
        </button>
      </div>
      <div class="tb-os-steps">
        <ol>
          <li v-for="(step, idx) in activeSteps" :key="activeOs + '-' + idx">{{ step }}</li>
        </ol>
      </div>
    </div>

    <div class="tb-consider-block">
      <i class="bi tb-consider-icon" :class="fix.considerationIcon" aria-hidden="true"></i>
      <div>
        <div class="tb-consider-title">Important Considerations</div>
        <p class="tb-consider-text">{{ fix.consideration }}</p>
      </div>
    </div>

    <p class="tb-card-disclaimer">{{ disclaimer }}</p>
  </article>
</template>

<script>
import { TOOLBOX_DISCLAIMER, TOOLBOX_OS_TAB_LABELS } from '@/data/toolboxLibrary';

export default {
  name: 'ToolboxFixCard',
  props: {
    fix: { type: Object, required: true },
  },
  data() {
    return {
      activeOs: this.fix?.osTabs?.[0] || 'linux',
      copied: false,
      disclaimer: TOOLBOX_DISCLAIMER,
      osLabels: TOOLBOX_OS_TAB_LABELS,
    };
  },
  computed: {
    activeSteps() {
      return this.fix?.osSteps?.[this.activeOs] || [];
    },
  },
  watch: {
    fix: {
      immediate: true,
      handler(f) {
        if (f?.osTabs?.length) this.activeOs = f.osTabs[0];
      },
    },
  },
  methods: {
    async copySnippet() {
      try {
        await navigator.clipboard.writeText(this.fix.snippet);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      } catch {
        /* ignore */
      }
    },
  },
};
</script>

<style scoped>
.tb-fix-card {
  background: #f2f3f6;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  border: 1px solid transparent;
  transition: box-shadow 0.25s ease, border-color 0.25s ease;
}

.tb-fix-card:hover {
  box-shadow: 0 8px 28px rgba(36, 20, 71, 0.12);
  border-color: rgba(203, 196, 208, 0.35);
}

.tb-fix-card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.tb-fix-card-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 8px;
  line-height: 1.25;
  transition: color 0.2s;
}

.tb-fix-card:hover .tb-fix-card-title {
  color: #0f696e;
}

.tb-fix-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tb-fix-tag {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
}

.tb-fix-tag--error {
  background: #ffdad6;
  color: #93000a;
}

.tb-fix-tag--secondary {
  background: #a1ecf2;
  color: #176d72;
}

.tb-fix-tag--neutral {
  background: #e3e2e2;
  color: #1b1c1c;
}

.tb-fix-card-icon {
  font-size: 1.75rem;
  color: #d1bdfb;
  flex-shrink: 0;
}

.tb-fix-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

@media (min-width: 768px) {
  .tb-fix-grid {
    grid-template-columns: 1fr 2fr;
  }
}

.tb-libs-panel,
.tb-snippet-panel {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
}

.tb-panel-label {
  font-size: 0.62rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #cbc4d0;
  margin-bottom: 10px;
}

.tb-libs-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.85rem;
  font-weight: 500;
  color: #191c1e;
}

.tb-libs-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.tb-libs-list li::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0f696e;
  flex-shrink: 0;
}

.tb-snippet-panel {
  background: #1e1f1f;
  color: #e3e2e2;
  position: relative;
}

.tb-snippet-lang {
  position: absolute;
  top: 10px;
  right: 12px;
  font-size: 0.62rem;
  font-weight: 700;
  color: #9d9c9c;
  letter-spacing: 0.06em;
}

.tb-snippet-code {
  display: block;
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.72rem;
  line-height: 1.65;
  margin: 0 0 12px;
  padding-right: 48px;
  word-break: break-all;
  white-space: pre-wrap;
}

.tb-copy-btn {
  border: none;
  background: transparent;
  color: #88d3d8;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tb-copy-btn:hover {
  text-decoration: underline;
}

.tb-os-block {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.tb-os-tabs {
  display: flex;
  border-bottom: 1px solid #e7e8eb;
}

.tb-os-tab {
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 8px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #49454f;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tb-os-tab:hover:not(.active) {
  background: #f2f3f6;
}

.tb-os-tab.active {
  background: #241447;
  color: #fff;
}

.tb-os-steps {
  padding: 16px;
  font-size: 0.82rem;
  color: #49454f;
  min-height: 100px;
}

.tb-os-steps ol {
  margin: 0;
  padding-left: 1.2rem;
}

.tb-os-steps li {
  margin-bottom: 8px;
  line-height: 1.55;
}

.tb-consider-block {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: #edeef1;
  border-left: 4px solid #0f696e;
  border-radius: 12px;
  padding: 16px;
}

.tb-consider-icon {
  font-size: 1.1rem;
  color: #0f696e;
  flex-shrink: 0;
  margin-top: 2px;
}

.tb-consider-title {
  font-size: 0.68rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #241447;
  margin-bottom: 4px;
}

.tb-consider-text {
  margin: 0;
  font-size: 0.82rem;
  color: #49454f;
  line-height: 1.55;
  opacity: 0.9;
}

.tb-card-disclaimer {
  margin: 0;
  font-size: 0.62rem;
  font-style: italic;
  color: #7a7580;
  text-align: center;
}
</style>
