(function () {
  var player = document.querySelector("[data-player]");

  if (!player) {
    return;
  }

  var video = player.querySelector("video");
  var button = player.querySelector("[data-play-button]");
  var hls = null;
  var started = false;

  function loadSource() {
    if (!video || started) {
      return;
    }

    started = true;

    var source = video.getAttribute("data-src");

    if (!source) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    player.classList.add("player-loaded");

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {
        video.controls = true;
      });
    }
  }

  if (button) {
    button.addEventListener("click", loadSource);
  }

  if (video) {
    video.addEventListener("click", function () {
      if (!started) {
        loadSource();
      }
    });
  }

  window.addEventListener("beforeunload", function () {
    if (hls) {
      hls.destroy();
    }
  });
})();
