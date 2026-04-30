<template>
  <RouterView v-slot="{ Component }">
    <keep-alive :include="['AdminDashboardOnboardingView', 'UserDashboard1View']">
      <component :is="Component" />
    </keep-alive>
  </RouterView>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "../src/stores/authStore";

export default defineComponent({
  name: "App",
  data() {
    return {
      appSyncTimerId: null as number | null,
      removeAfterEachHook: null as null | (() => void),
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  methods: {
    invalidateRealtimeCaches() {
      const isAuthenticated = localStorage.getItem("authenticated") === "true";
      if (!isAuthenticated) return;
      this.authStore.invalidateUserRealtimeCaches(this.authStore.userLatestReportId || undefined);
      this.authStore.invalidateAdminRealtimeCaches(this.authStore.latestReportId || undefined);
    },
    onAppFocusSync() {
      this.invalidateRealtimeCaches();
    },
    onAppVisibilitySync() {
      if (document.visibilityState === "visible") {
        this.invalidateRealtimeCaches();
      }
    },
    startAppAutoSync() {
      this.stopAppAutoSync();
      this.appSyncTimerId = window.setInterval(() => {
        if (document.visibilityState === "visible") {
          this.invalidateRealtimeCaches();
        }
      }, 10000);
    },
    stopAppAutoSync() {
      if (this.appSyncTimerId) {
        window.clearInterval(this.appSyncTimerId);
        this.appSyncTimerId = null;
      }
    },
  },
  mounted() {
    const restored = this.authStore.restoreFromStorage();
    console.log("Session restored?", restored);
    this.invalidateRealtimeCaches();
    window.addEventListener("focus", this.onAppFocusSync);
    document.addEventListener("visibilitychange", this.onAppVisibilitySync);
    this.startAppAutoSync();
    this.removeAfterEachHook = this.$router.afterEach(() => {
      this.invalidateRealtimeCaches();
    });
  },
  beforeUnmount() {
    this.stopAppAutoSync();
    window.removeEventListener("focus", this.onAppFocusSync);
    document.removeEventListener("visibilitychange", this.onAppVisibilitySync);
    if (this.removeAfterEachHook) {
      this.removeAfterEachHook();
      this.removeAfterEachHook = null;
    }
  },
});
</script>
