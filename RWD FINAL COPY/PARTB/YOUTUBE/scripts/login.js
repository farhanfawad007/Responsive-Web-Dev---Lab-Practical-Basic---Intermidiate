(() => {
  const SU = window.StorageUtil;
  const Auth = window.Auth;

  function init() {
    const form = document.getElementById("loginForm");
    const fillDemo = document.getElementById("fillDemo");
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    if (fillDemo && email && password) {
      fillDemo.addEventListener("click", () => {
        email.value = Auth.DEMO_EMAIL;
        password.value = Auth.DEMO_PASSWORD;
        SU.toast("Filled demo credentials.");
      });
    }

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const res = Auth.login(email?.value, password?.value);
        if (!res.ok) {
          SU.toast(res.message || "Login failed.");
          return;
        }
        SU.toast("Welcome!");
        location.replace("./index.html");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

