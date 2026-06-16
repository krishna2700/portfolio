"use client";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-px origin-left z-[60]"
      style={{
        scaleX,
        background:
          "linear-gradient(90deg, transparent, var(--accent) 50%, transparent)",
      }}
    />
  );
}
