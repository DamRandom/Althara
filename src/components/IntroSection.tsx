"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion, Variants, cubicBezier } from "framer-motion";

const LOGO_COLOR = "#C3CCD8";
const ACCENT = "#FAFAFA";
const TAGS = ["#Software", "#Marketing", "#Design", "#Strategy"];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: cubicBezier(0.18, 0.9, 0.25, 1) },
  },
};

export default function CosmicIntro() {
  const reduce = useReducedMotion();

  return (
    <section
      id="intro"
      aria-label="Intro - Althara"
      className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl px-6 lg:px-12">
        {/* Grid: logo left (big), content middle, meta right */}
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* LOGO */}
          <motion.div
            variants={fadeUp}
            className="col-span-12 lg:col-span-4 flex items-center justify-center lg:justify-start"
            aria-hidden>
            <motion.div
              initial={reduce ? {} : { opacity: 0, scale: 0.95, x: -10 }}
              animate={reduce ? {} : { opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, ease: cubicBezier(0.2, 0.85, 0.25, 1) }}
              className="w-[220px] h-[220px] lg:w-[260px] lg:h-[260px] flex items-center justify-center rounded-2xl"
              style={{ background: "rgba(255,255,255,0.01)" }}>
              <Image
                src="/logo.png"
                alt="Althara logo"
                width={260}
                height={260}
                priority
                style={{ display: "block" }}
              />
            </motion.div>
          </motion.div>

          {/* MAIN COPY */}
          <div className="col-span-12 lg:col-span-6">
            <motion.div variants={fadeUp}>
              <div className="text-sm font-extralight tracking-widest mb-2" style={{ color: "rgba(195,204,216,0.45)" }}>
                Engineering · Design · Growth
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight" style={{ color: ACCENT }}>
                <span className="block font-extralight">We build</span>
                <span className="block mt-1">
                  <span style={{ color: LOGO_COLOR, fontWeight: 800 }}>Products</span> that scale.
                </span>
              </h1>

              <p className="mt-5 max-w-lg text-sm sm:text-base font-light" style={{ color: "rgba(255,255,255,0.82)" }}>
                Robust platforms. Clean design. Measurable growth — shipped fast, built to last.
              </p>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "64px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="h-[2px] bg-[rgba(195,204,216,0.12)] mt-5 rounded"
                style={{ transformOrigin: "left" }}
              />

              <motion.div className="mt-6 flex flex-wrap gap-3" variants={fadeUp}>
                {TAGS.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.06 * i }}
                    className="px-3 py-1 text-xs font-medium"
                    style={{
                      color: LOGO_COLOR,
                    }}>
                    {t}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>

          {/* META */}
          <div className="hidden lg:flex col-span-12 lg:col-span-2 items-center justify-end">
            <motion.div variants={fadeUp} className="text-right">
              <div className="text-xs font-semibold tracking-wide" style={{ color: "rgba(255,255,255,0.72)" }}>
                Trusted approach
              </div>
              <div className="mt-2 text-sm font-light max-w-[180px]" style={{ color: "rgba(255,255,255,0.68)" }}>
                Engineering-led delivery, product thinking, measurable outcomes.
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
