<template>
  <component
    :is="tag"
    class="truncated-vuln-name"
    @mouseenter="showTip"
    @mouseleave="hideTip"
  >
    {{ text }}
    <Teleport to="body">
      <div
        v-if="open && text"
        class="truncated-vuln-tip"
        :style="tipStyle"
        role="tooltip"
      >{{ text }}</div>
    </Teleport>
  </component>
</template>

<script>
export default {
  name: 'TruncatedVulnName',
  inheritAttrs: true,
  props: {
    text: { type: String, default: '' },
    tag: { type: String, default: 'span' },
  },
  data() {
    return {
      open: false,
      tipStyle: {},
    };
  },
  watch: {
    text() {
      this.hideTip();
    },
  },
  mounted() {
    window.addEventListener('scroll', this.hideTip, true);
    window.addEventListener('resize', this.hideTip);
    document.addEventListener('keydown', this.hideTip);
  },
  beforeUnmount() {
    this.hideTip();
    window.removeEventListener('scroll', this.hideTip, true);
    window.removeEventListener('resize', this.hideTip);
    document.removeEventListener('keydown', this.hideTip);
  },
  methods: {
    showTip(e) {
      const el = e.currentTarget;
      if (!this.text) return;
      const rect = el.getBoundingClientRect();
      const maxW = Math.min(480, window.innerWidth - 24);
      let left = rect.left;
      if (left + maxW > window.innerWidth - 12) {
        left = Math.max(12, window.innerWidth - maxW - 12);
      }
      const above = rect.top > 72;
      this.tipStyle = {
        left: `${left}px`,
        top: above ? `${rect.top - 8}px` : `${rect.bottom + 8}px`,
        transform: above ? 'translateY(-100%)' : 'none',
        maxWidth: `${maxW}px`,
      };
      this.open = true;
    },
    hideTip() {
      this.open = false;
    },
  },
};
</script>

<style>
.truncated-vuln-name {
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: default;
}
.truncated-vuln-tip {
  position: fixed;
  z-index: 20000;
  padding: 8px 10px;
  border-radius: 8px;
  background: #0f172a;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.45;
  white-space: normal;
  word-break: break-word;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.28);
  pointer-events: none;
}
</style>
