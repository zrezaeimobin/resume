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
