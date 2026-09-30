<template>
  <div class="legal-page-root">
    <Header />

    <div class="legal-page-frame">
      <div class="ld-simple-inner">
        <div class="ld-doc-header">
          <div class="ld-doc-tag">Legal</div>
          <h1 class="ld-doc-title">Sub-processors</h1>
          <p class="ld-doc-meta">Last updated: September 30, 2026</p>
        </div>

        <div class="ld-scroll">
        <p class="sp-lead">
          VAPTFIX uses the third-party service providers listed below (sub-processors) to deliver its services.
          Each sub-processor processes customer data only as needed to provide its service to VAPTFIX.
        </p>

        <div class="sp-table-wrap">
          <table class="sp-table">
            <thead>
              <tr>
                <th scope="col">Sub-processor</th>
                <th scope="col">Data processed</th>
                <th scope="col">Location</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Contabo GmbH</td>
                <td>All data stored on the VAPTFIX platform, including account data, assessment data, and logs</td>
                <td><span class="sp-verify">Server region to confirm</span></td>
              </tr>
              <tr>
                <td>MongoDB Inc. (MongoDB Atlas)</td>
                <td>Account data, operational metadata, and assessment data</td>
                <td><span class="sp-verify">Cluster region to confirm</span></td>
              </tr>
              <tr>
                <td>Twilio Inc. (SendGrid)</td>
                <td>Name, email address, and the content of emails sent by VAPTFIX, such as notifications and password resets</td>
                <td><span class="sp-verify">Region to confirm</span></td>
              </tr>
              <tr>
                <td>Stripe, Inc.</td>
                <td>Billing name, email address, and payment details. VAPTFIX does not store full card numbers.</td>
                <td><span class="sp-verify">Region to confirm</span></td>
              </tr>
              <tr>
                <td>OpenAI, L.L.C.</td>
                <td><span class="sp-verify">Exact data sent, such as vulnerability findings, to confirm</span></td>
                <td><span class="sp-verify">Region to confirm</span></td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="sp-note">
          Keep the MongoDB Atlas row only if assessment data is hosted by MongoDB Inc. If MongoDB runs on the Contabo server, that row should be removed before this list is treated as final.
        </p>

        <h2>Changes to sub-processors</h2>
        <p>
          When VAPTFIX adds or replaces a sub-processor, this page is updated and the date above is changed.
          Customers receive at least 14 days’ email notice before a new sub-processor is added or an existing one is replaced.
          The same commitment is in the <router-link to="/dpa">Data Processing Agreement</router-link>.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about sub-processors can be sent to
          <a href="mailto:security@vaptfix.ai">security@vaptfix.ai</a>.
        </p>

        <LegalDocInnerFooter />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import LegalDocInnerFooter from '@/components/admin-component/LegalDocInnerFooter.vue';

export default {
  name: 'SubProcessorsView',
  components: { Header, LegalDocInnerFooter },
  mounted() {
    document.title = 'Sub-processors | VAPTFIX';
    document.documentElement.classList.add('legal-doc-sticky-context');
  },
  beforeUnmount() {
    document.documentElement.classList.remove('legal-doc-sticky-context');
  },
};
</script>

<style scoped>
.legal-page-root {
  min-height: 100vh;
  padding-top: 72px;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  box-sizing: border-box;
}

.legal-page-frame {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 24px);
  box-sizing: border-box;
}

.ld-simple-inner {
  width: 100%;
  margin: 0;
  padding: 1.25rem 0 0;
  font-family: 'Inter', sans-serif;
  color: #1f2a37;
  font-size: 16px;
  line-height: 1.65;
}

.ld-doc-header {
  position: relative;
  z-index: 2;
  margin: 0;
  padding: 0 0 1rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.15);
  background: #ffffff;
}

.ld-scroll {
  position: relative;
  z-index: 1;
  padding-top: 1.25rem;
}

.ld-doc-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.1);
  border: 1px solid rgba(15, 105, 110, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.ld-doc-tag::before {
  content: '●';
  font-size: 7px;
}

.ld-doc-title {
  font-size: clamp(2rem, 4vw, 3.1rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.15;
  margin: 0 0 0.75rem;
}

.ld-doc-meta {
  margin: 0;
  font-size: 15px;
  color: #49454f;
}

.sp-lead,
.ld-simple-inner p,
.ld-simple-inner h2 {
  position: relative;
  z-index: 1;
}

.sp-lead {
  margin: 0 0 1.5rem;
  color: #49454f;
}

.ld-simple-inner h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #241447;
  margin: 2.5rem 0 0.75rem;
}

.ld-simple-inner p {
  margin: 0 0 1rem;
  color: #49454f;
}

.ld-simple-inner a {
  color: #0f696e;
  font-weight: 600;
  text-decoration: none;
}

.ld-simple-inner a:hover {
  text-decoration: underline;
}

.sp-table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(15, 105, 110, 0.12);
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(36, 20, 71, 0.04);
}

.sp-table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 15px;
}

.sp-table th {
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #0f696e;
  padding: 14px 16px;
  background: #f6f4fa;
  border-bottom: 1px solid rgba(15, 105, 110, 0.12);
}

.sp-table td {
  text-align: left;
  vertical-align: top;
  padding: 16px;
  border-bottom: 1px solid rgba(15, 105, 110, 0.1);
  color: #334155;
  line-height: 1.55;
}

.sp-table tr:last-child td {
  border-bottom: none;
}

.sp-table td:first-child {
  font-weight: 600;
  color: #241447;
  white-space: nowrap;
}

.sp-table tbody tr:hover td {
  background: rgba(15, 105, 110, 0.03);
}

.sp-verify {
  display: inline;
  background: #fff6d8;
  color: #7a5a00;
  border-radius: 4px;
  padding: 1px 6px;
  font-weight: 600;
}

.sp-note {
  margin-top: 0.85rem !important;
  font-size: 14px;
  color: #64748b !important;
}

@media (min-width: 769px) {
  .legal-page-root {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .legal-page-frame {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ld-simple-inner {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ld-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
  }

  .ld-scroll::-webkit-scrollbar {
    width: 0;
    height: 0;
    display: none;
  }
}
</style>
