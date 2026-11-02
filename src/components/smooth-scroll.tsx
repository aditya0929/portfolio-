"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { cancelFrame, frame, type FrameData } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

function LenisBridge() {
  const lenis = useLenis();
  const pathname = usePathname();
  const firstRoute = useRef(true);

  // Drive Lenis from Motion's frame loop so smooth scrolling and scroll-linked animations stay in step.
  useEffect(() => {
    if (!lenis) return;
    const update = ({ timestamp }: FrameData) => lenis.raf(timestamp);
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [lenis]);

  // Same-page "#section" links glide instead of jumping. Capture phase runs before next/link,
  // which then skips its own navigation because the event is already default-prevented.
  useEffect(() => {
    if (!lenis) return;
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank") return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      event.preventDefault();
      lenis.scrollTo(url.hash, { duration: 1.1 });
      history.pushState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis]);

  // After client-side navigation, land on the hash target or the top of the new page.
  // On the first load, leave the browser's own scroll restoration alone unless there's a hash.
  useEffect(() => {
    if (!lenis) return;
    const hash = window.location.hash;
    if (firstRoute.current) {
      firstRoute.current = false;
      if (!hash) return;
    }
    lenis.scrollTo(hash || 0, { immediate: true, force: true });
  }, [lenis, pathname]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        autoRaf: false,
        lerp: 0.09,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
        autoToggle: true,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
