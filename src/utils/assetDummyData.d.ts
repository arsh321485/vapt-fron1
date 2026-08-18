export interface AssetTypeFilter {
  key: string;
  label: string;
  assetType: string;
}

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType(assets: unknown, filterKey: unknown): any[];
export function extractAssetRows(payload: unknown): any[];
export function getAssetHostName(asset: unknown): string;
export function inferAssetType(asset: unknown): string;
export function resolveAssetType(asset: unknown): string;
export function getAssetOs(asset: unknown): string;
export function getAssetResolvedIp(asset: unknown): string;
