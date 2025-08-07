import type { Context } from "hono";
import { auth } from "../auth/auth";
import type { PracticeMode, UserDetails, UserProgress } from "shared";

const requireSession = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return null;
  return session;
};

export const dashboardGetModes = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

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
      id: "5",
      name: "Call Mode",
      icon: "phone",
      description: "Practice phone conversations",
      isActive: true,
      path: "/dashboard/call-mode",
    },
  ];
  return c.json(modes);
};

export const dashboardGetUserDetails = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  const userDetails: UserDetails = {
    id: session.user.id,
    name: session.user.name || "User",
    email: session.user.email || "",
    level: 1,
    totalPracticeTime: 120,
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
};

export const dashboardGetProgress = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  const progress: UserProgress = {
    currentLevel: 1,
    minutesToNextLevel: 3,
    currentStreak: 0,
    longestStreak: 0,
    totalPracticeTime: 120,
    dailyScore: 0,
    weeklyProgress: [
      { date: "2024-07-29", minutes: 15 },
      { date: "2024-07-30", minutes: 20 },
    ],
  };
  return c.json(progress);
};
