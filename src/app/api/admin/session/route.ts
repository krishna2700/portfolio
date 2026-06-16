import { cookies } from "next/headers";
import { fail, ok } from "@/lib/api";
import { verifyAdminToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return fail("Unauthorized", 401);

    const user = await verifyAdminToken(token);
    if (!user) return fail("Unauthorized", 401);

    return ok({ success: true, user });
  } catch {
    return fail("Unauthorized", 401);
  }
}

export async function DELETE() {
  const res = ok({ success: true });
  res.cookies.set("admin_session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}
