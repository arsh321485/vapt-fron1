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

                    <div class="col-11 pt-5 pb-3 px-4">
                        <div class="d-flex justify-content-between">
                            <div>
                                <h2 class="ticket-head mt-3">Support Tickets</h2>
                            </div>
                        </div>

                        <div class="row">
                            <div class="d-flex flex-row align-items-center justify-content-between mt-3">
                                <div class="d-flex gap-3">
                                    <button
                                        class="btn btn-primary btn-pill fw-semibold"
                                        :class="{ 'active-tab': activeTab === 'all' }"
                                        @click="activeTab = 'all'"
                                    >All</button>
                                    <button
                                        class="btn btn-danger btn-pill"
                                        :class="{ 'active-tab': activeTab === 'open' }"
                                        @click="activeTab = 'open'"
                                    >Open</button>
                                    <button
                                        class="btn btn-success btn-pill"
                                        :class="{ 'active-tab': activeTab === 'closed' }"
                                        @click="activeTab = 'closed'"
                                    >Closed</button>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-5">
                            <div v-if="loading" class="text-center py-5">
                                <span class="spinner-border text-primary"></span>
                            </div>
                            <div v-else class="table-responsive">
                                <table class="table align-middle table-hover">
                                    <thead class="table-light">
                                        <tr>
                                            <th scope="col">S.No.</th>
                                            <th scope="col">Vul. name</th>
                                            <th scope="col">Asset</th>
                                            <th scope="col">Description</th>
                                            <th scope="col">Category</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Date requested</th>
                                        </tr>
                                    </thead>
                                    <tbody class="raised-tbody">
                                        <tr v-for="(ticket, i) in filteredTickets" :key="ticket._id">
                                            <td>{{ i + 1 }}</td>
                                            <td
                                                class="text-truncate"
                                                style="max-width:200px; cursor:pointer;"
                                                data-bs-toggle="tooltip"
                                                data-bs-placement="top"
                                                :title="ticket.plugin_name"
                                            >{{ ticket.plugin_name }}</td>
                                            <td>{{ ticket.host_name }}</td>
                                            <td
                                                style="cursor:pointer; max-width:220px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"
                                                data-bs-toggle="modal"
                                                data-bs-target="#viewDescModal"
                                                @click="openDescModal(ticket)"
                                            >{{ getShortDescription(ticket.description) }}</td>
                                            <td>{{ ticket.category }}</td>
                                            <td class="text-capitalize">
                                                <span
                                                    class="badge rounded-pill px-3 py-2"
                                                    :class="ticket.status === 'open' ? 'bg-danger' : 'bg-success'"
                                                >{{ ticket.status }}</span>
                                            </td>
                                            <td>{{ formatDate(ticket.created_at) }}</td>
                                        </tr>
                                        <tr v-if="!filteredTickets.length">
                                            <td colspan="7" class="text-center text-muted py-4">No tickets found</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <!-- Description Modal -->
                            <div class="modal fade" id="viewDescModal" tabindex="-1" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">Ticket Description</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                                        </div>
                                        <div class="modal-body">
                                            <h6 class="fw-semibold">Description</h6>
                                            <textarea class="form-control rounded-0" rows="4" readonly>{{ selectedDescription }}</textarea>
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
    name: 'UserTicketsView',
    components: {
        DashboardMenu,
        DashboardHeader,
    },
    data() {
        return {
            authStore: useAuthStore(),
            tickets: [],
            loading: false,
            activeTab: 'all',
            selectedDescription: '',
        };
    },
    computed: {
        sortedTickets() {
            return [...this.tickets].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        },
        filteredTickets() {
            if (this.activeTab === 'all') return this.sortedTickets;
            return this.sortedTickets.filter(t => t.status?.toLowerCase() === this.activeTab);
        },
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
            const res = await this.authStore.fetchUserAllTickets(reportId);
            this.loading = false;
            if (res.status) this.tickets = res.data;
        },
        openDescModal(ticket) {
            this.selectedDescription = ticket.description || '';
        },
        getShortDescription(desc) {
            if (!desc) return '';
            const words = desc.split(' ');
            return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : desc;
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' });
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
.btn-pill {
    border-radius: 50px;
    padding: 6px 20px;
    font-size: 0.875rem;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    white-space: nowrap;
    height: 36px;
}
.active-tab {
    background-color: #E6E3FF;
    color: #3121B1;
    border: none;
    font-size: 13px;
}
</style>
