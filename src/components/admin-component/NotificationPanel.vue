<template>
  <!-- Notification Button -->
                  <div>
                    <button 
                      class="btn border-0" 
                      @click="toggleNotificationPanel"
                    >
                      <i class="bi bi-bell fs-5 nav-menu"></i>
                    </button>
                  </div>
                   
                  <div class="notification-panel" :class="{ 'open': showNotifications, 'fullscreen': isFullscreen }">
                  <div class="card shadow-lg border-0 rounded-4 text-light h-100 d-flex flex-column" style="background-color: white;">
                  <!-- Header -->
                  <div class="card-header d-flex justify-content-between align-items-center border-0">
                  <h5 class="mb-0 fw-semibold my-3 mx-3 text-dark">Notifications</h5>
                  <div>
                  <!-- Filter -->
                  <div class="btn-group me-2">
                    <button 
                      class="btn btn-sm btn-light dropdown-toggle" 
                      type="button" 
                      data-bs-toggle="dropdown"
                    >
                      <i class="bi bi-filter"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" @click="filterType = ''">All</a></li>
                      <li><a class="dropdown-item" @click="filterType = 'fixed'">Fixed Vulnerabilities</a></li>
                      <li><a class="dropdown-item" @click="filterType = 'exception'">Exception Raised</a></li>
                      <li><a class="dropdown-item" @click="filterType = 'assigned'">Assigned Vulnerabilities</a></li>
                      <li><a class="dropdown-item" @click="filterType = 'report'">Reports</a></li>
                    </ul>
                  </div>

                  <!-- Fullscreen -->
                  <button class="btn btn-sm btn-light me-2" @click="toggleFullscreen">
                    <i class="bi bi-arrows-fullscreen"></i>
                  </button>

                  <!-- Close -->
                  <button class="btn-close btn-close-dark" @click="toggleNotificationPanel"></button>
                </div>
              </div>

              <!-- Body -->
              <div class="card-body px-3 pt-2" style="max-height: 500px; overflow-y: auto;">
                <div 
                  v-for="(notification, index) in filteredNotifications" 
                  :key="index" 
                  class="d-flex align-items-start py-2 border-bottom text-dark"
                >
                  <i :class="['me-3 fs-5', notification.icon, notification.color]"></i>
                  <div>
                   
        <p 
          class="mb-2" 
          style="font-weight:100;" 
          v-html="notification.message"
          :class="{'text-secondary': notification.read}">
        </p>
             <small class="text-secondary">{{ notification.time }}</small>
                  </div>
                </div>

                <p v-if="filteredNotifications.length === 0" class="text-center text-muted mt-3">
                  No notifications found.
                </p>
              </div>
                    <!-- Footer -->
                    <div class="card-footer border-0 d-flex justify-content-between mt-auto">
                       <button class="btn btn-dark btn-sm" @click="toggleShowAll">
                       {{ showAll ? "View Less" : "View All Notifications" }}
                        </button>
                      <button class="btn btn-dark btn-sm" @click="markAllAsRead">Mark All as Read</button>
                    </div>
                  </div>
                  </div>
</template>

<script>
export default {
  name: "NotificationPanel",
  data() {
    return {
      showNotifications: false,
      isFullscreen: false,
      filterType: "",
      showAll: false,
      notifications: [
        { type: "report", icon: "bi bi-file-text", color: "text-info", message: "A <b>new report</b> was added for vulnerability <b>VMware ESXi 7.0/8.0 Sandbox Escape</b> from Patch Management.", time: "2 min ago"  },
        { type: "fixed", icon: "bi bi-check-circle", color: "text-success", message: "Vulnerability <b>VMware ESXi 7.0/8.0 Sandbox Escape</b> has been <span class='fw-semibold'>fixed</span> from Configuration Management.", time: "10 min ago" },
        { type: "assigned", icon: "bi bi-person-check", color: "text-primary", message: "A new vulnerability <b>VMware ESXi 7.0/8.0 Sandbox Escape</b> was <span class='fw-semibold'>assigned</span> to you from Network Security.", time: "15 min ago" },
        { type: "exception", icon: "bi bi-exclamation-triangle", color: "text-warning", message: "An <span class='fw-semibold'>exception</span> was raised for vulnerability <b>VMware ESXi 7.0/8.0 Sandbox Escape</b> from Architectural Flaws.", time: "30 min ago" },
        { type: "download", icon: "bi bi-download", color: "text-primary", message: "Your report has been downloaded successfully.", time: "10 min ago" },
        
  { type: "mitigated", icon: "bi bi-shield-check", color: "text-success", message: "Vulnerability <b>Apache Struts RCE</b> has been successfully <span class='fw-semibold'>mitigated</span> by Security Team.", time: "5 min ago" },

  { type: "deadline", icon: "bi bi-clock-history", color: "text-warning", message: "The <span class='fw-semibold'>deadline</span> for vulnerability <b>OpenSSL Buffer Overflow</b> has been <span class='fw-semibold'>extended</span> by Admin.", time: "12 min ago" },

  { type: "exception-request", icon: "bi bi-journal-text", color: "text-primary", message: "An <span class='fw-semibold'>exception request</span> was submitted for <b>Windows SMBv1 Remote Exploit</b>.", time: "20 min ago" },

  { type: "exception-approved", icon: "bi bi-check-circle", color: "text-success", message: "Exception request for <b>Oracle WebLogic RCE</b> has been <span class='fw-semibold'>approved</span>.", time: "45 min ago" },

  { type: "exception-denied", icon: "bi bi-x-circle", color: "text-danger", message: "Exception request for <b>Apache Log4j JNDI Exploit</b> has been <span class='fw-semibold'>denied</span>.", time: "1 hour ago" },

  { type: "ticket", icon: "bi bi-ticket-detailed", color: "text-info", message: "A new <b>ticket</b> was raised for vulnerability <b>MySQL Privilege Escalation</b>.", time: "2 hours ago" },

  { type: "user-added", icon: "bi bi-person-plus", color: "text-success", message: "A <b>new user</b> was <span class='fw-semibold'>added</span> to the <b>Incident Response Team</b>.", time: "3 hours ago" },

  { type: "user-deleted", icon: "bi bi-person-dash", color: "text-danger", message: "User <b>John Doe</b> was <span class='fw-semibold'>removed</span> from the <b>Patch Management Team</b>.", time: "5 hours ago" },

  { type: "user-team-change", icon: "bi bi-people", color: "text-primary", message: "User <b>Alice Smith</b> was <span class='fw-semibold'>moved</span> to <b>Configuration Management</b>.", time: "6 hours ago" },

  { type: "control-request", icon: "bi bi-shield-plus", color: "text-warning", message: "A <span class='fw-semibold'>compensatory control</span> request was raised for <b>Linux Kernel Privilege Escalation</b>.", time: "8 hours ago" },

  { type: "asset-removed", icon: "bi bi-dash-circle", color: "text-secondary", message: "Asset <b>Legacy Server 192.168.1.25</b> was <span class='fw-semibold'>removed</span> from the vulnerability list.", time: "10 hours ago" }

      ],
    };
  },
  computed: {
    filteredNotifications() {
    let list = this.filterType
      ? this.notifications.filter(n => n.type === this.filterType)
      : this.notifications;

    // If not showing all, limit to visibleCount
    return this.showAll ? list : list.slice(0, 4);
  }
  },
  methods: {
    toggleNotificationPanel() {
      this.showNotifications = !this.showNotifications;
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },
    markAllAsRead() {
      this.notifications.forEach(n => (n.read = true));
    },
    toggleShowAll() {
      this.showAll = !this.showAll;
    }
  }
};
</script>
