<template>
    <main>
    <!-- footer -->
     <section class="footer fluid-padding">
        <div class="container-fluid py-4">
            <div class="row">
                <div class="col-lg-5 col-md-6 text-white">
                     <img src="@/assets/images/logo1.png"  alt="logo">
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
                        <ul class="d-flex justify-content-between list-unstyled">
                            <router-link to="/vulnerabilityexplorer" style="text-decoration: none;"><li>Vulnerability Explorer</li></router-link>
                            <li>Partners</li>
                            <!-- <li>Pricing</li> -->
                             <router-link to="/pricingplan" style="text-decoration: none;"><li>Pricing</li></router-link>
                            <li>Features</li>
                            <!-- <li>Insights</li> -->
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



