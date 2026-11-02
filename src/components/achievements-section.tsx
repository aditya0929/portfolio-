"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { site } from "@/data/portfolio";
import { projectBySlug } from "@/data/projects";
import { reveal } from "@/lib/motion";

const ROW =
  "interactable group flex cursor-default flex-col py-4 transition-colors hover:bg-white/[0.03]";
const ROW_TITLE = "text-sm text-zinc-100 transition-colors duration-200 group-hover:text-white sm:text-[15px]";
const ROW_META = "font-mono text-xs text-zinc-400 sm:text-[13px]";

function Block({ title, children }: { title: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-col">
      <motion.h3
        {...reveal(reduced, { y: 14, duration: 0.6 })}
        className="interactable mb-3 text-lg font-normal tracking-tight text-white sm:mb-4 sm:text-xl"
      >
        {title}
      </motion.h3>
      <div className="flex flex-col divide-y divide-white/5 border-t border-white/10">{children}</div>
    </div>
  );
}

function Row({ index, className, children }: { index: number; className: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div {...reveal(reduced, { y: 14, amount: 0.1, duration: 0.5, delay: 0.04 * index })} className={className}>
      {children}
    </motion.div>
  );
}

export function AchievementsSection() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // The whole section recedes slightly as it scrolls off the top.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["end end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-4%"]);

  const history = [...site.experience, ...site.education];

  return (
    <section
      ref={ref}
      id="achievements"
      className="relative z-10 flex min-h-screen w-full flex-col justify-center overflow-hidden border-t border-white/10 bg-black px-6 pt-16 pb-6 sm:px-12 sm:pt-20 sm:pb-8 md:px-20 md:pt-24 md:pb-10 lg:px-28 xl:px-36"
    >
      <motion.div
        style={{ scale: reduced ? 1 : scale, opacity: reduced ? 1 : opacity, y: reduced ? 0 : y, willChange: "transform" }}
        className="w-full origin-center"
      >
        <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
          <motion.div {...reveal(reduced, { y: 20 })} className="flex flex-col lg:sticky lg:top-24 lg:w-1/2">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 uppercase sm:mb-3">
              <span>[ 01 // OVERVIEW ]</span>
            </div>
            <h2 className="interactable font-display text-3xl leading-none font-light tracking-tight text-white sm:text-4xl md:text-5xl">
              Background
            </h2>
            <p className="mt-3 text-sm leading-relaxed font-light text-zinc-400 sm:text-base">{site.backgroundIntro}</p>
            {site.resumeUrl && (
              <div className="mt-6 font-mono text-xs sm:mt-8 sm:text-sm">
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactable group inline-flex items-center gap-1.5 text-zinc-400 transition-colors hover:text-white"
                >
                  <span>[ Open Curriculum Vitae ]</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col gap-12 sm:gap-14 lg:w-1/2">
            <Block title="Experience">
              {history.map((item, i) => (
                <Row key={`${item.title}-${item.company}`} index={i} className={`${ROW} gap-0.5`}>
                  <span className={`${ROW_TITLE} font-normal`}>{item.title}</span>
                  <span className={ROW_META}>
                    {item.companyUrl ? (
                      <a
                        href={item.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="interactable underline-offset-4 transition-colors hover:text-white hover:underline"
                      >
                        {item.company}
                      </a>
                    ) : (
                      item.company
                    )}
                    {" · "}
                    {item.period}
                  </span>
                  {item.note && <span className="mt-0.5 font-mono text-xs text-zinc-300">{item.note}</span>}
                  {item.projects && (
                    <span className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] tracking-wider uppercase">
                      {item.projects.map((slug) => {
                        const project = projectBySlug(slug);
                        return (
                          project && (
                            <Link
                              key={slug}
                              href={`/projects/${slug}`}
                              className="interactable text-zinc-500 transition-colors hover:text-white"
                            >
                              ↳ {project.name}
                            </Link>
                          )
                        );
                      })}
                    </span>
                  )}
                </Row>
              ))}
            </Block>

            <Block title="Skills">
              {site.skills.map((group, i) => (
                <Row key={group.category} index={i} className={`${ROW} gap-1`}>
                  <span className={`${ROW_TITLE} font-medium`}>{group.category}</span>
                  <span className="text-sm leading-relaxed font-light text-zinc-300">{group.technologies}</span>
                </Row>
              ))}
            </Block>

            {site.awards.length > 0 && (
              <Block title="Awards">
                {site.awards.map((award, i) => (
                  <Row key={`${award.title}-${award.date}`} index={i} className={`${ROW} gap-0.5`}>
                    <span className={`${ROW_TITLE} font-normal`}>{award.title}</span>
                    <span className={ROW_META}>
                      {award.org} · {award.date}
                    </span>
                    {award.team && <span className="mt-0.5 font-mono text-xs text-zinc-500">{award.team}</span>}
                    {award.note && (
                      <span className="mt-1 text-xs leading-relaxed font-light text-zinc-400 sm:text-[13px]">{award.note}</span>
                    )}
                  </Row>
                ))}
              </Block>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
