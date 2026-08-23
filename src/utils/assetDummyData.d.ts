export interface AssetTypeFilter {
  key: string;
  label: string;
  assetType: string;
}

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType<T = Record<string, unknown>>(
  assets: T[] | null | undefined,
  filterKey: unknown,
): T[];
export function extractAssetRows(payload: unknown): Record<string, unknown>[];
export function getAssetHostName(asset: Record<string, unknown> | null | undefined): string;
export function inferAssetType(asset: Record<string, unknown> | null | undefined): string;
export function resolveAssetType(asset: Record<string, unknown> | null | undefined): string;
export function getAssetOs(asset: Record<string, unknown> | null | undefined): string;
export function getAssetResolvedIp(asset: Record<string, unknown> | null | undefined): string;
export function assetMatchesQueryHost(
  asset: Record<string, unknown> | null | undefined,
  host: unknown,
): boolean;
export function findAssetByQueryHost<T = Record<string, unknown>>(
  assets: T[] | null | undefined,
  host: unknown,
): T | null;
export function tabKeyForAsset(asset: Record<string, unknown> | null | undefined): string;
export function enrichAssetsWithVulnTypes<T = Record<string, unknown>>(
  assets: T[] | null | undefined,
  registerRows: Record<string, unknown>[] | null | undefined,
): T[];
