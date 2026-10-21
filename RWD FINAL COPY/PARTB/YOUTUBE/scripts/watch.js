(() => {
  const SU = window.StorageUtil;
  const Data = window.VideoData;

  const STATE_KEY = "state";

  function loadState() {
    return SU.get(STATE_KEY, { liked: {}, saved: {}, subscribed: {} });
  }
  function saveState(s) {
    SU.set(STATE_KEY, s);
  }

  function getParam(name) {
    return new URLSearchParams(location.search).get(name);
  }

  function fmtViews(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K views`;
    return `${n} views`;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function upNextItem(v) {
    return `
      <a class="card" href="./watch.html?v=${encodeURIComponent(v.id)}" style="display:flex; gap:10px;">
        <div class="thumb" style="width: 168px; aspect-ratio: 16/9; flex: 0 0 auto;">
          <img src="${v.thumb}" alt="${escapeHtml(v.title)} thumbnail" loading="lazy" />
          <span class="duration">${v.duration}</span>
        </div>
        <div style="padding-top:2px;">
          <div class="title" style="margin:0 0 4px 0;">${escapeHtml(v.title)}</div>
          <div class="sub">${escapeHtml(v.channel)}</div>
          <div class="sub">${fmtViews(v.views)} • ${escapeHtml(v.uploaded)}</div>
        </div>
      </a>
    `;
  }

  function init() {
    const id = getParam("v") || "v1";
    const v = Data.getVideoById(id) || Data.getAllVideos()[0];

    const viewer = document.getElementById("viewer");
    const title = document.getElementById("title");
    const channel = document.getElementById("channel");
    const stats = document.getElementById("stats");
    const desc = document.getElementById("desc");
    const editDescBtn = document.getElementById("editDescBtn");
    const upNext = document.getElementById("upNext");
    const likeBtn = document.getElementById("likeBtn");
    const saveBtn = document.getElementById("saveBtn");
    const subBtn = document.getElementById("subBtn");
    const search = document.getElementById("searchInput");

    if (viewer) {
      viewer.src = v.image;
      viewer.alt = `${v.title} poster`;
    }
    if (title) title.textContent = v.title;
    if (channel) channel.textContent = v.channel;
    if (stats) stats.textContent = `${fmtViews(v.views)} • ${v.uploaded}`;
    if (desc) desc.textContent = v.desc || "";

    const all = Data.getAllVideos().filter((x) => x.id !== v.id);
    const next = [...all].sort((a, b) => b.views - a.views).slice(0, 8);
    if (upNext) upNext.innerHTML = next.map(upNextItem).join("");

    const state = loadState();
    const liked = !!state.liked[v.id];
    const saved = !!state.saved[v.id];
    const subscribed = !!state.subscribed[v.channel];

    function refreshButtons() {
      likeBtn && (likeBtn.textContent = likedNow() ? "Liked" : "Like");
      saveBtn && (saveBtn.textContent = savedNow() ? "Saved" : "Save");
      if (subBtn) subBtn.textContent = subNow() ? "Subscribed" : "Subscribe";
      if (likeBtn) likeBtn.classList.toggle("active", likedNow());
      if (saveBtn) saveBtn.classList.toggle("active", savedNow());
      if (subBtn) subBtn.classList.toggle("active", subNow());
      if (subBtn) subBtn.classList.toggle("primary", !subNow());
    }

    function likedNow() {
      return !!state.liked[v.id];
    }
    function savedNow() {
      return !!state.saved[v.id];
    }
    function subNow() {
      return !!state.subscribed[v.channel];
    }

    // apply initial state (fallbacks if state was empty)
    if (liked) state.liked[v.id] = true;
    if (saved) state.saved[v.id] = true;
    if (subscribed) state.subscribed[v.channel] = true;
    saveState(state);
    refreshButtons();

    likeBtn?.addEventListener("click", () => {
      state.liked[v.id] = !likedNow();
      saveState(state);
      refreshButtons();
      SU.toast(state.liked[v.id] ? "Liked!" : "Unliked.");
    });

    saveBtn?.addEventListener("click", () => {
      state.saved[v.id] = !savedNow();
      saveState(state);
      refreshButtons();
      SU.toast(state.saved[v.id] ? "Saved to Library." : "Removed from Saved.");
    });

    subBtn?.addEventListener("click", () => {
      state.subscribed[v.channel] = !subNow();
      saveState(state);
      refreshButtons();
      SU.toast(state.subscribed[v.channel] ? `Subscribed to ${v.channel}.` : `Unsubscribed.`);
    });

    if (search) {
      search.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const q = (search.value || "").trim();
          location.href = `./index.html${q ? `?q=${encodeURIComponent(q)}` : ""}`;
        }
      });
    }

    // allow editing description for uploaded items (stored in customItems)
    editDescBtn?.addEventListener("click", () => {
      const current = desc?.textContent || "";
      const next = window.prompt("Enter description for this image:", current);
      if (next == null) return;

      // update in localStorage customItems
      const CUSTOM_KEY = "customItems";
      const list = SU.get(CUSTOM_KEY, []) || [];
      const idx = list.findIndex((x) => x.id === v.id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], desc: next };
        SU.set(CUSTOM_KEY, list);
      }

      if (desc) desc.textContent = next;
      SU.toast("Description updated.");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

