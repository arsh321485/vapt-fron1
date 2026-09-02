import axios from "axios";
import router from "../router";
import Swal from "sweetalert2";
import { notifyLiveData } from "../utils/livePageSync";
import { attachInviteTokenToRequestData } from "../utils/claimInvite";

// In dev we rely on Vite's proxy (vite.config.*) for `/api` requests,
// otherwise browsers block cross-origin calls (CORS).
const BASE_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL;

const endpoint = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Prevent one slow endpoint (e.g. billing) from blocking the whole app for 45s+.
  timeout: 20000,
});

/** User-portal routes: do not force /home on 401 (avoids bounce when one call fails right after login). */
function isUserAppRoute(path: string) {
  if (!path) return false;
  const prefixes = [
    "/userdashboard",
    "/user-manage-account",
    "/userassets",
    "/userexception",
    "/userVulnerabilityregister",
    "/delayedvulnerabilities",
    "/delayedvulnerabilitycard",
    "/fixedvulnerabilities",
    "/pendingvulnerabilities",
    "/pendingvulnerabilitycard",
    "/usermissingsecurityupdates",
    "/user-tickets",
    "/user-calendar",
  ];
  for (const p of prefixes) {
    if (path === p || path.startsWith(`${p}/`)) return true;
  }
  if (
    path.startsWith("/user-ticket/") ||
    path.startsWith("/user-vulnerabilitycard/") ||
    path.startsWith("/user-remediation-timeline/") ||
    path.startsWith("/user-set-password/")
  ) {
    return true;
  }
  return false;
}

// ✅ Add token to requests (if exists)
const PUBLIC_URL_PATTERNS = [
  "/api/admin/users/user-set-password/",
  "/api/admin/users/reset-password/",
  "/api/admin/users/forgot-password/",
  "/api/admin/users/login/",
  "/api/admin/users/user-login/",
  "/api/admin/users/signup/send-otp/",
  "/api/admin/users/signup/verify-otp/",
  "/api/admin/users/user-login-platform/",
  "/api/admin/users/slack/member-login/",
  "/api/admin/users/teams/member-login/",
  "/api/admin/users/slack/pricing-handoff/",
  "/api/admin/users/slack/oauth-url/",
  "/api/admin/users/microsoft-teams/oauth-url/",
  "/api/admin/upload_report/claim-invite/validate/",
  "/api/webinar/form-options/",
  "/api/webinar/register/",
  "/api/partners/form-options/",
  "/api/partners/apply/",
];
const INVITE_CLAIM_POSTS = [
  "/api/admin/users/signup/send-otp/",
  "/api/admin/users/signup/verify-otp/",
  "/api/admin/users/login/",
];

endpoint.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authorization") || localStorage.getItem("authorization");
    const isPublic = PUBLIC_URL_PATTERNS.some((p) => config.url?.includes(p));
    const method = String(config.method || "get").toLowerCase();
    const requestUrl = String(config.url || "");

    // FormData must use multipart with browser-set boundary.
    // Instance default Content-Type (application/json) would empty request.FILES.
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      const headers = config.headers as any;
      if (headers?.delete) {
        headers.delete("Content-Type");
        headers.delete("content-type");
      } else if (headers) {
        delete headers["Content-Type"];
        delete headers["content-type"];
      }
    }

    if (method === "post" && INVITE_CLAIM_POSTS.some((p) => requestUrl.includes(p))) {
      config.data = attachInviteTokenToRequestData(config.data);
    }

    // Don't attach token to public endpoints (login, signup, password reset, etc)
    if (token && token !== "null" && token !== "undefined" && !isPublic) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Do not set Cache-Control / Pragma / Expires request headers: they are
    // non-simple headers and widen CORS preflight. Bust Chrome disk-cache with
    // a query param instead (same-origin + cross-origin safe).
    // Extra `_ts` can make claim-invite/validate treat the invite as unknown (`valid: false`).
    const skipCacheBust = String(config.url || "").includes("/claim-invite/validate/");
    if (method === "get" && !skipCacheBust) {
      const params = config.params ?? {};
      if (params instanceof URLSearchParams) {
        if (!params.has("_ts")) {
          params.set("_ts", Date.now().toString());
        }
        config.params = params;
      } else if (typeof params === "object") {
        const plainParams = params as Record<string, any>;
        if (plainParams._ts === undefined || plainParams._ts === null) {
          plainParams._ts = Date.now();
        }
        config.params = plainParams;
      } else {
        config.params = { _ts: Date.now() };
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ✅ Handle session expiry
const AUTH_ENDPOINTS = [
  "/api/admin/users/login/",
  "/api/admin/users/user-login/",
  "/api/admin/users/logout/",
  "/api/admin/users/signup/send-otp/",
  "/api/admin/users/signup/verify-otp/",
  "/api/admin/users/user-set-password/",
  "/api/admin/users/forgot-password/",
  "/api/admin/users/reset-password/",
  "/api/admin/users/token/refresh/", // refresh endpoint itself — infinite loop rokne ke liye
  "/api/admin/users/slack/pricing-handoff/",
  "/api/admin/upload_report/claim-invite/validate/",
];

// Token refresh queue — agar ek saath kai requests 401 paayein toh sab wait karein
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

function enqueueRefresh(cb: (token: string) => void) {
  refreshQueue.push(cb);
}
function drainRefreshQueue(newToken: string) {
  refreshQueue.forEach((cb) => cb(newToken));
  refreshQueue = [];
}
function clearRefreshQueue() {
  refreshQueue = [];
}

function clearAllSessionTokens() {
  sessionStorage.removeItem("authorization");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("authenticated");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("locations");
  localStorage.removeItem("authorization");
  localStorage.removeItem("user");
  localStorage.removeItem("authenticated");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("locations");
}

endpoint.interceptors.response.use(
  (response) => {
    const method = String(response.config?.method || "get").toLowerCase();
    const requestUrl = String(response.config?.url || "");
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));
    if (["post", "put", "patch", "delete"].includes(method) && !isAuthEndpoint) {
      notifyLiveData(method);
    }
    return response;
  },
  async (error) => {
    const requestUrl = error.config?.url || "";
    const isAuthEndpoint = AUTH_ENDPOINTS.some((ep) => requestUrl.includes(ep));
    const currentPath = router.currentRoute.value?.path || "";
    const isAuthScreen =
      currentPath === "/" ||
      currentPath === "/signin" ||
      currentPath === "/auth" ||
      currentPath === "/home";

    const noRedirect401Paths = new Set([
      "/pricingplan",
      "/billing/success",
      "/billing/cancel",
      "/partner",
      "/partner-lead-portal",
      "/partner-lead-thankyou",
      "/partner-thankyou",
      "/webinarform",
      "/webinarform-thankyou",
    ]);
    const skip401Redirect =
      isAuthScreen || noRedirect401Paths.has(currentPath) || isUserAppRoute(currentPath);

    if (error.response?.status === 401 && !isAuthEndpoint && !skip401Redirect) {
      // 🔄 Pehle refresh token try karo
      const storedRefresh =
        sessionStorage.getItem("refreshToken") || localStorage.getItem("django_refresh_token");

      if (storedRefresh) {
        // Agar refresh already chal rahi hai → queue mein wait karo
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            enqueueRefresh((newToken) => {
              if (error.config?.headers) {
                error.config.headers["Authorization"] = `Bearer ${newToken}`;
              }
              resolve(endpoint(error.config));
            });
          });
        }

        isRefreshing = true;
        try {
          const refreshBase = import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL || "";
          const res = await axios.post(`${refreshBase}/api/admin/users/token/refresh/`, {
            refresh: storedRefresh,
          });
          const newAccessToken: string = res.data.access;

          // ✅ Naya token save karo
          sessionStorage.setItem("authorization", newAccessToken);
          localStorage.setItem("django_access_token", newAccessToken);

          isRefreshing = false;
          drainRefreshQueue(newAccessToken);

          // ✅ Original request retry karo naye token ke saath
          if (error.config?.headers) {
            error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
          }
          return endpoint(error.config);
        } catch {
          // ❌ Refresh bhi fail → logout
          isRefreshing = false;
          clearRefreshQueue();
          clearAllSessionTokens();
          router.push("/home");
          return Promise.reject(error);
        }
      }

      // Refresh token nahi mila → seedha logout
      clearAllSessionTokens();
      router.push("/home");
    }
    return Promise.reject(error);
  },
);

export default endpoint;
