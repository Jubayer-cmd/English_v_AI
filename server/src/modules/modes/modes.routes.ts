import { Hono } from "hono";
import { ModesController } from "./modes.controller";
import { authMiddleware, optionalAuth } from "../../middleware/auth";

const modesRoutes = new Hono();
const modesController = new ModesController();

// Public routes - no auth required (browsing modes and scenarios)
modesRoutes.get(
  "/modes",
  optionalAuth,
  modesController.getModes.bind(modesController),
);
modesRoutes.get(
  "/modes/:modeId/scenarios",
  optionalAuth,
  modesController.getScenariosByMode.bind(modesController),
);

// Protected routes - require authentication
modesRoutes.use("/scenarios/*", authMiddleware);
modesRoutes.use("/sessions/*", authMiddleware);
modesRoutes.use("/users/*", authMiddleware);

// Chat Session Management
modesRoutes.post(
  "/scenarios/:scenarioId/start",
  modesController.startChatSession.bind(modesController),
);
modesRoutes.post(
  "/sessions/:sessionId/message",
  modesController.sendMessage.bind(modesController),
);
modesRoutes.get(
  "/sessions/:sessionId/history",
  modesController.getChatHistory.bind(modesController),
);
modesRoutes.post(
  "/sessions/:sessionId/end",
  modesController.endChatSession.bind(modesController),
);

// User Practice History and Stats
modesRoutes.get(
  "/users/me/history",
  modesController.getUserPracticeHistory.bind(modesController),
);
modesRoutes.get(
  "/users/me/stats",
  modesController.getUserPracticeStats.bind(modesController),
);

export { modesRoutes as practiceRoutes };
