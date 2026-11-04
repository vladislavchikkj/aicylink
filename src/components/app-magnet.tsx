"use client";

import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { AppId } from "@/content/site";
import { AppIcon, appTheme } from "./app-icon";

// "Aicy Link": our apps and a few blocks of clear ice, magnetised into one clump. The pointer
// pushes them apart and they spring back together. A light take on the classic "connectors"
// demo, with a tiny hand-rolled solver instead of a physics engine.

const APPS: AppId[] = ["lummie", "snap", "stars", "glow", "cv", "learn", "move", "dreams"];
const ICE_COUNT = 5;

const TILE = 1;
const TILE_RADIUS = 0.24;
const TILE_DEPTH = 0.3;
const ICE = 0.82;

type Body = {
  kind: "app" | "ice";
  id?: AppId;
  radius: number;
  /** Seconds after start when it flies in. */
  delay: number;
  from: THREE.Vector3;
  p: THREE.Vector3;
  /** Position before the latest step, to tell whether it still visibly moves. */
  last: THREE.Vector3;
  v: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
};

const MAX_STEP = 1 / 30;
/** World units the resting clump is laid out in; it is scaled so this spans the anchor box. */
const CLUMP_SIZE = 5.1;
// What the ice refracts: the hero's pale backdrop instead of the transparent (black) canvas.
const ICE_BACKGROUND = new THREE.Color("#f6f3ff");

function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

function makeBodies(count: number): Body[] {
  const rand = seeded(11);
  const kinds: Body["kind"][] = [...APPS.map(() => "app" as const), ...Array.from({ length: count }, () => "ice" as const)];
  // Interleave so ice and apps arrive mixed, Lummie first.
  const order = kinds.map((_, i) => i).sort((a, b) => (a === 0 ? -1 : b === 0 ? 1 : rand() - 0.5));
  return order.map((i, n) => {
    const kind = kinds[i];
    const angle = rand() * Math.PI * 2;
    const from = new THREE.Vector3(Math.cos(angle) * 6.5, Math.sin(angle) * 5, -2 + rand() * 4);
    return {
      kind,
      id: kind === "app" ? APPS[i] : undefined,
      radius: kind === "app" ? 0.66 : 0.6,
      delay: 0.1 + n * 0.1,
      from,
      p: from.clone(),
      last: from.clone(),
      v: new THREE.Vector3(),
      rot: new THREE.Euler((rand() - 0.5) * 2, (rand() - 0.5) * 2, (rand() - 0.5) * 2),
      spin: new THREE.Vector3((rand() - 0.5) * 1.2, (rand() - 0.5) * 1.2, (rand() - 0.5) * 0.8),
    };
  });
}

/** Advances the clump: pull to the center, keep bodies apart, let the pointer push them. */
function simulate(
  bodies: Body[],
  time: number,
  dt: number,
  pointer: THREE.Vector3 | null,
  held: Body | null = null,
  /** The tile under the mouse stays put so it can be grabbed; only its neighbours lean away. */
  hovered: Body | null = null,
) {
  const d = new THREE.Vector3();
  for (const b of bodies) {
    if (time < b.delay || b === held) continue;
    b.v.addScaledVector(b.p, -dt * (time < b.delay + 1.5 ? 2.4 : 1.6));
    b.v.z += -b.p.z * dt;
  }
  for (let i = 0; i < bodies.length; i++) {
    const a = bodies[i];
    if (time < a.delay) continue;
    for (let j = i + 1; j < bodies.length; j++) {
      const b = bodies[j];
      if (time < b.delay) continue;
      d.subVectors(b.p, a.p);
      const dist = d.length() || 0.0001;
      const min = a.radius + b.radius;
      if (dist >= min) continue;
      d.divideScalar(dist);
      // Ease overlaps apart over a few frames instead of snapping, so contacts stay soft.
      // A tile held by the pointer doesn't give way; it shoves the others.
      const push = (min - dist) * 0.3;
      if (a !== held) a.p.addScaledVector(d, b === held ? -push * 2 : -push);
      if (b !== held) b.p.addScaledVector(d, a === held ? push * 2 : push);
      const along = b.v.dot(d) - a.v.dot(d);
      if (along < 0) {
        a.v.addScaledVector(d, along * 0.3);
        b.v.addScaledVector(d, -along * 0.3);
        // Only a real knock sets tiles spinning; resting contact must not, or they never settle.
        if (along < -0.4) {
          a.spin.z += along * 0.15;
          b.spin.x -= along * 0.15;
        }
      }
    }
    if (pointer && !held && a !== hovered) {
      d.subVectors(a.p, pointer);
      d.z *= 0.4;
      const dist = d.length() || 0.0001;
      // The pointer only nudges: tiles lean away a little and drift back.
      const min = a.radius + 0.55;
      if (dist < min) {
        d.divideScalar(dist);
        a.v.addScaledVector(d, (min - dist) * dt * 14);
      }
    }
  }
  const damp = Math.exp(-dt * 3.4);
  for (const b of bodies) {
    if (time < b.delay || b === held) continue;
    b.v.multiplyScalar(damp);
    b.p.addScaledVector(b.v, dt);
    b.rot.x += b.spin.x * dt;
    b.rot.y += b.spin.y * dt;
    b.rot.z += b.spin.z * dt;
    // Spin settles and tiles turn back toward the viewer, so the app icons stay readable.
    b.spin.multiplyScalar(Math.exp(-dt * 1.6));
    const settle = 1 - Math.exp(-dt * (b.kind === "app" ? 1.4 : 0.3));
    b.rot.x += (wrap(b.rot.x) * 0.25 - b.rot.x) * settle;
    b.rot.y += (wrap(b.rot.y) * 0.35 - b.rot.y) * settle;
    b.rot.z += (wrap(b.rot.z) * 0.3 - b.rot.z) * settle;
  }
}

/** Nearest equivalent angle in [-π, π], so settling never unwinds full turns. */
const wrap = (a: number) => a - Math.round(a / (Math.PI * 2)) * Math.PI * 2;

/** Renders the SVG app icons hidden in the DOM, then turns each into a rounded texture. */
function useIconTextures(hidden: React.RefObject<HTMLDivElement | null>) {
  const [textures, setTextures] = useState<Partial<Record<AppId, THREE.Texture>>>({});

  useEffect(() => {
    const root = hidden.current;
    if (!root) return;
    let cancelled = false;
    const made: THREE.Texture[] = [];

    Promise.all(
      APPS.map(async (id) => {
        const svg = root.querySelector<SVGSVGElement>(`[data-icon="${id}"] svg`);
        if (!svg) return null;
        const clone = svg.cloneNode(true) as SVGSVGElement;
        clone.setAttribute("width", "256");
        clone.setAttribute("height", "256");
        const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
        const img = new Image();
        img.src = url;
        await img.decode().finally(() => URL.revokeObjectURL(url));

        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 256;
        const ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.roundRect(0, 0, 256, 256, 60);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 256, 256);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = 4;
        made.push(texture);
        return [id, texture] as const;
      }),
    ).then((entries) => {
      if (!cancelled) setTextures(Object.fromEntries(entries.filter((e) => e !== null)));
    });

    return () => {
      cancelled = true;
      made.forEach((t) => t.dispose());
    };
  }, [hidden]);

  return textures;
}

function useTileGeometry() {
  return useMemo(() => {
    const s = TILE / 2;
    const r = TILE_RADIUS;
    const shape = new THREE.Shape();
    shape.moveTo(-s + r, -s);
    shape.lineTo(s - r, -s);
    shape.quadraticCurveTo(s, -s, s, -s + r);
    shape.lineTo(s, s - r);
    shape.quadraticCurveTo(s, s, s - r, s);
    shape.lineTo(-s + r, s);
    shape.quadraticCurveTo(-s, s, -s, s - r);
    shape.lineTo(-s, -s + r);
    shape.quadraticCurveTo(-s, -s, -s + r, -s);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: TILE_DEPTH,
      bevelEnabled: true,
      bevelSize: 0.04,
      bevelThickness: 0.04,
      bevelSegments: 4,
      curveSegments: 12,
    });
    geometry.center();
    return geometry;
  }, []);
}

function Clump({
  compact,
  glass,
  still,
  textures,
  anchor,
  onSlow,
}: {
  /** Phones and tablets: fewer ice blocks. */
  compact: boolean;
  /** Real refracting glass for the ice; off on phones and on devices in light mode. */
  glass: boolean;
  still: boolean;
  textures: Partial<Record<AppId, THREE.Texture>>;
  /** The page box the clump rests in; tiles may still fly anywhere on the canvas. */
  anchor: HTMLElement | null;
  /** Called once if the opening frames come in too slowly, so the scene can drop to a lighter mode. */
  onSlow: () => void;
}) {
  const bodies = useMemo(() => {
    const list = makeBodies(compact ? 3 : ICE_COUNT);
    if (still) {
      // No fly-in: settle the clump before the first frame.
      for (let i = 0; i < 400; i++) simulate(list, 10 + i / 60, 1 / 60, null);
    }
    return list;
  }, [compact, still]);
  const groups = useRef<(THREE.Group | null)[]>([]);
  const ice = useRef<THREE.InstancedMesh>(null);
  const iceGeometry = useMemo(() => new RoundedBoxGeometry(ICE, ICE, ICE, 4, 0.14), []);
  const iceBodies = useMemo(() => bodies.filter((b) => b.kind === "ice"), [bodies]);
  const matrix = useMemo(() => new THREE.Object3D(), []);
  const time = useRef(still ? 10 : 0);
  const client = useRef<{ x: number; y: number } | null>(null);
  const pointer = useMemo(() => new THREE.Vector3(), []);
  const stage = useRef<THREE.Group>(null);
  // Frame times while the tiles fly in, to judge whether this device keeps up.
  const probe = useRef({ frames: 0, total: 0, done: false });
  // Grab and throw (mouse only: on touch screens a drag must keep scrolling the page).
  const held = useRef<Body | null>(null);
  const hovered = useRef<Body | null>(null);
  const local = useRef<THREE.Vector3 | null>(null);
  const throwVelocity = useMemo(() => new THREE.Vector3(), []);
  const lastLocal = useMemo(() => new THREE.Vector3(), []);
  const tile = useTileGeometry();
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      client.current = { x: e.clientX, y: e.clientY };
      invalidate();
    };
    const onLeave = () => (client.current = null);
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0 || !hovered.current) return;
      if ((e.target as HTMLElement).closest("a, button, input, textarea, select")) return;
      e.preventDefault(); // no text selection while dragging
      held.current = hovered.current;
      throwVelocity.set(0, 0, 0);
      if (local.current) lastLocal.copy(local.current);
      document.body.style.cursor = "grabbing";
    };
    const onUp = () => {
      const body = held.current;
      if (!body) return;
      held.current = null;
      // Let go: it keeps the speed it was thrown with, then the magnet pulls it back.
      body.v.copy(throwVelocity).clampLength(0, 30);
      body.spin.set(-throwVelocity.y * 0.25, throwVelocity.x * 0.25, (Math.random() - 0.5) * 4);
      document.body.style.cursor = hovered.current ? "grab" : "";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("blur", onUp);
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.body.style.cursor = "";
    };
  }, [invalidate, lastLocal, throwVelocity]);

  useFrame(({ viewport, camera }, delta) => {
    const dt = Math.min(delta, MAX_STEP);
    const p = probe.current;
    if (!p.done && time.current > 0.3) {
      p.frames++;
      p.total += delta;
      // Averaging under ~40 fps over the opening means this device can't afford full quality.
      if (p.frames === 45) {
        p.done = true;
        if (p.total / p.frames > 1 / 40) onSlow();
      }
    }
    time.current += dt;
    const rect = gl.domElement.getBoundingClientRect();
    const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);
    const unit = vp.width / rect.width;
    // Center and scale the clump on the anchor box, wherever the layout puts it.
    if (stage.current && anchor) {
      const box = anchor.getBoundingClientRect();
      stage.current.position.set(
        (box.left + box.width / 2 - rect.left - rect.width / 2) * unit,
        -(box.top + box.height / 2 - rect.top - rect.height / 2) * unit,
        0,
      );
      stage.current.scale.setScalar((box.width * unit) / CLUMP_SIZE);
    }
    // Pointer on the z = 0 plane, in the clump's own units.
    let push: THREE.Vector3 | null = null;
    if (client.current && !still && stage.current) {
      const x = (client.current.x - rect.left - rect.width / 2) * unit;
      const y = -(client.current.y - rect.top - rect.height / 2) * unit;
      if (Math.abs(x) < vp.width && Math.abs(y) < vp.height) {
        push = pointer.set(x, y, 0).sub(stage.current.position).divideScalar(stage.current.scale.x);
      }
    }
    local.current = push;

    // Which tile is under the mouse (front-most wins), for the grab cursor.
    if (!held.current && client.current && !still) {
      let hit: Body | null = null;
      if (push) {
        for (const b of bodies) {
          if (time.current < b.delay) continue;
          const dx = b.p.x - push.x;
          const dy = b.p.y - push.y;
          if (dx * dx + dy * dy < b.radius * b.radius * 0.9 && (!hit || b.p.z > hit.p.z)) hit = b;
        }
      }
      // Only offer a grab where nothing on the page sits on top of the scene.
      const over = document.elementFromPoint(client.current.x, client.current.y);
      if (over?.closest("a, button, input, textarea, select, h1, p")) hit = null;
      if (hit !== hovered.current) {
        hovered.current = hit;
        document.body.style.cursor = hit ? "grab" : "";
      }
    }

    // A held tile follows the pointer; its recent motion becomes the throw.
    const grabbed = held.current;
    if (grabbed && push) {
      grabbed.p.x += (push.x - grabbed.p.x) * Math.min(1, dt * 18);
      grabbed.p.y += (push.y - grabbed.p.y) * Math.min(1, dt * 18);
      grabbed.p.z += (0.8 - grabbed.p.z) * Math.min(1, dt * 8);
      const velocity = lastLocal.clone().sub(push).multiplyScalar(-1 / Math.max(dt, 1e-3));
      throwVelocity.lerp(velocity, 0.35);
      lastLocal.copy(push);
      grabbed.rot.x += (0 - wrap(grabbed.rot.x)) * dt * 6;
      grabbed.rot.y += (0 - wrap(grabbed.rot.y)) * dt * 6;
      grabbed.rot.z += (-throwVelocity.x * 0.04 - wrap(grabbed.rot.z)) * dt * 6;
    }

    for (const b of bodies) b.last.copy(b.p);
    simulate(bodies, time.current, dt, held.current ? null : push, held.current, hovered.current);

    // Rendering is on demand: keep frames coming only while something visibly moves, so a resting
    // clump costs the GPU nothing (the pointer moving wakes it up again). Tiles pressed together
    // keep a little velocity against each other, so this looks at how far they actually moved.
    const arrived = bodies.reduce((t, b) => Math.max(t, b.delay), 0) + 1;
    const moving =
      time.current < arrived ||
      held.current !== null ||
      bodies.some((b) => b.p.distanceToSquared(b.last) > (0.0008 * dt * 60) ** 2 || b.spin.lengthSq() > 4e-3);
    if (moving) invalidate();
    // A little pop as each one arrives.
    const scaleOf = (b: Body) => (time.current >= b.delay ? Math.min(1, 0.4 + (time.current - b.delay) * 1.6) : 0.0001);
    bodies.forEach((b, i) => {
      const g = groups.current[i];
      if (!g) return;
      g.visible = time.current >= b.delay;
      g.position.copy(b.p);
      g.rotation.copy(b.rot);
      g.scale.setScalar(scaleOf(b));
    });
    if (ice.current) {
      iceBodies.forEach((b, i) => {
        matrix.position.copy(b.p);
        matrix.rotation.copy(b.rot);
        matrix.scale.setScalar(scaleOf(b));
        matrix.updateMatrix();
        ice.current!.setMatrixAt(i, matrix.matrix);
      });
      ice.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={stage}>
      {bodies.map((b, i) =>
        b.kind === "app" && b.id ? (
          <group
            key={i}
            ref={(g) => {
              groups.current[i] = g;
            }}
            visible={false}
          >
            <mesh geometry={tile}>
              <meshPhysicalMaterial color={appTheme[b.id].accent} roughness={0.28} clearcoat={1} clearcoatRoughness={0.12} />
            </mesh>
            {textures[b.id] && (
              <>
                <mesh position={[0, 0, TILE_DEPTH / 2 + 0.045]}>
                  <planeGeometry args={[TILE, TILE]} />
                  <meshBasicMaterial map={textures[b.id]} transparent toneMapped={false} />
                </mesh>
                <mesh position={[0, 0, -TILE_DEPTH / 2 - 0.045]} rotation={[0, Math.PI, 0]}>
                  <planeGeometry args={[TILE, TILE]} />
                  <meshBasicMaterial map={textures[b.id]} transparent toneMapped={false} />
                </mesh>
              </>
            )}
          </group>
        ) : null,
      )}

      {/* All the ice in one instanced mesh: a single glass pass however many blocks there are. */}
      <instancedMesh ref={ice} args={[iceGeometry, undefined, iceBodies.length]} frustumCulled={false}>
        {!glass ? (
          <meshPhysicalMaterial color="#bfe6fb" roughness={0.06} clearcoat={1} transparent opacity={0.6} envMapIntensity={2.2} depthWrite={false} />
        ) : (
          <MeshTransmissionMaterial
            samples={4}
            resolution={512}
            thickness={1.2}
            roughness={0.02}
            ior={1.31}
            chromaticAberration={0.45}
            anisotropicBlur={0.1}
            distortion={0}
            clearcoat={1}
            clearcoatRoughness={0.02}
            color="#e8f7ff"
            attenuationColor="#7dd3fc"
            attenuationDistance={1.4}
            background={ICE_BACKGROUND}
          />
        )}
      </instancedMesh>
    </group>
  );
}

export default function AppMagnet() {
  const hidden = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const textures = useIconTextures(hidden);
  const [active, setActive] = useState(true);
  const [env, setEnv] = useState<{ compact: boolean; still: boolean } | null>(null);
  // Full sharpness and real glass by default; weak or struggling devices get the light mode.
  const [light, setLight] = useState(false);

  useEffect(() => {
    // Weak devices skip the glass refraction pass, the heaviest part of a frame.
    const nav = navigator as Navigator & { deviceMemory?: number };
    const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    // Starting the scene blocks the main thread for a moment: do it in the first idle moment
    // after the page hydrates, so the tiles arrive right away without fighting the first paint.
    const start = () => {
      setLight(weak);
      setEnv({
        compact: window.matchMedia("(max-width: 1023px)").matches,
        still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      });
      setAnchor(document.querySelector<HTMLElement>("[data-magnet-anchor]"));
    };
    let idle = 0;
    const timer = window.setTimeout(() => {
      // Safari has no requestIdleCallback.
      idle = typeof (window as Partial<Window>).requestIdleCallback === "function" ? window.requestIdleCallback(start, { timeout: 300 }) : window.setTimeout(start, 0);
    }, 0);
    // Render only while the hero is on screen.
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (box.current) observer.observe(box.current);
    return () => {
      window.clearTimeout(timer);
      if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={box} className="pointer-events-none absolute inset-0" aria-hidden>
      <div ref={hidden} className="hidden">
        {APPS.map((id) => (
          <span key={id} data-icon={id}>
            <AppIcon id={id} />
          </span>
        ))}
      </div>
      {env && (
        <Canvas
          style={{ pointerEvents: "none" }}
          camera={{ position: [0, 0, 11], fov: 32 }}
          resize={{ scroll: false }}
          dpr={light ? 1 : [1, 2]}
          frameloop={active ? "demand" : "never"}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 5, 6]} intensity={1.8} />
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
            <Lightformer form="rect" intensity={2.5} color="#fb923c" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
            <Lightformer form="rect" intensity={2.5} color="#7c5cff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
            <Lightformer form="ring" intensity={2} color="#38bdf8" position={[0, -3, -4]} scale={4} />
          </Environment>
          <Clump
            compact={env.compact}
            glass={!env.compact && !light}
            still={env.still}
            textures={textures}
            anchor={anchor}
            onSlow={() => setLight(true)}
          />
        </Canvas>
      )}
    </div>
  );
}
