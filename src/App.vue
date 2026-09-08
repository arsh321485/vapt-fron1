<template>
  <RouterView v-slot="{ Component }">
    <ErrorBoundary>
      <keep-alive :include="['AdminDashboardOnboardingView', 'UserDashboard1View']">
        <component :is="Component" />
      </keep-alive>
    </ErrorBoundary>
  </RouterView>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useAuthStore } from "../src/stores/authStore";
import ErrorBoundary from "./components/common/ErrorBoundary.vue";

export default defineComponent({
  name: "App",
  components: { ErrorBoundary },
  computed: {
    authStore() {
      return useAuthStore();
    },
  },
  mounted() {
    try {
      const restored = this.authStore.restoreFromStorage();
      console.log("Session restored?", restored);
    } catch (e) {
      console.error("Session restore failed", e);
    }
  },
});
</script>
