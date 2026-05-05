import React from "react";
import { skills } from "../mock";

const Skills = () => {
  const groups = Object.entries(skills);
  const all = groups.flatMap(([, list]) => list);
  const marquee = [...all, ...all];

  return (
    <section id="skills" className="section-pad surface divider-top">
      <div className="container-wide">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="t-subheading mb-4">05 / Toolkit</div>
            <h2 className="t-heading">
              <span className="reveal-line"><span>The stack</span></span><br />
              <span className="reveal-line"><span>I <span className="italic-accent font-normal">reach for</span>.</span></span>
            </h2>
          </div>
          <p className="t-body text-[var(--muted)]" style={{ maxWidth: "42ch" }}>
            A pragmatic toolkit — chosen for reliability, community, and shipping speed.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 mb-12">
          {groups.map(([category, items], gi) => (
            <div key={category} className="border-t border-[var(--fg)] pt-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--muted)]">0{gi + 1}</span>
                <h3 className="font-display text-[18px] font-semibold tracking-tight">{category}</h3>
              </div>
              <ul className="flex flex-wrap gap-1.5" style={{ color: "var(--fg)" }}>
                {items.map((s) => (
                  <li key={s} className="tag tag-clickable" data-cursor="hover">{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee — reduced size & padding */}
      <div
        className="relative overflow-hidden border-y border-[var(--fg)] select-none"
        style={{ paddingTop: "18px", paddingBottom: "18px" }}
      >
        <div className="marquee-track flex gap-10 whitespace-nowrap will-change-transform">
          {marquee.map((s, i) => (
            <span
              key={i}
              className="font-display font-medium tracking-tight"
              style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}
            >
              {s} <span className="text-[var(--muted)] mx-2.5">/</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
