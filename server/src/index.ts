import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth";
import type { ApiResponse } from "shared/dist";

export const app = new Hono().use(
  logger(),
  cors({
    origin: "http://localhost:5173", // Vite dev server
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  }),
);

// Mount Better Auth handlers
app.all("/api/auth/*", async (c) => {
  console.log("Better Auth handler hit:", c.req.method, c.req.url);
  return auth.handler(c.req.raw);
});

// Health check endpoint
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/hello", async (c) => {
  const data: ApiResponse = {
    message: "Hello Engla!",
    success: true,
  };

  return c.json(data, { status: 200 });
});

// Protected route example
app.get("/api/protected", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  return c.json({
    message: "This is a protected route",
    user: session.user,
    success: true,
  });
});

// User profile endpoint
app.get("/api/user", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  return c.json({
    user: session.user,
    success: true,
  });
});

// Sign out endpoint
app.post("/api/signout", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Not authenticated" }, { status: 401 });
  }

  await auth.api.signOut({
    headers: c.req.raw.headers,
  });

  return c.json({ success: true, message: "Signed out successfully" });
});

export default app;
