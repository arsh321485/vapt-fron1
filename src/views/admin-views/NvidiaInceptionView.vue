<template>
  <div class="nv-root">
    <Header ref="pageHeader" />

    <section class="nv-hero">
      <div class="nv-container nv-hero-inner">
        <h1><span class="nv-hero-line"><span class="nv-hero-accent">NVIDIA</span> Inception Program</span><span class="nv-hero-accent">Member</span></h1>
        <p class="nv-hero-sub">
          VAPTFIX is a member of the NVIDIA Inception program, which helps startups move faster with
          technology, expert guidance, and a network around AI. For VAPTFIX, that work is finding
          vulnerabilities, assigning them to the right team, and getting them fixed.
        </p>
      </div>
    </section>

    <section class="nv-section">
      <div class="nv-container nv-split">
        <div>
          <p class="nv-label">About the programme</p>
          <h2>What is NVIDIA Inception?</h2>
          <p class="nv-lead">
            NVIDIA Inception is a program for startups working in AI and data. Members can get access
            to technology, training, co-marketing, and introductions to investors and industry teams.
            Preferred pricing on NVIDIA hardware and software, and support taking a product from early
            build to production, are part of why members join.
          </p>
        </div>
        <div>
          <p class="nv-label">Programme benefits</p>
          <ul class="nv-benefits">
            <li>Access to NVIDIA DGX Cloud credits</li>
            <li>Technical guidance from NVIDIA engineers</li>
            <li>Co-marketing and brand exposure</li>
            <li>Venture capital introductions</li>
            <li>Preferred pricing on GPU hardware</li>
            <li>Access to the NVIDIA AI Enterprise suite</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="nv-section nv-section-alt">
      <div class="nv-container">
        <p class="nv-label">AI in vulnerability operations</p>
        <h2>How VAPTFIX uses AI</h2>
        <p class="nv-lead">
          A vulnerability program is full of repeated classification, assignment, and follow-up.
          VAPTFIX uses that work to keep findings moving from the report into a fix.
        </p>
        <div class="nv-cards">
          <article class="nv-card">
            <span class="nv-card-icon" aria-hidden="true"><i class="bi bi-funnel"></i></span>
            <h3>Finding classification</h3>
            <p>Findings are grouped by severity and by the team that should own the fix: Network Security, Patch Management, Configuration Management, or Architectural Flaws.</p>
          </article>
          <article class="nv-card">
            <span class="nv-card-icon" aria-hidden="true"><i class="bi bi-wrench-adjustable"></i></span>
            <h3>Remediation guidance</h3>
            <p>Each open item can carry automation-script steps or a manual fix path, so the assigned team knows how to remediate it.</p>
          </article>
          <article class="nv-card">
            <span class="nv-card-icon" aria-hidden="true"><i class="bi bi-calendar-event"></i></span>
            <h3>Deadline tracking</h3>
            <p>The calendar shows each finding’s due date, any extension, and the teams that still own the item.</p>
          </article>
          <article class="nv-card">
            <span class="nv-card-icon" aria-hidden="true"><i class="bi bi-people"></i></span>
            <h3>Shared team ownership</h3>
            <p>A vulnerability can belong to more than one team. VAPTFIX keeps every owning team on the finding instead of hiding all but the first.</p>
          </article>
          <article class="nv-card">
            <span class="nv-card-icon" aria-hidden="true"><i class="bi bi-file-earmark-arrow-up"></i></span>
            <h3>Report intake</h3>
            <p>Uploaded assessment results become a register of assets, findings, and status, so the team works from one list instead of a static report.</p>
          </article>
          <article class="nv-card">
            <span class="nv-card-icon" aria-hidden="true"><i class="bi bi-flag"></i></span>
            <h3>Exception review</h3>
            <p>Support requests and exceptions stay attached to the finding and the teams that own it, so a delay is visible before the deadline passes.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="nv-section">
      <div class="nv-container">
        <div class="nv-legal">
          <h2>Trademark and brand usage</h2>
          <p>
            NVIDIA, the NVIDIA logo, and NVIDIA Inception are trademarks and/or registered trademarks of
            NVIDIA Corporation in the United States and other countries. The NVIDIA Inception programme
            badge is used in line with
            <a href="https://www.nvidia.com/en-us/startups/" target="_blank" rel="noopener noreferrer">NVIDIA’s brand guidelines</a>.
          </p>
          <p>
            VAPTFIX’s membership in NVIDIA Inception does not constitute an endorsement by NVIDIA of any products or services.
          </p>
        </div>
      </div>
    </section>

    <section class="nv-cta">
      <div class="nv-container">
        <h2>Vulnerability remediation, in one place.</h2>
        <p>See how VAPTFIX turns assessment findings into assigned work, deadlines, and fixes.</p>
        <div class="nv-cta-actions">
          <button type="button" class="nv-btn nv-btn-primary" @click="openGetStarted">Get Started</button>
          <router-link class="nv-btn nv-btn-ghost" to="/how-vaptfix-works">How VAPTFIX works</router-link>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import Footer from '@/components/admin-component/Footer.vue';

export default {
  name: 'NvidiaInceptionView',
  components: { Header, Footer },
  methods: {
    openGetStarted() {
      this.$refs.pageHeader?.openAdminSignUpModal();
    },
  },
};
</script>

<style scoped>
.nv-root {
  font-family: Inter, sans-serif;
  background: #f8f9fc;
  color: #1e293b;
  min-height: 100vh;
}
.nv-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}
.nv-hero {
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  padding: 108px 0 72px;
}
.nv-hero-inner { max-width: 760px; }
.nv-hero h1 {
  display: flex;
  flex-direction: column;
  width: fit-content;
  max-width: 100%;
  margin: 0 0 16px;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.12;
  font-weight: 800;
  color: #fff;
}
.nv-hero h1 > span:last-child {
  text-align: center;
}
.nv-hero-accent {
  color: #5eead4;
}
.nv-hero-sub {
  margin: 0;
  max-width: 680px;
  font-size: 17px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
}
.nv-section { background: #fff; padding: 72px 0; }
.nv-section-alt { background: #f8f9fc; }
.nv-split {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 36px;
  align-items: start;
}
.nv-label {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f696e;
}
.nv-section h2,
.nv-legal h2 {
  margin: 0 0 12px;
  font-size: clamp(26px, 3vw, 36px);
  line-height: 1.2;
  font-weight: 800;
  color: #241447;
}
.nv-lead {
  margin: 0;
  max-width: 720px;
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
}
.nv-benefits {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 10px;
}
.nv-benefits li {
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #e7e3f0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #241447;
}
.nv-benefits li::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  background: #0f696e;
}
.nv-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 28px;
}
.nv-card {
  background: #fff;
  border: 1px solid #e7e3f0;
  border-radius: 16px;
  padding: 22px 20px 24px;
}
.nv-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  margin-bottom: 12px;
  border-radius: 10px;
  background: #ecfeff;
  color: #0f696e;
  font-size: 18px;
}
.nv-card h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #241447;
}
.nv-card p {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}
.nv-legal {
  padding: 22px 22px 8px;
  border: 1px solid #e7e3f0;
  border-radius: 16px;
  background: #fff;
}
.nv-legal h2 { font-size: 22px; }
.nv-legal p { font-size: 14px; line-height: 1.7; color: #475569; }
.nv-legal a { color: #0f696e; font-weight: 700; }
.nv-cta {
  background: #241447;
  color: #fff;
  padding: 64px 0;
  text-align: center;
}
.nv-cta h2 {
  margin: 0 0 10px;
  color: #fff;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 800;
}
.nv-cta p {
  margin: 0 auto 22px;
  max-width: 560px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.6;
}
.nv-cta-actions { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
.nv-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  border-radius: 999px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
}
.nv-btn-primary { background: #0f696e; color: #fff; }
.nv-btn-primary:hover { background: #0c5559; }
.nv-btn-ghost {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
}
.nv-btn-ghost:hover { border-color: #fff; }
@media (max-width: 800px) {
  .nv-split, .nv-cards { grid-template-columns: 1fr; }
  .nv-hero { padding-top: 96px; }
}
</style>
