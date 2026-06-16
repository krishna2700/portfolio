"use client";
import { useEffect, useState, useCallback } from "react";

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
  viewsChart: { date: string; views: number }[];
  topCountries: { country: string; count: number }[];
  deviceCounts: Record<string, number>;
  browserCounts: Record<string, number>;
  topLinks: { label: string; count: number }[];
  recentVisitors: {
    id: string;
    ip: string;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    os: string | null;
    referrer: string | null;
    visits: number;
    firstSeen: string;
    lastSeen: string;
  }[];
  recentClicks: {
    id: string;
    label: string;
    url: string | null;
    ip: string | null;
    country: string | null;
    city: string | null;
    device: string | null;
    browser: string | null;
    createdAt: string;
  }[];
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  color: string;
}) {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/8">
      <div
        className={`text-4xl font-black bg-gradient-to-r ${color} bg-clip-text text-transparent mb-1`}
      >
        {value}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
      {sub && <div className="text-slate-600 text-xs font-mono mt-1">{sub}</div>}
    </div>
  );
}

function MiniBar({
  label,
  count,
  max,
  color = "from-blue-500 to-purple-500",
}: {
  label: string;
  count: number;
  max: number;
  color?: string;
}) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-28 text-slate-400 text-xs truncate flex-shrink-0">{label}</div>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="w-8 text-right text-slate-500 text-xs font-mono">{count}</div>
    </div>
  );
}

function ViewsSparkline({ data }: { data: { date: string; views: number }[] }) {
  const max = Math.max(...data.map((d) => d.views), 1);
  const H = 60;
  const W = 100;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (d.views / max) * H;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `0,${H} ${polyline} ${W},${H}`;

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-16"
      >
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#sparkGrad)" />
        <polyline
          points={polyline}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex justify-between text-slate-600 text-[10px] font-mono mt-1">
        <span>{data[0]?.date?.slice(5)}</span>
        <span>{data[data.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"visitors" | "clicks">("visitors");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-500 text-sm">
        Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-24 text-red-400 text-sm">
        Failed to load analytics.
      </div>
    );
  }

  const maxCountry = data.topCountries[0]?.count || 1;
  const maxLink = data.topLinks[0]?.count || 1;
  const deviceEntries = Object.entries(data.deviceCounts).sort((a, b) => b[1] - a[1]);
  const browserEntries = Object.entries(data.browserCounts).sort((a, b) => b[1] - a[1]);
  const maxDevice = deviceEntries[0]?.[1] || 1;
  const maxBrowser = browserEntries[0]?.[1] || 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Analytics</h2>
          <p className="text-slate-500 text-xs font-mono mt-0.5">
            Real-time visitor & click tracking
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 rounded-xl border border-white/10 text-slate-400 hover:text-white text-xs transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Page Views"
          value={data.totalViews}
          sub="All time"
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          label="Unique Visitors"
          value={data.uniqueVisitors}
          sub="By IP address"
          color="from-purple-500 to-pink-500"
        />
        <StatCard
          label="Link Clicks"
          value={data.totalClicks}
          sub="All tracked links"
          color="from-cyan-500 to-blue-500"
        />
      </div>

      {/* Views chart */}
      <div className="glass-card p-6 rounded-2xl border border-white/8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Page Views — Last 30 Days</h3>
          <span className="text-slate-500 text-xs font-mono">
            {data.viewsChart.reduce((s, d) => s + d.views, 0)} total
          </span>
        </div>
        <ViewsSparkline data={data.viewsChart} />
      </div>

      {/* Middle row: countries + links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top countries */}
        <div className="glass-card p-6 rounded-2xl border border-white/8">
          <h3 className="text-white font-semibold text-sm mb-5">Top Countries</h3>
          {data.topCountries.length === 0 ? (
            <p className="text-slate-600 text-xs">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topCountries.map((c) => (
                <MiniBar
                  key={c.country}
                  label={c.country}
                  count={c.count}
                  max={maxCountry}
                  color="from-blue-500 to-cyan-500"
                />
              ))}
            </div>
          )}
        </div>

        {/* Link clicks */}
        <div className="glass-card p-6 rounded-2xl border border-white/8">
          <h3 className="text-white font-semibold text-sm mb-5">Link Clicks</h3>
          {data.topLinks.length === 0 ? (
            <p className="text-slate-600 text-xs">No clicks tracked yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topLinks.map((l) => (
                <MiniBar
                  key={l.label}
                  label={l.label}
                  count={l.count}
                  max={maxLink}
                  color="from-purple-500 to-pink-500"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Device + Browser */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-white/8">
          <h3 className="text-white font-semibold text-sm mb-5">Devices</h3>
          <div className="space-y-3">
            {deviceEntries.map(([device, count]) => (
              <MiniBar
                key={device}
                label={device}
                count={count}
                max={maxDevice}
                color="from-cyan-500 to-blue-500"
              />
            ))}
          </div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/8">
          <h3 className="text-white font-semibold text-sm mb-5">Browsers</h3>
          <div className="space-y-3">
            {browserEntries.map(([browser, count]) => (
              <MiniBar
                key={browser}
                label={browser}
                count={count}
                max={maxBrowser}
                color="from-pink-500 to-orange-500"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity tabs */}
      <div className="glass-card rounded-2xl border border-white/8 overflow-hidden">
        <div className="flex border-b border-white/5">
          {(["visitors", "clicks"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                tab === t
                  ? "text-blue-400 border-b-2 border-blue-500"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {t === "visitors" ? "Recent Visitors" : "Recent Clicks"}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-2 max-h-80 overflow-y-auto">
          {tab === "visitors" ? (
            data.recentVisitors.length === 0 ? (
              <p className="text-center text-slate-600 text-sm py-8">No visitors yet.</p>
            ) : (
              data.recentVisitors.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xs flex-shrink-0">
                    {v.device === "Mobile" ? "📱" : v.device === "Tablet" ? "📟" : "🖥"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white text-xs font-mono">{v.ip}</span>
                      {v.country && (
                        <span className="text-slate-500 text-xs">
                          {v.city ? `${v.city}, ` : ""}{v.country}
                        </span>
                      )}
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-mono flex-shrink-0">
                        {v.visits}× visit{v.visits > 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono mt-0.5">
                      {v.browser} · {v.os} · {v.device}
                      {v.referrer && (
                        <span className="ml-2 text-slate-700">
                          via {v.referrer.replace(/^https?:\/\//, "").split("/")[0]}
                        </span>
                      )}
                    </div>
                    <div className="text-slate-700 text-[10px] font-mono mt-0.5">
                      First: {timeAgo(v.firstSeen)} · Last: {timeAgo(v.lastSeen)}
                    </div>
                  </div>
                </div>
              ))
            )
          ) : data.recentClicks.length === 0 ? (
            <p className="text-center text-slate-600 text-sm py-8">No clicks yet.</p>
          ) : (
            data.recentClicks.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs flex-shrink-0">
                  ↗
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium">{c.label}</div>
                  <div className="text-slate-600 text-[11px] font-mono mt-0.5">
                    {c.ip || "—"} · {c.country || "Unknown"}
                    {c.city ? `, ${c.city}` : ""} · {c.device}
                  </div>
                </div>
                <div className="text-slate-600 text-[11px] font-mono flex-shrink-0">
                  {timeAgo(c.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
