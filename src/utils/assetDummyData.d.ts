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

export interface AssetTypeCountChip extends AssetTypeDisplay {
  count: number;
}

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];
export const ASSET_TYPE_DISPLAY: AssetTypeDisplay[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType(
  assets: unknown,
  filterKey: unknown,
): Record<string, unknown>[];
export function extractAssetRows(payload: unknown): unknown[];
export function getAssetHostName(asset: unknown): string;
export function getRowScanHost(row: unknown): string;
export function isPlatformLabelHost(name: unknown): boolean;
export function isRealScanHost(name: unknown): boolean;
export function collectScanHosts(row: unknown): string[];
export function filterPlatformLabelAssetRows(rows: unknown): unknown[];
export function filterPlatformLabelVulnRows(rows: unknown): Record<string, unknown>[];
export function sanitizeTeamHostPayload(data: unknown): unknown;
export function inferAssetType(asset: unknown): string;
export function resolveAssetType(asset: unknown): string;
export function getAssetOs(asset: unknown): string;
export function getAssetResolvedIp(asset: unknown): string;
export function assetMatchesQueryHost(asset: unknown, host: unknown): boolean;
export function findAssetByQueryHost(assets: unknown, host: unknown): unknown;
export function tabKeyForAsset(asset: unknown): string;
export function normalizeAssetTypeCounts(raw: unknown): AssetTypeCounts;
export function hasAssetTypeCounts(raw: unknown): boolean;
export function assetTypeCountChips(raw: unknown): AssetTypeCountChip[];
export function assetTypeCountForFilter(raw: unknown, filterKey: unknown): number;
export function assetTypeBadgeMeta(assetType: unknown): AssetTypeDisplay | null;
export function resolveHostAssetType(
  hostName: unknown,
  catalog?: unknown,
  extra?: unknown,
): string;
