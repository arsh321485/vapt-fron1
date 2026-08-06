<template>
  <main class="webinar-page">
    <Header />

    <!-- Close button -->
    <button class="webinar-close-btn" @click="$router.push('/home')" title="Close">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <section class="webinar-hero">
      <div class="container">
        <div class="hero-content">
          <span class="kicker">Webinar Registration</span>
          <h1 class="title">Join the VaptFix Webinar</h1>
          <p class="desc">
            Please fill in your details. Required fields are marked with an asterisk (*).
          </p>
        </div>
      </div>
    </section>

    <section class="webinar-form-section">
      <div class="container">
        <form class="webinar-form" novalidate @submit.prevent="submitForm">
          <div class="form-card">
            <div class="form-grid">
              <label class="field">
                <span class="label-text">
                  Full Name <span class="req">*</span>
                </span>
                <input
                  class="webinar-input"
                  type="text"
                  placeholder="Enter your name"
                  v-model.trim="form.full_name"
                  :class="{ 'is-invalid': errors.full_name }"
                />
                <span v-if="errors.full_name" class="field-error">{{ errors.full_name }}</span>
              </label>

              <label class="field">
                <span class="label-text">
                  Work Email <span class="req">*</span>
                </span>
                <input
                  class="webinar-input"
                  type="email"
                  placeholder="email@company.com"
                  v-model.trim="form.work_email"
                  :class="{ 'is-invalid': errors.work_email }"
                />
                <span v-if="errors.work_email" class="field-error">{{ errors.work_email }}</span>
              </label>

              <label class="field">
                <span class="label-text">
                  Job Title <span class="req">*</span>
                </span>
                <input
                  class="webinar-input"
                  type="text"
                  placeholder="e.g. CEO, Director of Sales"
                  v-model.trim="form.job_title"
                  :class="{ 'is-invalid': errors.job_title }"
                />
                <span v-if="errors.job_title" class="field-error">{{ errors.job_title }}</span>
              </label>

              <label class="field">
                <span class="label-text">
                  Company Name <span class="req">*</span>
                </span>
                <input
                  class="webinar-input"
                  type="text"
                  placeholder="Enter company name"
                  v-model.trim="form.company_name"
                  :class="{ 'is-invalid': errors.company_name }"
                />
                <span v-if="errors.company_name" class="field-error">{{ errors.company_name }}</span>
              </label>

              <label class="field">
                <span class="label-text">
                  Company Website <span class="req">*</span>
                </span>
                <input
                  class="webinar-input"
                  type="text"
                  inputmode="url"
                  placeholder="www.example.com"
                  v-model.trim="form.company_website"
                  :class="{ 'is-invalid': errors.company_website }"
                />
                <span v-if="errors.company_website" class="field-error">{{ errors.company_website }}</span>
              </label>

              <label class="field">
                <span class="label-text">Company LinkedIn Page</span>
                <input
                  class="webinar-input"
                  type="text"
                  inputmode="url"
                  placeholder="https://linkedin.com/company/your-company"
                  v-model.trim="form.company_linkedin"
                  :class="{ 'is-invalid': errors.company_linkedin }"
                />
                <span v-if="errors.company_linkedin" class="field-error">
                  {{ errors.company_linkedin }}
                </span>
              </label>

              <label class="field">
                <span class="label-text">
                  Team Size Attending <span class="req">*</span>
                </span>
                <select
                  class="webinar-input"
                  v-model="form.team_size"
                  :class="{ 'is-invalid': errors.team_size }"
                  @change="onTeamSizeChange"
                >
                  <option disabled value="">Select</option>
                  <option v-for="opt in teamSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
                </select>
                <span v-if="errors.team_size" class="field-error">{{ errors.team_size }}</span>
              </label>

              <label v-if="showTeamSizeCount" class="field">
                <span class="label-text">Exact Team Count</span>
                <input
                  class="webinar-input"
                  type="number"
                  min="11"
                  step="1"
                  placeholder="e.g. 15"
                  v-model="form.team_size_count"
                  :class="{ 'is-invalid': errors.team_size_count }"
                />
                <span v-if="errors.team_size_count" class="field-error">{{ errors.team_size_count }}</span>
              </label>

              <label class="field">
                <span class="label-text">
                  Phone Number <span class="req">*</span>
                </span>
                <input
                  class="webinar-input"
                  type="tel"
                  placeholder="9876543210"
                  v-model.trim="form.phone_number"
                  :class="{ 'is-invalid': errors.phone_number }"
                />
                <span v-if="errors.phone_number" class="field-error">{{ errors.phone_number }}</span>
              </label>
            </div>

            <div class="actions">
              <button
                type="button"
                class="submit-btn"
                :disabled="submitting"
                @click="submitForm"
              >
                {{ submitting ? "Submitting..." : "Register for Webinar" }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";
import Footer from "@/components/admin-component/Footer.vue";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
const phoneDigitsRegex = /^\d{10}$/;
const DEFAULT_TEAM_SIZE_OPTIONS = ["1", "2-5", "6-10", "10+"];

export default {
  name: "WebinarFormView",
  components: { Header, Footer },
  data() {
    return {
      submitting: false,
      errors: {},
      teamSizeOptions: [...DEFAULT_TEAM_SIZE_OPTIONS],
      form: {
        full_name: "",
        work_email: "",
        job_title: "",
        company_name: "",
        company_website: "",
        company_linkedin: "",
        team_size: "",
        team_size_count: "",
        phone_number: "",
      },
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    showTeamSizeCount() {
      return this.form.team_size === "10+";
    },
  },
  async mounted() {
    await this.loadFormOptions();
  },
  methods: {
    async loadFormOptions() {
      const res = await this.authStore.getWebinarFormOptions();
      if (res.status && Array.isArray(res.team_size_options) && res.team_size_options.length) {
        this.teamSizeOptions = res.team_size_options;
      } else {
        this.teamSizeOptions = [...DEFAULT_TEAM_SIZE_OPTIONS];
      }
    },
    onTeamSizeChange() {
      if (this.form.team_size !== "10+") {
        this.form.team_size_count = "";
        if (this.errors.team_size_count) delete this.errors.team_size_count;
      }
    },
    normalizeUrl(value) {
      const v = (value ?? "").toString().trim();
      if (!v) return "";
      if (/^https?:\/\//i.test(v)) return v;
      return `https://${v}`;
    },
    isValidUrl(value) {
      const raw = (value ?? "").toString().trim();
      if (!raw) return false;
      // Reject path-like values (e.g. /localhost:5173/webinarform)
      if (raw.startsWith("/") || /\s/.test(raw)) return false;

      const hasProtocol = /^https?:\/\//i.test(raw);
      // Without http/https, must look like a domain (example.com) — not localhost:5173/...
      if (!hasProtocol) {
        if (!/^[a-z0-9.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(raw)) return false;
      }

      try {
        const url = new URL(hasProtocol ? raw : `https://${raw}`);
        if (url.protocol !== "http:" && url.protocol !== "https:") return false;
        return Boolean(url.hostname);
      } catch {
        return false;
      }
    },
    showErrorAlert(messages) {
      const list = (Array.isArray(messages) ? messages : [messages])
        .map((m) => String(m || "").trim())
        .filter(Boolean);

      if (!list.length) list.push("Submission failed. Please try again.");

      if (typeof Swal.isVisible === "function" && Swal.isVisible()) {
        Swal.close();
      }

      return Swal.fire({
        icon: "error",
        title: "Submission Failed",
        html: list
          .map((m) => `<div style="margin:6px 0; line-height:1.45;">${m}</div>`)
          .join(""),
        confirmButtonColor: "#0f696e",
      });
    },
    scrollToFirstError() {
      this.$nextTick(() => {
        const el = this.$el.querySelector(".is-invalid");
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    },
    async submitForm() {
      if (this.submitting) return;

      this.errors = {};
      let hasError = false;

      const fullName = this.form.full_name.trim();
      const workEmail = this.form.work_email.trim();
      const jobTitle = this.form.job_title.trim();
      const companyName = this.form.company_name.trim();
      const companyWebsite = this.form.company_website.trim();
      const linkedin = this.form.company_linkedin.trim();
      const teamSize = this.form.team_size;
      const phone = this.form.phone_number.trim();
      const teamSizeCountRaw = this.form.team_size_count;

      if (!fullName) {
        this.errors.full_name = "Full Name is required.";
        hasError = true;
      }

      if (!workEmail) {
        this.errors.work_email = "Work Email is required.";
        hasError = true;
      } else if (!emailRegex.test(workEmail)) {
        this.errors.work_email = "Enter a valid email address.";
        hasError = true;
      }

      if (!jobTitle) {
        this.errors.job_title = "Job Title is required.";
        hasError = true;
      }

      if (!companyName) {
        this.errors.company_name = "Company Name is required.";
        hasError = true;
      }

      if (!companyWebsite) {
        this.errors.company_website = "Company Website is required.";
        hasError = true;
      } else if (!this.isValidUrl(companyWebsite)) {
        this.errors.company_website = "Enter a valid website URL, e.g. https://example.com.";
        hasError = true;
      }

      if (linkedin && !this.isValidUrl(linkedin)) {
        this.errors.company_linkedin = "Enter a valid LinkedIn URL.";
        hasError = true;
      }

      if (!teamSize) {
        this.errors.team_size = "Please select Team Size Attending.";
        hasError = true;
      } else if (!this.teamSizeOptions.includes(teamSize)) {
        this.errors.team_size = "Select a valid team size.";
        hasError = true;
      }

      let teamSizeCount = null;
      if (teamSize === "10+") {
        const raw = String(teamSizeCountRaw ?? "").trim();
        if (raw !== "") {
          const parsed = Number(raw);
          if (Number.isNaN(parsed) || !Number.isInteger(parsed) || parsed < 11) {
            this.errors.team_size_count = "Enter a valid team size count (minimum 11).";
            hasError = true;
          } else {
            teamSizeCount = parsed;
          }
        }
      }

      if (!phone) {
        this.errors.phone_number = "Phone Number is required.";
        hasError = true;
      } else if (!phoneDigitsRegex.test(phone)) {
        this.errors.phone_number = "Phone number must be exactly 10 digits.";
        hasError = true;
      }

      if (hasError) {
        this.scrollToFirstError();
        await this.showErrorAlert(Object.values(this.errors));
        return;
      }

      const payload = {
        full_name: fullName,
        work_email: workEmail,
        job_title: jobTitle,
        company_name: companyName,
        company_website: this.normalizeUrl(companyWebsite),
        company_linkedin: linkedin ? this.normalizeUrl(linkedin) : "",
        team_size: teamSize,
        phone_number: phone,
      };

      if (teamSizeCount !== null) {
        payload.team_size_count = teamSizeCount;
      }

      this.submitting = true;
      try {
        const res = await this.authStore.registerWebinar(payload);
        if (res.status && (res.id || res.message)) {
          this.$router.push("/webinarform-thankyou");
          return;
        }

        const fieldMessages = this.applyApiFieldErrors(res.details);
        if (fieldMessages.length) this.scrollToFirstError();
        await this.showErrorAlert(
          fieldMessages.length
            ? fieldMessages
            : [res.message || "Submission failed. Please try again."],
        );
      } finally {
        this.submitting = false;
      }
    },
    applyApiFieldErrors(data) {
      if (!data || typeof data !== "object") return [];

      const fieldKeys = [
        "full_name",
        "work_email",
        "job_title",
        "company_name",
        "company_website",
        "company_linkedin",
        "team_size",
        "team_size_count",
        "phone_number",
      ];

      const messages = [];
      const pushMsg = (key, text) => {
        const msg = String(text || "").trim();
        if (!msg) return;
        if (key) this.errors[key] = msg;
        if (!messages.includes(msg)) messages.push(msg);
      };

      fieldKeys.forEach((key) => {
        const val = data[key];
        if (!val) return;
        if (Array.isArray(val)) val.forEach((item) => pushMsg(key, item));
        else pushMsg(key, val);
      });

      if (!messages.length) {
        Object.keys(data).forEach((key) => {
          if (["message", "detail", "error", "status", "success"].includes(key)) return;
          const val = data[key];
          if (!val) return;
          if (Array.isArray(val)) val.forEach((item) => pushMsg(null, item));
          else if (typeof val === "string") pushMsg(null, val);
        });
      }

      return messages;
    },
  },
};
</script>

<style scoped>
.webinar-close-btn {
  position: fixed;
  top: 88px;
  right: 24px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748b;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.15s;
}

.webinar-close-btn:hover {
  background: #f8fafc;
  color: #241447;
  border-color: #cbd5e1;
}

.webinar-page {
  min-height: 100vh;
  background: #f8f9fc;
}

.webinar-hero {
  padding: 140px 0 40px;
}

.container {
  width: min(1100px, 92%);
  margin: 0 auto;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.kicker {
  color: #0f696e;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.14em;
  font-weight: 700;
}

.title {
  margin: 0;
  color: #241447;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
}

.desc {
  margin: 0;
  color: #49454f;
  max-width: 720px;
  line-height: 1.65;
  font-size: 14px;
}

.webinar-form-section {
  padding: 0 0 90px;
}

.webinar-form {
  display: grid;
  gap: 22px;
}

.form-card {
  background: #ffffff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 16px 34px rgba(47, 72, 88, 0.06);
  border: 1px solid rgba(203, 196, 208, 0.25);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label-text {
  font-weight: 700;
  color: #49454f;
  font-size: 13px;
}

.req {
  color: #ba1a1a;
  margin-left: 2px;
  font-weight: 800;
}

.webinar-input {
  width: 100%;
  height: 46px;
  background: #f2f3f6;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
  color: #191c1e;
  outline: none;
  transition: box-shadow 0.2s, background 0.2s, border-color 0.2s;
}

select.webinar-input {
  cursor: pointer;
}

.webinar-input:focus {
  background: #ededf8;
  border-color: rgba(36, 20, 71, 0.18);
  box-shadow: 0 0 0 2px rgba(15, 105, 110, 0.15);
}

.webinar-input.is-invalid {
  border-color: rgba(186, 26, 26, 0.55);
  box-shadow: 0 0 0 2px rgba(186, 26, 26, 0.12);
}

.field-error {
  color: #ba1a1a;
  font-size: 12px;
  line-height: 1.2;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 18px;
}

.submit-btn {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 12px 26px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, transform 0.05s;
}

.submit-btn:hover {
  background: #1a0f35;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .webinar-hero {
    padding: 120px 0 30px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: 22px;
  }
}
</style>
