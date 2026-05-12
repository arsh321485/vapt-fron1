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
            <div class="ld-doc-tag">GDPR · EU Data Protection</div>
            <h1 class="ld-doc-title">Data Processing<br />Agreement</h1>
            <p class="ld-doc-meta">
              <strong>Effective Date:</strong> May 12, 2026 &nbsp;|&nbsp;
              <strong>Version:</strong> 1.0 &nbsp;|&nbsp;
              <strong>Regulation:</strong> GDPR / UK GDPR / CCPA
            </p>
          </div>

          <div class="ld-callout">
            <p>
              This Data Processing Agreement ("DPA") is entered into between the Customer (as Data Controller) and
              VaptFix.ai (as Data Processor), and forms part of the VaptFix.ai Terms of Service. This DPA governs the
              processing of personal data by VaptFix.ai on behalf of the Customer in accordance with the General Data
              Protection Regulation (EU) 2016/679 ("GDPR") and applicable data protection laws.
            </p>
          </div>

          <section id="background">
            <div class="ld-section-number">01 / BACKGROUND</div>
            <h2>Background &amp; Parties</h2>
            <p>This DPA applies when VaptFix.ai processes personal data on behalf of the Customer as part of delivering the Service. The parties acknowledge that:</p>
            <ul>
              <li>The <strong>Customer</strong> is the Data Controller, determining the purposes and means of processing personal data</li>
              <li><strong>VaptFix.ai</strong> is the Data Processor, processing personal data solely on behalf of and under the instructions of the Customer</li>
              <li>
                This DPA supplements and is incorporated into the VaptFix.ai
                <router-link to="/terms">Terms of Service</router-link>
              </li>
              <li>In the event of a conflict between this DPA and the Terms of Service regarding data protection matters, this DPA prevails</li>
            </ul>
          </section>

          <section id="definitions">
            <div class="ld-section-number">02 / DEFINITIONS</div>
            <h2>Definitions</h2>
            <ul>
              <li><strong>"Personal Data"</strong> — any information relating to an identified or identifiable natural person ("Data Subject")</li>
              <li><strong>"Processing"</strong> — any operation performed on Personal Data, as defined in Article 4(2) GDPR</li>
              <li><strong>"Controller"</strong> — the entity determining the purposes and means of processing</li>
              <li><strong>"Processor"</strong> — an entity processing Personal Data on behalf of a Controller</li>
              <li><strong>"Sub-processor"</strong> — a third-party engaged by VaptFix.ai to process Personal Data</li>
              <li><strong>"Standard Contractual Clauses" (SCCs)</strong> — the EU Commission Implementing Decision 2021/914 clauses</li>
              <li><strong>"Data Breach"</strong> — a breach of security leading to accidental or unlawful destruction, loss, alteration, or unauthorized disclosure of Personal Data</li>
              <li><strong>"Supervisory Authority"</strong> — a data protection authority competent for the Customer or VaptFix.ai</li>
            </ul>
          </section>

          <section id="scope">
            <div class="ld-section-number">03 / PROCESSING SCOPE</div>
            <h2>Scope of Processing</h2>
            <p>VaptFix.ai shall process Personal Data only:</p>
            <ul>
              <li>To provide the Service as described in the Terms of Service and Customer's account configuration</li>
              <li>In accordance with the Customer's documented instructions</li>
              <li>As required by applicable Union or Member State law (in which case VaptFix.ai shall inform the Customer unless prohibited by law)</li>
            </ul>
            <p>The nature, purpose, types of Personal Data processed, and categories of Data Subjects are detailed in <strong>Annex A</strong> to this DPA.</p>
          </section>

          <section id="obligations">
            <div class="ld-section-number">04 / PROCESSOR OBLIGATIONS</div>
            <h2>VaptFix.ai Obligations as Processor</h2>
            <p>VaptFix.ai shall:</p>
            <ul>
              <li>Process Personal Data only on documented instructions from the Customer or as required by law</li>
              <li>Ensure that all persons authorized to process Personal Data are bound by appropriate confidentiality obligations</li>
              <li>Implement and maintain the technical and organizational security measures set out in Annex C</li>
              <li>Assist the Customer in fulfilling its obligations regarding Data Subject rights, DPIAs, and prior consultations</li>
              <li>Delete or return all Personal Data upon termination of services, at the Customer's choice, within 30 days</li>
              <li>Make available to the Customer all information necessary to demonstrate compliance with this DPA</li>
              <li>Not engage Sub-processors without prior written authorization from the Customer (general authorization granted via Annex B)</li>
              <li>Notify the Customer without undue delay if, in VaptFix.ai's opinion, an instruction infringes the GDPR</li>
            </ul>
          </section>

          <section id="controller">
            <div class="ld-section-number">05 / CONTROLLER OBLIGATIONS</div>
            <h2>Customer Obligations as Controller</h2>
            <p>The Customer shall:</p>
            <ul>
              <li>Ensure that processing of Personal Data complies with applicable data protection laws</li>
              <li>Provide lawful basis for processing and ensure Data Subjects have been informed of processing activities</li>
              <li>Provide VaptFix.ai with clear, documented instructions for processing</li>
              <li>Not instruct VaptFix.ai to process Personal Data in a manner that violates applicable law</li>
              <li>Conduct Data Protection Impact Assessments (DPIAs) where required under Article 35 GDPR</li>
            </ul>
          </section>

          <section id="security-measures">
            <div class="ld-section-number">06 / SECURITY MEASURES</div>
            <h2>Technical &amp; Organizational Security Measures</h2>
            <p>
              VaptFix.ai implements appropriate technical and organizational measures to ensure a level of security appropriate to the risk, including those detailed in <strong>Annex C</strong> and our
              <router-link to="/security">Security Statement</router-link>. These measures include:
            </p>
            <ul>
              <li>Pseudonymisation and encryption of Personal Data</li>
              <li>Ongoing confidentiality, integrity, availability and resilience of processing systems</li>
              <li>Ability to restore availability and access to Personal Data in a timely manner following an incident</li>
              <li>Regular testing, assessing and evaluating the effectiveness of security measures</li>
            </ul>
          </section>

          <section id="subprocessors">
            <div class="ld-section-number">07 / SUB-PROCESSORS</div>
            <h2>Sub-processor Management</h2>
            <p>The Customer grants VaptFix.ai general written authorization to engage the sub-processors listed in <strong>Annex B</strong>. VaptFix.ai shall:</p>
            <ul>
              <li>Notify the Customer of any intended changes to the sub-processor list at least 14 days in advance</li>
              <li>Allow the Customer to object to new sub-processors within 14 days of notification</li>
              <li>Impose data protection obligations equivalent to this DPA on all sub-processors via written contracts</li>
              <li>Remain fully liable to the Customer for any failure by a sub-processor to fulfil its data protection obligations</li>
            </ul>
          </section>

          <section id="data-subject">
            <div class="ld-section-number">08 / DATA SUBJECT RIGHTS</div>
            <h2>Data Subject Rights Assistance</h2>
            <p>
              VaptFix.ai shall promptly (and no later than 5 business days) notify the Customer of any Data Subject requests received. VaptFix.ai shall provide reasonable assistance to enable the Customer to respond to:
            </p>
            <ul>
              <li>Requests for access, rectification, erasure, restriction, or portability of Personal Data</li>
              <li>Objections to processing</li>
              <li>Any other Data Subject rights under applicable law</li>
            </ul>
            <p>
              All Data Subject requests should be directed to
              <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. VaptFix.ai will not respond directly to Data Subjects without Customer authorization, except as required by law.
            </p>
          </section>

          <section id="breach">
            <div class="ld-section-number">09 / DATA BREACH</div>
            <h2>Personal Data Breach Notification</h2>
            <p>In the event of a Personal Data Breach, VaptFix.ai shall:</p>
            <ul>
              <li>Notify the Customer without undue delay, and in any event <strong>within 24 hours</strong> of becoming aware of the breach</li>
              <li>Provide the following information to the extent available: nature of the breach; approximate number of data subjects affected; categories and approximate number of records affected; likely consequences; measures taken or proposed</li>
              <li>Investigate the breach and provide updated information as it becomes available</li>
              <li>Co-operate with the Customer and take such reasonable steps as directed to mitigate the effects</li>
            </ul>
            <p>The Customer is responsible for notifying Supervisory Authorities and affected Data Subjects as required by applicable law. VaptFix.ai will provide necessary support and information for such notifications.</p>
          </section>

          <section id="transfers">
            <div class="ld-section-number">10 / INTERNATIONAL TRANSFERS</div>
            <h2>International Data Transfers</h2>
            <p>VaptFix.ai may transfer Personal Data to countries outside the EEA/UK only where:</p>
            <ul>
              <li>The European Commission has issued an adequacy decision for the destination country; or</li>
              <li>Appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) per EU Commission Decision 2021/914; or</li>
              <li>The transfer falls within a derogation under Article 49 GDPR</li>
            </ul>
            <p>Where SCCs apply, the Module 2 (Controller to Processor) clauses are incorporated by reference into this DPA. For UK transfers, the relevant UK International Data Transfer Addendum applies.</p>
          </section>

          <section id="retention">
            <div class="ld-section-number">11 / RETENTION &amp; DELETION</div>
            <h2>Data Retention &amp; Deletion</h2>
            <p>Upon termination or expiry of the Service agreement, or upon written request, VaptFix.ai shall, at the Customer's election:</p>
            <ul>
              <li><strong>Return:</strong> Provide an export of Customer Personal Data in a standard machine-readable format within 30 days</li>
              <li><strong>Delete:</strong> Securely delete all Customer Personal Data within 30 days using NIST SP 800-88 compliant methods</li>
            </ul>
            <p>
              VaptFix.ai may retain Personal Data beyond this period only to the extent required by applicable law, and will notify the Customer of any such obligation. Anonymized or aggregated data not attributable to individuals may be retained for platform analytics.
            </p>
          </section>

          <section id="audit">
            <div class="ld-section-number">12 / AUDIT RIGHTS</div>
            <h2>Audit &amp; Inspection Rights</h2>
            <p>VaptFix.ai shall:</p>
            <ul>
              <li>Make available all information necessary to demonstrate compliance with this DPA</li>
              <li>Provide SOC 2 Type II audit reports and other relevant compliance documentation upon request</li>
              <li>Allow for and contribute to audits, including inspections, conducted by the Customer or a qualified auditor mandated by the Customer, upon 30 days' prior written notice and no more than once per year</li>
              <li>Bear no costs of such audits unless they reveal material non-compliance</li>
            </ul>
          </section>

          <section id="liability">
            <div class="ld-section-number">13 / LIABILITY</div>
            <h2>Liability</h2>
            <p>
              Each party shall be liable to the other for damages arising from any breach of this DPA to the extent provided for under the GDPR and applicable law. The liability limitations in the Terms of Service apply to the extent permitted by law. Neither party limits liability for damages to Data Subjects as required by Article 82 GDPR.
            </p>
          </section>

          <section id="term">
            <div class="ld-section-number">14 / TERM &amp; TERMINATION</div>
            <h2>Term &amp; Termination</h2>
            <p>
              This DPA enters into force on the effective date and remains in effect for the duration of the Service agreement. Termination of the Service agreement automatically terminates this DPA. The obligations relating to confidentiality, security, deletion, and audit rights survive termination.
            </p>
          </section>

          <section id="annex-a">
            <div class="ld-section-number">ANNEX A</div>
            <h2>Processing Details</h2>
            <table class="ld-data-table">
              <thead>
                <tr>
                  <th>Element</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Subject matter</td>
                  <td>Provision of VAPT platform services, vulnerability scanning, and security assessments</td>
                </tr>
                <tr>
                  <td>Duration</td>
                  <td>Duration of the Service agreement</td>
                </tr>
                <tr>
                  <td>Nature of processing</td>
                  <td>Collection, storage, analysis, transmission, and deletion of Personal Data</td>
                </tr>
                <tr>
                  <td>Purpose</td>
                  <td>Delivering the VaptFix.ai Service; account management; security scanning; reporting</td>
                </tr>
                <tr>
                  <td>Categories of Personal Data</td>
                  <td>Account identifiers (name, email, job title); usage data (IP addresses, logs); authentication data; communications; scan target metadata (URLs, IP ranges)</td>
                </tr>
                <tr>
                  <td>Special categories</td>
                  <td>None anticipated. Customer must not submit special category data as scan targets without DPA amendment.</td>
                </tr>
                <tr>
                  <td>Categories of Data Subjects</td>
                  <td>Customer employees, administrators, and authorized users; end users of Customer's systems where applicable</td>
                </tr>
                <tr>
                  <td>Frequency</td>
                  <td>Continuous during service provision</td>
                </tr>
                <tr>
                  <td>Retention period</td>
                  <td>
                    Per the Retention table in the
                    <router-link to="/privacy">Privacy Policy</router-link>
                    and Section 11 of this DPA
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="annex-b">
            <div class="ld-section-number">ANNEX B</div>
            <h2>Authorized Sub-processors</h2>
            <table class="ld-data-table">
              <thead>
                <tr>
                  <th>Sub-processor</th>
                  <th>Location</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Amazon Web Services (AWS)</td>
                  <td>USA / EU</td>
                  <td>Cloud infrastructure, compute, storage, and networking</td>
                </tr>
                <tr>
                  <td>Google Cloud Platform (GCP)</td>
                  <td>USA / EU</td>
                  <td>Secondary cloud infrastructure and disaster recovery</td>
                </tr>
                <tr>
                  <td>Stripe</td>
                  <td>USA</td>
                  <td>Payment processing and billing</td>
                </tr>
                <tr>
                  <td>SendGrid (Twilio)</td>
                  <td>USA</td>
                  <td>Transactional email delivery</td>
                </tr>
                <tr>
                  <td>Intercom</td>
                  <td>USA</td>
                  <td>Customer support and in-app messaging</td>
                </tr>
                <tr>
                  <td>Datadog</td>
                  <td>USA</td>
                  <td>Infrastructure monitoring, logging, and alerting</td>
                </tr>
                <tr>
                  <td>Cloudflare</td>
                  <td>USA / Global</td>
                  <td>CDN, DDoS protection, WAF, and DNS</td>
                </tr>
                <tr>
                  <td>PagerDuty</td>
                  <td>USA</td>
                  <td>Incident management and on-call alerting</td>
                </tr>
              </tbody>
            </table>
            <p>
              The current sub-processor list is maintained at
              <a href="https://vaptfix.ai/sub-processors" target="_blank" rel="noopener noreferrer">vaptfix.ai/sub-processors</a>
              and updated in real-time. Customers will receive 14 days' notice of additions via email.
            </p>
          </section>

          <section id="annex-c">
            <div class="ld-section-number">ANNEX C</div>
            <h2>Technical &amp; Organizational Security Measures</h2>
            <p>
              The following measures are implemented and maintained by VaptFix.ai. Full details are in our
              <router-link to="/security">Security Statement</router-link>.
            </p>
            <table class="ld-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Measures Implemented</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Encryption</td>
                  <td>AES-256 at rest; TLS 1.3 in transit; HSM-backed key management; 90-day key rotation</td>
                </tr>
                <tr>
                  <td>Access Control</td>
                  <td>MFA mandatory; least-privilege RBAC; JIT production access; quarterly access reviews; SSO/SAML support</td>
                </tr>
                <tr>
                  <td>Network Security</td>
                  <td>Private VPCs; WAF; DDoS protection; IDS/IPS; egress filtering; network segmentation</td>
                </tr>
                <tr>
                  <td>Application Security</td>
                  <td>SAST/DAST in CI/CD; SCA; container scanning; OWASP Top 10 standards; annual pen testing</td>
                </tr>
                <tr>
                  <td>Monitoring &amp; Logging</td>
                  <td>24/7 SOC; SIEM with immutable logs; 12-month retention; anomaly detection</td>
                </tr>
                <tr>
                  <td>Incident Response</td>
                  <td>Documented IRP; 24h breach notification; biannual tabletop exercises</td>
                </tr>
                <tr>
                  <td>Business Continuity</td>
                  <td>RTO &lt;4h; RPO &lt;1h; daily encrypted backups; multi-region replication for Enterprise</td>
                </tr>
                <tr>
                  <td>Personnel</td>
                  <td>Background checks; annual security training; NDAs; access de-provisioning within 24h of offboarding</td>
                </tr>
                <tr>
                  <td>Vendor Management</td>
                  <td>Security assessments for all sub-processors; annual review; DPAs in place</td>
                </tr>
                <tr>
                  <td>Compliance</td>
                  <td>SOC 2 Type II; PCI DSS Level 1; GDPR; CCPA; ISO 27001 (in progress)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section id="signatures">
            <div class="ld-section-number">SIGNATURES</div>
            <h2>Execution</h2>
            <p>
              By signing below (or by accepting the Terms of Service which incorporate this DPA), both parties agree to be bound by the terms of this Data Processing Agreement.
            </p>
            <div class="ld-sig-block">
              <div class="ld-sig-party">
                <h4 class="ld-sig-party-title">Data Controller (Customer)</h4>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Authorized Signature</div>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Name &amp; Title</div>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Company Name</div>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Date</div>
              </div>
              <div class="ld-sig-party">
                <h4 class="ld-sig-party-title">Data Processor (VaptFix.ai)</h4>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Authorized Signature</div>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Name &amp; Title</div>
                <div class="ld-sig-line ld-sig-line--accent"></div>
                <div class="ld-sig-label ld-sig-label--accent">VaptFix.ai</div>
                <div class="ld-sig-line"></div>
                <div class="ld-sig-label">Date</div>
              </div>
            </div>
            <div class="ld-callout">
              <p>
                For Enterprise customers requiring a countersigned DPA, please contact
                <a href="mailto:legal@vaptfix.ai">legal@vaptfix.ai</a>. Processing begins within 3 business days of receipt of completed documentation.
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
  name: 'DataProcessingAgreementView',
  components: {
    Header,
    LegalDocInnerFooter,
  },
  data() {
    return {
      activeTocHash: '',
      tocItems: [
        { href: '#background', label: 'Background' },
        { href: '#definitions', label: 'Definitions' },
        { href: '#scope', label: 'Processing Scope' },
        { href: '#obligations', label: 'Processor Obligations' },
        { href: '#controller', label: 'Controller Obligations' },
        { href: '#security-measures', label: 'Security Measures' },
        { href: '#subprocessors', label: 'Sub-processors' },
        { href: '#data-subject', label: 'Data Subject Rights' },
        { href: '#breach', label: 'Data Breach' },
        { href: '#transfers', label: 'International Transfers' },
        { href: '#retention', label: 'Retention & Deletion' },
        { href: '#audit', label: 'Audit Rights' },
        { href: '#liability', label: 'Liability' },
        { href: '#term', label: 'Term & Termination' },
        { href: '#annex-a', label: 'Annex A — Processing Details' },
        { href: '#annex-b', label: 'Annex B — Sub-processors' },
        { href: '#annex-c', label: 'Annex C — Security Measures' },
        { href: '#signatures', label: 'Signatures' },
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
  vertical-align: top;
}

.ld-data-table tr:last-child td {
  border-bottom: none;
}

.ld-data-table tr:hover td {
  background: rgba(15, 105, 110, 0.06);
}

.ld-sig-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin: 2rem 0;
  background: #f6f4fa;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 10px;
  padding: 2rem;
}

.ld-sig-party-title {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin: 0 0 1rem;
}

.ld-sig-line {
  border-bottom: 1px solid rgba(15, 105, 110, 0.2);
  margin-bottom: 0.5rem;
  height: 36px;
}

.ld-sig-line--accent {
  border-bottom-color: rgba(15, 105, 110, 0.45);
}

.ld-sig-label {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  margin-bottom: 1rem;
}

.ld-sig-label--accent {
  color: #0f696e;
  font-weight: 600;
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

  .ld-sig-block {
    grid-template-columns: 1fr;
  }
}
</style>
