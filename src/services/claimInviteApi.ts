import {
  parseClaimInviteValidate,
  setClaimInviteReportCount,
  setClaimInviteValid,
} from "@/utils/claimInvite";

const VALIDATE_PATH = "/api/admin/upload_report/claim-invite/validate/";

/**
 * Public GET — same `endpoint` as send-otp / verify-otp so Network always
 * shows the request on the real API host (Vite proxy in DEV, VITE_API_BASE_URL in prod).
 * Lazy-import avoids router ↔ apiServices import cycles.
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
  try {
    const { default: endpoint } = await import("./apiServices");
    const res = await endpoint.get(VALIDATE_PATH, { params: { invite: token } });
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
    const data = error?.response?.data || {};
    const parsed = parseClaimInviteValidate(data, error?.response?.status);
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
