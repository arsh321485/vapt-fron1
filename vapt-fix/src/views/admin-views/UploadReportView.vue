<template>
  <main>
    <!-- TOP BAR -->
    <div class="topbar">
      <img src="@/assets/images/logo-capital.png" alt="" class="h-50">
    </div>

    <div class="app">
      <!-- STEPPER -->
      <Stepper v-if="!isEditMode" />

      <!-- CONTENT -->
      <div :class="['content', { 'no-stepper': isEditMode }]">
        <div class="page-header">
          <div>
            <h1>Upload Targets</h1>
            <p>Add IP addresses, URLs, or subnets to begin vulnerability Assessment</p>
          </div>

          <div class="header-controls">
            <div>
              <button @click="downloadExcelTemplate" class="btn fw-semibold px-3 py-2"
                style="border-radius: 20px;border: 1px solid rgba(0, 0, 0, 0.12);color: rgba(49, 33, 177, 1);"><i
                  class="bi bi-download me-2"></i>Sample File</button>
            </div>
            <div>
              <input class="project_name form-control"
  type="text"
  v-model="name"
  placeholder="Enter project name"
  required
/>
            </div>
            <!-- Testing Type (Unified UI) -->
            <div class="testing-type">
              <select v-model="selectedTestingType" class="form-select">
                <option disabled value="">Select</option>
                <option value="white_box">White Box</option>
                <option value="grey_box">Grey Box</option>
                <option value="black_box">Black Box</option>
              </select>
            </div>
          </div>
        </div>

        <!-- MAIN TWO-COLUMN ROW -->
        <div class="main-row">

          <!-- LEFT COLUMN -->
          <div class="left-column ">


            <div class="upload-box ip-box">
              <h5>Enter target IPs / URLs</h5>
              <p>
                Paste IPs or URLs manually, or upload a CSV / Excel file.
                <br />
                (Only IPs & URLs will be extracted)
              </p>

              <!-- TEXTAREA -->
              <textarea class="form-control ip-textarea" v-model="ipInput" placeholder="Example:
192.168.1.1
https://example.com">
</textarea>
              <div class="ip-actions">
                <input ref="fileInput" type="file" accept=".csv,.xlsx,.xls,.txt" hidden @change="handleFileUpload" />

                <button class="btn btn-primary" @click="handleUploadClick">
  Upload CSV / Excel / Text File
</button>


                <!-- NEW manual submit button -->
                <button class="btn btn-primary ms-0 me-0" :disabled="!ipInput.trim() || isUploading"
                  @click="submitManualTargets">
                  Submit / Save
                </button>

                <span class="ip-count">{{ extractedList.length }} targets</span>
              </div>

            </div>

          </div>

          <!-- RIGHT COLUMN -->
          <div class="info-cards">
            <div class="info-card">
              <strong>Manual Entry</strong>
              <p>Enter one IP address or URL per line. Only valid entries are accepted.</p>
            </div>

            <div class="info-card">
              <strong>Excel / CSV /Text File Upload </strong>
              <p>Upload an Excel , CSV , Text file containing IP addresses or URLs in any column. Only valid targets
                will be
                extracted.</p>
            </div>

            <div class="info-card">
              <strong>Text Paste</strong>
              <p>Paste IP addresses or URLs, one per line. Invalid entries will be ignored.</p>
            </div>
          </div>

        </div>

        <!-- TARGET CARDS -->

        <!-- Global upload status -->
        <div v-if="isUploadingTargets" class="global-upload-status">
          <span class="loader"></span>
          <span class="ms-2">Uploading targets...</span>
        </div>
        <div v-else-if="uploadSuccess" class="global-upload-status success">
          <i class="bi bi-check-circle-fill"></i>
          <span class="ms-2">Uploaded successfully</span>
        </div>

        <div class="files-card-grid">

          <!-- INTERNAL TARGETS -->
          <div class="files-card" v-if="internalTargets.length">
            <div class="card-header-title">
              Internal Targets
            </div>

            <!-- Table -->
            <table v-if="internalTargets.length" class="mt-3">
              <thead>
                <tr>
                  <th class="col-serial">S.No.</th>
                  <th class="col-value">IP Address</th>
                </tr>
              </thead>
              <tbody class="scroll-body" @dragover.prevent @drop="onDropTarget('internal')">
                <tr v-for="(item, index) in internalTargets" :key="item.ip || index" draggable="true"
                  @dragstart="onDragStart(item, 'internal')">
                  <td class="col-serial">{{ index + 1 }}</td>
                  <td class="col-value">
                    {{ item.ip }}
                    <span v-if="item.count" class="subnet-count">
                      ({{ item.count }})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- EXTERNAL TARGETS -->
          <div class="files-card" v-if="externalTargets.length">
            <div class="card-header-title">
              External Targets
            </div>

            <table v-if="externalTargets.length" class="mt-3">
              <thead>
                <tr>
                  <th class="col-serial">S.No.</th>
                  <th class="col-value">IP Address</th>
                </tr>
              </thead>
              <tbody class="scroll-body" @dragover.prevent @drop="onDropTarget('external')">
                <tr v-for="(item, index) in externalTargets" :key="item.ip || index" draggable="true"
                  @dragstart="onDragStart(item, 'external')">
                  <td class="col-serial">{{ index + 1 }}</td>
                  <td class="col-value">
                    {{ item.ip }}
                    <span v-if="item.count" class="subnet-count">
                      ({{ item.count }})
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- WEB APP TARGETS -->
          <div class="files-card" v-if="webAppTargets.length">
            <div class="card-header-title">
              Web App Targets
            </div>

            <table v-if="webAppTargets.length" class="mt-3">
              <thead>
                <tr>
                  <th class="col-serial">S.No.</th>
                  <th class="col-value">URL</th>
                </tr>
              </thead>
              <tbody class="scroll-body" @dragover.prevent @drop="onDropTarget('webapp')">
                <tr v-for="(item, index) in webAppTargets" :key="item.url || index" draggable="true"
                  @dragstart="onDragStart(item, 'webapp')">
                  <td class="col-serial">{{ index + 1 }}</td>
                  <td class="col-value">{{ item.url }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- MOBILE APP TARGETS -->
          <div class="files-card" v-if="mobileAppTargets.length">
            <div class="card-header-title">
              Mobile App Targets
            </div>

            <table v-if="mobileAppTargets.length" class="mt-3">
              <thead>
                <tr>
                  <th class="col-serial">S.No.</th>
                  <th class="col-value">URL</th>
                </tr>
              </thead>
              <tbody class="scroll-body" @dragover.prevent @drop="onDropTarget('mobileapp')">
                <tr v-for="(item, index) in mobileAppTargets" :key="item.url || index" draggable="true"
                  @dragstart="onDragStart(item, 'mobileapp')">
                  <td class="col-serial">{{ index + 1 }}</td>
                  <td class="col-value">{{ item.url }}</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

        <div class="cta">

          <button type="button" class="btn btn-primary" :disabled="!isEditMode && !hasTargets" @click="handleUploadAndRedirect">
            {{ returnTo ? 'Back to Previous Page →' : 'Continue to Dashboard →' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Stepper from '@/components/admin-component/Stepper.vue';
import { useAuthStore } from "@/stores/authStore";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default {
  name: "UploadReportView",
  components: { Stepper },

  data() {
    return {
      uploadedTestingTypes: new Set(),
      location: "",
      type: "",
      uploadedFiles: [],
      dragover: false,
      locations: [],
      authStore: null,
      adminId: "",
      isUploading: false,
      ipInput: "",
      extractedList: [],
      internalTargets: [],
      externalTargets: [],
      webAppTargets: [],
      mobileAppTargets: [],
      selectedFile: null,
      autoSubmitTimer: null,
      draggedItem: null,
      draggedFrom: null,
      // testingType: "",
      allowedTestingTypes: [],
      selectedTestingType: "",
      showTestingDropdown: false,
      isUploadingTargets: false,   // 🔄 uploading state
      uploadSuccess: false, 
      name: "",       // ✅ success state
    };
  },
  watch: {
    selectedTestingType(newType) {
      if (newType) {
        this.fetchTargetsByTestingType();
      }
    },
    uploadedFiles: {
      handler(files) {
        const hasSuccessfulUploads = files.some(f => f.status === 'success');
        if (hasSuccessfulUploads && this.authStore) {
          this.authStore.markStepCompleted(3);
        }
      },
      deep: true
    }
  },
  computed: {
    remainingTestingTypes() {
      if (!this.allowedTestingTypes.length) return [];

      return this.allowedTestingTypes.filter(
        type => type !== this.selectedTestingType
      );
    },
    isEditMode() {
      return !!this.$route.query.returnTo;
    },
    returnTo() {
      return this.$route.query.returnTo || null;
    },
    hasTargets() {
      return (
        this.internalTargets.length > 0 ||
        this.externalTargets.length > 0 ||
        this.webAppTargets.length > 0 ||
        this.mobileAppTargets.length > 0
      );
    },

  },
  async mounted() {
    this.authStore = useAuthStore();

    const user = JSON.parse(localStorage.getItem("user"));
    this.adminId = user?.id;

    const isNewProject = localStorage.getItem("isNewProject") === "true";

    if (isNewProject) {
      // 🔥 FULL RESET — no old data allowed
      this.resetUploadState();

      // fetch ONLY testing types (no targets)
      if (this.adminId) {
        await this.fetchTestingTypes();
      }

      // ❗ do NOT auto-fetch targets
      return;
    }

    // if (this.selectedTestingType) {
    //   this.fetchTargetsByTestingType();
    // }
  },
  methods: {
  showBackendError(err) {
  const message =
    err?.details?.detail ||
    err?.details?.message ||
    err?.message ||
    "Something went wrong";

  Swal.fire(message);
  },
  handleUploadClick() {
  // ❌ block upload if project name missing
  if (!this.validateProjectName()) return;

  // ✅ project name exists → allow file selection
  this.$refs.fileInput.click();
  },
  validateProjectName() {
    if (!this.name || !this.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Project name is required", // 👈 backend-style message
        confirmButtonColor: "#5a44ff",
      });
      return false;
    }
    return true;
  },
  hasTargetsForTestingType(type) {
      const allTargets = [
        ...this.internalTargets,
        ...this.externalTargets,
        ...this.webAppTargets,
        ...this.mobileAppTargets,
      ];

      return allTargets.some(t => t.testing_type === type);
  },
  resetUploadState() {
      this.ipInput = "";
      this.extractedList = [];

      this.internalTargets = [];
      this.externalTargets = [];
      this.webAppTargets = [];
      this.mobileAppTargets = [];

      this.selectedFile = null;
      this.isUploadingTargets = false;
      this.uploadSuccess = false;

      // ensure dropdown starts clean
      this.selectedTestingType = "";
  },
  redirectToDashboard() {
      // 🔐 Mark dashboard as locked
      localStorage.setItem("dashboardTestingInProgress", "true");
      localStorage.setItem("testingInProgress", "true");
      localStorage.setItem("testingStartTime", Date.now().toString());

      this.$router.push("/admindashboardonboarding");
  },
  submitManualTargets() {
     if (!this.validateProjectName()) return;
      this.selectedFile = null; // 🚫 ensure file logic not triggered
      this.submitTargets();     // ✅ reuse existing API logic
  },
  mapGetTargetsResponse(list) {
      // 🔄 Reset ONLY cards (not textarea)
      this.internalTargets = [];
      this.externalTargets = [];
      this.webAppTargets = [];
      this.mobileAppTargets = [];

      list.forEach(item => {
        const value = item.target_value;

        switch (item.target_type) {
          case "internal_ip":
            this.internalTargets.push({
              ip: value,
              count: item.subnet_count,
            });
            break;

          case "external_ip":
            this.externalTargets.push({
              ip: value,
              count: item.subnet_count,
            });
            break;

          case "web_url":
            this.webAppTargets.push({
              url: value,
            });
            break;

          case "mobile_url":
          case "mobile_app":
            this.mobileAppTargets.push({
              url: value,
            });
            break;
        }
      });
  },
  mapApiResponse(data) {
  // 🔄 Reset cards
  this.internalTargets = [];
  this.externalTargets = [];
  this.webAppTargets = [];
  this.mobileAppTargets = [];

  // ✅ backend sends: scope.entries
  const entries = data.scope?.entries || [];

  entries.forEach(item => {
    const value = item.value;

    switch (item.entry_type) {
      case "internal_ip":
        this.internalTargets.push({
          ip: value,
          count: item.subnet_mask ? item.subnet_mask : null,
        });
        break;

      case "external_ip":
        this.externalTargets.push({
          ip: value,
          count: item.subnet_mask ? item.subnet_mask : null,
        });
        break;

      case "web_url":
        this.webAppTargets.push({
          url: value,
        });
        break;

      case "mobile_url":
      case "mobile_app":
        this.mobileAppTargets.push({
          url: value,
        });
        break;
    }
  });
  },
  handleEnterSubmit() {
      const lines = this.ipInput.split("\n").filter(l => l.trim());
      const last = lines[lines.length - 1];

      if (
        this.isValidIP(last) ||
        this.isValidSubnet(last) ||
        this.isValidURL(last)
      ) {
        this.ipInput += "\n";
        this.submitTargets(); // 🔥 auto submit
      } else {
        Swal.fire("Invalid entry", `"${last}" is invalid`, "error");
      }
  },
  handleAutoSubmit() {
      if (!this.ipInput.trim()) return;
      this.triggerAutoSubmit();
  },
  triggerAutoSubmit() {
      clearTimeout(this.autoSubmitTimer);

      this.autoSubmitTimer = setTimeout(() => {
        this.submitTargets();
      }, 500); // 0.5 sec debounce
  },
  downloadExcelTemplate() {
      // Sample data in the exact format you want
      const sampleData = [
        {
          INTERNAL: '192.168.1.1',
          EXTERNAL: '33.87.0.22',
          WEB_APP_URL: 'www.trox.com',
          MOBILE_APP_URL: 'app2.apk'
        },
        {
          INTERNAL: '190.132.1.3/5',
          EXTERNAL: '',
          WEB_APP_URL: '',
          MOBILE_APP_URL: ''
        }
      ];

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(sampleData, {
        header: ['INTERNAL', 'EXTERNAL', 'WEB_APP_URL', 'MOBILE_APP_URL']
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Targets');

      // Column widths
      ws['!cols'] = [
        { wch: 20 }, // INTERNAL
        { wch: 20 }, // EXTERNAL
        { wch: 30 }, // WEB_APP_URL
        { wch: 30 }  // MOBILE_APP_URL
      ];

      // Download file
      XLSX.writeFile(wb, 'Sample_Report.xlsx');
  },
    formatTestingType(type) {
      return type
        .replace("_", " ")
        .replace(/\b\w/g, l => l.toUpperCase());
    },
    onDragStart(item, from) {
      this.draggedItem = item;
      this.draggedFrom = from;
    },
    onDropTarget(to) {
      if (!this.draggedItem) return;
      const from = this.draggedFrom;
      if (from === to) {
        if (to === 'external' && this.draggedItem.ip) {
          if (!this.externalTargets.some(t => t.ip === this.draggedItem.ip)) {
            this.externalTargets.push(this.draggedItem);
          }
        }
        this.draggedItem = null;
        this.draggedFrom = null;
        return;
      }
      if (from === 'internal') {
        this.internalTargets = this.internalTargets.filter(
          t => t.ip !== this.draggedItem.ip
        );
      } else if (from === 'external') {
        this.externalTargets = this.externalTargets.filter(
          t => t.ip !== this.draggedItem.ip
        );
      } else if (from === 'webapp') {
        this.webAppTargets = this.webAppTargets.filter(
          t => t.url !== this.draggedItem.url
        );
      } else if (from === 'mobileapp') {
        this.mobileAppTargets = this.mobileAppTargets.filter(
          t => t.url !== this.draggedItem.url
        );
      }
      const itemValue = this.draggedItem.ip || this.draggedItem.url;

      if (to === 'internal') {
        if (!this.internalTargets.some(t => t.ip === itemValue)) {
          this.internalTargets.push({ ip: itemValue, count: this.draggedItem.count });
        }
      }

      else if (to === 'external') {
        if (!this.externalTargets.some(t => t.ip === itemValue)) {
          this.externalTargets.push({ ip: itemValue, count: this.draggedItem.count });
        }
      }

      else if (to === 'webapp') {
        // Keep value as-is (IP stays IP, URL stays URL)
        if (!this.webAppTargets.some(t => t.url === itemValue)) {
          this.webAppTargets.push({ url: itemValue });
        }
      }

      else if (to === 'mobileapp') {
        // Keep value as-is (IP stays IP, URL stays URL)
        if (!this.mobileAppTargets.some(t => t.url === itemValue)) {
          this.mobileAppTargets.push({ url: itemValue });
        }
      }
      this.draggedItem = null;
      this.draggedFrom = null;
    },
    isPrivateIP(value) {
      return (
        value.startsWith("10.") ||
        value.startsWith("192.168.") ||
        /^172\.(1[6-9]|2\d|3[0-1])\./.test(value)
      );
    },
    isValidSubnet(value) {
      const cidrRegex =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\/([0-9]|[1-2][0-9]|3[0-2])$/;
      return cidrRegex.test(value);
    },
    getSubnetCount(cidr) {
      const mask = parseInt(cidr.split("/")[1], 10);
      return Math.pow(2, 32 - mask);
    },
    viewInternalTarget(index) {
      console.log("View internal target:", this.internalTargets[index]);
    },
    viewExternalTarget(index) {
      console.log("View external target:", this.externalTargets[index]);
    },
    viewWebTarget(index) {
      window.open(this.webAppTargets[index].url, "_blank");
    },
    viewMobileTarget(index) {
      window.open(this.mobileAppTargets[index].url, "_blank");
    },
    validateLastEntry() {
      const lines = this.ipInput.split("\n").filter(l => l.trim() !== "");
      if (!lines.length) return;
      const lastValue = lines[lines.length - 1].trim();
      if (
        this.isValidIP(lastValue) ||
        this.isValidSubnet(lastValue) ||
        this.isValidURL(lastValue)
      ) {
        this.ipInput += "\n";
        return;
      }

      // ❌ Invalid
      lines.pop();
      this.ipInput = lines.join("\n") + (lines.length ? "\n" : "");

      Swal.fire({
        icon: "error",
        title: "Invalid entry",
        text: `"${lastValue}" is not a valid IP, subnet, or URL.`,
        confirmButtonColor: "#5a44ff"
      });
    },
    sanitizeIpInput() {
      const values = this.ipInput.split(/\n|,/);
      const validTargets = this.extractValidTargets(values);

      if (!validTargets.length) {
        Swal.fire({
          icon: "warning",
          title: "No valid targets",
          text: "Please enter at least one valid IP or URL.",
        });
        return;
      }
      this.ipInput = validTargets.join("\n");
    },
    // 🔹 Extract IPs & URLs from textarea
    extractTargetsFromText() {
      const ipRegex =
        /\b((25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\.){3}(25[0-5]|2[0-4]\d|1\d\d|\d\d|\d)\b/g;

      const urlRegex =
        /\bhttps?:\/\/[^\s,]+|\bwww\.[^\s,]+/gi;

      const text = this.ipInput;

      const ips = text.match(ipRegex) || [];
      const urls = text.match(urlRegex) || [];

      this.extractedList = [...new Set([...ips, ...urls])];
    },
    // extractValidTargets(values) {
    //   const validTargets = [];

    //   values.forEach(v => {
    //     const value = String(v).trim();
    //     if (!value) return;

    //     if (
    //       this.isValidIP(value) ||
    //       this.isValidSubnet(value) ||
    //       this.isValidURL(value)
    //     ) {
    //       validTargets.push(value);
    //     }
    //   });

    //   return [...new Set(validTargets)];
    // },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.selectedFile = file;

      // 🔥 Auto-submit to API
      this.submitTargets();

      event.target.value = "";
    },
    async submitTargets() {
      if (!this.selectedTestingType) {
        Swal.fire(
          "Testing type required",
          "Please select a testing type before uploading targets",
          "warning"
        );
        return;
      }

      if (this.isUploadingTargets) return;

      try {
        this.isUploadingTargets = true;
        this.uploadSuccess = false;

        const formData = new FormData();
        formData.append("name", this.name);
        // 📁 FILE UPLOAD
        if (this.selectedFile) {
        
          formData.append("file", this.selectedFile);
          formData.append("expand_subnets", "false");
        }
        // ✍️ MANUAL INPUT
        else {
          if (!this.ipInput.trim()) return;
          formData.append("targets", this.ipInput);
        }

        const res = await this.authStore.createScope(
          formData,
          this.selectedTestingType
        );

        if (!res.status) {
          Swal.fire("Error", res.message, "error");
          return;
        }

        this.mapApiResponse(res.data);

        this.ipInput = "";
        this.extractedList = [];

        // Show success state (tick)
        this.uploadSuccess = true;
        this.uploadedTestingTypes.add(this.selectedTestingType);


        // 🔥 IMPORTANT: new project becomes active now
        localStorage.removeItem("isNewProject");

       
        if (res.data.skipped?.length) {
          Swal.fire({
            icon: "warning",
            title: "Already exists",
            text: `${res.data.skipped_count} target(s) skipped`,
            timer: 2500,
            showConfirmButton: false,
          });
        }

        /* =====================================================
           🎉 CREATED TARGETS
           ===================================================== */
        if (res.data.created_count > 0) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: `${res.data.created_count} target(s) created`,
            timer: 2500,
            showConfirmButton: false,
          });
        }

        // Reset file input
        this.selectedFile = null;

      } catch (err) {
        console.error("Upload error:", err);
        this.showBackendError(err);
        Swal.fire("Error", "Something went wrong", "error");
      } finally {
        this.isUploadingTargets = false;

        // ⏱️ Auto-hide success tick after 3s
        setTimeout(() => {
          this.uploadSuccess = false;
        }, 3000);
      }
    },

    onFileChange(e) {
      this.handleFiles([...e.target.files]);
      e.target.value = "";
    },
    onDrop(e) {
      this.dragover = false;
      this.handleFiles([...e.dataTransfer.files]);
    },
    isValidIP(value) {
      const ipRegex =
        /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
      return ipRegex.test(value);
    },
    isValidURL(value) {
      const urlRegex =
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;
      return urlRegex.test(value);
    },
    isMobileAppURL(value) {
      const lowerValue = value.toLowerCase();
      return (
        lowerValue.includes('play.google.com') ||
        lowerValue.includes('apps.apple.com') ||
        lowerValue.includes('itunes.apple.com') ||
        lowerValue.includes('appstore.com')
      );
    },
    // handleUploadAndRedirect() {
    //   // 🔐 Mark dashboard as locked
    //   localStorage.setItem("dashboardTestingInProgress", "true");
    //   localStorage.setItem("testingInProgress", "true");
    //   localStorage.setItem("testingStartTime", Date.now().toString());

    //   this.$router.push("/admindashboardonboarding");
    // },

    handleUploadAndRedirect() {
      // Coming from profile/header → go back
      if (this.returnTo) {
        this.$router.push(this.returnTo);
        return;
      }

      // No multiple testing types → go directly
      if (this.allowedTestingTypes.length <= 1) {
        this.redirectToDashboard();
        return;
      }

      // Find testing types WITHOUT targets
      const missingTypes = this.allowedTestingTypes.filter(
        type => !this.uploadedTestingTypes.has(type)
      );

      // ✅ All testing types filled → NO alert
      if (!missingTypes.length) {
        this.redirectToDashboard();
        return;
      }

      // ❗ Some testing types missing → show alert
      const nextTestingType = missingTypes[0];

      Swal.fire({
        title: "Upload remaining targets?",
        text: `You haven't uploaded targets for ${this.formatTestingType(
          nextTestingType
        )}. Do you want to upload now?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, upload now",
        cancelButtonText: "Skip & continue",
        confirmButtonColor: "#5a44ff",
        cancelButtonColor: "#6b7280",
      }).then(result => {
        if (result.isConfirmed) {
          this.selectedTestingType = nextTestingType;
          this.ipInput = "";
          this.selectedFile = null;
          this.fetchTargetsByTestingType();
        } else {
          this.redirectToDashboard();
        }
      });
    },


  },
};
</script>

<style scoped>
/* ..... */
.global-upload-status {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin-bottom: 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #5a44ff;
  background: rgba(90, 68, 255, 0.06);
  border: 1px solid rgba(90, 68, 255, 0.15);
  width: fit-content;
}

.global-upload-status.success {
  color: #22c55e;
  background: rgba(34, 197, 94, 0.06);
  border-color: rgba(34, 197, 94, 0.2);
}

.global-upload-status i {
  font-size: 18px;
}

/* ...... */
.testing-select:disabled {
  background-color: #f1f3f5;
  color: #333;
  cursor: default;
  opacity: 1;
  /* remove faded look */
}

.testing-type {
  min-width: 120px;
}

.testing-select {
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
}

/* ===== Card Header ===== */
.card-header-title {
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  color: #111827;
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e9f2;
}

/* ===== Table ===== */
.files-card table {
  width: 100%;
  border-collapse: collapse;
}

/* Column widths */
.col-serial {
  width: 80px;
  text-align: center;
  color: #6b7280;
}

.col-value {
  /* text-align: left; */
  padding-left: 8px;
}

/* Header row */
.files-card thead th {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  padding: 12px 0;
}

/* Body rows */
.files-card tbody tr {
  height: 44px;
}

/* Row hover */
.files-card tbody tr:hover {
  background: #f6f8ff;
}

/* Subnet count */
.subnet-count {
  margin-left: 6px;
  font-size: 12px;
  color: #6b7280;
}

/* Drag cursor polish */
tr[draggable="true"] {
  cursor: grab;
}

tr[draggable="true"]:active {
  cursor: grabbing;
  opacity: 0.6;
}

/* Drop zone feedback */
.files-card tbody.drag-over,
.files-card tbody:hover {
  background: #f5f6ff;
}

/* Scroll polish */
.scroll-body {
  scrollbar-gutter: stable;
}




tr[draggable="true"] {
  cursor: grab;
}

tr[draggable="true"]:active {
  cursor: grabbing;
  opacity: 0.6;
}

.files-card tbody.drag-over {
  background: #f5f6ff;
}



/* ip input boxes */
.files-card-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .files-card-grid {
    grid-template-columns: 1fr;
  }
}


/* Scrollable table body */
.scroll-body {
  display: block;
  max-height: 220px;
  /* 👈 shows ~4–5 rows */
  overflow-y: auto;
}

/* Keep table header aligned */
.files-card table thead,
.files-card table tbody tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

/* Smooth scrollbar (optional polish) */
.scroll-body::-webkit-scrollbar {
  width: 6px;
}

.scroll-body::-webkit-scrollbar-thumb {
  background-color: #c7c7ff;
  border-radius: 10px;
}

.scroll-body::-webkit-scrollbar-track {
  background: transparent;
}



.ip-box {
  border: 2px dashed #c7c7ff;
  border-radius: 20px;
  padding: 32px;
  background: #ffffff;
}

.ip-textarea {
  margin-top: 16px;
  height: 180px;
  overflow-y: auto;
  resize: none;
  border-radius: 14px;
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.6;
  border: 1.5px dashed #c7c7ff;
  background-color: #fafbff;
}

.ip-textarea:focus {
  border-color: #5a44ff;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(90, 68, 255, 0.15);
  outline: none;
}

.ip-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
}

.ip-count {
  font-size: 13px;
  color: #6b7280;
}


/* ===== MAIN ROW ===== */
.main-row {
  display: flex;
  gap: 24px;
  max-width: 1200px;
  align-items: flex-start;
}

/* ===== LEFT COLUMN ===== */
.left-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 28px;
  /* spacing between cards */
}

/* Upload box width = Pick location card */
/* .left-column .upload-box {
  max-width: 100%;
} */

/* ===== RIGHT COLUMN ===== */
.info-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 992px) {
  .main-row {
    flex-direction: column;
  }

  .info-cards {
    flex-direction: row;
  }
}

@media (max-width: 576px) {
  .info-cards {
    flex-direction: column;
  }
}

/* Right cards container */
.info-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-top: 20px;
}

/* Individual info card */
.info-card {
  /* background: #fff; */
  box-shadow: 0 4px 20px rgba(90, 68, 255, 0.18);
  border-left: 4px solid #5a44ff;
  background: linear-gradient(135deg, rgba(117, 100, 248, 0.12) 0%, rgba(117, 100, 248, 0.08) 100%);
  border-radius: 16px;
  padding: 18px 20px;
  /* border: 1px solid #e6e9f2; */
  /* box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08); */
}

.info-card {
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.info-card:hover {
  transform: translateY(-3px);
}

.info-card strong {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.info-card p {
  /* font-size: 15px; */
  color: #6b7280;
  margin: 6px 0 0;
  line-height: 1.5;
}


.cta {
  margin-top: 48px;
  text-align: right;
}

.btn-primary {
  background: #5a44ff;
  border: none;
  border-radius: 14px;
  padding: 16px 36px;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 50px;
}

.topbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: #F3F5FA;
  border-bottom: 1px solid #e6e9f2;
  display: flex;
  align-items: center;
  padding: 0 32px;
  z-index: 1000;
}

.app {
  display: flex;
}

.content {
  margin-left: 260px;
  /* space for stepper */
  margin-top: 64px;
  /* space for topbar */
  height: calc(100vh - 64px);
  padding: 48px 64px;
}

.content.no-stepper {
  margin-left: auto;
  margin-right: auto;
  max-width: 1400px;
  width: 100%;
}

h1 {
  font-size: 26px;
  font-weight: 700;
}

p {
  color: #6b7280;
  margin-bottom: 28px;
}

.card-box {
  background: #fff;
  border-radius: 18px;
  padding: 24px;
  border: 1px solid #e6e9f2;
  max-width: 900px;
  margin-bottom: 28px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
}

.project_name {
  border-radius: 12px;
  padding: 11px;
  max-width: 220px;
}

.form-select {
  border-radius: 12px;
  padding: 12px;
  max-width: 220px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 16px;
}

.header-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
  }

  .header-controls {
    width: 100%;
    justify-content: flex-start;
  }

  .project_name {
    max-width: 100%;
    width: 100%;
  }

  .testing-type {
    width: 100%;
  }

  .testing-type .form-select {
    max-width: 100%;
  }
}

.upload-box {
  border: 2px dashed #cfd5e3;
  border-radius: 18px;
  padding: 48px;
  text-align: center;
  max-width: 900px;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
}

.upload-box.dragover {
  border-color: #5a44ff;
  background: #f5f6ff;
}

.upload-btn {
  background: #5a44ff;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 10px 22px;
  font-weight: 600;
}

.files-card {
  background: #fff;
  border-radius: 18px;
  padding: 20px;
  border: 1px solid #e6e9f2;
  max-width: 900px;
  margin-top: 28px;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.10);
}

table {
  width: 100%;
  font-size: 14px;
}

th {
  color: #6b7280;
  font-weight: 600;
  border-bottom: 1px solid #e6e9f2;
  padding-bottom: 10px;
}

td {
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f7;

}

.action-btn {
  cursor: pointer;
  margin-right: 12px;
  font-size: 16px;
}

.view {
  color: #5a44ff;
}

.delete {
  color: #dc2626;
}

/* ===== Smooth global transitions ===== */
.card-box,
.upload-box,
.files-card {
  transition:
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

/* ===== Card hover effect ===== */
.card-box:hover,
.files-card:hover {
  /* box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08); */
  transform: translateY(-3px);
}

/* ===== Upload box hover ===== */
.upload-box:hover {
  box-shadow: 0 14px 32px rgba(90, 68, 255, 0.12);
  transform: translateY(-4px);
}

/* ===== Button hover (subtle) ===== */
.upload-btn,
.btn-primary {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.upload-btn:hover,
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(90, 68, 255, 0.25);
}

/* ===== Table row hover ===== */
.files-card tbody tr {
  transition: background 0.2s ease;
}

.files-card tbody tr:hover {
  background: #f6f8ff;
}

/* ===== Icon hover polish ===== */
.action-btn {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  opacity: 0.9;
}

/* ===== Status icon styles ===== */
.status-icon {
  font-size: 18px;
}

.text-success {
  color: #22c55e;
}

.text-danger {
  color: #ef4444;
}

/* ===== Loading spinner ===== */
.loader {
  width: 18px;
  height: 18px;
  border: 3px solid #e6e9f2;
  border-top: 3px solid #5a44ff;
  border-radius: 50%;
  display: inline-block;
  animation: loader-spin 0.8s linear infinite;
}

@keyframes loader-spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* ===== Disabled action button ===== */
.action-disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: not-allowed;
}

/* ===== Upload warning message ===== */
.upload-warning {
  color: #f59e0b;
  font-size: 14px;
  margin-top: 12px;
}

/* larger screen */
@media screen and (min-width: 1920px) {
  .app {
    display: block;
  }

  .cta {
    margin-top: 300px;
  }

  .main-row {
    display: flex;
    gap: 45px;
    max-width: 1520px;
    align-items: flex-start;
  }

  .info-cards {
    gap: 30px;
    margin-top: 40px;
  }
}

/* iPad Pro */
@media (max-width: 1200px) {
  .content {
    margin-left: 0px;
    margin-top: 200px;
    height: auto;
    padding: 38px 55px;
  }

  .cta {
    margin-top: 430px;
  }

}

/* iPad Air */
@media (max-width: 992px) {
  .main-row {
    flex-direction: row;
    gap: 10px;
  }

  .left-column {
    gap: 0;
  }

  .cta {
    margin-top: 245px;
  }

  .info-cards {
    gap: 7px;
    margin-top: 8px;
  }
}

/* iPad Mini */
@media (max-width: 768px) {
  .content {
    padding: 32px 32px;
  }

  .cta {
    margin-top: 140px;
    margin-bottom: 0;
  }

  .info-cards {
    gap: 7px;
    margin-top: 0px;
  }
}

/* Upload progress toast - top right */
.upload-toast {
  position: fixed;
  top: 80px;
  right: 24px;
  background: #22c55e;
  color: #fff;
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
  z-index: 1001;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

.upload-toast i {
  font-size: 18px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>