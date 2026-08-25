import "./assets/main.css";
import "./assets/responsive.css";

// Bootstrap dropdowns/collapse require the JS bundle (includes Popper).
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import TeamNameText from "./components/common/TeamNameText.vue";

const app = createApp(App);

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
