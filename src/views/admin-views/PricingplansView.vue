<template>
  <main class="pricing-page">
    <Header />

    <section class="vulnerability-explorer">
      <div class="container-fluid py-4 py-md-5">
        <div class="container mt-2 mt-md-3 pt-1">
          <!-- Pricing page intro — temporarily hidden
          <div class="row text-center mt-4 mt-md-5">
            <div class="col-12">
              <h2 class="vuln-exp-heading mb-3 mb-md-4">Pricing plans</h2>
              <p class="vuln-exp-subhead mb-4 mb-md-5 px-sm-2">
                Vulnerability explorer provides access to a comprehensive database of vulnerabilities, enabling you
                to quickly identify and address potential risks.
              </p>
            </div>
          </div>
          -->
          <div class="row justify-content-center mb-2 py-4 py-md-5 mt-4 mt-md-5">
            <div class="col-12 text-center">
              <p class="pricing-coming-soon mb-0">!! Coming Soon</p>
            </div>
          </div>
          <!-- Pricing cards (Basic / Plus / Pro) — temporarily hidden
          <div class="row g-4 justify-content-center mb-2">
            <div class="col-12 col-md-6 col-xl-4">
              <div class="card text-start shadow h-100 pricing-card">
                <div class="card-body">
                  <h2 class="card-title pricing-tier-title">Basic</h2>
                  <p class="card-text pricing-card-subhead">Basic features to fix your vulnerabilities</p>
                  <p class="pricing-price mb-3">
                    $320<span class="pricing-price-suffix">per month</span>
                  </p>
                  <a href="#" class="btn text-light rounded-pill w-100 pricing-cta">
                    Get started <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                  </a>
                  <hr />
                  <p class="vuln-exp-subhead mb-2">Features you get:</p>
                  <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Vendor coordination (always included)</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Standard vulnerability reporting</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Access to basic remediation guidance</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Regular updates on known issues</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 col-xl-4">
              <div class="card text-start shadow h-100 pricing-card pricing-card--featured">
                <div class="card-body">
                  <h2 class="card-title pricing-tier-title">Plus</h2>
                  <p class="card-text pricing-card-subhead">Basic features to fix your vulnerabilities</p>
                  <p class="pricing-price mb-3">
                    $520<span class="pricing-price-suffix">per month</span>
                  </p>
                  <a href="#" class="btn text-light rounded-pill w-100 pricing-cta">
                    Get started <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                  </a>
                  <hr />
                  <p class="vuln-exp-subhead mb-2">Features you get:</p>
                  <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Everything in Basic</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Compensatory Controls (Plus) – provide additional suggested steps that can reduce risk temporarily until a full fix is applied</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Tailored recommendations for their environment (partially customized, not fully hands-on)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-12 col-md-6 col-xl-4">
              <div class="card text-start shadow h-100 pricing-card">
                <div class="card-body">
                  <h2 class="card-title pricing-tier-title">Pro</h2>
                  <p class="card-text pricing-card-subhead">Basic features to fix your vulnerabilities</p>
                  <p class="pricing-price mb-3">
                    $720<span class="pricing-price-suffix">per month</span>
                  </p>
                  <a href="#" class="btn text-light rounded-pill w-100 pricing-cta">
                    Get started <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                  </a>
                  <hr />
                  <p class="vuln-exp-subhead mb-2">Features you get:</p>
                  <ul class="list-unstyled mb-0">
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Everything in Plus</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Full Compensatory Controls (Premium) – entire new steps or methods designed specifically for their environment to fix vulnerabilities</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Professional Support (Premium) – dedicated personal support to implement fixes</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Hands-on assistance for patching and configuration</span>
                    </li>
                    <li class="d-flex align-items-start mb-2 pricing-feature-line">
                      <i class="bi bi-check2 me-2 flex-shrink-0 pricing-check" aria-hidden="true"></i>
                      <span>Advanced reporting and monitoring tailored to their infrastructure</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          -->
        </div>

        <!-- Trusted by + client logos — temporarily hidden
        <div class="row my-4 my-md-5 justify-content-center">
          <div class="col-12">
            <p class="text-center mt-3 mt-md-5 trusted-line">Trusted by 30+ companies</p>
            <div class="scroll-banner">
            <div class="scroll-track">
              <img src="@/assets/images/clients/client-1.png" alt="" />
              <img src="@/assets/images/clients/client-2.png" alt="" />
              <img src="@/assets/images/clients/client-3.png" alt="" />
              <img src="@/assets/images/clients/client-4.png" alt="" />
              <img src="@/assets/images/clients/client-5.png" alt="" />
              <img src="@/assets/images/clients/client-6.png" alt="" />
              <img src="@/assets/images/clients/client-7.png" alt="" />
              <img src="@/assets/images/clients/client-8.png" alt="" />
              <img src="@/assets/images/clients/client-11.png" alt="" />
              <img src="@/assets/images/clients/client-12.png" alt="" />
              <img src="@/assets/images/clients/client-13.png" alt="" />

              <img src="@/assets/images/clients/client-1.png" alt="" />
              <img src="@/assets/images/clients/client-2.png" alt="" />
              <img src="@/assets/images/clients/client-3.png" alt="" />
              <img src="@/assets/images/clients/client-4.png" alt="" />
              <img src="@/assets/images/clients/client-5.png" alt="" />
              <img src="@/assets/images/clients/client-6.png" alt="" />
              <img src="@/assets/images/clients/client-7.png" alt="" />
              <img src="@/assets/images/clients/client-8.png" alt="" />
              <img src="@/assets/images/clients/client-11.png" alt="" />
              <img src="@/assets/images/clients/client-12.png" alt="" />
              <img src="@/assets/images/clients/client-13.png" alt="" />
            </div>
            </div>
          </div>
        </div>
        -->
      </div>
    </section>

    <section>
      <div class="container-fluid mb-4 mb-md-5 py-4 py-md-5">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 fix-card py-lg-5 px-lg-5 py-md-4 px-md-4 py-3 px-3 position-relative">
            <div class="start-fixing-glow"></div>
            <div class="row position-relative align-items-center" style="z-index: 1">
              <div class="col-12 col-md-6 mb-3 mb-md-0">
                <h1 class="mb-3 start-fixing-title">Start Fixing Critical Bugs Instantly.</h1>
                <p class="my-3 my-md-4 start-fixing-desc">
                  Identify, prioritize, and fix security flaws fast. Reduce risk with zero-friction setup and smart automation.
                </p>
                <button
                  type="button"
                  class="btn rounded-pill mt-2 mt-md-4 start-fixing-btn"
                  @click="openAdminSignUpModal"
                >
                  Get Started
                  <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                </button>
              </div>
              <div class="col-12 col-md-6 text-center">
                <img
                  src="@/assets/images/start-fixing-img.png"
                  alt=""
                  class="img-fluid start-fixing-img"
                  width="320"
                  height="280"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />

    <AdminSignUpModal :show="showAdminSignUpModal" @close="closeAdminSignUpModal" />
  </main>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';
import AdminSignUpModal from '@/components/admin-component/AdminSignUpModal.vue';

export default {
  name: 'PricingplansView',
  components: {
    Header,
    Footer,
    AdminSignUpModal,
  },
  data() {
    return {
      showAdminSignUpModal: false,
    };
  },
  methods: {
    openAdminSignUpModal() {
      this.showAdminSignUpModal = true;
    },
    closeAdminSignUpModal() {
      this.showAdminSignUpModal = false;
    },
  },
};
</script>

<style scoped>
.pricing-page {
  overflow-x: hidden;
}

.pricing-coming-soon {
  font-size: clamp(3rem, 12vw, 5.5rem);
  font-weight: 800;
  color: #241447;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.pricing-card {
  border-radius: 12px;
  border: 1px solid rgba(36, 20, 71, 0.08);
}

.pricing-card--featured {
  border: 2px solid #0f696e;
}

.pricing-tier-title {
  color: #241447;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
}

.pricing-price {
  font-size: clamp(2rem, 6vw, 3.25rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.1;
  margin: 0;
}

.pricing-price-suffix {
  display: inline-block;
  margin-left: 0.35rem;
  font-size: clamp(0.85rem, 2.5vw, 1rem);
  font-weight: 500;
  color: rgba(0, 0, 0, 0.75);
  vertical-align: middle;
}

.pricing-cta {
  background-color: #121212;
  font-size: 1rem;
  font-weight: 500;
}

.pricing-feature-line {
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
}

.pricing-check {
  color: #0f696e;
  margin-top: 0.15rem;
}

.trusted-line {
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
  font-size: 15px;
}

.start-fixing-title {
  color: #ffffff;
  font-weight: 800;
  font-size: clamp(1.5rem, 4vw, 2.25rem);
  line-height: 1.2;
}

.start-fixing-desc {
  color: rgba(255, 255, 255, 0.78);
  font-size: 15px;
  line-height: 1.65;
  font-weight: 400;
}

.start-fixing-btn {
  background-color: #0f696e;
  color: #fff;
  font-weight: 400;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.start-fixing-img {
  max-width: min(100%, 320px);
  height: auto;
}

@media (max-width: 575.98px) {
  .scroll-track img {
    height: 48px;
  }
}
</style>
