"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox } from "@react-three/drei";

/** Draw a branded telemetry dashboard onto a canvas → used as the screen texture. */
function useScreenTexture() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 730;
    const x = c.getContext("2d")!;
    const GOLD = "#D4A847";

    // background
    x.fillStyle = "#0A0A0A";
    x.fillRect(0, 0, c.width, c.height);

    // faint grid
    x.strokeStyle = "rgba(212,168,71,0.10)";
    x.lineWidth = 1;
    for (let i = 40; i < c.width; i += 46) {
      x.beginPath();
      x.moveTo(i, 0);
      x.lineTo(i, c.height);
      x.stroke();
    }
    for (let j = 40; j < c.height; j += 46) {
      x.beginPath();
      x.moveTo(0, j);
      x.lineTo(c.width, j);
      x.stroke();
    }

    // top bar
    x.fillStyle = GOLD;
    x.font = "bold 34px Inter, sans-serif";
    x.fillText("ActiSky", 36, 70);
    x.font = "600 20px monospace";
    x.fillStyle = "rgba(255,255,255,0.5)";
    x.fillText("LIVE · CAN J1939", 36, 100);
    // online dot
    x.fillStyle = GOLD;
    x.beginPath();
    x.arc(470, 60, 9, 0, Math.PI * 2);
    x.fill();

    // big metric
    x.fillStyle = "#FFFFFF";
    x.font = "800 92px Inter, sans-serif";
    x.fillText("24.7", 36, 250);
    x.fillStyle = GOLD;
    x.font = "600 26px monospace";
    x.fillText("ciclos / h", 250, 250);

    // sparkline
    const pts = [0.5, 0.35, 0.6, 0.3, 0.55, 0.25, 0.45, 0.2, 0.4, 0.15, 0.3];
    x.strokeStyle = GOLD;
    x.lineWidth = 4;
    x.beginPath();
    pts.forEach((p, i) => {
      const px = 36 + (i * (c.width - 72)) / (pts.length - 1);
      const py = 300 + p * 150;
      i === 0 ? x.moveTo(px, py) : x.lineTo(px, py);
    });
    x.stroke();
    // area glow under sparkline
    const grad = x.createLinearGradient(0, 300, 0, 470);
    grad.addColorStop(0, "rgba(212,168,71,0.30)");
    grad.addColorStop(1, "rgba(212,168,71,0)");
    x.lineTo(c.width - 36, 470);
    x.lineTo(36, 470);
    x.closePath();
    x.fillStyle = grad;
    x.fill();

    // bottom stat chips
    const chips = ["FUEL 82%", "TEMP 71°", "SEG OK"];
    chips.forEach((label, i) => {
      const w = 142;
      const gx = 36 + i * (w + 14);
      x.fillStyle = "rgba(212,168,71,0.08)";
      x.strokeStyle = "rgba(212,168,71,0.35)";
      x.lineWidth = 2;
      roundRect(x, gx, 540, w, 80, 12);
      x.fill();
      x.stroke();
      x.fillStyle = GOLD;
      x.font = "700 22px monospace";
      x.fillText(label, gx + 16, 588);
    });

    // bottom progress bar
    x.fillStyle = "rgba(255,255,255,0.08)";
    roundRect(x, 36, 660, c.width - 72, 16, 8);
    x.fill();
    x.fillStyle = GOLD;
    roundRect(x, 36, 660, (c.width - 72) * 0.68, 16, 8);
    x.fill();

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    return tex;
  }, []);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function Device() {
  const group = useRef<THREE.Group>(null);
  const screen = useScreenTexture();

  useFrame((state) => {
    if (!group.current) return;
    const px = state.pointer.x;
    const py = state.pointer.y;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, -0.35 + px * 0.4, 0.06);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0.08 - py * 0.3, 0.06);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.7}>
      <group ref={group} rotation={[0.08, -0.35, 0]}>
        {/* gold rim plate behind the body */}
        <RoundedBox args={[2.62, 3.62, 0.12]} radius={0.16} smoothness={6} position={[0, 0, -0.04]}>
          <meshStandardMaterial color="#D4A847" metalness={1} roughness={0.32} />
        </RoundedBox>
        {/* dark rugged body */}
        <RoundedBox args={[2.5, 3.5, 0.18]} radius={0.14} smoothness={6}>
          <meshStandardMaterial color="#161310" metalness={0.85} roughness={0.45} />
        </RoundedBox>
        {/* screen */}
        <mesh position={[0, 0.05, 0.1]}>
          <planeGeometry args={[2.18, 3.05]} />
          <meshStandardMaterial
            map={screen}
            emissiveMap={screen}
            emissive="#ffffff"
            emissiveIntensity={0.55}
            toneMapped={false}
            roughness={0.25}
            metalness={0}
          />
        </mesh>
        {/* camera dot */}
        <mesh position={[0, 1.62, 0.1]}>
          <circleGeometry args={[0.035, 24]} />
          <meshStandardMaterial color="#D4A847" emissive="#D4A847" emissiveIntensity={0.8} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/** Interactive 3D industrial tablet (ActiSky) — floats, follows the cursor. */
export default function Tablet3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6.2], fov: 34 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <pointLight position={[-5, 2, 4]} color="#D4A847" intensity={45} distance={20} />
      <pointLight position={[5, -3, 3]} color="#F5D98B" intensity={22} distance={18} />
      <Device />
    </Canvas>
  );
}
