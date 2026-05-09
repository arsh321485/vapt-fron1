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
              <i class="bi bi-person-plus-fill me-1"></i> Sign In
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
      showAdminSignUpModal: false
    };
  },
  methods: {
    openSignUpModal() {
      this.signUpPreSelectedType = '';
      this.showSignUpModal = true;
    },
    closeSignUpModal() {
      this.showSignUpModal = false;
      this.signUpPreSelectedType = '';
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
      this.showSignUpModal = true;
    },
    handleOpenSignInFromAdminSignUp() {
      this.closeAdminSignUpModal();
      this.signUpPreSelectedType = '';
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
  },
};
</script>


<style scoped>
.navbar {
  background-color: #241447 !important;
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
  color: #FFFFFF;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
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
  background: linear-gradient(135deg, #0f696e 0%, #0a5458 100%);
  border: none;
  border-radius: 999px;
  color: #FFFFFF;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 6px 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(15, 105, 110, 0.25);
}

.signup-modal-btn:hover {
  background: linear-gradient(135deg, #0a5458 0%, #083f43 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(15, 105, 110, 0.35);
  color: #FFFFFF;
}

.signup-modal-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(15, 105, 110, 0.2);
}
</style>
