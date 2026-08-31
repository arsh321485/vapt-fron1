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
export const ASSET_TYPE_DISPLAY: AssetTypeDisplay[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType(assets: any, filterKey: unknown): any[];
export function extractAssetRows(payload: unknown): any[];
export function getAssetHostName(asset: any): string;
export function extractIpAddress(name: unknown): string;
export function countUniqueIpHosts(rows: unknown): number;
export function getRowScanHost(row: any): string;
export function isPlatformLabelHost(name: unknown): boolean;
export function isRealScanHost(name: unknown): boolean;
export function collectScanHosts(row: any): string[];
export function filterPlatformLabelAssetRows(rows: any): any[];
export function filterPlatformLabelVulnRows(rows: any): any[];
export function sanitizeTeamHostPayload(data: any): any;
export function inferAssetType(asset: any): string;
export function resolveAssetType(asset: any): string;
export function getAssetOs(asset: any): string;
export function getAssetResolvedIp(asset: any): string;
export function assetMatchesQueryHost(asset: any, host: unknown): boolean;
export function findAssetByQueryHost(assets: any, host: unknown): any;
export function tabKeyForAsset(asset: any): string;
export function normalizeAssetTypeCounts(raw: unknown): AssetTypeCounts;
export function hasAssetTypeCounts(raw: unknown): boolean;
export function assetTypeCountChips(raw: unknown): Array<AssetTypeDisplay & { count: number }>;
export function assetTypeCountForFilter(raw: unknown, filterKey: unknown): number;
export function assetTypeBadgeMeta(assetType: unknown): AssetTypeDisplay | null;
export function resolveHostAssetType(hostName: unknown, catalog?: any[], extra?: any): string;
