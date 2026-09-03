import {
  parseClaimInviteValidate,
  setClaimInviteReportCount,
  setClaimInviteValid,
  storeClaimInviteToken,
} from "@/utils/claimInvite";

/** MAGIC_LINK_FRONTEND_INTEGRATION.md primary path */
const VALIDATE_PATH_PRIMARY = "/api/admin/report-invite/validate/";
/** Legacy path still used by older deployments */
const VALIDATE_PATH_LEGACY = "/api/admin/upload_report/claim-invite/validate/";

/**
 * Public GET — peek only (does not consume the invite).
 * Tries new `invite_token` param first, then legacy `invite` param / path.
 */
export async function fetchClaimInviteValidate(invite: string): Promise<{
  status: boolean;
  valid: boolean;
  expired: boolean;
  report_count: number;
  data: Record<string, unknown>;
}> {
  const token = String(invite || "").trim();
  if (!token) {
    return { status: false, valid: false, expired: false, report_count: 0, data: {} };
  }
  storeClaimInviteToken(token);

  const { default: endpoint } = await import("./apiServices");

  const attempts: Array<{ path: string; params: Record<string, string> }> = [
    { path: VALIDATE_PATH_PRIMARY, params: { invite_token: token } },
    { path: VALIDATE_PATH_PRIMARY, params: { invite: token } },
    { path: VALIDATE_PATH_LEGACY, params: { invite_token: token } },
    { path: VALIDATE_PATH_LEGACY, params: { invite: token } },
  ];

  let lastError: any = null;
  for (const attempt of attempts) {
    try {
      const res = await endpoint.get(attempt.path, { params: attempt.params });
      const parsed = parseClaimInviteValidate(res.data, res.status);
      setClaimInviteValid(!parsed.expired);
      if (!parsed.expired) setClaimInviteReportCount(parsed.report_count || 1);
      return {
        status: true,
        valid: parsed.valid || !parsed.expired,
        expired: parsed.expired,
        report_count: parsed.expired ? 0 : parsed.report_count || 1,
        data: (res.data && typeof res.data === "object" ? res.data : {}) as Record<string, unknown>,
      };
    } catch (error: any) {
      lastError = error;
      const status = error?.response?.status;
      // 404 on this path → try next candidate. Other errors may still carry expiry info.
      if (status === 404) continue;
      const data = error?.response?.data || {};
      const parsed = parseClaimInviteValidate(data, status);
      // Explicit expiry/invalid from a live endpoint — stop here.
      if (parsed.expired || status === 410) {
        setClaimInviteValid(false);
        setClaimInviteReportCount(0);
        return {
          status: false,
          valid: false,
          expired: true,
          report_count: 0,
          data,
        };
      }
      if (status && status >= 400 && status < 500 && status !== 404) {
        setClaimInviteValid(!parsed.expired);
        if (!parsed.expired) setClaimInviteReportCount(parsed.report_count || 1);
        return {
          status: false,
          valid: parsed.valid || !parsed.expired,
          expired: parsed.expired,
          report_count: parsed.expired ? 0 : parsed.report_count || 1,
          data,
        };
      }
    }
  }

  const data = lastError?.response?.data || {};
  const parsed = parseClaimInviteValidate(data, lastError?.response?.status);
  setClaimInviteValid(!parsed.expired);
  if (!parsed.expired) setClaimInviteReportCount(parsed.report_count || 1);
  return {
    status: false,
    valid: parsed.valid || !parsed.expired,
    expired: parsed.expired,
    report_count: parsed.expired ? 0 : parsed.report_count || 1,
    data,
  };
}
