<template>
  <div class="legal-page-root">
    <Header />

    <div class="legal-page-frame">
      <div class="ld-page">
        <aside class="ld-sidebar">
          <div class="ld-sidebar-label">On this page</div>
          <nav @click="onTocNavClick">
            <a
              v-for="item in tocItems"
              :key="item.href"
              :href="item.href"
              :class="{ 'is-active': activeTocHash === item.href }"
            >{{ item.label }}</a>
          </nav>
        </aside>

        <main class="ld-content">
          <div class="ld-doc-header">
            <div class="ld-doc-tag">Security</div>
            <h1 class="ld-doc-title">Security Statement</h1>
            <p class="ld-doc-meta">
              <strong>Last Updated:</strong> May 12, 2026 &nbsp;|&nbsp;
              <strong>Review Cycle:</strong> Annual &nbsp;|&nbsp;
              <strong>Version:</strong> 1.0
            </p>
          </div>

          <div class="ld-callout">
            <p>
              At VaptFix.ai, security is not an afterthought — it's our core business. We hold ourselves to the same
              rigorous standards we help our customers achieve. This statement describes the technical and organizational
              measures we implement to protect customer data and platform integrity.
            </p>
          </div>

          <section id="overview">
            <div class="ld-section-number">01 / OVERVIEW</div>
            <h2>Security Philosophy</h2>
            <p>
              VaptFix.ai operates a defense-in-depth security program that covers our infrastructure, application layer,
              personnel, and vendor ecosystem. We apply a continuous improvement model — every vulnerability we help
              customers find on their systems, we look for on ours.
            </p>
            <p>
              Our security program is built on three principles: <strong>least privilege access</strong>,
              <strong>continuous verification</strong>, and <strong>transparent accountability</strong>.
            </p>
          </section>

          <section id="certifications">
            <div class="ld-section-number">02 / CERTIFICATIONS</div>
            <h2>Certifications &amp; Compliance</h2>
            <div class="ld-badge-grid">
              <div class="ld-badge-card">
                <div class="ld-badge-icon" aria-hidden="true">🔐</div>
                <div class="ld-badge-title">SOC 2 Type II</div>
                <div class="ld-badge-sub">Annual audit — Security, Availability, Confidentiality</div>
              </div>
              <div class="ld-badge-card">
                <div class="ld-badge-icon" aria-hidden="true">💳</div>
                <div class="ld-badge-title">PCI DSS</div>
                <div class="ld-badge-sub">Level 1 compliant payment processing</div>
              </div>
              <div class="ld-badge-card">
                <div class="ld-badge-icon" aria-hidden="true">🇪🇺</div>
                <div class="ld-badge-title">GDPR</div>
                <div class="ld-badge-sub">Full compliance with EU data protection regulation</div>
              </div>
              <div class="ld-badge-card">
                <div class="ld-badge-icon" aria-hidden="true">🏥</div>
                <div class="ld-badge-title">HIPAA Ready</div>
                <div class="ld-badge-sub">BAA available for healthcare customers</div>
              </div>
              <div class="ld-badge-card">
                <div class="ld-badge-icon" aria-hidden="true">🌐</div>
                <div class="ld-badge-title">ISO 27001</div>
                <div class="ld-badge-sub">Information security management system — in progress</div>
              </div>
              <div class="ld-badge-card">
                <div class="ld-badge-icon" aria-hidden="true">🇺🇸</div>
                <div class="ld-badge-title">CCPA</div>
                <div class="ld-badge-sub">California Consumer Privacy Act compliant</div>
              </div>
            </div>
          </section>

          <section id="infrastructure">
            <div class="ld-section-number">03 / INFRASTRUCTURE</div>
            <h2>Infrastructure Security</h2>

            <h3>Cloud Environment</h3>
            <p>
              VaptFix.ai is hosted on AWS (primary) with GCP as a secondary region for redundancy. All infrastructure is
              managed as code using Terraform with version-controlled, audited change management. We maintain full
              environmental separation between production, staging, and development.
            </p>

            <h3>Network Security</h3>
            <ul>
              <li>All production systems operate within private VPCs with no direct internet exposure</li>
              <li>Web Application Firewall (WAF) with managed rulesets and DDoS protection via AWS Shield Advanced</li>
              <li>Network segmentation with security groups enforcing least-privilege traffic rules</li>
              <li>Intrusion detection and prevention systems (IDS/IPS) on all ingress/egress paths</li>
              <li>Egress traffic filtering to prevent data exfiltration from scan infrastructure</li>
            </ul>

            <h3>Physical Security</h3>
            <p>
              All data center facilities are SOC 2 and ISO 27001 certified with 24/7 physical security, biometric access
              controls, surveillance systems, and environmental monitoring. We do not maintain any physical on-premises
              infrastructure.
            </p>
          </section>

          <section id="encryption">
            <div class="ld-section-number">04 / ENCRYPTION</div>
            <h2>Encryption</h2>
            <ul>
              <li>
                <strong>Data at Rest:</strong> AES-256 encryption for all stored data using AWS KMS with customer-managed
                keys available on Enterprise plans
              </li>
              <li>
                <strong>Data in Transit:</strong> TLS 1.3 enforced for all API communications and web traffic; TLS 1.2
                minimum for all connections; older protocols disabled
              </li>
              <li>
                <strong>Database Encryption:</strong> Transparent data encryption enabled on all databases with encrypted
                backups
              </li>
              <li>
                <strong>Key Management:</strong> Hardware Security Modules (HSMs) used for cryptographic operations;
                automatic key rotation on 90-day cycles
              </li>
              <li>
                <strong>Credentials:</strong> Passwords stored using bcrypt (cost factor ≥12); API keys stored as salted
                SHA-256 hashes
              </li>
              <li>
                <strong>Scan Data:</strong> Vulnerability findings and scan results are encrypted at rest and logically
                isolated per customer
              </li>
            </ul>
          </section>

          <section id="access">
            <div class="ld-section-number">05 / ACCESS CONTROL</div>
            <h2>Access Control</h2>

            <h3>Workforce Access</h3>
            <ul>
              <li>All employee access follows the principle of least privilege and is provisioned through role-based access control (RBAC)</li>
              <li>Multi-factor authentication (MFA) mandatory for all internal systems</li>
              <li>Production access restricted to on-call engineers via just-in-time (JIT) provisioning with full audit logging</li>
              <li>Background checks conducted for all employees with access to production systems</li>
              <li>Access reviews performed quarterly; access de-provisioned within 24 hours of offboarding</li>
            </ul>

            <h3>Customer Access</h3>
            <ul>
              <li>SAML 2.0 / OIDC SSO integration supported</li>
              <li>TOTP-based MFA enforced by default; FIDO2 hardware keys supported</li>
              <li>Granular role-based permissions (Admin, Analyst, Viewer) per workspace</li>
              <li>IP allowlisting and API key scoping available on all paid plans</li>
              <li>Session management with configurable timeout and concurrent session limits</li>
            </ul>
          </section>

          <section id="application">
            <div class="ld-section-number">06 / APPLICATION SECURITY</div>
            <h2>Application Security</h2>
            <ul>
              <li>Secure SDLC with mandatory security review for all code changes</li>
              <li>Static application security testing (SAST) integrated into CI/CD pipeline</li>
              <li>Dynamic application security testing (DAST) run against all production deployments</li>
              <li>Software composition analysis (SCA) for third-party dependency vulnerability tracking</li>
              <li>Secret scanning and prevention of credential commits in all repositories</li>
              <li>Container image scanning (Trivy, ECR Inspector) before every deployment</li>
              <li>OWASP Top 10 and SANS 25 addressed in our development standards</li>
              <li>Security training for all engineers conducted annually with monthly security briefings</li>
            </ul>
          </section>

          <section id="monitoring">
            <div class="ld-section-number">07 / MONITORING</div>
            <h2>Monitoring &amp; Logging</h2>
            <ul>
              <li>24/7 Security Operations Center (SOC) with automated alerting on anomalous events</li>
              <li>Centralized SIEM with immutable audit logs for all infrastructure and application events</li>
              <li>User activity logging for all authentication events, API calls, and scan operations</li>
              <li>Real-time threat intelligence feeds integrated for known-bad IP and indicator detection</li>
              <li>Log retention: 12 months hot, 24 months cold storage; tamper-evident integrity controls</li>
              <li>
                Uptime monitoring with public status page at
                <a href="https://status.vaptfix.ai" target="_blank" rel="noopener noreferrer">status.vaptfix.ai</a>
              </li>
            </ul>
          </section>

          <section id="incident">
            <div class="ld-section-number">08 / INCIDENT RESPONSE</div>
            <h2>Incident Response</h2>
            <p>
              We maintain a documented Incident Response Plan (IRP) tested via tabletop exercises biannually. Our response
              process follows industry-standard phases:
            </p>
            <div class="ld-timeline">
              <div class="ld-timeline-item">
                <div class="ld-timeline-step">PHASE 1 — DETECT</div>
                <div class="ld-timeline-desc">
                  Automated detection via SIEM, SOC alerts, or responsible disclosure. Target detection time:
                  &lt; 15 minutes for critical events.
                </div>
              </div>
              <div class="ld-timeline-item">
                <div class="ld-timeline-step">PHASE 2 — CONTAIN</div>
                <div class="ld-timeline-desc">
                  Immediate isolation of affected systems. Escalation to security lead and executive team within 30 minutes.
                </div>
              </div>
              <div class="ld-timeline-item">
                <div class="ld-timeline-step">PHASE 3 — INVESTIGATE</div>
                <div class="ld-timeline-desc">
                  Forensic investigation, scope determination, root cause analysis. Preliminary report within 4 hours.
                </div>
              </div>
              <div class="ld-timeline-item">
                <div class="ld-timeline-step">PHASE 4 — NOTIFY</div>
                <div class="ld-timeline-desc">
                  Affected customers notified within 24–72 hours per contractual and legal requirements. Regulatory notification where applicable.
                </div>
              </div>
              <div class="ld-timeline-item">
                <div class="ld-timeline-step">PHASE 5 — REMEDIATE</div>
                <div class="ld-timeline-desc">
                  System remediation, patch deployment, post-incident review, and process improvement.
                </div>
              </div>
            </div>
          </section>

          <section id="vendor">
            <div class="ld-section-number">09 / VENDOR MANAGEMENT</div>
            <h2>Vendor &amp; Supply Chain Security</h2>
            <p>
              All third-party vendors with access to customer data undergo security assessment before onboarding, including
              review of their SOC 2 reports, security questionnaires, and DPA execution. Vendor access is monitored and
              reviewed annually. We maintain a current list of sub-processors in our
              <router-link to="/dpa">DPA</router-link>.
            </p>
          </section>

          <section id="bcp">
            <div class="ld-section-number">10 / BUSINESS CONTINUITY</div>
            <h2>Business Continuity &amp; Disaster Recovery</h2>
            <ul>
              <li><strong>RTO (Recovery Time Objective):</strong> &lt; 4 hours for critical services</li>
              <li><strong>RPO (Recovery Point Objective):</strong> &lt; 1 hour data loss maximum</li>
              <li>Daily encrypted backups with weekly full snapshots; 90-day retention</li>
              <li>Multi-region replication for active-active redundancy on Enterprise plans</li>
              <li>DR tests conducted quarterly; results shared with Enterprise customers on request</li>
            </ul>
          </section>

          <section id="pentest">
            <div class="ld-section-number">11 / PENETRATION TESTING</div>
            <h2>Our Own Security Testing</h2>
            <p>
              We engage independent, third-party penetration testing firms to assess our platform annually. Results are
              reviewed by our security team and remediated based on severity:
            </p>
            <ul>
              <li><strong>Critical / High:</strong> Remediation within 7 days</li>
              <li><strong>Medium:</strong> Remediation within 30 days</li>
              <li><strong>Low / Informational:</strong> Remediation within 90 days</li>
            </ul>
            <p>Penetration test summary reports are available to Enterprise customers under NDA upon request.</p>
          </section>

          <section id="disclosure">
            <div class="ld-section-number">12 / RESPONSIBLE DISCLOSURE</div>
            <h2>Responsible Disclosure Program</h2>
            <p>
              We welcome responsible disclosure of security vulnerabilities. If you discover a potential security issue in
              VaptFix.ai, please report it to us privately before public disclosure.
            </p>
            <div class="ld-callout">
              <p><strong>Report vulnerabilities to:</strong> <a href="mailto:security@vaptfix.ai">security@vaptfix.ai</a></p>
              <p>
                PGP Key: Available at
                <a href="https://vaptfix.ai/.well-known/security.txt" target="_blank" rel="noopener noreferrer">vaptfix.ai/.well-known/security.txt</a>
              </p>
              <p>
                We commit to: acknowledging receipt within 24 hours, providing status updates every 5 business days, and
                not pursuing legal action against good-faith researchers following our disclosure guidelines.
              </p>
            </div>
          </section>

          <section id="contact">
            <div class="ld-section-number">13 / CONTACT</div>
            <h2>Security Contact</h2>
            <div class="ld-callout">
              <p>
                <strong>VaptFix.ai Security Team</strong><br />
                Security issues: <a href="mailto:security@vaptfix.ai">security@vaptfix.ai</a><br />
                General inquiries: <a href="mailto:hello@vaptfix.ai">hello@vaptfix.ai</a><br />
                Status page:
                <a href="https://status.vaptfix.ai" target="_blank" rel="noopener noreferrer">status.vaptfix.ai</a>
              </p>
            </div>
          </section>

          <LegalDocInnerFooter />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import LegalDocInnerFooter from '@/components/admin-component/LegalDocInnerFooter.vue';

export default {
  name: 'SecurityStatementView',
  components: {
    Header,
    LegalDocInnerFooter,
  },
  data() {
    return {
      activeTocHash: '',
      tocItems: [
        { href: '#overview', label: 'Overview' },
        { href: '#certifications', label: 'Certifications' },
        { href: '#infrastructure', label: 'Infrastructure' },
        { href: '#encryption', label: 'Encryption' },
        { href: '#access', label: 'Access Control' },
        { href: '#application', label: 'Application Security' },
        { href: '#monitoring', label: 'Monitoring' },
        { href: '#incident', label: 'Incident Response' },
        { href: '#vendor', label: 'Vendor Management' },
        { href: '#bcp', label: 'Business Continuity' },
        { href: '#pentest', label: 'Penetration Testing' },
        { href: '#disclosure', label: 'Responsible Disclosure' },
        { href: '#contact', label: 'Security Contact' },
      ],
    };
  },
  watch: {
    '$route.hash'() {
      this.$nextTick(() => this.syncTocFromRoute());
    },
  },
  mounted() {
    document.documentElement.classList.add('legal-doc-sticky-context');
    this.$nextTick(() => this.syncTocFromRoute());
  },
  beforeUnmount() {
    document.documentElement.classList.remove('legal-doc-sticky-context');
  },
  methods: {
    syncTocFromRoute() {
      const hashes = this.tocItems.map((i) => i.href);
      const h = this.$route.hash;
      if (h && hashes.includes(h)) this.activeTocHash = h;
      else this.activeTocHash = hashes[0] || '';
    },
    onTocNavClick(e) {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || !e.currentTarget.contains(a)) return;
      const href = a.getAttribute('href');
      if (href) this.activeTocHash = href;
    },
  },
};
</script>

<style scoped>
/* Same shell as Privacy / Terms */
.legal-page-root {
  min-height: 100vh;
  padding-top: 72px;
  padding-bottom: 24px;
  padding-left: clamp(10px, 3vw, 24px);
  padding-right: clamp(10px, 3vw, 24px);
  background: #e8ecf1;
  box-sizing: border-box;
}

.legal-page-frame {
  width: 100%;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(20px, 4vw, 40px);
  padding-right: clamp(20px, 4vw, 40px);
  padding-bottom: 2rem;
  box-sizing: border-box;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  border-radius: 12px;
  border: 1px solid rgba(36, 20, 71, 0.06);
  box-shadow: 0 4px 24px rgba(36, 20, 71, 0.06);
  min-height: calc(100vh - 72px - 24px);
  overflow: visible;
}

.ld-page {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 3.25rem 0 0;
  gap: 3rem;
}

.ld-sidebar {
  width: 220px;
  flex-shrink: 0;
  align-self: flex-start;
  position: sticky;
  top: 72px;
  z-index: 1015;
  max-height: calc(100vh - 88px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 0.5rem;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
}

.ld-sidebar-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.ld-sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ld-sidebar nav a {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  padding: 6px 10px;
  border-radius: 6px;
  border-left: 2px solid transparent;
  transition: all 0.2s;
  line-height: 1.4;
  text-decoration: none;
}

.ld-sidebar nav a:hover,
.ld-sidebar nav a.is-active {
  color: #0f696e;
  background: rgba(15, 105, 110, 0.08);
  border-left-color: #0f696e;
  text-decoration: none;
}

.ld-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 0;
}

.ld-doc-header {
  position: sticky;
  top: 72px;
  z-index: 1020;
  margin-bottom: 2.5rem;
  padding-top: 0.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.15);
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  box-shadow: 0 8px 16px -8px rgba(36, 20, 71, 0.08);
}

.ld-content > .ld-callout,
.ld-content > section,
.ld-content > .legal-doc-inner-footer {
  position: relative;
  z-index: 1;
}

.ld-doc-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.1);
  border: 1px solid rgba(15, 105, 110, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.ld-doc-tag::before {
  content: '●';
  font-size: 7px;
}

.ld-doc-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.ld-doc-meta {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
  line-height: 1.6;
}

.ld-doc-meta strong {
  color: #241447;
  font-weight: 600;
}

section {
  margin-bottom: 3rem;
}

.ld-section-number {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.ld-content h2 {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 800;
  line-height: 1.25;
  color: #241447;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.15);
}

.ld-content h3 {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
  margin: 1.25rem 0 0.5rem;
  letter-spacing: normal;
}

.ld-content p {
  font-family: 'Inter', sans-serif;
  color: #49454f;
  margin-bottom: 0.75rem;
  font-weight: 400;
  line-height: 1.65;
  font-size: 15px;
}

.ld-content ul {
  padding-left: 1.25rem;
  margin-bottom: 0.75rem;
}

.ld-content li {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #49454f;
  margin-bottom: 0.4rem;
  font-weight: 400;
  line-height: 1.65;
}

.ld-content li::marker {
  color: #0f696e;
}

.ld-content a {
  color: #0f696e;
  text-decoration: none;
  font-weight: 500;
}

.ld-content a:hover {
  text-decoration: underline;
}

.ld-callout {
  background: #f6f4fa;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-left: 3px solid #0f696e;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin: 1.5rem 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.65;
}

.ld-callout p {
  margin: 0;
  color: #49454f;
  line-height: 1.65;
}

.ld-callout p + p {
  margin-top: 0.75rem;
}

/* Certification cards */
.ld-badge-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.ld-badge-card {
  background: #f6f4fa;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.ld-badge-card:hover {
  border-color: rgba(15, 105, 110, 0.28);
  box-shadow: 0 4px 14px rgba(36, 20, 71, 0.06);
}

.ld-badge-icon {
  font-size: 20px;
  line-height: 1;
}

.ld-badge-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
}

.ld-badge-sub {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #49454f;
  font-weight: 400;
  line-height: 1.65;
}

/* Incident timeline */
.ld-timeline {
  border-left: 2px solid rgba(15, 105, 110, 0.2);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}

.ld-timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
}

.ld-timeline-item:last-child {
  margin-bottom: 0;
}

.ld-timeline-item::before {
  content: '';
  position: absolute;
  left: -1.65rem;
  top: 6px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #0f696e;
  box-shadow: 0 0 0 3px rgba(15, 105, 110, 0.15);
}

.ld-timeline-step {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  margin-bottom: 0.25rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ld-timeline-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #49454f;
  font-weight: 400;
  line-height: 1.65;
}

@media (min-width: 769px) {
  .legal-page-root {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .legal-page-frame {
    flex: 1 1 auto;
    min-height: 0;
    max-height: none;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ld-page {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
  }

  .ld-sidebar {
    position: static;
    align-self: stretch;
    max-height: none;
    overflow-y: auto;
  }

  .ld-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .ld-doc-header {
    top: 0;
  }
}

@media (max-width: 768px) {
  .legal-page-root {
    height: auto;
    overflow: visible;
    display: block;
  }

  .legal-page-frame {
    flex: none;
    overflow: visible;
    display: block;
  }

  .ld-page {
    flex-direction: column;
    flex: none;
    overflow: visible;
    min-height: 0;
    padding: 1.75rem 0 2.5rem;
  }

  .ld-content {
    overflow: visible;
  }

  .ld-sidebar {
    width: 100%;
    position: static;
    max-height: none;
  }
}
</style>
