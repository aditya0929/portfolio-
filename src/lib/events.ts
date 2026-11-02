const INTERACTIVE = ".interactable, a, button, [role='button']";

/**
 * Lets the hero visual react to the whole page: `onInteract` fires when the pointer starts or
 * stops hovering something clickable, `onPress` on every mouse press. Returns a cleanup function.
 */
export function watchPointer({
  onInteract,
  onPress,
}: {
  onInteract: (hovering: boolean) => void;
  onPress: () => void;
}) {
  let hovering = false;
  const onMove = (event: MouseEvent) => {
    const next = event.target instanceof Element && event.target.closest(INTERACTIVE) !== null;
    if (next === hovering) return;
    hovering = next;
    onInteract(next);
  };
  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener("mousedown", onPress, { passive: true });
  return () => {
    window.removeEventListener("mousemove", onMove);
    window.removeEventListener("mousedown", onPress);
  };
}
