<template>
  <div class="container py-5">
    <div class="text-center mb-5">
      <h2 class="fw-semibold">Create Your Account</h2>
      <p class="text-muted">Select How You Would Like To Proceed By Choosing Your Role.</p>
    </div>

    <div class="row justify-content-center g-4">

      <!-- Admin -->
      <div class="col-md-4">
        <div class="account-card admin-card">
          <h4 class="card-title">ADMIN</h4>

          <div class="inner-card">
            Access Comprehensive Controls To View System Activity, Track Progress, And Stay Informed With Real-Time Insights.
          </div>

          <button class="btn signup-btn admin-btn" @click="goAdmin">
            Sign up as Admin
          </button>
        </div>
      </div>

      <!-- User -->
      <div class="col-md-4">
        <div class="account-card user-card">
          <h4 class="card-title">USER</h4>

          <div class="inner-card">
            Efficiently Manage Assets And Perform Scans With Ease.
          </div>

          <button class="btn signup-btn user-btn" @click="goUser">
            Sign up as User
          </button>
        </div>
      </div>

    </div>
  </div>
</template>




<script>
export default {
    name: "ChooseAccount",
    methods: {
        goAdmin() {
            this.$router.push("/signup");
        },
        goUser() {
            this.$router.push("/usersignup");
        }
    }
};
</script>

<style scoped>
.account-card {
  border-radius: 20px;
  padding: 28px;
  min-height: 280px;               /* ⬅ reduced height */
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Titles */
.card-title {
  color: #fff;
  font-weight: 600;
}

/* Inner description */
.inner-card {
  background: rgba(255, 255, 255, 0.15); /* translucent */
  color: #fff;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin: 10px 0 18px;
}

/* Admin card */
.admin-card {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
}

/* User card */
.user-card {
  background: linear-gradient(135deg, #059669, #10b981);
}

/* Button base */
.signup-btn {
  width: 70%;
  margin: 0 auto;
  padding: 10px 0;
  font-weight: 600;
  border-radius: 10px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.signup-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Admin button */
.admin-btn {
  background: #312e81;
}

.admin-btn:hover {
  background: #1e1b4b;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

/* User button */
.user-btn {
  background: #065f46;
}

.user-btn:hover {
  background: #064e3b;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
</style>

