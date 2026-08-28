import axios from "axios";
import {
  parseClaimInviteValidate,
  setClaimInviteReportCount,
  setClaimInviteValid,
} from "@/utils/claimInvite";

const BASE_URL = import.meta.env.DEV ? "" : import.meta.env.VITE_API_BASE_URL || "";

/**
 * Public GET — used from the router as well as signup UI.
 * Standalone axios (not apiServices) so /signup?invite= can validate
 * before navigation without a router ↔ interceptor cycle.
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
    const res = await axios.get(`${BASE_URL}/api/admin/upload_report/claim-invite/validate/`, {
      params: { invite: token },
    });
    const parsed = parseClaimInviteValidate(res.data, res.status);
    setClaimInviteValid(parsed.valid);
    if (parsed.valid) setClaimInviteReportCount(parsed.report_count || 1);
    return {
      status: true,
      valid: parsed.valid,
      expired: parsed.expired,
      report_count: parsed.report_count,
      data: (res.data && typeof res.data === "object" ? res.data : {}) as Record<string, unknown>,
    };
  } catch (error: any) {
    const data = error?.response?.data || {};
    const parsed = parseClaimInviteValidate(data, error?.response?.status);
    if (parsed.valid === false) {
      setClaimInviteValid(false);
      return { status: false, valid: false, expired: true, report_count: 0, data };
    }
    return {
      status: false,
      valid: true,
      expired: false,
      report_count: parsed.report_count || 1,
      data,
    };
  }
}
