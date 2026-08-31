import type { ComponentOptions } from "vue";

export function notifyLiveData(reason?: string): void;
export function isUnsafeToLiveRefresh(): boolean;
export const livePageSyncMixin: ComponentOptions;
