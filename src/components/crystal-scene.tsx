"use client";

import { Billboard, Environment, Lightformer, MeshTransmissionMaterial, PresentationControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { AppId } from "@/content/site";
import { AppIcon, appTheme } from "./app-icon";

const ORDER: AppId[] = ["lummie", "snap", "stars", "glow", "cv", "learn", "move", "dreams"];

// Two tilted rings; Lummie leads the inner one and is drawn larger as the flagship.
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

function IconTile({ id, texture, geometry, angle }: { id: AppId; texture?: THREE.Texture; geometry: THREE.BufferGeometry; angle: number }) {
  const wobble = useRef<THREE.Group>(null);
  const time = useRef(angle * 3);
  const scale = id === "lummie" ? 1.3 : 1;

  useFrame((_, delta) => {
    const t = (time.current += step(delta));
    if (wobble.current) {
      wobble.current.rotation.y = Math.sin(t * 0.6) * 0.35;
      wobble.current.rotation.x = Math.cos(t * 0.5) * 0.15;
    }
  });

  return (
    <Billboard>
      <group ref={wobble} scale={scale}>
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
}: (typeof RINGS)[number] & { textures: Partial<Record<AppId, THREE.Texture>>; geometry: THREE.BufferGeometry; still: boolean }) {
  const spin = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (spin.current && !still) spin.current.rotation.y += step(delta) * speed;
  });

  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.006, 8, 160]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.35} />
      </mesh>
      <group ref={spin}>
        {ids.map((id, i) => {
          const angle = (i / ids.length) * Math.PI * 2;
          return (
            <group key={id} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
              <IconTile id={id} texture={textures[id]} geometry={geometry} angle={angle} />
            </group>
          );
        })}
      </group>
    </group>
  );
}

// Hexagonal ice crystal: a six-sided prism with pointed ends.
function useCrystalGeometry(height: number, width: number) {
  return useMemo(() => {
    const h = height / 2;
    const points = [new THREE.Vector2(0, -h), new THREE.Vector2(width, -h * 0.55), new THREE.Vector2(width, h * 0.55), new THREE.Vector2(0, h)];
    const geometry = new THREE.LatheGeometry(points, 6);
    return geometry.toNonIndexed();
  }, [height, width]);
}

// What the ice refracts: a pale sky instead of the transparent (black) canvas.
const ICE_BACKGROUND = new THREE.Color("#e8f6ff");

function Crystal({ mobile }: { mobile: boolean }) {
  const main = useCrystalGeometry(3.1, 0.82);
  const small = useCrystalGeometry(1.6, 0.42);
  const spin = useRef<THREE.Group>(null);
  const bob = useRef<THREE.Group>(null);
  const time = useRef(0);

  useFrame((_, delta) => {
    const dt = step(delta);
    const t = (time.current += dt);
    if (spin.current) spin.current.rotation.y += dt * 0.12;
    if (bob.current) {
      bob.current.position.y = Math.sin(t * 0.9) * 0.05;
      bob.current.rotation.z = Math.sin(t * 0.6) * 0.04;
      bob.current.rotation.x = Math.cos(t * 0.5) * 0.05;
    }
  });

  const material = (
    <MeshTransmissionMaterial
      flatShading
      samples={mobile ? 3 : 6}
      resolution={mobile ? 256 : 512}
      thickness={1.4}
      roughness={0.04}
      ior={1.31}
      chromaticAberration={0.5}
      anisotropicBlur={0.2}
      distortion={0.25}
      distortionScale={0.4}
      temporalDistortion={0}
      color="#e0f2fe"
      attenuationColor="#7dd3fc"
      attenuationDistance={4}
      backside
      backsideThickness={0.6}
      background={ICE_BACKGROUND}
    />
  );

  return (
    <group ref={bob}>
      <group ref={spin} scale={1.3}>
        <mesh geometry={main}>{material}</mesh>
        <mesh geometry={small} position={[0.62, -0.75, 0.2]} rotation={[0.2, 0.4, -0.55]}>
          {material}
        </mesh>
        <mesh geometry={small} position={[-0.58, -0.9, -0.15]} rotation={[-0.1, 0.9, 0.62]} scale={0.8}>
          {material}
        </mesh>
        {/* Glowing core seen through the ice */}
        <mesh>
          <icosahedronGeometry args={[0.32, 1]} />
          <meshBasicMaterial color="#38bdf8" toneMapped={false} />
        </mesh>
        <pointLight color="#38bdf8" intensity={6} distance={4} />
      </group>
    </group>
  );
}

/** Tilts the scene toward the pointer. It rotates in place, so the crystal stays centered in its glow. */
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

export default function CrystalScene() {
  const wrapper = useRef<HTMLDivElement>(null);
  const hidden = useRef<HTMLDivElement>(null);
  const textures = useIconTextures(hidden);
  const geometry = useTileGeometry();
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [env, setEnv] = useState({ mobile: false, still: false, touch: false });

  useEffect(() => {
    setEnv({
      mobile: window.matchMedia("(max-width: 640px)").matches,
      still: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      touch: window.matchMedia("(pointer: coarse)").matches,
    });
    const el = wrapper.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapper} className="relative mx-auto aspect-square w-full max-w-[600px]">
      <div className="ice-glow absolute inset-[-8%] rounded-full" aria-hidden />

      <div ref={hidden} className="hidden" aria-hidden>
        {ORDER.map((id) => (
          <span key={id} data-icon={id}>
            <AppIcon id={id} />
          </span>
        ))}
      </div>

      <Canvas
        className={`!absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"} ${
          env.touch ? "" : "cursor-grab active:cursor-grabbing"
        }`}
        // On touch screens the scene only animates, so swipes keep scrolling the page.
        style={env.touch ? { touchAction: "pan-y" } : undefined}
        camera={{ position: [0, 0, 9.2], fov: 40 }}
        dpr={[1, env.mobile ? 1.5 : 1.75]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
        aria-label="Interactive ice crystal surrounded by AicyLink apps"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} />
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 4, 4]} scale={[8, 2, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#0ea5e9" position={[-5, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#7c5cff" position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
          <Lightformer form="ring" intensity={2} color="#06b6d4" position={[0, -3, -4]} scale={4} />
        </Environment>

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
            <Crystal mobile={env.mobile} />
            {RINGS.map((ring) => (
              <Ring key={ring.radius} {...ring} textures={textures} geometry={geometry} still={env.still} />
            ))}
          </TiltRig>
        </PresentationControls>
      </Canvas>
    </div>
  );
}
