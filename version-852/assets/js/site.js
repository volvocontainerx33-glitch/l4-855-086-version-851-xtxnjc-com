(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  var backTop = document.querySelector("[data-back-top]");

  if (backTop) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 320) {
        backTop.classList.add("is-visible");
      } else {
        backTop.classList.remove("is-visible");
      }
    });

    backTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  var slider = document.querySelector("[data-hero-slider]");

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function startSlider() {
      stopSlider();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopSlider() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startSlider();
      });
    });

    slider.addEventListener("mouseenter", stopSlider);
    slider.addEventListener("mouseleave", startSlider);

    startSlider();
  }

  var input = document.querySelector("[data-search-input]");
  var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
  var empty = document.querySelector("[data-empty-result]");
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll("[data-filter-button]"));
  var currentFilter = "全部";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function applyQueryFromUrl() {
    if (!input) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");

    if (query) {
      input.value = query;
    }
  }

  function matchType(card) {
    if (currentFilter === "全部") {
      return true;
    }

    return normalize(card.getAttribute("data-type")).indexOf(normalize(currentFilter)) !== -1;
  }

  function filterCards() {
    if (!cards.length) {
      return;
    }

    var query = input ? normalize(input.value) : "";
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize([
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-keywords"),
        card.textContent
      ].join(" "));

      var matched = (!query || haystack.indexOf(query) !== -1) && matchType(card);
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
    applyQueryFromUrl();
    input.addEventListener("input", filterCards);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      currentFilter = button.getAttribute("data-filter-value") || "全部";

      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
      });

      filterCards();
    });
  });

  filterCards();
})();
