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
          <div class="col-11 pt-2 pb-4 px-4 toolbox-view-shell">
            <ToolboxPageContent />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardMenu from '@/components/user-component/DashboardMenu.vue';
import DashboardHeader from '@/components/user-component/DashboardHeader.vue';
import ToolboxPageContent from '@/components/toolbox/ToolboxPageContent.vue';

export default {
  name: 'UserToolboxView',
  components: {
    DashboardMenu,
    DashboardHeader,
    ToolboxPageContent,
  },
};
</script>

<style scoped>
.toolbox-view-shell {
  background: #f8f9fc;
  min-height: calc(100vh - 52px);
}
</style>
