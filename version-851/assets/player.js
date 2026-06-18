function setupMoviePlayer(options) {
  var video = document.querySelector(options.video);
  var button = document.querySelector(options.button);
  var cover = document.querySelector(options.cover);
  var error = document.querySelector(options.error);
  var ready = false;
  var hls = null;

  if (!video || !options.url) {
    return;
  }

  function bindStream() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = options.url;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(options.url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showError();
        }
      });
    } else {
      video.src = options.url;
    }
  }

  function showError() {
    if (error) {
      error.hidden = false;
    }
  }

  function playMovie() {
    bindStream();
    if (cover) {
      cover.classList.add("is-hidden");
    }
    var attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(function () {
        if (cover) {
          cover.classList.remove("is-hidden");
        }
      });
    }
  }

  if (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      playMovie();
    });
  }

  if (cover) {
    cover.addEventListener("click", playMovie);
  }

  video.addEventListener("click", function () {
    if (video.paused) {
      playMovie();
    } else {
      video.pause();
    }
  });

  video.addEventListener("error", showError);

  window.addEventListener("beforeunload", function () {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
}

window.setupMoviePlayer = setupMoviePlayer;
