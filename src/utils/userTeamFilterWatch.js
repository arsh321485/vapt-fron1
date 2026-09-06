import { useAuthStore } from "@/stores/authStore";

/**
 * Mixin: when header team filter changes, call `onUserSelectedTeamChanged(team)`
 * on the current page so team-scoped data reloads without leaving the route.
 */
export default {
  computed: {
    _sharedUserSelectedTeam() {
      return useAuthStore().userSelectedTeam;
    },
  },
  watch: {
    _sharedUserSelectedTeam(next, prev) {
      if (next === prev) return;
      if (typeof this.onUserSelectedTeamChanged === "function") {
        void this.onUserSelectedTeamChanged(next);
      }
    },
  },
};
