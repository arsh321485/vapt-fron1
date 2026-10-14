<template>
  <div class="fp-root">
    <Header />

    <header class="fp-hero">
      <section class="fp-wrap fp-hero-grid">
        <div class="fp-hero-copy">
          <div class="fp-eyebrow">Platform capabilities</div>
          <h1>From vulnerability discovery <span class="fp-hl">to verified remediation.</span></h1>
          <p>VAPTFIX is a Vulnerability Management Program as a service. Import your existing vulnerability assessment reports or engage our team to conduct the testing. Each finding is mapped to its asset, routed to the appropriate specialist team, remediated, and independently verified within your defined service levels.</p>
          <div class="fp-actions">
            <a class="fp-btn fp-btn-primary" :href="demoUrl" target="_blank" rel="noopener">
              Book a Demo
              <svg aria-hidden="true"><use href="#fp-i-arrow" /></svg>
            </a>
            <a class="fp-btn fp-btn-outline" href="#lifecycle">Explore the Workflow</a>
          </div>
        </div>
        <aside class="fp-access-card">
          <div class="fp-access-head">
            <span class="fp-access-label">Available on</span>
          </div>
          <div class="fp-access-list">
            <div class="fp-access-item">
              <span class="fp-access-icon" aria-hidden="true"><svg><use href="#fp-i-web" /></svg></span>
              <span class="fp-access-copy"><strong>Web Platform</strong></span>
            </div>
            <button type="button" class="fp-access-item" @click="startSlackSignup">
              <span class="fp-access-icon"><img :src="slackIcon" alt="" width="28" height="28" /></span>
              <span class="fp-access-copy"><strong>Slack</strong><span>Sign up with Slack</span></span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
            <button type="button" class="fp-access-item" @click="startTeamsSignup">
              <span class="fp-access-icon"><img :src="teamsIcon" alt="" width="28" height="28" /></span>
              <span class="fp-access-copy"><strong>Microsoft Teams</strong><span>Sign Up with Ms teams</span></span>
              <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
          <p class="fp-access-desc">Assign vulnerabilities and track remediation without leaving your collaboration platform.</p>
        </aside>
      </section>
    </header>

    <main>
      <section id="lifecycle" class="fp-wrap fp-lifecycle">
        <div class="fp-section-head">
          <div class="fp-eyebrow">End-to-end lifecycle</div>
          <h2>Ownership, a deadline, a fix and a paper trail for every vulnerability.</h2>
        </div>
        <ol class="fp-journey">
          <li v-for="(step, index) in lifecycleSteps" :key="step.num" :class="{ 'is-active': activeJourney === index }">
            <button type="button" class="fp-journey-btn" @click="activeJourney = index">
              <span class="fp-journey-num">{{ step.num }}</span>
              <span class="fp-journey-copy">
                <strong>{{ step.title }}</strong>
                <span class="fp-desc">{{ step.desc }}</span>
              </span>
            </button>
          </li>
        </ol>
      </section>

      <section id="capabilities" class="fp-wrap fp-features">
        <div class="fp-section-head">
          <div class="fp-eyebrow">Core capabilities</div>
          <h2>Capabilities that drive every finding to closure</h2>
        </div>
        <div class="fp-grid">
          <article class="fp-card">
            <div class="fp-tag">01 · Track</div>
            <h3>Vulnerability Management</h3>
            <p>A single, authoritative register of every open risk, with clear prioritization and defined ownership.</p>
            <div class="fp-sev" aria-label="Severity levels">
              <span class="fp-sev-c">Critical</span>
              <span class="fp-sev-h">High</span>
              <span class="fp-sev-m">Medium</span>
              <span class="fp-sev-l">Low</span>
            </div>
            <ul class="fp-ticks">
              <li>Centralized vulnerability register</li>
              <li>Severity-based prioritization</li>
              <li>Consolidated view of open and closed findings</li>
              <li>Asset-level mapping by exposure: External, Internal and DMZ</li>
              <li>Real-time dashboards and MTTR reporting</li>
            </ul>
          </article>

          <article class="fp-card">
            <div class="fp-tag">02 · Remediate</div>
            <h3>Remediation Management</h3>
            <p>Manage every finding from identification through verified resolution, without reliance on spreadsheets or email.</p>
            <ul class="fp-ticks">
              <li>Structured, step-by-step remediation workflows</li>
              <li>Downloadable Python scripts for automated remediation</li>
              <li>Manual remediation guidance where automation is not appropriate</li>
              <li>Validation of resolution prior to closure</li>
              <li>Progress tracking by vulnerability and asset</li>
            </ul>
          </article>

          <article class="fp-card">
            <div class="fp-tag">03 · Govern</div>
            <h3>Governance &amp; SLA Oversight</h3>
            <p>Maintain control over deadlines, exceptions and accountability, with audit-ready evidence at every stage.</p>
            <ul class="fp-ticks">
              <li>SLA compliance monitoring with breach notifications</li>
              <li>Approval workflows for Mitigation Timeline Extensions</li>
              <li>Immutable, append-only audit trail</li>
              <li>Support Request management</li>
              <li><strong>Operational Reality Mapping</strong> — compare actual exposure windows against committed SLA timelines</li>
            </ul>
          </article>

          <article class="fp-card">
            <div class="fp-tag">04 · Assess</div>
            <h3>Continuous Vulnerability Assessment</h3>
            <p>Ongoing assessment that identifies new exposures as they emerge, rather than relying on periodic point-in-time testing.</p>
            <ul class="fp-ticks">
              <li>Continuous assessment cycles</li>
              <li>Hybrid cloud environments</li>
              <li>On-premises infrastructure</li>
              <li>Endpoint coverage</li>
            </ul>
          </article>

          <article class="fp-card">
            <div class="fp-tag">05 · Validate</div>
            <h3>Expert-Validated Mitigation</h3>
            <p>Automation delivers speed; security specialists ensure accuracy. Every AI-generated recommendation undergoes expert review.</p>
            <ul class="fp-ticks">
              <li>Expert validation of AI-generated recommendations</li>
              <li>Reduced false positives reaching operational teams</li>
              <li>Compensating controls where vendor patches are not yet available</li>
            </ul>
          </article>

          <article class="fp-card">
            <div class="fp-tag">06 · Connect</div>
            <h3>Integrations &amp; Alerts</h3>
            <p>Operate within the VAPTFIX web platform or within the tools your teams already rely on.</p>
            <ul class="fp-ticks">
              <li>Vulnerability workflows in Slack and Microsoft Teams</li>
              <li>Web platform with real-time dashboards</li>
              <li>Automated escalation alerts</li>
              <li>Import of VA/VAPT reports, or testing conducted by our team</li>
              <li>Asset Register synchronization</li>
            </ul>
          </article>
        </div>
      </section>

      <section id="collaboration" class="fp-wrap fp-collab">
        <div class="fp-collab-box">
          <div class="fp-collab-top">
            <div class="fp-collab-intro">
              <div class="fp-eyebrow">Product access</div>
              <h2>Works inside Slack and Microsoft Teams</h2>
              <p class="fp-lead">The web platform is the home of your Vulnerability Management Program. Slack and Microsoft Teams carry its workflows into the conversations where your engineers and third-party vendors already work, so every assignment reaches its owner without delay.</p>
              <p class="fp-collab-quote">Assign it in Slack or Teams. Track it to done.</p>
              <div class="fp-platforms">
                <button type="button" class="fp-platform" @click="startSlackSignup">
                  <span class="fp-platform-logo">
                    <img :src="slackIcon" alt="" width="32" height="32" />
                  </span>
                  <span><strong>Slack</strong><em>Sign up with Slack</em></span>
                </button>
                <button type="button" class="fp-platform" @click="startTeamsSignup">
                  <span class="fp-platform-logo">
                    <img :src="teamsIcon" alt="" width="32" height="32" />
                  </span>
                  <span><strong>Microsoft Teams</strong><em>Sign Up with Ms teams</em></span>
                </button>
              </div>
            </div>
            <ol class="fp-collab-list" aria-label="Slack and Microsoft Teams capabilities">
              <li><span class="fp-num">01</span><div><strong>Assign vulnerabilities</strong><span class="fp-desc">Allocate findings to the responsible team directly from your collaboration channel.</span></div></li>
              <li><span class="fp-num">02</span><div><strong>Real-time notifications</strong><span class="fp-desc">Assignments, status changes and SLA alerts are delivered the moment they occur.</span></div></li>
              <li><span class="fp-num">03</span><div><strong>Task management</strong><span class="fp-desc">Manage remediation tasks alongside day-to-day work, for internal teams and external vendors alike.</span></div></li>
              <li><span class="fp-num">04</span><div><strong>Track every fix to closure</strong><span class="fp-desc">Follow each vulnerability from assignment to verified closure, with evidence logged in VAPTFIX.</span></div></li>
            </ol>
          </div>
        </div>
      </section>

      <section id="teams" class="fp-teams-band">
        <div class="fp-wrap fp-teams">
          <div class="fp-section-head">
            <div class="fp-eyebrow">Teams &amp; ownership</div>
            <h2>Every finding reaches the team built to fix it</h2>
            <p class="fp-lead">Findings are automatically routed to one of four specialized teams, removing manual triage and giving every vulnerability a clear owner. A TLS misconfiguration and an authorization flaw are handled in parallel, never in the same queue. Internal engineers and external vendors work from the same register, with role-based access enforced server-side.</p>
          </div>
          <div class="fp-group-label">Specialized teams</div>
          <div class="fp-team-grid">
            <div class="fp-team">
              <span class="fp-focus">Infrastructure focus</span>
              <h3>Network Security</h3>
              <p>SSL/TLS weaknesses, exposed ports, insecure protocols, firewall rules and perimeter controls.</p>
              <div class="fp-chips">SSL/TLS · FIREWALL · OPEN PORTS</div>
            </div>
            <div class="fp-team fp-team-patch">
              <span class="fp-focus">Lifecycle management</span>
              <h3>Patch Management</h3>
              <p>Missing security patches, outdated software and CVEs for which vendor fixes are available.</p>
              <div class="fp-chips">CVE REMEDIATION · SOFTWARE UPDATES · OS PATCHES</div>
            </div>
            <div class="fp-team fp-team-config">
              <span class="fp-focus">System configuration</span>
              <h3>Configuration Management</h3>
              <p>Misconfigurations, weak settings, insecure defaults and system and service hardening.</p>
              <div class="fp-chips">HARDENING · MISCONFIGURATIONS · DEFAULTS</div>
            </div>
            <div class="fp-team fp-team-arch">
              <span class="fp-focus">Design &amp; architecture</span>
              <h3>Architectural Flaw</h3>
              <p>Design-level weaknesses, authentication and authorization flaws, and structural risks.</p>
              <div class="fp-chips">AUTHENTICATION · DESIGN REVIEW · RBAC</div>
            </div>
          </div>

          <div class="fp-custom">
            <div>
              <div class="fp-group-label">Custom team configuration</div>
              <h3 class="fp-custom-title">Align remediation teams with your organizational structure</h3>
              <p>Retain the specialized teams, replace them, or supplement them with your own, structured by business unit, location, application or vendor.</p>
              <ol class="fp-custom-steps">
                <li><span>01</span>Define the team</li>
                <li><span>02</span>Add internal and external members</li>
                <li><span>03</span>Allocate vulnerability ownership</li>
              </ol>
            </div>
            <div class="fp-example-teams" aria-label="Example custom teams">
              <div class="fp-ex-label">EXAMPLE TEAMS</div>
              <div class="fp-ex"><strong>Finance Applications</strong><em>BY APPLICATION</em></div>
              <div class="fp-ex"><strong>Regional Data Centre</strong><em>BY LOCATION</em></div>
              <div class="fp-ex"><strong>Cloud Operations</strong><em>BY BUSINESS UNIT</em></div>
              <div class="fp-ex fp-ex-add">+ Add a Team</div>
            </div>
          </div>
        </div>
      </section>

      <section id="hybrid" class="fp-wrap fp-hybrid">
        <div class="fp-section-head">
          <div class="fp-eyebrow">Hybrid remediation delivery</div>
          <h2>Automated where possible. Guided where necessary. Verified in every case.</h2>
        </div>
        <div class="fp-hybrid-grid">
          <div class="fp-mini">
            <div class="fp-icon"><svg aria-hidden="true"><use href="#fp-i-code" /></svg></div>
            <h3>Automated remediation</h3>
            <p>Downloadable Python scripts apply fixes rapidly and consistently across all affected assets.</p>
          </div>
          <div class="fp-mini">
            <div class="fp-icon"><svg aria-hidden="true"><use href="#fp-i-list" /></svg></div>
            <h3>Guided manual remediation</h3>
            <p>Clear, human-readable steps tailored to your technology stack, for changes that require manual execution or architectural consideration.</p>
          </div>
          <div class="fp-mini">
            <div class="fp-icon"><svg aria-hidden="true"><use href="#fp-i-check" /></svg></div>
            <h3>Expert validation</h3>
            <p>Security specialists verify the effectiveness of each fix before the vulnerability is formally closed.</p>
          </div>
        </div>
      </section>

      <section id="demo" class="fp-wrap fp-cta-wrap">
        <div class="fp-cta">
          <div>
            <h2>Move from vulnerability visibility to verified closure.</h2>
            <p>Schedule a guided walkthrough of VAPTFIX with our security specialists.</p>
          </div>
          <a class="fp-btn fp-btn-white" :href="demoUrl" target="_blank" rel="noopener">
            Book a Demo
            <svg aria-hidden="true"><use href="#fp-i-arrow" /></svg>
          </a>
        </div>
      </section>
      <p class="fp-wrap fp-tm">Slack is a trademark of Slack Technologies, LLC. Microsoft Teams is a trademark of Microsoft Corporation.</p>
    </main>

    <Footer />
    <AdminSignUpModal ref="platformSignup" :show="false" @close="() => {}" />

    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="fp-i-web" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></symbol>
      <symbol id="fp-i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10.5 8.5 14 12l-3.5 3.5"/></symbol>
      <symbol id="fp-i-code" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 8-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/></symbol>
      <symbol id="fp-i-list" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r=".5" fill="currentColor"/><circle cx="4.5" cy="12" r=".5" fill="currentColor"/><circle cx="4.5" cy="18" r=".5" fill="currentColor"/></symbol>
      <symbol id="fp-i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3z"/><path d="m8.8 12 2.2 2.2 4.2-4.4"/></symbol>
    </svg>
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';
import AdminSignUpModal from '@/components/admin-component/AdminSignUpModal.vue';
import Swal from 'sweetalert2';
import teamsIcon from '@/assets/images/teams.png';
import slackIcon from '@/assets/images/slack.png';

const PAGE_TITLE = 'Features | VAPTFIX';
const PAGE_DESCRIPTION = 'VAPTFIX capabilities: a centralized vulnerability register, automated and guided remediation, SLA governance, continuous assessment, expert-validated mitigation, and vulnerability workflows inside Slack and Microsoft Teams.';

export default {
  name: 'FeaturesView',
  components: { Header, Footer, AdminSignUpModal },
  data() {
    return {
      demoUrl: 'https://bookings.cloud.microsoft/book/Bookyourdemo@secureitlabservices.com/?ismsaljsauthenabled=true',
      slackIcon,
      teamsIcon,
      activeJourney: 6,
      lifecycleSteps: [
        { num: '01', title: 'Ingest', desc: 'Import VA/VAPT reports or commission testing' },
        { num: '02', title: 'Track', desc: 'Centralized register mapped to assets' },
        { num: '03', title: 'Prioritize', desc: 'Ranked by severity and mitigation timeline' },
        { num: '04', title: 'Assign', desc: 'Automatically routed to a specialist team' },
        { num: '05', title: 'Remediate', desc: 'Automated or guided manual remediation' },
        { num: '06', title: 'Validate', desc: 'Expert-verified closure' },
        { num: '07', title: 'Govern', desc: 'SLA compliance, extensions and audit trail' },
      ],
      previousTitle: '',
      previousDescription: '',
    };
  },
  methods: {
    async preparePlatformSignup() {
      const modal = this.$refs.platformSignup;
      if (modal?.syncPlatformConnectionState) {
        await modal.syncPlatformConnectionState();
      }
      return modal;
    },
    async startSlackSignup() {
      const modal = await this.preparePlatformSignup();
      if (!modal?.startSlackLogin) return;
      if (modal.isSlackDisabled && !modal.slackConnected) {
        Swal.fire({
          icon: 'info',
          title: 'Microsoft Teams is already connected',
          text: 'Slack signup stays unavailable while Microsoft Teams is connected.',
          confirmButtonColor: '#241447',
        });
        return;
      }
      modal.startSlackLogin();
    },
    async startTeamsSignup() {
      const modal = await this.preparePlatformSignup();
      if (!modal?.startMicrosoftLogin) return;
      if (modal.isTeamsDisabled && !modal.teamsConnected) {
        Swal.fire({
          icon: 'info',
          title: 'Slack is already connected',
          text: 'Microsoft Teams signup stays unavailable while Slack is connected.',
          confirmButtonColor: '#241447',
        });
        return;
      }
      modal.startMicrosoftLogin();
    },
  },
  mounted() {
    this.previousTitle = document.title;
    document.title = PAGE_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      this.previousDescription = meta.getAttribute('content') || '';
      meta.setAttribute('content', PAGE_DESCRIPTION);
    }
  },
  beforeUnmount() {
    if (this.previousTitle) document.title = this.previousTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && this.previousDescription) meta.setAttribute('content', this.previousDescription);
  },
};
</script>

<style scoped>
.fp-root {
  --violet-950: #12102a;
  --violet-900: #1a1041;
  --violet: #241447;
  --violet-700: #2d1b4d;
  --violet-500: #513d7c;
  --lavender: #c4c0e8;
  --teal: #0f696e;
  --teal-hover: #0b5458;
  --teal-100: #ccfbf1;
  --teal-50: #e0f2f1;
  --text: #334155;
  --muted: #64748b;
  --subtle: #94a3b8;
  --rule: #e5e7eb;
  --paper: #fafbfc;
  --white: #ffffff;
  --sev-critical: #b42318;
  background: #f1f5f9;
  color: var(--text);
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}
.fp-root :is(h1, h2, h3) {
  margin: 0;
  color: var(--violet);
  font-weight: 800;
}
.fp-root h2 {
  font-size: clamp(28px, 3.4vw, 38px);
  line-height: 1.2;
  letter-spacing: -0.015em;
}
.fp-root h3 { font-weight: 700; }
.fp-root p { margin: 0; }
.fp-wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
}
.fp-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--teal);
}
.fp-section-head {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 780px;
}
.fp-lead { font-size: 17px; line-height: 1.6; color: var(--text); }

.fp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 12px 24px;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  font-size: 16px;
}
.fp-btn svg { width: 18px; height: 18px; }
.fp-btn-primary { background: var(--teal); color: var(--white); }
.fp-btn-primary:hover { background: var(--teal-hover); color: var(--white); }
.fp-btn-outline { color: var(--white); border: 1px solid var(--violet-500); }
.fp-btn-outline:hover { border-color: var(--lavender); color: var(--white); }
.fp-btn-white { background: var(--white); color: var(--teal); }
.fp-btn-white:hover { background: var(--teal-50); color: var(--teal-hover); }

.fp-hero {
  background:
    radial-gradient(circle at 88% 12%, rgba(15, 105, 110, 0.42), transparent 46%),
    linear-gradient(160deg, var(--violet-900) 0%, var(--violet) 60%, var(--violet-700) 100%);
  color: var(--white);
  padding-top: 88px;
}
.fp-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(280px, 0.85fr);
  gap: 48px;
  align-items: center;
  padding-top: 64px;
  padding-bottom: 80px;
}
.fp-hero-copy { display: flex; flex-direction: column; gap: 20px; }
.fp-hero .fp-eyebrow { color: var(--teal-100); }
.fp-hero h1 {
  color: var(--white);
  font-size: clamp(36px, 4.4vw, 54px);
  line-height: 1.08;
  letter-spacing: -0.03em;
}
.fp-hl { color: var(--teal-100); }
.fp-hero-copy p {
  font-size: 17px;
  font-weight: 500;
  line-height: 1.65;
  color: var(--lavender);
  max-width: 640px;
}
.fp-actions { display: flex; flex-wrap: wrap; gap: 12px; padding-top: 4px; }
.fp-access-card {
  background: #fff;
  color: #334155;
  border-radius: 24px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 24px 50px rgba(18, 16, 42, 0.32);
  border: 1px solid rgba(255, 255, 255, 0.55);
}
.fp-access-head { padding: 16px 16px 8px; }
.fp-access-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f696e;
}
.fp-access-list { display: flex; flex-direction: column; gap: 8px; }
.fp-access-item {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 76px;
  margin: 0;
  padding: 12px 14px;
  border: 1px solid transparent;
  border-radius: 16px;
  background: #f6f4fa;
  text-align: left;
  font-family: 'Inter', sans-serif;
  cursor: default;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
button.fp-access-item { cursor: pointer; }
button.fp-access-item:hover {
  background: #fff;
  border-color: #0f696e;
  box-shadow: 0 10px 24px rgba(15, 105, 110, 0.14);
  transform: translateY(-2px);
}
button.fp-access-item:hover .bi-arrow-right { color: #0f696e; transform: translateX(3px); }
.fp-access-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #fff;
  border: 1px solid #ebe6f3;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  color: #241447;
  box-shadow: 0 1px 2px rgba(36, 20, 71, 0.06);
}
.fp-access-icon svg { width: 22px; height: 22px; }
.fp-access-icon img { width: 26px; height: 26px; object-fit: contain; }
.fp-access-copy { min-width: 0; }
.fp-access-item strong { display: block; font-size: 16px; font-weight: 700; color: #241447; }
.fp-access-item strong + span { display: block; margin-top: 2px; font-size: 13px; font-weight: 500; color: #64748b; }
.fp-access-item .bi-arrow-right {
  margin-left: auto;
  color: #94a3b8;
  font-size: 16px;
  transition: color 0.2s, transform 0.2s;
}
.fp-access-card .fp-access-desc {
  margin: 4px 8px 10px;
  padding-top: 12px;
  border-top: 1px solid #ebe6f3;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.55;
  color: #64748b;
}

.fp-lifecycle {
  padding-top: 80px;
  padding-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.fp-journey {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(4, auto);
  grid-template-columns: 1fr 1fr;
  column-gap: 56px;
}
.fp-journey li {
  position: relative;
  padding-bottom: 26px;
}
.fp-journey-btn {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 16px;
  align-items: start;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.fp-journey-btn:hover .fp-journey-num {
  border-color: #241447;
  color: #241447;
}
.fp-journey li:not(:last-child)::after {
  content: "";
  position: absolute;
  left: 25px;
  top: 48px;
  bottom: 4px;
  width: 2px;
  background: #d9d3e8;
}
.fp-journey-num {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid #0f696e;
  background: #fff;
  color: #0f696e;
  font-weight: 700;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.fp-journey strong { display: block; font-size: 18px; font-weight: 700; color: #241447; }
.fp-journey .fp-desc { display: block; margin-top: 4px; font-size: 15px; line-height: 1.5; color: #64748b; }
.fp-journey li.is-active .fp-journey-num,
.fp-journey li.is-active .fp-journey-btn:hover .fp-journey-num {
  background: #241447;
  border-color: #241447;
  color: #ccfbf1;
}
.fp-num { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: var(--teal); }

.fp-features {
  padding-top: 72px;
  padding-bottom: 72px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.fp-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.fp-card {
  background: #fff;
  border: 1px solid #ebe6f3;
  border-left: 4px solid #0f696e;
  border-radius: 20px;
  padding: 28px 28px 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-shadow: 0 4px 6px rgba(36, 20, 71, 0.04);
}
.fp-card:nth-child(even) { border-left-color: #241447; }
.fp-tag {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
.fp-card h3 { font-size: 22px; letter-spacing: -0.01em; }
.fp-card p { font-size: 16px; line-height: 1.6; color: var(--text); }
.fp-ticks {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 15px;
  line-height: 1.5;
}
.fp-ticks li { position: relative; padding-left: 26px; }
.fp-ticks li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0.2em;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--teal-50) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%230F696E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.5 8.3l2.2 2.2 4.8-5'/%3E%3C/svg%3E") center / 16px no-repeat;
}
.fp-ticks strong { color: var(--violet); }
.fp-sev { display: flex; flex-wrap: wrap; gap: 8px; }
.fp-sev span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}
.fp-sev-c { background: #fee4e2; color: var(--sev-critical); }
.fp-sev-h { background: #fee2e2; color: #b91c1c; }
.fp-sev-m { background: #fef3c7; color: #92400e; }
.fp-sev-l { background: #d1fae5; color: #047857; }

.fp-collab { padding-top: 16px; padding-bottom: 88px; }
.fp-collab-box {
  background: var(--white);
  border: 1px solid var(--rule);
  border-radius: 14px;
  padding: 40px;
}
.fp-collab-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  align-items: start;
}
.fp-collab-intro { display: flex; flex-direction: column; gap: 16px; }
.fp-collab-quote { font-size: 18px; font-weight: 700; color: var(--teal); letter-spacing: -0.01em; }
.fp-platforms { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; }
.fp-platform {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  text-align: left;
  border: 1px solid var(--rule);
  border-radius: 12px;
  padding: 16px 18px;
  background: var(--white);
  cursor: pointer;
  font-family: inherit;
  color: inherit;
}
.fp-platform:hover { border-color: var(--violet-500); background: #fafbfc; }
.fp-platform-logo {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: var(--paper);
  border: 1px solid var(--rule);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
}
.fp-platform-logo img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.fp-platform strong { display: block; font-size: 17px; font-weight: 700; color: var(--violet); }
.fp-platform em {
  display: block;
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--teal);
  margin-top: 2px;
}
.fp-collab-list {
  margin: 0;
  padding: 22px 22px 6px;
  list-style: none;
  display: flex;
  flex-direction: column;
  background: #f6f4fa;
  border: 1px solid #ebe6f3;
  border-radius: 20px;
}
.fp-collab-list li {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 14px;
  align-items: start;
  padding: 0 0 18px;
  position: relative;
}
.fp-collab-list li:not(:last-child)::before {
  content: "";
  position: absolute;
  left: 20px;
  top: 34px;
  bottom: 0;
  width: 2px;
  background: #d9d3e8;
}
.fp-collab-list .fp-num {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #241447;
  color: #ccfbf1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}
.fp-collab-list strong { display: block; font-size: 16px; font-weight: 700; color: #241447; margin-bottom: 4px; }
.fp-collab-list .fp-desc { font-size: 14px; line-height: 1.55; color: #64748b; }

.fp-teams-band { background: linear-gradient(180deg, var(--violet-900), var(--violet)); }
.fp-teams {
  padding-top: 88px;
  padding-bottom: 88px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}
.fp-teams .fp-eyebrow,
.fp-teams .fp-group-label { color: var(--lavender); }
.fp-teams h2 { color: var(--white); }
.fp-teams .fp-lead { color: var(--lavender); }
.fp-group-label {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.fp-team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
.fp-team {
  background: var(--white);
  border: 1px solid var(--rule);
  border-top: 4px solid var(--team-network-color);
  border-radius: 14px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}
.fp-team:hover {
  background: var(--team-network-bg);
  border-color: var(--team-network-color);
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.22);
  transform: translateY(-4px);
}
.fp-team-patch { border-top-color: var(--team-patch-color); }
.fp-team-config { border-top-color: var(--team-configuration-color); }
.fp-team-arch { border-top-color: var(--team-architectural-color); }
.fp-team-patch:hover {
  background: var(--team-patch-bg);
  border-color: var(--team-patch-color);
  box-shadow: 0 12px 28px rgba(91, 33, 182, 0.22);
}
.fp-team-config:hover {
  background: var(--team-configuration-bg);
  border-color: var(--team-configuration-color);
  box-shadow: 0 12px 28px rgba(6, 182, 212, 0.22);
}
.fp-team-arch:hover {
  background: var(--team-architectural-bg);
  border-color: var(--team-architectural-color);
  box-shadow: 0 12px 28px rgba(192, 38, 211, 0.22);
}
.fp-focus {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--team-network-color);
}
.fp-team-patch .fp-focus,
.fp-team-patch .fp-chips { color: var(--team-patch-color); }
.fp-team-config .fp-focus,
.fp-team-config .fp-chips { color: var(--team-configuration-color); }
.fp-team-arch .fp-focus,
.fp-team-arch .fp-chips { color: var(--team-architectural-color); }
.fp-team h3 { font-size: 19px; color: var(--violet); }
.fp-team p { font-size: 15px; line-height: 1.6; color: var(--text); }
.fp-chips {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--team-network-color);
  line-height: 1.8;
}
.fp-custom {
  border: 1px solid var(--violet-500);
  background: var(--violet-950);
  border-radius: 14px;
  padding: 36px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  align-items: center;
}
.fp-root h3.fp-custom-title {
  margin-top: 10px;
  font-size: 26px;
  line-height: 1.25;
  color: #ffffff;
}
.fp-custom > div > p {
  font-size: 16px;
  line-height: 1.6;
  color: var(--lavender);
  margin-top: 12px;
}
.fp-custom-steps {
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fp-custom-steps li {
  display: flex;
  gap: 12px;
  align-items: baseline;
  font-size: 15px;
  color: var(--white);
}
.fp-custom-steps li span {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--teal-100);
}
.fp-example-teams { display: flex; flex-direction: column; gap: 10px; }
.fp-ex-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: 4px;
}
.fp-ex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: var(--violet);
  border: 1px solid var(--violet-700);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 15px;
  color: var(--white);
}
.fp-ex strong { font-weight: 600; }
.fp-ex em { font-style: normal; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; color: var(--lavender); }
.fp-ex-add {
  border-style: dashed;
  border-color: var(--violet-500);
  color: var(--teal-100);
  justify-content: flex-start;
  background: transparent;
}

.fp-hybrid {
  padding-top: 88px;
  padding-bottom: 88px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.fp-hybrid-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.fp-mini {
  background: var(--white);
  border: 1px solid var(--rule);
  border-radius: 14px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fp-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--teal-50);
  color: var(--teal);
  display: flex;
  align-items: center;
  justify-content: center;
}
.fp-icon svg { width: 22px; height: 22px; }
.fp-mini h3 { font-size: 19px; }
.fp-mini p { font-size: 15px; line-height: 1.6; }

.fp-cta-wrap { padding-bottom: 28px; }
.fp-cta {
  background: var(--teal);
  color: var(--white);
  border-radius: 14px;
  padding: 56px 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
}
.fp-cta h2 { font-size: clamp(26px, 3vw, 34px); color: var(--white); }
.fp-cta p { font-size: 17px; line-height: 1.6; margin-top: 10px; color: var(--teal-50); }
.fp-cta > div { max-width: 640px; }
.fp-tm { font-size: 12px; color: var(--muted); padding-bottom: 24px; }
.fp-root section[id] { scroll-margin-top: 96px; }

@media (min-width: 801px) {
  .fp-journey li:nth-child(4)::after { display: none; }
}
@media (max-width: 900px) {
  .fp-grid { grid-template-columns: 1fr; }
}
@media (max-width: 800px) {
  .fp-journey {
    grid-auto-flow: row;
    grid-template-rows: none;
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .fp-card, .fp-collab-box { padding: 24px; }
  .fp-cta { padding: 40px 24px; }
  .fp-hero-grid { grid-template-columns: 1fr; padding-top: 40px; padding-bottom: 56px; }
}
</style>
