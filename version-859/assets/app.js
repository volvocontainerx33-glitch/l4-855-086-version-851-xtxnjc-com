(function () {
  var navButton = document.querySelector('[data-nav-toggle]');
  var navMenu = document.querySelector('[data-nav-menu]');

  if (navButton && navMenu) {
    navButton.addEventListener('click', function () {
      navMenu.classList.toggle('is-open');
    });
  }

  function setupFilters() {
    var panel = document.querySelector('[data-filter-panel]');
    var list = document.querySelector('[data-card-list]');

    if (!panel || !list) {
      return;
    }

    var input = panel.querySelector('[data-filter-input]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var typeSelect = panel.querySelector('[data-filter-type]');
    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';

    if (input && initial) {
      input.value = initial;
    }

    function apply() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';
      var cards = list.querySelectorAll('.movie-card');

      cards.forEach(function (card) {
        var text = card.getAttribute('data-search') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var cardType = card.getAttribute('data-type') || '';
        var ok = true;

        if (q && text.indexOf(q) === -1) {
          ok = false;
        }

        if (year && cardYear !== year) {
          ok = false;
        }

        if (type && cardType !== type) {
          ok = false;
        }

        card.classList.toggle('is-filtered-out', !ok);
      });
    }

    if (input) {
      input.addEventListener('input', apply);
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', apply);
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', apply);
    }

    apply();
  }

  function preparePlayer(video) {
    if (!video || video.dataset.ready === '1') {
      return;
    }

    var stream = video.getAttribute('data-stream');

    if (!stream) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream;
    } else if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: false });
      hls.loadSource(stream);
      hls.attachMedia(video);
      video._hls = hls;
    } else {
      video.src = stream;
    }

    video.dataset.ready = '1';
  }

  function setupPlayers() {
    var videos = document.querySelectorAll('video.movie-player');

    videos.forEach(function (video) {
      var button = document.querySelector('[data-play="' + video.id + '"]');

      function start() {
        preparePlayer(video);
        video.play().catch(function () {});

        if (button) {
          button.classList.add('is-hidden');
        }
      }

      if (button) {
        button.addEventListener('click', start);
      }

      video.addEventListener('click', function () {
        if (video.dataset.ready !== '1') {
          start();
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupFilters();
    setupPlayers();
  });
})();
