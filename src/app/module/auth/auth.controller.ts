import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.registerPatient(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Patient registered successfully",
    data: result,
  });
});

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const paylaod = req.body;
  const result = await authService.logInUser(paylaod);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Log in successfully!",
    data: result,
  });
});

export const authController = {
  registerPatient,
  logInUser
};
