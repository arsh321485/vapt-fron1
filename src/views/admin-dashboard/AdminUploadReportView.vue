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
              <template v-if="planSuggestPrompt.unpaidResume">
                {{ planSuggestLeadCopy }}
              </template>
              <template v-else>
                <template v-if="planSuggestPrompt.count">
                  This {{ planSuggestPrompt.source === 'upload' ? 'report' : 'scope' }} has
                  <strong>{{ planSuggestPrompt.count }}</strong>
                  IP{{ planSuggestPrompt.count === 1 ? '' : 's' }}.
                  Based on that count,
                </template>
                <strong>{{ planSuggestPrompt.suggestedName }}</strong> is recommended.
                You can continue with it, or choose a different plan.
                If you choose a smaller plan, you will upload a new report that fits that plan.
              </template>
            </p>
            <ul
              v-if="planSuggestPrompt.unpaidResume && existingUploadedFiles.length"
              class="aur-uploaded-files"
            >
              <li v-for="(name, idx) in existingUploadedFiles" :key="name + '-' + idx">
                <i class="bi bi-file-earmark-text"></i>
                <span>{{ name }}</span>
              </li>
            </ul>
            <p
              v-else-if="planSuggestPrompt.unpaidResume && hasExistingScope"
              class="aur-limit-copy"
            >
              Saved scope: <strong>{{ existingScopeDisplayName }}</strong>
            </p>
            <p v-if="planSuggestPrompt.unpaidResume && planSuggestPrompt.count" class="aur-limit-copy">
              This {{ planSuggestPrompt.source === 'upload' ? 'report' : 'scope' }} has
              <strong>{{ planSuggestPrompt.count }}</strong>
              IP{{ planSuggestPrompt.count === 1 ? '' : 's' }}.
              <strong>{{ planSuggestPrompt.suggestedName }}</strong> is recommended.
              Choose Freemium, Premium, or Custom. Freemium can keep this file — extra assets stay locked until you upgrade.
            </p>
            <button type="button" class="aur-limit-keep" :disabled="planSuggestBusy" @click="selectPlanForUpload(planSuggestPrompt.suggested)">
              <span v-if="planSuggestBusy" class="spinner-border spinner-border-sm me-2"></span>
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

        <!-- GENERATING AGENTS STATE -->
        <div v-else-if="generating" class="aur-generating">
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

            <div v-if="loadingExistingReport" class="aur-scope-loading">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Loading current report...
            </div>

            <div v-else-if="hasExistingReport && !activePlanFitNotice" class="aur-scope-board">
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
                    ? 'Changed your mind? Continue with this file, or upload a new one below.'
                    : 'Upload another file below — it will merge with the files above (up to 10 per day).'
                }}
              </p>
            </div>

            <div
              class="aur-dropzone"
              :class="{ 'aur-dropzone-active': isDragging, 'aur-dropzone-has-file': selectedFiles.length }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                name="file"
                multiple
                accept=".nessus,.xml,.html,.htm,.csv,.xlsx,.xls,.pdf,.docx,.doc"
                class="aur-file-input"
                @change="onFileChange"
              />

              <div class="aur-drop-content">
                <i class="bi bi-file-earmark-arrow-up aur-drop-icon"></i>
                <p class="aur-drop-text">
                  {{ selectedFiles.length ? 'Drop more reports, or browse' : 'Drag &amp; drop your reports here' }}
                </p>
                <p class="aur-drop-sub">or <span class="aur-browse">browse files</span></p>
                <p class="aur-drop-types">Up to 10 files / day · merged into one report</p>
                <p class="aur-drop-types">.nessus · .xml · .html · .htm · .csv · .xlsx · .xls · .pdf · .docx · .doc</p>
              </div>
            </div>

            <ul v-if="selectedFiles.length" class="aur-file-list">
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
                v-if="canContinueWithExistingFile"
                type="button"
                class="aur-btn-primary"
                :disabled="uploading || planSuggestBusy"
                @click="continueWithExistingFile"
              >
                <i class="bi bi-check2-circle me-1"></i>
                Continue with the same file
              </button>
              <button
                v-if="selectedFiles.length"
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
                <h3 class="aur-choice-title">Upload File</h3>
                <p class="aur-choice-copy">
                  Upload a CSV, Excel, or text file of assets / IPs. One row per target works best.
                </p>
                <span class="aur-choice-cta">
                  Upload file <i class="bi bi-arrow-right"></i>
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
import { isClaimInviteFlow } from '@/utils/claimInvite';
import { isScopeAwaitingScan, markScopeAwaitingScan } from '@/utils/scopeScanGate';
import { isExternalDeepLink } from '@/utils/routeLock';
import {
  billingErrorMessage,
  checkoutFreemium,
  getMySubscription,
  syncSubscriptionAssets,
} from '@/services/billingApi';
import {
  collectFreemiumTrimmedResults,
  extraIpCount,
  formatFreemiumTrimmedMessage,
  freemiumLocksUploadScope,
  fullReportAssetCount,
  isActiveSubscription,
  isExistingSubscriptionMessage,
  isFreemiumPlan,
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
  rememberFullAssetCount,
  setBillingReturnTo,
  suggestedPlanFromAssetCount,
  UPLOAD_RETURN_PATH,
} from '@/utils/planLimits';
import {
  collectInvalidScopeLines,
  extractPlanRecommendation,
  extractScopeProcessing,
  isValidScopeTarget,
  planRecommendationBreakdown,
  planRecommendationMessage,
} from '@/utils/scopeTargets';
import { setCachedPaidPlan } from '@/utils/authenticatedHome';
import { consumeHandoffError } from '@/utils/adminHandoff';
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
      planSuggestResolved: false,
      uploadPlanOffer: null,
      uploadBeforePay: false,
      savedSuggestPrompt: null,
      pendingPlan: '',
      planFitNotice: null,
      replacingFile: false,
      scopeLineErrors: [],
      scopeSubmitSummary: null,
    };
  },
  computed: {
    planSuggestLeadCopy() {
      return this.planContinueCopy(
        this.planSuggestPrompt?.suggested,
        this.planSuggestPrompt?.source,
      );
    },
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
      if (this.activePlanFitNotice) return false;
      if (this.viewMode === 'upload') return this.hasExistingReport;
      if (this.viewMode === 'scope-csv' || this.viewMode === 'scope-manual') {
        return this.hasExistingScope;
      }
      return false;
    },
    existingUploadedFiles() {
      const fromApi = this.existingReport?.uploaded_file_names;
      if (Array.isArray(fromApi) && fromApi.length) {
        return fromApi.map((name) => String(name)).filter(Boolean);
      }
      const single = this.existingReportFileName;
      return single && single !== 'Uploaded report' ? [single] : [];
    },
    existingReportIpCount() {
      const r = this.existingReport || {};
      return Math.max(
        fullReportAssetCount(r),
        fullReportAssetCount(this.uploadResult),
        peekBillableAssetCount(),
      );
    },
    hasExistingReport() {
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
      if (!trimmed.length) return;
      const locked = trimmed.reduce(
        (sum, row) => sum + (Number(row.locked_asset_count ?? row.locked_assets) || 0),
        0,
      );
      rememberFullAssetCount({
        ...trimmed[0],
        locked_asset_count: locked || trimmed[0].locked_asset_count,
      });
      await Swal.fire({
        icon: 'info',
        text: formatFreemiumTrimmedMessage({
          ...trimmed[0],
          locked_asset_count: locked || trimmed[0].locked_asset_count,
        }),
        confirmButtonText: 'OK',
        confirmButtonColor: '#241447',
      });
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
      const nextAfterPay = '/communication';
      const count = Math.max(
        Number(assetCount) || 0,
        fullReportAssetCount(this.uploadResult),
        fullReportAssetCount(this.existingReport),
        peekBillableAssetCount(),
      );
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
      const mode = String(extras.mode || '').toLowerCase();
      if (mode === 'testing' || mode === 'management_testing') query.mode = 'testing';
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
        const text = 'Could not reach the server. Check your internet connection and try again.';
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
      this.uploadError = msg || 'Invalid file';
      Swal.fire({
        icon: 'error',
        title: isInvalidScanFileMessage(msg) ? 'Invalid file' : 'Upload failed',
        text: this.uploadError,
        confirmButtonText: 'OK',
        confirmButtonColor: '#241447',
      });
    },
    showInvalidFileError(backendMessage) {
      this.showUploadError(backendMessage);
    },
    async activateFreemiumAndContinue() {
      this.planSuggestBusy = true;
      this.uploadError = '';
      try {
        if (isActiveSubscription(this.subscription) && isFreemiumPlan(this.subscription)) {
          setCachedPaidPlan(true);
          markFreemiumActiveNotice();
          useAuthStore().unmarkStepCompleted(1);
          await this.$router.replace(this.dashboardRoute());
          return;
        }
        const data = await checkoutFreemium(false);
        this.subscription = data?.subscription || this.subscription;
        setCachedPaidPlan(true);
        markFreemiumActiveNotice();
        useAuthStore().lockAutomationScriptsForFreemium(
          'Automation scripts are not available on the Freemium plan. Upgrade to Premium to download scripts.',
        );
        useAuthStore().unmarkStepCompleted(1);
        await this.toastNotice(
          'success',
          'Freemium started',
          'Your free plan is active. Continue to add your team.',
          1800,
        );
        await this.$router.replace(this.dashboardRoute());
      } catch (error) {
        const message = billingErrorMessage(error);
        if (isExistingSubscriptionMessage(message)) {
          setCachedPaidPlan(true);
          markFreemiumActiveNotice();
          await this.loadSubscription();
          useAuthStore().unmarkStepCompleted(1);
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
      }
    },
    showPlanSuggestPrompt(source, count, hintedPlan = '', unpaidResume = false) {
      if (this.planSuggestResolved && !unpaidResume && !this.pendingPlan) return false;
      const n = Number(count) || 0;
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
      return true;
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
        payload.asset_count ||
        payload.host_count ||
        payload.hosts_count ||
        payload.ip_count ||
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
      if (this.showPlanSuggestPrompt('upload', count, suggested, true)) {
        return true;
      }
      if (count && this.isPlanLimitError(payload, message) && this.showPlanLimitPrompt('upload', count)) {
        return true;
      }
      return false;
    },
    async promptUnpaidPlanChoice(source = 'upload', count = 0) {
      if (isClaimInviteFlow()) return false;
      await this.loadSubscription();
      if (isActiveSubscription(this.subscription)) return false;
      let n = Number(count) || 0;
      if (!n) {
        n = Number(this.existingReportIpCount || this.existingEntryCount || 0);
      }
      if (!n) {
        try {
          const authStore = useAuthStore();
          await authStore.fetchAssets(true);
          n = Number(authStore.assetCount) || (authStore.assetRows || []).length || 0;
        } catch {
          /* keep 0 — still show Freemium */
        }
      }
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
      this.stopPolling();
      this.generating = false;
      this.redirecting = false;
      this.reportIds = [];
      this.statusByReportId = {};
      const source = this.planSuggestPrompt?.source || this.savedSuggestPrompt?.source || 'upload';
      this.planSuggestPrompt = null;
      this.planLimitPrompt = null;
      this.uploadPlanOffer = null;
      this.savedSuggestPrompt = null;
      this.planSuggestResolved = true;
      this.planFitNotice = null;
      this.pendingPlan = '';
      this.replacingFile = true;
      this.clearFileState();
      const mode = source === 'scope-csv'
        ? 'scope-csv'
        : source === 'scope-manual'
          ? 'scope-manual'
          : 'upload';
      this.viewMode = mode;
      const query = { ...this.$route.query, replace: '1', mode };
      this.$router.replace({ path: '/admin-upload-report', query }).catch(() => {});
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

        let count = Number(this.existingReportIpCount || this.existingEntryCount || 0);
        if (!count) {
          try {
            const authStore = useAuthStore();
            await authStore.fetchAssets(true);
            count = Number(authStore.assetCount) || (authStore.assetRows || []).length || 0;
          } catch {
            /* still continue to pricing */
          }
        }
        this.planSuggestResolved = false;
        const source = this.viewMode === 'scope-csv'
          ? 'scope-csv'
          : this.viewMode === 'scope-manual'
            ? 'scope-manual'
            : 'upload';
        if (this.showPlanSuggestPrompt(source, count, '', true)) return;
        const planId = suggestedPlanFromAssetCount(count) || 'premium';
        this.goToPricing(planId, count, true);
      } finally {
        this.planSuggestBusy = false;
      }
    },
    backToPlanChoices() {
      this.planLimitPrompt = null;
      this.planLimitBusy = false;
      if (this.savedSuggestPrompt) {
        this.planSuggestPrompt = this.savedSuggestPrompt;
        this.savedSuggestPrompt = null;
        return;
      }
      const count = this.existingReportIpCount || this.existingEntryCount || 0;
      this.showPlanSuggestPrompt('upload', count, '', true);
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
      const count = Number(
        this.planSuggestPrompt?.count ||
        this.uploadPlanOffer?.count ||
        this.planLimitPrompt?.count ||
        this.existingReportIpCount ||
        this.existingEntryCount ||
        0,
      );
      const source =
        this.planSuggestPrompt?.source ||
        this.uploadPlanOffer?.source ||
        (this.viewMode === 'scope-csv' ? 'scope-csv' : this.viewMode === 'scope-manual' ? 'scope-manual' : 'upload');
      const extra = extraIpCount(count, planAssetLimit(planId));
      if (extra > 0 && planBlocksOversizedUpload(planId)) {
        this.requireFileForPlan(planId, source, count);
        return;
      }
      await this.continueWithSelectedPlan(planId, count);
    },
    async continueWithSelectedPlan(planId, assetCount = 0) {
      if (!planId || this.uploading) return;
      const count = Math.max(
        Number(assetCount) || 0,
        Number(this.uploadPlanOffer?.count) || 0,
        Number(this.planSuggestPrompt?.count) || 0,
        Number(this.planLimitPrompt?.count) || 0,
        Number(this.planFitNotice?.count) || 0,
        this.existingReportIpCount,
        this.existingEntryCount,
        peekBillableAssetCount(),
      );
      const files = this.selectedFiles.length
        ? this.selectedFiles
        : (this.selectedFile ? [this.selectedFile] : []);
      const alreadyOnServer = !!(this.hasExistingReport || this.uploadResult || this.existingReportId);
      const fromScope =
        this.viewMode === 'scope-csv' ||
        this.viewMode === 'scope-manual' ||
        this.planSuggestPrompt?.source === 'scope-csv' ||
        this.planSuggestPrompt?.source === 'scope-manual' ||
        (!!this.hasExistingScope && !this.hasExistingReport);
      this.planSuggestBusy = true;
      this.uploadError = '';

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
      if (fromScope) markScopeAwaitingScan();

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
      this.goToPricing(
        planId,
        count,
        alreadyOnServer,
        fromScope ? { mode: 'testing' } : {},
      );
    },
    async finishSuccessfulUpload(res) {
      this.uploadPct = 100;
      this.uploadResult = res.data;
      const authStore = useAuthStore();
      const reportIds = this.extractReportIds(res.data);
      if (!reportIds.length) {
        this.uploadError = 'Upload succeeded but no report_id was returned.';
        Swal.fire('Upload incomplete', this.uploadError, 'warning');
        return false;
      }
      try {
        authStore.setActiveReportId(reportIds[0]);
        await this.loadExistingReport();
        if (!this.existingReport) {
          try {
            const getRes = await authStore.getUploadReportById(reportIds[0]);
            if (getRes.status && getRes.data) {
              const names = authStore.extractUploadedFileNames(getRes.data);
              this.existingReport = {
                ...getRes.data,
                report_id: getRes.data.report_id || getRes.data.id || getRes.data._id || reportIds[0],
                resolved_file_name:
                  names[0] ||
                  authStore.extractUploadedFileName(getRes.data) ||
                  getRes.data.file_name ||
                  getRes.data.filename ||
                  this.selectedFiles[0]?.name ||
                  this.selectedFile?.name ||
                  null,
                uploaded_file_names: names.length ? names : (this.selectedFiles.map((f) => f.name)),
              };
            }
          } catch (getErr) {
            console.error('Report GET after upload failed:', getErr);
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
        try {
          await clearPendingUpload();
        } catch {
          /* ignore */
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
            this.goToPricing(chosenPlan, count || limit, true);
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
          if (!isActiveSubscription(this.subscription)) {
            this.goToPricing(chosenPlan, limit, this.hasExistingScope);
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
          if (!isActiveSubscription(this.subscription)) {
            this.goToPricing(chosenPlan, limit, this.hasExistingScope);
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
          this.goToPricing(chosenPlan, limit, true);
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
      const lines = String(text || '')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);
      if (!lines.length) return 0;
      const hasHeader = /ip|host|asset|target|url|address/.test(lines[0].toLowerCase());
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
      const count = Number(authStore.assetCount) || (authStore.assetRows || []).length;
      const fullCount = Math.max(count, this.existingReportIpCount, peekBillableAssetCount());
      if (this.showPlanSuggestPrompt('upload', fullCount)) return false;
      if (
        isActiveSubscription(this.subscription) &&
        planBlocksOversizedUpload(this.subscription)
      ) {
        const limit = planAssetLimit(this.subscription);
        if (Number.isFinite(limit) && this.showPlanLimitPrompt('upload', count)) return false;
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
      this.loadingExistingReport = true;
      try {
        const authStore = useAuthStore();
        const res = await authStore.fetchActiveUploadReport();
        if (res.status && res.data) {
          this.existingReport = res.data;
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
    async routeAfterManualScope(rec, created) {
      await this.loadSubscription();
      const plan = rec?.recommended_plan || '';
      const count = Number(rec?.total_scope_assets) || created || 0;
      const breakdown = planRecommendationBreakdown(rec);

      if (plan === 'premium') {
        const alreadyPremium =
          isActiveSubscription(this.subscription) && !isFreemiumPlan(this.subscription);
        if (alreadyPremium) {
          markScopeAwaitingScan();
          this.$router.replace('/communication');
          return;
        }
        const message = planRecommendationMessage(rec);
        const escapeHtml = (value) =>
          String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
        const result = await Swal.fire({
          icon: 'info',
          title: 'Unlock extra assets with Premium',
          html: breakdown && breakdown !== message
            ? `<p>${escapeHtml(message)}</p><p><strong>${escapeHtml(breakdown)}</strong></p>`
            : escapeHtml(message),
          showCancelButton: true,
          confirmButtonText: 'Continue with Premium',
          cancelButtonText: 'Stay on Freemium',
          confirmButtonColor: '#241447',
          cancelButtonColor: '#64748b',
          reverseButtons: true,
        });
        this.planSuggestResolved = true;
        if (result.isConfirmed) {
          this.goToPricing('premium', count, true, { mode: 'testing' });
        } else {
          await this.activateFreemiumAndContinue();
        }
        return;
      }

      if (!isActiveSubscription(this.subscription)) {
        this.showPlanSuggestPrompt('scope-manual', count, plan || '', true);
        return;
      }
      markScopeAwaitingScan();
      this.$router.replace('/communication');
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
        markScopeAwaitingScan();
        const rec = extractPlanRecommendation(res);
        const breakdown = planRecommendationBreakdown(rec);
        await this.toastNotice(
          processing.error_count ? 'warning' : 'success',
          'Scope submitted',
          `${created} valid target(s) created` +
            (processing.error_count ? ` · ${processing.error_count} rejected` : '') +
            (skipped ? ` · ${skipped} skipped` : '') +
            (breakdown ? ` · ${breakdown}` : ''),
          1800,
        );
        localStorage.removeItem('isNewProject');
        await this.routeAfterManualScope(rec, created);
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
      markScopeAwaitingScan();
      await this.loadSubscription();
      if (!isActiveSubscription(this.subscription)) {
        const count = created || this.existingEntryCount;
        this.showPlanSuggestPrompt(
          this.viewMode === 'scope-csv' ? 'scope-csv' : 'scope-manual',
          count,
          '',
          true,
        );
        return;
      }
      this.$router.replace('/communication');
    },
    async submitScopeCsv() {
      if (!this.selectedFile || this.scopeSubmitting) return;
      if (!this.isScopeFile(this.selectedFile)) {
        this.uploadError = SCOPE_FILE_ERROR;
        return;
      }
      if (!this.planSuggestResolved) {
        const count = await this.countCsvTargets(this.selectedFile);
        if (this.showPlanSuggestPrompt('scope-csv', count)) return;
      }
      if (!this.planLimitResolved && isActiveSubscription(this.subscription) && !isFreemiumPlan(this.subscription)) {
        const count = await this.countCsvTargets(this.selectedFile);
        if (this.showPlanLimitPrompt('scope-csv', count)) return;
      }

      this.scopeSubmitting = true;
      this.uploadError = '';
      try {
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('expand_subnets', 'false');

        const authStore = useAuthStore();
        let res = await authStore.createScope(formData);

        if (!res.status) {
          this.showInvalidFileError(res.message);
          return;
        }

        const preferredName = String(this.selectedFile?.name || '')
          .replace(/\.(csv|xlsx|xls|txt)$/i, '')
          .trim();
        res = await this.ensureScopeGetAfterCreate(res, preferredName);
        await this.handleScopeCreateSuccess(res);
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
    onFileChange(e) {
      this.addReportFiles(e.target.files);
      e.target.value = '';
    },
    onDrop(e) {
      this.isDragging = false;
      this.addReportFiles(e.dataTransfer.files);
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

      let count = this.existingReportIpCount || this.existingEntryCount || 0;
      if (!count) {
        try {
          const authStore = useAuthStore();
          await authStore.fetchAssets(true);
          count = Number(authStore.assetCount) || (authStore.assetRows || []).length || 0;
        } catch {
          /* ignore */
        }
      }

      if (this.hasExistingReport) {
        this.viewMode = 'upload';
        this.showPlanSuggestPrompt('upload', count, '', true);
        return true;
      }
      if (this.hasExistingScope) {
        this.viewMode = this.existingScopeLabel ? 'scope-csv' : 'scope-manual';
        this.showPlanSuggestPrompt(
          this.existingScopeLabel ? 'scope-csv' : 'scope-manual',
          count || this.existingEntryCount,
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
          const hasSlackFile =
            upload.file_uploaded === true ||
            upload.cards_generating === true ||
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
        if (this.hasExistingReport) {
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
          await this.redirectAfterAgentsReady();
        }
      } finally {
        this.polling = false;
      }
    },
    startPolling(reportIds) {
      this.reportIds = reportIds;
      this.statusByReportId = {};
      this.generating = true;
      this.redirecting = false;
      this.stopPolling();
      this.pollOnce();
      this.pollTimer = setInterval(() => {
        if (!document.hidden && !this.redirecting) this.pollOnce();
      }, STATUS_POLL_MS);
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

      this.uploading = true;
      this.uploadPct = 0;
      this.uploadError = '';
      this.uploadPlanOffer = null;
      this.uploadResult = null;
      let uploadAccepted = false;

      try {
        const authStore = useAuthStore();
        const res = await authStore.uploadAdminReport(files, (pct) => {
          this.uploadPct = pct;
        });

        if (!res.status) {
          await this.loadSubscription();
          if (this.handleUploadPlanFailure(res)) return;
          this.showInvalidFileError(res.message);
          return;
        }

        uploadAccepted = true;
        this.uploadPct = 100;
        await this.notifyFreemiumTrimmed(res.data);
        await this.finishSuccessfulUpload(res);
        if (await this.promptUnpaidPlanChoice('upload', this.existingReportIpCount)) {
          Swal.fire({
            icon: 'info',
            title: 'Choose a plan to continue',
            text: this.planSuggestLeadCopy,
            confirmButtonColor: '#241447',
          });
          return;
        }
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
        this.showInvalidFileError(msg);
      } finally {
        this.uploading = false;
      }
    },
  },
  async mounted() {
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
    // Dashboard "Upload Scope" must stay on this page so they can upload a new file.
    // First-time onboarding still skips this screen once a report already exists.
    if (status?.hasReport && !this.isExplicitScopeVisit) {
      this.redirecting = true;
      await this.$router.replace(await authStore.getAdminOnboardingRoute());
      return;
    }
    if (await this.redirectIfReportReadyFromElsewhere()) return;
    if (await this.resumeUnpaidScopePayment()) return;
    this.startExternalReportWatch();
    await this.resumePendingUploadIfNeeded();
  },
  watch: {
    '$route.query.mode'() {
      this.applyRouteMode();
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
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
}

.aur-limit-card {
  width: 100%;
  max-width: 460px;
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

.aur-file-input { display: none; }

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
