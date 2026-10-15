(() => {
  const SELECTORS = {
    body: document.body,
    html: document.documentElement,
    nav: document.querySelector("nav"),
    navLinks: document.querySelectorAll(".nav-link"),
    mobileLinks: document.querySelectorAll(".mobile-menu-link"),
    allNavAnchors: document.querySelectorAll(
      '.nav-link, .mobile-menu-link, a[href^="#"]'
    ),
    revealEls: document.querySelectorAll(".reveal"),
    counterEls: document.querySelectorAll("[data-count]"),
    parallaxEls: document.querySelectorAll("[data-parallax]"),
    workCards: document.querySelectorAll(".work-card"),
    backToTop: document.getElementById("btt"),
    spotlight: document.querySelector(".spotlight"),
    themeToggle: document.getElementById("theme-toggle"),
    mobileMenuToggle: document.getElementById("mobile-menu-toggle"),
    mobileMenu: document.getElementById("mobile-menu"),
    mobileCTA: document.querySelector(".mobile-menu-cta"),
    modalOverlay: document.getElementById("modal-overlay"),
    modalClose: document.getElementById("modal-close"),
    modalImg: document.getElementById("modal-img"),
    modalTitle: document.getElementById("modal-title"),
    modalDesc: document.getElementById("modal-desc"),
    contactForm: document.getElementById("contact-form"),
    heroCanvas: document.getElementById("hero-canvas"),
    hero: document.getElementById("hero"),
  };

  const SECTION_IDS = [
    "about",
    "tech",
    "experience",
    "portfolio",
    "certifications",
    "location",
    "contact",
  ];

  const SECTIONS = SECTION_IDS.map((id) => ({
    id,
    el: document.getElementById(id),
  })).filter((section) => section.el);

  const state = {
    countersAnimated: false,
    activeSection: null,
    galaxyFallback: null,
    threeMouseX: 0,
    threeMouseY: 0,
    spotlightMouseX: window.innerWidth / 2,
    spotlightMouseY: window.innerHeight / 2,
    spotlightX: window.innerWidth / 2,
    spotlightY: window.innerHeight / 2,
  };

  function init() {
    const footerYear = document.getElementById("footer-year");
    if (footerYear) footerYear.textContent = new Date().getFullYear();

    initHeroReady();
    initThreeHero();
    initThemeToggle();
    initReveal();
    initTimelineFlow();
    initScrollState();
    initSpotlight();
    initParallax();
    initPortfolioTilt();
    initPortfolioModal();
    initMobileMenu();
    initSmoothAnchorScroll();
    initContactForm();
  }

  function initHeroReady() {
    // This deferred script runs after HTML parsing; media may still be loading.
    SELECTORS.body.classList.add("hero-ready");
    window.setTimeout(() => animateCounters(), 900);
  }

  /* =========================================================
     THREE.JS HERO: SPIRAL GALAXY & DISTANT STARS
     ========================================================= */
  function initThreeHero() {
    if (!SELECTORS.heroCanvas || !SELECTORS.hero) return;
    // Visible immediately, including when the CDN or GPU is unavailable.
    if (!state.galaxyFallback) state.galaxyFallback = initGalaxyFallback();
    if (!window.THREE) {
      // The optional background must not delay content or page controls.
      const script = document.getElementById("three-script");
      if (script) script.addEventListener("load", initThreeHero, { once: true });
      return;
    }

    const compact = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = navigator.connection?.saveData === true;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      SELECTORS.hero.clientWidth / SELECTORS.hero.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 11;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: SELECTORS.heroCanvas,
        alpha: true,
        antialias: !compact,
        powerPreference: "low-power",
      });
    } catch (error) {
      console.warn("Hero background unavailable:", error);
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(SELECTORS.hero.clientWidth, SELECTORS.hero.clientHeight);

    // Use Three's tested particle shader and a small, locally generated sprite.
    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 32;
    const spriteContext = sprite.getContext("2d");
    if (!spriteContext) {
      renderer.dispose();
      return;
    }
    const glow = spriteContext.createRadialGradient(16, 16, 0, 16, 16, 16);
    glow.addColorStop(0, "rgba(255,255,255,1)");
    glow.addColorStop(0.25, "rgba(255,255,255,0.9)");
    glow.addColorStop(0.6, "rgba(255,255,255,0.3)");
    glow.addColorStop(1, "rgba(255,255,255,0)");
    spriteContext.fillStyle = glow;
    spriteContext.fillRect(0, 0, 32, 32);
    const starTexture = new THREE.CanvasTexture(sprite);
    const starMaterial = new THREE.PointsMaterial({
      map: starTexture,
      size: compact ? 0.1 : 0.13,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const galaxyMaterial = starMaterial.clone();
    galaxyMaterial.size = compact ? 0.085 : 0.11;
    const materials = [starMaterial, galaxyMaterial];

    function createStarField(count, spiral, material) {
      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const offset = i * 3;
        const radius = Math.pow(Math.random(), 1.5) * 8;
        const angle = (i % 4) * Math.PI / 2 + radius * 0.75;
        const spread = 0.16 + radius * 0.12;
        if (spiral) {
          positions[offset] = Math.cos(angle) * radius + (Math.random() - 0.5) * spread;
          positions[offset + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * spread;
          positions[offset + 2] = (Math.random() - 0.5) * (0.35 + radius * 0.08);
        } else {
          positions[offset] = (Math.random() - 0.5) * 36;
          positions[offset + 1] = (Math.random() - 0.5) * 24;
          positions[offset + 2] = -4 - Math.random() * 18;
        }
        const mix = spiral ? radius / 8 : Math.random();
        const lavender = Math.random() > 0.7;
        colors[offset] = 1 - mix * (lavender ? 0.4 : 0.65);
        colors[offset + 1] = 0.88 - mix * 0.38;
        colors[offset + 2] = 0.74 + mix * 0.26;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const field = new THREE.Points(geometry, material);
      scene.add(field);
      return field;
    }

    const stars = createStarField(compact ? 200 : 450, false, starMaterial);
    const galaxy = createStarField(compact ? 500 : 1400, true, galaxyMaterial);
    galaxy.position.set(compact ? 0 : 1, 1, -2);
    galaxy.rotation.x = -0.65;
    galaxy.rotation.z = 0.25;

    SELECTORS.hero.addEventListener("mousemove", (event) => {
      state.threeMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      state.threeMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    let frameId = null;
    let inView = true;
    let lastFrame = null;
    let elapsed = 0;
    let firstDraw = true;
    let webglAvailable = true;
    const frameInterval = 1000 / (compact ? 30 : 60);

    function render(delta) {
      elapsed += delta;
      const t = elapsed;

      stars.rotation.y = t * 0.003;
      galaxy.rotation.z = 0.25 + t * 0.04;
      const lightMode = SELECTORS.html.classList.contains("light-mode");
      for (const material of materials) {
        material.color.set(lightMode ? 0x1d4ed8 : 0xffffff);
        material.blending = lightMode ? THREE.NormalBlending : THREE.AdditiveBlending;
      }
      starMaterial.opacity = 0.85 + Math.sin(t * 0.8) * 0.15;

      const ease = 1 - Math.exp(-delta * 2.5);
      camera.position.x += (state.threeMouseX * 0.22 - camera.position.x) * ease;
      camera.position.y += (state.threeMouseY * 0.12 - camera.position.y) * ease;
      camera.lookAt(scene.position);

      try {
        renderer.render(scene, camera);
        if (firstDraw) {
          firstDraw = false;
          const failed = renderer.info.programs.some(program => program.diagnostics?.runnable === false);
          if (failed || renderer.info.render.points === 0) {
            useFallback();
            return;
          }
          state.galaxyFallback?.stop();
        }
      } catch (error) {
        console.warn("Galaxy render unavailable; using canvas fallback:", error);
        useFallback();
      }
    }

    function useFallback() {
      webglAvailable = false;
      SELECTORS.heroCanvas.style.visibility = "hidden";
      state.galaxyFallback?.start();
      syncAnimation();
    }

    function animate(now) {
      frameId = null;
      if (!webglAvailable || !inView || document.hidden) return;
      const delta = lastFrame === null ? frameInterval : now - lastFrame;
      if (delta >= frameInterval - 0.5) {
        render(Math.min(delta / 1000, 0.1));
        lastFrame = now;
      }
      if (webglAvailable && !reducedMotion.matches && !saveData) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    function syncAnimation() {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      lastFrame = null;
      if (webglAvailable && inView && !document.hidden) {
        frameId = window.requestAnimationFrame(animate);
      }
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        syncAnimation();
      });
      observer.observe(SELECTORS.hero);
    }
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener?.("change", syncAnimation);
    SELECTORS.themeToggle?.addEventListener("click", syncAnimation);
    SELECTORS.heroCanvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      useFallback();
    });
    syncAnimation();

    window.addEventListener("resize", () => {
      camera.aspect = SELECTORS.hero.clientWidth / SELECTORS.hero.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(SELECTORS.hero.clientWidth, SELECTORS.hero.clientHeight);
      syncAnimation();
    });
  }

  function initGalaxyFallback() {
    const canvas = document.getElementById("hero-galaxy-fallback");
    const ctx = canvas?.getContext("2d");
    if (!ctx) return null;

    const compact = window.matchMedia("(max-width: 900px), (pointer: coarse)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = navigator.connection?.saveData === true;
    const colors = ["#dbeafe", "#93c5fd", "#c4b5fd", "#fff0d9"];
    const stars = Array.from({ length: compact ? 100 : 220 }, () => ({
      x: Math.random(), y: Math.random(), size: 0.65 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const spiral = Array.from({ length: compact ? 280 : 650 }, (_, i) => {
      const radius = Math.pow(Math.random(), 1.5) * 8;
      const angle = (i % 4) * Math.PI / 2 + radius * 0.75;
      const spread = 0.2 + radius * 0.15;
      return {
        x: Math.cos(angle) * radius + (Math.random() - 0.5) * spread,
        y: Math.sin(angle) * radius + (Math.random() - 0.5) * spread,
        size: 0.55 + Math.random() * 0.85,
        color: radius < 1.5 ? "#fff0d9" : colors[i % colors.length],
      };
    });
    let width, height;
    let active = true;
    let inView = true;
    let frameId = null;
    let lastFrame = null;
    let elapsed = 0;

    function resize() {
      width = SELECTORS.hero.clientWidth;
      height = SELECTORS.hero.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, compact ? 1 : 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    function draw() {
      const light = SELECTORS.html.classList.contains("light-mode");
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = light ? "source-over" : "lighter";
      for (const star of stars) {
        ctx.globalAlpha = 0.55 + Math.sin(elapsed * 0.7 + star.phase) * 0.3;
        ctx.fillStyle = light ? "#2563eb" : star.color;
        ctx.beginPath();
        ctx.arc((star.x * width + elapsed * 1.5) % width, star.y * height, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.save();
      ctx.translate(width * (compact ? 0.52 : 0.56), height * 0.43);
      ctx.rotate(0.25 + elapsed * 0.04);
      ctx.scale(1, 0.65);
      const scale = Math.min(width, height) * (compact ? 0.115 : 0.075);
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, scale * 1.6);
      core.addColorStop(0, light ? "rgba(37,99,235,0.14)" : "rgba(219,234,254,0.24)");
      core.addColorStop(0.35, "rgba(147,131,255,0.08)");
      core.addColorStop(1, "rgba(147,131,255,0)");
      ctx.globalAlpha = 1;
      ctx.fillStyle = core;
      ctx.fillRect(-scale * 1.6, -scale * 1.6, scale * 3.2, scale * 3.2);
      for (const star of spiral) {
        ctx.globalAlpha = light ? 0.65 : 0.85;
        ctx.fillStyle = light ? "#2563eb" : star.color;
        ctx.beginPath();
        ctx.arc(star.x * scale, star.y * scale, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    function animate(now) {
      frameId = null;
      if (!active || !inView || document.hidden) return;
      const delta = lastFrame === null ? 0 : now - lastFrame;
      if (lastFrame === null || delta >= 1000 / 30 - 0.5) {
        elapsed += Math.min(delta / 1000, 0.1);
        draw();
        lastFrame = now;
      }
      if (!reducedMotion.matches && !saveData) frameId = window.requestAnimationFrame(animate);
    }

    function sync() {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      frameId = null;
      lastFrame = null;
      if (active && inView && !document.hidden) frameId = window.requestAnimationFrame(animate);
    }
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      observer.observe(SELECTORS.hero);
    }
    document.addEventListener("visibilitychange", sync);
    reducedMotion.addEventListener?.("change", sync);
    SELECTORS.themeToggle?.addEventListener("click", sync);
    window.addEventListener("resize", () => { resize(); sync(); });
    resize();
    sync();
    return {
      start() { active = true; canvas.style.display = ""; sync(); },
      stop() { active = false; canvas.style.display = "none"; sync(); },
    };
  }

  function initThemeToggle() {
    if (!SELECTORS.themeToggle) return;

    const icon = SELECTORS.themeToggle.querySelector(".theme-toggle__icon");
    const savedTheme = localStorage.getItem("theme") || "dark";

    if (savedTheme === "light") {
      SELECTORS.html.classList.add("light-mode");
      if (icon) icon.textContent = "☀️";
    } else if (icon) {
      icon.textContent = "🌙";
    }

    SELECTORS.themeToggle.addEventListener("click", () => {
      SELECTORS.html.classList.toggle("light-mode");
      const isLight = SELECTORS.html.classList.contains("light-mode");
      if (icon) icon.textContent = isLight ? "☀️" : "🌙";
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }

  function initReveal() {
    if (!("IntersectionObserver" in window)) {
      SELECTORS.revealEls.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    SELECTORS.revealEls.forEach((el) => observer.observe(el));
  }

  function initTimelineFlow() {
    const timeline = document.querySelector(".exp-zigzag");
    if (!timeline || !("IntersectionObserver" in window)) return;

    const disabled = window.matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)");
    let inView = false;
    function update() {
      timeline.classList.toggle("is-animating", inView && !document.hidden &&
        !disabled.matches && navigator.connection?.saveData !== true);
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(timeline);
    document.addEventListener("visibilitychange", update);
    disabled.addEventListener?.("change", update);
  }

  function initScrollState() {
    let scheduled = false;
    function update() {
      scheduled = false;
      updateActiveSections();
      SELECTORS.backToTop?.classList.toggle("show", window.scrollY > 500);
      SELECTORS.nav?.classList.toggle("scrolled", window.scrollY > 24);
    }
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    update();
  }

  function initSpotlight() {
    if (!canUsePointerEffects() || !SELECTORS.spotlight) return;
    let frameId = null;

    function animateSpotlight() {
      frameId = null;
      if (document.hidden) return;
      state.spotlightX += (state.spotlightMouseX - state.spotlightX) * 0.08;
      state.spotlightY += (state.spotlightMouseY - state.spotlightY) * 0.08;
      SELECTORS.spotlight.style.transform =
        `translate3d(${state.spotlightX}px, ${state.spotlightY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(state.spotlightMouseX - state.spotlightX) > 0.5 ||
          Math.abs(state.spotlightMouseY - state.spotlightY) > 0.5) {
        frameId = window.requestAnimationFrame(animateSpotlight);
      }
    }

    window.addEventListener("mousemove", (event) => {
      state.spotlightMouseX = event.clientX;
      state.spotlightMouseY = event.clientY;
      if (frameId === null) frameId = window.requestAnimationFrame(animateSpotlight);
    });
    animateSpotlight();
  }

  function canUsePointerEffects() {
    return window.innerWidth > 900 &&
      !window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches;
  }

  function initParallax() {
    if (!canUsePointerEffects() || !SELECTORS.parallaxEls.length) return;
    let frameId = null;
    let x = 0;
    let y = 0;

    function update() {
      frameId = null;
      SELECTORS.parallaxEls.forEach((el) => {
        const speed = Number.parseFloat(el.dataset.parallax || "0.1");
        const tx = x * 40 * speed;
        const ty = y * 30 * speed;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    }
    SELECTORS.hero.addEventListener("mousemove", (event) => {
      x = event.clientX / window.innerWidth - 0.5;
      y = event.clientY / window.innerHeight - 0.5;
      if (frameId === null) frameId = window.requestAnimationFrame(update);
    });
  }

  function animateCounters() {
    if (state.countersAnimated) return;
    state.countersAnimated = true;

    SELECTORS.counterEls.forEach((el) => {
      const target = Number.parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.countSuffix ?? "+";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.textContent = `${target}${suffix}`;
        return;
      }
      const duration = 1200;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(eased * target);

        el.textContent = `${value}${suffix}`;

        if (progress < 1) {
          window.requestAnimationFrame(update);
        }
      }

      window.requestAnimationFrame(update);
    });
  }

  function initPortfolioTilt() {
    if (!canUsePointerEffects()) return;

    SELECTORS.workCards.forEach((card) => {
      let frameId = null;
      let pointerX = 0;
      let pointerY = 0;
      card.addEventListener("mousemove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (frameId !== null) return;
        frameId = window.requestAnimationFrame(() => {
          frameId = null;
          const rect = card.getBoundingClientRect();
          const x = pointerX - rect.left;
          const y = pointerY - rect.top;
          const rx = (y / rect.height - 0.5) * -6;
          const ry = (x / rect.width - 0.5) * 8;
          card.style.transform =
            `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
          card.style.setProperty("--mx", `${x}px`);
          card.style.setProperty("--my", `${y}px`);
        });
      });

      card.addEventListener("mouseleave", () => {
        if (frameId !== null) window.cancelAnimationFrame(frameId);
        frameId = null;
        card.style.transform = "";
      });
    });
  }

  function initPortfolioModal() {
    if (!SELECTORS.modalOverlay || !SELECTORS.modalClose) return;

    SELECTORS.workCards.forEach((card) => {
      card.addEventListener("click", () => {
        openModal(
          card.dataset.img || "",
          card.dataset.title || "",
          card.dataset.desc || ""
        );
      });
    });

    SELECTORS.modalOverlay.addEventListener("click", (event) => {
      if (event.target === SELECTORS.modalOverlay) {
        closeModal();
      }
    });

    SELECTORS.modalClose.addEventListener("click", closeModal);

    document.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        SELECTORS.modalOverlay.classList.contains("open")
      ) {
        closeModal();
      }
    });
  }

  function openModal(img, title, desc) {
    if (
      !SELECTORS.modalImg ||
      !SELECTORS.modalTitle ||
      !SELECTORS.modalDesc ||
      !SELECTORS.modalOverlay
    ) {
      return;
    }

    SELECTORS.modalImg.src = img;
    SELECTORS.modalImg.alt = title;
    SELECTORS.modalTitle.textContent = title;
    SELECTORS.modalDesc.textContent = desc;
    SELECTORS.modalOverlay.classList.add("open");
    SELECTORS.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!SELECTORS.modalOverlay) return;
    SELECTORS.modalOverlay.classList.remove("open");
    SELECTORS.body.style.overflow = "";
  }

  function initMobileMenu() {
    if (!SELECTORS.mobileMenuToggle || !SELECTORS.mobileMenu) return;

    function openMenu() {
      SELECTORS.mobileMenuToggle.classList.add("active");
      SELECTORS.mobileMenu.classList.add("open");
      SELECTORS.body.classList.add("menu-open");
      SELECTORS.mobileMenuToggle.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
      SELECTORS.mobileMenuToggle.classList.remove("active");
      SELECTORS.mobileMenu.classList.remove("open");
      SELECTORS.body.classList.remove("menu-open");
      SELECTORS.mobileMenuToggle.setAttribute("aria-expanded", "false");
    }

    SELECTORS.mobileMenuToggle.addEventListener("click", () => {
      const isOpen = SELECTORS.mobileMenu.classList.contains("open");
      if (isOpen) closeMenu();
      else openMenu();
    });

    SELECTORS.mobileLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    if (SELECTORS.mobileCTA) {
      SELECTORS.mobileCTA.addEventListener("click", closeMenu);
    }

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function initSmoothAnchorScroll() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function scrollToTarget(target, behavior) {
      const navHeight = SELECTORS.nav ? SELECTORS.nav.offsetHeight : 68;
      // Preserve the section boundary; its own padding provides the content gap.
      const top = target.id === "hero" ? 0 :
        target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top: Math.max(0, top), behavior });
    }

    function targetFromHash(hash) {
      if (!hash || hash === "#") return null;
      try {
        return document.getElementById(decodeURIComponent(hash.slice(1)));
      } catch {
        return null;
      }
    }

    function alignCurrentHash() {
      const target = targetFromHash(window.location.hash);
      if (target) scrollToTarget(target, "instant");
    }

    SELECTORS.allNavAnchors.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.defaultPrevented || event.button > 0 || event.metaKey ||
            event.ctrlKey || event.shiftKey || event.altKey) return;
        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        const target = targetFromHash(href);
        if (!target) return;

        event.preventDefault();

        scrollToTarget(target, reducedMotion.matches ? "instant" : "smooth");

        history.replaceState(null, "", href);
      });
    });

    window.addEventListener("load", alignCurrentHash, { once: true });
    window.addEventListener("hashchange", alignCurrentHash);
  }

  function updateActiveSections() {
    let current = "";
    const navHeight = SELECTORS.nav ? SELECTORS.nav.offsetHeight : 68;
    const triggerLine = navHeight + (window.innerHeight - navHeight) * 0.25;

    SECTIONS.forEach((section) => {
      const rect = section.el.getBoundingClientRect();

      if (rect.top <= triggerLine && rect.bottom >= triggerLine) {
        current = section.id;
      }
    });

    // The last section may be too short to reach the trigger line.
    if (SECTIONS.length && window.scrollY > 0 &&
        window.scrollY + window.innerHeight >= SELECTORS.html.scrollHeight - 2) {
      current = SECTIONS[SECTIONS.length - 1].id;
    }

    if (!current && window.scrollY < window.innerHeight * 0.4) {
      current = "";
    }

    if (state.activeSection === current) return;
    state.activeSection = current;

    SELECTORS.navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        current && link.getAttribute("href") === `#${current}`
      );
    });

    SELECTORS.mobileLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        current && link.getAttribute("href") === `#${current}`
      );
    });
  }

  function initContactForm() {
    if (!SELECTORS.contactForm) return;

    const scriptURL =
      "https://script.google.com/macros/s/AKfycbzXPqG0188luPVF5A8l0i_dGnDnUHHdpCeUjuY0QjfBoVvOOPWiwewFXCgalaaXR_iT/exec";

    SELECTORS.contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const btn = SELECTORS.contactForm.querySelector('button[type="submit"]');
      if (!btn) return;

      btn.disabled = true;
      btn.textContent = "Sending...";

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          body: new FormData(SELECTORS.contactForm),
        });

        const data = await response.json();

        if (data.result === "success") {
          btn.textContent = "Message Sent ✓";
          btn.style.background = "#10b981";
          SELECTORS.contactForm.reset();

          window.setTimeout(() => resetContactButton(btn), 4000);
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        console.error(error);
        btn.textContent = "Failed — Try Again";
        btn.style.background = "#ef4444";

        window.setTimeout(() => resetContactButton(btn), 4000);
      }
    });
  }

  function resetContactButton(btn) {
    btn.textContent = "Send Message ↗";
    btn.style.background = "";
    btn.disabled = false;
  }

  init();
})();
