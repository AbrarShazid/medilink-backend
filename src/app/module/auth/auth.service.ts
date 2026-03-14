import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";

interface IregirsterPatientData {
  name: string;
  email: string;
  password: string;
}
interface IlogInData {
  email: string;
  password: string;
}

const registerPatient = async (payload: IregirsterPatientData) => {
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

const logInUser = async (payload: IlogInData) => {
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

export const authService = {
  registerPatient,
  logInUser,
};
