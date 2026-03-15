import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interfaces/requestUser.interface";
import { IUpdateAdminPayload } from "./admin.interface";

const getAllAdmin = async () => {
  const admins = await prisma.admin.findMany({
    // where: {
    //   isDeleted: false,
    // },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  });

  return admins;
};

const getAdminById = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
    include: {
      user: true,
    },
  });

  return admin;
};

const updateAdminById = async (
  adminId: string,
  updatePayload: IUpdateAdminPayload,
) => {
  const existAdmin = await prisma.admin.findUnique({
    where: {
      id: adminId,
    },
  });

  if (!existAdmin) {
    throw new AppError(status.NOT_FOUND, "Admin not found");
  }

  const { admin } = updatePayload;

  const updatedAdmin = await prisma.admin.update({
    where: {
      id: adminId,
    },
    data: {
      ...admin,
    },
  });
  return updatedAdmin;
};

const deleteAdminById = async (adminId: string, user: IRequestUser) => {
  const existAdmin = await prisma.admin.findUnique({
    where: {
      id: adminId,
      //   isDeleted: false,
    },
  });

  if (!existAdmin) {
    throw new AppError(status.NOT_FOUND, "Admin Or Super Admin not found");
  }
  if (existAdmin.id === user.userId) {
    throw new AppError(status.BAD_REQUEST, "You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id: adminId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: {
        id: existAdmin.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        id: existAdmin.userId,
      },
    });

    await tx.account.deleteMany({
      where: { userId: existAdmin.userId },
    });

    const admin = await getAdminById(adminId);

    return admin;
  });

  return result;
};

export const adminService = {
  getAllAdmin,
  getAdminById,
  updateAdminById,
  deleteAdminById,
};
