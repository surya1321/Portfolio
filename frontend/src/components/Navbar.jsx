import React, { useEffect, useState } from "react";
import { profile, navLinks } from "../mock";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const sections = navLinks.map((n) => document.getElementById(n.id)).filter(Boolean);
      const y = window.scrollY + window.innerHeight * 0.3;
      let current = "";
      sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goto = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 70, behavior: "smooth" });
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: scrolled ? "var(--nav-bg)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--nav-border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        transition: "background 240ms ease, border-color 240ms ease"
      }}
    >
      <div className="container-wide flex items-center gap-3 h-[64px]">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5 group flex-shrink-0"
          data-cursor="hover"
          aria-label="Back to top"
        >
          <span className="w-8 h-8 grid place-items-center bg-[var(--fg)] text-[var(--bg)] font-display font-semibold text-[12px] tracking-tight">
            MST
          </span>
          <span className="font-display text-[14px] tracking-tight hidden md:inline whitespace-nowrap">
            Meruva <span className="italic-accent text-[15.5px]">Surya Tej</span>
          </span>
        </button>

        {/* Nav links — always-visible at lg+, never hide items */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-5 flex-1 justify-center min-w-0" aria-label="Primary">
          {navLinks.map((n, i) => (
            <button
              key={n.id}
              onClick={() => goto(n.id)}
              data-cursor="hover"
              aria-label={`Navigate to ${n.label} section`}
              className="relative font-mono uppercase whitespace-nowrap transition-colors flex-shrink-0"
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: active === n.id ? "var(--fg)" : "var(--muted)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = active === n.id ? "var(--fg)" : "var(--muted)")}
            >
              <span className="opacity-50 mr-1">0{i + 1}</span>
              {n.label}
              {active === n.id && (
                <span className="absolute -bottom-2 left-0 right-0 h-[1px] bg-[var(--fg)]" />
              )}
            </button>
          ))}
        </nav>

        {/* Right cluster (theme + resume) */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
          <div className="tt-wrap tt-right">
            <button
              onClick={toggleTheme}
              aria-label={`Toggle theme — currently ${theme} mode`}
              data-cursor="hover"
              className="theme-toggle"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <span className="tt">Currently: {theme === "dark" ? "Dark" : "Light"} mode</span>
          </div>

          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            aria-label="Open résumé in a new tab"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 border border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)] transition-colors flex-shrink-0 whitespace-nowrap"
            style={{ minWidth: "96px", justifyContent: "center" }}
          >
            Résumé <ArrowUpRight size={13} />
          </a>

          <button
            className="lg:hidden p-2 -mr-2 flex-shrink-0"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            data-cursor="hover"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-[var(--bg)] border-t border-[var(--line)]">
          <div className="container-wide py-6 flex flex-col gap-4">
            {navLinks.map((n, i) => (
              <button
                key={n.id}
                onClick={() => goto(n.id)}
                className="text-left font-display text-2xl tracking-tight"
                aria-label={`Navigate to ${n.label} section`}
              >
                <span className="font-mono text-xs opacity-50 mr-3">0{i + 1}</span>
                {n.label}
              </button>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-3 w-fit"
              aria-label="Open résumé in a new tab"
            >
              Résumé <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
