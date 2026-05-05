import React from "react";
import ThreeScene from "./ThreeScene";

/**
 * Site-wide fixed 3D background.
 * Sits behind every section and persists through scroll.
 */
const BackgroundScene = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        // Subtle radial vignette to keep edges soft
        WebkitMaskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.55) 100%)",
        maskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0.85) 65%, rgba(0,0,0,0.55) 100%)",
      }}
    >
      <ThreeScene fullscreen />
    </div>
  );
};

export default BackgroundScene;
