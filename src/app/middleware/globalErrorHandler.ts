import { NextFunction, Request, Response } from "express";
import { envVariables } from "../config/env";
import status from "http-status";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (envVariables.NODE_ENV === "development") {
    console.log("Error from global error handler ", err);
  }

  let statusCode: number = status.INTERNAL_SERVER_ERROR;
  let message: string = "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
