"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import toast from "react-hot-toast";

interface ContactProps {
  data: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
  };
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact({ data }: ContactProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const subject = `New message from ${form.name || "portfolio"}`;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, subject }),
      });
      if (res.ok) {
        toast.success("Sent — I'll get back within 24 hours.");
        setForm({ name: "", email: "", message: "" });
      } else {
        toast.error("Something went wrong. Try email instead.");
      }
    } catch {
      toast.error("Network error. Try email instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="section">
      <div className="container-page">

        {/* ── Section heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease }}
          className="flex items-baseline justify-between gap-6 mb-16 md:mb-24 pb-6 border-b border-[var(--border)]"
        >
          <div className="flex items-baseline gap-4">
            <span className="eyebrow">§ 05</span>
            <h2 className="font-serif text-2xl md:text-3xl text-[var(--fg)]">
              Contact
            </h2>
          </div>
          <span className="hidden md:inline-flex items-center gap-2 eyebrow">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            Replies within 24h
          </span>
        </motion.div>

        {/* ── Big statement ── */}
        <motion.h3
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.05 }}
          className="font-serif text-[clamp(2.5rem,7vw,6rem)] leading-[0.98] tracking-[-0.025em] text-[var(--fg)] max-w-5xl"
        >
          Let&rsquo;s build
          <br />
          <span className="italic text-[var(--fg-muted)]">
            something worth shipping.
          </span>
        </motion.h3>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 mt-24">

          {/* ── Left — intro + direct email ── */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.15 }}
            className="lg:col-span-5 flex flex-col justify-between gap-10"
          >
            <div>
              <p className="text-[16px] leading-[1.75] text-[var(--fg-muted)] max-w-sm">
                Have a project, role, or idea you want to explore? Fill in the
                form and I&rsquo;ll get back to you within 24 hours. Prefer
                email? Reach me directly below.
              </p>

              {/* Direct email CTA */}
              <a
                href={`mailto:${data.email}`}
                className="group mt-8 inline-flex items-center gap-3 px-5 py-3.5 rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elev)] hover:border-[var(--accent)]/50 transition-all duration-300"
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 0 24px -4px rgba(197,253,108,0.18)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse flex-shrink-0" />
                <span className="text-[14px] text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors font-mono">
                  {data.email}
                </span>
                <span className="ml-auto text-[var(--fg-subtle)] group-hover:text-[var(--accent)] transition-colors">
                  ↗
                </span>
              </a>
            </div>

            {/* Availability card */}
            <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-elev)]/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--accent)]">
                  Currently available
                </span>
              </div>
              <p className="text-[13.5px] leading-[1.65] text-[var(--fg-muted)]">
                Open to senior / staff full-stack &amp; AI engineering roles,
                and selective high-impact contracts. Based in{" "}
                {data.location.split(",")[0]} — remote across IST / EU / EST.
              </p>
              <div className="mt-4 pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-3 font-mono text-[11px]">
                <div>
                  <div className="text-[var(--fg-subtle)] mb-0.5">Location</div>
                  <div className="text-[var(--fg-muted)]">Mumbai, IN</div>
                </div>
                <div>
                  <div className="text-[var(--fg-subtle)] mb-0.5">Response</div>
                  <div className="text-[var(--fg-muted)]">&lt; 24h</div>
                </div>
                <div>
                  <div className="text-[var(--fg-subtle)] mb-0.5">Remote</div>
                  <div className="text-[var(--fg-muted)]">Yes</div>
                </div>
                <div>
                  <div className="text-[var(--fg-subtle)] mb-0.5">Timezone</div>
                  <div className="text-[var(--fg-muted)]">IST (UTC+5:30)</div>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* ── Right — form ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease, delay: 0.25 }}
            className="lg:col-span-7"
          >
            <form onSubmit={handleSubmit} className="space-y-7">
              <Field
                label="Name"
                required
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Your name"
              />
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="you@company.com"
              />
              <Field
                label="Message"
                required
                multiline
                value={form.message}
                onChange={(v) => setForm((f) => ({ ...f, message: v }))}
                placeholder="A few sentences about what you're building."
              />

              <div className="flex items-center justify-between pt-2">
                <p className="text-[12px] text-[var(--fg-subtle)] font-mono">
                  PGP / detailed brief? Email me directly.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-3.5 h-3.5 border border-current/30 border-t-current rounded-full animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = "text",
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <label className="block group">
      <div className="flex items-baseline justify-between mb-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fg-subtle)]">
          {label}
          {required && <span className="text-[var(--accent)] ml-1">*</span>}
        </span>
      </div>
      {multiline ? (
        <textarea
          required={required}
          rows={5}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-[var(--border-strong)] focus:border-[var(--accent)] py-3 text-[15.5px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] outline-none transition-colors resize-none"
        />
      ) : (
        <input
          required={required}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-b border-[var(--border-strong)] focus:border-[var(--accent)] py-3 text-[15.5px] text-[var(--fg)] placeholder:text-[var(--fg-faint)] outline-none transition-colors [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:[box-shadow:0_0_0_1000px_transparent_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--fg)] [&:-webkit-autofill]:[transition:background-color_5000s_ease-in-out_0s]"
        />
      )}
    </label>
  );
}
