<template>
  <main class="loc-main">
    <!-- TOP BAR -->
    <div class="row gx-0 no-gutters">
      <DashboardHeader />
    </div>

    <div class="loc-page">

      <!-- STEPPER -->
      <div class="loc-stepper-row">
        <div class="loc-step">
          <span class="loc-step-num loc-step-done"><i class="bi bi-check-lg"></i></span>
          <span class="loc-step-label loc-step-label-done">1. Add users</span>
        </div>
        <div class="loc-step-line loc-line-done"></div>
        <div class="loc-step">
          <span class="loc-step-num loc-step-num-active">2</span>
          <span class="loc-step-label loc-step-label-active">2. Risk Criteria</span>
        </div>
      </div>

      <div class="loc-page-header">
        <h1 class="loc-title">Setup Organization</h1>
        <p class="loc-subtitle">Add team members to your organization. They will receive an email to set their password and access the dashboard.</p>
      </div>

      <!-- MAIN LAYOUT: form + users sidebar (aligned) -->
      <div class="loc-layout">

        <!-- LEFT: Main Content -->
        <div class="loc-content">

          <!-- Add Team Members -->
          <div class="loc-section loc-member-section">
            <div class="loc-section-header">
              <i class="bi bi-person-plus loc-section-icon"></i>
              <span class="loc-section-title">Add Team Members</span>
            </div>

            <form class="loc-member-form" @submit.prevent="addUser">
              <div class="loc-field-group">
                <label class="loc-field-label">Type</label>
                <div class="loc-input-row">
                  <i class="bi bi-diagram-3 loc-field-icon"></i>
                  <select v-model="form.user_type" class="loc-field-input loc-field-select">
                    <option disabled value="">Select type</option>
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                  <i class="bi bi-chevron-down loc-field-chevron"></i>
                </div>
              </div>

              <div class="loc-field-group">
                <label class="loc-field-label">First Name</label>
                <div class="loc-input-row">
                  <i class="bi bi-person loc-field-icon"></i>
                  <input
                    class="loc-field-input"
                    placeholder="John"
                    v-model="form.first_name"
                    autocomplete="given-name"
                  />
                </div>
              </div>

              <div class="loc-field-group">
                <label class="loc-field-label">Last Name</label>
                <div class="loc-input-row">
                  <i class="bi bi-person loc-field-icon"></i>
                  <input
                    class="loc-field-input"
                    placeholder="Doe"
                    v-model="form.last_name"
                    autocomplete="family-name"
                  />
                </div>
              </div>

              <div class="loc-field-group" ref="roleDropdown">
                <label class="loc-field-label">Role</label>
                <div class="loc-input-row loc-input-row-clickable" @click="toggleRoleDropdown" ref="roleTrigger">
                  <i class="bi bi-shield-check loc-field-icon"></i>
                  <span class="loc-field-input loc-field-role-display" :class="{ 'is-placeholder': !selectedRoles.length }">
                    {{ selectedRoles.length ? selectedRoleLabels : 'Select role(s)' }}
                  </span>
                  <i class="bi bi-chevron-down loc-field-chevron"></i>
                </div>
                <teleport to="body">
                  <div v-if="isRoleOpen" class="loc-dropdown-list" :style="roleDropdownStyle">
                    <label v-for="role in roleOptions" :key="role.short" class="loc-dropdown-item">
                      <input type="checkbox" :value="role.short" v-model="selectedRoles" class="me-2" />
                      {{ role.full }}
                    </label>
                  </div>
                </teleport>
              </div>

              <div class="loc-field-group">
                <label class="loc-field-label">Email Address</label>
                <div class="loc-input-row">
                  <i class="bi bi-at loc-field-icon"></i>
                  <input
                    class="loc-field-input"
                    placeholder="email@company.com"
                    type="email"
                    v-model="form.email"
                    autocomplete="email"
                  />
                </div>
              </div>

              <button type="submit" class="loc-submit-btn">
                <i class="bi bi-person-plus me-2"></i>
                Save User
              </button>
            </form>
          </div>

          <!-- Footer Buttons -->
          <div class="loc-footer">
            <button class="loc-btn-back" @click="$router.back()">
              <i class="bi bi-arrow-left me-1"></i> Back to Selection
            </button>
            <div class="d-flex gap-3">
              <button class="loc-btn-continue" @click="handleContinue">
                {{ returnTo ? 'Back to Previous Page' : 'Continue to Risk Criteria' }}
                <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- RIGHT: Users list -->
        <aside class="loc-sidebar">
          <div class="loc-users-panel">
            <div class="loc-users-panel-header">
              <div class="loc-users-panel-title-wrap">
                <i class="bi bi-people-fill loc-users-panel-icon"></i>
                <h3 class="loc-users-panel-title">Users Added</h3>
              </div>
              <span class="loc-users-panel-count">{{ addedUsers.length }}</span>
            </div>

            <ul v-if="addedUsers.length" class="loc-users-list">
              <li
                v-for="(user, index) in addedUsers"
                :key="user._id || user.email || index"
                class="loc-user-card"
              >
                <div class="loc-user-card-top">
                  <div class="loc-user-avatar">{{ getInitials(`${user.first_name} ${user.last_name}`) }}</div>
                  <div class="loc-user-details">
                    <p class="loc-user-name">{{ user.first_name }} {{ user.last_name }}</p>
                    <p class="loc-user-email">{{ user.email }}</p>
                  </div>
                </div>
                <div v-if="user.slack_sync_status || hasSlackIntegration" class="loc-user-card-footer">
                  <span v-if="user.slack_sync_status === 'success'" class="loc-slack-badge loc-slack-synced">
                    <i class="bi bi-check-circle-fill"></i> Slack synced
                  </span>
                  <span v-else-if="user.slack_sync_status === 'pending_workspace_join'" class="loc-slack-badge loc-slack-pending">
                    <i class="bi bi-clock-fill"></i> Slack pending
                  </span>
                  <span v-else-if="user.slack_sync_status === 'failed'" class="loc-slack-badge loc-slack-failed">
                    <i class="bi bi-x-circle-fill"></i> Slack failed
                  </span>
                  <button
                    v-if="hasSlackIntegration && (!user.slack_channel_ids || user.slack_channel_ids.length === 0 || user.slack_sync_status !== 'success')"
                    type="button"
                    class="loc-resync-btn"
                    :disabled="user.resyncing"
                    @click="resyncSlack(user)"
                  >
                    <span v-if="user.resyncing" class="spinner-border spinner-border-sm"></span>
                    <template v-else>
                      <i class="bi bi-arrow-repeat"></i> Resync
                    </template>
                  </button>
                </div>
              </li>
            </ul>

            <div v-else class="loc-users-empty">
              <i class="bi bi-person-plus loc-users-empty-icon"></i>
              <p class="loc-users-empty-text">No users added yet</p>
              <p class="loc-users-empty-hint">Saved members will appear here</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script>
import DashboardHeader from "@/components/admin-component/DashboardHeader.vue";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";

export default {
  name: "LocationView",
  components: {
    DashboardHeader  },
  data() {
    return {
      authStore: useAuthStore(),
      roleDropdownStyle: {},
      selectedRoles: [],
      isRoleOpen: false,
      addedUsers: [],
      form: {
        first_name: "",
        last_name: "",
        user_type: "",
        email: "",
      },
      roleOptions: [
        { short: "PM", full: "Patch Management" },
        { short: "CM", full: "Configuration Management" },
        { short: "NS", full: "Network Security" },
        { short: "AF", full: "Architectural Flaws" }
      ],
    };
  },
  computed: {
    returnTo() {
      return this.$route.query.returnTo || null;
    },
    hasSlackIntegration() {
      return !!localStorage.getItem("slack_bot_token");
    },
    selectedRoleLabels() {
      return this.selectedRoles
        .map((r) => this.roleOptions.find((o) => o.short === r)?.full || r)
        .join(", ");
    },
    // generatedInviteLink() {
    //   const base = "https://vaptbackend.secureitlab.com";

    //   // default: show base url
    //   if (!this.externalLocation) {
    //     return base;
    //   }

    //   const locationObj = this.authStore.locations.find(
    //     loc => loc._id === this.externalLocation
    //   );

    //   if (!locationObj) return base;

    //   const locationSlug = locationObj.location_name
    //     .toLowerCase()
    //     .replace(/\s+/g, "");

    //   // only location selected
    //   if (!this.selectedSecondaryRoles.length) {
    //     return `${base}/${locationSlug}`;
    //   }

    //   // location + roles
    //   const roleSlugs = this.selectedSecondaryRoles
    //     .map(role =>
    //       this.roleOptions.find(r => r.short === role)?.full
    //         .toLowerCase()
    //         .replace(/\s+/g, "")
    //     )
    //     .join("/");

    //   return `${base}/${locationSlug}/${roleSlugs}`;
    // },
    // canCopyInviteLink() {
    //   return !!this.externalLocation || this.selectedSecondaryRoles.length > 0;
    // }
  },
  methods: {
    initChipSelection() {
      // Active state is handled by Vue :class binding â€” no manual DOM manipulation needed
    },
    toggleRoleDropdown(e) {
      e && e.stopPropagation();
      this.isRoleOpen = !this.isRoleOpen;
      if (this.isRoleOpen) {
        this.$nextTick(() => {
          const trigger = this.$refs.roleTrigger;
          if (trigger) {
            const rect = trigger.getBoundingClientRect();
            this.roleDropdownStyle = {
              position: 'fixed',
              top: (rect.bottom + 4) + 'px',
              left: rect.left + 'px',
              minWidth: Math.max(rect.width, 200) + 'px',
            };
          }
        });
      }
    },
    async addUser() {
      // Validate required fields
      if (!this.form.first_name?.trim()) {
        Swal.fire("Missing Field", "Please enter the First Name.", "warning");
        return;
      }
      if (!this.form.last_name?.trim()) {
        Swal.fire("Missing Field", "Please enter the Last Name.", "warning");
        return;
      }
      if (!this.form.email?.trim()) {
        Swal.fire("Missing Field", "Please enter the Email Address.", "warning");
        return;
      }
      if (!this.form.user_type) {
        Swal.fire("Missing Field", "Please select a User Type.", "warning");
        return;
      }
      if (!this.selectedRoles || this.selectedRoles.length === 0) {
        Swal.fire("Missing Field", "Please select at least one Role.", "warning");
        return;
      }

      const adminId = this.authStore.user?._id || this.authStore.user?.id;
      if (!adminId) {
        Swal.fire("Error", "Please login again", "error");
        return;
      }

      const platform = this.detectAdminCommunicationPlatform();

      const payload = {
        admin_id: adminId,
        first_name: this.form.first_name,
        last_name: this.form.last_name,
        email: this.form.email,
        user_type: this.form.user_type,
        Member_role: this.selectedRoles.map(
          r => this.roleOptions.find(o => o.short === r)?.full
        )
      };

      if (platform === "teams") {
        const graphToken = localStorage.getItem("microsoft_graph_token");
        const vaptfixTeam = JSON.parse(localStorage.getItem("vaptfix_team") || "null");
        const teamId = vaptfixTeam?.id || vaptfixTeam?.team_id;
        if (graphToken && teamId) {
          payload.access_token = graphToken;
          payload.team_id = teamId;
        }
      }

      if (platform === "slack") {
        const botToken = localStorage.getItem("slack_bot_token");
        if (botToken) {
          payload.slack_bot_token = botToken;
        }
      }

      const res = await this.authStore.createUserDetail(payload);

      if (res.status) {
        this.addedUsers.unshift({
          _id: res.data?._id || res.data?.id || null,
          first_name: this.form.first_name.trim(),
          last_name: this.form.last_name.trim(),
          email: this.form.email.trim(),
        });

        const slackSync = res.slack_sync || res.data?.slack_sync;
        let msg = "User added successfully";

        if (platform === "teams") {
          msg = "User added and added to Microsoft Teams";
        } else if (slackSync?.status === "success") {
          msg = "User added and invited to Slack channels";
        } else if (slackSync?.status === "pending_workspace_join") {
          msg = "User created. Slack workspace invite sent; channel mapping pending.";
        } else if (slackSync?.status === "failed") {
          msg = `User created, Slack sync failed: ${slackSync.error || "unknown"}`;
        } else if (slackSync?.status === "skipped") {
          msg = `User created, Slack sync skipped: ${slackSync.error || "config missing"}`;
        }

        Swal.fire({
          icon: "success",
          title: msg,
          timer: 2500,
          showConfirmButton: false,
          allowOutsideClick: false
        });

        // Refresh user list from source of truth
        await this.loadAddedUsers();

        // Reset form
        this.form.first_name = "";
        this.form.last_name = "";
        this.form.email = "";
        this.form.user_type = "";
        this.selectedRoles = [];
        this.isRoleOpen = false;

      } else {
        let errorMessage = "User detail with this email already exists";
        if (res.message && !res.message.includes("500")) {
          errorMessage = res.message;
        }
        Swal.fire({
          icon: "warning",
          title: "User already exists",
          text: errorMessage,
          confirmButtonColor: "#5a44ff"
        });
      }
    },
  //   async addUser() {

  // const adminId =
  //   this.authStore.user?._id ||
  //   this.authStore.user?.id;

  // if (!adminId) {
  //   Swal.fire("Error", "Please login again", "error");
  //   return;
  // }

  // const botToken = localStorage.getItem("slack_bot_token");

  // if (!botToken) {
  //   Swal.fire("Error", "Slack not connected", "error");
  //   return;
  // }

  // const payload = {
  //   admin_id: adminId,
  //   first_name: this.form.first_name,
  //   last_name: this.form.last_name,
  //   email: this.form.email,
  //   user_type: this.form.user_type,

  //   Member_role: this.selectedRoles.map(
  //     r => this.roleOptions.find(o => o.short === r)?.full
  //   ),

  //   // ðŸ”¥ NEW FIELDS FOR SLACK SYNC
  //   slack_bot_token: botToken,
  //   slack_user_id: this.selectedSlackUserId  // must come from mapping
  // };

  // console.log("FINAL PAYLOAD ðŸ‘‰", payload);

  // const res = await this.authStore.createUserDetail(payload);

  // if (res.status) {

  //   console.log("Slack sync result:", res.slack_sync);

  //   Swal.fire({
  //     icon: "success",
  //     title: "User added & invited to Slack",
  //     timer: 2000,
  //     showConfirmButton: false
  //   });

  //   // reset form
  //   this.form.first_name = "";
  //   this.form.last_name = "";
  //   this.form.email = "";
  //   this.form.user_type = "";
  //   this.selectedRoles = [];
  //   this.isRoleOpen = false;

  // } else {
  //   Swal.fire({
  //     icon: "warning",
  //     title: "User already exists",
  //     text: res.message,
  //     confirmButtonColor: "#5a44ff"
  //   });
  // }
  //   },
    getInitials(name) {
      if (!name) return "";
      return name.substring(0, 2).toUpperCase();
    },
    normalizeAddedUser(user) {
      return {
        _id: user?._id || user?.id || null,
        detail_id: user?.detail_id || user?._id || user?.id || null,
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        email: user?.email || "",
        slack_channel_ids: user?.slack_channel_ids || [],
        slack_sync_status: user?.slack_sync_status || null,
        resyncing: false,
      };
    },
    getAddedUserKey(user) {
      if (!user) return "";
      return String(user.detail_id || user._id || user.id || user.email || "").toLowerCase();
    },
    async loadAddedUsers() {
      const res = await this.authStore.fetchUsersByAdmin();
      if (res?.status && Array.isArray(res.data)) {
        const fetchedUsers = res.data.map(this.normalizeAddedUser);
        const fetchedKeys = new Set(fetchedUsers.map(this.getAddedUserKey).filter(Boolean));
        const optimisticUsers = (this.addedUsers || [])
          .map(this.normalizeAddedUser)
          .filter((user) => {
            const key = this.getAddedUserKey(user);
            return key && !fetchedKeys.has(key);
          });
        this.addedUsers = [...optimisticUsers, ...fetchedUsers];
      }
    },
    async resyncSlack(user) {
      const detailId = user.detail_id || user._id;
      if (!detailId) {
        Swal.fire({ icon: 'error', title: 'Error', text: 'User detail ID not found' });
        return;
      }
      user.resyncing = true;
      const res = await this.authStore.resyncSlackUser(detailId);
      user.resyncing = false;

      const slackSync = res.slack_sync || res.data?.slack_sync;
      let icon = 'success';
      let title = 'Slack Resynced';
      let text = '';

      if (res.status) {
        if (slackSync?.status === 'success') {
          title = 'Slack Synced Successfully';
          text = 'User has been invited to Slack channels.';
        } else if (slackSync?.status === 'pending_workspace_join') {
          icon = 'info';
          title = 'Slack Invite Sent';
          text = 'User needs to accept the Slack workspace invite. Then resync again.';
        } else if (slackSync?.status === 'failed') {
          icon = 'error';
          title = 'Slack Sync Failed';
          text = slackSync.error || 'Unknown error occurred.';
        } else if (slackSync?.status === 'skipped') {
          icon = 'warning';
          title = 'Slack Sync Skipped';
          text = slackSync.error || 'Slack not connected or roles missing.';
        }
        await this.loadAddedUsers();
      } else {
        icon = 'error';
        title = 'Resync Failed';
        text = res.message || 'Failed to resync Slack.';
      }

      Swal.fire({ icon, title, text, timer: 3000, showConfirmButton: false });
    },
    detectAdminCommunicationPlatform() {
      const slackToken = localStorage.getItem("slack_bot_token");
      if (slackToken) return "slack";
      const graphToken = localStorage.getItem("microsoft_graph_token");
      const vaptfixTeam = JSON.parse(localStorage.getItem("vaptfix_team") || "null");
      const teamId = vaptfixTeam?.id || vaptfixTeam?.team_id;
      if (graphToken && teamId) return "teams";
      return null;
    },
    closeOnOutside(e) {
      const role = this.$refs.roleDropdown;
      const teleportedDropdown = document.querySelector('.loc-dropdown-list');
      if (teleportedDropdown && teleportedDropdown.contains(e.target)) return;
      if (role && !role.contains(e.target)) {
        this.isRoleOpen = false;
      }
    },
    handleContinue() {
      this.authStore.markStepCompleted(1);
      this.$router.push('/riskcriteria');
    },
  },
  mounted() {
    document.addEventListener("click", this.closeOnOutside);
    const user =
      this.authStore.user ||
      JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      this.authStore.user = user;
      this.loadAddedUsers();
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeOnOutside);
  },
};
</script>

<style scoped>
/* LocationView */
.loc-main { background: #f4f5f8; min-height: 100vh; font-family: 'Inter', sans-serif; }

/* Topbar */
.loc-topbar {
  display: flex; justify-content: space-between; align-items: center;
  background: #241447; padding: 0 32px; height: 52px;
  position: sticky; top: 0; z-index: 100;
}
.loc-topbar-left { display: flex; align-items: center; gap: 28px; }
.loc-brand { font-size: 1rem; font-weight: 800; color: #ffffff; letter-spacing: 0.02em; }
.loc-topnav { display: flex; gap: 20px; }
.loc-topnav a { font-size: 0.85rem; font-weight: 600; color: rgba(255,255,255,0.55); cursor: pointer; text-decoration: none; }
.loc-nav-active { color: #ffffff !important; border-bottom: 2px solid #ffffff; padding-bottom: 2px; }
.loc-topbar-right { display: flex; align-items: center; gap: 14px; }
.loc-icon-btn { font-size: 1.1rem; color: rgba(255,255,255,0.75); cursor: pointer; }
.loc-icon-btn:hover { color: #ffffff; }
.loc-avatar { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 700; border: 1.5px solid rgba(255,255,255,0.3); }

/* Page */
.loc-page { max-width: 1080px; margin: 0 auto; padding: 84px 24px 60px; }

/* Stepper */
.loc-stepper-row { display: flex; align-items: center; justify-content: center; gap: 0; margin-bottom: 28px; }
.loc-step { display: flex; align-items: center; gap: 10px; }
.loc-step-num {
  width: 32px; height: 32px; border-radius: 50%;
  background: #0f696e; color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
}
.loc-step-done { background: #0f696e; color: #fff; }
.loc-step-num-active { background: #241447; color: #fff; }
.loc-step-num-inactive { background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; }
.loc-step-label { font-size: 0.82rem; font-weight: 600; color: #0f696e; }
.loc-step-label-done { color: #0f696e; }
.loc-step-label-active { color: #241447; }
.loc-step-label-inactive { color: #94a3b8; }
.loc-step-line { height: 2px; background: #e2e8f0; margin: 0 12px; width: 120px; }
.loc-line-done { background: #0f696e; }

/* Layout */
.loc-layout { display: grid; grid-template-columns: minmax(0, 1fr) 300px; gap: 28px; align-items: start; }
.loc-sidebar { position: sticky; top: 84px; }

/* Content */
.loc-page-header { margin-bottom: 24px; }
.loc-title { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin: 0 0 6px; }
.loc-subtitle { font-size: 0.875rem; color: #64748b; margin: 0; line-height: 1.5; }

/* Section */
.loc-section {
  background: #fff; border-radius: 14px; padding: 20px 22px;
  margin-bottom: 16px; border: 1px solid #f1f5f9;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.loc-section-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.loc-section-icon { font-size: 1rem; color: #0f696e; }
.loc-section-title { font-size: 0.95rem; font-weight: 700; color: #1e293b; }

/* Tool Cards */
.loc-cards-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.loc-tool-card {
  border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 16px;
  cursor: pointer; transition: border-color 0.15s, box-shadow 0.15s;
  background: #fff;
}
.loc-tool-card:hover { border-color: #0f696e; box-shadow: 0 2px 8px rgba(15,105,110,0.1); }
.loc-tool-card-active { border-color: #0f696e; box-shadow: 0 0 0 2px rgba(15,105,110,0.15); }
.loc-tool-card-add { border-style: dashed; cursor: default; }
.loc-tool-card-add:hover { border-color: #cbd5e1; box-shadow: none; }
.loc-tool-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
.loc-tool-icon-wrap { width: 40px; height: 40px; background: #e0f2f1; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.loc-tool-icon { width: 24px; height: 24px; object-fit: contain; }
.loc-tool-icon-fallback { font-size: 1.2rem; color: #0f696e; }
.loc-tool-radio {
  width: 18px; height: 18px; border-radius: 50%;
  border: 1.5px solid #cbd5e1; display: flex; align-items: center; justify-content: center;
}
.loc-tool-radio-active { border-color: #0f696e; }
.loc-tool-radio-dot { width: 8px; height: 8px; border-radius: 50%; background: #0f696e; }
.loc-tool-check { color: #0f696e; font-size: 1rem; }
.loc-tool-name { font-size: 0.875rem; font-weight: 700; color: #1e293b; margin: 0 0 4px; }
.loc-tool-desc { font-size: 0.75rem; color: #64748b; margin: 0; line-height: 1.4; }
.loc-tool-add-icon { width: 36px; height: 36px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
.loc-tool-add-icon i { font-size: 1.1rem; color: #94a3b8; }

/* Jira connected */
.loc-jira-user { display: flex; align-items: center; gap: 12px; background: #f8f9fc; border-radius: 10px; padding: 12px; }
.loc-jira-avatar { width: 36px; height: 36px; border-radius: 50%; }
.loc-jira-name { font-size: 0.85rem; font-weight: 700; color: #1e293b; }
.loc-jira-email { font-size: 0.75rem; color: #64748b; }
.loc-jira-badge { font-size: 0.72rem; font-weight: 700; background: #dcfce7; color: #16a34a; border-radius: 20px; padding: 3px 10px; margin-left: auto; }
.loc-jira-resources { }
.loc-jira-res-title { font-size: 0.82rem; font-weight: 600; color: #1e293b; }
.loc-jira-res-list { display: flex; flex-direction: column; gap: 8px; }
.loc-jira-res-item { display: flex; align-items: center; gap: 10px; background: #f8f9fc; border-radius: 8px; padding: 10px 12px; cursor: pointer; border: 1.5px solid transparent; }
.loc-jira-res-item.active { border-color: #0f696e; }
.loc-jira-res-avatar { width: 28px; height: 28px; border-radius: 4px; }
.loc-jira-res-name { font-size: 0.82rem; font-weight: 700; color: #1e293b; }
.loc-jira-res-url { font-size: 0.72rem; color: #64748b; }

/* Add member form — stacked fields (Get Started style) */
.loc-member-section .loc-section-header { margin-bottom: 18px; }
.loc-member-form { display: flex; flex-direction: column; gap: 2px; width: 100%; }
.loc-field-group { margin-bottom: 10px; position: relative; }
.loc-field-label {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #41454b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}
.loc-input-row {
  position: relative;
  display: flex;
  align-items: center;
}
.loc-input-row-clickable { cursor: pointer; }
.loc-field-icon {
  position: absolute;
  left: 14px;
  color: #9ca3af;
  font-size: 16px;
  z-index: 1;
  pointer-events: none;
}
.loc-field-chevron {
  position: absolute;
  right: 14px;
  color: #9ca3af;
  font-size: 12px;
  pointer-events: none;
}
.loc-field-input {
  width: 100%;
  height: 42px;
  padding: 0 36px 0 42px;
  background: #f3f4f6;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  transition: background 0.2s, box-shadow 0.2s;
}
.loc-field-input:focus {
  outline: none;
  background: #ededf8;
  box-shadow: 0 0 0 2px rgba(36, 20, 71, 0.15);
}
.loc-field-input::placeholder { color: #9ca3af; }
.loc-field-select {
  appearance: none;
  cursor: pointer;
}
.loc-field-role-display {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  user-select: none;
}
.loc-field-role-display.is-placeholder { color: #9ca3af; }
.loc-submit-btn {
  width: 100%;
  height: 46px;
  margin-top: 8px;
  background: #241447;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}
.loc-submit-btn:hover { background: #1a0f38; }

/* Users sidebar panel */
.loc-users-panel {
  background: #fff;
  border: 1px solid #e8ecf2;
  border-radius: 14px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(36, 20, 71, 0.06);
}
.loc-users-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}
.loc-users-panel-title-wrap { display: flex; align-items: center; gap: 8px; min-width: 0; }
.loc-users-panel-icon { color: #241447; font-size: 1rem; flex-shrink: 0; }
.loc-users-panel-title {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 800;
  color: #1e293b;
}
.loc-users-panel-count {
  flex-shrink: 0;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: 999px;
  background: #241447;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.loc-users-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: calc(100vh - 220px);
  overflow-y: auto;
  overflow-x: hidden;
}
.loc-users-list::-webkit-scrollbar { width: 5px; }
.loc-users-list::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.loc-user-card {
  background: #f8f9fc;
  border: 1px solid #eef2f7;
  border-radius: 12px;
  padding: 12px;
}
.loc-user-card-top { display: flex; align-items: flex-start; gap: 10px; }
.loc-user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #241447 0%, #0f696e 100%);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.loc-user-details { min-width: 0; flex: 1; }
.loc-user-name {
  margin: 0 0 2px;
  font-size: 0.84rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.3;
  word-break: break-word;
}
.loc-user-email {
  margin: 0;
  font-size: 0.72rem;
  color: #64748b;
  line-height: 1.35;
  word-break: break-all;
}
.loc-user-card-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px dashed #e2e8f0;
}
.loc-users-empty {
  text-align: center;
  padding: 28px 12px;
  border: 1px dashed #e2e8f0;
  border-radius: 12px;
  background: #fafbfc;
}
.loc-users-empty-icon { font-size: 1.5rem; color: #cbd5e1; display: block; margin-bottom: 8px; }
.loc-users-empty-text { margin: 0 0 4px; font-size: 0.82rem; font-weight: 700; color: #64748b; }
.loc-users-empty-hint { margin: 0; font-size: 0.72rem; color: #94a3b8; }
.loc-dropdown-list {
  position: fixed;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  z-index: 9999;
  padding: 6px;
  min-width: 200px;
  width: auto;
}
.loc-dropdown-item { display: flex; align-items: center; padding: 8px 10px; font-size: 0.82rem; cursor: pointer; border-radius: 6px; white-space: nowrap; color: #1e293b; font-weight: 500; }
.loc-dropdown-item:hover { background: #f0fdf9; color: #0f696e; }

.loc-slack-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 20px;
}
.loc-slack-synced  { background: #dcfce7; color: #15803d; }
.loc-slack-pending { background: #fef3c7; color: #b45309; }
.loc-slack-failed  { background: #fee2e2; color: #dc2626; }
.loc-resync-btn {
  margin-left: auto;
  background: #fff;
  border: 1px solid #7dd3fc;
  color: #0369a1;
  font-size: 10px;
  font-weight: 700;
  border-radius: 8px;
  padding: 4px 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: background 0.15s;
  white-space: nowrap;
}
.loc-resync-btn:hover { background: #e0f2fe; }
.loc-resync-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.loc-add-user-btn {
  background: none; border: none; color: #0f696e; font-size: 0.85rem; font-weight: 700;
  cursor: pointer; white-space: nowrap; display: flex; align-items: center; gap: 4px;
  padding: 9px 0;
}
.loc-add-user-btn:hover { opacity: 0.75; }

/* Footer */
.loc-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; margin-top: 8px; }
.loc-btn-back { background: none; border: none; color: #64748b; font-size: 0.875rem; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 5px; }
.loc-btn-back:hover { color: #1e293b; }
.loc-btn-draft { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 20px; font-size: 0.875rem; font-weight: 600; color: #1e293b; cursor: pointer; }
.loc-btn-draft:hover { background: #f8f9fc; }
.loc-btn-continue {
  background: #241447; color: #fff; border: none; border-radius: 8px;
  padding: 9px 22px; font-size: 0.875rem; font-weight: 700; cursor: pointer;
  display: inline-flex; align-items: center; gap: 6px; transition: opacity 0.15s;
}
.loc-btn-continue:hover { opacity: 0.88; }

/* Pending Setup */
.loc-pending-card { background: #fff; border-radius: 14px; padding: 18px; border: 1px solid #f1f5f9; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.loc-pending-title { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin: 0 0 12px; }
.loc-pending-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 8px; background: #f8f9fc; margin-bottom: 8px; font-size: 0.82rem; color: #1e293b; font-weight: 500; }
.loc-pending-done { color: #1e293b; }
.loc-pending-icon-done { color: #16a34a; font-size: 0.95rem; flex-shrink: 0; }
.loc-pending-dot-grey { width: 10px; height: 10px; border-radius: 50%; background: #cbd5e1; flex-shrink: 0; }
.loc-required-badge { font-size: 0.62rem; font-weight: 700; background: #fee2e2; color: #dc2626; border-radius: 4px; padding: 2px 6px; margin-left: auto; letter-spacing: 0.04em; }
.flex-1 { flex: 1; }

@media (max-width: 992px) {
  .loc-layout { grid-template-columns: 1fr; }
  .loc-sidebar { position: static; }
  .loc-users-list { max-height: 320px; }
}

/* Slack Integration Styles */
.loc-slack-integration {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-top: 16px;
}

.loc-slack-status {
  margin-bottom: 16px;
}

.loc-status-connected {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #dcfce7;
  color: #166534;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.loc-status-connected i {
  color: #22c55e;
  font-size: 16px;
}

.loc-status-disconnected {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #f1f5f9;
  color: #64748b;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
}

.loc-status-disconnected i {
  color: #cbd5e1;
  font-size: 16px;
}

.loc-slack-button-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

.loc-slack-btn {
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.loc-slack-btn:hover {
  opacity: 0.9;
}

.loc-slack-btn img {
  display: block;
  height: 40px;
  width: auto;
}

.loc-slack-help {
  font-size: 13px;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

</style>
