import React from "react";
import { experience } from "../mock";
import { ArrowUpRight, MapPin } from "lucide-react";

const Experience = () => {
  return (
    <section id="experience" className="section-pad surface divider-top">
      <div className="container-wide">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="t-subheading mb-4">02 / Experience</div>
            <h2 className="t-heading">
              <span className="reveal-line"><span>Hands-on &amp;</span></span><br />
              <span className="reveal-line"><span><span className="italic-accent font-normal">production</span> ready.</span></span>
            </h2>
          </div>
          <p className="t-body text-[var(--muted)]" style={{ maxWidth: "42ch" }}>
            Real internal systems, real users, real cost-saving outcomes. Below is the most recent role.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {experience.map((exp) => (
            <article
              key={exp.id}
              className="grid lg:grid-cols-12 gap-6 lg:gap-10 border-t border-[var(--line)] pt-8"
            >
              <div className="lg:col-span-3">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-2">{exp.period}</div>
                <div className="text-[12.5px] text-[var(--muted)] flex items-center gap-1.5">
                  <MapPin size={11} /> {exp.location}
                </div>
              </div>

              <div className="lg:col-span-9">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h3 className="t-heading" style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)" }}>{exp.role}</h3>
                  <ArrowUpRight size={18} className="text-[var(--muted)]" />
                </div>
                <div className="text-[13.5px] text-[var(--muted)] mb-4">
                  <span className="text-[var(--fg)] font-medium">{exp.company}</span> · {exp.type}
                </div>
                <p className="t-body mb-5" style={{ maxWidth: "720px" }}>{exp.summary}</p>

                <ul className="space-y-2.5 mb-5" style={{ maxWidth: "720px" }}>
                  {exp.achievements.map((a, i) => (
                    <li key={i} className="flex gap-3 text-[14.5px] leading-[1.6]">
                      <span className="font-mono text-[10.5px] text-[var(--muted)] mt-1.5 flex-shrink-0">0{i + 1}</span>
                      <span>{a}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5" style={{ color: "var(--muted)" }}>
                  {exp.stack.map((s) => (
                    <span key={s} className="tag">{s}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
