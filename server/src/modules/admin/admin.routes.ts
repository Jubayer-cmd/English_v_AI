import { Hono } from "hono";
import { AdminController } from "./admin.controller";
import { authMiddleware, requireAdmin } from "../../middleware/auth";

const adminRoutes = new Hono();
const adminController = new AdminController();

// Apply authentication and admin role requirement to all admin routes
adminRoutes.use("*", authMiddleware, requireAdmin);

// Modes Routes
adminRoutes.post("/modes", adminController.createMode.bind(adminController));
adminRoutes.get("/modes", adminController.getAllModes.bind(adminController));
adminRoutes.put("/modes/:id", adminController.updateMode.bind(adminController));
adminRoutes.delete(
  "/modes/:id",
  adminController.deleteMode.bind(adminController),
);
adminRoutes.put(
  "/modes/reorder",
  adminController.reorderModes.bind(adminController),
);

// Scenarios Routes
adminRoutes.post(
  "/scenarios",
  adminController.createScenario.bind(adminController),
);
adminRoutes.get(
  "/modes/:modeId/scenarios",
  adminController.getScenariosByMode.bind(adminController),
);
adminRoutes.put(
  "/scenarios/:id",
  adminController.updateScenario.bind(adminController),
);
adminRoutes.delete(
  "/scenarios/:id",
  adminController.deleteScenario.bind(adminController),
);
adminRoutes.put(
  "/scenarios/reorder",
  adminController.reorderScenarios.bind(adminController),
);

// Analytics Routes
adminRoutes.get("/stats", adminController.getStats.bind(adminController));

export { adminRoutes };
