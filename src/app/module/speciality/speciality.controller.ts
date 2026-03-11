import { Request, Response } from "express";
import { specialityService } from "./speciality.service";

const createSpeciality = async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await specialityService.createSpeciality(payload);

  res.status(201).json({
    success: true,
    data: result,
  });
};


export const specialityController={
    createSpeciality
}
