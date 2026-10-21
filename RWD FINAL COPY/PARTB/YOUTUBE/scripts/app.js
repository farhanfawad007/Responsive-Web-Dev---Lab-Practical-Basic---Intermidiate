(() => {
  const SU = window.StorageUtil;
  const Data = window.VideoData;
  const CUSTOM_KEY = "customItems";

  const STATE_KEY = "state";

  function loadState() {
    return SU.get(STATE_KEY, { liked: {}, saved: {}, subscribed: {} });
  }

  function saveState(s) {
    SU.set(STATE_KEY, s);
  }

  function fmtViews(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
    if (n >= 1_000) return `${Math.round(n / 1_000)}K views`;
    return `${n} views`;
  }

  function removeCustomById(id) {
    if (!SU) return;
    const list = SU.get(CUSTOM_KEY, []) || [];
    const next = list.filter((v) => v.id !== id);
    SU.set(CUSTOM_KEY, next);
  }

  function cardHtml(v) {
    return `
      <article class="card">
        <a href="./watch.html?v=${encodeURIComponent(v.id)}" aria-label="${escapeHtml(v.title)}">
          <div class="thumb">
            <button type="button" class="remove-btn" data-remove-id="${v.id}" aria-label="Remove image">✕</button>
            <img src="${v.thumb || v.image}" alt="${escapeHtml(v.title)} thumbnail" loading="lazy" />
            <span class="duration">${v.duration}</span>
          </div>
          <div class="meta">
            <div class="avatar" aria-hidden="true"></div>
            <div>
              <h3 class="title">${escapeHtml(v.title)}</h3>
              <p class="sub">${escapeHtml(v.channel)}</p>
              <p class="sub">${fmtViews(v.views)} • ${escapeHtml(v.uploaded)}</p>
            </div>
          </div>
        </a>
      </article>
    `;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setActivePill(category) {
    document.querySelectorAll(".pill").forEach((b) => {
      const on = (b.getAttribute("data-category") || "All") === category;
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function init() {
    const grid = document.getElementById("videoGrid");
    const meta = document.getElementById("resultsMeta");
    const search = document.getElementById("searchInput");
    if (!grid || !meta) return;

    let category = "All";
    let query = "";
    let view = (location.hash || "").replace("#", "");

    // support incoming query from watch page
    const qParam = new URLSearchParams(location.search).get("q");
    if (qParam && search) {
      search.value = qParam;
      query = qParam;
    }

    function render() {
      const all = Data.getAllVideos();
      const state = loadState();

      const byView = (v) => {
        if (view === "liked") return !!state.liked[v.id];
        if (view === "saved") return !!state.saved[v.id];
        if (view === "subscriptions") return !!state.subscribed[v.channel];
        return true;
      };

      const filtered = all.filter((v) => {
        if (!byView(v)) return false;
        const byCategory = category === "All" ? true : v.category === category;
        const q = query.trim().toLowerCase();
        const byQuery =
          q === "" ? true : `${v.title} ${v.channel} ${v.category}`.toLowerCase().includes(q);
        return byCategory && byQuery;
      });

      meta.textContent =
        view
          ? `${filtered.length} in ${view}`
          : filtered.length === all.length
            ? `${all.length} items`
            : `${filtered.length} results (of ${all.length})`;

      if (!filtered.length) {
        grid.innerHTML = `
          <div class="panel" style="grid-column: 1 / -1; padding: 16px; color: var(--muted);">
            <b style="color: var(--text);">No images yet.</b>
            <div style="margin-top:6px;">Click <b>Add Images</b> to upload and show them here.</div>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(cardHtml).join("");
    }

    document.querySelectorAll(".pill").forEach((b) => {
      b.addEventListener("click", () => {
        category = b.getAttribute("data-category") || "All";
        setActivePill(category);
        render();
      });
    });

    if (search) {
      search.addEventListener("input", () => {
        query = search.value || "";
        render();
      });
    }

    // initialize state store (liked/saved/subscribed) so watch page can use it
    const s = loadState();
    saveState(s);

    window.addEventListener("hashchange", () => {
      view = (location.hash || "").replace("#", "");
      render();
    });

    grid.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-remove-id]");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const id = btn.getAttribute("data-remove-id");
      if (!id) return;
      removeCustomById(id);
      SU && SU.toast("Image removed.");
      render();
    });

    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

