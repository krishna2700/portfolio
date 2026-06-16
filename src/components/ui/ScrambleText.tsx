"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

interface ScrambleTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Text that scrambles random characters before resolving to the final string.
 * Triggers once when the element enters the viewport.
 */
export default function ScrambleText({
  text,
  className = "",
  delay = 0,
  duration = 800,
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [displayed, setDisplayed] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const timer = setTimeout(() => {
      const startTime = performance.now();
      const totalFrames = Math.round((duration / 1000) * 60);
      let frame = 0;

      const tick = () => {
        frame++;
        const progress = frame / totalFrames;
        const resolved = Math.floor(progress * text.length);

        setDisplayed(
          text
            .split("")
            .map((char, i) => {
              if (char === " ") return " ";
              if (i < resolved) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (frame < totalFrames) requestAnimationFrame(tick);
        else setDisplayed(text);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => clearTimeout(timer);
  }, [inView, text, delay, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {displayed}
    </span>
  );
}
