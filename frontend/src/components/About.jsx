import React, { useEffect, useRef, useState } from "react";
import { profile } from "../mock";

const useCounter = (target, ref, duration = 1500) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            let start = null;
            const step = (ts) => {
              if (!start) start = ts;
              const p = Math.min((ts - start) / duration, 1);
              setVal(Math.floor(p * target));
              if (p < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, ref, duration]);
  return val;
};

const StatBlock = ({ stat }) => {
  const ref = useRef(null);
  const v = useCounter(stat.value, ref);
  return (
    <div ref={ref} className="flex flex-col gap-1.5 border-t border-[var(--fg)] pt-4">
      <div className="font-display font-semibold tracking-tight" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)" }}>
        {v}
        <span className="text-[var(--muted)]">{stat.suffix}</span>
      </div>
      <div className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[var(--muted)]">{stat.label}</div>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="section-pad surface divider-top">
      <div className="container-wide">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-14">
          <div className="lg:col-span-4">
            <div className="t-subheading mb-5">01 / About</div>
            <h2 className="t-heading">
              <span className="reveal-line"><span>Where data,</span></span><br />
              <span className="reveal-line"><span>software &amp;</span></span><br />
              <span className="reveal-line"><span><span className="italic-accent font-normal">enterprise</span> meet.</span></span>
            </h2>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-7">
            <p className="t-body">
              {profile.bio}
            </p>

            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
              <div>
                <div className="t-subheading mb-2">Focus areas</div>
                <ul className="text-[14.5px] leading-[1.7] t-body">
                  <li>— Python automation &amp; ETL pipelines</li>
                  <li>— Applied ML (NLP, CV)</li>
                  <li>— ERP knowledge &amp; integration</li>
                  <li>— Internal portals &amp; dashboards</li>
                </ul>
              </div>
              <div>
                <div className="t-subheading mb-2">Working principles</div>
                <ul className="text-[14.5px] leading-[1.7] t-body">
                  <li>— Fail-closed by default</li>
                  <li>— Audit-grade logging</li>
                  <li>— Modular over monolithic</li>
                  <li>— Ship, measure, iterate</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-3">
              {profile.stats.map((s) => <StatBlock key={s.label} stat={s} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
