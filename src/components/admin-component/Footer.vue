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
                    <!-- <div> -->
                        <img src="@/assets/images/iso-standards/iso1.png" alt="" class="iso-logo me-1">
                        <img src="@/assets/images/iso-standards/iso27001.png" alt="" class="iso-logo me-1">
                        <img src="@/assets/images/iso-standards/iso22301.png" alt="" class="iso-logo me-1">
                        <img src="@/assets/images/iso-standards/iso27017.png" alt="" class="iso-logo me-1">
                        <img src="@/assets/images/iso-standards/iso27701.png" alt="" class="iso-logo me-1">
                    <!-- </div> -->
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

                    <div class="d-flex justify-content-between">
                        <p style="font-size: 13px;">© 2025 Vaptfix. Engineered and designed worldwide. All rights reserved.</p>
                        <p style="font-size: 13px;">Terms of use</p>
                        <p style="font-size: 13px;">Privacy Policy</p>
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
</style>
