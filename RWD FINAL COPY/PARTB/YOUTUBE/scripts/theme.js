(() => {
  const { get, set } = window.StorageUtil || {};
  const THEME_KEY = "theme";

  function applyTheme(theme) {
    const t = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", t);
    if (set) set(THEME_KEY, t);
  }

  function initTheme() {
    const saved = get ? get(THEME_KEY, "dark") : "dark";
    applyTheme(saved);

    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") || "dark";
        applyTheme(current === "dark" ? "light" : "dark");
      });
    }
  }

  window.Theme = { initTheme, applyTheme };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initTheme);
  } else {
    initTheme();
  }
})();

