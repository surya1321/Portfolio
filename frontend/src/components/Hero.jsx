import React, { useEffect, useState } from "react";
import { profile, availability } from "../mock";
import Beacon from "./Beacon";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";

const rotatingWords = ["Data Pipelines", "ML Models", "Internal Tools", "KPI Dashboards", "ERP Systems"];

const Hero = () => {
  const [idx, setIdx] = useState(0);
  const [time, setTime] = useState("");

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % rotatingWords.length), 2200);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const update = () => {
      const opts = { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false };
      setTime(new Intl.DateTimeFormat("en-GB", opts).format(new Date()));
    };
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="hero" className="relative" style={{ minHeight: "100vh" }}>
      {/* Status strip directly below the navbar — glass so wireframe shows through */}
      <div
        className="absolute top-[64px] left-0 right-0 border-y"
        style={{
          borderColor: "var(--line)",
          background: "var(--bg-glass)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          overflow: "hidden",
          zIndex: 12
        }}
      >
        <div className="container-wide flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-[var(--muted)] py-2 gap-3">
          <Beacon />
          <span className="hidden sm:inline whitespace-nowrap">{profile.location} · {time} IST</span>
          <span className="hidden md:inline whitespace-nowrap">v1.0 / portfolio</span>
        </div>
      </div>

      <div
        className="container-wide pt-[120px] pb-[80px] relative"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", zIndex: 11 }}
      >
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-end">
          {/* LEFT: Title + tagline + CTAs */}
          <div className="lg:col-span-7">
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

          {/* RIGHT: Currently + Reach me cards (no embedded 3D — it's now a global background) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="surface-2 border border-[var(--line)] p-5">
              <div className="t-subheading mb-2">Currently</div>
              <p className="text-[13.5px] leading-[1.55]">
                Wrapping up B.Tech CSE — shipping internal tooling &amp; data pipelines. Looking for full-time SDE / Data roles from <strong>{availability.availableFrom}</strong>.
              </p>
            </div>

            <div className="surface-2 border border-[var(--line)] p-5">
              <div className="t-subheading mb-2">Reach me</div>
              <div className="flex flex-wrap gap-x-5 gap-y-2.5 text-[13.5px]">
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-1.5" data-cursor="hover" aria-label="GitHub profile">
                  <Github size={14} /> <span>GitHub</span>
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-underline inline-flex items-center gap-1.5" data-cursor="hover" aria-label="LinkedIn profile">
                  <Linkedin size={14} /> <span>LinkedIn</span>
                </a>
                <a href={`mailto:${profile.email}`} className="link-underline inline-flex items-center gap-1.5" data-cursor="hover" aria-label="Send email">
                  <Mail size={14} /> <span>Email</span>
                </a>
              </div>
              <div className="mt-3 text-[11px] text-[var(--muted)] font-mono inline-flex items-center gap-1.5">
                <MapPin size={11} /> {profile.location}
              </div>
            </div>
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
