<template>
  <main class="webinar-thankyou-page">
    <Header />

    <section class="thankyou-section">
      <div class="thankyou-card">
        <div class="icon-wrap" :class="{ animate: playAnim }">
          <div class="icon-glow"></div>
          <div class="icon-circle">
            <svg class="check-svg" viewBox="0 0 52 52" aria-hidden="true">
              <circle class="check-circle" cx="26" cy="26" r="24" fill="none" />
              <path class="check-mark" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
            </svg>
          </div>
        </div>

        <span class="kicker" :class="{ show: playAnim }">Registration Confirmed</span>
        <h1 class="title" :class="{ show: playAnim }">Thank you for registering.</h1>
        <p class="desc" :class="{ show: playAnim }">
          You’re all set for the VaptFix webinar. A confirmation email with the joining details
          will be sent to your work email shortly.
        </p>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script>
import Header from "@/components/admin-component/Header.vue";
import Footer from "@/components/admin-component/Footer.vue";

export default {
  name: "WebinarThankYouView",
  components: { Header, Footer },
  data() {
    return {
      playAnim: false,
    };
  },
  mounted() {
    // Always open from top so checkmark + message are fully visible.
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Trigger entrance animation after mount so CSS transitions run cleanly.
    requestAnimationFrame(() => {
      this.playAnim = true;
    });
  },
};
</script>

<style scoped>
.webinar-thankyou-page {
  min-height: 100vh;
  background: #f8f9fc;
}

.thankyou-section {
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 16px 80px;
}

.thankyou-card {
  width: min(680px, 100%);
  background: #ffffff;
  border: 1px solid rgba(203, 196, 208, 0.28);
  border-radius: 28px;
  box-shadow: 0 18px 40px rgba(47, 72, 88, 0.08);
  padding: clamp(36px, 6vw, 56px) clamp(24px, 5vw, 48px);
  text-align: center;
}

.icon-wrap {
  position: relative;
  width: 110px;
  height: 110px;
  margin: 0 auto 26px;
  transform: scale(0.55);
  opacity: 0;
}

.icon-wrap.animate {
  animation: checkPop 0.7s cubic-bezier(0.22, 1.2, 0.36, 1) forwards;
}

.icon-glow {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: rgba(15, 105, 110, 0.22);
  filter: blur(18px);
  opacity: 0;
}

.icon-wrap.animate .icon-glow {
  animation: glowPulse 1.2s ease-out 0.15s forwards;
}

.icon-circle {
  position: relative;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(180deg, #0f696e 0%, #0a4e52 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 14px 32px rgba(15, 105, 110, 0.32);
}

.check-svg {
  width: 64px;
  height: 64px;
}

.check-circle {
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 2;
}

.check-mark {
  stroke: #ffffff;
  stroke-width: 4.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
}

.icon-wrap.animate .check-mark {
  animation: drawCheck 0.55s ease-out 0.28s forwards;
}

.kicker {
  display: inline-block;
  color: #0f696e;
  background: rgba(161, 236, 242, 0.45);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 14px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: 0.45s;
}

.title {
  margin: 0 0 12px;
  color: #241447;
  font-size: clamp(1.9rem, 4vw, 2.7rem);
  font-weight: 800;
  line-height: 1.2;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: 0.55s;
}

.desc {
  margin: 0 auto;
  max-width: 560px;
  color: #49454f;
  font-size: 15px;
  line-height: 1.7;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: 0.68s;
}

.kicker.show,
.title.show,
.desc.show {
  opacity: 1;
  transform: translateY(0);
}

@keyframes checkPop {
  0% {
    opacity: 0;
    transform: scale(0.45);
  }
  60% {
    opacity: 1;
    transform: scale(1.12);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes glowPulse {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
}

@keyframes drawCheck {
  to {
    stroke-dashoffset: 0;
  }
}

@media (max-width: 640px) {
  .thankyou-section {
    padding: 110px 14px 60px;
  }
}
</style>
