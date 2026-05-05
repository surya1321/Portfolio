import React from "react";
import { profile, navLinks } from "../mock";
import { ArrowUp } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer
      className="surface-2 divider-top"
      role="contentinfo"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div className="container-wide py-12">
        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-6">
            <div
              className="font-display font-semibold tracking-tight leading-[0.98]"
              style={{ fontSize: "clamp(2rem, 5vw, 3.6rem)" }}
            >
              Meruva <span className="italic-accent font-normal">Surya Tej</span>.
            </div>
          </div>

          <nav className="md:col-span-3" aria-label="Sitemap">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-3">Sitemap</div>
            <ul className="flex flex-col gap-1.5">
              {navLinks.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="link-underline text-[14px]"
                    data-cursor="hover"
                    aria-label={`Navigate to ${n.label} section`}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-3">Elsewhere</div>
            <ul className="flex flex-col gap-1.5">
              <li>
                <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="link-underline text-[14px]" data-cursor="hover" aria-label={`GitHub profile @${profile.github}`}>
                  GitHub → @{profile.github}
                </a>
              </li>
              <li>
                <a href={profile.linkedin} target="_blank" rel="noreferrer" className="link-underline text-[14px]" data-cursor="hover" aria-label="LinkedIn profile">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className="link-underline text-[14px]" data-cursor="hover" aria-label="Send email">
                  {profile.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            © {year} Meruva Surya Tej · All rights reserved
          </div>
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Built with React · Three.js · Tailwind
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
            data-cursor="hover"
            aria-label="Back to top"
          >
            Back to top <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
