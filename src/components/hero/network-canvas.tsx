"use client";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from "three";
import { watchPointer } from "@/lib/events";
import { createAsciiPass } from "./ascii-pass";

type Mood = { isMusic: boolean; isCoding: boolean; isGaming: boolean };

/** Neurons per layer, input → output. */
const LAYERS = [3, 5, 5, 3];
const LAYER_GAP = 1.5;
const NEURON_GAP = 0.95;
const POOL = 40; // pulses available at once (ambient flow + click bursts)
const AMBIENT_PULSES = 12;

const EDGE_COLOR = new Color(0x3c4249); // dim enough to render as faint "." glyphs
const LIT_EDGE = new Color(0xffffff);
const NEURON_COLOR = 0xcfd6dd;
const UP = new Vector3(0, 1, 0);

type Neuron = { mesh: Mesh; material: MeshLambertMaterial; position: Vector3; firedAt: number; phase: number };
type Edge = { material: MeshBasicMaterial; glow: number };
type Pulse = { mesh: Mesh; path: number[]; hop: number; t: number; speed: number; active: boolean; wakeAt: number };

/** Neurons in vertical columns, one per layer, like a textbook network diagram; rotation gives it depth. */
function buildNeurons(group: Group) {
  const geometry = new SphereGeometry(0.34, 24, 24);
  const neurons: Neuron[] = [];
  const layers: number[][] = [];
  LAYERS.forEach((count, layer) => {
    const x = (layer - (LAYERS.length - 1) / 2) * LAYER_GAP;
    const ids: number[] = [];
    for (let i = 0; i < count; i++) {
      const position = new Vector3(x, ((count - 1) / 2 - i) * NEURON_GAP, 0);
      const material = new MeshLambertMaterial({ color: NEURON_COLOR });
      const mesh = new Mesh(geometry, material);
      mesh.position.copy(position);
      group.add(mesh);
      ids.push(neurons.length);
      neurons.push({ mesh, material, position, firedAt: -10, phase: Math.random() * Math.PI * 2 });
    }
    layers.push(ids);
  });
  return { neurons, layers };
}

/** Fully connects adjacent layers with thin cylinders (lines would vanish when downsampled to ASCII). */
function buildEdges(group: Group, neurons: Neuron[], layers: number[][]) {
  const geometry = new CylinderGeometry(0.02, 0.02, 1, 5, 1, true);
  const edges = new Map<string, Edge>();
  for (let l = 0; l < layers.length - 1; l++) {
    for (const a of layers[l]) {
      for (const b of layers[l + 1]) {
        const from = neurons[a].position;
        const to = neurons[b].position;
        const direction = to.clone().sub(from);
        const material = new MeshBasicMaterial({ color: EDGE_COLOR.clone() });
        const mesh = new Mesh(geometry, material);
        mesh.position.copy(from).addScaledVector(direction, 0.5);
        mesh.scale.y = direction.length();
        mesh.quaternion.setFromUnitVectors(UP, direction.normalize());
        group.add(mesh);
        edges.set(`${a}-${b}`, { material, glow: 0 });
      }
    }
  }
  return edges;
}

/**
 * The hero visual: a small feed-forward network rendered with Three.js and redrawn as ASCII.
 * Activation pulses flow from input to output and make neurons fire as they arrive. It follows
 * the pointer, can be dragged to spin, runs a full forward pass on click, and reacts to the
 * live presence mood (faster while coding, pulsing to a beat while music plays).
 */
export default function NetworkCanvas({ isMusic = false, isCoding = false, isGaming = false }: Partial<Mood>) {
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
    renderer.domElement.className = "pointer-events-none absolute inset-0";
    container.appendChild(renderer.domElement);
    const ascii = createAsciiPass(container, renderer);
    ascii.resize(size.w, size.h);

    const scene = new Scene();
    const camera = new PerspectiveCamera(40, size.w / size.h, 0.1, 100);
    scene.add(new AmbientLight(0xffffff, 0.5));
    const keyLight = new DirectionalLight(0xffffff, 0.9);
    keyLight.position.set(5, 10, 7);
    const rimLight = new DirectionalLight(0xffffff, 0.25);
    rimLight.position.set(-5, -5, -5);
    scene.add(keyLight, rimLight);

    const network = new Group();
    scene.add(network);
    const { neurons, layers } = buildNeurons(network);
    const edges = buildEdges(network, neurons, layers);

    const pulseGeometry = new SphereGeometry(0.15, 12, 12);
    const pulseMaterial = new MeshBasicMaterial({ color: 0xffffff });
    const pulses: Pulse[] = Array.from({ length: POOL }, (_, i) => {
      const mesh = new Mesh(pulseGeometry, pulseMaterial);
      mesh.visible = false;
      network.add(mesh);
      return { mesh, path: [], hop: 0, t: 0, speed: 1, active: false, wakeAt: i < AMBIENT_PULSES ? Math.random() * 2.5 : Infinity };
    });

    const start = performance.now();
    const elapsed = () => (performance.now() - start) * 0.001;
    const pick = (ids: number[]) => ids[Math.floor(Math.random() * ids.length)];

    /** Sends a pulse along a random input → output path, optionally from a given input neuron. */
    const launch = (pulse: Pulse, now: number, from?: number) => {
      pulse.path = layers.map((ids, l) => (l === 0 && from !== undefined ? from : pick(ids)));
      pulse.hop = 0;
      pulse.t = 0;
      pulse.speed = 0.8 + 0.5 * Math.random();
      pulse.active = true;
      pulse.mesh.visible = true;
      neurons[pulse.path[0]].firedAt = now;
    };

    /** Click: every input neuron fires at once. */
    const forwardPass = (now: number) => {
      const idle = pulses.filter((p) => !p.active && p.wakeAt === Infinity);
      layers[0].forEach((input, i) => {
        for (let k = 0; k < 2; k++) {
          const pulse = idle[i * 2 + k];
          if (pulse) launch(pulse, now, input);
        }
      });
    };

    const placeForViewport = () => {
      const mobile = size.w < 768;
      if (mobile) camera.position.set(0, 0.35, 15);
      else camera.position.set(0, -0.2, 13.5);
      camera.aspect = size.w / size.h;
      camera.updateProjectionMatrix();
      network.scale.setScalar(mobile ? 0.8 : 0.9);
      return {
        offsetX: size.w >= 1024 ? 3.7 : 0,
        baseY: mobile ? 2.2 : size.w < 1024 ? 1.4 : 0.3,
      };
    };
    let placement = placeForViewport();

    // Pointer in [-1, 1] over the hero, and rotation targets derived from it.
    let pointerX = 0;
    let pointerY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let spin = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let hovering = false;
    let hoverAt = -10;
    let clickAt = -10;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      if (dragging) {
        const dx = event.clientX - lastX;
        targetRotY += 0.01 * dx;
        targetRotX += 0.01 * (event.clientY - lastY);
        spin = 0.005 * dx;
        lastX = event.clientX;
        lastY = event.clientY;
      } else {
        targetRotY = 0.35 * pointerX;
        targetRotX = -0.25 * pointerY;
      }
    };
    const onMouseDown = (event: MouseEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
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
        clickAt = elapsed();
        forwardPass(clickAt);
      },
    });

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 20 || height <= 20) return;
      // Ignore the height jumps caused by mobile browser toolbars showing and hiding.
      if (width < 768 && Math.abs(width - size.w) < 10 && Math.abs(height - size.h) < 140) return;
      size = { w: width, h: height };
      renderer.setSize(width, height);
      ascii.resize(width, height);
      placement = placeForViewport();
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
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);

    let last = elapsed();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!onScreen) return;
      const t = elapsed();
      const dt = Math.min(t - last, 0.05);
      last = t;
      const mood = moodRef.current;

      // Hovering a link or clicking briefly speeds everything up; coding keeps it fast.
      const boost = 1 + 1.4 * Math.exp(-(t - hoverAt) * 2.5) + 1.2 * Math.exp(-(t - clickAt) * 1.5);
      const tempo = (mood.isCoding ? 1.8 : 1) * boost;

      for (const pulse of pulses) {
        if (!pulse.active) {
          if (t >= pulse.wakeAt) launch(pulse, t);
          continue;
        }
        pulse.t += dt * pulse.speed * tempo;
        const from = pulse.path[pulse.hop];
        const to = pulse.path[pulse.hop + 1];
        const edge = edges.get(`${from}-${to}`);
        if (edge) edge.glow = 1;
        if (pulse.t >= 1) {
          neurons[to].firedAt = t;
          pulse.hop += 1;
          pulse.t = 0;
          if (pulse.hop >= pulse.path.length - 1) {
            pulse.active = false;
            pulse.mesh.visible = false;
            // Ambient pulses loop after a short rest; burst pulses go back to the pool.
            if (pulse.wakeAt !== Infinity) pulse.wakeAt = t + 0.2 + Math.random() * 1.2;
            continue;
          }
        }
        pulse.mesh.position.lerpVectors(
          neurons[pulse.path[pulse.hop]].position,
          neurons[pulse.path[pulse.hop + 1]].position,
          pulse.t,
        );
      }

      for (const edge of edges.values()) {
        edge.glow *= 0.92;
        edge.material.color.copy(EDGE_COLOR).lerp(LIT_EDGE, edge.glow * 0.7);
      }

      const beat = mood.isMusic ? Math.pow(Math.max(0, Math.sin(t * Math.PI * 2)), 8) : 0; // ~120 bpm
      for (const neuron of neurons) {
        const fire = Math.exp(-(t - neuron.firedAt) * 5);
        neuron.mesh.scale.setScalar(1 + 0.04 * Math.sin(2 * t + neuron.phase) + 0.4 * fire + 0.15 * beat);
        neuron.material.emissive.setScalar(Math.min(0.85 * fire + 0.25 * beat, 1));
      }

      network.position.x = placement.offsetX;
      network.position.y = placement.baseY + 0.12 * Math.sin(1.4 * t);
      const drift = -0.4 + 0.15 * Math.sin(0.25 * t) + (mood.isGaming ? 0.3 * Math.sin(0.8 * t) : 0);
      if (dragging) {
        network.rotation.y = drift + targetRotY;
        network.rotation.x = 0.12 + targetRotX;
      } else {
        spin *= 0.95;
        targetRotY += spin;
        network.rotation.y += (drift + targetRotY - network.rotation.y) * 0.06;
        network.rotation.x += (0.12 + targetRotX - network.rotation.x) * 0.06;
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
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      stopWatchingPointer();
      scene.traverse((o) => {
        if (o instanceof Mesh) {
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
