import "./assets/main.css";
import "./assets/responsive.css";
import "./utils/suppressUploadReportModal";

// Bootstrap dropdowns/collapse require the JS bundle (includes Popper).
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import TeamNameText from "./components/common/TeamNameText.vue";
import { livePageSyncMixin } from "./utils/livePageSync";

if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => {
      void reg.unregister();
    });
  }).catch(() => {});
}

const app = createApp(App);
app.mixin(livePageSyncMixin);

// Without this, an uncaught error thrown while rendering/mounting any page
// (e.g. a network hiccup mid-navigation) just leaves that page blank with
// nothing but a bare "Uncaught" line in the console — no route, no
// component name, nothing to go on when a user reports "the page went
// blank". This doesn't change behavior; it just makes the next occurrence
// diagnosable.
app.config.errorHandler = (err, instance, info) => {
  console.error("[vaptfix] Uncaught app error:", err, {
    component: instance?.$options?.name || instance?.$?.type?.name || "unknown",
    route: router.currentRoute?.value?.fullPath,
    info,
  });
};

app.component("TeamNameText", TeamNameText);

app.use(createPinia());
app.use(router);

try {
  app.mount("#app");
} catch (err) {
  console.error("App boot failed", err);
  try {
    const flag = "vaptfix_boot_recovery";
    if (!sessionStorage.getItem(flag)) {
      sessionStorage.setItem(flag, "1");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("authenticated");
      sessionStorage.removeItem("vaptfix_locked_route");
      localStorage.removeItem("completedSteps");
      window.location.replace("/home");
    }
  } catch {
    /* ignore */
  }
}
