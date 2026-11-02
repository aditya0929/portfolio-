"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useState } from "react";
import { site } from "@/data/portfolio";
import { reveal } from "@/lib/motion";

export function ContactSection() {
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
    } catch {
      return; // clipboard blocked (e.g. insecure context); the mailto link above still works
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section
      id="contact"
      className="relative w-full border-b border-white/10 bg-black px-6 py-14 sm:px-12 sm:py-20 md:px-20 md:py-28 lg:px-28 xl:px-36"
    >
      <div className="flex w-full flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
        <motion.div {...reveal(reduced, { y: 24 })} className="flex flex-col lg:sticky lg:top-24 lg:w-1/2">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs tracking-widest text-zinc-500 uppercase sm:mb-3">
            <span>[ 04 // GET IN TOUCH ]</span>
          </div>
          <h2 className="font-display text-3xl leading-none font-light tracking-tight text-white sm:text-4xl md:text-5xl">
            Contact
          </h2>
          <p className="mt-3 text-sm leading-relaxed font-light text-zinc-400 sm:text-base">{site.contactIntro}</p>
        </motion.div>

        <motion.div {...reveal(reduced, { y: 24, delay: 0.1 })} className="flex flex-col lg:w-1/2">
          <span className="font-sans text-xs text-zinc-400 sm:text-sm">Email</span>
          <a
            href={`mailto:${site.email}`}
            className="mt-2 text-2xl font-light tracking-tight break-words text-white transition-colors hover:text-zinc-300 sm:text-4xl"
          >
            {site.email}
          </a>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4 font-mono text-xs text-zinc-400">
            <button onClick={copyEmail} className="cursor-pointer text-zinc-300 transition-colors hover:text-white">
              [ {copied ? "Copied!" : "Copy Email"} ]
            </button>
          </div>

          {site.phone && (
            <>
              <span className="mt-10 font-sans text-xs text-zinc-400 sm:text-sm">Phone</span>
              <a
                href={`tel:${site.phone.replace(/[^\d+]/g, "")}`}
                className="mt-2 text-2xl font-light tracking-tight text-white transition-colors hover:text-zinc-300 sm:text-4xl"
              >
                {site.phone}
              </a>
            </>
          )}

          {site.socials
            .filter((social) => social.inContact)
            .map((social) => (
              <Fragment key={social.href}>
                <span className="mt-10 font-sans text-xs text-zinc-400 sm:text-sm">{social.label}</span>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-2 inline-flex w-fit items-baseline gap-3 text-2xl font-light tracking-tight break-words text-white transition-colors hover:text-zinc-300 sm:text-4xl"
                >
                  <span>{social.handle}</span>
                  <span className="text-lg text-zinc-500 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:text-2xl">
                    ↗
                  </span>
                </a>
              </Fragment>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
