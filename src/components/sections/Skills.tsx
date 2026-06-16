"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { skillTiers } from "@/lib/data";
import ScrambleText from "@/components/ui/ScrambleText";

// Skill prop kept for compatibility with page.tsx
interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon?: string;
  order: number;
}

interface SkillsProps {
  data: Skill[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Skills({ data }: SkillsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  // `data` is intentionally unused — the new model is grouped by proficiency
  // tier (see `skillTiers` in `lib/data`). We keep the prop for shape stability.
  void data;

  return (
    <section id="skills" ref={ref} className="section">
      <div className="container-page">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between gap-6 mb-16 md:mb-24 pb-6 border-b border-[var(--border)]"
        >
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">§ 04</span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--fg)]">
              Stack &amp; tools
            </h2>
          </div>
          <span className="eyebrow hidden md:inline">
            Organized by how often I reach for them
          </span>
        </motion.div>

        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.05 }}
          className="font-serif text-[18px] md:text-[28px] leading-[1.3] text-[var(--fg-muted)] max-w-3xl mb-10 md:mb-20"
        >
          I&rsquo;m not a fan of skill bars — they lie. Here&rsquo;s an honest
          breakdown of where I am with the tools I use.
        </motion.p>

        {/* Tier columns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
          {skillTiers.map((tier, i) => (
            <motion.div
              key={tier.label}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, ease, delay: 0.1 + i * 0.08 }}
              className="relative"
            >
              {/* Tier header */}
              <div className="pb-5 mb-6 border-b border-[var(--border)]">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[11px] tabular-nums text-[var(--fg-subtle)]">
                    0{i + 1}
                  </span>
                  <h3 className="font-serif text-xl text-[var(--fg)]">
                    <ScrambleText
                      text={tier.label}
                      delay={200 + i * 120}
                      duration={600}
                    />
                  </h3>
                  {i === 0 && (
                    <span className="ml-auto inline-block w-2 h-2 rounded-full bg-[var(--accent)]" />
                  )}
                </div>
                <p className="mt-2.5 text-[13px] leading-[1.55] text-[var(--fg-subtle)]">
                  {tier.note}
                </p>
              </div>

              {/* Items */}
              <ul className="flex flex-wrap gap-1.5">
                {tier.items.map((item, j) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, scale: 0.85, y: 8 }}
                    animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{
                      duration: 0.45,
                      ease: [0.34, 1.56, 0.64, 1], // spring-like overshoot
                      delay: 0.2 + i * 0.08 + j * 0.03,
                    }}
                    whileHover={i === 0 ? {
                      scale: 1.05,
                      transition: { duration: 0.15 },
                    } : {}}
                  >
                    <span
                      className={`chip cursor-default ${i === 0 ? "!text-[var(--fg)]" : ""}`}
                      style={i === 0 ? {
                        transition: "border-color 200ms, box-shadow 200ms",
                      } : undefined}
                      onMouseEnter={i === 0 ? (e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "rgba(197,253,108,0.35)";
                        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px -2px rgba(197,253,108,0.2)";
                      } : undefined}
                      onMouseLeave={i === 0 ? (e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = "";
                        (e.currentTarget as HTMLElement).style.boxShadow = "";
                      } : undefined}
                    >
                      {item}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Methodology note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease, delay: 0.4 }}
          className="mt-12 md:mt-24 pt-8 border-t border-[var(--border)] grid sm:grid-cols-3 gap-6 md:gap-8 text-[13px] text-[var(--fg-subtle)] font-mono"
        >
          <div>
            <span className="text-[var(--fg-muted)]">Approach</span>
            <p className="mt-2 leading-[1.6]">
              Pick the boring, dependable thing — until the problem demands
              otherwise.
            </p>
          </div>
          <div>
            <span className="text-[var(--fg-muted)]">Editor</span>
            <p className="mt-2 leading-[1.6]">
              Cursor / VS Code, Vim bindings, fish shell, Linear, Raycast.
            </p>
          </div>
          <div>
            <span className="text-[var(--fg-muted)]">Always learning</span>
            <p className="mt-2 leading-[1.6]">
              Evals for LLM apps, distributed systems patterns, design systems
              ergonomics.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
