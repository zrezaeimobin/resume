/* Small, independent enhancement; card hover motion also works without JavaScript. */
(() => {
  "use strict";

  const root = document.documentElement;
  const dot = document.querySelector(".cursor-inner");
  const ring = document.querySelector(".cursor-outer");
  if (!dot || !ring) return;

  const fineMouse = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cardsSelector = ".experience-card, .project-card, .service-card, .language-panel, .iraq-feature, .marketing-feature, .contact-card, .platform-list li";
  const tiltableSelector = ".experience-card, .project-card, .service-card";
  document.querySelectorAll(tiltableSelector).forEach(card => card.classList.add("fx-tilt"));

  let pointX = 0;
  let pointY = 0;
  let ringX = 0;
  let ringY = 0;
  let running = 0;
  let tracking = false;
  let hoveredCard = null;

  function canAnimate() {
    return fineMouse.matches && !reducedMotion.matches;
  }

  function clearCard(card) {
    if (!card) return;
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  }

  function hide() {
    root.classList.remove("fx-cursor-active", "fx-cursor-hover");
    if (running) cancelAnimationFrame(running);
    running = 0;
    tracking = false;
    clearCard(hoveredCard);
    hoveredCard = null;
  }

  function draw() {
    running = 0;
    ringX += (pointX - ringX) * 0.19;
    ringY += (pointY - ringY) * 0.19;
    ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;

    // Let the follower settle and stop scheduling frames until the next movement.
    if (Math.abs(pointX - ringX) > 0.4 || Math.abs(pointY - ringY) > 0.4) {
      running = requestAnimationFrame(draw);
    }
  }

  document.addEventListener("pointermove", event => {
    if (event.pointerType !== "mouse" || !canAnimate()) {
      hide();
      return;
    }

    pointX = event.clientX;
    pointY = event.clientY;
    dot.style.transform = `translate3d(${pointX}px,${pointY}px,0)`;
    if (!tracking) {
      tracking = true;
      ringX = pointX;
      ringY = pointY;
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
    }
    root.classList.add("fx-cursor-active");
    if (!running) running = requestAnimationFrame(draw);

    const element = event.target instanceof Element ? event.target : null;
    const card = element?.closest(cardsSelector) ?? null;
    if (card !== hoveredCard) {
      clearCard(hoveredCard);
      hoveredCard = card;
    }

    root.classList.toggle("fx-cursor-hover", Boolean(element?.closest("a, button, [role='button'], .experience-card, .project-card, .service-card, .contact-card")));

    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(1, (pointX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (pointY - rect.top) / rect.height));
    if (card.matches(tiltableSelector)) {
      card.style.setProperty("--tilt-x", ((0.5 - y) * 5).toFixed(2) + "deg");
      card.style.setProperty("--tilt-y", ((x - 0.5) * 5).toFixed(2) + "deg");
    }
  }, { passive: true });

  document.addEventListener("pointerout", event => {
    if (!event.relatedTarget) hide();
  });
  document.addEventListener("pointercancel", hide);
  document.addEventListener("keydown", event => {
    if (event.key === "Tab" || event.key === "Escape") hide();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hide();
  });
  window.addEventListener("blur", hide);
  window.addEventListener("beforeprint", hide);
  fineMouse.addEventListener("change", hide);
  reducedMotion.addEventListener("change", hide);
})();
