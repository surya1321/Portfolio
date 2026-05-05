import React, { useState } from "react";
import { projects } from "../mock";
import { ArrowUpRight } from "lucide-react";
import ProjectDrawer from "./ProjectDrawer";

const Projects = () => {
  const [active, setActive] = useState(null);
  const open = !!active;

  return (
    <section id="projects" className="section-pad surface divider-top">
      <div className="container-wide">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="t-subheading mb-4">03 / Selected Work</div>
            <h2 className="t-heading">
              <span className="reveal-line"><span>Projects that</span></span><br />
              <span className="reveal-line"><span><span className="italic-accent font-normal">shipped</span> impact.</span></span>
            </h2>
          </div>
          <p className="t-body text-[var(--muted)]" style={{ maxWidth: "42ch" }}>
            Curated work across NLP, computer vision, and analytics — prioritized for clarity, reliability, and outcome.
          </p>
        </div>

        <ul className="border-t border-b border-[var(--fg)]" role="list">
          {projects.map((p, i) => (
            <li key={p.id} className={i > 0 ? "border-t border-[var(--line)]" : ""}>
              <button
                onClick={() => setActive(p)}
                data-cursor="hover"
                aria-label={`Open case study for ${p.title}`}
                className="w-full grid grid-cols-12 gap-4 items-center py-6 px-2 text-left group transition-colors"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--fg)"; e.currentTarget.style.color = "var(--bg)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = ""; }}
              >
                <div className="col-span-1 font-mono text-[11px] tracking-[0.18em] opacity-60">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-12 sm:col-span-6">
                  <div className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(1.2rem, 2vw, 1.65rem)", lineHeight: 1.2 }}>
                    {p.title}
                  </div>
                  <div className="text-[12px] opacity-70 mt-1 font-mono uppercase tracking-[0.14em]">
                    {p.category}
                  </div>
                </div>
                <div className="col-span-6 sm:col-span-3 flex flex-wrap gap-1.5" style={{ color: "currentColor" }}>
                  {p.stack.slice(0, 4).map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
                <div className="col-span-6 sm:col-span-2 flex items-center justify-end gap-2">
                  <span className="font-mono text-[11px] opacity-70">{p.year}</span>
                  <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <ProjectDrawer project={active} open={open} onClose={() => setActive(null)} />
    </section>
  );
};

export default Projects;
