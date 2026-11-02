"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import type { Item, Project } from "@/data/projects";
import { withInlineCode } from "@/lib/inline-code";
import { EASE, reveal } from "@/lib/motion";
import { ProjectPreview } from "../project-preview";

const PAD = "px-6 sm:px-12 md:px-20 lg:px-28 xl:px-36";

/** Two-column block: sticky label and title on the left, content on the right (like the home sections). */
function Block({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <section className={`w-full border-t border-white/10 py-14 sm:py-20 ${PAD}`}>
      <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:gap-24">
        <motion.div {...reveal(reduced, { y: 20 })} className="flex flex-col lg:sticky lg:top-24 lg:w-1/3">
          <div className="mb-2 font-mono text-xs tracking-widest text-zinc-500 uppercase sm:mb-3">[ {label} ]</div>
          <h2 className="font-display text-2xl leading-none font-light tracking-tight text-white sm:text-3xl md:text-4xl">
            {title}
          </h2>
        </motion.div>
        <motion.div {...reveal(reduced, { y: 20, delay: 0.08 })} className="flex min-w-0 flex-col lg:w-2/3">
          {children}
        </motion.div>
      </div>
    </section>
  );
}

/** "https://www.github.com/a/b/" → "github.com/a/b"; site-relative paths show just the file name. */
function displayUrl(href: string) {
  if (href.startsWith("/")) return href.split("/").pop() ?? href;
  const url = new URL(href);
  return `${url.hostname.replace(/^www\./, "")}${url.pathname}`.replace(/\/$/, "");
}

function Paragraphs({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-base leading-relaxed font-light text-zinc-300 sm:text-lg">
          {withInlineCode(paragraph)}
        </p>
      ))}
    </div>
  );
}

/** Numbered rows of titled paragraphs, used for pipeline steps and contributions. */
function ItemList({ items }: { items: Item[] }) {
  return (
    <ol className="flex flex-col divide-y divide-white/5 border-t border-white/10">
      {items.map((item, i) => (
        <li key={item.title} className="grid grid-cols-[2rem_1fr] gap-x-3 py-5 sm:grid-cols-[3rem_1fr] sm:py-6">
          <span className="pt-1 font-mono text-xs text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <h3 className="text-base font-normal tracking-tight text-white sm:text-lg">{item.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed font-light text-zinc-300 sm:text-[15px]">{withInlineCode(item.body)}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** A short unified diff: "+" lines green, "-" lines red, everything else as context. */
function DiffBlock({ file, diff }: { file: string; diff: string }) {
  return (
    <figure className="mt-8 overflow-hidden rounded-md border border-white/10 bg-zinc-950">
      <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-[11px] text-zinc-500">{file}</figcaption>
      <pre className="overflow-x-auto py-3 font-mono text-xs leading-relaxed sm:text-[13px]">
        {diff.split(/\r?\n/).map((line, i) => (
          <div
            key={i}
            className={`px-4 whitespace-pre ${
              line.startsWith("+")
                ? "bg-emerald-500/10 text-emerald-300"
                : line.startsWith("-")
                  ? "bg-red-500/10 text-red-300"
                  : "text-zinc-400"
            }`}
          >
            {line || " "}
          </div>
        ))}
      </pre>
    </figure>
  );
}

export function CaseStudy({
  project,
  index,
  next,
  kicker,
  back,
}: {
  project: Project;
  index: number;
  next: Project;
  /** e.g. "CASE STUDY" or "OPEN SOURCE"; shown with the project's number. */
  kicker: string;
  back: { href: string; label: string };
}) {
  const reduced = useReducedMotion();
  const { caseStudy } = project;
  const number = String(index + 1).padStart(2, "0");
  const meta: [string, string | undefined][] = [
    ["TYPE", project.type],
    ["EVENT", project.event],
    ["ROLE", project.role],
    ["YEAR", project.year],
    ["STATUS", project.status],
  ];

  // Number the sections in the order they appear, skipping the ones a project doesn't have.
  const sections: { title: string; content: ReactNode }[] = [];
  if (caseStudy.product) {
    const { url, paragraphs, features } = caseStudy.product;
    sections.push({
      title: "The product",
      content: (
        <div className="flex flex-col gap-6">
          <Paragraphs paragraphs={paragraphs} />
          <ol className="grid grid-cols-1 border-t border-l border-white/10 sm:grid-cols-2">
            {features.map((feature, i) => (
              <li key={feature.title} className="flex flex-col border-r border-b border-white/10 p-5">
                <span className="font-mono text-[11px] text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-base font-normal tracking-tight text-white">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed font-light text-zinc-300">{feature.body}</p>
              </li>
            ))}
          </ol>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="interactable group inline-flex w-fit items-center gap-2 border border-white bg-white px-4 py-2.5 font-mono text-xs tracking-widest text-black uppercase transition-colors hover:bg-zinc-200"
          >
            <span>Visit {displayUrl(url)}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </a>
        </div>
      ),
    });
  }
  sections.push({ title: "The problem", content: <Paragraphs paragraphs={caseStudy.problem} /> });
  if (caseStudy.myWork?.length) {
    sections.push({ title: "My work", content: <ItemList items={caseStudy.myWork} /> });
  }
  sections.push({
    title: caseStudy.approachTitle ?? "How it works",
    content: (
      <>
        <ItemList items={caseStudy.approach} />
        {caseStudy.code && <DiffBlock file={caseStudy.code.file} diff={caseStudy.code.diff} />}
      </>
    ),
  });
  if (caseStudy.highlights?.length) {
    sections.push({
      title: "Worth noting",
      content: (
        <ul className="flex flex-col divide-y divide-white/5 border-t border-white/10">
          {caseStudy.highlights.map((item) => (
            <li key={item} className="grid grid-cols-[2rem_1fr] gap-x-3 py-4 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-zinc-500">↳</span>
              <p className="text-sm leading-relaxed font-light text-zinc-300 sm:text-[15px]">{withInlineCode(item)}</p>
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (caseStudy.figures?.length) {
    sections.push({
      title: "Figures",
      content: (
        <div className="flex flex-col gap-10">
          {caseStudy.figures.map((figure) => (
            <figure key={figure.src} className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-md border border-white/15 bg-white">
                <Image
                  src={figure.src}
                  alt={figure.alt}
                  width={figure.width}
                  height={figure.height}
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="font-mono text-[11px] text-zinc-500 sm:text-xs">{figure.caption}</figcaption>
            </figure>
          ))}
        </div>
      ),
    });
  }
  if (caseStudy.roadmap?.length) {
    sections.push({
      title: "Roadmap",
      content: (
        <ol className="flex flex-col divide-y divide-white/5 border-t border-white/10">
          {caseStudy.roadmap.map((step, i) => (
            <li key={step} className="grid grid-cols-[2rem_1fr] gap-x-3 py-4 sm:grid-cols-[3rem_1fr]">
              <span className="font-mono text-xs text-zinc-500">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-sm leading-relaxed font-light text-zinc-300 sm:text-[15px]">{step}</p>
            </li>
          ))}
        </ol>
      ),
    });
  }
  if (project.links?.length) {
    sections.push({
      title: "Links",
      content: (
        <ul className="flex flex-col divide-y divide-white/5 border-t border-white/10">
          {project.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="interactable group flex items-center justify-between gap-4 py-4"
              >
                <span className="text-sm text-white sm:text-[15px]">{link.name ?? link.label}</span>
                <span className="flex min-w-0 items-center gap-2 font-mono text-xs text-zinc-400 transition-colors group-hover:text-white">
                  <span className="truncate">{displayUrl(link.href)}</span>
                  <span className="shrink-0">↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ),
    });
  }
  sections.push({
    title: "Stack",
    content: (
      <div className="flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <span
            key={tech}
            className="border border-white/10 px-3 py-1.5 font-mono text-[11px] tracking-wider text-zinc-300 uppercase"
          >
            {tech}
          </span>
        ))}
      </div>
    ),
  });

  return (
    <article className="w-full">
      <section className={`w-full pt-28 pb-10 sm:pt-36 sm:pb-14 md:pt-40 ${PAD}`}>
        <Link
          href={back.href}
          className="interactable inline-flex items-center gap-2 font-mono text-[11px] text-zinc-500 transition-colors hover:text-white"
        >
          ← {back.label}
        </Link>
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="mt-10 font-mono text-xs tracking-widest text-zinc-500 uppercase">
            {`[ ${kicker} // ${number} ]`}
          </div>
          <h1 className="mt-3 font-display text-4xl leading-[0.95] font-light tracking-tight text-white uppercase sm:text-6xl md:text-7xl">
            {project.name}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed font-light text-zinc-300 sm:text-lg">{withInlineCode(project.summary)}</p>

          <div className="mt-10 flex flex-col justify-between gap-6 border-t border-white/10 pt-6 sm:flex-row sm:items-end">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-sans text-xs tracking-wider uppercase sm:text-[13px]">
              {meta
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <Fragment key={label}>
                    <span className="text-zinc-500">{label}</span>
                    <span className="font-medium text-zinc-200">{value}</span>
                  </Fragment>
                ))}
            </div>
            {project.links && (
              <div className="flex flex-wrap items-center gap-4 font-mono text-xs tracking-wider uppercase">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactable text-white transition-colors hover:text-zinc-300"
                  >
                    [ {link.label} ↗ ]
                  </a>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <section className={`w-full pb-14 sm:pb-20 ${PAD}`}>
        <div className="group relative flex h-[260px] w-full items-center justify-center overflow-hidden border border-white/15 bg-zinc-950 select-none sm:h-[380px] md:h-[460px] lg:h-[520px]">
          <ProjectPreview project={project} index={index} preload />
        </div>

        <div
          className={`mt-10 grid grid-cols-1 border-t border-l border-white/10 sm:grid-cols-2 ${
            caseStudy.metrics.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
          }`}
        >
          {caseStudy.metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              {...reveal(reduced, { y: 14, amount: 0.3, duration: 0.6, delay: 0.06 * i })}
              className="flex flex-col border-r border-b border-white/10 p-5 sm:p-6"
            >
              <span className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{metric.value}</span>
              <span className="mt-2 text-sm text-zinc-300">{metric.label}</span>
              {metric.note && <span className="mt-1 font-mono text-[11px] text-zinc-500">{metric.note}</span>}
            </motion.div>
          ))}
        </div>
      </section>

      {sections.map((section, i) => (
        <Block key={section.title} label={`${String(i + 1).padStart(2, "0")} // ${section.title.toUpperCase()}`} title={section.title}>
          {section.content}
        </Block>
      ))}

      <section className={`w-full border-t border-white/10 ${PAD}`}>
        <Link href={`/projects/${next.slug}`} className="group block py-16 sm:py-24">
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">[ NEXT PROJECT ]</span>
          <span className="mt-3 flex items-center justify-between gap-6">
            <span className="font-display text-3xl leading-none font-light tracking-tight text-white uppercase transition-colors group-hover:text-zinc-300 sm:text-6xl">
              {next.name}
            </span>
            <span className="text-2xl text-zinc-500 transition-transform duration-300 group-hover:translate-x-2 group-hover:text-white sm:text-4xl">
              →
            </span>
          </span>
        </Link>
      </section>
    </article>
  );
}
