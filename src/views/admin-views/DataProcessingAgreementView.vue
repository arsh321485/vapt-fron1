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
            <div class="ld-doc-tag">Global DPA · GDPR · CCPA · LGPD · PIPL · 15+ Frameworks</div>
            <h1 class="ld-doc-title">Data Processing<br />Agreement</h1>
            <p class="ld-doc-meta">
              <strong>Effective Date:</strong> May 12, 2025 &nbsp;|&nbsp;
              <strong>Version:</strong> 2.0 — Global Edition &nbsp;|&nbsp;
              <strong>Scope:</strong> Worldwide
            </p>
          </div>

          <div class="ld-callout">
            <p>This Data Processing Agreement ("DPA") is entered into between the Customer ("Controller") and VaptFix.ai ("Processor"), and forms part of the VaptFix.ai Terms of Service. This DPA governs VaptFix.ai's processing of personal data on behalf of the Customer under applicable data protection laws globally, including GDPR, UK GDPR, Swiss revFADP, CCPA/CPRA, LGPD, PIPL, PDPA (Singapore), PDPA (Thailand), PIPA (South Korea), APPI (Japan), POPIA (South Africa), UAE PDPL, Saudi Arabia PDPL, India DPDP Act, Australian Privacy Act, and other applicable frameworks.</p>
          </div>

          <!-- CORE PROVISIONS -->

          <section id="background">
            <div class="ld-section-number">01 / BACKGROUND &amp; PARTIES</div>
            <h2>Background &amp; Parties</h2>
            <p>This DPA applies whenever VaptFix.ai processes personal data on behalf of the Customer as part of delivering the Service. The parties acknowledge that:</p>
            <ul>
              <li>The <strong>Customer</strong> is the Data Controller (or equivalent designee under applicable law), determining the purposes and means of processing</li>
              <li><strong>VaptFix.ai</strong> is the Data Processor (or equivalent service provider/operator/data handler under applicable law), processing personal data solely on behalf of and under the instructions of the Customer</li>
              <li>This DPA supplements and is incorporated into the VaptFix.ai <router-link to="/terms">Terms of Service</router-link>; in the event of conflict regarding data protection matters, this DPA prevails</li>
              <li>Jurisdiction-specific addenda (Sections 11-A through 11-J) apply as supplemental terms wherever the Customer processes data of individuals in those jurisdictions</li>
            </ul>
          </section>

          <section id="definitions">
            <div class="ld-section-number">02 / DEFINITIONS</div>
            <h2>Definitions</h2>
            <table class="ld-data-table">
              <thead><tr><th>Term</th><th>Definition</th></tr></thead>
              <tbody>
                <tr><td>Personal Data</td><td>Any information relating to an identified or identifiable natural person; or equivalent concept under applicable law (e.g., "personal information" under CCPA, "dados pessoais" under LGPD, "个人信息" under PIPL)</td></tr>
                <tr><td>Processing</td><td>Any operation performed on Personal Data, as defined in Art. 4(2) GDPR or equivalent under applicable law</td></tr>
                <tr><td>Controller / Business</td><td>The entity determining the purposes and means of processing (GDPR: Controller; CCPA: Business; LGPD: Controlador; PIPL: Personal Information Handler)</td></tr>
                <tr><td>Processor / Service Provider</td><td>VaptFix.ai processing Personal Data on behalf of the Controller (GDPR: Processor; CCPA: Service Provider; LGPD: Operador; PIPL: Entrusted Party)</td></tr>
                <tr><td>Sub-processor</td><td>A third-party engaged by VaptFix.ai to process Personal Data on behalf of the Customer</td></tr>
                <tr><td>Standard Contractual Clauses (SCCs)</td><td>EU Commission Decision 2021/914 clauses; UK IDTA; and equivalent approved clauses under other jurisdictions</td></tr>
                <tr><td>Data Breach</td><td>A breach of security leading to accidental or unlawful destruction, loss, alteration, or unauthorized disclosure of or access to Personal Data</td></tr>
                <tr><td>Supervisory Authority</td><td>A data protection authority competent for the Customer or VaptFix.ai in the relevant jurisdiction</td></tr>
                <tr><td>Sensitive Personal Data</td><td>Special categories of personal data including health, biometric, racial/ethnic origin, religious beliefs, political opinions, financial data, and data of minors, as defined by applicable law</td></tr>
              </tbody>
            </table>
          </section>

          <section id="scope">
            <div class="ld-section-number">03 / SCOPE OF PROCESSING</div>
            <h2>Scope of Processing</h2>
            <p>VaptFix.ai shall process Personal Data only:</p>
            <ul>
              <li>To provide the Service as described in the Terms of Service and the Customer's account configuration</li>
              <li>In accordance with the Customer's documented lawful instructions, as supplemented by this DPA</li>
              <li>As required by applicable Union, Member State, or national law (in which case VaptFix.ai will inform the Customer unless legally prohibited from doing so)</li>
              <li>To the extent necessary to comply with VaptFix.ai's own legal obligations as a data processor/service provider</li>
            </ul>
            <p>The nature, purpose, types of Personal Data processed, and categories of Data Subjects are set out in <strong>Annex A</strong>. VaptFix.ai will not process Personal Data for its own commercial purposes, including selling or sharing personal data as defined under CCPA/CPRA, or equivalent prohibitions under other applicable laws.</p>
          </section>

          <section id="obligations">
            <div class="ld-section-number">04 / PROCESSOR OBLIGATIONS</div>
            <h2>VaptFix.ai Obligations as Processor</h2>
            <p>VaptFix.ai shall:</p>
            <ul>
              <li>Process Personal Data only on documented instructions from the Customer or as required by applicable law</li>
              <li>Ensure all personnel authorized to process Personal Data are bound by written confidentiality obligations</li>
              <li>Implement and maintain the technical and organizational security measures set out in Annex C</li>
              <li>Assist the Customer in fulfilling obligations regarding Data Subject rights within the timeframes required by applicable law per jurisdiction (reference: Annex D, Column "DSR Response Time")</li>
              <li>Assist the Customer with DPIAs (GDPR Art. 35), PIAs (Quebec Law 25), and prior consultations with supervisory authorities where required</li>
              <li>Not engage Sub-processors without prior written authorization from the Customer (general authorization granted via Annex B; specific authorization required for additions)</li>
              <li>Delete or return all Personal Data upon termination, within 30 days, at the Customer's election</li>
              <li>Make available all information necessary to demonstrate compliance with this DPA and applicable law</li>
              <li>Notify the Customer without undue delay if, in VaptFix.ai's opinion, an instruction infringes applicable data protection law</li>
              <li>Not sell Personal Data or share it for cross-context behavioral advertising, consistent with CCPA/CPRA and equivalent prohibitions</li>
              <li>Maintain records of processing activities (GDPR Art. 30(2)) and equivalent records under applicable law</li>
            </ul>
          </section>

          <section id="controller">
            <div class="ld-section-number">05 / CONTROLLER OBLIGATIONS</div>
            <h2>Customer Obligations as Controller</h2>
            <p>The Customer shall:</p>
            <ul>
              <li>Ensure that its instructions for processing comply with applicable data protection laws in all relevant jurisdictions</li>
              <li>Provide and maintain the lawful basis for each processing activity and ensure Data Subjects have been appropriately informed</li>
              <li>Conduct DPIAs, PIAs, and equivalent risk assessments where required by applicable law before commencing new processing</li>
              <li>Not instruct VaptFix.ai to process Personal Data in a manner that violates applicable law</li>
              <li>Ensure that all cross-border data transfers it directs VaptFix.ai to make comply with applicable transfer restrictions</li>
              <li>Promptly inform VaptFix.ai of any data subject requests received directly by the Customer that require VaptFix.ai's assistance</li>
              <li>Notify VaptFix.ai if the Customer becomes aware of any actual or suspected data breach involving VaptFix.ai systems</li>
            </ul>
          </section>

          <section id="security-measures">
            <div class="ld-section-number">06 / SECURITY MEASURES</div>
            <h2>Technical &amp; Organizational Security Measures</h2>
            <p>VaptFix.ai implements appropriate technical and organizational measures to ensure a level of security appropriate to the risk of processing, as required by Art. 32 GDPR and equivalent provisions in LGPD (Art. 46), PIPL (Art. 51), PIPA (Art. 29), PDPA Singapore (S.24), PDPA Thailand (S.37), POPIA (S.19), APPI (Art. 23), and other applicable laws. The specific measures are documented in <strong>Annex C</strong> and our public <router-link to="/security">Security Statement</router-link>.</p>
          </section>

          <section id="subprocessors">
            <div class="ld-section-number">07 / SUB-PROCESSORS</div>
            <h2>Sub-processor Management</h2>
            <p>The Customer grants VaptFix.ai general written authorization to engage the sub-processors listed in <strong>Annex B</strong>. VaptFix.ai shall:</p>
            <ul>
              <li>Notify the Customer at least 14 days in advance of any intended addition or replacement of sub-processors</li>
              <li>Allow the Customer to reasonably object to new sub-processors within 14 days of notification; if the parties cannot resolve an objection, either party may terminate the affected Service components</li>
              <li>Impose data protection obligations on all sub-processors by written contract equivalent to those in this DPA</li>
              <li>Ensure sub-processors comply with the applicable jurisdiction-specific requirements for their processing activities</li>
              <li>Remain fully liable to the Customer for any failure by a sub-processor to fulfil its data protection obligations</li>
            </ul>
            <p>The current sub-processor list and update notifications are published at <a href="https://vaptfix.ai/sub-processors" target="_blank" rel="noopener">vaptfix.ai/sub-processors</a>.</p>
          </section>

          <section id="data-subject">
            <div class="ld-section-number">08 / DATA SUBJECT RIGHTS</div>
            <h2>Data Subject Rights Assistance</h2>
            <p>VaptFix.ai will promptly notify the Customer (no later than 3 business days) of any Data Subject request received directly. VaptFix.ai will provide reasonable technical and organizational assistance to enable the Customer to respond to data subject rights requests within the timeframes required by applicable law, including:</p>
            <ul>
              <li>Access, rectification, erasure, restriction, portability, objection, and withdrawal of consent (GDPR; LGPD; PIPL; PDPA; PIPA; APPI; POPIA)</li>
              <li>Right to Know, Right to Delete, Right to Correct, and Opt-Out of Sale/Sharing (CCPA/CPRA)</li>
              <li>ARCO rights — Acceso, Rectificación, Cancelación, Oposición (Mexico LFPDPPP; Colombia Ley 1581; Peru Ley 29733)</li>
              <li>Access and correction rights (Australia APPs; New Zealand Privacy Act 2020)</li>
              <li>De-indexation and portability rights (Quebec Law 25)</li>
              <li>Nomination rights and grievance redressal (India DPDP Act)</li>
            </ul>
            <p>VaptFix.ai will not respond directly to Data Subjects without Customer authorization, except as required by applicable law. All Data Subject requests should be routed via <a href="mailto:privacy@vaptfix.ai">privacy@vaptfix.ai</a>.</p>
          </section>

          <section id="breach">
            <div class="ld-section-number">09 / BREACH NOTIFICATION — GLOBAL TIMELINES</div>
            <h2>Personal Data Breach Notification</h2>
            <p>Upon becoming aware of a Personal Data Breach affecting Customer data, VaptFix.ai shall notify the Customer without undue delay. VaptFix.ai's internal SLA is notification to the Customer within <strong>24 hours</strong> of awareness. The Customer is then responsible for notifying Supervisory Authorities and affected individuals in accordance with applicable law. VaptFix.ai will provide all information necessary to support such notifications.</p>
            <table class="ld-data-table">
              <thead>
                <tr><th>Jurisdiction / Law</th><th>Authority Notification</th><th>Individual Notification</th><th>Regulatory Body</th></tr>
              </thead>
              <tbody>
                <tr><td>EU — GDPR</td><td>72 hours of awareness (Art. 33)</td><td>Without undue delay if high risk (Art. 34)</td><td>Lead Supervisory Authority</td></tr>
                <tr><td>UK — UK GDPR</td><td>72 hours of awareness</td><td>Without undue delay if high risk</td><td>ICO</td></tr>
                <tr><td>Switzerland — revFADP</td><td>Without delay (serious breaches)</td><td>Where necessary to protect affected persons</td><td>FDPIC</td></tr>
                <tr><td>USA — CCPA/CPRA (CA)</td><td>No mandatory DPA notification; notify individuals in "most expedient time possible"</td><td>As soon as reasonably possible (Cal. Civ. Code §1798.82)</td><td>California AG / CPPA</td></tr>
                <tr><td>Canada — PIPEDA</td><td>As soon as feasible (real risk of significant harm)</td><td>As soon as feasible</td><td>Office of the Privacy Commissioner (OPC)</td></tr>
                <tr><td>Canada — Quebec Law 25</td><td>Within 72 hours of awareness of confidentiality incident</td><td>As soon as possible if risk of serious harm</td><td>CAI</td></tr>
                <tr><td>Brazil — LGPD</td><td>Within reasonable time (ANPD to specify); generally 72 hours guidance</td><td>Promptly, if likely to cause harm (Art. 48)</td><td>ANPD</td></tr>
                <tr><td>Australia — NDB Scheme</td><td>As soon as practicable after becoming aware of eligible breach</td><td>As soon as practicable</td><td>OAIC</td></tr>
                <tr><td>Japan — APPI</td><td>Without delay to PPC (reportable incidents)</td><td>Without delay to affected persons</td><td>PPC</td></tr>
                <tr><td>South Korea — PIPA</td><td>Without delay to PIPC and KISA</td><td>Without delay to affected individuals (Art. 34)</td><td>PIPC</td></tr>
                <tr><td>China — PIPL</td><td>Immediately to CAC (Art. 57)</td><td>Immediately if cannot prevent harm</td><td>CAC</td></tr>
                <tr><td>Singapore — PDPA</td><td>Within 3 business days of awareness (PDPC)</td><td>As soon as practicable if significant harm</td><td>PDPC</td></tr>
                <tr><td>Thailand — PDPA</td><td>Within 72 hours to PDPC (S.37(3))</td><td>Without delay if high risk of harm</td><td>PDPC Thailand</td></tr>
                <tr><td>South Africa — POPIA</td><td>As soon as reasonably possible to Information Regulator</td><td>As soon as reasonably possible</td><td>Information Regulator</td></tr>
                <tr><td>India — DPDP Act</td><td>In prescribed manner upon discovery (S.8(6))</td><td>As prescribed by rules — notify Board and Data Principals</td><td>Data Protection Board of India</td></tr>
                <tr><td>UAE — PDPL</td><td>Notify UAE Data Office without delay for serious breaches</td><td>Without delay where significant harm risk</td><td>UAE Data Office</td></tr>
                <tr><td>Saudi Arabia — PDPL</td><td>Within 72 hours to NDMO for material breaches</td><td>Without delay to affected individuals</td><td>SDAIA / NDMO</td></tr>
                <tr><td>New Zealand — Privacy Act 2020</td><td>As soon as reasonably practicable (serious harm)</td><td>As soon as reasonably practicable</td><td>OPC NZ</td></tr>
                <tr><td>Israel — Privacy Protection Law</td><td>Without delay to PPA for significant breaches</td><td>Without delay to affected persons</td><td>Privacy Protection Authority</td></tr>
              </tbody>
            </table>
          </section>

          <!-- CROSS-BORDER TRANSFER SECTIONS -->

          <section id="transfers-eu">
            <div class="ld-section-number">10-A / TRANSFERS — EU / UK / SWITZERLAND</div>
            <h2>EU, UK &amp; Swiss Cross-Border Transfers</h2>

            <h3>EU — Standard Contractual Clauses (SCCs)</h3>
            <p>Where personal data of EEA individuals is transferred to countries not covered by an EC adequacy decision, the parties agree to be bound by the Standard Contractual Clauses for the transfer of personal data to third countries pursuant to EU Commission Implementing Decision 2021/914 (Module 2: Controller to Processor). The SCCs are incorporated into this DPA by reference. Annex I, II, and III of the SCCs are fulfilled by Annexes A, B, and C of this DPA respectively. A Transfer Impact Assessment (TIA) is conducted and documented for each destination country.</p>

            <h3>UK — International Data Transfer Agreement (IDTA)</h3>
            <p>For transfers of personal data governed by UK GDPR to countries without a UK adequacy decision, the UK International Data Transfer Agreement (IDTA) issued by the ICO (as periodically updated) is incorporated into this DPA. The Addendum to EU SCCs may be used where applicable.</p>

            <h3>Switzerland — Swiss SCCs</h3>
            <p>For transfers of personal data governed by the revFADP to countries not on the Federal Council's adequacy list, the Swiss Standard Contractual Clauses (SCC-CH, as approved by the FDPIC) are incorporated. The DPA may be updated to reference the latest Swiss SCC version as approved by the FDPIC.</p>
          </section>

          <section id="transfers-usa">
            <div class="ld-section-number">10-B / TRANSFERS — UNITED STATES</div>
            <h2>United States Cross-Border Transfers</h2>
            <p>VaptFix.ai participates in the EU–U.S. Data Privacy Framework (DPF), UK Extension to the DPF, and Swiss–U.S. DPF as applicable, and is certified to receive personal data transferred under those frameworks. VaptFix.ai commits to apply DPF principles to personal data received from EU/UK/Swiss entities.</p>
            <p>For CCPA/CPRA: VaptFix.ai acts as a "Service Provider" (and not a "Third Party" or "Data Broker") with respect to Customer personal information. VaptFix.ai is prohibited from: (i) selling or sharing the personal information; (ii) retaining, using, or disclosing the personal information for any purpose other than the business purpose specified in the Terms of Service; (iii) retaining, using, or disclosing personal information outside the direct business relationship. VaptFix.ai certifies understanding of and compliance with these limitations.</p>
          </section>

          <section id="transfers-brazil">
            <div class="ld-section-number">10-C / TRANSFERS — BRAZIL</div>
            <h2>Brazil (LGPD) Cross-Border Transfers</h2>
            <p>Transfers of personal data of Brazilian data subjects outside Brazil are conducted only in accordance with LGPD Art. 33, relying on: (i) a country or international body providing an adequate level of protection as recognized by the ANPD; (ii) contractual clauses or specific clauses approved by the ANPD between the Controller and Processor; (iii) binding global corporate rules; or (iv) the data subject's specific consent. VaptFix.ai will execute ANPD-approved standard clauses upon availability, and currently relies on contractual protections equivalent to those required by the ANPD pending formal clause approval.</p>
          </section>

          <section id="transfers-korea">
            <div class="ld-section-number">10-D / TRANSFERS — SOUTH KOREA</div>
            <h2>South Korea (PIPA) Cross-Border Transfers</h2>
            <p>For cross-border transfers of personal information of Korean data subjects, VaptFix.ai complies with PIPA Art. 28-8 (as amended 2023). Transfers are made on the basis of: (i) individual consent following notification of transfer details; (ii) contractual necessity; (iii) PIPC standard clauses; or (iv) an international agreement or PIPC adequacy recognition. VaptFix.ai maintains records of all such transfers and provides Customer with transfer mechanism documentation upon request.</p>
          </section>

          <section id="transfers-china">
            <div class="ld-section-number">10-E / TRANSFERS — CHINA (PIPL)</div>
            <h2>China (PIPL) Cross-Border Transfers</h2>
            <p>For personal information of individuals in the People's Republic of China, cross-border transfers are subject to strict requirements under PIPL Art. 38–40. VaptFix.ai employs the following mechanisms as applicable:</p>
            <ul>
              <li><strong>CAC Security Assessment:</strong> Where required (large-scale processors or sensitive data categories), passing a CAC security assessment before cross-border transfer</li>
              <li><strong>Personal Information Protection Certification:</strong> Certification issued by a CAC-recognized institution</li>
              <li><strong>CAC Standard Contract:</strong> Signing of the Measures for Standard Contract for Cross-border Transfer of Personal Information (effective June 2023); filing with competent CAC office</li>
              <li><strong>Individual Consent:</strong> Separate, explicit informed consent from each data subject for outbound transfer (PIPL Art. 39), in addition to any of the above mechanisms</li>
            </ul>
            <p>VaptFix.ai maintains a register of all cross-border transfers of personal information originating from China and provides the Customer with documentation of the applicable transfer mechanism.</p>
          </section>

          <section id="transfers-india">
            <div class="ld-section-number">10-F / TRANSFERS — INDIA</div>
            <h2>India (DPDP Act) Cross-Border Transfers</h2>
            <p>Cross-border transfers of personal data of Indian Data Principals are permitted to countries notified by the Central Government as providing adequate protection. VaptFix.ai will monitor the Central Government's published list of permitted transfer destinations and will not route Indian personal data to restricted destinations. Pending the government's notification of the permitted country list, VaptFix.ai maintains contractual safeguards with all sub-processors receiving Indian personal data. VaptFix.ai will promptly notify the Customer of any restrictions that affect processing flows upon implementation of rules.</p>
          </section>

          <section id="transfers-apac">
            <div class="ld-section-number">10-G / TRANSFERS — APAC (SG / TH / AU / JP / NZ)</div>
            <h2>Asia-Pacific Cross-Border Transfers</h2>

            <h3>Singapore (PDPA S.26)</h3>
            <p>Before transferring personal data outside Singapore, VaptFix.ai ensures the recipient is bound by contractual obligations providing a standard of protection comparable to the PDPA, using PDPC-approved Data Transfer Agreements (DTAs) or equivalent contractual clauses. Transfer documentation maintained per PDPC Advisory Guidelines on Cross-Border Data Transfers.</p>

            <h3>Thailand (PDPA S.28)</h3>
            <p>Transfers of personal data of Thai data subjects to countries with inadequate protection are made only with the explicit consent of the data subject, or pursuant to PDPC-approved standard contractual clauses for international transfers, or other lawful basis under PDPA S.28. VaptFix.ai executes Thai PDPC standard clauses with sub-processors receiving Thai personal data where available.</p>

            <h3>Australia (APP 8)</h3>
            <p>Before disclosing personal information to overseas recipients, VaptFix.ai takes reasonable steps to ensure the recipient does not breach the Australian Privacy Principles (APP 8.1), including through contractual obligations. The Customer may rely on APP 8.2(b) by notifying affected individuals that personal information may be disclosed to overseas recipients, resulting in Customer bearing liability under APP 8.2(b) for the recipient's acts.</p>

            <h3>Japan (APPI Art. 28)</h3>
            <p>Transfers of personal information to non-APPI-equivalent countries require: (i) individual consent; or (ii) the destination providing a level of protection comparable to APPI. VaptFix.ai ensures all overseas sub-processors receiving Japanese personal information are subject to binding data protection obligations equivalent to APPI requirements, and maintains records per Art. 29.</p>

            <h3>New Zealand (IPP 12)</h3>
            <p>VaptFix.ai ensures that transfers of personal information of New Zealand individuals outside New Zealand comply with IPP 12, including ensuring the recipient is either: (a) subject to the Privacy Act or substantially equivalent law; or (b) bound by binding contractual terms; or (c) subject to other circumstances listed in the Privacy Act's permitted cross-border disclosure provisions.</p>
          </section>

          <section id="transfers-africa">
            <div class="ld-section-number">10-H / TRANSFERS — AFRICA (POPIA)</div>
            <h2>South Africa (POPIA) Cross-Border Transfers</h2>
            <p>Transfers of personal information of South African data subjects outside South Africa comply with POPIA S.72. VaptFix.ai transfers such data only where: (i) the recipient is subject to a law, binding corporate rules, or binding agreement providing substantially similar protection as POPIA; (ii) the data subject consents; (iii) the transfer is necessary for contract performance; or (iv) another S.72(1) exception applies. VaptFix.ai maintains binding data transfer agreements with all sub-processors receiving South African personal information and makes copies available to the Customer on request.</p>
          </section>

          <section id="transfers-me">
            <div class="ld-section-number">10-I / TRANSFERS — MIDDLE EAST</div>
            <h2>Middle East Cross-Border Transfers</h2>

            <h3>UAE — PDPL Art. 22</h3>
            <p>Transfers of personal data of UAE individuals outside the UAE are permitted only to countries with adequate protection (as determined by the UAE Data Office) or where the controller implements appropriate safeguards including contractual clauses. VaptFix.ai obtains UAE Data Office approval where required and maintains binding contractual obligations with receiving sub-processors. ADGM and DIFC transfers comply with respective free zone frameworks.</p>

            <h3>Saudi Arabia — PDPL Art. 29</h3>
            <p>Transfers of personal data of Saudi individuals outside KSA require: (i) SDAIA/NDMO approval or reliance on countries recognized as providing equivalent protection; (ii) the transfer does not prejudice national interests or security; (iii) contractual obligations ensure equivalent protection. Sensitive personal data localization requirements are observed — such data is stored within KSA infrastructure where mandated.</p>
          </section>

          <section id="transfers-latam">
            <div class="ld-section-number">10-J / TRANSFERS — LATIN AMERICA</div>
            <h2>Latin America Cross-Border Transfers</h2>

            <h3>Mexico — LFPDPPP Art. 36</h3>
            <p>International transfers of personal data of Mexican data subjects not excepted under Art. 37 (e.g., international conventions, transfer required for contract performance) require consent or are governed by the Agreement for the Transfer of Personal Data executed between VaptFix.ai and the Customer, ensuring adequate levels of protection per INAI standards.</p>

            <h3>Colombia — Ley 1581 Art. 26</h3>
            <p>Transfers to countries not recognized by the SIC as providing adequate protection require an agreement between the transmitter and receiver ensuring protection at least equivalent to Colombian law, or individual authorization.</p>

            <h3>Argentina, Chile, Peru</h3>
            <p>VaptFix.ai complies with applicable transfer restrictions under Ley 25.326 (Argentina), Ley 19.628 (Chile), and Ley 29733 (Peru), maintaining contractual safeguards with sub-processors receiving personal data originating from these jurisdictions and updating documentation as new comprehensive laws are enacted.</p>
          </section>

          <!-- JURISDICTION-SPECIFIC ADDENDA -->

          <section id="addendum-gdpr">
            <div class="ld-section-number">11-A / GDPR ADDENDUM</div>
            <h2>GDPR / UK GDPR / Swiss revFADP Addendum</h2>
            <p>This Addendum applies to processing of personal data of individuals in the EEA, UK, and Switzerland. The parties agree that:</p>
            <ul>
              <li>VaptFix.ai shall process personal data only on documented instructions of the Customer (Art. 28(3)(a) GDPR)</li>
              <li>A Data Protection Impact Assessment (DPIA) shall be conducted where required under Art. 35 GDPR, with VaptFix.ai providing all necessary assistance</li>
              <li>VaptFix.ai shall maintain records of processing activities carried out on behalf of the Customer (Art. 30(2) GDPR)</li>
              <li>The SCCs (Module 2) are incorporated as described in Section 10-A where applicable</li>
              <li>The Customer's lead supervisory authority contact details are to be completed at execution</li>
            </ul>
          </section>

          <section id="addendum-ccpa">
            <div class="ld-section-number">11-B / CCPA / CPRA ADDENDUM</div>
            <h2>California CCPA / CPRA Addendum</h2>
            <p>This Addendum applies where VaptFix.ai processes "personal information" of California residents on behalf of the Customer, as defined under Cal. Civil Code §1798.140. The parties agree that:</p>
            <ul>
              <li>VaptFix.ai is a "Service Provider" (as defined in §1798.140(ag)) receiving personal information for a "Business Purpose" and is prohibited from retaining, using, or disclosing the personal information for any commercial purpose other than providing the services specified in the Terms of Service</li>
              <li>VaptFix.ai is prohibited from selling or sharing the personal information and from combining the personal information with personal information received from other sources</li>
              <li>VaptFix.ai shall assist Customer in responding to verified consumer requests within 45 days (extendable by 45 days with notice)</li>
              <li>VaptFix.ai shall delete or return personal information upon instruction and at the conclusion of the service relationship</li>
              <li>VaptFix.ai certifies that it understands the foregoing restrictions and will comply with them</li>
              <li>Sensitive Personal Information (as defined in §1798.140(ae)) will be used only for the purposes set out in §1798.121</li>
            </ul>
          </section>

          <section id="addendum-lgpd">
            <div class="ld-section-number">11-C / LGPD ADDENDUM (BRAZIL)</div>
            <h2>Brazil LGPD Addendum</h2>
            <p>This Addendum applies to processing of personal data (dados pessoais) of Brazilian data subjects under Lei Geral de Proteção de Dados (Law 13,709/2018). The parties agree that:</p>
            <ul>
              <li>VaptFix.ai acts as the Operador (operator) processing dados pessoais on behalf of the Customer as Controlador (controller), under Art. 39 LGPD</li>
              <li>VaptFix.ai shall process dados pessoais only in accordance with the Controlador's instructions and shall not use data for its own purposes</li>
              <li>VaptFix.ai appoints an Encarregado (Data Protection Officer) contactable at <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a></li>
              <li>Security measures comply with Art. 46 LGPD standards; VaptFix.ai shall notify the Controlador of security incidents within 24 hours of awareness, with ANPD notification timing per Art. 48</li>
              <li>Cross-border transfers comply with LGPD Art. 33 as described in Section 10-C</li>
              <li>VaptFix.ai assists the Controlador in responding to data subject rights under Art. 18 within the required timeframe</li>
            </ul>
          </section>

          <section id="addendum-pipl">
            <div class="ld-section-number">11-D / PIPL ADDENDUM (CHINA)</div>
            <h2>China PIPL Addendum</h2>
            <p>This Addendum applies to processing of personal information (个人信息) of individuals in the People's Republic of China under the Personal Information Protection Law (PIPL). The parties agree that:</p>
            <ul>
              <li>VaptFix.ai acts as the "entrusted party" (受托人) processing personal information on behalf of the Customer as personal information handler (个人信息处理者), under PIPL Art. 21</li>
              <li>A written entrustment contract (委托处理协议) compliant with PIPL Art. 21 is established between the parties via this DPA</li>
              <li>VaptFix.ai shall not process personal information beyond the scope, purpose, and manner agreed with the Customer; shall not sub-entrust without prior consent; and shall delete personal information upon completion of the entrustment purpose</li>
              <li>VaptFix.ai assists the Customer in responding to requests from data subjects under PIPL Art. 50 within 15 days</li>
              <li>Cross-border transfers comply with PIPL Art. 38–40 mechanisms as described in Section 10-E</li>
              <li>VaptFix.ai shall conduct personal information protection impact assessments (PIPIA) as required under PIPL Art. 55 for high-risk processing activities</li>
              <li>In the event of a personal information security incident, VaptFix.ai shall immediately notify the Customer and assist with CAC reporting obligations per PIPL Art. 57</li>
            </ul>
          </section>

          <section id="addendum-popia">
            <div class="ld-section-number">11-E / POPIA ADDENDUM (SOUTH AFRICA)</div>
            <h2>South Africa POPIA Addendum</h2>
            <p>This Addendum applies to processing of personal information of South African data subjects under POPIA (Act 4 of 2013). VaptFix.ai acts as the "Operator" (as defined in S.1 POPIA) processing personal information on behalf of the Customer as "Responsible Party." VaptFix.ai shall: process personal information only with the knowledge and authorization of the Customer; treat personal information which comes to its knowledge as confidential; not disclose information without Customer authorization; and maintain appropriate security measures per S.19–22 POPIA. Cross-border transfers comply with S.72 as described in Section 10-H. VaptFix.ai will notify the Customer of security compromises as soon as reasonably possible per S.22 POPIA.</p>
          </section>

          <section id="addendum-pdpa">
            <div class="ld-section-number">11-F / PDPA ADDENDUM (SINGAPORE &amp; THAILAND)</div>
            <h2>Singapore &amp; Thailand PDPA Addendum</h2>
            <p>This Addendum applies to processing of personal data of individuals in Singapore (PDPA 2012) and Thailand (PDPA B.E. 2562). VaptFix.ai acts as the "data processor" under both frameworks, processing personal data on behalf of and under the instructions of the Customer as "data controller." VaptFix.ai shall: process personal data only for the purposes authorized by the Customer; implement appropriate security arrangements; assist the Customer in fulfilling data subject rights; notify the Customer within 24 hours of awareness of any data breach; and not transfer personal data outside Singapore or Thailand except in compliance with Sections 10-G. VaptFix.ai has appointed a Data Protection Officer (DPO) registered with the PDPC Singapore (where required) contactable at <a href="mailto:dpo@vaptfix.ai">dpo@vaptfix.ai</a>.</p>
          </section>

          <section id="addendum-appi">
            <div class="ld-section-number">11-G / APPI ADDENDUM (JAPAN)</div>
            <h2>Japan APPI Addendum</h2>
            <p>This Addendum applies to processing of personal information (個人情報) of individuals in Japan under the Act on the Protection of Personal Information (APPI). VaptFix.ai acts as a "consignee" (委託先) of the Customer and shall: handle personal information within the scope of the consignment purpose; implement necessary security management measures per Art. 23 APPI; provide appropriate supervision of sub-consignees; and notify the Customer without delay of any leakage incident. Third-party provision by VaptFix.ai of Japanese personal information is permitted only in compliance with APPI Art. 27. Cross-border transfers comply with APPI Art. 28 as described in Section 10-G. VaptFix.ai provides relevant information to the Customer annually or upon request to support APPI Art. 24(3) obligations (third-party provision records).</p>
          </section>

          <section id="addendum-pipa">
            <div class="ld-section-number">11-H / PIPA ADDENDUM (SOUTH KOREA)</div>
            <h2>South Korea PIPA Addendum</h2>
            <p>This Addendum applies to processing of personal information (개인정보) of Korean data subjects under the Personal Information Protection Act (PIPA). VaptFix.ai acts as "consignee" (수탁자) of the Customer and shall: process personal information only within the scope of the consignment; implement security measures per PIPA Art. 29 and the PIPA Enforcement Decree; not subcontract without prior written consent of the Customer; notify the Customer immediately of any PIPA violations; allow supervision and audit by the Customer; and destroy personal information upon completion of the consignment purpose. This Addendum constitutes the written consignment agreement required by PIPA Art. 26. The consignment details are set out in Annex A. VaptFix.ai discloses consignment details on its website in compliance with PIPA Art. 26(2).</p>
          </section>

          <section id="addendum-dpdp">
            <div class="ld-section-number">11-I / DPDP ADDENDUM (INDIA)</div>
            <h2>India DPDP Act Addendum</h2>
            <p>This Addendum applies to processing of personal data (व्यक्तिगत डेटा) of Indian Data Principals under the Digital Personal Data Protection Act 2023 (DPDP Act). VaptFix.ai acts as a "Data Processor" processing personal data on behalf of the Customer as "Data Fiduciary." VaptFix.ai shall: process personal data only for the purpose and in the manner specified by the Customer; implement appropriate technical and organizational measures per S.8(5) DPDP Act; assist the Customer in responding to Data Principal rights requests; notify the Customer immediately of any personal data breach per S.8(6); engage sub-processors (Data Processors) only with Customer authorization; and delete personal data upon fulfilment of the purpose or upon Customer instruction. This Addendum will be updated to reflect rules notified by the Central Government upon their publication.</p>
          </section>

          <section id="addendum-me">
            <div class="ld-section-number">11-J / MIDDLE EAST ADDENDUM</div>
            <h2>Middle East Addendum (UAE &amp; KSA)</h2>
            <p><strong>UAE (Federal PDPL):</strong> VaptFix.ai acts as a "controller's contractor" processing personal data under the Customer's supervision and instructions. VaptFix.ai shall comply with security obligations per the PDPL UAE Executive Regulations; assist with Data Subject rights within 30 days; notify Customer and UAE Data Office of breaches; and process cross-border transfers per Section 10-I. ADGM/DIFC-specific obligations are addressed in separate addenda upon request.</p>
            <p><strong>Saudi Arabia (PDPL KSA):</strong> VaptFix.ai processes personal data of Saudi data subjects on behalf of the Customer under a written data processing agreement compliant with PDPL KSA Art. 8 requirements. VaptFix.ai shall: implement security measures per SDAIA technical standards; appoint a Privacy Officer; notify Customer of breaches within 24 hours with Customer responsible for NDMO notification within 72 hours; not transfer data outside KSA except per Section 10-I; and observe data localization requirements for sensitive personal data categories.</p>
          </section>

          <!-- ANNEXES & EXECUTION -->

          <section id="retention">
            <div class="ld-section-number">12 / RETENTION &amp; DELETION</div>
            <h2>Data Retention &amp; Deletion</h2>
            <p>Upon termination or expiry of the Service agreement, or upon written request, VaptFix.ai shall — at the Customer's election — within 30 days:</p>
            <ul>
              <li><strong>Return:</strong> Provide an export of Customer Personal Data in a standard machine-readable format (JSON, CSV, or PDF as applicable)</li>
              <li><strong>Delete:</strong> Securely delete all Customer Personal Data using NIST SP 800-88 compliant methods and provide a written certificate of deletion</li>
            </ul>
            <p>VaptFix.ai may retain Personal Data beyond this period only to the extent required by applicable law (e.g., tax records, legal proceedings), and will notify the Customer of any such obligation. Anonymized or aggregated data not reasonably attributable to individuals may be retained for platform improvement.</p>
          </section>

          <section id="audit">
            <div class="ld-section-number">13 / AUDIT RIGHTS</div>
            <h2>Audit &amp; Inspection Rights</h2>
            <p>VaptFix.ai shall:</p>
            <ul>
              <li>Make available all information necessary to demonstrate compliance with this DPA and applicable law</li>
              <li>Provide SOC 2 Type II audit reports, ISO 27001 certificates (when available), and other relevant compliance documentation upon written request</li>
              <li>Allow audits, including inspections, by the Customer or a qualified mandated auditor, with 30 days' prior written notice, no more than once per 12-month period (unless required by a supervisory authority order)</li>
              <li>Bear costs of such audits only where they reveal material non-compliance; otherwise reasonable audit costs are borne by the Customer</li>
              <li>Allow supervisory authority inspections as required by applicable law</li>
            </ul>
          </section>

          <section id="liability">
            <div class="ld-section-number">14 / LIABILITY</div>
            <h2>Liability</h2>
            <p>Each party's liability to the other for breaches of this DPA is governed by the liability provisions of the Terms of Service, subject to mandatory provisions of applicable law (including GDPR Art. 82, LGPD Art. 42–45, PIPA Art. 39, and equivalent provisions). Neither party limits liability to Data Subjects or regulatory authorities as required by applicable law. VaptFix.ai's total aggregate liability under each applicable jurisdiction-specific addendum is limited to amounts permissible under the law of that jurisdiction.</p>
          </section>

          <section id="term">
            <div class="ld-section-number">15 / TERM &amp; TERMINATION</div>
            <h2>Term &amp; Termination</h2>
            <p>This DPA enters into force on the effective date and remains in effect for the duration of the Service agreement. Termination of the Service agreement automatically terminates this DPA. Obligations relating to confidentiality, security, deletion, audit rights, and breach notification survive termination for a period of 5 years, or longer as required by applicable law.</p>
          </section>

          <section id="annex-a">
            <div class="ld-section-number">ANNEX A</div>
            <h2>Processing Details</h2>
            <table class="ld-data-table">
              <thead><tr><th>Element</th><th>Details</th></tr></thead>
              <tbody>
                <tr><td>Subject matter</td><td>Provision of VAPT platform services, vulnerability scanning, and security assessments</td></tr>
                <tr><td>Duration</td><td>Duration of the Service agreement</td></tr>
                <tr><td>Nature of processing</td><td>Collection, storage, analysis, transmission, deletion, and reporting of Personal Data</td></tr>
                <tr><td>Purpose</td><td>Delivering VaptFix.ai services; account management; security scanning; report generation; analytics</td></tr>
                <tr><td>Categories of Personal Data</td><td>Account identifiers (name, email, job title, company); usage data (IP addresses, session logs); authentication data; communications (support tickets); scan target metadata (URLs, IP ranges, domain names); vulnerability findings and reports</td></tr>
                <tr><td>Sensitive / Special Categories</td><td>None anticipated. Customer must not submit special category data as scan targets without a DPA amendment and appropriate safeguards.</td></tr>
                <tr><td>Categories of Data Subjects</td><td>Customer employees, administrators, and authorized users; end users of Customer's systems where personal data appears in scan results</td></tr>
                <tr><td>Frequency of processing</td><td>Continuous during service provision</td></tr>
                <tr><td>Retention period</td><td>Per the Retention Schedule in the <router-link to="/privacy">Privacy Policy</router-link> and Section 12 of this DPA</td></tr>
                <tr><td>Applicable jurisdictions</td><td>All jurisdictions from which the Customer's personal data originates, including those covered by jurisdiction-specific addenda in Sections 11-A through 11-J</td></tr>
              </tbody>
            </table>
          </section>

          <section id="annex-b">
            <div class="ld-section-number">ANNEX B</div>
            <h2>Authorized Sub-processors</h2>
            <table class="ld-data-table">
              <thead>
                <tr><th>Sub-processor</th><th>HQ Location</th><th>Processing Location</th><th>Purpose</th></tr>
              </thead>
              <tbody>
                <tr><td>Amazon Web Services (AWS)</td><td>USA</td><td>USA, EU, APAC (region-selectable)</td><td>Cloud infrastructure, compute, storage, networking</td></tr>
                <tr><td>Google Cloud Platform (GCP)</td><td>USA</td><td>USA, EU, APAC (region-selectable)</td><td>Secondary infrastructure, disaster recovery</td></tr>
                <tr><td>Stripe</td><td>USA</td><td>USA, EU</td><td>Payment processing and billing</td></tr>
                <tr><td>SendGrid (Twilio)</td><td>USA</td><td>USA, EU</td><td>Transactional email delivery</td></tr>
                <tr><td>Intercom</td><td>USA</td><td>USA, EU</td><td>Customer support and in-app messaging</td></tr>
                <tr><td>Datadog</td><td>USA</td><td>USA, EU</td><td>Infrastructure monitoring, logging, alerting</td></tr>
                <tr><td>Cloudflare</td><td>USA</td><td>Global CDN network</td><td>CDN, DDoS protection, WAF, DNS</td></tr>
                <tr><td>PagerDuty</td><td>USA</td><td>USA, EU</td><td>Incident management and on-call alerting</td></tr>
              </tbody>
            </table>
            <p>The current sub-processor list is maintained at <a href="https://vaptfix.ai/sub-processors" target="_blank" rel="noopener noreferrer">vaptfix.ai/sub-processors</a> with real-time updates. Customers receive 14 days' email notice of any additions or changes. Each sub-processor has executed a DPA with VaptFix.ai containing obligations at least equivalent to those in this DPA.</p>
          </section>

          <section id="annex-c">
            <div class="ld-section-number">ANNEX C</div>
            <h2>Technical &amp; Organizational Security Measures</h2>
            <p>The following measures are implemented and maintained by VaptFix.ai. Full details are in our public <router-link to="/security">Security Statement</router-link>.</p>
            <table class="ld-data-table">
              <thead>
                <tr><th>Category</th><th>Measures Implemented</th><th>Relevant Standards / Laws</th></tr>
              </thead>
              <tbody>
                <tr><td>Encryption</td><td>AES-256 at rest; TLS 1.3 in transit; HSM-backed key management; 90-day key rotation</td><td>GDPR Art. 32; PIPL Art. 51; PIPA Art. 29; PDPA</td></tr>
                <tr><td>Access Control</td><td>MFA mandatory; least-privilege RBAC; JIT production access; quarterly access reviews; SSO/SAML</td><td>SOC 2; POPIA S.19; LGPD Art. 46</td></tr>
                <tr><td>Network Security</td><td>Private VPCs; WAF; DDoS protection (AWS Shield Advanced); IDS/IPS; network segmentation; egress filtering</td><td>GDPR Art. 32; APPI Art. 23; CCPA</td></tr>
                <tr><td>Application Security</td><td>SAST/DAST in CI/CD; SCA; container scanning; OWASP Top 10; annual penetration testing</td><td>SOC 2 Type II; ISO 27001; NIST CSF</td></tr>
                <tr><td>Monitoring &amp; Logging</td><td>24/7 SOC; SIEM with immutable logs; 12-month retention; anomaly detection; threat intelligence feeds</td><td>GDPR Art. 32; POPIA S.19; PDPA</td></tr>
                <tr><td>Incident Response</td><td>Documented IRP; 24h customer notification SLA; jurisdiction-specific breach timelines (Annex D); biannual tabletop exercises</td><td>All applicable breach notification laws</td></tr>
                <tr><td>Business Continuity</td><td>RTO &lt;4h; RPO &lt;1h; daily encrypted backups; multi-region replication for Enterprise</td><td>SOC 2; GDPR Art. 32(1)(c)</td></tr>
                <tr><td>Personnel Security</td><td>Background checks; annual security training; NDAs; access de-provisioned within 24h of offboarding</td><td>GDPR Art. 28(3)(b); POPIA; PIPL</td></tr>
                <tr><td>Vendor Management</td><td>Security assessments for all sub-processors; annual review; DPAs in place; Annex B maintained</td><td>GDPR Art. 28; PIPL Art. 21; LGPD Art. 39</td></tr>
                <tr><td>Compliance Framework</td><td>SOC 2 Type II; PCI DSS Level 1; ISO 27001 (in progress); GDPR; LGPD; PIPL; CCPA/CPRA; POPIA</td><td>Jurisdiction-specific as applicable</td></tr>
              </tbody>
            </table>
          </section>

          <section id="annex-d">
            <div class="ld-section-number">ANNEX D</div>
            <h2>Transfer Mechanisms &amp; DSR Response Times</h2>
            <table class="ld-data-table">
              <thead>
                <tr><th>Jurisdiction / Law</th><th>Transfer Mechanism</th><th>DSR Response Time</th></tr>
              </thead>
              <tbody>
                <tr><td>EU — GDPR</td><td>SCCs Module 2 (Decision 2021/914) + TIA; EC adequacy where available; EU-U.S. DPF</td><td>30 days (extendable +60 days with notice)</td></tr>
                <tr><td>UK — UK GDPR</td><td>UK IDTA; UK Addendum to EU SCCs; UK adequacy regulations</td><td>30 days (extendable +60 days)</td></tr>
                <tr><td>Switzerland — revFADP</td><td>Swiss SCCs (SCC-CH); Federal Council adequacy list</td><td>30 days</td></tr>
                <tr><td>USA — CCPA/CPRA (CA)</td><td>EU-U.S. DPF; SCCs; Standard Service Provider Agreement</td><td>45 days (extendable +45 days with notice)</td></tr>
                <tr><td>Canada — PIPEDA / Law 25</td><td>Contractual obligations; adequacy (Canada is EU-adequate)</td><td>30 days</td></tr>
                <tr><td>Brazil — LGPD</td><td>ANPD Standard Clauses; contractual safeguards</td><td>15 days</td></tr>
                <tr><td>Australia — Privacy Act</td><td>Contractual obligations (APP 8 compliance); adequacy</td><td>30 days</td></tr>
                <tr><td>Japan — APPI</td><td>Individual consent; equivalent protection standard; contractual obligations</td><td>Without undue delay (APPI standard)</td></tr>
                <tr><td>South Korea — PIPA</td><td>PIPC Standard Clauses; individual consent; adequacy recognition</td><td>10 days</td></tr>
                <tr><td>China — PIPL</td><td>CAC Standard Contract; security assessment; certification; consent (Art. 39)</td><td>15 working days (PIPL Art. 50)</td></tr>
                <tr><td>Singapore — PDPA</td><td>Data Transfer Agreements (DTAs); contractual obligations per S.26</td><td>30 days</td></tr>
                <tr><td>Thailand — PDPA</td><td>PDPC standard clauses; consent; adequate protection</td><td>30 days</td></tr>
                <tr><td>South Africa — POPIA</td><td>Binding contractual obligations per S.72; adequacy</td><td>15 working days</td></tr>
                <tr><td>India — DPDP Act</td><td>Notified country list (pending); contractual safeguards</td><td>TBD per rules; target 30 days</td></tr>
                <tr><td>UAE — PDPL</td><td>Adequate countries; UAE Data Office approval; contractual clauses</td><td>30 days</td></tr>
                <tr><td>Saudi Arabia — PDPL</td><td>SDAIA/NDMO approval; contractual safeguards; adequacy recognition</td><td>30 days</td></tr>
                <tr><td>New Zealand — Privacy Act 2020</td><td>Contractual obligations; adequacy; IPP 12 compliance</td><td>20 working days</td></tr>
                <tr><td>Israel — Privacy Protection Law</td><td>EU adequacy; contractual safeguards; binding agreements</td><td>30 days</td></tr>
                <tr><td>Mexico — LFPDPPP</td><td>Consent; contractual safeguards; Art. 36–37 exceptions</td><td>20 days (extendable +20 days)</td></tr>
                <tr><td>Colombia — Ley 1581</td><td>SIC-equivalent contractual protection; authorization</td><td>10 business days</td></tr>
              </tbody>
            </table>
          </section>

          <section id="signatures">
            <div class="ld-section-number">SIGNATURES</div>
            <h2>Execution</h2>
            <p>By signing below, or by accepting the Terms of Service which incorporate this DPA, both parties agree to be bound by the terms of this Data Processing Agreement and all applicable jurisdiction-specific addenda.</p>
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
              <p>For Enterprise customers requiring a countersigned DPA, or a DPA incorporating jurisdiction-specific schedules not covered above, contact <a href="mailto:legal@vaptfix.ai">legal@vaptfix.ai</a>. Processing begins within 3 business days of receipt.</p>
              <p>Customers processing data under multiple jurisdictions may request a consolidated jurisdiction-specific addendum package at no additional cost.</p>
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
        { type: 'group', label: 'Core Agreement' },
        { type: 'link', href: '#background', label: 'Background & Parties' },
        { type: 'link', href: '#definitions', label: 'Definitions' },
        { type: 'link', href: '#scope', label: 'Scope of Processing' },
        { type: 'link', href: '#obligations', label: 'Processor Obligations' },
        { type: 'link', href: '#controller', label: 'Controller Obligations' },
        { type: 'link', href: '#security-measures', label: 'Security Measures' },
        { type: 'link', href: '#subprocessors', label: 'Sub-processors' },
        { type: 'link', href: '#data-subject', label: 'Data Subject Rights' },
        { type: 'link', href: '#breach', label: 'Breach Notification' },
        { type: 'divider' },
        { type: 'group', label: 'Cross-Border Transfers' },
        { type: 'link', href: '#transfers-eu', label: 'EU / UK / Swiss SCCs' },
        { type: 'link', href: '#transfers-usa', label: 'United States' },
        { type: 'link', href: '#transfers-brazil', label: 'Brazil (LGPD)' },
        { type: 'link', href: '#transfers-korea', label: 'South Korea (PIPA)' },
        { type: 'link', href: '#transfers-china', label: 'China (PIPL)' },
        { type: 'link', href: '#transfers-india', label: 'India (DPDP)' },
        { type: 'link', href: '#transfers-apac', label: 'APAC (SG / TH / AU / JP / NZ)' },
        { type: 'link', href: '#transfers-africa', label: 'Africa (POPIA)' },
        { type: 'link', href: '#transfers-me', label: 'Middle East' },
        { type: 'link', href: '#transfers-latam', label: 'Latin America' },
        { type: 'divider' },
        { type: 'group', label: 'Jurisdiction Addenda' },
        { type: 'link', href: '#addendum-gdpr', label: 'GDPR Addendum' },
        { type: 'link', href: '#addendum-ccpa', label: 'CCPA Addendum' },
        { type: 'link', href: '#addendum-lgpd', label: 'LGPD Addendum' },
        { type: 'link', href: '#addendum-pipl', label: 'PIPL Addendum' },
        { type: 'link', href: '#addendum-popia', label: 'POPIA Addendum' },
        { type: 'link', href: '#addendum-pdpa', label: 'PDPA Addendum (SG/TH)' },
        { type: 'link', href: '#addendum-appi', label: 'APPI Addendum (JP)' },
        { type: 'link', href: '#addendum-pipa', label: 'PIPA Addendum (KR)' },
        { type: 'link', href: '#addendum-dpdp', label: 'DPDP Addendum (IN)' },
        { type: 'link', href: '#addendum-me', label: 'Middle East Addendum' },
        { type: 'divider' },
        { type: 'group', label: 'Annexes & Execution' },
        { type: 'link', href: '#retention', label: 'Retention & Deletion' },
        { type: 'link', href: '#audit', label: 'Audit Rights' },
        { type: 'link', href: '#liability', label: 'Liability' },
        { type: 'link', href: '#term', label: 'Term & Termination' },
        { type: 'link', href: '#annex-a', label: 'Annex A — Processing Details' },
        { type: 'link', href: '#annex-b', label: 'Annex B — Sub-processors' },
        { type: 'link', href: '#annex-c', label: 'Annex C — Security Measures' },
        { type: 'link', href: '#annex-d', label: 'Annex D — Transfer Mechanisms' },
        { type: 'link', href: '#signatures', label: 'Signatures' },
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
