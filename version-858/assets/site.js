(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var menuButton = document.getElementById("menu-button");
    var mobileNav = document.getElementById("mobile-nav");

    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var searchForm = document.getElementById("global-search-form");
    var searchInput = document.getElementById("global-search-input");

    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var query = searchInput.value.trim();
        var target = "search.html";
        if (query) {
          target += "?q=" + encodeURIComponent(query);
        }
        window.location.href = target;
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;

    function setSlide(index) {
      if (!slides.length) {
        return;
      }
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === activeIndex);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === activeIndex);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        setSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        setSlide(activeIndex + 1);
      }, 6200);
    }

    var localSearch = document.getElementById("local-search");
    var yearFilter = document.getElementById("year-filter");
    var typeFilter = document.getElementById("type-filter");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
    var empty = document.getElementById("no-results");

    function filterCards() {
      var q = localSearch ? localSearch.value.trim().toLowerCase() : "";
      var year = yearFilter ? yearFilter.value : "";
      var type = typeFilter ? typeFilter.value : "";
      var shown = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-year"),
          card.getAttribute("data-type"),
          card.getAttribute("data-genre"),
          card.getAttribute("data-region")
        ].join(" ").toLowerCase();
        var ok = true;

        if (q && text.indexOf(q) === -1) {
          ok = false;
        }
        if (year && card.getAttribute("data-year") !== year) {
          ok = false;
        }
        if (type && card.getAttribute("data-type") !== type) {
          ok = false;
        }

        card.style.display = ok ? "" : "none";
        if (ok) {
          shown += 1;
        }
      });

      if (empty) {
        empty.style.display = shown ? "none" : "block";
      }
    }

    [localSearch, yearFilter, typeFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", filterCards);
        control.addEventListener("change", filterCards);
      }
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");
    if (q && localSearch) {
      localSearch.value = q;
      filterCards();
    }
  });
})();
