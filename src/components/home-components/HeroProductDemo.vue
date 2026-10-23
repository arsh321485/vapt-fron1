<template>
  <AnimatedChatDemo v-if="act === 'teams'" key="teams" platform="teams" @finished="act = 'slack'" />
  <AnimatedChatDemo v-else-if="act === 'slack'" key="slack" platform="slack" @finished="act = 'site'" />
  <AnimatedDashboard v-else key="site" :loop="false" @finished="act = 'teams'" />
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
  name: 'HeroProductDemo',
  components: {
    AnimatedChatDemo: defineAsyncComponent(() => import('@/components/home-components/AnimatedChatDemo.vue')),
    AnimatedDashboard: defineAsyncComponent(() => import('@/components/home-components/AnimatedDashboard.vue')),
  },
  data() {
    return { act: 'teams' };
  },
};
</script>
