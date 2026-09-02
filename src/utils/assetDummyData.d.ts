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

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];
export const API_ASSET_TYPES: string[];
export const ASSET_TYPE_DISPLAY: AssetTypeDisplay[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType(assets: unknown, filterKey: unknown): any[];
export function extractAssetRows(payload: unknown): any[];
export function getAssetHostName(asset: unknown): string;
export function extractIpAddress(name: unknown): string;
export function countUniqueIpHosts(rows: unknown): number;
export function getRowScanHost(row: unknown): string;
export function isPlatformLabelHost(name: unknown): boolean;
export function isRealScanHost(name: unknown): boolean;
export function collectScanHosts(row: unknown): string[];
export function filterPlatformLabelAssetRows(rows: unknown): any[];
export function filterPlatformLabelVulnRows(rows: unknown): any[];
export function sanitizeTeamHostPayload(data: unknown): any;
export function inferAssetType(asset: unknown): string;
export function resolveAssetType(asset: unknown): string;
export function getAssetOs(asset: unknown): string;
export function getAssetResolvedIp(asset: unknown): string;
export function assetMatchesQueryHost(asset: unknown, host: unknown): boolean;
export function findAssetByQueryHost(assets: unknown, host: unknown): any;
export function tabKeyForAsset(asset: unknown): string;
export function normalizeAssetTypeCounts(raw: unknown): AssetTypeCounts;
export function hasAssetTypeCounts(raw: unknown): boolean;
export function assetTypeCountChips(raw: unknown): Array<AssetTypeDisplay & { count: number }>;
export function assetTypeCountForFilter(raw: unknown, filterKey: unknown): number;
export function assetTypeBadgeMeta(assetType: unknown): AssetTypeDisplay | null;
export function resolveHostAssetType(
  hostName: unknown,
  catalog?: unknown,
  extra?: unknown,
): string;
export function heldVulnTypeKey(pluginName: unknown, hostName: unknown): string;
export function loadHeldItemTypeMap(): Record<string, string>;
export function persistHeldItemTypeMap(map: unknown): void;
export function stampHeldItemAssetType(
  map: unknown,
  pluginName: unknown,
  hostName: unknown,
  assetType: unknown,
  options?: { overwrite?: boolean },
): Record<string, string>;
export function clearHeldItemAssetType(
  map: unknown,
  pluginName: unknown,
  hostName: unknown,
): Record<string, string>;
export function mergeHostAssetTypeMap(map: unknown, rows: unknown): Record<string, string>;
export function heldItemAssetType(
  held: unknown,
  hostTypeMap?: unknown,
  catalog?: unknown,
): string;
