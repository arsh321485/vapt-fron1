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

                    <div class="col-11 pt-2 pb-3 px-4">
                        <h2 class="ticket-head mt-3">Fixes</h2>
                        <div class="row mt-5">
                            <div class="table-responsive">
                                <table class="table align-middle table-borderless">
                                    <thead class="raised-table">
                                        <tr>
                                            <th scope="col">Vul. name</th>
                                            <th scope="col">Asset</th>
                                            <th scope="col">OS</th>
                                            <th scope="col">Estimated effort</th>
                                            <th scope="col">Dependency</th>
                                            <th scope="col">Assign to</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody class="raised-tbody">
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Windows 10</td>
                                            <td>4 hours</td>
                                            <td>Developers</td>
                                            <td>
                                                <div class="avatar-container">
                                                    <div class="avatar ava-green">AB</div>
                                                    <div class="avatar ava-blue">SK</div>
                                                    <div class="avatar ava-yellow">CK</div>
                                                    <div class="avatar ava-pink">MH</div>
                                                    <div class="avatar ava-black">+5</div>
                                                </div>
                                            </td>

                                            <td>
                                                <button class="btn fixes-btn">
                                                    Fix now
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Windows 10</td>
                                            <td>4 hours</td>
                                            <td>Developers</td>
                                            <td>
                                                <div class="avatar-container">
                                                    <div class="avatar ava-green">AB</div>
                                                    <div class="avatar ava-blue">SK</div>
                                                    <div class="avatar ava-yellow">CK</div>
                                                    <div class="avatar ava-pink">MH</div>
                                                    <div class="avatar ava-black">+5</div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn fixes-btn">
                                                    Fix now
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Windows 10</td>
                                            <td>4 hours</td>
                                            <td>Developers</td>
                                            <td>
                                                <div class="avatar-container">
                                                    <div class="avatar ava-green">AB</div>
                                                    <div class="avatar ava-blue">SK</div>
                                                    <div class="avatar ava-yellow">CK</div>
                                                    <div class="avatar ava-pink">MH</div>
                                                    <div class="avatar ava-black">+5</div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn fixes-btn">
                                                    Fix now
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Windows 10</td>
                                            <td>4 hours</td>
                                            <td>Developers</td>
                                            <td>
                                                <div class="avatar-container">
                                                    <div class="avatar ava-green">AB</div>
                                                    <div class="avatar ava-blue">SK</div>
                                                    <div class="avatar ava-yellow">CK</div>
                                                    <div class="avatar ava-pink">MH</div>
                                                    <div class="avatar ava-black">+5</div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn fixes-btn">
                                                    Fix now
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Windows 10</td>
                                            <td>4 hours</td>
                                            <td>Developers</td>
                                            <td>
                                                <div class="avatar-container">
                                                    <div class="avatar ava-green">AB</div>
                                                    <div class="avatar ava-blue">SK</div>
                                                    <div class="avatar ava-yellow">CK</div>
                                                    <div class="avatar ava-pink">MH</div>
                                                    <div class="avatar ava-black">+5</div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn fixes-btn">
                                                    Fix now
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-truncate" style="max-width: 200px;">VMware ESXi 7.0/8.0
                                                Sandbox Escape...</td>
                                            <td>192.68.1.42</td>
                                            <td>Windows 10</td>
                                            <td>4 hours</td>
                                            <td>Developers</td>
                                            <td>
                                                <div class="avatar-container">
                                                    <div class="avatar ava-green">AB</div>
                                                    <div class="avatar ava-blue">SK</div>
                                                    <div class="avatar ava-yellow">CK</div>
                                                    <div class="avatar ava-pink">MH</div>
                                                    <div class="avatar ava-black">+5</div>
                                                </div>
                                            </td>
                                            <td>
                                                <button class="btn fixes-btn">
                                                    Fix now
                                                    <i class="bi bi-arrow-right-circle-fill"></i>
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
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';

export default {
    name: 'FixesView',
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
    color:rgba(49, 33, 177, 1);
    font-weight: 600;
}
.fixes-btn {
    color:rgba(49, 33, 177, 1);
    font-weight: 600;
}
</style>