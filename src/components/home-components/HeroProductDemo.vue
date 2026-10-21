<template>
  <AnimatedChatDemo
    v-if="stage === 'teams'"
    platform="teams"
    @finished="stage = 'slack'"
  />
  <AnimatedChatDemo
    v-else-if="stage === 'slack'"
    platform="slack"
    @finished="stage = 'website'"
  />
  <AnimatedDashboard
    v-else
    :loop="false"
    @finished="stage = 'teams'"
  />
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
    return { stage: 'teams' };
  },
};
</script>
