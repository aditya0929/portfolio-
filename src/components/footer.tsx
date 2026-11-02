"use client";

import { useLenis } from "lenis/react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import { site } from "@/data/portfolio";
import { reveal } from "@/lib/motion";

const ROW =
  "flex items-center justify-between border-b border-white/5 pb-2 text-zinc-300 transition-colors hover:text-white";

function Heading({ children }: { children: ReactNode }) {
  return (
    <h4 className="mb-6 inline-block w-fit cursor-default text-xl font-light tracking-tight text-white transition-colors hover:text-zinc-200">
      {children}
    </h4>
  );
}

function NavLink({ href, arrow = "↑", children }: { href: string; arrow?: string; children: ReactNode }) {
  const content = (
    <>
      <span>{children}</span>
      <span className="text-zinc-500">{arrow}</span>
    </>
  );
  // Internal "/#section" links work from every page: they glide on the home page and navigate elsewhere.
  return href.startsWith("/") ? (
    <Link href={href} className={ROW}>
      {content}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={ROW}>
      {content}
    </a>
  );
}

const noSubscribe = () => () => {};

export function Footer() {
  const reduced = useReducedMotion();
  const lenis = useLenis();
  // Read on the client only: the page is prerendered, so a build-time year would go stale.
  const year = useSyncExternalStore(noSubscribe, () => new Date().getFullYear(), () => null);
  const scrollToTop = () => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }));

  return (
    <footer className="w-full bg-black px-6 py-16 text-zinc-400 sm:px-12 md:px-20 md:py-24 lg:px-28 xl:px-36"
    >
      <div className="flex w-full flex-col justify-between gap-12">
        <motion.div {...reveal(reduced, { y: 24, amount: 0.15 })} className="grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-24">
          <div className="flex flex-col">
            <Heading>Contact</Heading>
            <div className="flex flex-col gap-3 font-sans text-xs sm:text-sm">
              {site.socials.map((social) => (
                <div key={social.href} className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">{social.label}</span>
                  <a
                    href={social.href}
                    {...(social.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                    className="text-zinc-300 transition-colors hover:text-white"
                  >
                    {social.handle}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <Heading>Navigation</Heading>
            <div className="flex flex-col gap-3 font-sans text-xs sm:text-sm">
              <button onClick={scrollToTop} className={`${ROW} cursor-pointer text-left`}>
                <span>{site.name}</span>
                <span className="text-zinc-500">↑</span>
              </button>
              <NavLink href="/#projects">
                Projects
              </NavLink>
              <NavLink href="/#open-source">
                Open Source
              </NavLink>
              <NavLink href="/#achievements">
                Background
              </NavLink>
              {site.bookingUrl && (
                <NavLink href={site.bookingUrl} arrow="→">
                  Book a Meeting
                </NavLink>
              )}
              <NavLink href="/#contact">
                Contact
              </NavLink>
            </div>
          </div>
        </motion.div>

        {site.quote && (
          <motion.blockquote
            {...reveal(reduced, { y: 16, duration: 0.6 })}
            className="block max-w-sm border-l border-white/20 pl-3.5 sm:hidden"
          >
            <p className="font-mono text-xs leading-relaxed text-zinc-300 italic">“{site.quote.text}”</p>
            <cite className="mt-1.5 block font-mono text-[11px] text-zinc-500 not-italic">— {site.quote.author}</cite>
          </motion.blockquote>
        )}

        <motion.div
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="flex items-center justify-between pt-8 font-mono text-xs text-zinc-600"
        >
          <span>
            © {year} {site.name}
          </span>
        </motion.div>
      </div>
    </footer>
  );
}
