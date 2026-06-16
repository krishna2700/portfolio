import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { fail, ok } from "@/lib/api";
import { signAdminToken } from "@/lib/auth";

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) return fail("Invalid request payload", 400);

    const { email, password } = parsed.data;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword && email === adminEmail && password === adminPassword) {
      const token = await signAdminToken({ email, name: "Krishna Ruparelia" });
      const res = ok({
        success: true,
        user: { email, name: "Krishna Ruparelia" },
      });
      res.cookies.set("admin_session", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    try {
      const admin = await prisma.adminUser.findUnique({ where: { email } });
      if (admin) {
        const valid = await bcrypt.compare(password, admin.password);
        if (valid) {
          const token = await signAdminToken({ email: admin.email, name: admin.name });
          const res = ok({
            success: true,
            user: { email: admin.email, name: admin.name },
          });
          res.cookies.set("admin_session", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });
          return res;
        }
      }
    } catch {
      // DB not available, fall through
    }

    return fail("Invalid credentials", 401);
  } catch {
    return fail("Server error", 500);
  }
}
