export interface AssetTypeFilter {
  key: string;
  label: string;
  assetType: string;
}

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];

export function normalizeAssetType(value?: any): string;
export function assetTypeFromFilterKey(filterKey?: any): string;
export function uiTypeFromAssetType(assetType?: any): string;
export function filterAssetsByType(assets?: any, filterKey?: any): any[];
export function extractAssetRows(payload?: any): any[];
export function getAssetHostName(asset?: any): string;
export function inferAssetType(asset?: any): string;
export function resolveAssetType(asset?: any): string;
export function getAssetOs(asset?: any): string;
export function getAssetResolvedIp(asset?: any): string;
export function assetMatchesQueryHost(asset?: any, host?: any): boolean;
export function findAssetByQueryHost(assets?: any, host?: any): any;
export function tabKeyForAsset(asset?: any): string;
export function enrichAssetsWithVulnTypes(assets?: any, registerRows?: any): any[];
export function resolveHostAssetType(hostName?: any, catalog?: any, extra?: any): string;
