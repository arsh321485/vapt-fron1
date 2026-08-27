export function parseDurationToDays(value: unknown): number | null;
export function unwrapSummaryPayload(raw: unknown): any;
export function extractMitigationTimeline(payload: unknown): any;
export function timelineHasValues(timeline: unknown): boolean;
export function resolveMitigationDays(sevData: unknown, criteriaValue: unknown): number | null;
export function resolveMitigationLabel(
  sevData: unknown,
  days: unknown,
  formatTimeline: (input: { days: unknown }) => string,
): string;
export function extractRiskCriteriaRecord(payload: unknown): any;
