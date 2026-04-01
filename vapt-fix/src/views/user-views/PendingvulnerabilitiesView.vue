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

                    <div class="col-11 pt-5 mt-4 pb-3 px-4 pe-5">
                        <div class="d-flex justify-content-between">
                            <div>
                                <router-link to="/userdashboard" style="color: rgba(49, 33, 177, 1);text-decoration: none;">
                                    <i class="bi bi-arrow-left"></i> Back to home
                                </router-link>
                                <h2 class="ticket-head mt-3">Pending</h2>
                            </div>
                        </div>

                        <div class="row mt-5">
                            <div v-if="loading" class="text-center py-5">
                                <span class="spinner-border text-primary"></span>
                            </div>
                            <div v-else-if="tickets.length === 0" class="text-center text-muted py-5">
                                No open tickets found.
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table align-middle table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th>S.NO.</th>
                                            <th scope="col">Vul. name</th>
                                            <th scope="col">Asset</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Subject</th>
                                            <th scope="col">Assigned team</th>
                                            <th scope="col">Created on</th>
                                            <th scope="col"></th>
                                        </tr>
                                    </thead>
                                    <tbody class="raised-tbody">
                                        <tr v-for="(ticket, i) in tickets" :key="ticket._id">
                                            <td>{{ i + 1 }}</td>
                                            <td class="text-truncate" style="max-width: 200px;" data-bs-toggle="tooltip" data-bs-placement="top" :title="ticket.plugin_name">{{ ticket.plugin_name }}</td>
                                            <td>{{ ticket.host_name }}</td>
                                            <td>{{ ticket.category }}</td>
                                            <td class="text-truncate" style="max-width: 150px;" data-bs-toggle="tooltip" data-bs-placement="top" :title="ticket.subject">{{ ticket.subject }}</td>
                                            <td>{{ ticket.assigned_team || '—' }}</td>
                                            <td>{{ formatDate(ticket.created_at) }}</td>
                                            <td>
                                                <button
                                                    class="btn fw-semibold border-0"
                                                    style="color: rgba(49, 33, 177, 1);"
                                                    @click="viewTicket(ticket)">
                                                    View <i class="bi bi-arrow-right-circle-fill ms-1"></i>
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
        </section>
    </main>
</template>

<script>
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import { useAuthStore } from '@/stores/authStore';

export default {
    name: 'PendingvulnerabilitiesView',
    components: {
        DashboardMenu,
        DashboardHeader,
    },
    data() {
        return {
            authStore: useAuthStore(),
            tickets: [],
            loading: false,
        };
    },
    async mounted() {
        await this.loadTickets();
        this.$nextTick(() => {
            const tooltipEls = document.querySelectorAll('[data-bs-toggle="tooltip"]');
            [...tooltipEls].map(el => new bootstrap.Tooltip(el));
        });
    },
    methods: {
        async loadTickets() {
            await this.authStore.fetchUserVulnerabilityRegister();
            const reportId = this.authStore.userLatestReportId;
            if (!reportId) return;
            this.loading = true;
            const res = await this.authStore.fetchUserOpenTickets(reportId);
            this.loading = false;
            if (res.status) {
                this.tickets = res.data;
            }
        },
        viewTicket(ticket) {
            this.$router.push({
                name: 'UserCreateTicket',
                params: {
                    reportId: ticket.report_id,
                    fixVulId: ticket.fix_vulnerability_id,
                    asset: encodeURIComponent(ticket.host_name),
                    ticketId: ticket._id,
                },
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

.raised-tbody tr td {
    color: rgba(0, 0, 0, 1);
    font-weight: 500;
}
</style>
