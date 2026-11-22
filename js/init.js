/* Progressive enhancement: the English resume remains readable without JS. */
(() => {
  "use strict";
  const translations = window.resumeTranslations;
  const supported = ["en", "fa", "ar"];
  const root = document.documentElement;
  const menu = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const languageButtons = document.querySelectorAll("[data-lang]");
  const status = document.querySelector("#language-status");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const runningAnimations = new Set();

  function stopAnimations() {
    runningAnimations.forEach(animation => animation.cancel());
    runningAnimations.clear();
  }

  function animateElement(element, keyframes, options) {
    if (reducedMotion.matches || typeof element.animate !== "function") return;
    const animation = element.animate(keyframes, options);
    runningAnimations.add(animation);
    animation.finished.then(() => runningAnimations.delete(animation), () => runningAnimations.delete(animation));
  }

  function closeMenu(returnFocus = false) {
    menu.setAttribute("aria-expanded", "false");
    navigation.classList.remove("is-open");
    if (returnFocus) menu.focus();
  }

  function setLanguage(language, announce = false, updateURL = false) {
    const lang = supported.includes(language) ? language : "en";
    const dictionary = translations[lang];
    root.lang = lang;
    root.dir = lang === "en" ? "ltr" : "rtl";
    document.querySelectorAll("[data-i18n]").forEach(element => {
      const value = dictionary[element.dataset.i18n];
      if (typeof value === "string") element.textContent = value;
    });
    for (const [selector, key, attribute] of [["[data-i18n-aria]", "i18nAria", "aria-label"], ["[data-i18n-alt]", "i18nAlt", "alt"]]) {
      document.querySelectorAll(selector).forEach(element => {
        const value = dictionary[element.dataset[key]];
        if (typeof value === "string") element.setAttribute(attribute, value);
      });
    }
    // Localized decorative project subtitles override the brand's Latin language.
    document.querySelectorAll('.project-wordmark-sub').forEach(element => element.lang = lang);
    document.title = dictionary.pageTitle;
    document.querySelector('meta[name="description"]').content = dictionary.pageDescription;
    document.querySelector('meta[property="og:title"]').content = dictionary.pageTitle;
    document.querySelector('meta[property="og:description"]').content = dictionary.pageDescription;
    languageButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === lang)));
    try { localStorage.setItem("resumeLang", lang); } catch { /* Storage may be disabled. */ }
    if (updateURL) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      try { history.replaceState(null, "", url); } catch { /* Keep working in file previews. */ }
    }
    if (announce) status.textContent = dictionary.languageChanged;
    updateWhatsAppLinks();
    updateProgress();
  }

  function updateProgress() {
    const height = root.scrollHeight - window.innerHeight;
    const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0;
    document.querySelector(".reading-progress").style.transform = `scaleX(${progress})`;
  }

  root.classList.add("js");
  menu.hidden = false;
  menu.addEventListener("click", () => {
    const open = menu.getAttribute("aria-expanded") !== "true";
    menu.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.getAttribute("aria-expanded") === "true") closeMenu(true);
  });
  document.addEventListener("click", event => {
    if (!event.target.closest(".site-header")) closeMenu();
  });
  navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeMenu()));
  window.matchMedia("(min-width: 851px)").addEventListener("change", () => closeMenu());


  // Prefill the selected-language page URL so incoming WhatsApp chats identify their source.
  function updateWhatsAppLinks() {
    const lang = supported.includes(root.lang) ? root.lang : "en";
    const dictionary = translations[lang];
    const greetings = {
      en: "Hello Zohair, I am contacting you from your resume website.",
      fa: "سلام، از طریق وب‌سایت رزومه شما پیام می‌دهم.",
      ar: "مرحباً زهير، أتواصل معك من موقع سيرتك الذاتية."
    };
    const languageNames = { en: "English", fa: "فارسی", ar: "العربية" };
    const pageLabels = { en: "Page", fa: "صفحه", ar: "الصفحة" };
    const sourceLabels = { en: "Source", fa: "لینک صفحه", ar: "رابط الصفحة" };
    document.querySelectorAll("a[data-whatsapp-source]").forEach(link => {
      const source = new URL(window.location.href);
      source.searchParams.set("lang", lang);
      const section = link.closest("section[id]");
      if (section) source.hash = "#" + section.id;
      const message = [
        greetings[lang],
        languageNames[lang],
        pageLabels[lang] + ": " + dictionary.pageTitle,
        sourceLabels[lang] + ": " + source.href
      ].join("\n");
      link.href = "https://wa.me/9647884500002?text=" + encodeURIComponent(message);
    });
  }

  document.querySelectorAll("a[data-whatsapp-source]").forEach(link => link.addEventListener("click", updateWhatsAppLinks));

  languageButtons.forEach(button => button.addEventListener("click", () => {
    setLanguage(button.dataset.lang, true, true);
    closeMenu();
  }));
  let saved = "en";
  try { saved = localStorage.getItem("resumeLang") || "en"; } catch { /* English is the safe default. */ }
  const requested = new URLSearchParams(window.location.search).get("lang");
  if (translations) setLanguage(supported.includes(requested) ? requested : saved);
  window.addEventListener("popstate", () => {
    const language = new URLSearchParams(window.location.search).get("lang");
    setLanguage(supported.includes(language) ? language : "en");
  });
  const print = document.querySelector(".print-button");
  print.hidden = false;
  print.addEventListener("click", () => window.print());

  // One-time entrance animations work on touch screens as well as desktop.
  // Content is visible by default, even if JS or IntersectionObserver is unavailable.
  if ("IntersectionObserver" in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal.unobserve(entry.target);
        animateElement(entry.target, [
          { opacity: 0, transform: "translate3d(0, 22px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" }
        ], { duration: 680, easing: "cubic-bezier(.16,1,.3,1)" });
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -16px 0px" });
    document.querySelectorAll(".hero-copy, .hero-portrait, .section-heading, .about-copy, .language-panel, .iraq-feature, .marketing-feature, .platform-list, .experience-card, .project-card, .service-card, .contact-card").forEach(element => reveal.observe(element));
    animateElement(document.querySelector(".portrait-deco"), [
      { transform: "rotate(0deg)" },
      { transform: "rotate(90deg)", offset: 0.5 },
      { transform: "rotate(0deg)" }
    ], { duration: 3600, easing: "ease-in-out" });
  }
  reducedMotion.addEventListener("change", () => { if (reducedMotion.matches) stopAnimations(); });
  window.addEventListener("beforeprint", stopAnimations);
  document.addEventListener("focusin", event => {
    runningAnimations.forEach(animation => {
      if (animation.effect.target.contains(event.target)) animation.cancel();
    });
  });
  let scrollQueued = false;
  window.addEventListener("scroll", () => {
    if (scrollQueued) return;
    scrollQueued = true;
    requestAnimationFrame(() => { updateProgress(); scrollQueued = false; });
  }, { passive: true });
  window.addEventListener("resize", updateProgress);

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        navigation.querySelectorAll("a").forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    }, { rootMargin: "-20% 0px -50% 0px" });
    document.querySelectorAll("main>section[id]").forEach(section => observer.observe(section));
  }

})();
