import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { doctorService } from "./doctor.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllDoctor = catchAsync(async (req: Request, res: Response) => {
  const result = await doctorService.getAllDoctor();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor data fetched successfully!",
    data: result,
  });
});

const getDoctorById = catchAsync(async (req: Request, res: Response) => {
  const doctorId = req.params.id as string;

  const result = await doctorService.getDoctorById(doctorId);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Doctor data fetched successfully!",
    data: result,
  });
});

export const doctorController = {
  getAllDoctor,
  getDoctorById,
};
