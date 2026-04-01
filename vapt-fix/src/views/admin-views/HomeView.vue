<template>
  <main>
    <Header />

    <!-- hero section -->
    <section class="hero-section">
      <div class="container-fluid">
      <div class="row">
        <div class="col-lg-6 col-md-12 col-sm-12">
          <p><i class="bi bi-shield-fill-check"></i> Vetted, tested security. Trusted by experts</p>
          <h1>Welcome to the Vulnerability Management Program as a service platform</h1>
          <p class="hero-text">Security isn’t just about finding flaws—it’s about fixing them fast. We close the gaps that reports leave behind, giving you lasting protection.</p>
          <!-- <div class="hero-div-btn">
             <router-link to="/location">
              <button type="button" class="btn hero-btn">
                Fix your vulnerabilities now
                <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
              </button>
            </router-link>
          </div> -->
          <!-- Replace your existing hero button block with this -->
<div class="hero-div-btn">
  <button type="button" class="btn hero-btn" @click="handleFixNow">
    Get Started
    <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
  </button>
  <!-- <button
  type="button"
  class="btn hero-btn"
  @click.prevent.stop="handleFixNow"
>
  Fix your vulnerabilities now
  <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
</button> -->

</div>

        </div>
        <div class="col-lg-6 col-md-12 col-sm-12">
          <!-- <div class="hero-img">
            <img src="../assets/images/hero-img.png" alt="">
          </div> -->
          <div class="cyber-bg">
            <img src="@/assets/images/hero-img.png" alt="Cyber Security" class="center-img" />
          </div>
        </div>
      </div>

     </div>
    </section>

    <!-- Why post VAPT Remidiation is broken -->
    <section class="remidiation-section fluid-padding">
      <div class="container-fluid gx-0">

        <!-- Scrolling Cards Banner -->
        <div class="row mb-4">
          <div class="cards-scroll-wrapper">
            <div class="cards-scroll-track">

              <!-- Card 1 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-graph-up-arrow"></i></div>
                <h6 class="info-card-title">"Stop Tracking Paper SLAs. Start Tracking Real-Time Resilience."</h6>
                <p class="info-card-desc">Close the gap between theoretical policy and actual mitigation speed.</p>
              </div>

              <!-- Card 2 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-map"></i></div>
                <h6 class="info-card-title">"Is Your Policy a Promise or a Reality? Map Your Mitigation Timeline Today."</h6>
                <p class="info-card-desc">Highlight the risk criteria mapping against operational data.</p>
              </div>

              <!-- Card 3 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-eye"></i></div>
                <h6 class="info-card-title">"Visibility Without Action is Just Noise. Bridge the Gap Between Detection and Fix."</h6>
                <p class="info-card-desc">Transition from "seeing" to "solving."</p>
              </div>

              <!-- Card 4 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-shield-check"></i></div>
                <h6 class="info-card-title">"Your Security is Only as Strong as Your Weakest Vendor. Hold Them Accountable."</h6>
                <p class="info-card-desc">Track third-party mitigation.</p>
              </div>

              <!-- Card 5 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-display"></i></div>
                <h6 class="info-card-title">"One View. Zero Roadblocks. Total Command Over Your Entire Attack Surface."</h6>
                <p class="info-card-desc">A comprehensive view of assets and ownership.</p>
              </div>

              <!-- Card 6 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-people"></i></div>
                <h6 class="info-card-title">"Don't Just Find Vulnerabilities — Fix Them. Collaborate Across Every Team."</h6>
                <p class="info-card-desc">Assign, track, and close vulnerabilities across internal and external teams.</p>
              </div>

              <!-- Card 7 -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-bar-chart-line"></i></div>
                <h6 class="info-card-title">"Turn Audit Anxiety Into Audit Confidence. Every Fix. Every Proof. Always Ready."</h6>
                <p class="info-card-desc">Audit-ready evidence for every remediation action.</p>
              </div>

              <!-- Duplicate Cards for seamless loop -->
              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-graph-up-arrow"></i></div>
                <h6 class="info-card-title">"Stop Tracking Paper SLAs. Start Tracking Real-Time Resilience."</h6>
                <p class="info-card-desc">Close the gap between theoretical policy and actual mitigation speed.</p>
              </div>

              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-map"></i></div>
                <h6 class="info-card-title">"Is Your Policy a Promise or a Reality? Map Your Mitigation Timeline Today."</h6>
                <p class="info-card-desc">Highlight the risk criteria mapping against operational data.</p>
              </div>

              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-eye"></i></div>
                <h6 class="info-card-title">"Visibility Without Action is Just Noise. Bridge the Gap Between Detection and Fix."</h6>
                <p class="info-card-desc">Transition from "seeing" to "solving."</p>
              </div>

              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-shield-check"></i></div>
                <h6 class="info-card-title">"Your Security is Only as Strong as Your Weakest Vendor. Hold Them Accountable."</h6>
                <p class="info-card-desc">Track third-party mitigation.</p>
              </div>

              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-display"></i></div>
                <h6 class="info-card-title">"One View. Zero Roadblocks. Total Command Over Your Entire Attack Surface."</h6>
                <p class="info-card-desc">A comprehensive view of assets and ownership.</p>
              </div>

              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-people"></i></div>
                <h6 class="info-card-title">"Don't Just Find Vulnerabilities — Fix Them. Collaborate Across Every Team."</h6>
                <p class="info-card-desc">Assign, track, and close vulnerabilities across internal and external teams.</p>
              </div>

              <div class="info-card">
                <div class="info-card-icon"><i class="bi bi-bar-chart-line"></i></div>
                <h6 class="info-card-title">"Turn Audit Anxiety Into Audit Confidence. Every Fix. Every Proof. Always Ready."</h6>
                <p class="info-card-desc">Audit-ready evidence for every remediation action.</p>
              </div>

            </div>
          </div>
        </div>

        <!-- <div class="row mb-5">
        <div class="scroll-banner">
        <div class="scroll-track">
          Original images
          <img src="@/assets/images/clients/client-1.png" alt="">
          <img src="@/assets/images/clients/client-2.png" alt="">
          <img src="@/assets/images/clients/client-3.png" alt="">
          <img src="@/assets/images/clients/client-4.png" alt="">
          <img src="@/assets/images/clients/client-5.png" alt="">
          <img src="@/assets/images/clients/client-6.png" alt="">
          <img src="@/assets/images/clients/client-7.png" alt="">
          <img src="@/assets/images/clients/client-8.png" alt="">
          <img src="@/assets/images/clients/client-11.png" alt="">
          <img src="@/assets/images/clients/client-12.png" alt="">
          <img src="@/assets/images/clients/client-13.png" alt="">

          Duplicate images for seamless loop
          <img src="@/assets/images/clients/client-1.png" alt="">
          <img src="@/assets/images/clients/client-2.png" alt="">
          <img src="@/assets/images/clients/client-3.png" alt="">
          <img src="@/assets/images/clients/client-4.png" alt="">
          <img src="@/assets/images/clients/client-5.png" alt="">
          <img src="@/assets/images/clients/client-6.png" alt="">
          <img src="@/assets/images/clients/client-7.png" alt="">
          <img src="@/assets/images/clients/client-8.png" alt="">
          <img src="@/assets/images/clients/client-11.png" alt="">
          <img src="@/assets/images/clients/client-12.png" alt="">
          <img src="@/assets/images/clients/client-13.png" alt="">
        </div>
        </div>
      </div> -->
        <div class="row">
          <div class="col-lg-6">
            <p class="warning"><i class="bi bi-exclamation-triangle-fill"></i> The problem</p>
            <h2 class="fw-semibold">Why post VAPT Remidiation is broken</h2>
          </div>
          <div class="col-lg-6 d-flex flex-column justify-content-end">
            <p>Most cybersecurity teams run a VAPT exercise and stop at the report. But what happens after the vulnerabilities are discovered? They sit in spreadsheets, lost in handoffs, or ignored in long development cycles.</p>
          </div>
        </div>

        <div class="row remidiation-cards">
          <div class="col-lg-4 col-md-4 col-sm-12">
            <div class="mb-5">
              <img src="@/assets/images/ownership.png" class="" alt="...">
              <h5 class="card-title">No clear ownership</h5>
              <p class="card-text mt-2">No clear ownership. No clear ownership. No clear ownership. No clear ownership. No clear ownership.</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12">
            <div class="mb-5">
              <img src="@/assets/images/guidance.png" class="" alt="...">
              <h5 class="card-title">Vague remediation guidance</h5>
              <p class="card-text mt-2">No clear ownership. No clear ownership. No clear ownership. No clear ownership. No clear ownership.</p>
            </div>
          </div>
          <div class="col-lg-4 col-md-4 col-sm-12">
            <div class="mb-5">
              <img src="@/assets/images/prioritization.png" class="" alt="...">
              <h5 class="card-title">No risk prioritization</h5>
              <p class="card-text mt-2">No clear ownership. No clear ownership. No clear ownership. No clear ownership. No clear ownership.</p>
            </div>
          </div>
        </div>

        <div class="row result-row">
          <div class="col-lg-6 col-md-6">
            <p class="warning"><i class="bi bi-exclamation-triangle-fill"></i> The problem</p>
            <h2 class="fw-semibold">The result?</h2>
            <div class="">
              <p class="mt-lg-5 mt-5">Most cybersecurity teams run a VAPT exercise and stop at the report. But what happens after the vulnerabilities are discovered? They sit in spreadsheets, lost in handoffs, or ignored in long development cycles.</p>
            </div>
          </div>
          <div class="col-lg-6 col-md-6 mt-lg-5 mt-md-5">
          <div class="result-box text-center p-4 mt-5">
            <p class="mb-3">Start for free, no obligations.</p>
            <button type="button" class="btn fw-semibold" @click="handleFixNow">
              Fix your vulnerabilities now
              <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
            </button>
          </div>
        </div>

        </div>
      </div>
    </section>

    <!-- Our Approach to Quick Remediation -->
    <section class="our-approach">
      <div class="container-fluid gx-0">
        <div class="row">
          <div class="col-lg-12 our-approach-top">
          </div>
        </div>
      </div>

      <div class="container-fluid our-approach-box py-3 gx-0">
        <div class="text-center">
              <p><i class="bi bi-puzzle-fill"></i> Our solution</p>
              <h1>   Foundations of a Mature<br>
            Vulnerability Management Program<br>
              Remediation
</h1>
        </div>
        <div class="container my-5">
        <div class="card-wrapper">
          <!-- Card 1 -->
          <div class="card-fixed">
            <div class="card-top-bg">
              <img src="" alt="">
            </div>
            <h4 class="text-white mt-4">Continuous Multi-Modal Discovery</h4>
            <p>See everything, everywhere. Continuously discover vulnerabilities across hybrid cloud, on-premises infrastructure, and remote endpoints.</p>
          </div>
          <!-- Card 2 -->
          <div class="card-fixed">
            <div class="card-top-bg">
              <img src="" alt="">
            </div>
            <h4 class="text-white mt-4">Intelligent Mitigation Guidance</h4>
            <p>Stop searching for the fix. Get the blueprints. Every vulnerability is paired with clear, actionable, human-readable steps tailored to your specific technology stack. We provide the technical instructions your teams need to resolve issues without the manual research overhead.</p>
          </div>
          <!-- Card 3 -->
          <div class="card-fixed">
            <div class="card-top-bg">
              <img src="" alt="">
            </div>
            <h4 class="text-white mt-4">Internal & 3rd Party Task Orchestration</h4>
            <p>Hold every stakeholder accountable. Track and manage mitigation tasks across your internal teams and external vendors through a single pane of glass. Collaborative portals allow third-party partners to view their specific exposures and report progress directly to you.</p>
          </div>
          <!-- Card 4 -->
          <div class="card-fixed">
            <div class="card-top-bg">
              <img src="" alt="">
            </div>
            <h4 class="text-white mt-4">Operational Reality Mapping</h4>
            <p>Ascertain exactly how your operational timeline stacks up against the risk criteria set in your management policy. We map the time it actually takes to mitigate against your "paper" recommendations, surfacing the real-world exposure windows that static SLAs hide.</p>
          </div>
        </div>
        </div>
      </div>

      <div class="container-fluid g-0">
        <div class="row gx-0">
          <div class="col-lg-12 our-approach-bottom">
          </div>
        </div>
      </div>
    </section>

    <!-- Automation is not enough, Human intelligence matters -->
    <section class="automation fluid-padding">
      <div class="container-fluid position-relative">
        <!-- Purple shadow element -->
      <div class="automation-glow"></div>

        <div class="row">
          <div class="col-lg-6">
            <p class="warning"><i class="bi bi-puzzle-fill"></i> Our solution</p>
            <h1 class="fw-semibold display-4">Automation is not enough, Human  intelligence matters</h1>
            <p class="mt-3 mb-4 automation-para">While automation speeds up repetitive tasks, remediation requires human judgment. Our platform acts as your co-pilot:</p>
            <ul class="lh-lg automation-list">
              <li>AI offers initial triage and suggested fixes.</li>
              <li>Security experts validate and refine recommendations.</li>
              <li>Teams get precise, actionable steps they can trust.</li>
            </ul>
            <p class="mt-3 automation-para">This hybrid approach reduces false positives, accelerates remediation, and ensures secure releases.</p>
          </div>
          <div class="col-lg-6 d-flex justify-content-center align-items-center">
            <img src="@/assets/images/automation-img.png" alt="" class="img-fluid">
          </div>
        </div>
      </div>
    </section>

    <!-- Insights -->
     <section class="insights fluid-padding">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12 text-center">
            <p class="insight-icon"><i class="bi bi-puzzle-fill"></i> Insights</p>
            <h1>Insights</h1>
          </div>
        </div>

          <div class="row py-4 mb-lg-5">
            <div class="col-lg-4 col-md-6">
              <div class="card insights-card mb-4">
              <img src="@/assets/images/insight-img-1.jpg" class="card-img-top" alt="...">
              <div class="card-body">
                <div class="d-flex justify-content-start gap-3 insights-detail">
                  <p class="mb-0 insights-date">Tue, 12 December</p>
                  <p class="mb-0 with-dot insights-name">April Parker</p>
                </div>
                <h4 class="card-title fw-semibold lh-sm">How We Fixed a Critical Vulnerability in Under 24 Hours</h4>
                <p class="card-text insights-para">How We Fixed a Critical Vulnerability in Under 24 Hours.</p>
                <a href="#" class="card-link text-decoration-none">Read More</a>
              </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="card insights-card mb-4">
              <img src="@/assets/images/insight-img-2.jpg" class="card-img-top" alt="...">
              <div class="card-body">
                <div class="d-flex justify-content-start gap-3 insights-detail">
                  <p class="mb-0 insights-date">Tue, 12 December</p>
                  <p class="mb-0 with-dot insights-name">April Parker</p>
                </div>
                <h4 class="card-title fw-semibold lh-sm">How We Fixed a Critical Vulnerability in Under 24 Hours</h4>
                <p class="card-text insights-para">How We Fixed a Critical Vulnerability in Under 24 Hours.</p>
                <a href="#" class="card-link text-decoration-none">Read More</a>
              </div>
              </div>
            </div>
            <div class="col-lg-4 col-md-6">
              <div class="card insights-card mb-4">
              <img src="@/assets/images/insight-img-3.jpg" class="card-img-top" alt="...">
              <div class="card-body">
                <div class="d-flex justify-content-start gap-3 insights-detail">
                  <p class="mb-0 insights-date">Tue, 12 December</p>
                  <p class="mb-0 with-dot insights-name">April Parker</p>
                </div>
                <h4 class="card-title fw-semibold lh-sm">How We Fixed a Critical Vulnerability in Under 24 Hours</h4>
                <p class="card-text insights-para">How We Fixed a Critical Vulnerability in Under 24 Hours.</p>
                <a href="#" class="card-link text-decoration-none">Read More</a>
              </div>
              </div>
            </div>
          </div>
      </div>
     </section>

    <!-- Our vetting process -->
     <section class="vetting fluid-padding">
      <div class="container-fluid position-relative">
         <!-- Shadow on the left -->
       <div class="purple-glow"></div>
        <div class="row text-center mb-5 pb-lg-5">
          <p class="vetting-icon"><i class="bi bi-puzzle-fill"></i> Our solution</p>
          <h1 class="vetting-head">Flexible Assessment Scheduling</h1>
        </div>

        <div class="row text-center process-step-wrapper pt-4 align-items-start">
        <!-- Step 1 -->
        <div class="col-md-3 col-12 mb-4 position-relative step">
          <div class="step-number">1</div>
          <h5 class="step-title">Security on your timeline</h5>
          <p class="step-desc">
           Security on your timeline. Provision for assessment of frequencies that match your risk appetite—from daily continuous scans for critical production assets to comprehensive annual deep-dives for compliance.

          </p>
          <!-- Right dashed line -->
          <div class="dashed-line d-none d-md-block"></div>
        </div>

        <!-- Step 2 -->
        <div class="col-md-3 col-12 mb-4 position-relative step">
          <div class="step-number">2</div>
          <h5 class="step-title">Expert Mitigation Support</h5>
          <p class="step-desc">
           Expertise on demand. Gain access to expert mitigation support to help your team navigate complex remediations. Our specialists provide manual validation to remove false positives and guidance for vulnerabilities that lack standard vendor patches.
          </p>
          <!-- Right dashed line -->
          <div class="dashed-line d-none d-md-block"></div>
        </div>

        <!-- Step 3 -->
        <div class="col-md-3 col-12 mb-4 position-relative step">
          <div class="step-number">3</div>
          <h5 class="step-title">Native Slack & Teams Integration</h5>
          <p class="step-desc">
            Manage communication where your team works. Keep everyone aligned with real-time notifications and task management directly within Slack and Microsoft Teams. Reduce friction between security and IT by moving discussions out of email and into your primary collaboration channels.

          </p>
          <!-- Right dashed line -->
          <div class="dashed-line d-none d-md-block"></div>
        </div>

        <!-- Step 4 -->
        <div class="col-md-3 col-12 mb-4 position-relative step">
          <div class="step-number">4</div>
          <h5 class="step-title">Comprehensive Asset Command Center</h5>
          <p class="step-desc">
           Total visibility across your entire game. Get a comprehensive view of your vulnerabilities across all assets. Track trends, monitor your global risk score, and ensure you stay on top of the game with audit-ready evidence for every remediation action.

          </p>
        </div>
        </div>
        <!-- Bottom glow shadow -->
        <div class="bottom-glow"></div>

        <div class="row justify-content-center">
          <div class="col-lg-10 fix-card py-lg-5 px-lg-5 py-md-4 px-md-4 py-3 px-3 position-relative">
            <!-- Bottom Shadow Glow -->
          <div class="start-fixing-glow"></div>
            <div class="row position-relative" style="z-index: 1;">
            <div class="col-lg-6 col-md-6 mb-3">
              <h1 class="mb-3">Start Fixing Critical Bugs Instantly.</h1>
                <p class="my-4">Identify, prioritize, and fix security flaws fast. Reduce risk with zero-friction setup and smart automation.</p>
                <button type="button" class="btn btn-light rounded-pill fw-semibold mt-4" @click="handleFixNow">
              Fix your vulnerabilities now
              <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
            </button>
            </div>
            <div class="col-lg-6 col-md-6 text-center">
              <img src="@/assets/images/start-fixing-img.png" alt="" class="img-fluid" style="height: 280px;width: 320px;">
            </div>
            </div>
          </div>
        </div>

      </div>
     </section>

     <Footer />

  </main>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';
import { useAuthStore } from "@/stores/authStore";

export default {
  name: 'HomeView',
  components: {
    Header,
    Footer
  },
methods: {
  // handleFixNow() {
  //   const isAuthenticated = localStorage.getItem("authenticated") === "true";
  //   if (isAuthenticated) {
  //     this.$router.push("/signin");
  //   } else {
  //     this.$router.push("/signup");
  //   }
  // }
  handleFixNow() {
    this.$router.push("/signup");
  }
}

};
</script>

<style scoped>
/* ===== Scrolling Cards Banner Section ===== */
.cards-scroll-wrapper {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.cards-scroll-wrapper:hover .cards-scroll-track {
  animation-play-state: paused;
}

.cards-scroll-track {
  display: flex;
  width: max-content;
  gap: 20px;
  animation: cards-scroll-left 30s linear infinite;
  align-items: stretch;
  padding: 10px 0;
}

.info-card {
  background: #ffffff;
  border: 1px solid rgba(90, 68, 255, 0.2);
  border-radius: 16px;
  padding: 24px 20px;
  width: 280px;
  min-width: 280px;
  box-shadow: 0 2px 12px rgba(90, 68, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: default;
}

.info-card:hover {
  box-shadow: 0 6px 24px rgba(90, 68, 255, 0.15);
  transform: translateY(-4px);
}

.info-card-icon {
  width: 44px;
  height: 44px;
  background: rgba(90, 68, 255, 0.08);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: rgba(90, 68, 255, 1);
  flex-shrink: 0;
}

.info-card-title {
  font-size: 14px;
  font-weight: 700;
  color: rgba(9, 9, 35, 0.88);
  line-height: 1.5;
  margin: 0;
}

.info-card-desc {
  font-size: 13px;
  color: rgba(9, 9, 35, 0.5);
  line-height: 1.6;
  margin: 0;
}

@keyframes cards-scroll-left {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>