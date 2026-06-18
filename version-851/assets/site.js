(function () {
  var nav = document.querySelector(".site-nav");
  var toggle = document.querySelector(".menu-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var opened = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", opened ? "true" : "false");
    });
  }

  document.querySelectorAll("img.poster-img").forEach(function (image) {
    image.addEventListener("error", function () {
      image.classList.add("is-missing");
      image.removeAttribute("src");
    });
  });

  var carousel = document.querySelector("[data-hero-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(next) {
      current = (next + slides.length) % slides.length;
      slides.forEach(function (slide, index) {
        slide.classList.toggle("is-active", index === current);
      });
      dots.forEach(function (dot, index) {
        dot.classList.toggle("is-active", index === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    }
  }

  var input = document.querySelector("[data-search-input]");
  if (input) {
    var scope = document.querySelector("[data-search-scope]") || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-movie-card]"));

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute("data-search") || card.textContent || "").toLowerCase();
        card.classList.toggle("is-hidden", query.length > 0 && text.indexOf(query) === -1);
      });
    });
  }

  var topButton = document.querySelector(".back-to-top");
  if (topButton) {
    window.addEventListener("scroll", function () {
      topButton.classList.toggle("is-visible", window.scrollY > 360);
    });
    topButton.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
