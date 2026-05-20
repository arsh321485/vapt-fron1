<template>
  <RouterView v-slot="{ Component }">
    <keep-alive :include="['AdminDashboardOnboardingView', 'UserDashboard1View']">
      <component :is="Component" />
    </keep-alive>
  </RouterView>
  <HomeSupportChatWidget v-if="showSupportWidget" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "../src/stores/authStore";
import HomeSupportChatWidget from "@/components/home-components/HomeSupportChatWidget.vue";

/** Public marketing / legal / partner pages — floating support widget */
const SUPPORT_WIDGET_PATHS = new Set([
  "/home",
  "/pricingplan",
  "/privacy",
  "/terms",
  "/security",
  "/support",
  "/dpa",
  "/partner",
  "/partner-lead-portal",
]);

export default defineComponent({
  name: "App",
  components: { HomeSupportChatWidget },
  computed: {
    authStore() {
      return useAuthStore();
    },
    showSupportWidget(): boolean {
      return SUPPORT_WIDGET_PATHS.has(this.$route.path);
    },
  },
  watch: {
    // Toggle Tawk.to badge visibility based on current page
    showSupportWidget(newVal) {
      this.toggleTawkBadge(newVal);
    },
  },
  methods: {
    toggleTawkBadge(show: boolean) {
      // Toggle body class to control Tawk.to badge visibility via CSS
      if (show) {
        document.body.classList.remove('hide-tawk-badge');
      } else {
        document.body.classList.add('hide-tawk-badge');
      }
    },
  },
  mounted() {
    const restored = this.authStore.restoreFromStorage();
    console.log("Session restored?", restored);

    // Set initial badge visibility based on current page
    this.toggleTawkBadge(this.showSupportWidget);
  },
});
</script>
