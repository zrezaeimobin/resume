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

  // Foliox magic cursor: a cyan ring follows the mouse and expands over controls.
  // Touch, pen and reduced-motion input keep the regular system pointer.
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const cursorInner = document.querySelector(".cursor-inner");
  const cursorOuter = document.querySelector(".cursor-outer");
  const tiltElements = document.querySelectorAll(".portrait-frame, .service-card, .project-visual");
  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;

  function hideCursor() {
    root.classList.remove("cursor-visible");
    if (cursorFrame) cancelAnimationFrame(cursorFrame);
    cursorFrame = 0;
    cursorInner.classList.remove("cursor-hover");
    cursorOuter.classList.remove("cursor-hover");
  }

  function resetTilt(element) {
    element.style.removeProperty("--tilt-x");
    element.style.removeProperty("--tilt-y");
  }

  function resetPointerEffects() {
    hideCursor();
    tiltElements.forEach(resetTilt);
  }

  document.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) {
      resetPointerEffects();
      return;
    }
    cursorX = event.clientX;
    cursorY = event.clientY;
    const hovered = Boolean(event.target.closest("a, button, [role='button'], .cursor-pointer"));
    cursorInner.classList.toggle("cursor-hover", hovered);
    cursorOuter.classList.toggle("cursor-hover", hovered);
    if (cursorFrame) return;
    cursorFrame = requestAnimationFrame(() => {
      cursorFrame = 0;
      const position = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      cursorInner.style.transform = position;
      cursorOuter.style.transform = position;
      root.classList.add("cursor-visible");
    });
  }, { passive: true });
  document.addEventListener("pointerout", event => { if (!event.relatedTarget) hideCursor(); });
  document.addEventListener("pointercancel", resetPointerEffects);
  document.addEventListener("keydown", event => { if (event.key === "Tab") resetPointerEffects(); });
  window.addEventListener("blur", resetPointerEffects);
  window.addEventListener("beforeprint", resetPointerEffects);
  finePointer.addEventListener("change", resetPointerEffects);
  reducedMotion.addEventListener("change", resetPointerEffects);

  // The original theme's four-degree hover tilt, without its jQuery dependency.
  tiltElements.forEach(element => {
    element.classList.add("tilt-effect");
    element.addEventListener("pointermove", event => {
      if (event.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) return;
      const bounds = element.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      element.style.setProperty("--tilt-x", `${-y * 4}deg`);
      element.style.setProperty("--tilt-y", `${x * 4}deg`);
    }, { passive: true });
    element.addEventListener("pointerleave", () => resetTilt(element));
    element.addEventListener("focusin", () => resetTilt(element));
  });
})();
