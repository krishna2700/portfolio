import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function parseUserAgent(ua: string) {
  let browser = "Unknown";
  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";

  let device = "Desktop";
  if (ua.includes("Mobile") || ua.includes("iPhone") || ua.includes("Android")) device = "Mobile";
  else if (ua.includes("iPad") || ua.includes("Tablet")) device = "Tablet";

  return { browser, device };
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
    const { label, url } = await req.json();

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = req.headers.get("user-agent") || "";
    const { browser, device } = parseUserAgent(userAgent);
    const { country, city } = await getGeoInfo(ip);

    await prisma.linkClick.create({
      data: {
        label: label || "unknown",
        url: url || null,
        ip,
        country,
        city,
        device,
        browser,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
