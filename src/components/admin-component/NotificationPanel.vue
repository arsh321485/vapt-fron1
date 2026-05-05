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
    <div class="card notification-drawer-card shadow-lg border-0 rounded-4 h-100 d-flex flex-column overflow-hidden">
      <!-- Header — matches app chrome (#241447) -->
      <div class="notification-drawer-header card-header d-flex justify-content-between align-items-center border-0">
        <h5 class="mb-0 fw-semibold px-2 py-3 text-white">Notifications</h5>
        <div class="d-flex align-items-center gap-1 pe-2">
          <div class="btn-group">
            <button
              class="btn btn-sm btn-outline-light border-0 dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="bi bi-filter"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" @click.prevent="filterType = ''">All</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="filterType = 'unread'">Unread</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="filterType = 'read'">Read</a></li>
            </ul>
          </div>

          <button
            type="button"
            class="btn btn-sm btn-outline-light border-0"
            aria-label="Toggle fullscreen"
            @click="toggleFullscreen"
          >
            <i class="bi bi-arrows-fullscreen"></i>
          </button>

          <button
            type="button"
            class="btn-close btn-close-white"
            aria-label="Close"
            @click="toggleNotificationPanel"
          ></button>
        </div>
      </div>

      <!-- Body -->
      <div class="notification-drawer-body card-body px-0 pt-0 flex-grow-1" style="max-height: 500px; overflow-y: auto">
        <div v-if="loading && notifications.length === 0" class="text-center py-5 text-muted">
          <span class="spinner-border spinner-border-sm me-2"></span>Loading...
        </div>

        <div
          v-for="notification in filteredNotifications"
          v-else
          :key="notification.id"
          class="notification-row d-flex align-items-start gap-3 px-3 py-3"
          :class="[
            notification.is_read ? 'is-read' : 'is-unread',
            notification.severityFromMessage
              ? `notification-row--sev-${notification.severityFromMessage}`
              : '',
          ]"
          role="button"
          tabindex="0"
          @click="handleNotificationClick(notification)"
          @keydown.enter="handleNotificationClick(notification)"
        >
          <div
            class="notification-row-icon flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle"
            :class="`notification-row-icon--${notification.severityFromMessage || 'default'}`"
          >
            <i :class="['fs-5', notification.icon, notification.color]"></i>
          </div>
          <div class="flex-grow-1 min-w-0">
            <p class="notification-message mb-1" :class="{ 'opacity-75': notification.is_read }">
              <template v-for="(seg, idx) in getMessageSegments(notification.message)" :key="`${notification.id}-${idx}`">
                <span :class="messageSegmentClass(seg)">{{ seg.text }}</span>
              </template>
            </p>
            <small class="notification-time text-muted">{{ formatTimeAgo(notification.created_at) }}</small>
          </div>
        </div>

        <p v-if="!loading && filteredNotifications.length === 0" class="text-center text-muted py-5 px-3 mb-0">
          No notifications found.
        </p>
      </div>

      <!-- Footer -->
      <div class="notification-drawer-footer card-footer border-0 d-flex flex-wrap justify-content-between gap-2 mt-auto">
        <button type="button" class="btn btn-sm notification-footer-btn" @click="toggleShowAll">
          {{ showAll ? "View Less" : "View All Notifications" }}
        </button>
        <button type="button" class="btn btn-sm notification-footer-btn notification-footer-btn--outline" @click="markAllAsRead">
          Mark All as Read
        </button>
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
    severityFromMessage(message) {
      const m = String(message || "").match(/\[(Critical|High|Medium|Low)\]/i);
      if (!m) return null;
      return String(m[1] || "").toLowerCase();
    },
    mapNotifIcon(notifType, message) {
      const sev = this.severityFromMessage(message);
      if (sev === "critical") {
        return { icon: "bi bi-exclamation-octagon-fill", color: "text-white" };
      }
      if (sev === "high") {
        return { icon: "bi bi-clock-history", color: "text-white" };
      }
      if (sev === "medium") {
        return { icon: "bi bi-exclamation-triangle", color: "text-white" };
      }
      if (sev === "low") {
        return { icon: "bi bi-info-circle", color: "text-white" };
      }
      const t = String(notifType || "").toLowerCase();
      if (t.includes("held")) return { icon: "bi bi-pause-circle", color: "text-warning" };
      if (t.includes("unhold") || t.includes("restored")) return { icon: "bi bi-arrow-repeat", color: "text-success" };
      if (t.includes("support") || t.includes("exception")) return { icon: "bi bi-exclamation-triangle", color: "text-warning" };
      if (t.includes("deadline")) return { icon: "bi bi-clock-history", color: "text-danger" };
      return { icon: "bi bi-bell", color: "text-primary" };
    },
    getMessageSegments(text) {
      const raw = String(text || "");
      const segments = [];
      // Order: specific phrases first (due date today …), then standalone today/tomorrow.
      const pattern =
        /(\[(?:Critical|High|Medium|Low)\])|(\d+\s*day\(s\))|(exceeded\s+by\s+\d+\s*day\(s\))|(due\s+date\s+(?:today|tomorrow))|((?:is\s+)?due\s+(?:today|tomorrow))|\b(today|tomorrow)\b/gi;
      let lastIndex = 0;
      let match;
      while ((match = pattern.exec(raw)) !== null) {
        if (match.index > lastIndex) {
          segments.push({ kind: "plain", text: raw.slice(lastIndex, match.index) });
        }
        const full = match[0];
        if (match[1]) {
          const label = match[1].replace(/[\[\]]/g, "").toLowerCase();
          segments.push({ kind: `sev-${label}`, text: full });
        } else if (match[2]) {
          segments.push({ kind: "time-days", text: full });
        } else if (match[3]) {
          segments.push({ kind: "overdue", text: full });
        } else if (match[4] || match[5]) {
          segments.push({ kind: "due-date", text: full });
        } else if (match[6]) {
          segments.push({ kind: "urgency", text: full });
        }
        lastIndex = match.index + full.length;
      }
      if (lastIndex < raw.length) {
        segments.push({ kind: "plain", text: raw.slice(lastIndex) });
      }
      if (!segments.length && raw) {
        segments.push({ kind: "plain", text: raw });
      }
      return segments;
    },
    messageSegmentClass(seg) {
      const map = {
        plain: "notif-msg-plain",
        "sev-critical": "notif-sev notif-sev-critical",
        "sev-high": "notif-sev notif-sev-high",
        "sev-medium": "notif-sev notif-sev-medium",
        "sev-low": "notif-sev notif-sev-low",
        "time-days": "notif-time",
        "due-date": "notif-due-date",
        urgency: "notif-urgency",
        overdue: "notif-overdue",
      };
      return map[seg.kind] || "notif-msg-plain";
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
          const mapped = this.mapNotifIcon(n.notif_type, n.message);
          return {
            ...n,
            icon: mapped.icon,
            color: mapped.color,
            severityFromMessage: this.severityFromMessage(n.message),
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

/* Due date callouts (today / tomorrow) */
.notif-due-date {
  font-weight: 700;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.12);
  padding: 0.1em 0.35em;
  border-radius: 6px;
  border: 1px solid rgba(15, 105, 110, 0.25);
}

.notif-urgency {
  font-weight: 600;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.08);
  padding: 0.05em 0.25em;
  border-radius: 4px;
}
</style>
