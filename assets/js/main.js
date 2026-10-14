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
    initVideoControls();
    initThemeToggle();
    initReveal();
    initBackToTop();
    initNavScrollState();
    initSpotlight();
    initParallax();
    initPortfolioTilt();
    initPortfolioModal();
    initMobileMenu();
    initSmoothAnchorScroll();
    initActiveSections();
    initContactForm();
  }

  function initHeroReady() {
    window.addEventListener("load", () => {
      SELECTORS.body.classList.add("hero-ready");
      window.setTimeout(() => animateCounters(), 900);
      updateActiveSections();
    });
  }

  /* =========================================================
     THREE.JS HERO: ROYAL BLUE & NITRO ORANGE TELEMETRY
     ========================================================= */
  function initThreeHero() {
    if (!window.THREE || !SELECTORS.heroCanvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: SELECTORS.heroCanvas,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Royal Blue Particles
    const geoRoyal = new THREE.BufferGeometry();
    const countRoyal = 950;
    const posRoyal = new Float32Array(countRoyal * 3);
    for (let i = 0; i < countRoyal * 3; i += 1) {
      posRoyal[i] = (Math.random() - 0.5) * 24;
    }
    geoRoyal.setAttribute("position", new THREE.BufferAttribute(posRoyal, 3));

    const matRoyal = new THREE.PointsMaterial({
      color: 0x2563eb, // Royal Blue
      size: 0.036,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    });
    const ptsRoyal = new THREE.Points(geoRoyal, matRoyal);
    scene.add(ptsRoyal);

    // Nitro Orange Accent Sparks
    const geoNitro = new THREE.BufferGeometry();
    const countNitro = 260;
    const posNitro = new Float32Array(countNitro * 3);
    for (let i = 0; i < countNitro * 3; i += 1) {
      posNitro[i] = (Math.random() - 0.5) * 20;
    }
    geoNitro.setAttribute("position", new THREE.BufferAttribute(posNitro, 3));

    const matNitro = new THREE.PointsMaterial({
      color: 0xff5500, // Nitro Orange
      size: 0.048,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const ptsNitro = new THREE.Points(geoNitro, matNitro);
    scene.add(ptsNitro);

    // Wireframe Geometry 1: Royal Blue Icosahedron
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.14,
    });
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(2, 1), wireMat);
    ico.position.set(3, 0.5, -2);
    scene.add(ico);

    // Wireframe Geometry 2: Nitro Orange Torus
    const torMat = new THREE.MeshBasicMaterial({
      color: 0xff5500,
      wireframe: true,
      transparent: true,
      opacity: 0.13,
    });
    const tor = new THREE.Mesh(
      new THREE.TorusGeometry(1.25, 0.14, 12, 60),
      torMat
    );
    tor.position.set(-3.5, -1, -3);
    tor.rotation.x = 0.8;
    scene.add(tor);

    window.addEventListener("mousemove", (event) => {
      state.threeMouseX = (event.clientX / window.innerWidth) * 2 - 1;
      state.threeMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();

    function animate() {
      window.requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      ptsRoyal.rotation.y = t * 0.016;
      ptsRoyal.rotation.x = t * 0.005;

      ptsNitro.rotation.y = -t * 0.022;
      ptsNitro.rotation.z = t * 0.008;

      ico.rotation.x += 0.002;
      ico.rotation.y += 0.003;
      tor.rotation.z += 0.004;

      camera.position.x += (state.threeMouseX * 0.3 - camera.position.x) * 0.03;
      camera.position.y += (state.threeMouseY * 0.15 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* =========================================================
     VIDEO BACKGROUND LOADING
     ========================================================= */
  function initVideoControls() {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Show a poster and a clear status when the local media cannot load.
    document.querySelectorAll("video").forEach((video) => {
      if (reducedMotion.matches && video.autoplay) {
        video.autoplay = false;
        video.pause();
      }
      const status = video.parentElement.querySelector(".video-load-status");
      const markUnavailable = () => {
        video.dataset.unavailable = "true";
        if (status) status.hidden = false;
      };

      video.addEventListener("error", markUnavailable);
      video.querySelectorAll("source").forEach((source) => {
        source.addEventListener("error", markUnavailable);
      });
      video.addEventListener("loadeddata", () => {
        delete video.dataset.unavailable;
        if (status) status.hidden = true;
      });
      if (video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) {
        markUnavailable();
      }
    });

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

  function initBackToTop() {
    if (!SELECTORS.backToTop) return;

    window.addEventListener("scroll", () => {
      SELECTORS.backToTop.classList.toggle("show", window.scrollY > 500);
    });
  }

  function initNavScrollState() {
    window.addEventListener("scroll", () => {
      if (!SELECTORS.nav) return;
      SELECTORS.nav.classList.toggle("scrolled", window.scrollY > 24);
    });
  }

  function initSpotlight() {
    if (window.innerWidth <= 900 || !SELECTORS.spotlight) return;

    window.addEventListener("mousemove", (event) => {
      state.spotlightMouseX = event.clientX;
      state.spotlightMouseY = event.clientY;
    });

    function animateSpotlight() {
      state.spotlightX += (state.spotlightMouseX - state.spotlightX) * 0.08;
      state.spotlightY += (state.spotlightMouseY - state.spotlightY) * 0.08;
      SELECTORS.spotlight.style.left = `${state.spotlightX}px`;
      SELECTORS.spotlight.style.top = `${state.spotlightY}px`;
      window.requestAnimationFrame(animateSpotlight);
    }

    animateSpotlight();
  }

  function initParallax() {
    if (window.innerWidth <= 900 || !SELECTORS.parallaxEls.length) return;

    window.addEventListener("mousemove", (event) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;

      SELECTORS.parallaxEls.forEach((el) => {
        const speed = Number.parseFloat(el.dataset.parallax || "0.1");
        const tx = x * 40 * speed;
        const ty = y * 30 * speed;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    });
  }

  function animateCounters() {
    if (state.countersAnimated) return;
    state.countersAnimated = true;

    SELECTORS.counterEls.forEach((el) => {
      const target = Number.parseInt(el.dataset.count || "0", 10);
      const suffix = el.dataset.countSuffix ?? "+";
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
    if (window.innerWidth <= 900) return;

    SELECTORS.workCards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rx = (y / rect.height - 0.5) * -6;
        const ry = (x / rect.width - 0.5) * 8;

        card.style.transform =
          `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
        card.style.setProperty("--mx", `${x}px`);
        card.style.setProperty("--my", `${y}px`);
      });

      card.addEventListener("mouseleave", () => {
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

  function initActiveSections() {
    window.addEventListener("scroll", updateActiveSections, { passive: true });
    window.addEventListener("resize", updateActiveSections);
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
