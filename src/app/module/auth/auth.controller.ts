import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";

const registerPatient = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  const result = await authService.registerPatient(payload);

  const { token, accessToken, refreshToken, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Patient registered successfully",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const logInUser = catchAsync(async (req: Request, res: Response) => {
  const paylaod = req.body;

  const result = await authService.logInUser(paylaod);

  const { token, accessToken, refreshToken, ...rest } = result;
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Log in successfully!",
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const user = req.user!;
  const result = await authService.getMe(user);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Profile get success",
    data: result,
  });
});

const getNewToken = catchAsync(async (req: Request, res: Response) => {
  const oldRefreshToken = req.cookies.refreshToken;
  const oldSessionTokne = req.cookies["better-auth.session_token"];

  if (!oldRefreshToken) {
    throw new AppError(status.UNAUTHORIZED, "No refresh token found");
  }
  const result = await authService.getNewToken(
    oldRefreshToken,
    oldSessionTokne,
  );
  const { newAccessToken, newRefreshToken, newSessionTooken } = result;

  //set token to cookies
  tokenUtils.setAccessTokenCookie(res, newAccessToken);

  tokenUtils.setRefreshTokenCookie(res, newRefreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, newSessionTooken);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "New token generate success",
    data: result,
  });
});

export const authController = {
  registerPatient,
  logInUser,
  getMe,
  getNewToken
};
