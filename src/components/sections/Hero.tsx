"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { companiesData } from "@/lib/data";
import AIGrid from "@/components/ui/AIGrid";
import { trackClick } from "@/lib/track";

interface HeroProps {
  data: {
    name: string;
    title: string;
    subtitle: string;
    tagline: string;
    ctaText: string;
    ctaLink: string;
    resumeUrl?: string;
  };
  about: {
    location: string;
    email: string;
  };
}

const ease = [0.16, 1, 0.3, 1] as const;

// Floating metadata chips around the portrait
const floatingChips = [
  { label: "Full", sub: "Stack", x: "-80px", y: "14%", delay: 1.2 },
  { label: "AI", sub: "Products", x: "calc(100% + 18px)", y: "22%", delay: 1.4 },
  { label: "5+", sub: "Years exp.", x: "-80px", y: "58%", delay: 1.6 },
  { label: "AI", sub: "Engineer", x: "calc(100% + 18px)", y: "60%", delay: 1.8 },
];

export default function Hero({ data, about }: HeroProps) {
  const [first, ...rest] = data.name.split(" ");
  const last = rest.join(" ");

  return (
    <section
      id="hero"
      className="relative pt-32 md:pt-40 pb-20 md:pb-28 overflow-hidden"
    >
      {/* AI animated grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <AIGrid />
      </div>

      {/* Radial vignette over grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 30%, var(--bg) 100%)",
        }}
      />

      {/* Top ambient glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(197,253,108,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="container-page relative z-10">
        {/* Top meta row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-14 md:mb-20"
        >
          <span className="eyebrow">Portfolio · 2026</span>
          <span className="hidden sm:inline-block w-8 h-px bg-[var(--border-strong)]" />
          <span className="text-[12px] text-[var(--fg-muted)]">
            Based in {about.location.split(",")[0]}
          </span>
          <span className="hidden md:inline-flex ml-auto items-center gap-2 eyebrow">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Open to new roles
          </span>
        </motion.div>

        {/* Headline grid */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-end">
          {/* Left — headline + intro */}
          <div className="max-w-4xl">
            {/* Name — word-by-word blur reveal */}
            <div className="font-serif text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--fg)]">
              <motion.span
                initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.1 }}
                className="inline-block"
              >
                {first}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, filter: "blur(20px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 1.1, ease, delay: 0.25 }}
                className="inline-block italic text-[var(--fg-muted)]"
              >
                {last}.
              </motion.span>
            </div>

            {/* Role tags */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.38 }}
              className="mt-8 flex flex-wrap gap-2"
            >
              {[
                "Senior Full-Stack Engineer",
                "AI Engineer",
                "Full-Stack Architect",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-strong)] text-[12px] font-mono text-[var(--fg-muted)]"
                >
                  <span className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="mt-8 md:mt-10 max-w-2xl text-[17px] md:text-[19px] leading-[1.6] text-[var(--fg-muted)]"
            >
              Five years building{" "}
              <span className="text-[var(--fg)]">production-grade systems</span>{" "}
              — from scalable full-stack applications to intelligent AI products.
              Led teams, shipped features at scale, and architected backends
              trusted in production.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a href={data.ctaLink} className="btn-primary group" onClick={() => trackClick("Hero CTA", data.ctaLink)}>
                {data.ctaText}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </a>
              {data.resumeUrl && (
                <a
                  href={data.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost group"
                  onClick={() => trackClick("Resume Download", data.resumeUrl)}
                >
                  Résumé
                  <span className="opacity-60 group-hover:opacity-100 transition">↓</span>
                </a>
              )}
              <a
                href={`mailto:${about.email}`}
                className="ml-1 hidden sm:inline-flex text-[13px] text-[var(--fg-subtle)] hover:text-[var(--accent)] transition-colors"
                onClick={() => trackClick("Email (Hero)", `mailto:${about.email}`)}
              >
                {about.email}
              </a>
            </motion.div>

            {/* Stat row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, ease, delay: 0.9 }}
              className="mt-12 flex flex-wrap gap-8"
            >
              {[
                { value: "5+", label: "Years" },
                { value: "20+", label: "Projects" },
                { value: "6", label: "Companies" },
                { value: "3", label: "AI Products" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="font-mono text-[22px] font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {s.value}
                  </div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] mt-0.5">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — portrait with floating chips */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease, delay: 0.2 }}
            className="self-end mx-auto lg:mx-0"
          >
            <figure className="relative w-[260px] sm:w-[300px] lg:w-[340px] aspect-[4/5]">
              {/* Hairline frame */}
              <div className="absolute inset-0 border border-[var(--border-strong)] rounded-[2px]" />

              {/* Lime crop markers */}
              <span className="absolute -top-2 -left-2 w-4 h-px bg-[var(--accent)]" />
              <span className="absolute -top-2 -left-2 h-4 w-px bg-[var(--accent)]" />
              <span className="absolute -bottom-2 -right-2 w-4 h-px bg-[var(--accent)]" />
              <span className="absolute -bottom-2 -right-2 h-4 w-px bg-[var(--accent)]" />

              {/* Photo */}
              <div className="absolute inset-[6px] overflow-hidden bg-[var(--bg-elev)]">
                <Image
                  src="/krishna.png"
                  alt="Portrait of Krishna Ruparelia"
                  fill
                  sizes="(min-width: 1024px) 340px, 300px"
                  className="object-cover object-top grayscale contrast-[1.05] hover:grayscale-0 transition-[filter] duration-700"
                  priority
                />
                {/* Scan line animation */}
                <motion.div
                  className="absolute inset-x-0 h-[2px] pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(197,253,108,0.6), transparent)",
                  }}
                  initial={{ top: "0%", opacity: 0 }}
                  animate={{ top: ["0%", "100%", "100%"], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 1.8, ease: "linear", delay: 0.8, times: [0, 0.85, 1] }}
                />
              </div>

              {/* Caption */}
              <figcaption className="absolute -bottom-7 left-0 right-0 flex justify-between items-center">
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--fg-subtle)]">
                  Fig. 01
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-[var(--fg-subtle)]">
                  Mumbai · IN
                </span>
              </figcaption>

              {/* Floating AI chips */}
              {floatingChips.map((chip) => (
                <motion.div
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.8, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: chip.delay }}
                  className="absolute hidden lg:flex flex-col items-center px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)]/90 backdrop-blur-sm"
                  style={{ left: chip.x, top: chip.y }}
                >
                  <span
                    className="font-mono text-[13px] font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {chip.label}
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--fg-subtle)] mt-0.5">
                    {chip.sub}
                  </span>
                </motion.div>
              ))}
            </figure>
          </motion.div>
        </div>

        {/* Lockup row — companies */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease, delay: 0.8 }}
          className="mt-24 md:mt-32 pt-8 border-t border-[var(--border)]"
        >
          <div className="flex flex-col md:flex-row md:items-baseline gap-5 md:gap-10">
            <span className="eyebrow whitespace-nowrap">Worked with / at</span>
            <ul className="flex-1 flex flex-wrap items-baseline gap-x-7 gap-y-2 list-none">
              {companiesData.map((c, i) => (
                <li
                  key={c}
                  className="flex items-baseline gap-7 font-serif text-lg md:text-2xl text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  {c}
                  {i < companiesData.length - 1 && (
                    <span aria-hidden className="text-[var(--fg-faint)] text-base">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <span className="font-mono text-[11px] text-[var(--fg-subtle)] hidden md:inline whitespace-nowrap">
              5 yrs · 6 cos
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
