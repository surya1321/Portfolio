import React, { useEffect, useState } from "react";
import { profile } from "../mock";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const rotatingWords = ["Data Pipelines", "ML Models", "Internal Tools", "KPI Dashboards", "ERP Systems"];

const Hero = () => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % rotatingWords.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative" style={{ minHeight: "100vh" }}>
      <div
        className="container-wide pt-[120px] pb-[80px] relative"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 11 }}
      >
        <div className="max-w-3xl">
            <div className="reveal-line mb-5"><span className="t-subheading">— portfolio / 2025</span></div>

            <h1 className="t-display mb-6" aria-label="Meruva Surya Tej">
              <span className="block reveal-line"><span>Meruva</span></span>
              <span className="block reveal-line">
                <span>
                  <span className="italic-accent font-normal">Surya Tej</span>.
                </span>
              </span>
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-6 text-[15px]">
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-[var(--muted)]">I build</span>
              <span className="relative inline-block min-w-[230px]">
                <span
                  key={idx}
                  className="inline-block font-display font-medium text-[clamp(1.05rem,1.6vw,1.25rem)] tracking-tight"
                  style={{ animation: "fadeInUp 600ms ease both" }}
                >
                  {rotatingWords[idx]}
                </span>
              </span>
            </div>

            <p className="t-body text-[var(--muted)] mb-8">
              {profile.tagline}
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#projects" className="btn-primary" data-cursor="hover" aria-label="Jump to projects section">
                See projects <ArrowDown size={16} />
              </a>
              <a href="#contact" className="btn-ghost" data-cursor="hover" aria-label="Jump to contact section">
                Get in touch <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
