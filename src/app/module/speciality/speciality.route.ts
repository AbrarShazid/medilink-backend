import { Router } from "express";
import { specialityController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";
import { multerUpload } from "../../config/multer.config";
import { validateRequest } from "../../middleware/validateRequest";
import { specialityValidation } from "./speciality.validation";

const router = Router();
router.get("/", specialityController.getAllSpeciality);

router.post(
  "/",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  multerUpload.single("file"),
  validateRequest(specialityValidation.createSpecialityZodSchema),
  specialityController.createSpeciality,
);

router.patch(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  specialityController.updateSpeciality,
);
router.delete(
  "/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  specialityController.deleteSpeciality,
);

export const specialityRoutes = router;
