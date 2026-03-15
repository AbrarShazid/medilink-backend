import { Router } from "express";
import { adminController } from "./admin.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { validateAdminUpdatePayload } from "./admin.validation";

const router = Router();

router.get(
  "/",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAllAdmin,
);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  adminController.getAdminById,
);

router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  validateRequest(validateAdminUpdatePayload),
  adminController.updateAdminById,
);

router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN),
  adminController.deleteAdminById,
);

export const adminRoutes = router;
