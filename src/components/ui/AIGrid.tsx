"use client";
import { useEffect, useRef } from "react";

/**
 * Animated AI grid background — dot grid with pulsing waves
 * and occasional data-flow lines in lime accent.
 * Used behind the Hero section.
 */
export default function AIGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const GRID = 48;
    const ACCENT = "rgba(197,253,108,";
    const DOT = "rgba(255,255,255,";

    // Data flow particles
    type Particle = { x: number; y: number; dir: "h" | "v"; progress: number; speed: number; col: number; row: number };
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const spawnParticle = () => {
      const cols = Math.floor(canvas.offsetWidth / GRID);
      const rows = Math.floor(canvas.offsetHeight / GRID);
      const dir = Math.random() > 0.5 ? "h" : "v";
      particles.push({
        x: 0, y: 0,
        dir,
        progress: 0,
        speed: 0.003 + Math.random() * 0.004,
        col: Math.floor(Math.random() * cols),
        row: Math.floor(Math.random() * rows),
      });
    };

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.008;

      const cols = Math.floor(W / GRID);
      const rows = Math.floor(H / GRID);

      // Draw dot grid with wave pulse
      for (let c = 0; c <= cols; c++) {
        for (let r = 0; r <= rows; r++) {
          const x = c * GRID;
          const y = r * GRID;
          // Wave: distance from center + time
          const dist = Math.sqrt((c - cols / 2) ** 2 + (r - rows / 2) ** 2);
          const wave = Math.sin(dist * 0.4 - t * 1.5) * 0.5 + 0.5;
          const alpha = 0.04 + wave * 0.06;

          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fillStyle = `${DOT}${alpha})`;
          ctx.fill();
        }
      }

      // Draw grid lines (very faint)
      ctx.lineWidth = 0.5;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * GRID, 0);
        ctx.lineTo(c * GRID, H);
        ctx.strokeStyle = `${DOT}0.025)`;
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * GRID);
        ctx.lineTo(W, r * GRID);
        ctx.strokeStyle = `${DOT}0.025)`;
        ctx.stroke();
      }

      // Update + draw data flow particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;
        if (p.progress >= 1) { particles.splice(i, 1); continue; }

        const alpha = Math.sin(p.progress * Math.PI) * 0.8;
        const tailLen = 0.15;
        const tailStart = Math.max(0, p.progress - tailLen);

        if (p.dir === "h") {
          const y = p.row * GRID;
          const x1 = tailStart * W;
          const x2 = p.progress * W;
          const grad = ctx.createLinearGradient(x1, y, x2, y);
          grad.addColorStop(0, `${ACCENT}0)`);
          grad.addColorStop(1, `${ACCENT}${alpha})`);
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Leading dot
          ctx.beginPath();
          ctx.arc(x2, y, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${ACCENT}${alpha})`;
          ctx.fill();
        } else {
          const x = p.col * GRID;
          const y1 = tailStart * H;
          const y2 = p.progress * H;
          const grad = ctx.createLinearGradient(x, y1, x, y2);
          grad.addColorStop(0, `${ACCENT}0)`);
          grad.addColorStop(1, `${ACCENT}${alpha})`);
          ctx.beginPath();
          ctx.moveTo(x, y1);
          ctx.lineTo(x, y2);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `${ACCENT}${alpha})`;
          ctx.fill();
        }
      }

      // Spawn new particles occasionally
      if (Math.random() < 0.015 && particles.length < 6) spawnParticle();

      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}
