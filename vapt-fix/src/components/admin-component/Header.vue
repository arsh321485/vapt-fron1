<template>
  <main>
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid">

        <router-link to="/home"><img src="@/assets/images/vaptfix_white.png" alt="logo" class="me-5"></router-link>
        <!-- <div class="browser-bar" style="height: 40px;">
        <img src="@/assets/images/logo-capital.png" alt="">
      </div>  -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <!-- Left nav links -->
          <ul class="navbar-nav me-auto gap-4">
            <li class="nav-item">
              <router-link to="/home" class="nav-link active text-white text-decoration-none" style="font-size: 1rem;"
                aria-current="page">
                Home
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" style="font-size: 1rem;" href="#">Features</a>
            </li>
            <li class="nav-item">
              <router-link to="/pricingplan" style="font-size: 1rem;" class="nav-link text-white text-decoration-none">
                Pricing
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link text-white" style="font-size: 1rem;" href="#">Partners</a>
            </li>
            <!-- <li class="nav-item">
              <router-link to="/vulnerabilityexplorer" style="font-size: 1rem;" class="nav-link text-white text-decoration-none">
                Vulnerability Explorer
              </router-link>
            </li> -->
            <!-- <li class="nav-item">
              <router-link to="/usersignup" class="nav-link text-white text-decoration-none">
                Dashboard screen
              </router-link>
            </li> -->

          </ul>


          <div class="header-cta d-flex align-items-center gap-3">
            <!-- Sign In with hover tooltip -->
            <div class="signin-hover-wrap">

              <button class="signin-trigger">
                <i class="bi bi-person me-1"></i> Sign In
                <i class="bi bi-chevron-down ms-1 signin-chevron"></i>
              </button>
              <!-- Hover card -->
              <div class="signin-tooltip">
                <div class="signin-tooltip-arrow"></div>
                <p class="signin-tooltip-label">Already have an account?</p>
                <p class="signin-tooltip-sub">Sign in to your VaptFix dashboard and continue where you left off.</p>
                <router-link to="/auth?mode=signin" class="signin-tooltip-btn">
                  Sign In to Dashboard
                  <i class="bi bi-arrow-right ms-2"></i>
                </router-link>
              </div>
            </div>

            <button type="button" class="btn hero-btn text-light" @click="handleFixNow">
              Get Started
              <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
            </button>
          </div>


          <!-- <div class="d-flex justify-content-start gap-2">
          
  <template v-if="!user">
    <router-link to="/signup" class="text-white text-decoration-none" tag="button">Signup /</router-link>
    <router-link to="/signin" class="text-white text-decoration-none" tag="button">Signin</router-link>
  </template>


<template v-else>
    <router-link to="/profile" class="text-center text-decoration-none d-flex flex-column align-items-center">
      <img 
        src="https://cdn-icons-png.flaticon.com/512/147/147144.png" 
        alt="Profile" 
        class="rounded-circle" 
        width="25" 
        height="25"
      />
      <p class="text-light mb-0" style="font-size: 14px;">
  {{ user.firstname }} {{ user.lastname }}
</p>
    </router-link>
  </template>
</div> -->

        </div>
      </div>
    </nav>
  </main>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      user: null,
    };
  },
  methods: {
    handleFixNow() {
      this.$router.push("/signup");
    }
  },
  mounted() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
  },
};
</script>


<style scoped>
.hero-btn {
  background-color: #5A44FF;
  border-radius: 999px;
  /* padding: 0.8rem 1.5rem; */
  padding: 4px 12px;
  color: #FFFFFF;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.hero-btn:hover {
  background-color: #4836d6;
  color: white;
}

/* ── Sign In hover wrap ── */
.signin-hover-wrap {
  position: relative;
}

.signin-trigger {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 5px 14px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.signin-trigger:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.55);
  color: #ffffff;
}

.signin-chevron {
  font-size: 10px;
  transition: transform 0.2s;
}

.signin-hover-wrap:hover .signin-chevron {
  transform: rotate(180deg);
}

/* Tooltip card — hidden by default */
.signin-tooltip {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 260px;
  background: #1e1b4b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 18px 20px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
  opacity: 0;
  pointer-events: none;
  transform: translateY(6px);
  transition: opacity 0.2s ease, transform 0.2s ease;
  z-index: 2000;
}

/* Arrow pointing up */
.signin-tooltip-arrow {
  position: absolute;
  top: -7px;
  right: 22px;
  width: 13px;
  height: 13px;
  background: #1e1b4b;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
  border-radius: 2px;
}

.signin-hover-wrap:hover .signin-tooltip {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.signin-tooltip-label {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
}

.signin-tooltip-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin-bottom: 14px;
}

.signin-tooltip-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 9px 16px;
  background: linear-gradient(135deg, #5A44FF, #7c3aed);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  text-decoration: none;
  transition: opacity 0.2s;
  box-shadow: 0 4px 14px rgba(90, 68, 255, 0.4);
}

.signin-tooltip-btn:hover {
  opacity: 0.88;
  color: #ffffff;
}
</style>
