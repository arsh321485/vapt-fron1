<template>
  <teleport to="body">
    <transition name="ra-drawer">
      <div v-if="show" class="ra-overlay" @click.self="handleClose">
        <aside class="ra-panel" role="dialog" aria-modal="true" aria-labelledby="ra-assign-title">
          <div class="ra-header">
            <div>
              <p class="ra-eyebrow">Assign for role</p>
              <h2 id="ra-assign-title" class="ra-title">{{ activeRoleLabel }}</h2>
              <p class="ra-subtitle">Select assets and vulnerabilities to assign to this team member.</p>
            </div>
            <button type="button" class="ra-close" aria-label="Close" @click="handleClose">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <div v-if="selectedRoles.length > 1" class="ra-role-tabs">
            <button
              v-for="roleShort in selectedRoles"
              :key="roleShort"
              type="button"
              class="ra-role-tab"
              :class="{ 'is-active': activeRole === roleShort }"
              @click="switchRole(roleShort)"
            >
              {{ roleOptions.find((o) => o.short === roleShort)?.full || roleShort }}
            </button>
          </div>

          <div class="ra-search-wrap">
            <i class="bi bi-search ra-search-icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              class="ra-search"
              placeholder="Search assets or vulnerabilities..."
            />
            <button v-if="searchQuery" type="button" class="ra-search-clear" @click="searchQuery = ''">
              <i class="bi bi-x-circle-fill"></i>
            </button>
          </div>

          <div class="ra-body">
            <!-- Loading spinner while catalog is being fetched from API -->
            <div v-if="catalogLoading" class="ra-catalog-loading">
              <span class="spinner-border spinner-border-sm text-secondary me-2"></span>
              <span>Loading assets & vulnerabilities...</span>
            </div>

            <template v-else>
            <section class="ra-section">
              <div class="ra-section-head">
                <div class="ra-section-title-wrap">
                  <i class="bi bi-hdd-network ra-section-icon"></i>
                  <h3 class="ra-section-title">Assets</h3>
                </div>
                <div class="ra-section-head-right">
                  <label class="ra-select-all">
                    <input
                      type="checkbox"
                      :checked="allAssetsSelected"
                      :indeterminate.prop="someAssetsSelected"
                      @change="toggleAllAssets"
                    />
                    <span>All</span>
                  </label>
                  <span class="ra-section-count">{{ filteredAssets.length }} items</span>
                </div>
              </div>
              <div v-if="filteredAssets.length" class="ra-list">
                <label v-for="asset in filteredAssets" :key="asset.id" class="ra-item">
                  <input
                    type="checkbox"
                    :value="asset.id"
                    v-model="roleAssignments[activeRole].assets"
                  />
                  <div class="ra-item-content">
                    <span class="ra-item-name">{{ asset.name }}</span>
                    <span class="ra-item-meta">{{ asset.os }}</span>
                  </div>
                  <span
                    v-if="asset.severity"
                    class="ra-sev"
                    :class="'ra-sev-' + asset.severity.toLowerCase()"
                  >
                    {{ asset.severity }}
                  </span>
                </label>
              </div>
              <p v-else class="ra-empty">No assets found for this role.</p>
            </section>

            <section class="ra-section">
              <div class="ra-section-head">
                <div class="ra-section-title-wrap">
                  <i class="bi bi-shield-exclamation ra-section-icon"></i>
                  <h3 class="ra-section-title">Vulnerabilities</h3>
                </div>
                <div class="ra-section-head-right">
                  <label class="ra-select-all">
                    <input
                      type="checkbox"
                      :checked="allVulnsSelected"
                      :indeterminate.prop="someVulnsSelected"
                      @change="toggleAllVulns"
                    />
                    <span>All</span>
                  </label>
                  <span class="ra-section-count">{{ filteredVulns.length }} items</span>
                </div>
              </div>
              <div v-if="filteredVulns.length" class="ra-list">
                <label v-for="vuln in filteredVulns" :key="vuln.id" class="ra-item">
                  <input
                    type="checkbox"
                    :value="vuln.id"
                    v-model="roleAssignments[activeRole].vulnerabilities"
                  />
                  <div class="ra-item-content">
                    <span class="ra-item-name">{{ vuln.name }}</span>
                    <span class="ra-item-meta">{{ vuln.asset }}</span>
                  </div>
                  <span class="ra-sev" :class="'ra-sev-' + vuln.severity.toLowerCase()">
                    {{ vuln.severity }}
                  </span>
                </label>
              </div>
              <p v-else class="ra-empty">No vulnerabilities found for this role.</p>
            </section>
            </template>
          </div>

          <div class="ra-footer">
            <div class="ra-footer-summary">
              <span><strong>{{ currentAssetCount }}</strong> assets</span>
              <span class="ra-footer-dot"></span>
              <span><strong>{{ currentVulnCount }}</strong> vulnerabilities</span>
            </div>
            <div class="ra-footer-actions">
              <button type="button" class="ra-btn-secondary" @click="handleClose">Cancel</button>
              <button type="button" class="ra-btn-primary" @click="handleApply">
                <i class="bi bi-check2 me-1"></i> Apply Selection
              </button>
            </div>
          </div>
        </aside>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: "RoleAssignmentDrawer",
  props: {
    show: { type: Boolean, default: false },
    activeRole: { type: String, default: null },
    selectedRoles: { type: Array, default: () => [] },
    roleOptions: { type: Array, default: () => [] },
    roleAssignments: { type: Object, required: true },
    catalog: { type: Object, required: true },
    catalogLoading: { type: Boolean, default: false },
  },
  emits: ["update:show", "update:activeRole", "close", "apply"],
  data() {
    return {
      searchQuery: "",
    };
  },
  computed: {
    activeRoleLabel() {
      if (!this.activeRole) return "";
      return this.roleOptions.find((o) => o.short === this.activeRole)?.full || this.activeRole;
    },
    filteredAssets() {
      const list = this.catalog[this.activeRole]?.assets || [];
      const q = (this.searchQuery || "").trim().toLowerCase();
      if (!q) return list;
      return list.filter((asset) =>
        [asset.name, asset.os, asset.severity].some((field) =>
          String(field || "").toLowerCase().includes(q),
        ),
      );
    },
    filteredVulns() {
      const list = this.catalog[this.activeRole]?.vulnerabilities || [];
      const q = (this.searchQuery || "").trim().toLowerCase();
      if (!q) return list;
      return list.filter((vuln) =>
        [vuln.name, vuln.asset, vuln.severity].some((field) =>
          String(field || "").toLowerCase().includes(q),
        ),
      );
    },
    currentAssetCount() {
      if (!this.activeRole) return 0;
      return this.roleAssignments[this.activeRole]?.assets?.length || 0;
    },
    currentVulnCount() {
      if (!this.activeRole) return 0;
      return this.roleAssignments[this.activeRole]?.vulnerabilities?.length || 0;
    },
    allAssetsSelected() {
      if (!this.activeRole || !this.filteredAssets.length) return false;
      const selected = this.roleAssignments[this.activeRole]?.assets || [];
      return this.filteredAssets.every(a => selected.includes(a.id));
    },
    someAssetsSelected() {
      if (!this.activeRole) return false;
      const selected = this.roleAssignments[this.activeRole]?.assets || [];
      return this.filteredAssets.some(a => selected.includes(a.id)) && !this.allAssetsSelected;
    },
    allVulnsSelected() {
      if (!this.activeRole || !this.filteredVulns.length) return false;
      const selected = this.roleAssignments[this.activeRole]?.vulnerabilities || [];
      return this.filteredVulns.every(v => selected.includes(v.id));
    },
    someVulnsSelected() {
      if (!this.activeRole) return false;
      const selected = this.roleAssignments[this.activeRole]?.vulnerabilities || [];
      return this.filteredVulns.some(v => selected.includes(v.id)) && !this.allVulnsSelected;
    },
  },
  watch: {
    show(value) {
      if (value) {
        this.searchQuery = "";
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    },
  },
  beforeUnmount() {
    if (this.show) {
      document.body.style.overflow = "";
    }
  },
  methods: {
    switchRole(roleShort) {
      this.searchQuery = "";
      this.$emit("update:activeRole", roleShort);
    },
    handleClose() {
      this.$emit("update:show", false);
      this.$emit("close");
    },
    handleApply() {
      this.$emit("update:show", false);
      this.$emit("apply");
    },
    toggleAllAssets() {
      if (!this.activeRole) return;
      const ra = this.roleAssignments[this.activeRole];
      if (!ra) return;
      if (this.allAssetsSelected) {
        const filteredIds = new Set(this.filteredAssets.map(a => a.id));
        ra.assets = ra.assets.filter(id => !filteredIds.has(id));
      } else {
        const existing = new Set(ra.assets);
        this.filteredAssets.forEach(a => existing.add(a.id));
        ra.assets = [...existing];
      }
    },
    toggleAllVulns() {
      if (!this.activeRole) return;
      const ra = this.roleAssignments[this.activeRole];
      if (!ra) return;
      if (this.allVulnsSelected) {
        const filteredIds = new Set(this.filteredVulns.map(v => v.id));
        ra.vulnerabilities = ra.vulnerabilities.filter(id => !filteredIds.has(id));
      } else {
        const existing = new Set(ra.vulnerabilities);
        this.filteredVulns.forEach(v => existing.add(v.id));
        ra.vulnerabilities = [...existing];
      }
    },
  },
};
</script>

<style scoped>
.ra-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.42);
  z-index: 10060;
  display: flex;
  justify-content: flex-end;
}
.ra-panel {
  width: min(480px, 100vw);
  height: 100vh;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(36, 20, 71, 0.18);
}
.ra-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 22px 22px 16px;
  border-bottom: 1px solid #f1f5f9;
}
.ra-eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f696e;
}
.ra-title {
  margin: 0 0 6px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1e293b;
}
.ra-subtitle {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.45;
}
.ra-close {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
}
.ra-close:hover { background: #f1f5f9; color: #1e293b; }
.ra-role-tabs {
  display: flex;
  gap: 8px;
  padding: 12px 22px 0;
  overflow-x: auto;
}
.ra-role-tab {
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  color: #64748b;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 0.72rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}
.ra-role-tab.is-active {
  background: #241447;
  border-color: #241447;
  color: #fff;
}
.ra-search-wrap {
  position: relative;
  padding: 14px 22px 10px;
}
.ra-search-icon {
  position: absolute;
  left: 34px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 0.85rem;
}
.ra-search {
  width: 100%;
  height: 40px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0 36px;
  font-size: 0.82rem;
  color: #1e293b;
  background: #f8fafc;
}
.ra-search:focus {
  outline: none;
  border-color: #241447;
  box-shadow: 0 0 0 2px rgba(36, 20, 71, 0.12);
}
.ra-search-clear {
  position: absolute;
  right: 34px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
}
.ra-body {
  flex: 1;
  overflow-y: auto;
  padding: 6px 22px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.ra-section {
  border: 1px solid #eef2f7;
  border-radius: 12px;
  overflow: visible;
  background: #fafbfc;
}
.ra-section-head-right {
  display: flex;
  align-items: center;
  gap: 10px;
}
.ra-select-all {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  user-select: none;
}
.ra-select-all input[type="checkbox"] {
  width: 14px;
  height: 14px;
  accent-color: #241447;
  cursor: pointer;
}
.ra-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: #fff;
  border-bottom: 1px solid #eef2f7;
}
.ra-section-title-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ra-section-icon { color: #241447; font-size: 0.95rem; }
.ra-section-title {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 800;
  color: #1e293b;
}
.ra-section-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: #64748b;
}
.ra-list {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.ra-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-bottom: 1px solid #eef2f7;
  cursor: pointer;
  background: #fff;
}
.ra-item:last-child { border-bottom: none; }
.ra-item:hover { background: #f8fafc; }
.ra-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #241447;
  flex-shrink: 0;
}
.ra-item-content {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.ra-item-name {
  font-size: 0.8rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  word-break: break-word;
}
.ra-item-meta {
  font-size: 0.7rem;
  color: #64748b;
}
.ra-sev {
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 999px;
  padding: 3px 8px;
  flex-shrink: 0;
}
.ra-sev-critical { background: #fee2e2; color: #b91c1c; }
.ra-sev-high { background: #ffedd5; color: #c2410c; }
.ra-sev-medium { background: #fef3c7; color: #b45309; }
.ra-sev-low { background: #dcfce7; color: #15803d; }
.ra-empty {
  margin: 0;
  padding: 16px 14px;
  font-size: 0.78rem;
  color: #94a3b8;
  text-align: center;
}
.ra-footer {
  border-top: 1px solid #f1f5f9;
  padding: 14px 22px 18px;
  background: #fff;
}
.ra-footer-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 0.78rem;
  color: #64748b;
}
.ra-footer-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #cbd5e1;
}
.ra-footer-actions {
  display: flex;
  gap: 10px;
}
.ra-btn-secondary,
.ra-btn-primary {
  flex: 1;
  height: 42px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}
.ra-btn-secondary {
  background: #fff;
  border: 1px solid #e2e8f0;
  color: #475569;
}
.ra-btn-secondary:hover { background: #f8fafc; }
.ra-btn-primary {
  background: #241447;
  border: none;
  color: #fff;
}
.ra-btn-primary:hover { background: #1a0f38; }

.ra-drawer-enter-active .ra-panel { animation: raIn 0.28s cubic-bezier(0.22, 1, 0.36, 1); }
.ra-drawer-leave-active .ra-panel { animation: raOut 0.22s cubic-bezier(0.55, 0, 1, 0.45); }
.ra-drawer-enter-active { animation: raFadeIn 0.28s ease; }
.ra-drawer-leave-active { animation: raFadeOut 0.22s ease; }
@keyframes raIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes raOut { from { transform: translateX(0); } to { transform: translateX(100%); } }
@keyframes raFadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes raFadeOut { from { opacity: 1; } to { opacity: 0; } }

.ra-catalog-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  font-size: 0.82rem;
  color: #64748b;
}
</style>
