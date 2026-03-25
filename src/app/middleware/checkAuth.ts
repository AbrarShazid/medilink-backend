import { NextFunction, Request, Response } from "express";
import { Role, UserStatus } from "../../generated/prisma/enums";
import { cookieUtils } from "../utils/cookie";
import AppError from "../errorHelpers/AppError";
import status from "http-status";
import { prisma } from "../lib/prisma";
import { jwtUtils } from "../utils/jwt";
import { envVariables } from "../config/env";

export const checkAuth =
  (...authRoles: Role[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sessionToken = cookieUtils.getCookie(
        req,
        "better-auth.session_token",
      );

      if (!sessionToken) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! No session token provided.",
        );
      }
      if (sessionToken) {
        const sessionExist = await prisma.session.findFirst({
          where: {
            token: sessionToken,
            expiresAt: {
              gt: new Date(),
            },
          },
          include: {
            user: true,
          },
        });

        if (!sessionExist) {
          throw new AppError(status.UNAUTHORIZED, "No session found!");
        }

        if (sessionExist && sessionExist.user) {
          const user = sessionExist.user;
          const now = new Date();

          const expiresAt = new Date(sessionExist.expiresAt);
          const createdAt = new Date(sessionExist.createdAt);

          const sessionLifeTime = expiresAt.getTime() - createdAt.getTime();
          const timeRemaining = expiresAt.getTime() - now.getTime();

          const percentRemaining = (timeRemaining / sessionLifeTime) * 100;

          if (percentRemaining < 20) {
            res.setHeader("X-Session-Refresh", "true");
            res.setHeader("X-Session-Expires-At", expiresAt.toISOString());
            res.setHeader("X-Time-Remaining", timeRemaining.toString());
          }

          if (
            user.status === UserStatus.BLOCKED ||
            user.status === UserStatus.DELETED ||
            user.isDeleted
          ) {
            throw new AppError(
              status.UNAUTHORIZED,
              "User is blocked or deleted !",
            );
          }

          if (authRoles.length > 0 && !authRoles.includes(user.role)) {
            throw new AppError(status.UNAUTHORIZED, "User is unauthorized !");
          }
          req.user = {
            userId: user.id,
            role: user.role,
            email: user.email,
          };
        }
      }

      //access token
      const accessToken = cookieUtils.getCookie(req, "accessToken");
      if (!accessToken) {
        throw new AppError(status.UNAUTHORIZED, "No access token found!");
      }

      const verifiedToken = jwtUtils.verifyToken(
        accessToken,
        envVariables.ACCESS_TOKEN_SECRET,
      );

      if (!verifiedToken.success) {
        throw new AppError(
          status.UNAUTHORIZED,
          "Unauthorized access! Invalid access token.",
        );
      }

      // console.log("token data", verifiedToken);

      if (
        authRoles.length > 0 &&
        !authRoles.includes(verifiedToken.data!.userRole)
      ) {
        throw new AppError(
          status.FORBIDDEN,
          "Forbidden access! You do not have permission to access this resource.",
        );
      }

      next();
    } catch (error: any) {
      next(error);
    }
  };
