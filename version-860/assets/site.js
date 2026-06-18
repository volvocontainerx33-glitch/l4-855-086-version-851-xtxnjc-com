(function () {
    const navToggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", function () {
            const open = mobileNav.classList.toggle("open");
            navToggle.setAttribute("aria-expanded", String(open));
        });
    }

    document.querySelectorAll("[data-hero-slider]").forEach(function (slider) {
        const slides = Array.from(slider.querySelectorAll(".hero-slide"));
        const dots = Array.from(slider.querySelectorAll("[data-hero-dot]"));
        const previous = slider.querySelector("[data-hero-prev]");
        const next = slider.querySelector("[data-hero-next]");
        let current = 0;
        let timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, itemIndex) {
                slide.classList.toggle("active", itemIndex === current);
            });
            dots.forEach(function (dot, itemIndex) {
                dot.classList.toggle("active", itemIndex === current);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5500);
        }

        if (previous) {
            previous.addEventListener("click", function () {
                show(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });

        show(0);
        restart();
    });

    document.querySelectorAll("[data-filter-root]").forEach(function (root) {
        const input = root.querySelector("[data-filter-input]");
        const chips = Array.from(root.querySelectorAll("[data-filter-term]"));
        const items = Array.from(root.querySelectorAll(".movie-item"));
        const empty = root.querySelector("[data-filter-empty]");
        let term = "";

        function apply() {
            const query = input ? input.value.trim().toLowerCase() : "";
            let visible = 0;

            items.forEach(function (item) {
                const text = (item.getAttribute("data-filter-text") || item.textContent || "").toLowerCase();
                const matchedQuery = !query || text.indexOf(query) !== -1;
                const matchedTerm = !term || text.indexOf(term.toLowerCase()) !== -1;
                const matched = matchedQuery && matchedTerm;
                item.hidden = !matched;
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
                chips.forEach(function (button) {
                    button.classList.remove("active");
                });
                chip.classList.add("active");
                term = chip.getAttribute("data-filter-term") || "";
                apply();
            });
        });
    });

    document.querySelectorAll(".player-shell").forEach(function (shell) {
        const video = shell.querySelector("video");
        const overlay = shell.querySelector(".player-start");
        const url = shell.getAttribute("data-play");
        let loaded = false;
        let hls = null;

        function start() {
            if (!video || !url) {
                return;
            }

            if (!loaded) {
                loaded = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = url;
                    video.load();
                    video.play().catch(function () {});
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().catch(function () {});
                    });
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal && hls) {
                            hls.destroy();
                            hls = null;
                            video.src = url;
                            video.load();
                            video.play().catch(function () {});
                        }
                    });
                } else {
                    video.src = url;
                    video.load();
                    video.play().catch(function () {});
                }
            } else if (video.paused) {
                video.play().catch(function () {});
            }

            if (overlay) {
                overlay.classList.add("hidden");
            }
        }

        if (overlay) {
            overlay.addEventListener("click", start);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (!loaded || video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                if (overlay) {
                    overlay.classList.add("hidden");
                }
            });
        }
    });
})();
