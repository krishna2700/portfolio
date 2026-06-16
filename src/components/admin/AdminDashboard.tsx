"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface AdminDashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

type Section = "overview" | "hero" | "about" | "experience" | "projects" | "skills" | "messages";

const navItems: { id: Section; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "hero", label: "Hero", icon: "⬡" },
  { id: "about", label: "About", icon: "◉" },
  { id: "experience", label: "Experience", icon: "◎" },
  { id: "projects", label: "Projects", icon: "◆" },
  { id: "skills", label: "Skills", icon: "◇" },
  { id: "messages", label: "Messages", icon: "✉" },
];

// ─── Generic API helpers ───────────────────────────────────────────────────
async function apiFetch(url: string, method = "GET", body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

// ─── Field editor ──────────────────────────────────────────────────────────
function Field({
  label, value, onChange, multiline = false, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; multiline?: boolean; type?: string;
}) {
  const cls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500/50 transition-all";
  return (
    <div>
      <label className="text-xs text-slate-500 font-mono block mb-2">{label}</label>
      {multiline ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}

function SaveBtn({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save Changes"}
    </button>
  );
}

// ─── Hero Editor ───────────────────────────────────────────────────────────
function HeroEditor() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { apiFetch("/api/hero").then(setData); }, []);

  const save = async () => {
    setLoading(true);
    await apiFetch("/api/hero", "PUT", data);
    toast.success("Hero updated!");
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Hero Section</h2>
        <SaveBtn onClick={save} loading={loading} />
      </div>
      {["name", "title", "subtitle", "tagline", "ctaText", "ctaLink", "resumeUrl"].map((key) => (
        <Field key={key} label={key} value={data[key] || ""} onChange={(v) => setData({ ...data, [key]: v })} multiline={key === "tagline"} />
      ))}
    </div>
  );
}

// ─── About Editor ──────────────────────────────────────────────────────────
function AboutEditor() {
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { apiFetch("/api/about").then(setData); }, []);

  const save = async () => {
    setLoading(true);
    await apiFetch("/api/about", "PUT", data);
    toast.success("About updated!");
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">About Section</h2>
        <SaveBtn onClick={save} loading={loading} />
      </div>
      {[
        { key: "bio", multi: true }, { key: "bio2", multi: true },
        { key: "location" }, { key: "email" }, { key: "phone" },
        { key: "linkedin" }, { key: "github" },
      ].map(({ key, multi }) => (
        <Field key={key} label={key} value={data[key] || ""} onChange={(v) => setData({ ...data, [key]: v })} multiline={multi} />
      ))}
    </div>
  );
}

// ─── Experience Editor ─────────────────────────────────────────────────────
function ExperienceEditor() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await apiFetch("/api/experience");
    setItems(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (item: Record<string, unknown>) => {
    setLoading(true);
    await apiFetch("/api/experience", "PUT", item);
    toast.success("Experience updated!");
    setLoading(false);
    setEditId(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    await apiFetch("/api/experience", "DELETE", { id });
    toast.success("Deleted!");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Experience</h2>
      <div className="space-y-4">
        {items.map((exp) => {
          const id = exp.id as string;
          const isEditing = editId === id;
          return (
            <div key={id} className="glass-card p-5 rounded-xl border border-white/8">
              {isEditing ? (
                <ExperienceForm
                  initial={exp}
                  onSave={save}
                  onCancel={() => setEditId(null)}
                  loading={loading}
                />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold">{exp.role as string}</div>
                    <div className="text-blue-400 text-sm">{exp.company as string}</div>
                    <div className="text-slate-500 text-xs font-mono mt-1">
                      {exp.startDate as string} — {exp.endDate as string}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditId(id)} className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs transition-colors">Edit</button>
                    <button onClick={() => del(id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors">Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExperienceForm({ initial, onSave, onCancel, loading }: {
  initial: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void; onCancel: () => void; loading: boolean;
}) {
  const [data, setData] = useState({ ...initial });
  const [descText, setDescText] = useState((initial.description as string[])?.join("\n") || "");

  return (
    <div className="space-y-4">
      {["company", "role", "startDate", "endDate", "location"].map((k) => (
        <Field key={k} label={k} value={data[k] as string || ""} onChange={(v) => setData({ ...data, [k]: v })} />
      ))}
      <div>
        <label className="text-xs text-slate-500 font-mono block mb-2">Description (one per line)</label>
        <textarea
          rows={5}
          value={descText}
          onChange={(e) => setDescText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onSave({ ...data, description: descText.split("\n").filter(Boolean) })}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  );
}

// ─── Projects Editor ───────────────────────────────────────────────────────
function ProjectsEditor() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await apiFetch("/api/projects");
    setItems(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (item: Record<string, unknown>) => {
    setLoading(true);
    await apiFetch("/api/projects", "PUT", item);
    toast.success("Project updated!");
    setLoading(false);
    setEditId(null);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await apiFetch("/api/projects", "DELETE", { id });
    toast.success("Deleted!");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Projects</h2>
      <div className="space-y-4">
        {items.map((proj) => {
          const id = proj.id as string;
          const isEditing = editId === id;
          return (
            <div key={id} className="glass-card p-5 rounded-xl border border-white/8">
              {isEditing ? (
                <ProjectForm initial={proj} onSave={save} onCancel={() => setEditId(null)} loading={loading} />
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-white font-semibold">{proj.title as string}</div>
                    <div className="text-slate-400 text-sm mt-1 line-clamp-2">{proj.description as string}</div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-400 text-xs font-mono">{proj.category as string}</span>
                      {Boolean(proj.featured) && <span className="px-2 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400 text-xs font-mono">Featured</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <button onClick={() => setEditId(id)} className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs transition-colors">Edit</button>
                    <button onClick={() => del(id)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors">Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectForm({ initial, onSave, onCancel, loading }: {
  initial: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void; onCancel: () => void; loading: boolean;
}) {
  const [data, setData] = useState({ ...initial });
  const [techText, setTechText] = useState((initial.tech as string[])?.join(", ") || "");

  return (
    <div className="space-y-4">
      {["title", "description", "longDesc", "github", "live", "image", "category"].map((k) => (
        <Field key={k} label={k} value={data[k] as string || ""} onChange={(v) => setData({ ...data, [k]: v })} multiline={k === "description" || k === "longDesc"} />
      ))}
      <div>
        <label className="text-xs text-slate-500 font-mono block mb-2">Tech Stack (comma separated)</label>
        <input
          value={techText}
          onChange={(e) => setTechText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
        />
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={!!data.featured} onChange={(e) => setData({ ...data, featured: e.target.checked })} className="w-4 h-4 rounded" />
          <span className="text-slate-300 text-sm">Featured</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button
          onClick={() => onSave({ ...data, tech: techText.split(",").map((t) => t.trim()).filter(Boolean) })}
          disabled={loading}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save"}
        </button>
        <button onClick={onCancel} className="px-5 py-2 rounded-xl border border-white/10 text-slate-400 text-sm hover:text-white transition-colors">Cancel</button>
      </div>
    </div>
  );
}

// ─── Skills Editor ─────────────────────────────────────────────────────────
function SkillsEditor() {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    const data = await apiFetch("/api/skills");
    setItems(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (item: Record<string, unknown>) => {
    setLoading(true);
    await apiFetch("/api/skills", "PUT", item);
    toast.success("Skill updated!");
    setLoading(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await apiFetch("/api/skills", "DELETE", { id });
    toast.success("Deleted!");
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Skills</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((skill) => (
          <SkillRow key={skill.id as string} skill={skill} onSave={save} onDelete={del} loading={loading} />
        ))}
      </div>
    </div>
  );
}

function SkillRow({ skill, onSave, onDelete, loading }: {
  skill: Record<string, unknown>; onSave: (d: Record<string, unknown>) => void; onDelete: (id: string) => void; loading: boolean;
}) {
  const [level, setLevel] = useState(skill.level as number);
  const [editing, setEditing] = useState(false);

  return (
    <div className="glass-card p-4 rounded-xl border border-white/8">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {Boolean(skill.icon) && <span className="text-sm">{String(skill.icon)}</span>}
          <span className="text-slate-300 text-sm font-medium">{skill.name as string}</span>
          <span className="text-slate-600 text-xs font-mono">({skill.category as string})</span>
        </div>
        <div className="flex gap-1">
          {editing ? (
            <>
              <button onClick={() => { onSave({ ...skill, level }); setEditing(false); }} disabled={loading} className="px-2 py-1 rounded-lg bg-blue-600 text-white text-xs">Save</button>
              <button onClick={() => setEditing(false)} className="px-2 py-1 rounded-lg border border-white/10 text-slate-400 text-xs">✕</button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="px-2 py-1 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs transition-colors">Edit</button>
              <button onClick={() => onDelete(skill.id as string)} className="px-2 py-1 rounded-lg border border-red-500/20 text-red-400 text-xs">Del</button>
            </>
          )}
        </div>
      </div>
      {editing ? (
        <div className="flex items-center gap-3">
          <input type="range" min={0} max={100} value={level} onChange={(e) => setLevel(Number(e.target.value))} className="flex-1" />
          <span className="text-blue-400 text-sm font-mono w-10">{level}%</span>
        </div>
      ) : (
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${skill.level as number}%` }} />
        </div>
      )}
    </div>
  );
}

// ─── Messages Viewer ───────────────────────────────────────────────────────
function MessagesViewer() {
  const [messages, setMessages] = useState<Record<string, unknown>[]>([]);

  const load = useCallback(async () => {
    const data = await apiFetch("/api/admin/messages");
    setMessages(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await apiFetch("/api/admin/messages", "PUT", { id, read: true });
    load();
  };

  const del = async (id: string) => {
    await apiFetch("/api/admin/messages", "DELETE", { id });
    load();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6">Messages ({messages.length})</h2>
      {messages.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No messages yet.</div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id as string} className={`glass-card p-5 rounded-xl border transition-all ${msg.read ? "border-white/5 opacity-60" : "border-blue-500/20"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-semibold text-sm">{msg.name as string}</span>
                    <span className="text-slate-500 text-xs">·</span>
                    <span className="text-slate-400 text-xs">{msg.email as string}</span>
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
                  </div>
                  <div className="text-blue-400 text-sm font-medium mb-2">{msg.subject as string}</div>
                  <p className="text-slate-400 text-sm leading-relaxed">{msg.message as string}</p>
                  <div className="text-slate-600 text-xs font-mono mt-2">
                    {new Date(msg.createdAt as string).toLocaleString()}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {!msg.read && (
                    <button onClick={() => markRead(msg.id as string)} className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs transition-colors">Mark Read</button>
                  )}
                  <button onClick={() => del(msg.id as string)} className="px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs transition-colors">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Overview ─────────────────────────────────────────────────────────────
function Overview({ user }: { user: { email: string; name: string } }) {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experience: 0, messages: 0 });

  useEffect(() => {
    Promise.all([
      apiFetch("/api/projects"),
      apiFetch("/api/skills"),
      apiFetch("/api/experience"),
      apiFetch("/api/admin/messages"),
    ]).then(([p, s, e, m]) => {
      setStats({
        projects: Array.isArray(p) ? p.length : 0,
        skills: Array.isArray(s) ? s.length : 0,
        experience: Array.isArray(e) ? e.length : 0,
        messages: Array.isArray(m) ? m.length : 0,
      });
    });
  }, []);

  const cards = [
    { label: "Projects", value: stats.projects, color: "from-blue-500 to-cyan-500" },
    { label: "Skills", value: stats.skills, color: "from-purple-500 to-pink-500" },
    { label: "Experience", value: stats.experience, color: "from-cyan-500 to-blue-500" },
    { label: "Messages", value: stats.messages, color: "from-pink-500 to-orange-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-1">Welcome back, {user.name.split(" ")[0]}! 👋</h2>
        <p className="text-slate-400 text-sm">Manage your portfolio content from here.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="glass-card p-6 rounded-2xl border border-white/8 text-center">
            <div className={`text-4xl font-black bg-gradient-to-r ${c.color} bg-clip-text text-transparent mb-1`}>{c.value}</div>
            <div className="text-slate-500 text-xs font-mono">{c.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card p-6 rounded-2xl border border-white/8">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { label: "View Portfolio", href: "/", external: true },
            { label: "Seed Database", action: async () => { const r = await apiFetch("/api/admin/seed", "POST"); toast.success(r.message || "Seeded!"); } },
          ].map((item) => (
            item.href ? (
              <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-white/10 text-slate-300 text-sm text-center hover:border-blue-500/30 hover:text-white transition-all">
                {item.label} ↗
              </a>
            ) : (
              <button key={item.label} onClick={item.action}
                className="px-4 py-3 rounded-xl border border-white/10 text-slate-300 text-sm hover:border-blue-500/30 hover:text-white transition-all">
                {item.label}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────────────
export default function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712]">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 64 }}
        transition={{ duration: 0.3 }}
        className="flex-shrink-0 border-r border-white/5 flex flex-col overflow-hidden"
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            KR
          </div>
          {sidebarOpen && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white font-semibold text-sm truncate">
              Admin Panel
            </motion.span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                activeSection === item.id
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="flex-shrink-0 text-base">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 text-sm transition-all"
          >
            <span className="flex-shrink-0">⏻</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors text-lg">
              ☰
            </button>
            <h1 className="text-sm font-semibold text-white capitalize">
              {navItems.find((n) => n.id === activeSection)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 text-xs font-mono hidden sm:block">{user.email}</span>
            <a href="/" target="_blank" className="px-4 py-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white text-xs transition-colors">
              View Portfolio ↗
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {activeSection === "overview" && <Overview user={user} />}
              {activeSection === "hero" && <HeroEditor />}
              {activeSection === "about" && <AboutEditor />}
              {activeSection === "experience" && <ExperienceEditor />}
              {activeSection === "projects" && <ProjectsEditor />}
              {activeSection === "skills" && <SkillsEditor />}
              {activeSection === "messages" && <MessagesViewer />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
