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
          <div class="col-11 ud-content">
            <ManageAccountPanel mode="user" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import ManageAccountPanel from '@/components/account/ManageAccountPanel.vue';

export default {
  name: 'UserManageAccountView',
  components: { DashboardHeader, DashboardMenu, ManageAccountPanel },
};
</script>
