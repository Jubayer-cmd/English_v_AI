import { Hono } from "hono";
import {
  dashboardGetModes,
  dashboardGetModeById,
  dashboardGetScenariosByMode,
  dashboardGetScenarioById,
  dashboardGetUserDetails,
  dashboardGetProgress,
  adminGetStats,
  adminGetPracticeModes,
  adminCreatePracticeMode,
  adminUpdatePracticeMode,
  adminDeletePracticeMode,
  adminGetScenarios,
  adminCreateScenario,
  adminUpdateScenario,
  adminDeleteScenario,
} from "./dashboard.controller";

export const dashboardRouter = new Hono();

// Regular dashboard endpoints
dashboardRouter.get("/modes", dashboardGetModes);
dashboardRouter.get("/modes/:modeId", dashboardGetModeById);
dashboardRouter.get("/modes/:modeId/scenarios", dashboardGetScenariosByMode);
dashboardRouter.get("/scenarios/:scenarioId", dashboardGetScenarioById);
dashboardRouter.get("/user-details", dashboardGetUserDetails);
dashboardRouter.get("/progress", dashboardGetProgress);

// Admin endpoints
dashboardRouter.get("/admin/stats", adminGetStats);
dashboardRouter.get("/admin/modes", adminGetPracticeModes);
dashboardRouter.post("/admin/modes", adminCreatePracticeMode);
dashboardRouter.put("/admin/modes", adminUpdatePracticeMode);
dashboardRouter.delete("/admin/modes", adminDeletePracticeMode);

// Admin scenario management
dashboardRouter.get("/admin/scenarios", adminGetScenarios);
dashboardRouter.post("/admin/scenarios", adminCreateScenario);
dashboardRouter.put("/admin/scenarios", adminUpdateScenario);
dashboardRouter.delete("/admin/scenarios", adminDeleteScenario);
