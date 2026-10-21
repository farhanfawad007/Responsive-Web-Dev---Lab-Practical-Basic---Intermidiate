(() => {
  const SU = window.StorageUtil;
  const CUSTOM_KEY = "customItems";

  function uid() {
    return `c_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }

  function loadCustom() {
    return SU.get(CUSTOM_KEY, []);
  }

  function saveCustom(items) {
    SU.set(CUSTOM_KEY, items);
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => reject(new Error("Failed to read file"));
      r.readAsDataURL(file);
    });
  }

  async function handleFiles(files) {
    const list = Array.from(files || []);
    if (!list.length) return;

    const existing = loadCustom();
    let added = 0;

    for (const f of list) {
      if (!f.type?.startsWith("image/")) continue;
      const dataUrl = await fileToDataUrl(f);
      existing.unshift({
        id: uid(),
        title: f.name.replace(/\.[^/.]+$/, ""),
        channel: "My Uploads",
        category: "My Uploads",
        views: 0,
        uploaded: "just now",
        duration: "Image",
        image: dataUrl,
        thumb: dataUrl,
        desc: "Uploaded image.",
      });
      added++;
    }

    saveCustom(existing);
    if (added) {
      SU.toast(`Added ${added} image${added === 1 ? "" : "s"}.`);
      // simplest: reload to re-render grid from merged data
      location.reload();
    }
  }

  function init() {
    const btn = document.getElementById("addImagesBtn");
    const clearBtn = document.getElementById("clearImagesBtn");
    const picker = document.getElementById("imagePicker");
    if (!btn || !picker) return;

    btn.addEventListener("click", () => picker.click());
    picker.addEventListener("change", async () => {
      try {
        await handleFiles(picker.files);
      } catch (e) {
        console.error("Upload error", e);
        SU.toast("Could not add images. Try a smaller file.");
      } finally {
        picker.value = "";
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        saveCustom([]);
        SU.toast("All images removed.");
        location.reload();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

