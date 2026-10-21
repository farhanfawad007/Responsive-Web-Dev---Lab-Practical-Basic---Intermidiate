(() => {
  const CUSTOM_KEY = "customItems";
  // Start clean: only user-uploaded images are shown.
  const VIDEOS = [];

  function getAllVideos() {
    const custom = (window.StorageUtil ? window.StorageUtil.get(CUSTOM_KEY, []) : []) || [];
    return [...custom, ...VIDEOS];
  }

  function getVideoById(id) {
    const custom = (window.StorageUtil ? window.StorageUtil.get(CUSTOM_KEY, []) : []) || [];
    return [...custom, ...VIDEOS].find((v) => v.id === id) || null;
  }

  window.VideoData = { getAllVideos, getVideoById };
})();

