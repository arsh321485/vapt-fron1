<template>
  <div class="legal-page-root">
    <Header />

    <div class="legal-page-frame">
    <div class="ld-page">
      <aside class="ld-sidebar">
        <div class="ld-sidebar-label">On this page</div>
        <nav @click="onTocNavClick">
          <template v-for="item in tocItems" :key="item.href || item.label">
            <a
              v-if="item.type === 'link'"
              :href="item.href"
              :class="{ 'is-active': activeTocHash === item.href }"
            >{{ item.label }}</a>
            <div v-else-if="item.type === 'group'" class="ld-sidebar-group">{{ item.label }}</div>
            <div v-else-if="item.type === 'divider'" class="ld-sidebar-divider"></div>
          </template>
        </nav>
      </aside>

      <main class="ld-content">
        <div class="ld-doc-header">
          <div class="ld-doc-tag">Global Privacy · 20+ Jurisdictions</div>
          <h1 class="ld-doc-title">Privacy Policy</h1>
          <p class="ld-doc-meta">
            <strong>Effective Date:</strong> May 12, 2025 &nbsp;|&nbsp;
            <strong>Last Updated:</strong> May 12, 2025 &nbsp;|&nbsp;
            <strong>Version:</strong> 2.0
          </p>
        </div>

        <div class="ld-callout">
          <p>This Privacy Policy applies to all users of VaptFix.ai globally. We comply with applicable data protection and privacy laws in every jurisdiction where we operate. General provisions apply to all users; the jurisdiction-specific notices (Sections 5-A through 5-P) supplement the general provisions with rights and obligations specific to your location. Where local law provides greater protections, those protections apply.</p>
        </div>

        <section id="overview">
          <div class="ld-section-number">01 / OVERVIEW</div>
          <h2>Who We Are</h2>
          <p>VaptFix.ai is a cybersecurity platform providing automated vulnerability assessment and penetration testing (VAPT), security scanning, remediation guidance, and reporting to organizations worldwide. We act as a <strong>data controller</strong> for account and usage data, and as a <strong>data processor</strong> when handling customer-submitted scan data under a Data Processing Agreement (DPA).</p>
          <p>This Policy covers all products and services available at vaptfix.ai and via our API. It applies regardless of how you access the Service — web, mobile, API, or integrations. Our DPO and regional contacts are listed in Section 14.</p>
        </section>

        <section id="data-collected">
          <div class="ld-section-number">02 / DATA COLLECTED</div>
          <h2>Data We Collect</h2>

          <h3>Account &amp; Identity Data</h3>
          <ul>
            <li>Full name, email address, and organization name</li>
            <li>Billing address and payment information (processed via PCI-DSS-compliant processors)</li>
            <li>Authentication credentials — passwords stored in hashed form only, never in plaintext</li>
            <li>Profile preferences, notification settings, and language/locale</li>
          </ul>

          <h3>Usage &amp; Technical Data</h3>
          <ul>
            <li>IP addresses, browser type/version, operating system, and device identifiers</li>
            <li>Pages visited, features used, click paths, and session duration</li>
            <li>API request logs, error logs, and performance diagnostics</li>
            <li>Geolocation at city/country level derived from IP address</li>
            <li>Referral source and campaign identifiers (UTM parameters)</li>
          </ul>

          <h3>Scan &amp; Assessment Data</h3>
          <ul>
            <li>Target URLs, IP ranges, domain names, and API endpoints submitted for scanning</li>
            <li>Vulnerability findings, CVSS scores, severity ratings, and remediation status</li>
            <li>Scan configurations, schedules, scope definitions, and credentials for authenticated scans</li>
            <li>Security reports, audit logs, and historical scan results</li>
          </ul>

          <h3>Communications Data</h3>
          <ul>
            <li>Support tickets, live chat messages, and email correspondence</li>
            <li>Survey responses and product feedback submissions</li>
            <li>Webinar and event registrations and participation records</li>
          </ul>

          <h3>What We Do Not Collect</h3>
          <p>We do not knowingly collect special categories of personal data (health, biometric, racial/ethnic origin, religious beliefs, political opinions, trade union membership, or sexual orientation) unless explicitly required for a specific purpose and processed under an appropriate legal basis with informed consent.</p>
        </section>

        <section id="how-we-use">
          <div class="ld-section-number">03 / HOW WE USE DATA</div>
          <h2>How We Use Your Data</h2>
          <table class="ld-data-table">
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Data Used</th>
                <th>Representative Legal Bases</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Service delivery &amp; account management</td><td>Account, usage, scan data</td><td>Contract; legitimate interest</td></tr>
              <tr><td>Security scanning &amp; vulnerability analysis</td><td>Scan targets, configurations</td><td>Contract</td></tr>
              <tr><td>Billing &amp; payment processing</td><td>Account, billing data</td><td>Contract; legal obligation</td></tr>
              <tr><td>Product improvement &amp; anonymized analytics</td><td>Aggregated usage data</td><td>Legitimate interest; consent (where required)</td></tr>
              <tr><td>Security monitoring &amp; fraud prevention</td><td>Technical, usage data</td><td>Legitimate interest; legal obligation</td></tr>
              <tr><td>Marketing &amp; promotional communications</td><td>Account data, preferences</td><td>Consent (opt-in); legitimate interest for existing customers where permitted</td></tr>
              <tr><td>Legal compliance &amp; dispute resolution</td><td>All relevant data</td><td>Legal obligation; legitimate interest</td></tr>
              <tr><td>Customer support &amp; onboarding</td><td>Communications, account data</td><td>Contract; legitimate interest</td></tr>
            </tbody>
          </table>
        </section>

        <section id="legal-basis">
          <div class="ld-section-number">04 / LEGAL BASES — WORLDWIDE</div>
          <h2>Legal Bases for Processing — Global Overview</h2>
          <p>VaptFix.ai identifies and documents a lawful basis for every processing activity. The applicable legal basis varies by jurisdiction. Jurisdiction-specific sections below provide detail. Our general lawful bases are:</p>
          <div class="ld-jurisdiction-grid">
            <div class="ld-jcard">
              <div class="ld-jcard-flag">📜</div>
              <div class="ld-jcard-law">CONTRACT</div>
              <div class="ld-jcard-region">Performance of Agreement</div>
              <div class="ld-jcard-desc">Processing necessary to deliver the Service under our Terms of Service</div>
            </div>
            <div class="ld-jcard">
              <div class="ld-jcard-flag">⚖️</div>
              <div class="ld-jcard-law">LEGITIMATE INTEREST</div>
              <div class="ld-jcard-region">Balancing Test Applied</div>
              <div class="ld-jcard-desc">Security monitoring, fraud prevention, product analytics, and business operations</div>
            </div>
            <div class="ld-jcard">
              <div class="ld-jcard-flag">✅</div>
              <div class="ld-jcard-law">CONSENT</div>
              <div class="ld-jcard-region">Freely Given &amp; Specific</div>
              <div class="ld-jcard-desc">Marketing communications, non-essential cookies, and special category data</div>
            </div>
            <div class="ld-jcard">
              <div class="ld-jcard-flag">🏛️</div>
              <div class="ld-jcard-law">LEGAL OBLIGATION</div>
              <div class="ld-jcard-region">Statutory Compliance</div>
              <div class="ld-jcard-desc">Compliance with applicable laws, tax obligations, and regulatory/court orders</div>
            </div>
            <div class="ld-jcard">
              <div class="ld-jcard-flag">🛡️</div>
              <div class="ld-jcard-law">VITAL INTERESTS</div>
              <div class="ld-jcard-region">Emergency Situations</div>
              <div class="ld-jcard-desc">Processing necessary to protect life or physical integrity</div>
            </div>
            <div class="ld-jcard">
              <div class="ld-jcard-flag">🌐</div>
              <div class="ld-jcard-law">PUBLIC INTEREST</div>
              <div class="ld-jcard-region">Mandated by Law</div>
              <div class="ld-jcard-desc">Processing for public interest tasks under applicable law (e.g., critical infrastructure)</div>
            </div>
          </div>
        </section>

        <!-- JURISDICTION NOTICES -->

        <section id="gdpr">
          <div class="ld-section-number">05-A / EUROPEAN UNION · UNITED KINGDOM · SWITZERLAND</div>
          <h2>EU / UK / Swiss Jurisdiction Notice</h2>

          <h3>Applicable Laws</h3>
          <ul>
            <li><strong>EU:</strong> General Data Protection Regulation (EU) 2016/679 (GDPR)</li>
            <li><strong>UK:</strong> UK GDPR + Data Protection Act 2018</li>
            <li><strong>Switzerland:</strong> Revised Federal Act on Data Protection (revFADP / nDSG), effective September 2023</li>
          </ul>

          <h3>Legal Bases (GDPR Art. 6 &amp; 9)</h3>
          <p>We rely on: Art. 6(1)(b) contract performance; Art. 6(1)(c) legal obligation; Art. 6(1)(f) legitimate interests (with balancing test documentation); Art. 6(1)(a) consent. Special category data is processed only under Art. 9(2)(a) explicit consent or Art. 9(2)(f) legal claims.</p>

          <h3>Your Rights Under GDPR / UK GDPR</h3>
          <ul>
            <li><strong>Art. 15 — Access:</strong> Obtain confirmation and a copy of your personal data</li>
            <li><strong>Art. 16 — Rectification:</strong> Correct inaccurate data without undue delay</li>
            <li><strong>Art. 17 — Erasure ("Right to Be Forgotten"):</strong> Delete data where no overriding legal ground exists</li>
            <li><strong>Art. 18 — Restriction:</strong> Limit processing in specified circumstances</li>
            <li><strong>Art. 20 — Portability:</strong> Receive data in a structured, machine-readable format (where technically feasible)</li>
            <li><strong>Art. 21 — Objection:</strong> Object to processing based on legitimate interests or direct marketing</li>
            <li><strong>Art. 22 — Automated Decisions:</strong> Not to be subject solely to automated decisions with significant effects</li>
            <li><strong>Art. 77 — Supervisory Authority:</strong> Lodge a complaint with your local DPA</li>
          </ul>

          <h3>Representative &amp; DPO</h3>
          <p>Our Data Protection Officer: <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a>. EU representative (Art. 27 GDPR): <a href="mailto:eu-rep@vaptfix.ai">eu-rep@vaptfix.ai</a>. UK representative: <a href="mailto:uk-rep@vaptfix.ai">uk-rep@vaptfix.ai</a>. Swiss representative: <a href="mailto:ch-rep@vaptfix.ai">ch-rep@vaptfix.ai</a>.</p>

          <h3>Cross-Border Transfers</h3>
          <p>Transfers outside the EEA/UK/Switzerland are protected by: EC adequacy decisions; Standard Contractual Clauses (SCCs) per Decision 2021/914 (Module 2); EU–U.S. Data Privacy Framework; UK IDTA; Swiss SCCs. Transfer Impact Assessments (TIAs) are conducted for high-risk destination countries.</p>

          <h3>Supervisory Authorities</h3>
          <ul>
            <li>EU: Lead DPA to be designated at launch</li>
            <li>UK: Information Commissioner's Office — <a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a></li>
            <li>Switzerland: FDPIC — <a href="https://www.fdpic.ch" target="_blank" rel="noopener">fdpic.ch</a></li>
          </ul>
        </section>

        <section id="usa">
          <div class="ld-section-number">05-B / UNITED STATES</div>
          <h2>United States Jurisdiction Notice</h2>

          <h3>Federal Framework</h3>
          <p>No single comprehensive U.S. federal privacy law applies to VaptFix.ai. We comply with applicable sector-specific federal laws including COPPA (children's privacy — under-13 rule), CAN-SPAM (email marketing), and CFAA (computer fraud). We monitor federal legislative developments.</p>

          <h3>California — CCPA / CPRA</h3>
          <p>California residents have the following rights under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA):</p>
          <ul>
            <li><strong>Right to Know:</strong> Categories and specific pieces of personal information collected, used, disclosed, or sold/shared</li>
            <li><strong>Right to Delete:</strong> Request deletion of personal information (subject to statutory exceptions)</li>
            <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information</li>
            <li><strong>Right to Opt-Out of Sale / Sharing:</strong> We do not sell personal information. We do not share for cross-context behavioral advertising without consent.</li>
            <li><strong>Right to Limit Sensitive Personal Information:</strong> Restrict use to necessary service purposes</li>
            <li><strong>Right to Non-Discrimination:</strong> No adverse treatment for exercising CCPA rights</li>
            <li><strong>Shine the Light (Cal. Civil Code §1798.83):</strong> Disclosure of categories shared with third parties for direct marketing</li>
          </ul>
          <p>Submit California requests to <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a> — subject line "California Privacy Request." Authorized agents accepted with written permission. Response within 45 days (extendable by 45 days with notice).</p>

          <h3>Multi-State Privacy Laws — Summary</h3>
          <table class="ld-data-table">
            <thead>
              <tr><th>State / Law</th><th>In Force</th><th>Key Rights</th></tr>
            </thead>
            <tbody>
              <tr><td>Virginia — VCDPA</td><td>Jan 2023</td><td>Access, correction, deletion, portability, opt-out of targeted ads/profiling/sale</td></tr>
              <tr><td>Colorado — CPA</td><td>Jul 2023</td><td>Access, correction, deletion, portability, opt-out of targeted ads/sale/profiling</td></tr>
              <tr><td>Connecticut — CTDPA</td><td>Jul 2023</td><td>Access, correction, deletion, portability, opt-out of targeted ads/sale/profiling</td></tr>
              <tr><td>Texas — TDPSA</td><td>Jul 2024</td><td>Access, correction, deletion, portability, opt-out of targeted ads/sale/profiling</td></tr>
              <tr><td>Florida — FDBR</td><td>Jul 2024</td><td>Access, correction, deletion, portability for qualifying controllers</td></tr>
              <tr><td>Montana — MCDPA</td><td>Oct 2024</td><td>Access, correction, deletion, portability, opt-out of targeted ads/sale/profiling</td></tr>
              <tr><td>Oregon — OCPA</td><td>Jul 2024</td><td>Access, correction, deletion, portability, opt-out of targeted ads/sale/profiling</td></tr>
              <tr><td>Washington — MHMD Act</td><td>Mar 2024</td><td>Consent for collection/sharing consumer health data; no sale without authorization</td></tr>
              <tr><td>Nevada — SB 220</td><td>Oct 2019</td><td>Opt-out of sale of covered information</td></tr>
            </tbody>
          </table>
          <p>Residents of any state with applicable privacy law may exercise rights by contacting <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. Responses delivered within the timeframe required by your state's law. We will not discriminate for exercising any privacy right.</p>
        </section>

        <section id="canada">
          <div class="ld-section-number">05-C / CANADA</div>
          <h2>Canada Jurisdiction Notice</h2>

          <h3>Applicable Laws</h3>
          <ul>
            <li><strong>Federal:</strong> Personal Information Protection and Electronic Documents Act (PIPEDA); pending replacement by Bill C-27 (CPPA — Consumer Privacy Protection Act)</li>
            <li><strong>Quebec:</strong> Act Respecting the Protection of Personal Information in the Private Sector (Law 25 / Bill 64), fully in force September 2023</li>
            <li><strong>Alberta &amp; BC:</strong> PIPA (Personal Information Protection Act), substantially similar to PIPEDA</li>
          </ul>

          <h3>PIPEDA — 10 Fair Information Principles</h3>
          <p>VaptFix.ai complies with all 10 principles: accountability; identifying purposes; consent; limiting collection; limiting use/disclosure/retention; accuracy; safeguards; openness; individual access; challenging compliance.</p>

          <h3>Quebec Law 25 — Additional Requirements</h3>
          <ul>
            <li>Privacy Impact Assessment (PIA) before any project involving personal information</li>
            <li>Chief Privacy Officer (CPO) role fulfilled by our DPO — <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a></li>
            <li>72-hour breach notification to the Commission d'accès à l'information (CAI) for material incidents</li>
            <li>Right to de-indexation (right to be forgotten for online dissemination)</li>
            <li>Right to data portability and right to challenge automated profiling decisions</li>
            <li>Privacy by default — only information strictly necessary for stated purposes</li>
            <li>Explicit opt-in consent for sensitive personal information and profiling</li>
          </ul>

          <h3>Breach Notification</h3>
          <p>Federally: breaches posing "real risk of significant harm" reported to the OPC and affected individuals. Quebec: breaches reported to CAI within 72 hours of becoming aware. Alberta/BC: similar notification obligations under PIPA.</p>
          <p>Regulatory bodies: OPC — <a href="https://www.priv.gc.ca" target="_blank" rel="noopener">priv.gc.ca</a> | CAI Quebec — <a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noopener">cai.gouv.qc.ca</a>.</p>
        </section>

        <section id="brazil">
          <div class="ld-section-number">05-D / BRAZIL</div>
          <h2>Brazil — Lei Geral de Proteção de Dados (LGPD)</h2>

          <h3>Applicable Law</h3>
          <p>Federal Law No. 13,709/2018 (LGPD), effective September 2020, enforced by the Autoridade Nacional de Proteção de Dados (ANPD).</p>

          <h3>Legal Bases (Art. 7 &amp; 11 LGPD)</h3>
          <p>Consent (Art. 7, I); contract performance (Art. 7, V); legal obligation (Art. 7, II); legitimate interest subject to balancing test (Art. 7, IX); protection of life (Art. 7, VII). Sensitive personal data requires explicit consent (Art. 11, I) or legal obligation (Art. 11, II).</p>

          <h3>Your Rights Under LGPD (Art. 18)</h3>
          <ul>
            <li>Confirmation of existence and access to personal data</li>
            <li>Correction of incomplete, inaccurate, or outdated data</li>
            <li>Anonymization, blocking, or deletion of unnecessary/excessive data</li>
            <li>Portability to another service provider in a structured format</li>
            <li>Deletion of data processed with consent (subject to exceptions)</li>
            <li>Information on entities with which data has been shared</li>
            <li>Information on the possibility of refusing consent and consequences</li>
            <li>Revocation of consent at any time</li>
            <li>Review of decisions made solely by automated processing</li>
            <li>Complaint to the ANPD</li>
          </ul>

          <h3>DPO (Encarregado) &amp; Regulatory Body</h3>
          <p>Encarregado: <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a>. ANPD — <a href="https://www.gov.br/anpd" target="_blank" rel="noopener">gov.br/anpd</a>.</p>
        </section>

        <section id="australia">
          <div class="ld-section-number">05-E / AUSTRALIA</div>
          <h2>Australia — Privacy Act 1988 &amp; Australian Privacy Principles (APPs)</h2>

          <h3>Applicable Law</h3>
          <p>Privacy Act 1988 (Cth) and the 13 Australian Privacy Principles (APPs), enforced by the Office of the Australian Information Commissioner (OAIC). We monitor the Privacy Legislation Amendment (Enhancing Online Privacy and Other Measures) Bill for updates.</p>

          <h3>Key APP Obligations</h3>
          <ul>
            <li><strong>APP 1:</strong> Open and transparent management of personal information — this Policy satisfies the APP Privacy Policy requirement</li>
            <li><strong>APP 3:</strong> Collection only by lawful means, for notified primary purposes</li>
            <li><strong>APP 5:</strong> Notification of identity, contact details, purpose, consequences, and access/correction rights at or before collection</li>
            <li><strong>APP 6:</strong> Use or disclosure only for primary purpose or allowed secondary purposes</li>
            <li><strong>APP 8:</strong> Reasonable steps to ensure overseas recipients comply with APPs or equivalent law before cross-border disclosure</li>
            <li><strong>APP 11:</strong> Reasonable security steps to protect from misuse, interference, loss, and unauthorized access or disclosure</li>
            <li><strong>APP 12 &amp; 13:</strong> Access and correction rights</li>
          </ul>

          <h3>Notifiable Data Breaches (NDB Scheme)</h3>
          <p>Eligible data breaches likely to result in serious harm are notified to the OAIC and affected individuals as soon as practicable. Regulatory body: OAIC — <a href="https://www.oaic.gov.au" target="_blank" rel="noopener">oaic.gov.au</a>.</p>
        </section>

        <section id="japan">
          <div class="ld-section-number">05-F / JAPAN</div>
          <h2>Japan — Act on Protection of Personal Information (APPI)</h2>

          <h3>Applicable Law</h3>
          <p>APPI, Law No. 57 of 2003 as amended 2020 and 2022, enforced by the Personal Information Protection Commission (PPC).</p>

          <h3>Key Obligations</h3>
          <ul>
            <li>Purpose specification and prohibition on handling beyond necessary scope (Art. 17–18)</li>
            <li>Prohibition on unauthorized acquisition (Art. 20)</li>
            <li>Third-party provision requires consent (Art. 27); provision records maintained (Art. 29–30)</li>
            <li>Security management measures against leakage, loss, or damage (Art. 23)</li>
            <li>Cross-border transfers require the destination to provide equivalent protection, or data subject consent (Art. 28)</li>
            <li>PPC and individual notification for specified personal information leakage incidents (Art. 26)</li>
          </ul>

          <h3>Your Rights</h3>
          <p>Disclosure, correction, addition, deletion, suspension of use, and suspension of third-party provision of retained personal data. Submit requests to <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. PPC — <a href="https://www.ppc.go.jp/en/" target="_blank" rel="noopener">ppc.go.jp</a>.</p>
        </section>

        <section id="southkorea">
          <div class="ld-section-number">05-G / SOUTH KOREA</div>
          <h2>South Korea — Personal Information Protection Act (PIPA)</h2>

          <h3>Applicable Law</h3>
          <p>PIPA, as comprehensively amended in 2023, enforced by the Personal Information Protection Commission (PIPC).</p>

          <h3>Key Obligations</h3>
          <ul>
            <li>Explicit written consent (or equivalent lawful basis) for collection, use, and third-party provision</li>
            <li>Minimum collection: only information strictly necessary for stated purposes</li>
            <li>Notification of items collected, purpose, retention period, and right to refuse consent</li>
            <li>Mandatory encryption of unique identification numbers and sensitive information</li>
            <li>Breach notification to PIPC and affected individuals without delay (PIPA Art. 34)</li>
            <li>Mandatory appointment of a Personal Information Protection Officer (PIPO)</li>
            <li>Cross-border transfers permitted with consent, contractual safeguards, or PIPC recognition of equivalent protection</li>
          </ul>

          <h3>Your Rights</h3>
          <p>Access, correction, deletion, and suspension of processing. Requests: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. PIPC — <a href="https://www.pipc.go.kr/eng/" target="_blank" rel="noopener">pipc.go.kr</a>.</p>
        </section>

        <section id="china">
          <div class="ld-section-number">05-H / CHINA (PRC)</div>
          <h2>China — Personal Information Protection Law (PIPL)</h2>

          <h3>Applicable Laws</h3>
          <ul>
            <li>Personal Information Protection Law (PIPL), effective November 2021</li>
            <li>Data Security Law (DSL), effective September 2021</li>
            <li>Cybersecurity Law (CSL), effective June 2017</li>
            <li>Measures for Security Assessment of Cross-border Data Transfers, 2022</li>
          </ul>

          <h3>Key Obligations</h3>
          <ul>
            <li><strong>Consent:</strong> Separate, voluntary, and explicit consent for each purpose; separate consent for sensitive personal information (Art. 13, 29)</li>
            <li><strong>Purpose &amp; Data Minimization:</strong> Collection limited to minimum necessary scope; no processing beyond original purpose without renewed consent (Art. 6)</li>
            <li><strong>Cross-border Transfer Restrictions:</strong> Transfers outside China require CAC security assessment (where applicable); personal information protection certification; standard contracts with overseas recipients; or other CAC-specified conditions (Art. 38). Separate informed consent required for outbound transfers (Art. 39).</li>
            <li><strong>Data Localization:</strong> Critical information infrastructure operators and large-scale processors must store personal information collected in China domestically (Art. 40)</li>
            <li><strong>Breach Notification:</strong> Notify CAC and affected individuals immediately upon discovery (Art. 57)</li>
            <li><strong>Individual Rights:</strong> Access, correction, deletion, explanation of automated decisions, portability, withdrawal of consent (Art. 44–50)</li>
          </ul>

          <p>Chinese users contact our designated personal information protection officer: <a href="mailto:cn-privacy@vaptfix.ai">cn-privacy@vaptfix.ai</a>. Regulatory body: Cyberspace Administration of China (CAC).</p>
        </section>

        <section id="india">
          <div class="ld-section-number">05-I / INDIA</div>
          <h2>India — Digital Personal Data Protection Act 2023 (DPDP Act)</h2>

          <h3>Applicable Law</h3>
          <p>The Digital Personal Data Protection Act, 2023 (DPDP Act), pending full implementation under rules to be notified. We are preparing for full compliance and will update this section upon rules notification.</p>

          <h3>Key Obligations</h3>
          <ul>
            <li><strong>Consent:</strong> Clear and plain-language consent notice required; separate consent for each purpose (S.6)</li>
            <li><strong>Deemed Consent:</strong> Lawful processing without explicit consent where voluntarily provided for a specific purpose, or under specified legitimate uses (S.7)</li>
            <li><strong>Data Fiduciary Obligations:</strong> Accuracy, completeness, retention limitation, and security safeguards (S.8)</li>
            <li><strong>Data Principal Rights:</strong> Access, correction/completion, erasure, grievance redressal, and nomination (S.11–14)</li>
            <li><strong>Cross-border Transfers:</strong> Permitted to countries notified by the Central Government as providing adequate protection</li>
            <li><strong>Breach Notification:</strong> Prompt notification to the Data Protection Board of India (DPBI) and affected Data Principals in prescribed manner (S.8(6))</li>
            <li><strong>Children's Data:</strong> Verifiable parental consent required for minors under 18; no profiling or tracking of children (S.9)</li>
          </ul>

          <p>Contact: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. Regulatory body: Data Protection Board of India (DPBI), upon constitution.</p>
        </section>

        <section id="singapore">
          <div class="ld-section-number">05-J / SINGAPORE</div>
          <h2>Singapore — Personal Data Protection Act (PDPA)</h2>

          <h3>Applicable Law</h3>
          <p>Personal Data Protection Act 2012 (PDPA) as amended in 2020, enforced by the Personal Data Protection Commission (PDPC).</p>

          <h3>Key Obligations</h3>
          <ul>
            <li>Consent obligation: obtain and document consent before collecting, using, or disclosing personal data (S.13–17)</li>
            <li>Purpose limitation: use personal data only for purposes for which consent was given</li>
            <li>Notification obligation: inform individuals of purposes before or at time of collection</li>
            <li>Data portability: transmit data to other organizations in machine-readable format where technically feasible (Advisory Guidelines)</li>
            <li>Cross-border transfer: ensure recipients provide comparable protection (S.26)</li>
            <li>Mandatory breach notification: notify PDPC within 3 business days; notify affected individuals if there is significant harm</li>
            <li>Data Protection Officer (DPO) appointed and registered with PDPC</li>
          </ul>

          <p>Contact: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. PDPC — <a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener">pdpc.gov.sg</a>.</p>
        </section>

        <section id="thailand">
          <div class="ld-section-number">05-K / THAILAND</div>
          <h2>Thailand — Personal Data Protection Act (PDPA)</h2>

          <h3>Applicable Law</h3>
          <p>Personal Data Protection Act B.E. 2562 (2019), fully effective June 2022, enforced by the Personal Data Protection Committee (PDPC Thailand) under the Ministry of Digital Economy and Society (MDES).</p>

          <h3>Key Obligations</h3>
          <ul>
            <li>Lawful basis required for all processing: consent, contract, legal obligation, vital interest, public interest, or legitimate interest (S.24)</li>
            <li>Explicit consent required for sensitive personal data categories (S.26)</li>
            <li>Notification of purpose, scope, and data subject rights at or before collection</li>
            <li>Data subject rights: access, correction, deletion, portability, restriction, objection, and complaint</li>
            <li>Cross-border transfers to countries providing adequate protection, or with consent (S.28)</li>
            <li>Breach notification to PDPC within 72 hours; notify data subjects if high risk of harm</li>
            <li>DPO appointment mandatory for certain controller categories</li>
          </ul>

          <p>Contact: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. PDPC Thailand — <a href="https://www.pdpc.go.th" target="_blank" rel="noopener">pdpc.go.th</a>.</p>
        </section>

        <section id="southafrica">
          <div class="ld-section-number">05-L / SOUTH AFRICA</div>
          <h2>South Africa — Protection of Personal Information Act (POPIA)</h2>

          <h3>Applicable Law</h3>
          <p>Protection of Personal Information Act 4 of 2013 (POPIA), fully effective July 2021, enforced by the Information Regulator of South Africa.</p>

          <h3>Eight Conditions for Lawful Processing</h3>
          <ul>
            <li><strong>Accountability:</strong> VaptFix.ai is responsible for ensuring POPIA compliance</li>
            <li><strong>Processing Limitation:</strong> Lawful, minimal, and with consent or grounds in Section 11</li>
            <li><strong>Purpose Specification:</strong> Collected for specific, explicitly defined, and lawful purposes (S.13–14)</li>
            <li><strong>Further Processing Limitation:</strong> Compatible with original purpose (S.15)</li>
            <li><strong>Information Quality:</strong> Complete, accurate, and not misleading (S.16)</li>
            <li><strong>Openness:</strong> This Policy satisfies S.18 notification requirements</li>
            <li><strong>Security Safeguards:</strong> Appropriate technical and organizational measures (S.19)</li>
            <li><strong>Data Subject Participation:</strong> Rights of access, correction, and objection (S.23–25)</li>
          </ul>

          <h3>Transfers Outside South Africa</h3>
          <p>Permitted where: recipient is subject to a law providing equivalent protection; data subject consents; or other S.72 exception applies. VaptFix.ai obtains appropriate transfer agreements for all cross-border data flows originating from South Africa.</p>

          <p>Contact: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. Information Regulator — <a href="https://inforegulator.org.za" target="_blank" rel="noopener">inforegulator.org.za</a>.</p>
        </section>

        <section id="middleeast">
          <div class="ld-section-number">05-M / MIDDLE EAST</div>
          <h2>Middle East Jurisdiction Notice</h2>

          <h3>United Arab Emirates — Federal PDPL</h3>
          <p>Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (PDPL UAE), enforced by the UAE Data Office. Key requirements: consent or other lawful basis; data minimization; purpose limitation; security safeguards; cross-border transfer restrictions (adequate countries or controller safeguards); mandatory breach notification; data subject rights including access, correction, withdrawal of consent, and deletion. The Abu Dhabi Global Market (ADGM) Data Protection Regulations 2021 and DIFC Data Protection Law (as amended) apply within those free zones — we comply with all three frameworks where applicable.</p>

          <h3>Kingdom of Saudi Arabia — PDPL</h3>
          <p>Personal Data Protection Law (PDPL KSA), Royal Decree No. M/19 (1443H), as amended 2023, enforced by SDAIA/NDMO. Key requirements: explicit consent for collection and processing; purpose limitation; data minimization; security safeguards; cross-border transfers require SDAIA approval or equivalent recipient protection; strict localization requirements for sensitive personal data; mandatory breach notification to NDMO and affected individuals within 72 hours for high-risk incidents; mandatory appointment of a Data Protection Officer.</p>

          <h3>Qatar — PDPL &amp; QFC</h3>
          <p>Law No. 13 of 2016 on Privacy and Personal Data Protection; Qatar Financial Centre Data Protection Regulations 2021 (where applicable). We comply with NCSA guidelines for data collection, consent, security, and individual rights in Qatar.</p>

          <p>Middle East privacy contact: <a href="mailto:me-privacy@vaptfix.ai">me-privacy@vaptfix.ai</a>.</p>
        </section>

        <section id="latam">
          <div class="ld-section-number">05-N / LATIN AMERICA</div>
          <h2>Latin America Jurisdiction Notice</h2>

          <h3>Mexico — LFPDPPP</h3>
          <p>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP), 2010, enforced by INAI. An Aviso de Privacidad (Privacy Notice) in Spanish is provided to Mexican users. Rights: ARCO (Acceso, Rectificación, Cancelación, Oposición) plus the right to revoke consent at any time.</p>

          <h3>Argentina — Ley 25.326</h3>
          <p>Ley de Protección de los Datos Personales No. 25.326, enforced by AAIP. Argentina holds an EU adequacy decision. Rights: access, rectification, and suppression. Database registration with AAIP maintained where required.</p>

          <h3>Chile — Ley 19.628 / New Data Protection Framework</h3>
          <p>Current framework under Ley 19.628 on the Protection of Private Life. Chile's new comprehensive law (Boletín 11.144-07) is monitored — we will update compliance obligations upon enactment and promulgation.</p>

          <h3>Colombia — Ley 1581 de 2012 &amp; Ley 1266 de 2008</h3>
          <p>Ley Estatutaria 1581 de 2012 and Decreto 1377 de 2013, enforced by the Superintendencia de Industria y Comercio (SIC). Habeas data rights: access, update, rectification, and deletion. Authorization (consent) required for processing personal data of Colombian data owners. Data processing policies must be made publicly available.</p>

          <h3>Peru — Ley 29733</h3>
          <p>Ley de Protección de Datos Personales No. 29733 and its regulations, enforced by the National Authority for Personal Data Protection (ANPD Peru). Rights: access, rectification, cancellation, and opposition (ARCO). Database registration required for certain processing activities.</p>

          <p>Latin America privacy contact: <a href="mailto:latam-privacy@vaptfix.ai">latam-privacy@vaptfix.ai</a>.</p>
        </section>

        <section id="newzealand">
          <div class="ld-section-number">05-O / NEW ZEALAND</div>
          <h2>New Zealand — Privacy Act 2020</h2>
          <p>Privacy Act 2020, replacing the Privacy Act 1993, enforced by the Office of the Privacy Commissioner (OPC NZ). We comply with all 13 Information Privacy Principles (IPPs): collection from the individual where practicable; purpose specification; notification at collection; use and disclosure limitations; secure storage; access and correction rights. Mandatory breach notification: serious harm breaches reported to OPC and affected individuals as soon as practicable. Regulatory body: OPC NZ — <a href="https://www.privacy.org.nz" target="_blank" rel="noopener">privacy.org.nz</a>.</p>
        </section>

        <section id="israel">
          <div class="ld-section-number">05-P / ISRAEL</div>
          <h2>Israel — Privacy Protection Law &amp; Amendment No. 13</h2>
          <p>Privacy Protection Law, 5741-1981, as significantly amended by Amendment No. 13 (enacted 2023, effective 2025), enforced by the Privacy Protection Authority (PPA). Israel holds an EU adequacy decision. Amendment 13 aligns Israeli law more closely with GDPR, introducing: data minimization; purpose limitation; DPO requirements; enhanced data subject rights (access, correction, deletion); mandatory security measures; breach notification obligations; and restrictions on cross-border transfers. Database registration requirements maintained where applicable. Regulatory body: PPA — <a href="https://www.gov.il/en/departments/the_privacy_protection_authority" target="_blank" rel="noopener">gov.il/PPA</a>.</p>
        </section>

        <!-- GLOBAL PROVISIONS -->

        <section id="sharing">
          <div class="ld-section-number">06 / DATA SHARING</div>
          <h2>Data Sharing &amp; Disclosure</h2>
          <p>We do not sell, rent, or trade your personal data to third parties for their own commercial purposes in any jurisdiction. Sharing occurs only as follows:</p>

          <h3>Service Providers &amp; Sub-processors</h3>
          <p>We engage trusted third-party processors (cloud infrastructure, payment, email, analytics, support). All are bound by Data Processing Agreements and restricted to processing data solely to provide services to us. A current sub-processor list is available in our DPA Annex B.</p>

          <h3>Business Transfers</h3>
          <p>In a merger, acquisition, or asset sale, personal data may transfer as a business asset. We provide 30 days' prior notice via email and platform notice. You may request deletion before transfer if no legal obligation requires retention.</p>

          <h3>Legal Requirements</h3>
          <p>We disclose data when required by court order, government request, or applicable law. Where legally permissible, we notify you before complying. We publish an annual transparency report on government data requests.</p>

          <h3>Safety &amp; Security</h3>
          <p>We may disclose data to protect the safety, rights, or property of VaptFix.ai, our users, or the public, including cooperation with law enforcement in cybercrime investigations.</p>

          <h3>With Your Explicit Consent</h3>
          <p>For any other sharing purpose, we obtain explicit, informed, and freely given consent before disclosure.</p>
        </section>

        <section id="retention">
          <div class="ld-section-number">07 / RETENTION</div>
          <h2>Data Retention Schedule</h2>
          <p>We retain personal data only as long as necessary to fulfil stated purposes, comply with legal obligations, resolve disputes, and enforce agreements. Local law may impose minimum or maximum periods that override the defaults below.</p>
          <table class="ld-data-table">
            <thead>
              <tr><th>Data Category</th><th>Default Retention</th><th>Legal Minimum Note</th></tr>
            </thead>
            <tbody>
              <tr><td>Account &amp; profile data</td><td>Account lifetime + 30 days</td><td>Varies by jurisdiction</td></tr>
              <tr><td>Scan results &amp; security reports</td><td>2 years (configurable per plan)</td><td>No universal minimum</td></tr>
              <tr><td>Billing records &amp; invoices</td><td>7 years</td><td>5–10 years under tax law</td></tr>
              <tr><td>Security &amp; access logs</td><td>12 months</td><td>90 days in some jurisdictions</td></tr>
              <tr><td>Support communications</td><td>3 years</td><td>No universal minimum</td></tr>
              <tr><td>Marketing preferences &amp; consent records</td><td>Until opt-out or account deletion; 5 years for consent records</td><td>Required by GDPR, PIPL, LGPD</td></tr>
              <tr><td>Data breach incident records</td><td>10 years</td><td>5 years (GDPR guidance)</td></tr>
            </tbody>
          </table>
          <p>Upon expiry, data is securely deleted using NIST SP 800-88 compliant methods, or irreversibly anonymized.</p>
        </section>

        <section id="your-rights">
          <div class="ld-section-number">08 / YOUR RIGHTS — GLOBAL COMPARISON</div>
          <h2>Privacy Rights Worldwide</h2>
          <p>The table below summarizes rights under major frameworks. Your rights depend on your location. Submit all requests to <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a> with subject "Privacy Rights Request — [Your Country]." Response within the timeframe required by applicable law (typically 30 days; 45 days for CCPA with notice; 10 working days for POPIA). We will not discriminate against you for exercising any privacy right.</p>

          <div class="ld-rights-table-wrap">
            <table class="ld-rights-table">
              <thead>
                <tr>
                  <th>Right</th>
                  <th>GDPR (EU/UK)</th>
                  <th>CCPA (CA)</th>
                  <th>LGPD (BR)</th>
                  <th>PIPL (CN)</th>
                  <th>POPIA (ZA)</th>
                  <th>PDPA (SG)</th>
                  <th>PDPA (TH)</th>
                  <th>APPI (JP)</th>
                  <th>PIPA (KR)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Access / Know</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td></tr>
                <tr><td>Correction / Rectification</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td></tr>
                <tr><td>Deletion / Erasure</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td></tr>
                <tr><td>Data Portability</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔*</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-dash">—</td></tr>
                <tr><td>Restriction of Processing</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td></tr>
                <tr><td>Objection to Processing</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-dash">—</td></tr>
                <tr><td>Opt-Out of Sale / Sharing</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td></tr>
                <tr><td>Withdraw Consent</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td></tr>
                <tr><td>Automated Decision Review</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td><td class="ld-dash">—</td></tr>
                <tr><td>Complaint to Authority</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td><td class="ld-tick">✔</td></tr>
              </tbody>
            </table>
          </div>
          <p style="font-size:13px;color:#64748b;margin-top:0.5rem;">✔ = right available under that framework &nbsp;|&nbsp; — = not explicitly provided &nbsp;|&nbsp; * SG portability under advisory guidelines</p>
        </section>

        <section id="cookies">
          <div class="ld-section-number">09 / COOKIES</div>
          <h2>Cookies &amp; Tracking Technologies</h2>
          <p>We use cookies and similar tracking technologies for authentication, security, analytics, and personalization. Consent is obtained in accordance with local law — EU/UK/CH users see a granular cookie consent banner observing ePrivacy Directive and PECR requirements; other jurisdictions see consent mechanisms calibrated to their local rules (e.g., PDPA Thailand, PDPA Singapore, Quebec Law 25).</p>
          <table class="ld-data-table">
            <thead>
              <tr><th>Cookie Type</th><th>Purpose</th><th>Duration</th><th>Consent Required</th></tr>
            </thead>
            <tbody>
              <tr><td>Essential</td><td>Authentication, session management, security tokens</td><td>Session / up to 1 year</td><td>No — strictly necessary</td></tr>
              <tr><td>Functional</td><td>User preferences, language, and settings</td><td>Up to 1 year</td><td>Yes (most jurisdictions)</td></tr>
              <tr><td>Analytics</td><td>Platform usage and performance (anonymized where possible)</td><td>Up to 2 years</td><td>Yes — opt-in</td></tr>
              <tr><td>Marketing</td><td>Targeted content and retargeting</td><td>Up to 1 year</td><td>Yes — explicit opt-in only</td></tr>
            </tbody>
          </table>
          <p>Manage preferences at any time via our Cookie Preference Centre or your browser settings. Disabling essential cookies will impair platform functionality.</p>
        </section>

        <section id="security">
          <div class="ld-section-number">10 / SECURITY</div>
          <h2>Data Security</h2>
          <p>We implement technical and organizational security measures appropriate to the risk of processing, including: AES-256 encryption at rest; TLS 1.3 in transit; mandatory MFA; RBAC; annual third-party penetration testing; SOC 2 Type II compliance; and 24/7 monitoring. Full details are in our <router-link to="/security">Security Statement</router-link>.</p>
          <p>In the event of a personal data breach, we notify affected users and supervisory authorities within the timeframes required by applicable law — typically 72 hours under GDPR; 24 hours under VaptFix.ai's internal SLA; within 3 business days under Singapore PDPA; 72 hours under Thailand PDPA; and as specified by each jurisdiction's law.</p>
        </section>

        <section id="children">
          <div class="ld-section-number">11 / CHILDREN'S PRIVACY</div>
          <h2>Children's Privacy</h2>
          <p>VaptFix.ai services are not directed to minors. The applicable age threshold varies by jurisdiction, and we apply the highest applicable standard for each user's location:</p>
          <ul>
            <li><strong>13 years (USA — COPPA):</strong> No knowing collection from children under 13 without verifiable parental consent</li>
            <li><strong>13–16 years (EU GDPR Art. 8):</strong> Each EU Member State sets the age between 13–16; parental consent required below the applicable threshold; we apply 16 years as the default</li>
            <li><strong>16 years (UK GDPR, Switzerland revFADP, Singapore PDPA, Australia):</strong> Parental consent required for users under 16</li>
            <li><strong>18 years (India DPDP Act, China PIPL, Saudi Arabia PDPL, UAE PDPL):</strong> Verifiable parental consent required for all minors under 18; no behavioral profiling or tracking of children</li>
            <li><strong>All other jurisdictions:</strong> We apply the higher of the local statutory minimum or 16 years of age</li>
          </ul>
          <p>If you believe a minor has provided personal data without required parental consent, contact <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a> immediately — we will investigate and delete such data promptly.</p>
        </section>

        <section id="international">
          <div class="ld-section-number">12 / CROSS-BORDER TRANSFERS</div>
          <h2>International Data Transfers</h2>
          <p>VaptFix.ai operates infrastructure across multiple regions. Personal data may be transferred internationally. We select safeguards based on the origin and destination of each data flow:</p>
          <table class="ld-data-table">
            <thead>
              <tr><th>Transfer Route</th><th>Safeguard Mechanism</th></tr>
            </thead>
            <tbody>
              <tr><td>EEA / UK → USA</td><td>EU–U.S. Data Privacy Framework (DPF) + SCCs Module 2 (Controller–Processor)</td></tr>
              <tr><td>EEA / UK → Adequate countries</td><td>European Commission adequacy decision</td></tr>
              <tr><td>EEA / UK → Non-adequate countries</td><td>SCCs per Decision 2021/914 + Transfer Impact Assessment (TIA)</td></tr>
              <tr><td>UK → Non-adequate countries</td><td>UK International Data Transfer Agreement (IDTA)</td></tr>
              <tr><td>Switzerland → Third countries</td><td>Swiss SCCs (SCC-CH) or Federal Council adequacy list</td></tr>
              <tr><td>China → Overseas</td><td>CAC Standard Contracts; security assessment where required; individual consent per Art. 39 PIPL</td></tr>
              <tr><td>South Korea → Overseas</td><td>PIPC Standard Clauses or contractual safeguards; individual consent per amended PIPA</td></tr>
              <tr><td>Brazil → Overseas</td><td>ANPD Standard Clauses; adequacy decision; or contractual guarantees per LGPD Art. 33</td></tr>
              <tr><td>India → Overseas</td><td>Central Government notified country list (once published); contractual safeguards per DPDP Act</td></tr>
              <tr><td>Saudi Arabia → Overseas</td><td>SDAIA/NDMO approval; contractual safeguards ensuring equivalent protection</td></tr>
              <tr><td>Thailand → Overseas</td><td>Adequate protection determination or individual consent per PDPA S.28</td></tr>
              <tr><td>South Africa → Overseas</td><td>Adequate law or binding agreement; or individual consent per POPIA S.72</td></tr>
              <tr><td>Singapore → Overseas</td><td>Data Transfer Agreements (DTAs) or contractual safeguards per PDPA S.26</td></tr>
              <tr><td>All other routes</td><td>Applicable local adequacy mechanism; contractual safeguards; or explicit consent</td></tr>
            </tbody>
          </table>
          <p>We maintain records of all cross-border data flows and Transfer Impact Assessments. Copies of applicable SCCs or transfer mechanism documentation are available on request at <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>.</p>
        </section>

        <section id="changes">
          <div class="ld-section-number">13 / POLICY CHANGES</div>
          <h2>Changes to This Policy</h2>
          <p>We review this Policy at least annually and update it when laws change, we add new features, or our practices evolve. For material changes, we will:</p>
          <ul>
            <li>Provide at least 30 days' advance notice via email and a prominent in-platform notice</li>
            <li>Where required by law (e.g., LGPD, PIPL, India DPDP, South Korea PIPA), obtain renewed consent for material changes to processing purposes</li>
            <li>Maintain a version archive of prior policies at vaptfix.ai/privacy-archive</li>
          </ul>
          <p>Continued use after the effective date constitutes acceptance, except where applicable law requires explicit re-consent.</p>
        </section>

        <section id="contact">
          <div class="ld-section-number">14 / CONTACT, DPO &amp; AUTHORITIES</div>
          <h2>Contact Us &amp; Supervisory Authorities</h2>
          <div class="ld-callout">
            <p>
              <strong>VaptFix.ai — Global Privacy Team</strong><br />
              General Privacy: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a><br />
              Data Protection Officer (DPO / Encarregado / PIPO): <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a><br />
              EU Representative (Art. 27 GDPR): <a href="mailto:eu-rep@vaptfix.ai">eu-rep@vaptfix.ai</a><br />
              UK Representative: <a href="mailto:uk-rep@vaptfix.ai">uk-rep@vaptfix.ai</a><br />
              China Privacy Officer (PIPL): <a href="mailto:cn-privacy@vaptfix.ai">cn-privacy@vaptfix.ai</a><br />
              Middle East Privacy: <a href="mailto:me-privacy@vaptfix.ai">me-privacy@vaptfix.ai</a><br />
              Latin America Privacy: <a href="mailto:latam-privacy@vaptfix.ai">latam-privacy@vaptfix.ai</a><br />
              Response time: within 30 days of receipt (shorter timelines per local law observed)
            </p>
          </div>

          <h3>Global Supervisory Authorities</h3>
          <table class="ld-data-table">
            <thead>
              <tr><th>Jurisdiction</th><th>Authority</th><th>Website</th></tr>
            </thead>
            <tbody>
              <tr><td>EU</td><td>Lead DPA — to be designated</td><td>edpb.europa.eu</td></tr>
              <tr><td>United Kingdom</td><td>Information Commissioner's Office (ICO)</td><td><a href="https://ico.org.uk" target="_blank" rel="noopener">ico.org.uk</a></td></tr>
              <tr><td>Switzerland</td><td>Federal Data Protection and Information Commissioner (FDPIC)</td><td><a href="https://www.fdpic.ch" target="_blank" rel="noopener">fdpic.ch</a></td></tr>
              <tr><td>USA — California</td><td>California Privacy Protection Agency (CPPA)</td><td><a href="https://cppa.ca.gov" target="_blank" rel="noopener">cppa.ca.gov</a></td></tr>
              <tr><td>Canada</td><td>Office of the Privacy Commissioner (OPC)</td><td><a href="https://www.priv.gc.ca" target="_blank" rel="noopener">priv.gc.ca</a></td></tr>
              <tr><td>Canada — Quebec</td><td>Commission d'accès à l'information (CAI)</td><td><a href="https://www.cai.gouv.qc.ca" target="_blank" rel="noopener">cai.gouv.qc.ca</a></td></tr>
              <tr><td>Brazil</td><td>Autoridade Nacional de Proteção de Dados (ANPD)</td><td><a href="https://www.gov.br/anpd" target="_blank" rel="noopener">gov.br/anpd</a></td></tr>
              <tr><td>Australia</td><td>Office of the Australian Information Commissioner (OAIC)</td><td><a href="https://www.oaic.gov.au" target="_blank" rel="noopener">oaic.gov.au</a></td></tr>
              <tr><td>Japan</td><td>Personal Information Protection Commission (PPC)</td><td><a href="https://www.ppc.go.jp/en/" target="_blank" rel="noopener">ppc.go.jp</a></td></tr>
              <tr><td>South Korea</td><td>Personal Information Protection Commission (PIPC)</td><td><a href="https://www.pipc.go.kr/eng/" target="_blank" rel="noopener">pipc.go.kr</a></td></tr>
              <tr><td>China</td><td>Cyberspace Administration of China (CAC)</td><td><a href="https://www.cac.gov.cn" target="_blank" rel="noopener">cac.gov.cn</a></td></tr>
              <tr><td>Singapore</td><td>Personal Data Protection Commission (PDPC)</td><td><a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener">pdpc.gov.sg</a></td></tr>
              <tr><td>Thailand</td><td>Personal Data Protection Committee (PDPC Thailand)</td><td><a href="https://www.pdpc.go.th" target="_blank" rel="noopener">pdpc.go.th</a></td></tr>
              <tr><td>South Africa</td><td>Information Regulator</td><td><a href="https://inforegulator.org.za" target="_blank" rel="noopener">inforegulator.org.za</a></td></tr>
              <tr><td>India</td><td>Data Protection Board of India (DPBI)</td><td>TBC upon constitution</td></tr>
              <tr><td>UAE</td><td>UAE Data Office (TDRA)</td><td><a href="https://tdra.gov.ae" target="_blank" rel="noopener">tdra.gov.ae</a></td></tr>
              <tr><td>Saudi Arabia</td><td>Saudi Data &amp; AI Authority / NDMO</td><td><a href="https://ndmo.gov.sa" target="_blank" rel="noopener">ndmo.gov.sa</a></td></tr>
              <tr><td>New Zealand</td><td>Office of the Privacy Commissioner NZ</td><td><a href="https://www.privacy.org.nz" target="_blank" rel="noopener">privacy.org.nz</a></td></tr>
              <tr><td>Israel</td><td>Privacy Protection Authority (PPA)</td><td><a href="https://www.gov.il/en/departments/the_privacy_protection_authority" target="_blank" rel="noopener">gov.il/PPA</a></td></tr>
              <tr><td>Mexico</td><td>Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI)</td><td><a href="https://home.inai.org.mx" target="_blank" rel="noopener">inai.org.mx</a></td></tr>
              <tr><td>Argentina</td><td>Agencia de Acceso a la Información Pública (AAIP)</td><td><a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener">argentina.gob.ar/aaip</a></td></tr>
              <tr><td>Colombia</td><td>Superintendencia de Industria y Comercio (SIC)</td><td><a href="https://www.sic.gov.co" target="_blank" rel="noopener">sic.gov.co</a></td></tr>
              <tr><td>Peru</td><td>ANPD Peru</td><td><a href="https://www.gob.pe/anpd" target="_blank" rel="noopener">gob.pe/anpd</a></td></tr>
            </tbody>
          </table>
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
        { type: 'group', label: 'General' },
        { type: 'link', href: '#overview', label: 'Overview' },
        { type: 'link', href: '#data-collected', label: 'Data We Collect' },
        { type: 'link', href: '#how-we-use', label: 'How We Use Data' },
        { type: 'link', href: '#legal-basis', label: 'Legal Bases Worldwide' },
        { type: 'divider' },
        { type: 'group', label: 'Jurisdiction Notices' },
        { type: 'link', href: '#gdpr', label: 'EU / UK / Switzerland' },
        { type: 'link', href: '#usa', label: 'United States' },
        { type: 'link', href: '#canada', label: 'Canada' },
        { type: 'link', href: '#brazil', label: 'Brazil (LGPD)' },
        { type: 'link', href: '#australia', label: 'Australia' },
        { type: 'link', href: '#japan', label: 'Japan (APPI)' },
        { type: 'link', href: '#southkorea', label: 'South Korea (PIPA)' },
        { type: 'link', href: '#china', label: 'China (PIPL)' },
        { type: 'link', href: '#india', label: 'India (DPDP Act)' },
        { type: 'link', href: '#singapore', label: 'Singapore (PDPA)' },
        { type: 'link', href: '#thailand', label: 'Thailand (PDPA)' },
        { type: 'link', href: '#southafrica', label: 'South Africa (POPIA)' },
        { type: 'link', href: '#middleeast', label: 'Middle East' },
        { type: 'link', href: '#latam', label: 'Latin America' },
        { type: 'link', href: '#newzealand', label: 'New Zealand' },
        { type: 'link', href: '#israel', label: 'Israel' },
        { type: 'divider' },
        { type: 'group', label: 'Global Provisions' },
        { type: 'link', href: '#sharing', label: 'Data Sharing' },
        { type: 'link', href: '#retention', label: 'Retention Schedule' },
        { type: 'link', href: '#your-rights', label: 'Your Rights Table' },
        { type: 'link', href: '#cookies', label: 'Cookies' },
        { type: 'link', href: '#security', label: 'Security' },
        { type: 'link', href: '#children', label: "Children's Privacy" },
        { type: 'link', href: '#international', label: 'Cross-Border Transfers' },
        { type: 'link', href: '#changes', label: 'Policy Changes' },
        { type: 'link', href: '#contact', label: 'Contact & Authorities' },
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
      const hashes = this.tocItems.filter((i) => i.type === 'link').map((i) => i.href);
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
/* Outer shell: full viewport; inner frame is the centered "page" */
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

.ld-sidebar-group {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #64748b;
  text-transform: uppercase;
  padding: 8px 10px 3px;
}

.ld-sidebar-divider {
  height: 1px;
  background: rgba(15, 105, 110, 0.15);
  margin: 6px 0;
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
  margin: 0 0 0.5rem;
  color: #49454f;
  line-height: 1.65;
}

.ld-callout p:last-child {
  margin: 0;
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

/* Jurisdiction cards grid */
.ld-jurisdiction-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.ld-jcard {
  background: #f6f4fa;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.ld-jcard-flag {
  font-size: 20px;
  margin-bottom: 0.5rem;
}

.ld-jcard-law {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #0f696e;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.ld-jcard-region {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: #241447;
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.ld-jcard-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #64748b;
  font-weight: 400;
  line-height: 1.5;
}

/* Rights comparison table */
.ld-rights-table-wrap {
  width: 100%;
  overflow-x: auto;
  margin: 1rem 0;
}

.ld-rights-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 8px;
  overflow: hidden;
  min-width: 700px;
}

.ld-rights-table th {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #0f696e;
  padding: 10px 10px;
  background: #f6f4fa;
  border-bottom: 1px solid rgba(15, 105, 110, 0.12);
  text-align: center;
  white-space: nowrap;
}

.ld-rights-table th:first-child {
  text-align: left;
}

.ld-rights-table td {
  font-family: 'Inter', sans-serif;
  padding: 8px 10px;
  border-bottom: 1px solid rgba(15, 105, 110, 0.1);
  color: #64748b;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  background: #fff;
}

.ld-rights-table td:first-child {
  font-weight: 500;
  color: #241447;
  font-size: 13px;
  text-align: left;
}

.ld-rights-table tr:last-child td {
  border-bottom: none;
}

.ld-rights-table tr:hover td {
  background: rgba(15, 105, 110, 0.06);
}

.ld-tick {
  color: #0f696e;
  font-size: 14px;
  font-weight: 700;
}

.ld-dash {
  color: #94a3b8;
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

  .ld-jurisdiction-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
