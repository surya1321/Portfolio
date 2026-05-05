import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Github, ArrowUpRight } from "lucide-react";

/**
 * Slide-in case study drawer (right side).
 * Closes on ESC, backdrop click, or X button.
 *
 * Robust scroll-lock: body.style.overflow is cleared on every render where
 * `open` is false AND on unmount, so it can never get stuck if a state
 * transition races.
 */
const ProjectDrawer = ({ project, open, onClose }) => {
  // Scroll lock + ESC key handler
  useEffect(() => {
    if (!open) {
      // Always release lock when not open (defensive)
      document.body.style.overflow = "";
      return;
    }
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Hard guarantee: clear lock on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = useCallback(
    (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      onClose();
    },
    [onClose]
  );

  if (!project) return null;

  return createPortal(
    <>
      <div
        className={`drawer-backdrop ${open ? "open" : ""}`}
        onClick={handleClose}
        aria-hidden="true"
        style={{ pointerEvents: open ? "auto" : "none" }}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} case study`}
        className={`drawer-panel ${open ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header — keep close button always visible while scrolling drawer content */}
        <div className="sticky top-0 z-10 surface flex items-center justify-between px-7 lg:px-9 py-4 border-b border-[var(--line)]">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
            Case study
          </span>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close case study"
            data-cursor="hover"
            className="theme-toggle"
            style={{ position: "relative", zIndex: 60 }}
          >
            <span style={{ pointerEvents: "none", display: "inline-flex" }}>
              <X size={16} />
            </span>
          </button>
        </div>

        <div className="px-7 lg:px-9 pb-12">
          {/* Hero strip */}
          <div
            className="mt-5 mb-7 aspect-[16/9] w-full surface-2 border border-[var(--line)] flex items-center justify-center overflow-hidden"
            aria-hidden="true"
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
                Screenshot — coming soon
              </span>
            )}
          </div>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--muted)] mb-3">
            {project.category} · {project.year}
          </div>
          <h3 className="t-heading mb-5">{project.title}</h3>

          <p className="t-body mb-7">{project.description}</p>

          <div className="mb-7">
            <div className="t-subheading mb-3">Key outcomes</div>
            <ul className="space-y-2.5" style={{ maxWidth: "60ch" }}>
              {(project.outcomes || project.bullets || []).map((b, i) => (
                <li key={i} className="flex gap-3 text-[14.5px] leading-[1.6]">
                  <span className="font-mono text-[10.5px] text-[var(--muted)] mt-1.5 flex-shrink-0">
                    0{i + 1}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-7">
            <div className="t-subheading mb-3">Tech stack</div>
            <div className="flex flex-wrap gap-1.5" style={{ color: "var(--fg)" }}>
              {project.stack.map((s) => (
                <span key={s} className="tag">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap pt-3 border-t border-[var(--line)]">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                data-cursor="hover"
                aria-label="Open project on GitHub"
              >
                <Github size={15} /> View on GitHub <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </aside>
    </>,
    document.body
  );
};

export default ProjectDrawer;
