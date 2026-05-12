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
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle text-white text-decoration-none"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style="font-size: 1rem;"
              >
                Partners
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li>
                  <router-link class="dropdown-item" to="/partner">
                    Partner Registration
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/partner-lead-portal">
                    Lead Registration
                  </router-link>
                </li>
              </ul>
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
            <!-- <button type="button" class="signin-btn text-decoration-none" @click="openSignInModal('user')">
              <i class="bi bi-person me-1"></i> User Sign In
            </button>

            <button type="button" class="btn hero-btn text-light text-decoration-none" @click="openSignInModal('admin')">
             Admin Sign In
              <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
            </button> -->

            <button type="button" class="btn hero-btn text-light text-decoration-none" @click="openAdminSignUpModal">
             Get Started
              <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
            </button>

            <button type="button" class="btn signup-modal-btn text-light text-decoration-none" @click="openSignUpModal">
              Sign In
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

    <!-- Sign In Modal -->
    <SignUpModal
      :show="showSignUpModal"
      :preSelectedType="signUpPreSelectedType"
      :userInitialTab="signUpUserInitialTab"
      :setPasswordUidb64="setPasswordUidb64"
      :setPasswordToken="setPasswordToken"
      @close="closeSignUpModal"
      @open-signin="handleOpenSignInFromSignUp"
      @open-admin-signup="handleOpenAdminSignUpFromSignIn"
    />

    <!-- Admin Sign Up Modal -->
    <AdminSignUpModal
      :show="showAdminSignUpModal"
      @close="closeAdminSignUpModal"
      @open-signin="handleOpenSignInFromAdminSignUp"
    />

  </main>
</template>

<script>
import SignUpModal from './SignUpModal.vue';
import AdminSignUpModal from './AdminSignUpModal.vue';

export default {
  name: 'Header',
  components: {
    SignUpModal,
    AdminSignUpModal
  },
  data() {
    return {
      user: null,
      showSignUpModal: false,
      signUpPreSelectedType: '',
      signUpUserInitialTab: '',
      setPasswordUidb64: '',
      setPasswordToken: '',
      showAdminSignUpModal: false
    };
  },
  watch: {
    $route: {
      handler() {
        this.applyUserSetPasswordDeepLink();
      },
      immediate: false
    }
  },
  methods: {
    /**
     * Email "Set password" opens: /home → User Sign In modal → Set Password tab.
     * Supported URLs:
     * - Backend: /home?action=set-password&uid=...&token=...
     * - Legacy:   /home?signin=user&tab=set-password&uidb64=...&token=... (uid / setPassword tab variants ok)
     */
    applyUserSetPasswordDeepLink() {
      if (this.$route.path !== '/home') return;
      const q = this.$route.query || {};
      const pick = (v) => {
        if (v === undefined || v === null) return '';
        return (Array.isArray(v) ? v[0] : v).toString().trim();
      };
      const token = pick(q.token);
      const uid = pick(q.uidb64) || pick(q.uid);

      const actionRaw = pick(q.action).toLowerCase();
      const backendSetPassword = actionRaw === 'set-password' || actionRaw === 'setpassword';

      const tabVal = pick(q.tab);
      const tabRaw = tabVal.toLowerCase();
      const signin = pick(q.signin);
      const legacyTab =
        signin === 'user' && (tabRaw === 'set-password' || tabVal === 'setPassword');

      if (!token || !uid) return;
      if (!backendSetPassword && !legacyTab) return;

      this.signUpPreSelectedType = 'user';
      this.signUpUserInitialTab = 'setPassword';
      this.setPasswordUidb64 = uid;
      this.setPasswordToken = token;
      this.showSignUpModal = true;
      this.$nextTick(() => {
        this.$router.replace({ path: '/home' });
      });
    },
    openSignUpModal() {
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
      this.showSignUpModal = true;
    },
    closeSignUpModal() {
      this.showSignUpModal = false;
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
    },
    openAdminSignUpModal() {
      this.showAdminSignUpModal = true;
    },
    closeAdminSignUpModal() {
      this.showAdminSignUpModal = false;
    },
    handleOpenSignInFromSignUp() {
      this.closeSignUpModal();
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
      this.showSignUpModal = true;
    },
    handleOpenSignInFromAdminSignUp() {
      this.closeAdminSignUpModal();
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
      this.showSignUpModal = true;
    },
    handleOpenAdminSignUpFromSignIn() {
      this.closeSignUpModal();
      this.showAdminSignUpModal = true;
    }
  },
  mounted() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      this.user = JSON.parse(savedUser);
    }
    this.applyUserSetPasswordDeepLink();
  },
};
</script>


<style scoped>
.navbar {
  background-color: #241447 !important;
}

.navbar img[alt="logo"] {
  height: 34px;
  width: auto;
  max-width: 150px;
  object-fit: contain;
  object-position: left center;
}

/* ── Partners dropdown to match website theme ── */
.dropdown-menu {
  background: rgba(18, 10, 38, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 14px;
  padding: 8px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 10px 12px;
}

.dropdown-item:hover,
.dropdown-item:focus {
  background: rgba(15, 105, 110, 0.22);
  color: #ffffff;
}

.dropdown-item:active {
  background: rgba(15, 105, 110, 0.35);
  color: #ffffff;
}

.hero-btn {
  background-color: #0f696e;
  border-radius: 999px;
  /* padding: 0.8rem 1.5rem; */
  padding: 4px 12px;
  color: #ffffff;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.hero-btn:hover {
  background-color: #0a4e52;
  color: white;
}

/* ── User Sign In button ── */
.signin-btn {
  background: transparent;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 5px 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.signin-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.55);
  color: #ffffff;
}

/* ── Sign Up Modal Button ── */
.signup-modal-btn {
  background-color: #0f696e;
  border: none;
  border-radius: 999px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 400;
  padding: 4px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.signup-modal-btn:hover {
  background-color: #0a4e52;
  color: #ffffff;
}
</style>
