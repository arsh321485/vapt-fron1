<template>
  <div class="hero-demo-slot">
    <AnimatedChatDemo
      v-if="go.platform === 'teams'"
      :key="'teams-' + generation"
      platform="teams"
      controlled
      :go="go"
      @finished="advance"
    />
    <AnimatedChatDemo
      v-else-if="go.platform === 'slack'"
      :key="'slack-' + generation"
      platform="slack"
      controlled
      :go="go"
      @finished="advance"
    />
    <AnimatedDashboard
      v-else
      :key="'site-' + generation"
      :loop="false"
      controlled
      :go="go"
      @finished="advance"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';

/** One page at a time, one screen each: Teams, then Slack, then the website. */
const STEPS = [
  { platform: 'teams', screen: 'home' },
  { platform: 'slack', screen: 'home' },
  { platform: 'site', screen: 'dashboard' },

  { platform: 'teams', screen: 'assets' },
  { platform: 'slack', screen: 'assets' },
  { platform: 'site', screen: 'assets' },

  { platform: 'teams', screen: 'register' },
  { platform: 'slack', screen: 'register' },
  { platform: 'site', screen: 'register' },

  { platform: 'teams', screen: 'team' },
  { platform: 'slack', screen: 'team' },
  { platform: 'site', screen: 'performance' },

  { platform: 'teams', screen: 'reminder' },
  { platform: 'slack', screen: 'reminder' },
  { platform: 'site', screen: 'support' },
];

export default {
  name: 'HeroProductDemo',
  components: {
    AnimatedChatDemo: defineAsyncComponent(() => import('@/components/home-components/AnimatedChatDemo.vue')),
    AnimatedDashboard: defineAsyncComponent(() => import('@/components/home-components/AnimatedDashboard.vue')),
  },
  data() {
    return {
      index: 0,
      generation: 0,
      seen: { teams: 'home', slack: 'home', site: 'dashboard' },
    };
  },
  computed: {
    step() {
      return STEPS[this.index];
    },
    go() {
      return {
        id: this.index,
        platform: this.step.platform,
        screen: this.step.screen,
        from: this.seen[this.step.platform],
      };
    },
  },
  methods: {
    advance() {
      const step = this.step;
      this.seen[step.platform] = step.screen;
      const next = (this.index + 1) % STEPS.length;
      if (next === 0) {
        this.seen = { teams: 'home', slack: 'home', site: 'dashboard' };
        this.generation += 1;
      }
      this.index = next;
    },
  },
};
</script>

<style scoped>
.hero-demo-slot {
  width: 100%;
  min-height: 540px;
}
</style>
