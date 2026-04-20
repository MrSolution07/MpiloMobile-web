import { useEffect } from "react";

/**
 * Loads non-critical legacy CSS after first paint to reduce render-blocking.
 * Critical path keeps bootstrap / icons / theme in index.html.
 */
const DEFERRED_CSS = [
  "/assets/css/animate.css",
  "/assets/css/nice-select.css",
  "/assets/css/lightcase.css",
];

export function LegacyStylesDeferred() {
  useEffect(() => {
    const schedule =
      typeof window.requestIdleCallback === "function"
        ? (cb) => window.requestIdleCallback(cb, { timeout: 2000 })
        : (cb) => window.setTimeout(cb, 1);

    const links = [];
    schedule(() => {
      for (const href of DEFERRED_CSS) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
        links.push(link);
      }
    });
    return () => {
      links.forEach((el) => el.remove());
    };
  }, []);
  return null;
}
