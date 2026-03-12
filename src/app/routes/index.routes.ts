import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.route";
import { authRoutes } from "../module/auth/auth.route";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";

const router=Router()

router.use("/auth",authRoutes)
router.use("/speciality",specialityRoutes)

router.use("/users", userRoutes)
router.use("/doctor", doctorRoutes)

export const IndexRoutes=router