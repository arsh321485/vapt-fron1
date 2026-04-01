<template>
  <div class="callback-container">
    <div class="callback-card">
      <!-- Loading State -->
      <div v-if="status === 'loading'" class="callback-content">
        <div class="loader"></div>
        <h2>Connecting to Slack...</h2>
        <p>Please wait while we complete the authentication.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="callback-content">
        <i class="bi bi-check-circle-fill success-icon"></i>
        <h2>Slack Connected!</h2>
        <p>You can close this window now.</p>
      </div>

      <!-- Error State -->
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
    console.log("SlackCallbackView loaded in popup");
    console.log("=== SlackCallbackView MOUNTED ===");
    console.log("Current URL:", window.location.href);
    console.log("Query params:", window.location.search);
    this.authStore = useAuthStore();
    await this.handleCallback();
  },
  methods: {
    async handleCallback() {
  try {
    console.log("=== handleCallback STARTED ===");

    const urlParams = new URLSearchParams(window.location.search);

    const botToken = urlParams.get("bot_access_token");
    const userToken = urlParams.get("user_access_token");
    const error = urlParams.get("error");

    console.log("Bot token:", botToken);
    console.log("User token:", userToken);
    console.log("Error:", error);

    if (error) {
      this.status = "error";
      this.errorMessage =
        urlParams.get("error_description") || "Slack authorization failed.";
      return;
    }

    if (!botToken || !userToken) {
      this.status = "error";
      this.errorMessage = "Slack tokens not received from backend.";
      return;
    }

    // 🔹 STEP 1 — Save tokens IMMEDIATELY (before any API calls)
    localStorage.setItem("slack_bot_token", botToken);
    localStorage.setItem("slack_user_token", userToken);
    console.log("Slack tokens saved to localStorage");

    // 🔹 STEP 2 — Call Slack login API
    const res = await this.authStore.loginWithSlack(botToken, userToken);

    if (res.status) {
      console.log("Slack login API success");

      // 🔹 STEP 3 — Validate token & save workspace info
      const validateRes = await this.authStore.validateSlackToken(botToken);

      if (validateRes.success && validateRes.data) {
        console.log("Slack token valid:", validateRes.data);
        localStorage.setItem("slack_team_id", validateRes.data.team_id);
        localStorage.setItem("slack_team_name", validateRes.data.team);
      }

      this.status = "success";

      // 🔹 STEP 4 — Notify parent window
      if (window.opener) {
        console.log("Sending message to parent...");
        window.opener.postMessage(
          {
            type: "SLACK_CONNECTED",
            team: validateRes?.data?.team || "",
            user: validateRes?.data?.user?.name || ""
          },
          "*"
        );
      } else {
        console.log("window.opener is NULL");
      }

      // 🔹 STEP 5 — Close popup
      setTimeout(() => window.close(), 1200);
    } else {
      // Login API failed but tokens are already saved in localStorage
      this.status = "error";
      this.errorMessage = res.message || "Slack login failed.";
    }
  } catch (err) {
    console.error("Slack callback error:", err);
    this.status = "error";
    this.errorMessage = "Unexpected error occurred.";
  }
    },
    retry() {
      // Close this window and let user try again
      window.close();
    }
  }
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(97, 31, 105, 0.25);
}
</style>
