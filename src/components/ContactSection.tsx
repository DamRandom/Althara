"use client";

const LOGO = "#C3CCD8";
const ACCENT = "#FAFAFA";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative w-full px-6 lg:px-20 py-20"
      aria-label="Contact"
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div
            className="text-xs uppercase tracking-wider font-semibold"
            style={{ color: "rgba(195,204,216,0.45)" }}
          >
            Contact
          </div>
          <h2
            className="mt-2 text-2xl sm:text-3xl font-semibold"
            style={{ color: ACCENT }}
          >
            Let’s build something together
          </h2>
          <p className="mt-2 text-sm text-[rgba(255,255,255,0.78)] max-w-xl mx-auto">
            Reach out through the channel you prefer — I’ll get back to you
            quickly.
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              border: "1px solid rgba(195,204,216,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: ACCENT }}
            >
              Direct
            </h3>
            <a
              href="mailto:youremail@example.com"
              className="hover:underline text-sm"
              style={{ color: LOGO }}
            >
              youremail@example.com
            </a>
            <a
              href="tel:+123456789"
              className="hover:underline text-sm"
              style={{ color: LOGO }}
            >
              +1 234 567 89
            </a>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              border: "1px solid rgba(195,204,216,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <h3
              className="text-lg font-medium mb-2"
              style={{ color: ACCENT }}
            >
              Social
            </h3>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-sm"
              style={{ color: LOGO }}
            >
              LinkedIn
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-sm"
              style={{ color: LOGO }}
            >
              Instagram
            </a>
            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noreferrer"
              className="hover:underline text-sm"
              style={{ color: LOGO }}
            >
              Telegram
            </a>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <a
            href="mailto:youremail@example.com"
            className="px-6 py-3 rounded-md font-medium"
            style={{
              color: LOGO,
              border: "1px solid rgba(195,204,216,0.08)",
            }}
          >
            Start the conversation
          </a>
        </div>
      </div>
    </section>
  );
}
