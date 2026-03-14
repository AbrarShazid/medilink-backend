import { Router } from "express";
import { specialityController } from "./speciality.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router = Router();
router.post("/", specialityController.createSpeciality);
router.get("/",  specialityController.getAllSpeciality);

router.patch("/:id", specialityController.updateSpeciality);
router.delete("/:id",checkAuth(Role.SUPER_ADMIN,Role.ADMIN), specialityController.deleteSpeciality);

export const specialityRoutes = router;
