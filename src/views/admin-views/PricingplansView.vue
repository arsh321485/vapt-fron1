<template>
  <main class="pricing-page">
    <Header />

    <section class="vulnerability-explorer">
      <div class="container-fluid py-4 py-md-5">
        <div class="container mt-2 mt-md-3 pt-1">

          <!-- STEP 1: Plan cards -->
          <template v-if="step === 'plans'">
            <div class="row text-center mt-4 mt-md-5">
              <div class="col-12">
                <h2 class="vuln-exp-heading mb-3 mb-md-4">Pricing plans</h2>
                <p class="vuln-exp-subhead mb-4 mb-md-5 px-sm-2">
                  Freemium, Premium &amp; Custom — choose the plan that fits your asset scope and how you run VAPT.
                </p>
              </div>
            </div>

            <div class="row g-4 justify-content-center mb-2 align-items-stretch">
              <div
                v-for="plan in planList"
                :key="plan.id"
                class="col-12 col-md-6 col-xl-4"
              >
                <div
                  class="card text-start shadow h-100 pricing-card"
                  :class="{ 'pricing-card--featured': plan.featured }"
                >
                  <div v-if="plan.featured" class="pricing-popular-badge">MOST POPULAR</div>
                  <div class="card-body d-flex flex-column">
                    <h2 class="card-title pricing-tier-title">{{ plan.name }}</h2>
                    <p
                      class="pricing-price mb-1"
                      :class="{ 'pricing-price--contact': plan.id === 'custom' }"
                    >
                      {{ plan.priceLabel }}
                    </p>
                    <p class="pricing-price-note mb-3">{{ plan.priceNote }}</p>
                    <button
                      type="button"
                      class="btn text-light rounded-pill w-100 pricing-cta"
                      :class="{ 'pricing-cta--featured': plan.featured }"
                      @click="selectPlan(plan.id)"
                    >
                      {{ plan.cta }}
                      <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                    </button>
                    <hr />
                    <p class="vuln-exp-subhead mb-2">{{ plan.featuresHeading }}</p>
                    <ul class="list-unstyled mb-0">
                      <li
                        v-for="(feature, idx) in plan.features"
                        :key="idx"
                        class="d-flex align-items-start mb-2 pricing-feature-line"
                      >
                        <i
                          class="bi me-2 flex-shrink-0"
                          :class="feature.included ? 'bi-check2 pricing-check' : 'bi-x-lg pricing-x'"
                          aria-hidden="true"
                        ></i>
                        <span>{{ feature.text }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- STEP 2: Plan details -->
          <template v-else-if="step === 'details' && activePlan">
            <div class="pricing-flow mt-4 mt-md-5">
              <button type="button" class="pricing-back" @click="goBack">
                <i class="bi bi-arrow-left" aria-hidden="true"></i> Back to plans
              </button>

              <div class="pricing-progress" aria-hidden="true">
                <span class="pricing-progress-dot done"></span>
                <span class="pricing-progress-line done"></span>
                <span class="pricing-progress-dot active"></span>
                <span class="pricing-progress-line"></span>
                <span class="pricing-progress-dot"></span>
              </div>
              <p class="pricing-progress-label">Step 2 of 3 — Review plan</p>

              <div class="pricing-detail-shell">
                <div class="pricing-detail-hero">
                  <div class="pricing-detail-hero-text">
                    <span class="pricing-detail-eyebrow">Selected plan</span>
                    <h2 class="pricing-detail-name">{{ activePlan.name }}</h2>
                    <p class="pricing-detail-note">{{ detailPriceNote }}</p>
                  </div>
                  <div class="pricing-detail-price-box">
                    <span class="pricing-detail-price">{{ detailPriceLabel }}</span>
                  </div>
                </div>

                <div class="pricing-detail-body">
                  <div class="pricing-features-panel">
                    <p class="pricing-features-heading">{{ activePlan.featuresHeading }}</p>
                    <ul class="pricing-features-grid list-unstyled mb-0">
                      <li
                        v-for="(feature, idx) in activePlan.features"
                        :key="idx"
                        class="pricing-feature-chip"
                        :class="{ 'is-excluded': !feature.included }"
                      >
                        <i
                          class="bi"
                          :class="feature.included ? 'bi-check-circle-fill' : 'bi-x-circle-fill'"
                          aria-hidden="true"
                        ></i>
                        <span>{{ feature.text }}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- Premium: Management vs Management + Testing -->
                  <div v-if="activePlan.id === 'premium'" class="pricing-mode-block">
                    <p class="pricing-cycle-label">How will you use Premium?</p>
                    <p class="pricing-mode-hint">
                      Mode is based on whether you upload a report or provide scope for VAPTFix to test — not a free toggle you can mix later.
                    </p>
                    <div class="pricing-mode-options">
                      <label
                        class="pricing-mode-option"
                        :class="{ active: premiumMode === 'management' }"
                      >
                        <input
                          v-model="premiumMode"
                          type="radio"
                          name="premiumMode"
                          value="management"
                          class="visually-hidden"
                        />
                        <div class="pricing-mode-option-top">
                          <span class="pricing-mode-tag">a. Management</span>
                          <span class="pricing-mode-price">From $1.25 / IP</span>
                        </div>
                        <strong class="pricing-mode-title">I already have a report</strong>
                        <p class="pricing-mode-copy">
                          Upload your report. VAPTFix does not run testing. Platform covers dashboard, tracking, and reporting. Billed per IP by billing cycle.
                        </p>
                      </label>

                      <label
                        class="pricing-mode-option"
                        :class="{ active: premiumMode === 'testing' }"
                      >
                        <input
                          v-model="premiumMode"
                          type="radio"
                          name="premiumMode"
                          value="testing"
                          class="visually-hidden"
                        />
                        <div class="pricing-mode-option-top">
                          <span class="pricing-mode-tag">b. Management + Testing</span>
                          <span class="pricing-mode-price">$20 / IP / year</span>
                        </div>
                        <strong class="pricing-mode-title">I need VAPTFix to run testing</strong>
                        <p class="pricing-mode-copy">
                          Provide scope instead of a report. VAPTFix carries out testing and retesting. Annual commitment only.
                        </p>
                      </label>
                    </div>

                    <div v-if="premiumMode === 'management'" class="pricing-cycle-block">
                      <p class="pricing-cycle-label">Billing cycle</p>
                      <div class="pricing-cycle-options">
                        <label
                          v-for="cycle in billingCycles"
                          :key="cycle.id"
                          class="pricing-cycle-option"
                          :class="{ active: billingCycle === cycle.id }"
                        >
                          <input
                            v-model="billingCycle"
                            type="radio"
                            name="billingCycle"
                            :value="cycle.id"
                            class="visually-hidden"
                          />
                          <span class="pricing-cycle-name">{{ cycle.label }}</span>
                          <span class="pricing-cycle-rate">{{ cycle.rate }}</span>
                          <span class="pricing-cycle-commit">{{ cycle.commitment }}</span>
                        </label>
                      </div>
                      <p class="pricing-mode-example">
                        Example: 80 IPs on Annual → 80 × $1.25 × 12 = <strong>$1,200 / year</strong>.
                        Monthly → 80 × $2.00 = <strong>$160 / month</strong>.
                      </p>
                    </div>

                    <div v-else class="pricing-testing-panel">
                      <div class="pricing-testing-rate-row">
                        <span class="pricing-testing-amount">$20 / IP / year</span>
                        <span class="pricing-testing-badge">Annual only</span>
                      </div>
                      <p class="pricing-mode-copy mb-2">
                        Flat rate covers platform access plus testing and retesting for the year. No Monthly or Semi-Annual option.
                      </p>
                      <p class="pricing-mode-example mb-0">
                        Example: 80 IPs of scope → 80 × $20 = <strong>$1,600 / year</strong>
                        (vs $1,200/year if you uploaded your own report under Management).
                      </p>
                    </div>

                    <p class="pricing-mode-footnote">
                      You cannot mix modes on the same subscription. The 250-asset ceiling applies to both — above 250 assets moves to Custom.
                    </p>
                  </div>

                  <div v-if="activePlan.id === 'custom'" class="pricing-lead-form">
                    <p class="pricing-cycle-label">Tell us about your needs</p>
                    <div class="row g-3">
                      <div class="col-12 col-md-6">
                        <label class="pricing-field-label" for="lead-name">Full name</label>
                        <input
                          id="lead-name"
                          v-model.trim="leadForm.name"
                          type="text"
                          class="form-control pricing-input"
                          placeholder="Your name"
                          autocomplete="name"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <label class="pricing-field-label" for="lead-email">Work email</label>
                        <input
                          id="lead-email"
                          v-model.trim="leadForm.email"
                          type="email"
                          class="form-control pricing-input"
                          placeholder="you@company.com"
                          autocomplete="email"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <label class="pricing-field-label" for="lead-company">Company</label>
                        <input
                          id="lead-company"
                          v-model.trim="leadForm.company"
                          type="text"
                          class="form-control pricing-input"
                          placeholder="Company name"
                          autocomplete="organization"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <label class="pricing-field-label" for="lead-assets">Estimated assets</label>
                        <input
                          id="lead-assets"
                          v-model.trim="leadForm.assets"
                          type="text"
                          class="form-control pricing-input"
                          placeholder="e.g. 300+"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pricing-detail-footer">
                  <button
                    type="button"
                    class="btn text-light rounded-pill pricing-cta pricing-cta--featured pricing-cta--wide"
                    :disabled="activePlan.id === 'custom' && !canContinueCustom"
                    @click="goToPayment"
                  >
                    {{ detailsContinueLabel }}
                    <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                  </button>
                </div>
              </div>
            </div>
          </template>

          <!-- STEP 3: Payment / contact -->
          <template v-else-if="step === 'payment' && activePlan">
            <div class="pricing-flow mt-4 mt-md-5">
              <button type="button" class="pricing-back" @click="goBack">
                <i class="bi bi-arrow-left" aria-hidden="true"></i> Back to plan details
              </button>

              <div class="pricing-progress" aria-hidden="true">
                <span class="pricing-progress-dot done"></span>
                <span class="pricing-progress-line done"></span>
                <span class="pricing-progress-dot done"></span>
                <span class="pricing-progress-line done"></span>
                <span class="pricing-progress-dot active"></span>
              </div>
              <p class="pricing-progress-label">
                Step 3 of 3 — {{ activePlan.id === 'custom' ? 'Contact sales' : 'Payment' }}
              </p>

              <div class="pricing-checkout-grid">
                <div class="pricing-checkout-main">
                  <h2 class="pricing-checkout-title">
                    {{ activePlan.id === 'custom' ? 'Confirm & contact sales' : 'Payment details' }}
                  </h2>

                  <template v-if="activePlan.id === 'custom'">
                    <p class="pricing-mechanics-copy mb-3">
                      We’ll email enterprise sales with your details. No payment is required for a Custom quote.
                    </p>
                    <div class="pricing-contact-confirm">
                      <div class="pricing-contact-row"><span>Name</span><strong>{{ leadForm.name }}</strong></div>
                      <div class="pricing-contact-row"><span>Email</span><strong>{{ leadForm.email }}</strong></div>
                      <div class="pricing-contact-row"><span>Company</span><strong>{{ leadForm.company }}</strong></div>
                      <div class="pricing-contact-row"><span>Assets</span><strong>{{ leadForm.assets }}</strong></div>
                    </div>
                    <button
                      type="button"
                      class="btn text-light rounded-pill w-100 pricing-cta pricing-cta--featured mt-4"
                      @click="submitCustomRequest"
                    >
                      Submit request
                      <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                    </button>
                  </template>

                  <template v-else>
                    <div class="pricing-pay-tabs" role="tablist">
                      <button
                        v-for="method in paymentMethods"
                        :key="method.id"
                        type="button"
                        role="tab"
                        class="pricing-pay-tab"
                        :class="{ active: paymentMethod === method.id }"
                        :aria-selected="paymentMethod === method.id"
                        @click="paymentMethod = method.id"
                      >
                        <i :class="method.icon" aria-hidden="true"></i>
                        <span>{{ method.shortLabel || method.label }}</span>
                      </button>
                    </div>

                    <div class="pricing-pay-panel">
                      <div v-if="paymentMethod === 'card'" class="pricing-card-form">
                        <div class="mb-3">
                          <label class="pricing-field-label" for="card-name">Name on card</label>
                          <input
                            id="card-name"
                            v-model.trim="cardForm.name"
                            type="text"
                            class="form-control pricing-input"
                            placeholder="Full name"
                            autocomplete="cc-name"
                          />
                        </div>
                        <div class="mb-3">
                          <label class="pricing-field-label" for="card-number">Card number</label>
                          <input
                            id="card-number"
                            v-model.trim="cardForm.number"
                            type="text"
                            class="form-control pricing-input"
                            placeholder="XXXX XXXX XXXX XXXX"
                            inputmode="numeric"
                            autocomplete="cc-number"
                          />
                        </div>
                        <div class="row g-3">
                          <div class="col-6">
                            <label class="pricing-field-label" for="card-expiry">Expiry</label>
                            <input
                              id="card-expiry"
                              v-model.trim="cardForm.expiry"
                              type="text"
                              class="form-control pricing-input"
                              placeholder="MM/YY"
                              autocomplete="cc-exp"
                            />
                          </div>
                          <div class="col-6">
                            <label class="pricing-field-label" for="card-cvv">CVV</label>
                            <input
                              id="card-cvv"
                              v-model.trim="cardForm.cvv"
                              type="password"
                              class="form-control pricing-input"
                              placeholder="•••"
                              autocomplete="cc-csc"
                            />
                          </div>
                        </div>
                      </div>

                      <div v-else class="pricing-pay-placeholder">
                        <i class="bi bi-info-circle" aria-hidden="true"></i>
                        <p class="mb-0">
                          {{ paymentMethod === 'upi'
                            ? 'UPI checkout will be connected by backend. Continue to proceed for now.'
                            : 'Net banking checkout will be connected by backend. Continue to proceed for now.' }}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      class="btn text-light rounded-pill w-100 pricing-cta pricing-cta--featured mt-3"
                      @click="completeCheckout"
                    >
                      {{ activePlan.id === 'freemium' ? 'Start free trial' : 'Pay & continue' }}
                      <i class="bi bi-arrow-right-circle-fill" aria-hidden="true"></i>
                    </button>
                    <p class="pricing-pay-disclaimer mt-2 mb-0">
                      No charge is processed on this screen yet — billing backend will handle payments.
                    </p>
                  </template>
                </div>

                <aside class="pricing-checkout-summary">
                  <h3 class="pricing-summary-title">Order summary</h3>
                  <div class="pricing-summary-plan-row">
                    <div>
                      <div class="pricing-summary-plan-name">{{ activePlan.name }}</div>
                      <div class="pricing-summary-plan-sub">{{ summaryRate }}</div>
                    </div>
                    <div class="pricing-summary-amount">{{ summaryTotal }}</div>
                  </div>
                  <div v-if="activePlan.id === 'premium'" class="pricing-summary-meta">
                    Mode: <strong>{{ premiumModeLabel }}</strong>
                  </div>
                  <div v-if="activePlan.id === 'premium' && premiumMode === 'management'" class="pricing-summary-meta">
                    Billing cycle: <strong>{{ selectedCycleLabel }}</strong>
                  </div>
                  <div v-else-if="activePlan.id === 'premium'" class="pricing-summary-meta">
                    Commitment: <strong>Annual only</strong>
                  </div>
                  <div class="pricing-summary-total-bar">
                    <span>Total due today</span>
                    <strong>{{ summaryTotal }}</strong>
                  </div>
                  <p class="pricing-summary-includes">Includes</p>
                  <ul class="list-unstyled mb-0">
                    <li
                      v-for="(feature, idx) in activePlan.features"
                      :key="'sum-' + idx"
                      class="pricing-summary-feature"
                      :class="{ 'is-excluded': !feature.included }"
                    >
                      <i
                        class="bi"
                        :class="feature.included ? 'bi-check2' : 'bi-x-lg'"
                        aria-hidden="true"
                      ></i>
                      <span>{{ feature.text }}</span>
                    </li>
                  </ul>
                </aside>
              </div>
            </div>
          </template>

        </div>
      </div>
    </section>

    <section v-if="step === 'plans'">
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

const PLAN_CONFIG = {
  freemium: {
    id: 'freemium',
    name: 'Freemium',
    priceLabel: '$0',
    priceNote: 'free for 30 days',
    cta: 'Get Started Free',
    featured: false,
    featuresHeading: "What's included:",
    features: [
      { text: 'Upto 5 Internal IPs', included: true },
      { text: 'Report upload – 1 time', included: true },
      { text: 'Max 10 vulnerabilities', included: true },
      { text: '1 team enabled', included: true },
      { text: 'No testing/retesting', included: false },
      { text: 'No automation scripts', included: false },
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    priceLabel: 'From $1.25',
    priceNote: 'per IP/year · Management or Management + Testing',
    cta: 'Upgrade to Premium',
    featured: true,
    featuresHeading: 'Everything in Freemium, plus:',
    features: [
      { text: 'Internal & External IPs, upto 250 assets', included: true },
      { text: 'All vulnerabilities', included: true },
      { text: 'Full automation scripts', included: true },
      { text: 'Email support', included: true },
      { text: 'Management: upload report (from $1.25/IP)', included: true },
      { text: 'Management + Testing: $20/IP/year (annual)', included: true },
    ],
  },
  custom: {
    id: 'custom',
    name: 'Custom',
    priceLabel: 'Contact Sales',
    priceNote: 'for 250+ assets—always a custom quote',
    cta: 'Talk to Sales',
    featured: false,
    featuresHeading: 'Everything in Premium, plus:',
    features: [
      { text: 'Internal, External, Web & Mobile assets', included: true },
      { text: 'AWS file support included', included: true },
      { text: 'Support via multiple channels', included: true },
    ],
  },
};

export default {
  name: 'PricingplansView',
  components: {
    Header,
    Footer,
    AdminSignUpModal,
  },
  data() {
    return {
      step: 'plans',
      selectedPlan: null,
      showAdminSignUpModal: false,
      premiumMode: 'management',
      billingCycle: 'annual',
      paymentMethod: 'card',
      billingCycles: [
        { id: 'monthly', label: 'Monthly', rate: '$2.00 / IP', commitment: 'Billed every month' },
        { id: 'semi', label: 'Semi-Annual', rate: '$1.50 / IP', commitment: 'Billed every 6 months' },
        { id: 'annual', label: 'Annual', rate: '$1.25 / IP', commitment: 'Billed once a year' },
      ],
      paymentMethods: [
        { id: 'card', label: 'Credit / Debit Card', shortLabel: 'Card', icon: 'bi bi-credit-card-2-front' },
        { id: 'upi', label: 'UPI', shortLabel: 'UPI', icon: 'bi bi-phone' },
        { id: 'netbanking', label: 'Net Banking', shortLabel: 'Net Banking', icon: 'bi bi-bank' },
      ],
      leadForm: {
        name: '',
        email: '',
        company: '',
        assets: '',
      },
      cardForm: {
        name: '',
        number: '',
        expiry: '',
        cvv: '',
      },
    };
  },
  computed: {
    planList() {
      return [PLAN_CONFIG.freemium, PLAN_CONFIG.premium, PLAN_CONFIG.custom];
    },
    activePlan() {
      return this.selectedPlan ? PLAN_CONFIG[this.selectedPlan] : null;
    },
    detailsContinueLabel() {
      if (this.selectedPlan === 'premium') return 'Continue to payment';
      if (this.selectedPlan === 'custom') return 'Continue to contact';
      return 'Continue';
    },
    canContinueCustom() {
      return !!(
        this.leadForm.name &&
        this.leadForm.email &&
        this.leadForm.company &&
        this.leadForm.assets
      );
    },
    selectedCycle() {
      return this.billingCycles.find((c) => c.id === this.billingCycle) || this.billingCycles[2];
    },
    selectedCycleLabel() {
      return this.selectedCycle?.label || 'Annual';
    },
    premiumModeLabel() {
      return this.premiumMode === 'testing' ? 'Management + Testing' : 'Management';
    },
    detailPriceLabel() {
      if (this.selectedPlan !== 'premium') return this.activePlan?.priceLabel || '';
      if (this.premiumMode === 'testing') return '$20';
      return this.selectedCycle?.rate?.replace(' / IP', '') || 'From $1.25';
    },
    detailPriceNote() {
      if (this.selectedPlan !== 'premium') return this.activePlan?.priceNote || '';
      if (this.premiumMode === 'testing') {
        return 'per IP/year · Management + Testing (annual only)';
      }
      return `per IP · Management · ${this.selectedCycleLabel} billing`;
    },
    summaryRate() {
      if (this.selectedPlan === 'freemium') return '$0 · free for 30 days';
      if (this.selectedPlan === 'premium') {
        if (this.premiumMode === 'testing') return '$20 / IP / year · testing included';
        return `${this.selectedCycle.rate} · Management`;
      }
      return 'Custom quote';
    },
    summaryTotal() {
      if (this.selectedPlan === 'freemium') return '$0';
      if (this.selectedPlan === 'premium') {
        if (this.premiumMode === 'testing') return '$20 / IP / year';
        if (this.billingCycle === 'monthly') return '$2.00 / IP / month';
        if (this.billingCycle === 'semi') return '$1.50 / IP / 6 months';
        return '$1.25 / IP / year';
      }
      return 'Contact sales';
    },
  },
  watch: {
    premiumMode(mode) {
      if (mode === 'testing') {
        this.billingCycle = 'annual';
      }
    },
  },
  methods: {
    selectPlan(planId) {
      this.selectedPlan = planId;
      this.step = 'details';
      this.paymentMethod = 'card';
      if (planId === 'premium') {
        this.premiumMode = 'management';
        this.billingCycle = 'annual';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    goToPayment() {
      if (this.selectedPlan === 'custom' && !this.canContinueCustom) return;
      this.step = 'payment';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    goBack() {
      if (this.step === 'payment') {
        this.step = 'details';
      } else if (this.step === 'details') {
        this.step = 'plans';
        this.selectedPlan = null;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    completeCheckout() {
      this.openAdminSignUpModal();
    },
    submitCustomRequest() {
      const subject = encodeURIComponent('VAPTFix Custom Plan Inquiry');
      const body = encodeURIComponent(
        [
          'Custom plan inquiry',
          '',
          `Name: ${this.leadForm.name}`,
          `Email: ${this.leadForm.email}`,
          `Company: ${this.leadForm.company}`,
          `Estimated assets: ${this.leadForm.assets}`,
        ].join('\n'),
      );
      window.location.href = `mailto:enterprise@vaptfix.ai?subject=${subject}&body=${body}`;
    },
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

.pricing-card {
  border-radius: 12px;
  border: 1px solid rgba(36, 20, 71, 0.08);
  overflow: hidden;
  position: relative;
  min-height: 560px;
}

.pricing-card .card-body {
  padding: 1.75rem 1.5rem 2rem;
}

.pricing-card--featured {
  border: 2px solid #241447;
}

.pricing-popular-badge {
  background: #241447;
  color: #fff;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 0.45rem 0.75rem;
}

.pricing-tier-title {
  color: #241447;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  margin-top: 0.25rem;
}

.pricing-price {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.1;
  margin: 0;
}

.pricing-price--contact {
  font-size: clamp(1.5rem, 4.5vw, 2.25rem);
}

.pricing-price-note {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 500;
  font-style: italic;
  color: rgba(0, 0, 0, 0.62);
  line-height: 1.4;
}

.pricing-cta {
  background-color: #121212;
  font-size: 1rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.pricing-cta--featured {
  background-color: #241447;
}

.pricing-cta:disabled {
  opacity: 0.55;
  cursor: not-allowed;
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

.pricing-x {
  color: #c62828;
  margin-top: 0.2rem;
  font-size: 0.85rem;
}

.pricing-back {
  border: none;
  background: transparent;
  color: #241447;
  font-weight: 600;
  font-size: 0.95rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  cursor: pointer;
  margin-bottom: 1.25rem;
}

.pricing-back:hover {
  color: #0f696e;
}

.pricing-flow {
  max-width: 1100px;
  margin: 0 auto;
  padding-bottom: 2.5rem;
}

.pricing-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 0.5rem;
}

.pricing-progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(36, 20, 71, 0.18);
}

.pricing-progress-dot.done,
.pricing-progress-dot.active {
  background: #241447;
}

.pricing-progress-line {
  width: 48px;
  height: 2px;
  background: rgba(36, 20, 71, 0.15);
}

.pricing-progress-line.done {
  background: #241447;
}

.pricing-progress-label {
  text-align: center;
  font-size: 0.82rem;
  font-weight: 600;
  color: rgba(36, 20, 71, 0.65);
  margin-bottom: 1.5rem;
}

.pricing-detail-shell {
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(36, 20, 71, 0.06);
  overflow: hidden;
  min-height: 560px;
}

.pricing-detail-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem 2rem 1.75rem;
  background: linear-gradient(135deg, #241447 0%, #3a2568 100%);
  color: #fff;
}

.pricing-detail-eyebrow {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 0.35rem;
}

.pricing-detail-name {
  margin: 0;
  font-size: clamp(1.5rem, 3vw, 1.85rem);
  font-weight: 800;
  line-height: 1.15;
}

.pricing-detail-note {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  opacity: 0.78;
  font-style: italic;
}

.pricing-detail-price-box {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 1rem 1.35rem;
  text-align: center;
  min-width: 140px;
}

.pricing-detail-price {
  font-size: clamp(1.6rem, 3.5vw, 2.1rem);
  font-weight: 800;
  line-height: 1.1;
  white-space: nowrap;
}

.pricing-detail-body {
  padding: 1.75rem 2rem 0.75rem;
}

.pricing-features-panel {
  background: #f7f6fb;
  border-radius: 12px;
  padding: 1.25rem 1.35rem;
}

.pricing-features-heading {
  margin: 0 0 0.85rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #241447;
}

.pricing-features-grid {
  display: grid;
  gap: 0.55rem;
}

@media (min-width: 768px) {
  .pricing-features-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.pricing-feature-chip {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.95rem;
  color: #49454f;
  background: #fff;
  border-radius: 8px;
  padding: 0.85rem 0.9rem;
  border: 1px solid rgba(36, 20, 71, 0.06);
  min-height: 52px;
}

.pricing-feature-chip i {
  color: #0f696e;
  margin-top: 0.1rem;
  flex-shrink: 0;
}

.pricing-feature-chip.is-excluded i {
  color: #c62828;
}

.pricing-cycle-block,
.pricing-lead-form,
.pricing-mode-block {
  margin-top: 1.25rem;
}

.pricing-mode-hint {
  font-size: 0.88rem;
  color: #49454f;
  line-height: 1.5;
  margin: -0.15rem 0 0.85rem;
}

.pricing-mode-options {
  display: grid;
  gap: 0.85rem;
}

@media (min-width: 768px) {
  .pricing-mode-options {
    grid-template-columns: 1fr 1fr;
  }
}

.pricing-mode-option {
  display: block;
  border: 1px solid rgba(36, 20, 71, 0.12);
  border-radius: 12px;
  padding: 1rem 1.05rem;
  cursor: pointer;
  background: #fff;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
  height: 100%;
}

.pricing-mode-option.active {
  border-color: #241447;
  background: rgba(36, 20, 71, 0.03);
  box-shadow: inset 0 0 0 1px #241447;
}

.pricing-mode-option-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.55rem;
}

.pricing-mode-tag {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.1);
  border-radius: 999px;
  padding: 0.25rem 0.55rem;
}

.pricing-mode-price {
  font-size: 0.85rem;
  font-weight: 800;
  color: #241447;
  white-space: nowrap;
}

.pricing-mode-title {
  display: block;
  color: #241447;
  font-size: 0.98rem;
  margin-bottom: 0.4rem;
}

.pricing-mode-copy {
  margin: 0;
  font-size: 0.86rem;
  color: #49454f;
  line-height: 1.5;
}

.pricing-mode-example {
  margin: 0.9rem 0 0;
  font-size: 0.85rem;
  color: #49454f;
  line-height: 1.5;
  padding: 0.75rem 0.9rem;
  background: #f7f6fb;
  border-radius: 8px;
}

.pricing-mode-footnote {
  margin: 1rem 0 0;
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.55);
  line-height: 1.45;
}

.pricing-testing-panel {
  margin-top: 1rem;
  border: 1px solid rgba(36, 20, 71, 0.1);
  border-radius: 12px;
  padding: 1rem 1.1rem;
  background: #faf9fc;
}

.pricing-testing-rate-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.65rem;
}

.pricing-testing-amount {
  font-size: 1.35rem;
  font-weight: 800;
  color: #241447;
}

.pricing-testing-badge {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #241447;
  background: rgba(36, 20, 71, 0.08);
  border-radius: 999px;
  padding: 0.3rem 0.6rem;
}

.pricing-cycle-commit {
  font-size: 0.75rem;
  color: rgba(0, 0, 0, 0.55);
  margin-top: 0.15rem;
}

.pricing-cycle-label,
.pricing-field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #241447;
  margin-bottom: 0.5rem;
}

.pricing-cycle-options {
  display: grid;
  gap: 0.65rem;
}

@media (min-width: 768px) {
  .pricing-cycle-options {
    grid-template-columns: repeat(3, 1fr);
  }
}

.pricing-cycle-option {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  border: 1px solid rgba(36, 20, 71, 0.12);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  background: #fff;
}

.pricing-cycle-option.active {
  border-color: #241447;
  background: rgba(36, 20, 71, 0.04);
  box-shadow: inset 0 0 0 1px #241447;
}

.pricing-cycle-name {
  font-weight: 700;
  color: #241447;
  font-size: 0.92rem;
}

.pricing-cycle-rate {
  font-weight: 600;
  color: #0f696e;
  font-size: 0.88rem;
}

.pricing-input {
  border-radius: 8px;
  border-color: rgba(36, 20, 71, 0.15);
  min-height: 44px;
}

.pricing-input:focus {
  border-color: #241447;
  box-shadow: 0 0 0 0.2rem rgba(36, 20, 71, 0.12);
}

.pricing-detail-footer {
  padding: 1.25rem 2rem 1.75rem;
  display: flex;
  justify-content: flex-end;
}

.pricing-cta--wide {
  min-width: min(100%, 320px);
  min-height: 48px;
  padding-left: 1.75rem;
  padding-right: 1.75rem;
}

.pricing-checkout-grid {
  display: grid;
  gap: 1.5rem;
  align-items: stretch;
}

@media (min-width: 992px) {
  .pricing-checkout-grid {
    grid-template-columns: 1.35fr 0.9fr;
    min-height: 620px;
  }
}

.pricing-checkout-main,
.pricing-checkout-summary {
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(36, 20, 71, 0.06);
  padding: 1.75rem 1.75rem 1.85rem;
  min-height: 580px;
  display: flex;
  flex-direction: column;
}

.pricing-checkout-title {
  color: #241447;
  font-weight: 800;
  font-size: 1.5rem;
  margin: 0 0 1.35rem;
}

.pricing-pay-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.pricing-pay-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid rgba(36, 20, 71, 0.12);
  border-radius: 10px;
  background: #fff;
  padding: 1rem 0.5rem;
  min-height: 78px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #241447;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}

.pricing-pay-tab i {
  font-size: 1.35rem;
  color: #0f696e;
}

.pricing-pay-tab.active {
  border-color: #241447;
  background: rgba(36, 20, 71, 0.05);
  box-shadow: inset 0 0 0 1px #241447;
}

.pricing-pay-panel {
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 12px;
  background: #faf9fc;
  padding: 1.35rem 1.25rem;
  min-height: 260px;
  flex: 1;
}

.pricing-pay-placeholder {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  color: #49454f;
  font-size: 0.95rem;
  line-height: 1.55;
  padding: 1rem 0.25rem;
}

.pricing-pay-placeholder i {
  color: #0f696e;
  margin-top: 0.15rem;
}

.pricing-pay-disclaimer {
  font-size: 0.82rem;
  color: rgba(0, 0, 0, 0.48);
  line-height: 1.45;
  text-align: center;
  margin-top: auto;
  padding-top: 0.75rem;
}

.pricing-checkout-summary {
  background: #241447;
  color: #fff;
  border: none;
}

.pricing-summary-title {
  color: #fff;
  font-weight: 800;
  font-size: 1.15rem;
  margin: 0 0 1.25rem;
  opacity: 0.92;
}

.pricing-summary-plan-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.pricing-summary-plan-name {
  font-weight: 800;
  font-size: 1.35rem;
}

.pricing-summary-plan-sub {
  font-size: 0.9rem;
  opacity: 0.72;
  margin-top: 0.3rem;
}

.pricing-summary-amount {
  font-weight: 800;
  font-size: 1.35rem;
  white-space: nowrap;
}

.pricing-summary-meta {
  font-size: 0.9rem;
  opacity: 0.75;
  margin-bottom: 1rem;
}

.pricing-summary-total-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.05rem 1.15rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.pricing-summary-total-bar strong {
  font-size: 1.35rem;
  font-weight: 800;
}

.pricing-summary-includes {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  opacity: 0.55;
  margin-bottom: 0.85rem;
}

.pricing-summary-feature {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  font-size: 0.92rem;
  opacity: 0.9;
  margin-bottom: 0.65rem;
  line-height: 1.4;
}

.pricing-summary-feature i {
  color: #7ed6c2;
  margin-top: 0.15rem;
  flex-shrink: 0;
}

.pricing-summary-feature.is-excluded {
  opacity: 0.55;
}

.pricing-summary-feature.is-excluded i {
  color: #f4a4a4;
}

.pricing-contact-confirm {
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 12px;
  background: #faf9fc;
  overflow: hidden;
}

.pricing-contact-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.8rem 1rem;
  font-size: 0.92rem;
  color: #49454f;
  border-bottom: 1px solid rgba(36, 20, 71, 0.06);
}

.pricing-contact-row:last-child {
  border-bottom: none;
}

.pricing-contact-row strong {
  color: #241447;
  text-align: right;
}

.pricing-mechanics-copy {
  font-size: 0.92rem;
  color: #49454f;
  line-height: 1.6;
}

@media (max-width: 575.98px) {
  .pricing-detail-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .pricing-detail-price-box {
    width: 100%;
  }

  .pricing-detail-footer {
    justify-content: stretch;
  }

  .pricing-cta--wide {
    width: 100%;
  }

  .pricing-pay-tab span {
    font-size: 0.72rem;
  }
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
</style>
