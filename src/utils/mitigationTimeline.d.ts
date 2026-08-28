export function parseDurationToDays(value: unknown): number | null;
export function unwrapSummaryPayload(raw: unknown): Record<string, any>;
export function extractMitigationTimeline(
  payload: unknown,
): Record<string, any> | null;
export function timelineHasValues(timeline: unknown): boolean;
export function resolveMitigationDays(sevData: unknown, criteriaValue?: unknown): number | null;
export function resolveMitigationLabel(
  sevData: unknown,
  days: unknown,
  formatTimeline: (opts: { days: unknown }) => string,
): string;
export function extractRiskCriteriaRecord(payload: unknown): Record<string, any> | null;
