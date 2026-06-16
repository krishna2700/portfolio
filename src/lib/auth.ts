import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "dev-only-secret-change-in-production"
);

const ISSUER = "krishna-portfolio-admin";
const AUDIENCE = "krishna-portfolio";

export type AdminSessionUser = {
  email: string;
  name: string;
};

export async function signAdminToken(user: AdminSessionUser): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string): Promise<AdminSessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    const user = payload.user as AdminSessionUser | undefined;
    if (!user?.email || !user?.name) return null;
    return user;
  } catch {
    return null;
  }
}
