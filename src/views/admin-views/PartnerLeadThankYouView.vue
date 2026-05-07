<template>
  <main class="lead-thankyou-shell">
    <Header />
    <iframe
      ref="thankyouFrame"
      class="lead-thankyou-frame"
      title="Partner Lead Thank You"
      :srcdoc="thankYouHtml"
      scrolling="no"
      @load="resizeFrame"
    ></iframe>
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";

export default {
  name: "PartnerLeadThankYouView",
  components: { Header },
  data() {
    return {
      thankYouHtml: `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&amp;family=Inter:wght@400;500;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#f8f9fc", "surface-container": "#edeef1", "tertiary-container": "#333434", "surface-variant": "#e1e2e5",
        "on-secondary-fixed-variant": "#004f53", "tertiary-fixed": "#e3e2e2", "on-tertiary-fixed": "#1b1c1c",
        "on-error-container": "#93000a", "on-tertiary-fixed-variant": "#464747", "secondary-container": "#a1ecf2",
        "surface-dim": "#d9dadd", "primary-container": "#3a2a5e", primary: "#241447", "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff", tertiary: "#1e1f1f", secondary: "#0f696e", "tertiary-fixed-dim": "#c7c6c6",
        "secondary-fixed": "#a4eff4", "on-primary-fixed": "#211044", "on-primary-container": "#a592ce", "primary-fixed": "#eaddff",
        "on-secondary-fixed": "#002022", outline: "#7a7580", "on-secondary-container": "#176d72", "inverse-surface": "#2e3133",
        "on-primary-fixed-variant": "#4e3e73", "surface-container-high": "#e7e8eb", "primary-fixed-dim": "#d1bdfb",
        "surface-container-highest": "#e1e2e5", "outline-variant": "#cbc4d0", "inverse-primary": "#d1bdfb", error: "#ba1a1a",
        "surface-container-low": "#f2f3f6", "on-surface": "#191c1e", "secondary-fixed-dim": "#88d3d8", "on-primary": "#ffffff",
        "on-tertiary-container": "#9d9c9c", "on-error": "#ffffff", "surface-bright": "#f8f9fc", "inverse-on-surface": "#f0f1f4",
        "on-secondary": "#ffffff", background: "#f8f9fc", "on-background": "#191c1e", "on-surface-variant": "#49454f",
        "surface-tint": "#66558c", "on-tertiary": "#ffffff"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      fontFamily: { headline: ["Manrope"], body: ["Inter"], label: ["Inter"] }
    }
  }
};
<\/script>
<style>
html, body { overflow: hidden; }
.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.editorial-shadow { box-shadow: 0 20px 40px -10px rgba(25, 28, 30, 0.06); }
</style>
</head>
<body class="bg-surface font-body text-on-surface antialiased">
<main class="min-h-[716px] flex flex-col items-center justify-center px-4 py-20 bg-surface">
<div class="max-w-3xl w-full text-center space-y-12">
<div class="relative inline-block mb-8">
<div class="absolute -inset-4 bg-secondary-container rounded-full opacity-30 blur-2xl"></div>
<div class="relative bg-surface-container-lowest editorial-shadow rounded-full p-8 flex items-center justify-center w-32 h-32 mx-auto">
<span class="material-symbols-outlined text-secondary text-6xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
</div>
</div>
<div class="space-y-4">
<h1 class="font-headline font-extrabold text-5xl md:text-6xl text-primary tracking-tight">Thank you.</h1>
<p class="font-body text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed">Your lead has been registered and sent to our team for review.</p>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 text-left">
<div class="bg-surface-container-low p-8 rounded-xl space-y-3">
<div class="flex items-center gap-3 text-secondary"><span class="material-symbols-outlined">timeline</span><span class="font-headline font-bold text-sm uppercase tracking-wider">Next Step</span></div>
<h3 class="font-headline font-bold text-xl text-primary">Initial Validation</h3>
<p class="text-sm text-on-surface-variant">Our compliance specialists will review the lead profile within 24 business hours.</p>
</div>
<div class="bg-surface-container-low p-8 rounded-xl space-y-3">
<div class="flex items-center gap-3 text-secondary"><span class="material-symbols-outlined">notifications_active</span><span class="font-headline font-bold text-sm uppercase tracking-wider">Updates</span></div>
<h3 class="font-headline font-bold text-xl text-primary">Status Tracking</h3>
<p class="text-sm text-on-surface-variant">You will receive an email notification as soon as the lead status moves to 'Qualified'.</p>
</div>
</div>
<div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
<button class="w-full sm:w-auto bg-primary text-on-primary px-10 py-4 rounded-full font-headline font-bold text-lg hover:bg-primary-container transition-all scale-95 active:opacity-80" type="button" onclick="window.top.location.href='/home'">Return to Dashboard</button>
<button class="w-full sm:w-auto bg-transparent text-secondary border border-outline-variant/30 px-10 py-4 rounded-full font-headline font-bold text-lg hover:bg-secondary-container transition-all" type="button" onclick="window.top.location.href='/partner-lead-portal'">Register Another Lead</button>
</div>
</div>
<div class="absolute top-0 right-0 -z-10 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
<img class="w-[800px] h-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj4WSzz3pkjIynokSsr-Bw5SfybDnoWzAh8am_8yX8zWHzdAfOzMoARusr7ZwhrJvA3IotrrUJe0mhmQYD8g_MTPnha21QW58D-yrKtQjEJHJilp2PFx16ykH0znif4EgdrSlZtLF6ju_IIOk6pJ4ng6zm80z24ftSmOjd2bOVpaB1UARAyVY1k22KIfKzULLxb4VYTCCbjwczTG9Mgw88cWey9wnpQDqUsSP6y3zthkJ1xTbww_ZpT_Y1pP0sB4EJUMVRdHgJWTT0"/>
</div>
</main>
<footer class="bg-[#241447] w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6">
<div class="text-lg font-bold text-white font-['Inter']">VaptFix Pro</div>
<div class="flex flex-wrap justify-center gap-6">
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Security Audit</a>
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Contact Specialist</a>
</div>
<div class="font-['Inter'] text-xs font-medium text-[#f8f9fc] opacity-90">© 2024 VaptFix Pro. Editorial Intelligence Framework.</div>
</footer>
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
        760
      );
      iframe.style.height = `${nextHeight}px`;
    },
  },
};
</script>

<style scoped>
.lead-thankyou-shell {
  min-height: 100vh;
  background: #f8f9fc;
}

.lead-thankyou-frame {
  width: 100%;
  min-height: 760px;
  margin-top: 70px;
  border: 0;
  display: block;
  overflow: hidden;
}
</style>
