import type { Context } from "hono";
import { auth } from "../auth/auth";
import { prisma } from "../../client";
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
  const userDetails = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (userDetails?.role !== "ADMIN") return null;
  return session;
};

// All data is now fetched from the database using Prisma

export const dashboardGetModes = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Fetch modes from database instead of in-memory array
    const modes = await prisma.mode.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform to match frontend expectations
    const formattedModes = modes.map((mode) => ({
      id: mode.id,
      name: mode.name,
      description: mode.description,
      icon: mode.icon || "graduation-cap",
      path: `/dashboard/modes/${mode.id}`,
      isActive: mode.isActive,
      createdAt: mode.createdAt.toISOString(),
      updatedAt: mode.updatedAt.toISOString(),
    }));

    return c.json(formattedModes);
  } catch (error) {
    console.error("Error fetching modes:", error);
    return c.json({ error: "Failed to fetch modes" }, { status: 500 });
  }
};

export const dashboardGetModeById = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  const modeId = c.req.param("modeId");

  try {
    const mode = await prisma.mode.findUnique({
      where: { id: modeId },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!mode) {
      return c.json({ error: "Mode not found" }, { status: 404 });
    }

    // Transform to match frontend expectations
    const formattedMode = {
      id: mode.id,
      name: mode.name,
      description: mode.description,
      icon: mode.icon || "graduation-cap",
      path: `/dashboard/modes/${mode.id}`,
      isActive: mode.isActive,
      createdAt: mode.createdAt.toISOString(),
      updatedAt: mode.updatedAt.toISOString(),
    };

    return c.json(formattedMode);
  } catch (error) {
    console.error("Error fetching mode:", error);
    return c.json({ error: "Failed to fetch mode" }, { status: 500 });
  }
};

export const dashboardGetScenariosByMode = async (c: Context) => {
  const session = await requireSession(c);
  if (!session) return c.json({ error: "Unauthorized" }, { status: 401 });

  const modeId = c.req.param("modeId");

  try {
    const scenarios = await prisma.scenario.findMany({
      where: {
        modeId: modeId,
        isActive: true,
      },
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        prompt: true,
        difficulty: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform to match frontend expectations
    const formattedScenarios = scenarios.map((scenario) => ({
      id: scenario.id,
      title: scenario.name,
      description: scenario.description,
      image: scenario.image,
      prompt: scenario.prompt,
      difficulty: scenario.difficulty,
      duration: "10-15 min", // Default duration
      participants: 2, // Default participants
      isActive: scenario.isActive,
      createdAt: scenario.createdAt.toISOString(),
      updatedAt: scenario.updatedAt.toISOString(),
    }));

    return c.json(formattedScenarios);
  } catch (error) {
    console.error("Error fetching scenarios:", error);
    return c.json({ error: "Failed to fetch scenarios" }, { status: 500 });
  }
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

  try {
    // Get real stats from database
    const [
      totalModes,
      totalScenarios,
      totalUsers,
      totalSessions,
      activeSessions,
      popularScenarios,
    ] = await Promise.all([
      prisma.mode.count(),
      prisma.scenario.count(),
      prisma.user.count(),
      prisma.chatSession.count(),
      prisma.chatSession.count({
        where: {
          endedAt: null, // Sessions that haven't ended yet
        },
      }),
      prisma.scenario.findMany({
        take: 3,
        orderBy: {
          chatSessions: {
            _count: "desc",
          },
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              chatSessions: true,
            },
          },
        },
      }),
    ]);

    // Count active users (users with sessions in the last 24 hours)
    const activeUsers = await prisma.user.count({
      where: {
        sessions: {
          some: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        },
      },
    });

    const stats = {
      totalModes,
      totalScenarios,
      totalUsers,
      totalSessions,
      activeSessions,
      activeUsers,
      popularScenarios,
    };

    return c.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return c.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
};

export const adminGetPracticeModes = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  try {
    // Fetch all modes from database for admin (including inactive ones)
    const modes = await prisma.mode.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        icon: true,
        isActive: true,
        order: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Transform to match frontend expectations
    const formattedModes = modes.map((mode) => ({
      id: mode.id,
      name: mode.name,
      description: mode.description,
      icon: mode.icon || "graduation-cap",
      path: `/dashboard/modes/${mode.id}`,
      isActive: mode.isActive,
      createdAt: mode.createdAt.toISOString(),
      updatedAt: mode.updatedAt.toISOString(),
    }));

    return c.json(formattedModes);
  } catch (error) {
    console.error("Error fetching admin modes:", error);
    return c.json({ error: "Failed to fetch modes" }, { status: 500 });
  }
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

  try {
    // Check if mode with this name already exists
    const existingMode = await prisma.mode.findFirst({
      where: { name: name },
    });

    if (existingMode) {
      return c.json(
        { error: "Mode with this name already exists" },
        { status: 400 },
      );
    }

    // Create new mode in database
    const newMode = await prisma.mode.create({
      data: {
        name,
        description,
        icon,
        isActive: isActive ?? true,
        order: 0, // Default order, can be updated later
      },
    });

    // Transform to match frontend expectations
    const formattedMode = {
      id: newMode.id,
      name: newMode.name,
      description: newMode.description,
      icon: newMode.icon || "graduation-cap",
      path: `/dashboard/modes/${newMode.id}`,
      isActive: newMode.isActive,
      createdAt: newMode.createdAt.toISOString(),
      updatedAt: newMode.updatedAt.toISOString(),
    };

    return c.json({ success: true, data: formattedMode }, { status: 201 });
  } catch (error) {
    console.error("Error creating mode:", error);
    return c.json({ error: "Failed to create mode" }, { status: 500 });
  }
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

  try {
    // Check if mode exists
    const existingMode = await prisma.mode.findUnique({
      where: { id: id },
    });

    if (!existingMode) {
      return c.json({ error: "Mode not found" }, { status: 404 });
    }

    // Update mode in database
    const updatedMode = await prisma.mode.update({
      where: { id: id },
      data: {
        name: name || existingMode.name,
        description: description || existingMode.description,
        icon: icon || existingMode.icon,
        isActive: isActive ?? existingMode.isActive,
      },
    });

    // Transform to match frontend expectations
    const formattedMode = {
      id: updatedMode.id,
      name: updatedMode.name,
      description: updatedMode.description,
      icon: updatedMode.icon || "graduation-cap",
      path: `/dashboard/modes/${updatedMode.id}`,
      isActive: updatedMode.isActive,
      createdAt: updatedMode.createdAt.toISOString(),
      updatedAt: updatedMode.updatedAt.toISOString(),
    };

    return c.json({ success: true, data: formattedMode });
  } catch (error) {
    console.error("Error updating mode:", error);
    return c.json({ error: "Failed to update mode" }, { status: 500 });
  }
};

export const adminDeletePracticeMode = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const { id } = await c.req.json();

  if (!id) {
    return c.json({ error: "Mode ID is required" }, { status: 400 });
  }

  try {
    // Check if mode exists
    const existingMode = await prisma.mode.findUnique({
      where: { id: id },
    });

    if (!existingMode) {
      return c.json({ error: "Mode not found" }, { status: 404 });
    }

    // Delete mode from database (this will cascade delete scenarios due to the schema)
    await prisma.mode.delete({
      where: { id: id },
    });

    return c.json({
      success: true,
      message: "Practice mode deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting mode:", error);
    return c.json({ error: "Failed to delete mode" }, { status: 500 });
  }
};

// Scenario management endpoints
export const adminGetScenarios = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const modeId = c.req.query("modeId");

  try {
    if (modeId) {
      // Get scenarios for specific mode
      const scenarios = await prisma.scenario.findMany({
        where: { modeId: modeId },
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          prompt: true,
          difficulty: true,
          isActive: true,
          order: true,
          modeId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Transform to match frontend expectations
      const formattedScenarios = scenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.name,
        description: scenario.description,
        image: scenario.image,
        prompt: scenario.prompt,
        difficulty: scenario.difficulty,
        duration: "10-15 min", // Default duration
        participants: 2, // Default participants
        isActive: scenario.isActive,
        modeId: scenario.modeId,
        createdAt: scenario.createdAt.toISOString(),
        updatedAt: scenario.updatedAt.toISOString(),
      }));

      return c.json(formattedScenarios);
    } else {
      // Get all scenarios from all modes
      const scenarios = await prisma.scenario.findMany({
        include: {
          mode: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { order: "asc" },
      });

      // Transform to match frontend expectations
      const formattedScenarios = scenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.name,
        description: scenario.description,
        image: scenario.image,
        prompt: scenario.prompt,
        difficulty: scenario.difficulty,
        duration: "10-15 min", // Default duration
        participants: 2, // Default participants
        isActive: scenario.isActive,
        modeId: scenario.modeId,
        modeName: scenario.mode.name,
        createdAt: scenario.createdAt.toISOString(),
        updatedAt: scenario.updatedAt.toISOString(),
      }));

      return c.json(formattedScenarios);
    }
  } catch (error) {
    console.error("Error fetching admin scenarios:", error);
    return c.json({ error: "Failed to fetch scenarios" }, { status: 500 });
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

  try {
    // Check if mode exists in database
    const existingMode = await prisma.mode.findUnique({
      where: { id: modeId },
    });

    if (!existingMode) {
      return c.json({ error: "Mode not found" }, { status: 404 });
    }

    // Create new scenario in database
    const newScenario = await prisma.scenario.create({
      data: {
        name: title,
        description,
        difficulty,
        prompt: prompt || "",
        modeId,
        order: 0, // Default order, can be updated later
        isActive: true,
      },
    });

    // Transform to match frontend expectations
    const formattedScenario = {
      id: newScenario.id,
      title: newScenario.name,
      description: newScenario.description,
      difficulty: newScenario.difficulty,
      duration: duration || "10-15 min",
      participants: participants || 2,
      prompt: newScenario.prompt,
      modeId: newScenario.modeId,
      isActive: newScenario.isActive,
      createdAt: newScenario.createdAt.toISOString(),
      updatedAt: newScenario.updatedAt.toISOString(),
    };

    return c.json({ success: true, data: formattedScenario }, { status: 201 });
  } catch (error) {
    console.error("Error creating scenario:", error);
    return c.json({ error: "Failed to create scenario" }, { status: 500 });
  }
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

  try {
    // Check if scenario exists
    const existingScenario = await prisma.scenario.findUnique({
      where: { id: id },
    });

    if (!existingScenario) {
      return c.json({ error: "Scenario not found" }, { status: 404 });
    }

    // Update scenario in database
    const updatedScenario = await prisma.scenario.update({
      where: { id: id },
      data: {
        name: title || existingScenario.name,
        description: description || existingScenario.description,
        difficulty: difficulty || existingScenario.difficulty,
        prompt: prompt || existingScenario.prompt,
        isActive: isActive ?? existingScenario.isActive,
      },
    });

    // Transform to match frontend expectations
    const formattedScenario = {
      id: updatedScenario.id,
      title: updatedScenario.name,
      description: updatedScenario.description,
      difficulty: updatedScenario.difficulty,
      duration: duration || "10-15 min",
      participants: participants || 2,
      prompt: updatedScenario.prompt,
      modeId: updatedScenario.modeId,
      isActive: updatedScenario.isActive,
      createdAt: updatedScenario.createdAt.toISOString(),
      updatedAt: updatedScenario.updatedAt.toISOString(),
    };

    return c.json({ success: true, data: formattedScenario });
  } catch (error) {
    console.error("Error updating scenario:", error);
    return c.json({ error: "Failed to update scenario" }, { status: 500 });
  }
};

export const adminDeleteScenario = async (c: Context) => {
  const session = await requireAdmin(c);
  if (!session)
    return c.json({ error: "Admin access required" }, { status: 403 });

  const { id } = await c.req.json();

  if (!id) {
    return c.json({ error: "Scenario ID is required" }, { status: 400 });
  }

  try {
    // Check if scenario exists
    const existingScenario = await prisma.scenario.findUnique({
      where: { id: id },
    });

    if (!existingScenario) {
      return c.json({ error: "Scenario not found" }, { status: 404 });
    }

    // Delete scenario from database
    await prisma.scenario.delete({
      where: { id: id },
    });

    return c.json({
      success: true,
      message: "Scenario deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting scenario:", error);
    return c.json({ error: "Failed to delete scenario" }, { status: 500 });
  }
};
