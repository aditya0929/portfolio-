/** The site's signature ease-out curve (expo-like). */
export const EASE = [0.16, 1, 0.3, 1] as const;

type RevealOptions = {
  y?: number;
  amount?: number;
  duration?: number;
  delay?: number;
};

/** Fade-and-rise on scroll into view; replays every time, like the original. */
export function reveal(
  reducedMotion: boolean | null,
  { y = 0, amount = 0.2, duration = 0.7, delay = 0 }: RevealOptions = {},
) {
  return {
    initial: reducedMotion ? false : { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount },
    transition: { duration, delay, ease: EASE },
  } as const;
}
