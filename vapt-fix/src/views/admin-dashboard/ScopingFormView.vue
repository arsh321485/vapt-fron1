<template>
  <main>
    <section>
      <div class="container-fluid px-0">
        <div class="row gx-0 no-gutters">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1 ps-0 menubar-col1">
            <DashboardMenu />
          </div>

          <div class="col-11 pt-4 pb-5 pe-5 ps-4">
            <!-- Page Title -->
            <div class="d-flex justify-content-between align-items-center mb-4 mt-3">
              <div>
                <p class="mt-5" style="color: rgba(0,0,0,0.45); font-size: 13px; font-weight: 500;">
                  Admin Dashboard &rsaquo; Scoping Form
                </p>
                <h5 class="mb-0 fw-semibold mt-1" style="font-size: 22px; color: #1a1a2e;">
                  VAPT Scoping Form
                </h5>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-secondary btn-sm px-3" style="border-radius: 8px; font-size: 13px;">
                  <i class="bi bi-download me-1"></i> Export PDF
                </button>
                <button class="btn btn-sm px-4" style="background:#4f46e5; color:#fff; border-radius:8px; font-size:13px;">
                  <i class="bi bi-send me-1"></i> Submit Form
                </button>
              </div>
            </div>

            <!-- Progress Steps -->
            <div class="d-flex align-items-center mb-4 gap-0" style="overflow-x:auto;">
              <div v-for="(step, i) in steps" :key="i" class="d-flex align-items-center">
                <div class="d-flex flex-column align-items-center" style="min-width:100px;">
                  <div class="rounded-circle d-flex align-items-center justify-content-center fw-semibold"
                    :style="{
                      width: '36px', height: '36px', fontSize: '13px',
                      background: activeStep === i ? '#4f46e5' : activeStep > i ? '#22c55e' : '#f1f0ff',
                      color: activeStep >= i ? '#fff' : '#4f46e5',
                      border: activeStep === i ? '2px solid #4f46e5' : activeStep > i ? '2px solid #22c55e' : '2px solid #c7d2fe',
                      cursor: 'pointer'
                    }"
                    @click="activeStep = i">
                    <i v-if="activeStep > i" class="bi bi-check-lg" style="font-size:15px;"></i>
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span class="mt-1 text-center" style="font-size:11px; color:rgba(0,0,0,0.55); font-weight:500; white-space:nowrap;">{{ step }}</span>
                </div>
                <div v-if="i < steps.length - 1"
                  style="height:2px; width:60px; margin-bottom:18px;"
                  :style="{ background: activeStep > i ? '#22c55e' : '#e0e0e0' }"></div>
              </div>
            </div>

            <!-- ── STEP 0: Project Information ── -->
            <div v-show="activeStep === 0">
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#ede9fe;"><i class="bi bi-folder2-open" style="color:#4f46e5;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Project Information</h6>
                  </div>
                  <p class="mb-0 mt-1" style="font-size:12px; color:rgba(0,0,0,0.45); margin-left:44px;">
                    Basic details about the engagement and client
                  </p>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Project Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control scoping-input" placeholder="e.g. Q1 2025 VAPT Assessment" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Project Reference Number</label>
                    <input type="text" class="form-control scoping-input" placeholder="e.g. VAPT-2025-001" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Client / Organization Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control scoping-input" placeholder="e.g. Acme Corp Ltd." />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Industry / Sector</label>
                    <select class="form-select scoping-input">
                      <option value="" disabled selected>Select industry</option>
                      <option>Banking & Finance</option>
                      <option>Healthcare</option>
                      <option>E-Commerce</option>
                      <option>Government</option>
                      <option>Telecom</option>
                      <option>Manufacturing</option>
                      <option>Education</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Assessment Start Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control scoping-input" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Assessment End Date <span class="text-danger">*</span></label>
                    <input type="date" class="form-control scoping-input" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Reporting Deadline</label>
                    <input type="date" class="form-control scoping-input" />
                  </div>
                  <div class="col-12">
                    <label class="form-label scoping-label">Project Description / Background</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="Briefly describe the project objective and background..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#fef3c7;"><i class="bi bi-person-lines-fill" style="color:#d97706;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Contact Information</h6>
                  </div>
                </div>

                <div class="row g-3">
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Primary Contact Name <span class="text-danger">*</span></label>
                    <input type="text" class="form-control scoping-input" placeholder="Full name" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Email Address <span class="text-danger">*</span></label>
                    <input type="email" class="form-control scoping-input" placeholder="email@company.com" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Phone Number</label>
                    <input type="tel" class="form-control scoping-input" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Technical Contact Name</label>
                    <input type="text" class="form-control scoping-input" placeholder="Full name" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Technical Contact Email</label>
                    <input type="email" class="form-control scoping-input" placeholder="tech@company.com" />
                  </div>
                  <div class="col-md-4">
                    <label class="form-label scoping-label">Emergency Contact Number <span class="text-danger">*</span></label>
                    <input type="tel" class="form-control scoping-input" placeholder="+91 XXXXX XXXXX" />
                  </div>
                </div>
              </div>
            </div>

            <!-- ── STEP 1: Assessment Type ── -->
            <div v-show="activeStep === 1">
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#fce7f3;"><i class="bi bi-shield-check" style="color:#db2777;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Assessment Type & Methodology</h6>
                  </div>
                  <p class="mb-0 mt-1" style="font-size:12px; color:rgba(0,0,0,0.45); margin-left:44px;">
                    Select the type and approach for this engagement
                  </p>
                </div>

                <!-- Knowledge Level -->
                <label class="form-label scoping-label mb-2">Knowledge Level <span class="text-danger">*</span></label>
                <div class="row g-3 mb-4">
                  <div v-for="level in knowledgeLevels" :key="level.value" class="col-md-4">
                    <div class="selection-card"
                      :class="{ 'selected': selectedKnowledge === level.value }"
                      @click="selectedKnowledge = level.value">
                      <div class="d-flex align-items-start gap-3">
                        <div class="selection-icon" :style="{ background: level.bg }">
                          <i :class="level.icon" :style="{ color: level.color }"></i>
                        </div>
                        <div>
                          <p class="mb-1 fw-semibold" style="font-size:13px;">{{ level.label }}</p>
                          <p class="mb-0" style="font-size:11px; color:rgba(0,0,0,0.5);">{{ level.desc }}</p>
                        </div>
                        <div class="ms-auto">
                          <div class="radio-dot" :class="{ 'active': selectedKnowledge === level.value }"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Assessment Categories -->
                <label class="form-label scoping-label mb-2">Assessment Categories <span class="text-danger">*</span> <span style="font-size:11px; color:rgba(0,0,0,0.4);">(select all that apply)</span></label>
                <div class="row g-2 mb-4">
                  <div v-for="cat in assessmentCategories" :key="cat.value" class="col-md-3 col-6">
                    <div class="checkbox-card"
                      :class="{ 'selected': selectedCategories.includes(cat.value) }"
                      @click="toggleCategory(cat.value)">
                      <div class="d-flex align-items-center gap-2">
                        <div class="check-box" :class="{ 'checked': selectedCategories.includes(cat.value) }">
                          <i v-if="selectedCategories.includes(cat.value)" class="bi bi-check2" style="font-size:11px; color:#fff;"></i>
                        </div>
                        <i :class="cat.icon" style="font-size:14px;" :style="{ color: selectedCategories.includes(cat.value) ? '#4f46e5' : 'rgba(0,0,0,0.4)' }"></i>
                        <span style="font-size:12px; font-weight:500;">{{ cat.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Internal / External -->
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Network Perspective <span class="text-danger">*</span></label>
                    <div class="d-flex gap-2 mt-1">
                      <button v-for="p in ['Internal', 'External', 'Both']" :key="p"
                        class="btn btn-sm flex-fill"
                        :style="selectedPerspective === p
                          ? 'background:#4f46e5; color:#fff; border:none; border-radius:8px; font-size:12px;'
                          : 'background:#f8f8f8; color:rgba(0,0,0,0.6); border:1px solid #e5e5e5; border-radius:8px; font-size:12px;'"
                        @click="selectedPerspective = p">
                        {{ p }}
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Testing Environment <span class="text-danger">*</span></label>
                    <div class="d-flex gap-2 mt-1">
                      <button v-for="env in ['Production', 'Staging', 'Development', 'All']" :key="env"
                        class="btn btn-sm flex-fill"
                        :style="selectedEnvironment === env
                          ? 'background:#4f46e5; color:#fff; border:none; border-radius:8px; font-size:11px;'
                          : 'background:#f8f8f8; color:rgba(0,0,0,0.6); border:1px solid #e5e5e5; border-radius:8px; font-size:11px;'"
                        @click="selectedEnvironment = env">
                        {{ env }}
                      </button>
                    </div>
                  </div>
                  <div class="col-12">
                    <label class="form-label scoping-label">Standards / Compliance Framework</label>
                    <div class="row g-2 mt-1">
                      <div v-for="std in standards" :key="std" class="col-auto">
                        <div class="badge-pill"
                          :class="{ 'active': selectedStandards.includes(std) }"
                          @click="toggleStandard(std)">
                          {{ std }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── STEP 2: Scope Definition ── -->
            <div v-show="activeStep === 2">
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#dcfce7;"><i class="bi bi-crosshair" style="color:#16a34a;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">In-Scope Assets</h6>
                  </div>
                  <p class="mb-0 mt-1" style="font-size:12px; color:rgba(0,0,0,0.45); margin-left:44px;">
                    Define all assets included in this assessment
                  </p>
                </div>

                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label scoping-label">IP Addresses / CIDR Ranges</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="e.g.&#10;192.168.1.0/24&#10;10.0.0.1 - 10.0.0.50&#10;203.0.113.45"></textarea>
                    <div class="form-text" style="font-size:11px;">Enter one IP address or range per line</div>
                  </div>
                  <div class="col-12">
                    <label class="form-label scoping-label">Domains / URLs / Subdomains</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="e.g.&#10;https://app.company.com&#10;api.company.com&#10;admin.company.com"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Web Applications</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="List web application names and URLs..."></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Mobile Applications</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="e.g.&#10;iOS App: com.company.app (v2.1)&#10;Android App: com.company.app (v2.1)"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">API Endpoints</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="e.g.&#10;REST API: https://api.company.com/v1&#10;GraphQL: https://api.company.com/graphql"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Cloud Services / Infrastructure</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="e.g.&#10;AWS S3 Buckets&#10;Azure VMs&#10;GCP Cloud Run services"></textarea>
                  </div>
                  <div class="col-12">
                    <label class="form-label scoping-label">Total Number of Assets</label>
                    <div class="row g-2">
                      <div v-for="asset in assetCounts" :key="asset.label" class="col-md-3 col-6">
                        <div class="asset-count-box">
                          <label class="form-label" style="font-size:11px; color:rgba(0,0,0,0.5);">{{ asset.label }}</label>
                          <input type="number" class="form-control scoping-input py-1" min="0" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Out of Scope -->
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#fee2e2;"><i class="bi bi-slash-circle" style="color:#dc2626;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Out-of-Scope Assets</h6>
                  </div>
                </div>
                <div class="row g-3">
                  <div class="col-12">
                    <label class="form-label scoping-label">Explicitly Excluded Systems / IPs / URLs</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="List all systems, IPs, and services that must NOT be tested..."></textarea>
                  </div>
                  <div class="col-12">
                    <label class="form-label scoping-label">Reason for Exclusion</label>
                    <textarea class="form-control scoping-input" rows="2"
                      placeholder="e.g. Third-party hosted systems, critical production DBs with no downtime tolerance..."></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── STEP 3: Rules of Engagement ── -->
            <div v-show="activeStep === 3">
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#e0f2fe;"><i class="bi bi-file-earmark-ruled" style="color:#0284c7;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Rules of Engagement</h6>
                  </div>
                  <p class="mb-0 mt-1" style="font-size:12px; color:rgba(0,0,0,0.45); margin-left:44px;">
                    Define the boundaries and permissions for the assessment
                  </p>
                </div>

                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Permitted Testing Hours <span class="text-danger">*</span></label>
                    <div class="row g-2">
                      <div class="col-6">
                        <input type="time" class="form-control scoping-input" placeholder="Start time" />
                        <div class="form-text" style="font-size:11px;">Start time</div>
                      </div>
                      <div class="col-6">
                        <input type="time" class="form-control scoping-input" placeholder="End time" />
                        <div class="form-text" style="font-size:11px;">End time</div>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Permitted Testing Days <span class="text-danger">*</span></label>
                    <div class="d-flex flex-wrap gap-2 mt-1">
                      <div v-for="day in days" :key="day"
                        class="day-badge"
                        :class="{ 'active': selectedDays.includes(day) }"
                        @click="toggleDay(day)">
                        {{ day }}
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="form-label scoping-label mb-2">Permitted Activities <span class="text-danger">*</span></label>
                    <div class="row g-2">
                      <div v-for="activity in activities" :key="activity.value" class="col-md-4 col-6">
                        <div class="checkbox-card"
                          :class="{ 'selected': selectedActivities.includes(activity.value) }"
                          @click="toggleActivity(activity.value)">
                          <div class="d-flex align-items-center gap-2">
                            <div class="check-box" :class="{ 'checked': selectedActivities.includes(activity.value) }">
                              <i v-if="selectedActivities.includes(activity.value)" class="bi bi-check2" style="font-size:11px; color:#fff;"></i>
                            </div>
                            <span style="font-size:12px; font-weight:500;">{{ activity.label }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="form-label scoping-label mb-2">Prohibited Activities</label>
                    <div class="row g-2">
                      <div v-for="prohibited in prohibitedList" :key="prohibited" class="col-md-4 col-6">
                        <div class="d-flex align-items-center gap-2 p-2 rounded" style="background:#fff5f5; border:1px solid #fee2e2;">
                          <i class="bi bi-x-circle-fill" style="color:#dc2626; font-size:12px;"></i>
                          <span style="font-size:12px; color:rgba(0,0,0,0.65);">{{ prohibited }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12">
                    <label class="form-label scoping-label">Special Instructions / Restrictions</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="Any additional constraints, limitations, or special instructions for the testing team..."></textarea>
                  </div>

                  <div class="col-md-6">
                    <label class="form-label scoping-label">Escalation Procedure</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="Describe the escalation path when critical vulnerabilities are found..."></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Communication Channel <span class="text-danger">*</span></label>
                    <select class="form-select scoping-input">
                      <option value="" disabled selected>Select channel</option>
                      <option>Email</option>
                      <option>Slack</option>
                      <option>Microsoft Teams</option>
                      <option>Jira</option>
                      <option>Phone / Call</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── STEP 4: Risk & Authorization ── -->
            <div v-show="activeStep === 4">
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#fef9c3;"><i class="bi bi-exclamation-triangle" style="color:#ca8a04;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Risk Appetite & Constraints</h6>
                  </div>
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Risk Tolerance Level <span class="text-danger">*</span></label>
                    <div class="d-flex gap-2 mt-1">
                      <button v-for="r in ['Low', 'Medium', 'High']" :key="r"
                        class="btn btn-sm flex-fill"
                        :style="selectedRisk === r
                          ? `background:${r === 'Low' ? '#22c55e' : r === 'Medium' ? '#f59e0b' : '#ef4444'}; color:#fff; border:none; border-radius:8px; font-size:12px;`
                          : 'background:#f8f8f8; color:rgba(0,0,0,0.6); border:1px solid #e5e5e5; border-radius:8px; font-size:12px;'"
                        @click="selectedRisk = r">
                        {{ r }}
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Business Impact Tolerance <span class="text-danger">*</span></label>
                    <div class="d-flex gap-2 mt-1">
                      <button v-for="b in ['Minimal', 'Moderate', 'Significant']" :key="b"
                        class="btn btn-sm flex-fill"
                        :style="selectedImpact === b
                          ? 'background:#4f46e5; color:#fff; border:none; border-radius:8px; font-size:11px;'
                          : 'background:#f8f8f8; color:rgba(0,0,0,0.6); border:1px solid #e5e5e5; border-radius:8px; font-size:11px;'"
                        @click="selectedImpact = b">
                        {{ b }}
                      </button>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Acceptable Downtime During Testing</label>
                    <select class="form-select scoping-input">
                      <option value="" disabled selected>Select tolerance</option>
                      <option>None (zero downtime)</option>
                      <option>Less than 5 minutes</option>
                      <option>Less than 30 minutes</option>
                      <option>Less than 2 hours</option>
                      <option>Scheduled maintenance window only</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label scoping-label">Data Sensitivity Level <span class="text-danger">*</span></label>
                    <select class="form-select scoping-input">
                      <option value="" disabled selected>Select sensitivity</option>
                      <option>Public</option>
                      <option>Internal</option>
                      <option>Confidential</option>
                      <option>Highly Confidential / PII</option>
                      <option>Classified</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label scoping-label">Known Vulnerabilities / Previous Assessment Notes</label>
                    <textarea class="form-control scoping-input" rows="3"
                      placeholder="Any known issues, previous pen test findings, or areas of concern..."></textarea>
                  </div>
                </div>
              </div>

              <!-- Authorization -->
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#ede9fe;"><i class="bi bi-patch-check" style="color:#4f46e5;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Authorization & Sign-Off</h6>
                  </div>
                </div>

                <div class="authorization-box p-4 mb-3">
                  <p style="font-size:13px; line-height:1.7; color:rgba(0,0,0,0.7);">
                    I, the undersigned, hereby authorize the penetration testing / vulnerability assessment to be conducted on the systems listed in this scoping form. I confirm that I have the legal authority to authorize this assessment and that all information provided is accurate to the best of my knowledge.
                  </p>
                  <div class="row g-3 mt-1">
                    <div class="col-md-4">
                      <label class="form-label scoping-label">Authorized By (Full Name) <span class="text-danger">*</span></label>
                      <input type="text" class="form-control scoping-input" placeholder="Full legal name" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label scoping-label">Job Title / Designation <span class="text-danger">*</span></label>
                      <input type="text" class="form-control scoping-input" placeholder="e.g. CTO, IT Manager" />
                    </div>
                    <div class="col-md-4">
                      <label class="form-label scoping-label">Date of Authorization <span class="text-danger">*</span></label>
                      <input type="date" class="form-control scoping-input" />
                    </div>
                    <div class="col-12">
                      <label class="form-label scoping-label">Digital Signature / Initials <span class="text-danger">*</span></label>
                      <div class="signature-box d-flex align-items-center justify-content-center">
                        <div class="text-center">
                          <i class="bi bi-pen" style="font-size:24px; color:rgba(0,0,0,0.2);"></i>
                          <p class="mb-0 mt-2" style="font-size:12px; color:rgba(0,0,0,0.35);">Click to sign or type your initials</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- NDA / Confidentiality -->
                <div class="d-flex gap-3 align-items-start p-3 rounded" style="background:#f8f9ff; border:1px solid #e0e0f0;">
                  <input type="checkbox" class="form-check-input mt-1" style="min-width:16px;" />
                  <div>
                    <p class="mb-0 fw-semibold" style="font-size:13px;">NDA & Confidentiality Agreement</p>
                    <p class="mb-0" style="font-size:12px; color:rgba(0,0,0,0.5);">
                      I acknowledge that all findings, reports, and information exchanged during this engagement are strictly confidential and governed by the Non-Disclosure Agreement signed between both parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── STEP 5: Review ── -->
            <div v-show="activeStep === 5">
              <div class="scoping-card p-4 mb-4">
                <div class="section-header mb-4">
                  <div class="d-flex align-items-center gap-2">
                    <div class="icon-badge" style="background:#dcfce7;"><i class="bi bi-clipboard2-check" style="color:#16a34a;"></i></div>
                    <h6 class="mb-0 fw-semibold" style="font-size:15px;">Review & Summary</h6>
                  </div>
                  <p class="mb-0 mt-1" style="font-size:12px; color:rgba(0,0,0,0.45); margin-left:44px;">
                    Review the scoping form before final submission
                  </p>
                </div>

                <div class="row g-3">
                  <div class="col-md-6" v-for="section in reviewSections" :key="section.title">
                    <div class="review-section-card p-3">
                      <div class="d-flex align-items-center gap-2 mb-3">
                        <i :class="section.icon" :style="{ color: section.color, fontSize: '14px' }"></i>
                        <span class="fw-semibold" style="font-size:13px;">{{ section.title }}</span>
                        <span class="ms-auto badge" :style="{ background: section.color + '20', color: section.color, fontSize: '10px' }">
                          {{ section.status }}
                        </span>
                      </div>
                      <div v-for="item in section.items" :key="item.key" class="d-flex justify-content-between mb-1">
                        <span style="font-size:12px; color:rgba(0,0,0,0.45);">{{ item.key }}</span>
                        <span style="font-size:12px; font-weight:500; color:rgba(0,0,0,0.75);">{{ item.value }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Completeness indicator -->
                <div class="mt-4 p-3 rounded" style="background:#f0fdf4; border:1px solid #bbf7d0;">
                  <div class="d-flex align-items-center justify-content-between mb-2">
                    <span class="fw-semibold" style="font-size:13px; color:#16a34a;">Form Completeness</span>
                    <span style="font-size:13px; font-weight:600; color:#16a34a;">82%</span>
                  </div>
                  <div class="progress" style="height:8px; border-radius:10px;">
                    <div class="progress-bar" style="width:82%; background:#22c55e; border-radius:10px;"></div>
                  </div>
                  <p class="mb-0 mt-2" style="font-size:11px; color:rgba(0,0,0,0.5);">
                    <i class="bi bi-info-circle me-1"></i>
                    3 optional fields remaining. You may submit or complete them for a comprehensive assessment.
                  </p>
                </div>
              </div>
            </div>

            <!-- Navigation Buttons -->
            <div class="d-flex justify-content-between mt-2">
              <button v-if="activeStep > 0" class="btn btn-outline-secondary px-4"
                style="border-radius:8px; font-size:13px;" @click="activeStep--">
                <i class="bi bi-arrow-left me-1"></i> Previous
              </button>
              <div v-else></div>
              <button v-if="activeStep < steps.length - 1"
                class="btn px-4" style="background:#4f46e5; color:#fff; border-radius:8px; font-size:13px; border:none;"
                @click="activeStep++">
                Next <i class="bi bi-arrow-right ms-1"></i>
              </button>
              <button v-else
                class="btn px-4" style="background:#16a34a; color:#fff; border-radius:8px; font-size:13px; border:none;">
                <i class="bi bi-check2-circle me-1"></i> Submit Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue'
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue'

const activeStep = ref(0)

const steps = [
  'Project Info',
  'Assessment Type',
  'Scope Definition',
  'Rules of Engagement',
  'Risk & Authorization',
  'Review & Submit'
]

// Step 1
const selectedKnowledge = ref('grey')
const knowledgeLevels = [
  {
    value: 'black',
    label: 'Black Box',
    desc: 'No prior knowledge of the target system',
    icon: 'bi bi-square-fill',
    color: '#1e293b',
    bg: '#f1f5f9'
  },
  {
    value: 'grey',
    label: 'Grey Box',
    desc: 'Partial knowledge — limited credentials or docs',
    icon: 'bi bi-circle-half',
    color: '#6366f1',
    bg: '#ede9fe'
  },
  {
    value: 'white',
    label: 'White Box',
    desc: 'Full knowledge — source code, architecture docs',
    icon: 'bi bi-square',
    color: '#16a34a',
    bg: '#dcfce7'
  }
]

const selectedCategories = ref<string[]>(['web-app'])
const assessmentCategories = [
  { value: 'network', label: 'Network Pentest', icon: 'bi bi-hdd-network' },
  { value: 'web-app', label: 'Web Application', icon: 'bi bi-globe' },
  { value: 'mobile', label: 'Mobile App', icon: 'bi bi-phone' },
  { value: 'api', label: 'API Security', icon: 'bi bi-braces' },
  { value: 'cloud', label: 'Cloud Security', icon: 'bi bi-cloud' },
  { value: 'social', label: 'Social Engineering', icon: 'bi bi-people' },
  { value: 'wireless', label: 'Wireless', icon: 'bi bi-wifi' },
  { value: 'iot', label: 'IoT / OT', icon: 'bi bi-cpu' }
]

const selectedPerspective = ref('External')
const selectedEnvironment = ref('Staging')

const standards = ['OWASP', 'NIST', 'ISO 27001', 'PCI-DSS', 'HIPAA', 'SOC 2', 'CIS', 'GDPR']
const selectedStandards = ref<string[]>(['OWASP'])

// Step 3
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const selectedDays = ref(['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])

const activities = [
  { value: 'port-scan', label: 'Port Scanning' },
  { value: 'vuln-scan', label: 'Vulnerability Scanning' },
  { value: 'exploit', label: 'Exploitation' },
  { value: 'privesc', label: 'Privilege Escalation' },
  { value: 'phishing', label: 'Phishing Simulation' },
  { value: 'dos-test', label: 'DoS Testing (limited)' },
  { value: 'fuzzing', label: 'Fuzzing' },
  { value: 'recon', label: 'OSINT / Reconnaissance' },
  { value: 'lateral', label: 'Lateral Movement' }
]
const selectedActivities = ref(['port-scan', 'vuln-scan', 'exploit', 'recon'])

const prohibitedList = [
  'Full-scale DoS / DDoS attacks',
  'Data exfiltration beyond PoC',
  'Destructive payload execution',
  'Testing out-of-scope systems',
  'Social engineering of executives',
  'Physical security bypass'
]

// Step 4
const selectedRisk = ref('Medium')
const selectedImpact = ref('Moderate')

// Asset counts
const assetCounts = [
  { label: 'Servers / VMs' },
  { label: 'Web Applications' },
  { label: 'Mobile Apps' },
  { label: 'Network Devices' },
  { label: 'Databases' },
  { label: 'API Endpoints' },
  { label: 'Cloud Instances' },
  { label: 'Other' }
]

// Review
const reviewSections = [
  {
    title: 'Project Info',
    icon: 'bi bi-folder2-open',
    color: '#4f46e5',
    status: 'Complete',
    items: [
      { key: 'Project Name', value: 'Q1 2025 VAPT' },
      { key: 'Client', value: 'Acme Corp Ltd.' },
      { key: 'Start Date', value: '2025-03-01' },
      { key: 'End Date', value: '2025-03-14' }
    ]
  },
  {
    title: 'Assessment Type',
    icon: 'bi bi-shield-check',
    color: '#db2777',
    status: 'Complete',
    items: [
      { key: 'Knowledge Level', value: 'Grey Box' },
      { key: 'Categories', value: 'Web App, API' },
      { key: 'Perspective', value: 'External' },
      { key: 'Environment', value: 'Staging' }
    ]
  },
  {
    title: 'Scope',
    icon: 'bi bi-crosshair',
    color: '#16a34a',
    status: 'Complete',
    items: [
      { key: 'IP Ranges', value: '192.168.1.0/24' },
      { key: 'Domains', value: 'app.company.com' },
      { key: 'Total Assets', value: '12' },
      { key: 'Excluded', value: '3 systems' }
    ]
  },
  {
    title: 'Rules of Engagement',
    icon: 'bi bi-file-earmark-ruled',
    color: '#0284c7',
    status: 'Partial',
    items: [
      { key: 'Testing Hours', value: '09:00 – 18:00' },
      { key: 'Testing Days', value: 'Mon – Fri' },
      { key: 'Communication', value: 'Slack' },
      { key: 'Escalation', value: 'Defined' }
    ]
  },
  {
    title: 'Risk & Authorization',
    icon: 'bi bi-patch-check',
    color: '#ca8a04',
    status: 'Pending',
    items: [
      { key: 'Risk Tolerance', value: 'Medium' },
      { key: 'Data Sensitivity', value: 'Confidential' },
      { key: 'Authorization', value: 'Pending sign-off' },
      { key: 'NDA', value: 'Not signed yet' }
    ]
  },
  {
    title: 'Compliance',
    icon: 'bi bi-award',
    color: '#7c3aed',
    status: 'Complete',
    items: [
      { key: 'Standards', value: 'OWASP, PCI-DSS' },
      { key: 'Framework', value: 'NIST' },
      { key: 'Reporting', value: '2025-03-21' },
      { key: 'Format', value: 'PDF + Excel' }
    ]
  }
]

function toggleCategory(val: string) {
  const i = selectedCategories.value.indexOf(val)
  if (i === -1) selectedCategories.value.push(val)
  else selectedCategories.value.splice(i, 1)
}

function toggleStandard(val: string) {
  const i = selectedStandards.value.indexOf(val)
  if (i === -1) selectedStandards.value.push(val)
  else selectedStandards.value.splice(i, 1)
}

function toggleDay(val: string) {
  const i = selectedDays.value.indexOf(val)
  if (i === -1) selectedDays.value.push(val)
  else selectedDays.value.splice(i, 1)
}

function toggleActivity(val: string) {
  const i = selectedActivities.value.indexOf(val)
  if (i === -1) selectedActivities.value.push(val)
  else selectedActivities.value.splice(i, 1)
}
</script>

<style scoped>
.scoping-card {
  background: #fff;
  border: 1px solid #ebebf0;
  border-radius: 14px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.scoping-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  margin-bottom: 6px;
  letter-spacing: 0.01em;
}

.scoping-input {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
  padding: 8px 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.scoping-input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  outline: none;
}

.icon-badge {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}

.selection-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}
.selection-card:hover { border-color: #a5b4fc; background: #fafbff; }
.selection-card.selected { border-color: #4f46e5; background: #fafbff; box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15); }

.selection-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  flex-shrink: 0;
}

.radio-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  transition: all 0.2s;
  flex-shrink: 0;
}
.radio-dot.active {
  border-color: #4f46e5;
  background: #4f46e5;
  box-shadow: inset 0 0 0 3px #fff;
}

.checkbox-card {
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}
.checkbox-card:hover { border-color: #a5b4fc; }
.checkbox-card.selected { border-color: #4f46e5; background: #fafbff; }

.check-box {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}
.check-box.checked { background: #4f46e5; border-color: #4f46e5; }

.badge-pill {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid #e5e7eb;
  color: rgba(0, 0, 0, 0.55);
  background: #fff;
  transition: all 0.2s;
}
.badge-pill:hover { border-color: #a5b4fc; color: #4f46e5; }
.badge-pill.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }

.day-badge {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  border: 1.5px solid #e5e7eb;
  color: rgba(0, 0, 0, 0.6);
  background: #fff;
  transition: all 0.2s;
}
.day-badge:hover { border-color: #a5b4fc; }
.day-badge.active { background: #4f46e5; color: #fff; border-color: #4f46e5; }

.asset-count-box {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px 10px;
}

.authorization-box {
  background: #fafbff;
  border: 1.5px solid #e0e0f5;
  border-radius: 10px;
}

.signature-box {
  border: 2px dashed #d1d5db;
  border-radius: 10px;
  height: 90px;
  cursor: pointer;
  transition: border-color 0.2s;
}
.signature-box:hover { border-color: #4f46e5; }

.review-section-card {
  background: #fafafa;
  border: 1px solid #ebebf0;
  border-radius: 10px;
  height: 100%;
}
</style>
