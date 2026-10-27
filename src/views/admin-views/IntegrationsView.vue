<template>
  <div class="mkt-root">
    <Header />

    <section class="mkt-hero">
      <div class="mkt-container">
        <p class="mkt-kicker">Integrations</p>
        <h1>Where findings enter, and where the fix is approved</h1>
        <p>Slack and Microsoft Teams are available today. Both Marketplace listings are in review. Scanner files listed below are the formats accepted now.</p>
      </div>
    </section>

    <section class="mkt-section">
      <div class="mkt-container">
        <article class="mkt-card">
          <div class="mkt-card-top">
            <h2>Slack</h2>
            <span class="mkt-badge">Marketplace: in review</span>
          </div>
          <p>Sign up with Slack and run remediation from cards in the workspace: assign a finding, approve a step, and close it with the audit record attached. The Slack app is available for that workflow.</p>
          <p>The Slack Marketplace listing is in review.</p>
        </article>

        <article class="mkt-card">
          <div class="mkt-card-top">
            <h2>Microsoft Teams</h2>
            <span class="mkt-badge">Marketplace: in review</span>
          </div>
          <p>Sign up with Microsoft Teams and use the same remediation cards inside Teams: the plan, the approval, and the closure stay on the finding.</p>
          <p>The Microsoft Teams Marketplace listing is in review.</p>
        </article>

        <article class="mkt-card">
          <div class="mkt-card-top">
            <h2>Scanner and assessment formats accepted today</h2>
          </div>
          <ul>
            <li>Nessus files</li>
            <li>AWS Security Hub exports</li>
            <li>Custom assessment files</li>
          </ul>
          <p>Configuration and CIS benchmark results are taken in when they are already inside one of those uploaded reports. There is no separate live connector for other scanners.</p>
        </article>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';

export default {
  name: 'IntegrationsView',
  components: { Header, Footer },
};
</script>

<style scoped>
.mkt-root { background: #fff; color: #0f172a; }
.mkt-container { width: min(920px, calc(100% - 40px)); margin: 0 auto; }
.mkt-hero {
  background: #241447;
  color: #fff;
  padding: 120px 0 64px;
}
.mkt-kicker {
  margin: 0 0 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #5eead4;
}
.mkt-hero h1 {
  margin: 0 0 16px;
  font-size: clamp(32px, 4vw, 48px);
  line-height: 1.15;
  font-weight: 800;
}
.mkt-hero p { margin: 0; max-width: 680px; font-size: 17px; line-height: 1.7; color: rgba(255,255,255,0.78); }
.mkt-section { padding: 56px 0 72px; }
.mkt-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 22px 24px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.mkt-card-top { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 10px; }
.mkt-card h2 { margin: 0 0 10px; font-size: 20px; font-weight: 800; color: #241447; }
.mkt-card p, .mkt-card li { font-size: 15px; line-height: 1.7; color: #475569; }
.mkt-card ul { margin: 8px 0 0; padding-left: 18px; }
.mkt-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 4px 10px;
  background: #fff7ed;
  color: #9a3412;
  font-size: 12px;
  font-weight: 800;
}
.mkt-badge.is-live { background: #ecfdf5; color: #047857; }
</style>
