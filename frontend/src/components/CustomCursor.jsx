import React, { useEffect, useRef } from "react";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const idleTimerRef = useRef(null);
  const stateRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    rx: window.innerWidth / 2,
    ry: window.innerHeight / 2,
  });

  useEffect(() => {
    if (window.matchMedia("(max-width: 900px)").matches) return;

    const setIdle = (idle) => {
      if (idle) document.body.classList.add("cursor-idle");
      else document.body.classList.remove("cursor-idle");
    };

    const resetIdleTimer = () => {
      setIdle(false);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => setIdle(true), 2000);
    };

    const onMove = (e) => {
      stateRef.current.x = e.clientX;
      stateRef.current.y = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
      resetIdleTimer();
    };

    const tick = () => {
      const s = stateRef.current;
      s.rx += (s.x - s.rx) * 0.18;
      s.ry += (s.y - s.ry) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${s.rx}px, ${s.ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    let raf = requestAnimationFrame(tick);

    const interactive = "a, button, [data-cursor='hover'], input, textarea, label, select";
    const onOver = (e) => {
      if (e.target.closest(interactive)) document.body.classList.add("cursor-hover");
    };
    const onOut = (e) => {
      if (e.target.closest(interactive)) document.body.classList.remove("cursor-hover");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    resetIdleTimer();

    return () => {
      cancelAnimationFrame(raf);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.body.classList.remove("cursor-idle", "cursor-hover");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
