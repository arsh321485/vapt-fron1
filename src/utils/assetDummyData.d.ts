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

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: string): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType(assets: unknown, filterKey: string): Record<string, unknown>[];
export function extractAssetRows(payload: unknown): Record<string, unknown>[];
export function getAssetHostName(asset: Record<string, unknown> | null | undefined): string;
export function extractIpAddress(name: unknown): string;
export function countUniqueIpHosts(rows: unknown): number;
export function getRowScanHost(row: Record<string, unknown> | null | undefined): string;
export function isPlatformLabelHost(name: unknown): boolean;
export function isRealScanHost(name: unknown): boolean;
export function collectScanHosts(row: Record<string, unknown> | null | undefined): string[];
export function filterPlatformLabelAssetRows(rows: unknown): Record<string, unknown>[];
export function filterPlatformLabelVulnRows(rows: unknown): Record<string, unknown>[];
export function sanitizeTeamHostPayload(data: unknown): unknown;
export function inferAssetType(asset: Record<string, unknown> | null | undefined): string;
export function resolveAssetType(asset: Record<string, unknown> | null | undefined): string;
export function getAssetOs(asset: Record<string, unknown> | null | undefined): string;
export function getAssetResolvedIp(asset: Record<string, unknown> | null | undefined): string;
export function assetMatchesQueryHost(asset: Record<string, unknown> | null | undefined, host: unknown): boolean;
export function findAssetByQueryHost(
  assets: unknown,
  host: unknown,
): Record<string, unknown> | null;
export function tabKeyForAsset(asset: Record<string, unknown> | null | undefined): string;
export const ASSET_TYPE_DISPLAY: AssetTypeDisplay[];
export function normalizeAssetTypeCounts(raw: unknown): AssetTypeCounts;
export function hasAssetTypeCounts(raw: unknown): boolean;
export function assetTypeCountChips(raw: unknown): Array<AssetTypeDisplay & { count: number }>;
export function assetTypeCountForFilter(raw: unknown, filterKey: string): number;
export function assetTypeBadgeMeta(assetType: unknown): AssetTypeDisplay | null;
export function resolveHostAssetType(
  hostName: unknown,
  catalog?: unknown,
  extra?: Record<string, unknown> | null,
): string;
export function heldVulnTypeKey(pluginName: unknown, hostName: unknown): string;
export function loadHeldItemTypeMap(): Record<string, string>;
export function persistHeldItemTypeMap(map: Record<string, string>): void;
export function stampHeldItemAssetType(
  map: Record<string, string>,
  pluginName: unknown,
  hostName: unknown,
  assetType: unknown,
  options?: { overwrite?: boolean },
): Record<string, string>;
export function clearHeldItemAssetType(
  map: Record<string, string>,
  pluginName: unknown,
  hostName: unknown,
): Record<string, string>;
export function mergeHostAssetTypeMap(
  map: Record<string, string>,
  rows: unknown,
): Record<string, string>;
export function heldItemAssetType(
  held: Record<string, unknown> | null | undefined,
  hostTypeMap?: Record<string, string>,
  _catalog?: unknown,
): string;
