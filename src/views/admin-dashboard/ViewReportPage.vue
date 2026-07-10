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
          <div class="col vr-content px-0">
            <div class="report-page" ref="reportContent">
              <div class="report-watermark-layer" :style="watermarkLayerStyle" aria-hidden="true"></div>
              <div class="meta-header">
                <div class="meta-left">
                  <p class="eyebrow">Comprehensive Audit</p>
                  <h2 class="page-title">Vul management program Report</h2>
                  <div class="meta-items">
                    <div class="meta-item">
                      <span>Report generated on</span>
                      <strong>{{ reportMeta.reportGeneratedOn || '—' }}</strong>
                    </div>
                    <div class="meta-item">
                      <span>Vul management program</span>
                      <strong class="meta-file-name" :title="reportMeta.vulManagementProgram">{{ reportMeta.vulManagementProgram || '—' }}</strong>
                    </div>
                    <div class="meta-item">
                      <span>Date of testing</span>
                      <strong>{{ reportMeta.dateOfTesting || '—' }}</strong>
                    </div>
                  </div>
                </div>
                <div class="meta-right-col">
                  <div class="export-dropdown no-export" ref="exportDropdown">
                    <button
                      class="btn-export"
                      type="button"
                      :disabled="pdfExporting"
                      @click="toggleExportMenu"
                    >
                      {{ pdfExporting ? 'Exporting…' : 'Export Report' }}
                      <span class="export-chevron" :class="{ open: exportMenuOpen }">▾</span>
                    </button>
                    <div v-show="exportMenuOpen" class="export-menu" role="menu">
                      <button type="button" role="menuitem" @click="downloadReportAsHtml">Download as HTML</button>
                      <button type="button" role="menuitem" @click="exportReportPdf">Export PDF</button>
                    </div>
                  </div>
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
                  <div class="scope-mini-section">
                    <h4 class="scope-mini-heading">Scope of Assessment</h4>
                    <div class="scope-mini-grid">
                      <div class="scope-mini-card">
                        <span><span class="scope-ico">◎</span> External IPs</span>
                        <strong>{{ uniqueHostsCount }}</strong>
                        <small>Active Nodes Scanned</small>
                      </div>
                      <div class="scope-mini-card">
                        <span><span class="scope-ico">▣</span> Web Applications</span>
                        <strong>12</strong>
                        <small>Production URLs</small>
                      </div>
                      <div class="scope-mini-card">
                        <span><span class="scope-ico">☁</span> Cloud Infrastructure</span>
                        <strong>2</strong>
                        <small>AWS / Azure Subsets</small>
                      </div>
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

              <div class="severity-stats-grid">
                <div class="stat-card stat-card--compact critical"><span>Critical</span><strong>{{ vulnStats.critical }}</strong><small>+2 from last scan</small></div>
                <div class="stat-card stat-card--compact high"><span>High</span><strong>{{ vulnStats.high }}</strong><small>-5 remediated</small></div>
                <div class="stat-card stat-card--compact medium"><span>Medium</span><strong>{{ vulnStats.medium }}</strong><small>Stable</small></div>
                <div class="stat-card stat-card--compact low"><span>Low</span><strong>{{ vulnStats.low }}</strong><small>Maintenance only</small></div>
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
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useAuthStore } from '@/stores/authStore';
import { PERFORMANCE_TEAM_CONFIGS, TEAM_COLORS } from '@/utils/teamColors';

const REPORT_WATERMARK_TEXT = 'vaptfix.ai';
/** Manual uploaded scan file name until API field is wired */
const REPORT_UPLOAD_FILE_NAME = 'Ibdar_Int_July';
const WATERMARK_TILE_W = 580;
const WATERMARK_TILE_H = 420;
const WATERMARK_ANGLE = -38;
const WATERMARK_FONT_SIZE = 52;
const WATERMARK_FILL = 'rgba(140, 145, 155, 0.135)';

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
      exportMenuOpen: false,
      pdfExporting: false,
      reportMetaLoading: false,
      reportMeta: {
        reportGeneratedOn: '',
        vulManagementProgram: REPORT_UPLOAD_FILE_NAME,
        dateOfTesting: '',
      },
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
    watermarkLayerStyle() {
      return {
        backgroundImage: this.getWatermarkBackgroundImage(),
        backgroundRepeat: 'repeat',
        backgroundSize: `${WATERMARK_TILE_W}px ${WATERMARK_TILE_H}px`,
      };
    },
  },

  async mounted() {
    this._onDocClick = (e) => {
      const el = this.$refs.exportDropdown;
      if (el && !el.contains(e.target)) this.exportMenuOpen = false;
    };
    document.addEventListener('click', this._onDocClick);
    await this.loadReportData();
    this.$nextTick(() => {
      this.initCharts();
    });
  },

  beforeUnmount() {
    document.removeEventListener('click', this._onDocClick);
    this.charts.forEach(c => c.destroy());
    this.charts = [];
  },

  methods: {
    formatMetaDate(value) {
      if (!value) return '';
      const raw = String(value).trim();
      if (!raw) return '';
      const d = new Date(raw.includes('T') ? raw : raw.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      }
      return raw;
    },

    async loadReportData() {
      this.statsLoading = true;
      this.tableLoading = true;
      this.reportMetaLoading = true;
      const store = useAuthStore();
      try {
        const result = await store.fetchReportDownloadData();
        if (!result.status || !result.data) return;
        const d = result.data;

        // 1. Report metadata
        if (d.report_generated_on) {
          this.reportMeta.reportGeneratedOn = this.formatMetaDate(d.report_generated_on);
        }
        if (d.vul_management_program) {
          this.reportMeta.vulManagementProgram = String(d.vul_management_program).replace(/\.html?$/i, '');
        }

        // 2. Vulnerability severity counts
        if (d.vulnerabilities) {
          this.vulnStats = {
            critical: d.vulnerabilities.critical ?? 0,
            high: d.vulnerabilities.high ?? 0,
            medium: d.vulnerabilities.medium ?? 0,
            low: d.vulnerabilities.low ?? 0,
          };
        }

        // 3. Team distribution (for bar/doughnut charts)
        if (Array.isArray(d.team_distribution)) {
          this.teamDistribution = d.team_distribution.map(t => ({
            team: t.team,
            count: t.count,
            percentage: t.percentage,
          }));
        }

        // 4. Vulnerability detail list + derive teamDetail for open/closed counts
        if (Array.isArray(d.vulnerabilities_detail)) {
          const teamKeyMap = {
            'Network Security': 'network',
            'Patch Management': 'patch',
            'Configuration Management': 'configuration',
            'Architectural Flaws': 'architectural',
          };
          this.tableData = d.vulnerabilities_detail.map((v, i) => ({
            id: i + 1,
            name: v.vulnerability_name,
            asset: v.assets,
            team: teamKeyMap[v.assigned_team] || 'unassigned',
            teamLabel: v.assigned_team || 'Unassigned',
            severity: (v.risk_factor || '').toLowerCase(),
            found: v.found_date ? v.found_date.split('T')[0] : '—',
            status: v.status,
          }));

          // Derive per-team open/closed counts from detail list
          const teamDetailMap = {};
          d.vulnerabilities_detail.forEach(v => {
            const teamName = v.assigned_team || 'Unassigned';
            if (!teamDetailMap[teamName]) {
              teamDetailMap[teamName] = { total: 0, open: 0, closed: 0 };
            }
            teamDetailMap[teamName].total++;
            const s = String(v.status || '').toLowerCase();
            if (s === 'closed' || s === 'fixed' || s === 'resolved' || s === 'remediated') {
              teamDetailMap[teamName].closed++;
            } else {
              teamDetailMap[teamName].open++;
            }
          });
          this.teamDetail = teamDetailMap;
        }
      } catch (err) {
        console.error('Report data fetch failed:', err);
      } finally {
        this.statsLoading = false;
        this.tableLoading = false;
        this.reportMetaLoading = false;
      }
    },

    teamClosureRate(teamName) {
      const t = this.teamDetail[teamName];
      if (!t || !t.total) return 0;
      return Math.round((t.closed / t.total) * 100);
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

    toggleExportMenu(e) {
      e.stopPropagation();
      this.exportMenuOpen = !this.exportMenuOpen;
    },

    getWatermarkBackgroundImage() {
      const cx = WATERMARK_TILE_W / 2;
      const cy = WATERMARK_TILE_H / 2;
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WATERMARK_TILE_W}" height="${WATERMARK_TILE_H}" viewBox="0 0 ${WATERMARK_TILE_W} ${WATERMARK_TILE_H}">
  <text x="${cx}" y="${cy}" transform="rotate(${WATERMARK_ANGLE} ${cx} ${cy})" font-family="Inter,Arial,Helvetica,sans-serif" font-size="${WATERMARK_FONT_SIZE}" font-weight="700" fill="${WATERMARK_FILL}" text-anchor="middle" dominant-baseline="middle">${REPORT_WATERMARK_TEXT}</text>
</svg>`;
      return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    },

    applyWatermarkStyles(el) {
      if (!el) return;
      el.style.backgroundImage = this.getWatermarkBackgroundImage();
      el.style.backgroundRepeat = 'repeat';
      el.style.backgroundSize = `${WATERMARK_TILE_W}px ${WATERMARK_TILE_H}px`;
    },

    getWatermarkCssBlock() {
      const uri = this.getWatermarkBackgroundImage();
      return `
    .report-page,
    .report-download-wrapper { position: relative; }
    .report-watermark-layer {
      position: absolute;
      inset: 0;
      z-index: 50;
      pointer-events: none;
      background-image: ${uri};
      background-repeat: repeat;
      background-size: ${WATERMARK_TILE_W}px ${WATERMARK_TILE_H}px;
    }
    @media print {
      .report-watermark-layer {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }`;
    },

    buildReportClone() {
      const reportContent = this.$refs.reportContent;
      if (!reportContent) return null;

      const clone = reportContent.cloneNode(true);
      clone.querySelectorAll('.no-export').forEach((el) => el.remove());
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

      return clone;
    },

    downloadReportAsHtml() {
      this.exportMenuOpen = false;
      const clone = this.buildReportClone();
      if (!clone) return;

      clone.querySelectorAll('.report-watermark-layer').forEach((el) => this.applyWatermarkStyles(el));

      let cssText = '';
      Array.from(document.styleSheets).forEach((sheet) => {
        try {
          Array.from(sheet.cssRules || []).forEach((rule) => {
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
    ${this.getWatermarkCssBlock()}
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

    async exportReportPdf() {
      this.exportMenuOpen = false;
      const reportContent = this.$refs.reportContent;
      if (!reportContent || this.pdfExporting) return;

      this.pdfExporting = true;
      const hiddenEls = [];
      reportContent.querySelectorAll('.no-export').forEach((el) => {
        hiddenEls.push({ el, display: el.style.display });
        el.style.display = 'none';
      });
      try {
        const canvas = await html2canvas(reportContent, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#f5f6fa',
          windowWidth: reportContent.scrollWidth,
          scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('security-intelligence-report.pdf');
      } catch (err) {
        console.error('PDF export failed:', err);
        alert('PDF export failed. Please try again.');
      } finally {
        hiddenEls.forEach(({ el, display }) => { el.style.display = display; });
        this.pdfExporting = false;
      }
    },
  },
};
</script>

<style scoped>
* { box-sizing: border-box; }
.vr-content { min-height: 100vh; background: #f5f6fa; overflow-y: scroll; scrollbar-gutter: stable; }
.report-page {
  position: relative;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 20px 10px 40px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 84px;
  overflow: hidden;
}
.report-watermark-layer {
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background-repeat: repeat;
}
.meta-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; }
.eyebrow { margin: 0; color: #0f696e; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.page-title { margin: 2px 0 10px; color: #241447; font-size: 44px; font-weight: 800; letter-spacing: -.02em; line-height: 1.05; }
.meta-items { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.meta-item strong.meta-file-name {
  word-break: break-all;
  font-size: 13px;
  line-height: 1.35;
}
.meta-item span { display: block; font-size: 10px; color: #8b95a7; text-transform: uppercase; font-weight: 700; letter-spacing: .08em; }
.meta-item strong { font-size: 14px; color: #20293a; font-weight: 700; line-height: 1.3; }
.meta-right-col { display: flex; flex-direction: column; align-items: flex-end; gap: 10px; flex-shrink: 0; }
.export-dropdown { position: relative; }
.export-chevron { margin-left: 6px; font-size: 10px; display: inline-block; transition: transform .2s; }
.export-chevron.open { transform: rotate(180deg); }
.export-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 200px;
  background: #fff;
  border: 1px solid #e7e8ef;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(36, 20, 71, .12);
  padding: 6px;
  z-index: 20;
}
.export-menu button {
  display: block;
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #242c40;
  cursor: pointer;
}
.export-menu button:hover { background: #f4f5f8; }

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

.scope-mini-section { margin-top: 12px; }
.scope-mini-heading { margin: 0 0 8px; font-size: 10px; color: #8b95a7; text-transform: uppercase; letter-spacing: .08em; font-weight: 800; }
.scope-mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.scope-mini-card {
  background: #fff;
  border: 1px solid #ececf2;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 88px;
  box-shadow: 0 1px 3px rgba(36, 20, 71, .06);
  border-bottom: 3px solid #0f696e;
}
.scope-mini-card span {
  font-size: 9px;
  color: #8b95a7;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: .06em;
  line-height: 1.3;
}
.scope-mini-card strong { font-size: 28px; line-height: 1; font-weight: 800; color: #0f696e; }
.scope-mini-card small { color: #8b95a7; font-size: 10px; line-height: 1.3; }
.scope-ico { color: #0f696e; margin-right: 4px; font-size: 10px; }

.severity-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

.stat-card { background: #fff; border: 1px solid #ececf2; border-radius: 18px; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; min-height: 160px; box-shadow: 0 1px 4px rgba(36,20,71,.08); }
.stat-card--compact {
  min-height: 118px;
  padding: 10px 12px;
  border-radius: 14px;
}
.stat-card--compact span { font-size: 10px; }
.stat-card--compact strong { font-size: 36px; }
.stat-card--compact small { font-size: 11px; }
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
.btn-export {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
}
.btn-export:disabled { opacity: .7; cursor: wait; }

@media (max-width: 1200px) {
  .top-grid, .chart-grid { grid-template-columns: 1fr; }
  .scope-mini-grid { grid-template-columns: 1fr; }
  .severity-stats-grid { grid-template-columns: 1fr 1fr; }
  .meta-items { grid-template-columns: 1fr; }
  .severity-visual { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .report-page { padding: 14px 8px 24px; }
  .page-title { font-size: 30px; }
  .severity-stats-grid { grid-template-columns: 1fr; }
  .scope-mini-grid { grid-template-columns: 1fr; }
  .score-grid { grid-template-columns: 1fr; }
}
</style>
