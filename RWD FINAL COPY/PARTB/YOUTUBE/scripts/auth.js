(() => {
  const DEMO_EMAIL = "farhanfawad@gmail.com";
  const DEMO_PASSWORD = "1234567";
  const SESSION_KEY = "session";

  const SU = window.StorageUtil;

  function getSession() {
    return SU.get(SESSION_KEY, null);
  }

  function isAuthed() {
    const s = getSession();
    return !!(s && s.email === DEMO_EMAIL && s.ok === true);
  }

  function login(email, password) {
    const ok = String(email || "").trim().toLowerCase() === DEMO_EMAIL && String(password || "") === DEMO_PASSWORD;
    if (!ok) return { ok: false, message: "Invalid demo credentials." };
    SU.set(SESSION_KEY, { ok: true, email: DEMO_EMAIL, ts: Date.now() });
    return { ok: true };
  }

  function logout() {
    SU.del(SESSION_KEY);
  }

  function requireAuth() {
    const page = (location.pathname.split("/").pop() || "").toLowerCase();
    const onLogin = page === "login.html" || page === "" || page === "login";
    if (onLogin) return;
    if (!isAuthed()) {
      location.replace("./login.html");
    }
  }

  function wireLogoutButton() {
    const btn = document.getElementById("logoutBtn");
    if (!btn) return;
    btn.addEventListener("click", () => {
      logout();
      SU.toast("Logged out.");
      location.replace("./login.html");
    });
  }

  window.Auth = { DEMO_EMAIL, DEMO_PASSWORD, login, logout, isAuthed, requireAuth, wireLogoutButton };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      requireAuth();
      wireLogoutButton();
    });
  } else {
    requireAuth();
    wireLogoutButton();
  }
})();

