import Swal from "sweetalert2";

const FLAG = "vaptfix_post_login_success";
const MSG_KEY = "vaptfix_post_login_success_msg";

/** Call right before navigating away from the login screen after a successful login. */
export function markPostLoginSuccess(message?: string) {
  sessionStorage.setItem(FLAG, "1");
  if (message && message.trim()) {
    sessionStorage.setItem(MSG_KEY, message.trim());
  } else {
    sessionStorage.removeItem(MSG_KEY);
  }
}

/**
 * Shows centered success SweetAlert (auto-dismiss, no OK button) once the new route is active.
 * Invoked from `router.afterEach`.
 */
export function tryShowPostLoginSuccessAlert() {
  if (sessionStorage.getItem(FLAG) !== "1") return;

  sessionStorage.removeItem(FLAG);
  const text =
    sessionStorage.getItem(MSG_KEY) ||
    "Welcome to your dashboard.";
  sessionStorage.removeItem(MSG_KEY);

  // Let the destination route render one frame before overlaying the modal.
  requestAnimationFrame(() => {
    setTimeout(() => {
      void Swal.fire({
        icon: "success",
        title: "Login successfully",
        text,
        timer: 2800,
        showConfirmButton: false,
        timerProgressBar: true,
        allowOutsideClick: true,
      });
    }, 0);
  });
}
