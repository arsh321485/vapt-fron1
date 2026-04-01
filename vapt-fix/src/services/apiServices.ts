import axios from "axios";
import router from "../router";
import Swal from "sweetalert2";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

endpoint.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authorization");
    const isPublic = PUBLIC_URL_PATTERNS.some((p) => config.url?.includes(p));

    if (token && token !== "null" && token !== "undefined" && !isPublic) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle session expiry
const AUTH_ENDPOINTS = [
  "/api/admin/users/user-login/",
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