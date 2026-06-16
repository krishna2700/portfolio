"use client";
import React, { useRef, useState, useMemo } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import ScrambleText from "@/components/ui/ScrambleText";

interface Project {
  id: string;
  title: string;
  description: string;
  longDesc?: string;
  tech: string[];
  github?: string;
  live?: string;
  featured: boolean;
  category: string;
  order: number;
}

interface ProjectsProps {
  data: Project[];
}

const ease = [0.16, 1, 0.3, 1] as const;

const categoryLabels: Record<string, string> = {
  ai: "AI / LLM",
  fullstack: "Full-Stack",
};

const categoryAccent: Record<string, string> = {
  ai: "var(--accent)",
  fullstack: "rgba(255,255,255,0.45)",
};

const projectStats: Record<string, { label: string; value: string }[]> = {
  "1": [{ label: "LLM providers", value: "15+" }, { label: "Architecture", value: "Multi-tenant" }],
  "2": [{ label: "Query type", value: "NL → SQL" }, { label: "Backend", value: "LangChain" }],
  "3": [{ label: "Search", value: "Hybrid BM25" }, { label: "Uptime", value: "99.9%" }],
  "4": [{ label: "Protocol", value: "WebSocket" }, { label: "Encryption", value: "E2E" }],
  "5": [{ label: "Auth flows", value: "OAuth2 + 2FA" }, { label: "Pattern", value: "RBAC" }],
  "6": [{ label: "Model", value: "GPT-4" }, { label: "Review time", value: "−60%" }],
  "7": [{ label: "Payments", value: "Stripe" }, { label: "Deploy", value: "CI/CD" }],
  "8": [{ label: "Detection", value: "NLP anomaly" }, { label: "Platform", value: "K8s" }],
};

export default function Projects({ data }: ProjectsProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...data].sort((a, b) => a.order - b.order),
    [data]
  );

  return (
    <section id="work" ref={ref} className="section">
      <div className="container-page">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between gap-6 mb-16 md:mb-20 pb-6 border-b border-[var(--border)]"
        >
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">§ 03</span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--fg)]">
              <ScrambleText text="Selected work" delay={100} duration={700} />
            </h2>
          </div>
          <span className="eyebrow hidden md:inline">
            {sorted.length} projects · 2022 — 2026
          </span>
        </motion.div>

        {/* ── All projects — unified expandable cards ── */}
        <div className="space-y-3">
          {sorted.map((p, i) => {
            const isOpen = openId === p.id;
            const accent = categoryAccent[p.category] ?? "var(--accent)";
            const stats = projectStats[p.id] ?? [];

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease, delay: 0.04 + i * 0.055 }}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] overflow-hidden transition-all duration-400"
                style={{ boxShadow: "var(--glow-inset)" }}
                onMouseEnter={(e) => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      p.category === "ai"
                        ? "rgba(197,253,108,0.2)"
                        : "rgba(255,255,255,0.14)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isOpen) {
                    (e.currentTarget as HTMLElement).style.borderColor = "";
                  }
                }}
              >
                {/* ── Header row — always visible ── */}
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : p.id)}
                  aria-expanded={isOpen}
                  className="w-full text-left flex items-center gap-4 md:gap-6 px-6 py-5 md:py-6"
                >
                  {/* Index */}
                  <span className="font-mono text-[11px] tabular-nums text-[var(--fg-faint)] w-6 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* Category dot */}
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0 transition-opacity"
                    style={{ background: accent, opacity: isOpen ? 1 : 0.55 }}
                  />

                  {/* Title + subtitle */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                      <span
                        className="font-serif text-[18px] md:text-[22px] leading-tight text-[var(--fg)] transition-colors duration-300"
                        style={{ color: isOpen ? accent : undefined }}
                      >
                        {p.title.split(" — ")[0]}
                      </span>
                      {p.title.includes(" — ") && (
                        <span className="font-serif italic text-[15px] text-[var(--fg-muted)]">
                          — {p.title.split(" — ")[1]}
                        </span>
                      )}
                    </div>
                    {/* Tech preview — collapsed only */}
                    {!isOpen && (
                      <div className="mt-1 font-mono text-[11px] text-[var(--fg-subtle)] truncate">
                        {p.tech.slice(0, 5).join(" · ")}
                        {p.tech.length > 5 && ` · +${p.tech.length - 5} more`}
                      </div>
                    )}
                  </div>

                  {/* Category label */}
                  <span className="hidden md:inline font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] flex-shrink-0 w-20 text-right">
                    {categoryLabels[p.category] ?? p.category}
                  </span>

                  {/* Toggle */}
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.35, ease }}
                    className="w-7 h-7 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-subtle)] group-hover:border-[var(--border-strong)] group-hover:text-[var(--fg)] transition-colors flex-shrink-0 text-base"
                  >
                    +
                  </motion.span>
                </button>

                {/* ── Expanded panel ── */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease }}
                      className="overflow-hidden"
                    >
                      {/* Accent divider */}
                      <div
                        className="mx-6 h-px mb-6"
                        style={{
                          background: `linear-gradient(90deg, ${accent}50, ${accent}15, transparent)`,
                        }}
                      />

                      <div className="px-6 pb-7 grid md:grid-cols-12 gap-6 md:gap-8">
                        {/* Left — description + stats + ALL tech chips */}
                        <div className="md:col-span-8">
                          <p className="text-[14px] leading-[1.75] text-[var(--fg-muted)] mb-6">
                            {p.longDesc || p.description}
                          </p>

                          {/* Stats with CountUp */}
                          {stats.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                              {stats.map((s) => (
                                <div
                                  key={s.label}
                                  className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg)]"
                                >
                                  <span style={{ color: accent } as React.CSSProperties}>
                                    <CountUp
                                      value={s.value}
                                      active={isOpen}
                                      duration={900}
                                      className="font-mono text-[15px] font-semibold block"
                                    />
                                  </span>
                                  <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] mt-0.5">
                                    {s.label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* ALL tech chips — no truncation */}
                          <div className="flex flex-wrap gap-1.5">
                            {p.tech.map((t) => (
                              <span key={t} className="chip">{t}</span>
                            ))}
                          </div>
                        </div>

                        {/* Right — category + what makes it notable */}
                        <div className="md:col-span-4 flex flex-col gap-3">
                          {/* Category badge */}
                          <div
                            className="p-4 rounded-xl border"
                            style={{
                              borderColor: `${accent}25`,
                              background: `${accent}06`,
                            }}
                          >
                            <div
                              className="font-mono text-[10px] uppercase tracking-[0.12em] mb-2"
                              style={{ color: accent }}
                            >
                              {categoryLabels[p.category] ?? p.category}
                            </div>
                            <p className="text-[12px] text-[var(--fg-subtle)] leading-[1.55]">
                              {p.category === "ai"
                                ? "AI-powered system with LLM integration, intelligent automation, and production-grade architecture."
                                : "Full-stack application with scalable backend, responsive frontend, and real-world deployment."}
                            </p>
                          </div>

                          {/* Stack count */}
                          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)]">
                            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] mb-1">
                              Stack size
                            </div>
                            <div
                              className="font-mono text-[22px] font-bold"
                              style={{ color: accent }}
                            >
                              {p.tech.length}
                            </div>
                            <div className="font-mono text-[10px] text-[var(--fg-subtle)]">
                              technologies used
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
        >
          <p className="text-[13.5px] text-[var(--fg-muted)] max-w-sm leading-relaxed">
            Several client projects are under NDA. Happy to walk through them on a call.
          </p>
          <a
            href="https://github.com/krishna2700"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost group flex-shrink-0"
          >
            All repos on GitHub
            <span className="opacity-60 group-hover:opacity-100 transition-opacity">↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
