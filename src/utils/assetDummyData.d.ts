export const ASSET_TYPE_FILTERS: Array<{
  key: string;
  label: string;
  assetType: string;
}>;

export const API_ASSET_TYPES: string[];

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

export const ASSET_TYPE_DISPLAY: Array<{
  key: string;
  label: string;
  assetType: string;
}>;

export function normalizeAssetTypeCounts(raw: unknown): any;
export function hasAssetTypeCounts(raw: unknown): boolean;
export function assetTypeCountChips(raw: unknown): any[];
export function assetTypeCountForFilter(raw: unknown, filterKey: unknown): number;
export function assetTypeBadgeMeta(assetType: unknown): any;
export function resolveHostAssetType(
  hostName: unknown,
  catalog?: unknown[],
  extra?: unknown,
): string;
export function heldVulnTypeKey(pluginName: unknown, hostName: unknown): string;
export function loadHeldItemTypeMap(): any;
export function persistHeldItemTypeMap(map: unknown): void;
export function stampHeldItemAssetType(
  map: unknown,
  pluginName: unknown,
  hostName: unknown,
  assetType: unknown,
  options?: unknown,
): any;
export function clearHeldItemAssetType(
  map: unknown,
  pluginName: unknown,
  hostName: unknown,
): any;
export function mergeHostAssetTypeMap(map: unknown, rows: unknown): any;
export function heldItemAssetType(
  held: unknown,
  hostTypeMap?: unknown,
  _catalog?: unknown,
): string;
