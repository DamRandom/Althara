"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, cubicBezier, PanInfo } from "framer-motion";
import Image from "next/image";

const LOGO = "#C3CCD8";
const ACCENT = "#FAFAFA";

type Project = {
  id: string;
  title: string;
  image: string;
  logo?: string;
  overlay?: string;
  description: string;
  github: string;
  vercel: string;
  tags: string[];
};

const PROJECTS: Project[] = [
  {
    id: "rose-reverie",
    title: "Rose-Reverie",
    image: "/images/projects/rose-reverie.png",
    logo: "/images/projects/rose-reverie-logo.png",
    overlay: "#501823",
    description:
      "Modern website for a beauty salon with a clean, elegant UI focused on conversions and bookings.",
    github: "https://github.com/DamRandom/Rose-Reverie",
    vercel: "https://daly-hair-style.vercel.app/",
    tags: ["Beauty", "UI/UX", "Brand"],
  },
  {
    id: "powerhaus",
    title: "PowerHaus",
    image: "/images/projects/powerhaus.png",
    logo: "/images/projects/powerhaus-logo.png",
    overlay: "#D36112",
    description:
      "E-commerce platform for home appliances: fast, accessible and optimized for checkout conversion.",
    github: "https://github.com/DamRandom/PowerHaus",
    vercel: "https://power-haus.vercel.app/",
    tags: ["E-commerce", "Conversion", "Store"],
  },
  {
    id: "lithub",
    title: "LitHub",
    image: "/images/projects/lithub.png",
    logo: "/images/projects/lithub-logo.png",
    overlay: "#F3F4F6",
    description:
      "Personal book dashboard with reading tracker and built-in ebook viewer (PDF/EPUB).",
    github: "https://github.com/DamRandom/LitHub",
    vercel: "https://lithub.vercel.app",
    tags: ["Dashboard", "Reader", "Productivity"],
  },
];

export default function ProjectsSection() {
  const reduce = useReducedMotion();

  // Filter state
  const [filter, setFilter] = useState<string>("All");

  // Derive tag options (main ones). "All" first.
  const tagOptions = useMemo(() => {
    const all = Array.from(new Set(PROJECTS.flatMap((p) => p.tags)));
    return ["All", ...all];
  }, []);

  // Filtered projects based on selected tag
  const filtered = useMemo(() => {
    if (filter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.tags.includes(filter));
  }, [filter]);

  // Carousel state (index relative to filtered array)
  const [index, setIndex] = useState<number>(0);
  // ensure index stays valid when filtered changes
  useEffect(() => {
    if (filtered.length === 0) {
      setIndex(0);
      return;
    }
    if (index >= filtered.length) setIndex(0);
  }, [filtered.length, index]);

  const wrap = (i: number) => {
    const n = filtered.length || 1;
    return (i + n) % n;
  };

  // layout measuring to keep cards fitting
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerW, setContainerW] = useState<number>(1200);
  const gap = 18;

  useLayoutEffect(() => {
    const update = () => setContainerW(containerRef.current?.clientWidth ?? window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // card width rules - smaller, tighter to keep a compact look
  const cardW = useMemo(() => {
    if (containerW < 720) return Math.max(260, containerW - 48);
    return Math.min(520, Math.round(containerW * 0.52));
  }, [containerW]);

  const transition = { duration: reduce ? 0 : 0.62, ease: cubicBezier(0.25, 0.8, 0.25, 1) };

  const trackXFor = (i: number) => ((containerW - cardW) / 2) - i * (cardW + gap);

  // drag & pointer
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (reduce) return;
    const dx = info.offset.x;
    const threshold = Math.min(80, cardW * 0.1);
    if (dx < -threshold) setIndex((prev) => wrap(prev + 1));
    else if (dx > threshold) setIndex((prev) => wrap(prev - 1));
    isDragging.current = false;
  };

  // keyboard navigation (left/right) — depends on filtered length
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setIndex((i) => wrap(i - 1));
      if (e.key === "ArrowRight") setIndex((i) => wrap(i + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [filtered.length]); // rebind when filtered length changes

  // small helper to show up to 2 tags on card header
  const visibleTags = (p: Project) => p.tags.slice(0, 2);

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen flex items-center justify-center px-6 lg:px-20 py-16"
    >
      <div className="w-full max-w-5xl">
        {/* header + filter */}
        <div className="mb-6 flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: "rgba(195,204,216,0.45)" }}>
              Projects
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold" style={{ color: ACCENT }}>
              Selected works — outcomes first
            </h2>
            <p className="mt-2 text-sm font-light" style={{ color: "rgba(255,255,255,0.72)" }}>
              Scroll or drag to explore. Each preview keeps identity and links minimal.
            </p>
          </div>

          {/* Filter chips (compact) */}
          <div className="flex flex-wrap gap-2">
            {tagOptions.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilter(t);
                  // reset index to 0 when changing filter for clarity
                  setIndex(0);
                }}
                className={`text-xs px-3 py-1 rounded-full transition ${
                  filter === t ? "bg-[rgba(195,204,216,0.06)]" : "hover:bg-[rgba(255,255,255,0.02)]"
                }`}
                style={{ color: ACCENT, border: "1px solid rgba(195,204,216,0.06)" }}
                aria-pressed={filter === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* track (carousel) */}
        <div ref={containerRef} className="relative overflow-hidden">
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragStart={() => (isDragging.current = true)}
            onDragEnd={onDragEnd}
            animate={{ x: trackXFor(index) }}
            transition={transition}
            style={{ display: "flex", gap: `${gap}px` }}
            className="flex items-stretch cursor-grab"
          >
            {filtered.map((p, i) => {
              const isActive = i === index;
              const scale = isActive ? 1 : 0.96;
              const opacity = isActive ? 1 : 0.62;
              const shadow = isActive ? "0 10px 28px rgba(0,0,0,0.24)" : "none";

              return (
                <div key={p.id} style={{ flex: `0 0 ${cardW}px`, maxWidth: `${cardW}px` }} className="flex-shrink-0">
                  <motion.article
                    initial={false}
                    animate={{ scale, opacity }}
                    transition={transition}
                    whileHover={!reduce ? { y: -4 } : undefined}
                    style={{ borderRadius: 10, boxShadow: shadow }}
                    className="relative overflow-hidden rounded-2xl border backdrop-blur-md bg-[rgba(255,255,255,0.01)]"
                  >
                    {/* Image + overlay + logo */}
                    <div className="relative w-full" style={{ height: containerW < 720 ? 140 : 172 }}>
                      <Image src={p.image} alt={p.title} fill className="object-cover" />
                      {p.overlay && (
                        <div
                          className="absolute inset-0 flex justify-center items-center transition-opacity duration-300 hover:opacity-0"
                          style={{ background: `${p.overlay}99`, backdropFilter: "blur(4px)" }}
                        >
                          {p.logo && (
                            <div className="px-3 py-2 bg-[rgba(0,0,0,0.36)] rounded">
                              <Image src={p.logo} alt={`${p.title} logo`} width={100} height={44} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* content */}
                    <div className="p-3 md:p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-semibold" style={{ color: LOGO }}>
                          {visibleTags(p).join(" · ")}
                        </div>
                      </div>

                      <h3 className="mt-1 text-base md:text-lg font-medium" style={{ color: ACCENT }}>
                        {p.title}
                      </h3>

                      <p
                        className="mt-1 text-sm font-light"
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.description}
                      </p>

                      {/* icons only + tooltips on hover */}
                      <div className="mt-3 flex items-center gap-4 text-[rgba(195,204,216,0.9)]">
                        {/* GitHub */}
                        <div className="relative group">
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${p.title} GitHub Repository`}
                            className="hover:text-white transition-colors"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 2C7.58 2 4 5.58 4 10c0 3.54 2.29 6.54 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38C17.71 16.54 20 13.54 20 10 20 5.58 16.42 2 12 2z" />
                            </svg>
                          </a>
                          <span
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition
                 bg-[rgba(0,0,0,0.85)] text-[rgba(255,255,255,0.9)] whitespace-nowrap"
                            role="tooltip"
                          >
                            View code
                          </span>
                        </div>

                        {/* Live */}
                        <div className="relative group">
                          <a
                            href={p.vercel}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${p.title} Live Site`}
                            className="hover:text-white transition-colors"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                              <path d="M12 2L2 22h20L12 2z" />
                            </svg>
                          </a>
                          <span
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded-md opacity-0 group-hover:opacity-100 transition
                 bg-[rgba(0,0,0,0.85)] text-[rgba(255,255,255,0.9)] whitespace-nowrap"
                            role="tooltip"
                          >
                            Visit website
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* dots (for filtered set) */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {filtered.map((_, i) => (
            <button
              key={i}
              aria-label={`Show project ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`w-2 h-2 rounded-full transition ${i === index ? "bg-[rgba(195,204,216,0.85)] scale-105" : "bg-[rgba(195,204,216,0.15)] hover:bg-[rgba(195,204,216,0.28)]"}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 flex items-center justify-center">
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-md font-medium"
            style={{ color: LOGO, border: "1px solid rgba(195,204,216,0.08)" }}
          >
            Let’s map your impact
          </a>
        </div>
      </div>
    </section>
  );
}
