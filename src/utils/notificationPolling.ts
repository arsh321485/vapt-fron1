import { useAuthStore } from "@/stores/authStore";

export const NOTIFICATION_POLL_MS = 30000;

export type NotificationRecipientType = "admin" | "user";
type UnreadListener = (count: number) => void;

const listenersByType = new Map<NotificationRecipientType, Set<UnreadListener>>();
let pollTimer: ReturnType<typeof setInterval> | null = null;
let subscriberCount = 0;
const authBlockedTypes = new Set<NotificationRecipientType>();
const inflightByType = new Map<NotificationRecipientType, Promise<number | null>>();

function normalizeRecipientType(value: string): NotificationRecipientType {
  return value === "user" ? "user" : "admin";
}

function isAuthenticated(): boolean {
  const token =
    sessionStorage.getItem("authorization") ||
    localStorage.getItem("django_access_token") ||
    localStorage.getItem("authorization");
  return !!(token && token !== "null" && token !== "undefined");
}

function activeRecipientTypes(): NotificationRecipientType[] {
  const types: NotificationRecipientType[] = [];
  listenersByType.forEach((set, type) => {
    if (set.size > 0) types.push(type);
  });
  return types;
}

function notifyListeners(type: NotificationRecipientType, count: number) {
  listenersByType.get(type)?.forEach((listener) => {
    try {
      listener(count);
    } catch {
      /* ignore */
    }
  });
}

function markAuthBlocked(type: NotificationRecipientType, httpStatus?: number) {
  if (httpStatus === 401 || httpStatus === 403) {
    authBlockedTypes.add(type);
  }
}

async function fetchUnreadForType(type: NotificationRecipientType): Promise<number | null> {
  if (!isAuthenticated()) {
    stopNotificationPolling();
    return null;
  }
  if (authBlockedTypes.has(type)) return null;

  const existing = inflightByType.get(type);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const authStore = useAuthStore();
      const res =
        type === "user"
          ? await authStore.fetchUserUnreadNotificationCount()
          : await authStore.fetchAdminUnreadNotificationCount();

      if (res.status) {
        const count = Number(res.data?.unread_count || 0);
        notifyListeners(type, count);
        return count;
      }

      markAuthBlocked(type, res.httpStatus);
      return null;
    } catch (error: any) {
      markAuthBlocked(type, error?.response?.status);
      return null;
    } finally {
      inflightByType.delete(type);
    }
  })();

  inflightByType.set(type, promise);
  return promise;
}

async function pollTick() {
  if (!isAuthenticated()) {
    stopNotificationPolling();
    return;
  }
  const types = activeRecipientTypes();
  if (!types.length) {
    stopNotificationPolling();
    return;
  }
  await Promise.all(types.map((type) => fetchUnreadForType(type)));
}

function startNotificationPolling() {
  if (pollTimer) return;
  pollTimer = setInterval(() => {
    void pollTick();
  }, NOTIFICATION_POLL_MS);
}

export function stopNotificationPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  authBlockedTypes.clear();
  inflightByType.clear();
}

export function subscribeNotificationUnreadPolling(
  recipientType: string,
  listener: UnreadListener,
): () => void {
  const type = normalizeRecipientType(recipientType);
  if (!listenersByType.has(type)) listenersByType.set(type, new Set());
  listenersByType.get(type)!.add(listener);
  subscriberCount += 1;

  if (isAuthenticated() && !authBlockedTypes.has(type)) {
    void fetchUnreadForType(type);
  }
  startNotificationPolling();

  return () => {
    listenersByType.get(type)?.delete(listener);
    if (!listenersByType.get(type)?.size) {
      listenersByType.delete(type);
      authBlockedTypes.delete(type);
    }
    subscriberCount = Math.max(0, subscriberCount - 1);
    if (subscriberCount === 0) {
      stopNotificationPolling();
    }
  };
}

/** Explicit refresh (panel open / focus) — deduped, does not start duplicate timers. */
export function requestNotificationUnreadRefresh(
  recipientType: string,
): Promise<number | null> {
  const type = normalizeRecipientType(recipientType);
  if (!isAuthenticated()) return Promise.resolve(null);
  authBlockedTypes.delete(type);
  return fetchUnreadForType(type);
}
