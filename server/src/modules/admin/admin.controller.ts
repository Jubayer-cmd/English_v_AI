import type { Context } from "hono";
import { prisma } from "../../client";

export class AdminController {
  // Modes Management
  async createMode(c: Context) {
    try {
      const { name, description, icon, order } = await c.req.json();

      const mode = await prisma.mode.create({
        data: {
          name,
          description,
          icon,
          order: order || 0,
        },
      });

      return c.json({ success: true, data: mode });
    } catch (error) {
      return c.json({ success: false, error: "Failed to create mode" }, 500);
    }
  }

  async getAllModes(c: Context) {
    try {
      const modes = await prisma.mode.findMany({
        include: {
          scenarios: {
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      });

      return c.json({ success: true, data: modes });
    } catch (error) {
      return c.json({ success: false, error: "Failed to fetch modes" }, 500);
    }
  }

  async updateMode(c: Context) {
    try {
      const { id } = c.req.param();
      const { name, description, icon, order, isActive } = await c.req.json();

      const mode = await prisma.mode.update({
        where: { id },
        data: {
          name,
          description,
          icon,
          order,
          isActive,
        },
      });

      return c.json({ success: true, data: mode });
    } catch (error) {
      return c.json({ success: false, error: "Failed to update mode" }, 500);
    }
  }

  async deleteMode(c: Context) {
    try {
      const { id } = c.req.param();

      await prisma.mode.delete({
        where: { id },
      });

      return c.json({
        success: true,
        message: "Mode deleted successfully",
      });
    } catch (error) {
      return c.json({ success: false, error: "Failed to delete mode" }, 500);
    }
  }

  // Scenarios Management
  async createScenario(c: Context) {
    try {
      const { name, description, image, prompt, difficulty, modeId, order } =
        await c.req.json();

      const scenario = await prisma.scenario.create({
        data: {
          name,
          description,
          image,
          prompt,
          difficulty: difficulty || "beginner",
          modeId,
          order: order || 0,
        },
      });

      return c.json({ success: true, data: scenario });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to create scenario" },
        500,
      );
    }
  }

  async getScenariosByMode(c: Context) {
    try {
      const { modeId } = c.req.param();

      const scenarios = await prisma.scenario.findMany({
        where: { modeId: modeId },
        orderBy: { order: "asc" },
      });

      return c.json({ success: true, data: scenarios });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch scenarios" },
        500,
      );
    }
  }

  async updateScenario(c: Context) {
    try {
      const { id } = c.req.param();
      const { name, description, image, prompt, difficulty, order, isActive } =
        await c.req.json();

      const scenario = await prisma.scenario.update({
        where: { id },
        data: {
          name,
          description,
          image,
          prompt,
          difficulty,
          order,
          isActive,
        },
      });

      return c.json({ success: true, data: scenario });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to update scenario" },
        500,
      );
    }
  }

  async deleteScenario(c: Context) {
    try {
      const { id } = c.req.param();

      await prisma.scenario.delete({
        where: { id },
      });

      return c.json({
        success: true,
        message: "Scenario deleted successfully",
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to delete scenario" },
        500,
      );
    }
  }

  // Analytics and Statistics
  async getStats(c: Context) {
    try {
      const totalModes = await prisma.mode.count();
      const totalScenarios = await prisma.scenario.count();
      const totalSessions = await prisma.chatSession.count();
      const activeSessions = await prisma.chatSession.count({
        where: { endedAt: null },
      });

      const popularScenarios = await prisma.scenario.findMany({
        include: {
          _count: {
            select: { chatSessions: true },
          },
        },
        orderBy: {
          chatSessions: {
            _count: "desc",
          },
        },
        take: 10,
      });

      return c.json({
        success: true,
        data: {
          totalModes,
          totalScenarios,
          totalSessions,
          activeSessions,
          popularScenarios,
        },
      });
    } catch (error) {
      return c.json({ success: false, error: "Failed to fetch stats" }, 500);
    }
  }

  // Bulk operations
  async reorderModes(c: Context) {
    try {
      const { modes } = await c.req.json(); // Array of { id, order }

      const updatePromises = modes.map((mode: { id: string; order: number }) =>
        prisma.mode.update({
          where: { id: mode.id },
          data: { order: mode.order },
        }),
      );

      await Promise.all(updatePromises);

      return c.json({
        success: true,
        message: "Modes reordered successfully",
      });
    } catch (error) {
      return c.json({ success: false, error: "Failed to reorder modes" }, 500);
    }
  }

  async reorderScenarios(c: Context) {
    try {
      const { scenarios } = await c.req.json(); // Array of { id, order }

      const updatePromises = scenarios.map(
        (scenario: { id: string; order: number }) =>
          prisma.scenario.update({
            where: { id: scenario.id },
            data: { order: scenario.order },
          }),
      );

      await Promise.all(updatePromises);

      return c.json({
        success: true,
        message: "Scenarios reordered successfully",
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to reorder scenarios" },
        500,
      );
    }
  }
}
