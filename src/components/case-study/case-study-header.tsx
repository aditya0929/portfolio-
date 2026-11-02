import Link from "next/link";
import { site } from "@/data/portfolio";

const LINK = "interactable text-zinc-400 transition-colors hover:text-white";

/** Fixed top bar for inner pages (the home page uses the hero header instead). */
export function CaseStudyHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b border-white/10 bg-black/85 px-6 py-4 backdrop-blur-md sm:px-12 md:px-20 lg:px-28 xl:px-36">
      <Link
        href="/"
        className="interactable truncate text-xs font-medium tracking-wide text-white transition-colors hover:text-zinc-300"
      >
        {site.name}
      </Link>
      <nav className="flex shrink-0 items-center gap-3.5 font-mono text-[11px] sm:gap-6 sm:text-[12px]">
        <Link href="/#projects" className={LINK}>
          Projects
        </Link>
        <Link href="/#open-source" className={LINK}>
          Open Source
        </Link>
        <Link href="/#achievements" className={LINK}>
          Background
        </Link>
        <Link href="/#contact" className={LINK}>
          Contact
        </Link>
        {site.resumeUrl && (
          <a
            href={site.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="interactable hidden text-zinc-500 transition-colors hover:text-zinc-300 md:inline"
          >
            Resume ↗
          </a>
        )}
      </nav>
    </header>
  );
}
