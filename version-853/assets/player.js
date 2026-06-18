(function () {
  function bindMoviePlayer(videoUrl) {
    var video = document.querySelector(".movie-video");
    var cover = document.querySelector(".player-cover");
    var hls = null;
    var loaded = false;

    if (!video || !videoUrl) {
      return;
    }

    function attachSource() {
      if (loaded) {
        return;
      }

      loaded = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true });
        hls.loadSource(videoUrl);
        hls.attachMedia(video);
      } else {
        video.src = videoUrl;
      }
    }

    function hideCover() {
      if (cover) {
        cover.classList.add("is-hidden");
        cover.setAttribute("aria-hidden", "true");
      }
    }

    function showCover() {
      if (cover) {
        cover.classList.remove("is-hidden");
        cover.removeAttribute("aria-hidden");
      }
    }

    function playMovie() {
      attachSource();
      hideCover();

      var promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(function () {
          showCover();
        });
      }
    }

    if (cover) {
      cover.addEventListener("click", playMovie);
    }

    video.addEventListener("click", function () {
      if (!loaded || video.paused) {
        playMovie();
      }
    });

    video.addEventListener("play", hideCover);
    video.addEventListener("error", function () {
      if (hls) {
        hls.destroy();
        hls = null;
      }
    });
  }

  window.bindMoviePlayer = bindMoviePlayer;
})();
