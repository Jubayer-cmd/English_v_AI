import { Hono } from "hono";
import { auth } from "./auth";
import { authGetUser, authSignOut } from "./auth.controller";

export const authRouter = new Hono();

// Better Auth raw handlers under /auth/*
authRouter.all("/auth/*", (c) => auth.handler(c.req.raw));

// Convenience endpoints
authRouter.get("/user", authGetUser);
authRouter.post("/signout", authSignOut);
