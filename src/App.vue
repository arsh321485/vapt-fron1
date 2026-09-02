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
