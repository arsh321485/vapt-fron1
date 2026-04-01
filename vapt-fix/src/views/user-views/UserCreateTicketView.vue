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

                    <div class="col-11 pt-5 mt-2 pb-3 px-4">
                        <div class="row">
                            <div class="col-6 py-3">
                                <button class="btn p-0 text-decoration-none" style="color: rgba(49, 33, 177, 1);" @click="$router.back()">
                                    <i class="bi bi-arrow-left"></i> Back
                                </button>
                                <h2 class="ticket-head mt-3">Create a new ticket</h2>

                                <div v-if="loading" class="text-center py-5">
                                    <span class="spinner-border text-primary"></span>
                                </div>

                                <form v-else @submit.prevent>
                                    <label class="ps-1 mt-5 mb-2">Category</label>
                                    <select
                                        v-model="selectedCategory"
                                        :disabled="!!ticketData"
                                        class="form-select ps-3 py-2"
                                    >
                                        <option value="" disabled>Select a category...</option>
                                        <option value="bug">Report a bug</option>
                                        <option value="fix">Fix steps not working</option>
                                        <option value="other">Other</option>
                                    </select>

                                    <label class="ps-1 mt-4 mb-2">Asset</label>
                                    <input
                                        type="text"
                                        class="form-control py-2"
                                        v-model="selectedAsset"
                                        readonly
                                        style="background:#f6f6f6;border:none;border-radius:8px;"
                                    />

                                    <label class="ps-1 mt-4 mb-2">Subject</label>
                                    <input
                                        v-model="subject"
                                        :readonly="!!ticketData"
                                        type="text"
                                        class="form-control py-2"
                                        placeholder="Write a subject..."
                                        style="background:#f6f6f6;border:none;border-radius:8px;"
                                    />

                                    <label class="ps-1 mt-4 mb-2">Description</label>
                                    <textarea
                                        v-model="description"
                                        :readonly="!!ticketData"
                                        class="form-control py-2"
                                        rows="7"
                                        :placeholder="descriptionPlaceholder"
                                        style="background:#f6f6f6;border:none;border-radius:8px;"
                                    ></textarea>
                                </form>

                                <button
                                    v-if="!ticketData"
                                    type="button"
                                    class="btn btn-ticket py-2 px-5 mt-5"
                                    data-bs-toggle="modal"
                                    data-bs-target="#ticketModal"
                                >
                                    <i class="bi bi-plus-lg"></i> Create a new ticket
                                </button>

                            </div>

                            <!-- Confirmation Modal -->
                            <div class="modal fade" id="ticketModal" tabindex="-1" aria-labelledby="ticketModalLabel" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content rounded-3">
                                        <div class="modal-header">
                                            <h5 class="modal-title fw-semibold" id="ticketModalLabel">Confirmation</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body">
                                            Please make sure you have followed all the recommendations on vulnerability card before submitting ticket.
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                            <button type="button" class="btn btn-sm btn-primary" data-bs-dismiss="modal" @click="submitTicket">Submit</button>
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
import Swal from 'sweetalert2';

export default {
    name: 'UserCreateTicketView',
    components: {
        DashboardMenu,
        DashboardHeader,
    },
    data() {
        return {
            authStore: useAuthStore(),
            selectedCategory: '',
            selectedAsset: '',
            subject: '',
            description: '',
            reportId: '',
            fixVulnerabilityId: '',
            ticketId: '',
            ticketData: null,
            loading: false,
        };
    },
    computed: {
        descriptionPlaceholder() {
            if (this.selectedCategory === 'fix') {
                return 'Please make sure you have followed our steps. What issue are you facing?';
            }
            return 'Write your description here';
        },
    },
    async mounted() {
        this.reportId = this.$route.params.reportId || '';
        this.fixVulnerabilityId = this.$route.params.fixVulId || '';
        this.ticketId = this.$route.params.ticketId || '';
        this.selectedAsset = this.$route.params.asset
            ? decodeURIComponent(this.$route.params.asset)
            : '';

        // If no ticketId in route, check localStorage for a previously created ticket
        if (!this.ticketId && this.fixVulnerabilityId) {
            const cached = localStorage.getItem(`user_ticket_${this.fixVulnerabilityId}`);
            if (cached) this.ticketId = cached;
        }

        if (this.ticketId && this.fixVulnerabilityId) {
            await this.fetchTicket();
        }
    },
    methods: {
        async fetchTicket() {
            this.loading = true;
            const res = await this.authStore.getUserTicketById(this.fixVulnerabilityId, this.ticketId);
            this.loading = false;
            if (res.status && res.data) {
                this.ticketData = res.data;
                this.selectedCategory = res.data.category;
                this.selectedAsset = res.data.host_name;
                this.subject = res.data.subject;
                this.description = res.data.description;
            }
        },
        async submitTicket() {
            if (!this.selectedCategory || !this.subject || !this.description) {
                Swal.fire({ icon: 'warning', title: 'Please fill all required fields', timer: 2500, showConfirmButton: false });
                return;
            }

            const payload = {
                category: this.selectedCategory,
                subject: this.subject,
                description: this.description,
            };

            const res = await this.authStore.createUserTicket(this.reportId, this.fixVulnerabilityId, payload);

            if (res.status) {
                Swal.fire({ icon: 'success', title: 'Ticket Created Successfully', timer: 2000, showConfirmButton: false });
                const newTicketId = res.data?._id;
                if (newTicketId) {
                    // Cache so next visit to this page loads the existing ticket
                    localStorage.setItem(`user_ticket_${this.fixVulnerabilityId}`, newTicketId);
                    this.$router.replace({
                        name: 'UserCreateTicket',
                        params: {
                            reportId: this.reportId,
                            fixVulId: this.fixVulnerabilityId,
                            asset: encodeURIComponent(this.selectedAsset),
                            ticketId: newTicketId,
                        },
                    });
                }
            } else {
                Swal.fire({ icon: 'error', title: 'Failed', text: res.message, timer: 3000, showConfirmButton: false });
            }
        },
    },
};
</script>

<style scoped>
.form-select {
    background-color: #f6f6f6 !important;
    border: none !important;
    border-radius: 8px !important;
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%236c757d' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e") !important;
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 16px 12px;
}
.ticket-head {
    color: rgba(0, 0, 0, 1);
    font-weight: 600;
    font-size: 36px;
}
.btn-ticket {
    background-color: rgba(49, 33, 177, 1);
    color: #fff;
    border: none;
    border-radius: 50px;
}
.btn-ticket:hover {
    background-color: rgb(76, 57, 221);
    color: #fff;
}
</style>
