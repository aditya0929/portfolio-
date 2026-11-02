"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { site } from "@/data/portfolio";
import { projects, type Project } from "@/data/projects";
import { reveal } from "@/lib/motion";
import { ProjectPreview } from "./project-preview";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const href = `/projects/${project.slug}`;
  const number = String(index + 1).padStart(2, "0");
  const meta: [string, string | undefined][] = [
    ["TYPE", project.type],
    ["EVENT", project.event],
    ["ROLE", project.role],
    ["YEAR", project.year],
  ];

  return (
    <motion.article
      {...reveal(reduced, { y: 32 })}
      viewport={{ once: false, amount: 0.12, margin: "0px 0px -40px 0px" }} // overrides reveal's viewport
      className="group relative flex w-full scroll-mt-28 flex-col"
    >
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="min-w-0 text-2xl leading-tight font-light tracking-tight text-white uppercase sm:text-3xl md:text-4xl">
          <Link
            href={href}
            className="inline-flex flex-wrap items-baseline gap-x-2.5 transition-colors hover:text-zinc-300"
          >
            <span>{project.name}</span>
            <span className="font-mono text-xs font-normal tracking-widest whitespace-nowrap text-zinc-500 sm:text-sm">
              [OPEN →]
            </span>
          </Link>
        </h3>
        <div className="flex shrink-0 items-center gap-3 font-mono text-xs tracking-widest text-zinc-500 uppercase">
          {project.status && (
            <span className="hidden border border-white/20 px-2 py-0.5 text-[10px] text-zinc-300 sm:inline">
              {project.status}
            </span>
          )}
          <span>[ {number} ]</span>
        </div>
      </div>

      <Link
        href={href}
        className="relative flex h-[240px] w-full cursor-pointer items-center justify-center overflow-hidden border border-white/15 bg-zinc-950 transition-all duration-700 select-none hover:border-white/40 sm:h-[320px] md:h-[380px] lg:h-[400px] xl:h-[440px]"
      >
        <ProjectPreview project={project} index={index} preload={index < 2}>
          <div className="absolute right-4 bottom-4 z-20 flex translate-y-2 items-center gap-2 border border-white/20 bg-zinc-950/90 px-3.5 py-1.5 font-mono text-[10px] tracking-widest text-white uppercase opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:right-5 sm:bottom-5 sm:text-xs">
            <span>Read Case Study</span>
            <span className="text-zinc-400">→</span>
          </div>
        </ProjectPreview>
      </Link>

      <motion.div
        {...reveal(reduced, { y: 14, amount: 0.1, duration: 0.6, delay: 0.08 })}
        className="flex flex-col items-start justify-between gap-6 pt-6 sm:flex-row sm:gap-8 lg:flex-col 2xl:flex-row"
      >
        <div className="grid shrink-0 grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-sans text-xs tracking-wider uppercase select-none sm:text-[13px]">
          {meta
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <Fragment key={label}>
                <span className="font-normal text-zinc-500">{label}</span>
                <span className="font-medium text-zinc-200">{value}</span>
              </Fragment>
            ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3.5">
          <p className="text-xs leading-relaxed font-light text-zinc-300 sm:text-sm md:text-[14px]">{project.description}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-2 font-mono text-[11px] tracking-wider uppercase sm:text-xs">
            <div className="flex items-center gap-2 truncate text-zinc-400">
              <span className="font-medium text-zinc-500">STACK</span>
              <span className="text-zinc-300">{project.stack.slice(0, 4).join(", ")}</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {project.links?.slice(0, 3).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactable text-zinc-400 transition-colors hover:text-white"
                >
                  [ {link.label} ↗ ]
                </a>
              ))}
              <Link href={href} className="interactable text-white transition-colors hover:text-zinc-300">
                [ CASE STUDY → ]
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}

export function ProjectsSection() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState("ALL");

  const tabs = useMemo(() => {
    const count = (n: number) => String(n).padStart(2, "0");
    const categories = [...new Set(projects.map((p) => p.category))];
    return [
      { id: "ALL", label: `ALL [${count(projects.length)}]` },
      ...categories.map((c) => ({ id: c, label: `${c} [${count(projects.filter((p) => p.category === c).length)}]` })),
    ];
  }, []);

  const visible = filter === "ALL" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
      className="relative z-20 w-full border-t border-white/10 bg-black px-6 py-16 sm:px-12 sm:py-20 md:px-20 md:py-24 lg:px-28 xl:px-36"
    >
      <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
        <motion.div
          {...reveal(reduced, { y: 24 })}
          className="mb-12 flex shrink-0 flex-col lg:sticky lg:top-24 lg:mb-0 lg:w-1/2"
        >
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] tracking-widest text-zinc-500 uppercase sm:mb-3 sm:text-xs">
            <span>[ 02 // SELECTED WORKS ]</span>
          </div>
          <h2 className="font-display text-3xl leading-none font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Selected Works
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed font-light text-zinc-400 sm:text-base">{site.projectsIntro}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs select-none sm:mt-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`cursor-pointer border px-3 py-1.5 text-[11px] tracking-wider uppercase transition-all duration-200 ${
                  filter === tab.id
                    ? "border-white bg-white font-medium text-black"
                    : "border-white/10 bg-black/60 text-zinc-500 hover:border-white/30 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {site.archiveUrl && (
            <div className="mt-10 hidden max-w-md border-t border-white/10 pt-6 lg:block">
              <span className="mb-2 block font-mono text-[10px] tracking-widest text-zinc-500 uppercase">[ ARCHIVES ]</span>
              <a
                href={site.archiveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-400 transition-colors hover:text-white"
              >
                <span>Explore on GitHub ↗</span>
              </a>
            </div>
          )}
        </motion.div>

        <div className="flex w-full min-w-0 flex-col gap-14 sm:gap-18 md:gap-20 lg:w-1/2">
          {visible.map((project) => (
            <ProjectCard key={project.slug} project={project} index={projects.indexOf(project)} />
          ))}
        </div>
      </div>
    </section>
  );
}
