import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseUserAgent(ua: string) {
  // Browser
  let browser = "Unknown";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  // OS
  let os = "Unknown";
  if (ua.includes("Windows NT")) os = "Windows";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  // Device
  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("iPhone") || ua.includes("Android")) device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

  return { browser, os, device };
}

async function getGeoInfo(ip: string): Promise<{ country: string; city: string }> {
  if (!ip || ip === "unknown" || ip === "::1" || ip.startsWith("127.") || ip.startsWith("192.168.")) {
    return { country: "Local", city: "Local" };
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=country,city,status`, {
      signal: AbortSignal.timeout(2000),
    });
    const data = await res.json();
    if (data.status === "success") {
      return { country: data.country || "Unknown", city: data.city || "Unknown" };
    }
  } catch {
    // geo lookup failed silently
  }
  return { country: "Unknown", city: "Unknown" };
}

export async function POST(req: NextRequest) {
  try {
    const { page, ip, userAgent, referrer } = await req.json();
    const { browser, os, device } = parseUserAgent(userAgent || "");
    const { country, city } = await getGeoInfo(ip || "unknown");

    await prisma.pageView.create({
      data: {
        page: page || "/",
        ip: ip || null,
        country,
        city,
        device,
        browser,
        os,
        referrer: referrer || null,
        userAgent: userAgent || null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
