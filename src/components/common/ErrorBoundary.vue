<template>
  <div v-if="hasError" class="app-error-boundary">
    <div class="app-error-boundary-card">
      <i class="bi bi-exclamation-triangle app-error-boundary-icon"></i>
      <h2>Something went wrong</h2>
      <p>This page hit an unexpected error. Reloading usually fixes it.</p>
      <pre v-if="isDev && errorDetail" class="app-error-boundary-detail">{{ errorDetail }}</pre>
      <button type="button" class="app-error-boundary-btn" @click="reload">Reload page</button>
    </div>
  </div>
  <slot v-else />
</template>

<script>
/**
 * Wraps the router-view so an uncaught error thrown while rendering or
 * mounting ANY page (a click handler that throws, a bad API response shape,
 * an unhandled promise rejection surfaced during a reactive update) shows a
 * recoverable fallback instead of leaving that whole page blank with
 * nothing but a console line to go on. Vue's error propagation walks up the
 * full component tree regardless of <keep-alive> boundaries, so this still
 * catches errors from cached (kept-alive) pages too.
 */
export default {
  name: 'ErrorBoundary',
  data() {
    return {
      hasError: false,
      errorDetail: '',
      // import.meta.env isn't available inside the Options API `data()`
      // evaluation context the same way as <script setup>, so capture it
      // once here rather than inline in the template.
      isDev: !!import.meta.env?.DEV,
    };
  },
  watch: {
    // Give a fresh chance on the next navigation rather than staying stuck
    // on the fallback — no :key/forced remount here, since that would also
    // tear down and recreate the <keep-alive> this wraps, defeating it.
    '$route.fullPath'() {
      this.hasError = false;
      this.errorDetail = '';
    },
  },
  errorCaptured(err, instance, info) {
    console.error('[ErrorBoundary] caught render/lifecycle error:', err, {
      component: instance?.$options?.name || 'unknown',
      info,
    });
    this.hasError = true;
    this.errorDetail = `${instance?.$options?.name || 'unknown component'} (${info})\n${err?.stack || err?.message || err}`;
    return false; // stop propagation — we've handled it, don't also crash a parent boundary
  },
  methods: {
    reload() {
      window.location.reload();
    },
  },
};
</script>

<style scoped>
.app-error-boundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6fa;
  padding: 24px;
}
.app-error-boundary-card {
  max-width: 420px;
  text-align: center;
  background: #fff;
  border-radius: 16px;
  padding: 2rem 1.75rem;
  box-shadow: 0 10px 30px rgba(36, 20, 71, 0.08);
}
.app-error-boundary-icon {
  font-size: 2.25rem;
  color: #dc2626;
  display: block;
  margin-bottom: 0.75rem;
}
.app-error-boundary-card h2 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #241447;
  margin: 0 0 0.5rem;
}
.app-error-boundary-card p {
  color: rgba(0, 0, 0, 0.6);
  margin: 0 0 1.25rem;
}
.app-error-boundary-detail {
  text-align: left;
  background: #1f2a42;
  color: #f8f8f8;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.72rem;
  line-height: 1.4;
  max-height: 220px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0 0 1.25rem;
}
.app-error-boundary-btn {
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.6rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
}
.app-error-boundary-btn:hover {
  background: #2f1a5c;
}
</style>
