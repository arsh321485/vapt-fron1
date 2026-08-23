export interface AssetTypeFilter {
  key: string;
  label: string;
  assetType: string;
}

export const ASSET_TYPE_FILTERS: AssetTypeFilter[];

export function normalizeAssetType(value: unknown): string;
export function assetTypeFromFilterKey(filterKey: unknown): string;
export function uiTypeFromAssetType(assetType: unknown): string;
export function filterAssetsByType<T extends Record<string, any>>(
  assets: T[] | null | undefined,
  filterKey: unknown,
): T[];
export function extractAssetRows(payload: unknown): Record<string, any>[];
export function getAssetHostName(asset: Record<string, any> | null | undefined): string;
export function inferAssetType(asset: Record<string, any> | null | undefined): string;
export function resolveAssetType(asset: Record<string, any> | null | undefined): string;
export function getAssetOs(asset: Record<string, any> | null | undefined): string;
export function getAssetResolvedIp(asset: Record<string, any> | null | undefined): string;
