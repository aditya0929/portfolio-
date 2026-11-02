import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { AppClientShell } from "@/components/app-client-shell";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/data/portfolio";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"] });

const title = `${site.name} — ${site.role}`;

// On Vercel, fall back to the production domain so social previews get absolute URLs.
const siteUrl =
  site.url ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined);

export const metadata: Metadata = {
  ...(siteUrl && { metadataBase: new URL(siteUrl) }),
  title,
  description: site.meta.description,
  keywords: site.meta.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    title,
    description: site.meta.description,
    siteName: site.name,
    type: "website",
    locale: "en_US",
    ...(siteUrl && { url: siteUrl }),
  },
  twitter: { card: "summary_large_image", title, description: site.meta.description },
};

export const viewport: Viewport = {
  themeColor: "#060606",
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full min-h-screen w-full scroll-smooth bg-black`}
    >
      <body className="font-sans">
        <SmoothScroll>
          <div className="h-full min-h-screen w-full bg-black text-white selection:bg-white selection:text-black">
            <AppClientShell>{children}</AppClientShell>
          </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
