<template>
  <main>
    <section>
      <div class="container-fluid px-0">
        <div class="row g-0">
          <DashboardHeader />
        </div>
        <div class="row g-0 flex-nowrap vr-layout-row">
          <div class="col-1 ps-0 menubar-col1">
            <DashboardMenu />
          </div>
          <div class="col vr-content px-0" ref="reportWrap">
            <div class="report-page">
              <div class="meta-header">
                <div class="meta-left">
                  <p class="eyebrow">Comprehensive Audit</p>
                  <h2 class="page-title">Security Intelligence Report</h2>
                  <div class="meta-items">
                    <div class="meta-item">
                      <span>Client</span>
                      <strong>Enterprise Logic Corp</strong>
                    </div>
                    <div class="meta-item">
                      <span>Test Date</span>
                      <strong>Jan 13 - Feb 16, 2026</strong>
                    </div>
                    <div class="meta-item">
                      <span>Author</span>
                      <strong>VaptFix Pro Intelligence Unit</strong>
                    </div>
                  </div>
                </div>
                <div class="meta-right">
                  <span>Generated On</span>
                  <strong>April 10, 2026</strong>
                </div>
              </div>

              <div class="top-grid">
                <div class="card executive-card">
                  <h3><span class="icon-mark">◫</span> Executive Summary</h3>
                  <p>
                    The security assessment conducted across the Enterprise Logic Corp digital perimeter reveals a
                    maturing but vulnerable infrastructure. While internal access controls demonstrate robust perimeter
                    defense, the lateral movement potential within the cloud-native segments poses a significant risk.
                    We identified a total of {{ totalVulnerabilities }} distinct security findings.
                  </p>
                  <p>
                    The overall security posture is currently rated as <em>High Risk</em>, primarily driven by
                    unpatched critical assets. Immediate remediation is advised for top findings to reduce the attack
                    surface.
                  </p>
                  <div class="score-grid">
                    <div class="score-box">
                      <span>Risk Score</span>
                      <strong>{{ riskScore }}/100</strong>
                    </div>
                    <div class="score-box">
                      <span>Sensitivity</span>
                      <strong>{{ hasOverdueFindings ? 'HIGH' : 'MODERATE' }}</strong>
                    </div>
                  </div>
                </div>

                <div class="card progress-card dark-card">
                  <h3>Remediation Progress</h3>
                  <div class="progress-ring" :style="{ '--p': remediationPercent }">
                    <div class="progress-text">{{ remediationPercent }}%</div>
                  </div>
                  <div class="progress-meta">
                    <span>Closed: {{ closedFindings }}</span>
                    <span>Open: {{ openFindings }}</span>
                  </div>
                </div>
              </div>

              <div class="stats-and-scope-grid">
                <div class="card scope-card">
                  <h4>Scope of Assessment</h4>
                  <div class="scope-list">
                    <div class="scope-item">
                      <strong><span class="scope-ico">◎</span> External IPs</strong>
                      <span>{{ uniqueHostsCount }} Active Nodes Scanned</span>
                    </div>
                    <div class="scope-item">
                      <strong><span class="scope-ico">▣</span> Web Applications</strong>
                      <span>12 Production URLs</span>
                    </div>
                    <div class="scope-item">
                      <strong><span class="scope-ico">☁</span> Cloud Infrastructure</strong>
                      <span>AWS / Azure Subsets</span>
                    </div>
                  </div>
                </div>
                <div class="stat-card critical"><span>Critical</span><strong>{{ vulnStats.critical }}</strong><small>+2 from last scan</small></div>
                <div class="stat-card high"><span>High</span><strong>{{ vulnStats.high }}</strong><small>-5 remediated</small></div>
                <div class="stat-card medium"><span>Medium</span><strong>{{ vulnStats.medium }}</strong><small>Stable</small></div>
                <div class="stat-card low"><span>Low</span><strong>{{ vulnStats.low }}</strong><small>Maintenance only</small></div>
              </div>

              <div class="chart-grid">
                <div class="card">
                  <h3>Severity Distribution</h3>
                  <p class="mini-meta">Total Findings: {{ totalVulnerabilities }}</p>
                  <div class="severity-visual">
                    <div class="severity-canvas-wrap">
                      <div class="severity-static-donut" :style="severityConicStyle">
                        <div class="severity-donut-center">
                          <strong>{{ totalVulnerabilities }}</strong>
                          <span>ISSUES</span>
                        </div>
                      </div>
                    </div>
                    <div class="severity-legend">
                      <div v-for="item in severityLegend" :key="item.label" class="severity-legend-row">
                        <span class="legend-color" :style="{ background: item.color }"></span>
                        <span class="legend-label">{{ item.label }}</span>
                        <strong class="legend-pct">{{ item.percent }}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <h3>Findings by Team</h3>
                  <canvas id="rTeamDistributionChart"></canvas>
                </div>
              </div>

              <div class="card">
                <div class="table-head">
                  <h3>Detailed Vulnerability Log</h3>
                  <div class="filters">
                    <button class="filter-btn" type="button">Filter</button>
                    <button class="filter-btn" type="button">Sort by Severity</button>
                  </div>
                </div>

                <div class="table-wrap">
                  <table class="simple-table">
                    <colgroup>
                      <col style="width: 56px;" />
                      <col />
                      <col style="width: 140px;" />
                      <col style="width: 170px;" />
                      <col style="width: 140px;" />
                      <col style="width: 140px;" />
                      <col style="width: 90px;" />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Vulnerability</th>
                        <th>Asset</th>
                        <th>Team</th>
                        <th>Severity</th>
                        <th>Found Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="tableLoading">
                        <td colspan="7">Loading vulnerabilities...</td>
                      </tr>
                      <tr v-else-if="filteredData.length === 0">
                        <td colspan="7">No vulnerabilities match selected filters.</td>
                      </tr>
                      <tr v-else v-for="row in filteredData" :key="row.id">
                        <td>{{ row.id }}</td>
                        <td class="vuln-name-cell" :title="row.name">{{ row.name }}</td>
                        <td>{{ row.asset }}</td>
                        <td><span :class="['team-pill', 'team-pill-' + row.team]">{{ row.teamLabel }}</span></td>
                        <td><span :class="['sev-pill', row.severity]">{{ row.severity }}</span></td>
                        <td>{{ row.found }}</td>
                        <td><span :class="['status-pill', row.status === 'open' ? 'open' : 'closed']">{{ row.status }}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="table-footer">
                  <span>Showing {{ filteredData.length }} of {{ tableData.length }} total findings</span>
                  <div class="table-footer-actions">
                    <button type="button">Previous</button>
                    <button type="button">Next</button>
                  </div>
                </div>
              </div>

              <div class="bottom-actions">
                <button class="btn-export" @click="downloadReport">Export Report</button>
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
import Chart from 'chart.js/auto';
import { useAuthStore } from '@/stores/authStore';
import { PERFORMANCE_TEAM_CONFIGS, TEAM_COLORS } from '@/utils/teamColors';

export default {
  name: 'ViewReportPage',
  components: { DashboardMenu, DashboardHeader },

  data() {
    return {
      teamFilter: 'all',
      severityFilter: 'all',
      statusFilter: 'all',
      charts: [],
      statsLoading: false,
      vulnStats: { critical: 0, high: 0, medium: 0, low: 0 },
      teamDistribution: [],
      teamDetail: {},
      tableLoading: false,
      tableData: [],
      remediationSchedule: [
        {
          severity: 'Critical',
          findingsSuffix: 'findings / 3 hosts',
          action: 'Firewall, patch, or isolate 3 hosts. Exploit log audit before patching.',
          deadline: '18 Jan 2026',
          status: 'Overdue',
          sevKey: 'critical',
        },
        {
          severity: 'High',
          findingsSuffix: 'findings / 4 hosts',
          action: 'Upgrade Apache Struts 6.4.0 on 4 servers. Upgrade MongoDB on 1 server.',
          deadline: '23 Jan 2026',
          status: 'Overdue',
          sevKey: 'high',
        },
        {
          severity: 'Medium',
          findingsSuffix: 'findings / ~30 hosts',
          action: 'SSL certificate replacement project. Disable TLS 1.0/1.1. Security headers. SMB signing.',
          deadline: '16 Feb 2026',
          status: 'Overdue',
          sevKey: 'medium',
        },
        {
          severity: 'Low',
          findingsSuffix: 'findings / 22+ hosts',
          action: 'Firewall rule for ICMP (automated). Weak crypto fix alongside M1.',
          deadline: '16 Apr 2026',
          status: 'In window',
          sevKey: 'low',
        },
      ],
    };
  },

  computed: {
    filteredData() {
      return this.tableData.filter(row =>
        (this.teamFilter === 'all' || row.team === this.teamFilter) &&
        (this.severityFilter === 'all' || row.severity === this.severityFilter) &&
        (this.statusFilter === 'all' || row.status === this.statusFilter)
      );
    },
    totalVulnerabilities() {
      const { critical, high, medium, low } = this.vulnStats;
      return critical + high + medium + low;
    },
    uniqueHostsCount() {
      const assets = new Set(this.tableData.map(row => row.asset).filter(Boolean));
      return assets.size || 0;
    },
    hasOverdueFindings() {
      return this.vulnStats.critical > 0 || this.vulnStats.high > 0 || this.vulnStats.medium > 0;
    },
    openFindings() {
      const apiOpen = this.teamCardConfigs.reduce((sum, cfg) => sum + ((this.teamDetail[cfg.name] || {}).open || 0), 0);
      if (apiOpen > 0) return apiOpen;
      return this.tableData.filter(v => String(v.status).toLowerCase() === 'open').length;
    },
    closedFindings() {
      const apiClosed = this.teamCardConfigs.reduce((sum, cfg) => sum + ((this.teamDetail[cfg.name] || {}).closed || 0), 0);
      if (apiClosed > 0) return apiClosed;
      return this.tableData.filter(v => String(v.status).toLowerCase() !== 'open').length;
    },
    remediationPercent() {
      if (!this.totalVulnerabilities) return 0;
      return Math.round((this.closedFindings / this.totalVulnerabilities) * 100);
    },
    riskScore() {
      const weighted = (this.vulnStats.critical * 8) + (this.vulnStats.high * 5) + (this.vulnStats.medium * 3) + (this.vulnStats.low * 1);
      const max = this.totalVulnerabilities ? this.totalVulnerabilities * 8 : 1;
      return Math.min(100, Math.round((weighted / max) * 100));
    },
    severityLegend() {
      const total = this.totalVulnerabilities || 1;
      return [
        { label: 'Critical', value: this.vulnStats.critical, color: '#b91c1c', percent: Math.round((this.vulnStats.critical / total) * 100) },
        { label: 'High', value: this.vulnStats.high, color: '#f2994a', percent: Math.round((this.vulnStats.high / total) * 100) },
        { label: 'Medium', value: this.vulnStats.medium, color: '#e3b124', percent: Math.round((this.vulnStats.medium / total) * 100) },
        { label: 'Low', value: this.vulnStats.low, color: '#0f696e', percent: Math.round((this.vulnStats.low / total) * 100) },
      ];
    },
    severityConicStyle() {
      const total = this.totalVulnerabilities || 1;
      const critical = (this.vulnStats.critical / total) * 100;
      const high = (this.vulnStats.high / total) * 100;
      const medium = (this.vulnStats.medium / total) * 100;
      const low = (this.vulnStats.low / total) * 100;

      const c1 = critical;
      const c2 = critical + high;
      const c3 = critical + high + medium;
      const c4 = critical + high + medium + low;
      return {
        background: `conic-gradient(
          #b91c1c 0% ${c1}%,
          #f2994a ${c1}% ${c2}%,
          #e3b124 ${c2}% ${c3}%,
          #0f696e ${c3}% ${c4}%,
          #e5e7eb ${c4}% 100%
        )`
      };
    },
    teamCardConfigs() {
      return [
        ...PERFORMANCE_TEAM_CONFIGS.map(c => ({ ...c })),
      ];
    },
  },

  async mounted() {
    await Promise.all([this.fetchVulnerabilities(), this.fetchTeamDistribution(), this.fetchTeamDetail(), this.fetchDetailedVulnerabilities()]);
    this.$nextTick(() => {
      this.initCharts();
    });
  },

  beforeUnmount() {
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  },

  methods: {
    async fetchDetailedVulnerabilities() {
      this.tableLoading = true;
      const store = useAuthStore();
      const result = await store.fetchDetailedVulnerabilities();
      if (result.status && Array.isArray(result.data?.vulnerabilities)) {
        const teamKeyMap = {
          'Network Security': 'network',
          'Patch Management': 'patch',
          'Configuration Management': 'configuration',
          'Architectural Flaws': 'architectural',
        };
        this.tableData = result.data.vulnerabilities.map((v, i) => ({
          id: i + 1,
          name: v.vulnerability_name,
          asset: v.assets,
          team: teamKeyMap[v.assigned_team] || 'unassigned',
          teamLabel: v.assigned_team || 'Unassigned',
          severity: (v.risk_factor || '').toLowerCase(),
          found: v.found_date ? v.found_date.split('T')[0] : '—',
          status: v.status,
        }));
      }
      this.tableLoading = false;
    },

    teamClosureRate(teamName) {
      const t = this.teamDetail[teamName];
      if (!t || !t.total) return 0;
      return Math.round((t.closed / t.total) * 100);
    },

    async fetchTeamDetail() {
      const store = useAuthStore();
      const result = await store.fetchDistributionByTeamDetail();
      if (result.status && result.data?.teams) {
        this.teamDetail = result.data.teams;
      }
    },

    async fetchTeamDistribution() {
      const store = useAuthStore();
      const result = await store.fetchDistributionByTeam();
      if (result.status && Array.isArray(result.data?.distribution)) {
        this.teamDistribution = result.data.distribution;
      }
    },

    async fetchVulnerabilities() {
      this.statsLoading = true;
      const store = useAuthStore();
      const result = await store.fetchDashboardSummary();
      if (result.status) {
        const v = result.data?.vulnerabilities || {};
        this.vulnStats = {
          critical: v.critical ?? store.vulnerabilities.critical ?? 0,
          high: v.high ?? store.vulnerabilities.high ?? 0,
          medium: v.medium ?? store.vulnerabilities.medium ?? 0,
          low: v.low ?? store.vulnerabilities.low ?? 0,
        };
      }
      this.statsLoading = false;
    },

    initCharts() {
      this.charts.forEach(c => c.destroy());
      this.charts = [];
      const { critical, high, medium, low } = this.vulnStats;
      const centerTextPlugin = {
        id: 'centerTextPlugin',
        afterDraw: (chart) => {
          if (chart.canvas.id !== 'rCriticalityStatusChart') return;
          const { ctx } = chart;
          const point = chart.getDatasetMeta(0).data[0];
          if (!point) return;
          const x = point.x;
          const y = point.y;
          ctx.save();
          ctx.textAlign = 'center';
          ctx.fillStyle = '#1f2a42';
          ctx.font = '700 28px Inter';
          ctx.fillText(String(this.totalVulnerabilities), x, y - 2);
          ctx.fillStyle = '#7b8497';
          ctx.font = '600 11px Inter';
          ctx.fillText('ISSUES', x, y + 16);
          ctx.restore();
        }
      };
      const configs = [
        {
          id: 'rTotalVulnsChart',
          type: 'bar',
          data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{ label: 'Total Discovered', data: [critical, high, medium, low], backgroundColor: ['maroon', 'red', 'goldenrod', '#16a34a'], borderRadius: 6 }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
              x: { grid: { display: false } },
              y: { beginAtZero: true, grid: { display: false } }
            }
          }
        },
        {
          id: 'rCriticalityStatusChart',
          type: 'doughnut',
          data: {
            labels: ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
              data: [critical, high, medium, low],
              backgroundColor: ['#b91c1c', '#f2994a', '#e3b124', '#0f696e'],
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverOffset: 0,
              offset: 0
            }]
          },
          options: {
            cutout: '72%',
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            events: [],
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            }
          },
          plugins: [centerTextPlugin]
        },
        {
          id: 'rTeamDistributionChart',
          type: 'doughnut',
          data: (() => {
            const colorMap = {
              'Network Security': TEAM_COLORS.network,
              'Patch Management': TEAM_COLORS.patch,
              'Configuration Management': TEAM_COLORS.configuration,
              'Architectural Flaws': TEAM_COLORS.architectural,
            };
            const dist = this.teamDistribution.length
              ? this.teamDistribution.filter(d => d.team !== 'Unassigned')
              : [
                  { team: 'Network Security', count: 0 },
                  { team: 'Patch Management', count: 0 },
                  { team: 'Configuration Management', count: 0 },
                  { team: 'Architectural Flaws', count: 0 },
                ];
            return {
              labels: dist.map(d => d.team),
              datasets: [{
                data: dist.map(d => d.count),
                backgroundColor: dist.map(d => colorMap[d.team] || '#6b7280'),
                borderWidth: 0,
                hoverOffset: 0,
                offset: 0,
              }],
            };
          })(),
          options: {
            responsive: true,
            maintainAspectRatio: true,
            animation: false,
            events: [],
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false }
            },
          }
        },
      ];
      configs.forEach(cfg => {
        const canvas = document.getElementById(cfg.id);
        if (canvas) {
          const chart = new Chart(canvas.getContext('2d'), {
            type: cfg.type,
            data: cfg.data,
            options: cfg.options,
            plugins: cfg.plugins || []
          });
          this.charts.push(chart);
        }
      });
    },

    downloadReport() {
      const reportContent = this.$refs.reportWrap;
      if (!reportContent) return;

      const clone = reportContent.cloneNode(true);
      clone.style.padding = '0';

      const liveCanvases = reportContent.querySelectorAll('canvas');
      const clonedCanvases = clone.querySelectorAll('canvas');
      liveCanvases.forEach((canvas, i) => {
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.width = '100%';
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.maxHeight = '240px';
        img.style.objectFit = 'contain';
        img.style.display = 'block';
        img.style.margin = '0 auto';
        if (clonedCanvases[i]) {
          clonedCanvases[i].parentNode.replaceChild(img, clonedCanvases[i]);
        }
      });

      const clonedRows = clone.querySelectorAll('.simple-table tbody tr');
      clonedRows.forEach(tr => {
        const teamSpan = tr.querySelector('[class*="team-"]');
        if (teamSpan) {
          const teamClass = Array.from(teamSpan.classList).find(c => c.startsWith('team-') && c !== 'team-badge');
          if (teamClass) tr.setAttribute('data-team', teamClass.replace('team-', ''));
        }
        const sevSpan = tr.querySelector('[class*="sev-badge"]');
        if (sevSpan) {
          const sevClass = Array.from(sevSpan.classList).find(c => c.startsWith('sev-') && c !== 'sev-badge');
          if (sevClass) tr.setAttribute('data-severity', sevClass.replace('sev-', ''));
        }
        const statusSpan = tr.querySelector('.status-open, .status-closed');
        if (statusSpan) {
          tr.setAttribute('data-status', statusSpan.classList.contains('status-open') ? 'open' : 'closed');
        }
      });

      const clonedSelects = clone.querySelectorAll('.filters select');
      if (clonedSelects[0]) clonedSelects[0].setAttribute('id', 'dl-team-filter');
      if (clonedSelects[1]) clonedSelects[1].setAttribute('id', 'dl-sev-filter');
      if (clonedSelects[2]) clonedSelects[2].setAttribute('id', 'dl-status-filter');

      let cssText = '';
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (rule.type === CSSRule.MEDIA_RULE) return;
            cssText += rule.cssText.replace(/\[data-v-[a-zA-Z0-9]+\]/g, '') + '\n';
          });
        } catch (e) { /* cross-origin sheet, skip */ }
      });

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vulnerability Management Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; background: #f8f9fc; padding: 0; margin: 0; }
    .report-download-wrapper { width: 100%; max-width: 1400px; margin: 0 auto; padding: 48px 56px; }
    ${cssText}
    .table-wrap { max-height: none !important; overflow: visible !important; }
    .table-footer { position: static !important; }
    .page-title-block { padding-top: 0 !important; }
    img { max-height: 240px !important; width: 100% !important; height: auto !important; object-fit: contain !important; }
    .bento-card { overflow: visible !important; }
    .section-label { margin-top: 24px !important; }
    .hero-grid, .chart-grid, .stats-grid, .risk-grid { break-inside: avoid; page-break-inside: avoid; }
  </style>
</head>
<body>
<div class="report-download-wrapper">${clone.outerHTML}</div>
<script>
  (function () {
    function applyFilters() {
      var team = document.getElementById('dl-team-filter')?.value || 'all';
      var sev  = document.getElementById('dl-sev-filter')?.value  || 'all';
      var stat = document.getElementById('dl-status-filter')?.value || 'all';
      var rows = document.querySelectorAll('.vuln-table tbody tr');
      var visible = 0;
      rows.forEach(function (tr) {
        var matchTeam = team === 'all' || tr.getAttribute('data-team') === team;
        var matchSev  = sev  === 'all' || tr.getAttribute('data-severity') === sev;
        var matchStat = stat === 'all' || tr.getAttribute('data-status') === stat;
        if (matchTeam && matchSev && matchStat) { tr.style.display = ''; visible++; }
        else { tr.style.display = 'none'; }
      });
    }
    window.addEventListener('DOMContentLoaded', function () {
      ['dl-team-filter', 'dl-sev-filter', 'dl-status-filter'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('change', applyFilters);
      });
    });
  })();
<\/script>
</body>
</html>`;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vulnerability-management-report.html';
      a.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
* { box-sizing: border-box; }
.vr-content { min-height: 100vh; background: #f5f6fa; overflow-y: scroll; scrollbar-gutter: stable; }
.report-page { width: 100%; max-width: none; margin: 0; padding: 20px 10px 40px; display: flex; flex-direction: column; gap: 14px; }
.report-page { padding-top: 84px; }
.meta-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.eyebrow { margin: 0; color: #0f696e; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.page-title { margin: 2px 0 10px; color: #241447; font-size: 44px; font-weight: 800; letter-spacing: -.02em; line-height: 1.05; }
.meta-items { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.meta-item span { display: block; font-size: 10px; color: #8b95a7; text-transform: uppercase; font-weight: 700; letter-spacing: .08em; }
.meta-item strong { font-size: 14px; color: #20293a; font-weight: 700; line-height: 1.3; }
.meta-right { min-width: 160px; background: #fff; border: 1px solid #e7e8ef; border-radius: 22px; padding: 10px 14px; text-align: right; }
.meta-right span { display: block; font-size: 10px; color: #8b95a7; text-transform: uppercase; font-weight: 700; letter-spacing: .08em; }
.meta-right strong { color: #242c40; font-size: 22px; line-height: 1.1; }

.top-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 14px; }
.card { background: #fff; border: 1px solid #e8e8ef; border-radius: 18px; padding: 18px; }
.card h3 { margin: 0 0 10px; color: #222848; font-size: 34px; font-weight: 700; }
.icon-mark { color: #0f696e; font-size: 18px; margin-right: 8px; vertical-align: middle; }
.executive-card p { margin: 0 0 10px; color: #5a6477; line-height: 1.58; font-size: 14px; }
.executive-card em { color: #b72323; font-style: italic; font-weight: 700; }
.score-grid { margin-top: 14px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.score-box { background: #f4f5f8; border-radius: 10px; padding: 12px; }
.score-box span { display: block; font-size: 11px; color: #8b95a7; text-transform: uppercase; font-weight: 700; letter-spacing: .06em; }
.score-box strong { font-size: 38px; color: #1f2a42; line-height: 1.08; }

.dark-card { background: #25124d; color: #fff; }
.dark-card h3 { color: #fff; font-size: 28px; }
.progress-card { text-align: center; display: flex; flex-direction: column; gap: 10px; justify-content: center; }
.progress-ring { margin: 8px auto; width: 150px; height: 150px; border-radius: 50%; background: conic-gradient(#0f696e calc(var(--p, 0) * 1%), rgba(255,255,255,.2) 0); display: flex; align-items: center; justify-content: center; position: relative; }
.progress-ring::before { content: ''; width: 112px; height: 112px; border-radius: 50%; background: #25124d; }
.progress-text { position: absolute; font-size: 44px; font-weight: 800; color: #fff; }
.progress-meta { color: #d6d3e8; font-size: 13px; display: flex; justify-content: space-between; gap: 10px; }

.stats-and-scope-grid { display: grid; grid-template-columns: 1.35fr repeat(4, .9fr); gap: 12px; }
.scope-card h4 { margin: 0 0 10px; font-size: 11px; color: #8b95a7; text-transform: uppercase; letter-spacing: .08em; font-weight: 800; }
.scope-list { display: flex; flex-direction: column; gap: 8px; }
.scope-item { border: 1px solid #ececf2; border-radius: 10px; padding: 10px; background: #fff; }
.scope-item strong { display: block; font-size: 13px; color: #1f2940; }
.scope-ico { color: #0f696e; margin-right: 6px; font-size: 12px; }
.scope-item span { font-size: 12px; color: #6a7488; }

.stat-card { background: #fff; border: 1px solid #ececf2; border-radius: 18px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; min-height: 160px; box-shadow: 0 1px 4px rgba(36,20,71,.08); }
.stat-card span { font-size: 11px; color: #8b95a7; text-transform: uppercase; font-weight: 800; letter-spacing: .07em; }
.stat-card strong { font-size: 52px; line-height: 1; font-weight: 800; }
.stat-card small { color: #8b95a7; font-size: 12px; }
.stat-card.critical strong { color: #b91c1c; }
.stat-card.high strong { color: #d97706; }
.stat-card.medium strong { color: #ca8a04; }
.stat-card.low strong { color: #0f696e; }
.stat-card.critical { border-bottom: 3px solid #b91c1c; }
.stat-card.low { border-bottom: 3px solid #0f696e; }

.chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.mini-meta { margin: -4px 0 10px; font-size: 11px; color: #8b95a7; }
.chart-grid canvas { max-height: 260px; max-width: 100%; }
.severity-visual {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) minmax(180px, 0.9fr);
  align-items: center;
  gap: 12px;
  min-height: 240px;
}
.severity-canvas-wrap {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.severity-canvas-wrap canvas {
  width: min(100%, 320px) !important;
  height: auto !important;
}
.severity-static-donut {
  width: min(100%, 320px);
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.severity-donut-center {
  width: 66%;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}
.severity-donut-center strong {
  font-size: 48px;
  line-height: 1;
  color: #1f2a42;
}
.severity-donut-center span {
  font-size: 12px;
  letter-spacing: .08em;
  color: #8b95a7;
  font-weight: 700;
}
.severity-legend { display: flex; flex-direction: column; gap: 10px; min-width: 0; }
.severity-legend-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #2e3648; min-width: 0; }
.legend-color { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
.legend-label { flex: 1; min-width: 0; }
.legend-pct { font-size: 18px; color: #273247; }

.table-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.filters { display: flex; gap: 8px; }
.filter-btn { border: 1px solid #d9dce6; border-radius: 999px; background: #fff; padding: 6px 14px; color: #3d4558; font-size: 12px; font-weight: 600; }
.table-wrap {
  margin-top: 10px;
  overflow-x: auto;
  overflow-y: scroll;
  max-height: 420px;
  scrollbar-gutter: stable;
  contain: layout paint;
}
.simple-table { width: 100%; border-collapse: collapse; table-layout: auto; }
.simple-table th {
  background: #f4f5f8;
  font-size: 10px;
  color: #8b95a7;
  text-transform: uppercase;
  letter-spacing: .08em;
  font-weight: 800;
  padding: 12px 10px;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
}
.simple-table td {
  border-bottom: 1px solid #edf0f4;
  padding: 12px 10px;
  color: #2d3748;
  font-size: 13px;
  vertical-align: middle;
}
.simple-table th,
.simple-table td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.simple-table tbody tr:hover td {
  background: #fafbfe;
}
.vuln-name-cell {
  font-weight: 600;
  color: #1f2a42;
}
.sev-pill { font-size: 10px; font-weight: 800; border-radius: 6px; padding: 4px 8px; text-transform: uppercase; }
.sev-pill.critical { background: #fee2e2; color: #b91c1c; }
.sev-pill.high { background: #ffedd5; color: #c2410c; }
.sev-pill.medium { background: #fef3c7; color: #a16207; }
.sev-pill.low { background: #ccfbf1; color: #0f766e; }
.status-pill { font-size: 12px; font-weight: 700; }
.status-pill.open { color: #b91c1c; }
.status-pill.closed { color: #0f766e; }
.team-pill { font-size: 12px; font-weight: 700; border-radius: 999px; padding: 4px 10px; border: 1px solid transparent; display: inline-block; }
.team-pill-network { color: #0f696e; background: #e6f7f8; border-color: #8dd9dd; }
.team-pill-patch { color: #8a4f00; background: #fff3dd; border-color: #ffd089; }
.team-pill-configuration { color: #0f696e; background: #e6f7f8; border-color: #8dd9dd; }
.team-pill-architectural { color: #6b21a8; background: #f3e8ff; border-color: #d8b4fe; }
.table-footer { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 4px 0; color: #7b8497; font-size: 12px; }
.table-footer-actions button { border: none; background: transparent; color: #6b7280; font-size: 12px; margin-left: 8px; }
.bottom-actions { display: flex; justify-content: flex-end; }
.btn-export { background: #241447; color: #fff; border: none; border-radius: 999px; padding: 10px 18px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }

@media (max-width: 1200px) {
  .top-grid, .chart-grid { grid-template-columns: 1fr; }
  .stats-and-scope-grid { grid-template-columns: 1fr 1fr; }
  .meta-items { grid-template-columns: 1fr; }
  .severity-visual { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .report-page { padding: 14px 8px 24px; }
  .page-title { font-size: 30px; }
  .stats-and-scope-grid { grid-template-columns: 1fr; }
  .score-grid { grid-template-columns: 1fr; }
}
</style>
