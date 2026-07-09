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
            <div class="ld-doc-tag">Knowledge Base</div>
            <h1 class="ld-doc-title">VAPTFIX Platform Guide</h1>
            <p class="ld-doc-meta">
              <strong>Last Updated:</strong> May 12, 2026 &nbsp;|&nbsp;
              <strong>Review Cycle:</strong> Annual &nbsp;|&nbsp;
              <strong>Version:</strong> 1.0
            </p>
          </div>

          <div class="ld-callout">
            <p>
              VAPTFIX is a web-based, real-time vulnerability management platform that identifies, classifies,
              prioritizes, and remediates security vulnerabilities across an organization's assets — giving security
              teams continuous visibility into where risk currently stands.
            </p>
          </div>

          <!-- 1. Executive Summary -->
          <section id="executive-summary">
            <div class="ld-section-number">01 / EXECUTIVE SUMMARY</div>
            <h2>Overview</h2>
            <p>
              Security teams typically discover vulnerabilities faster than they can track, prioritize, and resolve them.
              Without a consistent way to connect each vulnerability to the asset it affects and route it to the team
              responsible for fixing it, findings can sit unassigned, remediation can lack a clear owner, and leadership
              can lose visibility into the organization's true security posture.
            </p>
            <p>
              VAPTFIX is a web-based, real-time vulnerability management platform built to close that gap. It identifies,
              classifies, prioritizes, and remediates security vulnerabilities across an organization's assets, and gives
              security teams continuous, real-time visibility into where risk currently stands.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>Asset-based vulnerability mapping</li>
              <li>Severity and timeline-based prioritization</li>
              <li>Automated assignment to specialized remediation teams</li>
              <li>Guided remediation workflows with escalation support</li>
              <li>Real-time vulnerability tracking and monitoring</li>
            </ul>

            <h2>Implementation</h2>
            <p>
              Vulnerabilities are ingested from uploaded assessment files, mapped against the organization's asset
              inventory, and automatically routed to one of four specialized teams: Network Security, Patch Management,
              Configuration Management, or Architectural Flaw. This automated routing removes manual triage overhead and
              ensures each finding reaches the team best positioned to resolve it.
            </p>

            <h2>Benefits</h2>
            <ul>
              <li>A single platform for the full vulnerability lifecycle, from discovery to remediation</li>
              <li>Faster time-to-remediation through automated team assignment</li>
              <li>Continuous, real-time visibility into organizational security posture</li>
              <li>Reduced manual coordination between security and operational teams</li>
            </ul>
          </section>

          <!-- 2. How VAPTFIX Works -->
          <section id="how-vaptfix-works">
            <div class="ld-section-number">02 / HOW VAPTFIX WORKS</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX follows a consistent, automated workflow that takes a vulnerability from initial upload through to
              tracked remediation. Every step in this workflow is recorded, giving both security teams and management
              full traceability of how a finding was handled.
            </p>

            <h2>Platform Workflow</h2>
            <ul>
              <li><strong>Upload</strong> — A user submits a vulnerability assessment file through the VAPTFIX interface</li>
              <li><strong>Validation</strong> — The backend authenticates the request and validates the uploaded file before any storage operation begins</li>
              <li><strong>Secure Ingestion</strong> — The file is streamed directly into encrypted cloud object storage, while summary metadata (report identifiers, timestamps, severity counts, tags) is indexed in MongoDB</li>
              <li><strong>Asset Mapping</strong> — Each vulnerability identified in the file is mapped to its corresponding organizational asset</li>
              <li><strong>Classification &amp; Prioritization</strong> — Findings are classified and ranked by severity and remediation timeline</li>
              <li><strong>Automated Team Assignment</strong> — Findings are automatically assigned to the relevant specialized team: Network Security, Patch Management, Configuration Management, or Architectural Flaw</li>
              <li><strong>Guided Remediation</strong> — The assigned team is provided guided remediation steps and escalation support</li>
              <li><strong>Real-Time Tracking</strong> — Remediation progress is tracked in real time as findings move toward resolution</li>
              <li><strong>Dashboards &amp; Reporting</strong> — Dashboards and reports are updated to reflect current findings, severity summaries, and remediation status</li>
              <li><strong>Audit Trail</strong> — Every upload, validation step, access event, and administrative action is recorded in the audit log, maintaining a complete history for the report's lifecycle</li>
            </ul>

            <h2>Benefits</h2>
            <ul>
              <li>A predictable, repeatable path from discovery to remediation</li>
              <li>Automated handoffs remove manual coordination between teams</li>
              <li>Full lifecycle traceability, from upload through resolution</li>
            </ul>
          </section>

          <!-- 3. Certifications and Compliance Alignment -->
          <section id="certifications-compliance">
            <div class="ld-section-number">03 / CERTIFICATIONS AND COMPLIANCE ALIGNMENT</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX is designed in accordance with internationally recognized security, privacy, cloud security, and
              business continuity frameworks. Controls and operating practices are aligned with AICPA SOC, ISO 27001,
              ISO 22301, ISO 27017, and ISO 27701, giving customers assurance that the platform is built and operated
              against recognized industry benchmarks.
            </p>

            <h2>Framework Alignment</h2>
            <div class="ld-table-wrap">
              <table class="ld-table">
                <thead>
                  <tr>
                    <th>Framework</th>
                    <th>Focus Area</th>
                    <th>How VAPTFIX Aligns</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AICPA SOC</td>
                    <td>Security, availability, operational integrity</td>
                    <td>Platform processes and services are designed and managed using recognized trust and assurance principles.</td>
                  </tr>
                  <tr>
                    <td>ISO 27001</td>
                    <td>Information security management</td>
                    <td>Establishes, implements, maintains, and continually improves controls protecting confidentiality, integrity, and availability.</td>
                  </tr>
                  <tr>
                    <td>ISO 22301</td>
                    <td>Business continuity management</td>
                    <td>Processes are designed to maintain service availability and support recovery from disruptions.</td>
                  </tr>
                  <tr>
                    <td>ISO 27017</td>
                    <td>Cloud security</td>
                    <td>Cloud-specific security controls and shared-responsibility management protect data hosted in cloud infrastructure.</td>
                  </tr>
                  <tr>
                    <td>ISO 27701</td>
                    <td>Privacy information management</td>
                    <td>Strengthens governance, handling, and regulatory compliance for personal and sensitive information.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>Benefits</h2>
            <ul>
              <li>Assurance that platform controls map to recognized industry frameworks</li>
              <li>Reduced due-diligence burden during customer security reviews</li>
              <li>A consistent compliance foundation spanning security, privacy, and resilience</li>
            </ul>
          </section>

          <!-- 4. Platform Architecture -->
          <section id="platform-architecture">
            <div class="ld-section-number">04 / PLATFORM ARCHITECTURE</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX is built on a secure, scalable, and highly available architecture designed to support vulnerability
              management at enterprise scale. Rather than having one system do everything, the platform deliberately splits
              its work into three separate jobs: running the application, keeping track of information about files, and
              actually storing the files. Doing this separately — instead of bundling it all into one system — makes the
              platform more secure (a breach in one part doesn't expose everything), faster (the main application isn't
              slowed down by huge files), and more resilient (if one component has an issue, the others keep working).
            </p>

            <h2>Key Components</h2>
            <div class="ld-table-wrap">
              <table class="ld-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Hosted In</th>
                    <th>What It Actually Does</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Application Services</td>
                    <td>Contabo infrastructure</td>
                    <td>Runs the actual VAPTFIX application — this is what handles user logins, uploading assessment reports, showing dashboards, and processing remediation requests. Think of this as the "engine" of the platform.</td>
                  </tr>
                  <tr>
                    <td>Metadata Repository</td>
                    <td>MongoDB</td>
                    <td>Doesn't store the actual files — just stores information about the files, like who uploaded a report, when, its severity level, and an ID number to find it later. This is like a library catalog card, not the book itself.</td>
                  </tr>
                  <tr>
                    <td>Assessment Files</td>
                    <td>Azure Blob Storage / AWS S3</td>
                    <td>This is where the real uploaded files (assessment reports, scan results, etc.) physically live. These are specialized cloud storage services built to hold large files securely and reliably, instead of clogging up the main database.</td>
                  </tr>
                  <tr>
                    <td>Encryption Keys</td>
                    <td>Azure Key Vault / AWS KMS</td>
                    <td>The files stored in the cloud are encrypted, and the keys used to lock/unlock (encrypt/decrypt) that data are kept in a separate, dedicated vault service — not stored alongside the files or in the application itself. This way, even if someone got access to the storage, they couldn't read the files without also breaking into the key vault.</td>
                  </tr>
                  <tr>
                    <td>Access URLs</td>
                    <td>Temporary, time-limited client sessions</td>
                    <td>When someone needs to download or view a file, they aren't given permanent direct access to cloud storage. Instead, they get a special link that only works for a short window of time and then expires — reducing the risk of that link being leaked or misused later.</td>
                  </tr>
                  <tr>
                    <td>Audit Logs</td>
                    <td>Cloud monitoring services</td>
                    <td>Every action — uploads, downloads, access requests — is logged automatically by cloud monitoring tools, so there's a full record of who did what and when.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>How It Actually Works</h2>
            <p><strong>Step 1 — Application layer:</strong> All user-facing actions (uploading files, running remediation workflows, viewing dashboards, calling APIs) are handled by the application services running on Contabo. This is the only layer users directly interact with.</p>
            <p><strong>Step 2 — Metadata only in MongoDB:</strong> MongoDB is intentionally kept lightweight. It only stores operational metadata — things like the report's ID, who owns it, when it was created, and a summary of its severity. It never stores the actual file content itself. This keeps the database fast and easy to manage, since large files aren't bogging it down.</p>
            <p><strong>Step 3 — Files go straight to cloud storage:</strong> The actual assessment files (the real documents/reports) are streamed directly into Azure Blob Storage or Amazon S3 — enterprise-grade storage systems built specifically to hold large volumes of files securely.</p>
            <p><strong>Step 4 — Upload process:</strong></p>
            <ol>
              <li>When a file is uploaded, it first goes through authentication (verifying the user is allowed to upload) and validation (checking the file is legitimate/safe).</li>
              <li>Once verified, a metadata record is created and indexed in MongoDB (the "catalog card").</li>
              <li>The actual file is then streamed to Azure Blob Storage/AWS S3.</li>
              <li>A reference/link connecting the metadata record to the actual stored file is saved, so the system always knows which catalog entry points to which file.</li>
            </ol>
            <p><strong>Step 5 — Retrieval process:</strong></p>
            <ol>
              <li>The backend first looks up the file's metadata in MongoDB (to confirm it exists and the user has permission).</li>
              <li>It then generates a temporary, secure access link (URL) that will only work for a limited time.</li>
              <li>The file is served directly from cloud storage using that link — the application server itself doesn't have to handle the heavy file transfer.</li>
            </ol>

            <h2>Benefits</h2>
            <ul>
              <li><strong>Reduced attack surface:</strong> Because processing (Contabo), metadata (MongoDB), and file storage (Azure/AWS) are all separate systems, a security issue in one doesn't automatically expose the others.</li>
              <li><strong>Better performance:</strong> Since large files never sit inside the metadata database, MongoDB stays fast and responsive even as the platform scales.</li>
              <li><strong>Full traceability:</strong> Every step of a file's journey — upload, storage, access, download — is logged, so there's a complete audit trail for accountability and compliance.</li>
            </ul>
          </section>

          <!-- 5. Data Protection and Encryption -->
          <section id="data-protection">
            <div class="ld-section-number">05 / DATA PROTECTION AND ENCRYPTION</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX protects assessment files, metadata, and cryptographic keys by enforcing encryption across all data
              states and communication paths. Encryption is applied automatically at the infrastructure level, ensuring
              that data remains protected both at rest and in transit without relying on application-level configuration.
              This approach provides consistent protection while reducing the risk of security gaps caused by manual
              implementation.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li><strong>Envelope encryption applied automatically to every stored assessment file</strong> – Each uploaded assessment file is protected using a unique encryption key, ensuring independent encryption and enhanced data security.</li>
              <li><strong>Customer-Managed Keys (CMKs) secured in Azure Key Vault or AWS Key Management Service (KMS)</strong> – Master encryption keys are protected within hardware-backed key management services and are never exposed in plaintext.</li>
              <li><strong>TLS 1.2 or higher with AES-256-GCM enforced across all communication paths</strong> – All uploads, downloads, API communications, and internal data transfers are secured using strong, industry-standard encryption protocols.</li>
              <li><strong>Separation of metadata and assessment files</strong> – Operational metadata is stored independently from assessment files, reducing the risk of exposing sensitive vulnerability data if a single repository is compromised.</li>
              <li><strong>Automated encryption and secure key lifecycle management</strong> – Encryption, key generation, wrapping, unwrapping, rotation, and secure disposal are handled automatically by the platform, minimizing operational risk and ensuring consistent protection.</li>
            </ul>

            <h2>How It Actually Works</h2>
            <ul>
              <li>VAPTFIX uses an envelope encryption model to protect every uploaded assessment file throughout its lifecycle. Each file is encrypted using a unique Data Encryption Key (DEK) generated specifically for that object, ensuring that every assessment file is protected independently using AES-256 encryption.</li>
              <li>To strengthen key security, the DEK is immediately encrypted (wrapped) using a Customer Master Key (CMK) stored within Azure Key Vault or AWS Key Management Service (KMS). The CMK is protected by Hardware Security Modules (HSMs) and never leaves the secure key management environment, ensuring that encryption keys remain protected at all times.</li>
              <li>Only the encrypted DEK is stored alongside the encrypted assessment file, while the actual CMK remains securely managed within the cloud key management service. This design ensures that cloud infrastructure and application services never have direct access to usable encryption keys or unencrypted assessment files.</li>
              <li>When an authorized user requests a file, the platform securely retrieves and unwraps the encrypted DEK through the key management service, decrypts the file during the download process, and immediately removes the plaintext encryption key from memory after use. This minimizes key exposure while maintaining secure access to assessment data.</li>
              <li>All communication between users, application services, and cloud storage is protected using TLS 1.2 or higher with AES-256-GCM cipher suites. Unencrypted connections are rejected at the infrastructure level, and where private connectivity is enabled, traffic between application services and cloud storage remains within the cloud provider's private network, providing an additional layer of protection alongside encryption.</li>
            </ul>

            <h2>Benefits</h2>
            <ul>
              <li>Protects assessment data throughout its lifecycle by enforcing encryption for both stored data and data transmitted across the platform.</li>
              <li>Reduces the impact of a database compromise by storing only metadata in MongoDB while keeping encrypted assessment files in separate cloud object storage.</li>
              <li>Strengthens key security through Customer-Managed Keys (CMKs) protected within Azure Key Vault or AWS Key Management Service (KMS), ensuring encryption keys remain isolated from application services.</li>
              <li>Minimizes the risk of unauthorized data exposure through envelope encryption, secure key management, and automatic key lifecycle controls.</li>
              <li>Supports secure cloud operations by combining strong encryption, protected key management, and secure communication channels across the platform.</li>
              <li>Provides customers with greater control over encrypted data through customer-managed encryption keys that support secure access management and data protection.</li>
            </ul>
          </section>

          <!-- 6. Identity and Access Control -->
          <section id="identity-access">
            <div class="ld-section-number">06 / IDENTITY AND ACCESS CONTROL</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX implements a layered Identity and Access Control framework to protect platform resources,
              assessment data, and supporting infrastructure. Access is enforced across independent identity, resource,
              application, and network control layers, ensuring that authentication, authorization, and data access
              remain protected even if a single security control is compromised. This defence-in-depth approach ensures
              that only authenticated users, authorized services, and approved platform components can access sensitive
              resources.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>Azure Managed Identity or AWS IAM Role with temporary credentials for backend authentication</li>
              <li>Least-privilege access to cloud storage and key management services</li>
              <li>Role-Based Access Control (RBAC) with server-side authorization enforcement</li>
              <li>Public access permanently disabled for cloud storage resources</li>
              <li>Time-limited, single-object presigned URLs for secure assessment file retrieval</li>
              <li>Customer Master Key (CMK) access restricted exclusively to authorized backend services</li>
              <li>Strict data isolation across users, projects, and operational teams</li>
            </ul>

            <h2>Implementation</h2>
            <p>
              VAPTFIX eliminates the use of long-lived credentials by authenticating backend services through Azure
              Managed Identity or AWS IAM Roles with AWS STS AssumeRole. These platform-managed identities receive
              short-lived credentials automatically and are granted only the minimum permissions required to upload and
              retrieve assessment files. They cannot enumerate storage resources, delete objects, modify storage policies,
              or access resources outside their defined scope.
            </p>
            <p>
              Storage resources are protected through multiple layers of access control. Public access is disabled at the
              account level, while assessment files remain inaccessible through direct object paths or storage credentials.
              Every download request is validated by the backend application, which verifies user authorization, retrieves
              the corresponding metadata, and issues a cryptographically signed presigned URL that grants temporary access
              to a single object before automatically expiring. Access to Customer Master Keys (CMKs) in Azure Key Vault
              or AWS KMS is restricted exclusively to the backend service identity, ensuring that encryption and
              decryption operations can only be performed by authorized platform services. MongoDB authentication, cloud
              storage access, and key management operate as separate trust boundaries with independent credentials and
              network restrictions, reducing the risk of lateral movement across platform components.
            </p>

            <h2>Benefits</h2>
            <ul>
              <li>Eliminates long-lived credentials by using cloud-managed service identities with temporary authentication.</li>
              <li>Enforces least-privilege access, preventing unauthorized operations on storage and key management resources.</li>
              <li>Protects assessment files through validated requests and time-limited presigned URLs rather than direct storage access.</li>
              <li>Restricts encryption key operations exclusively to authorized backend services, strengthening data confidentiality.</li>
              <li>Maintains strict separation between application, storage, database, and key management layers to reduce the attack surface.</li>
              <li>Supports secure, auditable, and role-based access across the VAPTFIX platform.</li>
            </ul>
          </section>

          <!-- 7. Network Security -->
          <section id="network-security">
            <div class="ld-section-number">07 / NETWORK SECURITY</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX employs a layered network security architecture that minimizes exposure and enforces secure
              communication between platform components. Network controls work alongside identity, resource, and
              application-level access controls to ensure that only authenticated and authorized requests can reach
              platform resources. All client interactions are processed through the backend API, which serves as the
              primary security boundary between users and the underlying infrastructure.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>All client requests are routed exclusively through the backend API</li>
              <li>TLS 1.2 or higher enforced for all client and service communications</li>
              <li>Private network connectivity between application services and cloud storage</li>
              <li>No public access to storage endpoints</li>
              <li>Backend authentication using Azure Managed Identity or AWS IAM Role with temporary credentials</li>
              <li>Network-level access restrictions enforced through private endpoints and security policies</li>
            </ul>

            <h2>Implementation</h2>
            <p>
              All upload and retrieval requests are validated by the backend before accessing storage resources. Clients
              never receive storage credentials, direct object paths, or encryption keys. Backend services authenticate
              to cloud resources using Azure Managed Identity or AWS IAM Roles with temporary credentials, eliminating
              the need for long-lived access keys. Cloud storage remains inaccessible from public networks and is
              reachable only through private connectivity mechanisms such as Azure Private Endpoints or AWS VPC Gateway
              Endpoints. Additional network security controls, including Network Security Groups, Security Groups,
              restrictive bucket policies, and network allow-lists, ensure that only authorized application services can
              communicate with storage resources. This layered approach combines secure communication, private
              connectivity, and controlled access to reduce the attack surface and protect assessment data throughout
              its lifecycle.
            </p>

            <h2>Benefits</h2>
            <ul>
              <li>Eliminates direct public access to storage resources</li>
              <li>Protects cloud resources through identity-based authentication and least-privilege access</li>
              <li>Ensures assessment files are transferred over encrypted and private communication channels</li>
              <li>Reduces the attack surface through layered network and access controls</li>
              <li>Supports secure, end-to-end communication across the platform architecture</li>
            </ul>
          </section>

          <!-- 8. Audit, Logging, and Monitoring -->
          <section id="audit-logging">
            <div class="ld-section-number">08 / AUDIT, LOGGING, AND MONITORING</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX provides comprehensive audit logging and monitoring capabilities to ensure complete visibility
              into platform activities, user interactions, and administrative operations. Security-relevant events are
              continuously recorded across the vulnerability management lifecycle, enabling organizations to monitor
              platform usage, investigate incidents, maintain accountability, and support regulatory and compliance
              requirements.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>Comprehensive audit logging for user, administrative, and system activities</li>
              <li>Real-time monitoring of uploads, downloads, authentication events, and remediation actions</li>
              <li>Immutable, append-only audit logs to preserve event integrity</li>
              <li>Centralized logging across application, storage, and key management services</li>
              <li>Correlation of events using unique report identifiers for end-to-end traceability</li>
              <li>Integration with enterprise SIEM and cloud monitoring platforms</li>
              <li>Continuous monitoring for suspicious activities and unauthorized access attempts</li>
            </ul>

            <h2>Implementation</h2>
            <p>
              VAPTFIX automatically records security-relevant events throughout the platform, including user
              authentication, report uploads and downloads, vulnerability processing, administrative actions, encryption
              key operations, and remediation activities. Every event is timestamped and associated with the authenticated
              user, affected resource, and corresponding assessment report, creating a complete audit trail across the
              vulnerability management lifecycle.
            </p>
            <p>
              Audit logs are collected from application services, cloud storage, databases, and key management systems,
              providing centralized visibility across all platform components. Events can be integrated with enterprise
              Security Information and Event Management (SIEM) solutions and cloud-native monitoring services to support
              real-time alerting, anomaly detection, incident investigation, and long-term operational monitoring.
              Immutable logging mechanisms help preserve the integrity of recorded events, ensuring reliable evidence for
              security reviews, forensic investigations, and compliance reporting.
            </p>

            <h2>Benefits</h2>
            <ul>
              <li>Provides complete visibility into user, administrative, and platform activities.</li>
              <li>Enables rapid investigation through correlated, end-to-end audit trails.</li>
              <li>Strengthens accountability by maintaining tamper-resistant records of security-relevant events.</li>
              <li>Supports proactive detection of suspicious activities through continuous monitoring and SIEM integration.</li>
              <li>Simplifies compliance, governance, and forensic investigations through centralized, comprehensive audit logging.</li>
            </ul>
          </section>

          <!-- 9. Application Security and User Management -->
          <section id="application-security">
            <div class="ld-section-number">09 / APPLICATION SECURITY AND USER MANAGEMENT</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX implements comprehensive application security controls to protect user identities, manage account
              lifecycles, and enforce secure access across the platform. Authentication, authorization, and user
              provisioning are centrally managed to ensure that only authenticated and authorized users can access platform
              resources. Users are assigned to specialized operational teams—Patch Management, Configuration Management,
              Network Security, and Architectural Flaw—with permissions enforced according to their assigned roles and
              responsibilities.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>Mandatory Multi-Factor Authentication (MFA) for every user account</li>
              <li>Administrator-controlled account provisioning with no self-registration</li>
              <li>JWT-based authentication with server-side validation for every request</li>
              <li>Role-Based Access Control (RBAC) aligned to operational teams</li>
              <li>Secure user onboarding with mandatory password creation and MFA enrolment</li>
              <li>Strict data isolation across users, projects, and assigned responsibilities</li>
              <li>Comprehensive audit logging for authentication, user management, and administrative actions</li>
            </ul>

            <h2>Implementation</h2>
            <p>
              All user accounts are created and managed exclusively by platform administrators through a centralized
              provisioning process. Users receive a single-use, time-limited invitation to activate their account and must
              create a compliant password and complete Multi-Factor Authentication before access is granted. Until these
              steps are completed, the account remains inactive and cannot authenticate to the platform.
            </p>
            <p>
              Authentication is enforced using JWT-based session management, with every API request validated before any
              business logic is processed. Role-Based Access Control is applied server-side, preventing privilege
              escalation or unauthorized actions from the client. Users are assigned to one of four operational teams—Patch
              Management, Configuration Management, Network Security, or Architectural Flaw—and can access only the
              vulnerabilities, assets, projects, and remediation activities within their authorized scope. Administrative
              actions, authentication events, account provisioning, role changes, and deprovisioning activities are
              recorded through comprehensive audit logging to maintain accountability and support compliance.
            </p>

            <h2>Benefits</h2>
            <ul>
              <li>Ensures only authenticated and authorized users can access platform resources.</li>
              <li>Strengthens account security through mandatory Multi-Factor Authentication and centralized identity management.</li>
              <li>Enforces least-privilege access using server-side Role-Based Access Control.</li>
              <li>Protects organizational data through strict user, project, and team-based isolation.</li>
              <li>Provides complete visibility and accountability through comprehensive authentication and administrative audit logs.</li>
              <li>Supports secure user lifecycle management from account provisioning through deprovisioning.</li>
            </ul>
          </section>

          <!-- 10. Business Continuity -->
          <section id="business-continuity">
            <div class="ld-section-number">10 / BUSINESS CONTINUITY</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX is built on a resilient platform architecture designed to maintain service availability and support
              rapid recovery if a disruption occurs. Recovery activities are prioritized according to the criticality of
              each service component, so that core platform functions are restored first.
            </p>

            <h2>Resilient Architecture</h2>
            <p>
              Production services run on cloud infrastructure designed to minimize single points of failure. The
              platform's architecture also separates application processing, metadata, and file storage, further reducing
              the impact of any single component disruption on overall service availability.
            </p>

            <h2>Backup and Recovery</h2>
            <p>
              Platform metadata, vulnerability findings, remediation records, and operational databases are backed up on
              automated schedules to encrypted repositories isolated from production workloads, reducing the risk of
              simultaneous compromise.
            </p>

            <h2>Recovery Objectives</h2>
            <p>
              Core platform services, including vulnerability ingestion, dashboard availability, API services,
              authentication, scan processing, remediation workflows, and customer reporting, are treated as priority for
              restoration, with a target Recovery Time Objective of under four hours and a Recovery Point Objective of
              under one hour for critical services.
            </p>

            <h2>Testing and Continuous Improvement</h2>
            <p>
              Backup integrity and recovery procedures are validated through scheduled restoration testing, including
              both full and partial restoration exercises that confirm application functionality and data consistency.
              Results from each exercise are reviewed and incorporated into updated recovery procedures, so that continuity
              capability improves over time.
            </p>
          </section>

          <!-- 11. Incident Response -->
          <section id="incident-response">
            <div class="ld-section-number">11 / INCIDENT RESPONSE</div>
            <h2>Overview</h2>
            <p>
              VAPTFIX incorporates monitoring, logging, and access-control capabilities that support the detection,
              investigation, containment, and recovery of security events affecting the platform and the data it holds.
            </p>

            <h2>Detection and Monitoring</h2>
            <p>
              VAPTFIX records upload and download activity, user interactions, administrative operations, and encryption
              key usage in real time. These audit events can be integrated with enterprise SIEM platforms to detect
              unusual download patterns, excessive file access attempts, suspicious user activity, and abnormal key
              usage requiring investigation.
            </p>

            <h2>Investigation</h2>
            <p>
              Because upload, storage, and key-management events are correlated through a shared report identifier, an
              anomaly detected in one part of the platform can be traced through the full, connected audit trail,
              identifying exactly which identity performed which action and when.
            </p>

            <h2>Containment</h2>
            <p>
              Service identities are limited to least-privilege permissions, and the Customer-Managed Key protecting
              stored assessment files can be revoked at any time. Revoking the key immediately renders the affected
              encrypted objects unreadable, giving customers a direct control point for containing exposure of a specific
              dataset.
            </p>

            <h2>Recovery</h2>
            <p>
              Recovery relies on the platform's backup and restoration capabilities described in the Business Continuity
              section, allowing affected services and data to be restored to a known-good state.
            </p>

            <h2>Auditability</h2>
            <p>
              Every administrative action, access event, and key operation is written to an append-only, immutable log
              that cannot be modified or deleted, even by platform administrators, supporting thorough post-incident
              review.
            </p>
          </section>

          <!-- 12. Assessment Report Processing -->
          <section id="assessment-report">
            <div class="ld-section-number">12 / ASSESSMENT REPORT PROCESSING</div>
            <h2>Overview</h2>
            <p>
              In addition to its core vulnerability management workflow, VAPTFIX securely processes vulnerability
              assessment reports uploaded by customers. This uses the same upload, encryption, and audit pipeline
              described elsewhere in this proposal.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>Secure upload of vulnerability assessment reports in the .nessus format</li>
              <li>Automated validation of uploaded files</li>
              <li>Mapping of findings to corresponding organizational assets</li>
              <li>Classification by severity and remediation timeline</li>
              <li>Automatic assignment of findings to the relevant specialized team</li>
            </ul>

            <h2>Implementation</h2>
            <p>
              Uploaded reports follow the same handling as any other assessment file: the file is streamed directly to
              encrypted cloud object storage without being written to the backend server disk, only summary metadata is
              stored in MongoDB, and every upload and access is recorded in the audit log. Only the uploading account and
              team retain access to the underlying file. The processing pipeline is built around the .nessus XML format;
              support for additional formats can be considered based on customer demand.
            </p>

            <h2>Benefits</h2>
            <ul>
              <li>Uploaded reports are processed through the same secure pipeline used elsewhere on the platform</li>
              <li>Findings are automatically classified and routed without manual triage</li>
              <li>Uploaded files remain protected under the same encryption and access controls as all other platform data</li>
            </ul>
          </section>

          <!-- 13. Business Value -->
          <section id="business-value">
            <div class="ld-section-number">13 / BUSINESS VALUE</div>
            <h2>Overview</h2>
            <p>
              Beyond its technical capabilities, VAPTFIX delivers measurable business outcomes for organizations managing
              vulnerability risk at scale.
            </p>

            <h2>Key Outcomes</h2>
            <ul>
              <li>Centralized vulnerability management across all organizational assets</li>
              <li>Improved visibility into organizational risk through real-time tracking</li>
              <li>Automated prioritization and assignment of findings, reducing manual triage</li>
              <li>Faster remediation workflows through guided steps and escalation support</li>
              <li>Reduced manual coordination between security and operational teams</li>
              <li>Improved governance and audit readiness through complete, correlated logging</li>
              <li>Better operational efficiency through a single platform for the full vulnerability lifecycle</li>
              <li>Support for compliance initiatives through alignment with recognized security and privacy frameworks</li>
            </ul>
          </section>

          <!-- 14. Security Capabilities Summary -->
          <section id="security-capabilities">
            <div class="ld-section-number">14 / SECURITY CAPABILITIES SUMMARY</div>
            <h2>Overview</h2>
            <p>
              This section summarizes the core security capabilities described throughout this proposal, bringing together
              the platform's approach to vulnerability workflow, encryption, authentication, access control, compliance
              alignment, and audit logging in a single view.
            </p>

            <h2>Key Capabilities</h2>
            <ul>
              <li>Automated vulnerability prioritization based on severity and remediation timelines, with automatic assignment to specialized remediation teams</li>
              <li>Envelope encryption of assessment files and metadata at rest using a Customer-Managed Key, with TLS 1.2 or higher for all data in transit</li>
              <li>Multi-factor authentication enforced for every account, with no exemptions</li>
              <li>Role-based access control scoped to four defined teams, enforced server-side on every request</li>
              <li>Alignment with AICPA SOC, ISO 27001, ISO 22301, ISO 27017, and ISO 27701</li>
              <li>Append-only, immutable audit logging across upload, download, administrative, and key-management events</li>
            </ul>

            <h2>Benefits</h2>
            <ul>
              <li>A consistent, layered security model spanning data, identity, network, and application controls</li>
              <li>Reduced due-diligence effort during customer security evaluation</li>
              <li>A verifiable audit trail supporting internal review and compliance reporting</li>
            </ul>
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
  name: 'KnowledgeBaseView',
  components: {
    Header,
    LegalDocInnerFooter,
  },
  data() {
    return {
      activeTocHash: '',
      tocItems: [
        { href: '#executive-summary', label: 'Executive Summary' },
        { href: '#how-vaptfix-works', label: 'How VAPTFIX Works' },
        { href: '#certifications-compliance', label: 'Certifications & Compliance' },
        { href: '#platform-architecture', label: 'Platform Architecture' },
        { href: '#data-protection', label: 'Data Protection' },
        { href: '#identity-access', label: 'Identity & Access' },
        { href: '#network-security', label: 'Network Security' },
        { href: '#audit-logging', label: 'Audit & Logging' },
        { href: '#application-security', label: 'Application Security' },
        { href: '#business-continuity', label: 'Business Continuity' },
        { href: '#incident-response', label: 'Incident Response' },
        { href: '#assessment-report', label: 'Assessment Reports' },
        { href: '#business-value', label: 'Business Value' },
        { href: '#security-capabilities', label: 'Security Summary' },
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

.ld-content section h2:not(:first-of-type) {
  margin-top: 1.75rem;
}

.ld-content p {
  font-family: 'Inter', sans-serif;
  color: #49454f;
  margin-bottom: 0.75rem;
  font-weight: 400;
  line-height: 1.65;
  font-size: 15px;
}

.ld-content ul,
.ld-content ol {
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

.ld-table-wrap {
  overflow-x: auto;
  margin: 1.5rem 0;
  border-radius: 8px;
  border: 1px solid rgba(15, 105, 110, 0.12);
}

.ld-table {
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.ld-table thead {
  background: #f6f4fa;
}

.ld-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: #241447;
  border-bottom: 1px solid rgba(15, 105, 110, 0.15);
  white-space: nowrap;
}

.ld-table td {
  padding: 12px 16px;
  color: #49454f;
  line-height: 1.55;
  border-bottom: 1px solid rgba(36, 20, 71, 0.06);
  vertical-align: top;
}

.ld-table tbody tr:last-child td {
  border-bottom: none;
}

.ld-table tbody tr:hover {
  background: rgba(15, 105, 110, 0.03);
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
