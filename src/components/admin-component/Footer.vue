<template>
    <main>
    <!-- footer -->
     <section class="footer fluid-padding">
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-lg-5 col-md-6 text-white">
                     <router-link :to="appHomePath">
                       <img src="@/assets/images/vaptfix_white.png" alt="logo" width="90" height="30" style="cursor: pointer; height: auto;">
                     </router-link>
                    <p class="mt-4 mb-0">Eliminate Vulnerabilities Before They<br> Become Threats.</p>
                </div>
                <div class="col-12">
                    <div class="footer-bottom-row">
                        <div class="footer-copyright">
                            <p class="footer-entity mb-0">VAPTFIX.ai is a product of Secureitabservices Inc, a Delaware corporation.</p>
                            <p class="footer-copy mb-0">© 2026 VAPTFIX.ai. All rights reserved.</p>
                        </div>
                        <ul class="list-unstyled mb-0 footer-legal-links">
                            <li>
                                <router-link to="/privacy" class="footer-legal-link text-decoration-none">Privacy</router-link>
                            </li>
                            <li>
                                <router-link to="/terms" class="footer-legal-link text-decoration-none">Terms</router-link>
                            </li>
                            <li>
                                <router-link to="/support" class="footer-legal-link text-decoration-none">Support</router-link>
                            </li>
                            <li>
                                <router-link to="/dpa" class="footer-legal-link text-decoration-none">DPA</router-link>
                            </li>
                            <li>
                                <router-link to="/sub-processors" class="footer-legal-link text-decoration-none">Sub-processors</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
     </section>
    </main>
</template>

<script>
import { getAuthenticatedAppHome } from "@/utils/authenticatedHome";

export default {
  name: 'Footer',
  computed: {
    appHomePath() {
      return getAuthenticatedAppHome(this.$route?.path || '/home');
    },
  },
};
</script>

<style scoped>
.footer {
  padding-top: 40px !important;
}

.footer-bottom-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-top: 1.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.footer-copyright {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  color: rgba(255, 255, 255, 0.7);
  flex: 1 1 320px;
  min-width: 0;
  line-height: 1.5;
}

.footer-entity,
.footer-copy {
  display: block;
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.footer-legal-links {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  gap: 1.25rem;
  margin: 0;
  padding: 0 72px 0 0;
}

.footer-legal-link {
  color: #ffffff;
  font-size: 13px;
  white-space: nowrap;
}

.footer-legal-link:hover {
  text-decoration: underline !important;
  color: #ffffff;
}

@media (max-width: 767px) {
  .footer-legal-links {
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-right: 0;
  }
}
</style>
