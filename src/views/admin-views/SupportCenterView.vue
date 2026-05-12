<template>
  <div class="legal-page-root">
    <Header />

    <div class="legal-page-frame sup-frame">
      <section class="sup-hero">
        <div class="sup-hero-tag">Help Center</div>
        <h1 class="sup-hero-title">How can we help?</h1>
        <p class="sup-hero-desc">
          Find answers, documentation, and connect with our security engineering team.
        </p>
        <form class="sup-search" @submit.prevent="onSearchSubmit">
          <input
            v-model="searchQuery"
            type="search"
            class="sup-search-input"
            placeholder="Search docs, guides, FAQs..."
            autocomplete="off"
            aria-label="Search help center"
          />
          <button type="submit" class="sup-search-btn">Search</button>
        </form>
      </section>

      <div class="sup-body">
        <div class="sup-section-label">Support channels</div>
        <h2 class="sup-section-title">Get in Touch</h2>
        <div class="sup-channels">
          <div class="sup-channel-card">
            <div class="sup-channel-icon" aria-hidden="true">📧</div>
            <div class="sup-channel-title">Email Support</div>
            <p class="sup-channel-desc">
              General questions, account issues, billing, and non-urgent technical inquiries.
            </p>
            <a class="sup-channel-action" href="mailto:support@vaptfix.ai">support@vaptfix.ai →</a>
            <div class="sup-channel-sla">Response: within 24 hours (business days)</div>
          </div>
          <div class="sup-channel-card">
            <div class="sup-channel-icon" aria-hidden="true">🔐</div>
            <div class="sup-channel-title">Security Issues</div>
            <p class="sup-channel-desc">
              Report vulnerabilities, potential breaches, or suspicious activity on the platform.
            </p>
            <a class="sup-channel-action" href="mailto:security@vaptfix.ai">security@vaptfix.ai →</a>
            <div class="sup-channel-sla">Response: within 24 hours, always</div>
          </div>
          <div class="sup-channel-card">
            <div class="sup-channel-icon" aria-hidden="true">💼</div>
            <div class="sup-channel-title">Enterprise Support</div>
            <p class="sup-channel-desc">
              Priority support, dedicated CSM, SLA-backed response times for Business &amp; Enterprise plans.
            </p>
            <a class="sup-channel-action" href="mailto:enterprise@vaptfix.ai">enterprise@vaptfix.ai →</a>
            <div class="sup-channel-sla">Response: within 4 hours (24/7 for critical)</div>
          </div>
          <div class="sup-channel-card">
            <div class="sup-channel-icon" aria-hidden="true">💬</div>
            <div class="sup-channel-title">Live Chat</div>
            <p class="sup-channel-desc">
              Real-time help from our support engineers, available for Pro and above plans.
            </p>
            <span class="sup-channel-action sup-channel-action--muted">In-app chat widget →</span>
            <div class="sup-channel-sla">Available Mon–Fri 9am–6pm UTC</div>
          </div>
          <div class="sup-channel-card">
            <div class="sup-channel-icon" aria-hidden="true">💳</div>
            <div class="sup-channel-title">Billing &amp; Invoices</div>
            <p class="sup-channel-desc">
              Subscription changes, invoices, refund requests, and payment method updates.
            </p>
            <a class="sup-channel-action" href="mailto:billing@vaptfix.ai">billing@vaptfix.ai →</a>
            <div class="sup-channel-sla">Response: within 1 business day</div>
          </div>
          <div class="sup-channel-card">
            <div class="sup-channel-icon" aria-hidden="true">🤝</div>
            <div class="sup-channel-title">Partnerships</div>
            <p class="sup-channel-desc">Reseller, integration, and technology partnership inquiries.</p>
            <a class="sup-channel-action" href="mailto:partners@vaptfix.ai">partners@vaptfix.ai →</a>
            <div class="sup-channel-sla">Response: within 3 business days</div>
          </div>
        </div>

        <div class="sup-section-label">Response times</div>
        <h2 class="sup-section-title">Support SLAs by Plan</h2>
        <div class="sup-sla-grid">
          <div class="sup-sla-cell">
            <div class="sup-sla-plan">Free</div>
            <div class="sup-sla-time">72h</div>
            <div class="sup-sla-label">Email only · Business hours</div>
          </div>
          <div class="sup-sla-cell">
            <div class="sup-sla-plan">Starter</div>
            <div class="sup-sla-time">24h</div>
            <div class="sup-sla-label">Email + Live chat · Business hours</div>
          </div>
          <div class="sup-sla-cell">
            <div class="sup-sla-plan">Pro</div>
            <div class="sup-sla-time">8h</div>
            <div class="sup-sla-label">Email, chat, priority queue</div>
          </div>
          <div class="sup-sla-cell">
            <div class="sup-sla-plan">Business</div>
            <div class="sup-sla-time">4h</div>
            <div class="sup-sla-label">All channels · Dedicated CSM</div>
          </div>
          <div class="sup-sla-cell">
            <div class="sup-sla-plan">Enterprise</div>
            <div class="sup-sla-time">1h</div>
            <div class="sup-sla-label">24/7 · Critical: 30min · Slack</div>
          </div>
        </div>

        <div class="sup-section-label sup-mt">Documentation</div>
        <h2 class="sup-section-title">Browse the Docs</h2>
        <div class="sup-doc-grid">
          <div class="sup-doc-cat">
            <div class="sup-doc-cat-title">Getting Started</div>
            <div class="sup-doc-cat-links">
              <a href="#" @click.prevent>Platform overview</a>
              <a href="#" @click.prevent>Creating your first scan</a>
              <a href="#" @click.prevent>API key setup</a>
              <a href="#" @click.prevent>Team &amp; permissions</a>
            </div>
          </div>
          <div class="sup-doc-cat">
            <div class="sup-doc-cat-title">Scanning &amp; Assessment</div>
            <div class="sup-doc-cat-links">
              <a href="#" @click.prevent>Scan types explained</a>
              <a href="#" @click.prevent>Configuring scan profiles</a>
              <a href="#" @click.prevent>Scheduled scans</a>
              <a href="#" @click.prevent>Scan exclusions &amp; scope</a>
            </div>
          </div>
          <div class="sup-doc-cat">
            <div class="sup-doc-cat-title">Reports &amp; Findings</div>
            <div class="sup-doc-cat-links">
              <a href="#" @click.prevent>Reading vulnerability reports</a>
              <a href="#" @click.prevent>Severity scoring (CVSS)</a>
              <a href="#" @click.prevent>Exporting to PDF/CSV</a>
              <a href="#" @click.prevent>Remediation tracking</a>
            </div>
          </div>
          <div class="sup-doc-cat">
            <div class="sup-doc-cat-title">Integrations &amp; API</div>
            <div class="sup-doc-cat-links">
              <a href="#" @click.prevent>REST API reference</a>
              <a href="#" @click.prevent>Webhook setup</a>
              <a href="#" @click.prevent>Jira integration</a>
              <a href="#" @click.prevent>Slack notifications</a>
            </div>
          </div>
          <div class="sup-doc-cat">
            <div class="sup-doc-cat-title">Account &amp; Billing</div>
            <div class="sup-doc-cat-links">
              <router-link to="/pricingplan">Plan comparison</router-link>
              <a href="#" @click.prevent>Updating payment method</a>
              <a href="#" @click.prevent>Downloading invoices</a>
              <a href="#" @click.prevent>Cancelling subscription</a>
            </div>
          </div>
          <div class="sup-doc-cat">
            <div class="sup-doc-cat-title">Security &amp; Compliance</div>
            <div class="sup-doc-cat-links">
              <a href="#" @click.prevent>SSO / SAML setup</a>
              <a href="#" @click.prevent>MFA configuration</a>
              <a href="#" @click.prevent>Audit log access</a>
              <a href="#" @click.prevent>Data residency options</a>
            </div>
          </div>
        </div>

        <div id="faq" class="sup-faq-wrap">
          <div class="sup-section-label">FAQ</div>
          <h2 class="sup-section-title">Frequently Asked Questions</h2>
          <div class="sup-faq-grid">
            <div class="sup-faq-item">
              <div class="sup-faq-q">Can I scan any system with VaptFix.ai?</div>
              <div class="sup-faq-a">
                No. You may only scan systems you own or have explicit written authorization to test. Unauthorized
                scanning is a violation of our
                <router-link to="/terms">Terms of Service</router-link>
                and may constitute a criminal offense.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">What scan types does VaptFix.ai support?</div>
              <div class="sup-faq-a">
                We support web application scanning (DAST), network/port scanning, API security testing, SSL/TLS
                analysis, and OWASP Top 10 assessments. Advanced modules include authenticated scanning and CI/CD
                pipeline integration.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">How is my scan data stored and protected?</div>
              <div class="sup-faq-a">
                All scan data is encrypted at rest (AES-256) and in transit (TLS 1.3), logically isolated per
                customer, and hosted on AWS in SOC 2 certified infrastructure. See our
                <router-link to="/security">Security Statement</router-link>
                for full details.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">Do you offer a free trial?</div>
              <div class="sup-faq-a">
                Yes. Our Free plan includes up to 3 scan targets and 5 scans per month with no credit card required.
                Paid plans offer a 14-day free trial with full feature access.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">Can I get a DPA for GDPR compliance?</div>
              <div class="sup-faq-a">
                Yes. Our standard
                <router-link to="/dpa">Data Processing Agreement (DPA)</router-link>
                is available for all paid plans. Enterprise customers can request a countersigned DPA from
                <a href="mailto:legal@vaptfix.ai">legal@vaptfix.ai</a>.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">Does VaptFix.ai have a bug bounty program?</div>
              <div class="sup-faq-a">
                We operate a responsible disclosure program. Report security issues to
                <a href="mailto:security@vaptfix.ai">security@vaptfix.ai</a>. We review all reports and respond within
                24 hours. A formal bounty program is planned for a future release.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">How do I cancel my subscription?</div>
              <div class="sup-faq-a">
                You can cancel anytime from Account → Subscription → Cancel Plan. Your access continues until the end of
                the billing period. No cancellation fees apply.
              </div>
            </div>
            <div class="sup-faq-item">
              <div class="sup-faq-q">Where can I find your uptime and status?</div>
              <div class="sup-faq-a">
                Live uptime, incident history, and maintenance windows are published at
                <a href="https://status.vaptfix.ai" target="_blank" rel="noopener noreferrer">status.vaptfix.ai</a>.
                Subscribe for email or Slack notifications.
              </div>
            </div>
          </div>
        </div>

        <LegalDocInnerFooter />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import LegalDocInnerFooter from '@/components/admin-component/LegalDocInnerFooter.vue';

export default {
  name: 'SupportCenterView',
  components: {
    Header,
    LegalDocInnerFooter,
  },
  data() {
    return {
      searchQuery: '',
    };
  },
  methods: {
    onSearchSubmit() {
      const el = document.getElementById('faq');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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

.sup-frame {
  width: 100%;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  padding: 0;
  box-sizing: border-box;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  border-radius: 12px;
  border: 1px solid rgba(36, 20, 71, 0.06);
  box-shadow: 0 4px 24px rgba(36, 20, 71, 0.06);
  overflow: hidden;
}

.sup-hero {
  text-align: center;
  padding: 3rem clamp(1rem, 4vw, 2.5rem) 2.5rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.12);
  background: linear-gradient(180deg, #faf9fc 0%, #ffffff 100%);
}

.sup-hero-tag {
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
  margin-bottom: 1.25rem;
  text-transform: uppercase;
}

.sup-hero-tag::before {
  content: '●';
  font-size: 7px;
}

.sup-hero-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  color: #241447;
  margin: 0 0 1rem;
  line-height: 1.15;
}

.sup-hero-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #49454f;
  font-weight: 400;
  max-width: 520px;
  margin: 0 auto 1.75rem;
  line-height: 1.6;
}

.sup-search {
  max-width: 480px;
  margin: 0 auto;
  display: flex;
  border: 1px solid rgba(15, 105, 110, 0.2);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
}

.sup-search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 18px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #241447;
  background: transparent;
}

.sup-search-input::placeholder {
  color: #94a3b8;
}

.sup-search-btn {
  background: #0f696e;
  border: none;
  cursor: pointer;
  padding: 12px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: normal;
  transition: background 0.2s;
}

.sup-search-btn:hover {
  background: #0a4e52;
}

.sup-body {
  padding: 2.5rem clamp(1rem, 4vw, 2.5rem) 2rem;
}

.sup-section-label {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.sup-section-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 800;
  line-height: 1.25;
  color: #241447;
  margin: 0 0 1.5rem;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.15);
}

.sup-mt {
  margin-top: 2.5rem;
}

.sup-channels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 3rem;
}

.sup-channel-card {
  background: #f6f4fa;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 12px;
  padding: 1.75rem;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
}

.sup-channel-card:hover {
  border-color: rgba(15, 105, 110, 0.35);
  box-shadow: 0 6px 20px rgba(36, 20, 71, 0.08);
  transform: translateY(-2px);
}

.sup-channel-icon {
  font-size: 28px;
  margin-bottom: 0.75rem;
  line-height: 1;
}

.sup-channel-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 0.5rem;
}

.sup-channel-desc {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #49454f;
  margin: 0 0 1rem;
  line-height: 1.65;
  font-weight: 400;
}

.sup-channel-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #0f696e;
  text-decoration: none;
}

.sup-channel-action:hover {
  text-decoration: underline;
}

.sup-channel-action--muted {
  cursor: default;
  text-decoration: none;
}

.sup-channel-sla {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #94a3b8;
  margin-top: 0.5rem;
}

.sup-sla-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1px;
  background: rgba(15, 105, 110, 0.15);
  border: 1px solid rgba(15, 105, 110, 0.15);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.sup-sla-cell {
  background: #f6f4fa;
  padding: 1.25rem;
}

.sup-sla-plan {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.sup-sla-time {
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.sup-sla-label {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
  line-height: 1.65;
}

.sup-doc-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.sup-doc-cat {
  background: #f6f4fa;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.sup-doc-cat-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
}

.sup-doc-cat-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sup-doc-cat-links a {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s;
}

.sup-doc-cat-links a::before {
  content: '→ ';
  color: #0f696e;
  font-size: 11px;
}

.sup-doc-cat-links a:hover {
  color: #0f696e;
}

.sup-faq-wrap {
  margin-bottom: 1rem;
}

.sup-faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.sup-faq-item {
  background: #f6f4fa;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 10px;
  padding: 1.25rem;
}

.sup-faq-q {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
  margin-bottom: 0.5rem;
  line-height: 1.25;
}

.sup-faq-a {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: #49454f;
  line-height: 1.65;
  font-weight: 400;
}

.sup-faq-a a,
.sup-faq-a :deep(a) {
  color: #0f696e;
  font-weight: 500;
  text-decoration: none;
}

.sup-faq-a a:hover,
.sup-faq-a :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .legal-page-root .sup-frame,
  .sup-frame {
    border-radius: 10px;
  }

  .sup-hero {
    padding: 2rem 1rem 2rem;
  }

  .sup-body {
    padding: 1.75rem 1rem 1.5rem;
  }

  .sup-search {
    flex-direction: column;
    border-radius: 12px;
  }

  .sup-search-input {
    min-width: 0;
    width: 100%;
  }

  .sup-search-btn {
    width: 100%;
    padding: 14px 16px;
  }

  .sup-sla-time {
    font-size: clamp(1.25rem, 8vw, 1.5rem);
  }
}

@media (max-width: 380px) {
  .sup-section-title {
    font-size: 1.35rem;
    word-break: break-word;
  }

  .sup-faq-q {
    font-size: 16px;
  }
}
</style>
