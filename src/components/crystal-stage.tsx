"use client";

import { Billboard, Environment, Lightformer, MeshTransmissionMaterial, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import * as THREE from "three";
import { ConvexGeometry } from "three/examples/jsm/geometries/ConvexGeometry.js";
import { allApps, appHref } from "@/content/apps";
import type { AppId } from "@/content/site";
import { AppIcon, appTheme } from "./app-icon";

const ORDER: AppId[] = ["lummie", "snap", "stars", "glow", "cv", "learn", "move", "dreams"];

// Two tilted orbits (no visible track); Lummie leads the inner one and is drawn larger as the flagship.
const RINGS = [
  { radius: 2.05, tilt: [0.35, 0, -0.18] as const, speed: 0.16, ids: ORDER.slice(0, 4) },
  { radius: 2.8, tilt: [-0.28, 0, 0.22] as const, speed: -0.1, ids: ORDER.slice(4) },
];

// The render loop pauses off screen; when it resumes, the first frame's delta covers the
// whole pause. Clamping it keeps every animation continuing smoothly instead of jumping.
const MAX_STEP = 1 / 30;
const step = (delta: number) => Math.min(delta, MAX_STEP);

const TILE = 0.78;
const TILE_RADIUS = 0.23 * TILE;
const TILE_DEPTH = 0.09;

/** Renders the SVG app icons hidden in the DOM, then turns each into a rounded texture. */
function useIconTextures(hidden: React.RefObject<HTMLDivElement | null>) {
  const [textures, setTextures] = useState<Partial<Record<AppId, THREE.Texture>>>({});

  useEffect(() => {
    const root = hidden.current;
    if (!root) return;
    let cancelled = false;
    const made: THREE.Texture[] = [];

    Promise.all(
      ORDER.map(async (id) => {
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
        ctx.roundRect(0, 0, 256, 256, 59);
        ctx.clip();
        ctx.drawImage(img, 0, 0, 256, 256);
        const gloss = ctx.createLinearGradient(0, 0, 0, 128);
        gloss.addColorStop(0, "rgba(255,255,255,0.22)");
        gloss.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gloss;
        ctx.fillRect(0, 0, 256, 128);

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
      bevelSize: 0.018,
      bevelThickness: 0.018,
      bevelSegments: 3,
      curveSegments: 10,
    });
    geometry.center();
    return geometry;
  }, []);
}

function IconTile({
  id,
  texture,
  geometry,
  angle,
  order,
  intro,
}: {
  id: AppId;
  texture?: THREE.Texture;
  geometry: THREE.BufferGeometry;
  angle: number;
  /** Position in the opening sequence: tiles pop in one after another. */
  order: number;
  intro: React.RefObject<number>;
}) {
  const wobble = useRef<THREE.Group>(null);
  const time = useRef(angle * 3);
  const scale = id === "lummie" ? 1.3 : 1;

  useFrame((_, delta) => {
    const t = (time.current += step(delta));
    if (wobble.current) {
      wobble.current.rotation.y = Math.sin(t * 0.6) * 0.35;
      wobble.current.rotation.x = Math.cos(t * 0.5) * 0.15;
      const pop = backOut(phase(intro.current, INTRO.tiles + order * 0.09, 0.6));
      wobble.current.scale.setScalar(Math.max(scale * pop, 0.0001));
    }
  });

  return (
    <Billboard>
      <group ref={wobble} scale={0.0001}>
        <mesh geometry={geometry}>
          <meshPhysicalMaterial color={appTheme[id].accent} roughness={0.35} clearcoat={1} clearcoatRoughness={0.2} />
        </mesh>
        {texture && (
          <mesh position={[0, 0, TILE_DEPTH / 2 + 0.02]}>
            <planeGeometry args={[TILE, TILE]} />
            <meshBasicMaterial map={texture} transparent toneMapped={false} />
          </mesh>
        )}
      </group>
    </Billboard>
  );
}

function Ring({
  radius,
  tilt,
  speed,
  ids,
  textures,
  geometry,
  still,
  first,
  intro,
}: (typeof RINGS)[number] & {
  textures: Partial<Record<AppId, THREE.Texture>>;
  geometry: THREE.BufferGeometry;
  still: boolean;
  /** Opening-sequence order of this ring's first tile. */
  first: number;
  intro: React.RefObject<number>;
}) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin.current && !still) spin.current.rotation.y += step(delta) * speed;
  });

  return (
    <group rotation={tilt}>
      <group ref={spin}>
        {ids.map((id, i) => {
          const angle = (i / ids.length) * Math.PI * 2;
          return (
            <group key={id} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
              <IconTile id={id} texture={textures[id]} geometry={geometry} angle={angle} order={first + i} intro={intro} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

// AicyLink's own ice shard: a lopsided gem of large flat facets with a chiselled, two-point top.
const GEM: [number, number, number][] = [
  [0.18, 1.55, 0.08],
  [-0.24, 1.18, -0.1],
  [0.72, 0.62, 0.22],
  [0.48, 0.8, -0.48],
  [-0.62, 0.68, 0.38],
  [-0.56, 0.42, -0.5],
  [0.06, 0.55, 0.72],
  [0.82, -0.3, -0.05],
  [-0.78, -0.22, 0.05],
  [0.25, -0.15, 0.78],
  [-0.15, -0.35, -0.75],
  [0.45, -1.05, 0.35],
  [-0.4, -1.0, -0.3],
  [0.05, -1.55, -0.05],
];

/** Stable pseudo-random value in [-1, 1]. */
function jitter(x: number, y: number, z: number, seed: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7 + seed * 19.3) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
}

/** The gem at a given size; any seed other than 0 gives a sibling shard with its own facets. */
function useGemGeometry(size: number, seed = 0) {
  return useMemo(() => {
    const points = GEM.map(([x, y, z]) => {
      const n = seed ? 0.16 : 0;
      return new THREE.Vector3(
        (x + jitter(x, y, z, seed) * n) * size,
        (y + jitter(x, y, z, seed + 1) * n) * size,
        (z + jitter(x, y, z, seed + 2) * n) * size,
      );
    });
    return new ConvexGeometry(points);
  }, [size, seed]);
}

/** Radial gradient sprite: glow, flash and glint textures share this. */
function useRadialTexture(stops: [number, string][], star = false) {
  const key = JSON.stringify(stops) + star;
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([at, color]) => g.addColorStop(at, color));
    ctx.fillStyle = g;
    if (star) {
      // Four-point glint, the same sparkle as the logo.
      ctx.beginPath();
      ctx.moveTo(64, 0);
      ctx.quadraticCurveTo(68, 60, 128, 64);
      ctx.quadraticCurveTo(68, 68, 64, 128);
      ctx.quadraticCurveTo(60, 68, 0, 64);
      ctx.quadraticCurveTo(60, 60, 64, 0);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, 128, 128);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

// Opening sequence, in seconds: a point of light → rays shoot out (the links) → ice forms at
// their ends → the shards pull together into the crystal with a flash → app tiles pop into orbit.
const INTRO = { core: 0.25, rays: 0.55, shards: 0.9, rim: 1.25, gather: 1.8, flash: 2.45, tiles: 2.55, end: 3.6 };

const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);
/** 0 → 1 progress of an intro step that starts at `start` and lasts `length` seconds. */
const phase = (time: number, start: number, length: number) => clamp01((time - start) / length);
/** Ease-out with a slight overshoot, so things settle with a little snap. */
const backOut = (t: number) => {
  const c = 1.6;
  return t <= 0 ? 0 : 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};

// One glint that now and then sparkles on the crystal's tip, like the sparkle in the logo.
const GLINT_AT: [number, number, number] = [GEM[0][0], GEM[0][1], GEM[0][2]];

// What the ice refracts: a pale sky instead of the transparent (black) canvas.
const ICE_BACKGROUND = new THREE.Color("#f1efff");

// "Aicy Link": the crystal holds a cluster of ice shards. Whole, they hide inside it; as
// `shatter` goes to 1 they break out, drift apart and light links appear between them.
type Shard = {
  size: "m" | "s";
  at: [number, number, number];
  rot: [number, number, number];
  scale: number;
  apart: [number, number, number];
};

const SHARDS: Shard[] = [
  { size: "s", at: [0.62, -0.75, 0.2], rot: [0.2, 0.4, -0.55], scale: 1, apart: [2.4, 0.9, 0.4] },
  { size: "s", at: [-0.58, -0.9, -0.15], rot: [-0.1, 0.9, 0.62], scale: 0.8, apart: [-2.5, 0.4, -0.3] },
  { size: "s", at: [0.32, -1.05, -0.45], rot: [-0.3, 0, 0.3], scale: 0.7, apart: [1.4, -2.0, -0.6] },
  { size: "s", at: [-0.25, -1.1, 0.45], rot: [0.35, 0.2, -0.2], scale: 0.65, apart: [-1.3, -2.1, 0.8] },
  { size: "m", at: [0.7, -0.3, -0.35], rot: [0, 0.5, -0.9], scale: 0.5, apart: [2.1, -0.7, -1.2] },
  { size: "m", at: [-0.66, -0.35, 0.3], rot: [0.2, -0.4, 0.95], scale: 0.45, apart: [-2.0, 1.7, 0.5] },
];

// In the lab the shards become the apps in development, linked to the core.
const SHARD_APPS: AppId[] = ["snap", "stars", "glow", "move", "learn", "dreams"];
const appName = (id: AppId) => allApps.find((a) => a.id === id)?.name ?? id;

// Links between shard centers (index 0 is the main crystal).
const LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
  [1, 5], [5, 3], [3, 4], [4, 2], [2, 6], [6, 1],
];

function Crystal({
  compact,
  shatter,
  intro,
  textures,
  onOpen,
  label,
}: {
  /** Phones and tablets: a lighter glass material instead of the refraction pass. */
  compact: boolean;
  shatter: React.RefObject<number>;
  /** Seconds since the opening sequence started. */
  intro: React.RefObject<number>;
  textures: Partial<Record<AppId, THREE.Texture>>;
  onOpen: (id: AppId) => void;
  /** DOM pill that names the hovered app; positioned here every frame. */
  label: React.RefObject<HTMLSpanElement | null>;
}) {
  const main = useGemGeometry(1);
  const small = useGemGeometry(0.5, 7);
  const medium = useGemGeometry(0.68, 3);
  const glowTexture = useRadialTexture([
    [0, "rgba(125,211,252,0.55)"],
    [0.4, "rgba(167,139,250,0.22)"],
    [1, "rgba(186,230,253,0)"],
  ]);
  const flashTexture = useRadialTexture([
    [0, "rgba(255,255,255,1)"],
    [0.25, "rgba(186,230,253,0.85)"],
    [1, "rgba(125,211,252,0)"],
  ]);
  const glintTexture = useRadialTexture(
    [
      [0, "rgba(255,255,255,1)"],
      [0.12, "rgba(224,242,254,0.95)"],
      [1, "rgba(56,189,248,0.6)"],
    ],
    true,
  );

  const spin = useRef<THREE.Group>(null);
  const bob = useRef<THREE.Group>(null);
  const mainMesh = useRef<THREE.Mesh>(null);
  const shards = useRef<(THREE.Mesh | null)[]>([]);
  const icons = useRef<(THREE.Group | null)[]>([]);
  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const glint = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const interactive = useRef(false);
  const core = useRef<THREE.Mesh>(null);
  const coreLight = useRef<THREE.PointLight>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const links = useRef<THREE.LineSegments>(null);
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const flash = useRef<THREE.Mesh>(null);
  const time = useRef(0);
  const linkPositions = useMemo(() => new Float32Array(LINKS.length * 6), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const reach = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, size }, delta) => {
    const dt = step(delta);
    const t = (time.current += dt);
    const T = intro.current ?? INTRO.end;
    const k = ease(clamp01(shatter.current ?? 0));
    interactive.current = k > 0.85 && T >= INTRO.end;

    // Opening steps (each 0 → 1)
    const coreIn = backOut(phase(T, INTRO.core, 0.5));
    const rays = ease(phase(T, INTRO.rays, 0.6));
    const rim = ease(phase(T, INTRO.rim, 0.45));
    const mainIn = backOut(phase(T, INTRO.gather + 0.15, 0.8));
    const settled = phase(T, INTRO.tiles, 0.6);
    const flashT = phase(T, INTRO.flash, 0.9);

    // Nearly still as a linked network (so app icons are easy to point at), frozen while one is hovered.
    if (spin.current && hovered === null) spin.current.rotation.y += dt * lerp(0.12, 0.025, k);
    if (bob.current) {
      bob.current.position.y = Math.sin(t * 0.9) * 0.05;
      bob.current.rotation.z = Math.sin(t * 0.6) * 0.04;
      bob.current.rotation.x = Math.cos(t * 0.5) * 0.05;
    }

    const centers: THREE.Vector3[] = [];
    if (mainMesh.current) {
      mainMesh.current.position.set(0, k * 0.3, 0);
      mainMesh.current.rotation.z = k * 0.4;
      mainMesh.current.scale.setScalar(Math.max((1 - k * 0.25) * mainIn, 0.0001));
      centers.push(mainMesh.current.position);
    }
    SHARDS.forEach((shard, i) => {
      const mesh = shards.current[i];
      if (!mesh) return;
      const drift = Math.sin(t * 0.7 + i) * 0.08 * k;
      mesh.position.set(lerp(shard.at[0], shard.apart[0], k), lerp(shard.at[1], shard.apart[1], k) + drift, lerp(shard.at[2], shard.apart[2], k));
      mesh.rotation.set(shard.rot[0] + k * t * 0.15, shard.rot[1] + k * t * 0.2, shard.rot[2]);
      // Ice forms at the end of each ray, one shard after another.
      const grow = backOut(phase(T, INTRO.shards + i * 0.07, 0.45));
      // Whole, the crystal is a single clean gem: the shards only exist while it is broken apart.
      mesh.scale.setScalar(Math.max(shard.scale * k * 1.35 * grow, 0.0001));
      centers.push(mesh.position);
      // App icon floating in front of the shard, larger when hovered.
      const icon = icons.current[i];
      if (icon) {
        icon.position.copy(mesh.position);
        icon.position.z += 0.35;
        const target = Math.max(k * 1.4 - 0.4, 0) * (hovered === i ? 1.25 : 1) * settled;
        icon.scale.setScalar(THREE.MathUtils.damp(icon.scale.x, target, 10, dt));
      }
      // A pulse of light running from the core out to the shard.
      const pulse = pulses.current[i];
      if (pulse && mainMesh.current) {
        const f = (t * 0.45 + i / SHARDS.length) % 1;
        pulse.position.lerpVectors(mainMesh.current.position, mesh.position, f);
        pulse.scale.setScalar(k * (0.6 + Math.sin(f * Math.PI) * 0.6) * phase(T, INTRO.rim, 0.3));
      }
    });

    // The tip sparkles now and then while the crystal is whole.
    if (glint.current) {
      const twinkle = Math.max(0, Math.sin(t * 0.8)) ** 10;
      glint.current.scale.setScalar(Math.max(0.5 * twinkle * (1 - k) * settled, 0.0001));
      glint.current.rotation.z = t * 0.3;
    }

    // Name pill under the hovered app icon.
    const pill = label.current;
    const hoveredIcon = hovered !== null ? icons.current[hovered] : null;
    if (pill) {
      if (hoveredIcon) {
        hoveredIcon.getWorldPosition(projected).project(camera);
        const x = (projected.x * 0.5 + 0.5) * size.width;
        const y = (-projected.y * 0.5 + 0.5) * size.height;
        pill.textContent = `${appName(SHARD_APPS[hovered!])} →`;
        pill.style.transform = `translate(-50%, 0) translate(${x}px, ${y + 34}px)`;
        pill.style.opacity = "1";
      } else {
        pill.style.opacity = "0";
      }
    }

    if (core.current) core.current.scale.setScalar(Math.max(coreIn * (1 - k * 0.6) * (1 + (1 - mainIn) * 0.4), 0.0001));
    if (coreLight.current) coreLight.current.intensity = 6 * coreIn + Math.sin(flashT * Math.PI) * 60;
    if (sweep.current) {
      // A light circling the crystal makes its facets flash in turn.
      sweep.current.position.set(Math.cos(t * 0.7) * 3, Math.sin(t * 0.45) * 1.6, Math.sin(t * 0.7) * 3);
      sweep.current.intensity = 22 * mainIn;
    }
    if (glow.current) glow.current.opacity = 0.6 * mainIn * (1 - k * 0.6);
    if (flash.current) {
      const f = flashT > 0 && flashT < 1 ? Math.sin(flashT * Math.PI) : 0;
      flash.current.scale.setScalar(Math.max(1.5 + flashT * 3, 0.0001));
      (flash.current.material as THREE.MeshBasicMaterial).opacity = f;
      flash.current.visible = f > 0.01;
    }

    if (links.current && centers.length === SHARDS.length + 1) {
      LINKS.forEach(([a, b], i) => {
        // Rays grow out of the core first; the ring between shards closes once the ice has formed.
        reach.lerpVectors(centers[a], centers[b], a === 0 ? rays : rim);
        centers[a].toArray(linkPositions, i * 6);
        reach.toArray(linkPositions, i * 6 + 3);
      });
      links.current.geometry.attributes.position.needsUpdate = true;
      (links.current.material as THREE.LineBasicMaterial).opacity = k * 0.85;
      links.current.visible = k > 0.02 && rays > 0;
    }
  });

  return (
    <group ref={bob}>
      {/* Soft cool light behind the ice */}
      <Billboard position={[0, 0, -1.4]}>
        <mesh scale={6}>
          <planeGeometry />
          <meshBasicMaterial ref={glow} map={glowTexture} transparent depthWrite={false} opacity={0} toneMapped={false} />
        </mesh>
      </Billboard>

      <group ref={spin} scale={1.3}>
        <mesh ref={mainMesh} geometry={main} scale={0.0001}>
          {compact ? (
            <meshPhysicalMaterial
              flatShading
              color="#8fd3fb"
              emissive="#0ea5e9"
              emissiveIntensity={0.2}
              roughness={0.08}
              metalness={0.15}
              clearcoat={1}
              clearcoatRoughness={0.04}
              iridescence={0.7}
              iridescenceIOR={1.31}
              envMapIntensity={2.4}
              transparent
              opacity={0.9}
            />
          ) : (
            <MeshTransmissionMaterial
              flatShading
              samples={6}
              resolution={512}
              thickness={1.4}
              roughness={0.03}
              ior={1.31}
              chromaticAberration={0.6}
              anisotropicBlur={0.2}
              distortion={0.25}
              distortionScale={0.4}
              temporalDistortion={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              iridescence={0.3}
              iridescenceIOR={1.31}
              color="#e0f2fe"
              attenuationColor="#7dd3fc"
              attenuationDistance={4}
              backside
              backsideThickness={0.6}
              background={ICE_BACKGROUND}
            />
          )}
          <Billboard position={GLINT_AT}>
            <group ref={glint} scale={0.0001}>
              <mesh>
                <planeGeometry />
                <meshBasicMaterial map={glintTexture} transparent depthWrite={false} toneMapped={false} />
              </mesh>
            </group>
          </Billboard>
        </mesh>

        {/* Shards use a light glass look; one transmission pass for the main crystal keeps it fast. */}
        {SHARDS.map((shard, i) => (
          <mesh
            key={i}
            ref={(m) => {
              shards.current[i] = m;
            }}
            geometry={shard.size === "m" ? medium : small}
            position={shard.at}
            rotation={shard.rot}
            scale={0.0001}
          >
            <meshPhysicalMaterial
              flatShading
              color="#cfeefe"
              emissive="#38bdf8"
              emissiveIntensity={0.22}
              roughness={0.04}
              metalness={0}
              clearcoat={1}
              clearcoatRoughness={0.05}
              iridescence={0.8}
              iridescenceIOR={1.31}
              envMapIntensity={1.1}
              transparent
              opacity={0.42}
              depthWrite={false}
            />
          </mesh>
        ))}

        {SHARD_APPS.map((id, i) => (
          <Billboard
            key={id}
            ref={(g) => {
              icons.current[i] = g;
            }}
            scale={0}
          >
            <mesh
              onPointerOver={(e) => {
                if (!interactive.current) return;
                e.stopPropagation();
                setHovered(i);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = "";
              }}
              onClick={(e) => {
                if (!interactive.current) return;
                e.stopPropagation();
                document.body.style.cursor = "";
                onOpen(id);
              }}
            >
              <planeGeometry args={[0.62, 0.62]} />
              <meshBasicMaterial map={textures[id]} transparent toneMapped={false} visible={Boolean(textures[id])} />
            </mesh>
          </Billboard>
        ))}

        {SHARDS.map((_, i) => (
          <mesh
            key={`pulse-${i}`}
            ref={(m) => {
              pulses.current[i] = m;
            }}
            scale={0}
          >
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
          </mesh>
        ))}

        <lineSegments ref={links} visible={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linkPositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0} toneMapped={false} />
        </lineSegments>

        {/* Glowing core seen through the ice */}
        <mesh ref={core} scale={0.0001}>
          <icosahedronGeometry args={[0.22, 1]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
        <pointLight ref={coreLight} color="#38bdf8" intensity={0} distance={4} />
      </group>

      <pointLight ref={sweep} color="#ffffff" intensity={0} distance={8} />


      {/* The moment the shards lock together: a soft flash */}
      <Billboard>
        <mesh ref={flash} visible={false}>
          <planeGeometry />
          <meshBasicMaterial map={flashTexture} transparent depthWrite={false} opacity={0} toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  );
}

/** Tilts the scene toward the pointer. It rotates in place, so the crystal stays centered on its anchor. */
function TiltRig({ still, children }: { still: boolean; children: React.ReactNode }) {
  const tilt = useRef<THREE.Group>(null);
  useFrame(({ pointer }, delta) => {
    if (still || !tilt.current) return;
    const k = 1 - Math.exp(-step(delta) * 2.5);
    tilt.current.rotation.y += (pointer.x * 0.18 - tilt.current.rotation.y) * k;
    tilt.current.rotation.x += (-pointer.y * 0.1 - tilt.current.rotation.x) * k;
  });
  return <group ref={tilt}>{children}</group>;
}

// ---------------------------------------------------------------------------
// Scroll choreography
//
// Elements marked with data-crystal-anchor are invisible boxes in the page. The crystal sits on
// the first one, and while the page scrolls it glides from one anchor to the next: when anchor
// A is centered in the window the crystal is on A, when B is centered it is on B, and in between
// it holds the window's vertical middle while x and size ease from A to B.
// ---------------------------------------------------------------------------

/** Width of the scene in world units when it exactly fills an anchor box. */
const SCENE_WORLD_SIZE = 6.7;

const ease = (t: number) => t * t * (3 - 2 * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Target = { x: number; y: number; size: number; progress: number; hero: number; shatter: number };

/**
 * Where the crystal should be right now, in window pixels, and how broken apart it is.
 * Each anchor may set data-crystal-shatter (0 = whole, 1 = linked shards). In flight between
 * anchors it cracks open and closes again; past the last anchor it breaks up as it leaves.
 */
function readTarget(): Target | null {
  const anchors = [...document.querySelectorAll<HTMLElement>("[data-crystal-anchor]")]
    .map((el) => ({ rect: el.getBoundingClientRect(), shatter: Number(el.dataset.crystalShatter ?? 0) }))
    .filter((a) => a.rect.width > 0);
  if (!anchors.length) return null;

  const mid = window.innerHeight / 2;
  const at = ({ rect, shatter }: (typeof anchors)[number]) => ({
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    size: rect.width,
    shatter,
  });
  const first = at(anchors[0]);
  if (first.y >= mid) return { ...first, progress: 0, hero: 1 };

  for (let i = 0; i < anchors.length - 1; i++) {
    const a = at(anchors[i]);
    const b = at(anchors[i + 1]);
    if (a.y <= mid && b.y > mid) {
      const t = (mid - a.y) / (b.y - a.y);
      const e = ease(t);
      return {
        x: lerp(a.x, b.x, e),
        y: mid,
        size: lerp(a.size, b.size, e),
        progress: i + t,
        hero: i === 0 ? 1 - ease(Math.min(t / 0.5, 1)) : 0,
        shatter: Math.min(1, lerp(a.shatter, b.shatter, e) + Math.sin(Math.PI * t) * 0.75),
      };
    }
  }
  const last = at(anchors[anchors.length - 1]);
  const leaving = Math.min(1, (mid - last.y) / (window.innerHeight * 0.5));
  return { ...last, progress: anchors.length - 1 + leaving * 0.5, hero: 0, shatter: Math.max(last.shatter, leaving) };
}

// Soft warm halo that travels with the crystal once it leaves the hero's gradient.
function useHaloTexture() {
  return useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,190,160,0.75)");
    g.addColorStop(0.45, "rgba(196,181,253,0.4)");
    g.addColorStop(1, "rgba(186,230,253,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 256, 256);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

type CardLink = { path: SVGPathElement | null; dot: SVGCircleElement | null };

/**
 * Light lines from the crystal to every element marked data-crystal-link (the Company cards),
 * shown while the crystal rests at the last anchor and each card is on screen.
 */
function updateCardLinks(links: CardLink[], from: { x: number; y: number }, weight: number) {
  const cards = [...document.querySelectorAll<HTMLElement>("[data-crystal-link]")];
  links.forEach((link, i) => {
    const card = cards[i]?.getBoundingClientRect();
    if (!link.path || !link.dot) return;
    if (!card || weight <= 0.01) {
      link.path.style.opacity = link.dot.style.opacity = "0";
      return;
    }
    const x = card.left + card.width / 2;
    const y = card.top;
    const onScreen = Math.min(1, Math.max(0, (window.innerHeight - card.top) / 200));
    link.path.setAttribute("d", `M${from.x} ${from.y} Q${x} ${from.y} ${x} ${y}`);
    link.dot.setAttribute("cx", String(x));
    link.dot.setAttribute("cy", String(y));
    link.path.style.opacity = link.dot.style.opacity = String(weight * onScreen);
  });
}

function Follow({
  children,
  orbits,
  shatter,
  intro,
  cardLinks,
  compact,
}: {
  children: React.ReactNode;
  orbits: React.RefObject<THREE.Group | null>;
  shatter: React.RefObject<number>;
  intro: React.RefObject<number>;
  cardLinks: React.RefObject<CardLink[]>;
  /** The canvas sits inside the hero anchor itself (see COMPACT_BLEED), so the crystal simply stays centered. */
  compact: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const turn = useRef<THREE.Group>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const haloTexture = useHaloTexture();

  useFrame(({ size, viewport }, delta) => {
    const target = compact
      ? { x: size.width / 2, y: size.height / 2, size: size.width / COMPACT_BLEED, progress: 0, hero: 1, shatter: 0 }
      : readTarget();
    if (!target || !group.current) return;
    // Opening sequence clock; the shards stay apart until they gather into the crystal.
    intro.current += step(delta);
    const apart = 1 - ease(phase(intro.current, INTRO.gather, 0.75));
    const unit = viewport.height / size.height;
    group.current.position.set((target.x - size.width / 2) * unit, -(target.y - size.height / 2) * unit, 0);
    group.current.scale.setScalar((target.size * unit) / SCENE_WORLD_SIZE);
    // A half turn per leg of the journey keeps it alive while it travels.
    if (turn.current) turn.current.rotation.y = target.progress * Math.PI;
    if (orbits.current) {
      orbits.current.scale.setScalar(Math.max(target.hero, 0.001));
      orbits.current.visible = target.hero > 0.01;
    }
    if (halo.current) halo.current.opacity = (1 - target.hero) * (1 - target.shatter * 0.5);
    shatter.current = Math.max(target.shatter, apart);

    if (compact) return;
    const anchors = document.querySelectorAll("[data-crystal-anchor]").length;
    const atLast = Math.max(0, 1 - Math.abs(target.progress - (anchors - 1)) * 2.5);
    updateCardLinks(cardLinks.current ?? [], target, atLast * (1 - target.shatter));
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, -3]} scale={9}>
        <planeGeometry />
        <meshBasicMaterial ref={halo} map={haloTexture} transparent depthWrite={false} opacity={0} toneMapped={false} />
      </mesh>
      <group ref={turn}>{children}</group>
    </group>
  );
}

// Phones and tablets show only the hero anchor. There the canvas is placed inside that box,
// slightly larger so orbiting tiles are not cut off, and scrolls with the page natively.
const COMPACT_QUERY = "(max-width: 1023px)";
const COMPACT_BLEED = 1.3;

export default function CrystalStage() {
  const hidden = useRef<HTMLDivElement>(null);
  const aurora = useRef<HTMLDivElement>(null);
  const orbits = useRef<THREE.Group>(null);
  const shatter = useRef(0);
  const intro = useRef(0);
  const cardLinks = useRef<CardLink[]>([0, 1, 2].map(() => ({ path: null, dot: null })));
  const router = useRouter();
  const label = useRef<HTMLSpanElement>(null);
  const textures = useIconTextures(hidden);
  const geometry = useTileGeometry();
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [env, setEnv] = useState({ still: false, touch: false });
  const [heroBox, setHeroBox] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnv({ still, touch: window.matchMedia("(pointer: coarse)").matches });
    if (still) intro.current = INTRO.end;

    const compactQuery = window.matchMedia(COMPACT_QUERY);
    const onCompact = () => setHeroBox(compactQuery.matches ? document.querySelector<HTMLElement>("[data-crystal-anchor]") : null);
    onCompact();
    compactQuery.addEventListener("change", onCompact);

    // Render only while an anchor is near the window, and fade the hero gradient as the page moves on.
    const onScroll = () => {
      const anchors = [...document.querySelectorAll<HTMLElement>("[data-crystal-anchor]")].filter((el) => el.offsetWidth > 0);
      const last = (compactQuery.matches ? anchors[0] : anchors.at(-1))?.getBoundingClientRect();
      setActive(!last || last.bottom > (compactQuery.matches ? 0 : -window.innerHeight * 0.25));
      if (aurora.current) aurora.current.style.opacity = String(Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      compactQuery.removeEventListener("change", onCompact);
    };
  }, []);

  const compact = heroBox !== null;
  const scene = (
    <Canvas
      className={`transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      // The canvas sits under the page, so it listens on the document to stay draggable.
      eventSource={compact || typeof document === "undefined" ? undefined : document.body}
      eventPrefix={compact ? undefined : "client"}
      style={compact ? { pointerEvents: "none" } : undefined}
      camera={{ position: [0, 0, 9.2], fov: 40 }}
      dpr={[1, compact ? 1.5 : 1.75]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={() => setReady(true)}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#fb923c" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={2.5} color="#7c5cff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={2} color="#38bdf8" position={[0, -3, -4]} scale={4} />
      </Environment>

      <Follow orbits={orbits} shatter={shatter} intro={intro} cardLinks={cardLinks} compact={compact}>
        <PresentationControls
          enabled={!env.touch}
          global={false}
          cursor={false}
          snap
          speed={1.4}
          rotation={[0.12, -0.3, 0]}
          polar={[-0.35, 0.35]}
          azimuth={[-Math.PI / 1.5, Math.PI / 1.5]}
        >
          <TiltRig still={env.still || env.touch}>
            <Crystal
              compact={compact}
              shatter={shatter}
              intro={intro}
              textures={textures}
              label={label}
              onOpen={(id) => router.push(appHref(id))}
            />
            <group ref={orbits}>
              {RINGS.map((ring, r) => (
                <Ring
                  key={ring.radius}
                  {...ring}
                  textures={textures}
                  geometry={geometry}
                  still={env.still}
                  first={RINGS.slice(0, r).reduce((n, x) => n + x.ids.length, 0)}
                  intro={intro}
                />
              ))}
            </group>
          </TiltRig>
        </PresentationControls>
      </Follow>
    </Canvas>
  );

  return (
    <>
      {/* Behind all page content: sections with their own background simply cover it. */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div ref={aurora} className="aurora absolute inset-0" />

        <svg className="absolute inset-0 size-full" aria-hidden>
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <path
                ref={(el) => {
                  cardLinks.current[i].path = el;
                }}
                className="crystal-link"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                style={{ opacity: 0 }}
              />
              <circle
                ref={(el) => {
                  cardLinks.current[i].dot = el;
                }}
                r="4"
                fill="#38bdf8"
                style={{ opacity: 0 }}
              />
            </g>
          ))}
        </svg>

        <span
          ref={label}
          className="absolute left-0 top-0 z-10 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-200"
        />

        <div ref={hidden} className="hidden">
          {ORDER.map((id) => (
            <span key={id} data-icon={id}>
              <AppIcon id={id} />
            </span>
          ))}
        </div>

        {!compact && scene}
      </div>
      {heroBox &&
        createPortal(
          <div className="pointer-events-none absolute" style={{ inset: `${-((COMPACT_BLEED - 1) / 2) * 100}%` }} aria-hidden>
            {scene}
          </div>,
          heroBox,
        )}
    </>
  );
}
