"use client";

const LOGO = "#C3CCD8";
const ACCENT = "#FAFAFA";

type Testimonial = {
  id: string;
  quote: string;
  initial: string;
  role: string;
  company: string;
  sector: string;
  rating: number;
  metric?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Simplificamos el embudo de activación y, en tres meses, aumentó la activación sin subir el presupuesto publicitario.",
    initial: "A.",
    role: "CEO",
    company: "FinCo",
    sector: "FinTech",
    rating: 5,
    metric: "+32% MRR",
  },
  {
    id: "t2",
    quote:
      "Rediseñaron el checkout y la conversión subió de forma sostenida — proceso sólido y profesional.",
    initial: "M.",
    role: "Head of Growth",
    company: "Shoply",
    sector: "E-commerce",
    rating: 5,
    metric: "+42% conv.",
  },
  {
    id: "t3",
    quote:
      "Ejecución rápida, documentación clara y métricas comprensibles. Menos churn y mejor retención.",
    initial: "L.",
    role: "Product",
    company: "LitHub",
    sector: "SaaS",
    rating: 4,
    metric: "-18% bounce",
  },
  {
    id: "t4",
    quote:
      "Replanteamos la identidad y el mensaje llegó mejor a clientes B2B; las oportunidades cualificadas aumentaron notablemente.",
    initial: "S.",
    role: "Marketing",
    company: "Brandly",
    sector: "B2B",
    rating: 5,
    metric: "3x leads",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < n ? LOGO : "none"}
          stroke={LOGO}
          className={i < n ? "" : "opacity-30"}
        >
          <path d="M12 .587l3.668 7.431L23.4 9.75l-5.666 5.52L19.6 24 12 19.897 4.4 24l1.866-8.73L.6 9.75l7.732-1.732z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative w-full px-6 lg:px-20 py-20"
      aria-label="Testimonials"
    >
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: "rgba(195,204,216,0.45)" }}
          >
            Trust & Outcomes
          </div>
          <h2
            className="mt-2 text-2xl sm:text-3xl font-semibold"
            style={{ color: ACCENT }}
          >
            What our clients say
          </h2>
          <p className="mt-2 text-sm text-[rgba(255,255,255,0.78)] max-w-xl mx-auto">
            Real results and experiences shared by our partners.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl p-6 flex flex-col gap-4"
              style={{
                border: "1px solid rgba(195,204,216,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-full grid place-items-center text-sm font-semibold flex-shrink-0"
                  style={{
                    background: "rgba(195,204,216,0.04)",
                    color: ACCENT,
                  }}
                >
                  {t.initial}
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.95)" }}
                >
                  {t.quote}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs mt-auto">
                <div
                  className="flex items-center gap-2 text-[rgba(255,255,255,0.66)]"
                  style={{ color: ACCENT }}
                >
                  <span className="font-semibold">{t.initial}</span>
                  <span>{t.role}</span>·<span>{t.company}</span>·
                  <span>{t.sector}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Stars n={t.rating} />
                  {t.metric && (
                    <div
                      className="text-[11px] font-semibold"
                      style={{ color: LOGO }}
                    >
                      {t.metric}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <a
            href="#contact"
            className="px-5 py-2.5 rounded-md font-medium"
            style={{ color: LOGO, border: "1px solid rgba(195,204,216,0.08)" }}
          >
            Let’s work together
          </a>
        </div>
      </div>
    </section>
  );
}
