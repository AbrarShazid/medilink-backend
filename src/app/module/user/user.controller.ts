import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const createDoctor = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createDoctor(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Doctor created successfully!",
    data: result,
  });
});
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createAdmin(payload);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Admin created successfully!",
    data: result,
  });
});

//create superAdmin
const createSuperAdmin = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await userService.createSuperAdmin(payload);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Super Admin Created Successfully!",
    data: result,
  });
});

export const userController = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
