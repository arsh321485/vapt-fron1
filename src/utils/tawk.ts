const PROPERTY_ID = "6a040fae8d8e5a1c32557122";
const WIDGET_ID = "1joftqh44";
const SCRIPT_ID = "tawk-embed";

/** Marketing pages only. Login, signup, and every dashboard stay off this list. */
const PUBLIC_ROUTES = new Set([
  "home",
  "features",
  "pricingplan",
  "knowledge-base",
  "how-vaptfix-works",
  "integrations",
  "security",
  "partner",
  "partner-lead-portal",
  "partner-thankyou",
  "partner-lead-thankyou",
  "webinarform",
  "webinarform-thankyou",
  "privacy",
  "terms",
  "public-support",
  "dpa",
  "sub-processors",
]);

type TawkApi = {
  hideWidget?: () => void;
  showWidget?: () => void;
  minimize?: () => void;
  onLoad?: () => void;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

let shouldShow = false;
let styleReady = false;

function ensureHideStyle() {
  if (styleReady) return;
  const style = document.createElement("style");
  style.id = "tawk-visibility";
  style.textContent = `
    body.tawk-hidden #tawk-bubble-container,
    body.tawk-hidden #tawkchat-container,
    body.tawk-hidden #tawkchat-minified-container,
    body.tawk-hidden iframe[src*="tawk.to"] {
      display: none !important;
      visibility: hidden !important;
    }
  `;
  document.head.appendChild(style);
  styleReady = true;
}

function applyVisibility() {
  ensureHideStyle();
  document.body.classList.toggle("tawk-hidden", !shouldShow);
  const api = window.Tawk_API;
  if (!api) return;
  if (shouldShow) api.showWidget?.();
  else {
    api.minimize?.();
    api.hideWidget?.();
  }
}

function ensureScript() {
  if (document.getElementById(SCRIPT_ID)) return;
  window.Tawk_API = window.Tawk_API || {};
  const previousOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = () => {
    previousOnLoad?.();
    applyVisibility();
  };
  window.Tawk_LoadStart = new Date();
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
  script.charset = "UTF-8";
  script.setAttribute("crossorigin", "*");
  document.head.appendChild(script);
}

export function syncTawk(routeName: unknown) {
  shouldShow = typeof routeName === "string" && PUBLIC_ROUTES.has(routeName);
  if (shouldShow) ensureScript();
  applyVisibility();
}
