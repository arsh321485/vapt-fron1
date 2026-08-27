export function notifyLiveData(reason?: string): void;
export function isUnsafeToLiveRefresh(): boolean;

export const livePageSyncMixin: {
  mounted(): void;
  activated(): void;
  deactivated(): void;
  beforeUnmount(): void;
};
