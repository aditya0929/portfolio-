import type { WebGLRenderer } from "three";

/** Darkest → brightest. Each sampled pixel of the WebGL frame becomes one of these glyphs. */
const ASCII_RAMP = " .·:+=*#";

/**
 * Redraws a WebGL canvas as monospace glyphs: each frame is downsampled to one pixel per
 * character cell, and that pixel's brightness picks the glyph. The WebGL canvas stays in the
 * DOM (hidden) as the source; if 2D canvases aren't available it is shown directly instead.
 */
export function createAsciiPass(container: HTMLElement, renderer: WebGLRenderer) {
  const canvas = document.createElement("canvas");
  canvas.className = "pointer-events-none absolute inset-0";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const sampler = document.createElement("canvas");
  const samplerCtx = sampler.getContext("2d", { willReadFrequently: true });
  renderer.domElement.style.opacity = ctx && samplerCtx ? "0" : "1";

  const resize = (width: number, height: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx?.scale(dpr, dpr);
  };

  const draw = (width: number, height: number) => {
    if (!ctx || !samplerCtx) return;
    const mobile = width < 768;
    const cellW = mobile ? 8.5 : 10;
    const cellH = mobile ? 13 : 15;
    const cols = Math.floor(width / cellW);
    const rows = Math.floor(height / cellH);
    if (sampler.width !== cols || sampler.height !== rows) {
      sampler.width = cols;
      sampler.height = rows;
    }
    samplerCtx.clearRect(0, 0, cols, rows);
    samplerCtx.drawImage(renderer.domElement, 0, 0, cols, rows);
    const px = samplerCtx.getImageData(0, 0, cols, rows).data;

    ctx.clearRect(0, 0, width, height);
    ctx.font = `bold ${mobile ? 11 : 12}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const last = ASCII_RAMP.length - 1;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const i = (row * cols + col) * 4;
        if (px[i + 3] < 10) continue;
        const lum = (0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2]) / 255;
        ctx.fillStyle = `rgba(230, 240, 248, ${Math.min(0.28 + 0.56 * lum, 0.86)})`;
        ctx.fillText(ASCII_RAMP[Math.min(Math.floor(lum * last), last)], col * cellW + cellW / 2, row * cellH + cellH / 2);
      }
    }
  };

  return { resize, draw, dispose: () => canvas.remove() };
}
