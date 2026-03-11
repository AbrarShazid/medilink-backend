import { speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpeciality = async (payload: speciality) => {
  const speciality = await prisma.speciality.create({
    data: payload,
  });
  return speciality;
};

export const specialityService = {
  createSpeciality,
};
