"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef } from "react";
import { site } from "@/data/portfolio";
import { EASE } from "@/lib/motion";
import { usePresence } from "./use-presence";

// Only the visual chosen in portfolio.ts is downloaded.
const Visual =
  site.hero.visual === "ghost"
    ? dynamic(() => import("./ghost-canvas"), { ssr: false })
    : dynamic(() => import("./network-canvas"), { ssr: false });

const headline = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const headlineLine = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

export function HeroSection() {
  const presence = usePresence(site.status.discordId, site.status.label);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Everything drifts up and fades at different rates as the hero scrolls away.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const visualY = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["0%", "28%"]);
  const visualScale = useTransform(scrollYProgress, [0, 1], reduced ? [1, 1] : [1, 0.9]);
  const visualOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.2]);
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? ["0px", "0px"] : ["0px", "-110px"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const quoteY = useTransform(scrollYProgress, [0, 1], reduced ? ["0px", "0px"] : ["0px", "-140px"]);
  const footerY = useTransform(scrollYProgress, [0, 0.3], reduced ? ["0px", "0px"] : ["0px", "-24px"]);
  const footerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [firstLine, ...restLines] = site.hero.lines;

  return (
    <section
      ref={ref}
      className="relative flex h-[100svh] min-h-[100svh] w-full flex-col justify-between overflow-hidden bg-black px-6 py-6 text-white select-none sm:h-screen sm:px-12 md:px-20 md:py-8 lg:px-28 xl:px-36"
    >
      <header className="relative z-30 flex w-full items-center justify-between gap-4 py-2 pt-10 font-sans select-none">
        <Link
          href="/"
          className="interactable text-lg font-normal tracking-tight text-white transition-colors hover:text-zinc-300 sm:text-xl md:text-2xl"
        >
          {site.shortName}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-light sm:gap-8 sm:text-base md:gap-10 md:text-[17px]">
          {site.socials
            .filter((social) => social.inHeader)
            .map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="interactable text-zinc-400 lowercase transition-colors hover:text-white"
              >
                {social.label}
              </a>
            ))}
          <a
            href={`mailto:${site.email}`}
            title={site.email}
            className="interactable text-zinc-400 lowercase transition-colors hover:text-white"
          >
            <span className="hidden sm:inline">{site.email}</span>
            <span className="sm:hidden">email</span>
          </a>
        </nav>
      </header>

      <motion.div
        style={{ y: visualY, scale: visualScale, opacity: visualOpacity }}
        className="pointer-events-auto absolute inset-0 z-10 h-full w-full will-change-transform"
      >
        <Visual isMusic={presence.isMusic} isCoding={presence.isCoding} isGaming={presence.isGaming} />
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="pointer-events-none relative z-20 flex max-w-2xl flex-1 flex-col justify-end pb-6 will-change-transform sm:pb-12 md:pb-14 lg:max-w-3xl lg:justify-center lg:pb-0"
      >
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={headline}
          className="interactable pointer-events-auto font-display text-2xl leading-[1.2] font-light tracking-tight text-white sm:text-4xl sm:leading-[1.14] md:text-5xl lg:text-[48px] xl:text-[56px]"
        >
          <motion.span variants={headlineLine} className="block">
            <span className="font-normal text-white">{site.hero.greeting}</span>
            <span className="mx-2 font-light text-zinc-500 sm:mx-3">—</span>
            <span className="text-zinc-200">{site.hero.tagline}</span>
          </motion.span>
          <motion.span variants={headlineLine} className="block text-zinc-200">
            {firstLine}
          </motion.span>
          {restLines.map((line) => (
            <motion.span key={line} variants={headlineLine} className="block font-light text-zinc-400">
              {line}
            </motion.span>
          ))}
        </motion.h1>

        {site.quote && (
          <motion.div style={{ y: quoteY }} className="hidden will-change-transform sm:block">
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
              className="interactable pointer-events-auto mt-6 max-w-xl border-l border-white/20 pl-3.5 sm:mt-8 sm:pl-4"
            >
              <p className="font-mono text-xs leading-relaxed text-zinc-300 italic sm:text-[13px]">
                “{site.quote.text}”
              </p>
              <cite className="mt-1.5 block font-mono text-[11px] text-zinc-500 not-italic">— {site.quote.author}</cite>
            </motion.blockquote>
          </motion.div>
        )}

        {site.downloads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
            className="pointer-events-auto mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3"
          >
            {site.downloads.map((file, i) => (
              <a
                key={file.href}
                href={file.href}
                download={file.fileName}
                className={`interactable group inline-flex items-center gap-2 border px-3 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors sm:px-4 sm:py-2.5 sm:text-xs ${
                  i === 0
                    ? "border-white bg-white text-black hover:bg-zinc-200"
                    : "border-white/25 bg-black/40 text-white backdrop-blur-sm hover:border-white/60"
                }`}
              >
                <span className="sm:hidden">{file.shortLabel}</span>
                <span className="hidden sm:inline">{file.label}</span>
                <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
            ))}
          </motion.div>
        )}
      </motion.div>

      <motion.footer
        style={{ y: footerY, opacity: footerOpacity }}
        className="pointer-events-none relative z-30 flex w-full items-end justify-between gap-4 pt-4 pb-2 will-change-transform sm:pb-0"
      >
        <div className="pointer-events-auto flex max-w-[80%] flex-col gap-1.5 sm:max-w-none">
          <div className="flex items-center gap-2 text-left">
            <span className={`inline-block h-2 w-2 shrink-0 rounded-full transition-transform ${presence.dotClass}`} />
            <span
              className="truncate font-mono text-[11px] font-medium tracking-wide text-zinc-300 sm:text-xs"
              title={presence.label}
            >
              {presence.label}
            </span>
          </div>
          <div className="truncate font-mono text-[10px] tracking-widest text-zinc-500 uppercase sm:text-[11px]">
            {site.role} · {site.location}
          </div>
        </div>
        <a
          href="#achievements"
          aria-label="Scroll to background"
          className="interactable group pointer-events-auto flex shrink-0 items-center justify-center p-2 text-lg text-zinc-400 transition-colors hover:text-white"
        >
          <span className="transition-transform duration-300 group-hover:translate-y-1">↓</span>
        </a>
      </motion.footer>
    </section>
  );
}
