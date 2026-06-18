(function () {
  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  }

  function initMenu() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('#site-nav');
    if (!toggle || !nav) {
      return;
    }
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      document.body.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        nav.classList.remove('is-open');
        document.body.classList.remove('menu-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function initHeroSlider() {
    document.querySelectorAll('[data-hero-slider]').forEach(function (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
      var prev = slider.querySelector('[data-hero-prev]');
      var next = slider.querySelector('[data-hero-next]');
      var index = 0;
      var timer = null;
      if (!slides.length) {
        return;
      }
      function setActive(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle('is-active', slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle('is-active', dotIndex === index);
        });
      }
      function move(step) {
        setActive(index + step);
      }
      function start() {
        stop();
        timer = window.setInterval(function () {
          move(1);
        }, 5600);
      }
      function stop() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }
      if (prev) {
        prev.addEventListener('click', function () {
          move(-1);
          start();
        });
      }
      if (next) {
        next.addEventListener('click', function () {
          move(1);
          start();
        });
      }
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          setActive(Number(dot.getAttribute('data-hero-dot') || 0));
          start();
        });
      });
      slider.addEventListener('mouseenter', stop);
      slider.addEventListener('mouseleave', start);
      setActive(0);
      start();
    });
  }

  function initCatalogs() {
    document.querySelectorAll('[data-catalog]').forEach(function (catalog) {
      var input = catalog.querySelector('.site-search-input');
      var cards = Array.prototype.slice.call(catalog.querySelectorAll('.movie-card, .ranking-row, .category-overview-card'));
      var chips = Array.prototype.slice.call(catalog.querySelectorAll('[data-filter-key]'));
      var reset = catalog.querySelector('[data-filter-reset]');
      var empty = catalog.querySelector('.no-results');
      var filters = {};
      function normalized(value) {
        return String(value || '').toLowerCase().trim();
      }
      function apply() {
        var query = normalized(input ? input.value : '');
        var visible = 0;
        cards.forEach(function (card) {
          var searchText = normalized(card.getAttribute('data-search'));
          var matchesQuery = !query || searchText.indexOf(query) !== -1;
          var matchesFilters = Object.keys(filters).every(function (key) {
            return !filters[key] || card.getAttribute('data-' + key) === filters[key];
          });
          var show = matchesQuery && matchesFilters;
          card.hidden = !show;
          if (show) {
            visible += 1;
          }
        });
        if (empty) {
          empty.hidden = visible !== 0;
        }
      }
      if (input) {
        input.addEventListener('input', apply);
      }
      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var key = chip.getAttribute('data-filter-key');
          var value = chip.getAttribute('data-filter-value');
          filters[key] = filters[key] === value ? '' : value;
          chips.forEach(function (item) {
            if (item.getAttribute('data-filter-key') === key) {
              item.classList.toggle('active', item === chip && filters[key] === value);
            }
          });
          if (reset) {
            reset.classList.toggle('active', Object.keys(filters).every(function (filterKey) {
              return !filters[filterKey];
            }));
          }
          apply();
        });
      });
      if (reset) {
        reset.addEventListener('click', function () {
          filters = {};
          chips.forEach(function (chip) {
            chip.classList.remove('active');
          });
          reset.classList.add('active');
          apply();
        });
      }
      apply();
    });
  }

  function initPlayers() {
    document.querySelectorAll('[data-video-player]').forEach(function (player) {
      var video = player.querySelector('video');
      var overlay = player.querySelector('[data-play-overlay]');
      var source = player.getAttribute('data-src');
      var hls = null;
      if (!video || !source) {
        return;
      }
      function bindSource() {
        if (hls || video.getAttribute('src')) {
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(source);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = source;
        } else {
          video.src = source;
        }
      }
      function playVideo() {
        bindSource();
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {
            if (overlay) {
              overlay.classList.remove('is-hidden');
            }
          });
        }
      }
      bindSource();
      if (overlay) {
        overlay.addEventListener('click', playVideo);
      }
      video.addEventListener('play', function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      });
      video.addEventListener('ended', function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
      video.addEventListener('click', function () {
        if (video.paused) {
          playVideo();
        }
      });
      window.addEventListener('pagehide', function () {
        if (hls) {
          hls.destroy();
          hls = null;
        }
      });
    });
  }

  function initBackToTop() {
    var button = document.querySelector('.back-to-top');
    if (!button) {
      return;
    }
    function update() {
      button.classList.toggle('is-visible', window.scrollY > 360);
    }
    button.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  ready(function () {
    initMenu();
    initHeroSlider();
    initCatalogs();
    initPlayers();
    initBackToTop();
  });
})();
