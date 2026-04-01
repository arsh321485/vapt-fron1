<template>
    <main>
    <section>
        <div class="container-fluid">
        <div class="row">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-1">
            <DashboardMenu />
          </div>

          <div class="col-11 pt-5 pb-3 pe-4 flex-grow-1">
            <div class="report-page pt-4">

            <!-- HEADER -->
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                <h2 class="mb-1">
                    <!-- <i class="bi bi-clipboard-data me-2"></i> -->
                    Vulnerability Reports
                </h2>
                <!-- <small class="text-muted">
                    View and download security assessment reports
                </small> -->
                </div>

                <button class="btn btn-primary">
                <i class="bi bi-download me-2"></i>
                Download Full Report
                </button>
            </div>

            <!-- FILTERS -->
            <div class="card mb-4">
                <div class="card-body">
                <div class="row g-3">

                    <div class="col-md-3">
                    <label class="form-label">Host Name</label>
                    <input type="text" class="form-control" placeholder="example.com">
                    </div>

                    <div class="col-md-3">
                    <label class="form-label">Severity</label>
                    <select class="form-select">
                        <option value="">All</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                    </div>

                    <div class="col-md-3">
                    <label class="form-label">Vulnerability Type</label>
                    <select class="form-select">
                        <option value="">All</option>
                    </select>
                    </div>

                    <div class="col-md-3 d-flex align-items-end">
                    <button class="btn btn-outline-primary w-100">
                        <i class="bi bi-search me-1"></i>
                        Apply Filters
                    </button>
                    </div>

                </div>
                </div>
            </div>

            <!-- SEVERITY SUMMARY -->
            <div class="row mb-4">
                <div class="col-md-3">
                <div class="summary-card critical">
                    <h6>Critical</h6>
                    <h3>3</h3>
                </div>
                </div>
                <div class="col-md-3">
                <div class="summary-card high">
                    <h6>High</h6>
                    <h3>7</h3>
                </div>
                </div>
                <div class="col-md-3">
                <div class="summary-card medium">
                    <h6>Medium</h6>
                    <h3>12</h3>
                </div>
                </div>
                <div class="col-md-3">
                <div class="summary-card low">
                    <h6>Low</h6>
                    <h3>18</h3>
                </div>
                </div>
            </div>

            <!-- REPORT TABLE -->
            <div class="card">
                <div class="card-body p-0">
                <table class="table table-hover mb-0">
                    <thead class="table-light">
                    <tr>
                        <th>Host</th>
                        <th>Vulnerability</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Detected On</th>
                        <th class="text-end">Action</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr>
                        <td>example.com</td>
                        <td>SQL Injection</td>
                        <td><span class="badge bg-danger">Critical</span></td>
                        <td><span class="badge bg-warning">Open</span></td>
                        <td>12 Jan 2026</td>
                        <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-download"></i>
                        </button>
                        </td>
                    </tr>

                    <tr>
                        <td>api.example.com</td>
                        <td>XSS</td>
                        <td><span class="badge bg-warning text-dark">High</span></td>
                        <td><span class="badge bg-success">Fixed</span></td>
                        <td>10 Jan 2026</td>
                        <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary me-2">
                            <i class="bi bi-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary">
                            <i class="bi bi-download"></i>
                        </button>
                        </td>
                    </tr>

                    </tbody>
                </table>
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
  name: 'ReportView',
  components: {
    DashboardMenu,
    DashboardHeader,
  },
}
</script>

<style scoped>
.summary-card {
  border-radius: 10px;
  padding: 16px;
  color: #fff;
}

.summary-card.critical { background: #dc3545; }
.summary-card.high { background: #fd7e14; }
.summary-card.medium { background: #ffc107; color: #000; }
.summary-card.low { background: #198754; }

</style>