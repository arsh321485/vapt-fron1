export interface AssetTypeFilter {
  key: string;
  label: string;
  assetType: string;
}

export interface AssetTypeDisplay {
  type: string;
  ui: string;
  code: string;
  label: string;
  emoji: string;
}

export interface AssetTypeCounts {
  server: number;
  web_app: number;
  firewall: number;
  other: number;
}

export type AssetTypeCountChip = AssetTypeDisplay & { count: number };

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];
export const ASSET_TYPE_DISPLAY: AssetTypeDisplay[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType<T>(assets: T[] | null | undefined, filterKey: unknown): T[];
export function extractAssetRows(payload: unknown): Record<string, unknown>[];
export function getAssetHostName(asset: Record<string, unknown> | null | undefined): string;
export function getRowScanHost(row: Record<string, unknown> | null | undefined): string;
export function isPlatformLabelHost(name: unknown): boolean;
export function isRealScanHost(name: unknown): boolean;
export function collectScanHosts(row: Record<string, unknown> | null | undefined): string[];
export function filterPlatformLabelAssetRows<T>(rows: T[] | null | undefined): T[];
export function filterPlatformLabelVulnRows<T>(rows: T[] | null | undefined): T[];
export function sanitizeTeamHostPayload<T>(data: T): T;
export function inferAssetType(asset: Record<string, unknown> | null | undefined): string;
export function resolveAssetType(asset: Record<string, unknown> | null | undefined): string;
export function getAssetOs(asset: Record<string, unknown> | null | undefined): string;
export function getAssetResolvedIp(asset: Record<string, unknown> | null | undefined): string;
export function assetMatchesQueryHost(
  asset: Record<string, unknown> | null | undefined,
  host: unknown,
): boolean;
export function findAssetByQueryHost<T extends Record<string, unknown>>(
  assets: T[] | null | undefined,
  host: unknown,
): T | null;
export function tabKeyForAsset(asset: Record<string, unknown> | null | undefined): string;
export function normalizeAssetTypeCounts(raw: unknown): AssetTypeCounts;
export function hasAssetTypeCounts(raw: unknown): boolean;
export function assetTypeCountChips(raw: unknown): AssetTypeCountChip[];
export function assetTypeCountForFilter(raw: unknown, filterKey: unknown): number;
export function assetTypeBadgeMeta(assetType: unknown): AssetTypeDisplay | null;
export function resolveHostAssetType(
  hostName: unknown,
  catalog?: Record<string, unknown>[] | null,
  extra?: Record<string, unknown> | null,
): string;
