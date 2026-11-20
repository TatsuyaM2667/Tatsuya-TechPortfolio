import { useEffect } from "react";
import anime from "animejs/lib/anime.es.js";

const REVEAL_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "p",
  "li",
  "dt",
  "dd",
  "time",
  ".akane-letter__date",
  ".akane-letter__signature",
  ".akane-lyrics__line",
  ".akane-censor-text",
  ".akane-notebook__date",
  ".akane-cassette__title",
  ".akane-lily-seal__caption",
].join(",");

export function useScrollReveal() {
  useEffect(() => {
    const root = document.getElementById("main");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const registered = new WeakSet<Element>();
    const revealed = new WeakSet<Element>();

    const orderOf = (element: HTMLElement) => {
      const siblings = Array.from(element.parentElement?.children ?? []);
      return Math.min(siblings.indexOf(element), 10);
    };

    const hideInstantly = (element: HTMLElement) => {
      anime.remove(element);
      element.classList.remove("is-revealed", "is-scattering");
      element.style.opacity = "0";
      element.style.transform = "translateY(14px) scale(0.985)";
    };

    const show = (element: HTMLElement) => {
      anime.remove(element);
      const order = orderOf(element);
      element.classList.remove("is-scattering");
      element.classList.add("is-revealed");
      element.style.opacity = "0";
      element.style.transform = "translateY(14px) scale(0.985)";

      anime({
        targets: element,
        opacity: [0, 1],
        translateY: [14, 0],
        scale: [0.985, 1],
        duration: 760,
        delay: order * 22,
        easing: "easeOutQuad",
      });
      revealed.add(element);
    };

    const scatter = (element: HTMLElement) => {
      if (!revealed.has(element)) {
        hideInstantly(element);
        return;
      }

      anime.remove(element);
      revealed.delete(element);
      element.classList.remove("is-revealed");
      element.classList.add("is-scattering");

      const spacing = parseFloat(window.getComputedStyle(element).letterSpacing) || 0;
      const opacity = Number(window.getComputedStyle(element).opacity) || 1;
      const order = orderOf(element);

      anime({
        targets: element,
        opacity: [opacity, 0],
        translateY: [0, -28],
        scale: [1, 1.05],
        letterSpacing: [`${spacing}px`, `${spacing + 12}px`],
        duration: 540,
        delay: Math.max(0, 8 - order) * 9,
        easing: "easeInQuad",
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            show(element);
          } else if (entry.boundingClientRect.bottom <= 0) {
            scatter(element);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.02 },
    );

    const register = (element: Element) => {
      if (registered.has(element)) return;
      registered.add(element);
      element.setAttribute("data-reveal", "");
      hideInstantly(element as HTMLElement);
      observer.observe(element);
    };

    const scan = () => root.querySelectorAll(REVEAL_SELECTOR).forEach(register);
    scan();

    const mutations = new MutationObserver(scan);
    mutations.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);
}
