import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { routes } from "./routes";


export const app = new Hono().use(
  logger(),
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    credentials: true,
    maxAge: 600,
  }),
);

// Mount all app routes
app.route("/", routes);

export default app;
