import express from "express";
import {
  loginController,
  registerController,
} from "../controller/auth.controller.js";
import {
  validate,
  validateData,
} from "../middlewares/validation.middlewares.js";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";

const router = express.Router();

router
  .route("/register")
  .post(validateData(registerSchema), registerController);
router.route("/login").post(validateData(loginSchema), loginController);

export { router as AuthRouter };
