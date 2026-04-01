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

          <div class="col-11 pt-2 pb-3">
            <div class="d-flex flex-row align-items-center justify-content-between py-3">
              <h2 class="">Vulnerability Management Program</h2>
              <button type="button" class="btn pending-approval-btn rounded-pill">
                11 Compensatory controls pending approval
                <i class="bi bi-arrow-right ms-1 fs-5"></i>
              </button>
            </div>

            <div class="row">
              <div class="col-3">
                <div class="card pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Total assets</p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <h1 class="text-212">212</h1>
                    <p style="margin-top: 37px;">Avg. score: <span class="fw-bold">7.8</span></p>
                  </div>
                </div>
              </div>
              <div class="col-9 gx-5">
                <!-- Vulnerabilities -->
                <div class="row px-3 pb-3"
                  style="border: 1px solid rgba(217, 217, 217, 1);border-radius: 5px;padding-top: 15px;">
                  <div class="col-md-5">
                    <div class="d-flex flex-row justify-content-start gap-2">
                      <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                      </div>
                      <p class="assets-para">Vulnerabilities</p>
                    </div>
                    <div class="d-flex justify-content-center align-items-end mb-1">
                      <div class="text-center">
                        <div id="highAge" class="fs-5 fw-semibold">56</div>
                        <div class="bar red vul-bar mt-1"></div>
                        <small class="text-danger mt-1 d-block">● High</small>
                      </div>
                      <div class="text-center">
                        <div id="mediumAge" class="fs-5 fw-semibold">127</div>
                        <div class="bar yellow vul-bar mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium</small>
                      </div>
                      <div class="text-center">
                        <div id="lowAge" class="fs-5 fw-semibold">42</div>
                        <div class="bar green vul-bar mt-1"></div>
                        <small class="text-success mt-1 d-block">● Low</small>
                      </div>
                    </div>
                  </div>

                  <!-- Divider -->
                  <div class="col-md-1 d-flex justify-content-center">
                    <div class="divider-vertical"></div>
                  </div>

                  <!-- Vulnerability aging -->
                  <div class="col-md-6">
                    <div class="mb-2">
                      <p class="assets-para">Vulnerability aging</p>
                    </div>
                    <div class="d-flex justify-content-between align-items-end mb-1">
                      <div class="text-center">
                        <div id="highCount" class="fs-4 fw-semibold">2d 11hrs</div>
                        <div class="bar red w-100 mt-1"></div>
                        <small class="text-danger mt-1 d-block">● High</small>
                      </div>
                      <div class="text-center">
                        <div id="mediumCount" class="fs-4 fw-semibold">3d 4hrs</div>
                        <div class="bar yellow w-100 mt-1"></div>
                        <small class="text-warning mt-1 d-block">● Medium</small>
                      </div>
                      <div class="text-center">
                        <div id="lowCount" class="fs-4 fw-semibold">2d 2hrs</div>
                        <div class="bar green w-100 mt-1"></div>
                        <small class="text-success mt-1 d-block">● Low</small>
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
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Patch compliance rate</p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2 py-3">
                    <h1 class="text-78">78%</h1>
                    <button type="button" class="btn patch-btn rounded-pill text-nowrap">
                      June 1 - June 30 <i class="bi bi-calendar-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Mean time to remediate</p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2 py-3">
                    <h1 class="text-78">2d 11 hrs</h1>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Exceptions approved</p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2 py-3">
                    <h1 class="text-78">32</h1>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="card h-100 pb-2 pt-3 px-3">
                  <div class="d-flex flex-row justify-content-start gap-2">
                    <div class="assets-icon text-center"><i class="bi bi-laptop"></i>
                    </div>
                    <p class="assets-para">Remediation Throughput</p>
                  </div>
                  <div class="d-flex flex-row justify-content-start gap-2 py-3">
                    <h1 class="text-78">32</h1>
                    <button type="button" class="btn patch-btn rounded-pill text-nowrap">
                      June 1 - June 30 <i class="bi bi-calendar-minus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="row mt-3">
              <div class="col-12">
                <div class="card pb-2 pt-3 px-3">
                  <div class="d-flex flex-row align-items-center justify-content-between py-3">
                    <h5 class="fw-semibold vuln-heading">Open vulnerabilities</h5>
                    <p class="calender-para fw-semibold">Calendar view</p>
                  </div>
                  <div class="row mt-3">
                    <div class="col-12">
                      <div class="d-flex gap-3">
                        <button class="btn btn-primary btn-pill active-tab fw-semibold">
                          Recommended actions
                        </button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">Due this week</button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">
                          Steps <i class="bi bi-arrow-down"></i>
                        </button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">High risk vulns</button>
                        <button class="btn btn-outline-secondary btn-pill other-btn">Critical assets</button>
                      </div>
                    </div>
                  </div>

                  <div class="row my-5">
                    <div class="col-11">
                      <div class="row">
                        <div class="col-4">
                          <div class="card p-4 border-0 shadow" style="border-radius: 12px;">
                            <p class="estimated-text">Estimated effort: <span>2 days</span> </p>
                            <p class="fix-para">Fix 8 high risk vulnerabilities from these 3 assets.</p>
                            <p class="num-value">192.168.42.1, 192.168.41.15, 192.168.52.12</p>
                            <p class="assign-head">Assign to:</p>
                            <div class="avatar-container">
                              <div class="avatar ava-green">AB</div>
                              <div class="avatar ava-blue">SK</div>
                              <div class="avatar ava-yellow">CK</div>
                              <div class="avatar ava-pink">MH</div>
                              <div class="avatar ava-black">+5</div>
                            </div>
                            <div class="status-container mt-3">
                              <button class="btn text-blue ps-0">Fix now <i class="bi bi-arrow-right mt-3"></i></button>
                              <div class="done">
                                <i class="bi bi-check-circle"></i>
                                <span class="done-text">Done</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-4">
                          <div class="card p-4 border-0 shadow" style="border-radius: 12px;">
                            <p class="estimated-text">Estimated effort: <span>2 days</span> </p>
                            <p class="fix-para">Fix 8 high risk vulnerabilities from these 3 assets.</p>
                            <p class="num-value">192.168.42.1, 192.168.41.15, 192.168.52.12</p>
                            <p class="assign-head">Assign to:</p>
                            <div class="avatar-container">
                              <div class="avatar ava-green">AB</div>
                              <div class="avatar ava-blue">SK</div>
                              <div class="avatar ava-yellow">CK</div>
                              <div class="avatar ava-pink">MH</div>
                              <div class="avatar ava-black">+5</div>
                            </div>
                            <div class="status-container mt-3">
                              <button class="btn text-blue ps-0">Fix now <i class="bi bi-arrow-right mt-3"></i></button>
                              <div class="done">
                                <i class="bi bi-check-circle"></i>
                                <span class="done-text">Done</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="col-4 me-auto">
                          <div class="card p-4 border-0 shadow" style="border-radius: 12px;">
                            <p class="estimated-text">Estimated effort: <span>2 days</span> </p>
                            <p class="fix-para">Fix 8 high risk vulnerabilities from these 3 assets.</p>
                            <p class="num-value">192.168.42.1, 192.168.41.15, 192.168.52.12</p>
                            <p class="assign-head">Assign to:</p>
                            <div class="avatar-container">
                              <div class="avatar ava-green">AB</div>
                              <div class="avatar ava-blue">SK</div>
                              <div class="avatar ava-yellow">CK</div>
                              <div class="avatar ava-pink">MH</div>
                              <div class="avatar ava-black">+5</div>
                            </div>
                            <div class="status-container mt-3">
                              <button class="btn text-blue ps-0">Fix now <i class="bi bi-arrow-right mt-3"></i></button>
                              <div class="done">
                                <i class="bi bi-check-circle"></i>
                                <span class="done-text">Done</span>
                              </div>
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
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';

export default {
  name: 'Dashboard1View',
  components: {
    DashboardMenu,
    DashboardHeader
  }
};
</script>

<style scoped>
.calender-para {
  color: #3121B1;
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
  background-color: #EAE8FF;
  color: #3121B1;
  border: none;
  font-size: 13px;
}

.other-btn {
  color: #000000DE;
  border: 1px solid #00000029;
}
</style>