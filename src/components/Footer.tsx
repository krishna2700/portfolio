"use client";
import Link from "next/link";
import { motion } from "framer-motion";

interface FooterProps {
  about: {
    email: string;
    linkedin: string;
    github: string;
    location: string;
  };
}

const ease = [0.16, 1, 0.3, 1] as const;

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Stack", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Footer({ about }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-0 border-t border-[var(--border)]">

      {/* ── CTA block ── */}
      <div className="container-page pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="relative rounded-2xl border border-[var(--border)] overflow-hidden p-10 md:p-14 mb-24"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 120%, rgba(197,253,108,0.07) 0%, transparent 70%), var(--bg-elev)",
          }}
        >
          {/* Top accent line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(197,253,108,0.6) 50%, transparent 100%)",
            }}
          />

          {/* Corner grid marks */}
          <span className="absolute top-4 left-4 w-3 h-px bg-[var(--accent)]/40" />
          <span className="absolute top-4 left-4 w-px h-3 bg-[var(--accent)]/40" />
          <span className="absolute bottom-4 right-4 w-3 h-px bg-[var(--accent)]/40" />
          <span className="absolute bottom-4 right-4 w-px h-3 bg-[var(--accent)]/40" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            {/* Left copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
                  Open to new roles
                </span>
              </div>

              <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] leading-[1.05] tracking-[-0.02em] text-[var(--fg)] mb-5">
                Have a project
                <br />
                <span className="italic text-[var(--fg-muted)]">in mind?</span>
              </h2>

              <p className="text-[14px] leading-[1.7] text-[var(--fg-muted)] max-w-sm">
                Senior / Staff full-stack &amp; AI engineering roles. Selective
                high-impact contracts. Remote-friendly across IST / EU / EST.
              </p>
            </div>

            {/* Right — contact cards */}
            <div className="flex flex-col gap-3">
              {/* Email */}
              <a
                href={`mailto:${about.email}`}
                className="group flex items-center justify-between gap-4 p-5 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--accent)]/40 transition-all duration-300"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 28px -4px rgba(197,253,108,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] mb-1">
                    Email
                  </div>
                  <div className="text-[14px] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {about.email}
                  </div>
                </div>
                <span className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--fg-subtle)] group-hover:border-[var(--accent)] group-hover:text-[var(--accent)] transition-all duration-300 flex-shrink-0">
                  ↗
                </span>
              </a>

              {/* LinkedIn + GitHub */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={about.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)] transition-all duration-300"
                >
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] mb-0.5">
                      LinkedIn
                    </div>
                    <div className="text-[13px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">
                      krishna-ruparelia
                    </div>
                  </div>
                  <span className="text-[var(--fg-subtle)] group-hover:text-[var(--fg)] transition-colors text-sm">
                    ↗
                  </span>
                </a>
                <a
                  href={about.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-2 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] hover:border-[var(--border-strong)] transition-all duration-300"
                >
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] mb-0.5">
                      GitHub
                    </div>
                    <div className="text-[13px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">
                      krishna2700
                    </div>
                  </div>
                  <span className="text-[var(--fg-subtle)] group-hover:text-[var(--fg)] transition-colors text-sm">
                    ↗
                  </span>
                </a>
              </div>

              {/* Resume */}
              <a
                href="/krishna-ruparelia-resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary justify-center text-center"
              >
                Download Résumé (PDF)
                <span>↓</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* ── 3-col grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-10 mb-16 pb-16 border-b border-[var(--border)]"
        >
          {/* Navigate */}
          <div>
            <span className="eyebrow block mb-6">Navigate</span>
            <ul className="space-y-3">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <span className="eyebrow block mb-6">Connect</span>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${about.email}`}
                  className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  Email ↗
                </a>
              </li>
              <li>
                <a
                  href={about.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a
                  href={about.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href="/krishna-ruparelia-resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Résumé ↗
                </a>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="text-[13.5px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Status */}
          <div>
            <span className="eyebrow block mb-6">Status</span>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-[var(--accent)]/15 bg-[var(--accent)]/5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--accent)]">
                    Available
                  </span>
                </div>
                <p className="text-[12px] text-[var(--fg-muted)] leading-[1.6]">
                  Open to senior / staff roles &amp; selective contracts.
                </p>
              </div>
              <div className="space-y-2.5 text-[12px] font-mono text-[var(--fg-subtle)]">
                <div className="flex justify-between">
                  <span>Location</span>
                  <span className="text-[var(--fg-muted)]">Mumbai, IN</span>
                </div>
                <div className="flex justify-between">
                  <span>Remote</span>
                  <span className="text-[var(--fg-muted)]">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span>Response</span>
                  <span className="text-[var(--fg-muted)]">&lt; 24h</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone</span>
                  <span className="text-[var(--fg-muted)]">IST (UTC+5:30)</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
        >
          {/* Wordmark */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--fg)] flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-[var(--bg)] tracking-tight">
                KR
              </span>
            </div>
            <div>
              <div className="text-[13px] font-medium text-[var(--fg)]">
                Krishna Ruparelia
              </div>
              <div className="font-mono text-[10px] text-[var(--fg-subtle)]">
                Senior Full-Stack &amp; AI Engineer
              </div>
            </div>
          </div>

          {/* Colophon */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-[var(--fg-subtle)]">
            <span>© {year}</span>
            <span className="opacity-40">·</span>
            <span>Set in Instrument Serif &amp; Geist</span>
            <span className="opacity-40">·</span>
            <span>v3.0</span>
            <span className="opacity-40">·</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Open to work
            </span>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
