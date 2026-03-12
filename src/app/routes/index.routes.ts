import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.route";
import { authRoutes } from "../module/auth/auth.route";

const router=Router()

router.use("/auth",authRoutes)
router.use("/speciality",specialityRoutes)

export const IndexRoutes=router