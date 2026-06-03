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
} from "@/utils/userSetPasswordDeepLink";

export default {
  data() {
    return {
      statusMessage: "Connecting Microsoft Teams...",
    };
  },
  methods: {
    isMemberFlow() {
      const params = new URLSearchParams(window.location.search);
      return params.get("flow") === "member";
    },
    notifyOpener(payload) {
      if (window.opener) {
        window.opener.postMessage(payload, window.location.origin);
      }
    },
    redirectMemberToSetPassword(details) {
      const setPwd = extractSetPasswordFromPayload(details);
      if (!setPwd) return false;
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
    async handleMemberCallback(accessToken) {
      const authStore = useAuthStore();
      const queryParams = new URLSearchParams(window.location.search);
      const email =
        sessionStorage.getItem("pending_member_email") ||
        queryParams.get("email") ||
        "";
      const msUserId = queryParams.get("ms_user_id") || queryParams.get("user_id") || "";

      const res = await authStore.teamsMemberLogin({
        email,
        access_token: accessToken,
        ms_user_id: msUserId || undefined,
      });

      if (res.status) {
        localStorage.setItem("microsoft_graph_token", accessToken);
        localStorage.setItem("teams_connected", "true");
        sessionStorage.removeItem("pending_member_flow");
        this.notifyOpener({ type: "TEAMS_MEMBER_LOGGED_IN", success: true });
        this.statusMessage = "Success! You can close this window.";
        setTimeout(() => window.close(), 1200);
      } else if (this.redirectMemberToSetPassword(res.details)) {
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
        this.notifyOpener({
          type: "TEAMS_CONNECTED",
          success: true,
          django_access_token:
            res.data?.django_access_token || localStorage.getItem("access_token"),
          django_refresh_token:
            res.data?.django_refresh_token || localStorage.getItem("refresh_token"),
          user: res.data?.user,
          vaptfix_team:
            res.data?.vaptfix_team ||
            JSON.parse(localStorage.getItem("vaptfix_team") || "null"),
          tokens: {
            access_token:
              res.data?.tokens?.access_token ||
              localStorage.getItem("microsoft_graph_token"),
            tenant_id:
              res.data?.tokens?.tenant_id || localStorage.getItem("microsoft_tenant_id"),
          },
        });
        this.$router.push("/settings");
      } else {
        await Swal.fire("Error", "Microsoft login failed", "error");
        this.$router.push("/settings");
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
          this.$router.push("/settings");
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
        this.$router.push("/settings");
      }
    }
  },
};
</script>
