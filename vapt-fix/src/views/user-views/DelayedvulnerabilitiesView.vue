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

                    <div class="col-11 pt-3 pb-3 px-4 pe-5">
                      <router-link to="/userdashboard" style="color: rgba(49, 33, 177, 1);text-decoration: none;">
                        <i class="bi bi-arrow-left"></i> Back to home
                      </router-link>
                        <h2 class="ticket-head mt-3">Delayed vulnerabilities</h2>

                        <div class="row mt-4">  
                            <div class="d-flex gap-3">
                                <button class="btn btn-primary btn-pill active-tab fw-semibold">All</button>
                                <button class="btn btn-pill btn-outline-secondary" style="color: maroon;">Critical</button>
                                <button class="btn btn-outline-secondary btn-pill text-danger">High</button>
                                <button class="btn btn-outline-secondary btn-pill text-warning">Medium</button>
                                <button class="btn btn-outline-secondary btn-pill text-success">Low</button>
                                <button class="btn btn-outline-secondary btn-pill text-dark">June 1 - June 30 <i
                                        class="bi bi-calendar-minus ms-2"></i>
                                    </button>
                                
                                
                            </div>
                        </div>
                        <div class="row mt-5">
                            <div class="table-responsive">
                                <table class="table align-middle table-borderless">
                                    <thead class="raised-table">
                                        <tr>
                                            <th scope="col">Vul. name</th>
                                            <th scope="col">OS</th>
                                            <th scope="col">Assigned on</th>
                                            <th scope="col">Dependency</th>
                                            <th scope="col">Fixed on</th>
                                            
                                            
                                        </tr>
                                    </thead>
                                    <tbody class="raised-tbody">
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>High</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
                                            
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>High</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>High</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>High</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>High</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Medium</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>High</td>
                                            <td>23/06/2025</td>
                                            <td>23/06/2025</td>
                                            <td><router-link to="/delayedvulnerabilitycard" class="btn fw-semibold border-0" style="color: rgba(49, 33, 177, 1); text-decoration: none;">Fix Now <i class="bi bi-arrow-right-circle-fill ms-2"></i></router-link></td>
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

export default {
    name: 'DelayedvulnerabilitiesView',
    components: {
        DashboardMenu,
        DashboardHeader
    }
    
    
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

.fixes-btn {
    color: rgba(49, 33, 177, 1);
    font-weight: 600;
}

.fixes-btn {
    color: rgba(49, 33, 177, 1);
    font-weight: 600;
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

.btn-outline-secondary:hover {
    background-color: transparent;
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
</style>