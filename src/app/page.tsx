"use client";

import { useEffect, useRef, useState } from "react";
import AboutSection from "@/components/AboutSection";
import IntroSection from "@/components/IntroSection";
import CosmicBackground from "@/components/CosmicBackground";

export default function Home() {
  // refs a los contenedores de sección
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const [current, setCurrent] = useState<number>(0);
  const lastTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  // asegurar que arrancamos en la primera sección
  useEffect(() => {
    window.scrollTo({ top: 0 });
    setCurrent(0);
  }, []);

  // wheel -> navegar entre secciones
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      // bloquea scroll nativo para controlar el paso por secciones
      e.preventDefault();
      const now = Date.now();
      if (now - lastTime.current < 700) return; // debounce
      const delta = e.deltaY;
      if (Math.abs(delta) < 8) return;
      const dir = delta > 0 ? 1 : -1;
      const target = Math.max(
        0,
        Math.min(sectionsRef.current.length - 1, current + dir)
      );
      if (target !== current) {
        lastTime.current = now;
        setCurrent(target);
        sectionsRef.current[target]?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [current]);

  // touch -> swipe
  useEffect(() => {
    const start = (e: TouchEvent) => {
      touchStartY.current = e.touches[0]?.clientY ?? null;
    };
    const end = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const endY = e.changedTouches?.[0]?.clientY ?? 0;
      const diff = touchStartY.current - endY;
      touchStartY.current = null;
      if (Math.abs(diff) < 50) return;
      const now = Date.now();
      if (now - lastTime.current < 700) return;
      const dir = diff > 0 ? 1 : -1;
      const target = Math.max(
        0,
        Math.min(sectionsRef.current.length - 1, current + dir)
      );
      if (target !== current) {
        lastTime.current = now;
        setCurrent(target);
        sectionsRef.current[target]?.scrollIntoView({ behavior: "smooth" });
      }
    };

    window.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchend", end, { passive: true });

    return () => {
      window.removeEventListener("touchstart", start);
      window.removeEventListener("touchend", end);
    };
  }, [current]);

  // keyboard: flechas / pageup/pagedown
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "PageDown"].includes(e.key)) {
        e.preventDefault();
        const target = Math.min(sectionsRef.current.length - 1, current + 1);
        if (target !== current) {
          setCurrent(target);
          sectionsRef.current[target]?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        const target = Math.max(0, current - 1);
        if (target !== current) {
          setCurrent(target);
          sectionsRef.current[target]?.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current]);

  // observar intersecciones para mantener el índice sincronizado si hace falta
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionsRef.current.findIndex(
              (el) => el === entry.target
            );
            if (idx !== -1 && idx !== current) setCurrent(idx);
          }
        });
      },
      { threshold: 0.6 }
    );

    sectionsRef.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sectionsRef.current]);

  return (
    <main className="relative min-h-screen bg-[#06061B] text-white">
      {/* Fondo fijo detrás */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <CosmicBackground sectionIndex={current} />
      </div>

      {/* Contenido encima */}
      <div className="relative z-10">
        <div
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          className="h-screen flex items-center justify-center"
        >
          <IntroSection />
        </div>

        <div
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          className="h-screen flex items-center justify-center"
        >
          <AboutSection />
        </div>

        {/* Si más secciones las pones aquí, aumenta el número de refs (simplemente añade más divs) */}
      </div>
    </main>
  );
}
