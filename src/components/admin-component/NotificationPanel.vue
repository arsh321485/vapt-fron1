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
    <div class="notif-drawer card border-0 rounded-0 h-100 d-flex flex-column overflow-hidden">
      <!-- Header — dashboard purple -->
      <div class="notif-drawer-header card-header border-0 d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold notif-drawer-title">Notifications</h5>
        <div class="d-flex align-items-center gap-1">


          <button type="button" class="btn btn-sm notif-header-btn border-0" aria-label="Toggle fullscreen" @click="toggleFullscreen">
            <i class="bi bi-arrows-fullscreen"></i>
          </button>

          <button type="button" class="btn-close btn-close-white" aria-label="Close" @click="toggleNotificationPanel"></button>
        </div>
      </div>

      <!-- Body — dashboard grey canvas -->
      <div class="notif-drawer-body card-body flex-grow-1 px-3 py-3" style="overflow-y: auto; flex: 1 1 0; min-height: 0;">
        <div v-if="loading && notifications.length === 0" class="text-center py-5 notif-muted">
          <span class="spinner-border spinner-border-sm me-2" style="color: #0f696e"></span>
          Loading…
        </div>

        <div
          v-for="notification in filteredNotifications"
          v-else
          :key="notification.id"
          class="notif-card mb-3"
          :class="{
            'notif-card--unread': !notification.is_read,
            [`notif-card--${notification.severityKey || 'default'}`]: true,
          }"
          role="button"
          tabindex="0"
          @click="handleNotificationClick(notification)"
          @keydown.enter="handleNotificationClick(notification)"
        >
          <div class="d-flex align-items-start gap-3">
            <div class="notif-icon-wrap flex-shrink-0" :class="notification.iconWrapClass">
              <i :class="['fs-5', notification.icon, notification.iconColorClass]"></i>
            </div>
            <div class="min-w-0 flex-grow-1">
              <p class="notif-message mb-1" :class="{ 'notif-message--read': notification.is_read }">
                <template v-for="(seg, idx) in getMessageSegments(notification.message)" :key="`${notification.id}-${idx}`">
                  <span :class="messageSegmentClass(seg)">{{ seg.text }}</span>
                </template>
              </p>
              <small class="notif-time">{{ formatTimeAgo(notification.created_at) }}</small>
            </div>
          </div>
        </div>

        <p v-if="!loading && filteredNotifications.length === 0" class="text-center notif-muted py-5 mb-0">
          No notifications found.
        </p>
      </div>

      <!-- Footer -->
      <div class="notif-drawer-footer card-footer border-0 d-flex flex-wrap justify-content-between gap-2">
        <button type="button" class="btn btn-sm notif-btn-primary" @click="toggleShowAll">
          {{ showAll ? "View Less" : "View All Notifications" }}
        </button>
        <button type="button" class="btn btn-sm notif-btn-outline" @click="markAllAsRead">Mark All as Read</button>
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
      isTogglingShowAll: false,
    };
  },
  computed: {
    filteredNotifications() {
      let list = [...this.notifications];

      // If specific filterType is set, apply that filter
      if (this.filterType === "unread") {
        list = list.filter((n) => !n.is_read);
      } else if (this.filterType === "read") {
        list = list.filter((n) => n.is_read);
      }
      // else: Show ALL notifications (read + unread) in both modes
      // The only difference: View Less shows first 4, View All shows everything

      // When showAll is true, show all; otherwise limit to 4
      return this.showAll ? list : list.slice(0, 4);
    },
  },
  methods: {
    severityFromMessage(message) {
      const m = String(message || "").match(/\[(Critical|High|Medium|Low)\]/i);
      return m ? String(m[1]).toLowerCase() : null;
    },
    mapNotifVisuals(notifType, message) {
      const sev = this.severityFromMessage(message);
      if (sev === "critical") {
        return {
          icon: "bi bi-exclamation-octagon-fill",
          iconColorClass: "notif-icon-fg",
          iconWrapClass: "notif-icon-wrap--critical",
        };
      }
      if (sev === "high") {
        return {
          icon: "bi bi-clock-history",
          iconColorClass: "notif-icon-fg",
          iconWrapClass: "notif-icon-wrap--high",
        };
      }
      if (sev === "medium") {
        return {
          icon: "bi bi-exclamation-triangle-fill",
          iconColorClass: "notif-icon-fg",
          iconWrapClass: "notif-icon-wrap--medium",
        };
      }
      if (sev === "low") {
        return {
          icon: "bi bi-info-circle-fill",
          iconColorClass: "notif-icon-fg",
          iconWrapClass: "notif-icon-wrap--low",
        };
      }

      const t = String(notifType || "").toLowerCase();
      if (t.includes("held")) {
        return { icon: "bi bi-pause-circle-fill", iconColorClass: "notif-icon-fg-warn", iconWrapClass: "notif-icon-wrap--hold" };
      }
      if (t.includes("unhold") || t.includes("restored")) {
        return { icon: "bi bi-arrow-repeat", iconColorClass: "notif-icon-fg-ok", iconWrapClass: "notif-icon-wrap--ok" };
      }
      if (t.includes("support") || t.includes("exception")) {
        return { icon: "bi bi-exclamation-triangle-fill", iconColorClass: "notif-icon-fg-warn", iconWrapClass: "notif-icon-wrap--warn" };
      }
      if (t.includes("deadline")) {
        return { icon: "bi bi-alarm-fill", iconColorClass: "notif-icon-fg", iconWrapClass: "notif-icon-wrap--deadline" };
      }
      return { icon: "bi bi-bell-fill", iconColorClass: "notif-icon-fg-muted", iconWrapClass: "notif-icon-wrap--default" };
    },
    getMessageSegments(text) {
      const raw = String(text || "");
      const segments = [];
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
          const label = match[1].replace(/[[\]]/g, "").toLowerCase();
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
        plain: "notif-txt-plain",
        "sev-critical": "notif-pill notif-pill-critical",
        "sev-high": "notif-pill notif-pill-high",
        "sev-medium": "notif-pill notif-pill-medium",
        "sev-low": "notif-pill notif-pill-low",
        "time-days": "notif-accent-teal",
        "due-date": "notif-accent-due",
        urgency: "notif-accent-urgent",
        overdue: "notif-accent-overdue",
      };
      return map[seg.kind] || "notif-txt-plain";
    },
    normalizeTimestamp(dateStr) {
      const raw = String(dateStr || "").trim();
      if (!raw) return "";
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
      const { silent = false, includeRead = false } = options;
      if (!silent) this.loading = true;
      try {
        const res =
          this.recipientType === "user"
            ? await this.authStore.fetchUserNotifications(includeRead)
            : await this.authStore.fetchAdminNotifications(includeRead);
        const data = res.status ? res.data : null;
        const list = Array.isArray(data?.notifications) ? data.notifications : [];
        this.notifications = list.map((n) => {
          const v = this.mapNotifVisuals(n.notif_type, n.message);
          return {
            ...n,
            icon: v.icon,
            iconColorClass: v.iconColorClass,
            iconWrapClass: v.iconWrapClass,
            severityKey: this.severityFromMessage(n.message),
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

      // Don't reset showAll - keep notifications visible after marking as read
      // this.showAll = false; // REMOVED: This was hiding all notifications
    },
    async toggleShowAll() {
      // Prevent double-click
      if (this.isTogglingShowAll) return;

      this.isTogglingShowAll = true;
      this.showAll = !this.showAll;

      // Always fetch ALL notifications (read + unread)
      // The filtering is done in computed property based on showAll value
      this.filterType = "";
      await this.fetchNotifications({ silent: true, includeRead: true });

      this.isTogglingShowAll = false;
    },
    refreshNotifications(options = {}) {
      const { silent = true } = options;
      this.fetchUnreadCount();
      // Always fetch all notifications (read + unread)
      this.fetchNotifications({ silent, includeRead: true });
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
    this.pollTimer = setInterval(() => {
      this.fetchUnreadCount();
      if (this.showNotifications) {
        // Always fetch all notifications (read + unread)
        this.fetchNotifications({ silent: true, includeRead: true });
      }
    }, 10000);
  },
};
</script>

<style scoped>
/* Dashboard palette: purple #241447, teal #0f696e, canvas ~#f4f7fe */
.notif-drawer {
  background: #fff;
}

.notif-drawer-header {
  background: linear-gradient(135deg, #241447 0%, #1a0f38 100%);
  padding: 15px;
}

.notif-drawer-title {
  color: #fff;
  font-size: 1.05rem;
  letter-spacing: 0.02em;
}

.notif-header-btn {
  color: rgba(255, 255, 255, 0.85);
  background: transparent;
}

.notif-header-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.notif-drawer-body {
  background: #f4f7fe;
}

.notif-muted {
  color: rgba(36, 20, 71, 0.45);
}

.notif-drawer-footer {
  background: #fff;
  padding: 0.85rem 1rem;
  box-shadow: 0 -4px 20px rgba(36, 20, 71, 0.06);
}

.notif-btn-primary {
  background: #241447;
  color: #fff;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
}

.notif-btn-primary:hover {
  background: #1a0f38;
  color: #fff;
}

.notif-btn-outline {
  background: #fff;
  color: #241447;
  border: 1px solid rgba(36, 20, 71, 0.35);
  font-weight: 600;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
}

.notif-btn-outline:hover {
  background: #f4f7fe;
  color: #241447;
  border-color: #241447;
}

.notif-card {
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1rem 0.9rem;
  box-shadow: 0 2px 12px rgba(36, 20, 71, 0.07);
  border: 1px solid rgba(36, 20, 71, 0.06);
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
  cursor: pointer;
}

.notif-card:hover {
  box-shadow: 0 6px 20px rgba(36, 20, 71, 0.1);
  border-color: rgba(15, 105, 110, 0.2);
}

.notif-card--unread {
  border-left: 4px solid #0f696e;
  box-shadow: 0 2px 14px rgba(15, 105, 110, 0.12);
}

.notif-card--critical.notif-card--unread {
  border-left-color: #b42318;
}

.notif-card--high.notif-card--unread {
  border-left-color: #ea580c;
}

.notif-card--medium.notif-card--unread {
  border-left-color: #ca8a04;
}

.notif-card--low.notif-card--unread {
  border-left-color: #0f696e;
}

.notif-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notif-icon-wrap--critical {
  background: linear-gradient(145deg, #fecaca 0%, #fca5a5 100%);
}
.notif-icon-wrap--high {
  background: linear-gradient(145deg, #fed7aa 0%, #fdba74 100%);
}
.notif-icon-wrap--medium {
  background: linear-gradient(145deg, #fef08a 0%, #fde047 100%);
}
.notif-icon-wrap--low {
  background: linear-gradient(145deg, #ccfbf1 0%, #99f6e4 100%);
}
.notif-icon-wrap--deadline {
  background: linear-gradient(145deg, #e0e7ff 0%, #c7d2fe 100%);
}
.notif-icon-wrap--default {
  background: linear-gradient(145deg, #e0e7ff 0%, #dbeafe 100%);
}
.notif-icon-wrap--hold {
  background: linear-gradient(145deg, #fef3c7 0%, #fde68a 100%);
}
.notif-icon-wrap--warn {
  background: linear-gradient(145deg, #fef3c7 0%, #fcd34d 100%);
}
.notif-icon-wrap--ok {
  background: linear-gradient(145deg, #d1fae5 0%, #a7f3d0 100%);
}

.notif-icon-fg {
  color: #241447;
}
.notif-icon-fg-muted {
  color: #3730a3;
}
.notif-icon-fg-warn {
  color: #b45309;
}
.notif-icon-fg-ok {
  color: #047857;
}

.notif-message {
  font-size: 0.9rem;
  line-height: 1.45;
  color: #1e1b2e;
  font-weight: 500;
  margin: 0;
}

.notif-message--read {
  color: #64748b;
  font-weight: 400;
}

.notif-txt-plain {
  font-weight: inherit;
  color: inherit;
}

.notif-pill {
  display: inline;
  font-weight: 700;
  font-size: 0.78em;
  letter-spacing: 0.03em;
  padding: 0.12em 0.4em;
  border-radius: 6px;
  margin-right: 0.12em;
  white-space: nowrap;
}

.notif-pill-critical {
  background: #f8dede;
  color: #b42318;
  border: 1px solid #fca5a5;
}
.notif-pill-high {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #efb7b1;
}
.notif-pill-medium {
  background: #fef3c7;
  color: #b45309;
  border: 1px solid #fcd34d;
}
.notif-pill-low {
  background: #ccfbf1;
  color: #0f766e;
  border: 1px solid #5eead4;
}

.notif-accent-teal {
  font-weight: 700;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.1);
  padding: 0.05em 0.28em;
  border-radius: 4px;
}
.notif-accent-due {
  font-weight: 700;
  color: #241447;
  background: rgba(36, 20, 71, 0.08);
  padding: 0.05em 0.35em;
  border-radius: 6px;
  border: 1px solid rgba(36, 20, 71, 0.12);
}
.notif-accent-urgent {
  font-weight: 700;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.12);
  padding: 0.05em 0.28em;
  border-radius: 4px;
}
.notif-accent-overdue {
  font-weight: 700;
  color: #b91c1c;
  background: rgba(220, 38, 38, 0.1);
  padding: 0.05em 0.28em;
  border-radius: 4px;
}

.notif-time {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(36, 20, 71, 0.45);
}

.notif-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #b42318;
  color: #fff;
  font-size: 10px;
  line-height: 16px;
  font-weight: 700;
  text-align: center;
}
</style>
