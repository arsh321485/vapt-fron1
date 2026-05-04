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
const REALTIME_ENDPOINT_PATTERNS = [
  "/api/notifications/",
];

endpoint.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authorization");
    const requestUrl = String(config.url || "");
    const isPublic = PUBLIC_URL_PATTERNS.some((p) => config.url?.includes(p));
    const isRealtime = REALTIME_ENDPOINT_PATTERNS.some((p) => requestUrl.includes(p));
    const method = String(config.method || "get").toLowerCase();

    if (token && token !== "null" && token !== "undefined" && !isPublic) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Only realtime APIs need aggressive no-cache; keep normal pages fast.
    if (isRealtime) {
      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      config.headers.Pragma = "no-cache";
      config.headers.Expires = "0";
    }

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
  (error) => Promise.reject(error)
);

// ✅ Handle session expiry
const AUTH_ENDPOINTS = [
  "/api/admin/users/login/",
  "/api/admin/users/user-login/",
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

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Clear localStorage directly
      localStorage.removeItem("authorization");
      localStorage.removeItem("user");
      localStorage.removeItem("authenticated");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("locations");

      router.push("/signin");

      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please log in again.",
      });
    }
    return Promise.reject(error);
  }
);

export default endpoint;