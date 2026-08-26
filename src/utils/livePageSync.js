const EVENT = "vaptfix:live-refresh";
const CHANNEL = "vaptfix-live-sync";
const INTERVAL_MS = 8000;

let channel = null;
let debounceTimer = null;

export function notifyLiveData(reason = "mutation") {
  if (typeof window === "undefined") return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const detail = { reason, at: Date.now() };
    try {
      window.dispatchEvent(new CustomEvent(EVENT, { detail }));
    } catch {
      /* ignore */
    }
    try {
      if (!channel) channel = new BroadcastChannel(CHANNEL);
      channel.postMessage(detail);
    } catch {
      /* ignore */
    }
  }, 200);
}

export function isUnsafeToLiveRefresh() {
  if (typeof document === "undefined") return true;
  if (document.hidden) return true;
  const ae = document.activeElement;
  if (ae) {
    const tag = String(ae.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || ae.isContentEditable) {
      return true;
    }
  }
  if (document.querySelector(".swal2-container")) return true;
  if (document.querySelector(".modal.show, .modal.d-block")) return true;
  return false;
}

function bindLiveRefresh(handler) {
  const onEvent = () => handler();
  window.addEventListener(EVENT, onEvent);
  let ch = null;
  try {
    ch = new BroadcastChannel(CHANNEL);
    ch.onmessage = () => handler();
  } catch {
    /* ignore */
  }
  const onVis = () => {
    if (!document.hidden) handler();
  };
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("focus", onVis);
  const timer = setInterval(() => handler(), INTERVAL_MS);
  return () => {
    window.removeEventListener(EVENT, onEvent);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("focus", onVis);
    clearInterval(timer);
    try {
      ch?.close();
    } catch {
      /* ignore */
    }
  };
}

export const livePageSyncMixin = {
  mounted() {
    if (typeof this.liveRefreshPage !== "function") return;
    if (this._vaptLiveUnbind) return;
    this._vaptLiveActive = true;
    this._vaptLiveUnbind = bindLiveRefresh(() => {
      if (this._vaptLiveActive === false) return;
      if (isUnsafeToLiveRefresh()) return;
      if (this._vaptLiveBusy) return;
      this._vaptLiveBusy = true;
      Promise.resolve(this.liveRefreshPage())
        .catch(() => {})
        .finally(() => {
          this._vaptLiveBusy = false;
        });
    });
  },
  activated() {
    this._vaptLiveActive = true;
    if (typeof this.liveRefreshPage !== "function") return;
    if (isUnsafeToLiveRefresh()) return;
    Promise.resolve(this.liveRefreshPage()).catch(() => {});
  },
  deactivated() {
    this._vaptLiveActive = false;
  },
  beforeUnmount() {
    this._vaptLiveActive = false;
    if (this._vaptLiveUnbind) {
      this._vaptLiveUnbind();
      this._vaptLiveUnbind = null;
    }
  },
};
