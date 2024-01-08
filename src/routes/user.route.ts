import express, { IRouterHandler } from "express";
import { Request, Response } from "express";
import userController from "../controllers/userController";
import { validateUserCredentials } from "../middleware/validateResource";

let router = express.Router();
router.post("/register", userController.register);

export default router;
