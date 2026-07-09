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

app.mount("#app");
