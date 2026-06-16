"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import ScrambleText from "@/components/ui/ScrambleText";

interface AboutProps {
  data: {
    bio: string;
    bio2: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
}

const ease = [0.16, 1, 0.3, 1] as const;

const meta = (data: AboutProps["data"]) => [
  { k: "Role", v: "Senior Full-Stack Engineer" },
  { k: "Focus", v: "AI systems · product engineering · DX" },
  { k: "Based", v: data.location },
  { k: "Open to", v: "Senior / Staff roles · Contract · Remote" },
  { k: "Languages", v: "English · Hindi · Gujarati" },
];

const links = (data: AboutProps["data"]) => [
  { k: "Email", v: data.email, href: `mailto:${data.email}` },
  { k: "GitHub", v: "krishna2700", href: data.github },
  {
    k: "LinkedIn",
    v: "krishna-ruparelia",
    href: data.linkedin,
  },
];

export default function About({ data }: AboutProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" ref={ref} className="section">
      <div className="container-page">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between gap-6 mb-16 md:mb-24 pb-6 border-b border-[var(--border)]"
        >
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">§ 01</span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--fg)]">
              <ScrambleText text="About" delay={100} duration={500} />
            </h2>
          </div>
          <span className="eyebrow hidden md:inline">A short profile</span>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Lead column — big quote-style bio */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="lg:col-span-7"
          >
            <p className="font-serif text-[28px] md:text-[40px] leading-[1.15] tracking-[-0.015em] text-[var(--fg)]">
              I build software that&rsquo;s genuinely useful — most days, that
              means working at the seam between{" "}
              <em className="text-[var(--fg-muted)]">
                language models and real product surfaces
              </em>
              .
            </p>

            <div className="mt-10 space-y-5 text-[15.5px] leading-[1.7] text-[var(--fg-muted)] max-w-[60ch]">
              <p>{data.bio}</p>
              <p>{data.bio2}</p>
              <p>
                Outside of shipping, I spend time studying how teams ship —
                what makes a codebase humane, what makes a release feel
                inevitable, and how to keep AI features grounded enough to
                trust in production.
              </p>
            </div>
          </motion.div>

          {/* Meta column */}
          <motion.aside
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="lg:col-span-5 lg:pl-10 lg:border-l lg:border-[var(--border)]"
          >
            <div className="space-y-0">
              {meta(data).map((m) => (
                <div
                  key={m.k}
                  className="grid grid-cols-[110px_1fr] gap-4 py-3.5 border-b border-[var(--border)] first:border-t"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-subtle)] pt-0.5">
                    {m.k}
                  </span>
                  <span className="text-[14px] text-[var(--fg)]">{m.v}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <span className="eyebrow">Elsewhere</span>
              <ul className="mt-4 space-y-2.5">
                {links(data).map((l) => (
                  <li key={l.k}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-4 py-2 border-b border-[var(--border)]"
                    >
                      <span className="text-[14px] text-[var(--fg-muted)] group-hover:text-[var(--fg)] transition-colors">
                        {l.k}
                      </span>
                      <span className="flex items-baseline gap-2 text-[14px] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                        {l.v}
                        <span className="opacity-50 group-hover:opacity-100 transition">
                          ↗
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
