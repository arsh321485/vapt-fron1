<template>
    <main>
    <!-- footer -->
     <section class="footer fluid-padding">
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-lg-5 col-md-6 text-white">
                     <router-link to="/home">
                       <img src="@/assets/images/vaptfix_white.png" alt="logo" style="cursor: pointer; height: 38px;">
                     </router-link>
                    <p class="mt-4">Eliminate Vulnerabilities Before They<br> Become Threats.</p>
                    <div class="footer-iso-badges">
                        <img src="@/assets/images/iso-standards/iso1.png" alt="AICPA SOC" class="iso-logo">
                        <img src="@/assets/images/iso-standards/iso27001.png" alt="ISO 27001 certified" class="iso-logo">
                        <img src="@/assets/images/iso-standards/iso22301.png" alt="ISO 22301 certified" class="iso-logo">
                        <img src="@/assets/images/iso-standards/iso27017.png" alt="ISO 27017 certified" class="iso-logo">
                        <img src="@/assets/images/iso-standards/iso27701.png" alt="ISO 27701 certified" class="iso-logo">
                    </div>
                </div>
                <div class="col-lg-7 col-md-6 text-white d-flex flex-column justify-content-end">
                    <div>
                        <ul class="d-flex justify-content-between list-unstyled footer-nav-links">
                            <li class="footer-partners-group">
                                <span class="footer-link-title">Partners</span>
                                <ul class="list-unstyled footer-partners-submenu mt-2">
                                    <li>
                                        <router-link to="/partner" class="footer-sub-link text-decoration-none">
                                            Partner Registration
                                        </router-link>
                                    </li>
                                    <li>
                                        <router-link to="/partner-lead-portal" class="footer-sub-link text-decoration-none">
                                            Lead Registration
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <router-link to="/pricingplan" style="text-decoration: none; color: #ffffff;">Pricing</router-link>
                            </li>
                            <li>Features</li>
                        </ul>
                    </div>

                    <div class="footer-bottom-row">
                        <p class="footer-copyright mb-0">
                            © 2026 VaptFix.ai. All rights reserved.
                        </p>
                        <ul class="list-unstyled mb-0 footer-legal-links">
                            <li>
                                <router-link to="/privacy" class="footer-legal-link text-decoration-none">Privacy</router-link>
                            </li>
                            <li>
                                <router-link to="/terms" class="footer-legal-link text-decoration-none">Terms</router-link>
                            </li>
                            <li>
                                <router-link to="/security" class="footer-legal-link text-decoration-none">Security</router-link>
                            </li>
                            <li>
                                <router-link to="/support" class="footer-legal-link text-decoration-none">Support</router-link>
                            </li>
                            <li>
                                <router-link to="/dpa" class="footer-legal-link text-decoration-none">DPA</router-link>
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
export default {
  name: 'Footer',
};
</script>

<style scoped>
.footer {
  padding-top: 40px !important;
}

.footer-nav-links {
  align-items: flex-start;
}

.footer-link-title {
  font-weight: 500;
}

.footer-partners-submenu {
  display: grid;
  gap: 10px;
}

.footer-sub-link {
  color: #ffffff;
  font-size: 14px;
}

.footer-sub-link:hover {
  text-decoration: underline !important;
}

.footer-bottom-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.footer-copyright {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  flex: 1 1 220px;
  min-width: 0;
}

.footer-legal-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem 1.5rem;
}

@media (min-width: 768px) {
  .footer-legal-links {
    justify-content: flex-end;
    flex: 0 1 auto;
  }
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

.footer-iso-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 0.65rem;
  margin-top: 1.25rem;
}
</style>
