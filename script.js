
    /* =====================================================
       MOBILE MENU
    ====================================================== */

    const mobileMenu =
      document.getElementById(
        "mobileMenu"
      );


    const navLinks =
      document.getElementById(
        "navLinks"
      );


    mobileMenu.addEventListener(
      "click",
      () => {

        navLinks.classList.toggle(
          "open"
        );

      }
    );


    document
      .querySelectorAll(
        ".nav-links a"
      )
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            navLinks.classList.remove(
              "open"
            );

          }
        );

      });



    /* =====================================================
       ENGINE TABS
    ====================================================== */

    const tabButtons =
      document.querySelectorAll(
        ".tab-button"
      );


    const tabContents =
      document.querySelectorAll(
        ".tab-content"
      );


    tabButtons.forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const target =
            button.dataset.tab;


          tabButtons.forEach(btn => {

            btn.classList.remove(
              "active"
            );

          });


          tabContents.forEach(content => {

            content.classList.remove(
              "active"
            );

          });


          button.classList.add(
            "active"
          );


          document
            .getElementById(target)
            .classList.add("active");

        }
      );

    });



    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    const revealElements =
      document.querySelectorAll(
        ".reveal"
      );


    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add("visible");

            } else {

              entry.target.classList.remove("visible");

            }

          });

        },
        {
          threshold: 0.12
        }
      );


    revealElements.forEach(
      element => {

        revealObserver.observe(
          element
        );

      }
    );


    /* =====================================================
       BINARY RAIN
    ====================================================== */

    (function () {

      const reduceMotion =
        window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

      if (reduceMotion) return;

      const FONT_SIZE = 15;
      const HEAD_COLOR = "#ffe2a3";
      const TRAIL_COLOR = "#f5b544";

      function startRain(canvas) {

        const ctx = canvas.getContext("2d");
        let columns = [];
        let width = 0;
        let height = 0;

        function resize() {

          const dpr = window.devicePixelRatio || 1;

          width = canvas.clientWidth;
          height = canvas.clientHeight;

          canvas.width = width * dpr;
          canvas.height = height * dpr;

          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.font =
            FONT_SIZE + "px monospace";
          ctx.textBaseline = "top";

          const count =
            Math.max(
              1,
              Math.floor(width / FONT_SIZE)
            );

          columns = Array.from(
            { length: count },
            () => ({
              y: Math.random() * -height,
              speed: 0.6 + Math.random() * 1.4
            })
          );

        }

        resize();
        window.addEventListener("resize", resize);

        let last = 0;

        function frame(now) {

          requestAnimationFrame(frame);

          if (now - last < 45) return;
          last = now;

          if (canvas.offsetParent === null &&
              getComputedStyle(canvas).display === "none") return;

          ctx.globalCompositeOperation =
            "destination-out";
          ctx.fillStyle =
            "rgba(0,0,0,0.12)";
          ctx.fillRect(0, 0, width, height);

          ctx.globalCompositeOperation =
            "source-over";

          columns.forEach((col, i) => {

            const x = i * FONT_SIZE;
            const char =
              Math.random() > 0.5 ? "1" : "0";

            ctx.fillStyle = TRAIL_COLOR;
            ctx.fillText(
              char,
              x,
              col.y - FONT_SIZE
            );

            ctx.fillStyle = HEAD_COLOR;
            ctx.fillText(char, x, col.y);

            col.y += FONT_SIZE * col.speed;

            if (
              col.y > height &&
              Math.random() > 0.96
            ) {
              col.y = -FONT_SIZE * 2;
              col.speed =
                0.6 + Math.random() * 1.4;
            }

          });

        }

        requestAnimationFrame(frame);

      }

      document
        .querySelectorAll(".binary-rain")
        .forEach(startRain);

    })();


    /* =====================================================
       HEX GRID
    ====================================================== */

    (function () {

      const grid = document.getElementById("hexGrid");

      if (!grid) return;

      const LOCK =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

      const t = (name, icon) => ({ name, icon });

      /* ring 0 = center, then outward. null = locked hexagon */

      const rings = [
        [t("C++", "cplusplus")],
        [
          t("Unity", "unity"),
          t("C#", "csharp"),
          t("Unreal", "unrealengine"),
          t("OpenGL", "opengl"),
          t("Engine Programming"),
          t("Gameplay")
        ],
        [
          t("Level Design"),
          t("FMOD", "fmod"),
          t("GLSL"),
          t("HLSL"),
          t("Java", "openjdk"),
          t("Lua", "lua"),
          t("Blender", "blender"),
          t("Maya", "autodeskmaya"),
          t("Substance Painter", "adobesubstance3dpainter"),
          t("3D Modelling"),
          t("2D Art"),
          null
        ],
        []
      ];

      const dirs = [
        [1, 0], [1, -1], [0, -1],
        [-1, 0], [-1, 1], [0, 1]
      ];

      function ringCells(R) {

        if (R === 0) return [[0, 0]];

        const out = [];
        let q = dirs[4][0] * R;
        let r = dirs[4][1] * R;

        for (let i = 0; i < 6; i++) {
          for (let j = 0; j < R; j++) {
            out.push([q, r]);
            q += dirs[i][0];
            r += dirs[i][1];
          }
        }

        return out;

      }

      let timer = null;
      let visible = false;

      function build() {

        grid.innerHTML = "";

        const width = grid.clientWidth;
        const R = width < 620 ? 2 : 3;
        const w = Math.min(width / (2 * R + 1), 130);
        const h = w * 1.1547;
        const s = w * 0.9;

        grid.style.setProperty("--w", w + "px");
        grid.style.height = (h * (1.5 * R + 0.5) + h * 0.25) + "px";

        for (let d = 0; d <= R; d++) {

          ringCells(d).forEach((pos, i) => {

            const item = rings[d][i];
            const cx = width / 2 + w * (pos[0] + pos[1] / 2);
            const cy = h * (R * 0.75 + 0.5) + h * 0.75 * pos[1];

            const el = document.createElement("div");

            el.className = "hex-wrap" + (item ? "" : " empty");
            el.style.width = s + "px";
            el.style.height = s * 1.1547 + "px";
            el.style.left = (cx - s / 2) + "px";
            el.style.top = (cy - s * 0.57735) + "px";
            el.style.setProperty("--d", d * 0.18 + "s");

            let inner = LOCK;

            el.title = "Still learning";

            if (item) {

              el.title = item.name;

                inner =
                    (item.icon
                        ? '<img src="https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/' + item.icon + '.svg" alt="">'
                        : "") +
                    "<span>" + item.name + "</span>";

            }

            el.innerHTML =
              '<div class="hex"></div>' +
              '<div class="hex-in">' + inner + "</div>";

            const img = el.querySelector("img");

            if (img) img.onerror = () => img.remove();

            grid.appendChild(el);

          });

        }

      }

      function sweep() {

        // the CSS animates hexagons that carry the "pop" class, with a delay
        // per ring (--d), so the wave travels from the center outward
        const cells = grid.querySelectorAll(".hex-wrap");

        cells.forEach(el => el.classList.remove("pop"));
        void grid.offsetWidth;
        cells.forEach(el => el.classList.add("pop"));

      }

      function start() {

        grid.classList.add("shown");

        // let the entrance finish, then sweep every 5 seconds
        setTimeout(sweep, 1400);
        timer = setInterval(sweep, 5000);

      }

      function stop() {

        clearInterval(timer);
        timer = null;

      }

      build();

      let resizeTimer;

      window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 150);

      });

      new IntersectionObserver(entries => {

        visible = entries[0].isIntersecting;

        if (visible && !timer) start();
        if (!visible) stop();

      }, { threshold: 0.35 }).observe(grid);

    })();

    /* =====================================================
   ENGINE / GAME ICONS: pop on click
====================================================== */

document.querySelectorAll(".engine-icon, .project-grid.compact .project-card").forEach(icon => {

  function pop() {
    icon.classList.add("pulse");
    setTimeout(() => icon.classList.remove("pulse"), 260);
  }

  icon.addEventListener("click", pop);

  // drop keyboard focus after the click so the card doesn't stay highlighted
  const link = icon.querySelector(".read-more");
  if (link) link.addEventListener("click", () => setTimeout(() => link.blur(), 0));


});

// coming back with the browser Back button: clear any leftover hover/focus state
window.addEventListener("pageshow", () => {
  document.querySelectorAll(".pulse").forEach(el => el.classList.remove("pulse"));
  if (document.activeElement && document.activeElement.classList.contains("read-more")) {
    document.activeElement.blur();
  }
});

/* =====================================================
 ENGINE: "Learn more" on the home page jumps to the matching
 card on engine.html (opens the right tab, then scrolls to it)
====================================================== */

(function () {

    const slug = text =>
        text.trim().toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    /* Home page: point each engine icon's link at engine.html#<card> */
    document.querySelectorAll(".engine-icon").forEach(icon => {

        const title = icon.querySelector("h3");
        const link = icon.querySelector(".read-more");

        if (title && link) {
            link.setAttribute("href", "engine.html#" + slug(title.textContent));
        }

    });

    /* Engine page: give every card an id from its title */
    const cards = document.querySelectorAll(".technical-card");

    if (!cards.length) return;

    cards.forEach(card => {

        const title = card.querySelector("h3");

        if (title && !card.id) card.id = slug(title.textContent);

    });

    /* Open the right tab, then scroll to the card */
    function goToCard() {

        const id = decodeURIComponent(location.hash.slice(1));
        const card = id && document.getElementById(id);

        if (!card || !card.classList.contains("technical-card")) return;

        const tab = card.closest(".tab-content");
        const button = tab &&
            document.querySelector('.tab-button[data-tab="' + tab.id + '"]');

        if (button) button.click();

        setTimeout(() => {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 120);

    }

    goToCard();
    window.addEventListener("hashchange", goToCard);

})();