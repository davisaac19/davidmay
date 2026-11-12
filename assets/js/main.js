(function () {
  "use strict";

  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle");
  var menuBtn = document.getElementById("menu-toggle");
  var menu = document.getElementById("mobile-menu");
  var navbar = document.getElementById("navbar");
  var year = document.getElementById("year");

  var META = {
    en: {
      title: "David May Cen · Fullstack .NET Engineer",
      description: "Fullstack .NET engineer and tech lead with 10 years building enterprise web platforms: ASP.NET Core, SQL Server, Vue 3, and cloud microservices on Azure and AWS.",
      ogTitle: "David May Cen · Fullstack .NET Engineer",
      ogDescription: "Fullstack .NET engineer and tech lead. ASP.NET Core, SQL Server, Vue 3, and cloud microservices on Azure and AWS.",
      theme: "Toggle color theme",
      open: "Open menu",
      close: "Close menu"
    },
    es: {
      title: "David May Cen · Ingeniero Fullstack .NET",
      description: "Ingeniero fullstack .NET y tech lead con 10 años construyendo plataformas web empresariales: ASP.NET Core, SQL Server, Vue 3 y microservicios en Azure y AWS.",
      ogTitle: "David May Cen · Ingeniero Fullstack .NET",
      ogDescription: "Ingeniero fullstack .NET y tech lead. ASP.NET Core, SQL Server, Vue 3 y microservicios en Azure y AWS.",
      theme: "Cambiar tema",
      open: "Abrir menú",
      close: "Cerrar menú"
    }
  };

  var EN = new Map();
  document.querySelectorAll("[data-es]").forEach(function (el) {
    EN.set(el, el.textContent);
  });

  var lang = "en";

  function setMetaContent(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }

  function applyLang(next) {
    lang = next === "es" ? "es" : "en";
    var t = META[lang];
    var isEs = lang === "es";

    root.lang = lang;
    document.title = t.title;
    setMetaContent('meta[name="description"]', t.description);
    setMetaContent('meta[property="og:title"]', t.ogTitle);
    setMetaContent('meta[property="og:description"]', t.ogDescription);

    document.querySelectorAll("[data-es]").forEach(function (el) {
      el.textContent = isEs ? el.getAttribute("data-es") : EN.get(el);
    });

    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === lang));
    });

    if (themeBtn) themeBtn.setAttribute("aria-label", t.theme);
    if (menuBtn) {
      var open = menuBtn.getAttribute("aria-expanded") === "true";
      menuBtn.setAttribute("aria-label", open ? t.close : t.open);
    }
  }

  function syncThemeButton() {
    if (themeBtn) themeBtn.setAttribute("aria-pressed", String(root.getAttribute("data-theme") === "dark"));
  }

  if (themeBtn) {
    syncThemeButton();
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      syncThemeButton();
    });
  }

  document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-set-lang");
      applyLang(next);
      try { localStorage.setItem("lang", lang); } catch (e) {}
    });
  });

  function closeMenu() {
    if (!menu || !menuBtn) return;
    menu.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", META[lang].open);
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
      menuBtn.setAttribute("aria-label", open ? META[lang].close : META[lang].open);
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  function onScroll() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  var savedLang;
  try { savedLang = localStorage.getItem("lang"); } catch (e) {}
  applyLang(savedLang === "es" ? "es" : "en");

  if (year) year.textContent = String(new Date().getFullYear());
})();
