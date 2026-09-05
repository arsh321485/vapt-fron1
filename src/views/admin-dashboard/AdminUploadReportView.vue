<template>
  <main class="aur-root">
    <!-- Top bar -->
    <div class="aur-topbar">
      <router-link to="/home">
        <img src="@/assets/images/vaptfix_white.png" alt="VaptFix" class="aur-logo" />
      </router-link>
    </div>

    <div class="aur-page">
      <div class="aur-card" :class="{ 'aur-card--wide': viewMode === 'choose' || viewMode === 'scope-method' }">

        <!-- Step indicator -->
        <div class="aur-steps">
          <div class="aur-step done"><span>1</span> Sign Up</div>
          <div class="aur-step-line"></div>
          <div class="aur-step" :class="{ active: !generating, done: generating }">
            <span>2</span> Provide Scope
          </div>
          <div class="aur-step-line"></div>
          <div class="aur-step" :class="{ active: generating }"><span>3</span> Get Started</div>
        </div>

        <!-- PLAN SUGGEST: continue with matched plan or pick another -->
        <div v-if="planSuggestPrompt" class="aur-limit-overlay">
          <div class="aur-limit-card">
            <button
              type="button"
              class="aur-limit-back"
              :disabled="planSuggestBusy"
              @click="replaceUploadedFile"
            >
              ← Back
            </button>
            <p class="aur-limit-kicker">Recommended plan</p>
            <h2 class="aur-limit-title">Continue with {{ planSuggestPrompt.suggestedName }}?</h2>
            <p class="aur-limit-copy">
              <template v-if="planSuggestPrompt.count">
                This {{ planSuggestPrompt.source === 'upload' ? 'report' : 'scope' }} has
                <strong>{{ displayedPlanIpCount }}</strong>
                unique IP{{ displayedPlanIpCount === 1 ? '' : 's' }}
                <template v-if="planSuggestFileCount > 1">
                  combined from <strong>{{ planSuggestFileCount }}</strong> files
                </template>.
                Based on that count,
              </template>
              <strong>{{ planSuggestPrompt.suggestedName }}</strong> is recommended.
              You can continue with it, or choose a different plan.
              If you choose a smaller plan, you will upload a new report that fits that plan.
            </p>
            <ul
              v-if="planSuggestPrompt.source === 'upload' && planSuggestDisplayedFiles.length"
              class="aur-uploaded-files"
            >
              <li v-for="(entry, idx) in planSuggestDisplayedFiles" :key="entry.name + '-' + idx">
                <i class="bi bi-file-earmark-text"></i>
                <span class="aur-uploaded-file-name">{{ entry.name }}</span>
                <span v-if="entry.ipCount" class="aur-uploaded-file-ips">{{ entry.ipCount }} IP{{ entry.ipCount === 1 ? '' : 's' }}</span>
              </li>
            </ul>
            <p
              v-else-if="planSuggestPrompt.unpaidResume && hasExistingScope"
              class="aur-limit-copy"
            >
              Saved scope: <strong>{{ existingScopeDisplayName }}</strong>
            </p>
            <button type="button" class="aur-limit-keep" :disabled="planSuggestBusy" @click="selectPlanForUpload(planSuggestPrompt.suggested)">
              <span v-if="planSuggestBusy && planSuggestActivePlan === planSuggestPrompt.suggested" class="spinner-border spinner-border-sm me-2"></span>
              Yes, continue with {{ planSuggestPrompt.suggestedName }}
            </button>
            <button
              v-for="planId in planSuggestPrompt.otherPlans"
              :key="planId"
              type="button"
              class="aur-limit-upgrade"
              :disabled="planSuggestBusy"
              @click="selectPlanForUpload(planId)"
            >
              <span v-if="planSuggestBusy && planSuggestActivePlan === planId" class="spinner-border spinner-border-sm me-2"></span>
              Choose {{ planLabel(planId) }}
            </button>
          </div>
        </div>

        <!-- PLAN LIMIT: keep same plan vs upgrade -->
        <div v-else-if="planLimitPrompt" class="aur-limit-overlay">
          <div class="aur-limit-card">
            <p class="aur-limit-kicker">Plan limit</p>
            <h2 class="aur-limit-title">Extra IPs in this upload</h2>
            <p class="aur-limit-copy">
              This {{ planLimitPrompt.source === 'upload' ? 'report' : 'scope' }} has
              <strong>{{ planLimitPrompt.count }}</strong> IPs.
              <strong>{{ planLimitPrompt.planName }}</strong> shows
              <strong>{{ planLimitPrompt.limit }}</strong> now.
              {{ planLimitPrompt.extra }} extra IP{{ planLimitPrompt.extra === 1 ? '' : 's' }}
              stay saved and unlock automatically if you upgrade — no re-upload needed.
            </p>
            <button type="button" class="aur-limit-keep" :disabled="planLimitBusy" @click="keepSamePlan">
              <span v-if="planLimitBusy" class="spinner-border spinner-border-sm me-2"></span>
              Continue with {{ planLimitPrompt.planName }} — extras stay locked
            </button>
            <button
              v-if="planLimitPrompt.chosenPlan"
              type="button"
              class="aur-limit-upgrade"
              :disabled="planLimitBusy"
              @click="backToPlanChoices"
            >
              Choose a different plan
            </button>
            <button
              v-else
              type="button"
              class="aur-limit-upgrade"
              :disabled="planLimitBusy"
              @click="upgradePlan"
            >
              Upgrade the plan
            </button>
            <button type="button" class="aur-limit-cancel" :disabled="planLimitBusy" @click="cancelPlanLimitPrompt">
              Cancel
            </button>
          </div>
        </div>

        <!-- GENERATING AGENTS STATE — never while user is replacing / returning to upload picker -->
        <div v-else-if="generating && !replacingFile" class="aur-generating">
          <div class="aur-icon-wrap">
            <i class="bi bi-gear-fill aur-upload-icon aur-spin"></i>
          </div>
          <h1 class="aur-title">Creating agents</h1>
          <p class="aur-subtitle">
            Your report is uploaded. We’re generating agents from your scan findings — hang tight.
          </p>

          <div class="aur-progress-wrap">
            <div class="aur-progress-header">
              <span class="aur-progress-label">
                {{
                  pollSummary.cards_total > 0
                    ? `Creating agents (${pollSummary.cards_generated}/${pollSummary.cards_total})...`
                    : 'Creating agents...'
                }}
              </span>
              <span class="aur-progress-pct">{{ progressPercent }}%</span>
            </div>
            <div class="aur-progress-bar">
              <div
                v-if="pollSummary.cards_total > 0"
                class="aur-progress-fill"
                :style="{ width: progressPercent + '%' }"
              ></div>
              <div v-else class="aur-progress-fill aur-progress-indeterminate"></div>
            </div>
          </div>

          <p class="aur-progress-hint">Please wait — do not close this window until all agents are ready</p>
        </div>

        <template v-else>
          <!-- CHOOSER: Upload report vs Enter scope -->
          <div v-if="viewMode === 'choose'">
            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-bullseye aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Provide Your Scope</h1>
              <p class="aur-subtitle">
                Choose how you want to start — upload an existing scan report, or enter the assets VAPTFix should test.
              </p>
            </div>

            <div class="aur-choice-grid">
              <button type="button" class="aur-choice-card" @click="openUploadReport">
                <div class="aur-choice-icon">
                  <i class="bi bi-cloud-arrow-up"></i>
                </div>
                <h3 class="aur-choice-title">Upload Report</h3>
                <p class="aur-choice-copy">
                  Already have a scan report? Upload it and we’ll generate agents from your findings.
                </p>
                <span class="aur-choice-cta">
                  Continue <i class="bi bi-arrow-right"></i>
                </span>
              </button>

              <button type="button" class="aur-choice-card" @click="openEnterScope">
                <div class="aur-choice-icon aur-choice-icon--alt">
                  <i class="bi bi-list-check"></i>
                </div>
                <h3 class="aur-choice-title">Enter Your Scope</h3>
                <p class="aur-choice-copy">
                  No report yet? Share targets via CSV or enter them manually for testing.
                </p>
                <span class="aur-choice-cta">
                  Continue <i class="bi bi-arrow-right"></i>
                </span>
              </button>
            </div>

          </div>

          <!-- UPLOAD REPORT (existing flow) -->
          <div v-else-if="viewMode === 'upload'" class="aur-panel">
            <button type="button" class="aur-back" @click="backToChoose">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-cloud-arrow-up aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Upload Your Scan Report</h1>
              <p class="aur-subtitle">
                {{
                  activePlanFitNotice
                    ? `Freemium shows ${activePlanFitNotice.limit} IPs now. Extra assets from this file stay locked until you upgrade.`
                    : 'Upload your vulnerability assessment file (.nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc — including AWS Inspector) to begin.'
                }}
              </p>
              <p v-if="planLimitLabel" class="aur-plan-chip">{{ planLimitLabel }}</p>
            </div>

            <div v-if="activePlanFitNotice" class="aur-plan-fit-banner">
              <p>
                You chose <strong>{{ activePlanFitNotice.planName }}</strong>.
                This report has <strong>{{ activePlanFitNotice.count }}</strong> IPs;
                Freemium shows <strong>{{ activePlanFitNotice.limit }}</strong> now and keeps the rest locked until you upgrade (no re-upload needed).
              </p>
              <button type="button" class="aur-limit-keep" @click="continuePendingPlanDespiteOversize">
                Continue with {{ activePlanFitNotice.planName }}
              </button>
              <button type="button" class="aur-limit-upgrade" @click="backToPlanChoicesFromNotice">
                Choose a different plan
              </button>
            </div>

            <div v-if="loadingExistingReport && !freemiumSinglePick" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current report...
            </div>

            <!-- Freemium trim: show uploaded files, remove with × until 1 left -->
            <div v-else-if="freemiumSinglePick" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-files"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Freemium — keep 1 file</p>
                    <h2 class="aur-scope-board-title">
                      {{ freemiumKeepFileNames.length }} file{{ freemiumKeepFileNames.length === 1 ? '' : 's' }} selected
                    </h2>
                  </div>
                </div>
              </div>
              <p class="aur-scope-replace-hint">
                Remove extras with × so only one file remains, then continue with Freemium.
              </p>
              <ul v-if="freemiumKeepFileNames.length" class="aur-uploaded-files">
                <li v-for="(name, idx) in freemiumKeepFileNames" :key="name + '-' + idx">
                  <i class="bi bi-file-earmark-text"></i>
                  <span>{{ name }}</span>
                  <button
                    type="button"
                    class="aur-remove-btn"
                    title="Remove this file"
                    @click.stop="removeFreemiumKeepFile(idx)"
                  >
                    <i class="bi bi-x-circle"></i>
                  </button>
                </li>
              </ul>
              <p v-else class="aur-scope-replace-hint">
                No files left — browse one scan report below for Freemium.
              </p>
              <div class="aur-actions" style="margin-top: 0.85rem;">
                <button
                  v-if="canContinueFreemiumWithOneFile || (freemiumSinglePick && (freemiumContinueBusy || uploading) && freemiumKeepFileNames.length === 1)"
                  type="button"
                  class="aur-btn-primary"
                  :disabled="freemiumContinueBusy || uploading"
                  @click="continueFreemiumWithOneFile"
                >
                  <span v-if="freemiumContinueBusy || uploading" class="spinner-border spinner-border-sm me-1"></span>
                  {{ freemiumContinueBusy || uploading ? 'Uploading...' : 'Continue with Freemium' }}
                </button>
                <p v-else-if="freemiumKeepFileNames.length > 1" class="aur-drop-types" style="margin: 0;">
                  Keep exactly 1 file to continue
                </p>
              </div>
            </div>

            <div v-else-if="showExistingReportBoard" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-file-earmark-check"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Uploaded files</p>
                    <h2 class="aur-scope-board-title">
                      {{ existingUploadedFiles.length }} file{{ existingUploadedFiles.length === 1 ? '' : 's' }} merged
                    </h2>
                  </div>
                </div>
                <span v-if="existingReportStatusLabel" class="aur-scope-count">
                  {{ existingReportStatusLabel }}
                </span>
              </div>

              <ul v-if="existingUploadedFiles.length" class="aur-uploaded-files">
                <li v-for="(name, idx) in existingUploadedFiles" :key="name + '-' + idx">
                  <i class="bi bi-file-earmark-text"></i>
                  <span>{{ name }}</span>
                </li>
              </ul>

              <div v-if="existingReportCreatedAt" class="aur-scope-meta">
                <span class="aur-scope-chip">
                  <i class="bi bi-calendar3"></i>
                  {{ existingReportCreatedAt }}
                </span>
              </div>

              <div v-if="existingReportStats.length" class="aur-report-stats">
                <div
                  v-for="stat in existingReportStats"
                  :key="stat.label"
                  class="aur-report-stat"
                >
                  <span class="aur-report-stat-value">{{ stat.value }}</span>
                  <span class="aur-report-stat-label">{{ stat.label }}</span>
                </div>
              </div>

              <p class="aur-scope-replace-hint">
                {{
                  isReplacingUpload
                    ? 'Changed your mind? Continue with this file, or upload a new one below to replace it.'
                    : freemiumLocksUploadScope(subscription) && existingReport
                      ? 'Freemium keeps one report. Uploading again will replace your current file.'
                      : 'Upload another file below — it will merge with the files above (up to 10 per day).'
                }}
              </p>
            </div>

            <div
              class="aur-dropzone"
              :class="{ 'aur-dropzone-active': isDragging, 'aur-dropzone-has-file': selectedFiles.length }"
              @dragover.prevent="onReportDragOver"
              @dragleave.prevent="onReportDragLeave"
              @drop.prevent="onDrop"
            >
              <!-- Native overlay input: click/browse works without programmatic .click() -->
              <input
                id="aur-report-file-input"
                ref="fileInput"
                type="file"
                name="file"
                :multiple="!freemiumSinglePick"
                accept=".nessus,.xml,.html,.htm,.csv,.xlsx,.xls,.pdf,.docx,.doc,text/csv,text/html,application/pdf,application/xml,text/xml,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                class="aur-file-input aur-file-input--overlay"
                @change="onFileChange"
                @click.stop
              />

              <div class="aur-drop-content" aria-hidden="true">
                <i class="bi bi-file-earmark-arrow-up aur-drop-icon"></i>
                <p class="aur-drop-text">
                  {{
                    freemiumSinglePick
                      ? (selectedFiles.length ? 'Or replace with a different single file' : 'Or browse a different single file')
                      : (selectedFiles.length ? 'Drop more reports, or browse' : 'Drag &amp; drop your reports here')
                  }}
                </p>
                <p class="aur-drop-sub">or <span class="aur-browse">browse files</span></p>
                <p v-if="freemiumSinglePick" class="aur-drop-types">Optional — only if you want a new file instead of one above</p>
                <p class="aur-drop-types">.nessus · .xml · .html · .htm · .csv · .xlsx · .xls · .pdf · .docx · .doc</p>
              </div>
            </div>

            <ul v-if="selectedFiles.length && !freemiumSinglePick" class="aur-file-list">
              <li v-for="(file, idx) in selectedFiles" :key="file.name + '-' + file.size + '-' + idx" class="aur-file-info">
                <i class="bi bi-file-earmark-check aur-file-icon"></i>
                <div>
                  <p class="aur-file-name">{{ file.name }}</p>
                  <p class="aur-file-size">{{ formatFileSize(file.size) }}</p>
                </div>
                <button type="button" class="aur-remove-btn" @click.stop="removeSelectedFile(idx)">
                  <i class="bi bi-x-circle"></i>
                </button>
              </li>
            </ul>

            <div v-if="uploading" class="aur-progress-wrap">
              <div class="aur-progress-header">
                <span class="aur-progress-label">{{ uploadProgressLabel }}</span>
                <span class="aur-progress-pct">{{ uploadPct }}%</span>
              </div>
              <div class="aur-progress-bar">
                <div class="aur-progress-fill" :style="{ width: uploadPct + '%' }"></div>
              </div>
              <p class="aur-progress-hint">
                {{ uploadBeforePay
                  ? 'Report upload will finish first. Payment opens only after that.'
                  : 'Please wait, do not close this window' }}
              </p>
            </div>

            <p v-if="uploadError" class="aur-error">{{ uploadError }}</p>
            <div v-if="uploadPlanOffer" class="aur-plan-offer">
              <p class="aur-plan-offer-copy">
                <template v-if="uploadPlanOffer.count">
                  {{ uploadPlanOffer.count }} IPs detected —
                </template>
                <strong>{{ uploadPlanOffer.suggestedName }}</strong> is auto-selected for this report.
              </p>
              <button type="button" class="aur-limit-keep" :disabled="planSuggestBusy || uploading" @click="selectPlanForUpload(uploadPlanOffer.suggested)">
                Continue with {{ uploadPlanOffer.suggestedName }}
              </button>
              <button
                v-for="planId in uploadPlanOffer.otherPlans"
                :key="planId"
                type="button"
                class="aur-limit-upgrade"
                :disabled="planSuggestBusy || uploading"
                @click="selectPlanForUpload(planId)"
              >
                Choose {{ planLabel(planId) }}
              </button>
            </div>

            <div class="aur-actions">
              <button
                v-if="canContinueWithExistingFile && !uploading && !selectedFiles.length"
                type="button"
                class="aur-btn-primary"
                :disabled="planSuggestBusy"
                @click="continueWithExistingFile"
              >
                <i class="bi bi-check2-circle me-1"></i>
                Continue with the same file
              </button>
              <button
                v-if="selectedFiles.length && !freemiumSinglePick"
                class="aur-btn-primary"
                :disabled="uploading"
                @click="startUpload"
              >
                <span v-if="uploading">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Uploading...
                </span>
                <span v-else>
                  <i class="bi bi-cloud-upload me-1"></i>
                  {{ selectedFiles.length > 1 ? 'Upload reports' : 'Continue with this file' }}
                </span>
              </button>
            </div>

            <div class="aur-info-row">
              <i class="bi bi-shield-lock aur-info-icon"></i>
              <span>Your file is encrypted and stored securely. Only your Super Admin and team can access it.</span>
            </div>
          </div>

          <!-- ENTER SCOPE: CSV vs Manual -->
          <div v-else-if="viewMode === 'scope-method'">
            <button type="button" class="aur-back" @click="backToChoose">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-list-check aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Enter Your Scope</h1>
              <p class="aur-subtitle">
                Add targets with a file, or enter IPs / hosts manually.
              </p>
            </div>

            <div class="aur-choice-grid">
              <button type="button" class="aur-choice-card" @click="openScopeCsv">
                <div class="aur-choice-icon">
                  <i class="bi bi-file-earmark-spreadsheet"></i>
                </div>
                <h3 class="aur-choice-title">Upload Scope File</h3>
                <p class="aur-choice-copy">
                  Upload a CSV, Excel, or text file of assets / IPs / web apps. One row per target works best.
                </p>
                <span class="aur-choice-cta">
                  Upload scope file <i class="bi bi-arrow-right"></i>
                </span>
              </button>

              <button type="button" class="aur-choice-card" @click="openScopeManual">
                <div class="aur-choice-icon aur-choice-icon--alt">
                  <i class="bi bi-keyboard"></i>
                </div>
                <h3 class="aur-choice-title">Manual Entry</h3>
                <p class="aur-choice-copy">
                  Type IP addresses, hostnames, or CIDR ranges one per line.
                </p>
                <span class="aur-choice-cta">
                  Enter manually <i class="bi bi-arrow-right"></i>
                </span>
              </button>
            </div>
          </div>

          <!-- SCOPE CSV -->
          <div v-else-if="viewMode === 'scope-csv'" class="aur-panel">
            <button type="button" class="aur-back" @click="openEnterScope">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-file-earmark-spreadsheet aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Upload Scope File</h1>
              <p class="aur-subtitle">
                {{
                  activePlanFitNotice
                    ? `Freemium shows ${activePlanFitNotice.limit} targets now. Extra assets stay locked until you upgrade.`
                    : 'Upload a .csv, .xlsx, .xls, or .txt file listing the assets you want VAPTFix to include in scope.'
                }}
              </p>
            </div>

            <div v-if="activePlanFitNotice" class="aur-plan-fit-banner">
              <p>
                You chose <strong>{{ activePlanFitNotice.planName }}</strong>.
                Extra targets stay saved and unlock when you upgrade — no smaller file needed.
              </p>
              <button type="button" class="aur-limit-keep" @click="continuePendingPlanDespiteOversize">
                Continue with {{ activePlanFitNotice.planName }}
              </button>
              <button type="button" class="aur-limit-upgrade" @click="backToPlanChoicesFromNotice">
                Choose a different plan
              </button>
            </div>

            <div v-if="loadingExistingScope" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current scope...
            </div>

            <div v-else-if="hasExistingScope && !activePlanFitNotice" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Current scope</p>
                    <h2 class="aur-scope-board-title">{{ existingScopeDisplayName }}</h2>
                  </div>
                </div>
                <span class="aur-scope-count">
                  {{ existingEntryCount }} target{{ existingEntryCount === 1 ? '' : 's' }}
                </span>
              </div>

              <div class="aur-scope-meta">
                <span v-if="existingScopeLabel" class="aur-scope-chip">
                  <i class="bi bi-filetype-csv"></i>
                  {{ existingScopeLabel }}
                </span>
              </div>

              <div v-if="existingScopeEntries.length" class="aur-scope-table-wrap">
                <table class="aur-scope-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Target</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(entry, idx) in existingScopeEntries"
                      :key="entry.id || entry.value + '-' + idx"
                    >
                      <td>{{ idx + 1 }}</td>
                      <td>
                        <span class="aur-scope-target">{{ entry.value }}</span>
                        <span v-if="entry.subnet_mask" class="aur-scope-subnet">
                          /{{ entry.subnet_mask }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="aur-scope-type-pill"
                          :class="entry.is_internal ? 'is-internal' : 'is-external'"
                        >
                          {{ formatEntryType(entry.entry_type) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p class="aur-scope-replace-hint">Upload a new file below to update scope.</p>
            </div>

            <div
              class="aur-dropzone"
              :class="{ 'aur-dropzone-active': isDragging, 'aur-dropzone-has-file': selectedFile }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onScopeCsvDrop"
              @click="$refs.csvInput.click()"
            >
              <input
                ref="csvInput"
                type="file"
                accept=".csv,.xlsx,.xls,.txt,text/csv,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                class="aur-file-input"
                @change="onScopeCsvChange"
              />

              <div v-if="!selectedFile" class="aur-drop-content">
                <i class="bi bi-file-earmark-spreadsheet aur-drop-icon"></i>
                <p class="aur-drop-text">Drag &amp; drop your scope file here</p>
                <p class="aur-drop-sub">or <span class="aur-browse">browse files</span></p>
                <p class="aur-drop-types">.csv · .xlsx · .xls · .txt</p>
              </div>

              <div v-else class="aur-file-info">
                <i class="bi bi-file-earmark-check aur-file-icon"></i>
                <div>
                  <p class="aur-file-name">{{ selectedFile.name }}</p>
                  <p class="aur-file-size">{{ fileSize }}</p>
                </div>
                <button class="aur-remove-btn" @click.stop="removeFile">
                  <i class="bi bi-x-circle"></i>
                </button>
              </div>
            </div>

            <p v-if="uploadError" class="aur-error">{{ uploadError }}</p>
            <div v-if="uploadPlanOffer" class="aur-plan-offer">
              <p class="aur-plan-offer-copy">
                <template v-if="uploadPlanOffer.count">
                  {{ uploadPlanOffer.count }} IPs detected —
                </template>
                <strong>{{ uploadPlanOffer.suggestedName }}</strong> is auto-selected for this scope.
              </p>
              <button type="button" class="aur-limit-keep" :disabled="planSuggestBusy || uploading" @click="selectPlanForUpload(uploadPlanOffer.suggested)">
                Continue with {{ uploadPlanOffer.suggestedName }}
              </button>
              <button
                v-for="planId in uploadPlanOffer.otherPlans"
                :key="planId"
                type="button"
                class="aur-limit-upgrade"
                :disabled="planSuggestBusy || uploading"
                @click="selectPlanForUpload(planId)"
              >
                Choose {{ planLabel(planId) }}
              </button>
            </div>

            <div class="aur-actions">
              <button
                v-if="canContinueWithExistingFile"
                type="button"
                class="aur-btn-primary"
                :disabled="scopeSubmitting || planSuggestBusy"
                @click="continueWithExistingFile"
              >
                <i class="bi bi-check2-circle me-1"></i>
                Continue with the same file
              </button>
              <button
                class="aur-btn-primary"
                :class="{ 'aur-btn-secondary': canContinueWithExistingFile && !selectedFile }"
                :disabled="!selectedFile || scopeSubmitting"
                @click="submitScopeCsv"
              >
                <span v-if="scopeSubmitting">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Submitting...
                </span>
                <span v-else>
                  <i class="bi bi-check2-circle me-1"></i>
                  Submit Scope File
                </span>
              </button>
            </div>
          </div>

          <!-- SCOPE MANUAL -->
          <div v-else-if="viewMode === 'scope-manual'" class="aur-panel">
            <button type="button" class="aur-back" @click="openEnterScope">
              <i class="bi bi-arrow-left"></i> Back
            </button>

            <div class="aur-header">
              <div class="aur-icon-wrap">
                <i class="bi bi-keyboard aur-upload-icon"></i>
              </div>
              <h1 class="aur-title">Enter Scope Manually</h1>
              <p class="aur-subtitle">
                {{
                  activePlanFitNotice
                    ? `Freemium shows ${activePlanFitNotice.limit} targets now. Extra assets stay locked until you upgrade.`
                    : 'Add one IP, hostname, or CIDR range per line. You can paste a list at once.'
                }}
              </p>
            </div>

            <div v-if="activePlanFitNotice" class="aur-plan-fit-banner">
              <p>
                You chose <strong>{{ activePlanFitNotice.planName }}</strong>.
                Extra targets stay saved and unlock when you upgrade — no smaller list needed.
              </p>
              <button type="button" class="aur-limit-keep" @click="continuePendingPlanDespiteOversize">
                Continue with {{ activePlanFitNotice.planName }}
              </button>
              <button type="button" class="aur-limit-upgrade" @click="backToPlanChoicesFromNotice">
                Choose a different plan
              </button>
            </div>

            <div v-if="loadingExistingScope" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current scope...
            </div>

            <div v-else-if="hasExistingScope && !activePlanFitNotice" class="aur-scope-board">
              <div class="aur-scope-board-top">
                <div class="aur-scope-board-title-row">
                  <div class="aur-scope-board-icon">
                    <i class="bi bi-shield-check"></i>
                  </div>
                  <div>
                    <p class="aur-scope-board-kicker">Current scope</p>
                    <h2 class="aur-scope-board-title">{{ existingScopeDisplayName }}</h2>
                  </div>
                </div>
                <span class="aur-scope-count">
                  {{ existingEntryCount }} target{{ existingEntryCount === 1 ? '' : 's' }}
                </span>
              </div>

              <div class="aur-scope-meta">
                <span v-if="existingScopeLabel" class="aur-scope-chip">
                  <i class="bi bi-filetype-csv"></i>
                  {{ existingScopeLabel }}
                </span>
              </div>

              <div v-if="existingScopeEntries.length" class="aur-scope-table-wrap">
                <table class="aur-scope-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Target</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(entry, idx) in existingScopeEntries"
                      :key="entry.id || entry.value + '-' + idx"
                    >
                      <td>{{ idx + 1 }}</td>
                      <td>
                        <span class="aur-scope-target">{{ entry.value }}</span>
                        <span v-if="entry.subnet_mask" class="aur-scope-subnet">
                          /{{ entry.subnet_mask }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="aur-scope-type-pill"
                          :class="entry.is_internal ? 'is-internal' : 'is-external'"
                        >
                          {{ formatEntryType(entry.entry_type) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <label class="aur-field-label" for="scope-manual-input">Targets</label>
            <textarea
              id="scope-manual-input"
              v-model="manualScopeText"
              class="aur-textarea"
              :class="{ 'has-errors': scopeLineErrors.length }"
              rows="8"
              placeholder="192.168.1.10&#10;192.168.1.0/24&#10;app.example.com"
            ></textarea>

            <div class="aur-manual-meta">
              <span>{{ manualValidTargetCount }} valid target{{ manualValidTargetCount === 1 ? '' : 's' }} detected</span>
              <span v-if="manualInvalidLineCount" class="aur-manual-meta-warn">
                · {{ manualInvalidLineCount }} line{{ manualInvalidLineCount === 1 ? '' : 's' }} won’t be accepted
              </span>
            </div>

            <ul v-if="scopeLineErrors.length" class="aur-line-errors">
              <li v-for="(item, idx) in scopeLineErrors" :key="(item.value || 'err') + '-' + idx">
                <strong>{{ item.value || 'Line' }}</strong>
                <span>{{ item.error }}</span>
              </li>
            </ul>

            <p v-if="uploadError && !scopeLineErrors.length" class="aur-error">{{ uploadError }}</p>
            <div v-if="uploadPlanOffer" class="aur-plan-offer">
              <p class="aur-plan-offer-copy">
                <template v-if="uploadPlanOffer.count">
                  {{ uploadPlanOffer.count }} IPs detected —
                </template>
                <strong>{{ uploadPlanOffer.suggestedName }}</strong> is auto-selected for this scope.
              </p>
              <button type="button" class="aur-limit-keep" :disabled="planSuggestBusy || uploading" @click="selectPlanForUpload(uploadPlanOffer.suggested)">
                Continue with {{ uploadPlanOffer.suggestedName }}
              </button>
              <button
                v-for="planId in uploadPlanOffer.otherPlans"
                :key="planId"
                type="button"
                class="aur-limit-upgrade"
                :disabled="planSuggestBusy || uploading"
                @click="selectPlanForUpload(planId)"
              >
                Choose {{ planLabel(planId) }}
              </button>
            </div>

            <div class="aur-actions">
              <button
                v-if="canContinueWithExistingFile"
                type="button"
                class="aur-btn-primary"
                :disabled="scopeSubmitting || planSuggestBusy"
                @click="continueWithExistingFile"
              >
                <i class="bi bi-check2-circle me-1"></i>
                Continue with the same file
              </button>
              <button
                class="aur-btn-primary"
                :class="{ 'aur-btn-secondary': canContinueWithExistingFile && manualTargetCount === 0 }"
                :disabled="manualTargetCount === 0 || scopeSubmitting"
                @click="submitScopeManual"
              >
                <span v-if="scopeSubmitting">
                  <span class="spinner-border spinner-border-sm me-1"></span>
                  Submitting...
                </span>
                <span v-else>
                  <i class="bi bi-check2-circle me-1"></i>
                  Submit Scope
                </span>
              </button>
            </div>
          </div>
        </template>

      </div>
    </div>
  </main>
</template>

<script>
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/authStore';
import { countUniqueIpHosts } from '@/utils/assetDummyData';
import { isClaimInviteFlow } from '@/utils/claimInvite';
import { isScopeAwaitingScan, markScopeAwaitingScan, markScopeFileAwaitingSuperadmin, readStoredAdminEmail } from '@/utils/scopeScanGate';
import {
  clearPersistedAgentGeneration,
  isAgentGenerationInProgress,
  persistAgentGeneration,
  readPersistedAgentGeneration,
} from '@/utils/agentGeneration';
import { isExternalDeepLink } from '@/utils/routeLock';
import {
  billingErrorMessage,
  checkoutFreemium,
  getMySubscription,
  isScopeBlocksFreemiumError,
  syncSubscriptionAssets,
} from '@/services/billingApi';
import {
  collectFreemiumTrimmedResults,
  extraIpCount,
  freemiumLocksUploadScope,
  FREEMIUM_VISIBLE_ASSET_LIMIT,
  classifyFreemiumUploadBlock,
  detectedFileAssetCount,
  freemiumBlocksMultiFileUpload,
  freemiumMultiFileUserMessage,
  isActiveSubscription,
  isExistingSubscriptionMessage,
  isFreemiumPlan,
  isFreemiumReportUploadLimitMessage,
  isFreemiumSingleFileRequiredMessage,
  DUPLICATE_FILE_UPLOAD_MESSAGE,
  isDuplicateFileUploadMessage,
  hasFreemiumRestrictions,
  isInvalidScanFileMessage,
  isNetworkOrTransportError,
  isPlanQuotaMessage,
  markFreemiumActiveNotice,
  otherPlans,
  parsePlanHintFromMessage,
  peekBillableAssetCount,
  planAssetLimit,
  planBlocksOversizedUpload,
  planDisplayName,
  uniqueIpCountFields,
  recommendPlanAssetCount,
  rememberFullAssetCount,
  setBillingReturnTo,
  setPremiumEntrySource,
  storeBillableAssetCount,
  rememberUploadedScanFiles,
  markFreemiumSinglePickIntent,
  clearFreemiumSinglePickIntent,
  isFreemiumSinglePickIntent,
  peekUploadedScanFileCount,
  peekUploadedScanFileNames,
  suggestedPlanFromAssetCount,
  uploadTransportErrorMessage,
  UPLOAD_RETURN_PATH,
} from '@/utils/planLimits';
import {
  collectInvalidScopeLines,
  countValidScopeTargets,
  extractPlanRecommendation,
  extractScopeProcessing,
  extractScopeSubmitStatus,
  isValidScopeTarget,
  planRecommendationBreakdown,
  planRecommendationMessage,
  recommendedPaidPlanFromScope,
} from '@/utils/scopeTargets';
import { setCachedPaidPlan } from '@/utils/authenticatedHome';
import { captureChatHandoffSource, consumeHandoffError, hasChatHandoffSource, maybeShowReturnToChatPlatformPopup } from '@/utils/adminHandoff';
import { submitScopeFileForAnalysis } from '@/services/scopeFileApi';
import {
  clearPendingUpload,
  peekPendingUploadFile,
  peekPendingUploadFiles,
  stashPendingUpload,
} from '@/utils/pendingUpload';

const ALLOWED_EXTENSIONS = [
  '.nessus',
  '.xml',
  '.html',
  '.htm',
  '.csv',
  '.xlsx',
  '.xls',
  '.pdf',
  '.docx',
  '.doc',
];

const SCOPE_ALLOWED_EXTENSIONS = ['.csv', '.xlsx', '.xls', '.txt'];
const SCOPE_TEXT_EXTENSIONS = ['.csv', '.txt'];
const SCOPE_FILE_ERROR = 'Please upload a .csv, .xlsx, .xls, or .txt file for scope.';

const MAX_UPLOAD_FILES = 10;
const STATUS_POLL_MS = 4000;
const EXTERNAL_REPORT_WATCH_MS = 4000;

export default {
  name: 'AdminUploadReportView',
  data() {
    return {
      viewMode: 'choose', // choose | upload | scope-method | scope-csv | scope-manual
      selectedFile: null,
      selectedFiles: [],
      /** How many files were in the last upload attempt (survives clear after success). */
      lastUploadFileCount: 0,
      /** Filenames from the last upload attempt (for plan card when API returns only one name). */
      lastUploadFileNames: [],
      isDragging: false,
      uploading: false,
      uploadPct: 0,
      uploadError: '',
      uploadResult: null,
      generating: false,
      reportIds: [],
      statusByReportId: {},
      pollTimer: null,
      polling: false,
      redirecting: false,
      externalReportWatchTimer: null,
      externalReportWatching: false,
      manualScopeText: '',
      scopeSubmitting: false,
      existingScope: null,
      loadingExistingScope: false,
      existingReport: null,
      loadingExistingReport: false,
      subscription: null,
      planLimitPrompt: null,
      planLimitBusy: false,
      planLimitResolved: false,
      planSuggestPrompt: null,
      planSuggestBusy: false,
      planSuggestActivePlan: '',
      planSuggestResolved: false,
      uploadPlanOffer: null,
      uploadBeforePay: false,
      savedSuggestPrompt: null,
      pendingPlan: '',
      planFitNotice: null,
      replacingFile: false,
      /** Freemium "Back to upload" — trim uploaded files to 1, then continue. */
      freemiumSinglePick: false,
      /** File names shown with × while trimming for Freemium. */
      freemiumKeepFileNames: [],
      freemiumContinueBusy: false,
      fileDetectedIpCount: 0,
      scopeLineErrors: [],
      scopeSubmitSummary: null,
    };
  },
  computed: {
    activePlanFitNotice() {
      const notice = this.planFitNotice;
      if (!notice) return null;
      const source = notice.source || 'upload';
      if (this.viewMode === 'upload' && source === 'upload') return notice;
      if (this.viewMode === 'scope-csv' && source === 'scope-csv') return notice;
      if (this.viewMode === 'scope-manual' && source === 'scope-manual') return notice;
      return null;
    },
    fileSize() {
      if (!this.selectedFile) return '';
      const bytes = this.selectedFile.size;
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
    manualTargets() {
      return String(this.manualScopeText || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    },
    manualTargetCount() {
      return this.manualTargets.length;
    },
    manualValidTargetCount() {
      return this.manualTargets.filter(isValidScopeTarget).length;
    },
    manualInvalidLineCount() {
      return Math.max(0, this.manualTargetCount - this.manualValidTargetCount);
    },
    pollSummary() {
      const statuses = this.reportIds
        .map((id) => this.statusByReportId[id])
        .filter(Boolean);

      let cards_total = 0;
      let cards_generated = 0;
      for (const s of statuses) {
        cards_total += Number(s.cards_total) || 0;
        cards_generated += Number(s.cards_generated) || 0;
      }
      return { cards_total, cards_generated };
    },
    progressPercent() {
      if (this.allAgentsReady) return 100;

      const total = this.pollSummary.cards_total || 0;
      if (!total) return 0;
      const pct = Math.round((this.pollSummary.cards_generated / total) * 100);
      return Math.min(99, Math.max(0, pct));
    },
    allAgentsReady() {
      if (!this.reportIds.length) return false;

      return this.reportIds.every((id) => {
        const s = this.statusByReportId[id];
        if (!s) return false;
        const total = Number(s.cards_total) || 0;
        const generated = Number(s.cards_generated) || 0;
        return total > 0 && generated >= total;
      });
    },
    hasExistingScope() {
      return !!(this.existingScope?.id || this.existingScopeEntries.length);
    },
    existingScopeEntries() {
      const entries = this.existingScope?.entries;
      return Array.isArray(entries) ? entries : [];
    },
    existingScopeLabel() {
      return this.existingScope?.source_file_name || '';
    },
    existingScopeDisplayName() {
      return (
        this.existingScope?.name ||
        this.existingScope?.source_file_name ||
        'Current scope'
      );
    },
    existingEntryCount() {
      return (
        Number(this.existingScope?.entry_count) ||
        this.existingScopeEntries.length ||
        0
      );
    },
    maxUploadFiles() {
      return MAX_UPLOAD_FILES;
    },
    isReplacingUpload() {
      return this.replacingFile || String(this.$route?.query?.replace || '') === '1';
    },
    /** Profile "Upload Scope" / replace-file: stay here so they can add a new report. */
    isExplicitScopeVisit() {
      const returnTo = this.$route?.query?.returnTo;
      if (typeof returnTo === 'string' && returnTo.startsWith('/')) return true;
      return this.isReplacingUpload;
    },
    canContinueWithExistingFile() {
      if (this.freemiumSinglePick) return false;
      if (this.activePlanFitNotice) return false;
      if (this.viewMode === 'upload') return this.hasExistingReport;
      if (this.viewMode === 'scope-csv' || this.viewMode === 'scope-manual') {
        return this.hasExistingScope;
      }
      return false;
    },
    showExistingReportBoard() {
      if (this.freemiumSinglePick) return false;
      if (this.loadingExistingReport) return false;
      return this.hasExistingReport && !this.activePlanFitNotice;
    },
    canContinueFreemiumWithOneFile() {
      return this.freemiumSinglePick && this.freemiumKeepFileNames.length === 1 && !this.freemiumContinueBusy;
    },
    existingUploadedFiles() {
      const names = [];
      const pushName = (raw) => {
        const name = String(raw || '').trim();
        if (!name || names.includes(name)) return;
        names.push(name);
      };
      const fromApi = this.existingReport?.uploaded_file_names;
      if (Array.isArray(fromApi)) fromApi.forEach(pushName);
      const fromFiles = this.existingReport?.files;
      if (Array.isArray(fromFiles)) {
        fromFiles.forEach((item) => {
          if (typeof item === 'string') pushName(item);
          else pushName(item?.file_name || item?.filename || item?.name);
        });
      }
      // Do not include lastUploadFileNames here — that made hasExistingReport true
      // after a cleared picker and broke browse / onboarding redirect.
      const single = this.existingReportFileName;
      if (this.existingReport && single && single !== 'Uploaded report') pushName(single);
      return names;
    },
    planSuggestFileCount() {
      return Math.max(
        this.existingUploadedFiles.length,
        Number(this.lastUploadFileCount) || 0,
        this.currentSelectedUploadFiles().length,
      );
    },
    /** Plan card rows: name + optional per-file IP from backend files[]. */
    planSuggestDisplayedFiles() {
      const byName = new Map();
      const filesMeta = Array.isArray(this.existingReport?.files) ? this.existingReport.files : [];
      filesMeta.forEach((item) => {
        if (!item || typeof item === 'string') {
          const name = String(item || '').trim();
          if (name) byName.set(name, { name, ipCount: 0 });
          return;
        }
        const name = String(item.file_name || item.filename || item.name || '').trim();
        if (!name) return;
        const ipCount =
          Number(item.unique_ip_count || item.uniqueIpCount || item.ip_count || item.ips || 0) || 0;
        byName.set(name, { name, ipCount });
      });
      this.existingUploadedFiles.forEach((name) => {
        if (!byName.has(name)) byName.set(name, { name, ipCount: 0 });
      });
      (this.lastUploadFileNames || []).forEach((name) => {
        const n = String(name || '').trim();
        if (n && !byName.has(n)) byName.set(n, { name: n, ipCount: 0 });
      });
      this.currentSelectedUploadFiles().forEach((file) => {
        const n = String(file?.name || '').trim();
        if (n && !byName.has(n)) byName.set(n, { name: n, ipCount: 0 });
      });
      return [...byName.values()];
    },
    existingReportIpCount() {
      return this.recommendAssetCount();
    },
    uniqueAssetIpCount() {
      return countUniqueIpHosts(useAuthStore().assetRows);
    },
    displayedPlanIpCount() {
      if (this.planSuggestPrompt?.source === 'upload') {
        return this.payloadUniqueIpCount() || this.planSuggestPrompt.count || 0;
      }
      return this.planSuggestPrompt?.count || 0;
    },
    hasExistingReport() {
      if (this.existingReportId) return true;
      return this.existingUploadedFiles.length > 0;
    },
    existingReportId() {
      return (
        this.existingReport?.report_id ||
        this.existingReport?.id ||
        this.existingReport?._id ||
        ''
      );
    },
    existingReportFileName() {
      return (
        this.existingReport?.resolved_file_name ||
        this.existingReport?.file_name ||
        this.existingReport?.filename ||
        this.existingReport?.original_filename ||
        this.existingReport?.name ||
        'Uploaded report'
      );
    },
    existingReportStatusLabel() {
      const raw =
        this.existingReport?.status ||
        this.existingReport?.upload_status ||
        this.existingReport?.state ||
        '';
      if (!raw) {
        const total = Number(this.existingReport?.cards_total) || 0;
        const generated = Number(this.existingReport?.cards_generated) || 0;
        if (total > 0 && generated >= total) return 'Ready';
        if (total > 0) return 'Processing';
        return '';
      }
      return String(raw).replace(/_/g, ' ');
    },
    existingReportCreatedAt() {
      const raw =
        this.existingReport?.created_at ||
        this.existingReport?.uploaded_at ||
        this.existingReport?.updated_at ||
        '';
      if (!raw) return '';
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) return String(raw);
      return d.toLocaleDateString();
    },
    existingReportCardsLabel() {
      const total = Number(this.existingReport?.cards_total) || 0;
      const generated = Number(this.existingReport?.cards_generated) || 0;
      if (!total && !generated) return '';
      return `Agents ${generated}/${total || '?'}`;
    },
    existingReportStats() {
      const r = this.existingReport || {};
      const candidates = [
        { label: 'Unique IPs', value: r.unique_ip_count },
        { label: 'Hosts', value: r.host_count ?? r.hosts_count ?? r.total_hosts },
        { label: 'Vulnerabilities', value: r.vulnerability_count ?? r.vuln_count ?? r.total_vulnerabilities },
        { label: 'Critical', value: r.critical_count ?? r.critical },
        { label: 'High', value: r.high_count ?? r.high },
        { label: 'Medium', value: r.medium_count ?? r.medium },
        { label: 'Low', value: r.low_count ?? r.low },
      ];
      return candidates
        .filter((item) => item.value != null && item.value !== '')
        .map((item) => ({ label: item.label, value: String(item.value) }));
    },
    planLimitLabel() {
      if (!isActiveSubscription(this.subscription)) return '';
      const name = planDisplayName(this.subscription);
      if (isFreemiumPlan(this.subscription)) {
        return `${name} plan · 5 visible IPs (extra assets unlock on upgrade)`;
      }
      const limit = planAssetLimit(this.subscription);
      if (!Number.isFinite(limit)) return `${name} plan · custom asset scope`;
      return `${name} plan · up to ${limit} IPs`;
    },
    uploadProgressLabel() {
      if (this.uploadBeforePay) {
        return this.uploadPct >= 95 ? 'Finishing upload before payment...' : 'Uploading report...';
      }
      return this.uploadPct >= 95 ? 'Processing report...' : 'Uploading...';
    },
  },
  methods: {
    toastNotice(icon, title, text = '', ms = 2400) {
      return Swal.fire({
        toast: true,
        position: 'top',
        icon,
        title,
        text,
        showConfirmButton: false,
        timer: ms,
        timerProgressBar: true,
      });
    },
    async notifyFreemiumTrimmed(data) {
      const trimmed = collectFreemiumTrimmedResults(data);
      if (trimmed.length) {
        const locked = trimmed.reduce(
          (sum, row) => sum + (Number(row.locked_asset_count ?? row.locked_assets) || 0),
          0,
        );
        rememberFullAssetCount({
          ...trimmed[0],
          locked_asset_count: locked || trimmed[0].locked_asset_count,
        });
      } else {
        rememberFullAssetCount(data);
      }
      this.captureDetectedIpCount(data);
    },
    captureDetectedIpCount(data) {
      const n = recommendPlanAssetCount(data, this.uploadResult, this.existingReport);
      if (n) {
        this.fileDetectedIpCount = n;
        storeBillableAssetCount(n);
      }
    },
    uniqueIpCountFromAssets() {
      return this.uniqueAssetIpCount;
    },
    payloadUniqueIpCount() {
      const auth = useAuthStore();
      return (
        uniqueIpCountFields(this.uploadResult) ||
        uniqueIpCountFields(this.existingReport) ||
        uniqueIpCountFields(this.uploadResult?.data) ||
        uniqueIpCountFields(this.existingReport?.data) ||
        Number(auth.uniqueIpCount) ||
        0
      );
    },
    recommendAssetCount() {
      return (
        this.payloadUniqueIpCount() ||
        recommendPlanAssetCount(this.uploadResult, this.existingReport) ||
        this.fileDetectedIpCount ||
        0
      );
    },
    async resolveUniqueIpCount(fallback = 0) {
      const fromPayload = this.payloadUniqueIpCount();
      if (fromPayload) {
        this.fileDetectedIpCount = fromPayload;
        storeBillableAssetCount(fromPayload);
        return fromPayload;
      }
      const auth = useAuthStore();
      try {
        await auth.fetchAssets(true);
      } catch {
        /* payload still usable */
      }
      const fromAssets = countUniqueIpHosts(auth.assetRows);
      const n =
        this.payloadUniqueIpCount() ||
        fromAssets ||
        Number(auth.uniqueIpCount) ||
        peekBillableAssetCount() ||
        Number(fallback) ||
        0;
      // Never accept fallback that is just the uploaded file count.
      const fileCount = Number(this.lastUploadFileCount) || this.currentSelectedUploadFiles().length || 0;
      const safe =
        n > 0 && fileCount > 1 && n === fileCount && !fromPayload && !fromAssets
          ? peekBillableAssetCount() || 0
          : n;
      if (safe) {
        this.fileDetectedIpCount = safe;
        storeBillableAssetCount(safe);
      }
      return safe;
    },
    async loadSubscription() {
      try {
        const data = await getMySubscription();
        this.subscription = data?.subscription || null;
        rememberFullAssetCount(this.subscription || data);
      } catch {
        this.subscription = null;
      }
      return this.subscription;
    },
    goToPricing(planId = '', assetCount = 0, uploadDone = false, extras = {}) {
      if (!planId) return;
      const mode = String(extras.mode || '').toLowerCase();
      const source = String(extras.source || '').toLowerCase();
      const isScopeFile = source === 'scope' || source === 'scope-csv' || source === 'scope-manual';
      const nextAfterPay = isScopeFile ? '/waiting-for-report' : '/communication';
      const authStore = useAuthStore();
      const fromAssets = countUniqueIpHosts(authStore.assetRows);
      const uniqueIps = isScopeFile
        ? 0
        : (
          this.recommendAssetCount() ||
          fromAssets ||
          Number(authStore.uniqueIpCount) ||
          peekBillableAssetCount() ||
          0
        );
      let count = uniqueIps || Number(assetCount) || (isScopeFile ? peekBillableAssetCount() : 0);
      // Guard: never treat uploaded file-count as unique IP count.
      const fileCount = Number(this.lastUploadFileCount) || this.currentSelectedUploadFiles().length || 0;
      if (count > 0 && fileCount > 1 && count === fileCount && !uniqueIps) {
        count = peekBillableAssetCount() || fromAssets || 0;
      }
      if (count) storeBillableAssetCount(count);
      const query = { plan: planId };
      if (uploadDone) {
        query.returnTo = nextAfterPay;
        setBillingReturnTo(nextAfterPay);
      } else {
        query.returnTo = UPLOAD_RETURN_PATH;
        query.resume = '1';
        setBillingReturnTo(`${UPLOAD_RETURN_PATH}?resume=1`);
      }
      if (count) query.assets = String(count);
      if (mode === 'testing' || mode === 'management_testing' || source === 'scope' || source === 'scope-csv' || source === 'scope-manual') {
        query.mode = 'testing';
        query.source = 'scope';
        setPremiumEntrySource('scope');
      } else if (source === 'upload' || mode === 'management') {
        query.mode = 'management';
        query.source = 'upload';
        setPremiumEntrySource('upload');
      }
      this.$router.push({ path: '/pricingplan', query });
    },
    planLabel(planId) {
      return planDisplayName(planId);
    },
    planContinueCopy(planId, source = 'upload') {
      const saved = source === 'upload' ? 'Your file is saved.' : 'Your scope is saved.';
      const plan = String(planId || '').toLowerCase();
      if (plan === 'freemium') {
        return `${saved} Continue with Freemium — extra assets stay locked until you upgrade (no re-upload). Next you will add users, set risk criteria, then open the dashboard.`;
      }
      if (plan === 'custom') {
        return `${saved} Continue with Custom and contact sales for a quote. After confirmation you will add users, set risk criteria, then open the dashboard.`;
      }
      return `${saved} Continue with Premium and complete payment. After payment you will add users, set risk criteria, then open the dashboard.`;
    },
    dashboardRoute() {
      return '/communication';
    },
    showUploadError(backendMessage) {
      const msg = String(backendMessage || '').trim();
      if (isNetworkOrTransportError(msg)) {
        const text = uploadTransportErrorMessage(msg);
        this.uploadError = text;
        Swal.fire({
          icon: 'error',
          title: 'Upload failed',
          text,
          confirmButtonText: 'OK',
          confirmButtonColor: '#241447',
        });
        return;
      }
      // Freemium/undecided global content-hash duplicate (any admin's prior upload).
      if (isDuplicateFileUploadMessage(msg)) {
        this.uploadError = DUPLICATE_FILE_UPLOAD_MESSAGE;
        Swal.fire({
          icon: 'error',
          title: 'Duplicate file',
          text: DUPLICATE_FILE_UPLOAD_MESSAGE,
          confirmButtonText: 'OK',
          confirmButtonColor: '#241447',
        });
        return;
      }
      const files = this.currentSelectedUploadFiles();
      const freemiumChosen =
        String(this.pendingPlan || this.planSuggestActivePlan || '').toLowerCase() === 'freemium';
      // Before plan choice: never show Freemium 1-file / replace alerts — open plan picker instead.
      if (
        !hasFreemiumRestrictions(this.subscription) &&
        !freemiumChosen &&
        (isFreemiumReportUploadLimitMessage(msg) || isFreemiumSingleFileRequiredMessage(msg))
      ) {
        void this.openPlanChoiceBeforeFreemiumGate(files);
        return;
      }
      const freemiumBlock = classifyFreemiumUploadBlock({
        planId: this.pendingPlan || this.planSuggestActivePlan || '',
        isFreemiumActive: hasFreemiumRestrictions(this.subscription),
        fileCount: files.length,
        message: msg,
        details: null,
      });
      if (freemiumBlock === 'multi_file') {
        void this.showFreemiumSingleFileBackPrompt(files.length || 2);
        return;
      }
      this.uploadError = msg || 'Invalid file';
      Swal.fire({
        icon: 'error',
        title: isInvalidScanFileMessage(msg) ? 'Invalid file' : 'Upload failed',
        text: this.uploadError,
        confirmButtonText: 'OK',
        confirmButtonColor: '#241447',
      });
    },
    /**
     * Upload hit a Freemium-style backend limit before the user picked a plan.
     * Send them to Freemium / Premium / Custom — Freemium + multi-file alert comes after that.
     */
    async openPlanChoiceBeforeFreemiumGate(files = []) {
      this.uploadError = '';
      this.uploading = false;
      const list = (files && files.length ? files : this.currentSelectedUploadFiles()).filter(Boolean);
      if (list.length) {
        this.selectedFiles = list;
        this.selectedFile = list[0];
        this.lastUploadFileCount = list.length;
        this.lastUploadFileNames = list.map((f) => String(f?.name || '').trim()).filter(Boolean);
        rememberUploadedScanFiles(this.lastUploadFileNames);
        try {
          await stashPendingUpload(list, {
            count: 0,
            plan: '',
            name: list[0]?.name,
          });
        } catch {
          /* ignore */
        }
      }
      const count = (await this.resolveUniqueIpCount()) || 0;
      const hinted = list.length > 1 ? 'premium' : suggestedPlanFromAssetCount(count) || 'premium';
      this.planSuggestResolved = false;
      this.generating = false;
      this.stopPolling();
      // Never pass file-count as IP count (2 files ≠ 2 IPs).
      if (this.showPlanSuggestPrompt('upload', count, hinted, true)) {
        return true;
      }
      this.planSuggestPrompt = {
        source: 'upload',
        count: count || 0,
        suggested: hinted,
        suggestedName: planDisplayName(hinted),
        otherPlans: otherPlans(hinted),
        unpaidResume: true,
      };
      return true;
    },
    currentSelectedUploadFiles() {
      if (this.selectedFiles?.length) return this.selectedFiles;
      if (this.selectedFile) return [this.selectedFile];
      return [];
    },
    uploadedFileNameCount() {
      const names = this.existingReport?.uploaded_file_names;
      if (Array.isArray(names) && names.length) return names.length;
      return 0;
    },
    freemiumEffectiveFileCount() {
      const selected = this.currentSelectedUploadFiles().length;
      if (selected > 0) return selected;
      if (this.freemiumSinglePick || isFreemiumSinglePickIntent()) {
        if (this.freemiumKeepFileNames.length) return this.freemiumKeepFileNames.length;
        const sessionCount = peekUploadedScanFileCount();
        const lastNames = (this.lastUploadFileNames || []).map((n) => String(n || '').trim()).filter(Boolean).length;
        const lastCount = Number(this.lastUploadFileCount) || 0;
        return Math.max(sessionCount, lastNames, lastCount);
      }
      const sessionCount = peekUploadedScanFileCount();
      const lastNames = (this.lastUploadFileNames || []).map((n) => String(n || '').trim()).filter(Boolean).length;
      const lastCount = Number(this.lastUploadFileCount) || 0;
      const fromApi = this.uploadedFileNameCount();
      const fromBoard = Array.isArray(this.existingUploadedFiles) ? this.existingUploadedFiles.length : 0;
      const fromPlanCard = Array.isArray(this.planSuggestDisplayedFiles)
        ? this.planSuggestDisplayedFiles.length
        : 0;
      return Math.max(sessionCount, lastNames, lastCount, fromApi, fromBoard, fromPlanCard);
    },
    collectFreemiumTrimFileNames() {
      const names = [];
      const push = (raw) => {
        const name = String(raw || '').trim();
        if (!name || names.includes(name)) return;
        names.push(name);
      };
      (this.freemiumKeepFileNames || []).forEach(push);
      (this.lastUploadFileNames || []).forEach(push);
      peekUploadedScanFileNames().forEach(push);
      const fromApi = this.existingReport?.uploaded_file_names;
      if (Array.isArray(fromApi)) fromApi.forEach(push);
      const fromFiles = this.existingReport?.files;
      if (Array.isArray(fromFiles)) {
        fromFiles.forEach((item) => {
          if (typeof item === 'string') push(item);
          else push(item?.file_name || item?.filename || item?.name);
        });
      }
      this.currentSelectedUploadFiles().forEach((f) => push(f?.name));
      return names;
    },
    /**
     * Leave plan / agents screens and land on the real upload dropzone.
     * Used by ← Back and Freemium "Back to upload report".
     */
    resetToUploadPicker(options = {}) {
      const keepError = options.keepError === true;
      const errorText = keepError ? String(this.uploadError || '') : '';
      const mode =
        options.mode === 'scope-csv' || options.mode === 'scope-manual'
          ? options.mode
          : 'upload';
      const forFreemiumSingle = options.freemiumSingle === true;
      const preservedNames = forFreemiumSingle
        ? this.collectFreemiumTrimFileNames()
        : [];
      this.stopPolling();
      this.generating = false;
      this.redirecting = false;
      this.reportIds = [];
      this.statusByReportId = {};
      clearPersistedAgentGeneration();
      this.planSuggestPrompt = null;
      this.planLimitPrompt = null;
      this.uploadPlanOffer = null;
      this.savedSuggestPrompt = null;
      this.planSuggestResolved = true;
      this.planFitNotice = null;
      this.pendingPlan = forFreemiumSingle ? 'freemium' : '';
      this.planSuggestBusy = false;
      this.planSuggestActivePlan = '';
      this.uploading = false;
      this.replacingFile = true;
      this.freemiumSinglePick = forFreemiumSingle;
      this.freemiumContinueBusy = false;
      this.loadingExistingReport = false;
      if (forFreemiumSingle) {
        markFreemiumSinglePickIntent();
        this.freemiumKeepFileNames = preservedNames.length
          ? preservedNames
          : peekUploadedScanFileNames();
        if (this.freemiumKeepFileNames.length) {
          rememberUploadedScanFiles(this.freemiumKeepFileNames);
          this.lastUploadFileNames = [...this.freemiumKeepFileNames];
          this.lastUploadFileCount = this.freemiumKeepFileNames.length;
        }
      } else {
        this.freemiumKeepFileNames = [];
        this.existingReport = null;
        this.lastUploadFileNames = [];
        this.lastUploadFileCount = 0;
      }
      this.clearFileState();
      if (keepError && errorText) this.uploadError = errorText;
      this.viewMode = mode;
      const query = { ...this.$route.query, replace: '1', mode };
      if (forFreemiumSingle) query.freemiumSingle = '1';
      else delete query.freemiumSingle;
      delete query.resume;
      this.$router.replace({ path: '/admin-upload-report', query }).catch(() => {});
      if (forFreemiumSingle) {
        void this.hydrateFreemiumTrimFiles();
      }
      this.$nextTick(() => {
        const root = this.$el;
        const el =
          (root && root.querySelector && root.querySelector('.aur-scope-board')) ||
          (root && root.querySelector && root.querySelector('.aur-dropzone'));
        if (el && el.scrollIntoView) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    },
    async hydrateFreemiumTrimFiles() {
      try {
        const authStore = useAuthStore();
        const res = await authStore.fetchActiveUploadReport();
        if (res.status && res.data) {
          // Keep report id for replace, but trim UI uses freemiumKeepFileNames.
          this.existingReport = res.data;
          const names = this.collectFreemiumTrimFileNames();
          if (names.length) {
            this.freemiumKeepFileNames = names;
            rememberUploadedScanFiles(names);
            this.lastUploadFileNames = [...names];
            this.lastUploadFileCount = names.length;
          }
        }
      } catch {
        /* names from session still usable */
      }
      try {
        const { peekPendingUploadFiles } = await import('@/utils/pendingUpload');
        const pending = await peekPendingUploadFiles();
        if (pending.length) {
          const keep = new Set(this.freemiumKeepFileNames);
          const matched = keep.size
            ? pending.filter((f) => keep.has(f.name))
            : pending;
          if (matched.length) {
            this.selectedFiles = matched;
            this.selectedFile = matched[0];
            if (!this.freemiumKeepFileNames.length) {
              this.freemiumKeepFileNames = matched.map((f) => f.name);
            }
          }
        }
      } catch {
        /* ignore */
      }
    },
    removeFreemiumKeepFile(index) {
      this.freemiumKeepFileNames = this.freemiumKeepFileNames.filter((_, i) => i !== index);
      rememberUploadedScanFiles(this.freemiumKeepFileNames);
      this.lastUploadFileNames = [...this.freemiumKeepFileNames];
      this.lastUploadFileCount = this.freemiumKeepFileNames.length;
      const keep = new Set(this.freemiumKeepFileNames);
      this.selectedFiles = this.selectedFiles.filter((f) => keep.has(f.name));
      this.selectedFile = this.selectedFiles[0] || null;
      this.uploadError = '';
    },
    async continueFreemiumWithOneFile() {
      if (!this.canContinueFreemiumWithOneFile) return;
      const keepName = this.freemiumKeepFileNames[0];
      this.freemiumContinueBusy = true;
      this.uploadError = '';
      try {
        let file = this.selectedFiles.find((f) => f.name === keepName) || null;
        if (!file) {
          try {
            const { peekPendingUploadFiles } = await import('@/utils/pendingUpload');
            const pending = await peekPendingUploadFiles();
            file = pending.find((f) => f.name === keepName) || null;
          } catch {
            /* ignore */
          }
        }
        if (!file) {
          await Swal.fire({
            icon: 'info',
            title: 'Select this file again',
            html: `Keep <strong>${keepName}</strong>. Browse and select that one file below, then click Continue with Freemium again.`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#241447',
          });
          return;
        }
        this.selectedFiles = [file];
        this.selectedFile = file;
        this.pendingPlan = 'freemium';
        this.replacingFile = true;
        this.freemiumSinglePick = false;
        this.freemiumKeepFileNames = [keepName];
        rememberUploadedScanFiles([keepName]);
        this.lastUploadFileNames = [keepName];
        this.lastUploadFileCount = 1;
        await this.startUpload();
      } finally {
        this.freemiumContinueBusy = false;
      }
    },
    async showFreemiumSingleFileBackPrompt(fileCount = 0) {
      const n = Number(fileCount) || this.freemiumEffectiveFileCount() || 2;
      this.uploadError = '';
      this.planSuggestBusy = false;
      this.planSuggestActivePlan = '';

      const result = await Swal.fire({
        icon: 'warning',
        title: 'Freemium allows 1 file',
        html: `Freemium plan allows only <strong>1 file</strong> upload.<br/>You selected <strong>${n}</strong> files.<br/><br/>Go back to Upload Report and keep one file, then choose Freemium again — or upgrade to Premium for multiple files.`,
        confirmButtonText: 'Back to upload report',
        showCancelButton: true,
        cancelButtonText: 'Upgrade to Premium',
        confirmButtonColor: '#241447',
        cancelButtonColor: '#64748b',
        reverseButtons: true,
        allowOutsideClick: false,
      });

      if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
        const count =
          this.recommendAssetCount() ||
          Number(this.planSuggestPrompt?.count) ||
          (await this.resolveUniqueIpCount()) ||
          0;
        const alreadyOnServer = !!(this.hasExistingReport || this.uploadResult || this.existingReportId);
        this.planSuggestPrompt = null;
        this.goToPricing('premium', count, alreadyOnServer, { mode: 'management', source: 'upload' });
        return true;
      }

      // Back to upload — clear previous report board; Freemium needs one fresh file.
      this.uploadError = '';
      this.resetToUploadPicker({ keepError: false, freemiumSingle: true });
      return true;
    },
    async guardFreemiumMultiFile(planId = '') {
      // Only when Freemium is chosen (or already active) — never on Premium/Custom.
      const plan = String(planId || '').toLowerCase();
      if (plan && plan !== 'freemium') return true;
      const fileCount = this.freemiumEffectiveFileCount();
      const freemiumContext = plan === 'freemium' || hasFreemiumRestrictions(this.subscription);
      if (
        !freemiumBlocksMultiFileUpload({
          planId: freemiumContext ? 'freemium' : '',
          isFreemiumActive: hasFreemiumRestrictions(this.subscription),
          fileCount,
        })
      ) {
        clearFreemiumSinglePickIntent();
        this.freemiumSinglePick = false;
        return true;
      }
      await this.showFreemiumSingleFileBackPrompt(fileCount);
      return false;
    },
    showInvalidFileError(backendMessage) {
      this.showUploadError(backendMessage);
    },
    async activateFreemiumAndContinue() {
      this.planSuggestBusy = true;
      this.uploadError = '';
      try {
        if (isActiveSubscription(this.subscription) && isFreemiumPlan(this.subscription)) {
          clearFreemiumSinglePickIntent();
          this.freemiumSinglePick = false;
          setCachedPaidPlan(true);
          markFreemiumActiveNotice();
          useAuthStore().unmarkStepCompleted(1);
          await maybeShowReturnToChatPlatformPopup();
          await this.$router.replace(this.dashboardRoute());
          return;
        }
        const data = await checkoutFreemium(false);
        this.subscription = data?.subscription || this.subscription;
        clearFreemiumSinglePickIntent();
        this.freemiumSinglePick = false;
        setCachedPaidPlan(true);
        markFreemiumActiveNotice();
        useAuthStore().lockAutomationScriptsForFreemium(
          'Automation scripts are not available on the Freemium plan. Upgrade to Premium to download scripts.',
        );
        useAuthStore().unmarkStepCompleted(1);
        if (!hasChatHandoffSource()) {
          await this.toastNotice(
            'success',
            'Freemium started',
            'Your free plan is active. Continue to add your team.',
            1800,
          );
        }
        await maybeShowReturnToChatPlatformPopup();
        await this.$router.replace(this.dashboardRoute());
      } catch (error) {
        const message = billingErrorMessage(error);
        if (isScopeBlocksFreemiumError(error, message)) {
          await Swal.fire({
            icon: 'info',
            title: 'Premium required',
            text: message || 'Scope is pending Super Admin review. Freemium is not available — continue with Premium.',
            confirmButtonText: 'Continue with Premium',
            confirmButtonColor: '#241447',
          });
          const count = this.existingEntryCount || this.manualTargetCount || 0;
          await this.continueToPremiumTestingAfterScope(count, '', '');
          return;
        }
        if (isExistingSubscriptionMessage(message)) {
          setCachedPaidPlan(true);
          markFreemiumActiveNotice();
          await this.loadSubscription();
          useAuthStore().unmarkStepCompleted(1);
          await maybeShowReturnToChatPlatformPopup();
          await this.$router.replace(this.dashboardRoute());
          return;
        }
        this.uploadError = message;
        await Swal.fire({
          icon: 'error',
          title: 'Could not start Freemium',
          text: message,
          confirmButtonColor: '#241447',
        });
      } finally {
        this.planSuggestBusy = false;
        this.planSuggestActivePlan = '';
      }
    },
    showPlanSuggestPrompt(source, count, hintedPlan = '', unpaidResume = false) {
      if (this.planSuggestResolved && !unpaidResume && !this.pendingPlan) return false;
      let n = Number(count) || 0;
      if (source === 'upload') {
        const unique = this.recommendAssetCount();
        if (unique) n = unique;
      }
      if (source === 'scope-csv' || source === 'scope-manual') {
        this.planSuggestResolved = true;
        this.planSuggestPrompt = null;
        this.uploadPlanOffer = null;
        this.$nextTick(() => this.continueToPremiumTestingAfterScope(n, '', ''));
        return true;
      }
      if (this.pendingPlan) {
        const limit = planAssetLimit(this.pendingPlan);
        if (extraIpCount(n, limit) > 0 && planBlocksOversizedUpload(this.pendingPlan)) {
          this.planFitNotice = {
            plan: this.pendingPlan,
            planName: planDisplayName(this.pendingPlan),
            limit,
            count: n,
            source: source === 'scope-csv' || source === 'scope-manual' ? source : 'upload',
          };
          this.planSuggestPrompt = null;
          this.uploadPlanOffer = null;
          this.viewMode = source === 'scope-csv'
            ? 'scope-csv'
            : source === 'scope-manual'
              ? 'scope-manual'
              : 'upload';
          return true;
        }
        this.planSuggestResolved = true;
        this.planFitNotice = null;
        this.$nextTick(() => this.continueWithSelectedPlan(this.pendingPlan, n));
        return true;
      }
      if (this.planSuggestResolved && !unpaidResume) return false;
      const suggested = hintedPlan || (n > 0 ? suggestedPlanFromAssetCount(n) : '');
      if (!suggested) return false;
      const currentPlan = String(this.subscription?.plan || '').toLowerCase();
      const currentLimit = planAssetLimit(this.subscription);
      // Freemium already active: extras lock on the backend — do not stop redirect with a plan picker.
      if (!unpaidResume && isActiveSubscription(this.subscription) && isFreemiumPlan(this.subscription)) {
        this.planSuggestResolved = true;
        return false;
      }
      if (!unpaidResume && isActiveSubscription(this.subscription) && n && n <= currentLimit && currentPlan === suggested) {
        this.planSuggestResolved = true;
        return false;
      }
      if (!unpaidResume && isActiveSubscription(this.subscription) && n && n <= currentLimit) {
        this.planSuggestResolved = true;
        return false;
      }
      const other = otherPlans(suggested);
      this.planSuggestPrompt = {
        source,
        count: n,
        suggested,
        suggestedName: planDisplayName(suggested),
        otherPlans: other,
        unpaidResume: !!unpaidResume,
      };
      this.setUploadPlanOffer(n, suggested);
      if (source === 'upload') {
        this.refreshPlanSuggestUniqueCount();
      }
      return true;
    },
    async refreshPlanSuggestUniqueCount() {
      const unique = await this.resolveUniqueIpCount();
      if (!this.planSuggestPrompt || this.planSuggestPrompt.source !== 'upload') return;
      if (!unique || unique === this.planSuggestPrompt.count) return;
      const suggested = suggestedPlanFromAssetCount(unique);
      this.planSuggestPrompt = {
        ...this.planSuggestPrompt,
        count: unique,
        suggested: suggested || this.planSuggestPrompt.suggested,
        suggestedName: suggested ? planDisplayName(suggested) : this.planSuggestPrompt.suggestedName,
        otherPlans: suggested ? otherPlans(suggested) : this.planSuggestPrompt.otherPlans,
      };
      this.setUploadPlanOffer(unique, this.planSuggestPrompt.suggested);
    },
    setUploadPlanOffer(count, suggested) {
      if (!suggested) {
        this.uploadPlanOffer = null;
        return;
      }
      const n = Number(count) || 0;
      this.uploadPlanOffer = {
        count: n,
        suggested,
        suggestedName: planDisplayName(suggested),
        otherPlans: otherPlans(suggested),
      };
    },
    handleUploadPlanFailure(res) {
      const payload = res?.details || res?.data || {};
      const message = String(res?.message || '');
      const errorBlob = [
        message,
        payload.detail,
        payload.error,
        payload.message,
        Array.isArray(payload.errors)
          ? payload.errors.map((item) => (typeof item === 'string' ? item : item?.error || item?.message || '')).join(' ')
          : '',
      ]
        .filter(Boolean)
        .join(' ');
      // Retired: upload always succeeds. Extra Freemium assets lock instead of over_limit.
      if (
        payload.over_limit === true ||
        payload.trim_over_limit === true ||
        payload.freemium_trimmed === true ||
        /over_limit|trim_over_limit/i.test(errorBlob)
      ) {
        return false;
      }
      const hint = parsePlanHintFromMessage(errorBlob);
      const count = Number(
        payload.unique_ip_count ||
        hint.count ||
        0,
      );
      const suggested = hint.suggested || (count ? suggestedPlanFromAssetCount(count) : '');
      this.uploadError = message || 'Invalid file';
      if (isNetworkOrTransportError(errorBlob)) {
        return false;
      }
      if (isInvalidScanFileMessage(errorBlob) || !count || !this.isPlanLimitError(payload, message)) {
        return false;
      }
      if (this.pendingPlan) {
        this.planFitNotice = {
          plan: this.pendingPlan,
          planName: planDisplayName(this.pendingPlan),
          limit: planAssetLimit(this.pendingPlan),
          count: count || this.planFitNotice?.count || 0,
          source: 'upload',
        };
        this.uploadPlanOffer = null;
        return true;
      }
      this.planSuggestResolved = false;
      this.resolveUniqueIpCount().then((unique) => {
        this.showPlanSuggestPrompt('upload', unique, suggested, true);
      });
      return true;
      if (count && this.isPlanLimitError(payload, message) && this.showPlanLimitPrompt('upload', count)) {
        return true;
      }
      return false;
    },
    async promptUnpaidPlanChoice(source = 'upload', count = 0) {
      if (isClaimInviteFlow()) return false;
      await this.loadSubscription();
      if (isActiveSubscription(this.subscription)) return false;
      const n = source === 'upload'
        ? await this.resolveUniqueIpCount(count)
        : (Number(count) || this.existingEntryCount || 0);
      this.planSuggestResolved = false;
      return this.showPlanSuggestPrompt(source, n, '', true);
    },
    async confirmSuggestedPlan() {
      if (!this.planSuggestPrompt) return;
      await this.selectPlanForUpload(this.planSuggestPrompt.suggested);
    },
    chooseOtherPlan(planId) {
      return this.selectPlanForUpload(planId);
    },
    replaceUploadedFile() {
      const source = this.planSuggestPrompt?.source || this.savedSuggestPrompt?.source || 'upload';
      const mode =
        source === 'scope-csv'
          ? 'scope-csv'
          : source === 'scope-manual'
            ? 'scope-manual'
            : 'upload';
      this.resetToUploadPicker({ mode });
    },
    async continueWithExistingFile() {
      if (this.uploading || this.planSuggestBusy || this.redirecting) return;
      this.replacingFile = false;
      this.planFitNotice = null;
      this.pendingPlan = '';
      this.uploadPlanOffer = null;
      this.clearFileState();
      this.planSuggestBusy = true;
      try {
        await this.loadSubscription();
        const returnTo = this.$route?.query?.returnTo;
        const safeReturn =
          typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
            ? returnTo
            : '';

        if (isClaimInviteFlow() || isActiveSubscription(this.subscription)) {
          this.redirecting = true;
          if (isFreemiumPlan(this.subscription)) {
            markFreemiumActiveNotice();
          }
          if (safeReturn) {
            await this.$router.replace(safeReturn);
            return;
          }
          await this.goAfterUploadReady();
          return;
        }

        const count = this.viewMode === 'upload'
          ? await this.resolveUniqueIpCount()
          : Number(this.existingEntryCount || 0);
        this.planSuggestResolved = false;
        const source = this.viewMode === 'scope-csv'
          ? 'scope-csv'
          : this.viewMode === 'scope-manual'
            ? 'scope-manual'
            : 'upload';
        if (this.showPlanSuggestPrompt(source, count, '', true)) return;
        const planId = suggestedPlanFromAssetCount(count) || 'premium';
        this.goToPricing(
          planId,
          count,
          true,
          source === 'upload' ? { mode: 'management', source: 'upload' } : { mode: 'testing' },
        );
      } finally {
        this.planSuggestBusy = false;
        this.planSuggestActivePlan = '';
      }
    },
    backToPlanChoices() {
      this.planLimitPrompt = null;
      this.planLimitBusy = false;
      if (this.savedSuggestPrompt) {
        const unique = this.recommendAssetCount();
        this.planSuggestPrompt = unique
          ? { ...this.savedSuggestPrompt, count: unique }
          : this.savedSuggestPrompt;
        this.savedSuggestPrompt = null;
        return;
      }
      this.resolveUniqueIpCount().then((count) => {
        this.showPlanSuggestPrompt('upload', count, '', true);
      });
    },
    requireFileForPlan(planId, source = 'upload', count = 0) {
      const limit = planAssetLimit(planId);
      this.pendingPlan = planId;
      this.planFitNotice = {
        plan: planId,
        planName: planDisplayName(planId),
        limit,
        count: Number(count) || 0,
        source: source === 'scope-csv' || source === 'scope-manual' ? source : 'upload',
      };
      this.planSuggestPrompt = null;
      this.planLimitPrompt = null;
      this.uploadPlanOffer = null;
      this.savedSuggestPrompt = null;
      this.planSuggestResolved = true;
      this.clearFileState();
      if (source === 'scope-csv') this.viewMode = 'scope-csv';
      else if (source === 'scope-manual') this.viewMode = 'scope-manual';
      else this.viewMode = 'upload';
    },
    backToPlanChoicesFromNotice() {
      const count = this.planFitNotice?.count || this.existingReportIpCount || this.existingEntryCount || 0;
      const source = this.viewMode === 'scope-csv'
        ? 'scope-csv'
        : this.viewMode === 'scope-manual'
          ? 'scope-manual'
          : 'upload';
      this.pendingPlan = '';
      this.planFitNotice = null;
      this.planSuggestResolved = false;
      this.showPlanSuggestPrompt(source, count, '', true);
    },
    async continuePendingPlanDespiteOversize() {
      const planId = this.pendingPlan || this.planFitNotice?.plan;
      const count = this.planFitNotice?.count || this.existingReportIpCount || this.existingEntryCount || 0;
      this.planFitNotice = null;
      if (!planId) return;
      await this.continueWithSelectedPlan(planId, count);
    },
    async selectPlanForUpload(planId) {
      if (!planId || this.uploading) return;
      this.planSuggestActivePlan = planId;
      // Freemium + 2+ files → alert here (after plan click). Premium/Custom skip this.
      if (String(planId).toLowerCase() === 'freemium' && !(await this.guardFreemiumMultiFile('freemium'))) {
        return;
      }
      const source =
        this.planSuggestPrompt?.source ||
        this.uploadPlanOffer?.source ||
        (this.viewMode === 'scope-csv' ? 'scope-csv' : this.viewMode === 'scope-manual' ? 'scope-manual' : 'upload');
      const count = Number(
        (source === 'upload' ? this.recommendAssetCount() : 0) ||
        this.planSuggestPrompt?.count ||
        this.uploadPlanOffer?.count ||
        this.planLimitPrompt?.count ||
        this.existingReportIpCount ||
        this.existingEntryCount ||
        0,
      );
      const extra = extraIpCount(count, planAssetLimit(planId));
      if (extra > 0 && planBlocksOversizedUpload(planId)) {
        this.requireFileForPlan(planId, source, count);
        return;
      }
      await this.continueWithSelectedPlan(planId, count);
    },
    async continueWithSelectedPlan(planId, assetCount = 0) {
      if (!planId || this.uploading) return;
      if (String(planId).toLowerCase() === 'freemium' && !(await this.guardFreemiumMultiFile('freemium'))) {
        return;
      }
      const fromScopeTesting =
        this.viewMode === 'scope-csv' ||
        this.viewMode === 'scope-manual' ||
        this.planSuggestPrompt?.source === 'scope-csv' ||
        this.planSuggestPrompt?.source === 'scope-manual';
      // Resolve real merged unique IPs before Premium checkout (never file-count).
      const resolvedUnique = fromScopeTesting ? 0 : await this.resolveUniqueIpCount(assetCount);
      const count =
        resolvedUnique ||
        (fromScopeTesting ? 0 : this.recommendAssetCount()) ||
        Number(assetCount) ||
        Number(this.uploadPlanOffer?.count) ||
        Number(this.planSuggestPrompt?.count) ||
        Number(this.planLimitPrompt?.count) ||
        Number(this.planFitNotice?.count) ||
        this.existingReportIpCount ||
        this.existingEntryCount ||
        0;
      const files = this.selectedFiles.length
        ? this.selectedFiles
        : (this.selectedFile ? [this.selectedFile] : []);
      const alreadyOnServer = !!(this.hasExistingReport || this.uploadResult || this.existingReportId);
      const fromScope =
        fromScopeTesting ||
        (!!this.hasExistingScope && !this.hasExistingReport);
      this.planSuggestBusy = true;
      this.uploadError = '';

      if (fromScope && (planId === 'freemium' || !planId)) {
        planId = Number(count) > 250 ? 'custom' : 'premium';
      }

      if (planId === 'freemium') {
        this.uploadBeforePay = false;
        if (fromScope) markScopeAwaitingScan();
        await this.activateFreemiumAndContinue();
        return;
      }

      this.uploadPlanOffer = null;
      this.planSuggestPrompt = null;
      this.pendingPlan = '';
      this.planFitNotice = null;
      this.uploadBeforePay = false;
      if (fromScopeTesting) markScopeFileAwaitingSuperadmin(readStoredAdminEmail());
      else if (fromScope) markScopeAwaitingScan();

      // Paid plans: go to checkout first. Re-uploading while still Freemium
      // hits the 5-IP limit and never opens Premium payment.
      if (!alreadyOnServer && files.length) {
        try {
          await stashPendingUpload(files, { count, plan: planId, name: files[0].name });
        } catch {
          /* still open pricing */
        }
      }

      this.planSuggestBusy = false;
      this.planSuggestActivePlan = '';
      this.goToPricing(
        planId,
        count,
        alreadyOnServer,
        fromScope
          ? { mode: 'testing', source: 'scope' }
          : { mode: 'management', source: 'upload' },
      );
    },
    async finishSuccessfulUpload(res) {
      this.uploadPct = 100;
      this.uploadResult = res.data;
      const clientNames = (this.selectedFiles.length
        ? this.selectedFiles
        : this.selectedFile
          ? [this.selectedFile]
          : []
      )
        .map((file) => String(file?.name || '').trim())
        .filter(Boolean);
      if (clientNames.length) {
        this.lastUploadFileNames = clientNames;
        this.lastUploadFileCount = clientNames.length;
        rememberUploadedScanFiles(clientNames);
      }
      const unique = uniqueIpCountFields(res.data);
      if (unique) {
        this.fileDetectedIpCount = unique;
        storeBillableAssetCount(unique);
      }
      const authStore = useAuthStore();
      if (unique) authStore.captureUniqueIpCount(res.data);
      const reportIds = this.extractReportIds(res.data);
      if (!reportIds.length) {
        this.uploadError = 'Upload succeeded but no report_id was returned.';
        Swal.fire('Upload incomplete', this.uploadError, 'warning');
        return false;
      }
      try {
        authStore.setActiveReportId(reportIds[0]);
        await this.loadExistingReport();
        const mergeNames = (existing = []) => {
          const out = [];
          const push = (raw) => {
            const name = String(raw || '').trim();
            if (!name || out.includes(name)) return;
            out.push(name);
          };
          (existing || []).forEach(push);
          clientNames.forEach(push);
          (this.lastUploadFileNames || []).forEach(push);
          return out;
        };
        if (!this.existingReport) {
          try {
            const getRes = await authStore.getUploadReportById(reportIds[0]);
            if (getRes.status && getRes.data) {
              const names = mergeNames(authStore.extractUploadedFileNames(getRes.data));
              this.existingReport = {
                ...getRes.data,
                report_id: getRes.data.report_id || getRes.data.id || getRes.data._id || reportIds[0],
                resolved_file_name:
                  names[0] ||
                  authStore.extractUploadedFileName(getRes.data) ||
                  getRes.data.file_name ||
                  getRes.data.filename ||
                  clientNames[0] ||
                  null,
                uploaded_file_names: names,
                files: Array.isArray(getRes.data.files) ? getRes.data.files : getRes.data.files,
              };
            }
          } catch (getErr) {
            console.error('Report GET after upload failed:', getErr);
          }
        } else {
          const names = mergeNames([
            ...(Array.isArray(this.existingReport.uploaded_file_names)
              ? this.existingReport.uploaded_file_names
              : []),
            ...authStore.extractUploadedFileNames(this.existingReport),
            ...authStore.extractUploadedFileNames(res.data),
          ]);
          this.existingReport = {
            ...this.existingReport,
            uploaded_file_names: names,
            resolved_file_name: this.existingReport.resolved_file_name || names[0] || null,
            files: Array.isArray(this.existingReport.files)
              ? this.existingReport.files
              : Array.isArray(res.data?.files)
                ? res.data.files
                : this.existingReport.files,
          };
        }
        if (!this.existingReport && clientNames.length) {
          this.existingReport = {
            report_id: reportIds[0],
            uploaded_file_names: clientNames,
            resolved_file_name: clientNames[0],
            unique_ip_count: unique || null,
          };
        }
        // Keep multi-file blobs for Freemium trim ("keep 1" → re-upload).
        const filesToStash = this.selectedFiles.length
          ? [...this.selectedFiles]
          : this.selectedFile
            ? [this.selectedFile]
            : [];
        if (filesToStash.length > 1) {
          try {
            await stashPendingUpload(filesToStash, {
              count: unique || 0,
              plan: '',
              name: filesToStash[0]?.name || '',
            });
          } catch {
            /* ignore */
          }
        } else {
          try {
            await clearPendingUpload();
          } catch {
            /* ignore */
          }
        }
        this.selectedFiles = [];
        this.selectedFile = null;
        this.uploading = false;
        this.startPolling(reportIds);
        try {
          const { syncSubscriptionAssets } = await import('@/services/billingApi');
          await syncSubscriptionAssets();
        } catch {
          /* no active premium subscription, or billing not ready yet */
        }
        return true;
      } catch (err) {
        console.error('Post-upload setup failed:', err);
        if (!this.generating && reportIds.length) {
          this.startPolling(reportIds);
        }
        return this.generating || reportIds.length > 0;
      }
    },
    async resumePendingUploadIfNeeded() {
      if (String(this.$route.query.resume || '') !== '1') return;
      if (String(this.$route.query.replace || '') === '1') return;
      const files = await peekPendingUploadFiles();
      if (!files.length) return;
      this.viewMode = 'upload';
      this.selectedFiles = files;
      this.selectedFile = files[0];
      await this.startUpload();
    },
    showPlanLimitPrompt(source, count) {
      if (isFreemiumPlan(this.subscription)) return false;
      const limit = planAssetLimit(this.subscription);
      const extra = extraIpCount(count, limit);
      if (!extra) return false;
      this.planLimitPrompt = {
        source,
        count,
        limit,
        extra,
        planName: planDisplayName(this.subscription),
      };
      return true;
    },
    cancelPlanLimitPrompt() {
      this.planLimitBusy = false;
      this.generating = false;
      this.stopPolling();
      if (this.savedSuggestPrompt) {
        this.planLimitPrompt = null;
        this.planSuggestPrompt = this.savedSuggestPrompt;
        this.savedSuggestPrompt = null;
        return;
      }
      this.planLimitPrompt = null;
    },
    upgradePlan() {
      const count = this.planLimitPrompt?.count || 0;
      const suggested = suggestedPlanFromAssetCount(count);
      this.planLimitPrompt = null;
      if (count && suggested) this.setUploadPlanOffer(count, suggested);
      this.selectPlanForUpload(suggested);
    },
    async keepSamePlan() {
      if (!this.planLimitPrompt) return;
      this.planLimitBusy = true;
      try {
        const source = this.planLimitPrompt.source;
        const limit = this.planLimitPrompt.limit;
        const count = this.planLimitPrompt.count;
        const chosenPlan = this.planLimitPrompt.chosenPlan
          || String(this.subscription?.plan || 'freemium').toLowerCase();
        if (source === 'upload') {
          this.planLimitResolved = true;
          this.planLimitPrompt = null;
          await this.loadSubscription();
          if (!isActiveSubscription(this.subscription)) {
            this.goToPricing(chosenPlan, count || limit, true, { mode: 'management', source: 'upload' });
            return;
          }
          await this.redirectAfterAgentsReady();
          return;
        }
        if (source === 'scope-manual') {
          this.manualScopeText = this.manualTargets.slice(0, limit).join('\n');
          this.planLimitPrompt = null;
          this.planLimitResolved = true;
          this.planLimitBusy = false;
          await this.loadSubscription();
          if (!isActiveSubscription(this.subscription) || isFreemiumPlan(this.subscription)) {
            await this.continueToPremiumTestingAfterScope(count || limit, '', '');
            return;
          }
          await this.submitScopeManual();
          return;
        }
        if (source === 'scope-csv') {
          this.selectedFile = await this.trimCsvFile(this.selectedFile, limit);
          this.planLimitPrompt = null;
          this.planLimitResolved = true;
          this.planLimitBusy = false;
          await this.loadSubscription();
          if (!isActiveSubscription(this.subscription) || isFreemiumPlan(this.subscription)) {
            await this.continueToPremiumTestingAfterScope(count || limit, '', '');
            return;
          }
          await this.submitScopeCsv();
          return;
        }
        await this.trimUploadedAssets(limit);
        this.planLimitResolved = true;
        this.planLimitPrompt = null;
        await this.loadSubscription();
        if (!isActiveSubscription(this.subscription)) {
          this.goToPricing(chosenPlan, limit, true, { mode: 'management', source: 'upload' });
          return;
        }
        await this.redirectAfterAgentsReady();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Could not remove extra IPs',
          text: error?.message || 'Please try again or choose a different plan.',
          confirmButtonColor: '#241447',
        });
      } finally {
        this.planLimitBusy = false;
      }
    },
    async trimCsvFile(file, limit) {
      if (!file) return file;
      if (!this.isTextScopeFile(file)) return file;
      const text = await file.text();
      const lines = String(text || '').split(/\r?\n/);
      if (!lines.length) return file;
      const first = (lines[0] || '').toLowerCase();
      const hasHeader = /ip|host|asset|target|url|address/.test(first);
      const kept = [];
      if (hasHeader) kept.push(lines[0]);
      const start = hasHeader ? 1 : 0;
      let taken = 0;
      for (let i = start; i < lines.length && taken < limit; i += 1) {
        if (!String(lines[i] || '').trim()) continue;
        kept.push(lines[i]);
        taken += 1;
      }
      return new File([`${kept.join('\n')}\n`], file.name, { type: file.type || 'text/csv' });
    },
    async countCsvTargets(file) {
      if (!file || !this.isTextScopeFile(file)) return 0;
      const text = await file.text();
      const valid = countValidScopeTargets(text);
      if (valid) return valid;
      const lines = String(text || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return 0;
      const hasHeader = /ip|host|asset|target|url|address|web/.test(lines[0].toLowerCase());
      return hasHeader ? Math.max(0, lines.length - 1) : lines.length;
    },
    async trimUploadedAssets(limit) {
      const authStore = useAuthStore();
      const res = await authStore.fetchAssets(true);
      const rows = Array.isArray(res?.data?.assets)
        ? res.data.assets
        : (authStore.assetRows || []);
      const extras = rows.slice(limit);
      for (const row of extras) {
        const ip = row?.asset || row?.host || row?.ip;
        if (!ip) continue;
        await authStore.deleteAsset(ip);
      }
      try {
        await syncSubscriptionAssets();
      } catch {
        /* ignore if not premium/management */
      }
    },
    async enforcePlanLimitAfterAssetsReady() {
      if (this.planLimitResolved && this.planSuggestResolved) return true;
      await this.loadSubscription();
      const authStore = useAuthStore();
      await authStore.fetchAssets(true);
      const uniqueIps = countUniqueIpHosts(authStore.assetRows);
      const fullCount = this.recommendAssetCount() || uniqueIps;
      if (fullCount && fullCount !== FREEMIUM_VISIBLE_ASSET_LIMIT) {
        this.fileDetectedIpCount = fullCount;
        storeBillableAssetCount(fullCount);
      }
      if (this.showPlanSuggestPrompt('upload', fullCount, '', true)) return false;
      if (
        isActiveSubscription(this.subscription) &&
        planBlocksOversizedUpload(this.subscription)
      ) {
        const limit = planAssetLimit(this.subscription);
        if (Number.isFinite(limit) && this.showPlanLimitPrompt('upload', fullCount)) return false;
      }
      return true;
    },
    isPlanLimitError(payload, message) {
      const text = [
        message,
        payload?.error,
        payload?.detail,
        payload?.message,
      ]
        .filter(Boolean)
        .join(' ');
      return isPlanQuotaMessage(text);
    },
    clearFileState() {
      this.selectedFile = null;
      this.selectedFiles = [];
      this.uploadError = '';
      this.uploadPlanOffer = null;
      this.isDragging = false;
      if (this.$refs.fileInput) this.$refs.fileInput.value = '';
      if (this.$refs.csvInput) this.$refs.csvInput.value = '';
    },
    backToChoose() {
      this.viewMode = 'choose';
      this.clearFileState();
      this.manualScopeText = '';
      this.planFitNotice = null;
    },
    openUploadReport() {
      this.clearFileState();
      this.viewMode = 'upload';
      this.loadExistingReport();
    },
    shortReportId(id) {
      const value = String(id || '');
      if (value.length <= 12) return value;
      return `${value.slice(0, 6)}…${value.slice(-4)}`;
    },
    async loadExistingReport() {
      // Freemium trim mode: load names into keep-list (with ×), do not use normal board.
      if (this.freemiumSinglePick || String(this.$route?.query?.freemiumSingle || '') === '1') {
        this.freemiumSinglePick = true;
        this.replacingFile = true;
        this.pendingPlan = this.pendingPlan || 'freemium';
        markFreemiumSinglePickIntent();
        this.loadingExistingReport = false;
        await this.hydrateFreemiumTrimFiles();
        return;
      }
      this.loadingExistingReport = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.fetchActiveUploadReport();
        if (res.status && res.data) {
          this.existingReport = res.data;
          const unique = uniqueIpCountFields(res.data);
          if (unique) {
            this.fileDetectedIpCount = unique;
            storeBillableAssetCount(unique);
          }
        }
      } catch (err) {
        console.error('Existing report GET failed:', err);
      } finally {
        this.loadingExistingReport = false;
      }
    },
    openEnterScope() {
      this.clearFileState();
      this.planFitNotice = this.planFitNotice?.source === 'upload' ? null : this.planFitNotice;
      this.viewMode = 'scope-method';
    },
    openScopeCsv() {
      this.clearFileState();
      this.planFitNotice = this.planFitNotice?.source === 'scope-csv' ? this.planFitNotice : null;
      this.viewMode = 'scope-csv';
      if (!this.existingScope && !this.loadingExistingScope) {
        this.loadExistingScope();
      }
    },
    openScopeManual() {
      this.clearFileState();
      this.uploadError = '';
      this.scopeLineErrors = [];
      this.scopeSubmitSummary = null;
      this.planFitNotice = this.planFitNotice?.source === 'scope-manual' ? this.planFitNotice : null;
      this.viewMode = 'scope-manual';
      if (!this.existingScope && !this.loadingExistingScope) {
        this.loadExistingScope();
      }
    },
    formatEntryType(type) {
      const raw = String(type || '').trim();
      if (!raw) return 'target';
      return raw.replace(/_/g, ' ');
    },
    applyRouteMode() {
      const mode = String(this.$route?.query?.mode || '').toLowerCase();
      const freemiumSingle = String(this.$route?.query?.freemiumSingle || '') === '1';
      if (freemiumSingle) {
        this.freemiumSinglePick = true;
        this.replacingFile = true;
        this.pendingPlan = 'freemium';
        this.existingReport = null;
        markFreemiumSinglePickIntent();
        this.viewMode = 'upload';
        return;
      }
      if (this.isReplacingUpload && (!mode || mode === 'choose' || mode === 'scope')) {
        this.viewMode = 'upload';
        return;
      }
      // Default / profile Upload Scope → "Provide Your Scope" chooser
      if (!mode || mode === 'choose' || mode === 'scope') {
        this.viewMode = 'choose';
      } else if (mode === 'scope-csv') {
        this.viewMode = 'scope-csv';
      } else if (mode === 'scope-manual') {
        this.viewMode = 'scope-manual';
      } else if (mode === 'scope-method') {
        this.viewMode = 'scope-method';
      } else if (mode === 'upload') {
        this.viewMode = 'upload';
      }
    },
    async loadExistingScope() {
      this.loadingExistingScope = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.fetchActiveScope();
        if (res.status && res.data) {
          this.existingScope = res.data;
          if (res.data.id) {
            try {
              localStorage.setItem('activeScopeId', String(res.data.id));
            } catch (_) {
              /* ignore */
            }
          }
        }
      } catch (err) {
        console.error('Existing scope GET failed:', err);
      } finally {
        this.loadingExistingScope = false;
      }
    },
    async ensureScopeGetAfterCreate(res, preferredName) {
      if (res?.scope?.id) return res;

      const authStore = useAuthStore();
      const getRes = await authStore.fetchActiveScope({ preferredName });
      if (!getRes.status || !getRes.data) return res;

      return {
        ...res,
        scope: getRes.data,
        data: {
          ...(res.data || {}),
          ...getRes.data,
          created_count: res.data?.created_count ?? res.data?.processing?.created_count,
          skipped_count: res.data?.skipped_count,
          skipped: res.data?.skipped,
          processing: res.data?.processing,
          plan_recommendation: res.data?.plan_recommendation,
          status: res.data?.status || getRes.data?.status,
          message: res.data?.message || getRes.data?.message,
        },
      };
    },
    applyManualProcessing(processing) {
      const errors = Array.isArray(processing?.errors) ? processing.errors : [];
      this.scopeLineErrors = errors;
      this.scopeSubmitSummary = {
        created: Number(processing?.created_count) || 0,
        errors: Number(processing?.error_count) || errors.length || 0,
        parsed: Number(processing?.total_parsed) || 0,
      };
    },
    async continueToPremiumTestingAfterScope(count = 0, toastTitle = 'Scope submitted', toastDetail = '', payload = null) {
      const rec = extractPlanRecommendation(payload) || extractPlanRecommendation({ data: payload });
      const meta = extractScopeSubmitStatus(payload);
      const n = Number(rec?.total_scope_assets) || Number(count) || 0;
      const planId = recommendedPaidPlanFromScope(rec, n);
      markScopeFileAwaitingSuperadmin(readStoredAdminEmail());
      setPremiumEntrySource('scope');
      localStorage.removeItem('isNewProject');
      if (toastTitle) {
        await this.toastNotice(
          'success',
          toastTitle,
          meta.message ||
            rec?.message ||
            toastDetail ||
            (n
              ? `${n} IP / asset / web target(s) sent for Super Admin analysis.`
              : 'Your scope was sent for Super Admin analysis.'),
          1600,
        );
      }
      await this.loadSubscription();
      if (isActiveSubscription(this.subscription) && !isFreemiumPlan(this.subscription)) {
        this.$router.replace('/waiting-for-report');
        return;
      }
      this.goToPricing(planId, n, true, { mode: 'testing', source: 'scope' });
    },
    async handleScopeCreateSuccess(res, source = '') {
      const src = source || (this.viewMode === 'scope-csv' ? 'scope-csv' : 'scope-manual');
      const scope = res.scope || res.data || {};
      const processing = extractScopeProcessing(res);
      const created =
        processing.created_count ||
        Number(res.data?.created_count) ||
        Number(scope?.entry_count) ||
        (Array.isArray(scope?.entries) ? scope.entries.length : 0) ||
        0;
      const skipped = Number(res.data?.skipped_count) || 0;

      if (scope?.id) {
        try {
          localStorage.setItem('activeScopeId', String(scope.id));
        } catch (_) {
          /* ignore */
        }
      }

      if (src === 'scope-manual') {
        this.applyManualProcessing(processing);
        if (!created || processing.errors.length) {
          this.uploadError = processing.errors.length
            ? 'These entries are not valid IPs. Fix them and try again.'
            : (res.message || 'No valid targets were created. Enter valid IPs and try again.');
          await this.toastNotice('error', 'Invalid IP addresses', this.uploadError);
          return;
        }
        const rec = extractPlanRecommendation(res);
        const breakdown = planRecommendationBreakdown(rec);
        const count = Number(rec?.total_scope_assets) || created || this.manualTargetCount || 0;
        await this.toastNotice(
          processing.error_count ? 'warning' : 'success',
          'Scope submitted',
          `${created} valid target(s) created` +
            (processing.error_count ? ` · ${processing.error_count} rejected` : '') +
            (skipped ? ` · ${skipped} skipped` : '') +
            (breakdown ? ` · ${breakdown}` : ''),
          1800,
        );
        await this.continueToPremiumTestingAfterScope(count, '', '', res);
        return;
      }

      if (skipped > 0 && created === 0) {
        await this.toastNotice('warning', 'Already exists', `${skipped} target(s) skipped`, 1800);
      } else {
        await this.toastNotice(
          'success',
          'Scope created',
          created > 0
            ? `${created} target(s) created${skipped ? ` · ${skipped} skipped` : ''}`
            : res.message || 'Scope submitted successfully',
          1800,
        );
      }

      localStorage.removeItem('isNewProject');
      const count = created || this.existingEntryCount;
      await this.continueToPremiumTestingAfterScope(count, '', '', res);
    },
    async submitScopeCsv() {
      if (!this.selectedFile || this.scopeSubmitting) return;
      if (!this.isScopeFile(this.selectedFile)) {
        this.uploadError = SCOPE_FILE_ERROR;
        return;
      }

      this.scopeSubmitting = true;
      this.uploadError = '';
      try {
        const localCount = await this.countCsvTargets(this.selectedFile);
        const handedOff = await submitScopeFileForAnalysis(this.selectedFile);
        if (handedOff.ok === false && handedOff.fallback === false && handedOff.message) {
          this.showInvalidFileError(handedOff.message);
          return;
        }

        const authStore = useAuthStore();
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('expand_subnets', 'false');
        let res = handedOff.ok
          ? { status: true, data: handedOff.data || {}, message: '' }
          : await authStore.createScope(formData);

        if (!res.status) {
          this.showInvalidFileError(res.message);
          return;
        }

        const preferredName = String(this.selectedFile?.name || '')
          .replace(/\.(csv|xlsx|xls|txt)$/i, '')
          .trim();
        res = await this.ensureScopeGetAfterCreate(res, preferredName);

        const processing = extractScopeProcessing(res);
        const rec = extractPlanRecommendation(res);
        const scope = res.scope || res.data || {};
        const count =
          Number(rec?.total_scope_assets) ||
          processing.created_count ||
          Number(scope?.entry_count) ||
          (Array.isArray(scope?.entries) ? scope.entries.length : 0) ||
          localCount ||
          0;

        if (scope?.id) {
          try {
            localStorage.setItem('activeScopeId', String(scope.id));
          } catch {
            /* ignore */
          }
        }

        await this.continueToPremiumTestingAfterScope(
          count,
          'Scope file submitted',
          '',
          res,
        );
      } catch (err) {
        console.error('Scope file error:', err);
        this.uploadError = 'Something went wrong while submitting scope file';
        Swal.fire('Scope failed', this.uploadError, 'error');
      } finally {
        this.scopeSubmitting = false;
      }
    },
    async submitScopeManual() {
      if (!this.manualTargetCount || this.scopeSubmitting) return;

      this.uploadError = '';
      this.scopeSubmitSummary = null;
      const invalid = collectInvalidScopeLines(this.manualTargets);
      if (invalid.length) {
        this.scopeLineErrors = invalid;
        this.scopeSubmitSummary = null;
        this.uploadError = '';
        const summary =
          invalid.length === this.manualTargetCount
            ? 'None of these are valid IPs. Enter valid IPs and try again.'
            : `${invalid.length} ${invalid.length === 1 ? 'entry is' : 'entries are'} not valid IPs. Fix them and try again.`;
        this.toastNotice('error', 'Invalid IP addresses', summary);
        return;
      }

      this.scopeSubmitting = true;
      this.scopeLineErrors = [];
      try {
        const formData = new FormData();
        formData.append('targets', this.manualTargets.join('\n'));

        const authStore = useAuthStore();
        let res = await authStore.createScope(formData);

        if (!res.status) {
          const processing = extractScopeProcessing(res);
          this.applyManualProcessing(processing);
          if (processing.errors.length) {
            this.uploadError = res.message || 'Some lines were rejected. Fix them and try again.';
            return;
          }
          this.uploadError = res.message || 'Invalid scope. Check the targets and try again.';
          this.toastNotice('error', 'Invalid IP addresses', this.uploadError);
          return;
        }

        res = await this.ensureScopeGetAfterCreate(res);
        await this.handleScopeCreateSuccess(res, 'scope-manual');
      } catch (err) {
        console.error('Scope manual error:', err);
        this.uploadError = 'Something went wrong while submitting scope';
        Swal.fire('Scope failed', this.uploadError, 'error');
      } finally {
        this.scopeSubmitting = false;
      }
    },
    getExtension(fileName) {
      const name = String(fileName || '').toLowerCase();
      const idx = name.lastIndexOf('.');
      if (idx < 0) return '';
      return name.slice(idx);
    },
    isAllowedFile(file) {
      if (!file) return false;
      return ALLOWED_EXTENSIONS.includes(this.getExtension(file.name));
    },
    isScopeFile(file) {
      if (!file) return false;
      return SCOPE_ALLOWED_EXTENSIONS.includes(this.getExtension(file.name));
    },
    isTextScopeFile(file) {
      if (!file) return false;
      return SCOPE_TEXT_EXTENSIONS.includes(this.getExtension(file.name));
    },
    formatFileSize(bytes) {
      const n = Number(bytes) || 0;
      if (n < 1024) return n + ' B';
      if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
      return (n / (1024 * 1024)).toFixed(1) + ' MB';
    },
    addReportFiles(fileList) {
      const incoming = Array.from(fileList || []);
      if (!incoming.length) return;
      // Freemium single-file path: keep only the first allowed file.
      if (this.freemiumSinglePick) {
        const first = incoming.find((file) => this.isAllowedFile(file));
        if (!first) {
          this.uploadError =
            'Unsupported file type. Allowed: .nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc';
          Swal.fire('Unsupported file', this.uploadError, 'warning');
          return;
        }
        this.selectedFiles = [first];
        this.selectedFile = first;
        this.freemiumKeepFileNames = [first.name];
        this.lastUploadFileNames = [first.name];
        this.lastUploadFileCount = 1;
        this.uploadError = '';
        rememberUploadedScanFiles([first.name]);
        return;
      }
      const next = [...this.selectedFiles];
      const skipped = [];
      for (const file of incoming) {
        if (!this.isAllowedFile(file)) {
          skipped.push(file.name || 'file');
          continue;
        }
        const duplicate = next.some((item) => item.name === file.name && item.size === file.size);
        if (duplicate) continue;
        if (next.length >= MAX_UPLOAD_FILES) {
          this.uploadError = `You can upload up to ${MAX_UPLOAD_FILES} files per day.`;
          break;
        }
        next.push(file);
      }
      this.selectedFiles = next;
      this.selectedFile = next[0] || null;
      if (skipped.length && !next.length) {
        this.uploadError =
          'Unsupported file type. Allowed: .nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc';
        Swal.fire('Unsupported file', this.uploadError, 'warning');
      }
    },
    removeSelectedFile(index) {
      this.selectedFiles = this.selectedFiles.filter((_, idx) => idx !== index);
      this.selectedFile = this.selectedFiles[0] || null;
      this.uploadError = '';
    },
    setSelectedFile(file) {
      this.uploadError = '';
      if (!file) return;
      this.addReportFiles([file]);
    },
    setScopeCsvFile(file) {
      this.uploadError = '';
      if (!file) return;
      if (!this.isScopeFile(file)) {
        this.selectedFile = null;
        this.uploadError = SCOPE_FILE_ERROR;
        Swal.fire('Unsupported file', this.uploadError, 'warning');
        return;
      }
      this.selectedFile = file;
    },
    onReportDragOver() {
      this.isDragging = true;
    },
    onReportDragLeave(e) {
      const zone = e?.currentTarget;
      const related = e?.relatedTarget;
      if (zone && related && typeof zone.contains === 'function' && zone.contains(related)) return;
      this.isDragging = false;
    },
    onFileChange(e) {
      const list = e?.target?.files;
      if (!list || !list.length) return;
      this.addReportFiles(Array.from(list));
      try {
        e.target.value = '';
      } catch (_) {
        /* ignore */
      }
    },
    onDrop(e) {
      this.isDragging = false;
      const list = e?.dataTransfer?.files;
      if (!list || !list.length) return;
      this.addReportFiles(Array.from(list));
    },
    onScopeCsvChange(e) {
      const file = e.target.files?.[0];
      this.setScopeCsvFile(file);
      e.target.value = '';
    },
    onScopeCsvDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files?.[0];
      this.setScopeCsvFile(file);
    },
    removeFile() {
      this.clearFileState();
    },
    extractReportIds(data) {
      const ids = [];
      const push = (id) => {
        if (typeof id === 'string' && id.trim()) ids.push(id.trim());
      };
      push(data?.merged_report_id);
      push(data?.merged_report?.report_id);
      push(data?.report_id);
      push(data?.id);
      const buckets = [
        ...(Array.isArray(data?.results) ? data.results : []),
        ...(Array.isArray(data?.reports) ? data.reports : []),
      ];
      buckets.forEach((row) => {
        push(row?.report_id || row?.id || row?.merged_report_id);
      });
      return [...new Set(ids)];
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    async continueAfterPayment() {
      await this.loadSubscription();
      if (!isActiveSubscription(this.subscription)) return false;
      useAuthStore().invalidateAfterPaidUpgrade();
      this.redirecting = true;
      await this.goAfterUploadReady();
      return true;
    },
    async goAfterUploadReady() {
      const authStore = useAuthStore();
      const returnTo = this.$route?.query?.returnTo;
      const safeReturn =
        typeof returnTo === 'string' && returnTo.startsWith('/') && !returnTo.startsWith('//')
          ? returnTo
          : '';
      // Magic link OR scope-add: after the scan file is in, open Add Users — not risk criteria.
      if (isClaimInviteFlow() || isScopeAwaitingScan()) {
        authStore.unmarkStepCompleted(1);
        await this.$router.replace(safeReturn || '/communication');
        return;
      }
      if (safeReturn && isActiveSubscription(this.subscription)) {
        await this.$router.replace(safeReturn);
        return;
      }
      const route = await authStore.getAdminOnboardingRoute();
      await this.$router.replace(route);
    },
    async resumeUnpaidScopePayment() {
      if (this.isReplacingUpload) return false;
      // Magic-link admins must stay on upload to add their file. Payment/scope prompts are for manual scope only.
      if (isClaimInviteFlow()) {
        return false;
      }
      if (isActiveSubscription(this.subscription)) return false;
      if (this.planSuggestPrompt || this.planLimitPrompt || this.uploading) return false;

      if (this.hasExistingReport) {
        this.viewMode = 'upload';
        const count = await this.resolveUniqueIpCount();
        this.showPlanSuggestPrompt('upload', count, '', true);
        return true;
      }
      if (this.hasExistingScope) {
        this.viewMode = this.existingScopeLabel ? 'scope-csv' : 'scope-manual';
        this.showPlanSuggestPrompt(
          this.existingScopeLabel ? 'scope-csv' : 'scope-manual',
          this.existingEntryCount,
          '',
          true,
        );
        return true;
      }
      return false;
    },
    isOnboardingScopeGate() {
      if (this.isExplicitScopeVisit) return false;
      if (String(this.$route?.query?.resume || '') === '1') return false;
      // Teams / Slack / typed URL: this page is the destination, not a wizard step.
      if (isExternalDeepLink('/admin-upload-report')) return false;
      // Magic link: stay on file upload until they submit a report.
      if (isClaimInviteFlow()) return false;
      return true;
    },
    async redirectIfReportReadyFromElsewhere() {
      if (this.redirecting || this.uploading || this.generating || this.externalReportWatching) return false;
      if (this.selectedFiles.length || this.selectedFile) return false;
      if (!this.isOnboardingScopeGate()) return false;

      this.externalReportWatching = true;
      try {
        const authStore = useAuthStore();
        const status = await authStore.getReportStatus();
        const onboardingDone =
          status?.state === 'ready' ||
          status?.showDashboard === true ||
          !!(status?.hasReport && status?.hasRiskCriteria);
        if (onboardingDone) {
          this.redirecting = true;
          this.stopExternalReportWatch();
          await this.$router.replace('/admindashboardonboarding');
          return true;
        }

        if (!isActiveSubscription(this.subscription)) {
          return false;
        }

        try {
          const upload = await authStore.getScopingUploadStatus();
          if (upload.cards_generating === true || isAgentGenerationInProgress(upload)) {
            return await this.resumeAgentGenerationIfNeeded();
          }
          const hasSlackFile =
            upload.file_uploaded === true ||
            Number(upload.reports_ready) > 0 ||
            Number(upload.reports_total) > 0;
          if (hasSlackFile) {
            this.redirecting = true;
            this.stopExternalReportWatch();
            await this.$router.replace(
              status?.hasRiskCriteria ? '/admindashboardonboarding' : '/riskcriteria',
            );
            return true;
          }
        } catch {
          /* optional */
        }

        await this.loadExistingReport();
        if (isAgentGenerationInProgress(this.existingReport)) {
          return await this.resumeAgentGenerationIfNeeded();
        }
        // Only real server report — not leftover local filenames.
        if (this.existingReportId || status?.hasReport) {
          this.redirecting = true;
          this.stopExternalReportWatch();
          await this.$router.replace(
            status?.hasRiskCriteria ? '/admindashboardonboarding' : '/riskcriteria',
          );
          return true;
        }
      } finally {
        this.externalReportWatching = false;
      }
      return false;
    },
    onExternalReportVisibility() {
      if (!document.hidden) this.redirectIfReportReadyFromElsewhere();
    },
    startExternalReportWatch() {
      this.stopExternalReportWatch();
      if (!this.isOnboardingScopeGate()) return;
      this.redirectIfReportReadyFromElsewhere();
      this.externalReportWatchTimer = setInterval(() => {
        if (!document.hidden && !this.redirecting) this.redirectIfReportReadyFromElsewhere();
      }, EXTERNAL_REPORT_WATCH_MS);
      document.addEventListener('visibilitychange', this.onExternalReportVisibility);
    },
    stopExternalReportWatch() {
      if (this.externalReportWatchTimer) {
        clearInterval(this.externalReportWatchTimer);
        this.externalReportWatchTimer = null;
      }
      document.removeEventListener('visibilitychange', this.onExternalReportVisibility);
    },
    async pollOnce() {
      if (this.polling || this.redirecting || !this.reportIds.length) return;
      this.polling = true;
      const authStore = useAuthStore();

      try {
        const responses = await Promise.all(
          this.reportIds.map((id) => authStore.fetchUploadReportStatus(id)),
        );

        const nextStatus = { ...this.statusByReportId };
        responses.forEach((res, idx) => {
          const id = this.reportIds[idx];
          if (res.status && res.data) {
            nextStatus[id] = res.data;
          }
        });
        this.statusByReportId = nextStatus;

        if (this.allAgentsReady) {
          this.stopPolling();
          clearPersistedAgentGeneration();
          await this.redirectAfterAgentsReady();
        }
      } finally {
        this.polling = false;
      }
    },
    startPolling(reportIds, seedStatus = null) {
      this.reportIds = [...new Set((reportIds || []).map((id) => String(id || '').trim()).filter(Boolean))];
      this.statusByReportId =
        seedStatus && typeof seedStatus === 'object' ? { ...seedStatus } : {};
      this.generating = true;
      this.redirecting = false;
      persistAgentGeneration(readStoredAdminEmail(), this.reportIds);
      this.stopPolling();
      this.pollOnce();
      this.pollTimer = setInterval(() => {
        if (!document.hidden && !this.redirecting) this.pollOnce();
      }, STATUS_POLL_MS);
    },
    async resumeAgentGenerationIfNeeded() {
      if (this.generating || this.redirecting || this.uploading) return false;
      if (this.isReplacingUpload) return false;

      const authStore = useAuthStore();
      const email = readStoredAdminEmail();
      const persisted = readPersistedAgentGeneration(email);
      const reportId = String(this.existingReportId || '').trim();
      const ids = [...new Set([...(persisted?.reportIds || []), reportId].filter(Boolean))];

      if (!ids.length && !isAgentGenerationInProgress(this.existingReport)) return false;

      const seed = {};
      if (reportId && this.existingReport) seed[reportId] = this.existingReport;

      let anyInProgress = isAgentGenerationInProgress(this.existingReport);
      for (const id of ids) {
        try {
          const res = await authStore.fetchUploadReportStatus(id);
          if (res.status && res.data) {
            seed[id] = { ...(seed[id] || {}), ...res.data };
            if (isAgentGenerationInProgress(res.data)) anyInProgress = true;
          }
        } catch {
          /* keep checking other ids */
        }
      }

      if (!anyInProgress) {
        try {
          const scoping = await authStore.getScopingUploadStatus();
          if (scoping.cards_generating === true || isAgentGenerationInProgress(scoping)) {
            anyInProgress = true;
            if (reportId) {
              seed[reportId] = { ...(seed[reportId] || {}), ...scoping };
            }
          }
        } catch {
          /* optional */
        }
      }

      if (!anyInProgress && persisted?.reportIds?.length && !Object.keys(seed).length) {
        anyInProgress = true;
      }

      if (!anyInProgress) {
        clearPersistedAgentGeneration();
        return false;
      }

      const pollIds = ids.length ? ids : persisted?.reportIds || [];
      if (!pollIds.length) return false;

      this.startPolling(pollIds, seed);
      return true;
    },
    async redirectAfterAgentsReady() {
      if (this.redirecting) return;
      if (!this.allAgentsReady && !this.planLimitResolved && !this.planSuggestResolved) return;
      if (this.planLimitPrompt || this.planSuggestPrompt) return;
      if (!this.allAgentsReady) return;

      if (!(isClaimInviteFlow())) {
        if (!(await this.enforcePlanLimitAfterAssetsReady())) return;

        await this.loadSubscription();
        if (!isActiveSubscription(this.subscription)) {
          this.generating = false;
          await this.promptUnpaidPlanChoice('upload', this.existingReportIpCount);
          return;
        }
      }

      this.redirecting = true;
      this.stopPolling();
      clearPersistedAgentGeneration();

      try {
        const { syncSubscriptionAssets } = await import('@/services/billingApi');
        await syncSubscriptionAssets();
      } catch {
        /* ignore — only applies to active Premium/Management subscriptions */
      }

      const authStore = useAuthStore();
      const primaryReportId = this.reportIds[0];
      if (primaryReportId) {
        authStore.setActiveReportId(primaryReportId);
      }
      await this.goAfterUploadReady();
    },
    async startUpload() {
      const files = this.selectedFiles.length
        ? this.selectedFiles
        : (this.selectedFile ? [this.selectedFile] : []);
      if (!files.length || this.uploading || this.generating) return;
      if (files.some((file) => !this.isAllowedFile(file))) {
        this.uploadError =
          'Unsupported file type. Allowed: .nessus, .xml, .html, .htm, .csv, .xlsx, .xls, .pdf, .docx, .doc';
        return;
      }
      this.planLimitResolved = false;
      this.planSuggestResolved = false;
      this.fileDetectedIpCount = 0;

      this.lastUploadFileCount = files.length;
      this.lastUploadFileNames = files.map((file) => String(file?.name || '').trim()).filter(Boolean);
      rememberUploadedScanFiles(this.lastUploadFileNames);

      // Only block multi-file when Freemium is already active OR user already picked Freemium.
      // New / unpaid users must upload first, then choose a plan — Freemium alert comes after that.
      const pendingFreemium = String(this.pendingPlan || this.planSuggestActivePlan || '').toLowerCase() === 'freemium';
      if (
        (hasFreemiumRestrictions(this.subscription) || pendingFreemium) &&
        !(await this.guardFreemiumMultiFile(pendingFreemium ? 'freemium' : ''))
      ) {
        return;
      }

      this.planLimitResolved = false;
      this.planSuggestResolved = false;
      this.fileDetectedIpCount = 0;

      this.lastUploadFileCount = files.length;
      this.lastUploadFileNames = files.map((file) => String(file?.name || '').trim()).filter(Boolean);
      rememberUploadedScanFiles(this.lastUploadFileNames);

      // Only block multi-file when Freemium is already active OR user already picked Freemium.
      // New / unpaid users must upload first, then choose a plan — Freemium alert comes after that.
      const pendingFreemium = String(this.pendingPlan || this.planSuggestActivePlan || '').toLowerCase() === 'freemium';
      if (
        (hasFreemiumRestrictions(this.subscription) || pendingFreemium) &&
        !(await this.guardFreemiumMultiFile(pendingFreemium ? 'freemium' : ''))
      ) {
        return;
      }

      this.planLimitResolved = false;
      this.planSuggestResolved = false;
      this.fileDetectedIpCount = 0;

      this.lastUploadFileCount = files.length;
      this.lastUploadFileNames = files.map((file) => String(file?.name || '').trim()).filter(Boolean);
      rememberUploadedScanFiles(this.lastUploadFileNames);

      // Only block multi-file when Freemium is already active OR user already picked Freemium.
      // New / unpaid users must upload first, then choose a plan — Freemium alert comes after that.
      const pendingFreemium = String(this.pendingPlan || this.planSuggestActivePlan || '').toLowerCase() === 'freemium';
      if (
        (hasFreemiumRestrictions(this.subscription) || pendingFreemium) &&
        !(await this.guardFreemiumMultiFile(pendingFreemium ? 'freemium' : ''))
      ) {
        return;
      }

      this.planLimitResolved = false;
      this.planSuggestResolved = false;
      this.fileDetectedIpCount = 0;

      this.uploading = true;
      this.uploadPct = 0;
      this.uploadError = '';
      this.uploadPlanOffer = null;
      this.uploadResult = null;
      let uploadAccepted = false;

      const shouldReplace =
        this.isReplacingUpload ||
        !!(this.existingReport && freemiumLocksUploadScope(this.subscription));

      try {
        const authStore = useAuthStore();
        let res = await authStore.uploadAdminReport(
          files,
          (pct) => {
            this.uploadPct = pct;
          },
          { replace: shouldReplace },
        );

        const errorBlob = [res.message, JSON.stringify(res.details || {})].filter(Boolean).join(' ');
        const freemiumKind = classifyFreemiumUploadBlock({
          planId: pendingFreemium ? 'freemium' : '',
          isFreemiumActive: hasFreemiumRestrictions(this.subscription),
          fileCount: files.length,
          message: errorBlob,
          details: res.details,
        });

        if (!res.status && freemiumKind === 'multi_file') {
          await this.showFreemiumSingleFileBackPrompt(files.length);
          return;
        }

        // Global duplicate hash (Freemium/undecided) — hard stop, never offer Replace.
        if (
          !res.status &&
          (isDuplicateFileUploadMessage(res.message) ||
            isDuplicateFileUploadMessage(res.details) ||
            isDuplicateFileUploadMessage(errorBlob))
        ) {
          this.showUploadError(DUPLICATE_FILE_UPLOAD_MESSAGE);
          return;
        }

        // Freemium already has a report and backend rejected without replace — confirm + retry replace.
        if (
          !res.status &&
          !shouldReplace &&
          freemiumKind === 'replace_slot'
        ) {
          const choice = await Swal.fire({
            icon: 'warning',
            title: 'You already have a report',
            text: 'Freemium keeps one report. Replace your current report with this file?',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Replace existing report',
            denyButtonText: 'Upgrade to Premium',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#241447',
            denyButtonColor: '#64748b',
            cancelButtonColor: '#94a3b8',
          });
          if (choice.isConfirmed) {
            this.replacingFile = true;
            res = await authStore.uploadAdminReport(
              files,
              (pct) => {
                this.uploadPct = pct;
              },
              { replace: true },
            );
          } else if (choice.isDenied) {
            const count = await this.resolveUniqueIpCount();
            this.goToPricing('premium', count, false, { mode: 'management', source: 'upload' });
            return;
          } else {
            this.uploadError =
              'Freemium keeps one report. Choose Replace to overwrite it, or upgrade to Premium.';
            return;
          }
        }

        if (!res.status) {
          await this.loadSubscription();

          const backendMsg = String(res.message || '');
          const looksLikeFreemiumGate =
            isFreemiumReportUploadLimitMessage(backendMsg) ||
            isFreemiumSingleFileRequiredMessage(res.details) ||
            isFreemiumSingleFileRequiredMessage(backendMsg);

          // No Freemium chosen/active yet → plan picker first (not Freemium replace alert).
          if (
            !hasFreemiumRestrictions(this.subscription) &&
            !pendingFreemium &&
            looksLikeFreemiumGate
          ) {
            await this.openPlanChoiceBeforeFreemiumGate(files);
            return;
          }

          if (this.handleUploadPlanFailure(res)) return;
          if (
            classifyFreemiumUploadBlock({
              planId: pendingFreemium ? 'freemium' : '',
              isFreemiumActive: hasFreemiumRestrictions(this.subscription),
              fileCount: files.length,
              message: backendMsg,
              details: res.details,
            }) === 'multi_file'
          ) {
            await this.showFreemiumSingleFileBackPrompt(files.length);
            return;
          }
          // Replace-slot copy only after Freemium is actually active.
          if (
            hasFreemiumRestrictions(this.subscription) &&
            isFreemiumReportUploadLimitMessage(backendMsg)
          ) {
            this.showUploadError(
              'Could not replace your Freemium report yet. Please try again, or upgrade to Premium for more uploads.',
            );
            return;
          }
          this.showInvalidFileError(res.message);
          return;
        }

        uploadAccepted = true;
        this.uploadPct = 100;
        await this.notifyFreemiumTrimmed(res.data);
        await this.finishSuccessfulUpload(res);
        return;
      } catch (err) {
        console.error('Upload error:', err);
        if (uploadAccepted || this.generating || this.reportIds?.length) return;
        const data = err?.response?.data;
        const msg =
          (typeof data?.error === 'string' && data.error) ||
          (typeof data?.detail === 'string' && data.detail) ||
          (typeof data?.message === 'string' && data.message) ||
          err?.message ||
          '';
        if (isDuplicateFileUploadMessage(msg) || isDuplicateFileUploadMessage(data)) {
          this.showUploadError(DUPLICATE_FILE_UPLOAD_MESSAGE);
          return;
        }
        if (
          !hasFreemiumRestrictions(this.subscription) &&
          !pendingFreemium &&
          (isFreemiumReportUploadLimitMessage(msg) ||
            isFreemiumSingleFileRequiredMessage(data) ||
            isFreemiumSingleFileRequiredMessage(msg))
        ) {
          await this.openPlanChoiceBeforeFreemiumGate(files);
          return;
        }
        if (
          classifyFreemiumUploadBlock({
            isFreemiumActive: hasFreemiumRestrictions(this.subscription),
            fileCount: files.length,
            message: msg,
            details: data,
          }) === 'multi_file'
        ) {
          await this.showFreemiumSingleFileBackPrompt(files.length);
          return;
        }
        this.showInvalidFileError(msg);
      } finally {
        this.uploading = false;
      }
    },
  },
  async mounted() {
    captureChatHandoffSource(this.$route?.query || {});
    const handoffError = consumeHandoffError();
    if (handoffError) {
      await Swal.fire({
        icon: 'error',
        title: 'This link has expired',
        text: handoffError,
        confirmButtonText: 'OK',
      });
      return;
    }
    if (isClaimInviteFlow()) {
      const authStore = useAuthStore();
      authStore.initCompletedSteps();
      this.redirecting = true;
      if (authStore.completedSteps.includes(2) || authStore.reportStatus?.hasRiskCriteria) {
        await this.$router.replace('/admindashboardonboarding');
        return;
      }
      // Fresh magic-link signup always goes to Add Users first.
      if (sessionStorage.getItem('isNewUser') === 'true') {
        authStore.unmarkStepCompleted(1);
        await this.$router.replace('/communication');
        return;
      }
      if (authStore.completedSteps.includes(1)) {
        await this.$router.replace('/riskcriteria');
        return;
      }
      authStore.unmarkStepCompleted(1);
      await this.$router.replace('/communication');
      return;
    }
    this.applyRouteMode();
    await Promise.all([this.loadExistingScope(), this.loadExistingReport(), this.loadSubscription()]);
    if (await this.resumeAgentGenerationIfNeeded()) {
      return;
    }
    const authStore = useAuthStore();
    const status = await authStore.getReportStatus();
    if (
      freemiumLocksUploadScope(this.subscription) &&
      status?.hasReport &&
      this.isExplicitScopeVisit
    ) {
      this.redirecting = true;
      await this.$router.replace({
        path: '/pricingplan',
        query: { returnTo: '/admindashboardonboarding' },
      });
      return;
    }
    // Paid onboarding can skip this screen once a report already exists.
    // Unpaid must stay here: upload the file, then pick a plan.
    // If agents are still generating, stay and keep polling.
    if (status?.hasReport && !this.isExplicitScopeVisit && (await authStore.hasPaidPlan())) {
      if (await this.resumeAgentGenerationIfNeeded()) return;
      this.redirecting = true;
      await this.$router.replace(await authStore.getAdminOnboardingRoute());
      return;
    }
    if (await this.redirectIfReportReadyFromElsewhere()) return;
    if (sessionStorage.getItem('isNewUser') !== 'true') {
      if (await this.resumeUnpaidScopePayment()) return;
    }
    this.startExternalReportWatch();
    await this.resumePendingUploadIfNeeded();
  },
  watch: {
    uniqueAssetIpCount(n) {
      if (!this.planSuggestPrompt || this.planSuggestPrompt.source !== 'upload') return;
      const unique = this.payloadUniqueIpCount();
      if (unique) return;
      if (!n || n === this.planSuggestPrompt.count) return;
      const suggested = suggestedPlanFromAssetCount(n);
      this.planSuggestPrompt = {
        ...this.planSuggestPrompt,
        count: n,
        suggested: suggested || this.planSuggestPrompt.suggested,
        suggestedName: suggested
          ? planDisplayName(suggested)
          : this.planSuggestPrompt.suggestedName,
        otherPlans: suggested ? otherPlans(suggested) : this.planSuggestPrompt.otherPlans,
      };
    },
    manualScopeText() {
      if (this.scopeLineErrors.length || this.scopeSubmitSummary) {
        this.scopeLineErrors = [];
        this.scopeSubmitSummary = null;
      }
    },
  },
  beforeUnmount() {
    this.stopPolling();
    this.stopExternalReportWatch();
  },
};
</script>

<style scoped>
.aur-root {
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  background: linear-gradient(160deg, #f4f2fb 0%, #ffffff 45%, #ebe7f8 100%);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.aur-topbar {
  background: #241447;
  padding: 10px 28px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.aur-logo { height: 32px; width: auto; }

.aur-plan-chip {
  display: inline-block;
  margin: 0.35rem 0 0;
  background: #eef8f8;
  color: #0f696e;
  border-radius: 999px;
  padding: 0.28rem 0.75rem;
  font-size: 0.78rem;
  font-weight: 700;
}

.aur-plan-fit-banner {
  background: #fff7ed;
  border: 1px solid #fdba74;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  margin: 0 0 1rem;
  text-align: left;
}

.aur-plan-fit-banner p {
  margin: 0 0 0.75rem;
  color: #9a3412;
  font-size: 0.9rem;
  line-height: 1.5;
}

.aur-plan-fit-banner .aur-limit-upgrade {
  width: auto;
}

.aur-limit-overlay {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0.5rem 0.25rem 0.75rem;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.aur-limit-card {
  width: 100%;
  max-width: 460px;
  margin: auto;
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.1);
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(36, 20, 71, 0.08);
  padding: 1.6rem 1.4rem 1.35rem;
  text-align: center;
  position: relative;
}

.aur-limit-back {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  width: auto;
  margin: 0 0 0.85rem;
  padding: 0;
  border: none;
  background: transparent;
  color: #241447;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
}

.aur-limit-back:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.aur-limit-card .aur-limit-back {
  display: block;
  text-align: left;
}

.aur-limit-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #0f696e;
}

.aur-limit-title {
  color: #241447;
  font-size: 1.35rem;
  font-weight: 800;
  margin: 0 0 0.7rem;
}

.aur-limit-copy {
  color: #49454f;
  font-size: 0.92rem;
  line-height: 1.55;
  margin: 0 0 1.2rem;
}

.aur-limit-keep,
.aur-limit-upgrade,
.aur-limit-cancel {
  width: 100%;
  border-radius: 999px;
  font-weight: 600;
  padding: 0.7rem 1rem;
  margin-bottom: 0.55rem;
}

.aur-limit-keep {
  border: none;
  background: #241447;
  color: #fff;
}

.aur-limit-upgrade {
  border: 1px solid #241447;
  background: #fff;
  color: #241447;
}

.aur-limit-cancel {
  border: none;
  background: transparent;
  color: #64748b;
  margin-bottom: 0;
}

.aur-page {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 28px;
  overflow: hidden;
}

.aur-card {
  width: min(780px, 94vw);
  height: min(82vh, 720px);
  max-height: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 28px 36px 24px;
  box-shadow: 0 12px 40px rgba(36, 20, 71, 0.12);
  border: 1px solid rgba(36, 20, 71, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.aur-card--wide {
  width: min(920px, 94vw);
  height: min(84vh, 740px);
}

.aur-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 22px;
  flex-shrink: 0;
}

.aur-step {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
}

.aur-step span {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #94a3b8;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700;
}

.aur-step.active { color: #0f696e; }
.aur-step.active span { background: #0f696e; color: #fff; }
.aur-step.done { color: #64748b; }
.aur-step.done span { background: #241447; color: #fff; }

.aur-step-line {
  flex: 1;
  height: 2px;
  background: #e2e8f0;
  margin: 0 10px;
  min-width: 32px;
}

.aur-back {
  border: none;
  background: transparent;
  color: #241447;
  font-weight: 600;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin-bottom: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
}

.aur-back:hover { color: #0f696e; }

.aur-panel {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-right: 4px;
  scrollbar-width: thin;
  scrollbar-color: #c4b8dc transparent;
}

.aur-panel::-webkit-scrollbar {
  width: 6px;
}

.aur-panel::-webkit-scrollbar-track {
  background: transparent;
}

.aur-panel::-webkit-scrollbar-thumb {
  background: #c4b8dc;
  border-radius: 99px;
}

.aur-panel::-webkit-scrollbar-button {
  display: none;
}

.aur-scope-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 10px 12px;
  margin-bottom: 12px;
  background: #f8fafc;
  border-radius: 10px;
}

.aur-scope-board {
  background: linear-gradient(180deg, #f7fcfc 0%, #ffffff 100%);
  border: 1px solid rgba(15, 105, 110, 0.16);
  border-radius: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.aur-scope-board-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.aur-scope-board-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.aur-scope-board-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(15, 105, 110, 0.1);
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.05rem;
  flex-shrink: 0;
}

.aur-scope-board-kicker {
  margin: 0;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #0f696e;
}

.aur-scope-board-title {
  margin: 2px 0 0;
  font-size: 1rem;
  font-weight: 750;
  color: #241447;
  line-height: 1.25;
  word-break: break-word;
}

.aur-scope-count {
  flex-shrink: 0;
  background: #0f696e;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 5px 10px;
  border-radius: 999px;
  white-space: nowrap;
}

.aur-scope-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.aur-scope-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.1);
  color: #475569;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 8px;
  max-width: 100%;
  word-break: break-all;
}

.aur-scope-chip i {
  color: #0f696e;
  font-size: 0.85rem;
}

.aur-scope-table-wrap {
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  max-height: 140px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c4b8dc transparent;
}

.aur-scope-table-wrap::-webkit-scrollbar {
  width: 6px;
}

.aur-scope-table-wrap::-webkit-scrollbar-thumb {
  background: #c4b8dc;
  border-radius: 99px;
}

.aur-scope-table-wrap::-webkit-scrollbar-button {
  display: none;
}

.aur-scope-table {
  width: 100%;
  border-collapse: collapse;
}

.aur-scope-table th,
.aur-scope-table td {
  padding: 9px 12px;
  text-align: left;
  border-bottom: 1px solid #eef2f7;
  font-size: 0.82rem;
}

.aur-scope-table th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  z-index: 1;
}

.aur-scope-table tbody tr:last-child td {
  border-bottom: none;
}

.aur-scope-table td:first-child,
.aur-scope-table th:first-child {
  width: 42px;
  color: #94a3b8;
  font-weight: 600;
}

.aur-scope-target {
  font-weight: 700;
  color: #1e293b;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.84rem;
}

.aur-scope-subnet {
  margin-left: 4px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 600;
}

.aur-scope-type-pill {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: capitalize;
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
}

.aur-scope-type-pill.is-external {
  background: #ecfeff;
  color: #0f696e;
}

.aur-scope-type-pill.is-internal {
  background: #eef2ff;
  color: #4338ca;
}

.aur-scope-replace-hint {
  margin: 10px 0 0;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 500;
}

.aur-report-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
  margin-top: 2px;
}

.aur-report-stat {
  background: #fff;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-radius: 10px;
  padding: 10px 8px;
  text-align: center;
}

.aur-report-stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 750;
  color: #241447;
  line-height: 1.1;
}

.aur-report-stat-label {
  display: block;
  margin-top: 3px;
  font-size: 0.68rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.aur-header { text-align: center; margin-bottom: 20px; flex-shrink: 0; }

.aur-icon-wrap {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: rgba(15, 105, 110, 0.08);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 12px;
}

.aur-upload-icon { font-size: 26px; color: #0f696e; }
.aur-spin { animation: aur-spin 2.2s linear infinite; }

.aur-title {
  font-size: 24px;
  font-weight: 800;
  color: #241447;
  margin-bottom: 6px;
  letter-spacing: -0.02em;
}

.aur-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  max-width: 520px;
  margin: 0 auto;
}

.aur-choice-grid {
  display: grid;
  gap: 16px;
  flex: 1;
  min-height: 0;
  align-content: stretch;
}

@media (min-width: 700px) {
  .aur-choice-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.aur-choice-card {
  text-align: left;
  border: 1px solid rgba(36, 20, 71, 0.1);
  border-radius: 16px;
  background: #faf9fc;
  padding: 1.5rem 1.4rem 1.35rem;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, box-shadow 0.15s, transform 0.15s;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: 100%;
}

.aur-choice-card:hover {
  border-color: #241447;
  background: #fff;
  box-shadow: 0 8px 24px rgba(36, 20, 71, 0.08);
  transform: translateY(-1px);
}

.aur-choice-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(15, 105, 110, 0.1);
  color: #0f696e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  margin-bottom: 0.9rem;
}

.aur-choice-icon--alt {
  background: rgba(36, 20, 71, 0.08);
  color: #241447;
}

.aur-choice-title {
  margin: 0 0 0.5rem;
  font-size: 1.15rem;
  font-weight: 800;
  color: #241447;
}

.aur-choice-copy {
  margin: 0;
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.5;
  flex: 1;
}

.aur-choice-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.92rem;
  font-weight: 700;
  color: #0f696e;
  margin-top: 1.1rem;
}

.aur-dropzone {
  position: relative;
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  padding: 28px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  margin-bottom: 14px;
  flex: 1;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.aur-dropzone:hover,
.aur-dropzone-active {
  border-color: #0f696e;
  background: rgba(15, 105, 110, 0.04);
}

.aur-dropzone-has-file {
  border-color: #0f696e;
  border-style: solid;
  background: rgba(15, 105, 110, 0.03);
  flex: 0 0 auto;
  min-height: 0;
  padding: 16px 20px;
}

/* Hidden input (scope CSV still uses programmatic click) */
.aur-file-input { display: none; }

/* Full-zone clickable input — avoids broken $refs.fileInput.click() + display:none */
.aur-file-input--overlay {
  display: block;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
  font-size: 0;
}

.aur-drop-content {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.aur-drop-icon { font-size: 34px; color: #94a3b8; margin-bottom: 8px; }
.aur-drop-text { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 4px; }
.aur-drop-sub { font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.aur-browse { color: #0f696e; font-weight: 600; text-decoration: underline; }
.aur-drop-types { font-size: 11px; color: #9ca3af; letter-spacing: 0.04em; margin: 0; }

.aur-uploaded-files {
  list-style: none;
  margin: 0.75rem 0 0.85rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.aur-uploaded-files li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f7f5fb;
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
  color: #241447;
  font-size: 0.86rem;
  font-weight: 600;
}

.aur-uploaded-file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.aur-uploaded-file-ips {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f696e;
  background: #e8f6f6;
  border-radius: 999px;
  padding: 0.15rem 0.55rem;
}

.aur-uploaded-files i {
  color: #0f696e;
}

.aur-file-list {
  list-style: none;
  margin: 0.75rem 0 0.85rem;
  padding: 0 10px 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1 0 auto;
  min-height: 120px;
  max-height: min(320px, 38vh);
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: auto;
  scrollbar-color: #0f696e #e8e4f2;
}

.aur-file-list::-webkit-scrollbar {
  width: 12px;
}

.aur-file-list::-webkit-scrollbar-track {
  background: #efeaf8;
  border-radius: 8px;
}

.aur-file-list::-webkit-scrollbar-thumb {
  background: #0f696e;
  border-radius: 8px;
  border: 2px solid #efeaf8;
}

.aur-file-list::-webkit-scrollbar-button {
  display: none;
}

.aur-file-list .aur-file-info {
  background: #f7f5fb;
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  min-height: 64px;
}

.aur-file-list .aur-file-info > div {
  min-width: 0;
  flex: 1;
}

.aur-file-count {
  margin: 0 0 0.75rem;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #0f696e;
}

.aur-file-info {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}

.aur-file-icon { font-size: 32px; color: #0f696e; flex-shrink: 0; }
.aur-file-name {
  font-size: 14px;
  font-weight: 700;
  color: #241447;
  margin: 0;
  overflow-wrap: anywhere;
  word-break: break-word;
}
.aur-file-size { font-size: 12px; color: #6b7280; margin: 2px 0 0; }

.aur-remove-btn {
  margin-left: auto;
  background: none; border: none;
  color: #ef4444; font-size: 20px;
  cursor: pointer; flex-shrink: 0;
}

.aur-field-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #241447;
  margin-bottom: 0.45rem;
}

.aur-textarea {
  width: 100%;
  border: 1px solid rgba(36, 20, 71, 0.15);
  border-radius: 12px;
  padding: 0.9rem 1rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #241447;
  resize: none;
  flex: 1;
  min-height: 180px;
  background: #faf9fc;
  margin-bottom: 0.55rem;
}

.aur-textarea:focus {
  outline: none;
  border-color: #241447;
  box-shadow: 0 0 0 0.2rem rgba(36, 20, 71, 0.1);
  background: #fff;
}

.aur-textarea.has-errors {
  border-color: #dc2626;
  background: #fff8f8;
}

.aur-manual-meta {
  font-size: 0.8rem;
  font-weight: 600;
  color: #0f696e;
  margin-bottom: 0.65rem;
}

.aur-manual-meta-warn {
  color: #c2410c;
}

.aur-submit-summary {
  margin: 0 0 0.55rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #241447;
}

.aur-line-errors {
  list-style: none;
  margin: 0 0 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  overflow: visible;
  max-height: none;
}

.aur-line-errors li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  padding: 0.2rem 0;
  font-size: 0.78rem;
  line-height: 1.4;
}

.aur-line-errors li:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.aur-line-errors strong {
  color: #991b1b;
  word-break: break-all;
}

.aur-line-errors span {
  color: #b91c1c;
  font-weight: 600;
}

.aur-progress-wrap {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 14px;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.aur-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.aur-progress-label { font-size: 13px; font-weight: 600; color: #374151; }
.aur-progress-pct { font-size: 14px; font-weight: 800; color: #0f696e; }

.aur-progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.aur-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0f696e, #10b981);
  border-radius: 99px;
  transition: width 0.3s ease;
}

.aur-progress-indeterminate {
  width: 35%;
  animation: aur-indeterminate 1.2s ease-in-out infinite;
}

.aur-progress-hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 10px 0 0;
  text-align: center;
}

.aur-generating { text-align: center; }

.aur-error {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #dc2626;
  text-align: center;
  line-height: 1.4;
  white-space: pre-line;
  flex-shrink: 0;
}

.aur-plan-offer {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  margin: 0 0 12px;
  padding: 12px 14px;
  border-radius: 14px;
  background: #eef8f8;
  border: 1px solid rgba(15, 105, 110, 0.18);
  flex-shrink: 0;
}

.aur-plan-offer-copy {
  margin: 0 0 4px;
  color: #0f696e;
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  line-height: 1.45;
}

.aur-plan-offer .aur-limit-keep,
.aur-plan-offer .aur-limit-upgrade {
  margin-bottom: 0;
}

.aur-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.aur-btn-primary {
  width: 100%;
  padding: 13px;
  background: #0f696e;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.aur-btn-primary:hover:not(:disabled) { background: #0a4e52; }
.aur-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.aur-btn-primary.aur-btn-secondary {
  background: #fff;
  color: #241447;
  border: 1.5px solid #241447;
}
.aur-btn-primary.aur-btn-secondary:hover:not(:disabled) {
  background: #f7f5fb;
}

.aur-info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 11px;
  color: #94a3b8;
  line-height: 1.4;
  text-align: left;
  flex-shrink: 0;
  margin: 0;
}

.aur-info-icon { color: #0f696e; flex-shrink: 0; margin-top: 1px; }

@keyframes aur-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes aur-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(320%); }
}

/* Keep each step panel inside the card height */
.aur-card > div:not(.aur-steps) {
  min-height: 0;
  display: flex;
  flex-direction: column;
}

@media (max-width: 576px) {
  .aur-page { padding: 10px 12px; }
  .aur-card,
  .aur-card--wide {
    width: 100%;
    height: min(88vh, 100%);
    padding: 18px 16px 14px;
  }
  .aur-title { font-size: 20px; }
  .aur-steps { gap: 0; margin-bottom: 14px; }
  .aur-step-line { min-width: 16px; }
  .aur-dropzone { padding: 18px 12px; min-height: 120px; }
  .aur-choice-card { padding: 1.15rem 1rem; }
}
</style>
