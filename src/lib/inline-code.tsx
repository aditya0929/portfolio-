/** Renders `backtick` spans in data strings as inline code. */
export function withInlineCode(text: string) {
  return text.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className="rounded-sm bg-white/[0.07] px-1 py-0.5 font-mono text-[0.88em] text-zinc-100">
        {part}
      </code>
    ) : (
      part
    ),
  );
}
