import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { prisma } from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctor = async () => {
  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
      specialties: {
        include: {
          speciality: true,
        },
      },
    },
  });

  return doctors;
};

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
    include: {
      user: true,
      specialties: {
        include: {
          speciality: true,
        },
      },

      appointments: {
        include: {
          patient: true,
          schedule: true,
          prescription: true,
        },
      },
      doctorSchedules: {
        include: {
          schedule: true,
        },
      },
      reviews: true,
    },
  });
  return doctor;
};

const updateDoctorById = async (
  doctorId: string,
  updatePayload: IUpdateDoctorPayload,
) => {
  const existingDoctor = await prisma.doctor.findUnique({
    where: { id: doctorId, isDeleted: false },
  });
  if (!existingDoctor) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const { doctor: doctorData, specialties } = updatePayload;

  await prisma.$transaction(async (tx) => {
    //if there is doctor data to update
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          ...doctorData,
        },
      });
    }

    if (specialties && specialties.length > 0) {
      for (const speciality of specialties) {
        const { specialityId, shouldDelete } = speciality;
        if (shouldDelete) {
          await tx.doctorSpeciality.delete({
            where: {
              doctorId_specialityId: {
                doctorId: doctorId,
                specialityId: specialityId,
              },
            },
          });
        } else {
          await tx.doctorSpeciality.upsert({
            where: {
              doctorId_specialityId: {
                doctorId: doctorId,
                specialityId: specialityId,
              },
            },
            create: {
              doctorId,
              specialityId,
            },
            update: {},
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(doctorId);

  return doctor;
};

const deleteDoctorById = async (doctorId: string) => {
  const existDoctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  if (!existDoctor) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  // if doctor still available then delete
  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: {
        id: existDoctor.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: existDoctor.userId,
      },
    });

    await tx.doctorSpeciality.deleteMany({
      where: {
        doctorId: doctorId,
      },
    });
  });

  return { message: "Doctor deleted successfully" };
};

export const doctorService = {
  getAllDoctor,
  getDoctorById,
  updateDoctorById,
  deleteDoctorById,
};
