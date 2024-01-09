import express, { IRouterHandler } from "express";
import { Request, Response } from "express";
import { registerController } from "../controllers/user.controller";
import { validateUserCredentials } from "../middleware/validateResource";
import { userSchemaController } from "../middleware/user.middleware";
import { registerUserSchema, loginUserSchema } from "../schemas/user.schema";
import {
  createUserSessionController,
  deleteSessionHandler,
  getUserSessionHandler,
} from "../controllers/session.controller";
import { deserializeUser } from "../middleware/deserializeUser";

let router = express.Router();
router.post(
  "/register",
  userSchemaController(registerUserSchema),
  registerController
);

//login user
router.post(
  "/sessions",
  deserializeUser,
  userSchemaController(loginUserSchema),
  createUserSessionController
);
router.get("/sessions", deserializeUser, getUserSessionHandler);
router.delete("/sessions", deserializeUser, deleteSessionHandler);

export default router;
