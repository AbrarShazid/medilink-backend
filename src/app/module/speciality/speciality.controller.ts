import { Request, Response } from "express";
import { specialityService } from "./speciality.service";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";

const createSpeciality = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await specialityService.createSpeciality(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialty created successfully",
    data: result,
  });
});
// get all speciality :

const getAllSpeciality = catchAsync(async (req: Request, res: Response) => {
  const result = await specialityService.getAllSpeciality();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialties fetched successfully",
    data: result,
  });
});

//update
const updateSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await specialityService.updateSpeciality(
    id as string,
    payload,
  );
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Specialty updated successfully",
    data: result,
  });
});

// delete
const deleteSpeciality = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await specialityService.deleteSpeciality(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Specialty deleted successfully",
    data: result,
  });
});

export const specialityController = {
  createSpeciality,
  getAllSpeciality,
  updateSpeciality,
  deleteSpeciality,
};
