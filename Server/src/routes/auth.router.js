import { Router } from "express";
import {
  getInfoController,
  LoginController,
  refreshTokenController,
  registerController,
} from "../controllers/auth.controller.js";
import { validateBody } from "../middlewares/validation.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.zod.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateBody(registerSchema), registerController);
router.post("/login", validateBody(loginSchema), LoginController);

router.get("/me", authenticate, getInfoController);
router.post("/refresh", refreshTokenController);

export default router;
