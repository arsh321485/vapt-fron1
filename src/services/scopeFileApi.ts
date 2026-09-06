import endpoint from "./apiServices";

/**
 * Scope-file → Super Admin analysis (frontend contract).
 *
 * Wire these when backend is ready:
 *   POST /api/admin/scope/submit-for-analysis/   multipart `file`
 *   GET  /api/admin/scope/analysis-status/
 *
 * Expected status payload:
 *   {
 *     status: "pending" | "ready",
 *     has_report?: boolean,
 *     asset_count?: number,
 *     email?: string
 *   }
 */

export type ScopeAnalysisStatus = {
  status: "pending" | "pending_superadmin_review" | "ready" | string;
  has_report?: boolean;
  asset_count?: number;
  email?: string;
  message?: string;
  [key: string]: unknown;
};

function isMissingEndpoint(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return status === 404 || status === 405;
}

/** POST scope file for Super Admin review. Returns fallback:true if the endpoint is not live yet. */
export async function submitScopeFileForAnalysis(file: File): Promise<{
  ok: boolean;
  fallback: boolean;
  data?: Record<string, unknown>;
  message?: string;
}> {
  try {
    const form = new FormData();
    form.append("file", file);
    const res = await endpoint.post("/api/admin/scope/submit-for-analysis/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, fallback: false, data: (res.data || {}) as Record<string, unknown> };
  } catch (error: unknown) {
    if (isMissingEndpoint(error)) {
      return { ok: false, fallback: true };
    }
    const err = error as { response?: { data?: { detail?: string; message?: string; error?: string } }; message?: string };
    const data = err?.response?.data;
    return {
      ok: false,
      fallback: false,
      message: data?.detail || data?.message || data?.error || err?.message || "Failed to submit scope file",
    };
  }
}

/** GET whether Super Admin has uploaded the processed scan for this account. */
export async function fetchScopeAnalysisStatus(): Promise<ScopeAnalysisStatus | null> {
  try {
    const res = await endpoint.get("/api/admin/scope/analysis-status/");
    const data = (res.data || {}) as ScopeAnalysisStatus;
    return data && typeof data === "object" ? data : null;
  } catch (error: unknown) {
    if (isMissingEndpoint(error)) return null;
    return null;
  }
}

export function isPendingSuperadminReview(payload: unknown): boolean {
  if (payload == null) return false;
  if (typeof payload === "string") {
    const state = payload.toLowerCase();
    return (
      state === "pending_superadmin_review" ||
      state === "pending_review" ||
      state === "pending"
    );
  }
  if (typeof payload !== "object") return false;
  const row = payload as Record<string, unknown>;
  const nested = row.data && typeof row.data === "object" ? (row.data as Record<string, unknown>) : row;
  return isPendingSuperadminReview(String(nested.status || nested.state || ""));
}

export function isScopeAnalysisReady(status: ScopeAnalysisStatus | null | undefined): boolean {
  if (!status) return false;
  const state = String(status.status || "").toLowerCase();
  if (isPendingSuperadminReview(state)) return false;
  return state === "ready" || status.has_report === true;
}
