import { NextFunction, Request, Response } from "express";
import { envVariables } from "../config/env";
import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interfaces/error.interface";
import { handleZodError } from "../errorHelpers/handleZodError";
import AppError from "../errorHelpers/AppError";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";

export const globalErrorHandler = async (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVariables.NODE_ENV === "development") {
    console.log("Error from global error handler ", err);
  }

  if (req.file) {
    // if file uploaded but error happens then delete the file
    await deleteFileFromCloudinary(req.file.path);
  }

  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    // if we need to delete multiplefile  incase
    const imageUrlArr = req.files.map((singleFile) => singleFile.path);

    await Promise.all(
      imageUrlArr.map((singleUrl) => deleteFileFromCloudinary(singleUrl)),
    );
  }

  let errorSources: TErrorSources[] = [];
  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";
  let stack: string | undefined = undefined;

  if (err instanceof z.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError) {
    ((statusCode = err.statusCode), (message = err.message));
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  } else if (err instanceof Error) {
    ((statusCode = status.INTERNAL_SERVER_ERROR), // can skip this
      (message = err.message));
    stack = err.stack;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  const errorResponse: TErrorResponse = {
    success: false,
    message: message,
    errorSources,
    error: envVariables.NODE_ENV === "development" ? err : undefined,
    stack: envVariables.NODE_ENV === "development" ? stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
};
