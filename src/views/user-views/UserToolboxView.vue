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
          <div class="col-11 vr-content">
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
.vr-content {
  background: #f8f9fc;
  min-height: 100vh;
  padding: 40px 20px 20px 16px;
  margin-top: 60px;
}
</style>
