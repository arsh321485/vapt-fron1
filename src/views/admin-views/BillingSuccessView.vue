<template>
  <main class="pricing-page">
    <Header />
    <section class="vulnerability-explorer">
      <div class="container py-5">
        <div class="billing-result-card">
          <div v-if="polling" class="text-center">
            <div class="spinner-border billing-spinner mb-3" role="status"></div>
            <h2 class="billing-result-title">Confirming your payment</h2>
            <p class="billing-result-copy mb-0">
              Stripe is activating your subscription. This usually takes a few seconds.
            </p>
          </div>

          <div v-else-if="subscription && isActive" class="text-center">
            <i class="bi bi-check-circle-fill billing-result-icon success" aria-hidden="true"></i>
            <h2 class="billing-result-title">Subscription active</h2>
            <p class="billing-result-copy">
              {{ planLabel }} is now {{ subscription.status }}.
              <span v-if="subscription.amount_due"> Amount: {{ formattedAmount }}.</span>
            </p>
            <router-link :to="continuePath" class="btn text-light rounded-pill pricing-cta">
              {{ continueLabel }}
            </router-link>
          </div>

          <div v-else class="text-center">
            <i class="bi bi-hourglass-split billing-result-icon pending" aria-hidden="true"></i>
            <h2 class="billing-result-title">Payment received</h2>
            <p class="billing-result-copy">
              {{ statusMessage }}
            </p>
            <div class="d-flex flex-wrap justify-content-center gap-2">
              <button type="button" class="btn text-light rounded-pill pricing-cta" :disabled="polling" @click="pollOnce">
                Refresh status
              </button>
              <router-link to="/pricingplan" class="btn rounded-pill btn-outline-dark">
                Back to pricing
              </router-link>
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
import { formatUsd, getMySubscription } from '@/services/billingApi';
import { consumeBillingReturnTo, peekBillingReturnTo, UPLOAD_RETURN_PATH } from '@/utils/planLimits';
import { setCachedPaidPlan } from '@/utils/authenticatedHome';
import { useAuthStore } from '@/stores/authStore';

const MAX_POLLS = 20;
const POLL_MS = 2500;

export default {
  name: 'BillingSuccessView',
  components: { Header, Footer },
  data() {
    return {
      polling: true,
      pollCount: 0,
      subscription: null,
      statusMessage: 'Waiting for Stripe to confirm the subscription.',
      pollTimer: null,
      continuePath: peekBillingReturnTo() || '/admindashboardonboarding',
    };
  },
  computed: {
    isActive() {
      const status = this.subscription?.status;
      return status === 'active' || status === 'trialing';
    },
    planLabel() {
      const plan = this.subscription?.plan || 'Premium';
      return String(plan).charAt(0).toUpperCase() + String(plan).slice(1);
    },
    formattedAmount() {
      return formatUsd(this.subscription?.amount_due, this.subscription?.currency || 'usd');
    },
    continueLabel() {
      if (this.continuePath.startsWith(UPLOAD_RETURN_PATH) || this.continuePath.startsWith('/admin-upload-report')) {
        return 'Continue';
      }
      if (this.continuePath.startsWith('/communication')) {
        return 'Continue to add users';
      }
      if (this.continuePath.startsWith('/riskcriteria')) {
        return 'Continue to risk criteria';
      }
      return 'Go to dashboard';
    },
  },
  mounted() {
    this.pollOnce();
    this.pollTimer = setInterval(() => {
      if (!this.isActive && this.pollCount < MAX_POLLS) {
        this.pollOnce();
      } else {
        this.stopPolling();
      }
    }, POLL_MS);
  },
  beforeUnmount() {
    this.stopPolling();
  },
  methods: {
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    async pollOnce() {
      this.pollCount += 1;
      try {
        const data = await getMySubscription();
        this.subscription = data?.subscription || null;
        if (this.isActive) {
          this.polling = false;
          this.stopPolling();
          setCachedPaidPlan(true);
          const authStore = useAuthStore();
          authStore.invalidateAfterPaidUpgrade();
          void authStore.fetchDashboardSummary();
          void authStore.fetchAssets(true);
          void authStore.getReportStatus();
          const stored = consumeBillingReturnTo('');
          const backToUpload =
            stored.startsWith(UPLOAD_RETURN_PATH) || stored.startsWith('/admin-upload-report');
          if (backToUpload || stored.startsWith('/communication')) {
            this.continuePath = stored;
          } else {
            try {
              const authStore = useAuthStore();
              const route = await authStore.getAdminOnboardingRoute();
              if (route === '/admin-upload-report') {
                this.continuePath = authStore.isSlackOrTeamsLogin()
                  ? '/riskcriteria'
                  : '/communication';
              } else {
                this.continuePath = route;
              }
            } catch {
              this.continuePath = stored || '/communication';
            }
          }
          window.setTimeout(() => {
            this.$router.replace(this.continuePath);
          }, 1200);
          return;
        }
        if (this.pollCount >= MAX_POLLS) {
          this.polling = false;
          this.statusMessage =
            'Payment succeeded, but the subscription is still confirming. Refresh in a moment or open Manage Account.';
          this.stopPolling();
        }
      } catch (error) {
        this.polling = false;
        this.statusMessage = 'We could not load your subscription yet. Sign in and refresh this page.';
        if (this.pollCount >= MAX_POLLS) this.stopPolling();
      }
    },
  },
};
</script>

<style scoped>
.pricing-page { overflow-x: hidden; }
.billing-result-card {
  max-width: 560px;
  margin: 4rem auto;
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 30px rgba(36, 20, 71, 0.06);
}
.billing-result-title {
  color: #241447;
  font-weight: 800;
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
}
.billing-result-copy {
  color: rgba(0, 0, 0, 0.62);
  margin-bottom: 1.5rem;
}
.billing-result-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; }
.billing-result-icon.success { color: #0f696e; }
.billing-result-icon.pending { color: #241447; }
.billing-spinner { color: #241447; }
.pricing-cta {
  background-color: #241447;
  font-weight: 500;
  padding: 0.65rem 1.4rem;
}
</style>
