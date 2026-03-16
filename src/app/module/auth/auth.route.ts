import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { logInZodSchema, registerPatientZodSchema } from "./auth.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

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

router.get(
  "/me",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR, Role.PATIENT),
  authController.getMe,
);

router.post("/refresh-token", authController.getNewToken);

export const authRoutes = router;
