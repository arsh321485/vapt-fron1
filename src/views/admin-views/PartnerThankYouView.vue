<template>
  <main class="partner-thankyou-shell">
    <Header />
    <iframe
      ref="thankyouFrame"
      class="partner-thankyou-frame"
      title="Partner Application Thank You"
      :srcdoc="thankYouHtml"
      scrolling="no"
      @load="resizeFrame"
    ></iframe>
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";

export default {
  name: "PartnerThankYouView",
  components: { Header },
  data() {
    return {
      thankYouHtml: `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&amp;family=Inter:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "tertiary-container": "#333434",
        "secondary-fixed": "#a4eff4",
        "primary-fixed-dim": "#d1bdfb",
        "tertiary-fixed": "#e3e2e2",
        "surface-variant": "#e1e2e5",
        "on-tertiary": "#ffffff",
        "primary-container": "#3a2a5e",
        "outline": "#7a7580",
        "on-surface": "#191c1e",
        "inverse-primary": "#d1bdfb",
        "on-primary-fixed-variant": "#4e3e73",
        "secondary-container": "#a1ecf2",
        "on-tertiary-fixed-variant": "#464747",
        "on-tertiary-fixed": "#1b1c1c",
        "on-secondary-fixed": "#002022",
        "error-container": "#ffdad6",
        "surface-bright": "#f8f9fc",
        "primary": "#241447",
        "surface-container-lowest": "#ffffff",
        "background": "#f8f9fc",
        "on-secondary-fixed-variant": "#004f53",
        "on-secondary-container": "#176d72",
        "surface": "#f8f9fc",
        "on-error": "#ffffff",
        "on-primary-container": "#a592ce",
        "tertiary-fixed-dim": "#c7c6c6",
        "surface-tint": "#66558c",
        "surface-container": "#edeef1",
        "inverse-on-surface": "#f0f1f4",
        "error": "#ba1a1a",
        "surface-container-low": "#f2f3f6",
        "secondary-fixed-dim": "#88d3d8",
        "on-error-container": "#93000a",
        "surface-dim": "#d9dadd",
        "inverse-surface": "#2e3133",
        "outline-variant": "#cbc4d0",
        "surface-container-highest": "#e1e2e5",
        "secondary": "#0f696e",
        "on-secondary": "#ffffff",
        "on-background": "#191c1e",
        "surface-container-high": "#e7e8eb",
        "on-surface-variant": "#49454f",
        "on-primary": "#ffffff",
        "tertiary": "#1e1f1f",
        "primary-fixed": "#eaddff",
        "on-primary-fixed": "#211044"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      fontFamily: { headline: ["Manrope"], body: ["Inter"], label: ["Inter"] }
    }
  }
};
<\/script>
<style>
  .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  body { font-family: 'Inter', sans-serif; }
  h1, h2, h3 { font-family: 'Manrope', sans-serif; }
  html, body { overflow: hidden; }
</style>
</head>
<body class="bg-background text-on-surface flex flex-col min-h-screen">
<main class="flex-grow flex items-center justify-center px-6 py-12 relative overflow-hidden">
  <div class="absolute top-0 right-0 w-1/3 h-full bg-surface-container-low -skew-x-12 transform translate-x-1/2 pointer-events-none"></div>
  <div class="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none"></div>

  <div class="max-w-3xl w-full relative z-10 text-center">
    <div class="mb-12 relative inline-block group">
      <div class="absolute inset-0 bg-secondary-container/40 rounded-full blur-2xl scale-110 opacity-50 group-hover:opacity-80 transition-opacity"></div>
      <div class="relative w-48 h-48 md:w-64 md:h-64 mx-auto bg-surface-container-lowest rounded-full flex items-center justify-center shadow-xl shadow-on-surface/5">
        <img
          alt="professional handshake representing a successful partnership agreement"
          class="w-40 h-40 md:w-56 md:h-56 object-cover rounded-full"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT2Epr0XceFXQFbB-EQhiIIiVdAwS4VO4H4TL2eT_upJjf7Q-pSepLLMMYUnzeLJa6wB5MyMNumgvkzRz1I7Lpyp9IeLRgeq0CFXrnPH3RFYIVg-enUMKEsIHlGQqyTUjjVk3q5x8hAsmexfXgvQ0NfALJrN7SwvLzStY4WG8xsAl2UIF64JniQBAJZnSIi2kXFtCrnj_EhBt61jMDTuPtF4EPARYlR_oLs0JgBMOdaXU8V-SM4nFoKX1WTmk3MrqIRqaK5-WWpnZJ"
        />
        <div class="absolute -bottom-2 -right-2 bg-secondary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-surface">
          <span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="inline-flex items-center px-4 py-1.5 rounded-sm bg-secondary-container text-on-secondary-container text-[0.6875rem] font-bold tracking-wider uppercase">
        Application Received
      </div>
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-primary tracking-tight font-headline">
        Thank you for applying.
      </h1>
      <p class="text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed font-body">
        Our partnerships team will review your application and contact you shortly to discuss how
        <span class="text-secondary font-semibold">VaptFix Pro</span> can accelerate your security services.
      </p>
    </div>

    <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
      <a class="group relative bg-primary text-on-primary px-10 py-4 rounded-full font-bold text-sm tracking-wide shadow-lg hover:shadow-primary/20 transition-all active:scale-95 flex items-center gap-2" href="/home" target="_top">
        Return to Home Page
        <span class="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
      </a>
      <a class="px-8 py-4 rounded-full font-semibold text-sm text-secondary border border-outline-variant/30 hover:bg-surface-container transition-colors" href="/partner" target="_top">
        View Partner Perks
      </a>
    </div>

    <div class="mt-20 pt-10 border-t border-outline-variant/10 flex flex-col items-center">
      <span class="text-[0.6875rem] text-outline uppercase tracking-[0.2em] mb-6 font-bold">Onboarding Process</span>
      <div class="flex items-center gap-2 w-full max-w-sm">
        <div class="h-1.5 flex-1 bg-secondary rounded-full"></div>
        <div class="h-1.5 flex-1 bg-secondary rounded-full"></div>
        <div class="h-1.5 flex-1 bg-surface-container-highest rounded-full"></div>
      </div>
      <div class="flex justify-between w-full max-w-sm mt-3 px-1 text-[0.6875rem] font-semibold text-on-surface-variant">
        <span class="text-secondary">Submitted</span>
        <span class="text-secondary">Review</span>
        <span class="opacity-40">Activation</span>
      </div>
    </div>
  </div>
</main>
</body></html>`,
    };
  },
  mounted() {
    window.addEventListener("resize", this.resizeFrame);
    setTimeout(this.resizeFrame, 120);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.resizeFrame);
  },
  methods: {
    resizeFrame() {
      const iframe = this.$refs.thankyouFrame;
      if (!iframe) return;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;
      const nextHeight = Math.max(
        doc.body?.scrollHeight || 0,
        doc.documentElement?.scrollHeight || 0,
        900
      );
      iframe.style.height = `${nextHeight}px`;
    },
  },
};
</script>

<style scoped>
.partner-thankyou-shell {
  min-height: 100vh;
  background: #f8f9fc;
}

.partner-thankyou-frame {
  width: 100%;
  min-height: 900px;
  margin-top: 70px;
  border: 0;
  display: block;
  overflow: hidden;
}
</style>

