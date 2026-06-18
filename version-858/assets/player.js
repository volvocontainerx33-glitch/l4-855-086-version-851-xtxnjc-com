(function () {
  window.initMoviePlayer = function (videoId, buttonId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(buttonId);
    var loaded = false;
    var hlsInstance = null;

    if (!video || !overlay || !source) {
      return;
    }

    function loadSource() {
      if (loaded) {
        return;
      }
      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function startPlayback() {
      loadSource();
      overlay.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var promise = video.play();
      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    overlay.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
      if (!loaded) {
        startPlayback();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
