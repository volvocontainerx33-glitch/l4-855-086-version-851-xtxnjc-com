(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var navPanel = document.querySelector('[data-nav-panel]');

  if (menuButton && navPanel) {
    menuButton.addEventListener('click', function () {
      navPanel.classList.toggle('open');
    });
  }

  var backTop = document.querySelector('[data-back-top]');

  if (backTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 420) {
        backTop.classList.add('visible');
      } else {
        backTop.classList.remove('visible');
      }
    });

    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;
    var timer = null;

    function show(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);

    if (slides.length > 1) {
      start();
    }
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterGrid = document.querySelector('[data-filter-grid]');

  if (filterInput && filterGrid) {
    var items = Array.prototype.slice.call(filterGrid.querySelectorAll('[data-search-content]'));

    filterInput.addEventListener('input', function () {
      var query = filterInput.value.trim().toLowerCase();

      items.forEach(function (item) {
        var text = (item.getAttribute('data-search-content') || '').toLowerCase();
        item.classList.toggle('hidden-by-filter', query && text.indexOf(query) === -1);
      });
    });
  }

  var playerScroll = document.querySelector('[data-scroll-player]');

  if (playerScroll) {
    playerScroll.addEventListener('click', function (event) {
      event.preventDefault();
      var panel = document.querySelector('.player-panel');

      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
}());
