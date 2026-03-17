import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
  changePasswordSchema,
  logInZodSchema,
  registerPatientZodSchema,
} from "./auth.validation";
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
router.post(
  "/change-password",
  checkAuth(Role.ADMIN, Role.PATIENT, Role.DOCTOR, Role.SUPER_ADMIN),
  validateRequest(changePasswordSchema),
  authController.changePassword,
);

router.post(
  "/log-out",
  checkAuth(Role.ADMIN, Role.PATIENT, Role.DOCTOR, Role.SUPER_ADMIN),
  authController.logOutUser,
);

router.post("/verify-email", authController.verifyEmail);

export const authRoutes = router;
