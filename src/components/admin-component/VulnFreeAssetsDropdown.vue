<template>
  <div class="vfa-wrap">
    <button
      type="button"
      class="vfa-toggle"
      :disabled="!assets.length"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="vfa-title">
        <i class="bi bi-shield-check"></i>
        <span>Vulnerability-Free Assets</span>
      </span>
      <span class="vfa-right">
        <span class="vfa-count">{{ assets.length }}</span>
        <i v-if="assets.length" class="bi" :class="open ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
      </span>
    </button>
    <p v-if="!assets.length" class="vfa-empty">
      {{ loading ? 'Loading…' : 'Every asset has at least one vulnerability for the selected team(s).' }}
    </p>
    <ul v-else-if="open" class="vfa-list">
      <li v-for="asset in assets" :key="asset.host_name" class="vfa-item">
        <span class="vfa-host" :title="asset.host_name">{{ asset.host_name }}</span>
        <span class="vfa-os">{{ asset.os || '—' }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// Read-only list of assets that have no vulnerabilities for the selected
// team role (vulnerability_free_assets from report-assets-vulns) — nothing
// in them to assign, so they're shown separately from the assignment tree.
export default {
  name: "VulnFreeAssetsDropdown",
  props: {
    assets: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  data() {
    return { open: false };
  },
};
</script>

<style scoped>
.vfa-wrap {
  width: 100%;
  margin-top: 8px;
  background: #f8fafc;
  border: 1px solid #e8ecf2;
  border-radius: 10px;
  overflow: hidden;
}
.vfa-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
}
.vfa-toggle:disabled {
  cursor: default;
}
.vfa-empty {
  margin: 0;
  padding: 0 14px 10px;
  font-size: 0.75rem;
  color: #64748b;
}
.vfa-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0f696e;
  font-size: 0.78rem;
  font-weight: 700;
  min-width: 0;
}
.vfa-title span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vfa-right {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: #475569;
}
.vfa-count {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 2px 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
}
.vfa-list {
  list-style: none;
  margin: 0;
  padding: 0 14px 10px;
  max-height: 180px;
  overflow-y: auto;
}
.vfa-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 10px;
  margin-top: 6px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 8px;
  font-size: 0.8rem;
}
.vfa-host {
  color: #1e293b;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.vfa-os {
  color: #64748b;
  flex-shrink: 0;
}
</style>
