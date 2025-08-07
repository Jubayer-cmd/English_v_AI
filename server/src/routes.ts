import { Hono } from "hono";
import { authRouter } from "./modules/auth/auth.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { adminRoutes } from "./modules/admin/admin.routes";
import { practiceRoutes } from "./modules/modes/modes.routes";

export const routes = new Hono();

// Health
routes.get("/", (c) => c.text("OK"));
routes.get("/api/healthz", (c) => c.json({ ok: true }));
routes.get("/api/readyz", (c) => c.json({ ready: true }));

routes.route("/api", authRouter);
routes.route("/api/dashboard", dashboardRouter);
routes.route("/api/admin", adminRoutes);
routes.route("/api/practice", practiceRoutes);
