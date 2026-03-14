import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { logInZodSchema, registerPatientZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerPatientZodSchema),
  authController.registerPatient,
);
router.post(
  "/login",
  validateRequest(logInZodSchema),
  authController.logInUser,
);

export const authRoutes = router;
