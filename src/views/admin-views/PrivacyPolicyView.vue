<template>
  <div class="legal-page-root lf-page">
    <Header />

    <div class="container legal-page-frame">
    <div class="ld-page">
      <aside class="ld-sidebar">
        <p class="lf-nav-label">Topics</p>
        <nav class="lf-nav-list" aria-label="Privacy Policy topics">
          <template v-for="item in tocItems" :key="item.href || item.label">
            <p v-if="item.type === 'group'" class="lf-group">{{ item.label }}</p>
            <button
              v-else-if="item.type === 'link'"
              type="button"
              class="lf-topic"
              :class="{ 'is-active': activeTocHash === item.href }"
              @click="selectSection(item.href)"
            >{{ item.label }}</button>
          </template>
        </nav>
      </aside>

      <div class="ld-main">
        <div class="ld-doc-header">
          <div class="ld-doc-tag">Global Privacy · 20+ Jurisdictions</div>
          <h1 class="ld-doc-title">{{ activeSectionLabel }}</h1>
          <p class="ld-doc-meta">
            <span><strong>Last updated:</strong> October 26, 2026</span>
            <span style="color:#e2e8f0">|</span>
            <span><strong>Version:</strong> 3.0</span>
          </p>
        </div>

        <main ref="contentScroller" class="ld-content">

        <div class="ld-callout" v-show="activeTocHash === '#overview'">
          <p>This Privacy Policy explains what information VAPTFIX processes through its website and platform, third-party integrations, and customer-authorized workflows; how that information is used, stored, protected, shared, retained, and deleted; and how privacy requests may be submitted.</p>
        </div>

        <section id="overview" v-show="activeTocHash === '#overview'">
          <div class="ld-section-number">01 / OVERVIEW</div>
          <h2>Overview</h2>
          <p>VAPTFIX.ai ("VAPTFIX," "we," "our," or "us") is a vulnerability management platform that helps organizations identify, assign, track, and remediate security vulnerabilities. VAPTFIX.ai is a product of Secureitabservices Inc, a Delaware corporation. The platform may integrate with third-party services, including Slack, to support notifications, remediation workflows, task assignments, and audit logging.</p>
          <p>VAPTFIX follows data-minimization, purpose-limitation, access-control, and secure-data-handling principles. Information is processed only as needed to provide, secure, and maintain the service, subject to applicable agreements and laws.</p>
          <p>General provisions apply to all users. The jurisdiction-specific notices later on this page supplement those provisions with rights and obligations specific to your location. Where local law provides greater protections, those protections apply.</p>
        </section>

        <section id="data-collected" v-show="activeTocHash === '#data-collected'">
          <div class="ld-section-number">02 / INFORMATION WE COLLECT</div>
          <h2>Information We Collect</h2>
          <p>The information VAPTFIX processes depends on how a customer uses the platform and which integrations are enabled. It may include the following categories.</p>

          <h3>Account, organization, and configuration information</h3>
          <p>Customer organization names; administrator names and business email addresses; user roles, permissions, and team assignments; subscription and billing-related information; account configuration and integration settings.</p>

          <h3>Vulnerability, asset, and assessment information</h3>
          <p>Asset names, IP addresses, and hostnames; CVE identifiers; CVSS scores and severity classifications; configuration benchmark results and security findings; assessment evidence, technical details, and supporting notes.</p>
          <p>Customers may upload supported security assessment reports and scanner exports. VAPTFIX processes these files to extract asset information, findings, severity classifications, technical evidence, and remediation details, and organizes the results in the customer's account for vulnerability management, reporting, and remediation tracking. Temporary processing files are handled under applicable retention and deletion procedures.</p>

          <h3>Remediation and support records</h3>
          <p>Task assignments and responsible users; remediation status changes and due dates; comments and supporting evidence; approval decisions and closure records; timeline-extension and support requests.</p>

          <h3>Operational, security, and audit information</h3>
          <p>User actions and timestamps; authentication and authorization events; application requests, errors, and performance information; administrative changes, data exports, and security-relevant events; relevant actions performed through the website, Slack, or authorized APIs. Sensitive credentials, OAuth tokens, and secrets are redacted from operational logs.</p>

          <h3>Slack integration information</h3>
          <p>OAuth access tokens used to authenticate authorized API requests; workspace and enterprise IDs and workspace names; Slack user IDs; display names and email addresses where permitted by granted permissions and available; authorized channel IDs; slash-command text, button clicks, form inputs, and other interactive payloads; timestamps of messages posted by VAPTFIX to update or close vulnerability cards.</p>
          <p>VAPTFIX requests only the Slack permissions needed for its documented functionality. It does not read, index, or store general Slack channel conversation history, or collect unrelated channel messages, files, or conversations that are not addressed to the app or needed for an authorized interaction. Slack-derived information is used to provide requested functionality, maintain security, enforce permissions, and support customer-authorized remediation workflows. VAPTFIX does not build behavioral profiles of Slack users or use Slack data for advertising.</p>
        </section>

        <section id="how-we-use" v-show="activeTocHash === '#how-we-use'">
          <div class="ld-section-number">03 / HOW WE USE INFORMATION</div>
          <h2>How We Use Information</h2>
          <ul>
            <li>Create and administer customer accounts, configure integrations, and provide support.</li>
            <li>Organize vulnerability findings, prioritize risks, assign remediation work, and track resolution.</li>
            <li>Execute user-requested actions through authorized platform and Slack workflows.</li>
            <li>Maintain auditability, troubleshoot errors, monitor service performance, detect misuse, and protect the platform.</li>
            <li>Meet contractual requirements and applicable legal obligations.</li>
          </ul>
          <p>Vulnerability and remediation data is treated as confidential customer information and processed to provide the contracted service. Slack data and customer vulnerability data are not used to train or fine-tune AI or machine-learning models, including third-party models. VAPTFIX may use AI-assisted processing to analyze customer-uploaded assessment reports, extract and classify findings, and generate remediation recommendations. Customer reports are not used to train or fine-tune VAPTFIX's own AI models. Any third-party AI processing is subject to applicable service terms, data-protection requirements, and security controls.</p>
        </section>

        <section id="storage" v-show="activeTocHash === '#storage'">
          <div class="ld-section-number">04 / STORAGE, HOSTING, AND SECURITY</div>
          <h2>Storage, Hosting, and Security</h2>
          <p>VAPTFIX stores application and customer data using its designated enterprise cloud infrastructure, database, and file-storage providers. Data is held in managed infrastructure rather than employee devices during normal production operations. Any authorized local handling for support or maintenance must follow applicable security controls. Hosting providers and regions depend on the deployed service configuration and the customer agreement.</p>
          <h3>Separation and access</h3>
          <ul>
            <li>Customer records are associated with the relevant customer account and logically separated. Application queries enforce customer-level access restrictions.</li>
            <li>Users may access only information permitted by their roles and customer-account permissions.</li>
            <li>Production data is accessible only to authorized personnel with a legitimate operational or support need. Support access requires a valid support ticket and is limited to the approved task's scope and duration.</li>
          </ul>
          <h3>Encryption and secrets</h3>
          <ul>
            <li>Connections use TLS 1.2 or higher.</li>
            <li>Databases, file storage, and backups are encrypted using AES-256 or equivalent controls supported by the applicable infrastructure.</li>
            <li>Slack OAuth tokens are encrypted at the field level using keys maintained through a managed key-management service. Tokens are not exposed through API responses or written to application logs.</li>
            <li>Application secrets and encryption keys are maintained in managed secrets or key-management facilities, with access restricted to authorized services and personnel. Keys and secrets are rotated at least annually and immediately when exposure is suspected.</li>
          </ul>
          <h3>Integration and operational safeguards</h3>
          <ul>
            <li>Incoming Slack requests are verified using Slack's request-signing mechanism and configured signing secret. Interactive actions are validated against applicable Slack security requirements; where interactive tokens are used, they are time-limited and validated before processing.</li>
            <li>Single sign-on and multi-factor authentication are required for applicable privileged and production-access workflows.</li>
            <li>Access rights are reviewed quarterly and removed within 24 hours of a role change or departure, where applicable.</li>
            <li>Production access, configuration changes, and data exports are logged to tamper-evident storage and monitored for anomalies.</li>
            <li>Personnel with access to customer information are subject to confidentiality obligations and annual security training.</li>
          </ul>
          <h3>Backups</h3>
          <p>Encrypted backups are taken daily and retained for up to 35 days before being overwritten, according to the applicable backup schedule. Backups are stored in the designated region for the deployment. Customers may request a specific hosting region where supported and agreed in the customer agreement.</p>
        </section>

        <section id="legal-basis" v-show="activeTocHash === '#legal-basis'">
          <div class="ld-section-number">04 / LEGAL BASES — WORLDWIDE</div>
          <h2>Legal Bases for Processing — Global Overview</h2>
          <p>VAPTFIX.ai identifies and documents a lawful basis for every processing activity. The applicable legal basis varies by jurisdiction. Jurisdiction-specific sections below provide detail. Our general lawful bases are:</p>
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

        <section id="gdpr" v-show="activeTocHash === '#gdpr'">
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

        <section id="usa" v-show="activeTocHash === '#usa'">
          <div class="ld-section-number">05-B / UNITED STATES</div>
          <h2>United States Jurisdiction Notice</h2>

          <h3>Federal Framework</h3>
          <p>No single comprehensive U.S. federal privacy law applies to VAPTFIX.ai. We comply with applicable sector-specific federal laws including COPPA (children's privacy — under-13 rule), CAN-SPAM (email marketing), and CFAA (computer fraud). We monitor federal legislative developments.</p>

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

        <section id="canada" v-show="activeTocHash === '#canada'">
          <div class="ld-section-number">05-C / CANADA</div>
          <h2>Canada Jurisdiction Notice</h2>

          <h3>Applicable Laws</h3>
          <ul>
            <li><strong>Federal:</strong> Personal Information Protection and Electronic Documents Act (PIPEDA); pending replacement by Bill C-27 (CPPA — Consumer Privacy Protection Act)</li>
            <li><strong>Quebec:</strong> Act Respecting the Protection of Personal Information in the Private Sector (Law 25 / Bill 64), fully in force September 2023</li>
            <li><strong>Alberta &amp; BC:</strong> PIPA (Personal Information Protection Act), substantially similar to PIPEDA</li>
          </ul>

          <h3>PIPEDA — 10 Fair Information Principles</h3>
          <p>VAPTFIX.ai complies with all 10 principles: accountability; identifying purposes; consent; limiting collection; limiting use/disclosure/retention; accuracy; safeguards; openness; individual access; challenging compliance.</p>

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

        <section id="brazil" v-show="activeTocHash === '#brazil'">
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

        <section id="australia" v-show="activeTocHash === '#australia'">
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

        <section id="japan" v-show="activeTocHash === '#japan'">
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

        <section id="southkorea" v-show="activeTocHash === '#southkorea'">
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

        <section id="china" v-show="activeTocHash === '#china'">
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

        <section id="india" v-show="activeTocHash === '#india'">
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

        <section id="singapore" v-show="activeTocHash === '#singapore'">
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

        <section id="thailand" v-show="activeTocHash === '#thailand'">
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

        <section id="southafrica" v-show="activeTocHash === '#southafrica'">
          <div class="ld-section-number">05-L / SOUTH AFRICA</div>
          <h2>South Africa — Protection of Personal Information Act (POPIA)</h2>

          <h3>Applicable Law</h3>
          <p>Protection of Personal Information Act 4 of 2013 (POPIA), fully effective July 2021, enforced by the Information Regulator of South Africa.</p>

          <h3>Eight Conditions for Lawful Processing</h3>
          <ul>
            <li><strong>Accountability:</strong> VAPTFIX.ai is responsible for ensuring POPIA compliance</li>
            <li><strong>Processing Limitation:</strong> Lawful, minimal, and with consent or grounds in Section 11</li>
            <li><strong>Purpose Specification:</strong> Collected for specific, explicitly defined, and lawful purposes (S.13–14)</li>
            <li><strong>Further Processing Limitation:</strong> Compatible with original purpose (S.15)</li>
            <li><strong>Information Quality:</strong> Complete, accurate, and not misleading (S.16)</li>
            <li><strong>Openness:</strong> This Policy satisfies S.18 notification requirements</li>
            <li><strong>Security Safeguards:</strong> Appropriate technical and organizational measures (S.19)</li>
            <li><strong>Data Subject Participation:</strong> Rights of access, correction, and objection (S.23–25)</li>
          </ul>

          <h3>Transfers Outside South Africa</h3>
          <p>Permitted where: recipient is subject to a law providing equivalent protection; data subject consents; or other S.72 exception applies. VAPTFIX.ai obtains appropriate transfer agreements for all cross-border data flows originating from South Africa.</p>

          <p>Contact: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. Information Regulator — <a href="https://inforegulator.org.za" target="_blank" rel="noopener">inforegulator.org.za</a>.</p>
        </section>

        <section id="middleeast" v-show="activeTocHash === '#middleeast'">
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

        <section id="latam" v-show="activeTocHash === '#latam'">
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

        <section id="newzealand" v-show="activeTocHash === '#newzealand'">
          <div class="ld-section-number">05-O / NEW ZEALAND</div>
          <h2>New Zealand — Privacy Act 2020</h2>
          <p>Privacy Act 2020, replacing the Privacy Act 1993, enforced by the Office of the Privacy Commissioner (OPC NZ). We comply with all 13 Information Privacy Principles (IPPs): collection from the individual where practicable; purpose specification; notification at collection; use and disclosure limitations; secure storage; access and correction rights. Mandatory breach notification: serious harm breaches reported to OPC and affected individuals as soon as practicable. Regulatory body: OPC NZ — <a href="https://www.privacy.org.nz" target="_blank" rel="noopener">privacy.org.nz</a>.</p>
        </section>

        <section id="israel" v-show="activeTocHash === '#israel'">
          <div class="ld-section-number">05-P / ISRAEL</div>
          <h2>Israel — Privacy Protection Law &amp; Amendment No. 13</h2>
          <p>Privacy Protection Law, 5741-1981, as significantly amended by Amendment No. 13 (enacted 2023, effective 2025), enforced by the Privacy Protection Authority (PPA). Israel holds an EU adequacy decision. Amendment 13 aligns Israeli law more closely with GDPR, introducing: data minimization; purpose limitation; DPO requirements; enhanced data subject rights (access, correction, deletion); mandatory security measures; breach notification obligations; and restrictions on cross-border transfers. Database registration requirements maintained where applicable. Regulatory body: PPA — <a href="https://www.gov.il/en/departments/the_privacy_protection_authority" target="_blank" rel="noopener">gov.il/PPA</a>.</p>
        </section>

        <!-- GLOBAL PROVISIONS -->

        <section id="sharing" v-show="activeTocHash === '#sharing'">
          <div class="ld-section-number">06 / SHARING AND SERVICE PROVIDERS</div>
          <h2>Sharing and Service Providers</h2>
          <p>VAPTFIX does not sell, rent, or share Slack data with third parties for their independent purposes. Information may be processed by authorized sub-processors when necessary to provide and maintain the service, including cloud hosting and infrastructure providers, database and file-storage providers, transactional email services, and error-monitoring or operational-support services.</p>
          <p>Sub-processors may process information only for authorized service purposes and are subject to appropriate contractual confidentiality, data-protection, and security obligations. VAPTFIX provides at least 30 days' notice before adding a new sub-processor, subject to the applicable customer agreement and legal requirements.</p>
          <p>VAPTFIX may disclose information when required by applicable law, valid legal process, or a binding order from a competent authority. Where legally permitted, VAPTFIX will notify the affected customer before disclosure.</p>
        </section>

        <section id="retention" v-show="activeTocHash === '#retention'">
          <div class="ld-section-number">07 / DATA RETENTION</div>
          <h2>Data Retention</h2>
          <p>VAPTFIX retains personal information and customer data only for as long as necessary to provide the service, meet contractual requirements, maintain security and auditability, and comply with applicable legal obligations. Unless law or a written customer agreement requires a different period, the following schedule applies:</p>
          <table class="ld-data-table">
            <thead>
              <tr><th>Data category</th><th>Retention period</th></tr>
            </thead>
            <tbody>
              <tr><td>Slack OAuth tokens</td><td>Deleted immediately after app uninstall or token revocation, subject to receipt and processing of the applicable event.</td></tr>
              <tr><td>Slack workspace, user, and channel identifiers; display names and email addresses</td><td>Deleted within 30 days after uninstall.</td></tr>
              <tr><td>Slash-command and interactive payloads</td><td>Retained only as relevant audit-log entries and deleted according to the audit-log schedule.</td></tr>
              <tr><td>Vulnerability findings and remediation records</td><td>Deleted within 30 days after contract termination, or earlier upon an approved customer request.</td></tr>
              <tr><td>Audit logs</td><td>Retained for 12 months from the event, unless the customer agreement specifies otherwise; deleted within 30 days after contract termination where a shorter contractual period applies.</td></tr>
              <tr><td>Operational logs</td><td>Rolling 30-day retention.</td></tr>
              <tr><td>Encrypted backups</td><td>Up to 35 days before being overwritten.</td></tr>
              <tr><td>Billing records</td><td>As required by applicable tax, accounting, and other legal obligations.</td></tr>
            </tbody>
          </table>
          <p>The periods above are subject to overriding legal retention obligations or documented contractual requirements. Customers may export vulnerability and remediation data in CSV or JSON before deletion where the platform supports the requested export.</p>
        </section>

        <section id="deletion" v-show="activeTocHash === '#deletion'">
          <div class="ld-section-number">08 / DELETION AND ACCOUNT CLOSURE</div>
          <h2>Deletion and Account Closure</h2>
          <p>VAPTFIX supports deletion following Slack app removal, token revocation, approved customer requests, and contract termination. Deletion requests may cover original uploaded files, extracted vulnerability records, generated reports, and associated customer data, subject to applicable legal and contractual retention requirements. Where third-party services process data on VAPTFIX's behalf, deletion is handled under the applicable service arrangements and retention requirements.</p>
          <h3>Slack app uninstall</h3>
          <p>After VAPTFIX receives and processes Slack's app_uninstalled event, associated OAuth tokens are deleted immediately and other Slack-derived data is deleted within 30 days. Relevant deletion activity is recorded without retaining the deleted content.</p>
          <h3>Token revocation</h3>
          <p>After VAPTFIX receives and processes a tokens_revoked event, affected OAuth tokens are deleted immediately. Related Slack-derived user data is deleted within 30 days where no other lawful or contractual retention requirement applies.</p>
          <h3>Customer deletion requests</h3>
          <p>An authorized workspace administrator or VAPTFIX account owner may email <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>. VAPTFIX verifies the request and the requester's authority. Approved requests are completed within 30 days, subject to applicable legal requirements, and confirmation is provided in writing.</p>
          <h3>Contract termination</h3>
          <p>Customer data is deleted within 30 days after subscription termination unless law or an agreed contractual obligation requires a different period.</p>
          <p>Deleted information may remain temporarily in encrypted backups until those backups are overwritten, within a maximum of 35 days under the standard schedule. Backups are not restored to reintroduce data that has been deleted. If disaster recovery restores an affected backup, applicable deletion requirements must be reapplied. VAPTFIX records relevant deletion activity, including date, data category, and requester where applicable, without retaining the deleted content.</p>
        </section>

        <section id="your-rights" v-show="activeTocHash === '#your-rights'">
          <div class="ld-section-number">09 / PRIVACY RIGHTS</div>
          <h2>Privacy Rights and Responsibilities</h2>
          <p>Depending on applicable data-protection laws, individuals may have rights to request access to, correction of, export of, or deletion of their personal information, and may have additional rights concerning processing.</p>
          <p>Where a customer determines the purposes and means of processing information within its workspace, that customer generally acts as the data controller and VAPTFIX acts as its service provider or data processor, as applicable. Requests concerning personal data associated with a customer workspace may be referred to the relevant customer. VAPTFIX assists customers with applicable data-protection obligations in accordance with its contractual commitments and legal requirements.</p>
          <p>Privacy requests may be submitted to <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>.</p>
        </section>


        <section id="cookies" v-show="activeTocHash === '#cookies'">
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

        <section id="international" v-show="activeTocHash === '#international'">
          <div class="ld-section-number">10 / CROSS-BORDER TRANSFERS</div>
          <h2>International Data Transfers</h2>
          <p>VAPTFIX.ai operates infrastructure across multiple regions. Personal data may be transferred internationally. We select safeguards based on the origin and destination of each data flow:</p>
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

        <section id="incidents" v-show="activeTocHash === '#incidents'">
          <div class="ld-section-number">12 / SECURITY INCIDENTS</div>
          <h2>Security Incidents and Breach Notification</h2>
          <p>VAPTFIX maintains processes to identify, investigate, contain, and respond to security incidents affecting customer information. Where a confirmed personal-data breach or security incident affects customer data, VAPTFIX will notify the affected customer without undue delay and within 72 hours of confirmation, in accordance with applicable contractual commitments and legal requirements.</p>
          <p>Notifications will include available information about the nature of the incident, categories of data affected, known or reasonably identifiable impacts, containment and remediation measures taken or planned, and relevant follow-up actions. Where Slack OAuth tokens may have been exposed, VAPTFIX will revoke and rotate affected credentials as appropriate and investigate potential unauthorized access. VAPTFIX will cooperate with affected customers in investigation, remediation, and applicable notification obligations.</p>
        </section>

        <section id="changes" v-show="activeTocHash === '#changes'">
          <div class="ld-section-number">13 / CHANGES TO THIS POLICY</div>
          <h2>Changes to This Policy</h2>
          <p>VAPTFIX may update this Privacy Policy to reflect changes in integrations, data-processing practices, security controls, service functionality, or legal obligations. Material changes will be published on this page, and customer administrators will be notified by email at least 30 days before changes take effect, subject to applicable legal requirements and contractual terms. The version number and last-updated date will be revised whenever this policy is updated. Continued use of the service after the effective date of an update is subject to applicable contractual terms and legal requirements.</p>
        </section>

        <section id="contact" v-show="activeTocHash === '#contact'">
          <div class="ld-section-number">14 / CONTACT</div>
          <h2>Contact Information</h2>
          <div class="ld-callout">
            <p>
              For privacy requests, data access, correction, export, or deletion inquiries: <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a><br />
              For security vulnerabilities and security incident reports: <a href="mailto:security@vaptfix.ai">security@vaptfix.ai</a><br />
              Please do not include passwords, OAuth tokens, or other sensitive credentials in email communications.
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
      activeTocHash: '#overview',
      _scrollSpyLocked: false,
      _scrollSpyUnlockTimer: null,
      tocItems: [
        { type: 'group', label: 'General' },
        { type: 'link', href: '#overview', label: 'Overview' },
        { type: 'link', href: '#data-collected', label: 'Information We Collect' },
        { type: 'link', href: '#how-we-use', label: 'How We Use Information' },
        { type: 'link', href: '#storage', label: 'Storage, Hosting, and Security' },
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
        { type: 'link', href: '#sharing', label: 'Sharing and Service Providers' },
        { type: 'link', href: '#retention', label: 'Data Retention' },
        { type: 'link', href: '#deletion', label: 'Deletion and Account Closure' },
        { type: 'link', href: '#your-rights', label: 'Privacy Rights' },
        { type: 'link', href: '#cookies', label: 'Cookies' },
        { type: 'link', href: '#international', label: 'Cross-Border Transfers' },
        { type: 'link', href: '#incidents', label: 'Security Incidents' },
        { type: 'link', href: '#changes', label: 'Changes to This Policy' },
        { type: 'link', href: '#contact', label: 'Contact Information' },
      ],
    };
  },
  watch: {
    '$route.hash'() {
      this.$nextTick(() => this.syncTocFromRoute());
    },
    activeTocHash() {
      this.$nextTick(() => this.ensureActiveTocVisible());
    },
  },
  mounted() {
    this.$nextTick(() => this.syncTocFromRoute());
  },
  beforeUnmount() {
    if (this._scrollSpyUnlockTimer) clearTimeout(this._scrollSpyUnlockTimer);
  },
  computed: {
    activeSectionLabel() {
      const active = this.tocItems.find(i => i.type === 'link' && i.href === this.activeTocHash);
      return active ? active.label : 'Privacy Policy';
    },
    tocLinkItems() {
      return this.tocItems.filter((i) => i.type === 'link' && i.href);
    },
  },
  methods: {
    selectSection(href) {
      this.activeTocHash = href;
      if (typeof history !== 'undefined' && history.replaceState) {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}${href}`);
      }
    },
    lockWindowScroll() {
      if (window.matchMedia('(min-width: 769px)').matches && window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    },
    getContentScroller() {
      return this.$refs.contentScroller || this.$el?.querySelector?.('.ld-content');
    },
    stickyOffset() {
      return 24;
    },
    syncTocFromRoute() {
      const hashes = this.tocLinkItems.map((i) => i.href);
      const h = this.$route.hash;
      if (h && hashes.includes(h)) this.activeTocHash = h;
      else if (!this.activeTocHash) this.activeTocHash = hashes[0] || '';
    },
    onContentScroll() {
      if (this._scrollSpyLocked) return;
      this.updateActiveFromScroll();
    },
    updateActiveFromScroll() {
      const links = this.tocLinkItems;
      const scroller = this.getContentScroller();
      if (!links.length || !scroller) return;

      const offset = this.stickyOffset();
      const scrollerTop = scroller.getBoundingClientRect().top;
      let current = links[0]?.href || '';

      for (const item of links) {
        const el = scroller.querySelector(item.href);
        if (!el) continue;
        const top = el.getBoundingClientRect().top - scrollerTop;
        if (top <= offset) current = item.href;
      }

      if (scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 8) {
        current = links[links.length - 1]?.href || current;
      }

      if (current && current !== this.activeTocHash) {
        this.activeTocHash = current;
        if (typeof history !== 'undefined' && history.replaceState) {
          const url = `${window.location.pathname}${window.location.search}${current}`;
          history.replaceState(null, '', url);
        }
      }
    },
    ensureActiveTocVisible() {
      const nav = this.$refs.tocNav;
      if (!nav) return;
      const active = nav.querySelector('a.is-active');
      if (!active) return;
      active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    },
    scrollContentToHash(href) {
      if (!href || !href.startsWith('#')) return;
      const id = href.slice(1);
      const scroller = this.getContentScroller();
      const target = scroller?.querySelector?.(`#${CSS.escape(id)}`);
      if (!target || !scroller) return;

      this.lockWindowScroll();
      this._scrollSpyLocked = true;
      if (this._scrollSpyUnlockTimer) clearTimeout(this._scrollSpyUnlockTimer);

      if (window.matchMedia('(min-width: 769px)').matches) {
        const sRect = scroller.getBoundingClientRect();
        const tRect = target.getBoundingClientRect();
        const top = scroller.scrollTop + (tRect.top - sRect.top) - this.stickyOffset() + 8;
        scroller.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      this._scrollSpyUnlockTimer = setTimeout(() => {
        this._scrollSpyLocked = false;
        this.updateActiveFromScroll();
      }, 450);
    },
    onTocNavClick(e) {
      const a = e.target.closest?.('a[href^="#"]');
      if (!a || !e.currentTarget.contains(a)) return;
      const href = a.getAttribute('href');
      if (!href) return;
      e.preventDefault();
      e.stopPropagation();
      this.activeTocHash = href;
      if (typeof history !== 'undefined' && history.replaceState) {
        const url = `${window.location.pathname}${window.location.search}${href}`;
        history.replaceState(null, '', url);
      }
      this.lockWindowScroll();
      this.$nextTick(() => this.scrollContentToHash(href));
    },
  },
};
</script>

<style scoped>
/* Outer shell: full viewport; inner frame is the centered "page" */
.legal-page-root {
  min-height: 100vh;
  padding-top: 72px;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  box-sizing: border-box;
}

.legal-page-frame {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.ld-page {
  display: flex;
  width: 100%;
  margin: 0;
  padding: 0;
  gap: 0;
  align-items: stretch;
}

.ld-sidebar {
  width: 248px;
  flex-shrink: 0;
  align-self: stretch;
  position: relative;
  z-index: 1015;
  margin: 0;
  padding: 1.25rem 0 1rem;
  border-right: 1px solid rgba(15, 105, 110, 0.1);
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.ld-sidebar::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.ld-sidebar-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: #0f696e;
  text-transform: uppercase;
  margin: 0 0 0.75rem;
  padding: 0 0 10px 8px;
  border-bottom: 2px solid rgba(15,105,110,0.15);
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
  gap: 1px;
}

.ld-sidebar nav a {
  font-family: 'Inter', sans-serif;
  font-size: 13.5px;
  font-weight: 400;
  color: #64748b;
  padding: 8px 12px 8px 8px;
  border-radius: 0;
  border-left: 3px solid transparent;
  transition: all 0.18s ease;
  line-height: 1.45;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 7px;
}

.ld-sidebar nav a::before {
  content: '';
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
  transition: background 0.18s;
}

.ld-sidebar nav a:hover {
  color: #0f696e;
  background: rgba(15, 105, 110, 0.06);
  border-left-color: rgba(15, 105, 110, 0.3);
  text-decoration: none;
}

.ld-sidebar nav a:hover::before { background: #0f696e; }

.ld-sidebar nav a.is-active {
  color: #0f696e;
  background: linear-gradient(90deg, rgba(15,105,110,0.12), rgba(15,105,110,0.04));
  border-left-color: #0f696e;
  font-weight: 700;
  text-decoration: none;
}

.ld-sidebar nav a.is-active::before {
  background: #0f696e;
  width: 6px;
  height: 6px;
  box-shadow: 0 0 0 3px rgba(15, 105, 110, 0.25);
}

.ld-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 0;
  overflow: hidden;
  background: #ffffff;
}

.ld-doc-header {
  position: relative;
  flex-shrink: 0;
  z-index: 5;
  width: 100%;
  margin: 0;
  padding: 0.6rem clamp(1.5rem, 4vw, 3rem) 0.5rem clamp(1.75rem, 3.5vw, 2.75rem);
  border-bottom: 1px solid rgba(15, 105, 110, 0.12);
  background: #ffffff;
  background-image: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  box-shadow: 0 8px 16px -12px rgba(36, 20, 71, 0.18);
}

.ld-content {
  flex: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
  z-index: 0;
  padding: 1.25rem clamp(1.5rem, 4vw, 3rem) 2.5rem clamp(1.75rem, 3.5vw, 2.75rem);
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  background: #ffffff;
}

.ld-content::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.ld-doc-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.06);
  border: 1px solid rgba(15, 105, 110, 0.18);
  padding: 5px 14px;
  border-radius: 99px;
  margin-bottom: 0;
  text-transform: uppercase;
}

.ld-doc-tag::before {
  content: '●';
  font-size: 7px;
}

.ld-doc-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.75rem, 3vw, 2.25rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.2;
  margin-bottom: 0;
  letter-spacing: -0.01em;
  padding-bottom: 6px;
  border-bottom: 3px solid #0f696e;
  display: inline-block;
}

.ld-doc-meta {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.5;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.ld-doc-meta strong {
  color: #64748b;
  font-weight: 600;
}

section {
  margin-bottom: 4rem;
  padding-top: 0.5rem;
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
  font-size: 20px;
  font-weight: 700;
  line-height: 1.35;
  color: #241447;
  margin-top: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.08);
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
  margin-bottom: 1rem;
  font-weight: 400;
  line-height: 1.75;
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
  background: linear-gradient(135deg, rgba(15,105,110,0.04), rgba(15,105,110,0.01));
  border: 1px solid rgba(15, 105, 110, 0.14);
  border-left: 4px solid #0f696e;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  margin: 2rem 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.75;
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
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ld-page {
    flex: 1 1 auto;
    min-height: 0;
    height: 100%;
    overflow: hidden;
  }

  .ld-sidebar {
    height: 100%;
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ld-sidebar::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  /* Right column: fixed header + scrolling body */
  .ld-main {
    flex: 1 1 auto;
    min-height: 0;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ld-doc-header {
    position: relative;
    flex-shrink: 0;
    top: auto;
  }

  .ld-content {
    flex: 1 1 auto;
    min-height: 0;
    height: auto;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .ld-content::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }

  .ld-content > section {
    scroll-margin-top: 1rem;
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
    padding: 0 1rem 2.5rem;
  }

  .ld-page {
    flex-direction: column;
    flex: none;
    overflow: visible;
    min-height: 0;
    height: auto;
    padding: 1.25rem 0 2rem;
  }

  .ld-main {
    overflow: visible;
    height: auto;
    display: block;
  }

  .ld-doc-header {
    padding-left: 0;
    padding-right: 0;
    position: static;
    box-shadow: none;
  }

  .ld-content {
    overflow: visible;
    height: auto;
    padding: 0;
  }

  .ld-sidebar {
    width: 100%;
    position: static;
    height: auto;
    max-height: none;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid rgba(15, 105, 110, 0.12);
    padding: 0 0 1rem;
    margin-bottom: 1.25rem;
  }

  .ld-jurisdiction-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  }
}
</style>
