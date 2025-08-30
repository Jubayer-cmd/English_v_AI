import type { Context } from 'hono';
import { prisma } from '../../client';
import { uploadFile, deleteFile } from '../../utils/bucketutils';

export class ModesController {
  // Get all active modes for users
  async getModes(c: Context) {
    try {
      const modes = await prisma.mode.findMany({
        where: { isActive: true },
        include: {
          scenarios: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
            select: {
              id: true,
              name: true,
              description: true,
              image: true,
              order: true,
            },
          },
        },
        orderBy: { order: 'asc' },
      });

      return c.json({ success: true, data: modes });
    } catch (error) {
      return c.json({ success: false, error: 'Failed to fetch modes' }, 500);
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
        orderBy: { order: 'asc' },
        select: {
          id: true,
          name: true,
          description: true,
          image: true,
          order: true,
        },
      });

      return c.json({ success: true, data: scenarios });
    } catch (error) {
      return c.json(
        { success: false, error: 'Failed to fetch scenarios' },
        500,
      );
    }
  }

  // Start a new chat session with a scenario
  async startChatSession(c: Context) {
    try {
      const { scenarioId } = c.req.param();
      const user = c.get('user'); // Get user from auth middleware

      // Get scenario details including the AI prompt
      const scenario = await prisma.scenario.findUnique({
        where: { id: scenarioId },
        include: {
          mode: true,
        },
      });

      if (!scenario) {
        return c.json({ success: false, error: 'Scenario not found' }, 404);
      }

      // Create new chat session
      const chatSession = await prisma.chatSession.create({
        data: {
          userId: user.id,
          scenarioId: scenarioId!,
          sessionData: {
            scenarioName: scenario.name,
            modeName: scenario.mode.name,
          },
        },
      });

      // Create initial AI message with the scenario prompt
      const initialMessage = await prisma.chatMessage.create({
        data: {
          sessionId: chatSession.id,
          content: `Hello! I'm ${scenario.name}. ${scenario.prompt} Let's start our conversation to help you practice English!`,
          role: 'assistant',
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
        { success: false, error: 'Failed to start chat session' },
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
        return c.json({ success: false, error: 'Chat session not found' }, 404);
      }

      if (session.endedAt) {
        return c.json({ success: false, error: 'Chat session has ended' }, 400);
      }

      // Create user message
      const userMessage = await prisma.chatMessage.create({
        data: {
          sessionId: sessionId!,
          content,
          role: 'user',
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
          role: 'assistant',
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
      return c.json({ success: false, error: 'Failed to send message' }, 500);
    }
  }

  // Get chat history for a session
  async getChatHistory(c: Context) {
    try {
      const { sessionId } = c.req.param();

      const messages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { timestamp: 'asc' },
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
        { success: false, error: 'Failed to fetch chat history' },
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
        { success: false, error: 'Failed to end chat session' },
        500,
      );
    }
  }

  // Get user's practice history
  async getUserPracticeHistory(c: Context) {
    try {
      const user = c.get('user');

      const sessions = await prisma.chatSession.findMany({
        where: { userId: user.id },
        include: {
          scenario: {
            select: {
              id: true,
              name: true,
              mode: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { startedAt: 'desc' },
        take: 20, // Limit to recent 20 sessions
      });

      return c.json({ success: true, data: sessions });
    } catch (error) {
      return c.json(
        { success: false, error: 'Failed to fetch practice history' },
        500,
      );
    }
  }

  // Get user's practice statistics
  async getUserPracticeStats(c: Context) {
    try {
      const user = c.get('user');

      const totalSessions = await prisma.chatSession.count({
        where: { userId: user.id },
      });

      const completedSessions = await prisma.chatSession.count({
        where: { userId: user.id, endedAt: { not: null } },
      });

      const totalMessages = await prisma.chatMessage.count({
        where: {
          session: { userId: user.id },
          role: 'user',
        },
      });

      const practiceByMode = await prisma.chatSession.groupBy({
        by: ['scenarioId'],
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
        { success: false, error: 'Failed to fetch practice stats' },
        500,
      );
    }
  }

  // Admin methods for managing scenarios

  // Get all scenarios for admin management
  async getAllScenarios(c: Context) {
    try {
      const user = c.get('user');

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return c.json({ success: false, error: 'Unauthorized' }, 403);
      }

      const { modeId } = c.req.query();

      const scenarios = await prisma.scenario.findMany({
        where: modeId ? { modeId } : {},
        include: {
          mode: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Transform to match frontend expectations
      const formattedScenarios = scenarios.map((scenario) => ({
        id: scenario.id,
        title: scenario.name,
        description: scenario.description || '',
        image: scenario.image,
        prompt: scenario.prompt,
        isActive: scenario.isActive,
        modeId: scenario.modeId,
        modeName: scenario.mode.name,
        createdAt: scenario.createdAt.toISOString(),
        updatedAt: scenario.updatedAt.toISOString(),
      }));

      return c.json({ success: true, data: formattedScenarios });
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      return c.json(
        { success: false, error: 'Failed to fetch scenarios' },
        500,
      );
    }
  }

  // Create a new scenario with optional image upload
  async createScenario(c: Context) {
    try {
      const user = c.get('user');

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return c.json({ success: false, error: 'Unauthorized' }, 403);
      }

      const formData = await c.req.formData();
      const name = formData.get('title') as string;
      const description = formData.get('description') as string;
      const prompt = formData.get('prompt') as string;
      const modeId = formData.get('modeId') as string;
      const order = parseInt(formData.get('order') as string) || 0;
      const imageFile = formData.get('image') as File;

      if (!name || !prompt || !modeId || !imageFile || imageFile.size === 0) {
        return c.json(
          {
            success: false,
            error: 'Name, prompt, modeId, and image are required',
          },
          400,
        );
      }

      // Verify mode exists
      const mode = await prisma.mode.findUnique({
        where: { id: modeId },
      });

      if (!mode) {
        return c.json({ success: false, error: 'Mode not found' }, 404);
      }

      let imageUrl = null;

      // Upload image if provided
      if (imageFile && imageFile.size > 0) {
        const uploadResult = await uploadFile(imageFile, {
          folder: 'scenarios',
          userId: user.id,
        });

        if (!uploadResult.success) {
          return c.json(
            {
              success: false,
              error: `Failed to upload image: ${uploadResult.error}`,
            },
            500,
          );
        }

        imageUrl = uploadResult.url;
      }

      // Create scenario
      const scenario = await prisma.scenario.create({
        data: {
          name,
          description,
          prompt,
          modeId,
          order,
          image: imageUrl,
        },
      });

      // Transform to match frontend expectations
      const formattedScenario = {
        id: scenario.id,
        title: scenario.name,
        description: scenario.description,
        image: scenario.image,
        prompt: scenario.prompt,
        isActive: scenario.isActive,
        modeId: scenario.modeId,
        createdAt: scenario.createdAt.toISOString(),
        updatedAt: scenario.updatedAt.toISOString(),
      };

      return c.json({ success: true, data: formattedScenario }, 201);
    } catch (error) {
      console.error('Error creating scenario:', error);
      return c.json(
        { success: false, error: 'Failed to create scenario' },
        500,
      );
    }
  }

  // Update scenario with optional image upload
  async updateScenario(c: Context) {
    try {
      const user = c.get('user');

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return c.json({ success: false, error: 'Unauthorized' }, 403);
      }

      const { scenarioId } = c.req.param();
      const formData = await c.req.formData();
      const name = formData.get('title') as string;
      const description = formData.get('description') as string;
      const prompt = formData.get('prompt') as string;
      const order = parseInt(formData.get('order') as string) || 0;
      const isActive = formData.get('isActive') === 'true';
      const imageFile = formData.get('image') as File;

      // Get existing scenario
      const existingScenario = await prisma.scenario.findUnique({
        where: { id: scenarioId },
      });

      if (!existingScenario) {
        return c.json({ success: false, error: 'Scenario not found' }, 404);
      }

      let imageUrl = existingScenario.image;

      // Handle image upload/update
      if (imageFile && imageFile.size > 0) {
        // Delete old image if exists
        if (existingScenario.image) {
          // Extract file key from URL
          const urlParts = existingScenario.image.split('/');
          const fileKey = urlParts[urlParts.length - 1];

          if (fileKey) {
            await deleteFile(`scenarios/${fileKey}`, user.id);
          }
        }

        // Upload new image
        const uploadResult = await uploadFile(imageFile, {
          folder: 'scenarios',
          userId: user.id,
        });

        if (!uploadResult.success) {
          return c.json(
            {
              success: false,
              error: `Failed to upload image: ${uploadResult.error}`,
            },
            500,
          );
        }

        imageUrl = uploadResult.url;
      }

      // Update scenario
      const scenario = await prisma.scenario.update({
        where: { id: scenarioId },
        data: {
          ...(name && { name }),
          ...(description !== undefined && { description }),
          ...(prompt && { prompt }),
          ...(order !== undefined && { order }),
          isActive,
          ...(imageUrl !== undefined && { image: imageUrl }),
        },
      });

      // Transform to match frontend expectations
      const formattedScenario = {
        id: scenario.id,
        title: scenario.name,
        description: scenario.description,
        image: scenario.image,
        prompt: scenario.prompt,
        isActive: scenario.isActive,
        modeId: scenario.modeId,
        createdAt: scenario.createdAt.toISOString(),
        updatedAt: scenario.updatedAt.toISOString(),
      };

      return c.json({ success: true, data: formattedScenario });
    } catch (error) {
      console.error('Error updating scenario:', error);
      return c.json(
        { success: false, error: 'Failed to update scenario' },
        500,
      );
    }
  }

  // Delete scenario and its image
  async deleteScenario(c: Context) {
    try {
      const user = c.get('user');

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return c.json({ success: false, error: 'Unauthorized' }, 403);
      }

      const { scenarioId } = c.req.param();

      // Get scenario to check if it exists and get image URL
      const scenario = await prisma.scenario.findUnique({
        where: { id: scenarioId },
      });

      if (!scenario) {
        return c.json({ success: false, error: 'Scenario not found' }, 404);
      }

      // Delete image if exists
      if (scenario.image) {
        // Extract file key from URL
        const urlParts = scenario.image.split('/');
        const fileKey = urlParts[urlParts.length - 1];

        if (fileKey) {
          await deleteFile(`scenarios/${fileKey}`, user.id);
        }
      }

      // Delete scenario (this will cascade delete related chat sessions and messages)
      await prisma.scenario.delete({
        where: { id: scenarioId },
      });

      return c.json({
        success: true,
        message: 'Scenario deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting scenario:', error);
      return c.json(
        { success: false, error: 'Failed to delete scenario' },
        500,
      );
    }
  }
}
