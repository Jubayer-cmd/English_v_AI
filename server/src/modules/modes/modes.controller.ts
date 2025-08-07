import type { Context } from "hono";
import { prisma } from "../../client";

export class ModesController {
  // Get all active modes for users
  async getModes(c: Context) {
    try {
      const modes = await prisma.mode.findMany({
        where: { isActive: true },
        include: {
          scenarios: {
            where: { isActive: true },
            orderBy: { order: "asc" },
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              difficulty: true,
              order: true,
            },
          },
        },
        orderBy: { order: "asc" },
      });

      return c.json({ success: true, data: modes });
    } catch (error) {
      return c.json({ success: false, error: "Failed to fetch modes" }, 500);
    }
  }

  // Get scenarios for a specific mode
  async getScenariosByMode(c: Context) {
    try {
      const { modeId } = c.req.param();

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
          difficulty: true,
          order: true,
        },
      });

      return c.json({ success: true, data: scenarios });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch scenarios" },
        500,
      );
    }
  }

  // Start a new chat session with a scenario
  async startChatSession(c: Context) {
    try {
      const { scenarioId } = c.req.param();
      const user = c.get("user"); // Get user from auth middleware

      // Get scenario details including the AI prompt
      const scenario = await prisma.scenario.findUnique({
        where: { id: scenarioId },
        include: {
          mode: true,
        },
      });

      if (!scenario) {
        return c.json({ success: false, error: "Scenario not found" }, 404);
      }

      // Create new chat session
      const chatSession = await prisma.chatSession.create({
        data: {
          userId: user.id,
          scenarioId: scenarioId!,
          sessionData: {
            scenarioName: scenario.name,
            modeName: scenario.mode.name,
            difficulty: scenario.difficulty,
          },
        },
      });

      // Create initial AI message with the scenario prompt
      const initialMessage = await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: `Hello! I'm ${scenario.name}. ${scenario.prompt} Let's start our conversation to help you practice English!`,
          role: "assistant",
          metadata: {
            isInitial: true,
            scenarioPrompt: scenario.prompt,
          },
        },
      });

      // Update session message counts
      await prisma.chatSession.update({
        where: { id: chatSession.id },
        data: {
          totalMessages: 1,
          aiMessages: 1,
        },
      });

      return c.json({
        success: true,
        data: {
          sessionId: chatSession.id,
          scenario: {
            id: scenario.id,
            name: scenario.name,
            description: scenario.description,
            image: scenario.image,
            difficulty: scenario.difficulty,
          },
          initialMessage: {
            id: initialMessage.id,
            content: initialMessage.content,
            role: initialMessage.role,
            timestamp: initialMessage.timestamp,
          },
        },
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to start chat session" },
        500,
      );
    }
  }

  // Send a message in a chat session
  async sendMessage(c: Context) {
    try {
      const { sessionId } = c.req.param();
      const { content, metadata } = await c.req.json();

      // Verify session exists and is active
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
        include: {
          scenario: true,
        },
      });

      if (!session) {
        return c.json({ success: false, error: "Chat session not found" }, 404);
      }

      if (session.endedAt) {
        return c.json({ success: false, error: "Chat session has ended" }, 400);
      }

      // Create user message
      const userMessage = await prisma.chatMessage.create({
        data: {
          sessionId: sessionId!,
          content,
          role: "user",
          metadata,
        },
      });

      // Here you would integrate with your AI service to generate a response
      // For now, we'll create a placeholder AI response
      const aiResponse = `Thank you for your message! As ${session.scenario.name}, I appreciate you practicing English with me. Could you tell me more about that?`;

      const aiMessage = await prisma.chatMessage.create({
        data: {
          sessionId: sessionId!,
          content: aiResponse,
          role: "assistant",
          metadata: {
            generatedAt: new Date().toISOString(),
          },
        },
      });

      // Update session statistics
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          totalMessages: { increment: 2 },
          userMessages: { increment: 1 },
          aiMessages: { increment: 1 },
        },
      });

      return c.json({
        success: true,
        data: {
          userMessage: {
            id: userMessage.id,
            content: userMessage.content,
            role: userMessage.role,
            timestamp: userMessage.timestamp,
          },
          aiMessage: {
            id: aiMessage.id,
            content: aiMessage.content,
            role: aiMessage.role,
            timestamp: aiMessage.timestamp,
          },
        },
      });
    } catch (error) {
      return c.json({ success: false, error: "Failed to send message" }, 500);
    }
  }

  // Get chat history for a session
  async getChatHistory(c: Context) {
    try {
      const { sessionId } = c.req.param();

      const messages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { timestamp: "asc" },
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true,
          metadata: true,
        },
      });

      return c.json({ success: true, data: messages });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch chat history" },
        500,
      );
    }
  }

  // End a chat session
  async endChatSession(c: Context) {
    try {
      const { sessionId } = c.req.param();

      const session = await prisma.chatSession.update({
        where: { id: sessionId },
        data: { endedAt: new Date() },
        include: {
          _count: {
            select: { messages: true },
          },
        },
      });

      return c.json({
        success: true,
        data: {
          sessionId: session.id,
          duration:
            session.endedAt && session.startedAt
              ? new Date(session.endedAt).getTime() -
                new Date(session.startedAt).getTime()
              : null,
          totalMessages: session.totalMessages,
          userMessages: session.userMessages,
          aiMessages: session.aiMessages,
        },
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to end chat session" },
        500,
      );
    }
  }

  // Get user's practice history
  async getUserPracticeHistory(c: Context) {
    try {
      const user = c.get("user");

      const sessions = await prisma.chatSession.findMany({
        where: { userId: user.id },
        include: {
          scenario: {
            select: {
              id: true,
              name: true,
              difficulty: true,
              mode: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startedAt: "desc" },
        take: 20, // Limit to recent 20 sessions
      });

      return c.json({ success: true, data: sessions });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch practice history" },
        500,
      );
    }
  }

  // Get user's practice statistics
  async getUserPracticeStats(c: Context) {
    try {
      const user = c.get("user");

      const totalSessions = await prisma.chatSession.count({
        where: { userId: user.id },
      });

      const completedSessions = await prisma.chatSession.count({
        where: { userId: user.id, endedAt: { not: null } },
      });

      const totalMessages = await prisma.chatMessage.count({
        where: {
          session: { userId: user.id },
          role: "user",
        },
      });

      const practiceByMode = await prisma.chatSession.groupBy({
        by: ["scenarioId"],
        where: { userId: user.id },
        _count: { id: true },
      });

      return c.json({
        success: true,
        data: {
          totalSessions,
          completedSessions,
          totalMessages,
          practiceByMode,
        },
      });
    } catch (error) {
      return c.json(
        { success: false, error: "Failed to fetch practice stats" },
        500,
      );
    }
  }
}
