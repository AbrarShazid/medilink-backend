import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await adminService.getAllAdmin();

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "All admin fetched successfully",
    data: result,
  });
});
//by id
const getAdminById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await adminService.getAdminById(id as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin fetched successfully",
    data: result,
  });
});

const deleteAdminById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const user = req.user!;
  const result = await adminService.deleteAdminById(id, user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is deleted successfully",
    data: result,
  });
});

const updateAdminById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const payload = req.body;
  const result = await adminService.updateAdminById(id, payload);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin is updated",
    data: result,
  });
});

export const adminController = {
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
