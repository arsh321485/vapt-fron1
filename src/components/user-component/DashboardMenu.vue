<template>
  <main>
    <div class=" d-flex mt-5">
    <div class="sidebar d-flex flex-column align-items-center pt-4">
      
      <div class="flex-grow-1 d-flex flex-column align-items-center text-center mb-3 gap-2">
         <div>
          <router-link to="/userdashboard">
          <button class="btn border-0" :class="{ activeBtn: isActive('/userdashboard') }"><i class="bi bi-house-door nav-menu"></i>
          <p class="menu-heading">Home</p></button>
          </router-link>
         </div>

         <div>
          <router-link to="/userVulnerabilityregister">
          <button class="btn border-0" :class="{ activeBtn: isActive('/userVulnerabilityregister') }"><i class="bi bi-list-ul nav-menu"></i>
          <p class="menu-heading">Register</p></button>
          </router-link>
         </div>

        <div>
          <router-link to="/userassets">
          <button class="btn border-0" :class="{ activeBtn: isActive('/userassets') }">
          <i class="bi bi-laptop nav-menu"></i>
          <p class="menu-heading">Assets</p></button>
          </router-link>
        </div>

         <div>
          <router-link to="/userexception">
          <button class="btn border-0" :class="{ activeBtn: isActive('/userexception') }">
          <i class="bi bi-exclamation-circle nav-menu"></i>
          <p class="menu-heading">Support Requests</p></button>
          </router-link>
        </div>

        <div>
          <router-link to="/fixedvulnerabilities">
          <button class="btn border-0" :class="{ activeBtn: isActive('/fixedvulnerabilities') }">
          <i class="bi bi-check-circle nav-menu"></i>
          <p class="menu-heading">Fixed</p>
          </button>
          </router-link>
        </div>

        <div>
          <router-link to="/pendingvulnerabilities">
          <button class="btn border-0" :class="{ activeBtn: isActive('/pendingvulnerabilities') }">
           <i class="bi bi-dash-circle-dotted nav-menu"></i>
          <p class="menu-heading">Pending</p></button>
          </router-link>
        </div>

        <div>
          <router-link to="/user-tickets">
          <button class="btn border-0" :class="{ activeBtn: isActive('/user-tickets') }">
           <i class="bi bi-question-circle nav-menu"></i>
          <p class="menu-heading">Tickets</p></button>
          </router-link>
        </div>
      </div>
      
    </div>

    
    </div>
  </main>
</template>

<script>
import { useRoute } from "vue-router";
export default {
  name: 'DashboardMenu',
  setup() {
    const route = useRoute();
    const isActive = (path) => route.path === path;

    return { route, isActive };
  },
  data() {
    return {
      showMenu: false
    }
  },
  methods: {
     toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    confirmLogout() {
      Swal.fire({
        title: "Are you sure?",
        text: "You want to logout!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, logout",
        cancelButtonText: "No, stay"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$router.push("/home"); 
        }
      });
    }
  }
};
</script>

<style scoped>
.dropdown-box {
  position: absolute;
  bottom: 40px;   /* move it above "A" */
  right: -25px;        /* align with "A" horizontally */
  background: #dad9d9;
  border-radius: 6px;
  padding: 4px;
  min-width: 90px;
  z-index: 1050;   /* keep it above text */
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>