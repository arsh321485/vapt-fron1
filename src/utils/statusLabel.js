/**
 * Display label for vulnerability / ticket status values.
 * Always returns title case: Open, Closed, In Progress.
 */
export function formatStatusLabel(status) {
  const raw = String(status || '').trim();
  if (!raw) return '-';
  const s = raw.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (s === 'in progress' || s === 'inprogress') return 'In Progress';
  if (s === 'open/review' || s === 'open review') return 'Open/Review';
  if (s === 'open') return 'Open';
  if (s === 'closed' || s === 'close' || s === 'resolved' || s === 'fixed') return 'Closed';
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}
