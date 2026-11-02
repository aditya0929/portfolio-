"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { openSource } from "@/data/open-source";
import { withInlineCode } from "@/lib/inline-code";
import { reveal } from "@/lib/motion";

export function OpenSourceSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="open-source"
      className="relative z-20 w-full border-t border-white/10 bg-black px-6 py-16 sm:px-12 sm:py-20 md:px-20 md:py-24 lg:px-28 xl:px-36"
    >
      <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
        <motion.div {...reveal(reduced, { y: 24 })} className="flex shrink-0 flex-col lg:sticky lg:top-24 lg:w-1/2">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase sm:mb-3 sm:text-xs">
            <span>[ 03 // OPEN SOURCE ]</span>
          </div>
          <h2 className="font-display text-3xl leading-none font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Open Source
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed font-light text-zinc-400 sm:text-base">{openSource.intro}</p>

          <div className="mt-8 flex max-w-md flex-col border-t border-white/10 pt-6">
            <span className="text-5xl font-semibold tracking-tight text-white sm:text-6xl">{openSource.stat.value}</span>
            <span className="mt-2 text-sm text-zinc-300">{openSource.stat.label}</span>
          </div>

          <a
            href={openSource.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactable mt-6 inline-flex w-fit items-center gap-1.5 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <span>Explore on GitHub ↗</span>
          </a>
        </motion.div>

        <div className="flex w-full min-w-0 flex-col border-t border-white/10 lg:w-1/2">
          {openSource.contributions.map((item, i) => (
            <motion.article
              key={item.href}
              {...reveal(reduced, { y: 20, amount: 0.15, delay: 0.05 * i })}
              className="flex flex-col border-b border-white/10 py-8 sm:py-10"
            >
              <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] tracking-wider text-zinc-500 sm:text-xs">
                <span className="truncate">{item.repo}</span>
                <span className="shrink-0">[ {String(i + 1).padStart(2, "0")} ]</span>
              </div>
              <h3 className="mt-3 text-xl leading-snug font-light tracking-tight text-white sm:text-2xl md:text-3xl">
                {item.caseStudy ? (
                  <Link href={`/projects/${item.caseStudy}`} className="transition-colors hover:text-zinc-300">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              <p className="mt-2 font-mono text-[11px] tracking-wider text-zinc-500 uppercase sm:text-xs">{item.meta}</p>
              <p className="mt-4 text-sm leading-relaxed font-light text-zinc-300 sm:text-[15px]">
                {withInlineCode(item.summary)}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] tracking-wider uppercase sm:text-xs">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactable text-zinc-400 transition-colors hover:text-white"
                >
                  [ {item.linkLabel} ↗ ]
                </a>
                {item.caseStudy && (
                  <Link
                    href={`/projects/${item.caseStudy}`}
                    className="interactable text-white transition-colors hover:text-zinc-300"
                  >
                    [ CASE STUDY → ]
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
