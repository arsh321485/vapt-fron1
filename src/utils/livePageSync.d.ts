import type { ComponentOptionsMixin } from "vue";

export const LIVE_PAGE_POLL_MS: number;

export function stopLivePageSync(): void;

export function notifyLiveData(reason?: string): void;

export function isUnsafeToLiveRefresh(opts?: { source?: string }): boolean;

export const livePageSyncMixin: ComponentOptionsMixin;
