import { prisma } from "../../lib/prisma";

const getAllDoctor = async () => {
  const doctors = await prisma.doctor.findMany({
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
  return doctor;
};

export const doctorService = {
  getAllDoctor,
  getDoctorById,
};
