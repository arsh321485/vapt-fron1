import type { ComponentOptions } from "vue";

export function notifyLiveData(reason?: string): void;
export function isUnsafeToLiveRefresh(opts?: { source?: string }): boolean;
export const livePageSyncMixin: ComponentOptions;
