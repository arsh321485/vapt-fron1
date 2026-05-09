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

// ✅ Add token to requests (if exists)
const PUBLIC_URL_PATTERNS = [
  "/api/admin/users/user-set-password/",
  "/api/admin/users/reset-password/",
  "/api/admin/users/forgot-password/",
];
const REALTIME_ENDPOINT_PATTERNS = ["/api/notifications/"];

endpoint.interceptors.request.use(
  (config) => {
    const token =
      sessionStorage.getItem("authorization") ||
      localStorage.getItem("authorization");
    const requestUrl = String(config.url || "");
    const isPublic = PUBLIC_URL_PATTERNS.some((p) => config.url?.includes(p));
    const isRealtime = REALTIME_ENDPOINT_PATTERNS.some((p) => requestUrl.includes(p));
    const method = String(config.method || "get").toLowerCase();

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
];

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

    if (error.response?.status === 401 && !isAuthEndpoint && !isAuthScreen) {
      // Clear both storages to avoid stale auth state across flows
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

      // Redirect to home page instead of showing modal
      router.push("/home");
    }
    return Promise.reject(error);
  },
);

export default endpoint;
