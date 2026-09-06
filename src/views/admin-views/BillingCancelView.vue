<template>
  <main class="pricing-page">
    <Header />
    <section class="vulnerability-explorer">
      <div class="container py-5">
        <div class="billing-result-card text-center">
          <i class="bi bi-x-circle billing-result-icon" aria-hidden="true"></i>
          <h2 class="billing-result-title">Checkout canceled</h2>
          <p class="billing-result-copy">
            No charge was made. You can return to pricing and try Premium checkout again when you are ready.
          </p>
          <div class="d-flex flex-wrap justify-content-center gap-2">
            <router-link to="/pricingplan" class="btn text-light rounded-pill pricing-cta">
              Back to pricing
            </router-link>
            <router-link to="/admindashboardonboarding" class="btn rounded-pill btn-outline-dark">
              Go to dashboard
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

export default {
  name: 'BillingCancelView',
  components: { Header, Footer },
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
.billing-result-icon { font-size: 2.5rem; display: block; margin-bottom: 0.75rem; color: #241447; }
.pricing-cta {
  background-color: #241447;
  font-weight: 500;
  padding: 0.65rem 1.4rem;
}
</style>
