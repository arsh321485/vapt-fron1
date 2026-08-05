<template>
  <main class="aur-root">
    <!-- Top bar -->
    <div class="aur-topbar">
      <img src="@/assets/images/vaptfix_white.png" alt="VaptFix" class="aur-logo" />
    </div>

    <div class="aur-page">
      <div class="aur-card">

        <!-- Step indicator -->
        <div class="aur-steps">
          <div class="aur-step done"><span>1</span> Sign Up</div>
          <div class="aur-step-line"></div>
          <div class="aur-step active"><span>2</span> Upload Report</div>
          <div class="aur-step-line"></div>
          <div class="aur-step"><span>3</span> Get Started</div>
        </div>

        <!-- SUCCESS STATE -->
        <div v-if="uploadSuccess" class="aur-success">
          <div class="aur-success-icon">
            <i class="bi bi-check-circle-fill"></i>
          </div>
          <h2 class="aur-success-title">Report Uploaded Successfully!</h2>
          <p class="aur-success-msg">
            Your vulnerability scan report has been uploaded. A notification has been sent to your Super Admin for review.
          </p>
          <div class="aur-notif-banner">
            <i class="bi bi-bell-fill"></i>
            <span>Super Admin has been notified</span>
          </div>
          <button class="aur-btn-primary" @click="goNext">
            Continue
            <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>

        <!-- UPLOAD STATE -->
        <template v-else>
          <div class="aur-header">
            <div class="aur-icon-wrap">
              <i class="bi bi-cloud-arrow-up aur-upload-icon"></i>
            </div>
            <h1 class="aur-title">Upload Your Scan Report</h1>
            <p class="aur-subtitle">
              Upload your vulnerability assessment file (.xml, .nessus, .csv, .html, AWS Inspector, Custom) to begin.
            </p>
          </div>

          <!-- Drop zone -->
          <div
            class="aur-dropzone"
            :class="{ 'aur-dropzone-active': isDragging, 'aur-dropzone-has-file': selectedFile }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            @click="$refs.fileInput.click()"
          >
            <input
              ref="fileInput"
              type="file"
              accept=".xml,.nessus,.csv,.xlsx,.xls,.html,.htm"
              class="aur-file-input"
              @change="onFileChange"
            />

            <div v-if="!selectedFile" class="aur-drop-content">
              <i class="bi bi-file-earmark-arrow-up aur-drop-icon"></i>
              <p class="aur-drop-text">Drag &amp; drop your report here</p>
              <p class="aur-drop-sub">or <span class="aur-browse">browse files</span></p>
              <p class="aur-drop-types">.xml · .nessus · .csv · .xlsx · .html · AWS · Custom</p>
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

          <!-- Progress bar -->
          <div v-if="uploading" class="aur-progress-wrap">
            <div class="aur-progress-header">
              <span class="aur-progress-label">Uploading...</span>
              <span class="aur-progress-pct">{{ uploadPct }}%</span>
            </div>
            <div class="aur-progress-bar">
              <div class="aur-progress-fill" :style="{ width: uploadPct + '%' }"></div>
            </div>
            <p class="aur-progress-hint">Please wait, do not close this window</p>
          </div>

          <!-- Actions -->
          <div class="aur-actions">
            <button
              class="aur-btn-primary"
              :disabled="!selectedFile || uploading"
              @click="startUpload"
            >
              <span v-if="uploading">
                <span class="spinner-border spinner-border-sm me-1"></span>
                Uploading...
              </span>
              <span v-else>
                <i class="bi bi-cloud-upload me-1"></i>
                Upload Report
              </span>
            </button>
            <button class="aur-btn-skip" @click="skipUpload">
              Skip for now
            </button>
          </div>

          <div class="aur-info-row">
            <i class="bi bi-shield-lock aur-info-icon"></i>
            <span>Your file is encrypted and stored securely. Only your Super Admin and team can access it.</span>
          </div>
        </template>

      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AdminUploadReportView',
  data() {
    return {
      selectedFile: null,
      isDragging: false,
      uploading: false,
      uploadPct: 0,
      uploadSuccess: false,
      selectedType: 'nessus',
      reportTypes: [
        { id: 'nessus', icon: '🔍', label: 'Nessus', desc: '.nessus · .xml' },
        { id: 'aws', icon: '☁️', label: 'AWS', desc: 'AWS Inspector' },
        { id: 'custom', icon: '📄', label: 'Custom', desc: '.csv · .html · .xlsx' },
      ],
    };
  },
  computed: {
    fileSize() {
      if (!this.selectedFile) return '';
      const bytes = this.selectedFile.size;
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    },
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) this.selectedFile = file;
    },
    onDrop(e) {
      this.isDragging = false;
      const file = e.dataTransfer.files[0];
      if (file) this.selectedFile = file;
    },
    removeFile() {
      this.selectedFile = null;
      this.$refs.fileInput.value = '';
    },
    async startUpload() {
      if (!this.selectedFile) return;
      this.uploading = true;
      this.uploadPct = 0;

      // Animate progress to 100%
      const interval = setInterval(() => {
        if (this.uploadPct < 95) {
          this.uploadPct += Math.floor(Math.random() * 8) + 3;
          if (this.uploadPct > 95) this.uploadPct = 95;
        }
      }, 150);

      // Simulate upload (replace with real API later)
      await new Promise(resolve => setTimeout(resolve, 2200));

      clearInterval(interval);
      this.uploadPct = 100;

      await new Promise(resolve => setTimeout(resolve, 400));
      this.uploading = false;
      this.uploadSuccess = true;
    },
    skipUpload() {
      this.$router.push('/waiting-for-report');
    },
    goNext() {
      this.$router.push('/waiting-for-report');
    },
  },
};
</script>

<style scoped>
.aur-root {
  min-height: 100vh;
  background: linear-gradient(160deg, #f4f2fb 0%, #ffffff 45%, #ebe7f8 100%);
  font-family: 'Inter', sans-serif;
}

/* ── Topbar ── */
.aur-topbar {
  background: #241447;
  padding: 12px 28px;
  display: flex;
  align-items: center;
}

.aur-logo { height: 36px; width: auto; }

/* ── Page ── */
.aur-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  min-height: calc(100vh - 60px);
}

/* ── Card ── */
.aur-card {
  max-width: 560px;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 44px 40px;
  box-shadow: 0 12px 40px rgba(36, 20, 71, 0.12);
  border: 1px solid rgba(36, 20, 71, 0.08);
}

/* ── Steps ── */
.aur-steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 36px;
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

/* ── Header ── */
.aur-header { text-align: center; margin-bottom: 28px; }

.aur-icon-wrap {
  width: 68px; height: 68px;
  border-radius: 50%;
  background: rgba(15, 105, 110, 0.08);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
}

.aur-upload-icon { font-size: 30px; color: #0f696e; }

.aur-title {
  font-size: 24px;
  font-weight: 800;
  color: #241447;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
}

.aur-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* ── Report Type ── */
.aur-type-section { margin-bottom: 20px; }

.aur-type-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  margin-bottom: 10px;
}

.aur-type-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.aur-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.18s ease;
  font-family: 'Inter', sans-serif;
}

.aur-type-btn:hover {
  border-color: #0f696e;
  background: rgba(15,105,110,0.04);
}

.aur-type-btn-active {
  border-color: #0f696e;
  background: rgba(15,105,110,0.07);
  box-shadow: 0 0 0 3px rgba(15,105,110,0.12);
}

.aur-type-icon { font-size: 22px; }

.aur-type-name {
  font-size: 13px;
  font-weight: 700;
  color: #241447;
}

.aur-type-desc {
  font-size: 10px;
  color: #94a3b8;
  letter-spacing: 0.02em;
}

.aur-type-btn-active .aur-type-name { color: #0f696e; }

/* ── Drop zone ── */
.aur-dropzone {
  border: 2px dashed #cbd5e1;
  border-radius: 14px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8fafc;
  margin-bottom: 20px;
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
}

.aur-file-input { display: none; }

.aur-drop-icon { font-size: 36px; color: #94a3b8; margin-bottom: 10px; }
.aur-drop-text { font-size: 15px; font-weight: 600; color: #374151; margin-bottom: 4px; }
.aur-drop-sub { font-size: 13px; color: #6b7280; margin-bottom: 6px; }
.aur-browse { color: #0f696e; font-weight: 600; text-decoration: underline; }
.aur-drop-types { font-size: 11px; color: #9ca3af; letter-spacing: 0.04em; }

.aur-file-info {
  display: flex;
  align-items: center;
  gap: 14px;
  text-align: left;
}

.aur-file-icon { font-size: 32px; color: #0f696e; flex-shrink: 0; }
.aur-file-name { font-size: 14px; font-weight: 700; color: #241447; margin: 0; }
.aur-file-size { font-size: 12px; color: #6b7280; margin: 2px 0 0; }

.aur-remove-btn {
  margin-left: auto;
  background: none; border: none;
  color: #ef4444; font-size: 20px;
  cursor: pointer; flex-shrink: 0;
}

/* ── Progress ── */
.aur-progress-wrap {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 20px;
  margin-bottom: 20px;
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

.aur-progress-hint {
  font-size: 12px;
  color: #9ca3af;
  margin: 10px 0 0;
  text-align: center;
}

/* ── Actions ── */
.aur-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
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

.aur-btn-skip {
  width: 100%;
  padding: 10px;
  background: none;
  color: #6b7280;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}
.aur-btn-skip:hover { border-color: #94a3b8; color: #374151; }

/* ── Info ── */
.aur-info-row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
  text-align: left;
}

.aur-info-icon { color: #0f696e; flex-shrink: 0; margin-top: 1px; }

/* ── Success ── */
.aur-success { text-align: center; padding: 16px 0; }

.aur-success-icon { font-size: 56px; color: #10b981; margin-bottom: 16px; }
.aur-success-title {
  font-size: 24px; font-weight: 800; color: #241447;
  margin-bottom: 12px; letter-spacing: -0.02em;
}
.aur-success-msg {
  font-size: 14px; color: #4b5563; line-height: 1.65;
  margin-bottom: 20px;
}

.aur-notif-banner {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(15, 105, 110, 0.08);
  border: 1px solid rgba(15, 105, 110, 0.2);
  border-radius: 99px;
  padding: 8px 18px;
  font-size: 13px;
  font-weight: 600;
  color: #0f696e;
  margin-bottom: 28px;
}

@media (max-width: 576px) {
  .aur-card { padding: 32px 20px; }
  .aur-title { font-size: 20px; }
  .aur-steps { gap: 0; }
  .aur-step-line { min-width: 16px; }
}
</style>
