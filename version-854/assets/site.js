(function () {
    function ready(fn) {
        if (document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(function () {
        var toggle = document.querySelector("[data-menu-toggle]");
        var panel = document.querySelector("[data-menu-panel]");
        if (toggle && panel) {
            toggle.addEventListener("click", function () {
                panel.classList.toggle("open");
            });
        }

        var backTop = document.createElement("button");
        backTop.className = "back-top";
        backTop.type = "button";
        backTop.textContent = "↑";
        document.body.appendChild(backTop);
        backTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        window.addEventListener("scroll", function () {
            if (window.scrollY > 420) {
                backTop.classList.add("show");
            } else {
                backTop.classList.remove("show");
            }
        });

        setupHero();
        setupSearch();
        setupPlayers();
    });

    function setupHero() {
        var carousel = document.querySelector("[data-hero-carousel]");
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
        var current = 0;
        var timer = null;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === current);
            });
        }
        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }
        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });
        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function setupSearch() {
        var input = document.querySelector("[data-search-input]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
        if (!input || cards.length === 0) {
            return;
        }
        function apply(value) {
            var term = (value || input.value || "").trim().toLowerCase();
            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-tags"),
                    card.textContent
                ].join(" ").toLowerCase();
                card.style.display = haystack.indexOf(term) > -1 ? "" : "none";
            });
        }
        input.addEventListener("input", function () {
            apply(input.value);
            buttons.forEach(function (button) {
                button.classList.remove("active");
            });
        });
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                var term = button.getAttribute("data-filter") || "";
                input.value = term;
                buttons.forEach(function (btn) {
                    btn.classList.toggle("active", btn === button);
                });
                apply(term);
            });
        });

        var heroSearch = document.querySelector("[data-hero-search]");
        if (heroSearch) {
            heroSearch.addEventListener("submit", function (event) {
                event.preventDefault();
                var keyword = heroSearch.querySelector("input").value.trim();
                if (keyword) {
                    window.location.href = "./all.html?q=" + encodeURIComponent(keyword);
                } else {
                    window.location.href = "./all.html";
                }
            });
        }

        var query = new URLSearchParams(window.location.search).get("q");
        if (query) {
            input.value = query;
            apply(query);
        }
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var overlay = player.querySelector(".player-overlay");
            var stream = player.getAttribute("data-stream");
            var started = false;
            var hls = null;
            if (!video || !stream) {
                return;
            }
            function load() {
                if (started) {
                    video.play().catch(function () {});
                    return;
                }
                started = true;
                if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
                if (overlay) {
                    overlay.classList.add("hidden");
                }
                video.controls = true;
                video.play().catch(function () {});
            }
            if (overlay) {
                overlay.addEventListener("click", load);
            }
            video.addEventListener("click", function () {
                if (!started) {
                    load();
                }
            });
            window.addEventListener("pagehide", function () {
                if (hls) {
                    hls.destroy();
                    hls = null;
                }
            });
        });
    }
})();
