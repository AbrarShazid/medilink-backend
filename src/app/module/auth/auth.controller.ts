import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../shared/sendResponse";
import status from "http-status";
import { tokenUtils } from "../../utils/token";
import AppError from "../../errorHelpers/AppError";
import { envVariables } from "../../config/env";
import { auth } from "../../lib/auth";

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

//change password

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const session_token = req.cookies["better-auth.session_token"];
  const payload = req.body;

  const result = await authService.changePassword(payload, session_token);

  const { accessToken, refreshToken, token } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  tokenUtils.setBetterAuthSessionCookie(res, token as string);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Password Changed Successfully!",
    data: result,
  });
});

//log out user

const logOutUser = catchAsync(async (req: Request, res: Response) => {
  const session_token = req.cookies["better-auth.session_token"];

  const result = await authService.logOutUser(session_token);

  tokenUtils.clearAccessTokenCookie(res);
  tokenUtils.clearRefreshTokenCookie(res);
  tokenUtils.clearBetterAuthSessionCookie(res);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Log out successful",
    data: result,
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyEmail(email, otp);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Verification of email complete!",
  });
});
const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgetPassword(email);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: `Forget password otp sent to ${email}.`,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  const result = await authService.resetPassword(email, otp, newPassword);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reset password successfull",
  });
});
// /api/v1/auth/login/google?redirect=/profile<- which protected route user wants to go
const googleLogin = catchAsync((req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/dashboard";

  const encodedRedirectPath = encodeURIComponent(redirectPath as string);

  const callbackURL = `${envVariables.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;
  res.render("googleRedirect", {
    callbackURL: callbackURL,
    betterAuthUrl: envVariables.BETTER_AUTH_URL,
  });
});
const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/dashboard";

  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    return res.redirect(
      `${envVariables.FRONTEND_URL}/login?error=oauth_failed`,
    );
  }

  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_token=${sessionToken}`,
    },
  });

  if (!session) {
    return res.redirect(
      `${envVariables.FRONTEND_URL}/login?error=no_session_found`,
    );
  }

  if (!session.user) {
    return res.redirect(
      `${envVariables.FRONTEND_URL}/login?error=no_user_found`,
    );
  }

  const result = await authService.googleLoginSuccess(session);

  const { accessToken, refreshToken } = result;

  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);
  // ?redirect=//profile -> /profile
  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");
  const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

  res.redirect(`${envVariables.FRONTEND_URL}${finalRedirectPath}`);
});

const handleOAuthError = catchAsync((req: Request, res: Response) => {
  const error = (req.query.error as string) || "oauth_failed";
  res.redirect(`${envVariables.FRONTEND_URL}/login?error=${error}`);
});

export const authController = {
  registerPatient,
  logInUser,
  getMe,
  getNewToken,
  changePassword,
  logOutUser,
  verifyEmail,
  forgetPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
  handleOAuthError,
};
