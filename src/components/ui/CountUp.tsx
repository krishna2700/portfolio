"use client";
import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string; // e.g. "15+", "99.9%", "NL → SQL"
  className?: string;
  duration?: number;
  active?: boolean;
}

/**
 * Animates a numeric value counting up from 0.
 * For non-numeric values, falls back to a scramble reveal.
 */
export default function CountUp({
  value,
  className = "",
  duration = 1200,
  active = false,
}: CountUpProps) {
  const [displayed, setDisplayed] = useState("—");
  const started = useRef(false);

  // Extract numeric part
  const numMatch = value.match(/^([\d.]+)/);
  const num = numMatch ? parseFloat(numMatch[1]) : null;
  const suffix = num !== null ? value.slice(numMatch![0].length) : null;

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    if (num === null) {
      // Non-numeric: scramble reveal
      const CHARS = "0123456789@#$%";
      const totalFrames = Math.round((duration * 0.6) / 16);
      let frame = 0;
      const tick = () => {
        frame++;
        const progress = frame / totalFrames;
        const resolved = Math.floor(progress * value.length);
        setDisplayed(
          value
            .split("")
            .map((c, i) => {
              if (c === " " || c === "→" || c === "%" || c === "+") return c;
              if (i < resolved) return c;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );
        if (frame < totalFrames) requestAnimationFrame(tick);
        else setDisplayed(value);
      };
      requestAnimationFrame(tick);
      return;
    }

    // Numeric count-up with easing
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;

      // Format
      const formatted =
        num % 1 !== 0
          ? current.toFixed(1)
          : Math.round(current).toString();

      setDisplayed(formatted + (suffix ?? ""));

      if (progress < 1) requestAnimationFrame(tick);
      else setDisplayed(value);
    };
    requestAnimationFrame(tick);
  }, [active, value, num, suffix, duration]);

  return <span className={className}>{displayed}</span>;
}
