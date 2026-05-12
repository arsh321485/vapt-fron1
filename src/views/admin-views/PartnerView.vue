<template>
  <main class="partner-page">
    <Header />

    <section class="partner-hero">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content">
            <span class="kicker">Ecosystem Expansion</span>
            <h1>
              Powering the <br />
              <span>Next Frontier</span> of Vulnerability Management Program.
            </h1>
            <p>
              Join the VaptFix.ai. We are building an editorial intelligence
              framework for cybersecurity professionals worldwide.
            </p>
          
          </div>
          <div class="partner-tier-card">
            <div class="tier-head">
              <div class="tier-icon">
                <i class="bi bi-shield-check"></i>
              </div>
              <div class="tier-text">
                <h3>Partner Tier: Gold</h3>
                <p>Editorial Excellence Certified</p>
              </div>
            </div>
            <div class="tier-progress">
              <span class="tier-fill"></span>
            </div>
            <div class="tier-footer">
              <span>Revenue Target</span>
              <span>75% Achieved</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="partner-form-section">
      <div class="container form-shell">
        <form class="partner-form" @submit.prevent="goToLeadPortal">
          <div class="form-card">
            <div class="section-head">
              <span>01</span>
              <h2>Contact Information</h2>
            </div>
            <div class="grid two-col">
              <label>Full Name <input type="text" placeholder="Enter your name" /></label>
              <label>Job Title <input type="text" placeholder="e.g. CEO, Director of Sales" /></label>
              <label>Work Email <input type="email" placeholder="email@company.com" v-model="partnerEmail" /></label>
              <label>Phone Number <input type="tel" placeholder="+1 (555) 000-0000" /></label>
              <label class="full">LinkedIn Profile <input type="url" placeholder="https://linkedin.com/in/username" /></label>
            </div>
          </div>

          <div class="form-card">
            <div class="section-head">
              <span>02</span>
              <h2>Company Information</h2>
            </div>
            <div class="grid two-col">
              <label>Company Name <input type="text" /></label>
              <label>Website <input type="url" placeholder="www.example.com" /></label>
              <label>
                Country
                <select>
                  <option>Select Country</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>Singapore</option>
                </select>
              </label>
              <label>Industry <input type="text" /></label>
              <label class="split">
                <span>Size</span>
                <select>
                  <option>1-50</option>
                  <option>51-200</option>
                  <option>201-500</option>
                  <option>500+</option>
                </select>
                <span>Year Founded</span>
                <input type="text" placeholder="YYYY" />
              </label>
            </div>
          </div>

          <div class="form-card">
            <div class="section-head">
              <span>03</span>
              <h2>Partnership Details</h2>
            </div>
            <div class="grid one-col">
              <label>
                Partner Type
                <select>
                  <option>Select Type</option>
                  <option>Referral Partner</option>
                  <option>Reseller</option>
                  <option>Managed Service Provider (MSP)</option>
                  <option>Consulting Partner</option>
                </select>
              </label>
              <label>
                Why partner with us?
                <textarea rows="5" placeholder="Tell us about your interest in VaptFix ..."></textarea>
              </label>
              <div class="grid two-col">
                <label>Markets/Regions <input type="text" placeholder="e.g. North America, EMEA" /></label>
                <label>Target customer <input type="text" placeholder="e.g. Mid-market FinTech" /></label>
              </div>
              <label>
                Promotion plan
                <textarea rows="4" placeholder="How do you plan to promote our services?"></textarea>
              </label>
            </div>
          </div>

          <div class="form-card">
            <div class="section-head">
              <span>04</span>
              <h2>Qualification</h2>
            </div>
            <div class="grid one-col">
              <label class="inline">Do you sell similar security Service?
                <span><input type="radio" name="similar" /> Yes</span>
                <span><input type="radio" name="similar" /> No</span>
              </label>
              <div class="grid two-col">
                <label>Estimated referrals / Year <input type="number" /></label>
                <label>Total no of active clients <input type="number" /></label>
              </div>
              <label>Audience description
                <textarea rows="4" placeholder="Describe your existing client base..."></textarea>
              </label>
            </div>
          </div>

          <div class="consent">
            <label class="consent-row">
              <input type="checkbox" />
              <span class="consent-text">
                I agree to the <a href="#" class="policy-link">Privacy Policy</a> and understand that
                VaptFix  will process my information for partner evaluation.
              </span>
            </label>
            <label class="consent-row">
              <input type="checkbox" />
              <span class="consent-text">
                I consent to receiving communications regarding the partner program, updates, and
                marketing materials.
              </span>
            </label>
          </div>

          <button type="submit" class="submit-btn">Submit Application</button>
        </form>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";
import Footer from "@/components/admin-component/Footer.vue";

export default {
  name: "PartnerView",
  components: { Header, Footer },
  data() {
    return {
      partnerEmail: ''
    };
  },
  methods: {
    goToLeadPortal() {
      if (this.partnerEmail) {
        localStorage.setItem('partnerEmail', this.partnerEmail);
      }
      this.$router.push("/partner-lead-portal");
    },
  },
};
</script>

<style scoped>
.partner-page {
  background: #f8f9fc;
}

.container {
  width: min(1100px, 92%);
  margin: 0 auto;
}

.partner-hero {
  padding: 140px 0 70px;
}

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 440px);
  gap: 28px;
  align-items: center;
}

.hero-content .kicker {
  color: #0f696e;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.14em;
  font-weight: 700;
}

.hero-content h1 {
  margin: 14px 0;
  color: #241447;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  line-height: 1.15;
}

.hero-content h1 span {
  color: #0f696e;
}

.hero-content p {
  max-width: 720px;
  color: #49454f;
}

.hero-meta {
  margin-top: 22px;
  display: flex;
  gap: 14px;
  align-items: center;
}

.partner-tier-card {
  background: #ffffff;
  border-radius: 22px;
  padding: 24px;
  box-shadow: 0 16px 34px rgba(47, 72, 88, 0.1);
}

.tier-head {
  display: flex;
  align-items: center;
  gap: 14px;
}

.tier-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  background: #241447;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.tier-text h3 {
  margin: 0;
  color: #231645;
  font-size: 1rem;
  font-weight: 700;
}

.tier-text p {
  margin: 2px 0 0;
  color: #5f6168;
  font-size: 12px;
  max-width: 100%;
}

.tier-progress {
  margin-top: 18px;
  height: 8px;
  border-radius: 999px;
  background: #d7dde4;
  overflow: hidden;
}

.tier-fill {
  display: block;
  width: 75%;
  height: 100%;
  border-radius: 999px;
  background: #0f696e;
}

.tier-footer {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #495159;
  font-weight: 700;
}

.avatars {
  display: flex;
}

.avatars img {
  width: 44px;
  height: 44px;
  object-fit: cover;
  border-radius: 50%;
  margin-left: -8px;
  border: 3px solid #f8f9fc;
}

.avatars img:first-child {
  margin-left: 0;
}

.partner-form-section {
  padding: 0 0 90px;
}

.partner-form {
  display: grid;
  gap: 22px;
}

.form-card {
  background: #f2f3f6;
  border-radius: 24px;
  padding: 28px;
}

.section-head {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 18px;
}

.section-head span {
  font-size: 2rem;
  color: rgba(36, 20, 71, 0.25);
  font-weight: 800;
}

.section-head h2 {
  margin: 0;
  color: #241447;
  font-size: 1.5rem;
}

.grid {
  display: grid;
  gap: 14px;
}

.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.one-col {
  grid-template-columns: 1fr;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  letter-spacing: 0.08em;
  font-weight: 700;
  color: #5a5660;
  text-transform: uppercase;
}

input,
select,
textarea {
  border: none;
  border-radius: 12px;
  background: #fff;
  color: #1f1f22;
  font-size: 14px;
  padding: 12px;
  outline: none;
}

.full {
  grid-column: 1 / -1;
}

.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: end;
  gap: 10px;
}

.inline {
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  letter-spacing: 0;
  text-transform: none;
  font-size: 14px;
  color: #191c1e;
}

.inline span {
  margin-top: 8px;
  margin-right: 16px;
  font-weight: 500;
}

.consent {
  display: grid;
  gap: 16px;
  margin-top: 8px;
}

.consent-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
  color: #545a61;
  font-size: 14px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
}

.consent-row input[type="checkbox"] {
  width: 10px;
  height: 10px;
  margin-top: 4px;
  padding: 0;
  border: 1px solid #d2d7dd;
  border-radius: 2px;
  appearance: none;
  background: #f8f9fc;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
}

.consent-row input[type="checkbox"]:checked {
  border-color: #0f696e;
  background: #0f696e;
}

.consent-row input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 2px;
  top: -1px;
  width: 3px;
  height: 6px;
  border: solid #ffffff;
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
}

.consent-text {
  line-height: 1.55;
  color: #4f555c;
  text-transform: none;
  font-size: 14px;
  font-weight: 500;
}

.policy-link {
  color: #1d6f73;
  font-weight: 700;
  text-decoration: none;
}

.policy-link:hover {
  text-decoration: underline;
}

.submit-btn {
  border: none;
  width: 100%;
  border-radius: 999px;
  padding: 15px 20px;
  background: #241447;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
}

@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .partner-tier-card {
    max-width: 540px;
  }

  .two-col {
    grid-template-columns: 1fr;
  }

  .split {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 576px) {
  .partner-hero {
    padding: 96px 0 48px;
  }

  .partner-form-section {
    padding: 0 0 64px;
  }

  .form-card {
    padding: 20px 18px;
    border-radius: 18px;
  }

  .partner-tier-card {
    max-width: none;
    width: 100%;
  }

  .container {
    width: min(1100px, 94%);
  }

  .submit-btn {
    font-size: 1rem;
    padding: 14px 16px;
  }
}
</style>
