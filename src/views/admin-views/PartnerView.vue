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
        <form class="partner-form" @submit.prevent="submitApplication">

          <!-- 01 Contact Information -->
          <div class="form-card">
            <div class="section-head">
              <span>01</span>
              <h2>Contact Information</h2>
            </div>
            <div class="grid two-col">
              <label>Full Name
                <input type="text" placeholder="Enter your name" v-model="form.full_name" />
                <span v-if="errors.full_name" class="field-error">{{ errors.full_name }}</span>
              </label>
              <label>Job Title
                <input type="text" placeholder="e.g. CEO, Director of Sales" v-model="form.job_title" />
                <span v-if="errors.job_title" class="field-error">{{ errors.job_title }}</span>
              </label>
              <label>Work Email
                <input type="email" placeholder="email@company.com" v-model="form.work_email" />
                <span v-if="errors.work_email" class="field-error">{{ errors.work_email }}</span>
              </label>
              <label>Phone Number <input type="tel" placeholder="+1 (555) 000-0000" v-model="form.phone_number" /></label>
              <label class="full">LinkedIn Profile <input type="url" placeholder="https://linkedin.com/in/username" v-model="form.linkedin_profile" /></label>
            </div>
          </div>

          <!-- 02 Company Information -->
          <div class="form-card">
            <div class="section-head">
              <span>02</span>
              <h2>Company Information</h2>
            </div>
            <div class="grid two-col">
              <label>Company Name
                <input type="text" v-model="form.company_name" />
                <span v-if="errors.company_name" class="field-error">{{ errors.company_name }}</span>
              </label>
              <label>Website <input type="url" placeholder="www.example.com" v-model="form.website" /></label>
              <label style="position:relative;">
                Country
                <div class="cdd-wrap" ref="cddWrap">
                  <div class="cdd-trigger" :class="{error: errors.country}" @click="cddOpen=!cddOpen; cddOpen && $nextTick(()=>$refs.cddSearchRef&&$refs.cddSearchRef.focus())">
                    <span :style="form.country ? '' : 'color:#9ca3af'">{{ form.country || 'Select Country' }}</span>
                    <i class="bi bi-chevron-down" style="font-size:12px;color:#6b7280;"></i>
                  </div>
                  <div v-if="cddOpen" class="cdd-menu">
                    <input v-model="cddSearch" class="cdd-search" placeholder="Search..." ref="cddSearchRef" @click.stop />
                    <div class="cdd-list">
                      <div v-for="c in cddFiltered" :key="c" class="cdd-item" :class="{active: form.country===c}" @click.stop="form.country=c; cddOpen=false; cddSearch=''">{{ c }}</div>
                      <div v-if="!cddFiltered.length" class="cdd-empty">No results</div>
                    </div>
                  </div>
                </div>
                <span v-if="errors.country" class="field-error">{{ errors.country }}</span>
              </label>
              <label>Industry <input type="text" v-model="form.industry" /></label>
              <label class="split">
                <span>Size</span>
                <select v-model="form.company_size">
                  <option value="">Select</option>
                  <option v-for="s in companySizeOptions" :key="s" :value="s">{{ s }}</option>
                </select>
                <span v-if="errors.company_size" class="field-error">{{ errors.company_size }}</span>
                <span>Year Founded</span>
                <input type="number" placeholder="YYYY" v-model="form.year_founded" min="1900" :max="new Date().getFullYear()" />
              </label>
            </div>
          </div>

          <!-- 03 Partnership Details -->
          <div class="form-card">
            <div class="section-head">
              <span>03</span>
              <h2>Partnership Details</h2>
            </div>
            <div class="grid one-col">
              <label>
                Partner Type
                <select v-model="form.partner_type">
                  <option value="">Select Type</option>
                  <option v-for="p in partnerTypeOptions" :key="p" :value="p">{{ p }}</option>
                </select>
                <span v-if="errors.partner_type" class="field-error">{{ errors.partner_type }}</span>
              </label>
              <label>
                Why partner with us?
                <textarea rows="5" placeholder="Tell us about your interest in VaptFix ..." v-model="form.why_partner"></textarea>
                <span v-if="errors.why_partner" class="field-error">{{ errors.why_partner }}</span>
              </label>
              <div class="grid two-col">
                <label>Markets/Regions <input type="text" placeholder="e.g. North America, EMEA" v-model="form.markets_regions" /></label>
                <label>Target customer <input type="text" placeholder="e.g. Mid-market FinTech" v-model="form.target_customer" /></label>
              </div>
              <label>
                Promotion plan
                <textarea rows="4" placeholder="How do you plan to promote our services?" v-model="form.promotion_plan"></textarea>
              </label>
            </div>
          </div>

          <!-- 04 Qualification -->
          <div class="form-card">
            <div class="section-head">
              <span>04</span>
              <h2>Qualification</h2>
            </div>
            <div class="grid one-col">
              <label class="inline">Do you sell similar security Service?
                <span><input type="radio" name="similar" :value="true" v-model="form.sells_similar_service" /> Yes</span>
                <span><input type="radio" name="similar" :value="false" v-model="form.sells_similar_service" /> No</span>
              </label>
              <div class="grid two-col">
                <label>Estimated referrals / Year <input type="number" v-model.number="form.estimated_referrals_per_year" min="0" /></label>
                <label>Total no of active clients <input type="number" v-model.number="form.total_active_clients" min="0" /></label>
              </div>
              <label>Audience description
                <textarea rows="4" placeholder="Describe your existing client base..." v-model="form.audience_description"></textarea>
              </label>
            </div>
          </div>

          <!-- Consent -->
          <div class="consent">
            <label class="consent-row">
              <input type="checkbox" v-model="form.agreed_privacy_policy" />
              <span class="consent-text">
                I agree to the <a href="#" class="policy-link">Privacy Policy</a> and understand that
                VaptFix will process my information for partner evaluation.
                <span v-if="errors.privacy" class="field-error d-block">{{ errors.privacy }}</span>
              </span>
            </label>
            <label class="consent-row">
              <input type="checkbox" v-model="form.consent_communications" />
              <span class="consent-text">
                I consent to receiving communications regarding the partner program, updates, and
                marketing materials.
              </span>
            </label>
          </div>

          <button type="button" class="submit-btn" :disabled="submitting" @click="submitApplication">
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
            {{ submitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </form>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";
import Footer from "@/components/admin-component/Footer.vue";
import axios from "axios";
import Swal from "sweetalert2";
// Local: use Vite proxy. Production: call backend directly
const PARTNERS_BASE = import.meta.env.DEV
  ? ''
  : 'https://vaptbackend.secureitlab.com';
const publicApi = axios.create({ baseURL: PARTNERS_BASE });

export default {
  name: "PartnerView",
  components: { Header, Footer },
  data() {
    return {
      countries: [],
      companySizeOptions: [],
      partnerTypeOptions: [],

      // Form fields
      form: {
        full_name: '',
        job_title: '',
        work_email: '',
        phone_number: '',
        linkedin_profile: '',
        company_name: '',
        website: '',
        country: '',
        industry: '',
        company_size: '',
        year_founded: '',
        partner_type: '',
        why_partner: '',
        markets_regions: '',
        target_customer: '',
        promotion_plan: '',
        sells_similar_service: false,
        estimated_referrals_per_year: '',
        total_active_clients: '',
        audience_description: '',
        agreed_privacy_policy: false,
        consent_communications: false,
      },

      cddOpen: false,
      cddSearch: '',
      errors: {},
      submitting: false,
      submitError: '',
    };
  },

  async mounted() {
    try {
      const res = await publicApi.get('/api/partners/form-options/');
      this.countries = res.data.countries || [];
      this.companySizeOptions = res.data.company_size_options || [];
      this.partnerTypeOptions = res.data.partner_type_options || [];
    } catch (e) {
      console.error("Failed to load form options:", e);
    }
    this._cddClose = (e) => { if (this.$refs.cddWrap && !this.$refs.cddWrap.contains(e.target)) this.cddOpen = false; };
    document.addEventListener('click', this._cddClose);
  },
  beforeUnmount() {
    document.removeEventListener('click', this._cddClose);
  },

  computed: {
    cddFiltered() {
      const q = this.cddSearch.toLowerCase();
      return q ? this.countries.filter(c => c.toLowerCase().includes(q)) : this.countries;
    },
  },
  methods: {
    async submitApplication() {
      // Clear previous errors
      this.errors = {};
      let hasError = false;

      if (!this.form.full_name.trim())     { this.errors.full_name = 'Full Name is required.'; hasError = true; }
      if (!this.form.job_title.trim())     { this.errors.job_title = 'Job Title is required.'; hasError = true; }
      if (!this.form.work_email.trim())    { this.errors.work_email = 'Work Email is required.'; hasError = true; }
      else if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.form.work_email)) { this.errors.work_email = 'Enter a valid email address.'; hasError = true; }
      if (!this.form.company_name.trim())  { this.errors.company_name = 'Company Name is required.'; hasError = true; }
      if (!this.form.country)              { this.errors.country = 'Please select a Country.'; hasError = true; }
      if (!this.form.company_size)         { this.errors.company_size = 'Please select a Company Size.'; hasError = true; }
      if (!this.form.partner_type)         { this.errors.partner_type = 'Please select a Partner Type.'; hasError = true; }
      if (!this.form.why_partner.trim())   { this.errors.why_partner = 'This field is required.'; hasError = true; }
      if (!this.form.agreed_privacy_policy){ this.errors.privacy = 'Please agree to the Privacy Policy.'; hasError = true; }

      if (hasError) {
        // Scroll to first error
        this.$nextTick(() => {
          const el = document.querySelector('.field-error');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        return;
      }

      this.submitting = true;
      try {
        const payload = {
          full_name: this.form.full_name,
          job_title: this.form.job_title,
          work_email: this.form.work_email,
          phone_number: this.form.phone_number,
          linkedin_profile: this.form.linkedin_profile,
          company_name: this.form.company_name,
          website: this.form.website,
          country: this.form.country,
          industry: this.form.industry,
          company_size: this.form.company_size,
          year_founded: this.form.year_founded ? Number(this.form.year_founded) : null,
          partner_type: this.form.partner_type,
          why_partner: this.form.why_partner,
          markets_regions: this.form.markets_regions,
          target_customer: this.form.target_customer,
          promotion_plan: this.form.promotion_plan,
          sells_similar_service: this.form.sells_similar_service,
          estimated_referrals_per_year: this.form.estimated_referrals_per_year !== '' ? Number(this.form.estimated_referrals_per_year) : 0,
          total_active_clients: this.form.total_active_clients !== '' ? Number(this.form.total_active_clients) : 0,
          audience_description: this.form.audience_description,
          agreed_privacy_policy: this.form.agreed_privacy_policy,
          consent_communications: this.form.consent_communications,
        };

        const res = await publicApi.post('/api/partners/apply/', payload);
        if (res.data && (res.data.id || res.data.message)) {
          this.$router.push('/partner-thankyou');
        } else {
          Swal.fire({ icon: 'error', title: 'Error', text: 'Unexpected response from server.', confirmButtonColor: '#0f696e' });
        }
      } catch (err) {
        const data = err.response?.data;
        const msg = data?.message || data?.detail || 'Submission failed. Please try again.';
        Swal.fire({ icon: 'error', title: 'Submission Failed', text: msg, confirmButtonColor: '#0f696e' });
      } finally {
        this.submitting = false;
      }
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

.tier-text h3 { margin: 0; color: #231645; font-size: 1rem; font-weight: 700; }
.tier-text p  { margin: 2px 0 0; color: #5f6168; font-size: 12px; max-width: 100%; }

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

.partner-form-section { padding: 0 0 90px; }
.partner-form { display: grid; gap: 22px; }

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

.grid { display: grid; gap: 14px; }
.two-col { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.one-col  { grid-template-columns: 1fr; }

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

input, select, textarea {
  border: none;
  border-radius: 12px;
  background: #fff;
  color: #1f1f22;
  font-size: 14px;
  padding: 12px;
  outline: none;
}

.full { grid-column: 1 / -1; }

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

.inline span { margin-top: 8px; margin-right: 16px; font-weight: 500; }

.consent { display: grid; gap: 16px; margin-top: 8px; }

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

.consent-row input[type="checkbox"]:checked { border-color: #0f696e; background: #0f696e; }
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

.policy-link { color: #1d6f73; font-weight: 700; text-decoration: none; }
.policy-link:hover { text-decoration: underline; }

.submit-error {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  margin: 0;
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
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.submit-btn:not(:disabled):hover { opacity: 0.88; }

/* Country custom dropdown */
.cdd-wrap { position: relative; }
.cdd-trigger {
  display: flex; justify-content: space-between; align-items: center;
  background: #fff; border-radius: 12px; padding: 12px;
  cursor: pointer; font-size: 14px; font-weight: 400;
  text-transform: none; letter-spacing: 0; color: #1f1f22;
}
.cdd-menu {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: #fff; border-radius: 12px; z-index: 9999;
  box-shadow: 0 8px 24px rgba(0,0,0,0.13); overflow: hidden;
}
.cdd-search {
  width: 100%; border: none; border-bottom: 1px solid #e2e8f0;
  border-radius: 0; padding: 10px 14px; font-size: 13px;
  background: #f8f9fc; outline: none;
}
.cdd-list { max-height: 220px; overflow-y: auto; }
.cdd-item {
  padding: 10px 14px; font-size: 14px; color: #1f1f22;
  cursor: pointer; font-weight: 400;
  text-transform: none; letter-spacing: 0;
}
.cdd-item:hover { background: #f1f5f9; }
.cdd-item.active { background: #e0f2f1; color: #0f696e; font-weight: 600; }
.cdd-empty { padding: 10px 14px; font-size: 13px; color: #94a3b8; }
.field-error { color: #dc2626; font-size: 11px; font-weight: 600; letter-spacing: 0; text-transform: none; margin-top: 2px; }
.cdd-trigger.error { outline: 1.5px solid #dc2626; }



@media (max-width: 900px) {
  .hero-grid { grid-template-columns: 1fr; }
  .partner-tier-card { max-width: 540px; }
  .two-col { grid-template-columns: 1fr; }
  .split { grid-template-columns: 1fr; }
}

@media (max-width: 576px) {
  .partner-hero { padding: 96px 0 48px; }
  .partner-form-section { padding: 0 0 64px; }
  .form-card { padding: 20px 18px; border-radius: 18px; }
  .partner-tier-card { max-width: none; width: 100%; }
  .container { width: min(1100px, 94%); }
  .submit-btn { font-size: 1rem; padding: 14px 16px; }
}
</style>
