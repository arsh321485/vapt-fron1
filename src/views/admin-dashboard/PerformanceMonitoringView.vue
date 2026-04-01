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

          <div class="col-11 pm-content">
            <div v-if="loading" class="py-5 text-center text-muted">Loading...</div>
            <div v-else class="pm-inner">

              <!-- Page Header -->
              <div class="pm-page-header">
                <div>
                  <h2 class="pm-title">
                    Vulnerability Management Program
                    <i class="bi bi-calendar3 ms-2 pm-title-icon"></i>
                  </h2>
                  <p class="pm-subtitle">Cross-departmental vulnerability resolution tracking</p>
                </div>
                <button class="pm-view-report-btn">
                  <i class="bi bi-eye me-2"></i>
                  View Report
                </button>
              </div>

              <!-- Team Cards Grid -->
              <div class="pm-cards-grid">
                <div v-for="cfg in teamConfigs" :key="cfg.name" class="pm-team-card">
                  <!-- Card Header -->
                  <div class="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h3 class="pm-card-title">{{ cfg.name }} Team</h3>
                      <p class="pm-card-subtitle">{{ cfg.focus }}</p>
                    </div>
                    <span class="pm-status-tag" :class="closureRate(cfg.name) >= 50 ? 'pm-tag-active' : 'pm-tag-review'">
                      {{ closureRate(cfg.name) >= 50 ? 'Active Sync' : 'Reviewing' }}
                    </span>
                  </div>

                  <!-- Metrics Row -->
                  <div class="pm-metrics-row">
                    <div>
                      <p class="pm-metric-label">Closure Rate</p>
                      <div class="d-flex align-items-baseline gap-1">
                        <span class="pm-closure-rate" :style="{ color: closureRate(cfg.name) >= 50 ? '#0f696e' : '#f97316' }">
                          {{ closureRate(cfg.name) }}%
                        </span>
                        <i class="bi pm-trend-icon"
                          :class="closureRate(cfg.name) >= 50 ? 'bi-graph-up-arrow' : 'bi-graph-down-arrow'"
                          :style="{ color: closureRate(cfg.name) >= 50 ? '#0f696e' : '#f97316' }"></i>
                      </div>
                    </div>
                    <div>
                      <p class="pm-metric-label">Closed</p>
                      <span class="pm-metric-value">{{ (teamDetail[cfg.name] || {}).closed ?? '—' }}</span>
                    </div>
                    <div>
                      <p class="pm-metric-label">Open</p>
                      <span class="pm-metric-value">{{ (teamDetail[cfg.name] || {}).open ?? '—' }}</span>
                    </div>
                  </div>

                  <!-- Severity Breakdown -->
                  <div class="pm-sev-section">
                    <p class="pm-metric-label mb-2">Severity Breakdown</p>
                    <!-- Stacked bar -->
                    <div class="pm-stacked-bar">
                      <div class="pm-bar-critical" :style="{ width: getSevPercent(cfg.name, 'Critical') + '%' }"></div>
                      <div class="pm-bar-high"     :style="{ width: getSevPercent(cfg.name, 'High') + '%' }"></div>
                      <div class="pm-bar-medium"   :style="{ width: getSevPercent(cfg.name, 'Medium') + '%' }"></div>
                      <div class="pm-bar-low"      :style="{ width: getSevPercent(cfg.name, 'Low') + '%' }"></div>
                    </div>
                    <!-- Sev boxes -->
                    <div class="pm-sev-boxes">
                      <div class="pm-sev-box pm-sev-box-critical">
                        <p class="pm-sev-box-label">Critical</p>
                        <p class="pm-sev-box-value">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Critical ?? 0 }}</p>
                      </div>
                      <div class="pm-sev-box pm-sev-box-high">
                        <p class="pm-sev-box-label">High</p>
                        <p class="pm-sev-box-value">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).High ?? 0 }}</p>
                      </div>
                      <div class="pm-sev-box pm-sev-box-medium">
                        <p class="pm-sev-box-label">Medium</p>
                        <p class="pm-sev-box-value">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Medium ?? 0 }}</p>
                      </div>
                      <div class="pm-sev-box pm-sev-box-low">
                        <p class="pm-sev-box-label">Low</p>
                        <p class="pm-sev-box-value">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Low ?? 0 }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bottom Analytics Bar -->
              <div class="pm-analytics-bar">
                <div class="d-flex gap-5 align-items-center">
                  <div>
                    <p class="pm-analytics-label">Total System Resolution</p>
                    <p class="pm-analytics-value">{{ totalSystemResolution }}%</p>
                  </div>
                  <div class="pm-divider"></div>
                  <div>
                    <p class="pm-analytics-label">Total Vulnerabilities Tracked</p>
                    <p class="pm-analytics-value">{{ totalVulnerabilities }}</p>
                  </div>
                </div>
                <button class="pm-export-btn">
                  <i class="bi bi-download me-2"></i>
                  Export Global Stats
                </button>
              </div>

            </div>
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
  name: 'PerformanceMonitoringView',
  components: { DashboardMenu, DashboardHeader },
  data() {
    return {
      loading: false,
      teamDetail: {},
      teamConfigs: [
        { name: 'Network Security',         focus: 'Infrastructure Focus',    color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', icon: '🔗' },
        { name: 'Patch Management',         focus: 'Lifecycle Management',    color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', icon: '🔧' },
        { name: 'Configuration Management', focus: 'System Configuration',    color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⚙️' },
        { name: 'Architectural Flaws',      focus: 'Design & Architecture',   color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)', icon: '🏗️' },
      ],
    };
  },
  computed: {
    totalSystemResolution() {
      const teams = this.teamConfigs.map(c => this.closureRate(c.name));
      if (!teams.length) return 0;
      const avg = teams.reduce((s, v) => s + v, 0) / teams.length;
      return Math.round(avg * 10) / 10;
    },
    totalVulnerabilities() {
      return this.teamConfigs.reduce((s, c) => s + ((this.teamDetail[c.name] || {}).total || 0), 0);
    },
  },
  methods: {
    closureRate(teamName) {
      const t = this.teamDetail[teamName];
      if (!t || !t.total) return 0;
      return Math.round((t.closed / t.total) * 100);
    },
    getSevPercent(teamName, severity) {
      const t = this.teamDetail[teamName];
      if (!t || !t.total) return 0;
      const count = (t.by_risk || {})[severity] || 0;
      return Math.round((count / t.total) * 100);
    },
  },
  async mounted() {
    const store = useAuthStore();
    if (!store.cachedDistributionByTeam) this.loading = true;
    const result = await store.fetchDistributionByTeamDetail();
    if (result.status && result.data?.teams) {
      this.teamDetail = result.data.teams;
    }
    this.loading = false;
  },
};
</script>

<style scoped>
.pm-content {
  padding: 0;
}

.pm-inner {
  padding: 28px 32px;
  background: #f5f6fa;
  min-height: calc(100vh - 72px);
  padding-top: 65px;
}

/* Page Header */
.pm-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
}

.pm-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
}

.pm-title-icon {
  font-size: 1rem;
  color: #94a3b8;
}

.pm-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
}

.pm-view-report-btn {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 7px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: background 0.15s;
}
.pm-view-report-btn:hover { background: #f8fafc; }

/* Cards Grid */
.pm-cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

@media (max-width: 1100px) {
  .pm-cards-grid { grid-template-columns: 1fr; }
}

.pm-team-card {
  background: white;
  border-radius: 12px;
  padding: 22px 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  border: 1px solid #f1f5f9;
  transition: box-shadow 0.2s;
}
.pm-team-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.1); }

.pm-card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 2px;
}

.pm-card-subtitle {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
  color: #94a3b8;
  margin: 0;
}

.pm-status-tag {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 50px;
}
.pm-tag-active {
  background: #b8f3f5;
  color: #0f696e;
}
.pm-tag-review {
  background: #ffedd5;
  color: #c2410c;
}

/* Metrics row */
.pm-metrics-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.pm-metric-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 4px;
}

.pm-closure-rate {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1;
}

.pm-trend-icon {
  font-size: 0.9rem;
}

.pm-metric-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1e293b;
}

/* Severity section */
.pm-sev-section {
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.pm-stacked-bar {
  height: 8px;
  width: 100%;
  background: #f1f5f9;
  border-radius: 50px;
  overflow: hidden;
  display: flex;
  margin-bottom: 10px;
}

.pm-bar-critical { height: 100%; background: #ff4d4d; }
.pm-bar-high     { height: 100%; background: #f2994a; }
.pm-bar-medium   { height: 100%; background: #f2c94c; }
.pm-bar-low      { height: 100%; background: #0f696e; }

.pm-sev-boxes {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.pm-sev-box {
  padding: 8px;
  border-radius: 8px;
  text-align: center;
}
.pm-sev-box-critical { background: #fef2f2; }
.pm-sev-box-high     { background: #fff7ed; }
.pm-sev-box-medium   { background: #fefce8; }
.pm-sev-box-low      { background: #f0fdfa; }

.pm-sev-box-label {
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 2px;
}
.pm-sev-box-critical .pm-sev-box-label { color: #ef4444; }
.pm-sev-box-high     .pm-sev-box-label { color: #f97316; }
.pm-sev-box-medium   .pm-sev-box-label { color: #ca8a04; }
.pm-sev-box-low      .pm-sev-box-label { color: #0f696e; }

.pm-sev-box-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Bottom Analytics Bar */
.pm-analytics-bar {
  background: #241447;
  border-radius: 12px;
  padding: 20px 28px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 16px rgba(36, 20, 71, 0.3);
}

.pm-analytics-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 4px;
}

.pm-analytics-value {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0;
  color: white;
}

.pm-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

.pm-export-btn {
  background: #0f696e;
  color: white;
  padding: 9px 20px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background 0.15s, transform 0.1s;
}
.pm-export-btn:hover { background: #0a4e52; }
.pm-export-btn:active { transform: scale(0.97); }
</style>
