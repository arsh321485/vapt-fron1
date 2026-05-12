<template>
  <main class="lead-portal-shell">
    <Header />

    <div class="lead-portal-body">
      <!-- Page Header -->
      <header class="portal-hero">
        <span class="portal-kicker">Strategic Expansion</span>
        <h1 class="portal-title">Lead Registration</h1>
        <p class="portal-desc">Submit your high-intent prospects into our Intelligence Framework. Accelerated validation and specialist support await.</p>
      </header>

      <!-- Partner Verification Section (always visible) -->
      <section class="verify-section">
        <div class="verify-card">
          <h2 class="verify-title">Partner Verification</h2>
          <p class="verify-sub">Verification required to access lead registration.</p>

          <div v-if="!isVerified">
            <div class="verify-email-row">
              <div class="verify-input-wrap">
                <label class="verify-label">Partner Email</label>
                <div class="verify-field-row">
                  <input
                    type="email"
                    class="verify-input"
                    placeholder="your@email.com"
                    v-model="verifyEmailInput"
                    @keyup.enter="verifyEmail"
                  />
                  <button type="button" class="verify-btn" @click="verifyEmail">
                    Verify Email
                  </button>
                </div>
                <p v-if="verifyError" class="verify-error">{{ verifyError }}</p>
              </div>
            </div>
            <p class="verify-footer">
              Not a partner yet?
              <a class="verify-link" @click.prevent="$router.push('/partner')" href="#">Register as a Partner</a>
            </p>
          </div>

          <div v-else class="verify-success">
            <i class="bi bi-check-circle-fill verify-check-icon"></i>
            <span>Verified as <strong>{{ verifyEmailInput }}</strong></span>
          </div>
        </div>
      </section>

      <!-- Lead Registration Form (visible only after verification) -->
      <section v-if="isVerified" class="lead-form-section">
        <form class="lead-form" @submit.prevent="submitLead">
          <!-- Tab Navigation -->
          <div class="lead-tabs">
            <button
              type="button"
              class="lead-tab"
              :class="{ active: activeTab === 0 }"
              @click="activeTab = 0"
            >1. Lead Information</button>
            <button
              type="button"
              class="lead-tab"
              :class="{ active: activeTab === 1 }"
              @click="activeTab = 1"
            >2. Opportunity Details</button>
          </div>

          <div class="lead-form-body">
            <!-- Tab 1: Lead Information -->
            <div v-if="activeTab === 0" class="lead-grid">
              <div class="lead-field full">
                <label class="lead-label">Lead Company Name</label>
                <input class="lead-input" type="text" placeholder="Enterprise Logic Corp" v-model="lead.companyName" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Lead Contact Name</label>
                <input class="lead-input" type="text" placeholder="Robert Smith" v-model="lead.contactName" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Lead Job Title</label>
                <input class="lead-input" type="text" placeholder="Chief Information Security Officer" v-model="lead.jobTitle" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Lead Email</label>
                <input class="lead-input" type="email" placeholder="r.smith@enterprise.com" v-model="lead.email" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Lead Phone</label>
                <input class="lead-input" type="tel" placeholder="+44 20 7946 0000" v-model="lead.phone" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Lead Website</label>
                <input class="lead-input" type="url" placeholder="https://www.enterprise-logic.com" v-model="lead.website" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Country</label>
                <select class="lead-input" v-model="lead.country">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Germany</option>
                  <option>Singapore</option>
                </select>
              </div>

              <div class="tab-nav-row full">
                <button type="button" class="tab-next-btn" @click="activeTab = 1">
                  Next: Opportunity Details
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Tab 2: Opportunity Details -->
            <div v-if="activeTab === 1" class="lead-grid">
              <div class="lead-field">
                <label class="lead-label">Product or Service of Interest</label>
                <select class="lead-input" v-model="lead.product">
                  <option>Continuous Pentesting</option>
                  <option>Compliance Automation</option>
                  <option>Vulnerability Intelligence</option>
                  <option>Full Suite Pro</option>
                </select>
              </div>
              <div class="lead-field">
                <label class="lead-label">Lead Status</label>
                <select class="lead-input" v-model="lead.status">
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Proposal Sent</option>
                </select>
              </div>
              <div class="lead-field full">
                <label class="lead-label">Use Case / Need</label>
                <textarea class="lead-input" rows="3" placeholder="Describe the specific problem or regulatory requirement driving this interest..." v-model="lead.useCase"></textarea>
              </div>
              <div class="lead-field">
                <label class="lead-label">Estimated Deal Value ($)</label>
                <input class="lead-input" type="number" placeholder="50000" v-model="lead.dealValue" />
              </div>
              <div class="lead-field">
                <label class="lead-label">Expected Close Date</label>
                <input class="lead-input" type="date" v-model="lead.closeDate" />
              </div>
              <div class="lead-field full">
                <label class="lead-label">Notes</label>
                <textarea class="lead-input" rows="2" placeholder="Any additional context for the sales team..." v-model="lead.notes"></textarea>
              </div>

              <!-- Terms -->
              <div class="lead-field full lead-terms">
                <label class="consent-row">
                  <input type="checkbox" v-model="consent1" />
                  <span>I confirm this lead information is accurate to the best of my knowledge and represents a genuine interest.</span>
                </label>
                <label class="consent-row">
                  <input type="checkbox" v-model="consent2" />
                  <span>I agree to the VaptFix Pro registration terms, including lead protection periods and revenue sharing agreements.</span>
                </label>
              </div>

              <div class="lead-field full submit-row">
                <button type="button" class="tab-back-btn" @click="activeTab = 0">
                  <i class="bi bi-arrow-left"></i> Back
                </button>
                <button type="submit" class="submit-btn" :disabled="!consent1 || !consent2">
                  Register Lead
                </button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>

    <Footer />
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";
import Footer from "@/components/admin-component/Footer.vue";

export default {
  name: "PartnerLeadPortalView",
  components: { Header, Footer },
  data() {
    return {
      isVerified: false,
      verifyEmailInput: '',
      verifyError: '',
      activeTab: 0,
      consent1: false,
      consent2: false,
      lead: {
        companyName: '',
        contactName: '',
        jobTitle: '',
        email: '',
        phone: '',
        website: '',
        country: 'United States',
        product: 'Continuous Pentesting',
        status: 'New',
        useCase: '',
        dealValue: '',
        closeDate: '',
        notes: ''
      }
    };
  },
  methods: {
    verifyEmail() {
      this.verifyError = '';
      const stored = localStorage.getItem('partnerEmail') || '';
      if (!this.verifyEmailInput) {
        this.verifyError = 'Please enter your email address.';
        return;
      }
      if (stored && this.verifyEmailInput.toLowerCase() === stored.toLowerCase()) {
        this.isVerified = true;
      } else {
        this.verifyError = 'Email not recognized as a registered partner. Please check your email or register as a partner.';
      }
    },
    submitLead() {
      this.$router.push('/partner-lead-thankyou');
    }
  }
};
</script>

<style scoped>
.lead-portal-shell {
  min-height: 100vh;
  background: #f8f9fc;
}

.lead-portal-body {
  max-width: 900px;
  margin: 0 auto;
  padding: 100px clamp(14px, 4vw, 24px) 80px;
}

/* Hero */
.portal-hero {
  margin-bottom: 48px;
}
.portal-kicker {
  color: #0f696e;
  font-weight: 700;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  display: block;
  margin-bottom: 12px;
}
.portal-title {
  font-family: 'Manrope', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  color: #241447;
  margin: 0 0 12px;
  line-height: 1.15;
}
.portal-desc {
  font-size: 16px;
  color: #49454f;
  line-height: 1.65;
  margin: 0;
  max-width: 600px;
}

/* Verification */
.verify-section {
  margin-bottom: 40px;
}
.verify-card {
  background: #fff;
  border: 1px solid rgba(203,196,208,0.3);
  border-radius: 16px;
  padding: clamp(20px, 4vw, 32px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}
.verify-title {
  font-family: 'Manrope', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #241447;
  margin: 0 0 6px;
}
.verify-sub {
  font-size: 14px;
  color: #49454f;
  margin: 0 0 20px;
}
.verify-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #49454f;
  margin-bottom: 8px;
}
.verify-field-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.verify-input {
  flex: 1;
  min-width: 200px;
  height: 46px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid #cbc4d0;
  border-radius: 10px;
  font-size: 14px;
  color: #191c1e;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.verify-input:focus {
  outline: none;
  border-color: #0f696e;
  box-shadow: 0 0 0 2px rgba(15,105,110,0.15);
}
.verify-btn {
  height: 46px;
  padding: 0 24px;
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s;
}
.verify-btn:hover { background: #1a0f38; }
.verify-error {
  font-size: 12px;
  color: #ba1a1a;
  margin: 8px 0 0;
}
.verify-footer {
  font-size: 13px;
  color: #49454f;
  margin: 16px 0 0;
}
.verify-link {
  color: #0f696e;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}
.verify-link:hover { text-decoration: underline; }

.verify-success {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #191c1e;
  font-weight: 500;
}
.verify-check-icon {
  font-size: 20px;
  color: #0f696e;
}

/* Lead Form */
.lead-form-section {
  animation: fadeUp 0.3s ease;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lead-form {
  background: #fff;
  border: 1px solid rgba(203,196,208,0.2);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

/* Tabs */
.lead-tabs {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(203,196,208,0.3);
  background: #f2f3f6;
}
.lead-tab {
  padding: 16px 28px;
  font-size: 13px;
  font-family: 'Manrope', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  background: transparent;
  color: #49454f;
  cursor: pointer;
  transition: all 0.2s;
}
.lead-tab:hover { color: #241447; }
.lead-tab.active {
  color: #241447;
  border-bottom-color: #241447;
  background: #fff;
}

.lead-form-body {
  padding: 36px;
}

/* Grid */
.lead-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.lead-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.lead-field.full {
  grid-column: 1 / -1;
}
.lead-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #49454f;
}
.lead-input {
  padding: 11px 14px;
  background: #f2f3f6;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: #191c1e;
  transition: background 0.2s, box-shadow 0.2s;
  width: 100%;
}
.lead-input:focus {
  outline: none;
  background: #ededf8;
  box-shadow: 0 0 0 2px rgba(36,20,71,0.15);
}
.lead-input::placeholder { color: #7a7580; }
textarea.lead-input { resize: vertical; }
select.lead-input { cursor: pointer; }

/* Tab nav */
.tab-nav-row {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}
.tab-next-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #241447;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.tab-next-btn:hover { background: #1a0f38; }

/* Terms */
.lead-terms {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid rgba(203,196,208,0.3);
}
.consent-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: #49454f;
  cursor: pointer;
}
.consent-row input[type="checkbox"] {
  margin-top: 2px;
  accent-color: #0f696e;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Submit row */
.submit-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  padding-top: 8px;
}
.tab-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid #cbc4d0;
  color: #49454f;
  padding: 11px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.tab-back-btn:hover { border-color: #241447; color: #241447; }
.submit-btn {
  background: #241447;
  color: #fff;
  border: none;
  padding: 13px 40px;
  border-radius: 9999px;
  font-family: 'Manrope', sans-serif;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  box-shadow: 0 4px 16px rgba(36,20,71,0.2);
}
.submit-btn:hover:not(:disabled) { background: #1a0f38; }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

@media (max-width: 640px) {
  .lead-grid { grid-template-columns: 1fr; }
  .lead-form-body { padding: 24px 20px; }
  .lead-tab {
    flex: 1 1 auto;
    min-width: 0;
    padding: 14px 12px;
    font-size: 11px;
    text-align: center;
  }
  .verify-field-row { flex-direction: column; }
  .verify-btn { width: 100%; justify-content: center; display: flex; }
  .verify-input { min-width: 0; width: 100%; }
  .submit-row {
    flex-direction: column;
    align-items: stretch;
  }
  .tab-back-btn,
  .submit-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
