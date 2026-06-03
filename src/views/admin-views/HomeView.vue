<template>
  <div>
    <Header ref="pageHeader" />

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
                <i class="bi bi-arrow-right-circle-fill ms-1 fs-5" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="hv-hero-img-wrap">
            <AnimatedDashboard />
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights marquee (below hero) -->
    <section
      class="hv-highlights-slider"
      aria-label="Product highlights"
      @mouseenter="pauseHighlightSlider"
      @mouseleave="resumeHighlightSlider"
    >
      <div class="hv-container">
        <div class="hv-slider-viewport">
          <div
            class="hv-slider-track hv-slider-track--marquee"
            :class="{ 'hv-slider-track--paused': highlightSliderPaused }"
            :style="highlightMarqueeTrackStyle"
          >
            <template v-for="loop in 2" :key="'marquee-loop-' + loop">
              <div
                v-for="(card, index) in highlightCards"
                :key="loop + '-' + index"
                class="hv-slider-slide"
                :style="highlightMarqueeSlideStyle"
              >
                <article
                  class="hv-slider-card"
                  :class="{
                    'hv-slider-card--navy': card.tone === 'navy',
                    'hv-slider-card--green': card.tone === 'green',
                  }"
                >
                  <h2 class="hv-slider-card-title">{{ card.title }}</h2>
                  <p class="hv-slider-card-text">{{ card.body }}</p>
                </article>
              </div>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- PROBLEM SECTION -->
    <section class="hv-problem" id="problem">
      <div class="hv-container">
        <div class="hv-section-label">
          <svg width="18" height="18" fill="none" stroke="#0f696e" viewBox="0 0 24 24">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
          </svg>
          <span style="color:#0f696e; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">The Problem</span>
        </div>
        <div class="hv-problem-top">
          <h2 class="hv-section-title">Why post <span style="color:#0f696e;">VAPT Remediation</span> is broken</h2>
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
              <svg width="16" height="16" fill="none" stroke="#0f696e" viewBox="0 0 24 24">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
              </svg>
              <span style="color:#0f696e; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">The Result?</span>
            </div>
            <p>Most cybersecurity teams run a VAPT exercise and stop at the report. Vulnerabilities sit in spreadsheets, lost in handoffs, or ignored in long development cycles.</p>
          </div>
          <div class="hv-result-right">
            <p style="font-size:15px; font-weight:400; color:#49454f; margin-bottom:12px;">Start for free, no obligations.</p>
            <button class="hv-btn-outline-dark" @click="handleFixNow">
              Get Started
              <i class="bi bi-arrow-right-circle-fill ms-1 fs-5" aria-hidden="true"></i>
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
            <span class="hv-dot" style="background:#0f696e;"></span>
            <span style="color:#0f696e; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Our Solution</span>
          </div>
          <h2 class="hv-section-title" style="text-align:center;">Foundations of a Mature<br/><span style="color:#0f696e;">Vulnerability Management</span> Program Remediation</h2>
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
              <span class="hv-dot" style="background:#0f696e;"></span>
              <span style="color:#0f696e; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Our Approach</span>
            </div>
            <h2 class="hv-section-title">
              Automation is not enough,
              <span style="color:#0f696e;">Human intelligence matters</span>
            </h2>
            <p class="hv-section-desc">While automation speeds up repetitive tasks, remediation requires human judgment. Our platform acts as your co-pilot:</p>
            <ul class="hv-check-list">
              <li>
                <svg width="22" height="22" fill="none" stroke="#0f696e" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
                AI offers initial triage and suggested fixes.
              </li>
              <li>
                <svg width="22" height="22" fill="none" stroke="#0f696e" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
                Security experts validate and refine recommendations.
              </li>
              <li>
                <svg width="22" height="22" fill="none" stroke="#0f696e" viewBox="0 0 24 24">
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

    <!-- CUSTOMER REVIEWS -->
    <section
      class="hv-reviews"
      aria-labelledby="hv-reviews-heading"
      @mouseenter="pauseReviewSlider"
      @mouseleave="resumeReviewSlider"
    >
      <div class="hv-container">
        <h2 id="hv-reviews-heading" class="hv-reviews-title">Customer Review</h2>
        <div class="hv-reviews-slider-wrap">
          <button
            type="button"
            class="hv-reviews-nav hv-reviews-nav--prev"
            aria-label="Previous reviews"
            @click="prevReviewSlide"
          >
            ‹
          </button>
          <div class="hv-reviews-viewport">
            <div class="hv-reviews-track" :style="reviewTrackStyle">
              <div
                v-for="(item, idx) in customerReviews"
                :key="idx"
                class="hv-review-slide"
                :style="reviewSlideStyle"
              >
                <article class="hv-review-card">
                  <span class="hv-review-quote" aria-hidden="true">“</span>
                  <p class="hv-review-text">{{ item.quote }}</p>
                  <div class="hv-review-footer">
                    <div class="hv-review-avatar" aria-hidden="true">{{ item.initials }}</div>
                    <div>
                      <p class="hv-review-name">{{ item.name }}</p>
                      <p class="hv-review-role">{{ item.role }}</p>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="hv-reviews-nav hv-reviews-nav--next"
            aria-label="Next reviews"
            @click="nextReviewSlide"
          >
            ›
          </button>
        </div>
        <div class="hv-reviews-dots" role="tablist" aria-label="Review slides">
          <button
            v-for="page in reviewPageCount"
            :key="'rdot-' + page"
            type="button"
            class="hv-reviews-dot"
            :class="{ 'hv-reviews-dot--active': page - 1 === reviewSlideIndex }"
            :aria-label="'Slide ' + page"
            :aria-selected="page - 1 === reviewSlideIndex"
            @click="goToReviewSlide(page - 1)"
          />
        </div>
      </div>
    </section>

    <!-- SCHEDULING PILLARS SECTION -->
    <section class="hv-pillars">
      <div class="hv-container">
        <div class="hv-section-header-center">
          <div class="hv-section-label" style="justify-content:center;">
            <span class="hv-dot" style="background:#0f696e;"></span>
            <span style="color:#0f696e; font-weight:600; text-transform:uppercase; font-size:13px; letter-spacing:1px;">Our Solution</span>
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
          Get Started
          <i class="bi bi-arrow-right-circle-fill ms-1 fs-5" aria-hidden="true"></i>
        </button>
      </div>
    </section>

    <Footer />

    <!-- Admin Sign Up Modal -->
    <AdminSignUpModal
      :show="showAdminSignUpModal"
      @close="closeAdminSignUpModal"
      @open-signin="handleOpenSignInFromAdminSignUp"
    />

  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';
import AdminSignUpModal from '@/components/admin-component/AdminSignUpModal.vue';
import AnimatedDashboard from '@/components/home-components/AnimatedDashboard.vue';

export default {
  name: 'HomeView',
  components: {
    Header,
    Footer,
    AdminSignUpModal,
    AnimatedDashboard,
  },
  data() {
    return {
      showAdminSignUpModal: false,
      highlightSliderPaused: false,
      highlightWindowWidth: 1200,
      reviewSlideIndex: 0,
      reviewSliderPaused: false,
      reviewSliderTimer: null,
      highlightCards: [
        {
          title: 'From Chaos to Clarity',
          body:
            'VAPTFIX turns vulnerability chaos into a clear chain of accountability — your CISO knows the risk, your teams know their role, and your auditors know the numbers.',
          tone: 'navy',
        },
        {
          title: 'Not a Project. A Partnership.',
          body:
            'Most tools scan and walk away. VAPTFIX stays — scanning, remediating, escalating, and even building compensatory controls until every vulnerability is closed.',
          tone: 'green',
        },
        {
          title: "The Regulator's Ready Report",
          body:
            'From discovery to compliance report in one platform — VAPTFIX gives you audit-ready vulnerability documentation the moment your regulator asks for it.',
          tone: 'navy',
        },
        {
          title: 'Fix It Faster. Prove It Faster.',
          body:
            'Your IT team gets exact remediation steps and human support. Your CISO gets real-time fix timelines. Your auditors get the evidence. Everyone wins.',
          tone: 'green',
        },
        {
          title: 'Assign It in Slack or Teams. Track It to Done.',
          body:
            "VAPTFIX meets your teams where they already work — assign vulnerabilities via Slack or Teams, and track every fix to closure, whether it's your engineer or a third-party vendor.",
          tone: 'navy',
        },
        {
          title: 'Evidence That Holds Up',
          body:
            'Every remediation tracked with owners and timestamps — audit trails stay complete without extra spreadsheets.',
          tone: 'green',
        },
      ],
      customerReviews: [
        {
          quote:
            'VAPTFIX is the single platform where every vulnerability gets an owner, a deadline, a fix, and a paper trail — from first scan to final sign-off.',
          name: 'Security Director',
          role: 'Financial services',
          initials: 'SD',
        },
        {
          quote:
            'From the moment a vulnerability is found to the moment it\'s proven closed, VAPTFIX keeps your teams accountable, your leadership informed, and your regulators satisfied.',
          name: 'Head of IT Risk',
          role: 'Technology',
          initials: 'IR',
        },
        {
          quote:
            'VAPTFIX transforms vulnerability management from a one-off IT headache into a continuous, measurable, boardroom-ready security operation.',
          name: 'VP Engineering',
          role: 'SaaS',
          initials: 'VE',
        },
        {
          quote:
            'One platform. Every vulnerability tracked, every team accountable, every regulator answered, every risk closed — that\'s VAPTFIX.',
          name: 'Compliance Lead',
          role: 'Regulated industry',
          initials: 'CL',
        },
        {
          quote:
            'VAPTFIX is the only vulnerability management platform that doesn\'t stop at detection — it drives every fix to completion with the people, process, and proof your organization demands.',
          name: 'CISO',
          role: 'Enterprise',
          initials: 'CI',
        },
      ],
    };
  },
  computed: {
    /** Cards visible at once (matches CSS breakpoints). */
    highlightVisibleCount() {
      const w = this.highlightWindowWidth;
      if (w < 576) return 1;
      if (w < 768) return 2;
      if (w < 1200) return 3;
      return 4;
    },
    /** Doubled row for seamless infinite scroll */
    highlightMarqueeTrackStyle() {
      const n = this.highlightCards.length;
      const v = this.highlightVisibleCount;
      if (!n || !v) return {};
      return {
        width: `calc(100% * ${2 * n} / ${v})`,
      };
    },
    highlightMarqueeSlideStyle() {
      const n = this.highlightCards.length;
      if (!n) return {};
      return { flex: `0 0 calc(100% / ${2 * n})` };
    },
    /** Customer reviews: 3-up desktop, 2 tablet, 1 mobile */
    reviewVisibleCount() {
      const w = this.highlightWindowWidth;
      if (w < 576) return 1;
      if (w < 992) return 2;
      return 3;
    },
    reviewMaxSlideIndex() {
      const n = this.customerReviews.length;
      const v = this.reviewVisibleCount;
      if (!n || !v) return 0;
      return Math.max(0, n - v);
    },
    reviewPageCount() {
      return this.reviewMaxSlideIndex + 1;
    },
    reviewTrackStyle() {
      const n = this.customerReviews.length;
      const v = this.reviewVisibleCount;
      if (!n || !v) return {};
      return {
        width: `calc(100% * ${n} / ${v})`,
        transform: `translateX(-${(this.reviewSlideIndex * 100) / n}%)`,
      };
    },
    reviewSlideStyle() {
      const n = this.customerReviews.length;
      if (!n) return {};
      return { flex: `0 0 calc(100% / ${n})` };
    },
  },
  mounted() {
    this.highlightWindowWidth = window.innerWidth;
    window.addEventListener('resize', this.onHighlightResize);
    this.startReviewSlider();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onHighlightResize);
    this.stopReviewSlider();
  },
  methods: {
    onHighlightResize() {
      this.highlightWindowWidth = window.innerWidth;
      this.reviewSlideIndex = Math.min(this.reviewSlideIndex, this.reviewMaxSlideIndex);
    },
    pauseHighlightSlider() {
      this.highlightSliderPaused = true;
    },
    resumeHighlightSlider() {
      this.highlightSliderPaused = false;
    },
    startReviewSlider() {
      this.stopReviewSlider();
      this.reviewSliderTimer = window.setInterval(() => {
        if (!this.reviewSliderPaused) {
          this.nextReviewSlide();
        }
      }, 5000);
    },
    stopReviewSlider() {
      if (this.reviewSliderTimer != null) {
        clearInterval(this.reviewSliderTimer);
        this.reviewSliderTimer = null;
      }
    },
    nextReviewSlide() {
      const max = this.reviewMaxSlideIndex;
      if (max < 0) return;
      this.reviewSlideIndex = this.reviewSlideIndex >= max ? 0 : this.reviewSlideIndex + 1;
    },
    prevReviewSlide() {
      const max = this.reviewMaxSlideIndex;
      if (max < 0) return;
      this.reviewSlideIndex = this.reviewSlideIndex <= 0 ? max : this.reviewSlideIndex - 1;
    },
    goToReviewSlide(index) {
      const max = this.reviewMaxSlideIndex;
      this.reviewSlideIndex = Math.min(Math.max(0, index), max);
    },
    pauseReviewSlider() {
      this.reviewSliderPaused = true;
    },
    resumeReviewSlider() {
      this.reviewSliderPaused = false;
    },
    handleFixNow() {
      this.showAdminSignUpModal = true;
    },
    closeAdminSignUpModal() {
      this.showAdminSignUpModal = false;
    },
    handleOpenSignInFromAdminSignUp() {
      this.closeAdminSignUpModal();
      this.$refs.pageHeader?.openSignUpModal();
    },
    handleOpenAdminSignUpFromSignIn() {
      this.$refs.pageHeader?.closeSignUpModal();
      this.showAdminSignUpModal = true;
    }
  },
};
</script>

<style scoped>
/* ===== BASE ===== */
* { box-sizing: border-box; }

.hv-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(14px, 4vw, 24px);
}

/* ===== HIGHLIGHTS SLIDER (above hero) ===== */
.hv-highlights-slider {
  margin-top: 0;
  padding: 6px 0 18px;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  overflow-x: clip;
}

.hv-slider-viewport {
  overflow: hidden;
  width: 100%;
}

.hv-slider-track {
  display: flex;
  align-items: stretch;
}

.hv-slider-track--marquee {
  will-change: transform;
  animation: hv-highlight-marquee 32s linear infinite;
}

.hv-slider-track--marquee.hv-slider-track--paused {
  animation-play-state: paused;
}

@keyframes hv-highlight-marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hv-slider-track--marquee {
    animation: none;
  }
}

.hv-slider-slide {
  box-sizing: border-box;
  padding: 0 4px;
  min-width: 0;
}

.hv-slider-card {
  width: 100%;
  height: 100%;
  min-height: 108px;
  max-height: min(20vw, 168px);
  max-width: none;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 9px 10px;
  border-radius: 11px;
  background: #fff;
  border: 1px solid rgba(15, 105, 110, 0.28);
  box-shadow: 0 3px 12px rgba(36, 20, 71, 0.05);
  overflow: hidden;
}

@media (max-width: 991.98px) {
  .hv-slider-card {
    max-height: min(26vw, 178px);
    min-height: 112px;
  }
}

@media (max-width: 575.98px) {
  .hv-slider-card {
    max-height: min(38vw, 200px);
    min-height: 120px;
    padding: 10px 11px;
  }
}

.hv-slider-card--navy {
  background: #241447;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-left: 3px solid #0f696e;
}

.hv-slider-card--green {
  background: #0f696e;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-left: 3px solid #0a4e52;
  box-shadow: 0 3px 14px rgba(15, 105, 110, 0.28);
}

.hv-slider-card-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(0.72rem, 1.65vw, 0.88rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 5px;
  color: #241447;
}

.hv-slider-card--navy .hv-slider-card-title,
.hv-slider-card--green .hv-slider-card-title {
  color: #fff;
}

.hv-slider-card-text {
  margin: 0;
  font-size: clamp(10.5px, 1.5vw, 12.5px);
  line-height: 1.4;
  color: #49454f;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
  overflow: hidden;
}

.hv-slider-card--navy .hv-slider-card-text,
.hv-slider-card--green .hv-slider-card-text {
  color: rgba(255, 255, 255, 0.92);
}

/* ===== HERO ===== */
.hv-hero {
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  padding: 20px 0 30px;
  margin-top: 72px;
  overflow-x: clip;
}

.hv-hero-grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 60px;
  align-items: center;
}

.hv-hero-content {
  min-width: 0;
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
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.15;
  margin-bottom: 16px;
}

.hv-gradient-text {
  color: #0f696e;
}

.hv-hero-sub {
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
  line-height: 1.6;
  margin-bottom: 24px;
}

.hv-hero-btns {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.hv-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0f696e;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s;
}
.hv-btn-primary:hover { background: #0a4e52; }

.hv-btn-outline {
  display: inline-flex;
  align-items: center;
  background: #fff;
  color: #49454f;
  border: 1px solid #d1d5db;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s;
}
.hv-btn-outline:hover { background: #f9fafb; }

.hv-hero-img-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  min-width: 0;
  width: 100%;
}

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
  background: #0f696e;
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
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #241447;
  line-height: 1.25;
  margin: 0 0 16px;
}

.hv-section-desc {
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
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
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: #241447;
  margin: 0 0 10px;
}

.hv-card p {
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
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
.hv-result-left p { font-size: 15px; font-weight: 400; color: #49454f; line-height: 1.65; margin: 8px 0 0; }

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
  background: #0f696e;
  color: #fff;
  border: none;
  padding: 12px 22px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  width: 100%;
  justify-content: center;
  transition: background 0.2s;
}
.hv-btn-outline-dark:hover { background: #0a4e52; }

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
  font-family: 'Inter', sans-serif;
  font-size: 22px;
  font-weight: 700;
  color: #241447;
  margin: 0 0 10px;
}

.hv-feature-desc {
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
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
  color: #49454f;
}

.hv-quote {
  font-size: 15px;
  color: #49454f;
  font-style: italic;
  border-left: 4px solid #0f696e;
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

/* ===== CUSTOMER REVIEWS (teal-first — matches highlight “green” cards) ===== */
.hv-reviews {
  background: linear-gradient(165deg, #1a1530 0%, #063d41 22%, #0f696e 46%, #0f7569 70%, #1a2740 100%);
  padding: 80px 0 88px;
  position: relative;
}

.hv-reviews::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(100% 85% at 50% 0%, rgba(36, 20, 71, 0.55) 0%, transparent 58%),
    radial-gradient(90% 80% at 0% 100%, rgba(36, 20, 71, 0.42) 0%, transparent 54%),
    radial-gradient(90% 80% at 100% 100%, rgba(36, 20, 71, 0.38) 0%, transparent 54%),
    radial-gradient(70% 55% at 100% 85%, rgba(24, 40, 72, 0.3) 0%, transparent 48%);
}

.hv-reviews .hv-container {
  position: relative;
  z-index: 1;
}

.hv-reviews-title {
  font-family: 'Inter', sans-serif;
  text-align: center;
  color: #fff;
  font-size: clamp(1.45rem, 3.2vw, 2rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 0 auto 44px;
  max-width: 720px;
  letter-spacing: -0.02em;
}

.hv-reviews-slider-wrap {
  display: flex;
  align-items: stretch;
  gap: 12px;
  margin-bottom: 22px;
}

.hv-reviews-viewport {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.hv-reviews-track {
  display: flex;
  align-items: stretch;
  transition: transform 0.45s ease-out;
}

.hv-review-slide {
  box-sizing: border-box;
  padding: 0 11px;
  min-width: 0;
  display: flex;
}

.hv-reviews-nav {
  flex-shrink: 0;
  align-self: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 1.65rem;
  line-height: 1;
  cursor: pointer;
  transition: background 0.2s;
}

.hv-reviews-nav:hover {
  background: rgba(255, 255, 255, 0.32);
}

.hv-reviews-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  padding-bottom: 2px;
}

.hv-reviews-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
}

.hv-reviews-dot:hover {
  background: rgba(255, 255, 255, 0.55);
}

.hv-reviews-dot--active {
  background: #fff;
  transform: scale(1.12);
}

.hv-review-card {
  background: #fff;
  border-radius: 18px;
  padding: 26px 24px 22px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.14);
  display: flex;
  flex-direction: column;
  min-height: 280px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.hv-review-quote {
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 3rem;
  line-height: 0.85;
  color: rgba(15, 105, 110, 0.35);
  margin-bottom: 6px;
  user-select: none;
}

.hv-review-text {
  margin: 0 0 22px;
  font-size: 15px;
  line-height: 1.62;
  color: #475569;
  font-style: italic;
  flex: 1;
}

.hv-review-footer {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding-top: 4px;
}

.hv-review-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(145deg, #0f696e, #241447);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.02em;
}

.hv-review-name {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
}

.hv-review-role {
  margin: 2px 0 0;
  font-size: 13px;
  color: #64748b;
}

@media (max-width: 575.98px) {
  .hv-reviews-nav {
    display: none;
  }

  .hv-reviews-slider-wrap {
    gap: 0;
  }

  .hv-review-slide {
    padding: 0 6px;
  }

  .hv-review-card {
    min-height: 260px;
  }
}

/* ===== PILLARS (purple / navy — cooler blue at bottom vs reviews teal) ===== */
.hv-pillars {
  background:
    radial-gradient(115% 75% at 50% 100%, rgba(15, 105, 110, 0.32) 0%, transparent 60%),
    radial-gradient(55% 50% at 10% 12%, rgba(15, 105, 110, 0.18) 0%, transparent 50%),
    radial-gradient(50% 40% at 92% 25%, rgba(15, 105, 110, 0.12) 0%, transparent 48%),
    linear-gradient(180deg, #231a3d 0%, #2f234c 45%, #253652 100%);
  padding: 96px 0;
  position: relative;
  overflow: hidden;
  border-top: 1px solid rgba(15, 105, 110, 0.52);
}

.hv-pillars::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
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
  font-family: 'Inter', sans-serif;
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
  font-family: 'Inter', sans-serif;
  font-size: clamp(1.5rem, 5vw, 2.25rem);
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.2;
}

.hv-cta-desc {
  font-size: 15px;
  font-weight: 400;
  color: #9ca3af;
  margin: 0 0 32px;
}

.hv-cta-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0f696e;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: background 0.2s;
}
.hv-cta-btn:hover { background: #0a4e52; }

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .hv-hero-grid,
  .hv-human-grid { grid-template-columns: 1fr; gap: 32px; }
  .hv-hero { padding: 28px 0 48px; }
  .hv-pillars-grid { grid-template-columns: repeat(2, 1fr); }
  .hv-hero-img-wrap { min-height: unset; }
  .hv-cards-2 { gap: 32px 40px; }
}

@media (max-width: 768px) {
  .hv-problem-top,
  .hv-cards-2,
  .hv-cards-3 { grid-template-columns: 1fr; }
  .hv-result-box { flex-direction: column; }
  .hv-result-right { min-width: unset; width: 100%; }
  .hv-pillars-grid { grid-template-columns: 1fr; }
  .hv-reviews { padding: 56px 0 64px; }
  .hv-section-title { font-size: clamp(1.35rem, 5vw, 1.75rem); }
  .hv-problem,
  .hv-features,
  .hv-human,
  .hv-pillars { padding: 56px 0; }
  .hv-section-header-center { margin-bottom: 40px; }
  .hv-card { padding: 24px; }
  .hv-result-box { padding: 28px 24px; gap: 24px; }
  .hv-human-grid { gap: 32px; }
  .hv-cta { padding: 56px 0; }
}
</style>
