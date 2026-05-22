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
