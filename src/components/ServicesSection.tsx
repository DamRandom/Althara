"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  animate,
  PanInfo,
} from "framer-motion";

const LOGO = "#C3CCD8";
const ACCENT = "#FAFAFA";

type Svc = {
  id: string;
  title: string;
  short: string;
  tag: string;
};

const SERVICES: Svc[] = [
  { id: "dev", title: "Desarrollo Web", short: "Plataformas y e-commerce que escalan.", tag: "Plataformas" },
  { id: "ux", title: "Diseño & UX", short: "Interfaces claras que convierten usuarios en clientes.", tag: "UX" },
  { id: "growth", title: "Marketing & Growth", short: "Campañas con ROI medible y adquisición escalable.", tag: "Adquisición" },
  { id: "social", title: "Gestión de RRSS", short: "Contenido + funnels para convertir comunidad en ventas.", tag: "Social" },
  { id: "hosting", title: "Hosting & Soporte", short: "Operaciones seguras: uptime, backups y despliegues.", tag: "Infra" },
  { id: "brand", title: "Brand & Logo", short: "Identidad que comunica valor y profesionalismo.", tag: "Branding" },
];

export default function ServicesSection() {
  const reduce = useReducedMotion();

  // carousel index
  const [index, setIndex] = useState<number>(0);
  const wrap = (i: number) => (i + SERVICES.length) % SERVICES.length;

  // container measurement
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerW, setContainerW] = useState<number>(1200);

  useLayoutEffect(() => {
    const measure = () => setContainerW(containerRef.current?.clientWidth ?? window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // sizing: compact cards
  const GAP = 18;
  const cardW = (() => {
    if (containerW < 720) return Math.max(220, containerW - 64);
    return Math.min(380, Math.round(containerW * 0.38));
  })();

  const slideWidth = cardW + GAP;

  // motion
  const x = useMotionValue(0);
  const iconOffset = useMotionValue(0);

  const EASE: [number, number, number, number] = [0.2, 0.85, 0.25, 1];
  const TRANS = { duration: reduce ? 0 : 0.7, ease: EASE };

  // animate track x
  useEffect(() => {
    const target = -index * slideWidth;
    const anim = animate(x, target, TRANS);
    return () => anim.stop();
  }, [index, slideWidth, x, reduce]);

  // drag
  const maxLeft = -((SERVICES.length - 1) * slideWidth);
  const dragConstraints = { left: maxLeft, right: 0 };

  const onDragEnd = (_: any, info: PanInfo) => {
    if (reduce) {
      animate(x, -index * slideWidth, TRANS);
      return;
    }
    const dx = info.offset.x;
    const vx = info.velocity.x;
    const threshold = Math.max(56, slideWidth * 0.12);
    if (dx < -threshold || vx < -400) setIndex((i) => wrap(i + 1));
    else if (dx > threshold || vx > 400) setIndex((i) => wrap(i - 1));
    else animate(x, -index * slideWidth, TRANS);
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => wrap(i - 1));
      if (e.key === "ArrowRight") setIndex((i) => wrap(i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // circular dist
  const circularDist = (i: number, center: number) => {
    const raw = Math.abs(i - center);
    return Math.min(raw, SERVICES.length - raw);
  };

  // icon parallax
  const handlePointerMoveCenter = (e: React.PointerEvent) => {
    if (reduce) return;
    const el = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = el.left + el.width / 2;
    const dx = e.clientX - cx;
    const norm = Math.max(-1, Math.min(1, dx / (el.width / 2)));
    iconOffset.set(norm * 8);
  };
  const handlePointerLeaveCenter = () => animate(iconOffset, 0, { duration: 0.5, ease: EASE });

  return (
    <section
      id="services"
      aria-label="Servicios - Althara"
      className="relative w-full flex items-center justify-center px-6 lg:px-20 py-24"
    >
      <div className="w-full max-w-6xl">
        {/* header */}
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(195,204,216,0.45)" }}>
              Solutions
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold" style={{ color: ACCENT }}>
              Services designed to convert visitors into customers
            </h2>
            <p className="mt-3 text-sm font-light max-w-prose" style={{ color: "rgba(255,255,255,0.82)" }}>
              Short, outcome-focused cards. Explore with drag, arrows or keyboard — open any service for full details.
            </p>
          </div>

          {/* nav */}
          <div className="hidden md:flex items-center gap-3">
            <button
              aria-label="Previous"
              onClick={() => setIndex((i) => wrap(i - 1))}
              className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-[rgba(255,255,255,0.04)] transition"
              style={{ borderColor: "rgba(195,204,216,0.12)", color: ACCENT }}
            >
              ←
            </button>
            <button
              aria-label="Next"
              onClick={() => setIndex((i) => wrap(i + 1))}
              className="w-9 h-9 rounded-full border flex items-center justify-center hover:bg-[rgba(255,255,255,0.04)] transition"
              style={{ borderColor: "rgba(195,204,216,0.12)", color: ACCENT }}
            >
              →
            </button>
          </div>
        </div>

        {/* track */}
        <div ref={containerRef} className="relative overflow-hidden">
          <motion.div
            className="flex items-stretch"
            style={{ x, gap: GAP }}
            drag="x"
            dragConstraints={dragConstraints}
            dragElastic={0.16}
            onDragEnd={onDragEnd}
            whileTap={{ cursor: "grabbing" }}
          >
            {SERVICES.map((s, i) => {
              const dist = circularDist(i, index);
              const scale = 1 - Math.min(0.07 * dist, 0.14);
              const opacity = 1 - Math.min(0.22 * dist, 0.72);
              const zIndex = dist === 0 ? 40 : 30 - dist;
              const isCenter = dist === 0;

              return (
                <motion.article
                  key={s.id}
                  className="flex-shrink-0"
                  animate={{ scale, opacity }}
                  transition={{ duration: reduce ? 0 : 0.42, ease: EASE }}
                  style={{ width: `${cardW}px`, zIndex }}
                >
                  <div
                    onPointerMove={isCenter ? handlePointerMoveCenter : undefined}
                    onPointerLeave={isCenter ? handlePointerLeaveCenter : undefined}
                    className={`relative p-4 md:p-5 rounded-xl border backdrop-blur-md ${
                      isCenter ? "bg-[rgba(255,255,255,0.035)]" : "bg-[rgba(255,255,255,0.025)]"
                    }`}
                    style={{
                      borderColor: "rgba(195,204,216,0.08)",
                      boxShadow: isCenter ? "0 8px 22px rgba(0,0,0,0.24)" : undefined,
                    }}
                  >
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold" style={{ color: LOGO }}>{s.tag}</div>
                        <h3 className="mt-1 text-base md:text-lg font-semibold" style={{ color: ACCENT }}>{s.title}</h3>
                        <p className="mt-1 text-sm font-light" style={{ color: "rgba(255,255,255,0.82)" }}>
                          {s.short}
                        </p>

                        <div className="mt-4 flex gap-3">
                          <a
                            href={`/services/${s.id}`}
                            className="px-3 py-2 rounded-md text-sm font-semibold"
                            style={{ color: LOGO, border: "1px solid rgba(195,204,216,0.12)" }}
                          >
                            More
                          </a>
                          <a
                            href="#contact"
                            className="px-3 py-2 rounded-md text-sm font-medium"
                            style={{ color: "rgba(255,255,255,0.86)", background: "rgba(255,255,255,0.02)" }}
                          >
                            Contact
                          </a>
                        </div>
                      </div>

                      <motion.div
                        className="hidden sm:flex items-center justify-center w-12 h-12 rounded-lg"
                        style={{ background: "rgba(195,204,216,0.03)" }}
                        animate={isCenter ? { scale: 1.02 } : { scale: 0.98 }}
                        transition={{ duration: 0.35 }}
                      >
                        <motion.div style={isCenter ? { x: iconOffset } : undefined} className="w-full h-full flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M12 3v18" stroke={LOGO} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 7h16" stroke={LOGO} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {/* dots */}
          <div className="mt-6 flex items-center justify-center gap-3">
            {SERVICES.map((s, i) => (
              <button
                key={i}
                aria-label={`Show ${s.title}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition ${
                  i === index ? "bg-[rgba(195,204,216,0.9)] scale-105" : "bg-[rgba(195,204,216,0.18)] hover:bg-[rgba(195,204,216,0.32)]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
