<template>
  <div>
    <Header />

    <!-- HERO SECTION -->
    <section class="hv-hero">
      <div class="hv-container">
        <div class="hv-hero-grid">
          <div class="hv-hero-content">
            <div class="hv-badge">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              Vetted, tested security. Trusted by experts.
            </div>
            <h1 class="hv-hero-title">
              Welcome to the
              <span class="hv-gradient-text">Vulnerability Management</span>
              Program as a service platform
            </h1>
            <p class="hv-hero-sub">
              Security isn't just about finding flaws—it's about fixing them fast. We close the gaps that reports leave behind, giving you lasting protection.
            </p>
            <div class="hv-hero-btns">
              <button class="hv-btn-primary" @click="handleFixNow">
                Get Started
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </button>
              <a href="#features" class="hv-btn-outline">View Demo</a>
            </div>
          </div>
          <div class="hv-hero-img-wrap">
            <div class="hv-hero-img-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzNxus6NuktHFh5w7vWzSEaW-RaUMWMTg0IUeZyPx9wj5nc8X2SRjYWXoMwHqkjCiDwt_nXdbmJcg2wJQbs1dKwL6aF_819sEjYffskWbZvY7FvjuG_k-LKtDZV7BTlZ_BEJFwyj3cEicNgv3r8SZqLcQBi2vvSbVB_HmQZmQKN_zHgGi9r7cPS24qAyZVA9iIw-w5uF2p72NfzH8IEK3L079lvDv_Xk68QTKfG60RHVxG0n3LPhTuz1GzVXR3AzoBQMguypLoCC-k" alt="Vaptfix Dashboard" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROBLEM SECTION -->
    <section class="hv-problem" id="problem">
      <div class="hv-container">
        <div class="hv-section-label">
          <svg width="18" height="18" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
          <span style="color:#6366f1; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">The Problem</span>
        </div>
        <div class="hv-problem-top">
          <h2 class="hv-section-title">Why post VAPT Remediation is broken</h2>
          <p class="hv-section-desc">Most cybersecurity teams run a VAPT exercise and stop at the report. But what happens after the vulnerabilities are discovered? They sit in spreadsheets, lost in handoffs, or ignored in long development cycles.</p>
        </div>
        <div class="hv-cards-3">
          <div class="hv-card">
            <div class="hv-card-icon">
              <svg width="24" height="24" fill="none" stroke="#3A2A5E" viewBox="0 0 24 24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </div>
            <h3>No clear ownership</h3>
            <p>Vulnerabilities are discovered but no one is assigned to fix them. Without clear ownership, critical issues slip through the cracks indefinitely.</p>
          </div>
          <div class="hv-card">
            <div class="hv-card-icon">
              <svg width="24" height="24" fill="none" stroke="#3A2A5E" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </div>
            <h3>Vague remediation guidance</h3>
            <p>Reports list vulnerabilities but provide no actionable steps. Teams are left to research fixes on their own, wasting time and introducing errors.</p>
          </div>
          <div class="hv-card">
            <div class="hv-card-icon">
              <svg width="24" height="24" fill="none" stroke="#3A2A5E" viewBox="0 0 24 24">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </div>
            <h3>No risk prioritization</h3>
            <p>All vulnerabilities appear equal in a spreadsheet. Without proper risk scoring, teams fix low-impact issues while critical exposures remain open.</p>
          </div>
        </div>
        <div class="hv-result-box">
          <div class="hv-result-left">
            <div class="hv-section-label">
              <svg width="16" height="16" fill="none" stroke="#6366f1" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              <span style="color:#6366f1; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">The Result?</span>
            </div>
            <p>Most cybersecurity teams run a VAPT exercise and stop at the report. Vulnerabilities sit in spreadsheets, lost in handoffs, or ignored in long development cycles.</p>
          </div>
          <div class="hv-result-right">
            <p style="font-size:14px; font-weight:500; color:#4b5563; margin-bottom:12px;">Start for free, no obligations.</p>
            <button class="hv-btn-outline-dark" @click="handleFixNow">
              Fix your vulnerabilities now
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES SECTION -->
    <section class="hv-features" id="features">
      <div class="hv-container">
        <div class="hv-section-header-center">
          <div class="hv-section-label" style="justify-content:center;">
            <span class="hv-dot" style="background:#806ab2;"></span>
            <span style="color:#644e96; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Our Solution</span>
          </div>
          <h2 class="hv-section-title" style="text-align:center;">Foundations of a Mature<br/>Vulnerability Management Program Remediation</h2>
        </div>
        <div class="hv-cards-2">
          <div class="hv-feature-item">
            <div class="hv-feature-img">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv1vGU6p6m3ubNSsB0MhxiQE6oLJ57oTKIBnHbjHACMlZSZ5G2QgMrsT_QMixfZ8CMuStCrBLhJtHLXs6OOfjYwc5QXCVu8JHLW8H6WsEfwkte1PycfCIIG2NI_Uh7S61xFVGFxcNPQTNEZCz5nZ2Ff-KrJEmLQNOd6zBFJZ_5Dc69czlitiQ2n0ICgZdzRihgwhiRb6rCtiAByiM-aS5MilVRx_hyHAKoBUb-MIW2v8qcld-BC8Kyj03x5XB9_sjlUCsZO0T3bpEe" alt="Continuous Discovery" />
            </div>
            <h3 class="hv-feature-title">Continuous Multi-Modal Discovery</h3>
            <p class="hv-feature-desc">See everything, everywhere. Continuously discover vulnerabilities across hybrid cloud, on-premises infrastructure, and remote endpoints.</p>
          </div>
          <div class="hv-feature-item">
            <div class="hv-feature-img">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcEeoO6pRHzSYFGnwYnQJfgyMySwa-3jOCAu1oaMfKsD6bTfWtBTlBbMHPQM0i6GlHdUeyNxhkeG7MoUvl_oS9Z_pYvbelI4ZU4mV2va6PX37yt1CoKWniposFMFPy7PY6OJktVCx0W7DUArSpcYqD79l7YgBLnz9qsSHQFHB7_maPpBt1pL1Md3yyVXE6CnkygUOs-lY0haM1UdbFPH2fdcu_dYOuLjOJdJ6c5TpSeTTlJD8CJoye9JpwA-xACCrbgxeGaNdwNNKo" alt="Intelligent Mitigation" />
            </div>
            <h3 class="hv-feature-title">Intelligent Mitigation Guidance</h3>
            <p class="hv-feature-desc">Stop searching for the fix. Get the blueprints. Every vulnerability is paired with clear, actionable, human-readable steps tailored to your specific technology stack.</p>
          </div>
          <div class="hv-feature-item">
            <div class="hv-feature-img">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDK_5GWvAxxcenhtZdQUsRo0mE__eUmmSOJT2UHjiypTbjowZje2q8R15r0-Qb96T6F0YrOD4-iN5qeW2-1Nax5AdlZtoEHfMfweJUSiEqVk-zatSL1oRlP-FhFZ4bKecy-5Np7TxLY9Jv2JzQ8F1i67RcCGcFtsYlRw06J0DqKD61vN0URbN3T6RwqFEmrEX90MY9uIVaIWbSu2AtETjMC3c0TxfJQY5CZ9WEsxohF6Sx6zDrijMUeNisJM1NZhCWxi6NfFUMB9kMp" alt="Task Orchestration" />
            </div>
            <h3 class="hv-feature-title">Internal &amp; 3rd Party Task Orchestration</h3>
            <p class="hv-feature-desc">Hold every stakeholder accountable. Track and manage mitigation tasks across your internal teams and external vendors through a single pane of glass.</p>
          </div>
          <div class="hv-feature-item">
            <div class="hv-feature-img">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBH8ZByJl6DUfKSUM86A225OGFcxErEu3Oy9uXkN5OfUurrwxwnGGMLYKUsUkSBWrYr8lIRSOKqiexduoNIiasiMtFX1LPN6hXvBLowhJ9Pr6hropCeX5rqxPGrV_P1LEv91813cFw3YppqNxXrJhdjBEyXRq-80PmUkpkm5gaRr-H7g5i3tul6nw4ybqTsDVe6NMkb9G53RYBFRrWAubWViUAx4WC97P25Cdvw7VPkxL-DQc03y5gUn_IjBjfXYAaaWBlqPFXbehNu" alt="Operational Reality" />
            </div>
            <h3 class="hv-feature-title">Operational Reality Mapping</h3>
            <p class="hv-feature-desc">Ascertain exactly how your operational timeline stacks up against the risk criteria set in your management policy. We surface real-world exposure windows that static SLAs hide.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- HUMAN INTELLIGENCE SECTION -->
    <section class="hv-human">
      <div class="hv-container">
        <div class="hv-human-grid">
          <div class="hv-human-left">
            <div class="hv-section-label">
              <span class="hv-dot" style="background:#6366f1;"></span>
              <span style="color:#6366f1; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Our Approach</span>
            </div>
            <h2 class="hv-section-title">
              Automation is not enough,
              <span style="color:#513d7c;">Human intelligence matters</span>
            </h2>
            <p class="hv-section-desc">While automation speeds up repetitive tasks, remediation requires human judgment. Our platform acts as your co-pilot:</p>
            <ul class="hv-check-list">
              <li>
                <svg width="22" height="22" fill="none" stroke="#644e96" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
                AI offers initial triage and suggested fixes.
              </li>
              <li>
                <svg width="22" height="22" fill="none" stroke="#644e96" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
                Security experts validate and refine recommendations.
              </li>
              <li>
                <svg width="22" height="22" fill="none" stroke="#644e96" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
                Teams get precise, actionable steps they can trust.
              </li>
            </ul>
            <p class="hv-quote">This hybrid approach reduces false positives, accelerates remediation, and ensures secure releases.</p>
          </div>
          <div class="hv-human-right">
            <div class="hv-human-img-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqeBOHtVSe-cDxfn1UBwXzaLG0fX9oF5DQDuzr7znxuhH6IbEcWeHO6Hrh09PpYkH3jtAxAOxn_l3k17u2tvcYAiZtlJ_0sDnxhXcTVCcCqnYoj2NIDb_GzbWSmsokOwoFDuLI2xt4PnyTeSqCBxEIRdndZkgExosPM0Ixb80TYBJyzaCfo0V3PRkxeQxNILmNQO9yEEHGmbP9ipLYhdRUupal0QOJV8McRFKJ12MR1gAawqtco3k_QmoZhMf7r3caMhX-j-LeSmqY" alt="Human Intelligence" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SCHEDULING PILLARS SECTION -->
    <section class="hv-pillars">
      <div class="hv-container">
        <div class="hv-section-header-center">
          <div class="hv-section-label" style="justify-content:center;">
            <span class="hv-dot" style="background:#6366f1;"></span>
            <span style="color:#6366f1; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Our Solution</span>
          </div>
          <h2 class="hv-section-title" style="text-align:center; color:#fff;">Flexible Assessment Scheduling</h2>
        </div>
        <div class="hv-pillars-grid">
          <div class="hv-pillar">
            <div class="hv-pillar-num">1</div>
            <h3>Security on your timeline</h3>
            <p>Provision for assessment of frequencies that match your risk appetite—from daily continuous scans for critical production assets to comprehensive annual deep-dives for compliance.</p>
          </div>
          <div class="hv-pillar">
            <div class="hv-pillar-num">2</div>
            <h3>Expert Mitigation Support</h3>
            <p>Gain access to expert mitigation support to help your team navigate complex remediations. Our specialists provide manual validation to remove false positives.</p>
          </div>
          <div class="hv-pillar">
            <div class="hv-pillar-num">3</div>
            <h3>Native Slack &amp; Teams Integration</h3>
            <p>Keep everyone aligned with real-time notifications and task management directly within Slack and Microsoft Teams. Reduce friction between security and IT teams.</p>
          </div>
          <div class="hv-pillar">
            <div class="hv-pillar-num">4</div>
            <h3>Comprehensive Asset Command Center</h3>
            <p>Get a comprehensive view of your vulnerabilities across all assets. Track trends, monitor your global risk score, and stay audit-ready with evidence for every remediation action.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA BOTTOM SECTION -->
    <section class="hv-cta">
      <div class="hv-cta-bg">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPsio8sVUVAZWGvAUcbhCEHyROriMT588zuPx09opPjVzYo8GAU3ZqWaoc-G4z9K5xYVa9JIeU9adcM5jGM6OK6nUeSSQRnvL6feuIx4gr64IO3Sk0tGAbzVfK7U-dRC2SZsd3oWy2X70sL2yTewg0eaD2jf5y5cdvdYGPQOaZHEaDL609b9tV4RVfj_P6jDdT-SvfZ_1yhavk2UbnwTUUG-ocmL9E9fS8uJKBbSSnQf01WscymBnfQRkGalu3Ul38g9K5qFHxhe1O" alt="" />
      </div>
      <div class="hv-container hv-cta-inner">
        <h2 class="hv-cta-title">Fix Bugs Instantly.</h2>
        <p class="hv-cta-desc">Identify, prioritize, and fix security flaws fast. Reduce risk with zero-friction setup and smart automation.</p>
        <button class="hv-cta-btn" @click="handleFixNow">
          Fix your vulnerabilities now
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';

export default {
  name: 'HomeView',
  components: { Header, Footer },
  methods: {
    handleFixNow() {
      window.location.assign("/signup");
    }
  }
};
</script>

<style scoped>
/* ===== BASE ===== */
* { box-sizing: border-box; }

.hv-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ===== HERO ===== */
.hv-hero {
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, transparent 1px);
  background-size: 20px 20px;
  padding: 40px 0 80px;
  margin-top: 72px;
}

.hv-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hv-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f6f4fa;
  border: 1px solid #ebe6f3;
  color: #513d7c;
  font-size: 13px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 24px;
}

.hv-hero-title {
  font-family: 'Manrope', sans-serif;
  font-size: 52px;
  font-weight: 800;
  color: #111827;
  line-height: 1.15;
  margin-bottom: 20px;
}

.hv-gradient-text {
  background: linear-gradient(135deg, #3A2A5E, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hv-hero-sub {
  font-size: 18px;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 36px;
}

.hv-hero-btns {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hv-btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #3A2A5E;
  color: #fff;
  border: none;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.hv-btn-primary:hover { background: #2f234c; }

.hv-btn-outline {
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.hv-btn-outline:hover { background: #f9fafb; }

.hv-hero-img-wrap { position: relative; }

.hv-hero-img-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.12);
  border: 1px solid #e5e7eb;
  padding: 16px;
  overflow: hidden;
}

.hv-hero-img-card img {
  width: 100%;
  border-radius: 16px;
  display: block;
}

/* ===== PROBLEM ===== */
.hv-problem {
  background: #f8f9fc;
  padding: 96px 0;
}

.hv-section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.hv-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #806ab2;
  display: inline-block;
}

.hv-problem-top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: end;
  margin-bottom: 48px;
}

.hv-section-title {
  font-family: 'Manrope', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  line-height: 1.25;
  margin: 0 0 16px;
}

.hv-section-desc {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.hv-cards-3 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 48px;
}

.hv-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.hv-card:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.08); }

.hv-card-icon {
  width: 48px;
  height: 48px;
  background: #f6f4fa;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.hv-card h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px;
}

.hv-card p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.65;
  margin: 0;
}

.hv-result-box {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.hv-result-left { flex: 1; }
.hv-result-left p { font-size: 15px; color: #6b7280; line-height: 1.65; margin: 8px 0 0; }

.hv-result-right {
  background: #f1f3f9;
  border-radius: 14px;
  padding: 28px 32px;
  text-align: center;
  min-width: 260px;
}

.hv-btn-outline-dark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #111827;
  border: 1px solid #d1d5db;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: background 0.2s;
}
.hv-btn-outline-dark:hover { background: #f9fafb; }

/* ===== FEATURES ===== */
.hv-features {
  background: #fff;
  padding: 96px 0;
}

.hv-section-header-center {
  max-width: 700px;
  margin: 0 auto 60px;
  text-align: center;
}

.hv-cards-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 48px 60px;
}

.hv-feature-img {
  width: 100%;
  aspect-ratio: 16/9;
  background: #f1f3f9;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

.hv-feature-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.85;
}

.hv-feature-title {
  font-family: 'Manrope', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 10px;
}

.hv-feature-desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

/* ===== HUMAN INTELLIGENCE ===== */
.hv-human {
  background: #f8f9fc;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  padding: 96px 0;
}

.hv-human-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.hv-check-list {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hv-check-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #374151;
}

.hv-quote {
  font-size: 15px;
  color: #6b7280;
  font-style: italic;
  border-left: 4px solid #d5cce6;
  padding: 8px 0 8px 16px;
  margin: 0;
}

.hv-human-img-card {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: 1px solid #e5e7eb;
  padding: 16px;
  overflow: hidden;
}

.hv-human-img-card img {
  width: 100%;
  border-radius: 16px;
  display: block;
}

/* ===== PILLARS ===== */
.hv-pillars {
  background: #2f234c;
  padding: 96px 0;
  position: relative;
  overflow: hidden;
}

.hv-pillars::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 30px 30px;
}

.hv-pillars .hv-container { position: relative; z-index: 1; }

.hv-pillars-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.hv-pillar { text-align: center; padding: 0 8px; }

.hv-pillar-num {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.hv-pillar h3 {
  font-family: 'Manrope', sans-serif;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.hv-pillar p {
  font-size: 13px;
  color: #bcaed7;
  line-height: 1.65;
  margin: 0;
}

/* ===== CTA ===== */
.hv-cta {
  background: #111827;
  padding: 80px 0;
  position: relative;
  overflow: hidden;
}

.hv-cta-bg {
  position: absolute;
  inset: 0;
  opacity: 0.2;
}

.hv-cta-bg img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hv-cta-inner {
  position: relative;
  z-index: 1;
}

.hv-cta-title {
  font-family: 'Manrope', sans-serif;
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
}

.hv-cta-desc {
  font-size: 17px;
  color: #9ca3af;
  margin: 0 0 32px;
}

.hv-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  color: #1d1433;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.hv-cta-btn:hover { background: #f3f4f6; }

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .hv-hero-grid,
  .hv-human-grid { grid-template-columns: 1fr; }
  .hv-hero { padding: 100px 0 60px; }
  .hv-hero-title { font-size: 38px; }
  .hv-pillars-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hv-problem-top,
  .hv-cards-2,
  .hv-cards-3 { grid-template-columns: 1fr; }
  .hv-result-box { flex-direction: column; }
  .hv-result-right { min-width: unset; width: 100%; }
  .hv-pillars-grid { grid-template-columns: 1fr; }
  .hv-section-title { font-size: 28px; }
  .hv-hero-title { font-size: 32px; }
}
</style>
