<template>
  <div
    v-if="locked > 0"
    class="mgmt-lock-banner d-flex flex-wrap align-items-start justify-content-between gap-3 mb-3"
  >
    <p class="mb-0">
      {{ locked }} assets are locked. Pay for the additional block(s) needed to unlock them — see your updated price above.
    </p>
    <button type="button" class="mgmt-lock-btn flex-shrink-0" @click="goPay">Pay to unlock</button>
  </div>
</template>

<script>
import { getMySubscription } from '@/services/billingApi';

export default {
  name: 'ManagementLockedAssetsBanner',
  data() {
    return { locked: 0 };
  },
  async mounted() {
    try {
      const data = await getMySubscription();
      const sub = data?.subscription || {};
      const plan = String(sub.plan || '').toLowerCase();
      const mode = String(sub.mode || '').toLowerCase();
      const locked = Number(sub.locked_asset_count) || 0;
      if (plan === 'premium' && mode === 'management' && locked > 0) this.locked = locked;
    } catch {
      this.locked = 0;
    }
  },
  methods: {
    goPay() {
      this.$router.push({
        path: '/pricingplan',
        query: { plan: 'premium', mode: 'management' },
      });
    },
  },
};
</script>

<style scoped>
.mgmt-lock-banner {
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 12px;
  padding: 14px 16px;
  color: #9a3412;
}
.mgmt-lock-btn {
  background: #241447;
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
}
</style>
