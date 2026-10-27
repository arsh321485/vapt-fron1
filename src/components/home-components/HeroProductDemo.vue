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

/** One page at a time: every screen of that page on Teams, then Slack, then the website. */
const STEPS = [
  { platform: 'teams', screen: 'home' },
  { platform: 'slack', screen: 'home' },
  { platform: 'site', screen: 'dashboard' },

  { platform: 'teams', screen: 'assets' },
  { platform: 'teams', screen: 'asset' },
  { platform: 'teams', screen: 'manual' },
  { platform: 'teams', screen: 'auto' },
  { platform: 'slack', screen: 'assets' },
  { platform: 'slack', screen: 'assets-hold' },
  { platform: 'slack', screen: 'asset' },
  { platform: 'slack', screen: 'manual' },
  { platform: 'slack', screen: 'auto' },
  { platform: 'site', screen: 'assets' },
  { platform: 'site', screen: 'manual' },
  { platform: 'site', screen: 'auto' },

  { platform: 'teams', screen: 'register' },
  { platform: 'teams', screen: 'script' },
  { platform: 'slack', screen: 'register' },
  { platform: 'slack', screen: 'script' },
  { platform: 'site', screen: 'register' },
  { platform: 'site', screen: 'script' },
  { platform: 'teams', screen: 'automations' },

  { platform: 'teams', screen: 'team' },
  { platform: 'teams', screen: 'add' },
  { platform: 'teams', screen: 'delete' },
  { platform: 'teams', screen: 'delete-detail' },
  { platform: 'teams', screen: 'role' },
  { platform: 'teams', screen: 'role-detail' },
  { platform: 'teams', screen: 'external' },
  { platform: 'slack', screen: 'team' },
  { platform: 'slack', screen: 'add' },
  { platform: 'slack', screen: 'add-picked' },
  { platform: 'slack', screen: 'user-updated' },
  { platform: 'slack', screen: 'delete' },
  { platform: 'slack', screen: 'role' },
  { platform: 'slack', screen: 'role-picked' },
  { platform: 'slack', screen: 'external' },
  { platform: 'site', screen: 'team' },
  { platform: 'site', screen: 'team-add' },
  { platform: 'site', screen: 'team-added' },
  { platform: 'site', screen: 'team-role' },
  { platform: 'site', screen: 'team-updated' },
  { platform: 'site', screen: 'team-remove' },
  { platform: 'site', screen: 'team-external' },
  { platform: 'site', screen: 'performance' },

  { platform: 'teams', screen: 'timeline' },
  { platform: 'teams', screen: 'timeline-history' },
  { platform: 'teams', screen: 'timeline-detail' },
  { platform: 'slack', screen: 'timeline' },
  { platform: 'slack', screen: 'timeline-history' },
  { platform: 'site', screen: 'timeline' },
  { platform: 'site', screen: 'timeline-detail' },
  { platform: 'site', screen: 'calendar' },

  { platform: 'teams', screen: 'reminder' },
  { platform: 'teams', screen: 'reminder-detail' },
  { platform: 'slack', screen: 'reminder' },
  { platform: 'slack', screen: 'reminder-support' },
  { platform: 'slack', screen: 'reminder-detail' },
  { platform: 'slack', screen: 'reply' },
  { platform: 'site', screen: 'support' },

  { platform: 'teams', screen: 'download' },
  { platform: 'slack', screen: 'download' },
  { platform: 'site', screen: 'download' },
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
