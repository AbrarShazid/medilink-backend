import status from "http-status";
import { Role, Speciality } from "../../../generated/prisma/client";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdmin, ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialities: Speciality[] = [];

  for (const specialityId of payload.specialtiesId) {
    const speciality = await prisma.speciality.findUnique({
      where: {
        id: specialityId,
      },
    });

    if (!speciality) {
      // throw new Error(`No speciality found with this id ${specialityId}`);
      throw new AppError(
        status.NOT_FOUND,
        `No speciality found with this id ${specialityId}`,
      );
    }

    specialities.push(speciality);
  }

  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (userExists) {
    // throw new Error("User with this email already exists");
    throw new AppError(
      status.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      password: payload.password,
      role: Role.DOCTOR,
      name: payload.doctor.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const doctorSpecialityData = specialities.map((singleSpeciality) => {
        return {
          doctorId: doctorData.id,
          specialityId: singleSpeciality.id,
        };
      });

      await tx.doctorSpeciality.createMany({
        data: doctorSpecialityData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },

        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          experience: true,
          gender: true,
          appointmentFee: true,
          qualification: true,
          currentWorkingPlace: true,
          designation: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          specialties: {
            select: {
              speciality: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      return doctor;
    });

    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

// --------create admin--------
const createAdmin = async (payload: ICreateAdmin) => {
  const userExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (userExists) {
    throw new AppError(
      status.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const adminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin,
        },
      });
      const admin = await tx.admin.findUnique({
        where: {
          id: adminData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
              image: true,
              isDeleted: true,
              deletedAt: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });

      return admin;
    });

    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

//create super admin

const createSuperAdmin = async (payload: ICreateAdmin) => {
  const userExist = await prisma.user.findUnique({
    where: {
      id: payload.admin.email,
    },
  });

  if (userExist) {
    throw new AppError(
      status.BAD_REQUEST,
      "User with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.admin.name,
      password: payload.password,
      role: Role.SUPER_ADMIN,
      email: payload.admin.email,
      needPasswordChange: true,
    },
  });

  try {
    const result = await prisma.$transaction(async (tx) => {
      const superAdminData = await tx.admin.create({
        data: {
          userId: userData.user.id,
          ...payload.admin,
        },
      });

      const superAdmin = await tx.admin.findUnique({
        where: {
          id: superAdminData.id,
        },
        include: {
          user: true,
        },
      });

      return superAdmin;
    });

    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw new AppError(status.BAD_REQUEST, "Cannot create");
  }
};

export const userService = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
