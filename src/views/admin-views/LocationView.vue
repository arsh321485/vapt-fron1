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

      <!-- MAIN LAYOUT -->
      <div class="loc-layout">

        <!-- LEFT: Main Content -->
        <div class="loc-content">

          <div class="loc-page-header">
            <h1 class="loc-title">Setup Organization</h1>
            <p class="loc-subtitle">Configure your team's communication and issue tracking tools to streamline your security workflow.</p>
          </div>

          <!-- Communication Platforms -->
          <div class="loc-section">
            <div class="loc-section-header">
              <i class="bi bi-chat-dots loc-section-icon"></i>
              <span class="loc-section-title">Communication Platforms</span>
            </div>
            <div class="loc-cards-grid">
              <div
                v-for="platform in communicationPlatforms"
                :key="platform.value"
                class="loc-tool-card"
                :class="{ 'loc-tool-card-active': selectedCommunication === platform.value }"
                @click.stop="handleCommunicationClick(platform.value)"
              >
                <div class="loc-tool-card-top">
                  <div class="loc-tool-icon-wrap">
                    <img v-if="platform.icon" :src="platform.icon" class="loc-tool-icon" />
                    <i v-else class="bi bi-app loc-tool-icon-fallback"></i>
                  </div>
                  <div class="loc-tool-radio" :class="{ 'loc-tool-radio-active': selectedCommunication === platform.value }">
                    <div v-if="selectedCommunication === platform.value" class="loc-tool-radio-dot"></div>
                  </div>
                </div>
                <h6 class="loc-tool-name">{{ platform.label }}</h6>
                <p class="loc-tool-desc">
                  {{ platform.value === 'teams' ? 'Sync security alerts directly to your enterprise channels.' : 'Real-time collaboration for devsecops teams.' }}
                </p>
              </div>

            </div>
          </div>

          <!-- Project Management -->
          <div class="loc-section">
            <div class="loc-section-header">
              <i class="bi bi-check-circle loc-section-icon"></i>
              <span class="loc-section-title">Project Management</span>
            </div>
            <div class="loc-cards-grid">
              <div
                v-for="tool in projectPlatforms"
                :key="tool.value"
                class="loc-tool-card"
                :class="{ 'loc-tool-card-active': selectedProject === tool.value }"
                @click.stop="handleProjectClick(tool.value)"
              >
                <div class="loc-tool-card-top">
                  <div class="loc-tool-icon-wrap">
                    <img v-if="tool.icon" :src="tool.icon" class="loc-tool-icon" />
                    <i v-else class="bi bi-kanban loc-tool-icon-fallback"></i>
                  </div>
                  <div class="loc-tool-radio" :class="{ 'loc-tool-radio-active': selectedProject === tool.value }">
                    <i v-if="selectedProject === tool.value" class="bi bi-check-circle-fill loc-tool-check"></i>
                  </div>
                </div>
                <h6 class="loc-tool-name">{{ tool.label }}</h6>
                <p class="loc-tool-desc">Automated ticket creation for vulnerabilities.</p>
              </div>

            </div>

            <!-- Jira Connected User -->
            <div v-if="jiraConnected && jiraUser" class="loc-jira-user mt-3">
              <img :src="jiraUser.picture" class="loc-jira-avatar" />
              <div class="loc-jira-info">
                <div class="loc-jira-name">{{ jiraUser.name }}</div>
                <div class="loc-jira-email">{{ jiraUser.email }}</div>
              </div>
              <span class="loc-jira-badge"><i class="bi bi-check-circle-fill me-1"></i>Connected</span>
            </div>

            <!-- Jira Cloud Resources -->
            <div v-if="jiraConnected && jiraResources.length" class="loc-jira-resources mt-3">
              <div class="loc-jira-res-title">
                <i class="bi bi-check-circle-fill text-success me-1"></i>
                Jira Connected — Select your workspace:
              </div>
              <div class="loc-jira-res-list mt-2">
                <div
                  v-for="resource in jiraResources"
                  :key="resource.id"
                  class="loc-jira-res-item"
                  :class="{ active: selectedJiraCloudId === resource.id }"
                  @click="selectedJiraCloudId = resource.id"
                >
                  <img :src="resource.avatarUrl" class="loc-jira-res-avatar" />
                  <div>
                    <div class="loc-jira-res-name">{{ resource.name }}</div>
                    <div class="loc-jira-res-url">{{ resource.url }}</div>
                  </div>
                  <i v-if="selectedJiraCloudId === resource.id" class="bi bi-check-circle-fill text-success ms-auto"></i>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Team Members -->
          <div class="loc-section">
                <div class="loc-section-header">
                  <i class="bi bi-people loc-section-icon"></i>
                  <span class="loc-section-title">Add Team Members</span>
                </div>

                <div class="loc-form-row">
                  <!-- Type -->
                  <div class="loc-form-group loc-form-type">
                    <label class="loc-form-label">TYPE</label>
                    <select v-model="form.user_type" class="loc-select">
                      <option disabled value="">Select</option>
                      <option value="internal">Internal</option>
                      <option value="external">External</option>
                    </select>
                  </div>
                  <!-- First Name -->
                  <div class="loc-form-group loc-form-name">
                    <label class="loc-form-label">FIRST NAME</label>
                    <input class="loc-input" placeholder="John" v-model="form.first_name" />
                  </div>
                  <!-- Last Name -->
                  <div class="loc-form-group loc-form-name">
                    <label class="loc-form-label">LAST NAME</label>
                    <input class="loc-input" placeholder="Doe" v-model="form.last_name" />
                  </div>
                  <!-- Role -->
                  <div class="loc-form-group loc-form-role" ref="roleDropdown">
                    <label class="loc-form-label">ROLE</label>
                    <div class="loc-select loc-select-custom" @click="toggleRoleDropdown" ref="roleTrigger">
                      <span class="loc-role-text">{{ selectedRoles.length ? selectedRoles.join(', ') : 'Select Role' }}</span>
                      <i class="bi bi-chevron-down loc-select-arrow"></i>
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
                </div>

                <!-- Email row -->
                <div class="loc-email-row">
                  <input class="loc-input loc-email-input" placeholder="email@company.com" type="email" v-model="form.email" />
                  <button class="loc-add-user-btn" @click="addUser">
                    <i class="bi bi-plus-circle me-1"></i> Add Another User
                  </button>
                </div>
          </div>

          <!-- Footer Buttons -->
          <div class="loc-footer">
            <button class="loc-btn-back" @click="$router.back()">
              <i class="bi bi-arrow-left me-1"></i> Back to Selection
            </button>
            <div class="d-flex gap-3">
              <button class="loc-btn-draft" @click="addUser">Save User</button>
              <button class="loc-btn-continue" @click="handleContinue">
                {{ returnTo ? 'Back to Previous Page' : 'Continue to Risk Criteria' }}
                <i class="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
          </div>

        </div>

        <!-- RIGHT: Sidebar -->
        <div class="loc-sidebar">

          <!-- Integration Help -->
          <div class="loc-help-card">
            <div class="loc-help-header">
              <i class="bi bi-lightning-charge-fill loc-help-icon"></i>
              <span class="loc-help-title">Integration Help</span>
            </div>
            <div class="loc-help-item">
              <i class="bi bi-shield-check loc-help-item-icon"></i>
              <div>
                <span class="loc-help-bold">OAuth 2.0 Secure:</span>
                <span class="loc-help-text"> All third-party integrations use encrypted token-based authentication.</span>
              </div>
            </div>
            <div class="loc-help-item mt-2">
              <i class="bi bi-diagram-3 loc-help-item-icon"></i>
              <div>
                <span class="loc-help-bold">Smart Mapping:</span>
                <span class="loc-help-text"> Automatically assign security findings to the correct Slack channel or Jira project.</span>
              </div>
            </div>
            <a href="#" class="loc-help-link">READ SETUP GUIDE <i class="bi bi-box-arrow-up-right ms-1"></i></a>
          </div>

          <div class="loc-users-added-card">
            <div class="loc-users-added-header">
              <span class="loc-users-added-title"><i class="bi bi-person-check me-1"></i>User Added</span>
              <span class="loc-users-added-count">{{ addedUsers.length }}</span>
            </div>
            <div v-if="addedUsers.length" class="loc-users-added-list">
              <div v-for="(user, index) in addedUsers" :key="user._id || user.email || index" class="loc-users-added-item">
                <div class="loc-users-added-initials">{{ getInitials(`${user.first_name} ${user.last_name}`) }}</div>
                <div class="loc-users-added-meta">
                  <p class="loc-users-added-name">{{ user.first_name }} {{ user.last_name }}</p>
                  <p class="loc-users-added-email">{{ user.email }}</p>
                  <!-- Slack Sync Badge -->
                  <span v-if="user.slack_sync_status === 'success'" class="loc-slack-badge loc-slack-synced">
                    <i class="bi bi-check-circle-fill me-1"></i>Slack Synced
                  </span>
                  <span v-else-if="user.slack_sync_status === 'pending_workspace_join'" class="loc-slack-badge loc-slack-pending">
                    <i class="bi bi-clock-fill me-1"></i>Slack Pending
                  </span>
                  <span v-else-if="user.slack_sync_status === 'failed'" class="loc-slack-badge loc-slack-failed">
                    <i class="bi bi-x-circle-fill me-1"></i>Slack Failed
                  </span>
                </div>
                <!-- Resync Slack Button — show if slack_channel_ids empty or sync failed/pending -->
                <button
                  v-if="selectedCommunication === 'slack' && (!user.slack_channel_ids || user.slack_channel_ids.length === 0 || user.slack_sync_status !== 'success')"
                  class="loc-resync-btn"
                  :disabled="user.resyncing"
                  @click="resyncSlack(user)"
                >
                  <span v-if="user.resyncing" class="spinner-border spinner-border-sm me-1"></span>
                  <i v-else class="bi bi-arrow-repeat me-1"></i>
                  Resync Slack
                </button>
              </div>
            </div>
            <div v-else class="loc-users-added-empty">
              No users added yet.
            </div>
          </div>

        </div>
      </div>
    </div>
  </main>
</template>

<script>
import DashboardHeader from "@/components/admin-component/DashboardHeader.vue";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import teamsIcon from "@/assets/images/teams.png";
import slackIcon from "@/assets/images/slack.png";
import jiraIcon from "@/assets/images/jira.png";
import asanaIcon from "@/assets/images/asana.png";

export default {
  name: "LocationView",
  components: {
    DashboardHeader
  },
  data() {
    return {
      authStore: useAuthStore(),
      roleDropdownStyle: {},
      locationName: "",
      showDropdown: false,
      filteredCountries: [],
      avatarColors: ["#13b561", "#efbe34", "#ea4544"],
      selectedLocation: "",
      externalLocation: "",
      selectedRoles: [],
      isRoleOpen: false,
      addedUsers: [],
      selectedSecondaryRoles: [],
      isSecondaryRoleOpen: false,
      form: {
        admin_id: "",
        location_id: "",
        first_name: "",
        last_name: "",
        user_type: "",
        email: "",
        Member_role: []
      },
      roleOptions: [
        { short: "PM", full: "Patch Management" },
        { short: "CM", full: "Configuration Management" },
        { short: "NS", full: "Network Security" },
        { short: "AF", full: "Architectural Flaws" }
      ],
      selectedCommunication: null,
      pendingCommunication: null,
      communicationNoneSelected: false,
      communicationPlatforms: [
        { value: "teams", label: "Microsoft Teams", icon: teamsIcon },
        { value: "slack", label: "Slack", icon: slackIcon },
        // { value: "none", label: "None" }
      ],
      selectedProject: null,
      pendingProject: null,
      projectNoneSelected: false,
      projectPlatforms: [
        { value: "jira", label: "Jira", icon: jiraIcon },
        // { value: "asana", label: "Asana", icon: asanaIcon },
        // { value: "none", label: "None" }
      ],
      slackPopup: null,
      slackChannels: [],
      slackUsers: [],
      teams: [],
      channels: [],
      selectedTeamId: null,
      backendBase: "https://vaptbackend.secureitlab.com",
      jiraResources: [],
      jiraConnected: false,
      jiraUser: null,
      selectedJiraCloudId: localStorage.getItem("jira_cloud_id") || null,
    };
  },
  watch: {
    selectedJiraCloudId(val) {
      if (val) {
        localStorage.setItem("jira_cloud_id", val);
      } else {
        localStorage.removeItem("jira_cloud_id");
      }
    },
  },
  computed: {
    returnTo() {
      return this.$route.query.returnTo || null;
    },
    isFromOnboarding() {
      return !this.returnTo;
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
      // Active state is handled by Vue :class binding — no manual DOM manipulation needed
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

      // Gate Add User until OAuth connect is complete
      if (this.selectedCommunication === "slack") {
        const botToken = localStorage.getItem("slack_bot_token");
        if (!botToken) {
          Swal.fire("Slack not connected", "Please connect Slack first.", "warning");
          return;
        }
      }

      if (this.selectedCommunication === "teams") {
        const graphToken = localStorage.getItem("microsoft_graph_token");
        const vaptfixTeam = JSON.parse(
          localStorage.getItem("vaptfix_team") || "null"
        );
        const teamId = vaptfixTeam?.id || vaptfixTeam?.team_id;

        if (!graphToken || !teamId) {
          Swal.fire(
            "Microsoft Teams not connected",
            "Please connect Microsoft Teams first.",
            "warning"
          );
          return;
        }
      }

      // Base payload
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

      // MS Teams: add access_token + team_id if Teams is selected
      if (this.selectedCommunication === "teams") {
        const graphToken = localStorage.getItem("microsoft_graph_token");
        const vaptfixTeam = JSON.parse(localStorage.getItem("vaptfix_team") || "null");
        const teamId = vaptfixTeam?.id || vaptfixTeam?.team_id;
        if (graphToken && teamId) {
          payload.access_token = graphToken;
          payload.team_id = teamId;
        }
      }

      // Slack: add slack_bot_token if Slack is selected
      if (this.selectedCommunication === "slack") {
        const botToken = localStorage.getItem("slack_bot_token");
        if (botToken) {
          payload.slack_bot_token = botToken;
        }
      }

      console.log("FINAL PAYLOAD 👉", payload);

      const res = await this.authStore.createUserDetail(payload);

      if (res.status) {
        this.addedUsers.unshift({
          _id: res.data?._id || res.data?.id || null,
          first_name: this.form.first_name.trim(),
          last_name: this.form.last_name.trim(),
          email: this.form.email.trim(),
        });

        // slack_sync status-based message
        const slackSync = res.slack_sync || res.data?.slack_sync;
        let msg = "User added successfully";

        if (this.selectedCommunication === "teams") {
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

  //   // 🔥 NEW FIELDS FOR SLACK SYNC
  //   slack_bot_token: botToken,
  //   slack_user_id: this.selectedSlackUserId  // must come from mapping
  // };

  // console.log("FINAL PAYLOAD 👉", payload);

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
    async loadAddedUsers() {
      const res = await this.authStore.fetchUsersByAdmin();
      if (res?.status && Array.isArray(res.data)) {
        this.addedUsers = res.data.map(this.normalizeAddedUser);
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
    closeOnOutside(e) {
      const role = this.$refs.roleDropdown;
      const secondary = this.$refs.secondaryRoleDropdown;
      // Also check if click is inside teleported dropdown
      const teleportedDropdown = document.querySelector('.loc-dropdown-list');
      if (teleportedDropdown && teleportedDropdown.contains(e.target)) return;
      if (role && !role.contains(e.target)) {
        this.isRoleOpen = false;
      }
      if (secondary && !secondary.contains(e.target)) {
        this.isSecondaryRoleOpen = false;
      }
    },
    async handleCommunicationClick(value) {
      // NONE logic
      if (value === "none") {
        this.communicationNoneSelected = !this.communicationNoneSelected;
        this.selectedCommunication = this.communicationNoneSelected ? "none" : null;
        return;
      }

      // If NONE active → block others
      if (this.communicationNoneSelected) return;
      if (!this.selectedCommunication) {
        if (value === "teams") {
          await this.startMicrosoftLogin();
          // selectedCommunication = "teams" will be set after OAuth success
        } else if (value === "slack") {
          this.selectedCommunication = value;
          await this.startSlackLogin();
        } else {
          this.selectedCommunication = value;
        }
        return;
      }


      // Clicking same platform → do nothing
      if (this.selectedCommunication === value) return;

      // Switching platform → ask confirmation FIRST
      this.pendingCommunication = value;

      // const res = await Swal.fire({
      //   title: "Switch platform?",
      //   text: "Are you sure you want to switch the communication platform?",
      //   icon: "warning",
      //   showCancelButton: true,
      //   confirmButtonText: "Yes",
      //   cancelButtonText: "No",
      // });


      const res = await Swal.fire({
        title: "Switch platform?",
        text: "Are you sure you want to switch the communication platform?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (res.isConfirmed) {
        if (this.pendingCommunication === "teams") {
          await this.startMicrosoftLogin();
          // selectedCommunication = "teams" will be set after OAuth success
        } else {
          this.selectedCommunication = this.pendingCommunication;
        }
        if (this.pendingCommunication === "slack") {
          await this.startSlackLogin();
        }
      }

      this.pendingCommunication = null;


      // if (res.isConfirmed) {

      //   this.selectedCommunication = this.pendingCommunication;
      // }



      // Cleanup
      this.pendingCommunication = null;
    },
    async handleProjectClick(value) {
      // NONE logic
      if (value === "none") {
        this.projectNoneSelected = !this.projectNoneSelected;
        this.selectedProject = this.projectNoneSelected ? "none" : null;
        return;
      }

      // If NONE active → block others
      if (this.projectNoneSelected) return;

      // First-time selection → apply immediately
      if (!this.selectedProject) {
        this.selectedProject = value;

        // ✅ Start Jira OAuth when Jira is selected
        if (value === "jira") {
          await this.startJiraLogin();
        }
        return;
      }

      // Clicking same tool → do nothing
      if (this.selectedProject === value) return;

      // Switching tool → ask confirmation FIRST
      this.pendingProject = value;

      const res = await Swal.fire({
        title: "Switch platform?",
        text: "Are you sure you want to switch the project management tool?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      if (res.isConfirmed) {
        // ✅ Apply active ONLY after Yes
        this.selectedProject = this.pendingProject;

        // ✅ Start Jira OAuth when switching to Jira
        if (this.pendingProject === "jira") {
          await this.startJiraLogin();
        }
      }

      // Cleanup
      this.pendingProject = null;
    },
    handleContinue() {
      // 🟢 Always go to /riskcriteria in onboarding flow
      // returnTo is only used when explicitly navigating from dashboard settings
      // Check if at least 1 location exists
      // if (!this.authStore.locations || this.authStore.locations.length === 0) {
      //   Swal.fire({
      //     icon: 'warning',
      //     title: 'No Location Added',
      //     text: 'Please add at least one location before proceeding to Risk Criteria.',
      //     confirmButtonColor: '#5a44ff'
      //   });
      //   return;
      // }

      // Mark step 1 as completed
      this.authStore.markStepCompleted(1);

      // Navigate to next page
      this.$router.push('/riskcriteria');
    },

    // Teams Start
    async startMicrosoftLogin() {
  try {
    const redirectUri = `${window.location.origin}/microsoft/callback`;
    const adminId = this.authStore.user?._id || this.authStore.user?.id;
    if (!adminId) {
      Swal.fire("Error", "Please login again", "error");
      return;
    }
    const res = await this.authStore.getMicrosoftOAuthUrl(redirectUri, adminId);
    if (res.status && res.data.auth_url) {
      // ✅ Open Microsoft OAuth in NEW TAB
       window.open(res.data.auth_url, "_blank");
      // window.location.href = res.data.auth_url;
    } else {
      Swal.fire("Error", "Failed to start Microsoft login", "error");
    }
  } catch (err) {
    console.error("Microsoft login error:", err);
    Swal.fire("Error", "Microsoft login failed", "error");
  }
    },
  async onTeamsConnected(event) {
    if (event.data?.type === "TEAMS_CONNECTED") {

      // Step 1: localStorage mein save karo
      const graphToken = event.data.tokens?.access_token;
      if (graphToken) {
        localStorage.setItem("microsoft_graph_token", graphToken);
      }
      if (event.data.vaptfix_team) {
        localStorage.setItem("vaptfix_team", JSON.stringify(event.data.vaptfix_team));
      }
      if (event.data.django_access_token) {
        localStorage.setItem("django_access_token", event.data.django_access_token);
      }
      const tenantId = event.data.tokens?.tenant_id;
      if (tenantId) {
        localStorage.setItem("microsoft_tenant_id", tenantId);
      }
      // Mark Teams selected only after successful OAuth/token receive
      this.selectedCommunication = "teams";

      // Step 2: Event se directly teams/channels set karo (fetchTeams() ki zaroorat nahi)
      if (event.data.vaptfix_team) {
        this.teams = [{
          id: event.data.vaptfix_team.team_id,
          displayName: event.data.vaptfix_team.team_name || "Vaptfix"
        }];
        this.channels = event.data.vaptfix_team.channels || [];
        localStorage.setItem("vaptfix_channels", JSON.stringify(this.channels));
      }

      // Step 3: Success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Microsoft Teams connected successfully",
        timer: 2000,
        showConfirmButton: false
      });

      // Step 4: Webhook subscribe
      const teamId = event.data.vaptfix_team?.team_id;
      if (teamId) {
        await this.authStore.subscribeTeamsWebhook(teamId);
      }
    }
  },
    onStorageChange(event) {
      if (event.key === "microsoft_graph_token" && event.newValue) {
        const savedChannels = localStorage.getItem("vaptfix_channels");
        if (savedChannels) {
          this.channels = JSON.parse(savedChannels);
        }
        this.selectedCommunication = "teams";
        this.fetchTeams();
        Swal.fire({
          icon: "success",
          title: "Microsoft Teams Connected",
          timer: 2000,
          showConfirmButton: false
        });
      }
    },
    async fetchTeams() {
      const res = await this.authStore.fetchMicrosoftTeams();
      if (res?.status) {
        this.teams = res.teams;

        // Auto-fetch channels for the VAPTFIX team using the saved team ID
        const vaptfixTeam = JSON.parse(localStorage.getItem("vaptfix_team") || "null");
        const teamId = vaptfixTeam?.id || vaptfixTeam?.team_id;
        if (teamId) {
          await this.fetchChannels(teamId);
        }
      } else {
        // Token expired or invalid — clear stale data and prompt reconnect
        localStorage.removeItem("microsoft_graph_token");
        localStorage.removeItem("teams_connected");
        localStorage.removeItem("vaptfix_team");
        localStorage.removeItem("vaptfix_channels");
        this.selectedCommunication = null;
        this.teams = [];
        this.channels = [];
        Swal.fire({
          icon: "warning",
          title: "Microsoft Teams Session Expired",
          text: "Please reconnect Microsoft Teams to continue.",
          confirmButtonColor: "#5a44ff"
        });
      }
    },
    async fetchChannels(teamId) {
    this.selectedTeamId = teamId;

    const res = await this.authStore.fetchTeamChannels(teamId);

    if (res?.status) {
      this.channels = res.channels;
    } else {
      console.log("Channels not fetched");
    }
    },
    async sendTeamsMessage(teamId, channelId, message) {
    const res = await this.authStore.sendMessageToTeamsChannel({
      teamId,
      channelId,
      message,
    });

    if (res.status) {
      console.log("Message sent successfully", res);
    } else {
      console.log("Message sending failed");
    }
    },
    // Teams End

    // slack start
    async startSlackLogin() {
  try {
    const adminId = this.authStore.user?._id || this.authStore.user?.id;
    if (!adminId) {
      Swal.fire("Error", "Please login again", "error");
      return;
    }
    const res = await this.authStore.getSlackOAuthUrl(this.backendBase, adminId);

    if (res.status && res.data?.auth_url) {

      const width = 1000;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        res.data.auth_url,
        "SlackOAuth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        alert("Popup blocked! Please allow popups for this site.");
      }

    } else {
      Swal.fire("Error", "Unable to start Slack login", "error");
    }
  } catch (error) {
    Swal.fire("Error", "Something went wrong while connecting Slack", "error");
  }
    },
    handleSlackMessage(event) {
    console.log("Message received from popup:", event);

    const allowedOrigins = [
      window.location.origin,
      "https://vaptbackend.secureitlab.com"
    ];

    if (!allowedOrigins.includes(event.origin)) {
      console.warn("Blocked message origin:", event.origin);
      return;
    }

    if (event.data?.type === "SLACK_CONNECTED") {
      console.log("SLACK_CONNECTED event received");

      // ✅ localStorage mein save karo
      if (event.data.bot_token) {
        localStorage.setItem("slack_bot_token", event.data.bot_token);
      }
      if (event.data.slack_user_id) {
        localStorage.setItem("slack_user_id", event.data.slack_user_id);
      }
      if (event.data.django_access_token) {
        localStorage.setItem("django_access_token", event.data.django_access_token);
      }

      this.checkSlackConnection();
      this.fetchSlackChannels();
      this.fetchSlackUsers();
    }
  },
    async checkSlackConnection() {
  try {
    console.log("checkSlackConnection started");

    const botToken = localStorage.getItem("slack_bot_token");
    console.log("Bot token from storage:", botToken);

    if (!botToken) {
      console.warn("No Slack token found");
      return;
    }

    const res = await this.authStore.validateSlackToken(botToken);

    console.log("validateSlackToken response:", res);

    if (res.success) {
      this.slackConnected = true;
    } else {
      this.slackConnected = false;
    }

  } catch (err) {
    console.error("Slack validation error:", err);
  }
    },
    async fetchSlackChannels() {
  try {
    console.log("fetchSlackChannels started");

    const res = await this.authStore.listSlackChannels();

    console.log("listSlackChannels response:", res);

    if (res.status) {
      this.slackChannels = res.channels;
    }

  } catch (err) {
    console.error("Slack channels fetch error:", err);
  }
    },
    async sendTestMessage(channelId) {
  try {
    console.log("sendTestMessage triggered");

    const botToken = localStorage.getItem("slack_bot_token");

    if (!botToken) {
      Swal.fire("Error", "Slack not connected", "error");
      return;
    }

    const res = await this.authStore.sendSlackMessage(
      botToken,
      channelId,
      "🚀 Message sent from VAPT Project"
    );

    if (res.status) {
      Swal.fire({
        icon: "success",
        title: "Message Sent",
        text: "Slack message delivered successfully",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      Swal.fire("Error", "Failed to send message", "error");
    }

  } catch (err) {
    console.error("Send message error:", err);
  }
    },
    async fetchSlackUsers() {
  try {
    console.log("fetchSlackUsers started");

    const botToken = localStorage.getItem("slack_bot_token");

    if (!botToken) {
      console.warn("No Slack token found");
      return;
    }

    const res = await this.authStore.listSlackUsers(botToken);

    console.log("Slack users API result:", res);

    if (res.status) {
      this.slackUsers = res.users;
    }

  } catch (err) {
    console.error("Slack users error:", err);
  }
    },
    async addUserToProjectSlack(channelId, slackUserId, userEmail, userName) {
  try {
    const botToken = localStorage.getItem("slack_bot_token");

    if (!botToken) {
      console.warn("Slack not connected");
      return;
    }

    const res = await this.authStore.addUserToSlackChannel(
      botToken,
      channelId,
      slackUserId,
      userEmail,
      userName
    );

    console.log("Slack add user result:", res);

  } catch (err) {
    console.error("Slack add user error:", err);
  }
    },

    async addUserToProjectTeams(teamId, channelId, userEmail) {
  try {
    const graphToken = localStorage.getItem("microsoft_graph_token");

    if (!graphToken) {
      console.warn("Microsoft Teams not connected");
      return;
    }

    const res = await this.authStore.addUserToTeamsChannel({
      teamId,
      channelId,
      userEmail,
    });

    console.log("Teams add user result:", res);

  } catch (err) {
    console.error("Teams add user error:", err);
  }
    },
    async inviteProjectTeam(channelId, slackUserIds) {
  const botToken = localStorage.getItem("slack_bot_token");
  if (!botToken) return;
  await this.authStore.inviteUsersToSlackChannel(
    botToken,
    channelId,
    slackUserIds
  );
    },
    async handleVulnerabilitySlack(channelId, slackUserIds) {
  const botToken = localStorage.getItem("slack_bot_token");

  if (!botToken) return;

  // Step 1: bot joins
  await this.authStore.joinSlackChannel(botToken, channelId);

  // Step 2: invite team
  await this.authStore.inviteUsersToSlackChannel(
    botToken,
    channelId,
    slackUserIds
  );

  // Step 3: send alert
  await this.authStore.sendSlackMessage(
    botToken,
    channelId,
    "🚨 New vulnerability detected"
  );
    },
    // slack end

    // ✅ Jira OAuth Login
    async startJiraLogin() {
      try {
        const res = await this.authStore.getJiraAuthUrl();

        if (res.status && res.url) {
          // Store state for verification
          localStorage.setItem("jira_oauth_state", res.state);

          // Open Jira OAuth in new tab (not popup)
          window.open(res.url, "_blank");
        } else {
          Swal.fire("Error", res.message || "Failed to start Jira login", "error");
        }
      } catch (err) {
        console.error("Jira login error:", err);
        Swal.fire("Error", "Jira login failed", "error");
      }
    },
    // ✅ Handle Jira Connected Event
    onJiraConnected(event) {
      if (event.data?.type === "JIRA_CONNECTED") {
        this.jiraConnected = true;
        this.fetchJiraResources();
        this.fetchJiraUser();
        Swal.fire({
          icon: "success",
          title: "Jira Connected",
          text: "Jira has been connected successfully!",
          timer: 2000,
          showConfirmButton: false
        });
      }
    },
    // ✅ Validate Jira Token (with auto-refresh on expiry)
    async checkJiraConnection() {
      const jiraToken = localStorage.getItem("jira_access_token");
      if (!jiraToken) return;

      const res = await this.authStore.validateJiraToken(jiraToken);
      if (res.valid) {
        this.jiraConnected = true;
        this.selectedProject = "jira";
        this.fetchJiraResources();
        this.fetchJiraUser();
        return;
      }

      // Token invalid — try refreshing
      const refreshToken = localStorage.getItem("jira_refresh_token");
      if (refreshToken) {
        const refreshRes = await this.authStore.refreshJiraToken(refreshToken);
        if (refreshRes.status) {
          // Refresh succeeded — validate new token
          this.jiraConnected = true;
          this.selectedProject = "jira";
          this.fetchJiraResources();
          this.fetchJiraUser();
          return;
        }
      }

      // Refresh also failed — clear and ask to reconnect
      localStorage.removeItem("jira_access_token");
      localStorage.removeItem("jira_refresh_token");
      localStorage.removeItem("jira_oauth_state");
      this.jiraConnected = false;
      this.selectedProject = null;
      Swal.fire({
        icon: "warning",
        title: "Jira Session Expired",
        text: "Please reconnect Jira to continue.",
        confirmButtonColor: "#5a44ff",
      });
    },
    // ✅ Fetch Jira Resources (Cloud IDs)
    async fetchJiraResources() {
      const res = await this.authStore.getJiraResources();
      if (res.status) {
        this.jiraResources = res.data;
        this.jiraConnected = true;
      }
    },
    // ✅ Fetch Jira Connected User Info
    async fetchJiraUser() {
      const res = await this.authStore.getJiraUser();
      if (res.status) {
        this.jiraUser = res.user;
      }
    },
  },
  mounted() {
    window.addEventListener("message", this.onTeamsConnected);
    window.addEventListener("storage", this.onStorageChange);

    const graphToken = localStorage.getItem("microsoft_graph_token");
    if (graphToken) {
      this.selectedCommunication = "teams";

      // Restore saved channels from login response immediately
      const savedChannels = localStorage.getItem("vaptfix_channels");
      if (savedChannels) {
        this.channels = JSON.parse(savedChannels);
      }

      this.fetchTeams(); // will also re-fetch fresh channels via fetchChannels()
    }

    window.addEventListener("message", this.handleSlackMessage);
    console.log("Slack message listener attached");

    // Check if Slack already connected
    const slackBotToken = localStorage.getItem("slack_bot_token");
    if (slackBotToken) {
      this.slackConnected = true;
      this.selectedCommunication = "slack";
      this.checkSlackConnection();
      this.fetchSlackChannels();
      this.fetchSlackUsers();
    }


    // ✅ Jira event listener
    window.addEventListener("message", this.onJiraConnected);

    // Check if Jira already connected (or just returned from OAuth callback)
    const jiraToken = localStorage.getItem("jira_access_token");
    if (jiraToken) {
      this.checkJiraConnection();
    } else if (this.$route.query.jira_connected === "true") {
      // Returned from backend redirect after server-side token exchange
      const storedToken = localStorage.getItem("jira_access_token");
      if (storedToken) {
        this.jiraConnected = true;
        this.selectedProject = "jira";
        this.fetchJiraResources();
        this.fetchJiraUser();
      }
      // Clean query param from URL
      this.$router.replace({ query: {} });
    }

    document.addEventListener("click", this.closeOnOutside);
    console.log("Route query:", this.$route.query);
    this.initChipSelection();
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
     window.removeEventListener("message", this.handleSlackMessage);
    window.removeEventListener("message", this.onTeamsConnected);
    window.removeEventListener("message", this.onJiraConnected);
    window.removeEventListener("storage", this.onStorageChange);
  },

};
</script>


<style scoped>
  .invite-link.disabled {
  cursor: default;
  /* pointer-events: none; */
  background: #f9fafb;
  color: #9ca3af;
}

.chip.disabled {
  opacity: 0.45;
  pointer-events: none;
  background: #f3f4f6;
  border-color: #d1d5db;
  box-shadow: none;
}

.invite-link {
  cursor: pointer;
  background: #f9fafb;
}

.invite-link:focus {
  box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.25);
}

/* new add css */
.dropdown-list {
  position: absolute;
  background: #fff;
  border: 1px solid #e6e9f2;
  border-radius: 12px;
  padding: 8px;
  width: 100%;
  z-index: 20;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.08);
}

.dropdown-list label {
  display: flex;
  gap: 8px;
  font-size: 13px;
  padding: 6px;
  cursor: pointer;
}

.dropdown-list label:hover {
  background: #f5f6ff;
}

/* existing css */

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #F3F5FA;
  border-bottom: 1px solid #e6e9f2;
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 1000;
}

.app {
  display: flex;
}

/* ===== CONTENT ===== */

.content {
  margin-left: 260px;
  /* space for stepper */
  margin-top: 64px;
  /* space for topbar */
  height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 48px 64px;
}

.content h1 {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 6px;
}

.content p {
  color: #6b7280;
  margin-bottom: 48px;
}

/* ===== SECTION ===== */
.section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 16px;
}

/* ===== INTEGRATION CHIPS ===== */
.chip-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.chip {
  padding: 14px 22px;
  border-radius: 14px;
  border: 1.5px solid #e6e9f2;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 210px;
  justify-content: center;
  transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
  /* box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08); */
  box-shadow: 10px 10px 22px rgba(15, 23, 42, 0.08);
}


.chip:hover {
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  transform: translateY(-2px);
}


.chip.active {
  border-color: #5a44ff;
  background: rgba(90, 68, 255, 0.06);
  font-weight: 600;
  box-shadow: 0 8px 18px rgba(90, 68, 255, 0.2);
}

.chip img {
  width: 22px;
  height: 22px;
}

.location-circle {
  margin-top: 4px;
}

/* ===== FORMS ===== */
.form-control,
.form-select {
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  box-shadow: 10px 10px 22px rgba(15, 23, 42, 0.08);
}

.form-control:focus,
.form-select:focus {
  border-color: #5a44ff;
  /* box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.15); */
  box-shadow: 10px 10px 22px rgba(15, 23, 42, 0.08);
}

.row-users {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.6fr 1.2fr;
  gap: 14px;
}

.row-invite {
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  gap: 14px;
}

/* ===== CTA ===== */
.cta {
  margin-top: 64px;
  text-align: right;
}

.btn-primary {
  background: #5a44ff;
  border: none;
  border-radius: 14px;
  padding: 16px 36px;
  font-weight: 600;
  font-size: 15px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 10px 22px rgba(90, 68, 255, 0.28);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(90, 68, 255, 0.38);
}

.chip,
.form-control,
.form-select,
.btn-primary {
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease,
    border-color 0.25s ease;
}
.chip:hover {
  transform: translateY(-2px);
}

/* ===== RESPONSIVE ===== */
/* iPad Air */
@media (max-width: 992px) {
  .app {
    grid-template-columns: 720px;
    justify-content: center;
  }
  .content {
    margin-left: 0;
    margin-top: 180px;
    height: auto;
    padding: 20px 40px;
  }
  .row-invite {
    grid-template-columns: 1fr;
  }
  .row-users {
    grid-template-columns:
      minmax(95px, 2fr)
      minmax(70px, 2fr)
      minmax(70px, 2fr)
      minmax(125px, 3fr)
      minmax(118px, 3fr)
      minmax(110px, 2.5fr);
    gap: 5px;
  }
  .btn-primary {
    padding: 13px 29px;
  }
  .row-invite[data-v-9a2bf7bb] {
    grid-template-columns: 1fr 1fr 2fr;
    gap: 5px;
  }
  .location-circle {
    margin-top: 3px;
  }
}

/* iPad Pro */
@media (max-width: 1200px) {
  .chip-group {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
  .content {
    margin-left: 10px;
    margin-top: 210px;
    height: auto;
  }
  .cta {
    margin-top: 174px;
  }
}


/* iPad Mini */
@media (max-width: 768px) {
  .chip-group {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }
}


/* ── Jira Connected User ── */
.jira-user-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1.5px solid #d1fae5;
  border-radius: 12px;
  background: #f0fdf4;
}

.jira-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
}

.jira-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.jira-user-email {
  font-size: 12px;
  color: #6b7280;
}

.jira-user-badge {
  margin-left: auto;
  font-size: 12px;
  font-weight: 600;
  color: #16a34a;
}

/* ── Jira Cloud Resources ── */
.jira-resources-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.jira-resource-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jira-resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1.5px solid #e6e9f2;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  background: #fff;
}

.jira-resource-item:hover {
  border-color: #5a44ff;
  background: #f5f4ff;
}

.jira-resource-item.active {
  border-color: #5a44ff;
  background: #f0eeff;
}

.jira-resource-avatar {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  object-fit: cover;
}

.jira-resource-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.jira-resource-url {
  font-size: 12px;
  color: #6b7280;
}
/* ── LocationView New Design ── */
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
.loc-page { max-width: 960px; margin: 0 auto; padding: 84px 20px 60px; }

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
.loc-layout { display: grid; grid-template-columns: 1fr 260px; gap: 24px; align-items: flex-start; }
.loc-sidebar { padding-top: 100px; }

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

/* Form */
.loc-form-row { display: grid; grid-template-columns: 120px 1fr 1fr 180px; gap: 12px; margin-bottom: 12px; align-items: flex-start; }
.loc-form-group { display: flex; flex-direction: column; gap: 4px; position: relative; }
.loc-form-type { min-width: 0; }
.loc-form-name { min-width: 0; }
.loc-form-role { min-width: 0; }
.loc-users-added-card {
  background: #241447;
  color: #fff;
  border-radius: 14px;
  padding: 14px;
  min-height: 142px;
  margin-top: 190px;
}
.loc-users-added-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.loc-users-added-title { font-size: 0.88rem; font-weight: 700; }
.loc-users-added-count { background: rgba(161, 236, 242, 0.24); color: #a1ecf2; border-radius: 999px; padding: 2px 8px; font-size: 0.74rem; font-weight: 700; }
.loc-users-added-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 220px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}
.loc-users-added-list::-webkit-scrollbar { width: 5px; }
.loc-users-added-list::-webkit-scrollbar-thumb {
  background: rgba(161,236,242,0.45);
  border-radius: 10px;
}
.loc-users-added-list::-webkit-scrollbar-track { background: transparent; }
.loc-users-added-item { display: grid; grid-template-columns: 30px minmax(0, 1fr); gap: 8px; background: rgba(255,255,255,0.09); border: 1px solid rgba(161,236,242,0.25); border-radius: 10px; padding: 8px; }
.loc-users-added-initials { width: 30px; height: 30px; border-radius: 50%; background: #a1ecf2; color: #241447; font-size: 0.7rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.loc-users-added-meta { min-width: 0; }
.loc-users-added-name { margin: 0; font-size: 0.8rem; font-weight: 700; color: #fff; line-height: 1.2; }
.loc-users-added-empty { border: 1px dashed rgba(161,236,242,0.35); border-radius: 10px; padding: 14px 10px; text-align: center; font-size: 0.76rem; color: rgba(255,255,255,0.78); }
.loc-form-label { font-size: 0.65rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; }
.loc-input {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;
  font-size: 0.85rem; color: #1e293b; background: #fff; outline: none;
  transition: border-color 0.15s;
}
.loc-input:focus { border-color: #0f696e; box-shadow: 0 0 0 2px rgba(15,105,110,0.1); }
.loc-select {
  border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;
  font-size: 0.85rem; color: #1e293b; background: #fff; outline: none;
  appearance: none; cursor: pointer;
}
.loc-select:focus { border-color: #0f696e; }
.loc-select-custom { display: flex; justify-content: space-between; align-items: center; cursor: pointer; user-select: none; overflow: hidden; }
.loc-select-arrow { font-size: 0.7rem; color: #94a3b8; flex-shrink: 0; margin-left: 4px; }
.loc-role-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; font-size: 0.85rem; color: #1e293b; }
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

.loc-email-row { display: flex; align-items: center; gap: 12px; }
.loc-email-input { flex: 1; }
.loc-users-added-email {
  font-size: 11px;
  color: #94a3b8;
  margin: 0;
}
.loc-slack-badge {
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
  margin-top: 3px;
}
.loc-slack-synced  { background: #dcfce7; color: #15803d; }
.loc-slack-pending { background: #fef3c7; color: #b45309; }
.loc-slack-failed  { background: #fee2e2; color: #dc2626; }
.loc-resync-btn {
  margin-left: auto;
  background: #f0f9ff;
  border: 1.5px solid #7dd3fc;
  color: #0369a1;
  font-size: 11px;
  font-weight: 700;
  border-radius: 8px;
  padding: 4px 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
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

/* Sidebar */
.loc-sidebar { display: flex; flex-direction: column; gap: 16px; }

/* Integration Help */
.loc-help-card {
  background: #241447; border-radius: 14px; padding: 20px;
  color: #fff;
}
.loc-help-header { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; }
.loc-help-icon { color: #a1ecf2; font-size: 1rem; }
.loc-help-title { font-size: 0.95rem; font-weight: 700; }
.loc-help-item { display: flex; align-items: flex-start; gap: 8px; font-size: 0.78rem; line-height: 1.5; }
.loc-help-item-icon { color: #a1ecf2; flex-shrink: 0; margin-top: 2px; }
.loc-help-bold { font-weight: 700; color: #fff; }
.loc-help-text { color: rgba(255,255,255,0.75); }
.loc-help-link { display: inline-flex; align-items: center; margin-top: 16px; font-size: 0.72rem; font-weight: 700; color: #a1ecf2; text-decoration: none; letter-spacing: 0.06em; }
.loc-help-link:hover { text-decoration: underline; color: #a1ecf2; }

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
  .loc-users-added-card { min-height: auto; margin-top: 0; }
}

</style>
