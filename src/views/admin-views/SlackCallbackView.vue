<template>
  <div class="callback-container">
    <div class="callback-card">
      <div v-if="status === 'loading'" class="callback-content">
        <div class="loader"></div>
        <h2>Connecting to Slack...</h2>
        <p>Please wait while we complete the authentication.</p>
      </div>

      <div v-else-if="status === 'success'" class="callback-content">
        <i class="bi bi-check-circle-fill success-icon"></i>
        <h2>Slack Connected!</h2>
        <p>You can close this window now.</p>
      </div>

      <div v-else-if="status === 'error'" class="callback-content">
        <i class="bi bi-x-circle-fill error-icon"></i>
        <h2>Connection Failed</h2>
        <p>{{ errorMessage }}</p>
        <button class="btn btn-primary mt-3" @click="retry">Try Again</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";
import {
  extractSetPasswordFromPayload,
  extractSetPasswordParams,
  redirectToUserSetPasswordHome,
  storeSetPasswordDeepLink,
} from "@/utils/userSetPasswordDeepLink";

export default {
  name: "SlackCallbackView",

  data() {
    return {
      status: "loading",
      errorMessage: "",
      authStore: null,
    };
  },
  async mounted() {
    this.authStore = useAuthStore();
    await this.handleCallback();
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
    async handleMemberCallback(urlParams, botToken, userToken) {
      let slackUserId = urlParams.get("slack_user_id") || "";
      let slackTeamId = urlParams.get("slack_team_id") || "";

      const tokenForValidate = botToken || userToken;
      if (tokenForValidate) {
        const validateRes = await this.authStore.validateSlackToken(tokenForValidate);
        if (validateRes.success && validateRes.data) {
          slackUserId = slackUserId || validateRes.data.user?.id || "";
          slackTeamId = slackTeamId || validateRes.data.team_id || "";
          if (botToken) {
            localStorage.setItem("slack_bot_token", botToken);
          }
          if (userToken) {
            localStorage.setItem("slack_user_token", userToken);
          }
          if (validateRes.data.team) {
            localStorage.setItem("slack_team_id", validateRes.data.team_id || "");
            localStorage.setItem("slack_team_name", validateRes.data.team);
          }
        }
      }

      if (!slackUserId || !slackTeamId) {
        this.status = "error";
        this.errorMessage = "Slack user or workspace ID not received. Join the Slack channel first, then try again.";
        return;
      }

      const res = await this.authStore.slackMemberLogin({
        slack_user_id: slackUserId,
        slack_team_id: slackTeamId,
      });

      if (res.status) {
        this.status = "success";
        this.notifyOpener({ type: "SLACK_MEMBER_LOGGED_IN", success: true });
        setTimeout(() => window.close(), 1200);
      } else if (this.redirectMemberToSetPassword(res.details)) {
        this.status = "success";
        this.errorMessage = "";
      } else {
        this.status = "error";
        this.errorMessage = res.message || "Slack member login failed.";
      }
    },
    async handleAdminCallback(botToken, userToken) {
      localStorage.setItem("slack_bot_token", botToken);
      localStorage.setItem("slack_user_token", userToken);

      const res = await this.authStore.loginWithSlack(botToken, userToken);

      if (res.status) {
        const validateRes = await this.authStore.validateSlackToken(botToken);

        if (validateRes.success && validateRes.data) {
          localStorage.setItem("slack_team_id", validateRes.data.team_id);
          localStorage.setItem("slack_team_name", validateRes.data.team);
        }

        this.status = "success";

        const loginData = res.data || {};
        // ✅ Only use Django local_user — never fallback to Slack user object
        const localUser = loginData.local_user || null;
        this.notifyOpener({
          type: "SLACK_CONNECTED",
          team: validateRes?.data?.team || "",
          user: localUser,
          local_user: localUser,
          bot_token: botToken,
          slack_user_id: validateRes?.data?.user?.id || "",
          django_access_token:
            loginData.jwt_tokens?.access ||
            loginData.tokens?.access ||
            loginData.access_token ||
            sessionStorage.getItem("authorization") ||
            "",
          django_refresh_token:
            loginData.jwt_tokens?.refresh ||
            loginData.tokens?.refresh ||
            "",
        });

        setTimeout(() => window.close(), 1200);
      } else {
        this.status = "error";
        this.errorMessage = res.message || "Slack login failed.";
      }
    },
    async handleCallback() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const setPwdFromUrl = extractSetPasswordParams(
          Object.fromEntries(urlParams.entries()),
        );
        if (setPwdFromUrl.uidb64 && setPwdFromUrl.token) {
          redirectToUserSetPasswordHome(
            setPwdFromUrl.uidb64,
            setPwdFromUrl.token,
            setPwdFromUrl.email,
          );
          return;
        }

        const botToken = urlParams.get("bot_access_token");
        const userToken = urlParams.get("user_access_token");
        const error = urlParams.get("error");

        if (error) {
          this.status = "error";
          this.errorMessage =
            urlParams.get("error_description") || "Slack authorization failed.";
          return;
        }

        if (this.isMemberFlow()) {
          await this.handleMemberCallback(urlParams, botToken, userToken);
          return;
        }

        if (!botToken || !userToken) {
          this.status = "error";
          this.errorMessage = "Slack tokens not received from backend.";
          return;
        }

        await this.handleAdminCallback(botToken, userToken);
      } catch (err) {
        console.error("Slack callback error:", err);
        this.status = "error";
        this.errorMessage = "Unexpected error occurred.";
      }
    },
    retry() {
      window.close();
    },
  },
};
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  padding: 20px;
}

.callback-card {
  background: #fff;
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 420px;
  width: 100%;
}

.callback-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 20px 0 10px;
}

.callback-content p {
  color: #6b7280;
  font-size: 15px;
  margin: 0;
}

.loader {
  width: 50px;
  height: 50px;
  border: 4px solid #e6e9f2;
  border-top: 4px solid #611f69;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.success-icon {
  font-size: 56px;
  color: #22c55e;
}

.error-icon {
  font-size: 56px;
  color: #ef4444;
}

.btn-primary {
  background: #611f69;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 14px;
  color: #fff;
  cursor: pointer;
}
</style>
