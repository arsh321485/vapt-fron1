<template>
  <!-- Notification Button -->
  <div class="position-relative">
    <button class="btn border-0 position-relative" @click="toggleNotificationPanel">
      <i class="bi bi-bell fs-5 nav-menu"></i>
      <span v-if="unreadCount > 0" class="notif-badge">
        {{ unreadCount > 99 ? "99+" : unreadCount }}
      </span>
    </button>
  </div>

  <div class="notification-panel" :class="{ open: showNotifications, fullscreen: isFullscreen }">
    <div class="card shadow-lg border-0 rounded-4 h-100 d-flex flex-column" style="background-color: white;">
      <!-- Header -->
      <div class="card-header d-flex justify-content-between align-items-center border-0">
        <h5 class="mb-0 fw-semibold my-3 mx-3 text-dark">Notifications</h5>
        <div>
          <div class="btn-group me-2">
            <button class="btn btn-sm btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i class="bi bi-filter"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" @click="filterType = ''">All</a></li>
              <li><a class="dropdown-item" @click="filterType = 'unread'">Unread</a></li>
              <li><a class="dropdown-item" @click="filterType = 'read'">Read</a></li>
            </ul>
          </div>

          <button class="btn btn-sm btn-light me-2" @click="toggleFullscreen">
            <i class="bi bi-arrows-fullscreen"></i>
          </button>

          <button class="btn-close btn-close-dark" @click="toggleNotificationPanel"></button>
        </div>
      </div>

      <!-- Body -->
      <div class="card-body px-3 pt-2" style="max-height: 500px; overflow-y: auto;">
        <div v-if="loading && notifications.length === 0" class="text-center py-4 text-muted">
          <span class="spinner-border spinner-border-sm me-2"></span>Loading...
        </div>

        <div
          v-for="notification in filteredNotifications"
          v-else
          :key="notification.id"
          class="d-flex align-items-start py-2 border-bottom text-dark"
          style="cursor: pointer;"
          @click="handleNotificationClick(notification)"
        >
          <i :class="['me-3 fs-5', notification.icon, notification.color]"></i>
          <div>
            <p
              class="mb-2"
              style="font-weight:100;"
              :class="{ 'text-secondary': notification.is_read }"
            >
              {{ notification.message }}
            </p>
            <small class="text-secondary">{{ formatTimeAgo(notification.created_at) }}</small>
          </div>
        </div>

        <p v-if="!loading && filteredNotifications.length === 0" class="text-center text-muted mt-3">
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
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "NotificationPanel",
  props: {
    recipientType: {
      type: String,
      default: "admin",
    },
  },
  data() {
    return {
      authStore: useAuthStore(),
      showNotifications: false,
      isFullscreen: false,
      filterType: "",
      showAll: false,
      notifications: [],
      loading: false,
      unreadCount: 0,
      pollTimer: null,
    };
  },
  computed: {
    filteredNotifications() {
      let list = [...this.notifications];
      if (this.filterType === "unread") list = list.filter((n) => !n.is_read);
      if (this.filterType === "read") list = list.filter((n) => n.is_read);
      return this.showAll ? list : list.slice(0, 4);
    },
  },
  methods: {
    mapNotifIcon(notifType) {
      const t = String(notifType || "").toLowerCase();
      if (t.includes("held")) return { icon: "bi bi-pause-circle", color: "text-warning" };
      if (t.includes("unhold") || t.includes("restored")) return { icon: "bi bi-arrow-repeat", color: "text-success" };
      if (t.includes("support") || t.includes("exception")) return { icon: "bi bi-exclamation-triangle", color: "text-warning" };
      if (t.includes("deadline")) return { icon: "bi bi-clock-history", color: "text-danger" };
      return { icon: "bi bi-bell", color: "text-primary" };
    },
    normalizeTimestamp(dateStr) {
      const raw = String(dateStr || "").trim();
      if (!raw) return "";
      // Some API responses can be timezone-naive; treat them as UTC for consistent "time ago".
      const isTimezoneNaive = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?$/.test(raw);
      return isTimezoneNaive ? `${raw}Z` : raw;
    },
    formatTimeAgo(dateStr) {
      const d = new Date(this.normalizeTimestamp(dateStr));
      if (Number.isNaN(d.getTime())) return "";
      const seconds = Math.max(0, Math.floor((Date.now() - d.getTime()) / 1000));
      if (seconds < 60) return "just now";
      const mins = Math.floor(seconds / 60);
      if (mins < 60) return `${mins} min ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      const days = Math.floor(hours / 24);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    },
    async fetchNotifications(options = {}) {
      const { silent = false } = options;
      if (!silent) this.loading = true;
      try {
        const res =
          this.recipientType === "user"
            ? await this.authStore.fetchUserNotifications()
            : await this.authStore.fetchAdminNotifications();
        const data = res.status ? res.data : null;
        const list = Array.isArray(data?.notifications) ? data.notifications : [];
        this.notifications = list.map((n) => {
          const mapped = this.mapNotifIcon(n.notif_type);
          return {
            ...n,
            icon: mapped.icon,
            color: mapped.color,
          };
        });
        await this.fetchUnreadCount();
      } catch (e) {
        console.warn("Failed to fetch notifications:", e);
        this.notifications = [];
      } finally {
        if (!silent) this.loading = false;
      }
    },
    async fetchUnreadCount() {
      try {
        const res =
          this.recipientType === "user"
            ? await this.authStore.fetchUserUnreadNotificationCount()
            : await this.authStore.fetchAdminUnreadNotificationCount();
        if (res.status) {
          this.unreadCount = Number(res.data?.unread_count || 0);
        }
      } catch (e) {
        console.warn("Failed to fetch unread count:", e);
      }
    },
    async handleNotificationClick(notification) {
      if (!notification?.id || notification.is_read) return;
      const res =
        this.recipientType === "user"
          ? await this.authStore.markUserNotificationRead(notification.id)
          : await this.authStore.markAdminNotificationRead(notification.id);
      if (!res.status) return;

      this.notifications = this.notifications.map((n) =>
        n.id === notification.id ? { ...n, is_read: true } : n,
      );
      this.unreadCount = Math.max(0, this.unreadCount - 1);
    },
    toggleNotificationPanel() {
      this.showNotifications = !this.showNotifications;
      if (this.showNotifications) {
        this.fetchUnreadCount();
        this.fetchNotifications();
      }
    },
    toggleFullscreen() {
      this.isFullscreen = !this.isFullscreen;
    },
    async markAllAsRead() {
      const res =
        this.recipientType === "user"
          ? await this.authStore.markAllUserNotificationsRead()
          : await this.authStore.markAllAdminNotificationsRead();
      if (!res.status) return;
      this.notifications = this.notifications.map((n) => ({ ...n, is_read: true }));
      this.unreadCount = 0;
    },
    toggleShowAll() {
      this.showAll = !this.showAll;
    },
    refreshNotifications(options = {}) {
      const { silent = true } = options;
      this.fetchUnreadCount();
      this.fetchNotifications({ silent });
    },
    handleWindowFocus() {
      this.refreshNotifications();
    },
    handleVisibilityChange() {
      if (!document.hidden) {
        this.refreshNotifications();
      }
    },
  },
  mounted() {
    this.refreshNotifications({ silent: false });
    window.addEventListener("focus", this.handleWindowFocus);
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
  },
  beforeUnmount() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    window.removeEventListener("focus", this.handleWindowFocus);
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
  },
  created() {
    // Keep bell count updated even when panel is closed.
    this.pollTimer = setInterval(() => {
      this.fetchUnreadCount();
      if (this.showNotifications) {
        this.fetchNotifications({ silent: true });
      }
    }, 10000);
  },
};
</script>

<style scoped>
.notif-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #dc2626;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  font-weight: 700;
  text-align: center;
}
</style>
