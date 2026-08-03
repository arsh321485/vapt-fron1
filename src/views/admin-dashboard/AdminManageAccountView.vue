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
          <div class="col-11 flex-grow-1">
            <ManageAccountPanel mode="admin" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import DashboardMenu from '@/components/admin-component/DashboardMenu.vue';
import ManageAccountPanel from '@/components/account/ManageAccountPanel.vue';

export default {
  name: 'AdminManageAccountView',
  components: { DashboardHeader, DashboardMenu, ManageAccountPanel },
};
</script>
