"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";

const LOGO = "#C3CCD8";
const ACCENT = "#FAFAFA";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut", // ✅ ahora sí porque está tipado como Variants
    },
  },
};

export default function AboutSection() {
  const reduce = useReducedMotion();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center px-6 lg:px-20 py-20">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* IZQUIERDA */}
          <motion.div variants={fade} className="col-span-12 lg:col-span-7">
            <h2
              className="text-3xl sm:text-4xl font-bold leading-tight"
              style={{ color: ACCENT }}
            >
              Transformamos retos digitales en oportunidades de crecimiento
            </h2>

            <p
              className="mt-4 text-base font-light max-w-prose"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              En <strong style={{ color: LOGO }}>Althara</strong> entendemos que
              tu negocio no necesita complicaciones, necesita resultados. Por
              eso unimos{" "}
              <span className="font-medium">
                estrategia, diseño y desarrollo
              </span>{" "}
              para crear soluciones digitales que venden, atraen y posicionan.
            </p>

            <p
              className="mt-4 text-base font-light max-w-prose"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              Desde una presencia online sólida hasta campañas que generan
              clientes reales, nuestro enfoque es claro: construir experiencias
              digitales que impulsen tu marca y te diferencien de la
              competencia.
            </p>

            <div className="mt-8 flex gap-4">
              <motion.a
                href="#services"
                whileHover={!reduce ? { scale: 1.02 } : undefined}
                className="inline-block px-5 py-3 rounded-md text-sm font-semibold border"
                style={{ color: LOGO, borderColor: "rgba(195,204,216,0.18)" }}
              >
                Descubre lo que hacemos
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={!reduce ? { scale: 1.02 } : undefined}
                className="inline-block px-5 py-3 rounded-md text-sm font-medium"
                style={{
                  color: "rgba(255,255,255,0.86)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                Empieza tu proyecto
              </motion.a>
            </div>
          </motion.div>

          {/* DERECHA */}
          <motion.aside variants={fade} className="col-span-12 lg:col-span-5">
            <div className="flex flex-col gap-4">
              {[
                {
                  title: "Experiencia",
                  desc: "Más de 50 proyectos lanzados con éxito en distintos sectores.",
                },
                {
                  title: "Estrategia",
                  desc: "No ofrecemos servicios sueltos, diseñamos planes digitales que convierten.",
                },
                {
                  title: "Compromiso",
                  desc: "Nos involucramos en cada detalle, porque tu crecimiento también es el nuestro.",
                },
                {
                  title: "Soporte",
                  desc: "Acompañamos a tu marca incluso después de la entrega, asegurando resultados sostenibles.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-5 rounded-xl border backdrop-blur-md"
                  style={{
                    borderColor: "rgba(195,204,216,0.08)",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: LOGO }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: ACCENT }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </section>
  );
}
