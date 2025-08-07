import type { Context } from "hono";
import { auth } from "./auth";
import { prisma } from "../../client";

export const authGetUser = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });
  return c.json({ user: session.user, success: true });
};

export const authGetMe = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  // Get additional user information from database
  const userDetails = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      image: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return c.json({ success: true, data: userDetails });
};

export const authSignOut = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return c.json({ error: "Not authenticated" }, { status: 401 });
  await auth.api.signOut({ headers: c.req.raw.headers });
  return c.json({ success: true, message: "Signed out successfully" });
};
