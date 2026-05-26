<template>
  <div class="automation-not-safe-block">
    <div class="ans-heading">⚠️ Why full automation is not safe for this finding</div>
    <div class="ans-warning-box">
      <div class="ans-warning-inner">
        <span class="ans-warning-icon" aria-hidden="true">⚠</span>
        <div class="ans-warning-body">
          <div class="ans-warning-title">Unknown device — risk of physical system failure</div>
          <p class="ans-warning-text">
            If the device is an OT/ICS controller managing physical infrastructure (HVAC, medical, industrial),
            automated network changes risk causing physical consequences. Automation is unsafe until the device is
            physically identified.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AutomationNotSafeBanner',
};
</script>

<style scoped>
.automation-not-safe-block {
  margin-bottom: 16px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.ans-heading {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #1e3a8a;
  margin-bottom: 10px;
}

.ans-warning-box {
  background: #fffbeb;
  border: 1px solid #fbbf24;
  border-radius: 10px;
  padding: 14px 16px;
}

.ans-warning-inner {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ans-warning-icon {
  flex-shrink: 0;
  font-size: 18px;
  line-height: 1.2;
  color: #d97706;
}

.ans-warning-title {
  font-size: 13px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-weight: 700;
  color: #92400e;
  margin-bottom: 6px;
}

.ans-warning-text {
  margin: 0;
  font-size: 12px;
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #78350f;
}
</style>
