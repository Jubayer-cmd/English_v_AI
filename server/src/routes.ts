import { Hono } from "hono";
import { authRouter } from "./modules/auth/auth.routes";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";

export const routes = new Hono();

// Health
routes.get("/", (c) => c.text("OK"));
routes.get("/api/healthz", (c) => c.json({ ok: true }));
routes.get("/api/readyz", (c) => c.json({ ready: true }));

routes.route("/api", authRouter);
routes.route("/api/dashboard", dashboardRouter);
