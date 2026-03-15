import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.route";
import { authRoutes } from "../module/auth/auth.route";
import { userRoutes } from "../module/user/user.route";
import { doctorRoutes } from "../module/doctor/doctor.route";
import { adminRoutes } from "../module/admin/admin.route";

const router=Router()

router.use("/auth",authRoutes)
router.use("/speciality",specialityRoutes)

router.use("/users", userRoutes)
router.use("/doctor", doctorRoutes)
router.use("/admin", adminRoutes)

export const IndexRoutes=router