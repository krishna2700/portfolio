"use client";
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ScrambleText from "@/components/ui/ScrambleText";

interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
  current?: boolean;
  order: number;
}

interface ExperienceProps {
  data: ExperienceItem[];
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Experience({ data }: ExperienceProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const sorted = [...data].sort((a, b) => a.order - b.order);
  const [openId, setOpenId] = useState<string>(sorted[0]?.id ?? "");

  return (
    <section id="experience" ref={ref} className="section">
      <div className="container-page">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between gap-6 mb-16 md:mb-24 pb-6 border-b border-[var(--border)]"
        >
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">§ 02</span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--fg)]">
              <ScrambleText text="Experience" delay={100} duration={600} />
            </h2>
          </div>
          <span className="eyebrow hidden md:inline">
            2021 — Present · {sorted.length} positions
          </span>
        </motion.div>

        {/* Timeline */}
        <ol className="relative">
          {sorted.map((exp, i) => {
            const isOpen = openId === exp.id;
            return (
              <motion.li
                key={exp.id}
                initial={{ opacity: 0, y: 18 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, ease, delay: 0.05 + i * 0.06 }}
                className="group"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? "" : exp.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-8 py-6 md:py-9 border-t border-[var(--border)] hover:bg-white/[0.015] transition-colors"
                >
                  {/* Year + indicator row on mobile */}
                  <div className="flex items-start justify-between md:contents">
                  <div className="col-span-12 md:col-span-3">
                    <div className="font-mono text-[12px] tabular-nums text-[var(--fg-subtle)] tracking-wide">
                      {exp.startDate}{" "}
                      <span className="opacity-50">→</span>{" "}
                      {exp.endDate}
                    </div>
                    {exp.current && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-[var(--accent)]">
                        <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                        Current
                      </div>
                    )}
                  </div>

                  {/* Role + company */}
                  <div className="col-span-12 md:col-span-7">
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1">
                      <h3 className="font-serif text-xl md:text-[28px] text-[var(--fg)] leading-tight">
                        {exp.role}
                      </h3>
                      <span className="text-[var(--fg-subtle)] text-lg">
                        ·
                      </span>
                      <span className="text-[15px] text-[var(--fg-muted)]">
                        {exp.company}
                      </span>
                    </div>
                    <div className="mt-1.5 text-[12.5px] text-[var(--fg-subtle)] font-mono">
                      {exp.location}
                    </div>
                  </div>

                  {/* Indicator */}
                  <div className="col-span-12 md:col-span-2 flex md:justify-end items-start flex-shrink-0">
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.35, ease }}
                      className="inline-flex w-8 h-8 items-center justify-center rounded-full border border-[var(--border-strong)] text-[var(--fg-muted)] group-hover:text-[var(--fg)] group-hover:border-[var(--fg)] transition-colors"
                      aria-hidden
                    >
                      +
                    </motion.span>
                  </div>
                  </div>{/* end mobile flex row */}
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-12 gap-4 md:gap-8 pb-10 pr-2">
                        <div className="col-span-12 md:col-start-4 md:col-span-8">
                          <ul className="space-y-3.5 max-w-[68ch]">
                            {exp.description.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex gap-4 text-[14.5px] leading-[1.65] text-[var(--fg-muted)]"
                              >
                                <span className="font-mono text-[11px] text-[var(--fg-subtle)] pt-1 tabular-nums">
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
          <li className="border-t border-[var(--border)]" aria-hidden />
        </ol>
      </div>
    </section>
  );
}
