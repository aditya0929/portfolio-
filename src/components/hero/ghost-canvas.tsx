"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BufferGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  FrontSide,
  Group,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshPhongMaterial,
  type Object3D,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { watchPointer } from "@/lib/events";
import { createAsciiPass } from "./ascii-pass";

type Mood = { isMusic: boolean; isCoding: boolean; isGaming: boolean };

const v = (x: number, y: number, z = 0) => new Vector3(x, y, z);

const lineMaterial = (opacity: number) =>
  new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity });

const lineFrom = (points: Vector3[], material: LineBasicMaterial) =>
  new Line(new BufferGeometry().setFromPoints(points), material);

/** A dome on top of a flared, wavy skirt. `base` keeps rest positions so the hem can ripple each frame. */
function buildBody() {
  const SEG = 40;
  const base: Vector3[] = [];
  const positions: number[] = [];
  for (let i = 0; i <= SEG; i++) {
    const ring = i / SEG; // 0 at the crown, 1 at the hem
    for (let j = 0; j <= SEG; j++) {
      const theta = (j / SEG) * Math.PI * 2;
      let x: number, y: number, z: number;
      if (ring < 0.38) {
        const phi = (ring / 0.38) * (Math.PI / 2);
        x = Math.sin(phi) * Math.cos(theta) * 2.4;
        z = Math.sin(phi) * Math.sin(theta) * 2.4;
        y = 2.4 * Math.cos(phi) + 0.8;
      } else {
        const t = (ring - 0.38) / 0.62;
        const radius = 2.4 * (1 + 0.45 * t) + 0.35 * t * Math.sin(6 * theta);
        x = radius * Math.cos(theta);
        z = radius * Math.sin(theta);
        y = 0.8 - 5.5 * t + t * t * (0.4 * Math.sin(3 * theta) + 0.2 * Math.cos(6 * theta));
      }
      base.push(new Vector3(x, y, z));
      positions.push(x, y, z);
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < SEG; i++) {
    for (let j = 0; j < SEG; j++) {
      const a = i * (SEG + 1) + j;
      const c = a + SEG + 1;
      indices.push(a, a + 1, c + 1, a, c + 1, c);
    }
  }

  const geometry = new BufferGeometry();
  const position = new Float32BufferAttribute(positions, 3);
  geometry.setAttribute("position", position);
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return { geometry, position, base };
}

/** Over-ear headphones with a boom mic; shown while listening to music or gaming. */
function buildHeadphones() {
  const group = new Group();
  const shell = new MeshPhongMaterial({ color: 0xffffff, transparent: true, opacity: 0.16, shininess: 30 });
  const outline = lineMaterial(0.42);
  const add = (geometry: BufferGeometry, place: (o: Object3D) => void = () => {}) => {
    for (const part of [new Mesh(geometry, shell), new LineSegments(new EdgesGeometry(geometry), outline)]) {
      place(part);
      group.add(part);
    }
  };

  const cup = new CylinderGeometry(0.72, 0.72, 0.55, 24);
  for (const x of [-2.48, 2.48]) {
    add(cup, (o) => {
      o.position.set(x, 1.4, 0);
      o.rotation.z = Math.PI / 2;
    });
  }
  add(new TorusGeometry(2.48, 0.12, 8, 36, Math.PI), (o) => o.position.set(0, 1.4, 0));

  const micPath = [v(-2.35, 0.9, 0.15), v(-2, 0.4, 1), v(-1, 0.2, 1.9), v(-0.25, 0.35, 2.2)];
  add(new TubeGeometry(new CatmullRomCurve3(micPath), 20, 0.055, 8, false));
  add(new CylinderGeometry(0.11, 0.11, 0.24, 12), (o) => {
    o.position.copy(micPath[micPath.length - 1]);
    o.rotation.x = Math.PI / 2;
  });
  return group;
}

/** Wireframe glasses; shown while coding. */
function buildGlasses() {
  const group = new Group();
  const material = lineMaterial(0.85);

  // Rounded-rectangle lens: four quarter-circle corners (centre x, centre y, start angle in π units).
  const lens: Vector3[] = [];
  for (const [cx, cy, start] of [
    [0.29, 0.17, 0],
    [-0.29, 0.17, 0.5],
    [-0.29, -0.17, 1],
    [0.29, -0.17, 1.5],
  ]) {
    for (let s = 0; s <= 6; s++) {
      const a = (start + s / 12) * Math.PI;
      lens.push(v(cx + 0.1 * Math.cos(a), cy + 0.1 * Math.sin(a)));
    }
  }
  lens.push(lens[0]);
  const lensGeometry = new BufferGeometry().setFromPoints(lens);

  for (const side of [-1, 1]) {
    const frame = new Line(lensGeometry, material);
    frame.position.set(0.55 * side, 1.5, 2.42);
    frame.rotation.set(0.1, -0.15 * side, 0);
    group.add(frame);
    group.add(lineFrom([v(0.94 * side, 1.5, 2.38), v(1.5 * side, 1.5, 1.8), v(2.1 * side, 1.4, 0.5)], material));
  }
  group.add(lineFrom([v(-0.16, 1.52, 2.44), v(0, 1.55, 2.46), v(0.16, 1.52, 2.44)], material));
  return group;
}

/** Floating `</>` or `{ }` glyph that rises beside the ghost while coding. */
function buildCodeGlyph(kind: "tag" | "braces") {
  const group = new Group();
  const material = lineMaterial(0.85);
  if (kind === "tag") {
    group.add(lineFrom([v(-0.16, 0.16), v(-0.3, 0), v(-0.16, -0.16)], material));
    group.add(lineFrom([v(0.07, 0.2), v(-0.07, -0.2)], material));
    group.add(lineFrom([v(0.16, 0.16), v(0.3, 0), v(0.16, -0.16)], material));
  } else {
    for (const s of [-1, 1]) {
      const brace = new CatmullRomCurve3([
        v(0.16 * s, 0.24),
        v(0.24 * s, 0.2),
        v(0.24 * s, 0.07),
        v(0.31 * s, 0),
        v(0.24 * s, -0.07),
        v(0.24 * s, -0.2),
        v(0.16 * s, -0.24),
      ]);
      group.add(lineFrom(brace.getPoints(20), material));
    }
  }
  return group;
}

/** Floating ♪ or ♫ that rises beside the ghost while music is playing. */
function buildMusicNote(beamed: boolean) {
  const group = new Group();
  const material = lineMaterial(0.85);
  const head: Vector3[] = [];
  for (let s = 0; s <= 16; s++) {
    const a = (s / 16) * Math.PI * 2;
    head.push(v(0.22 * Math.cos(a), 0.18 * Math.sin(a)));
  }
  const headGeometry = new BufferGeometry().setFromPoints(head);

  group.add(new Line(headGeometry, material));
  group.add(lineFrom([v(0.2, 0.1), v(0.2, 0.75)], material));
  if (beamed) {
    const second = new Line(headGeometry, material);
    second.position.set(0.45, 0.08, 0);
    group.add(second);
    group.add(lineFrom([v(0.65, 0.18), v(0.65, 0.83)], material));
    group.add(lineFrom([v(0.2, 0.75), v(0.65, 0.83)], material));
  } else {
    group.add(lineFrom([v(0.2, 0.75), v(0.42, 0.6)], material));
  }
  return group;
}

type Floater = {
  mesh: Group;
  speedY: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  side: -1 | 1;
  age: number;
};

function makeFloaters(scene: Scene, build: (index: number) => Group): Floater[] {
  return [0, 1].map((i) => {
    const mesh = build(i);
    mesh.visible = false;
    scene.add(mesh);
    return {
      mesh,
      speedY: 0.0045 + 0.002 * Math.random(),
      swayAmp: 0.28 + 0.2 * Math.random(),
      swayFreq: 1.1 + 0.5 * Math.random(),
      phase: Math.random() * Math.PI * 2,
      side: i % 2 === 0 ? -1 : 1,
      age: i === 0 ? 0.15 : 0.65,
    };
  });
}

function updateFloaters(floaters: Floater[], active: boolean, anchor: Vector3, t: number, tilt: number, tiltFreq: number) {
  for (const f of floaters) {
    f.mesh.visible = active;
    if (!active) continue;
    f.age += f.speedY;
    if (f.age > 1) f.age = 0;
    f.mesh.position.set(
      anchor.x + f.side * 2.7 + Math.sin(t * f.swayFreq + f.phase) * f.swayAmp,
      anchor.y + 1.2 + 5.5 * f.age,
      anchor.z + 0.3 * Math.cos(0.6 * t + f.phase),
    );
    f.mesh.rotation.z = tilt * Math.sin(tiltFreq * t + f.phase);
    const opacity = 0.85 * Math.sin(f.age * Math.PI);
    f.mesh.traverse((o) => {
      if (o instanceof Line) (o.material as LineBasicMaterial).opacity = opacity;
    });
  }
}

/**
 * The hero mascot: a translucent Three.js ghost rendered off-screen and redrawn every frame as ASCII.
 * Follows the pointer, can be dragged to spin, blinks on clicks, winks on double-click, and
 * wears glasses / headphones depending on the live presence mood.
 */
export default function GhostCanvas({ isMusic = false, isCoding = false, isGaming = false }: Partial<Mood>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<Mood>({ isMusic, isCoding, isGaming });

  useEffect(() => {
    moodRef.current = { isMusic, isCoding, isGaming };
  }, [isMusic, isCoding, isGaming]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // clientWidth/Height ignore the scroll-linked scale applied by the hero, unlike getBoundingClientRect.
    let size = {
      w: Math.max(container.clientWidth || 800, 200),
      h: Math.max(container.clientHeight || 450, 200),
    };

    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size.w, size.h);
    renderer.domElement.className = "pointer-events-none absolute inset-0 transition-opacity duration-300";
    container.appendChild(renderer.domElement);

    const ascii = createAsciiPass(container, renderer);
    ascii.resize(size.w, size.h);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, size.w / size.h, 0.1, 100);
    const placeCamera = (mobile: boolean) =>
      mobile ? camera.position.set(0, 0.35, 15) : camera.position.set(0, -0.2, 13.5);
    placeCamera(size.w < 768);

    scene.add(new AmbientLight(0xffffff, 0.45));
    const keyLight = new DirectionalLight(0xffffff, 0.75);
    keyLight.position.set(5, 10, 7);
    const rimLight = new DirectionalLight(0xffffff, 0.2);
    rimLight.position.set(-5, -5, -5);
    scene.add(keyLight, rimLight);

    const ghost = new Group();
    ghost.scale.setScalar(size.w < 768 ? 0.52 : 0.66);

    const body = buildBody();
    const bodyMaterial = new MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
      side: FrontSide,
      depthWrite: true,
      depthTest: true,
    });
    const bodyMesh = new Mesh(body.geometry, bodyMaterial);
    bodyMesh.renderOrder = 1;
    ghost.add(bodyMesh);

    const eyeGeometry = new SphereGeometry(0.32, 24, 24);
    eyeGeometry.scale(1, 1.6, 0.2);
    const eyeMaterial = new MeshBasicMaterial({ color: 0x000000, depthWrite: true });
    const leftEye = new Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.55, 1.5, 2.3);
    leftEye.rotation.set(0.1, 0.15, 0);
    const rightEye = new Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.55, 1.5, 2.3);
    rightEye.rotation.set(0.1, -0.15, 0);
    ghost.add(leftEye, rightEye);
    ghost.position.y = 0.6;
    scene.add(ghost);

    const headphones = buildHeadphones();
    headphones.visible = false;
    const glasses = buildGlasses();
    glasses.visible = false;
    ghost.add(headphones, glasses);
    const codeGlyphs = makeFloaters(scene, (i) => buildCodeGlyph(i % 2 === 0 ? "tag" : "braces"));
    const notes = makeFloaters(scene, (i) => buildMusicNote(i % 2 === 0));

    // Pointer position in [-1, 1] over the hero, and rotation targets derived from it.
    let pointerX = 0;
    let pointerY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let spin = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let hovering = false;
    let headphonesScale = 0;
    let glassesScale = 0;
    let eyeWidth = 1;
    let eyeHeight = 1;
    let blinkAt = -10;
    let winkAt = -10;
    let hoverAt = -10;
    let offsetX = size.w >= 1024 ? 2.4 : 0;
    let baseY = size.w < 768 ? 1.8 : size.w < 1024 ? 1.1 : 0.2;
    const start = performance.now();
    const elapsed = () => (performance.now() - start) * 0.001;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      if (dragging) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        targetRotY += 0.01 * dx;
        targetRotX += 0.01 * dy;
        spin = 0.005 * dx;
        lastX = event.clientX;
        lastY = event.clientY;
      } else {
        targetRotY = 0.6 * pointerX;
        targetRotX = -0.35 * pointerY;
      }
    };
    const onMouseDown = (event: MouseEvent) => {
      dragging = true;
      blinkAt = elapsed();
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const onDoubleClick = () => {
      winkAt = elapsed();
    };
    const onMouseUp = () => {
      dragging = false;
    };
    const stopWatchingPointer = watchPointer({
      onInteract: (isInteracting) => {
        hovering = isInteracting;
        if (hovering) hoverAt = elapsed();
      },
      onPress: () => {
        blinkAt = elapsed();
      },
    });

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 20 || height <= 20) return;
      const mobile = width < 768;
      // Ignore the height jumps caused by mobile browser toolbars showing and hiding.
      if (mobile && Math.abs(width - size.w) < 10 && Math.abs(height - size.h) < 140) return;
      size = { w: width, h: height };
      camera.aspect = width / height;
      ghost.scale.setScalar(mobile ? 0.52 : 0.66);
      placeCamera(mobile);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      ascii.resize(width, height);
      offsetX = width >= 1024 ? 2.4 : 0;
      baseY = mobile ? 1.8 : width < 1024 ? 1.1 : 0.2;
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    let onScreen = true;
    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    visibility.observe(container);

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("dblclick", onDoubleClick);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen) return;
      const t = elapsed();
      const mood = moodRef.current;

      // Ripple everything below the dome so the hem drifts like cloth.
      const array = body.position.array;
      for (let i = 0; i < body.base.length; i++) {
        const p = body.base[i];
        if (p.y < 1) array[i * 3 + 1] = p.y + 0.08 * Math.sin(2.5 * t + 2 * p.x + 1.5 * p.z) * (1.2 - p.y);
      }
      body.position.needsUpdate = true;
      body.geometry.computeVertexNormals();

      const attention = Math.min(Math.abs(pointerX) + Math.abs(pointerY), 1);
      ghost.position.x = offsetX;
      ghost.position.y = baseY + 0.15 * Math.sin(1.8 * t);
      bodyMaterial.opacity = 0.14 + 0.08 * attention + (hovering ? 0.06 : 0);
      if (mood.isMusic) {
        ghost.position.y += 0.04 * Math.sin(4 * t);
        ghost.rotation.z = 0.04 * Math.sin(2.5 * t);
      } else {
        ghost.rotation.z = 0.04 * Math.sin(1.2 * t);
      }

      headphonesScale += ((mood.isMusic || mood.isGaming ? 1 : 0) - headphonesScale) * 0.08;
      headphones.visible = headphonesScale > 0.01;
      headphones.scale.setScalar(headphonesScale);

      const coding = mood.isCoding && !mood.isMusic;
      glassesScale += ((coding ? 1 : 0) - glassesScale) * 0.1;
      glasses.visible = glassesScale > 0.01;
      glasses.scale.setScalar(glassesScale);

      // Eye openness (1 = open): `both` closes both eyes, `right` only the right one.
      let both = 1;
      let right = 1;
      const cycle = t % 3.8;
      if (cycle < 0.15) {
        const k = Math.sin((cycle / 0.15) * Math.PI);
        if (Math.floor(t / 3.8) % 5 === 4) right = Math.min(right, 1 - 0.95 * k); // every fifth blink is a wink
        else both = Math.min(both, 1 - 0.95 * k);
      }
      const sinceClick = t - blinkAt; // double blink and a little hop
      if (sinceClick >= 0 && sinceClick < 0.36) {
        let k = 0;
        if (sinceClick < 0.14) k = Math.sin((sinceClick / 0.14) * Math.PI);
        else if (sinceClick >= 0.18 && sinceClick < 0.32) k = Math.sin(((sinceClick - 0.18) / 0.14) * Math.PI);
        both = Math.min(both, 1 - 0.96 * k);
        ghost.position.y += 0.14 * Math.sin(Math.min(sinceClick / 0.36, 1) * Math.PI);
      }
      const sinceWink = t - winkAt;
      if (sinceWink >= 0 && sinceWink < 0.3) right = Math.min(right, 1 - 0.96 * Math.sin((sinceWink / 0.3) * Math.PI));
      const sinceHover = t - hoverAt;
      if (sinceHover >= 0 && sinceHover < 0.28) {
        const k = Math.sin((sinceHover / 0.28) * Math.PI);
        both = Math.min(both, 1 - 0.94 * k);
        ghost.position.y += 0.1 * k;
      }

      // Eyes widen with attention and narrow into a focused squint while coding.
      const excitement = attention + (hovering ? 0.25 : 0);
      eyeHeight += ((coding ? 0.72 : 1 + 0.08 * excitement) - eyeHeight) * 0.1;
      eyeWidth += ((coding ? 0.94 : 1 + 0.04 * excitement) - eyeWidth) * 0.1;
      leftEye.scale.set(eyeWidth, Math.max(eyeHeight * both, 0.04), 1);
      rightEye.scale.set(eyeWidth, Math.max(eyeHeight * both * right, 0.04), 1);

      updateFloaters(codeGlyphs, coding, ghost.position, t, 0.12, 1.2);
      updateFloaters(notes, mood.isMusic, ghost.position, t, 0.15, 1.5);

      if (dragging) {
        ghost.rotation.y = targetRotY;
        ghost.rotation.x = targetRotX;
      } else {
        spin *= 0.95;
        targetRotY += spin;
        ghost.rotation.y += (targetRotY - ghost.rotation.y) * 0.08;
        ghost.rotation.x += (targetRotX - ghost.rotation.x) * 0.08;
      }

      renderer.render(scene, camera);
      ascii.draw(size.w, size.h);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("dblclick", onDoubleClick);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      stopWatchingPointer();
      scene.traverse((o) => {
        if (o instanceof Mesh || o instanceof Line) {
          o.geometry.dispose();
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
      ascii.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-10 h-full w-full cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ touchAction: "pan-y" }}
    />
  );
}
