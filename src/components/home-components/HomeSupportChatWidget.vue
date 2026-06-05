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

      // customStyle must be set before the embed script downloads
      // eslint-disable-next-line no-undef
      window.Tawk_API = window.Tawk_API || {};
      // eslint-disable-next-line no-undef
      window.Tawk_LoadStart = window.Tawk_LoadStart || new Date();
      // eslint-disable-next-line no-undef
      window.Tawk_API.customStyle = {
        visibility: {
          desktop: {
            position: 'bl',
            xOffset: 20,
            yOffset: 20,
          },
          mobile: {
            position: 'bl',
            xOffset: 20,
            yOffset: 20,
          },
        },
      };

      const existing = document.getElementById(TAWK_SCRIPT_ID);
      if (existing) {
        if (existing.src && existing.src.includes(embedPath)) return;
        existing.remove();
      }

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
    moveTawkToLeft() {
      const applyLeft = (el) => {
        el.style.setProperty('right', 'auto', 'important');
        el.style.setProperty('left', '20px', 'important');
      };
      document
        .querySelectorAll('iframe[src*="tawk.to"], iframe[title="chat widget"]')
        .forEach(applyLeft);
      document
        .querySelectorAll('#tawkchat-container, #tawk-bubble-container, [id^="tawk-"]')
        .forEach(applyLeft);
    },
    showTawkIfReady() {
      const api = window.Tawk_API;
      if (!api) return;

      // Some API methods are available only after load; onLoad is safe.
      api.onLoad = () => {
        try {
          api.showWidget?.();
          // Widget load hone ke baad left pe move karo
          this.$nextTick(() => {
            this.moveTawkToLeft();
            setTimeout(() => this.moveTawkToLeft(), 500);
            setTimeout(() => this.moveTawkToLeft(), 1500);
          });
        } catch {
          // no-op
        }
      };

      try {
        api.showWidget?.();
        setTimeout(() => this.moveTawkToLeft(), 1000);
        setTimeout(() => this.moveTawkToLeft(), 2000);
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
