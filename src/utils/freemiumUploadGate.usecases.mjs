/**
 * Lightweight use-case checks for Freemium multi-file gate.
 * Run: node src/utils/freemiumUploadGate.usecases.mjs
 */
import {
  FREEMIUM_MAX_UPLOAD_FILES,
  classifyFreemiumUploadBlock,
  freemiumBlocksMultiFileUpload,
  freemiumMultiFileUserMessage,
  isDuplicateFileUploadMessage,
  isFreemiumReportUploadLimitMessage,
  isFreemiumSingleFileRequiredMessage,
} from "./planLimits.js";

function assert(cond, label) {
  if (!cond) {
    console.error("FAIL:", label);
    process.exitCode = 1;
    return;
  }
  console.log("PASS:", label);
}

assert(FREEMIUM_MAX_UPLOAD_FILES === 1, "Freemium max files is 1");

// UC1: Premium + 2 files → allow
assert(
  !freemiumBlocksMultiFileUpload({ planId: "premium", fileCount: 2 }),
  "UC1 Premium + 2 files allowed",
);

// UC2: Freemium choose + 2 files → block
assert(
  freemiumBlocksMultiFileUpload({ planId: "freemium", fileCount: 2 }),
  "UC2 Freemium + 2 files blocked",
);

// UC3: Freemium + 1 file → allow
assert(
  !freemiumBlocksMultiFileUpload({ planId: "freemium", fileCount: 1 }),
  "UC3 Freemium + 1 file allowed",
);

// UC4: Active Freemium subscription + 3 files → block
assert(
  freemiumBlocksMultiFileUpload({ isFreemiumActive: true, fileCount: 3 }),
  "UC4 Active Freemium + 3 files blocked",
);

// UC5: Backend single-file code
assert(
  isFreemiumSingleFileRequiredMessage({ code: "freemium_single_file_required", file_count: 2 }),
  "UC5 backend code freemium_single_file_required",
);

// UC6: classify multi_file when 2 files + freemium limit-ish copy
assert(
  classifyFreemiumUploadBlock({
    planId: "freemium",
    fileCount: 2,
    message: "Freemium plan allows only 1 report upload total. Upgrade to Premium to upload more reports.",
  }) === "multi_file",
  "UC6 2 files + classic backend message → multi_file (back to upload)",
);

// UC7: classify replace_slot when 1 file + already-has-report copy
assert(
  classifyFreemiumUploadBlock({
    planId: "freemium",
    fileCount: 1,
    message: "Freemium plan allows only 1 report upload total. Upgrade to Premium to upload more reports.",
  }) === "replace_slot",
  "UC7 1 file + report-slot message → replace_slot",
);

// UC8: user-facing copy mentions back to upload
assert(
  /1 file/i.test(freemiumMultiFileUserMessage(2)) && /Go back to Upload Report/i.test(freemiumMultiFileUserMessage(2)),
  "UC8 Back-to-upload copy",
);

// UC9: single-file required wording
assert(
  isFreemiumSingleFileRequiredMessage("Freemium allows only 1 file. Keep one file."),
  "UC9 single-file wording detected",
);

// UC10: report-slot detector still works
assert(
  isFreemiumReportUploadLimitMessage("Freemium plan allows only 1 report upload total."),
  "UC10 report-slot detector",
);

// UC11: before plan choice — 2 files + freemium-looking message must NOT block (upload → plan picker first)
assert(
  classifyFreemiumUploadBlock({
    planId: "",
    isFreemiumActive: false,
    fileCount: 2,
    message: "Freemium plan allows only 1 file upload. You selected 2 files.",
  }) === "none",
  "UC11 unpaid / no plan + 2 files → no Freemium alert yet",
);

// UC12: Premium path never multi_file from message alone
assert(
  classifyFreemiumUploadBlock({
    planId: "premium",
    isFreemiumActive: false,
    fileCount: 2,
    message: "Freemium plan allows only 1 file upload.",
  }) === "none",
  "UC12 Premium + 2 files → ignore Freemium message",
);


// UC13: global duplicate file message detected
assert(
  isDuplicateFileUploadMessage("Duplicate file detected. This file was already uploaded."),
  "UC13 duplicate file message detected",
);

// UC14: duplicate must NOT look like Freemium replace-slot
assert(
  !isFreemiumReportUploadLimitMessage("Duplicate file detected. This file was already uploaded."),
  "UC14 duplicate is not report-slot",
);

// UC15: classify stays none even when details JSON contains "report.html" near "already uploaded"
assert(
  classifyFreemiumUploadBlock({
    planId: "freemium",
    fileCount: 1,
    message: "Duplicate file detected. This file was already uploaded.",
    details: {
      errors: [{ file: "report.html", error: "Duplicate file detected. This file was already uploaded." }],
    },
  }) === "none",
  "UC15 duplicate + report.html details → none (not replace_slot)",
);

if (process.exitCode) {
  console.error("\nSome Freemium upload use cases failed.");
} else {
  console.log("\nAll Freemium upload use cases passed.");
}
