import { defineStore } from "pinia";
import endpoint from "../services/apiServices";
import type { AxiosError } from "axios";
import {
  buildVulnsFromRegister,
  filterDeletedVulnsForHost,
  normalizeAssetVulnerabilityList,
} from "@/utils/assetVulnerabilities";

interface RoleAssignmentEntry {
  assets: string[];
  vulns: { plugin_name: string; host_name: string }[];
}

interface CreateUserPayload {
  admin_id: string;
  user_type: string;
  email: string;
  first_name?: string;
  last_name?: string;
  Member_role: string | string[];
  slack_bot_token?: string;
  role_assignments?: Record<string, RoleAssignmentEntry>;
}

interface RiskCriteriaPayload {
  critical: string;
  high: string;
  medium: string;
  low: string;
}

interface SlackMessageResponse {
  status: boolean;
  data?: any;
  message?: string;
}

// Helper function to clear all auth tokens
function clearAllAuthTokens() {
  // Clear sessionStorage
  sessionStorage.removeItem("authorization");
  sessionStorage.removeItem("refreshToken");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("authenticated");

  // Clear localStorage
  localStorage.removeItem("authorization");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  localStorage.removeItem("authenticated");
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null,
    token: sessionStorage.getItem("authorization") ? sessionStorage.getItem("authorization") : null,
    authenticated: sessionStorage.getItem("authenticated")
      ? JSON.parse(sessionStorage.getItem("authenticated")!)
      : false,
    accessToken: sessionStorage.getItem("authorization") || null,
    refreshToken: sessionStorage.getItem("refreshToken") || null,
    tickets: [] as any[],
    countries: [] as string[],
    totalAssets: 0 as number,
    avgScore: 0 as number,
    vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 },
    vulnerabilityRegister: [] as any[],
    vulnerabilityCount: 0,
    vulnerabilityRows: [] as any[],
    latestReportId: null,
    userLatestReportId: null as string | null,
    assetRows: [] as any[],
    assetCount: 0,
    memberType: "",
    assetSearchResults: [] as any[],
    assetSearchCount: 0,
    selectedAssetDetail: null as any,
    selectedAssetVulnerabilities: [] as any[],
    mitigationTimeline: null,
    meanTimeToRemediate: null as null | {
      mean_time_to_remediate_days: number;
      mean_time_to_remediate_hours: number;
      risk_criteria_days: {
        critical: number;
        high: number;
        medium: number;
        low: number;
      };
    },
    reportLocations: [] as { id: string; name: string }[],
    selectedReportLocation: null as { id: string; name: string } | null,
    uploadedReportDetails: null as any,
    completedSteps: localStorage.getItem("completedSteps")
      ? JSON.parse(localStorage.getItem("completedSteps")!)
      : ([] as number[]),
    projectNames: [] as string[],
    isLoadingProjects: false,
    reportStatus: {
      hasReport: false,
      reportId: null as string | null,
      message: "",
      checked: false,
    },
    teams: [],
    channels: [],
    selectedTeam: null,
    lastMessageMeta: null,

    // ── Cache layer ──────────────────────────────────────────
    // Prevents re-fetching when navigating back to a page.
    // Each key stores previously fetched data. Pass force:true to bypass.
    cachedUserAssets: [] as any[],
    cachedUserAssetTotal: 0,
    cachedUserHeldAssets: [] as any[],
    userHeldAssetsFetched: false,
    cachedMeanTime: {} as Record<string, any>,
    cachedMitigationTimeline: {} as Record<string, any>,
    cachedUserVulnerabilities: {} as Record<string, any>,
    cachedUserVulnerabilitiesFixed: {} as Record<string, any>,
    cachedSupportRequests: {} as Record<string, any>,
    cachedOpenTickets: {} as Record<string, any>,
    cachedMitigationByTeam: null as any,
    cachedUserMitigationByTeam: null as any,
    cachedTicketsByReport: {} as Record<string, any>,
    cachedUsersByAdmin: [] as any[],
    usersByAdminFetched: false,
    cachedDistributionByTeam: null as any,
    cachedUserVulnRegister: [] as any[],
    userVulnRegisterFetched: false,
    allReportVulnerabilities: [] as any[],
    allReportVulnerabilitiesTotal: 0,
    allReportVulnerabilitiesFetched: false,
    heldVulnerabilityAssets: [] as any[],
    heldVulnerabilityAssetsFetched: false,
    deletedVulnerabilityAssets: [] as any[],
    deletedVulnerabilityAssetsFetched: false,
    userAllReportVulnerabilities: [] as any[],
    userAllReportVulnerabilitiesTotal: 0,
    userAllReportVulnerabilitiesFetched: false,
    userHeldVulnerabilityAssets: [] as any[],
    userHeldVulnerabilityAssetsFetched: false,
    userDeletedVulnerabilityAssets: [] as any[],
    userDeletedVulnerabilityAssetsFetched: false,
    cachedUserSupportRequests: {} as Record<string, any>,
    cachedUserOpenTickets: {} as Record<string, any>,
    cachedUserClosedVulns: null as any,
    cachedUserTotalAssets: {} as Record<string, any>,
    cachedUserAllTickets: {} as Record<string, any>,
    // ─────────────────────────────────────────────────────────
  }),

  actions: {
    // ✅ Restore session on reload
    restoreFromStorage() {
      const access = sessionStorage.getItem("authorization");
      const refresh = sessionStorage.getItem("refreshToken");
      const user = sessionStorage.getItem("user");

      if (access && user) {
        this.token = access;
        this.refreshToken = refresh;
        this.user = JSON.parse(user);
        this.authenticated = true;

        console.log("🔄 Session restored from sessionStorage");
        return true;
      }

      return false;
    },
    // ✅ Restore auth + auto-fetch locations on refresh

    initFromStorage() {
      try {
        // 1️⃣ Restore user
        const savedUser = sessionStorage.getItem("user");
        if (savedUser) {
          this.user = JSON.parse(savedUser);
          console.log("♻️ Restored user from storage:", this.user);
        }
        // 2️⃣ Restore locations quickly (so UI shows instantly)
        // const savedLocations = localStorage.getItem("locations");
        // if (savedLocations) {
        //   this.locations = JSON.parse(savedLocations);
        //   console.log("♻️ Restored locations from storage:", this.locations);
        // }

        // 3️⃣ Then re-fetch fresh locations from API (by admin id)
        const adminId = this.user?.admin_id || this.user?.id || this.user?._id;

        // if (adminId) {
        //   this.fetchLocationsByAdminId(adminId);
        // }
      } catch (e) {
        console.error("initFromStorage error:", e);
      }
    },

    // ✅ Signup Step 1: Send OTP
    async signupSendOtp(payload: {
      email: string;
      password: string;
      confirm_password: string;
      recaptcha: string;
    }) {
      try {
        const res = await endpoint.post("/api/admin/users/signup/send-otp/", payload);
        return { status: true, data: res.data, message: res.data.message };
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.message || errorData?.error || errorData?.detail || "Failed to send OTP";
        return {
          status: false,
          message: errorMessage,
          details: errorData || null,
        };
      }
    },

    // ✅ Get Project Details
    async getProjectDetails() {
      try {
        const res = await endpoint.get("/api/admin/scoping/project-details/");
        return { status: true, data: res.data.data };
      } catch (error: any) {
        // 404 = no project details saved yet (new user) — not an error
        if (error.response?.status === 404) {
          return { status: false, data: null };
        }
        const errorData = error.response?.data;
        return {
          status: false,
          data: null,
          message: errorData?.message || errorData?.detail || "Failed to fetch project details",
        };
      }
    },

    // ✅ Get Testing Methodology
    async getTestingMethodology() {
      try {
        const res = await endpoint.get("/api/admin/scoping/testing-methodology/");
        return { status: true, data: res.data.data };
      } catch (error: any) {
        if (error.response?.status === 404) return { status: false, data: null };
        const errorData = error.response?.data;
        return {
          status: false,
          data: null,
          message: errorData?.message || "Failed to fetch testing methodology",
        };
      }
    },

    // ✅ Check scoping upload status
    async getScopingUploadStatus() {
      const res = await endpoint.get("/api/admin/scoping/upload-status/");
      return {
        file_uploaded: res.data.file_uploaded === true,
        cards_generating: res.data.cards_generating === true,
        elapsed_time_text: res.data.elapsed_time_text || "",
        remaining_time_text: res.data.remaining_time_text || "",
        estimated_total_text: res.data.estimated_total_text || "",
        cards_total: res.data.cards_total || 0,
        cards_generated: res.data.cards_generated || 0,
        reports_total: res.data.reports_total || 0,
        reports_ready: res.data.reports_ready || 0,
      };
    },

    // ✅ Submit Scoping Form
    async submitScopingForm() {
      try {
        const res = await endpoint.post("/api/admin/scoping/submit/");
        return {
          status: true,
          message: res.data.message,
          already_submitted: res.data.already_submitted,
        };
      } catch (error: any) {
        const errorData = error.response?.data;
        return {
          status: false,
          message: errorData?.message || errorData?.detail || "Failed to submit scoping form",
        };
      }
    },

    // ✅ Get Single Testing Methodology by type
    async getTestingMethodologyByType(testing_type: string) {
      try {
        const res = await endpoint.get("/api/admin/scoping/testing-methodology/", {
          params: { testing_type },
        });
        return { status: true, data: res.data.data };
      } catch (error: any) {
        if (error.response?.status === 404) return { status: false, data: null };
        const errorData = error.response?.data;
        return {
          status: false,
          data: null,
          message: errorData?.message || "Failed to fetch testing methodology",
        };
      }
    },

    // ✅ Save Testing Methodology (Scoping Form Step 2) — one call per testing_type
    async saveTestingMethodology(payload: {
      testing_type: string;
      assessment_categories: string[];
      assessment_notes?: string;
      network_perspective: string;
      environment: string;
      compliance_standards: string[];
      compliance_notes?: string;
    }) {
      try {
        const res = await endpoint.post("/api/admin/scoping/testing-methodology/", payload);
        return { status: true, data: res.data.data, message: res.data.message };
      } catch (error: any) {
        const errorData = error.response?.data;
        let errorMessage = errorData?.message || errorData?.error || errorData?.detail || "";
        if (!errorMessage && errorData && typeof errorData === "object") {
          // DRF field-level validation errors: { field: ["msg", ...], ... }
          const messages = (Object.values(errorData) as any[])
            .flat()
            .filter((v: any) => typeof v === "string");
          if (messages.length > 0) errorMessage = messages.join(" ");
        }
        return { status: false, message: errorMessage || "Failed to save testing methodology" };
      }
    },

    // ✅ Save Project Details (Scoping Form Step 1)
    async saveProjectDetails(payload: {
      organization_name: string;
      industry: string;
      country: string;
      full_name: string;
      email_address: string;
      phone_number?: string;
    }) {
      try {
        const res = await endpoint.post("/api/admin/scoping/project-details/", payload);
        return { status: true, data: res.data.data, message: res.data.message };
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          "Failed to save project details";
        return { status: false, message: errorMessage };
      }
    },

    // ✅ Fetch Countries
    async fetchCountries() {
      try {
        const res = await endpoint.get("/api/admin/location/countries/");
        this.countries = res.data.countries || [];
        return { status: true, data: this.countries };
      } catch (error: any) {
        const errorData = error.response?.data;
        return { status: false, message: errorData?.message || "Failed to fetch countries" };
      }
    },

    // ✅ Signup Step 2: Verify OTP
    async signupVerifyOtp(payload: { email: string; otp: string }) {
      try {
        const res = await endpoint.post("/api/admin/users/signup/verify-otp/", payload);

        const data = res.data;

        if (data.tokens?.access && data.user) {
          this.setAuth(data.tokens.access, data.user);

          if (data.tokens.refresh) {
            sessionStorage.setItem("refreshToken", data.tokens.refresh);
          }

          sessionStorage.setItem("authenticated", "true");
          sessionStorage.setItem("isNewUser", "true");
        }

        return { status: true, data, message: data.message };
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.message || errorData?.error || errorData?.detail || "OTP verification failed";
        return {
          status: false,
          message: errorMessage,
          details: errorData || null,
        };
      }
    },

    // ✅ LOGIN
    async login(payload: {
      email: string;
      password: string;
      recaptcha: string;
      testing_type?: string[];
    }) {
      try {
        // Clear any stale token and cached data so it doesn't get attached to the login request
        clearAllAuthTokens();
        localStorage.removeItem("reportId");
        this.reportStatus.reportId = null;
        this.reportStatus.checked = false;

        let res;
        try {
          res = await endpoint.post("/api/admin/users/login/", payload);
        } catch (primaryError: any) {
          // Some backend environments still expose user-login instead of login.
          const status = primaryError?.response?.status;
          if (status === 404 || status === 405) {
            res = await endpoint.post("/api/admin/users/user-login/", payload);
          } else {
            throw primaryError;
          }
        }

        const data = res.data;

        if (data.tokens?.access) {
          this.setAuth(data.tokens.access, data.user);

          if (data.tokens.refresh) {
            sessionStorage.setItem("refreshToken", data.tokens.refresh);
          }
        }

        sessionStorage.setItem("isNewUser", "false");

        return { status: true, data, message: data.message };
      } catch (error: any) {
        const errorData = error.response?.data;
        const fieldErrors =
          errorData && typeof errorData === "object"
            ? (Object.values(errorData) as any[])
                .flatMap((v) => (Array.isArray(v) ? v : [v]))
                .filter((v) => typeof v === "string")
                .join(" ")
            : "";
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          errorData?.detail ||
          (Array.isArray(errorData?.non_field_errors) ? errorData.non_field_errors[0] : null) ||
          fieldErrors ||
          "Login failed";

        return {
          status: false,
          message: errorMessage,
          details: errorData || null,
        };
      }
    },

    // ✅ Google login
    async googleLogin(id_token: string) {
      try {
        const res = await endpoint.post("/api/admin/users/google-oauth/", { id_token });
        const data = res.data;

        if (!data?.tokens?.access || !data?.user) {
          return { status: false, message: "Google login failed" };
        }

        this.setAuth(data.tokens.access, data.user);
        sessionStorage.setItem("refreshToken", data.tokens.refresh);
        localStorage.removeItem("reportId");
        this.reportStatus.reportId = null;
        this.reportStatus.checked = false;

        sessionStorage.setItem("isNewUser", data.is_new_user === true ? "true" : "false");

        return { status: true, user: data.user, tokens: data.tokens };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message || "Google login failed",
        };
      }
    },

    // ✅ Forgot Password
    async forgotPassword(payload: { email: string }) {
      try {
        const res = await endpoint.post("/api/admin/users/forgot-password/", payload);
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message || "Request failed",
          details: error.response?.data || null,
        };
      }
    },

    // 🔹 USER FORGOT PASSWORD
    async userForgotPassword(payload: { email: string }) {
      try {
        const res = await endpoint.post("/api/admin/users/user-forgot-password/", payload);
        return { status: true, data: res.data, message: res.data?.msg || res.data?.message };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.msg ||
            error.response?.data?.message ||
            error.message ||
            "Request failed",
          details: error.response?.data || null,
        };
      }
    },

    // ✅ Reset Password
    async resetPassword(payload: {
      uidb64: string;
      token: string;
      password: string;
      confirm_password: string;
    }) {
      try {
        const { uidb64, token, password, confirm_password } = payload;
        const res = await endpoint.post(`/api/admin/users/reset-password/${uidb64}/${token}/`, {
          password,
          confirm_password,
        });
        return { status: true, data: res.data, message: res.data.msg };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "Reset failed",
          details: error.response?.data || null,
        };
      }
    },

    // ✅ Get Member Profile
    async getMemberProfile() {
      try {
        const response = await endpoint.get("/api/admin/users_details/member-profile/");
        const data = response.data;
        return { status: true, data };
      } catch (error) {
        console.error("Member profile fetch error:", error);
        return { status: false, message: "Unable to fetch profile" };
      }
    },

    // ✅ Get User Profile
    async getUserProfile() {
      try {
        const response = await endpoint.get("/api/admin/users/profile/");
        const data = response.data;
        const userObj = data?.user ?? data?.data?.user ?? null;

        if (userObj) {
          this.user = userObj;
          sessionStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("user", JSON.stringify(userObj));
          return { status: true, data: { ...data, user: userObj } };
        }

        if (data?.status === true && data?.user) {
          this.user = data.user;
          sessionStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
          return { status: true, data };
        }

        return { status: false, message: data?.message || "Unable to fetch profile" };
      } catch (error) {
        console.error("Profile fetch error:", error);
        return { status: false, message: "Unable to fetch profile" };
      }
    },

    // ✅ Update User Profile (Admin)
    async updateUserProfile(payload: Record<string, string>) {
      try {
        const res = await endpoint.patch("/api/admin/users/profile/", payload);
        const userObj = res.data?.user ?? res.data?.data?.user ?? null;
        if (userObj) {
          this.user = userObj;
          sessionStorage.setItem("user", JSON.stringify(userObj));
          localStorage.setItem("user", JSON.stringify(userObj));
        }
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message || "Failed to update profile",
          details: error.response?.data || null,
        };
      }
    },

    // ✅ Update Member Profile (User portal)
    async updateMemberProfile(payload: { first_name?: string; last_name?: string }) {
      try {
        const res = await endpoint.patch("/api/admin/users_details/member-profile/", payload);
        const userObj = res.data?.user ?? res.data?.data?.user ?? res.data ?? null;
        if (userObj && typeof userObj === "object") {
          const merged = { ...(this.user || {}), ...userObj };
          this.user = merged;
          sessionStorage.setItem("user", JSON.stringify(merged));
          localStorage.setItem("user", JSON.stringify(merged));
        }
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message || "Failed to update profile",
          details: error.response?.data || null,
        };
      }
    },

    // ✅ Change Password
    async changePassword(payload: {
      old_password: string;
      new_password: string;
      confirm_password: string;
    }) {
      try {
        const res = await endpoint.put("/api/admin/users/change-password/", payload);
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message || "Failed to change password",
          details: error.response?.data || null,
        };
      }
    },

    // ✅ Get admin testing types for upload report page
    async getAdminTestingTypes(adminId: string) {
      try {
        const res = await endpoint.get(`/api/admin/users/${adminId}/testing-type/`);

        const raw = res.data?.data?.testing_type;

        let testingTypes: string[] = [];

        // Backend returns string like "['white_box', 'grey_box']"
        if (typeof raw === "string") {
          testingTypes = JSON.parse(raw.replace(/'/g, '"'));
        }

        return {
          status: true,
          testingTypes,
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || "Failed to fetch testing types",
        };
      }
    },

    /** Admin id for add-user-detail — survives Slack/Teams OAuth popup flow. */
    resolveAdminId(): string | null {
      const fromStore = this.user?._id || this.user?.id;
      if (fromStore) return String(fromStore);

      // ✅ JWT token se user_id nikalo — Slack login ke baad most reliable source
      try {
        const token =
          sessionStorage.getItem("authorization") || localStorage.getItem("authorization");
        if (token) {
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.user_id) return String(payload.user_id);
          }
        }
      } catch {
        /* ignore */
      }

      for (const key of ["local_user", "user"] as const) {
        try {
          const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === "object") {
            const id = parsed._id || parsed.id;
            if (id) return String(id);
          }
        } catch {
          /* ignore */
        }
      }
      return null;
    },

    /** Prefer full app user object over Slack display name string from postMessage. */
    resolveOAuthAppUser(payload: Record<string, any> | null = null): Record<string, any> | null {
      const candidates = [payload?.local_user, payload?.user, payload?.app_user];
      for (const c of candidates) {
        if (c && typeof c === "object" && !Array.isArray(c)) {
          return c as Record<string, any>;
        }
      }
      try {
        const localUser = JSON.parse(localStorage.getItem("local_user") || "null");
        if (localUser && typeof localUser === "object") return localUser;
      } catch {
        /* ignore */
      }
      if (this.user && typeof this.user === "object") return this.user as Record<string, any>;
      return null;
    },

    hydrateAuthSessionFromOAuth(payload: Record<string, any> | null = null): boolean {
      const djangoAccessToken =
        payload?.django_access_token ||
        sessionStorage.getItem("authorization") ||
        localStorage.getItem("django_access_token");
      const djangoRefreshToken =
        payload?.django_refresh_token ||
        sessionStorage.getItem("refreshToken") ||
        localStorage.getItem("django_refresh_token");

      if (!djangoAccessToken) return false;

      const oauthUser = this.resolveOAuthAppUser(payload);
      this.setAuth(djangoAccessToken, oauthUser || this.user || {});
      if (djangoRefreshToken) {
        sessionStorage.setItem("refreshToken", djangoRefreshToken);
      }
      sessionStorage.setItem("authenticated", "true");
      return true;
    },

    // ✅ Create User Detail
    async createUserDetail(payload: CreateUserPayload) {
      try {
        const res = await endpoint.post("/api/admin/users_details/add-user-detail/", payload);
        const data = res.data;
        console.log("✅ User created successfully:", data);

        return {
          status: true,
          message: data.message || "User created successfully",
          data: data.data || {},
          slack_sync: data.slack_sync,
        };
      } catch (error: unknown) {
        const err = error as any;
        console.error("❌ Failed to create user detail:", err);

        return {
          status: false,
          message: err.response?.data?.message || err.message || "Create user detail failed",
          details: err.response?.data || null,
        };
      }
    },

    /**
     * DB save (add-user-detail) then Slack/Teams invite — same order as LocationView.
     * Postman invite/add-user APIs alone do not create VaptFix DB records.
     * slack_bot_token is NOT sent on create — backend was inviting on Slack without DB row.
     */
    async addTeamMemberWithPlatformSync(payload: CreateUserPayload) {
      const memberRoles = Array.isArray(payload.Member_role)
        ? payload.Member_role
        : payload.Member_role
          ? [payload.Member_role]
          : [];

      const email = payload.email.trim();
      const profile = this.resolveMemberProfileByEmail(email);
      const platforms = this.detectAdminCommunicationPlatforms();
      const defaultFirst =
        platforms.includes("teams") && !platforms.includes("slack") ? "Teams" : "Member";

      const dbPayload: CreateUserPayload = {
        ...payload,
        email,
        first_name: (payload.first_name || profile.first_name || defaultFirst).trim(),
        last_name: (payload.last_name || profile.last_name || "User").trim(),
      };
      delete dbPayload.slack_bot_token;

      const res = await this.createUserDetail(dbPayload);
      if (!res.status) {
        return { ...res, platformSync: { status: false, skipped: true, message: res.message } };
      }

      let platformSync: { status: boolean; skipped?: boolean; message?: string } = {
        status: true,
        skipped: true,
      };
      if (platforms.length > 0) {
        platformSync = await this.syncNewUserToAllConnectedPlatforms(email, { memberRoles });
      }

      return { ...res, platformSync };
    },

    /** User already in Slack/Teams channel but missing in DB — register by email + roles. */
    async importPlatformMemberToDatabase(payload: {
      email: string;
      memberRoles: string[];
      user_type?: string;
      first_name?: string;
      last_name?: string;
    }) {
      const adminId = this.resolveAdminId();
      if (!adminId) {
        return { status: false, message: "Admin not found. Please sign in again." };
      }
      const email = payload.email.trim();
      const profile = this.resolveMemberProfileByEmail(email);
      const platforms = this.detectAdminCommunicationPlatforms();
      const defaultFirst =
        platforms.includes("teams") && !platforms.includes("slack") ? "Teams" : "Member";

      return this.addTeamMemberWithPlatformSync({
        admin_id: adminId,
        email,
        user_type: payload.user_type || "internal",
        first_name: (payload.first_name || profile.first_name || defaultFirst).trim(),
        last_name: (payload.last_name || profile.last_name || "User").trim(),
        Member_role: payload.memberRoles,
      });
    },

    // ✅ Create User Detail + Slack Sync
    // async createUserDetail(payload: CreateUserPayload) {
    //   try {
    //     const res = await endpoint.post(
    //       "/api/admin/users_details/add-user-detail/",
    //       payload
    //     );

    //     const data = res.data;

    //     console.log("✅ User created + Slack sync:", data);

    //     return {
    //       status: true,
    //       message: data.message || "User created successfully",
    //       data: data.data || {},
    //       slack_sync: data.slack_sync || [],   // 🔥 NEW
    //       email_sent: data.email_sent || false // 🔥 NEW
    //     };

    //   } catch (error: unknown) {
    //     const err = error as any;

    //     console.error("❌ Failed to create user detail:", err);

    //     return {
    //       status: false,
    //       message:
    //         err.response?.data?.message ||
    //         err.message ||
    //         "Create user detail failed",
    //       details: err.response?.data || null,
    //     };
    //   }
    // },

    // ✅ Fetch  UsersByAdminid
    async fetchUsersByAdmin(force = false) {
      if (!force && this.usersByAdminFetched && this.cachedUsersByAdmin.length > 0) {
        return {
          status: true,
          message: "Users fetched successfully",
          data: this.cachedUsersByAdmin,
          count: this.cachedUsersByAdmin.length,
        };
      }
      try {
        const adminId = this.user?._id || this.user?.id;

        if (!adminId) {
          throw new Error("Admin ID not found");
        }

        const res = await endpoint.get(`/api/admin/users_details/admin/${adminId}/user-details/`);

        const data = res.data;
        this.cachedUsersByAdmin = Array.isArray(data.results) ? data.results : [];
        this.usersByAdminFetched = true;

        return {
          status: true,
          message: "Users fetched successfully",
          data: this.cachedUsersByAdmin,
          count: data.count || 0,
        };
      } catch (error: any) {
        console.error("❌ Failed to fetch users:", error);

        return {
          status: false,
          message: error.response?.data?.message || error.message || "Failed to fetch users",
          details: error.response?.data || null,
        };
      }
    },

    // Delete member role
    async deleteUserRole(userId: string, roleToRemove: string): Promise<any> {
      try {
        const res = await endpoint.delete(
          `/api/admin/users_details/user-detail/${userId}/delete-role/`,
          {
            data: {
              confirm: true,
              member_role: roleToRemove,
            },
          },
        );

        return {
          status: true,
          message: res.data.message,
          remaining_roles: res.data.remaining_roles,
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message,
        };
      }
    },

    // Delete User Entirely
    async deleteUserDetail(userId: string): Promise<any> {
      try {
        const res = await endpoint.delete(
          `/api/admin/users_details/user-detail/${userId}/delete/`,
          { data: { confirm: true } },
        );
        return { status: true, message: res.data.message };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message,
        };
      }
    },

    // Update Member Role
    async updateUserRoles(userId: string, newRoles: string[]): Promise<any> {
      try {
        const res = await endpoint.patch(
          `/api/admin/users_details/user-detail/${userId}/update-role/`,
          { new_roles: newRoles },
        );

        return {
          status: true,
          message: res.data.message,
          updated_roles: res.data.updated_roles,
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message,
        };
      }
    },

    // ✅ Add Risk Criteria
    async addRiskCriteria(payload: any) {
      try {
        const body = {
          critical: payload.critical,
          high: payload.high,
          medium: payload.medium,
          low: payload.low,
        };

        const res = await endpoint.post("/api/admin/risk_criteria/add-risk/", body);

        if (res.status === 200 || res.status === 201) {
          const riskCriteria = res.data.risk_criteria;
          if (riskCriteria?._id) {
            localStorage.setItem("riskCriteriaId", riskCriteria._id);
          }
          console.log("✅ Risk Criteria created successfully:", res.data);
          return { status: true, message: res.data.message, data: res.data.risk_criteria };
        }

        return { status: false, message: "Failed to create Risk Criteria" };
      } catch (error: any) {
        console.error("❌ Error adding Risk Criteria:", error);
        return {
          status: false,
          message: error?.response?.data?.message || error.message || "Failed to add Risk Criteria",
        };
      }
    },

    // ✅ GET Risk Criteria (User side)
    async fetchUserRiskCriteria() {
      try {
        const res = await endpoint.get(`/api/user/risk_criteria/risks/`);
        const list = res.data?.risk_criteria;
        if (Array.isArray(list) && list.length > 0) {
          return { status: true, data: list[0] };
        }
        return { status: false, message: "No risk criteria found" };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch risk criteria",
        };
      }
    },

    // ✅ UPDATE Risk Criteria (User side)
    async updateUserRiskCriteria(payload: Record<string, string>) {
      try {
        const riskId = localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskId) return { status: false, message: "Risk criteria ID not found." };

        const res = await endpoint.patch(
          `/api/user/risk_criteria/risks/${riskId}/update/`,
          payload,
        );

        // Clear mitigation timeline cache so dashboard reflects the new criteria immediately
        this.cachedMitigationTimeline = {};

        return { status: true, message: res.data.message, data: res.data };
      } catch (err: any) {
        return {
          status: false,
          message: err?.response?.data?.message || "Failed to update risk criteria",
        };
      }
    },

    // ✅ GET Risk Criteria by ID (User side)
    async getUserRiskCriteriaById() {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");

        if (!riskCriteriaId) {
          return { status: false, message: "Risk Criteria ID not found", isNotFound: true };
        }

        const res = await endpoint.get(`/api/user/risk_criteria/risks/${riskCriteriaId}/`);
        return { status: true, data: res.data };
      } catch (error: any) {
        const is404 = error?.response?.status === 404;
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch risk criteria",
          isNotFound: is404,
        };
      }
    },

    // ✅ GET Risk Criteria by Admin (no stored ID needed)
    async getRiskCriteriaByAdmin() {
      try {
        const res = await endpoint.get(`/api/admin/risk_criteria/by-admin/`);
        const data = res.data?.risk_criteria || res.data;
        if (data?._id) {
          localStorage.setItem("riskCriteriaId", data._id);
        }
        return { status: true, data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch risk criteria",
        };
      }
    },

    // ✅ LIST Risk Criteria (Admin side) — GET /api/admin/risk_criteria/risks/
    async fetchAdminRiskCriteria() {
      try {
        const res = await endpoint.get(`/api/admin/risk_criteria/risks/`);
        const list = res.data?.risk_criteria;
        if (Array.isArray(list) && list.length > 0) {
          const data = list[0];
          if (data?._id) {
            localStorage.setItem("riskCriteriaId", data._id);
            localStorage.setItem("riskId", data._id);
          }
          if (data?.admin_id) localStorage.setItem("adminId", data.admin_id);
          return { status: true, data };
        }
        return { status: false, message: "No risk criteria found" };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch risk criteria",
        };
      }
    },

    // ✅ GET Risk Criteria (from localStorage)
    async getRiskCriteriaById() {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");

        if (!riskCriteriaId) {
          return {
            status: false,
            message: "Risk Criteria ID not found",
            isNotFound: true,
          };
        }

        const res = await endpoint.get(`/api/admin/risk_criteria/risks/${riskCriteriaId}/`);

        return {
          status: true,
          data: res.data,
        };
      } catch (error: any) {
        const is404 = error?.response?.status === 404;

        if (is404) {
          console.log("ℹ️ No risk criteria found (404) - user can create new");
        } else {
          console.error("❌ Error fetching risk criteria:", error);
        }

        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch risk criteria",
          isNotFound: is404,
        };
      }
    },

    // update Risk Criteria
    async updateRiskCriteria(payload: RiskCriteriaPayload) {
      try {
        const riskId = localStorage.getItem("riskId") || localStorage.getItem("riskCriteriaId");
        if (!riskId)
          return {
            status: false,
            message: "Risk criteria ID not found. Please create risk criteria first.",
          };

        const res = await endpoint.put(`/api/admin/risk_criteria/risks/${riskId}/update/`, {
          critical: payload.critical,
          high: payload.high,
          medium: payload.medium,
          low: payload.low,
        });

        return { status: true, message: res.data.message, data: res.data };
      } catch (err: any) {
        return { status: false, message: err?.response?.data?.message };
      }
    },

    // ✅ GET Risk Criteria Calendar (Admin)
    async fetchRiskCriteriaCalendar(year: number, month: number) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const monthStr = `${year}-${String(month).padStart(2, "0")}`;
        const res = await endpoint.get(
          `/api/admin/risk_criteria/risks/${riskCriteriaId}/calendar/`,
          { params: { month: monthStr } },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch calendar",
        };
      }
    },

    // ✅ GET Risk Criteria Calendar (User side) — legacy, kept for compatibility
    async fetchUserRiskCriteriaCalendar(year: number, month: number) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const monthStr = `${year}-${String(month).padStart(2, "0")}`;
        const res = await endpoint.get(
          `/api/user/risk_criteria/risks/${riskCriteriaId}/calendar/`,
          { params: { month: monthStr } },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch calendar",
        };
      }
    },

    // ✅ User: Fetch Risk Criteria Calendar with team and severity filters
    async fetchUserRiskCriteriaCalendarWithFilters(
      year: number,
      month: number,
      team?: string,
      severity?: string,
    ) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const monthStr = `${year}-${String(month).padStart(2, "0")}`;
        const params: Record<string, string> = { month: monthStr };
        if (team) params.team = team;
        if (severity) params.severity = severity;
        const res = await endpoint.get(
          `/api/user/risk_criteria/risks/${riskCriteriaId}/calendar/`,
          { params },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch user calendar",
        };
      }
    },

    // ✅ User: Fetch Risk Criteria Calendar Week View
    async fetchUserRiskCriteriaCalendarWeek(date: string) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const res = await endpoint.get(
          `/api/user/risk_criteria/risks/${riskCriteriaId}/calendar/week/`,
          { params: { date } },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch user week calendar",
        };
      }
    },

    // ✅ User: Fetch Risk Criteria Calendar Day View
    async fetchUserRiskCriteriaCalendarDay(date: string) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const res = await endpoint.get(
          `/api/user/risk_criteria/risks/${riskCriteriaId}/calendar/day/`,
          { params: { date } },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch user day calendar",
        };
      }
    },

    //Microsoft Teams
    async getMicrosoftOAuthUrl(redirectUri: string, adminId?: string | null) {
      try {
        let url = `/api/admin/users/microsoft-teams/oauth-url/?redirect_uri=${encodeURIComponent(redirectUri)}`;
        if (adminId) {
          url += `&admin_id=${encodeURIComponent(adminId)}`;
        }
        const res = await endpoint.get(url);

        if (res.data?.auth_url) {
          return { status: true, data: res.data };
        }
        return { status: false, message: "Auth URL not received" };
      } catch (error) {
        console.error("Microsoft OAuth API error:", error);
        return { status: false, message: "API failed" };
      }
    },
    async microsoftLogin(accessToken: string) {
      try {
        const response = await endpoint.post("/api/admin/users/microsoft-teams-oauth/", {
          access_token: accessToken,
        });

        const data = response.data;

        // basic validation
        if (!data || !data.tokens || !data.user) {
          return { status: false, message: "Invalid login response" };
        }

        // 🔐 Save app JWT tokens
        localStorage.setItem("teams_access_token", data.tokens.access);
        localStorage.setItem("teams_refresh_token", data.tokens.refresh);

        // 🔐 Save Django JWT tokens for API Authorization header (main auth tokens go to sessionStorage)
        if (data.django_access_token) {
          sessionStorage.setItem("authorization", data.django_access_token);
        }
        if (data.django_refresh_token) {
          sessionStorage.setItem("refreshToken", data.django_refresh_token);
        }

        // 👤 Save Microsoft user
        localStorage.setItem("teams_user", JSON.stringify(data.user));

        // 🧠 Save Microsoft graph token (used for Teams APIs)
        localStorage.setItem("microsoft_graph_token", data.access_token);

        // 🏢 Save default VAPTFIX team info
        if (data?.vaptfix_team) {
          localStorage.setItem("vaptfix_team", JSON.stringify(data.vaptfix_team));

          // save default channels if present
          if (data.vaptfix_team.channels) {
            localStorage.setItem("vaptfix_channels", JSON.stringify(data.vaptfix_team.channels));
          }
        }

        // 🆕 Save new user flag
        localStorage.setItem("is_new_teams_user", String(data.is_new_user));

        // mark Teams connected
        localStorage.setItem("teams_connected", "true");

        const appAccess = data.tokens?.access;
        if (appAccess && data.user) {
          this.setAuth(appAccess, data.user);
          sessionStorage.setItem("authenticated", "true");
          if (data.is_new_user) {
            sessionStorage.setItem("isNewUser", "true");
          }
        }

        return {
          status: true,
          data,
        };
      } catch (error) {
        console.error("Microsoft login API error:", error);
        return { status: false, message: "Microsoft login failed" };
      }
    },
    // async microsoftLogin(accessToken: string) {
    //   try {
    //     const response = await endpoint.post(
    //       "/api/admin/users/microsoft-teams-oauth/",
    //       {
    //         access_token: accessToken,
    //       }
    //     );
    //     const data = response.data;
    //     if (data?.tokens && data?.user) {
    //       // save JWT tokens (your app auth)
    //       localStorage.setItem("teams_access_token", data.tokens.access);
    //       localStorage.setItem("teams_refresh_token", data.tokens.refresh);

    //       // Microsoft user
    //       localStorage.setItem("teams_user", JSON.stringify(data.user));

    //       // Microsoft graph token
    //       localStorage.setItem("microsoft_graph_token", data.access_token);

    //       localStorage.setItem("teams_connected", "true");

    //       return { status: true, data };
    //     }

    //     return { status: false };
    //   } catch (error) {
    //     console.error("Microsoft login API error:", error);
    //     return { status: false };
    //   }
    // },
    async fetchMicrosoftTeams() {
      try {
        const graphToken = localStorage.getItem("microsoft_graph_token");

        if (!graphToken) {
          return { status: false, message: "Graph token missing" };
        }

        const response = await endpoint.post(
          "/api/admin/users/teams/list/",
          {},
          {
            headers: {
              Authorization: `Bearer ${graphToken}`,
            },
          },
        );

        const data = response.data;

        if (data?.teams) {
          localStorage.setItem("microsoft_teams_list", JSON.stringify(data.teams));
          if (data.refreshed_access_token) {
            localStorage.setItem("microsoft_graph_token", data.refreshed_access_token);
          }
          return {
            status: true,
            teams: data.teams,
            refreshed_access_token: data.refreshed_access_token || null,
          };
        }

        return { status: false };
      } catch (error) {
        console.error("Teams list API error:", error);
        return { status: false };
      }
    },
    async fetchTeamChannels(teamId: string) {
      try {
        const graphToken = localStorage.getItem("microsoft_graph_token");

        if (!graphToken) {
          return { status: false, message: "Graph token missing" };
        }

        const response = await endpoint.post("/api/admin/users/teams/channels/list/", {
          access_token: graphToken,
          team_id: teamId,
        });

        const data = response.data;

        if (data?.channels) {
          // save channels for later use
          localStorage.setItem(`teams_channels_${teamId}`, JSON.stringify(data.channels));

          return { status: true, channels: data.channels };
        }

        return { status: false };
      } catch (error) {
        console.error("Teams channels API error:", error);
        return { status: false };
      }
    },
    async sendMessageToTeamsChannel({
      teamId,
      channelId,
      message,
    }: {
      teamId: string;
      channelId: string;
      message: string;
    }) {
      try {
        const graphToken = localStorage.getItem("microsoft_graph_token");

        if (!graphToken) {
          return { status: false, message: "Graph token missing" };
        }

        const response = await endpoint.post("/api/admin/users/teams/messages/send/", {
          access_token: graphToken,
          team_id: teamId,
          channel_id: channelId,
          message: message,
        });

        const data = response.data;

        if (data?.messageDetails) {
          return {
            status: true,
            messageId: data.messageDetails.id,
            createdAt: data.messageDetails.createdDateTime,
          };
        }

        return { status: false };
      } catch (error) {
        console.error("Send Teams message API error:", error);
        return { status: false };
      }
    },

    // ✅ Add user to a Microsoft Teams channel
    async addUserToTeamsChannel({
      teamId,
      channelId,
      channelName,
      userEmail,
      userRole = "member",
    }: {
      teamId: string;
      channelId: string;
      channelName: string;
      userEmail: string;
      userRole?: string;
    }) {
      try {
        const graphToken = localStorage.getItem("microsoft_graph_token");
        if (!graphToken) {
          return { status: false, message: "Graph token missing" };
        }
        console.log("Calling Add User to Teams Channel API...");
        const res = await endpoint.post("/api/admin/users/teams/channels/add-user/", {
          access_token: graphToken,
          team_id: teamId,
          channel_id: channelId,
          channel_name: channelName,
          user_email: userEmail,
          user_role: userRole,
        });
        console.log("Teams add user response:", res.data);
        if (res.data?.success) {
          return { status: true, data: res.data.data };
        }
        return { status: false, message: res.data?.message };
      } catch (error: any) {
        console.error("Add user to Teams channel error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Failed to add user to Teams channel",
        };
      }
    },

    // ✅ MS Teams members sync karo — backend API
    async syncTeamsMembers(teamId?: string) {
      try {
        const body: Record<string, string> = {};
        if (teamId) body.team_id = teamId;
        const res = await endpoint.post("/api/admin/users/teams/sync-members/", body);
        const data = res.data;
        console.log(`✅ Teams sync: ${data.new_count ?? 0} new member(s) added`);
        return {
          status: true,
          new_count: data.new_count ?? 0,
          synced_count: data.synced_count ?? 0,
          members: data.members ?? [],
          message: data.message ?? "",
        };
      } catch (error: any) {
        console.error("❌ Teams sync error:", error);
        return { status: false, message: error?.response?.data?.message || "Sync failed" };
      }
    },

    async subscribeTeamsWebhook(teamId: string) {
      try {
        const graphToken = localStorage.getItem("microsoft_graph_token");
        if (!graphToken || !teamId) return { status: false };
        const res = await endpoint.post("/api/admin/users/teams/webhook/subscribe/", {
          access_token: graphToken,
          team_id: teamId,
        });
        return { status: true, data: res.data };
      } catch (error) {
        console.error("Teams webhook subscribe error:", error);
        return { status: false };
      }
    },

    getVaptfixTeamId(): string | null {
      try {
        const vaptfixTeam = JSON.parse(localStorage.getItem("vaptfix_team") || "null");
        const teamId = vaptfixTeam?.team_id || vaptfixTeam?.id;
        return teamId ? String(teamId) : null;
      } catch {
        return null;
      }
    },

    getTeamsChannelsFromStorage(): any[] {
      const merged: any[] = [];
      const seen = new Set<string>();
      const addChannel = (ch: any) => {
        const id = String(ch?.id || ch?.channel_id || "");
        if (!id || seen.has(id)) return;
        seen.add(id);
        merged.push(ch);
      };

      try {
        const raw = localStorage.getItem("vaptfix_channels");
        const parsed = raw ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) parsed.forEach(addChannel);
      } catch {
        /* ignore */
      }

      const teamId = this.getVaptfixTeamId();
      if (teamId) {
        try {
          const rawTeam = localStorage.getItem(`teams_channels_${teamId}`);
          const parsedTeam = rawTeam ? JSON.parse(rawTeam) : [];
          if (Array.isArray(parsedTeam)) parsedTeam.forEach(addChannel);
        } catch {
          /* ignore */
        }
      }
      return merged;
    },

    /** Load Teams channels from API if cache empty (needed for PM/CM channel mapping). */
    async ensureTeamsChannelsCached(): Promise<void> {
      if (this.getTeamsChannelsFromStorage().length > 0) return;

      const teamId = this.getVaptfixTeamId();
      if (!teamId) return;

      const res = await this.fetchTeamChannels(teamId);
      if (res.status && Array.isArray(res.channels) && res.channels.length > 0) {
        localStorage.setItem("vaptfix_channels", JSON.stringify(res.channels));
        localStorage.setItem(`teams_channels_${teamId}`, JSON.stringify(res.channels));
      }
    },

    /** All connected platforms — Slack no longer blocks Teams when both are linked. */
    detectAdminCommunicationPlatforms(): ("slack" | "teams")[] {
      const platforms: ("slack" | "teams")[] = [];
      if (localStorage.getItem("slack_bot_token")) platforms.push("slack");
      const graphToken = localStorage.getItem("microsoft_graph_token");
      const teamId = this.getVaptfixTeamId();
      if (graphToken && teamId) platforms.push("teams");
      return platforms;
    },

    detectAdminCommunicationPlatform(): "slack" | "teams" | null {
      const platforms = this.detectAdminCommunicationPlatforms();
      if (platforms.includes("teams") && localStorage.getItem("teams_connected") === "true") {
        return "teams";
      }
      return platforms[0] || null;
    },

    resolveDefaultTeamsChannel(): { channelId: string; channelName: string } | null {
      try {
        const channels = this.getTeamsChannelsFromStorage();
        if (!Array.isArray(channels) || channels.length === 0) return null;
        const preferred =
          channels.find((c) =>
            /general/i.test(String(c.displayName || c.name || c.channel_name || "")),
          ) || channels[0];
        const channelId = preferred.id || preferred.channel_id;
        const channelName =
          preferred.displayName || preferred.name || preferred.channel_name || "General";
        if (!channelId) return null;
        return { channelId: String(channelId), channelName: String(channelName) };
      } catch {
        return null;
      }
    },

    resolveDefaultSlackChannelId(): string | null {
      try {
        const raw = localStorage.getItem("slack_channels");
        const channels = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(channels) || channels.length === 0) return null;
        const ch = channels[0];
        const id = ch?.id || ch?.channel_id;
        return id ? String(id) : null;
      } catch {
        return null;
      }
    },

    resolveSlackUserIdByEmail(email: string): string | null {
      try {
        const raw = localStorage.getItem("slack_users");
        const users = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(users)) return null;
        const normalized = email.trim().toLowerCase();
        const match = users.find(
          (u) => String(u.profile?.email || u.email || "").toLowerCase() === normalized,
        );
        const id = match?.id || match?.user_id;
        return id ? String(id) : null;
      } catch {
        return null;
      }
    },

    resolveSlackProfileByEmail(email: string): {
      first_name: string;
      last_name: string;
      slack_user_id: string | null;
    } {
      try {
        const raw = localStorage.getItem("slack_users");
        const users = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(users)) {
          return { first_name: "", last_name: "", slack_user_id: null };
        }
        const normalized = email.trim().toLowerCase();
        const match = users.find(
          (u) => String(u.profile?.email || u.email || "").toLowerCase() === normalized,
        );
        if (!match) {
          return { first_name: "", last_name: "", slack_user_id: null };
        }
        const fullName = String(
          match.profile?.real_name || match.real_name || match.name || "",
        ).trim();
        const parts = fullName.split(/\s+/).filter(Boolean);
        return {
          first_name: parts[0] || "",
          last_name: parts.slice(1).join(" ") || "",
          slack_user_id: match.id || match.user_id || null,
        };
      } catch {
        return { first_name: "", last_name: "", slack_user_id: null };
      }
    },

    /** Map VaptFix roles (Patch Management, etc.) to Slack channel names. */
    resolveSlackChannelIdsByMemberRoles(memberRoles: string[]): string[] {
      const roleKeywords: Record<string, string[]> = {
        "Patch Management": ["patch"],
        "Configuration Management": ["config"],
        "Network Security": ["network"],
        "Architectural Flaws": ["architect", "flaw"],
      };

      let channels: any[] = [];
      try {
        const raw = localStorage.getItem("slack_channels");
        channels = raw ? JSON.parse(raw) : [];
      } catch {
        channels = [];
      }
      if (!Array.isArray(channels) || channels.length === 0) return [];

      const ids = new Set<string>();
      const roles = memberRoles.map((r) => String(r).trim()).filter(Boolean);

      for (const role of roles) {
        const keywords =
          roleKeywords[role] || [role.split(/\s+/)[0]?.toLowerCase()].filter(Boolean);
        for (const ch of channels) {
          const name = String(ch.name || ch.channel_name || "").toLowerCase();
          if (keywords.some((kw) => kw && name.includes(kw))) {
            const id = ch.id || ch.channel_id;
            if (id) ids.add(String(id));
          }
        }
      }

      if (ids.size === 0) {
        const fallback = this.resolveDefaultSlackChannelId();
        if (fallback) ids.add(fallback);
      }
      return [...ids];
    },

    resolveMemberProfileByEmail(email: string): {
      first_name: string;
      last_name: string;
      slack_user_id: string | null;
    } {
      const slack = this.resolveSlackProfileByEmail(email);
      if (slack.first_name || slack.last_name) {
        return slack;
      }
      const localPart = email.split("@")[0] || "";
      const parts = localPart
        .replace(/[._+-]/g, " ")
        .split(/\s+/)
        .filter(Boolean);
      return {
        first_name: parts[0] ? parts[0].charAt(0).toUpperCase() + parts[0].slice(1) : "Teams",
        last_name: parts.slice(1).join(" ") || "Member",
        slack_user_id: slack.slack_user_id,
      };
    },

    resolveTeamsChannelsByMemberRoles(
      memberRoles: string[],
    ): { channelId: string; channelName: string }[] {
      const channels = this.getTeamsChannelsFromStorage();
      if (!Array.isArray(channels) || channels.length === 0) {
        const single = this.resolveDefaultTeamsChannel();
        return single ? [single] : [];
      }

      const roleKeywords: Record<string, string[]> = {
        "Patch Management": ["patch"],
        "Configuration Management": ["config"],
        "Network Security": ["network"],
        "Architectural Flaws": ["architect", "flaw"],
      };

      const matched: { channelId: string; channelName: string }[] = [];
      const roles = memberRoles.map((r) => String(r).trim()).filter(Boolean);

      for (const role of roles) {
        const keywords =
          roleKeywords[role] || [role.split(/\s+/)[0]?.toLowerCase()].filter(Boolean);
        for (const ch of channels) {
          const name = String(ch.displayName || ch.name || ch.channel_name || "").toLowerCase();
          if (keywords.some((kw) => kw && name.includes(kw))) {
            const channelId = ch.id || ch.channel_id;
            if (channelId) {
              matched.push({
                channelId: String(channelId),
                channelName: String(ch.displayName || ch.name || ch.channel_name || "General"),
              });
            }
          }
        }
      }

      if (matched.length === 0) {
        const single = this.resolveDefaultTeamsChannel();
        return single ? [single] : [];
      }

      const seen = new Set<string>();
      return matched.filter((c) => {
        if (seen.has(c.channelId)) return false;
        seen.add(c.channelId);
        return true;
      });
    },

    async syncNewUserToAllConnectedPlatforms(
      userEmail: string,
      options: { memberRoles?: string[] } = {},
    ): Promise<{ status: boolean; skipped?: boolean; message?: string }> {
      const platforms = this.detectAdminCommunicationPlatforms();
      if (platforms.length === 0) {
        return { status: true, skipped: true };
      }

      const errors: string[] = [];
      let anySuccess = false;

      for (const platform of platforms) {
        if (platform === "teams") {
          await this.ensureTeamsChannelsCached();
        }
        const res = await this.syncNewUserToCommunicationPlatform(userEmail, {
          ...options,
          forcePlatform: platform,
        });
        if (res.status) anySuccess = true;
        else if (!res.skipped) errors.push(`${platform}: ${res.message || "failed"}`);
      }

      if (anySuccess) {
        return {
          status: true,
          message:
            errors.length > 0
              ? `Synced with warnings: ${errors.join("; ")}`
              : "User synced to connected platform(s)",
        };
      }
      return {
        status: false,
        message: errors.join("; ") || "Failed to sync user to Slack/Teams",
      };
    },

    async syncNewUserToCommunicationPlatform(
      userEmail: string,
      options: { memberRoles?: string[]; forcePlatform?: "slack" | "teams" } = {},
    ) {
      const platform = options.forcePlatform || this.detectAdminCommunicationPlatform();
      if (!platform) {
        return { status: true, skipped: true };
      }

      const memberRoles = (options.memberRoles || []).map((r) => String(r).trim()).filter(Boolean);
      const email = userEmail.trim();

      if (platform === "teams") {
        await this.ensureTeamsChannelsCached();
        const teamId = this.getVaptfixTeamId();
        const channels = this.resolveTeamsChannelsByMemberRoles(memberRoles);
        if (!teamId || channels.length === 0) {
          return {
            status: false,
            message: "Teams team or channel not configured. Reconnect Microsoft Teams.",
          };
        }

        const errors: string[] = [];
        for (const channel of channels) {
          const res = await this.addUserToTeamsChannel({
            teamId: String(teamId),
            channelId: channel.channelId,
            channelName: channel.channelName,
            userEmail: email,
            userRole: "member",
          });
          if (!res.status) {
            errors.push(res.message || `Failed for ${channel.channelName}`);
          }
        }
        if (errors.length === channels.length) {
          return { status: false, message: errors.join("; ") };
        }
        return {
          status: true,
          message:
            errors.length > 0
              ? `Added to some Teams channels. Issues: ${errors.join("; ")}`
              : "User added to Microsoft Teams channel(s)",
        };
      }

      const botToken = localStorage.getItem("slack_bot_token");
      if (!botToken) {
        return { status: false, message: "Slack not connected" };
      }

      const usersRes = await this.listSlackUsers(botToken);
      if (usersRes.status && usersRes.users?.length) {
        localStorage.setItem("slack_users", JSON.stringify(usersRes.users));
      }

      let channelIds = this.resolveSlackChannelIdsByMemberRoles(memberRoles);
      if (channelIds.length === 0) {
        const channelsRes = await this.listSlackChannels();
        if (channelsRes.status && channelsRes.channels?.length) {
          localStorage.setItem("slack_channels", JSON.stringify(channelsRes.channels));
          channelIds = this.resolveSlackChannelIdsByMemberRoles(memberRoles);
        }
      }

      if (channelIds.length === 0) {
        return {
          status: false,
          message: "Slack channel not configured. Reconnect Slack or pick a default channel.",
        };
      }

      const slackUserId = this.resolveSlackUserIdByEmail(email);
      const errors: string[] = [];

      for (const channelId of channelIds) {
        if (slackUserId) {
          const inviteRes = await this.inviteSlackUser(channelId, [slackUserId]);
          if (!inviteRes.status) {
            errors.push(inviteRes.message || `Invite failed for channel ${channelId}`);
          }
        } else {
          const addRes = await this.addUserToSlackChannel(botToken, channelId, "", email);
          if (!addRes.status) {
            errors.push(addRes.message || `Add failed for channel ${channelId}`);
          }
        }
      }

      if (errors.length === channelIds.length) {
        return { status: false, message: errors.join("; ") };
      }
      return {
        status: true,
        message:
          errors.length > 0
            ? `Invited to some Slack channels. Issues: ${errors.join("; ")}`
            : "User invited to Slack channel(s)",
      };
    },

    async inviteSlackUser(channelId: string, slackUserIds: string[]) {
      try {
        const botToken = localStorage.getItem("slack_bot_token");
        if (!botToken) return { status: false, message: "Slack not connected" };
        const res = await endpoint.post("/api/admin/users/slack/channel/invite/", {
          access_token: botToken,
          channel: channelId,
          users: slackUserIds,
        });
        return { status: !!res.data?.success, data: res.data, message: res.data?.message };
      } catch (error) {
        console.error("Slack invite error:", error);
        return { status: false, message: "Failed to invite user to Slack channel" };
      }
    },

    // Slack
    async getSlackOAuthUrl(baseUrl: string, adminId?: string | null) {
      console.log(
        "Calling POST /api/admin/users/slack/oauth-url/ with baseUrl and adminId:",
        baseUrl,
        adminId || "(signup)",
      );
      const payload: { base_url: string; admin_id?: string } = { base_url: baseUrl };
      if (adminId) {
        payload.admin_id = adminId;
      }
      const res = await endpoint.post("/api/admin/users/slack/oauth-url/", payload);
      console.log("Slack OAuth URL response:", res.data);

      if (res.data.success) {
        return { status: true, data: res.data };
      }
      return { status: false };
    },
    async loginWithSlack(botToken: string, userToken: string) {
      console.log("=== loginWithSlack called ===");
      console.log("Bot Token:", botToken);
      console.log("User Token:", userToken);

      try {
        const res = await endpoint.post("/api/admin/users/slack/login/", {
          bot_access_token: botToken,
          user_access_token: userToken,
        });

        console.log("Slack login API response:", res.data);

        if (res.data.success) {
          const data = res.data.data;

          // ✅ Save tokens
          localStorage.setItem("slack_bot_token", data.bot_access_token);
          localStorage.setItem("slack_user_token", data.user_access_token);

          // ✅ Save team info
          if (data.team) {
            localStorage.setItem("slack_team", JSON.stringify(data.team));
          }

          // ✅ Save channels
          if (data.channels) {
            localStorage.setItem("slack_channels", JSON.stringify(data.channels));
          }

          // ✅ Save Slack user
          if (data.user) {
            this.user = data.user;
            localStorage.setItem("slack_user_login_data", JSON.stringify(data.user));
          }

          // ✅ Save local app user
          if (data.local_user) {
            localStorage.setItem("local_user", JSON.stringify(data.local_user));
          }

          const jwtAccess = data.jwt_tokens?.access || data.tokens?.access || data.access_token;
          const jwtRefresh = data.jwt_tokens?.refresh || data.tokens?.refresh;
          const appUser = data.local_user || data.user;
          if (jwtAccess) {
            this.setAuth(jwtAccess, appUser || {});
            if (jwtRefresh) {
              sessionStorage.setItem("refreshToken", jwtRefresh);
            }
            sessionStorage.setItem("authenticated", "true");
            if (data.is_new_user) {
              sessionStorage.setItem("isNewUser", "true");
            }
          }

          return { status: true, data };
        }

        return {
          status: false,
          message: res.data.message || "Slack login failed",
        };
      } catch (error: any) {
        console.error("loginWithSlack error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Slack login failed",
        };
      }
    },
    async validateSlackToken(accessToken: string) {
      try {
        const res = await endpoint.post("/api/admin/users/slack/validate-token/", {
          access_token: accessToken,
        });

        return res.data;
      } catch (error: any) {
        return {
          success: false,
          message: "Slack token validation failed",
        };
      }
    },
    async listSlackChannels() {
      try {
        const res = await endpoint.get("/api/admin/users/slack/channels/list/");

        if (res.data?.success) {
          return {
            status: true,
            channels: res.data.data?.channels || [],
          };
        }

        return {
          status: false,
          channels: [],
          message: res.data?.message || "Failed to fetch channels",
        };
      } catch (error: any) {
        console.error("List Slack channels error:", error);
        return {
          status: false,
          channels: [],
          message: error.response?.data?.message || "Failed to fetch channels",
        };
      }
    },
    async sendSlackMessage(
      accessToken: string,
      channel: string,
      text: string,
    ): Promise<SlackMessageResponse> {
      try {
        const res = await endpoint.post("/api/admin/users/slack/messages/send/", {
          access_token: accessToken,
          channel,
          text,
        });

        if (res.data?.success) {
          return {
            status: true,
            data: res.data.data,
          };
        }

        return {
          status: false,
          message: res.data?.message,
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || "Failed to send Slack message",
        };
      }
    },
    async listSlackUsers(accessToken: string) {
      try {
        console.log("Calling Slack Users List API...");

        const res = await endpoint.post("/api/admin/users/slack/users/list/", {
          access_token: accessToken,
        });

        console.log("Slack users response:", res.data);

        if (res.data?.success) {
          return {
            status: true,
            users: res.data.users || [],
          };
        }

        return {
          status: false,
          users: [],
        };
      } catch (error: any) {
        console.error("Slack users fetch error:", error);
        return {
          status: false,
          users: [],
          message: error.response?.data?.message || "Failed to fetch Slack users",
        };
      }
    },
    async addUserToSlackChannel(
      accessToken: string,
      channel: string,
      userId: string,
      userEmail?: string,
      userName?: string,
    ) {
      try {
        console.log("Calling Add User to Slack Channel API...");
        const body: Record<string, string> = {
          access_token: accessToken,
          channel: channel,
          user_id: userId,
        };
        if (userEmail) body.user_email = userEmail;
        if (userName) body.user_name = userName;
        const res = await endpoint.post("/api/admin/users/slack/channel/add-user/", body);
        console.log("Add user response:", res.data);
        if (res.data?.success) {
          return {
            status: true,
            data: res.data.data,
          };
        }
        return {
          status: false,
          message: res.data?.message,
        };
      } catch (error: any) {
        console.error("Add user to channel error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Failed to add user to Slack channel",
        };
      }
    },
    async inviteUsersToSlackChannel(accessToken: string, channel: string, users: string[]) {
      try {
        console.log("Calling Invite Users to Slack Channel API...");

        const djangoToken = sessionStorage.getItem("authorization");
        const res = await endpoint.post(
          "/api/admin/users/slack/channel/invite/",
          {
            access_token: accessToken,
            channel: channel,
            users: users,
          },
          djangoToken && djangoToken !== "null" && djangoToken !== "undefined"
            ? { headers: { Authorization: `Bearer ${djangoToken}` } }
            : undefined,
        );

        console.log("Invite users response:", res.data);

        if (res.data?.success) {
          return {
            status: true,
            data: res.data.data,
          };
        }

        return {
          status: false,
          message: res.data?.message,
        };
      } catch (error: any) {
        console.error("Invite users error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Failed to invite users to Slack channel",
        };
      }
    },
    async joinSlackChannel(accessToken: string, channel: string) {
      try {
        console.log("Calling Join Slack Channel API...");

        const res = await endpoint.post("/api/admin/users/slack/channel/join/", {
          access_token: accessToken,
          channel: channel,
        });

        console.log("Join channel response:", res.data);

        if (res.data?.success) {
          return {
            status: true,
            data: res.data.data,
          };
        }

        return {
          status: false,
          message: res.data?.message,
        };
      } catch (error: any) {
        console.error("Join channel error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Failed to join Slack channel",
        };
      }
    },

    // 🧠 Jira OAuth - Get Authorization URL
    async getJiraAuthUrl() {
      try {
        const res = await endpoint.get("/api/admin/users/jira/oauth-url/");
        const data = res.data;

        if (data?.auth_url) {
          console.log("🌐 Jira Auth URL:", data.auth_url);
          return { status: true, url: data.auth_url, state: data.state };
        } else {
          return { status: false, message: "No authorization URL received." };
        }
      } catch (error: any) {
        console.error("❌ Jira OAuth URL API error:", error);
        return {
          status: false,
          message:
            error.response?.data?.message || error.message || "Failed to fetch Jira OAuth URL",
          details: error.response?.data || null,
        };
      }
    },
    // 🧠 Jira OAuth - Handle Callback (exchange code for token)
    async handleJiraCallback(code: string, state: string) {
      try {
        const res = await endpoint.post("/api/admin/users/jira/oauth/", { code });
        const data = res.data;

        if (data?.jira_tokens?.access_token) {
          localStorage.setItem("jira_access_token", data.jira_tokens.access_token);
          if (data.jira_tokens.refresh_token) {
            localStorage.setItem("jira_refresh_token", data.jira_tokens.refresh_token);
          }
          if (data.jwt_tokens?.access) {
            sessionStorage.setItem("authorization", data.jwt_tokens.access);
          }
          if (data.jwt_tokens?.refresh) {
            sessionStorage.setItem("refreshToken", data.jwt_tokens.refresh);
          }
          return { status: true, data };
        }

        return { status: false, message: "No access token received" };
      } catch (error: any) {
        console.error("❌ Jira callback error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Jira authentication failed",
          details: error.response?.data || null,
        };
      }
    },
    // 🧠 Jira - Get Accessible Resources (Cloud IDs)
    async getJiraResources() {
      try {
        const jiraToken = localStorage.getItem("jira_access_token");
        if (!jiraToken) {
          return { status: false, message: "No Jira access token found" };
        }

        const res = await endpoint.get("/api/admin/users/jira/resources/", {
          headers: {
            "Jira-Access-Token": jiraToken,
          },
        });

        return { status: true, data: res.data.resources || res.data };
      } catch (error: any) {
        console.error("❌ Jira resources error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Failed to fetch Jira resources",
          details: error.response?.data || null,
        };
      }
    },

    // 🧠 Jira - Get Connected User Info
    async getJiraUser() {
      try {
        const jiraToken = localStorage.getItem("jira_access_token");
        if (!jiraToken) {
          return { status: false, message: "No Jira access token found" };
        }
        const res = await endpoint.get("/api/admin/users/jira/user/", {
          headers: { "Jira-Access-Token": jiraToken },
        });
        return { status: true, user: res.data.user };
      } catch (error: any) {
        console.error("❌ Jira user fetch error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Failed to fetch Jira user",
        };
      }
    },

    // 🧠 Jira - Validate Access Token
    async validateJiraToken(accessToken: string) {
      try {
        const res = await endpoint.post("/api/admin/users/jira/validate-token/", {
          access_token: accessToken,
        });
        const data = res.data;
        return { status: true, valid: data.valid, user: data.user };
      } catch (error: any) {
        console.error("❌ Jira token validation error:", error);
        return {
          status: false,
          valid: false,
          message: error.response?.data?.message || "Jira token validation failed",
        };
      }
    },

    // 🧠 Jira - Refresh Access Token
    async refreshJiraToken(refreshToken: string) {
      try {
        const res = await endpoint.post("/api/admin/users/jira/token/refresh/", {
          refresh_token: refreshToken,
        });
        const data = res.data;
        if (data?.access_token) {
          localStorage.setItem("jira_access_token", data.access_token);
          if (data.refresh_token) {
            localStorage.setItem("jira_refresh_token", data.refresh_token);
          }
          return { status: true, access_token: data.access_token };
        }
        return { status: false, message: "No access token in refresh response" };
      } catch (error: any) {
        console.error("❌ Jira token refresh error:", error);
        return {
          status: false,
          message: error.response?.data?.message || "Jira token refresh failed",
        };
      }
    },

    // GET SCOPE PROJECT NAMES (BY ADMIN ID)
    async fetchScopeProjectNames(adminId: string) {
      try {
        if (!adminId) {
          throw new Error("Admin ID is required");
        }

        const res = await endpoint.get(`/api/admin/scope/names/${adminId}/`);

        return {
          status: true,
          data: res.data, // full response
        };
      } catch (err) {
        const error = err as AxiosError<any>;

        return {
          status: false,
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            "Failed to fetch project names",
          details: error.response?.data || null,
        };
      }
    },

    // GET FULL SCOPE DATA BY PROJECT NAME
    async getFullScopeData(adminId: string, projectName: string, testingType: string) {
      try {
        if (!adminId || !projectName || !testingType) {
          throw new Error("Admin ID, Project Name and Testing Type are required");
        }

        const res = await endpoint.get(
          `/api/admin/scope/data/${adminId}/${encodeURIComponent(projectName)}/`,
          {
            params: {
              testing_type: testingType,
            },
          },
        );

        return {
          status: true,
          data: res.data,
        };
      } catch (err) {
        const error = err as AxiosError<any>;

        return {
          status: false,
          message:
            (error.response?.data as any)?.message || error.message || "Failed to fetch scope data",
          details: error.response?.data || null,
        };
      }
    },

    // get all scope targets
    async getScopeTargets(testingType: string) {
      try {
        const res = await endpoint.get(`/api/admin/scope/?current_testing_box=${testingType}`);

        return {
          status: true,
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || error.message || "Failed to fetch targets",
        };
      }
    },

    // GET TESTING TYPE BY SCOPE PROJECT NAME
    async getTestingTypeByScope(adminId: string, scopeName: string) {
      try {
        if (!adminId || !scopeName) {
          throw new Error("Admin ID and Scope Name are required");
        }

        const res = await endpoint.get(
          `/api/admin/scope/testing-type/${adminId}/${encodeURIComponent(scopeName)}/`,
        );

        return {
          status: true,
          data: res.data,
        };
      } catch (err) {
        const error = err as AxiosError<any>;

        return {
          status: false,
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            "Failed to fetch testing type",
          details: error.response?.data || null,
        };
      }
    },

    // GET SINGLE SCOPE ENTRY (DETAIL)
    async getScopeEntryDetail(scopeId: string, entryId: string) {
      try {
        if (!scopeId || !entryId) {
          throw new Error("Scope ID and Entry ID are required");
        }

        const res = await endpoint.get(`/api/admin/scope/${scopeId}/entries/${entryId}/detail/`);

        return {
          status: true,
          data: res.data,
        };
      } catch (err) {
        const error = err as AxiosError<any>;

        return {
          status: false,
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            "Failed to fetch entry detail",
          details: error.response?.data || null,
        };
      }
    },

    // UPDATE SCOPE ENTRY
    async updateScopeEntry(scopeId: string, entryId: string, payload: { value: string }) {
      try {
        if (!scopeId || !entryId) {
          throw new Error("Scope ID and Entry ID are required");
        }

        const res = await endpoint.patch(
          `/api/admin/scope/${scopeId}/entries/${entryId}/update/`,
          payload,
        );

        return {
          status: true,
          data: res.data,
        };
      } catch (err) {
        const error = err as AxiosError<any>;

        return {
          status: false,
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            "Failed to update scope entry",
          details: error.response?.data || null,
        };
      }
    },

    // DELETE SCOPE ENTRY
    async deleteScopeEntry(scopeId: string, entryId: string) {
      try {
        if (!scopeId || !entryId) {
          throw new Error("Scope ID and Entry ID are required");
        }

        const res = await endpoint.delete(`/api/admin/scope/${scopeId}/entries/${entryId}/`);

        return {
          status: true,
          message: res.data?.detail || "Entry deleted successfully",
        };
      } catch (err) {
        const error = err as AxiosError<any>;

        return {
          status: false,
          message: error.response?.data?.detail || error.message || "Failed to delete entry",
          details: error.response?.data || null,
        };
      }
    },

    // ✅ Dashboard summary (single endpoint for top cards)
    async fetchDashboardSummary() {
      try {
        const res = await endpoint.get("/api/admin/admindashboard/dashboard/summary/");
        const data = res.data || {};

        this.totalAssets = data?.total_assets?.total_assets ?? data?.total_assets ?? 0;
        this.avgScore = data?.avg_score?.avg_score ?? data?.avg_score ?? 0;

        const vuln = data?.vulnerabilities || {};
        this.vulnerabilities = {
          critical: vuln.critical ?? 0,
          high: vuln.high ?? 0,
          medium: vuln.medium ?? 0,
          low: vuln.low ?? 0,
        };

        // Keep existing shape used by dashboard UI.
        this.mitigationTimeline = data?.mitigation_timeline || null;
        this.meanTimeToRemediate = data?.mean_time_remediate || null;

        return { status: true, data };
      } catch (error: any) {
        this.totalAssets = 0;
        this.avgScore = 0;
        this.vulnerabilities = { critical: 0, high: 0, medium: 0, low: 0 };
        this.mitigationTimeline = null;
        this.meanTimeToRemediate = null;
        return {
          status: false,
          message: error.response?.data?.message || "Failed to fetch dashboard summary",
          details: error.response?.data || null,
        };
      }
    },

    // 🔹 DETAILED VULNERABILITIES
    async fetchDetailedVulnerabilities() {
      try {
        const res = await endpoint.get(
          "/api/admin/admindashboard/dashboard/detailed-vulnerabilities/",
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: "Failed to fetch detailed vulnerabilities",
          details: error.response?.data || null,
        };
      }
    },

    extractUploadedFileName(payload: unknown): string | null {
      const FILE_KEYS = [
        "file_name",
        "filename",
        "uploaded_file_name",
        "original_filename",
        "report_file_name",
        "report_filename",
        "uploaded_filename",
        "source_file",
        "scan_file",
        "original_name",
        "file",
        "uploaded_file",
        "uploaded_file_path",
        "file_path",
        "report_file_path",
      ];
      const FILE_EXT = /\.(xlsx|xls|csv|xml|nessus|pdf|html|htm|zip|json|txt)$/i;

      const isFileKey = (key: string) => /file|filename/i.test(key);

      const normalize = (value: unknown, key = ""): string | null => {
        if (value == null) return null;
        const raw = String(value).trim();
        if (!raw || raw === "[object Object]") return null;
        const base = raw.split(/[/\\]/).pop()?.trim() || raw;
        if (FILE_EXT.test(base)) return base;
        if (isFileKey(key) && base.length > 2 && base.length < 180) return base;
        return null;
      };

      const visit = (node: unknown, depth = 0): string | null => {
        if (node == null || depth > 5) return null;
        if (typeof node === "string") return normalize(node, "file");

        if (typeof node !== "object") return null;
        if (Array.isArray(node)) {
          for (const item of node) {
            const found = visit(item, depth + 1);
            if (found) return found;
          }
          return null;
        }

        const obj = node as Record<string, unknown>;
        for (const key of FILE_KEYS) {
          if (!(key in obj)) continue;
          const val = obj[key];
          if (typeof val === "string") {
            const found = normalize(val, key);
            if (found) return found;
          } else if (val && typeof val === "object") {
            const nested =
              normalize((val as Record<string, unknown>).file_name, "file_name") ||
              normalize((val as Record<string, unknown>).filename, "filename") ||
              normalize((val as Record<string, unknown>).name, "file_name");
            if (nested) return nested;
          }
        }

        for (const val of Object.values(obj)) {
          if (val && typeof val === "object") {
            const found = visit(val, depth + 1);
            if (found) return found;
          }
        }
        return null;
      };

      return visit(payload);
    },

    // 🔹 Report header metadata (generated date, program, testing date, uploaded file name)
    async fetchReportHeaderMetadata() {
      const pickPayload = (res: any) => {
        const d = res?.data;
        if (!d || typeof d !== "object") return {};
        if (d.data && typeof d.data === "object" && !Array.isArray(d.data)) return d.data;
        return d;
      };

      const merged: Record<string, any> = {};
      const assign = (source: Record<string, any>) => {
        if (!source || typeof source !== "object") return;
        Object.keys(source).forEach((key) => {
          if (key === "vulnerabilities" || key === "rows") return;
          const val = source[key];
          if (val !== undefined && val !== null && val !== "") merged[key] = val;
        });
        if (source.report && typeof source.report === "object") assign(source.report);
      };

      const paths = [
        "/api/admin/admindashboard/dashboard/report-status/",
        "/api/admin/admindashboard/dashboard/report-metadata/",
        "/api/admin/admindashboard/dashboard/report-info/",
        "/api/admin/admindashboard/dashboard/report-details/",
        "/api/admin/adminregister/register/latest/vulns/",
        "/api/admin/adminmitigationstrategy/vuln-asset-count/",
      ];

      for (const path of paths) {
        try {
          const res = await endpoint.get(path);
          assign(pickPayload(res));
        } catch {
          /* optional endpoint */
        }
      }

      try {
        const summary = await endpoint.get("/api/admin/admindashboard/dashboard/summary/");
        assign(pickPayload(summary));
      } catch {
        /* optional */
      }

      try {
        const detailed = await endpoint.get(
          "/api/admin/admindashboard/dashboard/detailed-vulnerabilities/",
        );
        assign(pickPayload(detailed));
      } catch {
        /* optional */
      }

      try {
        const project = await endpoint.get("/api/admin/scoping/project-details/");
        assign(pickPayload(project));
      } catch {
        /* optional */
      }

      try {
        const userRaw = sessionStorage.getItem("user") || localStorage.getItem("user");
        const user = userRaw ? JSON.parse(userRaw) : null;
        const adminId = user?.id || user?._id;
        if (adminId) {
          const scope = await endpoint.get(`/api/admin/scope/names/${adminId}/`);
          const names = scope.data?.scope_names || scope.data?.data?.scope_names;
          if (Array.isArray(names) && names[0]) merged.scope_project_name = names[0];
        }
      } catch {
        /* optional */
      }

      const fileName = this.extractUploadedFileName(merged);
      if (fileName) merged.resolved_file_name = fileName;

      this.uploadedReportDetails = merged;
      return { status: true, data: merged, fileName };
    },

    // ✅ User dashboard summary (single endpoint for top cards)
    async fetchUserDashboardSummary(team?: string, force = false) {
      const normalizedTeam = (team || "").trim();
      const effectiveTeam =
        normalizedTeam && normalizedTeam !== "All" && normalizedTeam !== "both"
          ? normalizedTeam
          : "";
      const key = effectiveTeam || "__all__";
      if (!force && this.cachedUserTotalAssets[key]?.__summary) {
        return { status: true, data: this.cachedUserTotalAssets[key].__summary };
      }
      try {
        const params = effectiveTeam ? { team: effectiveTeam } : {};
        const res = await endpoint.get("/api/user/dashboard/summary/", { params });
        const data = res.data || {};

        // Keep existing store state in sync with cards.
        this.totalAssets = data?.total_assets?.total_assets ?? 0;
        this.avgScore = data?.avg_score?.avg_score ?? 0;
        this.vulnerabilities = {
          critical: data?.vulnerabilities?.critical ?? 0,
          high: data?.vulnerabilities?.high ?? 0,
          medium: data?.vulnerabilities?.medium ?? 0,
          low: data?.vulnerabilities?.low ?? 0,
        };
        this.mitigationTimeline = data?.mitigation_timeline || null;
        this.meanTimeToRemediate = data?.mean_time_remediate || null;

        // Reuse existing cache buckets so old keys remain valid.
        this.cachedUserTotalAssets[key] = {
          ...this.cachedUserTotalAssets[key],
          __summary: data,
          total_assets: data?.total_assets?.total_assets ?? 0,
        };
        this.cachedUserVulnerabilities[key] = data?.vulnerabilities || {};
        this.cachedUserVulnerabilitiesFixed[key] = data?.vulnerabilities_fixed || {};
        this.cachedMitigationTimeline[key] = data?.mitigation_timeline || null;
        this.cachedMeanTime[key] = data?.mean_time_remediate || null;
        this.cachedSupportRequests[key] = data?.support_requests || {};

        return { status: true, data };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || "Failed to fetch user dashboard summary",
          details: error.response?.data || null,
        };
      }
    },

    // 🔹 USER ASSET VULNERABILITIES (single asset)
    async fetchUserSingleAssetVulnerabilities(assetIp: string) {
      try {
        const reportId = this.userLatestReportId;
        if (!reportId) return { status: false };
        const res = await endpoint.get(
          `/api/user/asset/report/${reportId}/asset/${assetIp}/vulnerabilities/`,
        );
        let vulns = normalizeAssetVulnerabilityList(res.data.vulnerabilities || []);
        if (!vulns.length) {
          await this.fetchUserVulnerabilityRegister(true);
          vulns = buildVulnsFromRegister(
            this.cachedUserVulnRegister,
            assetIp,
            this.userDeletedVulnerabilityAssets,
          );
        }
        vulns = filterDeletedVulnsForHost(vulns, assetIp, this.userDeletedVulnerabilityAssets);
        this.selectedAssetVulnerabilities = vulns;
        this.selectedAssetDetail = {
          asset: res.data.asset || assetIp,
          exposure: vulns[0]?.exposure || "",
          owner: vulns[0]?.owner || "",
          severity: vulns[0]?.severity || "",
        };
        return { status: true, count: vulns.length || res.data.count };
      } catch (error) {
        this.selectedAssetDetail = null;
        this.selectedAssetVulnerabilities = [];
        return { status: false };
      }
    },

    // 🔹 USER CLOSED VULNERABILITIES BY HOST
    async getUserClosedVulnerabilities(hostName: string) {
      try {
        const res = await endpoint.get(
          `/api/user/asset/fix-vulnerabilities/host/${hostName}/closed/`,
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          data: null,
          message: error.response?.data?.detail || "Failed to fetch closed vulnerabilities",
        };
      }
    },

    // 🔹 USER HOLD ASSET
    async holdUserAsset(assetIp: string) {
      try {
        const reportId = this.userLatestReportId;
        if (!reportId) return { status: false, message: "Report ID not found" };
        const res = await endpoint.post(
          `/api/user/asset/report/${reportId}/assets/${assetIp}/hold/`,
        );
        if (typeof res.data?.total_assets === "number") this.assetCount = res.data.total_assets;
        this.invalidateUserRealtimeCaches(reportId);
        return { status: true, heldAsset: res.data.asset, data: res.data };
      } catch (error: any) {
        return { status: false, message: error.response?.data?.detail || "Failed to hold asset" };
      }
    },

    // 🔹 USER UNHOLD ASSET
    async unholdUserAsset(assetIp: string) {
      try {
        const reportId = this.userLatestReportId;
        if (!reportId) return { status: false, message: "Report ID not found" };
        const res = await endpoint.post(
          `/api/user/asset/report/${reportId}/assets/${assetIp}/unhold/`,
        );
        if (typeof res.data?.total_assets === "number") this.assetCount = res.data.total_assets;
        this.invalidateUserRealtimeCaches(reportId);
        return { status: true, restoredAsset: res.data.asset, data: res.data };
      } catch (error: any) {
        return { status: false, message: error.response?.data?.detail || "Failed to unhold asset" };
      }
    },

    // 🔹 USER DELETE ASSET
    async deleteUserAsset(assetIp: string, reportIdArg?: string) {
      try {
        const reportId = reportIdArg || this.userLatestReportId;
        if (!reportId) return { status: false, message: "Report ID not found" };
        const safeAsset = encodeURIComponent(assetIp);
        const res = await endpoint.delete(
          `/api/user/asset/report/${reportId}/assets/${safeAsset}/delete/`,
        );
        this.cachedUserAssets = this.cachedUserAssets.filter((a: any) => a.asset !== assetIp);
        this.cachedUserHeldAssets = this.cachedUserHeldAssets.filter(
          (a: any) => a.asset !== assetIp,
        );
        this.cachedUserAssetTotal =
          typeof res.data?.total_assets === "number"
            ? res.data.total_assets
            : Math.max(0, this.cachedUserAssets.length + this.cachedUserHeldAssets.length);
        this.invalidateUserRealtimeCaches(reportId);
        return { status: true, data: res.data };
      } catch (error: any) {
        return { status: false, message: error.response?.data?.detail || "Failed to delete asset" };
      }
    },

    // 🔹 USER HELD ASSETS LIST
    async fetchUserHeldAssets(force = false) {
      if (!force && this.userHeldAssetsFetched) {
        return {
          status: true,
          assets: this.cachedUserHeldAssets,
          count: this.cachedUserHeldAssets.length,
        };
      }
      try {
        const reportId = this.userLatestReportId;
        if (!reportId)
          return { status: false, assets: [], count: 0, message: "Report ID not found" };
        const res = await endpoint.get(`/api/user/asset/report/${reportId}/assets/hold-list/`);
        this.cachedUserHeldAssets = res.data.assets || [];
        this.userHeldAssetsFetched = true;
        return {
          status: true,
          assets: this.cachedUserHeldAssets,
          count: res.data.count || 0,
          data: res.data,
        };
      } catch (error: any) {
        return {
          status: false,
          assets: [],
          count: 0,
          message: error.response?.data?.detail || "Failed to fetch held assets",
        };
      }
    },

    // 🔹 USER ASSETS
    async fetchUserAssets(force = false) {
      if (!force && this.cachedUserAssets.length > 0) {
        return { status: true, data: this.cachedUserAssets, total: this.cachedUserAssetTotal };
      }
      try {
        const res = await endpoint.get("/api/user/asset/assets/");
        const rows = res.data.assets || [];
        const normalized = rows.map((a: any) => ({
          ...a,
          selected: false,
          held: false,
          isInternal: a.member_type === "internal",
          host_information: a.host_information || {},
          severity_counts: a.severity_counts || { critical: 0, high: 0, medium: 0, low: 0 },
        }));
        if (res.data.report_id) this.userLatestReportId = res.data.report_id;
        const total = res.data.total_assets ?? normalized.length;
        this.cachedUserAssets = normalized;
        this.cachedUserAssetTotal = total;
        return { status: true, data: normalized, total };
      } catch (error: any) {
        return {
          status: false,
          message: "Failed to fetch assets",
          details: error.response?.data || null,
        };
      }
    },

    /** Which login methods this user may use (slack | microsoft_teams | email). */
    async getUserLoginPlatform(email: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/users/user-login-platform/?email=${encodeURIComponent(email)}`,
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        const errorData = error.response?.data;
        return {
          status: false,
          message:
            errorData?.message ||
            errorData?.error ||
            errorData?.detail ||
            "Failed to fetch login platform",
          data: { platform: "email", found: false },
        };
      }
    },

    _applyMemberAuthFromResponse(data: Record<string, any>) {
      const access = data?.access_token || data?.tokens?.access || data?.jwt_tokens?.access;
      const refresh = data?.refresh_token || data?.tokens?.refresh || data?.jwt_tokens?.refresh;
      const user = data?.user;
      if (access && typeof access === "string") {
        clearAllAuthTokens();
        this.setAuth(access, user || {});
        if (refresh) {
          sessionStorage.setItem("refreshToken", refresh);
        }
        sessionStorage.setItem("authenticated", "true");
        return true;
      }
      return false;
    },

    async slackMemberLogin(payload: { slack_user_id: string; slack_team_id: string }) {
      try {
        const res = await endpoint.post("/api/admin/users/slack/member-login/", payload);
        const body = res.data;
        const inner = body?.data ?? body;
        if (body?.success !== false && this._applyMemberAuthFromResponse(inner || body)) {
          return { status: true, data: body, message: body?.message };
        }
        return {
          status: false,
          message: body?.message || body?.error || "Slack member login failed",
          details: body,
        };
      } catch (error: any) {
        const errorData = error.response?.data;
        return {
          status: false,
          message:
            errorData?.message ||
            errorData?.error ||
            errorData?.detail ||
            "Slack member login failed",
          details: errorData,
        };
      }
    },

    async teamsMemberLogin(payload: { email: string; ms_user_id?: string; access_token?: string }) {
      try {
        const res = await endpoint.post("/api/admin/users/teams/member-login/", payload);
        const body = res.data;
        const inner = body?.data ?? body;
        if (body?.success !== false && this._applyMemberAuthFromResponse(inner || body)) {
          return { status: true, data: body, message: body?.message };
        }
        return {
          status: false,
          message: body?.message || body?.error || "Microsoft Teams member login failed",
          details: body,
        };
      } catch (error: any) {
        const errorData = error.response?.data;
        return {
          status: false,
          message:
            errorData?.message ||
            errorData?.error ||
            errorData?.detail ||
            "Microsoft Teams member login failed",
          details: errorData,
        };
      }
    },

    async getSlackMemberOAuthUrl(baseUrl: string, email: string) {
      try {
        const res = await endpoint.post("/api/admin/users/slack/oauth-url/", {
          base_url: baseUrl,
          email,
          purpose: "member",
        });
        if (res.data?.success && res.data?.auth_url) {
          return { status: true, data: res.data };
        }
        return { status: false, message: res.data?.message || "Auth URL not received" };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || "Failed to start Slack login",
        };
      }
    },

    async getMicrosoftMemberOAuthUrl(redirectUri: string, email: string) {
      try {
        const url =
          `/api/admin/users/microsoft-teams/oauth-url/?redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&email=${encodeURIComponent(email)}&purpose=member`;
        const res = await endpoint.get(url);
        if (res.data?.auth_url) {
          return { status: true, data: res.data };
        }
        return { status: false, message: "Auth URL not received" };
      } catch (error: any) {
        return {
          status: false,
          message: error.response?.data?.message || "Failed to start Microsoft login",
        };
      }
    },

    // 🔹 USER LOGIN
    async userLogin(payload: { email: string; password: string; recaptcha?: string }) {
      try {
        // Clear all stale tokens before login
        clearAllAuthTokens();

        let res;
        try {
          res = await endpoint.post("/api/admin/users/user-login/", payload);
        } catch (primaryError: any) {
          const status = primaryError?.response?.status;
          // Backend some deployments use `/login/` instead of `/user-login/`
          if (status === 404 || status === 405) {
            res = await endpoint.post("/api/admin/users/login/", payload);
          } else {
            throw primaryError;
          }
        }
        const raw: any = res.data;
        const data = raw && typeof raw === "object" && raw.data != null ? raw.data : raw;
        const tokens = (data && (data.tokens || data.jwt)) || {};
        const access: string | undefined =
          tokens.access ||
          data?.access ||
          data?.access_token ||
          (typeof data?.token === "string" ? data.token : undefined);
        const refreshToken = tokens.refresh || data?.refresh || data?.refresh_token;
        const userObj = data?.user ?? data?.profile ?? null;

        if (!access || typeof access !== "string") {
          return {
            status: false,
            message:
              data?.message ||
              data?.detail ||
              raw?.message ||
              "Login response missing access token.",
            details: raw,
          };
        }

        this.setAuth(access, userObj || {});
        if (refreshToken) {
          sessionStorage.setItem("refreshToken", refreshToken);
        }
        return { status: true, data: raw, message: raw?.message || data?.message };
      } catch (error: any) {
        const msg = error.response?.data?.message || error.response?.data?.detail || "Login failed";
        return { status: false, message: msg, details: error.response?.data || null };
      }
    },

    // 🔹 USER SET PASSWORD (no token)
    async userSetPassword(payload: { password: string; confirm_password: string }) {
      try {
        const res = await endpoint.post("/api/admin/users/user-set-password/", payload);
        return { status: true, data: res.data, message: res.data?.message };
      } catch (error: any) {
        const msg =
          error.response?.data?.message || error.response?.data?.detail || "Failed to set password";
        return { status: false, message: msg, details: error.response?.data || null };
      }
    },

    // 🔹 USER SET PASSWORD WITH TOKEN (from email link)
    async userSetPasswordWithToken(payload: {
      uidb64: string;
      token: string;
      password: string;
      confirm_password: string;
    }) {
      try {
        const { uidb64, token, password, confirm_password } = payload;
        const res = await endpoint.post(`/api/admin/users/user-set-password/${uidb64}/${token}/`, {
          password,
          confirm_password,
        });
        const raw: any = res.data;
        const data = raw && typeof raw === "object" && raw.data != null ? raw.data : raw;
        const tokens = (data && (data.tokens || data.jwt)) || {};
        const access: string | undefined =
          tokens.access ||
          data?.access ||
          data?.access_token ||
          (typeof data?.token === "string" ? data.token : undefined);
        const refreshToken = tokens.refresh || data?.refresh || data?.refresh_token;
        const userObj = data?.user ?? data?.profile ?? null;

        if (access && typeof access === "string") {
          clearAllAuthTokens();
          this.setAuth(access, userObj || {});
          if (refreshToken) {
            sessionStorage.setItem("refreshToken", refreshToken);
          }
          return {
            status: true as const,
            data: raw,
            message: raw?.message || data?.message || res.data?.msg,
            loggedIn: true as const,
          };
        }

        return {
          status: true as const,
          data: raw,
          message: res.data?.message || res.data?.msg,
          loggedIn: false as const,
        };
      } catch (error: any) {
        const msg =
          error.response?.data?.message ||
          error.response?.data?.msg ||
          error.response?.data?.detail ||
          "Failed to set password";
        return { status: false, message: msg, details: error.response?.data || null };
      }
    },

    // 🔹 DISTRIBUTION BY TEAM DETAIL
    async fetchDistributionByTeamDetail(force = false) {
      if (!force && this.cachedDistributionByTeam) {
        return { status: true, data: this.cachedDistributionByTeam };
      }
      try {
        const res = await endpoint.get(
          "/api/admin/admindashboard/dashboard/distribution-by-team/detail/",
        );
        this.cachedDistributionByTeam = res.data;
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: "Failed to fetch team detail",
          details: error.response?.data || null,
        };
      }
    },

    // 🔹 DISTRIBUTION BY TEAM
    async fetchDistributionByTeam() {
      try {
        const res = await endpoint.get("/api/admin/admindashboard/dashboard/distribution-by-team/");
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: "Failed to fetch distribution by team",
          details: error.response?.data || null,
        };
      }
    },

    // fetch user vulnerability register data
    async fetchUserVulnerabilityRegister(force = false) {
      if (!force && this.userVulnRegisterFetched && this.cachedUserVulnRegister.length > 0) {
        return { status: true, data: this.cachedUserVulnRegister };
      }
      try {
        const res = await endpoint.get(`/api/user/register/register/latest/vulns/`);
        const rows = res.data?.rows ?? [];
        this.userLatestReportId = res.data?.report_id || null;
        this.cachedUserVulnRegister = Array.isArray(rows) ? rows : [];
        this.userVulnRegisterFetched = true;
        return { status: true, data: this.cachedUserVulnRegister };
      } catch (error: any) {
        return {
          status: false,
          data: [],
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch user vulnerability register",
        };
      }
    },

    // FIX Vulnerability CREATE (User)
    async createUserFixVulnerability(
      reportId: string,
      asset: string,
      payload: Record<string, any>,
    ) {
      try {
        const res = await endpoint.post(
          `/api/user/register/fix-vulnerability/report/${reportId}/asset/${asset}/create/`,
          payload,
        );
        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Fix vulnerability failed",
          details: err.response?.data || null,
        };
      }
    },

    // fetch all vul register data
    async fetchVulnerabilityRegister(force = false) {
      if (!force && this.vulnerabilityRows.length > 0 && this.latestReportId) {
        return { status: true, data: this.vulnerabilityRows };
      }
      try {
        console.log("Fetching Latest Vulnerabilities...");

        const res = await endpoint.get(`/api/admin/adminregister/register/latest/vulns/`);

        console.log("Vulnerability Register response:", res.data);

        const rows = res.data?.rows ?? [];
        const count = res.data?.count ?? rows.length;

        this.vulnerabilityRows = Array.isArray(rows) ? rows : [];
        this.vulnerabilityCount = count;

        // 👇 ADD HERE
        this.latestReportId = res.data?.report_id || null;

        console.log("Latest Report ID:", this.latestReportId);

        return {
          status: true,
          data: this.vulnerabilityRows,
          reportPayload: res.data,
          fileName: this.extractUploadedFileName(res.data),
        };
      } catch (error: any) {
        console.error(
          "Vulnerability Register error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        this.vulnerabilityRows = [];
        this.vulnerabilityCount = 0;
        this.latestReportId = null; // optional reset

        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch vulnerability register",
        };
      }
    },

    // FIX Vulnerability CREATE
    async createFixVulnerability(reportId: string, asset: string, payload: Record<string, any>) {
      try {
        const res = await endpoint.post(
          `/api/admin/adminregister/fix-vulnerability/report/${reportId}/asset/${asset}/create/`,
          payload,
        );

        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Fix vulnerability failed",
          details: err.response?.data || null,
        };
      }
    },

    // FIX Vulnerability CARD GET
    async fetchFixVulnerabilityCardDetails(fixId: string) {
      try {
        const res = await endpoint.get(`/api/admin/adminregister/fix-vulnerability/${fixId}/card/`);

        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch fix vulnerability card",
          details: err.response?.data || null,
        };
      }
    },

    // GET Fix Vulnerability Card by report + asset
    // async getFixVulnerabilityByAsset(reportId: string, asset: string, id?: string) {
    //   try {
    //     const res = await endpoint.get(
    //       `/api/admin/adminregister/fix-vulnerability/report/${reportId}/asset/${asset}/create/`,
    //       { params: id ? { id } : {} }
    //     );

    //     return {
    //       status: true,
    //       data: res.data
    //     };

    //   } catch (error) {
    //     const err = error as AxiosError<any>;
    //     return {
    //       status: false,
    //       message: err.response?.data?.message || "Failed to fetch fix vulnerability",
    //       details: err.response?.data || null
    //     };
    //   }
    // },

    // Get complete fix vulnerability details (card view)
    // async getFixVulnerabilityCard(fixVulnerabilityId: string) {
    //   try {
    //     const res = await endpoint.get(
    //       `/api/admin/adminregister/fix-vulnerability/${fixVulnerabilityId}/detail/`
    //     );

    //     return {
    //       status: true,
    //       data: res.data.data
    //     };

    //   } catch (error) {
    //     const err = error as AxiosError<any>;
    //     return {
    //       status: false,
    //       message: err.response?.data?.message || "Failed to fetch fix vulnerability detail",
    //       details: err.response?.data || null
    //     };
    //   }
    // },

    // Mark a step as complete (User)
    async completeUserFixVulnerabilityStep(
      fixVulnerabilityId: string,
      payload: { status?: string; comment: string; complete_all?: boolean; os?: string },
      os: string = "windows",
    ) {
      try {
        const osKey = String(payload.os || os || "windows").toLowerCase();
        const normalizedOs = osKey.includes("linux") ? "linux" : "windows";
        const rawStatus = String(payload.status || "completed").toLowerCase().trim();
        const normalizedStatus =
          rawStatus === "step done" || rawStatus === "done" || rawStatus === "completed"
            ? "completed"
            : payload.status || "completed";

        const res = await endpoint.post(
          `/api/user/register/fix-vulnerability/${fixVulnerabilityId}/step-complete/?os=${normalizedOs}`,
          { ...payload, status: normalizedStatus, os: normalizedOs },
        );
        return {
          status: true,
          message: res.data.message,
          vulnerability_status: res.data.status,
          completed_steps: res.data.completed_steps,
          total_steps: res.data.total_steps,
          next_step: res.data.next_step,
          next_step_name: res.data.next_step_name,
          step_saved: res.data.step_saved,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to complete step",
          details: err.response?.data || null,
        };
      }
    },

    // Mark a step as complete (NEW API FORMAT)
    async completeFixVulnerabilityStep(
      fixVulnerabilityId: string,
      payload: {
        status: string;
        comment: string;
      },
    ) {
      try {
        const res = await endpoint.post(
          `/api/admin/adminregister/fix-vulnerability/${fixVulnerabilityId}/step-complete/`,
          payload,
        );

        return {
          status: true,
          message: res.data.message,
          vulnerability_status: res.data.status,
          completed_steps: res.data.completed_steps,
          step_saved: res.data.step_saved,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        console.log("FULL ERROR:", err.response); // 👈 ADD
        console.log("ERROR DATA:", err.response?.data);
        return {
          status: false,
          message: err.response?.data?.message || "Failed to complete step",
          details: err.response?.data || null,
        };
      }
    },

    // Get step completion status for fix vulnerability (User — OS-specific)
    async getUserFixVulnerabilitySteps(fixVulnerabilityId: string, os: string = "windows") {
      try {
        const res = await endpoint.get(
          `/api/user/register/fix-vulnerability/${fixVulnerabilityId}/step-complete/?os=${os}`,
        );
        return {
          status: true,
          data: {
            fix_vulnerability_id: res.data.fix_vulnerability_id,
            report_id: res.data.report_id,
            vulnerability_name: res.data.vulnerability_name,
            asset: res.data.asset,
            severity: res.data.severity,
            operating_system: res.data.operating_system,
            assigned_team: res.data.assigned_team,
            deadline: res.data.deadline,
            artifacts_tools: res.data.artifacts_tools,
            vulnerability_status: res.data.status,
            completed_steps: res.data.completed_steps,
            total_steps: res.data.total_steps,
            next_step: res.data.next_step,
            steps: res.data.steps || [],
            post_mitigation_troubleshooting_guide:
              res.data.post_mitigation_troubleshooting_guide || [],
          },
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch step completion data",
          details: err.response?.data || null,
        };
      }
    },

    // Send verification request to superadmin (User)
    async sendUserFixVerification(fixVulnerabilityId: string) {
      try {
        const res = await endpoint.post(
          `/api/user/register/fix-vulnerability/${fixVulnerabilityId}/send-verification/`,
        );
        return {
          status: true,
          message: res.data.message,
          vulnerability_status: res.data.status,
          verification_sent_at: res.data.verification_sent_at,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to send verification",
          details: err.response?.data || null,
        };
      }
    },

    // Get step completion status for fix vulnerability (UPDATED)
    async getFixVulnerabilitySteps(fixVulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/fix-vulnerability/${fixVulnerabilityId}/step-complete/`,
        );

        return {
          status: true,
          data: {
            fix_vulnerability_id: res.data.fix_vulnerability_id,
            report_id: res.data.report_id,
            admin_id: res.data.admin_id,
            admin_email: res.data.admin_email,
            vulnerability_name: res.data.vulnerability_name,
            asset: res.data.asset,
            severity: res.data.severity,
            operating_system: res.data.operating_system,
            assigned_team: res.data.assigned_team,
            deadline: res.data.deadline,
            artifacts_tools: res.data.artifacts_tools,
            vulnerability_status: res.data.status,
            completed_steps: res.data.completed_steps,
            total_steps: res.data.total_steps,
            next_step: res.data.next_step,
            steps: res.data.steps || [],
            post_mitigation_troubleshooting_guide:
              res.data.post_mitigation_troubleshooting_guide || [],
          },
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch step completion data",
          details: err.response?.data || null,
        };
      }
    },

    // CREATE/UPDATE Final Fix Feedback (User)
    async submitUserFixFinalFeedback(
      fixVulnerabilityId: string,
      payload: { feedback_comment: string; fix_result: string },
    ) {
      try {
        const res = await endpoint.post(
          `/api/user/register/fix-vulnerability/${fixVulnerabilityId}/final-feedback/`,
          payload,
        );
        return {
          status: true,
          message: res.data.message,
          data: res.data.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to submit feedback",
          details: err.response?.data || null,
        };
      }
    },

    // GET Final Fix Feedback (User)
    async getUserFixFinalFeedback(fixVulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/user/register/fix-vulnerability/${fixVulnerabilityId}/final-feedback/`,
        );
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch final feedback",
          details: err.response?.data || null,
        };
      }
    },

    // CREATE Final Fix Feedback
    async submitFixFinalFeedback(
      fixVulnerabilityId: string,
      payload: {
        feedback_comment: string;
        fix_result: string;
      },
    ) {
      try {
        const res = await endpoint.post(
          `/api/admin/adminregister/fix-vulnerability/${fixVulnerabilityId}/final-feedback/`,
          payload,
        );

        return {
          status: true,
          message: res.data.message,
          data: res.data.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to submit feedback",
          details: err.response?.data || null,
        };
      }
    },

    // GET Final Fix Feedback
    async getFixFinalFeedback(fixVulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/fix-vulnerability/${fixVulnerabilityId}/final-feedback/`,
        );

        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch final feedback",
          details: err.response?.data || null,
        };
      }
    },

    // create Raise Support Request (UPDATED API)
    async raiseSupportRequest(
      reportId: string,
      vulnerabilityId: string,
      payload: {
        step?: string;
        step_number?: number;
        description: string;
      },
    ) {
      try {
        const res = await endpoint.post(
          `/api/admin/adminregister/support-requests/raise/report/${reportId}/vulnerability/${vulnerabilityId}/`,
          payload,
        );
        this.invalidateAdminSupportTicketCaches(reportId);

        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to raise support request",
          details: err.response?.data || null,
        };
      }
    },

    // GET Raise support request by vulnerability id
    async getRaiseSupportRequestByVulnerability(vulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/raise-support-requests/vulnerability/${vulnerabilityId}/`,
        );
        const results = res.data.results || [];

        return {
          status: true,
          exists: Boolean(res.data.exists),
          count: typeof res.data.count === "number" ? res.data.count : results.length,
          results,
          // backward compatibility for old consumers expecting single object in data
          data: res.data.data || results[0] || null,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;

        // if no support request exists
        if (err.response?.status === 404) {
          return {
            status: true,
            exists: false,
            count: 0,
            results: [],
            data: null,
          };
        }

        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch support request",
          details: err.response?.data || null,
        };
      }
    },

    // User: Get all support requests by report ID
    async fetchUserSupportRequestsByReport(reportId: string, force = false) {
      if (!force && this.cachedUserSupportRequests[reportId]) {
        return {
          status: true,
          data: this.cachedUserSupportRequests[reportId],
          count: this.cachedUserSupportRequests[reportId].length,
        };
      }
      try {
        const res = await endpoint.get(`/api/user/register/support-requests/report/${reportId}/`);
        this.cachedUserSupportRequests[reportId] = res.data.results || [];
        return {
          status: true,
          data: this.cachedUserSupportRequests[reportId],
          count: res.data.count,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          data: [],
          message: err.response?.data?.message || "Failed to fetch support requests",
        };
      }
    },

    // User: Get support requests by host name
    async getUserSupportRequestsByHost(host: string) {
      try {
        const safeHost = encodeURIComponent(host);
        const res = await endpoint.get(`/api/user/register/support-requests/host/${safeHost}/`);
        return {
          status: true,
          data: res.data.results || [],
          count: res.data.count || 0,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          data: [],
          count: 0,
          message: err.response?.data?.message || "Failed to fetch support requests",
        };
      }
    },

    // User: Get all tickets by report ID
    async fetchUserAllTickets(reportId: string, force = false) {
      if (!force && this.cachedUserAllTickets[reportId]) {
        return {
          status: true,
          data: this.cachedUserAllTickets[reportId],
          count: this.cachedUserAllTickets[reportId].length,
        };
      }
      try {
        const res = await endpoint.get(`/api/user/register/tickets/report/${reportId}/`);
        this.cachedUserAllTickets[reportId] = res.data.results || [];
        return { status: true, data: this.cachedUserAllTickets[reportId], count: res.data.count };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          data: [],
          message: err.response?.data?.message || "Failed to fetch tickets",
        };
      }
    },

    // User: Get all open tickets by report ID
    async fetchUserOpenTickets(reportId: string, force = false) {
      if (!force && this.cachedUserOpenTickets[reportId]) {
        return {
          status: true,
          data: this.cachedUserOpenTickets[reportId],
          count: this.cachedUserOpenTickets[reportId].length,
        };
      }
      try {
        const res = await endpoint.get(`/api/user/register/reports/${reportId}/tickets/open/`);
        this.cachedUserOpenTickets[reportId] = res.data.results || [];
        return { status: true, data: this.cachedUserOpenTickets[reportId], count: res.data.count };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          data: [],
          message: err.response?.data?.message || "Failed to fetch open tickets",
        };
      }
    },

    // User: Get single ticket detail
    async getUserTicketById(fixVulnerabilityId: string, ticketId: string) {
      try {
        const res = await endpoint.get(
          `/api/user/register/tickets/fix/${fixVulnerabilityId}/ticket/${ticketId}/`,
        );
        return { status: true, data: res.data.data };
      } catch (error) {
        const err = error as AxiosError<any>;
        return { status: false, message: err.response?.data?.message || "Failed to fetch ticket" };
      }
    },

    // User: Create ticket
    async createUserTicket(
      reportId: string,
      fixVulnerabilityId: string,
      payload: {
        category: string;
        subject: string;
        description: string;
      },
    ) {
      try {
        const res = await endpoint.post(
          `/api/user/register/tickets/report/${reportId}/fix/${fixVulnerabilityId}/create/`,
          payload,
        );
        this.invalidateUserSupportTicketCaches(reportId);
        return { status: true, data: res.data.data, message: res.data.message };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to create ticket",
          details: err.response?.data || null,
        };
      }
    },

    // User: Raise support request for a fix vulnerability
    async raiseUserSupportRequest(
      vulnerabilityId: string,
      payload: {
        step_number: number;
        description: string;
      },
    ) {
      try {
        const res = await endpoint.post(
          `/api/user/register/fix-vulnerability/${vulnerabilityId}/raise-support-request/`,
          payload,
        );
        // Clear all user dashboard and support request caches for immediate refresh
        // This forces the dashboard to fetch fresh data from backend on next load
        this.cachedUserTotalAssets = {};
        this.cachedSupportRequests = {};
        this.cachedUserSupportRequests = {};
        this.cachedUserOpenTickets = {};
        this.cachedUserAllTickets = {};
        this.cachedUserVulnerabilities = {};
        this.cachedMitigationTimeline = {};
        this.cachedMeanTime = {};

        // Immediately trigger a fresh fetch to update dashboard if it's currently loaded
        // This ensures the counts update without needing manual refresh or navigation
        setTimeout(() => {
          void this.fetchUserDashboardSummary(undefined, true);
        }, 500);

        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to raise support request",
          details: err.response?.data || null,
        };
      }
    },

    // User: Check support request status by vulnerability
    async getUserSupportRequestStatus(vulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/user/register/fix-vulnerability/${vulnerabilityId}/support-request-status/`,
        );
        const results = res.data.results || [];
        return {
          status: true,
          exists: Boolean(res.data.exists),
          count: typeof res.data.count === "number" ? res.data.count : results.length,
          results,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        if (err.response?.status === 404) {
          return {
            status: true,
            exists: false,
            count: 0,
            results: [],
            message: "No support requests found",
          };
        }
        return {
          status: false,
          exists: false,
          count: 0,
          results: [],
          message: err.response?.data?.message || "Failed to fetch support request status",
          details: err.response?.data || null,
        };
      }
    },

    // Create new ticket
    async createTicket(
      reportId: string,
      fixVulnerabilityId: string,
      payload: {
        category: string;
        subject: string;
        description: string;
      },
    ) {
      try {
        const res = await endpoint.post(
          `/api/admin/adminregister/tickets/report/${reportId}/fix/${fixVulnerabilityId}/create/`,
          payload,
        );
        this.invalidateAdminSupportTicketCaches(reportId);

        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to create ticket",
          details: err.response?.data || null,
        };
      }
    },

    // GET Vulnerability Timeline (User)
    async fetchUserVulnerabilityTimeline(fixVulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/user/register/fix-vulnerability/${fixVulnerabilityId}/timeline/`,
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch timeline",
        };
      }
    },

    // GET Vulnerability Timeline
    async fetchVulnerabilityTimeline(fixVulnerabilityId: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/fix-vulnerability/${fixVulnerabilityId}/timeline/`,
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch timeline",
        };
      }
    },

    // GET Ticket by fix_vulnerability_id + ticket_id
    async getTicketById(fixVulnerabilityId: string, ticketId: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/tickets/fix/${fixVulnerabilityId}/ticket/${ticketId}/`,
        );

        return {
          status: true,
          data: res.data.data,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch ticket",
          details: err.response?.data || null,
        };
      }
    },

    // GET all open tickets by reportId
    async getOpenTickets(reportId: string, force = false) {
      if (!force && this.cachedOpenTickets[reportId]) {
        return {
          status: true,
          data: this.cachedOpenTickets[reportId],
          count: this.cachedOpenTickets[reportId].length,
        };
      }
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/reports/${reportId}/tickets/open/`,
        );

        const results = res.data.results || [];
        this.cachedOpenTickets[reportId] = results;
        return {
          status: true,
          data: results,
          count: res.data.count || 0,
          message: res.data.message,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch open tickets",
          details: err.response?.data || null,
        };
      }
    },

    // Get all support requests by report id
    async getSupportRequestsByReport(reportId: string, force = false) {
      if (!force && this.cachedSupportRequests[reportId]) {
        return {
          status: true,
          data: this.cachedSupportRequests[reportId],
          count: this.cachedSupportRequests[reportId].length,
        };
      }
      try {
        console.log("📡 Store API called with:", reportId);

        const res = await endpoint.get(
          `/api/admin/adminregister/support-requests/report/${reportId}/`,
        );

        const results = res?.data?.results || [];
        this.cachedSupportRequests[reportId] = results;
        return {
          status: true,
          data: results,
          count: res?.data?.count || 0,
        };
      } catch (error) {
        console.error("❌ Support request API error:", error);
        return {
          status: false,
          data: [],
          count: 0,
        };
      }
    },

    // Get all tickets by report id
    async getTicketsByReport(reportId: string, force = false) {
      if (!force && this.cachedTicketsByReport[reportId]) {
        return {
          status: true,
          data: this.cachedTicketsByReport[reportId],
          count: this.cachedTicketsByReport[reportId].length,
        };
      }
      try {
        console.log("Fetching tickets for report:", reportId);

        const res = await endpoint.get(`/api/admin/adminregister/tickets/report/${reportId}/`);

        const tickets =
          res?.data?.results ||
          (Array.isArray(res?.data?.data) ? res.data.data : null) ||
          (Array.isArray(res?.data) ? res.data : []);

        console.log("Tickets fetched:", tickets.length);
        this.cachedTicketsByReport[reportId] = tickets;

        return {
          status: true,
          data: tickets,
          count: res?.data?.count || tickets.length,
        };
      } catch (error) {
        console.error("Tickets API error:", error);
        return {
          status: false,
          data: [],
          count: 0,
        };
      }
    },

    // GET ALL VULNERABILITIES for report (All Vulnerabilities tab)
    async fetchAllReportVulnerabilities(force = false) {
      if (
        !force &&
        this.allReportVulnerabilitiesFetched &&
        this.allReportVulnerabilities.length > 0
      ) {
        return {
          status: true,
          data: this.allReportVulnerabilities,
          total: this.allReportVulnerabilitiesTotal,
        };
      }

      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          return {
            status: false,
            message: "Report ID not found",
          };
        }

        const res = await endpoint.get(`/api/admin/adminasset/report/${reportId}/vulnerabilities/`);

        const vulns = res.data?.vulnerabilities ?? [];
        this.allReportVulnerabilities = Array.isArray(vulns) ? vulns : [];
        this.allReportVulnerabilitiesTotal =
          res.data?.total ?? this.allReportVulnerabilities.length;
        this.allReportVulnerabilitiesFetched = true;

        if (res.data?.report_id) {
          this.latestReportId = res.data.report_id;
        }

        return {
          status: true,
          data: this.allReportVulnerabilities,
          total: this.allReportVulnerabilitiesTotal,
          reportId: res.data?.report_id || reportId,
        };
      } catch (error: any) {
        console.error(
          "[authStore] fetchAllReportVulnerabilities error:",
          error.response?.data || error.message,
        );
        this.allReportVulnerabilities = [];
        this.allReportVulnerabilitiesTotal = 0;
        this.allReportVulnerabilitiesFetched = false;

        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to fetch vulnerabilities",
        };
      }
    },

    // GET assets for a specific vulnerability (checkbox list)
    async fetchVulnerabilityAssets(pluginName: string) {
      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.get(
          `/api/admin/adminasset/report/${reportId}/vulnerability/${encodedPlugin}/assets/`,
        );

        return {
          status: true,
          data: res.data,
          assets: res.data?.assets ?? [],
        };
      } catch (error: any) {
        console.error(
          "[authStore] fetchVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to fetch vulnerability assets",
          assets: [],
        };
      }
    },

    // HOLD assets for a specific vulnerability (All Vulnerabilities tab)
    async holdVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.post(
          `/api/admin/adminasset/report/${reportId}/vulnerability/${encodedPlugin}/hold/`,
          { host_names: hostNames },
        );

        const processed: string[] = res.data?.processed ?? [];
        this.addHeldVulnerabilityAssets(
          res.data?.plugin_name || pluginName,
          processed.length ? processed : hostNames,
        );
        this.allReportVulnerabilitiesFetched = false;
        this.allReportVulnerabilities = [];

        return {
          status: true,
          data: res.data,
          message: res.data?.detail || "Held successfully",
          processed,
          skipped: res.data?.skipped ?? [],
          pluginName: res.data?.plugin_name || pluginName,
        };
      } catch (error: any) {
        console.error(
          "[authStore] holdVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to hold vulnerability assets",
        };
      }
    },

    // DELETE vulnerability from specific assets (All Vulnerabilities tab)
    async deleteVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.delete(
          `/api/admin/adminasset/report/${reportId}/vulnerability/${encodedPlugin}/delete/`,
          { data: { host_names: hostNames } },
        );

        const processed: string[] = res.data?.processed ?? [];
        this.addDeletedVulnerabilityAssets(
          res.data?.plugin_name || pluginName,
          processed.length ? processed : hostNames,
        );
        this.allReportVulnerabilitiesFetched = false;
        this.allReportVulnerabilities = [];
        this.vulnerabilityRows = [];

        return {
          status: true,
          data: res.data,
          message: res.data?.detail || "Deleted successfully",
          processed,
          pluginName: res.data?.plugin_name || pluginName,
        };
      } catch (error: any) {
        console.error(
          "[authStore] deleteVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to delete vulnerability from assets",
        };
      }
    },

    // UNHOLD assets for a specific vulnerability (All Vulnerabilities tab)
    async unholdVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.post(
          `/api/admin/adminasset/report/${reportId}/vulnerability/${encodedPlugin}/unhold/`,
          { host_names: hostNames },
        );

        const processed: string[] = res.data?.processed ?? [];
        this.removeHeldVulnerabilityAssets(pluginName, processed.length ? processed : hostNames);
        this.allReportVulnerabilitiesFetched = false;
        this.allReportVulnerabilities = [];

        return {
          status: true,
          data: res.data,
          message: res.data?.detail || "Unheld successfully",
          processed,
          pluginName: res.data?.plugin_name || pluginName,
        };
      } catch (error: any) {
        console.error(
          "[authStore] unholdVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to unhold vulnerability assets",
        };
      }
    },

    addHeldVulnerabilityAssets(
      pluginName: string,
      hostNames: string[],
      meta: { severity?: string } = {},
    ) {
      const name = String(pluginName || "").trim();
      if (!name) return;

      hostNames.forEach((host) => {
        const hostName = String(host || "").trim();
        if (!hostName) return;
        const exists = this.heldVulnerabilityAssets.some(
          (item) => item.plugin_name === name && item.host_name === hostName,
        );
        if (exists) return;
        this.heldVulnerabilityAssets.push({
          plugin_name: name,
          vul_name: name,
          host_name: hostName,
          severity: meta.severity || "Medium",
          status: "held",
          _key: name.toLowerCase(),
          selected: false,
        });
      });
    },

    removeHeldVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      const name = String(pluginName || "").trim();
      const hosts = new Set(hostNames.map((h) => String(h || "").trim()).filter(Boolean));
      if (!name || !hosts.size) return;
      this.heldVulnerabilityAssets = this.heldVulnerabilityAssets.filter(
        (item) => !(item.plugin_name === name && hosts.has(item.host_name)),
      );
    },

    addDeletedVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      const name = String(pluginName || "").trim();
      if (!name) return;

      hostNames.forEach((host) => {
        const hostName = String(host || "").trim();
        if (!hostName) return;
        const exists = this.deletedVulnerabilityAssets.some(
          (item) => item.plugin_name === name && item.host_name === hostName,
        );
        if (exists) return;
        this.deletedVulnerabilityAssets.push({
          plugin_name: name,
          vul_name: name,
          host_name: hostName,
          _key: name.toLowerCase(),
        });
      });

      this.persistDeletedVulnerabilityAssets();
    },

    syncAssetSeverityCountsAfterVulnDelete(hostNames: string[], severity: string = "Medium") {
      const sevKey = String(severity || "medium")
        .trim()
        .toLowerCase();
      if (!["critical", "high", "medium", "low"].includes(sevKey)) return;

      hostNames.forEach((host) => {
        const hostName = String(host || "").trim();
        if (!hostName) return;
        const idx = this.assetRows.findIndex(
          (row) => row.asset === hostName || row.host_name === hostName,
        );
        if (idx < 0) return;

        const counts = { ...(this.assetRows[idx].severity_counts || {}) };
        if ((Number(counts[sevKey]) || 0) > 0) {
          counts[sevKey] = Number(counts[sevKey]) - 1;
        }
        this.assetRows[idx] = {
          ...this.assetRows[idx],
          severity_counts: counts,
        };
      });
    },

    persistDeletedVulnerabilityAssets() {
      const reportId = this.latestReportId;
      if (!reportId || typeof localStorage === "undefined") return;
      try {
        const all = JSON.parse(localStorage.getItem("vapt_deleted_vuln_assets") || "{}");
        all[reportId] = this.deletedVulnerabilityAssets;
        localStorage.setItem("vapt_deleted_vuln_assets", JSON.stringify(all));
      } catch {
        // ignore storage errors
      }
    },

    restoreDeletedVulnerabilityAssetsFromStorage(reportId?: string | null) {
      const id = reportId || this.latestReportId;
      if (!id || typeof localStorage === "undefined") return;
      try {
        const all = JSON.parse(localStorage.getItem("vapt_deleted_vuln_assets") || "{}");
        const rows = Array.isArray(all[id]) ? all[id] : [];
        if (!rows.length) return;

        const restored = rows
          .map((row: any) => ({
            plugin_name: row.plugin_name || row.vul_name || "",
            vul_name: row.plugin_name || row.vul_name || "",
            host_name: row.host_name || row.asset || "",
            _key: String(row.plugin_name || row.vul_name || "")
              .trim()
              .toLowerCase(),
          }))
          .filter((row: any) => row.plugin_name && row.host_name);

        const seen = new Set(
          this.deletedVulnerabilityAssets.map((row: any) => `${row.plugin_name}::${row.host_name}`),
        );
        restored.forEach((row: any) => {
          const key = `${row.plugin_name}::${row.host_name}`;
          if (seen.has(key)) return;
          seen.add(key);
          this.deletedVulnerabilityAssets.push(row);
        });
      } catch {
        // ignore storage errors
      }
    },

    async fetchDeletedVulnerabilityAssets(force = false) {
      if (!force && this.deletedVulnerabilityAssetsFetched) {
        return { status: true, data: this.deletedVulnerabilityAssets };
      }

      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          this.restoreDeletedVulnerabilityAssetsFromStorage();
          this.deletedVulnerabilityAssetsFetched = true;
          return { status: true, data: this.deletedVulnerabilityAssets };
        }

        const res = await endpoint.get(
          `/api/admin/adminasset/report/${reportId}/vulnerability/delete-list/`,
        );

        const rows =
          res.data?.deleted ?? res.data?.assets ?? res.data?.results ?? res.data?.items ?? [];
        const normalized = (Array.isArray(rows) ? rows : [])
          .map((row: any) => ({
            plugin_name: row.plugin_name || row.vul_name || "",
            vul_name: row.plugin_name || row.vul_name || "",
            host_name: row.host_name || row.asset || "",
            _key: String(row.plugin_name || row.vul_name || "")
              .trim()
              .toLowerCase(),
          }))
          .filter((row: any) => row.plugin_name && row.host_name);

        this.deletedVulnerabilityAssets = normalized;
        this.deletedVulnerabilityAssetsFetched = true;
        this.persistDeletedVulnerabilityAssets();

        return { status: true, data: this.deletedVulnerabilityAssets };
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.warn(
            "[authStore] fetchDeletedVulnerabilityAssets:",
            error.response?.data || error.message,
          );
        }
        this.restoreDeletedVulnerabilityAssetsFromStorage();
        this.deletedVulnerabilityAssetsFetched = true;
        return { status: true, data: this.deletedVulnerabilityAssets };
      }
    },

    // 🔹 ADMIN — Report assets & vulnerabilities filtered by team role
    // GET /api/admin/users_details/report-assets-vulns/?role=<role>
    async fetchReportAssetVulnsByRole(role: string) {
      try {
        const res = await endpoint.get(`/api/admin/users_details/report-assets-vulns/`, {
          params: { role },
        });
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          data: null,
          message: error.response?.data?.detail || "Failed to fetch role assets/vulns",
        };
      }
    },

    async fetchHeldVulnerabilityAssets(force = false) {
      if (!force && this.heldVulnerabilityAssetsFetched) {
        return { status: true, data: this.heldVulnerabilityAssets };
      }

      try {
        const reportId = await this.resolveReportId();
        if (!reportId) {
          return { status: false, data: this.heldVulnerabilityAssets };
        }

        const res = await endpoint.get(
          `/api/admin/adminasset/report/${reportId}/vulnerability/hold-list/`,
        );

        // API returns: { vulnerabilities: [{ plugin_name, severity, cvss_score, hosts: [{ host_name, held_at, held_by }] }] }
        const vulnRows: any[] = Array.isArray(res.data?.vulnerabilities)
          ? res.data.vulnerabilities
          : [];

        // Flatten: one entry per vuln+host pair
        const normalized: any[] = [];
        vulnRows.forEach((vuln: any) => {
          const pluginName = String(vuln.plugin_name || vuln.vul_name || "").trim();
          if (!pluginName) return;
          const hosts: any[] = Array.isArray(vuln.hosts) ? vuln.hosts : [];
          hosts.forEach((host: any) => {
            const hostName = String(host.host_name || host.asset || "").trim();
            if (!hostName) return;
            normalized.push({
              plugin_name: pluginName,
              vul_name: pluginName,
              host_name: hostName,
              severity: vuln.severity || "Medium",
              cvss_score: vuln.cvss_score || "",
              held_at: host.held_at || "",
              held_by: host.held_by || "",
              status: "held",
              _key: pluginName.toLowerCase(),
              selected: false,
            });
          });
        });

        const merged = new Map<string, any>();
        const mergeRow = (row: any) => {
          const key = `${row.plugin_name}::${row.host_name}`;
          merged.set(key, { ...merged.get(key), ...row, selected: false });
        };
        (this.heldVulnerabilityAssets || []).forEach(mergeRow);
        normalized.forEach(mergeRow);
        this.heldVulnerabilityAssets = [...merged.values()];
        this.heldVulnerabilityAssetsFetched = true;

        return { status: true, data: this.heldVulnerabilityAssets };
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.warn(
            "[authStore] fetchHeldVulnerabilityAssets:",
            error.response?.data || error.message,
          );
        }
        this.heldVulnerabilityAssetsFetched = true;
        return { status: true, data: this.heldVulnerabilityAssets };
      }
    },

    async resolveUserReportId(): Promise<string | null> {
      if (this.userLatestReportId) return this.userLatestReportId;

      await this.fetchUserAssets(false);
      if (this.userLatestReportId) return this.userLatestReportId;

      await this.fetchUserVulnerabilityRegister(false);
      if (this.userLatestReportId) return this.userLatestReportId;

      return this.userLatestReportId;
    },

    async fetchUserAllReportVulnerabilities(force = false) {
      if (
        !force &&
        this.userAllReportVulnerabilitiesFetched &&
        this.userAllReportVulnerabilities.length > 0
      ) {
        return {
          status: true,
          data: this.userAllReportVulnerabilities,
          total: this.userAllReportVulnerabilitiesTotal,
        };
      }

      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const res = await endpoint.get(`/api/user/asset/report/${reportId}/vulnerabilities/`);

        const vulns = res.data?.vulnerabilities ?? [];
        this.userAllReportVulnerabilities = Array.isArray(vulns) ? vulns : [];
        this.userAllReportVulnerabilitiesTotal =
          res.data?.total ?? this.userAllReportVulnerabilities.length;
        this.userAllReportVulnerabilitiesFetched = true;

        if (res.data?.report_id) {
          this.userLatestReportId = res.data.report_id;
        }

        return {
          status: true,
          data: this.userAllReportVulnerabilities,
          total: this.userAllReportVulnerabilitiesTotal,
          reportId: res.data?.report_id || reportId,
          teams: res.data?.teams ?? [],
        };
      } catch (error: any) {
        console.error(
          "[authStore] fetchUserAllReportVulnerabilities error:",
          error.response?.data || error.message,
        );
        this.userAllReportVulnerabilities = [];
        this.userAllReportVulnerabilitiesTotal = 0;
        this.userAllReportVulnerabilitiesFetched = false;
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to fetch vulnerabilities",
        };
      }
    },

    async fetchUserVulnerabilityAssets(pluginName: string) {
      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found", assets: [] };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.get(
          `/api/user/asset/report/${reportId}/vulnerability/${encodedPlugin}/assets/`,
        );

        return {
          status: true,
          data: res.data,
          assets: res.data?.assets ?? [],
        };
      } catch (error: any) {
        console.error(
          "[authStore] fetchUserVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to fetch vulnerability assets",
          assets: [],
        };
      }
    },

    async holdUserVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.post(
          `/api/user/asset/report/${reportId}/vulnerability/${encodedPlugin}/hold/`,
          { host_names: hostNames },
        );

        const processed: string[] = res.data?.processed ?? [];
        this.addUserHeldVulnerabilityAssets(
          res.data?.plugin_name || pluginName,
          processed.length ? processed : hostNames,
        );
        this.userAllReportVulnerabilitiesFetched = false;
        this.userAllReportVulnerabilities = [];

        return {
          status: true,
          data: res.data,
          message: res.data?.detail || "Held successfully",
          processed,
          skipped: res.data?.skipped ?? [],
          pluginName: res.data?.plugin_name || pluginName,
        };
      } catch (error: any) {
        console.error(
          "[authStore] holdUserVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to hold vulnerability assets",
        };
      }
    },

    async unholdUserVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.post(
          `/api/user/asset/report/${reportId}/vulnerability/${encodedPlugin}/unhold/`,
          { host_names: hostNames },
        );

        const processed: string[] = res.data?.processed ?? [];
        this.removeUserHeldVulnerabilityAssets(
          pluginName,
          processed.length ? processed : hostNames,
        );
        this.userAllReportVulnerabilitiesFetched = false;
        this.userAllReportVulnerabilities = [];

        return {
          status: true,
          data: res.data,
          message: res.data?.detail || "Unheld successfully",
          processed,
          pluginName: res.data?.plugin_name || pluginName,
        };
      } catch (error: any) {
        console.error(
          "[authStore] unholdUserVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to unhold vulnerability assets",
        };
      }
    },

    async deleteUserVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          return { status: false, message: "Report ID not found" };
        }

        const encodedPlugin = encodeURIComponent(String(pluginName || "").trim());
        const res = await endpoint.delete(
          `/api/user/asset/report/${reportId}/vulnerability/${encodedPlugin}/delete/`,
          { data: { host_names: hostNames } },
        );

        const processed: string[] = res.data?.processed ?? [];
        this.addUserDeletedVulnerabilityAssets(
          res.data?.plugin_name || pluginName,
          processed.length ? processed : hostNames,
        );
        this.userAllReportVulnerabilitiesFetched = false;
        this.userAllReportVulnerabilities = [];
        this.cachedUserVulnRegister = [];
        this.userVulnRegisterFetched = false;

        return {
          status: true,
          data: res.data,
          message: res.data?.detail || "Deleted successfully",
          processed,
          pluginName: res.data?.plugin_name || pluginName,
        };
      } catch (error: any) {
        console.error(
          "[authStore] deleteUserVulnerabilityAssets error:",
          error.response?.data || error.message,
        );
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Failed to delete vulnerability from assets",
        };
      }
    },

    addUserHeldVulnerabilityAssets(
      pluginName: string,
      hostNames: string[],
      meta: { severity?: string } = {},
    ) {
      const name = String(pluginName || "").trim();
      if (!name) return;

      hostNames.forEach((host) => {
        const hostName = String(host || "").trim();
        if (!hostName) return;
        const exists = this.userHeldVulnerabilityAssets.some(
          (item) => item.plugin_name === name && item.host_name === hostName,
        );
        if (exists) return;
        this.userHeldVulnerabilityAssets.push({
          plugin_name: name,
          vul_name: name,
          host_name: hostName,
          severity: meta.severity || "Medium",
          status: "held",
          _key: name.toLowerCase(),
          selected: false,
        });
      });
    },

    removeUserHeldVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      const name = String(pluginName || "").trim();
      const hosts = new Set(hostNames.map((h) => String(h || "").trim()).filter(Boolean));
      if (!name || !hosts.size) return;
      this.userHeldVulnerabilityAssets = this.userHeldVulnerabilityAssets.filter(
        (item) => !(item.plugin_name === name && hosts.has(item.host_name)),
      );
    },

    addUserDeletedVulnerabilityAssets(pluginName: string, hostNames: string[]) {
      const name = String(pluginName || "").trim();
      if (!name) return;

      hostNames.forEach((host) => {
        const hostName = String(host || "").trim();
        if (!hostName) return;
        const exists = this.userDeletedVulnerabilityAssets.some(
          (item) => item.plugin_name === name && item.host_name === hostName,
        );
        if (exists) return;
        this.userDeletedVulnerabilityAssets.push({
          plugin_name: name,
          vul_name: name,
          host_name: hostName,
          _key: name.toLowerCase(),
        });
      });

      this.persistUserDeletedVulnerabilityAssets();
    },

    persistUserDeletedVulnerabilityAssets() {
      const reportId = this.userLatestReportId;
      if (!reportId || typeof localStorage === "undefined") return;
      try {
        const all = JSON.parse(localStorage.getItem("vapt_user_deleted_vuln_assets") || "{}");
        all[reportId] = this.userDeletedVulnerabilityAssets;
        localStorage.setItem("vapt_user_deleted_vuln_assets", JSON.stringify(all));
      } catch {
        // ignore storage errors
      }
    },

    restoreUserDeletedVulnerabilityAssetsFromStorage(reportId?: string | null) {
      const id = reportId || this.userLatestReportId;
      if (!id || typeof localStorage === "undefined") return;
      try {
        const all = JSON.parse(localStorage.getItem("vapt_user_deleted_vuln_assets") || "{}");
        const rows = Array.isArray(all[id]) ? all[id] : [];
        if (!rows.length) return;

        const restored = rows
          .map((row: any) => ({
            plugin_name: row.plugin_name || row.vul_name || "",
            vul_name: row.plugin_name || row.vul_name || "",
            host_name: row.host_name || row.asset || "",
            _key: String(row.plugin_name || row.vul_name || "")
              .trim()
              .toLowerCase(),
          }))
          .filter((row: any) => row.plugin_name && row.host_name);

        const seen = new Set(
          this.userDeletedVulnerabilityAssets.map(
            (row: any) => `${row.plugin_name}::${row.host_name}`,
          ),
        );
        restored.forEach((row: any) => {
          const key = `${row.plugin_name}::${row.host_name}`;
          if (seen.has(key)) return;
          seen.add(key);
          this.userDeletedVulnerabilityAssets.push(row);
        });
      } catch {
        // ignore storage errors
      }
    },

    async fetchUserHeldVulnerabilityAssets(force = false) {
      if (!force && this.userHeldVulnerabilityAssetsFetched) {
        return { status: true, data: this.userHeldVulnerabilityAssets };
      }

      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          return { status: false, data: this.userHeldVulnerabilityAssets };
        }

        const res = await endpoint.get(
          `/api/user/asset/report/${reportId}/vulnerability/hold-list/`,
        );

        // API returns: { vulnerabilities: [{ plugin_name, severity, hosts: [{ host_name, held_at, held_by }] }] }
        const vulnRows: any[] = Array.isArray(res.data?.vulnerabilities)
          ? res.data.vulnerabilities
          : [];

        // Flatten: one entry per vuln+host pair
        const normalized: any[] = [];
        vulnRows.forEach((vuln: any) => {
          const pluginName = String(vuln.plugin_name || vuln.vul_name || "").trim();
          if (!pluginName) return;
          const hosts: any[] = Array.isArray(vuln.hosts) ? vuln.hosts : [];
          hosts.forEach((host: any) => {
            const hostName = String(host.host_name || host.asset || "").trim();
            if (!hostName) return;
            normalized.push({
              plugin_name: pluginName,
              vul_name: pluginName,
              host_name: hostName,
              severity: vuln.severity || "Medium",
              cvss_score: vuln.cvss_score || "",
              assigned_team: vuln.assigned_team || "",
              held_at: host.held_at || "",
              held_by: host.held_by || "",
              status: "held",
              _key: pluginName.toLowerCase(),
              selected: false,
            });
          });
        });

        const merged = new Map<string, any>();
        const mergeRow = (row: any) => {
          const key = `${row.plugin_name}::${row.host_name}`;
          merged.set(key, { ...merged.get(key), ...row, selected: false });
        };
        (this.userHeldVulnerabilityAssets || []).forEach(mergeRow);
        normalized.forEach(mergeRow);
        this.userHeldVulnerabilityAssets = [...merged.values()];
        this.userHeldVulnerabilityAssetsFetched = true;

        return { status: true, data: this.userHeldVulnerabilityAssets };
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.warn(
            "[authStore] fetchUserHeldVulnerabilityAssets:",
            error.response?.data || error.message,
          );
        }
        this.userHeldVulnerabilityAssetsFetched = true;
        return { status: true, data: this.userHeldVulnerabilityAssets };
      }
    },

    async fetchUserDeletedVulnerabilityAssets(force = false) {
      if (!force && this.userDeletedVulnerabilityAssetsFetched) {
        return { status: true, data: this.userDeletedVulnerabilityAssets };
      }

      try {
        const reportId = await this.resolveUserReportId();
        if (!reportId) {
          this.restoreUserDeletedVulnerabilityAssetsFromStorage();
          this.userDeletedVulnerabilityAssetsFetched = true;
          return { status: true, data: this.userDeletedVulnerabilityAssets };
        }

        const res = await endpoint.get(
          `/api/user/asset/report/${reportId}/vulnerability/delete-list/`,
        );

        const rows =
          res.data?.deleted ?? res.data?.assets ?? res.data?.results ?? res.data?.items ?? [];
        const normalized = (Array.isArray(rows) ? rows : [])
          .map((row: any) => ({
            plugin_name: row.plugin_name || row.vul_name || "",
            vul_name: row.plugin_name || row.vul_name || "",
            host_name: row.host_name || row.asset || "",
            _key: String(row.plugin_name || row.vul_name || "")
              .trim()
              .toLowerCase(),
          }))
          .filter((row: any) => row.plugin_name && row.host_name);

        this.userDeletedVulnerabilityAssets = normalized;
        this.userDeletedVulnerabilityAssetsFetched = true;
        this.persistUserDeletedVulnerabilityAssets();

        return { status: true, data: this.userDeletedVulnerabilityAssets };
      } catch (error: any) {
        if (error.response?.status !== 404) {
          console.warn(
            "[authStore] fetchUserDeletedVulnerabilityAssets:",
            error.response?.data || error.message,
          );
        }
        this.restoreUserDeletedVulnerabilityAssetsFromStorage();
        this.userDeletedVulnerabilityAssetsFetched = true;
        return { status: true, data: this.userDeletedVulnerabilityAssets };
      }
    },

    // GET ALL ASSETS (NEW API)
    async fetchAssets(force = false) {
      if (!force && this.assetRows.length > 0) {
        return {
          status: true,
          data: {
            assets: this.assetRows,
            total_assets: this.assetCount,
            member_type: this.memberType,
          },
        };
      }
      console.log("🚀 fetchAssets called");
      try {
        const res = await endpoint.get(`/api/admin/adminasset/assets/`);

        const rows = res.data.assets || [];

        const normalized = rows.map((a: any) => ({
          ...a,

          // UI state flags
          selected: false,
          held: false,

          // NEW: member type comes from top-level response
          isInternal: res.data.member_type === "internal",

          // safety defaults
          host_information: a.host_information || {},
          severity_counts: a.severity_counts || {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
          },
        }));

        // 🔥 store assignments
        this.assetRows = normalized;
        this.assetCount = res.data.total_assets ?? normalized.length;
        this.memberType = res.data.member_type;

        console.log("[authStore] assetRows length:", this.assetRows.length);

        return { status: true, data: res.data };
      } catch (error: any) {
        console.error("[authStore] fetchAssets error:", error.response?.data || error.message);
        return { status: false, error: error.response?.data || error.message };
      }
    },

    // DELETE Asset from report (UPDATED)
    async deleteAsset(assetIp: string) {
      try {
        const reportId = await this.resolveReportId();

        if (!reportId) {
          return {
            status: false,
            message: "Report ID not found",
          };
        }

        const res = await endpoint.delete(
          `/api/admin/adminasset/report/${reportId}/assets/${assetIp}/`,
        );

        console.log("✔ Asset deleted:", res.data);

        // ✅ remove from main assets list
        this.assetRows = this.assetRows.filter((a) => a.asset !== assetIp);
        this.invalidateAdminRealtimeCaches(reportId);

        return {
          status: true,
          data: res.data,
        };
      } catch (error: any) {
        console.error("❌ Delete Asset Error:", error.response?.data || error.message);
        return {
          status: false,
          message: error.response?.data?.detail || "Failed to delete asset",
        };
      }
    },

    // HOLD asset (UPDATED API)
    async holdAsset(assetIp: string) {
      try {
        const reportId = await this.resolveReportId();

        if (!reportId) {
          return {
            status: false,
            message: "Report ID not found",
          };
        }

        const res = await endpoint.post(
          `/api/admin/adminasset/report/${reportId}/assets/${assetIp}/hold/`,
        );

        // ✅ update asset count (top Assets number)
        if (typeof res.data?.total_assets === "number") {
          this.assetCount = res.data.total_assets;
        }
        this.invalidateAdminRealtimeCaches(reportId);

        return {
          status: true,
          heldAsset: res.data.asset, // 👈 SAME SHAPE AS OLD CODE EXPECTS
          data: res.data,
        };
      } catch (error: any) {
        console.error("Hold asset error:", error);
        return {
          status: false,
          message: error.response?.data?.detail || "Failed to hold asset",
        };
      }
    },

    // FETCH HELD ASSETS LIST (UPDATED)
    async fetchHeldAssets() {
      try {
        const reportId = await this.resolveReportId();

        if (!reportId) {
          return {
            status: false,
            assets: [],
            count: 0,
            message: "Report ID not found",
          };
        }

        const res = await endpoint.get(
          `/api/admin/adminasset/report/${reportId}/assets/hold-list/`,
        );

        return {
          status: true,
          assets: res.data.assets || [],
          count: res.data.count || 0,
          data: res.data,
        };
      } catch (error: any) {
        console.error("Fetch held assets error:", error);
        return {
          status: false,
          assets: [],
          count: 0,
          message: error.response?.data?.detail || "Failed to fetch held assets",
        };
      }
    },

    // UNHOLD asset (UPDATED – matches new API)
    async unholdAsset(assetIp: string) {
      try {
        const reportId = await this.resolveReportId();

        if (!reportId) {
          return {
            status: false,
            message: "Report ID not found",
          };
        }

        const res = await endpoint.post(
          `/api/admin/adminasset/report/${reportId}/assets/${assetIp}/unhold/`,
        );

        // ✅ update asset count
        if (typeof res.data?.total_assets === "number") {
          this.assetCount = res.data.total_assets;
        }
        this.invalidateAdminRealtimeCaches(reportId);

        return {
          status: true,
          restoredAsset: res.data.asset, // 👈 REQUIRED by component
          data: res.data,
        };
      } catch (error: any) {
        console.error("Unhold asset error:", error);
        return {
          status: false,
          message: error.response?.data?.detail || "Failed to unhold asset",
        };
      }
    },

    // ✅ Get support requests by host_name
    async getSupportRequestsByHost(host: string) {
      try {
        const safeHost = encodeURIComponent(host);
        const res = await endpoint.get(
          `/api/admin/adminregister/support-requests/host/${safeHost}/`,
        );

        return {
          status: true,
          data: res.data.results || [],
          count: res.data.count || 0,
          message: res.data.message,
        };
      } catch (error: any) {
        return {
          status: false,
          data: [],
          count: 0,
          message: error?.response?.data?.message || "Failed to fetch support requests",
        };
      }
    },

    // Get support requests by host for assets page
    // async getSupportRequestsByHost(host: string) {
    //   try {
    //     const res = await endpoint.get(
    //       `/api/admin/adminasset/support-requests/host/${host}/`
    //     );

    //     return {
    //       status: true,
    //       data: res.data.results || [],
    //       count: res.data.count || 0
    //     };
    //   } catch (error: any) {
    //     return {
    //       status: false,
    //       data: [],
    //       count: 0
    //     };
    //   }
    // },

    // Get closed fix vulnerabilities by host
    // async getClosedFixVulnerabilitiesByHost(host: string) {
    //   try {
    //     const res = await endpoint.get(
    //       `/api/admin/adminasset/fix-vulnerabilities/host/${host}/closed/`
    //     );

    //     return {
    //       status: true,
    //       data: res.data.results || [],
    //       count: res.data.count || 0
    //     };
    //   } catch (error) {
    //     return {
    //       status: false,
    //       data: [],
    //       count: 0
    //     };
    //   }
    // },

    // FETCH vulnerabilities for single asset (UPDATED)
    async fetchSingleAssetVulnerabilities(asset: string) {
      try {
        const reportId = await this.resolveReportId();

        if (!reportId) {
          return { status: false };
        }

        const res = await endpoint.get(
          `/api/admin/adminasset/report/${reportId}/asset/${asset}/vulnerabilities/`,
        );

        let vulns = normalizeAssetVulnerabilityList(res.data.vulnerabilities || []);
        if (!vulns.length) {
          await this.fetchVulnerabilityRegister(true);
          vulns = buildVulnsFromRegister(
            this.vulnerabilityRows,
            asset,
            this.deletedVulnerabilityAssets,
          );
        }
        vulns = filterDeletedVulnsForHost(vulns, asset, this.deletedVulnerabilityAssets);

        // ✅ vulnerabilities list
        this.selectedAssetVulnerabilities = vulns;

        // ✅ asset summary (top card)
        this.selectedAssetDetail = {
          asset: res.data.asset || asset,
          exposure: vulns[0]?.exposure || "",
          owner: vulns[0]?.owner || "",
          severity: vulns[0]?.severity || "",
        };

        return {
          status: true,
          count: vulns.length || res.data.count,
        };
      } catch (error) {
        console.error("Fetch single asset vulnerabilities failed:", error);
        this.selectedAssetDetail = null;
        this.selectedAssetVulnerabilities = [];
        return { status: false };
      }
    },

    // ✅ Clear all cached data (called on logout or manual refresh)
    clearCache() {
      this.assetRows = [];
      this.assetCount = 0;
      this.vulnerabilityRows = [];
      this.vulnerabilityCount = 0;
      this.latestReportId = null;
      this.userLatestReportId = null;
      this.cachedUserAssets = [];
      this.cachedUserAssetTotal = 0;
      this.cachedUserHeldAssets = [];
      this.userHeldAssetsFetched = false;
      this.cachedMeanTime = {};
      this.cachedMitigationTimeline = {};
      this.cachedUserVulnerabilities = {};
      this.cachedUserVulnerabilitiesFixed = {};
      this.cachedSupportRequests = {};
      this.cachedOpenTickets = {};
      this.cachedMitigationByTeam = null;
      this.cachedUserMitigationByTeam = null;
      this.cachedTicketsByReport = {};
      this.cachedUsersByAdmin = [];
      this.usersByAdminFetched = false;
      this.cachedDistributionByTeam = null;
      this.cachedUserVulnRegister = [];
      this.userVulnRegisterFetched = false;
      this.allReportVulnerabilities = [];
      this.allReportVulnerabilitiesTotal = 0;
      this.allReportVulnerabilitiesFetched = false;
      this.heldVulnerabilityAssets = [];
      this.heldVulnerabilityAssetsFetched = false;
      this.deletedVulnerabilityAssets = [];
      this.deletedVulnerabilityAssetsFetched = false;
      this.userAllReportVulnerabilities = [];
      this.userAllReportVulnerabilitiesTotal = 0;
      this.userAllReportVulnerabilitiesFetched = false;
      this.userHeldVulnerabilityAssets = [];
      this.userHeldVulnerabilityAssetsFetched = false;
      this.userDeletedVulnerabilityAssets = [];
      this.userDeletedVulnerabilityAssetsFetched = false;
      this.cachedUserSupportRequests = {};
      this.cachedUserOpenTickets = {};
      this.cachedUserClosedVulns = null;
      this.cachedUserTotalAssets = {};
      this.cachedUserAllTickets = {};
      this.projectNames = [];
    },

    // ✅ Invalidate user caches after write operations for instant UI refresh
    invalidateUserRealtimeCaches(reportId?: string) {
      this.cachedUserAssets = [];
      this.cachedUserAssetTotal = 0;
      this.cachedUserHeldAssets = [];
      this.userHeldAssetsFetched = false;
      this.cachedUserTotalAssets = {};
      this.cachedUserVulnRegister = [];
      this.userVulnRegisterFetched = false;
      this.userAllReportVulnerabilities = [];
      this.userAllReportVulnerabilitiesTotal = 0;
      this.userAllReportVulnerabilitiesFetched = false;
      this.userHeldVulnerabilityAssets = [];
      this.userHeldVulnerabilityAssetsFetched = false;
      this.userDeletedVulnerabilityAssets = [];
      this.userDeletedVulnerabilityAssetsFetched = false;
      this.cachedUserClosedVulns = null;
      this.cachedUserVulnerabilities = {};
      this.cachedUserVulnerabilitiesFixed = {};
      this.cachedUserSupportRequests = {};
      this.cachedUserOpenTickets = {};
      this.cachedUserAllTickets = {};
      this.cachedMeanTime = {};
      this.cachedMitigationTimeline = {};
      this.cachedUserMitigationByTeam = null;
      if (reportId) {
        delete this.cachedUserSupportRequests[reportId];
        delete this.cachedUserOpenTickets[reportId];
        delete this.cachedUserAllTickets[reportId];
      }
    },

    // ✅ Invalidate only user support/ticket related caches (faster than full reset)
    invalidateUserSupportTicketCaches(reportId?: string) {
      if (reportId) {
        delete this.cachedUserSupportRequests[reportId];
        delete this.cachedUserOpenTickets[reportId];
        delete this.cachedUserAllTickets[reportId];
      } else {
        this.cachedUserSupportRequests = {};
        this.cachedUserOpenTickets = {};
        this.cachedUserAllTickets = {};
      }
    },

    // ✅ Invalidate admin caches after write operations for instant UI refresh
    invalidateAdminRealtimeCaches(reportId?: string) {
      this.assetRows = [];
      this.assetCount = 0;
      this.vulnerabilityRows = [];
      this.vulnerabilityCount = 0;
      this.allReportVulnerabilities = [];
      this.allReportVulnerabilitiesTotal = 0;
      this.allReportVulnerabilitiesFetched = false;
      this.selectedAssetDetail = null;
      this.selectedAssetVulnerabilities = [];
      this.cachedSupportRequests = {};
      this.cachedOpenTickets = {};
      this.cachedTicketsByReport = {};
      this.cachedMitigationByTeam = null;
      this.latestReportId = null;
      if (reportId) {
        delete this.cachedSupportRequests[reportId];
        delete this.cachedOpenTickets[reportId];
        delete this.cachedTicketsByReport[reportId];
      }
    },

    // ✅ Invalidate only admin support/ticket related caches (keeps assets warm)
    invalidateAdminSupportTicketCaches(reportId?: string) {
      if (reportId) {
        delete this.cachedSupportRequests[reportId];
        delete this.cachedOpenTickets[reportId];
        delete this.cachedTicketsByReport[reportId];
      } else {
        this.cachedSupportRequests = {};
        this.cachedOpenTickets = {};
        this.cachedTicketsByReport = {};
      }
    },

    // ✅ Logout user (frontend-first, backend revoke in background)
    async logout() {
      const refreshToken = sessionStorage.getItem("refreshToken");

      // Clear local session immediately so signout feels instant.
      clearAllAuthTokens();
      sessionStorage.removeItem("google_id_token");
      sessionStorage.removeItem("isNewUser");
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.clearCache();

      // Best-effort server revoke; do not block UI navigation.
      if (refreshToken) {
        void endpoint
          .post("/api/admin/users/logout/", { refresh: refreshToken })
          .catch((error: any) => {
            console.warn(
              "[authStore] Background logout revoke failed:",
              error?.response?.data || error?.message || error,
            );
          });
      }

      console.log("🚪 User logged out, local session cleared");
      return { status: true };
    },

    // ✅ Set Auth
    setAuth(token: string, user: any) {
      this.token = token;
      this.user = user;
      this.authenticated = true;

      // Primary auth store
      sessionStorage.setItem("authorization", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("authenticated", JSON.stringify(true));

      // Backward compatibility for legacy modules that still read localStorage.
      localStorage.setItem("authorization", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("authenticated", JSON.stringify(true));

      console.log("Access Token saved:", token);
      console.log("Refresh Token saved:", sessionStorage.getItem("refreshToken"));
      // console.log("✅ Locations saved in localStorage:", this.locations);
      // console.log("✅ Auth set successfully:", this.user, this.locations);
    },

    getAuthorization() {
      return this.token;
    },

    // ✅ Returns a user-scoped localStorage key for completedSteps
    _stepsKey(): string {
      const user =
        this.user ||
        (sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")!) : null);
      const uid = user?.id || user?.email || "";
      return uid ? `completedSteps_${uid}` : "completedSteps";
    },

    // ✅ Mark onboarding step as completed
    markStepCompleted(stepNumber: number) {
      if (!this.completedSteps.includes(stepNumber)) {
        this.completedSteps.push(stepNumber);
        localStorage.setItem(this._stepsKey(), JSON.stringify(this.completedSteps));
        console.log(`✅ Step ${stepNumber} marked as completed`);
      }
    },

    // ✅ Initialize completed steps from localStorage
    initCompletedSteps() {
      const saved = localStorage.getItem(this._stepsKey());
      if (saved) {
        this.completedSteps = JSON.parse(saved);
        console.log("♻️ Restored completed steps:", this.completedSteps);
      }
    },

    // ✅ Reset completed steps (useful for testing or new onboarding)
    resetCompletedSteps() {
      this.completedSteps = [];
      localStorage.removeItem(this._stepsKey());
      console.log("🔄 Completed steps reset");
    },

    // ✅ Resolve reportId — reads localStorage, falls back to store state,
    // and auto-fetches from the API if still missing.
    async resolveReportId(): Promise<string | null> {
      let reportId: string | null = localStorage.getItem("reportId") || this.reportStatus.reportId;
      if (!reportId) {
        await this.getReportStatus();
        reportId = localStorage.getItem("reportId") || this.reportStatus.reportId;
      }
      return reportId;
    },

    // ✅ GET Report Status (for dashboard - Super Admin upload check)
    async getReportStatus() {
      try {
        const res = await endpoint.get("/api/admin/admindashboard/dashboard/report-status/");

        const data = res.data;

        const hasReport = data.has_report ?? false;
        const reportId = data.report_id || null;
        const message = data.message || "";

        // ✅ Update reactive store state
        this.reportStatus.hasReport = hasReport;
        this.reportStatus.reportId = reportId;
        this.reportStatus.message = message;
        this.reportStatus.checked = true;

        // ✅ Also update localStorage for persistence
        if (hasReport && reportId) {
          localStorage.setItem("reportId", reportId);
        } else {
          localStorage.removeItem("reportId");
        }

        console.log("📊 Report status updated:", { hasReport, reportId, message });

        return {
          status: true,
          hasReport,
          showDashboard: data.show_dashboard ?? false,
          reportId,
          message,
          adminId: data.admin_id || null,
          adminEmail: data.admin_email || null,
        };
      } catch (error: any) {
        console.error("❌ Report status check failed:", error);

        // ✅ Update store state on error too
        this.reportStatus.checked = true;
        this.reportStatus.hasReport = false;
        this.reportStatus.message =
          error.response?.data?.message || "Failed to check report status";

        return {
          status: false,
          hasReport: false,
          showDashboard: false,
          reportId: null,
          message: error.response?.data?.message || "Failed to check report status",
        };
      }
    },

    // Get all closed vulnerabilities for a report + asset
    async getClosedVulnerabilities(reportId: string, asset: string) {
      try {
        const res = await endpoint.get(
          `/api/admin/adminregister/closed-vulnerabilities/report/${reportId}/asset/${asset}/`,
        );

        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch closed vulnerabilities",
          details: err.response?.data || null,
        };
      }
    },

    // Admin notifications list
    async fetchAdminNotifications(includeRead = false) {
      try {
        const params: any = { _ts: Date.now() };
        // If includeRead is true, request all notifications (read + unread)
        if (includeRead) {
          params.status = "all";
        }
        const res = await endpoint.get(`/api/notifications/admin/list/`, {
          params,
        });
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to fetch notifications",
        };
      }
    },

    // User notifications list
    async fetchUserNotifications(includeRead = false) {
      try {
        const params: any = { _ts: Date.now() };
        // If includeRead is true, request all notifications (read + unread)
        if (includeRead) {
          params.status = "all";
        }
        const res = await endpoint.get(`/api/notifications/user/list/`, {
          params,
        });
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to fetch user notifications",
        };
      }
    },

    // User unread notifications count
    async fetchUserUnreadNotificationCount() {
      try {
        const res = await endpoint.get(`/api/notifications/user/unread-count/`, {
          params: { _ts: Date.now() },
        });
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to fetch user unread notification count",
        };
      }
    },

    // Admin unread notifications count
    async fetchAdminUnreadNotificationCount() {
      try {
        const res = await endpoint.get(`/api/notifications/admin/unread-count/`, {
          params: { _ts: Date.now() },
        });
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to fetch unread notification count",
        };
      }
    },

    // Mark a specific admin notification as read
    async markAdminNotificationRead(notificationId: string) {
      try {
        const res = await endpoint.patch(`/api/notifications/admin/${notificationId}/mark-read/`);
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to mark notification as read",
        };
      }
    },

    // Mark a specific user notification as read
    async markUserNotificationRead(notificationId: string) {
      try {
        const res = await endpoint.patch(`/api/notifications/user/${notificationId}/mark-read/`);
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to mark notification as read",
        };
      }
    },

    // Mark all admin notifications as read
    async markAllAdminNotificationsRead() {
      try {
        const res = await endpoint.patch(`/api/notifications/admin/mark-all-read/`);
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to mark all notifications as read",
        };
      }
    },

    // Mark all user notifications as read
    async markAllUserNotificationsRead() {
      try {
        const res = await endpoint.patch(`/api/notifications/user/mark-all-read/`);
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.detail ||
            err.response?.data?.message ||
            "Failed to mark all notifications as read",
        };
      }
    },

    // Get admin remediation timeline in-process summary
    async getDashboardRemediationInProcess() {
      try {
        const res = await endpoint.get(
          `/api/admin/admindashboard/dashboard/remediation-timeline/in-process/`,
        );
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message: err.response?.data?.message || "Failed to fetch in-process remediation timeline",
        };
      }
    },

    // Get user remediation timeline in-process summary
    async getUserDashboardRemediationInProcess() {
      try {
        const res = await endpoint.get(`/api/user/dashboard/remediation-timeline/in-process/`);
        return {
          status: true,
          data: res.data,
        };
      } catch (error) {
        const err = error as AxiosError<any>;
        return {
          status: false,
          message:
            err.response?.data?.message || "Failed to fetch user in-process remediation timeline",
        };
      }
    },

    // Get vulnerabilities for a specific host, grouped by risk factor
    // async getHostVulnerabilities(hostName: string) {
    //   try {
    //     const res = await endpoint.get(
    //       `/api/admin/adminregister/register/host/${hostName}/vulns/`
    //     );

    //     return {
    //       status: true,
    //       data: res.data
    //     };

    //   } catch (error) {
    //     const err = error as AxiosError<any>;
    //     return {
    //       status: false,
    //       message: err.response?.data?.message || "Failed to fetch host vulnerabilities",
    //       details: err.response?.data || null
    //     };
    //   }
    // },

    async fetchMitigationByTeam(force = false) {
      if (!force && this.cachedMitigationByTeam) {
        return { status: true, data: this.cachedMitigationByTeam };
      }
      try {
        const res = await endpoint.get(`/api/admin/adminmitigationstrategy/by-team/`);
        this.cachedMitigationByTeam = res.data;
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message || error.message || "Failed to fetch mitigation data",
        };
      }
    },

    // ✅ User: Mitigation Timeline Extension Report
    async fetchUserMitigationTimelineExtensionReport() {
      try {
        const res = await endpoint.get(`/api/user/dashboard/mitigation-timeline-extension/report/`);
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch mitigation timeline extension report",
        };
      }
    },

    // ✅ Admin: Refresh Microsoft Teams Access Token silently
    async refreshMicrosoftTeamsToken() {
      try {
        const res = await endpoint.post(`/api/admin/users/microsoft-teams/token-refresh/`);
        if (res.data?.access_token) {
          localStorage.setItem("microsoft_graph_token", res.data.access_token);
          return { status: true, access_token: res.data.access_token };
        }
        return { status: false, message: "No access token in response" };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message || error.message || "Failed to refresh Teams token",
        };
      }
    },

    // ✅ Admin: Resync Slack for a user
    async resyncSlackUser(detailId: string) {
      try {
        const res = await endpoint.post(
          `/api/admin/users_details/user-detail/${detailId}/resync-slack/`,
        );
        return {
          status: true,
          data: res.data,
          slack_sync: res.data?.slack_sync || null,
          message: res.data?.message || "Resync initiated",
        };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            "Failed to resync Slack",
        };
      }
    },

    // ✅ Admin: Fetch Risk Criteria Calendar Day View
    async fetchRiskCriteriaCalendarDay(date: string) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const res = await endpoint.get(
          `/api/admin/risk_criteria/risks/${riskCriteriaId}/calendar/day/`,
          { params: { date } },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch day calendar",
        };
      }
    },

    // ✅ Admin: Fetch Risk Criteria Calendar Week View
    async fetchRiskCriteriaCalendarWeek(date: string) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const res = await endpoint.get(
          `/api/admin/risk_criteria/risks/${riskCriteriaId}/calendar/week/`,
          { params: { date } },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch week calendar",
        };
      }
    },

    // ✅ Admin: Fetch Risk Criteria Calendar with team and severity filters
    async fetchRiskCriteriaCalendarWithFilters(
      year: number,
      month: number,
      team?: string,
      severity?: string,
    ) {
      try {
        const riskCriteriaId =
          localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId");
        if (!riskCriteriaId) return { status: false, message: "Risk criteria ID not found" };
        const monthStr = `${year}-${String(month).padStart(2, "0")}`;
        const params: Record<string, string> = { month: monthStr };
        if (team) params.team = team;
        if (severity) params.severity = severity;
        const res = await endpoint.get(
          `/api/admin/risk_criteria/risks/${riskCriteriaId}/calendar/`,
          { params },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message: error?.response?.data?.message || "Failed to fetch calendar",
        };
      }
    },

    // ✅ Admin: Update Mitigation Timeline Extension Request Status (Approve/Reject)
    async updateAdminMitigationTimelineExtensionStatus(
      requestId: string,
      payload: { status: string; admin_comment: string },
    ) {
      try {
        const res = await endpoint.patch(
          `/api/admin/admindashboard/dashboard/mitigation-timeline-extension/${requestId}/status/`,
          payload,
        );
        this.invalidateAdminRealtimeCaches(this.latestReportId || undefined);
        return { status: true, data: res.data, message: res.data?.message };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            "Failed to update request status",
        };
      }
    },

    // ✅ Admin: Mitigation Timeline Extension Report
    async fetchAdminMitigationTimelineExtensionReport() {
      try {
        const res = await endpoint.get(
          `/api/admin/admindashboard/dashboard/mitigation-timeline-extension/report/`,
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch admin mitigation timeline extension report",
        };
      }
    },

    // ✅ Admin: Mitigation Timeline Extension
    async fetchAdminMitigationTimelineExtension() {
      try {
        const res = await endpoint.get(
          `/api/admin/admindashboard/dashboard/mitigation-timeline-extension/`,
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch admin mitigation timeline extension",
        };
      }
    },

    // ✅ User: Submit Mitigation Timeline Extension Request
    async submitUserMitigationTimelineExtensionRequest(payload: {
      severity: string;
      asset: string;
      vulnerability_name: string;
      requested_extension_days: number;
      reason: string;
      team?: string;
    }) {
      try {
        const res = await endpoint.post(
          `/api/user/dashboard/mitigation-timeline-extension/request/`,
          payload,
        );
        this.invalidateUserRealtimeCaches(this.userLatestReportId || undefined);
        return {
          status: true,
          data: res.data,
          message: res.data?.message || "Extension request submitted",
          request_id: res.data?.request_id,
          request_status: res.data?.status,
        };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            "Failed to submit extension request",
        };
      }
    },

    // ✅ User: Mitigation Timeline Extension Options (assets, vulnerabilities, deadline)
    async fetchUserMitigationTimelineExtensionOptions(
      severity: string,
      asset?: string,
      team?: string,
      reportId?: string,
      vulName?: string,
    ) {
      try {
        // Use new API endpoint if reportId and vulName are provided
        if (reportId && asset && vulName) {
          const params: Record<string, string> = {
            report_id: reportId,
            asset: asset,
            vul_name: vulName,
          };
          const res = await endpoint.get(
            `/api/user/dashboard/mitigation-timeline-extension/options-by-fix/`,
            { params },
          );
          return { status: true, data: res.data };
        }

        // Otherwise use old API endpoint
        const params: Record<string, string> = { severity };
        if (asset) params.asset = asset;
        if (team) params.team = team;
        const res = await endpoint.get(
          `/api/user/dashboard/mitigation-timeline-extension/options/`,
          { params },
        );
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch mitigation timeline extension options",
        };
      }
    },

    // ✅ User: Mitigation Timeline Extension
    async fetchUserMitigationTimelineExtension() {
      try {
        const res = await endpoint.get(`/api/user/dashboard/mitigation-timeline-extension/`);
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch mitigation timeline extension",
        };
      }
    },

    // ✅ User: Mitigation by team
    async fetchUserMitigationByTeam(force = false) {
      if (!force && this.cachedUserMitigationByTeam) {
        return { status: true, data: this.cachedUserMitigationByTeam };
      }
      try {
        const res = await endpoint.get(`/api/user/mitigation/by-team/`);
        this.cachedUserMitigationByTeam = res.data;
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch user mitigation data",
        };
      }
    },

    // ✅ Admin: Mitigation vuln-asset-count
    async fetchAdminMitigationVulnAssetCount() {
      try {
        const res = await endpoint.get(`/api/admin/adminmitigationstrategy/vuln-asset-count/`);
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch admin vuln asset count",
        };
      }
    },

    // ✅ User: Closed vulnerabilities
    async fetchUserClosedVulns(force = false) {
      if (!force && this.cachedUserClosedVulns) {
        return { status: true, data: this.cachedUserClosedVulns };
      }
      try {
        const res = await endpoint.get(`/api/user/register/closed-vulns/`);
        this.cachedUserClosedVulns = res.data;
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message ||
            error.message ||
            "Failed to fetch closed vulnerabilities",
        };
      }
    },

    // ✅ User: Mitigation vuln-asset-count
    async fetchUserMitigationVulnAssetCount() {
      try {
        const res = await endpoint.get(`/api/user/mitigation/vuln-asset-count/`);
        return { status: true, data: res.data };
      } catch (error: any) {
        return {
          status: false,
          message:
            error.response?.data?.message || error.message || "Failed to fetch vuln asset count",
        };
      }
    },

    // ✅ Reset report status (useful for logout)
    resetReportStatus() {
      this.reportStatus.hasReport = false;
      this.reportStatus.reportId = null;
      this.reportStatus.message = "";
      this.reportStatus.checked = false;
      localStorage.removeItem("reportId");
      console.log("🔄 Report status reset");
    },
  },
});
