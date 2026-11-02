import Image from "next/image";
import type { ReactNode } from "react";
import type { Backdrop, Project } from "@/data/projects";

// Film-grain overlay so the gradient backdrops read as textured surfaces rather than flat fills.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// Stand-ins for the original's editorial photos: sunlit limestone, slate, a terracotta wall, moss.
const PRESETS: Record<string, string> = {
  limestone: "radial-gradient(120% 90% at 18% 12%, #ece0c8 0%, #cdb894 42%, #8a7657 100%)",
  slate: "radial-gradient(120% 90% at 22% 10%, #96a3b0 0%, #59656f 45%, #222930 100%)",
  terracotta: "radial-gradient(120% 90% at 18% 12%, #e65a42 0%, #b23524 45%, #5a170f 100%)",
  moss: "radial-gradient(120% 90% at 22% 10%, #9db091 0%, #5c7052 45%, #222d21 100%)",
};
const ROTATION = Object.keys(PRESETS);

/**
 * The framed project visual: a textured backdrop with the screenshot (or a typographic
 * panel showing the headline metric) floating on top. Hover effects key off a parent `group`.
 */
export function ProjectPreview({
  project,
  index,
  preload,
  children,
}: {
  project: Project;
  index: number;
  preload?: boolean;
  /** Overlays such as the hover badge. */
  children?: ReactNode;
}) {
  const backdrop: Backdrop = project.backdrop ?? ROTATION[index % ROTATION.length];
  const preset = PRESETS[backdrop];
  const metric = project.caseStudy.metrics[0];

  return (
    <>
      <div className="absolute inset-0 z-0 overflow-hidden">
        {preset ? (
          <div
            className="absolute inset-0 scale-105 transition-transform duration-700 ease-out group-hover:scale-100"
            style={{ backgroundImage: `${GRAIN}, ${preset}` }}
          />
        ) : (
          <Image
            src={backdrop}
            alt=""
            fill
            preload={preload}
            sizes="(max-width: 768px) 100vw, 70vw"
            className="scale-105 object-cover object-center transition-transform duration-700 ease-out group-hover:scale-100"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/40" />
      </div>

      <div className="relative z-10 w-[88%] max-w-[740px] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.015] sm:w-[84%] md:w-[80%] xl:w-[78%]">
        <div className="relative aspect-[2/1] w-full overflow-hidden rounded-md border border-white/20 bg-zinc-950 shadow-[0_25px_60px_rgba(0,0,0,0.85)] sm:rounded-lg">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              preload={preload}
              sizes="(max-width: 768px) 90vw, 740px"
              className="object-cover object-top"
            />
          ) : (
            // Container units size the type to the panel, so long names fit both the card and the case-study hero.
            <div className="@container absolute inset-0 flex flex-col justify-between p-5 sm:p-8">
              <div className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-widest text-zinc-500 uppercase sm:text-xs">
                <span>{project.type}</span>
                <span>{project.status ?? project.year}</span>
              </div>
              <span className="line-clamp-2 font-display text-[clamp(1.25rem,8.5cqi,3rem)] leading-none font-light tracking-tight text-white uppercase">
                {project.name}
              </span>
              {metric && (
                <div className="flex items-center gap-3 border-t border-white/10 pt-3 sm:pt-4">
                  <span className="shrink-0 text-[clamp(1.125rem,6cqi,1.875rem)] font-semibold text-white">{metric.value}</span>
                  <span className="line-clamp-2 font-mono text-[10px] leading-snug tracking-widest text-zinc-400 uppercase sm:text-xs">
                    {metric.label}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {children}
    </>
  );
}
