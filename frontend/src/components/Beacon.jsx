import React from "react";
import { availability } from "../mock";

/**
 * Animated "Open to work" beacon.
 * — Outer ring: pulses opacity + scale (3s)
 * — Inner dot: solid green, no animation
 * — Tooltip on hover
 */
const Beacon = ({ inverted = false }) => {
  if (!availability.open) {
    return (
      <span className="inline-flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: "var(--muted)" }}
          aria-hidden="true"
        />
        <span>Currently unavailable</span>
      </span>
    );
  }

  return (
    <span className="tt-wrap inline-flex items-center gap-2" data-cursor="hover">
      <span className="relative inline-block w-2.5 h-2.5" aria-hidden="true">
        <span
          className="absolute inset-0 rounded-full beacon-ring"
          style={{ background: "var(--beacon)" }}
        />
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--beacon)", transform: "scale(0.6)" }}
        />
      </span>
      <span>{availability.label}</span>
      <span className="tt" role="tooltip">{availability.tooltip}</span>
    </span>
  );
};

export default Beacon;
