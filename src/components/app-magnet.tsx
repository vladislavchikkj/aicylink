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
  v: THREE.Vector3;
  rot: THREE.Euler;
  spin: THREE.Vector3;
};

const MAX_STEP = 1 / 30;
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
    const from = new THREE.Vector3(Math.cos(angle) * 9, Math.sin(angle) * 7, -2 + rand() * 4);
    return {
      kind,
      id: kind === "app" ? APPS[i] : undefined,
      radius: kind === "app" ? 0.66 : 0.6,
      delay: 0.25 + n * 0.11,
      from,
      p: from.clone(),
      v: new THREE.Vector3(),
      rot: new THREE.Euler((rand() - 0.5) * 2, (rand() - 0.5) * 2, (rand() - 0.5) * 2),
      spin: new THREE.Vector3((rand() - 0.5) * 3, (rand() - 0.5) * 3, (rand() - 0.5) * 2),
    };
  });
}

/** Advances the clump: pull to the center, keep bodies apart, let the pointer push them. */
function simulate(bodies: Body[], time: number, dt: number, pointer: THREE.Vector3 | null) {
  const d = new THREE.Vector3();
  for (const b of bodies) {
    if (time < b.delay) continue;
    b.v.addScaledVector(b.p, -dt * (time < b.delay + 1 ? 5 : 3.2));
    b.v.z += -b.p.z * dt * 2;
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
      const push = (min - dist) / 2;
      a.p.addScaledVector(d, -push);
      b.p.addScaledVector(d, push);
      const along = b.v.dot(d) - a.v.dot(d);
      if (along < 0) {
        a.v.addScaledVector(d, along * 0.5);
        b.v.addScaledVector(d, -along * 0.5);
        a.spin.z += along * 0.6;
        b.spin.x -= along * 0.6;
      }
    }
    if (pointer) {
      d.subVectors(a.p, pointer);
      d.z *= 0.4;
      const dist = d.length() || 0.0001;
      const min = a.radius + 0.85;
      if (dist < min) {
        d.divideScalar(dist);
        a.p.addScaledVector(d, (min - dist) * 0.35);
        a.v.addScaledVector(d, (min - dist) * 4);
        a.spin.y += d.x * 2;
        a.spin.x -= d.y * 2;
      }
    }
  }
  const damp = Math.exp(-dt * 2.6);
  for (const b of bodies) {
    if (time < b.delay) continue;
    b.v.multiplyScalar(damp);
    b.p.addScaledVector(b.v, dt);
    b.rot.x += b.spin.x * dt;
    b.rot.y += b.spin.y * dt;
    b.rot.z += b.spin.z * dt;
    // Spin settles and tiles turn back toward the viewer, so the app icons stay readable.
    b.spin.multiplyScalar(Math.exp(-dt * 1.2));
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

function Clump({ compact, still, textures }: { compact: boolean; still: boolean; textures: Partial<Record<AppId, THREE.Texture>> }) {
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
  const tile = useTileGeometry();
  const { gl } = useThree();

  useEffect(() => {
    const onMove = (e: PointerEvent) => (client.current = { x: e.clientX, y: e.clientY });
    const onLeave = () => (client.current = null);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useFrame(({ viewport, camera }, delta) => {
    const dt = Math.min(delta, MAX_STEP);
    time.current += dt;
    // Pointer in world units on the z = 0 plane; ignored once it is well outside the canvas.
    let push: THREE.Vector3 | null = null;
    if (client.current && !still) {
      const rect = gl.domElement.getBoundingClientRect();
      const nx = ((client.current.x - rect.left) / rect.width) * 2 - 1;
      const ny = -((client.current.y - rect.top) / rect.height) * 2 + 1;
      if (Math.abs(nx) < 1.2 && Math.abs(ny) < 1.2) {
        const vp = viewport.getCurrentViewport(camera, [0, 0, 0]);
        push = pointer.set((nx * vp.width) / 2, (ny * vp.height) / 2, 0);
      }
    }
    simulate(bodies, time.current, dt, push);
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
    <>
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
        {compact ? (
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
    </>
  );
}

export default function AppMagnet() {
  const hidden = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const textures = useIconTextures(hidden);
  const [active, setActive] = useState(true);
  const [env, setEnv] = useState<{ compact: boolean; still: boolean } | null>(null);

  useEffect(() => {
    setEnv({
      compact: window.matchMedia("(max-width: 1023px)").matches,
      still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    // Render only while the hero is on screen.
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    if (box.current) observer.observe(box.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="absolute -inset-[12%]" aria-hidden>
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
          dpr={[1, env.compact ? 1.5 : 1.75]}
          frameloop={active ? "always" : "never"}
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
          <Clump compact={env.compact} still={env.still} textures={textures} />
        </Canvas>
      )}
    </div>
  );
}
