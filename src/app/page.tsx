"use client";

import { useEffect, useRef, useState } from "react";
import AboutSection from "@/components/AboutSection";
import IntroSection from "@/components/IntroSection";
import ServicesSection from "@/components/ServicesSection";
import CosmicBackground from "@/components/CosmicBackground";
import ProjectsSection from "@/components/ProjectsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import ContactSection from "@/components/ContactSection"; // <-- nuevo

export default function Home() {
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const [current, setCurrent] = useState<number>(0);
  const lastTime = useRef<number>(0);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setCurrent(0);
  }, []);

  // wheel
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - lastTime.current < 700) return;
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

  // touch
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

  // keyboard
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

  // observer
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
      <div className="fixed inset-0 pointer-events-none z-0">
        <CosmicBackground sectionIndex={current} />
      </div>

      <div className="relative z-10">
        {/* Intro */}
        <div
          ref={(el) => {
            sectionsRef.current[0] = el;
          }}
          className="h-screen flex items-center justify-center"
        >
          <IntroSection />
        </div>

        {/* About */}
        <div
          ref={(el) => {
            sectionsRef.current[1] = el;
          }}
          className="h-screen flex items-center justify-center"
        >
          <AboutSection />
        </div>

        {/* Services */}
        <div
          ref={(el) => {
            sectionsRef.current[2] = el;
          }}
          className="h-screen flex items-center justify-center"
        >
          <ServicesSection />
        </div>

        {/* Projects */}
        <div
          ref={(el) => {
            sectionsRef.current[3] = el;
          }}
          className="min-h-screen flex items-center justify-center py-12 px-6"
        >
          <div className="max-w-6xl w-full">
            <ProjectsSection />
          </div>
        </div>

        {/* Testimonials */}
        <div
          ref={(el) => {
            sectionsRef.current[4] = el;
          }}
          className="min-h-screen flex items-center justify-center py-12 px-6"
        >
          <div className="max-w-6xl w-full">
            <TestimonialsSection />
          </div>
        </div>

        {/* Contact / CTA */}
        <div
          ref={(el) => {
            sectionsRef.current[5] = el;
          }}
          className="min-h-screen flex items-center justify-center py-12 px-6"
        >
          <div className="max-w-6xl w-full">
            <ContactSection />
          </div>
        </div>
      </div>
    </main>
  );
}
