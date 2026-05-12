<template>
  <div class="legal-page-root">
    <Header />

    <div class="legal-page-frame">
      <div class="ld-simple-inner">
        <div class="ld-doc-header">
          <div class="ld-doc-tag">Legal Document</div>
          <h1 class="ld-doc-title">{{ pageTitle }}</h1>
          <p class="ld-doc-meta">
            <strong>Status:</strong> Draft &nbsp;|&nbsp; Content will be published here soon.
          </p>
        </div>

        <div class="ld-callout">
          <p>
            This page is reserved for <strong>{{ pageTitle }}</strong> documentation. Full text will be added in a
            follow-up update.
          </p>
        </div>

        <LegalDocInnerFooter />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/admin-component/Header.vue';
import LegalDocInnerFooter from '@/components/admin-component/LegalDocInnerFooter.vue';

export default {
  name: 'LegalDocumentView',
  components: { Header, LegalDocInnerFooter },
  props: {
    pageTitle: {
      type: String,
      required: true,
    },
  },
  mounted() {
    document.documentElement.classList.add('legal-doc-sticky-context');
  },
  beforeUnmount() {
    document.documentElement.classList.remove('legal-doc-sticky-context');
  },
};
</script>

<style scoped>
.legal-page-root {
  min-height: 100vh;
  padding-top: 72px;
  padding-bottom: 24px;
  padding-left: clamp(10px, 3vw, 24px);
  padding-right: clamp(10px, 3vw, 24px);
  background: #e8ecf1;
  box-sizing: border-box;
}

.legal-page-frame {
  width: 100%;
  max-width: 1080px;
  margin-left: auto;
  margin-right: auto;
  padding-left: clamp(20px, 4vw, 40px);
  padding-right: clamp(20px, 4vw, 40px);
  padding-bottom: 2rem;
  box-sizing: border-box;
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  border-radius: 12px;
  border: 1px solid rgba(36, 20, 71, 0.06);
  box-shadow: 0 4px 24px rgba(36, 20, 71, 0.06);
  min-height: calc(100vh - 72px - 24px);
}

.ld-simple-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 3.25rem 0 0;
}

.ld-doc-header {
  position: sticky;
  top: 72px;
  z-index: 1020;
  margin-bottom: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(15, 105, 110, 0.15);
  background-color: #ffffff;
  background-image: radial-gradient(#ebe6f3 1px, #ffffff 1px);
  background-size: 20px 20px;
  box-shadow: 0 8px 16px -8px rgba(36, 20, 71, 0.08);
}

.ld-simple-inner > .ld-callout,
.ld-simple-inner > .legal-doc-inner-footer {
  position: relative;
  z-index: 1;
}

.ld-doc-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: #0f696e;
  background: rgba(15, 105, 110, 0.1);
  border: 1px solid rgba(15, 105, 110, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 1rem;
  text-transform: uppercase;
}

.ld-doc-tag::before {
  content: '●';
  font-size: 7px;
}

.ld-doc-title {
  font-family: 'Inter', sans-serif;
  font-size: clamp(2rem, 4vw, 3.4rem);
  font-weight: 800;
  color: #241447;
  line-height: 1.15;
  margin-bottom: 0.75rem;
}

.ld-doc-meta {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  color: #49454f;
  line-height: 1.6;
}

.ld-doc-meta strong {
  color: #241447;
  font-weight: 600;
}

.ld-callout {
  background: #f6f4fa;
  border: 1px solid rgba(36, 20, 71, 0.08);
  border-left: 3px solid #0f696e;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 2rem;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.65;
}

.ld-callout p {
  margin: 0;
  color: #49454f;
  line-height: 1.65;
}

@media (min-width: 769px) {
  .legal-page-root {
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .legal-page-frame {
    flex: 1 1 auto;
    min-height: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .ld-simple-inner {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  .ld-doc-header {
    top: 0;
  }
}

@media (max-width: 768px) {
  .legal-page-root {
    height: auto;
    overflow: visible;
    display: block;
  }

  .legal-page-frame {
    flex: none;
    overflow: visible;
    display: block;
  }

  .ld-simple-inner {
    flex: none;
    overflow: visible;
  }
}
</style>
