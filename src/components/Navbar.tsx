"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // section spy
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter,border-color] duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/70 backdrop-blur-xl border-b border-[var(--border)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container-page flex items-center justify-between h-16">
          {/* Lettermark */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            aria-label="Krishna Ruparelia — home"
          >
            <span className="font-mono text-[13px] tracking-[0.12em] text-[var(--fg)]">
              KR
            </span>
            {/* AI waveform indicator */}
            <span className="hidden sm:inline-flex items-end gap-[2px] h-3.5" aria-hidden>
              {[3, 5, 7, 4, 6, 3, 5].map((h, i) => (
                <span
                  key={i}
                  className="w-[2px] rounded-full bg-[var(--accent)]"
                  style={{
                    height: `${h}px`,
                    opacity: 0.7,
                    animation: `waveBar 1.2s ease-in-out ${i * 0.1}s infinite alternate`,
                  }}
                />
              ))}
            </span>
            <span className="hidden sm:inline-block w-px h-3.5 bg-[var(--border-strong)]" />
            <span className="hidden sm:inline-block text-[13px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">
              Krishna Ruparelia
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 text-[13px] text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors"
                >
                  <span className="relative z-10">{link.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                      className="absolute inset-0 rounded-full bg-white/[0.04] border border-[var(--border)]"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden md:inline-flex btn-primary !py-2 !px-4 !text-[13px]"
            >
              Get in touch
              <span className="inline-block translate-y-[-1px]">↗</span>
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-full border border-[var(--border)] hover:border-[var(--border-strong)] transition"
            >
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: 45, y: 3.5 }
                    : { rotate: 0, y: 0 }
                }
                className="w-4 h-px bg-[var(--fg)] origin-center block"
              />
              <motion.span
                animate={
                  mobileOpen
                    ? { rotate: -45, y: -3.5 }
                    : { rotate: 0, y: 0 }
                }
                className="w-4 h-px bg-[var(--fg)] origin-center block"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 top-16 z-40 bg-[var(--bg)]/95 backdrop-blur-xl"
          >
            <motion.nav
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="container-page py-10 flex flex-col gap-1"
            >
              {navLinks.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-4 py-4 border-b border-[var(--border)] text-[var(--fg)] group"
                >
                  <span className="font-mono text-[11px] text-[var(--fg-subtle)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-serif text-3xl">{link.label}</span>
                  <span className="ml-auto text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition">
                    ↗
                  </span>
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-8 btn-primary justify-center"
              >
                Get in touch ↗
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
