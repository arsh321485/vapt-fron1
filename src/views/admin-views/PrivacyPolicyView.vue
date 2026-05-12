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
          <div class="ld-doc-tag">Legal Document</div>
          <h1 class="ld-doc-title">Privacy Policy</h1>
          <p class="ld-doc-meta">
            <strong>Effective Date:</strong> May 12, 2026 &nbsp;|&nbsp;
            <strong>Last Updated:</strong> May 12, 2026 &nbsp;|&nbsp;
            <strong>Version:</strong> 1.0
          </p>
        </div>

        <div class="ld-callout">
          <p>
            This Privacy Policy explains how <strong>VaptFix.ai</strong> ("we," "our," or "us") collects, uses,
            discloses, and safeguards your information when you use our vulnerability assessment and penetration
            testing platform. Please read this policy carefully. If you disagree with its terms, please discontinue
            use of our services.
          </p>
        </div>

        <section id="overview">
          <div class="ld-section-number">01 / OVERVIEW</div>
          <h2>Who We Are</h2>
          <p>
            VaptFix.ai is a cybersecurity platform that provides automated vulnerability assessment and penetration
            testing (VAPT) services, security scanning, reporting, and remediation guidance to businesses and security
            professionals worldwide.
          </p>
          <p>
            For the purposes of data protection laws, VaptFix.ai acts as a <strong>data controller</strong> for your
            account and usage data, and as a <strong>data processor</strong> when processing data on behalf of enterprise
            customers under a Data Processing Agreement (DPA).
          </p>
        </section>

        <section id="data-collected">
          <div class="ld-section-number">02 / DATA COLLECTED</div>
          <h2>Data We Collect</h2>

          <h3>Account &amp; Identity Data</h3>
          <ul>
            <li>Full name, email address, job title, and company name</li>
            <li>Billing address and payment information (processed via PCI-compliant payment processors)</li>
            <li>Authentication credentials (passwords stored in hashed form only)</li>
            <li>Profile preferences and notification settings</li>
          </ul>

          <h3>Usage &amp; Technical Data</h3>
          <ul>
            <li>IP addresses, browser type and version, operating system</li>
            <li>Pages visited, features used, and session duration</li>
            <li>API request logs, error logs, and diagnostic data</li>
            <li>Device identifiers and geolocation data (city/country level)</li>
          </ul>

          <h3>Scan &amp; Assessment Data</h3>
          <ul>
            <li>Target URLs, IP ranges, and domain names submitted for scanning</li>
            <li>Vulnerability findings, severity ratings, and remediation status</li>
            <li>Scan configurations, schedules, and historical results</li>
            <li>Security reports generated through the platform</li>
          </ul>

          <h3>Communications Data</h3>
          <ul>
            <li>Support tickets, chat messages, and email correspondence</li>
            <li>Survey responses and feedback submissions</li>
            <li>Webinar registrations and event participation records</li>
          </ul>
        </section>

        <section id="how-we-use">
          <div class="ld-section-number">03 / HOW WE USE DATA</div>
          <h2>How We Use Your Data</h2>
          <table class="ld-data-table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Data Used</th>
                <th>Legal Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Service delivery and account management</td>
                <td>Account, usage, scan data</td>
                <td>Contract performance</td>
              </tr>
              <tr>
                <td>Security scanning and vulnerability analysis</td>
                <td>Target data, scan configurations</td>
                <td>Contract performance</td>
              </tr>
              <tr>
                <td>Billing and payment processing</td>
                <td>Account, billing data</td>
                <td>Contract performance</td>
              </tr>
              <tr>
                <td>Product improvement and analytics</td>
                <td>Anonymized usage data</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Security monitoring and fraud prevention</td>
                <td>Technical, usage data</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Marketing communications</td>
                <td>Account, usage data</td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>Legal compliance</td>
                <td>All relevant data</td>
                <td>Legal obligation</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="legal-basis">
          <div class="ld-section-number">04 / LEGAL BASIS</div>
          <h2>Legal Basis for Processing (GDPR)</h2>
          <p>
            For users in the European Economic Area (EEA), United Kingdom, and Switzerland, we process personal data
            under the following legal bases:
          </p>
          <ul>
            <li>
              <strong>Contractual Necessity:</strong> Processing required to deliver our services under our Terms of
              Service
            </li>
            <li>
              <strong>Legitimate Interests:</strong> Fraud prevention, security monitoring, product analytics, and
              business operations
            </li>
            <li><strong>Legal Obligation:</strong> Compliance with applicable laws, regulations, and court orders</li>
            <li><strong>Consent:</strong> Marketing communications and non-essential cookies (withdrawable at any time)</li>
          </ul>
        </section>

        <section id="sharing">
          <div class="ld-section-number">05 / SHARING</div>
          <h2>Data Sharing &amp; Disclosure</h2>
          <p>We do not sell, rent, or trade your personal data. We may share data only in the following circumstances:</p>

          <h3>Service Providers</h3>
          <p>
            We engage trusted third-party processors including cloud infrastructure providers, payment processors, email
            service providers, and analytics platforms. All processors are bound by Data Processing Agreements (DPAs) and
            are prohibited from using your data for any purpose other than providing services to us.
          </p>

          <h3>Business Transfers</h3>
          <p>
            In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that
            transaction. We will notify you via email and/or prominent notice on our platform prior to any such transfer.
          </p>

          <h3>Legal Requirements</h3>
          <p>
            We may disclose data when required by law, court order, subpoena, or government request, or when we believe
            disclosure is necessary to protect rights, property, or safety.
          </p>

          <h3>With Your Consent</h3>
          <p>We may share data for any other purpose with your explicit prior consent.</p>
        </section>

        <section id="retention">
          <div class="ld-section-number">06 / RETENTION</div>
          <h2>Data Retention</h2>
          <table class="ld-data-table">
            <thead>
              <tr>
                <th>Data Category</th>
                <th>Retention Period</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Account and profile data</td>
                <td>Duration of account + 30 days post-deletion</td>
              </tr>
              <tr>
                <td>Scan results and reports</td>
                <td>2 years from generation (configurable per plan)</td>
              </tr>
              <tr>
                <td>Billing records</td>
                <td>7 years (tax and legal compliance)</td>
              </tr>
              <tr>
                <td>Security and access logs</td>
                <td>12 months</td>
              </tr>
              <tr>
                <td>Support communications</td>
                <td>3 years</td>
              </tr>
              <tr>
                <td>Marketing preferences</td>
                <td>Until opt-out or account deletion</td>
              </tr>
            </tbody>
          </table>
          <p>
            After the applicable retention period, data is securely deleted or anonymized in accordance with our data
            destruction policy.
          </p>
        </section>

        <section id="your-rights">
          <div class="ld-section-number">07 / YOUR RIGHTS</div>
          <h2>Your Privacy Rights</h2>
          <p>Depending on your jurisdiction, you may have the following rights:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Erasure:</strong> Request deletion of your data (subject to legal retention obligations)</li>
            <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
            <li><strong>Restriction:</strong> Request that we limit processing of your data</li>
            <li>
              <strong>Objection:</strong> Object to processing based on legitimate interests or for direct marketing
            </li>
            <li>
              <strong>Withdraw Consent:</strong> Withdraw consent at any time without affecting lawfulness of prior
              processing
            </li>
            <li><strong>Lodge a Complaint:</strong> File a complaint with your local data protection authority</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at
            <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. We will respond within 30 days.
          </p>
        </section>

        <section id="cookies">
          <div class="ld-section-number">08 / COOKIES</div>
          <h2>Cookies &amp; Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies for authentication, security, analytics, and personalization. You
            may manage cookie preferences through our Cookie Consent Manager or your browser settings.
          </p>
          <table class="ld-data-table">
            <thead>
              <tr>
                <th>Cookie Type</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Essential</td>
                <td>Authentication, session management, security</td>
                <td>Session / up to 1 year</td>
              </tr>
              <tr>
                <td>Functional</td>
                <td>User preferences and settings</td>
                <td>Up to 1 year</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Platform usage and performance monitoring</td>
                <td>Up to 2 years</td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td>Targeted advertising and retargeting (consent-only)</td>
                <td>Up to 1 year</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="security">
          <div class="ld-section-number">09 / SECURITY</div>
          <h2>Data Security</h2>
          <p>We implement industry-leading security measures including:</p>
          <ul>
            <li>AES-256 encryption for data at rest; TLS 1.3 for data in transit</li>
            <li>Multi-factor authentication (MFA) and role-based access control (RBAC)</li>
            <li>Annual third-party penetration testing and continuous automated scanning</li>
            <li>SOC 2 Type II audited infrastructure</li>
            <li>24/7 security monitoring and incident response</li>
          </ul>
          <p>
            In the event of a data breach affecting your data, we will notify you and relevant regulators within 72
            hours as required by applicable law. See our
            <router-link to="/security">Security Statement</router-link> for full details.
          </p>
        </section>

        <section id="children">
          <div class="ld-section-number">10 / CHILDREN</div>
          <h2>Children's Privacy</h2>
          <p>
            VaptFix.ai services are not directed to individuals under the age of 16. We do not knowingly collect
            personal data from children. If you believe a child has provided us with personal data, please contact us
            immediately at <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a> and we will promptly delete such
            information.
          </p>
        </section>

        <section id="international">
          <div class="ld-section-number">11 / INTERNATIONAL</div>
          <h2>International Data Transfers</h2>
          <p>
            VaptFix.ai operates globally. Your data may be transferred to and processed in countries outside your home
            jurisdiction, including the United States. We implement appropriate safeguards for such transfers, including:
          </p>
          <ul>
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>EU-U.S. Data Privacy Framework where applicable</li>
            <li>Binding Corporate Rules for intra-group transfers</li>
          </ul>
        </section>

        <section id="changes">
          <div class="ld-section-number">12 / CHANGES</div>
          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy periodically. We will notify you of material changes via email or
            prominent notice on the platform at least 30 days before changes take effect. Continued use of the service
            after the effective date constitutes acceptance of the updated policy.
          </p>
        </section>

        <section id="contact">
          <div class="ld-section-number">13 / CONTACT</div>
          <h2>Contact Us</h2>
          <p>For privacy-related inquiries, data subject requests, or to contact our Data Protection Officer:</p>
          <div class="ld-callout">
            <p>
              <strong>VaptFix.ai — Privacy Team</strong><br />
              Email: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a><br />
              DPO: <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a><br />
              Response time: within 30 days of receipt
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
  name: 'PrivacyPolicyView',
  components: {
    Header,
    LegalDocInnerFooter,
  },
  data() {
    return {
      activeTocHash: '',
      tocItems: [
        { href: '#overview', label: 'Overview' },
        { href: '#data-collected', label: 'Data We Collect' },
        { href: '#how-we-use', label: 'How We Use Data' },
        { href: '#legal-basis', label: 'Legal Basis' },
        { href: '#sharing', label: 'Data Sharing' },
        { href: '#retention', label: 'Retention' },
        { href: '#your-rights', label: 'Your Rights' },
        { href: '#cookies', label: 'Cookies' },
        { href: '#security', label: 'Security' },
        { href: '#children', label: 'Children' },
        { href: '#international', label: 'International Transfers' },
        { href: '#changes', label: 'Policy Changes' },
        { href: '#contact', label: 'Contact Us' },
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
/* Outer shell: full viewport; inner frame is the centered “page” */
.legal-page-root {
  min-height: 100vh;
  padding-top: 72px;
  padding-bottom: 24px;
  padding-left: clamp(10px, 3vw, 24px);
  padding-right: clamp(10px, 3vw, 24px);
  background: #e8ecf1;
  box-sizing: border-box;
}

/* Single centered column for all legal content */
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
  /* opaque dot grid — transparent gaps let scrolled text show through */
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
  /* Above scrolling sections in this column; below Bootstrap fixed navbar (1030) */
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

.ld-data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  font-size: 15px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(15, 105, 110, 0.12);
}

.ld-data-table th {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0f696e;
  padding: 10px 12px;
  background: #f6f4fa;
  border-bottom: 1px solid rgba(15, 105, 110, 0.12);
  text-align: left;
}

.ld-data-table td {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  padding: 10px 12px;
  border-bottom: 1px solid rgba(15, 105, 110, 0.1);
  color: #49454f;
  font-weight: 400;
  background: #fff;
}

.ld-data-table tr:last-child td {
  border-bottom: none;
}

.ld-data-table tr:hover td {
  background: rgba(15, 105, 110, 0.06);
}

/* Desktop: main column scrolls inside the card; sidebar does not move with that scroll */
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
