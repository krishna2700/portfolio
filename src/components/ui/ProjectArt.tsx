"use client";
import { useMemo } from "react";

interface ProjectArtProps {
  seed: string;
  category?: string;
  className?: string;
}

/**
 * Deterministic abstract SVG cover art for a project.
 * Restrained palette — greyscale + single lime accent on a few elements.
 * Two visual modes:
 *   - "ai"        : concentric arcs + node graph (suggests systems/agents)
 *   - default     : layered geometric grid + drifting line motif
 */
export default function ProjectArt({
  seed,
  category = "fullstack",
  className = "",
}: ProjectArtProps) {
  const { gradId, nodes, lines, rotate, mode } = useMemo(() => {
    // Seeded PRNG using a closure-local state holder (React Compiler-safe).
    const state = { h: 0 };
    for (let i = 0; i < seed.length; i++) {
      state.h = (state.h * 31 + seed.charCodeAt(i)) >>> 0;
    }
    const rng = () => {
      state.h = (state.h * 1664525 + 1013904223) >>> 0;
      return (state.h & 0xffff) / 0xffff;
    };

    const isAI = category === "ai";
    const count = isAI ? 11 : 8;
    const nodes = Array.from({ length: count }, () => ({
      x: 60 + rng() * 480,
      y: 60 + rng() * 240,
      r: 1.5 + rng() * 2.5,
      accent: rng() > 0.78,
    }));

    // sparse connections
    const lines: { a: number; b: number; accent: boolean }[] = [];
    for (let i = 0; i < count; i++) {
      const j = (i + 1 + Math.floor(rng() * 2)) % count;
      lines.push({ a: i, b: j, accent: rng() > 0.82 });
      if (rng() > 0.55) {
        const k = (i + 3 + Math.floor(rng() * 3)) % count;
        lines.push({ a: i, b: k, accent: rng() > 0.9 });
      }
    }

    return {
      gradId: `g-${seed.replace(/[^a-z0-9]/gi, "").slice(0, 8)}`,
      nodes,
      lines,
      rotate: rng() * 8 - 4,
      mode: isAI ? "ai" : "grid",
    };
  }, [seed, category]);

  return (
    <svg
      viewBox="0 0 600 360"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <radialGradient id={gradId} cx="30%" cy="20%" r="80%">
          <stop offset="0%" stopColor="#1a1a1a" />
          <stop offset="60%" stopColor="#0f0f0f" />
          <stop offset="100%" stopColor="#080808" />
        </radialGradient>
        <pattern
          id={`${gradId}-grid`}
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>

      {/* base */}
      <rect width="600" height="360" fill={`url(#${gradId})`} />
      <rect width="600" height="360" fill={`url(#${gradId}-grid)`} />

      {/* ai concentric arcs */}
      {mode === "ai" && (
        <g
          transform={`translate(300 180) rotate(${rotate})`}
          fill="none"
          strokeLinecap="round"
        >
          {[60, 100, 150, 210, 280].map((r, i) => (
            <circle
              key={r}
              r={r}
              stroke={i === 2 ? "rgba(197,253,108,0.35)" : "rgba(255,255,255,0.07)"}
              strokeWidth={i === 2 ? 0.8 : 0.5}
              strokeDasharray={i % 2 === 0 ? "2 4" : "none"}
            />
          ))}
        </g>
      )}

      {/* grid mode soft diagonal */}
      {mode === "grid" && (
        <g transform={`translate(0 0) rotate(${rotate} 300 180)`}>
          <line
            x1="-40"
            y1="320"
            x2="640"
            y2="40"
            stroke="rgba(197,253,108,0.3)"
            strokeWidth="0.8"
          />
          <line
            x1="-40"
            y1="280"
            x2="640"
            y2="0"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        </g>
      )}

      {/* node graph */}
      <g>
        {lines.map((l, i) => (
          <line
            key={`l-${i}`}
            x1={nodes[l.a].x}
            y1={nodes[l.a].y}
            x2={nodes[l.b].x}
            y2={nodes[l.b].y}
            stroke={
              l.accent
                ? "rgba(197,253,108,0.55)"
                : "rgba(255,255,255,0.12)"
            }
            strokeWidth={l.accent ? 0.9 : 0.5}
          />
        ))}
        {nodes.map((n, i) => (
          <g key={`n-${i}`}>
            <circle
              cx={n.x}
              cy={n.y}
              r={n.r + (n.accent ? 1 : 0)}
              fill={n.accent ? "#c5fd6c" : "rgba(255,255,255,0.65)"}
            />
            {n.accent && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 4}
                fill="none"
                stroke="rgba(197,253,108,0.4)"
                strokeWidth="0.6"
              />
            )}
          </g>
        ))}
      </g>

      {/* vignette */}
      <rect
        width="600"
        height="360"
        fill="url(#vignette)"
        style={{ mixBlendMode: "multiply" }}
      />
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
          <stop offset="60%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
        </radialGradient>
      </defs>
    </svg>
  );
}
