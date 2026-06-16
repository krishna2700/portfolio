"use client";
import { useEffect, useRef } from "react";

/**
 * A large, soft radial glow that follows the mouse cursor.
 * Stays fixed in the viewport, pointer-events: none.
 * Inspired by Linear / Vercel homepage ambient effect.
 */
export default function MouseGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      // Lerp toward mouse — very slow for dreamy feel
      current.current.x += (pos.current.x - current.current.x) * 0.06;
      current.current.y += (pos.current.y - current.current.y) * 0.06;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${current.current.x - 400}px, ${current.current.y - 400}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ isolation: "isolate" }}
    >
      <div
        ref={glowRef}
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(197,253,108,0.04) 0%, rgba(197,253,108,0.015) 30%, transparent 70%)",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
