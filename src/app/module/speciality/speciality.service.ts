import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: Speciality) => {
  const speciality = await prisma.speciality.create({
    data: payload,
  });
  return speciality;
};

const getAllSpeciality = async () => {
  const speciality = await prisma.speciality.findMany();
  return speciality;
};

const updateSpeciality = async (specialityId: string, payload: Speciality) => {
  const speciality = await prisma.speciality.update({
    where: {
      id: specialityId,
    },
    data: payload,
  });
  return speciality;
};

const deleteSpeciality = async (specialityId: string) => {
  const speciality = await prisma.speciality.delete({
    where: {
      id: specialityId,
    },
  });
  return speciality;
};

export const specialityService = {
  createSpeciality,
  getAllSpeciality,
  updateSpeciality,
  deleteSpeciality,
};
