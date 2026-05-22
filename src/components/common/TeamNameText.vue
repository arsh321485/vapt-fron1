<template>
  <component :is="tag" :class="['team-colored-name', textClass]" :style="colorStyle">
    <slot>{{ name }}</slot>
  </component>
</template>

<script>
import { getTeamColor, getTeamTextClass } from '@/utils/teamColors';

export default {
  name: 'TeamNameText',
  props: {
    name: { type: String, default: '' },
    tag: { type: String, default: 'span' },
    muted: { type: Boolean, default: false },
  },
  computed: {
    textClass() {
      return getTeamTextClass(this.name);
    },
    colorStyle() {
      if (this.muted) return { color: '#64748b' };
      const c = getTeamColor(this.name);
      return c !== '#64748b' ? { color: c } : {};
    },
  },
};
</script>
