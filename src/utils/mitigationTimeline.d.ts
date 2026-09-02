export function parseDurationToDays(value: unknown): number | null;
export function unwrapSummaryPayload(raw: unknown): any;
export function extractMitigationTimeline(payload: unknown): any;
export function timelineHasValues(timeline: unknown): boolean;
export function resolveMitigationDays(sevData: unknown, criteriaValue: unknown): number | null;
export function resolveMitigationLabel(
  sevData: unknown,
  days: number | null,
  formatTimeline: (opts: { days: number | null }) => string,
): string;
export function extractRiskCriteriaRecord(payload: unknown): any;
