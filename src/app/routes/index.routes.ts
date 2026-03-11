import { Router } from "express";
import { specialityRoutes } from "../module/speciality/speciality.route";

const router=Router()


router.use("/speciality",specialityRoutes)

export const IndexRoutes=router