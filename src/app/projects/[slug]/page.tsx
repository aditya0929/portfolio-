import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/case-study/case-study";
import { CaseStudyHeader } from "@/components/case-study/case-study-header";
import { Footer } from "@/components/footer";
import { openSourceCaseStudies } from "@/data/open-source";
import { site } from "@/data/portfolio";
import { projects } from "@/data/projects";

// Selected Works and featured open-source PRs share this page design.
const collections = [
  { items: projects, kicker: "CASE STUDY", back: { href: "/#projects", label: "Back to Selected Works" } },
  { items: openSourceCaseStudies, kicker: "OPEN SOURCE", back: { href: "/#open-source", label: "Back to Open Source" } },
];

function find(slug: string) {
  for (const collection of collections) {
    const index = collection.items.findIndex((project) => project.slug === slug);
    if (index === -1) continue;
    const { items } = collection;
    // "Next project" stays within the same list; a single-item list points back to Selected Works.
    const next = items.length > 1 ? items[(index + 1) % items.length] : projects[0];
    return { ...collection, index, project: items[index], next };
  }
}

export function generateStaticParams() {
  return collections.flatMap(({ items }) => items.map((project) => ({ slug: project.slug })));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const found = find((await params).slug);
  if (!found) return {};
  const title = `${found.project.name} — ${site.name}`;
  const description = found.project.summary;
  return { title, description, openGraph: { title, description }, twitter: { title, description } };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const found = find((await params).slug);
  if (!found) notFound();

  return (
    <>
      <CaseStudyHeader />
      <main className="flex min-h-screen w-full flex-col items-center bg-black">
        <CaseStudy
          project={found.project}
          index={found.index}
          next={found.next}
          kicker={found.kicker}
          back={found.back}
        />
        <div id="footer-curtain" className="relative z-30 w-full border-t border-white/10 bg-black">
          <Footer />
        </div>
      </main>
    </>
  );
}
