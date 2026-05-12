<template>
  <div class="legal-doc-inner-footer">
    <p class="legal-doc-inner-copy">© 2026 VaptFix.ai. All rights reserved.</p>
    <p class="legal-doc-inner-links mb-0">
      <router-link to="/privacy">Privacy</router-link>
      <span class="legal-doc-inner-sep">·</span>
      <router-link to="/terms">Terms</router-link>
      <span class="legal-doc-inner-sep">·</span>
      <router-link to="/security">Security</router-link>
      <span class="legal-doc-inner-sep">·</span>
      <router-link to="/dpa">DPA</router-link>
      <span class="legal-doc-inner-sep">·</span>
      <router-link to="/support">Support</router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'LegalDocInnerFooter',
};
</script>

<style scoped>
.legal-doc-inner-footer {
  margin-top: 4rem;
  padding-top: 2rem;
  padding-bottom: 0.5rem;
  border-top: 1px solid rgba(15, 105, 110, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.legal-doc-inner-copy {
  font-size: 13px;
  color: #64748b;
  margin: 0;
}

.legal-doc-inner-links {
  font-size: 13px;
  color: #64748b;
}

.legal-doc-inner-links a {
  color: #0f696e;
  text-decoration: none;
  font-weight: 500;
}

.legal-doc-inner-links a:hover {
  text-decoration: underline;
}

.legal-doc-inner-sep {
  margin: 0 0.35rem;
  color: #cbd5e1;
}
</style>
