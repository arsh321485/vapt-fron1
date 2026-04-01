<template>
  <RouterView />
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
    // this.authStore.initFromStorage();
    // this.authStore.restoreFromStorage();
    const restored = this.authStore.restoreFromStorage();
  console.log("Session restored?", restored);
  },
});
</script>
