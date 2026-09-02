<template>
  <div class="callback-loading">
    <p>{{ statusMessage }}</p>
    <button
      v-if="teamsOpenUrl"
      type="button"
      class="open-teams-btn"
      @click="openTeamsNow"
    >
      Open VAPTFIX in Teams
    </button>
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
  resolveDjangoOAuthPostMessageFields,
} from "@/utils/djangoOAuthTokens";
import {
  clearPendingMemberFlow,
  readPendingMemberEmail,
  readPendingMemberFlow,
} from "@/utils/authenticatedHome";
import {
  extractTeamsDeepLink,
  persistTeamsDeepLink,
  resolveTeamsAdminDashboardUrl,
  landOnTeamsAdminDashboardChannel,
  openTeamsAdminDashboard,
  pickTeamsTabUrl,
  readStoredTeamsDeepLink,
} from "@/utils/teamsDeepLink";

export default {
  data() {
    return {
      statusMessage: "Connecting Microsoft Teams...",
      teamsOpenUrl: "",
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
    resolvedTeamsUrl(payload = {}) {
      return (
        pickTeamsTabUrl(extractTeamsDeepLink(payload || {})) ||
        pickTeamsTabUrl(readStoredTeamsDeepLink()) ||
        ""
      );
    },
    openTeamsNow() {
      const url = this.teamsOpenUrl;
      if (!url) return;
      if (!openTeamsAdminDashboard(url, { newTab: false })) {
        window.location.assign(url);
      }
    },
    keepTeamsTabOpen(payload = {}) {
      this.teamsOpenUrl = this.resolvedTeamsUrl(payload);
      this.statusMessage = this.teamsOpenUrl
        ? "Teams connected. Click below to open the VAPTFIX admin dashboard channel."
        : "Teams connected. Waiting for the VAPTFIX admin dashboard channel…";
    },
    async landThisTabOnTeams(payload = {}) {
      const authStore = useAuthStore();
      const needsChannelUrl = !this.resolvedTeamsUrl(payload);
      try {
        if (typeof authStore.ensureTeamsChannelsCached === "function") {
          await authStore.ensureTeamsChannelsCached({ force: needsChannelUrl });
        }
      } catch {
        /* continue with payload channels */
      }
      if (landOnTeamsAdminDashboardChannel(payload, { newTab: false })) {
        return true;
      }
      const url = await resolveTeamsAdminDashboardUrl(payload, async () => {
        try {
          await authStore.ensureTeamsChannelsCached({ force: true });
        } catch {
          /* ignore */
        }
        const statusRes = await authStore.fetchMicrosoftTeamsLoginStatus();
        return statusRes.data || {};
      });
      if (url && openTeamsAdminDashboard(url, { newTab: false })) {
        return true;
      }
      return false;
    },
    async finishMemberSuccess(payload = {}) {
      clearPendingMemberFlow();
      sessionStorage.setItem("member_teams_connected", "true");
      localStorage.setItem("member_teams_connected", "true");
      sessionStorage.removeItem("member_slack_connected");
      localStorage.removeItem("member_slack_connected");
      persistTeamsDeepLink(extractTeamsDeepLink(payload || {}));
      this.notifyOpener({ type: "TEAMS_MEMBER_LOGGED_IN", success: true });
      this.statusMessage = "Signed in. Opening the VAPTFIX admin dashboard channel...";
      if (await this.landThisTabOnTeams(payload)) {
        return;
      }
      if (window.opener) {
        this.keepTeamsTabOpen(payload);
        return;
      }
      if (openTeamsAdminDashboard(this.resolvedTeamsUrl(payload), { newTab: true })) {
        this.$router.replace("/userdashboard");
        return;
      }
      this.keepTeamsTabOpen(payload);
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
        await this.finishMemberSuccess(res.data || {});
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
        const djangoFields = resolveDjangoOAuthPostMessageFields(res.data);
        this.notifyOpener({
          type: "TEAMS_CONNECTED",
          success: true,
          is_new_user: res.data?.is_new_user === true,
          ...djangoFields,
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

        if (await this.landThisTabOnTeams(res.data)) {
          return;
        }

        console.warn(
          "[Teams] Could not build channel deep link from OAuth response. Check teams_tab_url / vaptfix_team.channels.",
          {
            teams_tab_url: res.data?.teams_tab_url,
            channels: res.data?.vaptfix_team?.channels,
          },
        );

        // VaptFix tab (opener) continues Provide Scope. This tab must stay as Teams — never close it.
        if (window.opener) {
          this.keepTeamsTabOpen(res.data);
          return;
        }

        const url = this.resolvedTeamsUrl(res.data);
        if (url && openTeamsAdminDashboard(url, { newTab: true })) {
          try {
            const next = await authStore.getAdminOnboardingRoute();
            this.$router.replace(next);
          } catch {
            this.$router.replace("/admin-upload-report");
          }
          return;
        }

        this.keepTeamsTabOpen(res.data);
      } else {
        const message =
          res.message ||
          "Microsoft login failed";
        this.notifyOpener({
          type: "TEAMS_CONNECTED",
          success: false,
          error: message,
          platform_conflict: /slack/i.test(message),
        });
        this.statusMessage = message;
        if (window.opener) {
          setTimeout(() => window.close(), 400);
          return;
        }
        await Swal.fire("Error", message, "error");
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

<style scoped>
.callback-loading {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 24px;
  text-align: center;
  font-family: inherit;
}
.open-teams-btn {
  border: 0;
  border-radius: 8px;
  padding: 10px 18px;
  background: #241447;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
</style>
