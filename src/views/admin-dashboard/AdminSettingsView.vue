<template>
  <main>
    <section>
      <div class="container-fluid px-0">
        <div class="row gx-0 no-gutters">
          <DashboardHeader />
        </div>
        <div class="row">
          <div class="col-12 p-0 settings-view-wrap">
            <SettingsPanel mode="admin" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import DashboardHeader from '@/components/admin-component/DashboardHeader.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';

export default {
  name: 'AdminSettingsView',
  components: { DashboardHeader, SettingsPanel },
};
</script>

<style scoped>
.settings-view-wrap {
  background: #f8f9fc;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}
</style>
