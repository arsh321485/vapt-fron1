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

          <div class="col-11 pt-2 pb-3 pe-4">
            <div class="d-flex flex-row align-items-center justify-content-between py-3">
              <h2 class="">Vulnerability Management Program</h2>
              

              <!-- <button type="button" class="btn pending-approval-btn rounded-pill">
                11 Compensatory controls pending approval
                <i class="bi bi-arrow-right ms-1 fs-5"></i>
              </button> -->
            </div>

            <div class="row">
              <div class="col-3">
                <div class="card pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i></div>
                    <p class="assets-para">Total assets<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                  </div>
                  <div class="justify-content-start">
                    <div style="
                        height: 15px;
                        width: 230px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 15px;
                      "></div>
                    <div style="
                        height: 15px;
                        width: 130px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 30px;
                      "></div>
                  </div>
                </div>
              </div>
              <div class="col-9 gx-5">
                <!-- Vulnerabilities -->
                <div class="row px-3 pb-3" style="
                    border: 1px solid rgba(217, 217, 217, 1);
                    border-radius: 5px;
                    padding-top: 15px;
                  ">
                  <div class="col-md-5">
                    <div class="d-flex flex-row justify-content-start gap-2">
                      <div class="assets-icon text-center"><i class="bi bi-laptop"></i></div>
                      <p class="assets-para">Vulnerabilities<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                    </div>
                    <div class="justify-content-start">
                      <div style="
                          height: 15px;
                          width: 230px;
                          background-color: rgba(234, 234, 234, 1);
                          margin-bottom: 15px;
                        "></div>
                      <div style="
                          height: 15px;
                          width: 130px;
                          background-color: rgba(234, 234, 234, 1);
                          margin-bottom: 30px;
                        "></div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="col-md-1 d-flex justify-content-center">
                    <div class="divider-vertical"></div>
                  </div>

                  <!-- Vulnerability aging -->
                  <div class="col-md-6">
                    <div class="mb-2">
                      <p class="assets-para">Vulnerability aging<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                    </div>
                    <div class="d-flex justify-content-between align-items-end mb-1">
                      <div class="justify-content-start">
                        <div style="
                            height: 15px;
                            width: 100px;
                            background-color: rgba(234, 234, 234, 1);
                            margin-bottom: 15px;
                          "></div>
                        <div style="
                            height: 15px;
                            width: 60px;
                            background-color: rgba(234, 234, 234, 1);
                            margin-bottom: 30px;
                          "></div>
                      </div>
                      <div class="justify-content-start">
                        <div style="
                            height: 15px;
                            width: 100px;
                            background-color: rgba(234, 234, 234, 1);
                            margin-bottom: 15px;
                          "></div>
                        <div style="
                            height: 15px;
                            width: 60px;
                            background-color: rgba(234, 234, 234, 1);
                            margin-bottom: 30px;
                          "></div>
                      </div>
                      <div class="justify-content-start">
                        <div style="
                            height: 15px;
                            width: 100px;
                            background-color: rgba(234, 234, 234, 1);
                            margin-bottom: 15px;
                          "></div>
                        <div style="
                            height: 15px;
                            width: 60px;
                            background-color: rgba(234, 234, 234, 1);
                            margin-bottom: 30px;
                          "></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i></div>
                    <p class="assets-para">Patch compliance rate<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                  </div>
                  <div class="justify-content-start">
                    <div style="
                        height: 15px;
                        width: 230px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 15px;
                      "></div>
                    <div style="
                        height: 15px;
                        width: 130px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 30px;
                      "></div>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i></div>
                    <p class="assets-para">Mean time to remediate<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                  </div>
                  <div class="justify-content-start">
                    <div style="
                        height: 15px;
                        width: 230px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 15px;
                      "></div>
                    <div style="
                        height: 15px;
                        width: 130px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 30px;
                      "></div>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i></div>
                    <p class="assets-para">Exceptions approved<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                  </div>
                  <div class="justify-content-start">
                    <div style="
                        height: 15px;
                        width: 230px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 15px;
                      "></div>
                    <div style="
                        height: 15px;
                        width: 130px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 30px;
                      "></div>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i></div>
                    <p class="assets-para">Remediation Throughput<i class="bi bi-info-circle ms-1" style="color: rgba(49, 33, 177, 1);font-size: 13px;font-weight: 600;"></i></p>
                  </div>
                  <div class="justify-content-start">
                    <div style="
                        height: 15px;
                        width: 230px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 15px;
                      "></div>
                    <div style="
                        height: 15px;
                        width: 130px;
                        background-color: rgba(234, 234, 234, 1);
                        margin-bottom: 30px;
                      "></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-12">
                <div class="row my-4">
                  <h3 class="fw-semibold">
                    Please wait while we analyze your vulnerability report...
                  </h3>
                  <p style="color: rgba(0, 0, 0, 0.6); font-size: 15px">
                    Your wait time is <span style="color: rgba(49, 33, 177, 1)">~5 hours.</span>
                  </p>
                </div>
                <div class="card pb-2 pt-3 px-3 position-relative">
                  <div class="d-flex flex-row align-items-center justify-content-start py-3">
                    <div><h4 class="fw-semibold">Mitigation Strategy <i class="bi bi-info-circle" style="cursor: pointer;font-size: 15px;"  @click="showFirstBox = true"></i></h4>
                    <!-- FIRST BOX (opened on info icon click) -->
                    <div v-if="showFirstBox" class="mitigation-popover shadow-sm">
                      <div class="popover-content">
                        <span class="mitigation-close-btn" @click="showFirstBox = false">&times;</span>
                        <h6 style="font-size: 18px;">Mitigation Strategy</h6>
                        <p class="mb-0" style="font-size: 13px;">
                          Using this widget, you can manage, assign and set deadline for vulnerabilities of different categories.
                          Assign
                        </p>
                        <button class="btn text-light mt-4 border-0" @click="handleNextClick">
                          Next <i class="bi bi-chevron-right"></i>
                        </button>
                      </div>
                      <div class="mitigation-popover-arrow"></div>
                    </div></div>

                    <!-- SECOND BOXES (after clicking Next) -->
                    <div v-if="showSecondBox" class="assign-popup d-flex gap-4 mt-3">
                      

                      <div v-if="showTooltip" class="black-tooltip">
                        <h6>Assign users</h6>
                        <p class="mb-0" style="font-size: 13px;">
                          Assign users to a vulnerability, set a deadline and track their progress.
                        </p>
                        <router-link to="/admindashboardonboarding">
                        <button class="btn mt-5 border-0" style="color: rgba(194, 186, 255, 1);font-weight: 600;">Next <i class="bi bi-chevron-right" style="font-weight: 600;"></i></button>
                        </router-link>
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                    <div class="col-12">
                      <div class="d-flex gap-3">
                        <button class="btn btn-primary btn-pill active-tab fw-semibold">
                          Patch Management
                        </button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">
                          Configuration Management
                        </button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">
                          Network Security
                        </button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">
                          Architectural flaws
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="row mx-2 my-4">
                    <div class="d-flex justify-content-between">
                      <!-- <div class="avatar-container">
                        <p style="color: rgba(0, 0, 0, 1); font-weight: 500; margin-top: 15px">
                          Assign to:
                        </p>
                        <div class="avatar ava-green">AB</div>
                        <div class="avatar ava-blue">SK</div>
                        <div class="avatar ava-yellow">CK</div>
                        <div class="avatar ava-pink">MH</div>
                        <div class="avatar ava-black">+5</div>
                      </div> -->
                      <div class="d-flex flex-row gap-2" style="font-size: 15px;">
                        <span style="color: rgba(0, 0, 0, 0.6);">Deadline:</span>
                        <span style="color:rgba(0, 0, 0, 0.87);"> 24th July, 2025</span>
                        <span style="color: rgba(49, 33, 177, 1);">Edit</span>
                      </div>
                      <div>
                        <p style="color: rgba(49, 33, 177, 1); font-weight: 600">
                          More details <i class="bi bi-arrow-right"></i>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div class="row mb-5">
                    <div class="col-11">
                      <div class="row">
                        <div class="col-3">
                          <div class="card p-4 h-100" style="border-radius: 12px">
                            <p class="estimated-text">Missing security updates</p>
                            <h1 class="text-212 mt-auto">212</h1>
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
                          <div class="card p-4 h-100" style="border-radius: 12px">
                            <p class="estimated-text">OS vulns. by version</p>
                            <h1 class="text-212 mt-auto">212</h1>
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
                          <div class="card p-4 h-100" style="border-radius: 12px">
                            <p class="estimated-text">App vulns. by software packages</p>
                            <h1 class="text-212 mt-auto">212</h1>
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
                        <div class="col-3 me-auto">
                          <div class="card p-4 h-100" style="border-radius: 12px">
                            <p class="estimated-text">End of life systems</p>
                            <h1 class="text-212 mt-auto">212</h1>
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

          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardMenu from "@/components/admin-component/DashboardMenu.vue";
import DashboardHeader from "@/components/admin-component/DashboardHeader.vue";

export default {
  name: "Onboarding1View",
  components: {
    DashboardMenu,
    DashboardHeader,
  },
   data() {
    return {
      showFirstBox: false,
      showSecondBox: false,
      showTooltip: true
    };
  },
  methods: {
    handleNextClick() {
      this.showFirstBox = false;
      this.showSecondBox = true;
    }
  }
};
</script>

<style scoped>
.calender-para {
  color: #3121b1;
  font-size: 14px;
}

.vuln-heading {
  font-size: 18px;
}

.btn-pill {
  border-radius: 50px;
  padding: 6px 16px;
  font-size: 0.875rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  height: 36px;
}

.active-tab {
  background-color: #eae8ff;
  color: #3121b1;
  border: none;
  font-size: 13px;
}

.other-btn {
  color: #000000de;
  border: 1px solid #00000029;
}

.position-relative {
  position: relative;
}

.assign-popup {
  position: absolute;
  top: -50px; 
  left: 250px; 
  z-index: 999; 
}
.mitigation-popover {
  background: rgba(9, 9, 19, 1);
  padding: 20px;
  border-radius: 10px;
  width: 380px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* position: relative; */
}

.mitigation-popover-arrow {
  position: absolute;
  top: 15px;
  left: -6px;
  width: 12px;
  height: 12px;
  background: rgba(9, 9, 19, 1);
  border-bottom: 1px solid rgba(9, 9, 19, 1);
  transform: rotate(45deg);
  z-index: -1;
  border-top: 10px solid transparent;
  border-right: 10px solid rgba(9, 9, 19, 1);
}
.white-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 260px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  left: 30px;
}

.black-tooltip {
  background-color: rgba(9, 9, 19, 1);
  color: white;
  padding: 15px;
  border-radius: 10px;
  width: 350px;
  height:180px ;
  position: relative;
  left: 50px;
}

.black-tooltip::before {
  content: "";
  position: absolute;
  top: 20px;
  left: -10px;
  border-top: 10px solid transparent;
  border-right: 10px solid rgba(9, 9, 19, 1);
  border-bottom: 10px solid transparent;
  /* z-index: -1; */
}

</style>
