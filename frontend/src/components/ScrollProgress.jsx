import React, { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const p = total > 0 ? (window.scrollY / total) * 100 : 0;
      setProgress(Math.min(Math.max(p, 0), 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          background: "var(--fg)",
          transition: "width 80ms linear"
        }}
      />
    </div>
  );
};

export default ScrollProgress;
