import Swal from "sweetalert2";

/** Never show the onboarding “Upload a report first” SweetAlert — any flow. */
function isBlockedUploadReportModal(title: string, text: string, confirm: string): boolean {
  const blob = `${title} ${text} ${confirm}`.toLowerCase();
  if (/upload a (scan )?report first/.test(blob)) return true;
  if (/risk criteria is applied to your scan report/.test(blob)) return true;
  if (/please upload a report or provide scope/.test(blob)) return true;
  return false;
}

function readSwalArgs(args: unknown[]): { title: string; text: string; confirm: string } {
  const first = args[0];
  if (first && typeof first === "object" && !Array.isArray(first)) {
    const opts = first as Record<string, unknown>;
    return {
      title: String(opts.title ?? ""),
      text: String(opts.text ?? opts.html ?? ""),
      confirm: String(opts.confirmButtonText ?? ""),
    };
  }
  return {
    title: String(args[0] ?? ""),
    text: String(args[1] ?? ""),
    confirm: "",
  };
}

const originalFire = Swal.fire.bind(Swal);

Swal.fire = ((...args: Parameters<typeof Swal.fire>) => {
  const { title, text, confirm } = readSwalArgs(args);
  if (isBlockedUploadReportModal(title, text, confirm)) {
    return Promise.resolve({
      isConfirmed: false,
      isDenied: false,
      isDismissed: true,
      value: undefined,
    }) as ReturnType<typeof Swal.fire>;
  }
  return originalFire(...args);
}) as typeof Swal.fire;

export function dismissUploadReportModal() {
  try {
    Swal.close();
  } catch {
    /* ignore */
  }
}
