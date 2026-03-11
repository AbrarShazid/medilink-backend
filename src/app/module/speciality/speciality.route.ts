import { Router } from "express";
import { specialityController } from "./speciality.controller";

const router = Router();
router.post("/", specialityController.createSpeciality);
router.get("/", specialityController.getAllSpeciality);

router.patch("/:id", specialityController.updateSpeciality);
router.delete("/:id", specialityController.deleteSpeciality);

export const specialityRoutes = router;
