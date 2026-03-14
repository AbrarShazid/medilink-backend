import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createAdminZodSchema, createDoctorZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post(
  "/create-doctor",
  validateRequest(createDoctorZodSchema),
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userController.createDoctor,
);
// only super admin can create admin
router.post(
  "/create-admin",
  validateRequest(createAdminZodSchema),
  checkAuth(Role.SUPER_ADMIN),
  userController.createAdmin,
);

router.post(
  "/create-super-admin",
  validateRequest(createAdminZodSchema),
  checkAuth(Role.SUPER_ADMIN),
  userController.createSuperAdmin,
);

export const userRoutes = router;
