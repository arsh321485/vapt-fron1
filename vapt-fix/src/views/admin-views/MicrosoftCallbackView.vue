<template>
  <div class="callback-loading">
    <p>Connecting Microsoft Teams...</p>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore";

export default {
  async mounted() {
    const authStore = useAuthStore();

    // try {
    //   const params = new URLSearchParams(window.location.search);
    //   const accessToken =
    //     params.get("access_token") ||
    //     params.get("token") ||
    //     params.get("ms_token");

    //   // const queryParams = new URLSearchParams(window.location.search);
    //   // const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));
    //   // const accessToken =
    //   //   queryParams.get("access_token") ||
    //   //   queryParams.get("token") ||
    //   //   queryParams.get("ms_token") ||
    //   //   hashParams.get("access_token");

    //   if (!accessToken) {
    //     Swal.fire("Error", "Microsoft access token missing", "error");
    //     this.$router.push("/settings");
    //     return;
    //   }

    //   // 🔥 CALL LOGIN API
    //   const res = await authStore.microsoftLogin(accessToken);

    //   if (res.status) {
    //     Swal.fire({
    //       icon: "success",
    //       title: "Success",
    //       text: "Microsoft Teams connected successfully",
    //       timer: 2000,
    //       showConfirmButton: false
    //     });

    //     // notify parent window if needed
    //     window.opener?.postMessage({ type: "TEAMS_CONNECTED" }, "*");

    //     this.$router.push("/settings");
    //   } else {
    //     Swal.fire("Error", "Microsoft login failed", "error");
    //     this.$router.push("/settings");
    //   }
    // } catch (err) {
    //   console.error("Microsoft callback error:", err);
    //   Swal.fire("Error", "Microsoft connection failed", "error");
    //   this.$router.push("/settings");
    // }

    try {
      const queryParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace("#", ""));

      const accessToken =
        queryParams.get("access_token") ||
        queryParams.get("token") ||
        queryParams.get("ms_token") ||
        hashParams.get("access_token");

      if (!accessToken) {
        Swal.fire("Error", "Microsoft access token missing", "error");
        this.$router.push("/settings");
        return;
      }

      const res = await authStore.microsoftLogin(accessToken);

      if (res.status) {
        window.opener?.postMessage({ type: "TEAMS_CONNECTED" }, "*");
        this.$router.push("/settings");
      } else {
        Swal.fire("Error", "Microsoft login failed", "error");
        this.$router.push("/settings");
      }

    } catch (err) {
      console.error("Microsoft callback error:", err);
      Swal.fire("Error", "Microsoft connection failed", "error");
      this.$router.push("/settings");
    }
  }
};
</script>

