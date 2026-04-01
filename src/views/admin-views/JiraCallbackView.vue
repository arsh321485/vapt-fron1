<template>
  <div class="callback-container">
    <div class="callback-card">
      <!-- Loading State -->
      <div v-if="status === 'loading'" class="callback-content">
        <div class="loader"></div>
        <h2>Connecting to Jira...</h2>
        <p>Please wait while we complete the authentication.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="callback-content">
        <i class="bi bi-check-circle-fill success-icon"></i>
        <h2>Jira Connected!</h2>
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
  name: "JiraCallbackView",

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
    async handleCallback() {
      try {
        // Get code and state from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const state = urlParams.get("state");
        const error = urlParams.get("error");

        // Check for OAuth error
        if (error) {
          this.status = "error";
          this.errorMessage = urlParams.get("error_description") || "Authorization was denied.";
          return;
        }

        // Case 1: Backend exchanged token and redirected with tokens in URL params
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");
        if (accessToken) {
          localStorage.setItem("jira_access_token", accessToken);
          if (refreshToken) localStorage.setItem("jira_refresh_token", refreshToken);
          localStorage.removeItem("jira_oauth_state");
          // Clean tokens from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          this.status = "success";
          setTimeout(() => {
            this.$router.push({ name: "communication" });
          }, 1500);
          return;
        }

        // Case 2: Backend redirected with ?connected=true (server-side token storage)
        if (urlParams.get("connected") === "true") {
          this.status = "success";
          localStorage.removeItem("jira_oauth_state");
          setTimeout(() => {
            this.$router.push({ name: "communication" });
          }, 1500);
          return;
        }

        // Validate code exists
        if (!code) {
          this.status = "error";
          this.errorMessage = "No authorization code received.";
          return;
        }

        // Validate state (optional security check)
        const savedState = localStorage.getItem("jira_oauth_state");
        if (savedState && state !== savedState) {
          this.status = "error";
          this.errorMessage = "Invalid state parameter. Please try again.";
          return;
        }

        // Exchange code for token
        const res = await this.authStore.handleJiraCallback(code, state);

        if (res.status) {
          this.status = "success";

          // Clean up state
          localStorage.removeItem("jira_oauth_state");

          // Notify parent window if opened as popup
          if (window.opener) {
            window.opener.postMessage({ type: "JIRA_CONNECTED" }, "*");
            setTimeout(() => window.close(), 2000);
          } else {
            // Opened as new tab — navigate to communication page
            setTimeout(() => {
              this.$router.push({ name: "communication" });
            }, 1500);
          }
        } else {
          this.status = "error";
          this.errorMessage = res.message || "Failed to connect Jira.";
        }
      } catch (err) {
        console.error("Jira callback error:", err);
        this.status = "error";
        this.errorMessage = "An unexpected error occurred.";
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
  border-top: 4px solid #5a44ff;
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
  background: #5a44ff;
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
  box-shadow: 0 8px 18px rgba(90, 68, 255, 0.25);
}
</style>
