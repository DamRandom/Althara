"use client";

import { useEffect, useRef } from "react";

const BG = "#06061B";
const ACCENT = "#C3CCD8"; // color del glow

export default function CosmicBackground({ sectionIndex = 0 }: { sectionIndex?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const targetRotationRef = useRef<number>((sectionIndex ?? 0) * (Math.PI / 2));

  useEffect(() => {
    targetRotationRef.current = (sectionIndex ?? 0) * (Math.PI / 2);
  }, [sectionIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;

    const resize = () => {
      w = Math.max(300, window.innerWidth);
      h = Math.max(300, window.innerHeight);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    window.addEventListener("resize", resize);

    const depth = Math.max(w, h);
    const focal = Math.max(w, h) * 0.9;
    const STAR_COUNT = 120;
    const CONNECT_DIST = Math.min(Math.max(w, h) * 0.18, 260);

    type Star = {
      x: number;
      y: number;
      z: number;
      r: number;
      vx: number;
      vy: number;
      vz: number;
      intensity: number;
      connections: number;
    };

    const stars: Star[] = Array.from({ length: STAR_COUNT }, () => ({
      x: (Math.random() - 0.5) * w * 1.2,
      y: (Math.random() - 0.5) * h * 1.2,
      z: (Math.random() - 0.5) * depth,
      r: Math.random() * 1.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14,
      vz: (Math.random() - 0.5) * 0.06,
      intensity: Math.random() * 0.5 + 0.4,
      connections: 0,
    }));

    type Conn = { i: number; j: number; progress: number };
    const connMap = new Map<string, Conn>();

    let rotation = 0;

    const keyFor = (i: number, j: number) => `${Math.min(i, j)}-${Math.max(i, j)}`;

    function project(x: number, y: number, z: number, rot: number) {
      const cos = Math.cos(rot);
      const sin = Math.sin(rot);
      const xr = x * cos - z * sin;
      const zr = x * sin + z * cos;
      const scale = focal / (focal + zr);
      const sx = w / 2 + xr * scale;
      const sy = h / 2 + y * scale;
      return { sx, sy, scale, zr };
    }

    let raf = 0;
    const animate = () => {
      rotation += (targetRotationRef.current - rotation) * 0.06;

      // Fondo liso
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);

      // Capa de neblina radial
      const haze = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.2);
      haze.addColorStop(0, "rgba(6,6,27,0)");
      haze.addColorStop(1, "rgba(6,6,27,0.45)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) s.connections = 0;

      const seenThisFrame = new Set<string>();

      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const a = stars[i];
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dz = a.z - b.z;
          const dist3 = Math.hypot(dx, dy, dz);

          if (dist3 < CONNECT_DIST) {
            a.connections++;
            b.connections++;
            const key = keyFor(i, j);
            seenThisFrame.add(key);

            const existing = connMap.get(key);
            if (existing) {
              existing.progress = Math.min(1, existing.progress + 0.035);
            } else {
              connMap.set(key, { i, j, progress: 0.02 });
            }
          }
        }
      }

      for (const [k, c] of Array.from(connMap.entries())) {
        if (!seenThisFrame.has(k)) {
          c.progress = Math.max(0, c.progress - 0.04);
          if (c.progress <= 0) connMap.delete(k);
        }
      }

      for (const c of connMap.values()) {
        const a = stars[c.i];
        const b = stars[c.j];
        const mx = a.x + (b.x - a.x) * c.progress;
        const my = a.y + (b.y - a.y) * c.progress;
        const mz = a.z + (b.z - a.z) * c.progress;

        const pa = project(a.x, a.y, a.z, rotation);
        const pm = project(mx, my, mz, rotation);

        const alpha = Math.min(0.22, 0.06 + 0.28 * c.progress * pm.scale);
        ctx.strokeStyle = `rgba(195,204,216,${alpha})`;
        ctx.lineWidth = Math.max(0.3, 0.9 * pm.scale);
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pm.sx, pm.sy);
        ctx.stroke();
      }

      for (const s of stars) {
        if (s.connections > 0) s.intensity = Math.min(1, s.intensity + 0.025);
        else s.intensity = Math.max(0.25, s.intensity - 0.01);

        s.x += s.vx;
        s.y += s.vy;
        s.z += s.vz;

        const maxX = w * 0.6 / 2;
        const maxY = h * 0.6 / 2;
        const maxZ = depth / 2;
        if (s.x < -maxX || s.x > maxX) s.vx *= -1;
        if (s.y < -maxY || s.y > maxY) s.vy *= -1;
        if (s.z < -maxZ || s.z > maxZ) s.vz *= -1;

        const p = project(s.x, s.y, s.z, rotation);
        const size = Math.max(0.6, s.r * (0.6 + s.intensity) * p.scale * 1.6);
        if (p.zr > focal * 2) continue;

        // Ajustar alpha según distancia → más lejos = más difuso
        const depthFactor = 1 - Math.min(1, Math.abs(p.zr) / depth);

        ctx.beginPath();
        ctx.fillStyle = ACCENT;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 18 * s.intensity * p.scale * depthFactor;
        ctx.globalAlpha = Math.min(1, (0.85 * s.intensity * p.scale + 0.15) * depthFactor);
        ctx.arc(p.sx, p.sy, size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      connMap.clear();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" style={{ position: "absolute", inset: 0 }} />;
}
