(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  ready(function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var navMenu = document.querySelector("[data-nav-menu]");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", function () {
        navMenu.classList.toggle("open");
      });
    }

    initializeHero();
    initializeFilters();
    initializePlayers();
  });

  function initializeHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    start();
  }

  function initializeFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));

    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-search-input]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));
      var empty = scope.querySelector("[data-empty-state]");
      var chips = Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]"));
      var grid = scope.querySelector("[data-results-grid]");
      var viewButtons = Array.prototype.slice.call(scope.querySelectorAll("[data-view]"));
      var activeFilter = "全部";

      function cardText(card) {
        return normalize([
          card.getAttribute("data-title"),
          card.getAttribute("data-region"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-category"),
          card.textContent
        ].join(" "));
      }

      function apply() {
        var keyword = normalize(input ? input.value : "");
        var filter = normalize(activeFilter);
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = cardText(card);
          var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
          var filterMatched = filter === "全部" || !filter || haystack.indexOf(filter) !== -1;
          var matched = keywordMatched && filterMatched;

          card.hidden = !matched;

          if (matched) {
            visible += 1;
          }
        });

        if (empty) {
          empty.hidden = visible !== 0;
        }
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          activeFilter = chip.getAttribute("data-filter-value") || "全部";
          chips.forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
          apply();
        });
      });

      viewButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var view = button.getAttribute("data-view");
          viewButtons.forEach(function (item) {
            item.classList.toggle("active", item === button);
          });
          if (grid) {
            grid.classList.toggle("list-mode", view === "list");
          }
        });
      });

      apply();
    });
  }

  function initializePlayers() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-player-button]"));
    var videos = Array.prototype.slice.call(document.querySelectorAll("video[data-src]"));

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var targetId = button.getAttribute("data-player-target");
        var video = targetId ? document.getElementById(targetId) : button.closest(".player-wrap").querySelector("video[data-src]");
        playVideo(video);
      });
    });

    videos.forEach(function (video) {
      video.addEventListener("play", function () {
        var wrap = video.closest(".player-wrap");
        if (wrap) {
          wrap.classList.add("is-playing");
        }
      });

      video.addEventListener("click", function () {
        if (!video.dataset.ready) {
          playVideo(video);
        }
      });
    });
  }

  function playVideo(video) {
    if (!video) {
      return;
    }

    var src = video.getAttribute("data-src");
    var wrap = video.closest(".player-wrap");

    if (!src) {
      return;
    }

    if (wrap) {
      wrap.classList.add("is-playing");
    }

    if (!video.dataset.ready) {
      setupVideoSource(video, src);
      video.dataset.ready = "true";
    }

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(function () {});
    }
  }

  function setupVideoSource(video, src) {
    var isHls = src.indexOf(".m3u8") !== -1;

    if (isHls && window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(src);
      hls.attachMedia(video);
      video._hlsInstance = hls;
      return;
    }

    if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    video.src = src;
  }
})();
