(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  ready(function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (navToggle && mobileNav) {
      navToggle.addEventListener("click", function () {
        mobileNav.classList.toggle("open");
      });
    }

    var backTop = document.querySelector("[data-back-top]");

    if (backTop) {
      window.addEventListener("scroll", function () {
        if (window.scrollY > 320) {
          backTop.classList.add("show");
        } else {
          backTop.classList.remove("show");
        }
      });

      backTop.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    var filterInput = document.querySelector("[data-filter-input]");
    var movieCards = Array.prototype.slice.call(
      document.querySelectorAll("[data-movie-card]"),
    );

    if (filterInput && movieCards.length) {
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";

      if (query) {
        filterInput.value = query;
      }

      var applyFilter = function () {
        var value = filterInput.value.trim().toLowerCase();

        movieCards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
          ]
            .join(" ")
            .toLowerCase();

          if (!value || haystack.indexOf(value) !== -1) {
            card.classList.remove("is-hidden");
          } else {
            card.classList.add("is-hidden");
          }
        });
      };

      filterInput.addEventListener("input", applyFilter);
      applyFilter();
    }

    var hero = document.querySelector("[data-hero-slider]");

    if (hero) {
      var slides = Array.prototype.slice.call(
        hero.querySelectorAll("[data-hero-slide]"),
      );
      var dots = Array.prototype.slice.call(
        hero.querySelectorAll("[data-hero-dot]"),
      );
      var prev = hero.querySelector("[data-hero-prev]");
      var next = hero.querySelector("[data-hero-next]");
      var index = 0;
      var timer = null;

      var show = function (nextIndex) {
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
      };

      var start = function () {
        if (timer || slides.length < 2) {
          return;
        }

        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      };

      var stop = function () {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      };

      if (prev) {
        prev.addEventListener("click", function () {
          show(index - 1);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(index + 1);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
      show(0);
      start();
    }
  });
})();
