import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import {
  IChangePasswordPayload,
  ILogInData,
  IRegirsterPatientData,
} from "./auth.interface";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { jwtUtils } from "../../utils/jwt";
import { envVariables } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// register
const registerPatient = async (payload: IRegirsterPatientData) => {
  const data = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
  });

  if (!data.user) {
    throw new AppError(status.BAD_REQUEST, "Failed to register patient");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });

      return patientTx;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: data.user.id,
      userName: data.user.name,
      userEmail: data.user.email,
      userRole: data.user.role,
      userStatus: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });
    const refreshToken = tokenUtils.getRefreshToken({
      userId: data.user.id,
      userName: data.user.name,
      userEmail: data.user.email,
      userRole: data.user.role,
      userStatus: data.user.status,
      isDeleted: data.user.isDeleted,
      emailVerified: data.user.emailVerified,
    });

    return {
      ...data,
      accessToken,
      refreshToken,
      patient,
    };
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};
//log in user
const logInUser = async (payload: ILogInData) => {
  const data = await auth.api.signInEmail({
    body: {
      email: payload.email,
      password: payload.password,
    },
  });

  if (data.user.isDeleted || data.user.status === UserStatus.DELETED) {
    throw new AppError(status.NOT_FOUND, "User is deleted");
  }

  if (data.user.status === UserStatus.BLOCKED) {
    throw new AppError(status.FORBIDDEN, "User is blocked");
  }

  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    userName: data.user.name,
    userEmail: data.user.email,
    userRole: data.user.role,
    userStatus: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: data.user.id,
    userName: data.user.name,
    userEmail: data.user.email,
    userRole: data.user.role,
    userStatus: data.user.status,
    isDeleted: data.user.isDeleted,
    emailVerified: data.user.emailVerified,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

// get profile

const getMe = async (user: IRequestUser) => {
  const profile = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: {
        include: {
          appointments: true,
          medicalReports: true,
          patientHealthData: true,
          prescriptions: true,
          reviews: true,
        },
      },
      doctor: {
        include: {
          specialties: true,
          appointments: true,
          doctorSchedules: true,
          prescriptions: true,
          reviews: true,
        },
      },

      admin: true,
    },
  });

  if (!profile) {
    throw new AppError(status.NOT_FOUND, "Profile not found!");
  }

  return profile;
};

// get token by refreshToken

const getNewToken = async (refreshToken: string, session_token: string) => {
  const isExistSession = await prisma.session.findUnique({
    where: {
      token: session_token,
    },
    include: {
      user: true,
    },
  });

  if (!isExistSession) {
    throw new AppError(status.UNAUTHORIZED, "Invalid session token!");
  }

  const validateRefreshToken = jwtUtils.verifyToken(
    refreshToken,
    envVariables.REFRESH_TOKEN_SECRET,
  );

  if (!validateRefreshToken.success || validateRefreshToken.error) {
    throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = validateRefreshToken.data as JwtPayload;

  const newAccessToken = tokenUtils.getAccessToken({
    userId: data.userId,
    userName: data.name,
    userEmail: data.email,
    userRole: data.role,
    userStatus: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });
  const newRefreshToken = tokenUtils.getRefreshToken({
    userId: data.userId,
    userName: data.name,
    userEmail: data.email,
    userRole: data.role,
    userStatus: data.status,
    isDeleted: data.isDeleted,
    emailVerified: data.emailVerified,
  });

  const updateSessionToken = await prisma.session.update({
    where: {
      token: session_token,
    },
    data: {
      token: session_token,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  const newSessionTooken = updateSessionToken.token;

  return {
    newAccessToken,
    newRefreshToken,
    newSessionTooken,
  };
};

//change password
const changePassword = async (
  payload: IChangePasswordPayload,
  session_token: string,
) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${session_token}`,
    }),
  });

  if (!session) {
    throw new AppError(status.UNAUTHORIZED, "Invalid Session!");
  }

  const { currentPassword, newPassword } = payload;
  const result = await auth.api.changePassword({
    body: {
      newPassword: newPassword,
      currentPassword: currentPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${session_token}`,
    }),
  });

  const accessToken = tokenUtils.getAccessToken({
    userId: result.user.id,
    userName: result.user.name,
    userEmail: result.user.email,
    userRole: result.user.role,
    userStatus: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,
  });
  const refreshToken = tokenUtils.getRefreshToken({
    userId: result.user.id,
    userName: result.user.name,
    userEmail: result.user.email,
    userRole: result.user.role,
    userStatus: result.user.status,
    isDeleted: result.user.isDeleted,
    emailVerified: result.user.emailVerified,
  });

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

export const authService = {
  registerPatient,
  logInUser,
  getMe,
  getNewToken,
  changePassword,
};
