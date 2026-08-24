<template>
  <div class="callback-loading">
    <p>{{ statusMessage }}</p>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import {
  extractSetPasswordFromPayload,
  extractSetPasswordParams,
  redirectToUserSetPasswordHome,
  storeSetPasswordDeepLink,
} from "@/utils/userSetPasswordDeepLink";
import {
  clearPendingMemberFlow,
  readPendingMemberEmail,
  readPendingMemberFlow,
} from "@/utils/authenticatedHome";
import {
  extractTeamsDeepLink,
  persistTeamsDeepLink,
  resolveTeamsAdminDashboardUrl,
} from "@/utils/teamsDeepLink";

export default {
  data() {
    return {
      statusMessage: "Connecting Microsoft Teams...",
    };
  },
  methods: {
    isMemberFlow() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("flow") === "member") return true;
      return readPendingMemberFlow() === "teams";
    },
    notifyOpener(payload) {
      if (window.opener) {
        window.opener.postMessage(payload, window.location.origin);
      }
    },
    redirectMemberToSetPassword(details) {
      const setPwd = extractSetPasswordFromPayload(details);
      if (!setPwd) return false;
      storeSetPasswordDeepLink(setPwd);
      if (window.opener) {
        this.notifyOpener({
          type: "MEMBER_SET_PASSWORD_REQUIRED",
          uidb64: setPwd.uidb64,
          token: setPwd.token,
          email: setPwd.email,
        });
        setTimeout(() => window.close(), 400);
        return true;
      }
      redirectToUserSetPasswordHome(setPwd.uidb64, setPwd.token, setPwd.email);
      return true;
    },
    getAccessToken() {
      const queryParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
      return (
        queryParams.get("access_token") ||
        queryParams.get("token") ||
        queryParams.get("ms_token") ||
        hashParams.get("access_token")
      );
    },
    async finishMemberSuccess() {
      clearPendingMemberFlow();
      sessionStorage.setItem("member_teams_connected", "true");
      localStorage.setItem("member_teams_connected", "true");
      sessionStorage.removeItem("member_slack_connected");
      localStorage.removeItem("member_slack_connected");
      this.notifyOpener({ type: "TEAMS_MEMBER_LOGGED_IN", success: true });
      this.statusMessage = "Signed in. Opening your dashboard...";
      if (window.opener) {
        setTimeout(() => window.close(), 800);
        return;
      }
      this.$router.replace("/userdashboard");
    },
    async handleMemberCallback(accessToken) {
      const authStore = useAuthStore();
      const queryParams = new URLSearchParams(window.location.search);
      const email =
        readPendingMemberEmail() ||
        queryParams.get("email") ||
        "";
      const msUserId = queryParams.get("ms_user_id") || queryParams.get("user_id") || "";

      const res = await authStore.teamsMemberLogin({
        email,
        access_token: accessToken,
        ms_user_id: msUserId || undefined,
      });

      if (res.status) {
        await this.finishMemberSuccess();
      } else if (this.redirectMemberToSetPassword(res.details)) {
        clearPendingMemberFlow();
        this.statusMessage = "Redirecting to set your password...";
      } else {
        await Swal.fire("Error", res.message || "Microsoft Teams member login failed", "error");
        if (window.opener) {
          window.close();
        } else {
          this.$router.push("/home");
        }
      }
    },
    async handleAdminCallback(accessToken) {
      const authStore = useAuthStore();
      const res = await authStore.microsoftLogin(accessToken);

      if (res.status) {
        const links = extractTeamsDeepLink(res.data);
        persistTeamsDeepLink(links);
        this.notifyOpener({
          type: "TEAMS_CONNECTED",
          success: true,
          is_new_user: res.data?.is_new_user === true,
          django_access_token:
            res.data?.django_access_token || localStorage.getItem("access_token"),
          django_refresh_token:
            res.data?.django_refresh_token || localStorage.getItem("refresh_token"),
          user: res.data?.user,
          vaptfix_team:
            res.data?.vaptfix_team ||
            JSON.parse(localStorage.getItem("vaptfix_team") || "null"),
          status: links.status || res.data?.status,
          teams_tab_url: links.teams_tab_url,
          teams_tab_url_alt: links.teams_tab_url_alt,
          teams_desktop_url: links.teams_desktop_url,
          teams_url: links.teams_url,
          tokens: {
            access_token:
              res.data?.tokens?.access_token ||
              localStorage.getItem("microsoft_graph_token"),
            tenant_id:
              res.data?.tokens?.tenant_id || localStorage.getItem("microsoft_tenant_id"),
          },
        });
        this.statusMessage =
          links.status === "provisioning"
            ? "Setting up your workspace..."
            : "Opening the VAPTFIX admin dashboard channel...";
        const url = await resolveTeamsAdminDashboardUrl(res.data, async () => {
          const statusRes = await authStore.fetchMicrosoftTeamsLoginStatus();
          return statusRes.data || {};
        });
        if (url) {
          window.location.replace(url);
          return;
        }
        if (window.opener) {
          setTimeout(() => window.close(), 800);
          return;
        }
        this.$router.replace("/admin-upload-report");
      } else {
        await Swal.fire("Error", "Microsoft login failed", "error");
        this.$router.push("/home");
      }
    },
  },
  async mounted() {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const setPwdFromUrl = extractSetPasswordParams(
        Object.fromEntries(queryParams.entries()),
      );
      if (setPwdFromUrl.uidb64 && setPwdFromUrl.token) {
        redirectToUserSetPasswordHome(
          setPwdFromUrl.uidb64,
          setPwdFromUrl.token,
          setPwdFromUrl.email,
        );
        return;
      }

      const accessToken = this.getAccessToken();

      if (!accessToken) {
        await Swal.fire("Error", "Microsoft access token missing", "error");
        if (this.isMemberFlow()) {
          window.close();
        } else {
          this.$router.push("/home");
        }
        return;
      }

      if (this.isMemberFlow()) {
        await this.handleMemberCallback(accessToken);
        return;
      }

      await this.handleAdminCallback(accessToken);
    } catch (err) {
      console.error("Microsoft callback error:", err);
      await Swal.fire("Error", "Microsoft connection failed", "error");
      if (this.isMemberFlow() && window.opener) {
        window.close();
      } else {
        this.$router.push("/home");
      }
    }
  },
};
</script>
