import express from "express";

import {
  register,
  login,
  profile,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerSchema),
  register
);

router.post("/login", validate(loginSchema), login);

router.get(
  "/profile",
  protect,
  profile
);

export default router;