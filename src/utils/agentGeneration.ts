/** Persist in-flight scan-report agent generation across refresh and re-login. */

const STORAGE_KEY = "vaptfix_agent_generation";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

const IN_PROGRESS_STATUSES = new Set([
  "processing",
  "generating",
  "in_progress",
  "pending",
  "queued",
  "creating",
  "creating_agents",
  "running",
]);

export type PersistedAgentGeneration = {
  email: string;
  reportIds: string[];
  startedAt: number;
};

function normalizeEmail(email?: string | null): string {
  return String(email || "").trim().toLowerCase();
}

function uniqueIds(ids: unknown): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  (Array.isArray(ids) ? ids : []).forEach((raw) => {
    const id = String(raw || "").trim();
    if (!id || seen.has(id)) return;
    seen.add(id);
    out.push(id);
  });
  return out;
}

function readRaw(): PersistedAgentGeneration | null {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (!raw) continue;
      const parsed = JSON.parse(raw);
      const reportIds = uniqueIds(parsed?.reportIds);
      const email = normalizeEmail(parsed?.email);
      const startedAt = Number(parsed?.startedAt) || 0;
      if (!reportIds.length) continue;
      return { email, reportIds, startedAt };
    } catch {
      /* ignore */
    }
  }
  return null;
}

function writeRaw(payload: PersistedAgentGeneration) {
  const json = JSON.stringify(payload);
  try {
    sessionStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* ignore */
  }
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* ignore */
  }
}

export function persistAgentGeneration(email: string, reportIds: unknown) {
  const ids = uniqueIds(reportIds);
  if (!ids.length) return;
  writeRaw({
    email: normalizeEmail(email),
    reportIds: ids,
    startedAt: Date.now(),
  });
}

export function readPersistedAgentGeneration(email?: string): PersistedAgentGeneration | null {
  const saved = readRaw();
  if (!saved) return null;
  if (saved.startedAt && Date.now() - saved.startedAt > MAX_AGE_MS) {
    clearPersistedAgentGeneration();
    return null;
  }
  const now = normalizeEmail(email);
  if (now && saved.email && saved.email !== now) return null;
  return saved;
}

export function clearPersistedAgentGeneration() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function isAgentGenerationInProgress(data: unknown): boolean {
  if (!data || typeof data !== "object") return false;
  const row = data as Record<string, unknown>;
  if (row.cards_generating === true || row.generating === true) return true;

  const status = String(
    row.status || row.upload_status || row.state || row.generation_status || "",
  )
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (IN_PROGRESS_STATUSES.has(status)) return true;

  const total = Number(row.cards_total) || 0;
  const generated = Number(row.cards_generated) || 0;
  return total > 0 && generated < total;
}
