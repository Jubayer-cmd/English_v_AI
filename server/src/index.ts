import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { auth } from "./auth";
import type { ApiResponse } from "shared/dist";
import type { PracticeMode, UserDetails, UserProgress } from "shared/dist";

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

// Dashboard API endpoints
app.get("/api/dashboard/modes", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock practice modes data
  const modes: PracticeMode[] = [
    {
      id: "1",
      name: "Chat",
      icon: "message-circle",
      description: "Practice conversational English",
      isActive: true,
      path: "/dashboard/chat",
    },
    {
      id: "2",
      name: "Word Mode",
      icon: "book-open",
      description: "Learn new vocabulary",
      isActive: true,
      path: "/dashboard/word-mode",
    },
    {
      id: "3",
      name: "Dialogue Mode",
      icon: "message-square",
      description: "Practice dialogues and scripts",
      isActive: true,
      path: "/dashboard/dialogue-mode",
    },
    {
      id: "4",
      name: "Sentence Mode",
      icon: "message-square",
      description: "Practice sentence construction",
      isActive: true,
      path: "/dashboard/sentence-mode",
    },
    {
      id: "5",
      name: "Call Mode",
      icon: "phone",
      description: "Practice phone conversations",
      isActive: false,
      path: "/dashboard/call-mode",
    },
    {
      id: "6",
      name: "Roleplays",
      icon: "theater",
      description: "Practice role-playing scenarios",
      isActive: true,
      path: "/dashboard/roleplays",
    },
    {
      id: "7",
      name: "Characters",
      icon: "user-check",
      description: "Practice with different characters",
      isActive: true,
      path: "/dashboard/characters",
    },
    {
      id: "8",
      name: "Debates",
      icon: "message-square",
      description: "Practice debate skills",
      isActive: false,
      path: "/dashboard/debates",
    },
    {
      id: "9",
      name: "Photo Mode",
      icon: "camera",
      description: "Practice describing photos",
      isActive: true,
      path: "/dashboard/photo-mode",
    },
  ];

  return c.json(modes);
});

app.get("/api/dashboard/user-details", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock user details
  const userDetails: UserDetails = {
    id: session.user.id,
    name: session.user.name || "User",
    email: session.user.email || "",
    level: 1,
    totalPracticeTime: 120, // minutes
    currentStreak: 0,
    longestStreak: 0,
    joinDate: new Date().toISOString(),
    preferences: {
      language: "English",
      difficulty: "beginner",
      notifications: true,
    },
  };

  return c.json(userDetails);
});

app.get("/api/dashboard/progress", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Mock progress data
  const progress: UserProgress = {
    currentLevel: 1,
    minutesToNextLevel: 3,
    currentStreak: 0,
    longestStreak: 0,
    totalPracticeTime: 120, // minutes
    dailyScore: 0,
    weeklyProgress: [
      { date: "2024-07-29", minutes: 15 },
      { date: "2024-07-30", minutes: 20 },
      { date: "2024-07-31", minutes: 10 },
      { date: "2024-08-01", minutes: 25 },
      { date: "2024-08-02", minutes: 30 },
      { date: "2024-08-03", minutes: 15 },
      { date: "2024-08-04", minutes: 5 },
    ],
  };

  return c.json(progress);
});

export default app;
