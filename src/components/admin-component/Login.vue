<template>
    <main>
        <div class="container mt-5">
    <div class="text-center">
      <img src="@/assets/images/smaller-logo.png" alt="Logo" class="mb-3" />

      <div
        class="card shadow p-4"
        style="max-width: 400px; margin: auto; border-radius: 12px;"
      >
        <h4 class="mb-4">Login</h4>
        <form @submit.prevent="handleLogin">
          <!-- Email -->
          <div class="mb-3 text-start">
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              v-model="email"
              class="form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <!-- Password -->
          <div class="mb-3 text-start">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              v-model="password"
              class="form-control"
              id="password"
              placeholder="Enter your password"
              required
            />
          </div>

          <!-- Submit -->
          <button type="submit" class="btn btn-primary w-100" :disabled="loading">
            {{ loading ? "Logging in..." : "Login" }}
          </button>
        </form>

        <!-- Show API response -->
        <p v-if="message" class="mt-3">{{ message }}</p>
      </div>
    </div>
  </div>
    </main>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      message: "",
      loading: false,
    };
  },
  methods: {
    handleLogin() {
      this.loading = true;
      this.message = "";

      axios
        .post("https://middleware-pn9u.onrender.com/login", {
          email: this.email,
          password: this.password,
        })
        .then((response) => {
          this.message = "✅ Login successful!";
          console.log("Login Response:", response.data);
          localStorage.setItem("authenticated", "true");
          // Save token if API provides one
          if (response.data.token) {
            localStorage.setItem("authToken", response.data.token);
          }
          this.$router.push("/home");
        })
        .catch((error) => {
          this.message = "❌ Login failed. Please check your credentials.";
          console.error("Login Error:", error.response?.data || error.message);
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
