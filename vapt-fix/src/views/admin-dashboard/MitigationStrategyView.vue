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

          <div class="col-11 pt-5 pb-3 pe-5">
            <div class="row">
                <div class="col-12">
                <div class="d-flex justify-content-between my-4">
                <h2>Mitigation Strategy</h2>
                <div class="d-flex justify-content-between gap-3">
                  <button class="btn fw-semibold px-3 py-2" style="border-radius: 20px;border: 1px solid rgba(0, 0, 0, 0.12);color: rgba(49, 33, 177, 1);" @click="$router.push('/viewreport')"><i class="bi bi-eye me-2"></i> View Report</button>
                  <!-- Overlay Popup -->
                  <div
                    v-if="showPopup"
                    class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style="background-color: rgba(0, 0, 0, 0.6); z-index: 1050;"
                  >
                    <div
                      class="bg-white p-4 rounded shadow"
                      style="width: 600px; max-height: 90vh; overflow-y: auto; position: relative;"
                    >
                      <!-- Close Button -->
                      <button
                        @click="showPopup = false"
                        class="btn-close position-absolute top-0 end-0 m-3"
                        aria-label="Close"
                      ></button>

                      <!-- Heading -->
                      <h2 class="mb-2 text-center">Report</h2>
                      <p class="mb-2 text-center" style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Create a report</p>
                      <div class="d-flex justify-content-between">
                        <div class="dropdown">
                        <div class="dropdown-btn"> Select location</div>
                        <div class="dropdown-content">
                            <a href="#">Greece</a>
                            <a href="#">Germany</a>
                            <a href="#">Bahrain</a>
                        </div>
                        </div>
                      <button type="button" class="btn patch-btn rounded-pill text-nowrap ms-3 mb-3" style="padding: 15px 18px;">
                        June 1 - June 30 <i class="bi bi-calendar-minus"></i>
                      </button>
                      </div>

                      <!-- Accordion -->
                      <div class="accordion" id="globalReportAccordion">
                        <div class="accordion-item">
                          <h2 class="accordion-header" id="headingOne">
                            <button
                              class="accordion-button"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseOne"
                              aria-expanded="true"
                              aria-controls="collapseOne"
                            >
                              Software vulnerabilities(11) <span class="text-primary ms-2">4 selected</span>
                            </button>
                          </h2>
                          <div
                            id="collapseOne"
                            class="accordion-collapse collapse show"
                            aria-labelledby="headingOne"
                            data-bs-parent="#globalReportAccordion"
                          >
                            <div class="accordion-body">
                              Software vulnerabilities
                            </div>
                          </div>
                        </div>

                        <div class="accordion-item">
                          <h2 class="accordion-header" id="headingTwo">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseTwo"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              Network vulnerabilities(6)
                            </button>
                          </h2>
                          <div
                            id="collapseTwo"
                            class="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#globalReportAccordion"
                          >
                            <div class="accordion-body">
                              Network vulnerabilities
                            </div>
                          </div>
                        </div>

                        <div class="accordion-item">
                          <h2 class="accordion-header" id="headingThree">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseThree"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                            >
                              Configuration vulnerabilities(11)
                            </button>
                          </h2>
                          <div
                            id="collapseThree"
                            class="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#globalReportAccordion"
                          >
                            <div class="accordion-body">
                              Configuration vulnerabilities
                            </div>
                          </div>
                        </div>

                        <div class="accordion-item">
                          <h2 class="accordion-header" id="headingFour">
                            <button
                              class="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target="#collapseFour"
                              aria-expanded="false"
                              aria-controls="collapseFour"
                            >
                              Human vulnerabilities(4)
                            </button>
                          </h2>
                          <div
                            id="collapseFour"
                            class="accordion-collapse collapse"
                            aria-labelledby="headingFour"
                            data-bs-parent="#globalReportAccordion"
                          >
                            <div class="accordion-body">
                              Human vulnerabilities
                            </div>
                          </div>
                        </div>
                      </div>

                      <button class="btn download-btn btn-sm ms-3 mt-4"><i class="bi bi-download me-2"></i> Download report</button>

                    </div>
                  </div>
                  
                </div>

                </div>
                </div>
                
            </div>

            <div class="row">
                <div class="col-10">
                <div class="d-flex justify-content-between tab-wrapper position-relative">
                    <p
                      v-for="(tab, idx) in tabs"
                      :key="tab.key"
                      class="nav-item"
                      :style="{ width: '25%', color: activeTab === tab.key ? 'rgba(49, 33, 177, 1)' : '' }"
                      @click="setActiveTab(tab.key, idx)"
                    >
                      <i :class="tab.icon"></i> {{ tab.label }}
                    </p>

                    <!-- Blue underline for active tab -->
                    <div class="tab-line" :style="{ width: '25%', left: (activeTabIndex * 25) + '%' }"></div>
                </div>
                <div class="col-2">
                    <!-- blank -->
                </div>
                </div>
            </div>

            <div class="row my-4">
              <div>
                <span style="color: rgba(0, 0, 0, 0.87);">Assigned to {{ activeTab }} team </span>
              </div>
              <div class="d-flex gap-4 my-3">
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100" style="color: maroon;">Critical</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.critical ?? '—' }}  <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click="openRiskModal('critical')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-danger">High</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.high ?? '—' }}  <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click="openRiskModal('high')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-warning">Medium</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.medium ?? '—' }} <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click="openRiskModal('medium')"></i></button>
                      </div>
                      <div class="d-flex flex-column gap-2">
                          <button class="btn rounded-pill btn-outline-secondary d-flex align-items-center justify-content-center w-100 text-success">Low</button>
                          <button type="button" class="btn patch-btn rounded-pill text-nowrap">{{ riskCriteria.low ?? '—' }}  <i class="bi bi-plus-circle text-danger" style="cursor:pointer;" @click="openRiskModal('low')"></i></button>
                      </div>
              </div>

              <!-- Update Risk Criteria Modal -->
              <div v-if="showRiskModal" class="risk-modal-backdrop">
                <div class="risk-modal-box" @click.stop>
                  <h5 class="mb-3">Update Days — {{ riskModalSeverityLabel }}</h5>
                  <div class="mb-3">
                    <label class="form-label">Days</label>
                    <select class="form-select" style="border-radius: 10px;" v-model="riskModalDays">
                      <option value="" disabled>Select timeline</option>
                      <option v-for="opt in timeOptions" :key="opt" :value="opt">{{ opt }}</option>
                    </select>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Reason</label>
                    <textarea class="form-control" style="border-radius: 10px;" rows="2" v-model="riskModalReason"></textarea>
                  </div>
                  <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-secondary" @click="closeRiskModal">Cancel</button>
                    <button class="btn btn-primary" :disabled="riskUpdating" @click="submitRiskCriteria">
                      {{ riskUpdating ? 'Saving...' : 'Submit' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <section id="details">
            <div class="row">
                <div class="col-11">
                    <div class="d-flex justify-content-between">
                      <p style="color: rgba(0, 0, 0, 0.6);font-weight: 600;font-size: 15px;">
                        Vulnerabilities ({{ uniqueVulns.length }})
                      </p>
                    </div>

                    <!-- Loading state -->
                    <div v-if="loading" class="py-4 text-center text-muted">Loading...</div>

                    <!-- No data state -->
                    <div v-else-if="uniqueVulns.length === 0" class="py-4 text-muted">
                      No vulnerabilities assigned to this team.
                    </div>

                    <!-- Vulnerability cards (first card UI, up to 4) -->
                    <div v-else class="row align-items-stretch">
                        <div
                          v-for="vuln in uniqueVulns.slice(0, 4)"
                          :key="vuln.plugin_name"
                          class="col-3 d-flex"
                        >
                          <div class="card py-4 px-3 w-100 d-flex flex-column" style="border-radius: 12px;">
                            <div class="d-flex justify-content-between">
                              <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">
                                {{ vuln.assets.length > 1 ? vuln.assets.length + ' assets' : vuln.assets[0] }}
                              </p>
                              <span
                                :style="{ color: riskColor(vuln.risk_factor), fontSize: '12px', fontWeight: '600' }"
                              >{{ vuln.risk_factor }}</span>
                            </div>
                            <h4 class="truncated-text" :title="vuln.plugin_name">
                              {{ vuln.plugin_name }}
                            </h4>
                            <div class="d-flex justify-content-start mt-2">
                              <i class="bi bi-hdd-network me-2"></i>
                              <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 14px;margin-top: 2px">
                                {{ vuln.assets.length }} affected asset{{ vuln.assets.length !== 1 ? 's' : '' }}
                              </h6>
                            </div>
                            <div class="text-end">
                              <router-link :to="{ path: '/missingsecurityupdates', query: { team: activeTab } }" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;text-decoration: none;">
                                Details <i class="bi bi-arrow-right"></i>
                              </router-link>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                  <!-- blank -->
                </div>
            </div>
            </section>

            <!-- Operating system vulnerabilities by version - commented out, separate API pending -->
            <div v-if="false" class="row my-5">
                <div class="col-11">
                    <div class="d-flex justify-content-between">
                      <p style="color: rgba(0, 0, 0, 0.6);font-weight: 600;font-size: 15px;">Operating system vulnerabilities by version</p>
                    <p style="cursor: pointer;color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">View all</p>
                    </div>
                    <div class="row">
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                  <!-- blank -->
                </div>
            </div>

            <!-- Application vulnerabilities by software packages - commented out, separate API pending -->
            <div v-if="false" class="row my-5">
                <div class="col-11">
                    <div class="d-flex justify-content-between">
                      <p style="color: rgba(0, 0, 0, 0.6);font-weight: 600;font-size: 15px;">Application vulnerabilities by software packages</p>
                    <p style="cursor: pointer;color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">View all</p>
                    </div>
                    <div class="row">
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                  <!-- blank -->
                </div>
            </div>

            <!-- End of life systems requiring replacement - commented out, separate API pending -->
            <div v-if="false" class="row my-5">
                <div class="col-11">
                    <div class="d-flex justify-content-between">
                      <p style="color: rgba(0, 0, 0, 0.6);font-weight: 600;font-size: 15px;">End of life systems requiring replacement</p>
                    <p style="cursor: pointer;color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">View all</p>
                    </div>
                    <div class="row">
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                        <div class="col-3">
                          <div class="card py-3 px-3" style="border-radius: 12px;">
                                <p style="color: rgba(0, 0, 0, 0.6);font-weight: 500;font-size: 13px;">Assets</p>
                                <div class="d-flex justify-content-between">
                                    <h1 style="color: rgba(0, 0, 0, 0.87);font-size: 52px;">23</h1>
                                    <p class="mt-auto" style="color: rgba(49, 33, 177, 1);font-weight: 600;font-size: 15px;">Details <i class="bi bi-arrow-right"></i></p>
                                </div>
                                <div class="d-flex justify-content-start">
                                    <i class="bi bi-microsoft me-2"></i>
                                    <h6 style="color: rgba(0, 0, 0, 1);font-weight: 500;font-size: 17px;margin-top: 2px">Microsoft</h6>
                                </div>
                                <div class="d-flex align-items-center gap-3">
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #b31c1c"></span>
                                <span class="text-danger fw-bold">11</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f44336"></span>
                                <span class="text-danger fw-bold">4</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #f6b100"></span>
                                <span class="text-warning fw-bold">8</span>
                              </span>
                              <span class="d-flex align-items-center">
                                <span class="rounded-circle me-1"
                                  style="width: 6px; height: 6px; background-color: #4caf50"></span>
                                <span class="text-success fw-bold">0</span>
                              </span>
                                </div>
                          </div>
                        </div>
                    </div>
                </div>
                <div class="col-1">
                  <!-- blank -->
                </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardMenu from "@/components/admin-component/DashboardMenu.vue";
import DashboardHeader from "@/components/admin-component/DashboardHeader.vue";
import { useAuthStore } from "@/stores/authStore";

export default {
  name: "MitigationStrategyView",
  components: {
    DashboardMenu,
    DashboardHeader,
  },
  data() {
    return {
      showPopup: false,
      loading: false,
      mitigationData: null,
      teamsData: null,
      activeTab: "Patch Management",
      activeTabIndex: 0,
      riskCriteria: { critical: null, high: null, medium: null, low: null },
      showRiskModal: false,
      riskUpdating: false,
      riskModalSeverity: null,
      riskModalDays: null,
      riskModalReason: "",
      timeOptions: [
        "1 Day", "2 Days", "3 Days", "4 Days", "5 Days",
        "6 Days", "1 Week", "2 Weeks", "3 Weeks", "4 Weeks", "5 Weeks",
      ],
      tabs: [
        { key: "Patch Management", label: "Patch management", icon: "bi bi-shield-lock" },
        { key: "Configuration Management", label: "Configuration management", icon: "bi bi-wrench" },
        { key: "Network Security", label: "Network security", icon: "bi bi-reception-4" },
        { key: "Architectural Flaws", label: "Architectural flaws", icon: "bi bi-compass" },
      ],
    };
  },

  computed: {
    riskModalSeverityLabel() {
      const map = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };
      return this.riskModalSeverity ? map[this.riskModalSeverity] : '';
    },
    activeTeamData() {
      if (!this.teamsData) return { vulnerabilities: [] };
      const teamObj = this.teamsData[this.activeTab];
      if (teamObj && Array.isArray(teamObj.vulnerabilities)) return teamObj;
      return { vulnerabilities: [] };
    },
    uniqueVulns() {
      const seen = new Map();
      for (const vuln of this.activeTeamData.vulnerabilities) {
        const key = (vuln.plugin_name || '').trim().toLowerCase();
        if (!seen.has(key)) {
          // vuln-asset-count returns assets array; by-team returns host_name per row
          const assets = Array.isArray(vuln.assets) ? vuln.assets
            : vuln.host_name ? [vuln.host_name] : [];
          seen.set(key, { ...vuln, assets });
        } else {
          if (vuln.host_name) seen.get(key).assets.push(vuln.host_name);
        }
      }
      return Array.from(seen.values());
    },
  },

  methods: {
    setActiveTab(key, index) {
      this.activeTab = key;
      this.activeTabIndex = index;
    },

    riskColor(risk) {
      const map = {
        Critical: "#b31c1c",
        High: "#f44336",
        Medium: "#f6b100",
        Low: "#4caf50",
      };
      return map[risk] || "#666";
    },


    async openRiskModal(severity) {
      await this.loadRiskCriteria();
      this.riskModalSeverity = severity;
      this.riskModalDays = this.riskCriteria[severity] ?? null;
      this.riskModalReason = "";
      this.showRiskModal = true;
    },

    closeRiskModal() {
      this.showRiskModal = false;
      this.riskModalSeverity = null;
      this.riskModalDays = null;
      this.riskModalReason = "";
    },

    async submitRiskCriteria() {
      if (!this.riskModalDays) {
        alert("Please enter a value");
        return;
      }
      const store = useAuthStore();
      const updated = {
        critical: String(this.riskCriteria.critical ?? ''),
        high: String(this.riskCriteria.high ?? ''),
        medium: String(this.riskCriteria.medium ?? ''),
        low: String(this.riskCriteria.low ?? ''),
        [this.riskModalSeverity]: String(this.riskModalDays),
      };
      this.riskUpdating = true;
      const hasExisting = !!(localStorage.getItem("riskCriteriaId") || localStorage.getItem("riskId"));
      let result;
      if (hasExisting) {
        result = await store.updateRiskCriteria(updated);
        if (result.status && result.data?.risk_criteria?._id) {
          localStorage.setItem("riskCriteriaId", result.data.risk_criteria._id);
          localStorage.setItem("riskId", result.data.risk_criteria._id);
        }
      } else {
        result = await store.addRiskCriteria(updated);
        if (result.status && result.data?._id) {
          localStorage.setItem("riskCriteriaId", result.data._id);
          localStorage.setItem("riskId", result.data._id);
        }
      }
      this.riskUpdating = false;
      if (result.status) {
        this.riskCriteria = { ...updated };
        this.closeRiskModal();
      } else {
        alert(result.message || "Failed to save risk criteria");
      }
    },

    async loadRiskCriteria() {
      const store = useAuthStore();
      // Try list API first (GET /api/admin/risk_criteria/risks/)
      const listResult = await store.fetchAdminRiskCriteria();
      if (listResult.status && listResult.data) {
        const d = listResult.data;
        this.riskCriteria = {
          critical: d.critical ?? null,
          high: d.high ?? null,
          medium: d.medium ?? null,
          low: d.low ?? null,
        };
        return;
      }
      let result = await store.getRiskCriteriaById();
      // Fallback: if no stored ID, fetch by admin (also stores the ID)
      if (!result.status) {
        result = await store.getRiskCriteriaByAdmin();
        if (result.status && result.data) {
          const d = result.data;
          if (d._id) {
            localStorage.setItem("riskId", d._id);
            localStorage.setItem("riskCriteriaId", d._id);
          }
          this.riskCriteria = {
            critical: d.critical ?? null,
            high: d.high ?? null,
            medium: d.medium ?? null,
            low: d.low ?? null,
          };
        }
        return;
      }
      if (result.data?.risk_criteria) {
        const d = result.data.risk_criteria;
        if (d._id) {
          localStorage.setItem("riskId", d._id);
          localStorage.setItem("riskCriteriaId", d._id);
        }
        this.riskCriteria = {
          critical: d.critical ?? null,
          high: d.high ?? null,
          medium: d.medium ?? null,
          low: d.low ?? null,
        };
      }
    },

    async loadMitigationData() {
      const store = useAuthStore();
      this.loading = true;

      // Try vuln-asset-count API first (returns { report_id, teams: {...} })
      let result = await store.fetchAdminMitigationVulnAssetCount();
      if (result.status && result.data) {
        const data = result.data;
        // vuln-asset-count wraps teams under a "teams" key
        this.teamsData = data.teams || data;
        this.mitigationData = data;
        this.loading = false;
        return;
      }

      // Fallback: by-team API (returns { "Team Name": {...} } directly)
      result = await store.fetchMitigationByTeam();
      if (result.status && result.data) {
        const data = result.data;
        this.teamsData = data.teams || data;
        this.mitigationData = data;
      }
      this.loading = false;
    },
  },

  async mounted() {
    await Promise.all([this.loadMitigationData(), this.loadRiskCriteria()]);

    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
      const btn = dropdown.querySelector('.dropdown-btn');
      const options = dropdown.querySelectorAll('.dropdown-content a');

      btn.addEventListener('click', () => {
        dropdown.classList.toggle('show');
      });

      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          btn.textContent = option.textContent;
          dropdown.classList.remove('show');
        });
      });

      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('show');
        }
      });
    }
  },

  watch: {
    showPopup(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          const dropdown = this.$el.querySelector('.dropdown');
          const btn = dropdown.querySelector('.dropdown-btn');
          const options = dropdown.querySelectorAll('.dropdown-content a');

          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
          });

          options.forEach(option => {
            option.addEventListener('click', (e) => {
              e.preventDefault();
              btn.textContent = option.textContent;
              dropdown.classList.remove('show');
            });
          });

          document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
              dropdown.classList.remove('show');
            }
          }, { once: true });
        });
      }
    },
  },
};
</script>


<style scoped>
.download-report-btn {
    font-weight: 600;
    font-size: 15px;
    padding: 10px 15px;
    /* margin-right: 150px; */
    color: rgba(49, 33, 177, 1);
    background-color: white;
    border-radius: 30px;
    border: 1px solid rgba(0, 0, 0, 0.12);
}

.download-btn {
    font-weight: 600;
    font-size: 12px;
    padding: 8px 15px;
    color: white;
    background-color: rgba(49, 33, 177, 1);
    border-radius: 30px;
    border: 1px solid rgba(0, 0, 0, 0.12);
}

.tab-wrapper {
        position: relative;
        border-bottom: 1px solid #e0e0e0;
    }

    .tab-line {
        position: absolute;
        bottom: 0;
        height: 2px;
        background-color: rgba(49, 33, 177, 1); /* Active blue color */
        transition: all 0.3s ease;
    }

    .nav-item {
        text-align: center;
        cursor: pointer;
        padding: 8px 0;
        color: black;
        font-weight: 500;
        position: relative;
        z-index: 1;
    }

    .nav-item i {
        margin-right: 5px;
    }
    .dropdown {
    position: relative;
    display: inline-block;
    width: 200px;
}

.dropdown-btn {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 50px;
    padding: 4px 20px 4px 12px; /* extra right padding for the arrow */
    cursor: pointer;
    position: relative;
}

.dropdown-btn::after {
    content: "▼"; /* arrow symbol */
    font-size: 12px;
    color: #333;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 100%;
    border-radius: 12px;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
    z-index: 1;
    margin-top: 4px;
}

.dropdown-content a {
    padding: 8px 12px;
    display: block;
    text-decoration: none;
    color: black;
    border-radius: 8px;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown.show .dropdown-content {
    display: block;
}

.truncated-text {
    color: rgba(0, 0, 0, 0.87);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
    width: 100%;
    display: block;
    cursor: pointer;
  }

  .risk-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .risk-modal-box {
    background: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 350px;
  }

  .tooltip-text {
    visibility: hidden;
    width: max-content;
    max-width: 200px;
    background-color: #333;
    color: #fff;
    text-align: left;
    border-radius: 4px;
    padding: 6px 8px;
    position: absolute;
    z-index: 1;
    bottom: 125%; /* Position above the icon */
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    line-height: 1.3;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip-text::after {
    content: "";
    position: absolute;
    top: 100%; /* Arrow position */
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  .info-icon:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
  }

  .rounded-pill:hover {
    background-color: transparent;
  }

  .dropdown {
    position: relative;
    display: inline-block;
    width: 200px;
}

.dropdown-btn {
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.16);
    border-radius: 50px;
    padding: 8px 40px 8px 16px; /* extra right padding for the arrow */
    cursor: pointer;
    position: relative;
}

.dropdown-btn::after {
    content: "▼"; /* arrow symbol */
    font-size: 12px;
    color: #333;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.dropdown-content {
    display: none;
    position: absolute;
    background-color: white;
    min-width: 100%;
    border-radius: 12px;
    box-shadow: 0px 8px 16px rgba(0,0,0,0.2);
    z-index: 1;
    margin-top: 4px;
}

.dropdown-content a {
    padding: 8px 12px;
    display: block;
    text-decoration: none;
    color: black;
    border-radius: 8px;
}

.dropdown-content a:hover {
    background-color: #f1f1f1;
}

.dropdown.show .dropdown-content {
    display: block;
}
</style>
