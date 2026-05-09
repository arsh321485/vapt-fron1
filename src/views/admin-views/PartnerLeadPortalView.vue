<template>
  <main class="lead-portal-shell">
    <Header />
    <iframe
      ref="portalFrame"
      class="lead-portal-frame"
      title="Partner Lead Portal"
      :srcdoc="portalHtml"
      scrolling="no"
      @load="resizeFrame"
    ></iframe>
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
      portalHtml: `<!DOCTYPE html>
<html class="light" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"><\/script>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&amp;family=Inter:wght@400;500;600&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script>
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: "#f8f9fc",
        "surface-container": "#edeef1",
        "tertiary-container": "#333434",
        "surface-variant": "#e1e2e5",
        "on-secondary-fixed-variant": "#004f53",
        "tertiary-fixed": "#e3e2e2",
        "on-tertiary-fixed": "#1b1c1c",
        "on-error-container": "#93000a",
        "on-tertiary-fixed-variant": "#464747",
        "secondary-container": "#a1ecf2",
        "surface-dim": "#d9dadd",
        "primary-container": "#3a2a5e",
        primary: "#241447",
        "error-container": "#ffdad6",
        "surface-container-lowest": "#ffffff",
        tertiary: "#1e1f1f",
        secondary: "#0f696e",
        "tertiary-fixed-dim": "#c7c6c6",
        "secondary-fixed": "#a4eff4",
        "on-primary-fixed": "#211044",
        "on-primary-container": "#a592ce",
        "primary-fixed": "#eaddff",
        "on-secondary-fixed": "#002022",
        outline: "#7a7580",
        "on-secondary-container": "#176d72",
        "inverse-surface": "#2e3133",
        "on-primary-fixed-variant": "#4e3e73",
        "surface-container-high": "#e7e8eb",
        "primary-fixed-dim": "#d1bdfb",
        "surface-container-highest": "#e1e2e5",
        "outline-variant": "#cbc4d0",
        "inverse-primary": "#d1bdfb",
        error: "#ba1a1a",
        "surface-container-low": "#f2f3f6",
        "on-surface": "#191c1e",
        "secondary-fixed-dim": "#88d3d8",
        "on-primary": "#ffffff",
        "on-tertiary-container": "#9d9c9c",
        "on-error": "#ffffff",
        "surface-bright": "#f8f9fc",
        "inverse-on-surface": "#f0f1f4",
        "on-secondary": "#ffffff",
        background: "#f8f9fc",
        "on-background": "#191c1e",
        "on-surface-variant": "#49454f",
        "surface-tint": "#66558c",
        "on-tertiary": "#ffffff"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      fontFamily: { headline: ["Manrope"], body: ["Inter"], label: ["Inter"] }
    }
  }
};
<\/script>
<style>
html, body { overflow: hidden; }
body { font-family: 'Inter', sans-serif; }
.font-headline { font-family: 'Manrope', sans-serif; }
.material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
.form-input-focus:focus { outline: none; box-shadow: 0 0 0 2px #a1ecf2; border-color: #0f696e; }
</style>
</head>
<body class="bg-surface text-on-surface">
<main class="max-w-7xl mx-auto px-8 py-12 md:py-20">
<header class="mb-16 max-w-2xl">
<span class="text-secondary font-headline font-bold tracking-widest text-xs uppercase mb-4 block">Strategic Expansion</span>
<h1 class="text-5xl md:text-6xl font-headline font-extrabold text-primary leading-tight mb-6">Lead Registration </h1>
<p class="text-on-surface-variant text-lg leading-relaxed">Submit your high-intent prospects into our Intelligence Framework. Accelerated validation and specialist support await.</p>
</header>
<form class="space-y-12" action="/partner-lead-thankyou" method="get" target="_top">
<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
<div class="md:col-span-4">
<h2 class="text-2xl font-headline font-bold text-primary mb-2">Partner Information</h2>
<p class="text-on-surface-variant text-sm">Your organizational details for commission tracking and collaboration.</p>
</div>
<div class="md:col-span-8 bg-surface-container-low rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Partner Company Name</label><input class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Global Cyber Solutions Inc." type="text"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Partner Contact Name</label><input class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Jane Doe" type="text"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Partner Contact Email</label><input class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="jane@example.com" type="email"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Partner Contact Phone</label><input class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="+1 (555) 000-0000" type="tel"/></div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-12">
<div class="md:col-span-4">
<h2 class="text-2xl font-headline font-bold text-primary mb-2">Lead Information</h2>
<p class="text-on-surface-variant text-sm">Core details about the prospective organization and decision maker.</p>
</div>
<div class="md:col-span-8 bg-surface-container-lowest shadow-sm rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
<div class="absolute top-0 right-0 w-32 h-32 bg-secondary-container opacity-10 rounded-bl-full pointer-events-none"></div>
<div class="flex flex-col gap-2 md:col-span-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Company Name</label><input class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Enterprise Logic Corp" type="text"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Contact Name</label><input class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Robert Smith" type="text"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Job Title</label><input class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Chief Information Security Officer" type="text"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Email</label><input class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="r.smith@enterprise.com" type="email"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Phone</label><input class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="+44 20 7946 0000" type="tel"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Website</label><input class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="https://www.enterprise-logic.com" type="url"/></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Country</label><select class="bg-surface-container-low border-none rounded-lg p-3 text-sm form-input-focus transition-all appearance-none"><option>United States</option><option>United Kingdom</option><option>Germany</option><option>Singapore</option></select></div>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-12">
<div class="md:col-span-4"><h2 class="text-2xl font-headline font-bold text-primary mb-2">Opportunity Details</h2><p class="text-on-surface-variant text-sm">Quantifying the engagement and defining the specific security need.</p></div>
<div class="md:col-span-8 bg-surface-container-low rounded-xl p-8 space-y-6">
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Product or Service of Interest</label><select class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all"><option>Continuous Pentesting</option><option>Compliance Automation</option><option>Vulnerability Intelligence</option><option>Full Suite Pro</option></select></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Lead Status</label><div class="flex flex-wrap gap-2 pt-1"><span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-xs font-bold uppercase">New</span><span class="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded text-xs font-bold uppercase">Contacted</span><span class="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded text-xs font-bold uppercase">Qualified</span><span class="bg-surface-container-highest text-on-surface-variant px-3 py-1 rounded text-xs font-bold uppercase">Proposal Sent</span></div></div>
</div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Use Case / Need</label><textarea class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Describe the specific problem or regulatory requirement driving this interest..." rows="3"></textarea></div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Estimated Deal Value</label><div class="relative"><span class="absolute left-3 top-3 text-on-surface-variant">$</span><input class="w-full pl-8 bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="50,000" type="number"/></div></div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Expected Close Date</label><input class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" type="date"/></div>
</div>
<div class="flex flex-col gap-2"><label class="text-label-sm font-bold text-tertiary uppercase tracking-wider">Notes</label><textarea class="bg-surface-container-lowest border-none rounded-lg p-3 text-sm form-input-focus transition-all" placeholder="Any additional context for the sales team..." rows="2"></textarea></div>
</div>
</div>
<div class="pt-8 border-t border-outline-variant/20 flex flex-col items-center max-w-3xl mx-auto space-y-8">
<div class="space-y-4 w-full">
<label class="flex items-start gap-4 cursor-pointer group"><div class="mt-1 relative flex items-center justify-center"><input class="peer appearance-none w-5 h-5 border-2 border-outline rounded-sm checked:bg-secondary checked:border-secondary transition-all" type="checkbox"/><span class="material-symbols-outlined absolute text-white scale-0 peer-checked:scale-100 transition-transform text-sm font-bold">check</span></div><span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">I confirm this lead information is accurate to the best of my knowledge and represents a genuine interest.</span></label>
<label class="flex items-start gap-4 cursor-pointer group"><div class="mt-1 relative flex items-center justify-center"><input class="peer appearance-none w-5 h-5 border-2 border-outline rounded-sm checked:bg-secondary checked:border-secondary transition-all" type="checkbox"/><span class="material-symbols-outlined absolute text-white scale-0 peer-checked:scale-100 transition-transform text-sm font-bold">check</span></div><span class="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">I agree to the VaptFix Pro registration terms, including lead protection periods and revenue sharing agreements.</span></label>
</div>
<div class="pt-6 w-full flex flex-col md:flex-row items-center justify-center gap-6">
<button class="w-full md:w-auto bg-primary text-on-primary px-12 py-4 rounded-full font-headline font-black text-lg shadow-lg hover:shadow-primary/20 transition-all active:scale-95" type="submit">Register Lead</button>
<p class="text-label-sm text-on-surface-variant max-w-xs text-center md:text-left">By clicking Register Lead, you initiate the intelligence validation workflow.</p>
</div>
</div>
</form>
</main>
<footer style="display:none;" class="bg-[#241447] w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5">
<div class="flex flex-col items-center md:items-start gap-2"><div class="text-lg font-bold text-white font-headline">VaptFix Pro</div><p class="font-['Inter'] text-xs font-medium text-slate-300">© 2024 VaptFix Pro. Editorial Intelligence Framework.</p></div>
<div class="flex flex-wrap justify-center gap-6">
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Privacy Policy</a>
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Terms of Service</a>
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Security Audit</a>
<a class="font-['Inter'] text-xs font-medium text-slate-300 hover:text-[#a1ecf2] transition-colors" href="#">Contact Specialist</a>
</div>
<div class="flex gap-4"><span class="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white transition-colors">share</span><span class="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white transition-colors">hub</span><span class="material-symbols-outlined text-slate-400 cursor-pointer hover:text-white transition-colors">security</span></div>
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
      const iframe = this.$refs.portalFrame;
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
.lead-portal-shell {
  min-height: 100vh;
  background: #f8f9fc;
}

.lead-portal-frame {
  width: 100%;
  min-height: 900px;
  margin-top: 70px;
  border: 0;
  display: block;
  overflow: hidden;
}
</style>
