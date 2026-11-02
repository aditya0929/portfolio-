# Portfolio

A personal portfolio rebuilt from the structure of [adithyakrishnan.com](https://www.adithyakrishnan.com/): an interactive ASCII-rendered Three.js neural network in the hero, smooth scrolling, scroll-linked motion, and a case-study page for every project.

Next.js 16 (App Router), React 19, Tailwind CSS 4, Motion, Lenis and Three.js.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all pages are prerendered)
npm start
```

## Deploy on Vercel

The repo deploys on Vercel as-is, with no extra configuration:

1. Go to [vercel.com/new](https://vercel.com/new) and import `aditya0929/portfolio-`.
2. Keep the detected defaults (framework **Next.js**, build command `next build`) and click **Deploy**.

Every push to `main` redeploys. Social-preview links use the Vercel production domain automatically; if you add a custom domain, set `url` in `src/data/portfolio.ts` to it.

## Edit your content

Everything personal lives in three files:

| File | What's in it |
| --- | --- |
| `src/data/portfolio.ts` | Name, hero lines, quote, socials, experience, education, skills, awards, section intros, SEO text |
| `src/data/projects.ts` | Selected Works: card text, metrics, links, and the full case study for each project |
| `src/data/open-source.ts` | Open Source section: merged-PR count, contributions, and case studies for featured PRs |

- **Add a project:** add an object to `projects` with a new `slug`. It gets a card on the home page and a page at `/projects/<slug>` automatically. The first entry in `caseStudy.metrics` is also shown on the card.
- **Filter tabs** come from each project's `category` (currently `WORK` and `PERSONAL`).
- **Screenshots:** put an image in `public/` and set `image` on the project (2:1 works best). Without one, the card shows a typographic panel.
- **Backdrops:** `limestone`, `slate`, `terracotta` and `moss` are built-in textured gradients. You can also give a path to your own photo, e.g. `"/backdrops/wall.jpg"`.
- **Link a role to its projects:** set `projects: ["slug", ...]` on an experience entry.
- **Resume:** replace `public/resume.pdf`, or remove `resumeUrl` to hide the link.
- **Optional extras:** `bookingUrl` adds "Book a Meeting" to the footer, `url` sets a custom domain for social previews, and `status.discordId` turns on live Discord presence via [Lanyard](https://github.com/Phineas/lanyard), which also speeds up the hero network while you code and makes it pulse to a beat while you listen to music.

## Where things are

| Path | Piece |
| --- | --- |
| `src/components/hero/network-canvas.tsx` | The hero neural network: a Three.js scene rendered off-screen and redrawn as ASCII (`ascii-pass.ts`) each frame. Set `hero.visual: "ghost"` for the original site's ghost (`ghost-canvas.tsx`) |
| `src/components/projects-section.tsx`, `project-preview.tsx` | Selected Works cards |
| `src/components/case-study/` | Project pages |
| `src/components/smooth-scroll.tsx` | Lenis smooth scrolling and same-page anchor links |
| `src/components/loading-screen.tsx` | Intro loader |
