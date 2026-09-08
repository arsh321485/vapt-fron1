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
            <router-link :to="continuePath" class="btn text-light rounded-pill pricing-cta">
              {{ continueLabel }}
            </router-link>
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
import Swal from 'sweetalert2';
import { formatUsd, getMySubscription, confirmCheckoutSession } from '@/services/billingApi';
import { captureChatHandoffSource, maybeShowReturnToChatPlatformPopup } from '@/utils/adminHandoff';
import { consumeBillingReturnTo, peekBillingReturnTo, UPLOAD_RETURN_PATH } from '@/utils/planLimits';
import { setCachedPaidPlan } from '@/utils/authenticatedHome';
import { useAuthStore } from '@/stores/authStore';
import { isScopeFileAwaitingSuperadmin, markScopeFileAwaitingSuperadmin, readStoredAdminEmail } from '@/utils/scopeScanGate';

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
      if (this.continuePath.startsWith('/waiting-for-report')) {
        return 'Continue';
      }
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
    captureChatHandoffSource(this.$route?.query || {});
    const sessionId = String(this.$route?.query?.session_id || '').trim();
    if (sessionId) {
      // Actively verify with Stripe via the backend instead of waiting on the
      // checkout.session.completed webhook — the webhook is best-effort and,
      // in test mode especially, can lag or never arrive, which is what left
      // Premium admins stuck seeing the Freemium-trimmed (5) asset count even
      // though Stripe had already redirected here with a real session_id.
      this.confirmViaSession(sessionId);
      return;
    }
    // No session_id in the URL (shouldn't happen on Stripe's real success
    // redirect) — fall back to the old webhook-driven polling path.
    this.startLegacyPolling();
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
    startLegacyPolling() {
      this.pollOnce();
      this.pollTimer = setInterval(() => {
        if (!this.isActive && this.pollCount < MAX_POLLS) {
          this.pollOnce();
        } else {
          this.stopPolling();
        }
      }, POLL_MS);
    },
    /**
     * Verifies the Stripe Checkout session directly (GET
     * /api/admin/billing/checkout/confirm/?session_id=...) instead of relying
     * on the webhook + a plain dashboard re-fetch. On success this response
     * already carries the correct visible_asset_count/original_asset_count
     * for the plan just paid for, so once status is "active" we don't need to
     * wait for a separate call to catch up.
     */
    async confirmViaSession(sessionId, attempt = 0) {
      try {
        const data = await confirmCheckoutSession(sessionId);
        const sub = data?.subscription || null;
        this.subscription = sub
          ? {
              ...sub,
              visible_asset_count: sub.visible_asset_count ?? data.visible_asset_count,
              locked_asset_count: sub.locked_asset_count ?? data.locked_asset_count,
              original_asset_count: sub.original_asset_count ?? data.original_asset_count,
              billable_asset_count: sub.billable_asset_count ?? data.billable_asset_count,
            }
          : null;

        if (this.isActive) {
          this.polling = false;
          await this.handleActiveSubscription();
          return;
        }

        // Payment succeeded on Stripe's side (that's why we're on this page
        // at all) but the subscription hasn't posted as "active" yet — retry
        // once, per the backend's guidance, then fall back to the old
        // webhook-polling path rather than getting stuck.
        if (attempt < 1) {
          this.statusMessage = 'Confirming your payment...';
          window.setTimeout(() => this.confirmViaSession(sessionId, attempt + 1), 3000);
          return;
        }
        this.polling = false;
        this.statusMessage =
          'Payment succeeded — your subscription is finishing activation in the background.';
        this.resolvePendingContinuePath();
      } catch (error) {
        const status = error?.response?.status;
        if (status === 502 && attempt < 1) {
          // Couldn't reach Stripe right now — safe to retry once.
          window.setTimeout(() => this.confirmViaSession(sessionId, attempt + 1), 3000);
          return;
        }
        if (status === 404) {
          // No subscription found for this session — shouldn't happen in the
          // normal flow; surface it rather than silently masking it.
          this.polling = false;
          this.statusMessage = 'We could not confirm this payment. Please contact support.';
          return;
        }
        // 400 (missing session_id — shouldn't happen, we checked) or any
        // other failure: fall back to the old webhook-driven polling path
        // instead of stranding the admin here.
        this.startLegacyPolling();
      }
    },
    /** Shared success handling for both the new confirm-session path and the legacy poll path. */
    async handleActiveSubscription() {
      this.stopPolling();
      setCachedPaidPlan(true);
      const authStore = useAuthStore();
      authStore.invalidateAfterPaidUpgrade();
      void authStore.fetchDashboardSummary();
      void authStore.fetchAssets(true);
      void authStore.getReportStatus();
      const stored = consumeBillingReturnTo('');
      const awaitingScopeFile =
        isScopeFileAwaitingSuperadmin(readStoredAdminEmail()) ||
        String(stored || '').startsWith('/waiting-for-report');
      if (awaitingScopeFile) {
        markScopeFileAwaitingSuperadmin(readStoredAdminEmail());
        this.continuePath = '/waiting-for-report';
        await Swal.fire({
          icon: 'info',
          title: 'Payment received',
          text: 'Our Super admin will analyse your file.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#241447',
        });
        await maybeShowReturnToChatPlatformPopup();
        this.$router.replace('/waiting-for-report');
        return;
      }

      // Premium (report already uploaded): add users → risk criteria → dashboard.
      // Always Add Users first — see resolvePendingContinuePath() above for why.
      authStore.unmarkStepCompleted(1);
      this.continuePath = '/communication';
      await maybeShowReturnToChatPlatformPopup();
      window.setTimeout(() => {
        this.$router.replace(this.continuePath);
      }, 400);
    },
    /** Same destination the success branch resolves to, for the "still confirming" fallback button. */
    resolvePendingContinuePath() {
      const authStore = useAuthStore();
      // Landing here at all means Stripe already redirected back from a
      // completed checkout (this URL only exists as Stripe's success_url,
      // carrying a real session_id) — our backend's own subscription record
      // just hasn't caught up to that yet. Mark it paid locally so the
      // requiresPaidPlan route guard's hasPaidPlan() check (which now
      // correctly refuses to infer payment from report/onboarding state)
      // doesn't strand a genuinely-paid admin on a webhook-timing race.
      setCachedPaidPlan(true);
      // Clear cached (still-Freemium-trimmed) data, but do NOT eagerly
      // re-fetch assets here — the backend genuinely hasn't processed the
      // Stripe webhook yet at this point (that's why we're in this fallback
      // at all), so an eager fetchAssets(true) would just re-cache the same
      // trimmed snapshot, and fetchAssets(false) elsewhere (e.g. the
      // dashboard) would then reuse that stale cache forever instead of
      // re-fetching once the backend has actually caught up. Leaving the
      // cache empty lets whichever page loads next fetch it fresh for real.
      authStore.invalidateAfterPaidUpgrade();
      void authStore.getReportStatus();
      const stored = consumeBillingReturnTo('');
      const awaitingScopeFile =
        isScopeFileAwaitingSuperadmin(readStoredAdminEmail()) ||
        String(stored || '').startsWith('/waiting-for-report');
      if (awaitingScopeFile) {
        markScopeFileAwaitingSuperadmin(readStoredAdminEmail());
        this.continuePath = '/waiting-for-report';
      } else {
        // Always Add Users first — /riskcriteria itself already redirects back
        // here (needsCommunicationStep()) if Add Users genuinely isn't done
        // yet, so guessing "Slack/Teams already added users" here only
        // produced a confusing flash-then-bounce. Add Users' own Continue
        // button is what correctly advances past this once it's done.
        authStore.unmarkStepCompleted(1);
        this.continuePath = '/communication';
      }
    },
    async pollOnce() {
      this.pollCount += 1;
      try {
        const data = await getMySubscription();
        this.subscription = data?.subscription || null;
        if (this.isActive) {
          this.polling = false;
          await this.handleActiveSubscription();
          return;
        }
        if (this.pollCount >= MAX_POLLS) {
          this.polling = false;
          this.statusMessage =
            'Payment succeeded — your subscription is finishing activation in the background.';
          this.stopPolling();
          // Stripe already confirmed the checkout session; don't strand the
          // admin here waiting on webhook timing. Send them on the same path
          // the success branch above would have used.
          this.resolvePendingContinuePath();
        }
      } catch (error) {
        this.polling = false;
        this.statusMessage = 'We could not confirm your subscription yet, but your payment went through.';
        if (this.pollCount >= MAX_POLLS) this.stopPolling();
        this.resolvePendingContinuePath();
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
