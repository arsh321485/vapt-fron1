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

                    <div class="col-11 pt-5 pb-3 px-4 pe-5">
                        <div class="d-flex justify-content-between mt-4">
                            <div>
                                <h2 class="ticket-head">Support Requests</h2>
                            </div>
                        </div>

                        <div class="row mt-3">
                            <div class="d-flex justify-content-start gap-3">
                                <button class="btn rounded-pill border px-4" style="background-color: rgba(230, 227, 255, 1);color: rgba(49, 33, 177, 1);">All</button>
                                <button class="btn btn-sm py-1 px-2" style="border-radius: 20px;border-color: rgba(0, 0, 0, 0.12);" @click="toggleSort">
                                    <i class="bi bi-arrow-down-up me-1"></i>Sort by date
                                    <span v-if="sortOrder === 'asc'"> ↑</span>
                                    <span v-else-if="sortOrder === 'desc'"> ↓</span>
                                </button>
                            </div>
                        </div>

                        <div class="row mt-4">
                            <div v-if="loading" class="text-center py-5">
                                <span class="spinner-border text-primary"></span>
                            </div>
                            <div v-else-if="sortedRequests.length === 0" class="text-center text-muted py-5">
                                No support requests found.
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table align-middle table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>S.NO.</th>
                                            <th scope="col">Vul. name</th>
                                            <th scope="col">Asset</th>
                                            <th scope="col">Requested by</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Date requested</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="raised-tbody">
                                        <tr v-for="(req, i) in sortedRequests" :key="req._id">
                                            <td>{{ i + 1 }}</td>
                                            <td class="text-truncate" style="max-width: 200px;" data-bs-toggle="tooltip" data-bs-placement="top" :title="req.vul_name">{{ req.vul_name }}</td>
                                            <td>{{ req.host_name }}</td>
                                            <td>{{ req.requested_by }}</td>
                                            <td class="text-truncate" style="max-width: 180px;" data-bs-toggle="tooltip" data-bs-placement="top" :title="req.description">{{ req.description }}</td>
                                            <td>{{ formatDate(req.requested_at) }}</td>
                                            <td>
                                                <button
                                                    class="btn fw-semibold border-0"
                                                    style="color: rgba(49, 33, 177, 1);"
                                                    @click="viewRequest(req)">
                                                    View <i class="bi bi-eye ms-1"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- View Request Modal -->
                            <div class="modal fade" id="viewRequestsModal" tabindex="-1" aria-labelledby="viewRequestsModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title" id="viewRequestsModalLabel">Issues Raised for Support</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" v-if="selectedRequest">
                                            <div class="mb-3">
                                                <p class="mb-1 text-muted" style="font-size:13px;">Vulnerability</p>
                                                <p class="fw-semibold mb-0">{{ selectedRequest.vul_name }}</p>
                                            </div>
                                            <div class="mb-3">
                                                <p class="mb-1 text-muted" style="font-size:13px;">Asset</p>
                                                <p class="fw-semibold mb-0">{{ selectedRequest.host_name }}</p>
                                            </div>
                                            <div class="mb-3">
                                                <p class="mb-1 text-muted" style="font-size:13px;">Requested by</p>
                                                <p class="fw-semibold mb-0">{{ selectedRequest.requested_by }}</p>
                                            </div>
                                            <div class="mb-3">
                                                <p class="mb-2 fw-semibold">Steps requested</p>
                                                <div v-if="selectedRequest.step_requested?.toLowerCase() === 'all'" class="row g-2">
                                                    <div class="col-4">
                                                        <span class="badge rounded-pill w-100 py-2 text-center bg-primary" style="font-size:12px;">All Steps</span>
                                                    </div>
                                                </div>
                                                <div v-else class="row g-2">
                                                    <div
                                                        class="col-4"
                                                        v-for="step in selectedRequest.step_requested?.split(',') || []"
                                                        :key="step">
                                                        <span class="badge rounded-pill w-100 py-2 text-center bg-primary" style="font-size:12px;">Step {{ step.trim() }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <h6 class="mt-3 fw-semibold">Description</h6>
                                            <textarea class="form-control rounded-0" rows="4" readonly>{{ selectedRequest.description }}</textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
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
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
    name: 'UserExceptionsView',
    components: {
        DashboardMenu,
        DashboardHeader,
    },
    data() {
        return {
            authStore: useAuthStore(),
            supportRequests: [],
            loading: false,
            selectedRequest: null,
            sortOrder: 'desc',
        };
    },
    computed: {
        sortedRequests() {
            return [...this.supportRequests].sort((a, b) => {
                const da = new Date(a.requested_at);
                const db = new Date(b.requested_at);
                return this.sortOrder === 'asc' ? da - db : db - da;
            });
        },
    },
    async mounted() {
        await this.loadSupportRequests();
        this.$nextTick(() => {
            const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipEls].map(el => new bootstrap.Tooltip(el));
        });
    },
    methods: {
        async loadSupportRequests() {
            await this.authStore.fetchUserVulnerabilityRegister();
            const reportId = this.authStore.userLatestReportId;
            if (!reportId) return;
            this.loading = true;
            const res = await this.authStore.fetchUserSupportRequestsByReport(reportId);
            this.loading = false;
            if (res.status) {
                this.supportRequests = res.data;
            }
        },
        toggleSort() {
            this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        },
        viewRequest(req) {
            this.selectedRequest = req;
            this.$nextTick(() => {
                const modal = new bootstrap.Modal(document.getElementById('viewRequestsModal'));
                modal.show();
            });
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const d = new Date(dateStr);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
        },
    },
};
</script>

<style scoped>
.ticket-head {
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
    font-size: 36px;
}

.raised-table tr th {
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
}

.raised-tbody tr td {
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
}
</style>
