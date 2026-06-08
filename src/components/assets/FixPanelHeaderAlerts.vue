<template>
  <div class="fix-panel-header-alerts">
    <PythonInstallReminderAlert
      :visible="pythonVisible"
      :delay-ms="1500"
      @close="$emit('close-python')"
      @open-guide="$emit('open-python-guide')"
    />
    <VaptfixVerifiedAlert
      :visible="verifiedVisible"
      :delay-ms="1850"
      @close="$emit('close-verified')"
    />
  </div>
</template>

<script>
import PythonInstallReminderAlert from '@/components/assets/PythonInstallReminderAlert.vue';
import VaptfixVerifiedAlert from '@/components/assets/VaptfixVerifiedAlert.vue';

export default {
  name: 'FixPanelHeaderAlerts',
  components: {
    PythonInstallReminderAlert,
    VaptfixVerifiedAlert,
  },
  props: {
    pythonVisible: { type: Boolean, default: false },
    verifiedVisible: { type: Boolean, default: false },
  },
  emits: ['close-python', 'close-verified', 'open-python-guide'],
};
</script>

<style scoped>
.fix-panel-header-alerts {
  position: absolute;
  top: 4px;
  right: 18px;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  max-width: min(300px, calc(100% - 36px));
  pointer-events: none;
  overflow: visible;
}

.fix-panel-header-alerts :deep(.panel-header-alert) {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  pointer-events: auto;
}

@media (max-width: 900px) {
  .fix-panel-header-alerts {
    right: 12px;
    max-width: calc(100% - 24px);
  }
}
</style>
