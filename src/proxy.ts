import { NextRequest, NextResponse } from "next/server";

// Pages to track (skip API routes, static files, admin)
const TRACKED_PATHS = ["/"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only track the main portfolio page
  if (TRACKED_PATHS.includes(pathname)) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "";
    const referrer = request.headers.get("referer") || "";

    // Fire-and-forget tracking via internal API
    const trackUrl = new URL("/api/track/pageview", request.url);
    fetch(trackUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname, ip, userAgent, referrer }),
    }).catch(() => {});
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match only the root path, skip:
     * - _next/static, _next/image, favicon, api routes
     */
    "/",
  ],
};
