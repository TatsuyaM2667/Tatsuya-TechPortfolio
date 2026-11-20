import { useEffect } from "react";
import anime from "animejs/lib/anime.es.js";

const REVEAL_SELECTOR = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "p",
  "li",
  "dt",
  "dd",
  "time",
  "blockquote",
  "figcaption",
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
    const scattering = new WeakSet<Element>();

    const orderOf = (element: HTMLElement) => {
      const siblings = Array.from(element.parentElement?.children ?? []);
      return Math.min(siblings.indexOf(element), 14);
    };

    const hideInstantly = (element: HTMLElement) => {
      anime.remove(element);
      element.classList.remove("is-revealed", "is-scattering");
      element.style.opacity = "0";
      element.style.transform = "translateY(22px) scale(0.96)";
      element.style.letterSpacing = "";
    };

    const show = (element: HTMLElement) => {
      if (revealed.has(element) || scattering.has(element)) return;

      anime.remove(element);
      scattering.delete(element);
      element.classList.remove("is-scattering");
      element.classList.add("is-revealed");
      element.style.opacity = "0";
      element.style.transform = "translateY(22px) scale(0.96)";
      element.style.letterSpacing = "";
      revealed.add(element);

      anime({
        targets: element,
        opacity: [0, 1],
        translateY: [22, 0],
        scale: [0.96, 1],
        duration: 820,
        delay: orderOf(element) * 30,
        easing: "easeOutCubic",
      });
    };

    const scatter = (element: HTMLElement) => {
      if (scattering.has(element)) return;

      if (!revealed.has(element)) {
        hideInstantly(element);
        return;
      }

      anime.remove(element);
      revealed.delete(element);
      scattering.add(element);
      element.classList.remove("is-revealed");
      element.classList.add("is-scattering");

      const opacity = Number(window.getComputedStyle(element).opacity) || 1;

      anime({
        targets: element,
        opacity: [opacity, 0],
        translateY: [0, -40],
        scale: [1, 1.06],
        duration: 620,
        delay: Math.max(0, 10 - orderOf(element)) * 8,
        easing: "easeInQuad",
        complete: () => {
          scattering.delete(element);
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) show(element);
        },
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
      if (element.closest(".akane-whisper, .akane-relic, .akane-oil")) return;
      registered.add(element);
      element.setAttribute("data-reveal", "");

      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) show(element as HTMLElement);
      else hideInstantly(element as HTMLElement);

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
