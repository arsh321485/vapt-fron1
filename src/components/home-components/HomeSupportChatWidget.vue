<template>
  <!-- Tawk.to injects its own floating widget -->
  <div class="tawk-mount" aria-hidden="true"></div>
</template>

<script>
const TAWK_PROPERTY_ID = '6a040fae8d8e5a1c32557122';
/** From Tawk dashboard widget snippet (not "default") */
const TAWK_WIDGET_ID = '1joftqh44';
const TAWK_SCRIPT_ID = 'tawkto-embed-script';

export default {
  name: 'HomeSupportChatWidget',
  mounted() {
    this.ensureTawkLoaded();
    this.showTawkIfReady();
  },
  beforeUnmount() {
    this.hideTawkIfReady();
  },
  methods: {
    ensureTawkLoaded() {
      const embedPath = `${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      const existing = document.getElementById(TAWK_SCRIPT_ID);
      if (existing) {
        if (existing.src && existing.src.includes(embedPath)) return;
        existing.remove();
      }

      // eslint-disable-next-line no-undef
      window.Tawk_API = window.Tawk_API || {};
      // eslint-disable-next-line no-undef
      window.Tawk_LoadStart = new Date();

      const s1 = document.createElement('script');
      s1.id = TAWK_SCRIPT_ID;
      s1.async = true;
      s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');

      const s0 = document.getElementsByTagName('script')[0];
      if (s0 && s0.parentNode) {
        s0.parentNode.insertBefore(s1, s0);
      } else {
        document.body.appendChild(s1);
      }
    },
    showTawkIfReady() {
      const api = window.Tawk_API;
      if (!api) return;

      // Some API methods are available only after load; onLoad is safe.
      api.onLoad = () => {
        try {
          api.showWidget?.();
        } catch {
          // no-op
        }
      };

      try {
        api.showWidget?.();
      } catch {
        // no-op
      }
    },
    hideTawkIfReady() {
      const api = window.Tawk_API;
      if (!api) return;
      try {
        api.hideWidget?.();
      } catch {
        // no-op
      }
    },
  },
};
</script>

<style scoped>
.tawk-mount {
  display: none;
}
</style>
