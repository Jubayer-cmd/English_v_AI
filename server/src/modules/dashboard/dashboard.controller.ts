import type { Context } from "hono";
import { auth } from "../auth/auth";
import type { PracticeMode, UserDetails, UserProgress } from "shared";

const requireSession = async (c: Context) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) return null;
  return session;
};

const requireAdmin = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return null;

  // Get user details to check role
  const userDetails = await c.get("prisma").user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (userDetails?.role !== "ADMIN") return null;
  return session;
};

// In a real app, this would come from the database
// For now, we'll use a simple in-memory store
let practiceModes: any[] = [];
let scenarios: Record<string, any[]> = {};

export const dashboardGetModes = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  return c.json(practiceModes);
};

export const dashboardGetModeById = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  const modeId = c.req.param("modeId");
  const mode = practiceModes.find((m) => m.id === modeId);

  if (!mode) {
    return c.json({ error: "Mode not found" }, { status: 404 });
  }

  return c.json(mode);
};

export const dashboardGetScenariosByMode = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  const modeId = c.req.param("modeId");
  const modeScenarios = scenarios[modeId] || [];

  return c.json(modeScenarios);
};

export const dashboardGetUserDetails = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  // Mock user details
  const userDetails: UserDetails = {
    id: session.user.id,
    name: session.user.name || "User",
    email: session.user.email || "",
    avatar: session.user.image || undefined,
    level: 3,
    totalPracticeTime: 750,
    currentStreak: 7,
    longestStreak: 15,
    joinDate: "2024-01-01T00:00:00Z",
    preferences: {
      language: "English",
      difficulty: "intermediate",
      notifications: true,
    },
  };

  return c.json(userDetails);
};

export const dashboardGetProgress = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  // Mock progress data
  const progress: UserProgress = {
    currentLevel: 3,
    minutesToNextLevel: 45,
    currentStreak: 7,
    longestStreak: 15,
    totalPracticeTime: 750,
    dailyScore: 85,
    weeklyProgress: [
      { date: "2024-01-15", minutes: 45 },
      { date: "2024-01-16", minutes: 30 },
      { date: "2024-01-17", minutes: 60 },
      { date: "2024-01-18", minutes: 20 },
      { date: "2024-01-19", minutes: 55 },
      { date: "2024-01-20", minutes: 40 },
      { date: "2024-01-21", minutes: 0 },
    ],
  };

  return c.json(progress);
};

// Admin endpoints
export const adminGetStats = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  // Mock admin stats
  const stats = {
    totalModes: practiceModes.length,
    totalScenarios: Object.values(scenarios).flat().length,
    totalUsers: 156,
    totalSessions: 1234,
    activeSessions: 23,
    activeUsers: 89,
    popularScenarios: [
      { id: "1", name: "Daily Conversation", _count: { chatSessions: 156 } },
      { id: "2", name: "Business Meeting", _count: { chatSessions: 98 } },
      { id: "3", name: "Travel Planning", _count: { chatSessions: 87 } },
    ],
  };

  return c.json(stats);
};

export const adminGetPracticeModes = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  return c.json(practiceModes);
};

export const adminCreatePracticeMode = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const body = await c.req.json();
  const { name, description, icon, isActive } = body;

  // Validate required fields
  if (!name || !description || !icon) {
    return c.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Generate a clean ID from the name
  const modeId = name.toLowerCase().replace(/[^a-z0-9]/g, "-");

  // Check if mode already exists
  if (practiceModes.find((m) => m.id === modeId)) {
    return c.json(
      { error: "Mode with this name already exists" },
      { status: 400 },
    );
  }

  // Create new mode
  const newMode = {
    id: modeId,
    name,
    description,
    icon,
    path: `/dashboard/modes/${modeId}`,
    isActive: isActive ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  practiceModes.push(newMode);
  scenarios[modeId] = []; // Initialize empty scenarios array

  return c.json({ success: true, data: newMode }, { status: 201 });
};

export const adminUpdatePracticeMode = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const body = await c.req.json();
  const { id, name, description, icon, isActive } = body;

  if (!id) {
    return c.json({ error: "Mode ID is required" }, { status: 400 });
  }

  const modeIndex = practiceModes.findIndex((m) => m.id === id);
  if (modeIndex === -1) {
    return c.json({ error: "Mode not found" }, { status: 404 });
  }

  // Update mode
  const updatedMode = {
    ...practiceModes[modeIndex],
    name: name || practiceModes[modeIndex].name,
    description: description || practiceModes[modeIndex].description,
    icon: icon || practiceModes[modeIndex].icon,
    isActive: isActive ?? practiceModes[modeIndex].isActive,
    updatedAt: new Date().toISOString(),
  };

  practiceModes[modeIndex] = updatedMode;

  return c.json({ success: true, data: updatedMode });
};

export const adminDeletePracticeMode = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const { id } = await c.req.json();

  if (!id) {
    return c.json({ error: "Mode ID is required" }, { status: 400 });
  }

  const modeIndex = practiceModes.findIndex((m) => m.id === id);
  if (modeIndex === -1) {
    return c.json({ error: "Mode not found" }, { status: 404 });
  }

  // Remove mode and its scenarios
  practiceModes.splice(modeIndex, 1);
  delete scenarios[id];

  return c.json({
    success: true,
    message: "Practice mode deleted successfully",
  });
};

// Scenario management endpoints
export const adminGetScenarios = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const modeId = c.req.query("modeId");

  if (modeId) {
    // Get scenarios for specific mode
    const modeScenarios = scenarios[modeId] || [];
    return c.json(modeScenarios);
  } else {
    // Get all scenarios from all modes
    const allScenarios = Object.entries(scenarios).flatMap(
      ([modeId, modeScenarios]) =>
        modeScenarios.map((scenario: any) => ({
          ...scenario,
          modeId,
          modeName:
            practiceModes.find((m) => m.id === modeId)?.name || "Unknown Mode",
        })),
    );
    return c.json(allScenarios);
  }
};

export const adminCreateScenario = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const body = await c.req.json();
  const {
    modeId,
    title,
    description,
    difficulty,
    duration,
    participants,
    prompt,
  } = body;

  // Validate required fields
  if (!modeId || !title || !description || !difficulty) {
    return c.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if mode exists
  if (!practiceModes.find((m) => m.id === modeId)) {
    return c.json({ error: "Mode not found" }, { status: 404 });
  }

  // Generate scenario ID
  const scenarioId = `${modeId}-${Date.now()}`;

  // Create new scenario
  const newScenario = {
    id: scenarioId,
    modeId,
    title,
    description,
    difficulty,
    duration: duration || "10-15 min",
    participants: participants || 2,
    prompt: prompt || "",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Add to scenarios array for this mode
  if (!scenarios[modeId]) {
    scenarios[modeId] = [];
  }
  scenarios[modeId].push(newScenario);

  return c.json({ success: true, data: newScenario }, { status: 201 });
};

export const adminUpdateScenario = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const body = await c.req.json();
  const {
    id,
    title,
    description,
    difficulty,
    duration,
    participants,
    prompt,
    isActive,
  } = body;

  if (!id) {
    return c.json({ error: "Scenario ID is required" }, { status: 400 });
  }

  // Find scenario in all modes
  let scenario: any = null;
  let modeId: string | null = null;

  for (const [modeKey, modeScenarios] of Object.entries(scenarios)) {
    const foundScenario = modeScenarios.find((s: any) => s.id === id);
    if (foundScenario) {
      scenario = foundScenario;
      modeId = modeKey;
      break;
    }
  }

  if (!scenario || !modeId) {
    return c.json({ error: "Scenario not found" }, { status: 404 });
  }

  // Update scenario
  const updatedScenario = {
    ...scenario,
    title: title || scenario.title,
    description: description || scenario.description,
    difficulty: difficulty || scenario.difficulty,
    duration: duration || scenario.duration,
    participants: participants || scenario.participants,
    prompt: prompt || scenario.prompt,
    isActive: isActive ?? scenario.isActive,
    updatedAt: new Date().toISOString(),
  };

  // Update in scenarios array
  const scenarioIndex = scenarios[modeId!].findIndex((s: any) => s.id === id);
  if (scenarioIndex !== -1) {
    scenarios[modeId!][scenarioIndex] = updatedScenario;
  }

  return c.json({ success: true, data: updatedScenario });
};

export const adminDeleteScenario = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const { id } = await c.req.json();

  if (!id) {
    return c.json({ error: "Scenario ID is required" }, { status: 400 });
  }

  // Find and remove scenario from all modes
  let found = false;

  for (const [modeId, modeScenarios] of Object.entries(scenarios)) {
    const scenarioIndex = modeScenarios.findIndex((s: any) => s.id === id);
    if (scenarioIndex !== -1) {
      scenarios[modeId].splice(scenarioIndex, 1);
      found = true;
      break;
    }
  }

  if (!found) {
    return c.json({ error: "Scenario not found" }, { status: 404 });
  }

  return c.json({
    success: true,
    message: "Scenario deleted successfully",
  });
};
