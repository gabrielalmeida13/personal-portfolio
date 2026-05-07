"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Geometry constants — computed once at module load, shared across renders.
// IcosahedronGeometry detail=3 produces 642 vertices / 1280 faces.
// WireframeGeometry converts the triangulated faces into line-segment pairs
// so THREE.LineSegments can draw every edge cleanly.
// ---------------------------------------------------------------------------
const BASE_GEO = new THREE.IcosahedronGeometry(2, 3);
const WIRE_GEO = new THREE.WireframeGeometry(BASE_GEO);

// ---------------------------------------------------------------------------

interface SceneContentProps {
  isPlayingRef: React.RefObject<boolean>;
}

function SceneContent({ isPlayingRef }: SceneContentProps) {
  // ---- Materials (lazy-init refs: created once, never re-allocated) ----
  const pointsMatRef = useRef<THREE.PointsMaterial | null>(null);
  const linesMatRef = useRef<THREE.LineBasicMaterial | null>(null);

  if (!pointsMatRef.current) {
    pointsMatRef.current = new THREE.PointsMaterial({
      color: "#60A5FA",
      size: 0.05,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
  }
  if (!linesMatRef.current) {
    linesMatRef.current = new THREE.LineBasicMaterial({
      color: "#3B82F6",
      transparent: true,
      opacity: 0.15,
    });
  }

  const pMat = pointsMatRef.current;
  const lMat = linesMatRef.current;

  // ---- Animation state ----
  const outerRef = useRef<THREE.Group>(null); // mouse parallax
  const innerRef = useRef<THREE.Group>(null); // continuous rotation
  const t = useRef(0);
  const rotSpeed = useRef(0.2);              // smoothly interpolated speed
  const mouse = useRef({ x: 0, y: 0 });
  const smoothed = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    t.current += delta;

    // Smooth mouse parallax on outer group
    smoothed.current.x += (mouse.current.x - smoothed.current.x) * 0.05;
    smoothed.current.y += (mouse.current.y - smoothed.current.y) * 0.05;
    if (outerRef.current) {
      outerRef.current.rotation.x = smoothed.current.y * 0.30;
      outerRef.current.rotation.y = smoothed.current.x * 0.40;
    }

    // Smoothly accelerate / decelerate rotation speed based on Spotify state
    const playing = isPlayingRef.current;
    const targetSpeed = playing ? 0.65 : 0.20;
    rotSpeed.current += (targetSpeed - rotSpeed.current) * 0.04;

    // Idle rotation on Y and X
    if (innerRef.current) {
      innerRef.current.rotation.y += delta * rotSpeed.current * 0.50;
      innerRef.current.rotation.x += delta * rotSpeed.current * 0.18;
    }

    // Lines opacity: pulse 0.15 <-> 0.40 when playing, fade to 0.15 when idle
    if (playing) {
      lMat.opacity = 0.15 + 0.25 * (0.5 + 0.5 * Math.sin(t.current * 2.5));
    } else {
      lMat.opacity += (0.15 - lMat.opacity) * 0.04;
    }
  });

  return (
    <group ref={outerRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={innerRef}>
          <points geometry={BASE_GEO} material={pMat} />
          <lineSegments geometry={WIRE_GEO} material={lMat} />
        </group>
      </Float>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Scene: Canvas shell + Spotify polling.
// No lights needed — PointsMaterial and LineBasicMaterial are unlit.
// No postprocessing — raw math, maximum stability.
// ---------------------------------------------------------------------------
export function Scene() {
  const isPlayingRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await fetch("/api/spotify");
        if (res.ok) {
          const data = (await res.json()) as { isPlaying?: boolean };
          isPlayingRef.current = data.isPlaying === true;
        }
      } catch {
        // network error — keep last known state
      }
      if (!cancelled) setTimeout(poll, 30_000);
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <SceneContent isPlayingRef={isPlayingRef} />
    </Canvas>
  );
}
