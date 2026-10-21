(() => {
  const PREFIX = "ytclone:";

  function key(k) {
    return `${PREFIX}${k}`;
  }

  function get(k, fallback = null) {
    try {
      const raw = localStorage.getItem(key(k));
      return raw == null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function set(k, v) {
    try {
      localStorage.setItem(key(k), JSON.stringify(v));
    } catch (e) {
      console.error("Storage error", e);
      toast("Browser storage is full or image is too large.");
    }
  }

  function del(k) {
    localStorage.removeItem(key(k));
  }

  function toast(msg, timeoutMs = 2200) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.remove("hidden");
    window.clearTimeout(toast._t);
    toast._t = window.setTimeout(() => el.classList.add("hidden"), timeoutMs);
  }

  window.StorageUtil = { get, set, del, toast };
})();

