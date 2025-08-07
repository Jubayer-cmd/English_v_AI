import { Hono } from "hono";
import {
  dashboardGetModes,
  dashboardGetUserDetails,
  dashboardGetProgress,
} from "./dashboard.controller";

export const dashboardRouter = new Hono();

dashboardRouter.get("/modes", dashboardGetModes);
dashboardRouter.get("/user-details", dashboardGetUserDetails);
dashboardRouter.get("/progress", dashboardGetProgress);
