import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  const user = await verifyAdminToken(token);
  return !!user;
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [pageViews, linkClicks] = await Promise.all([
    prisma.pageView.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.linkClick.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  // Total & unique visitors
  const totalViews = pageViews.length;
  const uniqueIPs = new Set(pageViews.map((v) => v.ip).filter(Boolean));
  const uniqueVisitors = uniqueIPs.size;

  // Views per day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const viewsByDay: Record<string, number> = {};
  pageViews
    .filter((v) => new Date(v.createdAt) >= thirtyDaysAgo)
    .forEach((v) => {
      const day = v.createdAt.toISOString().split("T")[0];
      viewsByDay[day] = (viewsByDay[day] || 0) + 1;
    });

  // Fill missing days
  const viewsChart = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    viewsChart.push({ date: key, views: viewsByDay[key] || 0 });
  }

  // Country breakdown
  const countryCounts: Record<string, number> = {};
  pageViews.forEach((v) => {
    const c = v.country || "Unknown";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });
  const topCountries = Object.entries(countryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([country, count]) => ({ country, count }));

  // Device breakdown
  const deviceCounts: Record<string, number> = {};
  pageViews.forEach((v) => {
    const d = v.device || "Unknown";
    deviceCounts[d] = (deviceCounts[d] || 0) + 1;
  });

  // Browser breakdown
  const browserCounts: Record<string, number> = {};
  pageViews.forEach((v) => {
    const b = v.browser || "Unknown";
    browserCounts[b] = (browserCounts[b] || 0) + 1;
  });

  // Link clicks breakdown
  const clickCounts: Record<string, number> = {};
  linkClicks.forEach((c) => {
    clickCounts[c.label] = (clickCounts[c.label] || 0) + 1;
  });
  const topLinks = Object.entries(clickCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({ label, count }));

  // Recent visitors (last 20)
  const recentVisitors = pageViews.slice(0, 20).map((v) => ({
    id: v.id,
    ip: v.ip,
    country: v.country,
    city: v.city,
    device: v.device,
    browser: v.browser,
    os: v.os,
    referrer: v.referrer,
    createdAt: v.createdAt,
  }));

  // Recent link clicks (last 20)
  const recentClicks = linkClicks.slice(0, 20).map((c) => ({
    id: c.id,
    label: c.label,
    url: c.url,
    ip: c.ip,
    country: c.country,
    city: c.city,
    device: c.device,
    browser: c.browser,
    createdAt: c.createdAt,
  }));

  return NextResponse.json({
    totalViews,
    uniqueVisitors,
    totalClicks: linkClicks.length,
    viewsChart,
    topCountries,
    deviceCounts,
    browserCounts,
    topLinks,
    recentVisitors,
    recentClicks,
  });
}
