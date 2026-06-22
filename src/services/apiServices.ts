import axios from "axios";
import router from "../router";
import Swal from "sweetalert2";

// In dev we rely on Vite's proxy (vite.config.*) for `/api` requests,
// otherwise browsers block cross-origin calls (CORS).
const BASE_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL;

const endpoint = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  "/api/admin/users/slack/oauth-url/",
  "/api/admin/users/microsoft-teams/oauth-url/",
];
const REALTIME_ENDPOINT_PATTERNS = ["/api/notifications/"];

endpoint.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("authorization") || localStorage.getItem("authorization");
    const requestUrl = String(config.url || "");
    const isPublic = PUBLIC_URL_PATTERNS.some((p) => config.url?.includes(p));
    const isRealtime = REALTIME_ENDPOINT_PATTERNS.some((p) => requestUrl.includes(p));
    const method = String(config.method || "get").toLowerCase();

    // Don't attach token to public endpoints (login, signup, password reset, etc)
    if (token && token !== "null" && token !== "undefined" && !isPublic) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Do not set Cache-Control / Pragma / Expires on notification calls: they are
    // non-simple headers and widen CORS preflight; if the API does not list them
    // in Access-Control-Allow-Headers, the browser fails with HeaderDisallowedByPreflightResponse.
    // Cache busting for these routes is handled via _ts below.

    // Add cache-buster only for realtime GET requests unless already provided.
    if (method === "get" && isRealtime) {
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
  (response) => response,
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
      "/partner",
      "/partner-lead-portal",
      "/partner-lead-thankyou",
      "/partner-thankyou",
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
