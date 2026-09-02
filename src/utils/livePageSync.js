const EVENT = "vaptfix:live-refresh";
const CHANNEL = "vaptfix-live-sync";
const INTERVAL_MS = 2000;
const TYPING_GUARD_MS = 800;

const livePages = new Set();
let channel = null;
let debounceTimer = null;
let globalTimer = null;
let lastTypingAt = 0;

function noteTyping(event) {
  const target = event?.target;
  if (!target || typeof target.tagName !== "string") return;
  const tag = target.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || target.isContentEditable) {
    lastTypingAt = Date.now();
  }
}

if (typeof document !== "undefined") {
  document.addEventListener("keydown", noteTyping, true);
  document.addEventListener("input", noteTyping, true);
}

function ensureChannel() {
  if (channel || typeof BroadcastChannel === "undefined") return channel;
  try {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = () => flushLivePages({ source: "mutation" });
  } catch {
    channel = null;
  }
  return channel;
}

function startGlobalTimer() {
  if (globalTimer || typeof window === "undefined") return;
  globalTimer = window.setInterval(() => flushLivePages({ source: "poll" }), INTERVAL_MS);
}

function stopGlobalTimerIfIdle() {
  if (livePages.size || !globalTimer) return;
  clearInterval(globalTimer);
  globalTimer = null;
}

function runPage(vm, opts = {}) {
  if (!vm || vm._vaptLiveActive === false) return;
  if (typeof vm.liveRefreshPage !== "function") return;
  if (isUnsafeToLiveRefresh(opts)) return;
  if (vm._vaptLiveBusy) return;
  vm._vaptLiveBusy = true;
  const watchdog = setTimeout(() => {
    vm._vaptLiveBusy = false;
  }, 20000);
  Promise.resolve(vm.liveRefreshPage())
    .catch(() => {})
    .finally(() => {
      clearTimeout(watchdog);
      vm._vaptLiveBusy = false;
    });
}

function flushLivePages(opts = {}) {
  livePages.forEach((vm) => runPage(vm, opts));
}

export function notifyLiveData(reason = "mutation") {
  if (typeof window === "undefined") return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    const detail = { reason, at: Date.now(), source: "mutation" };
    try {
      window.dispatchEvent(new CustomEvent(EVENT, { detail }));
    } catch {
      /* ignore */
    }
    try {
      ensureChannel()?.postMessage(detail);
    } catch {
      /* ignore */
    }
    flushLivePages({ source: "mutation" });
  }, 30);
}

export function isUnsafeToLiveRefresh({ source = "poll" } = {}) {
  if (typeof document === "undefined") return true;
  if (document.hidden) return true;
  if (source === "mutation" || source === "focus") return false;
  if (Date.now() - lastTypingAt < TYPING_GUARD_MS) return true;
  if (document.querySelector(".swal2-container")) return true;
  return false;
}

function registerLivePage(vm) {
  livePages.add(vm);
  ensureChannel();
  startGlobalTimer();
  if (typeof window !== "undefined" && !registerLivePage._windowBound) {
    registerLivePage._windowBound = true;
    window.addEventListener(EVENT, () => flushLivePages({ source: "mutation" }));
    const onVis = () => {
      if (!document.hidden) flushLivePages({ source: "focus" });
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("focus", onVis);
  }
}

function unregisterLivePage(vm) {
  livePages.delete(vm);
  stopGlobalTimerIfIdle();
}

export const livePageSyncMixin = {
  mounted() {
    if (typeof this.liveRefreshPage !== "function") return;
    if (this._vaptLiveRegistered) return;
    this._vaptLiveActive = true;
    this._vaptLiveRegistered = true;
    registerLivePage(this);
  },
  activated() {
    this._vaptLiveActive = true;
    if (typeof this.liveRefreshPage !== "function") return;
    runPage(this, { source: "focus" });
  },
  deactivated() {
    this._vaptLiveActive = false;
  },
  beforeUnmount() {
    this._vaptLiveActive = false;
    if (this._vaptLiveRegistered) {
      unregisterLivePage(this);
      this._vaptLiveRegistered = false;
    }
  },
};
