import React from "react";
import { education } from "../mock";
import { GraduationCap, MapPin } from "lucide-react";

const Education = () => {
  const ed = education[0];
  return (
    <section id="education" className="section-pad surface divider-top">
      <div className="container-wide">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div>
            <div className="t-subheading mb-4">06 / Education</div>
            <h2 className="t-heading">
              <span className="reveal-line"><span>Foundations,</span></span><br />
              <span className="reveal-line"><span><span className="italic-accent font-normal">formally</span> built.</span></span>
            </h2>
          </div>
          <p className="t-body text-[var(--muted)]" style={{ maxWidth: "42ch" }}>
            Coursework spanning algorithms, databases, ML, software engineering, and applied computing — paired with hands-on internship and project work.
          </p>
        </div>

        <article className="border border-[var(--fg)] p-7 lg:p-9 lift" data-cursor="hover">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
            <div className="lg:col-span-5 flex items-start gap-4">
              <div className="w-12 h-12 grid place-items-center bg-[var(--fg)] text-[var(--bg)] flex-shrink-0" aria-hidden="true">
                <GraduationCap size={20} />
              </div>
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-1">{ed.period}</div>
                <h3 className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(1.3rem, 2vw, 1.7rem)" }}>{ed.degree}</h3>
                <div className="text-[13.5px] text-[var(--muted)] mt-1 mb-3 flex items-center gap-2 flex-wrap">
                  <span className="text-[var(--fg)] font-medium">{ed.school}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {ed.location}</span>
                </div>
                <p className="t-body text-[14.5px]">{ed.notes}</p>
              </div>
            </div>

            <div className="lg:col-span-7 lg:border-l lg:border-[var(--line)] lg:pl-10">
              <div className="t-subheading mb-3">Selected coursework</div>
              <ul className="flex flex-wrap gap-1.5" style={{ color: "var(--fg)" }}>
                {ed.coursework.map((c) => (
                  <li key={c} className="tag">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Education;
