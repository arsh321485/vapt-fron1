<template>
    <main>
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      
    <div class="row overflow-hidden w-100">
      <!-- Left Form Section --> 
      <div class="col-lg-6 col-md-12 px-5 pt-4 pb-4 form-section">
        <img src="@/assets/images/logo-capital.png" alt="" class="mb-4" style="height: 40px;">
        <h1 class="form-heading mb-2">Get started now</h1>
        <p class="form-subheading mb-4">You’re invited to join VAPTfix by Amit Gopal.</p>

        <button class="btn btn-outline-dark rounded-pill mb-2 mb-md-0 mb-lg-0 w-100"><img src="@/assets/images/google-icon.png" style="height: 23px;width: 23px;margin-top: -1px;"/> Login with Google</button>

        <!-- <div class="mb-3 d-lg-flex d-md-flex gap-2">
          <button class="btn btn-google mb-2 mb-md-0 mb-lg-0 w-100"><img src="@/assets/images/google-icon.png" style="height: 23px;width: 23px;margin-top: -1px;"/> Login with Google</button>
          <button class="btn btn-microsoft w-100"><img src="@/assets/images/microsoft-icon.png" style="height: 23px;width: 23px;margin-top: -1px;"/> Login with Microsoft</button>
        </div> -->
        <div class="d-flex align-items-center mt-3">
                      <hr class="flex-grow-1">
                      <span class="mx-2 text-muted">or</span>
                      <hr class="flex-grow-1">
                    </div>

        <form class="">
          <div class="mb-4 mt-2">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" placeholder="Enter your email">
          </div>
          <div class="mb-4 mt-4">
            <label class="form-label">Your password</label>
            <input type="password" class="form-control" placeholder="Pick a password">
          </div>
          <div class="mb-4 mt-4">
            <label class="form-label">Confirm password</label>
            <input type="password" class="form-control" placeholder="confirm password">
          </div>

          <div style="padding:10px;border:1px solid #ccc;border-radius:4px;
            width:300px;display:flex;align-items:center;justify-content:space-between;">
  
            <!-- Left side: tick box -->
            <div style="display:flex;align-items:center;gap:10px;">
              <input type="checkbox" id="captcha-check" style="width:20px;height:20px;cursor:pointer;">
              <label for="captcha-check" style="cursor:pointer;">I'm not a robot</label>
            </div>

            <!-- Right side: fake recaptcha logo -->
            <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" 
                alt="recaptcha" style="height:30px;">
            </div>

        <router-link to="/userdashboard">
          <button type="submit" class="btn btn-vaptfix w-100 py-2 mt-3">Signup for vaptfix <i class="bi bi-arrow-right-circle-fill"></i></button></router-link>
        </form>
        
      </div>

      <!-- Right Image Section -->
      <div class="col-lg-6 image-section d-none d-lg-block pt-5">
        <img src="@/assets/images/signup.jpg" alt="" class="mt-5" style="width: 455px;height: 500px;border-radius: 15px;">
      </div>
    </div>
  </div>

    </main>
</template>

<script>

import Vue3Select from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';

export default {
  name: 'UserSignupView',
  components: {
    Vue3Select
  }
};
</script>
