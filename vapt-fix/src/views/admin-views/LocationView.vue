<template>
  <main>
    <!-- TOP BAR -->
    <div class="topbar">
      <img src="@/assets/images/logo-capital.png" alt="" class="h-50">
    </div>

    <div class="app">
      <!-- STEPPER -->
      <Stepper />

      <!-- CONTENT -->
      <div class="content">
        <h1>Add users</h1>
        <p>Align your team and tools for a seamless build.</p>

        <!-- Communication -->
        <div class="section">
          <div class="section-title">Communication platform</div>
          <div class="chip-group selectable">
            <div v-for="platform in communicationPlatforms" :key="platform.value" class="chip"
              :class="{ active: selectedCommunication === platform.value }" @mousedown.prevent
              @click.stop="handleCommunicationClick(platform.value)">
              <img v-if="platform.icon" :src="platform.icon" />
              {{ platform.label }}
            </div>
          </div>
        </div>

        <!-- Project -->
        <div class="section">
          <div class="section-title">Project management</div>
          <div class="chip-group selectable">
            <div v-for="tool in projectPlatforms" :key="tool.value" class="chip"
              :class="{ active: selectedProject === tool.value }" @mousedown.prevent
              @click.stop="handleProjectClick(tool.value)">
              <img v-if="tool.icon" :src="tool.icon" />
              {{ tool.label }}
            </div>
          </div>

          <!-- Jira Connected User -->
          <div v-if="jiraConnected && jiraUser" class="jira-user-card mt-3">
            <img :src="jiraUser.picture" class="jira-user-avatar" />
            <div class="jira-user-info">
              <div class="jira-user-name">{{ jiraUser.name }}</div>
              <div class="jira-user-email">{{ jiraUser.email }}</div>
            </div>
            <span class="jira-user-badge">
              <i class="bi bi-check-circle-fill me-1"></i>Connected
            </span>
          </div>

          <!-- Jira Cloud Resources -->
          <div v-if="jiraConnected && jiraResources.length" class="jira-resources mt-3">
            <div class="jira-resources-title">
              <i class="bi bi-check-circle-fill text-success me-1"></i>
              Jira Connected — Select your workspace:
            </div>
            <div class="jira-resource-list mt-2">
              <div
                v-for="resource in jiraResources"
                :key="resource.id"
                class="jira-resource-item"
                :class="{ active: selectedJiraCloudId === resource.id }"
                @click="selectedJiraCloudId = resource.id"
              >
                <img :src="resource.avatarUrl" class="jira-resource-avatar" />
                <div class="jira-resource-info">
                  <div class="jira-resource-name">{{ resource.name }}</div>
                  <div class="jira-resource-url">{{ resource.url }}</div>
                </div>
                <i v-if="selectedJiraCloudId === resource.id" class="bi bi-check-circle-fill text-success ms-auto"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Users -->
        <div class="section">
          <div class="section-title">Users</div>

          <div class="row-users">
            <!-- User Type -->
            <select v-model="form.user_type" class="form-select">
              <option disabled value="">User type</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>

            <!-- First Name -->
            <input class="form-control" placeholder="First name" v-model="form.first_name" />

            <!-- Last Name -->
            <input class="form-control" placeholder="Last name" v-model="form.last_name" />

            <!-- Email -->
            <input class="form-control" placeholder="Email" type="email" v-model="form.email" />

            <!-- Location -->
            <!-- <select v-model="selectedLocation" class="form-select">
              <option disabled value="">Location</option>
              <option v-for="loc in authStore.locations" :key="loc._id" :value="loc._id">
                {{ loc.location_name }}
              </option>
            </select> -->

            <!-- Member Role (Multi Select) -->
            <div class="position-relative" ref="roleDropdown">
              <div class="form-select" @click="isRoleOpen = !isRoleOpen">
                {{ selectedRoles.length ? selectedRoles.join(", ") : "Role" }}
              </div>

              <div v-if="isRoleOpen" class="dropdown-list">
                <label v-for="role in roleOptions" :key="role.short">
                  <input type="checkbox" :value="role.short" v-model="selectedRoles" />
                  {{ role.full }}
                </label>
              </div>
            </div>
          </div>

          <div class="row-users-btn mt-4">
            <button class="btn btn-primary" @click="addUser">
              Add User
            </button>
          </div>
        </div>

        <div class="cta">
           <button class="btn btn-primary" @click="handleContinue">
    {{ returnTo ? 'Back to Previous Page →' : 'Continue to Risk Criteria →' }}
  </button>

        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Stepper from "@/components/admin-component/Stepper.vue";
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import teamsIcon from "@/assets/images/teams.png";
import slackIcon from "@/assets/images/slack.png";
import jiraIcon from "@/assets/images/jira.png";
import asanaIcon from "@/assets/images/asana.png";

export default {
  name: "LocationView",
  components: {
    Stepper
  },
  data() {
    return {
      authStore: useAuthStore(),
      locationName: "",
      showDropdown: false,
      filteredCountries: [],
      avatarColors: ["#13b561", "#efbe34", "#ea4544"],
      selectedLocation: "",
      externalLocation: "",
      selectedRoles: [],
      isRoleOpen: false,
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
        { value: "asana", label: "Asana", icon: asanaIcon },
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
    async addUser() {
      // 1️⃣ Validate required fields before API call
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

      // 2️⃣ Get admin id
      const adminId =
        this.authStore.user?._id ||
        this.authStore.user?.id;

      if (!adminId) {
        Swal.fire("Error", "Please login again", "error");
        return;
      }

      // 3️⃣ Build payload (❌ location removed)
      const payload = {
        admin_id: adminId,                 // ✅ required
        first_name: this.form.first_name,
        last_name: this.form.last_name,
        email: this.form.email,
        user_type: this.form.user_type,
        Member_role: this.selectedRoles.map(
          r => this.roleOptions.find(o => o.short === r)?.full
        )                                  // ✅ full role names
      };

      // 🧪 Debug
      console.log("FINAL PAYLOAD 👉", payload);

      // 3️⃣ API call
      const res = await this.authStore.createUserDetail(payload);

      if (res.status) {
        Swal.fire({
          icon: "success",
          title: "User added successfully",
          timer: 1800,
          showConfirmButton: false,
          allowOutsideClick: false
        });

        // 🔄 reset form
        this.form.first_name = "";
        this.form.last_name = "";
        this.form.email = "";
        this.form.user_type = "";
        this.selectedRoles = [];
        this.isRoleOpen = false;

      } else {
        let errorMessage = "User detail with this email already exists";

        if (
          res.details &&
          res.details.detail &&
          res.details.detail.email &&
          Array.isArray(res.details.detail.email)
        ) {
          errorMessage = "User detail with this email already exists";
        } else if (res.message && !res.message.includes("500")) {
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
    closeOnOutside(e) {
      const role = this.$refs.roleDropdown;
      const secondary = this.$refs.secondaryRoleDropdown;
      if (
        role && !role.contains(e.target) &&
        secondary && !secondary.contains(e.target)
      ) {
        this.isRoleOpen = false;
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
        this.selectedCommunication = value;

        if (value === "slack") {
          await this.startSlackLogin();
        }

        // ✅ ADD THIS
        if (value === "teams") {
          await this.startMicrosoftLogin();
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
        this.selectedCommunication = this.pendingCommunication;
        // ✅ VERY IMPORTANT
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
      // 🟢 CASE 1: Came from dashboard / assets / tickets / etc
  if (this.returnTo) {
    this.$router.push(this.returnTo);
    return;
  }
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
    const res = await this.authStore.getMicrosoftOAuthUrl(redirectUri);
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
    onTeamsConnected(event) {
      if (event.data?.type === "TEAMS_CONNECTED") {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Microsoft Teams connected successfully",
          timer: 2000,
          showConfirmButton: false
        });
        this.fetchTeams();
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
    const res = await this.authStore.getSlackOAuthUrl(this.backendBase);

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

    // 🔹 CALL VALIDATE TOKEN
    console.log("Calling validate token API...");
    this.checkSlackConnection();
    // 🔹 CALL CHANNEL LIST
    console.log("Calling list channels API...");
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
      const adminId = user._id || user.id;
    }
  },
  beforeUnmount() {
    document.removeEventListener("click", this.closeOnOutside);
     window.removeEventListener("message", this.handleSlackMessage);
    window.removeEventListener("message", this.onTeamsConnected);
    window.removeEventListener("message", this.onJiraConnected);
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
</style>