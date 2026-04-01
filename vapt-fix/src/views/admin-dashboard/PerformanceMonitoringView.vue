<template>
    <main>
    <section>

      <div class="container-fluid">
        <div class="row">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1">
            <DashboardMenu />
          </div>

        <div class="col-11 pt-5 pb-3 pe-4 flex-grow-1 position-relative">
            <div class="d-flex justify-content-between mt-4">
              <h2 class="ticket-head mb-3">Performance Monitoring</h2>
            </div>

            <!-- both section here  -->

            

            <!-- Team Performance Overview - 2x2 Grid -->
            <section>
                <div v-if="loading" class="py-4 text-center text-muted">Loading...</div>
                <div class="teams-grid" v-else>
                    <div
                        v-for="cfg in teamConfigs"
                        :key="cfg.name"
                        class="team-card"
                        :style="{ borderLeftColor: cfg.color }"
                    >
                        <div class="team-header">
                            <div class="team-icon" :style="{ background: cfg.gradient }">{{ cfg.icon }}</div>
                            <div>
                                <div class="team-name">{{ cfg.name }} Team</div>
                                <div class="team-total" :style="{ color: cfg.color }">
                                    {{ (teamDetail[cfg.name] || {}).total ?? '—' }} Total Vulnerabilities assigned
                                </div>
                            </div>
                        </div>
                        <div class="team-metrics">
                            <div class="metric-item">
                                <div class="metric-value" style="color: #059669;">{{ (teamDetail[cfg.name] || {}).closed ?? '—' }}</div>
                                <div class="metric-label">Closed</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value" style="color: #dc2626;">{{ (teamDetail[cfg.name] || {}).open ?? '—' }}</div>
                                <div class="metric-label">Open</div>
                            </div>
                            <div class="metric-item"><div class="status-badge severity-maroon">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Critical ?? 0 }} Critical</div></div>
                            <div class="metric-item"><div class="status-badge severity-red">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).High ?? 0 }} High</div></div>
                            <div class="metric-item"><div class="status-badge severity-orange">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Medium ?? 0 }} Medium</div></div>
                            <div class="metric-item"><div class="status-badge severity-darkgreen">{{ ((teamDetail[cfg.name] || {}).by_risk || {}).Low ?? 0 }} Low</div></div>
                        </div>
                        <div style="font-size: 0.82rem; color: #64748b; font-weight: 500;">
                            {{ closureRate(cfg.name) }}% Closure Rate
                        </div>
                    </div>
                </div>
            </section>

            <!-- Main Chart -->
            <!-- <section class="charts-section">
                <div class="chart-card">
                    <div class="chart-title">Mitigated Vulnerabilities: Severity vs Team Performance</div>
                    <div class="chart-wrapper">
                      <canvas id="mitigatedRadarChart"></canvas>
                    </div>
                </div>
            </section> -->

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
        { name: 'Network Security',         color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', icon: '🔗' },
        { name: 'Patch Management',         color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)', icon: '🔧' },
        { name: 'Configuration Management', color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', icon: '⚙️' },
        { name: 'Architectural Flaws',      color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)', icon: '🏗️' },
      ],
    };
  },
  methods: {
    closureRate(teamName) {
      const t = this.teamDetail[teamName];
      if (!t || !t.total) return 0;
      return Math.round((t.closed / t.total) * 100);
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
.ticket-head {
  color: rgba(0, 0, 0, 1);
  font-weight: 500;
  font-size: 36px;
}

/* Section heading */
.section-h2 { font-size: 2rem; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 15px; margin-bottom: 30px; }

/* Charts Section */
.charts-section { display: grid; grid-template-columns: 1fr; gap: 30px; margin-bottom: 40px; }
.chart-card { background: white; padding: 35px; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.1); }
.chart-wrapper { position: relative; height: 900px; }
.chart-title { font-size: 1.4rem; font-weight: 600; color: #1e293b; margin-bottom: 25px; text-align: center; }

/* Team Overview Cards - 2x2 Grid */
.teams-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 30px; }
@media (max-width: 1100px) { .teams-grid { grid-template-columns: 1fr; } }
.team-card { background: white; padding: 16px 18px; border-radius: 14px; box-shadow: 0 4px 16px rgba(0,0,0,0.07); border-left: 5px solid; height: 100%; }
.team-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.team-icon { font-size: 1.4rem; width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; flex-shrink: 0; }
.team-name { font-size: 15px; font-weight: 700; color: #1e293b; }
.team-total { font-size: 12px; font-weight: 600; }
.team-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
.metric-item { text-align: center; padding: 6px 8px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 10px; }
.metric-value { font-size: 1.1rem; font-weight: 700; margin-bottom: 2px; }
.metric-label { font-size: 0.75rem; color: #64748b; }
.status-badge { padding: 3px 8px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; display: inline-block; }
.severity-maroon { background: maroon; color: white; }
.severity-red { background: red; color: white; }
.severity-orange { background: goldenrod; color: white; }
.severity-darkgreen { background: green; color: white; }
</style>
