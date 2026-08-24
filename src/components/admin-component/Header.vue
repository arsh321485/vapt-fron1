<template>
  <main>
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid">

        <router-link :to="appHomePath"><img src="@/assets/images/vaptfix_white.png" alt="logo" class="me-5"></router-link>
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
              <router-link :to="appHomePath" class="nav-link active text-white text-decoration-none" style="font-size: 1rem;"
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
              <router-link to="/knowledge-base" style="font-size: 1rem;" class="nav-link text-white text-decoration-none">
                Knowledge Base
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/how-vaptfix-works" style="font-size: 1rem;" class="nav-link text-white text-decoration-none">
                How VaptFix Works
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
            <template v-if="showProfileInHeader">
              <NotificationPanel :recipient-type="isTeamMember ? 'user' : 'admin'" />
              <div class="position-relative d-inline-block">
                <div
                  class="circle-bottom header-profile-circle d-flex align-items-center justify-content-center fw-bold"
                  style="cursor:pointer;"
                  @click="toggleDropdown"
                >
                  {{ userInitial }}
                </div>
                <div
                  v-if="showDropdown"
                  class="dropdown-box shadow-lg p-3 rounded"
                >
                  <div class="mb-2 text-muted text-center header-profile-email">
                    {{ userEmail }}
                  </div>

                  <template v-if="isTeamMember">
                    <router-link
                      :to="{ path: '/user-manage-account', query: { returnTo: $route.fullPath } }"
                      class="btn btn-sm btn-outline-secondary w-100 mb-2"
                      @click="showDropdown = false"
                    >
                      Manage Account
                    </router-link>
                  </template>
                  <template v-else>
                    <router-link
                      :to="{ path: '/admin-upload-report', query: { returnTo: $route.fullPath } }"
                      class="btn btn-sm btn-outline-primary w-100 mb-2"
                      @click="showDropdown = false"
                    >
                      Upload Scope
                    </router-link>
                    <router-link
                      :to="{ path: '/riskcriteria', query: { returnTo: $route.fullPath } }"
                      class="btn btn-sm btn-outline-primary w-100 mb-2"
                      @click="showDropdown = false"
                    >
                      Update Risk Criteria
                    </router-link>
                  </template>

                  <router-link
                    to="/pricingplan"
                    class="btn btn-sm btn-outline-dark w-100 mb-2"
                    @click="showDropdown = false"
                  >
                    Upgrade Plan
                  </router-link>
                  <button class="btn btn-sm btn-danger w-100" @click="handleLogout">
                    Logout
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <button type="button" class="btn hero-btn text-light text-decoration-none" @click="openAdminSignUpModal">
               Get Started
                <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
              </button>
              <button type="button" class="btn signup-modal-btn text-light text-decoration-none" @click="openSignUpModal">
                Sign In
                <i class="bi bi-arrow-right-circle-fill fs-5 ms-1"></i>
              </button>
            </template>
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
      :adminInitialTab="signUpAdminInitialTab"
      :setPasswordUidb64="setPasswordUidb64"
      :setPasswordToken="setPasswordToken"
      :setPasswordEmail="setPasswordEmail"
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
import NotificationPanel from '@/components/admin-component/NotificationPanel.vue';
import { useAuthStore } from '@/stores/authStore';
import Swal from 'sweetalert2';
import {
  applyAdminSetPasswordModalState,
  applySetPasswordModalState,
  clearStoredAdminSetPasswordDeepLink,
  clearStoredSetPasswordDeepLink,
  extractAdminSetPasswordFromRoute,
  isAdminSetPasswordDeepLink,
  isAdminSetPasswordPath,
  isUserSetPasswordDeepLink,
  readStoredSetPasswordDeepLink,
  storeAdminSetPasswordDeepLink,
} from '@/utils/userSetPasswordDeepLink';
import { getAuthenticatedAppHome } from '@/utils/authenticatedHome';

function readStoredUser() {
  try {
    const raw = sessionStorage.getItem('user') || localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function hasAuthToken() {
  const token = sessionStorage.getItem('authorization') || localStorage.getItem('authorization');
  return !!(token && token !== 'null' && token !== 'undefined');
}

export default {
  name: 'Header',
  components: {
    SignUpModal,
    AdminSignUpModal,
    NotificationPanel,
  },
  data() {
    return {
      user: null,
      hasSession: false,
      showDropdown: false,
      userEmail: '',
      userInitial: '',
      showSignUpModal: false,
      signUpPreSelectedType: '',
      signUpUserInitialTab: '',
      signUpAdminInitialTab: '',
      setPasswordUidb64: '',
      setPasswordToken: '',
      setPasswordEmail: '',
      showAdminSignUpModal: false
    };
  },
  computed: {
    isTeamMember() {
      return !!(this.user && Array.isArray(this.user.Member_role));
    },
    isPublicHomePage() {
      const path = this.$route?.path || '';
      return path === '/' || path === '/home';
    },
    showProfileInHeader() {
      return this.hasSession && !this.isPublicHomePage;
    },
    appHomePath() {
      if (this.isPublicHomePage) return '/home';
      return getAuthenticatedAppHome(this.$route?.path || '/home');
    },
  },
  watch: {
    $route: {
      handler() {
        this.applyUserSetPasswordDeepLink();
      },
      immediate: true
    }
  },
  methods: {
    /**
     * Set password deep-link → User Sign In modal → Set Password tab.
     * Canonical: /home?signin=user&tab=setPassword&uidb64=...&token=...
     * Also: email action=set-password, Slack/Teams ?platform=slack|teams, uid+token only.
     */
    applyUserSetPasswordDeepLink() {
      const path = this.$route.path || '';
      const q = this.$route.query || {};
      const pick = (v) => {
        if (v === undefined || v === null) return '';
        return (Array.isArray(v) ? v[0] : v).toString().trim();
      };

      // Admin-only: /set-password/{uid}/{token} or /reset-password/{uid}/{token}
      const fromAdminPath = extractAdminSetPasswordFromRoute(this.$route);
      if (isAdminSetPasswordPath(path) && fromAdminPath?.uidb64 && fromAdminPath?.token) {
        storeAdminSetPasswordDeepLink(fromAdminPath);
        this.signUpPreSelectedType = 'admin';
        this.signUpAdminInitialTab = 'setPassword';
        this.setPasswordUidb64 = fromAdminPath.uidb64;
        this.setPasswordToken = fromAdminPath.token;
        this.setPasswordEmail = fromAdminPath.email || '';
        this.$nextTick(() => {
          this.showSignUpModal = true;
        });
        return;
      }

      if (path !== '/home') return;

      const signin = pick(q.signin);
      const tabVal = pick(q.tab);
      const tabRaw = tabVal.toLowerCase();

      if (signin === 'admin' && (tabRaw === 'signin' || tabRaw === 'sign-in' || tabVal === 'signIn')) {
        this.signUpPreSelectedType = 'admin';
        this.signUpAdminInitialTab = 'signIn';
        this.showSignUpModal = true;
        this.$nextTick(() => {
          this.$router.replace({ path: '/home' });
        });
        return;
      }

      if (isAdminSetPasswordDeepLink(q)) {
        applyAdminSetPasswordModalState(this, q);
        this.$nextTick(() => {
          this.$router.replace({ path: '/home' });
        });
        return;
      }

      const isSignInTab =
        signin === 'user' && (tabRaw === 'signin' || tabRaw === 'sign-in' || tabVal === 'signIn');
      if (isSignInTab) {
        this.signUpPreSelectedType = 'user';
        this.signUpUserInitialTab = 'signIn';
        this.showSignUpModal = true;
        this.$nextTick(() => {
          this.$router.replace({ path: '/home' });
        });
        return;
      }

      if (!isUserSetPasswordDeepLink(q)) {
        if (readStoredSetPasswordDeepLink()) {
          applySetPasswordModalState(this, q);
        }
        return;
      }

      if (applySetPasswordModalState(this, q)) {
        this.$nextTick(() => {
          this.$router.replace({ path: '/home' });
        });
      }
    },
    openSignUpModal() {
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.signUpAdminInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
      this.setPasswordEmail = '';
      this.showSignUpModal = true;
    },
    closeSignUpModal() {
      this.showSignUpModal = false;
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.signUpAdminInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
      this.setPasswordEmail = '';
      clearStoredSetPasswordDeepLink();
      clearStoredAdminSetPasswordDeepLink();
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
      this.setPasswordEmail = '';
      this.showSignUpModal = true;
    },
    handleOpenSignInFromAdminSignUp() {
      this.closeAdminSignUpModal();
      this.signUpPreSelectedType = '';
      this.signUpUserInitialTab = '';
      this.setPasswordUidb64 = '';
      this.setPasswordToken = '';
      this.setPasswordEmail = '';
      this.showSignUpModal = true;
    },
    handleOpenAdminSignUpFromSignIn() {
      this.closeSignUpModal();
      this.showAdminSignUpModal = true;
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    setUserData(user) {
      if (!user) return;
      this.user = user;
      this.userEmail = user.email || '';
      const nameSource =
        user.first_name ||
        user.firstname ||
        user.full_name ||
        user.name ||
        user.email ||
        '';
      this.userInitial = nameSource.trim().charAt(0).toUpperCase() || 'U';
    },
    async loadUserData() {
      this.hasSession = hasAuthToken();
      if (!this.hasSession) {
        this.user = null;
        this.userEmail = '';
        this.userInitial = '';
        this.showDropdown = false;
        return;
      }

      const authStore = useAuthStore();
      const storedUser = authStore.user || readStoredUser();
      if (storedUser) this.setUserData(storedUser);

      const isMember = !!(storedUser && Array.isArray(storedUser.Member_role));
      if (isMember) {
        const response = await authStore.getMemberProfile();
        if (response.status && response.data?.user) {
          this.setUserData(response.data.user);
        }
        return;
      }

      const response = await authStore.getUserProfile();
      if (response.status && response.data?.user) {
        this.setUserData(response.data.user);
      }
    },
    async handleLogout() {
      const authStore = useAuthStore();
      const response = await authStore.logout();
      sessionStorage.removeItem('authenticatedTabId');
      this.hasSession = false;
      this.user = null;
      this.userEmail = '';
      this.userInitial = '';
      this.showDropdown = false;

      if (response.status) {
        Swal.fire({
          icon: 'success',
          title: 'Logged out',
          text: 'You have been logged out successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.$router.replace('/home');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Logout Failed',
          text: response.message || 'Something went wrong!',
          timer: 3000,
          showConfirmButton: false,
        });
      }
    },
    handleClickOutside(e) {
      if (
        !e.target.closest('.header-profile-circle') &&
        !e.target.closest('.dropdown-box')
      ) {
        this.showDropdown = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
    this.loadUserData();
    this.applyUserSetPasswordDeepLink();
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
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

.header-cta .dropdown-box {
  position: absolute;
  right: 0;
  top: calc(100% + 10px);
  background: #fff;
  min-width: 220px;
  z-index: 1050;
}

.header-profile-email {
  font-size: 0.8rem;
  word-break: break-all;
}

.header-cta :deep(.nav-menu) {
  color: #ffffff;
}
</style>
