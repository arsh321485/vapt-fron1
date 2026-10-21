<template>
  <AnimatedDashboard />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'HeroProductDemo',
  components: {
    AnimatedDashboard: defineAsyncComponent(() => import('@/components/home-components/AnimatedDashboard.vue')),
  },
};
</script>
